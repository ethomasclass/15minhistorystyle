// Episode 2 sets: the Vanderbilt ball, March 26, 1883, at 660 Fifth Avenue (northwest corner of 52nd Street), and the
// Kellys' sister below stairs. Built with rig.js, scene.js, street.js and explainers.js (load them first).
//
//   fifth_night   s1  Fifth Avenue at night: Richard Morris Hunt's limestone chateau (steep slate roof, corner turret, Gothic-French
//                     carving), windows blazing; carriages in a line, coachmen in top hats; guests in costume step down under the
//                     canopy; the police hold a crowd back on the sidewalk. Gas lamps, and one electric arc lamp. A slow side-scroll.
//   ball_cutaway  s2/3 The house cut open like the tenement (cutaway.js): servants' rooms in the attic, the third-floor gymnasium where
//                     the quadrilles gathered, supper in the second-floor rooms, the great hall and grand staircase (the hobby-horse
//                     quadrille, Alice Vanderbilt as the Electric Light, Alva as a Venetian princess), and the basement from Hunt's
//                     plan: kitchen, servants' hall, wine cellar, service stair. The camera pushes from the whole house down into
//                     the kitchen, where the sister (coral) carries a tray.
//   fifth_dawn    s4  Dawn on Fifth Avenue: guests leaving, the lamplighter putting the lamps out, the windows going dark, and the sister
//                     coming up the area steps from the basement door.
//   ballpark      s5  (if time) an 1880s ballpark: wooden grandstand, a 25-cent Sunday crowd.
//
// Rules: real people (Alva, Alice, the guests) are solid silhouettes with no face detail (det 0), costume outline only; coral only
// for the Kellys (the sister); teal explains; orange is handwriting. Sources: Hunt's drawings and the 1883-1903 photographs in
// ep2/public/img/ref/; The Sun, March 27, 1883 ("MARVELS OF FANCY DRESS") for the arrival, the quadrilles and the kitchen.

const MS = {
  ink: '#0D0C09', stone: '#33504C', stoneD: '#24403D', slate: '#162826', lit: '#F4EFE6', warm: '#FFF3D6', glow: '#F4EFE6',
  night: [['0', '#0B1414'], ['0.6', '#162827'], ['1', '#2B4744']],
  dawn: [['0', '#2B4744'], ['0.55', '#5F857F'], ['0.85', '#A3BAB2'], ['1', '#F4EFE6']],
  rim: {c: '#DFE0D6', a: 0.6, dx: -0.01, dy: -0.004},
};
const G5 = 800;   // the building line (foot of the house) on Fifth Avenue
const CURB = 850; // the curb; carriages stand at ROAD
const ROAD = 910;
const HX = 1400;  // the chateau's south corner (52nd Street); its Fifth Avenue front runs to HX + 1000
const DOOR = HX + 660; // the main entrance

