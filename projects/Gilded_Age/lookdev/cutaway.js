// The tenement cutaway: a six-storey Lower East Side tenement, about 1883, cut through from the street (left) to the back yard
// (right), so every room shows at once. Built with rig.js (load rig.js first). Scale: 13 px to the foot at zoom 1.
//
// Floors, top to bottom: the roof (laundry, children, chimneys); five floors of flats, each a "railroad" flat at the front and one
// at the back, three rooms in a row with a window only at the end (the middle room has none, which is why reformers called them
// dark rooms); a saloon at street level; a cellar with a cobbler and lodgers. The stair hall runs up the middle, dark. Out back: the
// shared privies, a yard hydrant and laundry lines on pulleys. Sources for the arrangement: Jacob Riis, How the Other Half Lives
// (1890), and the floor plans of pre-1879 railroad tenements.
//
// The Kellys live at the front of the third floor (coral); the Jewish neighbour family runs a home garment shop on the floor above.
//
// Round 6 (Nov 7, 2026): the building is a "dumbbell" tenement, the kind built after the 1879 Tenement House Act, which said every
// room needed a window. Builders met the law with an airshaft about 2 1/2 feet wide down the middle of the building: the middle rooms'
// only window opened onto it. Tenants threw garbage down it, it trapped stale air, and it carried fire from floor to floor.
// Light is kerosene lamps and candles (the halls were dark; electricity was for businesses and the rich). The rooms are worn:
// faded wallpaper, peeling plaster and lath, water stains, cracks, soot and grime. The city stands behind it, in two layers that
// move at their own depth when the camera pushes in.

const CW = {
  sky: [['0', '#111B1B'], ['0.55', '#1C3332'], ['1', '#5F857F']],
  poche: '#060606', room: '#172A28', roomLit: '#24403D', dark: '#08100F', hall: '#0B1312', cellar: '#0E1918',
  furn: '#0C1716', ink: '#0D0C09', lamp: '#F4EFE6', earth: '#0A1110', rear: '#16292A', winSky: '#5F857F', accent: '#FF6F61',
  rim: {c: '#DFE0D6', a: 0.75, dx: -0.008, dy: -0.004},
};
const FL = {0: 1010, 1: 900, 2: 744, 3: 614, 4: 484, 5: 354, 6: 224, 7: 94}; // floor surfaces (0 = cellar, 7 = roof)
const XS = {front: 200, frontIn: 214, f1: 370, f2: 474, sh0: 474, sh1: 506, hall0: 604, hall1: 708, r2: 838, r1: 942, backIn: 1122, back: 1136, rearT: 1520};
const MAN = 75; // a grown man's height at zoom 1
const ceil = (n) => FL[n + 1] + 10;
const sitY = (fy, h) => fy + 0.22 * h; // where to put a sitting figure's feet so the seat lands on a chair

