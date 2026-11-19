// Contact audit for the Thanksgiving drawn scenes, after the Gilded Age's ep3/ep5 edit/audit_contacts.mjs:
//   node audit_tg_contacts.mjs [clip ...] [--fps 30] [--json out.json] [--dir lookdev_dir]
// Renders every frame of each clip (no screenshots: the scene functions only) and reads E3LOG (ep3.js E3K + tg_contacts.js TGK).
// Per contact kind: the worst error in px (world units = screen px at zoom 1), where and when, and how many frames are over 2 px.
// 'move' and 'swing' are hands and feet in flight and are skipped. 'sole' entries are not errors themselves: a sole within 1.5 px
// of its ground line in two frames running is planted, and any sideways movement between them is reported as 'slide' (px a frame).
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)('playwright');
import path from 'node:path'; import fs from 'node:fs'; import {fileURLToPath} from 'node:url';
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : d; };
const fps = Number(opt('--fps', 30)), out = opt('--json', null), dir = opt('--dir', path.dirname(fileURLToPath(import.meta.url)));
const ALL = ['tg_eel_river', 'tg_turtle_dock', 'tg_dining_hall', 'tg_victorian_kitchen', 'tg_1950s_kitchen', 'tg_table_3d'];
const clips = args.length ? args : ALL;
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
page.on('pageerror', (e) => console.log('PAGE ERROR', e.message));
await page.goto('file://' + path.join(dir, 'bridge.html'));
const report = {};
for (const clip of clips) {
  const sec = await page.evaluate((c) => CLIPS[c].sec, clip), worst = {}, prev = {}, bump = (kind, err, name, T) => {
    const w = worst[kind] || (worst[kind] = {err: 0, n: 0, over2: 0, frames: new Set()}); w.n++; if (err > 2) { w.over2++; w.frames.add(T); }
    if (err > w.err) Object.assign(w, {err: +err.toFixed(2), name, T: +T.toFixed(3)});
    const by = w.by || (w.by = {}); if (!(name in by) || err > by[name]) by[name] = err; };
  for (let f = 0; f <= Math.round(sec * fps); f++) {
    const T = f / fps;
    const log = await page.evaluate(([c, t]) => { E3LOG.length = 0; CLIPS[c].render(t); return E3LOG.map((e) => [e.kind, e.name, e.err, e.got, e.gy]); }, [clip, T]);
    const now = {};
    for (const [kind, name, err, got, gy] of log) {
      if (kind === 'move' || kind === 'swing') continue;
      if (kind === 'sole') { const down = Math.abs(got[1] - gy) < 1.5; now[name] = {down, x: got[0]};
        const p = prev[name]; if (down && p && p.down) bump('slide', Math.abs(got[0] - p.x), name, T); continue; }
      bump(kind, err, name, T);
    }
    for (const k of Object.keys(prev)) delete prev[k]; Object.assign(prev, now);
  }
  for (const w of Object.values(worst)) { w.framesOver2 = w.frames.size; delete w.frames;
    w.top = Object.entries(w.by).filter(([, e]) => e > 2).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([n, e]) => n + ' ' + e.toFixed(1)).join(', '); delete w.by; }
  report[clip] = worst;
  console.log('\n' + clip); for (const [k, w] of Object.entries(worst)) console.log(`  ${k.padEnd(8)} worst ${String(w.err).padStart(7)} px  (${w.name} @ ${w.T}s)  frames over 2 px: ${w.framesOver2}${w.top ? '  | ' + w.top : ''}`);
}
if (out) fs.writeFileSync(out, JSON.stringify(report, null, 1));
await browser.close();
