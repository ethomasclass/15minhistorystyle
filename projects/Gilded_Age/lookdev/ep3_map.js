// Episode 3, chapter 6 "The Lower East Side": the enclave as a 3D-ish map (load after ep3.js; uses rig.js' helpers, explainers.js'
// tag/card/frame/SAFE and ep3.js' E3 colours and e3Defs).
//
//   ep3_enclave   A model of a few Lower East Side blocks, drawn in SVG from a real 3D -> 2D projection (a camera with yaw, pitch
//                 and distance, perspective, painter's sort by distance). Tenements are extruded boxes with cornices, window grids,
//                 shop awnings and fire escapes; streets carry pushcarts and tiny ink crowds; the Rabinowitzes' building is wheat
//                 gold. As the narration names each place it LIFTS out of the map with a soft shadow and a mono tag, and a teal
//                 line ties it to the gold building (the network is the enclave). Then the camera crosses the East River to a
//                 matching model of the Kellys' Irish blocks in Brooklyn (coral), where a parish church, a saloon and a savings
//                 bank lift the same way; the two networks side by side; then the dive into the gold building, whose roof lifts
//                 off to show one floor from above: four asleep in one room, a boarder in the kitchen, one sink in the hall.
//
// Timing: every beat is keyed to the narration (ep3/public/audio/ch06_the_lower_east_side.words.json, 87.7 s). The clip starts at
// narration time EM_T0; EM_CUE holds the word start times used (copy new times in here after a re-voice; one line of python lists
// them: json.load(open(f))['words'] -> [(w['w'], w['s'])]).
//
// World units are feet: x east, y north, z up. A lot is 25 ft wide; a tenement 85 ft deep; floors 12 ft (the store 13 ft).
// Colour rules: Kellys coral only, the Rabinowitzes wheat gold, everyone and everything else ink; teal draws the network and
// explains; labels are mono tags in screen space. Signs in the model are blank.

const EM_T0 = 23.0; // narration second at clip t = 0
const EM_CUE = { // narration word start times (s), from the words.json
  point: 24.1, enclave: 26.2, other: 32.6, work: 34.3, man: 35.2, kosher: 37.7, synagogue: 39.3, upstairs: 39.9, landsman: 42.9,
  paid: 46.8, doctor: 49.4, grave: 51.7, irish: 53.2, earlier: 55.7, parish: 56.6, saloon: 57.4, bank: 58.3, maKelly: 61.0,
  too: 62.9, cost: 63.7, tenements: 67.9, tiny: 68.8, sink: 70.5, four: 74.3, boarder: 76.0, rent: 77.6,
};
const EM = {
  ink: '#0D0C09', teal: '#2FE0C4', cream: '#F4EFE6', gold: '#E2B864', coral: '#FF6F61', orange: '#FF9F1C',
  haze: '#4E726C', bg: '#13211F', street: '#465C58', walk: '#71857F', yard: '#1A2826', ghost: '#2C413E', water: '#17302D',
  inkLit: '#33504C', inkDark: '#0C1716', roof: '#22383A', win: '#0A1312', iron: '#081010',
};
const DEG = Math.PI / 180;
const emHex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const emMix = (a, b, u) => { const A = emHex(a), B = emHex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * clamp01(u)).toString(16).padStart(2, '0')).join(''); };
const v3 = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k], dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  len: (a) => Math.hypot(a[0], a[1], a[2]), norm: (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; },
};
const EM_LIGHT = v3.norm([-0.45, -0.6, 0.66]); // cream morning light from the south-west, high

/* ---------- camera: monotone cubic through keyframes, then a real perspective projection ---------- */
// keys: [narration time, tx, ty, tz, yaw, pitch, D, ox, oy]
const EM_KEYS = [
  [23.0, -20, 100, 0, -31, 40, 2500, 0, 0],
  [24.6, -90, 90, 0, -28, 41, 2050, 0, 0],
  [26.6, -70, 100, 0, -25, 42, 2000, -330, -20],
  [33.0, -40, 105, 0, -19, 44, 1960, -330, -20],
  [34.6, 0, 110, 0, -16, 45, 1850, 0, -10],
  [42.0, 0, 120, 0, -12, 46, 1820, 0, -10],
  [46.0, -30, 130, 0, -10, 47, 1840, 0, 0],
  [52.6, -10, 125, 0, -8, 47, 1880, 0, 0],
  [54.2, 850, 90, 0, 3, 46, 2400, 0, 30],
  [55.8, 1760, 40, 0, 16, 44, 1250, 0, 40],
  [60.6, 1775, 50, 0, 22, 45, 1180, 0, 40],
  [61.9, 890, 90, 0, 4, 50, 3250, 0, 60],
  [63.7, 890, 90, 0, 0, 51, 3180, 0, 60],
  [67.4, -12.5, 72.5, 61, -90, 78, 178, 0, 0],
  [80.0, -12.5, 72.5, 61, -93, 80, 148, 0, 10],
];
function emInterp(keys, n) { // Fritsch-Carlson monotone cubic per channel (no overshoot, continuous velocity)
  const N = keys.length, out = [];
  if (n <= keys[0][0]) return keys[0].slice(1);
  if (n >= keys[N - 1][0]) return keys[N - 1].slice(1);
  let i = 0; while (keys[i + 1][0] < n) i++;
  for (let c = 1; c < keys[0].length; c++) {
    const T = keys.map((k) => k[0]), Y = keys.map((k) => k[c]);
    const d = (j) => (Y[j + 1] - Y[j]) / (T[j + 1] - T[j]);
    const m = (j) => { if (j === 0) return 0; if (j === N - 1) return 0; const a = d(j - 1), b = d(j); if (a * b <= 0) return 0; return 3 * (T[j + 1] - T[j - 1]) / ((2 * T[j + 1] - T[j] - T[j - 1]) / a + (T[j + 1] + T[j] - 2 * T[j - 1]) / b); };
    const h = T[i + 1] - T[i], s = (n - T[i]) / h, s2 = s * s, s3 = s2 * s;
    out.push((2 * s3 - 3 * s2 + 1) * Y[i] + (s3 - 2 * s2 + s) * h * m(i) + (-2 * s3 + 3 * s2) * Y[i + 1] + (s3 - s2) * h * m(i + 1));
  }
  return out;
}
function emCamera(n) {
  const [tx, ty, tz, yaw, pitch, D, ox, oy] = emInterp(EM_KEYS, n), ps = pitch * DEG, ys = yaw * DEG;
  const f = [Math.cos(ps) * Math.sin(ys), Math.cos(ps) * Math.cos(ys), -Math.sin(ps)], r = [Math.cos(ys), -Math.sin(ys), 0], u = v3.cross(r, f);
  return {f, r, u, C: v3.sub([tx, ty, tz], v3.mul(f, D)), F: 2400, cx: 960 + ox, cy: 540 + oy, D, T: [tx, ty, tz], yaw, pitch};
}
const EM_NEAR = 4;
const emCamPt = (cam, p) => { const d = v3.sub(p, cam.C); return [v3.dot(d, cam.r), v3.dot(d, cam.u), v3.dot(d, cam.f)]; };
const emScr = (cam, q) => [cam.cx + cam.F * q[0] / q[2], cam.cy - cam.F * q[1] / q[2]];
const emP = (cam, p) => { const q = emCamPt(cam, p); return q[2] > EM_NEAR ? emScr(cam, q) : null; };
function emPoly2(cam, P3) { // project a 3D polygon, clipped against the near plane
  let Q = P3.map((p) => emCamPt(cam, p));
  if (Q.every((q) => q[2] > EM_NEAR)) return Q.map((q) => emScr(cam, q));
  const out = [];
  for (let i = 0; i < Q.length; i++) {
    const a = Q[i], b = Q[(i + 1) % Q.length], ia = a[2] > EM_NEAR, ib = b[2] > EM_NEAR;
    if (ia) out.push(a);
    if (ia !== ib) { const k = (EM_NEAR - a[2]) / (b[2] - a[2]); out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, EM_NEAR]); }
  }
  return out.length >= 3 ? out.map((q) => emScr(cam, q)) : null;
}
const emPoly = (cam, P3, fill, extra = '') => { const s = emPoly2(cam, P3); return s ? `<polygon points="${pts(s)}" fill="${fill}" ${extra}/>` : ''; };
const emLine = (cam, a, b, col, w, extra = '') => { const A = emP(cam, a), B = emP(cam, b); return A && B ? `<line x1="${f1(A[0])}" y1="${f1(A[1])}" x2="${f1(B[0])}" y2="${f1(B[1])}" stroke="${col}" stroke-width="${f1(w * 10) / 10}" ${extra}/>` : ''; };
const emScale = (cam, p) => { const q = emCamPt(cam, p); return q[2] > EM_NEAR ? cam.F / q[2] : 0; }; // px per foot at p
const emSeen = (cam, p, nrm) => v3.dot(nrm, v3.sub(cam.C, p)) > 0;
const emHazeK = (cam, p) => clamp01((v3.len(v3.sub(p, cam.C)) - cam.D * 1.05) / (cam.D * 1.6)) * 0.6;

