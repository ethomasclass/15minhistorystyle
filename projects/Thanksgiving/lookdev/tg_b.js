// Thanksgiving, second batch of drawn scenes (load after tg.js). Same rules as tg.js: pure functions of t, parallax planes, solid
// figures from rig.js, coral for the one thing each beat is about.
//
//   tg_turtle_dock     A harbour wharf, about 1800: a brig alongside, ships at anchor in the haze, a far shore of roofs and steeples.
//                      Two dockworkers pay out a rope over a timber derrick and lower a slatted crate with a live green turtle in it
//                      (coral); a horse and wagon wait; crates, barrels, gulls. 6 s.
//   tg_dining_hall     A great house's dining hall, 1880s (from mansion.js's first floor: stone walls, tapestries, the big mantel,
//                      gasoliers): a long table, diners in profile, a waiter carries in a turtle-shaped tureen (coral) and sets it
//                      down. 9 s.
//   tg_1950s_kitchen   Daytime, 1955: a window on a lawn and a picket fence, steel cabinets, a round-shouldered refrigerator, tin
//                      cans and a magazine propped open on the counter. The hostess (full skirt, apron: rig.js) works a can opener,
//                      then carries a casserole (coral) to the table. Pastel colours on purpose. 12 s.
//   tg_table_3d        The Ch 5 menu as a real 3D table (ep3_map.js's idea: a perspective camera, faces sorted far to near),
//                      the camera orbiting as the dishes land: turkey in the middle, pumpkin pie at the end.

const tgDefsB = (t) => tgDefs(t).replace('</defs>',
  grad('tgharbour', [['0', '#56808F'], ['0.45', '#9DB9B4'], ['0.72', '#E8D9B0'], ['1', '#F6E8C4']]) +
  grad('tgsea', [['0', '#D9D2B0'], ['0.3', '#8FB0AC'], ['1', '#2F5560']]) +
  grad('tghaze', [['0', '#F2E6C2', 0], ['0.6', '#F2E6C2', 0.55], ['1', '#F2E6C2', 0.1]]) +
  grad('tgwood', [['0', '#6B4A2E'], ['1', '#3A2616']]) +
  grad('tgdaysky', [['0', '#7FC4E8'], ['1', '#D8F0F4']]) +
  grad('tglawn', [['0', '#9BD17A'], ['1', '#5DAA55']]) +
  grad('tgfridge', [['0', '#C9D8D4'], ['0.2', '#FFFFFF'], ['0.7', '#EEF4F0'], ['1', '#B4C6C2']], false) +
  grad('tgchrome', [['0', '#FFFFFF'], ['0.5', '#B9C6CC'], ['1', '#7E8E96']]) +
  `<pattern id="tgcheck" width="120" height="120" patternUnits="userSpaceOnUse"><rect width="120" height="120" fill="#F6F0DC"/><rect width="60" height="60" fill="#9ED3CC"/><rect x="60" y="60" width="60" height="60" fill="#9ED3CC"/></pattern>` +
  `<pattern id="tggingham" width="36" height="36" patternUnits="userSpaceOnUse"><rect width="36" height="36" fill="#FFFDF2"/><rect width="18" height="36" fill="#F3C94C" opacity="0.55"/><rect width="36" height="18" fill="#F3C94C" opacity="0.55"/></pattern>` +
  `<radialGradient id="tgcandle"><stop offset="0" stop-color="#FFE9B0" stop-opacity="0.85"/><stop offset="0.35" stop-color="#FFC978" stop-opacity="0.3"/><stop offset="1" stop-color="#FFC978" stop-opacity="0"/></radialGradient></defs>`);

// a figure's front (or back) hand in the world, allowing for its lean and bob (mansion.js's hand() ignores both)
const tgHand = (o, a = o.an.fArm) => { const [hx, hy] = hand({...o, y: o.y - (o.an.bob || 0) * o.h}, a), r = ((o.an.lean || 0) * o.d) * Math.PI / 180, dx = hx - o.x, dy = hy - o.y;
  return [o.x + dx * Math.cos(r) - dy * Math.sin(r), o.y + dx * Math.sin(r) + dy * Math.cos(r)]; };

/* ================= tg_turtle_dock ================= */
const TD = {sec: 6, D: 820, H: 300, lower: [0.3, 3.5], post: 840, tip: [540, 235]}; // D: the wharf deck where people stand

// a merchant brig lying alongside: hull, two masts, yards with furled sails, shrouds, a bowsprit (bow to the right)
function tgBrig(x, base, k, c, t) {
  const s = [], rock = 0.5 * Math.sin(TAU * t / 5.1), P = (u, v) => [x + u * k, base - v * k];
  s.push(poly([P(0, 62), P(18, 78), P(60, 70), P(330, 70), P(372, 86), P(350, 0), P(24, 0)], c));
  s.push(line([P(360, 80), P(470, 122)], c, 5 * k * 0.4), line([P(20, 76), P(330, 76)], shade(c, 0.25), 2));
  for (const [mx, mh] of [[110, 300], [250, 330]]) {
    s.push(line([P(mx, 60), P(mx, 60 + mh)], c, 3.2 * k * 0.5));
    for (const [v, w] of [[0.36, 150], [0.62, 120], [0.84, 84]]) { const yy = 60 + mh * v; s.push(line([P(mx - w / 2, yy), P(mx + w / 2, yy)], c, 2 * k * 0.5));
      s.push(`<path d="M${pts([P(mx - w / 2 + 4, yy - 2)])} Q${pts([P(mx, yy - 15)])} ${pts([P(mx + w / 2 - 4, yy - 2)])} Z" fill="${shade(c, 0.32)}"/>`); }
    for (const dx of [-34, -22, 22, 34]) s.push(line([P(mx + dx, 68), P(mx, 60 + mh * 0.8)], c, 1.2));
    for (let v = 0.12; v < 0.7; v += 0.1) s.push(line([P(mx - 34 * (1 - v), 68 + mh * 0.8 * v), P(mx + 34 * (1 - v), 68 + mh * 0.8 * v)], c, 0.8));
    s.push(line([P(mx, 60 + mh), P(mx + 140, mx > 200 ? 110 : 66 + mh * 0.75)], c, 1.2));
  }
  s.push(line([P(250, 390), P(470, 122)], c, 1.2), line([P(110, 360), P(8, 78)], c, 1.2));
  return `<g transform="rotate(${f1(rock)}, ${x + 180 * k}, ${base})">${s.join('')}</g>`;
}
// a wooden shipping crate (slatted when open = true), its bottom centre at (x, y)
function tgCrate(x, y, w, h, seed = 1) { const r = rng(seed), c = shade('#5A3F28', (r() - 0.5) * 0.3); let s = `<rect x="${f1(x - w / 2)}" y="${f1(y - h)}" width="${w}" height="${h}" fill="${c}"/>`;
  for (let yy = y - h + h / 4; yy < y - 2; yy += h / 4) s += `<rect x="${f1(x - w / 2)}" y="${f1(yy)}" width="${w}" height="2" fill="#1E140C" opacity="0.6"/>`;
  return s + `<rect x="${f1(x - w / 2)}" y="${f1(y - h)}" width="9" height="${h}" fill="${shade(c, -0.3)}"/><rect x="${f1(x + w / 2 - 9)}" y="${f1(y - h)}" width="9" height="${h}" fill="${shade(c, -0.3)}"/><rect x="${f1(x - w / 2)}" y="${f1(y - h)}" width="${w}" height="3" fill="${shade(c, 0.35)}"/>`; }
