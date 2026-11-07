// Brooklyn Bridge, opening day (May 24, 1883): a side-scrolling silhouette scene drawn entirely in code.
// No AI images. Every element (sky, skyline, bridge, boats, pier, crowd, Michael Kelly) is an SVG shape built here, so the
// scene is consistent, editable and animated. Each layer has its own parallax factor, so a camera pan (`cx`) and push (`zoom`)
// slide and scale the planes at different rates.
//
// Version 2 (Nov 7, 2026): the scene lives. renderScene({look, t, cx, zoom, fx, fy}) draws time `t` in seconds.
// - Characters idle (breathe, shift weight, glance), and some cheer, wave hats, point or hop. Drawn motion steps at
//   12 drawings a second (the channel's rule); the camera and mist glide.
// - The environment moves: flags ripple, bunting sways, boats bob, ferry smoke drifts, gulls cross, mist drifts, the river
//   shimmers, and at night the fireworks launch, burst and fall.
// - Detail follows the camera: a figure small on screen is one solid shape; bigger, it gains a rim of light on the lit side;
//   in a close-up it gains interior detail (collar, lapel, buttons, hat band, hair, ear, an eye that blinks).

/* ---------- looks ---------- */
const LOOKS = {
  // 1. The channel's locked silhouette palette (visual-style.md 2.6): ink, teal-slate haze, cream light, coral subject.
  dusk: {
    sky: [['0', '#111B1B'], ['0.45', '#1C3332'], ['0.78', '#5F857F'], ['1', '#A3BAB2']],
    glow: {x: 260, y: 760, r: 900, c: '#F4EFE6', a: 0.55}, sun: null,
    far: '#6E918A', bridge: '#22403D', boats: '#162927', fg: '#0D0C09', accent: '#FF6F61',
    water: [['0', '#4E726C'], ['0.25', '#2B4A47'], ['1', '#111B1B']], streak: '#DFE0D6',
    mist: '#A3BAB2', mistA: 0.32, grain: 0.13, windows: null, fireworks: false, stars: false, flat: false, paper: false, gulls: true,
    tone: '#2E403D', lite: '#5C7772', rim: {c: '#DFE0D6', a: 0.8, dx: -0.009, dy: -0.002},
  },
  // 2. Same palette, opening night: the fireworks are the one light source.
  night: {
    sky: [['0', '#060A0A'], ['0.55', '#0E1716'], ['0.85', '#1C3332'], ['1', '#2B4744']],
    glow: {x: 820, y: 330, r: 760, c: '#DFE0D6', a: 0.22}, sun: null,
    far: '#1F3735', bridge: '#0F1B1A', boats: '#0C1514', fg: '#070807', accent: '#FF6F61',
    water: [['0', '#1C3332'], ['0.3', '#111B1B'], ['1', '#070C0C']], streak: null,
    mist: '#5F857F', mistA: 0.18, smoke: '#2B4744', grain: 0.13, windows: '#F4EFE6', fireworks: true, stars: true, flat: false, paper: false, gulls: false,
    tone: '#223230', lite: '#4A625E', rim: {c: '#F4EFE6', a: 0.9, dx: -0.007, dy: -0.007},
  },
  // Retired after the first round (kept so the earlier frames can be rebuilt): flat poster, gaslight, cut paper.
  flat: {
    sky: [['0', '#1C3332'], ['0.42', '#1C3332'], ['0.42', '#335652'], ['0.64', '#335652'], ['0.64', '#5F857F'], ['0.8', '#5F857F'], ['0.8', '#A3BAB2'], ['1', '#A3BAB2']],
    glow: null, sun: {x: 520, y: 470, r: 72, c: '#F4EFE6'},
    far: '#5F857F', farSide: '#4A6E69', bridge: '#1F3B39', boats: '#142524', fg: '#0D0C09', accent: '#FF6F61',
    water: [['0', '#335652'], ['0.35', '#335652'], ['0.35', '#22403D'], ['1', '#22403D']], streak: '#DFE0D6',
    mist: null, mistA: 0, grain: 0, windows: '#DFE0D6', fireworks: false, stars: false, flat: true, paper: false, gulls: false,
    tone: '#2E403D', lite: '#5C7772', rim: null,
  },
  warm: {
    sky: [['0', '#140D09'], ['0.45', '#3A2214'], ['0.78', '#9A5526'], ['1', '#E9A55A']],
    glow: {x: 260, y: 760, r: 900, c: '#F6D29A', a: 0.55}, sun: null,
    far: '#8A5432', bridge: '#3B2216', boats: '#25160E', fg: '#0D0907', accent: '#2FE0C4',
    water: [['0', '#8A5432'], ['0.25', '#4A2A18'], ['1', '#140D09']], streak: '#F6D29A',
    mist: '#E0A060', mistA: 0.28, grain: 0.13, windows: null, fireworks: false, stars: false, flat: false, paper: false, gulls: true,
    tone: '#3A2A20', lite: '#6A4A36', rim: {c: '#F6D29A', a: 0.8, dx: -0.009, dy: -0.002},
  },
  paper: {
    sky: [['0', '#16211F'], ['0.45', '#1F3634'], ['0.78', '#5F857F'], ['1', '#A3BAB2']],
    glow: {x: 260, y: 760, r: 900, c: '#F4EFE6', a: 0.45}, sun: null,
    far: '#6E918A', bridge: '#2A4946', boats: '#1A2E2C', fg: '#0D0C09', accent: '#FF6F61',
    water: [['0', '#4E726C'], ['0.25', '#2B4A47'], ['1', '#111B1B']], streak: '#DFE0D6',
    mist: null, mistA: 0, grain: 0.10, windows: null, fireworks: false, stars: false, flat: false, paper: true, gulls: false,
    tone: '#2E403D', lite: '#5C7772', rim: null,
  },
};
const MICHAEL_TONES = {tone: '#B5463D', lite: '#FFD9D2'};

/* ---------- helpers ---------- */
function rng(seed) { // mulberry32
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const f1 = (n) => Math.round(n * 10) / 10;
const pts = (a) => a.map(([x, y]) => `${f1(x)},${f1(y)}`).join(' ');
const poly = (a, fill, extra = '') => `<polygon points="${pts(a)}" fill="${fill}" ${extra}/>`;
const line = (a, stroke, w, extra = '') => `<polyline points="${pts(a)}" fill="none" stroke="${stroke}" stroke-width="${f1(w)}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const grad = (id, stops, vertical = true) => `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a ?? 1}"/>`).join('')}</linearGradient>`;
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const smooth = (e0, e1, v) => { const u = clamp01((v - e0) / (e1 - e0)); return u * u * (3 - 2 * u); };
const ease = (u) => 0.5 - Math.cos(Math.PI * clamp01(u)) / 2;
const TAU = Math.PI * 2;
const step12 = (t) => Math.floor(t * 12 + 1e-6) / 12; // drawn motion: 12 drawings a second

