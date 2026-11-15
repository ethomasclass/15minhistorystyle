// Chapter 2, "Bursting at the Seams" (1:10): the city in 1884 (Currier and Ives); one American in four to four in ten
// (urbanization); 14 cities over 100,000 to 38; Chicago and Brooklyn in bars (Chicago "annexed 1889"); why (machines on farms,
// factories in cities, immigrants); the Kellys re-introduced in their kitchen (lookdev ep4_kelly_flat, retimed); Brooklyn grows in the
// 3D model, and the two ways left to go, up and out. The baton "Up and Out" slams in on "Up,".
EDITS.ch02 = () => {
  const ch = 'ch02_bursting_at_the_seams', W = window.WORDS[ch], w = (word, n) => wordAt(ch, word, n);
  const c = {
    in1870: w('In', 1), four1: w('four', 1), by1900: w('By', 1), four2: w('four', 2), hist: w('Historians'), in1870b: lWord(ch, 'In', 14), fourteen: w('14'),
    by1900b: w('By', 2), t38: w('38.'), chicago: w('Chicago'), mil: w('1.7'), cheated: w('cheated'), swallowed: w('swallowed'), brooklyn: w('Brooklyn'),
    doubled: w('doubled,'), fourth: w('fourth-biggest'), why: w('Why?'), machines: w('Machines'), factories: w('Factories'), millions: w('millions'),
    kellys: lWord(ch, 'The', 48), ma: w('Ma'), michael: w('Michael'), nora: w('Nora'), tommy: w('Tommy,'), so: w('So'), two: w('two'), up: w('Up,'), out: w('out.'),
  };
  const cardAt = c.up, dur = cardAt + CARD_HOLD;
  const P_ = (txt, x, y, o, size = 32, rot = -3) => lNote(txt, x, y, o, size, rot);
  const KF_MAP = remap([[c.kellys - 0.1, 0], [c.so - 0.1, 13.0]]);
  const d1870 = E4_C1870.map(([nm, lon, lat], i) => [lon, lat, c.in1870b + 0.3 + i * 0.14]);
  const d1900 = E4_C1900.map(([nm, lon, lat], i) => [lon, lat, c.by1900b + 0.1 + i * 0.055]);
  const count = (T) => T < c.by1900b ? 14 : Math.round(lerp(14, 38, clamp01((T - c.by1900b - 0.1) / (c.t38 - c.by1900b))));
  const GROW_KEYS = [[c.so - 0.1, 2050, -150, 0, -66, 31, 2100, 0, 0], [dur, 1900, -200, 0, -52, 27, 1750, 0, 0]];
  const shots = [
    // 1. "Bursting is not an exaggeration." New York and Brooklyn from above, Currier and Ives, 1884.
    {a: 0, b: c.in1870 - 0.05, draw: (T) => push(T, 0, c.in1870, 0.06) +
      printCard('a_city_growth/city_of_new_york_birdseye_currier_ives_1884_commons.jpg', {x: 240, y: 70, w: 1440, ar: 0.705, rot: -0.8, o: fin(T, 0, 0.35), T}) + `</div>` +
      lSrc('The City of New York &middot; Currier &amp; Ives, 1884', fin(T, 0.15))},
    // 2. "In 1870, about one American in four lived in a town or a city. By 1900, it was four in ten. Historians call that shift
    //    urbanization." Two rows of people; the city dwellers turn teal. The vocab card.
    {a: c.in1870 - 0.05, b: c.in1870b - 0.1, draw: (T) => svg(e4xUrban(T, {r1: c.in1870, c1: c.four1, r2: c.by1900, c2: c.four2})) +
      dimBy(0.55 * fin(T, c.hist - 0.1, 0.4)) + vocab(560, 420, 'Urbanization', 'People moving from farms and|villages into towns and cities.', fin(T, c.hist, 0.35))},
    // 3. "In 1870, the United States had 14 cities with more than a hundred thousand people. By 1900, it had 38."
    {a: c.in1870b - 0.1, b: c.chicago - 0.1, draw: (T) => svg(e4xUSCities(T, {dots: [...d1870, ...d1900], zoom: [1010, 470, 1.0]})) +
      bigFig(String(count(T)), {x: 1260, y: 640, size: 220, w: 520, align: 'right', o: fin(T, c.fourteen - 0.1, 0.3)}) +
      op(fin(T, c.fourteen, 0.3), mono('cities over 100,000 people', {x: 1180, y: 880, size: 26, color: C.cream, ls: 3})) +
      lTag(T < c.by1900b + 0.3 ? '1870' : '1900', 130, 120, fin(T, c.in1870b, 0.3))},
    // 4. "Chicago went from about 300,000 people to 1.7 million in thirty years. It cheated a little. It swallowed its suburbs. And
    //    Brooklyn doubled, to more than 800,000, the fourth-biggest city in the country."
    {a: c.chicago - 0.1, b: c.why - 0.1, draw: (T) => svg(e4xBars(T, {chi: c.chicago, chi2: c.mil - 0.3, ann: c.swallowed, bk: c.brooklyn, bk2: c.doubled})) +
      P_('it swallowed its suburbs', 690, 560, fin(T, c.swallowed, 0.3), 28) + P_('(annexed, 1889)', 720, 640, fin(T, c.swallowed + 0.4, 0.3), 28) +
      P_('doubled', 1520, 330, fin(T, c.doubled, 0.3), 40) +
      lTag('4TH-BIGGEST CITY IN THE COUNTRY', 1010, 1000, fin(T, c.fourth, 0.3))},
    // 5. "Why? Machines on farms meant fewer jobs for farmhands. Factories in cities meant more jobs for everybody else. And millions
    //    of immigrants were landing right where the jobs were."
    {a: c.why - 0.1, b: c.kellys - 0.1, draw: (T) => svg(e4xWhy(T, {farm: c.machines, factory: c.factories, ships: c.millions})) + lTag('WHY?', 130, 120, lVis(T, c.why, c.machines + 2.2))},
    // 6. "The Kellys were part of it. Ma had come from Ireland. Michael boiled sugar at the refinery on the river. His sister Nora
    //    worked as a maid in a Fifth Avenue mansion. And his little brother Tommy, seventeen, would take any job that paid."
    {a: c.kellys - 0.1, b: c.so - 0.1, live: true, draw: (T) => renderE4KellyFlat(KF_MAP(T), {quiet: true}) +
      lTag('THE KELLYS · WILLIAMSBURG, BROOKLYN', 130, 1000, lVis(T, c.kellys, c.ma + 2.4)) +
      lTag('MA · FROM IRELAND', 470, 290, fin(T, c.ma, 0.3)) + lTag('MICHAEL · SUGAR REFINERY', 830, 440, fin(T, c.michael, 0.3)) +
      P_('Nora: a maid on Fifth Avenue', 140, 980, fin(T, c.nora, 0.3), 30) + lTag('TOMMY · 17', 1430, 200, fin(T, c.tommy, 0.3))},
    // 7. "So many people, and so little room. The city had only two directions left to go. Up, and out." Brooklyn fills in the
    //    model, 1870 to 1890 (the bridge lands in 1883); a teal arrow up, one out; the baton on "Up,".
    {a: c.so - 0.1, b: dur, live: true, draw: (T) => renderEp4Grow(T, {a: c.so - 0.1, b: c.two, y0: 1870, y1: 1890, keys: GROW_KEYS, bridgeAt: c.so + 1.5}) +
      svg(xpOp(fin(T, c.two, 0.3), arrow([960, 560], [960, 200], 0) + arrow([1060, 640], [1560, 640], 0))) +
      P_('up', 1000, 260, fin(T, c.two + 0.1, 0.3), 44) + P_('out', 1420, 600, fin(T, c.two + 0.5, 0.3), 44) +
      batonCard(T, cardAt, 'Up and Out')},
  ];
  return {dur, shots};
};
window.HOLD.ch02 = {}; window.CARRY.ch02 = {};
