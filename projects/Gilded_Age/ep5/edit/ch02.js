// Chapter 2, "The Rules" (0:00 to 1:17). The rules of work in 1887: Michael Kelly in the family kitchen (Ep 4's ep4_kelly_flat: the
// series callback, "WATCH FROM EPISODE 1"); the refinery (Ep 1's refinery_tour, then lookdev/ep5_b.js ep5_refinery: Michael with a
// sack by the boiling vats); what was normal (Riis's Ludlow Street sweatshop 1890; Hine's mill girls 1908 and breaker boys 1911, both
// dated on screen as later than our story); immigrants landing (Harper's 1880); the gate (ep5_refinery shot B: the foreman points on
// "point at the gate"); the pay cut; one worker against a giant company, then all of them: the baton "Strength in Numbers".
const E5_EP3IMG = '../../../ep3/public/img/';   // Ep 3's archive, relative to IMG
/** One worker against a giant company; then all the workers, together (the Ep 5 explainer look: the dark board, teal, cream). */
function e5xNumbers(T, {a, all}) {
  const s = [x5Board(9)], scr = [];
  s.push(x5At(1180, 560, x5Pop(a, T) * 3.3, X5I.mill()));
  scr.push(tag(1000, 880, 'A GIANT COMPANY', x5In(a + 0.4, T)));
  s.push(x5At(530, 634, x5Pop(a + 0.2, T) * 1.8, xpPerson(0, 50, 84, X5.mute, {stroke: '#111'})));
  scr.push(tag(330, 300, 'ONE WORKER', x5In(a + 0.3, T)));
  // all of them: rows of workers pop in around the one, the front rows nearer and bigger
  const R = rng(57);
  for (let row = 0; row < 4; row++) for (let i = 0; i < 7; i++) {
    const x = 240 + i * 86 + (row % 2) * 34 + (R() - 0.5) * 12, y = 450 + row * 92, k = x5Pop(all + 0.05 * (row * 9 + i) * 0.5, T);
    if (row === 2 && i === 3) continue;   // the one worker's own place
    s.push(x5At(x, y, k * (1.25 + row * 0.12), xpPerson(0, 50, 76, row % 2 ? X5.mute : X5.mute2, {stroke: '#111'})));
  }
  s.push(x5Op(x5In(all + 1.0, T, 0.6), `<rect x="180" y="380" width="760" height="460" rx="18" fill="none" stroke="${X5.teal}" stroke-width="6"/>`));
  scr.push(x5Op(x5In(all + 0.4, T), x5Pen(190, 950, 'all the workers, together', 34, -2)));
  return x5Frame(T, s.join(''), scr.join(''));
}
EDITS.ch02 = () => {
  const ch = 'ch02_the_rules', w = (word, n) => wordAt(ch, word, n), L = (word, near) => lWord(ch, word, near);
  const c = {
    simple: w('simple.'), michael: w('Michael'), episode: w('Episode'), its: w("It's"), twelve: w('twelve'), six: w('six'), sugarRef: w('refinery,'),
    hauls: w('hauls'), wild: w('wild'), normal: w('normal.'), long: w('Long'), pay: w('Pay'), machines: w('Machines'), help: w('help'),
    y1900: w('1900,'), one: L('one', 46.6), most: w('Most'), easy: w('easy'), hundreds: w('hundreds'), so: w('So'),
    point: w('point'), plenty: w('Plenty'), january: w('January,'), cut: L('cut', 66.4), again: w('Again.'), all: w('all'), strength: w('strength'),
  };
  const cardAt = c.strength, dur = cardAt + CARD_HOLD;
  const cuts = {kitchen: c.michael, tour: c.its, ref: c.hauls - 0.1, normal: c.wild - 0.25, kids: c.y1900 - 0.2, imm: c.most - 0.15, gate: c.so - 0.5,
    pay: c.january - 0.4, num: c.again + 2.1};
  const KF = remap([[cuts.kitchen, 0], [cuts.tour, 12.8]]);
  const TOUR = remap([[cuts.tour, 0], [cuts.ref, 10.4]]);
  const RA = remap([[cuts.ref, 0.8], [cuts.normal, 7.6]]);
  const RB = remap([[cuts.gate, 7.8], [c.point - 0.8, 9.6], [c.point, 10.0], [cuts.pay, 13.7]]);
  const TOUR2 = remap([[cuts.pay, 11.0], [cuts.num, 13.4]]);
  const P_ = (txt, x, y, o, size = 32, rot = -3) => lNote(txt, x, y, o, size, rot);
  const shots = [
    // "The rules of work in the Gilded Age were simple. The boss made them."
    {a: 0, b: cuts.kitchen, draw: (T) => push(T, 0, cuts.kitchen, 0.04) + `</div>` +
      op(fin(T, 0.4, 0.4), mono('the rules of work &middot; the gilded age', {x: 180, y: 360, size: 30, color: C.teal, ls: 6})) +
      slideUp(fin(T, c.simple - 0.2, 0.4), `<div class="tx" style="position:absolute;left:172px;top:420px;font-family:Abril;font-size:120px;line-height:1.05;color:${C.cream};text-shadow:0 8px 24px rgba(0,0,0,.6)">The boss made them.</div>`)},
    // "Take Michael Kelly. We've been following the Kelly family since Episode 1 of this series. If you haven't watched those episodes,
    //  go back and check them out. They'll make this one even better." The Kellys' kitchen (Ep 4), the callback note.
    {a: cuts.kitchen, b: cuts.tour, live: true, draw: (T) => renderE4KellyFlat(KF(T), {quiet: true}) +
      lTag('MICHAEL KELLY', 980, 300, lVis(T, c.michael + 0.1, cuts.tour + 0.3)) +
      (T > c.episode - 0.2 ? slideUp(fin(T, c.episode - 0.2, 0.3), tape('WATCH FROM EPISODE 1', {x: 1250, y: 120, size: 40, rot: -3, seed: 77})) : '') +
      op(lVis(T, c.episode + 1.6, cuts.tour + 0.2), `<div class="tx" style="position:absolute;left:172px;top:920px;display:flex;align-items:center;gap:12px;background:rgba(13,12,9,.85);padding:9px 16px">
        <div style="width:16px;height:16px;border-radius:50%;background:${C.coral}"></div>
        <div style="font-family:Mono;font-size:22px;letter-spacing:2px;color:${C.cream}">THE KELLYS ARE FICTIONAL &middot; WHAT HAPPENS TO THEM HAPPENED TO PEOPLE LIKE THEM</div></div>`)},
    // "It's 1887, in Brooklyn, New York. Michael is 23. He works twelve hours a day, six days a week, in a sugar refinery, a factory
    //  that turns raw sugar into the white sugar you buy at the store." Ep 1's refinery, the sugar's path (its own labels dropped).
    {a: cuts.tour, b: cuts.ref, live: true, draw: (T) => lQuiet(() => renderRefinery(TOUR(T))) +
      lTag('BROOKLYN, NEW YORK · 1887', 172, 124, lVis(T, cuts.tour + 0.2, c.twelve + 0.3)) +
      lTag('12 HOURS A DAY · 6 DAYS A WEEK', 172, 124, lVis(T, c.twelve + 0.3, cuts.ref + 0.3)) +
      P_('raw sugar in, white sugar out', 1000, 960, lVis(T, c.sugarRef + 0.9, cuts.ref + 0.2), 30)},
    // "He hauls heavy sacks next to vats of boiling sugar, in heat that could make a man collapse."
    {a: cuts.ref, b: cuts.normal, live: true, draw: (T) => lQuiet(() => renderE5Refinery(RA(T)))},
    // "And here's the wild part: that was normal. Long hours. Pay the company could cut whenever it wanted. Machines with no safety
    //  guards, and no help if you got hurt. Even kids:" Riis's sweatshop (1890), Hine's mill girls (1908: later than our story).
    {a: cuts.normal, b: cuts.kids, draw: (T) => push(T, cuts.normal, cuts.kids, 0.03) +
      printCard('a_work_conditions/ludlow_street_sweaters_shop_riis_1890_commons.jpg', {x: 180, y: 190, w: 700, ar: 0.75, rot: -1.5, o: fin(T, cuts.normal, 0.45), T,
        caption: 'Jacob Riis &middot; a Ludlow Street sweatshop &middot; 1890'}) +
      printCard('a_work_conditions/girls_warping_machines_loray_mill_hine_LATE_1908_loc.jpg', {x: 1010, y: 220, w: 720, ar: 0.70, rot: 1.5, o: fin(T, c.machines - 0.3, 0.45), T,
        caption: 'Lewis Hine &middot; Gastonia, N.C. &middot; photographed 1908'}) + `</div>` +
      (T > c.normal - 0.1 ? slideUp(fin(T, c.normal - 0.1, 0.25), tape('THAT WAS NORMAL.', {x: 176, y: 106, size: 50, rot: -2, seed: 61})) : '') +
      P_('long hours', 190, 880, fin(T, c.long), 30) + P_('pay cut any time', 190, 966, fin(T, c.pay), 30) +
      P_('no safety guards', 1020, 880, fin(T, c.machines), 30) + P_('no help if you got hurt', 1020, 966, fin(T, c.help), 30)},
    // "by 1900, about one in six American kids between ten and fifteen had a job." Hine's breaker boys (1911: dated on screen).
    {a: cuts.kids, b: cuts.imm, draw: (T) => push(T, cuts.kids, cuts.imm, 0.03) +
      printCard('a_work_conditions/breaker_boys_hine_LATE_1911_loc.jpg', {x: 180, y: 170, w: 900, ar: 0.716, rot: -1, o: fin(T, cuts.kids, 0.45), T,
        caption: 'Lewis Hine &middot; breaker boys &middot; photographed 1911, later than our story'}) + `</div>` +
      bigFig('1 in 6', {x: 1130, y: 300, w: 640, size: 170, o: fin(T, c.one, 0.35)}) +
      today('american kids, 10 to 15,<br>had a job &middot; 1900', {x: 1130, y: 500, w: 640, o: fin(T, c.one + 0.3, 0.35), size: 28})},
    // "Most workers were unskilled, and easy to replace. Every year, hundreds of thousands of new immigrants arrived looking for work."
    {a: cuts.imm, b: cuts.gate, draw: (T) => push(T, cuts.imm, cuts.gate, 0.035) +
      printCard(E5_EP3IMG + 'c_arrival/immigrants_landing_castle_garden_shults_harpers_1880_loc90707732.jpg', {x: 400, y: 150, w: 1100, ar: 0.673, rot: -1, o: fin(T, cuts.imm, 0.45), T,
        caption: "A. B. Shults &middot; immigrants landing at Castle Garden &middot; Harper's Weekly, 1880"}) + `</div>` +
      P_('easy to replace', 1180, 178, fin(T, c.easy, 0.35), 32) +
      lTag('HUNDREDS OF THOUSANDS A YEAR', 420, 120, fin(T, c.hundreds, 0.35))},
    // "So if Michael complained, the foreman would just point at the gate. Plenty of guys out there want your job." ep5_refinery shot B.
    {a: cuts.gate, b: cuts.pay, live: true, draw: (T) => lQuiet(() => renderE5Refinery(RB(T))) + P_('waiting for work', 1240, 900, lVis(T, c.plenty - 0.2, cuts.pay + 0.3), 30)},
    // "And that January, the refinery cut the men's pay. Again." Michael at his machines (Ep 1's refinery).
    {a: cuts.pay, b: cuts.num, live: true, draw: (T) => lQuiet(() => renderRefinery(TOUR2(T))) + dimBy(0.3 * fin(T, c.cut - 0.3, 0.4)) +
      lTag('JANUARY 1887', 172, 124, fin(T, c.january, 0.3)) +
      (T > c.cut ? slideUp(fin(T, c.cut, 0.18), tape('PAY CUT', {x: 700, y: 380, size: 110, rot: -3, seed: 91})) : '') +
      P_('again.', 1180, 600, fin(T, c.again - 0.35, 0.3), 46, -6)},
    // "One worker against a giant company had no chance. But all the workers, together? There was strength in numbers."
    {a: cuts.num, b: dur, draw: (T) => e5xNumbers(T, {a: cuts.num, all: c.all - 0.1}) + batonCard(T, cardAt, 'Strength in Numbers')},
  ];
  return {dur, shots};
};
window.HOLD.ch02 = {}; window.CARRY.ch02 = {};