/* ---------- figures (rigs with three levels of detail) ---------- */
// Units: height 1, feet at 0, +y up. d = facing (+1 right, -1 left). Limbs are strokes, so animating is turning joints.
// o.an: animation {lean (deg), bob, tilt (head, deg, + looks up), fArm [shoulder, elbow], bArm, legs [a, b], hatInHand, blink,
//       childWave}. Angles are degrees from straight up, positive toward the way the figure faces.
// o.det 0..1: interior detail. o.rim {c, a, dx, dy}: rim light (offset in figure heights). o.tones {tone, lite}: detail colours.
function figure(o) {
  const {x, y, h, d = 1, kind = 'man', hat = 'bowler', pose = 'stand', beard = false, coat = 'frock', fill, an = {}, det = 0, rim = null, tones = {tone: '#2E403D', lite: '#5C7772'}} = o;
  const X = (lx) => x + d * lx * h, Y = (ly) => y - ly * h;
  const P = (a) => a.map(([lx, ly]) => [X(lx), Y(ly)]);
  const PD = (cmds) => cmds.map((c) => c[0] + (c.length > 1 ? ' ' + c.slice(1).map((v, i) => f1(i % 2 ? Y(v) : X(v))).join(' ') : '')).join(' ');
  const at = (sx, sy, len, deg) => [sx + Math.sin(deg * Math.PI / 180) * len, sy + Math.cos(deg * Math.PI / 180) * len];
  const child = kind === 'boy' || kind === 'girl';
  const headR = child ? [0.088, 0.095] : [0.062, 0.071];
  const headY = child ? 0.9 : 0.93;
  const k = child ? 0.8 : 1;
  const hip = child ? 0.46 : 0.5;
  const sh = child ? [0, 0.74] : [0, 0.81];
  const legW = child ? 0.07 : 0.078;
  const armW = kind === 'woman' ? 0.044 : child ? 0.05 : 0.055;
  const hatInHand = an.hatInHand ?? (pose === 'wave');
  const fA = an.fArm || (pose === 'wave' ? [30, 8] : pose === 'point' ? [72, 80] : pose === 'carry' ? [40, -10] : [165, 150]);
  const bA = an.bArm || [196, 202];
  const legA = an.legs || [9, -8];
  const hipX = (i) => (i === 0 ? 0.026 : -0.026);
  const legJ = legA.map((a, i) => { const knee = at(hipX(i), hip, hip * 0.52, 180 - a); const ank = at(knee[0], knee[1], hip * 0.48, 180 - (an.shins ? an.shins[i] : a * 0.6)); return [knee, [ank[0], Math.max(ank[1], 0.03)]]; });
  const bE = at(-0.02, sh[1], 0.19 * k, bA[0]), bH = at(bE[0], bE[1], 0.17 * k, bA[1]);
  const fE = at(0.02, sh[1], 0.19 * k, fA[0]), fH = at(fE[0], fE[1], 0.17 * k, fA[1]);
  const top = headY + headR[1];
  const headRot = `rotate(${f1(-(an.tilt || 0) * d)}, ${f1(X(0))}, ${f1(Y(child ? 0.8 : 0.86))})`;

  // The head as one profile: skull, forehead, brow, nose, lips, chin, jaw. Women get a softer brow and smaller nose; children a
  // rounder, bigger head. `open` drops the jaw for an open mouth (awe).
  const hs = child ? 1.42 : 1;
  const prof = kind === 'woman' ? {brow: 0.058, nose: 0.018, lip: 0.067, chin: 0.05} : child ? {brow: 0.058, nose: 0.012, lip: 0.064, chin: 0.05} : {brow: 0.064, nose: 0.026, lip: 0.066, chin: 0.056};
  const EXPR = {neutral: {open: 0}, smile: {open: 0}, worried: {open: 0}, awe: {open: 0.009}, set: {open: 0}};
  const expr = EXPR[an.expr] ? an.expr : 'neutral', jaw = EXPR[expr].open;
  const HP = (dx, dy) => [X(0.008 + dx * hs), Y(headY + dy * hs)];
  const hpS = (dx, dy) => { const [a, b] = HP(dx, dy); return `${f1(a)},${f1(b)}`; };
  function headPath() {
    const q = prof;
    return `M${hpS(-0.032, -0.062)} Q${hpS(-0.074, -0.03)} ${hpS(-0.064, 0.02)} Q${hpS(-0.056, 0.07)} ${hpS(0.0, 0.073)} Q${hpS(0.048, 0.072)} ${hpS(0.06, 0.032)}` +
      ` L${hpS(q.brow, 0.014)} L${hpS(0.059, 0.005)} L${hpS(0.06 + q.nose, -0.016)} L${hpS(0.063, -0.026)} L${hpS(q.lip, -0.034)} L${hpS(0.061, -0.04 - jaw)}` +
      ` L${hpS(q.lip - 0.002, -0.046 - jaw)} Q${hpS(q.chin + 0.008, -0.058 - jaw)} ${hpS(q.chin, -0.066 - jaw)} Q${hpS(0.04, -0.074 - jaw)} ${hpS(0.015, -0.068)} L${hpS(0.02, -0.058)} Z`;
  }
  const capShape = (c, cx0, cy0) => `<ellipse cx="${f1(X(cx0))}" cy="${f1(Y(cy0))}" rx="${f1(0.07 * h)}" ry="${f1(0.034 * h)}" fill="${c}"/>` +
    poly(P([[cx0 + 0.03, cy0 - 0.005], [cx0 + 0.115, cy0 - 0.023], [cx0 + 0.05, cy0 - 0.031]]), c);

  function body(c) {
    const g = [];
    const limb = (a, w) => g.push(line(P(a), c, w * h));
    const shape = (cmds) => g.push(`<path d="${PD(cmds)} Z" fill="${c}" stroke="${c}" stroke-width="${f1(0.012 * h)}" stroke-linejoin="round"/>`);
    const dot = (lx, ly, r) => g.push(`<circle cx="${f1(X(lx))}" cy="${f1(Y(ly))}" r="${f1(r * h)}" fill="${c}"/>`);
    // legs + shoes
    if (kind !== 'woman') for (const [i, [knee, ank]] of legJ.entries()) {
      limb([[hipX(i), hip], knee, ank], legW);
      g.push(`<ellipse cx="${f1(X(ank[0] + 0.035))}" cy="${f1(Y(Math.max(ank[1] - 0.012, 0.018)))}" rx="${f1(0.055 * h)}" ry="${f1(0.021 * h)}" fill="${c}"/>`);
    }
    // back arm
    limb([[-0.02, sh[1]], bE, bH], armW); dot(bH[0], bH[1], armW * 0.55);
    // torso
    if (kind === 'man') {
      const hem = coat === 'jacket' ? 0.47 : coat === 'sack' ? 0.42 : 0.33;
      const hf = coat === 'frock' ? 0.125 : 0.105, hb = coat === 'frock' ? -0.155 : -0.125;
      shape([['M', -0.035, 0.872], ['Q', -0.095, 0.866, -0.112, 0.8], ['Q', -0.132, 0.72, -0.106, 0.66], ['L', hb, hem - 0.01], ['L', hf, hem], ['L', 0.097, 0.62], ['Q', 0.13, 0.75, 0.104, 0.81], ['Q', 0.088, 0.866, 0.035, 0.872]]);
    } else if (kind === 'woman') {
      shape([['M', -0.03, 0.868], ['Q', -0.08, 0.862, -0.092, 0.8], ['Q', -0.1, 0.7, -0.055, 0.6], ['L', 0.055, 0.6], ['L', 0.07, 0.68], ['Q', 0.112, 0.75, 0.086, 0.815], ['Q', 0.072, 0.864, 0.03, 0.868]]);
      shape([['M', 0.055, 0.61], ['Q', 0.085, 0.35, 0.15, 0.0], ['L', -0.17, 0.0], ['Q', -0.14, 0.2, -0.16, 0.34], ['Q', -0.235, 0.42, -0.2, 0.53], ['Q', -0.15, 0.6, -0.055, 0.61]]);
    } else if (kind === 'boy') {
      shape([['M', -0.1, 0.78], ['Q', 0, 0.8, 0.1, 0.78], ['L', 0.1, 0.44], ['L', -0.11, 0.43]]);
    } else {
      shape([['M', -0.09, 0.78], ['Q', 0, 0.8, 0.09, 0.78], ['L', 0.08, 0.6], ['Q', 0.12, 0.42, 0.16, 0.26], ['L', -0.17, 0.26], ['Q', -0.12, 0.42, -0.08, 0.6]]);
    }
    // head group
    const hg = [];
    hg.push(poly(P([[-0.025, 0.83], [0.032, 0.83], [0.03, 0.89], [-0.02, 0.89]]), c));
    hg.push(`<path d="${headPath()}" fill="${c}" stroke="${c}" stroke-width="${f1(0.004 * h)}" stroke-linejoin="round"/>`); // the profile
    if (beard) hg.push(poly(P([[-0.03, headY - 0.03], [0.07, headY - 0.03], [0.05, headY - 0.1], [0.0, headY - 0.105]]), c));
    if (kind === 'woman' || kind === 'girl') hg.push(`<circle cx="${f1(X(-0.06))}" cy="${f1(Y(headY + 0.02))}" r="${f1(0.032 * h)}" fill="${c}"/>`);
    if (!hatInHand) {
      if (hat === 'bowler') {
        hg.push(`<path d="M${f1(X(-0.06))},${f1(Y(top - 0.012))} A${f1(0.06 * h)},${f1(0.055 * h)} 0 0 ${d > 0 ? 1 : 0} ${f1(X(0.068))},${f1(Y(top - 0.012))} Z" fill="${c}"/>`);
        hg.push(`<ellipse cx="${f1(X(0.006))}" cy="${f1(Y(top - 0.014))}" rx="${f1(0.088 * h)}" ry="${f1(0.013 * h)}" fill="${c}"/>`);
      } else if (hat === 'top') {
        hg.push(poly(P([[-0.052, top - 0.02], [0.062, top - 0.02], [0.058, top + 0.13], [-0.048, top + 0.13]]), c));
        hg.push(`<ellipse cx="${f1(X(0.006))}" cy="${f1(Y(top - 0.016))}" rx="${f1(0.09 * h)}" ry="${f1(0.013 * h)}" fill="${c}"/>`);
      } else if (hat === 'cap') {
        hg.push(capShape(c, -0.004, top - 0.005));
      } else if (hat === 'lady') {
        hg.push(`<ellipse cx="${f1(X(0.0))}" cy="${f1(Y(top - 0.004))}" rx="${f1(0.07 * h)}" ry="${f1(0.016 * h)}" fill="${c}"/>`);
        hg.push(poly(P([[-0.04, top], [0.045, top], [0.035, top + 0.05], [-0.03, top + 0.05]]), c));
        hg.push(`<path d="M${f1(X(-0.02))},${f1(Y(top + 0.04))} q${f1(-d * 0.05 * h)},${f1(-0.09 * h)} ${f1(-d * 0.11 * h)},${f1(-0.03 * h)} q${f1(d * 0.04 * h)},0 ${f1(d * 0.1 * h)},${f1(0.05 * h)} Z" fill="${c}"/>`);
      } else if (hat === 'boycap') {
        hg.push(`<ellipse cx="${f1(X(-0.004))}" cy="${f1(Y(top - 0.01))}" rx="${f1(0.095 * h)}" ry="${f1(0.04 * h)}" fill="${c}"/>`);
        hg.push(poly(P([[0.05, top - 0.02], [0.15, top - 0.04], [0.07, top - 0.05]]), c));
      }
    }
    g.push(`<g transform="${headRot}">${hg.join('')}</g>`);
    // front arm, hat in hand, cane, parasol
    limb([[0.02, sh[1]], fE, fH], armW); dot(fH[0], fH[1], armW * 0.55);
    if (hatInHand && (hat === 'cap' || hat === 'none' || hat === 'bowler' || hat === 'top')) {
      if (hat === 'bowler' || hat === 'top') g.push(`<ellipse cx="${f1(X(fH[0] + 0.01))}" cy="${f1(Y(fH[1] + 0.03))}" rx="${f1(0.07 * h)}" ry="${f1(0.045 * h)}" fill="${c}"/>`);
      else g.push(capShape(c, fH[0] + 0.01, fH[1] + 0.035));
    }
    if (o.pail) { // a worker's tin dinner pail, hanging from the hand
      const [hx, hy] = fH;
      g.push(`<path d="M${f1(X(hx - 0.035))},${f1(Y(hy - 0.05))} Q${f1(X(hx))},${f1(Y(hy + 0.02))} ${f1(X(hx + 0.035))},${f1(Y(hy - 0.05))}" stroke="${c}" stroke-width="${f1(0.008 * h)}" fill="none"/>`);
      g.push(poly(P([[hx - 0.04, hy - 0.05], [hx + 0.04, hy - 0.05], [hx + 0.034, hy - 0.15], [hx - 0.034, hy - 0.15]]), c));
    }
    if (o.basket) g.push(`<path d="M${f1(X(fH[0] - 0.06))},${f1(Y(fH[1] - 0.02))} L${f1(X(fH[0] + 0.06))},${f1(Y(fH[1] - 0.02))} L${f1(X(fH[0] + 0.05))},${f1(Y(fH[1] - 0.11))} L${f1(X(fH[0] - 0.05))},${f1(Y(fH[1] - 0.11))} Z" fill="${c}"/>`);
    if (o.papers) g.push(poly(P([[-0.06, 0.66], [0.08, 0.7], [0.07, 0.62], [-0.07, 0.58]]), c));
    if (o.cane) limb([fH, [fH[0] + 0.05, 0.0]], 0.016);
    if (o.parasol) { limb([[fH[0] - 0.03, fH[1] + 0.08], [fH[0] + 0.07, 0.0]], 0.02); g.push(poly(P([[fH[0] - 0.005, fH[1] - 0.02], [fH[0] + 0.05, fH[1] - 0.3], [fH[0] + 0.035, fH[1] - 0.02]]), c)); }
    if (pose === 'carry') { // a child riding on the shoulders, waving
      const ch = 0.5, C = (lx, ly) => [lx * ch, 0.9 + ly * ch];
      g.push(poly(P([C(-0.1, 0.0), C(0.1, 0.0), C(0.1, 0.34), C(-0.1, 0.34)]), c));
      limb([C(0.02, 0.02), C(0.2, -0.1), C(0.16, -0.32)], 0.07 * ch);
      limb([C(-0.02, 0.02), C(-0.17, -0.12), C(-0.14, -0.32)], 0.07 * ch);
      const hc = C(0.008, 0.46);
      g.push(`<ellipse cx="${f1(X(hc[0]))}" cy="${f1(Y(hc[1]))}" rx="${f1(0.085 * ch * h)}" ry="${f1(0.092 * ch * h)}" fill="${c}"/>`);
      const wv = an.childWave || 0;
      const e = at(0.03 * ch, 0.9 + 0.3 * ch, 0.2 * ch, 35 + wv * 0.5), hn = at(e[0], e[1], 0.18 * ch, 15 + wv);
      limb([C(0.03, 0.3), e, hn], 0.05 * ch);
    }
    return g.join('');
  }

  function details() { // drawn over the solid shape in close-ups
    const {tone, lite} = tones, g = [], hg = [];
    const ln = (a, w = 0.007) => line(P(a), tone, w * h);
    const dot = (lx, ly, r, c = tone) => `<circle cx="${f1(X(lx))}" cy="${f1(Y(ly))}" r="${f1(r * h)}" fill="${c}"/>`;
    if (kind === 'man') {
      g.push(poly(P([[0.012, 0.852], [0.062, 0.85], [0.036, 0.812]]), lite)); // shirt collar
      g.push(ln([[0.055, 0.842], [0.028, 0.75], [0.078, 0.69]])); // lapel
      for (const yy of coat === 'jacket' ? [0.72, 0.66, 0.6, 0.54] : [0.7, 0.65, 0.6]) g.push(dot(coat === 'jacket' ? 0.072 : 0.085, yy, 0.0065));
      g.push(ln([[-0.07, 0.56], [-0.01, 0.56]])); // pocket
      if (coat !== 'jacket') g.push(`<path d="M${f1(X(0.08))},${f1(Y(0.6))} Q${f1(X(0.04))},${f1(Y(0.565))} ${f1(X(0.01))},${f1(Y(0.6))}" stroke="${lite}" stroke-width="${f1(0.004 * h)}" fill="none"/>`); // watch chain
      const [knee, ank] = legJ[0];
      g.push(ln([[0.012, hip - 0.02], [knee[0] + 0.012, knee[1]], [ank[0] + 0.012, ank[1] + 0.03]], 0.005)); // trouser crease
      g.push(ln([[fH[0] - 0.02, fH[1] + 0.03], [fH[0] + 0.02, fH[1] + 0.035]], 0.006)); // cuff
    } else if (kind === 'woman') {
      g.push(`<ellipse cx="${f1(X(0.012))}" cy="${f1(Y(0.84))}" rx="${f1(0.045 * h)}" ry="${f1(0.014 * h)}" fill="${lite}"/>`); // lace collar
      for (const yy of [0.79, 0.75, 0.71, 0.67, 0.63]) g.push(dot(0.062, yy, 0.0055));
      g.push(ln([[-0.06, 0.605], [0.06, 0.605]], 0.009)); // waistband
      for (const [a0, a1] of [[0.03, 0.08], [-0.03, -0.02], [-0.1, -0.12]]) g.push(`<path d="M${f1(X(a0))},${f1(Y(0.58))} Q${f1(X(a0 + 0.02))},${f1(Y(0.3))} ${f1(X(a1))},${f1(Y(0.03))}" stroke="${tone}" stroke-width="${f1(0.006 * h)}" fill="none"/>`);
      g.push(ln([[-0.16, 0.5], [-0.11, 0.44], [-0.05, 0.47]], 0.006)); // bustle drape
    } else {
      g.push(poly(P([[0.0, 0.79], [0.07, 0.79], [0.035, 0.76]]), lite));
    }
    // face and head
    // the face: an expression is a brow, an eye and a mouth (plus a cheek crease for a smile)
    const hl = (a, w = 0.005) => line(a.map(([dx, dy]) => HP(dx, dy)), tone, w * h * hs);
    const hq = (a, b, c2, w = 0.005) => { const [p0, p1, p2] = [HP(...a), HP(...b), HP(...c2)]; return `<path d="M${f1(p0[0])},${f1(p0[1])} Q${f1(p1[0])},${f1(p1[1])} ${f1(p2[0])},${f1(p2[1])}" stroke="${tone}" stroke-width="${f1(w * h * hs)}" fill="none" stroke-linecap="round"/>`; };
    const he = (dx, dy, rx, ry, c2 = tone) => { const [a, b] = HP(dx, dy); return `<ellipse cx="${f1(a)}" cy="${f1(b)}" rx="${f1(rx * h * hs)}" ry="${f1(ry * h * hs)}" fill="${c2}"/>`; };
    hg.push(he(-0.012, -0.002, 0.012, 0.019) .replace('/>', ' opacity="0.75"/>')); // ear
    const brow = {neutral: [[0.022, 0.024], [0.05, 0.022]], smile: [[0.022, 0.027], [0.05, 0.026]], worried: [[0.022, 0.021], [0.05, 0.031]],
      awe: [[0.022, 0.032], [0.05, 0.034]], set: [[0.022, 0.027], [0.052, 0.015]]}[expr];
    hg.push(hl(brow, 0.006));
    if (an.blink) hg.push(hl([[0.026, 0.006], [0.042, 0.005]], 0.004));
    else if (expr === 'smile') hg.push(hq([0.025, 0.006], [0.034, 0.014], [0.043, 0.006], 0.004));
    else if (expr === 'awe') { hg.push(he(0.034, 0.008, 0.009, 0.008)); hg.push(he(0.037, 0.011, 0.0028, 0.0028, lite)); }
    else hg.push(he(0.034, 0.008, 0.0075, expr === 'set' ? 0.0042 : 0.0058));
    if (expr === 'smile') { hg.push(hq([0.061, -0.04], [0.05, -0.047], [0.037, -0.034])); hg.push(hq([0.036, -0.022], [0.031, -0.027], [0.032, -0.033], 0.0035)); }
    else if (expr === 'worried') hg.push(hq([0.061, -0.04], [0.05, -0.036], [0.038, -0.047]));
    else if (expr === 'awe') hg.push(he(0.056, -0.044, 0.007, 0.009));
    else if (expr === 'set') hg.push(hl([[0.061, -0.04], [0.036, -0.041]], 0.006));
    else hg.push(hq([0.061, -0.04], [0.05, -0.042], [0.04, -0.041], 0.004));
    if (!(hatInHand || hat === 'none') && kind === 'man') hg.push(`<path d="M${hpS(-0.06, 0.03)} Q${hpS(-0.068, 0.0)} ${hpS(-0.056, -0.03)} L${hpS(-0.044, -0.022)} Q${hpS(-0.05, 0.004)} ${hpS(-0.042, 0.03)} Z" fill="${tone}" opacity="0.85"/>`); // hair below the hat
    const bare = hatInHand || hat === 'none';
    if (kind === 'man' && bare) hg.push(`<path d="M${f1(X(-0.064))},${f1(Y(headY - 0.01))} Q${f1(X(-0.066))},${f1(Y(top + 0.012))} ${f1(X(0.01))},${f1(Y(top + 0.008))} Q${f1(X(0.06))},${f1(Y(top))} ${f1(X(0.066))},${f1(Y(headY + 0.03))} Q${f1(X(0.02))},${f1(Y(headY + 0.045))} ${f1(X(-0.02))},${f1(Y(headY + 0.02))} Z" fill="${tone}"/>`); // hair
    if (kind === 'man' && !bare && hat === 'bowler') hg.push(ln([[-0.058, top - 0.002], [0.066, top - 0.002]], 0.01));
    if (kind === 'man' && !bare && hat === 'top') hg.push(ln([[-0.05, top + 0.005], [0.06, top + 0.005]], 0.016));
    if (kind === 'woman' && hat === 'lady') { hg.push(dot(0.03, top + 0.02, 0.012, lite)); hg.push(dot(0.012, top + 0.03, 0.009, lite)); }
    return g.join('') + `<g transform="${headRot}">${hg.join('')}</g>`;
  }

  let out = '';
  if (rim && rim.a > 0.01) out += `<g transform="translate(${f1(rim.dx * h)},${f1(rim.dy * h)})" opacity="${f1(rim.a * 100) / 100}">${body(rim.c)}</g>`;
  out += body(fill);
  if (det > 0.01) out += `<g opacity="${f1(det * 100) / 100}">${details()}</g>`;
  return `<g transform="translate(0,${f1(-(an.bob || 0) * h)}) rotate(${f1((an.lean || 0) * d)}, ${f1(x)}, ${f1(y)})">${out}</g>`;
}

