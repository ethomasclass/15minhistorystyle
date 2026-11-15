// Chapter 6, "Boss Tweed" (118.3 s of narration + the baton card). Tweed (Brady-Handy photograph); "As long as I count the votes"
// (Nast, 1871); the courthouse as planned (1868); the courthouse ledger (lookdev/ep4_explain_b.js renderLedger: the 1858 limit
// stamped, the cost meter to $11 to 13 million, the bills); "Who Stole the People's
// Money?" and the kickback; the leak, a clerk copying the books by lamplight (ep4_map_b.js renderLeak); the Times, July 22, 1871;
// Nast's self-portrait; "The Brains"; the line about pictures (as Paine printed it, 1904); "Stone walls do not a prison make";
// the escape map (renderEscape); Vigo (ep4_vigo) with the real Harper's page of October 7, 1876 in the officials' hands; the
// cartoon itself ("Tweed-le-dee and Tilden-dum", July 1, 1876); Tweed's death; "The spirit of Tweed is mighty still" (1886); the
// title page of Plunkitt's book (1905) and the card "Honest Graft" on "honest graft".
// Nast's Tweed cartoons caricature Tweed himself (a public figure); they are shown briefly, framed by the narration. "The Tammany
// Tiger Loose" is not used.
EDITS.ch06 = () => {
  const ch = 'ch06_boss_tweed', L = (word, near) => lWord(ch, word, near);
  const cardAt = L('honest', 117.84), dur = cardAt + CARD_HOLD;
  const c = {and: L('and', 2.8), here: L("Here's", 9.02), in1858: L('In', 12.04), k250: L('250,000', 15.5), prince: L('"the', 48.76), times: L('The', 47.26), every: L('Every', 50.98),
    kick: L('kickback.', 55.72), clerk: L('A', 58.58), july: L('In', 63.2), mean: L('Meanwhile,', 66.78), fat: L('a', 72.82), supposed: L('Tweed', 75.64), arrested: L('Tweed', 80.82),
    y1875: L('In', 84.28), spanish: L('Spanish', 92.76), nast: L('Nast', 96.84), inIt: L('In', 98.24), so: L('so', 101.28), kid: L('kidnapper.', 102.48), died: L('He', 103.52),
    but: L('But', 106.78), mistake: L('His', 109.92), caught: L('It', 112.82), one: L('One', 114.36), called: L('He', 116.98)};
  const pr = 4.5, cth = 9.0, ledger = c.in1858 - 0.1, who = c.every - 0.1, leak = 58.5, nyt = c.july - 0.1, nast = c.mean - 0.05, brains = c.fat - 0.05, qt = c.supposed - 0.05,
    jail = c.arrested - 0.05, esc = c.y1875 - 0.1, vigo = c.spanish - 0.1, ins = 98.6, vigo2 = c.so - 0.1, died = c.died + 0.35, spirit = 107.0, title = 115.6;
  const vigoMap = (T) => (T < ins ? remap([[vigo, 2.6], [96.6, 8.2], [ins, 9.9]])(T) : remap([[vigo2, 10.0], [died, 11.15]])(T));
  // the real page in the officials' hands during the clip's composite hold (8.2 to 11.2 s, camera still): e4VigoPageRect()
  const vigoPage = (t) => { const k = smooth(8.2, 8.45, t) * (1 - smooth(10.95, 11.2, t)); if (k <= 0) return ''; const r = e4VigoPageRect();
    return `<div style="position:absolute;left:${r.x.toFixed(1)}px;top:${r.y.toFixed(1)}px;width:${r.w.toFixed(1)}px;height:${r.h.toFixed(1)}px;opacity:${k.toFixed(3)};background:#F1EADA">
      <img src="${IMG}g_tweed/the_capture_of_tweed_the_picture_that_made_spanish_officials_harpers_1876-10-07_ia.jpg" style="width:100%;height:100%;object-fit:fill;filter:sepia(.25) contrast(1.05) brightness(1.04)"></div>`; };
  const shots = [
    // 1. "Boss Tweed was a huge man,"
    {a: 0, b: pr, draw: (T) => kDesk(T, 0, pr, printCard('g_tweed/tweed_portrait_brady_handy_c1870_commons.jpg', {x: 700, y: 60, w: 520, ar: 1.205, rot: -1, o: fin(T, 0.05, 0.5), T})) +
      lTag('WILLIAM M. TWEED · "BOSS" OF TAMMANY HALL', 130, 120, lVis(T, 0.3, pr + 0.4)) + lSrc('WILLIAM M. TWEED · BRADY-HANDY STUDIO, ABOUT 1870 · WIKIMEDIA COMMONS', lVis(T, 0.2, pr + 0.4))},
    // 2. "and by the late 1860s he and his friends, the Tweed Ring, controlled New York City's money."
    {a: pr, b: cth, cut: true, draw: (T) => kDesk(T, pr, cth, printCard('g_tweed/nast_as_long_as_i_count_the_votes_harpers_1871_loc.jpg', {x: 600, y: 50, w: 720, ar: 1.051, rot: 1, o: fin(T, pr + 0.05, 0.5), T}), 0.05, 960, 420) +
      lTag('THE TWEED RING RAN THE CITY’S MONEY', 130, 120, lVis(T, L('Tweed', 5.88), cth + 0.4)) + lSrc('"AS LONG AS I COUNT THE VOTES" · THOMAS NAST, HARPER’S WEEKLY, 1871 · LIBRARY OF CONGRESS', lVis(T, pr + 0.2, cth + 0.4))},
    // 3. "Here's how. Take the new county courthouse."
    {a: cth, b: ledger, cut: true, draw: (T) => kDesk(T, cth, ledger, printCard('g_tweed/new_york_county_court_house_valentines_manual_1868_commons.jpg', {x: 360, y: 110, w: 1200, ar: 0.737, rot: -0.8, o: fin(T, cth + 0.05, 0.5), T})) +
      lSrc('THE NEW COUNTY COURT HOUSE, AS PLANNED · VALENTINE’S MANUAL, 1868 · WIKIMEDIA COMMONS', lVis(T, cth + 0.2, ledger + 0.5))},
    // 4. "In 1858, the law said it should cost no more than 250,000 dollars. By 1871, it had cost somewhere between eleven and thirteen
    //    million dollars. And it still wasn't finished. Where did the money go? Look at the bills. Thermometers: 7,500 dollars. For
    //    thermometers. Carpets, shades and curtains: more than 675,000. One plasterer was paid 138,187 dollars for two days' work. In
    //    December. The New York Times called him 'the Prince of Plasterers.'" The ledger; the stamp lands on "250,000" (ledger_stamp in SFX).
    {a: ledger, b: who, cut: true, live: true, draw: (T) => renderLedger(T, LG_CUE)},
    // 6. "Every bill was padded, and the extra went back to the Ring. That's called a kickback. How did anyone find out?"
    {a: who, b: leak, cut: true, draw: (T) => kDesk(T, who, leak, printCard('g_tweed/nast_who_stole_the_peoples_money_twas_him_harpers_1871_ia.jpg', {x: 110, y: 190, w: 860, ar: 0.742, rot: -1, o: fin(T, who + 0.05, 0.5), T}), 0.05, 700, 540) +
      lSrc('"WHO STOLE THE PEOPLE’S MONEY?" · THOMAS NAST, HARPER’S WEEKLY, AUGUST 19, 1871', lVis(T, who + 0.2, leak + 0.4)) +
      lTag('EVERY BILL PADDED', 130, 120, lVis(T, c.every + 0.3, c.kick - 0.3)) + vocab(1020, 160, 'Kickback', 'Part of a padded payment|handed back, in secret, to|the officials who approved it.', fin(T, c.kick - 0.5, 0.4))},
    // 7. "A clerk planted in the city's accounting office quietly copied the books." The leak, by lamplight.
    {a: leak, b: nyt, cut: true, live: true, draw: (T) => renderLeak(remap([[leak, 0.2], [nyt, 4.8]])(T))},
    // 8. "In July 1871, the Times printed them." The front page of July 22, 1871: "The Secret Accounts."
    {a: nyt, b: nast, cut: true, draw: (T) => kDesk(T, nyt, nast, kCrop('g_tweed/new_york_times_front_page_1871-07-22_ia.jpg', {x: 480, y: 70, w: 960, size: [3022, 4000], crop: [0.03, 0.04, 0.97, 0.5], rot: -1, o: fin(T, nyt + 0.05, 0.5), T, filter: 'grayscale(1) brightness(1.55) contrast(1.35) sepia(.2)'}), 0.06, 900, 260) +
      lTag('THE NEW-YORK TIMES · JULY 22, 1871', 130, 990, lVis(T, nyt + 0.3, nast + 0.4)) + lNote('the books, in print', 1250, 760, lVis(T, c.july + 0.8, nast + 0.3))},
    // 9. "Meanwhile, a cartoonist named Thomas Nast drew Tweed again and again in Harper's Weekly:"
    {a: nast, b: brains, cut: true, draw: (T) => kDesk(T, nast, brains, printCard('g_tweed/nast_self_portrait_harpers_1876_commons.jpg', {x: 740, y: 40, w: 520, ar: 1.53, rot: 1, o: fin(T, nast + 0.05, 0.5), T}), 0.05, 1000, 600) +
      lTag('THOMAS NAST · CARTOONIST', 130, 120, lVis(T, nast + 0.3, brains + 0.4)) + lNote('again and again', 1320, 760, lVis(T, L('again', 70.26), brains + 0.3)) + lSrc('THOMAS NAST, SELF-PORTRAIT · HARPER’S WEEKLY, 1876 · WIKIMEDIA COMMONS', lVis(T, nast + 0.2, brains + 0.4))},
    // 10. "a fat man with a moneybag for a head."
    {a: brains, b: qt, cut: true, draw: (T) => kDesk(T, brains, qt, kCrop('g_tweed/nast_the_brains_harpers_1871_loc.jpg', {x: 640, y: 60, w: 600, size: [1192, 1536], crop: [0.03, 0.04, 0.9, 0.8], rot: -1, o: fin(T, brains + 0.05, 0.4), T}), 0.06, 960, 400) +
      lSrc('"THE BRAINS" · THOMAS NAST, HARPER’S WEEKLY, 1871 · LIBRARY OF CONGRESS', lVis(T, brains + 0.1, qt + 0.4))},
    // 11. "Tweed is supposed to have said, 'My voters can't read. But they can see pictures!'" On screen, the words as Paine printed
    //     them (1904; no 1871 source): "my constituents can't read; but, d--n it, they can see pictures!"
    {a: qt, b: jail, cut: true, draw: (T) => push(T, qt, jail, 0.03) + `</div>` +
      quote('“...my constituents can’t read; but... they can see pictures!”', 'attributed to Tweed · first printed by Albert Bigelow Paine, 1904', {x: 180, y: 330, w: 1560, size: 76, o: fin(T, qt + 0.1, 0.5)}) +
      lNote('is supposed to have said', 190, 260, lVis(T, qt + 0.2, jail + 0.3))},
    // 12. "Tweed was arrested, convicted and sent to jail." Nast, 1872: no prison big enough to hold the Boss.
    {a: jail, b: esc, cut: true, draw: (T) => kDesk(T, jail, esc, printCard('g_tweed/nast_stone_walls_do_not_a_prison_make_1872_loc.jpg', {x: 1000, y: 70, w: 640, ar: 1.157, rot: 1.5, o: fin(T, jail + 0.05, 0.5), T})) +
      kTapes(T, [[L('arrested,', 81.26), 'ARRESTED 1871', 160, 300, 76, -2], [81.6, 'CONVICTED 1873', 220, 470, 76, 1.5]]) +
      lSrc('"STONE WALLS DO NOT A PRISON MAKE" · NAST, 1872 · LIBRARY OF CONGRESS', lVis(T, jail + 0.2, esc + 0.4))},
    // 13. "In 1875, he escaped. To Cuba. Then to Spain. Where, it turned out, they had newspapers."
    {a: esc, b: vigo, cut: true, live: true, draw: (T) => renderEscape(T, ES_CUE)},
    // 14. "Spanish officials who couldn't read a word of English recognized him... from a Nast cartoon." Vigo: they compare him with a
    //     page, step into his path and hold it up beside his head (the real Harper's page in their hands).
    {a: vigo, b: ins, cut: true, live: true, draw: (T) => { const t = vigoMap(T); return kQ(() => renderE4Vigo(t)) + vigoPage(t) +
      lTag('VIGO, SPAIN · SEPTEMBER 1876', 130, 120, lVis(T, vigo + 0.2, vigo + 3.6)) +
      lTag('THE PAGE: HARPER’S WEEKLY, OCTOBER 7, 1876', 130, 990, lVis(T, 95.9, ins + 0.4)); }},
    // 15. "In it, Tweed was grabbing two boys by the collar," Nast's cover of July 1, 1876.
    {a: ins, b: vigo2, cut: true, draw: (T) => kDesk(T, ins, vigo2, kCrop('g_tweed/nast_tweed_le_dee_and_tilden_dum_harpers_1876_loc.jpg', {x: 560, y: 60, w: 760, size: [3202, 4000], crop: [0.1, 0.27, 0.92, 0.9], rot: -1, o: fin(T, ins + 0.05, 0.4), T}), 0.05, 960, 500) +
      lSrc('"TWEED-LE-DEE AND TILDEN-DUM" · NAST, HARPER’S WEEKLY, JULY 1, 1876 · LIBRARY OF CONGRESS', lVis(T, ins + 0.1, vigo2 + 0.4))},
    // 16. "so they arrested him as a kidnapper."
    {a: vigo2, b: died, cut: true, live: true, draw: (T) => { const t = vigoMap(T); return kQ(() => renderE4Vigo(t)) + vigoPage(t) + lNote('arrested as a kidnapper', 130, 230, lVis(T, c.so, died + 0.3)); }},
    // 17. "He died in a New York jail in 1878."
    {a: died, b: spirit, cut: true, draw: (T) => kDesk(T, died, spirit, printCard('g_tweed/tweed_portrait_1873_commons.jpg', {x: 1120, y: 170, w: 480, ar: 1.181, rot: 1, o: fin(T, died + 0.05, 0.5), T, caption: ''}), 0.04) +
      lTag('DIED IN LUDLOW STREET JAIL · APRIL 12, 1878', 130, 120, lVis(T, died + 0.2, spirit + 0.4)) + lSrc('WILLIAM M. TWEED · ENGRAVING, 1873 · LIBRARY OF CONGRESS VIA WIKIMEDIA COMMONS', lVis(T, died + 0.2, spirit + 0.4))},
    // 18. "But the bosses who came after Tweed learned a lesson. His mistake, they said, wasn't getting rich. It was getting caught."
    //     Nast, 1886: the spirit of Tweed is mighty still.
    {a: spirit, b: title, cut: true, draw: (T) => kDesk(T, spirit, title, printCard('g_tweed/nast_the_spirit_of_tweed_is_mighty_still_1886_loc.jpg', {x: 300, y: 130, w: 600, ar: 1.017, rot: -1.5, o: fin(T, spirit + 0.05, 0.5), T})) +
      lSrc('"THE SPIRIT OF TWEED IS MIGHTY STILL" · NAST, 1886 · LIBRARY OF CONGRESS', lVis(T, spirit + 0.2, title + 0.4)) +
      lNote('his mistake? not getting rich...', 1000, 380, lVis(T, c.mistake, title + 0.3)) + lNote('...getting caught', 1100, 560, lVis(T, c.caught - 0.1, title + 0.3))},
    // 19. "One of them even had a name for doing it right. He called it honest graft." Plunkitt's book (1905); the card.
    {a: title, b: dur, cut: true, draw: (T) => kDesk(T, title, dur, kCrop('h_plunkitt/plunkitt_of_tammany_hall_title_page_1905_ia.jpg', {x: 640, y: 60, w: 640, size: [1918, 2786], crop: [0.1, 0.06, 0.9, 0.72], rot: 1, o: fin(T, title + 0.05, 0.5), T}), 0.04) +
      lSrc('PLUNKITT OF TAMMANY HALL · WILLIAM L. RIORDON, 1905 · INTERNET ARCHIVE', lVis(T, title + 0.2, dur + 1)) + batonCard(T, cardAt, 'Honest Graft')},
  ];
  return {dur, shots};
};
window.HOLD.ch06 = {}; window.CARRY.ch06 = {};
