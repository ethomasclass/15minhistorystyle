// Episode 3 thumbnail: node ep3_thumb.mjs <outdir>. Flow base (img/ep3_flow_base.jpg) + cutout (img/ep3_woman_cut.png). 1280x720.
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
#s .bg{filter:brightness(.42) saturate(.8) blur(1.5px)}
.shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.72),rgba(0,0,0,.35) 48%,rgba(0,0,0,0) 62%),radial-gradient(ellipse 700px 520px at 80% 45%,rgba(0,0,0,0),rgba(0,0,0,.45))}
.rim{position:absolute;inset:0;mix-blend-mode:screen;background:radial-gradient(ellipse 420px 420px at 79% 40%,rgba(47,224,196,.22),rgba(47,224,196,0) 70%)}
#s .cut{filter:drop-shadow(3px 0 0 ${T}) drop-shadow(-3px 0 0 ${T}) drop-shadow(0 3px 0 ${T}) drop-shadow(0 -3px 0 ${T}) drop-shadow(0 0 10px ${T}) drop-shadow(0 0 26px rgba(47,224,196,.75))}
.series{position:absolute;left:58px;top:40px;display:flex;align-items:center;gap:18px}
.series b{font:400 56px/1.1 Abril;letter-spacing:1px;background:linear-gradient(172deg,#8a5a12 0%,#f7e39a 22%,#c8902b 38%,#fff6cf 50%,#b47a1e 63%,#e9c46a 80%,#7a4d10 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:0.6px rgba(255,240,190,.35);filter:drop-shadow(0 2px 0 #3a2506) drop-shadow(0 6px 14px rgba(0,0,0,.9))}
.series i{font:600 24px/1 Mono;font-style:normal;color:#2a1a04;background:linear-gradient(172deg,#b47a1e,#f7e39a 45%,#c8902b 60%,#e9c46a);box-shadow:0 3px 10px rgba(0,0,0,.7);padding:8px 12px 6px;letter-spacing:3px}
.big{position:absolute;left:54px;font:800 150px/0.9 Inter;color:#F4EFE6;letter-spacing:-6px;text-shadow:0 6px 24px rgba(0,0,0,.9)}
.tape{position:absolute;left:48px;transform:rotate(-2.5deg);background:#FF9F1C;color:#111;font:800 176px/1 Inter;letter-spacing:-7px;padding:2px 30px 16px;box-shadow:0 10px 30px rgba(0,0,0,.6)}
.hand{position:absolute;font:400 92px/1 Pen;color:${T};text-shadow:0 0 6px #000,0 3px 0 #000,2px 0 0 #000,-2px 0 0 #000}
.sub{position:absolute;left:58px;font:800 50px/1 Inter;letter-spacing:-1px;color:#F4EFE6;text-shadow:0 4px 14px rgba(0,0,0,.95)}
.sub em{font-style:normal;color:${T}}`;
const base = (inner) => `<div id="s"><img class="bg" src="img/ep3_flow_base.jpg"><div class="shade"></div><div class="rim"></div>
  <img class="cut" src="img/ep3_woman_cut.png"><div class="series"><b>The Gilded Age</b><i>PART 3</i></div>
  <div class="big" style="top:150px">LIFE WAS</div><div class="tape" style="top:290px">TOUGH</div>${inner}</div>`;
const JOBS = {
  ep3_A_hand: base(`<div class="hand" style="left:70px;top:530px;transform:rotate(-3deg)">for new immigrants</div>`),
  ep3_B_caps: base(`<div class="sub" style="top:548px">FOR <em>NEW IMMIGRANTS</em></div>`),
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
