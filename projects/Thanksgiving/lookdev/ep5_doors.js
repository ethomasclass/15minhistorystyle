// Episode 5 (Fighting Back): the three doors, the episode's signature graphic. Load after ep3_explain.js and explainers.js
// (frame, tapeS, penS, xpArrow) and ep3.js (e3Defs). Teal light = hope; orange torn tape = labels and the FELL SHORT stamp.
//
//   ep5_doors_intro     ch 1 end   the corridor; each door lights in turn, then all three swing open a crack (8.5 s)
//   ep5_door1_close     ch 5 end   AT WORK open on a steel mill, slams shut, dust, FELL SHORT (5 s)
//   ep5_door2_close     ch 6 end   ON THE FARM open on wheat fields, slams shut (5 s)
//   ep5_door3_close     ch 9 end   AT THE BALLOT BOX open on the Capitol dome, slams shut (5 s)
//   ep5_doors_finale    ch 10      a walk past the three doors, a stamp on each; light leaks under them, the four ideas float up
//                                  as glowing cards and carry the camera down the corridor to PROGRESSIVE ERA (24 s)
//   ep5_doors_bug       overlay    the scorecard corner bug: three tiny doors, stamped one by one (6 s; drDoorsBug(n) for stills)
// Beat times are the named tables near each renderer (DI, DCL, DF), so the edit can retime them to the voice.

const DR = {FY: 900, W: 300, H: 640, teal: '#2FE0C4', orange: '#FF9F1C', cream: '#F4EFE6', ink: '#111111',
  wall: '#0F1817', wall2: '#0B1312', frame: '#22312F', leaf: '#1A2826', panel: '#14201F', glow: '#E8FFFA'};
const drIn = (t0, t, d = 0.4) => smooth(t0, t0 + d, t);
const drPop = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : 1 + 0.22 * Math.sin(u * Math.PI) - (1 - u) ** 2);
const drOp = (k, body) => (k <= 0.005 ? '' : `<g opacity="${f1(Math.min(1, k) * 1000) / 1000}">${body}</g>`);
// a hand-inked line: a heavy ink stroke with a second thin offset pass, like a pen going over it twice
function drInk(a, {w = 5, col = DR.ink, seed = 1, close = false, fill = 'none'} = {}) {
  const r = rng(seed), j = (p) => [p[0] + (r() - 0.5) * 2.2, p[1] + (r() - 0.5) * 2.2], A = a.map(j), B = a.map(j);
  const tag = close ? 'polygon' : 'polyline';
  return `<${tag} points="${pts(A)}" fill="${fill}" stroke="${col}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<${tag} points="${pts(B)}" fill="none" stroke="${col}" stroke-width="${f1(w * 0.45)}" stroke-linejoin="round" stroke-linecap="round" opacity="0.7"/>`;
}
const drTealLine = (d, w = 5, k = 1) => `<path d="${d}" fill="none" stroke="#111" stroke-width="${w + 4}" stroke-linecap="round" stroke-linejoin="round" opacity="${f1(k)}"/>` +
  `<path d="${d}" fill="none" stroke="${DR.teal}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${f1(k)}"/>`;

function drDefs(t) {
  return e3Defs(t, `<radialGradient id="drhalo"><stop offset="0" stop-color="${DR.teal}" stop-opacity="0.55"/><stop offset="0.45" stop-color="${DR.teal}" stop-opacity="0.14"/><stop offset="1" stop-color="${DR.teal}" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="drkey"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.95"/><stop offset="0.25" stop-color="${DR.teal}" stop-opacity="0.6"/><stop offset="1" stop-color="${DR.teal}" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="drsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7DEFDD"/><stop offset="0.55" stop-color="#D9FFF8"/><stop offset="0.75" stop-color="#FFFFFF"/><stop offset="1" stop-color="#9FF5E6"/></linearGradient>` +
    `<linearGradient id="drspill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFFFF3" stop-opacity="0.75"/><stop offset="0.35" stop-color="${DR.teal}" stop-opacity="0.32"/><stop offset="1" stop-color="${DR.teal}" stop-opacity="0"/></linearGradient>` +
    `<linearGradient id="drbeam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${DR.teal}" stop-opacity="0.22"/><stop offset="1" stop-color="${DR.teal}" stop-opacity="0"/></linearGradient>` +
    `<linearGradient id="drfloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121B1A"/><stop offset="1" stop-color="#060A0A"/></linearGradient>` +
    `<linearGradient id="drcard" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF8F1"/><stop offset="1" stop-color="#EDE4D0"/></linearGradient>` +
    `<filter id="drb1" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>` +
    `<filter id="drb2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16"/></filter>` +
    `<filter id="drb4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="13"/></filter><filter id="drb3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>`);
}

/* ---------- camera ---------- */
// cam = {x, y, z, sh}: world point (x, y) at screen centre, zoom z, shake sh (px)
const drS = (c) => ({sx: (x) => 960 + (x - c.x) * c.z, sy: (y) => 540 + (y - c.y) * c.z});
const drKey = (keys, t) => { // keys [[t, {x, y, z}]...], eased between
  if (t <= keys[0][0]) return {...keys[0][1]};
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [t0, a] = keys[i - 1], [t1, b] = keys[i], u = ease((t - t0) / (t1 - t0)); return {x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lerp(a.z, b.z, u)}; }
  return {...keys[keys.length - 1][1]};
};
const drShake = (t, t0, amp = 14) => { if (t < t0) return [0, 0]; const d = t - t0, k = amp * Math.exp(-d * 7); return [k * Math.sin(d * 71), k * 0.7 * Math.cos(d * 53 + 1)]; };

