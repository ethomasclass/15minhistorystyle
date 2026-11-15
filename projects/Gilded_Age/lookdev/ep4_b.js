// Episode 4 drawn scenes, part 2 (load after ep4.js): the ward club, the coal, the Kellys' kitchen, the hallway (papers), the polls,
// Vigo and the bootblack stand. Same rules and helpers as ep4.js (e4Track, e4Walk, e4Speak, e4Keys, e4Captain, E3K contacts).

/* ================= ep4_clubhouse: the ward club, a back room behind a saloon, gaslight (ch 5) ================= */
// The captain at a small table with the ledger. A line waits along the room: a mother with a letter, an old man with a cane, a young
// man with his cap in his hands, two more behind. Each steps up in turn; the captain listens, writes, nods; each leaves by the back
// door behind him. Tommy Kelly (coral, 17) darts in from the saloon with a note and out again. On the wall, a big empty frame.
// Scale: a man 400 px. Rows (floor y): the line and the one at the table 975; the table's feet 985; the captain 995; Tommy 1010.
const CB = {x0: 180, x1: 1740, ceil: 170, wallFoot: 930, F: 980, H: 400, G: 975, GT: 1010, GC: 995, sec: 27, chairX: 640, tx0: 660, tx1: 900, door: [262, 392], saloon: 1740};
CB.top = CB.F - 0.43 * CB.H; // the table top
function e4ClubRoom(t) {
  const {x0, x1, ceil, wallFoot, F} = CB, b = [], f = [], r = rng(401), fl = 0.9 + 0.05 * Math.sin(t * 8.1) + 0.04 * Math.sin(t * 13.7);
  b.push(`<rect x="-1500" y="-1200" width="5000" height="3600" fill="#060505"/>`);
  b.push(`<rect x="${x0}" y="${ceil}" width="${x1 - x0}" height="${wallFoot - ceil}" fill="#1E1B15"/><rect x="${x0}" y="${ceil}" width="${x1 - x0}" height="${wallFoot - ceil}" fill="url(#flwp)" opacity="0.07"/>`);
  b.push(`<rect x="${x0}" y="${ceil}" width="${x1 - x0}" height="160" fill="url(#matSootT)"/>`);
  // wainscot: dark wooden panels with a rail
  const wy = wallFoot - 300;
  b.push(`<rect x="${x0}" y="${wy}" width="${x1 - x0}" height="${wallFoot - wy}" fill="#241C13"/><rect x="${x0}" y="${wy - 10}" width="${x1 - x0}" height="14" fill="#1A140D"/><rect x="${x0}" y="${wy - 10}" width="${x1 - x0}" height="3" fill="#FFE6C0" opacity="0.18"/>`);
  for (let x = x0 + 20; x < x1 - 120; x += 150) b.push(`<rect x="${x}" y="${wy + 26}" width="124" height="${wallFoot - wy - 60}" fill="none" stroke="#120E09" stroke-width="5"/><rect x="${x + 3}" y="${wy + 29}" width="118" height="2" fill="#FFE6C0" opacity="0.1"/>`);
  // the ceiling band, bunting swags along the top of the wall (muted cream and slate)
  b.push(`<rect x="${x0}" y="${ceil - 4}" width="${x1 - x0}" height="26" fill="#3A3428"/><rect x="${x0}" y="${ceil + 22}" width="${x1 - x0}" height="5" fill="#16120C"/>`);
  for (let x = x0 + 10; x < x1 - 160; x += 190) { const sw = 3 * Math.sin(t * 0.7 + x); b.push(`<path d="M${x},${ceil + 30} Q${x + 95},${ceil + 120 + sw} ${x + 190},${ceil + 30} L${x + 190},${ceil + 46} Q${x + 95},${ceil + 136 + sw} ${x},${ceil + 46} Z" fill="#B9B29E" opacity="0.55"/><path d="M${x},${ceil + 46} Q${x + 95},${ceil + 136 + sw} ${x + 190},${ceil + 46} L${x + 190},${ceil + 58} Q${x + 95},${ceil + 150 + sw} ${x},${ceil + 58} Z" fill="#46564F" opacity="0.7"/>`); }
  // the back door (left), ajar onto the dark yard; a hat rack beside it with two bowlers
  const [d0, d1] = CB.door;
  b.push(`<rect x="${d0 - 14}" y="${wallFoot - 520}" width="${d1 - d0 + 28}" height="520" fill="#150F09"/><rect x="${d0}" y="${wallFoot - 506}" width="${d1 - d0}" height="506" fill="#05080A"/><path d="M${d0},${wallFoot - 506} L${d0 + 46},${wallFoot - 494} L${d0 + 46},${wallFoot + 10} L${d0},${wallFoot}" fill="#2B2116"/>` +
    `<rect x="${d0 + 60}" y="${wallFoot - 470}" width="${d1 - d0 - 70}" height="160" fill="#0C1416"/>` + [0, 1, 2].map((k) => `<circle cx="${d0 + 80 + k * 24}" cy="${wallFoot - 430 + k * 30}" r="2" fill="#9FB0B0" opacity="0.6"/>`).join(''));
  b.push(`<rect x="${d1 + 40}" y="${wallFoot - 420}" width="8" height="420" fill="#120D08"/>` + [-1, 1].map((k) => `<path d="M${d1 + 44 + k * 26},${wallFoot - 380} q-18,-2 -20,-26 q20,-26 40,0 q-2,24 -20,26 Z" fill="#0D0C09"/>`).join(''));
  // the big empty frame over the table (the boss: no face), and two small pictures that are not empty
  const fx = 560, fy = 290, fw = 300, fh = 250;
  b.push(`<rect x="${fx - 6}" y="${fy + fh + 4}" width="${fw + 12}" height="10" fill="#000" opacity="0.3"/><rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" fill="#191209"/><rect x="${fx + 12}" y="${fy + 12}" width="${fw - 24}" height="${fh - 24}" fill="#120D07"/>` +
    `<rect x="${fx + 26}" y="${fy + 26}" width="${fw - 52}" height="${fh - 52}" fill="#2A2620"/><rect x="${fx + 26}" y="${fy + 26}" width="${fw - 52}" height="${fh - 52}" fill="url(#flwp)" opacity="0.09"/><rect x="${fx + 26}" y="${fy + 26}" width="${fw - 52}" height="${fh - 52}" fill="none" stroke="#000" stroke-width="6" opacity="0.35"/>` +
    `<rect x="${fx + 3}" y="${fy + 3}" width="${fw - 6}" height="3" fill="#FFE6C0" opacity="0.22"/><rect x="${fx + fw / 2 - 30}" y="${fy + fh - 20}" width="60" height="10" fill="#3A3428"/>` + line([[fx + fw / 2, fy], [fx + fw / 2 - 40, fy - 50], [fx + fw / 2 + 40, fy - 50], [fx + fw / 2, fy]], '#120D08', 2));
  for (const [px, py, pw, ph] of [[1110, 330, 120, 90], [1250, 350, 90, 70]]) b.push(`<rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="#191209"/><rect x="${px + 8}" y="${py + 8}" width="${pw - 16}" height="${ph - 16}" fill="#3A4741"/><path d="M${px + 8},${py + ph * 0.62} q${pw * 0.3},-${ph * 0.2} ${pw * 0.5},-${ph * 0.06} q${pw * 0.2},${ph * 0.1} ${pw - 16},-${ph * 0.12} L${px + pw - 8},${py + ph - 8} L${px + 8},${py + ph - 8} Z" fill="#26302B"/>`);
  // a framed notice of scribbled lines, a clock
  b.push(`<rect x="1400" y="360" width="100" height="130" fill="#191209"/><rect x="1408" y="368" width="84" height="114" fill="#CFC6AE" opacity="0.6"/>` + [0, 1, 2, 3, 4, 5].map((k) => `<path d="M1416,${386 + k * 16} q10,-4 20,0 t20,0 t20,0" stroke="#2C2A22" stroke-width="2" fill="none" opacity="0.7"/>`).join('') +
    `<circle cx="1610" cy="330" r="34" fill="#191209"/><circle cx="1610" cy="330" r="26" fill="#CFC6AE" opacity="0.55"/>` + line([[1610, 330], [1610 + 15 * Math.sin(t * 0.05 + 2), 330 - 15 * Math.cos(t * 0.05 + 2)]], '#191209', 3) + line([[1610, 330], [1610 + 10 * Math.sin(0.3), 330 - 10 * Math.cos(0.3)]], '#191209', 4));
  // the floor
  b.push(`<rect x="${x0}" y="${wallFoot - 14}" width="${x1 - x0}" height="14" fill="#1A140D"/>` + MAT.floor(x0, x1, wallFoot, F + 70, {kind: 'planks', base: '#3A3020', seed: 405, size: 54, vp: (x0 + x1) / 2}));
  for (let k = 0; k < 10; k++) b.push(`<ellipse cx="${f1(x0 + 40 + r() * (x1 - x0 - 80))}" cy="${f1(wallFoot + 20 + r() * 110)}" rx="${f1(10 + r() * 30)}" ry="${f1(2 + r() * 4)}" fill="#0D0C09" opacity="0.35"/>`);
  // the saloon through the opening in the right wall: warm light, the bar's end, a bottle shelf
  b.push(`<rect x="${x1}" y="${wallFoot - 560}" width="400" height="${F + 70 - wallFoot + 560}" fill="#3A2A18"/><rect x="${x1 + 60}" y="${wallFoot - 300}" width="300" height="${F - wallFoot + 300}" fill="#1A120A"/><rect x="${x1 + 60}" y="${wallFoot - 310}" width="300" height="16" fill="#120C06"/>` +
    [0, 1, 2, 3, 4, 5].map((k) => `<rect x="${x1 + 90 + k * 40}" y="${wallFoot - 470}" width="14" height="44" rx="4" fill="#120C06"/>`).join('') + `<rect x="${x1 + 70}" y="${wallFoot - 424}" width="280" height="6" fill="#120C06"/>` + glowC(x1 + 200, wallFoot - 380, 420, 0.9 * fl, 'mswarm'));
  b.push(`<ellipse cx="${x1 - 60}" cy="${F + 20}" rx="320" ry="60" fill="url(#mswarm)" opacity="${f1(0.8 * fl)}"/>`);
  // the gasolier over the table and a bracket by the line: the room's light
  const gx = 1000;
  b.push(line([[gx, ceil + 27], [gx, ceil + 150]], '#120D08', 6) + line([[gx - 70, ceil + 170], [gx, ceil + 150], [gx + 70, ceil + 170]], '#120D08', 5));
  for (const k of [-1, 1]) b.push(`<path d="M${gx + k * 70 - 14},${ceil + 172} q14,-20 28,0 q2,22 -14,28 q-16,-6 -14,-28 Z" fill="#FFF0CF" opacity="0.85"/>` + glowC(gx + k * 70, ceil + 185, 520, 0.75 * fl, 'mswarm'));
  b.push(glowC(gx, ceil + 190, 160, 0.5 * fl));
  b.push(`<rect x="1286" y="440" width="10" height="40" fill="#120D08"/>` + line([[1291, 450], [1320, 440]], '#120D08', 5) + `<ellipse cx="1322" cy="428" rx="6" ry="12" fill="#FFF3D6"/>` + glowC(1322, 430, 300, 0.6 * fl, 'mswarm'));
  // the cut: walls, slabs; an opening in the right wall to the saloon
  const c = '#050505';
  f.push(`<rect x="${x0 - 34}" y="${ceil - 60}" width="34" height="${F + 70 - ceil + 100}" fill="${c}"/><rect x="${x1}" y="${ceil - 60}" width="34" height="${wallFoot - 560 - ceil + 60}" fill="${c}"/>` +
    `<rect x="${x0 - 34}" y="${ceil - 60}" width="${x1 - x0 + 68}" height="56" fill="${c}"/><rect x="${x0 - 34}" y="${F + 70}" width="${x1 - x0 + 500}" height="60" fill="${c}"/><rect x="${x0}" y="${F + 68}" width="${x1 - x0}" height="3" fill="#DFE0D6" opacity="0.15"/>`);
  return {back: b.join(''), front: f.join(''), fl};
}
// the table: legs, top, the open ledger (pages and ruled lines), an inkwell
function e4ClubTable(t, inked) {
  const {tx0, tx1, top, F} = CB, s = [];
  s.push(MAT.shadow((tx0 + tx1) / 2, 985, 150, 0.45) + `<rect x="${tx0}" y="${top}" width="${tx1 - tx0}" height="16" fill="#241A10"/><rect x="${tx0}" y="${top}" width="${tx1 - tx0}" height="3" fill="#FFE6C0" opacity="0.2"/>` +
    `<rect x="${tx0 + 14}" y="${top + 16}" width="12" height="${985 - top - 16}" fill="#120D08"/><rect x="${tx1 - 26}" y="${top + 16}" width="12" height="${985 - top - 16}" fill="#120D08"/><rect x="${tx0 + 8}" y="${top + 16}" width="${tx1 - tx0 - 16}" height="22" fill="#1A120A"/>`);
  // the ledger lies open toward the captain: two pages seen nearly edge on, a little tilted so the ruled lines show
  const lx = tx0 + 14, ly = top;
  s.push(`<path d="M${lx},${ly} L${lx + 70},${ly - 12} L${lx + 140},${ly} L${lx + 140},${ly + 2} L${lx},${ly + 2} Z" fill="#E9E0C8"/><path d="M${lx + 70},${ly - 12} L${lx + 70},${ly + 1}" stroke="#8A7F66" stroke-width="1.5"/>` +
    [0, 1, 2].map((k) => line([[lx + 8 + k * 3, ly - 2 - k * 3], [lx + 62, ly - 10 - k * 0.5]], '#7A7058', 1, 'opacity="0.6"')).join('') +
    (inked > 0 ? line([[lx + 82, ly - 9], [lx + 82 + 46 * inked, ly - 5]], '#1C1A16', 1.6) : '') +
    `<rect x="${lx - 4}" y="${ly}" width="148" height="5" fill="#3A2416"/>`);
  s.push(`<rect x="${tx1 - 70}" y="${top - 16}" width="18" height="16" rx="3" fill="#0D0C09"/>`);
  return s.join('');
}
const CB_PEN = (fo) => holding(fo, 'f', 'cb.cap.pen', (gx, gy, ang) => line([[gx, gy], [gx + 8, gy - 26]], '#0D0C09', 2.6));
// one person waiting: e4Track along the line row, then to the table, then out by the back door (faded in the doorway)
function e4ClubPerson(base, plan, t, name) { const tr = e4Track(base, plan, t, name), fo = tr.fo, dx = fo.x - CB.door[1];
  return {fo, state: tr.state, op: clamp01((fo.x - (CB.door[0] + 30)) / 90)}; }
