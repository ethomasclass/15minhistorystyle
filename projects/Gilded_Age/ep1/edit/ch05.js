// Chapter 5, "The Weaver's Son" (4:02 to 6:03): Carnegie, from a weaver's cottage to vertical integration, and the note he ignored.
EDITS.ch05 = () => {
  const ch = 'ch05_the_weavers_son', w = (word, n) => wordAt(ch, word, n), dur = window.WORDS[ch].duration;
  const c = {
    factory: w('When') - 0.3, worry: w('machine', 1) - 0.3, sail: w('family') - 0.3, mill: w('At', 2) - 0.25, tele: w('Then', 1) - 0.3,
    shares: w('That', 1) - 0.25, check: w('Then', 2) - 0.3, steel: w('Railroads', 1) - 0.3, vi: w('Then', 4) - 0.3, note: w('But') - 0.3,
    quit: w('did') - 0.4,
  };
  const backdrop = (T, a, b, z = 0.035) => `<div style="position:absolute;inset:0;transform:scale(${(1 + z * ease((T - a) / (b - a))).toFixed(4)})">${desk()}`;
  const loomF = remap([[c.factory, 5.0], [w('steampowered'), 6.6], [w('machines', 1), 8.6], [c.worry, 11.0]]);
  const loomB = remap([[c.worry, 12.2], [c.sail, 17.0]]);
  const viT = remap([[c.vi, 0], [w('mines'), 1.0], [w('coal'), 3.4], [w('ore'), 5.8], [w('railroads', 2), 8.2], [w("That's"), 10.6],
    [w('vertical') + 0.6, 13.0], [w('Stack'), 18.2], [w('column'), 21.6], [w('Like'), 22.6], [c.note, 27.5]]);
  const ship = (x, y, s = 1) => `<g transform="translate(${f1(x)},${f1(y)}) scale(${s})" fill="${C.cream}">
    <path d="M-60,0 L60,0 L44,18 L-48,18 Z"/><rect x="-26" y="-74" width="4" height="74"/><rect x="2" y="-88" width="4" height="88"/><rect x="28" y="-64" width="4" height="64"/>
    <path d="M-46,-8 Q-34,-40 -28,-70 L-28,-8 Z" opacity=".9"/><path d="M-20,-10 Q-4,-48 0,-84 L0,-10 Z"/><path d="M8,-10 Q22,-40 26,-60 L26,-10 Z" opacity=".9"/></g>`;
  const shots = [
    // 1. The cottage in Dunfermline: William at his hand loom (the weaver's-son set, lookdev/loom.js).
    {a: 0, b: c.factory, draw: (T) => renderLoom(0.3 + T * 0.45)},
    // 2. "a steam-powered weaving factory opened in town. Its machines never got tired"
    {a: c.factory, b: c.worry, draw: (T) => renderLoom(loomF(T))},
    // 3. Back to the cottage, the loom stopped: "A machine taking someone's job isn't a new worry. Ask a weaver in 1847."
    {a: c.worry, b: c.sail, draw: (T) => renderLoom(loomB(T)) +
      op(fin(T, w('Ask')), pen('ask a weaver in 1847', {x: 1100, y: 260, size: 52, rot: -4, color: C.orange}))},
    // 4. "The family borrowed twenty pounds and sailed for America." Glasgow to New York, 1848.
    {a: c.sail, b: c.mill, draw: (T) => {
      const k = ease(clamp01((T - w('sailed') + 0.3) / (c.mill - w('sailed') + 0.1))), P = (u) => [360 + 1200 * u, 560 - 260 * Math.sin(Math.PI * u)];
      const dots = []; for (let u = 0; u <= k; u += 0.02) { const [x, y] = P(u); dots.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="5" fill="${C.teal}"/>`); }
      const [sx, sy] = P(k);
      return desk() + svg(dots.join('') + `<circle cx="360" cy="560" r="12" fill="${C.cream}"/><circle cx="1560" cy="560" r="12" fill="${C.cream}"/>` + ship(sx, sy - 14, 0.9)) +
        mono('glasgow, scotland', {x: 240, y: 600, size: 26}) + mono('new york', {x: 1490, y: 600, size: 26}) + stamp('1848', fin(T, c.sail + 0.2)) +
        op(fin(T, w('twenty', 1)), pen('£20, borrowed', {x: 760, y: 700, size: 58, rot: -4, color: C.orange}));
    }},
    // 5. The bobbin boy: "changing spools of thread in a cotton mill near Pittsburgh. Twelve hours a day, for one dollar and twenty cents. A week."
    {a: c.mill, b: c.tele, draw: (T) => backdrop(T, c.mill, c.tele) +
      deskCut('desk/cotton_mill_1835.png', {x: 90, y: 110, w: 1180, rot: -1, o: fin(T, c.mill, 0.5), T}) +
      deskProp('p05_bobbin', {x: 1300, y: 260, w: 520, rot: 8, o: fin(T, w('spools'), 0.5), T}) + `</div>` +
      op(fin(T, c.mill + 0.3) * 0.9, mono('a cotton mill (english engraving, 1835)', {x: 100, y: 800, size: 20})) +
      op(fin(T, w('At', 2)), pen('andrew, 12', {x: 1360, y: 140, size: 56, rot: -4, color: C.orange})) +
      op(fin(T, w('Twelve')), pen('12 hours a day', {x: 1300, y: 760, size: 52, rot: -3, color: C.orange})) +
      op(fin(T, w('dollar')), pen('$1.20...', {x: 1320, y: 860, size: 56, rot: -3, color: C.orange})) +
      op(fin(T, w('week')), pen('a WEEK', {x: 1580, y: 870, size: 64, rot: -6, color: C.orange}))},
    // 6. Telegrams, the telegraph's clicks by ear, and the railroad boss (Thomas A. Scott).
    {a: c.tele, b: c.shares, draw: (T) => {
      const code = '•–•–  ••  –  –  •••  –•••  ••–  •–•  ––•  ••••', n = Math.floor(code.length * clamp01((T - w('clicks')) / 1.2));
      const scott = fin(T, w('hired'), 0.6);
      return backdrop(T, c.tele, c.shares) +
        deskProp('p05_telegraph_key', {x: 160, y: 300, w: 760 - 200 * scott, rot: -2, o: fin(T, c.tele + 0.1, 0.5), T}) +
        deskCut('desk/scott_bust.png', {x: 1150, y: 170, w: 560, rot: 2, o: scott, T, caption: 'thomas a. scott, pennsylvania railroad', cx: 40}) + `</div>` +
        op(fin(T, w('telegrams')), pen('messenger boy', {x: 230, y: 180, size: 50, rot: -4, color: C.orange})) +
        (n > 0 ? mono(code.slice(0, n), {x: 200, y: 860, size: 44, color: C.teal, ls: 4}) : '') +
        op(fin(T, w('ear')), pen('...learned to read it by ear', {x: 360, y: 930, size: 44, rot: -2, color: C.orange})) +
        op(scott, pen('the railroad boss', {x: 1220, y: 900, size: 50, rot: -3, color: C.orange}));
    }},
    // 7. "a few shares of a company, for about 500 dollars ... So his mother mortgaged the family's house."
    {a: c.shares, b: c.check, draw: (T) => {
      const mom = fin(T, w('mother'), 0.6);
      return backdrop(T, c.shares, c.check) +
        deskCut('desk/carnegie_mother_bust.png', {x: 180, y: 250, w: 600, rot: -2, o: mom, T, caption: 'margaret carnegie, andrew&rsquo;s mother', cx: 40}) +
        deskProp('p05_mortgage_deed', {x: 1040, y: 160, w: 640, rot: 4, o: fin(T, w('mortgaged'), 0.5), T}) + `</div>` +
        op(fin(T, w('shares')) * (1 - mom), `<div style="position:absolute;left:0;top:330px;width:1920px;text-align:center;font-family:Abril;font-size:200px;color:${C.cream}">$500</div>`) +
        op(fin(T, w('500', 2)) * (1 - mom), pen("andrew didn't have it", {x: 1180, y: 720, size: 52, rot: -4, color: C.orange})) +
        op(fin(T, w('mortgaged')), pen('the family&rsquo;s house, on the line', {x: 1000, y: 880, size: 48, rot: -3, color: C.orange})) +
        op(fin(T, w('lose')), pen('if it went wrong...', {x: 220, y: 140, size: 48, rot: -4, color: C.orange}));
    }},
    // 8. "Then a check came in the mail. Ten dollars. Andrew hadn't worked for it. His money had."
    {a: c.check, b: c.steel, draw: (T) => backdrop(T, c.check, c.steel) +
      deskProp('p05_dividend_check', {x: 360, y: 300, w: 1200, rot: -3, o: fin(T, w('check'), 0.5), T}) + `</div>` +
      op(fin(T, w('Ten')), pen('$10', {x: 1180, y: 300, size: 110, rot: -8, color: C.orange})) +
      op(fin(T, w('money', 1)), pen('his money did the work', {x: 300, y: 160, size: 52, rot: -3, color: C.orange})) +
      (fin(T, w('goose')) > 0 ? slideUp(fin(T, w('goose')), tape('&ldquo;THE GOOSE THAT LAYS THE GOLDEN EGGS&rdquo;', {x: 150, y: 870, size: 54, rot: -2, seed: 51})) : '')},
    // 9. "Railroads, bridges, iron, then steel. He named his giant new steel mill after the president of the Pennsylvania Railroad... Subtle."
    {a: c.steel, b: c.vi, draw: (T) => {
      const words = [['RAILROADS', 'Railroads', 1], ['BRIDGES', 'bridges', 1], ['IRON', 'iron', 1], ['STEEL', 'steel', 1]];
      const mill = fin(T, w('named'), 0.6), pres = fin(T, w('president'), 0.6);
      return backdrop(T, c.steel, c.vi) +
        deskCut('desk/edgar_thomson_works_1886.png', {x: 120, y: 180, w: 1100, rot: -1.5, o: mill, T}) +
        deskCut('desk/j_edgar_thomson_bust.png', {x: 1250, y: 230, w: 560, rot: 2, o: pres, T, caption: 'j. edgar thomson, railroad president', cx: -20}) + `</div>` +
        words.map(([txt, wd, n], i) => op(fin(T, w(wd, n), 0.3) * (1 - mill), tape(txt, {x: 150 + i * 420, y: 440 + (i % 2) * 60, size: 70, rot: -3 + i * 1.5, seed: 60 + i}))).join('') +
        op(mill, mono('the edgar thomson steel works, 1886', {x: 130, y: 870, size: 20})) +
        op(fin(T, w('customer', 1)), pen('his biggest customer', {x: 1240, y: 900, size: 46, rot: -3, color: C.orange})) +
        op(fin(T, w('Subtle')), pen('subtle.', {x: 700, y: 940, size: 70, rot: -6, color: C.orange}));
    }},
    // 10. Vertical integration: the explainer (lookdev/explainers.js) re-timed to the words, then the pizza place.
    {a: c.vi, b: c.note, draw: (T) => renderVI(viT(T)) +
      op(fin(T, w('vertical'), 0.4) * fout(T, w('column') - 0.3, 0.5), tape('VERTICAL INTEGRATION', {x: 80, y: 70, size: 74, rot: -2, seed: 4})) +
      op(fin(T, w('pizza')), pen('like a pizza place that owns the farm,<br>the cheese factory and the delivery cars', {x: 90, y: 900, size: 34, rot: -1.5, color: C.orange, w: 820}))},
    // 11. "At 33, Carnegie wrote himself a private note ... 'one of the worst species of idolatry.' ... He'd quit at 35."
    {a: c.note, b: c.quit, draw: (T) => backdrop(T, c.note, c.quit) +
      deskCut('desk/carnegie_c1878_bust.png', {x: 120, y: 300, w: 620, rot: -2, o: fin(T, w('Carnegie', 2), 0.6), T, caption: 'andrew carnegie, about 1878', cx: 60}) +
      deskProp('p05_note_1868', {x: 860, y: 160, w: 900, rot: 2.5, o: fin(T, w('note'), 0.6), T}) + `</div>` +
      op(fin(T, w('note')) * 0.9, mono('a re-creation, not the original note', {x: 1140, y: 830, size: 18, color: '#9a958c'})) +
      op(fin(T, w('At', 5)), pen('age 33, december 1868', {x: 160, y: 110, size: 46, rot: -4, color: C.orange})) +
      op(fin(T, w('worst')), pen('&ldquo;one of the worst species<br>of idolatry&rdquo;', {x: 920, y: 870, size: 46, rot: -3, color: C.orange, w: 820})) +
      op(fin(T, w('Translation')), mono('idolatry: worshipping something', {x: 940, y: 1010, size: 22, color: C.teal})) +
      (fin(T, w("He'd")) > 0 ? slideUp(fin(T, w("He'd")), tape('QUIT AT 35', {x: 160, y: 860, size: 80, rot: -3, seed: 71})) : '')},
    // 12. "He did not quit at 35." The plan, struck through, over the steel works.
    {a: c.quit, b: dur, draw: (T) => backdrop(T, c.quit, dur, 0.06) +
      deskCut('desk/edgar_thomson_works_1886.png', {x: 260, y: 140, w: 1400, rot: -1, o: 1, T}) + `</div>` +
      tape('QUIT AT 35', {x: 620, y: 420, size: 110, rot: -3, seed: 71}) +
      svg(drawLine([[600, 520], [1360, 470]], clamp01((T - w('not')) / 0.5), {w: 10})) +
      op(fin(T, w('not') + 0.3), pen('he did not.', {x: 1100, y: 640, size: 72, rot: -5, color: C.orange}))},
  ];
  return {dur, shots, fadeOut: 0.6};
};
