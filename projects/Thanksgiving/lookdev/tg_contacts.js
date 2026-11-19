// tg_contacts.js: contact logging for the Thanksgiving drawn scenes (load after ep3.js, before tg.js). It extends the Gilded Age
// contact system (ep3.js E3K / E3LOG: forward kinematics and two-bone IK that match rig.js) with the contacts these scenes need,
// and logs every one each frame so audit_tg_contacts.mjs can measure them:
//
//   foot     a planted sole on its ground line (want: where it was planted; got: the sole rig.js draws)
//   support  a walker's lower contact on the ground (soles, or a skirt's hem and toe): no floating, no sinking
//   sole     every visible sole each frame (not an error by itself: the audit reads these for sliding while planted)
//   hand     a hand on what it holds (want: the grip point on the object; got: the wrist rig.js draws)
//   rest     an object's bottom on the surface it stands on; hang: a hung thing's hook on its rail
//   seat     a seated figure's seat on the chair; wheel: a tyre on the ground; rope: a rope's end on its fitting
//   eel      an eel's belly on the mud; overlap / rest3d / floor3d: the 3D table (in screen px at that frame)
//
// 'move' and 'swing' entries are hands and feet in flight and are not errors (as in the Gilded Age audit).

const TGK = {
  log(kind, name, want, got, extra = {}) { E3K.log(kind, name, want, got, extra); },
  // a local point (height units, +x toward the face, +y up) of a figure in the world
  W: (o, lx, ly) => E3K.toWorld(o, lx, ly),
  skirted: (o) => o.kind === 'woman' && !(o.wear || []).includes('fullskirt'),
  // the points a standing figure touches the ground with: two soles, or a skirt's hem corners and the toe below it
  contacts(o) {
    if (TGK.skirted(o)) { const w = o.wear || [], f = w.includes('plain') ? [0.14, -0.14] : [0.15, -0.17];
      return [TGK.W(o, f[0], 0), TGK.W(o, f[1], 0), TGK.W(o, 0.135, -0.002)]; }
    return [E3K.foot(o, 0), E3K.foot(o, 1)];
  },
  lowest(o) { return Math.max(...TGK.contacts(o).map((p) => p[1])); },
  // move a figure up or down so its lowest contact is exactly on the ground line gy (a walker's support foot, a skirt's hem)
  ground(o, gy) { return {...o, y: o.y + (gy - TGK.lowest(o))}; },
  // log a walker: the support contact on the ground, and the visible soles (for the slide check)
  walker(o, gy, name) {
    const lo = TGK.lowest(o); TGK.log('support', name, [o.x, gy], [o.x, lo]);
    if (!TGK.skirted(o)) [0, 1].forEach((i) => { const p = E3K.foot(o, i); TGK.log('sole', name + '.' + i, [p[0], gy], p, {gy}); });
  },
  // log a standing figure whose feet should both be on the ground (soles; or hem and toe for a skirt)
  stander(o, gy, name, at = null) {
    if (TGK.skirted(o)) { TGK.contacts(o).forEach((p, i) => TGK.log('foot', name + '.' + i, [p[0], gy], p)); return; }
    [0, 1].forEach((i) => { const p = E3K.foot(o, i), w = at ? at[i] : [p[0], gy]; TGK.log('foot', name + '.' + i, w, p); TGK.log('sole', name + '.' + i, [p[0], gy], p, {gy}); });
  },
  // plant both soles on world points (IK on the legs, knees forward) and log them: returns the posed options
  plant(o, feet, name) {
    const o2 = tgLegs(o, feet);
    [0, 1].forEach((i) => { const p = E3K.foot(o2, i); TGK.log('foot', name + '.' + i, feet[i], p); TGK.log('sole', name + '.' + i, [p[0], feet[i][1]], p, {gy: feet[i][1]}); });
    return o2;
  },
  // put a hand on a world point (two-bone IK, rig.js limb lengths) and log the contact
  reach(o, which, wx, wy, name, elbowUp = false, kind = 'hand') {
    const A = E3K.armIK(o, which, wx, wy, elbowUp).map((v) => ((v + 540) % 360) - 180), o2 = {...o, an: {...o.an, [which === 'f' ? 'fArm' : 'bArm']: A}}, g = E3K.hand(o2, which);
    TGK.log(kind, name, [wx, wy], [g.x, g.y]); return o2;
  },
  hand: (o, which = 'f') => { const g = E3K.hand(o, which); return [g.x, g.y]; },
  // a seated figure: where its seat (the underside of the thigh at the hip) is, for the seat check
  seatAt(o) { const {hip} = E3K.dims(o); return TGK.W(o, -0.02, hip - 0.035); },
  rest(name, x, bottomY, surfaceY) { TGK.log('rest', name, [x, surfaceY], [x, bottomY]); },
  // the nearest point on a closed outline (world points) to p: a hand holding something must be on its surface, not inside or off it
  edge(poly, p) { let best = null, bd = 1e9;
    for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length], vx = b[0] - a[0], vy = b[1] - a[1], L = vx * vx + vy * vy || 1;
      const u = Math.max(0, Math.min(1, ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / L)), q = [a[0] + vx * u, a[1] + vy * u], dd = Math.hypot(p[0] - q[0], p[1] - q[1]);
      if (dd < bd) { bd = dd; best = q; } }
    return best; },
  // log a hand against an object's outline (or a polyline when open = true)
  handOn(o, which, poly, name, open = false) { const p = TGK.hand(o, which), q = open ? TGK.edge([...poly, ...poly.slice(1, -1).reverse()], p) : TGK.edge(poly, p); TGK.log('hand', name, q, p); return q; },
  // a shape in units of w about a bottom centre (x, y), +y down, as world points
  shape: (pts, x, y, w, k = 1) => pts.map(([u, v]) => [x + u * w * k, y + v * w]),
};
// legs onto two sole points, as straight as rig.js allows: rig.js draws the sole at max(ankle - 0.03, 0), so for a sole on the
// figure's origin line any ankle height from 0 to 0.03 puts it on the line. E3K.legIK always aims at 0.03, which keeps the knees
// bent; this aims as low as the leg's length needs, so a planted leg straightens. Keep the origin on the ground (bob 0) for it.
function tgLegs(o, feet) {
  const {hip} = E3K.dims(o), an = {...o.an}, legs = [], shins = [];
  [0, 1].forEach((i) => { const T = E3K.toLocal(o, feet[i][0], feet[i][1]), S = [i === 0 ? 0.026 : -0.026, hip], dx = T[0] - S[0], Lr = hip * 0.995;
    // a sole above the figure's origin line needs its ankle exactly 0.03 above it; a sole on the origin line can take any ankle height
    // from 0 to 0.03 (rig.js clamps it), so there the leg goes as straight as it can
    const straightY = S[1] - Math.sqrt(Math.max(0, Lr * Lr - dx * dx)), ay = T[1] > 0.0015 ? T[1] + 0.03 : Math.min(0.03, Math.max(0.0005, straightY));
    const A = E3K.solve2(S, [T[0], ay], hip * 0.52, hip * 0.48, (a, b) => (a[2][0] > b[2][0] ? a : b)); const nz = (v) => ((v + 540) % 360) - 180; legs[i] = nz(180 - A[0]); shins[i] = nz(180 - A[1]); }); // (-180, 180]: rig.js reads a thigh over 60 as seated
  return {...o, an: {...an, legs, shins}};
}
// a solved walk on flat ground (ep3.js stepWalk's footholds, with rig.js walkAn's step length and arm swing): footholds lie one
// step apart; a foot is pinned to its foothold while planted and swings to the foothold after next on a low arc; both legs are
// solved by IK. (rig.js walkAn alone lets the late-swing foot scrape forward along the floor: its ankle is clamped at the ground.)
function tgGait(fo, x0, dir, s, gy, {stride = 18, arm = 14, carry = false, an = {}} = {}) {
  const R = tgStepLen(fo.h, stride), n = s / R, hold = (j) => [x0 + dir * (j + 0.5) * R, gy], feet = [], planted = [];
  for (const f of [0, 1]) { let L = Math.floor(n); if (((L % 2) + 2) % 2 !== f) L -= 1; const u = n - L;
    if (u <= 1) { feet[f] = hold(L); planted[f] = true; }
    else { const v = u - 1, A = hold(L), B = hold(L + 2); feet[f] = [A[0] + (B[0] - A[0]) * ease(v), gy - 0.05 * fo.h * Math.sin(Math.PI * v)]; planted[f] = false; } }
  const w = walkAn(walkPhase(s + R * 0.5, fo.h, stride), {stride, arm, carry}), base = {...fo, x: x0 + dir * s, y: gy, d: dir, an: {...w, ...an, bob: 0, shear: true}};
  return {o: tgLegs(base, feet), feet, planted}; // the origin stays on the ground: a stride of 16 to 18 degrees needs no dip
}
const tgStepLen = (h, stride) => Math.sin(stride * Math.PI / 180) * h;
const tgWalkDist = (dist, h, stride) => Math.max(1, Math.round(dist / tgStepLen(h, stride))) * tgStepLen(h, stride);
// walk dist (a whole number of steps: tgWalkDist) along dir from x0, u 0..1 of the way (eased by the caller), then settle (0..1):
// the back foot steps up beside the front one. Skirted figures (no legs drawn) glide with the hem kept on the ground line.
// Returns {o, feet}: feet are the two sole points once settled, for the caller to keep planted with E3K.legsTo.
function tgWalkSettle(fo, x0, dir, dist, u, settle, gy, name, {stride = 18, arm = 14, carry = false, an = {}, gap = 0.1} = {}) {
  if (TGK.skirted(fo)) { const w = walkAn(walkPhase(dist * u, fo.h, stride), {stride, arm, carry}), moving = u > 0 && u < 1;
    const o = TGK.ground({...fo, x: x0 + dir * dist * u, y: gy, d: dir, an: {...(moving ? w : {}), ...an, bob: 0, shear: true}}, gy); TGK.walker(o, gy, name); return {o, feet: null}; }
  const g = tgGait(fo, x0, dir, dist * Math.min(u, 1), gy, {stride, arm, carry, an});
  if (u < 1 || settle <= 0) { [0, 1].forEach((i) => { const p = E3K.foot(g.o, i); TGK.log(g.planted[i] ? 'foot' : 'swing', name + '.' + i, g.feet[i], p); TGK.log('sole', name + '.' + i, [p[0], gy], p, {gy}); });
    return {o: g.o, feet: g.feet}; }
  const end = g.o, A = g.feet[0], B = g.feet[1], fi = (A[0] - B[0]) * dir >= 0 ? 0 : 1, F0 = fi ? B : A, K0 = fi ? A : B;
  const T = [F0[0] - dir * gap * fo.h, gy], e = ease(settle), P = [lerp(K0[0], T[0], e), gy - 0.05 * fo.h * Math.sin(Math.PI * clamp01(settle))];
  const feet = fi ? [P, F0] : [F0, P], body = {...end, x: lerp(end.x, (F0[0] + T[0]) / 2 + dir * 0.01 * fo.h, e), an: {...end.an, bob: lerp(end.an.bob, -0.004, e)}};
  const o = tgLegs({...body, an: {...body.an, bob: 0}}, feet);
  [0, 1].forEach((i) => { const p = E3K.foot(o, i), moving = i !== fi && settle < 1; TGK.log(moving ? 'swing' : 'foot', name + '.' + i, feet[i], p); TGK.log('sole', name + '.' + i, [p[0], gy], p, {gy}); });
  return {o, feet: fi ? [T, F0] : [F0, T], cur: feet, moving: settle < 1 ? 1 - fi : -1};
}
// sit a figure on a chair seat (world y) with both feet on the floor (ep3.js sitOn, logged here as 'seat' and 'foot')
function tgSit(fo, seatY, floorY, footFwd, name) {
  const o = sitOn(fo, seatY, floorY, footFwd, name); const s = TGK.seatAt(o); TGK.log('seat', name, [s[0], seatY], s); return o;
}
if (typeof window !== 'undefined') window.TGK = TGK;
