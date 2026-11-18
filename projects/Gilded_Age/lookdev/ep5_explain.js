// Episode 5 (Fighting Back) explainers: teal explains. Load after ep3_explain.js, ep4_explain_b.js (x4Glint, x4Pop, x4Man, X4ICON)
// and ep5_doors.js (drDefs). Notebook paper on the dark desk, teal linework, orange torn tape (Abril), IBM Plex Mono tags,
// Nanum Pen notes in teal. Money only as small gold glints; no faces for real people (name cards only); no em dashes.
//
//   ep5_x_weapons    ch 3  workers' tools (UNION, COLLECTIVE BARGAINING, STRIKE) vs owners' weapons (BLACKLIST, LOCKOUT,
//                          STRIKEBREAKERS, COURTS AND SOLDIERS)
//   ep5_x_unions     ch 4  Knights of Labor vs AFL; HAYMARKET cracks the Knights' column, the AFL lasts
//   ep5_x_charge     ch 5  ANDREW CARNEGIE (owner) > HENRY CLAY FRICK (runs it) > THE HOMESTEAD MILL
//   ep5_x_owen3      ch 6  farmers' three problems: debt, railroads, falling prices
//   ep5_x_loan       ch 7  $1,000 debt: 1,000 bushels at $1, then 2,000 bushels at 50 cents. SAME DEBT. TWICE THE WORK.
//   ep5_x_inflation  ch 7  greenbacks pour in, the same goods, the price tags climb: INFLATION
//   ep5_x_gold       ch 7  the gold standard: every dollar chained to gold in the vault
//   ep5_x_bread      ch 7  the bread town: 100 dollars, 100 loaves at $1; 200 loaves, same 100 dollars, 50 cents: DEFLATION
//   ep5_x_silver     ch 7  free silver: silver dollars join the gold, the wheat price climbs back toward $1
//   ep5_x_spoils     ch 8  the spoils system: a line at the office door; then the civil service test
//   ep5_x_omaha      ch 8  the Omaha Platform checklist
// Each renderer takes clip time t and a cue table (the X5 tables below: seconds into the clip), so the edit can pass the voiced
// word times instead: CLIPS entries use the defaults.

const X5 = {teal: '#2FE0C4', orange: '#FF9F1C', cream: '#F4EFE6', ink: '#111111', paper: '#EFE7D4', rule: '#5B7FA0', margin: '#A0453A',
  mute: '#5F857F', mute2: '#3E5F5A', pale: '#A3BAB2', grey: '#7A7466', silver: '#C9CDD0', goldTone: '#8A6A2A', green: '#6E8F73'};
const x5In = (t0, t, d = 0.4) => smooth(t0, t0 + d, t);
const x5Op = (k, b) => (k <= 0.005 ? '' : `<g opacity="${f1(Math.min(1, k) * 1000) / 1000}">${b}</g>`);
const x5At = (x, y, k, b, rot = 0) => (k <= 0.005 ? '' : `<g transform="translate(${f1(x)},${f1(y)}) rotate(${rot}) scale(${f1(k * 1000) / 1000})">${b}</g>`);
const x5Pop = (t0, t, d = 0.45) => x4Pop(clamp01((t - t0) / d));
const x5Ab = (x, y, txt, size = 48, col = X5.ink, anchor = 'start') => `<text x="${f1(x)}" y="${f1(y)}" font-family="Abril" font-size="${size}" fill="${col}" text-anchor="${anchor}">${txt}</text>`;
const x5Mono = (x, y, txt, size = 26, col = X5.ink, anchor = 'start') => `<text x="${f1(x)}" y="${f1(y)}" font-family="Mono" font-size="${size}" letter-spacing="2" fill="${col}" text-anchor="${anchor}">${txt}</text>`;
const x5Pen = (x, y, txt, size = 34, rot = -3) => penS(x, y, txt, size, rot, X5.teal);
const x5Teal = (d, w = 6, k = 1) => (k <= 0.005 ? '' : `<path d="${d}" fill="none" stroke="#111" stroke-width="${w + 4}" stroke-linecap="round" stroke-linejoin="round" opacity="${f1(k)}"/><path d="${d}" fill="none" stroke="${X5.teal}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${f1(k)}"/>`);
const x5Ink = (d, w = 4, fill = 'none') => `<path d="${d}" fill="${fill}" stroke="#111" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
// the dark desk with a sheet of notebook paper (blue rules, red margin), drifting very slightly
function x5Sheet(t, {x = 110, y = 70, w = 1700, h = 950, rot = -0.6, rules = true} = {}) {
  const s = [`<rect width="1920" height="1080" fill="#0B0A07"/><rect width="1920" height="1080" fill="url(#x4desk)"/>`];
  s.push(`<g transform="rotate(${rot}, 960, 540) translate(0,${f1(Math.sin(t * 0.6) * 1.5)})"><rect x="${x + 12}" y="${y + 18}" width="${w}" height="${h}" fill="#000" opacity="0.5" filter="url(#soft)"/>`);
  s.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${X5.paper}"/>`);
  if (rules) { for (let yy = y + 150; yy < y + h - 20; yy += 54) s.push(`<rect x="${x}" y="${yy}" width="${w}" height="1.6" fill="${X5.rule}" opacity="0.3"/>`);
    s.push(`<rect x="${x + 110}" y="${y}" width="2" height="${h}" fill="${X5.margin}" opacity="0.45"/>`); }
  s.push('</g>');
  return s.join('');
}
// a check mark that draws itself on
const x5Check = (x, y, u, s = 1) => (u <= 0.01 ? '' : x5Teal(`M${f1(x - 18 * s)},${f1(y)} L${f1(x - 18 * s + 14 * s * Math.min(1, u * 2))},${f1(y + 14 * s * Math.min(1, u * 2))}` + (u > 0.5 ? ` L${f1(x - 4 * s + 30 * s * (u - 0.5) * 2)},${f1(y + 14 * s - 34 * s * (u - 0.5) * 2)}` : ''), 7 * s));
const x5Cross = (x, y, u, s = 1) => (u <= 0.01 ? '' : `<g opacity="${f1(Math.min(1, u * 2))}">${x5Ink(`M${x - 22 * s},${y - 22 * s} L${x + 22 * s},${y + 22 * s} M${x + 22 * s},${y - 22 * s} L${x - 22 * s},${y + 22 * s}`, 13 * s)}<path d="M${x - 22 * s},${y - 22 * s} L${x + 22 * s},${y + 22 * s} M${x + 22 * s},${y - 22 * s} L${x - 22 * s},${y + 22 * s}" stroke="${X5.orange}" stroke-width="${7 * s}" stroke-linecap="round"/></g>`);
const x5Frame = (t, world, screen = '') => frame(e3Defs(t, X4_DEFS + `<filter id="x5b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>`), '', world, screen, t);
// a tape that slaps in (screen): scale from big to 1
const x5Slap = (x, y, txt, size, t0, t, seed, rot = -3) => { const u = clamp01((t - t0) / 0.18); if (u <= 0) return ''; const w = txt.length * size * 0.66 + size * 0.5, h = size * 1.28, k = 1.5 - 0.5 * ease(u);
  return `<g transform="translate(${f1(x + w / 2)},${f1(y + h / 2)}) scale(${f1(k * 1000) / 1000}) translate(${f1(-w / 2)},${f1(-h / 2)})" opacity="${f1(Math.min(1, u * 2))}"><rect x="10" y="14" width="${f1(w)}" height="${f1(h)}" fill="#000" opacity="0.4" filter="url(#soft)"/>${tapeS(0, 0, txt, size, rot, 1, seed)}</g>`; };