const tgBarrel = (x, y, w, h) => `<path d="M${x - w * 0.4},${y - h} L${x + w * 0.4},${y - h} Q${x + w * 0.62},${y - h / 2} ${x + w * 0.4},${y} L${x - w * 0.4},${y} Q${x - w * 0.62},${y - h / 2} ${x - w * 0.4},${y - h} Z" fill="#3A2616"/>` +
  [0.14, 0.34, 0.66, 0.86].map((v) => `<rect x="${f1(x - w * (0.42 + 0.1 * Math.sin(Math.PI * v)))}" y="${f1(y - h * v - 3)}" width="${f1(w * (0.84 + 0.2 * Math.sin(Math.PI * v)))}" height="5" fill="#15100B"/>`).join('') + `<path d="M${x - w * 0.2},${y - h + 6} Q${x - w * 0.32},${y - h / 2} ${x - w * 0.2},${y - 6}" stroke="#8A6A48" stroke-width="3" fill="none" opacity="0.5"/>`;
// a green sea turtle in profile (head to the right), its plastron resting at (x, y); w = shell length. Drawn in coral: the subject.
function tgTurtle(x, y, w, t, fill = 'url(#tgcoral)') { const fl = Math.sin(t * 2.6), hd = 4 * Math.sin(t * 1.3), dk = '#8E332B';
  let s = `<path d="M${f1(x + w * 0.22)},${f1(y - w * 0.1)} q${f1(w * 0.16)},${f1(w * 0.2 + fl * 8)} ${f1(w * 0.3)},${f1(w * 0.14 + fl * 12)} q${f1(-w * 0.2)},${f1(-w * 0.02)} ${f1(-w * 0.36)},${f1(-w * 0.2)} Z" fill="#D95A4E"/>` + // the fore flipper, rowing
    `<path d="M${f1(x - w * 0.36)},${f1(y - w * 0.08)} q${f1(-w * 0.14)},${f1(w * 0.1 - fl * 5)} ${f1(-w * 0.22)},${f1(w * 0.06 - fl * 7)} q${f1(w * 0.06)},${f1(-w * 0.1)} ${f1(w * 0.18)},${f1(-w * 0.14)} Z" fill="#D95A4E"/>`;
  s += `<path d="M${f1(x + w * 0.4)},${f1(y - w * 0.17)} q${f1(w * 0.1)},${f1(-w * 0.1 + hd * 0.3)} ${f1(w * 0.2)},${f1(-w * 0.1 + hd)} q${f1(w * 0.1)},${f1(w * 0.02)} ${f1(w * 0.08)},${f1(w * 0.08)} q${f1(-w * 0.1)},${f1(w * 0.07)} ${f1(-w * 0.28)},${f1(w * 0.1)} Z" fill="${fill}"/><circle cx="${f1(x + w * 0.61)}" cy="${f1(y - w * 0.24 + hd)}" r="${f1(w * 0.014)}" fill="#3A1410"/>`;
  s += `<path d="M${f1(x - w * 0.5)},${f1(y - w * 0.1)} Q${f1(x - w * 0.42)},${f1(y - w * 0.5)} ${f1(x)},${f1(y - w * 0.5)} Q${f1(x + w * 0.4)},${f1(y - w * 0.48)} ${f1(x + w * 0.5)},${f1(y - w * 0.13)} Q${f1(x)},${f1(y - w * 0.02)} ${f1(x - w * 0.5)},${f1(y - w * 0.1)} Z" fill="${fill}"/>` + // the shell
    `<path d="M${f1(x - w * 0.46)},${f1(y - w * 0.14)} Q${f1(x)},${f1(y - w * 0.24)} ${f1(x + w * 0.47)},${f1(y - w * 0.16)}" stroke="${dk}" stroke-width="${f1(w * 0.014)}" fill="none" opacity="0.7"/>`;
  for (const k of [-0.28, -0.09, 0.1, 0.29]) s += `<path d="M${f1(x + k * w)},${f1(y - w * 0.17)} Q${f1(x + k * w * 0.9 + w * 0.02)},${f1(y - w * 0.36)} ${f1(x + k * w * 0.72)},${f1(y - w * 0.47 + Math.abs(k) * w * 0.14)}" stroke="${dk}" stroke-width="${f1(w * 0.012)}" fill="none" opacity="0.6"/>`;
  return s + `<path d="M${f1(x - w * 0.36)},${f1(y - w * 0.32)} Q${f1(x - w * 0.1)},${f1(y - w * 0.45)} ${f1(x + w * 0.16)},${f1(y - w * 0.43)}" stroke="#FFC9BE" stroke-width="${f1(w * 0.018)}" fill="none" opacity="0.6" stroke-linecap="round"/>`; }
