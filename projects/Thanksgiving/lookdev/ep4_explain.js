// Episode 4 diagrams (chapters 1 to 4 builder; teal explains). Load after ep3_explain.js / ep3_late.js (xpBoard, xpFrame, usP, US_OUT).
// Every function takes the edit's time T and an options object of narration times, so the diagrams are cut to the words in the
// chapter files. They are named e4x... (not render...), so the edit draws them on 12 drawings a second, like Ep 3's diagrams.
//
//   e4xUSCities(T, o)   the US map; city dots appear on their times (o.dots: [[lon, lat, t]]); o.big: a big counter
//   e4xLedger(T, o)     a ledger page on the desk: "THE BOOKS SHOWED" stamped, one line in teal, the amount typed out with the voice,
//                       then forty chairs and three tables counted in as small icons
// Colour rules: teal explains; orange torn strips and handwriting; money only a small gold glint; the Kellys coral.

const E4X = {bg: '#0B1414', teal: '#2FE0C4', orange: '#FF9F1C', cream: '#F4EFE6', ink: '#0D0C09', coral: '#FF6F61', glint: '#FFD36B', pale: '#A3BAB2',
  mute: '#5F857F', mute2: '#3E5F5A', panel: '#1C3332', paper: '#EDE4D0', paper2: '#E2D6BB'};
const e4In = (t0, t, d = 0.4) => smooth(t0, t0 + d, t);
const e4Win = (t0, t1, t, d = 0.35) => smooth(t0, t0 + d, t) * (1 - smooth(t1 - d, t1, t));
const e4Pop = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : 1 + 0.25 * Math.sin(u * Math.PI) - (1 - u) ** 2); // a scale that overshoots a little
const e4Num = (v) => Math.round(v).toLocaleString('en-US');

/* ---------- the US map with city dots ---------- */
// cities over 100,000 people, 1870 (14) and 1900 (the 24 more; Brooklyn joins New York in 1898). [name, lon, lat]
const E4_C1870 = [['New York', -74.0, 40.75], ['Philadelphia', -75.16, 39.95], ['Brooklyn', -73.95, 40.65], ['St. Louis', -90.2, 38.63], ['Chicago', -87.63, 41.88],
  ['Baltimore', -76.61, 39.29], ['Boston', -71.06, 42.36], ['Cincinnati', -84.51, 39.1], ['New Orleans', -90.07, 29.95], ['San Francisco', -122.42, 37.77],
  ['Buffalo', -78.88, 42.89], ['Washington', -77.04, 38.9], ['Newark', -74.17, 40.74], ['Louisville', -85.76, 38.25]];
const E4_C1900 = [['Cleveland', -81.69, 41.5], ['Pittsburgh', -80.0, 40.44], ['Detroit', -83.05, 42.33], ['Milwaukee', -87.91, 43.04], ['Jersey City', -74.08, 40.72],
  ['Minneapolis', -93.27, 44.98], ['Providence', -71.41, 41.82], ['Indianapolis', -86.16, 39.77], ['Kansas City', -94.58, 39.1], ['St. Paul', -93.09, 44.95],
  ['Rochester', -77.61, 43.16], ['Denver', -104.99, 39.74], ['Toledo', -83.54, 41.65], ['Allegheny', -80.01, 40.46], ['Columbus', -82.99, 39.96],
  ['Worcester', -71.8, 42.26], ['Syracuse', -76.15, 43.05], ['New Haven', -72.93, 41.31], ['Paterson', -74.17, 40.92], ['Fall River', -71.16, 41.7],
  ['St. Joseph', -94.85, 39.77], ['Omaha', -95.93, 41.26], ['Los Angeles', -118.24, 34.05], ['Memphis', -90.05, 35.15], ['Scranton', -75.66, 41.41]];
// o: {dots: [[lon, lat, t, col?]], zoom: [x, y, z] (screen centre and zoom of the map), board: true, extra(P): svg on the map}
function e4xUSCities(T, o = {}) {
  const [zx, zy, z] = o.zoom || [960, 560, 1.0], P = (p) => { const [x, y] = usP(p); return [960 + (x - zx) * z, 540 + (y - zy) * z]; };
  const s = [xpBoard(9)];
  s.push(`<polygon points="${pts(US_OUT.map(P))}" fill="#16302C" stroke="${E4X.pale}" stroke-width="3" stroke-opacity="0.8"/>`);
  for (const [lon, lat, t0, col] of o.dots || []) {
    const u = e4In(t0, T, 0.35); if (u <= 0) continue;
    const [x, y] = P([lon, lat]), k = e4Pop(u), ring = clamp01((T - t0) / 0.9);
    if (ring < 1) s.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(10 + 34 * ring)}" fill="none" stroke="${E4X.teal}" stroke-width="3" opacity="${f1((1 - ring) * 0.8 * 100) / 100}"/>`);
    s.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(13 * k)}" fill="${col || E4X.cream}" stroke="#111" stroke-width="3"/>`);
  }
  if (o.extra) s.push(o.extra(P));
  return s.join('');
}

