// Episode 3, chapters 6 to 9: drawn shots for the edit (load after ep3.js, ep3_map.js, ep3_explain.js). New functions only: the
// clip renderers in ep3.js / ep3_map.js are left as they are; these are variants that take the edit's clocks (narration time),
// cameras and acting, and draw no clip text (the edit sets its own). Same rules as ep3.js: the Rabinowitzes wheat gold (E3.acc),
// the Kellys coral, everyone else ink; teal explains; contacts through E3K (logged to E3LOG).

/* ================= ch 6: Hester Street, Rivke's first morning (variant of renderE3Hester) ================= */
// Narration time T (ch06 words). Yankel walks from T0; Rivke follows; she stops at the goat (goatT), the father stops and turns
// back for her, she hurries to him, and they walk on. The market's life (vendors, shoppers, coats on the pole) runs on T.
const LH = {T0: 3.0, v: 80, goatT: 18.2, yStop: 19.6, yTurn: 20.1, yBack: 22.4, rGo: 21.4, rStop: 22.3, walkOn: 22.9};
LH.rX0 = 330; LH.yX0 = 420;
LH.rGoat = LH.rX0 + LH.v * (LH.goatT - LH.T0);            // where Rivke stops (at the goat)
LH.goatX = LH.rGoat + 50;
LH.yHalt = LH.yX0 + LH.v * (LH.yStop - LH.T0);             // where Yankel stops and waits
LH.rHalt = LH.yHalt - 88;                                  // Rivke catches up a step behind him
// the camera's centre moves at the walking speed, slows to a stop while Yankel waits, and picks up again (velocity is continuous)
function lhCamX(T) {
  const vel = (t) => LH.v * (1 - smooth(18.8, 20.2, t) + smooth(22.4, 23.3, t));
  let x = LH.yX0 - 40, t = LH.T0; const dt = 0.02;
  while (t < T - 1e-9) { const h = Math.min(dt, T - t); x += vel(t + h / 2) * h; t += h; }
  return x;
}
const lhCam = (T) => cam2({z: 2.15, ux: lhCamX(Math.max(T, LH.T0)), uy: 812});
// the things the narration lists, placed so each is in view when it is named: [kind, x, label T]
const LH_BARRELS = [['herring', 1150, 9.9], ['pickles', 1262, 11.3], ['herring', 520], ['pickles', 2060]];
const LH_LOADS = ['pots', 'fruit', 'coats', 'cloth', 'fruit', 'cloth', 'pots', 'coats', 'fruit', 'cloth', 'coats', 'pots', 'fruit', 'cloth', 'coats', 'pots'];
function renderHesterB(T, o = {}) {
  const G = HS.G, M = HS.M, tt = T; // life clock = narration time
  const c = lhCam(T), lod = lodFor(M * c.z), rim = {c: '#FFF3D6', a: 0.6, dx: -0.01, dy: -0.004}, scr = [];
  const s = [hsStreet(tt)], back = [], mid = [], front = [];
  LH_LOADS.forEach((ld, k) => {
    const cx = 120 + k * 180, cr = hsCart(cx, HS.cartY, ld, tt, 180 + k), rv = rng(190 + k);
    let vo = e3PersonOpts(rv, cr.top[0] + 60, HS.cartY - 14, M, tt, '#0D0C09', {d: rv() < 0.5 ? 1 : -1});
    vo = {...vo, an: {...vo.an, lean: 0, bob: 0, tilt: 5 * Math.sin(tt * 0.8 + k)}};
    if (vo.kind === 'man' || vo.kind === 'woman') vo = reach(vo, 'f', vo.x + vo.d * 0.06 * vo.h, cr.top[2] - 1, 'lh.vendor' + k);
    back.push(fig({...vo, floorY: HS.cartY - 14}));
    mid.push(cr.svg);
    for (let j = 0; j < (k % 2) + 1; j++) { const r2 = rng(300 + k * 7 + j); let so = e3PersonOpts(r2, cx + 70 + j * 60, HS.cartY + 20, M, tt, '#0D0C09', {d: -1});
      const g = Math.max(0, Math.sin(tt * 2.2 + k + j * 2)); so = {...so, d: k % 4 === 0 && j === 1 ? 1 : -1, an: {...so.an, fArm: [100 - 40 * g, 80 - 50 * g], tilt: 6 * g}};
      front.push(fig({...so, floorY: HS.cartY + 20})); }
  });
  for (const [kind, x] of LH_BARRELS) front.push(MAT.shadow(x, HS.cartY + 24, 26, 0.35) + hsBarrel(x, HS.cartY + 22, kind));
  // the goat and the boy holding her rope
  const gx = LH.goatX, goatY = HS.cartY + 30;
  let boy = e3PersonOpts(rng(199), gx - 70, goatY, M, tt, '#0D0C09', {d: 1}); boy = {...boy, kind: 'boy', hat: 'boycap', h: M * 0.62, d: 1, an: {...boy.an, fArm: [150, 130]}};
  front.push(hsGoat(gx, goatY, tt) + fig({...boy, floorY: goatY}) + holding(boy, 'f', 'lh.goat.rope', (hx, hy) => `<path d="M${f1(hx)},${f1(hy)} Q${f1((hx + gx + 36) / 2)},${f1(hy + 26)} ${gx + 36},${goatY - 38}" stroke="#5F574A" stroke-width="2" fill="none"/>`));
  // Yankel: walks, stops and settles, turns back to look for her, turns again and walks on
  const yo = (an = {}) => nbOpts('nfather', {x: LH.yX0, y: G, h: M, d: 1, hat: 'cap', coat: 'frock', det: lod.det, rim, an: {tilt: 0, blink: (T + 0.7) % 3.9 < 0.12, ...an}});
  let yk;
  if (T < LH.yStop) yk = stepWalk(yo({tilt: 3 * Math.sin(T * 0.8)}), LH.yX0, 1, LH.v * Math.max(0, T - LH.T0), () => G, 'lh.yankel');
  else if (T < LH.walkOn) {
    const turned = T > LH.yTurn && T < LH.yBack, base = {...yo({...POSES.stand(T, 0.2), tilt: turned ? 6 + 3 * Math.sin(T * 1.7) : 2}), y: G, floorY: G, d: turned ? -1 : 1};
    yk = T < LH.yTurn ? e3Settle(stepWalk(yo(), LH.yX0, 1, LH.yHalt - LH.yX0, () => G, 'lh.yankel'), smooth(LH.yStop, LH.yStop + 0.4, T), 'lh.yankel') : e3Stand(base, LH.yHalt, LH.yHalt, 0, 'lh.yankel.stand');
    if (turned && T > LH.rGo - 0.3 && T < LH.rStop) { // a beckon: the hand comes up in front of him and waves her on
      const u = smooth(LH.rGo - 0.3, LH.rGo + 0.1, T) * (1 - smooth(LH.rStop - 0.3, LH.rStop, T)), k = Math.sin((T - LH.rGo) * 8);
      const h0 = E3K.hand(yk, 'f'), P = [yk.x + yk.d * (0.14 + 0.03 * k) * yk.h, yk.y - 0.6 * yk.h];
      yk = e3Move(yk, 'f', lerp(h0.x, P[0], u), lerp(h0.y, P[1], u), 'lh.yankel.beckon', true); }
  } else yk = stepWalk(yo(), LH.yHalt, 1, LH.v * (T - LH.walkOn), () => G, 'lh.yankel.on');
  // Rivke: follows, stops at the goat (feet settle), smiles; hurries after him; walks on beside him
  const ro = (an = {}) => nbOpts('ndaughter', {x: LH.rX0, y: G, h: M, scale: 0.8, d: 1, hat: 'kerchief', wear: ['plain', 'shawl'], det: lod.det, rim, an: {blink: (T + 1.9) % 4.3 < 0.12, ...an}});
  let rv;
  if (T < LH.goatT) rv = stepWalk(ro({tilt: 8 * Math.sin(T * 0.9), expr: 'awe'}), LH.rX0, 1, LH.v * Math.max(0, T - LH.T0), () => G, 'lh.rivke');
  else if (T < LH.rGo) rv = e3Settle(stepWalk(ro({tilt: -12 + 3 * Math.sin(T * 1.3), expr: T > 19.0 ? 'smile' : 'awe'}), LH.rX0, 1, LH.rGoat - LH.rX0, () => G, 'lh.rivke'), smooth(LH.goatT, LH.goatT + 0.35, T), 'lh.rivke');
  else if (T < LH.rStop) rv = stepWalk(ro({tilt: 4, expr: 'smile'}), LH.rGoat, 1, (LH.rHalt - LH.rGoat) * e3Trap(T, LH.rGo, LH.rStop, 0.15), () => G, 'lh.rivke.hurry');
  else if (T < LH.walkOn) rv = e3Settle(stepWalk(ro({tilt: 10, expr: 'smile'}), LH.rGoat, 1, LH.rHalt - LH.rGoat, () => G, 'lh.rivke.hurry'), smooth(LH.rStop, LH.rStop + 0.3, T), 'lh.rivke');
  else rv = stepWalk(ro({tilt: 6 * Math.sin(T), expr: 'smile'}), LH.rHalt, 1, LH.v * (T - LH.walkOn), () => G, 'lh.rivke.on');
  const world = layerAt(c, 0.25, `<rect x="-3000" y="-2000" width="9000" height="3000" fill="url(#e3day)"/>`) + layerAt(c, 1, s.join('') + back.join('') + mid.join('') + front.join('') + fig(yk) + fig(rv));
  // the listed things, labelled in pen as they are named (anchored to the thing, so the label rides with it)
  const notes = [['herring', 1150, HS.cartY - 40, 9.9, 470], ['pickles', 1262, HS.cartY - 40, 11.3, 560], ['pots', 1306, HS.cartY - 100, 12.2, 430], ['used coats', 1486, HS.cartY - 190, 13.1, 520]];
  for (const [txt, wx, wy, t0, sy] of notes) { if (T < t0 || T > t0 + 3.2) continue; const x = c.sx(wx), y = c.sy(wy), o = smooth(t0, t0 + 0.25, T) * (1 - smooth(t0 + 2.9, t0 + 3.2, T));
    scr.push(`<g opacity="${f1(o * 100) / 100}">${line([[x, sy + 14], [x, y - 8]], '#111', 5)}${line([[x, sy + 14], [x, y - 8]], EX.orange, 2.5)}${penS(x - 50, sy, txt, 30, -3)}</g>`); }
  return frame(e3Defs2(T), `<rect width="1920" height="1080" fill="#0B1414"/>`, world, scr.join(''), T);
}

