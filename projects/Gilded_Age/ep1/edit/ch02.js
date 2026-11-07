// Chapter 2, "The Name" (1:01 to 2:04): the novel, gilded vs gilt, the railroads, the day of two noons. Shots 6 to 9 of ANIMATION_PLAN.md.
EDITS.ch02 = () => {
  const ch = 'ch02_the_name', w = (word, n) => wordAt(ch, word, n), dur = window.WORDS[ch].duration;
  const cut = {
    novel: w('In', 1) - 0.25, gilded: w('Gilded', 2) - 0.3, neck: w('If', 1) - 0.25, era: w('People') - 0.3,
    clocks: w('They', 2) - 0.25, map: w('So', 2) - 0.25, noon: w('Some') - 0.2, watch: w('If', 2) + 1.3, rails: w('And', 3) - 0.25,
  };
  const backdrop = (T, a, b, z = 0.035) => `<div style="position:absolute;inset:0;transform:scale(${(1 + z * ease((T - a) / (b - a))).toFixed(4)})">${desk()}`;
  // Local mean (sun) time at the same instant, from longitude: 4 minutes per degree west of Boston (71.06 W).
  const towns = [['Boston', 71.06], ['New York', 74.01], ['Philadelphia', 75.16], ['Pittsburgh', 80.0]];
  const shots = [
    // 1. The section: "First, the name. Because the name is an insult."
    {a: 0, b: cut.novel, draw: (T) => `${desk()}` +
      op(fin(T, 0.2), mono('chapter 2', {x: 140, y: 330, size: 28, color: C.teal, ls: 6})) +
      slideUp(fin(T, w('First')), tape('THE NAME', {x: 128, y: 380, size: 150, rot: -2, seed: 6})) +
      op(fin(T, w('insult')), pen('...is an insult', {x: 760, y: 640, size: 64, rot: -5, color: C.orange}))},
    // 2. Mark Twain (and a friend) wrote the novel: Twain as a bust cut-out, then the title page. "They called it The Gilded Age."
    {a: cut.novel, b: cut.gilded, draw: (T) => backdrop(T, cut.novel, cut.gilded) +
      deskCut('desk/twain_1871_bust.png', {x: 190, y: 190, w: 470, rot: -2, o: fin(T, w('Mark'), 0.7), T, caption: 'mark twain, 1871', cx: 120}) +
      deskCut('desk/novel_title_page.png', {x: 1050, y: 130, w: 560, rot: 2.5, o: fin(T, w('They', 1), 0.7), T}) + `</div>` +
      stamp('1873', fin(T, w('1873'))) +
      op(fin(T, w('making')) * fout(T, w('They', 1) - 0.3, 0.4), pen('poking fun at greedy<br>businessmen and<br>crooked politicians', {x: 660, y: 640, size: 40, rot: -4, color: C.orange, w: 460}))},
    // 3. Gilded: a gold bar; on "gilt" it is the same bar with the gold peeling back off grey metal.
    {a: cut.gilded, b: cut.neck, draw: (T) => {
      const peel = fin(T, w('gilt'), 0.6);
      return backdrop(T, cut.gilded, cut.neck) +
        op(1 - peel, deskProp('p02_gold_bar_solid', {x: 340, y: 380, w: 760, rot: -3, o: fin(T, w('Gilded', 2), 0.6), T})) +
        op(peel, deskProp('p02_gold_bar_peeled', {x: 340, y: 340, w: 760, rot: -3, o: 1, T})) + `</div>` +
        vocabCard('GILDED', 'GIL-did', 'adjective', 'covered in a thin layer of gold', {o: fin(T, w('Gilded', 2), 0.6)}) +
        op(fin(T, w('gilt')), pen('the thin coat is the <u>gilt</u>', {x: 1190, y: 520, size: 46, rot: -4, color: C.orange})) +
        op(fin(T, w('Shiny', 2)), pen('shiny outside', {x: 980, y: 700, size: 46, rot: -3, color: C.orange}) + svg(arrow([970, 740], [820, 560], 50))) +
        op(fin(T, w('cheap', 1)), pen('cheap metal underneath', {x: 380, y: 860, size: 46, rot: -2, color: C.orange}) + svg(arrow([600, 850], [700, 700], -40)));
    }},
    // 4. "If a 'gold' necklace has ever turned your neck green": the necklace, and the green coming through.
    {a: cut.neck, b: cut.era, draw: (T) => {
      const g = fin(T, w('green'), 1.0);
      return backdrop(T, cut.neck, cut.era) +
        deskProp('p02_green_necklace', {x: 560, y: 150, w: 720, rot: 4, o: fin(T, w('necklace'), 0.6), T}) +
        op(g * 0.55, `<div style="position:absolute;left:560px;top:150px;width:720px;transform:rotate(4deg);mix-blend-mode:color;
            -webkit-mask-image:radial-gradient(circle at 70% 78%,#000 0,#000 9%,transparent 16%),radial-gradient(circle at 30% 22%,#000 0,transparent 14%),radial-gradient(circle at 60% 40%,#000 0,transparent 12%),radial-gradient(circle at 22% 62%,#000 0,transparent 10%)">
            <img src="${IMG}props/p02_green_necklace.webp" style="display:block;width:100%;filter:sepia(1) hue-rotate(60deg) saturate(2.2) brightness(.95)"></div>`) + `</div>` +
        op(fin(T, w('gilded', 3)), pen('gilded', {x: 1280, y: 760, size: 64, rot: -5, color: C.orange}));
    }},
    // 5. The whole era, and the railroads: the 1883 railroad map as an aged print.
    {a: cut.era, b: cut.clocks, draw: (T) => backdrop(T, cut.era, cut.clocks, 0.06) +
      deskCut('desk/railroad_map_1883.png', {x: 160, y: 120, w: 1600, rot: -1.2, o: fin(T, cut.era, 0.6), T}) + `</div>` +
      slideUp(fin(T, w('about', 1)), tape('THE GILDED AGE &middot; ABOUT 1870 TO 1900', {x: 120, y: 820, size: 58, rot: -2, seed: 9})) +
      op(fin(T, w('Especially')), pen('especially the railroads', {x: 1150, y: 940, size: 46, rot: -3, color: C.orange})) +
      op(fin(T, cut.era + 0.4) * 0.85, mono('railroad map of the united states, 1883', {x: 1240, y: 60, size: 20}))},
    // 6. "Every town used to set its clocks by the sun": four towns, the same instant, four different times.
    {a: cut.clocks, b: cut.map, draw: (T) => {
      const tick = (T - cut.clocks) / 3600;
      return desk() + svg(clockDefs + towns.map(([n, lon], i) => {
          const o = fin(T, w('Every') + i * 0.35, 0.5); if (o <= 0) return '';
          return `<g opacity="${o.toFixed(3)}" transform="translate(0,${((1 - ease(o)) * 40).toFixed(1)})">${stationClock(300 + i * 440, 470, 150, 12 - (lon - 71.06) * 4 / 60 + tick)}</g>`;
        }).join('')) +
        towns.map(([n], i) => op(fin(T, w('Every') + i * 0.35, 0.5), mono(n, {x: 300 + i * 440 - 120, y: 680, size: 28, extra: 'width:240px;text-align:center'}))).join('') +
        op(fin(T, w('clocks')), mono('the same moment &middot; local sun time', {x: 640, y: 160, size: 26, color: C.teal, ls: 4})) +
        op(fin(T, w('nightmare')), pen('now try writing a train schedule', {x: 560, y: 820, size: 50, rot: -3, color: C.orange}));
    }},
    // 7. "So in 1883, the railroads switched the country to a handful of time zones."
    {a: cut.map, b: cut.noon, draw: (T) => backdrop(T, cut.map, cut.noon, 0.05) +
      deskCut('desk/standard_time_map_1883.png', {x: 180, y: 150, w: 1560, rot: 1, o: fin(T, cut.map, 0.6), T}) + `</div>` +
      stamp('Nov. 18, 1883', fin(T, w('1883'))) +
      op(fin(T, w('zones')), pen('4 zones across the U.S.', {x: 1180, y: 900, size: 54, rot: -4, color: C.orange}))},
    // 8. The day of two noons, New York: noon strikes, the clock is set back about four minutes, and noon strikes again.
    {a: cut.noon, b: cut.watch, draw: (T) => {
      const n1 = w('noon'), back = w('twice'), n2 = cut.watch - 0.4;
      let tm; if (T < n1) tm = 12 - (n1 - T) / 3600 * 6; else if (T < back) tm = 12 + (T - n1) / 3600;
      else if (T < back + 0.6) tm = 12 - (4 / 60) * ease((T - back) / 0.6); else tm = 12 - 4 / 60 + (4 / 60) * ease((T - back - 0.6) / (n2 - back - 0.6));
      const flash = Math.max(Math.exp(-Math.max(0, T - n1) * 3) * (T >= n1), Math.exp(-Math.max(0, T - n2) * 3) * (T >= n2));
      return desk() + svg(clockDefs + stationClock(960, 500, 300, tm, {flash})) +
        op(fin(T, cut.noon), mono('new york city &middot; Nov. 18, 1883', {x: 960 - 330, y: 120, size: 28, extra: 'width:660px;text-align:center'})) +
        op(fin(T, n1), pen('noon...', {x: 1320, y: 300, size: 60, rot: -5, color: C.orange})) +
        op(fin(T, back), pen('set back 4 minutes', {x: 1320, y: 420, size: 48, rot: -4, color: C.orange})) +
        op(fin(T, n2), pen('...noon again', {x: 1320, y: 540, size: 60, rot: -5, color: C.orange}));
    }},
    // 9. "If you live in North America, the time zone you're in right now? It started with the railroads."
    {a: cut.watch, b: cut.rails, draw: (T) => backdrop(T, cut.watch, cut.rails) +
      deskProp('p02_railroad_watch', {x: 600, y: 230, w: 720, rot: -4, o: fin(T, cut.watch, 0.6), T}) + `</div>` +
      op(fin(T, w('started')), pen('your time zone:<br>railroad time', {x: 1250, y: 300, size: 56, rot: -5, color: C.orange, w: 560}))},
    // 10. "And all those trains needed rails. Which were about to get very cheap." (hand-off to chapter 3)
    {a: cut.rails, b: dur, draw: (T) => backdrop(T, cut.rails, dur) +
      deskProp('p03_steel_rail', {x: 520, y: 260, w: 880, rot: -2, o: fin(T, w('rails'), 0.6), T}) + `</div>` +
      op(fin(T, w('very')), pen('very cheap', {x: 1240, y: 760, size: 64, rot: -5, color: C.orange}))},
  ];
  return {dur, shots, fadeOut: 0.5};
};
