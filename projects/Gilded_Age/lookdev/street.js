// A Lower East Side tenement street at dusk, about 1883: Michael Kelly walks home from the refinery and the camera tracks him.
// Drawn in code with the same rig, palette (look 1) and detail levels as the bridge scene (scene.js must load first).
//
// Planes, back to front: sky; far chimneys and a steeple (0.25); the tenement row across the street (0.5); the street with a
// pushcart, a horse and wagon, telegraph poles and their wires (0.75); the near sidewalk where Michael walks (1.0); gas lamps (1.3).
// Period details: fire escapes on the fronts (required on tenements after 1867), laundry on them, shop awnings at street level,
// a pushcart peddler, a tin dinner pail, gas street lamps, overhead telegraph wires (not buried until after 1889). Signs stay blank.

const ST = {
  sky: [['0', '#111B1B'], ['0.5', '#1C3332'], ['0.82', '#5F857F'], ['1', '#A3BAB2']],
  glow: '#F4EFE6', far: '#4E726C', facade: '#1F3A38', facadeDark: '#152A28', win: '#0F1E1D', lit: '#F4EFE6',
  iron: '#0E1918', smallFolk: '#101C1B', street: '#16211F', cobble: '#1E2E2C', mid: '#0F1817', fg: '#0D0C09', accent: '#FF6F61',
  mist: '#A3BAB2', tone: '#2E403D', lite: '#5C7772', rim: {c: '#DFE0D6', a: 0.8, dx: -0.009, dy: -0.002},
};
const WALK_V = 190;         // Michael's walking speed, px/s at the near sidewalk
const M_SCREEN_X = 760;     // where the camera keeps him
const FAR_GROUND = 876, NEAR_GROUND = 1012;

// A walk cycle for the rig: thighs swing, the knee bends on the swing, arms counter-swing, the body bobs twice a cycle.
function walkAn(p, {stride = 22, arm = 18, carry = false} = {}) {
  const a = Math.sin(TAU * p), c = Math.cos(TAU * p);
  const th = [stride * a, -stride * a];
  const shins = [th[0] - 38 * Math.max(0, c), th[1] - 38 * Math.max(0, -c)];
  const armF = carry ? 6 : arm;
  return {legs: th, shins, fArm: [180 + armF * a, 168 + armF * a], bArm: [180 - arm * a, 192 - arm * a * 1.2], bob: 0.012 * Math.cos(2 * TAU * p) - 0.006};
}

/* ---------- far: chimneys, a steeple, factory smoke ---------- */
function stFar(t) {
  const r = rng(301), s = [], base = 620;
  for (let x = -600; x < 3200;) { const w = 60 + r() * 120, h = 40 + r() * 120; s.push(`<rect x="${f1(x)}" y="${f1(base - h)}" width="${f1(w)}" height="${f1(h + 300)}" fill="${ST.far}"/>`); x += w; }
  for (const x of [200, 900, 1700, 2500]) {
    s.push(`<rect x="${x}" y="${base - 330}" width="26" height="340" fill="${ST.far}"/>`);
    for (let i = 0; i < 6; i++) { const p = ((t / 7 + i / 6) % 1); s.push(`<circle cx="${f1(x + 13 + p * 180)}" cy="${f1(base - 340 - p * 120)}" r="${f1(14 + p * 50)}" fill="${ST.far}" opacity="${f1(0.45 * (1 - p))}" filter="url(#soft)"/>`); }
  }
  s.push(steeple(1250, base, 40, 200, 170, ST.far));
  return s.join('');
}