/* ---------- fireworks: one schedule shared by the sky, the river and the rim light ---------- */
const BURSTS = [ // x, y (bridge-layer px), radius, colour, launch time (s); the list repeats every 9 s
  [560, 250, 150, '#F4EFE6', -1.2], [880, 150, 120, '#A3BAB2', -0.3], [300, 330, 100, '#DFE0D6', 0.6], [1080, 300, 90, '#F4EFE6', 1.5],
  [700, 190, 140, '#DFE0D6', 2.3], [420, 230, 120, '#F4EFE6', 3.2], [980, 210, 110, '#A3BAB2', 4.0], [600, 300, 95, '#F4EFE6', 4.7],
  [820, 170, 150, '#DFE0D6', 5.6], [260, 260, 110, '#A3BAB2', 6.4], [1050, 160, 120, '#F4EFE6', 7.2], [500, 180, 140, '#DFE0D6', 8.0],
  [-300, 220, 140, '#DFE0D6', 0.2], [-700, 300, 110, '#F4EFE6', 2.9],
];
const RISE = 0.7, LIFE = 2.2;
function burstState(b, t) {
  const tl = ((t - b[4]) % 9 + 9) % 9; // time since launch
  if (tl < RISE) return {phase: 'rise', u: tl / RISE};
  const tb = tl - RISE;
  if (tb < LIFE) return {phase: 'burst', tb, a: 1 - tb / LIFE};
  return null;
}
function fireBrightness(t) { // 0..1, drives the sky glow and the rim light on the crowd
  let s = 0;
  for (const b of BURSTS) { const st = burstState(b, t); if (st && st.phase === 'burst' && b[0] > -200) s += Math.pow(st.a, 1.6) * b[2] / 150; }
  return clamp01(0.25 + s * 0.55);
}

