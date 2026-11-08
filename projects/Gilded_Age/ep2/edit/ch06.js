// Chapter 6, "Sunday" (6:51 to 7:43): Michael and Nora at a Sunday game in Brooklyn (the American Association: cheap seats,
// Sunday games, beer), then the rich on their Sunday: polo, Newport tennis, racing yachts. Same day off.
EDITS.ch06 = () => {
  const ch = 'ch06_sunday', w = (word, n) => wordAt(ch, word, n), dur = window.WORDS[ch].duration + 2.0;   // + a held tail after the last word, so the last labels get their reading time
  const c = {
    game: w('On', 2) - 0.3, aa: w('Baseball') - 0.3, beer: w('And', 2) - 0.25, hit: w('Did') - 0.6, rich: w('The', 8) - 0.3,
    polo: w('Polo') - 0.3, tennis: w('Tennis') - 0.3, yacht: w('Racing') - 0.3, same: w('Same') - 0.3,
  };
  const park = (t, quiet = false) => renderBallpark({t, cam: {z: 1.0 + 0.02 * t, ux: 1000 + 30 * t, uy: 600}, quiet});
  const parkA = remap([[c.game, 0.2], [c.aa, 1.6]]), parkB = remap([[c.hit, 2.3], [w('Did'), 3.15], [w('Clean'), 4.0], [c.rich, 9]]);
  const rows = [['cheaper seats', 'Cheaper', 1], ['games on sundays (some cities)', 'Sundays', 1], ['beer for sale', 'beer', 1]];
  const shots = [
    // 1. "Spencer said Americans should relax. Michael and Nora were working on it."
    {a: 0, b: c.game, draw: (T) => push(T, 0, c.game) +
      deskCut('desk/spencer_bust.png', {x: 160, y: 300, w: 440, rot: -2, o: fin(T, 0.1, 0.5), T, caption: 'herbert spencer', cx: 40}) +
      deskProp('p06_beer_stein', {x: 1120, y: 300, w: 420, rot: 4, o: fin(T, w('Michael'), 0.5), T}) + `</div>` +
      op(fin(T, w('relax')), pen('&ldquo;relax more&rdquo;', {x: 640, y: 380, size: 64, rot: -4, color: C.orange})) +
      op(fin(T, w('working')), pen('michael and nora:<br>working on it', {x: 1100, y: 120, size: 54, rot: -4, color: C.orange, w: 600}))},
    // 2. "On a Sunday, the one day both had free, they went to a ball game in Brooklyn."
    {a: c.game, b: c.aa, draw: (T) => park(parkA(T)) +
      op(fin(T, w('free')), pen('the one day both had free', {x: 1100, y: 140, size: 50, rot: -3, color: C.orange}))},
    // 3. "Baseball had a league for the working class: the American Association. Cheaper seats. Games on Sundays, in some cities."
    {a: c.aa, b: c.beer, draw: (T) => desk() +
      op(fin(T, w('league', 1)), mono('a league for the working class', {x: 200, y: 180, size: 30, color: C.teal, ls: 5})) +
      slideUp(fin(T, w('American')), `<div class="tx" style="position:absolute;left:190px;top:240px;font-family:Abril;font-size:100px;color:${C.cream}">The American Association</div>`) +
      op(fin(T, w('American')) * 0.9, mono('1882 to 1891 &middot; brooklyn joined in 1884', {x: 200, y: 380, size: 24})) +
      rows.map(([txt, wd, n], i) => op(fin(T, w(wd, n), 0.3), `<div class="tx" style="position:absolute;left:300px;top:${500 + i * 120}px;font-family:Inter;font-weight:800;font-size:56px;color:${C.cream}">${txt}</div>`) + tick(210, 548 + i * 120, clamp01((T - w(wd, n)) / 0.4))).join('') +
      stamp('Brooklyn &middot; 1884', 1)},
    // 4. "And beer, which the other league banned. Its rivals called it 'the Beer and Whiskey League.' ... The fans took it as a compliment."
    {a: c.beer, b: c.hit, draw: (T) => push(T, c.beer, c.hit) +
      deskProp('p06_beer_stein', {x: 220, y: 280, w: 480, rot: -3, o: fin(T, c.beer + 0.1, 0.5), T}) +
      deskProp('p06_baseball_1880s', {x: 1180, y: 380, w: 560, rot: 6, o: fin(T, w('rivals'), 0.5), T}) + `</div>` +
      op(fin(T, w('banned')), pen('the other league (the national league) banned it', {x: 160, y: 120, size: 46, rot: -3, color: C.orange})) +
      (fin(T, w('Beer', 2)) > 0 ? slideUp(fin(T, w('Beer', 2)), tape('&ldquo;THE BEER AND WHISKEY LEAGUE&rdquo;', {x: 160, y: 790, size: 70, rot: -2, seed: 71})) : '') +
      op(fin(T, w('insult')), pen('an insult...', {x: 820, y: 260, size: 60, rot: -4, color: '#E07A5F'})) +
      op(fin(T, w('compliment')), pen('...a compliment', {x: 900, y: 380, size: 60, rot: -4, color: C.teal}))},
    // 5. The hit. MICHAEL: "Did you see that? Clean over the fence!" NORA: "I saw it. I also saw you spill your beer on that man's hat."
    {a: c.hit, b: c.rich, draw: (T) => park(parkB(T))},
    // 6. "The rich had other ideas about Sunday." The America's Cup, 1886.
    {a: c.rich, b: c.polo, draw: (T) => push(T, c.rich, c.polo) + deskCut('desk/mayflower_galatea_1886.png', {x: 360, y: 120, w: 1200, rot: -1.5, o: fin(T, c.rich + 0.1, 0.5), T}) + `</div>` +
      op(fin(T, c.rich + 0.4) * 0.9, mono("mayflower and galatea, the america's cup, 1886", {x: 380, y: 1000, size: 20})) +
      op(fin(T, w('ideas')), pen('other ideas about sunday', {x: 200, y: 60, size: 54, rot: -3, color: C.orange}))},
    // 7. "Polo, brought over from England."
    {a: c.polo, b: c.tennis, draw: (T) => renderLeisure(3.7 + (T - c.polo) * 1.1, true) + stamp('Polo &middot; 1880s', 1) +
      op(fin(T, w('England')), pen('brought over from england', {x: 1160, y: 140, size: 50, rot: -3, color: C.orange}))},
    // 8. "Tennis at the beach houses in Newport."
    {a: c.tennis, b: c.yacht, draw: (T) => renderLeisure(0.5 + (T - c.tennis) * 1.1, true) + stamp('Lawn tennis &middot; Newport, Rhode Island &middot; 1880s', 1) +
      op(fin(T, w('Newport')), pen('the beach houses of newport', {x: 1160, y: 140, size: 50, rot: -3, color: C.orange}))},
    // 10. "Same day off. Very different Sunday." The two Sundays side by side.
    //    (from "Racing yachts the size of houses": the right half is the yachts, so the closing words get their reading time)
    {a: c.yacht, b: dur, draw: (T) => twoScenes(park(6 + (T - c.yacht) * 0.5, true), renderLeisure(8.0 + (T - c.yacht) * 0.3, true)) +
      op(fin(T, w('size')), pen('yachts the size of houses', {x: 1000, y: 880, size: 50, rot: -3, color: C.orange})) +
      (fin(T, w('Same')) > 0 ? slideUp(fin(T, w('Same')), tape('SAME DAY OFF.', {x: 640, y: 120, size: 84, rot: -2, seed: 73})) : '') +
      op(fin(T, w('Same') + 0.6), pen('very different sunday.', {x: 640, y: 290, size: 64, rot: -3, color: C.orange}))},
  ];
  return {dur, shots, fadeOut: 0.6};
};