// the slatted crate with the turtle in it: back slats, the turtle, front slats with gaps
function tgTurtleCrate(x, y, w, h, t) { const wd = '#5A3F28', dk = '#2A1B10', n = 6; let back = '', front = '';
  for (let k = 0; k <= n; k++) back += `<rect x="${f1(x - w / 2 + (w - 12) * k / n + 14)}" y="${f1(y - h)}" width="10" height="${h}" fill="#3A2818"/>`;
  for (let k = 0; k <= n; k++) front += `<rect x="${f1(x - w / 2 + (w - 16) * k / n)}" y="${f1(y - h)}" width="16" height="${h}" fill="${k % 2 ? shade(wd, 0.08) : wd}"/><rect x="${f1(x - w / 2 + (w - 16) * k / n)}" y="${f1(y - h)}" width="3" height="${h}" fill="#8A6A48" opacity="0.6"/>`;
  return `<rect x="${f1(x - w / 2)}" y="${f1(y - h)}" width="${w}" height="${h}" fill="#1A1009" opacity="0.5"/>` + back + tgTurtle(x - w * 0.04, y - 16, w * 0.74, t) + front +
    `<rect x="${f1(x - w / 2 - 6)}" y="${f1(y - h - 4)}" width="${w + 12}" height="16" fill="${wd}"/><rect x="${f1(x - w / 2 - 6)}" y="${f1(y - h - 4)}" width="${w + 12}" height="3" fill="#8A6A48"/><rect x="${f1(x - w / 2 - 6)}" y="${f1(y - 14)}" width="${w + 12}" height="16" fill="${wd}"/><rect x="${f1(x - w / 2 - 6)}" y="${f1(y - 14)}" width="${w + 12}" height="3" fill="#8A6A48" opacity="0.7"/><rect x="${f1(x - w / 2 - 6)}" y="${f1(y)}" width="${w + 12}" height="3" fill="${dk}"/>`; }
const tgGull = (x, y, sz, fl, c = '#F4EFE6') => `<path d="M${f1(x - sz)},${f1(y - sz * fl * 0.7)} Q${f1(x - sz / 2)},${f1(y - sz * fl - sz * 0.15)} ${f1(x)},${f1(y)} Q${f1(x + sz / 2)},${f1(y - sz * fl - sz * 0.15)} ${f1(x + sz)},${f1(y - sz * fl * 0.7)}" stroke="${c}" stroke-width="${f1(Math.max(2, sz * 0.14))}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="${f1(x)}" cy="${f1(y + sz * 0.05)}" rx="${f1(sz * 0.26)}" ry="${f1(sz * 0.1)}" fill="${c}"/>`;

