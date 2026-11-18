// Chapter 5, "Fort Frick" (0:00 to 1:58). Back to the barges (ep5_homestead_dawn); the mill on the bank; Carnegie (photograph, Ep 1's
// archive); ep5_x_charge on the words (Carnegie, owner; Frick, runs it for him; the mill; "the boss", "the boss's tough guy") with Frick's
// photograph (1899, dated); the 1892 contract (strikers on the lookout, stereo 1892); the fence (a drawn Fort Frick on the explainer
// board: LOCKED OUT); the Pinkertons (the barges again); the fight told in words over the frozen stare-down (no shooting on screen);
// the surrender (Harper's 1892: leaving the barges); the militia (stereo 1892); Frick shot (his portrait, words only); Carnegie in
// Scotland; his library at Braddock and a steelworker's question; "Hero? Villain? Or both?" (ga_hero_villain under it); Pullman 1894
// and the injunction card; ep5_door1_close, the slam on "closed"; the corridor turns west to the farm door; the baton "Uncle Owen's Letters".
const E5_EP1IMG = '../../../ep1/public/img/', E5_EP2IMG = '../../../ep2/public/img/';
/** Fort Frick on the explainer board: the mill, the tall board fence going up round it, barbed wire along the top. */
function e5xFence(T, {a, fence, wire, name, lock}) {
  const s = [x5Board(11)], scr = [];
  s.push(x5At(960, 560, x5Pop(a, T) * 3.0, X5I.mill()));
  const k = clamp01((T - fence) / 1.4), n = 26, x0 = 360, x1 = 1560, top = 520;
  for (let i = 0; i < n; i++) { const u = clamp01(k * n - i); if (u <= 0) continue; const x = x0 + (x1 - x0) * i / (n - 1), h = 260 * ease(u);
    s.push(`<rect x="${f1(x - 22)}" y="${f1(780 - h)}" width="44" height="${f1(h)}" fill="#3A4644" stroke="#111" stroke-width="4"/>`); }
  const kw = clamp01((T - wire) / 1.0);
  if (kw > 0) { let d = `M${x0 - 22},${top + 4}`; for (let x = x0 - 22; x <= x0 - 22 + (x1 - x0 + 44) * kw; x += 30) d += ` L${x + 15},${top - 14} L${x + 30},${top + 4}`;
    s.push(x5Ink(d, 4, 'none', X5.pale)); }
  scr.push(x5Op(x5In(wire, T), x5Pen(1240, 430, 'barbed wire', 32, -3)));
  scr.push(x5Slap(560, 300, 'FORT FRICK', 70, name, T, 93, -3));
  scr.push(x5Slap(700, 900, 'LOCKED OUT', 56, lock, T, 94, 2));
  return x5Frame(T, s.join(''), scr.join(''));
}
/** The doors corridor after door 1 has closed: centred on the farm door as it lights (to "out west"). */
function renderDoorsWest(t, t0, t1) {
  const u = ease(clamp01((t - t0) / (t1 - t0))), c = {x: 1850, y: lerp(495, 500, u), z: lerp(1.12, 1.15, u)};   // centred on the farm door; its neighbours out of frame
  const doors = [{d: DR_DOORS[0], st: {open: 0, light: 0, glow: 0, key: 0, emb: 0.3, stamp: 1.6}},
    {d: DR_DOORS[1], st: {open: 0, light: 0, glow: 0.35 + 0.5 * u + 0.08 * Math.sin(t * 3), key: 0.6 * u, emb: 0.5 + 0.6 * u}},
    {d: DR_DOORS[2], st: {open: 0, light: 0, glow: 0.2, key: 0, emb: 0.4}}];
  return drFrame(t, c, doors, {motes: [0, 300, 1920, 1080, 50, 0.6, 9]});
}
EDITS.ch05 = () => {
  const ch = 'ch05_fort_frick', w = (word, n) => wordAt(ch, word, n), L = (word, near) => lWord(ch, word, near);
  const c = {
    thisIs: w('This'), belonged: w('belonged'), richest: w('richest'), matters: w('matters.'), carnegie2: L('Carnegie', 12.5), henry: w('Henry'), boss: w('boss.'),
    tough: L('tough', 20.3), in1892: w('1892,'), lower: w('lower'), frickRef: L('Frick', 29.7), he: w('He'), fence: w('fence'), barbed: w('barbed'), fort: w('Fort'),
    locked: w('locked'), toRun: L('To', 40.62), pinkerton: w('Pinkerton'), privateCo: w('private'), theMen: L('The', 49.1), fight: w('fight'), killed: w('killed,'),
    surrendered: w('surrendered.'), governor: w('governor'), reopened: w('reopened'), then: L('Then', 65.0), survived: w('survived,'), crushed: w('crushed.'),
    andWhere: L('And', 74.4), vacation: w('vacation.'), sending: w('Sending'), same: w('same'), libraries: w('libraries.'), but: L('But', 85.6),
    after: w('"After'), so: w('So,'), hero: w('Hero?'), villain: w('Villain?'), or: L('Or', 94.8), two: w('Two'), pullman: w('Pullman'), an: L('an', 102.6),
    injunction: w('injunction,'), closed: w('closed.'), government: L('government', 109.8), workers: L('Workers', 112.0), uncle: w('Uncle'),
  };
  const cardAt = c.uncle, dur = cardAt + CARD_HOLD, doorAt = c.closed - DCL.shut;
  const H = (map) => (T) => renderE5Homestead(map(T), {quiet: true});
  const cuts = {mill: c.thisIs - 0.1, carn: c.belonged - 0.4, charge: c.matters - 0.4, frick: c.henry - 0.2, charge2: c.boss - 0.6, y1892: c.in1892 + 0.45,
    fence: c.he - 0.15, pink: L('Frick', 42.44) - 0.2, pink2: c.privateCo - 0.2, fight: c.theMen + 1.85, surr: c.surrendered - 0.05, troops: c.governor - 0.1,
    shot: c.then + 0.2, scot: c.vacation - 0.15, lib: c.same + 0.5, hero: c.so - 0.15, pull: c.two + 1.1, door: doorAt, west: c.workers - 0.1};
  const CC = {...X5_CH, c: c.carnegie2, f: c.henry, m: c.henry + 1.4, n1: c.boss - 0.1, n2: c.boss + 0.78};
  const P_ = (txt, x, y, o, size = 32, rot = -3) => lNote(txt, x, y, o, size, rot);
  const slap = (T, t0, txt, x, y, size, seed, rot = -3) => T > t0 ? slideUp(fin(T, t0, 0.18), tape(txt, {x, y, size, rot, seed})) : '';
  const shots = [
    // "Remember those barges?"
    {a: 0, b: cuts.mill, live: true, draw: H(remap([[0, 15.1], [cuts.mill, 16.4]]))},
    // "This is where they were headed: the steel mill in Homestead, Pennsylvania."
    {a: cuts.mill, b: cuts.carn, live: true, draw: (T) => { const u = ease(clamp01((T - cuts.mill) / (cuts.carn - cuts.mill)));
      return e5HomesteadWide(1.0 + 0.7 * (T - cuts.mill), {ux: lerp(1380, 1500, u), uy: 480, z: lerp(1.3, 1.45, u)}) +
        lTag('THE STEEL MILL · HOMESTEAD, PENNSYLVANIA', 172, 124, fin(T, cuts.mill + 0.6, 0.35)); }},
    // "The mill belonged to Andrew Carnegie, one of the richest men in the world."
    {a: cuts.carn, b: cuts.charge, draw: (T) => push(T, cuts.carn, cuts.charge, 0.04) +
      printCard(E5_EP1IMG + 'ch05/carnegie_brady_c1885.jpg', {x: 640, y: 110, w: 560, ar: 1.329, rot: -1.5, o: fin(T, cuts.carn, 0.4), T,
        caption: 'Andrew Carnegie &middot; photograph, Brady studio'}) + `</div>` + P_('one of the richest', 1270, 470, fin(T, c.richest - 0.3, 0.35), 34) + P_('men in the world', 1290, 560, fin(T, c.richest - 0.3, 0.35), 34)},
    // "This part matters. Carnegie owned the mill. A tough manager named"
    {a: cuts.charge, b: cuts.frick, draw: (T) => renderX5Charge(T, CC)},
    // "Henry Clay Frick ran it for him." Frick's photograph (1899).
    {a: cuts.frick, b: cuts.charge2, draw: (T) => push(T, cuts.frick, cuts.charge2, 0.04) +
      printCard(E5_EP1IMG + 'ch05/henry_clay_frick_1899.jpg', {x: 680, y: 110, w: 560, ar: 1.152, rot: 1.5, o: fin(T, cuts.frick, 0.4), T,
        caption: 'Henry Clay Frick &middot; portrait, 1899'}) + `</div>`},
    // "Carnegie was the boss. Frick was the boss's tough guy."
    {a: cuts.charge2, b: cuts.y1892, draw: (T) => renderX5Charge(T, CC)},
    // "In 1892, the union and the company were bargaining over a new contract. The company offered lower pay. When the union said no,
    //  Frick refused to deal with the union at all." Strikers on the lookout at the Carnegie mills (stereo, 1892).
    {a: cuts.y1892, b: cuts.fence, draw: (T) => push(T, cuts.y1892, cuts.fence, 0.04) +
      printCard('e_homestead/carnegie_mills_strikers_on_the_lookout_1892_loc.jpg', {x: 340, y: 160, w: 1240, ar: 0.517, rot: -1, o: fin(T, cuts.y1892, 0.4), T,
        caption: 'strikers on the lookout at the Carnegie mills &middot; stereograph, 1892'}) + `</div>` +
      lTag('1892 · A NEW CONTRACT', 172, 124, fin(T, c.in1892, 0.35)) + P_('lower pay', 240, 968, fin(T, c.lower, 0.3), 34) +
      P_('Frick: no deal with the union', 900, 968, fin(T, c.frickRef, 0.3), 34)},
    // "He built a tall fence around the mill, topped with barbed wire. The workers called it Fort Frick. Then he locked them out."
    {a: cuts.fence, b: cuts.pink, draw: (T) => e5xFence(T, {a: cuts.fence, fence: c.fence - 0.3, wire: c.barbed, name: c.fort, lock: c.locked})},
    // "To run the mill with new workers, Frick hired about three hundred guards from the Pinkerton Detective Agency,"
    {a: cuts.pink, b: cuts.pink2, cut: true, live: true, draw: (T) => H(remap([[cuts.pink, 15.0], [cuts.pink2, 16.7]]))(T) +
      lTag('THE PINKERTON DETECTIVE AGENCY', 172, 124, fin(T, cuts.pink + 0.1, 0.35)) + P_('about 300 guards', 1010, 300, fin(T, cuts.pink + 1.6, 0.35), 34)},
    // "a private company that broke strikes. The men on the barges."
    {a: cuts.pink2, b: cuts.fight, cut: true, live: true, draw: (T) => H(remap([[cuts.pink2, 19.0], [cuts.fight, 21.6]]))(T) +
      P_('a private company that broke strikes', 300, 960, fin(T, c.privateCo, 0.35), 32)},
    // "In the fight that followed, at least ten people were killed, workers and guards." Told over the frozen stare-down, dimmed.
    {a: cuts.fight, b: cuts.surr, live: true, draw: (T) => `<div style="position:absolute;inset:0;transform:scale(${(1.07 + 0.03 * ease(clamp01((T - cuts.fight) / 5))).toFixed(4)});transform-origin:1010px 600px">${renderE5Homestead(34.4, {quiet: true})}</div>` +
      dimBy(0.55) + op(fin(T, c.fight, 0.4), mono('july 6, 1892', {x: 172, y: 330, size: 30, color: C.teal, ls: 6})) +
      slideUp(fin(T, c.killed - 0.6, 0.4), `<div class="tx" style="position:absolute;left:166px;top:386px;width:1200px;font-family:Abril;font-size:88px;line-height:1.08;color:${C.cream}">At least ten people were killed.</div>`) +
      op(fin(T, c.killed + 0.1, 0.4), mono('workers and guards', {x: 172, y: 600, size: 30, color: C.cream, ls: 6}))},
    // "The Pinkertons surrendered. But the workers didn't win." Harper's, 1892: the Pinkertons leaving the barges.
    {a: cuts.surr, b: cuts.troops, draw: (T) => push(T, cuts.surr, cuts.troops, 0.04) +
      printCard('e_homestead/homestead_riot_pinkertons_leaving_barges_harpers_1892_loc.jpg', {x: 700, y: 100, w: 520, ar: 1.528, rot: -1, o: fin(T, cuts.surr, 0.4), T,
        caption: "the Pinkertons leaving the barges &middot; Harper's Weekly, 1892"}) + `</div>` + P_('surrendered', 1290, 400, fin(T, c.surrendered, 0.3), 40)},
    // "The governor sent eight thousand state soldiers, and the mill reopened with strikebreakers." Militia entering Homestead (stereo, 1892).
    {a: cuts.troops, b: cuts.shot, draw: (T) => push(T, cuts.troops, cuts.shot, 0.04) +
      printCard('e_homestead/under_martial_law_militia_entering_homestead_1892_loc.jpg', {x: 370, y: 300, w: 1180, ar: 0.515, rot: -1, o: fin(T, cuts.troops, 0.4), T,
        caption: 'state militia entering Homestead &middot; stereograph, 1892'}) + `</div>` +
      bigFig('8,000', {x: 200, y: 140, w: 560, align: 'left', size: 150, o: fin(T, c.governor + 0.5, 0.35)}) +
      today('state soldiers', {x: 760, y: 200, w: 600, align: 'left', o: fin(T, c.governor + 0.7, 0.35)}) +
      P_('reopened with strikebreakers', 1180, 250, fin(T, c.reopened - 0.4, 0.35), 26)},
    // "Then an anarchist with no connection to the union shot Frick. Frick survived, but the public turned against the strikers, and
    //  the union was crushed." Frick's portrait; the event in words only.
    {a: cuts.shot, b: cuts.scot, draw: (T) => push(T, cuts.shot, cuts.scot, 0.04) +
      printCard(E5_EP1IMG + 'ch05/henry_clay_frick_1899.jpg', {x: 300, y: 110, w: 560, ar: 1.152, rot: -1.5, o: fin(T, cuts.shot, 0.4), T,
        caption: 'Henry Clay Frick &middot; portrait, 1899'}) + `</div>` +
      lTag('JULY 23, 1892 · FRICK IS SHOT, AND SURVIVES', 940, 260, fin(T, c.survived - 0.8, 0.35)) +
      slap(T, c.crushed - 0.3, 'THE UNION IS CRUSHED', 960, 480, 64, 95)},
    // "And where was Andrew Carnegie? On vacation. In Scotland. Sending Frick his support."
    {a: cuts.scot, b: cuts.lib, draw: (T) => push(T, cuts.scot, cuts.lib, 0.04) +
      printCard(E5_EP1IMG + 'ch05/carnegie_c1878_photo.jpg', {x: 1060, y: 110, w: 560, ar: 1.416, rot: 1.5, o: fin(T, cuts.scot, 0.4), T,
        caption: 'Andrew Carnegie &middot; photograph, about 1878'}) + `</div>` +
      P_('on vacation, in Scotland', 200, 420, fin(T, c.vacation, 0.3), 40) + P_('sending Frick his support', 200, 560, fin(T, c.sending - 0.3, 0.3), 40)},
    // "This is the same Carnegie who gave away most of his fortune and built thousands of free libraries. But one steelworker asked,
    //  'After working twelve hours, how can a man go to a library?'" The Carnegie Free Library at Braddock (1893).
    {a: cuts.lib, b: cuts.hero, draw: (T) => push(T, cuts.lib, cuts.hero, 0.035) +
      deskCut(E5_EP2IMG + 'desk/braddock_library_1893.png', {x: 180, y: 170, w: 820, rot: -1.5, o: fin(T, cuts.lib, 0.45), T}) + `</div>` +
      op(fin(T, cuts.lib + 0.4, 0.35), mono('carnegie free library, braddock, pennsylvania (1893)', {x: 190, y: 860, size: 20, color: C.cream, ls: 2, extra: 'background:rgba(13,12,9,.75);padding:4px 10px'})) +
      P_('thousands of free libraries', 1060, 230, fin(T, c.libraries - 0.6, 0.35), 32) +
      quote('&ldquo;After working twelve hours, how can a man go to a library?&rdquo;', 'a Homestead steelworker', {x: 1060, y: 380, w: 700, size: 56, o: fin(T, c.after - 0.2, 0.4)})},
    // "So, Andrew Carnegie. Hero? Villain? Or both?"
    {a: cuts.hero, b: cuts.pull, draw: (T) => push(T, cuts.hero, cuts.pull, 0.04) +
      printCard(E5_EP1IMG + 'ch05/carnegie_brady_c1885.jpg', {x: 680, y: 110, w: 560, ar: 1.329, rot: -1, o: fin(T, cuts.hero, 0.4), T,
        caption: 'Andrew Carnegie &middot; photograph, Brady studio'}) + `</div>` +
      slap(T, c.hero - 0.1, 'HERO?', 260, 260, 96, 96, -4) + slap(T, c.villain - 0.1, 'VILLAIN?', 1290, 420, 96, 97, 3) + slap(T, c.or - 0.3, 'OR BOTH?', 300, 640, 96, 98, -2)},
    // "Two years later, at the Pullman train car company near Chicago, a court banned another big strike with an order called an
    //  injunction, and the President sent in the army." The Pullman car works (1885); the injunction card.
    {a: cuts.pull, b: cuts.door, draw: (T) => push(T, cuts.pull, cuts.door, 0.04) +
      printCard('f_pullman/car_works_pullman_palace_car_co_1885_loc.jpg', {x: 190, y: 190, w: 820, ar: 0.794, rot: -1, o: fin(T, cuts.pull, 0.4), T,
        caption: 'the Pullman Palace Car Company works, near Chicago &middot; 1885'}) + `</div>` +
      lTag('PULLMAN STRIKE · 1894', 172, 124, fin(T, c.pullman, 0.35)) +
      vocabCard('injunction', 'in-JUNK-shun', 'noun', 'a court order that bans something, like a strike', {x: 1080, y: 300, w: 640, o: fin(T, c.an - 0.1, 0.35), size: 60})},
    // "The first door had closed. When workers took on big business, the government took business's side." ep5_door1_close: the slam
    // on "closed" (door_slam_dust), FELL SHORT (stamp_thud).
    {a: cuts.door, b: cuts.west, live: true, draw: (T) => renderDoorClose(T - doorAt, 0) + P_("the government took business's side", 300, 960, fin(T, c.government - 0.4, 0.35), 34)},
    // "Workers weren't the only ones who felt that way. Let's head out west, to Uncle Owen's letters." The farm door lights up.
    {a: cuts.west, b: dur, live: true, draw: (T) => renderDoorsWest(T, cuts.west, cardAt) + batonCard(T, cardAt, "Uncle Owen's Letters")},
  ];
  return {dur, shots};
};
window.HOLD.ch05 = {}; window.CARRY.ch05 = {};
