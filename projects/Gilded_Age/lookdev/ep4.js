// Episode 4 (the machine), drawn silhouette scenes (load after ep3.js; uses rig.js, explainers.js' camera/frame/text, mansion.js'
// glow, msDefs and brougham, ep2_more.js' camAt, ep3.js' contact system E3K / E3LOG, stepWalk, e3Settle, e3Stand, e3Clasp).
//
//   ep4_fire        Cold open. Williamsburg, January 1887, 3 a.m., falling snow. A tenement burns (glow in its windows, smoke;
//                   never flames on people). Families in nightclothes in the snow; a steam pumper gallops in; the captain and three
//                   men walk in; he wraps a blanket round Mrs. Doyle and sends her and the children to his cab; then he turns to
//                   Michael Kelly on his stoop two doors down, tips his hat and speaks.
//
// Colour rules (the user's): the Kellys coral #FF6F61 only; the Rabinowitzes wheat gold #E2B864; everyone else ink; teal explains;
// orange for torn strips and handwriting; money only a small warm-gold glint (the captain's watch chain). Real people never get faces.
// Flat-ground walkers use Episode 1's walk cycle (rig.js walkAn via stepWalk), with e4Walk keeping the planted sole exactly on the
// floor, and settle with e3Settle. Every contact goes through E3K and is logged to E3LOG for the audit. No em dashes anywhere.

const E4 = {ink: '#0D0C09', coral: '#FF6F61', wheat: '#E2B864', glint: '#FFD36B', teal: '#2FE0C4', orange: '#FF9F1C', cream: '#F4EFE6',
  snow: '#C9D6D6', fire: '#FF8A3D', blanket: '#5E6A63'};

