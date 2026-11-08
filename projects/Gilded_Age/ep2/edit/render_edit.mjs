// Render a chapter edit, timed to its narration.
//   node render_edit.mjs ch01 <dir> [startFrame] [endFrame]     frames f0000.png ... (30 fps)
//   node render_edit.mjs ch01 --stills 2.5,8,20 <out_prefix>     JPEG stills at those chapter times
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)('playwright');
import path from 'node:path'; import fs from 'node:fs'; import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const [key, a1, a2, a3] = process.argv.slice(2);
const audio = path.join(here, '..', 'public', 'audio');
const wf = fs.readdirSync(audio).find((f) => f.startsWith(key + '_') && f.endsWith('.words.json'));
const ch = wf ? wf.replace('.words.json', '') : key;   // cards with no narration (the title) have no words file
let words = wf ? JSON.parse(fs.readFileSync(path.join(audio, wf), 'utf8')) : null;
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
page.on('pageerror', (e) => { console.error('page error:', e.message); process.exit(1); });
await page.goto('file://' + path.join(here, 'edit.html'));
if (!words) words = {duration: await page.evaluate((k) => EDITS[k]().dur, key), words: []};
await page.evaluate(([c, w]) => { window.WORDS = {[c]: w}; }, [ch, words]);
const shoot = async (T, file, type) => { await page.evaluate(([k, t]) => window.drawEdit(k, t), [key, T]); await page.locator('#stage').screenshot({path: file, type, ...(type === 'jpeg' ? {quality: 82} : {})}); };
if (a1 === '--stills') {
  for (const T of a2.split(',').map(Number)) await shoot(T, `${a3}_${T.toFixed(1)}.jpg`, 'jpeg');
} else {
  fs.mkdirSync(a1, {recursive: true});
  const N = Math.ceil(words.duration * 30), s = Number(a2 ?? 0), e = Math.min(N, Number(a3 ?? N));
  for (let i = s; i < e; i++) await shoot(i / 30, path.join(a1, `f${String(i).padStart(4, '0')}.png`), 'png');
  console.log('done', key, s, e);
}
await browser.close();
