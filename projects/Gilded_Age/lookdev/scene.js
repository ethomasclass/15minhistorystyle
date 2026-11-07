// Brooklyn Bridge, opening day (May 24, 1883): a side-scrolling silhouette scene drawn entirely in code.
// No AI images. Every element (sky, skyline, bridge, boats, pier, crowd, Michael Kelly) is an SVG shape built here, so the
// scene is consistent, editable, and ready to animate: the figures are rigs (limbs are separate strokes), and each layer has its
// own parallax factor so a camera pan (`cx`) slides the planes at different speeds.
//
// renderScene({look, cx}) returns an SVG string, 1920x1080.

/* ---------- looks ---------- */
const LOOKS = {
  // 1. The channel's locked silhouette palette (visual-style.md 2.6): ink, teal-slate haze, cream light, coral subject.
  dusk: {
    sky: [['0', '#111B1B'], ['0.45', '#1C3332'], ['0.78', '#5F857F'], ['1', '#A3BAB2']],
    glow: {x: 260, y: 760, r: 900, c: '#F4EFE6', a: 0.55}, sun: null,
    far: '#6E918A', bridge: '#22403D', boats: '#162927', fg: '#0D0C09', accent: '#FF6F61',
    water: [['0', '#4E726C'], ['0.25', '#2B4A47'], ['1', '#111B1B']], streak: '#DFE0D6',
    mist: '#A3BAB2', mistA: 0.32, grain: 0.13, windows: null, fireworks: false, stars: false, flat: false, paper: false,
  },
  // 2. Same palette, opening night: the fireworks are the one light source.
  night: {
    sky: [['0', '#060A0A'], ['0.55', '#0E1716'], ['0.85', '#1C3332'], ['1', '#2B4744']],
    glow: {x: 820, y: 330, r: 760, c: '#DFE0D6', a: 0.22}, sun: null,
    far: '#1F3735', bridge: '#0F1B1A', boats: '#0C1514', fg: '#070807', accent: '#FF6F61',
    water: [['0', '#1C3332'], ['0.3', '#111B1B'], ['1', '#070C0C']], streak: null,
    mist: '#5F857F', mistA: 0.18, grain: 0.13, windows: '#F4EFE6', fireworks: true, stars: true, flat: false, paper: false,
  },
  // 3. Flat poster: hard-edged bands, no haze or grain, two-tone buildings. Closest to the reference frames' geometry.
  flat: {
    sky: [['0', '#1C3332'], ['0.42', '#1C3332'], ['0.42', '#335652'], ['0.64', '#335652'], ['0.64', '#5F857F'], ['0.8', '#5F857F'], ['0.8', '#A3BAB2'], ['1', '#A3BAB2']],
    glow: null, sun: {x: 520, y: 470, r: 72, c: '#F4EFE6'},
    far: '#5F857F', farSide: '#4A6E69', bridge: '#1F3B39', boats: '#142524', fg: '#0D0C09', accent: '#FF6F61',
    water: [['0', '#335652'], ['0.35', '#335652'], ['0.35', '#22403D'], ['1', '#22403D']], streak: '#DFE0D6',
    mist: null, mistA: 0, grain: 0, windows: '#DFE0D6', fireworks: false, stars: false, flat: true, paper: false,
  },
  // 4. A warm gaslight variant for the series (breaks the "never orange" rule on purpose, to compare). Teal takes the accent.
  warm: {
    sky: [['0', '#140D09'], ['0.45', '#3A2214'], ['0.78', '#9A5526'], ['1', '#E9A55A']],
    glow: {x: 260, y: 760, r: 900, c: '#F6D29A', a: 0.55}, sun: null,
    far: '#8A5432', bridge: '#3B2216', boats: '#25160E', fg: '#0D0907', accent: '#2FE0C4',
    water: [['0', '#8A5432'], ['0.25', '#4A2A18'], ['1', '#140D09']], streak: '#F6D29A',
    mist: '#E0A060', mistA: 0.28, grain: 0.13, windows: null, fireworks: false, stars: false, flat: false, paper: false,
  },
  // 5. Cut paper: the channel palette, every plane a sheet of paper with a torn edge and a shadow on the one behind.
  paper: {
    sky: [['0', '#16211F'], ['0.45', '#1F3634'], ['0.78', '#5F857F'], ['1', '#A3BAB2']],
    glow: {x: 260, y: 760, r: 900, c: '#F4EFE6', a: 0.45}, sun: null,
    far: '#6E918A', bridge: '#2A4946', boats: '#1A2E2C', fg: '#0D0C09', accent: '#FF6F61',
    water: [['0', '#4E726C'], ['0.25', '#2B4A47'], ['1', '#111B1B']], streak: '#DFE0D6',
    mist: null, mistA: 0, grain: 0.10, windows: null, fireworks: false, stars: false, flat: false, paper: true,
  },
};

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

