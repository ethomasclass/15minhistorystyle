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
  if (o.scale) base.h = o.h * o.scale; // e.g. the daughter, about 12, is taller than the rig's default girl
  return e3Shadow(o, base.h) + figure({...base, fill: o.fill || E3.acc, tones: E3_TONES});
}
// a contact shadow where a standing figure's feet meet the floor (skipped for sitting, lying or framed-in-a-window figures,
// or placed at o.floorY when the floor is not at the feet)
function e3Shadow(o, h) {
  if (o.noShadow || o.lie) return '';
  const sitting = o.an && o.an.legs && o.an.legs[0] > 60;
  if (sitting && o.floorY == null) return '';
  return MAT.shadow(o.x, (o.floorY ?? o.y) + 1, h * 0.16, 0.38);
}
const kel = (name, o) => { const c = cast(name, o); return e3Shadow(o, c.h) + figure(o.fold ? {...c, an: {...c.an, ...E3_FOLD, lean: 0}} : c) + (o.fold ? foldedArms(o.x, o.y, c.h, o.d ?? 1, c.fill, c.tones.tone) : ''); };
// folded arms drawn over a profile figure: the near forearm crosses the chest, its elbow jutting out in front, the far hand tucked
// under it; a darker crease separates arm from body so the fold reads at any size
function foldedArms(x, y, h, d, fill, tone) {
  const X = (u) => x + d * u * h, Y = (v) => y - v * h;
  const arm = `M${f1(X(-0.06))},${f1(Y(0.675))} L${f1(X(0.105))},${f1(Y(0.67))} Q${f1(X(0.14))},${f1(Y(0.648))} ${f1(X(0.115))},${f1(Y(0.622))} L${f1(X(-0.06))},${f1(Y(0.628))} Z`;
  return `<path d="M${f1(X(0.03))},${f1(Y(0.8))} L${f1(X(0.118))},${f1(Y(0.655))}" stroke="${tone}" stroke-width="${f1(0.01 * h)}" fill="none" opacity="0.85"/>` +
    `<path d="${arm}" fill="${fill}" stroke="${tone}" stroke-width="${f1(0.01 * h)}"/>`;
}
// arms folded across the chest, in profile: elbows jut forward, forearms run back across the chest (they overlap the body)
const E3_FOLD = {fArm: [150, -92], bArm: [140, -98]};
const lerp = (a, b, u) => a + (b - a) * u;
function e3Defs(t, extra = '') {
  return msDefs(t).replace('</defs>', grad('e3sea', [['0', '#2B4744'], ['1', '#0B1414']]) + grad('e3overcast', [['0', '#1C3332'], ['0.55', '#4E726C'], ['1', '#A3BAB2']]) +
    grad('e3day', [['0', '#4E726C'], ['0.6', '#A3BAB2'], ['1', '#DFE0D6']]) +
    `<radialGradient id="e3fire"><stop offset="0" stop-color="#FFB15C" stop-opacity="0.75"/><stop offset="0.5" stop-color="#FF7A3C" stop-opacity="0.2"/><stop offset="1" stop-color="#FF7A3C" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="e3lamp"><stop offset="0" stop-color="#FFF3D6" stop-opacity="0.42"/><stop offset="1" stop-color="#FFF3D6" stop-opacity="0"/></radialGradient>` + extra + '</defs>');
}
// a crowd member in ink: kind and hat from a seeded draw, so the same crowd every frame
const E3_KINDS = [['man', 'cap', 'jacket'], ['woman', 'kerchief', 'frock'], ['man', 'bowler', 'sack'], ['woman', 'kerchief', 'frock'], ['boy', 'boycap', 'sack'], ['man', 'cap', 'frock'], ['girl', 'kerchief', 'frock'], ['woman', 'kerchief', 'frock']];
function e3Person(r, x, y, h, t, col, o = {}) {
  const [kind, hat, coat] = E3_KINDS[Math.floor(r() * E3_KINDS.length)], ph = r(), d = r() < 0.5 ? 1 : -1;
  const hh = kind === 'boy' || kind === 'girl' ? h * 0.62 : kind === 'woman' ? h * 0.92 : h;
  const wear = kind === 'woman' || kind === 'girl' ? ['plain', r() < 0.6 ? 'shawl' : 'apron'] : [];
  const an = {...POSES.stand(t, ph), ...(o.an || {})};
  return e3Shadow({...o, x, y, an}, hh) + figure({x, y, h: hh, d: o.d ?? d, kind, hat, coat, beard: kind === 'man' && r() < 0.4, wear, fill: col, an, det: 0, rim: o.rim || null});
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
    if (r() < 0.6) s.push(bundle(x + 20 + r() * 40, mid - 6, 0.4, '#1A2624'));
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
  // the floors: deck planking seen going back to the hull side, on every level, so people stand ON something
  ship.push(MAT.floor(cut0, cut1, saloon - 16, saloon + 6, {kind: 'planks', base: '#5A4A2A', seed: 38, size: 18}) + MAT.floor(cut0, cut1, tween - 16, tween + 6, {kind: 'planks', base: '#3B3020', seed: 39, size: 18}) +
    MAT.floor(cut0, cut1, hold - 16, hold + 6, {kind: 'planks', base: '#24302C', seed: 40, size: 22}));
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
    const hh = SH.man * (woman ? 0.9 : 1);
    ship.push(`<rect x="${f1(x - 8 * d - 7)}" y="${f1(saloon - 0.27 * SH.man)}" width="14" height="3" fill="#0D0C09"/><rect x="${f1(x - 8 * d - 7)}" y="${f1(saloon - 0.27 * SH.man)}" width="2.5" height="${f1(0.27 * SH.man)}" fill="#0D0C09"/><rect x="${f1(x - 8 * d + 5)}" y="${f1(saloon - 0.27 * SH.man)}" width="2.5" height="${f1(0.27 * SH.man)}" fill="#0D0C09"/><rect x="${f1(x - 8 * d - 7 * d - (d > 0 ? 0 : -12))}" y="${f1(saloon - 0.62 * SH.man)}" width="2.5" height="${f1(0.36 * SH.man)}" fill="#0D0C09"/>`);
    ship.push(figure({x, y: sitY(saloon - 4, hh), h: hh, d, kind: woman ? 'woman' : 'man', hat: 'none', coat: 'frock', fill: '#0D0C09',
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
  ship.push(candlestick(fx + 74, tween - 30, 0.9, '#C9A55A') + candlestick(fx + 90, tween - 30, 0.9, '#C9A55A'));
  ship.push(nb('ndaughter', {x: fx - 96, y: tween, h: SH.man, scale: 0.8, d: 1, hat: 'kerchief', wear: ['plain', 'shawl'], det: lod.det, rim: rimF, an: {...POSES.stand(t, 0.4), tilt: 22 * up + 2, fArm: [165 - 20 * up, 150], expr: up > 0.5 ? 'awe' : 'neutral'}}));
  ship.push(nb('nfather', {x: fx - 40, y: sitY(tween - 10, SH.man * 0.97), h: SH.man, d: 1, hat: 'cap', coat: 'frock', det: lod.det, rim: rimF, an: {...POSES.sit(t, 0.1), fArm: [130, 95], tilt: -10 + 8 * up}}));
  ship.push(nb('nmother', {x: fx + 34, y: sitY(tween - 10, SH.man * 0.88), h: SH.man, d: -1, det: lod.det, rim: rimF, an: {...POSES.rock(t), tilt: -12}}));
  ship.push(nb('nson', {x: fx + 8, y: tween, h: SH.man, scale: 0.5, d: 1, det: lod.det, rim: rimF, an: {...POSES.stand(t, 0.7), lean: -8, tilt: 4}}));
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
  for (const y of [saloon, tween, hold]) ship.push(`<rect x="${cut0}" y="${y + 6}" width="${cut1 - cut0}" height="10" fill="#0D0C09"/>`);
  ship.push(`<rect x="${cut0}" y="${deck - 6}" width="${cut1 - cut0}" height="12" fill="#0D0C09"/>`);
  ship.push(`</g>`);
  ship.push(`<path d="${shipHullPath()}" fill="none" stroke="#0D0C09" stroke-width="10"/>`);
  // outside plating beyond the cut (left and right of it) with a row of portholes; a boot topping line
  ship.push(`<g clip-path="url(#e3hull)"><rect x="${SH.x0 - 40}" y="0" width="${cut0 - SH.x0 + 40}" height="900" fill="#0D0C09"/><rect x="${cut1}" y="0" width="${SH.x1 - cut1 + 40}" height="900" fill="#0D0C09"/>` +
    `<rect x="${SH.x0}" y="${wl - 6}" width="${SH.x1 - SH.x0}" height="10" fill="#4E726C" opacity="0.5"/></g>`);
  for (let x = SH.x0 + 220; x < SH.x1 - 60; x += 70) if (x < cut0 || x > cut1) ship.push(`<circle cx="${x}" cy="${saloon - 60}" r="6" fill="#5F857F" opacity="0.6"/>`);
  ship.push(`<rect x="${cut0 - 3}" y="${deck - 26}" width="6" height="${keel - deck}" fill="${E3.teal}" opacity="0.0"/>`);
  // above the deck: the deckhouse, lifeboats, two raked funnels, three masts with furled sails and rigging; first-class strollers
  ship.push(`<rect x="420" y="${house}" width="1260" height="${deck - house - 24}" fill="#24403D"/>` + [...Array(18)].map((_, k) => `<rect x="${450 + k * 68}" y="${house + 24}" width="34" height="40" fill="${E3.warm}" opacity="0.35"/>`).join(''));
  ship.push(MAT.floor(410, 1690, house - 14, house - 4, {kind: 'planks', base: '#6B5A3A', seed: 41, size: 16}));
  ship.push(`<rect x="410" y="${house - 4}" width="1280" height="8" fill="#0D0C09"/>` + [...Array(32)].map((_, k) => `<rect x="${414 + k * 40}" y="${house - 28}" width="3" height="24" fill="#0D0C09"/>`).join('') + `<rect x="410" y="${house - 30}" width="1280" height="4" fill="#0D0C09"/>`);
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
  front.push(`<path d="${wave} L6000,3000 L-3000,3000 Z" fill="#1C3332" opacity="0.32"/><path d="${wave}" stroke="#A3BAB2" stroke-width="3" fill="none" opacity="0.7"/>`);
  front.push([...Array(10)].map((_, k) => { const ph = (t * 0.6 + k / 10) % 1; return `<ellipse cx="${f1(SH.x1 + 40 - ph * 900)}" cy="${f1(wl + 8 + ph * 10)}" rx="${f1(30 + ph * 90)}" ry="6" fill="#DFE0D6" opacity="${f1(0.55 * (1 - ph))}"/>`; }).join(''));
  front.push([...Array(12)].map((_, k) => { const ph = (t * 0.5 + k / 12) % 1; return `<ellipse cx="${f1(SH.x0 - ph * 1400)}" cy="${f1(wl + 6)}" rx="${f1(40 + ph * 120)}" ry="5" fill="#DFE0D6" opacity="${f1(0.45 * (1 - ph))}"/>`; }).join(''));
  const shipG = `<g transform="translate(0,${f1(heave)}) rotate(${f1(roll)}, 1000, ${wl})">${ship.join('')}</g>`;
  const sky = `<rect width="1920" height="1080" fill="url(#e3overcast)"/>` + clouds(t, 31);
  const world = layerAt(c, 0.35, `<rect x="-6000" y="${SH.wl - 30}" width="14000" height="30" fill="#4E726C" opacity="0.4"/>`) + layerAt(c, 1, back.join('') + shipG + front.join(''));
  const scr = [tag(40, 1040, 'AN ATLANTIC STEAMSHIP · ABOUT 1884', 1)];
  if (t > 0.8 && t < 3.6) scr.push(penS(c.sx(-200), c.sy(-320), 'first class: a dining saloon', 30, -3), penS(c.sx(1300), c.sy(tween) + 130, 'steerage: hundreds below decks', 30, -3));
  if (t > 8.4) scr.push(penS(1060, 170, 'a week or two at sea', 34, -3), tag(1100, 250, 'COMPOSITE CHARACTERS', smooth(8.4, 8.8, t)));
  return frame(e3Defs(t), sky, world, scr.join(''), t);
}

/* ================= ep3_castle_garden: the immigrant station at the Battery, outside then in ================= */
// Castle Garden as the 1870s-80s stereo views show it: the old round fort (Castle Clinton, 1811) of red sandstone, a broad low roof over
// the whole ring, a many-sided lantern with arched openings on top, flagpoles, the arched gate; the Battery's trees; the harbour.
// Immigrants were brought from the steamships by barge and landed at the depot's pier. Inside, the rotunda: a ring of offices and a
// gallery under the roof, the lantern's light falling in the middle, clerks at high desks writing names in the register.
const CG = {wl: 760, cx: 1060, rx: 520, wallTop: 560, wallBot: 760};
function cgOutside(t) {
  const s = [], {cx, rx, wallTop, wallBot, wl} = CG;
  // lower Manhattan behind, 1884: low brick blocks, Trinity's spire, a towered office building, smoke
  const r = rng(51);
  for (let x = -400; x < 2600;) { const w = 50 + r() * 110, h = 70 + r() * 150; s.push(`<rect x="${f1(x)}" y="${f1(560 - h)}" width="${f1(w)}" height="${f1(h + 60)}" fill="#4E726C"/>`); x += w + 2; }
  s.push(`<rect x="1570" y="300" width="56" height="300" fill="#4E726C"/><path d="M1564,300 L1598,80 L1632,300 Z" fill="#4E726C"/>`); // Trinity Church spire
  s.push(`<rect x="560" y="280" width="120" height="300" fill="#4E726C"/><rect x="596" y="200" width="48" height="90" fill="#4E726C"/><path d="M590,200 L620,150 L650,200 Z" fill="#4E726C"/>`); // a towered office block
  s.push(MAT.smoke(300, 420, t, {col: '5F857F', k: 0.8, n: 6, drift: 120, seed: 52}) + MAT.smoke(2000, 440, t, {col: '5F857F', k: 0.7, n: 6, drift: 100, seed: 53}));
  // the Battery: a sea wall, bare trees
  s.push(`<rect x="-400" y="600" width="3000" height="${wl - 600}" fill="#2B4744"/>`);
  for (let k = 0; k < 16; k++) { const x = -300 + k * 190 + r() * 60; if (Math.abs(x - cx) < rx + 40) continue; const h = 150 + r() * 90;
    s.push(`<rect x="${f1(x - 5)}" y="${f1(wl - 40 - h)}" width="10" height="${f1(h)}" fill="#1C3332"/>`);
    for (let b = 0; b < 7; b++) { const a = -70 + b * 23, L = 50 + r() * 60, y0 = wl - 40 - h * (0.45 + r() * 0.5); s.push(line([[x, y0], [x + Math.sin(a * Math.PI / 180) * L, y0 - Math.cos(a * Math.PI / 180) * L]], '#1C3332', 3)); } }
  // the round fort: a drum of sandstone seen from the water, windows in two rows, the arched gate, a low roof and the lantern
  const drum = `M${cx - rx},${wallTop} Q${cx},${wallTop + 46} ${cx + rx},${wallTop} L${cx + rx},${wallBot} Q${cx},${wallBot + 50} ${cx - rx},${wallBot} Z`;
  s.push(`<clipPath id="e3drum"><path d="${drum}"/></clipPath><g clip-path="url(#e3drum)">` + MAT.stone(cx - rx, wallTop - 10, 2 * rx, wallBot - wallTop + 70, {base: '#3A4E48', seed: 54, bh: 18}) +
    `<rect x="${cx - rx}" y="${wallTop - 10}" width="${2 * rx}" height="${wallBot - wallTop + 70}" fill="url(#msround)"/></g>`);
  for (let k = 0; k < 13; k++) { const u = -0.92 + k * 0.153, x = cx + rx * u, sq = Math.sqrt(1 - u * u), yb = wallTop + 46 * sq * 0.5;
    for (const row of [40, 112]) s.push(`<rect x="${f1(x - 9 * sq)}" y="${f1(yb + row)}" width="${f1(18 * sq)}" height="34" fill="#0D0C09" opacity="0.85"/>`); }
  s.push(`<path d="M${cx - 50},${wallBot + 22} l0,-80 q50,-50 100,0 l0,80 Z" fill="#0D0C09"/><path d="M${cx - 64},${wallBot - 58} q64,-66 128,0" stroke="#DFE0D6" stroke-width="8" fill="none" opacity="0.5"/>`);
  s.push(`<rect x="${cx - 140}" y="${wallTop + 20}" width="280" height="26" fill="#DFE0D6" opacity="0.75"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map((k) => `<rect x="${cx - 120 + k * 31}" y="${wallTop + 29}" width="22" height="8" fill="#0D0C09" opacity="0.45"/>`).join('')); // the name board (blank)
  s.push(`<path d="M${cx - rx - 30},${wallTop + 4} L${cx - 220},${wallTop - 70} L${cx + 220},${wallTop - 70} L${cx + rx + 30},${wallTop + 4} Q${cx},${wallTop + 40} ${cx - rx - 30},${wallTop + 4} Z" fill="#1F3532"/><path d="M${cx - rx - 30},${wallTop + 4} Q${cx},${wallTop + 40} ${cx + rx + 30},${wallTop + 4}" stroke="#0D0C09" stroke-width="8" fill="none"/>`);
  s.push(`<rect x="${cx - 120}" y="${wallTop - 170}" width="240" height="104" fill="#24403D"/>` + [0, 1, 2, 3, 4].map((k) => `<path d="M${cx - 100 + k * 44},${wallTop - 80} l0,-50 q14,-18 28,0 l0,50 Z" fill="${E3.cream}" opacity="0.55"/>`).join('') + `<path d="M${cx - 140},${wallTop - 168} L${cx},${wallTop - 210} L${cx + 140},${wallTop - 168} Z" fill="#1F3532"/>`);
  for (const [x, hh] of [[cx - 300, 200], [cx + 330, 180], [cx, 300]]) { const y0 = x === cx ? wallTop - 210 : wallTop - 30; s.push(`<rect x="${x - 2}" y="${y0 - hh}" width="4" height="${hh}" fill="#0D0C09"/>` + flag(x + 2, y0 - hh, 70, 40, '#A3BAB2', t, x)); }
  for (const x of [cx - 330, cx + 290]) s.push(`<rect x="${x}" y="${wallTop - 50}" width="18" height="40" fill="#0D0C09"/>`); // chimneys
  // the depot's pier on the water side; low sheds
  s.push(`<rect x="${cx - rx - 360}" y="${wl - 34}" width="380" height="16" fill="#0D0C09"/>` + [0, 1, 2, 3, 4, 5].map((k) => `<rect x="${cx - rx - 350 + k * 70}" y="${wl - 20}" width="10" height="60" fill="#0D0C09"/>`).join(''));
  s.push(`<rect x="${cx - rx - 330}" y="${wl - 120}" width="260" height="86" fill="#1F3532"/><path d="M${cx - rx - 344},${wl - 120} l144,-40 l144,40 Z" fill="#162826"/>`);
  return s.join('');
}
function cgBarge(x, t, arrive) { return `<g transform="translate(${f1(x)},${CG.wl}) scale(1.45) translate(${f1(-x)},${-CG.wl})">${cgBargeBody(x, t, arrive)}</g>`; }
function cgBargeBody(x, t, arrive) { // a covered two-deck barge towed alongside a small tug, packed with people and their bundles
  const s = [], wl = CG.wl, r = rng(55), bob = 3 * Math.sin(t * 1.6);
  s.push(`<path d="M${x - 330},${wl - 30 + bob} L${x + 310},${wl - 30 + bob} L${x + 290},${wl + 8 + bob} L${x - 310},${wl + 8 + bob} Z" fill="#0D0C09"/>`);
  s.push(`<rect x="${x - 300}" y="${wl - 120 + bob}" width="580" height="8" fill="#0D0C09"/><path d="M${x - 310},${wl - 120 + bob} l20,-14 l560,0 l20,14 Z" fill="#162826"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map((k) => `<rect x="${x - 296 + k * 81}" y="${wl - 112 + bob}" width="5" height="82" fill="#0D0C09"/>`).join(''));
  for (let k = 0; k < 30; k++) { const px = x - 290 + k * 19 + r() * 6; s.push(e3Person(r, px, wl - 30 + bob, 46, t, '#0D0C09', {d: 1})); if (r() < 0.35) s.push(bundle(px + 6, wl - 30 + bob, 0.36, '#0D0C09')); }
  // the tug alongside, towing: a little steam tug, a tall stack, smoke
  const tx = x - 600, tb = 2 * Math.sin(t * 1.9 + 1);
  s.push(`<path d="M${tx - 60},${wl - 30 + tb} L${tx + 200},${wl - 30 + tb} Q${tx + 240},${wl - 30 + tb} ${tx + 250},${wl - 50 + tb} L${tx + 230},${wl + 8 + tb} L${tx - 50},${wl + 8 + tb} Z" fill="#0D0C09"/><rect x="${tx + 40}" y="${wl - 90 + tb}" width="110" height="60" fill="#0D0C09"/><rect x="${tx + 90}" y="${wl - 170 + tb}" width="24" height="80" fill="#0D0C09"/>`);
  s.push(MAT.smoke(tx + 100, wl - 180 + tb, t, {col: '3E5F5A', k: 1, n: 7, drift: -260 + 200 * arrive, seed: 56}));
  return s.join('');
}
function cgInside(t) {
  // the rotunda: a ring wall with offices below and a gallery above, iron posts, the roof's radiating timbers up to the lantern
  const s = [], F = 900, r = rng(57);
  s.push(`<rect x="-500" y="-400" width="2900" height="${F + 400}" fill="#1F3532"/>`);
  s.push(`<path d="M-500,-60 Q960,-260 2400,-60 L2400,-400 L-500,-400 Z" fill="#132423"/>`);
  for (let k = -10; k <= 10; k++) s.push(line([[960, -330], [960 + k * 260, -60 - 170 * Math.cos(k / 10 * Math.PI / 2) + 170]], '#0D0C09', 10)); // roof timbers
  s.push(`<rect x="760" y="-400" width="400" height="90" fill="${E3.cream}" opacity="0.35"/>` + `<path d="M760,-310 L560,${F} L1360,${F} L1160,-310 Z" fill="${E3.cream}" opacity="0.07"/>`); // the lantern's light
  // the gallery: a rail along the curve, with people looking down
  const gy = 230;
  s.push(`<path d="M-500,${gy} Q960,${gy + 70} 2400,${gy}" stroke="#0D0C09" stroke-width="18" fill="none"/>`);
  for (let x = -480; x < 2400; x += 36) { const yy = gy + 70 * (1 - ((x - 960) / 1450) ** 2) * 0.5 + 6; s.push(`<rect x="${x}" y="${f1(yy - 50)}" width="4" height="50" fill="#0D0C09"/>`); }
  for (let k = 0; k < 18; k++) { const x = -400 + k * 160 + r() * 40, yy = gy + 70 * (1 - ((x - 960) / 1450) ** 2) * 0.5; s.push(e3Person(r, x, yy - 4, 70, t, '#24403D')); }
  // offices under the gallery: doors and windows in the ring wall
  for (let x = -460; x < 2400; x += 230) s.push(`<rect x="${x}" y="${gy + 120}" width="120" height="${F - gy - 140}" fill="#132423"/><rect x="${x + 12}" y="${gy + 140}" width="96" height="120" fill="${E3.cream}" opacity="0.18"/>`);
  for (let x = -380; x < 2400; x += 460) s.push(`<rect x="${x}" y="${gy + 40}" width="16" height="${F - gy - 40}" fill="#0D0C09"/>`);
  s.push(`<rect x="-500" y="${F - 70}" width="2900" height="12" fill="#0D0C09" opacity="0.6"/>` + MAT.floor(-500, 2400, F - 58, F + 220, {kind: 'flag', base: '#4E5F58', seed: 58, size: 70, vp: 960})); // flagstones
  // the iron columns that hold up the middle of the roof, each opening at the top into a fan of ribs (after the NYPL engraving)
  for (const x of [150, 700, 1220, 1770]) { s.push(`<rect x="${x - 9}" y="-140" width="18" height="${F + 140}" fill="#0D0C09"/><rect x="${x - 16}" y="${F - 30}" width="32" height="30" fill="#0D0C09"/>`);
    for (let k = -3; k <= 3; k++) s.push(`<path d="M${x},-60 Q${x + k * 40},-120 ${x + k * 80},-150" stroke="#0D0C09" stroke-width="7" fill="none"/>`); }
  // the clerks' high desks in a row, a wooden rail in front; clerks in frock coats on high stools writing in the registers
  const desks = [520, 860, 1200];
  for (const dx of desks) {
    s.push(`<path d="M${dx - 110},${F - 210} L${dx + 110},${F - 230} L${dx + 110},${F - 200} L${dx - 110},${F - 200} Z" fill="#0D0C09"/><rect x="${dx - 100}" y="${F - 200}" width="200" height="200" fill="#0D0C09"/><rect x="${dx - 70}" y="${F - 236}" width="80" height="14" fill="${E3.cream}" opacity="0.8"/>`);
    const w = Math.sin(t * 7 + dx) * 0.5 + 0.5;
    s.push(figure({x: dx - 40, y: F - 120, h: 230, d: 1, kind: 'man', hat: 'none', coat: 'frock', beard: dx === 860, fill: '#0D0C09', an: {legs: [86, 80], shins: [6, 0], fArm: [120 + 8 * w, 70 + 10 * w], bArm: [130, 90], tilt: -16, lean: 6}}));
  }
  s.push(`<rect x="300" y="${F - 110}" width="1150" height="10" fill="#0D0C09"/>` + [...Array(24)].map((_, k) => `<rect x="${304 + k * 48}" y="${F - 110}" width="6" height="110" fill="#0D0C09"/>`).join(''));
  // benches of waiting families with bundles and trunks, in the foreground
  for (const [bx, n] of [[-300, 6], [1480, 6]]) {
    s.push(`<rect x="${bx}" y="${F + 40}" width="${n * 90}" height="14" fill="#0D0C09"/><rect x="${bx + 10}" y="${F + 54}" width="10" height="60" fill="#0D0C09"/><rect x="${bx + n * 90 - 20}" y="${F + 54}" width="10" height="60" fill="#0D0C09"/>`);
    for (let k = 0; k < n; k++) { s.push(e3Person(r, bx + 40 + k * 90, sitY(F + 120, 260), 280, t, '#0D0C09', {an: POSES.sit(t, r())})); if (r() < 0.5) s.push(bundle(bx + 80 + k * 90, F + 116, 1.4, '#132423')); }
  }
  return s.join('');
}
function renderCastleGarden(t) {
  const X = smooth(4.7, 5.6, t); // the cross-fade from outside to inside
  let worldA = '', worldB = '';
  const scr = [];
  if (X < 1) {
    const c = cam2(camAt([[0, 0.9, 760, 500], [4.8, 1.0, 720, 540]], t)), arrive = smooth(0, 3.4, t);
    const bx = -560 + 620 * ease(arrive);
    const water = MAT.water(-1000, CG.wl - 6, 4000, 900, t, {seed: 59, n: 120, top: '#3E5F5A', bottom: '#0B1414'});
    // landing: once the barge is in, people walk up the gangway onto the pier
    const walkers = []; if (t > 3.4) { const r = rng(60); for (let k = 0; k < 6; k++) { const d0 = (t - 3.4 - k * 0.35) * 80; if (d0 < 0) continue; const x = 210 + d0;
      walkers.push(e3Person(r, x, CG.wl - 34, 46, t, '#0D0C09', {d: 1, an: walkAn(walkPhase(d0, 46))}) + bundle(x - 6, CG.wl - 60, 0.36, '#0D0C09')); } }
    const near = `<rect x="-1000" y="${CG.wl + 210}" width="4000" height="400" fill="#0D0C09" opacity="0.0"/>`;
    worldA = `<g opacity="${f1(1 - X)}"><rect width="1920" height="1080" fill="url(#e3day)"/>${clouds(t, 61)}${layerAt(c, 0.6, '')}${layerAt(c, 1, cgOutside(t) + water + walkers.join('') + cgBarge(bx, t, arrive) + near)}</g>`;
    scr.push(tag(40, 1040, 'CASTLE GARDEN · THE BATTERY, NEW YORK · 1884', 1 - X));
    if (t > 0.8 && t < 4.6) scr.push(penS(1200, 160, 'the immigrant station, 1855 to 1890', 30, -3));
  }
  if (X > 0) {
    const tt = t - 4.7, c = cam2(camAt([[0, 0.8, 960, 520], [5.3, 1.05, 900, 600]], tt));
    // the family (accent) waits its turn in the line at the middle desk, then the father steps up and gives their name
    const F = 900, step = smooth(2.4, 3.4, tt), lod = lodFor(260 * c.z);
    const fx = 1010 + 120 * (1 - step), rim = {c: E3.warm, a: lod.rimA * 0.8, dx: -0.01, dy: -0.004};
    const fam = nb('nmother', {x: fx + 200, y: F + 6, h: 270, d: -1, det: lod.det, rim, an: POSES.stand(tt, 0.2)}) + featherBed(fx + 240, F + 6, 110, 48, '#A3BAB2') +
      nb('ndaughter', {x: fx + 120, y: F + 6, h: 270, scale: 0.8, d: -1, hat: 'kerchief', wear: ['plain', 'shawl'], det: lod.det, rim, an: {...POSES.stand(tt, 0.5), tilt: 10, expr: 'worried'}}) +
      nb('nson', {x: fx + 160, y: F + 6, h: 270, scale: 0.5, d: -1, det: lod.det, rim, an: {...POSES.stand(tt, 0.8), fArm: [140, 120]}}) +
      nb('nfather', {x: fx, y: F + 6, h: 270, d: -1, hat: 'cap', coat: 'frock', det: lod.det, rim, an: tt > 2.4 && tt < 3.4 ? walkAn(walkPhase(120 * step, 270)) : {...POSES.stand(tt, 0.1), fArm: tt > 3.6 ? [125, 95] : [165, 150], tilt: tt > 3.6 ? 8 : 0}});
    const queue = (() => { const r = rng(62), q = []; for (let k = 0; k < 7; k++) q.push(e3Person(r, 1460 + k * 70 - 60 * step, F + 6, 260, tt, '#0D0C09', {d: -1})); return q.join(''); })();
    worldB = `<g opacity="${f1(X)}"><rect width="1920" height="1080" fill="#0B1414"/>${layerAt(c, 1, cgInside(tt) + queue + fam)}</g>`;
    scr.push(tag(40, 1040, 'INSIDE THE ROTUNDA · CASTLE GARDEN', X));
    if (tt > 3.8) scr.push(penS(300, 170, 'name, age, where from, where to', 30, -3), tag(330, 250, 'COMPOSITE CHARACTERS', smooth(3.8, 4.2, tt)));
  }
  return frame(e3Defs(t), `<rect width="1920" height="1080" fill="#0B1414"/>`, worldA + worldB, scr.join(''), t);
}

/* ================= ep3_moving_in: the new family moves into the Kellys' building ================= */
// The Kellys' building is the one from Episode 1: the row tenement drawn by street.js's tenement() (same brick-dark facade, cornice
// on brackets, three windows a floor with stone lintels, the fire escape across the middle bays with washing, the saloon's awning
// and lit window at street level, the doorway and its stoop), five storeys of flats over the saloon as in cutaway.js. The Kellys
// live at the front of the third floor (cutaway.js), so Ma Kelly watches from the middle window of that floor. Coordinates are
// street.js's (sidewalk at FAR_GROUND); the camera does the scaling. The street is Brooklyn, as in Episode 2.
const MI = {x: 760, w: 270, floors: 5, seed: 402, man: 92};
MI.top = FAR_GROUND - 150 - MI.floors * 128;
MI.gap = (MI.w - 3 * 34) / 4;
MI.win = {x: MI.x + MI.gap + 34 + MI.gap, y: MI.top + 3 * 128 + 34, w: 34, h: 62}; // the Kellys' front window, third floor, middle bay
MI.door = MI.x + MI.w * 0.81;            // the doorway at the top of the stoop
MI.stoopFoot = MI.x + MI.w * 0.68 + 3 * 6 + MI.w * 0.26 + 30;
function miCarrier(name, t, t0, o) { // walk from the wagon along the sidewalk to the stoop, climb its four steps, go in at the door
  const v = 64, start = 1240, dist = Math.max(0, (t - t0) * v), x = Math.max(MI.door, start - dist), G = FAR_GROUND;
  const climb = clamp01((MI.stoopFoot - x) / (MI.stoopFoot - MI.door)), y = G - 34 * climb;
  const inside = smooth(0, 0.8, (t - t0) - (start - MI.door) / v);
  if (inside >= 1) return '';
  const moving = t > t0 && x > MI.door;
  const an = moving ? {...walkAn(walkPhase(Math.min(dist, start - MI.door), MI.man), {carry: true}), ...o.arms} : {...POSES.stand(t, 0.3), ...o.arms};
  return `<g opacity="${f1(1 - inside)}">${nb(name, {x, y, h: MI.man, d: -1, ...o, an})}${o.load ? o.load(x, y) : ''}</g>`;
}
function horsecar(x, y, t) { // a one-horse street railway car: platforms, a row of windows, a clerestory roof, the driver at the front
  const s = [], c = '#0D0C09';
  s.push(msHorse(x + 470, y, 92, c, x, 0, 0, 1));
  s.push(`<rect x="${x}" y="${y - 210}" width="440" height="150" fill="${c}"/><rect x="${x + 40}" y="${y - 236}" width="360" height="30" fill="${c}"/><rect x="${x - 30}" y="${y - 214}" width="500" height="10" fill="${c}"/>`);
  for (let k = 0; k < 8; k++) s.push(`<rect x="${x + 30 + k * 48}" y="${y - 196}" width="36" height="56" fill="${E3.warm}" opacity="0.32"/>`);
  for (const u of [80, 360]) s.push(`<circle cx="${x + u}" cy="${y - 30}" r="30" fill="none" stroke="${c}" stroke-width="8"/><circle cx="${x + u}" cy="${y - 30}" r="8" fill="${c}"/>`);
  s.push(figure({x: x + 455, y: y - 60, h: 120, d: 1, kind: 'man', hat: 'bowler', coat: 'frock', fill: c, an: {fArm: [110, 80]}}));
  return s.join('');
}
function miKellyWindow(t, look) { // Ma Kelly behind her window, arms folded; the wall below the sill hides her from the waist down
  const {x, y, w, h} = MI.win, s = [], facade = MI.seed % 2 ? ST.facade : ST.facadeDark;
  s.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0B1414"/>` + glowC(x + 6, y + 30, 40, 0.5, 'mswarm'));
  s.push(kel('mother', {x: x + 15, y: y + h + 24, h: MI.man, d: 1, noShadow: true, fold: true, det: 0, rim: {c: '#FFF3D6', a: 0.55, dx: 0.012, dy: -0.004},
    an: {...E3_FOLD, tilt: -10 - 6 * look, lean: -1 + 2 * look, blink: t % 3.6 < 0.12}}));
  s.push(`<rect x="${x - 2}" y="${y + h}" width="${w + 4}" height="44" fill="${facade}"/><rect x="${x - 3}" y="${y - 6}" width="${w + 6}" height="6" fill="${ST.iron}"/>`);
  const by = y + h + 4, bx0 = MI.x + MI.gap * 0.6, bx1 = MI.x + MI.w - MI.gap * 0.6; // the fire escape in front of her
  s.push(`<rect x="${f1(bx0)}" y="${by}" width="${f1(bx1 - bx0)}" height="4" fill="${ST.iron}"/><rect x="${f1(bx0)}" y="${by - 30}" width="${f1(bx1 - bx0)}" height="3" fill="${ST.iron}"/>` +
    [...Array(Math.ceil((bx1 - bx0) / 9))].map((_, k) => `<rect x="${f1(bx0 + k * 9)}" y="${by - 30}" width="1.6" height="30" fill="${ST.iron}"/>`).join(''));
  return s.join('');
}
function renderMovingIn(t, o = {}) {
  const keys = o.keys || [[0, 1.12, 930, 560], [4.4, 1.16, 940, 566], [7.8, 5.0, MI.win.x + 20, MI.win.y + 46], [10, 5.2, MI.win.x + 20, MI.win.y + 46]];
  const c = cam2(camAt(keys, t)), G = FAR_GROUND, s = [], lod = lodFor(MI.man * c.z), rim = {c: '#FFF3D6', a: lod.rimA * 0.7, dx: -0.01, dy: -0.004};
  // the row: the Kellys' building (Episode 1's tenement) between its neighbours
  for (const [x, w, fl, seed] of [[-80, 250, 4, 409], [174, 300, 5, 404], [478, 278, 5, 405], [MI.x, MI.w, MI.floors, MI.seed], [1034, 250, 4, 403], [1288, 290, 5, 406], [1582, 260, 5, 407], [1846, 270, 4, 408]]) s.push(tenement(x, w, fl, seed, t));
  s.push(miKellyWindow(t, smooth(6.4, 7.4, t)));
  // the sidewalk (flagstones), the curb, the cobbled street; a gas lamp; a telegraph pole and its wires
  s.push(MAT.floor(-400, 2400, G, G + 34, {kind: 'flag', base: '#3E5F5A', seed: 74, size: 46}) + `<rect x="-400" y="${G + 34}" width="2800" height="8" fill="#0D0C09"/>` + MAT.floor(-400, 2400, G + 42, G + 260, {kind: 'cobble', base: '#2B4744', seed: 75, size: 40}));
  s.push(gasLamp(700, G + 30, 170, 0, t) + `<rect x="1460" y="${G - 870}" width="12" height="${870 + 30}" fill="#0D0C09"/>` + [0, 1, 2].map((k) => `<rect x="${1406}" y="${G - 850 + k * 34}" width="120" height="6" fill="#0D0C09"/>`).join(''));
  s.push([0, 1, 2].map((k) => line([[-400, G - 830 + k * 34], [1466, G - 846 + k * 34], [2400, G - 822 + k * 34]], '#0D0C09', 1.4)).join(''));
  // the wagon at the curb, the horse standing (resting a hind leg, tossing its head); the family's things on it
  const wy = G + 120, wx = 1230;
  s.push(MAT.shadow(wx + 60, wy + 2, 120, 0.4) + msHorse(wx + 110, wy, 62, '#0D0C09', 0, Math.max(0, Math.sin(t * 1.3)) ** 6, 1, 1));
  s.push(line([[wx + 30, wy - 52], [wx + 80, wy - 48]], '#0D0C09', 4) + `<rect x="${wx - 230}" y="${wy - 66}" width="260" height="28" fill="#0D0C09"/>`);
  for (const u of [wx - 200, wx - 20]) s.push(`<circle cx="${u}" cy="${wy - 26}" r="26" fill="none" stroke="#0D0C09" stroke-width="5"/>` + [...Array(10)].map((_, k) => { const a = k * TAU / 10; return line([[u, wy - 26], [u + Math.cos(a) * 26, wy - 26 + Math.sin(a) * 26]], '#0D0C09', 2); }).join(''));
  s.push(`<rect x="${wx - 220}" y="${wy - 100}" width="6" height="34" fill="#0D0C09"/><rect x="${wx - 220}" y="${wy - 100}" width="34" height="5" fill="#0D0C09"/>`);
  s.push(featherBed(wx - 180, wy - 66, 70, 30, '#DFE0D6') + (t > 0.2 ? '' : trunk(wx - 100, wy - 66, 46, 26, '#1A1410', '#5F857F')) + (t > 2.4 ? '' : samovar(wx - 40, wy - 66, 0.66)));
  // the family carries their things up the stoop, one after another
  const carry = {fArm: [20, -20], bArm: [30, -10]};
  s.push(miCarrier('nfather', t, 0.2, {hat: 'cap', coat: 'frock', det: lod.det, rim, arms: carry, load: (x, y) => trunk(x - 22, y - MI.man * 1.0, 46, 24, '#1A1410', '#5F857F')}));
  s.push(miCarrier('nmother', t, 1.3, {det: lod.det, rim, arms: {fArm: [90, 40], bArm: [100, 50]}, load: (x, y) => featherBed(x - 38, y - MI.man * 0.48, 56, 26, '#DFE0D6')}));
  s.push(miCarrier('ndaughter', t, 2.4, {scale: 0.8, hat: 'kerchief', wear: ['plain', 'shawl'], det: lod.det, rim, arms: {fArm: [130, 80], bArm: [140, 90]}, load: (x, y) => samovar(x - 15, y - MI.man * 0.34, 0.42)}));
  s.push(miCarrier('nson', t, 3.4, {scale: 0.52, det: lod.det, rim, arms: {fArm: [110, 40]}, load: (x, y) => candlestick(x - 15, y - MI.man * 0.3, 0.5)}));
  // two Irish neighbours on the next stoop down, watching (ink)
  s.push(e3Person(rng(76), 1120, G, MI.man, t, '#0D0C09', {d: -1, an: E3_FOLD}) + e3Person(rng(79), 1160, G, MI.man, t, '#0D0C09', {d: -1}));
  // a horsecar passes along the street in front
  const hc = t > 1.2 && t < 6.6 ? -700 + (t - 1.2) * 520 : -5000;
  s.push(`<g transform="translate(0,${G + 250}) scale(0.62) translate(0,${-(G + 250)})">${horsecar(hc / 0.62, G + 250, t)}</g>` + line([[-400, G + 252], [2400, G + 252]], '#0D0C09', 4));
  const world = layerAt(c, 0.3, `<rect x="-3000" y="-2000" width="8000" height="3000" fill="url(#e3day)"/>` + stFar(t)) + layerAt(c, 1, s.join(''));
  const scr = [tag(40, 1040, 'THE KELLYS\' STREET · BROOKLYN · 1884', 1)];
  if (t > 1 && t < 4.4) scr.push(penS(1060, 160, 'new neighbours, from the Russian Empire', 30, -3));
  if (t > 7.8) scr.push(penS(980, 170, 'Ma Kelly is not so sure', 34, -3), tag(1000, 250, 'COMPOSITE CHARACTERS', smooth(7.8, 8.2, t)));
  if (o.quiet) scr.length = 0;
  return frame(e3Defs(t), `<rect width="1920" height="1080" fill="#4E726C"/>`, world, scr.join(''), t);
}

/* ================= ep3_sweatshop: a tenement room turned workshop ================= */
// After Jacob Riis's photographs (Ludlow Street, Division Street, about 1889): a small room crowded with work. Treadle sewing machines
// on a long table, operators bent over them; a presser at his board with a heavy iron, more irons heating on the stove; piles of cut
// cloth and finished coats on the floor and on the bed; garments hung on a line; one window to the street. The neighbours (accent)
// work here: the father presses, the daughter (about 12) runs a machine, the mother finishes by hand at the window, the small boy
// pulls basting threads. The contractor brings another bundle.
const SW = {F: 900, man: 300};
function treadle(x, F, t, run = 1) { // a treadle sewing machine on its iron stand, seen side-on; the wheel turns while it runs
  const s = [], top = F - 130, c = '#0D0C09', a = t * 9 * run;
  s.push(`<rect x="${x - 90}" y="${top}" width="200" height="12" fill="#2B2418"/>`);
  s.push(`<path d="M${x - 60},${top} l0,-22 l110,0 l0,-40 l-120,0 l0,10 l100,0 l0,30 Z" fill="${c}"/><rect x="${x - 70}" y="${top - 62}" width="8" height="${f1(46 + 6 * Math.sin(a * 2))}" fill="${c}"/>`);
  s.push(`<circle cx="${x + 64}" cy="${top - 40}" r="16" fill="none" stroke="${c}" stroke-width="5"/>` + line([[x + 64, top - 40], [x + 64 + 16 * Math.cos(a), top - 40 + 16 * Math.sin(a)]], c, 3));
  s.push(`<path d="M${x - 70},${top + 12} l20,0 l-6,${F - top - 22} l-18,0 Z M${x + 90},${top + 12} l20,0 l-2,${F - top - 22} l-18,0 Z" fill="${c}"/>`);
  s.push(`<circle cx="${x + 80}" cy="${F - 60}" r="40" fill="none" stroke="${c}" stroke-width="6"/>` + [0, 1, 2, 3, 4, 5].map((k) => line([[x + 80, F - 60], [x + 80 + 40 * Math.cos(a + k * TAU / 6), F - 60 + 40 * Math.sin(a + k * TAU / 6)]], c, 2.5)).join(''));
  s.push(line([[x + 64, top - 24], [x + 80, F - 100]], c, 2) + `<rect x="${x - 40}" y="${F - 26 - 8 * Math.sin(a) * run}" width="120" height="10" fill="${c}"/>`); // belt, treadle plate
  s.push(`<path d="M${x - 88},${top - 2} q40,-14 90,-4 l30,6 Z" fill="#5F857F" opacity="0.8"/>`); // the cloth under the needle
  return s.join('');
}
function coatPile(x, y, n, seed, col = '#4E726C') { const r = rng(seed), s = [];
  for (let k = 0; k < n; k++) { const w = 120 + r() * 60, yy = y - k * 14; s.push(`<path d="M${f1(x + (r() - 0.5) * 30)},${f1(yy)} l${f1(w)},0 l-8,-16 l${f1(-w + 20)},-2 Z" fill="${shade(col, (r() - 0.5) * 0.5)}"/>`); }
  return s.join(''); }
// A tenement room drawn to scale (about 84 px to the foot with a grown man 480 px tall): a front room roughly 12 ft wide with an
// 8 1/2 ft plaster ceiling, cut open like cutaway.js so the walls, ceiling and floor read as a box. Returns {back, front}: draw back,
// then the furniture and people, then front (the cut walls, slabs and the floor's front lip, which overlap whatever is at the edge).
const RM = {x0: 456, x1: 1464, F: 980, wallFoot: 930, ceil: 220, H: 480};
function e3Room({door = false, seed = 1, paper = 0.12} = {}) {
  const {x0, x1, F, wallFoot, ceil} = RM, r = rng(seed), b = [], f = [];
  b.push(`<rect x="-1500" y="-1200" width="5000" height="3600" fill="#060A0A"/>`);
  b.push(`<rect x="${x0}" y="${ceil}" width="${x1 - x0}" height="${wallFoot - ceil}" fill="#1F3532"/><rect x="${x0}" y="${ceil}" width="${x1 - x0}" height="${wallFoot - ceil}" fill="url(#flwp)" opacity="${paper}"/>`);
  for (let k = 0; k < 3; k++) { const x = x0 + 80 + r() * (x1 - x0 - 260), y = ceil + 60 + r() * 380, w = 90 + r() * 120, h = 60 + r() * 120; // peeling plaster with the lath showing
    b.push(`<path d="M${f1(x)},${f1(y)} q${f1(w * 0.4)},-12 ${f1(w * 0.7)},4 q${f1(w * 0.3)},${f1(h * 0.4)} 0,${f1(h)} q${f1(-w * 0.5)},10 ${f1(-w * 0.7)},-6 Z" fill="#2B4744"/>` + [...Array(4)].map((_, i) => `<rect x="${f1(x + 8)}" y="${f1(y + 10 + i * h / 4.5)}" width="${f1(w * 0.55)}" height="4" fill="#24403D"/>`).join('')); }
  b.push(`<rect x="${x0 + 300 + r() * 300}" y="${ceil}" width="70" height="300" fill="url(#flstain)"/><rect x="${x0}" y="${ceil}" width="${x1 - x0}" height="140" fill="url(#matSootT)"/>`);
  // the plaster ceiling: a lighter band, a crack, a water stain round the stovepipe hole
  b.push(`<rect x="${x0}" y="${ceil - 4}" width="${x1 - x0}" height="30" fill="#2B4744"/><path d="M${x0 + 120},${ceil + 8} l60,6 l40,-4 l70,8 l30,-3" stroke="#132423" stroke-width="2" fill="none"/><ellipse cx="${x0 + 360}" cy="${ceil + 12}" rx="70" ry="10" fill="#132423" opacity="0.6"/><rect x="${x0}" y="${ceil + 24}" width="${x1 - x0}" height="6" fill="#132423"/>`);
  // the baseboard and the floor: worn boards in perspective, running back to the wall, darker toward it
  b.push(`<rect x="${x0}" y="${wallFoot - 14}" width="${x1 - x0}" height="14" fill="#2B2418"/>` + MAT.floor(x0, x1, wallFoot, F + 70, {kind: 'planks', base: '#3A3326', seed: seed + 5, size: 52, vp: (x0 + x1) / 2}));
  for (let k = 0; k < 9; k++) b.push(`<ellipse cx="${f1(x0 + 40 + r() * (x1 - x0 - 80))}" cy="${f1(wallFoot + 20 + r() * 110)}" rx="${f1(10 + r() * 30)}" ry="${f1(2 + r() * 4)}" fill="#0D0C09" opacity="0.35"/>`); // grime and scraps
  // the cut: the side walls, the ceiling slab and the floor slab in solid black; a door through the left wall to the dark hall
  const c = '#050505', dh = door ? 600 : 0;
  f.push(`<rect x="${x0 - 34}" y="${ceil - 60}" width="34" height="${F + 70 - ceil + 60 - dh}" fill="${c}"/>` + (door ? `<rect x="${x0 - 34}" y="${F + 70 - 40}" width="34" height="40" fill="${c}"/><rect x="${x0 - 30}" y="${F + 70 - dh - 40}" width="10" height="${dh}" fill="#2B2418"/>` : ''));
  f.push(`<rect x="${x1}" y="${ceil - 60}" width="34" height="${F + 70 - ceil + 100}" fill="${c}"/><rect x="${x0 - 34}" y="${ceil - 60}" width="${x1 - x0 + 68}" height="56" fill="${c}"/><rect x="${x0 - 34}" y="${F + 70}" width="${x1 - x0 + 68}" height="40" fill="${c}"/>`);
  f.push(`<rect x="${x0}" y="${F + 68}" width="${x1 - x0}" height="3" fill="#DFE0D6" opacity="0.15"/>`);
  return {back: b.join(''), front: f.join('')};
}
const e3Defs2 = (t) => e3Defs(t, `<pattern id="flwp" width="40" height="56" patternUnits="userSpaceOnUse"><path d="M20,6 q10,10 0,20 q-10,10 0,20" stroke="#DFE0D6" stroke-width="2" fill="none"/><circle cx="4" cy="28" r="3" fill="#DFE0D6"/></pattern>` +
  `<linearGradient id="flstain" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050A09" stop-opacity="0.55"/><stop offset="1" stop-color="#050A09" stop-opacity="0"/></linearGradient>`);
const scaled = (x, y, k, body) => `<g transform="translate(${f1(x)},${f1(y)}) scale(${k}) translate(${f1(-x)},${f1(-y)})">${body}</g>`;
function renderSweatshop(t) {
  const c = cam2(camAt([[0, 1.24, 960, 632], [4.4, 1.26, 960, 632], [10, 1.6, 900, 700]], t)), {F, H, x0, x1, wallFoot, ceil} = RM, s = [];
  const lod = lodFor(H * 0.8 * c.z), rim = {c: '#E9F0E6', a: lod.rimA * 0.6, dx: 0.01, dy: -0.004}, room = e3Room({door: true, seed: 91});
  s.push(room.back);
  // the window to the street on the back wall: the tenement opposite, grey daylight falling in
  const wx = 990, wy = 330, ww = 190, wh = 300;
  s.push(`<rect x="${wx - 12}" y="${wy - 12}" width="${ww + 24}" height="${wh + 24}" fill="#0D0C09"/>` + MAT.brick(wx, wy, ww, wh, {base: '#5F857F', seed: 92, soot: 'none', bw: 22, bh: 11, vary: 0.2}) +
    `<rect x="${wx + 30}" y="${wy + 90}" width="50" height="80" fill="#2B4744"/><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="#DFE0D6" opacity="0.28"/><rect x="${wx + ww / 2 - 4}" y="${wy}" width="8" height="${wh}" fill="#0D0C09"/><rect x="${wx}" y="${wy + wh / 2 - 4}" width="${ww}" height="8" fill="#0D0C09"/><rect x="${wx - 24}" y="${wy + wh}" width="${ww + 48}" height="14" fill="#0D0C09"/>`);
  s.push(`<path d="M${wx},${wy + wh + 14} L${wx - 200},${F + 70} L${wx + ww + 200},${F + 70} L${wx + ww},${wy + wh + 14} Z" fill="#DFE0D6" opacity="0.07"/>`);
  // a line of finished coats strung right under the ceiling: no headroom
  s.push(line([[x0, ceil + 70], [x1, ceil + 80]], '#0D0C09', 2) + [0, 1, 2, 3, 4, 5].map((k) => { const x = x0 + 90 + k * 150, sw = 2 * Math.sin(t * 1.1 + k); return `<path d="M${x},${ceil + 72 + k * 1.6} l90,0 l${8 + sw},150 l-106,0 Z" fill="#2B4744"/><path d="M${x + 14},${ceil + 72 + k * 1.6} l30,40 l30,-40" stroke="#0D0C09" stroke-width="4" fill="none"/>`; }).join(''));
  // the stove against the back wall, irons heating on it, the pipe up through the ceiling
  s.push(`<rect x="480" y="${wallFoot - 210}" width="150" height="190" fill="#0D0C09"/><rect x="472" y="${wallFoot - 220}" width="166" height="14" fill="#0D0C09"/><rect x="590" y="${ceil}" width="28" height="${wallFoot - 220 - ceil}" fill="#0D0C09"/><rect x="500" y="${wallFoot - 150}" width="60" height="44" fill="#FFB15C" opacity="${f1(0.35 + 0.2 * Math.sin(t * 8))}"/>` + glowC(530, wallFoot - 130, 220, 0.42, 'e3fire'));
  for (const k of [0, 1]) s.push(`<path d="M${488 + k * 62},${wallFoot - 220} l10,-28 l40,0 l10,28 Z" fill="#0D0C09"/><path d="M${504 + k * 62},${wallFoot - 248} q16,-18 32,0" stroke="#0D0C09" stroke-width="6" fill="none"/>`);
  // the bed against the back wall on the right, heaped with cut cloth and finished coats
  s.push(`<rect x="1170" y="${wallFoot - 120}" width="300" height="26" fill="#0D0C09"/><rect x="1170" y="${wallFoot - 260}" width="14" height="260" fill="#0D0C09"/>` + coatPile(1190, wallFoot - 120, 10, 95, '#2B4744') + coatPile(1280, wallFoot - 150, 7, 96, '#4E726C'));
  // the pressing board and the father, pressing (steam on each stroke)
  const strokeP = Math.sin(t * TAU * 0.6), ironX = 550 + 50 * strokeP, by = F - 250;
  s.push(`<path d="M466,${by} l180,0 l-12,-18 l-160,0 Z" fill="#5F857F"/><rect x="466" y="${by}" width="180" height="14" fill="#2B2418"/><rect x="482" y="${by + 14}" width="12" height="${F - by - 14}" fill="#0D0C09"/><rect x="618" y="${by + 14}" width="12" height="${F - by - 14}" fill="#0D0C09"/>` + MAT.shadow(556, F + 2, 100, 0.35));
  s.push(nb('nfather', {x: 694, y: F, h: H, d: -1, hat: 'kippah', coat: 'vest', det: lod.det, rim, an: {fArm: [112 + 20 * strokeP, 96 + 16 * strokeP], bArm: [150, 120], tilt: -14, lean: 9}}));
  s.push(`<path d="M${f1(ironX - 60)},${by - 18} l110,0 l12,-8 l-24,-26 l-86,0 Z" fill="#0D0C09"/><path d="M${f1(ironX - 36)},${by - 44} q36,-28 72,0" stroke="#0D0C09" stroke-width="8" fill="none"/>`);
  s.push(MAT.smoke(ironX - 10, by - 30, t, {col: 'DFE0D6', k: 0.5, n: 4, rise: 140, drift: 40, speed: 1.6, seed: 93}));
  // two treadle machines nearly touching: the daughter at the first, the mother at the second
  for (const [mx, who] of [[990, 'daughter'], [1336, 'mother']]) {
    s.push(MAT.shadow(mx + 20, F - 6, 150, 0.35) + scaled(mx, F - 8, 1.25, treadle(mx, F - 8, t + mx, 1)));
    const ox = mx - 180, hh = who === 'daughter' ? H * 0.8 : H * 0.88;
    s.push(`<rect x="${ox - 50}" y="${F - 128}" width="90" height="12" fill="#0D0C09"/><rect x="${ox - 44}" y="${F - 116}" width="10" height="116" fill="#0D0C09"/><rect x="${ox + 24}" y="${F - 116}" width="10" height="116" fill="#0D0C09"/>` + MAT.shadow(ox, F + 2, 70, 0.3));
    if (who === 'daughter') s.push(nb('ndaughter', {x: ox, y: sitY(F, hh), h: H, scale: 0.8, d: 1, hat: 'none', wear: ['plain', 'apron'], det: lod.det, rim, an: {...POSES.sew(t, 0.3), tilt: t > 6.2 && t < 7.4 ? 4 : -14, expr: t > 6.2 && t < 7.4 ? 'worried' : 'set', blink: t % 3.1 < 0.12}}));
    else s.push(nb('nmother', {x: ox, y: sitY(F, hh), h: H, d: 1, det: lod.det, rim, an: {...POSES.sew(t + 0.4, 0.6), tilt: -12}}));
  }
  // cut cloth piles up by the door; the boy pulls basting threads on the floor in front
  const drop = smooth(5.8, 6.1, t);
  s.push(coatPile(560, F + 50, 6 + Math.round(5 * drop), 94, '#4E726C') + MAT.shadow(650, F + 52, 120, 0.4));
  s.push(nb('nson', {x: 1010, y: F + 44, h: H, scale: 0.5, d: 1, floorY: F + 44, det: lod.det, rim, an: {...POSES.handsew(t, 0.2), legs: [86, 86], shins: [96, 90]}}) + coatPile(1110, F + 62, 4, 97, '#2B4744'));
  // the contractor (ink, bowler) comes in through the door with a bundle on his shoulder, drops it on the pile, goes out
  const cIn = smooth(4.4, 5.6, t), cOut = smooth(6.6, 7.8, t), cx = 330 + 260 * cIn - 300 * cOut, walking = (t > 4.4 && t < 5.6) || (t > 6.6 && t < 7.8);
  if (t > 4.2 && t < 8) { s.push(figure({x: cx, y: F, h: H, d: cOut > 0 ? -1 : 1, kind: 'man', hat: 'bowler', coat: 'frock', fill: '#0D0C09', an: walking ? walkAn(walkPhase(260 * cIn + 300 * cOut, H)) : {...POSES.stand(t, 0.2), fArm: [130, 120]}}) + MAT.shadow(cx, F + 2, 76, 0.35));
    if (t < 5.9) s.push(bundle(cx - 10, F - H * 0.8, 3.2, '#4E726C')); }
  s.push(room.front);
  const world = layerAt(c, 1, s.join(''));
  const scr = [tag(40, 1040, 'A TENEMENT WORKSHOP · ABOUT 1885', 1)];
  if (t > 0.8 && t < 4.4) scr.push(penS(180, 150, 'one room, about 12 feet across', 30, -3));
  if (t > 6.4) scr.push(penS(1060, 150, 'paid by the piece', 34, -3), tag(1100, 230, 'COMPOSITE CHARACTERS', smooth(6.4, 6.8, t)));
  return frame(e3Defs2(t), `<rect width="1920" height="1080" fill="#060A0A"/>`, world, scr.join(''), t);
}

/* ================= ep3_letter: a letter home with a ticket in it, and the route ================= */
// Letters pulled relatives over: a family in New York wrote home and often bought the next one's passage ahead (a prepaid ticket).
// Part one: the kitchen table by lamplight; the father (accent) writes; the letter itself (Yiddish runs right to left, drawn as
// unreadable script) and a prepaid steamship ticket folded in. Part two: the route on a map: from a town in the Russian Empire's
// Pale of Settlement by rail west to Hamburg, then by steamship to New York. The letter goes east, the cousin comes west.
// Land outlines for the route map (Natural Earth 1:50m land, public domain), equirectangular squashed by cos 48, 2400 x 939 px.
const E3_LAND = 'M1039,-140L1040,-132L1024,-127L1017,-130L990,-127L998,-140L1017,-139L1032,-144ZM1955,210L1968,215L1950,222L1946,229L1943,228L1946,223L1941,220L1940,214ZM2481,-91L2480,-87L2478,-89L2469,-81L2455,-78L2446,-80L2444,-84L2444,-93L2456,-100ZM1978,867L1984,866L1983,868L1988,872L2014,873L2015,879L2024,874L2022,882L1996,884L1990,878L1973,875L1973,867L1976,864ZM1970,770L1972,774L1983,779L1986,791L1992,794L1991,798L1985,794L1982,786L1974,784L1965,773L1960,773L1967,768ZM2180,866L2170,874L2172,883L2166,883L2153,895L2147,892L2142,890L2139,880L2150,877L2151,871L2164,872ZM1887,232L1882,236L1884,245L1873,257L1869,258L1871,256L1869,240L1877,233L1884,230ZM1763,291L1756,300L1760,305L1754,308L1753,318L1750,320L1746,308L1739,307L1737,304L1735,295L1733,293L1739,292L1742,286L1745,286L1749,293L1750,286L1757,281L1763,283ZM1727,296L1729,309L1723,312L1714,307L1712,298ZM1584,746L1590,749L1584,759L1577,758L1574,753L1571,755L1569,751L1577,744L1584,741ZM347,481L328,479L313,473L307,465L296,460L300,457L327,464L346,476ZM360,571L364,570L361,578L367,576L372,570L367,571L375,560L384,565L384,571L377,577L357,581L352,571L364,547L373,541L372,562ZM308,556L311,553L321,557L340,555L342,557L333,564L333,570L323,567L326,566L324,561L319,565L312,563L309,558L303,557L302,552L297,550L305,539L303,547ZM143,712L154,710L140,718L116,723L115,719L122,714L140,712L147,707ZM1707,715L1711,726L1707,732L1706,764L1696,762L1695,770L1689,771L1684,763L1687,745L1680,714L1687,716L1700,704ZM1704,660L1706,679L1699,701L1692,695L1690,682L1687,673L1690,668L1701,663L1702,654ZM1821,791L1811,812L1815,824L1812,834L1801,832L1793,823L1767,809L1761,802L1766,792L1770,796L1777,792L1786,798L1819,789ZM519,-112L532,-108L535,-103L531,-99L500,-93L492,-97L502,-99L499,-101L479,-104L480,-112L489,-112L481,-115L482,-121L507,-120ZM1465,213L1463,219L1448,229L1447,232L1450,233L1445,240L1459,236L1484,236L1490,243L1474,269L1461,274L1469,273L1473,277L1460,284L1452,282L1483,287L1492,297L1500,322L1522,338L1520,341L1526,353L1511,349L1518,350L1529,361L1531,366L1525,373L1529,376L1534,371L1548,372L1555,377L1557,385L1554,396L1547,399L1548,403L1538,406L1541,411L1532,414L1551,417L1550,422L1542,429L1530,433L1509,434L1497,430L1498,432L1495,434L1485,435L1485,438L1467,435L1459,437L1454,449L1444,444L1434,447L1426,454L1417,454L1444,422L1464,421L1477,406L1461,416L1450,410L1443,411L1446,408L1437,406L1430,409L1424,402L1445,389L1448,383L1446,372L1435,376L1443,366L1452,361L1465,363L1465,358L1471,361L1465,355L1469,337L1464,338L1455,326L1458,320L1466,314L1456,315L1448,319L1432,318L1430,322L1425,314L1435,299L1431,288L1436,286L1432,283L1432,280L1424,288L1427,279L1421,285L1418,302L1415,304L1419,290L1417,283L1425,263L1416,270L1407,264L1415,260L1412,259L1418,250L1413,245L1417,241L1414,237L1417,231L1426,231L1421,226L1422,221L1428,220L1428,212L1439,213L1462,209L1466,210ZM1387,312L1391,308L1407,307L1415,318L1412,323L1417,323L1420,327L1416,326L1417,334L1403,342L1409,372L1401,389L1403,392L1393,394L1391,391L1370,403L1364,402L1365,406L1356,410L1338,414L1342,408L1331,410L1341,402L1332,405L1326,402L1335,395L1327,393L1338,391L1335,387L1340,383L1357,379L1353,377L1349,380L1335,382L1344,375L1347,367L1354,364L1332,358L1331,354L1339,353L1335,349L1341,347L1335,345L1336,339L1332,337L1332,334L1361,335L1360,332L1369,323L1357,322L1364,316L1366,309L1378,306L1378,314L1385,303L1391,306ZM1228,-7L1246,-11L1236,-3L1244,-1L1241,7L1250,6L1248,12L1254,10L1264,14L1261,18L1265,27L1260,29L1256,36L1250,36L1245,45L1222,52L1207,61L1184,65L1182,70L1175,72L1139,70L1133,66L1135,62L1130,64L1121,59L1092,62L1091,55L1101,56L1115,46L1104,48L1106,42L1113,39L1103,42L1096,34L1070,36L1066,32L1107,27L1109,23L1097,24L1096,22L1108,16L1105,14L1088,12L1069,17L1058,14L1062,11L1069,13L1065,6L1074,9L1080,7L1070,4L1076,3L1071,-1L1077,-1L1074,-3L1077,-5L1085,1L1092,-1L1093,4L1096,3L1096,-2L1087,-6L1096,-8L1083,-10L1088,-13L1097,-12L1116,-1L1114,1L1118,3L1117,7L1111,8L1121,21L1128,10L1134,12L1139,-3L1153,7L1155,-2L1165,-5L1178,8L1175,-4L1183,-4L1190,1L1197,-6L1210,-6L1209,-13L1214,-15L1219,-15ZM1406,217L1399,225L1401,227L1391,235L1389,233L1393,230L1389,227L1390,221L1396,222L1395,219L1405,213ZM-126,-143L-108,-147L-97,-147L-92,-143L-90,-160L-102,-162L-113,-170L-101,-177L-82,-172L-92,-180L-88,-182L-102,-183L-108,-191L-100,-198L-81,-193L-104,-202L-96,-209L-84,-212L-72,-211L-74,-214L-51,-220L-31,-219L-22,-208L-11,-203L-11,-197L-5,-192L-23,-180L-12,-184L-18,-177L-13,-174L-18,-173L-18,-168L-3,-177L2,-176L-2,-180L3,-184L19,-179L19,-172L27,-167L22,-174L25,-181L47,-176L33,-181L29,-184L30,-187L43,-191L59,-191L82,-187L93,-182L94,-177L78,-163L92,-173L109,-172L108,-166L91,-163L101,-162L95,-149L105,-161L117,-164L120,-163L111,-154L120,-159L130,-150L128,-158L135,-162L159,-157L167,-149L140,-138L157,-144L178,-144L176,-136L154,-126L166,-128L163,-118L172,-130L180,-135L191,-138L206,-136L222,-128L189,-115L214,-120L209,-113L214,-112L224,-117L222,-119L227,-123L241,-115L244,-108L228,-107L205,-100L219,-102L243,-98L254,-94L251,-90L230,-92L209,-88L221,-90L232,-87L231,-79L203,-81L225,-77L230,-72L253,-70L247,-66L251,-63L249,-59L253,-61L254,-58L255,-63L263,-65L258,-52L268,-59L269,-55L276,-56L278,-48L278,-53L287,-58L285,-51L293,-52L308,-45L303,-43L305,-38L291,-38L308,-36L313,-39L323,-35L310,-23L325,-27L336,-26L341,-30L356,-18L352,-16L341,-18L351,-12L345,-9L332,-12L335,-9L333,-6L343,-1L331,-0L336,5L330,10L321,10L315,4L316,8L311,10L317,11L317,22L312,31L298,24L300,17L294,25L278,7L296,-9L286,-2L270,0L273,-6L265,-4L248,-18L246,-15L242,-16L243,-9L231,-13L244,-1L241,2L232,1L220,-7L214,-6L224,-2L225,4L231,6L230,12L237,10L245,16L241,19L251,26L253,34L255,28L262,33L263,36L268,32L277,36L280,39L276,43L284,45L282,48L275,49L282,56L292,56L290,59L294,60L297,65L294,66L295,78L292,78L282,64L284,78L292,88L283,87L284,96L262,82L262,86L259,85L254,78L253,83L231,65L233,73L219,65L211,65L226,80L235,83L234,85L267,108L264,111L266,116L262,118L217,106L207,102L198,92L186,92L169,85L172,82L165,84L153,74L164,69L147,65L149,60L143,62L125,46L128,40L116,40L113,45L112,40L106,39L101,33L97,34L102,41L97,44L82,42L81,46L62,50L42,46L34,36L38,28L50,23L48,18L51,16L79,22L85,27L87,33L88,28L80,20L123,15L119,7L106,-5L133,-21L137,-29L148,-36L128,-67L118,-67L117,-77L112,-77L114,-73L106,-73L97,-80L100,-82L96,-84L99,-87L65,-77L66,-86L79,-87L83,-90L81,-94L67,-99L66,-102L72,-104L55,-103L60,-107L46,-109L42,-121L33,-120L18,-131L11,-125L20,-122L22,-114L9,-111L-30,-117L-18,-110L-18,-106L-30,-112L-44,-109L-60,-114L-74,-113L-103,-117L-110,-115L-120,-118L-124,-124L-122,-127L-149,-121L-169,-129L-180,-144L-149,-141L-136,-143L-188,-156L-191,-169L-184,-176L-188,-178L-188,-183L-178,-194L-176,-202L-147,-220L-122,-224L-97,-222L-95,-219L-114,-208L-127,-193L-120,-184L-118,-168L-96,-152ZM-273,-164L-263,-164L-262,-160L-248,-152L-245,-144L-247,-138L-235,-132L-229,-122L-224,-123L-220,-119L-235,-121L-238,-117L-228,-115L-245,-104L-235,-105L-227,-101L-213,-104L-218,-100L-198,-98L-207,-93L-214,-94L-200,-82L-201,-70L-195,-65L-189,-71L-184,-86L-177,-93L-173,-93L-153,-80L-149,-65L-159,-65L-158,-56L-140,-34L-125,-42L-122,-51L-113,-59L-108,-76L-93,-79L-97,-81L-93,-88L-103,-92L-105,-109L-45,-104L-52,-99L-44,-97L-42,-92L-26,-91L-37,-82L-26,-81L-24,-78L-36,-70L-49,-70L-42,-61L-38,-62L-39,-55L-25,-43L-28,-30L-65,-11L-86,-28L-92,-29L-97,-26L-90,-27L-80,-19L-74,-6L-82,-8L-88,-6L-107,-16L-128,-15L-127,-10L-113,-3L-142,19L-152,19L-186,2L-217,1L-210,5L-209,2L-189,6L-171,19L-134,23L-139,33L-154,52L-168,57L-175,54L-174,58L-183,56L-187,52L-191,53L-188,58L-194,58L-191,63L-193,66L-206,69L-228,62L-235,63L-261,53L-258,61L-253,61L-255,58L-232,66L-237,70L-226,66L-204,77L-205,86L-218,91L-235,91L-227,97L-239,98L-243,103L-239,109L-252,103L-246,108L-254,116L-259,116L-254,120L-265,129L-276,154L-281,157L-279,159L-282,192L-285,197L-272,207L-273,219L-269,207L-251,207L-237,247L-244,258L-212,249L-202,250L-168,261L-143,284L-108,296L-99,303L-102,311L-96,305L-74,304L-46,311L-42,318L-46,335L-41,347L-44,369L-30,386L-35,392L-28,393L-13,405L-8,416L-16,423L-9,418L-2,419L12,434L5,424L6,417L13,409L21,421L24,413L19,405L30,391L17,351L19,342L14,339L16,337L5,322L42,305L62,285L66,270L65,251L59,235L47,221L28,209L30,202L43,188L43,180L50,183L48,180L52,170L46,168L49,167L44,159L48,155L42,153L46,147L35,147L47,126L38,119L36,106L50,98L80,105L82,107L80,109L89,105L102,111L102,108L120,100L139,110L138,118L143,116L148,119L152,123L148,126L155,123L159,125L155,130L159,131L157,133L163,138L185,140L191,146L201,142L202,147L195,157L197,169L178,170L196,173L198,180L197,190L203,191L199,203L197,204L195,201L188,206L194,208L204,203L215,202L221,207L224,214L222,223L209,231L221,226L228,214L231,219L227,224L233,216L235,228L237,222L253,214L260,205L265,209L267,215L266,204L278,198L272,193L278,190L277,186L285,188L278,184L277,177L285,177L282,173L289,161L295,163L297,166L290,170L299,169L300,178L304,176L310,185L306,188L309,191L314,190L316,194L305,198L319,197L318,203L323,203L326,209L314,218L320,214L332,214L327,222L319,227L334,223L337,229L344,230L343,239L333,242L344,244L343,249L356,256L355,265L333,262L348,270L344,273L354,274L348,278L355,279L356,283L353,285L360,288L367,286L370,292L374,291L373,295L377,299L369,311L386,304L392,308L384,318L395,307L400,309L404,318L411,320L420,317L430,325L407,340L384,346L378,353L373,351L379,356L375,362L407,342L420,339L413,338L413,336L430,337L436,348L428,353L432,357L441,349L447,348L458,357L461,364L461,380L451,383L462,385L461,388L457,387L463,393L439,414L409,419L379,448L348,452L344,449L329,447L281,446L257,449L249,456L241,474L223,478L197,507L171,499L193,507L191,520L166,547L148,553L134,563L124,577L114,584L108,583L115,588L101,598L123,586L130,569L154,551L181,540L201,513L224,495L255,480L276,476L289,478L300,486L301,489L295,488L300,493L298,500L281,512L268,507L253,512L260,511L270,515L274,522L286,517L291,520L287,530L280,538L289,539L288,544L294,562L306,565L308,566L304,569L310,573L330,577L329,579L334,580L344,573L347,579L353,578L355,581L357,585L353,587L361,589L318,608L312,607L312,613L305,608L303,612L299,611L300,617L277,640L264,632L263,622L269,610L265,612L296,588L302,597L303,592L317,587L288,588L299,574L296,575L293,571L290,580L269,591L265,589L266,586L258,595L245,593L248,603L244,607L232,610L227,615L226,612L220,612L218,619L213,617L214,610L205,627L200,629L199,627L198,630L197,626L194,633L191,630L187,633L175,660L179,665L171,674L176,677L182,690L190,688L186,681L188,681L191,692L178,696L177,691L168,698L169,690L166,692L164,689L161,701L135,704L115,719L115,705L116,714L109,725L115,729L113,746L112,741L106,758L97,770L97,764L85,755L87,746L94,741L86,746L84,755L94,775L92,780L94,785L77,821L77,814L83,798L79,798L79,787L75,789L71,785L71,780L76,779L70,777L73,773L70,771L74,766L72,763L79,758L76,757L79,754L75,753L68,762L65,761L69,787L63,782L70,795L57,784L53,785L57,772L51,786L71,800L70,806L67,806L55,792L70,809L71,815L68,818L62,811L71,824L69,826L64,819L52,816L63,821L67,828L76,828L85,859L77,835L80,851L73,846L73,850L66,854L62,847L62,855L75,855L75,863L79,855L81,858L80,864L73,872L67,871L65,867L62,870L56,867L66,875L61,883L56,878L58,882L67,883L68,887L52,894L49,890L50,896L43,903L39,913L39,906L38,913L30,913L22,919L15,932L15,928L14,936L1,945L1,949L-12,953L-9,956L-11,960L-15,955L-13,962L-21,971L-28,993L-24,1031L-10,1068L-9,1085L-12,1067L-13,1072L-16,1060L-14,1071L-1,1116L-2,1143L-9,1161L-21,1163L-22,1158L-18,1160L-26,1143L-33,1139L-37,1125L-35,1119L-39,1123L-38,1111L-44,1114L-52,1096L-46,1086L-50,1082L-51,1090L-54,1086L-51,1056L-70,1027L-77,1022L-101,1034L-108,1021L-107,1017L-110,1020L-123,1013L-117,1013L-119,1011L-137,1015L-133,1013L-133,1009L-139,1015L-142,1016L-142,1014L-152,1018L-148,1016L-153,1005L-155,1014L-170,1013L-183,1020L-193,1014L-197,1017L-198,1021L-194,1024L-185,1020L-187,1025L-183,1028L-179,1023L-178,1030L-185,1036L-172,1047L-174,1053L-179,1054L-180,1048L-194,1038L-193,1049L-200,1045L-205,1050L-215,1045L-212,1044L-214,1037L-219,1037L-227,1029L-234,1037L-251,1031L-263,1033L-264,1025L-265,1034L-281,1042L-277,1038L-281,1038L-281,1032L-286,1033L-284,1043L-302,1063L-309,1068L-305,1064L-313,1065L-317,1062L-313,1069L-318,1072L-319,1070L-321,1076L-327,1078L-325,1082L-332,1086L-329,1091L-332,1101L-338,1097L-333,1103L-332,1125L-326,1138L-337,1184L-340,1235L-338,1250L-330,1265L-332,1273L-331,1265L-338,1252L-327,1289L-313,1313L-310,1328L-301,1343L-303,1343L-298,1347L-299,1344L-289,1346L-275,1362L-258,1354L-245,1353L-237,1347L-228,1346L-227,1351L-220,1353L-215,1349L-218,1341L-205,1328L-197,1281L-187,1273L-161,1265L-153,1264L-138,1268L-137,1265L-140,1265L-134,1264L-130,1269L-130,1281L-146,1320L-141,1321L-146,1328L-146,1331L-143,1330L-150,1359L-153,1351L-153,1342L-159,1356L-155,1356L-154,1360L-158,1405L-169,1426L-164,1430L-164,1425L-155,1432L-147,1426L-143,1429L-132,1430L-121,1429L-114,1423L-104,1426L-95,1424L-87,1429L-81,1428L-72,1439L-78,1437L-78,1440L-72,1446L-67,1445L-69,1441L-64,1445L-60,1452L-65,1457L-61,1471L-67,1488L-67,1525L-68,1517L-72,1523L-70,1536L-73,1541L-70,1547L-74,1557L-64,1585L-45,1610L-40,1624L-34,1624L-36,1619L-29,1627L-20,1628L8,1606L17,1607L28,1611L41,1621L61,1653L59,1635L71,1623L76,1612L83,1610L85,1588L82,1590L91,1572L98,1563L108,1566L104,1570L107,1572L112,1557L127,1557L147,1540L150,1532L160,1525L166,1528L169,1536L164,1544L153,1549L160,1575L150,1599L160,1621L167,1618L170,1602L162,1579L162,1567L186,1555L189,1551L194,1552L194,1547L187,1548L185,1540L190,1532L197,1552L213,1553L221,1561L226,1580L262,1576L269,1587L283,1592L301,1581L310,1580L299,1576L345,1573L336,1579L325,1579L330,1586L329,1593L332,1588L337,1600L341,1595L348,1605L347,1599L351,1597L366,1612L357,1634L350,1634L356,1639L366,1634L378,1633L404,1659L410,1670L406,1697L411,1684L419,1686L434,1703L435,1721L439,1708L453,1711L459,1717L460,1709L488,1711L494,1713L492,1726L498,1714L516,1724L528,1738L527,1743L529,1740L532,1744L533,1755L537,1747L540,1763L542,1756L548,1762L558,1818L563,1827L572,1832L573,1846L557,1872L547,1881L534,1918L521,1923L534,1924L554,1905L558,1929L564,1936L571,1931L577,1934L585,1928L578,1954L586,1933L596,1921L601,1925L603,1921L601,1911L607,1900L618,1898L621,1901L620,1897L623,1897L658,1917L660,1928L665,1921L671,1930L673,1928L675,1937L671,1943L673,1946L677,1940L678,1946L674,1952L672,1970L681,1949L684,1950L682,1959L698,1946L719,1958L726,1957L734,1962L753,1958L763,1960L791,1985L816,2019L827,2024L838,2023L848,2026L857,2061L860,2106L854,2133L831,2177L820,2187L813,2203L812,2199L806,2223L795,2244L790,2248L787,2238L784,2243L785,2246L779,2266L783,2330L777,2368L778,2383L769,2398L766,2436L744,2483L743,2505L729,2514L724,2522L723,2532L706,2533L702,2526L700,2533L688,2536L692,2534L688,2531L674,2535L675,2541L660,2551L658,2556L648,2556L631,2569L610,2591L611,2595L606,2602L606,2599L602,2598L600,2603L596,2601L602,2607L597,2614L595,2627L599,2653L594,2692L576,2715L554,2769L533,2793L532,2785L539,2783L547,2775L549,2765L553,2764L558,2753L558,2745L560,2745L561,2740L552,2743L547,2734L549,2743L547,2754L543,2764L534,2772L530,2786L531,2794L521,2822L492,2866L478,2873L463,2869L453,2872L435,2859L422,2860L411,2839L412,2823L417,2817L415,2803L416,2817L411,2821L409,2837L412,2852L409,2855L414,2866L428,2876L435,2885L431,2901L437,2912L443,2915L443,2931L428,2963L416,2973L384,2984L360,2989L346,2988L336,2983L337,2996L342,3000L339,3000L340,3012L335,3023L338,3037L335,3043L325,3049L312,3050L288,3038L284,3040L286,3077L295,3082L294,3086L303,3086L304,3082L300,3081L307,3078L312,3082L311,3097L302,3099L295,3089L286,3093L285,3096L299,3102L289,3108L281,3119L281,3139L273,3150L274,3160L263,3159L249,3167L236,3190L238,3201L252,3217L269,3221L271,3233L262,3240L270,3243L239,3272L230,3302L224,3305L216,3295L216,3300L210,3302L217,3302L221,3307L211,3313L203,3331L206,3330L208,3346L201,3347L210,3350L220,3369L205,3365L198,3372L178,3379L172,3394L172,3410L166,3413L158,3410L149,3405L145,3397L153,3394L156,3401L157,3394L168,3383L164,3381L150,3389L142,3401L133,3396L139,3381L144,3382L150,3378L162,3376L139,3374L133,3388L127,3389L121,3383L132,3374L116,3379L109,3362L117,3366L120,3361L128,3364L137,3358L142,3365L139,3370L143,3352L131,3343L141,3353L123,3360L119,3353L111,3350L116,3348L115,3338L99,3332L93,3321L101,3321L100,3315L102,3312L117,3329L122,3320L120,3316L115,3326L111,3319L111,3316L115,3317L102,3308L108,3301L115,3302L108,3296L109,3291L117,3291L112,3286L116,3274L110,3288L107,3285L108,3262L114,3259L105,3258L103,3245L126,3249L120,3235L115,3243L110,3244L102,3237L104,3233L110,3236L112,3234L105,3229L111,3222L108,3211L105,3213L95,3209L96,3203L85,3208L87,3215L82,3208L97,3193L94,3185L111,3182L115,3171L118,3172L114,3190L107,3194L115,3193L119,3183L117,3204L122,3185L119,3173L128,3170L135,3173L125,3167L126,3163L139,3148L140,3144L128,3136L133,3121L132,3112L138,3104L136,3093L140,3089L138,3082L140,3080L145,3085L143,3074L137,3072L146,3060L142,3066L134,3061L129,3068L121,3068L115,3049L121,3016L126,3011L129,2995L123,2975L121,2942L122,2937L129,2937L140,2892L148,2878L152,2851L159,2837L157,2821L163,2808L158,2751L165,2723L162,2702L173,2664L178,2628L177,2613L182,2598L180,2580L183,2550L179,2541L184,2529L189,2491L188,2443L184,2402L165,2382L163,2373L143,2354L119,2340L93,2317L77,2295L69,2273L72,2259L54,2222L53,2211L45,2200L24,2124L0,2071L-22,2048L-21,2044L-18,2045L-17,2039L-25,2012L-24,2002L-15,1985L1,1969L5,1952L3,1938L1,1951L-0,1946L-5,1956L-18,1943L-14,1934L-17,1909L-11,1903L-9,1895L-5,1896L-9,1889L-1,1874L-2,1856L21,1844L19,1833L23,1826L27,1828L27,1812L42,1801L56,1767L52,1768L52,1763L50,1766L49,1758L47,1759L52,1744L47,1721L52,1714L48,1703L50,1692L30,1649L35,1640L43,1647L36,1637L34,1640L30,1637L30,1641L28,1633L20,1624L11,1622L5,1634L-9,1645L-0,1665L-16,1673L-20,1654L-24,1662L-29,1659L-33,1647L-51,1642L-55,1649L-63,1632L-66,1631L-63,1639L-69,1637L-71,1618L-87,1606L-90,1597L-100,1587L-93,1599L-97,1605L-107,1597L-111,1586L-108,1576L-113,1569L-109,1563L-146,1511L-144,1507L-140,1510L-143,1499L-149,1497L-153,1504L-165,1501L-162,1503L-187,1493L-200,1483L-217,1481L-234,1464L-265,1422L-274,1415L-267,1423L-279,1418L-278,1413L-282,1415L-284,1411L-286,1415L-282,1417L-314,1433L-327,1426L-338,1424L-357,1408L-375,1403L-397,1389L-417,1368L-432,1365L-447,1357L-455,1343L-475,1329L-485,1310L-489,1298L-481,1293L-486,1286L-481,1278L-480,1267L-489,1253L-491,1235L-513,1199L-529,1182L-524,1185L-524,1182L-532,1178L-539,1165L-534,1165L-548,1152L-553,1153L-550,1146L-558,1149L-560,1138L-555,1131L-558,1123L-562,1118L-567,1119L-570,1108L-581,1101L-582,1086L-593,1083L-603,1068L-624,1025L-631,1002L-629,991L-640,986L-643,980L-647,978L-650,982L-665,971L-660,1020L-626,1070L-624,1087L-616,1095L-607,1119L-604,1122L-606,1114L-601,1119L-596,1145L-585,1171L-584,1186L-578,1193L-576,1186L-560,1210L-562,1219L-572,1227L-578,1207L-611,1172L-611,1151L-617,1133L-629,1122L-632,1112L-640,1118L-645,1111L-656,1104L-667,1089L-667,1086L-658,1088L-653,1085L-649,1091L-653,1084L-649,1070L-665,1043L-680,1032L-687,1002L-698,980L-698,972L-706,958L-714,931L-725,919L-732,918L-733,910L-746,908L-754,899L-771,897L-774,894L-774,879L-798,845L-796,830L-808,820L-810,810L-808,803L-801,812L-806,797L-791,795L-807,793L-810,802L-818,795L-819,797L-817,791L-832,771L-835,747L-845,730L-839,699L-848,660L-841,635L-838,563L-823,565L-828,562L-839,561L-839,552L-837,557L-836,551L-840,545L-835,542L-840,540L-841,542L-852,502L-838,508L-815,508L-813,516L-822,531L-818,529L-820,527L-810,515L-813,523L-811,533L-815,535L-816,531L-820,537L-812,537L-807,530L-808,519L-805,512L-813,500L-809,498L-810,491L-823,480L-823,477L-817,473L-824,474L-823,465L-829,473L-837,469L-838,463L-835,467L-830,465L-836,463L-836,451L-841,461L-846,462L-851,457L-858,444L-854,431L-858,441L-866,441L-867,437L-869,442L-878,441L-885,439L-874,435L-886,436L-883,432L-886,431L-886,425L-888,429L-896,431L-909,423L-903,410L-889,407L-902,407L-908,413L-911,408L-910,393L-904,388L-900,387L-890,397L-899,385L-895,375L-896,380L-911,391L-916,405L-921,394L-915,389L-913,383L-919,388L-915,373L-921,375L-924,366L-935,360L-937,355L-931,350L-932,354L-913,362L-918,356L-927,354L-929,349L-924,346L-933,346L-944,363L-959,349L-953,338L-945,335L-954,336L-961,330L-944,300L-948,297L-953,311L-953,288L-955,294L-953,305L-956,315L-963,320L-969,319L-972,309L-967,304L-974,286L-972,282L-986,288L-989,297L-993,297L-994,292L-988,280L-982,279L-994,273L-1006,259L-1006,255L-1018,251L-1022,238L-1012,240L-1020,232L-1013,231L-1023,232L-1029,226L-1026,213L-1033,221L-1041,217L-1050,204L-1055,187L-1057,194L-1049,221L-1065,216L-1067,204L-1063,202L-1067,203L-1070,198L-1071,206L-1086,199L-1087,203L-1078,205L-1074,208L-1076,210L-1068,215L-1078,221L-1096,211L-1115,195L-1139,184L-1134,179L-1134,172L-1130,174L-1129,182L-1128,176L-1124,175L-1132,170L-1151,179L-1170,174L-1167,171L-1170,167L-1175,172L-1199,168L-1222,170L-1223,167L-1236,161L-1232,152L-1243,160L-1255,157L-1251,152L-1268,150L-1265,148L-1269,145L-1269,141L-1263,139L-1293,145L-1295,143L-1291,136L-1302,141L-1299,141L-1302,146L-1306,147L-1300,152L-1307,157L-1298,154L-1295,157L-1303,171L-1319,171L-1322,168L-1326,177L-1328,173L-1329,178L-1333,177L-1337,183L-1345,183L-1351,192L-1366,194L-1370,192L-1369,188L-1353,177L-1361,181L-1369,177L-1360,163L-1359,150L-1342,142L-1316,146L-1334,137L-1321,128L-1326,128L-1333,134L-1345,134L-1364,143L-1382,163L-1391,162L-1384,167L-1384,171L-1394,175L-1391,177L-1392,179L-1403,181L-1413,195L-1398,200L-1399,206L-1415,219L-1414,223L-1429,227L-1443,240L-1456,246L-1460,256L-1494,272L-1496,276L-1491,279L-1495,283L-1497,279L-1501,285L-1515,290L-1517,295L-1519,289L-1546,302L-1552,302L-1551,298L-1547,298L-1553,296L-1563,309L-1569,312L-1574,306L-1575,313L-1583,311L-1587,318L-1586,310L-1579,308L-1556,287L-1547,284L-1541,285L-1543,288L-1539,292L-1537,288L-1529,290L-1534,284L-1530,276L-1503,260L-1499,262L-1498,255L-1492,248L-1483,241L-1475,242L-1480,237L-1478,226L-1470,222L-1476,221L-1477,216L-1466,207L-1463,195L-1469,203L-1489,210L-1495,204L-1494,199L-1487,200L-1494,197L-1501,200L-1501,215L-1504,216L-1518,202L-1522,204L-1531,198L-1550,209L-1565,209L-1557,205L-1558,199L-1555,196L-1562,195L-1559,183L-1570,163L-1561,151L-1565,151L-1575,163L-1572,165L-1573,171L-1598,176L-1613,162L-1620,159L-1620,157L-1626,155L-1615,145L-1606,149L-1607,154L-1600,149L-1595,154L-1589,149L-1598,146L-1592,145L-1621,144L-1617,139L-1624,138L-1624,135L-1626,139L-1630,139L-1636,133L-1635,127L-1640,128L-1641,124L-1634,123L-1640,119L-1631,118L-1633,111L-1623,100L-1614,100L-1616,97L-1611,94L-1615,96L-1615,88L-1607,85L-1610,82L-1608,79L-1599,78L-1593,82L-1595,85L-1586,84L-1574,78L-1567,70L-1552,72L-1541,67L-1539,62L-1543,50L-1552,45L-1542,40L-1541,34L-1545,31L-1557,34L-1575,46L-1585,38L-1587,40L-1582,42L-1584,45L-1595,40L-1619,44L-1641,40L-1647,36L-1646,31L-1656,24L-1641,20L-1665,16L-1678,10L-1646,-4L-1631,-4L-1634,-9L-1609,-17L-1593,-16L-1598,-16L-1596,-15L-1601,-6L-1594,-2L-1561,-1L-1552,-8L-1544,-5L-1545,-10L-1560,-12L-1566,-20L-1572,-23L-1573,-25L-1569,-27L-1554,-13L-1528,-12L-1531,-17L-1540,-19L-1550,-16L-1559,-20L-1557,-29L-1591,-31L-1602,-46L-1653,-67L-1645,-69L-1642,-82L-1606,-84L-1591,-90L-1584,-96L-1580,-107L-1560,-123L-1557,-121L-1563,-118L-1543,-123L-1526,-131L-1523,-130L-1526,-123L-1521,-122L-1520,-128L-1512,-129L-1525,-132L-1518,-136L-1484,-138L-1457,-154L-1457,-151L-1440,-146L-1450,-140L-1447,-138L-1432,-145L-1422,-142L-1424,-139L-1413,-137L-1395,-140L-1377,-138L-1380,-132L-1367,-130L-1370,-127L-1319,-128L-1290,-120L-1254,-118L-1231,-113L-1204,-117L-1170,-104L-1127,-100L-1102,-88L-1053,-76L-1056,-81L-1065,-83L-1059,-86L-1065,-89L-1061,-94L-1053,-94L-1050,-99L-1037,-99L-1036,-105L-1026,-100L-1032,-93L-1013,-98L-1008,-103L-998,-104L-1000,-106L-974,-111L-965,-117L-945,-119L-946,-114L-968,-104L-989,-101L-1004,-93L-1017,-81L-1012,-78L-1016,-81L-1001,-81L-1004,-88L-989,-94L-986,-98L-978,-96L-973,-98L-971,-91L-955,-106L-931,-113L-936,-108L-934,-105L-931,-107L-920,-117L-908,-121L-918,-126L-914,-130L-900,-122L-881,-101L-867,-95L-860,-98L-864,-103L-861,-109L-853,-114L-857,-115L-849,-118L-846,-107L-840,-105L-847,-98L-845,-96L-829,-96L-820,-108L-801,-109L-709,-83L-687,-81L-690,-85L-682,-85L-667,-81L-647,-68L-649,-65L-662,-65L-669,-61L-675,-54L-669,-52L-619,-48L-590,-51L-573,-57L-564,-49L-553,-48L-550,-40L-545,-45L-533,-36L-533,-31L-543,-31L-519,-11L-528,-21L-528,-27L-517,-25L-533,-52L-529,-54L-529,-58L-503,-63L-503,-66L-490,-74L-504,-72L-507,-67L-526,-66L-528,-62L-538,-61L-547,-65L-539,-74L-498,-83L-489,-81L-483,-69L-470,-63L-466,-59L-447,-60L-425,-49L-411,-48L-390,-52L-360,-49L-351,-51L-356,-56L-355,-59L-342,-49L-332,-46L-327,-49L-328,-53L-338,-56L-347,-55L-355,-67L-339,-68L-340,-72L-330,-71L-323,-64L-313,-66L-319,-58L-304,-64L-312,-43L-307,-36L-299,-37L-301,-34L-294,-33L-294,-29L-313,-30L-301,-18L-305,-27L-293,-27L-291,-36L-298,-49L-294,-58L-281,-59L-256,-75L-260,-75L-264,-85L-268,-79L-278,-80L-268,-89L-272,-90L-272,-94L-259,-97L-262,-92L-256,-96L-260,-100L-272,-98L-279,-104L-282,-102L-306,-109L-314,-117L-315,-123L-309,-129L-302,-129L-303,-134L-312,-133L-315,-137L-315,-146L-306,-154L-296,-152L-293,-156L-302,-159L-290,-168L-277,-170ZM-14,377L-38,370L-36,365L-22,364ZM121,-51L103,-52L100,-58L107,-60L125,-57L126,-51ZM-38,87L-40,95L-57,108L-70,109L-71,107L-74,100L-64,88ZM9,102L14,107L13,113L5,125L-0,122L-5,119L-4,110L1,103ZM-94,21L-86,15L-78,22L-39,39L-32,51L-36,56L-16,54L-13,60L-5,63L-20,72L-45,65L-47,59L-58,56L-58,52L-68,55L-71,62L-87,75L-100,81L-105,81L-110,65L-137,68L-132,60L-119,53L-121,41L-116,13L-111,5L-106,2L-100,6L-97,11L-100,14ZM82,-66L94,-62L91,-42L80,-37L60,-35L51,-48L55,-55L65,-65ZM20,277L16,288L16,279L10,288L4,290L10,281L2,288L-0,287L10,273L10,279L14,268ZM467,412L465,416L457,418L461,426L443,455L441,466L454,452L454,457L467,456L454,466L460,465L455,471L469,470L470,473L472,469L469,482L486,469L487,475L496,471L502,475L503,480L492,490L498,489L496,492L501,494L493,501L513,494L512,501L498,512L502,512L498,518L503,522L509,512L517,509L511,522L512,528L520,520L516,540L511,551L503,551L503,537L493,545L498,528L492,516L486,529L486,525L479,530L470,544L461,545L459,540L480,522L469,522L465,528L455,527L460,524L460,518L442,525L413,520L398,525L394,520L395,513L413,498L397,496L403,491L402,494L405,495L411,482L419,484L419,477L415,477L415,473L419,468L423,470L420,464L437,427L444,418L457,411L463,414L463,411ZM1857,-102L1867,-100L1866,-91L1847,-87L1844,-87L1848,-96L1854,-96L1852,-99ZM1891,-116L1897,-113L1882,-102L1869,-101L1871,-105L1880,-108L1888,-121ZM1824,-73L1831,-81L1838,-80L1838,-75L1828,-68L1810,-65L1797,-62L1795,-64L1817,-74L1819,-87L1827,-93L1831,-93L1825,-86L1827,-78ZM953,-500L1032,-491L914,-486L914,-483L1045,-488L1058,-480L1111,-475L1112,-471L1083,-465L960,-460L955,-457L961,-454L994,-457L1045,-455L1061,-447L1076,-449L1084,-456L1117,-457L1121,-454L1119,-444L1084,-425L1083,-421L1150,-445L1191,-438L1217,-449L1253,-450L1287,-446L1306,-440L1274,-429L1249,-427L1253,-423L1248,-420L1205,-415L1220,-411L1210,-406L1180,-403L1154,-406L1140,-399L1142,-392L1155,-391L1154,-380L1162,-375L1121,-360L1125,-357L1110,-333L1117,-333L1126,-339L1153,-334L1156,-331L1153,-329L1140,-333L1130,-331L1134,-326L1156,-319L1173,-321L1175,-311L1169,-306L1142,-311L1125,-310L1112,-304L1101,-307L1093,-305L1107,-301L1115,-292L1141,-291L1152,-278L1155,-267L1152,-261L1134,-265L1111,-257L1100,-260L1111,-255L1124,-258L1128,-251L1123,-246L1126,-246L1135,-255L1143,-255L1156,-243L1155,-236L1138,-236L1130,-232L1106,-235L1109,-241L1106,-244L1105,-239L1099,-236L1101,-234L1098,-230L1102,-227L1136,-223L1133,-213L1098,-207L1081,-211L1064,-221L1054,-216L1038,-224L1052,-214L1027,-206L1004,-212L1018,-206L999,-203L1003,-201L1047,-211L1064,-211L1104,-197L1103,-182L1099,-181L1099,-174L1065,-185L1055,-200L1016,-191L1051,-196L1054,-187L1045,-181L1056,-183L1106,-164L1095,-157L1096,-153L1097,-149L1099,-155L1109,-156L1114,-129L1097,-127L1096,-138L1092,-126L1079,-127L1067,-132L1056,-149L1031,-159L1009,-160L1007,-157L1032,-156L1033,-148L1015,-141L983,-142L991,-139L989,-134L970,-127L1017,-127L1018,-124L999,-117L998,-115L1002,-114L1009,-120L1038,-124L1073,-118L1099,-117L1099,-115L1085,-111L1085,-108L1069,-106L1072,-102L1061,-102L1061,-98L1044,-93L1046,-90L1034,-82L1019,-76L949,-63L939,-64L941,-60L934,-59L908,-69L911,-64L907,-63L911,-57L893,-47L874,-21L864,-12L854,-7L841,-13L845,-4L831,5L828,-0L825,6L818,4L805,12L800,8L814,-9L797,-11L805,-7L797,3L790,-0L796,8L759,13L769,20L757,27L741,27L744,32L749,31L758,43L747,51L732,48L742,53L750,53L751,65L747,70L742,71L735,84L720,79L731,86L726,93L706,93L721,98L718,110L722,118L713,122L717,125L710,149L704,156L687,154L702,161L702,169L699,173L687,170L692,175L678,174L681,163L674,170L659,165L660,160L672,152L659,158L647,153L645,149L650,136L631,148L613,147L613,150L605,148L614,142L602,142L601,137L592,134L590,127L585,126L587,123L583,117L594,112L579,114L580,107L565,100L566,93L575,84L564,90L542,64L542,57L566,51L562,51L563,48L541,54L539,51L545,44L562,37L571,44L569,37L562,35L553,23L557,36L548,39L550,35L548,35L536,50L532,47L528,24L523,19L541,8L551,6L539,8L527,15L510,12L512,1L507,-2L548,-25L514,-6L503,-4L502,-12L506,-18L514,-24L526,-25L501,-28L497,-32L499,-40L524,-50L560,-43L549,-48L553,-51L538,-49L527,-52L500,-44L511,-63L541,-58L548,-66L548,-69L530,-63L507,-65L514,-74L522,-77L541,-72L550,-74L556,-79L548,-78L551,-89L566,-90L551,-91L556,-104L565,-108L562,-112L565,-115L528,-116L514,-122L495,-126L485,-134L492,-137L518,-135L542,-126L558,-125L546,-131L547,-138L538,-143L552,-142L545,-146L514,-147L512,-151L516,-155L538,-162L506,-159L512,-165L508,-165L501,-175L499,-179L502,-181L497,-180L505,-168L495,-161L496,-155L482,-153L465,-158L463,-162L470,-174L479,-181L465,-176L464,-179L471,-181L465,-184L478,-187L481,-196L475,-200L471,-197L463,-199L463,-202L471,-209L468,-212L462,-210L455,-215L460,-221L453,-231L434,-231L444,-234L443,-240L452,-243L408,-266L414,-271L409,-276L358,-289L318,-295L279,-288L269,-291L258,-289L248,-291L254,-284L251,-284L223,-287L200,-296L226,-303L197,-306L193,-308L196,-313L179,-308L168,-315L179,-319L210,-319L226,-324L259,-321L261,-329L251,-333L235,-328L217,-330L203,-326L180,-333L188,-337L172,-336L149,-340L137,-346L142,-350L139,-352L159,-359L210,-366L209,-368L221,-371L267,-374L280,-383L290,-399L301,-401L251,-401L244,-405L248,-410L295,-427L310,-429L323,-424L319,-429L324,-433L354,-431L360,-438L358,-448L373,-453L395,-452L445,-437L395,-456L485,-465L501,-460L504,-446L514,-452L514,-465L554,-452L580,-453L554,-466L553,-469L571,-469L593,-467L672,-449L676,-451L674,-458L681,-466L679,-469L656,-477L736,-477L645,-480L639,-483L644,-486L659,-484L705,-491L737,-487L755,-493L797,-484L801,-489L786,-494L805,-498ZM1866,190L1877,188L1872,196L1847,209L1833,210L1846,214L1841,215L1843,222L1839,233L1839,254L1829,278L1825,281L1804,281L1805,284L1795,289L1797,298L1794,302L1769,301L1771,292L1761,276L1768,277L1765,272L1769,272L1769,267L1760,259L1747,236L1747,228L1742,224L1742,218L1738,217L1736,200L1741,197L1730,194L1726,177L1718,199L1711,200L1706,196L1708,200L1679,224L1666,227L1657,227L1655,223L1652,226L1649,224L1651,220L1639,217L1630,210L1631,199L1640,203L1645,199L1640,201L1636,196L1637,191L1646,184L1622,195L1624,183L1628,179L1634,180L1642,176L1633,175L1641,164L1648,159L1648,166L1657,156L1641,161L1622,181L1623,168L1632,167L1624,165L1622,158L1631,151L1624,155L1621,153L1619,141L1653,138L1658,144L1658,140L1669,136L1664,134L1666,130L1662,137L1650,134L1645,139L1625,139L1619,135L1619,130L1625,129L1618,122L1618,117L1638,120L1652,118L1624,116L1622,109L1636,102L1649,102L1641,102L1645,96L1668,98L1670,97L1667,95L1678,93L1652,93L1656,87L1668,83L1678,83L1688,90L1679,81L1688,76L1683,71L1687,68L1698,68L1698,72L1709,68L1715,74L1729,72L1728,68L1740,62L1737,60L1742,57L1737,56L1732,59L1734,61L1732,63L1715,71L1707,66L1707,63L1725,45L1743,36L1739,35L1743,29L1766,22L1770,19L1760,23L1755,18L1766,3L1772,1L1767,-3L1791,-8L1774,-7L1775,-18L1790,-23L1784,-26L1793,-32L1817,-34L1799,-36L1809,-45L1821,-38L1823,-43L1814,-46L1815,-50L1807,-47L1806,-52L1812,-56L1821,-55L1816,-59L1829,-63L1835,-54L1836,-60L1832,-66L1858,-69L1838,-72L1855,-80L1861,-88L1869,-90L1872,-99L1883,-94L1878,-99L1886,-101L1889,-107L1899,-108L1898,-97L1904,-109L1911,-112L1911,-103L1907,-95L1914,-101L1919,-100L1915,-105L1917,-111L1927,-111L1932,-114L1942,-109L1939,-116L1931,-121L1956,-125L1969,-113L1969,-121L1989,-134L1986,-137L1993,-142L2015,-138L2004,-128L2001,-117L2029,-140L2033,-138L2030,-126L2038,-128L2044,-137L2049,-137L2043,-140L2044,-142L2049,-145L2060,-144L2064,-139L2055,-133L2062,-133L2061,-121L2073,-138L2090,-132L2096,-134L2099,-129L2113,-125L2113,-122L2100,-117L2072,-118L2088,-113L2089,-107L2097,-106L2100,-110L2103,-106L2109,-108L2125,-105L2133,-108L2133,-113L2153,-106L2151,-103L2137,-105L2141,-99L2152,-99L2152,-96L2161,-98L2155,-87L2165,-94L2207,-91L2242,-77L2256,-67L2278,-59L2282,-59L2282,-61L2293,-52L2304,-49L2307,-36L2312,-34L2308,-24L2288,-9L2260,-2L2200,-11L2187,-17L2181,-16L2180,-19L2155,-24L2149,-29L2151,-31L2131,-33L2165,-13L2159,-9L2174,-6L2185,1L2186,7L2179,17L2187,29L2191,44L2203,46L2216,57L2237,62L2247,58L2249,54L2247,48L2232,45L2221,34L2220,30L2224,29L2226,24L2281,41L2287,35L2294,35L2282,19L2282,11L2299,1L2314,-4L2328,-15L2347,-12L2355,-7L2353,-4L2364,-0L2364,-7L2371,-19L2370,-27L2358,-36L2366,-57L2366,-64L2349,-76L2398,-71L2413,-53L2391,-50L2379,-40L2392,-34L2398,-25L2409,-23L2432,-28L2436,-45L2454,-48L2452,-54L2460,-53L2490,-66L2514,-72L2522,-67L2528,-71L2521,-74L2549,-85L2562,-85L2549,-83L2552,-81L2548,-75L2551,-69L2538,-65L2569,-63L2570,-68L2579,-73L2591,-75L2612,-73L2632,-82L2649,-86L2655,-78L2650,-74L2650,-70L2661,-67L2665,-70L2665,-77L2676,-78L2684,-85L2670,-102L2684,-110L2746,-101L2761,-95L2760,-92L2800,-82L2814,-72L2829,-67L2841,-84L2829,-84L2821,-92L2819,-99L2812,-102L2801,-105L2798,-101L2799,-114L2805,-117L2805,-135L2803,-138L2794,-137L2797,-144L2793,-145L2798,-150L2824,-162L2846,-198L2888,-196L2911,-190L2906,-171L2893,-155L2906,-147L2909,-141L2909,-127L2904,-122L2906,-85L2926,-71L2917,-62L2916,-50L2907,-45L2892,-29L2883,-27L2886,-19L2871,-15L2864,-17L2870,-21L2863,-20L2855,-24L2838,-22L2842,-16L2857,-11L2897,-7L2901,-9L2903,-16L2929,-28L2935,-40L2948,-50L2947,-59L2941,-69L2944,-78L2955,-81L2980,-85L2995,-70L2994,-51L3005,-45L3027,-45L3002,-50L3003,-62L3009,-64L3003,-83L2971,-92L2949,-88L2929,-91L2931,-97L2925,-108L2940,-130L2916,-155L2927,-166L2952,-175L2954,-186L2948,-194L2959,-193L2964,-187L2967,-179L2958,-170L2957,-165L2962,-161L2958,-155L2966,-150L3002,-147L3016,-140L3029,-141L3019,-143L3014,-150L2980,-158L2972,-168L2988,-172L3001,-166L3013,-168L3010,-173L3000,-173L2999,-175L3019,-182L3037,-182L3062,-173L3079,-163L3107,-163L3109,-161L3104,-155L3092,-150L3092,-137L3089,-131L3090,-125L3097,-139L3105,-139L3105,-130L3099,-120L3106,-117L3106,-122L3114,-124L3119,-129L3108,-145L3115,-162L3109,-167L3098,-169L3087,-178L3063,-185L3060,-191L3064,-198L3056,-206L3059,-215L3147,-220L3179,-225L3182,-223L3158,-212L3158,-209L3175,-202L3161,-212L3183,-217L3192,-222L3173,-235L3162,-237L3169,-241L3185,-238L3158,-246L3166,-251L3178,-248L3189,-255L3190,-257L3180,-258L3181,-261L3194,-260L3242,-273L3316,-282L3293,-282L3295,-287L3300,-287L3344,-289L3354,-287L3346,-282L3362,-285L3362,-282L3403,-292L3424,-285L3420,-279L3426,-283L3425,-289L3407,-299L3459,-297L3446,-301L3450,-305L3446,-308L3447,-313L3478,-328L3505,-334L3544,-324L3509,-316L3561,-314L3570,-311L3551,-299L3576,-300L3584,-306L3640,-305L3656,-300L3659,-298L3656,-295L3669,-296L3672,-288L3670,-286L3681,-292L3687,-282L3693,-282L3687,-272L3666,-280L3675,-272L3681,-274L3690,-269L3675,-257L3616,-237L3615,-233L3585,-219L3567,-217L3556,-209L3546,-208L3527,-193L3537,-195L3552,-203L3576,-204L3634,-219L3633,-221L3613,-220L3617,-226L3624,-228L3639,-226L3641,-229L3649,-229L3642,-227L3646,-223L3660,-219L3672,-221L3675,-223L3673,-227L3677,-225L3684,-218L3679,-212L3686,-209L3685,-201L3679,-194L3682,-190L3689,-189L3680,-194L3687,-206L3693,-209L3686,-214L3696,-216L3721,-219L3780,-216L3789,-213L3780,-212L3780,-206L3805,-199L3858,-196L3862,-197L3858,-200L3870,-198L3879,-205L3873,-212L3875,-217L3896,-221L3916,-212L3929,-215L3929,-210L3934,-209L3943,-215L3957,-213L3983,-202L3973,-196L3981,-196L3986,-191L3970,-186L3986,-183L3989,-180L3986,-173L3980,-173L3957,-183L3979,-164L3985,-168L3990,-163L3978,-161L3995,-146L4010,-139L4014,-141L4019,-135L4030,-140L4051,-169L4070,-155L4090,-153L4106,-160L4116,-160L4151,-146L4149,-149L4158,-152L4151,-153L4157,-159L4167,-160L4175,-155L4190,-156L4185,-162L4185,-168L4178,-169L4194,-176L4175,-175L4174,-180L4183,-185L4211,-188L4203,-195L4206,-196L4310,-183L4309,-181L4281,-182L4270,-178L4276,-176L4321,-179L4307,-169L4309,-175L4300,-177L4300,-169L4287,-169L4286,-164L4289,-162L4306,-165L4329,-180L4371,-175L4381,-168L4363,-165L4361,-162L4392,-157L4394,-155L4383,-149L4399,-153L4411,-150L4421,-143L4415,-142L4429,-138L4493,-145L4547,-140L4570,-128L4572,-123L4566,-110L4568,-108L4589,-103L4591,-88L4597,-83L4588,-72L4592,-73L4601,-83L4601,-96L4613,-103L4632,-106L4701,-100L4721,-106L4727,-102L4730,-93L4749,-88L4754,-79L4772,-80L4781,-89L4773,-102L4765,-103L4771,-110L4771,-117L4824,-109L4827,-112L4875,-111L4930,-96L4952,-85L4952,27L4924,40L4909,37L4893,26L4883,27L4896,28L4899,32L4897,35L4877,30L4849,37L4877,31L4883,37L4879,40L4903,35L4903,44L4908,48L4915,51L4919,47L4927,61L4928,66L4923,69L4928,74L4929,70L4932,76L4940,80L4938,85L4944,92L4936,105L4901,97L4902,92L4896,92L4895,95L4898,98L4848,119L4831,122L4822,131L4816,129L4817,133L4808,138L4807,141L4773,158L4769,172L4762,169L4755,158L4747,154L4726,154L4709,159L4691,175L4688,171L4692,157L4668,168L4666,175L4658,169L4650,174L4650,171L4643,170L4636,177L4634,191L4612,215L4609,226L4617,236L4622,229L4633,234L4624,249L4625,262L4633,265L4635,278L4629,283L4626,283L4621,278L4629,270L4622,271L4619,273L4620,277L4611,282L4604,299L4612,320L4602,327L4586,326L4573,336L4568,348L4572,366L4564,363L4548,373L4542,369L4545,374L4543,388L4535,404L4509,428L4487,307L4495,265L4511,248L4514,243L4512,233L4523,233L4527,227L4539,227L4556,213L4569,196L4605,166L4611,158L4642,145L4639,142L4648,133L4644,129L4652,106L4659,100L4671,103L4675,101L4656,94L4635,98L4629,117L4633,122L4630,126L4626,122L4617,123L4586,149L4575,153L4579,142L4567,144L4577,117L4563,122L4556,116L4516,123L4463,176L4460,184L4476,186L4479,189L4479,194L4466,193L4457,197L4451,193L4445,193L4435,201L4425,198L4421,202L4406,203L4402,197L4419,195L4424,193L4422,191L4407,183L4390,185L4394,183L4374,177L4363,181L4366,185L4358,184L4357,189L4361,189L4357,192L4348,187L4334,192L4315,186L4306,194L4296,187L4264,188L4240,192L4206,219L4199,233L4165,257L4147,281L4100,315L4100,321L4111,325L4129,324L4128,347L4136,347L4136,336L4146,334L4140,339L4149,343L4138,355L4151,353L4162,343L4163,347L4157,355L4161,355L4165,349L4166,332L4178,336L4187,334L4204,353L4217,362L4213,370L4206,368L4214,375L4212,386L4219,393L4208,409L4200,433L4202,453L4193,500L4164,539L4146,574L4112,616L4104,631L4076,656L4060,663L4044,658L4044,646L4037,652L4038,647L4034,647L4022,665L4014,665L4016,668L4014,674L4004,678L3995,691L3994,716L3972,736L3954,746L3950,763L3968,778L3989,824L3989,853L3992,853L3992,855L3985,877L3972,880L3970,886L3963,882L3956,884L3956,890L3951,887L3952,893L3949,898L3946,895L3948,889L3934,902L3929,892L3934,891L3935,887L3932,887L3929,878L3938,858L3933,834L3927,832L3933,825L3940,831L3942,827L3938,820L3936,803L3931,801L3926,804L3919,797L3912,805L3905,799L3909,795L3899,793L3906,781L3915,778L3908,774L3912,754L3900,747L3898,751L3892,740L3888,745L3879,743L3864,751L3847,767L3841,768L3841,772L3832,776L3831,771L3842,765L3844,758L3834,758L3834,753L3838,750L3838,745L3844,742L3853,726L3844,712L3842,716L3832,714L3819,734L3798,747L3790,763L3777,767L3772,762L3767,765L3763,777L3765,785L3772,792L3789,796L3792,806L3790,816L3796,822L3805,821L3814,806L3824,802L3841,812L3849,810L3860,814L3854,830L3846,827L3830,837L3825,836L3827,841L3823,842L3822,850L3817,852L3816,847L3813,848L3811,851L3815,854L3799,874L3794,887L3815,903L3826,939L3826,949L3835,956L3845,973L3845,976L3842,976L3819,965L3810,970L3823,968L3825,973L3841,987L3845,999L3837,1002L3825,1015L3818,1014L3813,1018L3819,1016L3822,1021L3833,1016L3841,1025L3849,1028L3838,1039L3845,1035L3847,1039L3846,1049L3842,1046L3837,1050L3842,1055L3838,1063L3840,1073L3834,1075L3831,1072L3828,1081L3824,1081L3821,1098L3811,1120L3807,1121L3806,1115L3804,1118L3802,1116L3807,1129L3799,1137L3793,1135L3797,1140L3802,1139L3802,1156L3794,1154L3796,1161L3790,1161L3789,1169L3784,1172L3784,1178L3773,1178L3768,1182L3772,1189L3764,1200L3761,1200L3759,1207L3758,1204L3754,1208L3751,1206L3742,1226L3726,1228L3724,1232L3718,1229L3712,1235L3708,1231L3706,1237L3700,1237L3700,1244L3693,1241L3696,1238L3686,1221L3682,1227L3687,1236L3687,1246L3679,1250L3678,1247L3675,1255L3673,1254L3668,1259L3664,1253L3663,1260L3656,1257L3650,1265L3638,1266L3630,1275L3627,1271L3622,1283L3629,1295L3626,1301L3618,1301L3613,1283L3618,1267L3610,1261L3610,1266L3602,1268L3602,1264L3596,1263L3592,1255L3591,1263L3587,1261L3586,1265L3577,1267L3570,1273L3565,1282L3556,1281L3557,1289L3553,1301L3543,1311L3536,1339L3552,1368L3552,1374L3550,1374L3578,1414L3582,1414L3597,1441L3606,1484L3608,1520L3606,1516L3604,1519L3605,1538L3600,1556L3567,1583L3562,1575L3561,1583L3557,1579L3554,1581L3557,1586L3552,1586L3558,1591L3554,1598L3545,1588L3554,1604L3550,1607L3540,1594L3546,1611L3533,1620L3526,1633L3519,1634L3524,1592L3517,1589L3510,1579L3502,1575L3497,1578L3499,1569L3496,1561L3492,1568L3489,1568L3488,1553L3478,1531L3477,1534L3461,1518L3446,1519L3447,1496L3440,1493L3429,1499L3428,1532L3413,1585L3414,1615L3425,1614L3428,1634L3434,1643L3439,1673L3433,1657L3432,1662L3437,1674L3448,1683L3457,1683L3489,1729L3494,1746L3494,1795L3501,1805L3510,1839L3504,1833L3505,1837L3495,1841L3493,1835L3453,1797L3453,1786L3442,1766L3431,1695L3423,1683L3421,1669L3416,1669L3404,1644L3402,1641L3398,1646L3396,1645L3395,1629L3404,1589L3400,1591L3399,1575L3407,1545L3403,1545L3401,1504L3394,1481L3393,1488L3391,1462L3387,1456L3383,1423L3385,1407L3379,1408L3375,1392L3369,1383L3367,1403L3361,1409L3356,1401L3359,1411L3348,1418L3341,1431L3340,1421L3337,1428L3332,1428L3331,1418L3327,1426L3328,1409L3323,1421L3319,1423L3326,1379L3315,1330L3313,1341L3305,1327L3311,1331L3314,1325L3307,1316L3309,1312L3300,1307L3298,1313L3297,1299L3292,1304L3290,1293L3290,1301L3282,1287L3277,1276L3274,1243L3266,1227L3261,1234L3256,1236L3251,1223L3250,1207L3249,1212L3243,1211L3249,1216L3246,1231L3250,1242L3242,1257L3239,1256L3242,1248L3237,1252L3237,1249L3238,1239L3230,1259L3228,1245L3226,1260L3221,1256L3220,1250L3220,1262L3216,1260L3214,1264L3212,1249L3211,1262L3208,1263L3205,1259L3202,1263L3204,1249L3199,1242L3203,1249L3199,1257L3180,1271L3178,1278L3180,1290L3176,1301L3169,1309L3167,1308L3166,1312L3154,1318L3152,1313L3148,1316L3146,1321L3151,1320L3138,1334L3126,1358L3093,1392L3091,1407L3081,1414L3072,1414L3066,1430L3060,1426L3053,1432L3049,1450L3053,1495L3051,1488L3049,1491L3054,1498L3042,1557L3045,1560L3045,1585L3035,1587L3027,1606L3029,1613L3036,1617L3028,1615L3018,1620L3011,1640L3000,1649L2992,1642L2982,1625L2978,1610L2976,1596L2980,1607L2978,1596L2966,1555L2951,1521L2941,1466L2932,1450L2930,1433L2921,1410L2912,1348L2914,1337L2914,1334L2911,1339L2911,1336L2911,1329L2914,1330L2910,1328L2908,1314L2912,1290L2907,1270L2909,1268L2907,1268L2916,1260L2906,1261L2909,1253L2905,1253L2906,1248L2911,1246L2899,1245L2900,1250L2896,1258L2900,1266L2896,1277L2877,1288L2871,1288L2860,1278L2838,1244L2839,1240L2843,1244L2861,1236L2866,1221L2851,1231L2835,1223L2827,1208L2834,1200L2824,1207L2822,1200L2821,1203L2816,1198L2813,1201L2811,1199L2806,1191L2803,1174L2794,1171L2794,1161L2789,1151L2783,1153L2790,1154L2758,1158L2755,1162L2744,1156L2734,1157L2733,1161L2717,1160L2711,1163L2709,1161L2694,1164L2679,1159L2676,1155L2674,1158L2656,1153L2648,1155L2644,1151L2616,1145L2610,1116L2604,1107L2593,1106L2567,1124L2557,1119L2547,1118L2527,1101L2523,1093L2505,1084L2478,1019L2468,1024L2458,1015L2461,1011L2457,1010L2454,1024L2447,1027L2438,1024L2441,1037L2438,1036L2433,1042L2439,1043L2453,1090L2479,1120L2476,1119L2480,1130L2478,1140L2492,1173L2491,1156L2495,1139L2500,1134L2506,1141L2507,1166L2500,1178L2503,1180L2501,1186L2507,1186L2511,1195L2517,1196L2527,1191L2549,1194L2555,1191L2598,1129L2598,1167L2603,1182L2614,1198L2643,1209L2656,1234L2663,1238L2663,1244L2638,1298L2633,1297L2632,1293L2626,1302L2623,1319L2625,1337L2606,1345L2598,1367L2581,1371L2573,1394L2554,1395L2525,1410L2519,1418L2518,1433L2501,1445L2464,1462L2451,1479L2438,1479L2427,1490L2415,1495L2393,1499L2382,1514L2361,1520L2352,1517L2347,1501L2348,1489L2342,1454L2336,1445L2339,1442L2339,1410L2329,1382L2317,1366L2300,1316L2281,1298L2272,1282L2266,1256L2268,1236L2256,1204L2246,1190L2239,1187L2232,1172L2231,1159L2194,1081L2183,1080L2190,1037L2176,1088L2157,1066L2142,1027L2140,1035L2146,1055L2163,1085L2171,1120L2194,1182L2205,1197L2201,1198L2200,1202L2204,1226L2226,1252L2227,1264L2233,1278L2232,1306L2238,1343L2259,1364L2276,1437L2282,1448L2283,1438L2290,1451L2308,1463L2317,1481L2328,1492L2331,1503L2339,1513L2344,1514L2350,1527L2349,1536L2334,1551L2346,1550L2367,1581L2380,1582L2397,1570L2411,1573L2427,1561L2433,1562L2449,1557L2458,1558L2478,1551L2491,1538L2500,1542L2496,1581L2499,1578L2503,1583L2494,1585L2492,1610L2473,1652L2458,1703L2438,1751L2401,1808L2379,1827L2357,1854L2323,1906L2312,1932L2305,1934L2301,1947L2291,1954L2276,2006L2271,2012L2263,2052L2264,2059L2277,2079L2272,2093L2275,2107L2272,2119L2279,2140L2280,2163L2293,2173L2297,2182L2293,2201L2297,2238L2294,2248L2297,2248L2298,2293L2301,2291L2302,2300L2296,2319L2282,2343L2283,2347L2268,2362L2238,2379L2227,2391L2217,2413L2215,2412L2214,2416L2207,2419L2189,2443L2184,2440L2185,2462L2196,2495L2196,2516L2199,2508L2201,2512L2201,2532L2198,2556L2201,2557L2200,2564L2190,2580L2159,2598L2148,2609L2145,2619L2150,2627L2152,2621L2150,2650L2139,2694L2121,2715L2095,2770L2066,2807L2040,2833L2027,2840L2015,2839L2012,2847L2000,2846L1997,2851L1975,2846L1967,2849L1953,2847L1939,2857L1915,2860L1905,2869L1891,2864L1888,2857L1883,2857L1881,2849L1876,2850L1875,2856L1873,2849L1875,2839L1864,2813L1873,2804L1871,2782L1854,2745L1843,2705L1823,2675L1815,2655L1807,2611L1806,2591L1800,2568L1799,2518L1748,2391L1748,2329L1753,2320L1763,2261L1771,2242L1779,2235L1784,2224L1788,2193L1771,2136L1778,2126L1779,2117L1768,2077L1758,2053L1773,2046L1761,2050L1757,2044L1748,2009L1710,1950L1715,1951L1707,1946L1696,1916L1701,1925L1705,1923L1701,1922L1702,1916L1696,1916L1690,1896L1694,1898L1701,1889L1702,1869L1710,1878L1714,1873L1706,1870L1701,1863L1705,1860L1707,1862L1707,1849L1703,1846L1711,1824L1713,1791L1706,1771L1709,1769L1708,1763L1704,1763L1703,1767L1695,1762L1694,1749L1689,1746L1687,1750L1687,1743L1681,1739L1682,1749L1669,1750L1667,1746L1663,1749L1659,1745L1660,1750L1656,1754L1653,1744L1654,1754L1650,1755L1649,1751L1649,1755L1643,1756L1643,1753L1640,1757L1628,1741L1626,1727L1630,1723L1626,1725L1623,1721L1628,1719L1625,1716L1621,1718L1608,1698L1590,1696L1595,1691L1587,1697L1549,1704L1542,1713L1529,1715L1486,1743L1462,1733L1466,1733L1463,1726L1460,1733L1445,1728L1436,1730L1447,1730L1430,1733L1423,1730L1422,1732L1427,1733L1411,1736L1380,1755L1366,1748L1350,1735L1328,1706L1318,1699L1300,1677L1286,1669L1286,1658L1279,1656L1271,1639L1275,1639L1278,1633L1273,1635L1272,1627L1275,1626L1271,1623L1268,1611L1263,1607L1263,1596L1261,1597L1256,1590L1249,1587L1246,1572L1244,1574L1240,1567L1238,1571L1237,1562L1234,1565L1231,1559L1230,1551L1237,1549L1234,1546L1230,1548L1229,1543L1237,1538L1220,1543L1221,1539L1213,1536L1214,1530L1211,1531L1204,1524L1211,1520L1208,1517L1204,1519L1205,1497L1211,1501L1230,1495L1211,1499L1204,1483L1207,1479L1204,1480L1197,1462L1190,1459L1197,1454L1208,1431L1210,1406L1218,1379L1217,1352L1209,1328L1213,1323L1211,1324L1215,1303L1202,1279L1198,1285L1201,1255L1212,1236L1223,1201L1219,1205L1221,1200L1240,1175L1248,1134L1265,1118L1277,1084L1304,1073L1330,1042L1340,1022L1340,1012L1336,1004L1337,984L1346,965L1348,952L1362,932L1392,912L1411,860L1423,857L1424,865L1436,877L1459,876L1467,871L1470,879L1487,880L1506,863L1516,858L1523,859L1530,849L1548,839L1573,837L1580,832L1596,828L1614,828L1625,836L1647,823L1656,828L1662,826L1661,823L1665,824L1674,830L1692,826L1708,816L1711,817L1711,822L1712,818L1718,820L1722,833L1732,824L1736,829L1724,847L1726,857L1733,864L1736,876L1727,892L1716,905L1720,919L1728,920L1728,925L1733,922L1737,932L1758,943L1767,945L1777,942L1813,957L1823,984L1863,998L1885,1017L1897,1013L1905,1002L1907,991L1903,973L1907,962L1917,951L1936,941L1946,942L1964,950L1964,958L1967,962L1983,968L1998,968L2004,981L2017,979L2034,983L2078,1001L2099,989L2103,983L2113,980L2106,984L2114,983L2116,979L2124,983L2131,981L2136,987L2131,983L2129,988L2135,994L2138,988L2145,994L2170,991L2181,979L2203,904L2209,895L2205,866L2209,854L2206,845L2213,831L2210,828L2198,838L2185,831L2166,849L2148,853L2141,849L2134,839L2119,831L2108,829L2104,846L2089,850L2080,845L2076,834L2063,831L2059,836L2059,833L2048,835L2047,833L2057,830L2062,825L2043,826L2044,822L2048,821L2039,807L2043,798L2025,789L2027,779L2032,787L2041,784L2036,783L2034,777L2038,772L2035,770L2032,760L2036,753L2021,755L2023,740L2033,729L2044,727L2052,731L2055,726L2056,730L2076,729L2072,725L2075,722L2092,718L2078,713L2079,705L2119,709L2139,691L2160,683L2186,684L2191,681L2196,691L2201,694L2211,692L2217,704L2224,701L2230,706L2255,714L2275,709L2291,713L2313,700L2319,684L2313,662L2283,641L2261,618L2251,614L2245,606L2238,606L2232,599L2221,593L2227,590L2223,587L2226,586L2233,590L2241,587L2246,569L2249,571L2251,567L2257,567L2246,558L2243,551L2257,550L2256,546L2272,540L2270,533L2239,539L2225,549L2206,552L2192,566L2196,561L2195,557L2188,564L2191,578L2199,589L2213,585L2220,587L2217,596L2207,598L2199,595L2192,603L2180,606L2170,615L2161,610L2163,595L2143,586L2165,571L2164,567L2156,564L2142,567L2130,561L2133,557L2125,554L2140,556L2144,552L2134,551L2129,535L2131,551L2124,550L2125,547L2122,551L2110,554L2099,573L2088,577L2090,588L2087,602L2077,605L2078,599L2075,599L2068,640L2066,644L2060,643L2056,649L2055,662L2047,670L2057,682L2061,696L2077,705L2075,711L2060,709L2048,712L2043,721L2023,738L2024,731L2034,722L2021,723L2016,716L2002,712L1996,716L1990,713L1983,720L1976,719L1978,728L1985,731L1987,736L1976,731L1980,741L1970,733L1975,741L1969,740L1968,734L1960,729L1960,723L1955,726L1954,739L1968,764L1965,766L1965,761L1960,760L1963,768L1954,772L1967,778L1981,793L1981,806L1971,796L1963,801L1971,813L1965,816L1957,810L1965,841L1957,831L1951,840L1944,825L1941,833L1935,823L1937,814L1926,800L1931,791L1936,792L1940,788L1960,798L1965,792L1951,785L1933,788L1930,783L1927,787L1919,772L1926,772L1926,768L1920,768L1910,759L1902,739L1893,732L1897,689L1889,685L1879,671L1848,654L1861,659L1846,644L1836,639L1828,640L1813,621L1812,619L1818,619L1809,609L1807,595L1801,589L1796,588L1788,602L1781,584L1786,580L1783,576L1775,576L1758,585L1757,591L1762,599L1757,606L1760,620L1782,638L1791,664L1801,676L1813,685L1832,686L1827,697L1866,721L1875,734L1873,745L1868,742L1864,732L1855,730L1851,726L1846,727L1839,747L1850,758L1851,769L1840,774L1839,785L1830,799L1822,796L1826,780L1832,775L1833,770L1823,740L1809,733L1805,721L1797,723L1799,719L1791,717L1785,705L1773,705L1745,675L1736,672L1737,668L1724,656L1718,628L1691,614L1676,630L1662,635L1649,649L1640,653L1627,648L1620,642L1614,644L1601,638L1586,649L1582,659L1587,675L1584,679L1586,685L1563,703L1543,710L1537,717L1541,720L1535,723L1518,754L1520,767L1528,775L1514,788L1508,804L1510,808L1499,810L1493,815L1484,832L1441,834L1435,840L1425,842L1417,853L1409,849L1402,836L1405,828L1402,830L1393,818L1375,825L1360,822L1352,825L1356,813L1355,784L1359,785L1356,782L1348,784L1348,778L1356,766L1350,776L1346,777L1343,774L1358,719L1357,692L1355,690L1355,680L1358,675L1356,675L1356,665L1352,666L1354,660L1348,655L1349,650L1365,643L1367,638L1377,633L1389,639L1412,636L1438,643L1455,640L1466,644L1469,642L1486,645L1496,639L1500,610L1503,607L1502,605L1500,607L1503,583L1513,598L1509,584L1501,577L1504,577L1502,560L1490,555L1484,545L1483,534L1491,535L1476,532L1478,527L1471,526L1471,523L1442,517L1435,511L1441,508L1437,504L1443,504L1434,502L1434,497L1462,488L1473,497L1477,494L1486,496L1488,493L1498,494L1488,464L1500,465L1502,473L1521,475L1532,471L1526,469L1527,464L1551,453L1557,429L1589,416L1604,416L1590,412L1595,410L1605,414L1600,410L1603,410L1599,404L1600,401L1609,390L1615,372L1620,371L1629,362L1654,358L1661,362L1658,359L1661,351L1669,350L1676,350L1680,358L1683,353L1686,359L1688,345L1699,346L1710,354L1695,344L1693,334L1688,333L1694,326L1689,319L1688,301L1679,296L1679,267L1689,271L1693,264L1699,265L1700,256L1697,255L1691,264L1685,266L1681,263L1688,253L1703,251L1714,240L1726,235L1720,267L1732,272L1729,278L1720,279L1718,288L1712,289L1715,291L1706,299L1708,306L1704,312L1708,313L1715,322L1712,328L1728,333L1734,331L1731,341L1741,343L1763,328L1772,330L1780,338L1785,337L1790,347L1802,352L1801,347L1789,345L1787,338L1798,344L1832,333L1839,326L1853,321L1868,318L1881,322L1875,320L1883,331L1893,331L1902,324L1904,315L1918,310L1926,296L1924,303L1916,314L1927,315L1924,267L1938,240L1953,236L1967,254L1974,257L1988,249L1987,234L1991,218L1983,220L1977,217L1972,209L1975,205L1970,202L1971,194L1983,191L1988,186L2008,184L2010,181L2055,187L2058,177L2064,180L2067,175L2075,176L2079,171L2098,174L2099,172L2090,165L2078,165L2069,160L2067,152L2029,159L2030,153L2026,159L2018,157L2020,161L2014,163L2013,161L1989,170L1971,171L1962,176L1966,170L1960,165L1952,170L1954,160L1932,154L1931,143L1935,125L1929,114L1930,106L1926,96L1933,84L1936,84L1934,80L1949,77L1947,73L1953,67L1973,56L1992,34L2005,32L2007,28L2007,15L1994,9L1993,4L1964,8L1950,4L1948,11L1935,17L1935,21L1932,19L1935,25L1926,34L1934,44L1919,61L1878,80L1873,86L1876,86L1875,88L1870,91L1864,89L1867,97L1855,101L1860,107L1855,118L1856,123L1851,122L1850,126L1852,151L1860,156L1866,154L1886,176Z';
const E3_MAP = {W: 2400, H: 939, home: [2069,448], brody: [2003,453], berlin: [1779,384], hamburg: [1714,354], elbe: [1682,342], dover: [1554,427], lizard: [1419,467], mid: [762,555], nyc: [114,720]};
const E3P = (lon, lat) => { const k = Math.cos(48 * Math.PI / 180), sx = E3_MAP.W / (126 * k); return [(lon + 80) * k * sx, (66 - lat) * sx]; };
const E3_RUSSIA = [[24.1, 65.8], [30, 70], [50, 70], [50, 40], [41, 40], [29.7, 45.3], [28.2, 45.5], [27.2, 47.8], [26.6, 48.3], [26.1, 48.7], [26.0, 49.6], [25.2, 50.1], [24.1, 50.6], [23.9, 50.8], [23.0, 50.4], [21.9, 50.4], [20.6, 50.2], [19.6, 50.3], [19.1, 50.6], [18.6, 51.0], [18.1, 51.6], [18.4, 52.4], [19.3, 52.8], [19.6, 53.2], [20.6, 53.2], [22.0, 53.5], [22.8, 54.3], [22.6, 54.9], [21.3, 55.2], [21.1, 55.7], [20.0, 57.0], [19.0, 60.0], [21.0, 63.0]];
function e3Script(x, y, w, lines, prog, seed, col = '#2B2418') { // unreadable handwriting, written right to left; prog 0..1 reveals it
  const r = rng(seed), s = []; let done = prog * lines;
  for (let l = 0; l < lines; l++) { const u = clamp01(done - l); if (u <= 0) break; let xx = x + w, d = `M${f1(xx)},${f1(y + l * 34)}`; const end = x + w - w * u * (0.75 + 0.25 * r());
    while (xx > end) { const step = 6 + r() * 10; xx -= step; d += ` q${f1(-step / 2)},${f1(-6 - r() * 10)} ${f1(-step)},${f1((r() - 0.5) * 3)}`; if (r() < 0.12) { xx -= 10; d += ` m-10,0`; } }
    s.push(`<path d="${d}" stroke="${col}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`); }
  return s.join('');
}
function renderLetter(t) {
  const M = smooth(4.8, 5.8, t); let out = '';
  const scr = [];
  if (M < 1) { // the table by lamplight
    const c = cam2(camAt([[0, 1.32, 1010, 600], [5, 1.44, 1060, 610]], t)), {F, H, x0, x1, wallFoot, ceil} = RM, s = [], fl = 0.86 + 0.08 * Math.sin(t * 7.1) + 0.05 * Math.sin(t * 16.3);
    const room = e3Room({seed: 101, paper: 0.1});
    s.push(room.back);
    // the only window opens on the airshaft: a brick wall an arm's length away
    s.push(`<rect x="650" y="340" width="160" height="250" fill="#0D0C09"/>` + MAT.brick(662, 352, 136, 226, {base: '#2B4744', seed: 102, soot: 'bottom', bw: 22, bh: 11}) + `<rect x="726" y="352" width="8" height="226" fill="#0D0C09"/><rect x="662" y="462" width="136" height="8" fill="#0D0C09"/>`);
    // the stove at the left wall, a kettle; a shelf with pots
    s.push(`<rect x="480" y="${wallFoot - 200}" width="150" height="180" fill="#0D0C09"/><rect x="472" y="${wallFoot - 210}" width="166" height="14" fill="#0D0C09"/><rect x="590" y="${ceil}" width="26" height="${wallFoot - 210 - ceil}" fill="#0D0C09"/><path d="M500,${wallFoot - 210} q0,-46 46,-46 q46,0 46,46 Z" fill="#0D0C09"/><rect x="500" y="${wallFoot - 140}" width="60" height="40" fill="#FFB15C" opacity="0.35"/>` + glowC(530, wallFoot - 120, 180, 0.35, 'e3fire'));
    s.push(`<rect x="860" y="330" width="240" height="10" fill="#0D0C09"/>` + [0, 1, 2].map((k) => `<path d="M${880 + k * 70},330 l6,-40 l40,0 l6,40 Z" fill="#0D0C09"/>`).join(''));
    const tx = 760, ty = F - 250;
    s.push(glowC(tx + 260, ty - 110, 640, 0.85 * fl, 'mswarm') + glowC(tx + 260, ty - 110, 150, 0.6 * fl));
    s.push(MAT.shadow(tx + 230, F + 4, 260, 0.45) + `<rect x="${tx}" y="${ty}" width="460" height="16" fill="#2B2418"/><rect x="${tx + 16}" y="${ty + 16}" width="14" height="${F - ty - 16}" fill="#0D0C09"/><rect x="${tx + 430}" y="${ty + 16}" width="14" height="${F - ty - 16}" fill="#0D0C09"/>`);
    s.push(samovar(tx + 70, ty, 2.0) + candlestick(tx + 170, ty, 2.2, '#C9A55A') + candlestick(tx + 205, ty, 2.2, '#C9A55A'));
    s.push(`<path d="M${tx + 260},${ty} l12,-40 q-24,-26 18,-46 q42,20 18,46 l12,40 Z" fill="#0D0C09"/><path d="M${tx + 272},${ty - 90} q18,-56 36,0 l0,8 l-36,0 Z" fill="${E3.cream}" opacity="${f1(0.55 + 0.3 * fl)}"/><ellipse cx="${tx + 290}" cy="${ty - 100}" rx="5" ry="12" fill="#FFF3D6"/>`);
    s.push(`<path d="M${tx + 330},${ty} l120,0 l0,-4 l-120,0 Z" fill="${E3.paper}"/>`);
    const write = Math.sin(t * 9) * 0.5 + 0.5;
    s.push(`<rect x="${tx + 470}" y="${F - 128}" width="110" height="12" fill="#0D0C09"/><rect x="${tx + 476}" y="${F - 116}" width="10" height="116" fill="#0D0C09"/><rect x="${tx + 564}" y="${F - 116}" width="10" height="116" fill="#0D0C09"/><rect x="${tx + 564}" y="${F - 300}" width="10" height="184" fill="#0D0C09"/>` + MAT.shadow(tx + 525, F + 4, 70, 0.35));
    const lod = lodFor(H * c.z);
    s.push(nb('nfather', {x: tx + 520, y: sitY(F, H * 0.97), h: H, d: -1, hat: 'kippah', coat: 'vest', det: lod.det, rim: {c: '#FFE6C9', a: 0.7 * fl, dx: -0.01, dy: -0.004}, an: {...POSES.sit(t, 0.1), fArm: [112 + 4 * write, 70 + 6 * write], bArm: [125, 85], tilt: -18, lean: 8, expr: 'set', blink: t % 3.4 < 0.12}}));
    s.push(nb('nmother', {x: tx + 640, y: F, h: H, d: -1, det: lod.det, rim: {c: '#FFE6C9', a: 0.6 * fl, dx: -0.01, dy: -0.004}, an: {...POSES.stand(t, 0.4), fArm: [130, 120], tilt: -10, expr: 'smile', blink: (t + 1) % 3.9 < 0.12}}));
    s.push(room.front);
    const world = layerAt(c, 1, s.join(''));
    // the letter close up, rising into view (screen space): right-to-left script, then the prepaid ticket slid in on top
    const rise = smooth(1.2, 1.9, t), tk = smooth(3.3, 3.9, t), px = 120, py = 140 + 60 * (1 - rise);
    let paper = '';
    if (rise > 0) {
      paper += `<g opacity="${f1(rise * (1 - M))}" transform="rotate(-3, ${px + 330}, ${py + 380})"><rect x="${px + 8}" y="${py + 12}" width="660" height="760" fill="#000" opacity="0.4" filter="url(#soft)"/><rect x="${px}" y="${py}" width="660" height="760" fill="${E3.paper}"/>` + [...Array(19)].map((_, k) => `<rect x="${px + 40}" y="${py + 90 + k * 34}" width="580" height="1" fill="#2B2418" opacity="0.12"/>`).join('') +
        e3Script(px + 60, py + 86, 540, 18, clamp01((t - 1.6) / 2.6), 103) + `</g>`;
      if (tk > 0) paper += `<g opacity="${f1(tk * (1 - M))}" transform="translate(${f1(-200 * (1 - tk))},0) rotate(4, ${px + 300}, ${py + 600})"><rect x="${px + 40}" y="${py + 470}" width="520" height="250" fill="#DCCFB0"/><rect x="${px + 52}" y="${py + 482}" width="496" height="226" fill="none" stroke="#2B2418" stroke-width="3"/>` +
        `<path d="M${px + 90},${py + 600} l180,0 l-14,24 l-150,0 Z" fill="#2B2418"/><rect x="${px + 150}" y="${py + 560}" width="18" height="40" fill="#2B2418"/><rect x="${px + 190}" y="${py + 560}" width="18" height="40" fill="#2B2418"/>` +
        [...Array(5)].map((_, k) => `<rect x="${px + 310}" y="${py + 520 + k * 30}" width="${200 - k * 22}" height="6" fill="#2B2418" opacity="0.55"/>`).join('') + `</g>`;
    }
    out += `<g opacity="${f1(1 - M)}"><rect width="1920" height="1080" fill="#0B1414"/>${world}</g>` + paper;
    scr.push(tag(40, 1040, 'A LETTER HOME · BROOKLYN · 1884', 1 - M));
    if (t > 2.2 && t < 3.3) scr.push(penS(1000, 200, 'Yiddish, written right to left', 30, -3));
    if (t > 3.9 && t < 4.9) scr.push(penS(1000, 200, 'and a ticket, already paid for', 32, -3));
  }
  if (M > 0) { // the route map
    const k = 0.74, ox = 70, oy = 200, P = (lon, lat) => { const [x, y] = E3P(lon, lat); return [ox + x * k, oy + y * k]; }, mp = [];
    const zoom = 1 + 0.015 * (t - 5);
    mp.push(`<rect width="1920" height="1080" fill="#132423"/>`);
    mp.push(`<clipPath id="e3land"><path d="${E3_LAND}" transform="translate(${ox},${oy}) scale(${k})"/></clipPath>`);
    mp.push(`<path d="${E3_LAND}" transform="translate(${ox},${oy}) scale(${k})" fill="#24403D" stroke="#5F857F" stroke-width="2"/>`);
    mp.push(`<g clip-path="url(#e3land)"><polygon points="${pts(E3_RUSSIA.map(([a, b]) => P(a, b)))}" fill="#3E5F5A"/><polygon points="${pts(E3_RUSSIA.map(([a, b]) => P(a, b)))}" fill="url(#hatchT)" opacity="0.5"/></g>`);
    for (let lat = 35; lat < 66; lat += 10) mp.push(line([P(-80, lat), P(46, lat)], '#2B4744', 1)); for (let lon = -70; lon < 46; lon += 20) mp.push(line([P(lon, 33), P(lon, 66)], '#2B4744', 1));
    const home = P(28.6, 50.25), ham = P(9.99, 53.55), ny = P(-74.0, 40.7);
    const rail = [home, P(25.1, 50.1), P(21, 51.6), P(17, 52.2), P(13.4, 52.5), ham];
    const sea = [ham, P(8.3, 54.0), P(4.5, 53.2), P(1.6, 51.0), P(-5.5, 49.6), P(-20, 48.6), P(-40, 46.2), P(-58, 43.5), P(-68, 41.2), ny];
    const pathLen = (a) => a.reduce((sum, p, i) => i ? sum + Math.hypot(p[0] - a[i - 1][0], p[1] - a[i - 1][1]) : 0, 0);
    const partial = (a, u) => { const L = pathLen(a) * clamp01(u), o = [a[0]]; let acc = 0; for (let i = 1; i < a.length; i++) { const d = Math.hypot(a[i][0] - a[i - 1][0], a[i][1] - a[i - 1][1]); if (acc + d >= L) { const v = (L - acc) / d; o.push([a[i - 1][0] + (a[i][0] - a[i - 1][0]) * v, a[i - 1][1] + (a[i][1] - a[i - 1][1]) * v]); return o; } acc += d; o.push(a[i]); } return o; };
    const dotted = (a, w = 6) => `<polyline points="${pts(a)}" fill="none" stroke="#111" stroke-width="${w + 4}" stroke-dasharray="2 16" stroke-linecap="round"/><polyline points="${pts(a)}" fill="none" stroke="${E3.teal}" stroke-width="${w}" stroke-dasharray="2 16" stroke-linecap="round"/>`;
    // 1) the letter crosses east (thin dashes), 2) the cousin's route west: rail to Hamburg, then the steamship to New York
    const uL = smooth(5.9, 7.1, t), uR = smooth(7.2, 8.1, t), uS = smooth(8.1, 9.6, t);
    const letterPath = [...sea].reverse().concat([...rail].reverse());
    if (uL > 0 && uL < 1) { const p = partial(letterPath, uL), e = p[p.length - 1]; mp.push(`<polyline points="${pts(p)}" fill="none" stroke="${E3.cream}" stroke-width="2" stroke-dasharray="8 8" opacity="0.6"/><g transform="translate(${f1(e[0])},${f1(e[1])})"><rect x="-20" y="-13" width="40" height="26" fill="${E3.paper}" stroke="#111" stroke-width="2"/><path d="M-20,-13 L0,3 L20,-13" stroke="#111" stroke-width="2" fill="none"/></g>`); }
    if (uR > 0) mp.push(dotted(partial(rail, uR)));
    if (uS > 0) { const p = partial(sea, uS), e = p[p.length - 1]; mp.push(dotted(p)); if (uS < 1) mp.push(`<g transform="translate(${f1(e[0])},${f1(e[1])})"><path d="M-26,0 L26,0 L18,12 L-20,12 Z" fill="${E3.cream}" stroke="#111" stroke-width="2"/><rect x="-6" y="-16" width="8" height="16" fill="${E3.cream}" stroke="#111" stroke-width="2"/></g>`); }
    for (const [p, name, dx, dy] of [[home, 'HOME', -60, 54], [ham, 'HAMBURG', -80, -26], [ny, 'NEW YORK', -20, 60]]) mp.push(`<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="11" fill="${E3.orange}" stroke="#111" stroke-width="3"/>`);
    out += `<g opacity="${f1(M)}"><g transform="translate(960,540) scale(${f1(zoom * 100) / 100}) translate(-960,-540)">${mp.join('')}</g></g>`;
    const S = (p) => [960 + (p[0] - 960) * zoom, 540 + (p[1] - 540) * zoom];
    if (M > 0.5) {
      const [hx, hy] = S(home), [mx, my] = S(ham), [nx, ny2] = S(ny);
      scr.push(tag(1600, 330, 'RUSSIAN EMPIRE', M), tag(hx - 70, hy + 70, 'HOME', M), tag(mx - 100, my - 30, 'HAMBURG', M), tag(nx - 10, ny2 + 70, 'NEW YORK', M));
      if (uL > 0 && uR < 0.2) scr.push(penS(700, 230, 'the letter goes east', 34, -3));
      if (uR > 0.2 && uS < 0.3) scr.push(penS(1180, 860, 'by rail to the port', 30, -3));
      if (uS > 0.3) scr.push(penS(560, 860, 'by steamship to New York', 32, -3));
    }
  }
  return frame(e3Defs2(t), `<rect width="1920" height="1080" fill="#0B1414"/>`, out, scr.join(''), t);
}

/* ================= ep3_nativism: who was "in" and who was "out" ================= */
// The desk layer: period prints laid down one by one as creased, frameless prints with mono captions (handled with care: caricatures
// are shown briefly, framed by the narration, never lingered on or mocked). Left of a teal rule: shut out by law (the Chinese
// Exclusion Act, 1882). Right: let in, but mocked (anti-Irish cartoons of the 1870s-80s) and Keppler's 1893 "Looking Backward",
// whose caption is the episode's irony. Then the irony in the family: Ma Kelly at her window, watching the newcomers.
// The prints are made by tools/crease.py into ep3/public/img/desk/ (see ep3/research/REFERENCES.md for sources and handling notes).
const NV_DIR = '../ep3/public/img/desk/';
const NV_PRINTS = [ // file, centre x, y, width, rotation, time it lands, caption
  ['chinese_exclusion_act_1882_text', 330, 440, 400, -4, 0.3, 'EXCLUSION ACT · 1882'],
  ['the_only_one_barred_out_1882', 720, 520, 340, 5, 1.2, 'FRANK LESLIE\'S · 1882'],
  ['opper_irish_declaration_1883', 1160, 470, 380, 3, 2.1, 'PUCK · 1883'],
  ['keppler_looking_backward_1893', 1560, 520, 480, -3, 3.0, 'PUCK · 1893'],
];
if (typeof window !== 'undefined') window.E3_PRELOAD = Promise.all(NV_PRINTS.map(([f]) => new Promise((ok) => { const im = new Image(); im.onload = im.onerror = () => ok(true); im.src = NV_DIR + f + '.png'; })));
function renderNativism(t) {
  const X = smooth(5.5, 6.3, t); let out = '';
  const scr = [];
  if (X < 1) {
    const push = smooth(4.4, 6.0, t), z = 1 + 0.7 * push, ux = 960 + (1560 - 960) * push, uy = 540 + (500 - 540) * push;
    const s = [];
    s.push(MAT.planks(-200, -200, 2400, 1500, {base: '#2A2117', seed: 111, size: 60}) + `<rect x="-200" y="-200" width="2400" height="1500" fill="url(#exvig)"/>`);
    s.push(`<rect x="930" y="160" width="6" height="760" fill="${E3.teal}" opacity="${f1(smooth(0.2, 0.8, t))}"/>`);
    for (const [f, x, y, w, rot, t0, cap] of NV_PRINTS) {
      const u = smooth(t0, t0 + 0.5, t); if (u <= 0) continue; const lift = 30 * (1 - u), dr = 1.5 * Math.sin(t * 0.7 + x);
      s.push(`<g opacity="${f1(u)}" transform="translate(${x},${f1(y - lift)}) rotate(${f1(rot + dr * 0.3)})"><rect x="${-w / 2 + 10}" y="${-w * 0.36 + 16}" width="${w}" height="${w * 0.78}" fill="#000" opacity="0.45" filter="url(#soft)"/>` +
        `<image href="${NV_DIR}${f}.png" x="${-w / 2}" y="${-w * 0.4}" width="${w}" height="${w * 0.8}" preserveAspectRatio="xMidYMid meet"/></g>`);
    }
    // the New Colossus card (1883), the contrast, laid at the bottom
    const nc = smooth(3.8, 4.3, t);
    if (nc > 0) s.push(`<g opacity="${f1(nc)}" transform="rotate(-2, 960, 960)"><rect x="660" y="900" width="600" height="110" fill="${E3.cream}"/><text x="690" y="946" font-family="Playfair" font-weight="900" font-size="30" fill="#111">"Give me your tired, your poor ..."</text><text x="690" y="988" font-family="Mono" font-size="22" fill="#111">EMMA LAZARUS, "THE NEW COLOSSUS," 1883</text></g>`);
    const c = {z, ux, uy};
    out += `<g opacity="${f1(1 - X)}">${layerAt(c, 1, s.join(''))}</g>`;
    if (push < 0.2) {
      if (t > 0.5) scr.push(tag(150, 140, 'SHUT OUT BY LAW', smooth(0.5, 0.9, t) * (1 - X)));
      if (t > 2.2) scr.push(tag(1000, 140, 'LET IN, BUT MOCKED', smooth(2.2, 2.6, t) * (1 - X)));
      for (const [f, x, y, w, rot, t0, cap] of NV_PRINTS) if (t > t0 + 0.4) scr.push(tag(x - w / 2, y + w * 0.4 + 40, cap, smooth(t0 + 0.4, t0 + 0.8, t)));
    }
    if (t > 4.6 && X < 0.5) scr.push(penS(140, 130, '"They would close to the new-comer', 30, -2), penS(140, 215, 'the bridge that carried them and their fathers over."', 30, -2));
  }
  if (X > 0) { // the irony, in the family: Ma Kelly at her window
    const tt = 9.4 + (t - 5.5) * 0.12;
    out += `<g opacity="${f1(X)}">${renderMovingIn(tt, {quiet: true, keys: [[0, 5.2, MI.win.x + 20, MI.win.y + 46], [20, 5.5, MI.win.x + 20, MI.win.y + 44]]})}</g>`;
    if (t > 6.4 && t < 8.2) scr.push(penS(1000, 170, 'in 1883, Puck was still mocking the Irish', 30, -3));
    if (t > 8.2) scr.push(penS(1000, 170, 'now Ma Kelly watches the newcomers', 32, -3), tag(1040, 250, 'COMPOSITE CHARACTER', smooth(8.2, 8.6, t)));
  }
  return frame(e3Defs(t), `<rect width="1920" height="1080" fill="#0B1414"/>`, out, scr.join(''), t);
}

/* ================= ep3_names: what happened to their name ================= */
// The myth says clerks at the station changed immigrants' names. They did not: the clerk copied each name from the ship's passenger
// list, which was written at the port of departure (here Hamburg, by a German-speaking clerk, from the family's own papers). Spellings
// shifted as a name moved between alphabets (Hebrew letters, then German, then English spelling), and most real changes came later,
// made by the families themselves: at school, at work, on a shop sign, on naturalization papers. The surname here is invented for
// the composite family: Rabinovich, written "Rabinowitsch" in Hamburg, "Rabinowitz" in New York, and later shortened to "Rabin".
// The daughter's Yiddish name Rivke (Rebecca) becomes "Rebecca" at school.
function hebrewish(x, y, sz, n, seed, col) { // a word in square Hebrew-style letters, unreadable on purpose, written right to left
  const r = rng(seed), s = []; let xx = x;
  for (let i = 0; i < n; i++) { const w = sz * (0.5 + r() * 0.35), k = Math.floor(r() * 5), sw = Math.max(2, sz * 0.12), X0 = xx - w;
    if (k === 0) s.push(`<path d="M${f1(X0)},${f1(y - sz)} H${f1(xx)} V${f1(y)}" stroke="${col}" stroke-width="${f1(sw)}" fill="none"/>`);
    else if (k === 1) s.push(`<path d="M${f1(X0)},${f1(y - sz)} H${f1(xx)} V${f1(y)} H${f1(X0)}" stroke="${col}" stroke-width="${f1(sw)}" fill="none"/>`);
    else if (k === 2) s.push(`<path d="M${f1(X0)},${f1(y - sz)} H${f1(xx)} M${f1(X0 + w * 0.35)},${f1(y - sz)} V${f1(y)}" stroke="${col}" stroke-width="${f1(sw)}" fill="none"/>`);
    else if (k === 3) s.push(`<path d="M${f1(X0)},${f1(y)} V${f1(y - sz)} H${f1(xx)} V${f1(y)}" stroke="${col}" stroke-width="${f1(sw)}" fill="none"/>`);
    else s.push(`<path d="M${f1(xx - w * 0.3)},${f1(y - sz)} V${f1(y - sz * 0.45)}" stroke="${col}" stroke-width="${f1(sw)}" fill="none"/>`);
    xx = X0 - sz * 0.18; }
  return s.join('');
}
function renderNames(t) {
  const A = 1 - smooth(4.4, 5.0, t), B = smooth(4.4, 5.0, t) * (1 - smooth(7.0, 7.6, t)), C = smooth(7.0, 7.6, t);
  let out = ''; const scr = [];
  if (A > 0) { // the desk at Castle Garden: the clerk copies the name from the ship's list into the register
    const c = cam2(camAt([[0, 1.0, 960, 560], [4.6, 1.08, 980, 560]], t)), F = 960, s = [], H = 520;
    s.push(`<rect x="-500" y="-400" width="3000" height="${F + 400}" fill="#1F3532"/>` + [0, 1, 2].map((k) => `<rect x="${-200 + k * 900}" y="140" width="220" height="${F - 220}" fill="#132423"/><rect x="${-180 + k * 900}" y="170" width="180" height="200" fill="${E3.cream}" opacity="0.14"/>`).join(''));
    s.push(`<rect x="-500" y="${F - 64}" width="3000" height="12" fill="#0D0C09" opacity="0.6"/>` + MAT.floor(-500, 2500, F - 52, F + 200, {kind: 'flag', base: '#4E5F58', seed: 121, size: 80, vp: 960}));
    // the high desk, the open register, the clerk on his stool writing
    s.push(MAT.shadow(820, F + 4, 260, 0.45) + `<path d="M560,${F - 330} L1080,${F - 360} L1080,${F - 320} L560,${F - 320} Z" fill="#2B2418"/><rect x="580" y="${F - 320}" width="480" height="${320}" fill="#0D0C09"/>`);
    s.push(`<path d="M640,${F - 336} L820,${F - 346} L820,${F - 330} L640,${F - 322} Z" fill="${E3.paper}"/><path d="M820,${F - 346} L1000,${F - 356} L1000,${F - 340} L820,${F - 330} Z" fill="#DCCFB0"/>`);
    const w = Math.sin(t * 8) * 0.5 + 0.5;
    s.push(`<rect x="1080" y="${F - 190}" width="90" height="12" fill="#0D0C09"/><rect x="1090" y="${F - 178}" width="10" height="178" fill="#0D0C09"/><rect x="1150" y="${F - 178}" width="10" height="178" fill="#0D0C09"/>` +
      figure({x: 1120, y: F - 190 + 0.22 * H, h: H, d: -1, kind: 'man', hat: 'none', coat: 'frock', beard: true, fill: '#0D0C09', rim: {c: '#DFE0D6', a: 0.5, dx: -0.01, dy: -0.004}, an: {legs: [86, 80], shins: [6, 0], fArm: [118 + 6 * w, 70 + 8 * w], bArm: [130, 90], tilt: -16, lean: 6}}));
    // the father in front of the desk with the family's papers
    const lod = lodFor(H * c.z);
    s.push(nb('nfather', {x: 330, y: F, h: H, d: 1, hat: 'cap', coat: 'frock', det: lod.det, rim: {c: E3.warm, a: lod.rimA * 0.8, dx: 0.01, dy: -0.004}, an: {...POSES.stand(t, 0.2), fArm: [110, 70]}}) + `<rect x="${f1(330 + 0.33 * H)}" y="${f1(F - 0.68 * H)}" width="36" height="26" fill="${E3.paper}" transform="rotate(-10, ${f1(330 + 0.33 * H)}, ${f1(F - 0.68 * H)})"/>`);
    out += `<g opacity="${f1(A)}"><rect width="1920" height="1080" fill="#0B1414"/>${layerAt(c, 1, s.join(''))}</g>`;
    // screen space: the ship's list (left) and the register (right); one row lights, and a teal arrow carries it across
    const up = smooth(0.6, 1.2, t), row = smooth(1.6, 2.0, t), arrow = smooth(2.0, 2.8, t), copy = smooth(2.8, 3.8, t);
    const card = (x, y, w2, h2, rot, body) => `<g opacity="${f1(up * A)}" transform="rotate(${rot}, ${x + w2 / 2}, ${y + h2 / 2})"><rect x="${x + 8}" y="${y + 10}" width="${w2}" height="${h2}" fill="#000" opacity="0.4" filter="url(#soft)"/><rect x="${x}" y="${y}" width="${w2}" height="${h2}" fill="${E3.paper}"/>${body}</g>`;
    let lst = ''; for (let k = 0; k < 7; k++) { const yy = 150 + 40 + k * 34; lst += `<rect x="${120 + 20}" y="${yy}" width="460" height="1" fill="#2B2418" opacity="0.2"/>` + e3Script(130, yy - 6, 120, 1, 1, 130 + k).replace(/stroke="#2B2418"/g, 'stroke="#2B2418"') + `<rect x="${270 + (k * 37) % 60}" y="${yy - 14}" width="${140 + (k * 53) % 90}" height="5" fill="#2B2418" opacity="0.55"/>`; }
    if (row > 0) lst += `<rect x="128" y="${150 + 40 + 4 * 34 - 26}" width="472" height="32" fill="${E3.teal}" opacity="${f1(0.35 * row)}"/>`;
    out += card(110, 140, 500, 290, -2, `<rect x="110" y="140" width="500" height="34" fill="#DCCFB0"/>` + lst);
    let reg = ''; for (let k = 0; k < 7; k++) { const yy = 190 + k * 34; reg += `<rect x="1330" y="${yy}" width="460" height="1" fill="#2B2418" opacity="0.2"/>` + (k < 4 ? `<rect x="${1350 + (k * 41) % 40}" y="${yy - 14}" width="${200 + (k * 61) % 120}" height="5" fill="#2B2418" opacity="0.55"/>` : ''); }
    if (copy > 0) reg += `<rect x="1350" y="${190 + 4 * 34 - 14}" width="${f1(300 * copy)}" height="5" fill="#2B2418"/>`;
    out += card(1310, 140, 500, 290, 2, `<rect x="1310" y="140" width="500" height="34" fill="#C9B98A"/>` + reg);
    if (arrow > 0) { const a = [], n = 30; for (let i = 0; i <= n * arrow; i++) { const u = i / n; a.push([600 + 730 * u, 306 - 120 * Math.sin(Math.PI * u)]); } out += tealLine(a, A, 5) + (arrow > 0.98 ? `<path d="M1330,306 l-24,-12 l4,24 Z" fill="${E3.teal}" opacity="${f1(A)}"/>` : ''); }
    // the name as it travels between alphabets: Hebrew letters on the family's papers, then the Hamburg clerk's German spelling
    const m1 = smooth(2.2, 2.7, t), nameY = 760;
    if (t > 1.0) {
      out += `<g opacity="${f1(A * (1 - m1))}"><rect x="660" y="${nameY - 70}" width="600" height="100" fill="#0D0C09" opacity="0.85"/>${hebrewish(1180, nameY + 6, 56, 8, 140, E3.teal)}</g>`;
      out += `<g opacity="${f1(A * m1)}"><rect x="660" y="${nameY - 70}" width="600" height="100" fill="#0D0C09" opacity="0.85"/><text x="960" y="${nameY + 6}" font-family="Mono" font-size="54" text-anchor="middle" fill="${E3.teal}" letter-spacing="3">RABINOWITSCH</text></g>`;
    }
    scr.push(tag(130, 120 + 0, 'SHIP\'S PASSENGER LIST · WRITTEN IN HAMBURG', up * A), tag(1180, 486, 'THE REGISTER · COPIED FROM THE LIST', up * A));
    if (t > 2.9) scr.push(penS(540, 900, 'the clerk copied the name; he did not change it', 30, -2));
    scr.push(tag(40, 1040, 'CASTLE GARDEN · 1884', A));
  }
  if (B > 0) { // later, at school: the daughter writes her new first name on her slate
    const tt = t - 4.4, c = cam2(camAt([[0, 1.0, 960, 560], [3, 1.1, 940, 580]], tt)), F = 960, s = [], H = 520;
    const room = `<rect x="-500" y="-400" width="3000" height="${F + 400}" fill="#24403D"/><rect x="200" y="160" width="900" height="360" fill="#132423"/><rect x="190" y="150" width="920" height="10" fill="#2B2418"/>` +
      MAT.floor(-500, 2500, F - 52, F + 200, {kind: 'planks', base: '#3A3326', seed: 122, size: 52, vp: 960}) + `<rect x="-500" y="${F - 66}" width="3000" height="14" fill="#2B2418"/>`;
    s.push(room + `<text x="300" y="300" font-family="Pen" font-size="80" fill="#DFE0D6" opacity="0.5">A b c</text>`);
    for (const dx of [0, 520, 1040]) { const x = 300 + dx; s.push(MAT.shadow(x + 140, F + 4, 200, 0.4) + `<path d="M${x},${F - 300} L${x + 280},${F - 320} L${x + 280},${F - 300} Z" fill="#2B2418"/><rect x="${x}" y="${F - 300}" width="280" height="14" fill="#2B2418"/><rect x="${x + 20}" y="${F - 286}" width="12" height="286" fill="#0D0C09"/><rect x="${x + 250}" y="${F - 286}" width="12" height="286" fill="#0D0C09"/><rect x="${x - 120}" y="${F - 150}" width="110" height="12" fill="#0D0C09"/><rect x="${x - 112}" y="${F - 138}" width="10" height="138" fill="#0D0C09"/><rect x="${x - 30}" y="${F - 138}" width="10" height="138" fill="#0D0C09"/>`); }
    const lod = lodFor(H * 0.8 * c.z), w = Math.sin(tt * 8) * 0.5 + 0.5;
    s.push(nb('ndaughter', {x: 820 - 60, y: sitY(F, H * 0.8), h: H, scale: 0.8, d: 1, hat: 'none', wear: ['plain', 'apron'], det: lod.det, rim: {c: '#E9F0E6', a: 0.5, dx: 0.01, dy: -0.004}, an: {...POSES.sit(tt, 0.2), fArm: [112 + 5 * w, 72 + 8 * w], bArm: [125, 85], tilt: -14, expr: 'set', blink: tt % 3.2 < 0.12}}));
    s.push(e3Person(rng(123), 300 - 60, sitY(F, H * 0.62), H, tt, '#0D0C09', {d: 1, an: POSES.sit(tt, 0.4)}) + e3Person(rng(124), 1340 - 60, sitY(F, H * 0.62), H, tt, '#0D0C09', {d: 1, an: POSES.sit(tt, 0.7)}));
    out += `<g opacity="${f1(B)}"><rect width="1920" height="1080" fill="#0B1414"/>${layerAt(c, 1, s.join(''))}</g>`;
    // the slate, close up (screen space): her Yiddish name crossed out, the new one written under it
    const sl = smooth(0.4, 0.9, tt), x2 = smooth(1.0, 1.4, tt), w2 = smooth(1.4, 2.4, tt);
    out += `<g opacity="${f1(sl * B)}" transform="rotate(-3, 1500, 420)"><rect x="1250" y="250" width="520" height="340" rx="10" fill="#7A5B22"/><rect x="1272" y="272" width="476" height="296" fill="#1C2624"/>` +
      `<text x="1320" y="370" font-family="Pen" font-size="78" fill="#DFE0D6">Rivke</text>` + (x2 > 0 ? `<rect x="1310" y="342" width="${f1(220 * x2)}" height="5" fill="#DFE0D6"/>` : '') +
      `<clipPath id="e3slate"><rect x="1300" y="400" width="${f1(420 * w2)}" height="140"/></clipPath><text x="1320" y="500" font-family="Pen" font-size="78" fill="#DFE0D6" clip-path="url(#e3slate)">Rebecca</text></g>`;
    scr.push(tag(40, 1040, 'LATER: SCHOOL, BROOKLYN', B));
    if (tt > 1.2) scr.push(penS(140, 150, 'at school, Rivke becomes Rebecca', 32, -3));
  }
  if (C > 0) { // later still: the father's shop sign, the name shortened
    const tt = t - 7.0, c = cam2(camAt([[0, 1.0, 960, 540], [3, 1.06, 960, 530]], tt)), G = 900, s = [], H = 420;
    s.push(`<rect x="-500" y="-400" width="3000" height="1500" fill="url(#e3day)"/>` + MAT.brick(260, -200, 1400, G + 200, {base: '#3A2A22', seed: 125, soot: 'top', bw: 26, bh: 13}));
    s.push(`<rect x="420" y="${G - 420}" width="760" height="420" fill="#0F1E1D"/><rect x="440" y="${G - 400}" width="460" height="380" fill="${E3.cream}" opacity="0.18"/><rect x="960" y="${G - 400}" width="200" height="400" fill="#0B1414"/>`);
    for (let k = 0; k < 5; k++) s.push(`<rect x="${470 + k * 86}" y="${G - 140}" width="60" height="90" fill="#2B4744"/><path d="M${470 + k * 86},${G - 140} l30,-24 l30,24" fill="#2B4744"/>`); // coats in the window
    // the sign board over the shop: the long name, then the last letters slide away and the short one remains
    const cut = smooth(1.0, 2.0, tt), signY = G - 520;
    s.push(`<rect x="400" y="${signY - 70}" width="800" height="110" fill="#1A1410"/><rect x="410" y="${signY - 60}" width="780" height="90" fill="none" stroke="#C9A55A" stroke-width="3"/>`);
    s.push(`<text x="800" y="${signY + 12}" font-family="Playfair" font-weight="900" font-size="68" text-anchor="middle" fill="#C9A55A" opacity="${f1(1 - cut)}">RABINOWITZ</text>`);
    s.push(`<text x="800" y="${signY + 12}" font-family="Playfair" font-weight="900" font-size="68" text-anchor="middle" fill="#C9A55A" opacity="${f1(cut)}">RABIN</text>`);
    s.push(MAT.floor(-500, 2500, G, G + 200, {kind: 'flag', base: '#3E5F5A', seed: 126, size: 60}));
    const lod = lodFor(H * c.z);
    s.push(nb('nfather', {x: 1300, y: G + 20, h: H, d: -1, hat: 'bowler', coat: 'sack', det: lod.det, rim: {c: E3.warm, a: 0.6, dx: -0.01, dy: -0.004}, an: {...POSES.stand(tt, 0.3), tilt: 14, fArm: [150, 120], expr: 'smile'}}));
    out += `<g opacity="${f1(C)}"><rect width="1920" height="1080" fill="#0B1414"/>${layerAt(c, 1, s.join(''))}</g>`;
    scr.push(tag(40, 1040, 'LATER STILL: HIS OWN SHOP', C));
    if (tt > 1.6) scr.push(penS(140, 150, 'most name changes came later,', 32, -3), penS(140, 235, 'made by families themselves', 32, -3), tag(1300, 300, 'COMPOSITE CHARACTERS', smooth(1.6, 2.0, tt)));
  }
  return frame(e3Defs(t), `<rect width="1920" height="1080" fill="#0B1414"/>`, out, scr.join(''), t);
}

if (typeof window !== 'undefined') Object.assign(window, {renderSteerage, renderCastleGarden, renderMovingIn, renderSweatshop, renderLetter, renderNativism, renderNames});
Object.assign(CLIPS, {
  ep3_steerage: {sec: 10, render: (t) => renderSteerage(t)},
  ep3_castle_garden: {sec: 10, render: (t) => renderCastleGarden(t)},
  ep3_moving_in: {sec: 10, render: (t) => renderMovingIn(t)},
  ep3_sweatshop: {sec: 10, render: (t) => renderSweatshop(t)},
  ep3_letter: {sec: 10, render: (t) => renderLetter(t)},
  ep3_nativism: {sec: 10, render: (t) => renderNativism(t)},
  ep3_names: {sec: 10, render: (t) => renderNames(t)},
});
