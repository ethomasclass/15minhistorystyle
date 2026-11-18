// Community post image for the finished series: node series_post.mjs <outdir>. 1080x1080, the five episode thumbnails.
// Parts 1 to 4 in a 2x2 grid, the finale large underneath. A missing thumbnail shows as a dark "PART N" card.
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)('playwright');
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const out = process.argv[2] || path.join(here, '../options');
const F = '../../../../brand/fonts/';
const THUMBS = ['ep1_C_series.jpg', 'ep2_final.jpg', 'ep3_A_hand.jpg', 'ep4_C_teal.jpg', 'ep5_B_orange.jpg'];
const rng = (seed) => () => (seed = (seed * 16807) % 2147483647, (seed - 1) / 2147483646);
const torn = (seed, depth = 9) => { const r = rng(seed), top = [], bot = [];
  for (let x = 0; x <= 100; x += 2.5) { top.push(`${x}% ${(r() * depth).toFixed(1)}%`); bot.push(`${100 - x}% ${(100 - depth + r() * depth).toFixed(1)}%`); }
  return `polygon(${top.join(',')},${bot.join(',')})`; };
const tape = (text, size, rot, seed, bg = '#FF9F1C') => `<div style="display:inline-block;transform:rotate(${rot}deg);filter:drop-shadow(0 8px 14px rgba(0,0,0,.65))">
  <div style="background:${bg};clip-path:${torn(seed)};padding:${size * 0.16}px ${size * 0.24}px ${size * 0.1}px"><div style="font:400 ${size}px/1 Abril;color:#111;white-space:nowrap">${text}</div></div></div>`;
const thumb = (i, w) => { const f = THUMBS[i], p = path.join(here, '../options', f);
  return fs.existsSync(p) ? `<img src="../options/${f}" style="width:${w}px;height:${w * 9 / 16}px">`
    : `<div class="ph" style="width:${w}px;height:${w * 9 / 16}px">PART ${i + 1}</div>`; };
const CSS = `
@font-face{font-family:Abril;src:url(${F}AbrilFatface.woff2)}
@font-face{font-family:Mono;src:url(${F}IBMPlexMono.woff2)}
@font-face{font-family:Pen;src:url(${F}NanumPenScript.woff2)}
body{margin:0}#s{width:1080px;height:1080px;position:relative;overflow:hidden;
  background:radial-gradient(ellipse 900px 700px at 50% 35%,#16302c,#0b0d0c 75%)}
.head{position:absolute;top:34px;width:100%;text-align:center}
.head b{display:block;font:400 84px/1 Abril;letter-spacing:1px;background:linear-gradient(172deg,#8a5a12 0%,#f7e39a 22%,#c8902b 38%,#fff6cf 50%,#b47a1e 63%,#e9c46a 80%,#7a4d10 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 2px 0 #3a2506) drop-shadow(0 6px 14px rgba(0,0,0,.9))}
.tp{margin-top:14px}
.grid{position:absolute;left:110px;top:236px;display:grid;grid-template-columns:420px 420px;gap:20px}
.grid > div, .fin{position:relative}
.grid img,.fin img,.ph{display:block;border-radius:10px;box-shadow:0 10px 26px rgba(0,0,0,.7),0 0 0 2px rgba(244,239,230,.12)}
.ph{background:#1a1d1c;color:#F4EFE6;font:400 54px/1 Abril;display:flex;align-items:center;justify-content:center}
.fin{position:absolute;left:280px;top:756px}
.fin img{box-shadow:0 0 0 3px #2FE0C4,0 0 26px rgba(47,224,196,.55),0 10px 26px rgba(0,0,0,.7)}
.lab{position:absolute;left:58px;top:872px;font:400 50px/1 Pen;color:#2FE0C4;transform:rotate(-4deg);text-shadow:0 2px 0 #000}`;
const html = `<div id="s"><div class="head"><b>The Gilded Age</b><div class="tp">${tape('THE FULL SERIES IS UP', 46, -2, 13)}</div></div>
  <div class="grid">${[0, 1, 2, 3].map(i => `<div>${thumb(i, 420)}</div>`).join('')}</div>
  <div class="lab">+ the finale</div><div class="fin">${thumb(4, 520)}</div></div>`;
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1080, height: 1080}});
await page.goto('file://' + path.join(here, 'blank.html'));
await page.setContent(`<base href="file://${here}/"><style>${CSS}</style>${html}`, {waitUntil: 'load'});
await page.evaluate(() => document.fonts.ready);
await page.locator('#s').screenshot({path: path.join(out, 'series_post.png')});
await browser.close();
console.log(path.join(out, 'series_post.png'));
