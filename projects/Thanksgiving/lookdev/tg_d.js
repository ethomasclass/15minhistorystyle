// Thanksgiving: the Ch 5 menu ("That's basically your menu. Turkey in the middle, pumpkin pie at the end.") as a real 3D table, in
// the manner of ep3_map.js: a scene in world units (inches: x along the table, y across, z up), a camera with a target, yaw, pitch
// and distance, a true perspective projection, faces culled, lit by one cream light and painted far to near. The camera orbits
// as the dishes land. Coral = the turkey. Load after tg_c.js.
//
//   tg_table_3d   9 s. Cues (s into the clip, from ch05 words: the cut is at "Sound familiar" 24.9): plates 0.8, turkey 2.3, pie 3.9.

const T3 = {sec: 9, F: 2300, plates: 0.8, turkey: 2.3, pie: 3.9, sides: [1.4, 1.7, 2.0, 4.6, 4.9], TOP: 30};
const t3n = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const t3x = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const t3d = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const T3_LIGHT = t3n([-0.4, -0.55, 0.75]);
function t3Cam(t) { const u = ease(t / T3.sec), yaw = (-38 + 76 * u) * Math.PI / 180, pitch = (40 - 9 * u) * Math.PI / 180, D = 262 - 50 * smooth(0, 7, t), T = [4 * u, 0, T3.TOP - 6];
  const C = [T[0] + D * Math.cos(pitch) * Math.sin(yaw), T[1] - D * Math.cos(pitch) * Math.cos(yaw), T[2] + D * Math.sin(pitch)], f = t3n([T[0] - C[0], T[1] - C[1], T[2] - C[2]]), r = t3n(t3x(f, [0, 0, 1])), up = t3x(r, f);
  return {C, f, r, up, P: (p) => { const v = [p[0] - C[0], p[1] - C[1], p[2] - C[2]], z = Math.max(8, t3d(v, f)); return [960 + T3.F * t3d(v, r) / z, 560 - T3.F * t3d(v, up) / z, z]; }}; }