function renderE4Club(t, o = {}) {
  const {H, G, GT, GC, F, top} = CB, c = cam2(o.cam || camAt([[0, 1.12, 900, 600], [4.5, 1.42, 830, 650], [8.0, 1.25, 960, 640], [12, 1.45, 860, 655], [16.5, 1.3, 980, 640], [20, 1.5, 860, 665], [24, 1.3, 900, 640], [27, 1.18, 930, 620]], t));
  const lod = lodFor(H * c.z), det = lod.det, room = e4ClubRoom(t), fl = room.fl, s = [room.back], scr = [];
  const rimW = (x) => ({c: '#FFE6C0', a: lod.rimA * (0.45 + 0.35 * Math.exp(-Math.abs(x - 775) / 600)) * fl, dx: x > 775 ? -0.008 : 0.008, dy: -0.006});
  const ink = '#0D0C09', nodAt = (a) => -8 * e4Bump(t, a, 0.45);
  // ---- the captain at the table: reads, writes, looks up, nods ----
  const listen = (t > 11.2 && t < 13.7) || (t > 19.9 && t < 21.5), writing = (t > 5.3 && t < 6.6) || (t > 13.8 && t < 14.9) || (t > 21.5 && t < 22.5) || (t < 0.5);
  const capTilt = writing ? -16 : (t > 3.3 && t < 4.8) ? -10 : listen ? 4 + 2 * Math.sin(t * 1.7) : 2 + 2 * Math.sin(t * 0.6);
  let cp = sitOn(e4CaptainOpts({x: CB.chairX, y: 0, h: H, d: 1, det, rim: rimW(CB.chairX), an: {tilt: capTilt + nodAt(6.7) + nodAt(12.6) + nodAt(15.1) + nodAt(22.6), expr: 'smile', blink: (t + 0.7) % 3.7 < 0.12, glintT: t}}), GC - 0.24 * H, GC, 0.2, 'cb.cap.seat');
  const chair = `<rect x="${CB.chairX - 50}" y="${GC - 0.24 * H}" width="100" height="12" fill="#120D08"/><rect x="${CB.chairX - 46}" y="${GC - 0.24 * H + 12}" width="10" height="${0.24 * H - 12}" fill="#120D08"/><rect x="${CB.chairX + 34}" y="${GC - 0.24 * H + 12}" width="10" height="${0.24 * H - 12}" fill="#120D08"/><rect x="${CB.chairX - 50}" y="${GC - 0.24 * H - 200}" width="10" height="200" fill="#120D08"/>`;
  const lx = CB.tx0 + 14, page = (u) => [lx + 84 + 44 * u, top - 8 + 3 * u];
  let penSvg = '', letterSvg = '', noteSvg = '', inked = 0;
  // ---- the people in line ----
  const P = [
    {name: 'mother', base: {kind: 'woman', hat: 'kerchief', wear: ['plain', 'shawl'], h: H * 0.9}, x: 1150, walks: [{t0: 0.4, t1: 2.2, to: 935, dAfter: -1, carry: true, an: {fArm: [150, 100]}}, {t0: 7.3, t1: 10.6, to: 250, a: 0.15}]},
    {name: 'oldman', base: {kind: 'man', hat: 'bowler', coat: 'sack', beard: true, h: H * 0.95, cane: true}, x: 1270, walks: [{t0: 8.0, t1: 9.6, to: 1150}, {t0: 9.9, t1: 11.3, to: 940, dAfter: -1}, {t0: 16.0, t1: 19.6, to: 250, a: 0.15}]},
    {name: 'young', base: {kind: 'man', hat: 'cap', coat: 'jacket', h: H}, x: 1385, walks: [{t0: 8.3, t1: 9.9, to: 1270}, {t0: 16.6, t1: 18.0, to: 1150}, {t0: 18.2, t1: 19.7, to: 950, dAfter: -1}, {t0: 23.4, t1: 26.8, to: 250, a: 0.15}]},
    {name: 'wbaby', base: {kind: 'woman', hat: 'kerchief', wear: ['plain', 'shawl'], h: H * 0.88}, x: 1495, walks: [{t0: 8.6, t1: 10.2, to: 1385}, {t0: 16.9, t1: 18.4, to: 1270}, {t0: 23.8, t1: 25.3, to: 1150}]},
    {name: 'docker', base: {kind: 'man', hat: 'cap', coat: 'sack', h: H * 1.02}, x: 1605, walks: [{t0: 8.9, t1: 10.5, to: 1495}, {t0: 17.2, t1: 18.7, to: 1385}, {t0: 24.1, t1: 25.6, to: 1270}]},
  ];
  const people = P.map((p, k) => {
    const an = {...POSES.stand(t, 0.2 * k), tilt: 4 * Math.sin(t * 0.5 + k), blink: (t + k * 0.9) % 4 < 0.12};
    if (p.name === 'young') { an.hatInHand = true; an.tilt = t > 19.6 && t < 22.8 ? -14 : -6; an.fArm = [160, 120]; }
    if (p.name === 'oldman') an.fArm = [170, 172];
    const w = p.walks.map((x) => ({...x})); if (p.name === 'young') w.forEach((x) => { if (x.to !== 250) { x.carry = true; x.an = {fArm: [160, 120]}; } });
    if (p.name === 'oldman') w.forEach((x) => { x.carry = true; x.an = {fArm: [170, 172]}; });
    const r = e4ClubPerson({...p.base, fill: ink, det: Math.min(det, 0.7), rim: rimW(p.x), an}, {x: p.x, d: -1, G, ph: 0.2 * k, walks: w}, t, 'cb.' + p.name);
    return {...r, p};
  });
  const pm = people[0], po = people[1], py = people[2];
  // the mother's letter: she holds it up (2.3), he takes it (3.0), reads (3.3 to 4.8), lays it on the table (5.0); she talks a little
  let mo = pm.fo;
  if (t > 2.2 && t < 7.2) { const sp = e4Speak([[2.3, 3.0], [3.6, 4.6], [6.0, 6.8]], t); mo = {...mo, an: {...mo.an, jaw: sp.jaw, tilt: 6 + 3 * sp.beat + nodAt(6.9), fArm: e4Keys([[2.2, 160, 120], [2.6, 112, 80], [3.3, 112, 80], [3.6, 165, 150]], t), bArm: e4Keys([[5.8, 196, 202], [6.1, 140, 100], [6.8, 196, 202]], t)}}; }
  const Lpt = [818, top - 66], hand1 = smooth(2.25, 2.7, t) * (1 - smooth(3.3, 3.6, t));
  if (hand1 > 0) { mo = {...mo, an: {...mo.an, lean: 7 * hand1}}; const g = E3K.hand(mo, 'f'); mo = hand1 < 1 && t < 3 ? e3Move(mo, 'f', lerp(g.x, Lpt[0] + 22, hand1), lerp(g.y, Lpt[1] + 6, hand1), 'cb.mother.offer') : t < 3.3 ? reach(mo, 'f', Lpt[0] + 22, Lpt[1] + 6, 'cb.mother.offerHold') : mo; }
  if (t < 3.3) { if (t > 2.2) { const g = E3K.hand(mo, 'f'); letterSvg = holding(mo, 'f', 'cb.mother.letter', (gx, gy) => `<rect x="${f1(gx - 30)}" y="${f1(gy - 36)}" width="34" height="44" fill="#E9E0C8" transform="rotate(-8, ${f1(gx)}, ${f1(gy)})"/>`); }
    else letterSvg = holding(mo, 'f', 'cb.mother.letter', (gx, gy) => `<rect x="${f1(gx - 12)}" y="${f1(gy - 30)}" width="26" height="36" fill="#E9E0C8"/>`); }
  // ---- the captain's hands: pen, letter, note ----
  const TS0 = {give: 19.8}, restF = [140, 96], restB = [132, 100];
  cp = {...cp, an: {...cp.an, fArm: restF, bArm: restB}};
  const gHome = E3K.hand(cp, 'f');
  const leanIn = smooth(2.5, 2.9, t) * (1 - smooth(3.3, 3.7, t)) + smooth(TS0.give - 0.6, TS0.give - 0.2, t) * (1 - smooth(TS0.give + 0.1, TS0.give + 0.5, t));
  if (leanIn > 0) cp = {...cp, an: {...cp.an, lean: 13 * leanIn}};
  if (t > 2.6 && t < 3.3) { const g = E3K.hand(mo, 'f'), k = smooth(2.6, 3.0, t); cp = k < 1 ? e3Move(cp, 'f', lerp(gHome.x, g.x - 6, k), lerp(gHome.y, g.y - 10, k), 'cb.cap.toLetter') : reach(cp, 'f', g.x - 6, g.y - 10, 'cb.cap.letter'); }
  else if (t >= 3.3 && t < 5.2) { // reads it, held up before him; lays it on the table
    const sh = E3K.shoulder(cp, 'f'), k = smooth(4.8, 5.15, t), up = [sh[0] + 0.22 * H, sh[1] + 0.03 * H], down = [CB.tx0 + 104, top - 2];
    const L = [lerp(up[0], down[0], k), lerp(up[1], down[1], k)];
    cp = t < 3.6 ? e3Move(cp, 'f', lerp(E3K.hand(mo, 'f').x - 6, up[0], smooth(3.3, 3.6, t)), lerp(E3K.hand(mo, 'f').y - 10, up[1], smooth(3.3, 3.6, t)), 'cb.cap.letterUp') : reach(cp, 'f', L[0], L[1], 'cb.cap.letterHold');
    letterSvg = holding(cp, 'f', 'cb.cap.letterH', (gx, gy) => k < 0.95 ? `<rect x="${f1(gx + 2)}" y="${f1(gy - 40)}" width="34" height="44" fill="#E9E0C8" transform="rotate(${f1(-6 + 80 * k)}, ${f1(gx)}, ${f1(gy)})"/>` : `<rect x="${f1(gx - 2)}" y="${f1(gy - 3)}" width="40" height="3" fill="#E9E0C8"/>`);
  }
  if (t >= 5.2) letterSvg = `<rect x="${CB.tx0 + 102}" y="${top - 3}" width="40" height="3" fill="#E9E0C8"/>`;
  // writing: the pen's nib moves along a line of the right-hand page
  const writeSpans = [[5.3, 6.6], [13.8, 14.9], [21.5, 22.5]];
  for (const [a, b] of writeSpans) { if (t > a - 0.3 && t < b + 0.3) { const u = clamp01((t - a) / (b - a)), P0 = page(0), Pw = page(u * 0.9);
    const nib = [Pw[0] + 3 * Math.sin(t * 31), Pw[1] - Math.abs(2 * Math.sin(t * 17))];
    if (t < a) cp = e3Move(cp, 'f', lerp(gHome.x, P0[0] - 8, smooth(a - 0.3, a, t)), lerp(gHome.y, P0[1] + 22, smooth(a - 0.3, a, t)), 'cb.cap.toPage');
    else if (t > b) cp = e3Move(cp, 'f', lerp(Pw[0] - 8, gHome.x, smooth(b, b + 0.3, t)), lerp(Pw[1] + 22, gHome.y, smooth(b, b + 0.3, t)), 'cb.cap.fromPage');
    else { cp = reach(cp, 'f', nib[0] - 8, nib[1] - 22, 'cb.cap.write'); cp = reach(cp, 'b', page(0)[0] - 50, top - 4, 'cb.cap.pageHold'); }
    penSvg = holding(cp, 'f', 'cb.cap.pen', (gx, gy) => line([[gx, gy], [gx + 8, gy + 22]], '#0D0C09', 2.6) + line([[gx - 2, gy], [gx - 10, gy - 22]], '#E9E0C8', 1.5, 'opacity="0.8"')); } }
  inked = smooth(5.3, 6.6, t) * 0.33 + smooth(13.8, 14.9, t) * 0.33 + smooth(21.5, 22.5, t) * 0.34;
  // the old man talks with his free hand, then touches his hat brim in thanks
  let om = po.fo;
  if (t > 11.2 && t < 16.0) { const sp = e4Speak([[11.4, 12.4], [12.7, 13.6]], t); om = {...om, an: {...om.an, jaw: sp.jaw, tilt: 6 + 3 * sp.beat, bArm: e4Keys([[11.3, 196, 202], [11.6, 120, 92 + 10 * sp.beat], [13.6, 126, 96], [13.9, 196, 202]], t)}};
    if (t > 14.9 && t < 15.9) { const brim = E3K.toWorld(om, 0.1, 0.99), g = E3K.hand({...om, an: {...om.an, bArm: [196, 202]}}, 'b'), k = smooth(14.9, 15.2, t) * (1 - smooth(15.6, 15.9, t));
      om = k >= 1 ? reach(om, 'b', brim[0], brim[1], 'cb.old.brim', true) : e3Move(om, 'b', lerp(g.x, brim[0], k), lerp(g.y, brim[1], k), 'cb.old.toBrim', true); om = {...om, an: {...om.an, tilt: om.an.tilt - 8 * k}}; } }
  // the young man: cap held in both hands, eyes down; a few low words
  let ym = py.fo;
  if (t > 19.7 && t < 23.4) { const sp = e4Speak([[19.9, 20.8], [21.0, 21.5]], t); ym = {...ym, an: {...ym.an, jaw: sp.jaw * 0.7}}; }
  if (py.state !== 'walk' || ym.an.hatInHand) { const g = E3K.hand(ym, 'f'); if (ym.an.hatInHand && !(t > 23.25)) ym = reach(ym, 'b', g.x - (ym.d ?? 1) * 0.03 * ym.h, g.y + 0.02 * ym.h, 'cb.young.cap'); }
  if (t > 23.0) ym = {...ym, an: {...ym.an, hatInHand: t < 23.3}};
  // ---- Tommy (coral) darts in from the saloon with a note, gives it to the captain, darts out ----
  const TS = {in0: 17.6, in1: 19.5, give: 19.8, out0: 20.6, out1: 22.5};
  const tomBase = cast('brother', {x: 0, y: 0, h: H * 1.12, hat: 'boycap', wear: [], det, rim: rimW(900), an: {tilt: 6, expr: 'smile', blink: (t + 0.3) % 3.4 < 0.12}});
  const tr = e4Track({...tomBase, an: {...tomBase.an}}, {x: 1840, d: -1, G: GT, ph: 0.5, walks: [{t0: TS.in0, t1: TS.in1, to: 900, dAfter: -1, a: 0.15, carry: true, an: {fArm: [150, 120]}}, {t0: TS.out0, t1: TS.out1, to: 1860, a: 0.12}]}, t, 'cb.tommy');
  let tm = tr.fo; if (tr.state !== 'walk' && t > TS.in1 && t < TS.out0) tm = {...tm, an: {...tm.an, lean: 6, tilt: 10}};
  const NP = [808, top - 44];
  if (t > TS.in0 && t < TS.give + 0.1) { if (t < TS.in1 + 0.05) noteSvg = holding(tm, 'f', 'cb.tommy.note', (gx, gy) => `<rect x="${f1(gx - 14)}" y="${f1(gy - 8)}" width="22" height="10" fill="#E9E0C8"/>`);
    else { const g = E3K.hand(tm, 'f'), k = smooth(TS.in1 + 0.05, TS.give - 0.05, t); tm = k < 1 ? e3Move(tm, 'f', lerp(g.x, NP[0], k), lerp(g.y, NP[1], k), 'cb.tommy.toCap') : reach(tm, 'f', NP[0], NP[1], 'cb.tommy.give');
      const gg = E3K.hand(tm, 'f'); noteSvg = `<rect x="${f1(gg.x - 16)}" y="${f1(gg.y - 8)}" width="22" height="10" fill="#E9E0C8"/>`; } }
  if (t > TS.give - 0.35 && t < TS.give + 0.9) { const k = smooth(TS.give - 0.35, TS.give - 0.05, t), back = smooth(TS.give + 0.4, TS.give + 0.9, t), chest = E3K.toWorld(cp, 0.05, 0.7);
    if (t < TS.give + 0.1) cp = k < 1 ? e3Move(cp, 'b', lerp(E3K.hand(cp, 'b').x, NP[0] - 12, k), lerp(E3K.hand(cp, 'b').y, NP[1], k), 'cb.cap.toNote') : reach(cp, 'b', NP[0] - 12, NP[1], 'cb.cap.note');
    else { cp = e3Move(cp, 'b', lerp(NP[0] - 12, chest[0], back), lerp(NP[1], chest[1], back), 'cb.cap.pocket'); }
    if (t >= TS.give + 0.1 && back < 0.95) { const g = E3K.hand(cp, 'b'); noteSvg = `<rect x="${f1(g.x - 12)}" y="${f1(g.y - 8)}" width="22" height="10" fill="#E9E0C8"/>`; } }
  // tommy's tip of the cap on the way out (a grin back over his shoulder)
  if (t > TS.give + 0.1 && t < TS.out0) tm = {...tm, an: {...tm.an, fArm: e4Keys([[TS.give + 0.1, 150, 120], [TS.give + 0.4, 170, 165]], t)}};
  // ---- draw, back to front ----
  people.forEach((r, k) => { const fo = k === 0 ? mo : k === 1 ? om : k === 2 ? ym : r.fo; s.push(`<g opacity="${f1(r.op * 100) / 100}">${fig(fo)}${k === 0 ? letterSvg : ''}</g>`); });
  if (t >= 3.3) s.push(letterSvg);
  s.push(e4ClubTable(t, inked), chair, e4Captain(cp, 1, false), penSvg);
  s.push(`<path d="M${CB.tx1 + 50},${985} l8,-34 l34,0 l8,34 Z" fill="#120D08"/>`); // a spittoon by the table leg
  s.push(fig(tm) + noteSvg, room.front);
  const world = layerAt(c, 1, s.join(''));
  if (!o.quiet) { scr.push(tag(130, 120, 'THE WARD CLUB · WILLIAMSBURG · 1887', smooth(0.3, 0.7, t) * (1 - smooth(3.8, 4.2, t)))); }
  return frame(e3Defs2(t), `<rect width="1920" height="1080" fill="#060505"/>`, world, scr.join(''), t);
}
if (typeof window !== 'undefined') Object.assign(window, {renderE4Club});
Object.assign(CLIPS, {ep4_clubhouse: {sec: CB.sec, render: (t) => renderE4Club(t)}});

