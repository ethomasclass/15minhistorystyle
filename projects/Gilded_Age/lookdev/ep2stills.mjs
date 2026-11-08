// Render Episode 2 stills: node ep2stills.mjs <outdir> name:clip:t[:labels] ...   (PNG, 1920x1080)
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)('playwright');
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const [dir, ...jobs] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
page.on('pageerror', (e) => console.log('ERR', e.message));
await page.goto('file://' + path.join(here, 'bridge.html'));
for (const j of jobs) {
  const [name, clip, t, lab] = j.split(':');
  const cfg = lab ? {ball: true, t: Number(t), labels: true, cam: {z: 0.78, ux: 930, uy: 540}} : {clip, t: Number(t)};
  await page.evaluate((c) => window.draw(c), cfg);
  await page.locator('#stage').screenshot({path: path.join(dir, name + '.png')});
  console.log('rendered', name);
}
await browser.close();