/* ================= ch 6: the room at night, and Monday's dawn (hsRoom from ep3.js, the edit's camera and light) ================= */
function renderRoomB(T, {dawn = 0, z = 0.94, ux = 640, uy = 640} = {}) {
  const c = cam2({z, ux, uy}), d = clamp01(dawn);
  let w = hsRoom(T);
  if (d > 0) w += `<rect x="1122" y="342" width="146" height="236" fill="#FFE2B0" opacity="${f1(0.55 * d * 100) / 100}"/>` +
    `<path d="M1122,590 L960,1050 L1520,1050 L1268,590 Z" fill="#FFE2B0" opacity="${f1(0.13 * d * 100) / 100}"/>` + glowC(1195, 460, 420, 0.5 * d, 'mswarm');
  const grade = d > 0 ? `<rect width="1920" height="1080" fill="#FFD9A0" opacity="${f1(0.09 * d * 100) / 100}" style="mix-blend-mode:overlay"/>` : '';
  return frame(e3Defs2(T), `<rect width="1920" height="1080" fill="#0B1414"/>`, layerAt(c, 1, w) + grade, '', T);
}

/* ================= model shots: the 3D neighbourhood (ep3_map.js) with the edit's camera keys and tags ================= */
// spec: {keys: emCamera keys [n, tx, ty, tz, yaw, pitch, D, ox, oy], S: emWorld state, labels: [{lines, at: [x,y,z] | lot key,
// off, a, b}], fixed: [{x, y, txt, a, b, teal}], ring: {lot, a, b}}
function renderModelShot(n, spec) {
  const cam = emCamera(n, spec.keys), world = emWorld(n, cam, spec.S ? spec.S(n) : {});
  if (spec.extra) world.push(spec.extra(n, cam));
  const scr = [], fixed = [];
  for (const f of spec.fixed || []) emFixed(scr, fixed, f.x, f.y, f.txt, emOn(n, f.a, f.b), f.teal);
  const lab = (spec.labels || []).map((L) => ({lines: L.lines, a: emP(cam, typeof L.at === 'string' ? emTopC(L.at) : L.at), off: L.off, op: emOn(n, L.a, L.b)})).filter((L) => L.a && L.op > 0.01);
  scr.unshift(emLabels(lab, fixed));
  return emFrame(n, world, scr);
}


