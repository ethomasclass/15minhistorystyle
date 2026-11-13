// Chapter 2, "What They Left Behind" (0:00 to 1:24): the house in the Pale, the map and the three words (Pale of Settlement,
// pogrom, May Laws), March 1881, the spring of burned houses, the choice, two million who left, and Yankel going first. The
// baton card "The Ticket" slams in on "a ticket" (FULL_BUILD.md §2). Drawn sets: lookdev ep3_shtetl and ep3_pale_map, retimed to
// the words (remap: clip time from narration time; the clips' own notes ride along at the stretched times).
EDITS.ch02 = () => {
  const ch = 'ch02_what_they_left_behind', W = window.WORDS[ch], w = (word, n) => wordAt(ch, word, n);
  const c = {
    rabin: w('The', 1), they: w('They', 1), then: w('Then,'), march: w('March'), tsar: w('assassinated'), rumor: w('rumor'), weren: w("weren't"),
    spring: w('spring'), police: w('police'), english: w('English'), pogrom: w('Pogrom'), russian: w('Russian', 2), next: w('next', 1),
    may: w('May'), temporary: w('temporary'), so: w('So', 1), stay: w('Stay'), or: w('Or'), more: w('More'), most: w('most'), never: w('never'),
    but: w('But', 2), yankel: w('Yankel'), two: w('two', 2), ticket: w('ticket'),
  };
  const cardAt = W.words[W.words.length - 2].s, dur = cardAt + CARD_HOLD;           // "a ticket": the card lands on "a"
  const T_ = (txt, x, y, o) => (o > 0.01 ? svg(tag(x, y, txt, o)) : '');
  const P_ = (txt, x, y, o, size = 32, rot = -3) => (o > 0.01 ? op(o, svg(penS(x, y, txt, size, rot))) : '');
  const sht = (pts) => { const m = remap(pts); return (T) => renderE3Shtetl(m(T)); };
  const pale = (pts) => { const m = remap(pts); return (T) => renderPaleMap(m(T)); };
  const house = sht([[0, 0], [6.4, 2.2], [11.6, 5.4]]);
  const night = sht([[35.0, 5.7], [41.6, 10.1], [48.4, 10.4]]);
  const dawn = sht([[73.0, 11.2], [c.yankel, 11.6], [76.6, 14.8], [c.two - 0.4, 15.1], [cardAt, 18.0]]);
  const map1 = pale([[11.6, 0], [13.0, 0.8], [16.6, 2.4], [18.0, 3.8], [18.5, 4.8], [19.0, 6.4], [22.4, 7.6]]);
  const map2 = pale([[48.4, 6.0], [48.8, 6.6], [49.6, 8.3], [c.may, 10.0], [59.0, 14.0]]);
  const shots = [
    // 1. "What they left behind was a small wooden house in a small town, in what is now Ukraine. The Rabinowitzes are made up.
    //    But millions of families lived just like them." The house in the Pale; it opens on the Friday-night table.
    {a: 0, b: 11.6, live: true, draw: (T) => house(T) + P_('in what is now Ukraine', 1060, 300, fin(T, w('now'), 0.3) * fout(T, 10.6))},
    // 2. "They were Jewish, and in the Russian Empire, Jews were mostly required to live in one region in the west, called the
    //    Pale of Settlement. Many jobs and schools were closed to them." The Pale map, and its card.
    {a: 11.6, b: c.then - 0.1, live: true, draw: (T) => map1(T)},
    // 3. "Then, in March 1881, a group of revolutionaries assassinated the tsar, Alexander the Second. A rumor spread that the Jews
    //    were behind it. They weren't." Makovsky's deathbed painting (1881).
    {a: c.then - 0.1, b: 35.0, draw: (T) => push(T, c.then, 35.0, 0.04) +
      printCard('a_departure/alexander_ii_on_his_deathbed_makovsky_1881_commons.jpg', {x: 150, y: 150, w: 980, ar: 0.722, rot: -1.5, o: fin(T, c.then, 0.5), T,
        caption: 'Alexander II on his deathbed &middot; Makovsky, 1881'}) + `</div>` +
      T_('MARCH 1881', 1250, 220, fin(T, c.march, 0.3)) +
      P_('the tsar, assassinated', 1250, 360, fin(T, c.tsar, 0.3), 30) +
      P_('a rumor blamed the Jews', 1250, 520, fin(T, c.rumor, 0.3), 30) +
      P_('it was false', 1290, 640, fin(T, c.weren, 0.3), 34)},
    // 4. "That spring, mobs attacked Jewish homes and shops in town after town. Houses burned. The police often stood by. English
    //    got a new word from those months. Pogrom. It comes from a Russian word for 'devastation.'" Night, roofs burning far off
    //    (no people shown); the card.
    {a: 35.0, b: 48.4, live: true, draw: (T) => night(T) + P_('the police often stood by', 130, 270, fin(T, c.police, 0.3) * fout(T, 44.0), 30) +
      dimBy(0.35 * fin(T, c.pogrom - 0.3, 0.5)) +
      (T > c.pogrom - 0.1 ? svg(card(1000, 520, 'Pogrom', 'A mob attack on a Jewish community,|often with officials looking|the other way.', '', fin(T, c.pogrom - 0.05, 0.35))) : '') +
      P_('from Russian: &quot;devastation&quot;', 1040, 950, fin(T, c.russian - 0.2, 0.3), 30)},
    // 5. "The next year, the government passed the May Laws. They were called 'temporary.' They lasted thirty-five years, pushing
    //    Jews out of villages and out of work." Back to the Pale map: its three cards.
    {a: 48.4, b: c.so - 0.1, live: true, draw: (T) => map2(T) + P_('&quot;temporary&quot;: 35 years', 130, 800, fin(T, c.temporary, 0.3), 32)},
    // 6. "So families had a choice. Stay and hope. Or leave." A village farewell (print, 1883).
    {a: c.so - 0.1, b: 65.4, draw: (T) => push(T, c.so, 65.4, 0.04) +
      printCard('a_departure/the_emigrants_farewell_abschied_print_1883_loc2013646644.jpg', {x: 520, y: 70, w: 860, ar: 0.79, rot: 1.2, o: fin(T, c.so - 0.1, 0.5), T,
        caption: 'The emigrants&rsquo; farewell &middot; print, 1883'}) + `</div>` +
      P_('stay and hope?', 120, 300, fin(T, c.stay, 0.3), 40) + P_('or leave', 1440, 420, fin(T, c.or, 0.3), 46)},
    // 7. "More than two million Jews would leave over the next forty years, most of them for America. And they almost never came back."
    {a: 65.4, b: 73.0, draw: (T) => push(T, 65.4, 73.0, 0.03) +
      printCard('a_departure/german_emigrants_embarking_hamburg_steamer_harpers_1874_commons.jpg', {x: 1120, y: 150, w: 640, ar: 0.799, rot: 2, o: fin(T, 65.4, 0.5) * 0.92, T,
        caption: 'Emigrants boarding at Hamburg &middot; Harper&rsquo;s, 1874'}) + `</div>` +
      bigFig('2 million+', {x: 140, y: 300, size: 150, w: 900, align: 'left', o: fin(T, w('million'), 0.4)}) +
      op(fin(T, w('Jews', 4), 0.4), mono('Jews who left the Russian Empire', {x: 150, y: 480, size: 28, color: C.cream, ls: 3})) +
      op(fin(T, w('forty'), 0.4), mono('over the next 40 years', {x: 150, y: 530, size: 28, color: C.cream, ls: 3})) +
      today('most of them to America', {x: 150, y: 620, w: 900, align: 'left', o: fin(T, c.most, 0.4)}) +
      P_('and almost never came back', 140, 820, fin(T, c.never, 0.3), 40)},
    // 8. "But leaving costs money. So Yankel went first, alone, in 1882. And for two years the rest of the family waited for one
    //    piece of paper: a ticket." Dawn, 1882: Yankel leaves with a bundle. The card: The Ticket.
    {a: 73.0, b: dur, live: true, draw: (T) => dawn(T) + batonCard(T, cardAt, 'The Ticket')},
  ];
  return {dur, shots};
};
