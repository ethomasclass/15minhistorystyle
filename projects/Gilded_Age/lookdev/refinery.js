// The refinery: Havemeyers & Elder on the Williamsburg waterfront, Brooklyn, 1880s. Michael Kelly's workplace for the whole series.
// Built with rig.js and explainers.js (load them first). Cut through like the tenement, so every floor shows.
//
// The sugar's path, which the camera follows (the moving cream stream is the sugar):
//   1 raw sugar arrives by ship at the wharf; 2 it's melted in hot water on the ground floor; 3 the syrup is pumped to the top of
//   the building; 4 it runs down through cloth bag filters; 5 then through tall bone-char filters that bleach it (the cylinders
//   stood 20 to 25 feet high); 6 it's boiled in vacuum pans until crystals form; 7 centrifugals spin the crystals dry (Michael's
//   floor); 8 the sugar is packed into barrels for the ships and trains.
// Sources: a period refining text (melting on the ground floor; bag filters; bone-black filters; the char cylinders' size), the
// Skyscraper Museum on Havemeyers & Elder's "vertical production process." The exact floor order varied by refinery; this is the
// usual sequence, simplified. The work: hot, about 1,000 men at Havemeyers & Elder in 1884, shifts of ten hours or more.

const RF = {x0: 300, x1: 1560, wall: 16, F: [1040, 880, 720, 560, 400, 240, 80]}; // floor surfaces: ground .. roof
const RFC = {room: '#1C3230', dark: '#0F1C1B', mach: '#0B1615', pipe: '#081110', sugar: '#F4EFE6', glass: '#5F857F'};

function rfWalls() { // the cut: floors, walls with tall factory windows, the roof monitor
  const s = [], c = '#050808', F = RF.F;
  for (const y of [F[1], F[2], F[3], F[5], F[6]]) s.push(`<rect x="${RF.x0}" y="${y}" width="${RF.x1 - RF.x0}" height="12" fill="${c}"/>`);
  s.push(`<rect x="${RF.x0}" y="${F[0]}" width="${RF.x1 - RF.x0}" height="40" fill="${c}"/>`);
  s.push(`<rect x="${RF.x0 + 40}" y="${F[4]}" width="${RF.x1 - RF.x0 - 80}" height="8" fill="${c}"/><rect x="${RF.x0 + 40}" y="${F[4] - 34}" width="${RF.x1 - RF.x0 - 80}" height="3" fill="${c}"/>`); // a catwalk between the char filters, with a rail
  for (let x = RF.x0 + 40; x < RF.x1 - 40; x += 40) s.push(`<rect x="${x}" y="${F[4] - 34}" width="3" height="34" fill="${c}"/>`);
  for (const [x0, x1] of [[RF.x0, RF.x0 + RF.wall], [RF.x1 - RF.wall, RF.x1]]) {
    let y = F[6] - 30;
    for (let k = 5; k >= 0; k--) { const top = F[k + 1] + 34, bot = F[k] - 30; if (k === 4) continue; s.push(`<rect x="${x0}" y="${y}" width="${RF.wall}" height="${top - y}" fill="${c}"/>`); y = bot; }
    s.push(`<rect x="${x0}" y="${y}" width="${RF.wall}" height="${F[0] + 40 - y}" fill="${c}"/>`);
  }
  s.push(`<path d="M${RF.x0 - 20},${F[6]} L${RF.x0 + 420},${F[6] - 60} L${RF.x1 - 420},${F[6] - 60} L${RF.x1 + 20},${F[6]} Z" fill="${c}"/><rect x="${RF.x0 + 480}" y="${F[6] - 100}" width="${RF.x1 - RF.x0 - 960}" height="40" fill="${c}"/>`);
  return s.join('');
}
function rfRooms(t) { // interiors: brick walls, plank floors, daylight falling in from the windows
  const s = [], F = RF.F;
  s.push(`<rect x="${RF.x0}" y="${F[6]}" width="${RF.x1 - RF.x0}" height="${F[0] - F[6]}" fill="${RFC.room}"/>`);
  s.push(MAT.brick(RF.x0, F[6], RF.x1 - RF.x0, F[0] - F[6], {base: RFC.room, seed: 201, vary: 0.28, soot: 'top'}));
  for (let k = 0; k < 6; k++) { if (k === 4) continue; const top = F[k + 1] + 34, bot = F[k] - 30;
    for (const [x, dir] of [[RF.x0 + RF.wall, 1], [RF.x1 - RF.wall, -1]]) s.push(`<path d="M${x},${top} L${x},${bot} L${x + dir * 260},${F[k]} L${x + dir * 120},${F[k]} Z" fill="#F4EFE6" opacity="0.06"/>`); }
  for (let k = 0; k < 6; k++) if (k !== 4) s.push(MAT.planks(RF.x0, F[k] - 5, RF.x1 - RF.x0, 5, {base: '#152422', seed: 210 + k, size: 46, vertical: true}));
  return s.join('');
}
function rfWindowsOut() { // what's outside the windows: the sky, lit
  const s = [], F = RF.F;
  for (let k = 0; k < 6; k++) { if (k === 4) continue; const top = F[k + 1] + 34, bot = F[k] - 30;
    for (const x of [RF.x0, RF.x1 - RF.wall]) s.push(`<rect x="${x}" y="${top}" width="${RF.wall}" height="${bot - top}" fill="${RFC.glass}" opacity="0.7"/><rect x="${x}" y="${(top + bot) / 2 - 1}" width="${RF.wall}" height="2" fill="#050808"/>`); }
  return s.join('');
}
// pipes carry the syrup; a cream dash running along them is the sugar moving
const rfPipe = (d, t, w = 10, speed = 70) => `<path d="${d}" fill="none" stroke="${RFC.pipe}" stroke-width="${w}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${RFC.sugar}" stroke-width="${w * 0.4}" stroke-dasharray="16 8" stroke-dashoffset="${f1(-t * speed)}" opacity="0.85" stroke-linejoin="round"/>`;

