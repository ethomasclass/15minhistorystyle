// Chapter 8, "Leave It Alone" (9:44 to 10:41): laissez-faire, what it meant for workers, where the government did step in, two readings.
EDITS.ch08 = () => {
  const ch = 'ch08_leave_it_alone', w = (word, n) => wordAt(ch, word, n), dur = window.WORDS[ch].duration;
  const c = {
    idea: w('The', 2) - 0.3, none: w('So', 2) - 0.3, hands: w('But') - 0.3, two: w('So', 3) - 0.3, capt: w('To', 3) - 0.3,
    barons: w('To', 4) - 0.3, both: w('Both') - 0.3,
  };
  const backdrop = (T, a, b, z = 0.035) => `<div style="position:absolute;inset:0;transform:scale(${(1 + z * ease((T - a) / (b - a))).toFixed(4)})">${desk()}`;
  const shots = [
    // 1. "So where was the government? Mostly... standing back." The government as a top hat (not a real person), stepping back.
    {a: 0, b: c.idea, draw: (T) => {
      const back = ease(clamp01((T - w('standing')) / 1.0));
      return desk() + `<div style="position:absolute;inset:0;transform:translate(0,${(-160 * back).toFixed(1)}px) scale(${(1 - 0.45 * back).toFixed(3)});transform-origin:960px 300px">
          ${deskProp('p08_top_hat', {x: 720, y: 280, w: 480, rot: -3, o: fin(T, 0.2, 0.5), T})}</div>` +
        op(fin(T, w('government')), mono('&ldquo;the government&rdquo;', {x: 820, y: 860, size: 30, color: C.teal, ls: 5})) +
        op(fin(T, w('standing')), pen('...standing back', {x: 1180, y: 560, size: 60, rot: -5, color: C.orange}));
    }},
    // 2. Laissez-faire: "French for 'let them do it.' ... let the free market decide prices, wages, and who wins."
    {a: c.idea, b: c.none, draw: (T) => desk() +
      vocabCard('LAISSEZ-FAIRE', 'less-ay FAIR', 'French', '&ldquo;let them do it&rdquo;: leave business alone and let the free market decide', {x: 160, y: 150, w: 900, size: 80, o: fin(T, w('laissezfaire'), 0.5)}) +
      [['PRICES', 'prices'], ['WAGES', 'wages'], ['WHO WINS', 'wins']].map(([t, wd], i) =>
        fin(T, w(wd)) > 0 ? slideUp(fin(T, w(wd)), tape(t, {x: 1200 + (i % 2) * 60, y: 300 + i * 190, size: 80, rot: -3 + i, seed: 101 + i})) : '').join('') +
      op(fin(T, w('decide')), mono('the free market decides:', {x: 1200, y: 230, size: 26, color: C.teal}))},
    // 3. "No minimum wage. No limit on hours. No safety rules. No two-day weekend, either. People had to fight for that one."
    {a: c.none, b: c.hands, draw: (T) => {
      const items = [['a minimum wage', w('minimum')], ['a limit on hours', w('limit')], ['safety rules', w('safety')], ['a two-day weekend', w('twoday')]];
      return desk() + `<div style="position:absolute;left:460px;top:120px;width:1000px;background:${C.cream};transform:rotate(-1.5deg);padding:46px 60px;box-shadow:0 20px 36px rgba(0,0,0,.6);
          background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 62px,rgba(17,17,17,.12) 62px,rgba(17,17,17,.12) 64px);background-position:0 110px">
          <div style="font-family:Abril;font-size:56px;color:${C.ink}">Workers in the 1880s had...</div>
          ${items.map(([t, at]) => `<div style="position:relative;font-family:Inter;font-weight:600;font-size:46px;line-height:1.38;color:${C.ink};opacity:${fin(T, at - 0.3).toFixed(2)}">
            <span style="display:inline-block;width:60px;color:#B5463D;font-family:Abril">${T > at ? '&#10007;' : ''}</span>${t}
            <div style="position:absolute;left:60px;top:50%;height:5px;background:#B5463D;width:${(560 * ease(clamp01((T - at) / 0.4))).toFixed(0)}px"></div></div>`).join('')}</div>` +
        op(fin(T, w('fight')), pen('people had to fight for that one', {x: 520, y: 880, size: 52, rot: -3, color: C.orange}));
    }},
    // 4. "But it wasn't totally hands-off": railroads got more land than all of California; tariffs protected American factories.
    {a: c.hands, b: c.two, draw: (T) => {
      const tariff = fin(T, w('taxed'), 0.6);
      return backdrop(T, c.hands, c.two) +
        op(1 - tariff, deskCut('desk/land_grants_1878.png', {x: 160, y: 90, w: 1600, rot: -1, o: fin(T, c.hands + 0.1, 0.6), T}) +
          op(fin(T, w('land'), 0.8), deskCut('desk/land_grants_1878_grants.png', {x: 160, y: 90, w: 1600, rot: -1, o: 1, T}))) +
        deskCut('desk/protectors_1883.png', {x: 360, y: 90, w: 1200, rot: 1.5, o: tariff, T}) + `</div>` +
        op(fin(T, w('handsoff')) * (1 - tariff), pen('not totally hands-off', {x: 1250, y: 60, size: 50, rot: -4, color: C.orange})) +
        (fin(T, w('land')) * (1 - tariff) > 0 ? op(1 - tariff, slideUp(fin(T, w('California')), tape('MORE LAND THAN ALL OF CALIFORNIA', {x: 140, y: 900, size: 58, rot: -2, seed: 105}))) +
          op(fin(T, w('land')) * (1 - tariff), mono('land granted to railroads, map of 1878', {x: 1180, y: 1030, size: 20})) : '') +
        op(tariff, mono('&ldquo;the protectors of our industries,&rdquo; puck, 1883', {x: 370, y: 1010, size: 20})) +
        op(fin(T, w('protect')), pen('tariff: a tax on foreign goods', {x: 1000, y: 940, size: 44, rot: -3, color: C.orange}));
    }},
    // 5. "So were these entrepreneurs ... heroes or villains?"
    {a: c.two, b: c.capt, draw: (T) => desk() +
      vocabCard('ENTREPRENEUR', 'on-truh-pruh-NUR', 'noun', 'someone who builds a business and risks it failing', {x: 200, y: 160, w: 900, size: 72, o: fin(T, w('entrepreneurs'), 0.5)}) +
      (fin(T, w('heroes')) > 0 ? slideUp(fin(T, w('heroes')), tape('HEROES?', {x: 400, y: 640, size: 110, rot: -4, seed: 107})) : '') +
      (fin(T, w('villains')) > 0 ? slideUp(fin(T, w('villains')), tape('VILLAINS?', {x: 1060, y: 680, size: 110, rot: 3, seed: 108})) : '')},
    // 6. Captains of industry: steel got cheap, lamp oil got cheap, millions got jobs. ("The Progress of the Century", 1876.)
    {a: c.capt, b: c.barons, draw: (T) => backdrop(T, c.capt, c.barons) +
      deskCut('desk/progress_century_1876.png', {x: 120, y: 200, w: 1000, rot: -2, o: fin(T, c.capt + 0.1, 0.6), T}) +
      deskProp('p03_steel_rail', {x: 1220, y: 160, w: 520, rot: -3, o: fin(T, w('steel'), 0.5), T}) +
      deskProp('p07_kerosene_lamp', {x: 1560, y: 430, w: 190, rot: 2, o: fin(T, w('lamp'), 0.5), T}) + `</div>` +
      slideUp(fin(T, w('captains')), tape('CAPTAINS OF INDUSTRY', {x: 120, y: 60, size: 70, rot: -2, seed: 109})) +
      op(fin(T, c.capt + 0.4) * 0.9, mono('&ldquo;the progress of the century,&rdquo; currier &amp; ives, 1876', {x: 130, y: 920, size: 20})) +
      op(fin(T, w('millions')), pen('millions got jobs', {x: 1160, y: 950, size: 56, rot: -4, color: C.orange}))},
    // 7. Robber barons: "crushed rivals with secret deals and got rich off men like Michael." (Puck, 1889.)
    {a: c.barons, b: c.both, draw: (T) => backdrop(T, c.barons, c.both) +
      deskCut('desk/robber_barons_1889.png', {x: 300, y: 170, w: 1320, rot: 1.5, o: fin(T, c.barons + 0.1, 0.6), T}) + `</div>` +
      slideUp(fin(T, w('robber')), tape('ROBBER BARONS', {x: 120, y: 60, size: 80, rot: -2, seed: 111})) +
      op(fin(T, c.barons + 0.4) * 0.9, mono('&ldquo;the robber barons of the middle ages and the robber barons of to-day,&rdquo; puck, 1889', {x: 310, y: 1010, size: 18})) +
      op(fin(T, w('crushed')), pen('secret deals', {x: 1430, y: 110, size: 50, rot: -4, color: C.orange})) +
      op(fin(T, w('Michael')), pen('...off men like michael', {x: 1180, y: 900, size: 50, rot: -3, color: C.orange}))},
    // 8. "Both sides were looking at the same facts."
    {a: c.both, b: dur, draw: (T) => desk() +
      deskCut('desk/progress_century_1876.png', {x: 80, y: 220, w: 860, rot: -2, o: 1, T}) +
      deskCut('desk/robber_barons_1889.png', {x: 990, y: 230, w: 860, rot: 2, o: 1, T}) +
      mono('captains of industry', {x: 300, y: 880, size: 26, color: C.teal}) + mono('robber barons', {x: 1300, y: 880, size: 26, color: C.teal}) +
      op(fin(T, w('same')), tape('THE SAME FACTS', {x: 640, y: 70, size: 90, rot: -2, seed: 113}))},
  ];
  return {dur, shots, fadeOut: 0.6};
};
