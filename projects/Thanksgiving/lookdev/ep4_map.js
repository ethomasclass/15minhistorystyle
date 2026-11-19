// Episode 4 model shots (chapters 1 to 4 builder): the Ep 3 model (ep3_map.js, the user's favourite) at night, with the fire block in
// Williamsburg, and Brooklyn growing 1870 to 1890 with the Brooklyn Bridge landing in 1883. Load after ep3_map.js and ep4.js.
//
//   renderEp4NightDive(n)   ch 1, 0 to 6.8 s: from high over the night city down to the burning tenement two doors from the Kellys
//                           (the Kellys' building is the model's coral one); snow falls in screen space.
//   renderEp4NightRise(n)   ch 1, 81.9 s on: back up off the fire block until Brooklyn, the East River and Manhattan fill the frame
//   renderEp4Grow(n, o)     ch 2: Brooklyn's blocks fill in year by year (o.y0 .. o.y1 over o.a .. o.b), the bridge rises in 1883
//
// Night: emNight(fn) sets EM_ENV = EM_NIGHT and darkens the model's fixed colours (sidewalks, yards, ghost blocks, the ink
// buildings) for one frame, then restores them, so every other model clip keeps its light. The burning building is the lot two
// doors west of the Kellys' (B01s3); for the length of a night frame it is a place of colour 'fire' (dark brick, windows burning).
// Colour rules: the Kellys coral, everyone and everything else ink; teal explains; tags in screen space.

const EM_NIGHT = {light: v3.norm([0.35, 0.55, 0.75]), warm: '#3E5868', cool: '#020405', k: 1, haze: '#15232A', water: '#081013', street: '#1D292B',
  bg: '#05090B', glint: '#5E7A86', park: '#101A17', shadowLen: 0.4, shadowOp: 0.25};