/* ---------- small helpers ---------- */
const hand = (o, a = o.an.fArm) => { // world position of a figure's front hand
  const r = (v) => v * Math.PI / 180, e = [0.02 + Math.sin(r(a[0])) * 0.19, 0.81 + Math.cos(r(a[0])) * 0.19];
  return [o.x + o.d * (e[0] + Math.sin(r(a[1])) * 0.17) * o.h, o.y - (e[1] + Math.cos(r(a[1])) * 0.17) * o.h];
};
const glowC = (x, y, r, op, id = 'msglow') => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="url(#${id})" opacity="${f1(op * 100) / 100}"/>`;

// costume pieces drawn over a figure (outline only; these are real people or anonymous guests)
const COSTUME = {
  // Alva: a Venetian princess (Mora's photograph): a halo-like jewelled headdress, a long train, a dove on her hand
  alva(o, c) {
    const X = (u) => o.x + o.d * u * o.h, Y = (v) => o.y - v * o.h, s = [];
    s.push(`<ellipse cx="${f1(X(-0.01))}" cy="${f1(Y(0.98))}" rx="${f1(0.085 * o.h)}" ry="${f1(0.09 * o.h)}" fill="none" stroke="${c}" stroke-width="${f1(0.014 * o.h)}"/>`);
    for (let i = -3; i <= 3; i++) { const a = i * 0.32; s.push(line([[X(0), Y(1.0)], [X(Math.sin(a) * 0.13), Y(1.0 + Math.cos(a) * 0.12)]], c, 0.006 * o.h) + `<circle cx="${f1(X(Math.sin(a) * 0.13))}" cy="${f1(Y(1.0 + Math.cos(a) * 0.12))}" r="${f1(0.012 * o.h)}" fill="${c}"/>`); }
    s.push(`<path d="M${f1(X(-0.05))},${f1(Y(0.55))} Q${f1(X(-0.3))},${f1(Y(0.2))} ${f1(X(-0.48))},${f1(Y(0))} L${f1(X(0.05))},${f1(Y(0))} Z" fill="${c}"/>`);
    return s.join('');
  },
  // Alice: the Electric Light (white satin, diamonds, a torch lit by batteries hidden in the dress)
  alice(o, t) {
    const [hx, hy] = hand(o), s = [], fl = 0.85 + 0.15 * Math.sin(t * 23) * Math.sin(t * 7.3);
    s.push(glowC(hx, hy - 0.05 * o.h, 0.9 * o.h * fl, 0.9, 'msbulb'));
    s.push(line([[hx, hy + 0.02 * o.h], [hx, hy - 0.06 * o.h]], '#DFE0D6', 0.016 * o.h));
    s.push(`<circle cx="${f1(hx)}" cy="${f1(hy - 0.08 * o.h)}" r="${f1(0.03 * o.h * fl)}" fill="#FFFFFF"/>`);
    for (let i = 0; i < 8; i++) { const a = i * TAU / 8 + t * 0.6; s.push(line([[hx + Math.cos(a) * 0.04 * o.h, hy - 0.08 * o.h + Math.sin(a) * 0.04 * o.h], [hx + Math.cos(a) * 0.075 * o.h, hy - 0.08 * o.h + Math.sin(a) * 0.075 * o.h]], '#FFFFFF', 0.005 * o.h, 'opacity="0.8"')); }
    const X = (u) => o.x + o.d * u * o.h, Y = (v) => o.y - v * o.h, r = rng(42);
    for (let i = -2; i <= 2; i++) s.push(poly([[X(i * 0.02 - 0.008), Y(1.0)], [X(i * 0.02), Y(1.05 + (2 - Math.abs(i)) * 0.012)], [X(i * 0.02 + 0.008), Y(1.0)]], '#FFFFFF'));
    for (let i = 0; i < 18; i++) { const u = r(), v = r(); if ((t * 3 + r()) % 1 < 0.5) s.push(`<circle cx="${f1(X(-0.12 + u * 0.24 * (1 - v * 0.5)))}" cy="${f1(Y(0.08 + v * 0.75))}" r="${f1(0.006 * o.h)}" fill="#FFFFFF"/>`); }
    return s.join('');
  },
  // a hobby horse "attached to the waist" (The Sun), a skirt of cloth hiding the dancer's legs to the knee
  hobby(o, c, t) {
    const X = (u) => o.x + o.d * u * o.h, Y = (v) => o.y - v * o.h, nod = 0.02 * Math.sin(t * 6 + o.x);
    return `<ellipse cx="${f1(X(0.02))}" cy="${f1(Y(0.5))}" rx="${f1(0.24 * o.h)}" ry="${f1(0.075 * o.h)}" fill="${c}"/>` +
      poly([[X(-0.2), Y(0.5)], [X(0.24), Y(0.5)], [X(0.22), Y(0.26)], [X(-0.2), Y(0.26)]], c) +
      poly([[X(0.16), Y(0.52)], [X(0.3), Y(0.72 + nod)], [X(0.42), Y(0.66 + nod)], [X(0.4), Y(0.62 + nod)], [X(0.3), Y(0.64 + nod)], [X(0.24), Y(0.5)]], c) +
      poly([[X(0.29), Y(0.72 + nod)], [X(0.3), Y(0.78 + nod)], [X(0.32), Y(0.72 + nod)]], c) +
      `<path d="M${f1(X(-0.22))},${f1(Y(0.52))} q${f1(-o.d * 0.08 * o.h)},${f1(0.02 * o.h)} ${f1(-o.d * 0.1 * o.h)},${f1(0.14 * o.h)}" stroke="${c}" stroke-width="${f1(0.02 * o.h)}" fill="none"/>`;
  },
  beret(o, c) { const X = (u) => o.x + o.d * u * o.h, Y = (v) => o.y - v * o.h;
    return `<ellipse cx="${f1(X(0.0))}" cy="${f1(Y(0.995))}" rx="${f1(0.085 * o.h)}" ry="${f1(0.022 * o.h)}" fill="${c}"/>` + `<path d="M${f1(X(-0.04))},${f1(Y(1.0))} q${f1(-o.d * 0.1 * o.h)},${f1(-0.08 * o.h)} ${f1(-o.d * 0.16 * o.h)},${f1(-0.02 * o.h)}" stroke="${c}" stroke-width="${f1(0.012 * o.h)}" fill="none"/>`; },
  cape(o, c) { const X = (u) => o.x + o.d * u * o.h, Y = (v) => o.y - v * o.h; return poly([[X(-0.06), Y(0.84)], [X(-0.2), Y(0.36)], [X(0.0), Y(0.4)], [X(0.06), Y(0.8)]], c); },
  ruff(o, c) { const X = (u) => o.x + o.d * u * o.h, Y = (v) => o.y - v * o.h; return `<ellipse cx="${f1(X(0.01))}" cy="${f1(Y(0.85))}" rx="${f1(0.07 * o.h)}" ry="${f1(0.025 * o.h)}" fill="${c}"/>`; },
  toque(o, c) { const X = (u) => o.x + o.d * u * o.h, Y = (v) => o.y - v * o.h; return `<rect x="${f1(X(0) - 0.055 * o.h)}" y="${f1(Y(1.12))}" width="${f1(0.11 * o.h)}" height="${f1(0.13 * o.h)}" rx="${f1(0.03 * o.h)}" fill="${c}"/>`; },
  wig(o, c) { const X = (u) => o.x + o.d * u * o.h, Y = (v) => o.y - v * o.h; return `<ellipse cx="${f1(X(-0.01))}" cy="${f1(Y(0.95))}" rx="${f1(0.07 * o.h)}" ry="${f1(0.06 * o.h)}" fill="${c}"/>`; },
};
// a guest: figure() with no face detail, plus a costume piece
function guest(o, t = 0) {
  const fo = {fill: MS.ink, det: 0, kind: 'man', coat: 'frock', hat: 'none', d: 1, an: {}, ...o};
  let s = figure(fo);
  for (const piece of (o.cos || [])) s += piece === 'alice' ? COSTUME.alice(fo, t) : COSTUME[piece](fo, piece === 'toque' || piece === 'wig' ? '#B9C4BE' : fo.fill, t);
  return s;
}

/* ---------- the street: carriages, lamps ---------- */
function brougham(x, gy, sz, c, dist, open = 0, lamp = 1) { // a closed carriage behind one horse; coachman in a top hat on the box
  const s = [], X = (u) => x - u * sz;
  s.push(horse(x, gy, sz, c, dist / 120, 1));
  s.push(line([[X(0.3), gy - 0.78 * sz], [X(0.95), gy - 0.62 * sz]], c, 0.04 * sz));
  const bx0 = X(2.3), bx1 = X(1.05), top = gy - 1.25 * sz, bot = gy - 0.42 * sz;
  s.push(`<path d="M${f1(bx0)},${f1(bot)} L${f1(bx0)},${f1(top + 0.08 * sz)} Q${f1(bx0)},${f1(top)} ${f1(bx0 + 0.1 * sz)},${f1(top)} L${f1(X(1.45))},${f1(top)} L${f1(X(1.45))},${f1(gy - 0.8 * sz)} Q${f1(bx1)},${f1(gy - 0.78 * sz)} ${f1(bx1)},${f1(bot - 0.1 * sz)} L${f1(X(1.2))},${f1(bot)} Z" fill="${c}"/>`);
  s.push(`<rect x="${f1(X(2.05))}" y="${f1(top + 0.12 * sz)}" width="${f1(0.36 * sz)}" height="${f1(0.3 * sz)}" fill="${MS.warm}" opacity="0.35"/>`);
  if (open > 0) s.push(`<rect x="${f1(X(2.05))}" y="${f1(top + 0.1 * sz)}" width="${f1(0.4 * sz * open)}" height="${f1(0.72 * sz)}" fill="${MS.warm}" opacity="0.5"/><rect x="${f1(X(2.05) - 0.38 * sz * open)}" y="${f1(top + 0.1 * sz)}" width="${f1(0.36 * sz * open)}" height="${f1(0.72 * sz)}" fill="${c}"/>`);
  s.push(`<rect x="${f1(X(1.12))}" y="${f1(top + 0.18 * sz)}" width="${f1(0.06 * sz)}" height="${f1(0.12 * sz)}" fill="${MS.warm}" opacity="${f1(0.85 * lamp)}"/>` + glowC(X(1.09), top + 0.24 * sz, 0.4 * sz, 0.5 * lamp));
  s.push(figure({x: X(1.3), y: top + 0.12 * sz + 0.5 * 1.05 * sz, h: 1.05 * sz, d: 1, kind: 'man', hat: 'top', coat: 'frock', fill: c, an: {legs: [88, 84], shins: [6, 2], lean: -2, fArm: [100, 80]}}));
  for (const [u, rr] of [[1.35, 0.3], [2.05, 0.42]]) {
    const cx = X(u), R = rr * sz, cy = gy - R, ang = dist / R; let sp = '';
    for (let i = 0; i < 12; i++) { const a = ang + i * TAU / 12; sp += `M${f1(cx)},${f1(cy)}L${f1(cx + Math.cos(a) * R)},${f1(cy + Math.sin(a) * R)}`; }
    s.push(`<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(R)}" fill="none" stroke="${c}" stroke-width="${f1(0.05 * sz)}"/><path d="${sp}" stroke="${c}" stroke-width="${f1(0.018 * sz)}"/>`);
  }
  return s.join('');
}
function gasLamp(x, base, hgt, on, t, c = MS.ink) {
  const top = base - hgt, fl = 0.9 + 0.1 * Math.sin(t * 9 + x);
  return (on > 0.01 ? glowC(x, top + 14, 120, 0.75 * on * fl) : '') + `<rect x="${x - 4}" y="${top + 20}" width="8" height="${hgt - 20}" fill="${c}"/><rect x="${x - 9}" y="${base - 30}" width="18" height="30" fill="${c}"/>` +
    poly([[x - 14, top], [x + 14, top], [x + 10, top + 30], [x - 10, top + 30]], MS.warm, `opacity="${f1(0.15 + 0.7 * on)}"`) + poly([[x - 17, top + 2], [x, top - 12], [x + 17, top + 2]], c) + `<rect x="${x - 12}" y="${top + 28}" width="24" height="5" fill="${c}"/>`;
}
function arcLamp(x, base, on, t) { // an electric arc lamp on a tall pole: harder, whiter light than gas
  const top = base - 330, fl = 0.94 + 0.06 * Math.sin(t * 31);
  return (on > 0.01 ? glowC(x + 30, top + 40, 260, 0.7 * on * fl, 'msbulb') : '') + `<rect x="${x - 5}" y="${top}" width="10" height="330" fill="${MS.ink}"/><rect x="${x}" y="${top + 6}" width="40" height="5" fill="${MS.ink}"/>` +
    `<path d="M${x + 26},${top + 11} l0,10 a10,13 0 1,0 8,0 l0,-10 Z" fill="${on > 0.01 ? '#FFFFFF' : '#2B4744'}"/>`;
}