/* ---------- the tenement row across the street ---------- */
function tenement(x, w, floors, seed, t) {
  const r = rng(seed), s = [], g = FAR_GROUND, store = 150, fl = 128, top = g - store - floors * fl;
  const tq = step12(t);
  s.push(`<rect x="${x}" y="${top}" width="${w}" height="${g - top + 4}" fill="${seed % 2 ? ST.facade : ST.facadeDark}"/>`);
  // cornice with brackets
  s.push(`<rect x="${x - 6}" y="${top - 20}" width="${w + 12}" height="24" fill="${ST.iron}"/>`);
  for (let bx = x + 8; bx < x + w - 8; bx += 34) s.push(`<rect x="${bx}" y="${top + 4}" width="10" height="16" fill="${ST.iron}"/>`);
  // windows: three per floor; some lit by gaslight, some with a figure, some with laundry on the fire escape
  const cols = 3, ww = 34, wh = 62, gap = (w - cols * ww) / (cols + 1);
  for (let f = 0; f < floors; f++) {
    const wy = top + f * fl + 34;
    for (let ci = 0; ci < cols; ci++) {
      const wx = x + gap + ci * (ww + gap), lit = r() < 0.32;
      s.push(`<rect x="${f1(wx - 3)}" y="${wy - 6}" width="${ww + 6}" height="6" fill="${ST.iron}"/>`);
      s.push(`<rect x="${f1(wx)}" y="${wy}" width="${ww}" height="${wh}" fill="${lit ? ST.lit : ST.win}" opacity="${lit ? 0.55 : 1}"/>`);
      if (lit && r() < 0.35) s.push(`<ellipse cx="${f1(wx + ww / 2)}" cy="${wy + 30}" rx="9" ry="11" fill="${ST.win}"/><rect x="${f1(wx + ww / 2 - 13)}" y="${wy + 40}" width="26" height="22" rx="8" fill="${ST.win}"/>`);
      s.push(`<rect x="${f1(wx + ww / 2 - 1)}" y="${wy}" width="2" height="${wh}" fill="${ST.iron}" opacity="0.8"/>`);
    }
    // fire escape balcony on the middle bays, with ladders between floors
    const bx0 = x + gap * 0.6, bx1 = x + w - gap * 0.6, by = wy + wh + 4;
    s.push(`<rect x="${f1(bx0)}" y="${by}" width="${f1(bx1 - bx0)}" height="4" fill="${ST.iron}"/><rect x="${f1(bx0)}" y="${by - 30}" width="${f1(bx1 - bx0)}" height="3" fill="${ST.iron}"/>`);
    for (let rx = bx0; rx <= bx1; rx += 9) s.push(`<rect x="${f1(rx)}" y="${by - 30}" width="1.6" height="30" fill="${ST.iron}"/>`);
    if (f < floors - 1) s.push(line([[bx1 - 40, by], [bx1 - 70, by + fl]], ST.iron, 3));
    if (r() < 0.5) { // laundry on the fire escape, swaying
      for (let li = 0; li < 4; li++) {
        const lx = bx0 + 14 + li * 18 + r() * 6, sw = 3 * Math.sin(TAU * (tq / 1.8 + li * 0.3 + seed));
        s.push(poly([[lx, by - 30], [lx + 12, by - 30], [lx + 12 + sw, by - 6 - r() * 8], [lx + sw, by - 8]], ST.lit, 'opacity="0.35"'));
      }
    }
  }
  // the store at street level: an awning with a scalloped edge, a lit window, a doorway and a stoop
  const ay = g - store + 18;
  s.push(`<rect x="${x + 10}" y="${g - store + 50}" width="${w * 0.55}" height="${store - 60}" fill="${ST.lit}" opacity="0.32"/>`);
  s.push(poly([[x + 4, ay], [x + w * 0.62, ay], [x + w * 0.66, ay + 44], [x - 2, ay + 44]], ST.iron));
  for (let sx = x; sx < x + w * 0.64; sx += 16) s.push(`<circle cx="${sx + 8}" cy="${ay + 44}" r="8" fill="${ST.iron}"/>`);
  s.push(`<rect x="${f1(x + w * 0.72)}" y="${g - store + 30}" width="${f1(w * 0.18)}" height="${store - 30}" fill="${ST.win}"/>`);
  for (let k = 0; k < 4; k++) s.push(`<rect x="${f1(x + w * 0.68 - k * 6)}" y="${g - 4 - (3 - k) * 10}" width="${f1(w * 0.26 + k * 12)}" height="10" fill="${ST.iron}"/>`);
  return s.join('');
}

