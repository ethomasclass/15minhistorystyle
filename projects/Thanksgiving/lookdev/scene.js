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
  const lod = (h) => { const hs = h * zoom; return {det: smooth(300, 520, hs), rimA: L.rim ? L.rim.a * lit * (0.3 + 0.7 * smooth(140, 320, hs)) : 0}; };
  for (const p of PEOPLE) {
    const facing = p.fixedD ?? (p.flipRoll < 0.82 ? (p.x < 900 ? 1 : -1) : (p.x < 900 ? -1 : 1));
    const {det, rimA} = lod(p.h);
    s.push(figure({...p, d: facing, fill: c, an: crowdAnim(p, t, L), det, tones: {tone: L.tone, lite: L.lite}, rim: L.rim ? {...L.rim, a: rimA} : null}));
  }
  // Michael Kelly, 19: the only figure in colour.
  const mh = 248, ml = lod(mh);
  const wa = 22 * Math.sin(TAU * t * 1.6);
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
      const tq = step12(t), wa = 22 * Math.sin(TAU * t * 1.6);
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
