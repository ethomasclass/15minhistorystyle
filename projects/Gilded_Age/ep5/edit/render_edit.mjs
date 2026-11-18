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
// SCALE=0.6667 renders the 1920 x 1080 stage straight to 1280 x 720 (review renders: a third of the pixels, a third of the disk)
const page = await browser.newPage({viewport: {width: 1920, height: 1080}, deviceScaleFactor: Number(process.env.SCALE || 1)});
page.on('pageerror', (e) => { console.error('page error:', e.message); process.exit(1); });
await page.goto('file://' + path.join(here, 'edit.html'));
if (!words) words = {duration: await page.evaluate((k) => EDITS[k]().dur, key), words: []};
await page.evaluate(([c, w]) => { window.WORDS = {[c]: w}; }, [ch, words]);
const shoot = async (T, file, type) => { // retried: a long render can hit a one-off "Unable to capture screenshot"
  for (let k = 0; ; k++) { try { await page.evaluate(([c, t]) => window.drawEdit(c, t), [key, T]); await page.locator('#stage').screenshot({path: file, type, ...(type === 'jpeg' ? {quality: process.env.FRAMEJPG ? 94 : 82} : {})}); return; }
    catch (e) { if (k >= 3) throw e; console.error('retry', T, e.message.split('\n')[0]); await new Promise((r) => setTimeout(r, 1000)); } } };
const editDur = await page.evaluate((k) => EDITS[k]().dur, key);   // the chapter's length, with any held tail after the last word
if (a1 === '--dur') { console.log(editDur); await browser.close(); process.exit(0); }
if (a1 === '--stills') {
  for (const T of a2.split(',').map(Number)) await shoot(T, `${a3}_${T.toFixed(1)}.jpg`, 'jpeg');
} else {
  fs.mkdirSync(a1, {recursive: true});
  const N = Math.ceil(editDur * 30), s = Number(a2 ?? 0), e = Math.min(N, Number(a3 ?? N));
  // FRAMEJPG=1: JPEG frames (quality 94; a fraction of the disk of PNG at 1080p)
  const jpg = !!process.env.FRAMEJPG;
  for (let i = s; i < e; i++) await shoot(i / 30, path.join(a1, `f${String(i).padStart(4, '0')}.${jpg ? 'jpg' : 'png'}`), jpg ? 'jpeg' : 'png');
  console.log('done', key, s, e);
}
await browser.close();