/* ---------- the corridor ---------- */
function drWall(t) {
  const FY = DR.FY, s = [`<rect x="-3000" y="${FY - 1800}" width="9000" height="1800" fill="${DR.wall}"/>`];
  // notebook rules on the plaster: faint ruled lines and a margin line, the series' paper showing through the dark
  for (let y = FY - 1760; y < FY - 320; y += 46) s.push(`<rect x="-3000" y="${y}" width="9000" height="1.6" fill="#6F93A8" opacity="0.09"/>`);
  for (let x = -2600; x < 6000; x += 1600) s.push(`<rect x="${x}" y="${FY - 1800}" width="2" height="1480" fill="#B0564A" opacity="0.1"/>`);
  s.push(`<rect x="-3000" y="${FY - 320}" width="9000" height="320" fill="${DR.wall2}"/>`);
  s.push(drInk([[-3000, FY - 322], [6000, FY - 322]], {w: 4, col: '#2C3D3B', seed: 3}), drInk([[-3000, FY - 300], [6000, FY - 300]], {w: 2.5, col: '#22302E', seed: 4}));
  for (let x = -2900; x < 6000; x += 220) s.push(`<rect x="${x}" y="${FY - 270}" width="180" height="220" fill="none" stroke="#1A2624" stroke-width="3"/>`);
  s.push(`<rect x="-3000" y="${FY - 40}" width="9000" height="40" fill="#0A100F"/>`, drInk([[-3000, FY - 40], [6000, FY - 40]], {w: 3, col: '#22302E', seed: 5}));
  return s.join('');
}
// the floor in screen space: boards converge toward a vanishing point that follows the camera
function drFloor(c) {
  const {sx, sy} = drS(c), top = sy(DR.FY), bot = 1180, s = [`<rect x="-200" y="${f1(top)}" width="2320" height="${f1(bot - top + 200)}" fill="url(#drfloor)"/>`];
  const fx = (x, d) => 960 + (x - c.x) * c.z * (1 + 1.3 * d), fy = (d) => top + d * (bot - top);
  const x0 = c.x - 1400 / c.z, x1 = c.x + 1400 / c.z;
  for (let x = Math.floor(x0 / 120) * 120; x < x1; x += 120) s.push(`<line x1="${f1(fx(x, 0))}" y1="${f1(top)}" x2="${f1(fx(x, 1))}" y2="${bot}" stroke="#1E2B29" stroke-width="2"/>`);
  for (const d of [0.04, 0.11, 0.21, 0.35, 0.53, 0.76]) s.push(`<rect x="-200" y="${f1(fy(d))}" width="2320" height="${f1(1 + d * 2)}" fill="#1A2624"/>`);
  return {svg: s.join(''), fx, fy};
}
// light on the floor from a gap [a, b] in world x at the door's foot; spread fans it out toward the camera
function drSpill(F, a, b, k, spread = 1) {
  if (k <= 0.01) return '';
  const P = [[F.fx(a, 0), F.fy(0)], [F.fx(b, 0), F.fy(0)], [F.fx(b + 260 * spread, 0.9), F.fy(0.9)], [F.fx(a - 40 * spread, 0.9), F.fy(0.9)]];
  return `<g opacity="${f1(Math.min(1, k) * 100) / 100}"><polygon points="${pts(P)}" fill="url(#drspill)" filter="url(#drb1)"/>` +
    `<polygon points="${pts([P[0], P[1], [F.fx(b + 60 * spread, 0.25), F.fy(0.25)], [F.fx(a - 8 * spread, 0.25), F.fy(0.25)]])}" fill="#E8FFFA" opacity="0.35" filter="url(#drb1)"/></g>`;
}
// dust motes drifting in a beam (screen space box), seeded
function drMotes(t, x0, y0, x1, y1, n, k, seed) {
  if (k <= 0.01) return '';
  const r = rng(seed), s = [];
  for (let i = 0; i < n; i++) {
    const bx = r(), by = r(), sp = 0.02 + r() * 0.04, ph = r() * 6.28, rad = 1.2 + r() * 2.4;
    const u = (bx + Math.sin(t * 0.4 + ph) * 0.05 + t * sp * 0.3) % 1, v = (by - t * sp + 10) % 1;
    const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.3 + ph));
    s.push(`<circle cx="${f1(x0 + u * (x1 - x0))}" cy="${f1(y0 + v * (y1 - y0))}" r="${f1(rad)}" fill="#E8FFFA" opacity="${f1(tw * k * 0.75)}"/>`);
  }
  return s.join('');
}

/* ---------- emblems (teal linework, about 130 px, centred on 0,0) ---------- */
const DR_EMB = {
  work: () => drTealLine('M-74,26 L-34,10 M-74,46 L-30,28 M-74,26 L-74,46') + drTealLine('M74,26 L34,10 M74,46 L30,28 M74,26 L74,46') +
    drTealLine('M-34,8 Q-30,-14 -6,-16 L22,-16 Q36,-16 36,-4 L36,16 Q36,32 18,32 L-24,32 Q-34,30 -32,20 Z') +
    drTealLine('M-6,-16 L-6,4 M8,-16 L8,6 M22,-16 L22,8 M-30,14 Q-16,6 -4,14') +
    drTealLine('M-44,-60 L-6,-28', 7) + drTealLine('M-62,-66 L-40,-80 L-28,-62 L-50,-48 Z', 5),
  farm: () => {
    let d = '';
    for (let i = -4; i <= 4; i++) { const tx = i * 13, bx = i * 8; d += `M${bx},58 Q${f1(bx * 0.3)},8 ${tx},-34 `; }
    let h = '';
    for (let i = -4; i <= 4; i++) { const x = i * 13, y = -34 - (4 - Math.abs(i)) * 5; h += `M${x},${y + 6} Q${x - 9},${y - 12} ${x},${y - 30} Q${x + 9},${y - 12} ${x},${y + 6} `; }
    return drTealLine(d, 4) + drTealLine(h, 4) + drTealLine('M-22,14 Q0,24 22,14', 7);
  },
  ballot: () => drTealLine('M-56,-6 L56,-6 L56,58 L-56,58 Z') + drTealLine('M-22,-6 L22,-6', 9) + drTealLine('M-56,8 L56,8', 3) +
    drTealLine('M-18,-6 L-14,-62 L22,-58 L18,-6') + drTealLine('M-8,-46 L10,-44 M-9,-34 L8,-32', 3) + drTealLine('M-20,30 L-6,42 L18,18', 5),
  prog: () => drTealLine('M-60,40 L60,40') + drTealLine('M-40,40 A40,40 0 0 1 40,40') + [-70, -35, 0, 35, 70].map((a) => { const r = (a - 90) * Math.PI / 180; return drTealLine(`M${f1(Math.cos(r) * 52)},${f1(40 + Math.sin(r) * 52)} L${f1(Math.cos(r) * 78)},${f1(40 + Math.sin(r) * 78)}`, 4); }).join(''),
};

