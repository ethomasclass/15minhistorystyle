// On-screen text options for the Gilded Age series, drawn over the bridge scene. Channel type and colours throughout
// (brand/README.md): Abril Fatface on orange tape for titles, IBM Plex Mono for tags, Inter 600 for definitions,
// Playfair 900 for period and quote type, Nanum Pen Script in teal for handwritten notes. Each option is one function.

const C = {teal: '#2FE0C4', orange: '#FF9F1C', coral: '#FF6F61', ink: '#111111', cream: '#F4EFE6', bone: '#EDE7DC', desk: '#0D0C09'};
const TERM = {word: 'caisson', say: 'KAY-sahn', pos: 'noun',
  def: 'A giant airtight box sunk to the bottom of the river. Workers dug out the mud inside it until the tower could sit on solid ground.'};

function tornClip(seed, depth = 9) {
  const r = rng(seed), top = [], bot = [];
  for (let x = 0; x <= 100; x += 2.5) { top.push(`${x}% ${f1(r() * depth)}%`); bot.push(`${100 - x}% ${f1(100 - depth + r() * depth)}%`); }
  return `polygon(${top.join(',')},${bot.join(',')})`;
}
// The channel's torn orange strip: padding 10% top, 22% sides, 6% bottom of the type size, tilted about -2 degrees.
function tape(text, {x, y, size = 84, rot = -2, seed = 3, bg = C.orange, color = C.ink, font = 'Abril', ls = 0}) {
  return `<div class="tx" style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${rot}deg);transform-origin:left top;
    background:${bg};clip-path:${tornClip(seed)};padding:${size * 0.16}px ${size * 0.22}px ${size * 0.1}px;filter:drop-shadow(0 6px 10px rgba(0,0,0,.5))">
    <div style="font-family:${font};font-size:${size}px;line-height:1;color:${color};letter-spacing:${ls}px;white-space:nowrap">${text}</div></div>`;
}
const mono = (text, {x, y, size = 22, color = C.cream, ls = 3, extra = ''}) =>
  `<div class="tx" style="position:absolute;left:${x}px;top:${y}px;font-family:Mono;font-size:${size}px;letter-spacing:${ls}px;color:${color};text-transform:uppercase;white-space:nowrap;${extra}">${text}</div>`;
const pen = (text, {x, y, size = 40, rot = -4, color = C.teal, w}) =>
  `<div class="tx" style="position:absolute;left:${x}px;top:${y}px;${w ? `width:${w}px;` : 'white-space:nowrap;'}transform:rotate(${rot}deg);font-family:Pen;font-size:${size * 1.55}px;line-height:0.95;color:${color};
    -webkit-text-stroke:2px ${C.ink};paint-order:stroke fill;">${text}</div>`;
