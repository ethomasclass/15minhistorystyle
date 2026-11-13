// Chapter 6, "The Lower East Side" (87.7 s of narration + the baton card). Hester Street in 1890 on the desk; Rivke's first
// morning, walking behind her father through the pushcart market (lookdev/ep3_late.js renderHesterB, Episode 1's walk cycle); the
// enclave network on the 3D model (ep3_map.js ep3_enclave, on its own narration clock), down to the tenement floor; the room that
// night, four asleep and the boarder in the kitchen; the blocks filling with people (ep3_map_density); the same room at Monday's
// dawn, and the card "Sweatshop" lands on "sweatshop".
EDITS.ch06 = () => {
  const ch = 'ch06_the_lower_east_side', w = (word, n) => wordAt(ch, word, n);
  const cardAt = w('sweatshop.'), dur = cardAt + CARD_HOLD;   // cards.js: the card lands on the title's first spoken word
  const c = {rivke: w("Rivke's"), push: w('Pushcarts,'), women: w('Women'), signs: w('Signs'), goat: w("Somebody's"), felt: w('felt'),
    that: w('That'), slept: w('slept'), four: w('four'), boarder: w('boarder'), few: w('few'), monday: w('Monday')};
  const walk = (T) => renderHesterB(T);
  const shots = [
    // 1. "The Lower East Side was loud." Pushcarts and crowds at Norfolk and Hester, a few years later (dated).
    {a: 0, b: c.rivke - 0.1, draw: (T) => lPrint(T, 0, 3.2, 'desk/norfolk_hester_c1898.webp', {x: 400, y: 70, w: 1120, rot: -1.2, z: 0.05}) +
      lSrc('NORFOLK AND HESTER STREETS · ABOUT 1898 · WIKIMEDIA COMMONS', lVis(T, 0.1, c.rivke - 0.05))},
    // 2. "Rivke's first morning, she followed her father down the stairs and into the street. Pushcarts, end to end. Herring in
    //    barrels. Pickles. Pots. Used coats. Women bargaining in Yiddish. Signs in Hebrew letters. Somebody's goat. Everybody shouting.
    //    It felt, for a second, like home." Yankel ahead, Rivke behind him; each thing labelled in pen as it is named. Rivke stops
    //    at the goat and smiles; her father stops, turns back and waves her on; she hurries to him and they walk on.
    {a: c.rivke - 0.1, b: c.that - 0.1, cut: true, live: true, draw: (T) => walk(T) +
      lTag('HESTER STREET · LOWER EAST SIDE · 1884', 130, 120, lVis(T, c.rivke, c.signs - 0.3)) +
      lNote("Rivke's first morning", 130, 230, lVis(T, c.rivke + 0.2, c.push + 0.1)) +
      lTag('COMPOSITE CHARACTERS', 150, 990, lVis(T, c.rivke + 0.4, c.push + 0.6)) +
      lNote('pushcarts, end to end', 1000, 230, lVis(T, c.push, c.women)) +
      lNote('for a second, it felt like home', 860, 230, lVis(T, c.felt - 0.1, c.that))},
    // 3. "That was the point. This was an enclave..." to "...one sink in the hall for the whole floor." ep3_enclave, keyed to this
    //    chapter's words (clip t = T - 23.0): the market lifts, the network draws (job, kosher butcher, synagogue, landsmanshaft), the
    //    Irish parallel in Brooklyn, then the dive to the Rabinowitzes' floor and the one sink.
    {a: c.that - 0.1, b: c.slept - 0.2, cut: true, live: true, draw: (T) => renderEnclave(T - EM_T0) +
      (T > 42.7 ? svg(card(1300, 680, 'Landsmanshaftn', 'Clubs for people from the|same hometown: dues each|month, help when needed.', null, lVis(T, w('landsmanshaftn:'), 52.9, 0.45))) : '')},
    // 4. "The Rabinowitzes slept four in one room, with a boarder in the kitchen to help pay rent." The room that night.
    {a: c.slept - 0.2, b: 78.6, cut: true, live: true, draw: (T) => renderRoomB(T, {z: 0.94 + 0.05 * smooth(c.slept, 78.6, T), ux: 640 + 30 * smooth(c.slept, 78.6, T)}) +
      lTag('THAT NIGHT · ONE ROOM AND A KITCHEN', 130, 120, lVis(T, c.slept, 78.6)) +
      lNote('four in one room', 1000, 230, lVis(T, c.four, 78.7)) + lNote('a boarder in the kitchen', 130, 990, lVis(T, c.boarder - 0.4, 78.7))},
    // 5. "A few years later, a reporter claimed it was the most crowded place on Earth." ep3_map_density (clip t = T - 77.8).
    {a: 78.6, b: 83.3, cut: true, live: true, draw: (T) => renderDensity(T - DN.T0)},
    // 6. "And on Monday morning, the front room became a sweatshop." The room again, the window going pale with Monday's dawn;
    //    the card "Sweatshop" lands on "sweatshop".
    {a: 83.3, b: dur, cut: true, live: true, draw: (T) => renderRoomB(T, {dawn: smooth(c.monday, c.monday + 1.8, T), z: 0.98 + 0.12 * smooth(83.3, 87.5, T), ux: 720 + 140 * smooth(83.3, 87.5, T), uy: 640}) +
      lNote('Monday morning', 1000, 230, lVis(T, c.monday, dur + 1)) + batonCard(T, cardAt, 'Sweatshop')},
  ];
  return {dur, shots};
};
