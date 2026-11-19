// Episode 2, the rest of the sets (load after mansion.js). Same rules: real people are silhouettes with no face detail; coral only
// for the Kellys (Nora Kelly, 18, the maid); teal explains; orange is handwriting.
//
//   fittest_explainer  ch5  "Survival of the fittest" as a moving teal diagram: moths on sooty bark (fit = suited), a cockroach,
//                           society drawn as the pyramid the theory claimed sorts people, then Sumner's A, B, C and D.
//   spencer_banquet    ch5  Delmonico's, November 9, 1882: the farewell dinner for Herbert Spencer, about 200 men in evening dress.
//   rich_leisure       ch6  One side-scroll: lawn tennis at a Newport cottage, polo, racing cutters (after the 1886 America's Cup).
//   carnegie_library   ch7  The Carnegie Free Library at Braddock, Pennsylvania (1889), outside, then its reading room.
//   nora_attic         ch4  Nora's room under the roof of 660 Fifth Avenue; the call bell on the wall rings.

const E2 = {ink: '#0D0C09', teal: '#2FE0C4', cream: '#F4EFE6', orange: '#FF9F1C', coral: '#FF6F61', paper: '#132423'};
const camAt = (keys, t) => { let k = keys.length - 2; for (let i = 0; i < keys.length - 1; i++) if (t < keys[i + 1][0]) { k = i; break; }
  const [t0, z0, x0, y0] = keys[k], [t1, z1, x1, y1] = keys[k + 1], u = ease(clamp01((t - t0) / (t1 - t0)));
  return {z: lerpLog(z0, z1, u), ux: x0 + (x1 - x0) * u, uy: y0 + (y1 - y0) * u}; };
const tealLine = (a, op = 1, w = 4) => `<g opacity="${f1(op * 100) / 100}">${line(a, '#111', w + 3)}${line(a, E2.teal, w)}</g>`;
const bigLetter = (x, y, L, op = 1, col = E2.teal) => `<text x="${x}" y="${y}" font-family="Abril" font-size="96" text-anchor="middle" fill="${col}" stroke="#111" stroke-width="4" paint-order="stroke" opacity="${f1(op)}">${L}</text>`;

/* ================= ch5: survival of the fittest ================= */
function moth(x, y, s, col, a = 0) { return `<g transform="translate(${f1(x)},${f1(y)}) rotate(${f1(a)})"><path d="M0,0 Q${-26 * s},${-22 * s} ${-34 * s},${4 * s} Q${-20 * s},${16 * s} 0,${6 * s} Q${20 * s},${16 * s} ${34 * s},${4 * s} Q${26 * s},${-22 * s} 0,0 Z" fill="${col}"/><rect x="${-2 * s}" y="${-6 * s}" width="${4 * s}" height="${18 * s}" rx="${2 * s}" fill="${col}"/></g>`; }
function bird(x, y, s, flap, col = E2.ink) { const w = 30 * s * Math.sin(flap); return `<path d="M${f1(x - 40 * s)},${f1(y - w)} Q${f1(x - 15 * s)},${f1(y - 6 * s)} ${f1(x)},${f1(y)} Q${f1(x + 15 * s)},${f1(y - 6 * s)} ${f1(x + 40 * s)},${f1(y - w)} Q${f1(x + 14 * s)},${f1(y + 4 * s)} ${f1(x)},${f1(y + 8 * s)} Q${f1(x - 14 * s)},${f1(y + 4 * s)} ${f1(x - 40 * s)},${f1(y - w)} Z" fill="${col}"/><path d="M${f1(x + 6 * s)},${f1(y + 2 * s)} l${f1(14 * s)},${f1(2 * s)} l${f1(-12 * s)},${f1(5 * s)} Z" fill="${col}"/>`; }
function roach(x, y, s, t) { const k = Math.sin(t * 40) * 6 * s; let legs = '';
  for (const [dx, sg] of [[-10, 1], [0, -1], [10, 1]]) legs += `M${f1(x + dx * s)},${f1(y)} l${f1(-8 * s + sg * k)},${f1(10 * s)} M${f1(x + dx * s)},${f1(y)} l${f1(8 * s - sg * k)},${f1(-0 * s + 10 * s)} `;
  return `<path d="${legs}" stroke="${E2.ink}" stroke-width="${f1(2.5 * s)}"/><ellipse cx="${f1(x)}" cy="${f1(y - 4 * s)}" rx="${f1(24 * s)}" ry="${f1(10 * s)}" fill="#3B2A22"/><circle cx="${f1(x + 24 * s)}" cy="${f1(y - 4 * s)}" r="${f1(6 * s)}" fill="#3B2A22"/>` +
    `<path d="M${f1(x + 28 * s)},${f1(y - 6 * s)} q${f1(20 * s)},${f1(-20 * s + k)} ${f1(40 * s)},${f1(-14 * s)} M${f1(x + 28 * s)},${f1(y - 4 * s)} q${f1(22 * s)},${f1(-8 * s - k)} ${f1(42 * s)},${f1(-2 * s)}" stroke="#3B2A22" stroke-width="${f1(2 * s)}" fill="none"/>`; }