/* ---------- icons, ink on paper with teal accents (about 100 px, centred) ---------- */
const X5I = {
  people: () => [[-34, 44, 70], [0, 44, 84], [34, 44, 70]].map(([x, y, h]) => xpPerson(x, y, h, X5.mute2, {stroke: '#111'})).join('') + x5Teal('M-50,50 L50,50', 4),
  table: () => x5Ink('M-56,10 L56,10 M-44,10 L-44,46 M44,10 L44,46', 6) + xpPerson(-62, 46, 64, X5.mute2, {stroke: '#111'}) + xpPerson(62, 46, 64, X5.mute2, {stroke: '#111'}) +
    `<rect x="-22" y="-6" width="40" height="14" fill="${X5.cream}" stroke="#111" stroke-width="2.5" transform="rotate(-6)"/>` + x5Teal('M-30,-30 Q0,-52 30,-30', 4),
  strike: () => x5Ink('M0,50 L0,-10', 7) + `<rect x="-46" y="-56" width="92" height="50" fill="${X5.cream}" stroke="#111" stroke-width="4"/>` + x5Teal('M-30,-40 L30,-40 M-30,-24 L16,-24', 5),
  blacklist: () => `<rect x="-38" y="-50" width="76" height="100" fill="${X5.cream}" stroke="#111" stroke-width="4"/>` + [0, 1, 2, 3].map((k) => x5Ink(`M-24,${-30 + k * 20} L24,${-30 + k * 20}`, 4)).join('') + x5Ink('M-46,-40 L46,46', 6),
  lockout: () => x5Ink('M-50,50 L-50,-40 M-25,50 L-25,-40 M0,50 L0,-40 M25,50 L25,-40 M50,50 L50,-40 M-58,-20 L58,-20 M-58,30 L58,30', 5) +
    `<rect x="-16" y="-6" width="32" height="28" rx="4" fill="${X5.mute2}" stroke="#111" stroke-width="3.5"/>` + x5Ink('M-9,-6 L-9,-16 Q0,-28 9,-16 L9,-6', 4),
  breakers: () => [-36, 0, 36].map((x, i) => xpPerson(x + i * 4, 46, 76, '#2B2A26', {stroke: '#111'})).join('') + x5Ink('M-60,0 L-30,0 M-40,-10 L-30,0 L-40,10', 4),
  courts: () => `<g transform="translate(-22,0) rotate(-30)"><rect x="-6" y="-10" width="12" height="62" rx="4" fill="#8A6A44" stroke="#111" stroke-width="3"/><rect x="-30" y="-34" width="60" height="30" rx="7" fill="#6B4E34" stroke="#111" stroke-width="3"/></g>` +
    `<path d="M14,-34 L58,-34 L54,-22 L18,-22 Z M22,-22 L50,-22 L48,-4 L24,-4 Z" fill="#2B3B39" stroke="#111" stroke-width="3"/><rect x="18" y="-10" width="36" height="6" fill="#111"/>` + `<rect x="-60" y="40" width="120" height="10" fill="#5A4430" stroke="#111" stroke-width="3"/>`,
  house: () => `<path d="M-44,46 L-44,-6 L0,-44 L44,-6 L44,46 Z" fill="${X5.mute2}" stroke="#111" stroke-width="4"/><rect x="-12" y="14" width="24" height="32" fill="#111"/>` +
    `<rect x="14" y="-26" width="46" height="58" fill="${X5.cream}" stroke="#111" stroke-width="3" transform="rotate(10)"/>` + x5Ink('M24,-6 L52,-1 M22,6 L50,11', 3) + `<circle cx="40" cy="26" r="9" fill="none" stroke="${X5.teal}" stroke-width="4"/>`,
  train: () => `<rect x="-56" y="-8" width="70" height="36" fill="${X5.mute2}" stroke="#111" stroke-width="4"/><rect x="14" y="-34" width="38" height="62" fill="${X5.mute2}" stroke="#111" stroke-width="4"/><path d="M-46,-8 L-46,-36 L-30,-36 L-30,-8" fill="#2B3B39" stroke="#111" stroke-width="4"/>` +
    `<path d="M-66,28 L-56,10 L-56,28 Z" fill="#111"/>` + [-40, -12, 30].map((x) => `<circle cx="${x}" cy="36" r="13" fill="${X5.cream}" stroke="#111" stroke-width="4"/>`).join('') + x5Ink('M-70,50 L66,50', 4) +
    `<circle cx="-50" cy="-50" r="9" fill="${X5.pale}" opacity="0.7"/><circle cx="-60" cy="-66" r="12" fill="${X5.pale}" opacity="0.5"/>`,
  wheat: () => { let d = ''; for (let i = -2; i <= 2; i++) d += `M${i * 6},50 Q${i * 4},0 ${i * 14},-34 `; let h = ''; for (let i = -2; i <= 2; i++) { const x = i * 14, y = -34 - (2 - Math.abs(i)) * 6; h += `M${x},${y + 6} Q${x - 8},${y - 12} ${x},${y - 28} Q${x + 8},${y - 12} ${x},${y + 6} Z `; }
    return x5Ink(d, 4) + `<path d="${h}" fill="#C9B98E" stroke="#111" stroke-width="3"/>`; },
  sack: () => `<path d="M-26,-30 L26,-30 L18,-18 Q40,0 34,26 Q28,40 0,40 Q-28,40 -34,26 Q-40,0 -18,-18 Z" fill="#CDBF9C" stroke="#111" stroke-width="3.5"/><path d="M-20,-22 L20,-22" stroke="${X5.mute2}" stroke-width="5"/>`,
  bill: (col = X5.green) => `<rect x="-40" y="-20" width="80" height="40" fill="${col}" stroke="#111" stroke-width="3"/><ellipse cx="0" cy="0" rx="11" ry="13" fill="none" stroke="#111" stroke-width="2.5"/><rect x="-32" y="-12" width="10" height="24" fill="none" stroke="#111" stroke-width="1.5"/><rect x="22" y="-12" width="10" height="24" fill="none" stroke="#111" stroke-width="1.5"/>`,
  loaf: () => `<path d="M-26,10 Q-28,-14 0,-16 Q28,-14 26,10 Z" fill="#B88A55" stroke="#111" stroke-width="3"/><path d="M-12,-10 l-4,10 M0,-12 l-4,10 M12,-10 l-4,10" stroke="#111" stroke-width="2.5"/>`,
  bar: () => `<path d="M-34,14 L-24,-10 L24,-10 L34,14 Z" fill="${X5.goldTone}" stroke="#111" stroke-width="3"/><path d="M-22,-6 L20,-6" stroke="#C9A657" stroke-width="2.5"/>`,
  coin: (col = X5.goldTone) => `<circle r="22" fill="${col}" stroke="#111" stroke-width="3"/><circle r="15" fill="none" stroke="#111" stroke-width="1.5" opacity="0.6"/>`,
  shoe: () => `<path d="M-30,10 L-30,-22 L-12,-22 L-8,-6 Q18,-4 30,4 L30,14 L-30,14 Z" fill="#3E3428" stroke="#111" stroke-width="3"/>`,
  coat: () => `<path d="M-12,-30 L-30,-20 L-36,30 L36,30 L30,-20 L12,-30 Q0,-18 -12,-30 Z" fill="${X5.mute}" stroke="#111" stroke-width="3"/><path d="M0,-20 L0,30" stroke="#111" stroke-width="2"/>`,
  mill: () => `<path d="M-90,50 L-90,-10 L-40,-40 L10,-10 L10,-30 L90,-30 L90,50 Z" fill="${X5.mute2}" stroke="#111" stroke-width="4"/>` + [-60, -30, 40, 70].map((x, i) => `<rect x="${x - 7}" y="${-110 + (i % 2) * 20}" width="14" height="${80 - (i % 2) * 20}" fill="${X5.mute2}" stroke="#111" stroke-width="3.5"/>`).join('') +
    [-70, -40, -10, 20, 50].map((x) => `<rect x="${x}" y="8" width="16" height="18" fill="#FFB15C" stroke="#111" stroke-width="2"/>`).join(''),
};
const x5Icon = (n, x, y, k = 1, a) => x5At(x, y, k, X5I[n](a));
// a price tag (screen), text centred
const x5Tag = (x, y, txt, k = 1, rot = 0, sc = 1) => { if (k <= 0.01) return ''; const hw = Math.max(70, txt.length * 32 * 0.36 + 24);
  return `<g transform="translate(${f1(x)},${f1(y)}) rotate(${rot}) scale(${sc})" opacity="${f1(Math.min(1, k))}"><path d="M${f1(-hw)},-26 L${f1(hw - 18)},-26 L${f1(hw + 6)},0 L${f1(hw - 18)},26 L${f1(-hw)},26 Z" fill="${X5.cream}" stroke="#111" stroke-width="3"/><circle cx="${f1(hw - 14)}" cy="0" r="5" fill="#111"/>` +
  `<text x="-10" y="11" font-family="Abril" font-size="32" fill="#111" text-anchor="middle">${txt}</text></g>`; };

