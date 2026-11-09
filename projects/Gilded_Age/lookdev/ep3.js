// Episode 3 (Immigration), DRAFT sets (load after ep2_more.js; uses rig.js, explainers.js' camera/labels/frame, mansion.js' glow,
// msDefs and msHorse, ep2_more.js' camAt). About 1884, so the immigrant station is Castle Garden at the Battery, not Ellis Island.
//
//   ep3_steerage       An Atlantic steamship of the 1880s, side-on and cut open: first class in the saloon above, steerage packed
//                      into the 'tween deck below, stokers at the boilers under that. The camera pushes into steerage.
//   ep3_castle_garden  The round old fort at the Battery with its 1880s roof and lantern; a barge brings immigrants in. Then the
//                      rotunda inside: clerks at high desks, families waiting with bundles.
//   ep3_moving_in      The Kellys' Brooklyn street: the new family carries a feather bed, a samovar and a trunk up the stoop while
//                      Ma Kelly watches from her window, arms folded. A horsecar passes.
//   ep3_sweatshop      One tenement room turned workshop: treadle machines, a presser with a stove of irons, piles of coats.
//   ep3_letter         A letter written by lamplight with a prepaid ticket folded in, then the route on a map: the Russian Empire,
//                      by rail to Hamburg, by steamship to New York.
//
// Colour rules: coral is only for the Kellys. The Jewish neighbours (composites, not Kellys; names to come) get their own single
// accent, E3.acc, a muted wheat gold. Teal explains, orange is handwriting, everyone else is ink. Real people never get faces;
// these families are composites, so they may. Signs are blank or scribbles, never readable words.

const E3 = {ink: '#0D0C09', teal: '#2FE0C4', cream: '#F4EFE6', orange: '#FF9F1C', coral: '#FF6F61',
  acc: '#E2B864', accTone: '#7A5B22', accLite: '#FFF0C9', warm: '#FFF3D6', paper: '#EDE4D0'};
const E3_TONES = {tone: E3.accTone, lite: E3.accLite};
// the neighbour family in their accent colour (cast keys nfather, nmother, ndaughter, nson); outdoors the father wears a cap and a long coat
function nb(name, o) {
  const base = cast(name, o);
  return figure({...base, fill: o.fill || E3.acc, tones: E3_TONES});
}
const kel = (name, o) => figure(cast(name, o));
const E3_FOLD = {fArm: [168, 82], bArm: [160, 78]}; // arms folded, in profile
const lerp = (a, b, u) => a + (b - a) * u;
function e3Defs(t, extra = '') {
  return msDefs(t).replace('</defs>', grad('e3sea', [['0', '#2B4744'], ['1', '#0B1414']]) + grad('e3overcast', [['0', '#1C3332'], ['0.55', '#4E726C'], ['1', '#A3BAB2']]) +
    grad('e3day', [['0', '#4E726C'], ['0.6', '#A3BAB2'], ['1', '#DFE0D6']]) +
    `<radialGradient id="e3fire"><stop offset="0" stop-color="#FFB15C" stop-opacity="0.75"/><stop offset="0.5" stop-color="#FF7A3C" stop-opacity="0.2"/><stop offset="1" stop-color="#FF7A3C" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="e3lamp"><stop offset="0" stop-color="#FFF3D6" stop-opacity="0.42"/><stop offset="1" stop-color="#FFF3D6" stop-opacity="0"/></radialGradient>` + extra + '</defs>');
}
// a crowd member in ink: kind and hat from a seeded draw, so the same crowd every frame
const E3_KINDS = [['man', 'cap', 'jacket'], ['woman', 'kerchief', 'frock'], ['man', 'bowler', 'sack'], ['woman', 'kerchief', 'frock'], ['boy', 'boycap', 'sack'], ['man', 'cap', 'frock'], ['girl', 'kerchief', 'frock'], ['woman', 'lady', 'frock']];
function e3Person(r, x, y, h, t, col, o = {}) {
  const [kind, hat, coat] = E3_KINDS[Math.floor(r() * E3_KINDS.length)], ph = r(), d = r() < 0.5 ? 1 : -1;
  const hh = kind === 'boy' || kind === 'girl' ? h * 0.62 : kind === 'woman' ? h * 0.92 : h;
  const wear = kind === 'woman' || kind === 'girl' ? ['plain', r() < 0.6 ? 'shawl' : 'apron'] : [];
  return figure({x, y, h: hh, d: o.d ?? d, kind, hat, coat, beard: kind === 'man' && r() < 0.4, wear, fill: col, an: {...POSES.stand(t, ph), ...(o.an || {})}, det: 0, rim: o.rim || null});
}
// a bundle tied in a cloth, a feather bed rolled and roped, a trunk, a samovar, a candlestick: what families carried
const bundle = (x, y, s, col = '#2B4744') => `<path d="M${f1(x - 20 * s)},${f1(y)} q${f1(-6 * s)},${f1(-30 * s)} ${f1(20 * s)},${f1(-34 * s)} q${f1(26 * s)},${f1(4 * s)} ${f1(20 * s)},${f1(34 * s)} Z" fill="${col}"/><path d="M${f1(x - 4 * s)},${f1(y - 34 * s)} l${f1(4 * s)},${f1(-8 * s)} l${f1(4 * s)},${f1(8 * s)}" fill="${col}"/>`;
const featherBed = (x, y, w, h, col = '#DFE0D6', rope = '#0D0C09') => `<rect x="${f1(x)}" y="${f1(y - h)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(h * 0.45)}" fill="${col}"/>` +
  [0.3, 0.7].map((u) => `<rect x="${f1(x + w * u - 2)}" y="${f1(y - h - 1)}" width="4" height="${f1(h + 2)}" fill="${rope}" opacity="0.7"/>`).join('') + `<path d="M${f1(x + w * 0.12)},${f1(y - h * 0.5)} q${f1(w * 0.2)},${f1(-h * 0.2)} ${f1(w * 0.4)},0" stroke="${rope}" stroke-width="1.2" fill="none" opacity="0.3"/>`;
