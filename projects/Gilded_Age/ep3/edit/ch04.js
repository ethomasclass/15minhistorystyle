// Chapter 4, "Castle Garden" (0:00 to 2:04): the front door (Ulrich's 1884 painting), the numbers, the rotunda, the labor
// exchange, Ma Kelly fourteen years earlier, the name myth (the list was written in Europe; names changed later, by choice; the
// name chain), Ellis Island dated, then the RUNNER PAYOFF (ep3_runner's second half as renderE3Payoff: a clock per actor, so
// the walk-in, Rivke's watch and run, the drop and Yankel's push through the crowd each land on their words at walking speed),
// who runners were, and the new wave. Baton card "Old and New" on "new immigrants".
EDITS.ch04 = () => {
  const ch = 'ch04_castle_garden', W = window.WORDS[ch], w = (word, n) => wordAt(ch, word, n);
  const wa = (word, after) => { const k = W.words.filter((x) => x.s < after && x.w.toLowerCase().replace(/[^a-z0-9']/g, '') === word.toLowerCase()).length; return w(word, k + 1); };
  const c = {
    front: w('front'), since: w('Since'), about: w('About', 1), eight: w('eight'), two: w('two'), inside: w('Inside,'), officials: w('Officials'),
    then: w('Then'), money: w('money'), railroad: w('railroad'), desk: w('desk'), fourteen: w('Fourteen'), irish: w('Irishwoman'), ma: w('Ma'),
    now: w('Now,'), heard: w('heard'), it: wa('It', 46), copied: w('copied'), names: wa('Names', 53), shop: w('shop'), rabinovich: w('Rabinovich,'),
    rabinowitsch: wa('Rabinowitsch', 62), rabinowitz: wa('Rabinowitz', 65), rivke: w('Rivke', 1), rebecca: w('Rebecca'), ellis: w('Ellis'),
    famous: w('famous'), open: w('open'), and76: wa('And', 76), but: w('But'), heading: w('heading'), mama: w('Mama.'), sore: w('Sore!'),
    yankel: wa('Yankel', 90), when: w('When'), gone: w('gone.'), runners: w('Runners'), shady: w('shady'), sellers: w('sellers,'), charging: w('charging'),
    very: w('very'), themselves: w('themselves,'), working: w('working'), so: wa('So', 110), newcomer: wa('newcomer', 113.5), rabin2: wa('Rabinowitzes', 115),
    giant: w('giant'), americans: wa('Americans', 119),
  };
  const cardAt = W.words[W.words.length - 2].s, dur = cardAt + CARD_HOLD;           // "new immigrants"
  const T_ = (txt, x, y, o) => (o > 0.01 ? svg(tag(x, y, txt, o)) : '');
  const P_ = (txt, x, y, o, size = 32, rot = -3) => (o > 0.01 ? op(o, svg(penS(x, y, txt, size, rot))) : '');
  const clip = (fn, pts) => { const m = remap(pts); return (T) => fn(m(T)); };
  const stat = clip(renderStatCG, [[7.6, 0], [8.1, 2.4], [10.9, 5.8], [11.3, 6.4], [11.7, 7.0], [15.0, 8.8]]);
  const rotunda = clip(renderCastleGarden, [[15.0, 5.7], [22.6, 10.0]]);
  const namesA = clip(renderNames, [[46.4, 0], [c.names - 0.1, 4.35]]), namesC = clip(renderNames, [[c.names - 0.1, 7.6], [c.rabinovich - 0.1, 10.0]]);
  const namesB = clip(renderNames, [[68.6, 5.0], [72.3, 7.0]]);
  // ---- the payoff: a clock per actor (FULL_BUILD: the second half of ep3_runner, retimed to the words) ----
  const P0 = 76.1, STOP = 80.2, RUN = c.heading - 0.6, CLASP = 86.4, WK = CLASP - 2.9;      // walkers' w = T - WK (2.9 at the clasp)
  const pw = (T) => T - WK, pr = remap([[P0, -(STOP - P0)], [STOP, 0], [RUN, 1.3], [CLASP, 2.9], [CLASP + 20, 22.9]]), py = (T) => T - (89.8 - 2.4);
  const PCAM = [[P0, 1.0, 1700, 600], [STOP, 1.0, 1500, 600], [RUN, 0.96, 1450, 610], [85.6, 1.3, 1080, 680], [CLASP, 1.9, 860, 755], [87.7, 1.9, 850, 755],
    [89.0, 1.0, 1040, 610], [92.8, 1.0, 1060, 620], [97.6, 1.12, 1060, 650], [110.5, 1.12, 1060, 650], [115.6, 1.32, 1040, 690], [130, 1.32, 1040, 690]].map(([t, z, x, y]) => [t, Math.log(z), x, y]);
  const pcam = (T) => { const [lz, ux, uy] = emInterp(PCAM, T); return {z: Math.exp(lz), ux, uy}; };
  const blink = (T, ph) => ((T + ph) % 3.7) < 0.12;
  const plook = (T) => () => ({
    sore: {blink: blink(T, 0.3)}, shmuel: {blink: blink(T, 1.9)}, yankel: {blink: blink(T, 2.2)},
    rivke: {blink: blink(T, 2.6), ...(T > STOP && T < RUN ? {tilt: 4 + 4 * Math.sin((T - STOP) * 1.4)} : {})},
  });
  const payoff = (T) => renderE3Payoff({w: pw(T), r: pr(T), y: py(T), pre: WK - P0, preR: STOP - P0,
    runSteps: 13.5, te: T, cam: pcam(T), look: plook(T), ferry: smooth(c.heading - 0.3, c.heading + 0.5, T) * (1 - smooth(87.0, 87.5, T))});
  // the name chain: Russian letters, the German ticket, New York
  const nameCard = (x, name, font, sub, o) => op(o, `<div class="tx" style="position:absolute;left:${x}px;top:${(400 + 30 * (1 - ease(o))).toFixed(1)}px;width:520px;padding:40px 20px 32px;background:${C.cream};box-shadow:0 18px 30px rgba(0,0,0,.55);text-align:center;transform:rotate(-1deg)">
      <div style="font-family:${font};font-weight:900;font-size:72px;color:${C.ink};line-height:1">${name}</div>
      <div style="font-family:Mono;font-size:22px;letter-spacing:3px;color:#444;margin-top:18px;text-transform:uppercase">${sub}</div></div>`);
  const shots = [
    // 1. "Castle Garden was the front door of America. Since 1855, it was where immigrants landed in New York." Ulrich, 1884.
    {a: 0, b: 7.6, draw: (T) => push(T, 0, 7.6, 0.04) +
      printCard('c_arrival/ulrich_in_the_land_of_promise_castle_garden_1884_commons.jpg', {x: 300, y: 40, w: 1000, ar: 0.8, rot: -1, o: fin(T, 0, 0.5), T,
        caption: 'In the Land of Promise, Castle Garden &middot; Charles Ulrich, 1884'}) + `</div>` +
      P_('the front door of America', 1260, 200, fin(T, c.front, 0.3), 34) + T_('1855 TO 1890', 1380, 330, fin(T, c.since, 0.3))},
    // 2. "About eight million people passed through it. That's about two out of every three immigrants of those years."
    {a: 7.6, b: 15.0, live: true, draw: (T) => stat(T)},
    // 3. "Inside, clerks asked each newcomer the same questions. Name. Age. Country. Where are you going?" The rotunda.
    {a: 15.0, b: 22.6, live: true, draw: (T) => rotunda(T)},
    // 4. "Officials watched for anyone who seemed sick. Then on, past money changers, railroad ticket sellers, and a desk that
    //    handed out jobs." The labor exchange at Castle Garden (Harper's, 1868).
    {a: 22.6, b: 31.4, draw: (T) => push(T, 22.6, 31.4, 0.035) +
      printCard('c_arrival/labor_exchange_castle_garden_harpers_1868_loc90709503.jpg', {x: 150, y: 40, w: 680, ar: 1.243, rot: -1.2, o: fin(T, 22.6, 0.5), T,
        caption: 'The labor exchange, Castle Garden &middot; Harper&rsquo;s, 1868'}) + `</div>` +
      P_('officials watched for the sick', 960, 230, fin(T, 22.7, 0.3), 32) +
      P_('money changers', 1000, 420, fin(T, c.money, 0.3), 34) + P_('railroad tickets', 1000, 540, fin(T, c.railroad, 0.3), 34) +
      P_('a desk that handed out jobs', 1000, 660, fin(T, c.desk, 0.3), 34)},
    // 5. "Fourteen years earlier, a young Irishwoman had stood in this same room, holding the same kind of bundle. You've met her.
    //    That's Ma Kelly." The rotunda, about 1870; a coral figure: a Kelly.
    {a: 31.4, b: 41.2, draw: (T) => push(T, 31.4, 41.2, 0.035) +
      printCard('c_arrival/castle_garden_rotunda_interior_c1870s_nypl423062.jpg', {x: 110, y: 110, w: 1060, ar: 0.661, rot: 1, o: fin(T, 31.4, 0.5), T,
        caption: 'Inside Castle Garden &middot; engraving, about 1870'}) + `</div>` +
      T_('ABOUT 1870', 1330, 200, fin(T, 31.5, 0.3)) + P_('a young Irishwoman, with a bundle', 1290, 340, fin(T, c.irish, 0.3), 26) +
      op(fin(T, c.ma - 0.3, 0.4), svg(xpPerson(1560, 860, 230, C.coral, {skirt: true}) + `<rect x="1610" y="790" width="70" height="44" rx="12" fill="${C.cream}" stroke="#111" stroke-width="3"/>`)) +
      P_('that&rsquo;s Ma Kelly', 1380, 960, fin(T, c.ma, 0.3), 36)},
    // 6. "Now, about names. You may have heard that clerks changed people's names when they arrived, because they couldn't spell them."
    {a: 41.2, b: c.it - 0.1, draw: (T) => push(T, 41.2, c.it, 0.035) +
      printCard('c_arrival/registering_emigrants_castle_garden_1866_loc2001697361.jpg', {x: 150, y: 80, w: 900, ar: 0.79, rot: -1.5, o: fin(T, 41.2, 0.5), T,
        caption: 'Registering emigrants, Castle Garden &middot; 1866'}) + `</div>` +
      T_('ABOUT NAMES', 1180, 220, fin(T, 41.3, 0.3)) + P_('&ldquo;the clerks changed our name&rdquo;?', 1170, 400, fin(T, c.heard, 0.3), 30)},
    // 7. "It almost never happened. The clerks copied names from the ship's passenger list, and that list was written back in Europe."
    {a: c.it - 0.1, b: c.names - 0.1, live: true, draw: (T) => namesA(T) + P_('it almost never happened', 1150, 1000, fin(T, c.it, 0.3) * fout(T, c.copied + 1.8), 32)},
    // 8. "Names did change, but later, and usually by choice: at school, at work, on a shop sign." Later still: his own shop.
    {a: c.names - 0.1, b: c.rabinovich - 0.1, live: true, draw: (T) => namesC(T)},
    // 9. "Rabinovich, in Russian letters, became 'Rabinowitsch' on a German ticket, and Rabinowitz in New York."
    {a: c.rabinovich - 0.1, b: 68.6, draw: (T) => svg(xpBoard(3)) +
      nameCard(110, 'Рабинович', 'Playfair', 'Russian letters', fin(T, c.rabinovich, 0.4)) +
      nameCard(700, 'Rabinowitsch', 'Playfair', 'a German ticket', fin(T, c.rabinowitsch, 0.4)) +
      nameCard(1290, 'Rabinowitz', 'Playfair', 'New York', fin(T, c.rabinowitz, 0.4)) +
      svg(drawLine([[635, 570], [695, 570]], fin(T, c.rabinowitsch - 0.3, 0.4)) + drawLine([[1225, 570], [1285, 570]], fin(T, c.rabinowitz - 0.3, 0.4))) +
      T_('ONE NAME, THREE SPELLINGS', 130, 200, fin(T, c.rabinovich, 0.4))},
    // 10. "Rivke would become Rebecca at school." Later: school, Brooklyn.
    {a: 68.6, b: 72.3, live: true, draw: (T) => namesB(T)},
    // 11. "Ellis Island, where most of the famous photos come from, didn't open until 1892."
    {a: 72.3, b: P0, draw: (T) => push(T, 72.3, P0, 0.03) +
      printCard('c_arrival/ellis_island_immigrants_just_arrived_c1904_loc97501095.jpg', {x: 110, y: 170, w: 960, ar: 0.518, rot: -1.5, o: fin(T, 72.3, 0.5), T,
        caption: 'Immigrants just arrived, Ellis Island &middot; about 1904'}) +
      printCard('c_arrival/ellis_island_station_kings_handbook_1893_commons.jpg', {x: 1160, y: 330, w: 640, ar: 0.716, rot: 2, o: fin(T, c.famous, 0.5), T,
        caption: 'The first Ellis Island station &middot; 1893'}) + `</div>` +
      T_('ELLIS ISLAND OPENED IN 1892', 1150, 240, fin(T, 73.2, 0.3))},
    // 12. The payoff. "And just outside it, a man was walking away with their trunk. But Rivke was twelve, and she was watching. They
    //     were heading away from the ferries. RIVKE: Mama. Stop. YANKEL: Sore! Sore! Yankel shoved through the crowd, late from work.
    //     When they turned around, the man with the good coat was gone."
    {a: P0, b: c.runners - 0.1, cut: true, live: true, draw: (T) => payoff(T) +
      T_('A FEW MINUTES LATER', 130, 120, fin(T, P0 + 0.2, 0.3) * fout(T, 79.6)) +
      P_('heading away from the ferries', 130, 230, fin(T, c.heading, 0.3) * fout(T, 87.4), 32) +
      T_('SPEAKING YIDDISH', 150, 1000, fin(T, c.mama - 0.2) * fout(T, 90.2)) +
      P_('Yankel, late from work', 1060, 230, fin(T, c.yankel, 0.3) * fout(T, c.when + 0.2), 32) +
      P_('the man in the good coat was gone', 130, 230, fin(T, c.when, 0.3), 32)},
    // 13. "Runners worked for shady boarding houses and ticket sellers, charging newcomers too much for a bed or a ticket. And very
    //     often, they were immigrants themselves, working their own people in their own language."
    {a: c.runners - 0.1, b: c.so - 0.1, live: true, draw: (T) => xpFrame(T, xpBoard(5),
      tapeS(130, 80, 'RUNNERS', 64, -2, fin(T, c.runners, 0.3), 51) +
      xpOp(fin(T, c.shady, 0.4), xpHouse(250, 520, 2.2, XP.mute2) + tag(170, 610, 'SHADY BOARDING HOUSES', 1)) +
      xpOp(fin(T, c.sellers - 0.3, 0.4), xpTicket(960, 420, 2.4, -6) + tag(800, 610, 'TICKET SELLERS', 1)) +
      xpOp(fin(T, c.charging, 0.4), xpCoin(1440, 420, 2.4) + xpCoin(1560, 440, 2.4) + xpCoin(1500, 360, 2.4) + tag(1270, 610, 'TOO MUCH, FOR A BED OR A TICKET', 1)) +
      xpOp(fin(T, c.very, 0.4), xpPerson(300, 960, 220, XP.ink, {stroke: XP.pale}) + tag(420, 860, 'VERY OFTEN, IMMIGRANTS THEMSELVES', fin(T, c.themselves - 0.3, 0.3))) +
      (T > c.working ? xpOp(fin(T, c.working, 0.3), penS(430, 960, 'working their own people, in their own language', 30, -2)) : ''))},
    // 14. "So the first person to try to cheat this family in America was a newcomer too." Back at the Battery, all four together.
    {a: c.so - 0.1, b: c.rabin2 - 0.2, cut: true, live: true, draw: (T) => payoff(T) + P_('a newcomer too', 130, 230, fin(T, 112.0, 0.3), 40)},
    // 15. "And the Rabinowitzes were part of a giant new wave. Americans had a name for them: new immigrants." The card: Old and New.
    {a: c.rabin2 - 0.2, b: dur, draw: (T) => push(T, c.rabin2, dur, 0.04) +
      printCard('c_arrival/immigrants_landing_castle_garden_shults_harpers_1880_loc90707732.jpg', {x: 130, y: 80, w: 1100, ar: 0.673, rot: -1, o: fin(T, c.rabin2 - 0.2, 0.5), T,
        caption: 'Immigrants landing at Castle Garden &middot; Harper&rsquo;s, 1880'}) + `</div>` +
      P_('a giant new wave', 1300, 260, fin(T, c.giant, 0.3), 40) + batonCard(T, cardAt, 'Old and New')},
  ];
  return {dur, shots};
};