/* ================= ep5_x_weapons (ch 3) ================= */
const X5_WEAP = {sec: 13, title: 0.3, w1: 1.0, w2: 2.3, w3: 3.6, o0: 5.0, o1: 5.4, o2: 6.6, o3: 7.8, o4: 9.0};
function renderX5Weapons(t, C = X5_WEAP) {
  const s = [x5Sheet(t)], scr = [];
  s.push(x5Teal('M960,140 L960,980', 5, x5In(C.title, t, 0.8)));
  scr.push(x5Op(x5In(C.title, t), tapeS(200, 96, "WORKERS' TOOLS", 52, -2, 1, 81)));
  scr.push(x5Op(x5In(C.o0, t), tapeS(1040, 96, "OWNERS' WEAPONS", 52, -2, 1, 82)));
  const rowsL = [['people', 'UNION', C.w1], ['table', 'COLLECTIVE BARGAINING', C.w2], ['strike', 'STRIKE', C.w3]];
  const rowsR = [['blacklist', 'BLACKLIST', C.o1], ['lockout', 'LOCKOUT', C.o2], ['breakers', 'STRIKEBREAKERS', C.o3], ['courts', 'COURTS AND SOLDIERS', C.o4]];
  rowsL.forEach(([ic, w, t0], i) => { const y = 300 + i * 190, k = x5Pop(t0, t); s.push(x5Icon(ic, 300, y, k * 0.95)); scr.push(x5Op(x5In(t0, t, 0.3), x5Ab(390, y + 18, w, 42))); });
  rowsR.forEach(([ic, w, t0], i) => { const y = 280 + i * 165, k = x5Pop(t0, t); s.push(x5Icon(ic, 1090, y, k * 0.85)); scr.push(x5Op(x5In(t0, t, 0.3), x5Ab(1170, y + 18, w, 42))); });
  return x5Frame(t, s.join(''), scr.join(''));
}