/* ================= ch 7: the front room as a workshop (variant of renderSweatshop) ================= */
// The edit's camera (o.cam), no contractor (he arrives in the map shot before), and Sore as the script has her: sewing buttons and
// finishing hems by hand at the window, counting the finished pieces onto a pile (o.counts: the times of her three counts).
function renderSweatshopB(T, o = {}) {
  const t = T;
  const c = cam2(o.cam || {z: 1.24, ux: 960, uy: 632}), {F, H, x0, x1, wallFoot, ceil} = RM, s = [];
  const lod = lodFor(H * 0.8 * c.z), rim = {c: '#E9F0E6', a: lod.rimA * 0.6, dx: 0.01, dy: -0.004}, room = e3Room({door: true, seed: 91});
  s.push(room.back);
  // the window to the street on the back wall: the tenement opposite, grey daylight falling in
  const wx = 990, wy = 330, ww = 190, wh = 300;
  s.push(`<rect x="${wx - 12}" y="${wy - 12}" width="${ww + 24}" height="${wh + 24}" fill="#0D0C09"/>` + MAT.brick(wx, wy, ww, wh, {base: '#5F857F', seed: 92, soot: 'none', bw: 22, bh: 11, vary: 0.2}) +
    `<rect x="${wx + 30}" y="${wy + 90}" width="50" height="80" fill="#2B4744"/><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="#DFE0D6" opacity="0.28"/><rect x="${wx + ww / 2 - 4}" y="${wy}" width="8" height="${wh}" fill="#0D0C09"/><rect x="${wx}" y="${wy + wh / 2 - 4}" width="${ww}" height="8" fill="#0D0C09"/><rect x="${wx - 24}" y="${wy + wh}" width="${ww + 48}" height="14" fill="#0D0C09"/>`);
  s.push(`<path d="M${wx},${wy + wh + 14} L${wx - 200},${F + 70} L${wx + ww + 200},${F + 70} L${wx + ww},${wy + wh + 14} Z" fill="#DFE0D6" opacity="0.07"/>`);
  // a line of finished coats strung right under the ceiling: no headroom
  s.push(line([[x0, ceil + 70], [x1, ceil + 80]], '#0D0C09', 2) + [0, 1, 2, 3, 4, 5].map((k) => { const x = x0 + 90 + k * 150, sw = 2 * Math.sin(t * 1.1 + k); return `<path d="M${x},${ceil + 72 + k * 1.6} l90,0 l${8 + sw},150 l-106,0 Z" fill="#2B4744"/><path d="M${x + 14},${ceil + 72 + k * 1.6} l30,40 l30,-40" stroke="#0D0C09" stroke-width="4" fill="none"/>`; }).join(''));
  // the stove against the back wall, irons heating on it, the pipe up through the ceiling
  s.push(`<rect x="480" y="${wallFoot - 210}" width="150" height="190" fill="#0D0C09"/><rect x="472" y="${wallFoot - 220}" width="166" height="14" fill="#0D0C09"/><rect x="590" y="${ceil}" width="28" height="${wallFoot - 220 - ceil}" fill="#0D0C09"/><rect x="500" y="${wallFoot - 150}" width="60" height="44" fill="#FFB15C" opacity="${f1(0.35 + 0.2 * Math.sin(t * 8))}"/>` + glowC(530, wallFoot - 130, 220, 0.42, 'e3fire'));
  for (const k of [0, 1]) s.push(`<path d="M${488 + k * 62},${wallFoot - 220} l10,-28 l40,0 l10,28 Z" fill="#0D0C09"/><path d="M${504 + k * 62},${wallFoot - 248} q16,-18 32,0" stroke="#0D0C09" stroke-width="6" fill="none"/>`);
  // the bed against the back wall on the right, heaped with cut cloth and finished coats
  s.push(`<rect x="1170" y="${wallFoot - 120}" width="300" height="26" fill="#0D0C09"/><rect x="1170" y="${wallFoot - 260}" width="14" height="260" fill="#0D0C09"/>` + coatPile(1190, wallFoot - 120, 10, 95, '#2B4744') + coatPile(1280, wallFoot - 150, 7, 96, '#4E726C'));
  // the pressing board and the father, pressing (steam on each stroke)
  const strokeP = Math.sin(t * TAU * 0.6), ironX = 592 + 38 * strokeP, by = F - 250;
  s.push(`<path d="M466,${by} l180,0 l-12,-18 l-160,0 Z" fill="#5F857F"/><rect x="466" y="${by}" width="180" height="14" fill="#2B2418"/><rect x="482" y="${by + 14}" width="12" height="${F - by - 14}" fill="#0D0C09"/><rect x="618" y="${by + 14}" width="12" height="${F - by - 14}" fill="#0D0C09"/>` + MAT.shadow(556, F + 2, 100, 0.35));
  // the iron: sole flat on the board (the board's top face runs from by - 18 at the back to by at the front), handle on top
  const sole = by - 7;
  let pf = nbOpts('nfather', {x: 740, y: F, h: H, d: -1, hat: 'kippah', coat: 'vest', det: lod.det, rim, an: {tilt: -14, lean: 9}});
  pf = reach(pf, 'f', ironX, sole - 50, 'presser.iron');           // fist on the handle, the arm solved to follow the iron
  pf = reach(pf, 'b', 640, by - 9, 'presser.lefthand');            // the other hand steadies the cloth at the board's end
  s.push(fig(pf));
  s.push(`<path d="M${f1(ironX - 52)},${sole} l96,0 l12,-8 l-22,-24 l-76,0 Z" fill="#0D0C09"/><path d="M${f1(ironX - 30)},${sole - 32} q30,-26 60,0" stroke="#0D0C09" stroke-width="8" fill="none"/>` + MAT.shadow(ironX - 4, sole + 1, 54, 0.3));
  E3K.log('hold', 'presser.iron.handle', [ironX, sole - 50], [E3K.hand(pf, 'f').x, E3K.hand(pf, 'f').y]);
  s.push(MAT.smoke(ironX - 10, by - 30, t, {col: 'DFE0D6', k: 0.5, n: 4, rise: 140, drift: 40, speed: 1.6, seed: 93}));
  // two treadle machines nearly touching: the daughter at the first, the mother at the second
  for (const [mx, who] of [[990, 'daughter']]) {
    s.push(MAT.shadow(mx + 20, F - 6, 150, 0.35) + scaled(mx, F - 8, 1.25, treadle(mx, F - 8, t + mx, 1)));
    const ox = mx - (who === 'daughter' ? 150 : 170), hh = who === 'daughter' ? H * 0.8 : H * 0.88;
    s.push(`<rect x="${ox - 50}" y="${F - 128}" width="90" height="12" fill="#0D0C09"/><rect x="${ox - 44}" y="${F - 116}" width="10" height="116" fill="#0D0C09"/><rect x="${ox + 24}" y="${F - 116}" width="10" height="116" fill="#0D0C09"/>` + MAT.shadow(ox, F + 2, 70, 0.3));
    // seated on the stool (top at F - 128); both feet on the treadle plate, which rocks with the wheel; hands on the cloth at the needle
    const a = (t + mx) * 9, plate = F - 8 - 1.25 * (26 + 8 * Math.sin(a)), feed = 6 * Math.sin(t * 5 + mx);
    let op = who === 'daughter' ? nbOpts('ndaughter', {x: ox, y: 0, h: H, scale: 0.8, d: 1, hat: 'none', wear: ['plain', 'apron'], det: lod.det, rim, an: {tilt: -14 + 3 * Math.sin(t * 0.7), expr: 'set', blink: t % 3.1 < 0.12}})
      : nbOpts('nmother', {x: ox, y: 0, h: H, d: 1, det: lod.det, rim, an: {tilt: -12}});
    op = {...op, y: F - 128 + (0.5 - 0.035) * op.h, an: {...POSES.sit(t), ...op.an, lean: 0, bob: 0}};
    op = plant(op, [[mx - 30, plate], [mx - 46, plate]], who + '.treadle');
    op = reach(op, 'f', mx - 78 + feed, F - 8 - 1.25 * 132, who + '.hand.f');
    op = reach(op, 'b', mx - 108 + feed, F - 8 - 1.25 * 130, who + '.hand.b');
    s.push(figure(op));
  }
  // Sore (the edit's change): on a chair by the window, sewing buttons and finishing hems by hand, facing the light; a pile of
  // finished pieces on a crate beside her. On each count (o.counts, the words "Fourteen", "Fifteen", "Sixteen") she lays one more
  // piece on the pile: the hand travels from her lap to the pile top (e3Move), touches it (reach) and comes back.
  const sx = 1330, seat = F - 128, crX = 1196, crTop = F - 172, counts = o.counts || [], done = counts.filter((q) => t >= q).length;
  s.push(MAT.shadow(sx, F + 2, 80, 0.32) + `<rect x="${sx - 52}" y="${seat}" width="96" height="12" fill="#0D0C09"/><rect x="${sx - 46}" y="${seat + 12}" width="10" height="${F - seat - 12}" fill="#0D0C09"/><rect x="${sx + 30}" y="${seat + 12}" width="10" height="${F - seat - 12}" fill="#0D0C09"/><rect x="${sx + 34}" y="${seat - 210}" width="10" height="210" fill="#0D0C09"/>`);
  s.push(MAT.shadow(crX + 30, F + 2, 70, 0.32) + `<rect x="${crX - 10}" y="${crTop}" width="80" height="${F - crTop}" fill="#2B2418"/><rect x="${crX - 10}" y="${crTop}" width="80" height="5" fill="#5F574A"/><path d="M${crX - 10},${crTop + 20} L${crX + 70},${F - 20} M${crX + 70},${crTop + 20} L${crX - 10},${F - 20}" stroke="#1A1410" stroke-width="5"/>`);
  const folded = (x, y, k) => `<path d="M${f1(x - 30)},${f1(y)} l60,0 l-3,-9 l-54,0 Z" fill="${['#DFE0D6', '#C9CFC6', '#E9E6DA'][k % 3]}"/><line x1="${f1(x - 26)}" y1="${f1(y - 4)}" x2="${f1(x + 26)}" y2="${f1(y - 4)}" stroke="#7E8F86" stroke-width="1.2"/>`;
  for (let k = 0; k < 5 + done; k++) s.push(folded(crX + 30 + ((k * 7) % 5) - 2, crTop - k * 9, k));
  let so = nbOpts('nmother', {x: sx, y: 0, h: H, d: -1, det: lod.det, rim, an: {...POSES.handsew(t, 0.3), tilt: -12, expr: 'set', blink: (t + 0.4) % 3.6 < 0.12}});
  so = sitOn(so, seat, F, 0.2, 'sore.seat');
  for (const q of counts) {
    if (t < q - 0.4 || t > q + 0.7) continue;
    const P = [crX + 34, crTop - (5 + counts.filter((x) => x < q).length) * 9 - 2], lap = E3K.hand(so, 'f');
    so = {...so, an: {...so.an, tilt: -18}};
    if (t < q) { so = e3Move(so, 'f', lerp(lap.x, P[0], ease(smooth(q - 0.4, q, t))), lerp(lap.y, P[1] - 14, ease(smooth(q - 0.4, q, t))), 'sore.toPile'); s.push(holding(so, 'f', 'sore.piece', (gx, gy) => folded(gx, gy + 6, 2))); }
    else if (t < q + 0.25) so = reach(so, 'f', P[0], P[1], 'sore.onPile');
    else so = e3Move(so, 'f', lerp(P[0], lap.x, ease(smooth(q + 0.25, q + 0.7, t))), lerp(P[1], lap.y, ease(smooth(q + 0.25, q + 0.7, t))), 'sore.fromPile');
  }
  s.push(figure(so));
  if (t < (counts[0] ?? 1e9) - 0.4 || t > (counts[counts.length - 1] ?? -1) + 0.7) { const g = E3K.hand(so, 'f'); s.push(`<line x1="${f1(g.x)}" y1="${f1(g.y)}" x2="${f1(g.x - 18)}" y2="${f1(g.y - 22 - 10 * Math.sin(t * TAU * 0.6))}" stroke="${E3.cream}" stroke-width="1.5" opacity="0.8"/>`); } // the thread

  // cut cloth piles up by the door; the boy pulls basting threads on the floor in front
  const drop = 1;
  s.push(coatPile(560, F + 50, 6 + Math.round(5 * drop), 94, '#4E726C') + MAT.shadow(650, F + 52, 120, 0.4));
  // the boy sits ON the floor (was hovering a hip's height above it), legs out in front, pulling threads from the coat in his lap
  let boy = nbOpts('nson', {x: 1010, y: 0, h: H, scale: 0.5, d: 1, det: lod.det, rim, an: {...POSES.handsew(t, 0.2)}});
  boy = {...boy, y: F + 44 + (0.46 - 0.04) * boy.h, an: {...boy.an, lean: 0, bob: 0}};
  boy = plant(boy, [[1010 + 0.44 * boy.h, F + 44], [1010 + 0.4 * boy.h, F + 44]], 'boy');
  s.push(MAT.shadow(1010 + 0.2 * boy.h, F + 46, 0.4 * boy.h, 0.35) + figure(boy) + coatPile(1110, F + 62, 4, 97, '#2B4744'));
  s.push(room.front);
  const world = layerAt(c, 1, s.join(''));
  const scr = [];
  return frame(e3Defs2(t), `<rect width="1920" height="1080" fill="#060A0A"/>`, world, scr.join(''), t);
}