/* ---------- the chateau ---------- */
function windowSet(x, y, w, h, lit, t, seed, hood = true) { // a stone-mullioned cross window with a Gothic hood moulding
  const r = rng(seed), on = lit * (r() > 0.12 ? 1 : 0.3), fl = 0.92 + 0.08 * Math.sin(t * 5 + seed);
  let s = on > 0.02 ? glowC(x + w / 2, y + h / 2, w * 1.3, 0.35 * on * fl) : '';
  s += `<rect x="${x - 5}" y="${y - 5}" width="${w + 10}" height="${h + 10}" fill="${MS.stoneD}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${on > 0.02 ? MS.warm : '#0E1918'}" opacity="${f1(on > 0.02 ? 0.35 + 0.6 * on * fl : 1)}"/>`;
  s += `<rect x="${x + w / 2 - 3}" y="${y}" width="6" height="${h}" fill="${MS.stoneD}"/><rect x="${x}" y="${y + h * 0.36}" width="${w}" height="6" fill="${MS.stoneD}"/>`;
  if (on > 0.02 && r() > 0.5) s += `<rect x="${x + 4}" y="${y + h * 0.42}" width="${w * 0.42}" height="${h * 0.58}" fill="#2B4744" opacity="0.4"/>`; // a curtain
  if (hood) s += `<path d="M${x - 10},${y - 6} L${x + w / 2},${y - 30} L${x + w + 10},${y - 6}" stroke="${MS.stoneD}" stroke-width="6" fill="none"/><path d="M${x + w / 2},${y - 30} l0,-16" stroke="${MS.stoneD}" stroke-width="4"/>`;
  return s;
}
function slateRoof(pts0, seed) { // a steep slate roof: rows of scalloped slates, a little lighter row by row
  const ys = pts0.map((p) => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys), xs = pts0.map((p) => p[0]), x0 = Math.min(...xs), x1 = Math.max(...xs);
  const id = 'rf' + seed; let rows = '';
  for (let y = y0; y < y1; y += 14) rows += `<path d="M${x0},${y} H${x1}" stroke="#0B1716" stroke-width="1.5"/>`;
  return `<defs><clipPath id="${id}"><polygon points="${pts(pts0)}"/></clipPath></defs>${poly(pts0, MS.slate)}<g clip-path="url(#${id})"><rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="url(#msslate)"/>${rows}</g>`;
}
function chateau(t, lit, dawn = 0) {
  const s = [], x0 = HX, x1 = HX + 1000, eave = 290;
  // roof first (behind the gables): a steep hip roof to an iron-crested ridge, tall chimneys
  s.push(`<rect x="${x0 + 180}" y="-10" width="34" height="120" fill="${MS.stoneD}"/><rect x="${x0 + 700}" y="-30" width="34" height="140" fill="${MS.stoneD}"/>`);
  s.push(MAT.smoke(x0 + 197, -14, t, {col: '3E5F5A', k: 0.6, n: 5, seed: 3}) + MAT.smoke(x0 + 717, -34, t, {col: '3E5F5A', k: 0.6, n: 5, seed: 9}));
  s.push(slateRoof([[x0 + 40, eave], [x0 + 200, 40], [x0 + 800, 40], [x1 - 40, eave]], 1));
  let crest = ''; for (let x = x0 + 205; x < x0 + 800; x += 18) crest += `M${x},40 l0,-16 M${x - 4},30 l8,0 `;
  s.push(`<path d="${crest}" stroke="${MS.ink}" stroke-width="3"/><rect x="${x0 + 200}" y="36" width="600" height="6" fill="${MS.ink}"/>`);
  // the limestone walls
  s.push(MAT.stone(x0, eave, x1 - x0, G5 - eave, {base: MS.stone, seed: 660, bh: 22, vary: 0.18}));
  s.push(`<rect x="${x0}" y="${eave}" width="${x1 - x0}" height="${G5 - eave}" fill="url(#msstone)" />`);
  // the basement band, the water table, string courses with a carved frieze
  s.push(`<rect x="${x0}" y="${G5 - 60}" width="${x1 - x0}" height="60" fill="${MS.stoneD}"/>`);
  for (const y of [eave, 455, 610, G5 - 64]) { s.push(`<rect x="${x0 - 8}" y="${y - 6}" width="${x1 - x0 + 16}" height="14" fill="#41625D"/>`);
    let fr = ''; for (let x = x0; x < x1; x += 22) fr += `<circle cx="${x + 11}" cy="${y + 1}" r="4" fill="none" stroke="${MS.stoneD}" stroke-width="2"/>`; s.push(fr); }
  // windows: three storeys
  const bays = [70, 190, 310, 430, 820, 920];
  bays.forEach((bx, i) => { s.push(windowSet(x0 + bx, 640, 64, 100, lit, t, 10 + i), windowSet(x0 + bx, 485, 64, 104, lit, t, 20 + i), windowSet(x0 + bx, 325, 60, 96, lit, t, 30 + i)); });
  // basement windows (the servants' floor): small, barred, lit
  for (const bx of [80, 200, 320, 440, 830, 930]) s.push(`<rect x="${x0 + bx}" y="${G5 - 46}" width="44" height="30" fill="${MS.warm}" opacity="${f1(0.25 + 0.5 * Math.max(lit, 0.5))}"/>` + [0, 1, 2, 3].map((k) => `<rect x="${x0 + bx + 4 + k * 12}" y="${G5 - 46}" width="3" height="30" fill="${MS.ink}"/>`).join(''));
  // the oriel: a corbelled bay on the second floor
  const ox = x0 + 560;
  s.push(`<path d="M${ox - 20},${470} L${ox + 120},${470} L${ox + 100},${600} L${ox + 50},${640} L${ox},${600} Z" fill="${MS.stone}"/><path d="M${ox},600 L${ox + 50},640 L${ox + 100},600" stroke="${MS.stoneD}" stroke-width="5" fill="none"/>`);
  s.push(windowSet(ox, 484, 32, 96, lit, t, 51, false) + windowSet(ox + 68, 484, 32, 96, lit, t, 52, false));
  s.push(`<path d="M${ox - 20},470 L${ox + 50},420 L${ox + 120},470 Z" fill="${MS.slate}"/><rect x="${ox + 48}" y="402" width="4" height="22" fill="${MS.ink}"/>`);
  // the main entrance: a carved Gothic arch, a balcony above, lanterns either side, steps down to the sidewalk
  const d0 = DOOR - 60;
  s.push(`<rect x="${d0 - 34}" y="580" width="188" height="30" fill="#41625D"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map((k) => `<rect x="${d0 - 28 + k * 24}" y="560" width="8" height="22" fill="#41625D"/>`).join('') + `<rect x="${d0 - 34}" y="554" width="188" height="8" fill="#41625D"/>`);
  s.push(`<path d="M${d0 - 22},${G5 - 30} L${d0 - 22},675 Q${d0 - 22},612 ${d0 + 60},604 Q${d0 + 142},612 ${d0 + 142},675 L${d0 + 142},${G5 - 30} Z" fill="#41625D"/>`);
  s.push(`<path d="M${d0},${G5 - 30} L${d0},680 Q${d0},628 ${d0 + 60},622 Q${d0 + 120},628 ${d0 + 120},680 L${d0 + 120},${G5 - 30} Z" fill="${lit > 0.3 ? MS.warm : '#0E1918'}" opacity="${f1(lit > 0.3 ? 0.85 : 1)}"/>`);
  if (lit > 0.3) s.push(glowC(DOOR, 700, 200, 0.5 * lit));
  for (let k = 0; k < 5; k++) s.push(`<rect x="${d0 - 30 - k * 8}" y="${G5 - 30 + k * 6}" width="${180 + k * 16}" height="6" fill="#41625D"/>`);
  for (const lx of [d0 - 60, d0 + 180]) s.push(gasLamp(lx, G5, 150, lit > 0.2 ? 1 : 0, t, MS.stoneD));
  // the areaway: an iron railing along the front, with the gap and steps down to the basement door (s4)
  let rail = ''; for (let x = x0 - 20; x < x1 + 20; x += 9) if (Math.abs(x - (x0 + 250)) > 34 && Math.abs(x - DOOR) > 110) rail += `M${x},${G5} l0,-34 `;
  s.push(`<path d="${rail}" stroke="${MS.ink}" stroke-width="2.5"/><rect x="${x0 - 20}" y="${G5 - 36}" width="${x1 - x0 + 40}" height="4" fill="${MS.ink}" opacity="0.9"/>`);
  // the corner turret: corbelled out from the second floor, rising to a tall slate cone with a finial
  const tx = x0 + 10, tr = 62;
  s.push(`<path d="M${tx - tr},610 L${tx + tr},610 L${tx},700 Z" fill="${MS.stone}"/><rect x="${tx - tr}" y="200" width="${tr * 2}" height="410" fill="${MS.stone}"/><rect x="${tx - tr}" y="200" width="${tr * 2}" height="410" fill="url(#msround)"/>`);
  for (const y of [470, 330, 225]) s.push(windowSet(tx - 16, y, 32, y === 225 ? 50 : 90, lit, t, 70 + y, false));
  s.push(`<rect x="${tx - tr - 6}" y="192" width="${tr * 2 + 12}" height="12" fill="#41625D"/>` + slateRoof([[tx - tr - 4, 194], [tx, -180], [tx + tr + 4, 194]], 2) + `<path d="M${tx},-180 l0,-34 M${tx - 8},-200 l16,0" stroke="${MS.ink}" stroke-width="4"/>`);
  // dormers and the stone gable at the north end, with pinnacles and crockets
  for (const dx of [260, 430, 620]) {
    s.push(`<rect x="${x0 + dx}" y="180" width="90" height="${eave - 180 + 10}" fill="${MS.stone}"/><path d="M${x0 + dx - 10},184 L${x0 + dx + 45},110 L${x0 + dx + 100},184 Z" fill="${MS.stone}"/>`);
    s.push(`<path d="M${x0 + dx - 10},184 L${x0 + dx + 45},110 L${x0 + dx + 100},184" stroke="#41625D" stroke-width="6" fill="none"/><path d="M${x0 + dx + 45},110 l0,-28" stroke="${MS.stoneD}" stroke-width="5"/>`);
    for (const px of [x0 + dx - 6, x0 + dx + 96]) s.push(`<rect x="${px - 5}" y="150" width="10" height="40" fill="${MS.stone}"/><path d="M${px - 6},150 L${px},118 L${px + 6},150 Z" fill="${MS.stone}"/>`);
    s.push(windowSet(x0 + dx + 22, 196, 46, 74, lit * 0.7, t, 80 + dx, false));
  }
  const gx = x0 + 790;
  s.push(`<path d="M${gx},${eave + 4} L${gx},230 L${gx + 105},80 L${gx + 210},230 L${gx + 210},${eave + 4} Z" fill="${MS.stone}"/><path d="M${gx - 8},236 L${gx + 105},74 L${gx + 218},236" stroke="#41625D" stroke-width="8" fill="none"/>`);
  for (let k = 1; k < 6; k++) { const u = k / 6; s.push(`<circle cx="${f1(gx + 105 * u)}" cy="${f1(230 - 150 * u - 10)}" r="5" fill="#41625D"/><circle cx="${f1(gx + 210 - 105 * u)}" cy="${f1(230 - 150 * u - 10)}" r="5" fill="#41625D"/>`); }
  s.push(`<path d="M${gx + 105},74 l0,-40 M${gx + 95},50 l20,0" stroke="${MS.stoneD}" stroke-width="5"/>` + windowSet(gx + 70, 150, 70, 110, lit, t, 99));
  if (dawn > 0) s.push(`<rect x="${x0 - 80}" y="-220" width="${x1 - x0 + 160}" height="${G5 + 220}" fill="#A3BAB2" opacity="${f1(0.12 * dawn)}" style="mix-blend-mode:screen"/>`);
  return s.join('');
}
// the neighbours: William H. Vanderbilt's brownstone "triple palace" across 52nd Street (flat-roofed, Italianate), brownstones north
function brownstones(x0, x1, top, lit, t, seed) {
  const s = [], r = rng(seed);
  s.push(MAT.stone(x0, top, x1 - x0, G5 - top, {base: '#1C3332', seed, bh: 24, vary: 0.14}) + `<rect x="${x0 - 10}" y="${top - 24}" width="${x1 - x0 + 20}" height="24" fill="#24403D"/>`);
  for (let y = top + 40; y < G5 - 110; y += 120) for (let x = x0 + 40; x < x1 - 60; x += 110) { const on = r() > 0.45 ? lit : 0;
    s.push(`<rect x="${x}" y="${y}" width="50" height="76" fill="${on ? MS.warm : '#0E1918'}" opacity="${on ? f1(0.3 + 0.4 * on) : 1}"/><rect x="${x - 6}" y="${y - 12}" width="62" height="8" fill="#24403D"/>`); }
  return s.join('');
}
function stThomas(x, base, c) { // St. Thomas Church at 53rd Street (1870): a square Gothic tower with pinnacles, a block north
  return `<rect x="${x}" y="${base - 560}" width="170" height="560" fill="${c}"/><rect x="${x - 10}" y="${base - 590}" width="190" height="34" fill="${c}"/>` +
    [0, 1, 2, 3].map((k) => `<path d="M${x - 8 + k * 58},${base - 590} l12,-70 l12,70 Z" fill="${c}"/>`).join('') + `<path d="M${x + 58},${base - 590} l27,-120 l27,120 Z" fill="${c}"/>` +
    `<rect x="${x + 60}" y="${base - 470}" width="20" height="90" rx="10" fill="#0B1414"/><rect x="${x + 92}" y="${base - 470}" width="20" height="90" rx="10" fill="#0B1414"/>` +
    `<rect x="${x + 170}" y="${base - 300}" width="480" height="300" fill="${c}"/><path d="M${x + 170},${base - 300} L${x + 410},${base - 420} L${x + 650},${base - 300} Z" fill="${c}"/>`;
}

/* ---------- the arrival: a queue of carriages, guests stepping down ---------- */
const ARR = {P: 4.6, move: 1.7, S: 470, sz: 62};
function queue(t) { const k = Math.floor(t / ARR.P), u = t - k * ARR.P; return {k, u, n: k + ease(clamp01(u / ARR.move))}; }
const GUESTS = [ // costume outlines, after the Sun's descriptions and Mora's photographs
  [{kind: 'woman', hat: 'none', cos: ['ruff']}, {kind: 'man', cos: ['cape', 'beret'], wear: ['knickers'], coat: 'jacket'}],
  [{kind: 'woman', hat: 'none', cos: ['wig']}, {kind: 'man', cos: ['wig'], wear: ['knickers'], coat: 'frock'}],
  [{kind: 'woman', hat: 'lady'}, {kind: 'man', cos: ['beret', 'ruff'], coat: 'jacket', wear: ['knickers']}],
  [{kind: 'man', cos: ['cape'], hat: 'top'}, {kind: 'woman', hat: 'none', cos: ['ruff']}],
];
function arrivals(t, z) {
  const s = [], q = queue(t), sz = ARR.sz, stop = DOOR + 2.0 * sz;
  for (let i = q.k - 2; i < q.k + 6; i++) {
    const x = stop + (q.n - i) * ARR.S + (q.n - i > 0.5 ? (q.n - i - 0.5) * 300 : 0);
    const open = i === q.k ? smooth(1.9, 2.3, q.u) * (1 - smooth(4.0, 4.4, q.u)) : 0;
    s.push(brougham(x, ROAD, sz, MS.ink, x, open));
    if (i === q.k) { // a footman at the door; two guests step down and walk up under the canopy
      s.push(guest({x: stop - 2.0 * sz - 40, y: ROAD + 2, h: 64, d: 1, coat: 'frock', wear: ['knickers'], cos: ['wig'], an: {fArm: [110, 90]}}));
      GUESTS[((i % 4) + 4) % 4].forEach((g, j) => {
        const u = clamp01((q.u - 2.2 - j * 0.6) / 1.9); if (u <= 0 || u >= 1) return;
        const gx = stop - 2.05 * sz + 20 * u + j * 6, gy = ROAD + 2 - (ROAD - G5 - 8) * smooth(0.15, 1, u), hh = 66 - 8 * u;
        s.push(`<g opacity="${f1(1 - smooth(0.85, 1, u))}">` + guest({...g, x: gx, y: gy, h: hh, d: 1, an: walkAn(walkPhase(u * 160, hh))}, t) + '</g>');
      });
    }
  }
  return s.join('');
}
function canopy(dawn) { // an awning from the door to the curb, and a carpet
  const c = MS.ink, x0 = DOOR - 80, x1 = DOOR + 80;
  return `<rect x="${x0}" y="${G5 + 4}" width="160" height="${CURB - G5}" fill="#1F3735"/>` + (dawn > 0.5 ? '' :
    `<path d="M${x0 - 10},${G5 - 150} L${x1 + 10},${G5 - 150} L${x1 + 20},${CURB - 120} L${x0 - 20},${CURB - 120} Z" fill="${c}" opacity="0.9"/><rect x="${x0 - 18}" y="${CURB - 124}" width="6" height="124" fill="${c}"/><rect x="${x1 + 12}" y="${CURB - 124}" width="6" height="124" fill="${c}"/>`);
}
function onlookersFar(t) { // the crowd on the house's sidewalk, held back on either side of the canopy by police
  const s = [], r = rng(1883);
  for (let i = 0; i < 26; i++) {
    const side = i % 2 ? 1 : -1, x = DOOR + side * (120 + Math.floor(i / 2) * 26 + r() * 10), h = 52 + r() * 10, kind = r() > 0.6 ? 'woman' : 'man';
    const up = (t * 0.7 + r()) % 3 < 0.5 ? 1 : 0;
    s.push(figure({x, y: CURB - 6 - r() * 8, h, d: -side, kind, hat: kind === 'man' ? (r() > 0.5 ? 'bowler' : 'cap') : 'kerchief', coat: 'sack', fill: MS.ink, wear: kind === 'woman' ? ['plain', 'shawl'] : [], an: {...POSES.stand(t, r()), tilt: 6 + up * 10}}));
  }
  for (const side of [-1, 1]) s.push(figure({x: DOOR + side * 100, y: CURB - 2, h: 66, d: side, kind: 'man', hat: 'top', coat: 'frock', fill: MS.ink, an: {fArm: [90, 92], bArm: [180, 190]}})); // police, arms out
  return s.join('');
}
function onlookersNear(t, rimA) { // the crowd on the near sidewalk, in the foreground
  const s = [], r = rng(52);
  for (let i = 0; i < 14; i++) {
    const x = -300 + i * 330 + r() * 120, h = 300 + r() * 50, kind = r() > 0.55 ? 'woman' : 'man', ph = r();
    const wave = kind === 'man' && r() > 0.6 && (t + ph * 6) % 6 < 1.4;
    s.push(figure({x, y: 1250, h, d: r() > 0.3 ? 1 : -1, kind, hat: kind === 'man' ? ['bowler', 'cap', 'top'][Math.floor(r() * 3)] : 'lady', coat: 'sack', fill: '#060807',
      rim: {...MS.rim, a: rimA}, an: {...POSES.stand(t, ph), tilt: 8, ...(wave ? {fArm: [20, 10]} : {})}}));
  }
  return s.join('');
}
function lamplighter(x, t) { return figure({x, y: CURB - 2, h: 62, d: 1, kind: 'man', hat: 'cap', coat: 'jacket', fill: MS.ink, an: {...walkAn(walkPhase(x, 62)), fArm: [30, 20]}}) + line([[x + 10, CURB - 62], [x + 40, CURB - 150]], MS.ink, 3); }

function msDefs(t) {
  return exDefs(t).replace('</defs>', grad('msnight', MS.night) + grad('msdawn', MS.dawn) +
    `<radialGradient id="msglow"><stop offset="0" stop-color="#FFF3D6" stop-opacity="0.5"/><stop offset="0.4" stop-color="#FFF3D6" stop-opacity="0.15"/><stop offset="1" stop-color="#FFF3D6" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="msbulb"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.7"/><stop offset="0.3" stop-color="#E6FFF9" stop-opacity="0.22"/><stop offset="1" stop-color="#E6FFF9" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="msstone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.25"/><stop offset="0.6" stop-color="#FFF3D6" stop-opacity="0.04"/><stop offset="1" stop-color="#FFF3D6" stop-opacity="0.12"/></linearGradient>` +
    `<linearGradient id="msround" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.35"/><stop offset="0.4" stop-color="#DFE0D6" stop-opacity="0.1"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></linearGradient>` +
    `<pattern id="msslate" width="16" height="14" patternUnits="userSpaceOnUse"><path d="M0,14 Q4,6 8,14 Q12,6 16,14" fill="none" stroke="#21393A" stroke-width="1.2"/></pattern>` +
    `<radialGradient id="mswarm"><stop offset="0" stop-color="#FFF3D6" stop-opacity="0.32"/><stop offset="1" stop-color="#FFF3D6" stop-opacity="0"/></radialGradient></defs>`);
}

