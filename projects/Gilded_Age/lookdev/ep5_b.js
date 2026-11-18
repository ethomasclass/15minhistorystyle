// Episode 5, the remaining drawn silhouette scenes (load after ep5.js; same look and helpers: e5Defs, e5Ink, e5Standing, e5Sit,
// e5Flick, e5Lamp, e5Mist; ep4 e4Track, e4Walk, e4Speak, e4Keys, e4Bump, e4Outlined, e4Snow, e4KellyRoom; ep3 E3K, reach, holding,
// e3Move, e3Stand, e3Settle; refinery.js RFC and rfPipe; ep2_more.js camAt).
//
//   ep5_refinery      ch 2: the boiling floor at the refinery, Michael hauls a sack past the vats; then the gate and the line of men.
//   ep5_kitchen_1887  ch 4: the Kelly kitchen, Tommy and Michael ("A union?").
//   ep5_corn_stove    ch 6: the sod house, Owen feeds ears of corn into the stove.
//   ep5_coxey         ch 8: Coxey's Army comes up the avenue to the Capitol; two police walk Coxey off the grass.
//   ep5_bryan         ch 9: the Chicago convention, Bryan spreads his arms; the hall erupts.
//   ep5_porch         ch 9: McKinley's front porch in Canton, a train and a crowd.
//   ep5_kitchen_1896  ch 9: the Kelly kitchen argument, Tommy, Michael and Ma.
//   ep5_bridge_1898   ch 10: New Year's Day 1898, Michael and Tommy walk across the Brooklyn Bridge.
//
// Rules as the series: the Kellys coral (always outlined in ink, e4Outlined); everyone else ink; real people (Coxey, Bryan, McKinley)
// faceless; no violence on screen; nobody kneels or crouches near another's lap; feet planted, hands on what they hold. No em dashes.

/* ---------------- shared ---------------- */
const E5B = {coral: '#FF6F61', ink: '#0D0C09', burlap: '#B9A37A', burlapD: '#8C7955'};
// a sack carried on the shoulder (behind the head): the hands reach up onto it. Returns {fo, back} (back: the sack, drawn first)
function e5bShoulderSack(fo, name) {
  const h = fo.h, d = fo.d ?? 1, [cx, cy] = E3K.toWorld(fo, -0.06, 0.905), w = 0.38 * h, hh = 0.17 * h, rot = -8 * d;
  const sack = `<g transform="rotate(${f1(rot)}, ${f1(cx)}, ${f1(cy)})"><path d="M${f1(cx - w / 2)},${f1(cy + hh * 0.2)} Q${f1(cx - w / 2 - 6)},${f1(cy - hh * 0.6)} ${f1(cx - w * 0.2)},${f1(cy - hh * 0.55)} Q${f1(cx)},${f1(cy - hh * 0.75)} ${f1(cx + w * 0.25)},${f1(cy - hh * 0.55)} Q${f1(cx + w / 2 + 8)},${f1(cy - hh * 0.5)} ${f1(cx + w / 2)},${f1(cy + hh * 0.25)} Q${f1(cx)},${f1(cy + hh * 0.62)} ${f1(cx - w / 2)},${f1(cy + hh * 0.2)} Z" fill="${E5B.burlap}" stroke="#0D0C09" stroke-width="3"/>` +
    `<path d="M${f1(cx - w * 0.3)},${f1(cy - hh * 0.2)} q${f1(w * 0.3)},${f1(hh * 0.25)} ${f1(w * 0.6)},0" stroke="${E5B.burlapD}" stroke-width="2" fill="none"/><path d="M${f1(cx - w * 0.45)},${f1(cy)} q-10,-6 -14,4" stroke="${E5B.burlapD}" stroke-width="3" fill="none"/></g>`;
  let o = reach(fo, 'f', ...E3K.toWorld(fo, 0.06, 0.97), name + '.sackF');
  o = reach(o, 'b', ...E3K.toWorld(fo, -0.19, 0.93), name + '.sackB');
  return {fo: o, back: sack};
}
// heat shimmer: a slowly rising noise field displacing what it is applied to (filter id e5bheat)
const e5bHeatDef = (t, scale = 7) => `<filter id="e5bheat" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.035" numOctaves="2" seed="7" result="n"/>` +
  `<feOffset in="n" dx="0" dy="${f1(-t * 60 % 4000)}" result="m"/><feDisplacementMap in="SourceGraphic" in2="m" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/></filter>`;
// breath in the cold: a small puff from the mouth every few seconds
function e5bBreath(fo, t, ph = 0) { const [mx, my] = E3K.toWorld(fo, 0.08, 0.905), u = ((t + ph * 3.1) % 3.2) / 1.4; if (u > 1) return '';
  const d = fo.d ?? 1; return `<circle cx="${f1(mx + d * (8 + 40 * u))}" cy="${f1(my - 14 * u)}" r="${f1(5 + 16 * u)}" fill="#E8EEEE" opacity="${f1(0.4 * (1 - u))}" filter="url(#e5blur)"/>`; }
// an ink figure, cold daylight rim from the side of the light (lx)
const e5bDay = (base, lx, a = 0.5) => ({fill: E5B.ink, det: 0, tones: {tone: '#25231D', lite: '#3A3730'}, ...base, rim: {c: '#DCE8E6', a, dx: (base.x ?? 0) > lx ? -0.009 : 0.009, dy: -0.006}});

