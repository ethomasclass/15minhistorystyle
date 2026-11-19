// Thanksgiving ("From Eels to This"): drawn silhouette scenes on the Gilded Age look-dev kit. Load after mansion.js and ep2_more.js
// (uses rig.js figure / POSES / walkAn / MAT, explainers.js frame / layerAt / cam2 / tag, mansion.js msDefs / glowC).
//
//   tg_eel_river          A tidal river at dawn, 1621: far trees, mist, a dugout canoe drawn up, mud flats, reeds. A figure wades
//                         out, treads the mud; eels come up round the feet; a second figure brings a rush basket (coral: the
//                         subject is the catch). 14 s, a slow side-scroll.
//   tg_victorian_kitchen  A big house's basement kitchen at night, about 1860: the cast-iron range under its hood, copper pans, a
//                         stockpot of calves' feet steaming, a jelly bag dripping into a bowl, the clock running the hours away.
//                         The cook stirs; a kitchen maid carries a bowl across; the copper jelly mould on the table is coral. 12 s.
//
// Everything is a pure function of t, as the rest of the kit. Rules followed: solid silhouettes in the wide (the kit's level of
// detail), characters at the full frame rate, parallax planes, no real person as a likeness (the 1621 figures are anonymous, solid,
// faceless: det 0). Rules bent on purpose (the user, Nov 19: "break brand rules if we need to"): the palettes are warmer and
// brighter than the series' teal-slate (a peach and gold dawn; firelight and copper in the kitchen), and coral marks an object
// (the basket, the mould), not a person.
// The 1621 figures wear period outlines added to rig.js (RIG.md, "Added for Thanksgiving"). More scenes: tg_b.js (dock, dining hall),
// tg_c.js (1950s kitchen), tg_d.js (the 3D table).

const TG = {ink: '#0D0C09', coral: '#FF6F61', cream: '#F4EFE6', teal: '#2FE0C4', copper: '#C47A45', copperD: '#7A4526', fire: '#FF9F3C', gold: '#F2C277', peach: '#F0A982',
  mud: '#2A2A26', mudL: '#4A463C', reed: '#16201C', water0: '#E8B58A', water1: '#3E6A70', far: '#5C7F86', mid: '#33545A'};

const tgDefs = (t) => msDefs(t).replace('</defs>',
  grad('tgdawn', [['0', '#1E3A4C'], ['0.38', '#4F7C86'], ['0.62', '#D99A7C'], ['0.8', '#F2C277'], ['1', '#F7E3B4']]) +
  grad('tgwater', [['0', '#F2C79A', 0.95], ['0.25', '#B98F7E'], ['0.6', '#3E6A70'], ['1', '#16303A']]) +
  grad('tgpool', [['0', '#D9A882'], ['0.45', '#8E7A6C'], ['1', '#3E5A5E']]) + grad('tgmist', [['0', '#F7E3B4', 0], ['0.5', '#F7E3B4', 0.5], ['1', '#F7E3B4', 0]]) +
  grad('tgwall', [['0', '#17100C'], ['0.5', '#2B1E16'], ['1', '#3A281B']]) +
  grad('tgnightwin', [['0', '#16263F'], ['1', '#3B5A80']]) +
  `<radialGradient id="tgsun"><stop offset="0" stop-color="#FFF6D8" stop-opacity="0.95"/><stop offset="0.25" stop-color="#FFD9A0" stop-opacity="0.55"/><stop offset="1" stop-color="#FFD9A0" stop-opacity="0"/></radialGradient>` +
  `<radialGradient id="tgfire"><stop offset="0" stop-color="#FFB35A" stop-opacity="0.75"/><stop offset="0.45" stop-color="#FF8A3C" stop-opacity="0.28"/><stop offset="1" stop-color="#FF8A3C" stop-opacity="0"/></radialGradient>` +
  `<radialGradient id="tggas"><stop offset="0" stop-color="#FFF1C4" stop-opacity="0.7"/><stop offset="0.4" stop-color="#FFE0A0" stop-opacity="0.22"/><stop offset="1" stop-color="#FFE0A0" stop-opacity="0"/></radialGradient>` +
  `<linearGradient id="tgcop" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5A311B"/><stop offset="0.35" stop-color="#E0975A"/><stop offset="0.55" stop-color="#C47A45"/><stop offset="1" stop-color="#4A2815"/></linearGradient>` +
  `<linearGradient id="tgcoral" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B8463C"/><stop offset="0.35" stop-color="#FF9A8C"/><stop offset="0.6" stop-color="#FF6F61"/><stop offset="1" stop-color="#9A382F"/></linearGradient>` +
 ['F4EFE6', 'FFE0B0'].map((c) => `<radialGradient id="puff${c}"><stop offset="0" stop-color="#${c}" stop-opacity="1"/><stop offset="0.55" stop-color="#${c}" stop-opacity="0.7"/><stop offset="1" stop-color="#${c}" stop-opacity="0"/></radialGradient>`).join('') +
  `<filter id="tgblur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.5"/></filter></defs>`);