/* ---------- figures (rigs) ---------- */
// Units: height 1, feet at 0, +y up. d = facing (+1 right, -1 left). Limbs are strokes, so a walk cycle only rotates joints.
function figure(o) {
  const {x, y, h, d = 1, kind = 'man', hat = 'bowler', pose = 'stand', beard = false, coat = 'frock', fill, phase = 0} = o;
  const X = (lx) => x + d * lx * h, Y = (ly) => y - ly * h;
  const P = (a) => a.map(([lx, ly]) => [X(lx), Y(ly)]);
  const g = [];
  const child = kind === 'boy' || kind === 'girl';
  const headR = child ? [0.088, 0.095] : [0.062, 0.071];
  const headY = child ? 0.9 : 0.93;
  const limb = (a, w) => g.push(line(P(a), fill, w * h));
  const at = (sx, sy, len, deg) => [sx + Math.sin(deg * Math.PI / 180) * len, sy + Math.cos(deg * Math.PI / 180) * len]; // deg 0 = up

  // legs
  const hip = child ? 0.46 : 0.5;
  const legW = child ? 0.07 : 0.078;
  const swing = pose === 'walk' ? Math.sin(phase * Math.PI * 2) * 18 : 0;
  const legs = kind === 'woman' ? [] : [swing + 7, -swing - 6];
  for (const a of legs) {
    const knee = at(0.0, hip, hip * 0.52, 180 - a);
    const ankle = at(knee[0], knee[1], hip * 0.48, 180 - a * 0.6);
    limb([[0.0, hip], knee, [ankle[0], Math.max(ankle[1], 0.03)]], legW);
    g.push(`<ellipse cx="${f1(X(ankle[0] + 0.035))}" cy="${f1(Y(0.018))}" rx="${f1(0.055 * h)}" ry="${f1(0.02 * h)}" fill="${fill}"/>`);
  }

  // back arm (drawn first)
  const sh = child ? [0.0, 0.74] : [0.0, 0.81];
  const armW = kind === 'woman' ? 0.044 : child ? 0.05 : 0.055;
  const backSwing = pose === 'walk' ? -swing : 16;
  {
    const e = at(sh[0] - 0.02, sh[1], 0.19 * (child ? 0.8 : 1), 180 + backSwing);
    const hnd = at(e[0], e[1], 0.17 * (child ? 0.8 : 1), 180 + backSwing * 1.4);
    limb([[sh[0] - 0.02, sh[1]], e, hnd], armW);
  }

  // body
  if (kind === 'man') {
    const hem = coat === 'jacket' ? 0.47 : coat === 'sack' ? 0.42 : 0.33;
    g.push(poly(P([[-0.1, 0.845], [0.095, 0.845], [0.11, 0.8], [0.092, 0.6], [coat === 'frock' ? 0.125 : 0.105, hem], [coat === 'frock' ? -0.155 : -0.125, hem - 0.01], [-0.1, 0.6], [-0.115, 0.8]]), fill));
  } else if (kind === 'woman') {
    g.push(poly(P([[-0.085, 0.84], [0.08, 0.84], [0.095, 0.76], [0.07, 0.68], [0.055, 0.6], [-0.055, 0.6], [-0.08, 0.78]]), fill));
    // skirt: flat front, bustle at the back (1880s)
    g.push(poly(P([[0.055, 0.61], [0.09, 0.4], [0.13, 0.02], [0.15, 0.0], [-0.17, 0.0], [-0.15, 0.18], [-0.16, 0.34], [-0.205, 0.45], [-0.2, 0.53], [-0.13, 0.6], [-0.055, 0.61]]), fill));
  } else if (kind === 'boy') {
    g.push(poly(P([[-0.1, 0.78], [0.1, 0.78], [0.1, 0.44], [-0.11, 0.43]]), fill));
  } else if (kind === 'girl') {
    g.push(poly(P([[-0.09, 0.78], [0.09, 0.78], [0.08, 0.6], [0.16, 0.26], [-0.17, 0.26], [-0.08, 0.6]]), fill));
  }
  // neck + head + nose
  g.push(poly(P([[-0.025, 0.84], [0.032, 0.84], [0.03, 0.89], [-0.02, 0.89]]), fill));
  g.push(`<ellipse cx="${f1(X(0.008))}" cy="${f1(Y(headY))}" rx="${f1(headR[0] * h)}" ry="${f1(headR[1] * h)}" fill="${fill}"/>`);
  const nx = headR[0] + 0.004;
  g.push(poly(P([[nx - 0.01, headY + 0.012], [nx + 0.022, headY - 0.012], [nx - 0.006, headY - 0.02]]), fill));
  if (beard) g.push(poly(P([[-0.03, headY - 0.03], [0.07, headY - 0.03], [0.05, headY - 0.1], [0.0, headY - 0.105]]), fill));
  if (kind === 'woman' || kind === 'girl') g.push(`<circle cx="${f1(X(-0.06))}" cy="${f1(Y(headY + 0.02))}" r="${f1(0.032 * h)}" fill="${fill}"/>`);

  // hat
  const top = headY + headR[1];
  if (hat === 'bowler') {
    g.push(`<path d="M${f1(X(-0.06))},${f1(Y(top - 0.012))} A${f1(0.06 * h)},${f1(0.055 * h)} 0 0 ${d > 0 ? 1 : 0} ${f1(X(0.068))},${f1(Y(top - 0.012))} Z" fill="${fill}"/>`);
    g.push(`<ellipse cx="${f1(X(0.006))}" cy="${f1(Y(top - 0.014))}" rx="${f1(0.088 * h)}" ry="${f1(0.013 * h)}" fill="${fill}"/>`);
  } else if (hat === 'top') {
    g.push(poly(P([[-0.052, top - 0.02], [0.062, top - 0.02], [0.058, top + 0.13], [-0.048, top + 0.13]]), fill));
    g.push(`<ellipse cx="${f1(X(0.006))}" cy="${f1(Y(top - 0.016))}" rx="${f1(0.09 * h)}" ry="${f1(0.013 * h)}" fill="${fill}"/>`);
  } else if (hat === 'cap') {
    g.push(`<ellipse cx="${f1(X(-0.004))}" cy="${f1(Y(top - 0.005))}" rx="${f1(0.07 * h)}" ry="${f1(0.034 * h)}" fill="${fill}"/>`);
    g.push(poly(P([[0.03, top - 0.01], [0.115, top - 0.028], [0.05, top - 0.036]]), fill));
  } else if (hat === 'lady') {
    g.push(`<ellipse cx="${f1(X(0.0))}" cy="${f1(Y(top - 0.004))}" rx="${f1(0.07 * h)}" ry="${f1(0.016 * h)}" fill="${fill}"/>`);
    g.push(poly(P([[-0.04, top], [0.045, top], [0.035, top + 0.05], [-0.03, top + 0.05]]), fill));
    g.push(`<path d="M${f1(X(-0.02))},${f1(Y(top + 0.04))} q${f1(-d * 0.05 * h)},${f1(-0.09 * h)} ${f1(-d * 0.11 * h)},${f1(-0.03 * h)} q${f1(d * 0.04 * h)},${f1(0.0)} ${f1(d * 0.1 * h)},${f1(0.05 * h)} Z" fill="${fill}"/>`);
  } else if (hat === 'boycap') {
    g.push(`<ellipse cx="${f1(X(-0.004))}" cy="${f1(Y(top - 0.01))}" rx="${f1(0.095 * h)}" ry="${f1(0.04 * h)}" fill="${fill}"/>`);
    g.push(poly(P([[0.05, top - 0.02], [0.15, top - 0.04], [0.07, top - 0.05]]), fill));
  }

  // front arm
  const fa = [sh[0] + 0.02, sh[1]];
  if (pose === 'wave') { // raises his cap
    const wa = o.waveA || 0, e = at(fa[0], fa[1], 0.19, 30 + wa * 0.4), hnd = at(e[0], e[1], 0.17, 8 + wa);
    limb([fa, e, hnd], armW);
    const [cxl, cyl] = hnd;
    g.push(`<ellipse cx="${f1(X(cxl + 0.01))}" cy="${f1(Y(cyl + 0.035))}" rx="${f1(0.068 * h)}" ry="${f1(0.032 * h)}" fill="${fill}"/>`);
    g.push(poly(P([[cxl + 0.04, cyl + 0.025], [cxl + 0.12, cyl + 0.008], [cxl + 0.055, cyl]]), fill));
  } else if (pose === 'point') {
    const e = at(fa[0], fa[1], 0.19, 72), hnd = at(e[0], e[1], 0.18, 80);
    limb([fa, e, hnd], armW);
  } else if (pose === 'carry') { // hands up holding a child's legs on the shoulders
    const e = at(fa[0], fa[1], 0.15, 40), hnd = at(e[0], e[1], 0.12, -10);
    limb([fa, e, hnd], armW);
  } else {
    const sw = pose === 'walk' ? swing : -15;
    const e = at(fa[0], fa[1], 0.19 * (child ? 0.8 : 1), 180 + sw), hnd = at(e[0], e[1], 0.17 * (child ? 0.8 : 1), 180 + sw * 1.5 - 12);
    limb([fa, e, hnd], armW);
    if (o.cane) limb([hnd, [hnd[0] + 0.05, 0.0]], 0.016);
    if (o.parasol) { limb([[hnd[0] - 0.03, hnd[1] + 0.08], [hnd[0] + 0.07, 0.0]], 0.02); g.push(poly(P([[hnd[0] - 0.005, hnd[1] - 0.02], [hnd[0] + 0.05, hnd[1] - 0.3], [hnd[0] + 0.035, hnd[1] - 0.02]]), fill)); }
  }
  // child riding on the shoulders
  if (pose === 'carry') {
    const ch = 0.5;
    const cx0 = 0.0, cy0 = 0.9; // child's hip at the man's shoulders
    const C = (lx, ly) => [cx0 + lx * ch, cy0 + ly * ch];
    g.push(poly(P([C(-0.1, 0.0), C(0.1, 0.0), C(0.1, 0.34), C(-0.1, 0.34)]), fill));
    g.push(line(P([C(0.02, 0.02), C(0.2, -0.1), C(0.16, -0.32)]), fill, 0.07 * ch * h));
    g.push(line(P([C(-0.02, 0.02), C(-0.17, -0.12), C(-0.14, -0.32)]), fill, 0.07 * ch * h));
    const hc = C(0.008, 0.46);
    g.push(`<ellipse cx="${f1(X(hc[0]))}" cy="${f1(Y(hc[1]))}" rx="${f1(0.085 * ch * h)}" ry="${f1(0.092 * ch * h)}" fill="${fill}"/>`);
    g.push(line(P([C(0.03, 0.3), C(0.16, 0.5), C(0.2, 0.68)]), fill, 0.05 * ch * h)); // child waves
  }
  return `<g>${g.join('')}</g>`;
}