/* ---------- what is seen through the gap (door-local coords: 0..W, 0..H) ---------- */
function drBeyond(kind, t) {
  const W = DR.W, H = DR.H, sil = '#0E4740', s = [`<rect x="-10" y="-10" width="${W + 20}" height="${H + 20}" fill="url(#drsky)"/>`];
  s.push(`<circle cx="${W * 0.62}" cy="${H * 0.62}" r="120" fill="#FFFFFF" opacity="0.55" filter="url(#drb2)"/>`);
  if (kind === 'work') {
    const g = H * 0.8;
    for (let i = 0; i < 4; i++) { const x = 40 + i * 62, top = g - 300 - (i % 2) * 50; s.push(`<rect x="${x}" y="${top}" width="22" height="${g - top}" fill="${sil}" opacity="0.8"/>`);
      for (let k = 0; k < 4; k++) { const u = ((t * 0.12 + k * 0.25 + i * 0.13) % 1); s.push(`<circle filter="url(#drb1)" cx="${f1(x + 11 + u * 70)}" cy="${f1(top - 20 - u * 160)}" r="${f1(14 + u * 34)}" fill="${sil}" opacity="${f1(0.35 * (1 - u))}"/>`); } }
    s.push(`<path d="M-10,${g} L-10,${g - 110} L80,${g - 170} L170,${g - 110} L170,${g - 150} L320,${g - 150} L320,${g} Z" fill="${sil}" opacity="0.88"/>`);
    for (let x = 10; x < 300; x += 34) s.push(`<rect x="${x}" y="${g - 90}" width="14" height="26" fill="#FFB15C" opacity="0.55"/>`);
    s.push(`<rect x="-10" y="${g}" width="${W + 20}" height="${H - g + 10}" fill="${sil}" opacity="0.92"/>`);
  } else if (kind === 'farm') {
    const g = H * 0.6;
    s.push(`<path d="M-10,${g} Q${W / 2},${g - 18} ${W + 10},${g} L${W + 10},${H + 10} L-10,${H + 10} Z" fill="#5FD8C4" opacity="0.55"/>`);
    for (let row = 0; row < 9; row++) { const y = g + 8 + row * row * 4.4, hh = 10 + row * 6, sp = 9 + row * 3;
      for (let x = -10 + (row % 2) * sp / 2; x < W + 10; x += sp) { const sw = Math.sin(t * 1.6 + x * 0.05 + row) * (2 + row * 0.6);
        s.push(`<path d="M${f1(x)},${f1(y + hh)} Q${f1(x + sw * 0.5)},${f1(y + hh * 0.4)} ${f1(x + sw)},${f1(y)}" stroke="${sil}" stroke-width="${f1(1 + row * 0.35)}" fill="none" opacity="0.75"/>` +
          `<ellipse cx="${f1(x + sw)}" cy="${f1(y - hh * 0.12)}" rx="${f1(1.4 + row * 0.4)}" ry="${f1(3 + row * 1.1)}" fill="${sil}" opacity="0.75"/>`); } }
    s.push(`<path d="M220,${g - 2} l0,-70 l-14,0 l14,-12 l14,12 l-14,0" stroke="${sil}" stroke-width="3" fill="none" opacity="0.7"/>`);
    const a = t * 2.2; s.push(`<g transform="translate(220,${g - 80}) rotate(${f1(a * 57)})" opacity="0.7">${[0, 90, 180, 270].map((r) => `<rect x="-2" y="-34" width="5" height="34" fill="${sil}" transform="rotate(${r})"/>`).join('')}</g>`);
  } else if (kind === 'vote') {
    const g = H * 0.78, cx = W * 0.5;
    s.push(`<path d="M${cx - 120},${g} L${cx - 120},${g - 120} L${cx + 120},${g - 120} L${cx + 120},${g} Z M${cx - 70},${g - 120} L${cx - 70},${g - 200} L${cx + 70},${g - 200} L${cx + 70},${g - 120} Z" fill="${sil}" opacity="0.85"/>`);
    s.push(`<path d="M${cx - 80},${g - 200} Q${cx - 80},${g - 330} ${cx},${g - 340} Q${cx + 80},${g - 330} ${cx + 80},${g - 200} Z" fill="${sil}" opacity="0.85"/>`);
    s.push(`<rect x="${cx - 9}" y="${g - 392}" width="18" height="54" fill="${sil}" opacity="0.85"/><circle cx="${cx}" cy="${g - 398}" r="9" fill="${sil}" opacity="0.85"/>`);
    for (let x = cx - 110; x <= cx + 110; x += 22) s.push(`<rect x="${x}" y="${g - 110}" width="8" height="100" fill="#D9FFF8" opacity="0.35"/>`);
    for (let k = 0; k < 6; k++) s.push(`<rect x="${cx - 150 - k * 8}" y="${g + k * 9}" width="${300 + k * 16}" height="9" fill="${sil}" opacity="${f1(0.7 + k * 0.04)}"/>`);
    s.push(`<rect x="-10" y="${g + 54}" width="${W + 20}" height="${H}" fill="${sil}" opacity="0.92"/>`);
  } else {
    // the Progressive Era: open, bright morning light, a path running away into it
    s.push(`<rect x="-10" y="-10" width="${W + 20}" height="${H + 20}" fill="#F4FFFC"/><circle cx="${W * 0.55}" cy="${H * 0.55}" r="${f1(170 + 12 * Math.sin(t * 1.5))}" fill="#FFFFFF" filter="url(#drb2)"/>`);
    s.push(`<path d="M${W * 0.45},${H * 0.62} L${W * 0.58},${H * 0.62} L${W + 40},${H + 10} L-60,${H + 10} Z" fill="#9FF5E6" opacity="0.55"/>`);
    for (let k = 0; k < 7; k++) { const a = -1.2 + k * 0.4; s.push(`<line x1="${W * 0.55}" y1="${H * 0.55}" x2="${f1(W * 0.55 + Math.cos(a) * 600)}" y2="${f1(H * 0.55 + Math.sin(a) * 600)}" stroke="#2FE0C4" stroke-width="10" opacity="0.18"/>`); }
  }
  return s.join('');
}

