// Chapter 4, "Too Many, Too Fast" (1:29): too many people (a crowded street by Riis, the counts, "tenement"; Ep 3's tenement floor
// with one sink, plus the yard's toilet shed and the sewer to the river); one small child in seven; too many horses (the cold open's
// block by day, drawn: no photographs of the horses and manure exist; the counts over it); too many fires (the World Building fire,
// 1882, colour print, and Riis's crowded fire escape); Jacob Riis's book and photographs (framed, named, dated); Brooklyn's relief,
// 46,350 people in 1877 and none in 1878 ("Hard Coal for the Poor", Harper's 1874); the squirrel line as a printed clipping; and the
// man in the good coat stepping into the gap (the cold open's walk-in, ep4_fire). The baton "The Machine" slams in on "the machine".
EDITS.ch04 = () => {
  const ch = 'ch04_too_many_too_fast', W = window.WORDS[ch], w = (word, n) => wordAt(ch, word, n);
  const c = {
    by: w('By'), million: w('million', 1), t37: w('37,000'), tenements: w('tenements.'), often: w('Often'), sink: w('sink'), toilet: w('toilet'), sewage: w('sewage'),
    on: w('On'), child: w('child'), seven: w('seven'), died: w('died'), horses1: w('horses.', 1), t175: w('175,000'), three: w('three'), manure: w('manure'),
    every: w('Every'), watch: w('Watch'), hauled: w('hauled'), fifteen: w('fifteen'), dead: w('dead'), fires: w('fires.'), wooden: w('Wooden'), coal: w('coal', 1),
    oil: w('oil'), packed: w('packed'), reporter: w('reporter'), riis: w('Riis'), how: w('How'), his: w('His'), shocked: w('shocked'), even: w('even'),
    so: w('So'), notc: w('Not'), in1877: lWord(ch, 'In', 65.5), gave: w('gave'), coal2: w('coal', 2), t46: w('46,000'), in1878: lWord(ch, 'In', 71.6), stopped: w('stopped.'),
    completely: w('Completely.'), one: lWord(ch, 'One', 75.4), squirrel: w('squirrel'), suffer: w('suffer.'), into: lWord(ch, 'Into', 82.7), people: w('People'),
  };
  c.the = W.words.filter((x) => x.w.toLowerCase() === 'the').pop().s;   // "...called it the machine": the card lands on "the"
  const cardAt = c.the, dur = cardAt + CARD_HOLD;
  const P_ = (txt, x, y, o, size = 32, rot = -3) => lNote(txt, x, y, o, size, rot);
  const PLAN = remap([[c.often + 1.3, 3.0], [c.sink + 0.9, 4.9], [c.on - 0.1, 5.9]]);       // Ep 3's plan, kept before its gold flat (6.2)
  const WALKIN = remap([[c.into + 1.3, 25.4], [cardAt + 2.6, 28.2]]);                       // ep4_fire: the captain and his men walking in
  const shots = [
    // 1. "Too many people, first. By 1890, more than a million New Yorkers lived in about 37,000 tenements." Mulberry Bend (Riis,
    //    about 1890) and the counts; the vocab card.
    {a: 0, b: c.often + 1.3, draw: (T) => push(T, 0, c.often + 1.3, 0.05) +
      printCard('d_streets_filth/riis_mulberry_bend_c1890_commons.jpg', {x: 150, y: 90, w: 1100, ar: 0.753, rot: -1, o: fin(T, 0, 0.35), T}) + `</div>` +
      lSrc('Mulberry Bend, New York &middot; photograph by Jacob Riis, about 1890', fin(T, 0.2)) + lTag('TOO MANY PEOPLE', 130, 120, lVis(T, 0.3, c.by + 0.8)) +
      bigFig('1,000,000+', {x: 1150, y: 170, size: 104, w: 680, align: 'right', o: fin(T, c.million, 0.3)}) +
      op(fin(T, c.million + 0.2, 0.3), mono('New Yorkers in tenements', {x: 1290, y: 290, size: 26, color: C.cream, ls: 2})) +
      bigFig('37,000', {x: 1150, y: 360, size: 104, w: 680, align: 'right', o: fin(T, c.t37, 0.3)}) +
      op(fin(T, c.t37 + 0.2, 0.3), mono('tenement buildings, 1890', {x: 1320, y: 480, size: 26, color: C.cream, ls: 2})) +
      vocab(1020, 560, 'Tenement', 'A crowded apartment building|for poor families, often|with no running water inside.', fin(T, c.tenements - 0.25, 0.35))},
    // 2. "Often there was one sink for a whole floor, a toilet shed in the yard, and sewage running straight into the river."
    {a: c.often + 1.3, b: c.on - 0.1, draw: (T) => renderTenementPlan(PLAN(T)) + svg(e4xYard(T, {privy: c.toilet, sewer: c.sewage})) +
      lTag('TOILET SHED', 1640, 570, fin(T, c.toilet + 0.2, 0.3)) + lTag('TO THE RIVER', 150, 950, fin(T, c.sewage + 1.0, 0.3))},
    // 3. "On one Manhattan block, about one small child in seven died in a single year."
    {a: c.on - 0.1, b: c.horses1 - 0.6, draw: (T) => svg(e4xSeven(T, {a: c.on, died: c.died})) +
      bigFig('1 in 7', {x: 0, y: 160, size: 150, o: fin(T, c.seven, 0.3)}) +
      op(fin(T, c.seven + 0.3, 0.3), mono('small children on one Manhattan block, dead within a year', {x: 0, y: 860, size: 28, color: C.cream, ls: 2, extra: 'width:1920px;text-align:center'})) +
      lSrc('Figures from Jacob Riis, How the Other Half Lives, 1890', fin(T, c.on + 0.5))},
    // 4. "Too many horses. New York and Brooklyn had up to 175,000 of them, and together they left three to four million pounds of
    //    manure on the streets. Every day. Watch your step. In one year, New York hauled away nearly fifteen thousand dead horses."
    //    The cold open's block by day, traffic both ways, more dung on the cobbles; the counts over it.
    {a: c.horses1 - 0.6, b: c.fires - 1.1, live: true, draw: (T) => { const u = clamp01((T - c.horses1) / (c.fires - c.horses1));
      return renderE4HorseStreet(T, {cam: {z: lerp(1.0, 1.18, ease(u)), ux: lerp(1100, 1180, u), uy: lerp(560, 640, u)}, T, dung0: c.horses1, dung1: c.watch}) +
        lTag('TOO MANY HORSES', 130, 120, lVis(T, c.horses1 - 0.3, c.t175 + 1.8)) +
        bigFig('175,000', {x: 1080, y: 110, size: 120, w: 740, align: 'right', o: lVis(T, c.t175, c.hauled - 0.1)}) +
        op(lVis(T, c.t175 + 0.3, c.hauled - 0.1), mono('horses in New York and Brooklyn', {x: 1220, y: 245, size: 26, color: C.cream, ls: 2, extra: 'background:rgba(13,12,9,.6);padding:4px 10px'})) +
        bigFig('3 to 4 million lbs', {x: 120, y: 330, size: 92, w: 1100, align: 'left', o: lVis(T, c.three, c.hauled - 0.1)}) +
        op(lVis(T, c.manure, c.hauled - 0.1), mono('of manure on the streets', {x: 130, y: 440, size: 28, color: C.cream, ls: 2, extra: 'background:rgba(13,12,9,.6);padding:4px 10px'})) +
        P_('every day', 160, 560, lVis(T, c.every, c.hauled - 0.1), 46) + P_('watch your step', 1100, 760, lVis(T, c.watch, c.hauled + 1.6), 40) +
        bigFig('nearly 15,000', {x: 0, y: 330, size: 120, o: fin(T, c.fifteen - 0.2, 0.3)}) +
        op(fin(T, c.dead - 0.4, 0.3), mono('dead horses hauled away in one year', {x: 0, y: 470, size: 30, color: C.cream, ls: 2, extra: 'width:1920px;text-align:center'})); }},
    // 5. "And too many fires. Wooden stairs, coal stoves, oil lamps, all packed together." The World Building fire (January 1882,
    //    colour print, 1883); then Riis's fire escape heaped with a family's things (about 1890).
    {a: c.fires - 1.1, b: c.reporter - 0.1, draw: (T) => push(T, c.fires - 1.1, c.reporter, 0.04) +
      printCard('e_fire/new_york_world_building_fire_chromolithograph_1883_loc.jpg', {x: 130, y: 80, w: 900, ar: 0.786, rot: -1.2, o: fin(T, c.fires - 1.1, 0.4), T, caption: 'The World Building fire, New York, 1882 &middot; colour print, 1883'}) +
      printCard('e_fire/riis_tenement_fire_escape_as_extension_of_the_flat_c1890_loc.jpg', {x: 900, y: 270, w: 800, ar: 0.794, rot: 1.6, o: fin(T, c.wooden - 0.1, 0.4), T, caption: 'A fire escape used as part of the flat &middot; Jacob Riis, about 1890'}) + `</div>` +
      lTag('TOO MANY FIRES', 130, 120, fin(T, c.fires - 0.8, 0.3)) +
      P_('wooden stairs', 1240, 120, fin(T, c.wooden, 0.3), 28) + P_('coal stoves', 1240, 185, fin(T, c.coal, 0.3), 28) + P_('oil lamps', 1240, 250, fin(T, c.oil, 0.3), 28)},
    // 6. "A reporter named Jacob Riis photographed all of it for a famous 1890 book, How the Other Half Lives."
    {a: c.reporter - 0.1, b: c.his - 0.1, draw: (T) => push(T, c.reporter, c.his, 0.04) +
      printCard('d_streets_filth/riis_how_the_other_half_lives_cover_1890_commons.jpg', {x: 220, y: 110, w: 520, ar: 1.457, rot: -2, o: fin(T, c.reporter - 0.1, 0.4), T, caption: 'How the Other Half Lives &middot; Jacob Riis, 1890'}) +
      printCard('d_streets_filth/riis_baxter_street_alley_mulberry_bend_c1888_loc.jpg', {x: 980, y: 100, w: 640, ar: 1.264, rot: 1.4, o: fin(T, c.riis + 0.2, 0.4), T, caption: 'Baxter Street alley &middot; Jacob Riis, about 1888'}) + `</div>` +
      lTag('JACOB RIIS · REPORTER AND PHOTOGRAPHER', 130, 80, fin(T, c.riis, 0.3))},
    // 7. "His photos shocked readers into caring, even though his writing was full of unfair stereotypes about immigrants."
    {a: c.his - 0.1, b: c.so - 0.1, draw: (T) => push(T, c.his, c.so, 0.04) +
      printCard('d_streets_filth/riis_lodgers_bayard_street_tenement_1889_commons.jpg', {x: 150, y: 120, w: 900, ar: 0.767, rot: -1.2, o: fin(T, c.his - 0.1, 0.4), T, caption: 'Lodgers in a Bayard Street tenement &middot; Jacob Riis, 1889'}) +
      printCard('d_streets_filth/riis_bandits_roost_c1888_commons.jpg', {x: 1120, y: 200, w: 660, ar: 0.803, rot: 1.8, o: fin(T, c.shocked, 0.4), T, caption: 'Bandit&rsquo;s Roost &middot; Jacob Riis, about 1888'}) + `</div>` +
      P_('his photos: readers cared', 160, 985, fin(T, c.shocked, 0.3), 34) + P_('his words: unfair stereotypes', 960, 905, fin(T, c.even + 0.3, 0.3), 34)},
    // 8. "So who was supposed to help? Not the city government, not much. In 1877, Brooklyn gave coal or groceries to more than
    //    46,000 poor people. In 1878, it stopped. Completely." The bars (1877: 46,350; 1878: none) and Harper's "Hard Coal for the
    //    Poor" (1874) beside them.
    {a: c.so - 0.1, b: c.one - 0.1, draw: (T) => svg(e4xRelief(T, {a: c.so - 0.1, b77: c.in1877, b78: c.in1878, stop: c.stopped})) +
      lTag('SO WHO WAS SUPPOSED TO HELP?', 130, 120, lVis(T, c.so, c.in1877 + 0.2)) +
      op(fin(T, c.coal2 - 0.3, 0.4), printCard('f_machine/hard_coal_for_the_poor_1874_loc.jpg', {x: 1120, y: 300, w: 680, ar: 0.686, rot: 1.6, o: 1, T, caption: 'Hard Coal for the Poor &middot; Harper&rsquo;s Weekly, 1874'})) +
      lTag('NONE', 640, 760, fin(T, c.completely, 0.2))},
    // 9. "One magazine writer argued that poor families should save for winter like the squirrel does, and if they didn't, let them
    //    suffer." The words themselves, as a printed clipping (Popular Science Monthly, November 1888).
    {a: c.one - 0.1, b: c.into + 1.3, draw: (T) => desk() + e4Clipping(T, c.one) +
      P_('save for winter, like the squirrel', 160, 960, fin(T, c.squirrel, 0.3), 32)},
    // 10. "Into that gap stepped something new. People called it the machine." The man in the good coat walks in (the cold open).
    {a: c.into + 1.3, b: dur, live: true, draw: (T) => renderE4Fire(WALKIN(T), {quiet: true}) + batonCard(T, cardAt, 'The Machine')},
  ];
  return {dur, shots};
};
/** The squirrel line as a printed clipping on the desk (Popular Science Monthly, November 1888, "Altruism Economically Considered"). */
function e4Clipping(T, a) {
  const o = fin(T, a, 0.45), dy = (1 - ease(o)) * 60 + Math.sin(T * 0.7) * 2;
  return op(Math.min(1, o * 1.6), `<div class="tx" style="position:absolute;left:330px;top:${f1(150 + dy)}px;width:1260px;transform:rotate(-1.2deg);background:#E8E0CC;padding:46px 64px 40px;
      box-shadow:0 3px 2px rgba(0,0,0,.6),0 22px 30px rgba(0,0,0,.55);clip-path:${tornClip(912, 2.5)}">
    <div style="font-family:Mono;font-size:22px;letter-spacing:3px;color:#5A5040;text-transform:uppercase;border-bottom:2px solid #5A5040;padding-bottom:12px;margin-bottom:22px">Popular Science Monthly &middot; November 1888</div>
    <div style="font-family:Playfair;font-weight:900;font-size:56px;line-height:1.22;color:#1D1810">&hellip;if &ldquo;they are less sensible than the squirrel, they must in all fairness to themselves be allowed to suffer discomfiture in winter and be taught by bitter experience.&rdquo;</div>
    <div style="font-family:Mono;font-size:22px;letter-spacing:2px;color:#5A5040;margin-top:22px">&ldquo;ALTRUISM ECONOMICALLY CONSIDERED&rdquo;</div></div>`);
}
window.HOLD.ch04 = {}; window.CARRY.ch04 = {};