const EM_NIGHT_FIX = {walk: '#2E3B3A', yard: '#0C1314', ghost: '#121D1D', inkLit: '#22363A', inkDark: '#060B0C', roof: '#101C1F', win: '#04080A'};
const EM4_FIRE_LOT = 'B01s3';
const _emPalEp3 = emPal;
emPal = function (col, place) { // (a colour for the burning building; everything else as Ep 3)
  if (col === 'fire') return {lit: '#5A3426', dark: '#1C0F0A', top: '#26160F', win: '#FFB257', trim: '#140A07', shop: '#FFC27A'};
  return _emPalEp3(col, place);
};
function emNight(fn) {
  const keep = {}; for (const k of Object.keys(EM_NIGHT_FIX)) { keep[k] = EM[k]; EM[k] = EM_NIGHT_FIX[k]; }
  const lot = EM_LOTS.find((l) => l.key === EM4_FIRE_LOT), kp = lot.place; lot.place = 'fire'; EM_PLACES.fire = {m: 'B', col: 'fire', floors: lot.floors, i: lot.i};
  try { return emWithEnv(EM_NIGHT, fn); } finally { for (const k of Object.keys(keep)) EM[k] = keep[k]; lot.place = kp; delete EM_PLACES.fire; }
}
const emFireLot = () => EM_LOTS.find((l) => l.key === EM4_FIRE_LOT);
// the fire seen from above: an orange pool on the street and the walls opposite, a glow round the building, smoke rolling up from
// the roof lit from below, embers; all in screen space from the projected building, sized by the model's scale there
function emFireFx(cam, n) {
  const l = emFireLot(), top = [(l.x0 + l.x1) / 2, l.y0 + 20, emH(l.floors)], front = [(l.x0 + l.x1) / 2, l.y0 - 4, 18];
  const P = emP(cam, top), F = emP(cam, front); if (!P || !F) return '';
  const sc = emScale(cam, top), fl = 0.8 + 0.12 * Math.sin(n * 7.7) + 0.08 * Math.sin(n * 17.3), s = [];
  const pool = []; for (let k = 0; k < 32; k++) { const a = k * TAU / 32; pool.push([front[0] + Math.cos(a) * 95, front[1] - 25 + Math.sin(a) * 45, 0.6]); }
  const pp = emPoly2(cam, pool); if (pp) s.push(`<polygon points="${pts(pp)}" fill="#FF8A3D" opacity="${f1(0.28 * fl * 100) / 100}" filter="url(#emblur)" style="mix-blend-mode:screen"/>`);
  s.push(`<ellipse cx="${f1(F[0])}" cy="${f1(F[1])}" rx="${f1(Math.max(60, 120 * sc))}" ry="${f1(Math.max(50, 90 * sc))}" fill="url(#e4mglow)" opacity="${f1(0.9 * fl * 100) / 100}" style="mix-blend-mode:screen"/>`);
  // smoke: puffs rising and drifting east, lit orange low down, grey higher up
  const r = rng(808);
  for (let i = 0; i < 22; i++) { const ph = (n * (0.09 + r() * 0.05) + r()) % 1, rad = (10 + 34 * ph) * sc + 6, x = P[0] + (r() - 0.5) * 18 * sc + ph * 70 * sc, y = P[1] - ph * 190 * sc;
    const lit = Math.max(0, 1 - ph * 2.2), col = lit > 0.2 ? emMix('#3A3230', '#C2602A', lit * 0.8) : '#2C2B2B';
    s.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rad)}" fill="${col}" opacity="${f1(Math.sin(Math.PI * ph) * 0.62 * 100) / 100}"/>`); }
  for (let i = 0; i < 26; i++) { const ph = (n * (0.18 + r() * 0.14) + r()) % 1, x = P[0] + (r() - 0.5) * 40 * sc + 30 * sc * Math.sin(n * 2 + i), y = P[1] - ph * 230 * sc;
    s.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(Math.max(1.2, 1.1 * sc))}" fill="${r() < 0.5 ? '#FFC36B' : '#FF7A2E'}" opacity="${f1(Math.sin(Math.PI * ph) * (0.6 + 0.4 * Math.sin(n * 11 + i)) * 100) / 100}"/>`); }
  return s.join('');
}
const e4MapDefs = `<radialGradient id="e4mglow"><stop offset="0" stop-color="#FFB45C" stop-opacity="0.75"/><stop offset="0.45" stop-color="#FF7A2E" stop-opacity="0.28"/><stop offset="1" stop-color="#FF7A2E" stop-opacity="0"/></radialGradient>` +
  `<linearGradient id="e4nsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#020405" stop-opacity="0.85"/><stop offset="0.45" stop-color="#020405" stop-opacity="0"/></linearGradient>`;
const emFrame4 = (n, world, scr) => frame(e3Defs(n, `<filter id="emblur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>` + e4MapDefs +
    grad('emhaze', [['0', '#3E5868', 0.3], ['0.4', '#2A3E48', 0.1], ['0.7', '#15232A', 0]]) + texDef('emtex', 0, 0, 1920, 1080, {soft: 0.004, fine: 0.11, k: 0.16, seed: 21})),
  '', `<g filter="url(#emtex)">${world.join('')}</g>`, scr.join(''), n);
