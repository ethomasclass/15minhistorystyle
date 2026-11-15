// Chapter 5, "The Machine" (105.5 s of narration + the baton card). The ward club (ep4_clubhouse): its product favors, its price
// votes; the pyramid (captain, ward boss, boss: lookdev/ep4_explain_b.js renderPyramid); Hugh McLaughlin; the signature shot, the
// machine network over the Kellys' Brooklyn wards (lookdev/ep4_map_b.js renderMachineNet), the favors named one by one; Yankel's
// five years to a vote (renderCitizen); the captain at the Rabinowitzes' door (ep4_papers); the network again, votes flowing up;
// challenging a voter (Harper's, 1872); the repeater who said he was the bishop (renderRepeater); the coal (ep4_coal); Tommy's
// errand at the club; the brothers in the kitchen (ep4_kelly_flat); Tammany Hall, 1875, and the card "Boss Tweed" on "Boss Tweed".
//
// Shared helpers for chapters 5 to 8 live here too (ch05.js loads before ch06.js to ch08.js): kCrop (a cropped archival print on
// the desk), kQ (a look-dev clip without its own clip text), kTapes.

/** A cropped archival print on the desk: the picture's region crop = [x0, y0, x1, y1] (fractions of the image), shown w px wide,
 *  in a cream border with the desk shadows; size = the image's [width, height] in px (for the crop's proportions); filter: CSS. */
function kCrop(src, {x, y, w, size, crop = [0, 0, 1, 1], rot = 0, o = 1, T = 0, filter = 'sepia(.18) contrast(1.04)'}) {
  const [W, H] = size, cw = (crop[2] - crop[0]) * W, chh = (crop[3] - crop[1]) * H, h = w * chh / cw, iw = w * W / cw;
  const dy = (1 - ease(o)) * 60 + Math.sin(T * 0.7 + x) * 2.5;
  return `<div style="position:absolute;left:${x}px;top:${(y + dy).toFixed(1)}px;width:${w + 20}px;transform:rotate(${rot}deg);opacity:${Math.min(1, o * 1.6).toFixed(3)};
      background:#E9E2D2;padding:10px;filter:drop-shadow(0 3px 2px rgba(0,0,0,.7)) drop-shadow(0 18px 22px rgba(0,0,0,.55))">
      <div style="width:${w}px;height:${h.toFixed(1)}px;overflow:hidden;position:relative"><img src="${IMG}${src}" style="position:absolute;left:${(-crop[0] * iw).toFixed(1)}px;top:${(-crop[1] * iw * H / W).toFixed(1)}px;width:${iw.toFixed(1)}px;filter:${filter}"></div></div>`;
}
/** The desk with a slow push (z) from a to b, and whatever is laid on it; closes its own div. */
const kDesk = (T, a, b, body, z = 0.04, ox = 960, oy = 540) => `<div style="position:absolute;inset:0;transform:scale(${(1 + z * ease(clamp01((T - a) / Math.max(0.1, b - a)))).toFixed(4)});transform-origin:${ox}px ${oy}px">${desk()}${body}</div>`;
/** A look-dev clip rendered without its own clip text (the edit sets the text). */
const kQ = (fn) => lQuiet(fn);
/** Torn-tape lines that slam in on their words: [[t, text, x, y, size, rot], ...] */
const kTapes = (T, list) => list.map(([t0, txt, x, y, size = 72, rot = -2], i) => (T > t0 ? slideUp(fin(T, t0, 0.3), tape(txt, {x, y, size, rot, seed: 500 + i * 7 + txt.length})) : '')).join('');