/* ================= ch 7: the jar for a cousin's ticket (an insert) ================= */
// A close view of the shelf by the stove at evening: a glass jar with a paper label in (unreadable) Yiddish script, a few coins in
// it; Sore's hand (gold) comes in from the right and drops one more coin at each time in o.drops. The lamp's light flickers.
function renderJarB(T, o = {}) {
  const t = T, drops = o.drops || [], z = o.z || 1, fl = 0.86 + 0.08 * Math.sin(t * 7.3) + 0.05 * Math.sin(t * 16.1), s = [];
  s.push(`<rect width="1920" height="1080" fill="#1F3532"/><rect width="1920" height="1080" fill="url(#flwp)" opacity="0.12"/>` + glowC(560, 360, 900, 0.7 * fl, 'mswarm') + glowC(560, 360, 220, 0.4 * fl));
  // the shelf (a plank on two brackets), a pot and a cup beside the jar
  const sy = 720;
  s.push(MAT.shadow(960, sy + 4, 520, 0.3) + `<rect x="300" y="${sy}" width="1320" height="26" fill="#2B2418"/><rect x="300" y="${sy}" width="1320" height="5" fill="#5F574A"/><path d="M420,${sy + 26} l0,120 l-60,0 Z M1500,${sy + 26} l0,120 l60,0 Z" fill="#1A1410"/>`);
  s.push(`<path d="M520,${sy} l14,-110 l150,0 l14,110 Z" fill="#0D0C09"/><rect x="510" y="${sy - 122}" width="198" height="14" fill="#0D0C09"/><path d="M1290,${sy} l0,-70 q50,-10 100,0 l0,70 Z" fill="#0D0C09"/><path d="M1390,${sy - 56} q36,6 0,40" stroke="#0D0C09" stroke-width="10" fill="none"/>`);
  // the jar: glass (a pale outline, a sheen), coins piled inside, a paper label tied round its neck
  const jx = 960, jw = 220, jh = 300, jt = sy - jh, inJar = 9 + drops.filter((q) => t >= q + 0.42).length;
  for (let k = 0; k < inJar; k++) { const r = rng(400 + k), cx = jx - 70 + r() * 140, cy = sy - 16 - Math.floor(k / 4) * 13 - r() * 4; s.push(`<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="24" ry="8" fill="${r() < 0.6 ? '#C9A55A' : '#8A8A80'}" stroke="#3B3328" stroke-width="2"/>`); }
  for (const q of drops) if (t >= q && t < q + 0.42) { const hy = jt - 100, y0 = hy + 40, fall = (t - q) / 0.42, cy = y0 + (sy - 30 - y0) * fall * fall; // the coin falls inside the glass
    s.push(`<ellipse cx="${jx}" cy="${f1(cy)}" rx="${f1(22 - 13 * (1 - fall))}" ry="${f1(8 + 14 * (1 - fall))}" fill="#C9A55A" stroke="#3B3328" stroke-width="2"/>`); }
  s.push(`<path d="M${jx - jw / 2},${sy} l0,${-jh + 40} q0,-30 30,-34 l0,-24 l${jw - 60},0 l0,24 q30,4 30,34 l0,${jh - 40} Z" fill="#A3BAB2" fill-opacity="0.12" stroke="#DFE0D6" stroke-opacity="0.6" stroke-width="4"/>` +
    `<rect x="${jx - jw / 2 + 18}" y="${jt + 60}" width="16" height="${jh - 90}" rx="8" fill="#F4EFE6" opacity="0.18"/><rect x="${jx - 76}" y="${jt - 34}" width="152" height="22" rx="4" fill="#4E5F58"/>`);
  s.push(`<g transform="rotate(-3 ${jx} ${jt + 120})"><rect x="${jx - 90}" y="${jt + 80}" width="180" height="96" fill="${E3.paper}"/>${e3Script(jx - 76, jt + 110, 152, 2, 1, 431)}</g>` + line([[jx - 76, jt - 12], [jx - 60, jt + 80]], '#5F574A', 2) + line([[jx + 76, jt - 12], [jx + 60, jt + 80]], '#5F574A', 2));
  // Sore's hand: in from the right edge, the coin between finger and thumb, over the jar's mouth, lets go, out again
  for (const q of drops) {
    if (t < q - 0.9 || t > q + 1.0) continue;
    const u = t < q ? ease(smooth(q - 0.9, q - 0.1, t)) : 1 - ease(smooth(q + 0.25, q + 1.0, t)), hx = lerp(2150, jx + 30, u), hy = lerp(jt - 170, jt - 100, u);
    s.push(`<path d="M${f1(hx + 18)},${f1(hy - 26)} L2400,${f1(hy - 120)} L2400,${f1(hy + 70)} L${f1(hx + 22)},${f1(hy + 22)} Z" fill="${E3.acc}"/>` + // the forearm
      `<path d="M${f1(hx + 200)},${f1(hy - 52)} L2400,${f1(hy - 130)} L2400,${f1(hy + 80)} L${f1(hx + 206)},${f1(hy + 40)} Z" fill="${E3.accTone}"/>` + // her sleeve
      `<ellipse cx="${f1(hx)}" cy="${f1(hy)}" rx="38" ry="26" fill="${E3.acc}"/><path d="M${f1(hx - 22)},${f1(hy + 10)} q-16,16 -8,34 l16,-2 q0,-14 10,-22 Z M${f1(hx - 2)},${f1(hy + 16)} q-4,18 4,30 l12,-6 q-4,-12 2,-24 Z" fill="${E3.acc}"/>` +
      `<path d="M${f1(hx - 30)},${f1(hy - 6)} q10,-8 26,-6" stroke="${E3.accTone}" stroke-width="3" fill="none"/>`);
    const fall = clamp01((t - q) / 0.42), y0 = hy + 40, cy = t < q ? y0 : y0 + (sy - 30 - y0) * fall * fall;
    if (t < q) s.push(`<ellipse cx="${f1(t < q ? hx - 30 : jx)}" cy="${f1(cy)}" rx="${t < q ? 9 : 22 - 13 * (1 - fall)}" ry="${t < q ? 22 : 8 + 14 * (1 - fall)}" fill="#C9A55A" stroke="#3B3328" stroke-width="2"/>`);
  }
  const c = cam2({z, ux: o.ux || 960, uy: o.uy || 560});
  return frame(e3Defs2(T), `<rect width="1920" height="1080" fill="#0B1414"/>`, layerAt(c, 1, s.join('')), '', T);
}


/* ================= ch 8: the country, coast to coast (a simple map on the explainer board) ================= */
// A hand-simplified outline of the United States (about 60 points, lon/lat), California shaded; New York and San Francisco
// marked; a teal arc across the country ("the other side of the country"), then the camera settles on California.
const US_OUT = [[-124.7, 48.4], [-124.0, 46.3], [-124.1, 43.0], [-124.2, 40.4], [-122.4, 37.8], [-120.6, 34.6], [-117.1, 32.5], [-114.7, 32.7], [-111.0, 31.3],
  [-108.2, 31.3], [-106.5, 31.8], [-104.5, 29.6], [-103.0, 29.0], [-101.4, 29.8], [-99.5, 27.5], [-97.2, 25.9], [-97.4, 27.8], [-94.8, 29.3], [-93.8, 29.7],
  [-90.0, 29.1], [-89.2, 30.3], [-88.0, 30.6], [-85.4, 29.7], [-84.0, 30.0], [-82.7, 27.7], [-81.7, 25.9], [-80.4, 25.2], [-80.0, 26.7], [-80.6, 28.4],
  [-81.4, 30.7], [-80.9, 32.0], [-79.0, 33.6], [-76.5, 34.7], [-75.5, 35.6], [-76.0, 37.0], [-75.2, 38.5], [-74.0, 39.7], [-74.0, 40.6], [-72.0, 41.1],
  [-70.0, 41.7], [-70.6, 42.6], [-70.2, 43.7], [-67.0, 44.8], [-67.8, 47.1], [-69.2, 47.4], [-71.5, 45.0], [-74.7, 45.0], [-76.5, 44.2], [-79.0, 43.3],
  [-83.0, 42.0], [-82.4, 45.3], [-84.6, 46.5], [-89.6, 48.0], [-95.2, 49.0], [-123.0, 49.0]];