/* ================= ep5_x_unions (ch 4) ================= */
const X5_UN = {sec: 13, k: 0.3, k1: 1.1, k2: 2.0, k3: 2.9, a: 4.0, a1: 4.8, a2: 5.7, a3: 6.6, hay: 7.8, crack: 8.2, last: 9.8};
function renderX5Unions(t, C = X5_UN) {
  const s = [x5Sheet(t, {rules: false})], scr = [];
  const col = (x, title, rows, ts, tilt, fade) => {
    const g = [`<rect x="${x}" y="230" width="720" height="640" fill="#F7F1E3" stroke="#111" stroke-width="4"/>`];
    for (let yy = 330; yy < 860; yy += 54) g.push(`<rect x="${x}" y="${yy}" width="720" height="1.5" fill="${X5.rule}" opacity="0.3"/>`);
    g.push(x5Ab(x + 360, 300, title, 54, X5.ink, 'middle'), x5Teal(`M${x + 40},322 L${x + 680},322`, 5));
    rows.forEach((r, i) => { const k = x5In(ts[i], t, 0.3); g.push(x5Op(k, `<circle cx="${x + 62}" cy="${438 + i * 150}" r="12" fill="${X5.teal}" stroke="#111" stroke-width="3"/>` + x5Ab(x + 100, 456 + i * 150, r, 46))); });
    return `<g transform="rotate(${f1(tilt)}, ${x + 360}, 870)" opacity="${f1(1 - fade)}">${g.join('')}</g>`;
  };
  const ck = x5In(C.crack, t, 1.0), tilt = -3 * ck;
  s.push(x5Op(x5In(C.k, t), col(200, 'KNIGHTS OF LABOR', ['EVERYONE', 'BIG GOALS', 'ARBITRATION'], [C.k1, C.k2, C.k3], tilt, 0.3 * ck)));
  s.push(x5Op(x5In(C.a, t), col(1000, 'AFL', ['SKILLED WORKERS', 'BREAD AND BUTTER', 'COLLECTIVE BARGAINING'], [C.a1, C.a2, C.a3], 0, 0)));
  if (ck > 0) { // the crack runs down the Knights' column
    const P = [[520, 230], [548, 300], [500, 380], [560, 470], [510, 560], [575, 650], [520, 740], [560, 870]], pp = xpPartial(P, ck);
    s.push(`<g transform="rotate(${f1(tilt)}, 560, 870)"><polyline points="${pts(pp)}" fill="none" stroke="#111" stroke-width="9" stroke-linejoin="round"/><polyline points="${pts(pp)}" fill="none" stroke="${X5.paper}" stroke-width="2.5" stroke-linejoin="round"/></g>`);
  }
  scr.push(x5Slap(330, 900, 'HAYMARKET · 1886', 48, C.hay, t, 83, -3));
  const lk = x5In(C.last, t, 0.5);
  if (lk > 0) s.push(x5Op(lk, `<rect x="992" y="222" width="736" height="656" fill="none" stroke="${X5.teal}" stroke-width="8"/>`));
  scr.push(x5Op(lk, x5Pen(1240, 950, 'it lasted', 36, -3)));
  scr.push(x5Op(x5In(C.k, t), x5Mono(560, 190, 'TWO KINDS OF UNIONS', 28, '#5A5244', 'middle').replace('x="560"', 'x="960"')));
  return x5Frame(t, s.join(''), scr.join(''));
}