/* ---------- furniture and fittings ---------- */
const FU = {
  stove(x, fy, t) { // a cast-iron cook stove with a pipe into the wall, a kettle steaming
    const c = CW.furn, s = [];
    s.push(`<rect x="${x}" y="${fy - 30}" width="28" height="24" fill="${c}"/><rect x="${x - 2}" y="${fy - 32}" width="32" height="4" fill="${c}"/>`);
    for (const lx of [x + 2, x + 24]) s.push(`<rect x="${lx}" y="${fy - 7}" width="3" height="7" fill="${c}"/>`);
    s.push(`<rect x="${x + 20}" y="${ceil(3) + 6}" width="5" height="${fy - 32 - ceil(3) - 6}" fill="${c}"/>`);
    s.push(`<path d="M${x + 4},${fy - 32} q0,-8 7,-8 q7,0 7,8 Z" fill="${c}"/><rect x="${x + 16}" y="${fy - 39}" width="5" height="2" fill="${c}"/>`);
    s.push(`<rect x="${x + 5}" y="${fy - 22}" width="14" height="8" fill="#F4EFE6" opacity="${f1(0.35 + 0.1 * Math.sin(t * 7))}"/>`); // firebox glow
    for (let i = 0; i < 4; i++) { const p = (t * 0.45 + i / 4) % 1; s.push(`<circle cx="${f1(x + 21 + p * 6 + Math.sin(p * 6 + i) * 2)}" cy="${f1(fy - 40 - p * 22)}" r="${f1(1.5 + p * 4)}" fill="#DFE0D6" opacity="${f1(0.35 * (1 - p))}"/>`); }
    return s.join('');
  },
  table(x, fy, w = 44) { const c = CW.furn; return `<rect x="${x}" y="${fy - 31}" width="${w}" height="4" fill="${c}"/><rect x="${x + 3}" y="${fy - 28}" width="3" height="28" fill="${c}"/><rect x="${x + w - 6}" y="${fy - 28}" width="3" height="28" fill="${c}"/>`; },
  chair(x, fy, d = 1) { const c = CW.furn, bx = d > 0 ? x - 8 : x + 6; return `<rect x="${x - 8}" y="${fy - 20}" width="16" height="3" fill="${c}"/><rect x="${bx}" y="${fy - 40}" width="2.5" height="40" fill="${c}"/><rect x="${d > 0 ? x + 5 : x - 8}" y="${fy - 18}" width="2.5" height="18" fill="${c}"/>`; },
  bed(x, fy, w = 76) { const c = CW.furn; return `<rect x="${x}" y="${fy - 22}" width="${w}" height="10" fill="${c}"/><rect x="${x}" y="${fy - 40}" width="4" height="40" fill="${c}"/><rect x="${x + w - 4}" y="${fy - 30}" width="4" height="30" fill="${c}"/><rect x="${x + 4}" y="${fy - 26}" width="16" height="5" rx="2" fill="#1B2D2B"/>`; },
  cradle(x, fy, t) { const c = CW.furn, a = 8 * Math.sin(TAU * t * 0.5); return `<g transform="rotate(${f1(a)}, ${x + 14}, ${fy})"><path d="M${x},${fy - 6} Q${x + 14},${fy + 4} ${x + 28},${fy - 6} L${x + 26},${fy - 20} L${x + 2},${fy - 20} Z" fill="${c}"/></g>`; },
  machine(x, fy, t) { // a treadle sewing machine: table, treadle, the machine head, a turning wheel
    const c = CW.furn, a = t * 9;
    return `<rect x="${x}" y="${fy - 30}" width="36" height="3" fill="${c}"/><rect x="${x + 2}" y="${fy - 27}" width="3" height="27" fill="${c}"/><rect x="${x + 31}" y="${fy - 27}" width="3" height="27" fill="${c}"/>` +
      `<path d="M${x + 8},${fy - 30} L${x + 8},${fy - 42} L${x + 28},${fy - 42} L${x + 28},${fy - 36} L${x + 14},${fy - 36} L${x + 14},${fy - 30} Z" fill="${c}"/>` +
      `<circle cx="${x + 18}" cy="${fy - 14}" r="7" fill="none" stroke="${c}" stroke-width="2"/><line x1="${x + 18}" y1="${fy - 14}" x2="${f1(x + 18 + 7 * Math.cos(a))}" y2="${f1(fy - 14 + 7 * Math.sin(a))}" stroke="${c}" stroke-width="1.5"/>` +
      `<rect x="${x + 8}" y="${f1(fy - 4 - 2 * Math.sin(a))}" width="18" height="2.5" fill="${c}"/>`;
  },
  pressTable(x, fy, w = 50) { const c = CW.furn; return `<rect x="${x}" y="${fy - 30}" width="${w}" height="5" fill="${c}"/><rect x="${x + 4}" y="${fy - 25}" width="3" height="25" fill="${c}"/><rect x="${x + w - 7}" y="${fy - 25}" width="3" height="25" fill="${c}"/>`; },
  garments(x, fy, w = 40) { const c = '#162826'; return `<path d="M${x},${fy} Q${x + 4},${fy - 22} ${x + w * 0.5},${fy - 26} Q${x + w - 4},${fy - 20} ${x + w},${fy} Z" fill="${c}"/>`; },
  bar(x0, x1, fy) { // a saloon bar: counter, foot rail, shelves of bottles behind
    const c = CW.furn, s = [];
    s.push(`<rect x="${x0}" y="${fy - 36}" width="${x1 - x0}" height="36" fill="${c}"/><rect x="${x0 - 3}" y="${fy - 38}" width="${x1 - x0 + 6}" height="4" fill="${c}"/>`);
    for (const y of [fy - 92, fy - 70]) { s.push(`<rect x="${x1 + 6}" y="${y}" width="36" height="3" fill="${c}"/>`); for (let bx = x1 + 8; bx < x1 + 40; bx += 6) s.push(`<rect x="${bx}" y="${y - 10}" width="3" height="10" rx="1" fill="${c}"/>`); }
    return s.join('');
  },
  barrel(x, fy, w = 22, hgt = 28) { const c = CW.furn; return `<rect x="${x}" y="${fy - hgt}" width="${w}" height="${hgt}" rx="${w * 0.3}" fill="${c}"/><rect x="${x}" y="${fy - hgt * 0.7}" width="${w}" height="2" fill="#000" opacity="0.3"/>`; },
  bench(x, fy, w = 50) { const c = CW.furn; return `<rect x="${x}" y="${fy - 26}" width="${w}" height="4" fill="${c}"/><rect x="${x + 3}" y="${fy - 22}" width="3" height="22" fill="${c}"/><rect x="${x + w - 6}" y="${fy - 22}" width="3" height="22" fill="${c}"/>`; },
  coal(x, fy, w = 80) { return `<path d="M${x},${fy} Q${x + 12},${fy - 30} ${x + w * 0.45},${fy - 34} Q${x + w * 0.8},${fy - 28} ${x + w},${fy} Z" fill="#070C0C"/>`; },
  tub(x, fy) { const c = CW.furn; return `<path d="M${x},${fy - 22} L${x + 30},${fy - 22} L${x + 26},${fy} L${x + 4},${fy} Z" fill="${c}"/>`; },
  shelf(x, y, w = 34) { const c = CW.furn; let s = `<rect x="${x}" y="${y}" width="${w}" height="2.5" fill="${c}"/>`; for (let i = 0; i < 4; i++) s += `<circle cx="${x + 5 + i * 8}" cy="${y - 4}" r="3.5" fill="${c}"/>`; return s; },
  frame(x, y) { return `<rect x="${x}" y="${y}" width="16" height="20" fill="none" stroke="${CW.furn}" stroke-width="2"/>`; },
  lampObj(x, y) { return `<path d="M${x - 4},${y} L${x + 4},${y} L${x + 3},${y - 9} L${x - 3},${y - 9} Z" fill="${CW.lamp}" opacity="0.85"/><rect x="${x - 5}" y="${y}" width="10" height="3" fill="${CW.furn}"/>`; },
  // a small kerosene lamp: a foot, an oil font, a glass chimney, a flame
  kerosene(x, y, t) { const fl = 1 + 0.12 * Math.sin(t * 13 + x) * Math.sin(t * 5 + x * 0.3), c = CW.furn;
    return `<rect x="${x - 4}" y="${y - 2}" width="8" height="2" fill="${c}"/><rect x="${x - 1}" y="${y - 6}" width="2" height="4" fill="${c}"/><ellipse cx="${x}" cy="${y - 8}" rx="4" ry="3" fill="${c}"/>` +
      `<path d="M${x - 2},${y - 10} Q${x - 3.5},${y - 14} ${x - 1.5},${y - 18} L${x + 1.5},${y - 18} Q${x + 3.5},${y - 14} ${x + 2},${y - 10} Z" fill="${CW.lamp}" opacity="0.28"/>` +
      `<ellipse cx="${x}" cy="${f1(y - 13)}" rx="1.3" ry="${f1(2.6 * fl)}" fill="${CW.lamp}"/>`; },
  // a candle in a saucer, flickering
  candle(x, y, t) { const fl = 1 + 0.25 * Math.sin(t * 17 + x) * Math.sin(t * 7.3 + x * 0.7), sw = 0.6 * Math.sin(t * 9 + x);
    return `<ellipse cx="${x}" cy="${y - 1}" rx="5" ry="1.5" fill="${CW.furn}"/><rect x="${x - 1.3}" y="${y - 9}" width="2.6" height="8" fill="#DFE0D6" opacity="0.8"/>` +
      `<ellipse cx="${f1(x + sw)}" cy="${f1(y - 11)}" rx="1.1" ry="${f1(2.2 * fl)}" fill="${CW.lamp}"/>`; },
  hanging(x, y, top, t) { const c = CW.furn; return `<line x1="${x}" y1="${top}" x2="${x}" y2="${y - 14}" stroke="${c}" stroke-width="1.2"/><path d="M${x - 6},${y - 14} L${x + 6},${y - 14} L${x + 3},${y - 8} L${x - 3},${y - 8} Z" fill="${c}"/>` + FU.kerosene(x, y, t); },
};

/* ---------- the building ---------- */
// rooms: [floor, x0, x1, kind]  kind: lit | dark | hall | cellar
function rooms() {
  const r = [];
  for (let n = 2; n <= 6; n++) r.push([n, XS.frontIn, XS.f1, 'lit'], [n, XS.f1, XS.sh0, 'dark'], [n, XS.sh1, XS.hall0, 'lit'], [n, XS.hall0, XS.hall1, 'hall'], [n, XS.hall1, XS.r2, 'lit'], [n, XS.r2, XS.r1, 'dark'], [n, XS.r1, XS.backIn, 'lit']);
  r.push([1, XS.frontIn, XS.sh0, 'lit'], [1, XS.sh1, XS.hall0, 'lit'], [1, XS.hall0, XS.hall1, 'hall'], [1, XS.hall1, XS.backIn, 'lit']);
  r.push([0, XS.frontIn, XS.hall0, 'cellar'], [0, XS.hall0, XS.hall1, 'hall'], [0, XS.hall1, XS.backIn, 'cellar']);
  return r;
}
const roomTop = (n) => (n === 0 ? FL[1] + 10 : ceil(n));
// lights: [floor, x, height of the lamp's foot above the floor, room x0, kind]. Each lights only its own room, dimly.
const LIGHTS = [
  [3, 236, 31, XS.frontIn, 'candle'], [3, 584, 31, XS.sh1, 'lamp'],                        // the Kellys: a candle by the window, a lamp on the kitchen table
  [4, 240, 30, XS.frontIn, 'lamp'], [4, 336, 46, XS.frontIn, 'candle'], [4, 530, 30, XS.sh1, 'lamp'], // the garment shop works late
  [5, 279, 31, XS.frontIn, 'lamp'], [5, 1000, 34, XS.r1, 'candle'],
  [6, 236, 32, XS.frontIn, 'candle'], [6, 1062, 34, XS.r1, 'lamp'],
  [2, 281, 31, XS.frontIn, 'lamp'], [2, 760, 34, XS.hall1, 'candle'], [3, 1022, 31, XS.r1, 'lamp'], [4, 1034, 34, XS.r1, 'candle'],
  [1, 300, 96, XS.frontIn, 'hang'], [1, 420, 96, XS.frontIn, 'hang'], [1, 900, 34, XS.hall1, 'lamp'],
  [0, 336, 26, XS.frontIn, 'candle'],
];
const lightY = ([n, x, dy]) => FL[n] - dy;

