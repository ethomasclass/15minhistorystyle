// Short 1, "The Bad Wire" (54.7 s): Ep1 ch09's wire swap, told on its own. Shots are cut on the words of
// public/audio/s1_bad_wire.words.json (repeated words counted: "The" 4 = the supplier, "A" 3 = the wagon, "The" 13, "It" 6 = it held; "failed" 1 = the hook, 2 = the swap; "good" 2 = good wire off).
EDITS.s1 = () => {
  const ch = 's1_bad_wire', w = (word, n) => wordAt(ch, word, n), dur = window.WORDS[ch].duration;
  const xw = B.tB - 330, saddle = B.top + 8, mid = (B.tM + B.tB) / 2;      // a point on the main cable (as in ch01 / ch09)
  const CABLE = {x: xw + 30, y: (B.deck - 14) - ((B.deck - 14) - saddle) * ((xw - mid) / (B.span / 2)) ** 2};
  const c = {
    used: w('They', 1) - 0.25, test: w('Every') - 0.3, trick: w('The', 4) - 0.3, wagon: w('A', 3) - 0.25, caught: w('They', 2) - 0.3,
    tons: w('By') - 0.3, fix: w('So') - 0.3, six: w('The', 13) - 0.3, held: w('It', 6) - 0.25, end: dur - 2.2,
  };
  const X = {cx: 470, cy: 640, r: 360};                                     // the x-ray circle, tall-frame coordinates
  const rustNote = (o) => op(o, pen('failed its<br>safety test', {x: 120, y: 1060, size: 46, rot: -4, color: C.orange, w: 520}));

  /** The swap, redrawn for the tall frame: the wire works at the top, the bridge below it, another building off to the side. */
  function fraud(T) {
    const F = [300, 500], J = [300, 800], O = [740, 800], Bd = [300, 1110];
    const lerp = (p, q, u) => [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u];
    const tOn = w('On'), tStop = w('stopped'), tBld = w('building'), tSame = w('Same', 1), tAt = w('Same', 2) + 0.8;
    let pos;
    if (T < tOn) pos = F; else if (T < tStop) pos = lerp(F, J, ease((T - tOn) / (tStop - tOn)));
    else if (T < tBld) pos = lerp(J, O, ease((T - tStop) / (tBld - tStop))); else if (T < tSame) pos = O;
    else if (T < tSame + 0.6) pos = lerp(O, J, ease((T - tSame) / 0.6)); else pos = lerp(J, Bd, ease(clamp01((T - tSame - 0.6) / (tAt - tSame - 0.6))));
    const goodOff = clamp01((T - w('good', 2)) / 0.8), badOn = clamp01((T - w('failed', 2)) / 0.8), goBack = clamp01((T - w('back')) / 1.3);
    const wagon = (x, y) => {
      const coils = [-50, 0, 50].map((dx) => {
        const g = goodOff < 1 ? `<circle cx="${x + dx}" cy="${f1(y - 52 - goodOff * 60)}" r="22" fill="none" stroke="${C.teal}" stroke-width="9" opacity="${(1 - goodOff).toFixed(2)}"/>` : '';
        const b = badOn > 0 ? `<circle cx="${x + dx}" cy="${y - 52}" r="22" fill="none" stroke="#B5463D" stroke-width="9" opacity="${badOn.toFixed(2)}"/>` : '';
        return g + b; }).join('');
      const cert = T > w('certificate', 1) ? `<g transform="translate(${x + 70},${y - 120}) rotate(-6)"><rect width="74" height="52" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>
          <line x1="10" y1="16" x2="64" y2="16" stroke="#777" stroke-width="3"/><line x1="10" y1="28" x2="54" y2="28" stroke="#777" stroke-width="3"/><circle cx="56" cy="40" r="7" fill="#B5463D"/></g>` : '';
      return `<g>${coils}<rect x="${x - 90}" y="${y - 30}" width="180" height="30" fill="#6B4A2B" stroke="${C.ink}" stroke-width="4"/>
        <circle cx="${x - 60}" cy="${y + 4}" r="20" fill="${C.ink}" stroke="#8A6A45" stroke-width="5"/><circle cx="${x + 60}" cy="${y + 4}" r="20" fill="${C.ink}" stroke="#8A6A45" stroke-width="5"/>${cert}</g>`;
    };
    const bldg = ([x, y], label, sub) => `<rect x="${x - 110}" y="${y - 140}" width="220" height="140" fill="#2A3B39" stroke="${C.cream}" stroke-width="3"/>
      <path d="M${x - 125},${y - 140} L${x},${y - 200} L${x + 125},${y - 140} Z" fill="#1F2D2C" stroke="${C.cream}" stroke-width="3"/>
      <text x="${x}" y="${y + 48}" font-family="Mono" font-size="28" letter-spacing="3" fill="${C.cream}" text-anchor="middle">${label}</text>
      ${sub ? `<text x="${x}" y="${y + 84}" font-family="Mono" font-size="24" letter-spacing="2" fill="${C.teal}" text-anchor="middle">${sub}</text>` : ''}`;
    const backDots = goBack > 0 ? Array.from({length: 14}, (_, i) => { const u = i / 13; if (u > goBack) return '';
      const [x, y] = lerp([O[0], O[1] - 150], [F[0] + 130, F[1] - 80], u); return `<circle cx="${f1(x + 60 * Math.sin(Math.PI * u))}" cy="${f1(y)}" r="8" fill="${C.teal}"/>`; }).join('') : '';
    const bridge = `<g transform="translate(${Bd[0]},${Bd[1]})" fill="none" stroke="${C.cream}" stroke-width="4"><rect x="-26" y="-170" width="52" height="170"/>
      <path d="M-150,-10 Q-90,-130 -26,-162 M26,-162 Q90,-130 150,-10"/><line x1="-180" y1="-10" x2="180" y2="-10"/></g>
      <text x="${Bd[0] + 230}" y="${Bd[1] - 30}" font-family="Mono" font-size="28" letter-spacing="3" fill="${C.cream}">THE BRIDGE</text>`;
    const z = 1 + 0.04 * ease((T - c.wagon) / (c.caught - c.wagon));
    return vdesk() + `<div style="position:absolute;inset:0;transform-origin:500px 800px;transform:scale(${z.toFixed(4)})">` +
      vsvg(`<path d="M${F[0]},${F[1] + 26} L${Bd[0]},${Bd[1] - 40} M${J[0]},${J[1] + 26} L${O[0]},${O[1] + 26}" stroke="#5A5246" stroke-width="10" stroke-dasharray="22 14"/>` +
        bldg(F, 'THE WIRE WORKS', T > w('passed') ? 'TESTED &#10003;' : '') + bldg(O, 'ANOTHER', 'BUILDING') + bridge + backDots + wagon(pos[0], pos[1] - 4)) + `</div>` +
      op(fin(T, w('good', 2)), pen('good wire off...', {x: 470, y: 330, size: 40, rot: -4, color: C.orange})) +
      op(fin(T, w('failed', 2)), pen('...failed wire on', {x: 500, y: 410, size: 40, rot: -4, color: C.orange})) +
      op(fin(T, w('back')), pen('tested again!', {x: 540, y: 1000, size: 44, rot: -4, color: C.orange}));
  }

  const shots = [
    // 1. The hook, on frame 0: the bridge at dusk, pushed in on a main cable, the x-ray already open; on "failed" wires turn rust.
    {a: 0, b: c.used, live: true, draw: (T) => wide(renderScene({look: 'dusk', t: T, cx: -60, zoom: 2.0 + 0.5 * ease(T / c.used), fx: CABLE.x, fy: CABLE.y}), {fx: CABLE.x, fy: CABLE.y, cy: 1000}) +
      dim(0.3) + vsvg(cableXray({...X, open: 1, bad: clamp01((T - w('failed', 1) + 0.2) / 1.0)})) +
      op(0.85, mono('one cable, cut through &middot; schematic', {x: 210, y: X.cy + X.r + 22, size: 22})) +
      stamp2('brooklyn bridge &middot; 1883', 1) + rustNote(fin(T, w('failed', 1)))},
    // 2. "They used it anyway." The whole tower, the bridge opening at dusk.
    {a: c.used, b: c.test, live: true, draw: (T) => wide(renderScene({look: 'dusk', t: T, cx: -40 * ease((T - c.used) / 2)}), {s: 1.85, fx: 1560, fy: 560}) +
      op(fin(T, w('anyway')), tape('USED ANYWAY', {x: 130, y: 300, size: 92, rot: -3, seed: 41}))},
    // 3. "Every load of wire had to pass a strength test": workers on the cables, the inspection certificate.
    {a: c.test, b: c.trick, draw: (T) => vback(T, c.test, c.trick) +
      vcut('desk/cable_workers_1883.png', {x: 60, y: 250, w: 840, rot: -2, o: fin(T, c.test + 0.05, 0.5), T}) +
      vprop('p09_inspection_certificate', {x: 360, y: 700, w: 560, rot: 4, o: fin(T, w('strength'), 0.5), T}) + `</div>` +
      op(fin(T, c.test + 0.3) * 0.9, mono('on the cables, frank leslie&rsquo;s, 1883', {x: 70, y: 220, size: 22})) +
      op(fin(T, w('pass')), pen('every load tested', {x: 70, y: 690, size: 48, rot: -5, color: C.orange}))},
    // 4. "The supplier found a way around it." A coil of wire on the desk, and the note.
    {a: c.trick, b: c.wagon, draw: (T) => vback(T, c.trick, c.wagon, 0.06) +
      vprop('p01_wire_coil', {x: 160, y: 420, w: 680, rot: -6, o: fin(T, c.trick + 0.05, 0.4), T}) + `</div>` +
      op(fin(T, w('around')), tape('THE TRICK', {x: 170, y: 290, size: 100, rot: -3, seed: 43}))},
    // 5. The swap, beat by beat (redrawn from ch09's diagram for the tall frame).
    {a: c.wagon, b: c.caught, draw: (T) => fraud(T)},
    // 6. "They caught on when someone noticed the pile of rejected wire... never got any bigger."
    {a: c.caught, b: c.tons, draw: (T) => {
      const day = 1 + Math.floor(Math.max(0, T - w('pile')) * 3);
      return vback(T, c.caught, c.tons) + vprop('p09_rejected_wire_pile', {x: 40, y: 560, w: 860, rot: -2, o: fin(T, c.caught + 0.05, 0.4), T}) + `</div>` +
        op(fin(T, w('pile')), mono(`day ${day}`, {x: 90, y: 300, size: 76, color: C.cream})) +
        op(fin(T, w('rejected')), mono('the rejected pile', {x: 94, y: 400, size: 30, color: C.teal})) +
        op(fin(T, w('never')), pen('never got any bigger', {x: 280, y: 470, size: 48, rot: -4, color: C.orange}));
    }},
    // 7. "By then, tons of bad wire were already in the cables." Night, the cable, the x-ray with the rust strand.
    {a: c.tons, b: c.fix, live: true, draw: (T) => wide(renderScene({look: 'night', t: T + 4, cx: -60, zoom: 1.4 + 0.9 * ease((T - c.tons) / (c.fix - c.tons)), fx: CABLE.x, fy: CABLE.y}), {fx: CABLE.x, fy: CABLE.y, cy: 1000}) +
      vsvg(cableXray({...X, open: fin(T, c.tons + 0.1, 0.6), bad: 1})) +
      op(fin(T, w('tons')), pen('already inside', {x: 140, y: 1060, size: 50, rot: -4, color: C.orange}))},
    // 8. "So the engineers added 150 extra wires to each one." The x-ray on the desk; the +150 ring fills in, teal.
    {a: c.fix, b: c.six, draw: (T) => vdesk() + vsvg(cableXray({...X, r: 380, open: 1, bad: 1, extra: clamp01((T - w('150')) / 1.6)})) +
      bigNum('+150', {y: 250, size: 150, color: C.teal, o: fin(T, w('150'), 0.3)}) +
      op(fin(T, w('each')), pen('good wires, every cable', {x: 150, y: 1050, size: 46, rot: -4, color: C.orange}))},
    // 9. "The bridge had been built six times stronger than it needed to be." The span at dusk, panning.
    {a: c.six, b: c.held, live: true, draw: (T) => wide(renderScene({look: 'dusk', t: T, cx: 160 - 220 * ease((T - c.six) / (c.held - c.six))}), {s: 1.85, fx: 1560, fy: 560}) +
      bigNum('6&times;', {y: 260, size: 260, o: fin(T, w('six'), 0.3)}) +
      op(fin(T, w('stronger')), pen('stronger than it needed', {x: 170, y: 540, size: 48, rot: -4, color: C.orange}))},
    // 10. "It held. People still walk across it every day." Night over the river, the fireworks.
    {a: c.held, b: c.end, live: true, draw: (T) => wide(renderScene({look: 'night', t: T - c.held + 1.5, cx: 100 - 160 * ease((T - c.held) / 5), zoom: 1.05, fx: 960, fy: 700}), {s: 1.82, fx: 1580, fy: 520}) +
      (fin(T, w('held')) > 0 ? slideUp(fin(T, w('held')), tape('IT HELD.', {x: 220, y: 300, size: 130, rot: -3, seed: 45})) : '') +
      op(fin(T, w('every', 2)), mono('every day, since 1883', {x: 240, y: 500, size: 30, color: C.teal, ls: 4}))},
    // 11. The end card.
    {a: c.end, b: dur, live: true, draw: (T) => endCard(T, c.end)},
  ];
  return {ch, dur, shots, fadeOut: 0.3, capEnd: c.end + 0.15};
};
/** A place/date stamp, top left inside the safe area. */
const stamp2 = (text, o = 1) => op(o, mono(text, {x: 60, y: 220, size: 26, color: C.cream, extra: 'background:rgba(13,12,9,.7);padding:6px 12px'}));