/* ================= ep5_x_charge (ch 5) ================= */
const X5_CH = {sec: 10, c: 0.4, f: 2.0, m: 3.6, n1: 5.0, n2: 6.0};
function renderX5Charge(t, C = X5_CH) {
  const s = [xpBoard(7)], scr = [];
  const nameCard = (x, y, name, role, k) => x5At(x, y, k, `<rect x="-330" y="-62" width="660" height="124" fill="#000" opacity="0.4" filter="url(#soft)" transform="translate(8,10)"/><rect x="-330" y="-62" width="660" height="124" fill="${X5.cream}"/>` +
    `<rect x="-330" y="20" width="660" height="1.5" fill="${X5.rule}" opacity="0.35"/>` + x5Ab(0, -2, name, 50, X5.ink, 'middle') + x5Mono(0, 50, role, 28, '#4A4438', 'middle') + `<rect x="-40" y="-76" width="80" height="26" fill="${X5.orange}" transform="rotate(-4)"/>`);
  scr.push(nameCard(760, 190, 'ANDREW CARNEGIE', 'OWNER', x5Pop(C.c, t)));
  s.push(xpArrow([[760, 262], [760, 390]], x5In(C.f - 0.4, t, 0.5), {w: 6}));
  scr.push(nameCard(760, 470, 'HENRY CLAY FRICK', 'RUNS IT FOR HIM', x5Pop(C.f, t)));
  s.push(xpArrow([[760, 542], [760, 680]], x5In(C.m - 0.4, t, 0.5), {w: 6}));
  s.push(x5At(760, 830, x5Pop(C.m, t) * 1.25, X5I.mill()));
  scr.push(tag(600, 1000, 'THE HOMESTEAD MILL', x5In(C.m, t)));
  scr.push(x5Op(x5In(C.n1, t), x5Pen(1180, 220, 'the boss', 40, -4)));
  scr.push(x5Op(x5In(C.n2, t), x5Pen(1180, 500, "the boss's tough guy", 40, -4)));
  return x5Frame(t, s.join(''), scr.join(''));
}

/* ================= ep5_x_owen3 (ch 6) ================= */
const X5_O3 = {sec: 10, title: 0.3, p1: 1.0, p2: 2.8, p3: 4.6, fall: 5.0, worst: 6.6};
function renderX5Owen3(t, C = X5_O3) {
  const s = [x5Sheet(t, {rules: false})], scr = [];
  scr.push(x5Op(x5In(C.title, t), tapeS(200, 96, "FARMERS' THREE PROBLEMS", 52, -2, 1, 84)));
  [['house', 'DEBT', C.p1], ['train', 'RAILROADS', C.p2], ['wheat', 'FALLING PRICES', C.p3]].forEach(([ic, w, t0], i) => {
    const x = 250 + i * 520, k = x5Pop(t0, t);
    s.push(x5Op(Math.min(1, k), `<rect x="${x}" y="260" width="460" height="620" fill="#F7F1E3" stroke="#111" stroke-width="4" transform="rotate(${[-1.2, 0.8, -0.6][i]}, ${x + 230}, 570)"/>`));
    scr.push(x5Op(x5In(t0, t, 0.3), x5Ab(x + 230, 380, String(i + 1), 90, X5.teal, 'middle').replace('fill="#2FE0C4"', 'fill="#2FE0C4" stroke="#111" stroke-width="3" paint-order="stroke"')));
    s.push(x5Icon(ic, x + 230, 560, k * 1.5));
    scr.push(x5Op(x5In(t0, t, 0.3), x5Ab(x + 230, 800, w, 44, X5.ink, 'middle')));
  });
  // the falling price line under the wheat
  const fk = x5In(C.fall, t, 1.2);
  if (fk > 0) s.push(xpArrow([[1330, 640], [1400, 660], [1440, 650], [1500, 700], [1540, 690], [1610, 740]], fk, {w: 6}));
  scr.push(x5Op(x5In(C.worst, t), x5Pen(1410, 960, 'the worst', 36, -4)));
  return x5Frame(t, s.join(''), scr.join(''));
}

/* ================= ep5_x_loan (ch 7) ================= */
const X5_LO = {sec: 13, debt: 0.4, p1: 1.8, s1: 2.4, p2: 5.0, s2: 5.6, same: 8.6};
function renderX5Loan(t, C = X5_LO) {
  const s = [x5Sheet(t, {rules: false})], scr = [];
  // the debt, top centre, with one small glint
  const dk = x5Pop(C.debt, t);
  scr.push(x5At(960, 190, dk, `<rect x="-230" y="-62" width="460" height="124" fill="${X5.cream}" stroke="#111" stroke-width="4"/>` + x5Ab(0, 22, '$1,000 DEBT', 62, X5.ink, 'middle')) + x4Glint(1170, 140, 10, dk, t));
  // stacks: each sack is 100 bushels
  const stack = (cx, n, t0, cols) => { let g = ''; for (let i = 0; i < n; i++) { const r = Math.floor(i / cols), c = i % cols, k = x5Pop(t0 + i * 0.05, t, 0.3); g += x5Icon('sack', cx - (cols - 1) * 44 + c * 88, 800 - r * 86, k * 1.05); } return g; };
  s.push(stack(520, 10, C.s1, 5));
  s.push(stack(1400, 20, C.s2, 5));
  scr.push(tag(320, 420, 'WHEAT: $1 A BUSHEL', x5In(C.p1, t)));
  scr.push(tag(1170, 420, 'WHEAT: 50 CENTS', x5In(C.p2, t)));
  scr.push(x5Op(x5In(C.s1 + 0.6, t), x5Ab(520, 900, '1,000 BUSHELS', 46, X5.ink, 'middle')));
  scr.push(x5Op(x5In(C.s2 + 1.1, t), x5Ab(1400, 900, '2,000 BUSHELS', 46, X5.ink, 'middle')));
  s.push(x5Op(x5In(C.p2 - 0.3, t), xpArrow(xpCurve([800, 700], [1080, 700], 60), x5In(C.p2 - 0.3, t, 0.6), {w: 6})));
  scr.push(x5Slap(560, 940, 'SAME DEBT. TWICE THE WORK.', 46, C.same, t, 85, -2));
  return x5Frame(t, s.join(''), scr.join(''));
}

