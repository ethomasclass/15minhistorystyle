// Chapter 3, "Strength in Numbers" (0:00 to 1:09). lookdev/ep5_explain.js ep5_x_weapons with its beats on the words (WORKERS' TOOLS:
// union, collective bargaining, strike; OWNERS' WEAPONS: blacklist, lockout, strikebreakers, courts and soldiers), a vocabulary card
// for each term; the first Labor Day parade (1882) for "a thousand workers asking at once"; Koehler's The Strike (1886) for the strike;
// the Great Railroad Strike of 1877 in Pittsburgh (photographs of the roundhouse and the wrecked cars: no people); the baton
// "Two Kinds of Unions".
EDITS.ch03 = () => {
  const ch = 'ch03_strength_in_numbers', w = (word, n) => wordAt(ch, word, n), L = (word, near) => lWord(ch, word, near);
  const c = {
    union: w('union:'), thousand: w('thousand'), when: w('When'), collective: w('collective'), and: L('And', 25.4), strike: w('strike.'), no: L('No', 30.2),
    but: L('But', 35.6), weapons: w('weapons'), blacklist: w('blacklist,'), lock: w('lock'), lockout: w('lockout.'), breakers: w('strikebreakers'), courts: w('courts,'),
    y1877: L('In', 55.7), sent: w('sent'), hundred: w('hundred'), there: L('There', 63.8), two: w('two'),
  };
  const cardAt = c.two, dur = cardAt + CARD_HOLD;
  // ep5_x_weapons' cue table in chapter seconds (renderX5Weapons(t, C) compares t with these directly)
  const WC = {...X5_WEAP, title: -1, w1: c.union - 0.1, w2: c.collective, w3: c.strike, o0: c.weapons - 0.3, o1: c.blacklist, o2: c.lock + 0.2, o3: c.breakers, o4: c.courts};
  const board = (T) => renderX5Weapons(T, WC);
  const V = (term, say, def, o, y = 250, x = 1060) => vocabCard(term, say, 'noun', def, {x, y, w: 640, o, size: 64});
  const VL = (term, say, def, o, y) => vocabCard(term, say, 'noun', def, {x: 190, y, w: 680, o, size: 60, rot: -1.5});
  const cuts = {parade: c.thousand - 0.25, bargain: c.when - 0.1, strike: c.and - 0.1, owners: c.but - 0.1, y1877: c.y1877 - 0.15};
  const shots = [
    // "That's the idea behind a union: a group of workers who join together to deal with their boss as one. One worker who asks for a
    //  raise can be fired."
    {a: 0, b: cuts.parade, draw: (T) => board(T) + V('union', 'YOON-yun', 'a group of workers who join together to deal with their boss as one', fin(T, c.union, 0.35))},
    // "A thousand workers asking at once are much harder to ignore." The first Labor Day parade, Union Square, 1882.
    {a: cuts.parade, b: cuts.bargain, draw: (T) => push(T, cuts.parade, cuts.bargain, 0.04) +
      printCard('d_afl_gompers/first_labor_day_parade_nyc_leslies_1882_commons.jpg', {x: 300, y: 130, w: 1320, ar: 0.649, rot: -1, o: fin(T, cuts.parade, 0.4), T,
        caption: "the first Labor Day parade &middot; New York &middot; Leslie's, 1882"}) + `</div>`},
    // "When a union and a company sit down to agree on pay, hours and safety, that's called collective bargaining. Collective means
    //  together. Bargaining means negotiating."
    {a: cuts.bargain, b: cuts.strike, draw: (T) => board(T) + V('collective bargaining', 'kuh-LEK-tiv BAR-gin-ing', 'a union and a company agree on pay, hours and safety', fin(T, c.collective, 0.35)) +
      lNote('together + negotiating', 1080, 760, fin(T, c.collective + 1.6, 0.35), 30)},
    // "And if the company says no? Everybody walks out. That's a strike. No workers, no product, no profit. Suddenly the boss wants to talk."
    {a: cuts.strike, b: cuts.owners, draw: (T) => push(T, cuts.strike, cuts.owners, 0.04) +
      printCard('c_knights_haymarket/the_strike_koehler_1886_loc.jpg', {x: 300, y: 120, w: 500, ar: 1.531, rot: -1.5, o: fin(T, cuts.strike, 0.4), T,
        caption: "Robert Koehler, The Strike &middot; engraved 1886"}) + `</div>` +
      V('strike', 'STRYKE', 'everybody walks out until the company deals with them', fin(T, c.strike, 0.35), 200, 1000) +
      lNote('no workers, no product, no profit', 1000, 760, fin(T, c.no, 0.35), 30)},
    // "But owners had weapons too. They could fire union members and put their names on a blacklist... They could lock the gates, with
    //  no pay, until workers gave in. That's a lockout. They could hire strikebreakers to replace the strikers. And they could call on
    //  the courts, private guards, even soldiers." The owners' column fills; the cards sit over the workers' column.
    {a: cuts.owners, b: cuts.y1877, draw: (T) => board(T) +
      // the workers' column steps back under the cards (so the cards never sit on its words)
      `<div style="position:absolute;left:0;top:0;width:945px;height:1080px;background:rgba(12,18,17,${(0.9 * fin(T, c.blacklist - 0.35, 0.35)).toFixed(3)})"></div>` +
      VL('blacklist', 'BLAK-list', 'a list of union members no other company will hire', lVis(T, c.blacklist, c.breakers - 0.1), 230) +
      VL('lockout', 'LOK-out', 'the owner locks the gates, with no pay, until workers give in', lVis(T, c.lock + 0.2, c.courts + 1.4), 560) +
      VL('strikebreakers', 'STRYKE-bray-kerz', 'workers hired to replace the strikers', lVis(T, c.breakers, c.courts + 1.4), 230)},
    // "In 1877, a railroad strike spread across the country until the President sent in troops, and about a hundred people died. There
    //  had to be a better way. And two kinds of unions offered one." Pittsburgh: the roundhouse where the troops were besieged, the
    //  wrecked cars; the baton on "two".
    {a: cuts.y1877, b: dur, draw: (T) => push(T, cuts.y1877, dur, 0.04) +
      printCard('b_1877_strike/lower_roundhouse_where_troops_were_besieged_photo_1877_loc.jpg', {x: 190, y: 190, w: 1000, ar: 0.57, rot: -1.5, o: fin(T, cuts.y1877, 0.4), T,
        caption: 'S. V. Albee &middot; the roundhouse, Pittsburgh &middot; 1877'}) +
      printCard('b_1877_strike/devastation_of_railroad_cars_locomotives_photo_1877_loc.jpg', {x: 1260, y: 300, w: 470, ar: 1.184, rot: 2, o: fin(T, c.sent - 0.3, 0.4), T,
        caption: 'wrecked cars, Pittsburgh &middot; 1877'}) + `</div>` +
      lTag('THE GREAT RAILROAD STRIKE · 1877', 190, 124, fin(T, c.y1877 + 0.2, 0.35)) +
      lNote('about 100 people died', 220, 900, fin(T, c.hundred - 0.3, 0.35), 34) + batonCard(T, cardAt, 'Two Kinds of Unions')},
  ];
  return {dur, shots};
};
window.HOLD.ch03 = {}; window.CARRY.ch03 = {};