function renderFittest(t) {
  const s = [], A = 1 - smooth(4.0, 4.5, t), B = smooth(4.3, 4.8, t) * (1 - smooth(7.0, 7.5, t)), C = smooth(7.3, 7.8, t);
  s.push(`<rect width="1920" height="1080" fill="#1C3332"/><rect width="1920" height="1080" fill="url(#exvig)"/>`);
  // A: nature. A sooty tree trunk; a dark moth hides on it, a pale one shows up, and the bird takes the pale one.
  if (A > 0.01) { const g = [];
    g.push(`<path d="M700,1080 L730,0 L1010,0 L1050,1080 Z" fill="#0F1C1B"/>` + [0, 1, 2, 3, 4, 5].map((k) => `<path d="M${760 + k * 45},0 q${(k % 2 ? 12 : -12)},540 ${k * 4},1080" stroke="#1C2E2C" stroke-width="5" fill="none"/>`).join(''));
    g.push(moth(830, 420, 1.3, '#22332F', -8), moth(930, 640, 1.3, '#22332F', 6));
    const eat = smooth(1.6, 2.4, t), bx = 1700 - 760 * eat, by = 200 + 330 * Math.sin(eat * Math.PI * 0.6);
    if (t < 2.4) g.push(moth(940, 520, 1.3, '#DFE0D6', -4)); else g.push(moth(bx + 10, by + 6, 0.8, '#DFE0D6', 30));
    g.push(bird(t < 2.4 ? bx : 940 + (t - 2.4) * 600, t < 2.4 ? by : 520 - (t - 2.4) * 260, 1.8, t * 12));
    g.push(tag(120, 160, 'NATURE: WHAT IS SUITED TO ITS WORLD SURVIVES', smooth(0.3, 0.8, t)));
    g.push(`<g opacity="${f1(smooth(0.8, 1.2, t))}">` + tealLine([[1010, 430], [1180, 380]]) + penS(1190, 390, 'dark moth: hidden', 30, -3, E2.teal) + '</g>');
    if (t > 2.6) g.push(penS(1150, 760, '"fit" means suited, not best', 36, -3));
    if (t > 3.0) { const rx = -100 + (t - 3.0) * 1400; g.push(roach(rx, 1000, 2.2, t), penS(Math.min(rx + 40, 1300), 960, 'a cockroach is very fit', 30, -2)); }
    s.push(`<g opacity="${f1(A)}">${g.join('')}</g>`); }
  // B: the claim. Society drawn as a pyramid that sorts people: a few at the top, the many at the bottom.
  if (B > 0.01) { const g = [], rows = [[1, 'top'], [3, 'top'], [6, 'bowler'], [10, 'cap'], [14, 'cap']];
    rows.forEach(([n, hat], ri) => { const y = 260 + ri * 170, grow = smooth(4.5 + ri * 0.25, 5.0 + ri * 0.25, t);
      g.push(`<rect x="${1180 - n * 40}" y="${y + 4}" width="${n * 80}" height="10" fill="${E2.teal}" opacity="${f1(0.7 * grow)}"/>`);
      for (let i = 0; i < n; i++) g.push(`<g opacity="${f1(grow)}">` + figure({x: 1180 - (n - 1) * 40 + i * 80, y, h: 130, d: i % 2 ? -1 : 1, kind: ri > 2 && i % 3 === 1 ? 'woman' : 'man', hat: ri > 2 && i % 3 === 1 ? 'kerchief' : hat, coat: ri < 2 ? 'frock' : 'jacket', wear: ri > 2 && i % 3 === 1 ? ['plain', 'shawl'] : [], fill: E2.ink, an: POSES.stand(t, i * 0.1)}) + '</g>'); });
    g.push(tealLine([[1820, 1000], [1820, 300]], smooth(5.4, 5.8, t)) + `<path d="M1804,316 l16,-30 l16,30 Z" fill="${E2.teal}" opacity="${f1(smooth(5.4, 5.8, t))}"/>`);
    g.push(tag(120, 160, 'THE CLAIM: SOCIETY SORTS PEOPLE THE SAME WAY', smooth(4.5, 4.9, t)), penS(1460, 230, 'the strongest rise', 28, -4), penS(1560, 1040, 'the weak fall', 28, -4));
    if (t > 6.0) g.push(card(60, 330, 'Social Darwinism', 'The idea that the rich are rich|because they are fittest.', null, smooth(6.0, 6.4, t)));
    s.push(`<g opacity="${f1(B)}">${g.join('')}</g>`); }
  // C: Sumner, 1883. A and B put their heads together to decide what C shall be made to do for D.
  if (C > 0.01) { const g = [], y = 820;
    const pA = {x: 300, d: 1, hat: 'top', coat: 'frock'}, pB = {x: 600, d: -1, hat: 'top', coat: 'frock'}, pC = {x: 1100, d: 1, hat: 'bowler', coat: 'sack'}, pD = {x: 1500, d: -1, hat: 'cap', coat: 'jacket'};
    const lean = 6 * smooth(7.8, 8.3, t), hand = smooth(8.8, 9.4, t);
    g.push(figure({...pA, y, h: 300, kind: 'man', fill: E2.ink, an: {lean, tilt: -6, fArm: [70, 50]}}), figure({...pB, y, h: 300, kind: 'man', fill: E2.ink, an: {lean, tilt: -6, fArm: [80, 60]}}));
    g.push(figure({...pC, y, h: 300, kind: 'man', fill: E2.ink, an: {fArm: [150 - 60 * hand, 140 - 60 * hand], tilt: -4}}), figure({...pD, y: y + 0.22 * 300, h: 300, kind: 'man', fill: E2.ink, an: {...POSES.sit(t, 0.3), fArm: [100, 60]}}));
    if (hand > 0.5) g.push(`<circle cx="${f1(1100 + 0.33 * 300 + 30 * hand)}" cy="${f1(y - 0.62 * 300)}" r="9" fill="${E2.cream}"/>`);
    [[pA.x, 'A'], [pB.x, 'B'], [pC.x, 'C'], [pD.x, 'D']].forEach(([x, L], i) => g.push(bigLetter(x, 400, L, smooth(7.5 + i * 0.2, 7.8 + i * 0.2, t), L === 'C' ? E2.orange : E2.teal)));
    g.push(tealLine([[620, 560], [1040, 560]], smooth(8.2, 8.6, t)) + `<path d="M1030,548 l24,12 l-24,12 Z" fill="${E2.teal}" opacity="${f1(smooth(8.2, 8.6, t))}"/>`);
    g.push(penS(940, 930, 'C: "the Forgotten Man", the ordinary taxpayer', 28, -2), tag(120, 160, 'WILLIAM GRAHAM SUMNER · 1883', 1));
    g.push(`<text x="960" y="250" font-family="Inter" font-weight="600" font-size="38" text-anchor="middle" fill="${E2.cream}">"A and B put their heads together to decide</text><text x="960" y="300" font-family="Inter" font-weight="600" font-size="38" text-anchor="middle" fill="${E2.cream}">what C shall be made to do for D."</text>`);
    s.push(`<g opacity="${f1(C)}">${g.join('')}</g>`); }
  return frame(exDefs(t), '', s.join(''), '', t);
}