/* ---------- the ledger page (ch 1) ---------- */
// o: {a: in, stamp: "THE BOOKS SHOWED" stamped, type0/type1: the amount typed over these, chairs: the chairs counted from, tables}
function e4xLedger(T, o) {
  const s = [], X = 330, Y = 150, W = 1260, Hh = 780, u = e4In(o.a, T, 0.5), dy = (1 - ease(u)) * 80 + Math.sin(T * 0.7) * 2;
  s.push(`<g transform="translate(0,${f1(dy)}) rotate(-1.2, 960, 540)" opacity="${f1(Math.min(1, u * 1.6) * 100) / 100}">`);
  s.push(`<rect x="${X + 10}" y="${Y + 18}" width="${W}" height="${Hh}" fill="#000" opacity="0.5" filter="url(#soft)"/><rect x="${X}" y="${Y}" width="${W}" height="${Hh}" fill="${E4X.paper}"/>`);
  s.push(`<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" fill="url(#e4xpaper)" opacity="0.5"/>`);
  for (let k = 0; k < 15; k++) s.push(`<rect x="${X}" y="${Y + 120 + k * 44}" width="${W}" height="1.6" fill="#5B7FA0" opacity="0.35"/>`);
  for (const cx of [X + 190, X + 930, X + 1120]) s.push(`<rect x="${cx}" y="${Y}" width="2" height="${Hh}" fill="#A0453A" opacity="0.45"/>`);
  // the other lines are drawn as faint handwriting strokes (illegible on purpose: only the one line is a real record)
  const rr = rng(4141);
  for (let i = 0; i < 11; i++) { if (i === 3) continue; const y = Y + 150 + i * 44, sc = (x0, x1) => { let d = `M${x0},${y}`; for (let x = x0; x < x1; x += 9 + rr() * 6) d += ` q4,${f1(-8 - rr() * 8)} ${f1(5 + rr() * 4)},${f1(rr() * 3 - 1)}`; return `<path d="${d}" stroke="#2B2418" stroke-width="2.2" fill="none" opacity="0.42"/>`; };
    s.push(sc(X + 40, X + 120 + rr() * 30), sc(X + 220, X + 520 + rr() * 330), sc(X + 960 + rr() * 40, X + 1100)); }
  const yL = Y + 155 + 3 * 44;
  s.push(`<text x="${X + 220}" y="${yL}" font-family="Playfair" font-style="italic" font-size="34" fill="#1D1810">Forty chairs and three tables</text>`);
  // the line: a teal band; the amount typed with the voice (the digits appear left to right)
  const yH = Y + 155 + 3 * 44, band = e4In(o.stamp + 0.4, T, 0.5);
  s.push(`<rect x="${X + 20}" y="${yH - 33}" width="${(W - 40) * ease(band)}" height="44" fill="${E4X.teal}" opacity="0.28"/>`);
  s.push(`<rect x="${X + 20}" y="${yH - 33}" width="${W - 40}" height="44" fill="none" stroke="${E4X.teal}" stroke-width="4" opacity="${f1(band * 100) / 100}"/>`);
  const amt = '$179,729.60', nType = Math.round(amt.length * clamp01((T - o.type0) / (o.type1 - o.type0)));
  if (nType > 0) s.push(`<text x="${X + 1110}" y="${yH + 1}" font-family="Playfair" font-weight="900" font-size="36" fill="#1D1810" text-anchor="end">${amt.slice(0, nType)}</text>`);
  if (nType >= amt.length) { const g = 0.5 + 0.5 * Math.sin(T * 3.1); s.push(`<circle cx="${X + 1118}" cy="${yH - 22}" r="${f1(3 + 2 * g)}" fill="${E4X.glint}" opacity="${f1(0.6 + 0.4 * g)}"/><path d="M${X + 1118},${yH - 34} l0,24 M${X + 1106},${yH - 22} l24,0" stroke="#FFF1C2" stroke-width="2" opacity="${f1(0.7 * g)}"/>`); } // the money's glint
  // the stamp, slammed in at an angle: THE BOOKS SHOWED (in the margin)
  const st = clamp01((T - o.stamp) / 0.14);
  if (st > 0) { const k = 1.25 - 0.25 * ease(st);
    s.push(`<g transform="translate(${X + 890},${Y + 640}) rotate(-8) scale(${f1(k * 100) / 100})" opacity="${f1(Math.min(1, st * 1.5) * 0.9 * 100) / 100}"><rect x="-300" y="-52" width="600" height="104" rx="8" fill="none" stroke="#2A8F80" stroke-width="7"/>` +
      `<text x="0" y="20" font-family="Mono" font-size="48" letter-spacing="3" fill="#2A8F80" text-anchor="middle">THE BOOKS SHOWED</text></g>`); }
  s.push('</g>');
  // forty chairs and three tables: small cream icons counted in on the words, in a strip under the page
  const icons = [], ch0 = o.chairs, tb0 = o.tables;
  const chair = (x, y) => `<rect x="${x - 9}" y="${y - 42}" width="18" height="18" fill="none" stroke="${E4X.cream}" stroke-width="3.5"/><rect x="${x - 12}" y="${y - 24}" width="24" height="5" fill="${E4X.cream}"/><path d="M${x - 9},${y - 19} l0,19 M${x + 9},${y - 19} l0,19" stroke="${E4X.cream}" stroke-width="3.5" stroke-linecap="round"/>`;
  const table = (x, y) => `<rect x="${x - 30}" y="${y - 28}" width="60" height="7" fill="${E4X.cream}"/><path d="M${x - 24},${y - 21} l0,21 M${x + 24},${y - 21} l0,21" stroke="${E4X.cream}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i < 40; i++) { const k = e4In(ch0 + i * 0.018, T, 0.15); if (k > 0) icons.push(`<g opacity="${f1(k)}" transform="translate(0,${f1((1 - k) * -14)})">${chair(160 + (i % 20) * 34, 1010 - Math.floor(i / 20) * 54)}</g>`); }
  for (let i = 0; i < 3; i++) { const k = e4In(tb0 + i * 0.12, T, 0.15); if (k > 0) icons.push(`<g opacity="${f1(k)}" transform="translate(0,${f1((1 - k) * -14)})">${table(900 + i * 80, 1010)}</g>`); }
  return s.join('') + (icons.length ? `<rect x="120" y="905" width="${icons.length > 40 ? 1010 : 830}" height="122" rx="6" fill="rgba(13,12,9,.82)"/>` + icons.join('') : '');
}
const e4xDefs = `<defs><filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
  <filter id="e4xpn"><feTurbulence type="fractalNoise" baseFrequency="0.02 0.4" numOctaves="3" seed="7"/><feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.22  0 0 0 0.5 0"/></filter>
  <pattern id="e4xpaper" width="1920" height="1080" patternUnits="userSpaceOnUse"><rect width="1920" height="1080" filter="url(#e4xpn)"/></pattern></defs>`;
const e4xSvg = (body) => svg(e4xDefs + body);

if (typeof window !== 'undefined') Object.assign(window, {e4xUSCities, e4xLedger, e4xSvg, E4_C1870, E4_C1900});

/* ---------- ch 2: one American in four, four in ten (urbanization) ---------- */
// Two rows of 20 people (1870 and 1900); the city dwellers turn teal and step toward a little skyline at the row's end.
// o: {r1, c1: row 1 in / its city people turn; r2, c2: row 2 in / turn}
function e4xIcon(x, y, h, col, op = 1) { // a person, as a simple pictogram (head, body, legs)
  if (op <= 0.01) return '';
  return `<g opacity="${f1(op * 100) / 100}"><circle cx="${f1(x)}" cy="${f1(y - h * 0.86)}" r="${f1(h * 0.13)}" fill="${col}"/><path d="M${f1(x - h * 0.16)},${f1(y - h * 0.38)} L${f1(x - h * 0.13)},${f1(y - h * 0.7)} Q${f1(x)},${f1(y - h * 0.76)} ${f1(x + h * 0.13)},${f1(y - h * 0.7)} L${f1(x + h * 0.16)},${f1(y - h * 0.38)} Z" fill="${col}"/>` +
    `<rect x="${f1(x - h * 0.11)}" y="${f1(y - h * 0.4)}" width="${f1(h * 0.09)}" height="${f1(h * 0.4)}" fill="${col}"/><rect x="${f1(x + h * 0.02)}" y="${f1(y - h * 0.4)}" width="${f1(h * 0.09)}" height="${f1(h * 0.4)}" fill="${col}"/></g>`;
}
function e4xSkyline(x, y, k, col = E4X.teal) { // a little city: towers of different heights (k: 0..1 growing)
  const B = [[0, 70, 34], [38, 110, 30], [72, 84, 36], [112, 140, 28], [144, 96, 34], [182, 60, 30]];
  return B.map(([dx, h, w]) => { const hh = h * ease(k); return hh > 1 ? `<rect x="${x + dx}" y="${f1(y - hh)}" width="${w}" height="${f1(hh)}" fill="${col}" opacity="0.85"/>` +
    [...Array(Math.floor(hh / 22))].map((_, j) => `<rect x="${x + dx + 8}" y="${f1(y - hh + 10 + j * 22)}" width="${w - 16}" height="6" fill="${E4X.bg}" opacity="0.55"/>`).join('') : ''; }).join('');
}
function e4xUrban(T, o) {
  const s = [xpBoard(11)], row = (y, n, t0, tc, label, frac) => {
    const ui = e4In(t0, T, 0.4); if (ui <= 0) return;
    s.push(xpOp(ui, xpAbril(150, y - 150, label, 64, E4X.cream)));
    for (let i = 0; i < 20; i++) { const city = i < n, k = city ? e4In(tc + i * 0.06, T, 0.35) : 0, x = 160 + i * 54 + (city ? -12 * ease(k) : 0), pi = e4In(t0 + i * 0.025, T, 0.2);
      s.push(e4xIcon(x, y, 112, k > 0.5 ? E4X.teal : '#5B6E6A', pi)); }
    const kc = e4In(tc, T, 0.6); s.push(e4xSkyline(1250, y, kc));
    if (kc > 0) s.push(xpOp(kc, xpMono(1250, y + 46, 'TOWNS AND CITIES', 24, E4X.teal, 'start', 3)));
    const kf = e4In(tc + 0.5, T, 0.4); if (kf > 0) s.push(xpOp(kf, xpAbril(1500, y - 20, frac, 104, E4X.teal)));
  };
  row(430, 5, o.r1, o.c1, '1870', '1 in 4');
  row(820, 8, o.r2, o.c2, '1900', '4 in 10');
  return s.join('');
}

/* ---------- ch 2: Chicago and Brooklyn, bars ---------- */
// o: {chi: Chicago in, chi2: its 1900 bar grows, ann: the "annexed 1889" note, bk: Brooklyn in, bk2: its 1890 bar, fourth: the 4th-city tag}
function e4xBars(T, o) {
  const s = [xpBoard(13)], X0 = 300, base = 900, scale = 620 / 1700000;
  s.push(`<rect x="${X0 - 40}" y="${base}" width="1420" height="4" fill="${E4X.pale}"/>`);
  const bar = (x, v, k, col, yr, val, ty) => { const h = v * scale * ease(k); if (k <= 0) return;
    s.push(`<rect x="${x}" y="${f1(base - h)}" width="150" height="${f1(h)}" fill="${col}"/>`);
    s.push(xpOp(e4In(ty, T), xpMono(x + 75, base + 46, yr, 30, E4X.cream, 'middle', 3)));
    if (k > 0.6) s.push(xpOp(clamp01((k - 0.6) * 2.5), xpMono(x + 75, f1(base - h - 22), val, 30, E4X.cream, 'middle', 1))); };
  const kc = e4In(o.chi, T, 0.5);
  if (kc > 0) { s.push(xpOp(kc, xpAbril(X0, 200, 'Chicago', 84, E4X.cream)));
    bar(X0, 298977, e4In(o.chi + 0.3, T, 0.6), E4X.mute, '1870', '298,977', o.chi + 0.2);
    bar(X0 + 200, 1698575, e4In(o.chi2, T, 1.2), E4X.teal, '1900', '1,698,575', o.chi2); }
  const ka = e4In(o.ann, T, 0.4);
  if (ka > 0) s.push(xpOp(ka, `<rect x="${X0 + 200}" y="${f1(base - 1698575 * scale)}" width="150" height="${f1((1698575 - 1300000) * scale)}" fill="none" stroke="${E4X.orange}" stroke-width="5" stroke-dasharray="14 8"/>`));
  const kb = e4In(o.bk, T, 0.5);
  if (kb > 0) { s.push(xpOp(kb, xpAbril(X0 + 760, 200, 'Brooklyn', 84, E4X.cream)));
    bar(X0 + 760, 396099, e4In(o.bk + 0.2, T, 0.6), E4X.mute, '1870', '396,099', o.bk + 0.2);
    bar(X0 + 960, 806343, e4In(o.bk2, T, 1.0), E4X.teal, '1890', '806,343', o.bk2); }
  return s.join('');
}

/* ---------- ch 2: why the cities grew (three panels, filled on the three sentences) ---------- */
// o: {farm, factory, ships}: the times of "Machines on farms", "Factories in cities", "immigrants"
function e4xWhy(T, o) {
  const s0 = [xpBoard(15)], s = [], top = [], G = 780;
  // the city in the middle-right: a skyline the people walk into
  s.push(e4xSkyline(1180, G, e4In(o.farm - 0.3, T, 0.6), '#4E726C'));
  // 1) the farm: a field, a horse-drawn reaper; the farmhands it replaces get up and walk off toward the city
  const kf = e4In(o.farm, T, 0.4);
  if (kf > 0) {
    s.push(xpOp(kf, `<rect x="140" y="${G}" width="560" height="10" fill="#4E5A3A"/>` + [...Array(14)].map((_, i) => `<path d="M${160 + i * 38},${G} l6,-46 l6,46" fill="#7A8A4E"/>`).join('')));
    const rx = 520 - 120 * e4In(o.farm + 0.3, T, 2.6), wh = (T * 3) % TAU; // the reaper: a frame, a big wheel turning, a cutter bar, a horse pulling
    s.push(xpOp(kf, `<g transform="translate(${f1(rx)},0)"><circle cx="0" cy="${G - 46}" r="46" fill="none" stroke="${E4X.cream}" stroke-width="7"/>` +
      [0, 1, 2, 3].map((k) => `<line x1="0" y1="${G - 46}" x2="${f1(46 * Math.cos(wh + k * Math.PI / 2))}" y2="${f1(G - 46 + 46 * Math.sin(wh + k * Math.PI / 2))}" stroke="${E4X.cream}" stroke-width="4"/>`).join('') +
      `<rect x="-60" y="${G - 14}" width="120" height="8" fill="${E4X.cream}"/><path d="M-10,${G - 90} l-30,-30 l60,0 Z" fill="${E4X.cream}"/><rect x="-80" y="${G - 140}" width="16" height="70" fill="${E4X.cream}"/></g>`));
    for (let i = 0; i < 4; i++) { const go = i > 0 ? e4In(o.farm + 0.9 + i * 0.35, T, 3.0) : 0, x = 210 + i * 90 + go * (960 - i * 70), y = G;
      s.push(e4xIcon(x, y, 92, go > 0.05 ? E4X.cream : '#8C9A86', kf)); }
    top.push(tag(150, 200, 'MACHINES ON FARMS', kf));
  }
  // 2) the factory: a mill with stacks and smoke, beside the city; people go in
  const kx = e4In(o.factory, T, 0.4);
  if (kx > 0) {
    s.push(xpOp(kx, `<path d="M1430,${G} l0,-120 l60,-40 l0,40 l60,-40 l0,40 l60,-40 l0,40 l60,-40 l0,160 Z" fill="${E4X.cream}" opacity="0.9"/><rect x="1610" y="${G - 300}" width="30" height="140" fill="${E4X.cream}" opacity="0.9"/><rect x="1660" y="${G - 260}" width="26" height="100" fill="${E4X.cream}" opacity="0.9"/>` +
      [...Array(4)].map((_, k) => `<rect x="${1450 + k * 60}" y="${G - 60}" width="22" height="30" fill="${E4X.bg}"/>`).join('')));
    for (let k = 0; k < 6; k++) { const ph = ((T * 0.25 + k / 6) % 1); s.push(`<circle cx="${f1(1625 + ph * 60)}" cy="${f1(G - 310 - ph * 180)}" r="${f1(14 + 30 * ph)}" fill="#7C918B" opacity="${f1(0.6 * (1 - ph) * kx)}"/>`); }
    top.push(tag(1180, 200, 'FACTORIES IN CITIES', kx));
  }
  // 3) the ships: a steamer comes in from the left along the bottom, its people walk up into the city
  const ks = e4In(o.ships, T, 0.4);
  if (ks > 0) {
    const sx = -200 + 760 * e4In(o.ships, T, 2.4), sy = 960;
    top.push(xpOp(ks, `<rect x="0" y="${sy}" width="1920" height="120" fill="#16302C"/><g transform="translate(${f1(sx)},0)"><path d="M-170,${sy - 10} l340,0 l-30,46 l-280,0 Z" fill="${E4X.cream}"/><rect x="-90" y="${sy - 50}" width="150" height="40" fill="${E4X.cream}"/><rect x="-20" y="${sy - 110}" width="28" height="60" fill="${E4X.cream}"/>` +
      [...Array(9)].map((_, k) => `<circle cx="${-150 + k * 34}" cy="${sy - 0}" r="7" fill="${E4X.bg}"/>`).join('') + '</g>'));
    for (let i = 0; i < 6; i++) { const go = e4In(o.ships + 1.6 + i * 0.25, T, 2.4), x = 640 + i * 30 + go * (560 - i * 20), y = 940 - go * 160;
      if (go > 0) top.push(e4xIcon(x, y, 70, E4X.teal, Math.min(1, go * 4))); }
    top.push(tag(660, 1010, 'IMMIGRANTS, LANDING WHERE THE JOBS WERE', ks));
  }
  return s0.join('') + `<g transform="translate(960,760) scale(1.1) translate(-930,-760)">${s.join('')}</g>` + top.join('');
}
if (typeof window !== 'undefined') Object.assign(window, {e4xUrban, e4xBars, e4xWhy, e4xIcon, e4xSkyline});

/* ---------- ch 3: the elevator and the frame (a cutaway of a ten-storey building) ---------- */
// o: {a: in, elev: the car starts up (and the stair climber), frame: the iron and steel frame draws on, hold: the walls hang on it}
function e4xFrame(T, o) {
  const s = [xpBoard(17)], X0 = 330, X1 = 930, G = 950, FH = 76, NF = 10, top = G - NF * FH, k0 = e4In(o.a, T, 0.5);
  const cols = [X0, 450, 570, 650, 790, X1];
  // the walls: brick panels hung on the frame (they fade in from muted to brick once the frame holds them)
  const kh = e4In(o.hold, T, 1.0);
  for (let f = 0; f < NF; f++) for (let j = 0; j < cols.length - 1; j++) { if (j === 2) continue; const x = cols[j], w = cols[j + 1] - x, y = G - (f + 1) * FH;
    s.push(`<rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${FH - 6}" fill="${emMix('#1C3332', '#7A4E3A', kh)}" opacity="${f1((0.55 + 0.4 * kh) * k0 * 100) / 100}"/>`);
    if (k0 > 0) for (const wx of [x + w * 0.3, x + w * 0.7]) s.push(`<rect x="${f1(wx - 9)}" y="${y + 18}" width="18" height="32" fill="${E4X.bg}" opacity="${f1(0.8 * k0)}"/>`); }
  // the stairs: a zigzag up the right side; a climber with a grocery bag trudging up (one flight every few seconds)
  const sx0 = 800, sx1 = 920;
  if (k0 > 0) { let d = `M${sx0},${G}`; for (let f = 0; f < NF; f++) { const y = G - f * FH; d += f % 2 ? ` L${sx0},${y - FH}` : ` L${sx1},${y - FH}`; }
    s.push(xpOp(k0 * 0.8, `<path d="${d}" stroke="${E4X.pale}" stroke-width="5" fill="none" stroke-dasharray="10 7"/>`)); }
  const cl = Math.max(0, T - o.elev) * 0.32, cf = Math.min(NF - 0.01, cl), fi = Math.floor(cf), fu = cf - fi, cx = fi % 2 ? lerp(sx1, sx0, fu) : lerp(sx0, sx1, fu), cy = G - cf * FH;
  if (T > o.elev - 0.5) s.push(e4xIcon(cx, cy - 4, 46, E4X.cream, e4In(o.elev - 0.5, T)) + `<rect x="${f1(cx + 8)}" y="${f1(cy - 30)}" width="14" height="16" rx="2" fill="${E4X.orange}" opacity="${f1(e4In(o.elev - 0.5, T))}"/>`);
  // the elevator: the shaft between the middle columns, the car rising floor to floor (a pause at each), the cable and the safety
  // ratchet teeth down the guide rails
  const kc = e4In(o.elev, T, 6.0), carF = Math.floor(kc * 9) + ease(clamp01((kc * 9 % 1) * 1.6)), carY = G - (Math.min(9, carF) + 1) * FH + 6;
  if (k0 > 0) { s.push(xpOp(k0, `<rect x="${cols[2]}" y="${top}" width="${cols[3] - cols[2]}" height="${G - top}" fill="#0E1C1B"/>` +
      [...Array(NF * 3)].map((_, i) => `<path d="M${cols[2] + 4},${G - i * FH / 3} l8,-8 l-8,0 Z M${cols[3] - 4},${G - i * FH / 3} l-8,-8 l8,0 Z" fill="${E4X.mute}"/>`).join('') +
      `<line x1="${(cols[2] + cols[3]) / 2}" y1="${top - 30}" x2="${(cols[2] + cols[3]) / 2}" y2="${carY}" stroke="${E4X.pale}" stroke-width="3"/><rect x="${(cols[2] + cols[3]) / 2 - 26}" y="${top - 50}" width="52" height="24" fill="${E4X.pale}"/>` +
      `<rect x="${cols[2] + 12}" y="${f1(carY)}" width="${cols[3] - cols[2] - 24}" height="${FH - 12}" fill="${E4X.cream}" stroke="#111" stroke-width="3"/>` + e4xIcon((cols[2] + cols[3]) / 2, carY + FH - 14, 46, E4X.ink)));
    s.push(xpOp(e4In(o.elev, T), xpMono(cols[2] - 20, carY + 40, String(Math.min(10, Math.floor(carF) + 1)), 26, E4X.teal, 'end', 1))); }
  // the frame: columns and beams draw on in teal over the walls
  const kf = e4In(o.frame, T, 1.6);
  if (kf > 0) { const L = [];
    cols.forEach((x, j) => L.push(`<line x1="${x}" y1="${G}" x2="${x}" y2="${f1(G - (G - top) * clamp01(kf * 1.4 - j * 0.06))}" stroke="${E4X.teal}" stroke-width="9"/>`));
    for (let f = 1; f <= NF; f++) { const y = G - f * FH, u = clamp01(kf * 1.6 - f * 0.07); if (u > 0) L.push(`<line x1="${X0}" y1="${y}" x2="${f1(X0 + (X1 - X0) * u)}" y2="${y}" stroke="${E4X.teal}" stroke-width="7"/>`); }
    s.push(`<g opacity="0.95">${L.join('')}</g>`); }
  s.push(`<rect x="${X0 - 40}" y="${G}" width="${X1 - X0 + 80}" height="10" fill="${E4X.pale}"/>`);
  return s.join('');
}

