// "The weaver's son": Dunfermline, Scotland, the 1840s. Andrew Carnegie's father, William, weaves fine linen on a hand loom in
// the family's stone cottage. In 1847 a steam-powered weaving factory opens in the town, and the hand-loom trade collapses.
// Built with rig.js and explainers.js (load them first).
//
// One side-scroll: the cottage (left), the street, the factory (right). The camera starts at the loom, pans to the factory (power
// looms in rows, belts running down from a turning line shaft, a steam engine's flywheel), and comes back to the cottage, where the
// loom has stopped and the father sits idle beside his son. Real people with no photographs are solid silhouettes with no face
// detail, tagged "no photo" (the channel's rule); coral is kept for the Kellys.

const LM = {ground: 820, cot0: 120, cot1: 900, fac0: 2000, fac1: 3640};

function lmLoomFront(x, y, w, h, t, {running = true, scale = 1, col = '#1A2B29', pace = 1.1} = {}) {
  // a loom seen from the front: posts and beams, warp threads running down, the woven cloth growing, the beater, a shuttle
  // flying across between beats
  const s = [], c = col, ph = running ? (t * pace) % 1 : 0.15, beat = running ? Math.max(0, Math.sin(ph * TAU)) : 0;
  s.push(`<rect x="${x}" y="${y}" width="${8 * scale}" height="${h}" fill="${c}"/><rect x="${x + w - 8 * scale}" y="${y}" width="${8 * scale}" height="${h}" fill="${c}"/><rect x="${x - 6 * scale}" y="${y}" width="${w + 12 * scale}" height="${8 * scale}" fill="${c}"/>`);
  const wx0 = x + 14 * scale, wx1 = x + w - 14 * scale, wy0 = y + 14 * scale, wy1 = y + h * 0.72;
  let warp = ''; for (let xx = wx0; xx <= wx1; xx += 4 * scale) warp += `M${f1(xx)},${f1(wy0)} V${f1(wy1)}`;
  s.push(`<path d="${warp}" stroke="#DFE0D6" stroke-width="${f1(0.8 * scale)}" opacity="0.45"/>`);
  const cloth = wy1 - 8 * scale;
  s.push(`<rect x="${f1(wx0)}" y="${f1(cloth)}" width="${f1(wx1 - wx0)}" height="${f1(h * 0.1)}" fill="#DFE0D6" opacity="0.32"/>`); // the woven linen
  const by = y + h * 0.45 + beat * h * 0.18; // the beater swings down to pack each thread
  s.push(`<rect x="${f1(x + 4 * scale)}" y="${f1(by)}" width="${f1(w - 8 * scale)}" height="${f1(6 * scale)}" fill="${c}"/>`);
  if (running) { const u = (ph * 2) % 1, dir = Math.floor(ph * 2) % 2 ? -1 : 1, sx = dir > 0 ? wx0 + (wx1 - wx0) * u : wx1 - (wx1 - wx0) * u;
    s.push(`<path d="M${f1(sx - 9 * scale)},${f1(by - 4 * scale)} q${f1(9 * scale)},${f1(-5 * scale)} ${f1(18 * scale)},0 q${f1(-9 * scale)},${f1(5 * scale)} ${f1(-18 * scale)},0 Z" fill="#0B1211"/>`); }
  for (let k = 0; k < 2; k++) s.push(`<rect x="${f1(x + w * 0.3 + k * w * 0.25)}" y="${f1(y + h - 10 * scale - (running && k === Math.floor(ph * 2) % 2 ? 6 * scale : 0))}" width="${f1(w * 0.18)}" height="${f1(4 * scale)}" fill="${c}"/>`); // treadles
  return s.join('');
}