const US_CA = [[-124.2, 42.0], [-120.0, 42.0], [-120.0, 39.0], [-114.6, 35.0], [-114.7, 32.7], [-117.1, 32.5], [-120.6, 34.6], [-122.4, 37.8], [-124.2, 40.4]];
const usP = ([lon, lat]) => [960 + (lon + 96) * 27.5, 540 - (lat - 38.5) * 34];
function renderUSMap(T, o = {}) {
  const k = o.zoom ?? 0, z = 1 + 1.15 * ease(k), [cx, cy] = usP([-119.5, 37.5]), ux = 960 + (cx - 960) * ease(k), uy = 540 + (cy - 540) * ease(k);
  const P = (p) => { const [x, y] = usP(p); return [960 + (x - ux) * z, 540 + (y - uy) * z]; };
  const s = [xpBoard(7)], scr = [], dr = o.draw ?? 1;
  s.push(`<polygon points="${pts(US_OUT.map(P))}" fill="#16302C" stroke="${XP.pale}" stroke-width="3" stroke-opacity="0.8"/>`);
  const ca = o.ca ?? 0; if (ca > 0) s.push(`<polygon points="${pts(US_CA.map(P))}" fill="${XP.mute2}" opacity="${f1(ca * 100) / 100}" stroke="${XP.cream}" stroke-width="3"/>`);
  const ny = P([-74.0, 40.7]), sf = P([-122.4, 37.8]);
  const arc = []; for (let i = 0; i <= 40; i++) { const u = i / 40; arc.push([lerp(ny[0], sf[0], u), lerp(ny[1], sf[1], u) - Math.sin(Math.PI * u) * 170 * z]); }
  if ((o.arc ?? 0) > 0) s.push(drawOn(arc, o.arc, 6));
  s.push(`<circle cx="${f1(ny[0])}" cy="${f1(ny[1])}" r="13" fill="${E3.acc}" stroke="#111" stroke-width="3"/><circle cx="${f1(sf[0])}" cy="${f1(sf[1])}" r="11" fill="${XP.cream}" stroke="#111" stroke-width="3"/>`);
  if (k < 0.5) scr.push(tag(ny[0] - 120, ny[1] + 60, 'NEW YORK', 1 - smooth(0.2, 0.45, k)));
  scr.push(tag(sf[0] + 26, sf[1] + 52, 'SAN FRANCISCO', o.sfTag ?? 0));
  if (ca > 0) scr.push(tag(P([-121.5, 39.5])[0] - 300, P([-121.5, 39.5])[1] - 30, 'CALIFORNIA', ca));
  return xpFrame(T, s.join(''), scr.join(''));
}