/* ---------- ch 3: an 1888 electric streetcar (drawn: no photograph of Richmond's cars is used) ---------- */
// o: {a: in}. The car runs right to left under the wire; its trolley pole rides the wire, sparking now and then; poles go by.
function e4xTrolley(T, o) {
  const s = [], G = 820, k0 = e4In(o.a, T, 0.4), u = T - o.a, vx = 150, scroll = u * vx;
  s.push(`<rect width="1920" height="1080" fill="#0E1A1A"/>`);
  // buildings behind (muted, scrolling slowly), the street, the rails
  const r = rng(888);
  for (let i = -2; i < 14; i++) { const w = 160 + r() * 120, h = 260 + r() * 220, x = ((i * 190 + scroll * 0.35) % 2660 + 2660) % 2660 - 370;
    s.push(`<rect x="${f1(x)}" y="${f1(G - 60 - h)}" width="${f1(w)}" height="${f1(h)}" fill="#1C3332"/>` + [...Array(Math.floor(h / 70))].map((_, j) => [0.25, 0.6].map((q) => `<rect x="${f1(x + w * q)}" y="${f1(G - 60 - h + 26 + j * 70)}" width="22" height="34" fill="#2B4744"/>`).join('')).join('')); }
  s.push(`<rect x="0" y="${G - 60}" width="1920" height="300" fill="#22302E"/><rect x="0" y="${G + 26}" width="1920" height="5" fill="${E4X.pale}"/><rect x="0" y="${G + 46}" width="1920" height="3" fill="${E4X.mute}"/>`);
  // the wire and its poles (scrolling with the street), the car fixed in the frame with a little bob
  const wireY = 300; s.push(`<line x1="0" y1="${wireY}" x2="1920" y2="${wireY + 4}" stroke="#C9D3CC" stroke-width="3"/>`);
  for (let i = -1; i < 6; i++) { const x = ((i * 520 + scroll) % 3120 + 3120) % 3120 - 600; s.push(`<rect x="${f1(x)}" y="${wireY - 40}" width="12" height="${G + 26 - wireY + 40}" fill="#4E726C"/><rect x="${f1(x - 40)}" y="${wireY - 6}" width="52" height="7" fill="#4E726C"/>`); }
  const cx = 860, bob = 2 * Math.sin(u * 9), cy = G + 22 + bob, wh = -(u * 6) % TAU;
  s.push(`<g>` + `<rect x="${cx - 300}" y="${cy - 230}" width="600" height="200" rx="10" fill="${E4X.cream}"/><rect x="${cx - 320}" y="${cy - 250}" width="640" height="26" rx="8" fill="#C9C2B0"/><rect x="${cx - 200}" y="${cy - 274}" width="400" height="26" rx="6" fill="#C9C2B0"/>` +
    [...Array(8)].map((_, i) => `<rect x="${cx - 270 + i * 68}" y="${cy - 200}" width="50" height="70" rx="5" fill="#20302E"/>`).join('') +
    `<rect x="${cx - 300}" y="${cy - 110}" width="600" height="14" fill="${E4X.teal}" opacity="0.8"/>` +
    [cx - 190, cx + 190].map((x) => `<circle cx="${x}" cy="${cy - 18}" r="34" fill="#0B1312" stroke="${E4X.pale}" stroke-width="4"/>` + [0, 1, 2].map((q) => `<line x1="${x}" y1="${cy - 18}" x2="${f1(x + 30 * Math.cos(wh + q * 2.09))}" y2="${f1(cy - 18 + 30 * Math.sin(wh + q * 2.09))}" stroke="${E4X.pale}" stroke-width="3"/>`).join('')).join('') + `</g>`);
  // the trolley pole from the roof up and back to the wire; the wheel at its tip; sparks
  const base = [cx + 120, cy - 272], tip = [cx + 330, wireY + 6];
  s.push(`<line x1="${base[0]}" y1="${base[1]}" x2="${tip[0]}" y2="${tip[1]}" stroke="#A3BAB2" stroke-width="8"/><circle cx="${tip[0]}" cy="${tip[1]}" r="10" fill="#C9D3CC"/><rect x="${base[0] - 22}" y="${base[1] - 6}" width="44" height="10" fill="#A3BAB2"/>`);
  const sp = Math.max(0, Math.sin(u * 13.7) * Math.sin(u * 3.1)) ** 3;
  if (sp > 0.05) { s.push(`<circle cx="${tip[0]}" cy="${tip[1]}" r="${f1(16 + 30 * sp)}" fill="#BFF7EE" opacity="${f1(0.55 * sp)}"/>`); for (let k = 0; k < 6; k++) { const a = r() * TAU, L = 18 + 30 * sp * r(); s.push(`<line x1="${tip[0]}" y1="${tip[1]}" x2="${f1(tip[0] + Math.cos(a) * L)}" y2="${f1(tip[1] + Math.sin(a) * L)}" stroke="#E9FFFB" stroke-width="2.5" opacity="${f1(sp)}"/>`); } }
  return `<g opacity="${f1(k0)}">${s.join('')}</g>`;
}