/* ================= ep4_coal: half a ton of coal, a winter morning outside the Kellys' building (ch 5) ================= */
// The street from the cold open (ep4.js E4_ROW, same coordinates, a man 190 px), by day: overcast, old snow along the curb. A coal
// wagon stands at the curb, the horse resting a hind hoof; the coal man on the wagon bed shovels coal into a chute that runs down to
// the Kellys' coal hole; lumps rattle down, dust puffs out. Ma Kelly (coral) watches from the top of the stoop, arms folded. The
// captain walks by along the sidewalk, tips his hat to her, and walks on.
const CO = {sec: 12, wx: 1250, hole: [1338, 942], bedY: 1062 - 0.62 * 190};
function e4CoalWagon(t, H) { // faces left; x = its tail (right end); returns svg and the chute mouth
  const {GE} = E4F, x = CO.wx, c = '#141A19', s = [];
  const X = (u) => x - u * H, Y = (v) => GE - v * H;
  s.push(`<rect x="${f1(X(1.9))}" y="${f1(Y(0.98))}" width="${f1(1.9 * H)}" height="${f1(0.38 * H)}" fill="${c}"/><rect x="${f1(X(1.9))}" y="${f1(Y(0.98))}" width="${f1(1.9 * H)}" height="4" fill="#DFE0D6" opacity="0.2"/>` +
    [0.3, 0.8, 1.3].map((u) => `<rect x="${f1(X(u))}" y="${f1(Y(0.98))}" width="5" height="${f1(0.38 * H)}" fill="#0A0E0D"/>`).join(''));
  // the coal heap, lumpy, higher toward the front
  const r = rng(611); let d = `M${f1(X(1.88))},${f1(Y(0.98))}`; for (let u = 1.88; u >= 0.25; u -= 0.08) d += ` L${f1(X(u))},${f1(Y(0.98 + 0.16 * Math.sin(Math.PI * (u - 0.2) / 1.75) + 0.02 * r()))}`; d += ` L${f1(X(0.25))},${f1(Y(0.98))} Z`;
  s.push(`<path d="${d}" fill="#090B0B"/>` + [...Array(20)].map(() => { const u = 0.4 + r() * 1.4, v = 0.99 + r() * 0.12; return `<circle cx="${f1(X(u))}" cy="${f1(Y(v))}" r="${f1(2 + r() * 3)}" fill="#2A302E"/>`; }).join(''));
  for (const [u, rr] of [[0.45, 0.3], [1.55, 0.3]]) { const cx = X(u), R = rr * H, cy = GE - R; let sp = ''; for (let i = 0; i < 12; i++) { const a = i * TAU / 12; sp += `M${f1(cx)},${f1(cy)}L${f1(cx + Math.cos(a) * R)},${f1(cy + Math.sin(a) * R)}`; }
    s.push(`<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(R)}" fill="none" stroke="${c}" stroke-width="${f1(0.045 * H)}"/><path d="${sp}" stroke="${c}" stroke-width="${f1(0.016 * H)}"/>`); }
  s.push(line([[X(1.9), Y(0.68)], [X(2.6), Y(0.82)]], c, 6)); // the shafts
  return {svg: s.join(''), bed: Y(0.98) + 0, mouth: [X(-0.05), Y(1.0)]};
}
function renderE4Coal(t, o = {}) {
  const {H, GC, GE, CURB, WF} = E4F, c = cam2(o.cam || camAt([[0, 1.62, 1230, 770], [6, 1.72, 1330, 760], [12, 1.84, 1430, 752]], t)), lod = lodFor(H * c.z), det = lod.det;
  const back = [], W = [], street = [], scr = [], rim = {c: '#E9EEEA', a: lod.rimA * 0.55, dx: -0.007, dy: -0.006};
  E4_ROW.forEach((b) => back.push(e4Facade({...b, burn: false}, t, 0)));
  for (const b of E4_ROW) for (const cx of [b.x + 60, b.x + b.w - 110]) back.push(`<rect x="${cx}" y="${E4F.top - 110}" width="50" height="76" fill="#0E1514"/><rect x="${cx - 7}" y="${E4F.top - 122}" width="64" height="5" rx="2" fill="${E4.snow}" opacity="0.8"/>` + MAT.smoke(cx + 25, E4F.top - 120, t + 20 + cx * 0.01, {col: 'A3BAB2', k: 0.7, n: 5, rise: 160, drift: 120, speed: 6, seed: cx}));
  // sidewalk with trodden snow, old snow banked along the curb, the street
  back.push(`<rect x="-1500" y="${WF}" width="6000" height="${CURB - WF}" fill="#7C8C8C"/><rect x="-1500" y="${WF}" width="6000" height="${CURB - WF}" fill="url(#matFloorShade)" opacity="0.5"/><rect x="-1500" y="${WF - 4}" width="6000" height="6" fill="#0A0F0E" opacity="0.7"/>` +
    `<rect x="-1500" y="${CURB}" width="6000" height="10" fill="#3A4544"/><rect x="-1500" y="${CURB + 10}" width="6000" height="900" fill="#5E6E70"/>` + [1000, 1040, 1085].map((yy) => `<rect x="-1500" y="${yy}" width="6000" height="4" fill="#465456" opacity="0.7"/>`).join(''));
  for (let x = -600; x < 3200; x += 140) back.push(`<path d="M${x},${CURB + 2} q35,-${18 + (x % 50) / 5} 70,-4 q35,-${10 + (x % 30) / 3} 70,4 Z" fill="#C9D3D2" opacity="0.85"/>`);
  // the coal hole: an iron plate lifted off the sidewalk
  const [hx, hy] = CO.hole;
  back.push(`<ellipse cx="${hx}" cy="${hy}" rx="30" ry="6" fill="#050707"/><ellipse cx="${hx + 52}" cy="${hy + 2}" rx="24" ry="5" fill="#1D2423"/>`);
  // the wagon and its horse (standing, a hind hoof resting, the head tossing now and then)
  const wg = e4CoalWagon(t, H);
  const horse = e4Horse(CO.wx - 2.95 * H, GE, 0.92 * H, '#141A19', 0, {dir: -1, gait: 'walk', rest: 9, restHind: true, toss: Math.max(0, Math.sin(t * 0.9 + 1)) ** 10, harness: true});
  // the chute from the tailboard down to the hole
  const M = wg.mouth, chute = `<path d="M${f1(M[0] - 10)},${f1(M[1] - 6)} L${f1(M[0] + 22)},${f1(M[1] - 14)} L${hx + 14},${hy - 8} L${hx - 12},${hy - 2} Z" fill="#2B3332"/><path d="M${f1(M[0] - 10)},${f1(M[1] - 6)} L${hx - 12},${hy - 2}" stroke="#0A0E0D" stroke-width="4"/>` + line([[M[0] + 6, M[1] - 10], [M[0] + 8, GE]], '#0A0E0D', 4);
  // the coal man on the bed: dig, lift, swing to the chute, tip; 1.7 s a shovelful
  const cyc = 1.7, ph = (t % cyc) / cyc, k = Math.floor(t / cyc);
  const bedY = wg.bed, cm0 = {x: CO.wx - 0.78 * H, y: bedY, h: H * 0.98, d: 1, kind: 'man', hat: 'cap', coat: 'jacket', fill: '#0D0C09', det: Math.min(det, 0.6), rim, an: {...POSES.stand(t, 0.4), tilt: -12}};
  const dig = smooth(0.0, 0.25, ph) * (1 - smooth(0.45, 0.62, ph)), tip = smooth(0.55, 0.72, ph) * (1 - smooth(0.85, 1.0, ph));
  const lean = 22 * dig - 6 * tip;
  let cm = e3Stand({...cm0, floorY: bedY}, cm0.x, cm0.x, 0, 'co.coalman');
  cm = {...cm, an: {...cm.an, lean}};
  // the blade: down in the heap behind him while digging, up at the chute mouth when tipping
  // the shovel is 0.6 h long: the handle end stays near his hip, the blade points at the coal (dig) or the chute's mouth (tip)
  const heap = [CO.wx - 0.3 * H, bedY - 0.04 * H], mouthP = [M[0] - 6, M[1] - 26];
  const swing = smooth(0.35, 0.62, ph) * (1 - smooth(0.86, 1.0, ph));
  const tgt = [lerp(heap[0], mouthP[0], swing), lerp(heap[1], mouthP[1], swing) - 40 * Math.sin(Math.PI * swing)];
  const handle = [cm.x + lerp(0.02, 0.06, swing) * H + 0.1 * H * Math.sin(lean * Math.PI / 180), cm.y - lerp(0.58, 0.68, swing) * H + 0.1 * H * (1 - Math.cos(lean * Math.PI / 180))];
  const sl = Math.hypot(tgt[0] - handle[0], tgt[1] - handle[1]) || 1, blade = [handle[0] + (tgt[0] - handle[0]) / sl * 0.6 * H, handle[1] + (tgt[1] - handle[1]) / sl * 0.6 * H];
  const along = (u) => [lerp(handle[0], blade[0], u), lerp(handle[1], blade[1], u)];
  cm = reach(cm, 'b', handle[0], handle[1], 'co.coalman.handle'); const g2 = along(0.27); cm = reach(cm, 'f', g2[0], g2[1], 'co.coalman.shaft');
  const bdir = Math.atan2(blade[1] - handle[1], blade[0] - handle[0]), ta = tip * 1.1;
  const shovel = line([handle, blade], '#3A2C1C', 4) + `<g transform="rotate(${f1((bdir + ta) * 180 / Math.PI)}, ${f1(blade[0])}, ${f1(blade[1])})"><path d="M${f1(blade[0])},${f1(blade[1] - 10)} l26,-2 l4,12 l-4,12 l-26,-2 Z" fill="#20282A"/>${swing > 0.1 && tip < 0.5 ? [0, 1, 2].map((i) => `<circle cx="${f1(blade[0] + 10 + i * 7)}" cy="${f1(blade[1] - 12 - (i % 2) * 4)}" r="4" fill="#090B0B"/>`).join('') : ''}</g>`;
  // lumps rattling down the chute after each tip, dust puffing out of the hole
  const lumps = [], r = rng(613);
  for (let j = 0; j < 14; j++) { const lag = r() * 0.4, u = ((t - (k * cyc + 0.66 * cyc) - lag) / 0.55); const uu = u < 0 ? (t - ((k - 1) * cyc + 0.66 * cyc) - lag) / 0.55 : u;
    if (uu > 0 && uu < 1) { const p0 = [M[0] + 4, M[1] - 12], p1 = [hx, hy - 6]; lumps.push(`<circle cx="${f1(lerp(p0[0], p1[0], uu * uu) + (r() - 0.5) * 6)}" cy="${f1(lerp(p0[1], p1[1], uu * uu) - 6 - r() * 4)}" r="${f1(2.5 + r() * 2.5)}" fill="#0A0C0C"/>`); } }
  const dust = MAT.smoke(hx, hy - 6, t, {col: 'A3BAB2', k: 0.5, n: 6, rise: 50, drift: 40, speed: 1.7, seed: 615});
  // Ma Kelly at the top of the stoop, arms folded, in her shawl; she watches the coal, then the captain; a small nod back
  const kelly = E4_ROW.find((b) => b.kelly), mx = kelly.stoop + E4_STOOP.n * E4_STOOP.run + 44, my = E4F.GS - E4_STOOP.n * E4_STOOP.rise;
  const capX = (tt) => 380 + 1760 * e3Trap(tt, 1.0, 11.9, 0.06), cx = capX(t);
  const look = cx > 1200 && cx < 1900 ? 1 : 0, maNod = -8 * e4Bump(t, 7.35, 0.6);
  let ma = cast('mother', {x: mx, y: my, h: H, d: -1, det, rim, an: {...POSES.stand(t, 0.3), ...E3_FOLD, lean: 0, tilt: look ? -8 + maNod : -18 + 2 * Math.sin(t * 0.7), expr: 'set', blink: (t + 1.1) % 3.9 < 0.12}});
  ma = e3Stand({...ma, floorY: my}, mx, mx, 0, 'co.ma'); ma = {...ma, d: cx > mx ? 1 : -1, an: {...ma.an, ...E3_FOLD, lean: 0}};
  W.push(fig(ma) + foldedArms(ma.x, ma.y, ma.h, ma.d, ma.fill, ma.tones.tone));
  // the captain walks by and tips his hat to her (7.0 to 7.9) without stopping
  let cp = e4Walk(e4CaptainOpts({x: 0, y: 0, h: H, d: 1, det, rim, an: {tilt: cx > 1300 && cx < 1700 ? 14 : 2, expr: "smile", blink: (t + 0.4) % 3.6 < 0.12, glintT: t}}), 380, 1, cx - 380, GC, 'co.cap');
  if (t > 6.7 && t < 8.2) { const brim = E3K.toWorld(cp, 0.1, 0.99), g = E3K.hand(cp, 'f'), kk = smooth(6.7, 7.0, t) * (1 - smooth(7.8, 8.2, t));
    cp = kk >= 1 ? reach(cp, 'f', brim[0], brim[1], 'co.cap.brim', true) : e3Move(cp, 'f', lerp(g.x, brim[0], kk), lerp(g.y, brim[1], kk), 'co.cap.toBrim', true); }
  W.push(e4Captain(cp));
  street.push(horse.svg, wg.svg, fig(cm), shovel, chute, ...lumps, dust);
  back.push(`<rect x="-1500" y="-600" width="6000" height="${WF + 10 + 600}" fill="#C9D6D2" opacity="0.13"/>`); // flat grey morning light on the brick
  const world = layerAt(c, 1, back.join('') + W.join('') + street.join(''));
  const sky = `<rect width="1920" height="1080" fill="url(#e4day)"/>`;
  if (!o.quiet) scr.push(tag(130, 120, 'WILLIAMSBURG · WINTER 1887', smooth(0.3, 0.7, t) * (1 - smooth(3.6, 4.0, t))));
  scr.push(e4Snow(t, c, {n: 40, seed: 47, size: 1.6, speed: 40, op: 0.4, par: 0.3}));
  return frame(e3Defs(t, grad('e4day', [['0', '#6F8584'], ['1', '#B9C6C2']]) + e4FireDefs()), sky, world, scr.join(''), t);
}
if (typeof window !== 'undefined') Object.assign(window, {renderE4Coal});
Object.assign(CLIPS, {ep4_coal: {sec: CO.sec, render: (t) => renderE4Coal(t)}});