function stRow(t) {
  const s = [], r = rng(311);
  let x = -500, i = 0;
  const heights = [5, 5, 4, 3, 5, 5, 4, 5, 3, 5, 4, 5, 5];
  while (x < 3400) { const w = 230 + r() * 40, fl = heights[i % heights.length]; s.push(tenement(x, w, fl, 400 + i, t)); x += w + 4; i++; }
  // the far sidewalk: small figures idle on stoops, a boy runs after a hoop
  s.push(`<rect x="-600" y="${FAR_GROUND}" width="4200" height="14" fill="${ST.iron}"/>`);
  const folk = [[120, 'woman', 'lady'], [480, 'man', 'bowler'], [520, 'girl', 'none'], [1010, 'man', 'cap'], [1380, 'woman', 'lady'], [1700, 'man', 'top'], [2150, 'woman', 'lady'], [2190, 'boy', 'boycap'], [2600, 'man', 'cap']];
  for (const [fx, kind, hat] of folk) {
    const R = rng(fx), ph = R(), tq = step12(t);
    s.push(figure({x: fx, y: FAR_GROUND, h: kind === 'girl' || kind === 'boy' ? 62 : 104, d: R() < 0.5 ? 1 : -1, kind, hat, fill: ST.smallFolk,
      an: {bob: 0.006 * Math.sin(TAU * (tq / 3 + ph)), lean: 1.2 * Math.sin(TAU * (tq / 5 + ph)), fArm: [165 - 40 * Math.max(0, Math.sin(TAU * (tq / 6 + ph))) ** 2, 150]}}));
  }
  const hx = 300 + ((t * 120) % 2600), hp = (t * 2.2) % 1;
  s.push(figure({x: hx, y: FAR_GROUND, h: 64, d: 1, kind: 'boy', hat: 'boycap', fill: ST.smallFolk, an: {...walkAn(step12(t) * 2.2, {stride: 30, arm: 30}), fArm: [110, 100]}}));
  const ang = (t * 120) / 14;
  s.push(`<circle cx="${f1(hx + 46)}" cy="${FAR_GROUND - 15}" r="15" fill="none" stroke="${ST.smallFolk}" stroke-width="2.5"/>` +
    `<line x1="${f1(hx + 46)}" y1="${FAR_GROUND - 15}" x2="${f1(hx + 46 + 15 * Math.cos(ang))}" y2="${f1(FAR_GROUND - 15 + 15 * Math.sin(ang))}" stroke="${ST.smallFolk}" stroke-width="1.5"/>`);
  // evening haze along the street, and the light of the low sun on the left side of the row
  s.push(`<rect x="-600" y="${FAR_GROUND - 70}" width="4200" height="120" fill="url(#mist)" opacity="0.7"/>`);
  return s.join('');
}

