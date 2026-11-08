// Chapter 4, "The Basement" (3:44 to 5:03): the kitchen, Nora's job and room, her hours and pay, the arithmetic (more than 1,300
// years), the Vikings, and her afternoon off at home in Brooklyn with her wages on the table.
EDITS.ch04 = () => {
  const ch = 'ch04_the_basement', w = (word, n) => wordAt(ch, word, n), dur = window.WORDS[ch].duration;
  const c = {
    kitchen: w('That', 1) - 0.3, plan: w('The', 2) - 0.3, job: w('Nora', 1) - 0.3, attic: w('slept') - 0.4, hours: w('Most', 1) - 0.3,
    pay: w('Her', 1) - 0.3, math: w('So') - 0.3, vik: w('Nora', 3) - 0.3, home: w('On', 2) - 0.3, wages: w('She', 6) - 0.3, piece: w('paid') - 0.3,
  };
  const ball = (T, cam) => renderBall({t: T, cam, quiet: true});
  const flatT = remap([[c.home, 1.0], [w('home') + 1.4, 4.4], [w('time', 2) + 0.4, 5.6], [c.wages, 5.75], [w('wages'), 6.3], [w('mother'), 7.1], [c.piece, 8.3]]);
  const flatCam = (T) => { const u = ease(clamp01((T - c.home) / 5)), v = ease(clamp01((T - w('And', 7)) / 2.5)), k = ease(clamp01((T - c.wages) / 3));
    return {z: lerpLog(lerpLog(lerpLog(0.86, 1.0, u), 1.3, v), 1.12, k), ux: 960 - 40 * u - 120 * v + 200 * k, uy: 540 + 40 * u + 60 * v - 20 * k}; };
  const ix = (yr) => 200 + (yr - 500) / 1400 * 1520;
  const shots = [
    // 1. "Now back downstairs." From the great hall down to the kitchen.
    {a: 0, b: c.kitchen, draw: (T) => { const u = ease(clamp01(T / c.kitchen));
      return ball(T + 30, {z: lerpLog(2.0, 2.6, u), ux: 1060 - 320 * u, uy: 760 + 150 * u}) + stamp('660 Fifth Avenue &middot; the basement', fin(T, 0.3)); }},
    // 2. "That night the Vanderbilts pulled cooks and servants from all their family's houses into one kitchen."
    {a: c.kitchen, b: c.plan, draw: (T) => ball(T + 30, {z: 2.6 + 0.3 * ease((T - c.kitchen) / 6), ux: 740, uy: 910}) +
      op(fin(T, w('cooks')), pen('cooks and servants<br>from all the family&rsquo;s houses', {x: 1060, y: 120, size: 50, rot: -3, color: C.orange, w: 800})) +
      op(fin(T, w('one', 1)), pen('...into one kitchen', {x: 1120, y: 300, size: 54, rot: -3, color: C.orange}))},
    // 3. "The richest family in America threw the party of the century, and the supper came from the servants." Hunt's basement plan.
    {a: c.plan, b: c.job, draw: (T) => { const ring = clamp01((T - w('supper') + 0.2) / 0.6);
      return push(T, c.plan, c.job) + deskCut('desk/660_basement_plan.png', {x: 260, y: 120, w: 1200, rot: -1.5, o: fin(T, c.plan + 0.1, 0.5), T}) + `</div>` +
        op(fin(T, c.plan + 0.4) * 0.9, mono("richard morris hunt's plan of the basement, 660 fifth avenue", {x: 280, y: 990, size: 20})) +
        svg(ring > 0 ? `<ellipse cx="760" cy="420" rx="${f1(170 * ease(ring))}" ry="${f1(110 * ease(ring))}" fill="none" stroke="${C.ink}" stroke-width="11"/><ellipse cx="760" cy="420" rx="${f1(170 * ease(ring))}" ry="${f1(110 * ease(ring))}" fill="none" stroke="${C.teal}" stroke-width="6"/>` : '') +
        op(fin(T, w('century')), pen('the party of the century...', {x: 1100, y: 80, size: 50, rot: -3, color: C.orange})) +
        op(fin(T, w('servants', 2)), pen('...cooked downstairs', {x: 1180, y: 180, size: 54, rot: -3, color: C.orange}));
    }},
    // 4. "Nora was a domestic servant. And she was live-in"
    {a: c.job, b: c.attic, draw: (T) => push(T, c.job, c.attic) + deskProp('p04_maid_cap_apron', {x: 140, y: 300, w: 760, rot: -3, o: fin(T, c.job + 0.1, 0.5), T}) + `</div>` +
      vocabCard('domestic servant', 'duh-MES-tik SER-vunt', 'noun', "Someone paid to cook, clean or serve in another family's home.", {x: 1080, y: 110, w: 740, size: 64, o: fin(T, w('domestic'), 0.4) * fout(T, w('live-in') - 0.2, 0.3)}) +
      vocabCard('live-in', 'LIV-in', 'adjective', "Living in the employer's house, so on call almost all the time.", {x: 1100, y: 140, o: fin(T, w('live-in'), 0.4)}) + compositeBar(1)},
    // 5. "she slept in the house, in a small room near the roof. That meant she was on call almost all the time." (lookdev nora_attic)
    {a: c.attic, b: c.hours, draw: (T) => renderAttic(remap([[c.attic, 0.6], [w('on', 1) - 0.1, 4.7], [c.hours, 7.8]])(T))},
    // 6. "Most days she worked more than ten hours. Some days fourteen. She got one afternoon off a week, and part of Sunday."
    {a: c.hours, b: c.pay, draw: (T) => { const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'], hrs = [11, 14, 11, 6, 12, 14, 7], g = [];
      const grow = ease(clamp01((T - w('worked')) / 1.2)), base = 860, ph = 38;
      days.forEach((d, i) => { const x = 230 + i * 170, h = hrs[i] * ph * grow, off = (i === 3 && T > w('afternoon')) || (i === 6 && T > w('Sunday'));
        g.push(`<rect x="${x}" y="${base - h}" width="110" height="${h}" fill="${C.teal}" opacity=".85"/>`);
        if (off) g.push(`<rect x="${x}" y="${base - 14 * ph}" width="110" height="${(14 - hrs[i]) * ph}" fill="none" stroke="${C.orange}" stroke-width="4" stroke-dasharray="10 8"/>`);
        g.push(`<text x="${x + 55}" y="${base + 44}" font-family="Mono" font-size="26" letter-spacing="3" fill="${C.cream}" text-anchor="middle">${d}</text>`); });
      const t10 = fin(T, w('ten'), 0.3), t14 = fin(T, w('fourteen'), 0.3);
      g.push(`<line x1="200" y1="${base - 10 * ph}" x2="1420" y2="${base - 10 * ph}" stroke="${C.cream}" stroke-width="3" stroke-dasharray="6 8" opacity="${t10}"/><text x="1440" y="${base - 10 * ph + 9}" font-family="Mono" font-size="26" fill="${C.cream}" opacity="${t10}">10 HOURS</text>`);
      g.push(`<line x1="200" y1="${base - 14 * ph}" x2="1420" y2="${base - 14 * ph}" stroke="${C.cream}" stroke-width="3" stroke-dasharray="6 8" opacity="${t14}"/><text x="1440" y="${base - 14 * ph + 9}" font-family="Mono" font-size="26" fill="${C.cream}" opacity="${t14}">14 HOURS</text>`);
      return desk() + svg(g.join('')) + op(fin(T, c.hours + 0.2) * 0.9, mono("nora's week (typical hours, 1880s)", {x: 230, y: 160, size: 26, color: C.teal, ls: 4})) +
        deskProp('p04_service_bell', {x: 1580, y: 130, w: 240, rot: 4, o: fin(T, c.hours + 0.2, 0.5), T}) +
        op(fin(T, w('afternoon')), pen('one afternoon off', {x: 600, y: 230, size: 46, rot: -4, color: C.orange})) +
        op(fin(T, w('Sunday')), pen('part of sunday', {x: 1180, y: 250, size: 46, rot: -4, color: C.orange}));
    }},
    // 7. "Her pay was about three dollars and sixty cents a week, plus her bed and her meals."
    {a: c.pay, b: c.math, draw: (T) => push(T, c.pay, c.math) + deskCut(EP1 + 'props/p06_coins_stack.webp', {x: 1240, y: 340, w: 480, rot: 4, o: fin(T, c.pay + 0.2, 0.5), T}) + `</div>` +
      op(fin(T, w('pay')) * 0.9, mono("nora's pay", {x: 160, y: 260, size: 30, ls: 4})) +
      bigFig('$3.60 a week', {x: 140, y: 310, size: 160, w: 1200, align: 'left', o: fin(T, w('three'), 0.4)}) +
      today('&asymp; $130 a week today &middot; for 70+ hours', {x: 160, y: 500, w: 1100, align: 'left', o: fin(T, w('week', 2) + 0.2)}) +
      op(fin(T, w('bed')), pen('+ her bed and her meals', {x: 160, y: 620, size: 60, rot: -3, color: C.orange}))},
    // 8. "So let's do the math." Nora's arithmetic: $250,000 / $187 a year = more than 1,300 years.
    {a: c.math, b: c.vik, draw: (T) => desk() +
      op(fin(T, w('math')), mono("nora's arithmetic", {x: 200, y: 140, size: 30, color: C.teal, ls: 6})) +
      bigFig('$250,000', {x: 200, y: 220, size: 130, w: 900, align: 'left', o: fin(T, w('quarter'), 0.4)}) +
      op(fin(T, w('quarter') + 0.3) * 0.9, mono('the party', {x: 210, y: 370, size: 24})) +
      bigFig('&divide; $187 a year', {x: 200, y: 430, size: 110, w: 1300, align: 'left', color: C.teal, o: fin(T, w('divided'), 0.4)}) +
      op(fin(T, w('year')) * 0.9, mono("what nora earned in a year: $3.60 &times; 52 weeks", {x: 210, y: 560, size: 24})) +
      svg(`<line x1="200" y1="630" x2="${f1(200 + 1100 * ease(clamp01((T - w('comes')) / 0.5)))}" y2="630" stroke="${C.cream}" stroke-width="6"/>`) +
      bigFig('= 1,337 years', {x: 200, y: 660, size: 130, w: 1300, align: 'left', o: fin(T, w('comes'), 0.4)}) +
      (fin(T, w('thirteen')) > 0 ? slideUp(fin(T, w('thirteen')), tape('MORE THAN 1,300 YEARS', {x: 880, y: 860, size: 72, rot: -3, seed: 61})) : '')},
    // 9. "Nora would have had to start working before the Vikings reached North America to pay for one party."
    {a: c.vik, b: c.home, draw: (T) => { const k = ease(clamp01((T - w('start')) / 2.2)), x1 = ix(548) + (ix(1883) - ix(548)) * k;
      const ticks = [600, 800, 1000, 1200, 1400, 1600, 1800].map((y) => `<line x1="${ix(y)}" y1="590" x2="${ix(y)}" y2="610" stroke="${C.cream}" stroke-width="3"/><text x="${ix(y)}" y="650" font-family="Mono" font-size="22" fill="#b9b2a6" text-anchor="middle">${y}</text>`).join('');
      const vk = fin(T, w('Vikings'), 0.4);
      return desk() + svg(`<line x1="160" y1="600" x2="1760" y2="600" stroke="${C.cream}" stroke-width="3" opacity=".5"/>` + ticks +
          `<rect x="${ix(548)}" y="570" width="${f1(x1 - ix(548))}" height="22" fill="${C.teal}"/>` +
          `<circle cx="${ix(548)}" cy="581" r="14" fill="${C.orange}" opacity="${fin(T, w('start'), 0.3)}"/>` +
          `<g opacity="${vk}"><line x1="${ix(1000)}" y1="480" x2="${ix(1000)}" y2="570" stroke="${C.orange}" stroke-width="4"/><circle cx="${ix(1000)}" cy="480" r="10" fill="${C.orange}"/></g>` +
          `<g opacity="${fin(T, w('party', 2) - 0.4, 0.3)}"><line x1="${ix(1883)}" y1="480" x2="${ix(1883)}" y2="570" stroke="${C.cream}" stroke-width="4"/></g>`) +
        op(fin(T, w('start')), pen('nora starts work: 548 a.d.', {x: 150, y: 680, size: 50, rot: -3, color: C.orange})) +
        op(vk, pen('the vikings reach north america<br>(about the year 1000)', {x: ix(1000) - 260, y: 330, size: 42, rot: -3, color: C.orange, w: 620})) +
        op(fin(T, w('party', 2) - 0.4), pen('the ball, 1883:<br>paid off', {x: ix(1883) - 210, y: 330, size: 44, rot: -3, color: C.orange, w: 360})) +
        op(fin(T, c.vik + 0.2), mono('one party, paid with nora&rsquo;s wages', {x: 160, y: 160, size: 30, color: C.teal, ls: 4}));
    }},
    // 10. "On her afternoon off, Nora took the ferry home ... MA: And how were the fancy folk, then? NORA: Tired. Like the rest of us."
    {a: c.home, b: c.wages, draw: (T) => renderFlat({t: flatT(T), cam: flatCam(T), quiet: true}) +
      stamp("The Kellys' flat &middot; Brooklyn &middot; 1883", 1) +
      op(fin(T, w('ferry')) * fout(T, w('And', 7)), pen('afternoon off: the ferry home', {x: 1000, y: 120, size: 46, rot: -3, color: C.orange})) +
      op(fin(T, w('same')) * fout(T, w('And', 7)), pen('the same kind of room as episode 1', {x: 900, y: 220, size: 42, rot: -3, color: C.orange}))},
    // 11. "She put most of her wages on the table. Her mother and her little brother were sewing shirts by the lamp"
    {a: c.wages, b: c.piece, draw: (T) => renderFlat({t: flatT(T), cam: flatCam(T), quiet: true}) + stamp("The Kellys' flat &middot; Brooklyn &middot; 1883", 1) +
      op(fin(T, w('wages')), pen('most of her wages', {x: 1240, y: 120, size: 56, rot: -3, color: C.orange})) +
      op(fin(T, w('sewing')), pen('sewing shirts by the lamp', {x: 1200, y: 230, size: 48, rot: -3, color: C.orange})) + compositeBar(fin(T, c.wages + 0.5))},
    // 12. "paid by the piece. That money was how the family made rent."
    {a: c.piece, b: dur, draw: (T) => push(T, c.piece, dur) + deskProp('p04_piecework_shirt', {x: 420, y: 260, w: 1000, rot: -2, o: fin(T, c.piece + 0.1, 0.5), T}) + `</div>` +
      op(fin(T, w('piece')), pen('paid by the piece', {x: 200, y: 140, size: 60, rot: -4, color: C.orange})) +
      op(fin(T, w('rent')), pen('...how the family made rent', {x: 1000, y: 880, size: 56, rot: -3, color: C.orange})) +
      op(fin(T, c.piece + 0.3) * 0.85, mono('a shirt like theirs (re-creation)', {x: 440, y: 1010, size: 18, color: '#9a958c'}))},
  ];
  return {dur, shots, fadeOut: 0.6};
};