/* ---------------- shared helpers ---------------- */
// eased keys [[t, a, b], ...] -> [a, b] (arm angles, two-number tracks)
function e4Keys(KK, t, def = [176, 180]) {
  if (!KK || !KK.length) return def;
  if (t <= KK[0][0]) return [KK[0][1], KK[0][2]];
  for (let i = 1; i < KK.length; i++) if (t <= KK[i][0]) { const u = ease((t - KK[i - 1][0]) / (KK[i][0] - KK[i - 1][0])); return [lerp(KK[i - 1][1], KK[i][1], u), lerp(KK[i - 1][2], KK[i][2], u)]; }
  const L = KK[KK.length - 1]; return [L[1], L[2]];
}
// one-number eased keys [[t, v], ...]
function e4Val(KK, t) { if (t <= KK[0][0]) return KK[0][1]; for (let i = 1; i < KK.length; i++) if (t <= KK[i][0]) return lerp(KK[i - 1][1], KK[i][1], ease((t - KK[i - 1][0]) / (KK[i][0] - KK[i - 1][0]))); return KK[KK.length - 1][1]; }
// speech: spans [[t0, t1], ...] of a speaker's words. on: inside a span; jaw: the mouth's opening (syllables, closed between words)
function e4Speak(spans, t) {
  for (const [a, b] of spans) if (t > a && t < b) {
    const env = smooth(a, a + 0.08, t) * (1 - smooth(b - 0.12, b, t));
    const syl = Math.max(0, Math.sin(t * 24.0) + 0.55 * Math.sin(t * 13.3 + 1.1) + 0.35 * Math.sin(t * 6.7 + 0.4) - 0.1);
    return {on: true, jaw: 0.009 * env * Math.min(1, syl), beat: Math.max(0, Math.sin(t * 6.7 + 0.4))};
  }
  return {on: false, jaw: 0, beat: 0};
}
const e4Bump = (t, a, d) => (t > a && t < a + d ? Math.sin(Math.PI * (t - a) / d) : 0);
// Episode 1's walk (stepWalk on flat ground) with the planted sole kept exactly on the floor line: walkAn's straight stance leg is
// up to 0.006 h short at the ends of the stance and its bob lowers the body up to 0.018 h, so the stance sole wandered a few px
// above and below the floor. Here the body is moved so the lower sole is on the floor every frame (the natural bob, lowest at
// double support), and the planted foot is logged with its stance number so the audit can check that it does not slide.
function e4Walk(fo, x0, dir, s, G, name) {
  const o = stepWalk(fo, x0, dir, s, () => G, name);
  const f0 = E3K.foot(o, 0), f1 = E3K.foot(o, 1), low = Math.max(f0[1], f1[1]), o2 = {...o, y: o.y + (G - low), floorY: G};
  const child = fo.kind === 'boy' || fo.kind === 'girl', p = walkPhase(s, fo.h, child ? 26 : 22);
  [[0, p], [1, p + 0.5]].forEach(([i, q]) => { const fr = ((q % 1) + 1) % 1; if (fr < 0.5) { const g = E3K.foot(o2, i); E3K.log('plant', `${name}.${i}#${Math.floor(q)}`, [g[0], G], g, {walk: 1}); } });
  return o2;
}
// a figure that stands, walks to a place, settles, stands again: plan = {x, d, G, walks: [{t0, t1, to, dAfter, a}]}. Walks start from
// the passing pose (a quarter cycle in), so the first step lifts one foot from a standing pose. Returns {fo, state}.
function e4Track(base, plan, t, name) {
  let x = plan.x, d = plan.d ?? 1; const G = plan.G, h = base.h, child = base.kind === 'boy' || base.kind === 'girl';
  const s0 = 0.25 * 2 * Math.sin((child ? 26 : 22) * Math.PI / 180) * h;
  const stand = (st) => ({fo: e3Stand({...base, x, d, y: G, floorY: G, an: {...POSES.stand(t, plan.ph ?? 0.3), ...(base.an || {})}}, x, x, 0, name + '.stand'), state: st});
  for (let k = 0; k < plan.walks.length; k++) {
    const w = plan.walks[k];
    if (t < w.t0) return stand(k ? 'stand' : 'start');
    const dir = Math.sign(w.to - x) || d, dist = Math.abs(w.to - x), walkBase = {...base, an: {...(base.an || {}), ...(w.an || {})}};
    if (!w.carry) { delete walkBase.an.fArm; delete walkBase.an.bArm; }
    if (t < w.t1) return {fo: e4Walk(walkBase, x - dir * s0, dir, dist * e3Trap(t, w.t0, w.t1, w.a ?? 0.2) + s0, G, name), state: 'walk', u: (t - w.t0) / (w.t1 - w.t0)};
    const n0 = E3LOG.length, arrived = e4Walk(walkBase, x - dir * s0, dir, dist + s0, G, name); E3LOG.length = n0;
    if (t < w.t1 + 0.35) return {fo: e3Settle(arrived, smooth(w.t1, w.t1 + 0.35, t), name), state: 'settle'};
    const settled = e3Settle(arrived, 1, name); E3LOG.length = n0;
    x = settled.x; d = w.dAfter ?? dir;
  }
  return stand('stand');
}
// the captain (Mr. Duffy, ink): a long overcoat (the frock coat's skirt carried down below the knee), a bowler, and a small warm-gold
// glint of watch chain across the front of the coat. Draw the options from e4Track etc.
function e4CaptainOpts(o) { return {kind: 'man', hat: 'bowler', coat: 'frock', fill: E4.ink, beard: false, ...o, an: {...(o.an || {})}}; }
function e4Captain(fo, glint = 1) {
  const d = fo.d ?? 1, an = fo.an || {}, legs = an.legs || [9, -8], sw = (legs[0] + legs[1]) / 2 * 0.003;
  const W = (lx, ly) => E3K.toWorld(fo, lx, ly), P = (a) => a.map(([lx, ly]) => W(lx, ly));
  const skirt = P([[-0.15, 0.38], [0.122, 0.38], [0.142 + sw, 0.2], [0.02 + sw, 0.185], [-0.172 + sw, 0.2]]);
  const rimSk = fo.rim && fo.rim.a > 0.01 ? `<g transform="translate(${f1(fo.rim.dx * fo.h)},${f1(fo.rim.dy * fo.h)})" opacity="${f1(fo.rim.a * 100) / 100}">${poly(skirt, fo.rim.c)}</g>` : '';
  const g0 = W(0.086, 0.6), g1 = W(0.05, 0.565), g2 = W(0.012, 0.598), sp = 0.55 + 0.45 * Math.max(0, Math.sin((fo.x * 0.01) + (an.glintT ?? 0) * 2.3));
  const chain = glint > 0 ? `<path d="M${f1(g0[0])},${f1(g0[1])} Q${f1(g1[0])},${f1(g1[1])} ${f1(g2[0])},${f1(g2[1])}" stroke="${E4.glint}" stroke-width="${f1(Math.max(1.2, 0.0055 * fo.h))}" fill="none" stroke-linecap="round" opacity="${f1(0.9 * glint)}"/>` +
    `<circle cx="${f1(g0[0])}" cy="${f1(g0[1])}" r="${f1(Math.max(1.4, 0.0075 * fo.h) * sp)}" fill="#FFF1C2" opacity="${f1(0.85 * glint)}"/>` : '';
  return e3Shadow(fo, fo.h) + rimSk + poly(skirt, fo.fill) + figure(fo) + chain; // (toWorld already carries lean and bob)
}
// a fireman's helmet over a bare head (long back brim, a front shield), drawn at the head's place (lean and bob followed)
function e4Helmet(fo, col = E4.ink) {
  const W = (lx, ly) => E3K.toWorld(fo, lx, ly), P = (a) => a.map(([lx, ly]) => W(lx, ly));
  return poly(P([[-0.06, 0.985], [-0.05, 1.03], [0.0, 1.05], [0.05, 1.03], [0.066, 0.99]]), col) + poly(P([[-0.15, 0.965], [-0.06, 0.99], [0.07, 0.99], [0.1, 0.982], [0.06, 0.975], [-0.05, 0.975]]), col) +
    poly(P([[0.035, 1.0], [0.065, 1.07], [0.085, 1.0]]), col);
}
// falling snow in screen space (a little parallax with the camera): n flakes, size, speed, opacity
function e4Snow(t, c, {n = 160, seed = 41, size = 3, speed = 70, op = 0.8, par = 0.4, blur = false} = {}) {
  const r = rng(seed), s = [];
  for (let i = 0; i < n; i++) {
    const x0 = r() * 2240, y0 = r() * 1200, sp = speed * (0.7 + 0.6 * r()), sw = r() * TAU, sz = size * (0.6 + 0.8 * r()), dr = 14 + 20 * r();
    const y = ((y0 + t * sp) % 1200) - 60, x = ((x0 + dr * t + 16 * Math.sin(t * 0.8 + sw) - (c.ux - 960) * par * c.z) % 2240 + 2240) % 2240 - 160;
    s.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(sz)}" fill="#EEF4F2" opacity="${f1(op * (0.5 + 0.5 * r()) * 100) / 100}"/>`);
  }
  return blur ? `<g filter="url(#e4blur)">${s.join('')}</g>` : s.join('');
}

