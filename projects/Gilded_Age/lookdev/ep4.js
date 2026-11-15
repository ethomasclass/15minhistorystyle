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
  snow: '#C9D6D6', fire: '#FF8A3D', blanket: '#3B4640'};

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
  // (rig children have a 0.46 h leg but walkAn's stance sweep assumes 0.5 h: their cycle is driven 1/0.92 faster so the foot stays put)
  const child = fo.kind === 'boy' || fo.kind === 'girl', kc = child ? 0.92 : 1, o = {...stepWalk(fo, x0, dir, s / kc, () => G, name), x: x0 + dir * s};
  const f0 = E3K.foot(o, 0), f1 = E3K.foot(o, 1), low = Math.max(f0[1], f1[1]), o2 = {...o, y: o.y + (G - low), floorY: G};
  const p = walkPhase(s / kc, fo.h, child ? 26 : 22);
  [[0, p], [1, p + 0.5]].forEach(([i, q]) => { const fr = ((q % 1) + 1) % 1; if (fr < 0.5) { const g = E3K.foot(o2, i); E3K.log('plant', `${name}.${i}#${Math.floor(q)}`, [g[0], G], g, {walk: 1}); } });
  return o2;
}
// a figure that stands, walks to a place, settles, stands again: plan = {x, d, G, walks: [{t0, t1, to, dAfter, a}]}. Walks start from
// the passing pose (a quarter cycle in), so the first step lifts one foot from a standing pose. Returns {fo, state}.
function e4Track(base, plan, t, name) {
  let x = plan.x, d = plan.d ?? 1; const G = plan.G, h = base.h, child = base.kind === 'boy' || base.kind === 'girl';
  const s0 = 0.25 * 2 * Math.sin((child ? 26 : 22) * Math.PI / 180) * h * (child ? 0.92 : 1);
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
  const near = [], far = [], hh = o.rest != null ? lerp(G.hh, 0.668, smooth(0, 0.9, o.rest)) : G.hh; // standing: legs nearly straight
  legs.forEach(([lx, hind, off], li) => {
    const hip = [x + dir * lx * sz, gy - hh * sz - bob + dir * lx * sz * Math.sin(pitch * Math.PI / 180)];
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
  const X = (u) => x + dir * u * sz, Yy = (v) => gy - v * sz - bob - (hh - 0.64) * sz, toss = o.toss || 0;
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
    s.push(glowC(x + w / 2, y + h / 2, 210 * (0.8 + 0.4 * fl), 1.0 * fl, 'e4glow'));
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
  s.push(MAT.smoke(420, E4F.top - 40, t, {col: '6A625C', k: 3.6, n: 10, rise: 520, drift: 340, speed: 7, seed: 51}));
  s.push(MAT.smoke(600, E4F.top - 30, t + 2.1, {col: '7A6656', k: 3.0, n: 9, rise: 460, drift: 300, speed: 6, seed: 52}));
  for (const [wx, sd] of [[330, 53], [480, 54], [640, 55]]) s.push(MAT.smoke(wx, E4F.L[3] - 175, t + sd, {col: '4A4440', k: 1.3, n: 6, rise: 240, drift: 110, speed: 4, seed: sd}));
  s.push(MAT.smoke(500, E4F.top - 20, t + 0.7, {col: 'A0582E', k: 2.0, n: 7, rise: 170, drift: 90, speed: 3, seed: 56}).replace(/opacity="([\d.]+)"/g, (m, a) => `opacity="${f1(Number(a) * 0.85 * fireK * 100) / 100}"`));
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

// a jump down from a step (A, the step's surface) to the road (B): standing on A until u 0, in the air (legs tucked, nothing to log),
// standing on B from u 1. o: the figure's options (d, h ...)
function e4Hop(fo, A, B, u, name) {
  if (u <= 0) return e3Stand({...fo, x: A[0], y: A[1], floorY: A[1]}, A[0], A[0], 0, name + '.a');
  if (u >= 1) return e3Stand({...fo, x: B[0], y: B[1], floorY: B[1]}, B[0], B[0], 0, name + '.b');
  const e = ease(u), y = lerp(A[1], B[1], e * e) - 0.12 * fo.h * Math.sin(Math.PI * u), tuck = Math.sin(Math.PI * u);
  return {...fo, x: lerp(A[0], B[0], e), y, floorY: null, noShadow: true, an: {...fo.an, legs: [18 + 22 * tuck, -6 + 10 * tuck], shins: [-10 - 30 * tuck, -24 - 20 * tuck], lean: 6 * tuck, bob: 0}};
}
// the baby: a swaddled bundle with a small round head, held in front of the chest by both hands (both solved onto it)
function e4Baby(fo, name, dy = 0) {
  const d = fo.d ?? 1, cx = fo.x + d * 0.13 * fo.h, cy = fo.y - 0.62 * fo.h + dy;
  let o = reach(fo, 'f', cx + d * 0.035 * fo.h, cy + 0.035 * fo.h, name + '.baby.f');
  o = reach(o, 'b', cx - d * 0.045 * fo.h, cy + 0.03 * fo.h, name + '.baby.b');
  const w = 0.17 * fo.h, hh = 0.075 * fo.h;
  return {fo: o, svg: `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(w / 2)}" ry="${f1(hh / 2)}" transform="rotate(${f1(-12 * d)}, ${f1(cx)}, ${f1(cy)})" fill="#9CA79F"/>` +
    `<circle cx="${f1(cx + d * w * 0.5)}" cy="${f1(cy - hh * 0.55)}" r="${f1(hh * 0.42)}" fill="#0D0C09"/><path d="M${f1(cx - d * w * 0.3)},${f1(cy - hh * 0.2)} q${f1(d * w * 0.3)},${f1(hh * 0.3)} ${f1(d * w * 0.6)},0" stroke="#6E7A72" stroke-width="2" fill="none"/>`};
}
// a blanket round the shoulders, drawn in the wearer's frame (follows her as she walks)
function e4Drape(fo, col = E4.blanket) {
  const P = (a) => a.map(([lx, ly]) => E3K.toWorld(fo, lx, ly));
  const body = P([[0.075, 0.835], [0.02, 0.85], [-0.06, 0.845], [-0.12, 0.79], [-0.15, 0.56], [-0.165, 0.33], [-0.06, 0.31], [0.04, 0.42], [0.07, 0.6], [0.095, 0.76]]);
  const stripes = [0.74, 0.62, 0.5, 0.4].map((v) => line(P([[-0.15 + (0.84 - v) * 0.06, v], [0.07 - (0.84 - v) * 0.08, v + 0.012]]), shade(col, 0.22), Math.max(1.2, 0.006 * fo.h), 'opacity="0.7"')).join('');
  return poly(body, col) + stripes + line(P([[0.085, 0.78], [0.06, 0.55], [0.035, 0.42]]), shade(col, -0.4), Math.max(1.5, 0.008 * fo.h));
}
// two small boots dangling from a hand by their laces
function e4Shoes(gx, gy, t) { const sw = 6 * Math.sin(t * 2.1); return `<g transform="rotate(${f1(sw)}, ${f1(gx)}, ${f1(gy)})">` + line([[gx, gy], [gx - 6, gy + 22]], '#3A3A36', 1.6) + line([[gx, gy], [gx + 5, gy + 18]], '#3A3A36', 1.6) +
  `<path d="M${f1(gx - 12)},${f1(gy + 20)} l9,0 l0,12 l9,3 l0,5 l-18,0 Z" fill="#0D0C09"/><path d="M${f1(gx)},${f1(gy + 16)} l9,0 l0,12 l9,3 l0,5 l-18,0 Z" fill="#1A1A17"/></g>`; }

/* ================= ep4_fire: the cold open ================= */
// Beats from SCRIPT.md ch 1 at about 150 words a minute (retimed to the voice in the edit): tag and the burning windows (0 to 6);
// the families in the snow (6 to 16); the engine gallops in (16.4 to 20.6), firemen jump down, water on (23); the captain and three
// men walk in (22.6 to 27.6), "He knows everybody's name"; the blanket and his first line (28 to 38.3); the Doyles go to his cab
// (38.6 to 45.5); "Not tonight"; he turns to Michael's stoop (45.6 to 47.2), tips his hat (50.6) and speaks (51.8 to 57.8); he walks on.
const FT = {eng0: 16.4, engStop: 20.6, hop1: 21.0, hop2: 21.35, water: 23.3, cap0: 22.6, capStop: 27.6, blanket: 28.15, wrap0: 29.4, wrap1: 30.8, release: 32.0,
  talk1: [[31.0, 31.9], [32.3, 35.2], [35.5, 36.6], [37.0, 38.3]], doyleTurn: 38.45, doyle0: 38.7, doyle1: 45.6, capWalk2: [45.7, 47.1], tip: 50.6, talk2: [[51.8, 53.8], [54.2, 56.0], [56.4, 57.8]], tip2: 58.2, leave: 59.3};
const E4_CAM = [[0, 0.86, 600, 160], [5.6, 0.95, 820, 520], [8.6, 1.45, 880, 735], [15.2, 1.55, 940, 745], [16.6, 1.0, 1000, 580], [21.4, 1.0, 900, 590], [23.2, 1.15, 1250, 650],
  [27.8, 1.4, 1200, 700], [30.4, 2.7, 1100, 760], [37.9, 2.9, 1095, 760], [39.8, 1.35, 1560, 700], [45.4, 1.4, 1700, 700], [47.6, 1.55, 1460, 690], [51.0, 2.15, 1450, 715], [57.8, 2.4, 1450, 712], [62, 1.55, 1300, 680]];
function renderE4Fire(t, o = {}) {
  const {H, WF, CURB, GC, GM, GD, GE} = E4F, c = cam2(o.cam || camAt(E4_CAM, t)), lod = lodFor(H * c.z), det = lod.det;
  const fl = clamp01(0.75 + 0.15 * Math.sin(t * 7.7) + 0.1 * Math.sin(t * 17.3) + 0.08 * Math.sin(t * 2.9)), fireX = 470, fireK = 1;
  const rimAt = (x, y = 900) => { const k = Math.exp(-Math.abs(x - fireX) / 900) * fl, kl = Math.exp(-Math.abs(x - 1730) / 300);
    if (kl > k) return {c: '#FFE9C4', a: lod.rimA * (0.6 + 0.4 * kl), dx: (x > 1730 ? -1 : 1) * 0.009, dy: -0.005}; // the gas lamp
    return {c: '#FFB06A', a: lod.rimA * (0.6 + 0.4 * k), dx: (x > fireX ? -1 : 1) * 0.009, dy: -0.004}; };
  const back = [], W = [], front = [], street = [], scr = [];
  // ---- the block ----
  E4_ROW.forEach((b) => back.push(e4Facade(b, t, fireK)));
  for (const b of E4_ROW) for (const cx of [b.x + 60, b.x + b.w - 110]) back.push(`<rect x="${cx}" y="${E4F.top - 110}" width="50" height="76" fill="#0E1514"/><rect x="${cx - 6}" y="${E4F.top - 118}" width="62" height="10" fill="#0E1514"/><rect x="${cx - 7}" y="${E4F.top - 122}" width="64" height="5" rx="2" fill="${E4.snow}" opacity="0.8"/>`);
  // sidewalk, curb, street: snow, lit orange near the fire, wheel ruts
  back.push(`<rect x="-1500" y="${WF}" width="6000" height="${CURB - WF}" fill="#5B6C6E"/><rect x="-1500" y="${WF}" width="6000" height="${CURB - WF}" fill="url(#matFloorShade)" opacity="0.6"/><rect x="-1500" y="${WF - 4}" width="6000" height="6" fill="#0A0F0E" opacity="0.8"/>` +
    `<rect x="-1500" y="${CURB}" width="6000" height="10" fill="#2B3534"/><rect x="-1500" y="${CURB - 3}" width="6000" height="4" fill="${E4.snow}" opacity="0.8"/><rect x="-1500" y="${CURB + 10}" width="6000" height="900" fill="#4E5E61"/>` +
    [1000, 1035, 1078, 1110].map((yy, k) => `<rect x="-1500" y="${yy}" width="6000" height="${k % 2 ? 5 : 3}" fill="#3A4749" opacity="0.7"/>`).join(''));
  back.push(`<ellipse cx="${fireX + 120}" cy="${WF + 60}" rx="${1100 * (0.9 + 0.1 * fl)}" ry="160" fill="url(#e4pool)" opacity="${f1(0.75 * fl * 100) / 100}" style="mix-blend-mode:screen"/>`);
  // a gas lamp at the curb between the Doyles and the Kellys' stoop: its pool of light on the snow, and the post (drawn in front)
  const LX = 1730, lampFl = 0.92 + 0.08 * Math.sin(t * 9.3);
  back.push(`<ellipse cx="${LX}" cy="${CURB - 20}" rx="330" ry="70" fill="url(#mswarm)" opacity="${f1(0.9 * lampFl)}"/>`);
  const lampPost = `<rect x="${LX - 6}" y="${CURB - 470}" width="12" height="470" fill="#080C0B"/><rect x="${LX - 12}" y="${CURB - 40}" width="24" height="40" fill="#080C0B"/>` +
    poly([[LX - 24, CURB - 520], [LX + 24, CURB - 520], [LX + 17, CURB - 466], [LX - 17, CURB - 466]], '#FFF0CF', 'opacity="0.85"') + poly([[LX - 30, CURB - 518], [LX, CURB - 540], [LX + 30, CURB - 518]], '#080C0B') +
    `<rect x="${LX - 31}" y="${CURB - 545}" width="62" height="5" rx="2" fill="${E4.snow}" opacity="0.8"/>` + glowC(LX, CURB - 490, 360, 0.75 * lampFl, 'mswarm') + glowC(LX, CURB - 490, 90, 0.6 * lampFl);
  // ---- the engine ----
  const XS = 330, D = 1900, ue = clamp01((t - FT.eng0) / (FT.engStop - FT.eng0)), ex = XS + D * (1 - ue) * (1 - ue), dist = D - (ex - XS), vE = t < FT.engStop ? 1 - ue : 0;
  const pumping = smooth(FT.water - 0.6, FT.water, t);
  const pm = e4Pumper(ex, GE, dist, t, vE, pumping);
  const hx0 = XS + D - 1.35 * H, hr = t > FT.engStop ? t - FT.engStop : null;
  const horseFar = e4Horse(hx0 - 0.12 * H, GE - 10, 0.95 * H, '#1A2220', dist, {dir: -1, gait: 'gallop', v: vE, rest: hr, harness: true, toss: hr != null ? Math.max(0, Math.sin(t * 1.3)) ** 8 : 0});
  const horseNear = e4Horse(hx0, GE, 0.95 * H, '#0B100F', dist * 0.995 + 6, {dir: -1, gait: 'gallop', v: vE, rest: hr != null ? hr + 0.1 : null, harness: true, toss: hr != null ? Math.max(0, Math.sin(t * 1.1 + 2)) ** 8 : 0});
  const pole = line([[ex - 0.2 * H, GE - 0.62 * H + pm.sh], [hx0 - dist + 0.3 * H, GE - 0.78 * H]], '#0B100F', 6);
  // the driver on his box (feet on the footboard), reins in his hands to the near horse's mouth
  let drv = sitOn({x: pm.seat[0], y: 0, h: H, d: -1, kind: 'man', hat: 'none', coat: 'jacket', fill: '#0B100F', det: 0, an: {fArm: [128, 104], bArm: [134, 110], tilt: 4, lean: 0}}, pm.seat[1], pm.foot[1], 0.2, 'fi.driver');
  if (vE > 0) drv = {...drv, an: {...drv.an, lean: -6 * vE, fArm: [118, 96], bArm: [124, 100]}};
  const gd = E3K.hand(drv, 'f');
  const reins = `<path d="M${f1(gd.x)},${f1(gd.y)} Q${f1((gd.x + horseNear.mouth[0]) / 2)},${f1(Math.max(gd.y, horseNear.mouth[1]) + 20 * (1 - vE) + 6)} ${f1(horseNear.mouth[0])},${f1(horseNear.mouth[1])}" stroke="#2A2E2B" stroke-width="2.4" fill="none"/>`;
  // firemen on the rear step; they jump down when it stops; one takes the nozzle, the other the hose behind him
  const rear = XS + 1.86 * H, stepY = GE - 0.4 * H, rail = (fo) => [fo.x - 0.1 * H, fo.y - 0.62 * H];
  const fireman = (x, y, an) => ({x, y, h: H, d: -1, kind: 'man', hat: 'none', coat: 'jacket', fill: '#0B100F', det: Math.min(det, 0.4), rim: rimAt(x), an});
  const F1x = rear + 120, F2x = rear + 215, N0 = [F1x - 0.11 * H, GE - 0.67 * H], N1 = [F1x - 0.02 * H, GE - 0.59 * H];
  const fireCrew = [], hose = [];
  const crew = (k, xOn, hopT, xLand, xWork, walkT) => {
    let f;
    if (t < hopT) { const sx = pm.step[0] + xOn; f = e3Stand(fireman(sx, stepY + pm.sh, {...POSES.stand(t, 0.2 * k), tilt: 4}), sx, sx, 0, `fi.f${k}.ride`); f = reach(f, 'b', ...[f.x - 0.06 * H, f.y - 0.56 * H], `fi.f${k}.rail`); f = {...f, floorY: stepY + pm.sh}; }
    else if (t < hopT + 0.45) f = e4Hop(fireman(0, 0, {tilt: -4}), [pm.step[0] + xOn, stepY], [xLand, GE], (t - hopT) / 0.45, `fi.f${k}.hop`);
    else { const tr = e4Track(fireman(0, 0, {tilt: -6}), {x: xLand, d: -1, G: GE, walks: [{t0: walkT[0], t1: walkT[1], to: xWork, dAfter: -1, carry: k === 1, an: k === 1 ? {fArm: [118, 70], bArm: [130, 84]} : {}}]}, t, `fi.f${k}`); f = tr.fo; f.state = tr.state; }
    return f;
  };
  let f1o = crew(1, -10, FT.hop1, rear + 30, F1x, [21.75, 22.75]), f2o = crew(2, 28, FT.hop2, rear + 70, F2x, [21.95, 22.85]);
  // the nozzle and hose
  if (t >= FT.hop1 + 0.45) {
    if (f1o.state === 'stand' && t > 22.9) { const brace = smooth(22.9, 23.3, t); f1o = {...f1o, an: {...f1o.an, lean: -5 * brace, tilt: 12 * brace}}; f1o = reach(f1o, 'f', N0[0], N0[1], 'fi.f1.nozzle'); f1o = reach(f1o, 'b', N1[0], N1[1], 'fi.f1.hose'); }
    const a = E3K.hand(f1o, 'f'), b = E3K.hand(f1o, 'b'); if (!(f1o.state === 'stand' && t > 22.9)) { holding(f1o, 'f', 'fi.f1.nozzleCarry', () => ''); holding(f1o, 'b', 'fi.f1.hoseCarry', () => ''); }
    const dx = a.x - b.x, dy = a.y - b.y, dl = Math.hypot(dx, dy) || 1, tip = [a.x + dx / dl * 0.13 * H, a.y + dy / dl * 0.13 * H];
    hose.push(line([b, a].map((p) => [p.x, p.y]), '#202523', 7) + line([[a.x, a.y], tip], '#3A403C', 6) + line([[a.x + dx / dl * 4, a.y + dy / dl * 4], tip], '#B9B4A6', 2.4, 'opacity="0.5"'));
    let H1 = null, H2 = null;
    if (f2o.state === 'stand' && t > 22.9) { const k = smooth(22.9, 23.25, t); H1 = [F2x - 0.13 * H, GE - 0.5 * H]; H2 = [F2x - 0.03 * H, GE - 0.46 * H];
      if (k < 1) { const g1 = E3K.hand(f2o, 'f'), g2 = E3K.hand(f2o, 'b'); f2o = e3Move(f2o, 'f', lerp(g1.x, H1[0], k), lerp(g1.y, H1[1], k), 'fi.f2.toHose'); f2o = e3Move(f2o, 'b', lerp(g2.x, H2[0], k), lerp(g2.y, H2[1], k), 'fi.f2.toHose2'); H1 = H2 = null; }
      else { f2o = reach(f2o, 'f', H1[0], H1[1], 'fi.f2.hose1'); f2o = reach(f2o, 'b', H2[0], H2[1], 'fi.f2.hose2'); f2o = {...f2o, an: {...f2o.an, lean: -4}}; } }
    const path = [[b.x, b.y], ...(H1 ? [H1, H2] : []), [(H2 ? H2[0] : b.x) + 50, GE - 3], [rear + 40, GE - 3], [pm.outlet[0] + 30, GE - 4], pm.outlet];
    hose.unshift(`<polyline points="${pts(path)}" fill="none" stroke="#202523" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>`);
    // the water: a stream arcing up into a burning window, spray, steam where it lands
    if (t > FT.water) { const k = smooth(FT.water, FT.water + 0.5, t), T2 = [478, 494], C2 = [(tip[0] + T2[0]) / 2 - 40, Math.min(tip[1], T2[1]) - 260], ww = 0.5 + 0.5 * k;
      const end = [lerp(tip[0], T2[0], k), lerp(tip[1], T2[1], k)], cc = [lerp(tip[0], C2[0], k), lerp(tip[1], C2[1], k)];
      hose.push(`<path d="M${f1(tip[0])},${f1(tip[1])} Q${f1(cc[0])},${f1(cc[1])} ${f1(end[0])},${f1(end[1])}" stroke="#DCEBEA" stroke-width="${f1(7 * ww)}" fill="none" opacity="0.75" stroke-linecap="round"/>` +
        `<path d="M${f1(tip[0])},${f1(tip[1])} Q${f1(cc[0])},${f1(cc[1])} ${f1(end[0])},${f1(end[1])}" stroke="#FFFFFF" stroke-width="${f1(2.5 * ww)}" fill="none" stroke-dasharray="18 26" stroke-dashoffset="${f1(-t * 420)}" opacity="0.8"/>`);
      if (k > 0.95) W.push(MAT.smoke(T2[0] - 10, T2[1] - 20, t, {col: 'DFE0D6', k: 0.9, n: 7, rise: 180, drift: 70, speed: 2.2, seed: 61}), MAT.smoke(T2[0] + 20, T2[1] - 10, t + 1.1, {col: 'A3BAB2', k: 0.7, n: 5, rise: 140, drift: 60, speed: 1.8, seed: 62})); }
  }
  fireCrew.push(fig(f1o) + e4Helmet(f1o, '#0B100F'), fig(f2o) + e4Helmet(f2o, '#0B100F'));
  // ---- the families on the sidewalk ----
  const ink = '#0D0C09', pers = (x, y, h, kind, d, an, more = {}) => ({x, y, h, d, kind, fill: ink, det: Math.min(det, 0.5), rim: rimAt(x), an, ...more});
  // an old woman, hunched in a shawl, looking up at the windows
  let ow = e3Stand(pers(720, 912, H * 0.88, 'woman', -1, {...POSES.stand(t, 0.1), tilt: 14 + 3 * Math.sin(t * 0.7), lean: 6}, {hat: 'kerchief', wear: ['plain', 'shawl']}), 720, 720, 0, 'fi.old');
  ow = reach(ow, 'f', ow.x - 0.05 * ow.h, ow.y - 0.7 * ow.h, 'fi.old.shawl');
  // a man with a blanket over his shoulders, his hand on his wife's shoulder
  let wf = e3Stand(pers(818, 918, H * 0.9, 'woman', -1, {...POSES.stand(t, 0.5), tilt: 10 + 4 * Math.sin(t * 0.5 + 1), fArm: [160, 120], bArm: [150, 112]}, {hat: 'none', wear: ['plain']}), 818, 818, 0, 'fi.wife');
  let hb = e3Stand(pers(868, 920, H, 'man', -1, {...POSES.stand(t, 0.7), tilt: 8 + 3 * Math.sin(t * 0.6), bArm: [170, 150]}, {hat: 'none', coat: 'vest'}), 868, 868, 0, 'fi.husb');
  const ws = E3K.shoulder(wf, 'b'); hb = reach(hb, 'f', ws[0] + 4, ws[1] + 2, 'fi.husb.hand');
  // the girl holding her shoes, barefoot, shifting from foot to foot in the snow
  const gx = 948, gG = 936, lift = (k) => 0.03 * H * Math.max(0, Math.sin(t * 1.9 + k * Math.PI)) ** 2;
  let gl = pers(gx, gG, H * 0.68, 'girl', -1, {...POSES.stand(t, 0.4), tilt: 12 + 2 * Math.sin(t * 0.9), fArm: [168, 160], bArm: [150, 120], lean: 0, bob: 0}, {hat: 'none', wear: ['plain']});
  gl = plant(gl, [[gx - 0.05 * gl.h, gG - lift(0)], [gx + 0.05 * gl.h, gG - lift(1)]], 'fi.girl');
  gl = {...gl, floorY: gG};
  const shoes = holding(gl, 'f', 'fi.girl.shoes', (hx, hy) => e4Shoes(hx, hy, t));
  // ---- the Doyles: Mrs. Doyle with the baby, her boy holding her nightgown, her girl holding his hand ----
  const dTurn = t > 25.2 ? 1 : -1, dk = smooth(FT.doyle0 - 0.25, FT.doyle0, t);
  const mo = {x: 1060, y: GD, h: H, kind: 'woman', hat: 'none', wear: ['plain', 'shawl'], fill: ink, det, rim: rimAt(1060)};
  const dWalk = {t0: FT.doyle0, t1: FT.doyle1, to: 2440, a: 0.12, carry: true, an: {}};
  const nod = (a) => -9 * e4Bump(t, a, 0.5);
  const mTilt = t < 25.2 ? 12 + 3 * Math.sin(t * 0.8) : t < FT.doyle0 ? 9 + nod(31.2) + nod(36.0) + 2 * Math.sin(t * 1.3) : 2;
  let mt = e4Track({...mo, an: {tilt: mTilt, expr: t > 33 && t < FT.doyle0 ? 'worried' : 'neutral', blink: (t + 0.4) % 3.9 < 0.12, fArm: [150, 100], bArm: [150, 110]}}, {x: 1060, d: dTurn, G: GD, walks: t >= FT.doyle0 - 0.01 ? [{...dWalk}] : []}, t, 'fi.doyle');
  let dm = mt.fo; dm = {...dm, d: t >= FT.doyleTurn ? 1 : dTurn};
  const baby = e4Baby(dm, 'fi.doyle'); dm = baby.fo;
  // the boy and girl: stand by her; walk with her when she goes
  const bo = {h: H * 0.62, kind: 'boy', hat: 'none', fill: ink, det, rim: rimAt(1000)}, go = {h: H * 0.7, kind: 'girl', hat: 'none', wear: ['plain'], fill: ink, det, rim: rimAt(970)};
  const kidsD = t >= FT.doyleTurn ? 1 : dTurn;
  let bt = e4Track({...bo, an: {tilt: t < 25.2 ? 16 : 10, blink: (t + 1.3) % 4.2 < 0.12}}, {x: 1027, d: kidsD, G: GD + 4, walks: t >= FT.doyle0 - 0.01 ? [{t0: FT.doyle0, t1: FT.doyle1, to: 2440 - 33, a: 0.12, carry: true}] : []}, t, 'fi.boy');
  let gt = e4Track({...go, an: {tilt: t < 25.2 ? 14 : 8, blink: (t + 2.1) % 4.4 < 0.12}}, {x: 996, d: kidsD, G: GD + 8, walks: t >= FT.doyle0 - 0.01 ? [{t0: FT.doyle0, t1: FT.doyle1, to: 2440 - 64, a: 0.12, carry: true}] : []}, t, 'fi.girl2');
  let by = {...bt.fo, d: kidsD}, gg = {...gt.fo, d: kidsD};
  // the boy's front hand holds a fold of her nightgown (a point on her skirt, behind her); the girl holds the boy's free hand
  // (facing right the mother is in front of him: his front hand; facing left she is behind him: his back hand)
  const toMo = kidsD === 1 ? 'f' : 'b', toGirl = kidsD === 1 ? 'b' : 'f', gHand = kidsD === 1 ? 'f' : 'b';
  const skirtPt = E3K.toWorld({...dm, an: {...dm.an, lean: 0, bob: 0}}, dm.d === 1 ? -0.11 : 0.11, 0.44).map((v, i) => v - (i ? (dm.an.bob || 0) * 0 : 0));
  by = reach(by, toMo, skirtPt[0], skirtPt[1], 'fi.boy.skirt');
  const midX = (gg.x + by.x) / 2, kh = (gg.y - 0.47 * gg.h + by.y - 0.5 * by.h) / 2;
  [gg, by] = e3Clasp(gg, gHand, by, toGirl, [midX, kh], 'fi.kids.hands');
  // ---- the captain and his three men walk in from the right ----
  const capX1 = 1185, M = [{x1: 1272, d0: 0.35, h: H * 0.98, hat: 'bowler', coat: 'sack'}, {x1: 1350, d0: 0.7, h: H * 1.02, hat: 'cap', coat: 'jacket'}, {x1: 1425, d0: 1.0, h: H * 0.97, hat: 'bowler', coat: 'frock'}];
  const cs1 = FT.talk1, cs2 = FT.talk2, sp1 = e4Speak(cs1, t), sp2 = e4Speak(cs2, t), sp = sp1.on ? sp1 : sp2;
  // his head: down to Mrs. Doyle, up to Michael on the stoop; a nod on stressed words
  const capTilt = t < FT.capStop ? -2 : t < FT.doyleTurn + 0.3 ? -9 + 4 * sp.beat * (sp.on ? 1 : 0) + nod(30.9) * 0.6 : t < FT.capWalk2[0] ? 0 + 3 * Math.sin(t * 0.9) : t < FT.leave ? 13 + (sp.on ? 3 * sp.beat : 1.5 * Math.sin(t * 0.8)) - 12 * e4Bump(t, FT.tip + 0.2, 0.6) - 8 * e4Bump(t, FT.tip2, 0.55) : 0;
  const capBase = e4CaptainOpts({x: 0, y: 0, h: H, det, rim: rimAt(1200), an: {tilt: capTilt, expr: 'smile', jaw: sp.jaw, blink: (t + 0.9) % 3.6 < 0.12, glintT: t}});
  const capPlan = {x: 2280, d: -1, G: GC, ph: 0.15, walks: [{t0: FT.cap0, t1: FT.capStop, to: capX1, dAfter: -1, a: 0.12}, {t0: FT.capWalk2[0], t1: FT.capWalk2[1], to: 1325, dAfter: 1}, {t0: FT.leave, t1: FT.leave + 3.2, to: 900, dAfter: -1, a: 0.25}]};
  let ct = e4Track(capBase, capPlan, t, 'fi.cap'), cp = ct.fo;
  if (ct.state === 'stand' && t > FT.doyleTurn + 0.45 && t < FT.capWalk2[0]) cp = {...cp, d: 1}; // he turns to watch them go
  // the wrap: a small step in to her (e3Stand), the blanket from his man, opened between his hands, laid round her shoulders
  const stepIn = smooth(FT.wrap0, FT.wrap0 + 0.6, t) * (1 - smooth(FT.release, FT.release + 0.6, t));
  if (ct.state === 'stand' && t > FT.capStop && t < FT.doyleTurn) cp = e3Stand({...cp, x: capX1, an: {...cp.an, ...POSES.stand(t, 0.15), tilt: capTilt, expr: 'smile', jaw: sp.jaw}}, capX1, capX1 - 72, stepIn > 0 && stepIn < 1 ? stepIn : stepIn >= 1 ? 1 : 0, 'fi.cap.step');
  // his arms: keyed gestures while he talks (speaker driven), the blanket, the hat
  const sh1 = E3K.shoulder(dm, 'f'), sh2 = E3K.shoulder(dm, 'b');
  const P1 = [sh1[0] + 0.035 * H, sh1[1] - 0.012 * H], P2 = [sh2[0] - 0.02 * H, sh2[1] - 0.02 * H];
  let blanketSvg = '', drapeOn = t >= FT.wrap1;
  // the men: walk in behind him, stop in a loose group; the first carries the folded blanket over his arm
  const men = M.map((m, k) => {
    const base = {x: 0, y: 0, h: m.h, d: -1, kind: 'man', hat: m.hat, coat: m.coat, fill: ink, det: Math.min(det, 0.6), rim: rimAt(m.x1), an: {tilt: 2 + 3 * Math.sin(t * 0.7 + k), blink: (t + k) % 4.1 < 0.12}};
    const walks = [{t0: FT.cap0 + m.d0, t1: FT.capStop + m.d0 + 0.2, to: m.x1, dAfter: -1, a: 0.12, carry: k === 0, an: k === 0 ? {fArm: [150, 92]} : {}}];
    if (k === 1) walks.push({t0: 39.2, t1: 42.8, to: 905, dAfter: -1}); // to the couple
    if (k === 2) walks.push({t0: 39.7, t1: 43.3, to: 770, dAfter: 1});  // to the old woman
    if (k === 0) walks.push({t0: 39.3, t1: 45.6, to: 2320, a: 0.12});    // he sees the Doyles to the cab
    const tr = e4Track({...base, an: {...base.an, ...(k === 0 && t < FT.blanket + 0.45 ? {fArm: [150, 92]} : {})}}, {x: 2280 + 80 * (k + 1), d: -1, G: GM - 4 * k, ph: 0.3 * k, walks}, t, `fi.man${k}`);
    let f = tr.fo; f.state = tr.state;
    if (k > 0 && tr.state === 'stand' && t > 43.4) { const g = Math.max(0, Math.sin((t - 43.4) * 2.4)); f = {...f, an: {...f.an, fArm: [140 - 40 * g, 110 - 50 * g], tilt: -4}}; } // talking to the families
    return f;
  });
  // blanket handover (28.15 to 29.4): his near (back) hand comes back to the folded blanket on the man's arm, takes it
  const m0 = men[0];
  let fold = null; // where the folded blanket is
  if (t < FT.blanket + 0.45) { if (m0.state !== 'walk' || true) fold = holding(m0, 'f', 'fi.man0.blanket', (hx, hy) => { fold = [hx, hy]; return ''; }) && fold; fold = (() => { const g = E3K.hand(m0, 'f'); return [g.x, g.y]; })(); }
  const capArms = () => {
    const tt = t;
    if (tt < FT.capStop + 0.3) return;
    if (tt < FT.blanket + 0.45) { // reaching back to the blanket
      const k = smooth(FT.blanket - 0.3, FT.blanket, tt), g = E3K.hand(cp, 'b');
      if (fold) cp = k < 1 ? e3Move(cp, 'b', lerp(g.x, fold[0] - 6, k), lerp(g.y, fold[1] - 4, k), 'fi.cap.toBlanket') : reach(cp, 'b', fold[0] - 6, fold[1] - 4, 'fi.cap.blanketTake');
      return;
    }
    if (tt < FT.wrap0) { // the folded blanket comes forward in his near hand
      cp = {...cp, an: {...cp.an, bArm: e4Keys([[FT.blanket + 0.45, 230, 220], [FT.wrap0, 150, 100]], tt)}};
      blanketSvg = holding(cp, 'b', 'fi.cap.blanketHold', (hx, hy) => `<rect x="${f1(hx - 24)}" y="${f1(hy - 6)}" width="48" height="20" rx="4" fill="${E4.blanket}"/><rect x="${f1(hx - 24)}" y="${f1(hy + 2)}" width="48" height="3" fill="#3E4842"/>`);
      return;
    }
    if (tt < FT.wrap1) { // opened between his hands, lifted and laid round her shoulders
      const k = smooth(FT.wrap0 + 0.15, FT.wrap1 - 0.05, tt), open = smooth(FT.wrap0, FT.wrap0 + 0.4, tt);
      const A0 = [cp.x - 0.16 * H, cp.y - 0.78 * H], B0 = [cp.x - 0.06 * H, cp.y - 0.8 * H];
      const A = [lerp(A0[0], P1[0], k), lerp(A0[1], P1[1], k) - 30 * Math.sin(Math.PI * k)], B = [lerp(B0[0], P2[0], k), lerp(B0[1], P2[1], k) - 30 * Math.sin(Math.PI * k)];
      cp = reach(cp, 'f', A[0], A[1], 'fi.cap.blanketA'); cp = reach(cp, 'b', B[0], B[1], 'fi.cap.blanketB');
      const hang = 0.5 * H * open, sw = 6 * Math.sin(tt * 5);
      blanketSvg = poly([A, B, [B[0] + 10 + sw, B[1] + hang], [A[0] - 6 + sw, A[1] + hang * 1.05]], E4.blanket, `opacity="${f1(0.3 + 0.7 * open)}"`) + line([A, [A[0] - 6 + sw, A[1] + hang]], '#3E4842', 2);
      return;
    }
    if (tt < FT.release + 0.5) { // hands rest on her shoulders while he says her name, then come away
      const k = smooth(FT.release, FT.release + 0.5, tt);
      if (k <= 0) { cp = reach(cp, 'f', P1[0], P1[1], 'fi.cap.shoulderA'); cp = reach(cp, 'b', P2[0], P2[1], 'fi.cap.shoulderB'); }
      else { const ra = E3K.hand({...cp, an: {...cp.an, fArm: [150, 120]}}, 'f'), rb = E3K.hand({...cp, an: {...cp.an, bArm: [190, 196]}}, 'b');
        cp = e3Move(cp, 'f', lerp(P1[0], ra.x, k), lerp(P1[1], ra.y, k), 'fi.cap.letGoA'); cp = e3Move(cp, 'b', lerp(P2[0], rb.x, k), lerp(P2[1], rb.y, k), 'fi.cap.letGoB'); }
      return;
    }
    if (tt < FT.capWalk2[0]) { // speaking to her: "You and the children" (open hand to them), "a room at the hotel" (the near hand back
      // toward the cab), "It's taken care of" (a small pat of the air), "Go on, get warm" (toward the cab again); then, as she goes,
      // he turns and his hand shows her the way
      const b = sp1.on ? 6 * sp1.beat : 0;
      const fK = [[32.5, 150, 120], [32.8, 112, 92], [33.6, 118 + b, 98], [34.0, 160, 130], [35.6, 130, 104], [35.9, 136, 118], [36.3, 130, 104], [36.8, 165, 150], [38.6, 165, 150], [39.0, 98, 88], [40.6, 104, 92], [41.3, 172, 168]];
      const bK = [[32.5, 190, 196], [33.6, 192, 198], [34.0, 246, 258], [35.1, 250, 262], [35.5, 196, 204], [37.0, 200, 206], [37.4, 236, 250], [38.3, 240, 254], [38.7, 192, 198]];
      cp = {...cp, an: {...cp.an, fArm: e4Keys(fK, tt), bArm: e4Keys(bK, tt)}};
      return;
    }
    if (ct.state === 'stand' && tt > FT.capWalk2[1] + 0.3 && tt < FT.leave) { // at the stoop: the hat tip, then his line to Michael
      const brim = E3K.toWorld(cp, 0.1, 0.99), brimR = (() => { const a = -(cp.an.tilt || 0) * (cp.d ?? 1) * Math.PI / 180, [px, py] = E3K.toWorld(cp, 0, 0.86), dx = brim[0] - px, dy = brim[1] - py; return [px + dx * Math.cos(a) - dy * Math.sin(a), py + dx * Math.sin(a) + dy * Math.cos(a)]; })();
      const tipAt = (t0) => { if (tt < t0 - 0.3 || tt > t0 + 0.95) return false; const g = E3K.hand({...cp, an: {...cp.an, fArm: [165, 150]}}, 'f');
        if (tt < t0) { const k = smooth(t0 - 0.3, t0, tt); cp = e3Move(cp, 'f', lerp(g.x, brimR[0], k), lerp(g.y, brimR[1], k), 'fi.cap.toBrim', true); }
        else if (tt < t0 + 0.6) cp = reach(cp, 'f', brimR[0], brimR[1], 'fi.cap.brim', true);
        else { const k = smooth(t0 + 0.6, t0 + 0.95, tt); cp = e3Move(cp, 'f', lerp(brimR[0], g.x, k), lerp(brimR[1], g.y, k), 'fi.cap.fromBrim', true); }
        return true; };
      if (tipAt(FT.tip) || tipAt(FT.tip2)) return;
      const b = sp2.on ? 6 * sp2.beat : 0;
      const fK = [[51.7, 165, 150], [52.1, 82, 60], [52.9, 86 + b, 62], [53.3, 132, 112], [54.1, 160, 140], [56.3, 160, 140], [56.7, 150, -48], [57.9, 150, -50], [58.1, 165, 150]];
      const bK = [[54.0, 194, 200], [54.4, 222, 300], [55.4, 224, 304], [55.9, 196, 202]];
      cp = {...cp, an: {...cp.an, fArm: e4Keys(fK, tt), bArm: e4Keys(bK, tt), lean: sp2.on ? 1.5 : 0}};
    }
  };
  capArms();
  // Mrs. Doyle's drape once he has laid it on her
  const drapeSvg = drapeOn ? e4Drape(dm) : '';
  // ---- Michael on his stoop two doors down: arms folded, watching ----
  const kelly = E4_ROW.find((b) => b.kelly), mx = kelly.stoop + E4_STOOP.n * E4_STOOP.run + 40, my = E4F.GS - E4_STOOP.n * E4_STOOP.rise;
  const watchTilt = t < 16 ? 10 + 3 * Math.sin(t * 0.6) : t < 22 ? 4 : t < 45 ? -2 + 2 * Math.sin(t * 0.7) : t < 59 ? -15 + 2 * Math.sin(t * 0.9) - 4 * e4Bump(t, 57.9, 0.9) : -8;
  let mi = cast('michael', {x: mx, y: my, h: H, d: -1, det, rim: rimAt(mx), an: {...POSES.stand(t, 0.6), ...E3_FOLD, lean: 0, tilt: watchTilt, expr: 'set', blink: (t + 2.6) % 3.8 < 0.12}});
  mi = e3Stand({...mi, floorY: my}, mx, mx, 0, 'fi.michael');
  mi = {...mi, an: {...mi.an, ...E3_FOLD, lean: 0}};
  const miSvg = fig(mi) + foldedArms(mi.x, mi.y, mi.h, -1, mi.fill, mi.tones.tone);
  // ---- the cab, waiting down the street (it brought him); it drives off with the Doyles ----
  const cabGo = Math.max(0, t - 46.3), cabD = cabGo * cabGo * 30 * (cabGo < 2 ? 1 : 1) , cabX = 2560 + Math.min(cabD, 9000);
  street.push(brougham(cabX, GE, 150, '#0B100F', cabD, 0, 1, clamp01(cabGo / 2), t));
  // ---- assemble, back to front: block; sidewalk people; smoke; street (engine, crew, hose, cab) ----
  W.push(fig(ow), fig(wf), fig(hb), fig(gl) + shoes);
  W.push(miSvg);
  men.forEach((f) => W.push(fig(f)));
  if (t < FT.blanket + 0.45 && fold) W.push(`<rect x="${f1(fold[0] - 26)}" y="${f1(fold[1] - 4)}" width="52" height="20" rx="4" fill="${E4.blanket}"/><rect x="${f1(fold[0] - 26)}" y="${f1(fold[1] + 4)}" width="52" height="3" fill="#3E4842"/>`);
  W.push(e4Captain(cp));
  W.push(fig(gg), fig(by), fig(dm) + drapeSvg + baby.svg, blanketSvg);
  street.push(lampPost, horseFar.svg, pole, horseNear.svg, pm.svg, fig(drv), reins, ...fireCrew, ...hose);
  // ---- light: firelight wash over everything near the building; snow ----
  const glowWash = `<ellipse cx="${fireX + 60}" cy="560" rx="1250" ry="720" fill="url(#e4wash)" opacity="${f1(0.55 * fl * 100) / 100}" style="mix-blend-mode:screen"/>`;
  const world = layerAt(c, 1, back.join('') + e4Smoke(t, fireK) + W.join('') + street.join('') + pm.sparks + glowWash);
  const sky = `<rect width="1920" height="1080" fill="url(#e4sky)"/>` + `<ellipse cx="${f1(c.sx(520))}" cy="${f1(c.sy(-200))}" rx="${f1(900 * c.z)}" ry="${f1(520 * c.z)}" fill="url(#e4haze)" opacity="${f1(0.8 * fl * 100) / 100}"/>`;
  scr.push(e4Snow(t, c, {n: 230, seed: 41, size: 1.7, speed: 60, op: 0.55, par: 0.25}), e4Snow(t, c, {n: 46, seed: 43, size: 4.2, speed: 150, op: 0.75, par: 0.9, blur: true}));
  if (!o.quiet) scr.push(tag(130, 120, 'WILLIAMSBURG, BROOKLYN · JANUARY 1887 · 3 A.M.', smooth(0.4, 0.8, t) * (1 - smooth(5.6, 6.0, t))));
  const defs = e3Defs(t, e4FireDefs());
  return frame(defs, sky, world, scr.join(''), t);
}
function e4FireDefs() {
  return grad('e4sky', [['0', '#04080A'], ['0.6', '#0E1517'], ['1', '#1E2524']]) +
    `<radialGradient id="e4glow"><stop offset="0" stop-color="#FF9A4A" stop-opacity="0.55"/><stop offset="0.45" stop-color="#FF6A2A" stop-opacity="0.16"/><stop offset="1" stop-color="#FF6A2A" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="e4pool"><stop offset="0" stop-color="#FF8A3D" stop-opacity="0.45"/><stop offset="0.6" stop-color="#FF7A30" stop-opacity="0.12"/><stop offset="1" stop-color="#FF7A30" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="e4wash"><stop offset="0" stop-color="#FF8F45" stop-opacity="0.3"/><stop offset="0.5" stop-color="#FF7A30" stop-opacity="0.1"/><stop offset="1" stop-color="#FF7A30" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="e4haze"><stop offset="0" stop-color="#C2582A" stop-opacity="0.55"/><stop offset="0.5" stop-color="#7A3418" stop-opacity="0.2"/><stop offset="1" stop-color="#7A3418" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="e4win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF7A2E"/><stop offset="0.6" stop-color="#FFA24D"/><stop offset="1" stop-color="#FFD08A"/></linearGradient>` +
    `<filter id="e4blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>` +
    ['4A4440', '6A625C', '7A6656', 'A0582E', '3A3633'].map((cc) => `<radialGradient id="puff${cc}"><stop offset="0" stop-color="#${cc}" stop-opacity="1"/><stop offset="0.55" stop-color="#${cc}" stop-opacity="0.7"/><stop offset="1" stop-color="#${cc}" stop-opacity="0"/></radialGradient>`).join('');
}
if (typeof window !== 'undefined') Object.assign(window, {renderE4Fire});
Object.assign(CLIPS, {ep4_fire: {sec: E4F.sec, render: (t) => renderE4Fire(t)}});