/* ---------- s1 / s4: Fifth Avenue ---------- */
function renderFifth({t, dawn = 0, cam}) {
  const c = cam2(cam), world = [], lit = 1 - smooth(0.2, 1, dawn) * 0.85;
  const lighterX = dawn > 0 ? 700 + t * 140 : -1e9; // the lamplighter's pole puts the lamps out as he passes
  const sky = `<rect width="1920" height="1080" fill="url(#msnight)"/>` + (dawn > 0 ? `<rect width="1920" height="1080" fill="url(#msdawn)" opacity="${f1(dawn)}"/>` : '');
  const stars = dawn < 1 ? (() => { const r = rng(9); let s2 = ''; for (let i = 0; i < 60; i++) s2 += `<circle cx="${f1(r() * 1920)}" cy="${f1(r() * 500)}" r="${f1(0.8 + r())}" fill="#DFE0D6" opacity="${f1((0.25 + 0.3 * r()) * (1 - dawn))}"/>`; return s2; })() : '';
  // far: the city's roofline and St. Thomas's tower a block north
  world.push(layerAt(c, 0.35, `<rect x="-2000" y="${G5 - 260}" width="8000" height="2000" fill="#1C3332"/>` + stThomas(3300, G5, '#1C3332') + (() => { const r = rng(3); let s2 = ''; for (let x = -1500; x < 5000; x += 160 + r() * 120) { const hh = 280 + r() * 260; s2 += `<rect x="${f1(x)}" y="${f1(G5 - hh)}" width="${f1(140 + r() * 100)}" height="${f1(hh)}" fill="#1C3332"/>`; } return s2; })()));
  // main: the triple palace, 52nd Street, the chateau, brownstones north
  const main = [];
  main.push(brownstones(-600, 1130, 250, lit * 0.8, t, 640));
  main.push(chateau(t, lit, dawn));
  main.push(brownstones(2460, 3300, 300, lit * 0.6, t, 680));
  main.push(`<rect x="-3000" y="${G5}" width="9000" height="${CURB - G5}" fill="#132423"/><rect x="-3000" y="${CURB}" width="9000" height="8" fill="#2B4744"/><rect x="-3000" y="${CURB + 8}" width="9000" height="800" fill="#0E1A19"/>`);
  main.push(MAT.ground(-3000, 6000, CURB + 8, {base: '#0E1A19', seed: 5, tufts: false}));
  main.push(canopy(dawn));
  // lamps along the curb: gas, and one electric arc lamp at the corner of 52nd Street
  for (const lx of [300, 900, 1650, 2500, 3100, 3700]) s0push(main, gasLamp(lx, CURB, 160, lighterX > lx ? 0 : 1, t));
  main.push(arcLamp(1250, CURB, dawn > 0.6 ? 0 : 1, t));
  if (dawn > 0) main.push(lamplighter(lighterX - 30, t));
  if (dawn < 0.5) main.push(onlookersFar(t), arrivals(t, c.z)); else main.push(departures(t));
  world.push(layerAt(c, 1, main.join('')));
  world.push(layerAt(c, 1.3, onlookersNear(t, 0.5 * (1 - dawn) + 0.2)));
  const scr = [tag(40, 1040, dawn ? 'FIFTH AVENUE · DAWN, MARCH 27, 1883' : '660 FIFTH AVENUE · MONDAY, MARCH 26, 1883', 1)];
  if (!dawn && t > 4.5) scr.push(penS(1220, 140, '1,200 guests in costume', 34, -3, EX.orange));
  if (dawn && t > 3) scr.push(penS(1180, 140, 'the last dance ended at sunrise', 32, -3, EX.orange));
  return frame(msDefs(t), sky + stars, world.join(''), scr.join(''), t);
}
function s0push(a, v) { a.push(v); }