/* ---------- one door ---------- */
// d = {x, kind, label, seed}; st = {open: 0..1 (fraction of 75 degrees), glow: edge light, light: the light beyond, stamp: 0..1 pop,
//   leak: light under a closed door, key: keyhole override, emb: emblem brightness}; returns {back, front} so spills can sit between
function drDoor(d, st, t, F) {
  const {W, H, FY} = DR, x0 = d.x - W / 2, top = FY - H, ang = (st.open || 0) * 1.31, w = W * Math.cos(ang), dh = W * Math.sin(ang) * 0.16;
  const glow = st.glow || 0, light = st.light || 0, leak = st.leak || 0, id = `dr${d.seed}`;
  const back = [], front = [];
  // a halo on the wall when lit
  const hk = Math.max(glow * 0.8, light, leak * 0.5) * (d.kind === 'prog' ? 1.6 : 1);
  if (hk > 0.01) back.push(`<ellipse cx="${d.x}" cy="${FY - H * 0.5}" rx="${W * 1.25}" ry="${H * 0.78}" fill="url(#drhalo)" opacity="${f1(hk * 0.85)}"/>`);
  // the frame (architrave, lintel, cornice)
  const fw = 28;
  back.push(`<rect x="${x0 - fw}" y="${top - fw}" width="${W + fw * 2}" height="${H + fw}" fill="${DR.frame}"/>`);
  back.push(drInk([[x0 - fw, FY], [x0 - fw, top - fw], [x0 + W + fw, top - fw], [x0 + W + fw, FY]], {w: 5, seed: d.seed}));
  back.push(`<rect x="${x0 - fw - 22}" y="${top - fw - 34}" width="${W + fw * 2 + 44}" height="30" fill="#2A3B39"/>` + drInk([[x0 - fw - 22, top - fw - 4], [x0 - fw - 22, top - fw - 34], [x0 + W + fw + 22, top - fw - 34], [x0 + W + fw + 22, top - fw - 4], [x0 - fw - 22, top - fw - 4]], {w: 4, seed: d.seed + 1}));
  // the doorway: light and the world beyond, seen where the leaf has swung away
  if (st.open > 0.001) {
    back.push(`<clipPath id="${id}c"><rect x="${x0}" y="${top}" width="${W}" height="${H}"/></clipPath><g clip-path="url(#${id}c)"><g transform="translate(${x0},${top})" opacity="${f1(0.25 + 0.75 * light)}">${drBeyond(d.kind, t)}</g>` +
      `<rect x="${x0}" y="${top}" width="${W}" height="${H}" fill="#03100E" opacity="${f1(0.85 * (1 - light))}"/></g>`);
  } else back.push(`<rect x="${x0}" y="${top}" width="${W}" height="${H}" fill="#050807"/>`);
  // light leaking round a closed or nearly closed leaf (the gap at the frame edges and the threshold)
  const edge = Math.max(glow, leak * 0.6);
  if (edge > 0.01) {
    const ed = `M${x0 + 2},${top + 3} L${x0 + W - 2},${top + 3} L${x0 + W - 2},${FY - 2} M${x0 + 2},${top + 3} L${x0 + 2},${FY - 2}`;
    back.push(`<path d="${ed}" stroke="${DR.teal}" stroke-width="18" fill="none" opacity="${f1(edge * 0.8)}" filter="url(#drb2)"/><path d="${ed}" stroke="#E8FFFA" stroke-width="4" fill="none" opacity="${f1(edge)}"/>`);
  }
  const thr = Math.max(leak, glow * 0.7);
  if (thr > 0.01) front.push(`<rect x="${x0}" y="${FY - 5}" width="${W}" height="7" fill="#E8FFFA" opacity="${f1(thr)}"/><rect x="${x0 - 30}" y="${FY - 22}" width="${W + 60}" height="34" fill="${DR.teal}" opacity="${f1(thr * 0.7)}" filter="url(#drb2)"/>`);
  // the leaf, hinged on the left, swinging toward us: the free edge comes nearer, so it grows a little taller
  const Q = (u, v) => [x0 + w * u, top - dh * 0.6 * u + (H + dh * u) * v];
  const leafP = [Q(0, 0), Q(1, 0), Q(1, 1), Q(0, 1)], shade = st.open > 0 ? Math.min(0.5, ang * 0.5) : 0;
  const L = [];
  L.push(drInk(leafP, {w: 5, close: true, fill: DR.leaf, seed: d.seed + 2}));
  if (shade > 0) L.push(`<polygon points="${pts(leafP)}" fill="#000" opacity="${f1(shade)}"/>`);
  for (const [u0, v0, u1, v1] of [[0.12, 0.06, 0.88, 0.46], [0.12, 0.53, 0.88, 0.94]]) L.push(drInk([Q(u0, v0), Q(u1, v0), Q(u1, v1), Q(u0, v1)], {w: 3.5, close: true, fill: DR.panel, seed: d.seed + 3}));
  // wood grain: faint inked strokes
  const gr = rng(d.seed + 9);
  for (let i = 0; i < 7; i++) { const u = 0.18 + gr() * 0.64, v0 = 0.6 + gr() * 0.1; L.push(`<polyline points="${pts([Q(u, v0), Q(u + 0.01, v0 + 0.12 + gr() * 0.1)])}" stroke="#253633" stroke-width="2" opacity="0.6"/>`); }
  // the emblem, mapped onto the upper panel (affine approximation of the leaf's turn)
  const ek = st.emb ?? Math.max(0.35, glow, light * 0.6, leak * 0.6), ec = Q(0.5, 0.26), sxk = w / W;
  L.push(`<g transform="matrix(${f1(sxk * 1000) / 1000},${f1((-dh * 0.6 / W) * 1000) / 1000},0,${f1((1 + dh * 0.5 / H) * 1000) / 1000},${f1(ec[0])},${f1(ec[1])})" opacity="${f1(0.35 + 0.65 * Math.min(1, ek))}">` +
    (ek > 0.5 ? `<circle r="90" fill="${DR.teal}" opacity="${f1((ek - 0.5) * 0.35)}" filter="url(#drb2)"/>` : '') + DR_EMB[d.kind]() + '</g>');
  // knob and keyhole; the keyhole burns teal while there is light behind the door
  const kn = Q(0.84, 0.53), kh = Q(0.84, 0.575), kk = st.key ?? Math.max(glow, light, leak);
  L.push(`<circle cx="${f1(kn[0])}" cy="${f1(kn[1])}" r="${f1(11 * sxk + 2)}" fill="#3E5F5A" stroke="#111" stroke-width="3"/>`);
  L.push(`<path d="M${f1(kh[0] - 5 * sxk)},${f1(kh[1] + 12)} L${f1(kh[0] - 2 * sxk)},${f1(kh[1])} A${f1(5 * sxk + 0.5)},5 0 1 1 ${f1(kh[0] + 2 * sxk)},${f1(kh[1])} L${f1(kh[0] + 5 * sxk)},${f1(kh[1] + 12)} Z" fill="${kk > 0.05 ? '#E8FFFA' : '#050807'}" opacity="${f1(kk > 0.05 ? 0.4 + 0.6 * kk : 1)}" stroke="#111" stroke-width="1.5"/>`);
  if (kk > 0.05) L.push(`<circle cx="${f1(kh[0])}" cy="${f1(kh[1] + 3)}" r="${f1(46 * kk)}" fill="url(#drkey)"/><rect x="${f1(kh[0] - 90 * kk)}" y="${f1(kh[1] + 2)}" width="${f1(180 * kk)}" height="2" fill="#E8FFFA" opacity="${f1(0.5 * kk)}"/>`);
  // the free edge catches the light as it opens
  if (st.open > 0.01 && light > 0.01) L.push(`<line x1="${f1(Q(1, 0)[0])}" y1="${f1(Q(1, 0)[1])}" x2="${f1(Q(1, 1)[0])}" y2="${f1(Q(1, 1)[1])}" stroke="#E8FFFA" stroke-width="4" opacity="${f1(light)}"/>`);
  front.push(L.join(''));
  // the label on torn tape above the lintel
  const lw = d.label.length * 52 * 0.66 + 26;
  front.push(tapeS(d.x - lw / 2, top - fw - 110, d.label, 52, -2, 1, d.seed + 20));
  // the stamp
  if (st.stamp > 0.001) front.push(drStamp(d.x, FY - H * 0.47, st.stamp, d.seed));
  return {back: back.join(''), front: front.join(''), gap: [x0 + w, x0 + W]};
}
// FELL SHORT: an orange torn strip slapped across the door: comes in big, lands with a jolt and a ring of dust
function drStamp(x, y, u, seed) {
  const k = u < 1 ? 1.7 - 0.7 * ease(u) : 1, size = 62, w = 'FELL SHORT'.length * size * 0.66 + size * 0.5, h = size * 1.28;
  const land = clamp01((u - 1) / 0.6), ring = u >= 1 ? `<ellipse cx="0" cy="0" rx="${f1(w * 0.5 + 60 * land)}" ry="${f1(h * 0.6 + 30 * land)}" fill="none" stroke="#C9C2B0" stroke-width="${f1(10 * (1 - land))}" opacity="${f1(0.35 * (1 - land))}" filter="url(#drb1)"/>` : '';
  return `<g transform="translate(${f1(x)},${f1(y)}) rotate(-8) scale(${f1(k * 1000) / 1000})" opacity="${f1(Math.min(1, u * 2.5))}">${ring}` +
    `<rect x="${f1(-w / 2 + 8)}" y="${f1(-h / 2 + 12)}" width="${f1(w)}" height="${f1(h)}" fill="#000" opacity="0.45" filter="url(#drb1)"/>` +
    tapeS(-w / 2, -h / 2, 'FELL SHORT', size, 0, 1, seed + 40) + '</g>';
}
// the slam: a puff of dust out from under and round the door, paper scraps skittering away (world coords; dt since the slam)
function drPuff(d, dt) {
  if (dt < 0 || dt > 2.2) return '';
  const {W, H, FY} = DR, r = rng(d.seed + 77), s = [];
  for (let i = 0; i < 170; i++) {
    const side = r(), bx = d.x - W / 2 + (side < 0.6 ? r() * W : side < 0.8 ? W + 6 : -6), by = side < 0.6 ? FY - 4 : FY - r() * H;
    const vx = side < 0.6 ? (r() - 0.5) * 260 : (side < 0.8 ? 1 : -1) * (60 + r() * 160), vy = side < 0.6 ? -(20 + r() * 90) : (r() - 0.5) * 60;
    const e = 1 - Math.exp(-dt * 3.2), x = bx + vx * e, y = by + vy * e - dt * 14, rad = 3 + r() * 7 + dt * 14, a = (1 - dt / 2.2) ** 1.5;
    if (i % 4 === 0 && dt < 0.6) { const L = 0.09 * (1 - dt / 0.6); s.push(`<line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x - vx * L)}" y2="${f1(y - vy * L)}" stroke="#D8D2C2" stroke-width="2" opacity="${f1(0.5 * (1 - dt / 0.6))}"/>`); }
    s.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rad)}" fill="#C9C2B0" opacity="${f1(0.28 * a)}"/>`);
  }
  for (let i = 0; i < 9; i++) {
    const bx = d.x - W / 2 + r() * W, vx = (r() - 0.5) * 520, vy = -(120 + r() * 220), e = Math.min(dt, 1.6);
    const x = bx + vx * e * (1 - e * 0.25), y = FY - 10 + vy * e + 260 * e * e, rot = (r() - 0.5) * 900 * e, sz = 10 + r() * 12;
    if (y > FY + 120) continue;
    s.push(`<rect x="${f1(-sz / 2)}" y="${f1(-sz * 0.35)}" width="${f1(sz)}" height="${f1(sz * 0.7)}" fill="${DR.cream}" stroke="#111" stroke-width="1.2" opacity="${f1(Math.max(0, 1 - dt / 2))}" transform="translate(${f1(Math.min(y, FY + 40) === y ? x : x)},${f1(Math.min(y, FY + 30))}) rotate(${f1(rot)}) scale(1,${f1(0.4 + 0.6 * Math.abs(Math.cos(rot * 0.03)))})"/>`);
  }
  return `<g filter="url(#drb1)">${s.filter((q) => q.startsWith('<circle')).join('')}</g>` + s.filter((q) => q.startsWith('<line') || q.startsWith('<rect')).join('');
}

