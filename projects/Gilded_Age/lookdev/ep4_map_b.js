// Episode 4, chapters 5 to 8 (the chapters 5 to 8 builder): the machine network on the 3D model, and two small drawn scenes.
// Load after ep3_map.js, ep4.js, ep4_b.js and ep4_explain_b.js (bridge.html, ep4/edit/edit.html). ep4_map.js holds chapters 1 to 4.
//
//   ep4_network   ch5  The signature shot. The Kellys' Brooklyn blocks on the 3D model (ep3_map.js), widened to sixteen blocks in
//                      four wards. A captain (a dot) over every block, teal lines up to each ward's boss and up to the boss. Favors
//                      flow down as small gold glints, votes flow up as teal pulses. The fire block (two doors from the Kellys,
//                      January 1887) lights up as a callback. renderMachineNet(n, cfg): n is the chapter's narration time; cfg holds
//                      the camera keys and the beats (favors named, votes named), so the edit can visit it twice.
//   ep4_repeater  ch5  A polling table, election day: a man steps up and gives his name as the local bishop; the clerk looks at him,
//                      at the poll book, at him again, puts down his pen, sits back, folds his arms and shakes his head; the man
//                      deflates. Light comedy, silhouettes (rig.js, E3K contacts).
//   ep4_leak      ch6  The leak, 1871: a clerk alone at night in the county's accounting office, copying the books by lamplight
//                      into a small notebook, glancing back at the door once. Faceless (det 0: a real person,
//                      the clerk who copied the accounts), from the side.
//
// Colour rules: the Kellys coral (their building), the Rabinowitzes wheat gold, everyone else ink; teal draws the network; money
// only as small gold glints. Text: mono tags (emLabels), kept inside the title-safe area. No em dashes anywhere.

/* ================= ep4_network ================= */
const MN = {
  // blocks of the ward map: [x0, y0, x1, y1, modelled?]; the four modelled blocks are EM_BK's (with their buildings)
  blocks: (() => { const out = [], xs = [1450, 1800, 2150, 2500], ys = [-530, -280, 30, 280];
    xs.forEach((x, xi) => ys.forEach((y, yi) => {
      const mod = xi < 2 && (yi === 1 || yi === 2), y0 = mod ? (yi === 1 ? -230 : 30) : y;
      out.push({x0: x, x1: x + 300, y0, y1: y0 + 200, mod, xi, yi, ward: (xi < 2 ? 0 : 1) + (yi < 2 ? 0 : 2), seed: 900 + xi * 7 + yi * 13});
    })); return out; })(),
  capZ: 92, wardZ: 330, bossZ: 600,
};
MN.wards = [0, 1, 2, 3].map((w) => { const B = MN.blocks.filter((b) => b.ward === w); return [B.reduce((s, b) => s + (b.x0 + b.x1) / 2, 0) / B.length, B.reduce((s, b) => s + (b.y0 + b.y1) / 2, 0) / B.length, MN.capZ + MN.wardZ - MN.capZ]; });
MN.boss = [MN.wards.reduce((s, w) => s + w[0], 0) / 4, MN.wards.reduce((s, w) => s + w[1], 0) / 4, MN.bossZ];
MN.cap = (b) => [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, MN.capZ];
MN.kellyBlock = MN.blocks.find((b) => b.mod && b.yi === 2 && b.xi === 0);
MN.fireLot = 'B01s3'; // two doors down from the Kellys (lot 5), on their row

