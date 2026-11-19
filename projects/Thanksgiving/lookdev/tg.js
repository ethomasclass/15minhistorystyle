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
// Known limit: the kit's figures wear 1880s outlines. The 1621 figures are drawn bare-headed in shirtsleeves with no hat or coat
// detail; a period outline (breechcloth, leggings, a mantle) is still to be added to rig.js before these are called accurate.

const TG = {ink: '#0D0C09', coral: '#FF6F61', cream: '#F4EFE6', teal: '#2FE0C4', copper: '#C47A45', copperD: '#7A4526', fire: '#FF9F3C', gold: '#F2C277', peach: '#F0A982',
  mud: '#2A2A26', mudL: '#4A463C', reed: '#16201C', water0: '#E8B58A', water1: '#3E6A70', far: '#5C7F86', mid: '#33545A'};

const tgDefs = (t) => msDefs(t).replace('</defs>',
  grad('tgdawn', [['0', '#1E3A4C'], ['0.38', '#4F7C86'], ['0.62', '#D99A7C'], ['0.8', '#F2C277'], ['1', '#F7E3B4']]) +
  grad('tgwater', [['0', '#F2C79A', 0.95], ['0.25', '#B98F7E'], ['0.6', '#3E6A70'], ['1', '#16303A']]) +
  grad('tgmist', [['0', '#F7E3B4', 0], ['0.5', '#F7E3B4', 0.5], ['1', '#F7E3B4', 0]]) +
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
  walk: [0.4, 5.2], tread: [5.4, 11.5], eels: [6.0, 6.9, 7.8, 8.7], basket: [7.4, 10.6]};