function rfMachines(t) {
  const s = [], F = RF.F, c = RFC.mach;
  // 2: melting tanks on the ground floor, steaming
  for (const x of [1150, 1320]) { s.push(MAT.iron(x, F[0] - 110, 140, 110, {base: c, rx: 10, seams: 36}) + `<rect x="${x - 6}" y="${F[0] - 116}" width="152" height="10" fill="${c}"/>` + smoke(x + 70, F[0] - 130, t + x, '#5F857F', 0.5, 4)); }
  // the pump and the riser to the top
  s.push(`<rect x="1470" y="${F[0] - 60}" width="50" height="60" fill="${c}"/><circle cx="1495" cy="${F[0] - 70}" r="22" fill="none" stroke="${c}" stroke-width="7"/><line x1="1495" y1="${F[0] - 70}" x2="${f1(1495 + 20 * Math.cos(t * 6))}" y2="${f1(F[0] - 70 + 20 * Math.sin(t * 6))}" stroke="${c}" stroke-width="5"/>`);
  s.push(rfPipe(`M1290,${F[0] - 60} L1495,${F[0] - 60} L1520,${F[0] - 60} L1520,${F[6] + 60} L1420,${F[6] + 60}`, t, 14, 110));
  // 4: top floor: a syrup tank and rows of cloth bag filters dripping
  s.push(MAT.iron(1220, F[6] + 30, 200, 110, {base: c, rx: 12, seams: 36}));
  s.push(rfPipe(`M1220,${F[6] + 110} L1120,${F[6] + 110} L1120,${F[6] + 40} L430,${F[6] + 40}`, t, 10));
  for (let x = 450; x < 1100; x += 34) { const sw = 1.5 * Math.sin(t * 2 + x); s.push(`<rect x="${f1(x + sw)}" y="${F[6] + 48}" width="20" height="120" rx="6" fill="#DFE0D6" opacity="0.38"/>`); const dp = ((t * 0.9 + x * 0.013) % 1); s.push(`<circle cx="${f1(x + 10)}" cy="${f1(F[6] + 170 + dp * 40)}" r="2" fill="${RFC.sugar}" opacity="${f1(0.8 * (1 - dp))}"/>`); }
  s.push(`<rect x="430" y="${F[5] - 20}" width="700" height="12" fill="${c}"/>`); // the trough under the bags
  s.push(rfPipe(`M440,${F[5] - 14} L370,${F[5] - 14} L370,${F[4] - 150}`, t, 10));
  // 5: the bone-char filters: tall iron cylinders through two floors
  for (let i = 0; i < 6; i++) { const x = 420 + i * 170; s.push(MAT.iron(x, F[5] + 26, 110, F[3] - F[5] - 26, {base: c, rx: 18, seams: 44}) + `<ellipse cx="${x + 55}" cy="${F[5] + 26}" rx="55" ry="10" fill="#132423"/>`); }
  s.push(rfPipe(`M370,${F[4] - 150} L370,${F[5] + 20} L1440,${F[5] + 20}`, t, 8));
  s.push(rfPipe(`M480,${F[3] - 6} L1440,${F[3] - 6}`, t, 8));
  // 6: vacuum pans: big domed vessels with gauges and a glowing sight glass
  for (let i = 0; i < 3; i++) { const x = 470 + i * 320, y = F[2];
    s.push(`<path d="M${x},${y - 20} L${x},${y - 90} Q${x},${y - 150} ${x + 100},${y - 150} Q${x + 200},${y - 150} ${x + 200},${y - 90} L${x + 200},${y - 20} Z" fill="${c}"/><path d="M${x},${y - 90} Q${x},${y - 150} ${x + 100},${y - 150} Q${x + 200},${y - 150} ${x + 200},${y - 90} L${x + 200},${y - 20} L${x},${y - 20} Z" fill="url(#matIronH)"/>`);
    s.push(`<rect x="${x + 20}" y="${y - 20}" width="10" height="20" fill="${c}"/><rect x="${x + 170}" y="${y - 20}" width="10" height="20" fill="${c}"/><rect x="${x + 90}" y="${y - 175}" width="20" height="26" fill="${c}"/>`);
    s.push(`<circle cx="${x + 150}" cy="${y - 80}" r="12" fill="#DFE0D6" opacity="0.5"/><line x1="${x + 150}" y1="${y - 80}" x2="${f1(x + 150 + 9 * Math.cos(t * 0.8 + i))}" y2="${f1(y - 80 + 9 * Math.sin(t * 0.8 + i))}" stroke="#111" stroke-width="2"/><ellipse cx="${x + 60}" cy="${y - 70}" rx="14" ry="9" fill="${RFC.sugar}" opacity="${f1(0.55 + 0.15 * Math.sin(t * 3 + i))}"/>`);
    s.push(smoke(x + 100, y - 180, t + i * 2, '#5F857F', 0.45, 3)); }
  s.push(rfPipe(`M1440,${F[3] - 6} L1460,${F[3] - 6} L1460,${F[2] - 160} L1370,${F[2] - 160}`, t, 8));
  s.push(rfPipe(`M480,${F[2] - 40} L400,${F[2] - 40} L400,${F[1] - 110} L1300,${F[1] - 110}`, t, 8));
  // 7: centrifugals: drums spinning on legs, crystals flung out
  for (let i = 0; i < 5; i++) { const x = 470 + i * 190, y = F[1], a = t * 14 + i;
    s.push(`<rect x="${x}" y="${y - 70}" width="120" height="50" rx="8" fill="${c}"/><rect x="${x + 10}" y="${y - 20}" width="10" height="20" fill="${c}"/><rect x="${x + 100}" y="${y - 20}" width="10" height="20" fill="${c}"/><rect x="${x + 50}" y="${y - 96}" width="20" height="26" fill="${c}"/>`);
    for (let k = 0; k < 4; k++) { const aa = a + k * Math.PI / 2; s.push(`<line x1="${f1(x + 60 + 40 * Math.cos(aa))}" y1="${y - 52}" x2="${f1(x + 60 + 40 * Math.cos(aa + 0.4))}" y2="${y - 38}" stroke="#2B4744" stroke-width="3"/>`); }
    for (let k = 0; k < 6; k++) { const p = ((t * 1.6 + k / 6 + i * 0.3) % 1); s.push(`<circle cx="${f1(x + 60 + (k % 2 ? 1 : -1) * (40 + p * 30))}" cy="${f1(y - 60 - p * 20 + p * p * 30)}" r="1.8" fill="${RFC.sugar}" opacity="${f1(0.8 * (1 - p))}"/>`); } }
  // 8: the chute down to packing: barrels on the ground floor, rolled out to the wharf
  s.push(rfPipe(`M440,${F[1] - 20} L380,${F[1] + 40} L380,${F[0] - 120}`, t, 12, 50));
  for (let k = 0; k < 7; k++) s.push(FU.barrel(400 + k * 40, F[0], 30, 40));
  for (let k = 0; k < 5; k++) s.push(FU.barrel(420 + k * 40, F[0] - 40, 30, 40));
  return s.join('');
}

