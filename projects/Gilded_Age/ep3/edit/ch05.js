// Chapter 5, "Old and New" (0:00 to 1:20): the textbook chart rebuilt on notebook paper, read cell by cell as the narration reads
// it (the old column first, then the new; then who decided "similar" and "different"; the Kellys, Irish and Catholic), the
// arrivals per decade, and the 3D model: Castle Garden to Hester Street (ep3_map_arrival, already keyed to this chapter's words).
// Baton card "The Lower East Side" on "the Lower East Side".
EDITS.ch05 = () => {
  const ch = 'ch05_old_and_new', W = window.WORDS[ch], w = (word, n) => wordAt(ch, word, n);
  const c = {judgment: w('judgment,'), because: w('Because'), irish: w('Irish'), numbers: w('numbers'), in84: w('1884,')};
  const cardAt = W.words[W.words.length - 4].s, dur = cardAt + CARD_HOLD;           // "the Lower East Side"
  const P_ = (txt, x, y, o, size = 32, rot = -3) => (o > 0.01 ? op(o, svg(penS(x, y, txt, size, rot))) : '');
  const chart = {cells: [[w('old', 1), w('new', 2)], [w('Northern'), w('Southern')], [w('Most', 1), w('Most', 2)], [w('similar'), w('different', 1)], [w('Many'), w('Most', 3)]],
    at: {header: 0.6, line: w('textbooks') - 0.4, seen: w('different', 1), who: w('Native-born'), kellys: w('Kellys.') - 0.2, kpen: w('old', 3) - 0.3, arrow: w('Catholic.', 2) - 0.2, except: w('Catholic.', 2)}};
  const decades = ((m) => (T) => renderDecades(m(T)))(remap([[c.numbers - 0.1, 0], [54.6, 0.8], [56.3, 1.7], [59.7, 1.9], [61.1, 2.8], [62.6, 3.0], [63.6, 3.9], [64.8, 5.0], [68.4, 5.5]]));
  const shots = [
    // 1. "New, compared to who? Here's how textbooks usually sort them." Then the old immigrants, row by row ("came mostly before 1880,
    //    from Northern and Western Europe... Most were Protestant. Many settled on farms as well as in cities."), then the new ("from
    //    1880 to 1910, from Southern and Eastern Europe... Catholic, Jewish, or Orthodox Christian. Most settled in cities."). "Native-born
    //    Protestant Americans saw the old immigrants as similar to themselves, and the new ones as different. That was a judgment, not a
    //    fact. Because look at the Kellys. They're old immigrants, from Ireland. But they're Catholic. And thirty years earlier, Irish
    //    Catholics were the ones Americans called different."
    {a: 0, b: c.numbers - 0.1, live: true, draw: (T) => `<div style="position:absolute;inset:0;transform:scale(${(1 + 0.025 * smooth(0, 52, T)).toFixed(4)});transform-origin:960px 540px">${renderOldNew(T, chart)}</div>` +
      P_('a judgment, not a fact', 1420, 862, fin(T, c.judgment, 0.3) * fout(T, c.because + 3.0), 30) +
      P_('1850s: the Irish were &ldquo;different&rdquo;', 1330, 862, fin(T, c.irish - 0.1, 0.3), 28)},
    // 2. "The numbers changed fast. In the 1870s, about two point eight million immigrants came to the United States. In the 1880s,
    //    five point two million. And by the 1900s, almost 9 million in one decade." The bars, grown on their words.
    {a: c.numbers - 0.1, b: 68.4, live: true, draw: (T) => decades(T)},
    // 3. "In 1884, Jewish families like the Rabinowitzes were still a small part of the crowd, about one arrival in fifty. Most of them
    //    crowded into one neighborhood: the Lower East Side." The model: Castle Garden to Hester Street. The card.
    {a: 68.4, b: dur, live: true, draw: (T) => renderArrival(T - AR.T0) + batonCard(T, cardAt, 'The Lower East Side')},
  ];
  return {dur, shots};
};