function renderTgDock({t, cam, quiet = false}) {
  const c = cam2(cam), {D, H} = TD, ink = '#0F0D0A';
  const sky = `<rect width="1920" height="1080" fill="url(#tgharbour)"/><circle cx="1240" cy="470" r="560" fill="url(#tgsun)" opacity="0.8"/>` + clouds(t, 31);
  // far shore (0.25): a low town of roofs, a few steeples and a windmill-less skyline, pale in the haze
  const r = rng(71), far = [];
  for (let x = -600; x < 3000; x += 40 + r() * 70) { const w = 50 + r() * 80, h = 26 + r() * 50; far.push(`<rect x="${f1(x)}" y="${f1(640 - h)}" width="${f1(w)}" height="${f1(h)}" fill="#8FAEB0"/>` + (r() < 0.5 ? `<path d="M${f1(x - 4)},${f1(640 - h)} L${f1(x + w / 2)},${f1(640 - h - 16 - r() * 14)} L${f1(x + w + 4)},${f1(640 - h)} Z" fill="#8FAEB0"/>` : '')); }
  for (const x of [-200, 520, 1180, 1900, 2500]) far.push(`<rect x="${x}" y="540" width="26" height="100" fill="#8FAEB0"/><path d="M${x - 3},540 L${x + 13},${460 - (x % 3) * 14} L${x + 29},540 Z" fill="#8FAEB0"/>`);
  far.push(`<rect x="-800" y="560" width="4200" height="100" fill="url(#tgmist)" opacity="0.9"/>`);
  // the harbour (0.5): water, ships at anchor in the haze (the bridge scene's ships), a mist band
  const mid = `<rect x="-800" y="636" width="4200" height="500" fill="url(#tgsea)"/>` + MAT.water(-800, 640, 4200, 200, t, {top: '#C9CDB0', bottom: '#5E8A8C', seed: 33, glint: '#FFF8DC', n: 120}) +
    `<g transform="translate(180,676) scale(0.62)" opacity="0.8">${ship(0, 0, '#6F9296', t, 0.2)}</g><g transform="translate(2060,690) scale(0.8)" opacity="0.85">${ship(0, 0, '#5E8488', t, 0.7)}</g><g transform="translate(1180,668) scale(0.42)" opacity="0.7">${ship(0, 0, '#84A3A4', t, 0.45)}</g>` +
    `<rect x="-800" y="610" width="4200" height="130" fill="url(#tghaze)" opacity="0.75"/>`;
  // the brig alongside (0.8): hull and rigging against the bright haze
  const brig = tgBrig(-250, D - 14, 2.5, '#1B2A2C', t) + `<rect x="-800" y="${D - 240}" width="4200" height="250" fill="url(#tghaze)" opacity="0.4"/>`;
  // the wharf (1): a plank deck, its timber face and piles below, cargo, the derrick, the crate coming down, the men, the wagon
  const s = [];
  s.push(MAT.planks(-800, D - 22, 4200, 112, {base: '#5E472F', seed: 34, size: 18}) + `<rect x="-800" y="${D - 22}" width="4200" height="46" fill="url(#matFloorShade)" opacity="0.7"/><rect x="-800" y="${D + 88}" width="4200" height="22" fill="#2E2014"/><rect x="-800" y="${D + 88}" width="4200" height="3" fill="#9A7A52" opacity="0.6"/>` +
    `<rect x="-800" y="${D + 110}" width="4200" height="300" fill="#0E1618"/>`);
  for (let x = -700; x < 3300; x += 230) s.push(`<rect x="${x}" y="${D + 100}" width="44" height="300" fill="#22170E"/><rect x="${x + 6}" y="${D + 100}" width="6" height="300" fill="#6B4E32" opacity="0.5"/>` + line([[x + 44, D + 130], [x + 230, D + 260]], '#1A120B', 12));
  s.push(MAT.water(-800, D + 210, 4200, 80, t, {top: '#3C6468', bottom: '#12262A', seed: 35, glint: '#E8E0C0', n: 50}));
  // cargo on the left: crates stacked, barrels, a sack pile; a gull on the top crate
  s.push(tgCrate(120, D + 30, 220, 130, 2) + tgCrate(330, D + 30, 170, 110, 3) + tgCrate(150, D - 100, 180, 104, 4) + tgCrate(-110, D + 30, 200, 150, 5) + tgBarrel(470, D + 36, 92, 124));
  s.push(`<g transform="translate(176,${D - 204})"><ellipse cx="0" cy="-12" rx="22" ry="11" fill="#F4EFE6"/><circle cx="17" cy="-25" r="8.5" fill="#F4EFE6"/><path d="M24,-25 l13,3 l-13,3 Z" fill="#E0A63C"/><path d="M-20,-12 l-22,5 l20,5 Z" fill="#9AA6A6"/><path d="M-4,-2 l0,14 M5,-2 l0,14" stroke="#E0A63C" stroke-width="2.5"/></g>`);
  // the derrick: a timber post with a strut and a jib, a block at the jib's tip
  const [tx, ty] = TD.tip, px = TD.post;
  s.push(line([[px, D + 20], [px, 190]], '#2A1B10', 26) + line([[px - 9, D + 20], [px - 9, 190]], '#7A5A3A', 4, 'opacity="0.6"') + line([[px, 215], [tx, ty]], '#2A1B10', 18) + line([[px, 470], [tx + 150, ty + 60]], '#2A1B10', 11) +
    line([[px + 130, D + 20], [px, 560]], '#2A1B10', 14) + `<rect x="${px - 60}" y="${D + 8}" width="240" height="18" fill="#2A1B10"/><circle cx="${tx}" cy="${ty + 12}" r="17" fill="#1A1009"/><circle cx="${tx}" cy="${ty + 12}" r="6" fill="#7A5A3A"/><circle cx="${px}" cy="205" r="15" fill="#1A1009"/>`);
  // the crate comes down on the fall; it turns and swings a little, and settles on the deck
  const lu = smooth(TD.lower[0], TD.lower[1], t), landed = smooth(TD.lower[1] - 0.15, TD.lower[1] + 0.25, t), cy = 470 + (D + 34 - 470) * (lu * (2 - lu) * 0.35 + lu * 0.65);
  const sw = (1 - landed) * 2.6 * Math.sin(t * 2.1), cw = 270, ch = 150, rope = '#C9B98A';
  s.push(line([[tx, ty + 28], [tx + (cy - ch - 70 - ty) * Math.sin(sw * Math.PI / 180), cy - ch - 68]], rope, 5));
  s.push(`<g transform="rotate(${f1(sw)}, ${tx}, ${ty + 12})">` + line([[tx, cy - ch - 70], [tx - cw / 2 + 10, cy - ch]], rope, 4) + line([[tx, cy - ch - 70], [tx + cw / 2 - 10, cy - ch]], rope, 4) + `<circle cx="${tx}" cy="${f1(cy - ch - 70)}" r="8" fill="#1A1009"/>` + tgTurtleCrate(tx, cy, cw, ch, t) + `</g>`);
  s.push(`<ellipse cx="${tx}" cy="${D + 38}" rx="${f1(90 + 80 * lu)}" ry="${f1(6 + 6 * lu)}" fill="#000" opacity="${f1(0.18 + 0.3 * lu)}"/>`);
  // two dockworkers pay the rope out hand over hand, leaning back against the load; shirtsleeves, a felt hat and a knitted cap
  const lod = lodFor(H * c.z), rim = {c: '#FFF1CC', a: 0.8 * lod.rimA, dx: 0.011, dy: -0.004}, pay = (1 - landed) * 1, ph = t * 1.5;
  const mk = (x, hat, k) => { const q = Math.sin(TAU * (ph + k * 0.37)), o = {x, y: D + 44 + k * 8, h: H * (k ? 0.97 : 1), d: -1, kind: 'man', hat, coat: 'vest', fill: ink, det: 0, rim,
    an: {legs: [26 - 18 * landed, -24 + 18 * landed], shins: [10 - 6 * landed, -30 + 24 * landed], lean: -9 - 3 * pay + 2 * landed * 6, fArm: [74 + 12 * q * pay + 60 * landed, 64 + 18 * q * pay + 60 * landed], bArm: [92 - 12 * q * pay + 70 * landed, 74 - 18 * q * pay + 80 * landed], tilt: 10 - 14 * landed, bob: 0.004 * q * pay}}; return o; };
  const m1 = mk(1080, 'felt', 0), m2 = mk(1200, 'knit', 1), h1 = tgHand(m1), h2 = tgHand(m2), slack = 40 * landed;
  s.push(`<path d="M${px},205 Q${f1((px + h1[0]) / 2)},${f1((205 + h1[1]) / 2 + 4 + slack)} ${f1(h1[0])},${f1(h1[1])} Q${f1((h1[0] + h2[0]) / 2)},${f1((h1[1] + h2[1]) / 2 + 8 + slack * 0.6)} ${f1(h2[0])},${f1(h2[1])} Q${f1(h2[0] + 70)},${f1(h2[1] + 120)} ${f1(h2[0] + 96)},${D + 40}" stroke="${rope}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
    `<ellipse cx="${f1(h2[0] + 110)}" cy="${D + 42}" rx="44" ry="10" fill="none" stroke="${rope}" stroke-width="5"/><ellipse cx="${f1(h2[0] + 110)}" cy="${D + 34}" rx="38" ry="9" fill="none" stroke="${rope}" stroke-width="5"/>`);
  s.push(figure(m2) + figure(m1) + MAT.shadow(1080, D + 46, 60, 0.3) + MAT.shadow(1200, D + 54, 60, 0.3));
  // the wagon that will take it up to the taverns: a horse standing in the shafts, the driver waiting
  s.push(MAT.shadow(1560, D + 62, 320, 0.3) + wagon(1830, D + 58, 220, ink, 0.31, 1, {hat: 'felt', coat: 'vest'}) + line([[1830 - 1.2 * 220 + 0.25 * 220, D + 58 - 0.5 * 1.1 * 220 - 0.33 * 220], [1830 + 0.9 * 220, D + 58 - 1.0 * 220]], ink, 2.5));
  // gulls wheeling over the water (0.6), white against the haze
  let gl = ''; for (let i = 0; i < 4; i++) { const gx = ((300 + i * 520 + t * (46 + i * 9)) % 2600) - 200, gy = 250 + i * 54 + 14 * Math.sin(t * 0.9 + i * 2); gl += tgGull(gx, gy, 20 - i * 2, 0.75 * Math.sin(TAU * (t * 1.5 + i * 0.3))); }
  // foreground (1.35): a bollard with a turn of rope, the corner of a crate: dark and soft
  const fore = `<g filter="url(#tgblur)"><path d="M1560,1100 L1560,${D + 150} q0,-40 60,-40 q60,0 60,40 L1680,1100 Z" fill="#0A0806"/><ellipse cx="1620" cy="${D + 190}" rx="92" ry="20" fill="none" stroke="#0A0806" stroke-width="20"/><path d="M-500,1200 L-500,${D + 96} L60,${D + 80} L110,1200 Z" fill="#0A0806"/><path d="M150,1200 q30,-150 90,-150 q60,0 90,150 Z" fill="#0A0806"/><path d="M1680,${D + 200} Q1900,${D + 260} 2500,${D + 190}" stroke="#0A0806" stroke-width="18" fill="none"/></g>`;
  const world = layerAt(c, 0.25, far.join('')) + layerAt(c, 0.5, mid) + layerAt(c, 0.6, gl) + layerAt(c, 0.8, brig) + layerAt(c, 1, s.join('')) + layerAt(c, 1.35, fore) +
    `<rect width="1920" height="1080" fill="#F2DDB0" opacity="0.08" style="mix-blend-mode:screen"/>`;
  const scr = quiet ? '' : tag(172, 150, 'A HARBOUR WHARF · ABOUT 1800', smooth(0.3, 0.9, t));
  return frame(tgDefsB(t), sky, world, scr, t);
}
const tgDockCam = (t) => { const u = ease(t / TD.sec); return {z: lerpLog(0.9, 1.06, u), ux: 1030 - 190 * u, uy: 520 + 40 * u}; };
Object.assign(CLIPS, {tg_turtle_dock: {sec: TD.sec, render: (t) => renderTgDock({t, cam: tgDockCam(t), quiet: true})}});

/* ================= tg_dining_hall ================= */
const DH = {sec: 10, G: 900, H: 340, TX: 1050, walk: [1.5, 4.0], set: [4.0, 4.7], back: [4.9, 5.6]}; // TX: where the tureen is set down

// a soup tureen made as a turtle (they were): the lid is the shell, the head and flippers are the handles. Bottom centre (x, y).
function tgTureen(x, y, w, t) { const dk = '#8E332B';
  let s = `<path d="M${f1(x - w * 0.2)},${y} L${f1(x + w * 0.2)},${y} L${f1(x + w * 0.13)},${f1(y - w * 0.1)} L${f1(x - w * 0.13)},${f1(y - w * 0.1)} Z" fill="url(#tgcoral)"/><rect x="${f1(x - w * 0.22)}" y="${f1(y - 5)}" width="${f1(w * 0.44)}" height="5" rx="2" fill="#FF9A8C"/>`;
  s += `<path d="M${f1(x - w * 0.46)},${f1(y - w * 0.3)} q${f1(-w * 0.1)},${f1(-w * 0.12)} ${f1(-w * 0.2)},${f1(-w * 0.12)} q${f1(-w * 0.1)},${f1(w * 0.02)} ${f1(-w * 0.08)},${f1(w * 0.09)} q${f1(w * 0.12)},${f1(w * 0.08)} ${f1(w * 0.3)},${f1(w * 0.1)} Z" fill="url(#tgcoral)"/><circle cx="${f1(x - w * 0.67)}" cy="${f1(y - w * 0.38)}" r="${f1(w * 0.016)}" fill="#3A1410"/>` + // the head, a handle
    `<path d="M${f1(x + w * 0.46)},${f1(y - w * 0.3)} l${f1(w * 0.12)},${f1(w * 0.02)} l${f1(-w * 0.1)},${f1(w * 0.05)} Z" fill="${dk}"/>` +
    `<path d="M${f1(x - w * 0.36)},${f1(y - w * 0.2)} q${f1(-w * 0.12)},${f1(w * 0.02)} ${f1(-w * 0.2)},${f1(w * 0.13)} q${f1(w * 0.14)},${f1(w * 0.0)} ${f1(w * 0.26)},${f1(-w * 0.07)} Z M${f1(x + w * 0.36)},${f1(y - w * 0.2)} q${f1(w * 0.1)},${f1(w * 0.02)} ${f1(w * 0.17)},${f1(w * 0.12)} q${f1(-w * 0.12)},0 ${f1(-w * 0.22)},${f1(-w * 0.06)} Z" fill="#D95A4E"/>`;
  s += `<path d="M${f1(x - w * 0.5)},${f1(y - w * 0.31)} Q${f1(x - w * 0.46)},${f1(y - w * 0.09)} ${x},${f1(y - w * 0.09)} Q${f1(x + w * 0.46)},${f1(y - w * 0.09)} ${f1(x + w * 0.5)},${f1(y - w * 0.31)} Z" fill="url(#tgcoral)"/>`; // the bowl
  s += `<path d="M${f1(x - w * 0.48)},${f1(y - w * 0.33)} Q${f1(x - w * 0.42)},${f1(y - w * 0.7)} ${x},${f1(y - w * 0.7)} Q${f1(x + w * 0.42)},${f1(y - w * 0.68)} ${f1(x + w * 0.48)},${f1(y - w * 0.33)} Z" fill="url(#tgcoral)"/>`; // the shell lid
  for (const k of [-0.3, -0.1, 0.1, 0.3]) s += `<path d="M${f1(x + k * w)},${f1(y - w * 0.34)} Q${f1(x + k * w * 0.95)},${f1(y - w * 0.52)} ${f1(x + k * w * 0.7)},${f1(y - w * 0.68 + Math.abs(k) * w * 0.16)}" stroke="${dk}" stroke-width="${f1(w * 0.014)}" fill="none" opacity="0.6"/>`;
  s += `<path d="M${f1(x - w * 0.4)},${f1(y - w * 0.5)} Q${x},${f1(y - w * 0.58)} ${f1(x + w * 0.4)},${f1(y - w * 0.5)}" stroke="${dk}" stroke-width="${f1(w * 0.012)}" fill="none" opacity="0.5"/>` +
    `<rect x="${f1(x - w * 0.52)}" y="${f1(y - w * 0.345)}" width="${f1(w * 1.04)}" height="${f1(w * 0.045)}" rx="${f1(w * 0.02)}" fill="#FFA598"/>` +
    `<path d="M${f1(x - w * 0.32)},${f1(y - w * 0.52)} Q${f1(x - w * 0.14)},${f1(y - w * 0.66)} ${f1(x + w * 0.08)},${f1(y - w * 0.64)}" stroke="#FFD6CE" stroke-width="${f1(w * 0.022)}" fill="none" opacity="0.7" stroke-linecap="round"/>`;
  return s + MAT.smoke(x - w * 0.1, y - w * 0.7, t, {col: 'F4EFE6', k: 0.5, n: 6, rise: 200, drift: 50, speed: 4, seed: 41}); }
function tgCandelabra(x, y, t, k = 1) { let s = `<rect x="${x - 4 * k}" y="${y - 96 * k}" width="${8 * k}" height="${96 * k}" fill="#C9B98A"/><path d="M${x - 28 * k},${y} L${x + 28 * k},${y} L${x + 10 * k},${y - 14 * k} L${x - 10 * k},${y - 14 * k} Z" fill="#C9B98A"/><path d="M${x - 52 * k},${y - 110 * k} Q${x - 52 * k},${y - 70 * k} ${x},${y - 70 * k} Q${x + 52 * k},${y - 70 * k} ${x + 52 * k},${y - 110 * k}" stroke="#C9B98A" stroke-width="${5 * k}" fill="none"/>`;
  for (const dx of [-52, 0, 52]) { const fl = 0.85 + 0.15 * Math.sin(t * 9 + dx + x), ty = y - (dx ? 110 : 96) * k; s += `<rect x="${x + dx * k - 4 * k}" y="${ty - 44 * k}" width="${8 * k}" height="${44 * k}" fill="#F4EFE6"/><path d="M${x + dx * k},${f1(ty - 44 * k - 26 * k * fl)} q${7 * k},${16 * k} 0,${24 * k} q${-7 * k},${-8 * k} 0,${-24 * k} Z" fill="#FFE9A8"/>` + glowC(x + dx * k, ty - 56 * k, 70 * k, 0.75 * fl, 'tgcandle'); }
  return s; }
// the long table: a white damask cloth to the floor, set for the course: plates, glasses, decanters, covered dishes, candelabra
function tgLongTable(x0, x1, ty, G, t, clear) { const s = [], r = rng(77);
  s.push(`<rect x="${x0}" y="${ty + 14}" width="${x1 - x0}" height="${G + 26 - ty - 14}" fill="#CFC6B2"/>`);
  for (let x = x0 + 40; x < x1; x += 84) s.push(`<path d="M${x},${ty + 16} q${f1(8 + r() * 10)},${f1((G - ty) * 0.5)} ${f1(-6 + r() * 12)},${G + 22 - ty - 16}" stroke="#A89F8A" stroke-width="3" fill="none" opacity="0.7"/>`);
  s.push(`<rect x="${x0}" y="${ty + 14}" width="${x1 - x0}" height="${G + 26 - ty - 14}" fill="url(#matSootB)" opacity="0.8"/><rect x="${x0 - 8}" y="${ty}" width="${x1 - x0 + 16}" height="18" rx="4" fill="#F7F2E6"/>`);
  for (let x = x0 + 70; x < x1 - 40; x += 128) { if (Math.abs(x - clear) < 170) continue; const k = r();
    s.push(`<ellipse cx="${x}" cy="${ty + 2}" rx="34" ry="6" fill="#FFFFFF"/><ellipse cx="${x}" cy="${ty}" rx="22" ry="3.5" fill="#D9D2C0"/>`);
    s.push(`<path d="M${x + 44},${ty} l0,-22 M${x + 34},${ty} l20,0 M${x + 32},${ty - 46} q12,34 24,0 Z" stroke="#E8F2EE" stroke-width="2.5" fill="#E8F2EE" fill-opacity="0.35"/><path d="M${x + 35},${ty - 38} q9,20 18,0 Z" fill="#7A2030" opacity="0.8"/>`);
    if (k > 0.72) s.push(`<path d="M${x - 62},${ty} l0,-40 q0,-12 8,-16 l0,-22 l10,0 l0,22 q8,4 8,16 l0,40 Z" fill="#5A1A26"/><rect x="${x - 56}" y="${ty - 84}" width="14" height="6" fill="#C9B98A"/>`);
    else if (k > 0.45) s.push(`<ellipse cx="${x - 60}" cy="${ty - 4}" rx="40" ry="7" fill="#C9C2A8"/><path d="M${x - 94},${ty - 8} q34,-52 68,0 Z" fill="#D9D2C0"/><circle cx="${x - 60}" cy="${ty - 36}" r="5" fill="#C9C2A8"/><path d="M${x - 84},${ty - 14} q14,-22 30,-24" stroke="#FFFFFF" stroke-width="3" fill="none" opacity="0.7"/>`); }
  for (const cx of [x0 + 330, x1 - 330]) s.push(tgCandelabra(cx, ty, t, 1.25));
  // a pyramid of fruit on a stand at each end
  for (const fx of [x0 + 130, x1 - 130]) { s.push(`<rect x="${fx - 5}" y="${ty - 40}" width="10" height="40" fill="#C9B98A"/><ellipse cx="${fx}" cy="${ty - 42}" rx="56" ry="8" fill="#C9B98A"/>`);
    for (let row = 0; row < 4; row++) for (let k = 0; k < 4 - row; k++) s.push(`<circle cx="${f1(fx - (3 - row) * 13 + k * 26)}" cy="${ty - 60 - row * 22}" r="14" fill="${['#C8553D', '#D9A441', '#8A2C3A', '#B7A23C'][(row + k) % 4]}"/>`); }
  return s.join(''); }

function renderTgDining({t, cam, quiet = false}) {
  const c = cam2(cam), {G, H, TX} = DH, ink = '#0B0A08', back = [], s = [], fl = 0.9 + 0.07 * Math.sin(t * 7.3) + 0.04 * Math.sin(t * 17);
  const ty = G - 150, X0 = 400, X1 = 1700;
  // the wall (0.9): dressed stone, tapestries, the hooded stone mantel with its fire, tall windows under wine-red curtains, a dado
  { const r = rng(61); back.push(`<rect x="-700" y="-400" width="3900" height="${G + 400}" fill="#16272A"/>`);
    for (let row = 0, y = -400; y < G - 190; row++, y += 76) for (let x = -700 - (row % 2) * 110 - r() * 40; x < 3200;) { const w = 170 + r() * 110; back.push(`<rect x="${f1(x + 2)}" y="${y + 2}" width="${f1(w - 4)}" height="72" fill="${shade('#1E3536', (r() - 0.5) * 0.2)}"/>`); x += w; }
    back.push(`<rect x="-700" y="-400" width="3900" height="700" fill="url(#matSootT)"/><rect x="-700" y="-400" width="3900" height="${G + 210}" fill="url(#matSootT)" opacity="0.5"/>`);
    back.push(MAT.planks(-700, G - 190, 3900, 190, {base: '#1B2A28', seed: 62, size: 96, vertical: true}) + `<rect x="-700" y="${G - 198}" width="3900" height="10" fill="#C9B98A" opacity="0.75"/><rect x="-700" y="${G - 14}" width="3900" height="14" fill="#0B0A08"/>`);
    // tapestries: a hunt in old reds and greens, a gold border
    for (const [tx, sd] of [[350, 3], [1390, 4]]) { const rr = rng(sd); back.push(`<rect x="${tx - 8}" y="120" width="376" height="456" fill="#A8966A"/><rect x="${tx}" y="128" width="360" height="440" fill="#4A2A26"/>`);
      for (let i = 0; i < 26; i++) { const x = tx + 56 + rr() * 248, y = 196 + rr() * 220, rad = 20 + rr() * 26; back.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rad)}" fill="${['#33483A', '#5A4A2C', '#2A3E38', '#6A3A2C'][i % 4]}" opacity="0.9"/>`); }
      for (let i = 0; i < 5; i++) { const x = tx + 40 + i * 70 + rr() * 20; back.push(`<path d="M${f1(x)},568 q${f1(-8 + rr() * 16)},-90 ${f1(-10 + rr() * 20)},-${f1(170 + rr() * 60)}" stroke="#2A1C16" stroke-width="9" fill="none"/>`); }
      back.push(`<rect x="${tx}" y="470" width="360" height="98" fill="#2E3A2A" opacity="0.9"/><rect x="${tx + 14}" y="142" width="332" height="412" fill="none" stroke="#A8966A" stroke-width="3" opacity="0.7"/><rect x="${tx - 8}" y="120" width="376" height="456" fill="url(#matSootT)" opacity="0.8"/>`); }
    // windows at the ends: night outside, heavy curtains
    for (const wx of [-260, 2040]) back.push(`<rect x="${wx}" y="60" width="260" height="${G - 260}" fill="url(#tgnightwin)"/><rect x="${wx + 126}" y="60" width="8" height="${G - 260}" fill="#0B0A08"/><rect x="${wx}" y="330" width="260" height="8" fill="#0B0A08"/>` +
      `<path d="M${wx - 50},30 L${wx + 310},30 L${wx + 310},90 Q${wx + 130},150 ${wx - 50},90 Z" fill="#5A1A26"/><path d="M${wx - 50},40 L${wx + 40},40 Q${wx + 20},400 ${wx + 60},520 Q${wx - 10},700 ${wx - 30},${G - 200} L${wx - 60},${G - 200} Z" fill="#6A1F2C"/><path d="M${wx + 310},40 L${wx + 220},40 Q${wx + 240},400 ${wx + 200},520 Q${wx + 270},700 ${wx + 290},${G - 200} L${wx + 320},${G - 200} Z" fill="#6A1F2C"/><circle cx="${wx + 58}" cy="524" r="10" fill="#C9B98A"/><circle cx="${wx + 202}" cy="524" r="10" fill="#C9B98A"/>`);
    // the mantel: a hooded Gothic chimneypiece in pale stone, a wood fire
    const mx = 1050; back.push(`<path d="M${mx - 150},-400 L${mx + 150},-400 L${mx + 250},330 L${mx - 250},330 Z" fill="#2F4A47"/><path d="M${mx - 150},-400 L${mx - 60},-400 L${mx - 100},330 L${mx - 250},330 Z" fill="#000" opacity="0.18"/><rect x="${mx - 280}" y="322" width="560" height="40" fill="#3D5C57"/><rect x="${mx - 280}" y="356" width="560" height="8" fill="#22393A"/>` +
      `<rect x="${mx - 250}" y="362" width="80" height="${G - 362}" fill="#2F4A47"/><rect x="${mx + 170}" y="362" width="80" height="${G - 362}" fill="#2F4A47"/><rect x="${mx - 170}" y="362" width="340" height="${G - 362}" fill="#0A0706"/>` +
      `<path d="M${mx - 60},150 l60,-70 l60,70 l-60,70 Z" fill="none" stroke="#46655F" stroke-width="8"/>` + glowC(mx, G - 120, 330, 0.95 * fl, 'tgfire') + glowC(mx, G - 200, 760, 0.42 * fl, 'tgfire') +
      [0, 1, 2, 3, 4, 5, 6].map((k) => { const fx = mx - 120 + k * 40, hh = 150 + 70 * Math.sin(t * (5 + k * 0.7) + k * 2) + 40 * Math.sin(t * 11 + k), wv = 14 * Math.sin(t * 4 + k);
        return `<path d="M${fx - 34},${G - 160} C${fx - 40},${f1(G - 160 - hh * 0.5)} ${f1(fx + wv - 6)},${f1(G - 160 - hh * 0.6)} ${f1(fx + wv)},${f1(G - 160 - hh)} C${f1(fx + wv + 10)},${f1(G - 160 - hh * 0.6)} ${fx + 40},${f1(G - 160 - hh * 0.4)} ${fx + 34},${G - 160} Z" fill="${['#FF8A3C', '#FFB35A', '#FFD98A'][k % 3]}" opacity="0.85"/>`; }).join('') +
      `<rect x="${mx - 130}" y="${G - 172}" width="260" height="22" rx="10" fill="#1A0E08"/>`);
    // gasoliers over the table
    for (const gx of [600, 1500]) back.push(`<rect x="${gx - 3}" y="-400" width="6" height="560" fill="#C9B98A"/>` + glowC(gx, 230, 520, 0.7 * fl, 'mswarm') + gasolier(gx, 190, t, 3)); }
  // the floor, a carpet under the table
  s.push(MAT.planks(-700, G, 3900, 300, {base: '#2B1D14', seed: 63, size: 34}) + `<rect x="-700" y="${G}" width="3900" height="120" fill="url(#matFloorShade)"/><rect x="120" y="${G + 34}" width="1960" height="150" fill="#5A1A26"/><rect x="120" y="${G + 34}" width="1960" height="150" fill="none" stroke="#C9B98A" stroke-width="5" opacity="0.6"/><rect x="120" y="${G + 34}" width="1960" height="70" fill="url(#matFloorShade)" opacity="0.8"/>`);
  // the far row of diners, in profile, turned to their neighbours and to the dish coming in; high chair backs between them
  const lod = lodFor(H * c.z), r = rng(1883), su = smooth(DH.set[0], DH.set[1], t), arrive = smooth(DH.walk[0] + 1.2, DH.walk[1] + 0.4, t);
  for (let x = X0 + 70, i = 0; x < X1 - 30; x += 128, i++) { const woman = i % 2 === 1, d = Math.abs(x - TX) < 90 ? (i % 2 ? 1 : -1) : (r() < 0.75 ? Math.sign(TX - x) : -Math.sign(TX - x)), ph = r(), drink = r() < 0.3, look = arrive * (Math.sign(TX - x) === d ? 1 : 0);
    s.push(`<rect x="${x - 40}" y="${G - 330}" width="80" height="250" rx="12" fill="#150F0C"/><circle cx="${x - 40}" cy="${G - 332}" r="9" fill="#150F0C"/><circle cx="${x + 40}" cy="${G - 332}" r="9" fill="#150F0C"/>`);
    s.push(figure({x, y: sitY(G - 30, H), h: H * (woman ? 0.93 : 1), d, kind: woman ? 'woman' : 'man', hat: 'none', coat: 'frock', beard: !woman && r() > 0.5, fill: ink, det: lod.det * 0.5, prop: drink ? 'glass' : null,
      rim: {c: '#FFD9A0', a: 0.85 * fl * lod.rimA / 0.8, dx: 0.012 * Math.sign(TX - x || 1) * d, dy: -0.005},
      an: drink ? {legs: [86, 80], shins: [6, 0], ...POSES.drink(t, ph), bArm: [150, 110]} : {...POSES.sit(t, ph), fArm: [138, 96 + 4 * Math.sin(t * 1.3 + i)], tilt: -6 + 10 * look + 3 * Math.sin(t * 0.8 + i), lean: 3 * look}})); }
  // the table, and the host and hostess at its ends, in clear profile
  for (const [ex, d] of [[X0 - 70, 1], [X1 + 70, -1]]) { s.push(`<rect x="${ex - d * 76 - 9}" y="${G - 400}" width="18" height="${400 + 30}" rx="6" fill="#150F0C"/><rect x="${Math.min(ex - d * 76, ex + d * 40)}" y="${G - 96}" width="116" height="14" fill="#150F0C"/><rect x="${ex + d * 30 - 6}" y="${G - 90}" width="12" height="120" fill="#150F0C"/><circle cx="${ex - d * 76}" cy="${G - 404}" r="14" fill="#150F0C"/>`);
    s.push(figure({x: ex, y: sitY(G + 30, H * 1.04), h: H * 1.04 * (d < 0 ? 0.93 : 1), d, kind: d > 0 ? 'man' : 'woman', hat: 'none', coat: 'frock', beard: d > 0, fill: ink, det: lod.det * 0.6, rim: {c: '#FFD9A0', a: 0.9 * fl * lod.rimA / 0.8, dx: 0.012, dy: -0.005},
      an: {...POSES.sit(t, d > 0 ? 0.2 : 0.7), fArm: [130, 92], tilt: -4 + 10 * arrive, lean: 2 + 3 * arrive}})); }
  s.push(tgLongTable(X0, X1, ty, G, t, TX) + glowC(TX, ty - 60, 300, 0.55 * su * fl, 'tgcandle'));
  // the waiter: a tailcoat and a long white apron; he carries the tureen in from the right, sets it down and steps back a half pace
  const wu = smooth(DH.walk[0], DH.walk[1], t), bu = smooth(DH.back[0], DH.back[1], t), hW = H * 1.12, wx0 = TX + 120, wx = wx0 + 1150 * (1 - wu) + 46 * bu, walking = wu < 1;
  const carry = [[112, 84], [120, 92]], put = [[132, 104], [138, 110]], rest = [[172, 166], [188, 196]], mixA = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  const fA = mixA(mixA(carry[0], put[0], su), rest[0], bu), bA = mixA(mixA(carry[1], put[1], su), rest[1], bu);
  const wo = {x: wx, y: G + 78, h: hW, d: -1, kind: 'man', hat: 'none', coat: 'jacket', fill: '#070606', det: 0, rim: {c: '#FFD9A0', a: 0.7 * fl, dx: -0.011, dy: -0.004},
    an: walking ? {...walkAn(walkPhase(1150 * wu, hW * 0.9, 20), {stride: 20, carry: true}), fArm: fA, bArm: bA, lean: 2} : {...POSES.stand(t, 0.3), fArm: fA, bArm: bA, lean: 7 * su * (1 - bu), tilt: -8 * (1 - bu)}};
  const WX = (u) => wx - u * hW, WY = (v) => G + 78 - v * hW, [hx, hy] = tgHand(wo);
  s.push(figure(wo) + poly([[WX(-0.01), WY(0.6)], [WX(0.098), WY(0.6)], [WX(0.118), WY(0.12)], [WX(0.0), WY(0.1)]], '#EFE9DC') + poly([[WX(0.03), WY(0.845)], [WX(0.075), WY(0.842)], [WX(0.07), WY(0.74)], [WX(0.045), WY(0.7)]], '#EFE9DC'));
  const tux = hx - 30 + (TX - (hx - 30)) * su, tuy = hy + 44 + (ty - (hy + 44)) * su;
  s.push(tgTureen(tux, tuy, 176, t));
  // foreground (1.3): a palm in a tub and the end of a sideboard with a decanter: dark and soft
  let fore = `<g filter="url(#tgblur)"><path d="M-630,1200 L-600,${G + 60} L-410,${G + 60} L-380,1200 Z" fill="#060505"/>`;
  for (let k = -4; k <= 4; k++) fore += `<path d="M-505,${G + 60} Q${-505 + k * 70},${G - 420} ${-505 + k * 150},${G - 300 + Math.abs(k) * 50}" stroke="#060505" stroke-width="22" fill="none" stroke-linecap="round"/>`;
  fore += `<rect x="2380" y="${G - 40}" width="700" height="400" fill="#060505"/><path d="M2470,${G - 40} l0,-70 q0,-20 14,-28 l0,-40 l22,0 l0,40 q14,8 14,28 l0,70 Z" fill="#060505"/></g>`;
  const world = layerAt(c, 0.9, back.join('')) + layerAt(c, 1, s.join('')) + layerAt(c, 1.3, fore) + `<rect width="1920" height="1080" fill="#FFB35A" opacity="0.05" style="mix-blend-mode:screen"/>`;
  const scr = quiet ? '' : tag(172, 150, 'A GREAT HOUSE\'S DINING HALL · 1880s', smooth(0.3, 0.9, t));
  return frame(tgDefsB(t), `<rect width="1920" height="1080" fill="#0A0807"/>`, world, scr, t);
}
const tgDiningCam = (t) => { const u = ease(t / DH.sec), p = smooth(2.4, 9.6, t); return {z: lerpLog(0.84, 1.14, p), ux: 1230 - 170 * smooth(0.5, 5, t) - 10 * u, uy: 500 + 70 * p}; };
Object.assign(CLIPS, {tg_dining_hall: {sec: DH.sec, render: (t) => renderTgDining({t, cam: tgDiningCam(t), quiet: true})}});
if (typeof window !== 'undefined') Object.assign(window, {renderTgDock, renderTgDining});
