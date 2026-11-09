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
    if (prop === 'bottle') q.push(poly(P2([[-0.017, -0.01], [0.017, -0.01], [0.017, 0.07], [0.008, 0.078], [0.008, 0.1], [-0.008, 0.1], [-0.008, 0.078], [-0.017, 0.07]]), c)); // a medicine bottle held up
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
    } else if (!(an.legs && an.legs[0] > 60)) g.push(`<ellipse cx="${f1(X(0.135))}" cy="${f1(Y(0.012))}" rx="${f1(0.04 * h)}" ry="${f1(0.014 * h)}" fill="${c}"/>`); // a toe below the hem
    // back arm
    limb([[-0.02, sh[1]], bE], armW * 1.1); limb([bE, bH], armW * 0.82); g.push(hand(c, bE, bH));
    // torso
    if (kind === 'man') {
      const hem = coat === 'vest' ? 0.52 : coat === 'jacket' ? 0.47 : coat === 'sack' ? 0.42 : 0.33;
      const hf = coat === 'frock' ? 0.125 : coat === 'vest' ? 0.095 : 0.105, hb = coat === 'frock' ? -0.155 : coat === 'vest' ? -0.11 : -0.125;
      shape([['M', -0.035, 0.872], ['Q', -0.095, 0.866, -0.112, 0.8], ['Q', -0.132, 0.72, -0.106, 0.66], ['L', hb, hem - 0.01], ['L', hf, hem], ['L', 0.097, 0.62], ['Q', 0.13, 0.75, 0.104, 0.81], ['Q', 0.088, 0.866, 0.035, 0.872]]);
    } else if (kind === 'woman') {
      shape([['M', -0.03, 0.868], ['Q', -0.08, 0.862, -0.092, 0.8], ['Q', -0.1, 0.7, -0.055, 0.6], ['L', 0.055, 0.6], ['L', 0.07, 0.68], ['Q', 0.112, 0.75, 0.086, 0.815], ['Q', 0.072, 0.864, 0.03, 0.868]]);
      const seated = !an.standing && (an.legs && an.legs[0] > 60); // an.standing: a standing or walking figure whose thigh is raised (a stair step) keeps her standing skirt
      if (seated) { // a seated skirt: over the lap to the knee, then down to the floor (the floor is at 0.22 when sitting)
        shape([['M', 0.055, 0.61], ['Q', 0.06, 0.53, 0.13, 0.52], ['L', 0.25, 0.52], ['Q', 0.27, 0.4, 0.27, 0.235], ['L', 0.06, 0.235], ['L', 0.0, 0.47], ['Q', -0.1, 0.46, -0.075, 0.61]]);
        g.push(`<ellipse cx="${f1(X(0.29))}" cy="${f1(Y(0.232))}" rx="${f1(0.035 * h)}" ry="${f1(0.013 * h)}" fill="${c}"/>`);
      } else if (has('plain')) shape([['M', 0.055, 0.61], ['Q', 0.085, 0.35, 0.14, 0.0], ['L', -0.14, 0.0], ['Q', -0.11, 0.35, -0.065, 0.61]]); // a plain working skirt
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
      const sat = an.legs && an.legs[0] > 60;
      if (has('apron') && kind === 'woman') g.push((sat ? `<path d="${PD([['M', 0.0, 0.6], ['L', 0.06, 0.6], ['Q', 0.08, 0.53, 0.14, 0.53], ['L', 0.25, 0.53], ['L', 0.26, 0.4], ['L', 0.1, 0.42], ['Q', 0.02, 0.45, 0.0, 0.6]])} Z" fill="${pale}" opacity="${op}"/>` : `<path d="${PD([['M', -0.01, 0.6], ['L', 0.062, 0.6], ['Q', 0.1, 0.32, 0.128, 0.1], ['L', 0.01, 0.08], ['Q', -0.02, 0.35, -0.01, 0.6]])} Z" fill="${pale}" opacity="${op}"/>`) +
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
      if (!(an.legs && an.legs[0] > 60)) for (const [a0, a1] of [[0.03, 0.08], [-0.03, -0.02], [-0.1, -0.12]]) g.push(`<path d="M${f1(X(a0))},${f1(Y(0.58))} Q${f1(X(a0 + 0.02))},${f1(Y(0.3))} ${f1(X(a1))},${f1(Y(0.03))}" stroke="${tone}" stroke-width="${f1(0.006 * h)}" fill="none"/>`);
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

/* ---------- texture: surfaces that aren't flat ---------- */
// texDef returns an SVG filter that mottles whatever it's applied to: broad light and dark patches (like weathered paint or
// stone) plus a fine grain, kept inside the shapes. Region is in the element's own coordinates (for a camera-transformed layer,
// pass the visible world rectangle), so the texture is fixed to the surfaces and moves with them.
function texDef(id, x, y, w, h, {soft = 0.006, fine = 0.09, k = 0.3, seed = 1} = {}) {
  const a = f1(k * 100) / 100;
  return `<filter id="${id}" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" color-interpolation-filters="sRGB">` +
    `<feTurbulence type="fractalNoise" baseFrequency="${soft}" numOctaves="3" seed="${seed}" result="n1"/>` +
    `<feTurbulence type="fractalNoise" baseFrequency="${fine}" numOctaves="2" seed="${seed + 7}" result="n2"/>` +
    `<feComposite in="n1" in2="n2" operator="arithmetic" k1="0" k2="0.7" k3="0.3" k4="0" result="n"/>` +
    `<feColorMatrix in="n" type="matrix" values="0 0 0 0 0.93  0 0 0 0 0.94  0 0 0 0 0.9  ${a * 2} 0 0 0 ${-a}" result="lt"/>` +
    `<feComposite in="lt" in2="SourceGraphic" operator="in" result="ltIn"/>` +
    `<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${-a * 2} 0 0 0 ${a}" result="dk"/>` +
    `<feComposite in="dk" in2="SourceGraphic" operator="in" result="dkIn"/>` +
    `<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="ltIn"/><feMergeNode in="dkIn"/></feMerge></filter>`;
}
// Patterns for surfaces: brick courses, wooden planks, iron rivets. Use as fill="url(#brickT)" over a shape at low opacity.
const TEX_PATTERNS = `<pattern id="brickT" width="24" height="12" patternUnits="userSpaceOnUse"><rect width="24" height="12" fill="none" stroke="#000" stroke-width="1"/><line x1="12" y1="6" x2="12" y2="12" stroke="#000" stroke-width="1"/><line x1="0" y1="6" x2="24" y2="6" stroke="#000" stroke-width="1"/></pattern>` +
  `<pattern id="planksT" width="40" height="10" patternUnits="userSpaceOnUse"><line x1="0" y1="9.5" x2="40" y2="9.5" stroke="#000" stroke-width="1"/><line x1="${23}" y1="0" x2="23" y2="10" stroke="#000" stroke-width="0.8"/></pattern>` +
  `<pattern id="rivetsT" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="1.6" fill="#000"/></pattern>` +
  `<pattern id="hatchT" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="8" stroke="#DFE0D6" stroke-width="0.8"/></pattern>`;
// The visible world rectangle of a camera layer (zoom z around world point ux, uy, with parallax p).
function visibleRect(c, p, pad = 80) { const zp = 1 + (c.z - 1) * p, ax = 960 + (c.ux - 960) * p, ay = 540 + (c.uy - 540) * p; return [ax - 960 / zp - pad, ay - 540 / zp - pad, 1920 / zp + 2 * pad, 1080 / zp + 2 * pad]; }
if (typeof window !== 'undefined') Object.assign(window, {texDef, visibleRect});

/* ---------- materials: each surface its own look (round 9) ---------- */
// The round-8 mottle filter treated everything the same; these give each material its own character instead.
// MAT_DEFS goes inside a scene's <defs> once.
const MAT_DEFS = `<linearGradient id="matFloorShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.55"/><stop offset="0.55" stop-color="#000" stop-opacity="0.15"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient><linearGradient id="matIronH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.35"/><stop offset="0.28" stop-color="#DFE0D6" stop-opacity="0.13"/><stop offset="0.45" stop-color="#DFE0D6" stop-opacity="0.04"/><stop offset="1" stop-color="#000" stop-opacity="0.4"/></linearGradient>` +
  `<linearGradient id="matSootB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></linearGradient>` +
  `<linearGradient id="matSootT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.4"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>` +
  ['3E5F5A', '5F857F', '2B4744', 'A3BAB2', '1F3735', 'DFE0D6'].map((c) => `<radialGradient id="puff${c}"><stop offset="0" stop-color="#${c}" stop-opacity="1"/><stop offset="0.55" stop-color="#${c}" stop-opacity="0.7"/><stop offset="1" stop-color="#${c}" stop-opacity="0"/></radialGradient>`).join('') +
  `<pattern id="mortar" width="24" height="12" patternUnits="userSpaceOnUse"><path d="M0,0.5 H24 M0,6.5 H24 M0.5,0 V6 M12.5,6 V12" stroke="#000" stroke-width="1" fill="none"/></pattern>`;
const shade = (hex, k) => { // lighten (k > 0) or darken (k < 0) a #rrggbb colour
  const n = parseInt(hex.slice(1), 16), f = (v) => Math.max(0, Math.min(255, Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k))));
  return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(f).map((v) => v.toString(16).padStart(2, '0')).join('');
};
const MAT = {
  // brick: individual bricks a little lighter or darker than the wall, mortar lines, soot near the ground or the roofline
  brick(x, y, w, h, {base = '#1F3532', seed = 1, bw = 24, bh = 12, vary = 0.3, soot = 'bottom', op = 1} = {}) {
    const r = rng(seed), s = [`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${base}"/>`];
    for (let row = 0, yy = y; yy < y + h; row++, yy += bh) for (let xx = x - (row % 2 ? bw / 2 : 0); xx < x + w; xx += bw) {
      if (r() > vary) continue;
      const k = (r() - 0.5) * 0.36, x0 = Math.max(x, xx), x1 = Math.min(x + w, xx + bw - 1);
      if (x1 > x0) s.push(`<rect x="${f1(x0)}" y="${f1(yy + 1)}" width="${f1(x1 - x0)}" height="${f1(Math.min(bh - 1, y + h - yy - 1))}" fill="${shade(base, k)}"/>`);
    }
    s.push(`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="url(#mortar)" opacity="0.5"/>`);
    if (soot === 'bottom') s.push(`<rect x="${f1(x)}" y="${f1(y + h * 0.55)}" width="${f1(w)}" height="${f1(h * 0.45)}" fill="url(#matSootB)"/>`);
    if (soot === 'top') s.push(`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h * 0.35)}" fill="url(#matSootT)"/>`);
    return `<g opacity="${op}">${s.join('')}</g>`;
  },
  // rough stone: irregular blocks in rows, each its own tone, deep joints
  stone(x, y, w, h, {base = '#26403C', seed = 2, bh = 22, vary = 0.4} = {}) {
    const r = rng(seed), s = [`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${shade(base, -0.35)}"/>`];
    for (let yy = y; yy < y + h; yy += bh) { let xx = x - r() * 20; const rh = Math.min(bh, y + h - yy);
      while (xx < x + w) { const bw2 = 26 + r() * 40, x0 = Math.max(x, xx + 1.5), x1 = Math.min(x + w, xx + bw2 - 1.5);
        if (x1 > x0) s.push(`<rect x="${f1(x0)}" y="${f1(yy + 1.5)}" width="${f1(x1 - x0)}" height="${f1(rh - 3)}" rx="3" fill="${shade(base, (r() - 0.5) * vary)}"/>`);
        xx += bw2; } }
    return s.join('');
  },
  // planks: boards that vary board by board, with a seam between each and the odd knot
  planks(x, y, w, h, {base = '#1A2B29', seed = 3, size = 14, vertical = false} = {}) {
    const r = rng(seed), s = [`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${base}"/>`], L = vertical ? w : h;
    for (let p = 0; p < L; p += size) { const k = (r() - 0.5) * 0.3, sz = Math.min(size - 1, L - p);
      s.push(vertical ? `<rect x="${f1(x + p)}" y="${f1(y)}" width="${f1(sz)}" height="${f1(h)}" fill="${shade(base, k)}"/>` : `<rect x="${f1(x)}" y="${f1(y + p)}" width="${f1(w)}" height="${f1(sz)}" fill="${shade(base, k)}"/>`);
      if (r() < 0.25) { const kx = vertical ? x + p + size / 2 : x + r() * w, ky = vertical ? y + r() * h : y + p + size / 2; s.push(`<ellipse cx="${f1(kx)}" cy="${f1(ky)}" rx="2.5" ry="1.4" fill="${shade(base, -0.4)}"/>`); } }
    return s.join('');
  },
  // floor: the floor seen going back to the wall (a band from yBack, the wall's foot, to yFront, the cut edge), so people and furniture
  // stand ON something. kind 'flag' (flagstones, rows growing toward the front), 'cobble' (a street), 'planks' (boards running back
  // to a vanishing point). A contact shadow along the wall and a lit lip along the front edge.
  floor(x0, x1, yBack, yFront, {kind = 'flag', base = '#2A4542', seed = 9, size = 34, vp = null} = {}) {
    const r = rng(seed), D = yFront - yBack, cid = `flc${seed}_${Math.round(x0)}`, s = [`<clipPath id="${cid}"><rect x="${f1(x0)}" y="${f1(yBack - 8)}" width="${f1(x1 - x0)}" height="${f1(D + 8)}"/></clipPath><g clip-path="url(#${cid})">`, `<rect x="${f1(x0)}" y="${f1(yBack)}" width="${f1(x1 - x0)}" height="${f1(D)}" fill="${shade(base, -0.45)}"/>`];
    if (kind === 'planks') {
      const v = vp ?? (x0 + x1) / 2, k = 0.82;
      for (let x = x0 - (x1 - x0) * 0.2; x < x1 + (x1 - x0) * 0.2; x += size) {
        const bx = (xx) => v + (xx - v) * k, a = x + 1, b = x + size - 1;
        s.push(`<polygon points="${f1(a)},${f1(yFront)} ${f1(b)},${f1(yFront)} ${f1(bx(b))},${f1(yBack)} ${f1(bx(a))},${f1(yBack)}" fill="${shade(base, (r() - 0.5) * 0.3)}"/>`);
        if (r() < 0.5) { const u = 0.2 + r() * 0.7, yy = yBack + D * u, xa = bx(a) + (a - bx(a)) * u, xb = bx(b) + (b - bx(b)) * u; s.push(`<rect x="${f1(xa)}" y="${f1(yy)}" width="${f1(xb - xa)}" height="1.2" fill="${shade(base, -0.5)}"/>`); } // board ends
      }
    } else {
      const n = kind === 'cobble' ? 5 : 4, sz = kind === 'cobble' ? size * 0.5 : size;
      for (let i = 0; i < n; i++) {
        const u0 = (i / n) ** 1.3, u1 = ((i + 1) / n) ** 1.3, ya = yBack + D * u0, yb = yBack + D * u1, sc = 0.55 + 0.45 * (u0 + u1) / 2;
        // stones laid out along the front edge, then drawn in perspective: their side joints lean toward a vanishing point
        const v = vp ?? (x0 + x1) / 2, kk = (y) => 0.8 + 0.2 * (y - yBack) / D, P = (x, y) => `${f1(v + (x - v) * kk(y))},${f1(y)}`;
        const ka = kk(ya + 1.2), kb = kk(yb - 1.2), fx0 = v + (x0 - v) / Math.min(ka, kb), fx1 = v + (x1 - v) / Math.min(ka, kb);
        let xx = fx0 - r() * sz * 2;
        while (xx < fx1) { const w = sz * (1.1 + r() * (kind === 'cobble' ? 0.6 : 1.6)), a = xx + 1.6, b = xx + w - 1.6;
          s.push(`<polygon points="${P(a, yb - 1.2)} ${P(b, yb - 1.2)} ${P(b, ya + 1.2)} ${P(a, ya + 1.2)}" fill="${shade(base, (r() - 0.5) * 0.34 + 0.1 * (u0 - 0.5))}"/>`);
          xx += w; }
      }
    }
    s.push(`<rect x="${f1(x0)}" y="${f1(yBack)}" width="${f1(x1 - x0)}" height="${f1(D)}" fill="url(#matFloorShade)"/>`);                       // darker toward the wall: it reads as going back
    s.push(`<rect x="${f1(x0)}" y="${f1(yBack - 6)}" width="${f1(x1 - x0)}" height="8" fill="#070C0C" opacity="0.85"/>`);                    // the line where wall meets floor
    s.push(`<rect x="${f1(x0)}" y="${f1(yFront - 2)}" width="${f1(x1 - x0)}" height="2" fill="#DFE0D6" opacity="0.14"/>`);            // the lit front lip
    return s.join('') + '</g>';
  },
  // a soft shadow where something stands on a floor
  shadow(x, y, w, op = 0.4) { return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(w)}" ry="${f1(Math.max(2.5, w * 0.14))}" fill="#000" opacity="${op}"/>`; },
  // iron: a round highlight so a cylinder reads as round, seams of rivets
  iron(x, y, w, h, {base = '#0B1615', rx = 0, seams = 60, rivet = 7} = {}) {
    const s = [`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${rx}" fill="${base}"/>`, `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${rx}" fill="url(#matIronH)"/>`];
    for (let yy = y + seams / 2; yy < y + h - 6; yy += seams) { s.push(`<rect x="${f1(x + 2)}" y="${f1(yy)}" width="${f1(w - 4)}" height="1.5" fill="#000" opacity="0.5"/>`); for (let xx = x + rivet; xx < x + w - 3; xx += rivet * 2) s.push(`<circle cx="${f1(xx)}" cy="${f1(yy + 4)}" r="1.4" fill="#DFE0D6" opacity="0.18"/>`); }
    return s.join('');
  },
  // water: darker with depth, ripple bands that drift at different speeds, a few glints
  water(x, y, w, h, t, {top = '#2B4A47', bottom = '#0E1A19', seed = 4, glint = '#DFE0D6', n = 60} = {}) {
    const r = rng(seed), id = `wg${seed}`;
    const s = [`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient><rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="url(#${id})"/>`];
    for (let i = 0; i < n; i++) { const d = r() ** 1.8, yy = y + 4 + d * Math.min(h, 400), sp = 6 + (1 - d) * 14, len = (20 + r() * 70) * (1 - d * 0.5), xx = x + ((r() * w + t * sp * (r() < 0.5 ? 1 : -0.6)) % w + w) % w;
      s.push(`<rect x="${f1(xx)}" y="${f1(yy)}" width="${f1(len)}" height="${f1(1.5 + (1 - d) * 1.5)}" rx="1" fill="${r() < 0.6 ? shade(top, 0.25) : shade(bottom, -0.3)}" opacity="${f1((0.5 - d * 0.35) * 100) / 100}"/>`); }
    for (let i = 0; i < 8; i++) { const gx = x + r() * w, gy = y + 4 + r() * 40, a = Math.max(0, Math.sin(t * (2 + r() * 2) + i * 2.3)); s.push(`<rect x="${f1(gx)}" y="${f1(gy)}" width="${f1(6 + r() * 10)}" height="1.5" fill="${glint}" opacity="${f1(0.55 * a * 100) / 100}"/>`); }
    return s.join('');
  },
  // smoke: billowing puffs that rise, swell, drift with the wind and thin out
  smoke(x, y, t, {col = '3E5F5A', k = 1, n = 7, rise = 170, drift = 120, speed = 6, seed = 5} = {}) {
    const r = rng(seed), s = [];
    for (let i = 0; i < n; i++) { const ph = (t / speed + i / n) % 1, a = 0.6 * Math.pow(1 - ph, 1.3) * Math.min(1, ph * 5), R0 = (9 + ph * 46) * k;
      const cx = x + ph * drift * k + 6 * Math.sin(t * 0.7 + i), cy = y - ph * rise * k;
      for (let j = 0; j < 3; j++) { const ox = (r() - 0.5) * R0 * 0.9, oy = (r() - 0.5) * R0 * 0.5, rr = R0 * (0.6 + r() * 0.5); s.push(`<circle cx="${f1(cx + ox)}" cy="${f1(cy + oy)}" r="${f1(rr)}" fill="url(#puff${col})" opacity="${f1(a * 100) / 100}"/>`); } }
    return s.join('');
  },
  // the ground's edge: pebbles and a few tufts of grass along a surface line
  ground(x0, x1, y, {base = '#0D0C09', seed = 6, tufts = true} = {}) {
    const r = rng(seed), s = [];
    for (let x = x0; x < x1; x += 6 + r() * 14) { s.push(`<ellipse cx="${f1(x)}" cy="${f1(y + 3 + r() * 16)}" rx="${f1(1.5 + r() * 3)}" ry="${f1(1 + r() * 1.6)}" fill="${shade(base, 0.12 + r() * 0.12)}"/>`);
      if (tufts && r() < 0.12) s.push(`<path d="M${f1(x)},${y + 1} l-3,-8 M${f1(x)},${y + 1} l1,-10 M${f1(x)},${y + 1} l4,-7" stroke="${base}" stroke-width="1.5" fill="none"/>`); }
    return s.join('');
  },
  // trees along a ridge: pointed firs and round crowns, sized for the distance
  trees(points, {col = '#2B4744', seed = 7, size = 26, every = 0.45} = {}) {
    const r = rng(seed), s = [];
    for (let i = 0; i < points.length - 1; i++) { const [xa, ya] = points[i], [xb, yb] = points[i + 1];
      for (let u = 0; u < 1; u += 0.18) { if (r() > every) continue; const x = xa + (xb - xa) * u, y = ya + (yb - ya) * u + 4, hh = size * (0.6 + r() * 0.7);
        s.push(r() < 0.6 ? `<path d="M${f1(x - hh * 0.3)},${f1(y)} L${f1(x)},${f1(y - hh)} L${f1(x + hh * 0.3)},${f1(y)} Z" fill="${col}"/>` : `<circle cx="${f1(x)}" cy="${f1(y - hh * 0.4)}" r="${f1(hh * 0.4)}" fill="${col}"/>`); } }
    return s.join('');
  },
};
if (typeof window !== 'undefined') Object.assign(window, {MAT, MAT_DEFS, shade});