function rfPeople(t, z) {
  const s = [], F = RF.F, lit = (h) => lodFor(h * z, 0.75), rim = {c: '#DFE0D6', a: 0.75, dx: -0.008, dy: -0.003};
  const W = (o) => { const L = lit(o.h || 75); s.push(figure({fill: '#0D0C09', kind: 'man', hat: 'none', coat: 'vest', h: 75, ...o, det: Math.min(L.det, 0.6), rim: {...rim, a: L.rimA}})); };
  W({x: 1180, y: F[0], d: -1, an: {...POSES.stand(t, 0.2), fArm: [40, 10], tilt: -6}}); // tipping a sack into the melter
  s.push(`<path d="M1170,${F[0] - 150} q20,-16 40,0 l-4,26 l-32,0 Z" fill="#DFE0D6" opacity="0.6"/>`);
  W({x: 600, y: F[5], d: 1, an: POSES.iron(t, 0.5)}); // tending the bag filters
  for (const [x, ph] of [[560, 0.1], [900, 0.6], [1240, 0.3]]) W({x, y: F[4], d: ph > 0.4 ? -1 : 1, prop: 'hammer', an: POSES.hammer(t, ph)}); // shovelling char
  W({x: 860, y: F[2], d: -1, an: {...POSES.stand(t, 0.4), fArm: [70, 60], tilt: 12}}); // the pan boiler watching his gauge
  for (const [x, ph] of [[620, 0.2], [1000, 0.7], [1180, 0.4]]) W({x, y: F[1], d: 1, an: POSES.iron(t, ph)}); // loading the centrifugals
  // Michael: the coral one, at the second centrifugal, loading, then wiping his brow in the heat
  const wipe = smooth(11.6, 12.0, t) * (1 - smooth(12.8, 13.2, t));
  const L = lit(75 * 1.0);
  s.push(figure({...cast('michael', {x: 810, y: F[1], h: 75, d: 1}), coat: 'vest', hat: 'cap', det: L.det, rim: {...rim, a: L.rimA},
    an: wipe > 0.5 ? {...POSES.stand(t, 0.3), fArm: [20, -40], tilt: 8, expr: 'set', blink: t > 12.3 && t < 12.45} : {...POSES.iron(t, 0.9), expr: 'set'}}));
  for (const [x, ph] of [[480, 0.3], [640, 0.8]]) W({x, y: F[0], d: 1, prop: 'hammer', an: POSES.hammer(t, ph)}); // closing barrels
  // the wharf: men carrying sacks off the ship, along the plank
  for (let k = 0; k < 3; k++) { const u = ((t / 7 + k / 3) % 1), x = 2040 - u * 380; W({x, y: F[0], d: -1, an: {...walkAn(walkPhase(u * 380, 75)), fArm: [20, 0]}}); s.push(`<path d="M${f1(x - 18)},${F[0] - 92} q18,-14 36,0 l-4,20 l-28,0 Z" fill="#DFE0D6" opacity="0.55"/>`); }
  return s.join('');
}

