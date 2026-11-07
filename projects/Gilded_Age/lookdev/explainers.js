// Episode 1's two teaching explainers, built with rig.js (load rig.js and scene.js first).
//
//   vi_explainer  Vertical integration (Carnegie). One long side-scroll through every step of making steel: an iron mine in
//                 Minnesota, an ore boat on the Great Lakes, coke ovens, the mill, his railroads, the city that buys the steel.
//                 As each step passes, a teal line ties it to the last; then the camera pulls back to show one line running the
//                 whole chain, and the term lands.
//   hi_explainer  Horizontal integration and rebates (Rockefeller). Cleveland's refineries in a row. A railroad clerk quietly
//                 hands money back to the big shipper (a rebate), so his freight costs less than a rival's. Then, one by one,
//                 22 rival chimneys stop smoking and teal pipes tie them to Standard Oil, and the term lands.
//
// Teal draws and explains; orange labels (the tape title and the handwriting); no coral, because coral means a Kelly.
// Labels are drawn in screen space, so they stay readable when the camera pulls back.

const EX = {
  sky: [['0', '#111B1B'], ['0.5', '#1C3332'], ['0.85', '#5F857F'], ['1', '#A3BAB2']],
  far: '#4E726C', mid: '#2B4744', main: '#0D0C09', set: '#132423', water: '#1C3332', glow: '#F4EFE6',
  teal: '#2FE0C4', orange: '#FF9F1C', cream: '#F4EFE6', ink: '#111111',
};
const GROUND = 820;

