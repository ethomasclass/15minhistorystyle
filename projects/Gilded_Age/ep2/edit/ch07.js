// Chapter 7, "The Gospel of Wealth" (7:45 to 9:00): Carnegie at 53, "Wealth" (1889), give it away while alive, the libraries,
// philanthropy, the rich as trustees, and the mill workers' question.
EDITS.ch07 = () => {
  const ch = 'ch07_the_gospel_of_wealth', w = (word, n) => wordAt(ch, word, n), dur = window.WORDS[ch].duration;
  const c = {
    y1889: w('In', 1) - 0.3, essay: w('But', 1) - 0.3, rules: w('Carnegie', 2) - 0.3, libs: w('Like') - 0.3, built: w('He', 4) - 0.3,
    phil: w("That's") - 0.3, trust: w('said', 2) - 0.6, mill: w('And', 5) - 0.25, hold: w('Hold') - 0.3,
  };
  const lib = remap([[c.built, 0.2], [w('States'), 3.6], [w('open'), 4.8], [c.phil, 9]]);
  const rules = [['don&rsquo;t leave it to your kids', 'leave', false], ['don&rsquo;t waste it on parties', 'waste', false], ['give it away, while you&rsquo;re alive', 'give', true],
    ['to things that help people help themselves', 'help', true]];
  const shots = [
    // 1. "Remember Andrew Carnegie, from last time? The one who promised himself he'd quit at thirty-five?"
    {a: 0, b: c.y1889, draw: (T) => push(T, 0, c.y1889) +
      deskCut('desk/carnegie_1885_bust.png', {x: 160, y: 220, w: 760, rot: -2, o: fin(T, w('Andrew') - 0.3, 0.6), T, caption: 'andrew carnegie, about 1885', cx: 60}) + `</div>` +
      op(fin(T, w('Sumner')), pen('not every rich man agreed with sumner', {x: 900, y: 120, size: 46, rot: -3, color: C.orange})) +
      op(fin(T, w('last')), mono('from episode 1', {x: 1100, y: 300, size: 26, color: C.teal, ls: 4})) +
      (fin(T, w('thirty-five')) > 0 ? slideUp(fin(T, w('thirty-five')), tape('QUIT AT 35', {x: 1100, y: 420, size: 100, rot: -3, seed: 71})) : '')},
    // 2. "In 1889 he was fifty-three. Still not quitting."
    {a: c.y1889, b: c.essay, draw: (T) => push(T, c.y1889, c.essay) +
      deskCut('desk/carnegie_1885_bust.png', {x: 160, y: 220, w: 760, rot: -2, o: 1, T}) + `</div>` +
      tape('QUIT AT 35', {x: 1100, y: 420, size: 100, rot: -3, seed: 71}) +
      svg(drawLine([[1080, 520], [1720, 470]], clamp01((T - w('not', 2)) / 0.5), {w: 10})) +
      stamp('1889', fin(T, w('1889'))) +
      op(fin(T, w('fifty-three')), pen('age 53', {x: 1180, y: 240, size: 70, rot: -4, color: C.orange})) +
      op(fin(T, w('quitting')), pen('still not quitting', {x: 1160, y: 640, size: 60, rot: -4, color: C.orange}))},
    // 3. "But he did write an essay. It was called 'Wealth,' and people nicknamed it the Gospel of Wealth."
    {a: c.essay, b: c.rules, draw: (T) => { const o = fin(T, w('essay'), 0.5);
      return desk() + op(o, `<div style="position:absolute;left:200px;top:${150 + (1 - ease(o)) * 60}px;width:640px;height:820px;transform:rotate(-2deg);background:#E9E1CE;box-shadow:0 6px 4px rgba(0,0,0,.6),0 24px 40px rgba(0,0,0,.55);padding:50px 56px;color:#1d1a16">
          <div style="font-family:Mono;font-size:18px;letter-spacing:3px;text-align:center">THE NORTH AMERICAN REVIEW &middot; JUNE 1889</div><div style="height:2px;background:#1d1a16;margin:16px 0 30px"></div>
          <div style="font-family:Playfair;font-weight:900;font-size:110px;text-align:center;line-height:1">WEALTH.</div>
          <div style="font-family:Mono;font-size:20px;letter-spacing:3px;text-align:center;margin:20px 0 34px">BY ANDREW CARNEGIE</div>
          ${Array.from({length: 13}, (_, i) => `<div style="height:9px;background:rgba(29,26,22,.25);margin:16px ${i % 4 === 3 ? 120 : 0}px 0 0"></div>`).join('')}</div>`) +
        op(o * 0.85, mono('the first page, redrawn', {x: 220, y: 1000, size: 18, color: '#9a958c'})) +
        vocabCard('the Gospel of Wealth', 'GOS-pul uv WELTH', 'noun', "The nickname for Carnegie's 1889 essay: the rich should give their fortunes away while they are alive.", {x: 1000, y: 260, w: 820, size: 62, o: fin(T, w('Gospel'), 0.4)});
    }},
    // 4. "Carnegie said a rich man shouldn't leave his fortune to his kids, and shouldn't waste it on parties. He should give it away,
    //    while he's alive, to things that help people help themselves."
    {a: c.rules, b: c.libs, draw: (T) => desk() + op(fin(T, c.rules + 0.1) * 0.9, mono("carnegie's rules for the rich", {x: 240, y: 170, size: 30, color: C.teal, ls: 5})) +
      rules.map(([txt, wd, yes], i) => { const t0 = w(wd, 1), y = 260 + i * 150;
        return op(fin(T, t0, 0.3), `<div style="position:absolute;left:340px;top:${y}px;font-family:Inter;font-weight:800;font-size:58px;color:${C.cream}">${txt}</div>`) +
          (yes ? tick(240, y + 50, clamp01((T - t0 - 0.2) / 0.4)) : cross(240, y + 10, clamp01((T - t0 - 0.2) / 0.4))); }).join('') +
      op(fin(T, w('parties')) * 0.9, mono('(like a certain ball)', {x: 1260, y: 445, size: 24, color: C.orange}))},
    // 5. "Like libraries. And then the line that made him famous: 'The man who dies thus rich dies disgraced.'"
    {a: c.libs, b: c.built, draw: (T) => push(T, c.libs, c.built) + deskProp('p07_library_book', {x: 1300, y: 420, w: 480, rot: 6, o: fin(T, c.libs + 0.1, 0.5), T}) + `</div>` +
      (fin(T, w('libraries', 1)) > 0 ? slideUp(fin(T, w('libraries', 1)) * fout(T, w('famous'), 0.3), tape('LIKE LIBRARIES', {x: 200, y: 400, size: 100, rot: -3, seed: 75})) : '') +
      quote('&ldquo;The man who dies thus rich dies disgraced.&rdquo;', 'andrew carnegie, &ldquo;wealth,&rdquo; 1889', {x: 180, y: 330, w: 1100, size: 92, o: fin(T, w('The', 4) - 0.2, 0.4)})},
    // 6. "He meant it. He paid to build about seventeen hundred libraries in the United States, and about twenty-five hundred around
    //    the world. Many are still open. Check the cornerstone on yours." (lookdev carnegie_library)
    {a: c.built, b: c.phil, draw: (T) => renderLibrary(lib(T)) +
      op(fin(T, w('seventeen')), `<div style="position:absolute;left:120px;top:60px;font-family:Abril;font-size:110px;color:${C.cream};text-shadow:0 6px 18px rgba(0,0,0,.7)">about 1,700</div>`) +
      op(fin(T, w('seventeen')), mono('libraries in the united states', {x: 130, y: 190, size: 28, color: C.teal})) +
      op(fin(T, w('twenty-five')), mono('about 2,500 around the world', {x: 130, y: 236, size: 28, color: C.teal})) +
      op(fin(T, w('cornerstone')), pen('check the cornerstone on yours', {x: 120, y: 860, size: 54, rot: -3, color: C.orange}))},
    // 7. "That's called philanthropy." The Braddock library, 1893.
    {a: c.phil, b: c.trust, draw: (T) => push(T, c.phil, c.trust) + deskCut('desk/braddock_library_1893.png', {x: 120, y: 160, w: 1000, rot: -1.5, o: fin(T, c.phil + 0.1, 0.5), T}) + `</div>` +
      op(fin(T, c.phil + 0.4) * 0.9, mono('carnegie free library, braddock, pennsylvania (1893)', {x: 140, y: 980, size: 20})) +
      vocabCard('philanthropy', 'fih-LAN-thruh-pee', 'noun', 'Giving money to causes that help the public, like libraries, schools and hospitals.', {x: 1180, y: 200, o: fin(T, w('philanthropy'), 0.4)})},
    // 8. "But Carnegie also said the rich should act as trustees for the poor ... 'better than they would or could do for themselves.'"
    {a: c.trust, b: c.mill, draw: (T) => push(T, c.trust, c.mill) + deskCut('desk/carnegie_1885_bust.png', {x: 120, y: 360, w: 600, rot: -2, o: fin(T, c.trust + 0.1, 0.5), T}) + `</div>` +
      vocabCard('trustee', 'trus-TEE', 'noun', 'Someone trusted to manage money or property for other people.', {x: 1180, y: 110, o: fin(T, w('trustees'), 0.4)}) +
      op(fin(T, w('deciding')), pen("deciding what's good for them", {x: 160, y: 140, size: 52, rot: -3, color: C.orange})) +
      quote('&ldquo;better than they would or could do for themselves&rdquo;', 'carnegie, on the poor, 1889', {x: 760, y: 600, w: 1080, size: 58, o: fin(T, w('better') - 0.2, 0.4)})},
    // 9. "And at the same time, the men in his steel mills worked twelve-hour days, for low pay. Some of them asked: why not pay us more,
    //    and let us buy our own books?"
    {a: c.mill, b: c.hold, draw: (T) => push(T, c.mill, c.hold) + deskCut(EP1 + 'desk/edgar_thomson_works_1886.png', {x: 160, y: 140, w: 1200, rot: -1.5, o: fin(T, c.mill + 0.1, 0.5), T}) + `</div>` +
      op(fin(T, c.mill + 0.4) * 0.9, mono("carnegie's edgar thomson steel works, 1886", {x: 180, y: 900, size: 20})) +
      op(fin(T, w('twelve-hour')), pen('12-hour days', {x: 1300, y: 200, size: 66, rot: -4, color: C.orange})) +
      op(fin(T, w('low')), pen('low pay', {x: 1380, y: 320, size: 66, rot: -4, color: C.orange})) +
      (fin(T, w('why')) > 0 ? slideUp(fin(T, w('why')), tape('WHY NOT PAY US MORE...', {x: 200, y: 760, size: 70, rot: -2, seed: 77})) : '') +
      (fin(T, w('let')) > 0 ? slideUp(fin(T, w('let')), tape('...AND LET US BUY OUR OWN BOOKS?', {x: 420, y: 880, size: 62, rot: -1, seed: 79})) : '')},
    // 10. "Hold on to that question. It's about to get very loud." The mill again, dimmed.
    {a: c.hold, b: dur, draw: (T) => push(T, c.hold, dur, 0.12) + deskCut(EP1 + 'desk/edgar_thomson_works_1886.png', {x: 160, y: 140, w: 1200, rot: -1.5, o: 1, T}) + `</div>` + dimBy(0.5 * fin(T, c.hold, 0.8)) +
      (fin(T, w('Hold')) > 0 ? slideUp(fin(T, w('Hold')), tape('HOLD ON TO THAT QUESTION.', {x: 260, y: 420, size: 90, rot: -2, seed: 81})) : '') +
      op(fin(T, w('loud')), pen("it's about to get very loud.", {x: 700, y: 620, size: 64, rot: -3, color: C.orange}))},
  ];
  return {dur, shots, fadeOut: 0.6};
};
