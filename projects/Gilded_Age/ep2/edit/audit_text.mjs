// Text audit: node audit_text.mjs ch01 [step]  -> JSON lines, one per text element: its text, seconds on screen (visible,
// opacity > 0.3), first/last time, and any time its box leaves the title-safe area (96 px left/right, 54 px top/bottom).
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)('playwright');
import path from 'node:path'; import fs from 'node:fs'; import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const [key, stepArg] = process.argv.slice(2), step = Number(stepArg || 0.2);
const audio = path.join(here, '..', 'public', 'audio');
const wf = fs.readdirSync(audio).find((f) => f.startsWith(key + '_') && f.endsWith('.words.json'));
const ch = wf.replace('.words.json', ''), words = JSON.parse(fs.readFileSync(path.join(audio, wf), 'utf8'));
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
await page.goto('file://' + path.join(here, 'edit.html'));
await page.evaluate(([c, w]) => { window.WORDS = {[c]: w}; }, [ch, words]);
const items = {};
const dur = await page.evaluate((k) => EDITS[k]().dur, key);
for (let T = 0; T < dur; T += step) {
  await page.evaluate(([k, t]) => window.drawEdit(k, t), [key, T]);
  const found = await page.evaluate(() => {
    const out = [], eff = (el) => { let o = 1; for (let e = el; e && e.id !== 'stage'; e = e.parentElement) { const s = getComputedStyle(e); o *= Number(s.opacity); if (e.getAttribute && e.getAttribute('opacity')) o *= Number(e.getAttribute('opacity')); if (s.display === 'none' || s.visibility === 'hidden') return 0; } return o; };
    for (const el of document.querySelectorAll('#stage *')) {
      const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
      if (!own || el.tagName === 'style' || el.tagName === 'STYLE') continue;
      const o = eff(el); if (o < 0.3) continue;
      const rg = document.createRange(); rg.selectNodeContents(el); const r = rg.getBoundingClientRect(); if (r.width < 2) continue;
      out.push({t: own.slice(0, 70), x0: r.left, x1: r.right, y0: r.top, y1: r.bottom});
    }
    return out;
  });
  for (const f of found) {
    const it = items[f.t] || (items[f.t] = {text: f.t, frames: 0, first: T, last: T, out: []});
    it.frames++; it.last = T;
    const bad = f.x0 < 96 || f.x1 > 1824 || f.y0 < 54 || f.y1 > 1026;
    if (bad && it.out.length < 3) it.out.push(`${T.toFixed(1)}s [${f.x0.toFixed(0)},${f.y0.toFixed(0)},${f.x1.toFixed(0)},${f.y1.toFixed(0)}]`);
  }
}
const shots = await page.evaluate((k) => { editFrame(k, 0); return cache[k].shots.map((s) => [s.a, s.b]); }, key);
console.log(JSON.stringify({shots}));
for (const it of Object.values(items)) console.log(JSON.stringify({...it, secs: +(it.frames * step).toFixed(1)}));
await browser.close();