/* ================= ep5_x_inflation (ch 7) ================= */
const X5_IN = {sec: 11, title: 0.3, pour: 0.8, more: 2.0, same: 3.2, climb: 4.4, word: 7.0};
function renderX5Inflation(t, C = X5_IN) {
  const s = [x5Sheet(t, {rules: false})], scr = [];
  scr.push(x5Op(x5In(C.title, t), tapeS(200, 96, 'GREENBACKS', 52, -2, 1, 86)));
  // paper money pours into a pile on the left
  const r = rng(5), nb = 46;
  for (let i = 0; i < nb; i++) {
    const t0 = C.pour + i * 0.07, u = clamp01((t - t0) / 0.7); if (u <= 0) continue;
    const px = 330 + (r() - 0.5) * 300 * (0.5 + i / nb), py = 840 - Math.floor(i / 6) * 22 - r() * 10, rot = (r() - 0.5) * 50, sx0 = 330 + (r() - 0.5) * 120;
    const x = lerp(sx0, px, ease(u)), y = lerp(150, py, u * u);
    s.push(x5At(x, y, 0.9, X5I.bill(), rot + (1 - u) * 160));
  }
  scr.push(tag(200, 990, 'LOTS MORE MONEY', x5In(C.more, t)));
  // the same goods with their tags; the tags climb
  const climb = x5In(C.climb, t, 2.0);
  [['loaf', 1000], ['shoe', 1270], ['coat', 1540]].forEach(([ic, x], i) => {
    s.push(x5Icon(ic, x, 830, x5Pop(C.same + i * 0.15, t) * 1.6));
    const ty = 690 - climb * (220 + i * 30);
    s.push(x5Op(x5In(C.same + i * 0.15, t), x5Ink(`M${x},780 L${x},${f1(ty + 26)}`, 2.5)));
    s.push(x5Tag(x, ty, 'PRICE', x5In(C.same + i * 0.15, t), -4));
    if (climb > 0.02) s.push(x5Teal(`M${x + 100},700 L${x + 100},${f1(700 - 230 * climb)} M${x + 86},${f1(714 - 230 * climb)} L${x + 100},${f1(700 - 230 * climb)} L${x + 114},${f1(714 - 230 * climb)}`, 5));
  });
  scr.push(tag(1060, 990, 'THE SAME AMOUNT OF STUFF', x5In(C.same, t)));
  scr.push(x5Slap(1050, 150, 'INFLATION', 64, C.word, t, 87, -3));
  return x5Frame(t, s.join(''), scr.join(''));
}

/* ================= ep5_x_gold (ch 7) ================= */
const X5_GO = {sec: 10, title: 0.3, vault: 0.6, bills: 1.8, chain: 3.0, note: 5.6};
function renderX5Gold(t, C = X5_GO) {
  const s = [xpBoard(11)], scr = [];
  scr.push(x5Op(x5In(C.title, t), tapeS(150, 90, 'THE GOLD STANDARD', 52, -2, 1, 88)));
  // the vault: a thick round door swung open, bars stacked inside
  const vk = x5In(C.vault, t, 0.6);
  s.push(x5Op(vk, `<rect x="460" y="610" width="1000" height="360" fill="#16302C" stroke="${X5.pale}" stroke-width="4"/><rect x="480" y="630" width="960" height="320" fill="#0E1C1A"/>` +
    `<ellipse cx="1500" cy="790" rx="70" ry="170" fill="#2B4744" stroke="${X5.pale}" stroke-width="4"/><circle cx="1500" cy="790" r="34" fill="none" stroke="${X5.pale}" stroke-width="4"/>`));
  const bars = [];
  for (let i = 0; i < 8; i++) { const x = 560 + i * 110, y = 920; bars.push([x, y - 30]); s.push(x5Op(vk, x5Icon('bar', x, y, 1.3) + x5Icon('bar', x + 55, y - 34, 1.1).replace(/^/, ''))); }
  for (let i = 0; i < 8; i++) s.push(x4Glint(560 + i * 110 + 16, 900, 7, vk * 0.8, t + i));
  // dollar bills in a row above, each chained to a bar
  for (let i = 0; i < 8; i++) {
    const x = 560 + i * 110, k = x5Pop(C.bills + i * 0.08, t);
    s.push(x5Icon('bill', x, 330, k * 1.1, X5.cream));
    const ck = x5In(C.chain + i * 0.15, t, 0.5);
    if (ck > 0) { const y0 = 356, y1 = lerp(y0, 860, ck); let d = ''; for (let y = y0; y < y1 - 8; y += 22) d += `M${x - 6},${y} a6,9 0 1 0 12,0 a6,9 0 1 0 -12,0 `; s.push(x5Teal(d, 3)); }
  }
  scr.push(tag(600, 220, 'EVERY DOLLAR TIED TO GOLD', x5In(C.chain + 1.0, t)));
  scr.push(x5Op(x5In(C.note, t), x5Pen(1150, 190, 'only as many dollars', 30, -3) + x5Pen(1190, 260, 'as it had gold', 30, -3)));
  return x5Frame(t, s.join(''), scr.join(''));
}

