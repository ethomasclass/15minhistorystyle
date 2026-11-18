// Chapter 7, "The Money Problem" (117.5 s of narration + the baton card). The teaching chapter, all on the dark diagram board: a
// short "economics" opener; Owen's loan (ep5_x_loan); greenbacks and inflation (ep5_x_inflation); the gold standard (ep5_x_gold);
// "the amount of money barely grew" (a drawn chart: things to buy climb, money stays flat, prices go down); the bread town
// (ep5_x_bread); Owen at his table for "it's a disaster" (ep5_farm_kitchen, his pause); free silver (ep5_x_silver); Michael worried
// about bread (ep5_kitchen_1887, his mug); "I feed you all!" (1875) for the government that wasn't listening; the card "A Party of
// Their Own" on "a party of their own". Vocabulary cards (inflation, gold standard, deflation, free silver) over the dimmed
// explainer each time the word is said. Helpers q... in ch06.js.

/** A vocab card over a dimmed explainer, from t0 (held to the shot's end). */
const q7Vocab = (T, t0, term, def) => (T < t0 - 0.05 ? '' : dimBy(0.55 * fin(T, t0, 0.35)) + vocab(560, 330, term, def, fin(T, t0, 0.4)));

EDITS.ch07 = () => {
  const ch = 'ch07_the_money_problem', L = (word, near) => lWord(ch, word, near);
  const cardAt = L('a', 116.4), dur = cardAt + CARD_HOLD;
  const c = {econ: L('economics.', 2.6), but: L('But', 3.7), key: L('key', 5.7), say: L('Say', 7.8), thousand: L('thousand', 9.2), dollar: L('dollar', 11.2), sell1: L('thousand', 14.4),
    ten: L('Ten', 15.7), fifty: L('fifty', 17.6), still: L('still', 19.1), two: L('two', 22.5), same: L('Same', 24.1), during: L('During', 28.1), printed: L('printed', 31.1),
    green: L('greenbacks,', 33.4), more: L('more', 36.6), stuff: L('same', 37.6), charge: L('charge', 40.0), up: L('up.', 41.6), infl: L('inflation.', 42.9), after: L('After', 44.3),
    pulled: L('It', 46.9), silver1: L('stopped', 48.5), tied: L('tied', 50.3), gs: L('gold', 52.9), only: L('only', 54.8), america: L('But', 57.8), barely: L('barely', 62.9),
    so: L('So', 64.2), down: L('Down.', 66.1), picture: L('Picture', 67.1), hundred: L('hundred', 68.1), loaves: L('loaves', 69.6), each: L('Each', 70.7), bakes: L('bakes', 73.3),
    stillOnly: L('still', 75.3), fiftyC: L('fifty', 78.7), defl: L('deflation,', 83.9), selling: L('But', 89.1), disaster: L('disaster.', 91.8), fix: L('Farmers', 93.1),
    make: L('make', 94.6), silver2: L('silver', 95.6), moreM: L('More', 96.9), wheat: L('Wheat', 98.9), owens: L("Owen's", 100.9), free: L('free', 104.2), bankers: L('Bankers', 105.4),
    city: L('And', 107.0), bread: L('bread.', 110.0), needed: L('Farmers', 111.0), wasnt: L('But', 113.5), party: L('party', 116.5)};
  const cut = {loan: c.say - 0.3, infl: c.during - 0.25, gold: c.pulled - 0.25, grow: c.america - 0.2, bread: c.picture - 0.2, owen: c.selling - 0.1, silver: c.fix - 0.2,
    mich: c.city + 0.9, feed: c.needed - 0.2};
  // ---- the explainers, beat for beat on the words ----
  const mLoan = remap([[cut.loan, 0], [c.thousand, 0.4], [c.dollar, 1.8], [c.sell1 - 0.4, 2.4], [c.sell1 + 0.4, 3.0], [c.fifty, 5.0], [c.two, 5.6], [c.two + 0.9, 6.7], [c.same, 8.6], [cut.infl + 0.5, 11.2]]);
  const mInfl = remap([[cut.infl, 0], [c.during + 0.2, 0.3], [c.printed, 0.8], [c.more, 2.0], [c.stuff, 3.2], [c.charge, 4.4], [c.up + 0.2, 6.4], [c.infl, 7.0], [cut.gold + 0.5, 9.4]]);
  const mGold = remap([[cut.gold, 0], [c.pulled + 0.1, 0.3], [c.silver1, 0.6], [c.tied - 0.6, 1.8], [c.tied, 3.0], [c.tied + 0.7, 4.0], [c.gs, 4.6], [c.only, 5.6], [cut.grow + 0.5, 8.6]]);
  const mBread = remap([[cut.bread, 0], [c.hundred, 0.5], [c.loaves, 1.4], [c.each + 0.9, 3.0], [c.bakes + 0.4, 5.0], [c.stillOnly, 6.6], [c.fiftyC, 7.8], [c.defl, 9.6], [cut.owen + 0.5, 12.0]]);
  const mSilver = remap([[cut.silver, 0], [c.fix + 0.2, 0.3], [c.make, 0.8], [c.silver2, 1.8], [c.silver2 + 0.6, 2.4], [c.wheat, 4.0], [c.wheat + 1.3, 6.6], [c.owens, 7.0], [cut.mich + 0.5, 10.6]]);
  // the opener: ECONOMICS slapped on the board, the wheat and a coin, "stay with me", "the key to the whole fight"
  const opener = (T) => { const s = [x5Board(3)], scr = [];
    s.push(x5Icon('wheat', 700, 580, x5Pop(1.0, T) * 3.2) + x5Icon('coin', 1230, 580, x5Pop(1.6, T) * 3.0));
    if (T > 1.6) { const g = 0.5 + 0.5 * Math.sin(T * 3.1); s.push(`<circle cx="1280" cy="530" r="${f1(4 + 2 * g)}" fill="#FFD36B" opacity="${f1(0.6 + 0.4 * g)}"/>`); }
    s.push(xpArrow(xpCurve([840, 580], [1100, 580], 80), x5In(2.0, T, 0.8)));
    scr.push(x5Op(x5In(c.econ, T, 0.2), tapeS(640, 230, 'ECONOMICS.', 86, -2, 1, 71)));
    scr.push(x5Op(x5In(c.but + 0.2, T), x5Pen(560, 880, 'stay with me...', 40, -3)));
    scr.push(x5Op(x5In(c.but + 0.7, T), x5Pen(1010, 960, 'the key to the whole fight', 36, -3)));
    return x5Frame(T, s.join(''), scr.join('')); };
  // "the amount of money barely grew. So prices went the other way. Down." Two lines over the years: things to buy, money; then prices
  const grow = (T) => { const s = [x5Board(6)], scr = [], X0 = 330, X1 = 1500, Y0 = 820;
    s.push(`<path d="M${X0},${Y0} L${X1 + 40},${Y0} M${X0},${Y0} L${X0},250" stroke="${X5.pale}" stroke-width="4" fill="none"/>`);
    const stuff = [...Array(31).keys()].map((i) => [X0 + i * (X1 - X0) / 30, Y0 - 60 - 420 * Math.pow(i / 30, 1.25)]);
    const money = [...Array(31).keys()].map((i) => [X0 + i * (X1 - X0) / 30, Y0 - 120 - 40 * (i / 30)]);
    s.push(xpArrow(stuff, x5In(c.america + 0.3, T, 2.6), {w: 7}));
    s.push(xpArrow(money, x5In(c.barely - 1.4, T, 2.2), {w: 7, col: X5.cream}));
    scr.push(x5Op(x5In(c.america + 1.6, T), x5Mono(1080, 300, 'THINGS TO BUY AND SELL', 28, X5.teal)));
    scr.push(x5Op(x5In(c.barely - 0.6, T), x5Mono(1180, 640, 'MONEY', 28, X5.cream)));
    scr.push(x5Op(x5In(c.america + 0.1, T), x5Mono(X1 - 40, Y0 + 50, 'THE YEARS AFTER THE WAR', 22, X5.pale, 'end')));
    const kd = x5In(c.so, T, 0.3);
    scr.push(x5Op(kd, tapeS(400, 150, 'PRICES', 72, -2, 1, 77)));
    if (kd > 0) s.push(xpArrow([[760, 170], [760, 420]], x5In(c.down - 0.3, T, 0.4), {w: 10, col: X5.orange}));
    return x5Frame(T, s.join(''), scr.join('')); };
  const shots = [
    // "Okay. I know, I know: economics. But stay with me, because this is the key to the whole fight."
    {a: 0, b: cut.loan, draw: (T) => opener(T)},
    // "Say Uncle Owen borrows a thousand dollars when wheat sells for a dollar a bushel. To pay it back, he needs to sell a thousand
    //  bushels. Ten years later, wheat sells for fifty cents. He still owes a thousand dollars. But now he has to sell two thousand
    //  bushels. Same debt. Twice the work. You see the problem."
    {a: cut.loan, b: cut.infl, cut: true, draw: (T) => renderX5Loan(mLoan(T)) + lNote('ten years later', 1220, 980, lVis(T, c.ten, c.still - 0.05), 30, -3) +
      lNote('still owes $1,000', 1220, 980, lVis(T, c.still, c.same), 30, -3)},
    // "During the Civil War, in the 1860s, the government printed lots of extra paper money, called greenbacks, to pay for the war. When
    //  there's suddenly a lot more money, but the same amount of stuff to buy, sellers can charge more. Prices go up. That's called inflation."
    {a: cut.infl, b: cut.gold, cut: true, draw: (T) => renderX5Inflation(mInfl(T)) + qTag('THE CIVIL WAR · THE 1860s', 172, 976, lVis(T, cut.infl + 0.3, c.more)) +
      q7Vocab(T, c.infl - 0.2, 'Inflation', 'Prices go up: lots more money,|but the same amount of stuff|to buy.')},
    // "After the war, the government did the opposite. It pulled money back out, stopped making silver dollars, and tied every dollar to
    //  gold. That's the gold standard: the country could only have as many dollars as it had gold."
    {a: cut.gold, b: cut.grow, cut: true, draw: (T) => renderX5Gold(mGold(T)) + qTag('AFTER THE WAR · THE 1870s', 172, 976, lVis(T, cut.gold + 0.2, c.tied)) +
      q7Vocab(T, c.gs - 0.15, 'Gold standard', 'Every dollar tied to gold: only as|many dollars as the country|had gold.')},
    // "But America kept growing, with more and more things to buy and sell, and the amount of money barely grew. So prices went the other way. Down."
    {a: cut.grow, b: cut.bread, cut: true, draw: (T) => grow(T)},
    // "Picture a town with a hundred dollars and a hundred loaves of bread. Each loaf sells for a dollar. Now the town bakes two hundred
    //  loaves, but there are still only a hundred dollars. Each loaf now sells for fifty cents. More stuff, same money, so prices fall.
    //  That's deflation, the opposite of inflation. Cheaper bread is great if you're buying."
    {a: cut.bread, b: cut.owen, cut: true, draw: (T) => renderX5Bread(mBread(T)) + q7Vocab(T, c.defl + 0.6, 'Deflation', 'Prices fall: more stuff, same|money. The opposite of inflation.')},
    // "But if you're selling wheat, and you owe the bank, it's a disaster." Owen stops writing and rubs his brow (FK.pause).
    {a: cut.owen, b: cut.silver, cut: true, live: true, draw: (T) => qQ(() => renderE5Farm(remap([[cut.owen, 5.4], [c.disaster, 8.4], [cut.silver + 0.5, 10.0]])(T))) +
      lNote('selling wheat + owing the bank', 190, 230, lVis(T, c.selling + 0.4, cut.silver + 0.3), 30) + lNote('= a disaster', 250, 330, lVis(T, c.selling + 0.4, cut.silver + 0.3), 34)},
    // "Farmers had a fix: make dollars out of silver too. More money, higher prices. Wheat climbs back toward a dollar, and Owen's debt
    //  gets easier to pay. That idea was called free silver. Bankers hated it."
    {a: cut.silver, b: cut.mich, cut: true, draw: (T) => renderX5Silver(mSilver(T)) + q7Vocab(T, c.free - 0.2, 'Free silver', 'Making dollars out of silver too:|more money, higher prices.') +
      qTapes(T, [[c.bankers - 0.2, 'BANKERS HATED IT', 940, 790, 60, 2]])},
    // "And city workers like Michael worried it meant more expensive bread." Michael at the kitchen table with his mug.
    {a: cut.mich, b: cut.feed, cut: true, live: true, draw: (T) => `<div style="position:absolute;inset:0;transform:scale(1.27);transform-origin:40px 960px">${qQ(() => renderE5Kitchen1887(remap([[cut.mich, 8.4], [cut.feed + 0.5, 12.0]])(T), {quiet: true}))}</div>` +
      qTag('MICHAEL · BROOKLYN', 172, 124, lVis(T, cut.mich + 0.2, cut.feed + 0.3)) + lNote('more expensive bread?', 1100, 250, lVis(T, cut.mich + 0.2, cut.feed + 0.3), 32)},
    // "Farmers needed the government on their side. But it wasn't listening. So they decided to build a party of their own."
    {a: cut.feed, b: dur, cut: true, draw: (T) => qPrint(T, cut.feed, dur, 'h_grange_alliance/i_feed_you_all_grange_print_1875_loc.jpg', {x: 330, y: 150, w: 920, ar: 0.803, rot: -1},
      '"I FEED YOU ALL!" · PRINT, 1875 · LIBRARY OF CONGRESS', {ox: 790, oy: 520}) +
      lNote('the government wasn’t listening', 1010, 930, lVis(T, c.wasnt, cardAt), 30, -3) + batonCard(T, cardAt, 'A Party of Their Own')},
  ];
  return {dur, shots};
};
window.HOLD.ch07 = {}; window.CARRY.ch07 = {};
