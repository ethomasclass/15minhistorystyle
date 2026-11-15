// Short 3, "They Spent $9 Million on One Party" (71.4 s): the Vanderbilt ball of March 26, 1883 (Ep 2), cut on the words of
// public/audio/s3_vanderbilt_ball.words.json. THE PACE RULE (user, Nov 15): nothing on screen longer than 3 s; every shot is
// 1.5 to 3.0 s, a long line gets two or three cuts. Costume plates: costumes.js. Coral is Nora's alone; teal explains (the
// counter, the math); orange is tape and handwriting; every archival image carries its source tag.
// The hook (0 to 2.1 s, user's note): the Electric Light plate already blazing on frame 0, the title on tape; hard cut to the street.
// Repeats counted: "on" 1 = "on a single party"; "And" 1 = "And the guest"; "came" 1 = "came in costume"; "cat" 1 = "A cat,";
// "woman" 2 = "One woman came as electricity"; "last" 1 = the last dance; "Alva" 1 = "was Alva";
// "story" 1 = "The story goes"; "She" 1 = "She came to the ball"; "Don't" 1 = Nora's first.
const E2 = '../../../ep2/public/img/desk/';   // Ep 2's cut-outs and props, relative to vedit's VIMG (ep1/public/img/)
EDITS.s3 = () => {
  const ch = 's3_vanderbilt_ball', w = (word, n) => wordAt(ch, word, n), dur = window.WORDS[ch].duration;
  const c = {
    street: 2.1, mansion: w('nine') + 0.47, party: w('on', 1) - 0.34, door: w('And', 1) - 0.12, hall: w('More') - 0.08, kings: w('came', 1) - 0.03,
    cat: w('cat', 1) + 0.26, tails: w('seven') - 0.35, hornet: w('hornet') - 0.28, devil: w('devil') - 0.28, fringe: w('trimmed') - 0.14,
    duchess: w('duchess') - 0.28, jewels: w('rubies') + 0.26, alice: w('woman', 2) - 0.32, elec: w('torch') - 0.5, torch: w('wired') + 0.08,
    horse: w('Dancers') - 0.08, porc: w('last', 1) - 0.33, dawn: w('sunrise') - 0.08, alva: w('Alva', 1) - 0.14, newm: w('new') - 0.18,
    oldm: w('queen') - 0.29, front: w('had') - 0.08, list: w('story', 1) + 0.14, carriage: w('list') - 0.34, salver: w('gave') - 0.1,
    came: w('She', 1) - 0.16, kitchen: w('maid') - 0.22, tray: w("Don't", 1) - 0.13, wage: w('earned') - 0.29, bill: w('pay') - 0.26,
    years: w("she'd") - 0.1, nora: w('years') - 0.3, end: dur - 2.0,
  };
  const SX = 470;                                        // the centre of the safe area (x 40 to 900)
  // source tags: small mono on a dark strip, under the captions and above the bottom UI
  const src = (txt, o = 1) => op(o * 0.95, mono(txt, {x: 40, y: 1500, size: 24, color: C.cream, ls: 2, extra: 'background:rgba(13,12,9,.78);padding:8px 14px;max-width:860px;white-space:normal;line-height:1.3'}));
  const note = (txt, o, {y = 230, size = 66, rot = -3, x = 60, color = C.orange, wd} = {}) => op(o, pen(txt, {x, y, size, rot, color, w: wd}));
  const tp = (txt, o, {x = 60, y = 240, size = 96, rot = -3, seed = 61} = {}) => o > 0 ? slideUp(o, tape(txt, {x, y, size, rot, seed})) : '';
  const big = (txt, o, {y, size = 170, color = C.teal}) => bigNum(txt, {x: SX, y, size, color, o});
  const plate = (name, T, a, b, opts) => costumePlate(name, T, a, b, opts);
  const drawn = (who, o = 1) => src(`${who} &middot; drawn from the 1883 reports`, o);
  // an Ep 2 cut-out on the tall desk, with a slow push
  const cut = (img, o) => vcut(E2 + img, o);
  // Fifth Avenue (lookdev/mansion.js) and the house cut open; the cutaway's Nora walks range to dumbwaiter on a 9 s loop
  const fifth = (T, cam, v = {}) => wide(renderFifth({t: T, cam, quiet: true, dawn: v.dawn || 0}), {s: v.s || 1.8, fx: v.fx ?? 960, fy: v.fy ?? 540});
  const ball = (T, cam, v = {}) => wide(renderBall({t: T, cam, quiet: true}), {s: v.s || 1.8, fx: v.fx ?? 960, fy: v.fy ?? 540});
  const noraX = (t) => { const u = (t % 9) / 9, d = (u < 0.5 ? u : 1 - u) * 2; return CH.x0 + 170 + smooth(0.08, 0.92, d) * 280; };
  const coralNote = (o) => op(o, `<div class="tx" style="position:absolute;left:40px;top:1500px;display:flex;align-items:center;gap:12px;background:rgba(13,12,9,.82);padding:8px 14px">
    <div style="width:18px;height:18px;border-radius:50%;background:${C.coral}"></div><div style="font-family:Mono;font-size:22px;letter-spacing:2px;color:${C.cream}">NORA IS A COMPOSITE &middot; THOUSANDS HAD HER JOB</div></div>`);
  const count = (T, t0, t1, to) => Math.round(to * ease(clamp01((T - t0) / (t1 - t0))));
  const fmt = (n) => n.toLocaleString('en-US');
  const listCard = (T) => { const names = ['Mrs. W. Astor', 'Mr. & Mrs. Belmont', 'Miss C. Astor', 'Mrs. Paran Stevens', 'Mr. Ward McAllister'];
    const x = 130, y = 420, k = clamp01((T - w("Astor's")) / 0.35);
    return `<div style="position:absolute;left:${x}px;top:${y}px;width:720px;transform:rotate(-2deg);background:${C.cream};padding:50px 46px;box-shadow:0 20px 40px rgba(0,0,0,.6)">
      <div style="font-family:Mono;font-size:24px;letter-spacing:5px;color:#6a6458">GUEST LIST &middot; MARCH 26, 1883</div>
      ${names.map((n, i) => `<div style="position:relative;font-family:Playfair;font-weight:900;font-size:50px;color:${C.ink};margin-top:22px">${n}${i === 2 ? `<div style="position:absolute;left:-10px;top:30px;height:9px;width:${(420 * ease(k)).toFixed(0)}px;background:${C.ink};transform:rotate(-3deg)"></div>` : ''}</div>`).join('')}</div>`; };
  const card = (o, T) => { const u = ease(clamp01((T - w('calling')) / 0.45));
    return o ? `<div style="position:absolute;left:250px;top:${(560 - 520 * (1 - u)).toFixed(0)}px;width:520px;transform:rotate(${(-14 + 10 * u).toFixed(1)}deg);opacity:${Math.min(1, u * 3).toFixed(2)};background:#FBF8F1;padding:44px 20px;box-shadow:0 ${(10 + 40 * (1 - u)).toFixed(0)}px 30px rgba(0,0,0,.55);text-align:center">
      <div style="font-family:Playfair;font-weight:900;font-size:58px;color:${C.ink}">Mrs. Astor</div><div style="font-family:Mono;font-size:18px;letter-spacing:4px;color:#666;margin-top:10px">CALLING CARD</div></div>` : ''; };

  const shots = [
    // 0. THE HOOK, frame 0: the Electric Light, torch already blazing (flare, flicker, a push already moving), the title on tape.
    {a: 0, b: c.street, live: true, draw: (T) => plate('c_electric', T, -0.6, c.street, {key: 'h', on: -5, flare: 1, focus: [360, 560], base: 1.6, push: 0.14, spotA: 0.34}) + hookTitle(1)},
    // 1. "In 1883, one family" Fifth Avenue on the night: the carriages queue. (hard cut in from the hook)
    {a: c.street, b: c.mansion, cut: true, live: true, draw: (T) => fifth(T, {z: 1.25, ux: 1150 + T * 90, uy: 600}, {s: 1.8, fx: 900}) + src('660 fifth avenue &middot; monday, march 26, 1883', fin(T, c.street + 0.05, 0.2))},
    // 2. "spent about nine million dollars, in today's money": the house blazing, the counter in teal.
    {a: c.mansion, b: c.party, live: true, draw: (T) => fifth(T, {z: 1.0 + 0.08 * (T - c.mansion), ux: 1960, uy: 520}, {s: 1.85}) +
      dimTop(0.55) + big('$' + fmt(count(T, c.mansion - 0.15, w('dollars') + 0.3, 9000000)), fin(T, c.mansion - 0.15, 0.2), {y: 300, size: 150}) +
      op(fin(T, c.mansion, 0.3), mono("in today's money &middot; about $250,000 in 1883", {x: 40, y: 480, size: 26, color: C.teal, ls: 3, extra: 'width:860px;text-align:center'}))},
    // 3. "on a single party." The house cut open, every floor full.
    {a: c.party, b: c.door, live: true, draw: (T) => ball(T, {z: 0.8 + 0.12 * ease(clamp01((T - c.party) / 1.8)), ux: 930, uy: 600}, {s: 1.8}) +
      note('one party. one night.', fin(T, c.party + 0.05, 0.3), {y: 240, size: 64})},
    // 4. "And the guest they cared about most was one woman." A lone guest at the lit door.
    {a: c.door, b: c.hall, live: true, draw: (T) => plate('c_door', T, c.door, c.hall, {push: 0.1}) + tp('ONE WOMAN', fin(T, w('most'), 0.3), {x: 180, y: 260, size: 110})},
    // 5. "More than a thousand guests" the great hall, the quadrille.
    {a: c.hall, b: c.kings, live: true, draw: (T) => ball(T, {z: 2.3 + 0.2 * ease(clamp01((T - c.hall) / 1.6)), ux: 1040, uy: 760}, {s: 1.8}) + note('1,000+ guests', fin(T, c.hall + 0.05, 0.3), {y: 240, size: 80})},
    // 6. "came in costume." A king, a Lear, a Joan of Arc pop in.
    {a: c.kings, b: c.cat, live: true, draw: (T) => plate('c_kings', T, c.kings, c.cat, {push: 0.06}) + note('costumes only', fin(T, c.kings + 0.05, 0.3), {y: 230, size: 70})},
    // 7. "A cat, with a stuffed cat's head on top" (push to the head)
    {a: c.cat, b: c.tails, live: true, draw: (T) => plate('c_cat', T, c.cat, c.tails, {focus: [470, 420], push: 0.16}) + tp("A STUFFED CAT'S HEAD", fin(T, c.cat + 0.05, 0.25), {x: 60, y: 1080, size: 58, rot: -2, seed: 71}) + drawn('kate fearing strong', fin(T, c.cat + 0.1, 0.3))},
    // 8. "and seven cat tails sewn to her skirt." (close on the tails, which sway)
    {a: c.tails, b: c.hornet, live: true, draw: (T) => plate('c_cat', T, c.tails, c.hornet, {key: 'b', focus: [470, 1280], push: 0.2}) + tp('7 CAT TAILS', fin(T, c.tails + 0.05, 0.3), {x: 120, y: 260, size: 100})},
    // 9. "A hornet, in diamonds." (wings flick, diamonds glint)
    {a: c.hornet, b: c.devil, live: true, draw: (T) => plate('c_hornet', T, c.hornet, c.devil, {push: 0.14}) + tp('A HORNET, IN DIAMONDS', fin(T, c.hornet + 0.05, 0.25), {x: 60, y: 1080, size: 58, rot: -2, seed: 72}) + drawn('lila vanderbilt webb', fin(T, c.hornet + 0.1, 0.3))},
    // 10. "A devil in red satin,"
    {a: c.devil, b: c.fringe, live: true, draw: (T) => plate('c_devil', T, c.devil, c.fringe, {push: 0.1, focus: [470, 700]}) + tp('A DEVIL, IN RED SATIN', fin(T, c.devil + 0.05, 0.25), {x: 60, y: 1080, size: 58, rot: -2, seed: 73}) + drawn('bessie webb', fin(T, c.devil + 0.1, 0.3))},
    // 11. "trimmed with tiny demon heads." (close on the fringe, which swings)
    {a: c.fringe, b: c.duchess, live: true, draw: (T) => plate('c_devil', T, c.fringe, c.duchess, {key: 'b', focus: [520, 1150], push: 0.3}) + note('tiny demon heads!', fin(T, c.fringe + 0.05, 0.3), {y: 230, size: 70})},
    // 12. "A duchess"
    {a: c.duchess, b: c.jewels, live: true, draw: (T) => plate('c_duchess', T, c.duchess, c.jewels, {push: 0.08, focus: [470, 500]}) + tp('DUCHESS OF BURGUNDY', fin(T, c.duchess + 0.05, 0.25), {x: 60, y: 1080, size: 58, rot: -2, seed: 74}) + drawn('edith fish', fin(T, c.duchess + 0.1, 0.3))},
    // 13. "with real rubies and emeralds sewn on her dress." (the jewels sparkle one by one)
    {a: c.jewels, b: c.alice, live: true, draw: (T) => plate('c_duchess', T, c.jewels, c.alice, {key: 'b', focus: [470, 1000], push: 0.3}) + tp('REAL JEWELS', fin(T, c.jewels + 0.05, 0.3), {x: 140, y: 260, size: 100})},
    // 14. "One woman came as electricity." Mora's photograph of Alice Vanderbilt.
    {a: c.alice, b: c.elec, draw: (T) => vback(T, c.alice, c.elec, 0.06) + cut('alice_electric_light_mora_1883.png', {x: 260, y: 330, w: 420, rot: -2, o: fin(T, c.alice, 0.3), T}) + `</div>` +
      note('dressed as electricity', fin(T, c.alice + 0.05, 0.3), {y: 230, size: 64, x: 40}) + src('alice vanderbilt, &ldquo;the electric light&rdquo; &middot; photograph by josé maría mora, 1883', fin(T, c.alice + 0.1, 0.3))},
    // 15. "Her torch really lit up," (drawn: the torch flickers on)
    {a: c.elec, b: c.torch, live: true, draw: (T) => plate('c_electric', T, c.elec, c.torch, {on: w('torch') + 0.25, push: 0.06, focus: [500, 1150]}) + note('it really lit up!', fin(T, w('torch'), 0.3), {y: 210, size: 66, x: 420}) + drawn('alice vanderbilt', fin(T, c.elec + 0.1, 0.3))},
    // 16. "wired to batteries hidden in her dress." A torch like hers, glowing.
    {a: c.torch, b: c.horse, draw: (T) => { const g = 0.8 + 0.2 * Math.sin(T * 23) * Math.sin(T * 7);
      return vback(T, c.torch, c.horse, 0.06) + `<div style="position:absolute;left:380px;top:180px;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,${(0.85 * g).toFixed(2)}) 0%,rgba(200,225,255,${(0.35 * g).toFixed(2)}) 35%,rgba(160,200,255,0) 70%)"></div>` +
        cut('p01_electric_torch.webp', {x: 440, y: 300, w: 220, rot: 6, o: fin(T, c.torch, 0.3), T}) + `</div>` +
        note('batteries, hidden<br>in her dress', fin(T, c.torch + 0.05, 0.3), {y: 760, size: 64, x: 60, wd: 560}) + src('a torch like hers (re-creation)', fin(T, c.torch + 0.1, 0.3)); }},
    // 17. "Dancers galloped down the staircase on fake horses." The grand staircase; a hobby horse bounces down it.
    {a: c.horse, b: c.porc, draw: (T) => { const u = clamp01((T - c.horse) / (c.porc - c.horse)), hop = Math.abs(Math.sin(u * Math.PI * 5)) * 60;
      return vback(T, c.horse, c.porc, 0.05) + cut('660_staircase.png', {x: -460, y: 380, w: 1500, rot: 1.5, o: fin(T, c.horse, 0.3), T}) +
        cut('p03_hobby_horse.webp', {x: 560 - 340 * u, y: 560 + 420 * u - hop, w: 360, rot: -8 + 14 * Math.sin(u * Math.PI * 5), o: fin(T, c.horse + 0.1, 0.3), T}) + `</div>` +
        tp('FAKE HORSES', fin(T, c.horse + 0.05, 0.3), {x: 100, y: 240, size: 96}) + src('the grand staircase, 660 fifth avenue (about 1902) &middot; hobby horse: re-creation', fin(T, c.horse + 0.1, 0.3)); }},
    // 18. "The last dance" the Dresden quadrille: living porcelain dolls, turning in step.
    {a: c.porc, b: c.dawn, live: true, draw: (T) => plate('c_porcelain', T, c.porc, c.dawn, {push: 0.08}) + note('the last dance...', fin(T, c.porc + 0.05, 0.3), {y: 230, size: 70}) + drawn('the dresden quadrille', fin(T, c.porc + 0.1, 0.3))},
    // 19. "ended at sunrise." Fifth Avenue at dawn, guests leaving.
    {a: c.dawn, b: c.alva, live: true, draw: (T) => fifth(T, {z: 1.3, ux: 2050, uy: 640}, {s: 1.8, dawn: 0.75, fx: 960}) + note('...ended at sunrise', fin(T, c.dawn + 0.05, 0.3), {y: 230, size: 70})},
    // 20. "The host was Alva Vanderbilt." Mora's photograph.
    {a: c.alva, b: c.newm, draw: (T) => vback(T, c.alva, c.newm, 0.06) + cut('alva_mora_1883.png', {x: 110, y: 330, w: 720, rot: -1.5, o: fin(T, c.alva, 0.3), T}) + `</div>` +
      note('the host: alva vanderbilt', fin(T, c.alva + 0.05, 0.3), {y: 230, size: 60, x: 40}) + src('alva vanderbilt, at the ball &middot; photograph by josé maría mora, 1883', fin(T, c.alva + 0.1, 0.3))},
    // 21. "Her family was new money: rich, but not accepted." Her house, blazing.
    {a: c.newm, b: c.oldm, live: true, draw: (T) => fifth(T, {z: 1.6 + 0.15 * (T - c.newm), ux: 1900, uy: 470}, {s: 1.8}) + dimTop(0.45) +
      tp('NEW MONEY', fin(T, c.newm + 0.05, 0.25), {x: 120, y: 260, size: 120}) + note('rich, but not accepted', fin(T, w('rich') - 0.2, 0.3), {y: 470, size: 62, x: 80})},
    // 22. "And the queen of old money, Mrs. Astor,"
    {a: c.oldm, b: c.front, draw: (T) => vback(T, c.oldm, c.front, 0.06) + cut('astor_bust.png', {x: 140, y: 470, w: 680, rot: 2, o: fin(T, c.oldm, 0.3), T}) + `</div>` +
      tp('OLD MONEY', fin(T, c.oldm + 0.05, 0.25), {x: 140, y: 260, size: 120, rot: 3, seed: 64}) + src('mrs. caroline astor &middot; photograph, 1850s', fin(T, c.oldm + 0.1, 0.3))},
    // 23. "had never once come to her house." The front door of 660 Fifth, shut.
    {a: c.front, b: c.list, draw: (T) => vback(T, c.front, c.list, 0.07) + cut('660_entrance.png', {x: 60, y: 380, w: 820, rot: -1.5, o: fin(T, c.front, 0.3), T}) + `</div>` +
      note('never. not once.', fin(T, c.front + 0.05, 0.3), {y: 230, size: 72}) + src('the front door, 660 fifth avenue (1880s plate)', fin(T, c.front + 0.1, 0.3))},
    // 24. "The story goes, Alva left Mrs. Astor's daughter off the guest list." A name, struck out.
    {a: c.list, b: c.carriage, draw: (T) => vdesk() + listCard(T) + note('the story goes...', fin(T, c.list - 0.05, 0.3), {y: 230, size: 76})},
    // 25. "So Mrs. Astor" a carriage draws up at the door.
    {a: c.carriage, b: c.salver, live: true, draw: (T) => fifth(T, {z: 2.1, ux: DOOR - 120 + 30 * (T - c.carriage), uy: 820}, {s: 1.8})},
    // 26. "gave in, and left her calling card." A card lands on the silver salver.
    {a: c.salver, b: c.came, draw: (T) => vback(T, c.salver, c.came, 0.05) + cut('p02_silver_salver_cards.webp', {x: 40, y: 640, w: 860, rot: -3, o: fin(T, c.salver, 0.3), T}) + `</div>` +
      card(1, T) + note('(so the story goes)', fin(T, c.salver + 0.05, 0.3), {y: 230, size: 64}) + src('a salver like theirs (re-creation)', fin(T, c.salver + 0.1, 0.3))},
    // 27. "She came to the ball." Mrs. Astor in the great hall.
    {a: c.came, b: c.kitchen, live: true, draw: (T) => ball(T, {z: 2.0 + 0.3 * ease(clamp01((T - c.came) / 2)), ux: 1000, uy: 740}, {s: 1.8}) +
      vcut(E2 + 'astor_bust.png', {x: 300, y: 760, w: 420, rot: -2, o: fin(T, c.came + 0.1, 0.35), T}) + tp('SHE CAME.', fin(T, w('came', 3) - 0.2, 0.25), {x: 160, y: 260, size: 120})},
    // 28. "Downstairs, a maid carried the ice cream up from the cellar." Nora (coral) in the kitchen.
    {a: c.kitchen, b: c.tray, live: true, draw: (T) => ball(T, {z: 3.8, ux: noraX(T) + 40, uy: CH.fl.b - 110}, {s: 1.8}) + note('downstairs', fin(T, c.kitchen - 0.1, 0.3), {y: 230, size: 76}) + coralNote(fin(T, c.kitchen + 0.1, 0.3))},
    // 29. NORA: "Don't drop it. Don't drop it." Close on her and the trembling tray; her words in coral.
    {a: c.tray, b: c.wage, live: true, draw: (T) => ball(T, {z: 7.0 + 0.6 * ease(clamp01((T - c.tray) / 2.4)), ux: noraX(T) + 6 + Math.sin(T * 40) * 0.6, uy: CH.fl.b - 62}, {s: 1.8}) +
      note('&ldquo;don&rsquo;t drop it.&rdquo;', fin(T, w("Don't", 1) - 0.05, 0.25), {y: 240, size: 84, color: C.coral}) + coralNote(1)},
    // 30. "She earned less than four dollars a week."
    {a: c.wage, b: c.bill, draw: (T) => vback(T, c.wage, c.bill, 0.05) + cut('p01_silver_tray_ices.webp', {x: 120, y: 900, w: 700, rot: 3, o: fin(T, c.wage, 0.3), T}) + `</div>` +
      op(fin(T, c.wage + 0.05, 0.3), mono("her pay", {x: 40, y: 280, size: 34, color: C.cream, ls: 6, extra: 'width:860px;text-align:center'})) +
      big('under $4', fin(T, c.wage + 0.05, 0.3), {y: 340, size: 190}) + big('a week', fin(T, c.wage + 0.1, 0.3), {y: 550, size: 110})},
    // 31. "To pay for that one night,"
    {a: c.bill, b: c.years, draw: (T) => vback(T, c.bill, c.years, 0.05) + cut('p03_champagne.webp', {x: 300, y: 900, w: 520, rot: -3, o: fin(T, c.bill, 0.3), T}) + `</div>` +
      op(fin(T, c.bill + 0.05, 0.3), mono('the party (as reported)', {x: 40, y: 280, size: 34, color: C.cream, ls: 6, extra: 'width:860px;text-align:center'})) +
      big('$250,000', fin(T, c.bill + 0.05, 0.3), {y: 340, size: 170, color: C.cream}) + op(fin(T, c.bill + 0.1, 0.3), mono('&asymp; $9 million today', {x: 40, y: 540, size: 34, color: C.teal, ls: 4, extra: 'width:860px;text-align:center'}))},
    // 32. "she'd have needed more than 1,300 years." The years tick up.
    {a: c.years, b: c.nora, draw: (T) => vdesk() + op(fin(T, c.years + 0.05, 0.3), mono('$250,000 &divide; about $187 a year', {x: 40, y: 300, size: 34, color: C.teal, ls: 3, extra: 'width:860px;text-align:center'})) +
      big(fmt(count(T, c.years + 0.1, w('1300') + 0.9, 1335)), fin(T, c.years + 0.05, 0.25), {y: 420, size: 230}) + big('years', fin(T, c.years + 0.1, 0.3), {y: 680, size: 120})},
    // 33. Nora below stairs, the ball lit above her; the answer carried over.
    {a: c.nora, b: c.end, live: true, draw: (T) => ball(T, {z: 1.6, ux: 520, uy: 780 + 20 * (T - c.nora)}, {s: 1.8}) + dimTop(0.35) +
      big('1,300+ years', 1, {y: 300, size: 130}) + op(1, mono('of her pay, for one night', {x: 40, y: 450, size: 32, color: C.teal, ls: 4, extra: 'width:860px;text-align:center'})) + coralNote(1)},
    // 34. The end card.
    {a: c.end, b: dur, live: true, draw: (T) => endCard(T, c.end, 2)},
  ];
  return {ch, dur, shots, fadeOut: 0.3, capEnd: c.end + 0.15};
};
// the hook's title: "THE $9 MILLION PARTY" on torn orange tape, a small 1883 tag, inside the safe area (x 40 to 900)
const hookTitle = (o) => op(o, tape('1883', {x: 70, y: 838, size: 46, rot: -4, seed: 81, bg: C.cream}) +
  tape('THE $9 MILLION', {x: 56, y: 900, size: 88, rot: -3, seed: 82}) + tape('PARTY', {x: 300, y: 1004, size: 88, rot: -2, seed: 83}));
// the cover (shorts/review/s3_cover.jpg): the cat plate, the title, 1883, the mark small
window.COVERS = Object.assign(window.COVERS || {}, {s3: () => costumePlate('c_cat', 1.2, 0, 2.5, {key: 'cv', focus: [470, 600], push: 0.1, base: 1.05}) +
  op(1, tape('1883', {x: 70, y: 1010, size: 52, rot: -4, seed: 81, bg: C.cream}) + tape('THE $9 MILLION', {x: 50, y: 1080, size: 96, rot: -3, seed: 82}) + tape('PARTY', {x: 290, y: 1192, size: 96, rot: -2, seed: 83})) +
  vsvg(chunkMark(90, 270, 90, 0, 1)) + op(1, mono('chunk history', {x: 150, y: 252, size: 26, color: C.cream, ls: 4}))});
// a soft darkening of the top of the frame, so teal and orange text reads over a bright scene
const dimTop = (a) => `<div style="position:absolute;left:0;top:0;width:1080px;height:760px;background:linear-gradient(rgba(8,9,8,${a}),rgba(8,9,8,0))"></div>`;
