// Chapter 3, "The Ticket" (0:00 to 1:20): Yankel's letter with the prepaid ticket, The Sun's steerage ads of 1884, chain
// migration, what Sore packed, the route (rail to Hamburg, the steamship), steerage below deck ("Mama, how much farther?"), and the
// barge to the round fort. Baton card "Castle Garden" on "Castle Garden". Drawn sets: lookdev ep3_letter (alone: Yankel writes as
// a boarder in New York; the family is still in Europe), ep3_chain, ep3_steerage, ep3_castle_garden, retimed to the words.
EDITS.ch03 = () => {
  const ch = 'ch03_the_ticket', W = window.WORDS[ch], w = (word, n) => wordAt(ch, word, n);
  const wa = (word, after) => { const k = W.words.filter((x) => x.s < after && x.w.toLowerCase().replace(/[^a-z0-9']/g, '') === word.toLowerCase()).length; return w(word, k + 1); };
  const c = {
    found: w('found'), pressing: w('pressing'), boarder: w('boarder'), saved: w('saved'), prepaid: w('prepaid', 1), in84: wa('In', 16),
    eighteen: w('eighteen'), month: w("month's"), this: w('This'), one: w('One'), chain: w('chain'), so: w('So'), sore: w('Sore'),
    candles: w('candlesticks,'), feather: w('feather'), samovar: w('samovar,'), took: w('took'), train: w('train,'), hamburg: w('Hamburg'),
    there: w('There'), steerage: w('steerage:'), cheapest: w('cheapest'), rows: w('Rows'), hundreds: w('Hundreds'), two: w('two'), mama: w('Mama,'),
    then: w('Then'), strip: w('strip'), barge: w('barge'),
  };
  const cardAt = W.words[W.words.length - 2].s, dur = cardAt + CARD_HOLD;           // "Castle Garden"
  const T_ = (txt, x, y, o) => (o > 0.01 ? svg(tag(x, y, txt, o)) : '');
  const P_ = (txt, x, y, o, size = 32, rot = -3) => (o > 0.01 ? op(o, svg(penS(x, y, txt, size, rot))) : '');
  const letter = (pts, o) => { const m = remap(pts); return (T) => renderLetter(m(T), o); };
  const table = letter([[0, 0], [7.9, 1.1], [9.0, 1.9], [11.0, 3.3], [11.9, 3.9], [15.9, 4.7]], {alone: true, quiet: true, tag: 'A LETTER HOME · NEW YORK · 1884'});
  const route = letter([[46.0, 7.3], [c.hamburg + 0.4, 8.1], [c.there + 0.2, 8.15], [c.steerage, 9.6], [c.cheapest + 0.2, 9.7]], {noEast: true});
  const chain = ((m) => (T) => renderChain(m(T)))(remap([[25.9, 0], [31.1, 2.3], [31.8, 3.0], [32.7, 4.2], [33.7, 5.8], [34.6, 6.8], [35.6, 8.2], [36.5, 9.4], [37.4, 10.35], [38.0, 10.9], [41.8, 11.35]]));
  const ship = ((m) => (T) => renderSteerage(m(T)))(remap([[c.cheapest + 0.2, 1.2], [55.1, 3.6], [56.5, 4.6], [c.hundreds, 6.5], [61.0, 8.4], [c.then - 0.1, 10.0]]));
  const fort = ((m) => (T) => renderCastleGarden(m(T)))(remap([[c.then - 0.1, 0], [c.barge - 0.2, 1.0], [cardAt, 3.2], [dur, 4.2]]));
  const shots = [
    // 1. "The ticket came in a letter. Yankel had found work in New York, pressing coats. He lived as a boarder in somebody else's
    //    room. He saved every penny he could, and he bought a prepaid ticket: a ticket bought in America, for someone back in Europe."
    {a: 0, b: c.in84 - 0.1, live: true, draw: (T) => table(T) +
      P_('work: pressing coats', 1000, 200, fin(T, c.pressing, 0.3) * fout(T, 11.6), 32) +
      P_('a boarder, in someone else&rsquo;s room', 1000, 300, fin(T, c.boarder, 0.3) * fout(T, 11.6), 28) +
      P_('every penny saved', 1000, 400, fin(T, c.saved + 0.2, 0.3) * fout(T, 11.6), 32) +
      P_('a ticket, already paid for', 1000, 200, fin(T, 12.0, 0.3), 32) +
      vocab(1010, 560, 'Prepaid ticket', 'A ship ticket bought in America|and mailed to someone in Europe.', fin(T, c.prepaid + 0.6, 0.35))},
    // 2. "In 1884, New York newspapers advertised prepaid steerage tickets for about eighteen dollars a person. That's about a month's
    //    pay for a laborer here." The Sun's shipping column, June 11, 1884.
    {a: c.in84 - 0.1, b: c.this - 0.1, draw: (T) => push(T, c.in84, c.this, 0.035) +
      printCard('f_letters/steamship_ads_prepaid_steerage_the_sun_jun11_1884_loc_sn83030272.jpg', {x: 230, y: 50, w: 400, ar: 2.174, rot: -1.5, o: fin(T, c.in84, 0.5), T,
        caption: 'The Sun, New York, June 11, 1884'}) + `</div>` +
      T_('NEW YORK NEWSPAPERS · 1884', 820, 160, fin(T, c.in84 + 0.4, 0.4)) +
      op(fin(T, w('advertised'), 0.4), mono('steerage, prepaid, one person', {x: 820, y: 230, size: 30, color: C.cream, ls: 3})) +
      bigFig('$18', {x: 800, y: 290, size: 230, w: 800, align: 'left', o: fin(T, c.eighteen, 0.4)}) +
      today('&asymp; $650 today', {x: 820, y: 540, w: 900, align: 'left', o: fin(T, w('person.'), 0.4)}) +
      P_('about a month&rsquo;s pay for a laborer', 810, 720, fin(T, w("That's"), 0.3), 34)},
    // 3. "This is how most immigrants came. Not alone, and not blind. One person goes first, finds work, writes home, and sends money
    //    for the next. Historians call it chain migration." The chain, numbered, and its card.
    {a: c.this - 0.1, b: 41.8, live: true, draw: (T) => chain(T)},
    // 4. "So in the spring of 1884, Sore packed the candlesticks, the feather bed and the samovar," what goes in the trunk.
    {a: 41.8, b: 46.0, draw: (T) => push(T, 41.8, 46.0, 0.03) +
      svg(`<g opacity="${fin(T, 41.8, 0.4).toFixed(3)}">${trunk(700, 900, 520, 240, '#3A2A1A', '#5F857F')}</g>` +
        `<g opacity="${fin(T, 41.9, 0.3).toFixed(3)}" transform="translate(0,${(-30 * (1 - ease(fin(T, 41.9, 0.4)))).toFixed(1)})">${candlestick(300, 900, 11, '#C9A55A')}${candlestick(460, 900, 11, '#C9A55A')}</g>` +
        `<g opacity="${fin(T, 42.6, 0.3).toFixed(3)}" transform="translate(0,${(-30 * (1 - ease(fin(T, 42.6, 0.4)))).toFixed(1)})">${featherBed(760, 560, 400, 160, '#DFE0D6')}</g>` +
        `<g opacity="${fin(T, 43.3, 0.3).toFixed(3)}" transform="translate(0,${(-30 * (1 - ease(fin(T, 43.3, 0.4)))).toFixed(1)})">${samovar(1530, 985, 7)}</g>`) + `</div>` +
      T_('SPRING 1884', 130, 120, fin(T, 41.8, 0.4)) +
      P_('the candlesticks', 200, 560, fin(T, 41.9, 0.3), 32) + P_('the feather bed', 800, 330, fin(T, 42.6, 0.3), 32) + P_('the samovar', 1150, 470, fin(T, 43.3, 0.3), 32)},
    // 5. "and took the children west by train, across Germany, to the port of Hamburg. There they boarded a steamship, in steerage:"
    {a: 46.0, b: c.cheapest + 0.2, live: true, draw: (T) => route(T)},
    // 6. "the cheapest space on the ship, below deck. Rows of bunks. Hardly any air. Hundreds of people, seasick, for about two weeks.
    //    RIVKE: Mama, how much farther? SORE: Until we see your father." The ship cut open; the push in to the family's bunks.
    {a: c.cheapest + 0.2, b: c.then - 0.1, live: true, draw: (T) => ship(T) +
      vocab(1050, 60, 'Steerage', 'The cheapest space on a ship,|below deck.', fin(T, c.cheapest + 0.2, 0.35) * fout(T, c.hundreds + 0.3, 0.35)) +
      T_('SPEAKING YIDDISH', 150, 940, fin(T, c.mama - 0.2) * fout(T, c.then - 0.4))},
    // 7. "Then one morning, a strip of land. A harbor full of masts and smoke. A barge carried them across the water to an old round
    //    fort called Castle Garden." The card: Castle Garden.
    {a: c.then - 0.1, b: dur, live: true, draw: (T) => fort(T) + batonCard(T, cardAt, 'Castle Garden')},
  ];
  return {dur, shots};
};
