// Short 2, "Rockefeller's Father" (51.2 s): Ep1 ch06's opening, the con-man father to Standard Oil, cut on the words of
// public/audio/s2_rockefeller.words.json. Repeats counted: "father" 3 = borrowed from his father, "his" 3 = "His father
// charged"; "He" 2 = vanished; "John" 2 = John learned; "At" 2 = at 16, "At" 3 = at 19; "interest" 2 = turkey, 3 = the loan.
EDITS.s2 = () => {
  const ch = 's2_rockefeller', w = (word, n) => wordAt(ch, word, n), dur = window.WORDS[ch].duration;
  const c = {
    father: w('John', 1) - 0.25, photo: w('Even') - 0.3, vanish: w('He', 2) - 0.25, mother: w('So') - 0.25, learn: w('John', 2) - 0.25,
    turkey: w('As') - 0.25, book: w('At', 2) - 0.25, loan: w('At', 3) - 0.25, charged: w('His', 3) - 0.25, paid: w('He', 7) - 0.25,
    oil: w('Then') - 0.3, how: w('How') - 0.3, end: dur - 2.0,
  };
  function medicine(T) {
    const G = 900, u = (T - c.father) / (c.photo - c.father), s = [];
    s.push(`<defs>${MAT_DEFS}<linearGradient id="msky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E3336"/><stop offset=".65" stop-color="#5E7C76"/><stop offset="1" stop-color="#B9C4B2"/></linearGradient></defs>`);
    s.push(`<rect width="1920" height="1080" fill="url(#msky)"/>`);
    s.push(`<path d="M0,690 Q300,610 620,660 T1240,640 T1920,670 L1920,1080 L0,1080 Z" fill="#3E5A55"/><path d="M0,760 Q400,700 900,740 T1920,730 L1920,1080 L0,1080 Z" fill="#2C4440"/>`);
    // false-front wooden stores
    [[80, 360, 300], [420, 300, 260], [1380, 340, 300], [1700, 380, 240]].forEach(([x, top, w], i) => {
      s.push(MAT.planks(x, G - (G - top), w, G - top, {base: ['#2B3A36', '#26332F', '#2E3E3A', '#24312D'][i], seed: 300 + i, size: 14, vertical: true}));
      s.push(`<rect x="${x - 6}" y="${top - 6}" width="${w + 12}" height="12" fill="#151E1C"/><rect x="${x + w * 0.25}" y="${G - 190}" width="${w * 0.22}" height="190" fill="#111816"/>
        <rect x="${x + w * 0.58}" y="${G - 170}" width="${w * 0.3}" height="90" fill="#C9B98A" opacity="${(0.25 + 0.2 * Math.sin(T * 2 + i)).toFixed(2)}"/>`);
    });
    s.push(`<rect x="0" y="${G}" width="1920" height="180" fill="#0D0C09"/>` + MAT.ground(0, 1920, G, {seed: 64}));
    // the wagon, a covered medicine-show box wagon; it rolls off at the end
    const wx = 860 + 900 * ease(clamp01((T - (c.photo - 1.0)) / 1.2));
    s.push(`<g transform="translate(${wx.toFixed(1)},0)"><rect x="-200" y="${G - 300}" width="400" height="210" fill="#1A1714"/>
      <path d="M-210,${G - 300} Q0,${G - 380} 210,${G - 300} Z" fill="#14110F"/><rect x="-170" y="${G - 260}" width="340" height="120" fill="#2A2420" stroke="#4A3F33" stroke-width="5"/>
      ${[-130, 130].map((dx) => `<circle cx="${dx}" cy="${G - 52}" r="56" fill="none" stroke="#0A0908" stroke-width="12"/>` + Array.from({length: 8}, (_, k) => { const a = k * Math.PI / 4 + (wx - 860) / 56;
        return `<line x1="${dx}" y1="${G - 52}" x2="${(dx + Math.cos(a) * 52).toFixed(1)}" y2="${(G - 52 + Math.sin(a) * 52).toFixed(1)}" stroke="#0A0908" stroke-width="6"/>`; }).join('')).join('')}
      <rect x="-210" y="${G - 96}" width="420" height="14" fill="#0A0908"/></g>`);
    // his father on the tailboard, holding up a bottle; the crowd
    const raise = 0.5 + 0.5 * Math.sin(T * 2.2);
    if (wx < 1500) s.push(figure({x: wx - 230, y: G - 82, h: 320, d: -1, kind: 'man', hat: 'top', coat: 'frock', fill: '#0A0908', prop: 'bottle',
      rim: {c: '#E8D9B8', a: 0.55, dx: -0.006, dy: -0.004}, an: {fArm: [48 - 22 * raise, 20 - 18 * raise], bArm: [196, 204], tilt: 8, lean: 2}}));
    const r = rng(611);
    for (let i = 0; i < 8; i++) { const x = 70 + i * 66 + (r() - 0.5) * 24, kind = ['man', 'woman', 'man', 'boy', 'woman', 'man', 'girl', 'man'][i];
      s.push(figure({x, y: G + 40 + (i % 2) * 22, h: (kind === 'boy' || kind === 'girl') ? 200 : 290 + (r() - 0.5) * 20, d: 1, kind, hat: kind === 'woman' ? (i % 2 ? 'kerchief' : 'lady') : kind === 'man' ? ['bowler', 'cap', 'none'][i % 3] : 'none',
        coat: kind === 'woman' ? 'frock' : 'jacket', fill: '#121110', rim: {c: '#E8D9B8', a: 0.4, dx: -0.006, dy: -0.004}, an: {tilt: 10 + 3 * Math.sin(T + i), bob: 0.004 * Math.sin(T * 1.3 + i)}})); }
    return `<div style="position:absolute;inset:0;transform:scale(${(1 + 0.05 * ease(u)).toFixed(4)});transform-origin:900px 700px">${svg(s.join(''))}</div>` +
      '';
  }
  const cardV = (x, y, rot, name, o) => op(o, `<div style="position:absolute;left:${x}px;top:${y}px;width:640px;transform:rotate(${rot}deg);background:${C.cream};padding:44px 30px;box-shadow:0 18px 30px rgba(0,0,0,.6);text-align:center">
    <div style="font-family:Playfair;font-weight:900;font-size:56px;color:${C.ink}">${name}</div><div style="font-family:Mono;font-size:20px;letter-spacing:4px;color:#555;margin-top:10px">CALLING CARD</div></div>`);

  const shots = [
    // 1. The hook, on frame 0: the richest man, already on the desk; his father arrives; "+ INTEREST" on "interest".
    {a: 0, b: c.father, draw: (T) => vback(T, 0, c.father) +
      vcut('desk/rockefeller_1880_bust.png', {x: 90, y: 260, w: 560, rot: -2, o: 1, T, caption: 'john d. rockefeller', cx: 40}) +
      vcut('desk/rockefeller_father_bust.png', {x: 500, y: 640, w: 400, rot: 3, o: fin(T, w('father', 1), 0.4), T, caption: 'his father', cx: 60, cy: 420}) + `</div>` +
      op(1, tape('RICHEST EVER', {x: 420, y: 250, size: 70, rot: 3, seed: 51})) +
      (fin(T, w('interest', 1)) > 0 ? slideUp(fin(T, w('interest', 1)), tape('+ INTEREST', {x: 90, y: 1000, size: 90, rot: -3, seed: 53})) : '')},
    // 2. His father's medicine show (drawn: no photo of this), the wagon cropped tall.
    {a: c.father, b: c.photo, live: true, draw: (T) => wide(medicine(T), {s: 1.85, fx: 780, fy: 620}) +
      op(fin(T, w('almost')), pen('"cures almost<br>anything"', {x: 120, y: 260, size: 60, rot: -4, color: C.orange, w: 700}))},
    // 3. "Even cancer. It couldn't." His father's photograph and the bottle.
    {a: c.photo, b: c.vanish, draw: (T) => vback(T, c.photo, c.vanish) +
      vcut('desk/rockefeller_father_bust.png', {x: 80, y: 300, w: 520, rot: -2, o: fin(T, c.photo + 0.05, 0.4), T, caption: 'william avery rockefeller', cx: 0}) +
      vprop('p06_medicine_bottle', {x: 600, y: 420, w: 260, rot: 5, o: fin(T, c.photo + 0.2, 0.4), T}) + `</div>` +
      op(fin(T, w('Even')), pen('even cancer!', {x: 560, y: 300, size: 54, rot: -6, color: C.orange})) +
      op(fin(T, w("couldn't")), tape("IT COULDN'T.", {x: 130, y: 960, size: 96, rot: -4, seed: 55}))},
    // 4. "He vanished for months ... a second wife under a fake name." Two calling cards, one man.
    {a: c.vanish, b: c.mother, draw: (T) => vdesk() + cardV(120, 330, -4, 'Wm. A. Rockefeller', fin(T, c.vanish + 0.1)) +
      op(fin(T, w('months')), pen('gone for months', {x: 200, y: 560, size: 54, rot: -3, color: C.orange})) +
      op(fin(T, w('second')), pen('a second wife...', {x: 260, y: 660, size: 54, rot: -3, color: C.orange})) +
      cardV(240, 820, 3, 'Dr. Wm. Levingston', fin(T, w('fake'), 0.3)) +
      vsvg(drawLine([[440, 480], [520, 830]], clamp01((T - w('fake')) / 0.4), {w: 8}))},
    // 5. "So John's mother ran the farm, and counted every penny."
    {a: c.mother, b: c.learn, draw: (T) => vback(T, c.mother, c.learn) +
      vcut('desk/rockefeller_mother_bust.png', {x: 140, y: 270, w: 560, rot: -2, o: fin(T, c.mother + 0.05, 0.5), T, caption: 'eliza, his mother', cx: 0}) +
      vprop('p06_coins_stack', {x: 460, y: 760, w: 440, rot: -3, o: fin(T, w('counted'), 0.4), T}) + `</div>` +
      op(fin(T, w('counted')), pen('every penny', {x: 120, y: 900, size: 58, rot: -4, color: C.orange}))},
    // 6. "John learned to count them too." John at 18.
    {a: c.learn, b: c.turkey, draw: (T) => vback(T, c.learn, c.turkey, 0.06) +
      vcut('desk/rockefeller_18_bust.png', {x: 150, y: 280, w: 620, rot: 2, o: fin(T, c.learn + 0.05, 0.4), T, caption: 'john, at 18', cx: 0}) + `</div>`},
    // 7. The turkey money: $50 lent to a neighbour, back with interest.
    {a: c.turkey, b: c.book, draw: (T) => vback(T, c.turkey, c.book) +
      vprop('p06_turkey', {x: 80, y: 260, w: 560, rot: 0, o: fin(T, w('turkey'), 0.4), T}) +
      vprop('p06_coins_stack', {x: 460, y: 700, w: 420, rot: 3, o: fin(T, w('lent'), 0.4), T}) + `</div>` +
      bigNum('$50', {x: 720, y: 330, size: 150, o: fin(T, w('50'), 0.3)}) +
      op(fin(T, w('interest', 2)), pen('...back with interest', {x: 100, y: 1010, size: 54, rot: -3, color: C.orange}))},
    // 8. At 16: every penny in a little red notebook.
    {a: c.book, b: c.loan, draw: (T) => vback(T, c.book, c.loan) +
      vprop('p06_red_notebook', {x: 100, y: 520, w: 760, rot: 3, o: fin(T, w('notebook') - 0.6, 0.5), T}) + `</div>` +
      bigNum('16', {y: 250, size: 220, o: fin(T, w('16'), 0.3)}) +
      op(fin(T, w('notebook')) * 0.85, mono('a notebook like his', {x: 120, y: 1080, size: 22, color: '#9a958c'}))},
    // 9. At 19: $1,000 borrowed from his father.
    {a: c.loan, b: c.charged, draw: (T) => vback(T, c.loan, c.charged) +
      vprop('p05_note_1868', {x: 80, y: 640, w: 800, rot: -3, o: fin(T, w('1000'), 0.4), T}) +
      vcut('desk/rockefeller_father_bust.png', {x: 560, y: 260, w: 340, rot: 4, o: fin(T, w('father', 3), 0.4), T}) + `</div>` +
      bigNum('19', {x: 260, y: 250, size: 200, o: fin(T, w('19'), 0.3)}) +
      bigNum('$1,000', {y: 470, size: 140, color: C.teal, o: fin(T, w('1000'), 0.3)})},
    // 10. "His father charged him interest." The father, close, and the tape.
    {a: c.charged, b: c.paid, draw: (T) => vback(T, c.charged, c.paid, 0.08) +
      vcut('desk/rockefeller_father_bust.png', {x: 110, y: 260, w: 700, rot: -2, o: 1, T}) + `</div>` +
      (fin(T, w('interest', 3)) > 0 ? slideUp(fin(T, w('interest', 3)), tape('+ INTEREST', {x: 140, y: 1000, size: 110, rot: -4, seed: 57})) : '')},
    // 11. "He paid it back." The note, stamped paid.
    {a: c.paid, b: c.oil, draw: (T) => vback(T, c.paid, c.oil) +
      vprop('p05_note_1868', {x: 80, y: 520, w: 800, rot: 2, o: 1, T}) + `</div>` +
      op(fin(T, w('back'), 0.15), `<div style="position:absolute;left:250px;top:${600 - 40 * (1 - fin(T, w('back'), 0.15))}px;transform:rotate(-12deg);border:10px solid ${C.teal};color:${C.teal};font-family:Abril;font-size:130px;padding:0 30px;line-height:1.2">PAID</div>`)},
    // 12. "Then he built Standard Oil, and controlled about 90 percent of America's oil."
    {a: c.oil, b: c.how, draw: (T) => vback(T, c.oil, c.how, 0.05) +
      vcut('desk/oil_derricks_1866.png', {x: -200, y: 300, w: 1300, rot: -1.5, o: fin(T, c.oil + 0.05, 0.5), T}) +
      vprop('p06_oil_barrel', {x: 560, y: 680, w: 320, rot: 2, o: fin(T, w('Standard'), 0.4), T}) + `</div>` +
      op(fin(T, c.oil + 0.4) * 0.9, mono('oil wells, pennsylvania, 1866', {x: 60, y: 230, size: 22})) +
      bigNum('~90%', {y: 820, size: 210, o: fin(T, w('90'), 0.3)}) +
      op(fin(T, w('90')), `<div style="position:absolute;left:120px;top:1060px;width:700px;height:30px;background:rgba(244,239,230,.15)"><div style="width:${(630 * ease(clamp01((T - w('90')) / 0.8))).toFixed(0)}px;height:30px;background:${C.teal}"></div></div>`)},
    // 13. "How he did it is on Chunk History." Rockefeller, older.
    {a: c.how, b: c.end, draw: (T) => vback(T, c.how, c.end, 0.05) +
      vcut('desk/rockefeller_1880_bust.png', {x: 160, y: 280, w: 600, rot: 2, o: 1, T}) + `</div>`},
    // 14. The end card.
    {a: c.end, b: dur, live: true, draw: (T) => endCard(T, c.end)},
  ];
  return {ch, dur, shots, fadeOut: 0.3, capEnd: c.end + 0.15};
};
