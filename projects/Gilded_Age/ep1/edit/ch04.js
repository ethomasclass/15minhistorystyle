// Chapter 4, "The Refinery" (3:14 to 4:02): Havemeyers & Elder, the sugar's path, Michael's floor, the men at the gate.
EDITS.ch04 = () => {
  const ch = 'ch04_the_refinery', w = (word, n) => wordAt(ch, word, n), dur = window.WORDS[ch].duration;
  const cut = {
    bowls: w('factory') - 0.35, men: w('About', 1) - 0.25, tour: w('pumped') - 0.8, floor: w("Michael's") - 0.25,
    gate: w('And', 4) - 0.25, owners: w('owned') - 0.6, two: w('And', 5) - 0.25,
  };
  const backdrop = (T, a, b, z = 0.035) => `<div style="position:absolute;inset:0;transform:scale(${(1 + z * ease((T - a) / (b - a))).toFixed(4)})">${desk()}`;
  // The refinery tour (lookdev/refinery.js, 17 s) re-timed to the words: pumped to the top, down floor by floor, bone char, pans, spun dry.
  const rt = remap([[cut.tour, 4.6], [w('pumped'), 5.3], [w('top'), 5.7], [w('floor', 1), 7.0], [w('Filtered'), 8.5], [w('Yes'), 9.3],
    [w('Boiled'), 10.2], [w('spun'), 11.0], [cut.floor, 11.5], [cut.gate, 13.3]]);

  /** Outside the refinery gate at dawn: a brick wall, an iron gate, about fifty men waiting for work. */
  function gateScene(T) {
    const G = 930, z = 1 + 0.06 * ease((T - cut.gate) / (cut.owners - cut.gate)), s = [];
    s.push(`<defs>${MAT_DEFS}<linearGradient id="gsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22383A"/><stop offset="0.7" stop-color="#5E7C76"/><stop offset="1" stop-color="#A9B9AE"/></linearGradient></defs>`);
    s.push(`<rect width="1920" height="1080" fill="url(#gsky)"/>`);
    // the refinery behind the wall: a tall block, its windows, a chimney and its smoke
    s.push(`<rect x="260" y="150" width="1260" height="560" fill="#14211F"/><path d="M260,150 L420,90 L1360,90 L1520,150 Z" fill="#101B1A"/>`);
    for (let r = 0; r < 6; r++) for (let c = 0; c < 18; c++) s.push(`<rect x="${300 + c * 68}" y="${190 + r * 80}" width="34" height="48" fill="#2B4441" opacity="${(0.5 + 0.5 * ((c * 7 + r * 3) % 5 === 0)).toFixed(2)}"/>`);
    s.push(`<rect x="1600" y="40" width="70" height="700" fill="#101B1A"/>` + MAT.smoke(1635, 40, T, {col: '6F8D87', k: 1.4, n: 8, seed: 41, rise: 260}));
    // the wall and the gate
    s.push(MAT.brick(0, 560, 1920, G - 560, {base: '#6A5A48', seed: 77, vary: 0.3, soot: 'bottom'}));
    s.push(`<rect x="760" y="600" width="400" height="${G - 600}" fill="#0E1615"/>`);
    s.push(MAT.brick(700, 470, 70, G - 470, {base: '#76644F', seed: 78}) + MAT.brick(1150, 470, 70, G - 470, {base: '#76644F', seed: 79}));
    s.push(`<rect x="690" y="455" width="90" height="20" fill="#1A1714"/><rect x="1140" y="455" width="90" height="20" fill="#1A1714"/>`);
    for (let x = 776; x < 1150; x += 22) s.push(`<rect x="${x}" y="610" width="6" height="${G - 610}" fill="#080B0B"/><path d="M${x - 4},612 L${x + 3},592 L${x + 10},612 Z" fill="#080B0B"/>`);
    s.push(`<rect x="770" y="660" width="380" height="8" fill="#080B0B"/><rect x="770" y="${G - 60}" width="380" height="8" fill="#080B0B"/>`);
    s.push(`<rect x="0" y="${G}" width="1920" height="150" fill="#0D0C09"/>` + MAT.ground(0, 1920, G, {seed: 62}));
    // the men: three loose rows facing the gate, shifting their weight
    const r = rng(505), men = [];
    for (let row = 0; row < 3; row++) for (let i = 0; i < 17; i++) {
      const x = 80 + i * 108 + (r() - 0.5) * 60 + row * 30, y = G + 20 + row * 55, h = 230 + row * 45 + (r() - 0.5) * 30;
      const ph = r() * TAU, d = x < 960 ? 1 : -1;
      men.push({row, f: figure({x, y, h, d, kind: 'man', hat: ['cap', 'cap', 'bowler'][Math.floor(r() * 3)], coat: 'jacket', fill: row === 2 ? '#0A0908' : row === 1 ? '#15130F' : '#23201B', rim: {c: '#E8D9B8', a: 0.5 + 0.15 * row, dx: d * -0.006, dy: -0.005},
        an: {tilt: 3 * Math.sin(T * 0.8 + ph), bob: 0.004 * Math.sin(T * 1.3 + ph), lean: 2 * Math.sin(T * 0.5 + ph)}})});
    }
    s.push(men.map((m) => m.f).join(''));
    return `<div style="position:absolute;inset:0;transform:scale(${z.toFixed(4)});transform-origin:960px 700px">${svg(s.join(''))}</div>`;
  }

  const shots = [
    // 1. The refinery, cut through: "Michael works at the Havemeyers and Elder sugar refinery in Brooklyn"
    {a: 0, b: cut.bowls, draw: (T) => renderRefinery(T * 0.28)},
    // 2. "turns raw brown sugar into the white stuff in your kitchen"
    {a: cut.bowls, b: cut.men, draw: (T) => backdrop(T, cut.bowls, cut.men) +
      deskProp('p04_sugar_two_bowls', {x: 420, y: 330, w: 1080, rot: -1, o: fin(T, cut.bowls + 0.1, 0.5), T}) + `</div>` +
      op(fin(T, w('raw')), pen('raw brown sugar', {x: 430, y: 760, size: 52, rot: -3, color: C.orange})) +
      op(fin(T, w('white')), pen('the white stuff', {x: 1080, y: 760, size: 52, rot: -3, color: C.orange}))},
    // 3. "About a thousand men. About 5,000 barrels a day." The waterfront (photo 1916) and a barrel.
    {a: cut.men, b: cut.tour, draw: (T) => backdrop(T, cut.men, cut.tour) +
      deskCut('desk/refinery_waterfront_1916.png', {x: 100, y: 120, w: 1720, rot: -0.8, o: fin(T, cut.men, 0.5), T}) +
      deskProp('p04_sugar_barrel', {x: 1420, y: 520, w: 340, rot: 2, o: fin(T, w('barrels'), 0.45), T}) + `</div>` +
      op(fin(T, cut.men + 0.3) * 0.9, mono('the refinery&rsquo;s waterfront, williamsburg (photo 1916)', {x: 110, y: 640, size: 20})) +
      op(fin(T, w('thousand')), pen('about 1,000 men', {x: 220, y: 760, size: 58, rot: -4, color: C.orange})) +
      op(fin(T, w('5000')), pen('about 5,000 barrels a day', {x: 640, y: 880, size: 58, rot: -3, color: C.orange}))},
    // 4. The sugar's path through the building, with "Yes. Bones." on the char.
    {a: cut.tour, b: cut.floor, draw: (T) => {
      const bo = fin(T, w('animal'), 0.4) * fout(T, w('Boiled') - 0.2, 0.4);
      return renderRefinery(rt(T)) +
        (bo > 0 ? op(bo, `<div style="position:absolute;inset:0;background:rgba(13,12,9,.35)"></div>` +
          deskProp('p04_bone_char', {x: 1120, y: 300, w: 640, rot: -4, o: bo, T}) +
          pen('yes. bones.', {x: 1240, y: 760, size: 64, rot: -5, color: C.orange})) : '');
    }},
    // 5. Michael's floor: "one of the hottest. Ten hours or more. No work, no pay."
    {a: cut.floor, b: cut.gate, draw: (T) => renderRefinery(rt(T)) +
      op(fin(T, w('No', 1)), pen('no work, no pay', {x: 1060, y: 470, size: 46, rot: -3, color: C.orange}))},
    // 6. MICHAEL: "there's fifty men at that gate who'd take my place by dinner."
    {a: cut.gate, b: cut.owners, draw: (T) => gateScene(T) +
      op(fin(T, w('fifty')), pen('fifty men at the gate', {x: 1200, y: 300, size: 56, rot: -4, color: C.orange})) +
      stamp('outside the refinery gate &middot; morning', fin(T, cut.gate + 0.3))},
    // 7. "The men who owned places like this were becoming some of the richest people in history."
    {a: cut.owners, b: cut.two, draw: (T) => backdrop(T, cut.owners, cut.two) +
      deskCut('desk/refinery_waterfront_1916.png', {x: 100, y: 260, w: 1720, rot: -0.8, o: 1, T}) +
      deskProp('p08_top_hat', {x: 760, y: 70, w: 420, rot: -6, o: fin(T, w('owned'), 0.5), T}) + `</div>` +
      op(fin(T, w('richest', 1)), pen('some of the richest people in history', {x: 380, y: 840, size: 54, rot: -3, color: C.orange}))},
    // 8. "And the two richest of all started out poorer than Michael." (the two boys again)
    {a: cut.two, b: dur, draw: (T) => backdrop(T, cut.two, dur) +
      deskCut('desk/carnegie_16_with_tom_bust.png', {x: 150, y: 250, w: 760, rot: -2, o: fin(T, w('two'), 0.6), T}) +
      deskCut('desk/rockefeller_18_bust.png', {x: 1030, y: 230, w: 760, rot: 1.5, o: fin(T, w('two') + 0.3, 0.6), T}) + `</div>` +
      op(fin(T, w('poorer')), pen('poorer than michael', {x: 700, y: 900, size: 58, rot: -3, color: C.orange}))},
  ];
  return {dur, shots, fadeOut: 0.5};
};