/* ================= ch5: Spencer's banquet at Delmonico's ================= */
// An 1880s restaurant banquet room, not a church: flat gilt-framed mirrors and panels, square-headed windows with heavy draped
// curtains and tassels, gas chandeliers with glass globes, palms and flowers; several long tables crowded with plates, glasses,
// bottles, silver, centrepieces and menu cards; waiters in white aprons pouring; Spencer stands at his place among the diners,
// napkin in hand. Cigar smoke drifts in at the end.
function bqTable(x0, x1, ty, r, t) { const s = [];
  s.push(`<rect x="${x0}" y="${ty}" width="${x1 - x0}" height="16" fill="#DFE0D6"/><rect x="${x0}" y="${ty + 16}" width="${x1 - x0}" height="70" fill="#A3BAB2" opacity="0.9"/>` +
    [...Array(Math.floor((x1 - x0) / 60))].map((_, k) => `<path d="M${x0 + k * 60},${ty + 16} q30,14 60,0" stroke="#7FA39C" stroke-width="2" fill="none"/>`).join(''));
  for (let x = x0 + 30; x < x1 - 20; x += 44) { const k = r();
    s.push(`<ellipse cx="${x}" cy="${ty + 2}" rx="15" ry="3.5" fill="#F4EFE6"/>`);
    s.push(`<path d="M${x + 14},${ty} l-4,-16 l10,0 l-4,16 Z M${x + 12},${ty - 16} l6,0" stroke="#DFE0D6" stroke-width="1.5" fill="#DFE0D6" fill-opacity="0.35"/>`);
    if (k > 0.7) s.push(`<rect x="${x - 4}" y="${ty - 34}" width="9" height="30" rx="2" fill="#1F3735"/><rect x="${x - 2}" y="${ty - 44}" width="5" height="12" fill="#1F3735"/>`);
    else if (k > 0.55) s.push(`<rect x="${x - 6}" y="${ty - 14}" width="11" height="14" fill="#F4EFE6" transform="rotate(-8, ${x}, ${ty})"/>`); // a menu card
    else if (k > 0.45) s.push(`<ellipse cx="${x}" cy="${ty - 4}" rx="20" ry="7" fill="#C9C2A8"/><path d="M${x - 16},${ty - 6} q16,-16 32,0" fill="#C9C2A8"/>`); }
  for (let x = x0 + 120; x < x1 - 60; x += 300) { s.push(`<rect x="${x - 3}" y="${ty - 50}" width="6" height="50" fill="#C9C2A8"/>`);
    for (let k = 0; k < 9; k++) s.push(`<circle cx="${f1(x + Math.cos(k * 0.7) * 22)}" cy="${f1(ty - 58 - Math.sin(k * 1.3) * 14 - k % 3 * 5)}" r="${7 + k % 3}" fill="${['#DFE0D6', '#A3BAB2', '#5F857F'][k % 3]}"/>`); }
  return s.join(''); }
function waiter(x, y, h, d, t, pour = 0) { const an = pour ? {fArm: [100 - 20 * pour, 70 - 40 * pour], bArm: [190, 200], lean: 6 * pour} : {fArm: [95, 20], bArm: [190, 200]};
  const X = (u) => x + d * u * h, Y = (v) => y - v * h;
  let s = figure({x, y, h, d, kind: 'man', hat: 'none', coat: 'jacket', fill: '#060807', an});
  s += poly([[X(-0.08), Y(0.6)], [X(0.12), Y(0.6)], [X(0.14), Y(0.12)], [X(-0.1), Y(0.12)]], '#DFE0D6');
  const [hx, hy] = hand({x, y, h, d}, an.fArm);
  s += pour ? `<rect x="${f1(hx - 5)}" y="${f1(hy - 30)}" width="10" height="34" rx="2" fill="#1F3735" transform="rotate(${f1(d * 70 * pour)}, ${f1(hx)}, ${f1(hy)})"/>` :
    `<ellipse cx="${f1(hx)}" cy="${f1(hy - 4)}" rx="${f1(0.16 * h)}" ry="4" fill="#C9C2A8"/><path d="M${f1(hx - 0.1 * h)},${f1(hy - 6)} q${f1(0.1 * h)},${f1(-0.12 * h)} ${f1(0.2 * h)},0 Z" fill="#C9C2A8"/>`;
  return s; }