/* ---------- layers ---------- */
const W = 1920, H = 1080, WATER = 772;

function skyLayer(L) {
  const s = [];
  s.push(`<rect width="${W}" height="${H}" fill="url(#sky)"/>`);
  if (L.glow) s.push(`<circle cx="${L.glow.x}" cy="${L.glow.y}" r="${L.glow.r}" fill="url(#glow)"/>`);
  if (L.sun) s.push(`<circle cx="${L.sun.x}" cy="${L.sun.y}" r="${L.sun.r}" fill="${L.sun.c}"/>`);
  if (L.stars) {
    const r = rng(7);
    for (let i = 0; i < 140; i++) s.push(`<circle cx="${f1(r() * W)}" cy="${f1(r() * 520)}" r="${f1(0.6 + r() * 1.3)}" fill="#DFE0D6" opacity="${f1(0.2 + r() * 0.5)}"/>`);
  }
  // river
  s.push(`<rect y="${WATER}" width="${W}" height="${H - WATER}" fill="url(#water)"/>`);
  if (L.streak) { // reflection of the light under the glow
    const r = rng(11);
    const cx = L.glow ? L.glow.x : L.sun.x;
    for (let i = 0; i < 26; i++) {
      const yy = WATER + 6 + i * 9 + r() * 4, w = (260 - i * 7) * (0.5 + r() * 0.8);
      s.push(`<rect x="${f1(cx - w / 2 + (r() - 0.5) * 60)}" y="${f1(yy)}" width="${f1(Math.max(w, 10))}" height="${L.flat ? 4 : 2.5}" fill="${L.streak}" opacity="${f1((L.flat ? 0.9 : 0.55) * (1 - i / 30))}"/>`);
    }
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
  else if (roof < 0.62) s.push(poly([[x + w * 0.1, base - h], [x + w * 0.2, base - h - 12], [x + w * 0.8, base - h - 12], [x + w * 0.9, base - h]], fill)); // mansard
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

function farLayer(L) { // across the river: low brick city, church steeples, one tall spire and a newspaper clock tower
  const r = rng(21), s = [], base = WATER + 2;
  for (let x = -2400; x < 4200;) {
    const w = 34 + r() * 70, hh = 26 + r() * 70 * (r() < 0.12 ? 1.6 : 1);
    s.push(building(x, base, w, hh, L, r, L.far, L.farSide));
    x += w - 2 + (r() < 0.08 ? 40 : 0);
  }
  for (const [x, w, hh, sp] of [[-1500, 26, 120, 150], [-820, 22, 80, 80], [-200, 20, 70, 70], [520, 18, 64, 66], [1460, 22, 84, 90], [2050, 20, 70, 72], [2700, 24, 90, 96], [3300, 18, 66, 70]])
    s.push(steeple(x, base, w, hh, sp, L.far));
  // a tall clock tower with a mansard roof (a newspaper building of the 1870s)
  s.push(`<rect x="-1050" y="${base - 150}" width="70" height="154" fill="${L.far}"/><rect x="-1032" y="${base - 230}" width="34" height="84" fill="${L.far}"/>` +
    poly([[-1036, base - 230], [-1015, base - 290], [-994, base - 230]], L.far));
  if (L.mist) s.push(`<rect x="-2400" y="${base - 60}" width="6600" height="90" fill="url(#mist)"/>`);
  return s.join('');
}

// Bridge: proportions from the real one (towers ~276 ft above water, main span 1,595 ft, side spans 930 ft, deck ~119 ft up),
// scaled so a tower stands 470 px. The true side view hides the Gothic arches; like most illustrations, we cheat and show them.
const B = (() => {
  const towerH = 470, ft = towerH / 276;
  const span = 1595 * ft, side = 930 * ft;
  const tB = 1320, tM = tB - span;
  return {ft, span, side, tB, tM, aB: tB + side, aM: tM - side, top: WATER - towerH, deck: WATER - 119 * ft};
})();

function tower(xc, fill, id) {
  const top = B.top, deck = B.deck;
  const wb = 230, wt = 196;
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

function bridgeLayer(L) {
  const s = [], c = L.bridge, deck = B.deck;
  const saddle = B.top + 8;
  // shores under the side spans
  s.push(`<rect x="${f1(B.aM - 1400)}" y="${WATER - 26}" width="${f1(B.tM - 150 - (B.aM - 1400))}" height="40" fill="${c}"/>`);
  s.push(`<rect x="${f1(B.tB + 160)}" y="${WATER - 26}" width="2200" height="40" fill="${c}"/>`);
  // approaches: masonry ramps with arches
  for (const [a, dir] of [[B.aM, -1], [B.aB, 1]]) {
    const end = a + dir * 900;
    s.push(poly([[a, deck - 4], [end, WATER - 70], [end, WATER - 20], [a, WATER - 20]], c));
  }
  // anchorages
  for (const a of [B.aM, B.aB]) s.push(`<rect x="${f1(a - 170)}" y="${f1(deck - 70)}" width="340" height="${f1(WATER - deck + 60)}" fill="${c}"/>` +
    `<rect x="${f1(a - 180)}" y="${f1(deck - 80)}" width="360" height="14" fill="${c}"/>`);
  // deck (a stiffening truss)
  s.push(`<rect x="${f1(B.aM)}" y="${f1(deck - 6)}" width="${f1(B.aB - B.aM)}" height="26" fill="${c}"/>`);
  if (!L.flat) for (let x = B.aM; x < B.aB; x += 18) s.push(`<line x1="${f1(x)}" y1="${f1(deck - 4)}" x2="${f1(x + 9)}" y2="${f1(deck + 18)}" stroke="${L.fg}" stroke-opacity="0.18" stroke-width="1.5"/>`);
  // cables: main span (parabola), side spans (light sag), suspenders, diagonal stays
  const main = (x) => { const mid = (B.tM + B.tB) / 2, half = B.span / 2; return (deck - 14) - ((deck - 14) - saddle) * ((x - mid) / half) ** 2; };
  const sideC = (x0, y0, x1, y1) => (x) => { const t = (x - x0) / (x1 - x0); return y0 + (y1 - y0) * t + 34 * 4 * t * (1 - t); };
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
  for (const t of [B.tM, B.tB]) for (let dx = 70; dx < 760; dx += 52) for (const dir of [-1, 1])
    susp.push(`M${f1(t + dir * 60)},${f1(saddle + 20)}L${f1(t + dir * dx)},${f1(deck - 4)}`);
  s.push(`<path d="${susp.join('')}" stroke="${c}" stroke-width="1.3" fill="none" opacity="0.85"/>`);
  s.push(tower(B.tM, c, 'twM'), tower(B.tB, c, 'twB'));
  // flags on the tower tops (the bridge was dressed in flags on opening day)
  for (const t of [B.tM, B.tB]) s.push(`<rect x="${f1(t - 2)}" y="${f1(B.top - 70)}" width="4" height="72" fill="${c}"/>` + poly([[t + 2, B.top - 68], [t + 52, B.top - 60], [t + 48, B.top - 40], [t + 2, B.top - 44]], c));
  if (L.mist) s.push(`<rect x="-3000" y="${WATER - 40}" width="8000" height="80" fill="url(#mist)"/>`);
  return s.join('');
}

function fireworks(L) {
  const s = [], r = rng(31);
  const bursts = [[560, 250, 150, '#F4EFE6'], [880, 150, 120, '#A3BAB2'], [300, 330, 100, '#DFE0D6'], [1080, 300, 90, '#F4EFE6'], [-300, 220, 140, '#DFE0D6'], [-700, 300, 110, '#F4EFE6']];
  for (const [x, y, R, c] of bursts) {
    s.push(`<circle cx="${x}" cy="${y}" r="${R * 1.7}" fill="url(#fwglow)"/>`);
    const n = 34;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r() * 0.1, rr = R * (0.75 + r() * 0.3);
      const x2 = x + Math.cos(a) * rr, y2 = y + Math.sin(a) * rr + rr * 0.12;
      s.push(`<line x1="${f1(x + Math.cos(a) * rr * 0.25)}" y1="${f1(y + Math.sin(a) * rr * 0.25)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${c}" stroke-width="2" stroke-linecap="round" opacity="0.8"/>`);
      s.push(`<circle cx="${f1(x2)}" cy="${f1(y2)}" r="3" fill="${c}"/>`);
    }
    s.push(`<line x1="${x}" y1="${f1(B.deck)}" x2="${x + 6}" y2="${y + R * 0.3}" stroke="${c}" stroke-width="1.5" stroke-dasharray="2 9" opacity="0.6"/>`);
    // reflection on the river
    for (let i = 0; i < 9; i++) s.push(`<rect x="${f1(x - 30 + r() * 60)}" y="${f1(WATER + 10 + i * 13)}" width="${f1(14 + r() * 40)}" height="2.5" fill="${c}" opacity="${f1(0.45 - i * 0.04)}"/>`);
  }
  return s.join('');
}

function ship(x, base, c, r) { // a three-masted ship dressed with a line of flags
  const s = [];
  s.push(poly([[x, base - 38], [x + 320, base - 38], [x + 300, base], [x + 30, base]], c));
  s.push(poly([[x + 320, base - 38], [x + 380, base - 52], [x + 322, base - 30]], c)); // bowsprit
  const masts = [[x + 80, 240], [x + 175, 270], [x + 265, 230]];
  for (const [mx, mh] of masts) {
    s.push(`<rect x="${mx - 3}" y="${base - 38 - mh}" width="6" height="${mh}" fill="${c}"/>`);
    for (const [k, w] of [[0.3, 110], [0.55, 90], [0.78, 64]]) s.push(`<rect x="${mx - w / 2}" y="${f1(base - 38 - mh * k - 6)}" width="${w}" height="9" rx="4" fill="${c}"/>`);
  }
  const rig = [[x + 380, base - 52], [masts[2][0], base - 38 - masts[2][1]], [masts[1][0], base - 38 - masts[1][1]], [masts[0][0], base - 38 - masts[0][1]], [x + 10, base - 38]];
  s.push(line(rig, c, 1.5));
  for (let i = 0; i < rig.length - 1; i++) { // pennants along the rigging
    const [x0, y0] = rig[i], [x1, y1] = rig[i + 1];
    for (let t = 0.1; t < 1; t += 0.16) { const px = x0 + (x1 - x0) * t, py = y0 + (y1 - y0) * t; s.push(poly([[px - 5, py], [px + 5, py], [px, py + 14]], c)); }
  }
  return s.join('');
}
function ferry(x, base, c, smoke) { // a side-wheel steam ferry with a walking beam
  const s = [];
  s.push(poly([[x, base - 30], [x + 280, base - 30], [x + 262, base], [x + 18, base]], c));
  s.push(`<rect x="${x + 30}" y="${base - 66}" width="220" height="38" fill="${c}"/><rect x="${x + 50}" y="${base - 84}" width="180" height="20" fill="${c}"/>`);
  s.push(`<path d="M${x + 100},${base - 30} a40,40 0 0 1 80,0 Z" fill="${c}"/>`);
  s.push(line([[x + 120, base - 84], [x + 140, base - 140], [x + 160, base - 84]], c, 5));
  s.push(poly([[x + 100, base - 142], [x + 140, base - 150], [x + 180, base - 142], [x + 140, base - 134]], c));
  for (const sx of [x + 70, x + 205]) s.push(`<rect x="${sx}" y="${base - 150}" width="13" height="70" fill="${c}"/>`);
  if (smoke) for (let i = 0; i < 6; i++) s.push(`<circle cx="${x + 60 - i * 34}" cy="${base - 165 - i * 12}" r="${16 + i * 7}" fill="${smoke}" opacity="${f1(0.35 - i * 0.05)}"/>`);
  return s.join('');
}

function boatLayer(L) {
  const r = rng(41), s = [], base = 852;
  s.push(ship(-260, base, L.boats, r));
  s.push(ferry(560, base + 8, L.boats, L.mist));
  s.push(ship(2300, base + 4, L.boats, r));
  s.push(ferry(-1400, base + 6, L.boats, L.mist));
  for (const x of [380, 1700, -800]) {
    s.push(poly([[x, base - 14], [x + 90, base - 14], [x + 80, base], [x + 10, base]], L.boats));
    s.push(figure({x: x + 30, y: base - 10, h: 46, kind: 'man', hat: 'bowler', fill: L.boats}));
    s.push(line([[x + 40, base - 26], [x + 110, base + 4]], L.boats, 3));
  }
  // ripples
  if (!L.flat) for (let i = 0; i < 70; i++) { const x = -2000 + r() * 5000, y = 800 + r() * 110; s.push(`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(20 + r() * 50)}" height="2" fill="${L.mist || L.far}" opacity="0.18"/>`); }
  if (L.mist) s.push(`<rect x="-3000" y="${base - 30}" width="8000" height="60" fill="url(#mist)" opacity="0.6"/>`);
  return s.join('');
}

function crowdLayer(L) {
  const r = rng(51), s = [], c = L.fg;
  // the pier
  s.push(`<rect x="-6000" y="1000" width="12000" height="90" fill="${c}"/>`);
  s.push(`<rect x="-6000" y="992" width="12000" height="12" fill="${c}"/>`);
  for (let x = -5980; x < 6000; x += 210) s.push(`<rect x="${x}" y="958" width="22" height="40" rx="6" fill="${c}"/><rect x="${x - 5}" y="952" width="32" height="10" rx="4" fill="${c}"/>`);
  // flag poles with bunting
  const poles = [[60, 520], [880, 470], [2100, 500], [-900, 500], [3100, 480], [-2100, 490], [-3300, 510], [-4500, 480]];
  for (const [x, top] of poles) s.push(`<rect x="${x}" y="${top}" width="9" height="${1000 - top}" fill="${c}"/>` + poly([[x + 9, top + 4], [x + 120, top + 18], [x + 112, top + 70], [x + 9, top + 62]], c));
  for (let i = 0; i < poles.length; i++) for (let j = 0; j < poles.length; j++) {
    const [x0, t0] = poles[i], [x1, t1] = poles[j];
    if (x1 <= x0 || x1 - x0 > 1300) continue;
    if (poles.some(([xm]) => xm > x0 && xm < x1)) continue;
    const a = [], y0 = t0 + 90, y1 = t1 + 90;
    for (let t = 0; t <= 1.001; t += 0.05) a.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + 70 * 4 * t * (1 - t)]);
    s.push(line(a, c, 3));
    for (let k = 1; k < a.length - 1; k++) s.push(poly([[a[k][0] - 11, a[k][1]], [a[k][0] + 11, a[k][1]], [a[k][0], a[k][1] + 26]], c));
  }
  // the crowd: back rows first. Keep clear space around Michael so his shape reads.
  const MX = 1170;
  const people = [];
  for (const [row, yb, hb] of [[0, 996, 196], [1, 1012, 220], [2, 1036, 244]]) {
    for (let x = -5200 + r() * 60; x < 4600;) {
      const kinds = ['man', 'man', 'man', 'woman', 'woman', 'boy', 'girl'];
      const kind = kinds[Math.floor(r() * kinds.length)];
      const child = kind === 'boy' || kind === 'girl';
      const hh = hb * (child ? 0.58 + r() * 0.08 : 0.94 + r() * 0.12);
      if (Math.abs(x - MX) > (row === 2 ? 190 : 130)) {
        const faceFireworks = x < 900 ? 1 : -1;
        people.push({row, x, y: yb + r() * 6, h: hh, d: r() < 0.82 ? faceFireworks : -faceFireworks, kind,
          hat: kind === 'man' ? ['bowler', 'bowler', 'top', 'cap'][Math.floor(r() * 4)] : kind === 'woman' ? 'lady' : kind === 'boy' ? 'boycap' : 'none',
          beard: kind === 'man' && r() < 0.4, coat: ['frock', 'sack', 'sack', 'jacket'][Math.floor(r() * 4)],
          pose: 'stand', cane: kind === 'man' && r() < 0.3, parasol: kind === 'woman' && r() < 0.35});
      }
      x += (row === 2 ? 120 : 75) + r() * (row === 2 ? 160 : 70);
    }
  }
  people.push({row: 1, x: 1600, y: 1016, h: 232, d: -1, kind: 'man', hat: 'bowler', pose: 'carry', beard: true, coat: 'sack'});
  people.sort((a, b) => a.row - b.row);
  for (const p of people) s.push(figure({...p, fill: c}));
  // Michael Kelly, 19: the only figure in colour. Cap raised, facing the span.
  s.push(figure({x: MX, y: 1040, h: 248, d: -1, kind: 'man', hat: 'none', pose: 'wave', coat: 'jacket', fill: L.accent, waveA: L.waveA || 0}));
  return s.join('');
}