// meshes: lists of faces {p: [points], c: colour, flat: don't shade}
const t3Box = (cx, cy, z0, sx, sy, sz, c) => { const x0 = cx - sx / 2, x1 = cx + sx / 2, y0 = cy - sy / 2, y1 = cy + sy / 2, z1 = z0 + sz;
  return [[[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [[x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0]], [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], [[x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1]],
    [[x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1]], [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]]].map((p) => ({p, c})); };
const t3Cyl = (cx, cy, z0, rx, ry, h, n, cs, ct, r1 = 1) => { const f = [], top = []; // r1: the top's radius as a share of the base (a bowl flares, r1 > 1)
  for (let i = 0; i < n; i++) { const a = i / n * TAU, b = (i + 1) / n * TAU; top.push([cx + Math.cos(a) * rx * r1, cy + Math.sin(a) * ry * r1, z0 + h]);
    f.push({p: [[cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, z0], [cx + Math.cos(b) * rx, cy + Math.sin(b) * ry, z0], [cx + Math.cos(b) * rx * r1, cy + Math.sin(b) * ry * r1, z0 + h], [cx + Math.cos(a) * rx * r1, cy + Math.sin(a) * ry * r1, z0 + h]], c: cs}); }
  f.push({p: top, c: ct}); return f; };
const t3Ball = (cx, cy, cz, rx, ry, rz, c, nl = 8, nn = 16, tilt = 0) => { const f = [], ct = Math.cos(tilt), st = Math.sin(tilt), pt = (la, lo) => { const x = Math.cos(la) * Math.cos(lo) * rx, y = Math.cos(la) * Math.sin(lo) * ry, z = Math.sin(la) * rz; return [cx + x * ct - z * st, cy + y, cz + x * st + z * ct]; };
  for (let i = 0; i < nl; i++) for (let j = 0; j < nn; j++) { const a0 = -Math.PI / 2 + Math.PI * i / nl, a1 = -Math.PI / 2 + Math.PI * (i + 1) / nl, b0 = TAU * j / nn, b1 = TAU * (j + 1) / nn; f.push({p: [pt(a0, b0), pt(a0, b1), pt(a1, b1), pt(a1, b0)], c}); }
  return f; };
// paint one object: cull back faces, shade, sort far to near
function t3Paint(cam, faces, {lift = 0, op = 1, k = 1, cx = 0, cy = 0} = {}) { const out = [];
  for (const fc of faces) { const p = fc.p.map(([x, y, z]) => [cx + (x - cx) * k, cy + (y - cy) * k, z + lift]), n = t3n(t3x([p[1][0] - p[0][0], p[1][1] - p[0][1], p[1][2] - p[0][2]], [p[2][0] - p[0][0], p[2][1] - p[0][1], p[2][2] - p[0][2]]));
    const mid = p.reduce((a, q) => [a[0] + q[0] / p.length, a[1] + q[1] / p.length, a[2] + q[2] / p.length], [0, 0, 0]), view = [cam.C[0] - mid[0], cam.C[1] - mid[1], cam.C[2] - mid[2]];
    if (t3d(n, view) <= 0 && !fc.two) continue;
    const s2 = p.map(cam.P), lit = Math.max(0, t3d(n, T3_LIGHT) * (t3d(n, view) < 0 ? -1 : 1));
    out.push([Math.hypot(view[0], view[1], view[2]), `<polygon points="${pts(s2)}" fill="${fc.flat ? fc.c : shade(fc.c, -0.5 + 0.62 * lit)}" stroke="${fc.flat ? fc.c : shade(fc.c, -0.5 + 0.62 * lit)}" stroke-width="0.8" stroke-linejoin="round"/>`]); }
  out.sort((a, b) => b[0] - a[0]); const g = out.map((o) => o[1]).join('');
  return op >= 0.995 ? g : `<g opacity="${f1(op * 100) / 100}">${g}</g>`; }
// a thing landing on the table: it drops the last few inches, overshoots a touch and settles; a soft shadow gathers under it
const t3Land = (t, t0) => { const u = clamp01((t - t0) / 0.55); if (u <= 0) return null; const e = 1 - Math.pow(1 - u, 3), b = Math.sin(Math.PI * u) * (1 - u); return {lift: 16 * (1 - e) + 2.2 * b * 0, op: Math.min(1, u * 4), k: 0.86 + 0.14 * e + 0.08 * Math.sin(Math.PI * u) * (1 - u)}; };
const t3Ring = (cam, cx, cy, z, r, n = 40) => [...Array(n + 1)].map((_, i) => cam.P([cx + Math.cos(i / n * TAU) * r, cy + Math.sin(i / n * TAU) * r, z]));

function renderTgTable3d({t}) {
  const cam = t3Cam(t), TOP = T3.TOP, L = 100, W = 44, s = [];
  // the floor: boards running the length of the room, a pool of lamplight under the table
  { const fl = []; for (let y = -230; y < 230; y += 12) { const k = ((y * 7919) % 13 + 13) % 13 / 13; fl.push({p: [[-330, y, 0], [330, y, 0], [330, y + 11.4, 0], [-330, y + 11.4, 0]], c: shade('#2A1D14', (k - 0.5) * 0.3), flat: true, two: true}); }
    s.push(t3Paint(cam, fl)); const c0 = cam.P([0, 0, 0]);
    s.push(`<ellipse cx="${f1(c0[0])}" cy="${f1(c0[1])}" rx="1100" ry="560" fill="url(#t3pool)"/><polygon points="${pts(t3Ring(cam, 0, 0, 0.2, 1, 4).slice(0, 0))}"/>` +
      `<polygon points="${pts([[-L / 2 - 16, -W / 2 - 22, 0.2], [L / 2 + 16, -W / 2 - 22, 0.2], [L / 2 + 16, W / 2 + 22, 0.2], [-L / 2 - 16, W / 2 + 22, 0.2]].map(cam.P))}" fill="#000" opacity="0.45" filter="url(#soft)"/>`); }
  // chairs: three a side and one at each end; those beyond the table are painted before it, the near ones after everything on it
  const chairs = [], chair = (x, y, ang) => { const c = Math.cos(ang), sn = Math.sin(ang), R = (f) => f.map((fc) => ({...fc, p: fc.p.map(([px, py, pz]) => [x + px * c - py * sn, y + px * sn + py * c, pz])}));
    return R([...t3Box(0, 0, 16.5, 17, 17, 2, '#3A2418'), ...t3Box(0, 7.6, 18.5, 17, 1.8, 22, '#3A2418'), ...t3Box(0, 7.4, 26, 13, 1.2, 12, '#8A2C3A'), ...[[-7, -7], [7, -7], [-7, 7], [7, 7]].flatMap(([lx, ly]) => t3Box(lx, ly, 0, 1.8, 1.8, 16.5, '#2A1810'))]); };
  for (const x of [-32, 0, 32]) { chairs.push([x, -W / 2 - 9, chair(x, -W / 2 - 9, Math.PI)], [x, W / 2 + 9, chair(x, W / 2 + 9, 0)]); }
  chairs.push([-L / 2 - 9, 0, chair(-L / 2 - 9, 0, Math.PI / 2)], [L / 2 + 9, 0, chair(L / 2 + 9, 0, -Math.PI / 2)]);
  const dist = (x, y) => Math.hypot(cam.C[0] - x, cam.C[1] - y), dTable = dist(0, 0), far = chairs.filter(([x, y]) => t3d([x, y, 0], [cam.f[0], cam.f[1], 0]) > 0).sort((a, b) => dist(b[0], b[1]) - dist(a[0], a[1])), near = chairs.filter((ch) => !far.includes(ch)).sort((a, b) => dist(b[0], b[1]) - dist(a[0], a[1]));
  for (const [, , m] of far) s.push(t3Paint(cam, m));
  // the table: a white cloth to within a hand of the floor, its top a shade brighter
  s.push(t3Paint(cam, [...t3Box(0, 0, 7, L, W, TOP - 7, '#D8CFBC'), ...t3Box(0, 0, TOP - 0.2, L + 1.5, W + 1.5, 0.6, '#FBF6EA')]));
  const items = []; // [x, y, svg]: everything on the table, painted far to near
  const put = (x, y, t0, faces, ring = null, sr = 5.4) => { const ld = t3Land(t, t0); if (!ld) return; const sh = t3Ring(cam, x, y, TOP + 0.5, ring ? ring[0] : sr, 24);
    items.push([x, y, `<polygon points="${pts(sh)}" fill="#3A2A1A" opacity="${f1(0.28 * ld.op * (1 - ld.lift / 20))}"/>` + (ring ? (() => { const a = clamp01((t - t0 - 0.3) / 1.6); if (a <= 0 || a >= 1) return ''; const rr = t3Ring(cam, x, y, TOP + 0.6, ring[0] * (1 + 0.9 * a)); return line(rr, '#0D0C09', 7, `opacity="${f1(0.5 * (1 - a))}"`) + line(rr, '#2FE0C4', 4, `opacity="${f1(1 - a)}"`); })() : '') + t3Paint(cam, faces, {...ld, cx: x, cy: y})]); };
  // places: a plate, a glass, a napkin at each chair
  for (const [i, [x, y]] of [[-32, -15], [0, -15], [32, -15], [-32, 15], [0, 15], [32, 15], [-43, 0], [43, 0]].entries()) {
    put(x, y, T3.plates + i * 0.07, [...t3Cyl(x, y, TOP + 0.4, 4.4, 4.4, 0.5, 18, '#D9D2C0', '#FFFFFF', 1.18), ...t3Cyl(x, y, TOP + 0.95, 3.2, 3.2, 0.05, 14, '#E8E2D2', '#EFE9DA')]);
    const gx = x + (Math.abs(x) > 40 ? 0 : 6), gy = y + (Math.abs(x) > 40 ? 7 : -Math.sign(y) * 4.5); put(gx, gy, T3.plates + 0.3 + i * 0.07, [...t3Cyl(gx, gy, TOP + 0.4, 0.9, 0.9, 2.6, 8, '#B9D6D2', '#B9D6D2'), ...t3Cyl(gx, gy, TOP + 3, 1.1, 1.1, 2.4, 10, '#CFE8E4', '#7A2030', 1.5)], null, 1.8); }
  // the sides: a bowl of mash, cranberry sauce, a gravy boat, rolls, a second pie
  const bowl = (x, y, r, cs, cf) => [...t3Cyl(x, y, TOP + 0.4, r * 0.55, r * 0.55, 3, 16, cs, cs, 1.8), ...t3Cyl(x, y, TOP + 3.3, r * 0.9, r * 0.9, 0.3, 16, cf, cf)];
  put(-17, 6, T3.sides[0], [...bowl(-17, 6, 5, '#E9E2CF', '#F4E7B8'), ...t3Ball(-17, 6, TOP + 4.2, 3.6, 3.6, 1.6, '#F6EDC8', 5, 12)]);
  put(-19, -7, T3.sides[1], bowl(-19, -7, 3.8, '#E9E2CF', '#8A1F2E'));
  put(18, -8, T3.sides[2], [...t3Cyl(18, -8, TOP + 0.4, 5, 3.4, 0.5, 16, '#C9C2A8', '#D9D2C0'), ...t3Ball(18, -8, TOP + 2.4, 3.6, 2, 2, '#C9C2A8', 6, 12), ...t3Cyl(18, -8, TOP + 3.6, 2.6, 1.3, 0.2, 12, '#7A4A22', '#7A4A22')]);
  put(17, 8, T3.sides[3], [...t3Cyl(17, 8, TOP + 0.4, 5, 5, 0.6, 16, '#B98A56', '#C9A066', 1.1), ...[[0, 0], [2.6, 1.4], [-2.4, 1.6], [0.4, -2.8], [-2.2, -1.6], [2.4, -1.8]].flatMap(([dx, dy]) => t3Ball(17 + dx, 8 + dy, TOP + 2.2, 1.9, 1.9, 1.5, '#E0B070', 5, 10))]);
  put(-34, 0, T3.sides[4], [...t3Cyl(-34, 0, TOP + 0.4, 2.2, 2.2, 5, 10, '#C9B98A', '#C9B98A', 0.5), ...t3Cyl(-34, 0, TOP + 5.4, 0.7, 0.7, 7, 8, '#F4EFE6', '#FFE9A8')], null, 2.6);
  // the turkey, in the middle (coral: the subject): a platter, the body, two drumsticks
  { const x = 0, y = 0, z = TOP + 1.2; put(x, y, T3.turkey, [...t3Cyl(x, y, TOP + 0.4, 13, 9, 0.8, 28, '#C9C2A8', '#E4DECB', 1.08),
      ...t3Ball(x - 0.5, y, z + 4.6, 9.2, 6.6, 5, '#FF6F61', 9, 20, -0.12), ...t3Ball(x + 6.4, y - 5.4, z + 4.4, 4.6, 2.2, 2.3, '#F2604F', 6, 12, 0.6), ...t3Ball(x + 6.4, y + 5.4, z + 4.4, 4.6, 2.2, 2.3, '#F2604F', 6, 12, 0.6),
      ...t3Ball(x + 10, y - 5.4, z + 7.2, 0.9, 0.9, 0.9, '#F4EFE6', 4, 8), ...t3Ball(x + 10, y + 5.4, z + 7.2, 0.9, 0.9, 0.9, '#F4EFE6', 4, 8), ...t3Ball(x - 8.4, y - 3, z + 1.6, 1.5, 1.5, 1.3, '#6FA85A', 4, 8), ...t3Ball(x - 8.8, y + 2.6, z + 1.5, 1.5, 1.5, 1.3, '#6FA85A', 4, 8)], [14]); }
  // the pumpkin pie, at the end
  { const x = 33, y = 0; put(x, y, T3.pie, [...t3Cyl(x, y, TOP + 0.4, 5.2, 5.2, 1.5, 24, '#C9A066', '#E0B070', 1.3), ...t3Cyl(x, y, TOP + 1.95, 5.6, 5.6, 0.08, 24, '#C96A24', '#D9772F'), ...t3Ball(x, y, TOP + 2.1, 1.3, 1.3, 0.8, '#FBF6EA', 4, 10)], [8.5]); }
  items.sort((a, b) => dist(b[0], b[1]) - dist(a[0], a[1])); for (const it of items) s.push(it[2]);
  for (const [, , m] of near) s.push(t3Paint(cam, m));
  const defs = tgDefsB(t).replace('</defs>', `<radialGradient id="t3pool"><stop offset="0" stop-color="#FFD9A0" stop-opacity="0.34"/><stop offset="0.5" stop-color="#FFD9A0" stop-opacity="0.1"/><stop offset="1" stop-color="#FFD9A0" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="t3dark" cx="0.5" cy="0.52" r="0.7"><stop offset="0.45" stop-color="#0A0706" stop-opacity="0"/><stop offset="1" stop-color="#0A0706" stop-opacity="0.92"/></radialGradient></defs>`);
  return frame(defs, `<rect width="1920" height="1080" fill="#0A0706"/>`, s.join('') + `<rect width="1920" height="1080" fill="url(#t3dark)"/>`, '', t);
}
Object.assign(CLIPS, {tg_table_3d: {sec: T3.sec, render: (t) => renderTgTable3d({t})}});
if (typeof window !== 'undefined') Object.assign(window, {renderTgTable3d});