/* ---------- ch 3: the streetcar suburb (lines out from downtown; who can pay the fare lives farther out) ---------- */
// o: {a, fare: "afford the fare", out: "moved out along the lines", quiet: "quiet new neighborhoods", stayed: "If you couldn't"}
function e4xRings(T, o) {
  const s = [xpBoard(19)], C0 = [520, 560], k0 = e4In(o.a, T, 0.5);
  // the river and docks on the left; downtown: a dense grid of small blocks; factories with stacks
  s.push(`<rect x="0" y="0" width="230" height="1080" fill="#16302C"/>` + [...Array(6)].map((_, i) => `<rect x="200" y="${150 + i * 140}" width="90" height="26" fill="#2A3B38"/>`).join(''));
  const dens = e4In(o.stayed, T, 1.0);
  for (let i = 0; i < 7; i++) for (let j = 0; j < 8; j++) { const x = 300 + i * 62, y = 300 + j * 62, d = Math.hypot(x + 25 - C0[0], y + 25 - C0[1]); if (d > 250) continue;
    s.push(`<rect x="${x}" y="${y}" width="50" height="50" fill="${emMix('#4E726C', '#A3BAB2', dens)}" opacity="${f1(k0)}"/>`); }
  if (k0 > 0) s.push(xpOp(k0, [[330, 260], [420, 250], [640, 820]].map(([x, y]) => `<path d="M${x},${y} l0,-50 l30,-20 l0,20 l30,-20 l0,70 Z" fill="${E4X.cream}" opacity="0.8"/><rect x="${x + 44}" y="${y - 110}" width="12" height="60" fill="${E4X.cream}" opacity="0.8"/>`).join('')));
  // crowd dots in downtown, more and more once the narration says who stayed
  const r = rng(505); for (let i = 0; i < 160; i++) { const a = r() * TAU, d = Math.sqrt(r()) * 240, th = r(); if (th > 0.25 + 0.75 * dens) continue;
    s.push(`<circle cx="${f1(C0[0] + Math.cos(a) * d + 3 * Math.sin(T * 2 + i))}" cy="${f1(C0[1] + Math.sin(a) * d)}" r="4" fill="${E4X.cream}" opacity="${f1(k0 * 0.9)}"/>`); }
  // the streetcar lines: out from downtown to the right, drawing on; cars running along them
  const lines = [[-0.85, 1400], [-0.35, 1450], [0.12, 1480], [0.55, 1420], [0.95, 1300]];
  const kl = e4In(o.a + 0.4, T, 1.2), kout = e4In(o.out, T, 2.6);
  lines.forEach(([ang, L], li) => { const A = [C0[0] + Math.cos(ang) * 240, C0[1] + Math.sin(ang) * 240 * 0.62], B = [C0[0] + Math.cos(ang) * L, C0[1] + Math.sin(ang) * L * 0.62];
    const E = [lerp(A[0], B[0], kl), lerp(A[1], B[1], kl)];
    s.push(`<line x1="${f1(A[0])}" y1="${f1(A[1])}" x2="${f1(E[0])}" y2="${f1(E[1])}" stroke="#111" stroke-width="11"/><line x1="${f1(A[0])}" y1="${f1(A[1])}" x2="${f1(E[0])}" y2="${f1(E[1])}" stroke="${E4X.teal}" stroke-width="6"/>`);
    for (let q = 0; q < 2; q++) { const ph = ((T * 0.12 + q * 0.5 + li * 0.17) % 1) * kl; const p = [lerp(A[0], B[0], ph), lerp(A[1], B[1], ph)]; s.push(`<rect x="${f1(p[0] - 13)}" y="${f1(p[1] - 8)}" width="26" height="16" rx="3" fill="${E4X.cream}" stroke="#111" stroke-width="2.5"/>`); }
    // houses along the line, bigger and farther out; they pop up with "moved out along the streetcar lines"
    for (let h = 0; h < 4; h++) { const u = 0.38 + h * 0.17, kk = e4In(o.out + li * 0.18 + h * 0.3, T, 0.4); if (kk <= 0) continue; const side = h % 2 ? 1 : -1, nx = -Math.sin(ang) * 0.62, ny = Math.cos(ang);
      const p = [lerp(A[0], B[0], u) + side * nx * 46, lerp(A[1], B[1], u) + side * ny * 46 * 0.62 + 14], sc = (0.34 + 0.18 * h) * e4Pop(kk);
      s.push(xpHouse(p[0] - 50 * sc, p[1], sc, h > 1 ? '#7C918B' : '#5F857F')); }
  });
  void kout;
  return s.join('');
}
if (typeof window !== 'undefined') Object.assign(window, {e4xFrame, e4xTrolley, e4xRings});

