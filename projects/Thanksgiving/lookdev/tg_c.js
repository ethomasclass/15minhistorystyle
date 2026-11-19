// Thanksgiving, drawn scenes continued (load after tg_b.js): the 1950s kitchen and the 3D table.

/* ================= tg_1950s_kitchen ================= */
const K5 = {sec: 13, G: 900, H: 520, x0: 1190, x1: 1826, crank: [0.2, 5.5], turn: 5.9, pick: [6.0, 6.7], walk: [6.8, 9.5], set: [9.5, 10.3], back: [10.5, 11.2]};
const K5C = {wall: '#F4E4B4', tile: '#FBF6E4', cab: '#62BDB6', cabL: '#86D2CB', cabD: '#3F9C96', top: '#FDFBF2', ink: '#16191D', tin: '#C9D0D2'};

// a tin can with a plain paper label (no brand), bottom centre (x, y); lid: 0..1 lifts the cut lid
function tgCan(x, y, w, h, col, lid = 0) {
  return `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" rx="3" fill="${K5C.tin}"/><rect x="${x - w / 2}" y="${f1(y - h * 0.8)}" width="${w}" height="${f1(h * 0.6)}" fill="${col}"/><rect x="${x - w / 2}" y="${f1(y - h * 0.58)}" width="${w}" height="${f1(h * 0.14)}" fill="#FFFDF2" opacity="0.85"/>` +
    `<rect x="${f1(x - w / 2 + w * 0.12)}" y="${y - h}" width="${f1(w * 0.14)}" height="${h}" fill="#FFFFFF" opacity="0.45"/><rect x="${x - w / 2 - 1}" y="${y - h - 2}" width="${w + 2}" height="5" rx="2" fill="#9AA4A8"/><rect x="${x - w / 2 - 1}" y="${y - 4}" width="${w + 2}" height="5" rx="2" fill="#9AA4A8"/>` +
    (lid > 0 ? `<g transform="rotate(${f1(-62 * lid)}, ${x - w / 2}, ${y - h})"><rect x="${x - w / 2}" y="${y - h - 4}" width="${w}" height="4" rx="2" fill="#E4EAEC"/></g>` : ''); }
// the casserole: an oval covered dish with ear handles and a knob, bottom centre (x, y). Coral: the subject.
function tgCasserole(x, y, w, t, steam = 1) { const h = w * 0.3;
  return MAT.smoke(x - w * 0.08, y - h - w * 0.2, t, {col: 'F4EFE6', k: 0.5 * steam, n: 6, rise: 190, drift: 40, speed: 4, seed: 51}) +
    `<rect x="${f1(x - w * 0.62)}" y="${f1(y - h * 0.86)}" width="${f1(w * 1.24)}" height="${f1(h * 0.24)}" rx="${f1(h * 0.12)}" fill="#D95A4E"/>` +
    `<path d="M${f1(x - w / 2)},${f1(y - h)} L${f1(x + w / 2)},${f1(y - h)} L${f1(x + w * 0.44)},${f1(y - h * 0.12)} Q${f1(x + w * 0.42)},${y} ${f1(x + w * 0.36)},${y} L${f1(x - w * 0.36)},${y} Q${f1(x - w * 0.42)},${y} ${f1(x - w * 0.44)},${f1(y - h * 0.12)} Z" fill="url(#tgcoral)"/>` +
    `<path d="M${f1(x - w * 0.5)},${f1(y - h)} Q${f1(x - w * 0.42)},${f1(y - h - w * 0.2)} ${x},${f1(y - h - w * 0.2)} Q${f1(x + w * 0.42)},${f1(y - h - w * 0.2)} ${f1(x + w * 0.5)},${f1(y - h)} Z" fill="url(#tgcoral)"/><rect x="${f1(x - w * 0.53)}" y="${f1(y - h - 4)}" width="${f1(w * 1.06)}" height="8" rx="4" fill="#FFA598"/>` +
    `<ellipse cx="${x}" cy="${f1(y - h - w * 0.215)}" rx="${f1(w * 0.07)}" ry="${f1(w * 0.04)}" fill="#D95A4E"/><path d="M${f1(x - w * 0.3)},${f1(y - h - w * 0.1)} Q${f1(x - w * 0.12)},${f1(y - h - w * 0.17)} ${f1(x + w * 0.06)},${f1(y - h - w * 0.165)}" stroke="#FFD6CE" stroke-width="4" fill="none" opacity="0.75" stroke-linecap="round"/>`; }
