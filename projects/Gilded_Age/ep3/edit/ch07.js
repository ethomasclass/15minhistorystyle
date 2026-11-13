// Chapter 7, "Sweatshop" (82.2 s of narration + the baton card). Riis's Ludlow Street sweatshop and the word; the contractor's
// round on the 3D model and the dive into the Rabinowitzes' front room (ep3_map_sweatshop, on its own clock); the family at work,
// the camera going to each one as they are named, Sore counting finished pieces onto a pile; Riis on the desk, his numbers
// (ep3_piecework's card); "Sound familiar?": the Rabinowitzes and Ma Kelly sewing by the piece side by side (Ep 2's kelly_flat);
// the jar for a cousin's ticket; the enclave network again for "Mostly, other newcomers"; the model pulls back, and the card
// "Shut the Door" lands on "shut the door".
EDITS.ch07 = () => {
  const ch = 'ch07_sweatshop', w = (word, n) => wordAt(ch, word, n);
  const cardAt = w('shut'), dur = cardAt + Math.max(CARD_HOLD, 2.8);
  const c = {sweat: w('sweatshop'), contractor: w('contractor,'), so: w('So', 1), yankel: w('Yankel'), rivke: w('Rivke,'), sore: w('Sore'), even: w('Even'),
    f14: w('Fourteen.'), f15: w('Fifteen.'), f16: w('Sixteen.'), riis: w('reporter') - 0.08, knee: w('knee'), beginners: w('Beginners'), they: w('They'),
    sound: w('Sound'), ma: w('Ma'), it: w('It'), together: w('together,'), every: w('every'), cents: w('cents', 2), so2: w('So', 2), mostly: w('Mostly,'),
    family: w('Family.'), neighbors: w('Neighbors.'), people: w('People'), but: w('But', 2)};
  // the front room: camera keys [T, zoom, ux, uy] through a monotone cubic (zoom in log space), to each worker as they are named
  // (the room is a cut-open box about 1,080 px wide: from zoom 1.9 up the frame stays inside it, so close-ups pan only a little and
  // put the person named on their own third of the frame)
  const CAM = [[c.so - 0.1, 1.24, 960, 632], [c.yankel + 0.2, 1.95, 905, 600], [c.rivke - 0.5, 1.95, 910, 610], [c.rivke + 0.4, 2.1, 960, 660],
    [c.sore - 0.5, 2.1, 965, 660], [c.sore + 0.3, 2.0, 1015, 650], [c.even - 0.4, 2.0, 1012, 660], [c.even + 0.4, 2.3, 1000, 800],
    [c.f14 - 0.7, 2.3, 1010, 790], [c.f14 - 0.1, 2.3, 1075, 700], [c.f16 + 0.6, 2.36, 1078, 696], [c.riis + 0.2, 2.2, 1060, 690]].map(([t, z, x, y]) => [t, Math.log(z), x, y]);
  const camAtT = (T) => { const [lz, ux, uy] = emInterp(CAM, T); return {z: Math.exp(lz), ux, uy}; };
  const room = (T, cam) => renderSweatshopB(T, {cam: cam || camAtT(T), counts: [c.f14 + 0.25, c.f15 + 0.25, c.f16 + 0.25]});
  // Ma Kelly sewing shirts by the lamp (Ep 2, lookdev/mansion.js renderFlat; before her daughter comes in, t < 2.4)
  const maFlat = (T) => renderFlat({t: 0.6 + (T - c.sound) * 0.3, cam: {z: 1.55, ux: 470, uy: 690}, quiet: true});
  // the answer on tape, landing on its words; carried over the pull-out until 79.3 so every strip gets its reading time
  const answers = (T) => op(fout(T, 79.0, 0.3), (T > c.mostly ? slideUp(fin(T, c.mostly), tape('MOSTLY, OTHER NEWCOMERS', {x: 150, y: 210, size: 78, rot: -2, seed: 701})) : '') +
      (T > c.family ? slideUp(fin(T, c.family), tape('FAMILY', {x: 300, y: 760, size: 64, rot: -3, seed: 702})) : '') +
      (T > c.neighbors ? slideUp(fin(T, c.neighbors), tape('NEIGHBORS', {x: 760, y: 820, size: 64, rot: 2, seed: 703})) : '') +
      (T > c.people ? slideUp(fin(T, c.people), tape('PEOPLE FROM HOME', {x: 1220, y: 740, size: 64, rot: -2, seed: 704})) : ''));
  const shots = [
    // 1. "A sweatshop was a workshop where people worked long hours, for very little money," Riis's Ludlow Street shop, and the word.
    {a: 0, b: 5.0, draw: (T) => lPrint(T, 0, 5.0, 'desk/riis_ludlow_sweatshop_1889.webp', {x: 150, y: 120, w: 980, rot: -1.5, z: 0.04, ox: 600}) +
      vocabCard('Sweatshop', 'SWEET-shop', 'noun', 'A workshop where people worked long hours for very little money, often inside a family&rsquo;s home.', {x: 1170, y: 170, w: 620, size: 66, rot: 2, o: fin(T, c.sweat, 0.4)}) +
      lSrc('SWEATSHOP IN A LUDLOW STREET TENEMENT · ABOUT 1889 · JACOB RIIS · LIBRARY OF CONGRESS', lVis(T, 0.2, 5.1))},
    // 2. "...often right inside a family's home. New York made more ready-made clothes than anywhere in America. Big companies cut the
    //    cloth. Then a middleman, a contractor, carried bundles of cut pieces to rooms like this one, and paid by the piece."
    //    ep3_map_sweatshop (clip t = T - 5.0): the gold building lights, the clothing firm, the contractor's round, the dive.
    {a: 5.0, b: c.so, cut: true, live: true, draw: (T) => renderSweatMap(T - SW2.T0) +
      (T > c.contractor - 0.1 ? svg(card(130, 650, 'Contractor', 'A middleman who carried cut|cloth to families and paid|them by the piece.', null, lVis(T, c.contractor, 19.0, 0.4))) : '')},
    // 3. "So Yankel pressed seams with a heavy iron heated on the stove. Rivke, twelve, ran a sewing machine. Sore sewed buttons and
    //    finished the hems by hand. Even Shmuel pulled loose threads. SORE: Fourteen. Fifteen. Sixteen." The camera goes to each.
    {a: c.so, b: c.riis, cut: true, live: true, draw: (T) => room(T) +
      lTag("THE RABINOWITZES' FRONT ROOM · 1884", 130, 120, lVis(T, c.so + 0.1, c.rivke)) +
      lNote('Yankel presses', 1100, 230, lVis(T, c.yankel + 0.2, c.rivke - 0.2)) +
      lNote('Rivke, 12, at the machine', 1000, 230, lVis(T, c.rivke - 0.1, c.sore + 0.15)) +
      lNote('Sore: buttons and hems, by hand', 130, 230, lVis(T, c.sore + 0.2, c.even - 0.2)) +
      lTag('COMPOSITE CHARACTERS', 1320, 990, lVis(T, c.sore + 0.3, c.even + 0.4)) +
      lNote('Shmuel pulls threads', 130, 230, lVis(T, c.even + 0.1, c.f14 + 0.4)) +
      lTag('IN YIDDISH', 130, 990, lVis(T, c.f14 - 0.1, c.riis))},
    // 4. "A reporter named Jacob Riis visited shops like this a few years later. He described one..." Riis, and his photograph
    //    of women finishing work by lamplight.
    {a: c.riis, b: c.knee - 0.28, cut: true, draw: (T) => `<div style="position:absolute;inset:0;transform:scale(${(1 + 0.035 * ease(clamp01((T - c.riis) / 7))).toFixed(4)})">${desk()}` +
      deskCut('desk/riis_women_sewing_1889.webp', {x: 760, y: 150, w: 980, rot: 1.5, o: fin(T, c.riis + 0.5, 0.5), T}) +
      deskCut('desk/riis_portrait_c1890.webp', {x: 190, y: 120, w: 470, rot: -2.5, o: fin(T, c.riis + 0.05, 0.5), T}) + `</div>` +
      lSrc('JACOB RIIS, ABOUT 1890 · WOMEN SEWING, ELIZABETH STREET, 1889 · LIBRARY OF CONGRESS', lVis(T, c.riis + 0.3, c.knee - 0.2)) +
      lNote('a few years later: 1889', 1040, 70, lVis(T, w('few') , c.knee - 0.2))},
    // 5. "...knee pants for seventy cents a dozen. Beginners earned two to five dollars a week. They worked from sunrise until nine
    //    at night." ep3_piecework's chain, and Riis's numbers line by line on its card.
    {a: c.knee - 0.28, b: c.sound + 0.25, cut: true, draw: (T) => renderPiecework(remap([[c.knee - 0.28, 9.45], [c.knee, 9.6], [c.beginners, 10.5], [c.they - 0.45, 11.4], [c.sound + 0.3, 12.6]])(T))},
    // 6. "Sound familiar? Back in Brooklyn, Ma Kelly was sewing shirts by the piece too." The two rooms side by side.
    {a: c.sound + 0.25, b: c.it - 0.1, cut: true, live: true, draw: (T) => twoScenes(room(T, {z: 1.75, ux: 1500, uy: 700}), maFlat(T)) +
      lTag('THE RABINOWITZES · LOWER EAST SIDE', 130, 120, lVis(T, c.sound, c.it)) + lTag("THE KELLYS · BROOKLYN", 1090, 120, lVis(T, c.sound + 0.4, c.it)) +
      lNote('shirts, paid by the piece', 1090, 990, lVis(T, c.ma, c.it + 0.1))},
    // 7. "It was brutal. But the Rabinowitzes were together, earning, and saving." The room, wide, late in the day.
    {a: c.it - 0.1, b: c.every - 0.2, cut: true, live: true, draw: (T) => room(T, {z: 1.24 + 0.08 * smooth(c.it, c.every, T), ux: 960, uy: 640}) +
      lNote('together, earning, saving', 1000, 230, lVis(T, c.together - 0.2, c.every))},
    // 8. "And every week, a few cents went into a jar marked for a cousin's ticket." The jar on the shelf; Sore drops a coin in.
    {a: c.every - 0.2, b: c.so2 - 0.1, cut: true, live: true, draw: (T) => renderJarB(T, {drops: [c.cents + 0.2], z: 1.55 + 0.12 * smooth(c.every, c.so2, T), ux: 1000, uy: 560}) +
      lNote("for a cousin's ticket", 1180, 330, lVis(T, c.cents - 0.2, c.so2 + 0.3)) + lTag('THE LABEL IS IN YIDDISH', 130, 990, lVis(T, c.every + 0.3, c.so2 + 0.3))},
    // 9. "So who helped newcomers? Mostly, other newcomers. Family. Neighbors. People from home." The enclave network again (no
    //    labels), with the answer on tape.
    {a: c.so2 - 0.1, b: c.but - 0.1, cut: true, live: true, draw: (T) => lQuiet(() => renderEnclave(28.2 + (T - c.so2) * 0.16)) + dimBy(0.45) +
      lTag('SO WHO HELPED NEWCOMERS?', 130, 120, lVis(T, c.so2, c.but)) + answers(T)},
    // 10. "But outside the neighborhood, some Americans wanted to shut the door." The model pulls up and back; the world outside the
    //     neighbourhood goes dark; the card "Shut the Door" lands on "shut the door".
    {a: c.but - 0.1, b: dur, cut: true, live: true, draw: (T) => renderModelShot(T, {keys: [[c.but - 0.1, -60, 140, 0, -18, 44, 1700, 0, 0], [dur, -60, 140, 0, -12, 52, 4300, 0, 0]],
      labels: [{lines: ['LOWER EAST SIDE'], at: [0, 480, 90], off: [0, -80], a: c.but, b: dur + 1}]}) + answers(T) +
      `<div style="position:absolute;inset:0;background:radial-gradient(ellipse ${(62 - 18 * smooth(c.but, cardAt, T)).toFixed(1)}% ${(60 - 16 * smooth(c.but, cardAt, T)).toFixed(1)}% at 50% 52%,transparent 55%,rgba(6,8,8,.9) 100%)"></div>` +
      batonCard(T, cardAt, 'Shut the Door')},
  ];
  return {dur, shots};
};
