// Episode 2 sets: the Vanderbilt ball, March 26, 1883, at 660 Fifth Avenue (northwest corner of 52nd Street), and the
// Kellys' sister below stairs. Built with rig.js, scene.js, street.js and explainers.js (load them first).
//
//   fifth_night   s1  Fifth Avenue at night: Richard Morris Hunt's limestone chateau (steep slate roof, corner turret, Gothic-French
//                     carving), windows blazing; carriages in a line, coachmen in top hats; guests in costume step down under the
//                     canopy; the police hold a crowd back on the sidewalk. Gas lamps only. A slow side-scroll.
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
    const X = (u) => o.x + o.d * u * o.h, Y = (v) => o.y - v * o.h, n = 0.02 * Math.sin(t * 6 + o.x), hc = '#2B4744';
    const P = (u, v) => `${f1(X(u))},${f1(Y(v))}`;
    return `<path d="M${P(-0.22, 0.52)} Q${P(-0.2, 0.58)} ${P(0.0, 0.57)} L${P(0.16, 0.56)} Q${P(0.2, 0.74 + n)} ${P(0.27, 0.78 + n)} L${P(0.29, 0.83 + n)} L${P(0.31, 0.78 + n)} Q${P(0.38, 0.74 + n)} ${P(0.43, 0.66 + n)} L${P(0.41, 0.63 + n)} Q${P(0.33, 0.66 + n)} ${P(0.27, 0.64 + n)} Q${P(0.24, 0.55)} ${P(0.22, 0.46)} L${P(0.2, 0.32)} L${P(-0.2, 0.32)} L${P(-0.22, 0.46)} Z" fill="${hc}"/>` +
      `<path d="M${P(-0.22, 0.54)} Q${P(-0.32, 0.5)} ${P(-0.3, 0.38)}" stroke="${hc}" stroke-width="${f1(0.025 * o.h)}" fill="none" stroke-linecap="round"/>`;
  },
  beret(o, c) { const X = (u) => o.x + o.d * u * o.h, Y = (v) => o.y - v * o.h;
    return `<ellipse cx="${f1(X(0.0))}" cy="${f1(Y(0.995))}" rx="${f1(0.085 * o.h)}" ry="${f1(0.022 * o.h)}" fill="${c}"/>` + `<path d="M${f1(X(-0.04))},${f1(Y(1.0))} q${f1(-o.d * 0.1 * o.h)},${f1(-0.08 * o.h)} ${f1(-o.d * 0.16 * o.h)},${f1(-0.02 * o.h)}" stroke="${c}" stroke-width="${f1(0.012 * o.h)}" fill="none"/>`; },
  cape(o, c) { const X = (u) => o.x + o.d * u * o.h, Y = (v) => o.y - v * o.h; return poly([[X(-0.06), Y(0.84)], [X(-0.2), Y(0.36)], [X(0.0), Y(0.4)], [X(0.06), Y(0.8)]], c); },
  ruff(o, c) { const X = (u) => o.x + o.d * u * o.h, Y = (v) => o.y - v * o.h; return `<ellipse cx="${f1(X(0.01))}" cy="${f1(Y(0.85))}" rx="${f1(0.07 * o.h)}" ry="${f1(0.025 * o.h)}" fill="${c}"/>`; },
  toque(o, c) { const X = (u) => o.x + o.d * u * o.h, Y = (v) => o.y - v * o.h; return `<path d="M${f1(X(-0.055))},${f1(Y(0.93))} L${f1(X(-0.07))},${f1(Y(1.08))} Q${f1(X(-0.09))},${f1(Y(1.17))} ${f1(X(0))},${f1(Y(1.16))} Q${f1(X(0.09))},${f1(Y(1.17))} ${f1(X(0.07))},${f1(Y(1.08))} L${f1(X(0.07))},${f1(Y(0.93))} Z" fill="${c}"/>`; },
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
// The carriage horse: street.js's four-beat walk, re-derived so each planted hoof stays put on the road. The hoof sweeps
// 2 sin(amp) (0.32 + 0.3) sz while planted (60% of the cycle), so one cycle covers that / 0.6 of road. dist is road distance in px.
// toss: 0..1 head toss when standing; shift: a weight shift (one hind leg rests) when standing.
const MSH = {amp: 20, L: 0.62};
function msHorse(x, gy, sz, c, dist, toss = 0, shift = 0, dir = 1) {
  const s = [], X = (u) => x + dir * u * sz, Yy = (v) => gy - v * sz;
  const sm = Math.sin(MSH.amp * Math.PI / 180), cyc = 2 * sm * MSH.L * sz / 0.6, p = dist / cyc;
  const legs = [[-0.4, 0, true], [0.4, 0.25, false], [-0.3, 0.5, true], [0.48, 0.75, false]];
  legs.forEach(([lx, off, hind], li) => {
    let u = ((p + off) % 1 + 1) % 1, th, bend;
    if (u < 0.6) { th = Math.asin(sm * (1 - 2 * u / 0.6)) * 180 / Math.PI; bend = 0; }
    else { const v = (u - 0.6) / 0.4; th = -MSH.amp * Math.cos(Math.PI * v); bend = 45 * Math.sin(Math.PI * v); }
    if (li === 2) { bend += 30 * shift; } // the resting hind leg, hock cocked, toe tipped
    const hip = [X(lx), Yy(0.66)], r = (deg) => deg * Math.PI / 180;
    const knee = [hip[0] + dir * Math.sin(r(th)) * 0.32 * sz, hip[1] + Math.cos(r(th)) * 0.32 * sz];
    const sh = hind ? th + bend : th - bend;
    const hoof = [knee[0] + dir * Math.sin(r(sh)) * 0.3 * sz, Math.min(gy - 3, knee[1] + Math.cos(r(sh)) * 0.3 * sz)];
    s.push(line([hip, knee], c, 0.095 * sz) + line([knee, hoof], c, 0.055 * sz));
    s.push(`<ellipse cx="${f1(hoof[0] + dir * 0.02 * sz)}" cy="${f1(hoof[1])}" rx="${f1(0.045 * sz)}" ry="${f1(0.025 * sz)}" fill="${c}"/>`);
  });
  const sag = 0.012 * shift;
  s.push(`<ellipse cx="${f1(X(0.02))}" cy="${f1(Yy(0.78 - sag))}" rx="${f1(0.56 * sz)}" ry="${f1(0.2 * sz)}" fill="${c}"/>`);
  const nod = 0.03 * Math.sin(TAU * p * 2) + 0.12 * toss, fw = -0.04 * toss;
  s.push(poly([[X(0.38), Yy(0.92)], [X(0.62 + fw), Yy(1.28 + nod)], [X(0.78 + fw), Yy(1.24 + nod)], [X(0.98 + fw), Yy(1.0 + nod * 1.4)], [X(0.9 + fw), Yy(0.94 + nod * 1.4)], [X(0.66 + fw), Yy(1.04 + nod)], [X(0.52), Yy(0.66)]], c));
  s.push(poly([[X(0.66 + fw), Yy(1.26 + nod)], [X(0.68 + fw), Yy(1.38 + nod)], [X(0.72 + fw), Yy(1.27 + nod)]], c));
  s.push(poly([[X(0.42), Yy(0.98)], [X(0.6 + fw), Yy(1.27 + nod)], [X(0.5 + fw), Yy(1.2 + nod)], [X(0.36), Yy(0.95)]], c));
  const sw = 0.05 * Math.sin(TAU * p) + 0.04 * toss;
  s.push(`<path d="M${f1(X(-0.5))},${f1(Yy(0.88))} Q${f1(X(-0.66))},${f1(Yy(0.6))} ${f1(X(-0.6 + sw))},${f1(Yy(0.32))} L${f1(X(-0.54 + sw))},${f1(Yy(0.34))} Q${f1(X(-0.56))},${f1(Yy(0.62))} ${f1(X(-0.46))},${f1(Yy(0.8))} Z" fill="${c}"/>`);
  return s.join('');
}
// a closed carriage behind one horse. dist: road distance (drives hooves and wheels); v: speed 0..1 (springs bob with it, the
// horse rests and tosses its head when standing); t: time (the coachman sways).
function brougham(x, gy, sz, c, dist, open = 0, lamp = 1, v = 1, t = 0) {
  const s = [], X = (u) => x - u * sz, still = 1 - smooth(0.02, 0.25, v);
  const toss = still * Math.max(0, Math.sin(t * 1.7 + x * 0.01)) ** 6, shift = still * smooth(0.3, 0.6, Math.sin(t * 0.4 + x) * 0.5 + 0.5);
  s.push(msHorse(x, gy, sz, c, dist, toss, shift, 1));
  const bob = sz * (0.022 * v * Math.sin(dist * 0.11) + 0.006 * still * Math.sin(t * 2.3 + x)), tilt = 0.8 * v * Math.sin(dist * 0.055);
  s.push(line([[X(0.3), gy - 0.78 * sz], [X(0.95), gy - 0.62 * sz + bob]], c, 0.04 * sz));
  const body = [], bx0 = X(2.3), bx1 = X(1.05), top = gy - 1.55 * sz, bot = gy - 0.42 * sz;
  body.push(`<path d="M${f1(bx0)},${f1(bot)} L${f1(bx0)},${f1(top + 0.08 * sz)} Q${f1(bx0)},${f1(top)} ${f1(bx0 + 0.1 * sz)},${f1(top)} L${f1(X(1.45))},${f1(top)} L${f1(X(1.45))},${f1(gy - 0.8 * sz)} Q${f1(bx1)},${f1(gy - 0.78 * sz)} ${f1(bx1)},${f1(bot - 0.1 * sz)} L${f1(X(1.2))},${f1(bot)} Z" fill="${c}"/>`);
  body.push(`<rect x="${f1(X(2.05))}" y="${f1(top + 0.12 * sz)}" width="${f1(0.36 * sz)}" height="${f1(0.4 * sz)}" fill="${MS.warm}" opacity="0.35"/>`);
  if (open > 0) body.push(`<rect x="${f1(X(2.05))}" y="${f1(top + 0.1 * sz)}" width="${f1(0.4 * sz * open)}" height="${f1(0.72 * sz)}" fill="${MS.warm}" opacity="0.5"/><rect x="${f1(X(2.05) - 0.38 * sz * open)}" y="${f1(top + 0.1 * sz)}" width="${f1(0.36 * sz * open)}" height="${f1(0.72 * sz)}" fill="${c}"/>`);
  body.push(`<rect x="${f1(X(1.12))}" y="${f1(top + 0.18 * sz)}" width="${f1(0.06 * sz)}" height="${f1(0.12 * sz)}" fill="${MS.warm}" opacity="${f1(0.85 * lamp)}"/>` + glowC(X(1.09), top + 0.24 * sz, 0.4 * sz, 0.5 * lamp));
  const sway = 3 * Math.sin(t * 1.9 + x * 0.02) * (0.4 + v) + 4 * v * Math.sin(dist * 0.11);
  body.push(figure({x: X(1.3), y: top + 0.12 * sz + 0.5 * 1.05 * sz, h: 1.05 * sz, d: 1, kind: 'man', hat: 'top', coat: 'frock', fill: c, an: {legs: [88, 84], shins: [6, 2], lean: -2 + sway, fArm: [100 + 4 * Math.sin(t * 1.3 + x), 80]}}));
  // the body rides on its springs: a bob and a slight rock, about the axle line
  s.push(`<g transform="translate(0,${f1(bob)}) rotate(${f1(tilt)}, ${f1(X(1.7))}, ${f1(bot)})">${body.join('')}</g>`);
  s.push(`<path d="M${f1(X(1.15))},${f1(bot + bob)} q${f1(-0.2 * sz)},${f1(0.08 * sz)} ${f1(-0.4 * sz)},0 M${f1(X(1.85))},${f1(bot + bob)} q${f1(-0.2 * sz)},${f1(0.08 * sz)} ${f1(-0.4 * sz)},0" stroke="${c}" stroke-width="${f1(0.035 * sz)}" fill="none"/>`); // the elliptic springs
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

/* ---------- the chateau ---------- */
function windowSet(x, y, w, h, lit, t, seed, hood = true) { // a stone-mullioned cross window with a Gothic hood moulding
  const r = rng(seed), on = (r() < lit * 1.05 ? 1 : 0) * (r() > 0.12 ? 1 : 0.3), fl = 0.92 + 0.08 * Math.sin(t * 5 + seed);
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
  s.push(`<path d="M${tx - tr},610 L${tx + tr},610 L${tx + 20},650 L${tx - 20},650 Z" fill="${MS.stone}"/><rect x="${tx - tr}" y="200" width="${tr * 2}" height="410" fill="${MS.stone}"/><rect x="${tx - tr}" y="200" width="${tr * 2}" height="410" fill="url(#msround)"/>`);
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
  const s = [], q = queue(t), sz = ARR.sz, stop = DOOR + 240;
  for (let i = q.k - 2; i < q.k + 6; i++) {
    const xAt = (tt) => { const qq = queue(tt), k2 = qq.n - i; return stop + k2 * ARR.S + (k2 > 0.5 ? (k2 - 0.5) * 300 : 0); };
    const x = xAt(t), v = clamp01(Math.abs(x - xAt(t - 1 / 30)) * 30 / 260);
    const open = i === q.k ? smooth(1.9, 2.3, q.u) * (1 - smooth(4.0, 4.4, q.u)) : 0;
    if (i === q.k) { // the guests step down on the curb side, come out from behind the carriage and go up the carpet; a footman holds the door
      s.push(guest({x: DOOR + 70 - 30 * open, y: CURB - 4, h: 64, d: -1, coat: 'frock', wear: ['knickers'], cos: ['wig'], an: {fArm: [100 - 10 * open, 80]}}));
      GUESTS[((i % 4) + 4) % 4].forEach((g, j) => {
        const u = clamp01((q.u - 2.1 - j * 0.55) / 2.3); if (u <= 0 || u >= 1) return;
        const a2 = smooth(0, 0.5, u), b2 = smooth(0.5, 1, u);
        const gx = DOOR + 110 - 110 * a2 + j * 14, gy = CURB - 2 - (CURB - G5 - 4) * b2, hh = 68 - 8 * b2, d = a2 < 0.98 ? -1 : 1;
        s.push(`<g opacity="${f1(1 - smooth(0.9, 1, u))}">` + guest({...g, x: gx, y: gy, h: hh, d, an: walkAn(walkPhase(u * 200, hh))}, t) + '</g>');
      });
    }
    s.push(brougham(x, ROAD, sz, MS.ink, x, open, 1, v, t));
  }
  return s.join('');
}
function canopy(dawn) { // an awning from the door to the curb, and a carpet
  const c = MS.ink, x0 = DOOR - 80, x1 = DOOR + 80;
  return `<rect x="${x0}" y="${G5 + 4}" width="160" height="${CURB - G5}" fill="#1F3735"/>` + (dawn > 0.5 ? '' :
    `<rect x="${x0 - 22}" y="${CURB - 132}" width="204" height="14" fill="${c}"/><path d="M${x0 - 22},${CURB - 118} ${[...Array(12)].map((_, k) => `q8.5,12 17,0`).join(' ')}" fill="${c}"/><rect x="${x0 - 18}" y="${CURB - 124}" width="6" height="124" fill="${c}"/><rect x="${x1 + 12}" y="${CURB - 124}" width="6" height="124" fill="${c}"/>`);
}
function onlookersFar(t) { // the crowd on the house's sidewalk, held back on either side of the canopy by police
  const s = [], r = rng(1883);
  for (let i = 0; i < 26; i++) {
    const side = i % 2 ? 1 : -1, x = DOOR + side * (120 + Math.floor(i / 2) * 26 + r() * 10), h = 52 + r() * 10, kind = r() > 0.6 ? 'woman' : 'man';
    const up = (t * 0.7 + r()) % 3 < 0.5 ? 1 : 0;
    s.push(figure({x, y: CURB - 6 - r() * 8, h, d: -side, kind, hat: kind === 'man' ? (r() > 0.5 ? 'bowler' : 'cap') : 'kerchief', coat: 'sack', fill: MS.ink, wear: kind === 'woman' ? ['plain', 'shawl'] : [], an: {...POSES.stand(t, r()), tilt: 6 + up * 10}}));
  }
  for (const side of [-1, 1]) s.push(policeman(DOOR + side * 100, CURB - 2, 66, side, {fArm: [90, 92], bArm: [180, 190]}));
  return s.join('');
}
function onlookersNear(t, rimA) { // the crowd on the near sidewalk, in the foreground
  const s = [], r = rng(52);
  for (let i = 0; i < 14; i++) {
    const x = -300 + i * 330 + r() * 120, h = 300 + r() * 50, kind = r() > 0.55 ? 'woman' : 'man', ph = r();
    const wave = kind === 'man' && r() > 0.6 && (t + ph * 6) % 6 < 1.4;
    s.push(figure({x, y: 1200, h, d: r() > 0.3 ? 1 : -1, kind, hat: kind === 'man' ? ['bowler', 'cap', 'top'][Math.floor(r() * 3)] : 'lady', coat: 'sack', fill: '#060807',
      rim: {...MS.rim, a: rimA}, an: {...POSES.stand(t, ph), tilt: 8, ...(wave ? {fArm: [20, 10]} : {})}}));
  }
  return s.join('');
}
// an 1880s New York policeman: dark knee-length frock coat with two rows of brass buttons, a domed helmet, a club at the belt
function policeman(x, y, h, d, an = {}, rim = null) {
  const X = (u) => x + d * u * h, Y = (v) => y - v * h, c = MS.ink;
  let s = figure({x, y, h, d, kind: 'man', hat: 'none', coat: 'frock', fill: c, an, rim});
  s += `<path d="M${f1(X(-0.07))},${f1(Y(0.975))} Q${f1(X(-0.07))},${f1(Y(1.1))} ${f1(X(0.0))},${f1(Y(1.1))} Q${f1(X(0.07))},${f1(Y(1.1))} ${f1(X(0.07))},${f1(Y(0.975))} Z" fill="${c}"/><rect x="${f1(Math.min(X(-0.085), X(0.095)))}" y="${f1(Y(0.98))}" width="${f1(0.18 * h)}" height="${f1(0.018 * h)}" fill="${c}"/>`;
  s += poly([[X(-0.11), Y(0.62)], [X(0.11), Y(0.62)], [X(0.13), Y(0.27)], [X(-0.14), Y(0.27)]], c); // the coat's skirts to the knee
  for (const v of [0.78, 0.72, 0.66, 0.6, 0.54, 0.48]) s += `<circle cx="${f1(X(0.07))}" cy="${f1(Y(v))}" r="${f1(Math.max(0.9, 0.009 * h))}" fill="#C9B98A"/>`;
  s += `<rect x="${f1(Math.min(X(-0.11), X(0.11)))}" y="${f1(Y(0.52))}" width="${f1(0.22 * h)}" height="${f1(0.02 * h)}" fill="#24403D"/>` + line([[X(-0.08), Y(0.51)], [X(-0.1), Y(0.33)]], c, 0.03 * h); // belt and club
  return s;
}
function lamplighter(x, t) { return figure({x, y: CURB - 2, h: 62, d: 1, kind: 'man', hat: 'cap', coat: 'jacket', fill: MS.ink, an: {...walkAn(walkPhase(x, 62)), fArm: [30, 20]}}) + line([[x + 10, CURB - 62], [x + 40, CURB - 150]], MS.ink, 3); }

function msDefs(t) {
  return exDefs(t).replace('</defs>', grad('msnight', MS.night) + grad('msday', [['0', '#5F857F'], ['0.7', '#A3BAB2'], ['1', '#DFE0D6']]) + grad('msdawn', MS.dawn) +
    `<radialGradient id="msglow"><stop offset="0" stop-color="#FFF3D6" stop-opacity="0.5"/><stop offset="0.4" stop-color="#FFF3D6" stop-opacity="0.15"/><stop offset="1" stop-color="#FFF3D6" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="msbulb"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.7"/><stop offset="0.3" stop-color="#E6FFF9" stop-opacity="0.22"/><stop offset="1" stop-color="#E6FFF9" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="msstone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.25"/><stop offset="0.6" stop-color="#FFF3D6" stop-opacity="0.04"/><stop offset="1" stop-color="#FFF3D6" stop-opacity="0.12"/></linearGradient>` +
    `<linearGradient id="msround" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.35"/><stop offset="0.4" stop-color="#DFE0D6" stop-opacity="0.1"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></linearGradient>` +
    `<pattern id="msslate" width="16" height="14" patternUnits="userSpaceOnUse"><path d="M0,14 Q4,6 8,14 Q12,6 16,14" fill="none" stroke="#21393A" stroke-width="1.2"/></pattern>` +
    `<radialGradient id="mswarm"><stop offset="0" stop-color="#FFF3D6" stop-opacity="0.32"/><stop offset="1" stop-color="#FFF3D6" stop-opacity="0"/></radialGradient></defs>`);
}

/* ---------- s1 / s4: Fifth Avenue ---------- */
function renderFifth({t, dawn = 0, cam, quiet = false}) {
  const c = cam2(cam), world = [], lit = 1 - smooth(0.2, 1, dawn) * 0.85;
  const lighterX = dawn > 0 ? 700 + t * 140 : -1e9; // the lamplighter's pole puts the lamps out as he passes
  const sky = `<rect width="1920" height="1080" fill="url(#msnight)"/>` + (dawn > 0 ? `<rect width="1920" height="1080" fill="url(#msdawn)" opacity="${f1(dawn)}"/>` + clouds(t, 11) + `<ellipse cx="1500" cy="${f1(c.sy(G5 - 300))}" rx="900" ry="220" fill="url(#mswarm)" opacity="${f1(dawn)}"/>` : '');
  const stars = dawn < 1 ? (() => { const r = rng(9); let s2 = ''; for (let i = 0; i < 60; i++) s2 += `<circle cx="${f1(r() * 1920)}" cy="${f1(r() * 500)}" r="${f1(0.8 + r())}" fill="#DFE0D6" opacity="${f1((0.25 + 0.3 * r()) * (1 - dawn))}"/>`; return s2; })() : '';
  // far: the city's roofline and St. Thomas's tower a block north
  const farC = dawn ? '#3E5F5A' : '#1C3332';
  world.push(layerAt(c, 0.35, (`<rect x="-2000" y="${G5 - 260}" width="8000" height="2000" fill="#1C3332"/>` + stThomas(3300, G5, '#1C3332') + (() => { const r = rng(3); let s2 = ''; for (let x = -1500; x < 5000; x += 160 + r() * 120) { const hh = 280 + r() * 260; s2 += `<rect x="${f1(x)}" y="${f1(G5 - hh)}" width="${f1(140 + r() * 100)}" height="${f1(hh)}" fill="#1C3332"/>`; } return s2; })()).replace(/#1C3332/g, farC)));
  // main: the triple palace, 52nd Street, the chateau, brownstones north
  const main = [];
  main.push(brownstones(-600, 1130, 250, lit * 0.8, t, 640));
  main.push(chateau(t, lit, dawn));
  main.push(brownstones(2460, 3300, 300, lit * 0.6, t, 680));
  main.push(`<rect x="-3000" y="${G5}" width="9000" height="${CURB - G5}" fill="#132423"/><rect x="-3000" y="${CURB}" width="9000" height="8" fill="#2B4744"/><rect x="-3000" y="${CURB + 8}" width="9000" height="800" fill="#0E1A19"/>`);
  main.push(MAT.ground(-3000, 6000, CURB + 8, {base: '#0E1A19', seed: 5, tufts: false}));
  main.push(canopy(dawn));
  // lamps along the curb: all gas (approved: no electric street light here in 1883)
  for (const lx of [300, 900, 1650, 2500, 3100, 3700]) s0push(main, gasLamp(lx, CURB, 160, lighterX > lx ? 0 : 1, t));
  s0push(main, gasLamp(1250, CURB, 160, lighterX > 1250 ? 0 : 1, t));
  if (dawn > 0) main.push(lamplighter(lighterX - 30, t));
  if (dawn < 0.5) main.push(onlookersFar(t), arrivals(t, c.z)); else main.push(departures(t));
  world.push(layerAt(c, 1, main.join('')));
  if (!dawn) world.push(layerAt(c, 1.3, onlookersNear(t, 0.5)));
  if (dawn) world.push(`<rect width="1920" height="1080" fill="url(#msdawn)" opacity="${f1(0.22 * dawn)}" style="mix-blend-mode:screen"/>`);
  const scr = [tag(40, 1040, dawn ? 'FIFTH AVENUE · DAWN, MARCH 27, 1883' : '660 FIFTH AVENUE · MONDAY, MARCH 26, 1883', 1)];
  if (!dawn && t > 4.5) scr.push(penS(1220, 140, '1,200 guests in costume', 34, -3, EX.orange));
  if (dawn && t > 3) scr.push(penS(1180, 140, 'the last dance ended at sunrise', 32, -3, EX.orange));
  if (quiet) scr.length = 0;   // the edit puts its own notes on
  return frame(msDefs(t), sky + stars, world.join(''), scr.join(''), t);
}
function s0push(a, v) { a.push(v); }

/* ---------- s4: departures and the sister on the area steps ---------- */
function departures(t) {
  const s = [], sz = ARR.sz;
  // carriages pull away north; guests come down the steps in twos
  const pairs = [[0.4, {kind: 'woman', hat: 'none', cos: ['ruff']}], [0.9, {kind: 'man', cos: ['cape', 'beret'], coat: 'jacket', wear: ['knickers']}], [3.6, {kind: 'woman', hat: 'none', cos: ['wig']}], [4.1, {kind: 'man', cos: ['wig'], wear: ['knickers']}]];
  for (const [t0, g] of pairs) { const u = clamp01((t - t0) / 3.4); if (u <= 0 || u >= 1) continue;
    const gx = DOOR - 10 + 140 * u, gy = G5 + 2 + (ROAD - G5) * smooth(0, 0.7, u), hh = 58 + 8 * u;
    s.push(guest({...g, x: gx, y: gy, h: hh, d: 1, an: {...walkAn(walkPhase(u * 140, hh)), lean: 4}}, t)); }
  // the sister: up the area steps from the basement door with a pail of ashes; at the top she stops and watches them go
  const ax = HX + 250, up = smooth(0.8, 4.6, t), hs = 75 * 0.85 * 0.88;
  let st = ''; for (let k = 0; k < 6; k++) st += `<rect x="${ax - 50 + k * 14}" y="${CURB + 30 - k * 12}" width="100" height="3" fill="#24403D"/>`;
  s.push(`<rect x="${ax - 56}" y="${G5 + 6}" width="112" height="${CURB - G5 + 40}" fill="#060A0A"/>` + st + glowC(ax - 40, CURB, 60, 0.5));
  const x = ax - 46 + 80 * up, y = CURB + 36 - (CURB + 36 - G5 - 24) * up, walking = t > 0.8 && t < 4.6;
  s.push(figure({...cast('sister', {x, y, h: 75 * 0.85, d: 1}), det: 0, rim: {...MS.rim, a: 0.5}, pail: true,
    an: walking ? walkAn(walkPhase(up * 110, hs), {carry: true}) : {...POSES.stand(t, 0.2), tilt: t > 5.2 ? 8 : 0}}));
  s.push(`<rect x="-3000" y="${CURB}" width="9000" height="8" fill="#2B4744"/><rect x="${ax - 60}" y="${CURB + 8}" width="120" height="60" fill="#0E1A19"/>`);
  for (let i = 0; i < 4; i++) { const x = DOOR + 2 * sz - 1150 + i * 520 + t * 60; s.push(brougham(x, ROAD, sz, MS.ink, x, 0, 0.3, 0.25, t)); }
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
  // as on the street front: iron cresting along the ridge, and the crocketed stone gable at the north end, cut through
  { let cr = ''; for (let x = x0 + 205; x < x1 - 200; x += 16) cr += `M${x},70 l0,-14 M${x - 4},61 l8,0 `; s.push(`<path d="${cr}" stroke="${MS.ink}" stroke-width="3"/><rect x="${x0 + 200}" y="66" width="${x1 - x0 - 400}" height="5" fill="${MS.ink}"/>`);
    const gx0 = x1 - 270, gx1 = x1 + 14, gm = (gx0 + gx1) / 2, gp = -70;
    s.push(`<path d="M${gx0},${fl.at} L${gx0},170 L${gm},${gp} L${gx1},170 L${gx1},${fl.at} Z" fill="${MS.stone}"/><path d="M${gx0 + 26},${fl.at} L${gx0 + 26},180 L${gm},${gp + 44} L${gx1 - 26},180 L${gx1 - 26},${fl.at} Z" fill="#172A28"/>`);
    s.push(`<path d="M${gx0 - 10},178 L${gm},${gp - 8} L${gx1 + 10},178" stroke="#41625D" stroke-width="10" fill="none"/><path d="M${gm},${gp - 8} l0,-44 M${gm - 12},${gp - 34} l24,0" stroke="${MS.stoneD}" stroke-width="6"/>`);
    for (let k = 1; k < 6; k++) { const u = k / 6; s.push(`<circle cx="${f1(gx0 + (gm - gx0) * u)}" cy="${f1(170 - (170 - gp) * u - 12)}" r="6" fill="#41625D"/><circle cx="${f1(gx1 - (gx1 - gm) * u)}" cy="${f1(170 - (170 - gp) * u - 12)}" r="6" fill="#41625D"/>`); }
    for (const px of [gx0, gx1]) s.push(`<rect x="${px - 8}" y="110" width="16" height="70" fill="${MS.stone}"/><path d="M${px - 9},110 L${px},64 L${px + 9},110 Z" fill="${MS.stone}"/>`);
    s.push(`<rect x="${gm - 30}" y="${fl.at - 120}" width="8" height="120" fill="#060606"/>` + glowC(gm + 40, fl.at - 40, 60, 0.5, 'mswarm')); }
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
    s.push(guest({x, y, h: M, d, kind: i % 2 ? 'woman' : 'man', hat: 'cap', coat: 'jacket', wear: i % 2 ? ['plain'] : [], cos: ['hobby'], an: {bob: hop, fArm: [140, 100], bArm: [150, 110], legs: [10 * Math.sin(TAU * t * 1.2 + i), -10 * Math.sin(TAU * t * 1.2 + i)]}}, t));
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
  const lab = (lx, ly, wx, wy, txt) => { const X = c.sx(wx), Y = c.sy(wy); return `<path d="M${f1(lx < X ? lx + txt.length * 21 : lx - 10)},${f1(ly - 10)} L${f1(X)},${f1(Y)}" stroke="#111" stroke-width="6"/><path d="M${f1(lx < X ? lx + txt.length * 21 : lx - 10)},${f1(ly - 10)} L${f1(X)},${f1(Y)}" stroke="${EX.teal}" stroke-width="3"/><circle cx="${f1(X)}" cy="${f1(Y)}" r="6" fill="${EX.teal}"/>` + penS(lx, ly, txt, 26, -2); };
  const {x0, fl} = CH;
  return [lab(1530, 200, x0 + 500, fl.at - 40, 'servants\' attic rooms'), lab(1530, 330, x0 + 700, fl.th - 40, 'quadrilles gather'),
    lab(1520, 470, x0 + 600, fl.s - 50, 'supper, 2 a.m.'), lab(1530, 610, x0 + 1100, fl.g - 140, 'grand staircase'),
    lab(40, 650, x0 + 690, fl.g - 80, 'the electric light'), lab(40, 975, x0 + 300, fl.b - 40, 'the kitchen')].join('');
}
const CH_KEYS = [[0, 0.78, 930, 540], [4.2, 0.8, 930, 540], [9.0, 2.0, 1060, 760], [10.2, 2.0, 1060, 760], [13.2, 4.3, 560, 925], [16, 4.6, 590, 925]];
function chCam(t) { let k = CH_KEYS.length - 2;
  for (let i = 0; i < CH_KEYS.length - 1; i++) if (t < CH_KEYS[i + 1][0]) { k = i; break; }
  const [t0, z0, x0, y0] = CH_KEYS[k], [t1, z1, x1, y1] = CH_KEYS[k + 1], u = ease(clamp01((t - t0) / (t1 - t0)));
  return {z: lerpLog(z0, z1, u), ux: x0 + (x1 - x0) * u, uy: y0 + (y1 - y0) * u}; }
function renderBall({t, cam = null, labels = false, quiet = false}) {
  const c = cam2(cam || chCam(t)), world = [];
  world.push(layerAt(c, 0.3, `<rect x="-3000" y="560" width="9000" height="3000" fill="#1C3332"/>` + stThomas(1700, 900, '#1C3332') + brownstones(-1400, -200, 380, 0.6, t, 7).replace(/#1C3332/g, '#1C3332')));
  world.push(layerAt(c, 1, `<rect x="-3000" y="${CH.fl.g}" width="9000" height="3000" fill="#0A1110"/><rect x="-3000" y="${CH.fl.g}" width="${3000 + CH.x0 - 14}" height="8" fill="#2B4744"/><rect x="${CH.x1 + 14}" y="${CH.fl.g}" width="4000" height="8" fill="#2B4744"/>` +
    brougham(CH.x1 + 380, CH.fl.g, 62, MS.ink, 100, 0, 1, 0, t) + gasLamp(CH.x1 + 120, CH.fl.g, 160, 1, t) + gasLamp(CH.x0 - 260, CH.fl.g, 160, 1, t) + chouse(t) + cpeople(t, c.z)));
  const scr = [tag(40, 1040, 'THE BALL · 660 FIFTH AVENUE · MARCH 26, 1883', 1)];
  if (labels) scr.push(chLabels(c));
  else {
    if (t > 1.2 && t < 8.5) scr.push(penS(60, 150, 'upstairs: 1,200 guests', 32, -3, EX.orange));
    if (t > 11 && t < 16) scr.push(penS(1100, 150, 'downstairs: the kitchen', 34, -3, EX.orange), tag(1180, 230, 'COMPOSITE CHARACTER', smooth(11.5, 12, t)));
  }
  if (quiet) scr.length = 0;
  return frame(msDefs(t), `<rect width="1920" height="1080" fill="url(#msnight)"/>`, world.join(''), scr.join(''), t);
}

/* ---------- clips ---------- */
Object.assign(CLIPS, {
  fifth_night: {sec: 10, render: (t) => renderFifth({t, cam: {z: 1.2, ux: 1250 + t * 85, uy: 560}})},
  ball_cutaway: {sec: 16, render: (t) => renderBall({t})},
  fifth_dawn: {sec: 9, render: (t) => renderFifth({t, dawn: 0.65 + 0.03 * t, cam: (() => { const u = ease(t / 9); return {z: lerpLog(0.72, 1.75, u), ux: 1950 - 170 * u, uy: 330 + 340 * u}; })()})},
});
if (typeof window !== 'undefined') Object.assign(window, {renderFifth, renderBall});

/* ---------- s5: a Sunday ballgame, mid-1880s (American Association: cheap seats, beer) ---------- */
// A side view down the first-base line: a wooden grandstand with a roof on posts and bunting, open bleachers, a board fence, the
// field. Michael and his sister (coral) sit in the 25-cent bleachers; a vendor sells beer. The pitch, the swing, the ball, the crowd up.
function renderBallpark({t, cam, quiet = false}) {
  const c = cam2(cam), GF = 820, s = [], r = rng(1884), hit = 3.0, ballT = t - hit;
  const crowdUp = smooth(hit + 0.2, hit + 0.6, t) * (1 - smooth(hit + 3.4, hit + 4.4, t));
  // far: trees, city roofs, a factory chimney
  const far = `<rect x="-2000" y="${GF - 120}" width="8000" height="400" fill="#4E726C"/>` + MAT.trees([[-2000, GF - 120], [6000, GF - 130]], {col: '#4E726C', seed: 3, size: 40}) +
    `<rect x="2600" y="${GF - 330}" width="40" height="220" fill="#4E726C"/>` + MAT.smoke(2620, GF - 334, t, {col: '5F857F', k: 0.8, seed: 2});
  s.push(layerAt(c, 0.4, far));
  const m = [];
  m.push(`<rect x="-3000" y="${GF}" width="9000" height="600" fill="#2B4744"/>` + MAT.ground(-3000, 6000, GF, {base: '#2B4744', seed: 9}));
  // the grandstand (left): tiers of plank seats rising back, roof on posts, bunting under the eave, flags on poles
  const g0 = -300, g1 = 1100;
  m.push(MAT.planks(g0, GF - 360, g1 - g0, 360, {base: '#1C3332', seed: 4, size: 18}));
  for (let k = 0; k < 9; k++) m.push(`<rect x="${g0}" y="${GF - 40 - k * 36}" width="${g1 - g0}" height="6" fill="#0D0C09"/>`);
  m.push(`<path d="M${g0 - 40},${GF - 400} L${g1 + 40},${GF - 400} L${g1 + 10},${GF - 380} L${g0 - 10},${GF - 380} Z" fill="#0D0C09"/><path d="M${g0 - 40},${GF - 400} L${g0 + 300},${GF - 470} L${g1 - 300},${GF - 470} L${g1 + 40},${GF - 400} Z" fill="#132423"/>`);
  for (let x = g0; x <= g1; x += 175) m.push(`<rect x="${x}" y="${GF - 380}" width="8" height="380" fill="#0D0C09"/>`);
  let bun = ''; for (let x = g0 - 30; x < g1 + 30; x += 70) bun += `q35,26 70,0 `; m.push(`<path d="M${g0 - 30},${GF - 378} ${bun}" stroke="#DFE0D6" stroke-width="5" fill="none" opacity="0.7"/>`);
  for (const fx of [g0 + 100, g0 + 700]) m.push(`<rect x="${fx}" y="${GF - 600}" width="5" height="140" fill="#0D0C09"/>` + flag(fx + 5, GF - 598, 70, 36, '#DFE0D6', t, fx));
  // the bleachers (right): open plank tiers, no roof (the cheap seats)
  const b0 = 1200, b1 = 2500;
  for (let k = 0; k < 6; k++) m.push(`<rect x="${b0 + k * 30}" y="${GF - 40 - k * 32}" width="${b1 - b0 - k * 60}" height="8" fill="#0D0C09"/>`);
  m.push(`<path d="M${b0},${GF} L${b0 + 180},${GF - 232} L${b1 - 180},${GF - 232} L${b1},${GF} Z" fill="#132423"/>`);
  for (let k = 0; k < 6; k++) m.push(`<rect x="${b0 + k * 30}" y="${GF - 40 - k * 32}" width="${b1 - b0 - k * 60}" height="6" fill="#0D0C09"/>`);
  // the crowd: rows of seated men in bowlers and caps, a few women; they jump up on the hit
  const seat = (x, y, i, row) => { // a varied crowd: men in bowlers, caps, boaters and toppers; women in hats, a parasol; boys
    const q = r(), kind = q > 0.86 ? 'boy' : q > 0.7 ? 'woman' : 'man', ph = r(), up = crowdUp * (0.5 + 0.5 * Math.sin(i)), hh = kind === 'boy' ? 38 : kind === 'woman' ? 47 : 52;
    const act = r(), base = act > 0.85 ? {...POSES.drink(t, ph), legs: [86, 80], shins: [6, 0]} : act > 0.75 ? {...POSES.sit(t, ph), fArm: [70, 40], tilt: 8} : act > 0.68 ? POSES.stand(t, ph) : {...POSES.sit(t, ph), tilt: 2 + 6 * r()};
    const standing = up > 0.3 || base === undefined || act > 0.68 && act <= 0.75;
    const an = up > 0.3 ? {fArm: [20 + 20 * Math.sin(t * 8 + i), 10], bArm: r() > 0.5 ? [30, 20] : [190, 200], tilt: 10, bob: 0.02 * up * Math.abs(Math.sin(t * 7 + i))} : base;
    const hat = kind === 'man' ? ['bowler', 'cap', 'bowler', 'top', 'boycap', 'bowler'][Math.floor(r() * 6)] : kind === 'boy' ? 'boycap' : 'lady';
    let fig = figure({x, y: standing ? y : y + 0.22 * hh, h: hh, d: r() > 0.12 ? 1 : -1, kind, hat, coat: r() > 0.7 ? 'vest' : 'sack', wear: kind === 'boy' ? ['knickers'] : [], fill: '#0D0C09', an, prop: act > 0.85 ? 'glass' : null});
    if (kind === 'woman' && r() > 0.6) fig += `<path d="M${f1(x - 20)},${f1(y - hh * 0.95)} Q${f1(x)},${f1(y - hh * 1.25)} ${f1(x + 20)},${f1(y - hh * 0.95)} Z" fill="#0D0C09"/>` + line([[x, y - hh * 0.95], [x + 4, y - hh * 0.6]], '#0D0C09', 2);
    return fig; };
  for (let row = 0; row < 8; row++) for (let x = g0 + 20 + (row % 2) * 30; x < g1 - 20; x += 62) m.push(seat(x + r() * 14, GF - 46 - row * 36, x + row, row));
  for (let row = 0; row < 6; row++) for (let x = b0 + 30 + row * 30; x < b1 - 30 - row * 30; x += 56) { if (row === 2 && Math.abs(x - 1700) < 70) continue; m.push(seat(x + r() * 12, GF - 46 - row * 32, x + row * 7, row)); }
  // Michael and his sister in the bleachers
  const kup = crowdUp > 0.3, kan = kup ? {fArm: [20, 10], tilt: 10} : {...POSES.sit(t, 0.1), tilt: 4};
  m.push(figure({...cast('michael', {x: 1660, y: kup ? GF - 110 : GF - 110 + 0.22 * 52, h: 52, d: 1}), det: 0, an: kan}));
  m.push(figure({...cast('sister', {x: 1712, y: kup ? GF - 110 : GF - 110 + 0.22 * 52 * 0.88, h: 52, d: 1}), hat: 'lady', wear: ['plain'], det: 0, an: kup ? {fArm: [30, 20], tilt: 10} : {...POSES.sit(t, 0.4), tilt: 2}}));
  // a beer vendor working the bleacher aisle
  const vx = 1300 + ((t * 40) % 900);
  m.push(figure({x: vx, y: GF - 10, h: 58, d: 1, kind: 'man', hat: 'cap', coat: 'jacket', fill: '#0D0C09', an: {...walkAn(walkPhase(t * 40, 58)), fArm: [60, 20]}}) + `<rect x="${vx + 20}" y="${GF - 66}" width="10" height="13" fill="#DFE0D6" opacity="0.8"/>`);
  // the fence and the field in front
  m.push(MAT.planks(-3000, GF - 6, 9000, 30, {base: '#132423', seed: 7, vertical: true, size: 16}));
  s.push(layerAt(c, 1, m.join('')));
  // the field (near layer): pitcher, batter, catcher; the ball
  const f = [], FY = 1030, px = 900, bx = 1500, pitch = smooth(1.6, 2.6, t), swing = smooth(2.8, 3.1, t);
  f.push(`<rect x="-3000" y="${FY - 60}" width="9000" height="400" fill="#335652"/><path d="M-3000,${FY - 20} L6000,${FY - 20}" stroke="#DFE0D6" stroke-width="3" opacity="0.4"/>`);
  f.push(figure({x: px, y: FY, h: 150, d: 1, kind: 'man', hat: 'boycap', coat: 'jacket', fill: '#0D0C09', wear: ['knickers'], an: {fArm: [200 - 190 * pitch, 160 - 150 * pitch], lean: 12 * pitch, legs: [10 + 20 * pitch, -10]}}));
  f.push(figure({x: bx, y: FY, h: 150, d: -1, kind: 'man', hat: 'boycap', coat: 'jacket', fill: '#0D0C09', wear: ['knickers'], an: {fArm: [40 - 140 * swing, 20 - 120 * swing], bArm: [50 - 140 * swing, 30 - 120 * swing], lean: -6 + 14 * swing}}));
  { const o = {x: bx, y: FY, h: 150, d: -1}, [hx, hy] = hand(o, [40 - 140 * swing, 20 - 120 * swing]), th = (-35 + 125 * swing) * Math.PI / 180;
    f.push(line([[hx, hy], [hx - Math.sin(th) * 95, hy - Math.cos(th) * 95]], '#0D0C09', 7)); }
  f.push(figure({x: bx + 90, y: FY + 0.22 * 140, h: 140, d: -1, kind: 'man', hat: 'boycap', coat: 'jacket', fill: '#0D0C09', wear: ['knickers'], an: {legs: [90, 70], shins: [-40, -50], fArm: [100, 80], lean: 10}}));
  let ball = null;
  if (t > 2.2 && t < hit) { const u = (t - 2.2) / (hit - 2.2); ball = [px + 40 + (bx - 60 - px - 40) * u, FY - 110 + 10 * Math.sin(u * Math.PI)]; }
  else if (t >= hit) { const u = ballT; ball = [bx - 60 - 380 * u, FY - 110 - 520 * u + 160 * u * u]; }
  if (ball) f.push(`<circle cx="${f1(ball[0])}" cy="${f1(ball[1])}" r="7" fill="#F4EFE6"/>`);
  s.push(layerAt(c, 1.25, f.join('')));
  const scr = [tag(40, 1040, 'A SUNDAY GAME · BROOKLYN · 1884', 1)];
  if (t > 4.6) scr.push(penS(1180, 140, 'sunday, cheap seats, and beer', 32, -3, EX.orange));
  if (quiet) scr.length = 0;
  return frame(msDefs(t), `<rect width="1920" height="1080" fill="url(#msday)"/>` + clouds(t), s.join(''), scr.join(''), t);
}
Object.assign(CLIPS, {ballpark: {sec: 9, render: (t) => renderBallpark({t, cam: {z: 1.0 + 0.02 * t, ux: 1000 + 30 * t, uy: 600}})}});
if (typeof window !== 'undefined') Object.assign(window, {renderBallpark});

/* ---------- s8: the Kellys' flat, Lower East Side, about 1883-84 (the contrast to the mansion) ---------- */
// One cramped room of the Kellys' third-floor flat (the same kitchen as cutaway.js), after Jacob Riis's flash photographs:
// faded, peeling wallpaper; a cast-iron coal stove with its pipe into the chimney; pots, a basket and a washtub; one small
// kerosene lamp; the only window opens on the airshaft, a brick wall an arm's length away. The mother sews piecework (shirts,
// paid by the dozen) at the table by the lamp, finished ones piled on a chair; the younger brother bastes beside her. On her
// afternoon off the sister comes in, still in her maid's dress, and puts her wages on the table. The Kellys are coral.
function renderFlat({t, cam, quiet = false}) {
  const c = cam2(cam), s = [], F = 900, H8 = 360; // floor; a grown man's height
  const fl = 0.86 + 0.08 * Math.sin(t * 7.3) + 0.06 * Math.sin(t * 17.1);
  // the walls: faded wallpaper, peeling plaster with lath, a water stain, soot above the stove, a worn wainscot
  s.push(`<rect x="-400" y="-200" width="2800" height="${F + 200}" fill="#1C3332"/><rect x="-400" y="-200" width="2800" height="${F + 200}" fill="url(#flwp)" opacity="0.16"/>`);
  for (const [x, y, w, h] of [[300, 80, 160, 120], [1180, 40, 220, 90], [1540, 330, 120, 160]]) {
    s.push(`<path d="M${x},${y} q${w * 0.3},-14 ${w * 0.6},6 q${w * 0.3},20 ${w * 0.4},${h * 0.5} q-20,${h * 0.4} -${w * 0.5},${h * 0.5} q-${w * 0.4},0 -${w * 0.5},-${h * 0.4} Z" fill="#2B4744"/>`);
    for (let k = 0; k < 5; k++) s.push(`<rect x="${x + 10}" y="${y + 14 + k * 18}" width="${w * 0.7}" height="5" fill="#24403D"/>`); }
  s.push(`<rect x="900" y="-200" width="90" height="420" fill="url(#flstain)"/><rect x="40" y="-200" width="420" height="700" fill="url(#flsoot)"/>`);
  s.push(MAT.planks(-400, F - 150, 2800, 150, {base: '#132423', seed: 81, size: 22, vertical: true}) + `<rect x="-400" y="${F - 156}" width="2800" height="8" fill="#0D0C09"/>`);
  s.push(MAT.planks(-400, F, 2800, 400, {base: '#162826', seed: 82, size: 26}) + `<rect x="-400" y="${F}" width="2800" height="120" fill="url(#matFloorShade)"/>`);
  // the airshaft window: a few feet away, a brick wall and a neighbour's window; grey light, a line of washing across the shaft
  const wx = 1250, wy = 160;
  s.push(`<rect x="${wx - 14}" y="${wy - 14}" width="268" height="388" fill="#0D0C09"/>` + MAT.brick(wx, wy, 240, 360, {base: '#2B4744', seed: 83, soot: 'bottom', bw: 30, bh: 14}));
  s.push(`<rect x="${wx}" y="${wy}" width="240" height="360" fill="url(#flshaft)"/><rect x="${wx + 80}" y="${wy + 120}" width="70" height="100" fill="#0D0C09" opacity="0.7"/><rect x="${wx + 90}" y="${wy + 130}" width="50" height="80" fill="#F4EFE6" opacity="0.18"/>`);
  s.push(line([[wx, wy + 60], [wx + 240, wy + 74]], '#0D0C09', 2) + [0, 1, 2].map((k) => `<path d="M${wx + 30 + k * 70},${wy + 64 + k * 4} l40,2 l-4,${50 + 10 * Math.sin(t * 1.3 + k)} l-34,-2 Z" fill="#4E726C"/>`).join(''));
  s.push(`<rect x="${wx + 116}" y="${wy}" width="8" height="360" fill="#0D0C09"/><rect x="${wx}" y="${wy + 176}" width="240" height="8" fill="#0D0C09"/><rect x="${wx - 24}" y="${wy + 370}" width="288" height="14" fill="#0D0C09"/>`);
  // the stove: cast iron, firebox glowing, a kettle steaming, the pipe up into the chimney breast; a coal scuttle
  const sx = 120;
  s.push(`<rect x="${sx}" y="${F - 230}" width="250" height="190" fill="#0D0C09"/><rect x="${sx - 10}" y="${F - 240}" width="270" height="16" fill="#0D0C09"/><rect x="${sx + 10}" y="${F - 40}" width="20" height="40" fill="#0D0C09"/><rect x="${sx + 220}" y="${F - 40}" width="20" height="40" fill="#0D0C09"/>`);
  s.push(`<rect x="${sx + 30}" y="${F - 180}" width="90" height="60" fill="#FFF3D6" opacity="${f1(0.45 + 0.12 * Math.sin(t * 9))}"/>` + glowC(sx + 75, F - 150, 220, 0.5 * fl, 'mswarm'));
  s.push(`<rect x="${sx + 170}" y="-200" width="34" height="${F - 240 + 200}" fill="#0D0C09"/><path d="M${sx + 30},${F - 240} q0,-46 46,-46 q46,0 46,46 Z" fill="#0D0C09"/><path d="M${sx + 118},${F - 270} l30,-14" stroke="#0D0C09" stroke-width="8"/>`);
  s.push(MAT.smoke(sx + 150, F - 290, t, {col: 'A3BAB2', k: 0.35, n: 5, rise: 140, drift: 60, seed: 84}));
  s.push(`<path d="M${sx + 300},${F} l10,-70 l70,0 l10,70 Z" fill="#0D0C09"/>`);
  // a shelf of pots, a hanging basket, a washtub and a barrel, a narrow bed with a straw tick in the corner
  s.push(`<rect x="460" y="300" width="300" height="10" fill="#0D0C09"/>` + [0, 1, 2, 3].map((k) => `<path d="M${480 + k * 70},300 l6,-${40 + (k % 2) * 16} l40,0 l6,${40 + (k % 2) * 16} Z" fill="#0D0C09"/>`).join(''));
  s.push(`<path d="M780,200 q50,90 100,0" stroke="#0D0C09" stroke-width="4" fill="none"/><path d="M770,200 q60,70 120,0 l-10,60 q-50,30 -100,0 Z" fill="#0D0C09"/>`);
  s.push(`<path d="M1580,${F} l20,-120 l140,0 l20,120 Z" fill="#0D0C09"/><rect x="1600" y="${F - 90}" width="140" height="8" fill="#24403D"/>` + `<rect x="1780" y="${F - 110}" width="300" height="20" fill="#0D0C09"/><rect x="1780" y="${F - 200}" width="12" height="200" fill="#0D0C09"/><rect x="1800" y="${F - 130}" width="270" height="22" rx="8" fill="#2B4744"/>`);
  // the table, the lamp, the work: a pile of finished shirts on a chair
  const tx = 700, ty = F - 160;
  s.push(`<rect x="${tx}" y="${ty}" width="420" height="14" fill="#0D0C09"/><rect x="${tx + 14}" y="${ty + 14}" width="12" height="146" fill="#0D0C09"/><rect x="${tx + 394}" y="${ty + 14}" width="12" height="146" fill="#0D0C09"/>`);
  s.push(glowC(tx + 210, ty - 70, 520, 0.85 * fl, 'mswarm') + glowC(tx + 210, ty - 70, 140, 0.6 * fl));
  s.push(`<path d="M${tx + 190},${ty} l8,-30 q-16,-20 12,-34 q28,14 12,34 l8,30 Z" fill="#0D0C09"/><path d="M${tx + 200},${ty - 64} q10,-40 20,0 l0,6 l-20,0 Z" fill="#F4EFE6" opacity="${f1(0.6 + 0.3 * fl)}"/><ellipse cx="${tx + 210}" cy="${ty - 72}" rx="4" ry="9" fill="#FFF3D6"/>`);
  for (let k = 0; k < 6; k++) s.push(`<path d="M${tx + 290 + k * 3},${ty - 8 - k * 9} l100,0 l4,9 l-104,0 Z" fill="#A3BAB2" opacity="0.8"/>`);
  s.push(`<rect x="1150" y="${F - 92}" width="70" height="8" fill="#0D0C09"/><rect x="1150" y="${F - 92}" width="8" height="92" fill="#0D0C09"/><rect x="1212" y="${F - 92}" width="8" height="92" fill="#0D0C09"/><rect x="1150" y="${F - 190}" width="8" height="100" fill="#0D0C09"/>` +
    [0, 1, 2, 3, 4, 5, 6].map((k) => `<path d="M1150,${F - 100 - k * 10} l72,0 l3,9 l-78,0 Z" fill="#DFE0D6" opacity="0.65"/>`).join(''));
  // the family (coral): mother sewing, younger brother basting on a stool; the sister comes in and puts her wages on the table
  const lod = lodFor(H8 * 0.9 * c.z);
  const K = (name, o) => figure({...cast(name, o), det: lod.det, rim: {c: '#FFE6C9', a: 0.55 * fl, dx: 0.008, dy: -0.004}});
  s.push(K('mother', {x: tx + 40, y: sitY(F, H8 * 0.9), h: H8, d: 1, an: {...POSES.handsew(t, 0.1), tilt: t > 6.4 ? 6 : -12, expr: t > 6.4 ? 'worried' : 'neutral', blink: t % 3.7 < 0.12}}));
  s.push(`<rect x="${tx - 10}" y="${F - 100}" width="90" height="10" fill="#0D0C09"/>`);
  s.push(K('brother', {x: tx + 420, y: sitY(F, H8 * 0.8), h: H8, d: -1, an: {...POSES.handsew(t + 0.7, 0.5), tilt: t > 6.6 ? 4 : -14}}));
  const enter = smooth(2.6, 5.6, t), six = -120 + 560 * enter, walking = t > 2.6 && t < 5.6;
  const give = smooth(5.8, 6.5, t) * (1 - smooth(7.6, 8.2, t));
  s.push(K('sister', {x: six, y: F, h: H8, d: 1, an: walking ? walkAn(walkPhase(560 * enter, H8 * 0.88)) : {...POSES.stand(t, 0.3), fArm: [165 - 75 * give, 150 - 80 * give], expr: t > 6.6 ? 'smile' : 'neutral'}}));
  if (t > 6.2) { const n = Math.min(4, Math.floor((t - 6.2) * 4)); for (let k = 0; k < n; k++) s.push(`<ellipse cx="${tx + 130 + k * 16}" cy="${ty - 3}" rx="8" ry="3" fill="#F4EFE6"/>`); }
  // the door frame, left, the dark hall beyond
  s.push(`<rect x="-120" y="120" width="170" height="${F - 120}" fill="#060A0A" opacity="${f1(0.9 - 0.3 * enter * (1 - smooth(5.6, 6.4, t)))}"/><rect x="50" y="110" width="18" height="${F - 110}" fill="#0D0C09"/>`);
  const world = layerAt(c, 1, s.join(''));
  const scr = [tag(40, 1040, 'THE KELLYS\' FLAT · BROOKLYN · 1883', 1)];
  if (t > 1 && t < 5.5) scr.push(penS(1180, 140, 'one room: kitchen, workshop, bedroom', 30, -3, EX.orange));
  if (t > 6.8) scr.push(penS(1240, 140, 'her week\'s wages', 34, -3, EX.orange), tag(1250, 220, 'COMPOSITE CHARACTERS', smooth(6.8, 7.2, t)));
  const defs = msDefs(t).replace('</defs>', `<pattern id="flwp" width="40" height="56" patternUnits="userSpaceOnUse"><path d="M20,6 q10,10 0,20 q-10,10 0,20" stroke="#DFE0D6" stroke-width="2" fill="none"/><circle cx="4" cy="28" r="3" fill="#DFE0D6"/></pattern>` +
    `<linearGradient id="flstain" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050A09" stop-opacity="0.55"/><stop offset="1" stop-color="#050A09" stop-opacity="0"/></linearGradient>` +
    `<radialGradient id="flsoot" cx="0.5" cy="0.2" r="0.6"><stop offset="0" stop-color="#030606" stop-opacity="0.6"/><stop offset="1" stop-color="#030606" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="flshaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A3BAB2" stop-opacity="0.45"/><stop offset="0.5" stop-color="#5F857F" stop-opacity="0.2"/><stop offset="1" stop-color="#000" stop-opacity="0.5"/></linearGradient></defs>`);
  if (quiet) scr.length = 0;
  return frame(defs, `<rect width="1920" height="1080" fill="#0B1414"/>`, world, scr.join(''), t);
}
Object.assign(CLIPS, {kelly_flat: {sec: 9, render: (t) => renderFlat({t, cam: (() => { const u = ease(t / 9); return {z: lerpLog(0.86, 1.06, u), ux: 960 - 40 * u, uy: 540 + 40 * u}; })()})}});
if (typeof window !== 'undefined') Object.assign(window, {renderFlat});
