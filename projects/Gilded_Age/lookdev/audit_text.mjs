// Text audit for lookdev clips (adapted from ep2/edit/audit_text.mjs):  node audit_text.mjs <clip> [step=0.2]
// Samples the clip, finds every visible text element (effective opacity > 0.3), and reports:
//   OUT      any time a text box leaves the title-safe area (96 px left/right, 54 px top/bottom of 1920 x 1080)
//   OVERLAP  any two different visible texts whose boxes overlap by more than 4 px (first time seen)
//   SHORT    texts on screen less than 2.5 s (unless still on screen at the end of the clip)
//   HOLD     how long the final frame's full set of texts has been on screen unchanged
// Boxes are each text's font box (ascent to descent) mapped through its transform, so rotated text is checked as a rotated box.
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)('playwright');
import path from 'node:path'; import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const [clip, stepArg] = process.argv.slice(2), step = Number(stepArg || 0.2);
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
await page.goto('file://' + path.join(here, 'bridge.html'));
const dur = await page.evaluate((c) => window.CLIPS[c].sec, clip);
const items = {}, overlaps = {}, sets = [];
for (let T = 0; T < dur - 1e-6; T += step) {
  await page.evaluate((cfg) => window.draw(cfg), {clip, t: T});
  const found = await page.evaluate(() => {
    const out = [], eff = (el) => { let o = 1; for (let e = el; e && e.id !== 'stage'; e = e.parentElement) { const s = getComputedStyle(e); if (s.display === 'none') return 0; o *= Number(s.opacity); if (e.getAttribute && e.getAttribute('opacity')) o *= Number(e.getAttribute('opacity')); } return o; };
    for (const el of document.querySelectorAll('#stage text')) {
      const txt = el.textContent.trim(); if (txt.length < 2) continue; // single glyphs ($ on coins) are icons, not text
      const o = eff(el); if (o < 0.3) continue;
      const b = el.getBBox(), m = el.getScreenCTM(); if (b.width < 2) continue;
      const q = [[b.x, b.y], [b.x + b.width, b.y], [b.x + b.width, b.y + b.height], [b.x, b.y + b.height]].map(([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
      out.push({t: txt.slice(0, 80), q, x0: Math.min(...q.map((p) => p[0])), x1: Math.max(...q.map((p) => p[0])), y0: Math.min(...q.map((p) => p[1])), y1: Math.max(...q.map((p) => p[1]))});
    }
    return out;
  });
  // rotated boxes: separating-axis test on the two quads, each shrunk 4 px toward its centre
  const shrink = (q) => { const cx = q.reduce((s, p) => s + p[0], 0) / 4, cy = q.reduce((s, p) => s + p[1], 0) / 4; return q.map(([x, y]) => { const d = Math.hypot(x - cx, y - cy) || 1; return [x - (x - cx) / d * 4, y - (y - cy) / d * 4]; }); };
  const hits = (A, B) => { for (const P of [A, B]) for (let i = 0; i < 4; i++) { const [x1, y1] = P[i], [x2, y2] = P[(i + 1) % 4], nx = y2 - y1, ny = x1 - x2; const pa = A.map(([x, y]) => x * nx + y * ny), pb = B.map(([x, y]) => x * nx + y * ny); if (Math.max(...pa) < Math.min(...pb) || Math.max(...pb) < Math.min(...pa)) return false; } return true; };
  for (let i = 0; i < found.length; i++) for (let j = i + 1; j < found.length; j++) {
    const a = found[i], b = found[j];
    if (a.t !== b.t && hits(shrink(a.q), shrink(b.q))) { const k = a.t + ' || ' + b.t; if (!overlaps[k]) overlaps[k] = T.toFixed(1); }
  }
  for (const f of found) {
    const it = items[f.t] || (items[f.t] = {text: f.t, frames: 0, first: T, last: T, out: []});
    it.frames++; it.last = T;
    const bad = f.x0 < 96 || f.x1 > 1824 || f.y0 < 54 || f.y1 > 1026;
    if (bad && it.out.length < 3) it.out.push(`${T.toFixed(1)}s [${f.x0.toFixed(0)},${f.y0.toFixed(0)},${f.x1.toFixed(0)},${f.y1.toFixed(0)}]`);
  }
  sets.push([T, found.map((f) => f.t).sort().join('|')]);
}
await browser.close();
const lastT = sets[sets.length - 1][0];
let hold = 0; for (let i = sets.length - 1; i >= 0 && sets[i][1] === sets[sets.length - 1][1]; i--) hold = lastT - sets[i][0] + step;
const report = [`${clip}: ${dur} s, ${Object.keys(items).length} texts, final set held ${hold.toFixed(1)} s`];
for (const it of Object.values(items)) {
  const secs = it.frames * step, atEnd = it.last >= lastT - 1e-6;
  if (it.out.length) report.push(`  OUT      "${it.text}" ${it.out.join(' ')}`);
  if (secs < 2.5 && !atEnd) report.push(`  SHORT    "${it.text}" ${secs.toFixed(1)} s (${it.first.toFixed(1)} to ${it.last.toFixed(1)})`);
}
for (const [k, T] of Object.entries(overlaps)) report.push(`  OVERLAP  ${k} (from ${T} s)`);
console.log(report.join('\n'));