/* ---------- ch 4: the street of horses (drawn, the cold open's block by day: lookdev/ep4.js E4_ROW, e4Facade, brougham) ---------- */
// Traffic both ways: cabs and wagons at a trot on the near lane, carts the other way on the far lane; dung on the cobbles (more and
// more of it over the shot: o.dung0 .. o.dung1 narration times). o.cam: the edit's camera (cam2 keys); t drives the traffic.
function renderE4HorseStreet(t, o = {}) {
  const {H, CURB, WF, GE} = E4F, c = cam2(o.cam || {z: 1.0, ux: 1150, uy: 640}), back = [], street = [];
  E4_ROW.forEach((b) => back.push(e4Facade({...b, burn: false}, t, 0)));
  for (const b of E4_ROW) for (const cx of [b.x + 60, b.x + b.w - 110]) back.push(`<rect x="${cx}" y="${E4F.top - 110}" width="50" height="76" fill="#0E1514"/>` + MAT.smoke(cx + 25, E4F.top - 120, t + cx * 0.01, {col: 'A3BAB2', k: 0.6, n: 5, rise: 160, drift: 120, speed: 6, seed: cx}));
  back.push(`<rect x="-1500" y="${WF}" width="6000" height="${CURB - WF}" fill="#7C8C8C"/><rect x="-1500" y="${WF - 4}" width="6000" height="6" fill="#0A0F0E" opacity="0.7"/>` +
    `<rect x="-1500" y="${CURB}" width="6000" height="10" fill="#3A4544"/><rect x="-1500" y="${CURB + 10}" width="6000" height="900" fill="#55625F"/>` +
    [...Array(40)].map((_, i) => `<rect x="-1500" y="${CURB + 22 + i * 9}" width="6000" height="2" fill="#4A5654" opacity="0.6"/>`).join(''));
  back.push(`<rect x="-1500" y="-600" width="6000" height="${WF + 610}" fill="#C9D6D2" opacity="0.13"/>`);
  // dung on the cobbles: brown-black heaps, more of them as the shot goes on (fixed places, appearing in order)
  const r = rng(4404), nd = Math.round(lerp(14, 70, clamp01((o.T ?? t) - (o.dung0 ?? 0)) / Math.max(1, (o.dung1 ?? 10) - (o.dung0 ?? 0))));
  for (let i = 0; i < 70; i++) { const x = -200 + r() * 2800, y = CURB + 30 + r() * 120, sz = 6 + r() * 7; if (i >= nd) continue;
    back.push(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(sz * 1.6)}" ry="${f1(sz * 0.7)}" fill="#2E241A"/><ellipse cx="${f1(x - 2)}" cy="${f1(y - 2)}" rx="${f1(sz * 0.9)}" ry="${f1(sz * 0.4)}" fill="#46382A"/>`); }
  // traffic: near lane to the right (cabs at a trot), far lane to the left (carts, smaller, mirrored)
  const near = [[0, 260, 150], [5.5, 230, 140], [11, 280, 150], [16.5, 250, 145]], far = [[2.5, 190, 120], [8.5, 210, 125], [14, 180, 118]];
  const span = 3400;
  for (const [ph, v, sz] of far) { const d = ((t + ph * 3) * v) % span, x = 2900 - d; // drawn mirrored about x, so it faces and moves left
    street.push(`<g transform="translate(${f1(2 * x)},0) scale(-1,1)">${brougham(x, GE - 46, sz, '#1E2725', (t + ph * 3) * v, 0, 0, 1, t)}</g>`); }
  for (const [ph, v, sz] of near) { const d = ((t + ph * 3) * v) % span, x = -500 + d; street.push(brougham(x, GE + 10, sz, '#0D1211', (t + ph * 3) * v, 0, 0, 1, t)); }
  const world = layerAt(c, 1, back.join('') + street.join(''));
  return frame(e3Defs(t, grad('e4day2', [['0', '#6F8584'], ['1', '#B9C6C2']]) + e4FireDefs()), `<rect width="1920" height="1080" fill="url(#e4day2)"/>`, world, '', t);
}

/* ---------- ch 4: one small child in seven (seven small figures; one fades to an outline) ---------- */
function e4xSeven(T, o) {
  const s = [xpBoard(21)], k0 = e4In(o.a, T, 0.4);
  for (let i = 0; i < 7; i++) { const x = 420 + i * 180, ki = e4In(o.a + 0.1 + i * 0.08, T, 0.3), gone = i === 3 ? e4In(o.died, T, 1.2) : 0;
    if (gone < 1) s.push(e4xIcon(x, 760, 190, E4X.cream, ki * (1 - gone)));
    if (gone > 0) s.push(`<g opacity="${f1(gone * 0.9)}"><circle cx="${x}" cy="${f1(760 - 190 * 0.86)}" r="${f1(190 * 0.13)}" fill="none" stroke="${E4X.teal}" stroke-width="4"/><path d="M${f1(x - 30)},${f1(760 - 72)} L${f1(x - 25)},${f1(760 - 133)} Q${x},${f1(760 - 144)} ${f1(x + 25)},${f1(760 - 133)} L${f1(x + 30)},${f1(760 - 72)} L${f1(x + 21)},${f1(760 - 72)} L${f1(x + 21)},760 L${f1(x - 21)},760 L${f1(x - 21)},${f1(760 - 72)} Z" fill="none" stroke="${E4X.teal}" stroke-width="4"/></g>`); }
  s.push(`<rect x="300" y="790" width="1320" height="5" fill="${E4X.mute}" opacity="${f1(k0)}"/>`);
  return s.join('');
}

/* ---------- ch 4: Brooklyn's relief, 1877 and 1878 ---------- */
// o: {a, b77: the 1877 bar grows, n: the number counts up, b78: 1878 (no bar: zero), stop: "stopped", none: "Completely."}
function e4xRelief(T, o) {
  const s = [xpBoard(23)], X0 = 220, base = 880, H0 = 520, k0 = e4In(o.a, T, 0.4);
  s.push(xpOp(k0, `<rect x="${X0 - 40}" y="${base}" width="900" height="4" fill="${E4X.pale}"/>` + xpAbril(X0 - 40, 190, 'Brooklyn: city help for the poor', 54, E4X.cream)));
  const kb = e4In(o.b77, T, 1.2), h = H0 * ease(kb), drop = e4In(o.stop, T, 0.5);
  s.push(`<rect x="${X0}" y="${f1(base - h)}" width="230" height="${f1(h)}" fill="${E4X.teal}" opacity="${f1(k0)}"/>`);
  // coal lumps heaped in the bar (the help was coal or groceries)
  if (kb > 0.3) { const rr = rng(77); for (let i = 0; i < 26; i++) { const x = X0 + 20 + rr() * 190, y = base - h + 20 + rr() * Math.max(10, h - 40); s.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(6 + rr() * 6)}" fill="#0B1312" opacity="0.55"/>`); } }
  s.push(xpOp(e4In(o.b77, T), xpMono(X0 + 115, base + 50, '1877', 34, E4X.cream, 'middle', 3)));
  if (kb > 0.2) s.push(xpOp(clamp01(kb * 2), xpAbril(X0 + 115, f1(base - h - 30), e4Num(46350 * clamp01((T - o.b77) / 1.4)), 64, E4X.cream, 'middle')));
  if (kb > 0.2) s.push(xpOp(clamp01(kb * 2), xpMono(X0 + 115, f1(base - h - 100), 'PEOPLE HELPED', 24, E4X.teal, 'middle', 3)));
  const k8 = e4In(o.b78, T, 0.4);
  if (k8 > 0) { s.push(xpOp(k8, xpMono(X0 + 485, base + 50, '1878', 34, E4X.cream, 'middle', 3)));
    // the 1878 bar starts as tall as 1877's and drops to nothing on "stopped"
    const h8 = H0 * (1 - ease(drop)); if (h8 > 1) s.push(`<rect x="${X0 + 370}" y="${f1(base - h8)}" width="230" height="${f1(h8)}" fill="${E4X.teal}" opacity="${f1(0.35 * k8)}" stroke="${E4X.teal}" stroke-width="3" stroke-dasharray="12 8"/>`);
    if (drop > 0.5) s.push(xpOp(clamp01(drop * 2 - 1), xpAbril(X0 + 485, base - 30, '0', 96, E4X.cream, 'middle'))); }
  return s.join('');
}

/* ---------- ch 4: the tenement plan's yard: a toilet shed and the sewer to the river (over Ep 3's ep3_tenement_plan) ---------- */
function e4xYard(T, o) {
  const s = [], kp = e4In(o.privy, T, 0.4), ks = e4In(o.sewer, T, 1.4);
  if (kp > 0) s.push(xpOp(kp, `<path d="M1700,700 l0,-90 l40,-26 l40,26 l0,90 Z" fill="${E4X.cream}" stroke="#111" stroke-width="3"/><rect x="1726" y="640" width="28" height="60" fill="#2B4744"/><path d="M1734,622 a6,6 0 1,0 12,0 a6,6 0 1,0 -12,0" fill="#2B4744"/>`));
  if (ks > 0) { const P = [[1740, 704], [1740, 860], [1640, 860], [260, 860], [190, 860], [150, 1010]], seg = xpPartial(P, ks);
    s.push(`<polyline points="${pts(seg)}" fill="none" stroke="#111" stroke-width="16" stroke-linejoin="round"/><polyline points="${pts(seg)}" fill="none" stroke="#7A5E3A" stroke-width="10" stroke-dasharray="22 12" stroke-dashoffset="${f1(-T * 60)}" stroke-linejoin="round"/>`); }
  return s.join('');
}
if (typeof window !== 'undefined') Object.assign(window, {renderE4HorseStreet, e4xSeven, e4xRelief, e4xYard});