/* ================= ch 9: the knock at Ma Kelly's door, the whole conversation (variant of renderE3Knock) ================= */
// The same flat, hall and door as ep3.js renderE3Knock; the edit gives every beat a narration time (o.beats), the camera
// (o.cam), who is talking (o.talk, o.mouth: the words.json 'who' spans), Rivke's turns (o.rivkeTurn) and the speakers' hand keys
// (o.maArm, o.rivkeArm: [T, shoulder, elbow]).
function renderKnockB(T, o) {
  const t = T, K = o.beats;
  const {x0, x1, F, ceil, wallFoot, H} = RM, s = [], scr = [];
  const c = cam2(o.cam(T)), lod = lodFor(H * 0.9 * c.z);
  const fl = 0.86 + 0.08 * Math.sin(t * 7.3) + 0.05 * Math.sin(t * 16.1);
  const room = e3Room({door: true, seed: 181, paper: 0.16});
  s.push(room.back);
  // the hall outside the door: dark boards, a gas jet on the wall, the stair rail
  const h0 = x0 - 760;
  s.push(`<rect x="${h0}" y="${ceil}" width="${x0 - 34 - h0}" height="${wallFoot - ceil}" fill="#101C1B"/>` + MAT.floor(h0, x0 - 34, wallFoot, F + 70, {kind: 'planks', base: '#2A251C', seed: 182, size: 50, vp: (h0 + x0) / 2}) +
    glowC(x0 - 420, F - 430, 260, 0.45, 'mswarm') + `<rect x="${x0 - 424}" y="${F - 440}" width="8" height="30" fill="#0D0C09"/><ellipse cx="${x0 - 420}" cy="${F - 450}" rx="5" ry="10" fill="#FFF3D6"/>` +
    `<rect x="${h0 + 60}" y="${F - 360}" width="16" height="360" fill="#0D0C09"/>` + line([[h0 + 68, F - 350], [h0 - 200, F - 560]], '#0D0C09', 10));
  // the flat (kelly_flat's look): the airshaft window with washing across the shaft, the coal stove and kettle, the shelf of pots
  const wx = 860, wy = 360;
  s.push(`<rect x="${wx - 14}" y="${wy - 14}" width="218" height="318" fill="#0D0C09"/>` + MAT.brick(wx, wy, 190, 290, {base: '#2B4744', seed: 183, soot: 'bottom', bw: 26, bh: 12}) + `<rect x="${wx}" y="${wy}" width="190" height="290" fill="url(#knshaft)"/>` +
    line([[wx, wy + 60], [wx + 190, wy + 72]], '#0D0C09', 2) + [0, 1].map((k) => `<path d="M${wx + 30 + k * 80},${wy + 64 + k * 5} l44,2 l-4,${54 + 8 * Math.sin(t * 1.3 + k)} l-36,-2 Z" fill="#4E726C"/>`).join('') +
    `<rect x="${wx + 91}" y="${wy}" width="8" height="290" fill="#0D0C09"/><rect x="${wx}" y="${wy + 140}" width="190" height="8" fill="#0D0C09"/><rect x="${wx - 24}" y="${wy + 300}" width="238" height="14" fill="#0D0C09"/>`);
  const sx = 1270;
  s.push(`<rect x="${sx}" y="${wallFoot - 230}" width="170" height="210" fill="#0D0C09"/><rect x="${sx - 8}" y="${wallFoot - 240}" width="186" height="14" fill="#0D0C09"/><rect x="${sx + 120}" y="${ceil}" width="28" height="${wallFoot - 240 - ceil}" fill="#0D0C09"/><rect x="${sx + 24}" y="${wallFoot - 170}" width="70" height="44" fill="#FFF3D6" opacity="${f1(0.4 + 0.1 * Math.sin(t * 9))}"/>` +
    `<path d="M${sx + 20},${wallFoot - 240} q0,-44 44,-44 q44,0 44,44 Z" fill="#0D0C09"/>` + glowC(sx + 60, wallFoot - 150, 200, 0.4 * fl, 'mswarm') + MAT.smoke(sx + 80, wallFoot - 300, t, {col: 'A3BAB2', k: 0.4, n: 5, rise: 140, drift: 50, seed: 184}));
  s.push(`<rect x="560" y="330" width="230" height="10" fill="#0D0C09"/>` + [0, 1, 2].map((k) => `<path d="M${578 + k * 70},330 l6,-${40 + (k % 2) * 14} l40,0 l6,${40 + (k % 2) * 14} Z" fill="#0D0C09"/>`).join(''));
  // the table and the lamp, a pile of shirts; Ma's chair
  const tx = 1000, ty = F - 250;
  s.push(glowC(tx + 110, ty - 90, 560, 0.8 * fl, 'mswarm') + glowC(tx + 110, ty - 90, 140, 0.55 * fl));
  s.push(MAT.shadow(tx + 110, F + 4, 200, 0.4) + `<rect x="${tx - 100}" y="${ty}" width="300" height="14" fill="#2B2418"/><rect x="${tx - 86}" y="${ty + 14}" width="12" height="${F - ty - 14}" fill="#0D0C09"/><rect x="${tx + 174}" y="${ty + 14}" width="12" height="${F - ty - 14}" fill="#0D0C09"/>`);
  s.push(`<path d="M${tx + 90},${ty} l10,-40 q-22,-26 18,-44 q40,18 18,44 l10,40 Z" fill="#0D0C09"/><path d="M${tx + 104},${ty - 86} q16,-52 32,0 l0,8 l-32,0 Z" fill="${E3.cream}" opacity="${f1(0.55 + 0.3 * fl)}"/><ellipse cx="${tx + 120}" cy="${ty - 96}" rx="5" ry="12" fill="#FFF3D6"/>`);
  for (let k = 0; k < 5; k++) s.push(`<path d="M${tx - 80 + k * 2},${ty - 6 - k * 9} l100,0 l4,9 l-104,0 Z" fill="#DFE0D6" opacity="0.7"/>`);
  const chx = 1230, seat = F - 150;
  s.push(`<rect x="${chx - 50}" y="${seat}" width="100" height="12" fill="#0D0C09"/><rect x="${chx - 44}" y="${seat + 12}" width="10" height="${F - seat - 12}" fill="#0D0C09"/><rect x="${chx + 34}" y="${seat + 12}" width="10" height="${F - seat - 12}" fill="#0D0C09"/><rect x="${chx + 34}" y="${seat - 230}" width="10" height="230" fill="#0D0C09"/>`);
  // ---- the acting (the edit's): every beat is a narration time in K, and who speaks when comes from the words (o.talk(who, T),
  // o.mouth(who, T)). Ma: sewing at the table; looks up at the knocks; gets up, crosses, takes the handle and pulls the door open;
  // folds her arms; listens; looks down (remembering); unfolds them and answers with her hands. Rivke knocks, steps back, turns
  // to her mother and back as she translates; Sore asks with an open hand and nods at the end.
  const bump = (a, d) => (t > a && t < a + d ? Math.sin(Math.PI * (t - a) / d) : 0);
  const keysAt = (KK, def) => { if (!KK.length || t <= KK[0][0]) return KK.length ? [KK[0][1], KK[0][2]] : def; for (let i = 1; i < KK.length; i++) if (t <= KK[i][0]) {
    const u = ease((t - KK[i - 1][0]) / (KK[i][0] - KK[i - 1][0])); return [lerp(KK[i - 1][1], KK[i][1], u), lerp(KK[i - 1][2], KK[i][2], u)]; } return [KK[KK.length - 1][1], KK[KK.length - 1][2]]; };
  const rimM = {c: '#FFE6C9', a: lod.rimA * 0.8 * fl, dx: -0.01, dy: -0.004};
  const mR = e3R(H * 0.9), mx1 = x0 + 120, steps = 4, mx0 = mx1 + steps * mR;
  const rise = smooth(K.rise, K.rise + 0.5, t), walk = e3Trap(t, K.cross, K.cross + K.crossDur), fold = smooth(K.fold, K.fold + 0.4, t) * (1 - smooth(K.unfold, K.unfold + 0.5, t));
  const maTalk = o.talk('MA', t), maMouth = o.mouth('MA', t);
  const nod = -8 * (bump(K.nod1, 0.5) + bump(K.nod2, 0.45) + 0.6 * bump(K.nod2 + 0.45, 0.4));
  const maTilt = t < K.knock[0] ? -14 + 2 * Math.sin(t * 1.3) : t < K.rise + 0.4 ? 4 : t > K.recall && t < K.recall + 2.2 ? -12 * bump(K.recall, 2.2) - 3 : (maTalk ? 2 + 3 * Math.sin(t * 5.1) : 1.5 * Math.sin(t * 0.8)) + nod;
  const maExpr = maMouth ? 'awe' : t > K.fold ? 'set' : 'neutral';
  let ma, over = '';
  const baseO = {x: mx0, y: F, h: H, d: -1, det: lod.det, rim: rimM, an: {tilt: maTilt, expr: maExpr, blink: (t + 0.5) % 3.7 < 0.12}};
  if (t < K.cross) { // seated, then rising, feet planted where they rest
    const st = sitOn(cast('mother', {...baseO, an: {...baseO.an}}), F - 150, F, 0.2, 'kb.ma.seat');
    const feet = [E3K.foot(st, 0), E3K.foot(st, 1)], fUnder = [[mx0 - 0.04 * st.h, F], [mx0 + 0.04 * st.h, F]], fr = smooth(0, 0.7, rise);
    const feetR = [[lerp(feet[0][0], fUnder[0][0], fr), F], [lerp(feet[1][0], fUnder[1][0], fr), F]];
    ma = rise > 0 ? plant({...st, y: lerp(st.y, F, rise), an: {...st.an, legs: [lerp(86, 9, rise), lerp(80, -8, rise)], shins: [lerp(6, 5, rise), lerp(0, -5, rise)], standing: rise > 0.5}}, feetR, 'kb.ma.rise') : st;
    if (t < K.knock[0] + 0.15) { const k = Math.max(0, Math.sin(t * 3.4)); ma = reach(ma, 'f', tx + 160 - 30 * k, ty - 4, 'kb.ma.sew'); ma = reach(ma, 'b', tx + 176, ty - 2, 'kb.ma.cloth'); }
  } else if (t < K.cross + K.crossDur + 0.05) {
    ma = stepWalk(cast('mother', {...baseO, an: {...baseO.an}}), mx0, -1, steps * mR * walk, () => F, 'kb.ma.walk');
  } else { // at the door: settled, then standing; the arms as the scene needs them
    const m = maFig({...baseO, an: {...baseO.an}}, fold);
    const arrived = stepWalk({...m.fo, an: {...m.fo.an, fArm: undefined, bArm: undefined}}, mx0, -1, steps * mR, () => F, 'kb.ma.walk');
    const settle = smooth(K.cross + K.crossDur + 0.05, K.cross + K.crossDur + 0.45, t);
    const sway = POSES.stand(t, 0.6);
    if (settle < 1) ma = e3Settle(arrived, settle, 'kb.ma');
    else ma = e3Stand({...arrived, y: F, floorY: F, an: {...arrived.an, ...sway, tilt: maTilt, expr: maExpr}}, mx1 - 0.0, mx1 - 0.0, 0, 'kb.ma.stand');
    // her hands while she talks (unfolded): "Tell her" a small open hand toward Sore; "I'll take her" to her chest; "Saturday."
    // one finger up; "Sunday, then" the hand turns over; "And tell her this" the finger up at Rivke; "...nobody talks to anybody"
    // a wag; "Nobody." a flat chop down
    const MA_F = o.maArm || [], arm = fold > 0 ? m.fo.an.fArm : keysAt(MA_F, [176, 180]), barm = fold > 0 ? m.fo.an.bArm : [182, 186];
    const wag = t > K.wag0 && t < K.wag1 ? 14 * Math.sin((t - K.wag0) * 11) : 0;
    ma = {...ma, an: {...ma.an, fArm: [arm[0], arm[1] + wag], bArm: barm, lean: fold > 0 ? 0 : (maTalk ? 2 : 0)}};
    over = fold > 0.85 ? foldedArms(ma.x, ma.y, ma.h, -1, ma.fill, ma.tones.tone) : '';
  }
  // the door: her hand on the handle; she pulls it open and lets go, it swings on
  const da = 30 * smooth(K.open, K.open + 0.35, t) + 48 * smooth(K.open + 0.35, K.open + 0.9, t), door = knDoor(da, -9);
  if (t > K.open - 0.25 && t < K.open + 0.45) { const gN = E3K.hand(ma, 'f'), k = smooth(K.open - 0.25, K.open - 0.05, t);
    ma = t < K.open - 0.05 ? e3Move(ma, 'f', lerp(gN.x, door.handle[0], k), lerp(gN.y, door.handle[1], k), 'kb.ma.toHandle') : reach(ma, 'f', door.handle[0], door.handle[1], 'kb.ma.handle'); }
  if (t >= K.open + 0.45 && t < K.open + 0.8) { const hA = knDoor(30, -9).handle, gN = E3K.hand(ma, 'f'), k = smooth(K.open + 0.45, K.open + 0.8, t); ma = e3Move(ma, 'f', lerp(hA[0], gN.x, k), lerp(hA[1], gN.y, k), 'kb.ma.letGo'); }
  s.push(door.svg);
  // Sore and Rivke along the hall; Rivke knocks at K.knock; steps back; translates
  const rimV = {c: '#FFF3D6', a: lod.rimA * 0.5, dx: 0.01, dy: -0.004}, vR = e3R(H * 0.8), sR = e3R(H * 0.88);
  const rx1 = x0 - 140, sx1 = x0 - 480, wv = e3Trap(t, K.hall, K.hall + 2.2);
  const rvTalk = o.talk('RIVKE', t), rvMouth = o.mouth('RIVKE', t);
  const turned = o.rivkeTurn(t); // Rivke facing her mother (relaying), else facing Ma
  const rvTilt = turned ? 6 : rvTalk ? (t > K.sabbath0 && t < K.sabbath1 ? -8 : 7) + 3 * Math.sin(t * 6.1) : (o.talk('MA', t) ? 10 : 5) + 2 * Math.sin(t * 0.9);
  const rvExpr = rvMouth ? 'awe' : t > K.sabbath0 && t < K.sabbath1 + 0.6 ? 'worried' : 'neutral';
  let rv = stepWalk(nbOpts('ndaughter', {x: rx1 - 4 * vR, y: F, h: H, scale: 0.8, d: 1, hat: 'kerchief', wear: ['plain', 'shawl'], det: lod.det, rim: rimV, an: {tilt: 2, expr: 'neutral', blink: (t + 1) % 4 < 0.12}}), rx1 - 4 * vR, 1, 4 * vR * wv, () => F, 'kb.rivke');
  let so = stepWalk(nbOpts('nmother', {x: sx1 - 4 * sR, y: F, h: H, d: 1, det: lod.det, rim: rimV, an: {tilt: 0, expr: 'neutral', blink: t % 3.9 < 0.12}}), sx1 - 4 * sR, 1, 4 * sR * wv, () => F, 'kb.sore');
  const kEnd = K.hall + 2.2;
  rv = e3Settle(rv, smooth(kEnd, kEnd + 0.2, t), 'kb.rivke'); so = e3Settle(so, smooth(kEnd + 0.1, kEnd + 0.4, t), 'kb.sore');
  if (t >= kEnd + 0.4) { const soTilt = (o.talk('MA', t) ? 6 : 2) + -7 * (bump(K.soreNod, 0.5) + bump(K.soreNod + 0.55, 0.45)) + (turned ? 8 : 0);
    so = e3Stand({...so, y: F, floorY: F, an: {...so.an, ...POSES.stand(t, 0.1), tilt: soTilt, expr: t > K.sister - 0.3 && t < K.sister + 2.4 ? 'worried' : 'neutral'}}, so.x, so.x, 0, 'kb.sore.stand'); }
  if (t >= kEnd + 0.2) {
    const back = smooth(K.stepBack, K.stepBack + 0.6, t), xa = rv.x, xb = rv.x - 80;
    const base = {...rv, y: F, floorY: F, an: {...POSES.stand(t, 0.4), tilt: rvTilt, expr: rvExpr, blink: (t + 1) % 4 < 0.12}};
    rv = t < K.stepBack ? e3Stand(base, xa, xa, 0, 'kb.rivke.stand') : t < K.stepBack + 0.6 ? e3Stand(base, xa, xb, (t - K.stepBack) / 0.6, 'kb.rivke.step') : e3Stand({...base, d: turned ? -1 : 1}, xb, xb, 0, 'kb.rivke.stand');
    // her hand while she talks: an open palm toward whoever she speaks to; low and open for "Saturday is our Sabbath"
    if (t > K.stepBack + 0.6) { const A = keysAt(o.rivkeArm || [], [176, 180]); rv = {...rv, an: {...rv.an, fArm: A}}; }
  }
  if (t > K.knock[0] - 0.25 && t < K.knock[2] + 0.25) { // three knocks: the knuckles touch the door at each tap
    const near = K.knock.some((q) => Math.abs(t - q) < 0.035), off = 14 * Math.min(...K.knock.map((q) => Math.min(1, Math.abs(t - q) / 0.1)));
    rv = near ? reach(rv, 'f', x0 - 34, F - 290, 'kb.rivke.knock') : e3Move(rv, 'f', x0 - 34 - off, F - 290, 'kb.rivke.knock.lift'); }
  { const k = smooth(K.sister - 0.4, K.sister, t) * (1 - smooth(K.sister + 1.8, K.sister + 2.3, t)); if (k > 0) so = {...so, an: {...so.an, fArm: [lerp(176, 132, k), lerp(170, 92, k)]}}; }
  s.push(fig(so), fig(rv));
  s.push(fig(ma) + over);
  for (const q of K.knock) { const u = clamp01((t - q) / 0.3); if (u > 0 && u < 1) s.push(`<path d="M${x0 + 20 + 30 * u},${F - 320} q14,30 0,60" stroke="${E3.cream}" stroke-width="4" fill="none" opacity="${f1(1 - u)}"/>`); }
  s.push(room.front.replace(`<rect x="${x0 - 34}" y="${F + 70 - 40}"`, `<rect data-k="1" x="${x0 - 34}" y="${F + 70 - 40}"`));
  const world = layerAt(c, 1, s.join(''));
  const defs = e3Defs2(t).replace('</defs>', `<linearGradient id="knshaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5F857F" stop-opacity="0.35"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></linearGradient></defs>`);
  return frame(defs, `<rect width="1920" height="1080" fill="#060A0A"/>`, world, '', t);
}


