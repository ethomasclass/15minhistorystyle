// Episode 5 thumbnail: node ep5_thumb.mjs <outdir>. Flow base (img/ep5_flow_base.jpg) + cutout (img/ep5_worker_cut.png, padded 80 px). 1280x720.
// Centered subject (split background: furnace orange left, strike teal right), so the headline sits low across the chest.
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)('playwright');
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const out = process.argv[2] || here;
const F = '../../../../brand/fonts/';
const T = '#2FE0C4';
const CSS = `
@font-face{font-family:Inter;font-weight:800;src:url(${F}Inter-800.woff2)}
@font-face{font-family:Abril;src:url(${F}AbrilFatface.woff2)}
@font-face{font-family:Mono;src:url(${F}IBMPlexMono.woff2)}
@font-face{font-family:Pen;src:url(${F}NanumPenScript.woff2)}
body{margin:0;background:#000}#s{position:relative;width:1280px;height:720px;overflow:hidden;background:#0b0d0c}
#s img{position:absolute;left:-4px;top:-2px;width:1288px;height:719px}
#s img.cut{height:794px}
#s .bg{filter:brightness(.85) saturate(1.12)}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.55),rgba(0,0,0,0) 22%,rgba(0,0,0,0) 55%,rgba(0,0,0,.7)),radial-gradient(ellipse 760px 560px at 50% 40%,rgba(0,0,0,0),rgba(0,0,0,.4))}
.rim{position:absolute;inset:0;mix-blend-mode:screen;background:radial-gradient(ellipse 420px 420px at 52% 38%,rgba(47,224,196,.22),rgba(47,224,196,0) 70%)}
#s .cut{filter:drop-shadow(3px 0 0 ${T}) drop-shadow(-3px 0 0 ${T}) drop-shadow(0 3px 0 ${T}) drop-shadow(0 -3px 0 ${T}) drop-shadow(0 0 10px ${T}) drop-shadow(0 0 26px rgba(47,224,196,.75))}
.series{position:absolute;left:58px;top:40px;display:flex;align-items:center;gap:18px}
.series b{font:400 56px/1.1 Abril;letter-spacing:1px;background:linear-gradient(172deg,#8a5a12 0%,#f7e39a 22%,#c8902b 38%,#fff6cf 50%,#b47a1e 63%,#e9c46a 80%,#7a4d10 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:0.6px rgba(255,240,190,.35);filter:drop-shadow(0 2px 0 #3a2506) drop-shadow(0 6px 14px rgba(0,0,0,.9))}
.series i{font:600 24px/1 Mono;font-style:normal;color:#2a1a04;background:linear-gradient(172deg,#b47a1e,#f7e39a 45%,#c8902b 60%,#e9c46a);box-shadow:0 3px 10px rgba(0,0,0,.7);padding:8px 12px 6px;letter-spacing:3px}
.big{position:absolute;left:54px;font:800 150px/0.9 Inter;color:#F4EFE6;letter-spacing:-6px;text-shadow:0 6px 24px rgba(0,0,0,.9)}
.tape{position:absolute;left:48px;transform:rotate(-2.5deg);background:#FF9F1C;color:#111;font:800 176px/1 Inter;letter-spacing:-7px;padding:2px 30px 16px;box-shadow:0 10px 30px rgba(0,0,0,.6)}
.hand{position:absolute;font:400 92px/1 Pen;color:${T};text-shadow:0 0 6px #000,0 3px 0 #000,2px 0 0 #000,-2px 0 0 #000}
.sub{position:absolute;left:58px;font:800 50px/1 Inter;letter-spacing:-1px;color:#F4EFE6;text-shadow:0 4px 14px rgba(0,0,0,.95)}
.sub em{font-style:normal;color:${T}}`;
const rng = (seed) => () => (seed = (seed * 16807) % 2147483647, (seed - 1) / 2147483646);
const torn = (seed, depth = 9) => { const r = rng(seed), top = [], bot = [];
  for (let x = 0; x <= 100; x += 2.5) { top.push(`${x}% ${(r() * depth).toFixed(1)}%`); bot.push(`${100 - x}% ${(100 - depth + r() * depth).toFixed(1)}%`); }
  return `polygon(${top.join(',')},${bot.join(',')})`; };
// the channel's torn orange strip, Abril Fatface (as lookdev/text.js tape())
const tape = (text, x, y, size, rot, seed, bg = '#FF9F1C') => `<div style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${rot}deg);transform-origin:left top;filter:drop-shadow(0 8px 14px rgba(0,0,0,.65))">
  <div style="background:${bg};clip-path:${torn(seed)};padding:${size * 0.16}px ${size * 0.22}px ${size * 0.1}px"><div style="font:400 ${size}px/1 Abril;color:#111;white-space:nowrap">${text}</div></div></div>`;
const base = (inner) => `<div id="s"><img class="bg" src="img/ep5_flow_base.jpg"><div class="shade"></div><div class="rim"></div>
  <img class="cut" src="img/ep5_worker_cut.png"><div class="series"><b>The Gilded Age</b><i>PART 5</i></div>${inner}</div>`;
const JOBS = {
  ep5_A_low: base(tape('WHEN WORKERS', 70, 432, 74, -2.5, 11, '#2FE0C4') + tape('FOUGHT BACK', 52, 532, 128, -2, 23)),
  ep5_B_orange: base(tape('WHEN WORKERS', 70, 432, 74, -2.5, 11) + tape('FOUGHT BACK', 52, 532, 128, -2, 23)),
};
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1280, height: 720}});
for (const [name, html] of Object.entries(JOBS)) {
  await page.goto('file://' + path.join(here, 'blank.html'));
  await page.setContent(`<style>${CSS}</style>${html}`, {waitUntil: 'load'});
  await page.evaluate(() => document.fonts.ready);
  await page.locator('#s').screenshot({path: path.join(out, name + '.png')});
  console.log('rendered', name);
}
await browser.close();