/* ---------- the model: blocks, lots, places ---------- */
// Lower East Side: three blocks east-west by three rows; Hester Street (the market) runs between rows 1 and 2.
// Brooklyn (the Kellys' blocks): two blocks by two rows across the East River, the Kellys' street between the rows.
const EM_LES = {cols: [[-500, -200], [-150, 150], [200, 500]], rows: [[-230, -30], [30, 230], [280, 480]]};
const EM_BK = {cols: [[1450, 1750], [1800, 2100]], rows: [[-230, -30], [30, 230]]};
const EM_RIVER = [650, 1300];
const LOT = 25, DEPTH = 85;
const emH = (floors) => 13 + 12 * (floors - 1);
// places (lot keys: model/col/row/side/lot index); side 's' = the row on the block's south edge (front faces south)
const EM_PLACES = {
  gold: {m: 'L', c: 1, r: 1, s: 's', i: 5, floors: 6, col: 'gold', name: 'THE RABINOWITZES'},
  butcher: {m: 'L', c: 2, r: 1, s: 's', i: 3, floors: 5, kind: 'butcher', cue: EM_CUE.kosher, tag: ['KOSHER BUTCHER']},
  synagogue: {m: 'L', c: 0, r: 0, s: 's', i: 8, floors: 5, kind: 'shul', cue: EM_CUE.synagogue, tag: ['SYNAGOGUE UPSTAIRS OVER A SHOP'], tagAt: EM_CUE.upstairs},
  workshop: {m: 'L', c: 2, r: 2, s: 's', i: 4, floors: 6, kind: 'shop', cue: EM_CUE.work, tag: ['A JOB THROUGH A MAN FROM HOME'], tagAt: EM_CUE.man},
  hall: {m: 'L', c: 0, r: 2, s: 's', i: 7, w: 2, floors: 4, kind: 'hall', cue: EM_CUE.landsman, tag: ['LANDSMANSHAFT']},
  kelly: {m: 'B', c: 0, r: 1, s: 's', i: 5, floors: 6, col: 'coral', name: 'THE KELLYS'},
  saloon: {m: 'B', c: 0, r: 1, s: 's', i: 11, floors: 3, kind: 'saloon', cue: EM_CUE.saloon, tag: ['SALOON']},
  bank: {m: 'B', c: 0, r: 0, s: 's', i: 1, w: 2, floors: 3, kind: 'bank', cue: EM_CUE.bank, tag: ['SAVINGS BANK']},
  church: {m: 'B', c: 1, r: 1, s: 's', i: 4, w: 3, floors: 4, kind: 'church', cue: EM_CUE.parish, tag: ['PARISH CHURCH']},
};
const EM_MARKET = {x0: -480, x1: -210, y0: -27, y1: 27, cue: EM_CUE.point};
function emLots() { // every building lot of both models, built once
  const out = [], taken = {};
  for (const [k, p] of Object.entries(EM_PLACES)) for (let j = 0; j < (p.w || 1); j++) taken[`${p.m}${p.c}${p.r}${p.s}${p.i + j}`] = k;
  for (const [m, M] of [['L', EM_LES], ['B', EM_BK]]) {
    M.cols.forEach(([x0, x1], c) => M.rows.forEach(([y0, y1], r) => ['s', 'n'].forEach((s) => {
      const n = Math.round((x1 - x0) / LOT), rr = rng(1000 + c * 37 + r * 101 + (s === 'n' ? 7 : 0) + (m === 'B' ? 500 : 0));
      for (let i = 0; i < n; i++) {
        const key = `${m}${c}${r}${s}${i}`, pk = taken[key];
        const roll = rr(), roll2 = rr();
        if (pk && EM_PLACES[pk].i !== i) continue; // the rest of a wide place
        const p = pk ? EM_PLACES[pk] : null, w = p ? (p.w || 1) * LOT : LOT;
        let floors = p ? p.floors : (m === 'L' ? (roll < 0.15 ? 4 : roll < 0.6 ? 5 : 6) : (roll < 0.35 ? 4 : roll < 0.85 ? 5 : 3));
        const lot = {key, m, c, r, s, i, x0: x0 + i * LOT, x1: x0 + i * LOT + w, y0: s === 's' ? y0 : y1 - DEPTH, y1: s === 's' ? y0 + DEPTH : y1,
          front: s === 's' ? 'S' : 'N', floors, shop: roll2 < 0.75, seed: Math.floor(roll2 * 9999), place: pk || null};
        out.push(lot);
      }
    })));
  }
  // the gold building's neighbours stay at five floors, so the open top floor is not hidden from above
  const g = out.find((l) => l.place === 'gold');
  out.forEach((l) => { if (l.m === 'L' && l.r === g.r && l.c === g.c && l.s === g.s && Math.abs(l.i - g.i) <= 2 && l !== g) l.floors = Math.min(l.floors, 5); });
  return out;
}
const EM_LOTS = emLots();
const emLot = (k) => EM_LOTS.find((l) => l.place === k);
const emTop = (k) => { const l = emLot(k); return [(l.x0 + l.x1) / 2, (l.y0 + l.y1) / 2, emH(l.floors) + (l.place === 'church' ? 30 : 0)]; };

/* ---------- beats: lifts, lines, opacity ---------- */
const emLiftU = (n, cue) => { // 0 -> 1 with a small overshoot, settling back down when the chapter turns to the cost
  if (cue == null) return 0;
  const a = clamp01((n - cue) / 0.9), up = a <= 0 ? 0 : 1 + 0.12 * Math.sin(a * Math.PI) - (1 - a) ** 3;
  const down = 1 - smooth(EM_CUE.cost, EM_CUE.cost + 1.6, n);
  return Math.max(0, up) * down;
};
const EM_LIFT = 82; // ft: enough to clear the roofs, so a lifted place floats free of the rows in front of it
function emPlaceLift(k, n) { const p = EM_PLACES[k]; return p.cue == null ? 0 : EM_LIFT * emLiftU(n, p.cue) + (emLiftU(n, p.cue) > 0.99 ? 1.2 * Math.sin(n * 1.7 + p.i) : 0); }
const emMarketLift = (n) => 84 * emLiftU(n, EM_MARKET.cue);

