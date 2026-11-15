// Chapter 7, "Honest Graft" (76.9 s of narration + the baton card). Plunkitt's own chapter page, "Honest Graft and Dishonest Graft"
// (1905) with the vocabulary card; his portrait (about 1910); four offices and three paychecks in 1870 (lookdev/ep4_explain_b.js
// renderJobs); the bootblack stand photograph (1905); Plunkitt on the stand, faceless from behind (ep4_bootblack), his words in
// orange handwriting; the swamp and the park (renderGraft); the epitaph he wanted (renderTombstone); the fire again, the cold
// open's engine and the captain (ep4_fire): "as soon as the fire engines"; the charity line; "Mighty good politics"; the card
// "Helper or Thief?" on "Helper, or thief?". Every quotation on screen is Plunkitt's exact words (Riordon, 1905).
EDITS.ch07 = () => {
  const ch = 'ch07_honest_graft', L = (word, near) => lWord(ch, word, near);
  const cardAt = L('Helper,', 75.48), dur = cardAt + CARD_HOLD;
  const c = {graft: L('Graft', 2.22), george: L('George', 5.96), held: L('held', 10.34), rich: L('rich.', 16.86), years: L('Years', 17.78), shoe: L('shoeshine', 23.86), stealing: L('Stealing,', 26.7),
    seen: L('"I', 30.18), say: L('Say', 33.06), liked: L('Plunkitt', 47.6), also: L('He', 52.7), when: L('When', 56.08), there: L('there', 58.08), didnt: L('He', 60.44), decide: L('"decide', 64.32),
    phil: L('"It\'s', 68.58), mighty: L('Mighty', 72.1), so: L('So', 74.02)};
  const pg = 0, por = c.george - 0.1, jobs = 10.15, photo = 19.3, bb = 23.7, gr = 33.0, tb = 47.45, bb2 = 53.0, fire = c.when - 0.15, qt = 63.0, bb3 = c.phil - 0.1;
  const shots = [
    // 1. "Honest graft. Graft means using a public job to make money for yourself." His own chapter title, 1905.
    {a: pg, b: por, draw: (T) => kDesk(T, pg, por, kCrop('h_plunkitt/plunkitt_honest_graft_and_dishonest_graft_chapter_page_1905_ia.jpg', {x: 250, y: 60, w: 640, size: [1918, 2786], crop: [0.1, 0.05, 0.92, 0.6], rot: -1, o: fin(T, 0.05, 0.5), T}), 0.04, 600, 400) +
      vocab(1000, 300, 'Graft', 'Using a public job to make|money for yourself.', fin(T, c.graft - 0.2, 0.4)) +
      lSrc('PLUNKITT OF TAMMANY HALL · RIORDON, 1905 · INTERNET ARCHIVE', lVis(T, 0.2, por + 0.4))},
    // 2. "George Washington Plunkitt was a Tammany leader who, in 1870,"
    {a: por, b: jobs, cut: true, draw: (T) => kDesk(T, por, jobs, kCrop('h_plunkitt/plunkitt_portrait_c1910_commons.jpg', {x: 700, y: 50, w: 520, size: [2912, 4000], crop: [0.06, 0.1, 0.94, 0.95], rot: 1, o: fin(T, por + 0.05, 0.5), T})) +
      lTag('GEORGE WASHINGTON PLUNKITT · TAMMANY LEADER', 130, 120, lVis(T, por + 0.3, jobs + 0.4)) + lSrc('G. W. PLUNKITT · PHOTOGRAPH, ABOUT 1910 · LIBRARY OF CONGRESS VIA WIKIMEDIA COMMONS', lVis(T, por + 0.2, jobs + 0.4))},
    // 3. "held four government jobs at once, and collected paychecks from three of them. At the same time. He got rich."
    {a: jobs, b: photo, cut: true, live: true, draw: (T) => renderJobs(T, JB_CUE) + lNote('he got rich', 1340, 990, lVis(T, c.rich - 0.1, photo + 0.6))},
    // 4. "Years later, in 1905, he explained how to a newspaper reporter, from his favorite seat:" The stand, photographed for the book.
    {a: photo, b: bb, cut: true, draw: (T) => kDesk(T, photo, bb, printCard('h_plunkitt/plunkitt_on_his_rostrum_bootblack_stand_frontispiece_1905_ia.jpg', {x: 330, y: 110, w: 1260, ar: 0.688, rot: -0.8, o: fin(T, photo + 0.05, 0.5), T}), 0.05, 760, 420) +
      lTag('PLUNKITT ON HIS "ROSTRUM" · 1905', 130, 120, lVis(T, photo + 0.3, bb + 0.4)) + lSrc('FRONTISPIECE, PLUNKITT OF TAMMANY HALL · 1905 · INTERNET ARCHIVE', lVis(T, photo + 0.2, bb + 0.4))},
    // 5. "a shoeshine stand in Tweed's old courthouse. Stealing, he said, was for fools. His way: 'I seen my opportunities and I took 'em.'"
    {a: bb, b: gr, cut: true, live: true, draw: (T) => kQ(() => renderE4Bootblack(remap([[bb, 0.2], [gr, 9.5]])(T))) +
      lTag('TWEED’S OLD COURTHOUSE · 1905', 130, 120, lVis(T, bb + 0.2, c.stealing + 0.6)) + lNote('stealing: for fools', 140, 290, lVis(T, c.stealing, gr + 0.3), 36, -4) +
      lNote('“I seen my opportunities', 140, 560, lVis(T, c.seen - 0.1, gr + 0.3), 40, -4) + lNote('and I took ’em.”', 220, 700, lVis(T, c.seen - 0.1, gr + 0.3), 40, -4)},
    // 6. "Say he heard the city was planning a new park. He'd quietly buy the land there first, cheap. Then the city would have to buy it
    //    from him, at a good price. 'Anything dishonest in that?' he asked. Today we'd call that insider dealing."
    {a: gr, b: tb, cut: true, live: true, draw: (T) => renderGraft(T, GR_CUE)},
    // 7. "Plunkitt liked his line so much, he wanted it on his tombstone. Seriously."
    {a: tb, b: bb2, cut: true, live: true, draw: (T) => renderTombstone(T, TB_CUE)},
    // 8. "He also explained why poor voters stuck with the machine."
    {a: bb2, b: fire, cut: true, live: true, draw: (T) => kQ(() => renderE4Bootblack(remap([[bb2, 10.6], [fire, 14.0]])(T))) + lNote('why poor voters stuck with the machine', 140, 330, lVis(T, bb2 + 0.3, fire + 0.4), 32, -4)},
    // 9. "When there was a fire, he said, he was there 'as soon as the fire engines.' He didn't ask how people voted." The cold open's
    //    fire again: the engine pulls up, the captain and his men walk in behind it.
    {a: fire, b: qt, cut: true, live: true, draw: (T) => kQ(() => renderE4Fire(remap([[fire, 20.4], [qt, 28.6]])(T))) +
      lNote('“as soon as the fire engines”', 140, 330, lVis(T, c.there - 0.3, qt + 0.3), 38, -4) + lTag('THE ROUTINE, IN PLUNKITT’S WORDS · 1905', 130, 990, lVis(T, fire + 0.3, qt + 0.3))},
    // 10. "And he didn't send them to a charity that would 'decide they were worthy of help about the time they are dead from starvation.'"
    {a: qt, b: bb3, cut: true, draw: (T) => push(T, qt, bb3, 0.03) + `</div>` +
      quote('“...decide they were worthy of help about the time they are dead from starvation.”', 'Plunkitt on charities · Plunkitt of Tammany Hall, 1905', {x: 180, y: 330, w: 1560, size: 72, o: fin(T, c.decide - 0.5, 0.5)}) +
      lNote('not a charity office', 190, 260, lVis(T, qt + 0.2, bb3 + 0.3))},
    // 11. "'It's philanthropy,' he said, 'but it's politics, too. Mighty good politics.' So which was it? Helper, or thief?"
    {a: bb3, b: dur, cut: true, live: true, draw: (T) => kQ(() => renderE4Bootblack(remap([[bb3, 2.6], [dur, 12.2]])(T))) +
      lNote('“It’s philanthropy,', 140, 300, lVis(T, c.phil, dur + 1), 40, -4) + lNote('but it’s politics, too.', 200, 460, lVis(T, c.phil + 1.6, dur + 1), 40, -4) +
      lNote('Mighty good politics.”', 260, 620, lVis(T, c.mighty - 0.1, dur + 1), 40, -4) + batonCard(T, cardAt, 'Helper or Thief?')},
  ];
  return {dur, shots};
};
window.HOLD.ch07 = {}; window.CARRY.ch07 = {};
