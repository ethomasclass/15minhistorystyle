// Chapter 1, "Barges at Dawn" (cold open). Homestead, July 6, 1892, 4 a.m.: lookdev/ep5.js ep5_homestead_dawn cut to the voice
// (its shots re-ordered so each lands on its words: the barges in the fog, the whistle on "whistle", the town down the hill and the
// gate going over, the barges with the guards inside, the mill on the bank, the gangplank on "gangplank", the guards' rifles on "On the
// barges, rifles come up", the bank's on "On the bank, rifles come up too", the stare-down and the freeze after "Nobody knows who will
// fire first."); the freeze held under "the rules were stacked against ordinary people"; then ep5_doors_intro, each door lighting on
// "fought at work" / "teamed up on the farm" / "fought at the ballot box"; the question over the three doors; the baton "The Rules".
//
// ep5_homestead_dawn's poses are pure functions of its clock (HD in lookdev/ep5.js), so each shot maps narration time to clip time
// with remap(). No shot is fired on screen; nobody is hurt.
/** ep5_homestead_dawn's wide world (shot A) under any camera: the mill on the bank for "to take its own mill back". */
function e5HomesteadWide(tt, cam) {
  const c = cam2(cam), world = layerAt(c, 1, e5ShotA(tt, c, 0));
  const defs = e5Defs(tt, e4FireDefs() + grad('hdsky', [['0', '#060C10'], ['0.5', '#13212A'], ['0.8', '#2F4450'], ['1', '#4E6068']]) +
    `<linearGradient id="hddoor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.5"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>` +
    `<linearGradient id="hdbeam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFF0C8" stop-opacity="0.7"/><stop offset="1" stop-color="#FFF0C8" stop-opacity="0"/></linearGradient>` +
    `<filter id="hdbeamblur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="16"/></filter>`);
  return frame(defs, `<rect width="1920" height="1080" fill="#060C10"/>`, world, '', tt);
}
EDITS.ch01 = () => {
  const ch = 'ch01_barges_at_dawn', w = (word, n) => wordAt(ch, word, n), L = (word, near) => lWord(ch, word, near);
  const c = {
    whistle: w('whistle'), homestead: w('Homestead'), inside: w('Inside'), three: w('three'), priv: w('Private'), steel: w('steel', 2),
    gang: w('gangplank'), onBarges: L('On', 34.2), onBank: L('On', 36.5), nobody: w('Nobody'), first: w('first.'), inGA: L('In', 41.46),
    rules: L('rules', 44.2), so: w('So'), work: w('work.'), farm: w('farm.'), box: w('box.'), how: w('How'), why: w('why'), start: w('Start'),
  };
  const cardAt = c.start, dur = cardAt + CARD_HOLD;
  const H = (map, quiet = true) => (T) => renderE5Homestead(map(T), {quiet});
  const cuts = {b: c.whistle - 1.18, cc: c.homestead - 0.3, d: c.inside - 0.18, works: c.steel - 0.16, e: c.gang - 0.22, fr: c.nobody - 0.4, freeze: c.first + 0.46, doors: c.so};
  // ---- the clip, shot by shot (clip beats: HD in lookdev/ep5.js) ----
  const mA = remap([[0, 0], [cuts.b, 6.15]]);
  const mB = remap([[cuts.b, 6.2], [c.whistle, 6.8], [cuts.cc, 9.55]]);
  const mC = remap([[cuts.cc, 9.6], [cuts.d, 14.95]]);                         // the gate goes over at clip 12.2 (gate_clank, scene_mix.py)
  const mD = remap([[cuts.d, 15.0], [cuts.works, 16.75]]);                     // the barges loom; the guards stand with rifles upright
  const mE1 = remap([[cuts.e, 22.0], [c.onBarges, 22.9]]);                     // the gangplank starts down
  const mD2 = remap([[c.onBarges, 16.6], [c.onBank, 18.9]]);                   // the guards' rifles come up (clip 17.0 to 18.4)
  const mE2 = remap([[c.onBank, 22.9], [cuts.fr, 25.0]]);                      // the bank's rifles come up (23.0 to 24.5); the crowd goes still
  const mF = remap([[cuts.fr, 28.6], [cuts.freeze, 31.5], [c.so, 34.5]]);      // the stare-down; the freeze; the grade drains
  // ---- the doors (DI in lookdev/ep5_doors.js): each lights on its words ----
  // (the camera's moves between doors run at about 1x, so the door labels cross the frame edge as briefly as in the clip; the holds stretch)
  const f1_ = L('fought', 49.4), f2_ = L('fought', 52.7), tm = w('teamed');
  const mDI = remap([[c.so, 0], [f1_, 0.9], [f1_ + 0.5, 1.7], [tm, 2.5], [tm + 0.46, 2.9], [f2_ - 0.74, 3.3], [f2_, 4.1], [f2_ + 0.36, 4.5],
    [f2_ + 1.06, 4.8], [f2_ + 2.66, 6.5], [cardAt, 8.5], [dur, 10.2]]);
  // ---- text, shared by every shot so it never jumps at a cut ----
  const ov = (T) =>
    lTag('HOMESTEAD, PENNSYLVANIA · JULY 6, 1892 · 4 A.M.', 172, 124, lVis(T, 0.5, 7.4)) +
    lNote('about 300 armed men', 1010, 260, lVis(T, c.three - 0.1, c.priv + 1.6), 34) +
    lNote('private guards', 1010, 380, lVis(T, c.priv, cuts.e - 0.1), 34);
  const freezeText = (T) => op(fin(T, c.inGA, 0.4) * fout(T, c.so - 0.35, 0.35), mono('the gilded age &middot; the late 1800s', {x: 172, y: 300, size: 30, color: C.teal, ls: 6})) +
    slideUp(fin(T, c.rules - 0.25, 0.45) * fout(T, c.so - 0.3, 0.3), `<div class="tx" style="position:absolute;left:166px;top:356px;width:1300px;font-family:Abril;font-size:92px;line-height:1.08;color:${C.cream};text-shadow:0 8px 24px rgba(0,0,0,.7)">The rules were stacked against ordinary people.</div>`);
  const question = (T) => { const o1 = fin(T, c.how - 0.2, 0.4) * fout(T, cardAt - 0.05, 0.25), o2 = fin(T, c.why - 0.75, 0.4) * fout(T, cardAt - 0.05, 0.25);
    return dimBy(0.35 * Math.max(o1, o2)) + slideUp(o1, `<div class="tx" style="position:absolute;left:0;top:118px;width:1920px;text-align:center;font-family:Abril;font-size:70px;line-height:1;color:${C.cream};text-shadow:0 6px 20px rgba(0,0,0,.8)">How did ordinary Americans fight back?</div>`) +
      slideUp(o2, `<div class="tx" style="position:absolute;left:0;top:214px;width:1920px;text-align:center;font-family:Abril;font-size:70px;line-height:1;color:${C.orange};text-shadow:0 6px 20px rgba(0,0,0,.8)">And why did they keep losing?</div>`); };
  const shots = [
    // "July 6th, 1892. Four in the morning. Fog on a river near Pittsburgh... Two covered barges slide upstream... A lookout spots them."
    {a: 0, b: cuts.b, live: true, draw: (T) => H(mA)(T) + ov(T)},
    // "The steel mill's whistle screams," (the blast on "whistle": steam_whistle)
    {a: cuts.b, b: cuts.cc, cut: true, live: true, draw: (T) => H(mB)(T) + ov(T)},
    // "and the town of Homestead runs down to the river. Some carry lanterns. Some carry rifles." The gate goes over (gate_clank).
    {a: cuts.cc, b: cuts.d, cut: true, live: true, draw: (T) => H(mC)(T) + ov(T)},
    // "Inside the barges are about three hundred armed men. Not soldiers. Not police. Private guards, hired by a"
    {a: cuts.d, b: cuts.works, cut: true, live: true, draw: (T) => H(mD)(T) + ov(T)},
    // "steel company to take its own mill back from its own workers." The mill on the bank, a slow push along the works.
    {a: cuts.works, b: cuts.e, live: true, draw: (T) => { const u = ease(clamp01((T - cuts.works) / (cuts.e - cuts.works)));
      return e5HomesteadWide(2.0 + 0.6 * (T - cuts.works), {ux: lerp(1430, 1520, u), uy: lerp(470, 462, u), z: lerp(1.45, 1.56, u)}) + ov(T); }},
    // "The gangplank goes down." (the reverse angle: the bank, the plank lowering)
    {a: cuts.e, b: c.onBarges, cut: true, live: true, draw: (T) => H(mE1)(T) + ov(T)},
    // "On the barges, rifles come up."
    {a: c.onBarges, b: c.onBank, cut: true, live: true, draw: (T) => H(mD2)(T)},
    // "On the bank, rifles come up too."
    {a: c.onBank, b: cuts.fr, cut: true, live: true, draw: (T) => H(mE2)(T)},
    // "Nobody knows who will fire first." The stare-down; the freeze after "first."; held, pushing in slowly, under "In the Gilded Age, the
    // late 1800s, the rules were stacked against ordinary people. So they tried three ways to change them."
    {a: cuts.fr, b: c.so, cut: true, live: true, draw: (T) => { const k = 1 + 0.07 * ease(clamp01((T - cuts.freeze) / (c.so - cuts.freeze)));
      return `<div style="position:absolute;inset:0;transform:scale(${k.toFixed(4)});transform-origin:1010px 600px">${H(mF)(T)}</div>` +
        dimBy(0.5 * fin(T, c.inGA - 0.2, 0.6)) + freezeText(T); }},
    // "They fought at work. They teamed up on the farm. And they fought at the ballot box." The doors light one by one, then the wide;
    // "How did ordinary Americans fight back? And why did they keep losing?" over them; the baton "The Rules" on "Start".
    {a: c.so, b: dur, live: true, draw: (T) => renderDoorsIntro(mDI(T)) + question(T) + batonCard(T, cardAt, 'The Rules')},
  ];
  return {dur, shots};
};
window.HOLD.ch01 = {}; window.CARRY.ch01 = {};