/* ================= ep4_kelly_flat (ch 2) and ep4_kelly_flat_end (ch 8): the Kellys' kitchen in winter ================= */
// kelly_flat's look (faded wallpaper, the coal stove, a shelf of pots, one lamp) at the Ep 3 room scale (RM: a man 480 px), with the
// flat's door in the cut wall on the left and a front window on the back wall that looks over the roofs to the refinery's stacks.
// Ch 2: the coal bucket by the stove is empty, the fire low, frost on the glass: Ma at the stove, Michael at the table with a mug,
// Tommy restless by the window, then at the table talking. Ch 8: the bucket heaped with coal, the stove bright; Tommy bursts in
// ("there's a city job for you"), Michael answers flatly ("I've got a job.") and turns back to the window and the stacks.
const KF = {stove: 520, scuttle: 730, table: [1130, 1370], tableEnd: [800, 1040], win: [1250, 1430], chair: 1080};
function e4KellyRoom(t, full) {
  KF.tbl = full ? KF.tableEnd : KF.table;
  const {x0, x1, F, ceil, wallFoot, H} = RM, s = [], fl = 0.86 + 0.08 * Math.sin(t * 7.3) + 0.05 * Math.sin(t * 16.1);
  const room = e3Room({door: true, seed: 481, paper: 0.15});
  s.push(room.back);
  // the window on the back wall: snowy roofs, the refinery's stacks and their smoke, a grey winter sky; frost in the corners (ch 2)
  const [w0, w1] = KF.win, wy0 = 340, wy1 = 700;
  s.push(`<rect x="${w0 - 16}" y="${wy0 - 16}" width="${w1 - w0 + 32}" height="${wy1 - wy0 + 32}" fill="#0D0C09"/><rect x="${w0}" y="${wy0}" width="${w1 - w0}" height="${wy1 - wy0}" fill="url(#kfsky)"/>`);
  const roof = (yy, col, seed) => { const r = rng(seed); let d = `M${w0},${wy1}`; for (let x = w0; x <= w1; x += 18) d += ` L${x},${f1(yy - r() * 16 - (r() < 0.2 ? 26 : 0))}`; return `<path d="${d} L${w1},${wy1} Z" fill="${col}"/>`; };
  s.push(`<g clip-path="url(#kfwin)">` + roof(600, '#7E908E', 491) +
    [[1262, 420, 16], [1318, 380, 20], [1366, 440, 14]].map(([sx, sy, sw]) => `<rect x="${sx}" y="${sy}" width="${sw}" height="${600 - sy}" fill="#5F7472"/>` + MAT.smoke(sx + sw / 2, sy, t + sx * 0.01, {col: 'A3BAB2', k: 0.55, n: 6, rise: 130, drift: 80, speed: 5, seed: sx})).join('') +
    `<rect x="${w0}" y="560" width="${w1 - w0}" height="50" fill="#5F7472"/>` + roof(655, '#3E5450', 493) + roof(690, '#24312F', 495) + `<rect x="${w0}" y="${wy1 - 12}" width="${w1 - w0}" height="12" fill="#DCE4E2" opacity="0.6"/></g>`);
  s.push(`<rect x="${(w0 + w1) / 2 - 4}" y="${wy0}" width="8" height="${wy1 - wy0}" fill="#0D0C09"/><rect x="${w0}" y="${(wy0 + wy1) / 2 - 4}" width="${w1 - w0}" height="8" fill="#0D0C09"/><rect x="${w0 - 26}" y="${wy1 + 12}" width="${w1 - w0 + 52}" height="16" fill="#0D0C09"/>`);
  if (!full) s.push([[w0, wy0, 1, 1], [w1, wy0, -1, 1], [w0, wy1, 1, -1], [w1, wy1, -1, -1]].map(([x, y, dx, dy]) => `<path d="M${x},${y} q${dx * 60},${dy * 6} ${dx * 80},${dy * 50} q${-dx * 40},${-dy * 10} ${-dx * 80},${dy * 34} Z" fill="#E6EEEC" opacity="0.45"/>`).join(''));
  s.push(`<rect x="${w0}" y="${wy0}" width="${w1 - w0}" height="${wy1 - wy0}" fill="#DCE8E6" opacity="0.08"/>` + glowC((w0 + w1) / 2, (wy0 + wy1) / 2, 380, 0.35, 'kfcold'));
  // the stove, its pipe, the kettle; low fire (ch 2) or bright (ch 8)
  const sx = KF.stove, fire = full ? 1 : 0.35;
  s.push(`<rect x="${sx}" y="${wallFoot - 250}" width="190" height="200" fill="#0D0C09"/><rect x="${sx - 10}" y="${wallFoot - 262}" width="210" height="16" fill="#0D0C09"/><rect x="${sx + 16}" y="${wallFoot - 50}" width="16" height="${F - wallFoot + 50}" fill="#0D0C09"/><rect x="${sx + 158}" y="${wallFoot - 50}" width="16" height="${F - wallFoot + 50}" fill="#0D0C09"/>` +
    `<rect x="${sx + 130}" y="${ceil}" width="30" height="${wallFoot - 262 - ceil}" fill="#0D0C09"/><rect x="${sx + 30}" y="${wallFoot - 190}" width="80" height="54" fill="#FFB15C" opacity="${f1((0.25 + 0.5 * fire) * (0.85 + 0.15 * Math.sin(t * 9)))}"/>` +
    `<path d="M${sx + 24},${wallFoot - 262} q0,-48 46,-48 q46,0 46,48 Z" fill="#0D0C09"/>` + glowC(sx + 70, wallFoot - 160, 260 + 140 * fire, (0.25 + 0.45 * fire) * fl, 'mswarm') + MAT.smoke(sx + 112, wallFoot - 320, t, {col: 'A3BAB2', k: 0.35, n: 5, rise: 120, drift: 40, seed: 497}));
  // the coal bucket (a tin scuttle) by the stove: empty, its bottom showing; or heaped with coal
  const bx = KF.scuttle, by = F + 34, sc = [];
  sc.push(MAT.shadow(bx, by + 2, 52, 0.45) + `<path d="M${bx - 42},${by} L${bx - 50},${by - 76} L${bx + 40},${by - 92} L${bx + 46},${by} Z" fill="#1B2120"/><path d="M${bx - 50},${by - 76} Q${bx - 4},${by - 104} ${bx + 40},${by - 92}" stroke="#4E5A57" stroke-width="3" fill="none"/>` +
    `<path d="M${bx - 30},${by - 82} q30,-50 60,-8" stroke="#0D0C09" stroke-width="4" fill="none"/>` +
    (full ? `<path d="M${bx - 52},${by - 76} q18,-34 44,-30 q24,-12 50,14 Z" fill="#0A0C0C"/>` + [0, 1, 2, 3, 4, 5].map((k) => `<circle cx="${bx - 34 + k * 14}" cy="${by - 96 + (k % 2) * 8}" r="5" fill="#262C2B"/>`).join('')
      : `<ellipse cx="${bx - 5}" cy="${by - 84}" rx="44" ry="9" fill="#5E6A66"/><ellipse cx="${bx - 5}" cy="${by - 83}" rx="37" ry="6" fill="#8C9A96" opacity="0.8"/>`));
  // a shelf of pots, the lamp on the table, the table and two chairs
  s.push(`<rect x="560" y="300" width="300" height="10" fill="#0D0C09"/>` + [0, 1, 2, 3].map((k) => `<path d="M${578 + k * 70},300 l6,-${40 + (k % 2) * 14} l40,0 l6,${40 + (k % 2) * 14} Z" fill="#0D0C09"/>`).join(''));
  const [t0, t1] = KF.tbl, ty = F - 230;
  s.push(MAT.shadow((t0 + t1) / 2, F + 4, 170, 0.4) + `<rect x="${t0}" y="${ty}" width="${t1 - t0}" height="14" fill="#2B2418"/><rect x="${t0 + 14}" y="${ty + 14}" width="12" height="${F - ty - 14}" fill="#0D0C09"/><rect x="${t1 - 26}" y="${ty + 14}" width="12" height="${F - ty - 14}" fill="#0D0C09"/>`);
  s.push(`<path d="M${t1 - 70},${ty} l10,-40 q-22,-26 18,-44 q40,18 18,44 l10,40 Z" fill="#0D0C09"/><ellipse cx="${t1 - 50}" cy="${ty - 96}" rx="5" ry="12" fill="#FFF3D6"/>` + glowC(t1 - 50, ty - 96, 420, 0.6 * fl, 'mswarm'));
  return {back: s.join(''), front: room.front, ty, fl, scuttle: sc.join('')};
}
const e4KfDefs = (t) => e3Defs2(t).replace('</defs>', grad('kfsky', [['0', '#8FA5A2'], ['1', '#C9D4D0']]) + `<clipPath id="kfroom"><rect x="${RM.x0 - 34}" y="-500" width="3000" height="2500"/></clipPath><clipPath id="kfwin"><rect x="${KF.win[0]}" y="340" width="${KF.win[1] - KF.win[0]}" height="360"/></clipPath>` +
  `<radialGradient id="kfcold"><stop offset="0" stop-color="#CFE0DE" stop-opacity="0.35"/><stop offset="1" stop-color="#CFE0DE" stop-opacity="0"/></radialGradient></defs>`);
const e4Mug = (x, y) => `<path d="M${f1(x - 14)},${f1(y)} l2,-30 l24,0 l2,30 Z" fill="#3B4640"/><path d="M${f1(x + 14)},${f1(y - 24)} q12,2 8,14 q-4,6 -10,4" stroke="#3B4640" stroke-width="4" fill="none"/>` +
  `<path d="M${f1(x - 4)},${f1(y - 34)} q-6,-14 2,-24 M${f1(x + 6)},${f1(y - 36)} q6,-12 -2,-22" stroke="#DFE0D6" stroke-width="2" fill="none" opacity="0.35"/>`;
function renderE4KellyFlat(t, o = {}) {
  const full = !!o.full, {F, H} = RM, room = e4KellyRoom(t, full), s = [room.back], scr = [], ty = room.ty;
  const c = cam2(o.cam || (full ? camAt([[0, 1.22, 940, 610], [4.0, 1.28, 980, 620], [9.0, 1.38, 1060, 615], [12.5, 1.55, 1220, 590], [16, 1.7, 1280, 575]], t) : camAt([[0, 1.22, 960, 610], [13, 1.34, 990, 625]], t)));
  const lod = lodFor(H * c.z), det = lod.det, rimW = {c: '#FFE6C9', a: lod.rimA * 0.7 * room.fl, dx: -0.008, dy: -0.004}, rimC = {c: '#DCE8E6', a: lod.rimA * 0.6, dx: 0.008, dy: -0.005};
  // ---- Ma at the stove: stirring the pot (ch 8), or looking down at the empty bucket and warming her hands (ch 2) ----
  const mx = KF.stove + 290;
  const mF = full ? F - 16 : F;
  let ma = cast('mother', {x: mx, y: mF, h: H, d: -1, det, rim: rimW, an: {...POSES.stand(t, 0.5), tilt: full ? -12 + (t > 9.4 && t < 12 ? 16 : 0) : (t < 4.5 ? -24 : -8), expr: full && t > 9.6 ? 'worried' : 'neutral', blink: (t + 0.6) % 3.8 < 0.12}});
  ma = e3Stand({...ma, floorY: mF}, mx, mx, 0, 'kf.ma');
  const potP = [KF.stove + 120, RM.wallFoot - 280];
  if (full) { const k = Math.sin(t * 3.1); ma = {...ma, an: {...ma.an, lean: 8}}; ma = reach(ma, 'f', potP[0] + 18 * k, potP[1] - 4 * Math.abs(k), 'kf.ma.spoon'); ma = reach(ma, 'b', potP[0] + 46, potP[1] + 4, 'kf.ma.pot'); }
  else { const warm = smooth(4.5, 5.2, t), rub = Math.sin(t * 7) * 6 * warm; const hp = [KF.stove + 210, RM.wallFoot - 200];
    if (warm > 0) { const g1 = E3K.hand({...ma, an: {...ma.an, fArm: [170, 160]}}, 'f'), g2 = E3K.hand({...ma, an: {...ma.an, bArm: [190, 196]}}, 'b');
      ma = warm < 1 ? e3Move(ma, 'f', lerp(g1.x, hp[0], warm), lerp(g1.y, hp[1], warm), 'kf.ma.warm') : e3Move(ma, 'f', hp[0] + rub, hp[1], 'kf.ma.warm');
      ma = warm < 1 ? e3Move(ma, 'b', lerp(g2.x, hp[0] + 16, warm), lerp(g2.y, hp[1] + 6, warm), 'kf.ma.warm2') : e3Move(ma, 'b', hp[0] + 16 - rub, hp[1] + 6, 'kf.ma.warm2'); }
    else ma = {...ma, an: {...ma.an, ...E3_FOLD, lean: 0}}; }
  const maOver = !full && t < 4.5 ? foldedArms(ma.x, ma.y, ma.h, -1, ma.fill, ma.tones.tone) : '';
  // the spoon and pot (ch 8)
  const pot = `<path d="M${potP[0] - 10},${RM.wallFoot - 262} l6,-46 l100,0 l6,46 Z" fill="#141817"/>` + (full ? holding(ma, 'f', 'kf.spoon', (gx, gy) => line([[gx, gy], [gx + 10, gy + 40]], '#3A2C1C', 4)) : '');
  let mi, tm, miOver = '', tmProps = '';
  if (!full) {
    // ---- ch 2: Michael at the table with a mug in both hands; Tommy by the window, then at the table talking, hands on it ----
    const cx = KF.chair;
    mi = sitOn(cast('michael', {x: cx, y: 0, h: H, d: 1, det, rim: rimW, an: {tilt: t > 7.2 && t < 11.5 ? 6 : -10 + 2 * Math.sin(t * 0.6), expr: 'set', blink: (t + 1.4) % 3.6 < 0.12}}), F - 0.24 * H, F, 0.18, 'kf.michael.seat');
    const mug = [KF.table[0] + 60, ty];
    mi = reach(mi, 'f', mug[0] + 14, mug[1] - 16, 'kf.michael.mug'); mi = reach(mi, 'b', mug[0] - 12, mug[1] - 14, 'kf.michael.mug2');
    if (t > 10.3 && t < 11.3) mi = {...mi, an: {...mi.an, tilt: mi.an.tilt + 6 * Math.sin((t - 10.3) * 12) * (1 - smooth(10.9, 11.3, t))}}; // a small shake of the head
    tmProps = e4Mug(mug[0], mug[1]) + `<rect x="${cx - 50}" y="${F - 0.24 * H}" width="100" height="12" fill="#0D0C09"/><rect x="${cx - 46}" y="${F - 0.24 * H + 12}" width="10" height="${0.24 * H - 12}" fill="#0D0C09"/><rect x="${cx + 34}" y="${F - 0.24 * H + 12}" width="10" height="${0.24 * H - 12}" fill="#0D0C09"/><rect x="${cx - 50}" y="${F - 0.24 * H - 220}" width="10" height="220" fill="#0D0C09"/>`;
    const tsp = e4Speak([[8.0, 9.4], [9.7, 10.6]], t);
    const tBase = cast('brother', {x: 0, y: 0, h: H * 1.12, hat: 'boycap', wear: [], det, rim: rimC, an: {tilt: t < 6 ? 8 + 4 * Math.sin(t * 1.3) : 6 + 4 * tsp.beat, expr: 'smile', jaw: tsp.jaw, blink: (t + 0.2) % 3.3 < 0.12}});
    const tr = e4Track(tBase, {x: 1330, d: -1, G: F, ph: 0.8, walks: [{t0: 6.0, t1: 7.0, to: 1385, dAfter: -1, a: 0.2}]}, t, 'kf.tommy');
    tm = tr.fo;
    if (tr.state === 'start') { const bounce = 0.012 * Math.abs(Math.sin(t * 5.2)); tm = {...tm, an: {...tm.an, bob: 0}}; tm = e3Stand({...tm, y: F - bounce * 0 }, tm.x, tm.x, 0, 'kf.tommy.bounce'); tm = {...tm, d: t > 2.2 && t < 4.6 ? 1 : -1, an: {...tm.an, tilt: t > 2.2 && t < 4.6 ? 14 : tm.an.tilt}}; } // looking out, then round
    if (tr.state === 'stand' && t > 7.6) { const lean = smooth(7.6, 8.0, t); tm = {...tm, an: {...tm.an, lean: 10 * lean}}; const T1 = [KF.table[1] - 40, ty - 1], T2 = [KF.table[1] - 84, ty - 1];
      tm = lean < 1 ? e3Move(tm, 'f', lerp(E3K.hand(tm, 'f').x, T2[0], lean), lerp(E3K.hand(tm, 'f').y, T2[1], lean), 'kf.tommy.toTable') : reach(tm, 'f', T2[0] + (tsp.on ? 0 : 0), T2[1], 'kf.tommy.table');
      if (lean >= 1) { tm = reach(tm, 'b', T1[0], T1[1], 'kf.tommy.table2'); if (tsp.on && t > 9.7) { const g = E3K.hand(tm, 'f'); tm = e3Move(tm, 'f', g.x, g.y - 60 * tsp.beat, 'kf.tommy.gesture'); } } }
  } else {
    // ---- ch 8: Michael at the window, looking out at the stacks; Tommy bursts in, talks fast; Michael, flatly; back to the window ----
    const KT = {door: 1.6, in0: 2.0, in1: 3.6, talk: [[4.0, 5.6], [5.9, 7.5]], turn: 7.6, reply: [[8.3, 9.2]], back: 9.8};
    const tsp = e4Speak(KT.talk, t), msp = e4Speak(KT.reply, t);
    const mxw = KF.win[0] - 10, toT = t > KT.turn - 0.2 && t < KT.back;
    mi = cast('michael', {x: mxw, y: F, h: H, d: toT ? -1 : 1, det, rim: rimC, an: {...POSES.stand(t, 0.2), tilt: toT ? 0 : 10 + 1.5 * Math.sin(t * 0.5), expr: 'set', jaw: msp.jaw, blink: (t + 2.2) % 3.9 < 0.12}});
    mi = e3Stand({...mi, floorY: F}, mxw, mxw, 0, 'kf.michael.stand');
    if (!toT) { mi = {...mi, an: {...mi.an, ...E3_FOLD, lean: 0}}; miOver = foldedArms(mi.x, mi.y, mi.h, mi.d, mi.fill, mi.tones.tone); }
    const tBase = cast('brother', {x: 0, y: 0, h: H * 1.12, hat: 'boycap', wear: [], det, rim: rimW, an: {tilt: 4 + 5 * tsp.beat + (t > 9.4 ? -10 * smooth(9.4, 10.2, t) : 0), expr: t > 9.4 ? 'neutral' : 'smile', jaw: tsp.jaw, blink: (t + 0.9) % 3.3 < 0.12}});
    const tr = e4Track(tBase, {x: RM.x0 - 200, d: 1, G: F + 24, ph: 0.8, walks: [{t0: KT.in0, t1: KT.in1, to: mxw - 250, dAfter: 1, a: 0.14}]}, t, 'kf.tommy');
    tm = tr.fo;
    if (tr.state === 'stand' || tr.state === 'settle') { // fast, bright gestures while he talks; arms fall at Michael's answer; a shrug
      const b = tsp.on ? 10 * tsp.beat : 0;
      const fK = [[3.9, 176, 180], [4.2, 100, 70 + b], [5.0, 96, 60], [5.6, 120, 90], [5.9, 60, 30], [6.6, 56, 20 + b], [7.5, 104, 80], [8.6, 110, 86], [9.4, 176, 182], [10.3, 140, 120], [10.8, 176, 182]];
      const bK = [[3.9, 184, 190], [4.3, 140, 110], [5.6, 150, 118], [7.5, 150, 118], [9.4, 186, 192], [10.3, 150, 126], [10.8, 186, 192]];
      tm = {...tm, an: {...tm.an, fArm: e4Keys(fK, t), bArm: e4Keys(bK, t), lean: tsp.on ? 4 : 0}}; }
    // the door: pulled open as he comes, swinging back
    const da = 70 * smooth(KT.door, KT.door + 0.3, t) * (1 - smooth(KT.in1 + 0.6, KT.in1 + 2.2, t));
    s.push(knDoor(da, -9).svg);
  }
  s.push(pot, fig(ma) + maOver, room.scuttle, tmProps, fig(mi) + miOver, `<g clip-path="url(#kfroom)">${fig(tm)}</g>`, room.front);
  const world = layerAt(c, 1, s.join(''));
  if (!o.quiet && !full) scr.push(tag(130, 120, 'THE KELLYS\' KITCHEN · WINTER 1887', smooth(0.3, 0.7, t) * (1 - smooth(3.6, 4.0, t))));
  return frame(e4KfDefs(t), `<rect width="1920" height="1080" fill="#060A0A"/>`, world, scr.join(''), t);
}
if (typeof window !== 'undefined') Object.assign(window, {renderE4KellyFlat});
Object.assign(CLIPS, {ep4_kelly_flat: {sec: 13, render: (t) => renderE4KellyFlat(t)}, ep4_kelly_flat_end: {sec: 16, render: (t) => renderE4KellyFlat(t, {full: true})}});

