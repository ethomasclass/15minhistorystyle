// Chapter 9, "Gold or Gilt" (10:41 to 12:32): the wire fraud, the bridge held, the answer, gold vs gilt, Episode 2, thanks.
EDITS.ch09 = () => {
  const ch = 'ch09_gold_or_gilt', w = (word, n) => wordAt(ch, word, n), dur = window.WORDS[ch].duration;
  const c = {
    cables: w('Each') - 0.3, trick: w('The', 4) - 0.3, caught: w('They') - 0.3, fix: w('By') - 0.3, held: w('built') - 0.8,
    recap: w('So', 3) - 0.3, money: w('who', 1) - 0.4, home: w('Michael', 1) - 0.3, outside: w('From') - 0.3, gold: w('Gold', 2) - 0.3,
    q: w('Who', 3) - 0.3, next: w('Next') - 0.3, sister: w('inside', 2) - 0.3, thanks: w('Thanks') - 0.3,
  };
  const backdrop = (T, a, b, z = 0.035) => `<div style="position:absolute;inset:0;transform:scale(${(1 + z * ease((T - a) / (b - a))).toFixed(4)})">${desk()}`;
  const xw = B.tB - 330, saddle = B.top + 8, mid = (B.tM + B.tB) / 2;
  const CABLE = {x: xw + 30, y: (B.deck - 14) - ((B.deck - 14) - saddle) * ((xw - mid) / (B.span / 2)) ** 2};

  /** The swap, as a little diagram: the wire works and its test, another building, the bridge; the wagon, its coils, its certificate. */
  function fraud(T) {
    const F = [300, 640], O = [960, 380], Bd = [1620, 640], J = [960, 640];
    const lerp = (p, q, u) => [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u];
    const tOn = w('On'), tStop = w('stopped'), tBld = w('building'), tSame = w('Same', 1), tAt = w('wagon', 2) + 1.6;
    let pos;
    if (T < tOn) pos = F; else if (T < tStop) pos = lerp(F, J, ease((T - tOn) / (tStop - tOn)));
    else if (T < tBld) pos = lerp(J, O, ease((T - tStop) / (tBld - tStop))); else if (T < tSame) pos = O;
    else if (T < tSame + 0.7) pos = lerp(O, J, ease((T - tSame) / 0.7)); else pos = lerp(J, Bd, ease(clamp01((T - tSame - 0.7) / (tAt - tSame - 0.7))));
    const goodOff = clamp01((T - w('good', 2)) / 0.8), badOn = clamp01((T - w('failed')) / 0.8), goBack = clamp01((T - w('back', 2)) / 1.3);
    const wagon = (x, y) => {
      const coils = [-50, 0, 50].map((dx, i) => {
        const g = goodOff < 1 ? `<circle cx="${x + dx + goodOff * 0}" cy="${y - 52 - goodOff * 60}" r="22" fill="none" stroke="${C.teal}" stroke-width="9" opacity="${(1 - goodOff).toFixed(2)}"/>` : '';
        const b = badOn > 0 ? `<circle cx="${x + dx}" cy="${y - 52}" r="22" fill="none" stroke="#B5463D" stroke-width="9" opacity="${badOn.toFixed(2)}"/>` : '';
        return g + b; }).join('');
      const cert = T > w('certificate', 1) ? `<g transform="translate(${x + 70},${y - 120}) rotate(-6)"><rect width="74" height="52" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>
          <line x1="10" y1="16" x2="64" y2="16" stroke="#777" stroke-width="3"/><line x1="10" y1="28" x2="54" y2="28" stroke="#777" stroke-width="3"/><circle cx="56" cy="40" r="7" fill="#B5463D"/></g>` : '';
      return `<g>${coils}<rect x="${x - 90}" y="${y - 30}" width="180" height="30" fill="#6B4A2B" stroke="${C.ink}" stroke-width="4"/>
        <circle cx="${x - 60}" cy="${y + 4}" r="20" fill="${C.ink}" stroke="#8A6A45" stroke-width="5"/><circle cx="${x + 60}" cy="${y + 4}" r="20" fill="${C.ink}" stroke="#8A6A45" stroke-width="5"/>${cert}</g>`;
    };
    const bldg = ([x, y], label, sub) => `<rect x="${x - 110}" y="${y - 140}" width="220" height="140" fill="#2A3B39" stroke="${C.cream}" stroke-width="3"/>
      <path d="M${x - 125},${y - 140} L${x},${y - 200} L${x + 125},${y - 140} Z" fill="#1F2D2C" stroke="${C.cream}" stroke-width="3"/>
      <text x="${x}" y="${y + 50}" font-family="Mono" font-size="26" letter-spacing="3" fill="${C.cream}" text-anchor="middle">${label}</text>
      ${sub ? `<text x="${x}" y="${y + 84}" font-family="Mono" font-size="20" letter-spacing="2" fill="${C.teal}" text-anchor="middle">${sub}</text>` : ''}`;
    const backDots = goBack > 0 ? Array.from({length: 14}, (_, i) => { const u = i / 13; if (u > goBack) return '';
      const [x, y] = lerp(O, [F[0] + 60, F[1] - 140], u); return `<circle cx="${f1(x)}" cy="${f1(y - 40 * Math.sin(Math.PI * u))}" r="7" fill="${C.teal}"/>`; }).join('') : '';
    const bridge = `<g transform="translate(${Bd[0]},${Bd[1]})" fill="none" stroke="${C.cream}" stroke-width="4"><rect x="-30" y="-200" width="60" height="200"/>
      <path d="M-170,-10 Q-100,-150 -30,-190 M30,-190 Q100,-150 170,-10"/><line x1="-200" y1="-10" x2="200" y2="-10"/></g>
      <text x="${Bd[0]}" y="${Bd[1] + 50}" font-family="Mono" font-size="26" letter-spacing="3" fill="${C.cream}" text-anchor="middle">THE BRIDGE</text>`;
    return desk() + svg(`<path d="M${F[0]},${F[1] + 26} L${Bd[0] - 200},${F[1] + 26} M${J[0]},${F[1] + 26} L${O[0]},${O[1] + 26}" stroke="#5A5246" stroke-width="10" stroke-dasharray="22 14"/>` +
        bldg(F, 'THE WIRE WORKS', T > w('passed') ? 'TESTED &#10003;' : '') + bldg(O, 'ANOTHER BUILDING', '') + bridge + backDots + wagon(pos[0], pos[1] + 26 - 30)) +
      op(fin(T, w('around')), pen('the trick', {x: 120, y: 120, size: 60, rot: -4, color: C.orange})) +
      op(fin(T, w('good', 2)), pen('good wire off...', {x: 1080, y: 160, size: 46, rot: -4, color: C.orange})) +
      op(fin(T, w('failed')), pen('...failed wire on', {x: 1080, y: 240, size: 46, rot: -4, color: C.orange})) +
      op(fin(T, w('Same', 1)), pen('same wagon. same certificate.', {x: 1060, y: 820, size: 50, rot: -3, color: C.orange})) +
      op(fin(T, w('back', 2)), pen('the good wire, tested again', {x: 220, y: 820, size: 46, rot: -3, color: C.orange}));
  }

  /** Fifth Avenue at night: a mansion lit up floor by floor, and below the street, the servants' door. Michael's sister (coral,
   *  a maid's cap and apron) walks along the railing and down the areaway steps. Reused in Episode 2. */
  function mansion(T) {
    const G = 860, a0 = c.sister, s = [], z = 1 + 0.08 * ease((T - a0) / (c.thanks - a0));
    s.push(`<defs>${MAT_DEFS}<linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E1A1C"/><stop offset="1" stop-color="#2C4442"/></linearGradient>
      <radialGradient id="glw"><stop offset="0" stop-color="#FFD9A0" stop-opacity=".55"/><stop offset="1" stop-color="#FFD9A0" stop-opacity="0"/></radialGradient></defs>`);
    s.push(`<rect width="1920" height="1080" fill="url(#nsky)"/>`);
    // the mansion: stone facade, cornices, tall lit windows, a grand front door up a stoop
    s.push(MAT.stone(220, 120, 1300, G - 120, {base: '#3A4542', seed: 501, bh: 26}));
    for (const y of [120, 360, 600]) s.push(`<rect x="200" y="${y - 18}" width="1340" height="22" fill="#232B29"/>`);
    for (let fl = 0; fl < 3; fl++) for (let k = 0; k < 6; k++) { const x = 290 + k * 200, y = 170 + fl * 240, lit = (k * 3 + fl) % 4 !== 1;
      s.push(`<rect x="${x - 16}" y="${y - 16}" width="112" height="182" fill="#1B2321"/><rect x="${x}" y="${y}" width="80" height="150" fill="${lit ? '#E9C57A' : '#16201E'}" opacity="${lit ? (0.85 + 0.05 * Math.sin(T * 3 + k)).toFixed(2) : 1}"/>`);
      if (lit) s.push(`<rect x="${x + 38}" y="${y}" width="4" height="150" fill="#3A2E1C"/><rect x="${x}" y="${y + 72}" width="80" height="4" fill="#3A2E1C"/><ellipse cx="${x + 40}" cy="${y + 75}" rx="120" ry="120" fill="url(#glw)"/>`); }
    s.push(`<rect x="760" y="${G - 220}" width="220" height="220" fill="#151B1A"/><path d="M760,${G - 220} Q870,${G - 300} 980,${G - 220} Z" fill="#232B29"/><rect x="780" y="${G - 200}" width="180" height="190" fill="#2A1E12"/>`);
    for (let k = 0; k < 4; k++) s.push(`<rect x="${700 - k * 22}" y="${G + k * 18}" width="${340 + k * 44}" height="18" fill="#2A3331"/>`);
    // the sidewalk, the iron railing, the areaway below street level with the servants' door
    s.push(`<rect x="0" y="${G + 70}" width="1920" height="200" fill="#0D0C09"/>`);
    s.push(`<rect x="1240" y="${G - 40}" width="300" height="110" fill="#0A0E0D"/><rect x="1440" y="${G - 34}" width="70" height="104" fill="#3C2A16"/><rect x="1452" y="${G - 22}" width="46" height="36" fill="#E9C57A" opacity=".8"/>`);
    for (let x = 1100; x < 1580; x += 18) s.push(`<rect x="${x}" y="${G - 10}" width="4" height="80" fill="#050707"/>`);
    s.push(`<rect x="1100" y="${G - 14}" width="480" height="6" fill="#050707"/>`);
    s.push(`<rect x="1640" y="${G - 300}" width="10" height="370" fill="#050707"/><path d="M1620,${G - 330} L1670,${G - 330} L1660,${G - 290} L1630,${G - 290} Z" fill="#E9C57A"/><ellipse cx="1645" cy="${G - 300}" rx="180" ry="180" fill="url(#glw)"/>`);
    // the sister walks along the sidewalk to the areaway gate and down
    const k = clamp01((T - a0) / (w('maid') - a0)), x = 300 + 1080 * ease(k), down = clamp01((x - 1240) / 160), y = G + 70 + 110 * down * 0.0;
    s.push(figure(cast('sister', {x, y, h: 330, d: 1, an: {...walkAn(walkPhase(x - 300, 330 * 0.88)), tilt: -4}, rim: {c: '#FFE3B0', a: 0.5, dx: -0.006, dy: -0.004}})));
    return `<div style="position:absolute;inset:0;transform:scale(${z.toFixed(4)});transform-origin:1300px 760px">${svg(s.join(''))}</div>` +
      op(fin(T, a0 + 0.3), mono('fifth avenue, new york &middot; night', {x: 44, y: 1020, size: 22, extra: 'background:rgba(13,12,9,.7);padding:6px 12px'})) +
      slideUp(fin(T, w('Next')), tape('NEXT TIME', {x: 120, y: 40, size: 80, rot: -2, seed: 127})) +
      op(fin(T, w('sister')), pen("michael's sister", {x: 1200, y: 150, size: 54, rot: -4, color: C.orange})) +
      op(fin(T, w('maid')), pen('...as a maid', {x: 1300, y: 250, size: 58, rot: -5, color: C.orange}));
  }

  const shots = [
    // 1. "So, back to the bridge. And that bad wire." Night, the cable, the x-ray.
    {a: 0, b: c.cables, draw: (T) => renderScene({look: 'night', t: T + 4, cx: -60, zoom: 1.4 + 0.8 * ease(T / c.cables), fx: CABLE.x, fy: CABLE.y}) +
      svg(cableXray({cx: 640, cy: 560, r: 280, open: fin(T, w('bad', 1), 0.6), bad: 1}))},
    // 2. "Each of its four main cables is more than five thousand steel wires ... a strength test at the factory"
    {a: c.cables, b: c.trick, draw: (T) => backdrop(T, c.cables, c.trick) +
      deskCut('desk/cable_workers_1883.png', {x: 140, y: 80, w: 820, rot: -2, o: fin(T, c.cables + 0.1, 0.6), T}) +
      deskProp('p09_cable_section', {x: 1100, y: 220, w: 600, rot: 3, o: fin(T, w('thousand'), 0.5), T}) + `</div>` +
      op(fin(T, c.cables + 0.4) * 0.9, mono('workers on the cables, frank leslie&rsquo;s, 1883', {x: 150, y: 1010, size: 20})) +
      op(fin(T, w('four')), pen('4 main cables', {x: 1150, y: 120, size: 52, rot: -4, color: C.orange})) +
      op(fin(T, w('thousand')), pen('5,000+ wires in each', {x: 1120, y: 780, size: 50, rot: -3, color: C.orange})) +
      op(fin(T, w('strength')), pen('every load tested first', {x: 1120, y: 880, size: 46, rot: -3, color: C.orange}))},
    // 3. The trick, step by step.
    {a: c.trick, b: c.caught, draw: (T) => fraud(T)},
    // 4. "They caught on when someone noticed the pile of rejected wire... never got any bigger."
    {a: c.caught, b: c.fix, draw: (T) => {
      const day = 1 + Math.floor(Math.max(0, T - w('pile')) * 3);
      return backdrop(T, c.caught, c.fix) + deskProp('p09_rejected_wire_pile', {x: 400, y: 340, w: 900, rot: -2, o: fin(T, c.caught + 0.1, 0.5), T}) + `</div>` +
        op(fin(T, w('pile')), mono(`day ${day}`, {x: 1420, y: 260, size: 54, color: C.cream})) +
        op(fin(T, w('rejected')), mono('rejected wire', {x: 1420, y: 340, size: 26, color: C.teal})) +
        op(fin(T, w('never')), pen('never got any bigger', {x: 760, y: 820, size: 60, rot: -4, color: C.orange}));
    }},
    // 5. "tons of bad wire were in the cables. So the engineers added 150 extra wires to each one, and made the supplier pay."
    {a: c.fix, b: c.held, draw: (T) => desk() + svg(cableXray({cx: 760, cy: 540, r: 360, open: 1, bad: 1, extra: clamp01((T - w('150')) / 1.6)})) +
      op(fin(T, w('tons')), pen('tons of bad wire,<br>already inside', {x: 1220, y: 260, size: 46, rot: -4, color: C.orange, w: 620})) +
      op(fin(T, w('150')), pen('+150 good wires<br>per cable', {x: 1220, y: 470, size: 52, w: 620, rot: -4, color: C.orange})) +
      op(fin(T, w('pay', 1)), pen('and the supplier<br>paid for it', {x: 1220, y: 680, size: 46, w: 620, rot: -3, color: C.orange})) +
      op(0.85, mono('schematic', {x: 680, y: 940, size: 20, color: '#9a958c'}))},
    // 6. "The bridge had been built six times stronger than it needed to be. Even with the bad wire, it held."
    {a: c.held, b: c.recap, draw: (T) => renderScene({look: 'dusk', t: T, cx: 200 - 260 * ease((T - c.held) / (c.recap - c.held))}) +
      op(fin(T, w('six')), pen('built 6 times stronger than it needed to be', {x: 300, y: 330, size: 48, rot: -3, color: C.orange})) +
      (fin(T, w('held')) > 0 ? slideUp(fin(T, w('held')), tape('IT HELD.', {x: 1240, y: 140, size: 110, rot: -3, seed: 121})) : '') +
      op(fin(T, w('People')), pen('people walk across it every day', {x: 980, y: 440, size: 44, rot: -3, color: C.orange}))},
    // 7. The answer: machines made things cheap; two poor boys; every step, every rival; a government that stood back.
    {a: c.recap, b: c.money, draw: (T) => backdrop(T, c.recap, c.money, 0.02) +
      deskProp('p03_steel_rail', {x: 90, y: 170, w: 540, rot: -3, o: fin(T, w('machines'), 0.5), T}) +
      deskCut('desk/carnegie_16_with_tom_bust.png', {x: 600, y: 420, w: 560, rot: -2, o: fin(T, w('Two', 1), 0.5), T}) +
      deskCut('desk/rockefeller_18_bust.png', {x: 1180, y: 400, w: 520, rot: 2, o: fin(T, w('Two', 1) + 0.3, 0.5), T}) +
      deskProp('p08_top_hat', {x: 1480, y: 90, w: 330, rot: -5, o: fin(T, w('government'), 0.5), T}) + `</div>` +
      op(fin(T, w('how')), tape('HOW DID AMERICA GET SO RICH, SO FAST?', {x: 300, y: 40, size: 50, rot: -1.5, seed: 123})) +
      op(fin(T, w('cheap', 1)), pen('machines made things cheap', {x: 110, y: 520, size: 40, rot: -3, color: C.orange})) +
      op(fin(T, w('owned')), pen('every step', {x: 700, y: 990, size: 46, rot: -3, color: C.orange})) +
      op(fin(T, w('bought')), pen('every rival', {x: 1300, y: 990, size: 46, rot: -3, color: C.orange})) +
      op(fin(T, w('stood')), pen('stood back', {x: 1500, y: 330, size: 46, rot: -4, color: C.orange}))},
    // 8. "And who got the money? Carnegie and Rockefeller became two of the richest people who ever lived."
    {a: c.money, b: c.home, draw: (T) => backdrop(T, c.money, c.home) +
      deskCut('desk/carnegie_c1878_bust.png', {x: 230, y: 330, w: 640, rot: -2, o: fin(T, w('Carnegie'), 0.5), T}) +
      deskCut('desk/rockefeller_1880_bust.png', {x: 1060, y: 200, w: 600, rot: 2, o: fin(T, w('Rockefeller'), 0.5), T}) + `</div>` +
      op(fin(T, w('who', 1)), tape('WHO GOT THE MONEY?', {x: 520, y: 60, size: 80, rot: -2, seed: 125})) +
      op(fin(T, w('richest')), pen('two of the richest people who ever lived', {x: 300, y: 960, size: 48, rot: -2, color: C.orange}))},
    // 9. "Michael got a day's pay, and went home to a kerosene lamp." The Kellys' kitchen.
    {a: c.home, b: c.outside, draw: (T) => renderCutaway({t: 30 + T, ...cutCam(30)}) +
      op(fin(T, w('pay', 2)), pen("a day's pay", {x: 1240, y: 300, size: 52, rot: -4, color: C.orange})) +
      op(fin(T, w('lamp')), pen('...and a kerosene lamp', {x: 1240, y: 400, size: 46, rot: -4, color: C.orange}))},
    // 10. "From the outside, the Gilded Age looked like solid gold. So did the bridge. Inside, some of it was cheap wire, holding on."
    {a: c.outside, b: c.gold, draw: (T) => {
      const ins = fin(T, w('Inside', 1), 0.6);
      return renderScene({look: 'night', t: T, cx: -60, zoom: 1 + 1.2 * ease(clamp01((T - w('Inside', 1) + 0.4) / 1.2)), fx: CABLE.x, fy: CABLE.y}) +
        svg(cableXray({cx: 640, cy: 560, r: 280, open: ins, bad: 1, extra: 1})) +
        op(fin(T, w('solid')) * (1 - ins), pen('it looked like solid gold', {x: 260, y: 300, size: 54, rot: -3, color: C.orange})) +
        op(fin(T, w('cheap', 2)), pen('cheap wire, holding on', {x: 1000, y: 820, size: 54, rot: -3, color: C.orange}));
    }},
    // 11. "Gold is the real thing. Gilt is the thin coat that only looks like it."
    {a: c.gold, b: c.q, draw: (T) => {
      const g = fin(T, w('Gilt', 1), 0.6);
      return backdrop(T, c.gold, c.q) + deskProp('p02_gold_bar_solid', {x: 220, y: 380, w: 660, rot: -3, o: fin(T, c.gold + 0.1, 0.5), T}) +
        deskProp('p02_gold_bar_peeled', {x: 1040, y: 340, w: 660, rot: 3, o: g, T}) + `</div>` +
        op(fin(T, w('Gold', 2)), pen('gold: the real thing', {x: 260, y: 780, size: 54, rot: -3, color: C.orange})) +
        op(g, pen('gilt: a thin coat that only looks like it', {x: 980, y: 820, size: 46, rot: -3, color: C.orange, w: 760}));
    }},
    // 12. The series question: "Who got the gold... and who only got the gilt?"
    {a: c.q, b: c.next, draw: (T) => renderScene({look: 'night', t: T, cx: 0}) + `<div style="position:absolute;inset:0;background:rgba(13,12,9,.72)"></div>` +
      slideUp(fin(T, w('Who', 3)), `<div style="position:absolute;left:0;top:300px;width:1920px;text-align:center;font-family:Abril;font-size:110px;line-height:1.05;color:${C.cream}">WHO GOT THE
        <span style="background:linear-gradient(180deg,#F6E7B0 0%,#D9AE4E 45%,#9C7424 55%,#E9C56E 100%);-webkit-background-clip:text;color:transparent">GOLD</span>...</div>`) +
      (fin(T, w('gilt', 2) - 0.6) > 0 ? slideUp(fin(T, w('gilt', 2) - 0.6), `<div style="position:absolute;left:0;top:460px;width:1920px;text-align:center;font-family:Abril;font-size:80px;color:${C.cream}">AND WHO ONLY GOT THE</div>` +
        tape('GILT?', {x: 790, y: 580, size: 150, rot: -3, seed: 41})) : '')},
    // 13a. "Next time:" the mansions on Fifth Avenue (photo, about 1885).
    {a: c.next, b: c.sister, draw: (T) => {
      const room = fin(T, w('inside', 2), 0.6);
      return backdrop(T, c.next, c.thanks, 0.05) + deskCut('desk/vanderbilt_mansions.png', {x: 200, y: 120, w: 1100, rot: -2, o: fin(T, c.next + 0.1, 0.6), T}) +
        deskCut('desk/vanderbilt_drawing_room_1883.png', {x: 900, y: 320, w: 860, rot: 2.5, o: room, T}) + `</div>` +
        slideUp(fin(T, w('Next')), tape('NEXT TIME', {x: 120, y: 40, size: 80, rot: -2, seed: 127})) +
        op(fin(T, c.next + 0.4) * 0.9, mono('the vanderbilt mansions, fifth avenue (about 1885)', {x: 210, y: 960, size: 20})) +
        op(fin(T, w('sister')), pen("michael's sister", {x: 1260, y: 120, size: 52, rot: -4, color: C.orange})) +
        op(fin(T, w('maid')), pen('...as a maid', {x: 1340, y: 220, size: 56, rot: -5, color: C.orange}));
    }},
    // 13b. "Michael's sister gets a job inside one of those golden mansions. As a maid." (drawn; reused in Episode 2)
    {a: c.sister, b: c.thanks, draw: (T) => mansion(T)},
    // 14. "Thanks for watching. Subscribe for more, and I'll see you next time."
    {a: c.thanks, b: dur, draw: (T) => desk() + slideUp(fin(T, w('Thanks')), tape('THANKS FOR WATCHING', {x: 480, y: 380, size: 100, rot: -2, seed: 129})) +
      op(fin(T, w('Subscribe')), mono('chunk history &middot; the gilded age &middot; episode 1 of 6', {x: 560, y: 600, size: 26, color: C.teal}))},
  ];
  return {dur, shots, fadeOut: 0.8};
};