/* ================= tg_eel_river ================= */
const ER = {sec: 14, bank: 760, water: 700, // y of the mud flat's top edge and the far waterline
  walk: [0.4, 4.8], tread: 5.0, step: 2.0, spot: 1500, basket: [6.4, 9.6]}; // step: seconds for one leg's lift and press
// 1621 dress (rig.js): the Wampanoag man in a breechcloth, bare-legged for wading, hair long behind; the English colonist in a
// doublet and full breeches, a plain falling band and a broad felt hat. Solid and faceless (det 0): nobody's likeness.
const TG_WAMP = {kind: 'man', hat: 'longhair', coat: 'none', wear: ['breechcloth', 'barefoot'], det: 0};
const TG_COLONIST = {kind: 'man', hat: 'felt', coat: 'doublet', wear: ['breeches'], det: 0, tones: {tone: '#2E403D', lite: '#E9DFC6'}};

// a clump of reeds rooted at (x, y): blades that lean with a slow wind
function tgReeds(x, y, n, h, t, seed, col = TG.reed) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) { const bx = x + (r() - 0.5) * n * 9, hh = h * (0.55 + r() * 0.6), sway = (6 + r() * 10) * Math.sin(t * (0.6 + r() * 0.5) + r() * 6), lean = (r() - 0.5) * 30;
    s += `<path d="M${f1(bx)},${y} Q${f1(bx + lean * 0.3 + sway * 0.3)},${f1(y - hh * 0.55)} ${f1(bx + lean + sway)},${f1(y - hh)}" stroke="${col}" stroke-width="${f1(2.5 + r() * 3)}" fill="none" stroke-linecap="round"/>`;
    if (r() < 0.35) s += `<ellipse cx="${f1(bx + lean + sway)}" cy="${f1(y - hh)}" rx="4.5" ry="15" fill="${col}" transform="rotate(${f1(lean * 0.6 + sway * 0.5)}, ${f1(bx + lean + sway)}, ${f1(y - hh)})"/>`; }
  return s;
}
// An eel as a centre line (points head first): about wrist-thick, dark olive above, a pale belly, a long low fin, a small head.
// At this scene's scale a man is 330 px, so 1 ft is about 57 px: an eel of 2 to 3 ft is 115 to 170 px long and 9 px thick.
function tgEelBody(pts, w = 9) {
  const belly = pts.map(([x, y]) => [x, y + w * 0.3]), [hx, hy] = pts[0], [nx, ny] = pts[1], a = Math.atan2(hy - ny, hx - nx) * 180 / Math.PI;
  return line(pts, '#0B0E09', w + 3.5) + line(pts, '#2F3A1E', w) + line(belly.slice(1, -2), '#A9A878', w * 0.3, 'opacity="0.85"') + line(pts.slice(-5), '#2F3A1E', w * 0.55) +
    `<ellipse cx="${f1(hx)}" cy="${f1(hy)}" rx="${f1(w * 0.95)}" ry="${f1(w * 0.62)}" fill="#2F3A1E" stroke="#0B0E09" stroke-width="1.6" transform="rotate(${f1(a)}, ${f1(hx)}, ${f1(hy)})"/><circle cx="${f1(hx + Math.cos(a * Math.PI / 180) * w * 0.3)}" cy="${f1(hy + Math.sin(a * Math.PI / 180) * w * 0.3 - w * 0.2)}" r="1.5" fill="#E9E4C4"/>`;
}
// an eel driven out of the mud at (x, y) from time t0: it slides out head first, low, and wriggles away along the flat (dir)
function tgEel(x, y, t, t0, dir, L, seed) {
  const u = clamp01((t - t0) / 1.1); if (u <= 0) return '';
  const out = L * (u * u * (3 - 2 * u)), crawl = Math.max(0, t - t0 - 1.1) * 16, pts = [];
  for (let k = 0; k <= 16; k++) { const q = k / 16, sd = (out + crawl) * (1 - q) - Math.max(0, crawl - (L - out)) * 0, d = Math.max(0, out * (1 - q) + crawl); // distance from the hole, head first
    const wv = Math.sin(t * 7 - q * 6.5 + seed * 2.1), amp = (3 + 6 * (1 - q)) * Math.min(1, d / 30);
    pts.push([x + dir * d + wv * amp * 0.5, y - 5 - 7 * Math.sin(Math.PI * clamp01(d / (L * 0.6))) * (1 - u * 0.6) + wv * amp * 0.75 + (k === 0 ? -3 - 2 * Math.sin(t * 3 + seed) : 0)]); }
  if (crawl > 0) for (let k = 0; k <= 16; k++) { const q = k / 16; pts[k][0] = x + dir * (crawl + L * (1 - q)) + (pts[k][0] - (x + dir * (out * (1 - q) + crawl))); }
  return `<ellipse cx="${f1(x)}" cy="${y + 1}" rx="${f1(16 * Math.min(1, u * 3))}" ry="4" fill="#0B0A08" opacity="${f1(0.9 * (1 - smooth(1.4, 3, t - t0)))}"/>` + tgEelBody(pts);
}
function renderTgEel({t, cam, quiet = false}) {
  const c = cam2(cam), H = 330, B = ER.bank;
  // sky: a peach and gold dawn over the water, a low sun in mist
  const sunX = c.sx(1700) * 0.35 + 900, sky = `<rect width="1920" height="1080" fill="url(#tgdawn)"/><circle cx="${f1(sunX)}" cy="560" r="520" fill="url(#tgsun)"/><circle cx="${f1(sunX)}" cy="560" r="46" fill="#FFF6D8" opacity="0.9"/>` + clouds(t, 23);
  // far shore: two ridges of trees in haze (0.3, 0.5)
  const ridge = (y0, seed, amp) => { const r = rng(seed), p = []; for (let x = -800; x <= 4200; x += 120) p.push([x, y0 - amp * (0.4 + r() * 0.6) * (0.6 + 0.4 * Math.sin(x / 500 + seed))]); return p; };
  const r1 = ridge(600, 3, 70), r2 = ridge(650, 8, 100);
  const far = `<path d="M-800,720 L${r1.map((p) => p.join(',')).join(' L')} L4200,720 Z" fill="${TG.far}" opacity="0.75"/>` + MAT.trees(r1, {col: TG.far, seed: 4, size: 46, every: 0.8});
  const mid = `<path d="M-800,720 L${r2.map((p) => p.join(',')).join(' L')} L4200,720 Z" fill="${TG.mid}"/>` + MAT.trees(r2, {col: TG.mid, seed: 9, size: 84, every: 0.85}) +
    `<rect x="-800" y="610" width="5000" height="120" fill="url(#tgmist)" opacity="0.8"/>`;
  // the river: the sky in it, ripples, a band of mist drifting on the water
  const water = `<rect x="-800" y="${ER.water - 40}" width="5000" height="460" fill="url(#tgwater)"/>` + MAT.water(-800, ER.water - 30, 5000, 160, t, {top: '#E3B08A', bottom: '#5E7F80', seed: 31, glint: '#FFF3D6', n: 110}) +
    [0, 1, 2].map((k) => `<ellipse cx="${f1(((k * 1300 + t * (14 + k * 5)) % 4200) - 300)}" cy="${ER.water + 8 + k * 14}" rx="700" ry="${22 + k * 6}" fill="#F7E3B4" opacity="0.2"/>`).join('');
  // the mud flat (the main plane): wet mud with a sheen, pools, the dugout canoe drawn up, the figures
  const s = [];
  { const r = rng(55); let d = `M-800,1300 L-800,${B + 10}`; for (let x = -800; x <= 4200; x += 90) d += ` L${x},${f1(B + 8 * Math.sin(x / 210) + r() * 5)}`; d += ' L4200,1300 Z';
    s.push(`<path d="${d}" fill="${TG.mud}"/><path d="${d}" fill="url(#matFloorShade)" opacity="0.5" transform="translate(0,${B + 300}) scale(1,-1) translate(0,${-B})"/>`);
    for (let i = 0; i < 26; i++) { const x = -600 + r() * 4400, y = B + 70 + r() * 200, w = 60 + r() * 220; s.push(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(w)}" ry="${f1(5 + r() * 9)}" fill="#E3B08A" opacity="${f1(0.1 + r() * 0.16)}"/>`); }
    s.push(MAT.ground(-800, 4200, B + 4, {base: '#15130F', seed: 57, tufts: false})); }
  // the dugout: a burned and scraped log, blunt ends, a paddle laid across
  { const x = 520, y = B + 24; s.push(`<path d="M${x - 250},${y - 34} q250,-16 500,0 q30,20 -30,44 q-220,22 -440,0 q-60,-24 -30,-44 Z" fill="${TG.ink}"/><path d="M${x - 220},${y - 30} q220,-12 440,0" stroke="#4A463C" stroke-width="3" fill="none"/>` +
    line([[x - 120, y - 56], [x + 210, y - 22]], TG.ink, 7) + `<ellipse cx="${x + 222}" cy="${y - 18}" rx="26" ry="9" fill="${TG.ink}" transform="rotate(8, ${x + 222}, ${y - 18})"/>`); }
  // the shallow pool he treads in: ankle-deep water lying on the mud, the sky in it
  const FY = B + 40, px = ER.spot;
  s.push(`<ellipse cx="${px + 10}" cy="${FY + 6}" rx="330" ry="30" fill="#15130F"/><ellipse cx="${px + 10}" cy="${FY + 4}" rx="320" ry="25" fill="url(#tgpool)"/><ellipse cx="${px + 70}" cy="${FY - 2}" rx="210" ry="9" fill="#F2C79A" opacity="0.45"/>`);
  // the treader: wades out, then treads the mud: one knee lifts high, the foot presses down, a ring spreads; then the other
  const wu = smooth(ER.walk[0], ER.walk[1], t), fx = px - 620 + 620 * wu, treading = t >= ER.tread;
  const lod = lodFor(H * c.z), rim = {c: '#FFE0B0', a: 0.75 * lod.rimA, dx: 0.012, dy: -0.004};
  const lift = (ph) => { ph = ((ph % 1) + 1) % 1; return ph < 0.3 ? ease(ph / 0.3) : ph < 0.4 ? 1 : ph < 0.5 ? 1 - Math.pow((ph - 0.4) / 0.1, 2) : 0; };
  const press = (ph) => { ph = ((ph % 1) + 1) % 1; return ph >= 0.5 && ph < 0.72 ? Math.sin(Math.PI * (ph - 0.5) / 0.22) : 0; };
  const tp = treading ? (t - ER.tread) / ER.step : 0;
  let an;
  if (!treading) an = {...walkAn(walkPhase(620 * wu, H * 0.9, 16), {stride: 16, arm: 10}), lean: 3};
  else { const a = lift(tp), b = lift(tp + 0.5), pr = press(tp) + press(tp + 0.5);
    an = {legs: [4 + 64 * a, -4 + 64 * b], shins: [4 - 26 * a, -4 - 26 * b], fArm: [162 - 22 * a + 10 * b, 140 - 30 * a], bArm: [196 + 16 * a - 10 * b, 206 + 10 * a], bob: -0.016 * pr + 0.006 * (a + b), lean: 4 + 3 * pr, tilt: -16}; }
  // eels driven out round his feet, one a press: low on the mud, wriggling away
  if (treading) { const n = Math.floor(tp * 2), spots = [[70, 1, 150], [-64, -1, 128], [96, 1, 168], [-90, -1, 140], [52, 1, 120], [-48, -1, 158], [110, 1, 132]];
    for (let k = 0; k < Math.min(n + 1, spots.length); k++) { const t0 = ER.tread + (k + 1) * ER.step / 2 + 0.05; s.push(tgEel(fx + spots[k][0], FY - 2 + (k % 3) * 5, t, t0, spots[k][1], spots[k][2], k + 1)); } }
  s.push(figure({...TG_WAMP, x: fx, y: FY + 4, h: H, d: 1, fill: TG.ink, rim, an}));
  // the water over his feet, and the rings each press sends out
  s.push(`<ellipse cx="${f1(fx + 8)}" cy="${FY + 7}" rx="70" ry="6" fill="#7E6A5C"/><ellipse cx="${f1(fx + 8)}" cy="${FY + 9}" rx="54" ry="3.5" fill="#4A4038" opacity="0.7"/>`);
  if (treading) for (let k = 0; k < 2; k++) for (let j = 0; j < 2; j++) { const age = (((tp + k * 0.5 - 0.5) % 1) + 1) % 1 * ER.step - j * 0.28; if (tp + k * 0.5 < 0.5 || age < 0 || age > 1.5) continue; const u = age / 1.5;
    s.push(`<ellipse cx="${f1(fx + (k ? -10 : 18))}" cy="${FY + 7}" rx="${f1(24 + 150 * u)}" ry="${f1(3.5 + 13 * u)}" fill="none" stroke="#FFF3D6" stroke-width="${f1(3.2 - 1.6 * u)}" opacity="${f1(0.85 * (1 - u))}"/>`); }
  // the colonist waits on the flat with a rush basket (coral), then brings it over and sets it down; a few eels in it already
  { const bu = smooth(ER.basket[0], ER.basket[1], t), bx = 2230 - 360 * bu, walking = bu > 0 && bu < 1, hB = H * 0.95, set = smooth(ER.basket[1], ER.basket[1] + 0.7, t);
    const o = {...TG_COLONIST, x: bx, y: B + 44, h: hB, d: -1, fill: TG.ink, rim: {...rim, dx: -0.012},
      an: walking ? {...walkAn(walkPhase(360 * bu, hB * 0.9, 18), {stride: 18, carry: true}), fArm: [172, 166], lean: 3} : {...POSES.stand(t, 0.4), fArm: [172 - 30 * set, 166 - 60 * set], tilt: -10 - 6 * set}};
    s.push(figure(o));
    const [hx, hy] = hand({...o, an: {fArm: [172, 166]}}), bxx = hx + (bx - 130 - hx) * set, by = hy + 16 + (B + 30 - (hy + 16)) * set;
    const eelIn = (k) => { const p = []; for (let j = 0; j <= 10; j++) { const q = j / 10, w = Math.sin(t * 5 + k * 2 - q * 5) * (2 + 3 * q); p.push([bxx + (k - 1) * 22 + (k - 1) * 30 * q * q + w * 0.6, by - 8 - 20 * Math.sin(Math.PI * Math.min(1, q * 1.3)) + 26 * q * q + w * 0.6]); } return tgEelBody(p, 8); };
    s.push(`<path d="M${f1(bxx - 40)},${f1(by - 4)} Q${f1(bxx)},${f1(by - 78)} ${f1(bxx + 40)},${f1(by - 4)}" stroke="#B8463C" stroke-width="5" fill="none" opacity="${f1(1 - set * 0.2)}"/>` + eelIn(0) +
      `<path d="M${f1(bxx - 46)},${f1(by - 4)} q46,-14 92,0 l-12,62 q-34,12 -68,0 Z" fill="url(#tgcoral)"/><path d="M${f1(bxx - 46)},${f1(by - 4)} q46,14 92,0" stroke="#7A2A22" stroke-width="3" fill="none"/>` +
      [0, 1, 2].map((k) => `<path d="M${f1(bxx - 40 + k * 4)},${f1(by + 14 + k * 16)} q40,10 ${80 - k * 8},0" stroke="#7A2A22" stroke-width="2" fill="none" opacity="0.7"/>`).join('') + eelIn(1) + eelIn(2)); }
  // near reeds along the flat's edge, and the foreground: big dark reeds, soft, moving against the camera
  const reedsMid = [-500, -120, 260, 1050, 2420, 2700, 3000, 3300].map((x, i) => tgReeds(x, B + 6, 16, 150, t, 60 + i, '#1F2A24')).join('');
  const fore = `<g filter="url(#tgblur)">` + [-260, 420, 980, 2180, 3200].map((x, i) => tgReeds(x, 1230, 26, 400, t, 80 + i, '#0A0D0B')).join('') + `</g>`;
  const world = layerAt(c, 0.3, far) + layerAt(c, 0.5, mid) + layerAt(c, 0.8, water) + layerAt(c, 1, reedsMid + s.join('')) + layerAt(c, 1.35, fore) +
    `<rect width="1920" height="1080" fill="#F2C277" opacity="0.07" style="mix-blend-mode:screen"/>`;
  const scr = quiet ? '' : tag(172, 150, 'PATUXET (PLYMOUTH) · 1621 · A TIDAL RIVER AT LOW WATER', smooth(0.4, 1.2, t) * (1 - smooth(6.5, 7.2, t)));
  return frame(tgDefs(t), sky, world, scr, t);
}
const tgEelCam = (t) => { const p = smooth(4.2, 8.5, t); return {z: lerpLog(0.92, 1.42, p), ux: 1000 + 470 * smooth(0.2, 5.2, t) + 80 * p + 30 * ease(t / ER.sec), uy: 560 + 120 * p}; };
Object.assign(CLIPS, {tg_eel_river: {sec: ER.sec, render: (t) => renderTgEel({t, cam: tgEelCam(t), quiet: true})}});

/* ================= tg_victorian_kitchen ================= */
const VK = {sec: 12, F: 900, H: 370, maid: [3.2, 8.4], hours: [1, 11]}; // floor line; a grown woman's height in the room

// a copper pan hanging from the rail: a round body with a highlight and a long iron handle up to its hook
const tgPan = (x, y, r, t, k) => { const sw = 1.2 * Math.sin(t * 0.9 + k);
  return `<g transform="rotate(${f1(sw)}, ${x}, ${y - r - 60})"><rect x="${x - 3}" y="${y - r - 60}" width="6" height="64" fill="#1A120D"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#tgcop)"/><circle cx="${x}" cy="${y}" r="${f1(r * 0.72)}" fill="none" stroke="#7A4526" stroke-width="2" opacity="0.6"/><path d="M${f1(x - r * 0.55)},${f1(y - r * 0.35)} q${f1(r * 0.2)},-${f1(r * 0.35)} ${f1(r * 0.6)},-${f1(r * 0.42)}" stroke="#FFD9A8" stroke-width="3" fill="none" opacity="0.7" stroke-linecap="round"/></g>`; };
// a fluted jelly mould, drawn tall (a turret of rings); fill is a gradient id
const tgMould = (x, y, w, fill) => { const h = w * 0.95; let s = `<path d="M${x - w / 2},${y} L${x - w * 0.42},${y - h * 0.5} L${x - w * 0.3},${y - h * 0.52} L${x - w * 0.24},${y - h} L${x + w * 0.24},${y - h} L${x + w * 0.3},${y - h * 0.52} L${x + w * 0.42},${y - h * 0.5} L${x + w / 2},${y} Z" fill="url(#${fill})"/>`;
  for (let k = -3; k <= 3; k++) s += `<path d="M${f1(x + k * w * 0.13)},${y - 3} L${f1(x + k * w * 0.11)},${f1(y - h * 0.5)} M${f1(x + k * w * 0.075)},${f1(y - h * 0.53)} L${f1(x + k * w * 0.07)},${f1(y - h + 3)}" stroke="#000" stroke-width="2" opacity="0.28"/>`;
  return s + `<rect x="${x - w / 2 - 6}" y="${y - 6}" width="${w + 12}" height="8" rx="3" fill="url(#${fill})"/>`; };
function renderTgKitchen({t, cam, quiet = false}) {
  const c = cam2(cam), {F, H} = VK, fl = 0.86 + 0.09 * Math.sin(t * 7.1) + 0.05 * Math.sin(t * 16.7), s = [], back = [];
  // back plane (0.9): the brick wall in firelight, the high areaway window (night), the pan rail, a dresser of moulds, the clock
  back.push(`<rect x="-600" y="-300" width="3400" height="${F + 300}" fill="url(#tgwall)"/>` + MAT.brick(-600, -300, 3400, F + 300, {base: '#3A2A20', seed: 21, bw: 64, bh: 28, soot: 'top', op: 0.55}));
  back.push(`<rect x="-600" y="${F - 190}" width="3400" height="190" fill="#1B130E"/><rect x="-600" y="${F - 196}" width="3400" height="10" fill="#0D0907"/>`);
  { const wx = 1250, wy = 60; back.push(`<rect x="${wx - 16}" y="${wy - 16}" width="392" height="232" fill="#0D0907"/><rect x="${wx}" y="${wy}" width="360" height="200" fill="url(#tgnightwin)"/>` +
      [0, 1, 2, 3, 4, 5].map((k) => `<rect x="${wx + 26 + k * 58}" y="${wy}" width="7" height="200" fill="#0D0907"/>`).join('') + `<rect x="${wx}" y="${wy + 120}" width="360" height="80" fill="#0D1622" opacity="0.6"/>` +
      `<path d="M${wx},${wy + 200} L${wx - 220},${F} L${wx + 520},${F} L${wx + 360},${wy + 200} Z" fill="#6E8FBF" opacity="0.07"/>`); }
  back.push(`<rect x="420" y="250" width="700" height="10" fill="#0D0907"/>` + [0, 1, 2, 3, 4, 5, 6].map((k) => tgPan(470 + k * 100, 345 + (k % 2) * 14, 44 - (k % 3) * 7, t, k)).join(''));
  { const dx = 1760; back.push(`<rect x="${dx}" y="150" width="420" height="${F - 150}" fill="#150E0A"/>` + [0, 1, 2].map((r) => `<rect x="${dx}" y="${300 + r * 150}" width="420" height="12" fill="#0D0907"/>` +
      [0, 1, 2, 3].map((k) => `<g opacity="0.85">${tgMould(dx + 60 + k * 100, 300 + r * 150, 62 + ((k + r) % 3) * 10, 'tgcop')}</g>`).join('')).join('')); }
  { const cx = 1010, cy = 110, r = 62, hr = 1.5 + (t - VK.hours[0]) / (VK.hours[1] - VK.hours[0]) * 6, hand2 = (a, L, w) => `<line x1="${cx}" y1="${cy}" x2="${f1(cx + Math.sin(a) * L)}" y2="${f1(cy - Math.cos(a) * L)}" stroke="#15100C" stroke-width="${w}" stroke-linecap="round"/>`;
    back.push(`<circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="#0D0907"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#E9DFC6"/>` + [...Array(12)].map((_, k) => { const a = k * TAU / 12; return `<line x1="${f1(cx + Math.sin(a) * (r - 12))}" y1="${f1(cy - Math.cos(a) * (r - 12))}" x2="${f1(cx + Math.sin(a) * (r - 4))}" y2="${f1(cy - Math.cos(a) * (r - 4))}" stroke="#15100C" stroke-width="3"/>`; }).join('') +
      hand2(hr / 12 * TAU, r * 0.5, 6) + hand2((hr % 1) * TAU, r * 0.78, 4)); }
  // gas bracket: a second, cooler pool of light on the right
  back.push(`<rect x="1640" y="330" width="60" height="6" fill="#0D0907"/><path d="M1694,330 q10,-26 20,0 Z" fill="#FFF1C4" opacity="${f1(0.75 + 0.2 * fl)}"/>` + glowC(1704, 310, 420, 0.75 * fl, 'tggas'));
  // main plane: the range under its hood (left), the stockpot steaming, the cook; the work table with the jelly bag and the mould
  const rx = 40;
  s.push(MAT.planks(-600, F, 3400, 420, {base: '#241912', seed: 22, size: 34}) + `<rect x="-600" y="${F}" width="3400" height="130" fill="url(#matFloorShade)"/>`);
  s.push(poly([[rx - 60, 170], [rx + 620, 170], [rx + 540, 300], [rx + 20, 300]], '#0D0907') + `<rect x="${rx + 250}" y="-300" width="70" height="470" fill="#0D0907"/>`);
  s.push(`<rect x="${rx}" y="${F - 190}" width="560" height="190" fill="#0D0907"/><rect x="${rx - 14}" y="${F - 204}" width="588" height="22" fill="#17110D"/>` + MAT.iron(rx + 8, F - 178, 544, 170, {base: '#120D0A', seams: 140, rivet: 9}));
  for (const [dx, w] of [[40, 150], [230, 150]]) s.push(`<rect x="${rx + dx}" y="${F - 160}" width="${w}" height="110" rx="6" fill="#050302"/><rect x="${rx + dx + 12}" y="${F - 146}" width="${w - 24}" height="82" rx="4" fill="${TG.fire}" opacity="${f1(0.55 + 0.25 * Math.sin(t * 8 + dx))}"/>` +
    [0, 1, 2, 3].map((k) => `<rect x="${rx + dx + 22 + k * ((w - 44) / 3) - 3}" y="${F - 146}" width="6" height="82" fill="#050302"/>`).join(''));
  s.push(`<rect x="${rx + 420}" y="${F - 165}" width="110" height="130" rx="5" fill="#050302"/><circle cx="${rx + 510}" cy="${F - 100}" r="7" fill="${TG.copper}"/>`);
  s.push(glowC(rx + 200, F - 105, 620, 0.95 * fl, 'tgfire') + glowC(rx + 200, F - 60, 900, 0.5 * fl, 'tgfire'));
  // the stockpot (copper, big) and a kettle; steam rolling up into the hood
  { const px = rx + 170, py = F - 204; s.push(`<rect x="${px - 100}" y="${py - 120}" width="200" height="120" rx="10" fill="url(#tgcop)"/><rect x="${px - 110}" y="${py - 128}" width="220" height="16" rx="6" fill="#7A4526"/><path d="M${px - 110},${py - 80} q-34,0 -34,30 M${px + 110},${py - 80} q34,0 34,30" stroke="#5A311B" stroke-width="9" fill="none"/>` +
      MAT.smoke(px - 30, py - 130, t, {col: 'F4EFE6', k: 1.0, n: 9, rise: 260, drift: 30, speed: 5, seed: 23}) + MAT.smoke(px + 40, py - 130, t + 1.3, {col: 'FFE0B0', k: 0.8, n: 7, rise: 230, drift: 50, speed: 4, seed: 24}));
    s.push(`<path d="M${rx + 390},${py} q0,-70 60,-70 q60,0 60,70 Z" fill="#0D0907"/><path d="M${rx + 505},${py - 40} l44,-24" stroke="#0D0907" stroke-width="10"/>` + MAT.smoke(rx + 552, py - 70, t, {col: 'F4EFE6', k: 0.45, n: 5, rise: 160, drift: 60, seed: 25})); }
  // the table: long, scrubbed; the jelly bag on its stand dripping into a bowl; the coral mould; a second mould and a sugar loaf
  const tx = 900, ty = F - 200, tw = 860;
  s.push(`<rect x="${tx}" y="${ty}" width="${tw}" height="20" fill="#0D0907"/><rect x="${tx + 30}" y="${ty + 20}" width="18" height="180" fill="#0D0907"/><rect x="${tx + tw - 48}" y="${ty + 20}" width="18" height="180" fill="#0D0907"/><rect x="${tx + 30}" y="${ty + 120}" width="${tw - 60}" height="10" fill="#0D0907"/>`);
  { const jx = tx + 250; s.push(line([[jx - 70, ty], [jx - 40, ty - 250]], '#0D0907', 9) + line([[jx + 70, ty], [jx + 40, ty - 250]], '#0D0907', 9) + `<rect x="${jx - 60}" y="${ty - 256}" width="120" height="10" fill="#0D0907"/>` +
      `<path d="M${jx - 46},${ty - 246} L${jx + 46},${ty - 246} L${jx + 6},${ty - 96} L${jx - 6},${ty - 96} Z" fill="#E9DFC6" opacity="0.92"/><path d="M${jx - 30},${ty - 246} L${jx},${ty - 100}" stroke="#B9AC8E" stroke-width="3" opacity="0.7"/>`);
    const du = (t * 0.9) % 1; s.push(`<ellipse cx="${jx}" cy="${f1(ty - 92 + 62 * du * du)}" rx="4" ry="${f1(6 + 6 * du)}" fill="${TG.gold}" opacity="${f1(1 - du * 0.3)}"/>`);
    const lvl = 10 + 26 * smooth(0, VK.sec, t); s.push(`<path d="M${jx - 70},${ty - 44} q70,52 140,0 Z" fill="#E9DFC6"/><path d="M${jx - 62},${f1(ty - 38)} q62,${f1(lvl)} 124,0 Z" fill="${TG.gold}" opacity="0.85"/><rect x="${jx - 26}" y="${ty - 8}" width="52" height="8" fill="#B9AC8E"/>`); }
  s.push(tgMould(tx + 540, ty, 150, 'tgcoral') + glowC(tx + 540, ty - 80, 190, 0.5, 'tggas') + `<g opacity="0.9">${tgMould(tx + 730, ty, 96, 'tgcop')}</g>` + `<path d="M${tx + 90},${ty} l22,-120 l22,120 Z" fill="#E9DFC6" opacity="0.9"/>`);
  // the cook at the pot (ink, solid until the push-in), stirring; the kitchen maid crosses with a bowl and sets it on the table
  const lod = lodFor(H * c.z), K = (o) => figure({kind: 'woman', hat: 'maid', wear: ['plain', 'apron'], fill: TG.ink, det: lod.det * 0.6, rim: {c: '#FFB877', a: 0.85 * fl, dx: -0.012, dy: -0.004}, ...o});
  s.push(K({x: rx + 420, y: F, h: H, d: -1, prop: 'spoon', an: {...POSES.stir(t, 0.2), fArm: [112 + 5 * Math.sin(TAU * t * 0.8), 82 + 14 * Math.cos(TAU * t * 0.8)], tilt: -12 + 4 * Math.sin(t * 0.7), lean: 6}}));
  { const mu = smooth(VK.maid[0], VK.maid[1], t), mx = 2300 - 780 * mu, walking = mu > 0 && mu < 1, hM = H * 0.92;
    s.push(K({x: mx, y: F, h: hM, d: -1, hat: 'kerchief', prop: 'bowl', rim: {c: '#FFE0A0', a: 0.7 * fl, dx: 0.012, dy: -0.004},
      an: walking ? walkAn(walkPhase(780 * mu, hM * 0.88), {carry: true}) : {...POSES.stand(t, 0.5), fArm: [140 - 30 * smooth(8.4, 9.2, t), 110], tilt: -8}})); }
  // foreground (1.3): the near end of a second table, a strainer, a stack of bowls, a bunch of herbs hanging: dark, soft
  const fore = `<g filter="url(#tgblur)"><rect x="-500" y="${F + 150}" width="820" height="300" fill="#060403"/><path d="M-40,${F + 150} q80,-100 160,0 Z" fill="#060403"/><rect x="150" y="${F + 104}" width="130" height="46" rx="8" fill="#060403"/><rect x="163" y="${F + 78}" width="104" height="30" rx="8" fill="#060403"/>` +
    `<path d="M2150,-100 l0,300 M2150,200 q-70,90 -30,190 M2150,200 q10,110 50,180 M2150,200 q70,70 110,150" stroke="#060403" stroke-width="16" fill="none" stroke-linecap="round"/><rect x="2380" y="${F - 60}" width="500" height="500" fill="#060403"/></g>`;
  const world = layerAt(c, 0.9, back.join('')) + layerAt(c, 1, s.join('')) + layerAt(c, 1.3, fore);
  const scr = quiet ? '' : tag(172, 150, 'A BIG HOUSE\'S KITCHEN · ABOUT 1860', smooth(0.4, 1.2, t) * (1 - smooth(5.5, 6.2, t)));
  return frame(tgDefs(t), `<rect width="1920" height="1080" fill="#0B0705"/>`, world, scr, t);
}
const tgKitchenCam = (t) => { const u = ease(t / VK.sec); return {z: lerpLog(0.8, 1.02, u), ux: 760 + 520 * u, uy: 520 + 30 * u}; };
Object.assign(CLIPS, {tg_victorian_kitchen: {sec: VK.sec, render: (t) => renderTgKitchen({t, cam: tgKitchenCam(t), quiet: true})}});

if (typeof window !== 'undefined') Object.assign(window, {renderTgEel, renderTgKitchen, tgEelCam, tgKitchenCam});