/* ---------- a frame of the corridor ---------- */
// doors: [{d, st}], extraWorld/extraScreen: strings or functions of the camera helpers
function drFrame(t, c, doors, {world = '', screen = '', motes = null, sh = [0, 0], pillars = [-400, 1275, 2425, 3800, 5300]} = {}) {
  const F = drFloor(c), built = doors.map(({d, st}) => drDoor(d, st, t, F));
  let spills = '';
  doors.forEach(({d, st}, i) => {
    const g = built[i].gap, light = st.light || 0, leak = st.leak || 0;
    if ((st.open || 0) > 0.001 && light > 0.01) spills += drSpill(F, g[0], g[1], light, 1 + st.open);
    if (leak > 0.01 || (st.glow || 0) > 0.01) spills += drSpill(F, d.x - DR.W / 2, d.x + DR.W / 2, Math.max(leak, (st.glow || 0) * 0.5) * 0.5, 0.15);
  });
  // foreground pillars between the doors, a little nearer than the wall (parallax)
  let pil = '';
  for (const px of pillars) {
    const p = 1.25, x = 960 + (px - c.x) * c.z * p, hw = 46 * c.z * p;
    if (x < -200 || x > 2120) continue;
    pil += `<rect x="${f1(x - hw)}" y="-40" width="${f1(hw * 2)}" height="1200" fill="#070B0B"/><rect x="${f1(x + hw - 3)}" y="-40" width="3" height="1200" fill="#22302E"/>`;
  }
  const wt = `translate(${f1(960 + sh[0])},${f1(540 + sh[1])}) scale(${f1(c.z * 10000) / 10000}) translate(${f1(-c.x)},${f1(-c.y)})`;
  const W0 = `<g transform="${wt}">${drWall(t)}${built.map((b) => b.back).join('')}</g>`;
  const Fl = `<g transform="translate(${f1(sh[0])},${f1(sh[1])})">${F.svg}${spills}</g>`;
  const W1 = `<g transform="${wt}">${built.map((b) => b.front).join('')}${typeof world === 'function' ? world(drS(c)) : world}</g>`;
  const mo = motes ? drMotes(t, ...motes) : '';
  return frame(drDefs(t), '', W0 + Fl + W1 + mo + `<g transform="translate(${f1(sh[0] * 1.3)},${f1(sh[1] * 1.3)})">${pil}</g>`, typeof screen === 'function' ? screen(drS(c)) : screen, t);
}