// a default camera (narration time keys) and beats; the edit passes its own
const MN_DEFAULT = {
  keys: [[0, 1960, -40, 150, 4, 33, 3300, 0, 40], [6, 1960, -20, 170, 12, 35, 2900, 0, 40], [12, 1980, 0, 200, 18, 37, 2700, 0, 30]],
  build: [0, 1.6], fire: [0.6, 99], favors: [[2.0, 'job', 'A CITY JOB'], [3.2, 'coal', 'HALF A TON OF COAL'], [5.4, 'judge', 'A WORD WITH THE JUDGE'], [8.0, 'papers', 'HELP WITH PAPERS']],
  favorsK: [0.8, 99], votesK: [99, 99], votes: [], labelsAt: [0.8, 99],
};
function mnPoint(a, b, u) { return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; }
function mnLine(cam, a, b, u, w = 4, op = 1) { // a teal 3D line drawn on from a to b (u 0..1), with the dark under-stroke
  if (u <= 0.005) return ''; const A = emP(cam, a), B = emP(cam, mnPoint(a, b, clamp01(u))); if (!A || !B) return '';
  return `<g opacity="${f1(op * 100) / 100}"><line x1="${f1(A[0])}" y1="${f1(A[1])}" x2="${f1(B[0])}" y2="${f1(B[1])}" stroke="#111" stroke-width="${w + 4}" stroke-linecap="round"/>` +
    `<line x1="${f1(A[0])}" y1="${f1(A[1])}" x2="${f1(B[0])}" y2="${f1(B[1])}" stroke="${EM.teal}" stroke-width="${w}" stroke-linecap="round"/></g>`;
}
function mnNode(cam, p, r, col, op = 1, ring = EM.teal) { // a node: a ball with a ring, sized by distance
  const q = emP(cam, p); if (!q || op <= 0.01) return ''; const k = Math.max(0.55, Math.min(1.6, emScale(cam, p) * 1.6));
  return `<g opacity="${f1(op * 100) / 100}"><circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${f1(r * k + 4)}" fill="#111"/><circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${f1(r * k)}" fill="${col}" stroke="${ring}" stroke-width="3"/></g>`;
}
function renderMachineNet(n, cfg = {}) {
  const C = {...MN_DEFAULT, ...cfg}, cam = emCamera(n, C.keys), on = (a, b, f = 0.35) => smooth(a, a + f, n) * (1 - smooth(b - f, b, n));
  const fireK = on(C.fire[0], C.fire[1], 0.5), pulse = 0.75 + 0.25 * Math.sin(n * 7.3) + 0.1 * Math.sin(n * 15.1);
  // the ward map: the eight blocks that ep3_map.js only draws flat are extruded here as low rows (3 to 4 floors)
  const extra = [];
  for (const b of MN.blocks) { if (b.mod) continue; const r = rng(b.seed), h = 38 + Math.floor(r() * 3) * 12;
    for (const [y0, y1] of [[b.y0, b.y0 + 85], [b.y1 - 85, b.y1]]) for (let x = b.x0; x < b.x1 - 1; x += 75) { const hh = h + (r() < 0.3 ? 12 : 0) - (r() < 0.2 ? 12 : 0);
      const c0 = [x + 37, (y0 + y1) / 2, 0]; extra.push({d: v3.len(v3.sub(c0, cam.C)), draw: () => emBoxSimple(cam, x + 1, x + 74, y0, y1, 0, hh, '#0C1716', '#2E4A46', '#22383A', 'stroke="#0A1312" stroke-width="0.8"')}); } }
  const world = emWorld(n, cam, {extra, glow: (key) => (key === MN.fireLot ? fireK : 0), ferry: true, hazeOn: 0.55});
  // the fire block's glow (orange, pulsing: the callback to the cold open)
  const fl = emLot('kelly'), fireL = EM_LOTS.find((l) => l.key === MN.fireLot);
  if (fireK > 0.01 && fireL) { const q = emP(cam, [(fireL.x0 + fireL.x1) / 2, (fireL.y0 + fireL.y1) / 2, emH(fireL.floors) + 10]); const sc = emScale(cam, [fireL.x0, fireL.y0, 0]);
    if (q) world.push(`<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${f1(sc * 120 * (0.9 + 0.1 * pulse))}" fill="url(#mnfire)" opacity="${f1(fireK * pulse * 100) / 100}"/>`); }
  // the network
  const net = [], bu = (i, k) => smooth(C.build[0] + (C.build[1] - C.build[0]) * (0.1 + 0.6 * k), C.build[0] + (C.build[1] - C.build[0]) * (0.4 + 0.6 * k), n), bossU = smooth(C.build[0] + (C.build[1] - C.build[0]) * 0.7, C.build[1], n);
  MN.blocks.forEach((b, i) => { const c = MN.cap(b), w = MN.wards[b.ward];
    net.push(mnLine(cam, [c[0], c[1], emH(4)], c, bu(i, i / 16), 2.5, 0.8)); // a thin stalk from the roofs up to the captain
    net.push(mnLine(cam, c, w, bu(i, i / 16), 3.5)); });
  MN.wards.forEach((w) => net.push(mnLine(cam, w, MN.boss, bossU, 5)));
  // flows: favors (gold glints) down from the boss to the captains to the blocks; votes (teal pulses) up
  const fk = on(C.favorsK[0], C.favorsK[1], 0.6), vk = on(C.votesK[0], C.votesK[1], 0.6);
  const vBoost = 1 + C.votes.filter(([a]) => n > a).length; // more votes as more are named
  const glints = [], pulses = [];
  MN.blocks.forEach((b, i) => { const c = MN.cap(b), w = MN.wards[b.ward], roof = [c[0], c[1], emH(4)];
    if (fk > 0) for (let j = 0; j < 1; j++) { const u = ((n * 0.42 + i * 0.217 + j * 0.5) % 1); // boss -> ward -> captain -> block
      const p = u < 0.4 ? mnPoint(MN.boss, w, u / 0.4) : u < 0.8 ? mnPoint(w, c, (u - 0.4) / 0.4) : mnPoint(c, roof, (u - 0.8) / 0.2); const q = emP(cam, p);
      if (q) glints.push(x4Glint(q[0], q[1], 13, fk * smooth(0, 0.06, u) * (1 - smooth(0.94, 1, u)), n + i)); }
    if (vk > 0) for (let j = 0; j < Math.min(3, vBoost); j++) { const u = ((n * 0.5 + i * 0.173 + j / Math.min(3, vBoost)) % 1);
      const p = u < 0.2 ? mnPoint(roof, c, u / 0.2) : u < 0.6 ? mnPoint(c, w, (u - 0.2) / 0.4) : mnPoint(w, MN.boss, (u - 0.6) / 0.4); const q = emP(cam, p);
      if (q) pulses.push(x4Pulse(q[0], q[1], 10, vk * smooth(0, 0.06, u) * (1 - smooth(0.94, 1, u)))); } });
  // nodes on top
  const nodes = [];
  MN.blocks.forEach((b, i) => nodes.push(mnNode(cam, MN.cap(b), 6, '#111', bu(i, i / 16), b === MN.kellyBlock ? EM.cream : EM.teal)));
  MN.wards.forEach((w) => nodes.push(mnNode(cam, w, 10, '#111', bossU)));
  nodes.push(mnNode(cam, MN.boss, 15, '#111', bossU, EM.cream));
  world.push(net.join(''), glints.join(''), pulses.join(''), nodes.join(''));
  // labels
  const scr = [], fixed = [], la = C.labelsAt, L = [];
  const lab = (lines, p, off, op) => { const a = emP(cam, p); if (a && op > 0.01) L.push({lines, a, off, op}); };
  lab(['A CAPTAIN OVER EVERY BLOCK'], MN.cap(MN.blocks[12]), [120, 120], on(la[0] + 0.4, la[1]));
  lab(['WARD BOSS'], MN.wards[1], [170, -40], on(la[0] + 0.8, la[1]));
  lab(['THE BOSS'], MN.boss, [190, -10], on(la[0] + 1.1, la[1]));
  lab(['THE KELLYS'], [(fl.x0 + fl.x1) / 2, (fl.y0 + fl.y1) / 2, emH(fl.floors) + 4], [-190, 40], on(la[0] + 0.4, la[1]));
  if (fireL) lab(['THE FIRE · JANUARY 1887'], [(fireL.x0 + fireL.x1) / 2, (fireL.y0 + fireL.y1) / 2, emH(fireL.floors) + 8], [-230, -90], on(C.fire[0] + 0.3, C.fire[1]) * fireK);
  // the favors: index cards along the bottom, each with its icon, popping in as they are named
  const cards = C.favors.filter(([a]) => n > a - 0.05);
  cards.forEach(([a, icon, txt], k) => { const u = x4Pop(clamp01((n - a) / 0.4)), x = 150 + k * 420, y = 820;
    fixed.push({x, y, w: 380, h: 170});
    scr.push(`<g opacity="${f1(Math.min(1, u * 2) * 100) / 100}" transform="translate(${x + 190},${y + 85}) scale(${f1(u * 1000) / 1000}) rotate(${k % 2 ? 1.5 : -1.5}) translate(${-(x + 190)},${-(y + 85)})">` +
      `<rect x="${x + 6}" y="${y + 10}" width="380" height="170" fill="#000" opacity="0.45" filter="url(#soft)"/><rect x="${x}" y="${y}" width="380" height="170" fill="${EX.cream}"/>` +
      x4Icon(icon, x + 80, y + 80, 0.95) + x4Glint(x + 140, y + 34, 9, a < 99 ? 1 : 0, n) +
      `<text x="${x + 150}" y="${y + 92}" font-family="Mono" font-size="${txt.length > 14 ? 25 : 28}" letter-spacing="1" fill="#111">${txt.length > 14 ? txt.split(' ').slice(0, Math.ceil(txt.split(' ').length / 2)).join(' ') : txt}</text>` +
      (txt.length > 14 ? `<text x="${x + 150}" y="${y + 124}" font-family="Mono" font-size="25" letter-spacing="1" fill="#111">${txt.split(' ').slice(Math.ceil(txt.split(' ').length / 2)).join(' ')}</text>` : '') + `</g>`);
  });
  (C.fixedTags || []).forEach(([x, y, txt, a, b]) => emFixed(scr, fixed, x, y, txt, on(a, b)));
  scr.unshift(emLabels(L, fixed));
  return frame(e3Defs(n, `<filter id="emblur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>` + grad('emhaze', [['0', '#A3BAB2', 0.34], ['0.38', '#7C918B', 0.12], ['0.7', '#4E726C', 0]]) +
    texDef('emtex', 0, 0, 1920, 1080, {soft: 0.004, fine: 0.11, k: 0.16, seed: 21}) + `<radialGradient id="mnfire"><stop offset="0" stop-color="#FFB15C" stop-opacity="0.85"/><stop offset="0.45" stop-color="#FF7A3C" stop-opacity="0.3"/><stop offset="1" stop-color="#FF7A3C" stop-opacity="0"/></radialGradient>`),
  '', `<g filter="url(#emtex)">${world.join('')}</g>`, scr.join(''), n);
}

