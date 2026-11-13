// Chapter 9, "New Neighbors" (107.3 s of narration), then the end screen. Spring 1886 on the 3D model, across the East River
// to the Kellys' building (ep3_map_move); the trunk on the stoop, Michael home from the refinery and taking the other end, Ma at
// her window (lookdev/ep3_late.js renderMovingInB, Episode 1's tenement and walk cycle); "More of them."; that evening, the
// knock and the whole conversation at Ma's door, the acting driven by who speaks (renderKnockB); the question; the help (the chain
// of letters, tickets and jobs, ep3_chain) and the walls (Keppler's shadows); Ma, a little of both; the Statue dedicated (Moran,
// 1886); the letter with the ticket folded inside (ep3_letter); next time; thanks for watching.
EDITS.ch09 = () => {
  const ch = 'ch09_new_neighbors', W = window.WORDS[ch], L = (word, near) => lWord(ch, word, near);
  const dur = W.words[W.words.length - 1].e + 0.8;
  const c = {michael: L('Michael', 16.6), grabbed: L('grabbed', 22.04), upstairs: L('Upstairs,', 23.56), folded: L('folded.', 26.66), more: L('More', 28.08),
    evening: L('That', 29.68), knock: L('knock', 30.86), mrs: L('Mrs.', 32.26), translate: L('translate.', 35.0), my: L('My', 36.7), where: L('where', 38.38),
    sister: L('sister.', 42.64), knew: L('knew', 44.44), shed: L("She'd", 46.06), nora: L('Nora.', 47.6), tell: L('Tell', 49.14), take: L('take', 49.76),
    saturday: L('Saturday.', 51.02), sab: L('Saturday', 52.7), sabbath: L('Sabbath.', 53.58), sunday: L('Sunday,', 55.36), and: L('And', 56.52), when: L('When', 57.9),
    nobody: L('nobody', 59.38), dock: L('dock.', 61.22), nobody2: L('Nobody.', 62.02), so: L('So,', 63.42), and2: L('and', 66.42), mostly: L('Mostly,', 68.54),
    letter: L('letter.', 71.24), ticket: L('ticket.', 72.06), job: L('job', 73.0), neighbor: L('neighbor', 74.56), walls: L('walls', 76.14), some: L('some', 78.32),
    sometimes: L('sometimes,', 81.02), both: L('both.', 84.74), little: L('little', 84.34), fall: L('fall,', 85.92), statue: L('Statue', 86.66), rab: L('Rabinowitzes', 90.62),
    folded2: L('folded', 93.12), next: L('Next', 94.54), jobN: L('job,', 97.32), coal: L('coal,', 98.58), lawyer: L('lawyer.', 99.6), all: L('All', 100.48), vote: L('vote.', 102.32),
    thanks: L('Thanks', 103.06)};
  // ---- the knock: beats in narration time (the knock and the door are in the scene sound, fx.wav: taps at 31.38, 31.58,
  // 31.78; the door's creak peaks about 33.9) ----
  const beats = {hall: 29.0, knock: [31.38, 31.58, 31.78], stepBack: 32.0, rise: 31.6, cross: 32.1, crossDur: 1.45, open: 33.65, fold: 34.6,
    recall: c.knew - 0.1, unfold: c.tell - 0.5, nod1: c.sunday, nod2: c.nobody2 + 0.1, wag0: c.when + 0.1, wag1: c.dock + 0.4,
    sister: c.sister - 0.35, soreNod: c.nobody2 + 0.5, sabbath0: c.sab - 0.1, sabbath1: c.sabbath + 0.5};
  const SP = lSpeak(ch);
  const talk = (who, T) => SP.some((p) => p.who === who && T > p.s - 0.12 && T < p.e + 0.3);
  const mouth = (who, T) => W.words.some((x) => x.who === who && T > x.s && T < x.e - 0.03) && Math.sin(T * 23) > -0.3;
  // Rivke turns to her mother: on "My mother asks" (she relays it), and between Ma's lines to pass them on
  const rivkeTurn = (T) => (T > c.my - 0.1 && T < c.my + 0.9) || (T > c.saturday + 0.6 && T < c.sab - 0.25) || (T > c.nobody2 + 0.7 && T < 63.4);
  // hands [T, shoulder, elbow]: Ma (unfolded from "Tell her"), Rivke (from the step back)
  const maArm = [[c.tell - 0.4, 176, 180], [c.tell, 150, 120], [c.take - 0.1, 150, 120], [c.take + 0.15, 196, 40], [c.saturday - 0.25, 196, 40], [c.saturday, 128, 22],
    [c.saturday + 0.8, 130, 24], [c.saturday + 1.3, 176, 180], [c.sunday - 0.2, 176, 180], [c.sunday + 0.1, 150, 100], [c.sunday + 0.6, 160, 130], [c.and - 0.1, 160, 130],
    [c.and + 0.2, 126, 26], [c.when - 0.1, 128, 30], [c.when + 0.2, 132, 40], [c.dock + 0.3, 132, 40], [c.nobody2 - 0.15, 118, 50], [c.nobody2 + 0.15, 152, 108], [c.nobody2 + 0.9, 160, 130]];
  const rivkeArm = [[c.my - 0.3, 176, 180], [c.my + 0.1, 160, 128], [c.my + 0.8, 172, 170], [c.where - 0.1, 172, 170], [c.where + 0.2, 146, 96], [41.3, 150, 100],
    [41.8, 176, 180], [c.sab - 0.2, 176, 180], [c.sab + 0.2, 160, 120], [c.sabbath + 0.6, 162, 122], [c.sabbath + 1.1, 176, 180]];
  // the camera: wide while they come and knock, then a box-filtered drift toward whoever is talking (no cuts, no stops)
  const camTarget = (T) => {
    if (T < 32.8) return [0.98 + 0.06 * smooth(29.2, 32.8, T), 600, 604];
    if (T < 35.6) return [1.18, 440, 636];
    if (talk('RIVKE', T)) return [1.36, 360, 650];
    if (talk('MA', T)) return [1.36, 470, 640];
    if (T > c.knew - 0.2 && T < c.tell - 0.4) return [1.5, 560, 600];
    return [1.24, 420, 640];
  };
  const kCam = (T) => { let z = 0, x = 0, y = 0; const n = 24; for (let i = 0; i < n; i++) { const [a, b, d] = camTarget(T - 1.2 * i / n); z += Math.log(a); x += b; y += d; } return {z: Math.exp(z / n), ux: x / n, uy: y / n}; };
  const knock = (T) => renderKnockB(T, {beats, cam: kCam, talk, mouth, rivkeTurn, maArm, rivkeArm});
  // ---- moving in: clip time t = T - 19.85 (Michael's hands close on the trunk at 22.8, "the other end"; the trunk comes up level
  // by the thump in the scene sound, 23.2); the camera rises to Ma's window for "Upstairs, Ma watched" and closes on her ----
  const MV = [[16.45, 2.1, 1400, 740], [21.6, 2.3, 1260, 755], [23.3, 2.2, 1150, 745], [24.7, 1.3, 1000, 640], [26.0, 1.16, 940, 566],
    [27.3, 4.6, MI.win.x + 20, MI.win.y + 46], [29.6, 5.0, MI.win.x + 20, MI.win.y + 46]].map(([t, z, x, y]) => [t, Math.log(z), x, y]);
  const mvCam = (T) => { const [lz, ux, uy] = emInterp(MV, T); return {z: Math.exp(lz), ux, uy}; };
  const movingIn = (T) => renderMovingInB(T, {t0: 19.85, cam: mvCam, mSteps: 16, mStart: -2.6, carT: 17.4, look: (T2) => smooth(c.upstairs, c.upstairs + 1.0, T2),
    maTilt: (T2) => (T2 > c.more - 0.1 && T2 < c.more + 0.9 ? -5 * Math.sin((T2 - c.more) * 13) : 0)});
  const shots = [
    // 1. "The new neighbors came in the spring of 1886. Yankel had found steadier work, at a shop across the East River. A few Jewish
    //    families were starting to move to Williamsburg, for more space and cheaper rent. Most wouldn't come for another twenty
    //    years." ep3_map_move (its clock is this chapter's).
    {a: 0, b: c.michael - 0.15, live: true, draw: (T) => renderMove(T)},
    // 2. "Michael Kelly was coming home from the refinery when he saw them on the stoop, wrestling a trunk. He grabbed the other end.
    //    Upstairs, Ma watched from the window, arms folded. MA: More of them."
    {a: c.michael - 0.15, b: c.evening - 0.25, cut: true, live: true, draw: (T) => movingIn(T) +
      lTag("THE KELLYS' STREET · BROOKLYN · SPRING 1886", 130, 120, lVis(T, c.michael, 22.4)) +
      lNote('Michael Kelly, home from the refinery', 130, 230, lVis(T, c.michael + 0.3, 20.9)) +
      lNote('he grabs the other end', 1000, 230, lVis(T, c.grabbed - 0.2, 24.9)) +
      lTag('COMPOSITE CHARACTERS', 1300, 990, lVis(T, 21.0, 24.6)) +
      lNote('Ma, upstairs', 1100, 230, lVis(T, c.upstairs + 1.2, c.evening - 0.2))},
    // 3. "That evening, there was a knock at her door. Mrs. Rabinowitz, and Rivke beside her to translate. RIVKE: My mother asks...
    //    For her sister. Ma knew exactly where. She'd done it herself, for Nora. MA: Tell her I'll take her. Saturday. RIVKE: Saturday
    //    is our Sabbath. MA: Sunday, then. And tell her this. When the sister lands, nobody talks to anybody at that dock. Nobody."
    {a: c.evening - 0.25, b: c.so - 0.1, cut: true, live: true, draw: (T) => knock(T) +
      lTag("THE KELLYS' FLAT · THAT EVENING", 130, 120, lVis(T, c.evening, c.mrs + 0.6)) +
      lNote('Rivke translates', 1040, 230, lVis(T, c.mrs + 0.6, c.my + 0.4)) +
      lTag('COMPOSITE CHARACTERS', 1320, 990, lVis(T, c.my, c.sister)) +
      lNote('she had done it herself, for Nora', 900, 230, lVis(T, c.shed - 0.2, c.tell + 0.6)) +
      lNote('Saturday: their Sabbath', 1040, 990, lVis(T, c.sabbath - 0.3, c.sunday + 0.6))},
    // 4. "So, who helped newcomers make it in America, and who tried to keep them out?" The question, over the doorway.
    {a: c.so - 0.1, b: c.mostly + 0.45, cut: true, live: true, draw: (T) => knock(c.so) + dimBy(0.74 * fin(T, c.so, 0.6)) +
      op(fin(T, c.so + 0.1), mono('the question', {x: 130, y: 300, size: 28, color: C.teal, ls: 6})) +
      slideUp(fin(T, c.so + 0.4, 0.45), `<div class="tx" style="position:absolute;left:124px;top:350px;font-family:Abril;font-size:96px;line-height:1.08;color:${C.cream}">Who helped newcomers<br>make it in America,</div>`) +
      (T > c.and2 - 0.35 ? slideUp(fin(T, c.and2 - 0.35), tape('and who tried to keep them out?', {x: 120, y: 610, size: 84, rot: -2, seed: 31})) : '')},
    // 5. "Mostly, newcomers helped each other. A letter. A ticket. A job through a friend. A neighbor at the door." The chain of
    //    letters, tickets and jobs (ep3_chain, complete), the answers on tape.
    {a: c.mostly + 0.45, b: c.walls + 0.75, cut: true, draw: (T) => lQuiet(() => renderChain(14.6)) + dimBy(0.45) +
      slideUp(fin(T, c.mostly + 0.45), tape('NEWCOMERS HELPED EACH OTHER', {x: 140, y: 120, size: 76, rot: -2, seed: 901})) +
      (T > c.letter - 0.1 ? slideUp(fin(T, c.letter - 0.1), tape('A LETTER', {x: 190, y: 330, size: 60, rot: -3, seed: 902})) : '') +
      (T > c.ticket - 0.1 ? slideUp(fin(T, c.ticket - 0.1), tape('A TICKET', {x: 600, y: 470, size: 60, rot: 2, seed: 903})) : '') +
      (T > c.job - 0.1 ? slideUp(fin(T, c.job - 0.1), tape('A JOB THROUGH A FRIEND', {x: 1040, y: 360, size: 60, rot: -2, seed: 904})) : '') +
      (T > c.neighbor - 0.45 ? slideUp(fin(T, c.neighbor - 0.45), tape('A NEIGHBOR AT THE DOOR', {x: 520, y: 700, size: 64, rot: -1, seed: 905})) : '')},
    // 6. "The walls came from Americans, and some of them had once been newcomers too." Keppler's shadows.
    {a: c.walls + 0.75, b: c.sometimes - 0.3, cut: true, draw: (T) => renderLookingBackward(remap([[c.walls + 0.75, 9.8], [c.sometimes - 0.3, 13.2]])(T)) +
      (T > c.walls + 0.75 ? slideUp(fin(T, c.walls + 0.75), tape('THE WALLS', {x: 1300, y: 860, size: 64, rot: -2, seed: 906})) : '')},
    // 7. "And sometimes, like Ma Kelly, the same person did a little of both." Ma at her window, arms folded; Ma at her door, nodding.
    {a: c.sometimes - 0.3, b: c.statue + 0.15, cut: true, live: true, draw: (T) => twoScenes(renderMovingInB(28.6 + 0.2 * (T - c.sometimes), {t0: 19.85, cam: () => ({z: 4.6, ux: MI.win.x + 119, uy: MI.win.y + 40}), mSteps: 16, mStart: -2.6, carT: -99, look: () => 1}),
      knock(c.sunday + 0.2 + 0.25 * (T - c.sometimes))) +
      lNote('"More of them."', 140, 230, lVis(T, c.sometimes, c.statue + 0.3)) + lNote('"Sunday, then."', 1100, 230, lVis(T, c.sometimes + 0.6, c.statue + 0.3)) +
      (T > c.little - 0.2 ? slideUp(fin(T, c.little - 0.2), tape('A LITTLE OF BOTH', {x: 640, y: 820, size: 76, rot: -2, seed: 907})) : '')},
    // 8. "That fall, the Statue of Liberty was finally dedicated in New York Harbor." Moran's painting of the day, 1886.
    {a: c.statue + 0.15, b: c.rab - 0.25, cut: true, draw: (T) => lPrint(T, c.statue + 0.15, c.rab, 'c_arrival/moran_unveiling_statue_of_liberty_1886_commons.jpg', {x: 610, y: 36, w: 700, rot: 1, z: 0.04, oy: 300}) +
      lTag('OCTOBER 28, 1886', 130, 120, lVis(T, c.statue + 0.2, c.rab)) +
      lSrc('THE UNVEILING OF THE STATUE OF LIBERTY · EDWARD MORAN, 1886 · WIKIMEDIA COMMONS', lVis(T, c.statue + 0.2, c.rab))},
    // 9. "And the Rabinowitzes sent a letter, with a ticket folded inside." The letter at the kitchen table (ep3_letter), the
    //    ticket folded in.
    {a: c.rab - 0.25, b: c.next + 0.45, cut: true, live: true, draw: (T) => lQuiet(() => renderLetter(remap([[c.rab - 0.25, 0.4], [c.folded2 - 0.5, 3.3], [c.next + 0.45, 4.7]])(T))) +
      lTag('THE RABINOWITZES · BROOKLYN · FALL 1886', 40, 1040, lVis(T, c.rab, c.next + 0.6)) +
      lNote('a ticket, folded inside', 1000, 200, lVis(T, c.rab + 1.0, c.next + 0.6))},
    // 10. "Next time: Michael meets a man who can get you a job, a ton of coal, or a lawyer. All he wants in return is your vote."
    {a: c.next + 0.45, b: c.thanks + 0.25, cut: true, draw: (T) => desk() + dimBy(0.1) +
      slideUp(fin(T, c.next + 0.45), tape('NEXT TIME', {x: 140, y: 150, size: 96, rot: -2, seed: 911})) +
      op(fin(T, c.next + 0.9), mono('michael kelly meets a man who can get you...', {x: 160, y: 330, size: 30, color: C.teal, ls: 4})) +
      (T > c.jobN - 0.15 ? slideUp(fin(T, c.jobN - 0.15), tape('A JOB', {x: 220, y: 450, size: 64, rot: -3, seed: 912})) : '') +
      (T > c.coal - 0.4 ? slideUp(fin(T, c.coal - 0.4), tape('A TON OF COAL', {x: 650, y: 520, size: 64, rot: 2, seed: 913})) : '') +
      (T > c.lawyer - 0.15 ? slideUp(fin(T, c.lawyer - 0.15), tape('A LAWYER', {x: 1260, y: 450, size: 64, rot: -2, seed: 914})) : '') +
      (T > c.all - 0.2 ? slideUp(fin(T, c.all - 0.2), tape('ALL HE WANTS: YOUR VOTE', {x: 420, y: 760, size: 84, rot: -2, seed: 915})) : '')},
    // 11. "Thanks for watching. Subscribe for more, and I'll see you next time." (The 20 s end screen follows: brand.js endscreen.)
    {a: c.thanks + 0.25, b: dur, cut: true, draw: (T) => desk() + slideUp(fin(T, c.thanks + 0.25), tape('THANKS FOR WATCHING', {x: 480, y: 420, size: 100, rot: -2, seed: 129}))},
  ];
  return {dur, shots};
};
