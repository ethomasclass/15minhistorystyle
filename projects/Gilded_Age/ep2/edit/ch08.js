// Chapter 8, "Rags to Riches" (9:02 to 10:07): the novels' story, what historians found, the answer to the question (two answers),
// Nora's wages on the table, Episode 3, thanks. ga_gilded_theme comes in at "So, what did the richest people".
EDITS.ch08 = () => {
  const ch = 'ch08_rags_to_riches', w = (word, n) => wordAt(ch, word, n), dur = window.WORDS[ch].duration;
  const c = {
    novels: w('Popular') - 0.3, carn: w('Carnegie', 1) - 0.3, study: w('But', 1) - 0.3, exc: w('Carnegie', 2) - 0.3, q: w('So') - 0.3,
    nothing: w('Some', 1) - 0.3, deal: w('Some', 2) - 0.3, nora: w('And', 5) - 0.25, table: w('And', 6) - 0.25, next: w('Next', 1) - 0.3,
    thanks: w('Thanks') - 0.3,
  };
  // the business leaders the historians looked up, as a field of small figures (schematic: no counts are claimed)
  const field = (T, o, hiC = 0) => { const s = [], r = rng(8);
    for (let i = 0; i < 60; i++) { const x = 260 + (i % 15) * 92, y = 420 + Math.floor(i / 15) * 150, carn = i === 52;
      const lab = carn ? '' : ['businessman', 'lawyer', 'well-off farmer'][Math.floor(r() * 3)];
      s.push(`<g opacity="${(o * (carn ? 1 : 1 - 0.55 * hiC)).toFixed(3)}">` + figure({x, y, h: 120, d: i % 2 ? -1 : 1, kind: 'man', hat: 'top', coat: 'frock', fill: carn && hiC > 0 ? C.orange : C.teal, an: POSES.stand(T, i * 0.2)}) + '</g>');
      void lab; }
    return s.join(''); };
  const shots = [
    // 1. "There's one more story the Gilded Age told itself. Maybe the most powerful one."
    {a: 0, b: c.novels, draw: (T) => push(T, 0, c.novels, 0.05) + deskProp('p08_dime_novel', {x: 700, y: 120, w: 560, rot: -3, o: fin(T, 0.2, 0.6), T}) + `</div>` +
      op(fin(T, w('story', 1)), pen('one more story', {x: 180, y: 200, size: 64, rot: -4, color: C.orange})) +
      op(fin(T, w('powerful')), pen('maybe the most powerful one', {x: 1240, y: 820, size: 50, rot: -3, color: C.orange})) +
      op(fin(T, 0.6) * 0.85, mono('a dime novel like the ones of the 1880s (re-creation)', {x: 660, y: 1010, size: 18, color: '#9a958c'}))},
    // 2. "Popular novels told it over and over: a poor boy works hard, stays honest, and rises to the top. Rags to riches."
    {a: c.novels, b: c.carn, draw: (T) => { const steps = [[w('poor'), 'a poor boy'], [w('works'), 'works hard'], [w('stays'), 'stays honest'], [w('rises'), 'rises to the top']];
      const k = steps.filter(([t]) => T >= t).length, g = [];
      for (let i = 0; i < 4; i++) g.push(`<rect x="${200 + i * 230}" y="${880 - i * 150}" width="230" height="${30 + i * 150}" fill="${i < k ? '#24403D' : '#1a1814'}" stroke="${C.teal}" stroke-width="3" opacity="${fin(T, c.novels + 0.1)}"/>`);
      const px = 315 + Math.max(0, k - 1) * 230, py = 880 - Math.max(0, k - 1) * 150;
      return desk() + svg(g.join('') + (k > 0 ? figure({x: px, y: py, h: 170, d: 1, kind: 'man', hat: k > 3 ? 'top' : 'cap', coat: k > 3 ? 'frock' : 'jacket', fill: C.cream, an: POSES.stand(T, 0.3)}) : '')) +
        steps.map(([t, txt], i) => op(fin(T, t, 0.3), pen(txt, {x: 210 + i * 230, y: 820 - i * 150 - 140, size: 38, rot: -4, color: C.orange}))).join('') +
        op(fin(T, w('Popular')) * 0.9, mono('the plot of a hundred popular novels (horatio alger and others)', {x: 200, y: 140, size: 24, color: C.teal})) +
        vocabCard('rags to riches', 'RAGZ tuh RICH-iz', 'phrase', 'From very poor to very rich, by your own hard work.', {x: 1180, y: 520, o: fin(T, w('Rags'), 0.4)});
    }},
    // 3. "Carnegie seemed to prove it."
    {a: c.carn, b: c.study, draw: (T) => push(T, c.carn, c.study) +
      deskCut(EP1 + 'desk/carnegie_16_with_tom_bust.png', {x: 160, y: 260, w: 640, rot: -2, o: fin(T, c.carn + 0.1, 0.5), T, caption: 'carnegie at 16 (right)', cx: 40}) +
      deskCut('desk/carnegie_1885_bust.png', {x: 1020, y: 220, w: 680, rot: 2, o: fin(T, c.carn + 0.5, 0.5), T, caption: 'carnegie at about 50', cx: 40}) + `</div>` +
      svg(drawLine([[820, 560], [1000, 520]], clamp01((T - c.carn - 0.6) / 0.6))) +
      op(fin(T, w('prove')), pen('bobbin boy to steel king', {x: 640, y: 860, size: 56, rot: -3, color: C.orange}))},
    // 4. "But years later, historians looked up where hundreds of real business leaders of the time came from. Most had fathers who were
    //    businessmen, or lawyers, or well-off farmers."
    {a: c.study, b: c.exc, draw: (T) => desk() + svg(field(T, fin(T, w('hundreds'), 0.6))) +
      op(fin(T, w('historians')), mono('historians looked up hundreds of real business leaders', {x: 260, y: 160, size: 28, color: C.teal, ls: 3})) +
      op(fin(T, w('hundreds')) * 0.85, mono('schematic, not to scale', {x: 260, y: 1010, size: 18, color: '#9a958c'})) +
      op(fin(T, w('fathers')), pen('most had fathers who were...', {x: 260, y: 220, size: 52, rot: -3, color: C.orange})) +
      op(fin(T, w('businessmen')), tape('BUSINESSMEN', {x: 1180, y: 190, size: 44, rot: -3, seed: 83})) +
      op(fin(T, w('lawyers')), tape('LAWYERS', {x: 1520, y: 250, size: 44, rot: 2, seed: 84})) +
      op(fin(T, w('farmers')), tape('WELL-OFF FARMERS', {x: 1260, y: 320, size: 44, rot: -2, seed: 85}))},
    // 5. "Carnegie wasn't the rule. He was the exception that made the story famous."
    {a: c.exc, b: c.q, draw: (T) => desk() + svg(field(T, 1, fin(T, w('exception'), 0.5))) +
      op(fin(T, w('rule')), pen("carnegie wasn't the rule", {x: 260, y: 200, size: 56, rot: -3, color: C.orange})) +
      op(fin(T, w('exception')), pen('the exception', {x: 1220, y: 880, size: 60, rot: -4, color: C.orange})) +
      svg(drawLine([[1280, 880], [1235, 790]], clamp01((T - w('exception')) / 0.4)))},
    // 6. The question again.
    {a: c.q, b: c.nothing, draw: (T) => desk() + dimBy(0.3) +
      op(fin(T, w('So')), mono('the question', {x: 130, y: 250, size: 28, color: C.teal, ls: 6})) +
      slideUp(fin(T, w('what', 1)), `<div style="position:absolute;left:124px;top:300px;font-family:Abril;font-size:96px;line-height:1.08;color:${C.cream}">What did the richest people<br>in America think...</div>`) +
      (fin(T, w('think')) > 0 ? slideUp(fin(T, w('think')), tape('they owed everyone else?', {x: 120, y: 560, size: 84, rot: -2, seed: 17})) : '')},
    // 7. "Some said nothing at all. The fittest win; that's nature."
    {a: c.nothing, b: c.deal, draw: (T) => push(T, c.nothing, c.deal) +
      deskCut('desk/spencer_bust.png', {x: 160, y: 300, w: 440, rot: -2, o: fin(T, c.nothing + 0.1, 0.5), T, caption: 'spencer', cx: 40}) +
      deskCut('desk/sumner_bust.png', {x: 620, y: 330, w: 420, rot: 2, o: fin(T, c.nothing + 0.3, 0.5), T, caption: 'sumner', cx: 40}) + `</div>` +
      mono('answer one', {x: 1180, y: 260, size: 28, color: C.teal, ls: 6}) +
      (fin(T, w('nothing')) > 0 ? slideUp(fin(T, w('nothing')), tape('NOTHING AT ALL', {x: 1160, y: 320, size: 72, rot: -3, seed: 87})) : '') +
      op(fin(T, w('fittest')), pen("the fittest win;<br>that's nature", {x: 1200, y: 520, size: 56, rot: -3, color: C.orange, w: 600}))},
    // 8. "Some, like Carnegie, said they owed a great deal, but they'd decide what, and how, and when."
    {a: c.deal, b: c.nora, draw: (T) => push(T, c.deal, c.nora) +
      deskCut('desk/carnegie_1885_bust.png', {x: 140, y: 300, w: 640, rot: -2, o: fin(T, c.deal + 0.1, 0.5), T, caption: 'carnegie', cx: 40}) + `</div>` +
      mono('answer two', {x: 1000, y: 200, size: 28, color: C.teal, ls: 6}) +
      (fin(T, w('great')) > 0 ? slideUp(fin(T, w('great')), tape('A GREAT DEAL...', {x: 980, y: 260, size: 72, rot: -3, seed: 89})) : '') +
      op(fin(T, w('decide')), pen('...but they decide:', {x: 1000, y: 430, size: 54, rot: -3, color: C.orange})) +
      [['what', 'what', 2], ['how', 'how', 1], ['when', 'when', 1]].map(([txt, wd, n], i) => op(fin(T, w(wd, n), 0.3),
        `<div style="position:absolute;left:1120px;top:${540 + i * 110}px;font-family:Inter;font-weight:800;font-size:60px;color:${C.cream}">${txt}</div>`) + tick(1030, 590 + i * 110, clamp01((T - w(wd, n)) / 0.4))).join('')},
    // 9. "And while they argued about it, Nora went back to Fifth Avenue on the evening ferry"
    {a: c.nora, b: c.table, draw: (T) => renderFifth({t: T, cam: {z: 1.3, ux: 1800 + (T - c.nora) * 30, uy: 600}, quiet: true}) +
      op(fin(T, w('Nora')), pen('nora, back to fifth avenue', {x: 120, y: 130, size: 56, rot: -3, color: C.orange})) + compositeBar(fin(T, w('Nora'), 0.5))},
    // 10. "and her week's wages stayed on the kitchen table."
    {a: c.table, b: c.next, draw: (T) => renderFlat({t: 8.8 + (T - c.table) * 0.05, cam: {z: 1.9 + 0.15 * ease((T - c.table) / 3), ux: 1080, uy: 660}, quiet: true}) +
      op(fin(T, w('wages')), pen("her week's wages, on the table", {x: 1000, y: 130, size: 54, rot: -3, color: C.orange})) + compositeBar(1)},
    // 11. "Next time: new neighbors move into the Kellys' building. They've come a very long way."
    {a: c.next, b: c.thanks, draw: (T) => push(T, c.next, c.thanks, 0.05) + deskCut('desk/riis_tenement_flat_c1889.png', {x: 1080, y: 80, w: 680, rot: 2, o: fin(T, c.next + 0.1, 0.5), T}) + `</div>` +
      op(fin(T, c.next + 0.4) * 0.9, mono('a tenement flat, new york (jacob riis, about 1889)', {x: 1000, y: 1000, size: 20})) +
      (fin(T, w('Next', 1)) > 0 ? slideUp(fin(T, w('Next', 1)), tape('NEXT TIME', {x: 140, y: 200, size: 90, rot: -2, seed: 91})) : '') +
      op(fin(T, w('neighbors')), pen("new neighbors in the kellys' building", {x: 150, y: 420, size: 52, rot: -3, color: C.orange})) +
      op(fin(T, w('long')), pen('...from a very long way', {x: 200, y: 540, size: 56, rot: -3, color: C.orange})) +
      op(fin(T, w('neighbors')) * 0.9, mono('episode 3: immigration', {x: 160, y: 680, size: 28, color: C.teal, ls: 5}))},
    // 12. "Thanks for watching. Subscribe for more, and I'll see you next time."
    {a: c.thanks, b: dur, draw: (T) => desk() + slideUp(fin(T, w('Thanks')), tape('THANKS FOR WATCHING', {x: 480, y: 380, size: 100, rot: -2, seed: 129})) +
      op(fin(T, w('Subscribe')), mono('chunk history &middot; the gilded age &middot; episode 2 of 6', {x: 560, y: 600, size: 26, color: C.teal}))},
  ];
  return {dur, shots, fadeOut: 0.8};
};
