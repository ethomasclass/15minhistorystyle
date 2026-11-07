// rig.js: the Gilded Age series' character model, drawn in code. Load it before any scene file.
//
// figure(o) returns one character as SVG: a profile silhouette built from a rig (limbs are tapered strokes between joints), with
// three levels of detail that follow its size on screen (solid shape, + rim light, + interior detail and a face), five expressions,
// clothing options, props, and poses. cast(name, overrides) gives the series' recurring characters; POSES gives reusable actions;
// walkAn / walkPhase give a walk that keeps planted feet still. Everything is a pure function of time, so a scene can be rendered
// frame by frame (Playwright today, Remotion later: drop the returned SVG into an <svg> or a dangerouslySetInnerHTML).
//
// Units inside a figure: height 1, feet at y 0, +y up; d = facing (+1 right, -1 left). Angles are degrees from straight up,
// positive toward the way the figure faces.

let SMOOTH_MOTION = true; // characters animate at the full frame rate (Nov 2026 note: 12-a-second steps blurred the faces)

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
const step12 = (t) => (SMOOTH_MOTION ? t : Math.floor(t * 12 + 1e-6) / 12); // drawn motion; full rate when SMOOTH_MOTION

/* ---------- figures (rigs with three levels of detail) ---------- */
// Units: height 1, feet at 0, +y up. d = facing (+1 right, -1 left). Limbs are strokes, so animating is turning joints.
// o.an: animation {lean (deg), bob, tilt (head, deg, + looks up), fArm [shoulder, elbow], bArm, legs [a, b], hatInHand, blink,
//       childWave}. Angles are degrees from straight up, positive toward the way the figure faces.
// o.det 0..1: interior detail. o.rim {c, a, dx, dy}: rim light (offset in figure heights). o.tones {tone, lite}: detail colours.
function figure(o) {
  const {x, y, h, d = 1, kind = 'man', hat = 'bowler', pose = 'stand', beard = false, coat = 'frock', fill, an = {}, det = 0, rim = null, tones = {tone: '#2E403D', lite: '#5C7772'}, wear = [], prop = null} = o;
  const has = (w) => wear.includes(w);
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

  // a hand: a mitten along the forearm with a thumb, so a hand reads as a hand and not a ball
  function hand(c, e, hp) {
    const ang = Math.atan2(-(hp[1] - e[1]), hp[0] - e[0]) * d; // screen angle of the forearm
    const r = armW * h, cx = X(hp[0]) + Math.cos(ang) * r * 0.25, cy = Y(hp[1]) + Math.sin(ang) * r * 0.25;
    return `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(r * 0.62)}" ry="${f1(r * 0.48)}" transform="rotate(${f1(ang * 180 / Math.PI)}, ${f1(cx)}, ${f1(cy)})" fill="${c}"/>` +
      `<circle cx="${f1(cx + Math.cos(ang - 1.3 * d) * r * 0.45)}" cy="${f1(cy + Math.sin(ang - 1.3 * d) * r * 0.45)}" r="${f1(r * 0.22)}" fill="${c}"/>`;
  }
  // props held in the front hand
  function propAt(c) {
    const [hx, hy] = fH, q = [];
    const P2 = (a) => P(a.map(([u, v]) => [hx + u, hy + v]));
    if (prop === 'glass') q.push(poly(P2([[-0.016, 0.0], [0.016, 0.0], [0.02, 0.06], [-0.02, 0.06]]), c));
    if (prop === 'iron') q.push(poly(P2([[-0.05, -0.04], [0.06, -0.04], [0.04, -0.005], [-0.04, -0.005]]), c), poly(P2([[-0.02, -0.005], [0.02, -0.005], [0.012, 0.015], [-0.012, 0.015]]), c));
    if (prop === 'spoon') q.push(line(P2([[0, 0], [0.025, -0.11]]), c, 0.012 * h));
    if (prop === 'hammer') q.push(line(P2([[0, 0], [0.0, 0.09]]), c, 0.012 * h), poly(P2([[-0.03, 0.08], [0.03, 0.08], [0.03, 0.11], [-0.03, 0.11]]), c));
    if (prop === 'paper') q.push(poly(P2([[-0.02, -0.06], [0.1, -0.05], [0.1, 0.1], [-0.02, 0.09]]), c));
    if (prop === 'needle') q.push(line(P2([[0, 0], [0.01, 0.035]]), c, 0.004 * h));
    if (prop === 'bowl') q.push(`<path d="${PD([['M', hx - 0.04, hy + 0.01], ['Q', hx, hy - 0.05, hx + 0.04, hy + 0.01]])} Z" fill="${c}"/>`);
    return q.join('');
  }
  function body(c) {
    const g = [];
    const limb = (a, w) => g.push(line(P(a), c, w * h));
    const shape = (cmds) => g.push(`<path d="${PD(cmds)} Z" fill="${c}" stroke="${c}" stroke-width="${f1(0.012 * h)}" stroke-linejoin="round"/>`);
    const dot = (lx, ly, r) => g.push(`<circle cx="${f1(X(lx))}" cy="${f1(Y(ly))}" r="${f1(r * h)}" fill="${c}"/>`);
    // legs + shoes
    if (kind !== 'woman') for (const [i, [knee, ank]] of legJ.entries()) {
      const kn = has('knickers'); limb([[hipX(i), hip], knee], legW * (kn ? 1.35 : 1.12)); limb([knee, ank], legW * (kn ? 0.6 : 0.82));
      const gy = Math.max(ank[1] - 0.03, 0), ax = ank[0]; // a boot: heel, instep, a rounded toe
      g.push(`<path d="${PD([['M', ax - 0.034, gy + 0.045], ['L', ax + 0.026, gy + 0.042], ['Q', ax + 0.05, gy + 0.03, ax + 0.078, gy + 0.018], ['Q', ax + 0.088, gy + 0.004, ax + 0.076, gy], ['L', ax - 0.036, gy]])} Z" fill="${c}"/>`);
    } else g.push(`<ellipse cx="${f1(X(0.135))}" cy="${f1(Y(0.012))}" rx="${f1(0.04 * h)}" ry="${f1(0.014 * h)}" fill="${c}"/>`); // a toe below the hem
    // back arm
    limb([[-0.02, sh[1]], bE], armW * 1.1); limb([bE, bH], armW * 0.82); g.push(hand(c, bE, bH));
    // torso
    if (kind === 'man') {
      const hem = coat === 'vest' ? 0.52 : coat === 'jacket' ? 0.47 : coat === 'sack' ? 0.42 : 0.33;
      const hf = coat === 'frock' ? 0.125 : coat === 'vest' ? 0.095 : 0.105, hb = coat === 'frock' ? -0.155 : coat === 'vest' ? -0.11 : -0.125;
      shape([['M', -0.035, 0.872], ['Q', -0.095, 0.866, -0.112, 0.8], ['Q', -0.132, 0.72, -0.106, 0.66], ['L', hb, hem - 0.01], ['L', hf, hem], ['L', 0.097, 0.62], ['Q', 0.13, 0.75, 0.104, 0.81], ['Q', 0.088, 0.866, 0.035, 0.872]]);
    } else if (kind === 'woman') {
      shape([['M', -0.03, 0.868], ['Q', -0.08, 0.862, -0.092, 0.8], ['Q', -0.1, 0.7, -0.055, 0.6], ['L', 0.055, 0.6], ['L', 0.07, 0.68], ['Q', 0.112, 0.75, 0.086, 0.815], ['Q', 0.072, 0.864, 0.03, 0.868]]);
      if (has('plain')) shape([['M', 0.055, 0.61], ['Q', 0.085, 0.35, 0.14, 0.0], ['L', -0.14, 0.0], ['Q', -0.11, 0.35, -0.065, 0.61]]); // a plain working skirt
      else shape([['M', 0.055, 0.61], ['Q', 0.085, 0.35, 0.15, 0.0], ['L', -0.17, 0.0], ['Q', -0.14, 0.2, -0.16, 0.34], ['Q', -0.235, 0.42, -0.2, 0.53], ['Q', -0.15, 0.6, -0.055, 0.61]]); // a bustle
      if (has('shawl')) shape([['M', -0.04, 0.874], ['Q', -0.13, 0.86, -0.14, 0.74], ['L', -0.13, 0.52], ['L', -0.04, 0.6], ['L', 0.104, 0.66], ['Q', 0.12, 0.8, 0.07, 0.862]]);
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
    if ((kind === 'woman' || kind === 'girl') && hat !== 'kerchief') hg.push(`<circle cx="${f1(X(-0.06))}" cy="${f1(Y(headY + 0.02))}" r="${f1(0.032 * h)}" fill="${c}"/>`);
    if (hat === 'kerchief') { hg.push(`<path d="M${hpS(-0.07, -0.005)} Q${hpS(-0.07, 0.085)} ${hpS(0.01, 0.084)} Q${hpS(0.06, 0.082)} ${hpS(0.056, 0.04)} L${hpS(0.02, 0.05)} Q${hpS(-0.03, 0.04)} ${hpS(-0.04, -0.03)} Z" fill="${c}"/>`); hg.push(poly([HP(-0.068, 0.0), HP(-0.1, -0.05), HP(-0.058, -0.035)], c)); }
    if (hat === 'kippah') hg.push(`<ellipse cx="${f1(X(-0.01))}" cy="${f1(Y(top - 0.004))}" rx="${f1(0.042 * h)}" ry="${f1(0.016 * h)}" fill="${c}"/>`);
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
    if (c === fill) { // pale cloth: aprons and a maid's cap read even in a wide shot
      const pale = tones.lite, op = f1((0.55 + 0.45 * det) * 100) / 100;
      if (has('apron') && kind === 'woman') g.push(`<path d="${PD([['M', -0.01, 0.6], ['L', 0.062, 0.6], ['Q', 0.1, 0.32, 0.128, 0.1], ['L', 0.01, 0.08], ['Q', -0.02, 0.35, -0.01, 0.6]])} Z" fill="${pale}" opacity="${op}"/>` +
        (has('bib') ? `<path d="${PD([['M', 0.012, 0.6], ['L', 0.068, 0.6], ['L', 0.078, 0.74], ['L', 0.03, 0.75]])} Z" fill="${pale}" opacity="${op}"/>` : ''));
      if (has('apron') && kind === 'man') g.push(`<path d="${PD([['M', -0.02, 0.56], ['L', 0.1, 0.56], ['L', 0.115, 0.22], ['L', -0.01, 0.2]])} Z" fill="${pale}" opacity="${op}"/>`);
      if (hat === 'maid') g.push(`<g transform="${headRot}"><path d="M${hpS(-0.05, 0.05)} Q${hpS(-0.02, 0.1)} ${hpS(0.035, 0.07)} L${hpS(0.03, 0.055)} Q${hpS(-0.01, 0.07)} ${hpS(-0.045, 0.035)} Z" fill="${pale}" opacity="${op}"/></g>`);
    }
    // front arm, hat in hand, cane, parasol
    limb([[0.02, sh[1]], fE], armW * 1.1); limb([fE, fH], armW * 0.82); g.push(hand(c, fE, fH));
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
    if (prop) g.push(propAt(c));
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
      if (coat === 'vest') { // shirtsleeves: the arms go pale, a vest V and its buttons
        const sl = (e, hp) => line(P([[0.0, sh[1]], e, hp]), lite, armW * 0.7 * h, 'opacity="0.55"');
        g.push(sl(fE, fH)); g.push(ln([[0.04, 0.83], [0.06, 0.7], [0.09, 0.68]], 0.006));
      }
    } else if (kind === 'woman') {
      if (has('shawl')) g.push(ln([[-0.13, 0.66], [-0.1, 0.6], [0.0, 0.62]], 0.006));
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
  const lie = o.lie ? ` rotate(${-90 * d}, ${f1(x)}, ${f1(y)})` : '';
  return `<g transform="translate(0,${f1(-(an.bob || 0) * h)})${lie} rotate(${f1((an.lean || 0) * d)}, ${f1(x)}, ${f1(y)})">${out}</g>`;
}


// A walk cycle for the rig, locked to the ground. Each leg spends half the cycle planted: the foot slides back under the body at
// exactly the walking speed (so it does not skate), then swings forward with the knee bent. Arms counter-swing; the body is
// highest at mid-stance. walkPhase() turns distance walked into cycles; positions and poses both step at 12 drawings a second.
function walkPhase(dist, h, stride = 22) { return dist / (2 * Math.sin(stride * Math.PI / 180) * h); }
function walkAn(p, {stride = 22, arm = 18, carry = false} = {}) {
  const sm = Math.sin(stride * Math.PI / 180);
  const leg = (u) => {
    u = ((u % 1) + 1) % 1;
    if (u < 0.5) { const th = Math.asin(sm * (1 - 4 * u)) * 180 / Math.PI; return [th, th]; }
    const v = (u - 0.5) / 0.5, th = -stride * Math.cos(Math.PI * v); return [th, th - 55 * Math.sin(Math.PI * v)];
  };
  const A = leg(p), Bl = leg(p + 0.5), k = A[0] / stride, armF = carry ? 5 : arm;
  return {legs: [A[0], Bl[0]], shins: [A[1], Bl[1]], fArm: [180 + armF * k, 170 + armF * k], bArm: [180 - arm * k, 192 - arm * k * 1.2],
    bob: 0.011 * Math.cos(2 * TAU * (p - 0.25)) - 0.007};
}


// Level of detail from a figure's height on screen (px): rim light from about 140 px, full face and clothing detail from about 520.
function lodFor(hs, rimA = 0.8) { return {det: smooth(300, 520, hs), rimA: rimA * (0.3 + 0.7 * smooth(140, 320, hs))}; }

/* ---------- poses: reusable actions, each a function of time t (s) and a phase ph (0..1) that de-syncs a crowd ---------- */
const POSES = {
  stand: (t, ph = 0) => ({bob: 0.004 * Math.sin(TAU * (t / 3.4 + ph)), lean: 1.1 * Math.sin(TAU * (t / 5.5 + ph)), blink: (t + ph * 5) % 4.1 < 0.12}),
  sit: (t, ph = 0) => ({legs: [86, 80], shins: [6, 0], fArm: [140, 100], bArm: [150, 110], bob: 0.003 * Math.sin(TAU * (t / 3.6 + ph)), blink: (t + ph * 5) % 4.3 < 0.12}),
  stir: (t, ph = 0) => ({fArm: [128 + 5 * Math.sin(TAU * t * 0.8), 104 + 16 * Math.cos(TAU * t * 0.8)], bArm: [160, 120], tilt: -10, lean: 4, blink: (t + ph * 5) % 3.9 < 0.12}),
  sew: (t, ph = 0) => ({legs: [86, 80], shins: [8 + 10 * Math.sin(TAU * t * 2), 0], fArm: [116 + 3 * Math.sin(TAU * t * 2), 96], bArm: [124 + 3 * Math.sin(TAU * t * 2 + 1), 102], tilt: -12, lean: 6}),
  handsew: (t, ph = 0) => { const p = Math.max(0, Math.sin(TAU * (t * 0.6 + ph))) ** 2; return {legs: [86, 80], shins: [6, 0], fArm: [124 - 34 * p, 84 - 50 * p], bArm: [130, 92], tilt: -14 + 6 * p, lean: 5}; },
  iron: (t, ph = 0) => ({fArm: [112 + 14 * Math.sin(TAU * t * 0.7), 98 + 14 * Math.sin(TAU * t * 0.7)], bArm: [150, 120], tilt: -12, lean: 7}),
  drink: (t, ph = 0) => { const p = smooth(0.2, 0.5, (t / 5 + ph) % 1) * (1 - smooth(0.6, 0.85, (t / 5 + ph) % 1)); return {fArm: [150 - 30 * p, 128 - 163 * p], bArm: [150, 110], tilt: 8 * p, lean: -2 * p}; },
  wipe: (t, ph = 0) => ({fArm: [112, 86 + 18 * Math.sin(TAU * t * 1.4)], bArm: [118, 92], tilt: -8}),
  hammer: (t, ph = 0) => { const p = Math.abs(Math.sin(TAU * t * 1.2)); return {legs: [86, 80], shins: [6, 0], fArm: [70 + 50 * p, 60 + 70 * p], bArm: [125, 100], tilt: -14, lean: 8}; },
  rock: (t, ph = 0) => ({legs: [86, 80], shins: [6, 0], fArm: [120 + 12 * Math.sin(TAU * t * 0.5), 110], bArm: [150, 110], tilt: -10, lean: 4 + 2 * Math.sin(TAU * t * 0.5)}),
  read: (t, ph = 0) => ({legs: [86, 80], shins: [6, 0], fArm: [100, 60], bArm: [105, 65], tilt: -6 + 2 * Math.sin(TAU * t * 0.2), blink: (t + ph * 5) % 4.5 < 0.12}),
  sleep: (t, ph = 0) => ({fArm: [180, 180], bArm: [180, 180], bob: 0.003 * Math.sin(TAU * t / 4), blink: true}),
};

/* ---------- the cast: the series' recurring characters ---------- */
// The Kellys are coral (the one colour a subject gets); everyone else is ink. Names are still to be decided, so these are roles.
const NEIGHBOUR_TONES = {tone: '#2E403D', lite: '#5C7772'};
const CAST = {
  michael: {kind: 'man', hat: 'cap', coat: 'jacket', scale: 1.0, kelly: true},                         // 19, refinery worker
  mother: {kind: 'woman', hat: 'kerchief', coat: 'frock', wear: ['plain', 'shawl', 'apron'], scale: 0.9, kelly: true},
  sister: {kind: 'woman', hat: 'maid', coat: 'frock', wear: ['plain', 'apron', 'bib'], scale: 0.88, kelly: true}, // a maid on Fifth Avenue (ep 2)
  brother: {kind: 'man', hat: 'boycap', coat: 'sack', wear: ['knickers'], scale: 0.8, kelly: true},                           // younger, later a ward heeler (ep 4)
  nfather: {kind: 'man', hat: 'kippah', coat: 'vest', beard: true, scale: 0.97},                       // the Jewish neighbour family (ep 3)
  nmother: {kind: 'woman', hat: 'kerchief', coat: 'frock', wear: ['plain', 'apron'], scale: 0.88},
  nson: {kind: 'boy', hat: 'boycap', scale: 0.62},
  ndaughter: {kind: 'girl', hat: 'none', scale: 0.56},
};
// cast('mother', {x, y, h, ...}) -> figure options. h is the height of a grown man at that spot; scale sets each character's height.
function cast(name, o) {
  const c = CAST[name], scale = c.scale ?? 1;
  const tones = c.kelly ? MICHAEL_TONES : (o.tones || NEIGHBOUR_TONES);
  return {...c, ...o, h: o.h * scale, fill: c.kelly ? (o.kellyFill || '#FF6F61') : o.fill, tones};
}
if (typeof window !== 'undefined') Object.assign(window, {figure, cast, CAST, POSES, lodFor, walkAn, walkPhase});