/* ---------------- horses: one gait model for the walk and the gallop ---------------- */
// Each hoof is a point: planted on the road for the stance part of its cycle (where the hip will be at mid-stance), then carried on an
// arc to its next plant; the leg is solved onto it (two bones), so planted hooves never slide, whatever the speed. xs: the horse at
// dist 0; dir: facing; rest (seconds since the horse stopped): each leg in turn steps under its hip. Body after msHorse.
const E4_GAIT = {walk: {C: 0.707, s: 0.6, lift: 0.07, hh: 0.64, off: [0, 0.25, 0.5, 0.75]}, gallop: {C: 2.2, s: 0.22, lift: 0.26, hh: 0.6, off: [0, 0.1, 0.45, 0.55]}};
function e4Horse(xs, gy, sz, c, dist, o = {}) {
  const dir = o.dir ?? 1, G = E4_GAIT[o.gait || 'walk'], x = xs + dir * dist, p = dist / (G.C * sz), cyc = G.C * sz;
  const gal = o.gait === 'gallop' ? (o.v ?? 1) : 0, bob = gal * 0.035 * sz * Math.max(0, Math.sin(TAU * p * 1 + 0.6)), pitch = gal * 3 * Math.sin(TAU * p + 1.2);
  const L1 = 0.35 * sz, L2 = 0.33 * sz, legs = [[-0.4, true, G.off[0]], [-0.3, true, G.off[1]], [0.42, false, G.off[2]], [0.5, false, G.off[3]]]; // LH, RH, LF, RF
  const near = [], far = [];
  legs.forEach(([lx, hind, off], li) => {
    const hip = [x + dir * lx * sz, gy - G.hh * sz - bob + dir * lx * sz * Math.sin(pitch * Math.PI / 180)];
    const q = p + off, n = Math.floor(q), u = q - n, plantX = (m) => xs + dir * ((m - off + G.s / 2) * cyc) + dir * lx * sz;
    let T = u < G.s ? [plantX(n), gy] : (() => { const v = (u - G.s) / (1 - G.s); return [lerp(plantX(n), plantX(n + 1), ease(v)), gy - G.lift * sz * Math.sin(Math.PI * v)]; })();
    if (o.rest != null) { const k = smooth(0.18 * li, 0.18 * li + 0.4, o.rest), R = [hip[0] + dir * 0.02 * sz, gy]; T = [lerp(T[0], R[0], k), lerp(T[1], R[1], k) - 0.08 * sz * Math.sin(Math.PI * k) * (T[1] >= gy - 0.5 ? 1 : 0.4)]; }
    if (o.restHind && li === 1) T = [T[0] - dir * 0.05 * sz, gy - 0.05 * sz]; // a resting hind hoof tipped onto its toe
    const vx = T[0] - hip[0], vy = T[1] - hip[1], D = Math.min(L1 + L2 - 0.01, Math.hypot(vx, vy)), a0 = Math.atan2(vy, vx);
    const al = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + D * D - L2 * L2) / (2 * L1 * D)))), side = (hind ? -1 : 1) * dir; // fore knee forward, hock back
    const cands = [a0 + al, a0 - al].map((a) => [hip[0] + Math.cos(a) * L1, hip[1] + Math.sin(a) * L1]);
    const knee = (cands[0][0] - cands[1][0]) * side > 0 ? cands[0] : cands[1], kd = Math.hypot(T[0] - knee[0], T[1] - knee[1]) || 1;
    const hoof = [knee[0] + (T[0] - knee[0]) / kd * L2, knee[1] + (T[1] - knee[1]) / kd * L2];
    const col = li % 2 ? shade(c, 0.12) : c, svg = line([hip, knee], col, 0.095 * sz) + line([knee, hoof], col, 0.055 * sz) + `<ellipse cx="${f1(hoof[0] + dir * 0.02 * sz)}" cy="${f1(hoof[1] - 0.022 * sz)}" rx="${f1(0.045 * sz)}" ry="${f1(0.024 * sz)}" fill="${col}"/>`;
    (li % 2 ? far : near).push(svg);
  });
  const X = (u) => x + dir * u * sz, Yy = (v) => gy - v * sz - bob, toss = o.toss || 0;
  const nod = (gal ? 0.05 * Math.sin(TAU * p + 0.3) : 0.03 * Math.sin(TAU * p * 2)) + 0.12 * toss, fw = gal * 0.1 - 0.04 * toss, dn = gal * 0.1;
  const body = `<g transform="rotate(${f1(-pitch * dir)}, ${f1(x)}, ${f1(gy - 0.78 * sz)})"><ellipse cx="${f1(X(0.02))}" cy="${f1(Yy(0.78))}" rx="${f1(0.56 * sz)}" ry="${f1(0.2 * sz)}" fill="${c}"/>` +
    poly([[X(0.38), Yy(0.92)], [X(0.62 + fw), Yy(1.28 + nod - dn)], [X(0.78 + fw), Yy(1.24 + nod - dn)], [X(0.98 + fw), Yy(1.0 + nod * 1.4 - dn)], [X(0.9 + fw), Yy(0.94 + nod * 1.4 - dn)], [X(0.66 + fw), Yy(1.04 + nod - dn)], [X(0.52), Yy(0.66)]], c) +
    poly([[X(0.66 + fw), Yy(1.26 + nod - dn)], [X(0.68 + fw), Yy(1.38 + nod - dn)], [X(0.72 + fw), Yy(1.27 + nod - dn)]], c) +
    poly([[X(0.42), Yy(0.98)], [X(0.6 + fw), Yy(1.27 + nod - dn)], [X(0.5 + fw), Yy(1.2 + nod - dn)], [X(0.36), Yy(0.95)]], c) +
    (() => { const sw = 0.05 * Math.sin(TAU * p) + 0.04 * toss, st = gal * 0.22; return `<path d="M${f1(X(-0.5))},${f1(Yy(0.88))} Q${f1(X(-0.66 - st))},${f1(Yy(0.62 + st * 0.6))} ${f1(X(-0.6 + sw - st * 1.6))},${f1(Yy(0.32 + st * 1.3))} L${f1(X(-0.54 + sw - st * 1.5))},${f1(Yy(0.36 + st * 1.2))} Q${f1(X(-0.56 - st * 0.5))},${f1(Yy(0.62 + st * 0.4))} ${f1(X(-0.46))},${f1(Yy(0.8))} Z" fill="${c}"/>`; })() +
    (o.harness ? `<path d="M${f1(X(0.44))},${f1(Yy(1.02))} Q${f1(X(0.3))},${f1(Yy(0.86))} ${f1(X(0.42))},${f1(Yy(0.74))}" stroke="#2A2E2B" stroke-width="${f1(0.05 * sz)}" fill="none"/><rect x="${f1(Math.min(X(-0.1), X(0.2)))}" y="${f1(Yy(1.0))}" width="${f1(0.3 * sz)}" height="${f1(0.05 * sz)}" fill="#2A2E2B"/>` : '') + '</g>';
  return {svg: far.join('') + body + near.join(''), mouth: [X(0.95 + fw), Yy(1.0 + nod * 1.4 - dn)], chest: [X(0.5), Yy(0.8)]};
}