function rfOutside(t) { // the wharf, a ship unloading by hoist, the river
  const s = [], F = RF.F, c = '#0D0C09';
  s.push(MAT.water(RF.x1, F[0] + 16, 1600, 2000, t, {top: '#3E5F5A', bottom: '#0C1716', seed: 221, n: 70}) + MAT.planks(RF.x1, F[0], 1600, 16, {base: '#0B1413', seed: 222, size: 30, vertical: true}));
  const bob = 3 * Math.sin(TAU * t / 4), sx = 1980;
  s.push(`<g transform="translate(0,${f1(bob)})"><clipPath id="rfhull"><path d="M${sx},${F[0] - 10} L${sx + 520},${F[0] - 10} L${sx + 490},${F[0] + 40} L${sx + 30},${F[0] + 40} Z"/></clipPath><g clip-path="url(#rfhull)">${MAT.planks(sx, F[0] - 10, 520, 50, {base: '#0D1211', seed: 223, size: 8})}</g>` +
    [100, 260, 420].map((mx, i) => `<rect x="${sx + mx}" y="${F[0] - 330 + i * 20}" width="7" height="${320 - i * 20}" fill="${c}"/><rect x="${sx + mx - 50}" y="${F[0] - 260 + i * 20}" width="107" height="7" fill="${c}"/>`).join('') + `</g>`);
  s.push(line([[sx + 100, F[0] - 320], [sx - 120, F[0] - 140]], c, 4)); // the hoist boom
  const hu = (t * 0.25) % 1, hx = sx + 60 - hu * 140, hy = F[0] - 150 + 40 * Math.sin(hu * Math.PI);
  s.push(line([[sx - 60, F[0] - 200], [hx, hy - 30]], c, 1.5) + `<path d="M${f1(hx - 20)},${f1(hy - 30)} l40,0 l-4,30 l-32,0 Z" fill="#DFE0D6" opacity="0.6"/>`);
  return s.join('');
}