const trunk = (x, y, w, h, col = '#0D0C09', band = '#2B4744') => `<rect x="${f1(x)}" y="${f1(y - h)}" width="${f1(w)}" height="${f1(h)}" fill="${col}"/><path d="M${f1(x)},${f1(y - h)} q${f1(w / 2)},${f1(-h * 0.35)} ${f1(w)},0 Z" fill="${col}"/>` +
  [0.2, 0.8].map((u) => `<rect x="${f1(x + w * u - 3)}" y="${f1(y - h * 1.12)}" width="6" height="${f1(h * 1.12)}" fill="${band}"/>`).join('');
function samovar(x, y, s, col = '#C9A55A', dark = '#0D0C09') { // y: base. Brass urn on feet, tap, chimney, handles
  return `<path d="M${f1(x - 10 * s)},${f1(y)} l${f1(4 * s)},${f1(-8 * s)} l${f1(12 * s)},0 l${f1(4 * s)},${f1(8 * s)} Z" fill="${dark}"/><rect x="${f1(x - 4 * s)}" y="${f1(y - 14 * s)}" width="${f1(8 * s)}" height="${f1(6 * s)}" fill="${col}"/>` +
    `<path d="M${f1(x - 14 * s)},${f1(y - 14 * s)} q${f1(-4 * s)},${f1(-20 * s)} ${f1(2 * s)},${f1(-38 * s)} l${f1(24 * s)},0 q${f1(6 * s)},${f1(18 * s)} ${f1(2 * s)},${f1(38 * s)} Z" fill="${col}"/>` +
    `<rect x="${f1(x - 5 * s)}" y="${f1(y - 60 * s)}" width="${f1(10 * s)}" height="${f1(8 * s)}" fill="${col}"/><path d="M${f1(x - 8 * s)},${f1(y - 60 * s)} l${f1(16 * s)},0 l${f1(-3 * s)},${f1(-6 * s)} l${f1(-10 * s)},0 Z" fill="${dark}"/>` +
    `<path d="M${f1(x - 14 * s)},${f1(y - 40 * s)} q${f1(-9 * s)},${f1(2 * s)} ${f1(-6 * s)},${f1(10 * s)}" stroke="${dark}" stroke-width="${f1(2.4 * s)}" fill="none"/><path d="M${f1(x + 14 * s)},${f1(y - 40 * s)} q${f1(9 * s)},${f1(2 * s)} ${f1(6 * s)},${f1(10 * s)}" stroke="${dark}" stroke-width="${f1(2.4 * s)}" fill="none"/>` +
    `<path d="M${f1(x + 8 * s)},${f1(y - 22 * s)} l${f1(8 * s)},${f1(2 * s)} l0,${f1(4 * s)}" stroke="${dark}" stroke-width="${f1(2 * s)}" fill="none"/><rect x="${f1(x - 12 * s)}" y="${f1(y - 36 * s)}" width="${f1(4 * s)}" height="${f1(16 * s)}" fill="${E3.cream}" opacity="0.35"/>`;
}
const candlestick = (x, y, s, col = '#C9A55A', lit = 0) => `<path d="M${f1(x - 6 * s)},${f1(y)} q${f1(6 * s)},${f1(-6 * s)} ${f1(12 * s)},0 Z" fill="${col}"/><rect x="${f1(x - 1.6 * s)}" y="${f1(y - 22 * s)}" width="${f1(3.2 * s)}" height="${f1(20 * s)}" fill="${col}"/><rect x="${f1(x - 3 * s)}" y="${f1(y - 24 * s)}" width="${f1(6 * s)}" height="${f1(3 * s)}" fill="${col}"/>` +
  (lit ? `<rect x="${f1(x - 1.4 * s)}" y="${f1(y - 34 * s)}" width="${f1(2.8 * s)}" height="${f1(10 * s)}" fill="${E3.cream}"/><path d="M${f1(x)},${f1(y - 41 * s)} q${f1(-2.4 * s)},${f1(4 * s)} 0,${f1(7 * s)} q${f1(2.4 * s)},${f1(-3 * s)} 0,${f1(-7 * s)} Z" fill="${E3.warm}" opacity="${f1(lit)}"/>` : '');