function renderBanquet(t, quiet = false) {
  const c = cam2(camAt([[0, 0.9, 900, 540], [6, 1.0, 2000, 540], [10, 1.5, 2380, 600]], t)), G = 900, toast = smooth(5.6, 6.2, t), smokeOp = smooth(6.2, 8.2, t);
  const room = [], back = [], front = [];
  // walls: panelled, flat gilt-framed mirrors between square-headed windows with draped curtains and tassels
  room.push(`<rect x="-800" y="-300" width="4600" height="${G + 300}" fill="#24403D"/>` + MAT.planks(-800, G - 230, 4600, 230, {base: '#1C3332', seed: 91, size: 60, vertical: true}) + `<rect x="-800" y="${G - 236}" width="4600" height="8" fill="#C9B98A" opacity="0.7"/>`);
  for (let x = -700; x < 3700; x += 520) {
    room.push(`<rect x="${x}" y="40" width="200" height="560" fill="#2B4744"/><rect x="${x}" y="40" width="200" height="560" fill="none" stroke="#C9B98A" stroke-width="8"/><rect x="${x + 12}" y="52" width="176" height="536" fill="#4E726C" opacity="0.5"/><rect x="${x + 12}" y="52" width="176" height="536" fill="url(#mswarm)" opacity="0.5"/>`);
    const wx = x + 290; room.push(`<rect x="${wx}" y="60" width="150" height="520" fill="#0F1C1B"/>` + [0, 1].map((k) => `<rect x="${wx + k * 75 + 35}" y="60" width="4" height="520" fill="#24403D"/>`).join('') + `<rect x="${wx}" y="300" width="150" height="4" fill="#24403D"/>`);
    room.push(`<path d="M${wx - 40},30 L${wx + 190},30 L${wx + 190},60 Q${wx + 75},110 ${wx - 40},60 Z" fill="#132423"/>` +
      `<path d="M${wx - 40},40 L${wx + 20},40 Q${wx + 10},300 ${wx + 34},420 Q${wx - 10},600 ${wx - 30},${G - 236} L${wx - 50},${G - 236} Z" fill="#132423"/><path d="M${wx + 190},40 L${wx + 130},40 Q${wx + 140},300 ${wx + 116},420 Q${wx + 160},600 ${wx + 180},${G - 236} L${wx + 200},${G - 236} Z" fill="#132423"/>` +
      `<circle cx="${wx + 32}" cy="424" r="7" fill="#C9B98A"/><path d="M${wx + 32},430 l-6,30 l12,0 Z" fill="#C9B98A"/><circle cx="${wx + 118}" cy="424" r="7" fill="#C9B98A"/><path d="M${wx + 118},430 l-6,30 l12,0 Z" fill="#C9B98A"/>`); }
  room.push(`<rect x="-800" y="-300" width="4600" height="330" fill="#1C3332"/><rect x="-800" y="24" width="4600" height="10" fill="#C9B98A" opacity="0.7"/>`);
  // gas chandeliers with glass globes
  for (let x = -400; x < 3700; x += 520) { const fl = 0.92 + 0.08 * Math.sin(t * 7 + x);
    room.push(glowC(x, 190, 260, 0.8 * fl, 'mswarm') + `<rect x="${x - 2}" y="30" width="4" height="120" fill="#C9B98A"/><path d="M${x - 70},180 Q${x},150 ${x + 70},180" stroke="#C9B98A" stroke-width="4" fill="none"/>`);
    for (const k of [-1, -0.5, 0, 0.5, 1]) room.push(`<circle cx="${x + k * 70}" cy="${170 + Math.abs(k) * 10}" r="12" fill="#FFF3D6" opacity="0.9"/>`); }
  // palms in tubs
  for (const px of [-600, 1400, 3300]) { room.push(`<path d="M${px - 30},${G - 20} L${px + 30},${G - 20} L${px + 22},${G - 80} L${px - 22},${G - 80} Z" fill="#0D0C09"/>`);
    for (let k = -4; k <= 4; k++) room.push(`<path d="M${px},${G - 80} Q${px + k * 30},${G - 260} ${px + k * 60},${G - 200 + Math.abs(k) * 20}" stroke="#132423" stroke-width="10" fill="none"/>`); }
  // the back table (across the room) and its diners, smaller
  const r = rng(1882);
  for (let x = -560; x < 3500; x += 50) back.push(figure({x, y: sitY(G - 150, 120), h: 120, d: r() > 0.5 ? 1 : -1, kind: 'man', hat: 'none', coat: 'frock', beard: r() > 0.6, fill: '#0F1A19',
    an: toast > 0.3 && r() > 0.3 ? {legs: [86, 80], shins: [6, 0], fArm: [24, 12], tilt: 8} : {...POSES.sit(t, r()), tilt: -4 + 8 * r()}, prop: toast > 0.3 ? 'glass' : null}));
  back.push(bqTable(-600, 3500, G - 210, rng(5), t).replace(/#DFE0D6/g, '#A3BAB2'));
  // the main table and its far row of diners; Spencer stands at his place, napkin in hand, among them
  const TY = G - 60, sx = 2380, speak = smooth(1.5, 2.0, t);
  for (let x = -500; x < 3400; x += 58) { if (Math.abs(x - sx) < 40) continue; front.push(figure({x, y: sitY(TY + 6, 170), h: 170, d: r() > 0.5 ? 1 : -1, kind: 'man', hat: 'none', coat: 'frock', beard: r() > 0.6, fill: E2.ink,
    an: toast > 0.3 && r() > 0.25 ? {legs: [86, 80], shins: [6, 0], fArm: [22 + 10 * Math.sin(t * 3 + x), 10], tilt: 8} : {...POSES.sit(t, r()), tilt: -4 + 8 * r()}, prop: toast > 0.3 ? 'glass' : null})); }
  front.push(figure({x: sx, y: TY + 6, h: 180, d: -1, kind: 'man', hat: 'none', coat: 'frock', fill: E2.ink, an: {fArm: [120 - 40 * speak + 8 * Math.sin(t * 2.2) * speak, 90 - 30 * speak], bArm: [170, 175], tilt: 3 * speak}}));
  front.push(`<path d="M${sx + 2},${TY - 0.93 * 180 + 6} q8,22 -2,38 l-10,-6 q4,-16 0,-28 Z" fill="${E2.ink}"/>` + `<path d="M${sx + 0.05 * 180},${TY - 0.62 * 180} l14,8 l-4,22 l-14,-6 Z" fill="#F4EFE6"/>`); // side whiskers; the napkin in his other hand
  front.push(bqTable(-560, 3420, TY, rng(9), t));
  // waiters in white aprons: one pours, others carry trays
  front.push(waiter(700 + 200 * Math.sin(t * 0.35), G + 160, 260, 1, t), waiter(1800, G + 160, 260, -1, t, smooth(3, 3.6, t) * (1 - smooth(5, 5.6, t))), waiter(2900 - 150 * Math.sin(t * 0.3), G + 160, 260, -1, t));
  // cigar smoke at the end
  let sm = ''; if (smokeOp > 0.01) for (let x = -300; x < 3300; x += 260) sm += MAT.smoke(x, TY - 150, t, {col: 'A3BAB2', k: 0.6, n: 6, rise: 240, drift: 140, seed: 900 + x});
  const world = layerAt(c, 1, room.join('') + back.join('') + front.join('') + `<g opacity="${f1(0.55 * smokeOp)}">${sm}</g>`);
  // a menu card, as printed for the dinner
  const mc = smooth(0.2, 0.7, t) * (1 - smooth(3.6, 4.2, t));
  const scr = [tag(40, 1040, 'DELMONICO\'S · NEW YORK · NOVEMBER 9, 1882', 1)];
  if (mc > 0.01) scr.push(`<g opacity="${f1(mc)}" transform="rotate(-3, 1500, 300)"><rect x="1330" y="110" width="360" height="420" fill="#F4EFE6"/><rect x="1346" y="126" width="328" height="388" fill="none" stroke="#111" stroke-width="2"/>` +
    `<text x="1510" y="200" font-family="Playfair" font-weight="900" font-size="40" text-anchor="middle" fill="#111">DELMONICO'S</text><text x="1510" y="250" font-family="Inter" font-weight="600" font-size="22" text-anchor="middle" fill="#111">DINNER TO</text>` +
    `<text x="1510" y="290" font-family="Inter" font-weight="800" font-size="28" text-anchor="middle" fill="#111">HERBERT SPENCER</text><text x="1510" y="340" font-family="Inter" font-weight="600" font-size="22" text-anchor="middle" fill="#111">NOVEMBER 9, 1882</text>` +
    [0, 1, 2, 3].map((k) => `<rect x="1400" y="${380 + k * 30}" width="${220 - k * 30}" height="6" fill="#111" opacity="0.25"/>`).join('') + '</g>');
  if (t > 4.2 && t < 6.5) scr.push(penS(1180, 140, 'about 200 rich men', 34, -3));
  if (t > 6.5) scr.push(penS(1180, 140, 'his advice: relax more', 36, -3), tag(1200, 220, 'HERBERT SPENCER', smooth(6.5, 7, t)));
  if (quiet) scr.splice(1);   // keep the place tag; the edit times its own notes
  return frame(msDefs(t), `<rect width="1920" height="1080" fill="#0B1414"/>`, world, scr.join(''), t);
}

/* ================= ch6: rich leisure, one side-scroll ================= */
function cottage(x, G) { // a Newport shingle-style "cottage": gables, a round tower, a deep veranda
  const c = '#2B4744', d = '#1C3332';
  return `<rect x="${x}" y="${G - 360}" width="700" height="360" fill="${c}"/><path d="M${x - 30},${G - 360} L${x + 160},${G - 560} L${x + 350},${G - 360} Z" fill="${d}"/><path d="M${x + 330},${G - 360} L${x + 520},${G - 600} L${x + 730},${G - 360} Z" fill="${d}"/>` +
    `<rect x="${x + 600}" y="${G - 520}" width="140" height="520" fill="${c}"/><path d="M${x + 590},${G - 520} L${x + 670},${G - 680} L${x + 750},${G - 520} Z" fill="${d}"/>` +
    `<rect x="${x - 40}" y="${G - 150}" width="820" height="14" fill="${d}"/>` + [...Array(10)].map((_, k) => `<rect x="${x - 30 + k * 86}" y="${G - 140}" width="8" height="140" fill="${d}"/>`).join('') +
    [...Array(6)].map((_, k) => `<rect x="${x + 40 + k * 100}" y="${G - 300}" width="50" height="80" fill="#5F857F"/>`).join('') + `<rect x="${x + 640}" y="${G - 440}" width="60" height="90" fill="#5F857F"/>` +
    `<pattern id="shingle" width="20" height="14" patternUnits="userSpaceOnUse"><path d="M0,14 Q5,8 10,14 Q15,8 20,14" fill="none" stroke="#24403D" stroke-width="1.4"/></pattern><rect x="${x}" y="${G - 360}" width="700" height="210" fill="url(#shingle)"/>`;
}
function cutter(x, y, s, t, heel = 10) { // a racing cutter of 1886: long low hull, huge gaff mainsail, topsail, jib
  const c = E2.ink, sail = '#DFE0D6', rock = heel + 2 * Math.sin(t * 1.4 + x);
  return `<g transform="translate(${f1(x)},${f1(y)}) rotate(${f1(rock)}) scale(${s})">` +
    `<path d="M-260,0 L240,0 Q200,30 120,34 L-200,34 Q-250,26 -260,0 Z" fill="${c}"/><rect x="-20" y="-560" width="6" height="560" fill="${c}"/><rect x="-14" y="-760" width="4" height="210" fill="${c}"/>` +
    `<path d="M-14,-540 L-250,-380 L-260,-10 L-14,-10 Z" fill="${sail}"/><path d="M-12,-750 L-12,-545 L-180,-470 Z" fill="${sail}" opacity="0.9"/><path d="M-6,-520 L230,-6 L-6,-14 Z" fill="${sail}" opacity="0.92"/>` +
    `<path d="M-14,-540 L-250,-380" stroke="${c}" stroke-width="5"/><path d="M-260,-10 L-14,-10" stroke="${c}" stroke-width="5"/>` +
    [-140, -80, -40].map((cx) => figure({x: cx, y: 0, h: 50, d: 1, kind: 'man', hat: 'cap', coat: 'jacket', fill: c, an: {}})).join('') + `</g>`;
}
function renderLeisure(t, quiet = false) {
  const c = cam2({z: 0.9, ux: 900 + 470 * t, uy: 560}), G = 860, w = [];
  w.push(layerAt(c, 0.3, `<rect x="-2000" y="${G - 140}" width="9000" height="400" fill="#7FA39C"/>` + MAT.trees([[-2000, G - 140], [8000, G - 150]], {col: '#7FA39C', seed: 61, size: 36})));
  const m = [];
  // Newport: lawn, the cottage, a tennis court with its net; lawn tennis in 1880s dress (long skirts, white flannels, underarm serves)
  m.push(`<rect x="-2000" y="${G}" width="4300" height="600" fill="#5F857F"/>` + cottage(-200, G));
  m.push(`<rect x="600" y="${G - 4}" width="1100" height="8" fill="#DFE0D6" opacity="0.8"/><rect x="1146" y="${G - 70}" width="8" height="70" fill="${E2.ink}"/><rect x="1150" y="${G - 60}" width="4" height="56" fill="url(#netp)"/><rect x="1146" y="${G - 72}" width="10" height="5" fill="#DFE0D6"/>`);
  const rally = (t * 0.7) % 1, side = Math.floor(t * 0.7) % 2, bx = side ? 1520 - 760 * rally : 760 + 760 * rally, by = G - 120 - 220 * Math.sin(rally * Math.PI);
  const swingL = side ? 0 : 1 - smooth(0, 0.15, rally), swingR = side ? 1 - smooth(0, 0.15, rally) : 0;
  m.push(figure({x: 740, y: G, h: 170, d: 1, kind: 'woman', hat: 'lady', fill: E2.ink, an: {fArm: [150 - 100 * swingL, 120 - 90 * swingL], tilt: 4}}) + line([[790, G - 110 + 30 * swingL], [830, G - 150 + 60 * swingL]], E2.ink, 4));
  m.push(figure({x: 1540, y: G, h: 180, d: -1, kind: 'man', hat: 'boycap', coat: 'vest', fill: E2.ink, wear: [], an: {fArm: [150 - 100 * swingR, 120 - 90 * swingR], legs: [12, -8]}}) + line([[1490, G - 110 + 30 * swingR], [1450, G - 150 + 60 * swingR]], E2.ink, 4));
  m.push(`<circle cx="${f1(bx)}" cy="${f1(by)}" r="7" fill="${E2.cream}"/>`);
  for (const [x, k] of [[300, 'woman'], [380, 'man'], [1850, 'woman']]) m.push(figure({x, y: G, h: 170, d: 1, kind: k, hat: k === 'man' ? 'top' : 'lady', coat: 'frock', fill: E2.ink, an: POSES.stand(t, x), prop: k === 'woman' ? null : null}) + (k === 'woman' ? `<path d="M${x - 30},${G - 190} Q${x},${G - 230} ${x + 30},${G - 190} Z" fill="${E2.ink}"/>` + line([[x, G - 190], [x + 6, G - 120]], E2.ink, 2) : ''));
  // polo: riders cantering after the ball, mallets swinging
  m.push(`<rect x="2300" y="${G}" width="1900" height="600" fill="#4E726C"/><rect x="2300" y="${G - 40}" width="10" height="40" fill="#DFE0D6"/><rect x="4180" y="${G - 40}" width="10" height="40" fill="#DFE0D6"/>`);
  for (let i = 0; i < 4; i++) { const hx = 2500 + i * 340 + 520 * t - 380 * Math.floor((520 * t + i * 340) / 1600) * 0 , xx = 2400 + ((i * 410 + t * 300) % 1700), hz = 120, dist = t * 300 * 1.6 + i * 70;
    m.push(msHorse(xx, G, hz, E2.ink, dist, 0, 0, 1));
    m.push(figure({x: xx - 0.05 * hz, y: G - 0.7 * hz, h: 1.25 * hz, d: 1, kind: 'man', hat: 'boycap', coat: 'jacket', fill: E2.ink, an: {legs: [70, 60], shins: [-20, -20], lean: 10, fArm: [60 + 80 * Math.sin(t * 4 + i), 40 + 80 * Math.sin(t * 4 + i)]}}));
    const a = (60 + 80 * Math.sin(t * 4 + i)) * Math.PI / 180, hx2 = xx + 0.2 * hz, hy2 = G - 0.7 * hz - 0.95 * hz; m.push(line([[hx2, hy2], [hx2 + Math.sin(a) * 170, hy2 + Math.cos(a) * 170 * -1 * -1]], E2.ink, 4)); }
  m.push(`<circle cx="${f1(2800 + ((t * 300 + 200) % 1500))}" cy="${G - 6}" r="6" fill="${E2.cream}"/>`);
  // the water: racing cutters, the 1886 America's Cup style
  m.push(MAT.water(4200, G - 20, 3200, 600, t, {top: '#5F857F', bottom: '#2B4744', seed: 62}));
  m.push(cutter(5000 + 30 * t, G + 10, 0.9, t, 9), cutter(5800 + 22 * t, G + 30, 1.05, t, 11), cutter(6600 + 26 * t, G + 0, 0.6, t, 8));
  w.push(layerAt(c, 1, m.join('')));
  const scr = [tag(40, 1040, t < 3.6 ? 'LAWN TENNIS · NEWPORT · 1880s' : t < 6.6 ? 'POLO · 1880s' : 'THE AMERICA\'S CUP · 1886', 1)];
  scr.push(penS(1180, 140, 'same day off. very different sunday.', 30, -3));
  const defs = msDefs(t).replace('</defs>', `<pattern id="netp" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0,0 L6,6 M6,0 L0,6" stroke="#0D0C09" stroke-width="1"/></pattern></defs>`);
  if (quiet) scr.length = 0;
  return frame(defs, `<rect width="1920" height="1080" fill="url(#msday)"/>` + clouds(t), w.join(''), scr.join(''), t);
}

/* ================= ch7: the Carnegie Free Library, Braddock ================= */
function braddock(x, G) { // rough-faced stone, Romanesque: a round corner tower with a conical roof, steep gables, arched doorway
  const c = '#3E5F5A', d = '#24403D', s = [];
  s.push(MAT.stone(x, G - 420, 1000, 420, {base: c, seed: 71, bh: 26, vary: 0.25}));
  s.push(`<path d="M${x - 20},${G - 420} L${x + 260},${G - 640} L${x + 540},${G - 420} Z" fill="${d}"/><path d="M${x + 520},${G - 420} L${x + 760},${G - 600} L${x + 1020},${G - 420} Z" fill="${d}"/>`);
  s.push(MAT.stone(x - 80, G - 560, 200, 560, {base: c, seed: 72, bh: 26, vary: 0.25}) + `<rect x="${x - 80}" y="${G - 560}" width="200" height="560" fill="url(#msround)"/><path d="M${x - 92},${G - 560} L${x + 20},${G - 800} L${x + 132},${G - 560} Z" fill="${d}"/>`);
  for (const wx of [x + 180, x + 300, x + 600, x + 720, x + 840]) s.push(`<rect x="${wx}" y="${G - 330}" width="70" height="110" rx="35" fill="#FFF3D6" opacity="0.55"/><rect x="${wx}" y="${G - 180}" width="70" height="110" fill="#FFF3D6" opacity="0.5"/>`);
  for (const wy of [G - 470, G - 330, G - 190]) s.push(`<rect x="${x - 10}" y="${wy}" width="40" height="80" rx="20" fill="#FFF3D6" opacity="0.5"/>`);
  s.push(`<path d="M${x + 420},${G} L${x + 420},${G - 170} Q${x + 470},${G - 240} ${x + 520},${G - 170} L${x + 520},${G} Z" fill="#0D0C09"/><path d="M${x + 404},${G} L${x + 404},${G - 172} Q${x + 470},${G - 262} ${x + 536},${G - 172} L${x + 536},${G}" stroke="${d}" stroke-width="14" fill="none"/>`);
  for (let k = 0; k < 4; k++) s.push(`<rect x="${x + 380 - k * 12}" y="${G + k * 10}" width="${180 + k * 24}" height="10" fill="${d}"/>`);
  return s.join('');
}
function renderLibrary(t) {
  const inside = smooth(4.4, 5.2, t), out = [];
  if (inside < 0.99) { const c = cam2({z: 0.85 + 0.04 * t, ux: 960 + 20 * t, uy: 520}), G = 860, m = [];
    m.push(`<rect x="-2000" y="${G}" width="6000" height="400" fill="#24403D"/>` + braddock(500, G));
    m.push(`<rect x="1900" y="${G - 520}" width="70" height="520" fill="#2B4744"/>` + MAT.smoke(1935, G - 524, t, {col: '5F857F', k: 1, seed: 73}) + `<rect x="2100" y="${G - 380}" width="60" height="380" fill="#2B4744"/>` + MAT.smoke(2130, G - 384, t, {col: '5F857F', k: 1, seed: 74}));
    for (let i = 0; i < 4; i++) { const x = -100 + ((t * 70 + i * 260) % 1100), h = 150; m.push(figure({x, y: G, h, d: 1, kind: i === 3 ? 'boy' : 'man', hat: i === 3 ? 'boycap' : 'cap', coat: 'jacket', fill: E2.ink, wear: i === 3 ? ['knickers'] : [], pail: i === 1, an: walkAn(walkPhase(t * 70 + i * 260, h))})); }
    out.push(`<g opacity="${f1(1 - inside)}"><rect width="1920" height="1080" fill="url(#msday)"/>${layerAt(c, 1, m.join(''))}</g>`); }
  if (inside > 0.01) { const c = cam2({z: 0.95 + 0.04 * (t - 4.4), ux: 960, uy: 560}), G = 900, m = [];
    m.push(`<rect x="-400" y="-300" width="2800" height="${G + 300}" fill="#1C3332"/>`);
    for (let bx = -200; bx < 2200; bx += 260) { m.push(`<rect x="${bx}" y="120" width="230" height="${G - 260}" fill="#132423"/>`);
      const r = rng(bx + 900); for (let sh = 0; sh < 7; sh++) { const y = 140 + sh * 90; m.push(`<rect x="${bx}" y="${y + 78}" width="230" height="6" fill="#0D0C09"/>`);
        let x = bx + 6; while (x < bx + 220) { const w = 8 + r() * 10, h = 50 + r() * 26; m.push(`<rect x="${f1(x)}" y="${f1(y + 78 - h)}" width="${f1(w)}" height="${f1(h)}" fill="${['#5F4A2E', '#3E2F22', '#6E5A3A', '#2B4744'][Math.floor(r() * 4)]}"/>`); x += w + 1; } } }
    m.push(`<rect x="-400" y="${G - 140}" width="2800" height="140" fill="#172A28"/>` + MAT.planks(-400, G, 2800, 300, {base: '#1A2B29', seed: 75}));
    // reading tables under warm lamps; working men with newspapers; a boy with a book
    for (const tx of [100, 1000]) { m.push(`<rect x="${tx}" y="${G - 110}" width="700" height="12" fill="#0D0C09"/><rect x="${tx + 20}" y="${G - 98}" width="10" height="98" fill="#0D0C09"/><rect x="${tx + 670}" y="${G - 98}" width="10" height="98" fill="#0D0C09"/>`);
      for (const lx of [tx + 200, tx + 500]) m.push(glowC(lx, G - 190, 300, 0.85, 'mswarm') + `<rect x="${lx - 3}" y="${G - 180}" width="6" height="70" fill="#0D0C09"/><path d="M${lx - 34},${G - 180} L${lx + 34},${G - 180} L${lx + 20},${G - 206} L${lx - 20},${G - 206} Z" fill="#2B4744"/><ellipse cx="${lx}" cy="${G - 176}" rx="20" ry="5" fill="#FFF3D6"/>`); }
    const readers = [[180, 1, 'cap', 'vest', 'man'], [420, -1, 'none', 'jacket', 'man'], [640, 1, 'bowler', 'sack', 'man'], [1100, 1, 'none', 'vest', 'man'], [1380, -1, 'boycap', 'jacket', 'boy'], [1640, -1, 'cap', 'jacket', 'man']];
    readers.forEach(([x, d, hat, coat, kind], i) => { const h = kind === 'boy' ? 280 : 340, turn = Math.sin(t * 0.6 + i) > 0.92;
      m.push(figure({x, y: sitY(G, h), h, d, kind, hat, coat, fill: E2.ink, wear: kind === 'boy' ? ['knickers'] : [], prop: 'paper', an: {...POSES.read(t, i * 0.2), fArm: turn ? [80, 30] : [100, 60]}}) + `<rect x="${x - 50}" y="${G - 66}" width="100" height="8" fill="#0D0C09"/><rect x="${x - d * 50}" y="${G - 170}" width="8" height="170" fill="#0D0C09"/><rect x="${x + d * 44}" y="${G - 60}" width="8" height="60" fill="#0D0C09"/>`); });
    m.push(`<rect x="1860" y="${G - 140}" width="180" height="140" fill="#0D0C09"/>` + figure({x: 1950, y: G - 40, h: 330, d: -1, kind: 'woman', hat: 'none', fill: E2.ink, an: POSES.stand(t, 0.2)}));
    out.push(`<g opacity="${f1(inside)}">${layerAt(c, 1, m.join(''))}</g>`); }
  const scr = [tag(40, 1040, 'CARNEGIE FREE LIBRARY · BRADDOCK, PENNSYLVANIA · 1889', 1)];
  if (t < 4.4) scr.push(penS(1180, 140, 'built by the mill, for the mill town', 30, -3)); else scr.push(penS(1240, 140, 'free to anyone', 36, -3));
  return frame(msDefs(t), `<rect width="1920" height="1080" fill="#0B1414"/>`, out.join(''), scr.join(''), t);
}

/* ================= ch4: Nora's attic room ================= */
function renderAttic(t, quiet = false) {
  const c = cam2(camAt([[0, 0.92, 960, 540], [9, 1.12, 900, 580]], t)), G = 900, m = [], ring = t > 4.6 && t < 7.2 ? 1 : 0;
  const fl = 0.84 + 0.1 * Math.sin(t * 6.1) + 0.06 * Math.sin(t * 15.3);
  // the room: plaster walls, the roof sloping down on the right, a small dormer window with the night sky, bare boards
  m.push(`<rect x="-300" y="-200" width="2600" height="${G + 200}" fill="#1C3332"/><path d="M1100,-200 L2300,-200 L2300,${G - 240} Z" fill="#132423"/><path d="M1100,-200 L2300,${G - 240}" stroke="#0D0C09" stroke-width="14"/>`);
  for (let k = 0; k < 6; k++) m.push(`<path d="M${1100 + k * 200},${-200 + k * 0} L${1100 + k * 200 + 0},${-200 + (k * 200) * (G - 40) / 1200}" stroke="#0D0C09" stroke-width="10" opacity="0.6"/>`);
  m.push(`<rect x="1330" y="160" width="200" height="220" fill="#0D0C09"/><rect x="1345" y="175" width="170" height="190" fill="#1C3A44"/><rect x="1427" y="175" width="6" height="190" fill="#0D0C09"/><rect x="1345" y="268" width="170" height="6" fill="#0D0C09"/>` + [...Array(8)].map((_, k) => `<circle cx="${1355 + k * 21}" cy="${190 + (k * 37) % 80}" r="1.6" fill="#DFE0D6" opacity="0.7"/>`).join(''));
  m.push(MAT.planks(-300, G, 2600, 300, {base: '#1A2B29', seed: 41}) + `<rect x="-300" y="${G}" width="2600" height="80" fill="url(#matFloorShade)"/>`);
  // the call bell: on a coiled spring, its wire running along the wall to the house below; it rings
  const shake = ring * 14 * Math.sin(t * 50), bx = 300, by = 220;
  m.push(line([[bx - 300, by - 60], [bx - 40, by - 60], [bx - 40, by - 20]], '#0D0C09', 3) + `<path d="M${bx - 40},${by - 20} q30,-10 40,10" stroke="#0D0C09" stroke-width="5" fill="none"/>`);
  m.push(`<g transform="rotate(${f1(shake)}, ${bx}, ${by - 10})"><path d="M${bx - 26},${by + 30} Q${bx - 26},${by - 10} ${bx},${by - 10} Q${bx + 26},${by - 10} ${bx + 26},${by + 30} Z" fill="#C9B98A"/><circle cx="${bx}" cy="${by + 34}" r="5" fill="#C9B98A"/></g>`);
  if (ring) for (let k = 0; k < 3; k++) m.push(`<path d="M${bx + 40 + k * 16},${by - 10} q14,20 0,40" stroke="${E2.teal}" stroke-width="4" fill="none" opacity="${f1(0.4 + 0.6 * Math.abs(Math.sin(t * 20 + k)))}"/><path d="M${bx - 40 - k * 16},${by - 10} q-14,20 0,40" stroke="${E2.teal}" stroke-width="4" fill="none" opacity="${f1(0.4 + 0.6 * Math.abs(Math.sin(t * 20 + k)))}"/>`);
  // the uniform on a hook: the black dress and the white apron and cap
  m.push(`<rect x="562" y="300" width="8" height="14" fill="#0D0C09"/><path d="M566,312 L530,330 L500,420 L516,424 L538,360 L534,420 L520,640 L612,640 L598,420 L594,360 L616,424 L632,420 L602,330 Z" fill="#0D0C09"/><path d="M546,420 L586,420 L594,600 L538,600 Z" fill="#DFE0D6" opacity="0.8"/><path d="M548,330 L584,330 L580,372 L552,372 Z" fill="#DFE0D6" opacity="0.8"/><ellipse cx="566" cy="296" rx="16" ry="6" fill="#DFE0D6" opacity="0.8"/>`);
  // the washstand with pitcher and basin; a chair with the candle; the iron bed
  m.push(`<rect x="760" y="${G - 220}" width="200" height="14" fill="#0D0C09"/><rect x="770" y="${G - 206}" width="10" height="206" fill="#0D0C09"/><rect x="940" y="${G - 206}" width="10" height="206" fill="#0D0C09"/><path d="M790,${G - 220} q50,-30 100,0 Z" fill="#A3BAB2"/><path d="M845,${G - 250} l-10,-60 q20,-16 36,0 l-6,60 Z" fill="#A3BAB2"/>`);
  m.push(`<rect x="1010" y="${G - 130}" width="80" height="10" fill="#0D0C09"/><rect x="1014" y="${G - 120}" width="8" height="120" fill="#0D0C09"/><rect x="1078" y="${G - 120}" width="8" height="120" fill="#0D0C09"/><rect x="1080" y="${G - 260}" width="8" height="140" fill="#0D0C09"/>`);
  m.push(glowC(1050, G - 170, 420, 0.9 * fl, 'mswarm') + glowC(1050, G - 170, 90, 0.7 * fl) + `<rect x="1044" y="${G - 170}" width="12" height="40" fill="#DFE0D6"/><path d="M1050,${G - 200 - 4 * fl} q-7,14 0,26 q7,-12 0,-26 Z" fill="#FFF3D6"/>`);
  const bed0 = 1200, bed1 = 1900, bt = G - 120;
  m.push(`<rect x="${bed0}" y="${bt}" width="${bed1 - bed0}" height="40" fill="#2B4744"/><rect x="${bed0}" y="${bt + 40}" width="${bed1 - bed0}" height="8" fill="#0D0C09"/>` + [bed0, bed1 - 10].map((x) => `<rect x="${x}" y="${bt - 120}" width="10" height="${G - bt + 120}" fill="#0D0C09"/><circle cx="${x + 5}" cy="${bt - 124}" r="9" fill="#0D0C09"/>`).join('') + `<path d="M${bed0},${bt - 110} L${bed0 + 0},${bt - 110}" stroke="#0D0C09"/>` + [1, 2, 3, 4].map((k) => `<rect x="${bed0 + 2}" y="${bt - 110 + k * 22}" width="6" height="4" fill="#0D0C09"/>`).join('') + `<rect x="${bed1 - 200}" y="${bt - 20}" width="150" height="26" rx="10" fill="#4E726C"/>`);
  // Nora: sits on the bed, tired, cap in her lap; the bell rings and she gets up
  const up = smooth(5.2, 6.2, t), h = 380, nx = bed0 + 160 - 60 * up;
  const sitAn = {...POSES.sit(t, 0.2), tilt: t < 4.6 ? -14 : 4, fArm: [158, 120], bArm: [160, 125], expr: t < 4.6 ? 'neutral' : 'set', blink: t % 3.3 < 0.12};
  const an = up < 0.5 ? sitAn : {...POSES.stand(t, 0.2), tilt: 2, expr: 'set', fArm: [165, 150]};
  const lod = lodFor(h * 0.88 * c.z);
  m.push(figure({...cast('sister', {x: nx, y: up < 0.5 ? sitY(bt + 6, h * 0.88) : G, h, d: -1}), det: lod.det, rim: {c: '#FFE6C9', a: 0.6 * fl, dx: -0.008, dy: -0.004}, an}));
  const scr = [tag(40, 1040, 'NORA\'S ROOM · TOP FLOOR, 660 FIFTH AVENUE', 1)];
  if (t > 1 && t < 4.6) scr.push(penS(1150, 140, 'up the back stairs, under the roof', 30, -3));
  if (ring) scr.push(penS(140, 140, 'the bell: someone downstairs wants something', 30, -3));
  if (t > 7.4) scr.push(penS(1180, 140, 'on call, day and night', 34, -3));
  if (quiet) scr.splice(1);   // keep the place tag, drop the notes (the edit times its own)
  return frame(msDefs(t), `<rect width="1920" height="1080" fill="#0B1414"/>`, layerAt(c, 1, m.join('')), scr.join(''), t);
}

Object.assign(CLIPS, {
  fittest_explainer: {sec: 10, render: (t) => renderFittest(t)},
  spencer_banquet: {sec: 9, render: (t) => renderBanquet(t)},
  rich_leisure: {sec: 10, render: (t) => renderLeisure(t)},
  carnegie_library: {sec: 9, render: (t) => renderLibrary(t)},
  nora_attic: {sec: 9, render: (t) => renderAttic(t)},
});
if (typeof window !== 'undefined') Object.assign(window, {renderFittest, renderBanquet, renderLeisure, renderLibrary, renderAttic});
