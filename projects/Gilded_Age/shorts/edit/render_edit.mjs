// Render a short, timed to its narration, at 1080x1920.
//   node render_edit.mjs s1 <dir> [startFrame] [endFrame]     frames f0000.png ... (30 fps)
//   FRAMEJPG=1 node render_edit.mjs s3 <dir> ...              JPEG frames (quality 94) instead of PNG, for tight disks
//   node render_edit.mjs s1 --stills 2.5,8,20 <out_prefix>     JPEG stills at those times
import {createRequire} from 'node:module';
import path from 'node:path'; import fs from 'node:fs'; import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const {chromium} = createRequire(path.join(here, '../../ep1/edit/render_edit.mjs'))('playwright');
const [key, a1, a2, a3] = process.argv.slice(2);
const audio = path.join(here, '..', 'public', 'audio');
const wf = fs.readdirSync(audio).find((f) => f.startsWith(key + '_') && f.endsWith('.words.json'));
const ch = wf.replace('.words.json', '');
const words = JSON.parse(fs.readFileSync(path.join(audio, wf), 'utf8'));
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1080, height: 1920}});
page.on('pageerror', (e) => { console.error('page error:', e.message); process.exit(1); });
await page.goto('file://' + path.join(here, 'edit.html'));
await page.evaluate(([c, w]) => { window.WORDS = {[c]: w}; }, [ch, words]);
const shoot = async (T, file, type) => { await page.evaluate(([k, t]) => window.drawEdit(k, t), [key, T]); await page.locator('#stage').screenshot({path: file, type, ...(type === 'jpeg' ? {quality: file.includes('/f') && process.env.FRAMEJPG ? 94 : 82} : {})}); };
if (a1 === '--cover') {           // node render_edit.mjs s3 --cover <out.jpg>   (window.COVERS[key])
  await page.evaluate((k) => { document.getElementById('A').innerHTML = window.COVERS[k](); document.getElementById('B').innerHTML = ''; document.getElementById('CAP').innerHTML = ''; }, key);
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
  await page.locator('#stage').screenshot({path: a2, type: 'jpeg', quality: 92});
} else if (a1 === '--stills') {
  for (const T of a2.split(',').map(Number)) await shoot(T, `${a3}_${T.toFixed(1)}.jpg`, 'jpeg');
} else {
  fs.mkdirSync(a1, {recursive: true});
  const N = Math.ceil(words.duration * 30), s = Number(a2 ?? 0), e = Math.min(N, Number(a3 ?? N));
  const jpg = !!process.env.FRAMEJPG;
  for (let i = s; i < e; i++) await shoot(i / 30, path.join(a1, `f${String(i).padStart(4, '0')}.${jpg ? 'jpg' : 'png'}`), jpg ? 'jpeg' : 'png');
  console.log('done', key, s, e);
}
await browser.close();
