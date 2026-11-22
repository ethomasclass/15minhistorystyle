// node tools/anim_render.mjs build/anim [first] [last]
// 1) renders every L_*.svg layer to a transparent PNG (once), 2) opens base.html and, for each line of
// frames.ndjson, sets the plane transforms and the moving groups, then screenshots the frame.
import {createRequire} from 'module';
const {chromium} = createRequire(import.meta.url)('playwright');
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import {pathToFileURL, fileURLToPath} from 'url';

const dir = path.resolve(process.argv[2]);
const first = +(process.argv[3] ?? 0), last = +(process.argv[4] ?? 1e9);
const here = path.dirname(fileURLToPath(import.meta.url));
const font = pathToFileURL(path.join(here, '..', 'fonts', 'SpecialElite.ttf')).href;
const b = await chromium.launch();

for (const f of fs.readdirSync(dir).filter((f) => /^L_.*\.svg$/.test(f))) {
  const out = path.join(dir, f.replace('.svg', '.png'));
  if (fs.existsSync(out) && fs.statSync(out).mtimeMs > fs.statSync(path.join(dir, f)).mtimeMs) continue;
  const svg = fs.readFileSync(path.join(dir, f), 'utf8');
  const w = +svg.match(/width="(\d+)"/)[1], h = +svg.match(/height="(\d+)"/)[1];
  const p = await b.newPage({viewport: {width: w, height: h}});
  await p.setContent(`<style>@font-face{font-family:'Special Elite';src:url('${font}')}html,body{margin:0;background:transparent}svg{display:block}</style>${svg}`);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({path: out, omitBackground: true});
  await p.close();
  console.log('layer', f);
}

const page = await b.newPage({viewport: {width: 1920, height: 1080}});
await page.goto(pathToFileURL(path.join(dir, 'base.html')).href);
await page.evaluate(async () => {
  await document.fonts.load('20px "Special Elite"');
  await Promise.all([...document.querySelectorAll('image')].map((im) => im.decode ? im.decode().catch(() => 0) : 0));
});
fs.mkdirSync(path.join(dir, 'f'), {recursive: true});
const rl = readline.createInterface({input: fs.createReadStream(path.join(dir, 'frames.ndjson'))});
let i = 0;
const t0 = Date.now();
for await (const line of rl) {
  if (i >= first && i <= last) {
    await page.evaluate((fr) => {
      for (const id in fr.t) document.getElementById(id).setAttribute('transform', fr.t[id]);
      for (const id in fr.h) document.getElementById(id).innerHTML = fr.h[id];
    }, JSON.parse(line));
    await page.screenshot({path: path.join(dir, 'f', String(i).padStart(4, '0') + '.png')});
    if (i % 30 === 0) console.log('frame', i, ((Date.now() - t0) / 1000).toFixed(0) + 's');
  }
  i++;
}
await b.close();
