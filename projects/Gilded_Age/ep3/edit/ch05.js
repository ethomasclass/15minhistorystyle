// Chapter 5, "Old and New" (0:00 to 1:20): the textbook chart rebuilt on notebook paper, read cell by cell as the narration reads
// it (the old column first, then the new; then who decided "similar" and "different"; the Kellys, Irish and Catholic), the
// arrivals per decade, and the 3D model: Castle Garden to Hester Street (ep3_map_arrival, already keyed to this chapter's words).
// Baton card "The Lower East Side" on "the Lower East Side".
EDITS.ch05 = () => {
  const ch = 'ch05_old_and_new', W = window.WORDS[ch], w = (word, n) => wordAt(ch, word, n);
  const c = {judgment: w('judgment,'), because: w('Because'), irish: w('Irish'), numbers: w('numbers'), in84: w('1884,')};
  const cardAt = W.words[W.words.length - 4].s, dur = cardAt + CARD_HOLD;           // "the Lower East Side"
  const T_ = (txt, x, y, o) => (o > 0.01 ? svg(tag(x, y, txt, o)) : '');
  const P_ = (txt, x, y, o, size = 32, rot = -3) => (o > 0.01 ? op(o, svg(penS(x, y, txt, size, rot))) : '');
  const chart = {cells: [[w('old', 1), w('new', 2)], [w('Northern'), w('Southern')], [w('Most', 1), 31.4], [w('similar'), w('different', 1)], [w('Many'), 31.7]],
    at: {header: 0.6, line: w('textbooks') - 0.4, seen: w('different', 1), who: w('Native-born'), kellys: w('Kellys.') - 0.2, kpen: w('old', 3) - 0.3, arrow: w('Catholic.', 2) - 0.2, except: w('Catholic.', 2)}};
  const decades = ((m) => (T) => renderDecades(m(T)))(remap([[c.numbers - 0.1, 0], [54.6, 0.8], [56.3, 1.7], [59.7, 1.9], [61.1, 2.8], [62.6, 3.0], [63.6, 3.9], [64.8, 5.0], [68.4, 5.5]]));
  // the chart in three visits (old column; new column; who decided and the Kellys), with archival groups between them; the camera
  // leans (at most 5 %, so nothing leaves the frame) toward the row being read, and a soft band marks it
  const CK = [[0, 1.0, 960, 540], [4.6, 1.0, 960, 540], [6.2, 1.05, 620, 380], [13.8, 1.05, 620, 470], [16.9, 1.04, 1300, 380], [22.8, 1.05, 1300, 420],
    [30.5, 1.02, 1300, 600], [33.0, 1.05, 960, 700], [39.4, 1.04, 960, 690], [41.6, 1.0, 960, 560], [43.0, 1.05, 620, 720], [52.6, 1.04, 640, 700]];
  const ck = (T) => { let i = CK.length - 2; for (let k = 0; k < CK.length - 1; k++) if (T < CK[k + 1][0]) { i = k; break; }
    const [t0, s0, x0, y0] = CK[i], [t1, s1, x1, y1] = CK[i + 1], u = ease(clamp01((T - t0) / (t1 - t0))); return [s0 + (s1 - s0) * u, x0 + (x1 - x0) * u, y0 + (y1 - y0) * u]; };
  const READ = [[0, 0, w('old', 1), w('Northern') - 0.2], [1, 0, w('Northern'), w('Most', 1) - 0.2], [2, 0, w('Most', 1), w('Many') - 0.2], [4, 0, w('Many'), 16.7],
    [0, 1, w('new', 2), w('Southern') - 0.2], [1, 1, w('Southern'), 22.9], [3, 0, w('similar') - 0.2, w('and', 2) + 0.4], [3, 1, w('different', 1) - 0.2, w('That') - 0.2]];
  const band = (T) => READ.map(([i, side, a, b]) => { const o = fin(T, a, 0.3) * fout(T, b, 0.3); if (o <= 0.01) return '';
    return `<rect x="${side ? 975 : 145}" y="${215 + i * 125 + 6}" width="${side ? 805 : 805}" height="113" rx="8" fill="#2FE0C4" opacity="${(0.13 * o).toFixed(3)}"/>`; }).join('');
  const board = (T) => { const [s, cx, cy] = ck(T);
    return `<div style="position:absolute;inset:0;transform:scale(${s.toFixed(4)});transform-origin:${cx.toFixed(1)}px ${cy.toFixed(1)}px">${renderOldNew(T, chart)}${svg(band(T))}</div>`; };
  const shots = [
    // 1. "New, compared to who? Here's how textbooks usually sort them. The old immigrants came mostly before 1880, from Northern and
    //    Western Europe," the chart, the old column.
    {a: 0, b: w('like', 1) - 0.25, live: true, draw: (T) => board(T)},
    // 2. "like Germany, Britain and Ireland. Most were Protestant. Many settled on farms as well as in cities." Old-immigrant groups.
    {a: w('like', 1) - 0.25, b: 16.9, draw: (T) => push(T, w('like', 1) - 0.25, 16.9, 0.035) +
      printCard('a_departure/the_emigrants_die_auswanderer_print_1882_loc2013646643.jpg', {x: 110, y: 60, w: 640, ar: 1.28, rot: -1.5, o: fin(T, w('like', 1) - 0.25, 0.5), T,
        caption: 'German emigrants leave their village &middot; print, 1882'}) +
      printCard('f_letters/irish_depositors_emigrant_savings_bank_1880_loc2012646222.jpg', {x: 820, y: 170, w: 960, ar: 0.781, rot: 1.5, o: fin(T, w('Ireland.') - 0.3, 0.5), T,
        caption: 'Irish depositors, Emigrant Savings Bank, New York &middot; 1880'}) + `</div>` +
      T_('OLD IMMIGRANTS', 830, 115, fin(T, w('like', 1), 0.3)) + P_('farms as well as cities', 120, 1010, fin(T, w('Many'), 0.3), 26)},
    // 3. "The new immigrants came mostly from 1880 to 1910, from Southern and Eastern Europe," the chart, the new column.
    {a: 16.9, b: w('like', 2) - 0.25, live: true, draw: (T) => board(T)},
    // 4. "like Italy, Poland and Russia. Most were Catholic, Jewish, or Orthodox Christian. Most settled in cities." New arrivals.
    {a: w('like', 2) - 0.25, b: 31.2, draw: (T) => push(T, w('like', 2) - 0.25, 31.2, 0.035) +
      printCard('c_arrival/barge_office_landing_immigrants_1902_commons.jpg', {x: 100, y: 60, w: 1020, ar: 0.793, rot: -1.2, o: fin(T, w('like', 2) - 0.25, 0.5), T,
        caption: 'Arrivals landing at the Barge Office, New York &middot; 1902'}) +
      printCard('d_streets/riis_vegetable_stand_mulberry_bend_1890_loc2002710252.jpg', {x: 1190, y: 470, w: 620, ar: 0.776, rot: 2, o: fin(T, w('Most', 2), 0.5), T,
        caption: 'Mulberry Bend, New York &middot; Jacob Riis, 1890'}) + `</div>` +
      T_('NEW IMMIGRANTS', 1200, 120, fin(T, w('like', 2), 0.3)) + P_('Italy, Poland, Russia', 1200, 240, fin(T, w('Italy,'), 0.3), 30) +
      P_('mostly in cities', 1220, 370, fin(T, w('Most', 3), 0.3), 30)},
    // 5. "And here's the one that matters most. Native-born Protestant Americans saw the old immigrants as similar to themselves, and
    //    the new ones as different. That was a judgment, not a fact. Because look at the Kellys. They're old immigrants, from Ireland.
    //    But they're Catholic. And thirty years earlier, Irish Catholics were the ones Americans called different."
    {a: 31.2, b: c.numbers - 0.1, live: true, draw: (T) => board(T) +
      P_('a judgment, not a fact', 1420, 862, fin(T, c.judgment, 0.3) * fout(T, c.because + 3.0), 30) +
      P_('1850s: the Irish were &ldquo;different&rdquo;', 1330, 862, fin(T, c.irish - 0.1, 0.3), 28)},
    // 6. "The numbers changed fast. In the 1870s, about two point eight million immigrants came to the United States. In the 1880s,
    //    five point two million. And by the 1900s, almost 9 million in one decade." The bars, grown on their words.
    {a: c.numbers - 0.1, b: 68.4, live: true, draw: (T) => decades(T)},
    // 7. "In 1884, Jewish families like the Rabinowitzes were still a small part of the crowd, about one arrival in fifty. Most of them
    //    crowded into one neighborhood: the Lower East Side." The model: Castle Garden to Hester Street. The card.
    {a: 68.4, b: dur, live: true, draw: (T) => renderArrival(T - AR.T0) + batonCard(T, cardAt, 'The Lower East Side')},
  ];
  return {dur, shots};
};
