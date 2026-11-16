// Episode 5 (the finale: labor unions and the Populists), drawn silhouette scenes. Load after ep4_b.js: the same look and the same
// helpers (rig.js figure/cast/walkAn, ep3.js contacts E3K / E3LOG with reach, sitOn, holding, e3Stand, e3Settle; ep4.js e4Track,
// e4Walk, e4Speak, e4Keys, e4Val, e4Bump, e4Snow; ep4_b.js e4Outlined; mansion.js glowC; ep2_more.js camAt).
//
//   ep5_union_meeting  A back room over a saloon, Brooklyn, 1886: a Knights of Labor assembly by lamplight. Michael Kelly signs up.
//   ep5_homestead_dawn Homestead, Pennsylvania, July 6, 1892, before dawn: the Pinkerton barges come up the Monongahela in mist.
//   ep5_farm_kitchen   A sod house on the plains, winter evening, about 1890: Ma's brother writes a letter beside the mortgage papers.
//
// Colour rules (the user's): the Kellys coral #FF6F61 only (always with an ink outline, e4Outlined); the Rabinowitzes wheat gold;
// everyone else ink; money only a small gold glint. Real people never get faces. Violence and fire on people stay off-screen
// (glow, smoke, distant flashes); nobody is shown hurt. No em dashes anywhere.

const E5 = {...E4, lamp: '#FFD9A0', mist: '#9FB0B4'};

/* ---------------- shared helpers ---------------- */
// defs: the Ep 3/4 base (grain, vignette, warm glows, flwp, materials) plus smoke puffs, mist and a warm lamp glow
function e5Defs(t, extra = '') {
  const puffs = ['4A4440', '6A625C', '8C9A9C', 'B8C4C4', 'D9DEDA', '3A3633', 'A0582E'].map((cc) => `<radialGradient id="puff${cc}"><stop offset="0" stop-color="#${cc}" stop-opacity="1"/><stop offset="0.55" stop-color="#${cc}" stop-opacity="0.7"/><stop offset="1" stop-color="#${cc}" stop-opacity="0"/></radialGradient>`).join('');
  return e3Defs2(t).replace('</defs>', puffs +
    `<radialGradient id="e5lamp"><stop offset="0" stop-color="#FFD9A0" stop-opacity="0.5"/><stop offset="0.35" stop-color="#FFC27A" stop-opacity="0.18"/><stop offset="1" stop-color="#FFC27A" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="e5lant"><stop offset="0" stop-color="#FFD08A" stop-opacity="0.75"/><stop offset="0.3" stop-color="#FFB45C" stop-opacity="0.25"/><stop offset="1" stop-color="#FFB45C" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="e5flash"><stop offset="0" stop-color="#FFF4D8" stop-opacity="1"/><stop offset="0.3" stop-color="#FFC060" stop-opacity="0.6"/><stop offset="1" stop-color="#FF9A40" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="e5mist"><stop offset="0" stop-color="#B7C3C4" stop-opacity="0.55"/><stop offset="0.6" stop-color="#A9B7B8" stop-opacity="0.2"/><stop offset="1" stop-color="#A9B7B8" stop-opacity="0"/></radialGradient>` +
    `<filter id="e5blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>` + extra + '</defs>');
}
// lamp flicker (0.85 .. 1.05), seeded so two lamps don't pulse together
const e5Flick = (t, s = 0) => 0.92 + 0.05 * Math.sin(t * 8.3 + s) + 0.04 * Math.sin(t * 13.9 + 2 * s) + 0.02 * Math.sin(t * 23.1 + s);
// a kerosene table lamp standing on a surface at (x, y): base, font, glass chimney, flame, and its glow
function e5Lamp(x, y, t, k = 1, s = 0) {
  const fl = e5Flick(t, s), wob = 1.2 * Math.sin(t * 9.7 + s);
  return `<path d="M${x - 22 * k},${y} l6,-10 l32,0 l6,10 Z" fill="#0D0C09"/><rect x="${x - 5 * k}" y="${y - 30 * k}" width="${10 * k}" height="${20 * k}" fill="#0D0C09"/>` +
    `<ellipse cx="${x}" cy="${y - 42 * k}" rx="${20 * k}" ry="${14 * k}" fill="#1A140D"/><rect x="${x - 12 * k}" y="${y - 58 * k}" width="${24 * k}" height="${6 * k}" fill="#0D0C09"/>` +
    `<path d="M${x - 9 * k},${y - 58 * k} q-6,-14 0,-24 l0,-26 l18,0 l0,26 q6,10 0,24 Z" fill="#FFE9C4" opacity="0.32"/>` +
    `<path d="M${x + wob * 0.4},${y - 90 * k} q-6,10 0,${18 * k} q6,-8 0,-${18 * k} Z" fill="#FFF3D6" opacity="${f1(0.85 * fl * 100) / 100}"/>` +
    glowC(x, y - 76 * k, 140 * k, 0.55 * fl, 'msglow') + glowC(x, y - 76 * k, 640 * k, 0.75 * fl, 'e5lamp');
}
// an ink figure's options with the lamp's rim on the side toward the light
function e5Ink(base, lod, lampX, fl = 1) { const x = base.x ?? 0;
  return {fill: E5.ink, det: Math.min(lod.det, 0.6), tones: {tone: '#25231D', lite: '#3A3730'}, ...base, rim: {c: '#FFE6C0', a: lod.rimA * (0.4 + 0.45 * Math.exp(-Math.abs(x - lampX) / 700)) * fl, dx: x > lampX ? -0.008 : 0.008, dy: -0.006}}; }
// a plank bench seen side on: seat top at seatY, legs to floorY
const e5Bench = (x0, x1, seatY, floorY, col = '#120D08') => MAT.shadow((x0 + x1) / 2, floorY + 2, (x1 - x0) * 0.55, 0.4) + `<rect x="${x0}" y="${seatY}" width="${x1 - x0}" height="12" fill="${col}"/><rect x="${x0}" y="${seatY}" width="${x1 - x0}" height="2" fill="#FFE6C0" opacity="0.16"/>` +
  [x0 + 16, x1 - 28].map((lx) => `<rect x="${lx}" y="${seatY + 12}" width="12" height="${floorY - seatY - 12}" fill="${col}"/>`).join('');
// a man seated on a bench (feet on the floor), with the sit pose's small breathing and his own tilt
function e5Sit(base, x, seatY, floorY, t, ph, name, an = {}) {
  const fo = sitOn({...base, x, y: 0, an: {...POSES.sit(t, ph), tilt: 3 * Math.sin(t * 0.45 + ph * 6), blink: (t + ph * 7) % 4.2 < 0.12, ...an}}, seatY, floorY, 0.2, name);
  if (an.fArm) return fo; // keyed arms: the caller places the hands
  const kf = E3K.toWorld(fo, 0.17, 0.5), kb = E3K.toWorld(fo, 0.12, 0.51); // hands resting on the thighs
  return reach(reach(fo, 'f', kf[0], kf[1], name + '.knee'), 'b', kb[0], kb[1], name + '.knee2');
}
// a standing figure planted at x (both feet on the floor), the stand pose's sway
function e5Standing(base, x, G, t, ph, name, an = {}) {
  return e3Stand({...base, x, y: G, floorY: G, an: {...POSES.stand(t, ph), tilt: 3 * Math.sin(t * 0.4 + ph * 5), ...an}}, x, x, 0, name);
}
// a hand going up (a show of hands): u 0..1 from the arm's rest to straight up
function e5Raise(fo, u, rest) { const r = rest || (fo.an && fo.an.fArm) || [176, 180]; return {...fo, an: {...fo.an, fArm: [lerp(r[0], 10, ease(u)), lerp(r[1], 4, ease(u))]}}; }
// a pen held in the hand and its nib on the paper
const e5Pen = (fo, name) => holding(fo, 'f', name, (gx, gy) => line([[gx, gy], [gx + 7 * (fo.d ?? 1), gy + 20]], '#0D0C09', 2.4) + line([[gx - 2 * (fo.d ?? 1), gy], [gx - 9 * (fo.d ?? 1), gy - 20]], '#E9E0C8', 1.4, 'opacity="0.8"'));
// a hand lantern hanging from a grip: bail, cap, lit globe, base; its glow
function e5Lantern(gx, gy, t, s = 0, k = 1) {
  const sw = 7 * Math.sin(t * 1.9 + s), fl = e5Flick(t, s), a = sw * Math.PI / 180, cx = gx + Math.sin(a) * 26 * k, cy = gy + Math.cos(a) * 26 * k;
  return `<g transform="rotate(${f1(-sw)}, ${f1(gx)}, ${f1(gy)})">` + line([[gx, gy], [gx - 8 * k, gy + 12 * k]], '#0D0C09', 1.6 * k) + line([[gx, gy], [gx + 8 * k, gy + 12 * k]], '#0D0C09', 1.6 * k) +
    `<rect x="${f1(gx - 7 * k)}" y="${f1(gy + 12 * k)}" width="${f1(14 * k)}" height="${f1(5 * k)}" fill="#0D0C09"/><rect x="${f1(gx - 6 * k)}" y="${f1(gy + 17 * k)}" width="${f1(12 * k)}" height="${f1(15 * k)}" rx="${f1(4 * k)}" fill="#FFD08A" opacity="${f1(0.9 * fl * 100) / 100}"/>` +
    line([[gx, gy + 17 * k], [gx, gy + 32 * k]], '#0D0C09', 1.2 * k) + `<rect x="${f1(gx - 8 * k)}" y="${f1(gy + 32 * k)}" width="${f1(16 * k)}" height="${f1(5 * k)}" fill="#0D0C09"/></g>` +
    glowC(cx, cy, 34 * k, 0.6 * fl, 'msglow') + glowC(cx, cy, 170 * k, 0.55 * fl, 'e5lant');
}
// slow drifting mist: soft blurred bands between y0 and y1, drifting at speed px/s (world space)
function e5Mist(t, x0, x1, y0, y1, {n = 14, seed = 5, speed = 9, op = 0.5, h = 60} = {}) {
  const r = rng(seed), s = [], W = x1 - x0;
  for (let i = 0; i < n; i++) { const y = y0 + (y1 - y0) * r(), w = 300 + 520 * r(), sp = speed * (0.6 + 0.8 * r()), x = x0 + (((r() * W + t * sp) % (W + w)) + W + w) % (W + w) - w / 2;
    const breathe = 0.75 + 0.25 * Math.sin(t * 0.3 + i * 1.7);
    s.push(`<ellipse cx="${f1(x)}" cy="${f1(y + 6 * Math.sin(t * 0.2 + i))}" rx="${f1(w / 2)}" ry="${f1(h * (0.6 + 0.6 * r()))}" fill="url(#e5mist)" opacity="${f1(op * breathe * 100) / 100}"/>`); }
  return `<g filter="url(#e5blur)">${s.join('')}</g>`;
}

/* ================= ep5_union_meeting: a Knights of Labor assembly over a saloon, Brooklyn, 1886 (16 s) ================= */
// A back room upstairs, night, a kerosene lamp on the table. The speaker (ink) stands behind the table and talks; a secretary sits at
// the table's end with the roll book; about a dozen men listen on two benches and standing at the back by the door. A man at the
// window draws the curtain an inch to look down at the street for the boss's spotters, lets it fall, and turns back. On the wall a
// Knights of Labor banner (a fringed cloth, the emblem as a shape, no lettering). The speaker asks for names; hands go up; Michael
// Kelly (coral, by the door) looks at them, then raises his own; the speaker nods to him; the secretary writes.
// Scale: a man 380 px. Floors: back bench 958, front bench 1012, standing at the back 980, speaker 975.
const UM = {sec: 16, x0: 140, x1: 1800, ceil: 170, wallFoot: 930, F: 1040, H: 380, win: [250, 380], door: [1665, 1785], lampX: 886, table: [560, 920],
  ask: 8.6, up1: 9.2, up2: 9.5, look: 9.7, kup: 10.3, nod: 10.9, write: [11.2, 13.6], down: 13.2};
