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
