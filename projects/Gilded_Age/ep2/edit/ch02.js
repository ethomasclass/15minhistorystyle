// Chapter 2, "New Money" (1:10 to 2:41): the house, the Commodore's fortune, old money and new, Mrs. Astor, the 400, the calling
// card story, and the ball as an announcement.
EDITS.ch02 = () => {
  const ch = 'ch02_new_money', w = (word, n) => wordAt(ch, word, n), dur = window.WORDS[ch].duration + 1.5;   // + a held tail after the last word, so the last labels get their reading time
  const c = {
    money: w('The', 3) - 0.3, but: w('But') - 0.3, newm: w('And', 4) - 0.25, queen: w('The', 7) - 0.3, her: w('Her', 1) - 0.3,
    story: w("There's") - 0.3, so: w('So', 1) - 0.3, tru: w('True') - 0.3, job: w('So', 2) - 0.3,
  };
  // a row of silhouettes (real people are never drawn: these are types, not portraits)
  const crowd = (T, xs, y, h, o, opts) => `<g opacity="${o.toFixed(3)}">` + xs.map((x, i) => figure({x, y, h, d: i % 2 ? -1 : 1, kind: 'man', hat: 'top', coat: 'frock', fill: '#0d0c09',
    rim: {c: '#F4EFE6', a: 0.35, dx: 0.01, dy: -0.006}, an: POSES.stand(T, i * 0.37), ...(typeof opts === 'function' ? opts(i) : opts)})).join('') + '</g>';
  const ship = (x, y, s, o) => `<g transform="translate(${x},${y}) scale(${s})" fill="${C.cream}" opacity="${o.toFixed(3)}">
    <path d="M-60,0 L60,0 L44,18 L-48,18 Z"/><rect x="-26" y="-74" width="4" height="74"/><rect x="2" y="-88" width="4" height="88"/><rect x="28" y="-64" width="4" height="64"/>
    <path d="M-46,-8 Q-34,-40 -28,-70 L-28,-8 Z" opacity=".9"/><path d="M-20,-10 Q-4,-48 0,-84 L0,-10 Z"/><path d="M8,-10 Q22,-40 26,-60 L26,-10 Z" opacity=".9"/></g>`;
  const loco = (x, y, s, o) => `<g transform="translate(${x},${y}) scale(${s})" fill="${C.cream}" opacity="${o.toFixed(3)}">
    <rect x="-70" y="-40" width="90" height="34"/><rect x="20" y="-70" width="44" height="64"/><path d="M-60,-40 L-66,-78 L-40,-78 L-46,-40 Z"/><path d="M-90,-6 L-70,-30 L-70,-6 Z"/>
    <circle cx="-48" cy="4" r="14"/><circle cx="-10" cy="4" r="14"/><circle cx="40" cy="0" r="20"/><rect x="-100" y="20" width="190" height="5" opacity=".6"/></g>`;
  const box = (text, sub, x, y, o, hi = false) => op(o, `<div style="position:absolute;left:${x}px;top:${y + (1 - ease(o)) * 30}px;width:560px;padding:18px 24px;background:rgba(13,12,9,.82);border:3px solid ${hi ? C.teal : 'rgba(244,239,230,.35)'}">
    <div style="font-family:Playfair;font-weight:900;font-size:40px;color:${C.cream}">${text}</div><div style="font-family:Mono;font-size:20px;letter-spacing:2px;color:${hi ? C.teal : '#b9b2a6'};margin-top:6px;text-transform:uppercase">${sub}</div></div>`);
  const shots = [
    // 1. "The house belonged to William and Alva Vanderbilt. It was brand new: a French castle, in limestone, in the middle of Manhattan."
    {a: 0, b: c.money, draw: (T) => push(T, 0, c.money) +
      deskCut('desk/660_fifth_street.png', {x: 170, y: 120, w: 820, rot: -2, o: fin(T, 0.1, 0.6), T}) +
      deskCut('desk/660_entrance.png', {x: 1110, y: 90, w: 620, rot: 2.5, o: fin(T, w('limestone'), 0.6), T}) + `</div>` +
      op(fin(T, 0.6) * 0.9, mono('660 fifth avenue (photo, about 1903)', {x: 190, y: 900, size: 20})) +
      op(fin(T, w('limestone') + 0.3) * 0.9, mono('the front door', {x: 1130, y: 940, size: 20})) +
      op(fin(T, w('William')), pen('william &amp; alva vanderbilt', {x: 190, y: 40, size: 50, rot: -3, color: C.orange})) +
      op(fin(T, w('French')), pen('a french castle', {x: 700, y: 960, size: 54, rot: -3, color: C.orange})) +
      stamp('New York &middot; 1883', fin(T, 0.4) * fout(T, w('French')))},
    // 2. The fortune: the Commodore, his son, his grandson; ships and railroads; about $100 million.
    {a: c.money, b: c.but, draw: (T) => {
      const big = fin(T, w('hundred'), 0.4), tree = 1 - big;
      return desk() +
        box('Cornelius Vanderbilt', '&ldquo;the commodore&rdquo; &middot; 1794 to 1877', 140, 130, fin(T, w('grandson'), 0.4) * tree) +
        box('William H. Vanderbilt', 'his son', 140, 330, fin(T, w('grandson') + 0.3, 0.4) * tree) +
        box('William K. Vanderbilt', "his grandson &middot; alva's husband", 140, 530, fin(T, w('grandson') + 0.6, 0.4) * tree, true) +
        svg(drawLine([[420, 252], [420, 330]], clamp01((T - w('grandson') - 0.2) / 0.4) * tree) + drawLine([[420, 452], [420, 530]], clamp01((T - w('grandson') - 0.5) / 0.4) * tree)) +
        svg(ship(1200, 420, 1.6, fin(T, w('ships')) * tree) + loco(1520, 440, 1.5, fin(T, w('railroads')) * tree)) +
        op(fin(T, w('ships')) * tree, mono('ships', {x: 1150, y: 480, size: 26, color: C.teal})) +
        op(fin(T, w('railroads')) * tree, mono('railroads', {x: 1440, y: 480, size: 26, color: C.teal})) +
        op(fin(T, w('fortune')) * tree, pen('a fortune', {x: 1250, y: 200, size: 60, rot: -4, color: C.orange})) +
        bigFig('$100,000,000', {y: 330, size: 170, o: big}) +
        op(big, mono('what the commodore left when he died, 1877', {x: 0, y: 540, size: 28, color: C.teal, extra: 'width:1920px;text-align:center'})) +
        op(fin(T, w("That's")), pen('more than almost anyone on earth', {x: 520, y: 680, size: 56, rot: -3, color: C.orange}));
    }},
    // 3. "But in New York, money wasn't enough. At the top sat a small circle of families ... old money. They decided who was 'in.'"
    {a: c.but, b: c.newm, draw: (T) => { const ring = fin(T, w('circle'), 0.6);
      const xs = Array.from({length: 7}, (_, i) => 430 + Math.cos(i / 7 * TAU) * 260), ys = Array.from({length: 7}, (_, i) => 700 + Math.sin(i / 7 * TAU) * 60);
      return desk() +
        (fin(T, w('wasn\'t')) > 0 ? slideUp(fin(T, w("wasn't")) * fout(T, w('circle') - 0.3), tape("MONEY WASN'T ENOUGH", {x: 360, y: 400, size: 96, rot: -2, seed: 41})) : '') +
        svg(`<ellipse cx="430" cy="730" rx="330" ry="90" fill="none" stroke="${C.teal}" stroke-width="5" opacity="${(0.8 * ring).toFixed(3)}"/>` +
          xs.map((x, i) => crowd(T, [x], ys[i], 300, ring, {d: x > 430 ? -1 : 1})).join('')) +
        op(fin(T, w('generations')), pen('rich for generations', {x: 160, y: 200, size: 56, rot: -3, color: C.orange})) +
        op(fin(T, w('decided')), pen('they decided who was &ldquo;in&rdquo;', {x: 160, y: 900, size: 48, rot: -2, color: C.orange})) +
        vocabCard('old money', 'ohld MUH-nee', 'noun', 'Families who had been rich for generations, and decided who belonged.', {x: 1120, y: 200, o: fin(T, w('old', 1), 0.4)});
    }},
    // 4. "And they looked down on people like the Vanderbilts: new money ... Too fast. Too loud. Railroad people."
    {a: c.newm, b: c.queen, draw: (T) => { const o = fin(T, w('people', 1) - 0.4, 0.6);
      return desk() + svg(crowd(T, [260, 420, 580], 840, 380, o, (i) => ({hat: i === 1 ? 'bowler' : 'top', an: {...POSES.stand(T, i), fArm: [40 + 30 * Math.sin(T * 2 + i), 20]}})) +
          loco(1500, 840, 2.2, fin(T, w('Railroad'), 0.4) * 0.9)) +
        vocabCard('new money', 'noo MUH-nee', 'noun', 'People who got rich in their own lifetime. Old money looked down on them.', {x: 1120, y: 110, o: fin(T, w('new', 3), 0.4)}) +
        op(fin(T, w('Too', 1)), pen('too fast.', {x: 760, y: 540, size: 56, rot: -4, color: C.orange})) +
        op(fin(T, w('Too', 2)), pen('too loud.', {x: 840, y: 640, size: 56, rot: -4, color: C.orange})) +
        op(fin(T, w('Railroad')), pen('railroad people.', {x: 1240, y: 520, size: 56, rot: -4, color: C.orange})) +
        op(o * 0.9, mono('the vanderbilts, as old money saw them', {x: 220, y: 900, size: 20}));
    }},
    // 5. "The queen of old money was Mrs. Caroline Astor. If she came to your house, you were in. If she didn't, you weren't."
    {a: c.queen, b: c.her, draw: (T) => push(T, c.queen, c.her) +
      deskCut('desk/astor_bust.png', {x: 240, y: 170, w: 560, rot: -2, o: fin(T, w('Mrs', 1), 0.6), T, caption: 'mrs. caroline astor', cx: 40}) + `</div>` +
      op(fin(T, w('queen')), pen('the queen of old money', {x: 900, y: 180, size: 64, rot: -4, color: C.orange})) +
      callCard('Mrs. Astor', 'she visits', {x: 960, y: 420, w: 440, rot: -4, o: fin(T, w('If', 1), 0.4), T}) +
      tick(1450, 560, clamp01((T - w('in', 7)) / 0.4)) + op(fin(T, w('in', 7)), pen("you're in", {x: 1530, y: 500, size: 56, rot: -4, color: C.teal})) +
      callCard('Mrs. Astor', "she doesn't", {x: 1000, y: 720, w: 440, rot: 3, o: fin(T, w('If', 2), 0.4), T, strike: clamp01((T - w("weren't")) / 0.4)}) +
      cross(1480, 790, clamp01((T - w("weren't")) / 0.4)) + op(fin(T, w("weren't")), pen("you're out", {x: 1550, y: 780, size: 56, rot: -4, color: '#E07A5F'}))},
    // 6. "Her advisor later said there were only about four hundred people in New York who really belonged in society ... the 400."
    {a: c.her, b: c.story, draw: (T) => { const k = clamp01((T - w('four')) / 1.4), N = Math.floor(400 * k), d = [];
      for (let i = 0; i < 400; i++) { const x = 170 + (i % 25) * 30, y = 260 + Math.floor(i / 25) * 30;
        d.push(`<circle cx="${x}" cy="${y}" r="${i < N ? 10 : 4}" fill="${i < N ? C.teal : '#3a362e'}"/>`); }
      return desk() + svg(d.join('')) +
        op(fin(T, w('advisor')), pen('her advisor, ward mcallister', {x: 160, y: 120, size: 50, rot: -3, color: C.orange})) +
        op(fin(T, w('four')), mono('about 400 people', {x: 170, y: 770, size: 30, color: C.teal, ls: 4})) +
        op(fin(T, w('society')), mono('out of more than a million new yorkers', {x: 170, y: 820, size: 22, color: C.cream})) +
        op(fin(T, w('rest')) * fout(T, w('400') - 0.5), pen('the rest made people<br>uncomfortable at parties', {x: 1120, y: 300, size: 50, rot: -3, color: C.orange, w: 700})) +
        vocabCard('the 400', 'the FOR HUN-drid', 'noun', 'The few hundred rich New Yorkers who counted as &ldquo;society&rdquo; in the 1880s.', {x: 1140, y: 230, o: fin(T, w('400'), 0.4)});
    }},
    // 7. "There's a story, and it's probably only a story, that Alva refused to invite Mrs. Astor's daughter to the ball ..."
    {a: c.story, b: c.so, draw: (T) => push(T, c.story, c.so) +
      deskCut('desk/alva_mora_1883.png', {x: 150, y: 150, w: 520, rot: -1.5, o: fin(T, c.story + 0.1, 0.6), T, caption: 'alva vanderbilt, at the ball', cx: 60, cy: -40}) + `</div>` +
      op(fin(T, w('story', 1)), mono('a story (probably only a story)', {x: 760, y: 140, size: 30, color: C.teal, ls: 4})) +
      callCard('Miss Carrie Astor', 'you are invited to the ball', {x: 800, y: 300, w: 620, rot: -3, o: fin(T, w('invite'), 0.4), T, strike: clamp01((T - w('refused') - 0.4) / 0.5)}) +
      op(fin(T, w('daughter')), pen("mrs. astor's daughter", {x: 1260, y: 640, size: 50, rot: -4, color: C.orange})) +
      op(fin(T, w('never')), pen('mrs. astor had never called on her', {x: 780, y: 800, size: 50, rot: -3, color: C.orange})) +
      op(fin(T, 0.5) * 0.9, mono('photograph by josé maría mora, 1883', {x: 170, y: 990, size: 18}))},
    // 8. "So Mrs. Astor gave in. She drove over and left her calling card: a little printed card that meant 'I accept you.'"
    {a: c.so, b: c.tru, draw: (T) => { const land = fin(T, w('left', 2), 0.5);
      return push(T, c.so, c.tru) + deskProp('p02_silver_salver_cards', {x: 160, y: 330, w: 900, rot: -2, o: fin(T, c.so + 0.1, 0.5), T}) + `</div>` +
        callCard('Mrs. Astor', '', {x: 380, y: 300 + (1 - ease(land)) * -260, w: 420, rot: -8 + 4 * land, o: land, T}) +
        op(fin(T, w('gave')), pen('she gave in', {x: 180, y: 130, size: 60, rot: -4, color: C.orange})) +
        op(fin(T, w('accept')), pen('&ldquo;i accept you&rdquo;', {x: 300, y: 880, size: 60, rot: -3, color: C.orange})) +
        vocabCard('calling card', 'KAW-ling kard', 'noun', 'A small printed card with your name. Leaving one at a house was a visit, and a sign of acceptance.', {x: 1160, y: 200, o: fin(T, w('calling'), 0.4)});
    }},
    // 9. "True or not, Mrs. Astor came to the ball." The house, every floor lit.
    {a: c.tru, b: c.job, draw: (T) => renderBall({t: T, cam: {z: 0.8 + 0.06 * ease((T - c.tru) / 3), ux: 930, uy: 540}, quiet: true}) +
      op(fin(T, w('came', 3)), pen('mrs. astor came', {x: 120, y: 120, size: 60, rot: -4, color: C.orange})) +
      stamp('660 Fifth Avenue &middot; March 26, 1883', 1)},
    // 10. "So the party had a job ... an announcement: the Vanderbilts have arrived."
    {a: c.job, b: dur, draw: (T) => renderFifth({t: T + 20, cam: {z: 1.25, ux: 1500 + (T - c.job) * 60, uy: 560}, quiet: true}) +
      op(fin(T, w('job')), pen('the party had a job', {x: 120, y: 120, size: 60, rot: -4, color: C.orange})) +
      op(fin(T, w('announcement')), mono('an announcement', {x: 140, y: 300, size: 34, color: C.teal, ls: 5})) +
      (fin(T, w('announcement')) > 0 ? slideUp(fin(T, w('announcement')), tape('THE VANDERBILTS HAVE ARRIVED', {x: 140, y: 360, size: 90, rot: -2, seed: 47})) : '')},
  ];
  return {dur, shots, fadeOut: 0.6};
};