function building(t) {
  const s = [], R = rooms(), clips = [];
  R.forEach(([n, x0, x1, kind]) => {
    const y0 = roomTop(n), y1 = FL[n], id = `rm${n}_${x0}`;
    clips.push(`<clipPath id="${id}"><rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}"/></clipPath>`);
    s.push(`<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${kind === 'dark' ? CW.dark : kind === 'hall' ? CW.hall : kind === 'cellar' ? CW.cellar : CW.room}"/>`);
    s.push(`<g clip-path="url(#${id})">${wear(n, x0, x1, kind)}</g>`);
  });
  // lamp and candle light, small and dim, each inside its own room; the walls take a little soot above each flame
  for (const L of LIGHTS) {
    const [n, x, , rx0, kind] = L, y = lightY(L) - 12;
    const fl = kind === 'candle' ? 0.8 + 0.2 * Math.sin(t * 11 + x) * Math.sin(t * 4.7 + n) : 0.9 + 0.1 * Math.sin(t * 6 + x * 0.1);
    const r = kind === 'candle' ? 46 : kind === 'hang' ? 80 : 64;
    s.push(`<g clip-path="url(#rm${n}_${rx0})"><circle cx="${x}" cy="${y}" r="${r}" fill="url(#flame)" opacity="${f1(fl * (kind === 'candle' ? 0.75 : 0.95) * 100) / 100}"/>` +
      `<ellipse cx="${x}" cy="${roomTop(n) + 6}" rx="${r * 0.4}" ry="10" fill="#050A0A" opacity="0.35"/></g>`);
  }
  return {defs: clips.join(''), body: s.join('')};
}

// Wear and tear inside one room: faded wallpaper, peeled plaster showing the lath, water stains running down from the ceiling,
// cracks, soot along the ceiling, grime along the floor, worn floorboards. Seeded, so every room is different and stays the same.
function wear(n, x0, x1, kind) {
  const r = rng(n * 977 + x0), s = [], y0 = roomTop(n), y1 = FL[n], w = x1 - x0, hgt = y1 - y0;
  if (kind === 'lit' || kind === 'dark') s.push(`<rect x="${x0}" y="${y0}" width="${w}" height="${hgt}" fill="url(#wp${Math.floor(r() * 3)})" opacity="${kind === 'dark' ? 0.08 : 0.14}"/>`);
  if (kind === 'cellar' || kind === 'hall') s.push(`<rect x="${x0}" y="${y0}" width="${w}" height="${hgt}" fill="url(#brick)" opacity="0.18"/>`);
  for (let i = 0; i < 2 + Math.floor(r() * 3); i++) { // peeled plaster, some showing lath
    const px = x0 + 6 + r() * (w - 30), py = y0 + 8 + r() * (hgt * 0.6), pw = 10 + r() * 22, ph = 8 + r() * 16, pts2 = [];
    for (let k = 0; k < 9; k++) { const a = k / 9 * TAU, rr = 0.7 + r() * 0.5; pts2.push([px + pw / 2 + Math.cos(a) * pw / 2 * rr, py + ph / 2 + Math.sin(a) * ph / 2 * rr]); }
    s.push(poly(pts2, '#26403C', 'opacity="0.55" stroke="#0A1413" stroke-width="0.8"'));
    if (r() < 0.45) for (let ly = py + 3; ly < py + ph - 1; ly += 3) s.push(`<line x1="${f1(px + 2)}" y1="${f1(ly)}" x2="${f1(px + pw - 2)}" y2="${f1(ly)}" stroke="#0C1716" stroke-width="1" opacity="0.7"/>`);
  }
  for (let i = 0; i < 1 + Math.floor(r() * 2); i++) { // water stains from the ceiling
    const sx = x0 + 6 + r() * (w - 16), sw = 6 + r() * 14, sl = 20 + r() * (hgt * 0.5);
    s.push(`<rect x="${f1(sx)}" y="${y0}" width="${f1(sw)}" height="${f1(sl)}" fill="url(#stain)" opacity="0.6"/>`);
  }
  for (let i = 0; i < 1 + Math.floor(r() * 2); i++) { // cracks
    let cx = x0 + 10 + r() * (w - 20), cy = y0 + 4 + r() * 20; const a = [[cx, cy]];
    for (let k = 0; k < 5; k++) { cx += (r() - 0.5) * 10; cy += 5 + r() * 7; a.push([cx, cy]); }
    s.push(line(a, '#070D0D', 0.8, 'opacity="0.8"'));
  }
  s.push(`<rect x="${x0}" y="${y0}" width="${w}" height="12" fill="url(#soot)"/><rect x="${x0}" y="${y1 - 24}" width="${w}" height="24" fill="url(#grime)"/>`);
  s.push(`<rect x="${x0}" y="${y1 - 3}" width="${w}" height="3" fill="#101C1B"/>`);
  for (let bx = x0 + r() * 18; bx < x1; bx += 14 + r() * 16) s.push(`<rect x="${f1(bx)}" y="${y1 - 3}" width="1" height="3" fill="#050909"/>`);
  return s.join('');
}

// The airshaft: about 2 1/2 feet wide, open to the sky, down the middle of the building. Garbage at the bottom, laundry strung
// across it, stale air that hangs there instead of leaving.
function airshaft(t) {
  const s = [], x0 = XS.sh0, x1 = XS.sh1, top = FL[7] - 10, bot = FL[1];
  s.push(`<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${bot - top}" fill="url(#shaftlight)"/>`);
  s.push(`<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${bot - top}" fill="url(#brick)" opacity="0.25"/>`);
  const r = rng(717);
  for (let i = 0; i < 26; i++) { const gx = x0 + 2 + r() * (x1 - x0 - 6), gy = bot - r() * 18 * (1 - Math.abs(gx - (x0 + x1) / 2) / 20); s.push(`<rect x="${f1(gx)}" y="${f1(gy)}" width="${f1(3 + r() * 6)}" height="${f1(2 + r() * 4)}" fill="${r() < 0.2 ? '#2C4542' : '#050909'}" transform="rotate(${f1(r() * 60 - 30)}, ${f1(gx)}, ${f1(gy)})"/>`); }
  s.push(`<path d="M${x0},${bot} Q${(x0 + x1) / 2},${bot - 22} ${x1},${bot} Z" fill="#040808"/>`);
  for (const n of [3, 5]) { // laundry strung across the shaft
    const y = FL[n] - 70; s.push(`<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y + 3}" stroke="#0A1312" stroke-width="0.8"/>`);
    for (let k = 0; k < 3; k++) s.push(`<rect x="${x0 + 4 + k * 9}" y="${y + 1}" width="6" height="${10 + k * 2}" fill="#DFE0D6" opacity="0.18" transform="rotate(${f1(2 * Math.sin(t + k + n))}, ${x0 + 7 + k * 9}, ${y + 1})"/>`);
  }
  for (let i = 0; i < 9; i++) { // stale air: haze that rises a little, then sinks back and hangs
    const ph = r(), cy = bot - 60 - r() * 600 + 14 * Math.sin(TAU * (t / 7 + ph)), cx = (x0 + x1) / 2 + 6 * Math.sin(TAU * (t / 5 + ph * 2));
    s.push(`<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(10 + r() * 8)}" ry="${f1(18 + r() * 20)}" fill="#5F857F" opacity="${f1(0.07 + 0.05 * r())}" filter="url(#soft)"/>`);
  }
  return s.join('');
}

