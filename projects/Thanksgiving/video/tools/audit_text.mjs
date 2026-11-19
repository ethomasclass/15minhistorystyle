// Reading-time audit (ported from the Gilded Age ep5/edit/audit_text.mjs to Remotion):
//   node tools/audit_text.mjs Ch01,Ch02 [everyNth=3]        (LIST=1 also lists every text; JSON=path writes the runs)
// Renders every Nth frame with the `audit` input prop (src/kit/tg_audit.tsx logs what is fully readable on each frame) and turns the
// samples into runs: each continuous stretch a piece of text, or an archival document, is in full view.
// Flags:
//   SHORT  a text run shorter than its minimum: 2.5 s, plus 0.25 s per word beyond 5 words
//   DOC    a document / print (img/arch/..., or a placeholder's file name) held still (moving < 1 px a frame) for less than 3 s
// Runs still on screen at the chapter's last sampled frame are not flagged (they carry into the next piece).
import {bundle} from '@remotion/bundler';
import {renderFrames, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
const ids = process.argv[2].split(',');
const nth = Number(process.argv[3] || 3);
const serveUrl = await bundle({entryPoint: path.resolve(process.env.ENTRY || 'src/index.ts')});
const browserExecutable = process.env.REMOTION_CHROME || null;
const inputProps = {audit: true};
const need = (k0) => { const k = k0.replace(/ @.*$/, ''); const n = k.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length; return 2.5 + 0.25 * Math.max(0, n - 5); };
const all = {};
let total = 0;
for (const id of ids) {
  const composition = await selectComposition({serveUrl, id, browserExecutable, inputProps});
  const fps = composition.fps, N = composition.durationInFrames;
  const samples = new Map();
  const outputDir = path.resolve('out/audit_frames');
  fs.mkdirSync(outputDir, {recursive: true});
  await renderFrames({composition, serveUrl, inputProps, browserExecutable, outputDir, imageFormat: 'none', everyNthFrame: nth, concurrency: Number(process.env.CONC || 4),
    timeoutInMilliseconds: 240000, logLevel: 'error', onStart: () => {}, onFrameUpdate: () => {},
    onBrowserLog: (log) => { if (log.text.startsWith('AUDIT ')) { const d = JSON.parse(log.text.slice(6)); samples.set(d.f, d.hits); } }});
  const frames = [...samples.keys()].sort((a, b) => a - b), lastF = frames[frames.length - 1];
  // runs per key: consecutive samples (no sample missing) with the key present
  const open = new Map(), runs = [];
  for (const f of frames) {
    const now = new Map();
    // a ticking counter (-2%, -12%, ...) is one text: digits are not part of the key
    for (const h0 of samples.get(f)) { const h = {...h0, label: h0.k, k: h0.doc ? h0.k : h0.k.includes(' @') ? '#' + h0.k.slice(h0.k.indexOf(' @')) : h0.k.replace(/\d+([.,]\d+)?/g, '#')}; if (!now.has(h.k)) now.set(h.k, h); }
    for (const [k, r] of open) if (!now.has(k)) { runs.push(r); open.delete(k); }
    for (const [k, h] of now) {
      const r = open.get(k);
      if (!r) { open.set(k, {k, label: h.label, doc: !!h.doc, f0: f, f1: f, held: 0, prev: h}); continue; }
      const mv = Math.hypot(h.x + h.w / 2 - (r.prev.x + r.prev.w / 2), h.y + h.h / 2 - (r.prev.y + r.prev.h / 2)) / nth, sc = Math.abs(h.w / r.prev.w - 1) / nth;
      if (mv < 1 && sc < 0.0015) r.held += nth;
      r.f1 = f; r.prev = h; r.label = h.label;
    }
  }
  for (const r of open.values()) runs.push(r);
  const rows = [];
  for (const r of runs) {
    const secs = (r.f1 - r.f0 + nth) / fps, held = (r.held + nth) / fps, atEnd = r.f1 >= lastF;
    const rec = {id, k: r.label.replace(/ @.*$/, ''), doc: r.doc, from: +(r.f0 / fps).toFixed(2), to: +((r.f1 + nth) / fps).toFixed(2), secs: +secs.toFixed(2), held: +held.toFixed(2), atEnd};
    if (r.doc) { if (held < 3 && !atEnd) rec.flag = 'DOC'; }
    else if (secs < need(r.label) - 1e-6 && !atEnd) rec.flag = 'SHORT';
    rows.push(rec);
  }
  rows.sort((a, b) => a.from - b.from);
  const bad = rows.filter((r) => r.flag);
  total += bad.length;
  all[id] = rows;
  console.log(`${id}: ${(N / fps).toFixed(1)} s, ${rows.length} runs (${rows.filter((r) => r.doc).length} documents), ${bad.length} flagged`);
  for (const r of bad) console.log(`  ${r.flag.padEnd(5)}  ${r.from.toFixed(1)}–${r.to.toFixed(1)} s  ${r.doc ? `held ${r.held.toFixed(1)} s of ${r.secs.toFixed(1)}` : `${r.secs.toFixed(1)} s (needs ${need(r.k).toFixed(2)})`}  "${r.k}"`);
  if (process.env.LIST) for (const r of rows) console.log(`  ${r.doc ? 'doc ' : 'text'}   ${r.from.toFixed(1)}–${r.to.toFixed(1)} s  ${r.secs.toFixed(1)} s${r.doc ? ` (held ${r.held.toFixed(1)})` : ''}  "${r.k}"`);
}
console.log(`TOTAL flagged: ${total}`);
if (process.env.JSON) fs.writeFileSync(process.env.JSON, JSON.stringify(all, null, 1));
fs.rmSync(serveUrl, {recursive: true, force: true});