function nearLayer(L) { // crates and a coiled rope at the very front, moving fastest
  const c = L.fg, s = [];
  for (const x of [-4200, -600, 1980, 3600]) s.push(`<rect x="${x}" y="958" width="150" height="122" fill="${c}"/><rect x="${x + 120}" y="900" width="110" height="180" fill="${c}"/>`);
  s.push(`<ellipse cx="-80" cy="1066" rx="140" ry="36" fill="${c}"/>`);
  return s.join('');
}

/* ---------- assemble ---------- */
function renderScene({look = 'dusk', cx = 0, w = W, h = H, waveA = 0}) {
  const L = {...LOOKS[look], waveA};
  const layer = (par, body, filt = '') => `<g transform="translate(${f1(-cx * par)},0)" ${filt}>${body}</g>`;
  const pf = L.paper ? 'filter="url(#paper)"' : '';
  const defs = `<defs>
    ${grad('sky', L.sky)}${grad('water', L.water)}
    <radialGradient id="glow">${L.glow ? `<stop offset="0" stop-color="${L.glow.c}" stop-opacity="${L.glow.a}"/><stop offset="1" stop-color="${L.glow.c}" stop-opacity="0"/>` : ''}</radialGradient>
    <radialGradient id="fwglow"><stop offset="0" stop-color="#DFE0D6" stop-opacity="0.22"/><stop offset="1" stop-color="#DFE0D6" stop-opacity="0"/></radialGradient>
    ${grad('mist', [['0', L.mist || '#000', 0], ['0.5', L.mist || '#000', L.mistA], ['1', L.mist || '#000', 0]])}
    <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/></radialGradient>
    <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/><feColorMatrix type="saturate" values="0"/></filter>
    <filter id="paper" x="-5%" y="-20%" width="110%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5" result="d"/><feDropShadow in="d" dx="0" dy="6" stdDeviation="7" flood-color="#000" flood-opacity="0.6"/></filter>
    <filter id="shadow" x="-5%" y="-20%" width="110%" height="140%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#000" flood-opacity="0.6"/></filter>
    <filter id="fibre" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.18" numOctaves="3" seed="2"/><feColorMatrix type="saturate" values="0"/></filter>
  </defs>`;
  const body = [
    skyLayer(L),
    L.fireworks ? layer(0.5, fireworks(L)) : '',
    layer(0.25, farLayer(L), pf),
    layer(0.5, bridgeLayer(L), L.paper ? 'filter="url(#shadow)"' : ''),
    layer(0.75, boatLayer(L), pf),
    layer(1.0, crowdLayer(L), pf),
    layer(1.35, nearLayer(L), pf),
    L.paper ? `<rect width="${W}" height="${H}" filter="url(#fibre)" opacity="0.18" style="mix-blend-mode:overlay"/>` : '',
    L.grain ? `<rect width="${W}" height="${H}" filter="url(#grain)" opacity="${L.grain}" style="mix-blend-mode:overlay"/>` : '',
    L.flat ? '' : `<rect width="${W}" height="${H}" fill="url(#vig)"/>`,
  ].join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${W} ${H}">${defs}${body}</svg>`;
}
if (typeof window !== 'undefined') Object.assign(window, {renderScene, LOOKS, B});
