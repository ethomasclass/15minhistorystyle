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

/* ================= ep5_homestead_dawn: the barges come up the Monongahela, July 6, 1892, before dawn (18 s) ================= */
// Looking across the river from the Homestead bank in the last of the night: the far hills, mist lying on the water and drifting, the
// Carnegie works on the near bank to the right (long sheds, a row of stacks, the furnaces banked: a faint glow in a few windows; the
// mill is locked out). A small tug tows two covered barges upriver toward the works' landing, its stack smoking, one lit window.
// The townspeople (ink, small and faceless in the half light) come along the bank with lanterns and gather at the landing; some point.
// As the barges near the landing (about 14 s) a few tiny muzzle flashes far off at the barges' bows and the bank, puffs of smoke
// drifting into the mist; the crowd flinches and stands its ground; no one falls. Scale: a man 150 to 200 px by depth.
const HD = {sec: 18, W0: 560, W1: 795, land: [1150, 1330], flash: [[14.3, 1040, 668], [14.55, 1290, 778], [14.75, 1010, 664], [15.2, 1310, 782], [15.65, 1050, 670], [16.3, 1280, 780]]};
const e5BargePath = (t) => { const u = e3Trap(t, 0, 17.4, 0.05) * 0.8 + 0.2 * smooth(0, 17.4, t); return {x: lerp(-420, 960, u), y: lerp(668, 762, u * u), k: lerp(0.5, 0.82, u)}; };
function e5Barge(x, y, k, t, seed) { // a covered barge (x = its bow, facing right): low hull, a long roofed house with dark vents
  const L = 420 * k, s = [];
  s.push(`<path d="M${f1(x - L)},${f1(y - 26 * k)} L${f1(x - 10 * k)},${f1(y - 26 * k)} L${f1(x)},${f1(y - 12 * k)} L${f1(x - 8 * k)},${f1(y)} L${f1(x - L)},${f1(y)} Z" fill="#101415"/>`);
  s.push(`<path d="M${f1(x - L + 16 * k)},${f1(y - 26 * k)} L${f1(x - L + 16 * k)},${f1(y - 70 * k)} L${f1(x - L / 2)},${f1(y - 84 * k)} L${f1(x - 30 * k)},${f1(y - 70 * k)} L${f1(x - 30 * k)},${f1(y - 26 * k)} Z" fill="#161B1C"/>`);
  for (let i = 0; i < 9; i++) s.push(`<rect x="${f1(x - L + 40 * k + i * 40 * k)}" y="${f1(y - 58 * k)}" width="${f1(14 * k)}" height="${f1(6 * k)}" fill="#05080A"/>`);
  s.push(line([[x - L + 16 * k, y - 70 * k], [x - L / 2, y - 84 * k], [x - 30 * k, y - 70 * k]], '#AEBBBC', 1.4 * k, 'opacity="0.35"'));
  return s.join('');
}
function e5Tug(x, y, k, t) { // the tug (x = its bow, facing right): hull, cabin with a lit window, pilot house, tall stack; smoke and wake
  const s = [];
  s.push(`<path d="M${f1(x - 150 * k)},${f1(y - 22 * k)} L${f1(x - 10 * k)},${f1(y - 26 * k)} L${f1(x)},${f1(y - 14 * k)} L${f1(x - 12 * k)},${f1(y)} L${f1(x - 140 * k)},${f1(y)} Z" fill="#0D1011"/>`);
  s.push(`<rect x="${f1(x - 120 * k)}" y="${f1(y - 52 * k)}" width="${f1(80 * k)}" height="${f1(28 * k)}" fill="#121617"/><rect x="${f1(x - 64 * k)}" y="${f1(y - 76 * k)}" width="${f1(30 * k)}" height="${f1(24 * k)}" fill="#121617"/>`);
  s.push(`<rect x="${f1(x - 58 * k)}" y="${f1(y - 70 * k)}" width="${f1(16 * k)}" height="${f1(9 * k)}" fill="#FFCB80" opacity="${f1(0.8 * e5Flick(t, 7))}"/>` + glowC(x - 50 * k, y - 66 * k, 60 * k, 0.6, 'e5lant'));
  s.push(`<rect x="${f1(x - 100 * k)}" y="${f1(y - 110 * k)}" width="${f1(12 * k)}" height="${f1(60 * k)}" fill="#0D1011"/>` + MAT.smoke(x - 94 * k, y - 112 * k, t, {col: '6A625C', k: 0.9 * k, n: 8, rise: 150, drift: -260, speed: 5, seed: 523}));
  s.push(line([[x - 150 * k, y - 18 * k], [x - 220 * k, y - 10 * k]], '#0D1011', 1.2)); // the tow line back to the barges
  return s.join('');
}
function e5Works(t) { // the Homestead works on the near bank to the right: sheds, a row of stacks, banked furnaces
  const s = [], fl = 0.8 + 0.2 * Math.sin(t * 1.3) * Math.sin(t * 0.7 + 1);
  for (const [sx, sw, sh] of [[1360, 22, 520], [1430, 26, 600], [1505, 22, 560], [1580, 28, 640], [1660, 22, 540], [1735, 26, 610], [1820, 24, 580], [1900, 28, 620]]) {
    s.push(`<rect x="${sx}" y="${770 - sh}" width="${sw}" height="${sh}" fill="#1D2629"/><rect x="${sx - 3}" y="${770 - sh}" width="${sw + 6}" height="8" fill="#1A2224"/>`);
    s.push(MAT.smoke(sx + sw / 2, 770 - sh - 6, t + sx * 0.01, {col: '8C9A9C', k: 0.8, n: 5, rise: 160, drift: -200, speed: 9, seed: sx}).replace(/opacity="([\d.]+)"/g, (m, a) => `opacity="${f1(Number(a) * 0.35 * 100) / 100}"`));
  }
  // long sheds with sawtooth roofs; a few windows glowing faintly
  s.push(`<path d="M1280,800 L1280,600 ${[...Array(9).keys()].map((i) => `L${1280 + i * 90},560 L${1280 + i * 90 + 90},600`).join(' ')} L2110,800 Z" fill="#232D30"/>`);
  s.push(`<path d="M1500,800 L1500,520 L1720,470 L1940,520 L1940,800 Z" fill="#1F282B"/>`);
  for (let i = 0; i < 12; i++) { const wx = 1310 + i * 64, a = (i % 3 === 1 ? 0.55 : 0.14) * fl; s.push(`<rect x="${wx}" y="650" width="22" height="34" fill="#FF9A4A" opacity="${f1(a)}"/>`); }
  s.push(glowC(1640, 640, 260, 0.35 * fl, 'e4glow'));
  return s.join('');
}
function renderE5Homestead(t, o = {}) {
  const c = cam2(o.cam || camAt([[0, 1.0, 900, 560], [9, 1.08, 980, 585], [18, 1.24, 1060, 615]], t)), s = [];
  // sky (behind the camera layer: a slight parallax), far hills, the river and mist
  const sky = `<rect width="1920" height="1080" fill="url(#hdsky)"/>` + `<ellipse cx="${f1(1500 - (c.ux - 960) * 0.2)}" cy="560" rx="900" ry="200" fill="url(#hddawn)" opacity="${f1(0.55 + 0.25 * smooth(0, 18, t))}"/>`;
  s.push(`<path d="M-600,560 L-600,470 Q-300,430 0,470 Q260,500 520,440 Q800,400 1100,470 Q1400,520 1700,450 Q2000,410 2600,470 L2600,560 Z" fill="#3A4A4E"/>` + MAT.trees([[-600, 470], [0, 470], [520, 440], [1100, 470], [1700, 450], [2600, 470]], {col: '#33434A', seed: 531, size: 22, every: 0.5}));
  s.push(`<path d="M-600,${HD.W0} L-600,520 Q200,505 900,530 Q1600,550 2600,515 L2600,${HD.W0} Z" fill="#2E3D41"/>`);
  s.push(e5Mist(t, -600, 2600, 470, 560, {n: 10, seed: 532, speed: 6, op: 0.55, h: 40}));
  s.push(MAT.water(-600, HD.W0, 3200, HD.W1 - HD.W0, t, {top: '#55666A', bottom: '#2A3639', seed: 533, glint: '#C9D4D2', n: 90}));
  // the works on the near bank (right) and its reflection
  s.push(e5Works(t));
  // the barges and tug, coming up from the left toward the landing; their wake
  const bp = e5BargePath(t), k = bp.k;
  s.push(`<ellipse cx="${f1(bp.x - 160)}" cy="${f1(bp.y + 4)}" rx="420" ry="10" fill="#1A2224" opacity="0.5"/>` + [0, 1, 2].map((i) => line([[bp.x + 40 - i * 30, bp.y + 2 + i * 3], [bp.x - 260 - i * 80, bp.y + 10 + i * 9]], '#AEBBBC', 1.5, `opacity="${0.35 - i * 0.1}"`)).join(''));
  s.push(e5Barge(bp.x - 10 * k, bp.y - 12 * k, k * 0.94, t, 1), e5Barge(bp.x + 20 * k, bp.y, k, t, 2), e5Tug(bp.x + 270 * k, bp.y + 2, k, t));
  // the muzzle flashes, far off, and their smoke (brief; no one is seen hit)
  for (let [ft, fx, fy] of HD.flash) { const onBarge = fx < 1100, x = onBarge ? bp.x + (fx - 1060) * k : fx; if (onBarge) fy = bp.y - 40 * k + (fy - 668);
    if (t > ft && t < ft + 0.14) s.push(glowC(x, fy, 26, 1 - (t - ft) / 0.14, 'e5flash') + `<circle cx="${x}" cy="${fy}" r="2.5" fill="#FFF8E8"/>`);
    if (t > ft) { const u = t - ft; s.push(`<circle cx="${f1(x - 6 * u)}" cy="${f1(fy - 10 * u)}" r="${f1(6 + 9 * u)}" fill="url(#puffB8C4C4)" opacity="${f1(Math.max(0, 0.55 - 0.16 * u) * 100) / 100}"/>`); } }
  // mist on the water, drifting slowly over the barges
  s.push(e5Mist(t, -600, 2600, 600, 780, {n: 18, seed: 534, speed: 10, op: 0.6, h: 46}));
  // the near bank: a mud slope to the water, the works' landing (planks on piles), the ground where the crowd stands
  s.push(`<path d="M-600,${HD.W1} L2600,${HD.W1} L2600,1300 L-600,1300 Z" fill="#141819"/><path d="M-600,${HD.W1} L2600,${HD.W1} L2600,${HD.W1 + 34} L-600,${HD.W1 + 40} Z" fill="#262E30"/>` + MAT.ground(-600, 2600, HD.W1 + 36, {base: '#141819', seed: 535}));
  const [l0, l1] = HD.land;
  s.push(`<rect x="${l0}" y="${HD.W1 - 12}" width="${l1 - l0}" height="12" fill="#1F2426"/>` + [0, 1, 2, 3, 4].map((i) => `<rect x="${l0 + 8 + i * 42}" y="${HD.W1 - 4}" width="7" height="24" fill="#0D1011"/>`).join('') + line([[l0, HD.W1 - 12], [l1, HD.W1 - 12]], '#AEBBBC', 1.2, 'opacity="0.3"'));
  // ---- the crowd: three depths, some walking in from the left with lanterns, gathering at the landing; some point at the barges ----
  const rows = [{G: 880, H: 150}, {G: 940, H: 175}, {G: 1005, H: 200}], P = [], shots = t > HD.flash[0][0];
  const flinch = (ph) => e4Bump(t, HD.flash[0][0] + 0.05 + ph * 0.2, 0.7);
  const people = [ // [row, x, kind, hat, lantern, walk {t0, t1, to} | null, point time]
    [0, 980, 'man', 'cap', 1, null, 11.5], [0, 1060, 'man', 'bowler', 0, null, 0], [0, 1270, 'man', 'cap', 1, null, 12.2], [0, 1380, 'woman', 'kerchief', 0, null, 0], [0, 1450, 'man', 'cap', 0, null, 13],
    [0, 300, 'man', 'cap', 1, {t0: 0.5, t1: 9.5, to: 860}, 0], [0, 120, 'man', 'bowler', 0, {t0: 1.5, t1: 11.0, to: 760}, 0],
    [1, 900, 'man', 'cap', 0, null, 12.8], [1, 1120, 'man', 'bowler', 1, null, 0], [1, 1220, 'man', 'cap', 0, null, 11.0], [1, 1340, 'man', 'cap', 1, null, 0],
    [1, 160, 'woman', 'kerchief', 1, {t0: 2.0, t1: 12.0, to: 1010}, 0], [1, -40, 'man', 'cap', 1, {t0: 0.0, t1: 10.5, to: 700}, 0], [1, 1520, 'man', 'bowler', 0, null, 0],
    [2, 820, 'man', 'cap', 1, null, 0], [2, 1010, 'man', 'cap', 0, null, 12.5], [2, 1180, 'man', 'bowler', 0, null, 0], [2, 1330, 'man', 'cap', 1, null, 0],
    [2, 380, 'man', 'cap', 1, {t0: 0.2, t1: 8.6, to: 640}, 0], [2, 60, 'man', 'cap', 0, {t0: 3.0, t1: 13.0, to: 520}, 0],
  ];
  const rimSky = {c: '#C9D4D2', a: 0.35, dx: 0.006, dy: -0.007};
  people.forEach(([ri, x, kind, hat, lant, walk, pt], i) => {
    const {G, H} = rows[ri], name = `hd.p${i}`, base = {kind, hat, coat: i % 3 ? 'jacket' : 'sack', wear: kind === 'woman' ? ['plain', 'shawl'] : [], h: kind === 'woman' ? H * 0.9 : H, fill: E5.ink, det: 0, rim: rimSky, tones: {tone: '#1C2122', lite: '#2C3335'}};
    const an0 = {fArm: lant ? [174, 178] : undefined, tilt: 4 * Math.sin(t * 0.5 + i)};
    let fo;
    if (walk) { const tr = e4Track({...base, an: {...an0}}, {x, d: 1, G, ph: i * 0.13, walks: [{...walk, dAfter: 1, a: 0.12, carry: !!lant, an: lant ? {fArm: [174, 178]} : {}}]}, t, name); fo = tr.fo; }
    else fo = e5Standing({...base, d: x > 1250 ? -1 : 1}, x, G, t, i * 0.17, name, an0.fArm ? {fArm: an0.fArm} : {});
    const fk = shots ? flinch(i % 4) : 0;
    if (fk > 0) fo = {...fo, an: {...fo.an, lean: (fo.an.lean || 0) - 9 * fk, tilt: (fo.an.tilt || 0) - 6 * fk}};
    if (pt && !lant && t > pt && t < pt + 2.4) { const u = smooth(pt, pt + 0.4, t) * (1 - smooth(pt + 2.0, pt + 2.4, t)); fo = {...fo, an: {...fo.an, fArm: [lerp(176, 72, u), lerp(180, 80, u)]}}; }
    const lan = lant ? holding(fo, 'f', name + '.lantern', (gx, gy) => e5Lantern(gx, gy, t, i * 1.3, H / 190)) : '';
    P.push({ri, svg: fig(fo) + lan});
  });
  [0, 1, 2].forEach((ri) => P.filter((p) => p.ri === ri).forEach((p) => s.push(p.svg)));
  // low mist curling along the bank in front
  s.push(e5Mist(t, -600, 2600, 860, 1060, {n: 10, seed: 536, speed: 7, op: 0.28, h: 50}));
  const world = layerAt(c, 1, s.join(''));
  const scr = o.quiet ? '' : tag(130, 120, 'HOMESTEAD, PENNSYLVANIA · JULY 6, 1892 · 4 A.M.', smooth(0.3, 0.7, t) * (1 - smooth(4.2, 4.6, t)));
  return frame(e5Defs(t, grad('hdsky', [['0', '#0A1216'], ['0.55', '#22323A'], ['0.85', '#56666A'], ['1', '#7C8886']]) +
    `<radialGradient id="hddawn"><stop offset="0" stop-color="#C8A88E" stop-opacity="0.45"/><stop offset="1" stop-color="#C8A88E" stop-opacity="0"/></radialGradient>` +
    `<clipPath id="hdwater"><rect x="-600" y="${HD.W0}" width="3200" height="${HD.W1 - HD.W0}"/></clipPath>`), sky, world, scr, t);
}
if (typeof window !== 'undefined') Object.assign(window, {renderE5Homestead});
Object.assign(CLIPS, {ep5_homestead_dawn: {sec: HD.sec, render: (t) => renderE5Homestead(t)}});
