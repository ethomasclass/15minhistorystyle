// Chapter 8, "Helper or Thief?" (85.3 s of narration), then the end screen. The scorecard, HELPER and THIEF filling with icons as
// they are read, and no verdict line (lookdev/ep4_explain_b.js renderScorecard); what the machine built (the Brooklyn Bridge and
// the elevated, 1890; Tweed's courthouse, 1893); reformers (Keppler, Puck 1884); the Pendleton Act and the civil service exam
// (renderCivil); election day 1887 (ep4_polls); the Kellys' kitchen in January, the coal in the cellar, Tommy's news and Michael's
// answer (ep4_kelly_flat_end); next time; thanks for watching. (The 20 s end screen follows: brand.js endscreen, assemble.sh.)
EDITS.ch08 = () => {
  const ch = 'ch08_helper_or_thief', W = window.WORDS[ch], L = (word, near) => lWord(ch, word, near);
  const dur = W.words[W.words.length - 1].e + 0.8;
  const c = {built: L('And', 17.66), parks: L('parks,', 19.1), court: L('courthouses.', 21.44), markup: L('At', 22.64), now: L('Now,', 24.16), reform: L('Reformers', 39.88),
    adapted: L('But', 53.2), lasted: L('lasted', 54.96), kellys: L('For', 56.9), january: L('It', 59.22), coal: L('coal', 60.64), mr: L('Mr.', 63.16), steady: L('Steady', 66.66), ive: L("I've", 68.28),
    job: L('job.', 68.72), he: L('He', 69.94), refinery: L('At', 70.9), again: L('Again.', 73.92), next: L('Next', 74.94), michael: L('Michael', 76.0), union: L('union.', 78.84),
    and: L('And', 79.6), thanks: L('Thanks', 81.8)};
  const ins = c.built - 0.1, sc2 = c.now - 0.1, puck = c.reform - 0.1, civ = 42.7, polls = 53.9, kit = c.kellys - 0.1, nt = c.next - 0.05, th = 82.3;
  const shots = [
    // 1. "Helper, first. When the city stopped giving coal, the machine gave coal. When a family was burned out, the machine got there
    //    first. It found jobs for people nobody else would hire. It helped immigrants become citizens, and in time, aldermen and mayors."
    {a: 0, b: ins, live: true, draw: (T) => renderScorecard(T, SC_CUE)},
    // 2. "And it built things: parks, sewers, bridges, courthouses. At a markup."
    {a: ins, b: sc2, cut: true, draw: (T) => kDesk(T, ins, sc2,
      kCrop('i_brooklyn/brooklyn_bridge_and_elevated_railways_from_brooklyn_1890_loc.jpg', {x: 110, y: 170, w: 900, size: [4000, 2063], crop: [0.04, 0.08, 0.5, 0.92], rot: -1.5, o: fin(T, ins + 0.05, 0.5), T}) +
      printCard('g_tweed/county_court_house_kings_handbook_1893_commons.jpg', {x: 1040, y: 330, w: 760, ar: 0.695, rot: 1.5, o: fin(T, c.court - 0.3, 0.5), T}), 0.04) +
      lTag('PARKS, SEWERS, BRIDGES, COURTHOUSES', 130, 120, lVis(T, ins + 0.3, sc2 + 0.3)) + lNote('at a markup', 1300, 290, lVis(T, c.markup - 0.1, sc2 + 0.3)) +
      lSrc('BROOKLYN BRIDGE AND ELEVATED, 1890 (LOC) · TWEED’S COURTHOUSE, KING’S HANDBOOK, 1893', lVis(T, ins + 0.2, sc2 + 0.4))},
    // 3. "Now, thief. It stole millions from the same taxpayers and renters it claimed to help. It bought votes and faked them. And none
    //    of those favors was really free. You paid with your vote, and the machine decided who got what."
    {a: sc2, b: puck, cut: true, live: true, draw: (T) => renderScorecard(T, SC_CUE)},
    // 4. "Reformers pushed back." Keppler, Puck, 1884: the work of reform.
    {a: puck, b: civ, cut: true, draw: (T) => kDesk(T, puck, civ, kCrop('j_reform/men_may_come_work_of_reform_puck_1884_loc.jpg', {x: 650, y: 40, w: 600, size: [2531, 4000], crop: [0.05, 0.03, 0.95, 0.66], rot: 1, o: fin(T, puck + 0.05, 0.4), T}), 0.05, 960, 400) +
      lTag('REFORMERS', 130, 120, lVis(T, puck + 0.15, civ + 0.4)) + lSrc('"THE WORK OF REFORM" · JOSEPH KEPPLER, PUCK, 1884 · LIBRARY OF CONGRESS', lVis(T, puck + 0.1, civ + 0.4))},
    // 5. "In 1883, a new federal law, the Pendleton Act, said some government jobs had to go to people who passed a test, not people who
    //    voted the right way. That's called civil service."
    {a: civ, b: polls, cut: true, live: true, draw: (T) => renderCivil(T, {...CV_CUE, in1883: civ})},
    // 6. "But the machines adapted, and lasted for decades." Election day, November 1887: the party's printed tickets at the polls.
    {a: polls, b: kit, cut: true, live: true, draw: (T) => kQ(() => renderE4Polls(remap([[polls, 0.4], [kit, 4.1]])(T))) +
      lTag('ELECTION DAY · NOVEMBER 1887', 130, 120, lVis(T, polls + 0.1, kit + 0.4)) + lNote('the machines lasted for decades', 130, 990, lVis(T, polls + 0.1, kit + 0.4))},
    // 7. "For the Kellys, it wasn't a debate. It was January, and the coal was already in the cellar." TOMMY: "Mr. Duffy says there's a
    //    city job for you, if you want it. Steady pay." MICHAEL: "I've got a job." "He did. At a refinery that had just cut the men's
    //    pay. Again." The kitchen: the bucket full; Tommy bursts in; Michael answers and turns back to the stacks.
    {a: kit, b: nt, cut: true, live: true, draw: (T) => kQ(() => renderE4KellyFlat(remap([[kit, 0], [c.mr - 0.1, 4.0], [c.steady + 0.5, 7.5], [c.ive, 8.3], [c.job + 0.3, 9.2], [nt, 16]])(T), {full: true})) +
      lTag('THE KELLYS’ KITCHEN · JANUARY 1887', 130, 120, lVis(T, kit + 0.1, c.coal + 0.3)) + lNote('the coal, already in the cellar', 130, 230, lVis(T, c.coal - 0.6, c.mr + 0.4)) +
      lNote('the refinery had just cut the men’s pay. Again.', 130, 230, lVis(T, c.refinery, nt + 0.4))},
    // 8. "Next time: Michael starts going to secret meetings, about a union. And his little brother won't like it."
    {a: nt, b: th, cut: true, draw: (T) => desk() + dimBy(0.1) +
      slideUp(fin(T, nt + 0.05), tape('NEXT TIME', {x: 140, y: 150, size: 96, rot: -2, seed: 811})) +
      op(fin(T, c.michael - 0.1), mono('michael kelly starts going to secret meetings...', {x: 160, y: 330, size: 30, color: C.teal, ls: 4})) +
      (T > c.union - 0.3 ? slideUp(fin(T, c.union - 0.3), tape('ABOUT A UNION', {x: 260, y: 470, size: 72, rot: -3, seed: 812})) : '') +
      (T > c.and - 0.2 ? slideUp(fin(T, c.and - 0.2), tape('HIS LITTLE BROTHER WON’T LIKE IT', {x: 380, y: 700, size: 72, rot: 2, seed: 813})) : '')},
    // 9. "Thanks for watching. Subscribe for more, and I'll see you next time."
    {a: th, b: dur, cut: true, draw: (T) => desk() + slideUp(fin(T, th), tape('THANKS FOR WATCHING', {x: 480, y: 420, size: 100, rot: -2, seed: 129}))},
  ];
  return {dur, shots};
};
window.HOLD.ch08 = {}; window.CARRY.ch08 = {};
