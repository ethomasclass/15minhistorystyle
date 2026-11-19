// Stills of a clip: node tg_stills.mjs <clip> <dir> <t1> <t2> ...   (JPEG, 1920 x 1080)
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)('playwright');
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const [clip, dir, ...ts] = process.argv.slice(2);
fs.mkdirSync(dir, {recursive: true});
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
page.on('pageerror', (e) => console.log('PAGE ERROR', e.message));
await page.goto('file://' + path.join(here, 'bridge.html'));
for (const t of ts) {
  await page.evaluate((cfg) => window.draw(cfg), {clip, t: Number(t)});
  await page.locator('#stage').screenshot({path: path.join(dir, `${clip}_${t}.jpg`), type: 'jpeg', quality: 88});
}
await browser.close();
