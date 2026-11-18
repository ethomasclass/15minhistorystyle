// Chapter 8, "A Party of Their Own" (116.6 s of narration + the baton card). The spoils system (ep5_x_spoils); Puck's "An office or
// your life!" (July 1881, the office seeker as gunman: a caricature, brief and framed by the narration) and the station lithograph
// of the shooting, small and distant, in grey (SENSITIVE: no close view); the Pendleton Act's first page and the civil service test
// (ep5_x_spoils); the People's Party ticket of 1892; populism on the board; the Omaha Platform (ep5_x_omaha); Owen's line by his lamp;
// a million votes; the Panic of 1893 (the Stock Exchange engraving and the bank-run poster), one worker in ten, the depression card,
// Opper's "We've all got to retrench!"; Michael let go at the refinery gate (ep5_refinery shot B); Coxey's march on the map
// (ep5_map_coxey), the marchers' stereograph and Legal Tender; the arrest at the Capitol (ep5_coxey) with "carrying banners" and
// "walking on the grass"; the gold-or-silver scales (Opper, Puck 1896: caricature, brief); the card "The Cross of Gold" on "cross".
// Helpers q... in ch06.js; q7Vocab in ch07.js.

EDITS.ch08 = () => {
  const ch = 'ch08_a_party_of_their_own', L = (word, near) => lWord(ch, word, near);
  const cardAt = L('cross', 115.7), dur = cardAt + CARD_HOLD;
  const c = {because: L('Because', 3.0), jobs: L('jobs', 5.2), spoils: L('spoils', 7.8), in1881: L('In', 9.2), shot: L('shot', 12.9), congress: L('Congress', 15.1),
    pendleton: L('Pendleton', 16.3), some: L('some', 17.7), test: L('test,', 19.9), civil: L('civil', 21.1), fixed: L('That', 22.4), not: L('not', 24.1), so: L('So', 25.7),
    omaha: L('Omaha,', 28.5), peoples: L("People's", 30.9), populism: L('Populism', 34.2), banks: L('banks,', 38.9), rail: L('railroads', 39.5), corps: L('corporations.', 40.3),
    their: L('Their', 41.5), platform: L('Platform,', 43.0), free: L('free', 44.4), income: L('An', 45.6), senators: L('Senators', 48.7), gov: L('Government', 51.5),
    eight: L('And', 53.5), owen: L("We've", 56.0), nov: L('That', 58.7), million: L('million', 61.3), then: L('Then,', 62.9), crashed: L('crashed.', 65.6),
    banksF: L('Banks', 66.5), by1894: L('By', 67.8), one: L('one', 69.7), dep: L('depression,', 73.3), and: L('And', 76.3), nothing: L('nothing.', 78.2),
    refinery: L('The', 79.2), ma: L('Ma', 81.3), ohio: L('In', 84.1), coxey: L('Coxey', 87.3), led: L('led', 88.0), wash: L('Washington,', 89.7), roads: L('roads:', 92.4),
    army: L("Coxey's", 93.2), cared: L('Coxey', 94.8), legal: L('Legal', 98.8), named2: L('He', 100.2), when: L('When', 102.6), police: L('police', 103.9), what: L('For', 105.8),
    banners: L('Carrying', 106.7), grass: L('And', 108.2), by1896: L('By', 110.0), goldOr: L('gold', 113.2), speech: L('speech', 114.9)};
  const cut = {garf: c.in1881 - 0.2, shoot: c.shot - 0.35, pend: c.congress + 0.4, test: c.civil - 0.3, omaha: c.so - 0.2, pop: c.populism - 0.2, plat: c.their + 0.6,
    owen: c.owen - 0.2, votes: c.nov + 0.1, crash: c.then - 0.2, ten: c.one - 0.4, retr: c.and - 0.2, gate: c.refinery - 0.15, map: c.ohio - 0.2, army: c.army - 0.25,
    capitol: c.when - 0.25, scales: c.by1896 + 0.9};
  const mSp1 = remap([[0, 0.2], [c.because, 0.8], [c.jobs, 2.4], [cut.garf + 0.5, 5.0]]);
  const mSp2 = remap([[cut.test, 5.6], [c.civil, 6.0], [c.civil + 0.4, 6.4], [c.fixed, 7.4], [c.not, 8.4], [cut.omaha + 0.5, 10.6]]);
  const mOm = remap([[cut.plat, 0], [c.platform - 0.4, 0.3], [c.free, 1.2], [c.income, 2.4], [c.senators, 3.6], [c.gov, 4.8], [c.eight - 0.3, 6.0], [cut.owen + 0.5, 8.4]]);
  const mCx = remap([[cut.map, 0.2], [c.ohio + 0.3, 0.6], [c.coxey - 0.6, 1.6], [c.wash - 0.7, 8.4], [cut.army + 0.5, 10.6]]);
  const mCap = remap([[cut.capitol, 8.0], [c.police + 0.5, 9.8], [c.what + 0.2, 11.9], [c.banners, 12.5], [cut.scales + 0.5, 15.4]]);
  // "Populism" on the board: the people on the left, the three powers on the right, a teal arrow between, each power on its word
  const populism = (T) => { const s = [x5Board(4)], scr = [];
    s.push(x5Icon('people', 470, 640, x5Pop(c.populism + 0.6, T) * 2.6));
    scr.push(x5Op(x5In(c.populism + 0.8, T), x5Mono(470, 790, 'ORDINARY PEOPLE', 28, X5.cream, 'middle')));
    s.push(xpArrow(xpCurve([640, 600], [980, 600], 40), x5In(L('uniting', 36.3), T, 0.8)));
    [['bar', 'BIG BANKS', 38.5, 1220], ['train', 'RAILROADS', 38.9, 1440], ['mill', 'CORPORATIONS', 39.3, 1660]].forEach(([ic, w, t0, x], i) => {
      s.push(x5Icon(ic, x - 120, 610, x5Pop(t0, T) * 1.7)); scr.push(x5Op(x5In(t0, T, 0.3), x5Mono(x - 120, 720 + (i % 2) * 44, w, 24, X5.pale, 'middle'))); });
    scr.push(x5Op(x5In(L('elites,', 37.7) - 0.2, T), x5Pen(1130, 470, 'powerful elites', 36, -3)));
    return x5Frame(T, s.join(''), scr.join('')) + vocab(560, 120, 'Populism', 'Ordinary people uniting against|powerful elites.', fin(T, c.populism, 0.4)); };
  // a million votes: the ballots pile up in rows, the figure on top
  const votes = (T) => { const s = [x5Board(9)], scr = [];
    for (let i = 0; i < 60; i++) { const k = x5In(c.nov + 0.3 + i * 0.035, T, 0.2); if (k <= 0) continue; const x = 360 + (i % 15) * 82, y = 560 + Math.floor(i / 15) * 92;
      s.push(x5Op(k, `<g transform="translate(${x},${y - (1 - k) * 20}) rotate(${(i * 37) % 9 - 4})"><rect x="-26" y="-34" width="52" height="68" fill="${X5.cream}" stroke="#111" stroke-width="3"/><path d="M-14,-14 l8,9 l16,-18" stroke="#2A8F80" stroke-width="5" fill="none"/><rect x="-16" y="12" width="32" height="4" fill="#9A9284"/></g>`)); }
    scr.push(x5Op(x5In(c.nov, T), tapeS(400, 170, 'NOVEMBER 1892', 60, -2, 1, 73)));
    scr.push(x5Op(x5In(c.nov + 0.8, T), x5Ab(960, 470, 'over a million votes', 84, X5.cream, 'middle')));
    return x5Frame(T, s.join(''), scr.join('')); };
  // one worker in ten: ten workers in a row; on "one", a strip slaps on the eleventh place's first man: NO JOB; the depression card
  const tenth = (T) => { const s = [x5Board(2)], scr = [];
    for (let i = 0; i < 10; i++) { const k = x5Pop(c.by1894 + 0.2 + i * 0.07, T), out = i === 9 ? x5In(c.one, T, 0.4) : 0;
      s.push(x5At(380 + i * 130, 700 - out * 0, k, xpPerson(0, 0, 230, out > 0 ? '#2C403C' : X5.mute, {stroke: '#111'}))); }
    scr.push(x5Op(x5In(c.one + 0.3, T, 0.3), tapeS(1430, 360, 'NO JOB', 54, 4, 1, 79)));
    scr.push(x5Op(x5In(c.by1894, T), x5Mono(960, 830, 'BY 1894: MORE THAN 1 WORKER IN 10', 30, X5.cream, 'middle')));
    return x5Frame(T, s.join(''), scr.join('')) + q7Vocab(T, c.dep - 0.1, 'Depression', 'A long, deep slump: businesses|close, and many people lose|their jobs.'); };
  const shots = [
    // "Why not vote for one of the two big parties? Because both seemed busy handing out government jobs to their buddies. That was called the spoils system."
    {a: 0, b: cut.garf, draw: (T) => renderX5Spoils(mSp1(T))},
    // "In 1881, a man who thought he was owed a job" (Puck, July 13, 1881: "An office or your life!")
    {a: cut.garf, b: cut.shoot, cut: true, draw: (T) => qPrint(T, cut.garf, cut.shoot, 'l_garfield_civil_service/guiteau_cartoon_wales_puck_1881_commons.jpg', {x: 560, y: 110, w: 800, ar: 0.908, rot: -1},
      '"AN OFFICE OR YOUR LIFE!" · JAMES A. WALES, PUCK, JULY 13, 1881 · WIKIMEDIA COMMONS', {oy: 400}) +
      lNote('he thought he was owed a job', 1080, 230, lVis(T, cut.garf + 0.3, cut.shoot + 0.2), 30, -4)},
    // "even shot President James Garfield." The station, from a distance, in grey.
    {a: cut.shoot, b: cut.pend, cut: true, draw: (T) => qDesk(T, cut.shoot, cut.pend, qCrop('l_garfield_civil_service/scene_of_assassination_baltimore_potomac_station_sensitive_loc.jpg', {x: 560, y: 170, w: 800, size: [4000, 2977], crop: [0.02, 0.03, 0.98, 0.84], rot: 0.8, o: fin(T, cut.shoot + 0.05, 0.4), T, filter: 'grayscale(1) contrast(.95) brightness(.92)'}), 0.02) +
      qTag('WASHINGTON, D.C. · JULY 2, 1881', 172, 124, lVis(T, cut.shoot + 0.2, cut.pend + 0.4)) + lSrc('THE BALTIMORE AND POTOMAC STATION · LITHOGRAPH, 1881 · LIBRARY OF CONGRESS', lVis(T, cut.shoot + 0.2, cut.pend + 0.4))},
    // "Congress responded with the Pendleton Act: some government jobs now required passing a test,"
    {a: cut.pend, b: cut.test, cut: true, draw: (T) => qPrint(T, cut.pend, cut.test, 'l_garfield_civil_service/pendleton_act_page1_1883_commons.jpg', {x: 260, y: 90, w: 560, ar: 1.41, rot: -1},
      'THE PENDLETON ACT, PAGE 1 · JANUARY 16, 1883 · WIKIMEDIA COMMONS', {ox: 540, oy: 300}) +
      vocab(946, 260, 'Pendleton Act', 'A law, 1883: some government|jobs now needed a test.', fin(T, c.pendleton, 0.4))},
    // "called civil service. That fixed who got jobs, not crop prices." The test card slides in, ticked.
    {a: cut.test, b: cut.omaha, cut: true, draw: (T) => renderX5Spoils(mSp2(T)) + q7Vocab(T, c.civil + 0.9, 'Civil service', 'Government jobs won by passing|a test, not by party favors.') +
      lNote('...not crop prices', 1150, 960, lVis(T, c.fixed, cut.omaha + 0.3), 34, -3)},
    // "So on July 4th, 1892, in Omaha, Nebraska, farmers formed the People's Party, also called the Populists."
    {a: cut.omaha, b: cut.pop, cut: true, draw: (T) => qPrint(T, cut.omaha, cut.pop, 'i_populists/peoples_party_candidates_weaver_field_1892_loc.jpg', {x: 300, y: 70, w: 620, ar: 1.345, rot: 1},
      "PEOPLE'S PARTY CANDIDATES WEAVER AND FIELD · CAMPAIGN PRINT, 1892 · LIBRARY OF CONGRESS", {ox: 600, oy: 380}) +
      qTag('OMAHA, NEBRASKA · JULY 4, 1892', 1000, 300, lVis(T, c.omaha - 0.3, cut.pop + 0.3)) +
      qTapes(T, [[c.peoples, "THE PEOPLE'S PARTY", 1000, 420, 60, -2], [c.peoples + 0.2, 'THE POPULISTS', 1060, 560, 60, 1.5]])},
    // "Populism means ordinary people uniting against powerful elites, like big banks, railroads and corporations."
    {a: cut.pop, b: cut.plat, cut: true, draw: (T) => populism(T)},
    // "Their plan, the Omaha Platform, demanded free silver. An income tax, so the richest paid the most. Senators elected directly by
    //  voters. Government control of the railroads. And an eight-hour workday."
    {a: cut.plat, b: cut.owen, cut: true, draw: (T) => renderX5Omaha(mOm(T))},
    // OWEN: "We've got our own party now." By his lamp, writing.
    {a: cut.owen, b: cut.votes, cut: true, live: true, draw: (T) => qQ(() => renderE5Farm(T - cut.owen + 10.4)) + qSay(T, [["“We've got our own", 190, 300, c.owen], ['party now.”', 240, 400, c.owen]], lVis(T, cut.owen, cut.votes + 0.2)) +
      qTag('UNCLE OWEN · 1892', 172, 124, lVis(T, cut.owen + 0.1, cut.votes + 0.3))},
    // "That November, the Populists won over a million votes."
    {a: cut.votes, b: cut.crash, cut: true, draw: (T) => votes(T)},
    // "Then, in 1893, the economy crashed. Banks failed." The Stock Exchange in May 1893; the run on a bank (a play poster, 1895).
    {a: cut.crash, b: cut.ten, cut: true, draw: (T) => qDesk(T, cut.crash, cut.ten, printCard('i_populists/panic_at_the_stock_exchange_may_1893_SMALL_commons.jpg', {x: 300, y: 90, w: 430, ar: 1.54, rot: -1.5, o: fin(T, cut.crash + 0.05, 0.4), T}) +
      printCard('i_populists/war_of_wealth_bank_run_poster_1895_commons.jpg', {x: 860, y: 230, w: 800, ar: 0.738, rot: 1.2, o: fin(T, c.banksF - 0.3, 0.4), T})) +
      qTapes(T, [[c.then + 0.3, 'THE PANIC OF 1893', 900, 110, 56, -2]]) +
      lSrc('PANIC AT THE STOCK EXCHANGE, MAY 1893 · ENGRAVING · WIKIMEDIA COMMONS', lVis(T, cut.crash + 0.2, cut.ten + 0.4), {y: 886}) +
      lSrc('"THE WAR OF WEALTH": THE RUN ON THE BANK · PLAY POSTER, 1895 · WIKIMEDIA COMMONS', lVis(T, c.banksF - 0.2, cut.ten + 0.4))},
    // "By 1894, more than one worker in ten had no job. It was called a depression, the worst the country had seen."
    {a: cut.ten, b: cut.retr, cut: true, draw: (T) => tenth(T)},
    // "And the government did almost nothing." (Opper, Puck, August 1893)
    {a: cut.retr, b: cut.gate, cut: true, draw: (T) => qPrint(T, cut.retr, cut.gate, 'i_populists/weve_all_got_to_retrench_opper_puck_1893_loc.jpg', {x: 260, y: 130, w: 1000, ar: 0.65, rot: -1},
      '"WE\'VE ALL GOT TO RETRENCH!" · F. OPPER, PUCK, AUGUST 30, 1893 · LIBRARY OF CONGRESS', {ox: 760}) +
      lNote('the government did almost nothing', 980, 900, lVis(T, c.and + 0.3, cut.gate + 0.3), 30, -3)},
    // "The refinery let Michael go. Ma took in washing to keep the family fed." The yard by the gate: the foreman points past the gate.
    {a: cut.gate, b: cut.map, cut: true, live: true, draw: (T) => lQuiet(() => renderE5Refinery(remap([[cut.gate, 8.9], [cut.map + 0.5, 13.7]])(T))) +
      qTag('THE REFINERY GATE · 1894', 172, 124, lVis(T, cut.gate + 0.1, cut.map + 0.3)) + lNote('Michael: let go', 1100, 250, lVis(T, L('let', 79.9), cut.map + 0.3), 34) +
      lNote('Ma takes in washing', 1100, 360, lVis(T, c.ma, cut.map + 0.3), 34)},
    // "In Ohio, a businessman and Populist named Jacob Coxey led hundreds of jobless men to Washington, to ask Congress for jobs building roads:"
    {a: cut.map, b: cut.army, cut: true, live: true, draw: (T) => e5Live(renderE5MapCoxey(mCx(T))) + lNote('hundreds of jobless men', 1060, 960, lVis(T, L('hundreds', 88.3) - 0.1, cut.army + 0.3), 30, -3)},
    // "Coxey's Army. Coxey cared so much about money that he named his baby son... Legal Tender. He named his kid after money."
    {a: cut.army, b: cut.capitol, cut: true, draw: (T) => qDesk(T, cut.army, cut.capitol, qCrop('i_populists/coxeys_army_stereograph_a_jarvis_1894_commons.jpg', {x: 210, y: 150, w: 820, size: [3840, 1922], crop: [0.03, 0.06, 0.49, 0.94], rot: -1, o: fin(T, cut.army + 0.05, 0.4), T}), 0.04, 600, 520) +
      lSrc("COXEY'S ARMY NEARS WASHINGTON · STEREOGRAPH, 1894 · THE MET VIA WIKIMEDIA COMMONS", lVis(T, cut.army + 0.2, cut.capitol + 0.4)) +
      qTapes(T, [[c.army, "COXEY'S ARMY", 1120, 170, 64, -2], [c.legal, 'LEGAL TENDER', 1120, 470, 76, 1.5]]) + lNote('his baby son:', 1140, 420, lVis(T, L('baby', 97.7) - 0.1, cut.capitol + 0.2), 30, -3) +
      lNote('a word for money', 1180, 690, lVis(T, c.legal + 0.6, cut.capitol + 0.2), 34, -3) +
      (T > c.legal + 0.3 ? svg((() => { const g = 0.5 + 0.5 * Math.sin(T * 3.1); return `<circle cx="1700" cy="478" r="${f1(4 + 2 * g)}" fill="#FFD36B" opacity="${f1(0.6 + 0.4 * g)}"/><path d="M1700,464 l0,28 M1686,478 l28,0" stroke="#FFF1C2" stroke-width="2" opacity="${f1(0.7 * g)}"/>`; })()) : '')},
    // "When they reached the Capitol, police arrested Coxey. For what? Carrying banners. And walking on the grass."
    {a: cut.capitol, b: cut.scales, cut: true, live: true, draw: (T) => lQuiet(() => renderE5Coxey(mCap(T))) + qTag('THE CAPITOL · MAY 1, 1894', 172, 124, lVis(T, cut.capitol + 0.1, cut.capitol + 3.0)) +
      qTapes(T, [[c.banners, 'CARRYING BANNERS', 1000, 150, 60, -2], [c.grass, 'WALKING ON THE GRASS', 960, 270, 60, 1.5]])},
    // "By 1896, the whole election came down to gold or silver, and a speech about a cross of gold." (Opper, Puck, October 1896)
    {a: cut.scales, b: dur, cut: true, draw: (T) => qPrint(T, cut.scales, dur, 'j_1896/bryan_ablest_worker_for_sound_money_opper_1896_loc.jpg', {x: 300, y: 70, w: 580, ar: 1.298, rot: -1},
      'PUCK COVER · F. OPPER, OCTOBER 21, 1896 · LIBRARY OF CONGRESS', {ox: 600, oy: 400}) +
      qTapes(T, [[c.by1896, '1896', 1060, 200, 80, -2], [c.goldOr, 'GOLD OR SILVER?', 1000, 380, 70, 1.5]]) + batonCard(T, cardAt, 'The Cross of Gold')},
  ];
  return {dur, shots};
};
window.HOLD.ch08 = {}; window.CARRY.ch08 = {};