const DR_DOORS = [
  {x: 700, kind: 'work', label: 'AT WORK', seed: 11},
  {x: 1850, kind: 'farm', label: 'ON THE FARM', seed: 23},
  {x: 3000, kind: 'vote', label: 'AT THE BALLOT BOX', seed: 37},
];
const DR_PROG = {x: 4600, kind: 'prog', label: 'PROGRESSIVE ERA', seed: 51};

/* ================= ep5_doors_intro (ch 1 end) ================= */
// "They fought at work. They teamed up on the farm. And they fought at the ballot box."
const DI = {sec: 8.5, d1: 0.9, d2: 2.5, d3: 4.1, wide: 5.2, open: 5.9, hold: 7.0};
function renderDoorsIntro(t) {
  const c = drKey([[0, {x: 480, y: 495, z: 1.12}], [DI.d1 + 0.4, {x: 700, y: 495, z: 1.12}], [DI.d1 + 0.8, {x: 700, y: 495, z: 1.12}], [DI.d2 + 0.4, {x: 1850, y: 495, z: 1.12}], [DI.d2 + 0.8, {x: 1850, y: 495, z: 1.12}], [DI.d3 + 0.4, {x: 3000, y: 495, z: 1.12}], [DI.d3 + 0.7, {x: 3000, y: 495, z: 1.12}], [DI.wide + 1.3, {x: 1850, y: 470, z: 0.55}], [DI.sec, {x: 1850, y: 470, z: 0.56}]], t);
  const lit = [DI.d1, DI.d2, DI.d3];
  const doors = DR_DOORS.map((d, i) => {
    const g = drIn(lit[i], t, 0.5), flare = Math.exp(-Math.max(0, t - lit[i]) * 2.5) * (t > lit[i] ? 1 : 0);
    const o = drIn(DI.open + i * 0.12, t, 0.9) * 0.16;
    return {d, st: {glow: g * (0.75 + 0.25 * Math.sin(t * 3 + i)) + flare * 0.5, open: o, light: o > 0 ? Math.min(1, g * 1.2) : 0, emb: 0.3 + g * 0.9}};
  });
  return drFrame(t, c, doors, {motes: [0, 300, 1920, 1080, 60, drIn(DI.open, t, 1.2), 5]});
}

/* ================= the three slams (ch 5, 6, 9 ends) ================= */
const DCL = {sec: 5, gust: 1.0, swing: 1.45, shut: 1.78, keyOut: 2.15, stamp: 2.3};
function renderDoorClose(t, i) {
  const d = {...DR_DOORS[i], x: 960};
  const [shx, shy] = drShake(t, DCL.shut, 16);
  const c = {x: 990 + 20 * smooth(0, DCL.shut, t), y: 505, z: 1.04 + 0.04 * smooth(0, DCL.shut, t) + 0.03 * smooth(DCL.stamp, DCL.sec, t)};
  // open wide on the world beyond, then the swing: slow at first, then fast, a small rebound off the frame
  let open;
  if (t < DCL.swing) open = 0.72 + 0.02 * Math.sin(t * 2.2);
  else if (t < DCL.shut) { const u = (t - DCL.swing) / (DCL.shut - DCL.swing); open = 0.73 * (1 - u * u * u); }
  else { const v = t - DCL.shut; open = v < 0.22 ? 0.035 * Math.sin(v / 0.22 * Math.PI) : 0; }
  const light = t < DCL.shut ? 1 : 0, flick = t < DCL.shut ? 1 : Math.max(0, 1 - (t - DCL.shut) / 0.12);
  const key = t < DCL.shut ? 1 : t < DCL.keyOut ? 0.9 * (1 - (t - DCL.shut) / (DCL.keyOut - DCL.shut)) * (0.6 + 0.4 * Math.sin(t * 60)) : 0;
  const st = {open, light, glow: (t < DCL.shut ? 0.6 : 0) + flick * 0.4 * (t >= DCL.shut ? 1 : 0), key, emb: t < DCL.shut ? 0.8 : 0.3, stamp: t >= DCL.stamp ? Math.min(1.6, (t - DCL.stamp) / 0.13) : 0};
  // paper scraps on the floor drawn toward the door by the draught just before it slams
  const gust = (S) => {
    let s = drPuff(d, t - DCL.shut);
    const r = rng(9 + i);
    for (let k = 0; k < 5; k++) { const x0 = 400 + r() * 1100, u = smooth(DCL.gust, DCL.shut, t), x = lerp(x0, 960 + (r() - 0.5) * 200, u * 0.55), y = DR.FY + 40 + r() * 80 - Math.sin(u * Math.PI) * 30;
      if (t < DCL.shut + 0.05) s += `<rect x="-9" y="-5" width="18" height="10" fill="${DR.cream}" stroke="#111" stroke-width="1.2" opacity="0.85" transform="translate(${f1(x)},${f1(y)}) rotate(${f1(u * 400 * (r() - 0.5))})"/>`; }
    return s;
  };
  return drFrame(t, c, [{d, st}], {world: gust, sh: [shx, shy], pillars: [-200, 2100], motes: t < DCL.shut ? [700, 250, 1500, 1080, 50, 1, 7 + i] : null});
}