function lmCottage(t) {
  const s = [], G = LM.ground, x0 = LM.cot0, x1 = LM.cot1, top = G - 300;
  s.push(MAT.stone(x0, top, x1 - x0, 300, {base: '#1A2F2D', seed: 301, vary: 0.18}));                      // the back wall, rough stone
  s.push(`<rect x="${x0 + 470}" y="${G - 220}" width="90" height="110" fill="#5F857F" opacity="0.8"/><rect x="${x0 + 513}" y="${G - 220}" width="4" height="110" fill="#1A2B29"/><rect x="${x0 + 470}" y="${G - 167}" width="90" height="4" fill="#1A2B29"/>`); // a small window
  s.push(`<path d="M${x0 + 470},${G - 220} L${x0 + 560},${G - 220} L${x0 + 420},${G} L${x0 + 250},${G} Z" fill="#F4EFE6" opacity="0.07"/>`); // daylight across the floor
  for (let x = x0; x < x1; x += 130) s.push(MAT.planks(x, top, 18, 14, {base: '#0D1716', seed: x}));                   // roof beams, cut
  s.push(MAT.stone(x0, G, x1 - x0, 18, {base: '#1A2B29', seed: 302, bh: 9}));                    // a flagstone floor
  s.push(`<rect x="${x0 - 30}" y="${top - 30}" width="${x1 - x0 + 60}" height="34" fill="#050808"/><rect x="${x0 - 18}" y="${top - 30}" width="18" height="${330 + 18}" fill="#050808"/><rect x="${x1}" y="${top - 30}" width="18" height="${330 + 18}" fill="#050808"/>`); // the cut walls and roof
  s.push(`<path d="M${x0 - 50},${top - 30} L${(x0 + x1) / 2},${top - 150} L${x1 + 50},${top - 30} Z" fill="#050808"/><rect x="${x0 + 80}" y="${top - 160}" width="34" height="100" fill="#050808"/>`); // the roof and chimney
  s.push(MAT.smoke(x0 + 97, top - 166, t, {col: '5F857F', k: 0.7, seed: 31}));
  // the hearth, glowing
  s.push(MAT.stone(x0 + 30, G - 120, 120, 120, {base: '#1A2B29', seed: 303, bh: 14}) + `<rect x="${x0 + 55}" y="${G - 70}" width="70" height="70" fill="#060A0A"/><circle cx="${x0 + 90}" cy="${G - 30}" r="60" fill="url(#exglow)" opacity="${f1(0.5 + 0.1 * Math.sin(t * 7))}"/>`);
  return s.join('');
}
function lmCottageLife(t, z) {
  const s = [], G = LM.ground, stopped = t > 12.6, rim = {c: '#DFE0D6', a: 0.6, dx: -0.008, dy: -0.003};
  s.push(lmLoomFront(LM.cot0 + 300, G - 190, 200, 190, t, {running: !stopped}));
  // William Carnegie at the bench: working the beater, or, once the factory has taken his trade, sitting still
  const L = lodFor(78 * z, 0.6);
  s.push(FU.bench(LM.cot0 + 230, G, 60));
  s.push(figure({x: LM.cot0 + 262, y: G + 0.22 * 78, h: 78, d: 1, kind: 'man', hat: 'none', coat: 'vest', beard: true, fill: '#0D0C09', det: 0, rim: {...rim, a: L.rimA},
    an: stopped ? {...POSES.sit(t, 0.3), fArm: [160, 150], bArm: [165, 155], tilt: -18, lean: 6} : {...POSES.sit(t, 0.3), fArm: [96 + 14 * Math.max(0, Math.sin(t * 1.1 * TAU)), 84], tilt: -4}}));
  // Andrew, about 11, watching; at the end he stands close by his father
  const ax = stopped ? LM.cot0 + 312 : LM.cot0 + 600;
  s.push(figure({x: ax, y: G, h: 52, d: -1, kind: 'boy', hat: 'none', fill: '#0D0C09', det: 0, rim: {...rim, a: L.rimA}, an: stopped ? {...POSES.stand(t, 0.5), tilt: -8} : {...POSES.stand(t, 0.5), tilt: 4}}));
  // his mother, mending shoes by the hearth
  s.push(FU.chair(LM.cot0 + 180, G, 1));
  s.push(figure({x: LM.cot0 + 180, y: G + 0.22 * 70, h: 70, d: 1, kind: 'woman', hat: 'kerchief', wear: ['plain', 'apron'], fill: '#0D0C09', det: 0, rim: {...rim, a: L.rimA}, prop: 'needle', an: POSES.handsew(t, 0.2)}));
  return s.join('');
}

function lmStreet(t) {
  const s = [], G = LM.ground, r = rng(311);
  s.push(MAT.ground(LM.cot1, LM.fac0, G, {base: '#0D0C09', seed: 312, tufts: false}));
  for (let x = LM.cot1 + 60, i = 0; x < LM.fac0 - 120; i++) { const w = 150 + r() * 80, h = 140 + r() * 60;
    s.push(MAT.stone(x, G - h, w, h, {base: '#1D3634', seed: 320 + i}) + `<path d="M${x - 10},${G - h} L${x + w / 2},${G - h - 60} L${x + w + 10},${G - h} Z" fill="#0F1C1B"/>` +
      `<rect x="${f1(x + w * 0.2)}" y="${G - h + 30}" width="30" height="40" fill="#5F857F" opacity="0.6"/><rect x="${f1(x + w * 0.6)}" y="${G - 70}" width="34" height="70" fill="#081010"/>` +
      `<rect x="${f1(x + w * 0.75)}" y="${G - h - 70}" width="20" height="40" fill="#0F1C1B"/>` + MAT.smoke(x + w * 0.75 + 10, G - h - 76, t + i * 2, {col: '5F857F', k: 0.5, n: 5, seed: 330 + i}));
    x += w + 40; }
  for (let k = 0; k < 2; k++) { const u = ((t / 9 + k * 0.5) % 1), x = LM.cot1 + 60 + u * 900; s.push(figure({x, y: G, h: 74, d: 1, kind: k ? 'woman' : 'man', hat: k ? 'kerchief' : 'cap', wear: ['plain'], coat: 'sack', fill: '#0D0C09', an: walkAn(walkPhase(u * 900, 74))})); }
  return s.join('');
}