/* ---------- layers ---------- */
const W = 1920, H = 1080, WATER = 772;

function skyLayer(L, t) {
  const s = [];
  s.push(`<rect width="${W}" height="${H}" fill="url(#sky)"/>`);
  if (L.glow) s.push(`<circle cx="${L.glow.x}" cy="${L.glow.y}" r="${L.glow.r}" fill="url(#glow)"/>`);
  if (L.sun) s.push(`<circle cx="${L.sun.x}" cy="${L.sun.y}" r="${L.sun.r}" fill="${L.sun.c}"/>`);
  if (L.stars) {
    const r = rng(7);
    for (let i = 0; i < 140; i++) { const ph = r(); s.push(`<circle cx="${f1(r() * W)}" cy="${f1(r() * 520)}" r="${f1(0.6 + r() * 1.3)}" fill="#DFE0D6" opacity="${f1((0.2 + r() * 0.5) * (0.7 + 0.3 * Math.sin(TAU * (step12(t) * 0.5 + ph))))}"/>`); }
  }
  s.push(`<rect y="${WATER}" width="${W}" height="${H - WATER}" fill="url(#water)"/>`);
  if (L.streak) { // reflection of the light, shimmering
    const r = rng(11), cx = L.glow ? L.glow.x : L.sun.x, tq = step12(t);
    for (let i = 0; i < 26; i++) {
      const ph = r(), yy = WATER + 6 + i * 9 + r() * 4, w = (260 - i * 7) * (0.5 + r() * 0.8) * (0.8 + 0.25 * Math.sin(TAU * (tq * 0.6 + ph)));
      s.push(`<rect x="${f1(cx - w / 2 + (r() - 0.5) * 60 + 6 * Math.sin(TAU * (tq * 0.3 + ph)))}" y="${f1(yy)}" width="${f1(Math.max(w, 10))}" height="${L.flat ? 4 : 2.5}" fill="${L.streak}" opacity="${f1((L.flat ? 0.9 : 0.55) * (1 - i / 30))}"/>`);
    }
  }
  return s.join('');
}

function mistBlobs(L, t, y, seed, n = 5, spread = 7000) {
  if (!L.mist) return '';
  const r = rng(seed), s = [];
  for (let i = 0; i < n; i++) {
    const x = ((r() * spread + t * (14 + r() * 10)) % spread) - spread / 2 + 900, w = 600 + r() * 600;
    s.push(`<ellipse cx="${f1(x)}" cy="${f1(y + (r() - 0.5) * 30)}" rx="${f1(w)}" ry="${f1(36 + r() * 24)}" fill="${L.mist}" opacity="${f1(L.mistA * 0.8)}" filter="url(#blur)"/>`);
  }
  return s.join('');
}