/* ================= ep4_papers: the hallway, the Rabinowitzes' door (ch 5) ================= */
// The building's hall (the Ep 3 knock set's hall: dark boards, a gas jet, the stair rail), at the Rabinowitzes' open door, their
// flat warm behind them. Yankel (wheat gold, skullcap and vest) holds his papers out; Rivke (wheat gold, about 15) at his shoulder;
// the captain, kind, touches the papers and says his one line to her: "Tell your father we'll help with his papers. No charge."
// Rivke leans in and translates; Yankel turns to listen, turns back and nods. The captain tips his hat and goes along the hall.
const PA = {sec: 12, F: 980, H: 470, wall: 930, ceil: 200, door: [1080, 1300]};
function e4Hall(t) {
  const {F, wall, ceil} = PA, s = [], fl = 0.88 + 0.07 * Math.sin(t * 8.3);
  s.push(`<rect x="-1500" y="-1200" width="5000" height="3600" fill="#060A0A"/><rect x="-600" y="${ceil}" width="3200" height="${wall - ceil}" fill="#18231F"/><rect x="-600" y="${ceil}" width="3200" height="${wall - ceil}" fill="url(#flwp)" opacity="0.06"/>`);
  s.push(`<rect x="-600" y="${wall - 260}" width="3200" height="260" fill="#1A1410"/><rect x="-600" y="${wall - 268}" width="3200" height="10" fill="#120D08"/>` + MAT.floor(-600, 2600, wall, F + 70, {kind: 'planks', base: '#2A251C', seed: 511, size: 50, vp: 960}));
  // a neighbour's closed door on the left, the gas jet, the stair rail going down at the far left
  s.push(`<rect x="300" y="${wall - 520}" width="220" height="520" fill="#120D08"/><rect x="316" y="${wall - 506}" width="188" height="506" fill="#2B2116"/><rect x="336" y="${wall - 480}" width="148" height="190" fill="none" stroke="#1A130C" stroke-width="5"/><circle cx="484" cy="${wall - 250}" r="6" fill="#6A5A3A"/>`);
  s.push(`<rect x="760" y="${wall - 470}" width="8" height="30" fill="#0D0C09"/>` + line([[764, wall - 456], [790, wall - 466]], '#0D0C09', 4) + `<ellipse cx="792" cy="${wall - 480}" rx="5" ry="11" fill="#FFF3D6"/>` + glowC(792, wall - 480, 380, 0.7 * fl, 'mswarm') + glowC(792, wall - 480, 90, 0.5 * fl));
  s.push(`<rect x="40" y="${F - 360}" width="16" height="430" fill="#0D0C09"/>` + line([[48, F - 350], [-300, F - 120]], '#0D0C09', 12) + [0, 1, 2, 3, 4].map((k) => `<rect x="${-30 - k * 60}" y="${F - 330 + k * 40}" width="6" height="${300 - k * 40}" fill="#0D0C09"/>`).join(''));
  // the Rabinowitzes' door, open: their room warm behind (a shelf with brass candlesticks, the samovar on the table)
  const [d0, d1] = PA.door;
  s.push(`<rect x="${d0 - 16}" y="${wall - 540}" width="${d1 - d0 + 32}" height="540" fill="#120D08"/><rect x="${d0}" y="${wall - 524}" width="${d1 - d0}" height="524" fill="#3A2E1C"/>` +
    `<rect x="${d0}" y="${wall - 524}" width="${d1 - d0}" height="524" fill="url(#mswarm)" opacity="0.9"/><rect x="${d0 + 30}" y="${wall - 450}" width="${d1 - d0 - 60}" height="8" fill="#1A120A"/>` + candlestick(d0 + 50, wall - 450, 1.5, "#C9A55A") + candlestick(d0 + 86, wall - 450, 1.5, "#C9A55A") +
    `<rect x="${d0 + 20}" y="${wall - 150}" width="${d1 - d0 - 40}" height="10" fill="#1A120A"/>` + samovar(d1 - 70, wall - 150, 1.5) + glowC((d0 + d1) / 2, wall - 300, 340, 0.8 * fl, 'mswarm'));
  s.push(`<path d="M${d1},${wall - 524} L${d1 + 70},${wall - 540} L${d1 + 70},${wall + 16} L${d1},${wall}" fill="#2B2116"/>`); // the door, swung open
  s.push(`<ellipse cx="${(d0 + d1) / 2}" cy="${wall + 60}" rx="260" ry="50" fill="url(#mswarm)" opacity="${f1(0.8 * fl)}"/>`);
  return {svg: s.join(''), fl};
}
function renderE4Papers(t, o = {}) {
  const {F, H} = PA, hall = e4Hall(t), s = [hall.svg], scr = [];
  const c = cam2(o.cam || camAt([[0, 1.18, 960, 640], [3.5, 1.42, 930, 650], [7.5, 1.38, 960, 650], [12, 1.15, 900, 630]], t)), lod = lodFor(H * c.z), det = lod.det;
  const rimW = {c: '#FFE6C0', a: lod.rimA * 0.8 * hall.fl, dx: 0.008, dy: -0.005}, rimL = {c: '#FFE6C0', a: lod.rimA * 0.7 * hall.fl, dx: -0.008, dy: -0.005};
  const P = {spk: [[1.1, 2.9], [3.25, 4.0]], riv: [[4.6, 5.6], [5.8, 6.7]], nod: 7.0, tip: 7.7, go: [8.6, 11.8]};
  const sp = e4Speak(P.spk, t), rs = e4Speak(P.riv, t), bump = (a, d) => e4Bump(t, a, d);
  // Yankel at his door holding the papers out; turns his head back to Rivke while she translates; turns back and nods
  const yx = 1040, yTurn = t > 4.4 && t < 6.9;
  let yk = nbOpts('nfather', {x: yx, y: F, h: H, d: yTurn ? 1 : -1, det, rim: rimW, an: {...POSES.stand(t, 0.3), tilt: yTurn ? -4 : -10 + (t > 1 ? 4 : 0) - 9 * (bump(P.nod, 0.5) + 0.7 * bump(P.nod + 0.5, 0.45)), expr: t > 7.0 ? 'smile' : 'neutral', blink: (t + 0.4) % 4 < 0.12}});
  yk = e3Stand({...yk, floorY: F}, yx, yx, 0, 'pa.yankel');
  // the papers: a few folded sheets, held in both hands in front of him (in front even while he looks back at her)
  const pp = [yx - 0.17 * H, F - 0.6 * H], ppw = 0.13 * H;
  const ykF = {...yk, d: -1, an: {...yk.an, lean: 0}};
  let holdK = yTurn ? 0 : 1;
  if (!yTurn) { yk = reach(yk, 'f', pp[0], pp[1], 'pa.yankel.paper'); yk = reach(yk, 'b', pp[0] + ppw * 0.55, pp[1] + 8, 'pa.yankel.paper2'); }
  else { yk = reach(yk, 'b', pp[0] + 6, pp[1], 'pa.yankel.paperT'); yk = reach(yk, 'f', pp[0] + ppw * 0.55, pp[1] + 8, 'pa.yankel.paperT2'); } // turned: the hands swap sides
  const papers = `<g transform="rotate(-8, ${f1(pp[0])}, ${f1(pp[1])})"><rect x="${f1(pp[0] - 12)}" y="${f1(pp[1] - 0.12 * H)}" width="${f1(ppw)}" height="${f1(0.15 * H)}" fill="#E9E0C8"/><rect x="${f1(pp[0] - 6)}" y="${f1(pp[1] - 0.12 * H - 6)}" width="${f1(ppw)}" height="${f1(0.15 * H)}" fill="#F4EFE0"/>` +
    [0, 1, 2, 3, 4].map((k) => `<path d="M${f1(pp[0] + 2)},${f1(pp[1] - 0.1 * H + k * 11)} q10,-3 20,0 t20,0" stroke="#5A5040" stroke-width="1.5" fill="none" opacity="0.7"/>`).join('') + `<circle cx="${f1(pp[0] + ppw - 20)}" cy="${f1(pp[1] + 0.012 * H)}" r="7" fill="#8A3A2A" opacity="0.8"/></g>`;
  // Rivke at his shoulder, half in the doorway; she leans in to translate
  const rx = yx + 138;
  let rv = nbOpts('ndaughter', {x: rx, y: F, h: H, scale: 0.86, d: -1, hat: 'kerchief', wear: ['plain', 'apron'], det, rim: rimW, an: {...POSES.stand(t, 0.6), tilt: rs.on ? -6 + 3 * rs.beat : t < 4.3 ? 8 + 2 * Math.sin(t) : 4, lean: 7 * smooth(4.3, 4.6, t) * (1 - smooth(6.8, 7.2, t)), expr: rs.on ? 'neutral' : t > 7.0 ? 'smile' : 'neutral', jaw: rs.jaw, blink: (t + 1.6) % 3.8 < 0.12}});
  rv = e3Stand({...rv, floorY: F}, rx, rx, 0, 'pa.rivke');
  if (rs.on || (t > 4.5 && t < 6.8)) rv = {...rv, an: {...rv.an, fArm: e4Keys([[4.5, 170, 160], [4.8, 128, 84 + 8 * rs.beat], [6.5, 130, 90], [6.8, 170, 160]], t)}};
  // the captain: facing them; his hand to the papers on "his papers"; a nod; the hat; along the hall to the left
  const cx = 815;
  const capTilt = 6 + (sp.on ? 3 * sp.beat : 1.5 * Math.sin(t * 0.8)) - 8 * bump(3.3, 0.5) - 10 * bump(P.tip + 0.2, 0.6);
  const tr = e4Track(e4CaptainOpts({x: 0, y: 0, h: H, det, rim: rimL, an: {tilt: capTilt, expr: 'smile', jaw: sp.jaw, blink: (t + 0.8) % 3.6 < 0.12, glintT: t}}), {x: cx, d: 1, G: F, ph: 0.2, walks: [{t0: P.go[0], t1: P.go[1], to: -260, a: 0.2}]}, t, 'pa.cap');
  let cp = tr.fo;
  if (tr.state === 'start' || tr.state === 'stand') {
    const touch = smooth(2.0, 2.35, t) * (1 - smooth(3.1, 3.5, t)), tp = [pp[0] - 14, pp[1] - 0.06 * H];
    if (touch > 0 && !yTurn) { const g = E3K.hand({...cp, an: {...cp.an, fArm: [170, 160]}}, 'f'); cp = touch >= 1 ? reach(cp, 'f', tp[0], tp[1], 'pa.cap.papers') : e3Move(cp, 'f', lerp(g.x, tp[0], touch), lerp(g.y, tp[1], touch), 'pa.cap.toPapers'); }
    else if (t > P.tip - 0.3 && t < P.tip + 0.95) { const brim = E3K.toWorld(cp, 0.1, 0.99), g = E3K.hand({...cp, an: {...cp.an, fArm: [170, 160]}}, 'f'), k = smooth(P.tip - 0.3, P.tip, t) * (1 - smooth(P.tip + 0.6, P.tip + 0.95, t));
      cp = k >= 1 ? reach(cp, 'f', brim[0], brim[1], 'pa.cap.brim', true) : e3Move(cp, 'f', lerp(g.x, brim[0], k), lerp(g.y, brim[1], k), 'pa.cap.toBrim', true); }
    else cp = {...cp, an: {...cp.an, fArm: e4Keys([[0, 168, 156], [1.2, 150, 120], [1.8, 140, 112], [3.6, 160, 140], [4.0, 168, 156]], t), bArm: [194, 200]}};
    if (t > 8.2 && tr.state === 'stand') cp = {...cp, d: -1}; }
  s.push(fig(rv), fig(yk), papers, e4Captain(cp));
  const world = layerAt(c, 1, s.join(''));
  if (!o.quiet) scr.push(tag(1100, 990, 'COMPOSITE CHARACTERS', smooth(8.4, 8.8, t) * (1 - smooth(11.4, 11.8, t))));
  return frame(e3Defs2(t), `<rect width="1920" height="1080" fill="#060A0A"/>`, world, scr.join(''), t);
}
if (typeof window !== 'undefined') Object.assign(window, {renderE4Papers});
Object.assign(CLIPS, {ep4_papers: {sec: PA.sec, render: (t) => renderE4Papers(t)}});

