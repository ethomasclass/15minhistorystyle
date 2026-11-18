// Text audit for a chapter edit: node audit_text.mjs ch01 [step=0.2] [margin]
//   margin: the safe area as a fraction of the frame (0.08 = 154 px left/right, 86 px top/bottom: the Ep 5 rule); default 96/54 px.
// Reports (one line each):
//   OUT      a text partly in frame and outside the margin for more than 0.5 s (with a margin; any time without one)
//   SHORT    a text on screen less than 2.5 s in all (unless it is still on screen at the chapter's end: the baton card)
//   OVERLAP  a carried text (layer C) on the current shot's text
// then the shot list. Visible = effective opacity > 0.3.
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)('playwright');
import path from 'node:path'; import fs from 'node:fs'; import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const [key, stepArg, marginArg] = process.argv.slice(2), step = Number(stepArg || 0.2);
const MG = marginArg ? Number(marginArg) : 0, MX = MG ? 1920 * MG : 96, MY = MG ? 1080 * MG : 54;
const audio = path.join(here, '..', 'public', 'audio');
const wf = fs.readdirSync(audio).find((f) => f.startsWith(key + '_') && f.endsWith('.words.json'));
const ch = wf.replace('.words.json', ''), words = JSON.parse(fs.readFileSync(path.join(audio, wf), 'utf8'));
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
page.on('pageerror', (e) => { console.error('page error:', e.message); process.exit(1); });
await page.goto('file://' + path.join(here, 'edit.html'));
await page.evaluate(([c, w]) => { window.WORDS = {[c]: w}; }, [ch, words]);
const items = {}, overlaps = {};
const dur = await page.evaluate((k) => EDITS[k]().dur, key);
let lastT = 0;
for (let T = 0; T < dur; T += step) {
  lastT = T;
  await page.evaluate(([k, t]) => window.drawEdit(k, t), [key, T]);
  const found = await page.evaluate(() => {
    const out = [], eff = (el) => { let o = 1; for (let e = el; e && e.id !== 'stage'; e = e.parentElement) { const s = getComputedStyle(e); if (s.display === 'none') return 0; o *= Number(s.opacity); if (e.getAttribute && e.getAttribute('opacity')) o *= Number(e.getAttribute('opacity')); } return getComputedStyle(el).visibility === 'hidden' ? 0 : o; };
    for (const el of document.querySelectorAll('#stage *')) {
      if (/^(style|STYLE|defs)$/.test(el.tagName) || el.closest('defs')) continue;
      const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
      if (own.length < 2 || /^&?nbsp;?$/.test(own) || !/[A-Za-z0-9]/.test(own)) continue;
      const o = eff(el); if (o < 0.3) continue;
      const rg = document.createRange(); rg.selectNodeContents(el); const r = rg.getBoundingClientRect(); if (r.width < 2) continue;
      out.push({t: own.slice(0, 70), x0: r.left, x1: r.right, y0: r.top, y1: r.bottom, c: !!el.closest('#C')});
    }
    return out;
  });
  for (const a of found) if (a.c) for (const b of found) if (!b.c && a.t !== b.t && a.x0 < b.x1 - 4 && b.x0 < a.x1 - 4 && a.y0 < b.y1 - 4 && b.y0 < a.y1 - 4) { const k = a.t + ' || ' + b.t; if (!overlaps[k]) overlaps[k] = T.toFixed(1); }
  const seenNow = new Set();
  for (const f of found) {
    if (seenNow.has(f.t)) continue; seenNow.add(f.t);
    const it = items[f.t] || (items[f.t] = {text: f.t, frames: 0, first: T, last: T, out: [], outT: 0});
    it.frames++; it.last = T;
    const bad = f.x0 < MX || f.x1 > 1920 - MX || f.y0 < MY || f.y1 > 1080 - MY, seen = f.x1 > 0 && f.x0 < 1920 && f.y1 > 0 && f.y0 < 1080;
    if (bad && seen) { it.outT += step; if (it.out.length < 3) it.out.push(`${T.toFixed(1)}s [${f.x0.toFixed(0)},${f.y0.toFixed(0)},${f.x1.toFixed(0)},${f.y1.toFixed(0)}]`); }
  }
}
const shots = await page.evaluate((k) => { editFrame(k, 0); return cache[k].shots.map((s) => [+s.a.toFixed(2), +s.b.toFixed(2)]); }, key);
await browser.close();
const rep = [`${key}: ${dur.toFixed(2)} s, ${Object.keys(items).length} texts, margin ${MG || '96/54 px'}`];
for (const it of Object.values(items)) {
  const secs = it.frames * step, atEnd = it.last >= lastT - 1e-6;
  if (it.out.length && (!MG || it.outT > 0.5)) rep.push(`  OUT      "${it.text}" ${it.outT.toFixed(1)} s: ${it.out.join(' ')}`);
  if (secs < 2.5 && !atEnd) rep.push(`  SHORT    "${it.text}" ${secs.toFixed(1)} s (${it.first.toFixed(1)} to ${it.last.toFixed(1)})`);
}
for (const [k, T] of Object.entries(overlaps)) rep.push(`  OVERLAP  ${k} (from ${T} s)`);
if (process.env.LIST) for (const it of Object.values(items)) rep.push(`  text     "${it.text}" ${(it.frames * step).toFixed(1)} s (${it.first.toFixed(1)} to ${it.last.toFixed(1)})`);
rep.push('  shots ' + JSON.stringify(shots));
console.log(rep.join('\n'));