function building(x, base, w, h, L, r, fill, side) {
  const s = [];
  s.push(`<rect x="${f1(x)}" y="${f1(base - h)}" width="${f1(w)}" height="${f1(h + 4)}" fill="${fill}"/>`);
  if (L.flat && side) s.push(`<rect x="${f1(x + w * 0.72)}" y="${f1(base - h)}" width="${f1(w * 0.28)}" height="${f1(h + 4)}" fill="${side}"/>`);
  const roof = r();
  if (roof < 0.3) s.push(poly([[x - 2, base - h], [x + w / 2, base - h - w * 0.35], [x + w + 2, base - h]], fill));
  else if (roof < 0.5) s.push(`<rect x="${f1(x + w * 0.2)}" y="${f1(base - h - 14)}" width="7" height="16" fill="${fill}"/>`);
  else if (roof < 0.62) s.push(poly([[x + w * 0.1, base - h], [x + w * 0.2, base - h - 12], [x + w * 0.8, base - h - 12], [x + w * 0.9, base - h]], fill));
  if (L.windows) {
    for (let wy = base - h + 12; wy < base - 10; wy += 16) for (let wx = x + 6; wx < x + w - 8; wx += 13)
      if (r() < (L.flat ? 0.28 : 0.16)) s.push(`<rect x="${f1(wx)}" y="${f1(wy)}" width="5" height="7" fill="${L.windows}" opacity="${L.flat ? 0.75 : 0.85}"/>`);
  }
  return s.join('');
}
function steeple(x, base, w, h, spire, fill) {
  return `<rect x="${f1(x)}" y="${f1(base - h)}" width="${w}" height="${h + 4}" fill="${fill}"/>` +
    poly([[x - 3, base - h], [x + w / 2, base - h - spire], [x + w + 3, base - h]], fill) +
    `<rect x="${f1(x + w / 2 - 1)}" y="${f1(base - h - spire - 14)}" width="2" height="16" fill="${fill}"/>`;
}

function farLayer(L, t) { // across the river: low brick city, church steeples, a tall spire and a newspaper clock tower
  const r = rng(21), s = [], base = WATER + 2;
  for (let x = -2400; x < 4200;) {
    const w = 34 + r() * 70, hh = 26 + r() * 70 * (r() < 0.12 ? 1.6 : 1);
    s.push(building(x, base, w, hh, L, r, L.far, L.farSide));
    x += w - 2 + (r() < 0.08 ? 40 : 0);
  }
  for (const [x, w, hh, sp] of [[-1500, 26, 120, 150], [-820, 22, 80, 80], [-200, 20, 70, 70], [520, 18, 64, 66], [1460, 22, 84, 90], [2050, 20, 70, 72], [2700, 24, 90, 96], [3300, 18, 66, 70]])
    s.push(steeple(x, base, w, hh, sp, L.far));
  s.push(`<rect x="-1050" y="${base - 150}" width="70" height="154" fill="${L.far}"/><rect x="-1032" y="${base - 230}" width="34" height="84" fill="${L.far}"/>` +
    poly([[-1036, base - 230], [-1015, base - 290], [-994, base - 230]], L.far));
  if (L.mist) s.push(`<rect x="-2400" y="${base - 60}" width="6600" height="90" fill="url(#mist)"/>` + mistBlobs(L, t, base - 20, 61));
  return s.join('');
}

// The bridge, from its real proportions (towers ~276 ft above water, main span 1,595 ft, side spans 930 ft, deck ~119 ft up),
// scaled so a tower stands 470 px. A true side view hides the Gothic arches; like most illustrations, we show them.
const B = (() => {
  const towerH = 470, ft = towerH / 276;
  const span = 1595 * ft, side = 930 * ft;
  const tB = 1320, tM = tB - span;
  return {ft, span, side, tB, tM, aB: tB + side, aM: tM - side, top: WATER - towerH, deck: WATER - 119 * ft};
})();

function tower(xc, fill, id) {
  const top = B.top, deck = B.deck, wb = 230, wt = 196;
  const outline = [[xc - wb / 2, WATER + 6], [xc - wt / 2, top + 26], [xc + wt / 2, top + 26], [xc + wb / 2, WATER + 6]];
  const arch = (x0, w) => {
    const ys = deck - 150, yb = deck + 30, r = w;
    return `<path d="M${f1(x0)},${f1(yb)} V${f1(ys)} A${r},${r} 0 0 1 ${f1(x0 + w / 2)},${f1(ys - w * 0.866)} A${r},${r} 0 0 1 ${f1(x0 + w)},${f1(ys)} V${f1(yb)} Z" fill="black"/>`;
  };
  return `<mask id="${id}"><rect x="-9999" y="-9999" width="29999" height="29999" fill="white"/>${arch(xc - 74, 50)}${arch(xc + 24, 50)}</mask>` +
    `<g mask="url(#${id})">${poly(outline, fill)}` +
    `<rect x="${f1(xc - wt / 2 - 8)}" y="${f1(top + 14)}" width="${wt + 16}" height="16" fill="${fill}"/>` +
    `<rect x="${f1(xc - wt / 2 + 4)}" y="${f1(top)}" width="${wt - 8}" height="18" fill="${fill}"/>` +
    `<rect x="${f1(xc - wb / 2 - 14)}" y="${f1(WATER - 8)}" width="${wb + 28}" height="24" fill="${fill}"/></g>`;
}

// A flag that ripples: the free edge waves more than the edge on the pole.
function flag(x, y, w, hgt, c, t, seed = 0) {
  const tq = step12(t), n = 10, topE = [], botE = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, off = u * 9 * Math.sin(TAU * (tq * 0.9 + seed) - u * 5.5), dx = -u * 3 * (1 + Math.sin(TAU * tq * 0.9 + seed));
    topE.push([x + u * w + dx, y + off + u * 6]); botE.push([x + u * w + dx, y + hgt + off + u * 2]);
  }
  return poly(topE.concat(botE.reverse()), c);
}

function bridgeLayer(L, t) {
  const s = [], c = L.bridge, deck = B.deck, saddle = B.top + 8;
  s.push(`<rect x="${f1(B.aM - 1400)}" y="${WATER - 26}" width="${f1(B.tM - 150 - (B.aM - 1400))}" height="40" fill="${c}"/>`);
  s.push(`<rect x="${f1(B.tB + 160)}" y="${WATER - 26}" width="2200" height="40" fill="${c}"/>`);
  for (const [a, dir] of [[B.aM, -1], [B.aB, 1]]) { const end = a + dir * 900; s.push(poly([[a, deck - 4], [end, WATER - 70], [end, WATER - 20], [a, WATER - 20]], c)); }
  for (const a of [B.aM, B.aB]) s.push(`<rect x="${f1(a - 170)}" y="${f1(deck - 70)}" width="340" height="${f1(WATER - deck + 60)}" fill="${c}"/><rect x="${f1(a - 180)}" y="${f1(deck - 80)}" width="360" height="14" fill="${c}"/>`);
  s.push(`<rect x="${f1(B.aM)}" y="${f1(deck - 6)}" width="${f1(B.aB - B.aM)}" height="26" fill="${c}"/>`);
  if (!L.flat) for (let x = B.aM; x < B.aB; x += 18) s.push(`<line x1="${f1(x)}" y1="${f1(deck - 4)}" x2="${f1(x + 9)}" y2="${f1(deck + 18)}" stroke="${L.fg}" stroke-opacity="0.18" stroke-width="1.5"/>`);
  const main = (x) => { const mid = (B.tM + B.tB) / 2, half = B.span / 2; return (deck - 14) - ((deck - 14) - saddle) * ((x - mid) / half) ** 2; };
  const sideC = (x0, y0, x1, y1) => (x) => { const u = (x - x0) / (x1 - x0); return y0 + (y1 - y0) * u + 34 * 4 * u * (1 - u); };
  const sides = [sideC(B.tB, saddle, B.aB - 150, deck - 66), sideC(B.aM + 150, deck - 66, B.tM, saddle)];
  const path = (fn, x0, x1) => { const a = []; for (let x = x0; x <= x1; x += 12) a.push([x, fn(x)]); a.push([x1, fn(x1)]); return a; };
  for (const off of [0, 4]) {
    s.push(line(path((x) => main(x) + off, B.tM, B.tB), c, 4.5));
    s.push(line(path((x) => sides[0](x) + off, B.tB, B.aB - 150), c, 4.5));
    s.push(line(path((x) => sides[1](x) + off, B.aM + 150, B.tM), c, 4.5));
  }
  const susp = [];
  for (let x = B.tM + 20; x < B.tB - 20; x += 17) susp.push(`M${f1(x)},${f1(main(x))}V${f1(deck - 4)}`);
  for (let x = B.tB + 20; x < B.aB - 160; x += 17) susp.push(`M${f1(x)},${f1(sides[0](x))}V${f1(deck - 4)}`);
  for (let x = B.aM + 160; x < B.tM - 20; x += 17) susp.push(`M${f1(x)},${f1(sides[1](x))}V${f1(deck - 4)}`);
  for (const tw of [B.tM, B.tB]) for (let dx = 70; dx < 760; dx += 52) for (const dir of [-1, 1]) susp.push(`M${f1(tw + dir * 60)},${f1(saddle + 20)}L${f1(tw + dir * dx)},${f1(deck - 4)}`);
  s.push(`<path d="${susp.join('')}" stroke="${c}" stroke-width="1.3" fill="none" opacity="0.85"/>`);
  s.push(tower(B.tM, c, 'twM'), tower(B.tB, c, 'twB'));
  for (const tw of [B.tM, B.tB]) s.push(`<rect x="${f1(tw - 2)}" y="${f1(B.top - 70)}" width="4" height="72" fill="${c}"/>` + flag(tw + 2, B.top - 68, 50, 24, c, t, tw * 0.001));
  if (L.mist) s.push(`<rect x="-3000" y="${WATER - 40}" width="8000" height="80" fill="url(#mist)"/>` + mistBlobs(L, t, WATER - 10, 62, 6));
  return s.join('');
}

