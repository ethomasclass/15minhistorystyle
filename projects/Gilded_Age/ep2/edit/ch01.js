// Chapter 1, "The Ball" (cold open, 0:00 to 1:06): Fifth Avenue on the night of the ball, the costumes, the crowd outside,
// then down through the house into the kitchen, where Nora carries the ices. The bill, her wage, and the question.
EDITS.ch01 = () => {
  const ch = 'ch01_the_ball', w = (word, n) => wordAt(ch, word, n), dur = window.WORDS[ch].duration + 1.0;   // + a held tail after the last word, so the last labels get their reading time
  const c = {
    nobody: w('Nobody') - 0.3, kings: w('They') - 0.3, elec: w('One') - 0.3, outside: w('Outside') - 0.3, down: w('And', 3) - 0.25,
    drop: w("Don't", 1) - 0.4, thats: w("That's") - 0.3, but: w('But') - 0.3, bill: w('The', 5) - 0.25, so: w('So') - 0.25,
  };
  const night = (T, cam) => renderFifth({t: T, cam, quiet: true});
  // the house cut open (lookdev/mansion.js): from the whole house down into the kitchen, then close on Nora with her tray
  const ballCam = (T) => { const u = ease(clamp01((T - c.down) / 4.2)), v = ease(clamp01((T - c.drop) / 1.6));
    return {z: lerpLog(lerpLog(0.8, 4.3, u), 6.2, v), ux: 930 + (560 - 930) * u + 40 * v, uy: 540 + (925 - 540) * u - 20 * v}; };
  const shots = [
    // 1. Fifth Avenue, March 26, 1883: carriages queue at 660 Fifth Avenue. "more than a thousand people came to a party"
    {a: 0, b: c.nobody, draw: (T) => night(T, {z: 1.2, ux: 1250 + T * 85, uy: 560}) +
      stamp('660 Fifth Avenue, New York &middot; Monday, March 26, 1883', fin(T, 0.5)) +
      op(fin(T, w('thousand')), pen('more than 1,000 guests', {x: 1180, y: 130, size: 52, rot: -3, color: C.orange}))},
    // 2. "Nobody was allowed in wearing ordinary clothes." The ball on the cover of Leslie's.
    {a: c.nobody, b: c.kings, draw: (T) => push(T, c.nobody, c.kings) +
      deskCut('desk/leslies_1883_cover.png', {x: 640, y: 40, w: 640, rot: -1.5, o: fin(T, c.nobody, 0.5), T}) + `</div>` +
      op(fin(T, c.nobody + 0.3) * 0.9, mono("frank leslie's illustrated newspaper, april 7, 1883", {x: 560, y: 1010, size: 20})) +
      op(fin(T, w('ordinary')), pen('costumes only', {x: 1340, y: 300, size: 64, rot: -5, color: C.orange}))},
    // 3. "They came as kings. As queens. As cats, and hornets, and stars." Puck's cartoon of the costume craze, and the words.
    {a: c.kings, b: c.elec, draw: (T) => push(T, c.kings, c.elec) +
      deskCut('desk/puck_aristocracy_1883.png', {x: 300, y: 150, w: 1320, rot: 1, o: fin(T, c.kings, 0.5), T}) + `</div>` +
      op(fin(T, c.kings + 0.3) * 0.9, mono('&ldquo;our imitative aristocracy,&rdquo; puck, february 1883', {x: 320, y: 990, size: 20})) +
      [['KINGS', 'kings', 120, 70], ['QUEENS', 'queens', 520, 50], ['CATS', 'cats', 900, 80], ['HORNETS', 'hornets', 1180, 46], ['STARS', 'stars', 1560, 76]]
        .map(([txt, wd, x, y], i) => op(fin(T, w(wd), 0.25), tape(txt, {x, y, size: 64, rot: -3 + i * 1.4, seed: 30 + i}))).join('')},
    // 4. "One woman came dressed as electricity, holding up a torch that actually lit up, powered by batteries hidden in her dress."
    {a: c.elec, b: c.outside, draw: (T) => push(T, c.elec, c.outside) +
      deskCut('desk/alice_electric_light_mora_1883.png', {x: 340, y: 110, w: 360, rot: -1.5, o: fin(T, c.elec, 0.6), T, caption: 'a guest as &ldquo;the electric light&rdquo;', cx: -40, cy: -40}) +
      deskProp('p01_electric_torch', {x: 1060, y: 120, w: 230, rot: 8, o: fin(T, w('torch'), 0.5), T}) + `</div>` +
      op(fin(T, c.elec + 0.4) * 0.9, mono('photograph by josé maría mora, 1883', {x: 300, y: 980, size: 20})) +
      op(fin(T, w('electricity')), pen('dressed as electricity', {x: 760, y: 840, size: 52, rot: -3, color: C.orange})) +
      op(fin(T, w('lit')), pen('it really lit up', {x: 1330, y: 300, size: 52, rot: -5, color: C.orange})) +
      op(fin(T, w('batteries')), pen('batteries, hidden<br>in her dress', {x: 1330, y: 520, size: 48, rot: -4, color: C.orange, w: 520})) +
      op(fin(T, w('torch')) * 0.85, mono('a torch like hers (re-creation)', {x: 1020, y: 1010, size: 18, color: '#9a958c'}))},
    // 5. "Outside, a crowd packed the sidewalk just to watch them climb out of their carriages. The police had to push people back."
    {a: c.outside, b: c.down, draw: (T) => { const u = ease((T - c.outside) / (c.down - c.outside));
      return night(T, {z: 1.55 + 0.25 * u, ux: 1560 + 120 * u, uy: 650}) +
        op(fin(T, w('crowd')), pen('a crowd, just to watch', {x: 120, y: 130, size: 52, rot: -3, color: C.orange})) +
        op(fin(T, w('police')), pen('police held them back', {x: 1180, y: 130, size: 52, rot: -3, color: C.orange})) +
        stamp('Fifth Avenue at 52nd Street &middot; March 26, 1883', 1);
    }},
    // 6. "And downstairs, in the kitchen, an eighteen-year-old girl was carrying ice cream up from the cellar."
    {a: c.down, b: c.drop, draw: (T) => renderBall({t: T, cam: ballCam(T), quiet: true}) +
      op(fin(T, w('downstairs')), pen('downstairs', {x: 120, y: 120, size: 60, rot: -4, color: C.orange})) +
      op(fin(T, w('kitchen', 1)), pen('the kitchen', {x: 160, y: 210, size: 52, rot: -3, color: C.orange})) +
      op(fin(T, w('eighteen-year-old')), pen('18 years old', {x: 1300, y: 140, size: 56, rot: -4, color: C.orange})) +
      op(fin(T, w('ice')), pen('ices from the cellar', {x: 1280, y: 240, size: 46, rot: -3, color: C.orange})) +
      compositeBar(fin(T, w('girl'), 0.5))},
    // 7. NORA: "Don't drop it. Don't drop it. Don't drop it." Close on her and the tray.
    {a: c.drop, b: c.thats, draw: (T) => renderBall({t: T, cam: ballCam(T), quiet: true}) + compositeBar(1)},
    // 8. "That's Nora Kelly. Michael's little sister, from last time. She's made up too."
    {a: c.thats, b: c.but, draw: (T) => { const u = ease((T - c.thats) / (c.but - c.thats));
      return renderBall({t: T, cam: {z: 6.2 - 1.4 * u, ux: 600 - 20 * u, uy: 905}, quiet: true}) +
        op(fin(T, w('Nora', 1)), pen('nora kelly, 18', {x: 1180, y: 130, size: 64, rot: -4, color: C.orange})) +
        op(fin(T, w("Michael's")), pen("michael's little sister (episode 1)", {x: 1120, y: 240, size: 44, rot: -3, color: C.orange})) +
        compositeBar(1);
    }},
    // 9. "But thousands of girls had her job, in houses just like this one." A maid's cap and apron on the desk.
    {a: c.but, b: c.bill, draw: (T) => push(T, c.but, c.bill) +
      deskProp('p04_maid_cap_apron', {x: 560, y: 240, w: 800, rot: -3, o: fin(T, c.but, 0.5), T}) + `</div>` +
      op(fin(T, w('thousands')), pen('thousands of girls<br>had her job', {x: 120, y: 140, size: 60, rot: -4, color: C.orange, w: 600})) +
      op(fin(T, w('houses')), pen('in houses like this one', {x: 1180, y: 860, size: 48, rot: -3, color: C.orange})) +
      compositeBar(fout(T, w('this', 1) + 0.6))},
    // 10. "The party reportedly cost about a quarter of a million dollars. Nora earned less than four dollars a week."
    {a: c.bill, b: c.so, draw: (T) => { const nora = fin(T, w('Nora', 2), 0.5);
      return push(T, c.bill, c.so) +
        deskProp('p01_silver_tray_ices', {x: 1220, y: 620, w: 560, rot: 6, o: fin(T, c.bill + 0.2, 0.5) * 0.9, T}) + `</div>` +
        op(fin(T, w('party', 2)) * 0.9, mono('the party (reported)', {x: 160, y: 200, size: 28, color: C.cream, ls: 4})) +
        bigFig('$250,000', {x: 140, y: 250, size: 170, w: 1000, align: 'left', o: fin(T, w('quarter'), 0.4)}) +
        today('&asymp; $9 million today', {x: 160, y: 440, w: 900, align: 'left', o: fin(T, w('dollars', 1) + 0.3)}) +
        op(nora * 0.9, mono("nora's pay", {x: 160, y: 590, size: 28, color: C.cream, ls: 4})) +
        bigFig('$3.60 a week', {x: 140, y: 640, size: 120, w: 1100, align: 'left', o: nora}) +
        today('&asymp; $130 a week today', {x: 160, y: 790, w: 900, align: 'left', o: fin(T, w('week') + 0.1)}) +
        op(fin(T, w('less')), pen('less than $4', {x: 900, y: 650, size: 52, rot: -5, color: C.orange}));
    }},
    // 11. The driving question, over the night street.
    {a: c.so, b: dur, draw: (T) => night(T, {z: 1.2, ux: 1250 + T * 85, uy: 560}) + dimBy(0.74 * fin(T, c.so, 0.6)) +
      op(fin(T, w('know')), mono('the question', {x: 130, y: 250, size: 28, color: C.teal, ls: 6})) +
      slideUp(fin(T, w('What', 2)), `<div style="position:absolute;left:124px;top:300px;font-family:Abril;font-size:96px;line-height:1.08;color:${C.cream}">What did the richest people<br>in America think...</div>`) +
      (fin(T, w('What', 2) + 0.5) > 0 ? slideUp(fin(T, w('What', 2) + 0.5), tape('they owed everyone else?', {x: 120, y: 560, size: 84, rot: -2, seed: 17})) : '')},
  ];
  return {dur, shots, fadeOut: 0.6};
};