/* ================= ep5_refinery (ch 2): the boiling floor; the gate and the line of men (14 s, two shots) ================= */
// Shot A (0 to 7.8): the boiling floor of the Ep 1 refinery (refinery.js's teal-dark iron, pipes with the cream sugar running in them)
// at human scale: three open boiling vats over firebox glow, steam pouring up into the roof, heat shimmer over the vats. Michael
// (coral, vest and cap) carries a sack on his shoulder from left to right in front of them; men (ink) stir a vat with a paddle,
// stoke a firebox and carry sacks the other way at the back. Shot B (7.8 to 14): the refinery yard by the gate, a grey January
// morning, a little snow on the ground. The foreman (ink, bowler) and Michael; the foreman turns and points past the gate (10.0) to
// the long line of men waiting outside the railing for work; Michael looks; the camera follows the point down the line.
const RFN = {sec: 14, cut: 7.8, walk: [0.6, 7.6], turn: 9.6, point: 10.0, look: 10.4, drop: 13.0, H: 430, G: 1000, GB: 930};
function e5bBoilFloor(t, c) {
  const s = [], G = RFN.G, GB = RFN.GB;
  s.push(`<rect x="-600" y="-400" width="3600" height="1900" fill="#0A1413"/>`);
  s.push(MAT.brick(-600, 60, 3600, GB - 60, {base: RFC.room, seed: 531, vary: 0.28, soot: 'top'}));
  // tall factory windows, hazed with steam; daylight shafts
  for (const x of [-200, 420, 1040, 1660, 2280]) s.push(`<rect x="${x}" y="150" width="150" height="430" fill="${RFC.glass}" opacity="0.55"/><rect x="${x + 72}" y="150" width="6" height="430" fill="#050808"/>` +
    [0, 1, 2].map((k) => `<rect x="${x}" y="${290 + k * 140}" width="150" height="5" fill="#050808"/>`).join('') + `<path d="M${x},580 L${x + 150},580 L${x + 420},${GB} L${x + 120},${GB} Z" fill="#F4EFE6" opacity="0.05"/>`);
  // the roof trusses and the sugar pipes overhead (rfPipe: the cream dashes are the syrup running)
  s.push(`<rect x="-600" y="40" width="3600" height="26" fill="#050808"/>` + [...Array(10).keys()].map((k) => line([[-500 + k * 340, 66], [-330 + k * 340, 130], [-160 + k * 340, 66]], '#050808', 6)).join(''));
  s.push(rfPipe(`M-600,118 L2900,118`, t, 14, 80) + rfPipe(`M-600,610 L250,610 L250,300 L2900,300`, t, 9, 60));
  return s.join('');
}
function e5bVat(x, t, i) { // an open boiling vat (x = centre): iron drum on a brick firebox, boiling syrup surface, steam
  const G = RFN.GB, w = 400, top = G - 330, s = [];
  s.push(MAT.brick(x - w / 2 - 20, G - 120, w + 40, 120, {base: '#3A2A20', seed: 600 + i, vary: 0.4, soot: 'top'}));
  const fl = 0.8 + 0.2 * Math.sin(t * 9 + i * 2) * Math.sin(t * 5.3 + i);
  s.push(`<rect x="${x - 60}" y="${G - 92}" width="120" height="64" rx="6" fill="#FF9A40" opacity="${f1(0.75 * fl)}"/><rect x="${x - 60}" y="${G - 92}" width="120" height="64" rx="6" fill="none" stroke="#050808" stroke-width="8"/>` +
    [0, 1, 2].map((k) => `<rect x="${x - 40 + k * 32}" y="${G - 88}" width="6" height="58" fill="#050808"/>`).join('') + glowC(x, G - 60, 260, 0.6 * fl, 'mswarm'));
  s.push(MAT.iron(x - w / 2, top + 20, w, G - 120 - top - 20, {base: RFC.mach, seams: 52}) + `<rect x="${x - w / 2 - 10}" y="${top + 10}" width="${w + 20}" height="18" rx="4" fill="#050808"/>`);
  // the boiling surface, seen just over the rim: amber syrup, bubbles rising and bursting
  s.push(`<ellipse cx="${x}" cy="${top + 12}" rx="${w / 2 - 6}" ry="12" fill="#D9A050"/><ellipse cx="${x}" cy="${top + 10}" rx="${w / 2 - 30}" ry="7" fill="#F2CC84" opacity="0.8"/>`);
  const r = rng(620 + i);
  for (let k = 0; k < 14; k++) { const ph = (t * (0.9 + r()) + r()) % 1, bx = x + (r() - 0.5) * (w - 60); s.push(`<circle cx="${f1(bx)}" cy="${f1(top + 10 - ph * 6)}" r="${f1(2 + 7 * ph)}" fill="none" stroke="#FFF0C8" stroke-width="2" opacity="${f1(0.8 * (1 - ph))}"/>`); }
  s.push(glowC(x, top, 300, 0.35, 'mswarm'));
  return {svg: s.join(''), steam: MAT.smoke(x - 80, top - 10, t + i * 1.7, {col: 'D9DEDA', k: 2.2, n: 9, rise: 210, drift: 50, speed: 5, seed: 640 + i}) + MAT.smoke(x + 90, top - 10, t + i * 2.3 + 1, {col: 'B8C4C4', k: 1.8, n: 7, rise: 230, drift: -40, speed: 6, seed: 650 + i}), top};
}
function e5bRefineryA(t) {
  const {H, G, GB} = RFN, c = cam2(camAt([[0, 1.0, 760, 600], [RFN.cut, 1.08, 1540, 610]], t)), s = [], fr = [];
  const lod = lodFor(H * c.z), det = lod.det, rimF = (x) => ({c: '#FFC890', a: lod.rimA * 0.6, dx: 0.008, dy: -0.006});
  s.push(e5bBoilFloor(t, c));
  const vats = [600, 1250, 1900].map((x, i) => e5bVat(x, t, i));
  const back = [];
  // back: men carrying sacks the other way along the far wall (small, a lighter ink for depth), on GB
  for (let k = 0; k < 2; k++) { const u = ((t / 12 + k * 0.5) % 1), x = 2500 - u * 2900, fo = {kind: 'man', hat: 'cap', coat: 'vest', x, y: GB - 30, h: 300, d: -1, fill: '#24302E', det: 0, tones: {tone: '#2E3D3A', lite: '#3A4A47'}, an: walkAn(walkPhase(u * 2900, 300))};
    const sk = e5bShoulderSack(fo, 'rf.back' + k); back.push(sk.back + figure(sk.fo)); }
  s.push(`<g filter="url(#e5bheat)">${back.join('')}${vats.map((v) => v.svg).join('')}</g>`);
  // the stirrer: on the vat's step at the middle vat, a long paddle down into the syrup
  const sx = 1250 + 250, sFo0 = e5Standing({...e5Ink({kind: 'man', hat: 'cap', coat: 'vest', h: H * 0.98, d: -1, x: sx}, lod, 1250), det: 0}, sx, GB + 10, t, 0.3, 'rf.stir', {lean: 6, tilt: -10});
  const sw = Math.sin(t * 1.6), pTop = [sx - 70 + 20 * sw, GB + 10 - 0.86 * H], pBot = [1250 + 60 + 50 * sw, vats[1].top + 8];
  const along = (k) => [lerp(pTop[0], pBot[0], k), lerp(pTop[1], pBot[1], k)];
  let stir = reach(sFo0, 'f', ...along(0.32), 'rf.stir.paddle'); stir = reach(stir, 'b', ...along(0.08), 'rf.stir.paddle2');
  s.push(line([pTop, [pBot[0], pBot[1] + 30]], '#2A1E12', 7) + fig(stir));
  // the stoker: shovel into the left firebox, a rhythmic dig
  const kx = 600 - 230, dig = Math.max(0, Math.sin(t * 1.9)), stk = e5Standing({...e5Ink({kind: 'man', hat: 'none', coat: 'vest', h: H, d: 1, x: kx}, lod, 600), det: 0}, kx, GB + 14, t, 0.6, 'rf.stoke', {lean: 6 + 8 * dig, tilt: -14});
  const sh0 = [kx + 70 + 40 * dig, GB - 30 - 20 * dig], sh1 = [kx + 150 + 50 * dig, GB - 60 + 10 * dig];
  let stoke = reach(stk, 'f', lerp(sh0[0], sh1[0], 0.45), lerp(sh0[1], sh1[1], 0.45), 'rf.stoke.sh'); stoke = reach(stoke, 'b', sh0[0], sh0[1], 'rf.stoke.sh2');
  s.push(fig(stoke) + line([[sh0[0] - 20, sh0[1] + 10], sh1], '#1A140D', 6) + `<path d="M${f1(sh1[0])},${f1(sh1[1] - 10)} l26,4 l-4,22 l-24,-6 Z" fill="#1A140D"/>`);
  s.push(vats.map((v) => v.steam).join(''));
  // Michael: the sack on his shoulder, from left to right in front of the vats, head down under the load
  const mBase = cast('michael', {x: 0, y: 0, h: H, coat: 'vest', hat: 'cap', det, rim: rimF(), an: {tilt: -10, expr: 'set', blink: (t + 0.7) % 3.6 < 0.12}});
  const tr = e4Track(mBase, {x: 120, d: 1, G, ph: 0.2, walks: [{t0: RFN.walk[0], t1: RFN.walk[1], to: 2250, dAfter: 1, a: 0.12}]}, t, 'rf.michael');
  const sk = e5bShoulderSack(tr.fo, 'rf.michael');
  fr.push(sk.back + e4Outlined(sk.fo));
  // the floor (planks) and the near edge
  const floor = `<rect x="-600" y="${GB}" width="3600" height="${G + 120 - GB}" fill="#132423"/>` + MAT.planks(-600, GB, 3600, G + 120 - GB, {base: '#152422', seed: 533, size: 46, vertical: true}) + `<rect x="-600" y="${GB}" width="3600" height="${G + 120 - GB}" fill="url(#matFloorShade)"/>`;
  const world = layerAt(c, 1, s[0] + floor + s.slice(1).join('') + fr.join(''));
  const heatHaze = `<rect width="1920" height="1080" fill="#FFB060" opacity="0.06"/>`;
  return {world: world + heatHaze, scr: tag(130, 120, 'THE REFINERY · WILLIAMSBURG, BROOKLYN · 1887', smooth(0.3, 0.7, t) * (1 - smooth(4.4, 4.8, t)))};
}
function e5bRefineryB(t) {
  const H = 440, G = 1010, GQ = 890, c = cam2(camAt([[RFN.cut, 1.12, 760, 640], [RFN.point, 1.12, 830, 640], [RFN.drop, 1.0, 1350, 610], [RFN.sec, 1.0, 1400, 610]], t)), s = [];
  // the sky, the refinery's wall and stacks behind (left), the street outside the railing
  s.push(`<rect x="-800" y="-400" width="3800" height="1500" fill="url(#rfbsky)"/>`);
  s.push([[1700, 140, 60], [1900, 60, 70], [2300, 200, 56]].map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="${GQ - y}" fill="#5F7472"/>` + MAT.smoke(x + w / 2, y, t + x * 0.01, {col: 'A3BAB2', k: 1.2, n: 6, rise: 160, drift: 120, speed: 6, seed: x})).join(''));
  s.push(`<rect x="1400" y="560" width="1600" height="${GQ - 560}" fill="#6E8280"/>` + [...Array(8).keys()].map((k) => `<rect x="${1450 + k * 190}" y="610" width="70" height="100" fill="#4E605E"/>`).join('')); // across the street
  s.push(MAT.brick(-800, 180, 2000, G - 180, {base: '#5A3A30', seed: 541, vary: 0.3, soot: 'bottom'}) + [-500, -100, 300, 700].map((x) => `<rect x="${x}" y="300" width="160" height="260" fill="#33403F"/><rect x="${x + 77}" y="300" width="6" height="260" fill="#1A1A18"/>`).join('')); // the refinery building (left)
  s.push(`<rect x="-800" y="${GQ}" width="3800" height="40" fill="#8E9C9A"/><rect x="-800" y="${GQ}" width="3800" height="6" fill="#E8EEEE" opacity="0.7"/>`); // the street outside
  // the line of men outside the railing, on the sidewalk, from the gate to the far right; they shift, stamp, breathe in the cold
  const q = [], r = rng(551), hats = ['cap', 'bowler', 'cap', 'cap', 'bowler', 'cap'], coats = ['jacket', 'sack', 'jacket', 'sack'];
  for (let k = 0; k < 16; k++) { const x = 1290 + k * 92 + (r() - 0.5) * 20, d = r() < 0.75 ? -1 : 1, hh = 300 * (0.94 + 0.1 * r());
    let fo = e5Standing(e5bDay({kind: 'man', hat: hats[k % 6], coat: coats[k % 4], beard: r() < 0.2, h: hh, d, x}, 2600, 0.45), x, GQ, t, r(), `rf.q${k}`, {tilt: 4 * Math.sin(t * 0.4 + k) + (t > RFN.point + 0.4 + k * 0.05 && k < 6 ? -6 : 0)});
    if (k % 3 === 0) { fo = {...fo, an: {...fo.an, ...E3_FOLD, lean: 0}}; q.push(fig(fo) + foldedArms(fo.x, fo.y, fo.h, fo.d, fo.fill, '#25231D')); } else q.push(fig(fo));
    q.push(e5bBreath(fo, t, k * 0.37)); }
  s.push(q.join(''));
  // the railing and the gate (open a little), brick piers
  const rail = [], gx0 = 1120, gx1 = 1290;
  rail.push(`<rect x="${gx1}" y="${GQ - 250}" width="2000" height="10" fill="#141414"/><rect x="${gx1}" y="${GQ - 30}" width="2000" height="8" fill="#141414"/>`);
  for (let x = gx1 + 10; x < 3200; x += 26) rail.push(`<rect x="${x}" y="${GQ - 262}" width="5" height="262" fill="#141414"/><path d="M${x - 3},${GQ - 262} l5.5,-14 l5.5,14 Z" fill="#141414"/>`);
  rail.push(MAT.brick(gx0 - 70, GQ - 340, 70, 340, {base: '#5A3A30', seed: 553, vary: 0.4}) + MAT.brick(gx1, GQ - 340, 60, 340, {base: '#5A3A30', seed: 554, vary: 0.4}) + `<rect x="${gx0 - 80}" y="${GQ - 350}" width="90" height="16" fill="#3A2A22"/><rect x="${gx1 - 10}" y="${GQ - 350}" width="80" height="16" fill="#3A2A22"/>`);
  const ga = 0.55; // the gate leaf half open toward the yard (foreshortened)
  for (let k = 0; k < 7; k++) { const x = gx0 + k * 24 * ga; rail.push(`<rect x="${f1(x)}" y="${GQ - 280}" width="5" height="270" fill="#141414"/>`); }
  rail.push(`<rect x="${gx0}" y="${GQ - 270}" width="${f1(150 * ga)}" height="8" fill="#141414"/><rect x="${gx0}" y="${GQ - 40}" width="${f1(150 * ga)}" height="8" fill="#141414"/>`);
  s.push(rail.join(''));
  // the yard: trodden snow, cobbles showing
  s.push(`<rect x="-800" y="${GQ + 40}" width="3800" height="${G + 200 - GQ}" fill="#A8B4B2"/>` + MAT.floor(-800, 3000, GQ + 40, G + 200, {kind: 'cobble', base: '#7C8886', seed: 557, size: 30}) + `<rect x="-800" y="${GQ + 40}" width="3800" height="${G + 200 - GQ}" fill="#E8EEEE" opacity="0.35"/>`);
  // the foreman and Michael in the yard; the foreman turns and points out at the line; Michael turns his head to look
  const lod = lodFor(H * c.z), det = lod.det, pt = smooth(RFN.point - 0.3, RFN.point + 0.25, t) * (1 - smooth(RFN.drop, RFN.drop + 0.5, t));
  const fx = 820, fd = t < RFN.turn ? -1 : 1;
  let fm = e5Standing(e5bDay({kind: 'man', hat: 'bowler', coat: 'sack', beard: true, h: H, d: fd, x: fx}, 2000, 0.6), fx, G, t, 0.2, 'rf.foreman', {tilt: fd > 0 ? 4 : -2, jaw: e4Speak([[RFN.point + 0.4, RFN.point + 2.2]], t).jaw});
  fm = {...fm, an: {...fm.an, fArm: [lerp(176, 76, ease(pt)), lerp(180, 72, ease(pt))], bArm: fd < 0 ? [190, 196] : [lerp(190, 200, pt), 200]}};
  const mx = 560, look = smooth(RFN.look, RFN.look + 0.5, t);
  let mi = e5Standing(cast('michael', {x: mx, h: H, d: 1, coat: 'jacket', hat: 'cap', det, rim: {c: '#E8EEEE', a: lod.rimA * 0.5, dx: 0.008, dy: -0.006}}), mx, G, t, 0.7, 'rf.michael.y', {tilt: lerp(-4, 8, look), expr: 'set', blink: (t + 0.3) % 3.4 < 0.12});
  s.push(e4Outlined(mi), fig(fm), e5bBreath(fm, t, 0.2), e5bBreath(mi, t, 1.3));
  s.push(e4Snow(t, c, {n: 70, size: 2.4, speed: 50, op: 0.6}).replace(/<circle/g, '<circle'));
  return {world: layerAt(c, 1, s.join('')), scr: ''};
}
function renderE5Refinery(t) {
  const sh = t < RFN.cut ? e5bRefineryA(t) : e5bRefineryB(t);
  const defs = e5Defs(t, e5bHeatDef(t) + grad('rfbsky', [['0', '#9AAAA8'], ['1', '#D4DCDA']]));
  return frame(defs, `<rect width="1920" height="1080" fill="#0A1413"/>`, sh.world, sh.scr, t);
}
if (typeof window !== 'undefined') Object.assign(window, {renderE5Refinery});
Object.assign(CLIPS, {ep5_refinery: {sec: RFN.sec, render: (t) => renderE5Refinery(t)}});

/* ================= the Kelly kitchen (Ep 4's set, e4KellyRoom): dialogue helpers ================= */
// speech from word times: words [[start, end], ...] (seconds in the clip): the mouth closes between words, as e4Speak inside each
function e5bSay(words, t) { const sp = e4Speak(words.map(([a, b]) => [a - 0.02, b + 0.04]), t); const a = words[0][0], b = words[words.length - 1][1];
  return {...sp, line: t > a - 0.1 && t < b + 0.25, beat: t > a && t < b ? Math.max(0, Math.sin(t * 6.7 + 0.4)) : 0}; }
// word times from a chapter's words.json (seconds in the chapter), shifted to the clip (clip t = chapter t - off)
const e5bW = (arr, off) => arr.map(([a, b]) => [+(a - off).toFixed(2), +(b - off).toFixed(2)]);
// Michael seated at the kitchen table with a mug in both hands; sip: 0..1 lifts the mug to his mouth
function e5bMichaelMug(an, ty, sip, det, rim, name) {
  const {F, H} = RM, cx = KF.chair;
  let mi = sitOn(cast('michael', {x: cx, y: 0, h: H, d: 1, det, rim, an}), F - 0.24 * H, F, 0.18, name + '.seat');
  const m0 = [KF.table[0] + 60, ty], m1 = E3K.toWorld(mi, 0.13, 0.84), k = ease(sip), mug = [lerp(m0[0], m1[0], k), lerp(m0[1], m1[1] + 14, k)];
  mi = reach(mi, 'f', mug[0] + 14, mug[1] - 16, name + '.mug'); mi = reach(mi, 'b', mug[0] - 12, mug[1] - 14, name + '.mug2');
  const chair = `<rect x="${cx - 50}" y="${F - 0.24 * H}" width="100" height="12" fill="#0D0C09"/><rect x="${cx - 46}" y="${F - 0.24 * H + 12}" width="10" height="${0.24 * H - 12}" fill="#0D0C09"/><rect x="${cx + 34}" y="${F - 0.24 * H + 12}" width="10" height="${0.24 * H - 12}" fill="#0D0C09"/><rect x="${cx - 50}" y="${F - 0.24 * H - 220}" width="10" height="220" fill="#0D0C09"/>`;
  return {fo: mi, chair, mug: e4Mug(mug[0], mug[1])};
}
// Ma at the stove, stirring the pot (kitchen right side of the stove); look: turns her head toward the table
function e5bMaStir(t, det, rim, look = 0, name = 'k5.ma', expr = 'neutral') {
  const {F, H} = RM, mx = KF.stove + 290, potP = [KF.stove + 120, RM.wallFoot - 280];
  let ma = cast('mother', {x: mx, y: F, h: H, d: look > 0.5 ? 1 : -1, det, rim, an: {...POSES.stand(t, 0.5), tilt: look > 0.5 ? 4 : -12, expr, blink: (t + 0.6) % 3.8 < 0.12}});
  ma = e3Stand({...ma, floorY: F}, mx, mx, 0, name);
  let spoon = '';
  if (look <= 0.5) { const k = Math.sin(t * 3.1); ma = {...ma, an: {...ma.an, lean: 8}}; ma = reach(ma, 'f', potP[0] + 18 * k, potP[1] - 4 * Math.abs(k), name + '.spoon'); ma = reach(ma, 'b', potP[0] + 46, potP[1] + 4, name + '.pot');
    spoon = holding(ma, 'f', name + '.spoonH', (gx, gy) => line([[gx, gy], [gx + 10, gy + 40]], '#3A2C1C', 4)); }
  return {fo: ma, pot: `<path d="M${potP[0] - 10},${RM.wallFoot - 262} l6,-46 l100,0 l6,46 Z" fill="#141817"/>`, spoon};
}

/* ================= ep5_kitchen_1887 (ch 4, 12 s): "A union?" ================= */
// The Kellys' kitchen, winter 1887 (Ep 4's set: frost on the glass, the coal low). Michael (coral) at the table with a mug; Tommy
// (coral, younger, quick) by the window, annoyed: "A union? Mr. Duffy says the Knights are nothing but trouble." Michael, dry, looks
// up at him: "Mr. Duffy doesn't work at the refinery." and takes a sip; Tommy folds his arms and looks away to the window. Ma at the
// stove stirring. Synced to ch04_two_kinds_of_unions.words.json from 91.4 s (clip t = chapter t - 91.4).
const K7 = {sec: 12, off: 91.4};
K7.tommy = e5bW([[93.42, 93.52], [93.78, 94.2], [94.62, 94.68], [95.0, 95.3], [95.36, 95.52], [95.56, 95.66], [95.68, 95.96], [95.98, 96.1], [96.22, 96.5], [96.52, 96.66], [96.74, 97.14]], K7.off);
K7.michael = e5bW([[98.2, 98.26], [98.58, 98.9], [98.94, 99.2], [99.28, 99.5], [99.54, 99.6], [99.64, 99.7], [99.72, 100.36]], K7.off);
function renderE5Kitchen1887(t, o = {}) {
  const {F, H} = RM, room = e4KellyRoom(t, false), s = [room.back], ty = room.ty;
  const c = cam2(camAt([[0, 1.2, 960, 612], [5.5, 1.3, 1080, 616], [12, 1.38, 1150, 612]], t));
  const lod = lodFor(H * c.z), det = lod.det, rimW = {c: '#FFE6C9', a: lod.rimA * 0.7 * room.fl, dx: -0.008, dy: -0.004}, rimC = {c: '#DCE8E6', a: lod.rimA * 0.6, dx: 0.008, dy: -0.005};
  const ts = e5bSay(K7.tommy, t), ms = e5bSay(K7.michael, t), T0 = K7.tommy[0][0], M0 = K7.michael[0][0], M1 = K7.michael[K7.michael.length - 1][1];
  // Ma stirring at the stove; she glances over at Michael's answer
  const ma = e5bMaStir(t, det, rimW, t > M0 + 0.3 && t < M1 + 0.6 ? 1 : 0, 'k7.ma');
  // Michael: mug in both hands, eyes on the mug; looks up at Tommy for his answer; a sip after it
  const sip = smooth(M1 + 0.3, M1 + 0.9, t) * (1 - smooth(M1 + 1.9, M1 + 2.5, t));
  const look = smooth(T0 + 0.6, T0 + 1.0, t);
  const mm = e5bMichaelMug({tilt: lerp(-12, 8, look) + 3 * ms.beat - 10 * sip + 2 * Math.sin(t * 0.6), expr: 'set', jaw: ms.jaw, blink: (t + 1.4) % 3.6 < 0.12}, ty, sip, det, rimW, 'k7.michael');
  // Tommy: by the window, quick and annoyed; hands up on "A union?", a finger on "Mr. Duffy says", a flat chop on "nothing but trouble";
  // then folds his arms through Michael's answer and turns his head to the window
  const tx = 1395, away = smooth(M1 + 0.4, M1 + 1.0, t), b = ts.beat * 8;
  let tm = cast('brother', {x: tx, y: F, h: H * 1.12, hat: 'boycap', wear: [], d: -1, det, rim: rimC, an: {...POSES.stand(t, 0.8), tilt: 4 + 5 * ts.beat - 14 * away + (t < T0 ? 2 * Math.sin(t * 1.3) : 0), expr: t > M0 ? 'neutral' : 'worried', jaw: ts.jaw, blink: (t + 0.2) % 3.3 < 0.12}});
  tm = e3Stand({...tm, floorY: F}, tx, tx, 0, 'k7.tommy');
  const fK = [[T0 - 0.3, 176, 180], [T0 + 0.1, 112, 44], [T0 + 0.75, 112, 44 + b], [T0 + 1.1, 120, 20], [T0 + 2.0, 118, 16 + b], [T0 + 2.6, 98, 92], [T0 + 2.9, 120, 150], [T0 + 3.3, 150, 168], [M0 - 0.2, 160, 160], [M0 + 0.5, 150, -92]];
  const bK = [[T0 - 0.3, 184, 190], [T0 + 0.1, 118, 52], [T0 + 0.75, 118, 52], [T0 + 1.1, 182, 188], [M0 - 0.2, 184, 190], [M0 + 0.5, 140, -98]];
  tm = {...tm, an: {...tm.an, fArm: e4Keys(fK, t), bArm: e4Keys(bK, t), lean: ts.line ? 3 : 0}};
  const tmOver = t > M0 + 0.5 ? foldedArms(tm.x, tm.y, tm.h, tm.d, tm.fill, tm.tones.tone) : '';
  s.push(ma.pot, e4Outlined(ma.fo) + ma.spoon, room.scuttle, mm.chair, e4Outlined(mm.fo), mm.mug, e4Outlined(tm) + tmOver, room.front);
  const world = layerAt(c, 1, s.join(''));
  const scr = o.quiet ? '' : tag(130, 120, 'THE KELLYS\' KITCHEN · WINTER 1887', smooth(0.2, 0.5, t) * (1 - smooth(3.4, 3.8, t)));
  return frame(e4KfDefs(t), `<rect width="1920" height="1080" fill="#060A0A"/>`, world, scr, t);
}
if (typeof window !== 'undefined') Object.assign(window, {renderE5Kitchen1887});
Object.assign(CLIPS, {ep5_kitchen_1887: {sec: K7.sec, render: (t) => renderE5Kitchen1887(t)}});

/* ================= ep5_corn_stove (ch 6, 13 s): "Burned corn in the stove this winter." ================= */
// The sod house of ep5_farm_kitchen (e5SodRoom, e5Bed, the table and lamp), the same winter night, snow driving past the window.
// Uncle Owen (coral) stands at the stove with an armful of ears of corn; he opens the firebox door (warm light floods over him),
// feeds three ears into the fire one by one (each catches with a flare and sparks), closes the door and warms his hands. The child
// sleeps in the far corner. Scale as the farm kitchen (a man 440 px).
const CS = {sec: 13, open: [1.2, 2.0], feeds: [3.0, 5.6, 8.2], close: [10.9, 11.6], warm: 11.9, ox: 975};
function e5bFire(x, y, w, h, t, k) { const s = [], r = rng(733);
  s.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#3A1408"/><rect x="${x}" y="${y + h * 0.62}" width="${w}" height="${h * 0.38}" fill="#FF7A2A" opacity="0.9"/>`);
  for (let j = 0; j < 4; j++) { const bx = x + w * (0.15 + 0.23 * j), ph = r() * 9, th = h * (0.5 + 0.4 * Math.abs(Math.sin(t * (5 + r() * 3) + ph))) * k, sw = 5 * Math.sin(t * 6.3 + ph);
    s.push(e4Tongue(bx, y + h, w * 0.3, th, sw, '#FF5A1A', 0.95), e4Tongue(bx + sw * 0.2, y + h, w * 0.16, th * 0.7, sw * 0.8, '#FFC24A', 0.95), e4Tongue(bx, y + h, w * 0.07, th * 0.42, sw * 0.6, '#FFF1B8', 0.9)); }
  return s.join(''); }