/* ---------- the street: cobbles, a pushcart, telegraph poles, a horse and wagon going the other way ---------- */
function horse(x, gy, sz, c, t, dir = -1) { // sz: height at the withers
  const s = [], p = step12(t) * 1.15, X = (u) => x + dir * u * sz, Yy = (v) => gy - v * sz;
  const legs = [[-0.4, 0], [-0.3, 0.5], [0.36, 0.25], [0.46, 0.75]];
  for (const [lx, off] of legs) {
    const a = 20 * Math.sin(TAU * (p + off)), c2 = Math.cos(TAU * (p + off));
    const hipP = [X(lx), Yy(0.66)], knee = [hipP[0] + dir * Math.sin(a * Math.PI / 180) * 0.32 * sz, hipP[1] + Math.cos(a * Math.PI / 180) * 0.32 * sz];
    const sh = a - 30 * Math.max(0, c2), hoof = [knee[0] + dir * Math.sin(sh * Math.PI / 180) * 0.34 * sz, Math.min(gy - 3, knee[1] + Math.cos(sh * Math.PI / 180) * 0.34 * sz)];
    s.push(line([hipP, knee, hoof], c, 0.075 * sz));
  }
  s.push(`<ellipse cx="${f1(X(0.02))}" cy="${f1(Yy(0.78))}" rx="${f1(0.56 * sz)}" ry="${f1(0.2 * sz)}" fill="${c}"/>`);
  const nod = 0.03 * Math.sin(TAU * p * 2);
  s.push(poly([[X(0.38), Yy(0.92)], [X(0.62), Yy(1.28 + nod)], [X(0.78), Yy(1.24 + nod)], [X(0.98), Yy(1.0 + nod)], [X(0.9), Yy(0.94 + nod)], [X(0.66), Yy(1.04 + nod)], [X(0.52), Yy(0.66)]], c));
  s.push(poly([[X(0.66), Yy(1.26 + nod)], [X(0.68), Yy(1.38 + nod)], [X(0.72), Yy(1.27 + nod)]], c));
  const sw = 0.05 * Math.sin(TAU * p);
  s.push(`<path d="M${f1(X(-0.5))},${f1(Yy(0.88))} Q${f1(X(-0.66))},${f1(Yy(0.6))} ${f1(X(-0.6 + sw))},${f1(Yy(0.32))} L${f1(X(-0.54 + sw))},${f1(Yy(0.34))} Q${f1(X(-0.56))},${f1(Yy(0.62))} ${f1(X(-0.46))},${f1(Yy(0.8))} Z" fill="${c}"/>`);
  return s.join('');
}
function wagon(x, gy, sz, c, t, dir = -1) { // a delivery wagon behind the horse, barrels in the back, spoked wheels turning
  const s = [], X = (u) => x - dir * u * sz, dist = t * 120;
  s.push(horse(x, gy, sz, c, t, dir));
  s.push(line([[X(0.3), gy - 0.8 * sz], [X(1.0), gy - 0.62 * sz]], c, 5));
  const bx0 = X(1.0), bx1 = X(2.3), top = gy - 0.95 * sz, bot = gy - 0.45 * sz;
  s.push(figure({x: X(1.2), y: top + 0.42 * sz, h: 1.1 * sz, d: dir, kind: 'man', hat: 'bowler', coat: 'sack', fill: c, an: {fArm: [100, 85], bob: 0.01 * Math.sin(TAU * step12(t) * 2.3)}})); // seated behind the box
  s.push(`<rect x="${f1(Math.min(bx0, bx1))}" y="${f1(top)}" width="${f1(Math.abs(bx1 - bx0))}" height="${f1(bot - top)}" fill="${c}"/>`);
  for (const [k, u] of [[0, 1.75], [1, 2.05]]) s.push(`<rect x="${f1(X(u) - 0.13 * sz)}" y="${f1(top - 0.32 * sz)}" width="${f1(0.26 * sz)}" height="${f1(0.34 * sz)}" rx="${f1(0.06 * sz)}" fill="${c}"/>`);
  for (const [u, rr] of [[1.25, 0.3], [2.1, 0.4]]) {
    const cx = X(u), cy = gy - rr * sz, R = rr * sz, ang = -dir * dist / R + step12(t) * 0;
    let spokes = '';
    for (let i = 0; i < 10; i++) { const a = ang + i * TAU / 10; spokes += `M${f1(cx)},${f1(cy)}L${f1(cx + Math.cos(a) * R)},${f1(cy + Math.sin(a) * R)}`; }
    s.push(`<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(R)}" fill="none" stroke="${c}" stroke-width="${f1(0.05 * sz)}"/><path d="${spokes}" stroke="${c}" stroke-width="${f1(0.022 * sz)}"/><circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(0.06 * sz)}" fill="${c}"/>`);
  }
  return s.join('');
}
function pushcart(x, gy, c, t) {
  const s = [], tq = step12(t);
  s.push(`<rect x="${x}" y="${gy - 92}" width="190" height="26" fill="${c}"/>`);
  for (let i = 0; i < 12; i++) s.push(`<circle cx="${x + 12 + (i % 6) * 32}" cy="${gy - 98 - Math.floor(i / 6) * 14}" r="11" fill="${c}"/>`);
  s.push(line([[x + 190, gy - 80], [x + 270, gy - 70]], c, 6));
  s.push(`<circle cx="${x + 60}" cy="${gy - 36}" r="36" fill="none" stroke="${c}" stroke-width="6"/><circle cx="${x + 150}" cy="${gy - 36}" r="36" fill="none" stroke="${c}" stroke-width="6"/>`);
  s.push(line([[x + 40, gy - 66], [x + 40, gy]], c, 5));
  s.push(figure({x: x - 50, y: gy, h: 168, d: 1, kind: 'man', hat: 'cap', beard: true, coat: 'sack', fill: c,
    an: {fArm: [165 - 70 * Math.max(0, Math.sin(TAU * tq / 4)) ** 2, 140], tilt: 6 * Math.sin(TAU * tq / 5), lean: 1.5 * Math.sin(TAU * tq / 5)}}));
  return s.join('');
}
function stStreet(t) {
  const s = [];
  s.push(`<rect x="-1000" y="${FAR_GROUND + 14}" width="6000" height="${NEAR_GROUND - FAR_GROUND}" fill="${ST.street}"/>`);
  s.push(`<rect x="-1000" y="${FAR_GROUND + 14}" width="6000" height="${NEAR_GROUND - FAR_GROUND}" fill="url(#cobble)"/>`);
  // telegraph poles: many crossarms, many wires
  const poles = [-400, 700, 1800, 2900, 4000];
  for (const px of poles) {
    s.push(`<rect x="${px}" y="-20" width="12" height="${FAR_GROUND + 30}" fill="${ST.mid}"/>`);
    for (let k = 0; k < 5; k++) s.push(`<rect x="${px - 60}" y="${30 + k * 34}" width="132" height="6" fill="${ST.mid}"/>`);
  }
  let wires = '';
  for (let i = 0; i < poles.length - 1; i++) for (let k = 0; k < 5; k++) for (const dx of [-54, -20, 26, 62]) {
    const x0 = poles[i] + dx, x1 = poles[i + 1] + dx, y0 = 30 + k * 34;
    wires += `M${x0},${y0} Q${(x0 + x1) / 2},${y0 + 60 + k * 6} ${x1},${y0}`;
  }
  s.push(`<path d="${wires}" stroke="${ST.mid}" stroke-width="1.4" fill="none" opacity="0.9"/>`);
  s.push(pushcart(1150, FAR_GROUND + 70, ST.mid, t));
  s.push(wagon(2700 - t * 120, NEAR_GROUND - 24, 150, ST.mid, t, -1));
  return s.join('');
}

