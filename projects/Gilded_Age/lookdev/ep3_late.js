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

if (typeof window !== 'undefined') Object.assign(window, {renderHesterB, renderRoomB, renderSweatshopB, renderJarB, renderUSMap, renderModelShot, lhCam, LH});