/* ---------- drawing a box building ---------- */
const EM_FACES = { // name: [normal, origin corner fn, U (along), width key]
  S: [0, -1, 0], N: [0, 1, 0], W: [-1, 0, 0], E: [1, 0, 0],
};
function emFaceGeom(b, name, z0, z1) {
  // origin O, unit U along the face (left to right seen from outside), width W, normal N
  const {x0, x1, y0, y1} = b;
  if (name === 'S') return {O: [x0, y0, z0], U: [1, 0, 0], W: x1 - x0, N: [0, -1, 0], H: z1 - z0};
  if (name === 'N') return {O: [x1, y1, z0], U: [-1, 0, 0], W: x1 - x0, N: [0, 1, 0], H: z1 - z0};
  if (name === 'W') return {O: [x0, y1, z0], U: [0, -1, 0], W: y1 - y0, N: [-1, 0, 0], H: z1 - z0};
  return {O: [x1, y0, z0], U: [0, 1, 0], W: y1 - y0, N: [1, 0, 0], H: z1 - z0};
}
const emAt = (g, u, v, out = 0) => [g.O[0] + g.U[0] * u + g.N[0] * out, g.O[1] + g.U[1] * u + g.N[1] * out, g.O[2] + v];
const emQuad = (cam, g, u0, v0, u1, v1, fill, extra = '', out = 0) => emPoly(cam, [emAt(g, u0, v0, out), emAt(g, u1, v0, out), emAt(g, u1, v1, out), emAt(g, u0, v1, out)], fill, extra);
function emPal(col, place) {
  if (col === 'gold') return {lit: '#E2B864', dark: '#8A6A2C', top: '#C9A055', win: '#5A4318', trim: '#6B5222', shop: '#FFF0C9'};
  if (col === 'coral') return {lit: '#FF6F61', dark: '#9A3F37', top: '#D9675B', win: '#5E201B', trim: '#7A2F28', shop: '#FFD9D3'};
  if (place) return {lit: '#A9BAB3', dark: '#4E625E', top: '#C9D3CC', win: '#1A2826', trim: '#22302E', shop: '#F4EFE6'};
  return {lit: EM.inkLit, dark: EM.inkDark, top: EM.roof, win: EM.win, trim: EM.iron, shop: '#F4EFE6'};
}
function emShade(pal, nrm) { const d = v3.dot(nrm, EM_LIGHT); return emMix(pal.dark, pal.lit, clamp01(0.12 + 0.88 * (d + 0.6) / 1.26)); }
// one building: box faces (back-face culled), facade detail on the street front and the back, cornice, fire escapes, awning,
// a chimney on the roof. b: {x0..y1, z0 (lift), h, floors, front, pal, kind, seed, shop, op}
function emBuilding(cam, b) {
  const s = [], z0 = b.z0 || 0, z1 = z0 + b.h, pal = b.pal, cen = [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, z0 + b.h / 2];
  const hz = emHazeK(cam, cen), H = (c) => emMix(c, EM.haze, hz), sc = emScale(cam, cen);
  if (sc <= 0) return '';
  const det = clamp01(1 - hz * 1.4);
  for (const name of ['S', 'N', 'W', 'E']) {
    const g = emFaceGeom(b, name, z0, z1);
    if (!emSeen(cam, g.O, g.N) && !emSeen(cam, emAt(g, g.W, g.H), g.N)) continue;
    s.push(emQuad(cam, g, 0, 0, g.W, g.H, H(emShade(pal, g.N))));
    const isFront = name === b.front, isBack = (b.front === 'S' && name === 'N') || (b.front === 'N' && name === 'S');
    if (det > 0.05 && (isFront || isBack) && b.kind !== 'church') s.push(emFacade(cam, b, g, isFront, sc, H, det));
    else if (det > 0.05 && b.kind === 'church') s.push(emChurchSide(cam, b, g, isFront, sc, H));
    if (b.edge) s.push(emQuad(cam, g, 0, 0, g.W, g.H, 'none', `stroke="${b.edge}" stroke-width="1.6" stroke-opacity="0.75"`));
  }
  // roof
  const top = [[b.x0, b.y0, z1], [b.x1, b.y0, z1], [b.x1, b.y1, z1], [b.x0, b.y1, z1]];
  if (b.kind !== 'church') {
    s.push(emPoly(cam, top, H(pal.top), b.edge ? `stroke="${b.edge}" stroke-width="2"` : `stroke="${EM.cream}" stroke-opacity="${f1(0.16 * det * 100) / 100}" stroke-width="1"`));
    if (!b.noChimney && sc > 0.35) { const r = rng(b.seed + 3), cx = b.x0 + 3 + r() * (b.x1 - b.x0 - 8), cy = b.y0 + 8 + r() * (b.y1 - b.y0 - 16);
      s.push(emBoxSimple(cam, cx, cx + 3, cy, cy + 4, z1, z1 + 5, H(pal.dark), H(pal.lit), H(pal.top))); }
  }
  return `<g${b.op != null && b.op < 1 ? ` opacity="${f1(b.op * 100) / 100}"` : ''}>${s.join('')}</g>`;
}
function emBoxSimple(cam, x0, x1, y0, y1, z0, z1, dark, lit, top, extra = '') { // a plain box, culled faces
  const pal = {dark, lit}, s = [];
  for (const name of ['S', 'N', 'W', 'E']) { const g = emFaceGeom({x0, x1, y0, y1}, name, z0, z1); if (emSeen(cam, g.O, g.N) || emSeen(cam, emAt(g, g.W, g.H), g.N)) s.push(emQuad(cam, g, 0, 0, g.W, g.H, emShade(pal, g.N), extra)); }
  s.push(emPoly(cam, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], top, extra));
  return s.join('');
}
function emFacade(cam, b, g, isFront, sc, H, det) {
  const s = [], W = g.W, nf = b.floors, pal = b.pal, r = rng(b.seed), op = (v) => `opacity="${f1(v * det * 100) / 100}"`;
  const fine = sc > 1.1, cols = Math.max(3, Math.round(W / 8.4));
  for (let f = 1; f < nf; f++) {
    const z = 13 + 12 * (f - 1);
    if (!fine) { s.push(emQuad(cam, g, 2, z + 3, W - 2, z + 8.5, H(pal.win), op(0.75))); continue; }
    for (let k = 0; k < cols; k++) {
      const uc = W * (k + 0.5) / cols;
      let ww = 3, v0 = z + 3, v1 = z + 8.6, fill = H(pal.win), o = 1;
      if (b.kind === 'shul' && f === 1 && isFront) { v0 = z + 1.5; v1 = z + 10.2; fill = '#F4EFE6'; o = 0.5; ww = 3.6; } // the upstairs prayer room: tall bright windows
      else if (b.kind === 'hall' && f === 1 && isFront) { v0 = z + 1.5; v1 = z + 10; fill = '#F4EFE6'; o = 0.42; }
      else if (b.kind === 'shop' && f === nf - 1) { fill = '#FFF3D6'; o = 0.55; } // the workshop under the roof, lit
      else if (r() < 0.12) { fill = '#DFE0D6'; o = 0.35; }
      s.push(emQuad(cam, g, uc - ww / 2, v0, uc + ww / 2, v1, fill, o < 1 ? op(o) : op(1)));
      if ((b.kind === 'shul' || b.kind === 'hall') && f === 1 && isFront) s.push(emPoly(cam, [emAt(g, uc - ww / 2, v1), emAt(g, uc, v1 + 1.4), emAt(g, uc + ww / 2, v1)], fill, op(o)));
      if (sc > 2.2) s.push(emQuad(cam, g, uc - ww / 2 - 0.4, v1, uc + ww / 2 + 0.4, v1 + 0.6, H(pal.trim), op(1)));
    }
  }
  // the ground floor: shop window, door; the bank gets columns; the church is drawn elsewhere
  if (isFront) {
    if (b.kind === 'bank') {
      for (let k = 0; k < 5; k++) { const u = 4 + k * (W - 8) / 4; s.push(emQuad(cam, g, u - 0.9, 0, u + 0.9, 22, H('#DFE0D6'), op(0.55))); }
      s.push(emQuad(cam, g, W / 2 - 2.5, 0, W / 2 + 2.5, 9, H(pal.win), op(1)));
    } else if (b.shop || b.kind) {
      const lit = b.kind === 'butcher' || b.kind === 'saloon' ? 0.42 : 0.2;
      s.push(emQuad(cam, g, 1.5, 1.2, W * 0.58, 10, H(pal.shop), op(lit)));
      s.push(emQuad(cam, g, W * 0.68, 0, W * 0.68 + 3.6, 8.5, H(pal.win), op(1)));
      if (fine) { // awning, sloping out over the sidewalk
        const aw = b.kind === 'saloon' ? 5 : 4;
        s.push(emPoly(cam, [emAt(g, 1, 11.2), emAt(g, W * 0.62, 11.2), emAt(g, W * 0.62, 9, aw), emAt(g, 1, 9, aw)], H(b.kind ? '#C8C2B2' : pal.trim), op(b.kind ? 0.75 : 0.95)));
      }
    } else s.push(emQuad(cam, g, W * 0.4, 0, W * 0.4 + 3.6, 8.5, H(pal.win), op(1)));
  }
  // cornice: a dark band and a lip that catches the light
  const top = g.H;
  s.push(emQuad(cam, g, 0, top - 2.4, W, top, H(pal.trim), op(1)));
  if (fine) s.push(emPoly(cam, [emAt(g, -0.6, top), emAt(g, W + 0.6, top), emAt(g, W + 0.6, top, 1.6), emAt(g, -0.6, top, 1.6)], H(pal.trim), op(1)) +
    emLine(cam, emAt(g, -0.6, top, 1.6), emAt(g, W + 0.6, top, 1.6), EM.cream, Math.max(0.6, sc * 0.35), `stroke-opacity="${f1(0.4 * det * 100) / 100}"`));
  // fire escapes on the street front of tenements
  if (isFront && fine && !b.kind && nf >= 4) {
    for (let f = 1; f < nf; f++) {
      const z = 13 + 12 * (f - 1);
      s.push(emPoly(cam, [emAt(g, 3, z), emAt(g, W - 3, z), emAt(g, W - 3, z, 3.4), emAt(g, 3, z, 3.4)], H(EM.iron), op(0.9)));
      if (sc > 1.7) {
        s.push(emLine(cam, emAt(g, 3, z + 3, 3.4), emAt(g, W - 3, z + 3, 3.4), H(EM.iron), Math.max(0.7, sc * 0.18), op(0.9)));
        if (f < nf - 1) s.push(emLine(cam, emAt(g, W - 5, z, 3), emAt(g, W - 10, z + 12, 3), H(EM.iron), Math.max(0.7, sc * 0.2), op(0.9)));
        if (r() < 0.4) for (let q = 0; q < 3; q++) { const u = 5 + q * 4 + r() * 2; s.push(emQuad(cam, g, u, z + 1.2, u + 2, z + 2.8, '#DFE0D6', op(0.42), 3.4)); } // washing
      }
    }
  }
  return s.join('');
}
// the parish church: lancet windows on the nave, a door; drawn on the box faces
function emChurchSide(cam, b, g, isFront, sc, H) {
  const s = [];
  if (g.N[0] !== 0) for (let u = 10; u < g.W - 6; u += 14) { s.push(emQuad(cam, g, u - 1.6, 12, u + 1.6, 32, '#F4EFE6', 'opacity="0.38"')); s.push(emPoly(cam, [emAt(g, u - 1.6, 32), emAt(g, u, 36), emAt(g, u + 1.6, 32)], '#F4EFE6', 'opacity="0.38"')); }
  if (isFront) s.push(emQuad(cam, g, g.W / 2 - 3, 0, g.W / 2 + 3, 12, H(EM.win)), emPoly(cam, [emAt(g, g.W / 2 - 3, 12), emAt(g, g.W / 2, 16), emAt(g, g.W / 2 + 3, 12)], H(EM.win)));
  return s.join('');
}
// a gable roof (ridge along y) and a pyramid spire: convex solids, faces culled by their outward normals
function emSolid(cam, faces, pal, H, edge) {
  const cen = faces.flat().reduce((a, p) => v3.add(a, p), [0, 0, 0]).map((v) => v / faces.flat().length), s = [];
  for (const F of faces) {
    let nrm = v3.norm(v3.cross(v3.sub(F[1], F[0]), v3.sub(F[2], F[0]))); const fc = F.reduce((a, p) => v3.add(a, p), [0, 0, 0]).map((v) => v / F.length);
    if (v3.dot(nrm, v3.sub(fc, cen)) < 0) nrm = v3.mul(nrm, -1);
    if (!emSeen(cam, fc, nrm)) continue;
    s.push(emPoly(cam, F, H(emShade(pal, nrm)), edge ? `stroke="${edge}" stroke-width="1.4" stroke-opacity="0.7"` : ''));
  }
  return s.join('');
}
function emChurch(cam, l, lift, pal, edge, n) {
  const z0 = lift, x0 = l.x0 + 6, x1 = l.x1 - 6, y0 = l.y0 + 22, y1 = l.y1 + 10, hN = 42, ridge = 66, cen = [(x0 + x1) / 2, (y0 + y1) / 2, z0 + 30];
  const hz = emHazeK(cam, cen), H = (c) => emMix(c, EM.haze, hz), xm = (x0 + x1) / 2;
  const nave = {x0, x1, y0, y1, z0, h: hN, floors: 1, front: 'S', pal, kind: 'church', seed: 5, edge, noChimney: true};
  const roof = [[[x0, y0, z0 + hN], [x1, y0, z0 + hN], [xm, y0, z0 + ridge]], [[x0, y1, z0 + hN], [x1, y1, z0 + hN], [xm, y1, z0 + ridge]],
    [[x0, y0, z0 + hN], [xm, y0, z0 + ridge], [xm, y1, z0 + ridge], [x0, y1, z0 + hN]], [[x1, y0, z0 + hN], [xm, y0, z0 + ridge], [xm, y1, z0 + ridge], [x1, y1, z0 + hN]]];
  const tx0 = xm - 11, tx1 = xm + 11, ty0 = l.y0 + 2, ty1 = l.y0 + 24, tH = 92;
  const tower = {x0: tx0, x1: tx1, y0: ty0, y1: ty1, z0, h: tH, floors: 1, front: 'S', pal, kind: 'church', seed: 6, edge, noChimney: true};
  const spire = [[[tx0, ty0, z0 + tH], [tx1, ty0, z0 + tH], [xm, (ty0 + ty1) / 2, z0 + tH + 62]], [[tx1, ty0, z0 + tH], [tx1, ty1, z0 + tH], [xm, (ty0 + ty1) / 2, z0 + tH + 62]],
    [[tx1, ty1, z0 + tH], [tx0, ty1, z0 + tH], [xm, (ty0 + ty1) / 2, z0 + tH + 62]], [[tx0, ty1, z0 + tH], [tx0, ty0, z0 + tH], [xm, (ty0 + ty1) / 2, z0 + tH + 62]]];
  const naveS = emBuilding(cam, nave) + emSolid(cam, roof, {lit: pal.lit, dark: pal.dark}, H, edge);
  const towS = emBuilding(cam, tower) + emSolid(cam, spire, {lit: pal.lit, dark: pal.dark}, H, edge) +
    (() => { const g = emFaceGeom(tower, 'S', z0, z0 + tH); return emQuad(cam, g, 7, 60, 15, 72, '#F4EFE6', 'opacity="0.35"') + emQuad(cam, g, 8, 0, 14, 13, H(EM.win)); })();
  // tower in front (south) of the nave: order by distance
  const dT = v3.len(v3.sub([xm, (ty0 + ty1) / 2, z0 + 40], cam.C)), dN = v3.len(v3.sub(cen, cam.C));
  return dT < dN ? naveS + towS : towS + naveS;
}
function emBank(cam, b, H) { // a pediment over the front
  const g = emFaceGeom(b, 'S', b.z0, b.z0 + b.h), W = g.W, top = b.h;
  return emPoly(cam, [emAt(g, -0.6, top), emAt(g, W / 2, top + 9), emAt(g, W + 0.6, top)], H('#5C7772'), `stroke="${EM.cream}" stroke-opacity="0.45" stroke-width="1.2"`);
}