function rfCity(c) { // across the river: Manhattan, low and smoky, in two depths
  return layerAt(c, 0.25, `<rect x="-2000" y="${RF.F[0] - 150}" width="8000" height="300" fill="#3E5F5A"/>` + (() => { const r = rng(5); let s2 = ''; for (let x = -1500; x < 4500;) { const w = 50 + r() * 110, h = 60 + r() * 200; s2 += `<rect x="${f1(x)}" y="${f1(RF.F[0] - 150 - h)}" width="${f1(w)}" height="${f1(h)}" fill="#3E5F5A"/>`; x += w; } return s2 + steeple(2600, RF.F[0] - 300, 30, 120, 160, '#3E5F5A'); })(), null) +
    layerAt(c, 0.5, (() => { const r = rng(6); let s2 = ''; for (let x = -1500; x < 4500;) { const w = 80 + r() * 160, h = 120 + r() * 260; s2 += `<rect x="${f1(x)}" y="${f1(RF.F[0] - 60 - h)}" width="${f1(w)}" height="${f1(h + 60)}" fill="#22403D"/><rect x="${f1(x + w * 0.4)}" y="${f1(RF.F[0] - 60 - h - 160)}" width="16" height="160" fill="#22403D"/>`; x += w + 40; } return s2; })(), null);
}

// The tour: a wide shot, then the camera follows the sugar stop by stop; labels name each step.
const RF_STOPS = [
  {t: 0.0, z: 0.78, ux: 1440, uy: 560, label: null},
  {t: 2.2, z: 2.0, ux: 1960, uy: 900, label: '1 · RAW SUGAR ARRIVES BY SHIP'},
  {t: 3.8, z: 2.2, ux: 1300, uy: 950, label: '2 · MELTED IN HOT WATER'},
  {t: 5.4, z: 1.5, ux: 1430, uy: 520, label: '3 · PUMPED TO THE TOP'},
  {t: 6.8, z: 2.0, ux: 800, uy: 170, label: '4 · STRAINED THROUGH CLOTH'},
  {t: 8.4, z: 1.45, ux: 900, uy: 400, label: '5 · BLEACHED IN BONE CHAR'},
  {t: 10.0, z: 2.0, ux: 900, uy: 620, label: '6 · BOILED IN VACUUM PANS'},
  {t: 11.4, z: 3.4, ux: 830, uy: 820, label: '7 · SPUN DRY (MICHAEL\'S FLOOR)'},
  {t: 13.6, z: 2.1, ux: 560, uy: 960, label: '8 · PACKED IN BARRELS'},
  {t: 15.2, z: 0.78, ux: 1440, uy: 560, label: null},
];
function rfCam(t) {
  let i = RF_STOPS.length - 1;
  for (let k = 0; k < RF_STOPS.length - 1; k++) if (t < RF_STOPS[k + 1].t) { i = k; break; }
  const a = RF_STOPS[i], b = RF_STOPS[Math.min(i + 1, RF_STOPS.length - 1)];
  if (a === b) return {...a, label: a.label, li: i};
  const span = b.t - a.t, move = Math.min(0.9, span * 0.5), u = ease(clamp01((t - (b.t - move)) / move));
  return {z: lerpLog(a.z, b.z, u), ux: a.ux + (b.ux - a.ux) * u, uy: a.uy + (b.uy - a.uy) * u, label: u < 0.5 ? a.label : b.label, li: u < 0.5 ? i : i + 1};
}
function renderRefinery(t) {
  const cm = rfCam(t), c = cam2(cm), world = [];
  world.push(rfCity(c));
  world.push(layerAt(c, 1, rfOutside(t), null));
  world.push(layerAt(c, 1, rfRooms(t) + rfWindowsOut(), null));
  world.push(layerAt(c, 1, rfMachines(t) + rfWalls() + `<rect x="${RF.x1 + 40}" y="${RF.F[6] - 260}" width="60" height="${RF.F[0] - RF.F[6] + 260}" fill="#050808"/>` + smoke(RF.x1 + 70, RF.F[6] - 270, t, '#3E5F5A', 1.2), null));
  world.push(layerAt(c, 1, rfPeople(t, c.z)));
  const scr = [];
  if (cm.label) scr.push(tag(60, 120, cm.label, 1));
  scr.push(tag(40, 1040, 'HAVEMEYERS & ELDER · WILLIAMSBURG, BROOKLYN · 1880s', 1));
  if (t > 11.9 && t < 13.5) scr.push(penS(1060, 400, 'hot work: ten hours or more', 34, -3));
  return frame(exDefs(t), `<rect width="1920" height="1080" fill="url(#exsky)"/>${clouds(t, 9)}`, world.join(''), scr.join(''), t);
}

Object.assign(CLIPS, {refinery_tour: {sec: 17, render: (t) => renderRefinery(t)}});
if (typeof window !== 'undefined') Object.assign(window, {renderRefinery});