// a steel cabinet door: a flat panel with a rounded pressing and a chrome pull
const tgDoor = (x, y, w, h, pull = 'r') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${K5C.cab}"/><rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${h - 10}" rx="10" fill="${K5C.cabL}"/><rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${h - 10}" rx="10" fill="none" stroke="${K5C.cabD}" stroke-width="1.5" opacity="0.6"/>` +
  `<rect x="${pull === 'r' ? x + w - 26 : x + 14}" y="${y + h / 2 - 26}" width="12" height="52" rx="6" fill="url(#tgchrome)"/>`;

function renderTgFifties({t, cam, quiet = false}) {
  const c = cam2(cam), {G, H} = K5, back = [], s = [], CT = G - 284; // CT: the counter top
  // the wall (0.92): butter-yellow paint, a tiled splashback, the window on the lawn, wall cabinets, the clock, the pantry cupboard
  back.push(`<rect x="-700" y="-300" width="4200" height="${G + 300}" fill="${K5C.wall}"/><rect x="-700" y="-300" width="4200" height="440" fill="#FFFBEA"/><rect x="-700" y="136" width="4200" height="8" fill="#E2CF98"/>`);
  back.push(`<rect x="380" y="${CT - 150}" width="1360" height="150" fill="${K5C.tile}"/>` + [...Array(34)].map((_, k) => `<rect x="${380 + k * 40}" y="${CT - 150}" width="1.5" height="150" fill="#E6DFC6"/>`).join('') + [1, 2, 3].map((k) => `<rect x="380" y="${CT - 150 + k * 38}" width="1360" height="1.5" fill="#E6DFC6"/>`).join('') + `<rect x="380" y="${CT - 156}" width="1360" height="8" fill="${K5C.cabD}"/>`);
  { // the window: sky, a tree, the lawn, a white picket fence; a gingham valance
    const wx = 560, wy = 250, ww = 400, wh = 300;
    let v = `<clipPath id="tgwin"><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}"/></clipPath><g clip-path="url(#tgwin)"><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="url(#tgdaysky)"/>`;
    for (const [k, y0, w0] of [[0, 300, 90], [1, 345, 70]]) { const cx = wx + ((k * 230 + t * (7 + k * 3)) % (ww + 200)) - 100; v += `<ellipse cx="${f1(cx)}" cy="${y0}" rx="${w0}" ry="18" fill="#FFFFFF" opacity="0.9"/><ellipse cx="${f1(cx + 34)}" cy="${y0 - 14}" rx="${w0 * 0.5}" ry="16" fill="#FFFFFF" opacity="0.9"/>`; }
    v += `<rect x="${wx + 250}" y="${wy + 120}" width="150" height="90" fill="#F7EBD0"/><path d="M${wx + 236},${wy + 124} l90,-52 l90,52 Z" fill="#E49A8A"/><rect x="${wx + 290}" y="${wy + 150}" width="30" height="34" fill="#9ED3E8"/>` + // the house across the way
      `<rect x="${wx + 96}" y="${wy + 130}" width="14" height="90" fill="#7A5A3A"/><circle cx="${wx + 103}" cy="${wy + 104}" r="62" fill="#6FB25E"/><circle cx="${wx + 60}" cy="${wy + 128}" r="40" fill="#7DBE68"/><circle cx="${wx + 146}" cy="${wy + 130}" r="38" fill="#5FA552"/>` +
      `<rect x="${wx}" y="${wy + 204}" width="${ww}" height="100" fill="url(#tglawn)"/>`;
    for (let x = wx - 6; x < wx + ww; x += 26) v += `<path d="M${x},${wy + 262} l0,-66 l8,-12 l8,12 l0,66 Z" fill="#FFFFFF"/>`;
    v += `<rect x="${wx}" y="${wy + 212}" width="${ww}" height="7" fill="#F2F2EA"/><rect x="${wx}" y="${wy + 242}" width="${ww}" height="7" fill="#F2F2EA"/><rect x="${wx}" y="${wy + 262}" width="${ww}" height="40" fill="#6DB45E"/></g>`;
    v += `<rect x="${wx - 14}" y="${wy - 14}" width="${ww + 28}" height="${wh + 28}" fill="none" stroke="#FFFFFF" stroke-width="16"/><rect x="${wx + ww / 2 - 5}" y="${wy}" width="10" height="${wh}" fill="#FFFFFF"/><rect x="${wx}" y="${wy + wh / 2 - 4}" width="${ww}" height="8" fill="#FFFFFF"/><rect x="${wx - 30}" y="${wy + wh + 12}" width="${ww + 60}" height="14" rx="4" fill="#FFFFFF"/>` +
      `<path d="M${wx - 30},${wy - 30} L${wx + ww + 30},${wy - 30} L${wx + ww + 30},${wy + 44} ` + [...Array(9)].map((_, k) => `q-${f1((ww + 60) / 18)},22 -${f1((ww + 60) / 9)},0`).join(' ') + ` Z" fill="url(#tggingham)" stroke="#E2B93C" stroke-width="2"/><rect x="${wx - 40}" y="${wy - 38}" width="${ww + 80}" height="10" rx="5" fill="url(#tgchrome)"/>`;
    // a geranium on the sill
    v += `<path d="M${wx + 40},${wy + wh + 12} l8,-44 l44,0 l8,44 Z" fill="#D98A5A"/>` + [[52, -70, '#E8566A'], [78, -84, '#F07A8A'], [66, -58, '#5FA552'], [92, -62, '#5FA552'], [44, -52, '#5FA552']].map(([dx, dy, col]) => `<circle cx="${wx + dx}" cy="${wy + wh + dy + 12}" r="15" fill="${col}"/>`).join('');
    back.push(v); }
  // wall cabinets and the clock (it is getting on for four)
  for (let k = 0; k < 3; k++) back.push(tgDoor(1030 + k * 150, 215, 150, 250, k === 1 ? 'l' : 'r'));
  back.push(`<rect x="1022" y="205" width="466" height="12" fill="${K5C.cabD}"/><rect x="1030" y="465" width="450" height="8" fill="${K5C.cabD}"/><rect x="1030" y="473" width="450" height="60" fill="#000" opacity="0.06"/>`);
  { const cx = 462, cy = 318, rr = 58, hr = 3.55 + t / 600, hd = (a, L, w, col = '#16191D') => `<line x1="${cx}" y1="${cy}" x2="${f1(cx + Math.sin(a) * L)}" y2="${f1(cy - Math.cos(a) * L)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
    back.push(`<circle cx="${cx}" cy="${cy}" r="${rr + 12}" fill="#E8566A"/><circle cx="${cx}" cy="${cy}" r="${rr}" fill="#FFFDF2"/>` + [...Array(12)].map((_, k) => { const a = k * TAU / 12; return `<circle cx="${f1(cx + Math.sin(a) * (rr - 10))}" cy="${f1(cy - Math.cos(a) * (rr - 10))}" r="${k % 3 ? 2.5 : 4.5}" fill="#16191D"/>`; }).join('') +
      hd(hr / 12 * TAU, rr * 0.5, 7) + hd((hr % 1) * TAU, rr * 0.76, 5) + hd(t / 60 * TAU * 6, rr * 0.8, 2, '#E8566A') + `<circle cx="${cx}" cy="${cy}" r="5" fill="#16191D"/>`); }
  { // the pantry cupboard, its door open: shelf after shelf of cans
    const px = 2170, py = 196, pw = 360, ph = G - py, cols = ['#F2C94C', '#8AD3CC', '#F29A8A', '#B8D98A', '#F4EFE6', '#E8566A', '#9EC4E8'], r = rng(55);
    back.push(`<rect x="${px - 14}" y="${py - 14}" width="${pw + 28}" height="${ph + 14}" fill="${K5C.cabD}"/><rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="#2D6E6A"/>`);
    for (let row = 0; row < 6; row++) { const sy = py + 104 + row * 112; back.push(`<rect x="${px}" y="${sy}" width="${pw}" height="10" fill="${K5C.cabL}"/>`);
      for (let x = px + 30; x < px + pw - 20; x += 48) { const hh = 54 + (r() < 0.3 ? 16 : 0); back.push(tgCan(x, sy, 40, hh, cols[Math.floor(r() * cols.length)])); if (r() < 0.25 && hh < 60) back.push(tgCan(x, sy - hh - 2, 40, 34, cols[Math.floor(r() * cols.length)])); } }
    back.push(`<path d="M${px + pw + 14},${py - 14} l96,26 l0,${ph - 20} l-96,-12 Z" fill="${K5C.cab}"/><path d="M${px + pw + 26},${py + 6} l72,20 l0,${ph - 60} l-72,-10 Z" fill="${K5C.cabL}"/>`); }
  // sunlight from the window falling across the room
  back.push(`<path d="M560,250 L960,250 L1500,${G} L900,${G} Z" fill="#FFFBE0" opacity="0.16"/>`);
  // the room (1): the checked floor, the refrigerator, base cabinets and the counter, the range, the table
  s.push(`<rect x="-700" y="${G}" width="4200" height="400" fill="url(#tgcheck)" transform="translate(0,${G}) scale(1,0.42) translate(0,${-G})"/><rect x="-700" y="${G}" width="4200" height="110" fill="url(#matFloorShade)" opacity="0.35"/><rect x="-700" y="${G - 12}" width="4200" height="14" fill="#E2CF98"/>`);
  s.push(`<path d="M900,${G + 2} L1500,${G + 2} L1680,${G + 180} L960,${G + 180} Z" fill="#FFFBE0" opacity="0.3"/>`);
  { // the new refrigerator: round shoulders, one door, a chrome pull and a badge
    const fx = 110, fw = 264, ft = G - 540;
    s.push(MAT.shadow(fx + fw / 2, G + 4, 150, 0.2) + `<path d="M${fx},${G - 14} L${fx},${ft + 70} Q${fx},${ft} ${fx + 70},${ft} L${fx + fw - 70},${ft} Q${fx + fw},${ft} ${fx + fw},${ft + 70} L${fx + fw},${G - 14} Z" fill="url(#tgfridge)"/>` +
      `<path d="M${fx + 8},${G - 22} L${fx + 8},${ft + 72} Q${fx + 8},${ft + 8} ${fx + 72},${ft + 8} L${fx + fw - 72},${ft + 8} Q${fx + fw - 8},${ft + 8} ${fx + fw - 8},${ft + 72} L${fx + fw - 8},${G - 22} Z" fill="none" stroke="#AEBEBA" stroke-width="2"/>` +
      `<rect x="${fx + fw - 44}" y="${ft + 190}" width="16" height="130" rx="8" fill="url(#tgchrome)"/><rect x="${fx + 50}" y="${ft + 60}" width="110" height="14" rx="7" fill="url(#tgchrome)"/><rect x="${fx + 10}" y="${G - 14}" width="30" height="14" fill="#7E8E96"/><rect x="${fx + fw - 40}" y="${G - 14}" width="30" height="14" fill="#7E8E96"/>` +
      `<rect x="${fx + 22}" y="${ft + 30}" width="26" height="${G - ft - 80}" rx="13" fill="#FFFFFF" opacity="0.8"/>`); }
  // base cabinets, the counter with its chrome edge
  for (let k = 0; k < 6; k++) s.push(tgDoor(392 + k * 181, CT + 62, 181, G - CT - 92, k % 2 ? 'l' : 'r') + `<rect x="${392 + k * 181 + 5}" y="${CT + 20}" width="171" height="38" rx="8" fill="${K5C.cabL}"/><rect x="${392 + k * 181 + 66}" y="${CT + 33}" width="50" height="11" rx="5" fill="url(#tgchrome)"/>`);
  s.push(`<rect x="384" y="${CT + 14}" width="1102" height="${G - CT - 14}" fill="none" stroke="${K5C.cabD}" stroke-width="3"/><rect x="392" y="${G - 30}" width="1086" height="30" fill="#2D6E6A"/><rect x="376" y="${CT}" width="1118" height="10" fill="${K5C.top}"/><rect x="376" y="${CT + 8}" width="1118" height="9" fill="url(#tgchrome)"/>`);
  // on the counter: a mixing bowl and a wooden spoon, the magazine propped open against a canister, cans waiting their turn
  s.push(`<path d="M604,${CT - 62} q66,84 132,0 Z" fill="#F29A8A"/><rect x="600" y="${CT - 66}" width="140" height="8" rx="4" fill="#F6B4A6"/>` + line([[690, CT - 60], [760, CT - 130]], '#B98A56', 8));
  s.push(`<rect x="430" y="${CT - 120}" width="84" height="120" rx="8" fill="#F2C94C"/><rect x="424" y="${CT - 134}" width="96" height="18" rx="8" fill="#E2B93C"/><rect x="446" y="${CT - 92}" width="52" height="36" rx="4" fill="#FFFDF2"/>`);
  { const mx = 838, my = CT; // the magazine: an open spread leaning back, colour plates of dishes, columns of type
    s.push(`<path d="M${mx - 96},${my} L${mx - 112},${my - 138} L${mx},${my - 150} L${mx},${my - 6} Z" fill="#FFFDF2"/><path d="M${mx},${my - 6} L${mx},${my - 150} L${mx + 112},${my - 138} L${mx + 96},${my} Z" fill="#F4EFE0"/><path d="M${mx},${my - 6} L${mx},${my - 150}" stroke="#C9C0A8" stroke-width="3"/>` +
      `<path d="M${mx - 100},${my - 126} L${mx - 12},${my - 136} L${mx - 12},${my - 76} L${mx - 94},${my - 70} Z" fill="#F29A8A"/><ellipse cx="${mx - 54}" cy="${my - 100}" rx="30" ry="14" fill="#F2C94C"/><ellipse cx="${mx - 54}" cy="${my - 104}" rx="18" ry="8" fill="#B8D98A"/>` +
      [0, 1, 2, 3].map((k) => `<rect x="${mx - 90 + k * 1}" y="${my - 58 + k * 12}" width="${72 - k * 6}" height="5" fill="#8A8676" opacity="0.7" transform="rotate(-4, ${mx - 54}, ${my - 40})"/>`).join('') +
      `<path d="M${mx + 14},${my - 134} L${mx + 100},${my - 126} L${mx + 96},${my - 92} L${mx + 14},${my - 98} Z" fill="#8AD3CC"/>` + [0, 1, 2, 3, 4].map((k) => `<rect x="${mx + 16}" y="${my - 82 + k * 13}" width="${76 - (k % 2) * 16}" height="5" fill="#8A8676" opacity="0.7" transform="rotate(4, ${mx + 54}, ${my - 50})"/>`).join('')); }
  const canX = K5.x0 - 168, cu = smooth(K5.crank[1] - 0.5, K5.crank[1], t);
  s.push(tgCan(924, CT, 46, 62, '#B8D98A') + tgCan(976, CT, 46, 62, '#F2C94C') + tgCan(950, CT - 62, 46, 46, '#9EC4E8') + tgCan(canX, CT, 48, 64, '#F29A8A', cu));
  // the range: white enamel, a splashback with a clock dial and knobs, an oven door with a window; a kettle
  { const rx = 1494, rw = 250;
    s.push(MAT.shadow(rx + rw / 2, G + 4, 140, 0.18) + `<rect x="${rx}" y="${CT - 6}" width="${rw}" height="${G - CT - 8}" rx="6" fill="url(#tgfridge)"/><rect x="${rx}" y="${CT - 96}" width="${rw}" height="92" rx="10" fill="#FFFFFF"/><rect x="${rx}" y="${CT - 96}" width="${rw}" height="92" rx="10" fill="none" stroke="#AEBEBA" stroke-width="2"/>` +
      `<circle cx="${rx + rw / 2}" cy="${CT - 52}" r="26" fill="#FFFDF2" stroke="#7E8E96" stroke-width="4"/>` + [34, 74, rw - 74, rw - 34].map((dx) => `<circle cx="${rx + dx}" cy="${CT - 40}" r="11" fill="#E8566A"/>`).join('') +
      `<rect x="${rx + 22}" y="${CT + 54}" width="${rw - 44}" height="170" rx="12" fill="#FFFFFF" stroke="#AEBEBA" stroke-width="2"/><rect x="${rx + 50}" y="${CT + 86}" width="${rw - 100}" height="78" rx="8" fill="#4A2E1C"/><rect x="${rx + 50}" y="${CT + 86}" width="${rw - 100}" height="78" rx="8" fill="#FF9F3C" opacity="${f1(0.45 + 0.08 * Math.sin(t * 3))}"/><rect x="${rx + 44}" y="${CT + 32}" width="${rw - 88}" height="12" rx="6" fill="url(#tgchrome)"/><rect x="${rx + 6}" y="${G - 14}" width="${rw - 12}" height="14" fill="#7E8E96"/>` +
      `<path d="M${rx + 150},${CT - 6} q0,-62 44,-62 q44,0 44,62 Z" fill="#8AD3CC"/><path d="M${rx + 236},${CT - 36} q30,-8 34,-30" stroke="#8AD3CC" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M${rx + 168},${CT - 62} q26,-36 52,0" stroke="#16191D" stroke-width="7" fill="none"/>` + MAT.smoke(rx + 270, CT - 70, t, {col: 'F4EFE6', k: 0.4, n: 5, rise: 150, drift: 30, seed: 52})); }
  // the table: laid for six under a gingham cloth, chrome chairs with padded backs, flowers
  const TT = G - 236, tx0 = 1890, tx1 = 2500;
  // chairs on the far side of the table: padded backs above the top, chrome legs down to the floor below the cloth (on the floor line
  // G - 14, a little behind the table's own legs)
  for (const cx of [2010, 2200, 2390]) s.push(`<rect x="${cx - 40}" y="${TT}" width="8" height="${G - 14 - TT}" fill="url(#tgchrome)"/><rect x="${cx + 32}" y="${TT}" width="8" height="${G - 14 - TT}" fill="url(#tgchrome)"/><ellipse cx="${cx - 36}" cy="${G - 14}" rx="9" ry="3" fill="#000" opacity="0.15"/><ellipse cx="${cx + 36}" cy="${G - 14}" rx="9" ry="3" fill="#000" opacity="0.15"/>`);
  for (const cx of [2010, 2200, 2390]) s.push(`<rect x="${cx - 46}" y="${TT - 150}" width="92" height="96" rx="20" fill="#F29A8A"/><rect x="${cx - 46}" y="${TT - 150}" width="92" height="96" rx="20" fill="none" stroke="#D97A6A" stroke-width="3"/><rect x="${cx - 40}" y="${TT - 60}" width="8" height="60" fill="url(#tgchrome)"/><rect x="${cx + 32}" y="${TT - 60}" width="8" height="60" fill="url(#tgchrome)"/>`);
  s.push(MAT.shadow((tx0 + tx1) / 2, G + 10, 330, 0.2) + `<rect x="${tx0 + 50}" y="${TT}" width="12" height="${G - TT}" fill="url(#tgchrome)"/><rect x="${tx1 - 62}" y="${TT}" width="12" height="${G - TT}" fill="url(#tgchrome)"/>` +
    `<path d="M${tx0 - 14},${TT} L${tx1 + 14},${TT} L${tx1 + 14},${TT + 92} ` + [...Array(11)].map(() => `q-${f1((tx1 - tx0 + 28) / 22)},18 -${f1((tx1 - tx0 + 28) / 11)},0`).join(' ') + ` Z" fill="url(#tggingham)" stroke="#E2B93C" stroke-width="2"/><rect x="${tx0 - 18}" y="${TT - 6}" width="${tx1 - tx0 + 36}" height="12" rx="5" fill="#FFFDF2"/>`);
  for (const px of [2120, 2260, 2400]) s.push(`<ellipse cx="${px}" cy="${TT - 12}" rx="44" ry="6" fill="#FFFFFF" stroke="#9EC4E8" stroke-width="2.5"/><path d="M${px + 52},${TT - 6} l4,-40 l20,0 l4,40 Z" fill="#DDF0F2" opacity="0.85"/>`);
  s.push(`<path d="M2440,${TT - 6} l-10,-58 l44,0 l-10,58 Z" fill="#9EC4E8"/>` + [[-16, -92, '#F2C94C'], [12, -104, '#FFFFFF'], [34, -86, '#F2C94C'], [-2, -80, '#FFFFFF'], [16, -74, '#6FB25E']].map(([dx, dy, col]) => `<circle cx="${2452 + dx}" cy="${TT + dy}" r="15" fill="${col}"/>`).join(''));
  // the hostess: full skirt, apron, hair set. A hand-crank opener is clamped on the can's rim: her back hand squeezes its handles,
  // her front hand turns the butterfly key on top (seen side on, the key's ends swing left and right). Then she lets go, turns, takes
  // the casserole off its trivet by its two ear handles, walks it to the table (a whole number of steps), leans in with her feet
  // planted, sets it down, lets go and steps back. Feet by IK throughout; hands by IK on the key, the handles and the ears.
  const pu = smooth(K5.pick[0], K5.pick[1], t), wu = smooth(K5.walk[0], K5.walk[1], t), su = smooth(K5.set[0], K5.set[1], t), bu = smooth(K5.back[0], K5.back[1], t);
  const turned = t >= K5.turn, hx0 = K5.x0, w = t * TAU * 1.25, crank = t > K5.crank[0] && t < K5.crank[1] ? 1 : 0, off = smooth(K5.crank[1], K5.turn, t), gH = G + 30;
  const CW = 108, ear = (cx, cy, k) => [cx + k * (0.62 * CW + 3), cy - 0.3 * CW * 0.74], CX0 = hx0 + 0.23 * H, dist = tgWalkDist(K5.x1 - hx0, H, 13), CX1 = hx0 + dist + 0.23 * H + 0.02 * H;
  const H0 = {kind: 'woman', hat: 'set50', wear: ['fullskirt', 'apron'], h: H, fill: K5C.ink, det: 0, paleOp: 0.96, tones: {tone: '#2E403D', lite: '#FFFDF2'}};
  let ho;
  if (!turned) { const o = {...H0, x: hx0, y: gH, d: -1, an: {...POSES.stand(t, 0.2), bob: 0, lean: 4, tilt: -14, shear: true}}; ho = TGK.plant(o, [[hx0 - 0.05 * H, gH], [hx0 + 0.06 * H, gH]], 'hostess.counter'); }
  else { const ws = tgWalkSettle({...H0}, hx0, 1, dist, wu, smooth(K5.walk[1], K5.walk[1] + 0.3, t), gH, 'hostess', {stride: 13, carry: true, an: {tilt: -6}});
    ho = ws.o;
    if (wu <= 0 || wu >= 1) { // standing: at the counter (picking up) or at the table (setting down, then stepping back)
      const atTable = wu >= 1, f = atTable ? (ws.cur || ws.feet).map((q) => [...q]) : [[hx0 + 0.06 * H, gH], [hx0 - 0.05 * H, gH]], back = f[0][0] < f[1][0] ? 0 : 1;
      const ub = smooth(K5.back[0], K5.back[0] + 0.35, t), uf = smooth(K5.back[0] + 0.35, K5.back[1], t), sb = 0.08 * H, lift = (u) => 0.03 * H * Math.sin(Math.PI * u);
      if (atTable) { f[back][0] -= sb * ease(ub); f[1 - back][0] -= sb * ease(uf); f[back][1] -= lift(ub); f[1 - back][1] -= lift(uf); }
      const lean = atTable ? 3 + 9 * su * (1 - bu) : 3 + 5 * pu * (1 - pu) * 4 * 0.5;
      const body = {...ho, x: (f[0][0] + f[1][0]) / 2 + 0.008 * H, an: {...ho.an, ...POSES.stand(t, 0.2), bob: 0, lean, tilt: -6 - 10 * (atTable ? su * (1 - bu) : pu), shear: true}};
      ho = tgLegs(body, f); [0, 1].forEach((i) => { const p = E3K.foot(ho, i), mv = (atTable && ((i === back && ub > 0 && ub < 1) || (i !== back && uf > 0 && uf < 1))) || (atTable && ws.moving === i);
        TGK.log(mv ? 'swing' : 'foot', 'hostess.stand.' + i, f[i], p); TGK.log('sole', 'hostess.stand.' + i, [p[0], gH], p, {gy: gH}); }); } }
  // the opener and the hands on it
  const key = [canX + 26, CT - 90], kx = Math.cos(w) * 15 * crank;
  if (!turned) {
    const kf = [key[0] + kx, key[1] - 4], hb = [canX + 84, CT - 63];
    // the near hand squeezes the handles (low, nearest her); the far hand reaches over to turn the key (so neither hides the other)
    if (off < 1 && crank) { ho = TGK.reach(ho, 'b', kf[0], kf[1], 'hostess.b.key'); ho = TGK.reach(ho, 'f', hb[0], hb[1], 'hostess.f.handles'); }
    else { const e = ease(off); ho = TGK.reach(ho, 'b', lerp(kf[0], hx0 + 0.02 * H, e), lerp(kf[1], gH - 0.46 * H, e), 'hostess.b.off', false, 'move'); ho = TGK.reach(ho, 'f', lerp(hb[0], hx0 - 0.08 * H, e), lerp(hb[1], gH - 0.47 * H, e), 'hostess.f.off', false, 'move'); }
    s.push(`<rect x="${canX + 10}" y="${CT - 80}" width="32" height="24" rx="5" fill="#5A6468"/><rect x="${canX + 13}" y="${CT - 77}" width="26" height="9" rx="3" fill="url(#tgchrome)"/><rect x="${canX + 6}" y="${CT - 68}" width="10" height="14" rx="2" fill="#3E474B"/>` + // the body, its clamp over the rim
      line([[canX + 38, CT - 68], [canX + 98, CT - 61]], '#3E474B', 8) + line([[canX + 38, CT - 74], [canX + 98, CT - 69]], '#B9C6CC', 7) + // the two handles, squeezed together
      `<rect x="${key[0] - 3}" y="${key[1]}" width="6" height="10" fill="#3E474B"/><rect x="${f1(key[0] - Math.abs(kx) - 9)}" y="${key[1] - 7}" width="${f1(2 * Math.abs(kx) + 18)}" height="10" rx="5" fill="url(#tgchrome)" stroke="#3E474B" stroke-width="2"/>`);
    TGK.rest('opener.on.rim', canX + 26, CT - 64, CT - 64); }
  // the casserole: on its trivet (bottom on the trivet's top, CT - 8); lifted by the ears to a carry height; set on the table top (TT - 6)
  const carryY = gH - 0.66 * H, pick = [lerp(CX0, ho.x + 0.23 * H, pu), lerp(CT - 8, carryY, pu)], cxc = turned ? (wu > 0 ? ho.x + 0.23 * H : pick[0]) : CX0, cyc = turned ? (wu > 0 ? carryY : pick[1]) : CT - 8;
  const fx = lerp(cxc, CX1, su), fy = lerp(cyc, TT - 6, su), holding = turned && bu === 0;
  if (turned) { const eF = ear(fx, fy, 1), eB = ear(fx, fy, -1);
    if (holding) { ho = TGK.reach(ho, 'f', eF[0], eF[1], 'hostess.f.ear'); ho = TGK.reach(ho, 'b', eB[0], eB[1], 'hostess.b.ear'); }
    else { const e = ease(bu); ho = TGK.reach(ho, 'f', lerp(eF[0], ho.x + 0.08 * H, e), lerp(eF[1], gH - 0.47 * H, e), 'hostess.f.let', false, 'move'); ho = TGK.reach(ho, 'b', lerp(eB[0], ho.x - 0.02 * H, e), lerp(eB[1], gH - 0.46 * H, e), 'hostess.b.let', false, 'move'); } }
  if (!turned || pu === 0) TGK.rest('casserole.counter', fx, fy, CT - 8); if (su >= 1) TGK.rest('casserole.table', fx, fy, TT - 6);
  for (const cx of [2010, 2200, 2390]) TGK.rest('chair' + cx, cx, G - 14, G - 14); for (const px of [2120, 2260, 2400]) TGK.rest('plate' + px, px, TT - 6, TT - 6);
  // (drawn over her: carried in front of her, its ear handles stick out past her hands, which grip them from outside)
  s.push(`<rect x="${CX0 - 66}" y="${CT - 8}" width="132" height="8" rx="3" fill="#B98A56"/>` + (su >= 1 ? `<ellipse cx="${f1(fx)}" cy="${TT - 5}" rx="${CW * 0.4}" ry="3" fill="#000" opacity="0.18"/>` : ''));
  s.push(MAT.shadow(ho.x, G + 34, 120, 0.22) + figure(ho) + tgCasserole(fx, fy, CW, t, 0.6 + 0.4 * su));
  // foreground (1.3): the back of a kitchen chair and a house plant, soft
  const fore = `<g filter="url(#tgblur)" opacity="0.95"><rect x="-260" y="${G - 170}" width="200" height="190" rx="40" fill="#1E4A4C"/><rect x="-250" y="${G + 20}" width="14" height="400" fill="#1E4A4C"/><rect x="-84" y="${G + 20}" width="14" height="400" fill="#1E4A4C"/>` +
    [-3, -2, -1, 0, 1, 2, 3].map((k) => `<path d="M3080,${G + 220} Q${3080 + k * 60},${G - 150} ${3080 + k * 130},${G - 40 + Math.abs(k) * 40}" stroke="#1E4A4C" stroke-width="30" fill="none" stroke-linecap="round"/>`).join('') + `</g>`;
  const world = layerAt(c, 0.92, back.join('')) + layerAt(c, 1, s.join(''));
  const scr = quiet ? '' : tag(172, 150, 'A KITCHEN · 1955', smooth(0.3, 0.9, t));
  return frame(tgDefsB(t), `<rect width="1920" height="1080" fill="${K5C.wall}"/>`, world, scr, t).replace('opacity="0.13" style="mix-blend-mode:overlay"', 'opacity="0.09" style="mix-blend-mode:overlay"');
}
const tgFiftiesCam = (t) => { const p = smooth(5.7, 10.3, t), u = ease(t / K5.sec); return {z: lerpLog(1.2, 1.02, p) * (1 + 0.03 * u), ux: 1030 + 40 * u + 560 * p, uy: 566 + 10 * p}; };
Object.assign(CLIPS, {tg_1950s_kitchen: {sec: K5.sec, render: (t) => renderTgFifties({t, cam: tgFiftiesCam(t), quiet: true})}});
if (typeof window !== 'undefined') Object.assign(window, {renderTgFifties});