function fireworks(L, t) {
  const s = [], r = rng(31);
  for (const b of BURSTS) {
    const [x, y, R, c] = b, st = burstState(b, t);
    const seeds = Array.from({length: 34}, () => [r(), r()]);
    if (!st) continue;
    if (st.phase === 'rise') { // the rocket's trail climbing from the deck
      const yy = B.deck + (y + R * 0.1 - B.deck) * ease(st.u);
      s.push(`<line x1="${x}" y1="${f1(B.deck)}" x2="${x + 4}" y2="${f1(yy)}" stroke="${c}" stroke-width="2" stroke-dasharray="2 8" opacity="0.7"/><circle cx="${x + 4}" cy="${f1(yy)}" r="3.5" fill="${c}"/>`);
      continue;
    }
    const {tb, a} = st, grow = 1 - Math.pow(1 - Math.min(1, tb / 0.9), 3), fall = 46 * tb * tb;
    s.push(`<circle cx="${x}" cy="${y}" r="${f1(R * 1.8)}" fill="url(#fwglow)" opacity="${f1(Math.pow(a, 1.5))}"/>`);
    const n = seeds.length;
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * TAU + seeds[i][0] * 0.1, rr = R * (0.75 + seeds[i][1] * 0.3) * grow;
      const x2 = x + Math.cos(ang) * rr, y2 = y + Math.sin(ang) * rr + rr * 0.12 + fall;
      const tail = Math.max(0.25, 1 - tb * 0.45);
      s.push(`<line x1="${f1(x + Math.cos(ang) * rr * (1 - tail * 0.7))}" y1="${f1(y + Math.sin(ang) * rr * (1 - tail * 0.7) + fall * 0.7)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${c}" stroke-width="2" stroke-linecap="round" opacity="${f1(0.85 * a)}"/>`);
      s.push(`<circle cx="${f1(x2)}" cy="${f1(y2)}" r="${f1(3 * (0.6 + 0.4 * a))}" fill="${c}" opacity="${f1(Math.min(1, a * 1.3))}"/>`);
    }
    for (let i = 0; i < 9; i++) s.push(`<rect x="${f1(x - 30 + seeds[i][0] * 60)}" y="${f1(WATER + 10 + i * 13)}" width="${f1(14 + seeds[i][1] * 40)}" height="2.5" fill="${c}" opacity="${f1((0.45 - i * 0.04) * a)}"/>`);
  }
  return s.join('');
}

function ship(x, base, c, t, seed) { // a three-masted ship dressed with a line of flags, rocking at anchor
  const s = [], tq = step12(t), bob = 3 * Math.sin(TAU * (tq / 3.7 + seed)), rock = 0.7 * Math.sin(TAU * (tq / 4.3 + seed));
  s.push(poly([[x, base - 38], [x + 320, base - 38], [x + 300, base], [x + 30, base]], c));
  s.push(poly([[x + 320, base - 38], [x + 380, base - 52], [x + 322, base - 30]], c));
  const masts = [[x + 80, 240], [x + 175, 270], [x + 265, 230]];
  for (const [mx, mh] of masts) {
    s.push(`<rect x="${mx - 3}" y="${base - 38 - mh}" width="6" height="${mh}" fill="${c}"/>`);
    for (const [kk, w] of [[0.3, 110], [0.55, 90], [0.78, 64]]) s.push(`<rect x="${mx - w / 2}" y="${f1(base - 38 - mh * kk - 6)}" width="${w}" height="9" rx="4" fill="${c}"/>`);
    s.push(flag(mx + 3, base - 38 - mh, 26, 10, c, t, seed + mx * 0.01));
  }
  const rig = [[x + 380, base - 52], [masts[2][0], base - 38 - masts[2][1]], [masts[1][0], base - 38 - masts[1][1]], [masts[0][0], base - 38 - masts[0][1]], [x + 10, base - 38]];
  s.push(line(rig, c, 1.5));
  for (let i = 0; i < rig.length - 1; i++) {
    const [x0, y0] = rig[i], [x1, y1] = rig[i + 1];
    for (let u = 0.1; u < 1; u += 0.16) { const px = x0 + (x1 - x0) * u, py = y0 + (y1 - y0) * u, sw = 4 * Math.sin(TAU * (tq * 0.8 + u + i)); s.push(poly([[px - 5, py], [px + 5, py], [px + sw, py + 14]], c)); }
  }
  return `<g transform="translate(0,${f1(bob)}) rotate(${f1(rock)}, ${x + 190}, ${base})">${s.join('')}</g>`;
}
function ferry(x, base, c, smoke, t, seed) { // a side-wheel steam ferry with a walking beam, its smoke drifting
  const s = [], tq = step12(t), bob = 2.5 * Math.sin(TAU * (tq / 3.1 + seed)), beam = 4 * Math.sin(TAU * tq * 0.7);
  s.push(poly([[x, base - 30], [x + 280, base - 30], [x + 262, base], [x + 18, base]], c));
  s.push(`<rect x="${x + 30}" y="${base - 66}" width="220" height="38" fill="${c}"/><rect x="${x + 50}" y="${base - 84}" width="180" height="20" fill="${c}"/>`);
  s.push(`<path d="M${x + 100},${base - 30} a40,40 0 0 1 80,0 Z" fill="${c}"/>`);
  s.push(line([[x + 120, base - 84], [x + 140, base - 140], [x + 160, base - 84]], c, 5));
  s.push(poly([[x + 100, base - 142 - beam], [x + 140, base - 150], [x + 180, base - 142 + beam], [x + 140, base - 134]], c));
  for (const sx of [x + 70, x + 205]) s.push(`<rect x="${sx}" y="${base - 150}" width="13" height="70" fill="${c}"/>`);
  let puffs = '';
  if (smoke) for (let i = 0; i < 7; i++) {
    const p = ((t / 5 + i / 7) % 1);
    puffs += `<circle cx="${f1(x + 76 - p * 260)}" cy="${f1(base - 160 - p * 110)}" r="${f1(12 + p * 48)}" fill="${smoke}" opacity="${f1(0.3 * (1 - p) * Math.min(1, p * 6))}" filter="url(#soft)"/>`;
  }
  return `<g transform="translate(0,${f1(bob)})">${s.join('')}</g>${puffs}`;
}

function gulls(L, t) {
  if (!L.gulls) return '';
  const s = [], r = rng(81);
  for (let i = 0; i < 4; i++) {
    const x0 = -600 + r() * 2600, y0 = 180 + r() * 260, v = 30 + r() * 25, ph = r(), sz = 9 + r() * 6;
    const x = x0 + t * v, y = y0 + 8 * Math.sin(TAU * (t / 3 + ph));
    const fl = 0.7 * Math.sin(TAU * (step12(t) * 2.4 + ph));
    s.push(`<path d="M${f1(x - sz)},${f1(y - sz * fl * 0.6)} Q${f1(x - sz / 2)},${f1(y - sz * fl)} ${f1(x)},${f1(y)} Q${f1(x + sz / 2)},${f1(y - sz * fl)} ${f1(x + sz)},${f1(y - sz * fl * 0.6)}" stroke="${L.boats}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`);
  }
  return s.join('');
}

function boatLayer(L, t) {
  const r = rng(41), s = [], base = 852, tq = step12(t);
  s.push(ship(-260, base, L.boats, t, 0.1));
  s.push(ferry(560, base + 8, L.boats, L.smoke || L.mist, t, 0.3));
  s.push(ship(2300, base + 4, L.boats, t, 0.6));
  s.push(ferry(-1400, base + 6, L.boats, L.smoke || L.mist, t, 0.8));
  for (const [i, x] of [380, 1700, -800].entries()) { // rowboats: an oarsman pulling
    const bob = 2 * Math.sin(TAU * (tq / 2.6 + i * 0.3)), stroke = Math.sin(TAU * (tq / 2.2 + i * 0.4));
    s.push(`<g transform="translate(0,${f1(bob)})">` + poly([[x, base - 14], [x + 90, base - 14], [x + 80, base], [x + 10, base]], L.boats) +
      figure({x: x + 30, y: base - 10, h: 46, kind: 'man', hat: 'bowler', fill: L.boats, an: {lean: -8 * stroke, fArm: [120 - 30 * stroke, 100]}}) +
      line([[x + 40 + 8 * stroke, base - 26], [x + 110 - 10 * stroke, base + 4]], L.boats, 3) + '</g>');
  }
  if (!L.flat) for (let i = 0; i < 70; i++) { const x = -2000 + ((r() * 5000 + t * (8 + r() * 10)) % 5000), y = 800 + r() * 110; s.push(`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(20 + r() * 50)}" height="2" fill="${L.mist || L.far}" opacity="${f1(0.18 * (0.6 + 0.4 * Math.sin(TAU * (tq * 0.5 + r()))))}"/>`); }
  if (L.mist) s.push(`<rect x="-3000" y="${base - 30}" width="8000" height="60" fill="url(#mist)" opacity="0.6"/>`);
  return s.join('');
}

