// Contact audit for the drawn shots of a chapter: node audit_contacts.mjs ch01 [step]  -> per contact kind, the worst error (px, world)
// over the chapter, from lookdev/ep3.js's E3LOG (hands on handles, hand-to-hand pairs, planted feet, held things). 'move' and
// 'swing' entries are hands and feet in flight, not contacts, and are skipped.
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)('playwright');
import path from 'node:path'; import fs from 'node:fs'; import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const [key, stepArg] = process.argv.slice(2), step = Number(stepArg || 0.25);
const audio = path.join(here, '..', 'public', 'audio');
const wf = fs.readdirSync(audio).find((f) => f.startsWith(key + '_') && f.endsWith('.words.json'));
const ch = wf.replace('.words.json', ''), words = JSON.parse(fs.readFileSync(path.join(audio, wf), 'utf8'));
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
await page.goto('file://' + path.join(here, 'edit.html'));
await page.evaluate(([c, w]) => { window.WORDS = {[c]: w}; }, [ch, words]);
const dur = await page.evaluate((k) => EDITS[k]().dur, key), worst = {};
for (let T = 0; T < dur; T += step) {
  const log = await page.evaluate(([k, t]) => window.drawEdit(k, t).then(() => (window.E3LOG || []).map((e) => [e.kind, e.name, e.err])), [key, T]);
  for (const [kind, name, err] of log) { if (kind === 'move' || kind === 'swing') continue; const w = worst[kind] || (worst[kind] = {err: 0, n: 0});
    w.n++; if (err > w.err) Object.assign(w, {err: +err.toFixed(3), name, T: +T.toFixed(2)}); }
}
console.log(JSON.stringify(worst, null, 1));
await browser.close();