/* ---------- the near sidewalk: Michael, and people passing the other way ---------- */
function stNear(t, zoom, mx) {
  const s = [], c = ST.fg;
  s.push(`<rect x="-1000" y="${NEAR_GROUND - 8}" width="7000" height="12" fill="${c}"/><rect x="-1000" y="${NEAR_GROUND}" width="7000" height="1400" fill="${c}"/>`);
  const lod = (h) => { const hs = h * zoom; return {det: smooth(430, 680, hs), rimA: ST.rim.a * (0.3 + 0.7 * smooth(170, 420, hs))}; };
  const tones = {tone: ST.tone, lite: ST.lite};
  const passers = [
    {x0: 1500, v: 120, kind: 'woman', hat: 'lady', h: 232, basket: true, ph: 0.2},
    {x0: 2500, v: 150, kind: 'man', hat: 'top', h: 246, cane: true, coat: 'frock', ph: 0.6},
    {x0: 3300, v: 135, kind: 'boy', hat: 'boycap', h: 150, papers: true, ph: 0.1},
    {x0: 900, v: 0, kind: 'man', hat: 'bowler', h: 238, coat: 'sack', ph: 0.4, idle: true},
  ];
  for (const p of passers) {
    const x = p.x0 - p.v * t, {det, rimA} = lod(p.h);
    const an = p.idle ? {bob: 0.004 * Math.sin(TAU * step12(t) / 3.2), tilt: 8 * Math.sin(TAU * step12(t) / 6), lean: -2} : walkAn((step12(t) * p.v / 160 + p.ph) % 1, {carry: !!p.basket});
    s.push(figure({x, y: NEAR_GROUND - 6, h: p.h, d: p.v ? -1 : 1, kind: p.kind, hat: p.hat, coat: p.coat || 'sack', fill: c, an,
      basket: p.basket, cane: p.cane && !p.v, papers: p.papers, det, tones, rim: {...ST.rim, a: rimA}}));
  }
  const {det, rimA} = lod(248);
  s.push(figure({x: mx, y: NEAR_GROUND, h: 248, d: 1, kind: 'man', hat: 'cap', coat: 'jacket', fill: ST.accent, pail: true,
    an: {...walkAn((step12(t) * WALK_V / 220) % 1, {carry: true}), tilt: -3}, det, tones: MICHAEL_TONES, rim: {...ST.rim, a: rimA}}));
  return s.join('');
}