// Fire escapes on the front and back walls (the 1867 and 1879 tenement laws required them).
function fireEscapes() {
  const s = [], c = '#0A1211';
  for (const [x0, w] of [[XS.front - 36, 36], [XS.back, 36]]) for (let n = 2; n <= 6; n++) {
    const y = FL[n] + 2;
    s.push(`<rect x="${x0}" y="${y}" width="${w}" height="3" fill="${c}"/><rect x="${x0}" y="${y - 20}" width="${w}" height="2" fill="${c}"/>`);
    for (let bx = x0; bx <= x0 + w; bx += 5) s.push(`<rect x="${bx}" y="${y - 20}" width="1.2" height="20" fill="${c}"/>`);
    if (n > 2) s.push(line([[x0 + (x0 < XS.front ? 6 : w - 6), y], [x0 + (x0 < XS.front ? w - 8 : 8), FL[n - 1] + 2]], c, 2));
  }
  return s.join('');
}

// The city behind the building, in two layers. Each moves at its own depth: `p` of the camera's pan and push.
function cityLayer(t, p, far) {
  const r = rng(far ? 881 : 882), s = [], base = FL[1] + 2, col = far ? '#2F4E4A' : '#1A302E';
  for (let x = -1800; x < 3800;) {
    const w = 60 + r() * 130, h = far ? 360 + r() * 380 : 280 + r() * 330;
    s.push(`<rect x="${f1(x)}" y="${f1(base - h)}" width="${f1(w)}" height="${f1(h)}" fill="${col}"/><rect x="${f1(x - 3)}" y="${f1(base - h - 6)}" width="${f1(w + 6)}" height="6" fill="${col}"/>`);
    for (let k = 0; k < 2; k++) if (r() < 0.7) s.push(`<rect x="${f1(x + 8 + r() * (w - 20))}" y="${f1(base - h - 22)}" width="9" height="18" fill="${col}"/>`);
    if (!far) for (let wy = base - h + 20; wy < base - 30; wy += 34) for (let wx = x + 10; wx < x + w - 14; wx += 24) if (r() < 0.07) s.push(`<rect x="${f1(wx)}" y="${f1(wy)}" width="8" height="13" fill="#F4EFE6" opacity="0.35"/>`);
    x += w + (r() < 0.15 ? 14 : 0);
  }
  if (far) {
    for (const [x, sp] of [[-500, 200], [820, 230], [2500, 210]]) s.push(steeple(x, base - 420, 30, 140, sp, col));
    for (const x of [300, 1650, 2950]) { // factory chimneys, smoking
      s.push(`<rect x="${x}" y="${base - 900}" width="34" height="900" fill="${col}"/>`);
      for (let i = 0; i < 6; i++) { const q = ((t / 8 + i / 6) % 1); s.push(`<circle cx="${f1(x + 17 + q * 160)}" cy="${f1(base - 920 - q * 120)}" r="${f1(16 + q * 50)}" fill="${col}" opacity="${f1(0.55 * (1 - q))}" filter="url(#soft)"/>`); }
    }
    // a Brooklyn Bridge tower far off to the right, its cables sweeping away
    const bx = 1580, by = base - 800;
    s.push(`<mask id="bmask"><rect x="0" y="-2000" width="4000" height="4000" fill="white"/><path d="M${bx + 14},${by + 420} V${by + 150} A28,28 0 0 1 ${bx + 28},${by + 126} A28,28 0 0 1 ${bx + 42},${by + 150} V${by + 420} Z M${bx + 58},${by + 420} V${by + 150} A28,28 0 0 1 ${bx + 72},${by + 126} A28,28 0 0 1 ${bx + 86},${by + 150} V${by + 420} Z" fill="black"/></mask>`);
    s.push(`<g mask="url(#bmask)"><rect x="${bx}" y="${by}" width="100" height="800" fill="${col}"/></g><rect x="${bx - 6}" y="${by - 10}" width="112" height="14" fill="${col}"/>`);
    s.push(`<path d="M${bx + 96},${by + 12} Q${bx + 500},${by + 330} ${bx + 1300},${by + 380}" stroke="${col}" stroke-width="4" fill="none"/>`); // a cable, sweeping off toward Brooklyn
  }
  return s.join('');
}

function poche() { // the cut: walls, floors and the roof in solid black, with the windows and doors cut through
  const c = CW.poche, s = [];
  s.push(`<rect x="${XS.front}" y="${FL[1]}" width="${XS.back - XS.front}" height="10" fill="${c}"/>`);
  for (let n = 2; n <= 7; n++) s.push(`<rect x="${XS.front}" y="${FL[n]}" width="${XS.sh0 - XS.front}" height="10" fill="${c}"/><rect x="${XS.sh1}" y="${FL[n]}" width="${XS.back - XS.sh1}" height="10" fill="${c}"/>`);
  // the airshaft's brick walls, each floor's middle room and kitchen with one small window onto it
  for (const x of [XS.sh0 - 3, XS.sh1 - 3]) { let y = FL[7] - 12; for (let n = 6; n >= 2; n--) { const wy0 = FL[n] - 64, wy1 = FL[n] - 46; s.push(`<rect x="${x}" y="${y}" width="6" height="${wy0 - y}" fill="${c}"/>`); y = wy1; } s.push(`<rect x="${x}" y="${y}" width="6" height="${FL[1] - y}" fill="${c}"/>`); }
  s.push(`<rect x="${XS.front}" y="${FL[0]}" width="${XS.back - XS.front}" height="24" fill="${c}"/>`);
  // front and back walls, with window openings
  const wall = (x0, x1, openings) => {
    let y = FL[7] - 34;
    const segs = [...openings].sort((a, b) => a[0] - b[0]);
    for (const [a, b] of segs) { s.push(`<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${a - y}" fill="${c}"/>`); y = b; }
    s.push(`<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${FL[0] + 24 - y}" fill="${c}"/>`);
  };
  const winF = [], winB = [];
  for (let n = 2; n <= 6; n++) { winF.push([ceil(n) + 22, FL[n] - 30]); winB.push([ceil(n) + 22, FL[n] - 30]); }
  winF.push([FL[2] + 30, FL[1] - 4]); winB.push([FL[2] + 40, FL[1] - 40]); winF.push([FL[1] + 14, FL[1] + 34]); winB.push([FL[1] + 14, FL[1] + 30]);
  wall(XS.front, XS.frontIn, winF); wall(XS.backIn, XS.back, winB);
  // cornice and parapet
  s.push(`<rect x="${XS.front - 16}" y="${FL[7] - 40}" width="44" height="14" fill="${c}"/><rect x="${XS.back - 10}" y="${FL[7] - 30}" width="20" height="8" fill="${c}"/>`);
  // partitions with door openings at floor level
  const part = (x, n, w = 6, door = true) => { const y0 = roomTop(n), y1 = FL[n], dh = door ? (n === 0 ? 70 : 88) : 0; s.push(`<rect x="${x - w / 2}" y="${y0}" width="${w}" height="${y1 - y0 - dh}" fill="${c}"/>`); };
  for (let n = 2; n <= 6; n++) for (const x of [XS.f1, XS.hall0, XS.hall1, XS.r2, XS.r1]) part(x, n);
  for (const n of [0, 1]) for (const x of [XS.hall0, XS.hall1]) part(x, n);
  // chimneys through the roof
  for (const x of [540, XS.r2 + 6]) s.push(`<rect x="${x}" y="${FL[7] - 70}" width="22" height="70" fill="${c}"/><rect x="${x - 3}" y="${FL[7] - 74}" width="28" height="6" fill="${c}"/>`);
  return s.join('');
}