// one night frame of the model with the fire, for a camera from keys at narration time n
function emNightShot(n, keys, {snow = 1, scr = [], dimTop = 1} = {}) {
  return emNight(() => {
    const cam = emCamera(n, keys, true), world = emWorld(n, cam, {ferry: false, hazeOn: 0.5});
    world.push(emFireFx(cam, n), `<rect width="1920" height="1080" fill="url(#e4nsky)" opacity="${dimTop}"/>`);
    if (snow > 0) world.push(`<g opacity="${f1(snow * 100) / 100}">` + e4Snow(n, {ux: 960, z: 1}, {n: 200, seed: 141, size: 1.8, speed: 55, op: 0.55, par: 0}) + e4Snow(n, {ux: 960, z: 1}, {n: 40, seed: 143, size: 3.8, speed: 130, op: 0.7, par: 0, blur: true}) + '</g>');
    return {cam, out: emFrame4(n, world, scr)};
  });
}
// 1) the dive: high over the night city (Manhattan's lights across the river) down to the fire block's street
const E4_DIVE = [[0.0, 1600, -300, 0, 24, 56, 3400, 0, 0], [3.6, 1555, -40, 0, 10, 42, 1300, 0, 20], [6.9, 1537, 30, 40, 2, 28, 470, 0, 30]];
function renderEp4NightDive(n, {tag: tg = 1} = {}) {
  const scr = []; if (tg > 0) scr.push(tag(130, 120, 'WILLIAMSBURG, BROOKLYN · JANUARY 1887 · 3 A.M.', tg));
  return emNightShot(n, E4_DIVE, {scr}).out;
}
// 2) the rise: off the fire block, up and back until Brooklyn, the river and Manhattan fill the frame (the edit gives the keys' start)
function renderEp4NightRise(n, a = 81.9, b = 95.5) {
  const K = [[a, 1540, 20, 20, 4, 24, 520, 0, 40], [a + (b - a) * 0.45, 1400, 60, 0, -14, 40, 2200, 0, 10], [b, 1050, 120, 0, -32, 46, 5200, 0, 0]];
  return emNightShot(n, K, {snow: 1}).out;
}

