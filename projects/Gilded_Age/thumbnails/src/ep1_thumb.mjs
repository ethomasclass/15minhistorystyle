// Episode 1 thumbnail: node ep1_thumb.mjs <outdir>. Flow bust (img/ep1_bust_flow.jpg) + series type. 1280x720.
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)('playwright');
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const out = process.argv[2] || here;
const F = '../../../../brand/fonts/';
const CORAL = '#FF6F61';
// Kelly family silhouettes, feet on y=0, facing right (toward the bust).
const person = (x, s, kind) => {
  const g = (d) => `<g transform="translate(${x} 0) scale(${s})">${d}</g>`;
  if (kind === 'pa') return g(`<circle cx="0" cy="-152" r="13"/><path d="M-15 -160 h30 l-3 -8 h-24z"/>
    <path d="M-17 -136 q17 -8 34 0 l4 62 h-10 l-2 -2 l-3 76 h-9 l-2 -60 l-2 60 h-9 l-3 -76 l-2 2 h-10z"/><path d="M14 -128 l14 34 l-6 3 l-12 -26z"/>`);
  if (kind === 'ma') return g(`<circle cx="0" cy="-146" r="12"/><circle cx="-6" cy="-154" r="8"/>
    <path d="M-13 -131 q13 -7 26 0 l3 40 q14 50 18 91 h-68 q4 -41 18 -91z"/>`);
  if (kind === 'boy') return g(`<circle cx="0" cy="-104" r="11"/><path d="M-12 -110 h24 l-2 -7 h-20z"/>
    <path d="M-12 -90 q12 -6 24 0 l3 44 h-7 l-2 46 h-8 l-1 -36 l-1 36 h-8 l-2 -46 h-7z"/>`);
  return g(`<circle cx="0" cy="-92" r="10"/><path d="M-10 -80 q10 -5 20 0 l2 22 q8 30 10 58 h-44 q2 -28 10 -58z"/>`);
};
const fam = `<svg style="position:absolute;left:0;top:0" width="1280" height="720"><g fill="${CORAL}" transform="translate(0 664)" style="filter:drop-shadow(0 0 10px rgba(255,111,97,.55))">
  ${person(70, 0.82, 'pa')}${person(112, 0.8, 'ma')}${person(150, 0.8, 'boy')}${person(182, 0.8, 'girl')}</g></svg>`;
const CSS = `
@font-face{font-family:Inter;font-weight:800;src:url(${F}Inter-800.woff2)}
@font-face{font-family:Abril;src:url(${F}AbrilFatface.woff2)}
@font-face{font-family:Mono;src:url(${F}IBMPlexMono.woff2)}
body{margin:0;background:#000}#s{position:relative;width:1280px;height:720px;overflow:hidden;background:#0d0c09}
#s img{position:absolute;left:-5px;top:0;width:1290px;height:720px}
.shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.55),rgba(0,0,0,0) 45%)}
.tag{position:absolute;left:64px;top:44px;font:22px Mono;letter-spacing:4px;color:#E2B864}
.big{position:absolute;left:58px;font:800 150px/0.9 Inter;color:#F4EFE6;letter-spacing:-5px;text-shadow:0 6px 24px rgba(0,0,0,.9)}
.series{position:absolute;left:62px;top:40px;display:flex;align-items:center;gap:18px}
.series b{font:400 60px/1.1 Abril;letter-spacing:1px;background:linear-gradient(172deg,#8a5a12 0%,#f7e39a 22%,#c8902b 38%,#fff6cf 50%,#b47a1e 63%,#e9c46a 80%,#7a4d10 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:0.6px rgba(255,240,190,.35);filter:drop-shadow(0 2px 0 #3a2506) drop-shadow(0 6px 14px rgba(0,0,0,.9))}
.series i{font:600 26px/1 Mono;font-style:normal;color:#2a1a04;background:linear-gradient(172deg,#b47a1e,#f7e39a 45%,#c8902b 60%,#e9c46a);box-shadow:0 3px 10px rgba(0,0,0,.7);padding:8px 12px 6px;letter-spacing:3px}
.tape{position:absolute;left:52px;transform:rotate(-2.5deg);background:#FF9F1C;color:#111;font:800 150px/1 Inter;letter-spacing:-5px;padding:6px 30px 16px;box-shadow:0 10px 30px rgba(0,0,0,.6)}`;
const base = (inner) => `<div id="s"><img src="img/ep1_bust_flow.jpg"><div class="shade"></div><div class="tag">THE GILDED AGE · 1</div>${inner}</div>`;
const JOBS = {
  ep1_A_who_paid: base(`<div class="big" style="top:150px">WHO</div><div class="tape" style="top:300px">PAID?</div>`),
  ep1_C_series: `<div id="s"><img src="img/ep1_bust_flow.jpg"><div class="shade"></div><div class="series"><b>The Gilded Age</b><i>PART 1</i></div><div class="big" style="top:150px;font-size:200px;letter-spacing:-7px">WHO</div><div class="tape" style="top:340px;font-size:192px;letter-spacing:-7px;padding:4px 30px 18px">PAID?</div></div>`,
  ep1_B_family: base(`<div class="big" style="top:110px">WHO</div><div class="tape" style="top:255px">PAID?</div>${fam}`),
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