function windowsGlass() { // what shows through the openings: dusk sky in front, the yard's light at the back; frames and curtains
  const s = [];
  for (let n = 2; n <= 6; n++) for (const [x0, x1] of [[XS.front, XS.frontIn], [XS.backIn, XS.back]]) {
    const y0 = ceil(n) + 22, y1 = FL[n] - 30;
    s.push(`<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${CW.winSky}" opacity="0.55"/><rect x="${x0}" y="${(y0 + y1) / 2 - 1}" width="${x1 - x0}" height="2" fill="${CW.poche}"/>`);
    const cx = x0 === XS.front ? XS.frontIn : XS.backIn - 8;
    s.push(`<path d="M${cx},${y0} L${cx + 8},${y0} Q${cx + 4},${(y0 + y1) / 2} ${cx + 7},${y1 + 4} L${cx},${y1 + 4} Z" fill="#203936" opacity="0.9"/>`);
  }
  for (let n = 2; n <= 6; n++) for (const x of [XS.sh0 - 3, XS.sh1 - 3]) s.push(`<rect x="${x}" y="${FL[n] - 64}" width="6" height="18" fill="#2B4744" opacity="0.6"/><rect x="${x}" y="${FL[n] - 56}" width="6" height="1.5" fill="${CW.poche}"/>`);
  s.push(`<rect x="${XS.front}" y="${FL[2] + 30}" width="14" height="${FL[1] - 4 - FL[2] - 30}" fill="${CW.lamp}" opacity="0.35"/>`); // the saloon's lit window
  return s.join('');
}

function stairs() { // the dark stair hall: two flights a floor, switching back at a landing
  const s = [], c = '#050909';
  for (let n = 0; n <= 5; n++) {
    const yA = FL[n], yB = FL[n + 1], mid = (yA + yB) / 2 + 5;
    if (n === 0) { s.push(line([[XS.hall1 - 8, FL[1]], [XS.hall0 + 10, FL[0]]], c, 4)); continue; }
    for (const [x0, y0, x1, y1] of [[XS.hall0 + 8, yA, XS.hall1 - 10, mid], [XS.hall1 - 10, mid, XS.hall0 + 8, yB]]) {
      s.push(line([[x0, y0], [x1, y1]], c, 5));
      const nSteps = 8;
      for (let k = 0; k < nSteps; k++) { const u0 = k / nSteps, u1 = (k + 1) / nSteps; s.push(poly([[x0 + (x1 - x0) * u0, y0 + (y1 - y0) * u0], [x0 + (x1 - x0) * u0, y0 + (y1 - y0) * u1], [x0 + (x1 - x0) * u1, y0 + (y1 - y0) * u1]], c)); }
    }
    s.push(`<rect x="${XS.hall1 - 18}" y="${mid}" width="18" height="4" fill="${c}"/>`);
  }
  return s.join('');
}

function surroundings(t) { // the street, the earth, the yard with privies and a hydrant, the rear tenement, laundry on pulleys
  const s = [];
  s.push(`<rect x="-2000" y="${FL[1] + 10}" width="6000" height="1200" fill="url(#earth)"/>`);
  s.push(`<rect x="-2000" y="${FL[1]}" width="${2000 + XS.front}" height="10" fill="${CW.poche}"/><rect x="${XS.back}" y="${FL[1]}" width="3000" height="10" fill="${CW.poche}"/>`);
  // street: a gas lamp, a curb
  s.push(`<rect x="96" y="${FL[1] - 150}" width="6" height="150" fill="${CW.ink}"/><path d="M90,${FL[1] - 152} L108,${FL[1] - 152} L105,${FL[1] - 170} L93,${FL[1] - 170} Z" fill="${CW.lamp}" opacity="0.75"/><circle cx="99" cy="${FL[1] - 160}" r="60" fill="url(#lampglow)"/>`);
  s.push(`<rect x="-2000" y="${FL[1] - 4}" width="${2000 + 40}" height="4" fill="${CW.poche}"/>`);
  // the rear tenement across the yard
  const rt = XS.rearT;
  s.push(`<rect x="${rt}" y="${FL[6] + 10}" width="1000" height="${FL[1] - FL[6] - 10}" fill="${CW.rear}"/><rect x="${rt - 10}" y="${FL[6]}" width="1010" height="14" fill="${CW.poche}"/>`);
  for (let n = 1; n <= 5; n++) for (const wx of [rt + 40, rt + 120, rt + 200]) {
    const y0 = FL[n + 1] + 34, lit = ((n * 7 + wx) % 3) === 0;
    s.push(`<rect x="${wx}" y="${y0}" width="26" height="54" fill="${lit ? CW.lamp : '#0B1514'}" opacity="${lit ? 0.45 : 1}"/>`);
  }
  // privies and the hydrant
  for (const px of [1330, 1395]) s.push(`<rect x="${px}" y="${FL[1] - 64}" width="54" height="64" fill="${CW.furn}"/><path d="M${px - 4},${FL[1] - 62} L${px + 58},${FL[1] - 72} L${px + 58},${FL[1] - 64} L${px - 4},${FL[1] - 56} Z" fill="${CW.furn}"/><rect x="${px + 18}" y="${FL[1] - 52}" width="18" height="52" fill="#081110"/>`);
  s.push(`<rect x="1206" y="${FL[1] - 34}" width="8" height="34" fill="${CW.furn}"/><rect x="1200" y="${FL[1] - 36}" width="20" height="5" fill="${CW.furn}"/>`);
  // laundry lines on pulleys from the back windows to a pole across the yard
  s.push(`<rect x="1490" y="${FL[6] - 10}" width="7" height="${FL[1] - FL[6] + 10}" fill="${CW.furn}"/>`);
  for (const n of [3, 4, 5, 6]) {
    const y0 = ceil(n) + 30, y1 = FL[6] + 10 + (6 - n) * 70, a = [];
    for (let u = 0; u <= 1.001; u += 0.05) a.push([XS.back + (1490 - XS.back) * u, y0 + (y1 - y0) * u + 26 * 4 * u * (1 - u)]);
    s.push(line(a, '#0A1312', 1.5));
    for (let k = 3; k < a.length - 1; k += 3) { const sw = 2.5 * Math.sin(TAU * (t / 2) + k + n); s.push(poly([[a[k][0] - 7, a[k][1]], [a[k][0] + 7, a[k][1]], [a[k][0] + 7 + sw, a[k][1] + 16 + (k % 3) * 4], [a[k][0] - 7 + sw, a[k][1] + 18]], '#DFE0D6', 'opacity="0.2"')); }
  }
  // roof: laundry between poles, smoke from the chimneys (the Kellys' stove included)
  for (const x of [300, 700, 1000]) s.push(`<rect x="${x}" y="${FL[7] - 56}" width="4" height="56" fill="${CW.ink}"/>`);
  for (const [x0, x1] of [[300, 700], [704, 1000]]) {
    const a = []; for (let u = 0; u <= 1.001; u += 0.1) a.push([x0 + (x1 - x0) * u, FL[7] - 50 + 14 * 4 * u * (1 - u)]);
    s.push(line(a, CW.ink, 1.5));
    for (let k = 1; k < a.length - 1; k++) { const sw = 3 * Math.sin(TAU * t / 2.2 + k); s.push(poly([[a[k][0] - 9, a[k][1]], [a[k][0] + 9, a[k][1]], [a[k][0] + 9 + sw, a[k][1] + 18], [a[k][0] - 9 + sw, a[k][1] + 20]], '#DFE0D6', 'opacity="0.3"')); }
  }
  for (const x of [551, XS.r2 + 17]) for (let i = 0; i < 6; i++) { const p = ((t / 5 + i / 6) % 1); s.push(`<circle cx="${f1(x + p * 70)}" cy="${f1(FL[7] - 78 - p * 90)}" r="${f1(6 + p * 26)}" fill="#5F857F" opacity="${f1(0.4 * (1 - p))}" filter="url(#soft)"/>`); }
  return s.join('');
}