/* ================= ep3_steerage: an Atlantic steamship, cut open ================= */
// A single-screw iron liner of the early 1880s, after the deck views and builders' sections of the period (two raked funnels, three
// masts carrying furled sails, a straight stem, a counter stern). Drawn longer between decks than life so people read: a grown man
// is about 72 px; the ship about 3000 px. Levels: the boat deck on the deckhouse; first class (the saloon) on the main deck amidships;
// steerage in the 'tween deck, fore and aft of the boiler casing; boilers, engine and holds below the waterline.
const SH = {x0: -520, x1: 2520, deck: 200, house: 84, saloon: 330, tween: 462, hold: 690, wl: 540, keel: 760, man: 72, casing: [820, 1180]};
function shipHullPath() { // the hull outline (sheer, straight stem, counter stern, flat bottom with a turn of the bilge)
  const {x0, x1, deck, keel} = SH;
  return `M${x0 + 60},${deck - 24} L${x1 - 40},${deck - 30} L${x1},${deck - 34} L${x1 - 20},${keel - 60} Q${x1 - 50},${keel} ${x1 - 160},${keel} L${x0 + 340},${keel} Q${x0 + 200},${keel} ${x0 + 160},${keel - 120} L${x0 + 120},${keel - 230} Q${x0 + 40},${deck + 60} ${x0},${deck + 20} Z`;
}
function bunks(x0, x1, yTop, yBot, seed) { // two-tier wooden berths in rows, straw ticks on the boards
  const r = rng(seed), s = [], mid = (yTop + yBot) / 2 + 6;
  for (let x = x0; x < x1 - 70; x += 96) {
    s.push(`<rect x="${x}" y="${yTop + 8}" width="5" height="${yBot - yTop - 8}" fill="#2E1F12" opacity="0.9"/><rect x="${x + 82}" y="${yTop + 8}" width="5" height="${yBot - yTop - 8}" fill="#2E1F12" opacity="0.9"/>`);
    for (const yy of [mid, yBot - 14]) s.push(`<rect x="${x}" y="${yy}" width="87" height="6" fill="#3B2A18"/><rect x="${x + 4}" y="${yy - 7}" width="79" height="8" rx="3" fill="#4E726C" opacity="${f1(0.5 + r() * 0.3)}"/>`);
    if (r() < 0.6) s.push(bundle(x + 20 + r() * 40, mid - 6, 0.45, '#24403D'));
  }
  return s.join('');
}
function shipLantern(x, y, t, swing) { const a = swing * Math.sin(t * 1.3);
  return `<g transform="rotate(${f1(a)}, ${x}, ${y})">${line([[x, y], [x, y + 18]], '#0D0C09', 2)}<rect x="${x - 6}" y="${y + 18}" width="12" height="16" fill="#0D0C09"/><rect x="${x - 4}" y="${y + 21}" width="8" height="10" fill="${E3.warm}" opacity="0.9"/></g>` + glowC(x + 30 * Math.sin(a * Math.PI / 180), y + 26, 110, 0.55); }
