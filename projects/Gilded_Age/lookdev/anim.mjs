// Render one clip's frames: node anim.mjs <clip> <dir> [start] [end]   (30 fps; clips are defined in scene.js CLIPS)
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)('playwright');
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const [clip, dir, s0, s1] = process.argv.slice(2);
fs.mkdirSync(dir, {recursive: true});
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
await page.goto('file://' + path.join(here, 'bridge.html'));
const sec = await page.evaluate((c) => window.CLIPS[c].sec, clip);
const N = sec * 30, a = Number(s0 ?? 0), b = Math.min(N, Number(s1 ?? N));
for (let i = a; i < b; i++) {
  await page.evaluate((cfg) => window.draw(cfg), {clip, t: i / 30});
  await page.locator('#stage').screenshot({path: path.join(dir, `f${String(i).padStart(4, '0')}.png`), type: 'png'});
}
await browser.close();
console.log('done', clip, a, b);
