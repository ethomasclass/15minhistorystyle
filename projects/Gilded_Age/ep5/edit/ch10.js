// Chapter 10, "The Scorecard" (55.0 s of narration, then the end screen). ep5_doors_finale cut to the voice: the walk past the three
// closed doors with a FELL SHORT stamp on each "fell short"; the ideas rising from under the doors as cards, each readable on its
// words (eight-hour day, right to organize, income tax, senators elected by voters), "still wanted"; the Brooklyn Bridge on New
// Year's Day 1898 (ep5_bridge_1898: the brothers walk apart enough never to merge; Michael shakes his head on "didn't vote the same
// way"); the Kellys' line; back to the corridor for the pan to the fourth door, which opens on "Progressive Era"; the end line.
// ga_gilded_theme runs from the top and carries into the end screen (assemble.sh END_THEME_AT). Helpers q... in ch06.js.

EDITS.ch10 = () => {
  const ch = 'ch10_the_scorecard', L = (word, near) => lWord(ch, word, near);
  const c = {fell1: L('fell', 4.9), fell2: L('fell', 8.6), fell3: L('fell', 12.5), but: L('But', 13.7), eight: L('eight-hour', 16.0), right: L('right', 17.4), income: L('income', 18.9),
    senators: L('senators', 20.1), gilded: L('The', 22.2), more: L('more.', 24.5), newYear: L('New', 25.5), brooklyn: L('Brooklyn', 28.0), michael: L('Michael', 30.3),
    voters: L('voters', 33.4), they: L('They', 36.1), kellys: L('The', 38.1), never2: L('But', 40.1), and: L('And', 42.8), prog: L('Progressive', 48.5), end: L("That's", 49.9),
    thanks: L('Thanks', 52.2), way: L('way.', 54.8)};
  const dur = c.way + 0.9, cut = {bridge: c.newYear - 0.3, back: c.and + 0.3};
  // the doors (DF beats): a stamp on each "fell"; the cards readable on their words (each opens about 1.2 s after its start)
  const mF1 = remap([[0, 0], [3.0, 1.5], [c.fell1, DF.s1], [c.fell1 + 0.7, 2.6], [c.fell1 + 1.8, 4.2], [c.fell2, DF.s2], [c.fell2 + 0.7, 5.2], [c.fell2 + 1.8, 6.8], [c.fell3, DF.s3], [c.but + 0.2, 8.3], [c.but + 1.1, 9.6], [c.eight - 1.0, DF.c1], [c.right - 1.2, DF.c2],
    [c.income - 1.2, DF.c3], [c.senators - 1.2, DF.c4], [c.senators - 0.8, 13.9], [cut.bridge + 0.5, 16.6]]);
  // the corridor again: the pan to the fourth door, which swings open on "Progressive Era"; the cards turn to light and stream in
  const mF2 = remap([[cut.back, 16.6], [c.prog - 3.2, 16.8], [c.prog - 1.2, DF.prog], [c.prog, DF.open4], [c.prog + 2.4, 22.8], [dur, 24.0]]);
  // the bridge: the head shake (clip 7.6) on "They still didn't vote the same way"
  const mBJ = remap([[cut.bridge, 0], [c.they + 0.5, 7.6], [cut.back + 0.5, 13.5]]);
  const endLine = (T) => op(fin(T, Math.max(c.end, 51.4), 0.5) * fout(T, dur - 0.6, 0.5), `<div class="tx" style="position:absolute;left:0;top:128px;width:1920px;text-align:center;font-family:Abril;font-size:62px;color:${C.cream};text-shadow:0 6px 20px rgba(0,0,0,.85)">The end of our story of the Gilded Age.</div>`) +
    op(fin(T, c.thanks, 0.5) * fout(T, dur - 0.6, 0.5), `<div class="tx" style="position:absolute;left:0;top:226px;width:1920px;text-align:center;font-family:Mono;font-size:30px;letter-spacing:5px;color:${C.teal}">THANKS FOR WATCHING</div>`);
  const shots = [
    // "Let's go back to those three doors. Fighting at work: fought back, fell short. Teaming up on the farm: fought back, fell short.
    //  Fighting at the ballot box: fought back, fell short. But their ideas didn't go away: an eight-hour workday, the right to join a
    //  union, an income tax, senators elected by the people. The Gilded Age left Americans wanting more."
    {a: 0, b: cut.bridge, live: true, draw: (T) => renderDoorsFinale(mF1(T))},
    // "New Year's Day, 1898. Brooklyn became part of New York City. Michael and Tommy walked across the Brooklyn Bridge together, voters
    //  in the same city at last. They still didn't vote the same way. The Kellys never got the gold. But they never stopped fighting for their share."
    {a: cut.bridge, b: cut.back, cut: true, live: true, draw: (T) => renderE5Bridge(mBJ(T)) +
      op(fout(T, c.voters - 0.4, 0.3), qTapes(T, [[c.brooklyn, 'BROOKLYN JOINS NEW YORK CITY', 900, 150, 52, -2]])) +
      lNote('same city, at last', 1180, 440, lVis(T, c.voters - 0.3, c.they), 34, -3) + lNote("still didn't vote the same way", 1000, 440, lVis(T, c.they + 0.1, c.kellys + 0.9), 34, -3) +
      op(fin(T, c.kellys, 0.5) * fout(T, cut.back - 0.3, 0.3), dimBy(0.3) + `<div class="tx" style="position:absolute;left:180px;top:150px;width:1560px;font-family:Abril;font-size:64px;line-height:1.15;color:${C.cream};text-shadow:0 6px 20px rgba(0,0,0,.85)">The Kellys never got the gold.</div>`) +
      op(fin(T, c.never2, 0.5) * fout(T, cut.back - 0.3, 0.3), `<div class="tx" style="position:absolute;left:180px;top:245px;width:1560px;font-family:Abril;font-size:64px;line-height:1.15;color:${C.cream};text-shadow:0 6px 20px rgba(0,0,0,.85)">But they never stopped fighting for their share.</div>`)},
    // "And in the years ahead, Americans would finally start winning some of these fights. That time is called the Progressive Era.
    //  That's the end of our story of the Gilded Age. Thanks for watching, and for sticking with the Kellys all the way."
    {a: cut.back, b: dur, cut: true, live: true, draw: (T) => renderDoorsFinale(mF2(T)) +
      vocab(180, 690, 'Progressive Era', 'About 1900 to 1920: Americans|start winning some of these fights.', fin(T, c.prog, 0.4) * fout(T, c.thanks + 0.6, 0.4)) + endLine(T)},
  ];
  return {dur, shots, fadeOut: 0.6};
};
window.HOLD.ch10 = {}; window.CARRY.ch10 = {};