const e5bEar = (x, y, ang, k = 1) => `<g transform="rotate(${f1(ang)}, ${f1(x)}, ${f1(y)})"><ellipse cx="${f1(x + 22 * k)}" cy="${f1(y)}" rx="${f1(24 * k)}" ry="${f1(7.5 * k)}" fill="#E0B44A" stroke="#0D0C09" stroke-width="2"/>` +
  `<path d="M${f1(x + 4 * k)},${f1(y - 6 * k)} q${f1(16 * k)},${f1(-4 * k)} ${f1(34 * k)},${f1(2 * k)} M${f1(x + 4 * k)},${f1(y + 6 * k)} q${f1(16 * k)},${f1(4 * k)} ${f1(34 * k)},${f1(-2 * k)}" stroke="#B88A34" stroke-width="2" fill="none"/><path d="M${f1(x)},${f1(y)} l${f1(-12 * k)},${f1(-6 * k)} l${f1(2 * k)},${f1(8 * k)} Z" fill="#C8B07A"/></g>`;
function renderE5CornStove(t, o = {}) {
  const {H, F, top} = FK, c = cam2(o.cam || camAt([[0, 1.42, 960, 690], [13, 1.58, 930, 705]], t));
  const lod = lodFor(H * c.z), det = lod.det, g = e5Gust(t), room = e5SodRoom(t), s = [room.back];
  const [s0, s1] = FK.stove, sy = FK.wallFoot - 210, lampX = 1255, fl = e5Flick(t) * (1 - 0.12 * g * Math.max(0, Math.sin(t * 7.1)));
  const door = smooth(CS.open[0], CS.open[1], t) * (1 - smooth(CS.close[0], CS.close[1], t)); // 0 shut .. 1 open
  let flare = 0; CS.feeds.forEach((f) => { flare = Math.max(flare, e4Bump(t, f + 1.4, 1.0)); });
  const fire = 0.85 + 0.15 * Math.sin(t * 9) * Math.sin(t * 5.7), heat = door * (0.75 + 0.35 * flare) * fire;
  // the stove (as the farm kitchen's) with the firebox door on its right-hand front, hinged on its left edge
  const dx0 = s0 + 96, dw = 70, dy0 = sy + 40, dh = 60;
  s.push(`<rect x="${s0}" y="${sy}" width="${s1 - s0}" height="170" fill="#0D0C09"/><rect x="${s0 - 10}" y="${sy - 12}" width="${s1 - s0 + 20}" height="14" fill="#0D0C09"/><rect x="${s0 + 14}" y="${FK.wallFoot - 40}" width="14" height="${F - FK.wallFoot + 40}" fill="#0D0C09"/><rect x="${s1 - 28}" y="${FK.wallFoot - 40}" width="14" height="${F - FK.wallFoot + 40}" fill="#0D0C09"/>` +
    `<rect x="${s0 + 110}" y="${FK.ceil - 60}" width="26" height="${sy - 12 - FK.ceil + 60}" fill="#0D0C09"/><rect x="${s0 + 16}" y="${sy + 110}" width="60" height="10" fill="#FFB15C" opacity="${f1(0.5 * fire)}"/>`);
  s.push(e5bFire(dx0, dy0, dw, dh, t, 0.7 + 0.5 * flare) + `<rect x="${dx0}" y="${dy0}" width="${dw}" height="${dh}" fill="none" stroke="#0D0C09" stroke-width="5"/>`);
  const dwv = dw * Math.cos(door * Math.PI * 0.62); // the door leaf, foreshortened as it swings out toward us
  s.push(`<path d="M${dx0},${dy0 - 3} L${f1(dx0 + dwv)},${f1(dy0 - 3 - 8 * door)} L${f1(dx0 + dwv)},${f1(dy0 + dh + 3 + 8 * door)} L${dx0},${dy0 + dh + 3} Z" fill="#1A1A18" stroke="#0D0C09" stroke-width="3"/>`);
  const handle = [dx0 + dwv - 8 * Math.sign(dwv || 1), dy0 + dh / 2];
  s.push(`<circle cx="${f1(handle[0])}" cy="${f1(handle[1])}" r="5" fill="#3A3A36"/>`);
  if (flare > 0.05) for (let k = 0; k < 8; k++) { const p = ((t * 1.3 + k / 8) % 1); s.push(`<circle cx="${f1(dx0 + dw * 0.5 + 30 * Math.sin(k * 2.3 + t) * p)}" cy="${f1(dy0 - 10 - 120 * p)}" r="2" fill="#FFD27A" opacity="${f1(flare * door * (1 - p))}"/>`); }
  s.push(glowC(dx0 + dw / 2, dy0 + dh / 2, 520, 0.75 * heat, 'mswarm') + glowC(dx0 + dw / 2, dy0 + dh / 2, 160, 0.6 * heat, 'msglow') + glowC(s0 + 60, sy + 70, 300, 0.35 * fl, 'mswarm'));
  const kx = s0 + 46, ky = sy - 12;
  s.push(`<path d="M${kx - 30},${ky} q-4,-40 30,-44 q34,4 30,44 Z" fill="#141817"/><path d="M${kx - 18},${ky - 40} q18,-30 36,0" stroke="#141817" stroke-width="5" fill="none"/>` +
    MAT.smoke(kx + 30, ky - 46, t, {col: 'D9DEDA', k: 0.4, n: 6, rise: 140, drift: 30 + 40 * g, speed: 3.2, seed: 547}).replace(/opacity="([\d.]+)"/g, (m, a) => `opacity="${f1(Number(a) * 0.45 * 100) / 100}"`));
  // a bushel basket of ears by the stove
  const bx = CS.ox + 62;
  const basket = (MAT.shadow(bx + 40, F + 30, 60, 0.4) + `<path d="M${bx},${F + 28} L${bx - 8},${F - 50} L${bx + 88},${F - 50} L${bx + 80},${F + 28} Z" fill="#5A4430" stroke="#0D0C09" stroke-width="3"/>` + [0, 1, 2].map((k) => line([[bx - 4, F - 26 + k * 22], [bx + 84, F - 26 + k * 22]], '#3A2C1C', 3)).join('') +
    [[bx + 4, F - 56, -20], [bx + 24, F - 62, 10], [bx + 44, F - 58, -6], [bx + 30, F - 50, 24]].map(([x, y, a]) => e5bEar(x, y, a, 0.9)).join(''));
  // the table and lamp (the farm kitchen's), nobody at it tonight
  const [tx0, tx1] = FK.table;
  s.push(MAT.shadow((tx0 + tx1) / 2, F + 4, 170, 0.45) + `<rect x="${tx0}" y="${top}" width="${tx1 - tx0}" height="14" fill="#2B2418"/><rect x="${tx0 + 14}" y="${top + 14}" width="12" height="${F - top - 14}" fill="#0D0C09"/><rect x="${tx1 - 26}" y="${top + 14}" width="12" height="${F - top - 14}" fill="#0D0C09"/>` +
    [0, 1, 2, 3].map((i) => `<rect x="${1146 + (i % 2) * 6}" y="${top - 3 - i * 3}" width="70" height="3" fill="#E3DAC4"/>`).join('') + e5Lamp(lampX, top, t * (1 + 0.3 * g), 1.05, 2), basket);
  // ---- Owen: an armful of ears in the crook of his far arm; opens the door; feeds them in one by one; shuts it; warms his hands ----
  const OWEN = {kind: 'man', hat: 'none', coat: 'vest', beard: true, fill: E5.coral, tones: MICHAEL_TONES};
  const rim = {c: '#FFC27A', a: Math.min(1, lod.rimA * 0.5 + 0.7 * heat), dx: 0.012, dy: -0.004};
  let ow = e5Standing({...OWEN, x: CS.ox, h: H, d: -1, det, rim}, CS.ox, F, t, 0.2, 'cs.owen', {lean: 9, tilt: -16 + 6 * door, expr: 'set', blink: (t + 1.2) % 4.1 < 0.12});
  const arm = E3K.toWorld(ow, 0.1, 0.6), left = Math.max(0, 3 - CS.feeds.filter((f) => t > f + 1.2).length); // ears still in his arm
  ow = reach(ow, 'b', arm[0], arm[1], 'cs.owen.armful');
  const mouth = [dx0 + dw * 0.55, dy0 + dh * 0.5], rest = [dx0 + dw + 30, dy0 + dh + 20];
  let earIn = null;
  const fi = CS.feeds.findIndex((f) => t > f && t < f + 2.0);
  if (t < CS.open[0] - 0.4) ow = e3Move(ow, 'f', rest[0], rest[1], 'cs.owen.rest');
  else if (t < CS.open[1] + 0.3) { const k = smooth(CS.open[0] - 0.4, CS.open[0], t); ow = k < 1 ? e3Move(ow, 'f', lerp(rest[0], handle[0], k), lerp(rest[1], handle[1], k), 'cs.owen.toHandle') : reach(ow, 'f', handle[0], handle[1], 'cs.owen.handle'); }
  else if (fi >= 0) { const u = t - CS.feeds[fi], A = [arm[0] + 6, arm[1] - 8], B = mouth;
    if (u < 0.5) ow = e3Move(ow, 'f', lerp(rest[0], A[0], ease(u / 0.5)), lerp(rest[1], A[1], ease(u / 0.5)), 'cs.owen.toArm');
    else if (u < 1.3) { const k = ease((u - 0.5) / 0.8); ow = e3Move(ow, 'f', lerp(A[0], B[0], k), lerp(A[1], B[1], k), 'cs.owen.carry'); earIn = 1; }
    else if (u < 1.5) { ow = reach(ow, 'f', B[0], B[1], 'cs.owen.feed'); earIn = 1 - (u - 1.3) / 0.2; }
    else ow = e3Move(ow, 'f', lerp(B[0], rest[0], ease((u - 1.5) / 0.5)), lerp(B[1], rest[1], ease((u - 1.5) / 0.5)), 'cs.owen.back'); }
  else if (t > CS.close[0] - 0.4 && t < CS.warm) { const k = smooth(CS.close[0] - 0.4, CS.close[0], t); ow = k < 1 ? e3Move(ow, 'f', lerp(rest[0], handle[0], k), lerp(rest[1], handle[1], k), 'cs.owen.toHandle2') : reach(ow, 'f', handle[0], handle[1], 'cs.owen.handle2'); }
  else if (t >= CS.warm) { const k = smooth(CS.warm, CS.warm + 0.6, t), wp = [s1 + 10 + 4 * Math.sin(t * 5) * k, sy - 40]; ow = e3Move(ow, 'f', lerp(handle[0], wp[0], k), lerp(handle[1], wp[1], k), 'cs.owen.warm');
    ow = e3Move(ow, 'b', lerp(arm[0], wp[0] + 20, k), lerp(arm[1], wp[1] + 8, k), 'cs.owen.warm2'); }
  else ow = e3Move(ow, 'f', rest[0], rest[1], 'cs.owen.rest');
  const armful = t < CS.warm ? [...Array(left + (fi >= 0 && (t - CS.feeds[fi]) < 0.5 ? 0 : 0)).keys()].map((k) => e5bEar(arm[0] - 34 + k * 6, arm[1] + 4 - k * 8, -14 + k * 10, 1)).join('') : '';
  const held = earIn != null && earIn > 0 ? holding(ow, 'f', 'cs.owen.ear', (gx, gy, ang) => `<g opacity="${f1(earIn)}">${e5bEar(gx - 6, gy, 180 + 10, 1)}</g>`) : '';
  s.push(e5Bed(t), e4Outlined(ow), armful, held, glowC(dx0 + dw / 2, dy0 + dh / 2, 420, 0.35 * heat, 'mswarm'), room.front);
  const world = layerAt(c, 1, s.join(''));
  const scr = o.quiet ? '' : tag(130, 120, 'NEAR O\'NEILL, NEBRASKA · WINTER 1890', smooth(0.3, 0.7, t) * (1 - smooth(3.6, 4.0, t)));
  return frame(e5Defs(t, `<clipPath id="fkroom"><rect x="${FK.x0}" y="0" width="${FK.x1 - FK.x0}" height="1200"/></clipPath><clipPath id="fkwin"><rect x="${FK.win[0]}" y="430" width="${FK.win[1] - FK.win[0]}" height="130"/></clipPath><radialGradient id="kfcold"><stop offset="0" stop-color="#CFE0DE" stop-opacity="0.35"/><stop offset="1" stop-color="#CFE0DE" stop-opacity="0"/></radialGradient>`), `<rect width="1920" height="1080" fill="#070605"/>`, world, scr, t);
}
if (typeof window !== 'undefined') Object.assign(window, {renderE5CornStove});
Object.assign(CLIPS, {ep5_corn_stove: {sec: CS.sec, render: (t) => renderE5CornStove(t)}});