/* ================= ep4_polls: election day, November 1887, a barbershop used as the polling place (ch 8) ================= */
// After "counting the vote at Elephant Johnnie's" (a saloon as polling place, 1876): before the secret ballot each party printed its
// own ticket and handed it out near the polls. A barbershop front (the big window with the chairs and, today, the ballot box on a
// table inside; the pole; posters of scribbles), a line of men to the door, a policeman. Tommy (coral) at the curb with a stack of
// his party's tickets, handing them out; Michael (coral) comes along, takes one, stops and looks at it, looks at his brother, and
// goes to the end of the line. A rival's man hands out his tickets further down. A man 300 px; grey November light.
const PO = {sec: 15, H: 300, G: 925, GT: 958, GM: 938};
function e4PollsFront(t) {
  const {G} = PO, s = [], WF = G - 30;
  s.push(MAT.brick(-800, -600, 3600, WF + 600, {base: '#1C2A28', seed: 701, soot: 'bottom', bw: 34, bh: 15, vary: 0.25}));
  for (let k = 0; k < 7; k++) { const wx = -500 + k * 420; s.push(`<rect x="${wx - 6}" y="${WF - 640}" width="96" height="170" fill="#0A100F"/><rect x="${wx}" y="${WF - 634}" width="84" height="158" fill="#2F3E3C"/><rect x="${wx + 40}" y="${WF - 634}" width="4" height="158" fill="#0A100F"/><rect x="${wx - 10}" y="${WF - 650}" width="104" height="10" fill="#26302E"/>`); }
  // the shop front: painted boards, the big window (inside: two chairs, a mirror, the ballot box on a table with a clerk), the door
  s.push(`<rect x="260" y="${WF - 380}" width="900" height="380" fill="#16201E"/><rect x="250" y="${WF - 400}" width="920" height="30" fill="#0E1514"/><rect x="290" y="${WF - 362}" width="560" height="44" fill="#26302E"/>` +
    `<path d="M320,${WF - 340} q40,-10 80,0 t80,0 t80,0 t80,0 t80,0 t80,0" stroke="#C9C2AC" stroke-width="5" fill="none" opacity="0.7"/>`);
  const w0 = 300, w1 = 820, wy0 = WF - 300, wy1 = WF - 40;
  s.push(`<rect x="${w0 - 8}" y="${wy0 - 8}" width="${w1 - w0 + 16}" height="${wy1 - wy0 + 16}" fill="#0A100F"/><rect x="${w0}" y="${wy0}" width="${w1 - w0}" height="${wy1 - wy0}" fill="#3A3A30"/>` + glowC((w0 + w1) / 2, wy0 + 100, 320, 0.6, 'mswarm') +
    `<rect x="${w0 + 20}" y="${wy0 + 20}" width="200" height="120" fill="#5A5A4E" opacity="0.5"/>` +
    // two barber chairs, the ballot box on its table, a clerk behind it and a voter
    [400, 560].map((x) => `<path d="M${x - 30},${wy1} l8,-40 l50,0 l8,40 Z M${x - 34},${wy1 - 70} l60,0 l0,-16 l-52,-50 l-12,6 Z" fill="#1A1A16"/>`).join('') +
    `<rect x="${w1 - 210}" y="${wy1 - 90}" width="150" height="10" fill="#1A1A16"/><rect x="${w1 - 195}" y="${wy1 - 80}" width="8" height="80" fill="#1A1A16"/><rect x="${w1 - 82}" y="${wy1 - 80}" width="8" height="80" fill="#1A1A16"/>` +
    `<rect x="${w1 - 170}" y="${wy1 - 140}" width="70" height="50" fill="#2A2018"/><rect x="${w1 - 160}" y="${wy1 - 132}" width="50" height="34" fill="#9FB0AA" opacity="0.5"/><rect x="${w1 - 140}" y="${wy1 - 144}" width="10" height="5" fill="#0D0C09"/>` +
    figure({x: w1 - 40, y: wy1 + 30, h: 170, d: -1, kind: 'man', hat: 'none', coat: 'vest', fill: '#1A1A16', an: {fArm: [120, 90], tilt: -6 + 3 * Math.sin(t * 0.7)}}) +
    figure({x: w1 - 240, y: wy1 + 30, h: 175, d: 1, kind: 'man', hat: 'bowler', coat: 'sack', fill: '#1A1A16', an: {fArm: [110 - 20 * Math.max(0, Math.sin(t * 0.9)), 70], tilt: -4}}) +
    `<rect x="${w0}" y="${wy0}" width="${w1 - w0}" height="${wy1 - wy0}" fill="#DCE8E6" opacity="0.1"/><path d="M${w0 + 40},${wy0} l120,${wy1 - wy0} M${w0 + 90},${wy0} l60,${(wy1 - wy0) * 0.5}" stroke="#E6EEEC" stroke-width="10" opacity="0.08"/>`);
  // the door, open, dark; the pole (cream and slate stripes, turning); posters of scribbles
  s.push(`<rect x="862" y="${WF - 300}" width="130" height="300" fill="#0A0F0E"/><rect x="872" y="${WF - 290}" width="110" height="290" fill="#121816"/>` +
    `<rect x="1018" y="${WF - 250}" width="22" height="150" rx="10" fill="#DAD3BE"/><g clip-path="url(#popole)">` + [...Array(10)].map((_, k) => `<path d="M1010,${f1(WF - 280 + k * 26 + ((t * 30) % 26))} l40,-30 l0,12 l-40,30 Z" fill="#3A4A48"/>`).join('') + `</g><rect x="1014" y="${WF - 262}" width="30" height="14" rx="6" fill="#0E1514"/><rect x="1014" y="${WF - 104}" width="30" height="14" rx="6" fill="#0E1514"/>`);
  for (const [px, py] of [[1180, WF - 300], [1300, WF - 280], [1720, WF - 310]]) s.push(`<rect x="${px}" y="${py}" width="100" height="140" fill="#C9C2AC" opacity="0.75" transform="rotate(${(px % 7) - 3}, ${px}, ${py})"/>` + [0, 1, 2, 3, 4].map((k) => `<path d="M${px + 12},${py + 22 + k * 22} q12,-5 24,0 t24,0 t24,0" stroke="#2A2620" stroke-width="${k ? 2 : 5}" fill="none" opacity="0.8"/>`).join(''));
  // sidewalk, curb, street; fallen leaves
  s.push(`<rect x="-1500" y="${WF}" width="6000" height="70" fill="#5E6A68"/><rect x="-1500" y="${WF - 4}" width="6000" height="6" fill="#0A0F0E" opacity="0.7"/><rect x="-1500" y="${WF + 70}" width="6000" height="10" fill="#2F3836"/><rect x="-1500" y="${WF + 80}" width="6000" height="900" fill="#3F4B4A"/>`);
  const r = rng(709); for (let k = 0; k < 40; k++) s.push(`<ellipse cx="${f1(-400 + r() * 2800)}" cy="${f1(WF + 8 + r() * 120)}" rx="5" ry="2" fill="#5A4A30" opacity="0.6" transform="rotate(${f1(r() * 180)}, 0, 0)"/>`.replace(' transform="rotate(', ' data-r="('));
  return s.join('');
}
// a party ticket: a long slip with a dark heading band and rows of print (unreadable)
const e4Ticket = (x, y, ang = 0, k = 1) => `<g transform="rotate(${f1(ang)}, ${f1(x)}, ${f1(y)})"><rect x="${f1(x - 9 * k)}" y="${f1(y - 44 * k)}" width="${f1(18 * k)}" height="${f1(46 * k)}" fill="#EDE6D2"/><rect x="${f1(x - 9 * k)}" y="${f1(y - 44 * k)}" width="${f1(18 * k)}" height="${f1(7 * k)}" fill="#2A2620"/>` +
  [0, 1, 2, 3, 4].map((i) => `<rect x="${f1(x - 6 * k)}" y="${f1(y - 33 * k + i * 6 * k)}" width="${f1(12 * k)}" height="${f1(1.4 * k)}" fill="#5A5040"/>`).join('') + '</g>';
function renderE4Polls(t, o = {}) {
  const {H, G, GT, GM} = PO, s = [e4PollsFront(t)], scr = [];
  const c = cam2(o.cam || camAt([[0, 1.0, 1050, 600], [4, 1.1, 1300, 640], [7.5, 1.45, 1560, 700], [12, 1.5, 1540, 700], [15, 1.25, 1400, 660]], t)), lod = lodFor(H * c.z), det = lod.det;
  const rim = {c: '#E9EEEA', a: lod.rimA * 0.55, dx: -0.007, dy: -0.006}, ink = '#0D0C09';
  // the line to the door; at 5.5 the first man goes in and the rest step up
  const LX = [1030, 1150, 1270, 1390, 1510], kinds = [['man', 'bowler', 'sack'], ['man', 'cap', 'jacket'], ['man', 'cap', 'sack'], ['man', 'bowler', 'frock'], ['man', 'cap', 'jacket']];
  LX.forEach((x, k) => {
    const [kind, hat, coat] = kinds[k], walks = k === 0 ? [{t0: 5.5, t1: 6.4, to: 920, a: 0.2}] : [{t0: 6.0 + 0.15 * k, t1: 7.0 + 0.15 * k, to: LX[k - 1]}];
    const tr = e4Track({kind, hat, coat, h: H * (0.96 + 0.05 * ((k * 7) % 3)), fill: ink, det: Math.min(det, 0.5), rim, beard: k === 2, an: {tilt: 3 * Math.sin(t * 0.6 + k), blink: (t + k) % 4.2 < 0.12, ...(k % 2 ? {fArm: [160, 120], bArm: [150, 110]} : {})}}, {x, d: -1, G: GM - 3 * k, ph: 0.25 * k, walks}, t, `po.line${k}`);
    s.push(`<g opacity="${f1(clamp01((tr.fo.x - 900) / 40) * 100) / 100}">${fig(tr.fo)}</g>`);
  });
  // the policeman by the door: helmet (a tall rounded hat), arms behind his back
  let pc = e3Stand({x: 1080, y: G - 8, h: H * 1.04, d: 1, kind: 'man', hat: 'bowler', coat: 'frock', fill: ink, det: Math.min(det, 0.4), rim, floorY: G - 8, an: {...POSES.stand(t, 0.1), fArm: [196, 150], bArm: [200, 150], tilt: 2 * Math.sin(t * 0.4)}}, 1100, 1100, 0, 'po.police');
  pc = {...pc, x: 1150};
  // the rival party's man further down, handing his tickets to a passer-by
  let rv = e3Stand({x: 500, y: GT, h: H, d: 1, kind: 'man', hat: 'top', coat: 'frock', fill: ink, det: Math.min(det, 0.5), rim, floorY: GT, an: {...POSES.stand(t, 0.7), fArm: [110 - 25 * Math.max(0, Math.sin(t * 1.4)), 90], bArm: [140, 100], tilt: 4}}, 500, 500, 0, 'po.rival');
  const rvT = holding(rv, 'f', 'po.rival.ticket', (gx, gy) => e4Ticket(gx, gy, -10));
  // Michael comes along the sidewalk from the right; stops at Tommy; takes the ticket (5.3), looks at it, looks at Tommy, goes on
  const MT = {in0: 1.4, in1: 4.8, take: 5.4, read: [5.9, 8.4], look: 8.6, go: [10.6, 13.6]};
  const mBase = cast('michael', {x: 0, y: 0, h: H, det, rim, an: {tilt: t > MT.read[0] && t < MT.read[1] ? -18 : t > MT.look && t < MT.go[0] ? -4 : 0, expr: 'set', blink: (t + 1.4) % 3.7 < 0.12}});
  const mtr = e4Track(mBase, {x: 2350, d: -1, G: GM, ph: 0.5, walks: [{t0: MT.in0, t1: MT.in1, to: 1745, dAfter: -1, a: 0.15}, {t0: MT.go[0], t1: MT.go[1], to: 1510, dAfter: -1}]}, t, 'po.michael');
  let mi = mtr.fo;
  // Tommy at the curb: a stack of tickets in his near hand, one held out in the other; bounces on his toes; talks
  const tsp = e4Speak([[8.7, 9.6], [9.8, 10.4]], t);
  const tx = 1600;
  let tm = cast('brother', {x: tx, y: GT, h: H * 1.12, hat: 'boycap', wear: [], det, rim, an: {...POSES.stand(t, 0.4), tilt: 6 + 4 * tsp.beat, expr: 'smile', jaw: tsp.jaw, blink: (t + 0.3) % 3.3 < 0.12}});
  tm = e3Stand({...tm, floorY: GT, d: t > 3.4 ? 1 : -1}, tx, tx, 0, 'po.tommy');
  const P = [1672, GT - 0.55 * H];
  let ticket = '', stack = '';
  tm = {...tm, an: {...tm.an, bArm: [150, 100]}};
  stack = holding(tm, 'b', 'po.tommy.stack', (gx, gy) => [0, 1, 2, 3].map((k) => e4Ticket(gx + k * 1.5, gy + 4 - k * 1.5, -4)).join(''));
  const offer = smooth(3.9, 4.6, t);
  if (t < MT.take) { const g = E3K.hand({...tm, an: {...tm.an, fArm: [140, 110]}}, 'f'); tm = offer < 1 ? e3Move(tm, 'f', lerp(g.x, P[0], offer), lerp(g.y, P[1], offer), 'po.tommy.offer') : reach(tm, 'f', P[0], P[1], 'po.tommy.hold');
    ticket = holding(tm, 'f', 'po.tommy.ticket', (gx, gy) => e4Ticket(gx + 4, gy + 2, 8)); }
  else { const back = smooth(MT.take, MT.take + 0.5, t), g = E3K.hand({...tm, an: {...tm.an, fArm: [150, 120]}}, 'f'); tm = back < 1 ? e3Move(tm, 'f', lerp(P[0], g.x, back), lerp(P[1], g.y, back), 'po.tommy.back') : {...tm, an: {...tm.an, fArm: tsp.on ? [110 - 20 * tsp.beat, 70] : [150, 120]}}; }
  // Michael's hands: he takes it (both hands), lifts it to read, lowers it; carries it to the line
  if (mtr.state !== 'walk' && t > 4.9 && t < MT.go[0]) {
    const take = smooth(4.9, MT.take, t), g = E3K.hand({...mi, an: {...mi.an, fArm: [176, 178]}}, 'f');
    if (t < MT.take) mi = take < 1 ? e3Move(mi, 'f', lerp(g.x, P[0] + 6, take), lerp(g.y, P[1] - 14, take), 'po.michael.toTicket') : reach(mi, 'f', P[0] + 6, P[1] - 14, 'po.michael.take');
    else { const up = smooth(MT.take + 0.1, MT.read[0], t) * (1 - smooth(MT.read[1], MT.read[1] + 0.5, t)), R = [mi.x - 0.2 * H, mi.y - 0.66 * H], L = [mi.x - 0.15 * H, mi.y - 0.5 * H], at0 = [P[0] + 6, P[1] - 14];
      const T2 = t < MT.read[0] ? [lerp(at0[0], R[0], up), lerp(at0[1], R[1], up)] : [lerp(L[0], R[0], up), lerp(L[1], R[1], up)];
      mi = reach(mi, 'f', T2[0], T2[1], 'po.michael.ticket'); if (up > 0.6) mi = reach(mi, 'b', T2[0] + 16, T2[1] + 4, 'po.michael.ticket2'); }
    ticket += holding(mi, 'f', 'po.michael.ticketH', (gx, gy) => t < MT.take ? '' : e4Ticket(gx - 4, gy + 6, -70 * smooth(MT.take, MT.read[0], t) * (1 - smooth(MT.read[1], MT.read[1] + 0.5, t)) - 12, 1 + 0.25 * smooth(MT.take, MT.read[0], t)));
  } else if (t >= MT.go[0]) { mi = {...mi, an: {...mi.an, fArm: mtr.state === 'walk' ? [160, 140] : [160, 140]}}; ticket += holding(mi, 'f', 'po.michael.ticketH', (gx, gy) => e4Ticket(gx, gy + 4, -16)); }
  s.push(fig(pc), fig(rv) + rvT, fig(mi), fig(tm), stack, ticket);
  s.splice(1, 0, `<rect x="-1500" y="-800" width="6000" height="${PO.G - 30 + 800}" fill="#C9D6D2" opacity="0.12"/>`);
  const world = layerAt(c, 1, s.join(''));
  const sky = `<rect width="1920" height="1080" fill="#5F7472"/>`;
  if (!o.quiet) scr.push(tag(130, 120, 'ELECTION DAY · NOVEMBER 1887', smooth(0.3, 0.7, t) * (1 - smooth(3.6, 4.0, t))));
  return frame(e3Defs(t, `<clipPath id="popole"><rect x="1018" y="${PO.G - 280}" width="22" height="150" rx="10"/></clipPath>`), sky, world, scr.join(''), t);
}
if (typeof window !== 'undefined') Object.assign(window, {renderE4Polls});
Object.assign(CLIPS, {ep4_polls: {sec: PO.sec, render: (t) => renderE4Polls(t)}});

