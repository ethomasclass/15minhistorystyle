// Chapter 5, "Survival of the Fittest" (5:05 to 6:49): Spencer's phrase, Social Darwinism and what "fit" means, the Delmonico's
// banquet, Sumner's book, and his A, B, C, D (lookdev/ep2_more.js fittest_explainer, re-timed to the words).
EDITS.ch05 = () => {
  const ch = 'ch05_survival_of_the_fittest', w = (word, n) => wordAt(ch, word, n), dur = window.WORDS[ch].duration;
  const c = {
    spencer: w('It', 2) - 0.3, nature: w('In', 1) - 0.3, claim: w('Spencer', 3) - 0.3, fit: w('Though') - 0.3, roach: w('A', 5) - 0.2,
    tour: w('In', 4) - 0.3, dinner: w('They', 2) - 0.3, sumner: w('An', 2) - 0.3, nothing: w('His', 3) - 0.3, abcd: w('Sumner', 2) - 0.3,
  };
  const fitA = remap([[c.nature, 0.1], [w('suited'), 0.9], [w('survive'), 1.7], [c.claim, 2.5]]);
  const fitB = remap([[c.claim, 4.7], [w('strongest'), 5.3], [w('weak'), 5.75], [c.fit, 5.97]]);
  const fitFit = remap([[c.fit, 2.55], [w('suited', 2), 2.9], [c.roach, 2.98]]);
  const banq = remap([[c.dinner, 0], [w('restaurant'), 3.0], [w('told'), 4.6], [w('relax'), 6.6], [c.sumner, 9]]);
  const fitC = remap([[c.abcd, 7.3], [w('A', 11), 7.5], [w('B'), 7.7], [w('C', 1), 7.9], [w('D', 1), 8.15], [w('helped'), 8.5], [w('C', 3), 8.7], [w('pays'), 9.0], [w('it', 5), 9.4], [dur, 10]]);
  const shots = [
    // 1. "So how did people like the Vanderbilts feel about all this? A lot of them felt... fine. And they had an idea to explain it."
    {a: 0, b: c.spencer, draw: (T) => renderBall({t: T + 50, cam: {z: 1.6 + 0.2 * ease(T / c.spencer), ux: 1000, uy: 720}, quiet: true}) +
      op(fin(T, w('fine')), pen('they felt... fine.', {x: 140, y: 140, size: 70, rot: -4, color: C.orange})) +
      op(fin(T, w('idea')), pen('and they had an idea to explain it', {x: 160, y: 270, size: 48, rot: -3, color: C.orange}))},
    // 2. "a British writer named Herbert Spencer. After reading Darwin, Spencer coined a phrase ... survival of the fittest."
    {a: c.spencer, b: c.nature, draw: (T) => push(T, c.spencer, c.nature) +
      deskCut('desk/spencer_bust.png', {x: 180, y: 220, w: 600, rot: -2, o: fin(T, w('Herbert'), 0.6), T, caption: 'herbert spencer (photo, 1889)', cx: 60}) + `</div>` +
      op(fin(T, w('British')), pen('a british writer', {x: 200, y: 80, size: 56, rot: -3, color: C.orange})) +
      op(fin(T, w('Darwin')), pen('after reading darwin', {x: 860, y: 860, size: 52, rot: -3, color: C.orange})) +
      vocabCard('survival of the fittest', 'sur-VY-vul uv the FIT-ist', 'phrase', 'The living things best suited to their world survive and have more young. Spencer&rsquo;s phrase, 1864.', {x: 1000, y: 130, w: 820, size: 62, o: fin(T, w('survival'), 0.4)})},
    // 3. "In nature, the plants and animals best suited to their world survive and have more babies." (explainer, beat A)
    {a: c.nature, b: c.claim, draw: (T) => renderFittest(fitA(T))},
    // 4. "Spencer and his fans said society works the same way. The strongest rise ... The weak fall ... Social Darwinism." (beat B)
    {a: c.claim, b: c.fit, draw: (T) => renderFittest(fitB(T)) +
      op(fin(T, w('helping')), pen('helping the poor &ldquo;gets in the way&rdquo;', {x: 90, y: 860, size: 46, rot: -3, color: C.orange})) +
      vocabCard('Social Darwinism', 'SOH-shul DAR-wih-niz-um', 'noun', 'Using &ldquo;survival of the fittest&rdquo; to argue that the rich deserve to be rich and the poor deserve to be poor. A name historians gave it later.', {x: 60, y: 300, w: 760, size: 62, rot: -1.5, o: fin(T, w('Social'), 0.4)})},
    // 5. "Though it's worth saying, 'fit' in nature doesn't mean 'best.' It means suited." (beat A again, the note)
    {a: c.fit, b: c.roach, draw: (T) => renderFittest(fitFit(T)) +
      op(fin(T, w('best')), pen('fit &ne; best', {x: 1260, y: 170, size: 80, rot: -5, color: C.orange}))},
    // 6. "A cockroach is very fit."
    {a: c.roach, b: c.tour, draw: (T) => push(T, c.roach, c.tour, 0.06) + deskProp('p05_beetle_cockroach', {x: 760, y: 260, w: 400, rot: 12, o: fin(T, c.roach, 0.4), T}) + `</div>` +
      op(fin(T, w('fit', 2)), pen('very fit.', {x: 1200, y: 420, size: 80, rot: -6, color: C.orange}))},
    // 7. "In 1882, Spencer toured America, and the rich treated him like a rock star."
    {a: c.tour, b: c.dinner, draw: (T) => push(T, c.tour, c.dinner) +
      deskCut('desk/spencer_bust.png', {x: 1180, y: 260, w: 520, rot: 2, o: fin(T, c.tour + 0.1, 0.5), T, caption: 'herbert spencer', cx: 60}) + `</div>` +
      stamp('1882', fin(T, w('1882'))) +
      op(fin(T, w('toured')), pen('his american tour, 1882', {x: 200, y: 260, size: 60, rot: -4, color: C.orange})) +
      (fin(T, w('rock')) > 0 ? slideUp(fin(T, w('rock')), tape('LIKE A ROCK STAR', {x: 200, y: 480, size: 90, rot: -3, seed: 63})) : '')},
    // 8. The banquet at Delmonico's (lookdev spencer_banquet): "he told them they worked too hard ... needed to relax more.
    //    Rich men cheered a speech about working less. Their workers were not invited."
    {a: c.dinner, b: c.sumner, draw: (T) => renderBanquet(banq(T)) +
      op(fin(T, w('hard')) * fout(T, w('relax') - 0.3), pen('&ldquo;you work too hard&rdquo;', {x: 140, y: 140, size: 54, rot: -3, color: C.orange})) +
      op(fin(T, w('cheered')), pen('rich men cheered', {x: 140, y: 240, size: 54, rot: -3, color: C.orange})) +
      (fin(T, w('Their', 2)) > 0 ? slideUp(fin(T, w('Their', 2)), tape('THEIR WORKERS: NOT INVITED', {x: 140, y: 820, size: 72, rot: -2, seed: 65})) : '')},
    // 9. "An American professor, William Graham Sumner, went further. In 1883 ... What Social Classes Owe to Each Other."
    {a: c.sumner, b: c.nothing, draw: (T) => { const book = fin(T, w('book'), 0.5);
      return push(T, c.sumner, c.nothing) +
        deskCut('desk/sumner_bust.png', {x: 180, y: 240, w: 560, rot: -2, o: fin(T, c.sumner + 0.2, 0.6), T, caption: 'william graham sumner, yale professor', cx: 20}) +
        deskProp('p07_library_book', {x: 1080, y: 240, w: 600, rot: 4, o: book, T}) + `</div>` +
        op(book, `<div style="position:absolute;left:1180px;top:${360 + (1 - ease(book)) * 70}px;width:400px;transform:rotate(4deg);padding:20px;background:#E9E1CE;box-shadow:0 6px 14px rgba(0,0,0,.5);text-align:center;font-family:Playfair;font-weight:900;font-size:40px;line-height:1.1;color:#1d1a16">What Social Classes Owe to Each Other<div style="font-family:Mono;font-size:16px;letter-spacing:3px;margin-top:10px;font-weight:400">W. G. SUMNER &middot; 1883</div></div>`) +
        stamp('1883 &middot; the same year as the ball', fin(T, w('1883'))) +
        op(fin(T, w('further')), pen('he went further', {x: 860, y: 120, size: 56, rot: -3, color: C.orange}));
    }},
    // 10. "His answer was: nothing. One line from it: 'A drunkard in the gutter is just where he ought to be.'"
    {a: c.nothing, b: c.abcd, draw: (T) => desk() +
      (fin(T, w('nothing')) > 0 ? slideUp(fin(T, w('nothing')) * fout(T, w('line') - 0.2), tape('NOTHING.', {x: 640, y: 380, size: 170, rot: -3, seed: 67})) : '') +
      op(fin(T, c.nothing + 0.2) * fout(T, w('line') - 0.2), mono('what do social classes owe to each other?', {x: 0, y: 300, size: 30, color: C.teal, extra: 'width:1920px;text-align:center'})) +
      quote('&ldquo;A drunkard in the gutter is just where he ought to be.&rdquo;', 'william graham sumner, 1883', {x: 200, y: 360, w: 1520, size: 80, o: fin(T, w('drunkard') - 0.3, 0.4)})},
    // 11. Sumner's letters: "A and B, he wrote, decide what C shall do for D ... Sumner called him 'the Forgotten Man.'" (beat C)
    {a: c.abcd, b: dur, draw: (T) => renderFittest(fitC(T)) +
      op(fin(T, w('D', 2)), pen('D: the poor person being helped', {x: 1260, y: 470, size: 38, rot: -3, color: C.teal})) +
      op(fin(T, w('A', 11)) * fout(T, w('D', 2)), pen('A and B: the reformers', {x: 260, y: 470, size: 38, rot: -3, color: C.teal})) +
      (fin(T, w('Forgotten')) > 0 ? slideUp(fin(T, w('Forgotten')), tape('THE FORGOTTEN MAN', {x: 700, y: 40, size: 70, rot: -2, seed: 69})) : '')},
  ];
  return {dur, shots, fadeOut: 0.6};
};