UM.top = 975 - 0.43 * UM.H;
function e5MeetRoom(t) {
  const {x0, x1, ceil, wallFoot, F} = UM, b = [], r = rng(511), fl = e5Flick(t);
  b.push(`<rect x="-1500" y="-1200" width="5000" height="3600" fill="#060505"/>`);
  b.push(`<rect x="${x0}" y="${ceil}" width="${x1 - x0}" height="${wallFoot - ceil}" fill="#2A241A"/><rect x="${x0}" y="${ceil}" width="${x1 - x0}" height="${wallFoot - ceil}" fill="url(#flwp)" opacity="0.05"/>`);
  // stained plaster: blotches, a crack, soot along the ceiling
  for (let k = 0; k < 14; k++) b.push(`<ellipse cx="${f1(x0 + r() * (x1 - x0))}" cy="${f1(ceil + 60 + r() * 500)}" rx="${f1(30 + r() * 90)}" ry="${f1(20 + r() * 60)}" fill="#1A150F" opacity="${f1(0.15 + 0.2 * r())}"/>`);
  b.push(line([[1210, ceil + 40], [1226, ceil + 120], [1214, ceil + 190], [1236, ceil + 260]], '#15110B', 2, 'opacity="0.7"'));
  b.push(`<rect x="${x0}" y="${ceil}" width="${x1 - x0}" height="160" fill="url(#matSootT)"/>`);
  // a plain dado rail and dark lower wall
  const wy = wallFoot - 230;
  b.push(`<rect x="${x0}" y="${wy}" width="${x1 - x0}" height="${wallFoot - wy}" fill="#201911"/><rect x="${x0}" y="${wy - 8}" width="${x1 - x0}" height="10" fill="#15100A"/><rect x="${x0}" y="${wy - 8}" width="${x1 - x0}" height="2" fill="#FFE6C0" opacity="0.14"/>`);
  // the ceiling beams
  b.push(`<rect x="${x0}" y="${ceil - 4}" width="${x1 - x0}" height="22" fill="#15100A"/>`);
  // the window (left), night outside: a dark sky, roofs across the street, a street lamp's glow from below; a curtain on a rod
  const [w0, w1] = UM.win, wy0 = 330, wy1 = 640;
  b.push(`<rect x="${w0 - 14}" y="${wy0 - 14}" width="${w1 - w0 + 28}" height="${wy1 - wy0 + 28}" fill="#0D0C09"/><rect x="${w0}" y="${wy0}" width="${w1 - w0}" height="${wy1 - wy0}" fill="#0B1418"/>` +
    `<path d="M${w0},${wy0 + 150} l30,0 l0,-30 l40,0 l0,20 l60,0 l0,${wy1 - wy0 - 140} l-130,0 Z" fill="#05090B"/>` + glowC((w0 + w1) / 2, wy1, 120, 0.5, 'msglow') +
    `<rect x="${(w0 + w1) / 2 - 3}" y="${wy0}" width="6" height="${wy1 - wy0}" fill="#0D0C09"/><rect x="${w0}" y="${(wy0 + wy1) / 2 - 3}" width="${w1 - w0}" height="6" fill="#0D0C09"/><rect x="${w0 - 22}" y="${wy1 + 10}" width="${w1 - w0 + 44}" height="12" fill="#0D0C09"/>`);
  // the banner: a fringed cloth on a pole with cords; a ring with a triangle and a star inside, two scrolls (stitched, no letters)
  const bx0 = 590, bx1 = 900, by0 = 250, by1 = 520, sw = 2 * Math.sin(t * 0.6);
  b.push(line([[bx0 - 20, by0], [bx1 + 20, by0]], '#120D08', 7) + line([[bx0 - 20, by0], [(bx0 + bx1) / 2, by0 - 50], [bx1 + 20, by0]], '#120D08', 2) +
    `<path d="M${bx0},${by0} L${bx1},${by0} L${bx1 + sw},${by1} L${(bx0 + bx1) / 2 + sw},${by1 + 34} L${bx0 + sw},${by1} Z" fill="#4B2A25"/><path d="M${bx0},${by0} L${bx1},${by0} L${bx1 + sw},${by1} L${(bx0 + bx1) / 2 + sw},${by1 + 34} L${bx0 + sw},${by1} Z" fill="none" stroke="#C9B48A" stroke-width="5" opacity="0.55"/>` +
    [...Array(22).keys()].map((k) => { const fx = bx0 + sw + k * (bx1 - bx0) / 21, fy = by1 + 34 * (1 - Math.abs(fx - (bx0 + bx1) / 2 - sw) / ((bx1 - bx0) / 2)); return line([[fx, fy], [fx + sw * 0.5, fy + 18]], '#C9B48A', 2, 'opacity="0.5"'); }).join(''));
  const ec = [(bx0 + bx1) / 2 + sw * 0.5, 382];
  b.push(`<circle cx="${ec[0]}" cy="${ec[1]}" r="66" fill="none" stroke="#D8C49A" stroke-width="7" opacity="0.6"/>` + poly([[ec[0], ec[1] - 46], [ec[0] + 40, ec[1] + 26], [ec[0] - 40, ec[1] + 26]], 'none', 'stroke="#D8C49A" stroke-width="5" opacity="0.6"') +
    poly([...Array(10).keys()].map((k) => { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? 7 : 16; return [ec[0] + rr * Math.cos(a), ec[1] + 6 + rr * Math.sin(a)]; }), '#D8C49A', 'opacity="0.6"') +
    [[bx0 + 30, 288], [bx0 + 30, 468]].map(([sx, sy]) => `<path d="M${sx},${sy} q${(bx1 - bx0 - 60) / 2},-14 ${bx1 - bx0 - 60},0" stroke="#D8C49A" stroke-width="12" fill="none" opacity="0.32"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map((k) => line([[sx + 20 + k * 30, sy - 2], [sx + 36 + k * 30, sy - 4]], '#4B2A25', 2, 'opacity="0.7"')).join('')).join(''));
  // a coat hook row by the door with two coats; a broadside of small type tacked up (lines only)
  const [d0, d1] = UM.door;
  b.push(`<rect x="${d0 - 14}" y="${wallFoot - 500}" width="${d1 - d0 + 28}" height="500" fill="#150F09"/><rect x="${d0}" y="${wallFoot - 486}" width="${d1 - d0}" height="486" fill="#0B0806"/>` +
    `<path d="M${d0},${wallFoot - 486} L${d0 + 34},${wallFoot - 476} L${d0 + 34},${wallFoot + 8} L${d0},${wallFoot}" fill="#2B2116"/>` + glowC(d0 + 70, wallFoot - 40, 140, 0.35 * fl, 'mswarm') + // the stair light from below
    `<circle cx="${d0 + 30}" cy="${wallFoot - 240}" r="5" fill="#2B2116"/>`);
  b.push(`<rect x="1350" y="330" width="120" height="160" fill="#CFC6AE" opacity="0.45"/>` + [...Array(9).keys()].map((k) => line([[1362, 352 + k * 15], [1458 - (k % 3) * 14, 352 + k * 15]], '#2C2A22', 2, 'opacity="0.55"')).join('') + `<rect x="1362" y="340" width="96" height="6" fill="#2C2A22" opacity="0.5"/>`);
  // a wall bracket lamp over the benches (the second light)
  b.push(`<rect x="1120" y="440" width="8" height="34" fill="#120D08"/>` + line([[1124, 450], [1150, 442]], '#120D08', 4) + `<ellipse cx="1152" cy="428" rx="7" ry="14" fill="#FFE9C4" opacity="0.6"/>` + glowC(1152, 430, 70, 0.5 * e5Flick(t, 3), 'msglow') + glowC(1152, 430, 420, 0.5 * e5Flick(t, 3), 'e5lamp'));
  // the floor
  b.push(`<rect x="${x0}" y="${wallFoot - 14}" width="${x1 - x0}" height="14" fill="#1A140D"/>` + MAT.floor(x0, x1, wallFoot, F, {kind: 'planks', base: '#3A3020', seed: 515, size: 54, vp: (x0 + x1) / 2}));
  const c = '#050505', f = `<rect x="${x0 - 34}" y="${ceil - 60}" width="34" height="${F - ceil + 100}" fill="${c}"/><rect x="${x1}" y="${ceil - 60}" width="34" height="${F - ceil + 100}" fill="${c}"/>` +
    `<rect x="${x0 - 34}" y="${ceil - 60}" width="${x1 - x0 + 68}" height="56" fill="${c}"/><rect x="${x0 - 34}" y="${F}" width="${x1 - x0 + 68}" height="80" fill="${c}"/><rect x="${x0}" y="${F - 2}" width="${x1 - x0}" height="3" fill="#DFE0D6" opacity="0.15"/>`;
  return {back: b.join(''), front: f, fl};
}
function renderE5Meeting(t, o = {}) {
  const {H, lampX} = UM, c = cam2(o.cam || camAt([[0, 1.1, 900, 600], [5, 1.16, 960, 605], [10.2, 1.3, 1090, 615], [16, 1.36, 1085, 618]], t));
  const lod = lodFor(H * c.z), room = e5MeetRoom(t), fl = room.fl, s = [room.back];
  const I = (base) => e5Ink(base, lod, lampX, fl);
  // ---- the speaker: stands behind the table, talks to the room, asks for names, nods to Michael ----
  const sp = e4Speak([[0.5, 2.6], [2.9, 4.8], [5.1, 7.4], [7.8, 9.0], [12.2, 14.4]], t), ask = smooth(UM.ask - 0.3, UM.ask + 0.3, t) * (1 - smooth(UM.nod + 0.6, UM.nod + 1.2, t));
  let spk = e5Standing(I({kind: 'man', hat: 'none', coat: 'frock', beard: true, h: H, d: 1, x: 720}), 720, 975, t, 0.1, 'um.speaker',
    {jaw: sp.jaw, tilt: 4 + 4 * sp.beat - 9 * e4Bump(t, UM.nod, 0.5) + (t > UM.kup && t < UM.nod + 0.6 ? 6 : 0)});
  const b = sp.on ? sp.beat : 0;
  spk = {...spk, an: {...spk.an, fArm: e4Keys([[0, 150, 110], [1.2, 120, 70 + 8 * b], [2.6, 140, 100], [3.4, 112, 60 + 10 * b], [4.8, 150, 108], [5.6, 104, 62 + 8 * b], [7.4, 150, 110], [UM.ask - 0.3, 150, 110], [UM.ask + 0.3, 96, 70], [UM.nod, 96, 70], [UM.nod + 1.0, 160, 140], [12.4, 120, 72 + 8 * b], [14.4, 150, 110]], t),
    bArm: e4Keys([[0, 186, 192], [UM.ask - 0.3, 186, 192], [UM.ask + 0.3, 120, 100], [UM.nod + 0.4, 120, 100], [UM.nod + 1.0, 186, 192]], t), lean: 3 * ask}};
  // ---- the secretary at the table's end, the roll book open; he writes Michael's name ----
  const [tx0, tx1] = UM.table, top = UM.top, bookX = 625;
  let sec = e5Sit(I({kind: 'man', hat: 'none', coat: 'vest', h: H * 0.97, d: 1, x: 520}), 520, 975 - 0.24 * H, 975, t, 0.6, 'um.sec.seat', {tilt: -14});
  const [w0, w1] = UM.write, writing = t > w0 && t < w1, nib = [bookX + 6 + 34 * clamp01((t - w0) / (w1 - w0)) + 3 * Math.sin(t * 29), top - 4 - Math.abs(2 * Math.sin(t * 17))];
  sec = writing ? reach(sec, 'f', nib[0] - 7, nib[1] - 20, 'um.sec.write') : reach(sec, 'f', bookX + 6, top - 22, 'um.sec.penRest');
  sec = reach(sec, 'b', bookX - 26, top - 2, 'um.sec.book');
  if (t > UM.kup - 0.4 && t < w0) sec = {...sec, an: {...sec.an, tilt: 6}};
  const chair = (cx, d) => `<rect x="${cx - 46}" y="${975 - 0.24 * H}" width="92" height="11" fill="#120D08"/><rect x="${cx - 42}" y="${975 - 0.24 * H + 11}" width="9" height="${0.24 * H - 11}" fill="#120D08"/><rect x="${cx + 32}" y="${975 - 0.24 * H + 11}" width="9" height="${0.24 * H - 11}" fill="#120D08"/><rect x="${cx - d * 46 - (d > 0 ? 0 : 9)}" y="${975 - 0.24 * H - 190}" width="9" height="190" fill="#120D08"/>`;
  const table = MAT.shadow((tx0 + tx1) / 2, 980, 160, 0.45) + `<rect x="${tx0}" y="${top}" width="${tx1 - tx0}" height="15" fill="#241A10"/><rect x="${tx0}" y="${top}" width="${tx1 - tx0}" height="3" fill="#FFE6C0" opacity="0.25"/>` +
    `<rect x="${tx0 + 14}" y="${top + 15}" width="12" height="${980 - top - 15}" fill="#120D08"/><rect x="${tx1 - 26}" y="${top + 15}" width="12" height="${980 - top - 15}" fill="#120D08"/><rect x="${tx0 + 8}" y="${top + 15}" width="${tx1 - tx0 - 16}" height="20" fill="#1A120A"/>` +
    `<path d="M${bookX - 40},${top} L${bookX + 20},${top - 10} L${bookX + 80},${top} L${bookX + 80},${top + 2} L${bookX - 40},${top + 2} Z" fill="#E9E0C8"/>` + line([[bookX + 20, top - 10], [bookX + 20, top + 1]], '#8A7F66', 1.4) +
    (t > w0 ? line([[bookX + 6, top - 4], [bookX + 6 + 34 * clamp01((t - w0) / (w1 - w0)), top - 3]], '#1C1A16', 1.6) : '') + `<rect x="${bookX + 96}" y="${top - 14}" width="16" height="14" rx="3" fill="#0D0C09"/>` +
    `<rect x="${tx1 - 64}" y="${top - 6}" width="50" height="6" fill="#CFC6AE" opacity="0.7"/>` + e5Lamp(UM.table[1] - 34, top, t);
  // ---- the window watcher: at the curtain, draws it aside, looks down, lets it fall, turns back to the room ----
  const WT = {to: 3.2, peek: [3.6, 6.2], turn: 6.8}, wx = 440, peek = smooth(WT.peek[0], WT.peek[0] + 0.4, t) * (1 - smooth(WT.peek[1], WT.peek[1] + 0.4, t));
  let wat = e5Standing(I({kind: 'man', hat: 'cap', coat: 'jacket', h: H, d: t < WT.turn ? -1 : 1, x: wx}), wx, 975, t, 0.4, 'um.watch', {tilt: t < WT.turn ? -2 - 10 * peek : 2});
  const curtainEdge = lerp(UM.win[1] - 6, UM.win[1] - 44, peek);
  if (t > WT.peek[0] - 0.4 && t < WT.peek[1] + 0.6) { const g = E3K.hand({...wat, an: {...wat.an, fArm: [176, 180]}}, 'f'), k = smooth(WT.peek[0] - 0.4, WT.peek[0], t) * (1 - smooth(WT.peek[1] + 0.2, WT.peek[1] + 0.6, t)), cp = [curtainEdge, 612];
    wat = k < 1 ? e3Move(wat, 'f', lerp(g.x, cp[0], k), lerp(g.y, cp[1], k), 'um.watch.toCurtain') : reach(wat, 'f', cp[0], cp[1], 'um.watch.curtain'); }
  const [cw0, cw1] = UM.win, curtain = `<rect x="${cw0 - 30}" y="318" width="${cw1 - cw0 + 60}" height="6" fill="#0D0C09"/>` +
    `<path d="M${cw0 - 24},322 L${curtainEdge},322 Q${curtainEdge - 8 + 3 * Math.sin(t)},500 ${curtainEdge},${660} L${cw0 - 24},660 Z" fill="#3E3428"/>` + [0, 1, 2, 3].map((k) => line([[cw0 - 10 + k * (curtainEdge - cw0) / 4, 326], [cw0 - 8 + k * (curtainEdge - cw0) / 4, 656]], '#2A221A', 3)).join('');
  // ---- the men on the benches: back row (floor 958) and front row (floor 1012), facing the speaker (left) ----
  const backBench = 958, frontBench = 1012, seatB = backBench - 0.24 * H, seatF = frontBench - 0.24 * H;
  const hats = ['cap', 'bowler', 'cap', 'none', 'bowler', 'cap', 'cap'], coats = ['jacket', 'sack', 'jacket', 'vest', 'sack', 'jacket', 'sack'];
  const backRow = [1030, 1190, 1350], frontRow = [1100, 1265, 1430, 1560];
  const up = {f1265: [UM.up1, 1.0], b1190: [UM.up2, 0.9]};
  const sitters = [];
  backRow.forEach((x, k) => { let fo = e5Sit(I({kind: 'man', hat: hats[k], coat: coats[k], beard: k === 1, h: H * 0.96, d: -1, x}), x, seatB, backBench, t, 0.3 * k + 0.1, `um.b${x}`);
    const u = up['b' + x]; if (u) fo = e5Raise(fo, smooth(u[0], u[0] + 0.35, t) * (1 - smooth(UM.down, UM.down + 0.5, t)));
    sitters.push({fo, row: 0}); });
  frontRow.forEach((x, k) => { let fo = e5Sit(I({kind: 'man', hat: hats[k + 3], coat: coats[k + 3], beard: k === 2, h: H, d: -1, x}), x, seatF, frontBench, t, 0.27 * k + 0.5, `um.f${x}`);
    const u = up['f' + x]; if (u) fo = e5Raise(fo, smooth(u[0], u[0] + 0.35, t) * (1 - smooth(UM.down, UM.down + 0.5, t)));
    if (x === 1430) fo = {...fo, an: {...fo.an, tilt: t > UM.up1 && t < 11 ? 14 : fo.an.tilt}}; // turns his head to the raised hands
    sitters.push({fo, row: 1}); });
  // ---- standing at the back by the door: three men (one with a pipe) and Michael Kelly nearest the door ----
  const standers = [[1500, 'bowler', 'sack', 0.2], [1610, 'cap', 'jacket', 0.7]].map(([x, hat, coat, ph]) => e5Standing(I({kind: 'man', hat, coat, h: H * 1.0, d: -1, x}), x, 985, t, ph, `um.s${x}`));
  standers[0] = {...standers[0], an: {...standers[0].an, ...E3_FOLD, lean: 0}};
  const pipeMan = standers[1], pg = E3K.toWorld(pipeMan, 0.07, 0.905);
  const pipe = line([[pg[0], pg[1]], [pg[0] - 18, pg[1] + 6], [pg[0] - 22, pg[1] - 4]], '#0D0C09', 3.4) + MAT.smoke(pg[0] - 22, pg[1] - 8, t, {col: 'B8C4C4', k: 0.3, n: 5, rise: 120, drift: -40, speed: 4, seed: 517});
  // Michael: listening, weight shifting; looks at the hands going up; raises his own; holds it; lowers it when the book is written
  const mx = 1690, kU = smooth(UM.kup, UM.kup + 0.45, t) * (1 - smooth(UM.down + 0.3, UM.down + 0.8, t));
  let mi = e5Standing(cast('michael', {x: mx, y: 980, h: H, d: -1, det: lod.det, rim: {c: '#FFE6C0', a: lod.rimA * 0.5 * fl, dx: -0.008, dy: -0.006}}), mx, 980, t, 0.9, 'um.michael',
    {tilt: t > UM.look && t < UM.kup ? 14 : (t > UM.kup && t < UM.nod + 0.5 ? 2 : 6 + 2 * Math.sin(t * 0.5)), expr: 'set', blink: (t + 1.1) % 3.7 < 0.12});
  mi = e5Raise(mi, kU);
  const miOver = '';
  // ---- draw, back to front ----
  s.push(curtain, fig(wat), fig(spk), chair(520, 1), fig(sec), table);
  if (writing || true) s.push(e5Pen(sec, 'um.sec.pen'));
  s.push(e5Bench(backRow[0] - 90, backRow[2] + 80, seatB, backBench));
  sitters.filter((r) => r.row === 0).forEach((r) => s.push(fig(r.fo)));
  s.push(fig(standers[0]) + foldedArms(standers[0].x, standers[0].y, standers[0].h, -1, E5.ink, NEIGHBOUR_TONES.tone), fig(pipeMan), pipe);
  s.push(e5Bench(frontRow[0] - 90, frontRow[3] + 70, seatF, frontBench));
  sitters.filter((r) => r.row === 1).forEach((r) => s.push(fig(r.fo)));
  s.push(e4Outlined(mi) + miOver, room.front);
  const world = layerAt(c, 1, s.join(''));
  const scr = o.quiet ? '' : tag(130, 120, 'A KNIGHTS OF LABOR ASSEMBLY · BROOKLYN · 1886', smooth(0.3, 0.7, t) * (1 - smooth(4.0, 4.4, t)));
  return frame(e5Defs(t), `<rect width="1920" height="1080" fill="#060505"/>`, world, scr, t);
}
if (typeof window !== 'undefined') Object.assign(window, {renderE5Meeting});
Object.assign(CLIPS, {ep5_union_meeting: {sec: UM.sec, render: (t) => renderE5Meeting(t)}});

/* ================= ep5_homestead_dawn: the cold open's last shots, July 6, 1892, 4 a.m. (29 s, five shots and a freeze) ================= */
// The end of the cold open ("Barges at Dawn", ../ep5/PLAN.md). Five shots cut inside the clip, then a freeze:
//   A  0.0  wide: the black Monongahela in fog, the works on the bank, furnaces glowing deep orange-red through the haze, embers off
//           the stacks; two dark shapes far off in the fog downriver. Tag "HOMESTEAD, PENNSYLVANIA · JULY 6, 1892 · 4 A.M.".
//   B  6.2  the works' roof: the steam whistle blasts (6.8 to 9.3), a great white plume, the warning to the town.
//   C  9.6  the hillside: the town pours down the street toward the river with lanterns and torches; in front, men run at the
//           works' board fence; the front men push the gate and it goes over (12.2); they surge through toward the landing.
//   D 15.0  low at the water: the two covered barges loom huge out of the fog behind the tug, its lantern beam sweeping; in the
//           lit doorways, armed guards (ink, faceless, rifles held upright).
//   E 20.0  the landing: the barge's bow at the bank, the gangplank lowering (22.0); the crowd on the bank shouting, lanterns raised,
//           torches; one flares (24.4); a slow push to the gangplank's end.
//   F 26.25 FREEZE as the gangplank touches: the image holds and drains toward monochrome with a teal and orange grade (to 29.0).
// No shot is fired on screen; nobody is hurt. Real people never get faces (every figure here is det 0).
const HD = {sec: 29, cuts: [6.2, 9.6, 15.0, 20.0], whistle: [6.8, 9.3], gate: 12.2, plank: [22.0, 26.25], flare: 24.4, freeze: 26.25};
const e5Torch = (gx, gy, t, s = 0, k = 1, big = 1) => { const sw = 6 * Math.sin(t * 7.3 + s) + 3 * Math.sin(t * 13.1 + s), fl = e5Flick(t, s), top = [gx + 5 * k, gy - 58 * k];
  return line([[gx - 2 * k, gy + 24 * k], top], '#2A1C10', 5 * k) + `<ellipse cx="${f1(top[0])}" cy="${f1(top[1])}" rx="${f1(7 * k)}" ry="${f1(10 * k)}" fill="#1A120A"/>` +
    e4Tongue(top[0], top[1], 26 * k * big, 70 * k * big * fl, sw * k, '#FF5A1A', 0.92) + e4Tongue(top[0], top[1], 15 * k * big, 48 * k * big * fl, sw * 0.8 * k, '#FFB23A', 0.92) + e4Tongue(top[0], top[1], 7 * k * big, 26 * k * big, sw * 0.5 * k, '#FFF1B8', 0.9) +
    glowC(top[0], top[1] - 20 * k, 60 * k * big, 0.7 * fl, 'msglow') + glowC(top[0], top[1] - 20 * k, 300 * k * big, 0.8 * fl, 'e4glow'); };
// embers rising and drifting from (x0..x1, y): n sparks
function e5Embers(t, x0, x1, y, n, seed, rise = 700, drift = -260) { const r = rng(seed), s = [];
  for (let i = 0; i < n; i++) { const xs = x0 + r() * (x1 - x0), sp = 0.1 + r() * 0.15, ph = (t * sp + r()) % 1, wob = 14 * Math.sin(t * (1 + r() * 2) + i), a = Math.sin(Math.PI * ph) * (0.55 + 0.45 * Math.sin(t * 11 + i));
    s.push(`<circle cx="${f1(xs + drift * ph + wob)}" cy="${f1(y - ph * rise * (0.6 + 0.6 * r()))}" r="${f1(1.4 + r() * 2.4)}" fill="${r() < 0.5 ? '#FFC36B' : '#FF6A2A'}" opacity="${f1(Math.max(0, a) * 100) / 100}"/>`); }
  return s.join(''); }
function e5Tug(x, y, k, t) { // the tug (x = its bow, facing right): hull, cabin with a lit window, pilot house, tall stack; smoke and wake
  const s = [];
  s.push(`<path d="M${f1(x - 150 * k)},${f1(y - 22 * k)} L${f1(x - 10 * k)},${f1(y - 26 * k)} L${f1(x)},${f1(y - 14 * k)} L${f1(x - 12 * k)},${f1(y)} L${f1(x - 140 * k)},${f1(y)} Z" fill="#0D1011"/>`);
  s.push(`<rect x="${f1(x - 120 * k)}" y="${f1(y - 52 * k)}" width="${f1(80 * k)}" height="${f1(28 * k)}" fill="#121617"/><rect x="${f1(x - 64 * k)}" y="${f1(y - 76 * k)}" width="${f1(30 * k)}" height="${f1(24 * k)}" fill="#121617"/>`);
  s.push(`<rect x="${f1(x - 58 * k)}" y="${f1(y - 70 * k)}" width="${f1(16 * k)}" height="${f1(9 * k)}" fill="#FFCB80" opacity="${f1(0.8 * e5Flick(t, 7))}"/>` + glowC(x - 50 * k, y - 66 * k, 60 * k, 0.6, 'e5lant'));
  s.push(`<rect x="${f1(x - 100 * k)}" y="${f1(y - 110 * k)}" width="${f1(12 * k)}" height="${f1(60 * k)}" fill="#0D1011"/>` + MAT.smoke(x - 94 * k, y - 112 * k, t, {col: '6A625C', k: 0.9 * k, n: 8, rise: 150, drift: -260, speed: 5, seed: 523}));
  s.push(line([[x - 150 * k, y - 18 * k], [x - 220 * k, y - 10 * k]], '#0D1011', 1.2)); // the tow line back to the barges
  return s.join('');
}
// the works (shot A and B): sheds, a row of stacks with embers, furnaces glowing deep orange-red; the whistle on the big shed's ridge
function e5Works(t, blast = 0) {
  const s = [], fl = 0.82 + 0.18 * Math.sin(t * 1.3) * Math.sin(t * 0.7 + 1);
  s.push(glowC(1640, 600, 700, 0.85 * fl, 'e4haze'));
  for (const [sx, sw, sh] of [[1360, 22, 520], [1430, 26, 600], [1505, 22, 560], [1580, 28, 640], [1660, 22, 540], [1735, 26, 610], [1820, 24, 580], [1900, 28, 620]]) {
    s.push(`<rect x="${sx}" y="${770 - sh}" width="${sw}" height="${sh}" fill="#141B1E"/><rect x="${sx - 3}" y="${770 - sh}" width="${sw + 6}" height="8" fill="#10171A"/><rect x="${sx}" y="${770 - sh + 8}" width="${sw}" height="60" fill="#FF5A2A" opacity="0.12"/>`);
    s.push(glowC(sx + sw / 2, 770 - sh, 40, 0.6 * fl, 'e4glow') + MAT.smoke(sx + sw / 2, 770 - sh - 6, t + sx * 0.01, {col: '6A625C', k: 0.9, n: 5, rise: 180, drift: -220, speed: 9, seed: sx}).replace(/opacity="([\d.]+)"/g, (m, a) => `opacity="${f1(Number(a) * 0.5 * 100) / 100}"`));
  }
  s.push(e5Embers(t, 1360, 1930, 160, 60, 551, 500, -300));
  s.push(`<path d="M1280,800 L1280,600 ${[...Array(9).keys()].map((i) => `L${1280 + i * 90},560 L${1280 + i * 90 + 90},600`).join(' ')} L2110,800 Z" fill="#161E21"/>`);
  s.push(`<path d="M1500,800 L1500,520 L1720,470 L1940,520 L1940,800 Z" fill="#131A1D"/>`);
  for (let i = 0; i < 12; i++) { const wx = 1310 + i * 64, a = (i % 3 === 1 ? 0.95 : 0.55) * fl * (0.85 + 0.15 * Math.sin(t * 3 + i)); s.push(`<rect x="${wx}" y="650" width="22" height="34" fill="${i % 2 ? '#FF4A1E' : '#FF7A2E'}" opacity="${f1(a)}"/>`); }
  s.push(glowC(1640, 670, 340, 0.7 * fl, 'e4glow'));
  // the whistle on the ridge: a pipe, a valve wheel, the bell; its plume when it blows
  s.push(`<rect x="1716" y="420" width="8" height="52" fill="#0D1011"/><path d="M1710,424 l20,0 l-3,-30 q-7,-6 -14,0 Z" fill="#0D1011"/><circle cx="1720" cy="450" r="7" fill="none" stroke="#0D1011" stroke-width="3"/>`);
  if (blast > 0) { const p = [];
    for (let i = 0; i < 16; i++) { const ph = ((t * 1.6 + i / 16) % 1), a = blast * 0.85 * Math.pow(1 - ph, 0.8) * Math.min(1, ph * 8), R = 14 + ph * 120, r2 = rng(560 + i);
      p.push(`<circle cx="${f1(1720 + ph * 160 + 30 * Math.sin(i))}" cy="${f1(392 - ph * 360 - 20 * r2())}" r="${f1(R)}" fill="url(#puffD9DEDA)" opacity="${f1(a * 100) / 100}"/>`); }
    s.push(p.join('') + glowC(1720, 380, 60, 0.8 * blast, 'msglow')); }
  return s.join('');
}
const e5Sky = (k = 1) => `<rect width="1920" height="1080" fill="url(#hdsky)"/>`;
function e5ShotA(t, c, blast = 0) { // the wide (also the whistle shot's world)
  const s = [];
  s.push(`<path d="M-600,560 L-600,470 Q-300,430 0,470 Q260,500 520,440 Q800,400 1100,470 Q1400,520 1700,450 Q2000,410 2600,470 L2600,560 Z" fill="#2A383E"/>` + MAT.trees([[-600, 470], [0, 470], [520, 440], [1100, 470], [1700, 450], [2600, 470]], {col: '#25333A', seed: 531, size: 22, every: 0.5}));
  // the town's lights on the hill above the works
  const r = rng(552); for (let i = 0; i < 40; i++) { const x = 1100 + r() * 1300, y = 470 + r() * 60; s.push(`<rect x="${f1(x)}" y="${f1(y)}" width="4" height="5" fill="#FFC27A" opacity="${f1((0.35 + 0.4 * r()) * e5Flick(t, i))}"/>`); }
  s.push(`<path d="M-600,560 L-600,520 Q200,505 900,530 Q1600,550 2600,515 L2600,560 Z" fill="#1E2A2E"/>`);
  s.push(e5Mist(t, -600, 2600, 470, 560, {n: 10, seed: 532, speed: 6, op: 0.6, h: 40}));
  s.push(MAT.water(-600, 560, 3200, 235, t, {top: '#1C272B', bottom: '#06090A', seed: 533, glint: '#8FA0A2', n: 70}));
  // the furnace glow on the water under the works
  s.push(`<ellipse cx="1650" cy="700" rx="420" ry="60" fill="url(#e4pool)" opacity="0.8"/>`);
  // two dark shapes far down the river in the fog (the barges, not yet known)
  const bx = lerp(-200, 120, smooth(0, 6.2, t));
  s.push(`<g opacity="${f1(0.55 * smooth(1.5, 4, t))}"><rect x="${f1(bx - 120)}" y="640" width="110" height="16" fill="#0A0E10"/><rect x="${f1(bx - 140)}" y="628" width="100" height="14" fill="#0A0E10"/><rect x="${f1(bx + 10)}" y="642" width="30" height="12" fill="#0A0E10"/></g>`);
  s.push(e5Mist(t, -600, 2600, 590, 790, {n: 22, seed: 534, speed: 10, op: 0.65, h: 46}));
  s.push(e5Works(t, blast));
  s.push(`<path d="M-600,795 L2600,795 L2600,1300 L-600,1300 Z" fill="#0B0E0F"/><path d="M-600,795 L2600,795 L2600,826 L-600,832 Z" fill="#171D1F"/>` + MAT.ground(-600, 2600, 830, {base: '#0B0E0F', seed: 535}));
  s.push(e5Mist(t, -600, 2600, 800, 1000, {n: 10, seed: 536, speed: 7, op: 0.35, h: 50}));
  return s.join('');
}
// a small figure walking down the hill street (shot C background): walk cycle, no contact logging at this size
function e5Downhill(x, y, h, t, ph, lant) { const an = walkAn(ph % 1 + t * 1.3, {carry: lant}), fo = {kind: 'man', hat: 'cap', coat: 'jacket', x, y, h, d: 1, fill: '#0A0B0B', det: 0, an};
  return figure(fo) + (lant ? glowC(x + 0.12 * h, y - 0.42 * h, 26, 0.9 * e5Flick(t, ph * 9), 'e5lant') + `<circle cx="${f1(x + 0.12 * h)}" cy="${f1(y - 0.42 * h)}" r="2.6" fill="#FFD08A"/>` : ''); }
function e5ShotC(t) { // the hillside town and the works' fence
  const s = [], r = rng(571);
  s.push(`<rect x="-600" y="-200" width="3200" height="1500" fill="url(#hdsky)"/>`);
  s.push(glowC(1900, 760, 900, 0.75, 'e4haze'));
  // the hill rising to the left with rows of frame houses, lit windows; the street running down it to the right
  s.push(`<path d="M-600,200 L200,240 L900,480 L1500,760 L-600,760 Z" fill="#161E22"/>`);
  for (let row = 0; row < 5; row++) for (let i = 0; i < 9; i++) { const x = -500 + i * 150 + row * 130 + r() * 30, y = 260 + row * 110 + (x + 500) * 0.12, w = 90 + r() * 30, h = 70 + r() * 30; if (y > 720 || x > 1350) continue;
    s.push(`<path d="M${f1(x)},${f1(y)} l0,-${f1(h)} l${f1(w / 2)},-36 l${f1(w / 2)},36 l0,${f1(h)} Z" fill="#0F1518"/>` + (r() < 0.7 ? `<rect x="${f1(x + w * 0.3)}" y="${f1(y - h * 0.7)}" width="12" height="16" fill="#FFB25C" opacity="${f1((0.5 + 0.4 * r()) * e5Flick(t, i + row))}"/>` : '')); }
  // people streaming down the street (a line from upper left to the bottom right), lanterns bobbing
  for (let i = 0; i < 26; i++) { const u = ((t - 9.6) * (0.05 + 0.02 * (i % 3)) + i / 26) % 1, x = -300 + u * 1500, y = 300 + u * 520, h = 60 + u * 60; s.push(e5Downhill(x, y, h, t, i * 0.37, i % 3 === 0)); }
  s.push(e5Mist(t, -600, 2600, 520, 820, {n: 12, seed: 572, speed: 12, op: 0.4, h: 60}));
  // the ground at the works and the fence ("Fort Frick": tall boards, barbed wire on top, a gate)
  const G = 1000;
  s.push(`<rect x="-600" y="740" width="3200" height="800" fill="#0D1012"/>` + MAT.ground(-600, 2600, G + 6, {base: '#0D1012', seed: 573}));
  const fall = smooth(HD.gate, HD.gate + 0.45, t), gx0 = 1300, gx1 = 1520, fy = G - 340;
  s.push(`<rect x="1020" y="${fy}" width="${gx0 - 1020}" height="340" fill="#1E1A15"/><rect x="${gx1}" y="${fy}" width="1000" height="340" fill="#1E1A15"/>` + [...Array(40).keys()].map((i) => i * 22 + 1020 < gx0 || i * 22 + 1020 > gx1 ? `<rect x="${1020 + i * 22}" y="${fy}" width="2" height="340" fill="#0D0B08"/>` : '').join('') +
    line([[1020, fy - 14], [2600, fy - 14]], '#3A3530', 2) + line([[1020, fy - 26], [2600, fy - 26]], '#3A3530', 2) + [...Array(80).keys()].map((i) => `<path d="M${1030 + i * 20},${fy - 14} l4,-6 M${1036 + i * 20},${fy - 26} l-3,-6" stroke="#3A3530" stroke-width="1.5"/>`).join('') +
    [1020, gx0 - 10, gx1, 1800, 2100].map((px) => `<rect x="${px}" y="${fy - 34}" width="12" height="374" fill="#0D0B08"/>`).join(''));
  // the gate leaves topple back flat (seen from the side: they shrink to their bottom edge)
  const gh = 330 * (1 - fall * 0.94);
  s.push(`<rect x="${gx0}" y="${f1(G - 10 - gh)}" width="${gx1 - gx0}" height="${f1(gh)}" fill="#2A241C"/>` + [...Array(10).keys()].map((i) => `<rect x="${gx0 + i * 22}" y="${f1(G - 10 - gh)}" width="2" height="${f1(gh)}" fill="#0D0B08"/>`).join('') + (fall < 0.2 ? line([[gx0, G - 10 - gh * 0.3], [gx1, G - 10 - gh * 0.7]], '#0D0B08', 6) : ''));
  if (t > HD.gate + 0.3) s.push(MAT.smoke(gx0 + 110, G - 20, t - HD.gate, {col: '6A625C', k: 1.4, n: 6, rise: 90, drift: 120, speed: 2.4, seed: 574}).replace(/opacity="([\d.]+)"/g, (m, a) => `opacity="${f1(Number(a) * 0.5 * Math.max(0, 1 - (t - HD.gate) / 3) * 100) / 100}"`));
  return {svg: s.join(''), G, gx0, gx1};
}
// a covered barge, big (x = its bow, facing right): hull, the house with lit doorways; returns doorway rects for guards
function e5BargeBig(x, y, k, t, doors = [0.2, 0.45, 0.7]) {
  const L = 420 * k, s = [], D = [];
  s.push(`<path d="M${f1(x - L)},${f1(y - 26 * k)} L${f1(x - 10 * k)},${f1(y - 26 * k)} L${f1(x)},${f1(y - 12 * k)} L${f1(x - 8 * k)},${f1(y)} L${f1(x - L)},${f1(y)} Z" fill="#0A0D0E"/>` + line([[x - L, y - 26 * k], [x - 10 * k, y - 26 * k]], '#6F8084', 1.5, 'opacity="0.5"'));
  const hx0 = x - L + 16 * k, hx1 = x - 30 * k, hy = y - 26 * k, hh = 66 * k;
  s.push(`<path d="M${f1(hx0)},${f1(hy)} L${f1(hx0)},${f1(hy - hh)} L${f1(x - L / 2)},${f1(hy - hh - 14 * k)} L${f1(hx1)},${f1(hy - hh)} L${f1(hx1)},${f1(hy)} Z" fill="#0F1314"/>` + line([[hx0, hy - hh], [x - L / 2, hy - hh - 14 * k], [hx1, hy - hh]], '#8A9A9C', 1.6, 'opacity="0.45"'));
  for (let i = 0; i < 9; i++) s.push(`<rect x="${f1(hx0 + 20 * k + i * 40 * k)}" y="${f1(hy - hh + 14 * k)}" width="${f1(12 * k)}" height="${f1(5 * k)}" fill="#05080A"/>`);
  for (const u of doors) { const dx = hx0 + (hx1 - hx0) * u, dw = 34 * k, dh = 54 * k, fl = e5Flick(t, u * 9);
    s.push(`<rect x="${f1(dx - dw / 2)}" y="${f1(hy - dh)}" width="${f1(dw)}" height="${f1(dh)}" fill="#8A5A2E" opacity="${f1(0.85 * fl)}"/><rect x="${f1(dx - dw / 2)}" y="${f1(hy - dh)}" width="${f1(dw)}" height="${f1(dh)}" fill="url(#hddoor)"/>` + glowC(dx, hy - dh / 2, 50 * k, 0.35 * fl, 'e5lant'));
    D.push([dx, hy, dw, dh]); }
  return {svg: s.join(''), doors: D, deck: hy};
}
// a guard in a doorway: ink, faceless, a rifle held upright before him (muzzle up, never toward the camera)
function e5Guard(dx, deck, h, t, i, d = 1) {
  let fo = e3Stand({kind: 'man', hat: i % 2 ? 'bowler' : 'cap', coat: 'sack', x: dx, y: deck, floorY: deck, h, d, fill: '#050606', det: 0, tones: {tone: '#161A1B', lite: '#222'}, rim: {c: '#FFB870', a: 0.5, dx: -0.008 * d, dy: -0.004}, an: {...POSES.stand(t, i * 0.3), tilt: 4 * Math.sin(t * 0.6 + i)}}, dx, dx, 0, `hd.guard${i}`);
  const grip = E3K.toWorld(fo, 0.1, 0.58); fo = reach(fo, 'f', grip[0], grip[1], `hd.guard${i}.rifle`);
  const gf = E3K.hand(fo, 'f'); fo = reach(fo, 'b', gf.x + 1, gf.y + 0.1 * h, `hd.guard${i}.rifle2`);
  const rifle = holding(fo, 'f', `hd.guard${i}.rifleH`, (gx, gy) => line([[gx, gy + 0.3 * h], [gx + 2, gy - 0.42 * h]], '#050606', Math.max(2, 0.018 * h)) + line([[gx - 1, gy + 0.1 * h], [gx, gy + 0.3 * h]], '#050606', Math.max(4, 0.035 * h)));
  return figure(fo) + rifle;
}
function e5Tug2(x, y, k, t, beamA) { // the tug with its lantern beam (beamA: the beam's angle in degrees, 180 = pointing left)
  const s = [];
  s.push(e5Tug(x, y, k, t));
  const lx = x - 50 * k, ly = y - 66 * k, a = beamA * Math.PI / 180, L = 1400, w = 0.16;
  s.push(`<g filter="url(#hdbeamblur)" style="mix-blend-mode:screen">` + [0.04, 0.08, 0.13].map((ww) => `<path d="M${f1(lx)},${f1(ly)} L${f1(lx + L * Math.cos(a - ww))},${f1(ly + L * Math.sin(a - ww))} L${f1(lx + L * Math.cos(a + ww))},${f1(ly + L * Math.sin(a + ww))} Z" fill="url(#hdbeam)" opacity="0.16"/>`).join('') + `</g>` + glowC(lx, ly, 50 * k, 0.9, 'msglow'));
  return s.join('');
}
function e5ShotD(t) { // low at the water: the barges loom out of the fog
  const s = [], u = smooth(15.0, 20.0, t);
  s.push(`<rect x="-600" y="-200" width="3200" height="1500" fill="url(#hdsky)"/>` + glowC(1800, 640, 800, 0.6, 'e4haze'));
  s.push(`<path d="M-600,690 Q400,660 1200,690 Q1900,710 2600,680 L2600,760 L-600,760 Z" fill="#1A2428"/>`);
  s.push(e5Mist(t, -600, 2600, 560, 760, {n: 14, seed: 581, speed: 14, op: 0.7, h: 70}));
  s.push(MAT.water(-600, 740, 3200, 500, t, {top: '#1A2327', bottom: '#040607', seed: 582, glint: '#9FB0B2', n: 120}));
  // the rear barge (further, fogged), then the tug, then the front barge, huge
  const xb = lerp(1250, 1520, u);
  const rear = e5BargeBig(xb - 160, 760, 2.1, t, [0.3, 0.62]);
  s.push(rear.svg, rear.doors.map((dd, i) => e5Guard(dd[0], dd[1], dd[3] * 0.92, t, i + 5)).join(''));
  s.push(e5Mist(t, -600, 2600, 640, 820, {n: 10, seed: 583, speed: 16, op: 0.55, h: 60}));
  s.push(e5Tug2(xb + 520, 800, 1.6, t, 176 + 10 * Math.sin((t - 15) * 0.9)));
  const front = e5BargeBig(xb + 80, 880, 3.1, t, [0.18, 0.44, 0.7]);
  s.push(front.svg, front.doors.map((dd, i) => e5Guard(dd[0], dd[1], dd[3] * 0.92, t, i)).join(''));
  // wake breaking white along the hull, near ripples
  s.push([0, 1, 2, 3].map((i) => line([[xb + 80 - i * 40, 884 + i * 6], [xb - 1200 - i * 100, 896 + i * 18]], '#BCC8C8', 2.5, `opacity="${f1(0.35 - i * 0.07)}"`)).join(''));
  s.push(e5Mist(t, -600, 2600, 800, 1080, {n: 14, seed: 584, speed: 18, op: 0.5, h: 70}));
  return s.join('');
}
// the landing (shot E and the freeze): the barge's bow at the bank, the gangplank, the crowd
function e5ShotE(t, c) {
  const s = [], ft = Math.min(t, HD.freeze), BANK = 900;
  s.push(`<rect x="-600" y="-200" width="3200" height="1500" fill="url(#hdsky)"/>`);
  // the works behind the crowd, top right: stacks and the furnace glow
  s.push(glowC(1700, 520, 900, 0.9, 'e4haze'));
  for (const [sx, sh] of [[1380, 640], [1500, 720], [1640, 680], [1780, 760], [1920, 700]]) s.push(`<rect x="${sx}" y="${BANK - sh}" width="40" height="${sh}" fill="#11171A"/><rect x="${sx}" y="${BANK - sh + 10}" width="40" height="80" fill="#FF5A2A" opacity="0.12"/>`);
  s.push(e5Embers(t, 1380, 1960, BANK - 700, 50, 591, 400, -200));
  s.push(`<path d="M1200,${BANK} L1200,560 L1460,520 L1460,${BANK} Z M1460,${BANK} L1460,500 L2400,500 L2400,${BANK} Z" fill="#141B1E"/>` + [...Array(12).keys()].map((i) => `<rect x="${1230 + i * 90}" y="600" width="30" height="44" fill="#FF5A24" opacity="${f1((i % 3 === 1 ? 0.9 : 0.5) * e5Flick(t, i))}"/>`).join(''));
  s.push(e5Mist(t, -600, 2600, 520, 760, {n: 12, seed: 592, speed: 8, op: 0.55, h: 60}));
  s.push(MAT.water(-600, 760, 2000, 520, t, {top: '#182226', bottom: '#040607', seed: 593, glint: '#9FB0B2', n: 90}));
  // the bank: a mud slope from the water up to the landing, the landing's planks
  s.push(`<path d="M980,1300 L980,${BANK + 30} Q1040,${BANK} 1100,${BANK} L2600,${BANK} L2600,1300 Z" fill="#0C0F10"/><path d="M980,${BANK + 30} Q1040,${BANK} 1100,${BANK} L2600,${BANK} L2600,${BANK + 12} L1100,${BANK + 12} Z" fill="#20282A"/>` +
    `<rect x="1060" y="${BANK - 6}" width="320" height="10" fill="#2A2620"/>` + [0, 1, 2, 3].map((i) => `<rect x="${1070 + i * 90}" y="${BANK + 4}" width="10" height="60" fill="#0A0C0C"/>`).join(''));
  // the barge at the landing (bow right at x 1000), guards in the doorways
  const bg = e5BargeBig(1000, 860, 2.4, t, [0.28, 0.55, 0.8]);
  s.push(bg.svg, bg.doors.map((dd, i) => e5Guard(dd[0], dd[1], dd[3] * 0.92, t, i)).join(''));
  // the gangplank: hinged at the bow deck, lowered from upright until its end rests on the landing
  const hinge = [990, bg.deck], end = [1170, BANK - 6], L = Math.hypot(end[0] - hinge[0], end[1] - hinge[1]), aEnd = Math.atan2(end[1] - hinge[1], end[0] - hinge[0]);
  const a = lerp(-1.2, aEnd, Math.pow(smooth(HD.plank[0], HD.plank[1], ft), 1.4)), tip = [hinge[0] + L * Math.cos(a), hinge[1] + L * Math.sin(a)];
  const nx = -Math.sin(a) * 18, ny = Math.cos(a) * 18;
  s.push(`<path d="M${f1(hinge[0])},${f1(hinge[1])} L${f1(tip[0])},${f1(tip[1])} L${f1(tip[0] + nx)},${f1(tip[1] + ny)} L${f1(hinge[0] + nx)},${f1(hinge[1] + ny)} Z" fill="#3A2E22"/>` + line([hinge, tip], '#FFB870', 2.5, 'opacity="0.7"') +
    line([[hinge[0] - 30, hinge[1] - 120], tip], '#1A1612', 2) + line([[hinge[0] - 30, hinge[1] - 140], [hinge[0] - 30, hinge[1]]], '#0D0B08', 6));
  s.push(e5Mist(t, -600, 1300, 760, 900, {n: 10, seed: 594, speed: 12, op: 0.5, h: 50}));
  // the crowd: three rows on the bank facing the barge, shouting (arms up, heads up), lanterns raised, torches
  const rows = [{G: BANK + 20, H: 270}, {G: BANK + 80, H: 320}, {G: BANK + 150, H: 380}], P = [];
  const crowd = [[0, 1260, 'L'], [0, 1360, 0], [0, 1470, 'T'], [0, 1580, 0], [0, 1690, 'L'], [0, 1800, 0], [0, 1900, 'T'],
    [1, 1300, 0], [1, 1420, 'L'], [1, 1550, 0], [1, 1680, 'T'], [1, 1810, 0], [1, 1930, 'L'],
    [2, 1230, 'T'], [2, 1390, 0], [2, 1560, 'L'], [2, 1740, 0], [2, 1910, 'T']];
  crowd.forEach(([ri, x, prop], i) => {
    const {G, H} = rows[ri], name = `hd.c${i}`, sh = Math.max(0, Math.sin(ft * (2.2 + (i % 3) * 0.4) + i)), woman = i % 7 === 3;
    let fo = e5Standing({kind: woman ? 'woman' : 'man', hat: woman ? 'kerchief' : i % 3 ? 'cap' : 'bowler', coat: i % 2 ? 'jacket' : 'sack', wear: woman ? ['plain', 'shawl'] : [], h: woman ? H * 0.9 : H, d: -1, fill: '#050606', det: 0, tones: {tone: '#151A1B', lite: '#222829'},
      rim: {c: '#FFB060', a: 0.75, dx: 0.009, dy: -0.006}}, x, G, ft, i * 0.21, name, {tilt: 10 + 6 * sh});
    if (prop === 'T') fo = {...fo, an: {...fo.an, fArm: [lerp(150, 24, smooth(19.6 + i * 0.05, 20.4, ft)), lerp(130, 14, smooth(19.6, 20.4, ft))]}};
    else if (prop === 'L') fo = {...fo, an: {...fo.an, fArm: [40 + 14 * sh, 30 + 10 * sh]}};
    else { const w = Math.max(0, Math.sin(ft * 3.1 + i * 1.7)); fo = {...fo, an: {...fo.an, fArm: [20 + 40 * w, 10 + 30 * w], lean: -3 * w}}; }
    const ex = prop === 'T' ? holding(fo, 'f', name + '.torch', (gx, gy) => e5Torch(gx, gy, ft, i, H / 300, i === 13 ? 1 + 0.9 * e4Bump(ft, HD.flare, 1.4) : 1)) :
      prop === 'L' ? holding(fo, 'f', name + '.lantern', (gx, gy) => e5Lantern(gx, gy, ft, i, H / 220)) : '';
    P.push({ri, svg: fig(fo) + ex});
  });
  [0, 1, 2].forEach((ri) => P.filter((p) => p.ri === ri).forEach((p) => s.push(p.svg)));
  s.push(e5Mist(t, -600, 2600, 1000, 1200, {n: 8, seed: 595, speed: 8, op: 0.3, h: 60}));
  return {svg: s.join(''), tip};
}
function renderE5Homestead(t, o = {}) {
  const [cA, cB, cC, cD] = HD.cuts, FZ = HD.freeze, frozen = t >= FZ, tt = frozen ? FZ : t;
  let world = '', scr = '', c;
  if (tt < cA) { c = cam2(camAt([[0, 1.0, 960, 520], [cA, 1.1, 1060, 545]], tt)); world = layerAt(c, 1, e5ShotA(tt, c, 0));
    if (!o.quiet) scr = tag(130, 120, 'HOMESTEAD, PENNSYLVANIA · JULY 6, 1892 · 4 A.M.', smooth(0.3, 0.7, tt) * (1 - smooth(4.2, 4.6, tt))); }
  else if (tt < cB) { const blast = smooth(HD.whistle[0], HD.whistle[0] + 0.15, tt) * (1 - smooth(HD.whistle[1] - 0.3, HD.whistle[1], tt));
    c = cam2(camAt([[cA, 2.0, 1690, 430], [cB, 2.25, 1700, 410]], tt)); world = layerAt(c, 1, e5ShotA(tt, c, blast)); }
  else if (tt < cC) {
    c = cam2(camAt([[cB, 1.0, 900, 560], [cC, 1.12, 1100, 600]], tt));
    const set = e5ShotC(tt), P = [];
    // the runners in front: down from the left at speed toward the gate; the front three push it; all surge through
    const R = [[-260, 280, 1, 0], [-420, 320, 0, 0], [-120, 300, 2, 1], [-600, 300, 0, 1], [-760, 340, 1, 0], [-880, 290, 2, 1], [-1000, 320, 0, 0], [-1150, 300, 1, 1]];
    R.forEach(([x0, H, row, lant], i) => {
      const G = set.G - 6 + row * 18, push = i < 3, at = push ? set.gx0 - 55 - i * 30 : 900 - i * 40;
      const walks = push ? [{t0: cB, t1: 11.5, to: at, a: 0.08}, {t0: HD.gate + 0.4, t1: 15.2, to: 2300, a: 0.08}] : [{t0: cB + 0.1 * i, t1: 15.0, to: 2100 - i * 60, a: 0.05}];
      const base = {kind: 'man', hat: i % 2 ? 'cap' : 'bowler', coat: i % 2 ? 'jacket' : 'sack', h: H, fill: '#050606', det: 0, tones: {tone: '#151A1B', lite: '#222829'}, rim: {c: '#FFB060', a: 0.55, dx: 0.008, dy: -0.006}};
      const tr = e4Track({...base, an: {}}, {x: x0, d: 1, G, ph: i * 0.2, walks: walks.map((w) => ({...w, carry: !!lant, an: lant ? {fArm: [150, 30]} : {}}))}, tt, `hd.run${i}`);
      let fo = tr.fo; fo = {...fo, an: {...fo.an, lean: (fo.an.lean || 0) + (tr.state === 'walk' ? 8 : 0)}};
      if (push && tr.state !== 'walk' && tt > 11.5 && tt < HD.gate + 0.4) { const k = smooth(11.5, 11.8, tt), P1 = [set.gx0 + 6, set.G - 10 - 330 * 0.55 + i * 10];
        fo = {...fo, an: {...fo.an, lean: 14 * k}}; const g = E3K.hand(fo, 'f'); fo = k < 1 ? e3Move(fo, 'f', lerp(g.x, P1[0], k), lerp(g.y, P1[1], k), `hd.run${i}.toGate`) : (tt < HD.gate ? reach(fo, 'f', P1[0], P1[1], `hd.run${i}.gate`) : fo); }
      const ex = lant ? holding(fo, 'f', `hd.run${i}.torch`, (gx, gy) => (i % 2 ? e5Lantern(gx, gy, tt, i, H / 220) : e5Torch(gx, gy, tt, i, H / 300))) : '';
      P.push({row, svg: fig(fo) + ex});
    });
    world = layerAt(c, 1, set.svg + [0, 1, 2].map((r) => P.filter((p) => p.row === r).map((p) => p.svg).join('')).join(''));
  } else if (tt < cD) { c = cam2(camAt([[cC, 1.0, 960, 640], [cD, 1.12, 900, 660]], tt)); world = layerAt(c, 1, e5ShotD(tt)); }
  else { c = cam2(camAt([[cD, 1.0, 1080, 640], [FZ, 1.32, 1120, 700]], tt)); world = layerAt(c, 1, e5ShotE(tt, c).svg); }
  // the freeze: hold the last frame, drain toward monochrome, grade teal (shadows) and orange (lights)
  const z = frozen ? smooth(FZ, FZ + 1.4, t) : 0;
  const defs = e5Defs(tt, e4FireDefs() + grad('hdsky', [['0', '#060C10'], ['0.5', '#13212A'], ['0.8', '#2F4450'], ['1', '#4E6068']]) +
    `<linearGradient id="hddoor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.5"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>` +
    `<linearGradient id="hdbeam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFF0C8" stop-opacity="0.7"/><stop offset="1" stop-color="#FFF0C8" stop-opacity="0"/></linearGradient>` +
    `<filter id="hdbeamblur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="16"/></filter><filter id="hdgrade"><feColorMatrix type="saturate" values="${f1((1 - 0.78 * z) * 100) / 100}"/></filter>` +
    grad('hdtone', [['0', '#1E6E70'], ['0.6', '#2A5A5A'], ['1', '#C8642A']]));
  const graded = z > 0 ? `<g filter="url(#hdgrade)">${world}</g><rect width="1920" height="1080" fill="url(#hdtone)" opacity="${f1(0.5 * z * 100) / 100}" style="mix-blend-mode:overlay"/><rect width="1920" height="1080" fill="#000" opacity="${f1(0.12 * z * 100) / 100}"/>` : world;
  return frame(defs, `<rect width="1920" height="1080" fill="#060C10"/>`, graded, scr, tt);
}
if (typeof window !== 'undefined') Object.assign(window, {renderE5Homestead});
Object.assign(CLIPS, {ep5_homestead_dawn: {sec: HD.sec, render: (t) => renderE5Homestead(t)}});

/* ================= ep5_farm_kitchen: a sod house near O'Neill, Holt County, Nebraska, a winter evening, about 1890 (16 s) ================= */
// Uncle Owen Kelly (Da's younger brother, coral) farms near O'Neill, an Irish colony on the Plains. One room cut out of the prairie:
// walls of stacked sod blocks, a muslin ceiling sagging between the poles, one small deep-set window with snow driving past it. Owen
// sits at the table by the lamp writing a letter home; beside him a pile of bills and the mortgage papers, the top sheet with a small
// red stamp; a calendar on the wall. His wife (coral) at the stove with the kettle steaming, glancing over at him once. Their child
// (coral) asleep in the bed in the far corner, the quilt rising and falling; nobody near the bed. He stops writing, looks at the pile,
// rubs his brow, and writes on. Wind gusts drive the snow and make the lamp flame dip. Scale: a man 440 px.
const FK = {sec: 16, x0: 300, x1: 1640, ceil: 300, wallFoot: 930, F: 1000, H: 440, bed: [330, 640], stove: [700, 880], table: [1120, 1400], chair: 1475, win: [1190, 1310], cal: 1540,
  pause: [6.2, 9.4], glance: [4.4, 6.0]};
FK.top = FK.F - 0.43 * FK.H;
const e5Gust = (t) => 0.5 + 0.5 * Math.max(0, Math.sin(t * 0.9) * Math.sin(t * 0.37 + 1));
function e5SodRoom(t) {
  const {x0, x1, ceil, wallFoot, F} = FK, b = [], r = rng(541), g = e5Gust(t);
  b.push(`<rect x="-1500" y="-1200" width="5000" height="3600" fill="#070605"/>`);
  // sod blocks: courses of irregular cut turves, roots and grass at the joints, a little whitewash wearing off at eye height
  b.push(`<rect x="${x0}" y="${ceil}" width="${x1 - x0}" height="${wallFoot - ceil}" fill="#3A3024"/><g clip-path="url(#fkroom)">`);
  for (let y = ceil, row = 0; y < wallFoot; y += 44, row++) for (let x = x0 - (row % 2) * 60; x < x1; x += 100 + r() * 30) {
    const w = 96 + r() * 26, sh = r();
    b.push(`<rect x="${f1(x + 2 + r() * 4)}" y="${f1(y + 1 + r() * 5)}" width="${f1(w - 8)}" height="${f1(34 + r() * 6)}" rx="11" fill="${sh < 0.33 ? '#433728' : sh < 0.66 ? '#3F3326' : '#352B20'}"/>`);
    if (r() < 0.6) b.push(`<path d="M${f1(x + 10 + r() * 60)},${f1(y + 42)} l-4,-9 M${f1(x + 14 + r() * 60)},${f1(y + 42)} l1,-11 M${f1(x + 30 + r() * 50)},${f1(y + 42)} l4,-8 M${f1(x + 40 + r() * 50)},${f1(y + 2)} q-6,8 -2,14" stroke="#2A2318" stroke-width="2" fill="none"/>`);
  }
  b.push(`</g><rect x="${x0}" y="${ceil + 160}" width="${x1 - x0}" height="300" fill="#CFC2A4" opacity="0.07"/>`);
  // the muslin ceiling sagging between poles
  b.push(`<rect x="${x0}" y="${ceil - 60}" width="${x1 - x0}" height="60" fill="#211B13"/>` + [...Array(6).keys()].map((i) => { const a = x0 + i * (x1 - x0) / 6, w = (x1 - x0) / 6;
    return `<path d="M${f1(a)},${ceil - 6} Q${f1(a + w / 2)},${ceil + 30} ${f1(a + w)},${ceil - 6} L${f1(a + w)},${ceil - 60} L${f1(a)},${ceil - 60} Z" fill="#6E6450" opacity="0.6"/>`; }).join('') +
    [...Array(7).keys()].map((i) => `<rect x="${f1(x0 + i * (x1 - x0) / 6 - 7)}" y="${ceil - 60}" width="14" height="${f1(56)}" fill="#1A140D"/>`).join(''));
  // the window: deep in the thick wall (splayed reveals), night outside, snow driving past in gusts, a drift on the sill
  const [w0, w1] = FK.win, wy0 = 430, wy1 = 560;
  b.push(`<path d="M${w0 - 40},${wy0 - 34} L${w1 + 40},${wy0 - 34} L${w1 + 40},${wy1 + 30} L${w0 - 40},${wy1 + 30} Z" fill="#2A2219"/><path d="M${w0 - 40},${wy1 + 30} L${w0},${wy1} L${w1},${wy1} L${w1 + 40},${wy1 + 30} Z" fill="#4A3E2E"/>` +
    `<rect x="${w0}" y="${wy0}" width="${w1 - w0}" height="${wy1 - wy0}" fill="#1A2A33"/>`);
  const sn = []; const rs = rng(543);
  for (let i = 0; i < 40; i++) { const sp = 160 + 260 * g, y0 = rs() * 200, x0s = rs() * 300, x = w0 + ((x0s + t * sp) % 300) - 80, y = wy0 + ((y0 + t * (60 + 40 * rs())) % 150) - 10;
    sn.push(line([[x, y], [x - 6 - 10 * g, y - 2]], '#E6EEF0', 1.6, `opacity="${f1(0.4 + 0.5 * rs())}"`)); }
  b.push(`<g clip-path="url(#fkwin)">${sn.join('')}<path d="M${w0},${wy1} q30,-26 60,-16 q30,-18 ${w1 - w0 - 60},6 L${w1},${wy1} Z" fill="#DCE4E6" opacity="0.85"/></g>` +
    `<rect x="${(w0 + w1) / 2 - 3}" y="${wy0}" width="6" height="${wy1 - wy0}" fill="#120D08"/><rect x="${w0}" y="${(wy0 + wy1) / 2 - 3}" width="${w1 - w0}" height="6" fill="#120D08"/><rect x="${w0}" y="${wy0}" width="${w1 - w0}" height="${wy1 - wy0}" fill="none" stroke="#120D08" stroke-width="8"/>` +
    [[w0 + 4, wy0 + 4, 1, 1], [w1 - 4, wy0 + 4, -1, 1]].map(([x, y, dx, dy]) => `<path d="M${x},${y} q${dx * 30},${dy * 4} ${dx * 40},${dy * 26} q${-dx * 20},${-dy * 6} ${-dx * 40},${dy * 18} Z" fill="#E6EEEC" opacity="0.4"/>`).join('') + glowC((w0 + w1) / 2, (wy0 + wy1) / 2, 200, 0.3, 'kfcold'));
  // the calendar: a picture at the top, a grid of days, a page curling in the draught
  const cx = FK.cal, cy = 440, cu = 4 * g;
  b.push(`<rect x="${cx}" y="${cy}" width="74" height="104" fill="#D8CFB8" opacity="0.85"/><rect x="${cx + 6}" y="${cy + 6}" width="62" height="34" fill="#6B7A6E" opacity="0.8"/><path d="M${cx + 6},${cy + 34} q20,-12 30,-4 q14,-10 32,0 L${cx + 68},${cy + 40} L${cx + 6},${cy + 40} Z" fill="#4E5A50"/>` +
    [...Array(5).keys()].map((ry) => [...Array(7).keys()].map((rx) => `<rect x="${cx + 7 + rx * 9}" y="${cy + 48 + ry * 10}" width="7" height="7" fill="none" stroke="#5A5040" stroke-width="1"/>`).join('')).join('') +
    `<path d="M${cx + 74},${cy + 104} L${cx + 74 - 10 - cu},${cy + 104 - cu * 0.5} L${cx + 74},${cy + 90} Z" fill="#BFB59C"/><circle cx="${cx + 37}" cy="${cy - 2}" r="3" fill="#120D08"/>`);
  // a shelf with tins and a crock; a coat and a hat on pegs by the door side
  b.push(`<rect x="900" y="420" width="220" height="10" fill="#1A140D"/>` + [[912, 40], [952, 54], [1010, 34], [1052, 46]].map(([x, h]) => `<rect x="${x}" y="${420 - h}" width="30" height="${h}" rx="3" fill="#1D1912"/>`).join(''));
  // the floor: packed earth with a rag rug
  b.push(`<rect x="${x0}" y="${wallFoot - 10}" width="${x1 - x0}" height="10" fill="#2A2218"/><rect x="${x0}" y="${wallFoot}" width="${x1 - x0}" height="${F + 80 - wallFoot}" fill="#3A2F22"/><rect x="${x0}" y="${wallFoot}" width="${x1 - x0}" height="${F + 80 - wallFoot}" fill="url(#matFloorShade)"/>` +
    `<ellipse cx="1000" cy="${F + 26}" rx="230" ry="22" fill="#5A4636" opacity="0.7"/><ellipse cx="1000" cy="${F + 26}" rx="190" ry="16" fill="none" stroke="#6E5A44" stroke-width="4" opacity="0.6"/>`);
  for (let k = 0; k < 18; k++) b.push(`<ellipse cx="${f1(x0 + r() * (x1 - x0))}" cy="${f1(wallFoot + 10 + r() * 140)}" rx="${f1(4 + r() * 16)}" ry="${f1(1 + r() * 3)}" fill="#1E180F" opacity="0.4"/>`);
  const c = '#050505', f = `<rect x="${x0 - 40}" y="${ceil - 120}" width="40" height="${F - ceil + 220}" fill="${c}"/><rect x="${x1}" y="${ceil - 120}" width="40" height="${F - ceil + 220}" fill="${c}"/>` +
    `<rect x="${x0 - 40}" y="${ceil - 120}" width="${x1 - x0 + 80}" height="62" fill="${c}"/><rect x="${x0 - 40}" y="${F + 80}" width="${x1 - x0 + 80}" height="80" fill="${c}"/>`;
  return {back: b.join(''), front: f};
}
// the bed in the corner: iron frame, straw tick, a patchwork quilt rising and falling with the child's breathing; the child's head
// (coral, an ink outline) on the pillow, asleep, face turned to the wall
function e5Bed(t) {
  const [b0, b1] = FK.bed, F = FK.F, top = F - 120, br = 1 + 0.012 * Math.sin(t * 1.6), s = [];
  s.push(MAT.shadow((b0 + b1) / 2, F + 4, 180, 0.45) + `<rect x="${b0}" y="${top - 110}" width="12" height="${F - top + 110}" fill="#1A1A18"/><rect x="${b1 - 12}" y="${top - 60}" width="12" height="${F - top + 60}" fill="#1A1A18"/>` +
    line([[b0 + 6, top - 106], [b0 + 6, top - 50]], '#1A1A18', 3) + [0, 1, 2].map((i) => line([[b0 + 12, top - 90 + i * 22], [b0 + 30, top - 90 + i * 22]], '#1A1A18', 3)).join('') +
    `<rect x="${b0 + 8}" y="${top}" width="${b1 - b0 - 16}" height="26" fill="#6E6450"/><rect x="${b0 + 8}" y="${top + 26}" width="${b1 - b0 - 16}" height="12" fill="#1A1A18"/>`);
  s.push(`<ellipse cx="${b0 + 70}" cy="${top - 10}" rx="52" ry="18" fill="#D8D0BC"/>`);
  const hx = b0 + 74, hy = top - 30, hd = `<circle cx="${hx}" cy="${hy}" r="23" fill="${E5.coral}"/><path d="M${hx - 22},${hy - 6} q4,-22 26,-20 q18,4 18,14 q-20,-8 -44,6 Z" fill="#B5463D"/>`;
  s.push(`<circle cx="${hx}" cy="${hy}" r="26" fill="#0D0C09"/>` + hd);
  const qy = top - 34 * br;
  s.push(`<path d="M${b0 + 96},${top + 4} Q${b0 + 110},${qy - 6} ${b0 + 170},${qy} Q${b0 + 260},${qy + 6} ${b1 - 30},${top - 10} L${b1 - 14},${top + 30} L${b0 + 92},${top + 30} Z" fill="#5C4A3E"/>` +
    [...Array(6).keys()].map((i) => `<rect x="${b0 + 110 + i * 70}" y="${f1(qy + 10 + (i % 2) * 8)}" width="36" height="22" fill="${['#7A5A44', '#4E5A50', '#8A7A5A'][i % 3]}" opacity="0.6"/>`).join(''));
  return s.join('');
}
function renderE5Farm(t, o = {}) {
  const {H, F, top} = FK, c = cam2(o.cam || camAt([[0, 1.38, 970, 625], [7, 1.44, 1000, 632], [16, 1.48, 995, 642]], t));
  const lod = lodFor(H * c.z), det = lod.det, g = e5Gust(t), room = e5SodRoom(t), s = [room.back];
  const lampX = 1255, fl = e5Flick(t) * (1 - 0.12 * g * Math.max(0, Math.sin(t * 7.1))), rimL = (x) => ({c: '#FFE0B0', a: lod.rimA * 0.7 * fl, dx: x > lampX ? -0.008 : 0.008, dy: -0.005});
  const OWEN = {kind: 'man', hat: 'none', coat: 'vest', beard: true, fill: E5.coral, tones: MICHAEL_TONES};
  const WIFE = {kind: 'woman', hat: 'kerchief', coat: 'frock', wear: ['plain', 'apron'], fill: E5.coral, tones: MICHAEL_TONES};
  // the stove, its pipe through the ceiling, the kettle steaming, the fire's glow
  const [s0, s1] = FK.stove, sy = FK.wallFoot - 210;
  s.push(`<rect x="${s0}" y="${sy}" width="${s1 - s0}" height="170" fill="#0D0C09"/><rect x="${s0 - 10}" y="${sy - 12}" width="${s1 - s0 + 20}" height="14" fill="#0D0C09"/><rect x="${s0 + 14}" y="${FK.wallFoot - 40}" width="14" height="${F - FK.wallFoot + 40}" fill="#0D0C09"/><rect x="${s1 - 28}" y="${FK.wallFoot - 40}" width="14" height="${F - FK.wallFoot + 40}" fill="#0D0C09"/>` +
    `<rect x="${s0 + 110}" y="${FK.ceil - 60}" width="26" height="${sy - 12 - FK.ceil + 60}" fill="#0D0C09"/><rect x="${s0 + 26}" y="${sy + 50}" width="70" height="44" fill="#FFB15C" opacity="${f1(0.6 * (0.85 + 0.15 * Math.sin(t * 9)))}"/>` + glowC(s0 + 60, sy + 70, 320, 0.5 * fl, 'mswarm'));
  const kx = s0 + 46, ky = sy - 12;
  s.push(`<path d="M${kx - 30},${ky} q-4,-40 30,-44 q34,4 30,44 Z" fill="#141817"/><path d="M${kx + 26},${ky - 26} l26,-18 l4,6 l-24,20 Z" fill="#141817"/><path d="M${kx - 18},${ky - 40} q18,-30 36,0" stroke="#141817" stroke-width="5" fill="none"/>` +
    MAT.smoke(kx + 54, ky - 46, t, {col: 'D9DEDA', k: 0.45, n: 7, rise: 150, drift: 30 + 40 * g, speed: 3.2, seed: 547}).replace(/opacity="([\d.]+)"/g, (m, a) => `opacity="${f1(Number(a) * 0.55 * 100) / 100}"`));
  // ---- the wife at the stove: a hand on the kettle's handle, the other stirring the pot; she glances over at Owen once ----
  const wx = s1 + 110, gl = t > FK.glance[0] && t < FK.glance[1];
  let wf = e5Standing({...WIFE, x: wx, h: H * 0.9, d: gl ? 1 : -1, det, rim: rimL(wx)}, wx, F, t, 0.3, 'fk.wife', {tilt: gl ? 2 : -12, expr: 'neutral', blink: (t + 0.4) % 3.9 < 0.12});
  const potX = s0 + 130, potY = sy - 12;
  s.push(`<path d="M${potX - 26},${potY} l4,-34 l48,0 l4,34 Z" fill="#141817"/>`);
  let spoon = '';
  if (!gl) { const k = Math.sin(t * 2.6); wf = {...wf, an: {...wf.an, lean: 8}}; wf = reach(wf, 'f', potX + 10 * k, potY - 40 - 3 * Math.abs(k), 'fk.wife.spoon'); spoon = holding(wf, 'f', 'fk.spoon', (gx, gy) => line([[gx, gy], [gx - 4, gy + 30]], '#3A2C1C', 4)); }
  // ---- the table: the lamp, the pile of bills and the mortgage papers (a small red stamp on the top sheet), Owen's letter ----
  const [tx0, tx1] = FK.table, papX = 1150, letX = 1355;
  const table = MAT.shadow((tx0 + tx1) / 2, F + 4, 170, 0.45) + `<rect x="${tx0}" y="${top}" width="${tx1 - tx0}" height="14" fill="#2B2418"/><rect x="${tx0}" y="${top}" width="${tx1 - tx0}" height="3" fill="#FFE6C0" opacity="0.22"/>` +
    `<rect x="${tx0 + 14}" y="${top + 14}" width="12" height="${F - top - 14}" fill="#0D0C09"/><rect x="${tx1 - 26}" y="${top + 14}" width="12" height="${F - top - 14}" fill="#0D0C09"/>` +
    [0, 1, 2, 3, 4, 5].map((i) => `<rect x="${papX - 4 + (i % 2) * 6}" y="${top - 3 - i * 3}" width="70" height="3" fill="${i % 3 === 1 ? '#CFC4A8' : '#E3DAC4'}" transform="rotate(${(i % 3) - 1}, ${papX + 30}, ${top - i * 3})"/>`).join('') +
    `<path d="M${papX + 4},${top - 21} L${papX + 72},${top - 25} L${papX + 76},${top - 21} L${papX + 6},${top - 18} Z" fill="#EFE7D2"/><ellipse cx="${papX + 52}" cy="${top - 22}" rx="7" ry="2.2" fill="#B8322A"/>` +
    `<path d="M${letX - 34},${top} L${letX + 30},${top - 4} L${letX + 34},${top} Z" fill="#EFE7D2"/><rect x="${letX - 60}" y="${top - 14}" width="14" height="14" rx="3" fill="#0D0C09"/>` + e5Lamp(lampX, top, t * (1 + 0.3 * g), 1.05, 2);
  // ---- Owen at the table: writes; stops, looks at the pile, rubs his brow; writes on ----
  const [p0, p1] = FK.pause, paused = t > p0 && t < p1, rub = smooth(p0 + 0.9, p0 + 1.3, t) * (1 - smooth(p1 - 1.0, p1 - 0.6, t));
  let ow = e5Sit({...OWEN, h: H, d: -1, det, rim: rimL(FK.chair)}, FK.chair, F - 0.24 * H, F, t, 0.2, 'fk.owen.seat', {tilt: paused ? -6 - 10 * smooth(p0, p0 + 0.6, t) + 14 * rub : -16, expr: 'set', blink: (t + 1.2) % 4.1 < 0.12});
  const wu = ((t < p0 ? t : t > p1 ? t - (p1 - p0) : p0) * 0.12) % 1, nib = [letX + 18 - 40 * wu + 2.5 * Math.sin(t * 27), top - 2 - Math.abs(2 * Math.sin(t * 15))];
  const penHome = [letX + 20, top - 34];
  if (paused) { const k = smooth(p0, p0 + 0.4, t) * (1 - smooth(p1 - 0.4, p1, t)); ow = k < 1 ? e3Move(ow, 'f', lerp(nib[0] + 7, penHome[0], k), lerp(nib[1] - 20, penHome[1], k), 'fk.owen.lift') : reach(ow, 'f', penHome[0], penHome[1], 'fk.owen.penUp'); }
  else ow = reach(ow, 'f', nib[0] + 7, nib[1] - 20, 'fk.owen.write');
  if (rub > 0) { const brow = E3K.toWorld(ow, 0.07, 0.95), rest = [letX + 14, top - 3], k = rub; ow = k < 1 ? e3Move(ow, 'b', lerp(rest[0], brow[0], k), lerp(rest[1], brow[1], k), 'fk.owen.toBrow', true) : e3Move(ow, 'b', brow[0] + 3 * Math.sin(t * 6), brow[1], 'fk.owen.brow', true); }
  else ow = reach(ow, 'b', letX + 14, top - 3, 'fk.owen.letter');
  const ink = (t > 0.3 ? line([[letX + 18, top - 2], [letX + 18 - 40 * wu, top - 2]], '#1C1A16', 1.2, 'opacity="0.7"') : '');
  const pen = holding(ow, 'f', 'fk.owen.pen', (gx, gy) => line([[gx, gy], [gx - 7, gy + 20]], '#0D0C09', 2.4) + line([[gx + 2, gy], [gx + 9, gy - 20]], '#E9E0C8', 1.4, 'opacity="0.8"'));
  const chair = `<rect x="${FK.chair - 50}" y="${F - 0.24 * H}" width="100" height="12" fill="#0D0C09"/><rect x="${FK.chair - 46}" y="${F - 0.24 * H + 12}" width="10" height="${0.24 * H - 12}" fill="#0D0C09"/><rect x="${FK.chair + 36}" y="${F - 0.24 * H + 12}" width="10" height="${0.24 * H - 12}" fill="#0D0C09"/><rect x="${FK.chair + 40}" y="${F - 0.24 * H - 210}" width="10" height="210" fill="#0D0C09"/>`;
  // ---- draw ----
  s.push(e5Bed(t), e4Outlined(wf) + spoon, chair, e4Outlined(ow), pen, table, ink, room.front);
  const world = layerAt(c, 1, s.join(''));
  const scr = o.quiet ? '' : tag(130, 120, 'NEAR O\'NEILL, HOLT COUNTY, NEBRASKA · WINTER 1890', smooth(0.3, 0.7, t) * (1 - smooth(4.0, 4.4, t)));
  return frame(e5Defs(t, `<clipPath id="fkroom"><rect x="${FK.x0}" y="0" width="${FK.x1 - FK.x0}" height="1200"/></clipPath><clipPath id="fkwin"><rect x="${FK.win[0]}" y="430" width="${FK.win[1] - FK.win[0]}" height="130"/></clipPath><radialGradient id="kfcold"><stop offset="0" stop-color="#CFE0DE" stop-opacity="0.35"/><stop offset="1" stop-color="#CFE0DE" stop-opacity="0"/></radialGradient>`), `<rect width="1920" height="1080" fill="#070605"/>`, world, scr, t);
}
if (typeof window !== 'undefined') Object.assign(window, {renderE5Farm});
Object.assign(CLIPS, {ep5_farm_kitchen: {sec: FK.sec, render: (t) => renderE5Farm(t)}});
