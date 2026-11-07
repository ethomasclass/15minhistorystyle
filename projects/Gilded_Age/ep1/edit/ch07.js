// Chapter 7, "The Trust Comes to Brooklyn" (8:41 to 9:43): the sugar trust, the same job, the Kellys at dinner, the lamp, the plug.
EDITS.ch07 = () => {
  const ch = 'ch07_the_trust_comes_to_brooklyn', w = (word, n) => wordAt(ch, word, n), dur = window.WORDS[ch].duration;
  const c = {
    floor: w('Michael', 1) - 0.3, docs: w('But') - 0.3, home: w('That', 1) - 0.3, lamp: w('That', 3) - 0.3, two: w('One', 2) - 0.3,
    plug: w('Quick') - 0.3,
  };
  const backdrop = (T, a, b, z = 0.035) => `<div style="position:absolute;inset:0;transform:scale(${(1 + z * ease((T - a) / (b - a))).toFixed(4)})">${desk()}`;
  const cutT = remap([[c.home, 4.0], [w('lamp', 1) + 0.6, 12.2], [c.lamp, 12.2 + (c.lamp - w('lamp', 1) - 0.6)]]);
  // A kerosene flame and its glow, drawn onto the unlit lamp prop (deskProp at x, y, width wd; the wick sits about a third down).
  const flame = (x, y, wd, o, T) => {
    if (o <= 0) return ''; const fx = x + wd * 0.5, fy = y + wd * 1.31, fl = 1 + 0.06 * Math.sin(T * 13) + 0.04 * Math.sin(T * 7.3);
    return `<div style="position:absolute;left:${fx - 260}px;top:${fy - 260}px;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(255,190,110,${(0.32 * o).toFixed(3)}) 0%,rgba(255,170,80,0) 70%)"></div>` +
      svg(`<defs><radialGradient id="fl"><stop offset="0" stop-color="#FFF6D8"/><stop offset=".45" stop-color="#FFC56A"/><stop offset="1" stop-color="#FF8A2A" stop-opacity="0"/></radialGradient></defs>
        <ellipse cx="${f1(fx)}" cy="${f1(fy)}" rx="${f1(wd * 0.05 * fl)}" ry="${f1(wd * 0.12 * fl)}" fill="url(#fl)" opacity="${o.toFixed(3)}"/>`);
  };
  const shots = [
    // 1. "Back in Brooklyn, in 1887, the sugar refiners copied Rockefeller ... joined one sugar trust." Teal strings rise from the refinery.
    {a: 0, b: c.floor, draw: (T) => {
      const k = clamp01((T - w('joined')) / 1.0), lines = [];
      for (let i = 0; i < 7; i++) { const x = 420 + i * 170; lines.push(drawLine([[x, 300], [x + (960 - x) * 0.6, 120], [960, 80]], k)); }
      return renderRefinery(0.2) + svg(lines.join('')) + op(fin(T, w('1887')), mono('Brooklyn &middot; 1887', {x: 44, y: 40, size: 24, extra: 'background:rgba(13,12,9,.7);padding:6px 12px'})) +
        op(fin(T, w('trust')), tape('ONE SUGAR TRUST', {x: 700, y: 20, size: 66, rot: -2, seed: 91}));
    }},
    // 2. "Michael didn't change jobs. Same heat. Same long shifts." His floor.
    {a: c.floor, b: c.docs, draw: (T) => renderRefinery(11.6 + (T - c.floor) * 0.3) +
      op(fin(T, w('Same', 1)), pen('same heat', {x: 90, y: 600, size: 52, rot: -4, color: C.orange})) +
      op(fin(T, w('Same', 2)), pen('same long shifts', {x: 90, y: 700, size: 52, rot: -4, color: C.orange}))},
    // 3. "the refinery down the street wasn't a rival anymore. It was the same company." The name, taken over: two trademark filings.
    {a: c.docs, b: c.home, draw: (T) => backdrop(T, c.docs, c.home) +
      deskCut('desk/he_label_1877.png', {x: 200, y: 110, w: 560, rot: -3, o: fin(T, c.docs + 0.1, 0.6), T}) +
      deskCut('desk/asr_trademark_1909.png', {x: 1110, y: 100, w: 560, rot: 2.5, o: fin(T, w('same', 3), 0.6), T}) + `</div>` +
      op(fin(T, c.docs + 0.4), mono('1877 &middot; filed by havemeyers &amp; elder', {x: 210, y: 960, size: 22})) +
      op(fin(T, w('same', 3)), mono('1909 &middot; the same name, owned by the trust&rsquo;s company', {x: 1000, y: 960, size: 22})) +
      op(fin(T, w('fewer')), pen('fewer places to go', {x: 700, y: 20, size: 60, rot: -3, color: C.orange}))},
    // 4. "That night, the family eats by the light of a kerosene lamp." The tenement, into the Kellys' kitchen, for Ma and Michael.
    {a: c.home, b: c.lamp, draw: (T) => renderCutaway({t: cutT(T), ...cutCam(cutT(T))}) +
      op(fin(T, w('Pass')) * fout(T, c.lamp - 0.3), pen('the lamp', {x: 1240, y: 420, size: 50, rot: -4, color: C.orange}) + svg(arrow([1240, 470], [1175, 585], 30)))},
    // 5. "That lamp burns kerosene. Most likely, Rockefeller's kerosene."
    {a: c.lamp, b: c.two, draw: (T) => backdrop(T, c.lamp, c.two, 0.05) +
      deskProp('p07_kerosene_lamp', {x: 810, y: 120, w: 300, rot: 0, o: 1, T}) + `</div>` + flame(810, 120, 300, 1, T) +
      op(fin(T, w("Rockefeller's")), pen("rockefeller's kerosene", {x: 1180, y: 380, size: 56, rot: -4, color: C.orange}))},
    // 6. "One monopoly lighting the table, after a day working for another."
    {a: c.two, b: c.plug, draw: (T) => desk() +
      deskProp('p07_kerosene_lamp', {x: 330, y: 160, w: 240, rot: 0, o: 1, T}) + flame(330, 160, 240, 1, T) +
      deskCut('desk/refinery_waterfront_1916.png', {x: 820, y: 330, w: 980, rot: -1, o: fin(T, w('another') - 0.6, 0.5), T}) +
      op(fin(T, w('monopoly')), mono('standard oil', {x: 340, y: 960, size: 30, color: C.teal, ls: 5})) +
      op(fin(T, w('another') - 0.6), mono('the sugar trust', {x: 1150, y: 700, size: 30, color: C.teal, ls: 5})) +
      op(fin(T, w('monopoly')), pen('one monopoly lights the table...', {x: 120, y: 80, size: 50, rot: -3, color: C.orange})) +
      op(fin(T, w('working')), pen('...after a day working for another', {x: 860, y: 160, size: 50, rot: -3, color: C.orange}))},
    // 7. The plug: "Quick favor: hit subscribe. It's free. And unlike kerosene in 1887, you've got other options."
    {a: c.plug, b: dur, draw: (T) => desk() + deskProp('p07_kerosene_lamp', {x: 1440, y: 200, w: 240, rot: 0, o: 1, T}) + flame(1440, 200, 240, 1, T) +
      slideUp(fin(T, w('subscribe', 1)), tape('SUBSCRIBE', {x: 220, y: 300, size: 130, rot: -3, seed: 93})) +
      op(fin(T, w("It's")), pen("it's free", {x: 300, y: 560, size: 60, rot: -4, color: C.orange})) +
      op(fin(T, w('unlike')), pen('unlike kerosene in 1887,<br>you&rsquo;ve got other options', {x: 300, y: 690, size: 48, rot: -3, color: C.orange, w: 900})) +
      op(fin(T, w('anyway')), mono('subscribe anyway.', {x: 310, y: 930, size: 30, color: C.teal, ls: 5}))},
  ];
  return {dur, shots, fadeOut: 0.5};
};