/* ================= ep4_vigo: Vigo, Spain, 1876 (ch 6), a gentle comedy beat ================= */
// A sunny quay. A large man in a hat (Tweed: a real person, so no face: a flat silhouette, profile, no features drawn) comes down the
// gangplank of a steamer. Two officials of the Guardia Civil (tricorn hats, capes) hold up a newspaper page between them, look from
// it to him, back to it, to him; lower it and step in front of him. One holds the page up beside him: the camera pushes in and holds
// still (8.2 to 11.2 s) so the edit can lay the real Harper's page (Oct 7, 1876, "The Capture of Tweed") into the page's frame.
// The page in the clip is a clean cream sheet with a thin border, proportioned like that scan (2710 x 4000). A man 300 px.
const VG = {sec: 13, H: 300, G: 930, page: {w: 150, h: 221}, hold: [8.2, 11.2], cam: [2.35, 1255, 690]};
VG.holdP = (x1) => [x1 + 0.2 * VG.H + VG.page.w / 2, VG.G - 0.66 * VG.H];
// points given in a figure's head frame (local units, the head's tilt applied), to world: hats over a bare head
function e4HeadPts(fo, a) { const tl = (fo.an && fo.an.tilt || 0) * Math.PI / 180;
  return a.map(([lx, ly]) => { const dx = lx, dy = ly - 0.86; return E3K.toWorld(fo, dx * Math.cos(tl) - dy * Math.sin(tl), 0.86 + dx * Math.sin(tl) + dy * Math.cos(tl)); }); }
const e4Tricorn = (fo, col) => poly(e4HeadPts(fo, [[-0.085, 0.985], [-0.11, 1.07], [-0.06, 1.05], [-0.03, 1.035], [0.05, 1.035], [0.09, 1.0], [0.095, 0.985]]), col) + poly(e4HeadPts(fo, [[-0.06, 1.0], [-0.05, 1.04], [0.04, 1.04], [0.06, 1.0]]), col);
const e4Cape = (fo, col) => poly([[0.06, 0.84], [-0.09, 0.86], [-0.15, 0.62], [-0.12, 0.55], [0.0, 0.58], [0.09, 0.62]].map(([x, y]) => E3K.toWorld(fo, x, y)), col);
function renderE4Vigo(t, o = {}) {
  const {H, G, page} = VG, s = [], scr = [], SH = [];
  const c = cam2(o.cam || camAt([[0, 1.0, 960, 560], [3.0, 1.15, 1080, 600], [5.6, 1.4, 1180, 650], [7.2, 1.45, 1200, 650], [8.2, VG.cam[0], VG.cam[1], VG.cam[2]], [11.2, VG.cam[0], VG.cam[1], VG.cam[2]], [12.2, 1.5, 1180, 650], [13, 1.42, 1160, 640]], t));
  const lod = lodFor(H * c.z), sun = {c: '#FFE2A8', a: lod.rimA * 0.85, dx: -0.01, dy: -0.004}, ink = '#0D0C09';
  // the harbour: hills across the ria with white houses, the sea with sparkle, the stone quay, bollards, crates, a bale
  s.push(`<path d="M-800,${G - 330} Q-300,${G - 460} 200,${G - 400} T1100,${G - 430} T2100,${G - 380} T3200,${G - 420} L3200,${G - 300} L-800,${G - 300} Z" fill="#7E9A86"/>`);
  const rh = rng(801); for (let k = 0; k < 60; k++) { const x = -600 + rh() * 3600, y = G - 330 - rh() * 70; s.push(`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(8 + rh() * 10)}" height="${f1(6 + rh() * 6)}" fill="#F2EDE0" opacity="0.8"/>`); }
  s.push(MAT.water(-1000, G - 300, 5000, 260, t, {top: '#3E7A86', bottom: '#2B5660', seed: 803, glint: '#FFFFFF', n: 90}));
  // the steamer at the left: black hull, a red-brown boot topping muted to slate, the funnel, a mast; the gangplank to the quay
  s.push(`<path d="M-700,${G - 330} L560,${G - 330} Q620,${G - 300} 600,${G - 40} L-700,${G - 40} Z" fill="#141A1A"/><rect x="-700" y="${G - 330}" width="1290" height="16" fill="#E6E0CE" opacity="0.8"/>` +
    [-500, -380, -260, -140, -20, 100, 220, 340].map((x) => `<circle cx="${x}" cy="${G - 260}" r="11" fill="#2B3434"/><circle cx="${x}" cy="${G - 260}" r="7" fill="#9DB4B4" opacity="0.6"/>`).join('') +
    `<rect x="-300" y="${G - 620}" width="70" height="290" fill="#1E2424"/><rect x="-300" y="${G - 620}" width="70" height="24" fill="#C9C2AC"/><rect x="200" y="${G - 900}" width="10" height="570" fill="#141A1A"/>` + line([[205, G - 880], [560, G - 340]], '#141A1A', 2) + line([[205, G - 880], [-150, G - 340]], '#141A1A', 2) +
    MAT.smoke(-265, G - 640, t, {col: '5F857F', k: 1.2, n: 6, rise: 260, drift: 200, speed: 7, seed: 805}) + `<rect x="-700" y="${G - 346}" width="1260" height="16" fill="#141A1A"/>` + line([[-700, G - 360], [560, G - 360]], '#141A1A', 3));
  const gp0 = [520, G - 340], gp1 = [860, G - 6];
  s.push(`<path d="M${gp0[0]},${gp0[1]} L${gp1[0]},${gp1[1]} L${gp1[0]},${gp1[1] + 8} L${gp0[0]},${gp0[1] + 10} Z" fill="#5A4A34"/>` + line([[gp0[0], gp0[1] - 60], [gp1[0], gp1[1] - 70]], '#2A2018', 3) + [0, 0.25, 0.5, 0.75, 1].map((u) => line([[lerp(gp0[0], gp1[0], u), lerp(gp0[1], gp1[1], u)], [lerp(gp0[0], gp1[0], u), lerp(gp0[1], gp1[1], u) - 64]], '#2A2018', 2.5)).join(''));
  s.push(`<rect x="-1000" y="${G}" width="5000" height="400" fill="#B9A98A"/>` + MAT.floor(-1000, 4000, G, G + 150, {kind: 'flag', base: '#B3A383', seed: 807, size: 70}) + `<rect x="-1000" y="${G - 4}" width="5000" height="8" fill="#6E6450"/>`);
  for (const bx of [700, 1800, 2400]) s.push(MAT.shadow(bx, G + 34, 30, 0.35) + `<path d="M${bx - 18},${G + 34} l4,-46 q14,-10 28,0 l4,46 Z" fill="#2A2420"/>`);
  s.push(`<rect x="1620" y="${G - 70}" width="110" height="90" fill="#6A5236"/><rect x="1690" y="${G - 140}" width="90" height="70" fill="#5A4430"/><path d="M1550,${G + 20} q-10,-60 40,-64 q50,4 40,64 Z" fill="#8A7A5A"/>`);
  // ---- Tweed: down the gangplank's foot and along the quay, slowing; stopped by the officials ----
  const TW = {w0: 0.6, w1: 6.0, x0: 880, x1: 1110};
  const twBase = {kind: 'man', hat: 'bowler', coat: 'frock', fill: ink, det: 0, rim: sun, h: H * 1.04, an: {tilt: t > 6 ? 6 * smooth(6, 6.5, t) : 2, blink: false}};
  const twT = e4Track(twBase, {x: TW.x0, d: 1, G, walks: [{t0: TW.w0, t1: TW.w1, to: TW.x1, a: 0.3}]}, t, 'vg.tweed');
  let tw = twT.fo;
  const belly = (fo) => poly([[0.06, 0.7], [0.16, 0.62], [0.17, 0.5], [0.12, 0.4], [0.02, 0.38], [-0.12, 0.42], [-0.15, 0.6], [-0.1, 0.72]].map(([x, y]) => E3K.toWorld(fo, x, y)), fo.fill);
  // a carpet bag in his far hand
  tw = {...tw, an: {...tw.an, bArm: twT.state === 'walk' ? tw.an.bArm : [188, 192]}};
  const bag = holding(tw, 'b', 'vg.tweed.bag', (gx, gy) => `<path d="M${f1(gx - 26)},${f1(gy + 16)} q26,-26 52,0 l6,46 l-64,0 Z" fill="#3A2A20"/><path d="M${f1(gx - 10)},${f1(gy + 6)} q10,-12 20,0" stroke="#3A2A20" stroke-width="4" fill="none"/>`);
  // ---- the officials: A holds the page up at arm's length and looks from it to him and back, B peering over A's shoulder; they
  // lower it and walk into his path; A holds it up beside Tweed's head (the composite hold); B points from the page to the man ----
  const OF = {raise: [2.2, 2.8], look: [[3.2, -10], [3.9, 6], [4.4, -10], [4.75, 8], [5.0, 8]], lower: [5.1, 5.5], walk: [5.3, 6.5], hold: [7.0, 7.8], point: [11.3, 12.6]};
  const ax0 = 1440, bx0 = 1560, ax1 = 1535, bx1 = 1640;
  const lookA = e4Val([[0, 0], ...OF.look], t), lookB = e4Val([[0, 0], ...OF.look.map(([tt, v]) => [tt + 0.15, v])], t);
  const oBase = (k, tilt, expr) => ({kind: 'man', hat: 'none', coat: 'frock', fill: ink, h: H * (1 + 0.03 * k), det: Math.min(lod.det, 0.65), rim: sun, an: {tilt, expr, blink: (t + k * 1.3) % 3.9 < 0.12}});
  const trA = e4Track(oBase(0, lookA, t > 4.6 && t < 7 ? 'awe' : 'neutral'), {x: ax0 + 160, d: -1, G, ph: 0.3, walks: [{t0: OF.walk[0], t1: OF.walk[1], to: ax1 - 140, dAfter: -1}]}, t, 'vg.offA');
  const trB = e4Track(oBase(1, lookB + (t > 3 && t < 5.1 ? 4 : 0), t > 4.8 && t < 7 ? 'awe' : 'neutral'), {x: bx0 + 160, d: -1, G: G - 6, ph: 0.6, walks: [{t0: OF.walk[0] + 0.15, t1: OF.walk[1] + 0.2, to: bx1 - 140, dAfter: -1}]}, t, 'vg.offB');
  let oa = trA.fo, ob = trB.fo;
  if (trB.state !== 'walk' && t > 3.0 && t < 5.1) ob = {...ob, an: {...ob.an, lean: 6 * smooth(3.0, 3.4, t) * (1 - smooth(4.8, 5.1, t))}};
  // the page: up at A's arm's length (compare), lowered while they walk (in his near hand), then held up beside Tweed's head
  const up = smooth(OF.raise[0], OF.raise[1], t) * (1 - smooth(OF.lower[0], OF.lower[1], t)), hold = smooth(OF.hold[0], OF.hold[1], t);
  const full = t >= OF.hold[0], pw = page.w * (full ? lerp(0.8, 1, hold) : 0.8), ph = page.h * (full ? lerp(0.8, 1, hold) : 0.8);
  const shA = E3K.shoulder(oa, 'f'), cmpP = [shA[0] - 0.25 * H - pw / 2 + 10, shA[1] - 0.02 * H], lowP = [oa.x - 0.14 * H - pw / 2 + 12, oa.y - 0.56 * H];
  const holdP = VG.holdP(TW.x1);
  let pc;
  if (t < OF.hold[0]) { const k = up; pc = [lerp(lowP[0], cmpP[0], k), lerp(lowP[1], cmpP[1], k)]; }
  else pc = [lerp(lowP[0], holdP[0], hold), lerp(lowP[1], holdP[1], hold)];
  // A's hands on the page's right edge (the near edge to him): both while it is up, the near hand while lowered
  const edge = (dy) => [pc[0] + pw / 2 - 3, pc[1] + dy];
  oa = reach(oa, 'f', ...edge(ph * 0.1), 'vg.offA.page'); if (up > 0.5 || hold > 0.5) oa = reach(oa, 'b', ...edge(-ph * 0.22), 'vg.offA.page2');
  // B points from the page to the man at the end
  if (t > OF.point[0]) { const k = smooth(OF.point[0], OF.point[0] + 0.4, t) * (1 - smooth(OF.point[1] - 0.3, OF.point[1], t)), g = E3K.hand(ob, 'f'), tgt = k < 0.5 ? [pc[0] + 10, pc[1] - 30] : [TW.x1 + 0.08 * H, G - 0.8 * H];
    ob = e3Move(ob, 'f', lerp(g.x, tgt[0], Math.min(1, k * 1.4)), lerp(g.y, tgt[1], Math.min(1, k * 1.4)), 'vg.offB.point'); }
  const pageSvg = `<rect x="${f1(pc[0] - pw / 2 + 5)}" y="${f1(pc[1] - ph / 2 + 6)}" width="${f1(pw)}" height="${f1(ph)}" fill="#000" opacity="0.2"/><rect x="${f1(pc[0] - pw / 2)}" y="${f1(pc[1] - ph / 2)}" width="${f1(pw)}" height="${f1(ph)}" fill="#F1EADA"/>` +
    `<rect x="${f1(pc[0] - pw / 2 + 5)}" y="${f1(pc[1] - ph / 2 + 5)}" width="${f1(pw - 10)}" height="${f1(ph - 10)}" fill="none" stroke="#2A2620" stroke-width="1.2" opacity="0.6"/>`;
  // long sun shadows on the quay (sun high on the right)
  for (const fo of [tw, oa, ob]) SH.push(e3Black(fo));
  s.push(e3LongShadow(SH.join(''), G, -0.7, 0.18, 0.3));
  s.push(fig(tw) + belly(tw) + bag);
  s.push(fig(ob) + e4Cape(ob, ink) + e4Tricorn(ob, ink), fig(oa) + e4Cape(oa, ink) + e4Tricorn(oa, ink), pageSvg);
  const world = layerAt(c, 1, s.join(''));
  const sky = `<rect width="1920" height="1080" fill="url(#vgsky)"/><circle cx="${f1(1700 - (c.ux - 960) * 0.1)}" cy="120" r="260" fill="url(#vgsun)"/>`;
  if (!o.quiet) scr.push(tag(130, 120, 'VIGO, SPAIN · 1876', smooth(0.3, 0.7, t) * (1 - smooth(3.4, 3.8, t))));
  const defs = e3Defs(t, grad('vgsky', [['0', '#7FB2C2'], ['0.7', '#CFE3E0'], ['1', '#F4EDD8']]) + `<radialGradient id="vgsun"><stop offset="0" stop-color="#FFF6DA" stop-opacity="0.9"/><stop offset="1" stop-color="#FFF6DA" stop-opacity="0"/></radialGradient>`);
  return frame(defs, sky, world, scr.join(''), t);
}
// the page's rectangle on screen during the hold (for the composite): world centre and size through the hold camera
function e4VigoPageRect() { const c = cam2({z: VG.cam[0], ux: VG.cam[1], uy: VG.cam[2]}), pc = VG.holdP(1110), w = VG.page.w * c.z, h = VG.page.h * c.z;
  return {x: c.sx(pc[0]) - w / 2, y: c.sy(pc[1]) - h / 2, w, h}; }
if (typeof window !== 'undefined') Object.assign(window, {renderE4Vigo, e4VigoPageRect});
Object.assign(CLIPS, {ep4_vigo: {sec: VG.sec, render: (t) => renderE4Vigo(t)}});

