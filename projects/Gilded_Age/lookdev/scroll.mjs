// A test of the side-scroll: the camera glides from the Manhattan tower to Michael (parallax planes at 0.25 to 1.35),
// while Michael's waving arm steps at 12 drawings a second, the channel's rule for drawn motion.
// node scroll.mjs <framesDir>  then ffmpeg (see README).
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)('playwright');
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const dir = process.argv[2]; fs.mkdirSync(dir, {recursive: true});
const FPS = 30, SEC = 9, N = FPS * SEC;
const ease = (t) => 0.5 - Math.cos(Math.PI * t) / 2;
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
await page.goto('file://' + path.join(here, 'bridge.html'));
for (let i = 0; i < N; i++) {
  const t = Math.min(1, i / (N - FPS * 1.5)); // hold the last 1.5 s
  const cx = -3600 + 3600 * ease(t);
  const step = Math.floor(i / (FPS / 12)); // 12 drawings a second
  const waveA = Math.sin(step * 0.9) * 22;
  await page.evaluate((cfg) => window.draw(cfg), {look: 'dusk', cx, waveA});
  await page.locator('#stage').screenshot({path: path.join(dir, `f${String(i).padStart(4, '0')}.png`)});
}
await browser.close();
