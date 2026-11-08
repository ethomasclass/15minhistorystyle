// Chapter 3, "The Party" (2:43 to 3:42): the hobby-horse quadrille, the Electric Light, supper at two, sunrise, the papers, the bill.
EDITS.ch03 = () => {
  const ch = 'ch03_the_party', w = (word, n) => wordAt(ch, word, n), dur = window.WORDS[ch].duration + 2.0;   // + a held tail after the last word, so the last labels get their reading time
  const c = {
    quad: w('The', 1) - 0.3, horse: w('One', 1) - 0.3, power: w('These') - 0.3, alice: w('The', 4) - 0.3, gas: w('Electric', 2) - 0.3,
    dress: w('She') - 0.3, supper: w('Supper') - 0.3, dawn: w('The', 10) - 0.3, papers: w('The', 11) - 0.3, bill: w('The', 13) - 0.3,
  };
  const hall = (T, z, ux, uy) => renderBall({t: T, cam: {z, ux, uy}, quiet: true});
  const dawn = (T) => { const t = 2.2 + (T - c.dawn) * 1.4, u = ease(t / 9);
    return renderFifth({t, dawn: 0.65 + 0.03 * t, quiet: true, cam: {z: lerpLog(0.72, 1.75, u), ux: 1950 - 170 * u, uy: 330 + 340 * u}}); };
  const shots = [
    // 1. "And they arrived on horseback. Sort of." The great hall, the hobby-horse quadrille.
    {a: 0, b: c.quad, draw: (T) => hall(T, 2.0 + 0.1 * ease(T / c.quad), 1060, 760) +
      stamp('The ball &middot; March 26, 1883', fin(T, 0.3)) +
      op(fin(T, w('Sort')), pen('sort of.', {x: 1300, y: 160, size: 70, rot: -5, color: C.orange}))},
    // 2. "The guests had practiced dances for weeks, in groups called quadrilles."
    {a: c.quad, b: c.horse, draw: (T) => hall(T, 2.1 + 0.15 * ease((T - c.quad) / 4.7), 1060, 760) +
      op(fin(T, w('weeks')), pen('practiced for weeks', {x: 120, y: 150, size: 54, rot: -3, color: C.orange})) +
      vocabCard('quadrille', 'kwah-DRIL', 'noun', 'A dance for a set of couples in a fixed pattern. Each group at the ball rehearsed its own.', {x: 1160, y: 110, o: fin(T, w('quadrilles'), 0.4)})},
    // 3. "One group strapped fake horses around their waists and pranced down the grand staircase."
    {a: c.horse, b: c.power, draw: (T) => push(T, c.horse, c.power) +
      deskCut('desk/660_staircase.png', {x: 820, y: 230, w: 960, rot: 2, o: fin(T, w('grand'), 0.5), T}) +
      deskProp('p03_hobby_horse', {x: 180, y: 160, w: 640, rot: -4, o: fin(T, c.horse + 0.1, 0.5), T}) + `</div>` +
      op(fin(T, w('fake')), pen('fake horses, strapped on', {x: 160, y: 80, size: 54, rot: -3, color: C.orange})) +
      op(fin(T, w('grand')), pen('down the grand staircase', {x: 900, y: 120, size: 52, rot: -3, color: C.orange})) +
      op(fin(T, w('grand') + 0.3) * 0.9, mono('the grand staircase, 660 fifth avenue (about 1902)', {x: 840, y: 900, size: 20})) +
      op(fin(T, c.horse + 0.3) * 0.85, mono('a hobby horse like theirs (re-creation)', {x: 200, y: 1000, size: 18, color: '#9a958c'}))},
    // 4. "These were the most powerful people in America."
    {a: c.power, b: c.alice, draw: (T) => hall(T, 1.5 - 0.2 * ease((T - c.power) / 3), 1000, 700) +
      op(fin(T, w('powerful')), pen('the most powerful people in america', {x: 140, y: 140, size: 58, rot: -3, color: C.orange}))},
    // 5. "The woman with the torch was Alva's sister-in-law, Alice Vanderbilt, dressed as 'The Electric Light.' In white satin and diamonds."
    {a: c.alice, b: c.gas, draw: (T) => push(T, c.alice, c.gas) +
      deskCut('desk/alice_electric_light_mora_1883.png', {x: 260, y: 120, w: 380, rot: -1.5, o: fin(T, c.alice + 0.1, 0.6), T, caption: 'alice vanderbilt, &ldquo;the electric light&rdquo;', cx: -40, cy: -40}) +
      deskProp('p01_electric_torch', {x: 1500, y: 140, w: 200, rot: 10, o: fin(T, w('Electric', 1), 0.5), T}) + `</div>` +
      op(fin(T, c.alice + 0.4) * 0.9, mono('photograph by josé maría mora, 1883', {x: 240, y: 990, size: 18})) +
      op(fin(T, w('sister-in-law')), pen("alva's sister-in-law", {x: 760, y: 260, size: 56, rot: -3, color: C.orange})) +
      op(fin(T, w('Alice')), pen('alice vanderbilt', {x: 780, y: 360, size: 60, rot: -3, color: C.orange})) +
      op(fin(T, w('white')), pen('white satin and diamonds', {x: 760, y: 700, size: 54, rot: -3, color: C.orange}))},
    // 6. "Electric lights had only just come to New York. Most homes still used gas."
    {a: c.gas, b: c.dress, draw: (T) => push(T, c.gas, c.dress) +
      deskCut(EP1 + 'props/p03_edison_bulb_lit.webp', {x: 300, y: 260, w: 360, rot: -4, o: fin(T, c.gas + 0.1, 0.5), T}) +
      deskCut(EP1 + 'props/p07_kerosene_lamp.webp', {x: 1180, y: 220, w: 420, rot: 3, o: fin(T, w('gas'), 0.5), T}) + `</div>` +
      op(fin(T, w('just')), pen('new in new york:<br>pearl street, september 1882', {x: 220, y: 100, size: 46, rot: -3, color: C.orange, w: 700})) +
      op(fin(T, w('gas')), pen('most homes: gas and oil lamps', {x: 1060, y: 120, size: 46, rot: -3, color: C.orange}))},
    // 7. "She wore the newest technology in the world, as a dress." Close on the one glowing figure in the hall.
    {a: c.dress, b: c.supper, draw: (T) => hall(T, 3.0 + 0.4 * ease((T - c.dress) / 4.4), 960, 800) +
      op(fin(T, w('newest')), pen('the newest technology in the world...', {x: 120, y: 130, size: 54, rot: -3, color: C.orange})) +
      op(fin(T, w('dress', 1)), pen('...as a dress', {x: 1200, y: 240, size: 64, rot: -4, color: C.orange}))},
    // 8. "Supper came at two in the morning."
    {a: c.supper, b: c.dawn, draw: (T) => desk() + svg(clockDefs + stationClock(620, 540, 260, 2.0, {seconds: false})) +
      deskProp('p05_dinner_menu', {x: 1180, y: 210, w: 380, rot: 5, o: fin(T, c.supper + 0.2, 0.5), T}) +
      op(fin(T, w('two')), pen('supper: 2 a.m.', {x: 1060, y: 120, size: 60, rot: -4, color: C.orange}))},
    // 9. "The last dance ended at sunrise." Fifth Avenue at dawn; Nora up the area steps.
    {a: c.dawn, b: c.papers, draw: (T) => dawn(T) + stamp('Fifth Avenue &middot; dawn, March 27, 1883', 1) +
      op(fin(T, w('last')), pen('the last dance ended at sunrise', {x: 1080, y: 130, size: 50, rot: -3, color: C.orange}))},
    // 10. "The newspapers printed every costume, every flower, every name. Which was the point."
    {a: c.papers, b: c.bill, draw: (T) => push(T, c.papers, c.bill) +
      deskCut('desk/leslies_1883_cover.png', {x: 200, y: 50, w: 620, rot: -2, o: fin(T, c.papers + 0.1, 0.5), T}) + `</div>` +
      op(fin(T, c.papers + 0.4) * 0.9, mono("frank leslie's, april 7, 1883", {x: 220, y: 1010, size: 20})) +
      op(fin(T, w('costume')), pen('every costume,', {x: 1000, y: 260, size: 60, rot: -3, color: C.orange})) +
      op(fin(T, w('flower')), pen('every flower,', {x: 1060, y: 380, size: 60, rot: -3, color: C.orange})) +
      op(fin(T, w('name')), pen('every name.', {x: 1120, y: 500, size: 60, rot: -3, color: C.orange})) +
      (fin(T, w('Which')) > 0 ? slideUp(fin(T, w('Which')), tape('WHICH WAS THE POINT', {x: 960, y: 700, size: 70, rot: -3, seed: 52})) : '')},
    // 11. The bill: $250,000 (about $9 million today); $65,000 of it champagne. "For one night."
    {a: c.bill, b: dur, draw: (T) => { const ch2 = fin(T, w('A', 2), 0.4);
      return push(T, c.bill, dur) + deskProp('p03_champagne', {x: 1180, y: 380, w: 620, rot: 3, o: ch2, T}) + `</div>` +
        op(fin(T, w('bill')) * 0.9, mono('the bill (as reported)', {x: 160, y: 190, size: 28, ls: 4})) +
        bigFig('$250,000', {x: 140, y: 240, size: 180, w: 1100, align: 'left', o: fin(T, w('two', 2), 0.4)}) +
        today('&asymp; $9 million today', {x: 160, y: 440, w: 900, align: 'left', o: fin(T, w("today's"), 0.4)}) +
        bigFig('$65,000 champagne', {x: 140, y: 600, size: 90, w: 1100, align: 'left', o: ch2}) +
        today('&asymp; $2.3 million today &middot; reported', {x: 160, y: 710, w: 1000, align: 'left', o: fin(T, w('A', 2) + 0.3, 0.4)}) +
        (fin(T, w('champagne')) > 0 ? slideUp(fin(T, w('champagne')), tape('FOR ONE NIGHT.', {x: 160, y: 830, size: 90, rot: -2, seed: 55})) : '');
    }},
  ];
  return {dur, shots, fadeOut: 0.6};
};