// A bowed teal arrow with an open chevron head (SVG overlay, full frame).
function arrow([x0, y0], [x1, y1], bow = 60) {
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy);
  const qx = mx - (dy / L) * bow, qy = my + (dx / L) * bow;
  const a = Math.atan2(y1 - qy, x1 - qx), h = 26;
  const p1 = [x1 - h * Math.cos(a - 0.5), y1 - h * Math.sin(a - 0.5)], p2 = [x1 - h * Math.cos(a + 0.5), y1 - h * Math.sin(a + 0.5)];
  const d = `M${x0},${y0} Q${f1(qx)},${f1(qy)} ${x1},${y1} M${f1(p1[0])},${f1(p1[1])} L${x1},${y1} L${f1(p2[0])},${f1(p2[1])}`;
  return `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${C.teal}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
}
const svg = (body) => `<svg style="position:absolute;inset:0" width="1920" height="1080" viewBox="0 0 1920 1080">${body}</svg>`;
const dim = (a) => `<div style="position:absolute;inset:0;background:rgba(13,12,9,${a})"></div>`;
const optionTag = (t) => `<div style="position:absolute;right:28px;top:24px;font-family:Mono;font-size:18px;letter-spacing:2px;color:rgba(244,239,230,.55)">${t}</div>`;

const OVERLAYS = {
  // A. The channel's own title: orange torn tape, with the section number and a place/date stamp in mono.
  secTape: () =>
    mono('Section 1.4', {x: 118, y: 84, size: 24, color: C.cream, ls: 5}) +
    tape('THE GREAT BRIDGE', {x: 104, y: 122, size: 92, seed: 5}) +
    mono('Brooklyn, N.Y. &middot; May 24, 1883', {x: 44, y: 1030, size: 20, color: C.cream}) +
    optionTag('SECTION TITLE A · CHANNEL TAPE'),

  // B. A full-width band that slides across between sections (the reference's structure, in channel colours).
  secBand: () => `<div style="position:absolute;left:0;top:118px;width:1920px;height:150px;background:rgba(13,12,9,.92);border-top:3px solid ${C.teal};border-bottom:3px solid ${C.teal}"></div>` +
    tape('1.4', {x: 96, y: 112, size: 120, rot: -3, seed: 8}) +
    `<div style="position:absolute;left:330px;top:146px;font-family:Abril;font-size:78px;line-height:1;color:${C.cream};letter-spacing:1px">THE GREAT BRIDGE</div>` +
    mono('Brooklyn &middot; May 24, 1883', {x: 1330, y: 182, size: 26, color: C.teal, ls: 4}) +
    optionTag('SECTION TITLE B · FULL-WIDTH BAND'),

  // C. A period handbill: cream paper, 1880s display type, pinned with a strip of tape.
  secHandbill: () => `<div style="position:absolute;left:96px;top:86px;width:640px;transform:rotate(-2.5deg);background:${C.cream};padding:22px 26px;
      box-shadow:0 18px 34px rgba(0,0,0,.6);background-image:radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.5),transparent 60%),radial-gradient(ellipse at 80% 90%,rgba(120,100,70,.18),transparent 60%)">
      <div style="border:3px solid ${C.ink};outline:1px solid ${C.ink};outline-offset:-9px;padding:22px 20px 18px;text-align:center">
        <div style="font-family:Mono;font-size:20px;letter-spacing:6px;color:${C.ink}">SECTION 1.4</div>
        <div style="font-family:Playfair;font-weight:900;font-size:76px;line-height:1.02;color:${C.ink};margin:10px 0 8px">The Great Bridge</div>
        <div style="height:3px;background:${C.ink};margin:6px 60px 12px"></div>
        <div style="font-family:Mono;font-size:21px;letter-spacing:3px;color:${C.ink}">OPENED MAY 24, 1883 &middot; BROOKLYN</div>
      </div></div>` +
    tape('&nbsp;&nbsp;&nbsp;&nbsp;', {x: 360, y: 64, size: 34, rot: 4, seed: 12}) +
    optionTag('SECTION TITLE C · PERIOD HANDBILL'),

  // 1. Today's template bar (src/kit/shell.tsx Definition): term in teal, then the definition, on a dark bar.
  vBar: () => `<div style="position:absolute;left:120px;top:600px;max-width:1200px;font-family:Inter;font-weight:600;font-size:38px;line-height:1.35;color:#fff;background:rgba(10,10,10,.8);padding:16px 26px">
      <span style="color:${C.teal}">${TERM.word}</span> &middot; ${TERM.def}</div>` + optionTag('VOCAB 1 · TODAY\'S TEMPLATE BAR'),

  // 2. An index card taped into the corner: the term set big, the definition in plain type, a teal note pointing back to the scene.
  vCard: () => `<div style="position:absolute;left:1190px;top:120px;width:640px;transform:rotate(2deg);background:${C.cream};box-shadow:0 18px 34px rgba(0,0,0,.6);
      background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 45px,rgba(17,17,17,.12) 45px,rgba(17,17,17,.12) 47px);background-position:0 96px;padding:30px 38px 34px">
      <div style="height:3px;background:${C.coral};opacity:.0;margin-bottom:8px"></div>
      <div style="display:flex;align-items:baseline;gap:20px"><div style="font-family:Abril;font-size:76px;line-height:1;color:${C.ink}">CAISSON</div>
      <div style="font-family:Mono;font-size:20px;letter-spacing:2px;color:#444">KAY-SAHN &middot; NOUN</div></div>
      <div style="font-family:Inter;font-weight:600;font-size:31px;line-height:1.42;color:${C.ink};margin-top:18px">${TERM.def}</div></div>` +
    tape('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;', {x: 1440, y: 96, size: 36, rot: -6, seed: 21}) +
    pen('each tower sits on one', {x: 1390, y: 610, size: 36, rot: -3, color: C.orange}) +
    svg(arrow([1470, 676], [1390, 748], -30)) + optionTag('VOCAB 2 · INDEX CARD'),

  // 3. A lower-third tab: small enough that the scene keeps playing behind it.
  vTab: () => `<div style="position:absolute;left:110px;top:926px;width:1500px;height:96px;background:rgba(13,12,9,.9);border-left:6px solid ${C.teal}"></div>` +
    `<div style="position:absolute;left:150px;top:940px;width:1440px;font-family:Inter;font-weight:600;font-size:30px;line-height:1.3;color:${C.cream}">${TERM.def}</div>` +
    tape('CAISSON', {x: 96, y: 846, size: 58, seed: 30}) + mono('KAY-sahn &middot; noun', {x: 420, y: 878, size: 22, color: C.teal, ls: 3}) +
    optionTag('VOCAB 3 · LOWER-THIRD TAB'),

  // 4. In the scene: an x-ray window below the tower shows the caisson, labelled by hand. The picture does the defining.
  vScene: (cfg) => {
    const tx = Math.round(B.tB - cfg.cx * 0.5), wl = 772;
    const body = `<defs><clipPath id="xr"><circle cx="${tx}" cy="836" r="214"/></clipPath>
        <pattern id="hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="14" stroke="${C.teal}" stroke-width="2" opacity=".55"/></pattern></defs>
      <g clip-path="url(#xr)"><rect x="${tx - 260}" y="620" width="520" height="520" fill="#0E1817" opacity=".96"/>
        <rect x="${tx - 260}" y="${wl}" width="520" height="70" fill="#1C3332"/>
        <rect x="${tx - 260}" y="${wl + 70}" width="520" height="400" fill="#16211F"/>
        <path d="M${tx - 115},630 L${tx - 125},${wl + 70} M${tx + 115},630 L${tx + 125},${wl + 70}" stroke="${C.teal}" stroke-width="4" fill="none" stroke-dasharray="12 8"/>
        <rect x="${tx - 170}" y="${wl + 72}" width="340" height="88" fill="url(#hatch)" stroke="${C.teal}" stroke-width="5"/>
        ${[-110, -40, 40, 110].map((dx) => figure({x: tx + dx, y: wl + 150, h: 52, d: dx < 0 ? 1 : -1, kind: 'man', hat: 'cap', coat: 'jacket', fill: C.teal})).join('')}
        <text x="${tx + 210}" y="${wl + 34}" font-family="Mono" font-size="18" fill="${C.cream}" opacity=".7" text-anchor="end" letter-spacing="2" dx="-50">RIVER</text>
        <text x="${tx + 210}" y="${wl + 232}" font-family="Mono" font-size="18" fill="${C.cream}" opacity=".7" text-anchor="end" letter-spacing="2" dx="-120">RIVERBED</text></g>
      <circle cx="${tx}" cy="836" r="214" fill="none" stroke="${C.teal}" stroke-width="5" stroke-dasharray="2 0"/>
      ${arrow([tx + 330, wl - 120], [tx + 178, wl + 112], 40)}`;
    return svg(body) + pen('caisson', {x: tx + 290, y: 420, size: 56, rot: -5, color: C.orange}) +
      pen('a giant box sunk to the riverbed.<br>men dug out the mud inside it', {x: tx + 290, y: 510, size: 28, rot: -4, w: 400, color: C.orange}) +
      optionTag('VOCAB 4 · IN THE SCENE');
  },

  // 5. A dictionary entry: the scene dims and the word takes the frame for a beat.
  vDict: () => dim(0.72) + `<div style="position:absolute;left:260px;top:250px;width:1400px">
      <div style="font-family:Playfair;font-weight:900;font-size:150px;line-height:1;color:${C.cream}">cais&middot;son</div>
      <div style="font-family:Mono;font-size:28px;letter-spacing:4px;color:${C.teal};margin-top:18px">/ KAY-SAHN / &nbsp;&middot;&nbsp; NOUN</div>
      <div style="height:4px;width:420px;background:${C.teal};margin:30px 0"></div>
      <div style="font-family:Inter;font-weight:600;font-size:44px;line-height:1.38;color:${C.cream};max-width:1300px">${TERM.def}</div></div>` +
    pen('workers dug inside them for months, deep under the river', {x: 270, y: 830, size: 36, rot: -2}) + optionTag('VOCAB 5 · DICTIONARY ENTRY'),

  // Callouts: a measured line, a name for the composite character, and the composite label.
  callouts: () => {
    const x = 1470, top = 302, wl = 772;
    const body = `<path d="M${x},${wl} V${top} M${x - 16},${wl} H${x + 16} M${x - 16},${top} H${x + 16}" stroke="${C.ink}" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M${x},${wl} V${top} M${x - 16},${wl} H${x + 16} M${x - 16},${top} H${x + 16}" stroke="${C.teal}" stroke-width="5" fill="none" stroke-linecap="round"/>
      ${arrow([880, 640], [1110, 760], 60)}`;
    return svg(body) + pen('276 feet', {x: 1500, y: 470, size: 52, rot: -6}) +
      pen('michael kelly, 19', {x: 610, y: 560, size: 44, rot: -4}) +
      `<div style="position:absolute;left:44px;top:1016px;display:flex;align-items:center;gap:12px;background:rgba(13,12,9,.85);padding:8px 14px">
        <div style="width:14px;height:14px;border-radius:50%;background:${C.coral}"></div>
        <div style="font-family:Mono;font-size:18px;letter-spacing:2px;color:${C.cream}">THE KELLYS ARE A COMPOSITE FAMILY &middot; THE BRIDGE, THE DATE AND THE CROWD ARE REAL</div></div>` +
      mono('May 24, 1883', {x: 44, y: 40, size: 22, color: C.cream}) + optionTag('CALLOUTS + COMPOSITE LABEL');
  },

  // The series question, asked at the end of every episode. "GOLD" in a thin gold leaf is the one off-palette touch.
  gilt: () => dim(0.78) + `<div style="position:absolute;left:0;top:250px;width:1920px;text-align:center">
      <div style="font-family:Abril;font-size:110px;line-height:1.05;color:${C.cream}">WHO GOT THE <span style="background:linear-gradient(180deg,#F6E7B0 0%,#D9AE4E 45%,#9C7424 55%,#E9C56E 100%);-webkit-background-clip:text;color:transparent">GOLD</span>,</div>
      <div style="font-family:Abril;font-size:80px;line-height:1.3;color:${C.cream}">AND WHO ONLY GOT THE</div></div>` +
    tape('GILT?', {x: 790, y: 520, size: 150, rot: -3, seed: 41}) +
    pen('gilt: a thin coat of gold over cheap metal', {x: 540, y: 830, size: 40, rot: -2}) + optionTag('SERIES QUESTION CARD'),
};
window.OVERLAYS = OVERLAYS;