/* ---------- people and pushcarts ---------- */
function emPerson(cam, x, y, z, h, col, op = 1) {
  const B = emP(cam, [x, y, z]), S = emP(cam, [x, y, z + h * 0.8]), Hd = emP(cam, [x, y, z + h * 0.93]);
  if (!B || !S || !Hd) return '';
  const sc = emScale(cam, [x, y, z]); if (sc < 0.25) return '';
  const w = Math.max(1.2, sc * 1.25), hr = Math.max(0.8, sc * 0.42);
  return `<g opacity="${f1(op * 100) / 100}"><line x1="${f1(B[0])}" y1="${f1(B[1])}" x2="${f1(S[0])}" y2="${f1(S[1])}" stroke="${col}" stroke-width="${f1(w)}" stroke-linecap="round"/><circle cx="${f1(Hd[0])}" cy="${f1(Hd[1])}" r="${f1(hr)}" fill="${col}"/></g>`;
}
function emCart(cam, x, y, z, seed, H) { // a pushcart: a bed on two wheels with goods heaped on it; some carry an umbrella
  const r = rng(seed), s = [], sc = emScale(cam, [x, y, z]); if (sc < 0.3) return '';
  s.push(emBoxSimple(cam, x - 3, x + 3, y - 1.3, y + 1.3, z + 1.6, z + 2.8, H('#0B1312'), H('#3A2E22'), H('#2A2017')));
  if (sc > 0.7) { const goods = ['#DFE0D6', '#A3BAB2', '#7C918B', '#C8C2B2']; for (let k = 0; k < 4; k++) { const gx = x - 2.2 + k * 1.5, gy = y - 0.6 + r() * 1.2; s.push(emBoxSimple(cam, gx - 0.6, gx + 0.6, gy - 0.6, gy + 0.6, z + 2.8, z + 3.6 + r() * 0.6, H('#3E4F4C'), H(goods[Math.floor(r() * 4)]), H(goods[Math.floor(r() * 4)]))); } }
  if (r() < 0.35) { const ring = []; for (let k = 0; k < 10; k++) ring.push([x + Math.cos(k * TAU / 10) * 3, y + Math.sin(k * TAU / 10) * 3, z + 8]);
    s.push(emLine(cam, [x, y, z + 2.8], [x, y, z + 8], H('#0B1312'), Math.max(0.6, sc * 0.2)) + emPoly(cam, ring, H(r() < 0.5 ? '#DFE0D6' : '#7C918B'), 'opacity="0.9"')); }
  return s.join('');
}
// seeded street life: carts end to end along Hester's curbs, a crowd in the market, walkers on the other streets
const EM_LIFE = (() => {
  const r = rng(77), carts = [], folk = [];
  for (const side of [-1, 1]) for (let x = -495; x < 495; x += 7.4 + r() * 2.5) if (r() < 0.86) carts.push({x, y: side * 21 + (r() - 0.5), seed: Math.floor(r() * 9999)});
  for (let k = 0; k < 230; k++) { const x = -495 + r() * 990, y = (r() - 0.5) * 34; folk.push({x, y, v: (r() - 0.5) * 5, ph: r(), h: 5.2 + r() * 0.7, stand: r() < 0.45}); }
  // the other streets (sidewalks): fewer people, walking
  const lanes = [];
  for (const yy of [-262, -238, -222, 38, 222, 242, 270, 288]) lanes.push({ax: 'x', c: yy, a: -520, b: 520, m: 'L'});
  for (const xx of [-192, -158, 158, 192]) lanes.push({ax: 'y', c: xx, a: -260, b: 500, m: 'L'});
  for (const yy of [-24, -8, 8, 24, -238, 238]) lanes.push({ax: 'x', c: yy, a: 1430, b: 2120, m: 'B'});
  for (const xx of [1758, 1792]) lanes.push({ax: 'y', c: xx, a: -250, b: 250, m: 'B'});
  const walkers = [];
  lanes.forEach((L, li) => { const nn = L.m === 'L' ? 14 : 9; for (let k = 0; k < nn; k++) walkers.push({L, s: r(), v: (r() < 0.5 ? -1 : 1) * (3 + r() * 2), h: 5.2 + r() * 0.7}); });
  // a few wagons and carts on the Brooklyn street
  for (let k = 0; k < 10; k++) carts.push({x: 1440 + r() * 660, y: (r() < 0.5 ? -1 : 1) * 21, seed: Math.floor(r() * 9999), bk: true});
  return {carts, folk, walkers};
})();