EDITS.ch05 = () => {
  const ch = 'ch05_the_machine', W = window.WORDS[ch], L = (word, near) => lWord(ch, word, near);
  const cardAt = L('Boss', 104.9), dur = cardAt + CARD_HOLD;
  const c = {product: L('Its', 7.02), price: L('Its', 9.1), pyr: 12.4, mcl: 31.0, net: 36.8, last: 47.9, papers: 63.0, tell: L('Tell', 63.52), papEnd: L('papers.', 65.1), no: L('No', 66.0), charge: L('charge.', 66.22),
    just: L('Just', 69.12), brother: L("brother's.", 70.5), friends: L("friends'.", 71.7), some: L('Some', 72.88), repeaters: L('repeaters.', 77.48), one: L('One', 78.84), gave: L('gave', 81.94),
    bishop: L('bishop.', 83.98), clerk: L('clerk', 85.06), winter: L('That', 86.88), tommy: L('Tommy', 89.66), errands: L('errands', 91.32), what: L("What's", 93.44), nothing: L('Nothing!', 94.98),
    vote2: L('vote.', 96.32), but: L('But', 97.66), river: L('river:', 100.22), tammany: L('Tammany', 101.7), boss: L('boss:', 104.06)};
  const net2 = c.just - 0.12, polls = 74.4, rep = 78.0, coal = c.winter, club2 = 89.9, kitchen = 93.0, tam = c.but - 0.05;
  // the network: two visits on the same model, each with its own camera (narration-time keys: [n, tx, ty, tz, yaw, pitch, D, ox, oy])
  const NET1 = {keys: [[c.net, 1960, -40, 140, 2, 33, 3500, 0, 30], [c.net + 2.6, 1960, -20, 170, 8, 35, 3000, 0, 40], [c.last, 1990, 0, 190, 16, 37, 2750, 0, 20]],
    build: [c.net + 0.1, c.net + 2.0], fire: [c.net + 0.6, 999], favorsK: [c.net + 1.6, 999], votesK: [999, 999], labelsAt: [c.net + 0.8, 999],
    favors: [[L('A', 39.26), 'job', 'A CITY JOB'], [L('Half', 40.44), 'coal', 'HALF A TON OF COAL'], [L('A', 42.64), 'judge', 'A WORD WITH THE JUDGE'], [L('Help', 45.3), 'papers', 'HELP WITH CITIZENSHIP PAPERS']]};
  const NET2 = {keys: [[net2, 1940, -40, 220, 10, 35, 3500, 190, 30], [polls, 1980, -20, 220, 18, 36, 3250, 190, 30]], build: [0, 0.1], fire: [999, 999], favorsK: [999, 999], votesK: [net2 + 0.1, 999],
    votes: [[c.just], [c.brother - 0.3], [c.friends - 0.3]], favors: [], labelsAt: [999, 999]};
  const repMap = remap([[rep, 0], [rep + 1.5, 1.5], [c.gave + 0.35, 2.4], [c.bishop, 4.2], [c.clerk + 0.15, 5.8], [dur, 9.0]]);
  const repCard = (T, o) => svg(card(1020, 80, 'Repeater', 'A man who voted more than|once, under other men’s names.', null, o));
  const shots = [
    // 1. "The machine wasn't a machine. It was an organization that ran a city's politics like a business. Its product was favors.
    //    Its price was votes." The ward club: the captain at his table, a mother's letter, the ledger.
    {a: 0, b: c.pyr, live: true, draw: (T) => kQ(() => renderE4Club(remap([[0, 0.3], [c.pyr, 12.4]])(T), {cam: camAt([[0, 1.3, 930, 630], [c.pyr, 1.42, 880, 650]], T)})) +
      lTag('THE WARD CLUB · WILLIAMSBURG · 1887', 130, 120, lVis(T, 0.3, 4.6)) + lTag('COMPOSITE CHARACTERS', 1320, 990, lVis(T, 1.2, 5.2)) +
      kTapes(T, [[c.product, 'PRODUCT: FAVORS', 1080, 150, 76, -2], [c.price, 'PRICE: VOTES', 1180, 300, 76, 2]])},
    // 2. "It worked like a pyramid. At the bottom, a captain for every few hundred voters, like Mr. Duffy. He knew every family on his
    //    blocks... Above him, a ward boss. And at the top, the boss, who picked the candidates and handed out the city jobs."
    {a: c.pyr, b: c.mcl, cut: true, live: true, draw: (T) => renderPyramid(T, {...PY_CUE, pyr: c.pyr - 0.2, bottom: c.pyr + 0.5, captain: L('captain', 14.04)})},
    // 3. "In Brooklyn, the boss for forty years was an Irish Brooklynite named Hugh McLaughlin."
    {a: c.mcl, b: c.net, cut: true, draw: (T) => kDesk(T, c.mcl, c.net, printCard('i_brooklyn/hugh_mclaughlin_portrait_commons.jpg', {x: 1100, y: 150, w: 560, ar: 1.25, rot: -1.2, o: fin(T, c.mcl + 0.05, 0.5), T})) +
      lTag('HUGH McLAUGHLIN · BROOKLYN’S BOSS FOR ABOUT 40 YEARS', 130, 120, lVis(T, c.mcl + 0.3, c.net + 0.4)) +
      lSrc('HUGH McLAUGHLIN · ENGRAVING, PUBLISHED 1910 · WIKIMEDIA COMMONS', lVis(T, c.mcl + 0.2, c.net + 0.4))},
    // 4. "So what could the machine do for you? A city job. Half a ton of coal in January. A word with the judge when your son got
    //    arrested. Help with citizenship papers." The network draws over the wards; the fire block lights; favors flow down.
    {a: c.net, b: c.last, cut: true, live: true, draw: (T) => renderMachineNet(T, NET1)},
    // 5. "That last one mattered. The Rabinowitz family upstairs had come from the Russian Empire. The father arrived in 1882. After
    //    five years, he could become a citizen, and vote. That meant 1887. Mr. Duffy could count, too."
    {a: c.last, b: c.papers, cut: true, live: true, draw: (T) => renderCitizen(T, {...CZ_CUE, last: c.last})},
    // 6. CAPTAIN: "Tell your father we'll help with his papers. No charge." (ep4_papers, retimed to his words; Rivke translates.)
    {a: c.papers, b: net2, cut: true, live: true, draw: (T) => kQ(() => renderE4Papers(remap([[c.papers, 0.6], [c.tell, 1.1], [c.papEnd + 0.45, 2.9], [c.no, 3.25], [c.charge + 0.4, 4.0], [net2, 7.9]])(T))) +
      lTag('THE RABINOWITZES’ DOOR, UPSTAIRS', 130, 120, lVis(T, c.papers + 0.2, c.charge + 0.6)) + lTag('COMPOSITE CHARACTERS', 1300, 990, lVis(T, c.papers + 2.6, net2 + 0.3))},
    // 7. "And in return? Just your vote. And your brother's. And your friends'." The network again: votes flow up as teal pulses.
    {a: net2, b: polls, cut: true, live: true, draw: (T) => renderMachineNet(T, NET2) +
      kTapes(T, [[c.just, 'JUST YOUR VOTE', 140, 110, 70, -2], [c.brother - 0.3, "AND YOUR BROTHER'S", 200, 240, 64, 1.5], [c.friends - 0.3, "AND YOUR FRIENDS'", 260, 370, 64, -1.5]])},
    // 8. "Some men voted more than once, under other people's names. They were called repeaters." Challenging a voter at the polls.
    {a: polls, b: rep, cut: true, draw: (T) => kDesk(T, polls, rep, kCrop('f_machine/october_elections_challenging_a_voter_1872_loc.jpg', {x: 300, y: 150, w: 1080, size: [2780, 4000], crop: [0.07, 0.035, 0.95, 0.455], rot: -1, o: fin(T, polls + 0.05, 0.5), T}), 0.05, 840, 500) +
      lSrc('CHALLENGING A VOTER · HARPER’S WEEKLY, OCTOBER 1872 · LIBRARY OF CONGRESS', lVis(T, polls + 0.2, rep + 0.4)) +
      lTag('VOTING MORE THAN ONCE, UNDER OTHER MEN’S NAMES', 130, 120, lVis(T, polls + 0.3, c.repeaters + 0.2)) + repCard(T, fin(T, c.repeaters - 0.4, 0.4))},
    // 9. "One Tammany man later told a story about a repeater who gave his name at the polls as the local bishop. The clerk wasn't
    //    buying it." The polling table: the bishop, the poll book, the clerk's folded arms.
    {a: rep, b: coal, cut: true, live: true, draw: (T) => kQ(() => renderRepeater(repMap(T))) + repCard(T, fout(T, c.gave - 0.4, 0.4)) +
      lTag('A STORY A TAMMANY MAN TOLD', 130, 120, lVis(T, c.one, c.bishop + 0.2)) + lTag('NAME GIVEN: THE LOCAL BISHOP', 130, 990, lVis(T, c.gave + 0.5, coal + 0.3))},
    // 10. "That winter, the Kellys took the coal." The coal wagon at the Kellys' cellar; the captain tips his hat as he passes.
    {a: coal, b: club2, cut: true, live: true, draw: (T) => kQ(() => renderE4Coal(remap([[coal, 5.6], [club2, 8.6]])(T))) + lTag('THE KELLYS’ STREET · JANUARY 1887', 130, 120, lVis(T, coal + 0.1, club2 + 1.6))},
    // 11. "And Tommy took a job, running errands for the club." Tommy darts into the club with a note.
    {a: club2, b: kitchen, cut: true, live: true, draw: (T) => kQ(() => renderE4Club(remap([[club2, 17.5], [kitchen, 21.0]])(T))) + lNote('Tommy Kelly, 17: running errands for the club', 130, 230, lVis(T, c.tommy, kitchen + 0.2))},
    // 12. MICHAEL: "What's it cost?" TOMMY: "Nothing! Just how you vote." The kitchen; Michael shakes his head.
    {a: kitchen, b: tam, cut: true, live: true, draw: (T) => kQ(() => renderE4KellyFlat(remap([[kitchen, 6.7], [c.nothing - 0.05, 8.0], [c.vote2 + 0.4, 9.6], [tam, 11.3]])(T))) +
      lTag('THE KELLYS’ KITCHEN', 130, 120, lVis(T, kitchen + 0.1, tam + 0.3))},
    // 13. "But the most famous machine of all was across the river: New York's Tammany Hall. And its most famous boss: Boss Tweed."
    {a: tam, b: dur, cut: true, draw: (T) => kDesk(T, tam, dur, kCrop('f_machine/tammany_hall_14th_street_photo_1875_commons.jpg', {x: 560, y: 160, w: 780, size: [3840, 1927], crop: [0.075, 0.1, 0.49, 0.9], rot: 1, o: fin(T, tam + 0.05, 0.5), T}), 0.05) +
      lTag('TAMMANY HALL · 14TH STREET, NEW YORK · 1875', 130, 120, lVis(T, tam + 0.3, cardAt)) + lNote('across the river', 1240, 990, lVis(T, c.river - 0.3, cardAt)) +
      lSrc('TAMMANY HALL · STEREO PHOTOGRAPH, 1875 · WIKIMEDIA COMMONS', lVis(T, tam + 0.2, cardAt)) + batonCard(T, cardAt, 'Boss Tweed')},
  ];
  return {dur, shots};
};
window.HOLD.ch05 = {}; window.CARRY.ch05 = {};
