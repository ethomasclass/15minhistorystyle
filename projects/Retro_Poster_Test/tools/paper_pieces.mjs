// node tools/paper_pieces.mjs build/paper
// Rasterises every piece in pieces.html once, with its paper filter, cropped to its own box, as a transparent PNG
// (pc_<i>.png), and writes pieces.json with each box. Pieces marked data-vector stay vector and are skipped.
import {createRequire} from 'module';
const {chromium} = createRequire(import.meta.url)('playwright');
import fs from 'fs';
import path from 'path';
import {pathToFileURL} from 'url';

const dir = path.resolve(process.argv[2]);
const M = 120, PAD = 26;
const b = await chromium.launch();
const page = await b.newPage({viewport: {width: 1920 + 2 * M, height: 1080 + 2 * M}});
await page.goto(pathToFileURL(path.join(dir, 'pieces.html')).href);
await page.evaluate(() => document.fonts.ready);
const ids = await page.evaluate(() => [...document.querySelectorAll('g[data-piece]')].filter((g) => !g.dataset.vector).map((g) => g.id));
const meta = {};
for (const id of ids) {
  const r = await page.evaluate((id) => {
    for (const g of document.querySelectorAll('g[data-piece]')) g.style.display = g.id === id ? '' : 'none';
    const bb = document.getElementById(id).getBBox();
    return [bb.x, bb.y, bb.width, bb.height];
  }, id);
  const x0 = Math.max(-M, Math.floor(r[0] - PAD)), y0 = Math.max(-M, Math.floor(r[1] - PAD));
  const x1 = Math.min(1920 + M, Math.ceil(r[0] + r[2] + PAD)), y1 = Math.min(1080 + M, Math.ceil(r[1] + r[3] + PAD));
  if (x1 - x0 < 2 || y1 - y0 < 2) continue;
  await page.screenshot({path: path.join(dir, `pc_${id}.png`), omitBackground: true, clip: {x: x0 + M, y: y0 + M, width: x1 - x0, height: y1 - y0}});
  meta[id] = [x0, y0, x1 - x0, y1 - y0];
}
fs.writeFileSync(path.join(dir, 'pieces.json'), JSON.stringify(meta));
console.log('pieces', Object.keys(meta).length);
await b.close();