/* ---------- the open floor (the Rabinowitzes' top floor, a dumbbell tenement plan) ---------- */
// u across the lot (0 = west party wall, 25 = east), v from the street front (0) to the rear (85). Four flats a floor: two front, two
// rear, three rooms each (front room, kitchen, a small dark bedroom); the hall and stairs down the middle with the water closets and
// ONE sink for the floor. Airshafts pinch the middle (the dumbbell). The Rabinowitzes have the front flat on the west side.
const EM_PLAN = (() => {
  const W = [ // wall segments [u0, v0, u1, v1, thick]
    [0, 0, 25, 0, 1], [25, 0, 25, 33, 1], [25, 33, 22.5, 33, 1], [22.5, 33, 22.5, 52, 1], [22.5, 52, 25, 52, 1], [25, 52, 25, 85, 1], [25, 85, 0, 85, 1],
    [0, 85, 0, 52, 1], [0, 52, 2.5, 52, 1], [2.5, 52, 2.5, 33, 1], [2.5, 33, 0, 33, 1], [0, 33, 0, 0, 1],
    [12.5, 0, 12.5, 13, 0.5], [0, 13, 4, 13, 0.5], [6.5, 13, 18.5, 13, 0.5], [21, 13, 25, 13, 0.5], // front rooms | kitchens (doors)
    [0, 24, 6, 24, 0.5], [8.5, 24, 16.5, 24, 0.5], [19, 24, 25, 24, 0.5], // kitchens | bedrooms
    [2.5, 33, 11, 33, 0.5], [14, 33, 22.5, 33, 0.5], // bedrooms | water closets
    [11, 13, 11, 15, 0.5], [11, 17.5, 11, 34.5, 0.5], [11, 36.2, 11, 54, 0.5], [11, 56.5, 11, 68, 0.5], // west hall wall (doors)
    [14, 13, 14, 15, 0.5], [14, 17.5, 14, 34.5, 0.5], [14, 36.2, 14, 54, 0.5], [14, 56.5, 14, 68, 0.5], // east hall wall
    [2.5, 37.5, 11, 37.5, 0.5], [14, 37.5, 22.5, 37.5, 0.5], // water closets | rear bedrooms
    [0, 52.5, 2.5, 52.5, 0.01], [2.5, 52, 6, 52, 0.5], [8.5, 52, 16.5, 52, 0.5], [19, 52, 22.5, 52, 0.5], // rear bedrooms | rear kitchens
    [0, 68, 4, 68, 0.5], [6.5, 68, 18.5, 68, 0.5], [21, 68, 25, 68, 0.5], [12.5, 68, 12.5, 85, 0.5], // rear kitchens | rear rooms
  ];
  const win = [[2.5, 0, 6], [7.5, 0, 11], [14, 0, 17.5], [19, 0, 22.5], [2.5, 85, 6], [7.5, 85, 11], [14, 85, 17.5], [19, 85, 22.5]]; // u0, v, u1 on fronts
  const fam = [ // the four Rabinowitzes in the bedroom: parents on the bed, the children on a mattress on the floor [u, v, angle(deg), size]
    [1.9, 25.2, 0, 1], [4.1, 25.2, 0, 0.96], [7.4, 25.6, 0, 0.82], [9.4, 25.6, 0, 0.7]];
  const others = [[15, 25.2, 0, 1], [17.2, 25.3, 0, 0.95], [20.5, 25.6, 0, 0.75], [4, 39, 0, 1], [6.3, 39.2, 0, 0.9], [16, 39, 0, 1], [18.4, 39, 0, 0.85], [20.6, 39.3, 0, 0.7],
    [2, 70, 0, 1], [4.3, 70, 0, 0.9], [20, 70, 0, 1], [22.3, 70.2, 0, 0.8], [16.2, 61, 90, 0.95], [6.5, 77, 90, 0.8]];
  return {W, win, fam, others, boarder: [1.8, 14.8, 0, 1], sink: [12.2, 29.5]};
})();
function emPlanDraw(cam, n, lot, z) {
  const P = (u, v, dz = 0) => [lot.x0 + u, lot.y0 + v, z + dz], s = [], q = (pp, fill, ex = '') => emPoly(cam, pp.map(([u, v, dz]) => P(u, v, dz || 0)), fill, ex);
  const reveal = smooth(EM_CUE.tenements - 0.4, EM_CUE.tenements + 0.8, n);
  // floor: the dumbbell outline in paper; the inner (windowless) rooms darker; the airshafts open to the dark below
  s.push(q([[0, 0], [25, 0], [25, 33], [22.5, 33], [22.5, 52], [25, 52], [25, 85], [0, 85], [0, 52], [2.5, 52], [2.5, 33], [0, 33]], '#E9DFC8'));
  s.push(q([[0, 24], [11, 24], [11, 33], [0, 33]], '#B7AB90'), q([[14, 24], [25, 24], [25, 33], [14, 33]], '#B7AB90'), q([[2.5, 37.5], [11, 37.5], [11, 52], [2.5, 52]], '#B7AB90'), q([[14, 37.5], [22.5, 37.5], [22.5, 52], [14, 52]], '#B7AB90'));
  s.push(q([[11, 13], [14, 13], [14, 68], [11, 68]], '#CFC4AA'));
  s.push(q([[0, 0], [12.5, 0], [12.5, 13], [11, 13], [11, 24], [0, 24]], '#F2DDAA'), q([[0, 24], [11, 24], [11, 33], [0, 33]], '#C9A96A')); // their flat, in their gold
  s.push(q([[0, 33], [2.5, 33], [2.5, 52], [0, 52]], '#0A1110'), q([[22.5, 33], [25, 33], [25, 52], [22.5, 52]], '#0A1110'));
  for (let v = 1.5; v < 85; v += 1.5) s.push(emLine(cam, P(0.6, v), P(24.4, v), '#8C7E62', 0.6, 'stroke-opacity="0.25"')); // floorboards
  // stairs in the hall
  for (let v = 40; v <= 50; v += 1) s.push(emLine(cam, P(11.3, v), P(13.7, v), '#5A503E', 1, 'stroke-opacity="0.7"'));
  // flat things on the floor: sleepers, mattresses, the bed (a low box), the cot
  const sleeper = (u, v, ang, k, col, blanket) => { // seen from above: a head and a blanket-covered body, feet toward +v
    const L = 5.2 * k, w = 1.7 * k, a = ang * DEG, ax = [Math.sin(a), Math.cos(a)], px = [Math.cos(a), -Math.sin(a)];
    const at = (t, sd, dz) => P(u + ax[0] * t + px[0] * sd, v + ax[1] * t + px[1] * sd, dz);
    return emPoly(cam, [at(1.0, -w / 2, 1.1), at(L, -w / 2, 1.1), at(L, w / 2, 1.1), at(1.0, w / 2, 1.1)], blanket, 'rx="2"') +
      (() => { const c = emP(cam, at(0.5, 0, 1.2)), sc = emScale(cam, at(0.5, 0, 1.2)); return c ? `<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(0.48 * k * sc)}" fill="${col}"/>` : ''; })() +
      emLine(cam, at(1.3, -w / 2 + 0.2, 1.15), at(1.3, w / 2 - 0.2, 1.15), col, Math.max(1, emScale(cam, at(1, 0, 1)) * 0.35));
  };
  const famOn = smooth(EM_CUE.four - 0.6, EM_CUE.four + 0.2, n), board = smooth(EM_CUE.boarder - 0.6, EM_CUE.boarder + 0.2, n);
  s.push(emBoxSimple(cam, lot.x0 + 0.6, lot.x0 + 5.8, lot.y0 + 24.6, lot.y0 + 31.6, z, z + 1.0, '#3B2A18', '#6B5236', '#7A6448')); // the bed
  s.push(q([[6.5, 25.0, 0.3], [10.6, 25.0, 0.3], [10.6, 30.8, 0.3], [6.5, 30.8, 0.3]], '#D9CDB2', 'stroke="#8C7E62" stroke-width="1"')); // the floor mattress
  s.push(emBoxSimple(cam, lot.x0 + 0.5, lot.x0 + 3.2, lot.y0 + 14.3, lot.y0 + 20.6, z, z + 0.9, '#3B2A18', '#6B5236', '#7A6448')); // the boarder's cot
  // the family: drawn gold, and pulsed in when the narration says it
  for (const [u, v, a, k] of EM_PLAN.fam) s.push(`<g opacity="${f1((0.35 + 0.65 * famOn) * 100) / 100}">${sleeper(u, v, a, k, '#7A5B22', '#E2B864')}</g>`);
  s.push(`<g opacity="${f1((0.35 + 0.65 * board) * 100) / 100}">${sleeper(...EM_PLAN.boarder, '#0D0C09', '#3E4F4C')}</g>`);
  for (const [u, v, a, k] of EM_PLAN.others) { // the neighbours' mattresses and sleepers, in ink
    s.push(q([[u - 1.1 * k, v - 0.3], [u + 1.1 * k, v - 0.3], [u + 1.1 * k, v + 5.6 * k], [u - 1.1 * k, v + 5.6 * k]].map(([a2, b2]) => a === 90 ? [u + (b2 - v) - 2.5, v + (a2 - u)] : [a2, b2]), '#C8BBA0'));
    s.push(sleeper(a === 90 ? u - 2.3 : u, a === 90 ? v : v, a, k, '#0D0C09', '#4A5755'));
  }
  // furniture boxes and the walls, sorted far to near
  const boxes = [];
  const bx = (u0, u1, v0, v1, h, dark, lit, top) => boxes.push({c: P((u0 + u1) / 2, (v0 + v1) / 2, h / 2), d: () => emBoxSimple(cam, lot.x0 + u0, lot.x0 + u1, lot.y0 + v0, lot.y0 + v1, z, z + h, dark, lit, top)});
  bx(8.2, 10.6, 21.0, 23.4, 2.8, '#050505', '#2A2A28', '#1A1A18'); // stove
  bx(5.0, 8.0, 15.8, 18.4, 2.5, '#3B2A18', '#6B5236', '#8A7050'); // kitchen table
  bx(1.0, 2.6, 1.2, 4.2, 2.6, '#050505', '#2A2A28', '#3A3A36'); bx(4.2, 5.8, 1.2, 4.2, 2.6, '#050505', '#2A2A28', '#3A3A36'); // two sewing machines at the window
  bx(5.5, 10.5, 6.0, 9.5, 2.5, '#3B2A18', '#6B5236', '#8A7050'); // the cutting table, cloth heaped on it
  bx(22.0, 24.2, 21.0, 23.2, 2.8, '#050505', '#2A2A28', '#1A1A18'); bx(22.0, 24.2, 61.8, 64.0, 2.8, '#050505', '#2A2A28', '#1A1A18'); bx(0.8, 3.0, 61.8, 64.0, 2.8, '#050505', '#2A2A28', '#1A1A18');
  bx(EM_PLAN.sink[0] + 0.6, EM_PLAN.sink[0] + 1.8, EM_PLAN.sink[1], EM_PLAN.sink[1] + 1.6, 2.8, '#2B4744', '#A3BAB2', '#DFE0D6'); // the sink
  bx(5.5, 7.5, 33.6, 35.2, 1.4, '#3E4F4C', '#A3BAB2', '#C8C2B2'); bx(17.5, 19.5, 33.6, 35.2, 1.4, '#3E4F4C', '#A3BAB2', '#C8C2B2'); // water closets
  const wh = 3.4;
  for (const [u0, v0, u1, v1, th] of EM_PLAN.W) {
    if (th < 0.05) continue;
    const t2 = th / 2, xa = Math.min(u0, u1) - (u0 === u1 ? t2 : 0), xb = Math.max(u0, u1) + (u0 === u1 ? t2 : 0), ya = Math.min(v0, v1) - (v0 === v1 ? t2 : 0), yb = Math.max(v0, v1) + (v0 === v1 ? t2 : 0);
    boxes.push({c: P((xa + xb) / 2, (ya + yb) / 2, wh / 2), d: () => emBoxSimple(cam, lot.x0 + xa, lot.x0 + xb, lot.y0 + ya, lot.y0 + yb, z, z + wh, '#1A1714', '#3A342C', '#0D0C09')});
  }
  for (const [u0, v, u1] of EM_PLAN.win) boxes.push({c: P((u0 + u1) / 2, v, wh), d: () => emBoxSimple(cam, lot.x0 + u0, lot.x0 + u1, lot.y0 + v - 0.35, lot.y0 + v + 0.35, z + wh, z + wh + 0.1, '#A3BAB2', '#DFE0D6', '#DFE0D6')});
  boxes.sort((a, b) => v3.len(v3.sub(b.c, cam.C)) - v3.len(v3.sub(a.c, cam.C)));
  s.push(boxes.map((b) => b.d()).join(''));
  // teal explains: the one room outlined; the kitchen; the sink ringed
  const ring = (u0, v0, u1, v1, k) => k > 0 ? emPoly(cam, [P(u0, v0, wh + 0.2), P(u1, v0, wh + 0.2), P(u1, v1, wh + 0.2), P(u0, v1, wh + 0.2)], 'none', `stroke="${EM.teal}" stroke-width="5" stroke-linejoin="round" opacity="${f1(k * 100) / 100}"`) : '';
  s.push(ring(0.3, 24.3, 10.8, 32.7, famOn), ring(0.3, 13.3, 10.8, 23.7, board));
  const sk = smooth(EM_CUE.sink, EM_CUE.sink + 0.5, n);
  if (sk > 0) { const c = emP(cam, P(EM_PLAN.sink[0] + 1.2, EM_PLAN.sink[1] + 0.8, 3)), sc = emScale(cam, P(12.5, 30, 3)), pr = 1 + 0.08 * Math.sin(n * 4);
    s.push(`<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(2.6 * sc * pr)}" fill="none" stroke="#111" stroke-width="9" opacity="${f1(sk)}"/><circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(2.6 * sc * pr)}" fill="none" stroke="${EM.teal}" stroke-width="5" opacity="${f1(sk)}"/>`); }
  return `<g opacity="${f1(reveal)}">${s.join('')}</g>`;
}

