// Chapter 9, "The Cross of Gold" (102.1 s of narration + the baton card). The convention hall (ep5_bryan): Bryan speaking, then his
// arms spread like a cross on "spread wide", held under the quotation (on screen in two parts, on their words); C. M. Bell's photograph
// of Bryan (1894) for "a 36-year-old from Nebraska"; the "16 to 1" broadside (1896) for "in plain words"; the hall erupts on "The
// crowd went wild"; Owen's line; Bryan's 18,000 miles on the map; McKinley's porch (ep5_porch: the train stops on "trainload");
// "Our Home Defenders" (1896) for steady jobs and a strong dollar; Michael back at the refinery; the kitchen argument
// (ep5_kitchen_1896, lip-synced: clip t = chapter t - 65.5); the 1896 map (ep5_map_1896: McKinley wins, the states fill, the cities,
// Nebraska); the Populists fade; door 3 closes (ep5_door3_close, the slam on "closed"); the card "The Scorecard" on "the scorecard".
// No real person gets a face in the drawn sets (Bryan and McKinley are faceless silhouettes). Helpers q... in ch06.js.

EDITS.ch09 = () => {
  const ch = 'ch09_the_cross_of_gold', L = (word, near) => lWord(ch, word, near);
  const cardAt = L('the', 101.4), dur = cardAt + CARD_HOLD;
  const c = {a36: L('A', 8.2), bryan: L('Bryan', 11.5), free: L('free', 13.6), he: L('He', 15.0), spread: L('spread', 16.3), q1: L('"You', 18.0), q2: L('You', 23.4),
    plain: L('In', 27.9), dont: L("don't", 29.1), crowd: L('The', 32.8), wild: L('went', 33.6), made: L('made', 35.6), pops: L('Populists', 37.3), owen: L("Bryan's", 39.5),
    criss: L('Bryan', 43.4), his: L('His', 45.5), porch: L('porch', 49.2), train: L('trainload.', 51.6), mck: L('McKinley', 52.9), steady: L('steady', 53.9), strong: L('strong', 55.0),
    some: L('some', 56.4), close: L('close.', 60.2), michael: L('Michael', 61.3), at: L('At', 63.4), won: L('McKinley', 83.2), city: L('city', 84.8), farm: L('Bryan', 88.9),
    enough: L('enough.', 91.2), soon: L('Soon', 92.1), faded: L('faded', 94.9), door: L('The', 96.0), closed: L('closed.', 97.1)};
  const cut = {photo: c.a36 - 0.2, cross: c.he - 0.2, plain: c.plain - 0.3, wild: c.crowd - 0.2, owen: c.owen - 0.4, tour: c.criss - 0.3, porch: c.his + 0.5, poster: c.mck - 0.2,
    work: c.michael - 0.2, kitchen: c.at + 0.4, map: c.won - 0.3, fade: c.soon - 0.25, door: c.door + 0.3};
  const mBr1 = remap([[0, 0], [cut.photo + 0.5, 5.6]]);
  const mBr2 = remap([[cut.cross, 5.0], [c.spread, 6.0], [c.spread + 0.6, 6.8], [cut.plain + 0.5, 9.1]]);
  const mBr3 = remap([[cut.wild, 9.0], [c.wild, 9.4], [cut.owen + 0.5, 14.0]]);
  const mPorch = remap([[cut.porch, 0.6], [c.train - 0.2, 4.6], [cut.poster + 0.5, 6.4]]);
  const mDoor = remap([[cut.door, 0.6], [c.closed, DCL.shut], [c.closed + 1.6, 3.6], [dur, 5.0]]);
  // the 1896 map, cut to the words: McKinley's win stamped first, the states fill east to west under "most city voters", the cities,
  // Nebraska on "Bryan won the farm states"
  const EL = {...E5M_EL, title: 0.2, legend: 0.6, win: c.won + 0.5 - cut.map, fill: [1.2, 5.6], cities: c.city - cut.map, nebr: c.farm + 0.2 - cut.map};
  // Bryan's tour: a teal route crisscrossing the country, city to city
  const TOUR = [[-96.7, 40.8], [-87.6, 41.9], [-83.0, 42.3], [-78.9, 42.9], [-74.0, 40.7], [-71.1, 42.4], [-75.2, 40.0], [-76.6, 39.3], [-77.4, 37.5], [-78.6, 35.8],
    [-84.4, 33.7], [-86.8, 36.2], [-85.8, 38.3], [-83.0, 40.0], [-80.0, 40.4], [-87.9, 43.0], [-93.3, 45.0], [-90.2, 38.6], [-94.6, 39.1], [-96.7, 40.8]];
  const tour = (T) => { const t = T - cut.tour, cam = [1000, 520, 1.05 + 0.02 * t], P = e5mTr(cam), s = [xpBoard(3)], scr = [];
    s.push(e5mG(cam, e5mLand(() => E5M.land, cam[2])));
    const r = TOUR.map((p) => P(e5mP(p))), u = clamp01(t / 2.4);
    s.push(xpArrow(r, ease(u), {w: 6, head: false}));
    const hd = xpAt(r, ease(u)); s.push(`<circle cx="${f1(hd[0])}" cy="${f1(hd[1])}" r="10" fill="${E5M.cream}" stroke="#111" stroke-width="3"/>`);
    scr.push(e5mTag(180, 160, 'BRYAN: ABOUT 18,000 MILES', smooth(0.2, 0.5, t)));
    return xpFrame(T, s.join(''), scr.join('')); };
  const qt = (T) => dimBy(0.5 * fin(T, c.q1 - 0.4, 0.5)) +
    quote('“You shall not press down upon the brow of labor this crown of thorns.', '', {x: 190, y: 150, w: 1540, size: 56, o: fin(T, c.q1, 0.5)}) +
    quote('You shall not crucify mankind upon a cross of gold.”', 'William Jennings Bryan · Chicago, July 9, 1896', {x: 190, y: 700, w: 1540, size: 56, o: fin(T, c.q2, 0.5)});
  const shots = [
    // "In July 1896, the Democrats, one of the two big parties, met in Chicago to pick a candidate for president."
    {a: 0, b: cut.photo, live: true, draw: (T) => lQuiet(() => renderE5Bryan(mBr1(T))) + qTag('THE DEMOCRATIC CONVENTION · CHICAGO · JULY 1896', 172, 124, lVis(T, 0.3, cut.photo + 0.3))},
    // "A 36-year-old from Nebraska named William Jennings Bryan stood up and argued for free silver."
    {a: cut.photo, b: cut.cross, cut: true, draw: (T) => qPrint(T, cut.photo, cut.cross, 'j_1896/william_jennings_bryan_cm_bell_1894_loc.jpg', {x: 300, y: 100, w: 560, ar: 1.389, rot: -1},
      'WILLIAM JENNINGS BRYAN · C. M. BELL, 1894 · LIBRARY OF CONGRESS', {ox: 580, oy: 420}) +
      qTag('WILLIAM JENNINGS BRYAN · 36 · NEBRASKA', 1000, 300, lVis(T, c.bryan - 0.3, cut.cross + 0.3)) + qTapes(T, [[c.bryan + 0.3, 'FREE SILVER', 1060, 440, 76, -2]])},
    // "He finished with his arms spread wide, like a cross: 'You shall not press down upon the brow of labor this crown of thorns. You
    //  shall not crucify mankind upon a cross of gold.'"
    {a: cut.cross, b: cut.plain, cut: true, live: true, draw: (T) => lQuiet(() => renderE5Bryan(mBr2(T))) + qt(T)},
    // "In plain words: don't sacrifice ordinary people just to protect gold." The broadside of the speech.
    {a: cut.plain, b: cut.wild, cut: true, draw: (T) => qPrint(T, cut.plain, cut.wild, 'j_1896/sixteen_to_one_speech_that_won_the_nomination_1896_loc.jpg', {x: 300, y: 70, w: 560, ar: 1.491, rot: 1},
      '"16 TO 1": THE SPEECH THAT WON THE NOMINATION · BROADSIDE, 1896 · LIBRARY OF CONGRESS', {ox: 580, oy: 380}) +
      lNote('in plain words:', 1000, 330, lVis(T, c.plain, cut.wild + 0.3), 34, -3) + lNote('don’t sacrifice ordinary people', 1000, 460, lVis(T, c.dont, cut.wild + 0.3), 34, -3) +
      lNote('just to protect gold', 1060, 580, lVis(T, c.dont + 0.6, cut.wild + 0.3), 34, -3)},
    // "The crowd went wild. The Democrats made Bryan their candidate, and the Populists backed him too."
    {a: cut.wild, b: cut.owen, cut: true, live: true, draw: (T) => lQuiet(() => renderE5Bryan(mBr3(T))) +
      qTapes(T, [[c.made, "THE DEMOCRATS' CANDIDATE", 600, 150, 60, -2], [c.made + 0.6, '+ THE POPULISTS', 820, 270, 56, 1.5]])},
    // OWEN: "Bryan's a Nebraska man. He's one of us."
    {a: cut.owen, b: cut.tour, cut: true, live: true, draw: (T) => qQ(() => renderE5Farm(T - cut.owen + 2.0)) + qSay(T, [["“Bryan's a Nebraska man.", 190, 300, c.owen], ["He's one of us.”", 230, 400, c.owen + 0.6]], lVis(T, cut.owen, cut.tour + 0.2)) +
      qTag('UNCLE OWEN · 1896', 172, 124, lVis(T, cut.owen + 0.1, cut.tour + 0.3))},
    // "Bryan crisscrossed the country."
    {a: cut.tour, b: cut.porch, cut: true, live: true, draw: (T) => e5Live(tour(T))},
    // "His opponent, Republican William McKinley, just stayed home on his porch and let voters come to him, by the trainload."
    {a: cut.porch, b: cut.poster, cut: true, live: true, draw: (T) => lQuiet(() => renderE5Porch(mPorch(T))) + qTag('CANTON, OHIO · FALL 1896', 172, 124, lVis(T, cut.porch + 0.1, cut.porch + 3.6)) +
      qTag('McKINLEY STAYS HOME', 1200, 124, lVis(T, c.porch - 0.6, cut.poster + 0.3))},
    // "McKinley promised steady jobs and a strong dollar, and some factory owners warned that if Bryan won, the factory might close."
    {a: cut.poster, b: cut.work, cut: true, draw: (T) => qPrint(T, cut.poster, cut.work, 'j_1896/our_home_defenders_mckinley_poster_1896_loc.jpg', {x: 260, y: 80, w: 600, ar: 1.365, rot: -1},
      '"OUR HOME DEFENDERS" · McKINLEY CAMPAIGN POSTER, 1896 · LIBRARY OF CONGRESS', {ox: 560, oy: 400}) +
      qTapes(T, [[c.steady, 'STEADY JOBS', 1000, 180, 64, -2], [c.strong, 'A STRONG DOLLAR', 1040, 320, 64, 1.5]]) +
      lNote('"if Bryan wins,', 1000, 600, lVis(T, c.some + 0.6, cut.work + 0.3), 34, -3) + lNote('the factory might close"', 1040, 700, lVis(T, c.some + 0.6, cut.work + 0.3), 34, -3)},
    // "Michael had his job back by then." Back on the refinery floor with a sack.
    {a: cut.work, b: cut.kitchen, cut: true, live: true, draw: (T) => lQuiet(() => renderE5Refinery(T - cut.work + 1.6)) + qTag('MICHAEL, BACK AT WORK · 1896', 172, 124, lVis(T, cut.work + 0.1, cut.kitchen + 0.3))},
    // "At the Kellys' kitchen table, the family split." TOMMY / MICHAEL / MA (the clip is synced to these words from 65.5 s)
    {a: cut.kitchen, b: cut.map, cut: true, live: true, draw: (T) => `<div style="position:absolute;inset:0;transform:scale(1.12);transform-origin:880px 980px">${renderE5Kitchen1896(Math.max(0, T - 65.5), {quiet: true})}</div>` + qTag("THE KELLYS' KITCHEN · FALL 1896", 172, 124, lVis(T, cut.kitchen + 0.2, cut.kitchen + 3.4))},
    // "McKinley won. Most city voters, including many factory workers, chose him. Bryan won the farm states, and it wasn't enough."
    {a: cut.map, b: cut.fade, cut: true, live: true, draw: (T) => e5Live(renderE5Map1896(T - cut.map, EL))},
    // "Soon the economy improved, and the Populists faded away." The 1892 ticket greys and fades on the desk.
    {a: cut.fade, b: cut.door, cut: true, draw: (T) => { const g = clamp01((T - c.faded + 0.3) / 1.4);
      return qDesk(T, cut.fade, cut.door, `<div style="position:absolute;inset:0;opacity:${(1 - 0.7 * g).toFixed(3)};filter:grayscale(${g.toFixed(3)})">${printCard('i_populists/peoples_party_candidates_weaver_field_1892_loc.jpg', {x: 660, y: 70, w: 600, ar: 1.345, rot: 1, o: fin(T, cut.fade + 0.05, 0.4), T})}</div>`) +
        qTapes(T, [[c.soon + 0.2, 'THE ECONOMY IMPROVED', 180, 160, 52, -2]]) + lNote('the Populists faded away', 1080, 900, lVis(T, L('Populists', 94.1) - 0.3, cut.door + 0.2), 32, -3) +
        lSrc("PEOPLE'S PARTY CANDIDATES, 1892 · LIBRARY OF CONGRESS", lVis(T, cut.fade + 0.2, cut.door + 0.4)); }},
    // "The third door had closed. So where did ordinary Americans stand? Time to check the scorecard."
    {a: cut.door, b: dur, cut: true, live: true, draw: (T) => renderDoorClose(mDoor(T), 2) + batonCard(T, cardAt, 'The Scorecard')},
  ];
  return {dur, shots};
};
window.HOLD.ch09 = {}; window.CARRY.ch09 = {};
