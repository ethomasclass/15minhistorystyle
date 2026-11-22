// node tools/render.mjs in.svg out.png  -> renders the SVG in Chromium with the Special Elite font loaded
import {createRequire} from 'module';
const {chromium} = createRequire(import.meta.url)('playwright');
import fs from 'fs';
import path from 'path';
import {fileURLToPath, pathToFileURL} from 'url';

const [inp, out, scale = '1', transparent = ''] = process.argv.slice(2);
const here = path.dirname(fileURLToPath(import.meta.url));
const font = pathToFileURL(path.join(here, '..', 'fonts', 'SpecialElite.ttf')).href;
const svg = fs.readFileSync(inp, 'utf8');
const w = +svg.match(/width="(\d+)"/)[1], h = +svg.match(/height="(\d+)"/)[1];
const html = `<!doctype html><html><head><style>
@font-face{font-family:'Special Elite';src:url('${font}')}
html,body{margin:0;background:${transparent ? 'transparent' : '#000'}}svg{display:block}</style></head><body>${svg}</body></html>`;
const tmp = path.join(path.dirname(out), '.render.html');
fs.writeFileSync(tmp, html);
const b = await chromium.launch();
const p = await b.newPage({viewport: {width: w, height: h}, deviceScaleFactor: +scale});
await p.goto(pathToFileURL(tmp).href);
await p.evaluate(() => document.fonts.ready);
await p.screenshot({path: out, omitBackground: !!transparent});
await b.close();
fs.unlinkSync(tmp);
console.log('ok', out);