/* ---------- s4: departures and the sister on the area steps ---------- */
function departures(t) {
  const s = [], sz = ARR.sz;
  // carriages pull away north; guests come down the steps in twos
  for (let i = 0; i < 4; i++) { const x = DOOR + 2 * sz - 900 + i * 520 + t * 60 + (i === 0 ? 0 : 0); s.push(brougham(x, ROAD, sz, MS.ink, x, 0, 0.3)); }
  const pairs = [[0.4, {kind: 'woman', hat: 'none', cos: ['ruff']}], [0.9, {kind: 'man', cos: ['cape', 'beret'], coat: 'jacket', wear: ['knickers']}], [3.6, {kind: 'woman', hat: 'none', cos: ['wig']}], [4.1, {kind: 'man', cos: ['wig'], wear: ['knickers']}]];
  for (const [t0, g] of pairs) { const u = clamp01((t - t0) / 3.4); if (u <= 0 || u >= 1) continue;
    const gx = DOOR - 10 + 140 * u, gy = G5 + 2 + (ROAD - G5) * smooth(0, 0.7, u), hh = 58 + 8 * u;
    s.push(guest({...g, x: gx, y: gy, h: hh, d: 1, an: {...walkAn(walkPhase(u * 140, hh)), lean: 4}}, t)); }
  // the sister: up the area steps with a pail of ashes, she stops at the top and watches them go
  const ax = HX + 250, up = smooth(0.8, 4.2, t), y = G5 + 60 - 60 * up, x = ax - 30 + 40 * up, hs = 75 * 0.88 * 0.85;
  const walking = t > 0.8 && t < 4.2;
  s.push(figure({...cast('sister', {x, y, h: 75 * 0.85, d: 1}), det: 0, rim: {...MS.rim, a: 0.4}, pail: true, an: walking ? walkAn(walkPhase(up * 80, hs), {carry: true}) : {...POSES.stand(t, 0.2), tilt: t > 5 ? 6 : 0}}));
  s.push(`<rect x="${ax - 40}" y="${G5}" width="80" height="70" fill="#0B1414"/>`.replace('fill', 'opacity="0" fill')); // (the areaway pit sits below the sidewalk)
  return s.join('');
}

/* ---------- s2/s3: the house cut open ---------- */
const CH = {x0: 300, x1: 1560, fl: {b: 1010, g: 880, s: 640, th: 450, at: 300}, MAN: 75};
const roomBg = (x, y, w, h, col = '#1C3332') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}"/>`;
function gasolier(x, y, t, r = 1) { const fl = 0.9 + 0.1 * Math.sin(t * 8 + x);
  let s = glowC(x, y + 20 * r, 150 * r, 0.6 * fl, 'mswarm') + `<rect x="${x - 1.5}" y="${y - 40 * r}" width="3" height="${40 * r}" fill="${MS.ink}"/><path d="M${x - 30 * r},${y + 10 * r} Q${x},${y + 28 * r} ${x + 30 * r},${y + 10 * r}" stroke="${MS.ink}" stroke-width="3" fill="none"/>`;
  for (const k of [-1, -0.5, 0, 0.5, 1]) s += `<circle cx="${f1(x + k * 30 * r)}" cy="${f1(y + (8 - Math.abs(k) * -2) * r)}" r="${f1(3 * r)}" fill="${MS.warm}"/>`;
  return s; }