/* ================= ep5_x_bread (ch 7) ================= */
const X5_BR = {sec: 13, money: 0.5, loaves: 1.4, price: 3.0, more: 5.0, still: 6.6, drop: 7.8, word: 9.6};
function renderX5Bread(t, C = X5_BR) {
  const s = [x5Sheet(t, {rules: false})], scr = [];
  // the town's 100 dollars: a fixed stack of ten bills (each $10) on the left
  for (let i = 0; i < 10; i++) s.push(x5Icon('bill', 360 + (i % 2) * 8, 760 - i * 22, x5Pop(C.money + i * 0.03, t) * 1.4, X5.cream));
  s.push(x4Glint(440, 540, 8, x5In(C.money, t), t));
  scr.push(x5Op(x5In(C.money + 0.3, t) * (1 - x5In(C.still - 0.3, t, 0.3)), x5Ab(380, 900, '100 DOLLARS', 46, X5.ink, 'middle')));
  scr.push(x5Op(x5In(C.still, t), x5Ab(380, 900, 'STILL 100 DOLLARS', 40, X5.ink, 'middle')));
  // the loaves: 100 in a 10 x 10 grid, then 200 (the grid fills out to 20 x 10)
  for (let i = 0; i < 200; i++) {
    const r = Math.floor(i / 20), c = i % 20, second = c >= 10, t0 = second ? C.more + (c - 10) * 0.08 + r * 0.02 : C.loaves + i * 0.006, k = x5Pop(t0, t, 0.3);
    s.push(x5Icon('loaf', 760 + c * 52 + (second ? 20 : 0), 360 + r * 46, k * 0.78));
  }
  scr.push(x5Op(x5In(C.loaves + 0.5, t) * (1 - x5In(C.more + 0.8, t, 0.3)), x5Ab(1000, 880, '100 LOAVES', 46, X5.ink, 'middle')));
  scr.push(x5Op(x5In(C.more + 1.1, t), x5Ab(1270, 880, '200 LOAVES', 46, X5.ink, 'middle')));
  // the price tag: $1 a loaf, dropping to 50 cents
  const dk = x5In(C.drop, t, 0.5);
  scr.push(x5Tag(1050, 210, '$1 A LOAF', x5In(C.price, t) * (1 - dk), -3, 1.5));
  scr.push(x5Tag(1050, 230, '50 CENTS', dk, 4, 1.5));
  if (dk > 0) s.push(x5Teal(`M1330,170 L1330,${f1(170 + 100 * dk)} M1316,${f1(156 + 100 * dk)} L1330,${f1(170 + 100 * dk)} L1344,${f1(156 + 100 * dk)}`, 5));
  scr.push(x5Slap(1290, 920, 'DEFLATION', 60, C.word, t, 89, -3));
  scr.push(x5Op(x5In(C.word + 0.3, t), x5Pen(260, 980, 'more stuff, same money', 30, -2)));
  return x5Frame(t, s.join(''), scr.join(''));
}

/* ================= ep5_x_silver (ch 7) ================= */
const X5_SI = {sec: 11, title: 0.3, gold: 0.8, silver: 1.8, climb: 4.0, note: 7.0};
function renderX5Silver(t, C = X5_SI) {
  const s = [xpBoard(13)], scr = [];
  scr.push(x5Op(x5In(C.title, t), tapeS(150, 90, 'FREE SILVER', 56, -2, 1, 90)));
  for (let i = 0; i < 6; i++) { const k = x5Pop(C.gold + i * 0.06, t); s.push(x5Icon('coin', 260 + i * 64, 700, k * 1.4)); s.push(x4Glint(270 + i * 64, 688, 6, k * 0.8, t + i)); }
  for (let i = 0; i < 9; i++) { const u = clamp01((t - C.silver - i * 0.12) / 0.6), x = 260 + (i % 6) * 64 + (i >= 6 ? 32 : 0), y = lerp(260, i >= 6 ? 560 : 630, ease(u)); if (u > 0) s.push(x5Icon('coin', x, y, 1.4, X5.silver)); }
  scr.push(tag(200, 820, 'GOLD DOLLARS', x5In(C.gold, t)));
  scr.push(tag(200, 900, '+ SILVER DOLLARS TOO', x5In(C.silver + 0.6, t)));
  s.push(x5Op(x5In(C.silver + 1.2, t), xpArrow(xpCurve([720, 620], [1050, 620], 60), x5In(C.silver + 1.2, t, 0.6), {w: 6})));
  // the wheat price gauge
  const gx = 1320, top = 260, bot = 860, ck = x5In(C.climb, t, 2.6), lvl = lerp(0.5, 0.92, ck), yl = bot - (bot - top) * lvl;
  s.push(`<rect x="${gx}" y="${top}" width="110" height="${bot - top}" fill="#0E1C1A" stroke="${X5.pale}" stroke-width="4"/>`);
  s.push(`<rect x="${gx + 12}" y="${f1(yl)}" width="86" height="${f1(bot - yl - 10)}" fill="${X5.teal}" opacity="0.9"/>`);
  for (const [v, lab] of [[1, '$1'], [0.5, '50 CENTS']]) { const y = bot - (bot - top) * v; s.push(`<rect x="${gx - 20}" y="${y - 2}" width="150" height="4" fill="${X5.cream}"/>`); scr.push(x5Mono(gx + 150, y + 10, lab, 30, X5.cream)); }
  s.push(x5Icon('wheat', gx + 55, bot + 80, 0.9));
  scr.push(x5Mono(gx + 55, 220, 'WHEAT', 30, X5.cream, 'middle'));
  if (ck > 0.02 && ck < 1) s.push(x5Teal(`M${gx - 60},${f1(yl + 60)} L${gx - 60},${f1(yl - 10)} M${gx - 74},${f1(yl + 4)} L${gx - 60},${f1(yl - 10)} L${gx - 46},${f1(yl + 4)}`, 5));
  scr.push(x5Op(x5In(C.note, t), x5Pen(560, 1000, "owen's debt gets easier", 34, -3)));
  return x5Frame(t, s.join(''), scr.join(''));
}