function lmFactory(t) { // brick walls, rows of power looms, belts from a turning line shaft, the engine and its flywheel
  const s = [], G = LM.ground, x0 = LM.fac0, x1 = LM.fac1, top = G - 340;
  s.push(MAT.brick(x0, top, x1 - x0, 340, {base: '#1C3230', seed: 341, vary: 0.3, soot: 'top'}));
  for (let x = x0 + 120; x < x1 - 300; x += 220) s.push(`<rect x="${x}" y="${top + 50}" width="70" height="120" rx="35" fill="#5F857F" opacity="0.55"/><rect x="${x + 33}" y="${top + 50}" width="4" height="120" fill="#1A2B29"/>`); // arched windows
  s.push(MAT.planks(x0, G, x1 - x0, 14, {base: '#152422', seed: 342, size: 60, vertical: true}));
  // the line shaft along the ceiling, turning, with a pulley over each loom
  const shY = top + 40;
  s.push(`<rect x="${x0 + 40}" y="${shY - 4}" width="${x1 - x0 - 300}" height="8" fill="#0B1615"/>`);
  for (let row = 0; row < 2; row++) for (let i = 0; i < 6; i++) {
    const back = row === 0, sc = back ? 0.62 : 0.85, lx = x0 + 90 + i * 210 + (back ? 60 : 0), ly = G - (back ? 40 : 0), lw = 150 * sc, lh = 150 * sc;
    const col = back ? '#1F3836' : '#14262A';
    s.push(lmLoomFront(lx, ly - lh, lw, lh, t + i * 0.13 + row * 0.07, {scale: sc, col, pace: 3.2}));
    const px = lx + lw - 10, belt = `M${px},${shY + 4} L${px},${ly - lh + 8}`;
    s.push(`<circle cx="${px}" cy="${shY}" r="${f1(12 * sc)}" fill="#0B1615"/><path d="${belt}" stroke="#0B1615" stroke-width="${f1(4 * sc)}"/><path d="${belt}" stroke="#2B4744" stroke-width="${f1(2 * sc)}" stroke-dasharray="6 8" stroke-dashoffset="${f1(-t * 160)}"/>`);
  }
  // women tending the looms
  for (let i = 0; i < 4; i++) s.push(figure({x: x0 + 70 + i * 420, y: G, h: 70, d: 1, kind: 'woman', hat: 'none', wear: ['plain', 'apron'], fill: '#0D0C09', an: {...POSES.stand(t, i * 0.2), fArm: [120 + 10 * Math.sin(t * 2 + i), 100], tilt: -8}}));
  // the steam engine: boiler with a glowing firebox, a cylinder, a crank, the flywheel and a belt up to the shaft
  const ex = x1 - 250, fy = G - 120, a = t * 3.4;
  s.push(MAT.iron(ex - 40, G - 90, 150, 90, {base: '#0B1615', rx: 30, seams: 30}) + `<rect x="${ex - 10}" y="${G - 46}" width="40" height="30" fill="#F4EFE6" opacity="${f1(0.45 + 0.15 * Math.sin(t * 8))}"/><circle cx="${ex + 10}" cy="${G - 30}" r="70" fill="url(#exglow)" opacity="0.5"/>`);
  let spokes = ''; for (let k = 0; k < 8; k++) spokes += `M${ex + 160},${fy} L${f1(ex + 160 + 82 * Math.cos(a + k * Math.PI / 4))},${f1(fy + 82 * Math.sin(a + k * Math.PI / 4))}`;
  s.push(`<circle cx="${ex + 160}" cy="${fy}" r="88" fill="none" stroke="#0B1615" stroke-width="12"/><path d="${spokes}" stroke="#0B1615" stroke-width="5"/><circle cx="${ex + 160}" cy="${fy}" r="12" fill="#0B1615"/>`);
  const cx = ex + 160 + 40 * Math.cos(a), cy = fy + 40 * Math.sin(a);
  s.push(line([[ex + 70, fy], [f1(cx), f1(cy)]], '#0B1615', 7) + MAT.iron(ex + 30, fy - 18, 50, 36, {base: '#0B1615', seams: 18, rivet: 5}));
  s.push(`<path d="M${ex + 160},${fy - 88} L${ex + 160},${shY}" stroke="#0B1615" stroke-width="5"/><path d="M${ex + 160},${fy - 88} L${ex + 160},${shY}" stroke="#2B4744" stroke-width="2" stroke-dasharray="6 8" stroke-dashoffset="${f1(-t * 200)}"/>`);
  // the cut walls, the roof, the chimney and its smoke
  s.push(`<rect x="${x0 - 18}" y="${top - 26}" width="18" height="${340 + 26}" fill="#050808"/><rect x="${x1}" y="${top - 26}" width="18" height="${340 + 26}" fill="#050808"/><path d="M${x0 - 40},${top} L${x0 + 200},${top - 80} L${x1 - 200},${top - 80} L${x1 + 40},${top} Z" fill="#050808"/>`);
  s.push(MAT.brick(x1 + 60, top - 330, 60, 330 + 340, {base: '#121F1E', seed: 343, bw: 16, bh: 8, soot: 'top'}) + MAT.smoke(x1 + 90, top - 340, t, {col: '3E5F5A', k: 1.5, n: 9, seed: 344}));
  return s.join('');
}