function tapestry(x, y, w, h, seed) { const r = rng(seed); let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#24403D"/><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" fill="none" stroke="#335652" stroke-width="2"/>`;
  for (let i = 0; i < 6; i++) s += `<path d="M${f1(x + 10 + r() * (w - 30))},${y + h - 8} q6,${f1(-20 - r() * 30)} 14,0" fill="#2B4744"/>`; return s; }
function chouse(t) {
  const s = [], {x0, x1, fl} = CH, M = CH.MAN, wall = '#060606';
  // rooms' back walls
  s.push(roomBg(x0, fl.g, x1 - x0, fl.b - fl.g, '#132423')); // basement
  s.push(roomBg(x0, fl.s, x1 - x0, fl.g - fl.s, '#1F3735'), roomBg(x0, fl.th, x1 - x0, fl.s - fl.th, '#1C3332'), roomBg(x0, fl.at, x1 - x0, fl.th - fl.at, '#172A28'));
  // the roof, cut through: attic rooms under the slates
  s.push(slateRoof([[x0 - 30, fl.at + 6], [x0 + 200, 70], [x1 - 200, 70], [x1 + 30, fl.at + 6]], 7));
  s.push(poly([[x0 + 40, fl.at], [x0 + 230, 110], [x1 - 230, 110], [x1 - 40, fl.at]], '#132423'));
  s.push(`<rect x="${x0 + 500}" y="-10" width="30" height="90" fill="${MS.stoneD}"/>` + MAT.smoke(x0 + 515, -14, t, {col: '3E5F5A', k: 0.6, n: 5, seed: 31}));
  // basement (Hunt's plan): kitchen | servants' hall | wine cellar | service stair
  s.push(MAT.brick(x0, fl.g + 8, 500, fl.b - fl.g - 8, {base: '#1A2E2C', seed: 11, bw: 18, bh: 9, soot: 'top'}));
  s.push(`<rect x="${x0 + 500}" y="${fl.g}" width="10" height="${fl.b - fl.g}" fill="${wall}"/><rect x="${x0 + 820}" y="${fl.g}" width="10" height="${fl.b - fl.g}" fill="${wall}"/><rect x="${x0 + 1080}" y="${fl.g}" width="10" height="${fl.b - fl.g}" fill="${wall}"/>`);
  // the kitchen range under a hood, copper pans on the wall, a long work table, a high window to the areaway
  const kx = x0 + 30, fb = fl.b;
  s.push(`<rect x="${kx}" y="${fb - 46}" width="130" height="46" fill="${MS.ink}"/><rect x="${kx + 10}" y="${fb - 36}" width="40" height="20" fill="${MS.warm}" opacity="${f1(0.5 + 0.2 * Math.sin(t * 9))}"/><rect x="${kx + 70}" y="${fb - 36}" width="40" height="20" fill="${MS.warm}" opacity="${f1(0.45 + 0.2 * Math.sin(t * 7))}"/>`);
  s.push(glowC(kx + 65, fb - 40, 120, 0.7, 'mswarm') + poly([[kx - 10, fb - 92], [kx + 140, fb - 92], [kx + 120, fb - 70], [kx + 10, fb - 70]], MS.ink) + `<rect x="${kx + 55}" y="${fl.g + 8}" width="20" height="${fb - 92 - fl.g - 8}" fill="${MS.ink}"/>`);
  for (let i = 0; i < 3; i++) s.push(`<path d="M${kx + 20 + i * 36},${fb - 46} q0,-10 12,-10 q12,0 12,10 Z" fill="${MS.ink}"/>`, MAT.smoke(kx + 32 + i * 36, fb - 58, t, {col: '5F857F', k: 0.12, n: 4, rise: 40, drift: 20, seed: 50 + i}));
  for (let i = 0; i < 7; i++) s.push(`<circle cx="${kx + 190 + i * 26}" cy="${fb - 92}" r="${8 + (i % 3) * 2}" fill="#2B4744"/><rect x="${kx + 188 + i * 26}" y="${fb - 110}" width="3" height="12" fill="#2B4744"/>`);
  s.push(`<rect x="${x0 + 200}" y="${fb - 31}" width="180" height="5" fill="${MS.ink}"/><rect x="${x0 + 206}" y="${fb - 27}" width="4" height="27" fill="${MS.ink}"/><rect x="${x0 + 370}" y="${fb - 27}" width="4" height="27" fill="${MS.ink}"/>`);
  for (let i = 0; i < 6; i++) s.push(`<ellipse cx="${x0 + 220 + i * 28}" cy="${fb - 34}" rx="10" ry="4" fill="#335652"/>`);
  s.push(`<rect x="${x0 + 400}" y="${fl.g + 16}" width="70" height="34" fill="#5F857F" opacity="0.6"/>` + [0, 1, 2, 3, 4].map((k) => `<rect x="${x0 + 403 + k * 16}" y="${fl.g + 16}" width="3" height="34" fill="${MS.ink}"/>`).join(''));
  // the dumbwaiter, up to the serving pantry
  s.push(`<rect x="${x0 + 478}" y="${fl.s}" width="18" height="${fb - fl.s}" fill="#0B1312"/><rect x="${x0 + 479}" y="${f1(fb - 40 - ((t * 40) % 300))}" width="16" height="20" fill="#2B4744"/>`);
  // servants' hall: a long table; wine cellar: racks
  s.push(`<rect x="${x0 + 560}" y="${fb - 30}" width="220" height="5" fill="${MS.ink}"/>` + [0, 1, 2].map((k) => `<rect x="${x0 + 570 + k * 100}" y="${fb - 26}" width="4" height="26" fill="${MS.ink}"/>`).join('') + gasolier(x0 + 670, fl.g + 30, t, 0.6));
  for (let rx = x0 + 1100; rx < x0 + 1190; rx += 30) for (let ry = fb - 100; ry < fb - 8; ry += 14) s.push(`<circle cx="${rx}" cy="${ry}" r="4" fill="#2B4744"/>`);
  s.push(`<rect x="${x0 + 1092}" y="${fb - 106}" width="100" height="4" fill="${MS.ink}"/>`);
  // the service stair (right, all floors) and the grand staircase (in the great hall)
  for (const [y0, y1] of [[fl.b, fl.g], [fl.g, fl.s], [fl.s, fl.th], [fl.th, fl.at]]) { const n = 10; let d = `M${x1 - 120},${y0}`;
    for (let k = 0; k < n; k++) d += ` l${f1(80 / n)},0 l0,${f1((y1 - y0) / n)}`; s.push(`<path d="${d} L${x1 - 120},${y1 + (y0 - y1)} Z" fill="#0B1312"/>`); }
  s.push(`<rect x="${x1 - 130}" y="${fl.at}" width="8" height="${fl.b - fl.at}" fill="${wall}"/>`);
  // first floor: the dining hall (left, tapestries, a great stone mantel), the great hall, the grand staircase
  s.push(MAT.stone(x0, fl.s + 10, 330, fl.g - fl.s - 10, {base: '#26403C', seed: 21, bh: 26, vary: 0.2}));
  s.push(tapestry(x0 + 20, fl.s + 40, 120, 110, 3), tapestry(x0 + 190, fl.s + 40, 120, 110, 4));
  s.push(`<rect x="${x0 + 120}" y="${fl.g - 120}" width="90" height="120" fill="#335652"/><rect x="${x0 + 140}" y="${fl.g - 70}" width="50" height="70" fill="${MS.warm}" opacity="${f1(0.4 + 0.1 * Math.sin(t * 6))}"/><path d="M${x0 + 110},${fl.g - 120} L${x0 + 165},${fl.g - 200} L${x0 + 220},${fl.g - 120} Z" fill="#335652"/>`);
  s.push(`<rect x="${x0 + 330}" y="${fl.s}" width="10" height="${fl.g - fl.s - 60}" fill="${wall}"/>`);
  // great hall: carved stone walls, tall Gothic windows to the street, two gasoliers, palms ("wagon load after wagon load")
  for (let k = 0; k < 4; k++) s.push(`<path d="M${x0 + 380 + k * 140},${fl.g - 40} L${x0 + 380 + k * 140},${fl.s + 70} L${x0 + 410 + k * 140},${fl.s + 40} L${x0 + 440 + k * 140},${fl.s + 70} L${x0 + 440 + k * 140},${fl.g - 40} Z" fill="#2B4744"/>`);
  s.push(gasolier(x0 + 520, fl.s + 50, t), gasolier(x0 + 800, fl.s + 50, t));
  for (const px of [x0 + 350, x0 + 940]) { s.push(`<path d="M${px - 14},${fl.g} L${px + 14},${fl.g} L${px + 10},${fl.g - 22} L${px - 10},${fl.g - 22} Z" fill="${MS.ink}"/>`);
    for (let k = -3; k <= 3; k++) s.push(`<path d="M${px},${fl.g - 22} Q${px + k * 14},${fl.g - 70} ${px + k * 26},${fl.g - 50 + Math.abs(k) * 6}" stroke="${MS.ink}" stroke-width="4" fill="none"/>`); }
  // the grand staircase: from the hall floor up two storeys, with a landing; Caen stone balustrade
  const sx = x0 + 980;
  s.push(`<path d="M${sx},${fl.g} L${sx + 140},${fl.s + 120} L${sx + 150},${fl.s + 120} L${sx + 150},${fl.g} Z" fill="#132423"/><path d="M${sx + 150},${fl.s + 120} L${sx + 10},${fl.s + 10} L${sx + 20},${fl.s} L${sx + 150},${fl.s + 100} Z" fill="#132423"/>`);
  s.push(line([[sx, fl.g - 30], [sx + 140, fl.s + 90]], '#41625D', 5), line([[sx + 150, fl.s + 92], [sx + 10, fl.s - 20]], '#41625D', 5));
  for (let k = 0; k < 10; k++) { const u = k / 10; s.push(`<rect x="${f1(sx + u * 140)}" y="${f1(fl.g - 30 - u * (fl.g - fl.s - 120))}" width="3" height="28" fill="#41625D"/>`); }
  // second floor: supper in the drawing rooms (tables set, a gasolier in each room)
  for (const [ax, w] of [[x0, 420], [x0 + 430, 420]]) { s.push(gasolier(ax + w / 2, fl.th + 40, t, 0.9));
    for (const tx of [ax + 40, ax + 230]) s.push(`<rect x="${tx}" y="${fl.s - 28}" width="150" height="5" fill="${MS.ink}"/><rect x="${tx + 6}" y="${fl.s - 24}" width="4" height="24" fill="${MS.ink}"/><rect x="${tx + 140}" y="${fl.s - 24}" width="4" height="24" fill="${MS.ink}"/>` + [0, 1, 2, 3].map((k) => `<rect x="${tx + 20 + k * 34}" y="${fl.s - 40}" width="3" height="12" fill="#5F857F"/><ellipse cx="${tx + 21 + k * 34}" cy="${fl.s - 40}" rx="5" ry="3" fill="#5F857F"/>`).join('')); }
  s.push(`<rect x="${x0 + 420}" y="${fl.th}" width="10" height="${fl.s - fl.th - 60}" fill="${wall}"/><rect x="${x0 + 850}" y="${fl.th}" width="10" height="${fl.s - fl.th - 60}" fill="${wall}"/>`);
  // third floor: the gymnasium, where the quadrilles assembled (bars and rings on the wall)
  for (let k = 0; k < 8; k++) s.push(`<rect x="${x0 + 40 + k * 22}" y="${fl.th - 110}" width="3" height="100" fill="#24403D"/>`);
  s.push(`<rect x="${x0 + 30}" y="${fl.th - 110}" width="180" height="4" fill="#24403D"/><circle cx="${x0 + 600}" cy="${fl.at + 70}" r="10" fill="none" stroke="#24403D" stroke-width="3"/><circle cx="${x0 + 640}" cy="${fl.at + 70}" r="10" fill="none" stroke="#24403D" stroke-width="3"/>` + gasolier(x0 + 450, fl.at + 30, t, 0.7));
  // attic: small servants' rooms, iron beds, a candle; the rooms are empty tonight
  for (let k = 0; k < 4; k++) { const rx = x0 + 330 + k * 160; s.push(`<rect x="${rx}" y="${fl.at - 90}" width="6" height="90" fill="${wall}"/><rect x="${rx + 20}" y="${fl.at - 22}" width="70" height="8" fill="${MS.ink}"/><rect x="${rx + 20}" y="${fl.at - 38}" width="4" height="38" fill="${MS.ink}"/><rect x="${rx + 86}" y="${fl.at - 30}" width="4" height="30" fill="${MS.ink}"/>`); }
  s.push(glowC(x0 + 520, fl.at - 30, 50, 0.6, 'mswarm') + `<rect x="${x0 + 518}" y="${fl.at - 30}" width="4" height="10" fill="${MS.warm}"/>`);
  // the cut: floor slabs and walls (poche)
  for (const y of [fl.b, fl.g, fl.s, fl.th, fl.at]) s.push(`<rect x="${x0 - 12}" y="${y}" width="${x1 - x0 + 24}" height="${y === fl.b ? 22 : 12}" fill="${wall}"/>`);
  s.push(`<rect x="${x0 - 14}" y="${fl.at}" width="14" height="${fl.b - fl.at + 20}" fill="${wall}"/><rect x="${x1}" y="${fl.at}" width="14" height="${fl.b - fl.at + 20}" fill="${wall}"/>`);
  // the turret on the corner, outside the cut
  s.push(`<rect x="${x0 - 90}" y="250" width="76" height="370" fill="${MS.stone}"/><rect x="${x0 - 90}" y="250" width="76" height="370" fill="url(#msround)"/><path d="M${x0 - 90},620 L${x0 - 14},620 L${x0 - 52},690 Z" fill="${MS.stone}"/>` + slateRoof([[x0 - 96, 252], [x0 - 52, 20], [x0 - 8, 252]], 8));
  for (const y of [320, 470]) s.push(windowSet(x0 - 64, y, 24, 70, 1, t, y, false));
  return s.join('');
}
function cpeople(t, z) {
  const s = [], {x0, fl} = CH, M = CH.MAN;
  const P = (o) => s.push(guest({h: M, ...o}, t));
  // the hobby-horse quadrille: eight dancers advance and retire in two lines, then turn
  for (let i = 0; i < 8; i++) {
    const line2 = i < 4 ? 0 : 1, k = i % 4, ph = TAU * t / 4, adv = 26 * Math.sin(ph) * (line2 ? -1 : 1);
    const x = x0 + 440 + k * 70 + adv + line2 * 30, y = fl.g - 2 - line2 * 10, d = (line2 ? -1 : 1) * (Math.sin(ph) > -0.9 ? 1 : -1);
    const hop = Math.abs(Math.sin(TAU * t * 1.2 + i)) * 0.03;
    s.push(guest({x, y, h: M, d, kind: i % 2 ? 'woman' : 'man', hat: 'cap', coat: 'jacket', wear: i % 2 ? ['plain'] : [], cos: ['hobby'], an: {bob: hop, fArm: [120, 90], legs: [10 * Math.sin(TAU * t * 1.2 + i), -10 * Math.sin(TAU * t * 1.2 + i)]}}, t));
  }
  // couples at the edges of the floor, in costume
  const r = rng(5);
  for (let i = 0; i < 6; i++) { const x = x0 + 360 + (i < 3 ? i * 24 : 560 + (i - 3) * 26), w = i % 2 === 0;
    P({x, y: fl.g - 2, d: i < 3 ? 1 : -1, kind: w ? 'woman' : 'man', hat: w ? 'none' : 'none', wear: w ? [] : ['knickers'], cos: w ? ['ruff'] : ['cape', 'beret'], an: {...POSES.stand(t, r()), tilt: 4}}); }
  // Alva, Venetian princess, at the foot of the staircase; Alice, the Electric Light, torch raised
  P({x: x0 + 960, y: fl.g - 2, d: -1, kind: 'woman', hat: 'none', cos: ['alva'], an: {...POSES.stand(t, 0.3), fArm: [70, 40]}});
  s.push(`<path d="M${x0 + 960 - 0.36 * M},${fl.g - 0.74 * M} q-6,-8 -14,-2 q8,0 4,6 Z" fill="#DFE0D6"/>`); // a dove on Alva's hand
  const alice = {x: x0 + 700, y: fl.g - 2, h: M, d: 1, kind: 'woman', hat: 'none', fill: '#C9D3CC', cos: ['alice'], an: {...POSES.stand(t, 0.6), fArm: [12, 4]}};
  s.push(glowC(alice.x, alice.y - 0.5 * M, 1.1 * M, 0.35, 'msbulb'));
  s.push(guest(alice, t));
  // the procession down the grand staircase: the next quadrille (the "stars")
  const sx = x0 + 980;
  for (let i = 0; i < 5; i++) { const u = ((t * 0.06 + i * 0.2) % 1), y = fl.s + 120 + u * (fl.g - fl.s - 120), x = sx + 140 - u * 140;
    P({x, y: y - 2, d: -1, kind: i % 2 ? 'man' : 'woman', hat: 'none', wear: i % 2 ? ['knickers'] : [], cos: i % 2 ? ['wig'] : ['ruff'], an: walkAn(walkPhase(u * 300, M))}); }
  // supper in the drawing rooms: guests seated, Delmonico's waiters
  for (const tx of [x0 + 40, x0 + 230, x0 + 470, x0 + 660]) for (const k of [0, 1]) P({x: tx + 30 + k * 90, y: sitY(fl.s - 2, M), d: k ? -1 : 1, kind: k ? 'woman' : 'man', cos: k ? ['ruff'] : ['wig'], an: POSES.drink(t, (tx + k) * 0.01)});
  for (const [wx, sp] of [[x0 + 210, 30], [x0 + 640, -26]]) { const x = wx + 60 * Math.sin(t * 0.4 + wx); P({x, y: fl.s - 2, d: Math.cos(t * 0.4 + wx) * sp > 0 ? 1 : -1, coat: 'frock', an: {fArm: [95, 70], bArm: [160, 170]}}); }
  // the gymnasium: the next quadrilles waiting their turn, hobby horses among them
  for (let i = 0; i < 9; i++) P({x: x0 + 240 + i * 52, y: fl.th - 2, d: i % 3 ? 1 : -1, kind: i % 2 ? 'woman' : 'man', hat: i % 3 === 0 ? 'cap' : 'none', coat: 'jacket', cos: i % 3 === 0 ? ['hobby'] : (i % 2 ? ['ruff'] : ['cape']), an: POSES.stand(t, i * 0.13)});
  // below stairs: cooks at the range and the table, a footman in livery waiting at the dumbwaiter, the butler in the cellar
  P({x: x0 + 90, y: fl.b - 2, d: -1, coat: 'jacket', cos: ['toque'], an: POSES.stir(t)});
  P({x: x0 + 250, y: fl.b - 2, d: 1, coat: 'jacket', cos: ['toque'], an: POSES.wipe(t, 0.2)});
  P({x: x0 + 340, y: fl.b - 2, d: -1, coat: 'jacket', cos: ['toque'], an: {...POSES.stir(t + 1), lean: 8}});
  P({x: x0 + 600, y: fl.b - 2, d: -1, coat: 'frock', wear: ['knickers'], an: POSES.stand(t, 0.4)});
  P({x: x0 + 700, y: sitY(fl.b - 2, M), d: 1, coat: 'frock', wear: ['knickers'], an: POSES.read(t, 0.1), prop: 'paper'});
  P({x: x0 + 1150, y: fl.b - 2, d: -1, coat: 'frock', an: {...POSES.stand(t, 0.7), fArm: [120, 60]}, prop: 'bottle'});
  // the sister: from the range to the dumbwaiter with a tray of ices and cakes, back and forth
  const per = 9, u = (t % per) / per, go = u < 0.5, dist = (go ? u : 1 - u) * 2, pos = smooth(0.08, 0.92, dist);
  const sxp = x0 + 170 + pos * 280, moving = dist > 0.08 && dist < 0.92;
  const hz = M * 0.88 * z, lod = lodFor(hz);
  const an = moving ? {...walkAn(walkPhase(pos * 280, M * 0.88), {carry: true}), fArm: [98, 62], bArm: [104, 70]} : {...POSES.stand(t, 0.2), fArm: [98, 62], bArm: [104, 70], tilt: -4};
  const sis = {...cast('sister', {x: sxp, y: fl.b - 2, h: M, d: go ? 1 : -1}), det: lod.det, rim: {...MS.rim, a: lod.rimA}, an};
  s.push(figure(sis));
  const [hx, hy] = hand({...sis, h: M * 0.88}, an.fArm);
  s.push(`<rect x="${f1(hx - (go ? 22 : 6))}" y="${f1(hy - 2)}" width="28" height="3" fill="#DFE0D6"/><path d="M${f1(hx - (go ? 18 : 2))},${f1(hy - 2)} q5,-9 10,0 Z M${f1(hx - (go ? 4 : -12))},${f1(hy - 2)} q4,-7 8,0 Z" fill="#DFE0D6"/>`);
  return s.join('');
}
function chLabels(c) {
  const lab = (lx, ly, wx, wy, txt) => { const X = c.sx(wx), Y = c.sy(wy); return `<path d="M${f1(lx < X ? lx + txt.length * 15 : lx - 10)},${f1(ly - 10)} L${f1(X)},${f1(Y)}" stroke="#111" stroke-width="6"/><path d="M${f1(lx < X ? lx + txt.length * 15 : lx - 10)},${f1(ly - 10)} L${f1(X)},${f1(Y)}" stroke="${EX.teal}" stroke-width="3"/><circle cx="${f1(X)}" cy="${f1(Y)}" r="6" fill="${EX.teal}"/>` + penS(lx, ly, txt, 26, -2); };
  const {x0, fl} = CH;
  return [lab(1500, 200, x0 + 500, fl.at - 40, 'servants\' rooms under the roof'), lab(1500, 330, x0 + 700, fl.th - 40, 'the quadrilles gather'),
    lab(1520, 470, x0 + 600, fl.s - 50, 'supper at 2 a.m.'), lab(1530, 610, x0 + 1100, fl.g - 140, 'down the grand staircase'),
    lab(40, 650, x0 + 690, fl.g - 80, 'the electric light'), lab(40, 950, x0 + 300, fl.b - 40, 'the kitchen: every vanderbilt cook')].join('');
}
const CH_KEYS = [[0, 0.78, 930, 540], [4.2, 0.8, 930, 540], [9.0, 2.0, 1060, 760], [10.2, 2.0, 1060, 760], [13.2, 4.6, 560, 950], [16, 4.9, 590, 950]];
function chCam(t) { let k = CH_KEYS.length - 2;
  for (let i = 0; i < CH_KEYS.length - 1; i++) if (t < CH_KEYS[i + 1][0]) { k = i; break; }
  const [t0, z0, x0, y0] = CH_KEYS[k], [t1, z1, x1, y1] = CH_KEYS[k + 1], u = ease(clamp01((t - t0) / (t1 - t0)));
  return {z: lerpLog(z0, z1, u), ux: x0 + (x1 - x0) * u, uy: y0 + (y1 - y0) * u}; }