/* ---------- the people ---------- */
// Michael's way home: up the stair hall, two flights a floor, then left through the door into the kitchen.
const CLIMB = [ // t0, t1, x0, y0, x1, y1
  [0.0, 2.0, XS.hall0 + 10, FL[1], XS.hall1 - 12, (FL[1] + FL[2]) / 2 + 5],
  [2.4, 4.4, XS.hall1 - 12, (FL[1] + FL[2]) / 2 + 5, XS.hall0 + 10, FL[2]],
  [4.8, 6.8, XS.hall0 + 10, FL[2], XS.hall1 - 12, (FL[2] + FL[3]) / 2 + 5],
  [7.2, 9.0, XS.hall1 - 12, (FL[2] + FL[3]) / 2 + 5, XS.hall0 + 12, FL[3]],
  [9.2, 10.4, XS.hall0 + 12, FL[3], 607, FL[3]],
];
function michaelAt(t) {
  let seg = CLIMB[CLIMB.length - 1], u = 1, moving = false, last = null;
  for (const sg of CLIMB) { if (t < sg[0]) { seg = last || sg; u = last ? 1 : 0; break; } if (t <= sg[1]) { seg = sg; u = (t - sg[0]) / (sg[1] - sg[0]); moving = true; break; } last = sg; }
  if (t < CLIMB[0][0]) { seg = CLIMB[0]; u = 0; }
  const [t0, t1, x0, y0, x1, y1] = seg, x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u, d = x1 >= x0 ? 1 : -1;
  const dist = Math.abs(x - x0) + CLIMB.indexOf(seg) * 90;
  const an = moving ? walkAn(walkPhase(dist, MAN, 26), {stride: 26, carry: true}) : POSES.stand(t);
  if (moving && y1 !== y0) an.bob = (an.bob || 0) + 0.02 * Math.abs(Math.sin(TAU * walkPhase(dist, MAN, 26)));
  return {x, y, d, an};
}