/* ---------------- the night street: tenements, snow, firelight ---------------- */
// One elevation of a Williamsburg block about 1887: four-storey tenements over raised basements, a stoop to each door rising along
// the front, cornices with brackets, lintels and sills; snow on every ledge. Scale: a man 190 px (the Ep 1 street's proportions).
const E4F = {H: 190, WF: 880, CURB: 952, GS: 900, GC: 922, GM: 915, GD: 940, GE: 1062, L: [796, 596, 396, 196], top: -10, sec: 62};
const E4_ROW = [{x: -650, w: 430, seed: 1}, {x: -220, w: 470, seed: 2}, {x: 250, w: 450, seed: 3, burn: true, stoop: 590}, {x: 700, w: 550, seed: 4, stoop: 1040},
  {x: 1250, w: 450, seed: 5, kelly: true, stoop: 1380}, {x: 1700, w: 470, seed: 6, stoop: 1830}, {x: 2170, w: 450, seed: 7, stoop: 2300}, {x: 2620, w: 480, seed: 8}, {x: 3100, w: 450, seed: 9}];
const E4_STOOP = {n: 4, run: 45, rise: 26, land: 110};
function e4Stoop(sx, snow = 1) { // treads rising to the right from sx; landing at the door; an iron rail; snow on the treads
  const {n, run, rise, land} = E4_STOOP, base = E4F.GS, s = [];
  let d = `M${sx},${base}`; for (let k = 1; k <= n; k++) d += ` L${sx + run * (k - 1)},${base - rise * k} L${sx + run * k},${base - rise * k}`;
  d += ` L${sx + run * n + land},${base - rise * n} L${sx + run * n + land},${base} Z`;
  s.push(`<path d="${d}" fill="#1B2422"/>`);
  for (let k = 1; k <= n; k++) s.push(`<rect x="${sx + run * (k - 1)}" y="${base - rise * k - 3}" width="${run + 2}" height="5" rx="2" fill="${E4.snow}" opacity="${0.85 * snow}"/>`);
  s.push(`<rect x="${sx + run * n}" y="${base - rise * n - 3}" width="${land}" height="5" rx="2" fill="${E4.snow}" opacity="${0.85 * snow}"/>`);
  s.push(line([[sx - 6, base - 60], [sx + run * n, base - rise * n - 64], [sx + run * n + land, base - rise * n - 64]], '#0A0F0E', 4));
  for (let k = 0; k <= n; k++) s.push(`<rect x="${sx - 6 + run * k}" y="${base - rise * k - 64}" width="3" height="${64}" fill="#0A0F0E"/>`);
  return s.join('');
}
const e4StoopY = (sx, x) => { const {n, run, rise} = E4_STOOP, k = Math.min(n, Math.max(0, Math.ceil((x - sx) / run))); return E4F.GS - rise * k; };
// window light: 'dark', 'lit' (a lamp), 'fire' (orange, flickering). fireK: how fierce
function e4Window(x, y, w, h, kind, t, i, fireK = 1) {
  const s = [`<rect x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}" fill="#0A100F"/>`];
  if (kind === 'fire') {
    const fl = clamp01(0.62 + 0.22 * Math.sin(t * 9.1 + i * 2.1) + 0.14 * Math.sin(t * 23.7 + i) + 0.1 * Math.sin(t * 3.3 + i * 0.7)) * fireK;
    s.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#e4win)" opacity="${f1(fl * 100) / 100}"/>`);
    s.push(`<rect x="${x}" y="${y + h * 0.55}" width="${w}" height="${h * 0.45}" fill="#FFE2A8" opacity="${f1(fl * 0.45 * 100) / 100}"/>`);
    s.push(glowC(x + w / 2, y + h / 2, 150 * (0.8 + 0.4 * fl), 0.75 * fl, 'e4glow'));
  } else if (kind === 'lit') s.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#FFF0CF" opacity="0.5"/>` + glowC(x + w / 2, y + h / 2, 70, 0.35, 'mswarm'));
  else s.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#141E1D"/>`);
  s.push(`<rect x="${x + w / 2 - 1.5}" y="${y}" width="3" height="${h}" fill="#0A100F"/><rect x="${x}" y="${y + h * 0.48}" width="${w}" height="3" fill="#0A100F"/>`);
  s.push(`<rect x="${x - 8}" y="${y - 14}" width="${w + 16}" height="10" fill="#1F2B29"/><rect x="${x - 8}" y="${y - 17}" width="${w + 16}" height="4" rx="2" fill="${E4.snow}" opacity="0.75"/>`);
  s.push(`<rect x="${x - 6}" y="${y + h + 2}" width="${w + 12}" height="7" fill="#1F2B29"/><rect x="${x - 6}" y="${y + h - 1}" width="${w + 12}" height="4" rx="2" fill="${E4.snow}" opacity="0.8"/>`);
  return s.join('');
}
function e4Facade(b, t, fireK) {
  const {x, w, seed} = b, s = [], r = rng(100 + seed), {WF, L, top} = E4F;
  const base = b.burn ? '#1A2321' : seed % 2 ? '#18221F' : '#141D1C';
  s.push(MAT.brick(x, top, w, WF - top, {base, seed: 200 + seed, soot: 'bottom', bw: 30, bh: 13, vary: 0.25}));
  s.push(`<rect x="${x}" y="${top}" width="5" height="${WF - top}" fill="#070B0B" opacity="0.8"/>`);
  // cornice and brackets, snow on top
  s.push(`<rect x="${x - 8}" y="${top - 34}" width="${w + 16}" height="38" fill="#0E1514"/>` + [...Array(Math.floor(w / 40))].map((_, k) => `<rect x="${x + 12 + k * 40}" y="${top + 2}" width="12" height="22" fill="#0E1514"/>`).join('') + `<rect x="${x - 10}" y="${top - 40}" width="${w + 20}" height="8" rx="3" fill="${E4.snow}" opacity="0.85"/>`);
  // basement windows half below the sidewalk
  for (let k = 0; k < 3; k++) { const wx = x + 40 + k * (w - 110) / 2; if (b.stoop && Math.abs(wx + 28 - b.stoop - 120) < 140) continue; s.push(`<rect x="${f1(wx)}" y="${WF - 70}" width="56" height="52" fill="#0A100F"/><rect x="${f1(wx + 4)}" y="${WF - 66}" width="48" height="44" fill="${b.burn ? '#3A1C10' : '#121A19'}"/>`); }
  // the door at the top of the stoop
  if (b.stoop) { const dx = b.stoop + E4_STOOP.n * E4_STOOP.run + 14, dy = E4F.GS - E4_STOOP.n * E4_STOOP.rise; s.push(`<rect x="${dx - 10}" y="${dy - 214}" width="96" height="214" fill="#0A0F0E"/><rect x="${dx}" y="${dy - 200}" width="76" height="200" fill="${b.burn ? '#2A140B' : '#16100B'}"/>` +
    (b.burn ? glowC(dx + 38, dy - 100, 160, 0.5 * fireK * (0.8 + 0.2 * Math.sin(t * 7)), 'e4glow') : '') + `<rect x="${dx - 14}" y="${dy - 228}" width="104" height="14" fill="#1F2B29"/><rect x="${dx - 14}" y="${dy - 231}" width="104" height="4" fill="${E4.snow}" opacity="0.8"/>`); }
  // windows: three a floor; the parlor floor's sit beside the door
  const cols = 3, ww = 58, wh = 124;
  for (let f = 0; f < 4; f++) for (let ci = 0; ci < cols; ci++) {
    let wx = x + (w - cols * ww) / (cols + 1) * (ci + 1) + ww * ci; const wy = L[f] - 172;
    if (f === 0 && b.stoop) { const dx = b.stoop + E4_STOOP.n * E4_STOOP.run + 14; if (wx + ww > dx - 20 && wx < dx + 100) continue; }
    let kind = r() < 0.22 ? 'lit' : 'dark';
    if (b.burn) kind = f >= 1 || ci > 0 ? 'fire' : 'dark';
    if (b.kelly && f === 2 && ci === 1) kind = 'lit';
    s.push(e4Window(f1(wx), wy, ww, wh, kind, t, seed * 10 + f * 3 + ci, f === 0 ? 0.55 * fireK : fireK));
  }
  // a fire escape on the burning building and its neighbours: balconies, rails, ladders, snow on the slats
  if (!b.kelly) for (let f = 1; f < 4; f++) {
    const by = L[f] - 34, bx0 = x + 30, bx1 = x + w - 30;
    s.push(`<rect x="${bx0}" y="${by}" width="${bx1 - bx0}" height="5" fill="#0A0F0E"/><rect x="${bx0}" y="${by - 36}" width="${bx1 - bx0}" height="3" fill="#0A0F0E"/><rect x="${bx0}" y="${by - 3}" width="${bx1 - bx0}" height="3" fill="${E4.snow}" opacity="0.7"/>`);
    for (let rx = bx0; rx <= bx1; rx += 11) s.push(`<rect x="${rx}" y="${by - 36}" width="1.8" height="36" fill="#0A0F0E"/>`);
    if (f < 3) s.push(line([[bx1 - 50, by], [bx1 - 90, L[f + 1] - 34]], '#0A0F0E', 3.5));
  }
  if (b.stoop) s.push(e4Stoop(b.stoop));
  return s.join('');
}
// smoke from the burning building: a plume off the roof drifting right, and wisps from the top windows; lit orange from below
function e4Smoke(t, fireK) {
  const s = [];
  s.push(MAT.smoke(470, E4F.top - 40, t, {col: '262422', k: 3.2, n: 9, rise: 420, drift: 300, speed: 7, seed: 51}));
  s.push(MAT.smoke(620, E4F.top - 30, t + 2.1, {col: '3A2A22', k: 2.6, n: 8, rise: 380, drift: 260, speed: 6, seed: 52}));
  for (const [wx, sd] of [[330, 53], [480, 54], [640, 55]]) s.push(MAT.smoke(wx, E4F.L[3] - 175, t + sd, {col: '2B2724', k: 1.1, n: 6, rise: 200, drift: 90, speed: 4, seed: sd}));
  s.push(MAT.smoke(520, E4F.top - 20, t + 0.7, {col: '7A4428', k: 1.6, n: 6, rise: 140, drift: 80, speed: 3, seed: 56}).replace(/opacity="([\d.]+)"/g, (m, a) => `opacity="${f1(Number(a) * 0.7 * fireK * 100) / 100}"`));
  return s.join('');
}
// the steam pumper (faces left; x = its front axle, gy = the road): vertical boiler and flared stack at the rear, the pump and its
// air chamber amidships, the driver's box high over the front wheels, a bell, the rear step. dist turns the wheels; v (0..1) shakes it.
function e4Pumper(x, gy, dist, t, v, steam) {
  const H = E4F.H, X = (u) => x + u * H, Y = (v2) => gy - v2 * H, c = '#0B100F', s = [], sh = v * 2.5 * Math.sin(dist * 0.09);
  const wheel = (u, rr, sp) => { const cx = X(u), R = rr * H, cy = gy - R, a = -dist / R; let k2 = ''; for (let i = 0; i < sp; i++) { const q = a + i * TAU / sp; k2 += `M${f1(cx)},${f1(cy)}L${f1(cx + Math.cos(q) * R)},${f1(cy + Math.sin(q) * R)}`; }
    return `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(R)}" fill="none" stroke="${c}" stroke-width="${f1(0.045 * H)}"/><path d="${k2}" stroke="${c}" stroke-width="${f1(0.016 * H)}"/><circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(0.05 * H)}" fill="${c}"/><path d="M${f1(cx - R * 0.95)},${f1(cy - R * 0.25)} A${f1(R)},${f1(R)} 0 0 1 ${f1(cx - R * 0.25)},${f1(cy - R * 0.95)}" stroke="#DFE0D6" stroke-opacity="0.18" stroke-width="2" fill="none"/>`; };
  s.push(wheel(1.38, 0.42, 14));
  const body = [];
  body.push(`<path d="M${f1(X(-0.2))},${f1(Y(0.82))} L${f1(X(0.32))},${f1(Y(0.82))} Q${f1(X(0.5))},${f1(Y(0.82))} ${f1(X(0.55))},${f1(Y(0.56))} L${f1(X(1.86))},${f1(Y(0.56))} L${f1(X(1.86))},${f1(Y(0.48))} L${f1(X(0.5))},${f1(Y(0.48))} Q${f1(X(0.42))},${f1(Y(0.72))} ${f1(X(0.3))},${f1(Y(0.74))} L${f1(X(-0.2))},${f1(Y(0.74))} Z" fill="${c}"/>`);
  body.push(`<rect x="${f1(X(-0.02))}" y="${f1(Y(1.12))}" width="${f1(0.34 * H)}" height="${f1(0.3 * H)}" fill="${c}"/><rect x="${f1(X(-0.05))}" y="${f1(Y(1.15))}" width="${f1(0.4 * H)}" height="${f1(0.05 * H)}" fill="${c}"/>`); // driver's box
  body.push(`<rect x="${f1(X(-0.24))}" y="${f1(Y(0.86))}" width="${f1(0.3 * H)}" height="${f1(0.04 * H)}" fill="${c}"/>`); // footboard
  // the pump and its pear-shaped air chamber
  body.push(`<rect x="${f1(X(0.62))}" y="${f1(Y(0.95))}" width="${f1(0.42 * H)}" height="${f1(0.4 * H)}" fill="${c}"/><path d="M${f1(X(0.76))},${f1(Y(0.95))} Q${f1(X(0.66))},${f1(Y(1.2))} ${f1(X(0.83))},${f1(Y(1.36))} Q${f1(X(1.0))},${f1(Y(1.2))} ${f1(X(0.9))},${f1(Y(0.95))} Z" fill="${c}"/>` +
    `<path d="M${f1(X(0.74))},${f1(Y(1.12))} Q${f1(X(0.76))},${f1(Y(1.28))} ${f1(X(0.83))},${f1(Y(1.33))}" stroke="#DFE0D6" stroke-opacity="0.35" stroke-width="3" fill="none"/>`);
  // the boiler, banded, the firebox glow under it, the stack with its flared top
  const bx0 = X(1.18), bx1 = X(1.58);
  body.push(`<rect x="${f1(bx0)}" y="${f1(Y(1.5))}" width="${f1(bx1 - bx0)}" height="${f1(1.0 * H)}" rx="${f1(0.06 * H)}" fill="${c}"/><rect x="${f1(bx0)}" y="${f1(Y(1.5))}" width="${f1(bx1 - bx0)}" height="${f1(1.0 * H)}" rx="${f1(0.06 * H)}" fill="url(#matIronH)"/>` +
    [1.42, 1.18, 0.9, 0.66].map((vv) => `<rect x="${f1(bx0 - 2)}" y="${f1(Y(vv))}" width="${f1(bx1 - bx0 + 4)}" height="5" fill="#3A4441"/>`).join('') +
    `<rect x="${f1(bx0 + 0.06 * H)}" y="${f1(Y(0.66))}" width="${f1(0.18 * H)}" height="${f1(0.12 * H)}" fill="${E4.fire}" opacity="${f1(0.55 + 0.25 * Math.sin(t * 13))}"/>` +
    `<rect x="${f1(X(1.31))}" y="${f1(Y(1.72))}" width="${f1(0.14 * H)}" height="${f1(0.24 * H)}" fill="${c}"/><path d="M${f1(X(1.24))},${f1(Y(1.86))} L${f1(X(1.52))},${f1(Y(1.86))} L${f1(X(1.45))},${f1(Y(1.72))} L${f1(X(1.31))},${f1(Y(1.72))} Z" fill="${c}"/>`);
  body.push(`<rect x="${f1(X(1.58))}" y="${f1(Y(0.36))}" width="${f1(0.3 * H)}" height="${f1(0.04 * H)}" fill="${c}"/>` + line([[X(1.86), Y(0.4)], [X(1.86), Y(0.56)]], c, 4)); // rear step
  // the bell on its yoke, swinging while it runs
  const bsw = v * 28 * Math.sin(t * 9) + 4 * Math.sin(t * 2);
  body.push(line([[X(0.42), Y(0.82)], [X(0.42), Y(1.18)]], c, 4) + `<g transform="rotate(${f1(bsw)}, ${f1(X(0.42))}, ${f1(Y(1.18))})"><path d="M${f1(X(0.42) - 13)},${f1(Y(1.06))} Q${f1(X(0.42) - 12)},${f1(Y(1.17))} ${f1(X(0.42))},${f1(Y(1.18))} Q${f1(X(0.42) + 12)},${f1(Y(1.17))} ${f1(X(0.42) + 13)},${f1(Y(1.06))} Z" fill="${c}"/></g>`);
  body.push(`<rect x="${f1(X(0.0))}" y="${f1(Y(0.95))}" width="${f1(0.06 * H)}" height="${f1(0.12 * H)}" fill="${E4.cream}" opacity="0.7"/>` + glowC(X(0.03), Y(0.9), 60, 0.5, 'mswarm')); // a lamp
  s.push(`<g transform="translate(0,${f1(sh)})">${body.join('')}</g>`);
  s.push(wheel(0.0, 0.3, 12));
  // sparks and smoke from the stack: thick while galloping and while pumping
  const sx = X(1.38), sy = Y(1.88) + sh, r = rng(77), sp = [];
  for (let i = 0; i < 26; i++) { const ph = (t * (0.9 + r() * 0.8) + r()) % 1, dx = (r() - 0.3) * 120 * ph + v * 260 * ph, dy = -ph * (150 + r() * 160);
    sp.push(`<circle cx="${f1(sx + dx)}" cy="${f1(sy + dy)}" r="${f1(1.6 + r() * 2.2)}" fill="${r() < 0.5 ? '#FFC36B' : '#FF7A2E'}" opacity="${f1((1 - ph) * (0.5 + 0.5 * Math.max(v, steam)) * 100) / 100}"/>`); }
  return {svg: s.join(''), sparks: MAT.smoke(sx, sy, t, {col: '3A3633', k: 1.3 + v, n: 7, rise: 260, drift: 120 + 300 * v, speed: 2.4, seed: 79}) + sp.join(''), seat: [X(0.15), Y(1.12) + sh], foot: [X(-0.12), Y(0.86) + sh], step: [X(1.73), Y(0.4)], outlet: [X(1.02), Y(0.7)], rear: X(1.86), sh};
}