function renderBall({t, cam = null, labels = false}) {
  const c = cam2(cam || chCam(t)), world = [];
  world.push(layerAt(c, 0.3, `<rect x="-3000" y="560" width="9000" height="3000" fill="#1C3332"/>` + stThomas(1700, 900, '#1C3332') + brownstones(-1400, -200, 380, 0.6, t, 7).replace(/#1C3332/g, '#1C3332')));
  world.push(layerAt(c, 1, `<rect x="-3000" y="${CH.fl.g}" width="9000" height="3000" fill="#0A1110"/><rect x="-3000" y="${CH.fl.g}" width="${3000 + CH.x0 - 14}" height="8" fill="#2B4744"/><rect x="${CH.x1 + 14}" y="${CH.fl.g}" width="4000" height="8" fill="#2B4744"/>` +
    brougham(CH.x1 + 380, CH.fl.g, 62, MS.ink, 100) + gasLamp(CH.x1 + 120, CH.fl.g, 160, 1, t) + gasLamp(CH.x0 - 260, CH.fl.g, 160, 1, t) + chouse(t) + cpeople(t, c.z)));
  const scr = [tag(40, 1040, 'THE BALL · 660 FIFTH AVENUE · MARCH 26, 1883', 1)];
  if (labels) scr.push(chLabels(c));
  else {
    if (t > 1.2 && t < 8.5) scr.push(penS(1240, 150, 'upstairs: 1,200 guests', 32, -3, EX.orange));
    if (t > 11 && t < 16) scr.push(penS(1100, 150, 'downstairs: the kitchen', 34, -3, EX.orange), tag(1180, 230, 'COMPOSITE CHARACTER', smooth(11.5, 12, t)));
  }
  return frame(msDefs(t), `<rect width="1920" height="1080" fill="url(#msnight)"/>`, world.join(''), scr.join(''), t);
}

/* ---------- clips ---------- */
Object.assign(CLIPS, {
  fifth_night: {sec: 10, render: (t) => renderFifth({t, cam: {z: 1.0, ux: 1350 + t * 75, uy: 520}})},
  ball_cutaway: {sec: 16, render: (t) => renderBall({t})},
  fifth_dawn: {sec: 9, render: (t) => renderFifth({t, dawn: 0.65 + 0.03 * t, cam: (() => { const u = ease(t / 9); return {z: lerpLog(0.95, 2.4, u), ux: 1900 - 160 * u, uy: 540 + 220 * u}; })()})},
});
if (typeof window !== 'undefined') Object.assign(window, {renderFifth, renderBall});