function people(t, z) {
  const s = [], fy = FL, lit = (h) => lodFor(h * z, CW.rim.a);
  const F = (o) => { const L = lit(o.h); s.push(figure({...o, det: L.det, rim: {...CW.rim, a: L.rimA}})); };
  const C = (name, o) => { const L = lit(o.h * (CAST[name].scale ?? 1)); s.push(figure({...cast(name, o), det: L.det, rim: {...CW.rim, a: L.rimA}})); };
  const ink = CW.ink;

  for (const L of LIGHTS) { const [n, x, , , kind] = L, y = lightY(L); s.push(kind === 'candle' ? FU.candle(x, y, t) : kind === 'hang' ? FU.hanging(x, y, roomTop(n), t) : FU.kerosene(x, y, t)); }
  // roof: two children chasing between the laundry
  const kx = 520 + 160 * Math.sin(TAU * t / 6);
  F({x: kx, y: FL[7], h: MAN * 0.58, d: Math.cos(TAU * t / 6) > 0 ? 1 : -1, kind: 'boy', hat: 'boycap', fill: ink, an: walkAn(t * 2.2, {stride: 30, arm: 30})});
  F({x: kx - 40, y: FL[7], h: MAN * 0.55, d: Math.cos(TAU * t / 6) > 0 ? 1 : -1, kind: 'girl', hat: 'none', fill: ink, an: walkAn(t * 2.2 + 0.3, {stride: 30, arm: 30})});

  // sixth floor: an old man reads by the front window; at the back, a woman scrubs at a tub
  s.push(FU.chair(262, fy[6], -1)); F({x: 262, y: sitY(fy[6], MAN), h: MAN, d: -1, kind: 'man', hat: 'none', beard: true, coat: 'vest', fill: ink, prop: 'paper', an: POSES.read(t, 0.2)});
  s.push(FU.tub(1040, fy[6])); F({x: 1080, y: fy[6], h: MAN * 0.9, d: -1, kind: 'woman', hat: 'kerchief', wear: ['plain', 'apron'], fill: ink, an: POSES.iron(t, 0.4)});
  s.push(FU.bed(380, fy[6], 80));

  // fifth floor: boarders at cards in the front room; a mother rocks a cradle at the back
  s.push(FU.table(256, fy[5], 46));
  F({x: 248, y: sitY(fy[5], MAN), h: MAN, d: 1, kind: 'man', hat: 'cap', coat: 'vest', fill: ink, an: {...POSES.sit(t, 0.1), fArm: [110, 80 + 10 * Math.sin(TAU * t * 0.4)], tilt: -8}});
  F({x: 318, y: sitY(fy[5], MAN), h: MAN, d: -1, kind: 'man', hat: 'bowler', coat: 'vest', beard: true, fill: ink, an: {...POSES.sit(t, 0.6), fArm: [108, 78], tilt: -8}});
  s.push(FU.chair(248, fy[5], 1), FU.chair(318, fy[5], -1));
  s.push(FU.bed(384, fy[5], 80)); F({x: 462, y: fy[5] - 22 - 0.12 * MAN, h: MAN, d: 1, kind: 'man', hat: 'none', coat: 'vest', fill: ink, lie: true, an: POSES.sleep(t)});
  s.push(FU.cradle(990, fy[5], t)); F({x: 1050, y: sitY(fy[5], MAN * 0.9), h: MAN * 0.9, d: -1, kind: 'woman', hat: 'kerchief', wear: ['plain', 'shawl'], fill: ink, an: POSES.rock(t)});

  // fourth floor, front: the neighbour family's garment shop. The father at the machine by the window, the mother sewing by
  // hand, the boy pulling bastings, a presser at the table in the kitchen; finished work piled in the dark middle room.
  s.push(FU.machine(222, fy[4], t)); C('nfather', {x: 268, y: sitY(fy[4], MAN), h: MAN, d: -1, fill: ink, an: POSES.sew(t)});
  s.push(FU.chair(318, fy[4], -1)); C('nmother', {x: 318, y: sitY(fy[4], MAN), h: MAN, d: -1, fill: ink, prop: 'needle', an: POSES.handsew(t, 0.3)});
  C('nson', {x: 348, y: fy[4], h: MAN, d: -1, fill: ink, an: {...POSES.stand(t, 0.5), fArm: [120, 100 + 12 * Math.sin(TAU * t)], tilt: -10}});
  s.push(FU.garments(384, fy[4], 44), FU.garments(420, fy[4], 40));
  s.push(FU.pressTable(516, fy[4], 50)); F({x: 584, y: fy[4], h: MAN, d: -1, kind: 'man', hat: 'none', coat: 'vest', fill: ink, prop: 'iron', an: POSES.iron(t, 0.1)});
  F({x: 1060, y: sitY(fy[4], MAN), h: MAN, d: -1, kind: 'man', hat: 'none', beard: true, coat: 'sack', fill: ink, an: {...POSES.sit(t, 0.8), tilt: -14, blink: true}});
  s.push(FU.chair(1060, fy[4], -1));

  // third floor, front: the Kellys. The sister mends by the window; the dark middle room holds the bed; in the kitchen the mother
  // cooks and the younger brother waits at the table; Michael comes in from the hall.
  s.push(FU.frame(300, fy[3] - 92), FU.shelf(560, fy[3] - 70, 34), FU.bed(378, fy[3], 82));
  s.push(FU.chair(250, fy[3], -1)); C('sister', {x: 250, y: sitY(fy[3], MAN), h: MAN, d: -1, prop: 'needle', an: {...POSES.handsew(t, 0.1), expr: t > 11.4 ? 'smile' : 'neutral', tilt: t > 11.2 ? 0 : -14}});
  s.push(FU.stove(508, fy[3], t));
  const turned = t > 10.2;
  C('mother', {x: 547, y: fy[3], h: MAN, d: turned ? 1 : -1, prop: turned ? null : 'spoon', an: turned ? {...POSES.stand(t, 0.2), fArm: [150, 110], expr: 'smile', tilt: 4} : POSES.stir(t)});
  s.push(FU.table(574, fy[3], 26));
  s.push(FU.chair(566, fy[3], 1)); C('brother', {x: 566, y: sitY(fy[3], MAN), h: MAN, d: 1, an: {...POSES.sit(t, 0.4), fArm: [118, 88], tilt: t > 10.4 ? 10 : -6, expr: t > 10.6 ? 'smile' : 'neutral'}});
  const m = michaelAt(t), home = t > 10.6;
  C('michael', {x: m.x, y: m.y, h: MAN, d: m.d, pail: !home || t < 11.6, an: {...m.an, expr: home ? 'smile' : 'set', tilt: home ? 4 : m.an.tilt || 0, blink: (t % 3.7) < 0.12}});

  // third floor, back: a family at supper; second floor: a couple eats in front, lodgers sleep at the back
  s.push(FU.table(1000, fy[3], 44)); F({x: 990, y: sitY(fy[3], MAN), h: MAN, d: 1, kind: 'man', hat: 'none', coat: 'vest', fill: ink, prop: 'bowl', an: {...POSES.sit(t, 0.3), fArm: [110, 70 + 8 * Math.sin(TAU * t * 0.5)]}});
  F({x: 1060, y: sitY(fy[3], MAN * 0.9), h: MAN * 0.9, d: -1, kind: 'woman', hat: 'none', wear: ['plain', 'apron'], fill: ink, an: {...POSES.sit(t, 0.7), fArm: [112, 80]}});
  s.push(FU.chair(990, fy[3], 1), FU.chair(1060, fy[3], -1));
  s.push(FU.table(258, fy[2], 46)); F({x: 250, y: sitY(fy[2], MAN), h: MAN, d: 1, kind: 'man', hat: 'none', coat: 'vest', beard: true, fill: ink, an: {...POSES.sit(t, 0.5), fArm: [108, 76]}});
  F({x: 320, y: sitY(fy[2], MAN * 0.9), h: MAN * 0.9, d: -1, kind: 'woman', hat: 'none', fill: ink, an: {...POSES.sit(t, 0.2), fArm: [110, 78]}});
  s.push(FU.chair(250, fy[2], 1), FU.chair(320, fy[2], -1));
  for (const [x, dd] of [[800, 1], [900, -1]]) F({x, y: fy[2] - 2 - 0.12 * MAN, h: MAN, d: dd, kind: 'man', hat: 'none', coat: 'sack', fill: ink, lie: true, an: POSES.sleep(t)});

  // street level: the saloon. A bartender wipes a glass; men drink at the bar; barrels at the back
  s.push(FU.bar(340, 420, fy[1]));
  F({x: 444, y: fy[1], h: MAN, d: -1, kind: 'man', hat: 'none', coat: 'vest', wear: ['apron'], fill: ink, prop: 'glass', an: POSES.wipe(t)});
  for (const [x, ph, hat] of [[326, 0.1, 'bowler'], [292, 0.55, 'cap'], [256, 0.3, 'bowler']]) F({x, y: fy[1], h: MAN, d: 1, kind: 'man', hat, coat: 'sack', fill: ink, prop: 'glass', an: {...POSES.drink(t, ph), expr: 'smile'}});
  for (const x of [740, 768, 1040, 1068]) s.push(FU.barrel(x, fy[1]));
  F({x: 900, y: fy[1], h: MAN * 0.9, d: 1, kind: 'woman', hat: 'none', wear: ['plain', 'apron'], fill: ink, prop: 'spoon', an: POSES.stir(t)});

  // cellar: a cobbler at his bench by the lamp; coal, and a lodger asleep on straw
  s.push(FU.bench(310, fy[0], 50)); F({x: 290, y: sitY(fy[0], MAN), h: MAN, d: 1, kind: 'man', hat: 'none', coat: 'vest', beard: true, fill: ink, prop: 'hammer', an: POSES.hammer(t)});
  s.push(FU.coal(760, fy[0], 110)); F({x: 1030, y: fy[0] - 0.12 * MAN, h: MAN, d: 1, kind: 'man', hat: 'none', coat: 'sack', fill: ink, lie: true, an: POSES.sleep(t)});
  s.push(`<path d="M940,${fy[0]} Q980,${fy[0] - 10} 1060,${fy[0] - 6} L1060,${fy[0]} Z" fill="#1A2420"/>`);

  // the yard: a woman fills a pail at the hydrant
  F({x: 1236, y: fy[1], h: MAN * 0.9, d: -1, kind: 'woman', hat: 'kerchief', wear: ['plain', 'apron'], fill: ink, an: {...POSES.stand(t, 0.4), fArm: [150, 140], tilt: -10}, pail: true});
  // the street: a man walks past the saloon
  F({x: 20 + (t * 22) % 160, y: fy[1], h: MAN, d: 1, kind: 'man', hat: 'bowler', coat: 'sack', fill: ink, an: walkAn(walkPhase(t * 22, MAN))});
  return s.join('');
}