const LM_KEYS = [ // t, z, ux, uy
  [0.0, 2.8, 450, 715], [4.6, 2.9, 460, 715], [6.4, 1.15, 1450, 600], [7.8, 1.0, 2820, 600], [9.4, 1.7, 2640, 700],
  [10.8, 1.7, 3350, 660], [12.4, 1.1, 1800, 640], [13.4, 2.9, 380, 725], [18.0, 3.1, 370, 728],
];
function lmCam(t) {
  let k = LM_KEYS.length - 2;
  for (let i = 0; i < LM_KEYS.length - 1; i++) if (t < LM_KEYS[i + 1][0]) { k = i; break; }
  const [t0, z0, x0, y0] = LM_KEYS[k], [t1, z1, x1, y1] = LM_KEYS[k + 1], u = ease(clamp01((t - t0) / (t1 - t0)));
  return {z: lerpLog(z0, z1, u), ux: x0 + (x1 - x0) * u, uy: y0 + (y1 - y0) * u};
}
function renderLoom(t) {
  const c = cam2(lmCam(t)), world = [];
  world.push(layerAt(c, 0.3, farHills(3800, EX.far, LM.ground - 160, 13, 140, 18)));
  world.push(layerAt(c, 0.55, farHills(3800, EX.mid, LM.ground - 60, 14, 80, 28) + `<g transform="translate(1250,${LM.ground - 300})" fill="${EX.mid}"><rect x="0" y="0" width="60" height="240"/><path d="M-6,0 L30,-80 L66,0 Z"/><rect x="60" y="120" width="220" height="120"/><path d="M60,120 L170,60 L280,120 Z"/></g>`)); // the abbey on its hill
  const main = [`<rect x="-3000" y="${LM.ground}" width="12000" height="3000" fill="#0D0C09"/>`];
  { const [vx, , vw] = visibleRect(c, 1, 100); main.push(MAT.ground(Math.max(-2900, vx), vx + vw, LM.ground, {base: '#0D0C09', seed: 361})); }
  main.push(lmCottage(t), lmStreet(t), lmFactory(t), lmCottageLife(t, c.z));
  world.push(layerAt(c, 1, main.join('')));
  const scr = [], onCot = c.ux < 1100, onFac = c.ux > 2300;
  scr.push(tag(40, 1040, 'DUNFERMLINE, SCOTLAND · 1840s', 1));
  if (onCot) {
    if (t < 13) scr.push(tag(c.sx(LM.cot0 + 262) - 150, c.sy(LM.ground - 100) - 20, 'WILLIAM CARNEGIE · NO PHOTO', 1));
    scr.push(tag(c.sx(t > 12.6 ? LM.cot0 + 312 : LM.cot0 + 600) - 110, c.sy(LM.ground - 60) - 20, 'ANDREW, ABOUT 11', 1));
    if (t < 6) scr.push(penS(760, 220, 'a hand loom: one thread at a time', 30, -3));
  }
  if (onFac) scr.push(tag(60, 120, 'A STEAM-POWERED WEAVING FACTORY · 1847', 1));
  if (onFac && t > 9.2) scr.push(penS(980, 260, 'machines that never stop', 34, -3));
  if (t > 14.2) scr.push(penS(760, 230, "a machine took his father's trade", 38, -3));
  return frame(exDefs(t), `<rect width="1920" height="1080" fill="url(#exsky)"/>${clouds(t, 13)}`, world.join(''), scr.join(''), t);
}

Object.assign(CLIPS, {loom_weaver: {sec: 18, render: (t) => renderLoom(t)}});
if (typeof window !== 'undefined') Object.assign(window, {renderLoom});