/* ================= ep5_x_spoils (ch 8) ================= */
const X5_SP = {sec: 12, title: 0.3, line: 0.8, jobs: 2.4, test: 6.0, pass: 7.4};
function renderX5Spoils(t, C = X5_SP) {
  const s = [x5Sheet(t, {rules: false})], scr = [];
  scr.push(x5Op(x5In(C.title, t), tapeS(200, 96, 'THE SPOILS SYSTEM', 52, -2, 1, 91)));
  const tk = x5In(C.test, t, 0.6);
  // the office door with its sign, the line shuffling toward it
  s.push(`<rect x="1260" y="380" width="260" height="480" fill="${X5.mute2}" stroke="#111" stroke-width="5"/><rect x="1290" y="420" width="200" height="160" fill="#2B4744" stroke="#111" stroke-width="3"/><circle cx="1480" cy="640" r="10" fill="#C9A657" stroke="#111" stroke-width="3"/>`);
  s.push(`<rect x="1200" y="300" width="380" height="64" fill="${X5.cream}" stroke="#111" stroke-width="4"/>`);
  scr.push(x5Op(1 - tk, x5Mono(1390, 344, 'GOVERNMENT JOBS', 28, X5.ink, 'middle')));
  s.push(x5Ink('M200,860 L1700,860', 5));
  const hats = ['bowler', 'top', 'cap', 'bowler', 'cap', 'bowler', 'top', 'cap'];
  for (let i = 0; i < 8; i++) { const ap = x5In(C.line + i * 0.12, t, 0.4), step = Math.sin(t * 5 + i) * 2, shuffle = Math.min(1, Math.max(0, t - C.line) / 6) * 40;
    s.push(x5Op(ap, x4Man(1150 - i * 110 + shuffle + step * 0.5, 860, 230, i === 0 ? '#1A2422' : '#2B2A26', hats[i], {stroke: X5.pale}))); }
  // the party man at the door hands out a job: a little paper slips to the first in line
  scr.push(tag(240, 990, 'JOBS FOR PARTY FRIENDS', x5In(C.jobs, t) * (1 - tk)));
  // the civil service test card slides in over the right
  scr.push(x5Op(tk ** 3, x5At(lerp(1960, 1500, ease(tk)), 520, tk > 0 ? 1 : 0, `<rect x="-250" y="-300" width="500" height="600" fill="#000" opacity="0.4" filter="url(#soft)" transform="translate(10,14)"/><rect x="-250" y="-300" width="500" height="600" fill="${X5.cream}" transform="rotate(3)"/>` +
    `<g transform="rotate(3)">${x5Ab(0, -200, 'CIVIL SERVICE', 50, X5.ink, 'middle')}${x5Mono(0, -150, 'EXAMINATION', 24, '#4A4438', 'middle')}` +
    [0, 1, 2].map((k) => `<rect x="-190" y="${-90 + k * 100}" width="44" height="44" fill="none" stroke="#111" stroke-width="3"/><rect x="-120" y="${-72 + k * 100}" width="${[260, 220, 290][k]}" height="6" fill="#7A6F58"/>`).join('') + '</g>', 0)));
  for (let k = 0; k < 3; k++) scr.push(x5Op(tk, `<g transform="rotate(3, 1500, 520)">${x5Check(1500 - 168 + 8, 520 - 90 + k * 100 + 22, x5In(C.pass + k * 0.3, t, 0.4))}</g>`));
  scr.push(tag(240, 990, 'THE PENDLETON ACT: PASS A TEST', x5In(C.test + 0.4, t)));
  return x5Frame(t, s.join(''), scr.join(''));
}

/* ================= ep5_x_omaha (ch 8) ================= */
const X5_OM = {sec: 11, title: 0.3, i: [1.2, 2.4, 3.6, 4.8, 6.0]};
const X5_OM_ITEMS = ['FREE SILVER', 'INCOME TAX', 'SENATORS ELECTED BY VOTERS', 'GOVERNMENT-RUN RAILROADS', 'EIGHT-HOUR DAY'];
function renderX5Omaha(t, C = X5_OM) {
  const s = [x5Sheet(t)], scr = [];
  scr.push(x5Op(x5In(C.title, t), tapeS(200, 96, 'THE OMAHA PLATFORM', 56, -2, 1, 92)));
  scr.push(x5Op(x5In(C.title + 0.3, t), x5Mono(250, 250, "THE PEOPLE'S PARTY · OMAHA, NEBRASKA · JULY 4, 1892", 26, '#4A4438')));
  X5_OM_ITEMS.forEach((w, i) => { const y = 380 + i * 128, k = x5In(C.i[i], t, 0.3);
    s.push(x5Op(k, `<rect x="300" y="${y - 40}" width="56" height="56" fill="none" stroke="#111" stroke-width="4"/>`));
    s.push(x5Check(328, y - 14, x5In(C.i[i] + 0.15, t, 0.4), 1.3));
    scr.push(x5Op(k, x5Ab(400, y + 8, w, 52))); });
  return x5Frame(t, s.join(''), scr.join(''));
}

if (typeof window !== 'undefined') Object.assign(window, {renderX5Weapons, renderX5Unions, renderX5Charge, renderX5Owen3, renderX5Loan, renderX5Inflation, renderX5Gold, renderX5Bread, renderX5Silver, renderX5Spoils, renderX5Omaha, X5I});
Object.assign(CLIPS, {
  ep5_x_weapons: {sec: X5_WEAP.sec, render: (t) => renderX5Weapons(t)},
  ep5_x_unions: {sec: X5_UN.sec, render: (t) => renderX5Unions(t)},
  ep5_x_charge: {sec: X5_CH.sec, render: (t) => renderX5Charge(t)},
  ep5_x_owen3: {sec: X5_O3.sec, render: (t) => renderX5Owen3(t)},
  ep5_x_loan: {sec: X5_LO.sec, render: (t) => renderX5Loan(t)},
  ep5_x_inflation: {sec: X5_IN.sec, render: (t) => renderX5Inflation(t)},
  ep5_x_gold: {sec: X5_GO.sec, render: (t) => renderX5Gold(t)},
  ep5_x_bread: {sec: X5_BR.sec, render: (t) => renderX5Bread(t)},
  ep5_x_silver: {sec: X5_SI.sec, render: (t) => renderX5Silver(t)},
  ep5_x_spoils: {sec: X5_SP.sec, render: (t) => renderX5Spoils(t)},
  ep5_x_omaha: {sec: X5_OM.sec, render: (t) => renderX5Omaha(t)},
});