/* ---------- camera and assembly ---------- */
// The camera: zoom z around the world point (ux, uy), which lands at the centre of the frame.
function renderCutaway({t = 0, z = 1, ux = 960, uy = 552, labels = false}) {
  const b = building(t);
  const defs = `<defs>${grad('sky', CW.sky)}${b.defs}
    <radialGradient id="flame"><stop offset="0" stop-color="#F4EFE6" stop-opacity="0.34"/><stop offset="0.35" stop-color="#F4EFE6" stop-opacity="0.12"/><stop offset="1" stop-color="#F4EFE6" stop-opacity="0"/></radialGradient>
    <linearGradient id="shaftlight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4E726C"/><stop offset="0.25" stop-color="#1C3332"/><stop offset="1" stop-color="#040808"/></linearGradient>
    <linearGradient id="soot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#030606" stop-opacity="0.55"/><stop offset="1" stop-color="#030606" stop-opacity="0"/></linearGradient>
    <linearGradient id="grime" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#030606" stop-opacity="0"/><stop offset="1" stop-color="#030606" stop-opacity="0.5"/></linearGradient>
    <linearGradient id="stain" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050A09" stop-opacity="0.6"/><stop offset="1" stop-color="#050A09" stop-opacity="0"/></linearGradient>
    <pattern id="wp0" width="12" height="16" patternUnits="userSpaceOnUse"><rect width="2" height="16" fill="#DFE0D6"/><circle cx="7" cy="8" r="1.4" fill="#DFE0D6"/></pattern>
    <pattern id="wp1" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M7,1 L13,7 L7,13 L1,7 Z" fill="none" stroke="#DFE0D6" stroke-width="1"/></pattern>
    <pattern id="wp2" width="10" height="18" patternUnits="userSpaceOnUse"><rect width="4" height="18" fill="#DFE0D6" opacity="0.6"/><rect x="6" width="1" height="18" fill="#DFE0D6"/></pattern>
    <pattern id="brick" width="16" height="8" patternUnits="userSpaceOnUse"><rect width="16" height="8" fill="none" stroke="#000" stroke-width="0.8"/><line x1="8" y1="4" x2="8" y2="8" stroke="#000" stroke-width="0.8"/><line x1="0" y1="4" x2="16" y2="4" stroke="#000" stroke-width="0.8"/></pattern>
    <radialGradient id="lampglow"><stop offset="0" stop-color="#F4EFE6" stop-opacity="0.42"/><stop offset="0.5" stop-color="#F4EFE6" stop-opacity="0.12"/><stop offset="1" stop-color="#F4EFE6" stop-opacity="0"/></radialGradient>
    <pattern id="earth" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="18" height="18" fill="${CW.earth}"/><line x1="0" y1="0" x2="0" y2="18" stroke="#152120" stroke-width="2"/></pattern>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${Math.floor(t * 12) % 50}"/><feColorMatrix type="saturate" values="0"/></filter>
    <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.38"/></radialGradient></defs>`;
  const world = [surroundings(t), airshaft(t), b.body, windowsGlass(), stairs(), people(t, z), poche(), fireEscapes(), labels ? cutLabels() : ''].join('');
  const layer = (p, body) => { const zp = 1 + (z - 1) * p, ax = 960 + (ux - 960) * p, ay = 552 + (uy - 552) * p; return `<g transform="translate(960,540) scale(${zp.toFixed(4)}) translate(${f1(-ax)},${f1(-ay)})">${body}</g>`; };
  const city = layer(0.25, cityLayer(t, 0.25, true)) + layer(0.55, cityLayer(t, 0.55, false));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}<rect width="${W}" height="${H}" fill="url(#sky)"/>${city}` +
    `<g transform="translate(960,540) scale(${z.toFixed(4)}) translate(${f1(-ux)},${f1(-uy)})">${world}</g>` +
    `<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.12" style="mix-blend-mode:overlay"/><rect width="${W}" height="${H}" fill="url(#vig)"/></svg>`;
}

// Teaching labels for a still: teal leader lines, orange handwriting (the series' vocab style). World coordinates.
function cutLabels() {
  const pen = (x, y, txt, size = 26, rot = -3) => `<text x="${x}" y="${y}" transform="rotate(${rot}, ${x}, ${y})" font-family="Pen" font-size="${size * 1.55}" fill="#FF9F1C" stroke="#111" stroke-width="3" paint-order="stroke">${txt}</text>`;
  const lead = (a) => line(a, '#111', 6) + line(a, '#2FE0C4', 3);
  return [
    lead([[246, 585], [60, 588]]) + pen(-200, 596, 'the kellys'),
    lead([[240, 455], [110, 452]]) + pen(-200, 460, 'a garment shop'),
    lead([[236, 186], [100, 190]]) + pen(-200, 198, 'oil lamps, candles'),
    lead([[300, 862], [40, 864]]) + pen(-200, 872, 'a saloon'),
    lead([[288, 980], [130, 982]]) + pen(-200, 990, 'cellar workshop'),
    lead([[490, 160], [490, -70], [506, -82]]) + pen(512, -82, 'an airshaft 2½ feet wide: the middle rooms\' only window'),
    lead([[650, 200], [700, -24], [720, -36]]) + pen(726, -36, 'the stair hall: no light'),
    lead([[1356, 838], [1300, 772]]) + pen(1160, 764, 'privies for the rear building'),
  ].join('');
}

/* ---------- clips ---------- */
const lerpLog = (a, b, u) => Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * u);
function cutCam(t) {
  if (t < 4) return {z: 0.8 + 0.03 * t / 4, ux: 900, uy: 470};
  if (t < 8.6) { const u = ease((t - 4) / 4.6); return {z: lerpLog(0.83, 4.6, u), ux: 900 + (409 - 900) * u, uy: 470 + (556 - 470) * u}; }
  if (t < 9.6) return {z: 4.6, ux: 409, uy: 556};
  if (t < 12.2) { const u = ease((t - 9.6) / 2.6); return {z: lerpLog(4.6, 7.6, u), ux: 409 + (556 - 409) * u, uy: 556 + (560 - 556) * u}; }
  return {z: 7.6, ux: 556, uy: 560};
}
Object.assign(CLIPS, {
  // The signature shot: the whole building alive; Michael climbs the dark stairs; the camera pushes into the Kellys' flat; he
  // comes in, his mother turns from the stove, his brother and sister look up.
  cutaway_push: {sec: 14, render: (t) => renderCutaway({t, ...cutCam(t)})},
});

// The cast sheet: the recurring characters, and the pose library on a neighbour.
function renderCastSheet() {
  const s = [], L = LOOKS.dusk, base = 560, H0 = 470;
  s.push(`<rect width="${W}" height="${H}" fill="#2B4744"/><rect y="590" width="${W}" height="490" fill="#335652"/><rect y="${base}" width="${W}" height="6" fill="#0D0C09"/><rect y="1020" width="${W}" height="6" fill="#0D0C09"/>`);
  const row1 = [['michael', 'MICHAEL · 19'], ['mother', 'MOTHER'], ['sister', 'SISTER · A MAID'], ['brother', 'YOUNGER BROTHER'], ['nfather', 'NEIGHBOUR · FATHER'], ['nmother', 'NEIGHBOUR · MOTHER'], ['nson', 'SON'], ['ndaughter', 'DAUGHTER']];
  row1.forEach(([name, label], i) => {
    const x = 120 + i * 236;
    s.push(figure({...cast(name, {x, y: base, h: H0, d: 1, fill: '#0D0C09'}), det: 1, rim: {...L.rim}, an: {expr: i % 3 === 1 ? 'smile' : 'neutral'}}));
    s.push(`<text x="${x}" y="${base + 34}" fill="#F4EFE6" font-family="Mono" font-size="17" letter-spacing="2" text-anchor="middle">${label}</text>`);
  });
  const poses = ['stand', 'stir', 'sew', 'iron', 'drink', 'hammer', 'read', 'rock'];
  poses.forEach((p, i) => {
    const x = 120 + i * 236, sitting = ['sew', 'hammer', 'read', 'rock'].includes(p), hh = 300;
    const yy = sitting ? 1020 + 0.22 * hh : 1020;
    s.push(figure({...cast('nfather', {x, y: yy, h: hh, d: 1, fill: '#0D0C09'}), det: 0.7, rim: {...L.rim}, prop: {stir: 'spoon', iron: 'iron', drink: 'glass', hammer: 'hammer', read: 'paper'}[p] || null, an: POSES[p](1.3, 0.3)}));
    s.push(`<text x="${x}" y="1056" fill="#F4EFE6" font-family="Mono" font-size="17" letter-spacing="2" text-anchor="middle">POSES.${p}</text>`);
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${s.join('')}</svg>`;
}
if (typeof window !== 'undefined') Object.assign(window, {renderCutaway, renderCastSheet});
