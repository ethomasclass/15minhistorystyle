// Chapter 3, "The Machines" (2:04 to 3:14): industrialization, Bessemer steel, cheap rails, the flood of inventions, Edison's system.
EDITS.ch03 = () => {
  const ch = 'ch03_the_machines', w = (word, n) => wordAt(ch, word, n), dur = window.WORDS[ch].duration;
  const cut = {
    steel: w('Take') - 0.3, bess: w('Then') - 0.3, rails: w('Steel', 4) - 0.3, frame: w('steel', 6) - 0.45, inv: w('Inventions') - 0.3,
    didnt: w('He') - 0.3, system: w('What') - 0.3, bill: w('So') - 0.3, michael: w('New') - 0.3,
  };
  const backdrop = (T, a, b, z = 0.035) => `<div style="position:absolute;inset:0;transform:scale(${(1 + z * ease((T - a) / (b - a))).toFixed(4)})">${desk()}`;
  // The Bessemer x-ray clip (lookdev/bessemer.js, 18 s) re-timed to the words: tilt and blow on "blow air", carbon burning on
  // "burns out the extra carbon", the old-way / Bessemer tags on "Minutes, not a day", the card as the chapter moves on.
  const bt = remap([[cut.bess, 3.4], [w('blow'), 4.8], [w('burns'), 8.4], [w('Minutes'), 12.8], [cut.rails, 15.6]]);
  const shots = [
    // 1. Industrialization: the steam looms of 1847 (the weaver's-son set), the vocab card.
    {a: 0, b: cut.steel, draw: (T) => renderLoom(6.9 + T * 0.42) +
      vocabCard('INDUSTRIALIZATION', 'in-DUS-tree-uh-luh-ZAY-shun', 'noun', 'making things by machine, in factories, in huge numbers, instead of by hand',
        {x: 1060, y: 90, w: 800, size: 60, o: fin(T, w('industrialization'), 0.6)})},
    // 2. "Take steel. Iron snaps. Steel bends. But steel took a day or more to make."
    {a: cut.steel, b: cut.bess, draw: (T) => backdrop(T, cut.steel, cut.bess) +
      deskProp('p03_iron_snapped', {x: 170, y: 330, w: 760, rot: -2, o: fin(T, w('Iron', 1), 0.5), T}) +
      deskProp('p03_steel_bent', {x: 1130, y: 230, w: 560, rot: 3, o: fin(T, w('bends'), 0.5), T}) + `</div>` +
      op(fin(T, w('Iron', 1)), pen('iron snaps', {x: 330, y: 720, size: 56, rot: -4, color: C.orange})) +
      op(fin(T, w('bends')), pen('steel bends', {x: 1220, y: 820, size: 56, rot: -4, color: C.orange})) +
      op(fin(T, w('day', 1)), tape('BUT: A DAY OR MORE TO MAKE', {x: 560, y: 110, size: 56, rot: -2, seed: 31}))},
    // 3. The Bessemer process, in x-ray (shot 11): its own labels and card come from the clip.
    {a: cut.bess, b: cut.rails, draw: (T) => renderBessemer(bt(T))},
    // 4. "Steel rails fell from more than 170 dollars a ton to about 17. Same steel. One-tenth the price."
    {a: cut.rails, b: cut.frame, draw: (T) => {
      const k = ease(clamp01((T - w('170')) / (w('17') + 0.3 - w('170')))), price = Math.round(170 - 153 * k);
      return backdrop(T, cut.rails, cut.frame) + deskProp('p03_steel_rail', {x: 110, y: 300, w: 760, rot: -2, o: fin(T, cut.rails, 0.5), T}) + `</div>` +
        op(fin(T, cut.rails + 0.2), `<div style="position:absolute;left:1000px;top:250px;width:760px">
          ${mono('a ton of steel rails', {x: 0, y: 0, size: 26, color: C.teal, ls: 4})}
          <div style="position:absolute;left:0;top:50px;font-family:Abril;font-size:190px;line-height:1;color:${C.cream}">$${price}</div>
          <div style="position:absolute;left:0;top:300px;width:${(740 * price / 170).toFixed(1)}px;height:38px;background:${C.teal};box-shadow:0 0 0 4px ${C.ink}"></div>
          ${mono('1868', {x: 0, y: 352, size: 22})}${mono(k > 0.99 ? '1898' : '', {x: 0, y: 392, size: 22, color: C.teal})}</div>`) +
        (fin(T, w('Same')) > 0 ? slideUp(fin(T, w('Same')), tape('SAME STEEL.', {x: 130, y: 760, size: 70, rot: -2, seed: 33})) : '') +
        (fin(T, w('onetenth')) > 0 ? slideUp(fin(T, w('onetenth')), tape('ONE-TENTH THE PRICE.', {x: 560, y: 860, size: 70, rot: -1.5, seed: 35})) : '');
    }},
    // 5. "The steel frame inside every tall building you've ever been in starts right here."
    {a: cut.frame, b: cut.inv, draw: (T) => backdrop(T, cut.frame, cut.inv, 0.05) +
      deskCut('desk/steel_frame_1904.png', {x: 700, y: 80, w: 620, rot: 1.5, o: fin(T, cut.frame, 0.6), T}) + `</div>` +
      op(fin(T, cut.frame + 0.3) * 0.9, mono('a steel frame going up, new york, 1904', {x: 700, y: 1000, size: 20})) +
      op(fin(T, w('starts')), pen('it starts right here', {x: 1340, y: 640, size: 54, rot: -5, color: C.orange}))},
    // 6. "Inventions came in a flood: the telephone, the typewriter, electric light." Then Edison, as his real photograph.
    {a: cut.inv, b: cut.didnt, draw: (T) => {
      const gone = fin(T, w('Thomas') - 0.2, 0.5);
      return backdrop(T, cut.inv, cut.didnt) +
        op(1 - gone, deskProp('p03_telephone_1876', {x: 160, y: 320, w: 470, rot: -3, o: fin(T, w('telephone'), 0.45), T}) +
          deskProp('p03_typewriter', {x: 760, y: 200, w: 420, rot: 2, o: fin(T, w('typewriter'), 0.45), T}) +
          deskProp('p03_edison_bulb', {x: 1340, y: 250, w: 340, rot: -2, o: fin(T, w('electric', 1), 0.45), T})) +
        deskCut('desk/edison_c1878_bust.png', {x: 640, y: 170, w: 640, rot: -1.5, o: gone, T, caption: 'thomas edison, about 1878', cx: 150}) + `</div>` +
        op(fin(T, w('flood')) * (1 - gone), tape('A FLOOD OF INVENTIONS', {x: 600, y: 860, size: 60, rot: -2, seed: 37})) +
        op(fin(T, w('invented')), pen('invented the light bulb?', {x: 1250, y: 800, size: 50, rot: -4, color: C.orange}));
    }},
    // 7. "He didn't. Other inventors got there first." Joseph Swan's lamp of 1878, one of several.
    {a: cut.didnt, b: cut.system, draw: (T) => backdrop(T, cut.didnt, cut.system) +
      deskCut('desk/edison_c1878_bust.png', {x: 120, y: 230, w: 520, rot: -1.5, o: 1, T}) +
      deskCut('desk/swan_lamp_1878.png', {x: 1160, y: 90, w: 380, rot: 2, o: fin(T, w('Other'), 0.5), T}) + `</div>` +
      op(fin(T, w('He')), pen("he didn't.", {x: 640, y: 380, size: 70, rot: -5, color: C.orange})) +
      op(fin(T, w('Other')), mono('joseph swan&rsquo;s lamp, england, 1878', {x: 1100, y: 940, size: 20}) + mono('engraving: wellcome collection', {x: 1100, y: 972, size: 16, color: '#9a958c'}))},
    // 8. "What Edison made was a bulb that lasted, plus the whole system": bulb, power plant, wires, meter, tied together in teal.
    {a: cut.system, b: cut.bill, draw: (T) => {
      const lit = fin(T, w('lasted'), 0.5), wires = clamp01((T - w('wires')) / 1.4);
      return backdrop(T, cut.system, cut.bill, 0.02) +
        deskCut('desk/pearl_street_dynamos.png', {x: 640, y: 120, w: 760, rot: -1, o: fin(T, w('power'), 0.6), T}) +
        op(1 - lit, deskProp('p03_edison_bulb', {x: 150, y: 300, w: 300, rot: -2, o: fin(T, cut.system, 0.5), T})) +
        op(lit, deskProp('p03_edison_bulb_lit', {x: 150, y: 300, w: 300, rot: -2, o: 1, T})) +
        deskProp('p03_electric_meter', {x: 1460, y: 560, w: 360, rot: 3, o: fin(T, w('meter'), 0.5), T}) + `</div>` +
        (lit > 0 ? `<div style="position:absolute;left:300px;top:420px;width:10px;height:10px;box-shadow:0 0 160px 90px rgba(255,190,110,${(0.22 * lit).toFixed(3)})"></div>` : '') +
        svg(drawLine([[1000, 560], [1000, 820], [330, 820], [300, 700]], wires) + drawLine([[1000, 820], [1640, 820], [1640, 780]], clamp01((T - w('meter')) / 0.8))) +
        op(fin(T, w('lasted')), pen('a bulb that <u>lasted</u>', {x: 90, y: 180, size: 50, rot: -4, color: C.orange})) +
        op(fin(T, w('power')), pen('a power plant', {x: 1020, y: 40, size: 46, rot: -3, color: C.orange})) +
        op(fin(T, w('wires')), pen('wires under the street', {x: 520, y: 860, size: 44, rot: -2, color: C.orange})) +
        op(fin(T, w('meter')), pen('a meter', {x: 1500, y: 470, size: 46, rot: -4, color: C.orange})) +
        op(fin(T, w('system')), mono('the system', {x: 860, y: 990, size: 28, color: C.teal, ls: 6}));
    }},
    // 9. "So the next time someone complains about the electric bill... that's Edison too."
    {a: cut.bill, b: cut.michael, draw: (T) => backdrop(T, cut.bill, cut.michael, 0.05) +
      deskProp('p03_electric_meter', {x: 640, y: 160, w: 640, rot: 2, o: 1, T}) + `</div>` +
      op(fin(T, w('bill')), pen('the electric bill...', {x: 1250, y: 330, size: 56, rot: -4, color: C.orange})) +
      op(fin(T, w("that's")), pen("that's edison too", {x: 1250, y: 450, size: 56, rot: -4, color: C.orange}))},
    // 10. "New machines meant new factories. And factories needed people. People like Michael." Michael on his street.
    {a: cut.michael, b: dur, draw: (T) => renderStreet({t: 1 + (T - cut.michael)}) +
      op(fin(T, w('Michael')), pen('people like michael', {x: 1000, y: 360, size: 54, rot: -4, color: C.orange}))},
  ];
  return {dur, shots, fadeOut: 0.5};
};