/* ---------- Brooklyn grows (ch 2) ---------- */
// The ghost blocks east of the river become rows of 2 to 5 storey buildings, each with the year it goes up (1870 to 1890, the
// blocks near the river and the modelled blocks first). The Brooklyn Bridge (towers, deck, cables) rises in 1883 south of the models.
const EM4_GROW = (() => {
  const out = [], r = rng(4401);
  for (const x of [1450, 1800, 2150, 2500, 2850]) for (const y of [-780, -530, -280, 30, 280, 530]) {
    if (EM_BK.cols.some(([a]) => a === x) && EM_BK.rows.some(([b]) => b === y)) continue;
    const near = (x - 1450) / 1400 + Math.abs(y) / 1600;
    for (const [y0, y1, front] of [[y, y + 92, 'S'], [y + 108, y + 200, 'N']]) {
      let xx = x; while (xx < x + 300 - 10) { const w = Math.min(x + 300 - xx, [25, 25, 25, 50][Math.floor(r() * 4)]), roll = r();
        const floors = roll < 0.25 ? 2 : roll < 0.55 ? 3 : roll < 0.85 ? 4 : 5, yr = 1870 + Math.min(19.5, near * 9 + r() * 10);
        if (r() < 0.9) out.push({x0: xx, x1: xx + w, y0, y1, floors, front, yr, seed: Math.floor(r() * 9999), shop: r() < 0.5});
        xx += w; }
    }
  }
  return out;
})();
const EM4_BRIDGE = {y: -1250, t1: 820, t2: 1130, zDeck: 40, zTop: 120, x0: 120, x1: 1800};
function emBridge(cam, k) { // k: 0..1 how far it has risen (towers first, then the deck and cables)
  if (k <= 0.01) return '';
  const B = EM4_BRIDGE, s = [], kt = clamp01(k * 1.6), kd = clamp01(k * 1.6 - 0.6), H = (c) => emMix(c, emC('haze'), emHazeK(cam, [975, B.y, 50]));
  for (const tx of [B.t1, B.t2]) { const top = B.zTop * kt;
    s.push(emBoxSimple(cam, tx - 14, tx + 14, B.y - 22, B.y + 22, 0, top, H('#2A3B3A'), H('#8FA39C'), H('#A9BAB3')));
    if (kt > 0.6) { const g = emFaceGeom({x0: tx - 14, x1: tx + 14, y0: B.y - 22, y1: B.y + 22}, 'S', 0, top); s.push(emQuad(cam, g, 6, 52, 22, 96, H('#13211F'))); } }
  if (kd > 0) {
    const xa = lerp(975, B.x0, kd), xb = lerp(975, B.x1, kd);
    s.push(emPoly(cam, [[xa, B.y - 9, B.zDeck], [xb, B.y - 9, B.zDeck], [xb, B.y + 9, B.zDeck], [xa, B.y + 9, B.zDeck]], H('#4E625E'), `stroke="${EM.cream}" stroke-opacity="0.35" stroke-width="1"`));
    for (const dy of [-10, 10]) { const cab = []; // main cables: anchor, tower top, sag, tower top, anchor
      const pts3 = [[B.x0, B.y + dy, B.zDeck + 4]]; pts3.push([B.t1, B.y + dy, B.zTop]);
      for (let i = 1; i < 12; i++) { const u = i / 12, x = lerp(B.t1, B.t2, u); pts3.push([x, B.y + dy, B.zTop - (B.zTop - B.zDeck - 6) * Math.sin(Math.PI * u)]); }
      pts3.push([B.t2, B.y + dy, B.zTop], [B.x1, B.y + dy, B.zDeck + 4]);
      for (const p of pts3) { if (p[0] < xa - 1 || p[0] > xb + 1) continue; const q = emP(cam, p); if (q) cab.push(q); }
      if (cab.length > 1) s.push(`<polyline points="${pts(cab)}" fill="none" stroke="${H('#C9D3CC')}" stroke-width="1.6" opacity="${f1(kd * 90) / 100}"/>`); }
  }
  return s.join('');
}
// o: {a, b: the narration window; y0, y1: the years shown over it; keys: camera keys; bridge: true}
function renderEp4Grow(n, o) {
  const yr = lerp(o.y0, o.y1, smooth(o.a + 0.3, o.b - 0.6, n));
  const cam = emCamera(n, o.keys, true), dist = (p) => v3.len(v3.sub(p, cam.C));
  const extra = EM4_GROW.filter((b) => yr > b.yr).map((b) => { const u = ease(clamp01((yr - b.yr) / 1.4)), h = emH(b.floors) * u;
    return {d: dist([(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, 0]), draw: () => emBuilding(cam, {...b, z0: 0, h, pal: emPal(null, false), kind: null, noChimney: u < 0.95})}; });
  if (o.bridge !== false) extra.push({d: dist([975, EM4_BRIDGE.y, 0]), draw: () => emBridge(cam, clamp01((yr - 1882.4) / 1.0))});
  const world = emWorld(n, cam, {extra, ferry: true});
  const scr = [], fixed = [];
  emFixed(scr, fixed, 130, 1000, `BROOKLYN · ${Math.floor(yr)}`, emOn(n, o.a, o.b + 5));
  if (o.bridgeTag !== false && yr > 1883) { const q = emP(cam, [EM4_BRIDGE.t2, EM4_BRIDGE.y, EM4_BRIDGE.zTop]);
    if (q) scr.unshift(emLabels([{lines: ['BROOKLYN BRIDGE · 1883'], a: q, off: [0, -110], op: emOn(n, o.bridgeAt ?? o.a, o.b + 5) * clamp01((yr - 1883) * 2)}], fixed)); }
  return emFrame(n, world, scr);
}

if (typeof window !== 'undefined') Object.assign(window, {renderEp4NightDive, renderEp4NightRise, renderEp4Grow, emNight, EM_NIGHT});
Object.assign(CLIPS, {
  ep4_ch1_dive: {sec: 7, render: (t) => renderEp4NightDive(t)},
  ep4_ch1_rise: {sec: 13, render: (t) => renderEp4NightRise(t + 81.9)},
  ep4_ch2_grow: {sec: 7, render: (t) => renderEp4Grow(t, {a: 0, b: 6, y0: 1870, y1: 1890, keys: [[0, 2150, -150, 0, -68, 38, 2900, 0, 0], [7, 2050, -150, 0, -56, 35, 2500, 0, 0]]})},
});