// a clump of reeds rooted at (x, y): blades that lean with a slow wind
function tgReeds(x, y, n, h, t, seed, col = TG.reed) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) { const bx = x + (r() - 0.5) * n * 9, hh = h * (0.55 + r() * 0.6), sway = (6 + r() * 10) * Math.sin(t * (0.6 + r() * 0.5) + r() * 6), lean = (r() - 0.5) * 30;
    s += `<path d="M${f1(bx)},${y} Q${f1(bx + lean * 0.3 + sway * 0.3)},${f1(y - hh * 0.55)} ${f1(bx + lean + sway)},${f1(y - hh)}" stroke="${col}" stroke-width="${f1(2.5 + r() * 3)}" fill="none" stroke-linecap="round"/>`;
    if (r() < 0.35) s += `<ellipse cx="${f1(bx + lean + sway)}" cy="${f1(y - hh)}" rx="4.5" ry="15" fill="${col}" transform="rotate(${f1(lean * 0.6 + sway * 0.5)}, ${f1(bx + lean + sway)}, ${f1(y - hh)})"/>`; }
  return s;
}
// an eel coming up out of the mud at (x, y): it rises (u 0..1), arches and wriggles
function tgEel(x, y, u, t, seed) {
  if (u <= 0) return '';
  const L = 230 * Math.min(1, u * 1.3), pts = [];
  for (let k = 0; k <= 14; k++) { const q = k / 14, a = t * 5 + seed + q * 5.2;
    pts.push([x + Math.sin(a) * (10 + 18 * q) * u + (seed % 2 ? 1 : -1) * 46 * q * q, y - L * q * (0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, u)))]); }
  return line(pts, '#0D0C09', 22) + line(pts, '#8C9878', 15) + line(pts.slice(2, 12), '#D5DBB8', 4, 'opacity="0.6"') +
    `<ellipse cx="${f1(x)}" cy="${y + 2}" rx="${f1(34 * Math.min(1, u * 2))}" ry="7" fill="#15130F" opacity="0.8"/>`;
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
    for (let i = 0; i < 26; i++) { const x = -600 + r() * 4400, y = B + 30 + r() * 230, w = 60 + r() * 220; s.push(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(w)}" ry="${f1(5 + r() * 9)}" fill="#E3B08A" opacity="${f1(0.1 + r() * 0.16)}"/>`); }
    s.push(MAT.ground(-800, 4200, B + 4, {base: '#15130F', seed: 57, tufts: false})); }
  // the dugout: a burned and scraped log, blunt ends, a paddle laid across
  { const x = 520, y = B + 24; s.push(`<path d="M${x - 250},${y - 34} q250,-16 500,0 q30,20 -30,44 q-220,22 -440,0 q-60,-24 -30,-44 Z" fill="${TG.ink}"/><path d="M${x - 220},${y - 30} q220,-12 440,0" stroke="#4A463C" stroke-width="3" fill="none"/>` +
    line([[x - 120, y - 56], [x + 210, y - 22]], TG.ink, 7) + `<ellipse cx="${x + 222}" cy="${y - 18}" rx="26" ry="9" fill="${TG.ink}" transform="rotate(8, ${x + 222}, ${y - 18})"/>`); }
  // the treader: wades out, then treads the mud with a slow, high-kneed step; eels come up round the feet
  const wu = smooth(ER.walk[0], ER.walk[1], t), fx = 880 + 620 * wu, treading = t >= ER.tread[0];
  const lod = lodFor(H * c.z), rim = {c: '#FFE0B0', a: 0.75 * lod.rimA, dx: 0.012, dy: -0.004};
  let an;
  if (!treading) an = {...walkAn(walkPhase(620 * wu, H * 0.9, 16), {stride: 16, arm: 10}), lean: 3};
  else { const p = (t - ER.tread[0]) * 0.55, a = Math.max(0, Math.sin(TAU * p)), b = Math.max(0, Math.sin(TAU * (p + 0.5)));
    an = {legs: [34 * a, 34 * b], shins: [34 * a - 62 * a, 34 * b - 62 * b], fArm: [168 + 8 * a, 150 + 10 * a], bArm: [190 - 8 * b, 200 - 8 * b], bob: -0.012 * (Math.pow(1 - a, 6) + Math.pow(1 - b, 6)) * 0.5, lean: 5, tilt: -14}; }
  // water round the ankles while wading: the figure stands a little into the mud
  ER.eels.forEach((e0, i) => s.push(tgEel(fx + [-150, 130, -60, 230][i], B + 30 + (i % 2) * 14, clamp01((t - e0) / 1.4), t, i + 1)));
  s.push(figure({x: fx, y: B + 34, h: H, d: 1, kind: 'man', hat: 'none', coat: 'vest', fill: TG.ink, det: 0, rim, an}));
  s.push(`<ellipse cx="${f1(fx)}" cy="${B + 38}" rx="92" ry="13" fill="#15130F"/>`);
  if (treading) for (let k = 0; k < 2; k++) { const u = ((t - ER.tread[0]) * 0.55 + k * 0.5) % 1; s.push(`<ellipse cx="${f1(fx + (k ? 22 : -22))}" cy="${B + 40}" rx="${f1(40 + 120 * u)}" ry="${f1(6 + 14 * u)}" fill="none" stroke="#F7E3B4" stroke-width="2.5" opacity="${f1(0.5 * (1 - u))}"/>`); }
  // the second figure comes down the flat with the rush basket (coral) and sets it by the eels
  { const bu = smooth(ER.basket[0], ER.basket[1], t), bx = 2200 - 500 * bu, walking = bu > 0 && bu < 1, hB = H * 0.94;
    if (bu > 0) { const o = {x: bx, y: B + 40, h: hB, d: -1, kind: 'man', hat: 'none', coat: 'vest', fill: TG.ink, det: 0, rim: {...rim, dx: -0.012},
        an: walking ? {...walkAn(walkPhase(500 * bu, hB * 0.9, 18), {stride: 18, carry: true}), lean: 4} : {...POSES.stand(t, 0.4), fArm: [150, 120], tilt: -10}};
      s.push(figure(o));
      const [hx, hy] = walking ? hand(o, o.an.fArm) : [bx - 120, B + 24], by = walking ? hy + 14 : B + 26, bxx = walking ? hx : bx - 120;
      s.push(`<path d="M${f1(bxx - 46)},${f1(by - 4)} q46,-14 92,0 l-12,62 q-34,12 -68,0 Z" fill="url(#tgcoral)"/><path d="M${f1(bxx - 46)},${f1(by - 4)} q46,14 92,0" stroke="#7A2A22" stroke-width="3" fill="none"/>` +
        [0, 1, 2].map((k) => `<path d="M${f1(bxx - 40 + k * 4)},${f1(by + 14 + k * 16)} q40,10 ${80 - k * 8},0" stroke="#7A2A22" stroke-width="2" fill="none" opacity="0.7"/>`).join('') +
        (walking ? `<path d="M${f1(bxx - 40)},${f1(by - 4)} Q${f1(bxx)},${f1(by - 70)} ${f1(bxx + 40)},${f1(by - 4)}" stroke="#B8463C" stroke-width="5" fill="none"/>` : '')); } }
  // near reeds along the flat's edge, and the foreground: big dark reeds, soft, moving against the camera
  const reedsMid = [-500, -120, 260, 1750, 2050, 2500, 2900, 3300].map((x, i) => tgReeds(x, B + 6, 16, 150, t, 60 + i, '#1F2A24')).join('');
  const fore = `<g filter="url(#tgblur)">` + [-260, 560, 1500, 2380, 3200].map((x, i) => tgReeds(x, 1190, 26, 420, t, 80 + i, '#0A0D0B')).join('') + `</g>`;
  const world = layerAt(c, 0.3, far) + layerAt(c, 0.5, mid) + layerAt(c, 0.8, water) + layerAt(c, 1, reedsMid + s.join('')) + layerAt(c, 1.35, fore) +
    `<rect width="1920" height="1080" fill="#F2C277" opacity="0.07" style="mix-blend-mode:screen"/>`;
  const scr = quiet ? '' : tag(172, 150, 'PATUXET (PLYMOUTH) · 1621 · A TIDAL RIVER AT LOW WATER', smooth(0.4, 1.2, t) * (1 - smooth(6.5, 7.2, t)));
  return frame(tgDefs(t), sky, world, scr, t);
}
const tgEelCam = (t) => { const u = ease(t / ER.sec); return {z: lerpLog(0.92, 1.12, smooth(4.5, 9, t)), ux: 1000 + 520 * smooth(0.2, 6, t) + 60 * u, uy: 560 + 40 * smooth(4.5, 9, t)}; };
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
