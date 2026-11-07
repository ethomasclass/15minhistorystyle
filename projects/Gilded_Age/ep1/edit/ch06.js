// Chapter 6, "The Con Man's Son" (6:03 to 8:41): Rockefeller, the rebate, the squeeze, the buyouts, monopoly and the trust.
EDITS.ch06 = () => {
  const ch = 'ch06_the_con_mans_son', w = (word, n) => wordAt(ch, word, n), dur = window.WORDS[ch].duration;
  const c = {
    father: w('His', 1) - 0.25, vanish: w('He', 2) - 0.25, mother: w('So', 1) - 0.25, turkey: w('As') - 0.25, book: w('At', 2) - 0.25,
    oil: w('Then', 1) - 0.3, drops: w('He', 5) - 0.3, rivals: w('Then', 2) - 0.3, squeeze: w('Cheaper') - 0.3, cleve: w('In', 3) - 0.3,
    mono: w('By', 2) - 0.3, trust: w('To', 7) - 0.3,
  };
  const backdrop = (T, a, b, z = 0.035) => `<div style="position:absolute;inset:0;transform:scale(${(1 + z * ease((T - a) / (b - a))).toFixed(4)})">${desk()}`;
  // The horizontal-integration explainer (lookdev/explainers.js, 31 s), in two parts around the squeeze.
  const hiA = remap([[c.rivals, 0], [w('secret'), 3.6], [w('shipped'), 5.4], [w('secretly'), 6.2], [w('back'), 7.6], [w("else's"), 8.8], [c.squeeze, 9.2]]);
  const hiC = remap([[c.cleve, 10.6], [w('Cleveland'), 11.8], [w('bought'), 12.4], [w('22') + 1.2, 19.0], [w("That's", 1), 19.4], [w('buying'), 21.6], [c.mono, 23.9]]);

  /** The squeeze: shipping cost, price and loss per barrel for Standard Oil and a rival (illustrative, not real figures). */
  function squeeze(T) {
    const X0 = 360, Y0 = 820, H = 520, bw = 300, col = (i) => X0 + i * 620;
    const costS = 0.36, costR = 0.56;                              // cost per barrel: the rebate makes Standard's lower
    const p0 = 0.78, pS = p0 - (p0 - 0.44) * ease(clamp01((T - w('sell', 1) + 0.2) / 1.0));   // Standard cuts its price
    const pR = p0 - (p0 - 0.44) * ease(clamp01((T - w('cut') + 0.2) / 1.0));                  // the rival has to match
    const loss = fin(T, w('losing'), 0.6), y = (v) => Y0 - v * H;
    const bars = [[col(0), costS, pS, 'STANDARD OIL'], [col(1), costR, pR, 'A RIVAL']].map(([x, cost, p, name], i) => {
      const under = i === 1 && p < cost;
      return `<rect x="${x}" y="${f1(y(cost))}" width="${bw}" height="${f1(cost * H)}" fill="${C.teal}" opacity=".85"/>
        <rect x="${x}" y="${f1(y(cost))}" width="${bw}" height="${f1(cost * H)}" fill="none" stroke="${C.ink}" stroke-width="4"/>
        ${under ? `<rect x="${x}" y="${f1(y(cost))}" width="${bw}" height="${f1((cost - p) * H)}" fill="#B5463D" opacity="${(0.85 * loss).toFixed(3)}"/>` : ''}
        <line x1="${x - 40}" y1="${f1(y(p))}" x2="${x + bw + 40}" y2="${f1(y(p))}" stroke="${C.ink}" stroke-width="12"/>
        <line x1="${x - 40}" y1="${f1(y(p))}" x2="${x + bw + 40}" y2="${f1(y(p))}" stroke="${C.orange}" stroke-width="7"/>`;
    }).join('');
    return desk() + svg(`<line x1="${X0 - 80}" y1="${Y0}" x2="${col(1) + bw + 80}" y2="${Y0}" stroke="${C.cream}" stroke-width="3" opacity=".6"/>` + bars) +
      mono('standard oil', {x: col(0) + 20, y: Y0 + 22, size: 26}) + mono('a rival refinery', {x: col(1), y: Y0 + 22, size: 26}) +
      mono('per barrel &middot; illustration', {x: 120, y: 120, size: 22, color: '#9a958c'}) +
      `<div style="position:absolute;left:120px;top:160px;display:flex;gap:34px;font-family:Mono;font-size:24px;letter-spacing:3px;color:${C.cream}">
        <span><span style="display:inline-block;width:26px;height:16px;background:${C.teal};margin-right:10px"></span>COST TO MAKE AND SHIP</span>
        <span><span style="display:inline-block;width:26px;height:6px;background:${C.orange};margin-right:10px;vertical-align:middle"></span>SELLING PRICE</span></div>` +
      op(fin(T, w('Cheaper')), pen('the rebate: cheaper shipping', {x: col(0) - 60, y: Y0 + 70, size: 40, rot: -3, color: C.orange})) +
      op(fin(T, w('sell', 1)), pen('he cuts his price', {x: col(0) - 20, y: y(0.44) - 110, size: 44, rot: -4, color: C.orange})) +
      op(fin(T, w('cut')), pen('they have to match it', {x: col(1) - 20, y: y(0.78) - 70, size: 44, rot: -4, color: C.orange})) +
      op(loss, pen('losing money<br>on every barrel', {x: col(1) + bw + 60, y: y(0.56) - 10, size: 44, rot: -4, color: C.orange, w: 360}));
  }
  /** "Lower costs. Lower prices. Rivals bleeding money." then the offer: sell now, or go broke. */
  function offer(T) {
    const t1 = fin(T, w('Lower', 1)), t2 = fin(T, w('Lower', 2)), t3 = fin(T, w('Rivals')), card = fin(T, w('sell', 2), 0.5), broke = fin(T, w('keep'), 0.5);
    const gone = fin(T, w('That', 3), 0.4);
    return desk() + op(1 - gone, slideUp(t1, tape('LOWER COSTS.', {x: 300, y: 260, size: 90, rot: -3, seed: 81})) +
        slideUp(t2, tape('LOWER PRICES.', {x: 520, y: 440, size: 90, rot: -2, seed: 82})) +
        slideUp(t3, tape('RIVALS BLEEDING MONEY.', {x: 380, y: 620, size: 90, rot: -2.5, seed: 83}))) +
      op(fin(T, w('offer'), 0.4), mono('the offer', {x: 160, y: 200, size: 30, color: C.teal, ls: 6})) +
      slideUp(card, `<div style="position:absolute;left:150px;top:300px;width:720px;background:${C.cream};transform:rotate(-2deg);padding:40px 44px;box-shadow:0 20px 36px rgba(0,0,0,.6)">
        <div style="font-family:Abril;font-size:66px;line-height:1.05;color:${C.ink}">Sell to me now</div>
        <div style="font-family:Inter;font-weight:600;font-size:34px;line-height:1.35;color:${C.ink};margin-top:16px">while your business is still worth something</div></div>`) +
      slideUp(broke, `<div style="position:absolute;left:1030px;top:330px;width:720px;background:#2A2722;transform:rotate(2deg);padding:40px 44px;box-shadow:0 20px 36px rgba(0,0,0,.6);border:3px solid #B5463D">
        <div style="font-family:Abril;font-size:66px;line-height:1.05;color:${C.cream}">or keep going...</div>
        <div style="font-family:Inter;font-weight:600;font-size:40px;line-height:1.35;color:#E07A6E;margin-top:16px">and go broke</div></div>`) +
      op(fin(T, w('refuse')), pen("an offer they couldn't really refuse", {x: 520, y: 880, size: 50, rot: -2, color: C.orange}));
  }

  const shots = [
    // 1. "John D. Rockefeller grew up on farms in upstate New York."
    {a: 0, b: c.father, draw: (T) => backdrop(T, 0, c.father) +
      deskCut('desk/rockefeller_birthplace.png', {x: 320, y: 170, w: 1280, rot: -1.2, o: fin(T, 0.1, 0.6), T}) + `</div>` +
      stamp('richford, new york &middot; birthplace', fin(T, w('farms')))},
    // 2. His father and the medicine: "could cure almost anything. Even cancer. It couldn't."
    {a: c.father, b: c.vanish, draw: (T) => backdrop(T, c.father, c.vanish) +
      deskCut('desk/rockefeller_father_bust.png', {x: 200, y: 200, w: 540, rot: -2, o: fin(T, c.father + 0.1, 0.6), T, caption: 'william avery rockefeller, his father', cx: 0}) +
      deskProp('p06_medicine_bottle', {x: 1080, y: 160, w: 300, rot: 4, o: fin(T, w('medicine'), 0.5), T}) + `</div>` +
      op(fin(T, w('almost')), pen('"cures almost anything"', {x: 1180, y: 830, size: 46, rot: -4, color: C.orange})) +
      op(fin(T, w('Even')), pen('even cancer!', {x: 1400, y: 300, size: 52, rot: -6, color: C.orange})) +
      op(fin(T, w("couldn't", 1)), tape("IT COULDN'T.", {x: 820, y: 640, size: 80, rot: -4, seed: 85}))},
    // 3. "He vanished for months ... a second wife under a fake name. Not exactly father of the year."
    {a: c.vanish, b: c.mother, draw: (T) => {
      const card = (x, y, rot, name, o) => op(o, `<div style="position:absolute;left:${x}px;top:${y}px;width:560px;transform:rotate(${rot}deg);background:${C.cream};padding:40px 30px;box-shadow:0 18px 30px rgba(0,0,0,.6);text-align:center">
        <div style="font-family:Playfair;font-weight:900;font-size:50px;color:${C.ink}">${name}</div><div style="font-family:Mono;font-size:18px;letter-spacing:4px;color:#555;margin-top:10px">CALLING CARD</div></div>`);
      return desk() + card(250, 330, -4, 'Wm. A. Rockefeller', fin(T, c.vanish + 0.1)) +
        svg(drawLine([[260, 420], [820, 400]], clamp01((T - w('fake')) / 0.4), {w: 9})) +
        card(1060, 300, 3, 'Dr. Wm. Levingston', fin(T, w('fake') + 0.3)) +
        op(fin(T, w('second')), pen('a second wife, a fake name', {x: 600, y: 720, size: 52, rot: -3, color: C.orange})) +
        op(fin(T, w('Not')), pen('not exactly father of the year', {x: 640, y: 850, size: 48, rot: -2, color: C.orange}));
    }},
    // 4. "So John's mother ran the farm, and counted every penny."
    {a: c.mother, b: c.turkey, draw: (T) => backdrop(T, c.mother, c.turkey) +
      deskCut('desk/rockefeller_mother_bust.png', {x: 300, y: 200, w: 520, rot: -2, o: fin(T, c.mother + 0.1, 0.6), T, caption: 'eliza davison rockefeller, his mother', cx: 0}) +
      deskProp('p06_coins_stack', {x: 1000, y: 460, w: 560, rot: -3, o: fin(T, w('counted'), 0.5), T}) + `</div>` +
      op(fin(T, w('counted')), pen('every penny', {x: 1120, y: 360, size: 54, rot: -4, color: C.orange}))},
    // 5. The turkey money: "lent 50 dollars ... got it back with interest ... money can make money."
    {a: c.turkey, b: c.book, draw: (T) => backdrop(T, c.turkey, c.book) +
      deskProp('p06_turkey', {x: 180, y: 260, w: 640, rot: 0, o: fin(T, w('turkey'), 0.5), T}) +
      deskProp('p06_coins_stack', {x: 1080, y: 420, w: 560, rot: 3, o: fin(T, w('lent'), 0.5), T}) + `</div>` +
      op(fin(T, w('50')), pen('$50, lent to a neighbor', {x: 1040, y: 280, size: 50, rot: -4, color: C.orange})) +
      op(fin(T, w('interest', 1)), pen('...back with interest', {x: 1080, y: 760, size: 50, rot: -3, color: C.orange})) +
      (fin(T, w('money', 2)) > 0 ? slideUp(fin(T, w('money', 2)), tape('MONEY CAN MAKE MONEY', {x: 300, y: 880, size: 66, rot: -2, seed: 87})) : '')},
    // 6. Bookkeeper at 16, the little red notebook; at 19, his own business, $1,000 at interest from his father.
    {a: c.book, b: c.oil, draw: (T) => backdrop(T, c.book, c.oil) +
      deskCut('desk/rockefeller_18_bust.png', {x: 120, y: 280, w: 620, rot: -2, o: fin(T, c.book + 0.1, 0.6), T, caption: 'rockefeller at 18', cx: 160}) +
      deskProp('p06_red_notebook', {x: 900, y: 200, w: 760, rot: 3, o: fin(T, w('notebook'), 0.5), T}) + `</div>` +
      op(fin(T, w('notebook')) * 0.85, mono('a notebook like his', {x: 1100, y: 740, size: 20, color: '#9a958c'})) +
      op(fin(T, w('bookkeeper')), pen('16: bookkeeper', {x: 900, y: 120, size: 50, rot: -4, color: C.orange})) +
      op(fin(T, w('1000')), pen('19: $1,000 from his father...', {x: 860, y: 820, size: 48, rot: -3, color: C.orange})) +
      (fin(T, w('charged')) > 0 ? slideUp(fin(T, w('charged')), tape('...AT INTEREST.', {x: 1100, y: 920, size: 64, rot: -3, seed: 89})) : '')},
    // 7. "Then came oil. Rockefeller refined it into kerosene: lamp oil"
    {a: c.oil, b: c.drops, draw: (T) => backdrop(T, c.oil, c.drops, 0.05) +
      deskCut('desk/oil_derricks_1866.png', {x: 120, y: 140, w: 1180, rot: -1.5, o: fin(T, c.oil + 0.1, 0.6), T}) +
      deskProp('p07_kerosene_lamp', {x: 1400, y: 160, w: 300, rot: 2, o: fin(T, w('kerosene'), 0.5), T}) + `</div>` +
      op(fin(T, c.oil + 0.4) * 0.9, mono('oil wells, pennsylvania, 1866', {x: 130, y: 900, size: 20})) +
      op(fin(T, w('lamp')), pen('kerosene: lamp oil', {x: 1080, y: 960, size: 50, rot: -4, color: C.orange}))},
    // 8. 39 drops of solder instead of 40.
    {a: c.drops, b: c.rivals, draw: (T) => {
      const n = T < w('39') ? 40 : 39, flip = fin(T, w('40'), 0.3);
      return backdrop(T, c.drops, c.rivals) + deskProp('p06_solder_lid', {x: 230, y: 250, w: 760, rot: -3, o: fin(T, c.drops + 0.1, 0.5), T}) + `</div>` +
        op(fin(T, w('obsessed')), pen('obsessed with cutting costs', {x: 200, y: 140, size: 50, rot: -3, color: C.orange})) +
        op(fin(T, w('39')), `<div style="position:absolute;left:1180px;top:300px;font-family:Abril;font-size:220px;line-height:1;color:${C.cream}">${flip > 0.5 ? 39 : 40}</div>`) +
        op(fin(T, w('39')), mono('drops of solder per can', {x: 1190, y: 540, size: 26, color: C.teal})) +
        op(fin(T, w('solder')), mono('solder: a metal glue', {x: 1190, y: 590, size: 22})) +
        op(fin(T, w('One', 1)), pen('one drop, saved on every can, forever', {x: 330, y: 900, size: 50, rot: -2, color: C.orange}));
    }},
    // 9. The rebate (the horizontal explainer's freight office) and the refund joke.
    {a: c.rivals, b: c.squeeze, draw: (T) => renderHI(hiA(T)) +
      vocabCard('REBATE', 'REE-bate', 'noun', 'money paid back after you pay; here, paid back in secret', {x: 1180, y: 90, o: fin(T, w('rebate'), 0.5) * fout(T, w('Imagine') - 0.2)}) +
      op(fin(T, w('Imagine')), pen('imagine the delivery company<br>quietly refunding <u>you</u>', {x: 80, y: 90, size: 46, rot: -3, color: C.orange, w: 780}))},
    // 10. The squeeze: cheaper shipping, lower prices, rivals losing money on every barrel.
    {a: c.squeeze, b: w('Lower', 1) - 0.3, draw: (T) => squeeze(T)},
    // 11. "Lower costs. Lower prices. Rivals bleeding money." The offer: sell now, or go broke.
    {a: w('Lower', 1) - 0.3, b: c.cleve, draw: (T) => offer(T)},
    // 12. Cleveland, 1872: 22 of 26 refineries bought in about six weeks; horizontal integration.
    {a: c.cleve, b: c.mono, draw: (T) => renderHI(hiC(T)) +
      op(fin(T, w('Others')) * fout(T, w("That's", 1) - 0.2), pen('some glad to sell. others felt<br>they had no choice.', {x: 1060, y: 160, size: 42, rot: -3, color: C.orange, w: 760})) +
      op(fin(T, w('pizza')), pen('every pizza place in town', {x: 1100, y: 470, size: 46, rot: -3, color: C.orange}))},
    // 13. Monopoly: about 90 percent; the 1884 "Monster Monopoly"; the board game that started as a warning.
    {a: c.mono, b: c.trust, draw: (T) => {
      const game = fin(T, w('board'), 0.5);
      return backdrop(T, c.mono, c.trust) +
        deskCut('desk/monster_monopoly_1884.png', {x: 160, y: 60, w: 680, rot: -2, o: fin(T, c.mono + 0.1, 0.6), T}) +
        deskCut('desk/landlords_game_patent_1904.png', {x: 1180, y: 80, w: 560, rot: 3, o: game, T}) + `</div>` +
        op(fin(T, c.mono + 0.4) * 0.9, mono('&ldquo;the monster monopoly,&rdquo; the judge, 1884', {x: 170, y: 1000, size: 20})) +
        op(fin(T, w('90')) * (1 - game), `<div style="position:absolute;left:1000px;top:280px;font-family:Abril;font-size:200px;line-height:1;color:${C.cream}">~90%</div>` +
          mono('of america&rsquo;s oil, about 1880', {x: 1010, y: 500, size: 26, color: C.teal})) +
        vocabCard('MONOPOLY', 'muh-NOP-uh-lee', 'noun', 'one company controlling almost all of something', {x: 1060, y: 600, w: 760, o: fin(T, w('monopoly'), 0.5) * (1 - game)}) +
        op(game, mono('the landlord&rsquo;s game, patented 1904', {x: 1190, y: 1000, size: 20})) +
        op(fin(T, w('warning')), pen('it started as a warning', {x: 880, y: 860, size: 50, rot: -4, color: C.orange}));
    }},
    // 14. "To run it, he set up a trust": the 1882 Standard Oil Trust certificate.
    {a: c.trust, b: dur, draw: (T) => backdrop(T, c.trust, dur) +
      deskCut('desk/trust_certificate_1882.png', {x: 100, y: 250, w: 1050, rot: -2, o: fin(T, c.trust + 0.1, 0.6), T}) + `</div>` +
      op(fin(T, c.trust + 0.4) * 0.9, mono('a standard oil trust certificate, 1882', {x: 110, y: 830, size: 20})) +
      vocabCard('TRUST', 'trust', 'noun', 'many companies handing control to one small board, run like one giant business', {x: 1200, y: 200, w: 640, o: fin(T, w('trust'), 0.5)}) +
      op(fin(T, w('giant')), pen('one giant business', {x: 1260, y: 760, size: 52, rot: -4, color: C.orange}))},
  ];
  return {dur, shots, fadeOut: 0.5};
};