/* ================= ep4_repeater: the bishop at the polls ================= */
// A polling place in the back of a shop, election day: plaster wall, a window to the street, a flag of bunting; a table with the
// ballot box and the poll book; the clerk seated behind it facing right; a policeman by the wall; the man in line steps up.
// Beats (clip time, s): RP.
const RP = {sec: 8.2, F: 975, H: 420, walk: [0.15, 1.5], name: 2.4, chest: [2.2, 4.6], look: 4.2, book: [4.7, 5.5], pen: 5.8, back: 6.1, fold: [6.2, 6.6], shake: [6.7, 7.6], sag: 6.9, table: [690, 1010]};
RP.top = RP.F - 0.42 * RP.H;
function rpRoom(t) {
  const s = [], F = RP.F, wall = F - 50;
  s.push(`<rect x="-1500" y="-1200" width="5000" height="3600" fill="#0A0D0C"/><rect x="-400" y="120" width="2800" height="${wall - 120}" fill="#3A433E"/><rect x="-400" y="120" width="2800" height="${wall - 120}" fill="url(#matSootT)" opacity="0.5"/>`);
  s.push(`<rect x="-400" y="${wall - 160}" width="2800" height="160" fill="#2A251C"/><rect x="-400" y="${wall - 166}" width="2800" height="8" fill="#1A140D"/>` + MAT.floor(-400, 2400, wall, F + 90, {kind: 'planks', base: '#3A3020', seed: 812, size: 52, vp: 960}));
  // the window to the street (grey November light), bunting along the top of the wall
  s.push(`<rect x="1180" y="250" width="420" height="420" fill="#0E1312"/><rect x="1194" y="264" width="392" height="392" fill="#A9B8B4"/><rect x="1194" y="264" width="392" height="392" fill="url(#e3day)" opacity="0.6"/>` +
    `<rect x="1386" y="264" width="8" height="392" fill="#0E1312"/><rect x="1194" y="456" width="392" height="8" fill="#0E1312"/><rect x="1170" y="668" width="440" height="16" fill="#0E1312"/>` +
    `<path d="M1194,${656} L1194,560 L1240,520 L1300,560 L1300,656 Z" fill="#7E8E8A"/><path d="M1420,656 L1420,520 L1586,520 L1586,656 Z" fill="#6E7E7A"/>`);
  s.push(`<path d="M1194,264 L1586,264 L1100,${F + 90} L700,${F + 90} Z" fill="#DFE0D6" opacity="0.06"/>`);
  for (let x = -100; x < 2100; x += 210) { const sw = 3 * Math.sin(t * 0.8 + x); s.push(`<path d="M${x},150 Q${x + 105},${226 + sw} ${x + 210},150 L${x + 210},166 Q${x + 105},${242 + sw} ${x},166 Z" fill="#B9B29E" opacity="0.55"/><path d="M${x},166 Q${x + 105},${242 + sw} ${x + 210},166 L${x + 210},178 Q${x + 105},${256 + sw} ${x},178 Z" fill="#46564F" opacity="0.7"/>`); }
  // a notice on the wall: scribbled lines (no readable text)
  s.push(`<rect x="420" y="330" width="170" height="220" fill="#CFC6AE" opacity="0.75"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map((k) => `<path d="M440,${360 + k * 22} q14,-4 28,0 t28,0 t28,0 t28,0" stroke="#2C2A22" stroke-width="2.5" fill="none" opacity="0.7"/>`).join(''));
  return s.join('');
}
function rpTable(t, wrote) {
  const [x0, x1] = RP.table, top = RP.top, s = [];
  s.push(`<rect x="${x0}" y="${top}" width="${x1 - x0}" height="16" fill="#1A120A"/><rect x="${x0 + 14}" y="${top + 16}" width="14" height="${RP.F + 8 - top - 16}" fill="#120D08"/><rect x="${x1 - 28}" y="${top + 16}" width="14" height="${RP.F + 8 - top - 16}" fill="#120D08"/>` +
    `<rect x="${x0 + 8}" y="${top + 16}" width="${x1 - x0 - 16}" height="26" fill="#160F08"/>`);
  // the ballot box (wood, a slot in the lid) and the open poll book
  const bx = x1 - 150;
  s.push(`<rect x="${bx}" y="${top - 110}" width="120" height="110" fill="#4A3524"/><rect x="${bx - 6}" y="${top - 118}" width="132" height="12" fill="#3A2818"/><rect x="${bx + 40}" y="${top - 116}" width="40" height="5" fill="#0D0C09"/><rect x="${bx}" y="${top - 110}" width="120" height="3" fill="#FFE6C0" opacity="0.2"/>`);
  const lx = x0 + 60;
  s.push(`<path d="M${lx},${top} L${lx + 90},${top - 14} L${lx + 180},${top} L${lx + 180},${top + 2} L${lx},${top + 2} Z" fill="#E9E0C8"/><path d="M${lx + 90},${top - 14} L${lx + 90},${top + 1}" stroke="#8A7F66" stroke-width="1.5"/>` +
    [0, 1, 2].map((k) => line([[lx + 10 + k * 3, top - 2 - k * 3], [lx + 80, top - 12 - k * 0.5]], '#7A7058', 1, 'opacity="0.6"')).join('') + (wrote > 0 ? line([[lx + 100, top - 10], [lx + 100 + 50 * wrote, top - 6]], '#1C1A16', 1.6) : ''));
  return s.join('');
}
function renderRepeater(t, o = {}) {
  const {F, H, top} = RP, c = cam2(o.cam || camAt([[0, 1.4, 1000, 660], [2.4, 1.55, 980, 670], [5.8, 1.68, 930, 680], [8.2, 1.74, 920, 684]], t));
  const lod = lodFor(H * c.z), det = lod.det, rim = {c: '#E9F0E6', a: lod.rimA * 0.6, dx: -0.008, dy: -0.005}, s = [rpRoom(t)], scr = [];
  // ---- the clerk: seated behind the table, facing right; writes, stops, looks up, sits back, folds his arms, shakes his head ----
  const cx = 720, seatY = F + 10 - 0.24 * H;
  const shake = (t > RP.shake[0] && t < RP.shake[1]) ? 7 * Math.sin((t - RP.shake[0]) * 14) * (1 - smooth(RP.shake[1] - 0.25, RP.shake[1], t)) : 0;
  const lookBook = smooth(RP.book[0], RP.book[0] + 0.2, t) * (1 - smooth(RP.book[1] - 0.15, RP.book[1], t));
  const ctilt = t < RP.look ? -14 : -14 + 22 * smooth(RP.look, RP.look + 0.35, t) - 24 * lookBook + 6 * smooth(RP.back, RP.back + 0.4, t);
  const backK = smooth(RP.back, RP.back + 0.45, t);
  let ck = sitOn({kind: 'man', hat: 'none', coat: 'vest', beard: true, fill: '#0D0C09', x: cx, y: 0, h: H, d: 1, det, rim, an: {tilt: ctilt + shake, expr: 'set', blink: (t + 0.4) % 3.3 < 0.12}}, seatY, F + 10, 0.2, 'rp.clerk.seat');
  ck = {...ck, an: {...ck.an, lean: 10 * (1 - backK) - 6 * backK}};
  const lx = RP.table[0] + 60, nibAt = (u) => [lx + 100 + 50 * u, top - 10 + 4 * u];
  let pen = '', wrote = clamp01(t / 1.8) * 0.6 + 0.4 * smooth(2.6, 3.4, t);
  const writing = t < RP.pen;
  if (writing) { const u = clamp01(wrote), nib = nibAt(u), j = (t < 1.8 || (t > 2.6 && t < 3.4)) ? [2 * Math.sin(t * 31), -Math.abs(2 * Math.sin(t * 17))] : [0, -6 * smooth(3.4, 3.6, t)];
    ck = reach(ck, 'f', nib[0] + j[0] - 8, nib[1] + j[1] - 22, 'rp.clerk.write'); ck = reach(ck, 'b', lx + 30, top - 6, 'rp.clerk.book');
    pen = holding(ck, 'f', 'rp.clerk.pen', (gx, gy) => line([[gx, gy], [gx + 8, gy + 22]], '#0D0C09', 2.6)); }
  else if (t < RP.fold[0]) { // the pen goes down beside the book; the hands come back
    const k = smooth(RP.pen, RP.fold[0], t), down = [lx + 200, top - 4];
    ck = e3Move(ck, 'f', lerp(nibAt(1)[0] - 8, down[0], k), lerp(nibAt(1)[1] - 22, down[1] - 6, k), 'rp.clerk.penDown'); ck = reach(ck, 'b', lx + 30, top - 6, 'rp.clerk.book');
    pen = k < 0.8 ? holding(ck, 'f', 'rp.clerk.pen', (gx, gy) => line([[gx, gy], [gx + 8, gy + 22]], '#0D0C09', 2.6)) : ''; }
  if (!writing && t >= RP.pen + (RP.fold[0] - RP.pen) * 0.8) pen = line([[lx + 196, top - 3], [lx + 226, top - 1]], '#0D0C09', 2.6);
  let foldSvg = '';
  if (t >= RP.fold[0]) { const k = smooth(RP.fold[0], RP.fold[1], t);
    if (k < 1) { const a = E3K.armAngles(ck, 'f'), b2 = E3K.armAngles(ck, 'b'); ck = {...ck, an: {...ck.an, fArm: [lerp(150, E3_FOLD.fArm[0], k), lerp(100, E3_FOLD.fArm[1], k)], bArm: [lerp(140, E3_FOLD.bArm[0], k), lerp(100, E3_FOLD.bArm[1], k)]}}; }
    else { ck = {...ck, an: {...ck.an, ...E3_FOLD}}; foldSvg = foldedArms(ck.x, ck.y, ck.h, 1, ck.fill, ck.tones ? ck.tones.tone : '#0D0C09'); } }
  const chair = `<rect x="${cx - 54}" y="${seatY}" width="108" height="12" fill="#120D08"/><rect x="${cx - 50}" y="${seatY + 12}" width="10" height="${F + 10 - seatY - 12}" fill="#120D08"/><rect x="${cx + 38}" y="${seatY + 12}" width="10" height="${F + 10 - seatY - 12}" fill="#120D08"/><rect x="${cx - 60}" y="${seatY - 210}" width="10" height="210" fill="#120D08"/>`;
  // ---- the man in line: steps up to the table, draws himself up, a hand on his chest; then deflates ----
  const chestK = smooth(RP.chest[0], RP.chest[0] + 0.35, t) * (1 - smooth(RP.sag, RP.sag + 0.4, t));
  const tr = e4Track({kind: 'man', hat: 'cap', coat: 'jacket', fill: '#0D0C09', h: H * 1.0, det, rim, an: {tilt: 4 + 12 * chestK - 10 * smooth(RP.sag, RP.sag + 0.5, t), expr: t > RP.sag ? 'worried' : 'smile', blink: (t + 1.1) % 3.7 < 0.12}},
    {x: 1460, d: -1, G: F, ph: 0.4, walks: [{t0: RP.walk[0], t1: RP.walk[1], to: 1150, dAfter: -1, a: 0.25}]}, t, 'rp.man');
  let mn = tr.fo;
  if (tr.state !== 'walk') { mn = {...mn, an: {...mn.an, lean: -3 * chestK}}; // chest out
    const chest = E3K.toWorld(mn, 0.07, 0.68), g = E3K.hand({...mn, an: {...mn.an, fArm: [176, 180]}}, 'f');
    if (chestK > 0.01) mn = chestK < 1 ? e3Move(mn, 'f', lerp(g.x, chest[0], chestK), lerp(g.y, chest[1], chestK), 'rp.man.toChest') : reach(mn, 'f', chest[0], chest[1], 'rp.man.chest');
    // the other hand: a little flourish on the name, then down
    mn = {...mn, an: {...mn.an, bArm: e4Keys([[RP.name - 0.3, 194, 200], [RP.name, 150, 110], [RP.name + 0.8, 156, 120], [RP.name + 1.3, 194, 200]], t, [194, 200])}}; }
  const sp = e4Speak([[RP.name - 0.1, RP.name + 0.9]], t); mn = {...mn, an: {...mn.an, jaw: sp.jaw}};
  // ---- a policeman by the wall, watching; he looks at the man, then away (a small smile) ----
  let pc = e3Stand({kind: 'man', hat: 'bowler', coat: 'frock', fill: '#0D0C09', x: 1420, y: F - 40, h: H * 0.86, d: -1, det: Math.min(det, 0.6), rim, floorY: F - 40, an: {...POSES.stand(t, 0.7), tilt: t > RP.back ? -6 : 4, blink: (t + 2.2) % 4.1 < 0.12}}, 1420, 1420, 0, 'rp.police');
  s.push(fig(pc), chair, fig(ck), foldSvg, rpTable(t, wrote), pen, fig(mn));
  const world = layerAt(c, 1, s.join(''));
  if (!o.quiet) scr.push(tag(130, 120, 'AT THE POLLS · ELECTION DAY', smooth(0.2, 0.6, t) * (1 - smooth(3.6, 4.0, t))));
  return frame(e3Defs2(t), `<rect width="1920" height="1080" fill="#0A0D0C"/>`, world, scr.join(''), t);
}

/* ================= ep4_leak: copying the books by lamplight (1871) ================= */
const LK = {sec: 7, F: 980, H: 440, glance: [3.0, 3.9], desk: [760, 1180]};
LK.top = LK.F - 0.44 * LK.H;
function renderLeak(t, o = {}) {
  const {F, H, top} = LK, c = cam2(o.cam || camAt([[0, 1.15, 980, 620], [7, 1.34, 960, 640]], t)), s = [], scr = [];
  const lod = lodFor(H * c.z), fl = 0.88 + 0.06 * Math.sin(t * 9.1) + 0.04 * Math.sin(t * 14.3), lampX = 1110, lampY = top - 120;
  const rim = {c: '#FFD9A0', a: Math.max(0.35, lod.rimA) * fl, dx: 0.012, dy: -0.004};
  // the office at night: dark panelled wall, shelves of ledgers, a tall dark window, the door behind (left), shut
  s.push(`<rect x="-1500" y="-1200" width="5000" height="3600" fill="#050606"/><rect x="-300" y="140" width="2600" height="${F - 190}" fill="#14140F"/><rect x="-300" y="${F - 210}" width="2600" height="160" fill="#1A140D"/>` +
    MAT.floor(-300, 2300, F - 50, F + 90, {kind: 'planks', base: '#241C12', seed: 913, size: 50, vp: 960}));
  for (let row = 0; row < 4; row++) { const y = 230 + row * 120; s.push(`<rect x="150" y="${y + 96}" width="500" height="10" fill="#0D0A06"/>`);
    const r = rng(40 + row); for (let x = 160; x < 640;) { const w = 18 + r() * 14, h = 70 + r() * 24; s.push(`<rect x="${f1(x)}" y="${f1(y + 96 - h)}" width="${f1(w)}" height="${f1(h)}" fill="${r() < 0.5 ? '#2A2016' : '#1E1810'}"/><rect x="${f1(x)}" y="${f1(y + 110 - h)}" width="${f1(w)}" height="4" fill="#C9A55A" opacity="0.25"/>`); x += w + 2; } }
  s.push(`<rect x="1420" y="${F - 560}" width="230" height="510" fill="#0D0A06"/><rect x="1434" y="${F - 546}" width="202" height="496" fill="#1E1810"/><rect x="1454" y="${F - 520}" width="162" height="180" fill="none" stroke="#14100A" stroke-width="5"/><circle cx="1454" cy="${F - 300}" r="6" fill="#5A4A2A"/>`);
  s.push(`<rect x="760" y="240" width="160" height="380" fill="#0A1214"/><rect x="834" y="240" width="8" height="380" fill="#050606"/><rect x="760" y="420" width="160" height="8" fill="#050606"/>`);
  // the lamp's warm light on everything
  s.push(glowC(lampX, lampY, 760, 0.9 * fl, 'mswarm') + glowC(lampX, lampY, 260, 0.6 * fl, 'e3lamp'));
  // the clerk at the desk, facing right, writing with his right hand; the big ledger open on the left of the desk, the notebook right
  const [d0, d1] = LK.desk, sx = 700, seatY = F - 0.24 * H, gl = smooth(LK.glance[0], LK.glance[0] + 0.25, t) * (1 - smooth(LK.glance[1] - 0.25, LK.glance[1], t));
  let ck = sitOn({kind: 'man', hat: 'none', coat: 'vest', fill: '#0D0C09', x: sx, y: 0, h: H, d: 1, det: 0, rim, an: {tilt: -18 + 26 * gl, blink: false}}, seatY, F, 0.2, 'lk.clerk.seat');
  ck = {...ck, an: {...ck.an, lean: 12 - 9 * gl}};
  const nb = (u) => [d0 + 70 + 60 * u, top - 4 + 2 * u], wr = ((t * 0.55) % 1), writing = gl <= 0.02;
  let pen = '';
  { const g = nb(wr), j = writing ? [2 * Math.sin(t * 29), -Math.abs(2 * Math.sin(t * 17))] : [0, -12 * gl];
    ck = reach(ck, 'f', g[0] + j[0] - 8, g[1] + j[1] - 22, writing ? 'lk.clerk.write' : 'lk.clerk.lift'); if (!writing) E3LOG[E3LOG.length - 1].kind = 'move'; ck = reach(ck, 'b', d0 + 30, top - 6, 'lk.clerk.desk');
    pen = holding(ck, 'f', 'lk.clerk.pen', (gx, gy) => line([[gx, gy], [gx + 8, gy + 22]], '#0D0C09', 2.6)); }
  const chair = `<rect x="${sx - 54}" y="${seatY}" width="108" height="12" fill="#0D0A06"/><rect x="${sx - 50}" y="${seatY + 12}" width="10" height="${F - seatY - 12}" fill="#0D0A06"/><rect x="${sx + 38}" y="${seatY + 12}" width="10" height="${F - seatY - 12}" fill="#0D0A06"/><rect x="${sx - 60}" y="${seatY - 200}" width="10" height="200" fill="#0D0A06"/>`;
  const desk = `<rect x="${d0}" y="${top}" width="${d1 - d0}" height="18" fill="#1E140A"/><rect x="${d0 + 16}" y="${top + 18}" width="16" height="${F - top - 18}" fill="#140D07"/><rect x="${d1 - 32}" y="${top + 18}" width="16" height="${F - top - 18}" fill="#140D07"/>` +
    `<rect x="${d0}" y="${top}" width="${d1 - d0}" height="3" fill="#FFD9A0" opacity="${f1(0.35 * fl)}"/>` +
    // the big ledger (open, thick) and the small notebook
    `<path d="M${d0 + 180},${top} L${d0 + 270},${top - 18} L${d0 + 360},${top} L${d0 + 360},${top - 3} L${d0 + 180},${top - 3} Z" fill="#E9E0C8"/><rect x="${d0 + 176}" y="${top - 3}" width="188" height="6" fill="#3A2416"/>` +
    [0, 1, 2, 3].map((k) => line([[d0 + 190 + k * 2, top - 3 - k * 3], [d0 + 260, top - 15 - k * 0.6]], '#7A7058', 1, 'opacity="0.6"')).join('') +
    `<path d="M${d0 + 50},${top} L${d0 + 95},${top - 8} L${d0 + 140},${top} L${d0 + 140},${top - 2} L${d0 + 50},${top - 2} Z" fill="#F4EFE0"/>` +
    // the lamp: brass base, glass chimney, the flame
    `<rect x="${lampX - 26}" y="${top - 16}" width="52" height="16" fill="#3A2C1A"/><path d="M${lampX - 18},${top - 16} q-4,-34 18,-44 q22,10 18,44 Z" fill="#5A4426"/><rect x="${lampX - 12}" y="${top - 118}" width="24" height="60" rx="10" fill="#FFF3D6" opacity="0.35"/><ellipse cx="${lampX}" cy="${top - 84}" rx="${f1(5 + fl)}" ry="${f1(12 + 2 * fl)}" fill="#FFE2A0"/>`;
  s.push(chair, fig(ck), desk, pen);
  const world = layerAt(c, 1, s.join(''));
  if (!o.quiet) scr.push(tag(130, 120, 'THE CITY’S ACCOUNTING OFFICE · 1871', smooth(0.2, 0.6, t) * (1 - smooth(4.6, 5.0, t))));
  return frame(e3Defs2(t), `<rect width="1920" height="1080" fill="#050606"/>`, world, scr.join(''), t);
}

if (typeof window !== 'undefined') Object.assign(window, {renderMachineNet, renderRepeater, renderLeak, MN});
Object.assign(CLIPS, {
  ep4_network: {sec: 12, render: (t) => renderMachineNet(t)},
  ep4_repeater: {sec: RP.sec, render: (t) => renderRepeater(t)},
  ep4_leak: {sec: LK.sec, render: (t) => renderLeak(t)},
});