function stLamps(t) { // gas street lamps, lit at dusk
  const s = [], c = ST.fg;
  for (const x of [-200, 1100, 2400, 3700, 5000]) {
    s.push(`<rect x="${x - 7}" y="560" width="14" height="530" fill="${c}"/><rect x="${x - 14}" y="1000" width="28" height="80" fill="${c}"/>`);
    s.push(`<circle cx="${x}" cy="520" r="90" fill="url(#lampglow)" opacity="${f1(0.8 + 0.1 * Math.sin(TAU * step12(t) * 1.3 + x))}"/>`);
    s.push(poly([[x - 26, 490], [x + 26, 490], [x + 18, 556], [x - 18, 556]], ST.lit, 'opacity="0.7"'));
    s.push(poly([[x - 32, 492], [x, 470], [x + 32, 492]], c) + `<rect x="${x - 22}" y="552" width="44" height="10" fill="${c}"/>`);
    s.push(line([[x - 26, 490], [x - 18, 556]], c, 3) + line([[x + 26, 490], [x + 18, 556]], c, 3));
  }
  return s.join('');
}

function renderStreet({t = 0, zoom = 1, fx = 960, fy = 540, cx = null}) {
  const mx = 300 + WALK_V * t;            // Michael's place on the near sidewalk
  const camX = cx ?? (mx - M_SCREEN_X);   // the camera keeps him at the same spot on screen
  const zs = (par) => 1 + (zoom - 1) * par;
  const layer = (par, body) => `<g transform="translate(${f1(fx)},${f1(fy)}) scale(${zs(par).toFixed(4)}) translate(${f1(-fx)},${f1(-fy)}) translate(${f1(-camX * par)},0)">${body}</g>`;
  const defs = `<defs>${grad('sky', ST.sky)}
    <radialGradient id="glow"><stop offset="0" stop-color="${ST.glow}" stop-opacity="0.6"/><stop offset="1" stop-color="${ST.glow}" stop-opacity="0"/></radialGradient>
    <radialGradient id="lampglow"><stop offset="0" stop-color="#F4EFE6" stop-opacity="0.35"/><stop offset="1" stop-color="#F4EFE6" stop-opacity="0"/></radialGradient>
    ${grad('mist', [['0', ST.mist, 0], ['0.5', ST.mist, 0.28], ['1', ST.mist, 0]])}
    <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/></radialGradient>
    <radialGradient id="sunwash" cx="0" cy="0.62" r="0.9"><stop offset="0" stop-color="#F4EFE6" stop-opacity="0.22"/><stop offset="1" stop-color="#F4EFE6" stop-opacity="0"/></radialGradient>
    <pattern id="cobble" width="26" height="14" patternUnits="userSpaceOnUse"><rect x="1" y="1" width="22" height="10" rx="4" fill="${ST.cobble}"/><rect x="14" y="8" width="22" height="10" rx="4" fill="${ST.cobble}" opacity="0.6"/></pattern>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${Math.floor(t * 12) % 50}"/><feColorMatrix type="saturate" values="0"/></filter>
  </defs>`;
  const body = [
    `<rect width="${W}" height="${H}" fill="url(#sky)"/><circle cx="120" cy="560" r="1000" fill="url(#glow)"/>`,
    layer(0.25, stFar(t)),
    layer(0.5, stRow(t)),
    `<rect width="${W}" height="${H}" fill="url(#sunwash)" style="mix-blend-mode:screen"/>`,
    layer(0.75, stStreet(t)),
    layer(1.0, stNear(t, zoom, mx)),
    layer(1.3, stLamps(t)),
    `<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.13" style="mix-blend-mode:overlay"/>`,
    `<rect width="${W}" height="${H}" fill="url(#vig)"/>`,
  ].join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}${body}</svg>`;
}

Object.assign(CLIPS, {
  // Wide tracking shot: the camera keeps pace with Michael as he walks home.
  walk_wide: {sec: 10, render: (t) => renderStreet({t})},
  // Medium tracking shot: the same walk, closer, so his detail shows.
  walk_medium: {sec: 7, render: (t) => renderStreet({t: t + 2, zoom: 4.2, fx: 760, fy: 962})},
});
if (typeof window !== 'undefined') Object.assign(window, {renderStreet, walkAn});