/* ================= ep5_doors_finale (ch 10) ================= */
// "Fighting at work: fought back, fell short. Teaming up on the farm: ... Fighting at the ballot box: ...
//  But their ideas didn't go away: an eight-hour workday, the right to join a union, an income tax, senators elected by the people."
//  ... "That time is called the Progressive Era."
const DF = {sec: 24, s1: 1.9, s2: 4.5, s3: 7.1, wide: 8.0, leak: 9.2, c1: 10.0, c2: 11.2, c3: 12.4, c4: 13.6, still: 15.0, pan: 16.8, prog: 19.4, open4: 20.4, fly: 21.4};
const DF_CARDS = [['EIGHT-HOUR DAY', 0, 'c1'], ['RIGHT TO ORGANIZE', 0, 'c2'], ['INCOME TAX', 1, 'c3'], ['SENATORS ELECTED BY VOTERS', 2, 'c4']];
const DF_SLOT = [[180, 245], [960, 245], [180, 370], [960, 370]], DF_TIGHT = [[300, 130], [960, 130], [300, 230], [960, 230]];
function drCard(x, y, txt, k, gl) { // a glowing index card (screen space), x,y = top left
  if (k <= 0.01) return '';
  const size = 44, w = Math.max(360, txt.length * size * 0.64 + 64), h = 96;
  return `<g opacity="${f1(Math.min(1, k) * 100) / 100}"><rect x="${f1(x - 14)}" y="${f1(y - 14)}" width="${f1(w + 28)}" height="${h + 28}" rx="10" fill="${DR.teal}" opacity="${f1(0.55 * gl)}" filter="url(#drb2)"/>` +
    `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${h}" fill="url(#drcard)" stroke="${DR.teal}" stroke-width="3"/>` +
    `<rect x="${f1(x)}" y="${f1(y + 70)}" width="${f1(w)}" height="1.5" fill="#5B7FA0" opacity="0.3"/><rect x="${f1(x + 26)}" y="${f1(y)}" width="1.5" height="${h}" fill="#A0453A" opacity="0.35"/>` +
    `<text x="${f1(x + 40)}" y="${f1(y + 64)}" font-family="Abril" font-size="${size}" fill="${DR.ink}">${txt}</text></g>`;
}
function renderDoorsFinale(t) {
  const c = drKey([[0, {x: 450, y: 495, z: 1.12}], [DF.s1 - 0.4, {x: 700, y: 495, z: 1.12}], [DF.s1 + 0.7, {x: 700, y: 495, z: 1.12}], [DF.s2 - 0.3, {x: 1850, y: 495, z: 1.12}], [DF.s2 + 0.7, {x: 1850, y: 495, z: 1.12}],
    [DF.s3 - 0.3, {x: 3000, y: 495, z: 1.12}], [DF.s3 + 0.6, {x: 3000, y: 495, z: 1.12}], [DF.leak + 0.4, {x: 1850, y: 200, z: 0.55}], [DF.pan, {x: 1880, y: 200, z: 0.55}], [DF.prog + 0.6, {x: 4570, y: 330, z: 0.8}], [DF.sec, {x: 4640, y: 350, z: 0.86}]], t);
  const st3 = [DF.s1, DF.s2, DF.s3], leak = drIn(DF.leak, t, 1.0) * (0.8 + 0.2 * Math.sin(t * 2.3));
  const sh = [0, 1, 2].reduce((a, i) => { const s = drShake(t, st3[i] + 0.13, 6); return [a[0] + s[0], a[1] + s[1]]; }, [0, 0]);
  const doors = DR_DOORS.map((d, i) => ({d, st: {open: 0, stamp: t >= st3[i] ? Math.min(1.6, (t - st3[i]) / 0.13) : 0, leak, emb: 0.3 + leak * 0.4}}));
  const o4 = drIn(DF.open4, t, 2.4) * 0.85, l4 = drIn(DF.open4, t, 0.8);
  doors.push({d: DR_PROG, st: {open: o4, light: l4, glow: drIn(DF.prog - 0.6, t, 1.0) * 0.8, emb: 0.4 + l4}});
  const {sx, sy} = drS(c), gapS = [sx(DR_PROG.x - DR.W / 2 + DR.W * Math.cos(o4 * 1.31) + 30), sy(DR.FY - DR.H * 0.45)];
  const scr = [];
  DF_CARDS.forEach(([txt, di, key], i) => {
    const t0 = DF[key], u = ease(clamp01((t - t0) / 1.7)); if (t < t0) return;
    const from = [sx(DR_DOORS[di].x) - 120, sy(DR.FY) - 20], to = DF_SLOT[i];
    let x = lerp(from[0], to[0], u) + Math.sin(t * 1.1 + i) * 6 * u, y = lerp(from[1], to[1], u) - Math.sin(u * Math.PI) * 60 + Math.sin(t * 0.9 + i * 2) * 5 * u;
    // during the pan the cards drift with the camera, then fly into the opened door
    const pan = ease(clamp01((t - DF.pan) / 3)), fly = ease(clamp01((t - DF.fly - [0.5, 0.75, 0, 0.25][i]) / 1.4));
    x = lerp(x, DF_TIGHT[i][0], pan); y = lerp(y, DF_TIGHT[i][1], pan);
    // a glowing scrap rises off the threshold and only opens into a readable card once it is above the door labels
    const ur = clamp01((t - t0) / 1.7), open = smooth(0.74, 0.92, ur), gone = smooth(0.0, 0.16, fly);
    const k = open * (1 - gone), sc = (0.35 + 0.65 * open) * (1 - 0.3 * pan);
    { const cx = gapS[0] + 380, cy = gapS[1] + 140, m = 1 - fly; x = m * m * x + 2 * m * fly * cx + fly * fly * gapS[0]; y = m * m * y + 2 * m * fly * cy + fly * fly * gapS[1]; }
    const sc2 = sc * (1 - 0.85 * fly), orb = Math.max(1 - open, fly > 0 && fly < 1 ? Math.sin(fly * Math.PI) : 0);
    if (orb > 0.02) { const ox = x + (fly > 0 ? 0 : 150 * sc2), oy = y + (fly > 0 ? 0 : 40 * sc2);
      scr.push(`<circle cx="${f1(ox)}" cy="${f1(oy)}" r="${f1(34 + 10 * Math.sin(t * 7 + i))}" fill="${DR.teal}" opacity="${f1(0.5 * orb)}" filter="url(#drb2)"/><circle cx="${f1(ox)}" cy="${f1(oy)}" r="7" fill="#F4FFFC" opacity="${f1(orb)}"/>` +
        `<rect x="${f1(ox - 14)}" y="${f1(oy - 10)}" width="28" height="20" fill="${DR.cream}" opacity="${f1(0.8 * orb * (1 - open))}" transform="rotate(${f1(Math.sin(t * 3 + i) * 30)}, ${f1(ox)}, ${f1(oy)})"/>`); }
    scr.push(`<g transform="translate(${f1(x)},${f1(y)}) scale(${f1(sc2 * 1000) / 1000})">${drCard(0, 0, txt, k, 0.6 + 0.4 * Math.sin(t * 2 + i))}</g>`);
  });
  const still = drIn(DF.still - 1.1, t, 0.5) * (1 - drIn(DF.pan, t, 0.3));
  if (still > 0.01) scr.push(drOp(still, penS(190, 195, 'still wanted', 34, -3, DR.teal)));
  const motes = [0, 0, 1920, 1080, 70, Math.max(leak * 0.6, l4), 13];
  return drFrame(t, c, doors, {sh, screen: scr.join(''), motes});
}

