// Chapter 1, "The Man in the Good Coat" (cold open, 0:00 to 1:36). January 1887, 3 a.m., Williamsburg: the model at night dives to
// the burning tenement two doors from the Kellys; the drawn fire (lookdev/ep4.js ep4_fire) retimed to the voice: the families in the
// snow, the pumper at a gallop, the man in the good coat and his three men, the blanket and his line to Mrs. Doyle, the Doyles to his
// cab, his line to Michael on the stoop; the machines on the map; Tammany Hall; the books (forty chairs and three tables); the
// question; back up into the night model with the composite note; the baton "Bursting at the Seams" on its words, then the title.
//
// ep4_fire's poses are pure functions of its own clock (FT, E4_CAM at the top of its renderer), so FIRE below maps narration time to
// clip time (piecewise linear). The captain's mouth follows the voice: FT.talk1 / FT.talk2 are set from the words.json CAPTAIN words,
// mapped into clip time, so his lips move exactly on his words; his gestures are keyed to the same clip times.
EDITS.ch01 = () => {
  const ch = 'ch01_the_man_in_the_good_coat', W = window.WORDS[ch], w = (word, n) => wordAt(ch, word, n);
  const c = {
    bell: w('A', 1), engines: w('engines'), man: w('man', 1), name: w('name.'), doyle: w('Mrs.'), room: w('room', 2), clothes: w('clothes'), meal: w('meal.'),
    nott: w('Not'), michael: w('Michael'), youd: w("You'd"), that: w('That', 1), machines: w('Machines'), across: w('across'), once: w('once'),
    showing: w('showing'), num: w('179,729'), cents: w('cents.'), forty: w('forty'), three: w('three', 3), tables: w('tables.'), so: w('So'), were: lWord(ch, 'Were', 83),
    or: w('or'), bursting: w('bursting'),
  };
  const cardAt = c.bursting, dur = cardAt + CARD_HOLD;
  // ---- the fire, retimed: narration time -> ep4_fire's clock (beats in lookdev/ep4.js FT) ----
  const FIRE = remap([[c.bell, 1.4], [12.6, 7.4], [17.6, 15.4], [c.engines, 16.4], [22.2, 20.6], [24.4, 22.6], [28.8, 27.6], [c.doyle, 31.0],
    [32.92, 32.3], [35.6, 35.5], [38.38, 38.3], [50.3, 47.15], [c.youd, 51.8], [61.12, 57.9], [64.8, 61.7]]);
  // the captain's words as spans (a pause of 0.25 s or more closes his mouth), in clip time
  const capSpans = (t0, t1) => { const S = []; W.words.filter((x) => x.who === 'CAPTAIN' && x.s >= t0 && x.s < t1).forEach((x) => {
    const L = S[S.length - 1]; if (L && x.s - L[1] < 0.25) L[1] = x.e; else S.push([x.s, x.e]); }); return S.map(([a, b]) => [FIRE(a), FIRE(b)]); };
  FT.talk1 = capSpans(31, 39); FT.talk2 = capSpans(55, 62);
  const fire = (T) => renderE4Fire(FIRE(T), {quiet: true});
  const P_ = (txt, x, y, o, size = 32, rot = -3) => lNote(txt, x, y, o, size, rot);
  // ---- the cities with machines (big-city machines of the era: the 1870 list of cities over 100,000) ----
  const machineDots = E4_C1870.map(([nm, lon, lat], i) => [lon, lat, c.machines + 0.15 + i * 0.12]);
  const shots = [
    // 1. "January, 1887. Three o'clock in the morning. Williamsburg, Brooklyn." The model at night: down to the burning block.
    {a: 0, b: c.bell, live: true, draw: (T) => renderEp4NightDive(T, {tag: fin(T, 0.4, 0.4) * fout(T, c.bell - 0.45, 0.35)})},
    // 2. "A fire bell. Then shouting. A tenement two doors down from the Kelly family is burning. Families stand in the snow..."
    //    through the engines, the man in the good coat, his line to Mrs. Doyle, the Doyles to the cab ("By morning, they have a room,
    //    new clothes and a hot meal"), "Not tonight", Michael on his stoop, the captain's line to him, and he walks on
    //    ("That man worked for a political machine.").
    {a: c.bell, b: c.machines, cut: true, live: true, draw: (T) => fire(T) +
      P_('two doors down from the Kellys', 1080, 250, lVis(T, 9.5, 14.4), 30) +
      P_('a room', 140, 270, lVis(T, c.room, 50.0), 40) + P_('new clothes', 140, 380, lVis(T, c.clothes, 50.0), 40) + P_('a hot meal', 140, 490, lVis(T, c.meal, 50.2), 40) +
      lTag('A POLITICAL MACHINE', 130, 1000, lVis(T, c.that - 0.3, c.machines + 0.3))},
    // 3. "Machines like his ran cities all over America." The big cities light up on the map.
    {a: c.machines, b: c.across - 0.1, draw: (T) => svg(e4xUSCities(T, {dots: machineDots})) + lTag('BIG-CITY MACHINES', 130, 120, lVis(T, c.machines + 0.3, c.across + 0.5))},
    // 4. "And across the river, in New York, the most famous machine of all" Tammany Hall, 14th Street (photograph, about 1890).
    {a: c.across - 0.1, b: c.once - 0.1, draw: (T) => push(T, c.across, c.once, 0.05) +
      printCard('f_machine/tammany_hall_14th_street_photo_c1890_commons.jpg', {x: 640, y: 70, w: 640, ar: 1.296, rot: -1.5, o: fin(T, c.across - 0.1, 0.45), T}) + `</div>` +
      lTag('TAMMANY HALL · NEW YORK', 1320, 300, fin(T, c.across + 0.4)) +
      lSrc('Tammany Hall, 14th Street &middot; photograph, about 1890', fin(T, c.across + 0.2))},
    // 5. "once kept books showing 179,729 dollars and 60 cents. For forty chairs and three tables." The ledger: "THE BOOKS SHOWED"
    //    stamped on the page (ledger_stamp), the line in teal, the amount typed with the voice; the chairs and tables counted in.
    {a: c.once - 0.1, b: c.so, draw: (T) => push(T, c.once, c.so, 0.04) + e4xSvg(e4xLedger(T, {a: c.once - 0.1, stamp: c.once + 0.45, type0: c.num, type1: c.cents + 0.3, chairs: c.forty, tables: c.three})) + `</div>` +
      lSrc('Recorded in the Tweed Ring&rsquo;s accounts &middot; A. B. Paine, Th. Nast, 1904', fin(T, c.once + 0.8), {x: 100, y: 64})},
    // 6. "So which was it? Were these men helping the poor... or robbing them?" Up off the fire block into the night model, dimmed
    //    under the question. "To answer that, we have to start with the city itself. Because in the 1880s, American cities were
    //    bursting at the seams." The composite note; the baton card on "bursting".
    {a: c.so, b: dur, live: true, draw: (T) => { const q = fin(T, c.were - 0.3, 0.45) * fout(T, c.or + 2.55, 0.35);
      return renderEp4NightRise(T, c.so, dur) + dimBy(0.72 * fin(T, c.so, 0.6) * fout(T, c.or + 2.6, 0.8) + 0.25 * fin(T, c.or + 2.4, 0.8)) +
        op(fin(T, c.so + 0.1) * fout(T, c.or + 2.55, 0.35), mono('so which was it?', {x: 130, y: 300, size: 28, color: C.teal, ls: 6})) +
        slideUp(q, `<div class="tx" style="position:absolute;left:124px;top:350px;font-family:Abril;font-size:100px;line-height:1.08;color:${C.cream}">Were these men<br>helping the poor,</div>`) +
        (fin(T, c.or) > 0 ? slideUp(fin(T, c.or) * fout(T, c.or + 2.55, 0.35), tape('or robbing them?', {x: 120, y: 620, size: 96, rot: -2, seed: 41})) : '') +
        e4Composite(T, c.or + 2.6, cardAt - 0.05) + batonCard(T, cardAt, 'Bursting at the Seams'); }},
  ];
  return {dur, shots};
};
/** The composite note at the end of the cold open: a coral dot (the Kellys) and two lines on a dark band, centred low. */
function e4Composite(T, a, b) {
  const o = fin(T, a, 0.45) * fout(T, b - 0.35, 0.35); if (o <= 0.01) return '';
  return slideUp(o, `<div class="tx" style="position:absolute;left:240px;top:760px;width:1440px;background:rgba(13,12,9,.88);padding:26px 40px 28px;display:flex;gap:28px;align-items:flex-start">
    <div style="flex:none;width:26px;height:26px;border-radius:50%;background:${C.coral};margin-top:12px"></div>
    <div><div style="font-family:Inter;font-weight:800;font-size:46px;color:${C.cream};line-height:1.15">The Kellys are fictional.</div>
    <div style="font-family:Inter;font-weight:600;font-size:36px;color:${C.cream};line-height:1.3;margin-top:8px">Everything that happens to them really happened to people like them.</div></div></div>`, 24);
}
window.HOLD.ch01 = {}; window.CARRY.ch01 = {};