/* ================= ch 9: moving in (variant of renderMovingIn) ================= */
// Clip time t = T - o.t0 for the action; the edit's camera (o.cam), Ma's look and head (o.look, o.maTilt), the horsecar (o.carT).
// Michael walks a longer way home along the sidewalk (o.mSteps steps from o.mStart), and Yankel tugs at the trunk until he comes.
function miKellyWindowB(t, look, extraTilt = 0) { // Ma Kelly behind her window, arms folded; the wall below the sill hides her from the waist down
  const {x, y, w, h} = MI.win, s = [], facade = MI.seed % 2 ? ST.facade : ST.facadeDark;
  s.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0B1414"/>` + glowC(x + 6, y + 30, 40, 0.5, 'mswarm'));
  s.push(kel('mother', {x: x + 15, y: y + h + 24, h: MI.man, d: 1, noShadow: true, fold: true, det: 0, rim: {c: '#FFF3D6', a: 0.55, dx: 0.012, dy: -0.004},
    an: {...E3_FOLD, tilt: -10 - 6 * look + extraTilt, lean: -1 + 2 * look, blink: t % 3.6 < 0.12}}));
  s.push(`<rect x="${x - 2}" y="${y + h}" width="${w + 4}" height="44" fill="${facade}"/><rect x="${x - 3}" y="${y - 6}" width="${w + 6}" height="6" fill="${ST.iron}"/>`);
  const by = y + h + 4, bx0 = MI.x + MI.gap * 0.6, bx1 = MI.x + MI.w - MI.gap * 0.6; // the fire escape in front of her
  s.push(`<rect x="${f1(bx0)}" y="${by}" width="${f1(bx1 - bx0)}" height="4" fill="${ST.iron}"/><rect x="${f1(bx0)}" y="${by - 30}" width="${f1(bx1 - bx0)}" height="3" fill="${ST.iron}"/>` +
    [...Array(Math.ceil((bx1 - bx0) / 9))].map((_, k) => `<rect x="${f1(bx0 + k * 9)}" y="${by - 30}" width="1.6" height="30" fill="${ST.iron}"/>`).join(''));
  return s.join('');
}
function miTrunkPairB(t, lod, rim, o = {}) {
  const G = FAR_GROUND, L = 56, X0 = MI.landR + 4 * MI.step + 6, sTot = X0 - MI.door + 82, s = [];
  const carry = e3Trap(t, 3.4, 7.9, 0.15) * sTot;
  let yk = nbOpts('nfather', {x: X0, y: G, h: MI.man, d: -1, hat: 'cap', coat: 'frock', det: lod.det, rim, an: {fArm: [176, 180], tilt: t < 3.4 ? -10 : 0, expr: t < 2.8 ? 'set' : 'smile'}});
  yk = stepWalk(yk, X0, -1, carry, MI.ground, 'mi.yankel');
  const tug = t < 2.9 ? Math.sin(t * 5.3) * (1 - smooth(2.4, 2.9, t)) : 0; yk = {...yk, an: {...yk.an, lean: 5 * tug - 3}};
  const P1 = [yk.x + 15, yk.y - 0.56 * yk.h + 7 * tug];
  yk = reach(yk, 'b', P1[0], P1[1], 'mi.yankel.trunk');
  // Michael: along the sidewalk from the right (0 to 2.6), crouch for the low end (2.6 to 3.0), lift (3.0 to 3.4), then carry
  const mS = o.mSteps || 8, mx1 = X0 + 82, mx0 = mx1 + mS * MI.step, mw = e3Trap(t, o.mStart ?? 0, 2.6, 0.12);
  let mk = cast('michael', {x: mx0, y: G, h: MI.man, d: -1, det: lod.det, rim, an: {tilt: t < 2.2 ? 0 : -8, expr: t > 3.0 ? 'smile' : 'neutral', blink: t % 3.5 < 0.12}});
  mk = t < 3.4 ? stepWalk(mk, mx0, -1, mS * MI.step * mw, () => G, 'mi.michael') : stepWalk({...mk, x: mx1}, mx1, -1, carry, MI.ground, 'mi.michael.carry'); if (t >= 3.4) mk = {...mk, an: {...mk.an, lean: 7}}; // leaning into the load
  const cr = smooth(2.6, 3.0, t) * (1 - smooth(3.0, 3.4, t));
  if (cr > 0) { const feet = [E3K.foot(mk, 0), E3K.foot(mk, 1)]; mk = plant({...mk, y: mk.y + 22 * cr, an: {...mk.an, lean: 30 * cr}}, feet, 'mi.michael.crouch'); }
  // the back handle: resting on the flags until Michael has it, then lifted level with the front, then carried at his hands' height
  const restY = G - 24, lifted = smooth(3.0, 3.4, t), carryY = mk.y - 0.56 * yk.h;
  const P2y = t < 3.0 ? restY : t < 3.4 ? lerp(restY, P1[1], lifted) : carryY, dy = P2y - P1[1], P2 = [P1[0] + Math.sqrt(L * L - dy * dy), P2y];
  if (t > 2.4) { const k = smooth(2.4, 2.96, t), gf = E3K.hand(mk, 'f'), gb = E3K.hand(mk, 'b');
    if (t < 2.96) { mk = e3Move(mk, 'f', lerp(gf.x, P2[0], k), lerp(gf.y, P2[1], k), 'mi.michael.toTrunk'); mk = e3Move(mk, 'b', lerp(gb.x, P2[0] + 5, k), lerp(gb.y, P2[1], k), 'mi.michael.toTrunk.b'); }
    else { mk = reach(mk, 'f', P2[0], P2[1], 'mi.michael.trunk.handle'); mk = reach(mk, 'b', P2[0] + 5, P2[1], 'mi.michael.trunk.corner'); } }
  const ang = Math.atan2(P2[1] - P1[1], P2[0] - P1[0]) * 180 / Math.PI;
  const trunkSvg = `<g transform="translate(${f1(P1[0])},${f1(P1[1])}) rotate(${f1(ang)})">${trunk(0, 24, L, 20, '#1A1410', '#5F857F')}<path d="M-4,2 q4,-5 8,0 M${L - 4},2 q4,-5 8,0" stroke="#0D0C09" stroke-width="2" fill="none"/></g>`;
  // in at the door: each fades as he passes the door post
  const inY = smooth(0, 0.8, (MI.door + 4 - yk.x) / 30), inM = smooth(0, 0.8, (MI.door + 4 - mk.x) / 30), inT = smooth(0, 0.8, (MI.door + 4 - (P1[0] + P2[0]) / 2) / 30);
  if (inY < 1) s.push(`<g opacity="${f1(1 - inY)}">${fig(yk)}</g>`);
  if (inT < 1) s.push(`<g opacity="${f1(1 - inT)}">${trunkSvg}</g>`);
  if (inM < 1) s.push(`<g opacity="${f1(1 - inM)}">${e3Shadow(mk, mk.h)}${figure(mk)}</g>`);
  return s.join('');
}
function renderMovingInB(T, o = {}) {
  const t = T - o.t0;
  const keys0 = [[0, 2.3, 1200, 750], [3.0, 2.5, 1130, 765], [7.6, 1.7, 1020, 700], [10.2, 1.16, 940, 566], [12.0, 5.0, MI.win.x + 20, MI.win.y + 46], [15, 5.2, MI.win.x + 20, MI.win.y + 46]];
  const c = cam2(o.cam(T)), G = FAR_GROUND, s = [], lod = lodFor(MI.man * c.z), rim = {c: '#FFF3D6', a: lod.rimA * 0.7, dx: -0.01, dy: -0.004};
  // the row: the Kellys' building (Episode 1's tenement) between its neighbours
  for (const [x, w, fl, seed] of [[-80, 250, 4, 409], [174, 300, 5, 404], [478, 278, 5, 405], [MI.x, MI.w, MI.floors, MI.seed], [1034, 250, 4, 403], [1288, 290, 5, 406], [1582, 260, 5, 407], [1846, 270, 4, 408]]) s.push(tenement(x, w, fl, seed, t));
  s.push(miKellyWindowB(T, o.look(T), o.maTilt ? o.maTilt(T) : 0));
  // the sidewalk (flagstones), the curb, the cobbled street; a gas lamp; a telegraph pole and its wires
  s.push(MAT.floor(-400, 2400, G, G + 34, {kind: 'flag', base: '#3E5F5A', seed: 74, size: 46}) + `<rect x="-400" y="${G + 34}" width="2800" height="8" fill="#0D0C09"/>` + MAT.floor(-400, 2400, G + 42, G + 260, {kind: 'cobble', base: '#2B4744', seed: 75, size: 40}));
  s.push(gasLamp(700, G + 30, 170, 0, t) + `<rect x="1460" y="${G - 870}" width="12" height="${870 + 30}" fill="#0D0C09"/>` + [0, 1, 2].map((k) => `<rect x="${1406}" y="${G - 850 + k * 34}" width="120" height="6" fill="#0D0C09"/>`).join(''));
  s.push([0, 1, 2].map((k) => line([[-400, G - 830 + k * 34], [1466, G - 846 + k * 34], [2400, G - 822 + k * 34]], '#0D0C09', 1.4)).join(''));
  // the wagon at the curb, the horse standing (resting a hind leg, tossing its head); the family's things on it
  const wy = G + 120, wx = 1230;
  s.push(MAT.shadow(wx + 60, wy + 2, 120, 0.4) + msHorse(wx + 110, wy, 62, '#0D0C09', 0, Math.max(0, Math.sin(t * 1.3)) ** 6, 1, 1));
  s.push(line([[wx + 30, wy - 52], [wx + 80, wy - 48]], '#0D0C09', 4) + `<rect x="${wx - 230}" y="${wy - 66}" width="260" height="28" fill="#0D0C09"/>`);
  for (const u of [wx - 200, wx - 20]) s.push(`<circle cx="${u}" cy="${wy - 26}" r="26" fill="none" stroke="#0D0C09" stroke-width="5"/>` + [...Array(10)].map((_, k) => { const a = k * TAU / 10; return line([[u, wy - 26], [u + Math.cos(a) * 26, wy - 26 + Math.sin(a) * 26]], '#0D0C09', 2); }).join(''));
  s.push(`<rect x="${wx - 220}" y="${wy - 100}" width="6" height="34" fill="#0D0C09"/><rect x="${wx - 220}" y="${wy - 100}" width="34" height="5" fill="#0D0C09"/>`);
  s.push(featherBed(wx - 180, wy - 66, 70, 30, '#DFE0D6') + (t > 5.6 ? '' : samovar(wx - 40, wy - 66, 0.66)));
  // the family carries their things up the stoop, one after another
  s.push(miStoopSide());
  // loads are drawn from the grip: the trunk's end in the father's raised hand (resting on his shoulder), the rolled bed hugged at
  // the mother's hands, the samovar by its handle, the candlestick by its stem
  s.push(miTrunkPairB(t, lod, rim, o)); MI.queue = true;
  s.push(miCarrier('nmother', t, 4.6, {det: lod.det, rim, arms: {fArm: [88, 30], bArm: [100, 50]}, load: (gx, gy) => featherBed(gx - 28, gy + 14, 56, 28, '#DFE0D6')}));
  s.push(miCarrier('ndaughter', t, 5.6, {scale: 0.8, hat: 'kerchief', wear: ['plain', 'shawl'], det: lod.det, rim, arms: {fArm: [140, 60], bArm: [140, 90]}, load: (gx, gy, fo) => samovar(gx - fo.d * 14 * 0.42, gy + 40 * 0.42, 0.42)}));
  s.push(miCarrier('nson', t, 6.5, {scale: 0.52, det: lod.det, rim, arms: {fArm: [110, 40]}, load: (gx, gy) => candlestick(gx, gy + 12 * 0.5, 0.5)}));
  // two Irish neighbours on the next stoop down, watching (ink)
  s.push(e3Person(rng(76), 600, G, MI.man, t, '#0D0C09', {d: 1, an: E3_FOLD}) + e3Person(rng(79), 640, G, MI.man, t, '#0D0C09', {d: 1}));
  // a horsecar passes along the street in front
  const hc = T > o.carT && T < o.carT + 5.4 ? -700 + (T - o.carT) * 520 : -5000;
  s.push(`<g transform="translate(0,${G + 250}) scale(0.62) translate(0,${-(G + 250)})">${horsecar(hc / 0.62, G + 250, t)}</g>` + line([[-400, G + 252], [2400, G + 252]], '#0D0C09', 4));
  const world = layerAt(c, 0.3, `<rect x="-3000" y="-2000" width="8000" height="3000" fill="url(#e3day)"/>` + stFar(t)) + layerAt(c, 1, s.join(''));
  const scr = [];
  return frame(e3Defs(T), `<rect width="1920" height="1080" fill="#4E726C"/>`, world, scr.join(''), T);
}

if (typeof window !== 'undefined') Object.assign(window, {renderHesterB, renderRoomB, renderSweatshopB, renderJarB, renderUSMap, renderKnockB, renderMovingInB, renderModelShot, lhCam, LH});