/* ================= ep5_doors_bug: the scorecard corner bug ================= */
// three tiny doors (top right, inside title-safe); n doors closed and stamped (fractional n animates the next stamp)
function drDoorsBug(n, t = 0, {bg = true} = {}) {
  const X = 1390, Y = 100, s = [];
  if (bg) s.push(`<rect x="${X - 18}" y="${Y - 14}" width="372" height="196" rx="8" fill="rgba(13,12,9,0.82)" stroke="#22302E" stroke-width="2"/>`);
  ['work', 'farm', 'ballot'].forEach((kind, i) => {
    const x = X + 12 + i * 116, y = Y + 18, w = 80, h = 120, closed = n >= i + 1 ? 1 : clamp01(n - i) > 0 ? clamp01(n - i) : 0;
    const lit = 1 - Math.min(1, closed * 2);
    if (lit > 0.01) s.push(`<rect x="${x - 6}" y="${y - 6}" width="${w + 12}" height="${h + 6}" fill="${DR.teal}" opacity="${f1(0.5 * lit * (0.8 + 0.2 * Math.sin(t * 3 + i)))}" filter="url(#drb1)"/>`);
    s.push(`<rect x="${x - 8}" y="${y - 8}" width="${w + 16}" height="${h + 8}" fill="${DR.frame}" stroke="#111" stroke-width="3"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${DR.leaf}" stroke="#111" stroke-width="3"/>`);
    s.push(`<g transform="translate(${x + w / 2},${y + 38}) scale(0.36)" opacity="${f1(0.45 + 0.55 * lit)}">${DR_EMB[kind === 'ballot' ? 'ballot' : kind]()}</g>`);
    s.push(`<circle cx="${x + w * 0.82}" cy="${y + h * 0.58}" r="3.5" fill="${lit > 0.05 ? '#E8FFFA' : '#050807'}"/>`);
    if (closed > 0.01) { const u = closed, k = 1.6 - 0.6 * ease(u);
      s.push(`<g transform="translate(${x + w / 2},${y + h * 0.66}) rotate(-12) scale(${f1(k)})" opacity="${f1(Math.min(1, u * 2))}">${xpTornH(-46, -13, 92, 26, 60 + i)}<path d="M-12,-8 l24,16 M12,-8 l-24,16" stroke="#111" stroke-width="5" stroke-linecap="round"/></g>`); }
  });
  return s.join('');
}
function renderDoorsBug(t) {
  const n = t < 1 ? 0 : t < 2.4 ? smooth(1, 1.25, t) : t < 3.8 ? 1 + smooth(2.4, 2.65, t) : 2 + smooth(3.8, 4.05, t);
  return frame(drDefs(t), '', `<rect width="1920" height="1080" fill="#1a1d1c"/>` + drDoorsBug(n, t), '', t);
}

DR_EMB.vote = DR_EMB.ballot;
if (typeof window !== 'undefined') Object.assign(window, {drDoor, drFrame, drDoorsBug, DR, DR_DOORS, DR_EMB, drStamp});
Object.assign(CLIPS, {
  ep5_doors_intro: {sec: DI.sec, render: (t) => renderDoorsIntro(t)},
  ep5_door1_close: {sec: DCL.sec, render: (t) => renderDoorClose(t, 0)},
  ep5_door2_close: {sec: DCL.sec, render: (t) => renderDoorClose(t, 1)},
  ep5_door3_close: {sec: DCL.sec, render: (t) => renderDoorClose(t, 2)},
  ep5_doors_finale: {sec: DF.sec, render: (t) => renderDoorsFinale(t)},
  ep5_doors_bug: {sec: 6, render: (t) => renderDoorsBug(t)},
});