/* ================= ep4_bootblack: Plunkitt on his "rostrum", the courthouse bootblack stand, 1905 (ch 7) ================= */
// The rotunda of Tweed's old county courthouse (simplified from the HABS survey photograph: tall arches, iron galleries, light from
// the skylight). A shoeshine stand; George Washington Plunkitt (a real person: seen from behind only, a back view drawn for this
// shot, no face) sits high on it in his top hat, talking, his right hand making his points; a bootblack works on the shoe on the
// footrest; a younger man with a notebook (the reporter, Riordon) stands by and writes. The left half of the frame is kept clear
// (the arches and the light) for the handwritten quotes the edit adds. A man 360 px.
const BB = {sec: 15, H: 360, F: 990, wall: 905, plat: 880, step: 935, cx: 1180, speak: [[0.8, 3.6], [4.2, 7.4], [8.0, 11.2], [11.8, 14.2]]};
function e4Rotunda(t) {
  const {F, wall} = BB, s = [];
  s.push(`<rect x="-1500" y="-1200" width="5000" height="3600" fill="#141A18"/><rect x="-800" y="-400" width="3600" height="${wall + 400}" fill="#3C4642"/>`);
  for (let k = 0; k < 4; k++) { const ax = -140 + k * 520, aw = 400, top = 150;
    s.push(`<path d="M${ax},${wall} L${ax},${top + aw / 2} A${aw / 2},${aw / 2} 0 0 1 ${ax + aw},${top + aw / 2} L${ax + aw},${wall} Z" fill="#59665F"/>` +
      `<path d="M${ax + 30},${wall} L${ax + 30},${top + aw / 2} A${aw / 2 - 30},${aw / 2 - 30} 0 0 1 ${ax + aw - 30},${top + aw / 2} L${ax + aw - 30},${wall} Z" fill="#6F7C74"/>` +
      `<path d="M${ax},${top + aw / 2} A${aw / 2},${aw / 2} 0 0 1 ${ax + aw},${top + aw / 2}" stroke="#2C3431" stroke-width="10" fill="none"/>`);
    // the galleries seen through the arch: a rail with balusters, a second level higher
    for (const gy of [480, 250]) { if (gy < top + 40) continue; s.push(`<rect x="${ax + 30}" y="${gy}" width="${aw - 60}" height="10" fill="#1C2321"/><rect x="${ax + 30}" y="${gy + 60}" width="${aw - 60}" height="8" fill="#1C2321"/>` + [...Array(Math.floor((aw - 60) / 16))].map((_, i) => `<rect x="${ax + 34 + i * 16}" y="${gy + 10}" width="3" height="50" fill="#1C2321"/>`).join('')); }
    s.push(`<rect x="${ax - 30}" y="0" width="60" height="${wall}" fill="#2E3834"/><rect x="${ax - 40}" y="${wall - 60}" width="80" height="60" fill="#262E2B"/><rect x="${ax - 40}" y="140" width="80" height="24" fill="#262E2B"/>`); }
  // a few small figures along the lower gallery, walking slowly
  for (let k = 0; k < 3; k++) { const x = ((200 + k * 640 + t * (k % 2 ? -26 : 30)) % 2200 + 2200) % 2200 - 150, h = 92;
    s.push(figure({x, y: 540, h, d: k % 2 ? -1 : 1, kind: k === 1 ? 'woman' : 'man', hat: k === 1 ? 'lady' : 'bowler', coat: 'frock', fill: '#232B28', an: walkAn(walkPhase(Math.abs(t * 30), h))})); }
  // light from the skylight: soft beams, a pool on the floor
  s.push(`<path d="M300,-200 L760,-200 L1100,${F} L420,${F} Z" fill="url(#bbbeam)" opacity="0.5"/><path d="M1000,-200 L1260,-200 L1560,${F} L1150,${F} Z" fill="url(#bbbeam)" opacity="0.3"/>`);
  s.push(`<rect x="-800" y="${wall - 14}" width="3600" height="14" fill="#262E2B"/>` + MAT.floor(-800, 2800, wall, F + 80, {kind: 'flag', base: '#7A7A6A', seed: 901, size: 90}));
  s.push(`<ellipse cx="760" cy="${F + 10}" rx="420" ry="50" fill="#FFF3D6" opacity="0.12"/>`);
  return s.join('');
}
// a man seated with his back to us (top hat, coat, head, the far arm resting, the near (right) arm free to gesture); everything in
// screen space from the seat's centre (x, seatY) and a height h. turn 0..1 brings his head round toward the right (an ear shows)
function e4BackSitter(x, seatY, h, arm, turn, nod, col = '#0D0C09') {
  const s = [], sy = seatY - 0.36 * h, hx = x + 10 * turn, hy = sy - 0.13 * h + nod;
  s.push(`<path d="M${x - 0.13 * h},${seatY + 6} L${x - 0.15 * h},${sy + 0.05 * h} Q${x - 0.14 * h},${sy - 0.01 * h} ${x - 0.07 * h},${sy - 0.03 * h} L${x + 0.07 * h},${sy - 0.03 * h} Q${x + 0.14 * h},${sy - 0.01 * h} ${x + 0.15 * h},${sy + 0.05 * h} L${x + 0.13 * h},${seatY + 6} Z" fill="${col}"/>`);
  s.push(`<rect x="${x - 0.035 * h}" y="${sy - 0.07 * h}" width="${0.07 * h}" height="${0.06 * h}" fill="${col}"/><path d="M${x - 0.05 * h},${sy - 0.035 * h} Q${x},${sy - 0.055 * h} ${x + 0.05 * h},${sy - 0.035 * h}" stroke="#4A4A42" stroke-width="${0.012 * h}" fill="none"/>`); // collar
  s.push(`<ellipse cx="${hx}" cy="${hy}" rx="${0.058 * h}" ry="${0.07 * h}" fill="${col}"/><path d="M${hx - 0.05 * h},${hy + 0.02 * h} Q${hx},${hy + 0.075 * h} ${hx + 0.05 * h},${hy + 0.02 * h}" stroke="#3A3A34" stroke-width="${0.01 * h}" fill="none" opacity="0.7"/>`);
  if (turn > 0.2) s.push(`<ellipse cx="${hx + 0.056 * h}" cy="${hy + 0.004 * h}" rx="${0.012 * h}" ry="${0.02 * h}" fill="${col}"/>`);
  s.push(`<ellipse cx="${hx}" cy="${hy - 0.06 * h}" rx="${0.09 * h}" ry="${0.015 * h}" fill="${col}"/><path d="M${hx - 0.055 * h},${hy - 0.06 * h} L${hx - 0.05 * h},${hy - 0.21 * h} L${hx + 0.05 * h},${hy - 0.21 * h} L${hx + 0.055 * h},${hy - 0.06 * h} Z" fill="${col}"/>` +
    `<rect x="${hx - 0.054 * h}" y="${hy - 0.09 * h}" width="${0.108 * h}" height="${0.016 * h}" fill="#2A2A26"/><path d="M${hx - 0.045 * h},${hy - 0.2 * h} L${hx - 0.04 * h},${hy - 0.08 * h}" stroke="#4A4A42" stroke-width="2" opacity="0.5"/>`);
  // the near arm: shoulder, upper arm, forearm, hand (angles in degrees from straight down, positive out to his right)
  const S = [x + 0.13 * h, sy + 0.03 * h], r = (d) => d * Math.PI / 180, E = [S[0] + Math.sin(r(arm[0])) * 0.19 * h, S[1] + Math.cos(r(arm[0])) * 0.19 * h], Hn = [E[0] + Math.sin(r(arm[1])) * 0.17 * h, E[1] + Math.cos(r(arm[1])) * 0.17 * h];
  s.push(line([S, E], col, 0.06 * h) + line([E, Hn], col, 0.048 * h) + `<ellipse cx="${f1(Hn[0])}" cy="${f1(Hn[1])}" rx="${f1(0.03 * h)}" ry="${f1(0.024 * h)}" fill="${col}"/>`);
  return {svg: s.join(''), farHand: [x - 0.19 * h, seatY - 0.06 * h], hand: Hn};
}
function renderE4Bootblack(t, o = {}) {
  const {H, F, plat, step, cx} = BB, s = [e4Rotunda(t)], scr = [];
  const c = cam2(o.cam || camAt([[0, 1.05, 1000, 600], [5, 1.15, 1060, 620], [10, 1.22, 1100, 630], [15, 1.12, 1040, 610]], t)), lod = lodFor(H * c.z);
  const sp = e4Speak(BB.speak, t);
  // the stand: two steps up to a platform, the high chair (we see its back), the footrests, a box of brushes
  const seatY = plat - 0.42 * H;
  s.push(MAT.shadow(cx + 40, F + 4, 330, 0.4) + `<rect x="${cx - 260}" y="${plat}" width="560" height="${F - plat}" fill="#2A221A"/><rect x="${cx - 300}" y="${step}" width="640" height="${F - step}" fill="#3A2E22"/><rect x="${cx - 260}" y="${plat}" width="560" height="5" fill="#FFE6C0" opacity="0.18"/><rect x="${cx - 300}" y="${step}" width="640" height="4" fill="#FFE6C0" opacity="0.15"/>`);
  s.push(`<rect x="${cx + 120}" y="${plat - 120}" width="12" height="120" fill="#120D08"/><path d="M${cx + 100},${plat - 124} l60,-6 l0,10 l-60,6 Z" fill="#6A5A3A"/>`); // the footrest (brass-topped, dull)
  // his near shoe on the footrest, his trouser leg running out from under the chair
  const shoe = [cx + 128, plat - 132];
  s.push(line([[cx + 40, seatY + 20], [cx + 112, plat - 150]], '#0D0C09', 0.07 * H) + `<path d="M${shoe[0] - 26},${shoe[1] + 4} l10,-26 l20,0 q30,6 40,20 l0,6 Z" fill="#0D0C09"/><path d="M${shoe[0] + 6},${shoe[1] - 16} q18,4 26,14" stroke="#F4EFE6" stroke-width="2" opacity="${f1(0.3 + 0.3 * Math.max(0, Math.sin(t * 6)))}" fill="none"/>`);
  // Plunkitt, from behind: the right hand makes his points while he talks; head turns toward the reporter at the ends of points
  const beat = sp.on ? sp.beat : 0, gK = [[0, 20, 30], [1.0, 60, 110], [2.0, 70, 130], [3.6, 30, 40], [4.4, 80, 150], [5.6, 95, 170], [7.4, 40, 60], [8.2, 70, 120], [9.4, 100, 160], [11.2, 30, 40], [12.0, 85, 150], [14.2, 40, 60], [15, 25, 35]];
  const arm = e4Keys(gK, t); arm[1] += 10 * beat;
  const turn = e4Val([[0, 0.2], [3.4, 0.2], [3.9, 0.8], [4.6, 0.4], [7.2, 0.4], [7.7, 0.9], [8.4, 0.3], [11.0, 0.3], [11.5, 0.9], [12.2, 0.4], [15, 0.6]], t);
  const pk = e4BackSitter(cx, seatY, H * 1.12, arm, turn, -3 * beat);
  // the chair: arms and the back between us and him (his shoulders, head and hat show above it)
  const chair = `<rect x="${cx - 0.2 * H}" y="${seatY - 0.11 * H}" width="${0.4 * H}" height="${0.11 * H + 10}" rx="10" fill="#3A2416"/><rect x="${cx - 0.2 * H}" y="${seatY - 0.11 * H}" width="${0.4 * H}" height="6" rx="3" fill="#FFE6C0" opacity="0.2"/>` +
    `<rect x="${cx - 0.24 * H}" y="${seatY - 0.08 * H}" width="${0.06 * H}" height="${0.08 * H + 10}" fill="#2A1A10"/><rect x="${cx + 0.18 * H}" y="${seatY - 0.08 * H}" width="${0.06 * H}" height="${0.08 * H + 10}" fill="#2A1A10"/>` +
    `<rect x="${cx - 0.2 * H}" y="${seatY + 10}" width="${0.4 * H}" height="${plat - seatY - 10}" fill="#24160C"/><rect x="${cx - 0.18 * H}" y="${seatY + 10}" width="10" height="${plat - seatY - 10}" fill="#120D08"/><rect x="${cx + 0.18 * H - 10}" y="${seatY + 10}" width="10" height="${plat - seatY - 10}" fill="#120D08"/>`;
  // his far hand on the far armrest (drawn at the rest: logged as an exact contact)
  const fh = [cx - 0.215 * H, seatY - 0.085 * H]; E3K.log('hand', 'bb.plunkitt.armrest', fh, fh);
  const farHand = `<ellipse cx="${f1(fh[0])}" cy="${f1(fh[1])}" rx="${f1(0.03 * H)}" ry="${f1(0.022 * H)}" fill="#0D0C09"/>`;
  // the bootblack (ink), a boy on a low box on the platform by the footrest, the brush in his near hand on the toe, back and forth
  const bx = cx + 215, bh = H * 0.62, brush = Math.sin(t * 9.5) * 14, boxTop = plat - 46;
  let bk = sitOn({x: bx, y: 0, h: bh, d: -1, kind: 'boy', hat: 'boycap', fill: '#0D0C09', det: Math.min(lod.det, 0.5), rim: {c: '#FFE6C0', a: lod.rimA * 0.5, dx: 0.008, dy: -0.005}, an: {tilt: -10 + 2 * Math.sin(t * 1.3), blink: (t + 0.7) % 4 < 0.12}}, boxTop, plat, 0.14, 'bb.boot.seat');
  bk = {...bk, an: {...bk.an, lean: 10}};
  const toe = [shoe[0] + 28 + brush, shoe[1] - 10 + Math.abs(brush) * 0.1];
  bk = reach(bk, 'f', toe[0], toe[1], 'bb.boot.brush'); bk = reach(bk, 'b', shoe[0] + 2, shoe[1] - 4, 'bb.boot.heel');
  const brushSvg = `<rect x="${bx - 40}" y="${boxTop}" width="70" height="${plat - boxTop}" fill="#4A3A26"/><rect x="${bx - 40}" y="${boxTop}" width="70" height="4" fill="#FFE6C0" opacity="0.2"/>` + holding(bk, 'f', 'bb.boot.brushH', (gx, gy) => `<rect x="${f1(gx - 14)}" y="${f1(gy - 5)}" width="28" height="10" rx="3" fill="#5A4428"/><rect x="${f1(gx - 13)}" y="${f1(gy + 4)}" width="26" height="5" fill="#2A2018"/>`);
  // the reporter: notebook in his far hand, pencil in the near hand on the page; writes while Plunkitt talks, looks up between
  const rx = cx + 470, writing = sp.on && (t % 4) > 1.2, rTilt = writing ? -22 : 14 + 2 * Math.sin(t * 0.8);
  let rp = {x: rx, y: F, h: H, d: -1, kind: 'man', hat: 'bowler', coat: 'sack', fill: '#0D0C09', det: lod.det, rim: {c: '#FFE6C0', a: lod.rimA * 0.6, dx: 0.008, dy: -0.005}, an: {...POSES.stand(t, 0.4), tilt: rTilt - 7 * e4Bump(t, 3.7, 0.5) - 7 * e4Bump(t, 11.4, 0.5), expr: 'neutral', blink: (t + 1.9) % 3.8 < 0.12}};
  rp = e3Stand({...rp, floorY: F}, rx, rx, 0, 'bb.reporter');
  const nb = [rx - 0.17 * H, F - 0.66 * H];
  rp = reach(rp, 'b', nb[0] + 22, nb[1] + 10, 'bb.reporter.book');
  const nib = writing ? [nb[0] - 14 + ((t * 40) % 30), nb[1] - 4 + 2 * Math.sin(t * 25)] : [nb[0] - 4, nb[1] + 18];
  rp = reach(rp, 'f', nib[0] + 6, nib[1] + 14, writing ? 'bb.reporter.write' : 'bb.reporter.rest');
  const book = `<g transform="rotate(-24, ${f1(nb[0])}, ${f1(nb[1])})"><rect x="${f1(nb[0] - 26)}" y="${f1(nb[1] - 8)}" width="52" height="16" fill="#EDE6D2"/><rect x="${f1(nb[0] - 26)}" y="${f1(nb[1] + 6)}" width="52" height="4" fill="#3A2E22"/></g>`;
  const pencil = holding(rp, 'f', 'bb.reporter.pencil', (gx, gy) => line([[gx, gy], [gx - 6, gy - 26]], '#3A2E22', 3));
  s.push(pk.svg, chair, farHand, fig(bk) + brushSvg, fig(rp) + book + pencil);
  const world = layerAt(c, 1, s.join(''));
  if (!o.quiet) scr.push(tag(130, 120, 'NEW YORK COUNTY COURTHOUSE · 1905', smooth(0.3, 0.7, t) * (1 - smooth(3.6, 4.0, t))));
  const defs = e3Defs(t, `<linearGradient id="bbbeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3D6" stop-opacity="0.5"/><stop offset="1" stop-color="#FFF3D6" stop-opacity="0"/></linearGradient>`);
  return frame(defs, `<rect width="1920" height="1080" fill="#141A18"/>`, world, scr.join(''), t);
}
if (typeof window !== 'undefined') Object.assign(window, {renderE4Bootblack});
Object.assign(CLIPS, {ep4_bootblack: {sec: BB.sec, render: (t) => renderE4Bootblack(t)}});
