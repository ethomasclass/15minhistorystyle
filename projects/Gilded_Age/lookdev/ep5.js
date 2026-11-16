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