/* ---------- the crowd ---------- */
const MX = 1170; // Michael's place on the pier
function buildPeople() { // deterministic: the same crowd every frame
  const r = rng(51), people = [];
  for (const [row, yb, hb] of [[0, 996, 196], [1, 1012, 220], [2, 1036, 244]]) {
    for (let x = -5200 + r() * 60; x < 4600;) {
      const kinds = ['man', 'man', 'man', 'woman', 'woman', 'boy', 'girl'];
      const kind = kinds[Math.floor(r() * kinds.length)];
      const child = kind === 'boy' || kind === 'girl';
      const hh = hb * (child ? 0.58 + r() * 0.08 : 0.94 + r() * 0.12);
      const p = {row, x, y: yb + r() * 6, h: hh, kind,
        hat: kind === 'man' ? ['bowler', 'bowler', 'top', 'cap'][Math.floor(r() * 4)] : kind === 'woman' ? 'lady' : kind === 'boy' ? 'boycap' : 'none',
        beard: kind === 'man' && r() < 0.4, coat: ['frock', 'sack', 'sack', 'jacket'][Math.floor(r() * 4)], pose: 'stand',
        cane: kind === 'man' && r() < 0.3, parasol: kind === 'woman' && r() < 0.35, flipRoll: r()};
      if (Math.abs(x - MX) > (row === 2 ? 190 : 130)) people.push(p);
      x += (row === 2 ? 120 : 75) + r() * (row === 2 ? 160 : 70);
    }
  }
  people.push({row: 1, x: 1600, y: 1016, h: 232, kind: 'man', hat: 'bowler', pose: 'carry', beard: true, coat: 'sack', flipRoll: 0, fixedD: -1});
  people.sort((a, b) => a.row - b.row);
  people.forEach((p, i) => { p.i = i; });
  return people;
}
const PEOPLE = buildPeople();

// Idle and reaction motion for one person: breathing, weight shift, glances; some cheer with a hat, point, wave, or hop.
function crowdAnim(p, t, L) {
  const R = rng(1000 + p.i), ph = [R(), R(), R(), R(), R(), R()], g = R(), tq = step12(t);
  const an = {bob: 0.004 * Math.sin(TAU * (tq / 3.4 + ph[0])), lean: 1.1 * Math.sin(TAU * (tq / 5.5 + ph[1])),
    tilt: L.fireworks ? 9 + 5 * Math.sin(TAU * (tq / 4 + ph[2])) : 4 * Math.sin(TAU * (tq / 7 + ph[2])),
    legs: [9 + 2 * Math.sin(TAU * (tq / 5.5 + ph[1])), -8 + 2 * Math.sin(TAU * (tq / 5.5 + ph[1]))]};
  const env = Math.pow(Math.max(0, Math.sin(TAU * (tq / 7 + ph[3]))), 2);
  const mix = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  const rest = [165, 150], osc = Math.sin(TAU * tq * 1.7 + ph[4] * 6);
  const child = p.kind === 'boy' || p.kind === 'girl';
  an.expr = L.fireworks ? (g < 0.55 ? 'awe' : 'smile') : (g < 0.3 ? 'smile' : 'neutral');
  an.blink = (tq + ph[5] * 5) % 4.3 < 0.12;
  if (p.pose === 'carry') { an.childWave = 25 * osc; return an; }
  if (child && g < 0.6) { an.bob += 0.035 * Math.abs(Math.sin(TAU * (tq * 1.3 + ph[5]))) * env; an.fArm = mix(rest, [20, 10 + 25 * osc], env); }
  else if (p.kind === 'man' && g < 0.22 && p.hat !== 'none') { an.fArm = mix(rest, [28, 10 + 22 * osc], env); an.hatInHand = env > 0.35; }
  else if (g < 0.34 && !child) { an.fArm = mix(rest, [72, 80], env); }
  else if (p.kind === 'woman' && g < 0.45) { an.fArm = mix(rest, [40, 20 + 25 * osc], env * 0.9); }
  return an;
}

function crowdLayer(L, t, zoom) {
  const s = [], c = L.fg, tq = step12(t);
  s.push(`<rect x="-6000" y="1000" width="12000" height="90" fill="${c}"/><rect x="-6000" y="992" width="12000" height="12" fill="${c}"/>`);
  for (let x = -5980; x < 6000; x += 210) s.push(`<rect x="${x}" y="958" width="22" height="40" rx="6" fill="${c}"/><rect x="${x - 5}" y="952" width="32" height="10" rx="4" fill="${c}"/>`);
  // flag poles and swaying bunting
  const poles = [[60, 520], [880, 470], [2100, 500], [-900, 500], [3100, 480], [-2100, 490], [-3300, 510], [-4500, 480]];
  for (const [x, top] of poles) s.push(`<rect x="${x}" y="${top}" width="9" height="${1000 - top}" fill="${c}"/>` + flag(x + 9, top + 4, 112, 58, c, t, x * 0.0007));
  for (let i = 0; i < poles.length; i++) for (let j = 0; j < poles.length; j++) {
    const [x0, t0] = poles[i], [x1, t1] = poles[j];
    if (x1 <= x0 || x1 - x0 > 1300 || poles.some(([xm]) => xm > x0 && xm < x1)) continue;
    const a = [], y0 = t0 + 90, y1 = t1 + 90, sag = 70 + 7 * Math.sin(TAU * (tq / 4 + i * 0.3));
    for (let u = 0; u <= 1.001; u += 0.05) a.push([x0 + (x1 - x0) * u, y0 + (y1 - y0) * u + sag * 4 * u * (1 - u)]);
    s.push(line(a, c, 3));
    for (let kk = 1; kk < a.length - 1; kk++) { const sw = 7 * Math.sin(TAU * (tq / 2.4) + kk * 0.6 + i); s.push(`<g transform="rotate(${f1(sw)}, ${f1(a[kk][0])}, ${f1(a[kk][1])})">` + poly([[a[kk][0] - 11, a[kk][1]], [a[kk][0] + 11, a[kk][1]], [a[kk][0], a[kk][1] + 26]], c) + '</g>'); }
  }
  // the crowd. Detail follows the size on screen.
  const lit = L.fireworks ? fireBrightness(t) : 1;
  const lod = (h) => { const hs = h * zoom; return {det: smooth(430, 680, hs), rimA: L.rim ? L.rim.a * lit * (0.3 + 0.7 * smooth(170, 420, hs)) : 0}; };
  for (const p of PEOPLE) {
    const facing = p.fixedD ?? (p.flipRoll < 0.82 ? (p.x < 900 ? 1 : -1) : (p.x < 900 ? -1 : 1));
    const {det, rimA} = lod(p.h);
    s.push(figure({...p, d: facing, fill: c, an: crowdAnim(p, t, L), det, tones: {tone: L.tone, lite: L.lite}, rim: L.rim ? {...L.rim, a: rimA} : null}));
  }
  // Michael Kelly, 19: the only figure in colour.
  const mh = 248, ml = lod(mh);
  const wa = 22 * Math.sin(Math.floor(t * 12) * 0.9);
  const man = (L.michael && L.michael(t)) || {fArm: [30 + wa * 0.4, 8 + wa], hatInHand: true, bob: 0.003 * Math.sin(TAU * tq / 3.2)};
  s.push(figure({x: MX, y: 1040, h: mh, d: -1, kind: 'man', hat: 'cap', pose: 'wave', coat: 'jacket', fill: L.accent, an: man, det: ml.det,
    tones: MICHAEL_TONES, rim: L.rim ? {...L.rim, a: ml.rimA} : null}));
  return s.join('');
}

function nearLayer(L) {
  const c = L.fg, s = [];
  for (const x of [-4200, -600, 1980, 3600]) s.push(`<rect x="${x}" y="958" width="150" height="122" fill="${c}"/><rect x="${x + 120}" y="900" width="110" height="180" fill="${c}"/>`);
  s.push(`<ellipse cx="-80" cy="1066" rx="140" ry="36" fill="${c}"/>`);
  return s.join('');
}