/* ---------- the scene ---------- */
function emGround(cam, n) {
  const s = [];
  const land = (x0, x1) => emPoly(cam, [[x0, -4000, 0], [x1, -4000, 0], [x1, 4000, 0], [x0, 4000, 0]], EM.street);
  s.push(land(-6000, EM_RIVER[0]), land(EM_RIVER[1], 8000));
  // the river: dark water, glints drifting downstream, a ferry crossing
  s.push(emPoly(cam, [[EM_RIVER[0], -4000, -2], [EM_RIVER[1], -4000, -2], [EM_RIVER[1], 4000, -2], [EM_RIVER[0], 4000, -2]], EM.water));
  const r = rng(404);
  for (let k = 0; k < 140; k++) { const x = EM_RIVER[0] + 20 + r() * (EM_RIVER[1] - EM_RIVER[0] - 40), y = ((r() * 3200 - n * 9) % 3200 + 3200) % 3200 - 1600, L = 12 + r() * 30;
    s.push(emLine(cam, [x, y, -1.5], [x + L * 0.6, y, -1.5], '#A3BAB2', 1.4, `stroke-opacity="${f1((0.18 + r() * 0.2) * 100) / 100}"`)); }
  for (const [x0, x1] of [[EM_RIVER[0] - 4, EM_RIVER[0] + 2], [EM_RIVER[1] - 2, EM_RIVER[1] + 4]]) s.push(emPoly(cam, [[x0, -4000, 0], [x1, -4000, 0], [x1, 4000, 0], [x0, 4000, 0]], '#0A1312'));
  for (const [x, y, w] of [[EM_RIVER[0], -120, 90], [EM_RIVER[0], 220, 110], [EM_RIVER[1] - 100, 40, 100], [EM_RIVER[1] - 90, -300, 90]]) s.push(emPoly(cam, [[x, y, 0.5], [x + w, y, 0.5], [x + w, y + 22, 0.5], [x, y + 22, 0.5]], '#2A3B38')); // piers
  // ghost blocks beyond the models: flat footprints that fade into the haze
  for (const M of [{xs: [-1550, -1200, -850, -500, -150, 200], ys: [-780, -530, -280, 30, 280, 530, 780, 1030], m: EM_LES, x1: EM_RIVER[0]}, {xs: [1450, 1800, 2150, 2500, 2850], ys: [-780, -530, -280, 30, 280, 530], m: EM_BK, x0: EM_RIVER[1]}]) {
    for (const x of M.xs) for (const y of M.ys) {
      if (M.m.cols.some(([a]) => a === x) && M.m.rows.some(([b]) => b === y || b === y - 0)) continue;
      const w = 300, h = 200, xx0 = Math.max(x, M.x0 ?? -9e9), xx1 = Math.min(x + w, M.x1 ?? 9e9); if (xx1 <= xx0) continue;
      s.push(emPoly(cam, [[xx0, y, 0.2], [xx1, y, 0.2], [xx1, y + h, 0.2], [xx0, y + h, 0.2]], EM.ghost, `stroke="#0E1918" stroke-width="1" opacity="0.85"`));
    }
  }
  // the modelled blocks: sidewalk around, yards inside; vacated lots of lifted places
  for (const M of [EM_LES, EM_BK]) for (const [x0, x1] of M.cols) for (const [y0, y1] of M.rows) {
    s.push(emPoly(cam, [[x0 - 12, y0 - 12, 0.4], [x1 + 12, y0 - 12, 0.4], [x1 + 12, y1 + 12, 0.4], [x0 - 12, y1 + 12, 0.4]], EM.walk));
    s.push(emPoly(cam, [[x0, y0, 0.6], [x1, y0, 0.6], [x1, y1, 0.6], [x0, y1, 0.6]], EM.yard));
  }
  // the market: its slab of street leaves a dark trench when it lifts
  const ml = emMarketLift(n);
  if (ml > 0.5) s.push(emPoly(cam, [[EM_MARKET.x0, EM_MARKET.y0, 0.7], [EM_MARKET.x1, EM_MARKET.y0, 0.7], [EM_MARKET.x1, EM_MARKET.y1, 0.7], [EM_MARKET.x0, EM_MARKET.y1, 0.7]], '#0A1312'));
  return s.join('');
}
function emShadows(cam, n) { // soft shadows cast on the ground by whatever has lifted (the light is high in the south-west)
  const s = [];
  const sh = (x0, x1, y0, y1, L, z = 0.8) => { if (L < 1) return; const dx = L * 0.55, dy = L * 0.7, o = clamp01(L / 20) * 0.55;
    s.push(emPoly(cam, [[x0 + dx, y0 + dy, z], [x1 + dx, y0 + dy, z], [x1 + dx, y1 + dy, z], [x0 + dx, y1 + dy, z]], '#000', `opacity="${f1(o * 100) / 100}" filter="url(#emblur)"`)); };
  for (const k of Object.keys(EM_PLACES)) { const L = emPlaceLift(k, n); if (L > 0) { const l = emLot(k); sh(l.x0, l.x1, l.y0, l.y1, L);
    s.push(emPoly(cam, [[l.x0, l.y0, 0.7], [l.x1, l.y0, 0.7], [l.x1, l.y1, 0.7], [l.x0, l.y1, 0.7]], '#070D0C', `opacity="${f1(clamp01(L / 8) * 100) / 100}"`)); } }
  const ml = emMarketLift(n); if (ml > 0) sh(EM_MARKET.x0, EM_MARKET.x1, EM_MARKET.y0, EM_MARKET.y1, ml);
  return s.join('');
}
function renderEnclave(t) {
  const n = t + EM_T0, cam = emCamera(n), items = [];
  const dist = (p) => v3.len(v3.sub(p, cam.C));
  const H0 = (p) => (c) => emMix(c, EM.haze, emHazeK(cam, p));
  const openU = smooth(EM_CUE.tenements - 0.6, EM_CUE.tenements + 1.0, n); // the gold building's roof lifts off
  // buildings
  for (const l of EM_LOTS) {
    const p = l.place ? EM_PLACES[l.place] : null, lift = l.place ? emPlaceLift(l.place, n) : 0;
    const highlight = p && p.cue != null && emLiftU(n, p.cue) > 0.02;
    const pal = emPal(p && p.col, highlight), edge = highlight ? EM.cream : null;
    const cen = [(l.x0 + l.x1) / 2, (l.y0 + l.y1) / 2, emH(l.floors) / 2 + lift];
    const b = {x0: l.x0, x1: l.x1, y0: l.y0, y1: l.y1, z0: lift, h: emH(l.floors), floors: l.floors, front: l.front, pal, kind: p ? p.kind : null, seed: l.seed, shop: l.shop, edge};
    let draw;
    if (l.place === 'church') draw = () => emChurch(cam, l, lift, pal, edge, n);
    else if (l.place === 'gold' && openU > 0) {
      const zf = emH(5), up = openU ** 1.3;
      draw = () => emBuilding(cam, {...b, h: zf, noChimney: true}) + emPlanDraw(cam, n, l, zf);
      if (openU < 0.98) items.push({d: -1e9, draw: () => emBuilding(cam, {...b, z0: zf + 30 * up, h: b.h - zf, floors: 1, y0: b.y0 + 150 * up, y1: b.y1 + 150 * up, op: 1 - smooth(0.3, 1, openU)})});
    } else if (l.place === 'bank') draw = () => emBuilding(cam, b) + emBank(cam, b, H0(cen));
    else draw = () => emBuilding(cam, b);
    items.push({d: dist([cen[0], cen[1], 0]) - lift * 0.3, draw});
  }
  // the market slab and everything on it
  const ml = emMarketLift(n);
  const inMarket = (x, y) => x > EM_MARKET.x0 && x < EM_MARKET.x1 && y > EM_MARKET.y0 && y < EM_MARKET.y1;
  const mcen = [(EM_MARKET.x0 + EM_MARKET.x1) / 2, 0, 0];
  const life = (x, y, z, k, H) => k.cart ? emCart(cam, x, y, z, k.seed, H) : emPerson(cam, x, y, z, k.h, EM.ink, k.op ?? 1);
  const folkAt = (f) => { const x = f.stand ? f.x + 0.6 * Math.sin(n * 0.8 + f.ph * 9) : -495 + ((f.x + 495 + f.v * n) % 990 + 990) % 990; return [x, f.y]; };
  const onSlab = [];
  for (const c of EM_LIFE.carts) { if (!c.bk && inMarket(c.x, c.y)) onSlab.push({x: c.x, y: c.y, k: {cart: true, seed: c.seed}}); else items.push({d: dist([c.x, c.y, 0]), draw: () => emCart(cam, c.x, c.y, 0, c.seed, H0([c.x, c.y, 0]))}); }
  for (const f of EM_LIFE.folk) { const [x, y] = folkAt(f); if (inMarket(x, y) && f.stand) onSlab.push({x, y, k: {h: f.h}}); else if (!inMarket(x, y)) items.push({d: dist([x, y, 0]), draw: () => emPerson(cam, x, y, 0, f.h, EM.ink)}); }
  for (const w of EM_LIFE.walkers) {
    const len = w.L.b - w.L.a, s0 = ((w.s * len + w.v * n) % len + len) % len, op = smooth(0, 25, s0) * smooth(0, 25, len - s0), a = w.L.a + s0;
    const [x, y] = w.L.ax === 'x' ? [a, w.L.c] : [w.L.c, a];
    if (op > 0.02) items.push({d: dist([x, y, 0]), draw: () => emPerson(cam, x, y, 0, w.h, EM.ink, op)});
  }
  items.push({d: dist(mcen) - ml * 0.3, draw: () => {
    const z = ml, hz = H0([mcen[0], 0, z]), s = [];
    if (ml > 0.3) s.push(emBoxSimple(cam, EM_MARKET.x0, EM_MARKET.x1, EM_MARKET.y0, EM_MARKET.y1, z - 3, z, hz('#0E1A19'), hz('#3E5A55'), hz(EM.street), `stroke="${EM.cream}" stroke-opacity="0.6" stroke-width="1.4"`));
    onSlab.map((o) => ({...o, dd: dist([o.x, o.y, z])})).sort((a, b) => b.dd - a.dd).forEach((o) => s.push(life(o.x, o.y, z, o.k, hz)));
    return s.join('');
  }});
  items.push({d: dist([1000, 900, 0]), draw: () => { // a ferry crossing the river
    const u = ((n * 14) % 700) / 700, x = EM_RIVER[0] + 40 + u * (EM_RIVER[1] - EM_RIVER[0] - 140), y = 560;
    return emPoly(cam, [[x - 60, y + 20, -1], [x - 120, y + 26, -1], [x - 120, y + 14, -1]], '#A3BAB2', 'opacity="0.25"') +
      emBoxSimple(cam, x - 30, x + 30, y + 8, y + 32, 0, 8, '#0B1312', '#22383A', '#1A2A29') + emBoxSimple(cam, x - 14, x + 14, y + 12, y + 28, 8, 18, '#0B1312', '#33504C', '#2B4744') +
      emBoxSimple(cam, x - 2, x + 2, y + 18, y + 22, 18, 32, '#050505', '#1A1A18', '#111');
  }});
  items.sort((a, b) => b.d - a.d);
  const world = [`<rect width="1920" height="1080" fill="${EM.bg}"/>`, emGround(cam, n), emShadows(cam, n), items.map((it) => it.draw()).join('')];
  // haze over the far ground (the top of the frame), cream light from the left
  const hazeOn = 1 - smooth(EM_CUE.cost + 1, EM_CUE.tenements, n);
  world.push(`<rect width="1920" height="1080" fill="url(#emhaze)" opacity="${f1(hazeOn * 100) / 100}"/>`);
  // the network: teal arcs from the gold building to each place as it lifts (and from coral in Brooklyn)
  const net = [], netOut = 1 - smooth(EM_CUE.cost, EM_CUE.cost + 1.2, n);
  const arc = (a, b, u, w = 5) => { if (u <= 0) return; const L = Math.hypot(b[0] - a[0], b[1] - a[1]), P3 = [];
    for (let k = 0; k <= 40; k++) { const s2 = k / 40; P3.push([a[0] + (b[0] - a[0]) * s2, a[1] + (b[1] - a[1]) * s2, a[2] + (b[2] - a[2]) * s2 + Math.sin(Math.PI * s2) * (L * 0.16 + 24)]); }
    const S = P3.map((p) => emP(cam, p)).filter(Boolean); if (S.length < 2) return;
    net.push(drawOn(S, u * 1, w));
    if (u > 0.98) { const e = S[S.length - 1]; net.push(`<circle cx="${f1(e[0])}" cy="${f1(e[1])}" r="7" fill="${EM.teal}" stroke="#111" stroke-width="2.5"/>`); } };
  const hub = (k) => { const l = emLot(k); return [(l.x0 + l.x1) / 2, (l.y0 + l.y1) / 2, emH(l.floors) + 2]; };
  const ends = (k) => { const tp = emTop(k); return [tp[0], tp[1], tp[2] + emPlaceLift(k, n) + 2]; };
  for (const k of ['butcher', 'synagogue', 'workshop', 'hall', 'saloon', 'bank', 'church']) {
    const p = EM_PLACES[k], u = smooth(p.cue + 0.5, p.cue + 1.5, n) * netOut; if (u > 0) arc(hub(p.m === 'L' ? 'gold' : 'kelly'), ends(k), u);
  }
  { const u = smooth(EM_CUE.point + 0.5, EM_CUE.point + 1.5, n) * netOut; if (u > 0) arc(hub('gold'), [mcen[0] + 40, 0, ml + 8], u); }
  if (net.length) world.push(`<g opacity="${f1(netOut * 100) / 100}">${net.join('')}</g>`);
  // screen-space labels
  const scr = [];
  const lab = [];
  const anchor = (p) => emP(cam, p);
  const on = (a, b, fade = 0.35) => smooth(a, a + fade, n) * (1 - smooth(b - fade, b, n));
  const lesOn = on(EM_CUE.point - 1.0, EM_CUE.irish + 0.4);
  // [lines, anchor 3D, preferred offset (dx, dy) of the tag box centre from the anchor, opacity]
  if (lesOn > 0) {
    lab.push([['THE RABINOWITZES'], [hub('gold')[0], hub('gold')[1], hub('gold')[2] + 6], [150, -120], lesOn]);
    lab.push([['PUSHCART MARKET'], [mcen[0], -10, ml + 4], [-150, -100], on(EM_CUE.point + 0.2, EM_CUE.irish + 0.4)]);
    lab.push([EM_PLACES.workshop.tag, ends('workshop'), [120, -90], on(EM_PLACES.workshop.tagAt, EM_CUE.irish + 0.4)]);
    lab.push([EM_PLACES.butcher.tag, ends('butcher'), [200, 110], on(EM_CUE.kosher + 0.2, EM_CUE.irish + 0.4)]);
    lab.push([EM_PLACES.synagogue.tag, ends('synagogue'), [-40, 150], on(EM_PLACES.synagogue.tagAt, EM_CUE.irish + 0.4)]);
    const sub = [[EM_CUE.paid, 'A SICK FUND'], [EM_CUE.doctor, 'A DOCTOR'], [EM_CUE.grave, 'A GRAVE']].filter(([c]) => n > c).map(([, s2]) => s2);
    lab.push([sub.length ? ['LANDSMANSHAFT', sub.join(' · ')] : ['LANDSMANSHAFT'], ends('hall'), [-60, -120], on(EM_CUE.landsman + 0.2, EM_CUE.irish + 0.4)]);
  }
  const bkOn = on(EM_CUE.earlier - 0.6, EM_CUE.maKelly + 0.2);
  if (bkOn > 0) {
    lab.push([['THE KELLYS'], [hub('kelly')[0], hub('kelly')[1], hub('kelly')[2] + 6], [-170, -110], bkOn]);
    lab.push([EM_PLACES.church.tag, ends('church'), [200, -90], on(EM_CUE.parish + 0.2, EM_CUE.maKelly + 0.2)]);
    lab.push([EM_PLACES.saloon.tag, ends('saloon'), [170, 90], on(EM_CUE.saloon + 0.2, EM_CUE.maKelly + 0.2)]);
    lab.push([EM_PLACES.bank.tag, ends('bank'), [-270, 60], on(EM_CUE.bank + 0.2, EM_CUE.maKelly + 0.2)]);
  }
  const sbs = on(EM_CUE.maKelly + 0.1, EM_CUE.cost + 0.5);
  if (sbs > 0) {
    lab.push([['LOWER EAST SIDE'], [0, 480, 90], [0, -70], sbs]);
    lab.push([['THE KELLYS\' BROOKLYN', 'AN ENCLAVE TOO'], [1775, 230, 90], [0, -90], sbs]);
  }
  const planOn = smooth(EM_CUE.tenements + 0.6, EM_CUE.tenements + 1.0, n), gl = emLot('gold'), zf = emH(5);
  if (planOn > 0) {
    const P = (u, v) => [gl.x0 + u, gl.y0 + v, zf + 3.4];
    lab.push([['A TENEMENT FLOOR: FOUR FLATS'], P(0, 60), [0, -110], smooth(EM_CUE.tenements + 0.6, EM_CUE.tenements + 1.0, n) * (1 - smooth(EM_CUE.four - 0.4, EM_CUE.four, n))]);
    lab.push([['ONE SINK IN THE HALL', 'FOR THE WHOLE FLOOR'], P(EM_PLAN.sink[0] + 1.2, EM_PLAN.sink[1] + 1), [120, 330], smooth(EM_CUE.sink + 0.2, EM_CUE.sink + 0.6, n)]);
    lab.push([['FOUR IN ONE ROOM'], P(0.3, 28.5), [170, -200], smooth(EM_CUE.four, EM_CUE.four + 0.4, n)]);
    lab.push([['A BOARDER IN THE KITCHEN'], P(0.3, 18), [-260, -200], smooth(EM_CUE.boarder, EM_CUE.boarder + 0.4, n)]);
  }
  // fixed screen text (place tags, the headline, the vocab card): drawn where they are; the moving tags keep clear of them
  const fixed = [], fx = (x, y, txt, op) => { if (op <= 0.01) return; fixed.push({x: x - 10, y: y - 31, w: txt.length * 19.4 + 20, h: 42}); scr.push(tag(x, y, txt, op)); };
  if (lesOn > 0) fx(130, 1000, 'HESTER STREET · LOWER EAST SIDE · 1884', on(EM_CUE.point - 1.0, EM_CUE.irish));
  if (bkOn > 0) fx(130, 1000, 'THE KELLYS\' STREET · BROOKLYN · 1884', bkOn);
  fx(960 - 56 * 19.4 / 2, 120, 'IRISH FAMILIES BUILT THE SAME THING A GENERATION EARLIER', on(EM_CUE.irish + 0.6, EM_CUE.cost + 0.4));
  if (planOn > 0) fx(130, 1000, 'THE RABINOWITZES\' FLOOR · SEEN FROM ABOVE', planOn);
  const cd = on(EM_CUE.enclave, EM_CUE.other + 0.9, 0.5), slide = 40 * (1 - smooth(EM_CUE.enclave, EM_CUE.enclave + 0.5, n));
  if (cd > 0) { fixed.push({x: 990, y: 580, w: 820, h: 400}); scr.push(`<g transform="translate(0,${f1(slide)})">${card(1000, 590, 'Enclave', 'A neighborhood where people from|the same place live close together,|keep their language, and look|after each other.', null, cd)}</g>`); }
  scr.unshift(emLabels(lab.map(([lines, a3, off, op]) => ({lines, a: anchor(a3), off, op})).filter((L) => L.a && L.op > 0.01), fixed));
  const defs = e3Defs(t, `<filter id="emblur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>` +
    grad('emhaze', [['0', '#A3BAB2', 0.34], ['0.38', '#7C918B', 0.12], ['0.7', '#4E726C', 0]]) + texDef('emtex', 0, 0, 1920, 1080, {soft: 0.004, fine: 0.11, k: 0.16, seed: 21}));
  return frame(defs, '', `<g filter="url(#emtex)">${world.join('')}</g>`, scr.join(''), t);
}
// tags with leader lines: each tag box sits at its preferred offset from its anchor, is pushed apart from the others, and is kept
// inside the title-safe area
function emLabels(L, fixed = []) {
  const boxes = L.map((l) => { const w = Math.max(...l.lines.map((s) => s.length)) * 19.4 + 20, h = l.lines.length * 46 - 4;
    let x = l.a[0] + l.off[0] - w / 2, y = l.a[1] + l.off[1] - h / 2;
    x = Math.max(SAFE.x0 + 4, Math.min(SAFE.x1 - 4 - w, x)); y = Math.max(SAFE.y0 + 4, Math.min(SAFE.y1 - 4 - h, y));
    return {...l, x, y, w, h}; });
  const all = boxes.concat(fixed.map((f) => ({...f, fixed: true})));
  for (let it = 0; it < 40; it++) { let moved = false;
    for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) { const A = all[i], B = all[j]; if (A.fixed && B.fixed) continue;
      const ox = Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x) + 12, oy = Math.min(A.y + A.h, B.y + B.h) - Math.max(A.y, B.y) + 12;
      if (ox > 0 && oy > 0) { moved = true; const dir = (A.y + A.h / 2) <= (B.y + B.h / 2) ? -1 : 1, ka = A.fixed ? 0 : B.fixed ? 1 : 0.5;
        A.y += dir * oy * ka; B.y -= dir * oy * (1 - ka);
        for (const C of [A, B]) if (!C.fixed) C.y = Math.max(SAFE.y0 + 4, Math.min(SAFE.y1 - 4 - C.h, C.y)); } }
    if (!moved) break; }
  return boxes.map((b) => {
    const op = f1(b.op * 100) / 100, ex = Math.max(b.x, Math.min(b.x + b.w, b.a[0])), ey = Math.max(b.y, Math.min(b.y + b.h, b.a[1]));
    const lead = Math.hypot(ex - b.a[0], ey - b.a[1]) > 14 ? `<line x1="${f1(ex)}" y1="${f1(ey)}" x2="${f1(b.a[0])}" y2="${f1(b.a[1])}" stroke="#111" stroke-width="5" opacity="${op}"/><line x1="${f1(ex)}" y1="${f1(ey)}" x2="${f1(b.a[0])}" y2="${f1(b.a[1])}" stroke="${EM.cream}" stroke-width="2" opacity="${op}"/><circle cx="${f1(b.a[0])}" cy="${f1(b.a[1])}" r="4.5" fill="${EM.cream}" stroke="#111" stroke-width="2" opacity="${op}"/>` : '';
    return lead + `<g opacity="${op}"><rect x="${f1(b.x)}" y="${f1(b.y)}" width="${f1(b.w)}" height="${f1(b.h)}" fill="rgba(13,12,9,0.86)"/>` +
      b.lines.map((s, i) => `<text x="${f1(b.x + 10)}" y="${f1(b.y + 32 + i * 46)}" font-family="Mono" font-size="28" letter-spacing="2" fill="${EM.cream}">${s}</text>`).join('') + '</g>';
  }).join('');
}

if (typeof window !== 'undefined') Object.assign(window, {renderEnclave});
Object.assign(CLIPS, {ep3_enclave: {sec: 57, render: (t) => renderEnclave(t)}});