/* ================= ep5_coxey (ch 8, 15.5 s, two shots): Coxey's Army reaches the Capitol, May 1, 1894 ================= */
// Shot A (0 to 6.5): Pennsylvania Avenue on a spring morning, the Capitol dome on its hill at the end of the street. The column of
// marchers (ink) walks right toward it with cloth banners on poles; at its head a white horse, led by the bridle. Shot B (6.5 to
// 15.5): the Capitol steps and lawn. Coxey (ink, bowler, faceless) climbs the steps and lifts his speech; two police (ink, helmets)
// come to him, one up from the lawn and one down from the terrace, take him by the arms and walk him back down and off the grass,
// past a small KEEP OFF THE GRASS sign in the foreground. Nobody is pushed or struck.
const CX = {sec: 15.5, cut: 6.5, H: 370, G: 990, TX0: 1000, rise: 30, climb: [6.8, 9.9], speak: 10.3, copN: [8.0, 11.3], copF: [9.8, 11.5], grip: [11.9, 12.3], down: 12.5};
CX.R = Math.sin(22 * Math.PI / 180) * CX.H; // one step of the walk = one tread
// two treads, a landing three steps deep (where Coxey stops), three more treads to the terrace
const cxGround = (x) => { const i = Math.floor((x - CX.TX0) / CX.R); return x < CX.TX0 ? CX.G : i < 2 ? CX.G - CX.rise * (i + 1) : i < 5 ? CX.G - 3 * CX.rise : CX.G - CX.rise * (Math.min(i, 7) - 1); };
const e5bHelmet = (fo) => { const [hx, hy] = E3K.toWorld(fo, 0.005, 0.985), w = 0.085 * fo.h; return `<path d="M${f1(hx - w * 0.62)},${f1(hy + w * 0.12)} Q${f1(hx - w * 0.55)},${f1(hy - w * 1.15)} ${f1(hx)},${f1(hy - w * 1.2)} Q${f1(hx + w * 0.55)},${f1(hy - w * 1.15)} ${f1(hx + w * 0.62)},${f1(hy + w * 0.12)} Z" fill="${fo.fill}"/><rect x="${f1(hx - w * 0.75)}" y="${f1(hy + w * 0.02)}" width="${f1(w * 1.5)}" height="${f1(w * 0.18)}" fill="${fo.fill}"/><circle cx="${f1(hx)}" cy="${f1(hy - w * 1.24)}" r="${f1(w * 0.12)}" fill="${fo.fill}"/><circle cx="${f1(hx + (fo.d ?? 1) * w * 0.3)}" cy="${f1(hy - w * 0.45)}" r="${f1(w * 0.12)}" fill="#C9C2A8" opacity="0.8"/>`; };
function e5bCapitol(cx, gy, k, col) { // the dome on its drum over the central block and wings (a silhouette), cx = the dome's axis
  const X = (u) => cx + u * k, Y = (v) => gy - v * k, s = [];
  s.push(`<rect x="${X(-560)}" y="${Y(120)}" width="${1120 * k}" height="${120 * k}" fill="${col}"/><rect x="${X(-180)}" y="${Y(190)}" width="${360 * k}" height="${80 * k}" fill="${col}"/><path d="M${X(-120)},${Y(190)} L${X(0)},${Y(230)} L${X(120)},${Y(190)} Z" fill="${col}"/>`);
  s.push(`<rect x="${X(-120)}" y="${Y(300)}" width="${240 * k}" height="${110 * k}" fill="${col}"/><rect x="${X(-138)}" y="${Y(312)}" width="${276 * k}" height="${14 * k}" fill="${col}"/>` + [...Array(13).keys()].map((i) => `<rect x="${X(-112 + i * 18.5)}" y="${Y(296)}" width="${6 * k}" height="${100 * k}" fill="#000" opacity="0.12"/>`).join(''));
  s.push(`<rect x="${X(-96)}" y="${Y(360)}" width="${192 * k}" height="${50 * k}" fill="${col}"/><path d="M${X(-96)},${Y(360)} Q${X(-92)},${Y(470)} ${X(0)},${Y(480)} Q${X(92)},${Y(470)} ${X(96)},${Y(360)} Z" fill="${col}"/>`);
  s.push(`<rect x="${X(-16)}" y="${Y(530)}" width="${32 * k}" height="${52 * k}" fill="${col}"/><path d="M${X(-18)},${Y(530)} Q${X(0)},${Y(552)} ${X(18)},${Y(530)} Z" fill="${col}"/><rect x="${X(-3)}" y="${Y(580)}" width="${6 * k}" height="${28 * k}" fill="${col}"/>`);
  return s.join('');
}
const e5bTree = (x, gy, h, col, seed) => { const r = rng(seed); return `<rect x="${f1(x - 0.03 * h)}" y="${f1(gy - h * 0.55)}" width="${f1(0.06 * h)}" height="${f1(h * 0.55)}" fill="#1E2420"/>` + [...Array(6).keys()].map(() => `<circle cx="${f1(x + (r() - 0.5) * h * 0.5)}" cy="${f1(gy - h * (0.6 + r() * 0.35))}" r="${f1(h * (0.16 + r() * 0.12))}" fill="${col}"/>`).join(''); };
// a cloth banner on a pole carried in both hands (plain stripes, no lettering); returns {fo, svg}
function e5bBanner(fo, t, name, ph = 0) {
  const d = fo.d ?? 1, [px, py] = E3K.toWorld(fo, 0.1, 0.55), top = [px + d * 10, py - 0.95 * fo.h], sway = 4 * Math.sin(t * 1.7 + ph);
  let o = reach(fo, 'f', px + d * 4, py - 0.02 * fo.h, name + '.pole'); o = reach(o, 'b', lerp(px, top[0], 0.2), lerp(py, top[1], 0.2) + 0.04 * fo.h, name + '.pole2');
  const w = 0.62 * fo.h, hh = 0.32 * fo.h, cx0 = top[0], cy0 = top[1] + 6;
  const cloth = `<path d="M${f1(cx0)},${f1(cy0)} L${f1(cx0 - d * w)},${f1(cy0 + sway)} L${f1(cx0 - d * w + 3 * Math.sin(t * 2.3 + ph))},${f1(cy0 + hh + sway)} Q${f1(cx0 - d * w / 2)},${f1(cy0 + hh + 8 + sway)} ${f1(cx0)},${f1(cy0 + hh)} Z" fill="#E9E2CC" stroke="#0D0C09" stroke-width="3"/>` +
    [0.3, 0.7].map((v) => line([[cx0, cy0 + hh * v], [cx0 - d * w, cy0 + hh * v + sway]], '#7A4A3E', 5, 'opacity="0.75"')).join('');
  return {fo: o, svg: line([[px + d * 2, py + 0.12 * fo.h], top], '#2A1E12', 5) + cloth};
}
function e5bCoxeyA(t) {
  const {H} = CX, G = 960, v = 62, c = cam2(camAt([[0, 1.0, 820, 560], [CX.cut, 1.06, 820 + v * CX.cut * 0.9, 570]], t)), s = [];
  s.push(`<rect x="-2000" y="-600" width="6000" height="2200" fill="url(#cxsky)"/>`);
  s.push(layerAt(c, 0.3, e5bCapitol(1500, 690, 0.9, '#8EA09C') + `<rect x="-1500" y="680" width="5000" height="300" fill="#8EA09C"/>`));
  const far = [], r = rng(611);
  for (let k = 0; k < 16; k++) { const x = -800 + k * 260; far.push(e5bTree(x, 900, 360 + 80 * r(), '#6E8478', 700 + k)); }
  for (let k = 0; k < 6; k++) { const x = -500 + k * 520; far.push(`<rect x="${x}" y="${700}" width="6" height="200" fill="#2A2E2B"/><rect x="${x - 10}" y="690" width="26" height="22" fill="#2A2E2B"/>`); }
  s.push(layerAt(c, 0.7, far.join('') + `<rect x="-1500" y="900" width="5000" height="30" fill="#A9B2AA"/>`));
  const w = [`<rect x="-1500" y="910" width="5000" height="400" fill="#8A8E84"/><rect x="-1500" y="910" width="5000" height="400" fill="url(#matFloorShade)" opacity="0.5"/>`];
  // the column: far row (lighter, smaller) and near row; the white horse at the head led by a man at the bridle
  const head = 860 + v * t, farRow = [], nearRow = [], hats = ['cap', 'bowler', 'cap', 'cap', 'none', 'bowler'], coats = ['jacket', 'sack', 'jacket', 'frock'];
  const walker = (x0, gy, h, k, fill, tones, name) => e4Walk({kind: 'man', hat: hats[k % 6], coat: coats[k % 4], beard: k % 5 === 2, h, d: 1, x: 0, y: gy, fill, det: 0, tones, rim: {c: '#F4EFE6', a: 0.35, dx: 0.008, dy: -0.006}}, x0, 1, v * t + 37 * k, gy, name);
  for (let k = 0; k < 12; k++) { let fo = walker(head - 320 - k * 96 - 37 * k + 30, G - 28, H * 0.86, k + 3, '#2C2F2A', {tone: '#383B35', lite: '#464A42'}, `cx.f${k}`);
    if (k === 3 || k === 8) { const b = e5bBanner(fo, t, `cx.fb${k}`, k); farRow.push(b.svg + fig(b.fo)); } else farRow.push(fig(fo)); }
  for (let k = 0; k < 11; k++) { const x0 = head - 260 - k * 104 - 37 * k; let fo = walker(x0, G, H, k, '#0D0C09', {tone: '#25231D', lite: '#3A3730'}, `cx.n${k}`);
    if (k === 0) fo = {...fo, hat: 'bowler', coat: 'frock'};
    if (k === 2 || k === 6 || k === 9) { const b = e5bBanner(fo, t, `cx.nb${k}`, k * 2); nearRow.push(b.svg + fig(b.fo)); } else nearRow.push(fig(fo)); }
  const horse = e4Horse(head - 60, G - 14, H * 1.0, '#E6E1D3', v * t, {dir: 1, gait: 'walk'});
  let lead = e4Walk({kind: 'man', hat: 'cap', coat: 'jacket', h: H, d: 1, x: 0, y: G, fill: '#0D0C09', det: 0, tones: {tone: '#25231D', lite: '#3A3730'}}, head + 10, 1, v * t, G, 'cx.lead');
  lead = reach(lead, 'b', horse.mouth[0] - 6, horse.mouth[1] + 8, 'cx.lead.bridle');
  w.push(farRow.join(''), `<g>${horse.svg}</g>`, nearRow.join(''), fig(lead) + line([[horse.mouth[0], horse.mouth[1]], [E3K.hand(lead, 'b').x, E3K.hand(lead, 'b').y]], '#3A2C1C', 2));
  s.push(layerAt(c, 1, w.join('')));
  return {world: s.join(''), scr: tag(130, 120, 'WASHINGTON, D.C. · MAY 1, 1894', smooth(0.3, 0.7, t) * (1 - smooth(3.8, 4.2, t)))};
}
function e5bCoxeyB(t) {
  const {H, G, TX0, R, rise} = CX, c = cam2(camAt([[CX.cut, 1.08, 1120, 680], [CX.down, 1.14, 1120, 690], [CX.sec, 1.14, 960, 690]], t)), s = [];
  s.push(`<rect x="-2000" y="-600" width="6000" height="2200" fill="url(#cxsky)"/>`);
  // the Capitol's west front: a rusticated terrace wall and the columns above, the dome cut off at the top
  const top = G - 6 * rise, wx = TX0 + 6 * R;
  s.push(layerAt(c, 0.85, `<rect x="${wx - 200}" y="80" width="2400" height="${top - 80}" fill="#B9BDB2"/>` + [...Array(12).keys()].map((i) => `<rect x="${wx - 150 + i * 120}" y="150" width="44" height="${top - 290}" fill="#D4D6CC"/><rect x="${wx - 160 + i * 120}" y="140" width="64" height="16" fill="#9EA398"/>`).join('') + `<rect x="${wx - 200}" y="${top - 140}" width="2400" height="140" fill="#9EA398"/>` + [...Array(4).keys()].map((k) => `<rect x="${wx - 200}" y="${top - 140 + k * 35}" width="2400" height="2" fill="#7E8378"/>`).join('')));
  // the lawn and the walk, a crowd far off on the left behind a rope
  const crowd = [], r = rng(631);
  for (let k = 0; k < 26; k++) { const x = -700 + k * 44 + r() * 20, h = 170 + 30 * r(); crowd.push(figure({kind: 'man', hat: ['cap', 'bowler', 'none'][k % 3], coat: 'jacket', x, y: 905, h, d: 1, fill: '#3E4A44', det: 0, tones: {tone: '#4A564F', lite: '#566259'}, an: {...POSES.stand(t, r()), tilt: 6 * Math.sin(t * 0.7 + k)}})); }
  s.push(layerAt(c, 1, `<rect x="-2000" y="880" width="5000" height="400" fill="#71876A"/>` + crowd.join('') + line([[-800, 880], [500, 880]], '#2A2E2B', 2) + [...Array(8).keys()].map((k) => `<rect x="${-780 + k * 180}" y="852" width="5" height="30" fill="#2A2E2B"/>`).join('') +
    `<rect x="-2000" y="905" width="5000" height="400" fill="#7C9474"/><rect x="${TX0 - 520}" y="${G - 4}" width="520" height="16" fill="#C9C6B8"/>`));
  // the steps (treads one walk step deep), the landing and the terrace
  const st = [];
  for (let i = 0; i < 9; i++) { if (i === 3 || i === 4) continue; const x = TX0 + i * R, y = cxGround(x + 1); st.push(`<rect x="${f1(x)}" y="${y}" width="${f1((9 - i) * R + 600)}" height="${G - y + 2}" fill="${i % 2 ? '#CFCFC4' : '#C5C6BA'}"/><rect x="${f1(x)}" y="${y}" width="${f1((9 - i) * R + 600)}" height="3" fill="#F2F1EA"/>`); }
  // ---- Coxey: up to the landing; lifts his speech; the police come, one up from the lawn, one down from the terrace; then the three
  // walk back down and off the grass, a policeman at each arm ----
  const ink = {fill: '#0D0C09', det: 0, tones: {tone: '#25231D', lite: '#3A3730'}, rim: {c: '#F4EFE6', a: 0.4, dx: -0.008, dy: -0.006}};
  const COX = {...ink, kind: 'man', hat: 'bowler', coat: 'frock', h: H, beard: false};
  const COP = {...ink, kind: 'man', hat: 'none', coat: 'frock', h: H * 1.03};
  const walkOn = (base, x0, dir, s0, name) => stepWalk({...base, d: dir, x: 0, y: 0, an: {...(base.an || {})}}, x0, dir, s0, cxGround, name);
  // walk S px from x0 between t0 and t1, then settle (e3Settle) and stand
  const leg = (base, x0, dir, S, t0, t1, name) => { if (t < t1) return walkOn(base, x0, dir, Math.max(0.001, S * e3Trap(t, t0, t1, 0.15)), name);
    const n0 = E3LOG.length, arr = walkOn(base, x0, dir, S, name); E3LOG.length = n0; const o = e3Settle({...arr, floorY: undefined}, smooth(t1, t1 + 0.35, t), name + '.settle');
    return {...o, an: {...o.an, ...POSES.stand(t, 0.4), legs: o.an.legs, shins: o.an.shins, lean: 0, bob: 0}}; };
  const fin = {cox: TX0 + 3.4 * R, n: TX0 + 2.4 * R, f: TX0 + 4.4 * R}, vD = 126, sD = 0.5 * R + vD * Math.max(0, t - CX.down);
  let cox, copN, copF;
  if (t < CX.down) {
    cox = leg(COX, fin.cox - 6.5 * R, 1, 6.5 * R, CX.climb[0], CX.climb[1], 'cx.cox');
    const up = smooth(CX.speak, CX.speak + 0.5, t) * (1 - smooth(CX.grip[0] - 0.4, CX.grip[0], t)); if (up > 0) cox = {...cox, an: {...cox.an, fArm: [lerp(176, 40, up), lerp(180, 20, up)], tilt: 6 * up}};
    copN = leg(COP, fin.n - 6.5 * R, 1, 6.5 * R, CX.copN[0], CX.copN[1], 'cx.copN');
    copF = leg({...COP, h: H}, fin.f + 4.5 * R, -1, 4.5 * R, CX.copF[0], CX.copF[1], 'cx.copF');
  } else { cox = walkOn(COX, fin.cox + 0.5 * R, -1, sD, 'cx.cox.down'); copN = walkOn(COP, fin.n + 0.5 * R, -1, sD, 'cx.copN.down'); copF = walkOn({...COP, h: H}, fin.f + 0.5 * R, -1, sD, 'cx.copF.down'); }
  // the grip: each takes an arm above the elbow
  const g = smooth(CX.grip[0], CX.grip[1], t);
  if (g > 0) { const dn = t >= CX.down, aN = E3K.toWorld(cox, dn ? 0.03 : -0.03, 0.63), aF = E3K.toWorld(cox, dn ? -0.03 : 0.03, 0.64), wN = dn ? 'b' : 'f';
    if (g < 1) { const hN = E3K.hand(copN, wN), hF = E3K.hand(copF, 'f'); copN = e3Move(copN, wN, lerp(hN.x, aN[0], g), lerp(hN.y, aN[1], g), 'cx.copN.to'); copF = e3Move(copF, 'f', lerp(hF.x, aF[0], g), lerp(hF.y, aF[1], g), 'cx.copF.to'); }
    else { copN = reach(copN, wN, aN[0], aN[1], 'cx.copN.arm'); copF = reach(copF, 'f', aF[0], aF[1], 'cx.copF.arm'); } }
  const paper = t > CX.speak - 0.2 && t < CX.down ? holding(cox, 'f', 'cx.speech', (gx, gy) => `<rect x="${f1(gx - 4)}" y="${f1(gy - 30)}" width="22" height="30" fill="#EFE7D2" stroke="#0D0C09" stroke-width="2" transform="rotate(-10, ${f1(gx)}, ${f1(gy)})"/>`) : '';
  const w = [st.join(''), fig(copF) + e5bHelmet(copF), fig(cox), paper, fig(copN) + e5bHelmet(copN)];
  // the sign in the foreground, on a stake in the grass
  const sx = 430, sy = 1010;
  w.push(`<rect x="${sx - 4}" y="${sy - 70}" width="8" height="110" fill="#3A2C1C"/><rect x="${sx - 92}" y="${sy - 128}" width="184" height="66" fill="#F1ECDD" stroke="#0D0C09" stroke-width="4"/>` +
    `<text x="${sx}" y="${sy - 101}" font-family="Mono" font-size="22" text-anchor="middle" fill="#0D0C09">KEEP OFF</text><text x="${sx}" y="${sy - 74}" font-family="Mono" font-size="22" text-anchor="middle" fill="#0D0C09">THE GRASS</text>` +
    [...Array(18).keys()].map((k) => line([[sx - 140 + k * 16, sy + 44], [sx - 136 + k * 16 + 4 * Math.sin(t * 2 + k), sy + 26]], '#55704E', 3)).join(''));
  s.push(layerAt(c, 1, w.join('')));
  return {world: s.join(''), scr: ''};
}
function renderE5Coxey(t) {
  const sh = t < CX.cut ? e5bCoxeyA(t) : e5bCoxeyB(t);
  return frame(e5Defs(t, grad('cxsky', [['0', '#A9BCC0'], ['1', '#E2E6DE']])), `<rect width="1920" height="1080" fill="#C9D2CE"/>`, sh.world, sh.scr, t);
}
if (typeof window !== 'undefined') Object.assign(window, {renderE5Coxey});
Object.assign(CLIPS, {ep5_coxey: {sec: CX.sec, render: (t) => renderE5Coxey(t)}});