/* ---------- assemble ---------- */
// cx: camera pan (px at the crowd plane). zoom: push-in at the crowd plane around the screen point (fx, fy); farther planes
// pan and zoom proportionally less.
function renderScene({look = 'dusk', t = 0, cx = 0, zoom = 1, fx = 960, fy = 540, w = W, h = H, michael = null}) {
  const base = LOOKS[look];
  const L = {...base, michael};
  if (L.fireworks && L.glow) L.glow = {...L.glow, a: 0.1 + 0.3 * fireBrightness(t)};
  const zs = (par) => 1 + (zoom - 1) * par;
  const layer = (par, body, filt = '') => `<g transform="translate(${f1(fx)},${f1(fy)}) scale(${zs(par).toFixed(4)}) translate(${f1(-fx)},${f1(-fy)}) translate(${f1(-cx * par)},0)" ${filt}>${body}</g>`;
  const pf = L.paper ? 'filter="url(#paper)"' : '';
  const defs = `<defs>
    ${grad('sky', L.sky)}${grad('water', L.water)}
    <radialGradient id="glow">${L.glow ? `<stop offset="0" stop-color="${L.glow.c}" stop-opacity="${L.glow.a}"/><stop offset="1" stop-color="${L.glow.c}" stop-opacity="0"/>` : ''}</radialGradient>
    <radialGradient id="fwglow"><stop offset="0" stop-color="#DFE0D6" stop-opacity="0.22"/><stop offset="1" stop-color="#DFE0D6" stop-opacity="0"/></radialGradient>
    ${grad('mist', [['0', L.mist || '#000', 0], ['0.5', L.mist || '#000', L.mistA], ['1', L.mist || '#000', 0]])}
    <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/></radialGradient>
    <filter id="blur" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="22"/></filter>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${Math.floor(t * 12) % 50}"/><feColorMatrix type="saturate" values="0"/></filter>
    <filter id="paper" x="-5%" y="-20%" width="110%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5" result="d"/><feDropShadow in="d" dx="0" dy="6" stdDeviation="7" flood-color="#000" flood-opacity="0.6"/></filter>
    <filter id="shadow" x="-5%" y="-20%" width="110%" height="140%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#000" flood-opacity="0.6"/></filter>
    <filter id="fibre" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.18" numOctaves="3" seed="2"/><feColorMatrix type="saturate" values="0"/></filter>
  </defs>`;
  const body = [
    skyLayer(L, t),
    L.fireworks ? layer(0.5, fireworks(L, t)) : '',
    layer(0.25, farLayer(L, t), pf),
    layer(0.5, bridgeLayer(L, t), L.paper ? 'filter="url(#shadow)"' : ''),
    layer(0.6, gulls(L, t)),
    layer(0.75, boatLayer(L, t), pf),
    layer(1.0, crowdLayer(L, t, zoom), pf),
    layer(1.35, nearLayer(L), pf),
    L.paper ? `<rect width="${W}" height="${H}" filter="url(#fibre)" opacity="0.18" style="mix-blend-mode:overlay"/>` : '',
    L.grain ? `<rect width="${W}" height="${H}" filter="url(#grain)" opacity="${L.grain}" style="mix-blend-mode:overlay"/>` : '',
    L.flat ? '' : `<rect width="${W}" height="${H}" fill="url(#vig)"/>`,
  ].join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${W} ${H}">${defs}${body}</svg>`;
}

/* ---------- clips ---------- */
const CLIPS = {
  // The scene alive at dusk: the camera drifts while everyone idles and reacts.
  alive_dusk: {look: 'dusk', sec: 8, cam: (t) => ({cx: -380 + 380 * ease(t / 8)})},
  // Opening night: the fireworks light the crowd; heads tip up; rim light flickers with each burst.
  fireworks_night: {look: 'night', sec: 8, cam: (t) => ({cx: 140 - 140 * ease(t / 8), zoom: 1 + 0.04 * ease(t / 8), fx: 960, fy: 700})},
  // The push-in: from the wide shot to Michael. Detail appears as he gets bigger; he lowers his cap and looks up.
  closeup_night: {look: 'night', sec: 9, cam: (t) => ({zoom: 1 + 2.2 * ease(t / 4.8), fx: 1156, fy: 986}),
    michael: (t) => {
      const tq = step12(t), wa = 22 * Math.sin(Math.floor(t * 12) * 0.9);
      const down = smooth(3.6, 5.2, tq);
      const fArm = [30 + wa * 0.4 * (1 - down) + (172 - 30) * down, 8 + wa * (1 - down) + (176 - 8) * down];
      const blink = [[2.1, 2.25], [5.9, 6.05], [8.0, 8.15]].some(([a, b]) => tq >= a && tq < b);
      return {fArm, hatInHand: true, tilt: 14 * smooth(4.2, 6.0, tq), blink, bob: 0.003 * Math.sin(TAU * tq / 3.2), lean: -1.5 * smooth(4.2, 6, tq), expr: tq < 4.4 ? 'smile' : 'awe'};
    }},
};
function renderClipFrame(name, t) { const c = CLIPS[name]; if (c.render) return c.render(t); return renderScene({look: c.look, t, ...c.cam(t), michael: c.michael || null}); }

// Detail ladder: the same characters at three levels, for the sheet.
function renderLadder(look = 'dusk') {
  const L = LOOKS[look], s = [];
  s.push(`<defs>${grad('sky', L.sky)}<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/><feColorMatrix type="saturate" values="0"/></filter></defs>`);
  s.push(`<rect width="${W}" height="${H}" fill="url(#sky)"/><rect y="960" width="${W}" height="120" fill="${L.fg}"/>`);
  const labels = ['WIDE · solid shape', 'MID · + rim light', 'CLOSE · + interior detail'];
  for (let i = 0; i < 3; i++) {
    const x0 = 330 + i * 630, rimA = i === 0 ? 0 : L.rim.a, det = i === 2 ? 1 : 0;
    const rim = {...L.rim, a: rimA};
    s.push(figure({x: x0 - 120, y: 965, h: 560, d: 1, kind: 'woman', hat: 'lady', fill: L.fg, det, rim, tones: {tone: L.tone, lite: L.lite}, an: {tilt: 4}}));
    s.push(figure({x: x0 + 130, y: 965, h: 640, d: -1, kind: 'man', hat: 'cap', pose: 'wave', coat: 'jacket', fill: L.accent, det, rim, tones: MICHAEL_TONES,
      an: {fArm: [30, 8], hatInHand: true, tilt: 6}}));
    s.push(`<text x="${x0}" y="1032" fill="#F4EFE6" font-family="Mono" font-size="24" letter-spacing="3" text-anchor="middle">${labels[i]}</text>`);
  }
  s.push(`<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.12" style="mix-blend-mode:overlay"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${s.join('')}</svg>`;
}

// Expression sheet: Michael and a neighbour, five faces each, drawn huge so only the heads are in frame.
function renderFaces(look = 'dusk') {
  const L = LOOKS[look], s = [];
  s.push(`<defs>${grad('sky', L.sky)}<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/><feColorMatrix type="saturate" values="0"/></filter></defs>`);
  s.push(`<rect width="${W}" height="${H}" fill="url(#sky)"/>`);
  const ex = ['neutral', 'smile', 'worried', 'awe', 'set'];
  const rows = [{kind: 'man', hat: 'cap', coat: 'jacket', fill: L.accent, tones: MICHAEL_TONES, h: 1500, cy: 280},
                {kind: 'woman', hat: 'lady', coat: 'frock', fill: L.fg, tones: {tone: L.tone, lite: L.lite}, h: 1500, cy: 830}];
  rows.forEach((r, ri) => ex.forEach((e, i) => {
    const cx = 192 + i * 384;
    s.push(`<clipPath id="c${ri}${i}"><rect x="${cx - 190}" y="${ri * 540 + 4}" width="380" height="532"/></clipPath>`);
    s.push(`<g clip-path="url(#c${ri}${i})">${figure({x: cx - 20, y: r.cy + 0.93 * r.h, h: r.h, d: 1, kind: r.kind, hat: r.hat, coat: r.coat, fill: r.fill, det: 1, tones: r.tones,
      rim: {...L.rim, a: L.rim.a}, an: {expr: e}})}</g>`);
    s.push(`<text x="${cx}" y="${ri * 540 + 520}" fill="#F4EFE6" font-family="Mono" font-size="22" letter-spacing="3" text-anchor="middle">${e.toUpperCase()}</text>`);
  }));
  s.push(`<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.12" style="mix-blend-mode:overlay"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${s.join('')}</svg>`;
}

if (typeof window !== 'undefined') Object.assign(window, {renderFaces, renderScene, renderClipFrame, renderLadder, LOOKS, B, CLIPS, figure, rng, f1});
