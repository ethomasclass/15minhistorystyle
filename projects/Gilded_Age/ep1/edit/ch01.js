// Chapter 1, "The Bridge" (cold open, 0:00 to 1:01). Shots 1 to 5 of ANIMATION_PLAN.md, plus the question and the two boys.
EDITS.ch01 = () => {
  const ch = 'ch01_the_bridge', w = (word, n) => wordAt(ch, word, n), dur = window.WORDS[ch].duration;
  const mich = CLIPS.closeup_night.michael;                         // Michael's waving / awe poses
  // A point on the main cable (scene.js bridgeLayer's parabola), in screen space at cx = -60; zooming on it keeps it fixed.
  const xw = B.tB - 330, saddle = B.top + 8, mid = (B.tM + B.tB) / 2;
  const CABLE = {x: xw + 30, y: (B.deck - 14) - ((B.deck - 14) - saddle) * ((xw - mid) / (B.span / 2)) ** 2};
  const cut = {
    wire: w('And', 2) - 0.25, nobody: w('Nobody') - 0.3, would: w('Would') - 0.3, thats: w("That's") - 0.3, its: w("It's") - 0.25,
    so: w('So') - 0.25, to: w('To', 3) - 0.2, back: w('And', 6) - 0.25,
  };
  const shots = [
    // 1. The bridge at dusk, the camera drifting over the crowd. "a hundred and fifty thousand people"
    {a: 0, b: cut.wire, draw: (T) => renderScene({look: 'dusk', t: T, cx: -380 + 320 * ease(T / cut.wire)}) +
      stamp('Brooklyn, N.Y. &middot; May 24, 1883', fin(T, 0.4)) +
      op(fin(T, w('hundred')), pen('150,000 people', {x: 600, y: 600, size: 46, rot: -4, color: C.orange}))},
    // 2. Push in on a main cable; an x-ray slice shows the wires, and some turn: "had already failed its safety test"
    {a: cut.wire, b: cut.nobody, draw: (T) => {
      const z = 1 + 1.5 * ease((T - cut.wire) / 1.8), o = fin(T, w('steel'), 0.6), bad = clamp01((T - w('failed')) / 1.1);
      const X = {cx: 640, cy: 560, r: 300};
      return renderScene({look: 'dusk', t: T, cx: -60, zoom: z, fx: CABLE.x, fy: CABLE.y}) +
        `<div style="position:absolute;inset:0;background:rgba(13,12,9,${(0.35 * o).toFixed(3)})"></div>` +
        svg(cableXray({...X, open: o, bad}) + (o > 0.6 ? `<path d="M${X.cx + 212},${X.cy - 212} L${CABLE.x - 6},${CABLE.y + 4}" stroke="${C.teal}" stroke-width="4" stroke-dasharray="10 8" opacity="${o}"/><circle cx="${f1(CABLE.x)}" cy="${f1(CABLE.y)}" r="16" fill="none" stroke="${C.ink}" stroke-width="9" opacity="${o}"/><circle cx="${f1(CABLE.x)}" cy="${f1(CABLE.y)}" r="16" fill="none" stroke="${C.teal}" stroke-width="5" opacity="${o}"/>` : '')) +
        op(fin(T, w('wire', 1)), pen('steel wire, thousands of them', {x: 1010, y: 520, size: 42, rot: -4, color: C.orange})) +
        op(fin(T, w('failed')), pen('some had failed<br>their safety test', {x: 1060, y: 660, size: 50, rot: -5, color: C.orange, w: 620})) +
        op(o * 0.85, mono('one cable, cut through &middot; schematic', {x: X.cx - 200, y: X.cy + X.r + 26, size: 20, color: C.cream}));
    }},
    // 3. Down into the crowd, toward Michael. "Not even the nineteen-year-old who works ten-hour shifts"
    {a: cut.nobody, b: cut.would, draw: (T) => {
      const u = (T - cut.nobody) / (cut.would - cut.nobody);
      return renderScene({look: 'dusk', t: T, cx: 0, zoom: 1.25 + 0.9 * ease(u), fx: 1156, fy: 960, michael: (t) => mich(1.0 + (T - cut.nobody) * 0.35)}) +
        op(fin(T, w('nineteen-year-old')), pen('19 years old', {x: 1270, y: 380, size: 46, rot: -4, color: C.orange})) +
        op(fin(T, w('ten-hour')), pen('10-hour shifts, sugar refinery', {x: 1270, y: 470, size: 38, rot: -3, color: C.orange}));
    }},
    // 4. Close on Michael in awe. MICHAEL: "Would you look at it."
    {a: cut.would, b: cut.thats, draw: (T) => renderScene({look: 'dusk', t: T, cx: 0, zoom: 3.1 + 0.15 * ease((T - cut.would) / 5), fx: 1160, fy: 880,
      michael: (t) => mich(5.4 + (T - cut.would))})},
    // 5. "That's Michael Kelly. He's made up." The name and the composite label; the camera eases back.
    {a: cut.thats, b: cut.its, draw: (T) => {
      const u = (T - cut.thats) / (cut.its - cut.thats);
      return renderScene({look: 'dusk', t: T, cx: 0, zoom: 3.25 - 1.2 * ease(u), fx: 1160, fy: 900, michael: (t) => mich(10.4 + (T - cut.thats))}) +
        op(fin(T, w('Michael', 1)), pen('michael kelly, 19', {x: 300, y: 330, size: 56, rot: -4, color: C.orange})) +
        compositeBar(fin(T, w('made')));
    }},
    // 6. Night, the fireworks. "It's 1883. America is changing fast"
    {a: cut.its, b: cut.so, draw: (T) => renderScene({look: 'night', t: T - cut.its + 1.5, cx: 140 - 140 * ease((T - cut.its) / 8), zoom: 1 + 0.05 * ease((T - cut.its) / 8), fx: 960, fy: 700}) +
      stamp('1883', fin(T, w('1883')))},
    // 7. The driving question over the dimmed fireworks.
    {a: cut.so, b: cut.to, draw: (T) => {
      const q1 = fin(T, w('How')), q2 = fin(T, w('and', 4));
      return renderScene({look: 'night', t: T - cut.its + 1.5, cx: 140 - 140 * ease((T - cut.its) / 8), zoom: 1.05, fx: 960, fy: 700}) +
        `<div style="position:absolute;inset:0;background:rgba(13,12,9,${(0.72 * fin(T, cut.so, 0.6)).toFixed(3)})"></div>` +
        op(fin(T, w('question')), mono('the question', {x: 130, y: 250, size: 28, color: C.teal, ls: 6})) +
        slideUp(q1, `<div style="position:absolute;left:124px;top:300px;font-family:Abril;font-size:96px;line-height:1.08;color:${C.cream}">How did America get<br>so rich, so fast...</div>`) +
        (q2 > 0 ? slideUp(q2, tape('and who ended up with the money?', {x: 120, y: 560, size: 76, rot: -2, seed: 17})) : '');
    }},
    // 8. The desk: the two boys, as their real photographs. "One whose father lost his job to a machine. And one whose father was a con man."
    {a: cut.to, b: cut.back, draw: (T) => {
      const pa = fin(T, w('two'), 0.7), pb = fin(T, w('two') + 0.35, 0.7);
      const hiA = fin(T, w('One')), hiB = fin(T, w('And', 5));
      const push = 1 + 0.03 * ease((T - cut.to) / (cut.back - cut.to));
      return `<div style="position:absolute;inset:0;transform:scale(${push.toFixed(4)})">${desk()}
          ${deskCut('desk/carnegie_16_with_tom_bust.png', {x: 150, y: 250, w: 760, rot: -2, o: pa, T, caption: 'andrew carnegie, 16 (right), with his brother tom', cx: 60})}
          ${deskCut('desk/rockefeller_18_bust.png', {x: 1030, y: 230, w: 760, rot: 1.5, o: pb, T, caption: 'john d. rockefeller, 18', cx: 220})}</div>` +
        op(hiA, pen('father lost his job<br>to a machine', {x: 240, y: 860, size: 46, rot: -3, color: C.orange, w: 560})) +
        op(hiB, pen('father was a con man', {x: 1150, y: 900, size: 46, rot: -3, color: C.orange}));
    }},
    // 9. Back to the bridge at night and the cable: "we'll come back to that bad wire."
    {a: cut.back, b: dur, draw: (T) => {
      const u = (T - cut.back) / (dur - cut.back), o = fin(T, w('bad'), 0.6) * fout(T, w('story') + 0.2, 0.8);
      return renderScene({look: 'night', t: T, cx: -60, zoom: 2.2 - 1.2 * ease(u), fx: CABLE.x, fy: CABLE.y}) +
        svg(cableXray({cx: 640, cy: 560, r: 260 , open: o, bad: 1, seed: 11})) +
        op(fin(T, w('miniature')), pen('the whole story, in miniature', {x: 1000, y: 820, size: 46, rot: -3, color: C.orange}));
    }},
  ];
  return {dur, shots, fadeOut: 0.6};
};