/* ---------- shared drawing ---------- */
const cam2 = (c) => ({...c, sx: (x) => 960 + (x - c.ux) * c.z, sy: (y) => 540 + (y - c.uy) * c.z});
function exDefs(t) {
  return `<defs>${grad('exsky', EX.sky)}
    <radialGradient id="exglow"><stop offset="0" stop-color="#F4EFE6" stop-opacity="0.55"/><stop offset="1" stop-color="#F4EFE6" stop-opacity="0"/></radialGradient>
    <radialGradient id="exvig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/></radialGradient>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${Math.floor(t * 12) % 50}"/><feColorMatrix type="saturate" values="0"/></filter>
    <radialGradient id="excloud"><stop offset="0" stop-color="#A3BAB2" stop-opacity="0.16"/><stop offset="1" stop-color="#A3BAB2" stop-opacity="0"/></radialGradient>
    ${TEX_PATTERNS}${MAT_DEFS}${grad('exmist', [['0', '#A3BAB2', 0], ['0.5', '#A3BAB2', 0.3], ['1', '#A3BAB2', 0]])}</defs>`;
}
const smoke = (x, y, t, col, k = 1, n = 6) => MAT.smoke(x, y, t, {col: (col || '#3E5F5A').slice(1).toUpperCase(), k, n: n + 1, seed: Math.round(x) % 97});
function farHills(w, col, base, seed, amp = 120, trees = 0) {
  const r = rng(seed), ridge = []; let d = `M-2000,${base + 400} L-2000,${base}`;
  for (let x = -2000; x <= w + 2000; x += 140) { const y = base - r() * amp - 20; d += ` L${x},${f1(y)}`; ridge.push([x, y]); }
  return `<path d="${d} L${w + 2000},${base + 400} Z" fill="${col}"/>` + (trees ? MAT.trees(ridge, {col, seed: seed + 50, size: trees}) : '');
}
// screen-space labels
// Text sizes (round 8: bigger, so a phone screen can read them): tags 28 px mono, handwriting x1.3, cards 36 px.
const tag = (x, y, txt, op = 1) => `<g opacity="${f1(op * 100) / 100}"><rect x="${f1(x - 10)}" y="${f1(y - 31)}" width="${f1(txt.length * 19.4 + 20)}" height="42" fill="rgba(13,12,9,0.86)"/><text x="${f1(x)}" y="${f1(y)}" font-family="Mono" font-size="28" letter-spacing="2" fill="${EX.cream}">${txt}</text></g>`;
const PEN_SCALE = 1.3;
const penS = (x, y, txt, size = 40, rot = -3, col = EX.orange) => `<text x="${x}" y="${y}" transform="rotate(${rot}, ${x}, ${y})" font-family="Pen" font-size="${f1(size * 1.55 * PEN_SCALE)}" fill="${col}" stroke="#111" stroke-width="4" paint-order="stroke">${txt}</text>`;
function tapeS(x, y, txt, size = 72, rot = -2, op = 1, seed = 4) {
  const r = rng(seed), w = txt.length * size * 0.66 + size * 0.5, h = size * 1.28, pts2 = [];
  for (let u = 0; u <= 1.001; u += 0.04) pts2.push([x + u * w, y + r() * 7]);
  for (let u = 1; u >= -0.001; u -= 0.04) pts2.push([x + u * w, y + h - r() * 7]);
  return `<g opacity="${f1(op * 100) / 100}" transform="rotate(${rot}, ${x}, ${y})"><polygon points="${pts(pts2)}" fill="${EX.orange}"/><text x="${f1(x + size * 0.25)}" y="${f1(y + size * 1.02)}" font-family="Abril" font-size="${size}" fill="${EX.ink}">${txt}</text></g>`;
}
function card(x, y, term, def, note, op = 1) { // the index card, as chosen for the series' vocab
  if (op <= 0.01) return '';
  const lines = def.split('|'), W2 = 800, hgt = 128 + lines.length * 54;
  return `<g opacity="${f1(op * 100) / 100}" transform="rotate(2, ${x}, ${y})"><rect x="${x + 6}" y="${y + 10}" width="${W2}" height="${hgt}" fill="#000" opacity="0.45" filter="url(#soft)"/>` +
    `<rect x="${x}" y="${y}" width="${W2}" height="${hgt}" fill="${EX.cream}"/>` +
    [0, 1, 2, 3, 4].map((k) => `<rect x="${x}" y="${y + 112 + k * 54}" width="${W2}" height="1.5" fill="#111" opacity="0.12"/>`).join('') +
    `<text x="${x + 38}" y="${y + 86}" font-family="Abril" font-size="${term.length > 12 ? 52 : 64}" fill="${EX.ink}">${term}</text>` +
    lines.map((l, i) => `<text x="${x + 38}" y="${y + 156 + i * 54}" font-family="Inter" font-weight="600" font-size="36" fill="${EX.ink}">${l}</text>`).join('') +
    `<rect x="${x + 360}" y="${y - 16}" width="84" height="32" fill="${EX.orange}" transform="rotate(-6, ${x + 400}, ${y})"/></g>` +
    (note ? penS(x + 40, y + hgt + 70, note, 34, -3) : '');
}
function frame(defs, sky, world, screen, t) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">${defs}${sky}${world}${screen}` +
    `<rect width="1920" height="1080" filter="url(#grain)" opacity="0.13" style="mix-blend-mode:overlay"/><rect width="1920" height="1080" fill="url(#exvig)"/></svg>`;
}
let TEXN = 0;
// a camera layer; with tex, its surfaces are mottled and grained (the texture is fixed to the world, so it moves with them)
const layerAt = (c, p, body, tex = null) => {
  const zp = 1 + (c.z - 1) * p, ax = 960 + (c.ux - 960) * p, ay = 540 + (c.uy - 540) * p;
  let inner = body;
  if (tex && tex.force) { const id = `tx${TEXN++}`, [x, y, w, h] = visibleRect(c, p); inner = `<defs>${texDef(id, x, y, w, h, tex)}</defs><g filter="url(#${id})">${body}</g>`; }
  return `<g transform="translate(960,540) scale(${zp.toFixed(4)}) translate(${f1(-ax)},${f1(-ay)})">${inner}</g>`;
};
// slow clouds across the sky, so it isn't one flat gradient
const clouds = (t, seed = 5) => { const r = rng(seed); let s2 = ''; for (let i = 0; i < 6; i++) { const x = ((r() * 2600 + t * (6 + r() * 8)) % 2600) - 340, y = 90 + r() * 360, w = 380 + r() * 520; s2 += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(w)}" ry="${f1(34 + r() * 30)}" fill="url(#excloud)"/>`; } return s2; };
const worker = (o) => figure({fill: EX.main, kind: 'man', hat: 'cap', coat: 'jacket', ...o});

/* ================= vertical integration ================= */
const VI = [ // the chain, left to right: x centre, tag, a handwritten owner's note
  {x: 650, tag: 'IRON ORE · MINNESOTA'},
  {x: 1700, tag: 'ORE BOATS · GREAT LAKES'},
  {x: 2750, tag: 'COKE OVENS'},
  {x: 3800, tag: 'THE STEEL MILL'},
  {x: 4800, tag: 'HIS RAILROADS'},
  {x: 5750, tag: 'THE CUSTOMERS'},
];
function viMine(t) { // an open-pit iron mine: terraces, a steam shovel swinging, ore cars rolling out
  const s = [], c = EX.set, x0 = 250, x1 = 1050;
  s.push(`<path d="M${x0},${GROUND} L${x0 + 80},${GROUND + 40} L${x0 + 160},${GROUND + 40} L${x0 + 240},${GROUND + 80} L${x1 - 240},${GROUND + 80} L${x1 - 160},${GROUND + 40} L${x1 - 80},${GROUND + 40} L${x1},${GROUND} Z" fill="#081010"/>`);
  for (const [dy, op] of [[14, 0.5], [30, 0.35], [58, 0.45]]) s.push(`<path d="M${x0 + dy * 2},${GROUND + dy} L${x1 - dy * 2},${GROUND + dy}" stroke="#3A2E28" stroke-width="${dy % 2 ? 3 : 5}" opacity="${op}"/>`); // bands of red ore in the pit walls
  s.push(`<path d="M${x0 + 250},${GROUND + 80} q140,-30 300,0 Z" fill="#3A2E28" opacity="0.8"/>`);
  const sx = 640, sy = GROUND + 80, a = 18 * Math.sin(TAU * t / 3.2);
  s.push(`<rect x="${sx - 40}" y="${sy - 50}" width="80" height="38" fill="${c}"/><rect x="${sx - 46}" y="${sy - 14}" width="92" height="14" rx="7" fill="${c}"/><rect x="${sx + 10}" y="${sy - 76}" width="10" height="28" fill="${c}"/>` + smoke(sx + 15, sy - 80, t, '#3E5F5A', 0.6, 4));
  s.push(`<g transform="rotate(${f1(-35 + a)}, ${sx + 30}, ${sy - 40})">${line([[sx + 30, sy - 40], [sx + 150, sy - 120]], c, 9)}${line([[sx + 110, sy - 96], [sx + 140, sy - 30]], c, 7)}<path d="M${sx + 125},${sy - 36} l30,0 l-6,24 l-22,0 Z" fill="${c}"/></g>`);
  for (let i = 0; i < 4; i++) { // ore cars climbing out along the rim track
    const u = ((t / 8 + i / 4) % 1), cx = x1 - 30 + u * 260;
    s.push(`<rect x="${f1(cx)}" y="${GROUND - 26}" width="46" height="20" fill="${c}"/><path d="M${f1(cx + 4)},${GROUND - 26} q19,-12 38,0 Z" fill="#2B2420"/><circle cx="${f1(cx + 10)}" cy="${GROUND - 4}" r="5" fill="${c}"/><circle cx="${f1(cx + 36)}" cy="${GROUND - 4}" r="5" fill="${c}"/>`);
  }
  s.push(worker({x: 420, y: GROUND + 40, h: 70, d: 1, prop: 'hammer', an: POSES.hammer(t, 0.2)}));
  s.push(worker({x: 880, y: GROUND + 40, h: 70, d: -1, an: POSES.iron(t, 0.6)}));
  return s.join('');
}
function viLake(t) { // a lake: an ore dock with chutes, a long ore boat
  const s = [], c = EX.set;
  s.push(MAT.water(1150, GROUND + 6, 1150, 400, t, {top: '#3E5F5A', bottom: '#0D1817', seed: 41}));
  s.push(`<rect x="1180" y="${GROUND - 160}" width="200" height="14" fill="${c}"/>`);
  for (let x = 1190; x < 1380; x += 28) s.push(`<rect x="${x}" y="${GROUND - 150}" width="8" height="170" fill="${c}"/>`);
  for (let x = 1220; x < 1380; x += 46) s.push(line([[x, GROUND - 146], [x + 50, GROUND - 90]], c, 5));
  const bob = 3 * Math.sin(TAU * t / 3.6), bx = 1430 + 30 * Math.sin(TAU * t / 20);
  s.push(`<g transform="translate(0,${f1(bob)})"><clipPath id="hull1"><path d="M${f1(bx)},${GROUND - 26} L${f1(bx + 640)},${GROUND - 26} L${f1(bx + 610)},${GROUND + 14} L${f1(bx + 20)},${GROUND + 14} Z"/></clipPath><g clip-path="url(#hull1)">${MAT.iron(bx, GROUND - 26, 640, 40, {base: c, seams: 16, rivet: 9})}</g>` +
    `<rect x="${f1(bx + 30)}" y="${GROUND - 66}" width="60" height="40" fill="${c}"/><rect x="${f1(bx + 40)}" y="${GROUND - 84}" width="40" height="18" fill="${c}"/>` +
    `<rect x="${f1(bx + 560)}" y="${GROUND - 70}" width="50" height="44" fill="${c}"/><rect x="${f1(bx + 575)}" y="${GROUND - 120}" width="16" height="50" fill="${c}"/>` +
    [0, 1, 2, 3, 4, 5, 6].map((k) => `<path d="M${f1(bx + 120 + k * 62)},${GROUND - 26} q26,-22 52,0 Z" fill="#2B2420"/>`).join('') + `</g>` + smoke(bx + 583, GROUND - 124, t, '#3E5F5A', 0.8));
  return s.join('');
}
function viCoke(t) { // a bench of beehive coke ovens, glowing, smoking
  const s = [], c = EX.set, x0 = 2420;
  s.push(MAT.brick(x0 - 20, GROUND - 70, 700, 70, {base: '#1A2E2B', seed: 42, vary: 0.4}));
  for (let i = 0; i < 9; i++) {
    const x = x0 + i * 74, fl = 0.55 + 0.2 * Math.sin(t * 5 + i * 1.7);
    s.push(`<path d="M${x},${GROUND - 70} a34,34 0 0 1 68,0 Z" fill="${c}"/><circle cx="${x + 34}" cy="${GROUND - 40}" r="34" fill="url(#exglow)" opacity="${f1(fl)}"/><path d="M${x + 22},${GROUND - 20} a12,12 0 0 1 24,0 L${x + 46},${GROUND - 6} L${x + 22},${GROUND - 6} Z" fill="${EX.glow}" opacity="${f1(fl * 0.8)}"/>`);
    if (i % 2 === 0) s.push(smoke(x + 34, GROUND - 110, t + i, '#3E5F5A', 0.7, 4));
  }
  s.push(worker({x: 2560, y: GROUND, h: 74, d: 1, prop: 'hammer', an: POSES.iron(t, 0.3)}), worker({x: 2900, y: GROUND, h: 74, d: -1, an: POSES.iron(t, 0.8)}));
  return s.join('');
}
function viMill(t) { // a blast furnace, a Bessemer converter throwing sparks, a rolling shed with a glowing rail sliding out
  const s = [], c = EX.set, r = rng(55);
  s.push(MAT.iron(3380, GROUND - 330, 90, 330, {base: c, seams: 46}) + `<rect x="3370" y="${GROUND - 340}" width="110" height="20" fill="${c}"/>`);
  for (const x of [3300, 3340]) s.push(MAT.iron(x, GROUND - 260, 34, 260, {base: c, rx: 17, seams: 40, rivet: 5}));
  s.push(smoke(3425, GROUND - 350, t, '#3E5F5A', 1.1));
  const cvx = 3640, cvy = GROUND - 120, tilt = -24;
  s.push(`<rect x="${cvx - 70}" y="${cvy}" width="12" height="120" fill="${c}"/><rect x="${cvx + 58}" y="${cvy}" width="12" height="120" fill="${c}"/>`);
  const mx = cvx - 22 + Math.sin(tilt * Math.PI / 180) * -70, my = cvy - 66;
  s.push(`<circle cx="${f1(mx)}" cy="${f1(my - 30)}" r="130" fill="url(#exglow)" opacity="0.75"/>`);
  s.push(`<g transform="rotate(${tilt}, ${cvx}, ${cvy})"><path d="M${cvx - 55},${cvy + 40} Q${cvx - 62},${cvy - 30} ${cvx - 22},${cvy - 70} L${cvx + 22},${cvy - 70} Q${cvx + 62},${cvy - 30} ${cvx + 55},${cvy + 40} Q${cvx},${cvy + 70} ${cvx - 55},${cvy + 40} Z" fill="#070B0B"/><rect x="${cvx - 62}" y="${cvy - 6}" width="124" height="10" fill="#070B0B"/><ellipse cx="${cvx}" cy="${cvy - 70}" rx="22" ry="6" fill="${EX.glow}" opacity="0.9"/></g>`);
  for (let i = 0; i < 60; i++) { // the blow: a fountain of sparks
    const ph = r(), u = ((t * 0.9 + ph) % 1), ang = -Math.PI / 2 - 0.5 + r() * 0.8, sp = 220 + r() * 160;
    const x = mx + Math.cos(ang) * sp * u, y = my + Math.sin(ang) * sp * u + 260 * u * u;
    s.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(2.6 * (1 - u) + 0.8)}" fill="${EX.glow}" opacity="${f1(1 - u)}"/>`);
  }
  s.push(MAT.brick(3800, GROUND - 120, 460, 120, {base: '#16292A', seed: 43, vary: 0.35}) + `<path d="M3790,${GROUND - 120} L4030,${GROUND - 180} L4270,${GROUND - 120} Z" fill="${c}"/>`);
  const rx = 3900 + ((t * 70) % 500);
  s.push(`<rect x="${f1(rx)}" y="${GROUND - 22}" width="140" height="7" fill="${EX.glow}" opacity="0.85"/><rect x="${f1(rx - 10)}" y="${GROUND - 34}" width="170" height="28" fill="url(#exglow)" opacity="0.6"/>`);
  s.push(worker({x: 3560, y: GROUND, h: 74, d: 1, an: {...POSES.stand(t, 0.4), fArm: [120, 110], tilt: 10}}));
  return s.join('');
}
function viRail(t) { // his railroad: a locomotive pulling flatcars of new rails
  const s = [], c = EX.set, tx = 4380 + ((t * 120) % 900);
  s.push(`<rect x="${f1(tx)}" y="${GROUND - 60}" width="90" height="40" fill="${c}"/><rect x="${f1(tx + 60)}" y="${GROUND - 92}" width="40" height="72" fill="${c}"/><rect x="${f1(tx + 10)}" y="${GROUND - 90}" width="14" height="30" fill="${c}"/>` +
    `<path d="M${f1(tx - 6)},${GROUND - 20} L${f1(tx + 6)},${GROUND - 40} L${f1(tx + 6)},${GROUND - 20} Z" fill="${c}"/>` + smoke(tx + 17, GROUND - 96, t, '#3E5F5A', 0.8, 5));
  for (const wx of [20, 50, 80]) s.push(`<circle cx="${f1(tx + wx)}" cy="${GROUND - 12}" r="10" fill="${c}"/>`);
  for (let k = 1; k <= 3; k++) { const cx = tx - k * 140; s.push(`<rect x="${f1(cx)}" y="${GROUND - 28}" width="126" height="10" fill="${c}"/><rect x="${f1(cx + 4)}" y="${GROUND - 40}" width="118" height="10" fill="#2B4744"/>` + `<circle cx="${f1(cx + 20)}" cy="${GROUND - 10}" r="8" fill="${c}"/><circle cx="${f1(cx + 106)}" cy="${GROUND - 10}" r="8" fill="${c}"/>`); }
  return s.join('');
}
function viCity(t) { // the customers: a city of iron and steel; a steel frame going up, a crane lifting a beam; a bridge
  const s = [], c = EX.set, r = rng(66);
  for (let x = 5300, i = 0; x < 6300; i++) { const w = 60 + r() * 80, h = 80 + r() * 160; s.push(i % 2 ? MAT.brick(x, GROUND - h, w, h, {base: '#14262A', seed: 60 + i, vary: 0.3, bw: 16, bh: 8}) : `<rect x="${f1(x)}" y="${f1(GROUND - h)}" width="${f1(w)}" height="${f1(h)}" fill="${c}"/>`); x += w + 6; }
  const fx = 5640;
  for (let k = 0; k < 6; k++) s.push(`<rect x="${fx}" y="${GROUND - 60 - k * 50}" width="200" height="5" fill="${c}"/>`);
  for (const x of [fx, fx + 66, fx + 132, fx + 195]) s.push(`<rect x="${x}" y="${GROUND - 320}" width="5" height="320" fill="${c}"/>`);
  const lift = 20 * Math.sin(TAU * t / 6);
  s.push(line([[fx + 260, GROUND], [fx + 260, GROUND - 420], [fx + 40, GROUND - 400]], c, 6) + line([[fx + 110, GROUND - 405], [fx + 110, GROUND - 330 + lift]], c, 1.5) + `<rect x="${fx + 60}" y="${f1(GROUND - 330 + lift)}" width="100" height="6" fill="${c}"/>`);
  s.push(worker({x: fx + 100, y: GROUND - 260, h: 50, d: 1, prop: 'hammer', an: POSES.hammer(t, 0.4)}));
  return s.join('');
}
// The camera hops from step to step and holds on each (about 1.5 s), so the narration can name it, then pulls back.
const VI_HOLD = 1.5, VI_MOVE = 0.9, VI_T0 = 0.4, VI_Z = 1.8, VI_UY = 659;
function viCam(t) {
  const n = VI.length, seg = VI_HOLD + VI_MOVE, endHold = VI_T0 + (n - 1) * seg + VI_HOLD + 0.6;
  if (t < endHold) {
    const k = Math.max(0, Math.min(n - 1, Math.floor((t - VI_T0) / seg))), local = t - VI_T0 - k * seg;
    if (k >= n - 1 || local < VI_HOLD) return {z: VI_Z, ux: VI[Math.min(k, n - 1)].x, uy: VI_UY};
    const u = ease((local - VI_HOLD) / VI_MOVE);
    return {z: VI_Z, ux: VI[k].x + (VI[k + 1].x - VI[k].x) * u, uy: VI_UY};
  }
  const u = ease((t - endHold) / 3.4);
  return {z: lerpLog(VI_Z, 0.31, u), ux: VI[n - 1].x + (3200 - VI[n - 1].x) * u, uy: VI_UY + (560 - VI_UY) * u};
}
const VI_PULL = VI_T0 + (VI.length - 1) * (VI_HOLD + VI_MOVE) + VI_HOLD + 0.6; // when the pull-back starts (~14.5 s)
function renderVI(t) {
  const c = cam2(viCam(t)), world = [];
  world.push(layerAt(c, 0.3, farHills(6400, EX.far, GROUND - 120, 3, 160, 18), {soft: 0.004, fine: 0.05, k: 0.22, seed: 3}));
  world.push(layerAt(c, 0.6, farHills(6400, EX.mid, GROUND - 40, 4, 90, 30), {soft: 0.006, fine: 0.07, k: 0.28, seed: 4}) + layerAt(c, 0.6, `<rect x="-3000" y="${GROUND - 70}" width="12000" height="90" fill="url(#exmist)"/>`));
  const main = [`<rect x="-3000" y="${GROUND}" width="12000" height="3000" fill="${EX.main}"/>`];
  main.push(`<rect x="-3000" y="${GROUND - 4}" width="12000" height="4" fill="#1A2826"/>`); // one track runs the whole chain
  { const [vx, , vw] = visibleRect(c, 1, 100); main.push(MAT.ground(Math.max(-2900, vx), vx + vw, GROUND, {base: EX.main, seed: 71})); }
  main.push(viMine(t), viLake(t), viCoke(t), viMill(t), viRail(t), viCity(t));
  world.push(layerAt(c, 1, main.join(''), {soft: 0.008, fine: 0.11, k: 0.2, seed: 11}));
  main.length = 0;
  // the teal chain: drawn up to just past the camera, with a ring at each step it reaches; full when the camera pulls back
  const reach = t < VI_PULL ? c.ux + 40 : 99999, pts2 = [];
  for (const st of VI) { if (st.x <= reach) pts2.push([st.x, GROUND - 330]); }
  if (pts2.length && reach < 99999) { const last = VI.find((s2) => s2.x > reach); if (last) { const p0 = pts2[pts2.length - 1], u = clamp01((reach - p0[0]) / (last.x - p0[0])); pts2.push([p0[0] + (last.x - p0[0]) * u, GROUND - 330]); } }
  const chain = pts2.length > 1 ? `<polyline points="${pts(pts2)}" fill="none" stroke="#111" stroke-width="12" vector-effect="non-scaling-stroke" stroke-linecap="round"/><polyline points="${pts(pts2)}" fill="none" stroke="${EX.teal}" stroke-width="7" vector-effect="non-scaling-stroke" stroke-linecap="round"/>` : '';
  main.push(chain); // the teal chain and its rings, untextured, on their own layer
  for (const st of VI) if (st.x <= reach) main.push(`<circle cx="${st.x}" cy="${GROUND - 330}" r="22" fill="#0D0C09" stroke="${EX.teal}" stroke-width="6" vector-effect="non-scaling-stroke"/>` + `<line x1="${st.x}" y1="${GROUND - 448}" x2="${st.x}" y2="${GROUND - 120}" stroke="${EX.teal}" stroke-width="2" stroke-dasharray="6 8" vector-effect="non-scaling-stroke" opacity="0.6"/>`);
  world.push(layerAt(c, 1, main.join('')));
  // screen-space labels
  const scr = [];
  for (const st of VI) if (st.x <= reach) { const x = c.sx(st.x), y = c.sy(GROUND - 330) - 40; if (x > -300 && x < 2200) scr.push(tag(x - st.tag.length * 7.2, y, st.tag, t < VI_PULL ? 1 : 1 - smooth(VI_PULL + 0.2, VI_PULL + 1, t))); }
  scr.push(tag(40, 1040, 'ANDREW CARNEGIE · STEEL · 1870s TO 1890s', 1));
  // Stand it up: the six steps fly out of the landscape into a column, raw material at the bottom, the customer at the top.
  // This is what "vertical" means: every level of making one thing, owned by one company.
  const S0 = VI_PULL + 3.7, dimU = smooth(S0 - 0.3, S0 + 0.3, t);
  if (dimU > 0) scr.push(`<rect width="1920" height="1080" fill="rgba(13,12,9,${f1(dimU * 0.62 * 100) / 100})"/>`);
  const icons = ['mine', 'ship', 'ovens', 'mill', 'train', 'city'], colX = 1440, tileW = 400, tileH = 100, gap = 118, yBottom = 930;
  let topReached = null;
  VI.forEach((st, i) => {
    const ts = S0 + i * 0.32, u = ease(clamp01((t - ts) / 0.8));
    if (t < ts) return;
    const fx = c.sx(st.x) - tileW / 2, fy = c.sy(GROUND - 330) - tileH / 2, tx = colX, ty = yBottom - i * gap - tileH / 2;
    const x = fx + (tx - fx) * u, y = fy + (ty - fy) * u;
    if (u > 0.98) topReached = ty + tileH / 2;
    scr.push(`<g transform="translate(${f1(x)},${f1(y)})"><rect width="${tileW}" height="${tileH}" rx="10" fill="#0D0C09" stroke="${EX.teal}" stroke-width="3"/>${icon(icons[i], 14, 10, 1)}<text x="160" y="${tileH / 2 + 10}" font-family="Mono" font-size="24" letter-spacing="1" fill="${EX.cream}">${['IRON MINE', 'ORE BOATS', 'COKE OVENS', 'STEEL MILL', 'RAILROADS', 'CUSTOMERS'][i]}</text></g>`);
  });
  if (topReached !== null) { // the teal spine of the column, and an arrow up
    const yb = yBottom, x = colX - 40;
    scr.push(`<line x1="${x}" y1="${yb}" x2="${x}" y2="${f1(topReached)}" stroke="#111" stroke-width="12" stroke-linecap="round"/><line x1="${x}" y1="${yb}" x2="${x}" y2="${f1(topReached)}" stroke="${EX.teal}" stroke-width="7" stroke-linecap="round"/>`);
    if (topReached <= yBottom - 5 * gap + 1) scr.push(`<path d="M${x - 18},${topReached + 4} L${x},${topReached - 26} L${x + 18},${topReached + 4}" fill="none" stroke="${EX.teal}" stroke-width="7" stroke-linejoin="round"/>` +
      penS(colX - 470, yBottom - 4, 'raw material', 30, -3) + penS(colX - 430, yBottom - 5 * gap + 10, 'the customer', 30, -3));
  }
  if (t > S0 + 3.4) scr.push(penS(80, 330, 'carnegie owned every step', 44, -3));
  scr.push(tapeS(80, 70, 'VERTICAL INTEGRATION', 74, -2, smooth(S0 + 2.8, S0 + 3.3, t)));
  scr.push(card(80, 560, 'VERTICAL INTEGRATION', 'Owning every step of making and|moving your product, from the raw|material to the customer.', null, smooth(S0 + 4.2, S0 + 4.8, t)));
  return frame(exDefs(t), `<rect width="1920" height="1080" fill="url(#exsky)"/>${clouds(t)}`, world.join(''), scr.join(''), t);
}

/* ================= horizontal integration ================= */
const HI_N = 26, HI_X0 = 820, HI_STEP = 300;
const hiPos = (i) => ({x: HI_X0 + 520 + Math.floor(i / 2) * HI_STEP + (i % 2) * 150, back: i % 2 === 1});
const HI_BOUGHT = (() => { const r = rng(91), idx = [...Array(HI_N).keys()], out = []; while (out.length < 22) { const k = Math.floor(r() * idx.length); out.push(idx.splice(k, 1)[0]); } return out; })();
const hiStop = (i) => { const k = HI_BOUGHT.indexOf(i); return k < 0 ? Infinity : 12.4 + k * 0.3; };
function refinery(x, t, i, big = false, back = false) {
  const s = [], c = back ? '#1D3432' : EX.set, stopT = big ? Infinity : hiStop(i), gone = t > stopT, fade = big ? 1 : 1 - smooth(stopT, stopT + 0.6, t);
  const w = big ? 300 : 150, h = big ? 120 : 90;
  s.push(`<rect x="${x}" y="${GROUND - h}" width="${w}" height="${h}" fill="${c}"/>${MAT.brick(x, GROUND - h, w, h, {base: c, seed: 100 + i, vary: 0.35, bw: big ? 24 : 18, bh: big ? 12 : 9})}<path d="M${x - 6},${GROUND - h} L${x + w / 2},${GROUND - h - (big ? 50 : 30)} L${x + w + 6},${GROUND - h} Z" fill="${c}"/>`);
  const chims = big ? [x + 40, x + 140, x + 240] : [x + 108];
  for (const cx of chims) { s.push(`<rect x="${cx}" y="${GROUND - h - (big ? 190 : 170)}" width="${big ? 18 : 14}" height="${big ? 190 : 170}" fill="${c}"/>`); if (fade > 0.02) s.push(`<g opacity="${f1(fade * 100) / 100}">${smoke(cx + 7, GROUND - h - (big ? 196 : 176), t + i * 0.7, '#3E5F5A', big ? 1 : 0.8, 5)}</g>`); }
  s.push(MAT.iron(x + (big ? -90 : -46), GROUND - (big ? 80 : 50), big ? 80 : 40, big ? 80 : 50, {base: c, rx: big ? 8 : 5, seams: big ? 26 : 18, rivet: 5}) + `<ellipse cx="${x + (big ? -50 : -26)}" cy="${GROUND - (big ? 80 : 50)}" rx="${big ? 40 : 20}" ry="${big ? 8 : 5}" fill="#1D3230"/>`);
  if (!big) s.push(`<rect x="${x + 18}" y="${GROUND - 60}" width="20" height="26" fill="${EX.glow}" opacity="${f1(0.45 * fade * 100) / 100}"/><rect x="${x + 52}" y="${GROUND - 60}" width="20" height="26" fill="${EX.glow}" opacity="${f1(0.35 * fade * 100) / 100}"/>`); // lit windows while it still works
  if (!big && gone) s.push(`<rect x="${x - 4}" y="${GROUND - h - 4}" width="${w + 8}" height="${h + 4}" fill="none" stroke="${EX.teal}" stroke-width="4" vector-effect="non-scaling-stroke" opacity="${f1(smooth(stopT, stopT + 0.5, t) * 100) / 100}"/>`);
  return s.join('');
}
function hiDepot(t) { // the railroad freight office: a clerk, two shippers, barrels; the rebate passed back under the counter
  const s = [], c = EX.set, x0 = 200;
  s.push(`${MAT.planks(x0, GROUND - 150, 440, 150, {base: '#16292A', seed: 91, size: 16, vertical: true})}<path d="M${x0 - 20},${GROUND - 150} L${x0 + 220},${GROUND - 200} L${x0 + 460},${GROUND - 150} Z" fill="${c}"/>`);
  s.push(`<rect x="${x0 + 200}" y="${GROUND - 60}" width="70" height="60" fill="${c}"/><rect x="${x0 + 190}" y="${GROUND - 64}" width="90" height="6" fill="${c}"/>`);
  s.push(worker({x: x0 + 300, y: GROUND, h: 82, d: -1, hat: 'bowler', coat: 'vest', an: {...POSES.stand(t, 0.1), fArm: [112, 100], tilt: -6}})); // the clerk
  // the big shipper (left) with many barrels; the small one (right) with a few
  for (let k = 0; k < 10; k++) s.push(FU.barrel(x0 + 10 + (k % 5) * 24, GROUND - Math.floor(k / 5) * 28, 22, 28));
  s.push(worker({x: x0 + 160, y: GROUND, h: 84, d: 1, hat: 'top', coat: 'frock', an: {...POSES.stand(t, 0.4), fArm: [118 + 10 * smooth(6.2, 6.8, t), 110]}}));
  for (let k = 0; k < 2; k++) s.push(FU.barrel(x0 + 520 + k * 24, GROUND, 22, 28));
  s.push(worker({x: x0 + 470, y: GROUND, h: 82, d: -1, hat: 'bowler', coat: 'sack', an: {...POSES.stand(t, 0.7), expr: 'worried'}}));
  // the rebate: a bag of coins slides back to the big shipper, low, under the counter
  const u = smooth(6.0, 7.6, t) * (1 - smooth(9.4, 9.9, t));
  if (u > 0.01) { const bx = x0 + 250 - 70 * u, by = GROUND - 14; s.push(`<g opacity="${f1(Math.min(1, u * 3) * 100) / 100}"><path d="M${x0 + 262},${GROUND - 8} Q${x0 + 225},${GROUND + 18} ${x0 + 178},${GROUND - 4}" fill="none" stroke="#111" stroke-width="6"/><path d="M${x0 + 262},${GROUND - 8} Q${x0 + 225},${GROUND + 18} ${x0 + 178},${GROUND - 4}" fill="none" stroke="${EX.teal}" stroke-width="3"/><path d="M${x0 + 186},${GROUND - 12} L${x0 + 176},${GROUND - 4} L${x0 + 188},${GROUND + 2}" fill="none" stroke="${EX.teal}" stroke-width="3"/><path d="M${f1(bx - 13)},${by} q13,-28 26,0 Z" fill="${EX.cream}"/><rect x="${f1(bx - 5)}" y="${by - 26}" width="10" height="5" fill="${EX.cream}"/></g>`); }
  return s.join('');
}
function hiCam(t) {
  const wide = {z: 0.45, ux: 2640, uy: 470}, depot = {z: 1.55, ux: 470, uy: 720};
  if (t < 3.6) return wide;
  if (t < 5.4) { const u = ease((t - 3.6) / 1.8); return {z: lerpLog(wide.z, depot.z, u), ux: wide.ux + (depot.ux - wide.ux) * u, uy: wide.uy + (depot.uy - wide.uy) * u}; }
  if (t < 10) { // lean in on the counter while the money changes hands
    const u = smooth(5.9, 6.6, t) * (1 - smooth(9.0, 9.8, t));
    return {z: lerpLog(depot.z, 2.4, u), ux: depot.ux + (440 - depot.ux) * u, uy: depot.uy + (770 - depot.uy) * u};
  }
  if (t < 11.8) { const u = ease((t - 10) / 1.8); return {z: lerpLog(depot.z, wide.z, u), ux: depot.ux + (wide.ux - depot.ux) * u, uy: depot.uy + (wide.uy - depot.uy) * u}; }
  return wide;
}
function renderHI(t) {
  const c = cam2(hiCam(t)), world = [];
  world.push(layerAt(c, 0.3, farHills(6000, EX.far, GROUND - 200, 7, 140, 18), {soft: 0.004, fine: 0.05, k: 0.22, seed: 7}));
  world.push(layerAt(c, 0.6, farHills(6000, EX.mid, GROUND - 80, 8, 70, 30), {soft: 0.006, fine: 0.07, k: 0.28, seed: 8}));
  const main = [`<rect x="-3000" y="${GROUND}" width="12000" height="3000" fill="${EX.main}"/>`];
  { const [vx, , vw] = visibleRect(c, 1, 100); main.push(MAT.water(Math.max(-2900, vx), GROUND + 90, Math.min(vw, 9000), 1200, t, {top: '#2B4A47', bottom: '#0B1514', seed: 81, n: 90}), MAT.ground(Math.max(-2900, vx), vx + vw, GROUND, {base: EX.main, seed: 82, tufts: false})); }
  main.push(`<rect x="-3000" y="${GROUND + 6}" width="12000" height="4" fill="#1A2826"/>`); // the railroad along the river
  { // oil tank cars rolling along the near bank, and a barge on the river
    const tx = -400 + ((t * 90) % 1400);
    for (let k = 0; k < 9; k++) { const x = tx + k * 210 + 600; main.push(`<rect x="${f1(x)}" y="${GROUND + 34}" width="180" height="12" fill="${EX.set}"/><rect x="${f1(x + 10)}" y="${GROUND - 6}" width="160" height="40" rx="20" fill="${EX.set}"/><rect x="${f1(x + 80)}" y="${GROUND - 16}" width="20" height="12" fill="${EX.set}"/><circle cx="${f1(x + 30)}" cy="${GROUND + 50}" r="9" fill="${EX.set}"/><circle cx="${f1(x + 150)}" cy="${GROUND + 50}" r="9" fill="${EX.set}"/>`); }
    const bx = 4200 - ((t * 40) % 2600);
    main.push(`<path d="M${f1(bx)},${GROUND + 200} L${f1(bx + 420)},${GROUND + 200} L${f1(bx + 390)},${GROUND + 236} L${f1(bx + 30)},${GROUND + 236} Z" fill="${EX.set}"/>` + [0, 1, 2, 3, 4, 5].map((k) => FU.barrel(bx + 40 + k * 56, GROUND + 200, 40, 44)).join(''));
  }
  main.push(hiDepot(t), refinery(HI_X0 - 40, t, -1, true));
  for (let i = 0; i < HI_N; i++) { const q = hiPos(i); if (q.back) main.push(`<g transform="translate(0,-70)">${refinery(q.x, t, i, false, true)}</g>`); }
  main.push(`<rect x="${HI_X0 + 420}" y="${GROUND - 70}" width="4200" height="70" fill="#162827"/>`);
  for (let i = 0; i < HI_N; i++) { const q = hiPos(i); if (!q.back) main.push(refinery(q.x, t, i)); }
  // the pipeline: one teal trunk from Standard Oil, a branch down to each refinery as it is bought
  const trunkY = GROUND - 420, boughtNow = HI_BOUGHT.filter((i) => t >= hiStop(i));
  if (boughtNow.length) {
    const far = Math.max(...boughtNow.map((i) => hiPos(i).x + 75 + (t - hiStop(i) < 0.4 ? 0 : 0)));
    const tl = `M${HI_X0 + 110},${GROUND - 330} L${HI_X0 + 110},${trunkY} L${far},${trunkY}`;
    main.push(`<path d="${tl}" fill="none" stroke="#111" stroke-width="9" vector-effect="non-scaling-stroke"/><path d="${tl}" fill="none" stroke="${EX.teal}" stroke-width="5" vector-effect="non-scaling-stroke"/>`);
    for (const i of boughtNow) {
      const q = hiPos(i), u = smooth(hiStop(i), hiStop(i) + 0.45, t), x = q.x + 75, yEnd = GROUND - (q.back ? 70 : 0) - 95;
      const d = `M${x},${trunkY} L${x},${f1(trunkY + (yEnd - trunkY) * u)}`;
      main.push(`<path d="${d}" fill="none" stroke="#111" stroke-width="7" vector-effect="non-scaling-stroke"/><path d="${d}" fill="none" stroke="${EX.teal}" stroke-width="3.5" vector-effect="non-scaling-stroke"/>`);
    }
  }
  // barrels rolled along the bank by a worker, to keep the wide shot alive
  const wx = 900 + ((t * 60) % 3800);
  main.push(worker({x: wx, y: GROUND, h: 74, d: 1, an: {...walkAn(walkPhase(t * 60, 74)), fArm: [140, 120]}}) + FU.barrel(wx + 30, GROUND, 22, 28));
  world.push(layerAt(c, 1, main.join(''), {soft: 0.008, fine: 0.11, k: 0.2, seed: 12}));
  // screen-space labels
  const scr = [];
  scr.push(tag(40, 1040, 'CLEVELAND · FEBRUARY TO MARCH 1872', 1));
  const std = [c.sx(HI_X0 + 110), c.sy(GROUND - 360)];
  if (t < 3.8 || t > 11.6) scr.push(tag(std[0] - 90, std[1] - 30, 'STANDARD OIL', 1));
  if (t < 3.8) scr.push(tag(c.sx(HI_X0 + 2700) - 160, c.sy(GROUND - 470), '26 RIVAL REFINERIES', 1));
  if (t > 4.6 && t < 10.4) {
    const op = smooth(4.8, 5.4, t) * (1 - smooth(9.8, 10.3, t));
    scr.push(penS(c.sx(560), c.sy(GROUND - 150), 'the railroad clerk', 28, -3, EX.orange).replace('<text', `<text opacity="${op}"`));
    scr.push(penS(c.sx(270), c.sy(GROUND - 120), 'the big shipper', 28, -3, EX.orange).replace('<text', `<text opacity="${op}"`));
    scr.push(penS(c.sx(640), c.sy(GROUND - 104), 'a rival', 28, -3, EX.orange).replace('<text', `<text opacity="${op}"`));
    if (t > 6.6) scr.push(penS(140, 960, 'a rebate: money paid back in secret', 34, -2).replace('<text', `<text opacity="${op}"`));
    // freight cost per barrel: two bars
    const bw = (v) => 380 * v, by = 160, k = smooth(7.6, 8.4, t);
    scr.push(`<g opacity="${f1(op * 100) / 100}"><rect x="1150" y="${by - 52}" width="730" height="250" fill="rgba(13,12,9,0.86)"/><text x="1224" y="${by - 6}" font-family="Mono" font-size="28" letter-spacing="2" fill="${EX.cream}">SHIPPING COST PER BARREL</text>` +
      `<text x="1224" y="${by + 50}" font-family="Mono" font-size="26" fill="${EX.cream}">RIVAL</text><rect x="1420" y="${by + 30}" width="${bw(1)}" height="28" fill="${EX.cream}" opacity="0.85"/>` +
      `<text x="1224" y="${by + 120}" font-family="Mono" font-size="26" fill="${EX.cream}">STANDARD</text><rect x="1420" y="${by + 100}" width="${f1(bw(1 - 0.45 * k))}" height="28" fill="${EX.teal}"/></g>`);
  }
  if (t > 12.2) { const n = HI_BOUGHT.filter((i) => t >= hiStop(i) + 0.3).length; scr.push(tag(1340, 1040, `BOUGHT: ${n} OF 26 RIVALS`, 1)); }
  const out = 1 - smooth(24.4, 24.9, t); // the term, then the side-by-side comparison
  scr.push(tapeS(80, 70, 'HORIZONTAL INTEGRATION', 70, -2, smooth(19.6, 20.1, t) * out));
  scr.push(card(1040, 560, 'HORIZONTAL INTEGRATION', 'Buying or merging with your|competitors, the companies that|do the same job you do.', null, smooth(20.8, 21.4, t) * out));
  if (t > 21.6 && out > 0.01) scr.push(`<g opacity="${f1(out * 100) / 100}">${penS(100, 330, 'rockefeller bought his rivals', 44, -3)}</g>`);
  scr.push(compare(t, 25.0));
  return frame(exDefs(t), `<rect width="1920" height="1080" fill="url(#exsky)"/>${clouds(t)}`, world.join(''), scr.join(''), t);
}

// Small cream silhouettes for the diagrams (box about 130 x 80)
function icon(kind, x, y, k = 1, col = '#DFE0D6') {
  const g = (b) => `<g transform="translate(${x},${y}) scale(${k})" fill="${col}">${b}</g>`;
  switch (kind) {
    case 'mine': return g(`<path d="M0,40 L20,52 L40,52 L55,66 L95,66 L110,52 L130,52 L130,80 L0,80 Z" opacity="0.35"/><rect x="62" y="44" width="30" height="14"/><path d="M78,44 L104,14 L110,18 L86,48 Z"/><path d="M100,12 l18,0 l-4,14 l-12,0 Z"/>`);
    case 'ship': return g(`<path d="M2,52 L128,52 L120,70 L10,70 Z"/><rect x="10" y="34" width="20" height="18"/><rect x="104" y="30" width="16" height="22"/><rect x="109" y="12" width="7" height="18"/><path d="M36,52 q10,-10 20,0 M60,52 q10,-10 20,0 M84,52 q8,-8 16,0" stroke="${col}" stroke-width="3" fill="none"/>`);
    case 'ovens': return g(`<rect x="0" y="58" width="130" height="20"/>` + [0, 1, 2, 3].map((i) => `<path d="M${6 + i * 31},58 a14,14 0 0 1 28,0 Z"/>`).join('') + `<circle cx="40" cy="30" r="10" opacity="0.4"/><circle cx="58" cy="18" r="13" opacity="0.3"/>`);
    case 'mill': return g(`<rect x="6" y="6" width="22" height="72"/><rect x="40" y="46" width="88" height="32"/><path d="M38,46 L84,30 L130,46 Z"/><path d="M50,40 q-6,-20 6,-30 l14,0 q8,12 0,30 Z" transform="rotate(-20,60,30)"/>`);
    case 'train': return g(`<rect x="76" y="40" width="40" height="26"/><rect x="100" y="24" width="20" height="42"/><rect x="82" y="26" width="8" height="14"/><rect x="4" y="52" width="66" height="10"/><circle cx="16" cy="68" r="7"/><circle cx="58" cy="68" r="7"/><circle cx="90" cy="70" r="8"/><circle cx="110" cy="70" r="8"/>`);
    case 'city': return g(`<rect x="0" y="40" width="26" height="40"/><rect x="30" y="22" width="22" height="58"/><rect x="56" y="48" width="20" height="32"/><path d="M84,80 L84,20 L88,20 L88,80 Z M84,24 L126,28 L126,32 L88,30 Z"/><rect x="104" y="30" width="2" height="22"/><rect x="96" y="52" width="20" height="5"/>`);
    case 'refinery': return g(`<rect x="10" y="40" width="70" height="40"/><path d="M6,40 L45,24 L84,40 Z"/><rect x="60" y="6" width="9" height="40"/><rect x="92" y="50" width="34" height="30" rx="5"/><ellipse cx="109" cy="50" rx="17" ry="4"/>`);
  }
  return '';
}
// The side-by-side card: vertical (Carnegie, one company owns every step of one product) vs horizontal (Rockefeller, one company
// owns every rival doing the same step).
function compare(t, t0) {
  const u = smooth(t0 - 0.4, t0 + 0.3, t);
  if (u <= 0.01) return '';
  const s2 = [`<rect width="1920" height="1080" fill="rgba(13,12,9,${f1(u * 0.78 * 100) / 100})"/>`];
  const appear = (k) => smooth(t0 + k, t0 + k + 0.4, t);
  // left: vertical
  const vx = 300, steps = ['mine', 'ship', 'ovens', 'mill', 'train', 'city'];
  steps.forEach((k, i) => { const a = appear(0.3 + i * 0.18); s2.push(`<g opacity="${f1(a * 100) / 100}"><rect x="${vx - 10}" y="${878 - i * 108}" width="152" height="96" rx="8" fill="#0D0C09" stroke="${EX.teal}" stroke-width="3"/>${icon(k, vx + 1, 886 - i * 108, 1)}</g>`); });
  const va = appear(1.6);
  s2.push(`<g opacity="${f1(va * 100) / 100}"><line x1="${vx - 40}" y1="960" x2="${vx - 40}" y2="340" stroke="${EX.teal}" stroke-width="7" stroke-linecap="round"/><path d="M${vx - 58},350 L${vx - 40},322 L${vx - 22},350" fill="none" stroke="${EX.teal}" stroke-width="7"/></g>`);
  s2.push(`<g opacity="${f1(appear(1.9) * 100) / 100}">${tapeS(150, 120, 'VERTICAL', 64, -2, 1, 21)}${tag(160, 290, 'EVERY STEP, ONE COMPANY', 1)}${penS(vx + 190, 640, 'carnegie', 40, -4)}</g>`);
  // right: horizontal
  const hy = 640;
  for (let i = 0; i < 5; i++) { const a = appear(2.4 + i * 0.18); s2.push(`<g opacity="${f1(a * 100) / 100}"><rect x="${930 + i * 186}" y="${hy - 48}" width="160" height="96" rx="8" fill="#0D0C09" stroke="${EX.teal}" stroke-width="3"/>${icon('refinery', 944 + i * 186, hy - 40, 1)}</g>`); }
  const ha = appear(3.4);
  s2.push(`<g opacity="${f1(ha * 100) / 100}"><line x1="920" y1="${hy + 80}" x2="1830" y2="${hy + 80}" stroke="${EX.teal}" stroke-width="7" stroke-linecap="round"/><path d="M1818,${hy + 62} L1846,${hy + 80} L1818,${hy + 98}" fill="none" stroke="${EX.teal}" stroke-width="7"/></g>`);
  s2.push(`<g opacity="${f1(appear(3.7) * 100) / 100}">${tapeS(960, 330, 'HORIZONTAL', 64, -2, 1, 22)}${tag(970, 500, 'ONE STEP, EVERY RIVAL', 1)}${penS(1300, 820, 'rockefeller', 40, -4)}</g>`);
  return `<g opacity="${f1(u * 100) / 100}">${s2.join('')}</g>`;
}

Object.assign(CLIPS, {
  vi_explainer: {sec: 28, render: (t) => renderVI(t)},
  hi_explainer: {sec: 31, render: (t) => renderHI(t)},
});
if (typeof window !== 'undefined') Object.assign(window, {renderVI, renderHI});