function renderSteerage(t) {
  const keys = [[0, 0.5, 1000, 40], [3.2, 0.53, 1000, 60], [8.2, 2.85, 1640, 404], [10, 2.95, 1650, 404]];
  const c = cam2(camAt(keys, t)), z = c.z;
  const roll = 0.7 * Math.sin(t * 0.85), heave = 6 * Math.sin(t * 0.85 + 1.2);
  const back = [], ship = [], front = [];
  // sea behind the hull and a low overcast sky band with a far steamer's smoke
  back.push(`<rect x="-3000" y="${SH.wl - 10}" width="9000" height="2000" fill="url(#e3sea)"/>` + MAT.water(-3000, SH.wl - 6, 9000, 600, t, {seed: 31, n: 140, top: '#3E5F5A', bottom: '#0B1414'}));
  back.push(`<path d="M3200,${SH.wl - 4} l60,-14 l220,0 l30,14 Z" fill="#2B4744"/>` + MAT.smoke(3330, SH.wl - 30, t, {col: '5F857F', k: 0.6, n: 5, drift: -160, seed: 32}));
  // the hull, cut open between the casing ends: outer plating left and right of the cut, rooms inside
  const cut0 = -260, cut1 = 2280, {deck, house, saloon, tween, hold, keel, wl} = SH;
  ship.push(`<clipPath id="e3hull"><path d="${shipHullPath()}"/></clipPath>`);
  ship.push(`<path d="${shipHullPath()}" fill="#0D0C09"/>`);
  ship.push(`<g clip-path="url(#e3hull)">`);
  // interiors (back walls), level by level
  ship.push(MAT.planks(cut0, deck, cut1 - cut0, saloon - deck, {base: '#2B2418', seed: 33, size: 12, vertical: true}));                  // saloon panelling
  ship.push(`<rect x="${cut0}" y="${saloon}" width="${cut1 - cut0}" height="${tween - saloon}" fill="#1A2624"/>` + MAT.iron(cut0, saloon, cut1 - cut0, tween - saloon, {base: '#16211F', seams: 44, rivet: 9}));
  ship.push(`<rect x="${cut0}" y="${tween}" width="${cut1 - cut0}" height="${keel - tween}" fill="#101A19"/>` + MAT.iron(cut0, tween, cut1 - cut0, keel - tween, {base: '#0E1716', seams: 52, rivet: 10}));
  // first class: the dining saloon amidships under a skylight; gilt lamps; long tables with diners and stewards
  const sx0 = 380, sx1 = 1720;
  ship.push(`<rect x="${sx0}" y="${deck}" width="${sx1 - sx0}" height="${saloon - deck}" fill="#3A3120" opacity="0.65"/>`);
  for (let x = sx0 + 60; x < sx1; x += 150) ship.push(`<rect x="${x}" y="${deck + 14}" width="70" height="40" fill="#5A4A2A" opacity="0.6"/><rect x="${x + 4}" y="${deck + 18}" width="62" height="32" fill="#C9A55A" opacity="0.25"/>`); // mirrors and panels
  for (let x = sx0 + 140; x < sx1 - 60; x += 300) ship.push(glowC(x, deck + 46, 150, 0.65, 'e3lamp') + `<rect x="${x - 2}" y="${deck}" width="4" height="30" fill="#0D0C09"/><path d="M${x - 16},${deck + 30} l32,0 l-8,14 l-16,0 Z" fill="#C9A55A"/>`);
  for (const [a, b] of [[sx0 + 40, 1010], [1110, sx1 - 40]]) {
    ship.push(`<rect x="${a}" y="${saloon - 46}" width="${b - a}" height="8" fill="#DFE0D6"/><rect x="${a + 10}" y="${saloon - 38}" width="6" height="38" fill="#0D0C09"/><rect x="${b - 16}" y="${saloon - 38}" width="6" height="38" fill="#0D0C09"/>`);
    for (let x = a + 20; x < b - 10; x += 34) ship.push(`<rect x="${x}" y="${saloon - 54}" width="4" height="8" fill="#DFE0D6" opacity="0.8"/>`);
  }
  const R1 = rng(34);
  for (let x = sx0 + 60; x < sx1 - 40; x += 58) { if (Math.abs(x - 1060) < 60) continue;
    const woman = R1() < 0.45, d = R1() < 0.5 ? 1 : -1, ph = R1(), toast = smooth(1.4, 2.0, t) * (1 - smooth(3.0, 3.6, t)) * (R1() < 0.5 ? 1 : 0);
    ship.push(figure({x, y: saloon - 2, h: SH.man * (woman ? 0.9 : 1), d, kind: woman ? 'woman' : 'man', hat: 'none', coat: 'frock', fill: '#0D0C09',
      an: {...POSES.sit(t, ph), fArm: toast ? [40, 10] : [120, 95 + 10 * Math.sin(t * 2 + ph * 9)]}}));
  }
  for (const [x0w, sp] of [[sx0 + 120, 46], [1300, -38]]) { const wx = x0w + sp * ((t * 0.9) % 6);
    ship.push(figure({x: wx, y: saloon, h: SH.man, d: Math.sign(sp), kind: 'man', hat: 'none', coat: 'sack', fill: '#0D0C09', wear: ['apron'], an: {...walkAn(walkPhase(Math.abs(sp) * t * 0.9, SH.man)), fArm: [95, 15]}})); }
  // aft of the saloon: cabins; forward of it: crew's quarters and the galley (stove glow)
  for (let x = cut0 + 20; x < sx0 - 40; x += 110) ship.push(`<rect x="${x}" y="${deck + 12}" width="96" height="${saloon - deck - 12}" fill="#22281C"/><rect x="${x + 8}" y="${deck + 70}" width="80" height="10" fill="#4E726C" opacity="0.6"/><rect x="${x + 8}" y="${deck + 30}" width="80" height="10" fill="#4E726C" opacity="0.6"/>`);
  ship.push(`<rect x="${sx1 + 30}" y="${deck + 50}" width="120" height="70" fill="#0D0C09"/>` + glowC(sx1 + 90, deck + 90, 140, 0.4, 'e3fire'));
  // the boiler casing up through the 'tween deck (the funnels' uptakes), solid
  ship.push(`<rect x="${SH.casing[0]}" y="${saloon}" width="${SH.casing[1] - SH.casing[0]}" height="${tween - saloon}" fill="#0B1211"/>` + MAT.iron(SH.casing[0], saloon, SH.casing[1] - SH.casing[0], tween - saloon, {base: '#0B1211', seams: 30}));
  // steerage, fore and aft: berths, lanterns, portholes, people packed in
  ship.push(bunks(cut0 + 20, SH.casing[0] - 10, saloon, tween, 35) + bunks(SH.casing[1] + 20, cut1 - 30, saloon, tween, 36));
  for (let x = cut0 + 60; x < cut1 - 40; x += 180) { if (x > SH.casing[0] - 30 && x < SH.casing[1] + 30) continue; ship.push(`<circle cx="${x}" cy="${saloon + 36}" r="9" fill="#5F857F" opacity="0.7"/><circle cx="${x}" cy="${saloon + 36}" r="9" fill="none" stroke="#0D0C09" stroke-width="3"/>`); }
  const R2 = rng(37);
  for (let x = cut0 + 40; x < cut1 - 40; x += 34 + R2() * 20) {
    if (x > SH.casing[0] - 20 && x < SH.casing[1] + 20) continue;
    if (Math.abs(x - 1640) < 110) continue; // the family's place
    const lying = R2() < 0.25, sit = R2() < 0.4;
    if (lying) { ship.push(figure({x, y: (saloon + tween) / 2 - 2, h: SH.man * 0.95, d: 1, kind: R2() < 0.5 ? 'man' : 'woman', hat: 'none', fill: '#0D0C09', lie: true, an: POSES.sleep(t)})); continue; }
    ship.push(e3Person(R2, x, sit ? sitY(tween - 8, SH.man * 0.9) : tween, SH.man, t, '#0D0C09', sit ? {an: POSES.sit(t, R2())} : {}));
  }
  // the family (accent): father sits on the lower berth with the bundle and the candlesticks; mother holds the boy; the daughter
  // looks up at the deck above, where first class is dining
  const fx = 1640, up = smooth(7.6, 8.4, t), lod = lodFor(SH.man * z);
  const rimF = {c: E3.warm, a: lod.rimA * 0.9, dx: 0.01, dy: -0.004};
  ship.push(trunk(fx + 60, tween - 2, 46, 26, '#0D0C09') + featherBed(fx - 120, tween - 2, 60, 22, '#A3BAB2'));
  ship.push(nb('nfather', {x: fx - 40, y: sitY(tween - 10, SH.man * 0.97), h: SH.man, d: 1, hat: 'cap', coat: 'frock', det: lod.det, rim: rimF, an: {...POSES.sit(t, 0.1), fArm: [130, 95], tilt: -10}}));
  ship.push(candlestick(fx - 14, tween - 16 - 18, 0.9, E3.acc));
  ship.push(nb('nmother', {x: fx + 20, y: sitY(tween - 10, SH.man * 0.88), h: SH.man, d: -1, det: lod.det, rim: rimF, an: {...POSES.rock(t), tilt: -12}}));
  ship.push(nb('nson', {x: fx + 4, y: tween - 30, h: SH.man, d: -1, lie: true, det: lod.det, rim: rimF, an: POSES.sleep(t)}));
  ship.push(nb('ndaughter', {x: fx + 80, y: tween, h: SH.man, d: -1, hat: 'kerchief', wear: ['plain', 'shawl'], det: lod.det, rim: rimF, an: {...POSES.stand(t, 0.4), tilt: 18 * up + 2, expr: up > 0.5 ? 'awe' : 'neutral'}}));
  for (const x of [cut0 + 260, 520, 1400, 1960, 2200]) ship.push(shipLantern(x, saloon + 6, t + x, 6 + 10 * smooth(6.5, 8, t)));
  // boiler room below the casing: three boilers, furnace doors glowing, stokers shovelling coal; the engine aft; holds forward
  const bx0 = 700, bx1 = 1300;
  for (let k = 0; k < 3; k++) { const x = bx0 + 30 + k * 190, open = Math.max(0, Math.sin(t * 2.2 + k * 2));
    ship.push(MAT.iron(x, tween + 40, 160, 150, {base: '#0E1716', rx: 30, seams: 50}) + `<rect x="${x + 50}" y="${tween + 140}" width="60" height="24" fill="#FFB15C" opacity="${f1(0.25 + 0.6 * open)}"/>` + glowC(x + 80, tween + 152, 160, 0.3 + 0.5 * open, 'e3fire'));
    const sh = Math.abs(Math.sin(t * 2.2 + k * 2)); ship.push(worker({x: x + 150, y: hold, h: SH.man, d: -1, hat: 'none', coat: 'vest', fill: '#0D0C09', an: {fArm: [100 + 40 * sh, 80 + 50 * sh], bArm: [120 + 30 * sh, 90], lean: 14 * sh, legs: [14, -10]}})); }
  ship.push(`<rect x="${bx0 - 10}" y="${hold}" width="${bx1 - bx0 + 20}" height="8" fill="#0D0C09"/>`);
  const crank = t * 3; // the compound engine: two cylinders, rods, a turning crank
  ship.push(MAT.iron(320, tween + 30, 180, 90, {base: '#0E1716', seams: 40}) + `<rect x="330" y="${tween + 120}" width="12" height="70" fill="#0D0C09"/><rect x="480" y="${tween + 120}" width="12" height="70" fill="#0D0C09"/>`);
  ship.push(`<circle cx="410" cy="${hold - 40}" r="34" fill="none" stroke="#2B4744" stroke-width="6"/>` + line([[410, tween + 120], [410 + 34 * Math.cos(crank), hold - 40 + 34 * Math.sin(crank)]], '#4E726C', 8) + line([[cut0, hold - 40], [410, hold - 40]], '#2B4744', 10));
  for (let x = 1360; x < cut1 - 80; x += 110) ship.push(`<rect x="${x}" y="${hold - 70 - (x % 3) * 20}" width="90" height="${70 + (x % 3) * 20}" fill="#1F3532"/><rect x="${x + 6}" y="${hold - 60 - (x % 3) * 20}" width="78" height="4" fill="#0D0C09"/>`);
  // the cut: decks drawn as solid black bands, the hull plating edge
  for (const y of [deck, saloon, tween, hold]) ship.push(`<rect x="${cut0}" y="${y - 6}" width="${cut1 - cut0}" height="12" fill="#0D0C09"/>`);
  ship.push(`</g>`);
  ship.push(`<path d="${shipHullPath()}" fill="none" stroke="#0D0C09" stroke-width="10"/>`);
  // outside plating beyond the cut (left and right of it) with a row of portholes; a boot topping line
  ship.push(`<g clip-path="url(#e3hull)"><rect x="${SH.x0 - 40}" y="0" width="${cut0 - SH.x0 + 40}" height="900" fill="#0D0C09"/><rect x="${cut1}" y="0" width="${SH.x1 - cut1 + 40}" height="900" fill="#0D0C09"/>` +
    `<rect x="${SH.x0}" y="${wl - 6}" width="${SH.x1 - SH.x0}" height="10" fill="#4E726C" opacity="0.5"/></g>`);
  for (let x = SH.x0 + 220; x < SH.x1 - 60; x += 70) if (x < cut0 || x > cut1) ship.push(`<circle cx="${x}" cy="${saloon - 60}" r="6" fill="#5F857F" opacity="0.6"/>`);
  ship.push(`<rect x="${cut0 - 3}" y="${deck - 26}" width="6" height="${keel - deck}" fill="${E3.teal}" opacity="0.0"/>`);
  // above the deck: the deckhouse, lifeboats, two raked funnels, three masts with furled sails and rigging; first-class strollers
  ship.push(`<rect x="420" y="${house}" width="1260" height="${deck - house - 24}" fill="#24403D"/>` + [...Array(18)].map((_, k) => `<rect x="${450 + k * 68}" y="${house + 24}" width="34" height="40" fill="${E3.warm}" opacity="0.35"/>`).join(''));
  ship.push(`<rect x="410" y="${house - 6}" width="1280" height="10" fill="#0D0C09"/>` + [...Array(32)].map((_, k) => `<rect x="${414 + k * 40}" y="${house - 28}" width="3" height="24" fill="#0D0C09"/>`).join('') + `<rect x="410" y="${house - 30}" width="1280" height="4" fill="#0D0C09"/>`);
  for (const x of [470, 1530]) ship.push(`<path d="M${x},${house - 40} q70,26 140,0 Z" fill="#DFE0D6" opacity="0.8"/>` + line([[x + 10, house - 40], [x + 10, house - 90], [x + 30, house - 90]], '#0D0C09', 4) + line([[x + 130, house - 40], [x + 130, house - 90], [x + 110, house - 90]], '#0D0C09', 4));
  const funnel = (x) => `<path d="M${x},${house - 4} L${x + 110},${house - 4} L${x + 50},${house - 420} L${x - 60},${house - 420} Z" fill="#B88A3A"/><path d="M${x - 50},${house - 380} L${x + 56},${house - 380} L${x + 50},${house - 420} L${x - 60},${house - 420} Z" fill="#0D0C09"/>`;
  ship.push(funnel(860) + funnel(1080));
  for (const x of [870, 1090]) ship.push(MAT.smoke(x - 10, house - 430, t, {col: '3E5F5A', k: 1.6, n: 8, drift: -520, rise: 160, speed: 5, seed: x}));
  for (const [x, hgt] of [[2000, 900], [1300, 960], [260, 860]]) {
    ship.push(`<path d="M${x - 9},${deck} L${x - 4},${deck - hgt} L${x + 4},${deck - hgt} L${x + 9},${deck} Z" fill="#0D0C09"/>`);
    for (const [u, w] of [[0.35, 300], [0.62, 230], [0.84, 160]]) { const y = deck - hgt * u; ship.push(line([[x - w / 2, y], [x + w / 2, y]], '#0D0C09', 6) + `<path d="M${x - w / 2 + 10},${y} q${w / 2 - 10},26 ${w - 20},0" fill="#A3BAB2" opacity="0.65"/>`); }
    ship.push(line([[x, deck - hgt], [x + 420, deck - 20]], '#0D0C09', 2) + line([[x, deck - hgt], [x - 420, deck - 20]], '#0D0C09', 2));
    for (let k = -3; k <= 3; k++) if (k) ship.push(line([[x + k * 6, deck - hgt * 0.35], [x + k * 40, deck - 24]], '#0D0C09', 1.4));
  }
  ship.push(line([[2000, deck - 900], [SH.x1 + 380, deck - 70]], '#0D0C09', 2.5) + line([[SH.x1, deck - 34], [SH.x1 + 380, deck - 70]], '#0D0C09', 7)); // bowsprit and forestay
  for (let k = 0; k < 7; k++) { const x = 600 + k * 160, ph = k * 0.4, walk = (k % 2 ? 1 : -1);
    ship.push(figure({x: x + walk * 30 * Math.sin(t * 0.6 + ph), y: house - 6, h: SH.man, d: walk * Math.sign(Math.cos(t * 0.6 + ph)) || 1, kind: k % 2 ? 'woman' : 'man', hat: k % 2 ? 'lady' : 'top', coat: 'frock', fill: '#0D0C09', an: {...walkAn(walkPhase(30 * Math.sin(t * 0.6 + ph) + 40, SH.man), {stride: 14})}})); }
  // in front of the hull: the sea, see-through below the surface (an x-ray of the hold), foam at the bow and in the wake
  let wave = `M-3000,${wl}`; for (let x = -3000; x <= 6000; x += 40) wave += ` L${x},${f1(wl + 7 * Math.sin(x * 0.012 + t * 2.2) + 4 * Math.sin(x * 0.031 - t * 1.4))}`;
  front.push(`<path d="${wave} L6000,3000 L-3000,3000 Z" fill="#1C3332" opacity="0.5"/><path d="${wave}" stroke="#A3BAB2" stroke-width="3" fill="none" opacity="0.7"/>`);
  front.push([...Array(10)].map((_, k) => { const ph = (t * 0.6 + k / 10) % 1; return `<ellipse cx="${f1(SH.x1 + 40 - ph * 900)}" cy="${f1(wl + 8 + ph * 10)}" rx="${f1(30 + ph * 90)}" ry="6" fill="#DFE0D6" opacity="${f1(0.55 * (1 - ph))}"/>`; }).join(''));
  front.push([...Array(12)].map((_, k) => { const ph = (t * 0.5 + k / 12) % 1; return `<ellipse cx="${f1(SH.x0 - ph * 1400)}" cy="${f1(wl + 6)}" rx="${f1(40 + ph * 120)}" ry="5" fill="#DFE0D6" opacity="${f1(0.45 * (1 - ph))}"/>`; }).join(''));
  const shipG = `<g transform="translate(0,${f1(heave)}) rotate(${f1(roll)}, 1000, ${wl})">${ship.join('')}</g>`;
  const sky = `<rect width="1920" height="1080" fill="url(#e3overcast)"/>` + clouds(t, 31);
  const world = layerAt(c, 0.35, `<rect x="-6000" y="${SH.wl - 30}" width="14000" height="30" fill="#4E726C" opacity="0.4"/>`) + layerAt(c, 1, back.join('') + shipG + front.join(''));
  const scr = [tag(40, 1040, 'AN ATLANTIC STEAMSHIP · ABOUT 1884', 1)];
  if (t > 0.8 && t < 3.6) scr.push(penS(c.sx(560), c.sy(deck) - 30, 'first class: a dining saloon', 30, -3), penS(c.sx(1300), c.sy(tween) + 130, 'steerage: hundreds below decks', 30, -3));
  if (t > 8.4) scr.push(penS(1060, 170, 'a week or two at sea', 34, -3), tag(1100, 250, 'COMPOSITE CHARACTERS', smooth(8.4, 8.8, t)));
  return frame(e3Defs(t), sky, world, scr.join(''), t);
}

if (typeof window !== 'undefined') Object.assign(window, {renderSteerage});
Object.assign(CLIPS, {
  ep3_steerage: {sec: 10, render: (t) => renderSteerage(t)},
});
