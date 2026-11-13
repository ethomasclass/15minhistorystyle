// Chapter 8, "Shut the Door" (116.0 s of narration + the baton card). Across the country to California; Denis Kearney (an
// 1878 engraving) and his slogan, and where he was born; the Exclusion Act and the 1882 head tax on the walls-and-welcome
// timeline (ep3_laws); the word nativism on the nativism desk (ep3_nativism); Puck's 1882 "anti-Chinese wall" (brief, framed by
// the narration, never animated); Keppler's "Looking Backward" (1893), the guided read retimed to the narration
// (ep3_looking_backward); the other side: the timeline's welcome row, Emma Lazarus, the statue in Paris, the poem; the pedestal
// in 1885 and the fund (ep3_pedestal); across the river to the Kellys, and the card "New Neighbors" lands on "new neighbors".
EDITS.ch08 = () => {
  const ch = 'ch08_shut_the_door', W = window.WORDS[ch], w = (word, n) => wordAt(ch, word, n);
  const cardAt = W.words[W.words.length - 2].s, dur = cardAt + CARD_HOLD;            // "new neighbors": the card lands on "new"
  const L = (word, near) => lWord(ch, word, near);
  const c = {other: L('other', 2.24), cal: L('California,', 4.08), chinese: L('Chinese', 6.42),
    railroads: L('railroads', 8.06), one: L('One', 10.66), kearney: L('Kearney.', 12.66), ended: L('ended', 13.74), must: L('The', 15.16),
    kimm: L('Kearney', 17.54), ireland: L('Ireland.', 19.88), in82: L('In', 21.06), passed: L('passed', 22.86), banned: L('banned', 25.46),
    first: L('first', 29.14), same: L('That', 33.62), taxing: L('taxing', 35.4), turning: L('turning', 37.26), hostility: L('Hostility', 41.2),
    nativism: L('nativism.', 43.98), pattern: L('strange', 45.64), puck: L('In', 47.4), irish: L('Irish,', 54.42), immigrants: L('Immigrants,', 57.46),
    nine: L('Nine', 59.86), rich: L('Rich', 64.28), look: L('But', 66.98), each: L('Each', 68.78), caption: L('The', 74.02), kepImm: L('Keppler', 79.46),
    but: L('But', 82.56), in83: L('In', 84.26), lazarus: L('Emma', 86.48), vol: L('volunteered', 87.76), statue: L('giant', 90.84), give: L('Give',
    92.74), huddled: L('huddled', 96.32), needed: L('needed', 99.98), ran: L('ran', 101.7), so: L('So', 102.7), more: L('More', 105.96), most: L('most',
    108.56), and: L('And', 110.86)};
  const shots = [
    // 1. "The door started closing on the other side of the country. In California, a movement grew against Chinese workers, who
    //    had built railroads and mined for low pay." New York to San Francisco, then California.
    {a: 0, b: c.one - 0.1, draw: (T) => renderUSMap(T, {arc: smooth(0.6, 2.8, T), zoom: smooth(c.cal - 0.3, c.cal + 1.6, T), ca: smooth(c.cal, c.cal + 0.6, T), sfTag: lVis(T, 1.6, c.one)}) +
      lTag('THE RABINOWITZES', 1250, 330, lVis(T, 0.3, c.cal)) +
      lNote('Chinese workers: railroads, mines, low pay', 940, 860, lVis(T, c.chinese, c.one + 0.1))},
    // 2. "One of its loudest leaders was Denis Kearney. He ended his speeches with 'The Chinese must go!' Kearney was an immigrant
    //    himself. From Ireland." His portrait (an 1878 engraving), the slogan, and where he was born.
    {a: c.one - 0.1, b: c.in82 - 0.1, cut: true, draw: (T) => lPrint(T, c.one, c.in82, 'desk/kearney_1878.webp', {x: 220, y: 150, w: 560, rot: -2, z: 0.04, ox: 500}) +
      lSrc('DENIS KEARNEY · ENGRAVING, 1878 · WIKIMEDIA COMMONS', lVis(T, c.one + 0.2, c.in82)) +
      lTag('DENIS KEARNEY · SAN FRANCISCO', 900, 260, lVis(T, c.kearney, c.in82)) +
      quote('&ldquo;The Chinese must go!&rdquo;', 'how kearney ended his speeches', {x: 900, y: 340, w: 900, size: 76, o: lVis(T, c.must, c.in82)}) +
      (T > c.ireland ? slideUp(fin(T, c.ireland - 0.1), tape('BORN IN IRELAND', {x: 940, y: 690, size: 70, rot: -2, seed: 801})) : '')},
    // 3. "In 1882, Congress passed the Chinese Exclusion Act. It banned Chinese workers from coming to the United States."
    {a: c.in82 - 0.1, b: c.first - 0.4, cut: true, draw: (T) => lPrint(T, c.in82, c.first, 'desk/chinese_exclusion_act_1882_text.png', {x: 170, y: 150, w: 760, rot: -1.5, z: 0.04, ox: 500}) +
      lSrc('THE CHINESE EXCLUSION ACT, 1882 · NATIONAL ARCHIVES', lVis(T, c.in82 + 0.2, c.first - 0.3)) +
      vocabCard('Chinese Exclusion Act', '1882', 'law', 'A law that banned Chinese workers from coming to the United States.', {x: 1040, y: 230, w: 720, size: 56, rot: 2, o: fin(T, c.in82 + 2.8, 0.4)})},
    // 4. "It was the first major law to keep out a group of people because of their nationality. That same year, Congress began
    //    taxing every arrival and turning away anyone who looked too poor to support themselves." The walls on the timeline.
    {a: c.first - 0.4, b: c.hostility - 0.1, cut: true, draw: (T) => renderLaws(remap([[c.first - 0.4, 0.9], [c.first, 1.4], [c.same - 0.2, 1.95], [c.same + 0.1, 2.5], [c.hostility, 3.3]])(T))},
    // 5. "Hostility to newcomers has a name: nativism. And there's a strange pattern in it." The nativism desk (prints shut out by
    //    law and let in but mocked, each captioned), and the word.
    {a: c.hostility - 0.1, b: c.puck - 0.1, cut: true, draw: (T) => renderNativism(remap([[c.hostility - 0.1, 0.0], [c.puck, 4.2]])(T)) + dimBy(0.4 * lVis(T, c.nativism - 0.2, c.puck + 1)) +
      vocabCard('Nativism', 'NAY-tiv-iz-um', 'noun', 'Hostility to newcomers: favoring people born in a country over immigrants.', {x: 620, y: 360, w: 680, size: 70, rot: -1.5, o: lVis(T, c.nativism, c.puck + 1, 0.4)})},
    // 6. "In 1882, a magazine called Puck printed a cartoon of workers building a wall against the Chinese. Irish, Jewish, and Italian
    //    workers. Immigrants, building the wall." The print, still and framed; no part of it is animated.
    {a: c.puck - 0.1, b: c.nine + 0.04, cut: true, draw: (T) => lPrint(T, c.puck, c.nine, 'desk/puck_anti_chinese_wall_1882.webp', {x: 300, y: 110, w: 1320, rot: -1, z: 0.03}) +
      lSrc('PUCK, 1882 · &ldquo;THE ANTI-CHINESE WALL&rdquo; · LIBRARY OF CONGRESS', lVis(T, c.puck + 0.2, c.nine + 0.1)) +
      lTag('IRISH, JEWISH AND ITALIAN WORKERS', 330, 120, lVis(T, c.irish, c.nine + 0.1)) +
      (T > c.immigrants - 0.25 ? slideUp(fin(T, c.immigrants - 0.25), tape('IMMIGRANTS, BUILDING THE WALL', {x: 470, y: 780, size: 72, rot: -2, seed: 803})) : '')},
    // 7. "Nine years later, Puck's founder, Joseph Keppler, drew this. Rich men turning a newcomer away. But look at their shadows.
    //    Each one is a poor immigrant: the man he, or his father, used to be. The caption says they would close 'the bridge that
    //    carried them and their fathers over.' Keppler was an immigrant too, from Austria." ep3_looking_backward, retimed: the
    //    print and its date, the men ringed, the shadows, the caption, the arrows back down and Keppler's birthplace.
    {a: c.nine + 0.04, b: c.but - 0.1, cut: true, draw: (T) => renderLookingBackward(remap([[c.nine, 0.2], [c.rich - 0.5, 4.3], [c.rich, 4.6], [c.look + 0.6, 8.4],
      [c.each - 0.6, 9.6], [c.caption - 0.2, 13.8], [c.caption + 0.4, 14.9], [c.kepImm - 0.4, 18.2], [c.kepImm, 19.0], [c.but - 0.1, 21.7]])(T))},
    // 8. "But here's the other side. In 1883, a poet named..." The timeline again, its welcome row: "The New Colossus", 1883.
    {a: c.but - 0.1, b: c.lazarus - 0.1, cut: true, draw: (T) => renderLaws(remap([[c.but - 0.1, 3.0], [c.in83, 3.6], [c.lazarus, 4.35]])(T)) +
      lNote('the other side', 1200, 860, lVis(T, c.but, c.lazarus + 0.3), 40)},
    // 9. "...Emma Lazarus, who had volunteered with Jewish refugees, wrote a poem for a giant statue coming from France." Her
    //    portrait (an engraving of 1888), then the statue being built in Paris (Dargaud's painting, 1884).
    {a: c.lazarus - 0.1, b: c.give - 0.1, cut: true, draw: (T) => `<div style="position:absolute;inset:0;transform:scale(${(1 + 0.035 * ease(clamp01((T - c.lazarus) / 6))).toFixed(4)})">${desk()}` +
      deskCut('desk/lazarus_c1888.webp', {x: 230, y: 90, w: 560, rot: -2, o: fin(T, c.lazarus, 0.5), T}) +
      deskCut('../img/c_arrival/dargaud_statue_of_liberty_in_gaget_workshop_paris_1884_commons.jpg'.replace('../img/', ''), {x: 1080, y: 110, w: 560, rot: 2, o: fin(T, c.statue - 0.1, 0.5), T}) + `</div>` +
      lSrc('EMMA LAZARUS · ENGRAVING, 1888, AFTER A PHOTO BY W. KURTZ · LIBRARY OF CONGRESS', lVis(T, c.lazarus + 0.2, c.statue + 0.2)) +
      lSrc('THE STATUE IN PARIS, 1884 · PAINTING BY VICTOR DARGAUD · WIKIMEDIA COMMONS', lVis(T, c.statue + 0.1, c.give)) +
      lNote('she volunteered with Jewish refugees', 160, 60, lVis(T, c.vol - 0.1, c.statue + 0.5))},
    // 10. "Give me your tired, your poor, your huddled masses yearning to breathe free." The lines, on the words; her manuscript.
    {a: c.give - 0.1, b: c.needed - 0.25, cut: true, draw: (T) => push(T, c.give, c.needed) +
      deskCut('c_arrival/lazarus_new_colossus_manuscript_1883_commons.jpg', {x: 1320, y: 300, w: 420, rot: 3, o: fin(T, c.give, 0.5), T}) + `</div>` +
      quote('&ldquo;Give me your tired, your poor,', '', {x: 160, y: 330, w: 1100, size: 72, o: fin(T, c.give, 0.35)}) +
      quote('your huddled masses yearning to breathe free&rdquo;', 'emma lazarus, &ldquo;the new colossus,&rdquo; 1883', {x: 160, y: 430, w: 1100, size: 72, o: fin(T, c.huddled - 0.2, 0.35)}) +
      lSrc('HER MANUSCRIPT, 1883 · WIKIMEDIA COMMONS', lVis(T, c.give + 0.4, c.needed))},
    // 11. "The statue needed a pedestal, and the money ran out." The pedestal going up on Bedloe's Island, 1885.
    {a: c.needed - 0.25, b: c.so - 0.1, cut: true, draw: (T) => lPrint(T, c.needed, c.so, 'desk/pedestal_1885.webp', {x: 360, y: 110, w: 1200, rot: 1, z: 0.04}) +
      lSrc("THE PEDESTAL GOING UP, BEDLOE'S ISLAND, 1885 · LIBRARY OF CONGRESS", lVis(T, c.needed, c.so)) + lNote('the money ran out', 1250, 70, lVis(T, c.ran - 0.2, c.so + 0.2))},
    // 12. "So a newspaper asked ordinary people to chip in. More than a hundred thousand people did, most giving a dollar or less."
    {a: c.so - 0.1, b: c.and - 0.1, cut: true, draw: (T) => renderPedestal(remap([[c.so - 0.1, 0.0], [c.more, 1.0], [c.most, 5.4], [c.and, 7.2]])(T))},
    // 13. "And across the river in Brooklyn, the Kellys were about to get new neighbors." The model, across the East River to the
    //     Kellys' coral building; the card "New Neighbors" lands on "new neighbors".
    {a: c.and - 0.1, b: dur, cut: true, live: true, draw: (T) => renderModelShot(T, {keys: [[c.and - 0.1, 600, 260, 0, 4, 46, 3300, 0, 20], [cardAt, 1420, 140, 0, 8, 44, 2000, 0, 20], [dur, 1500, 110, 0, 9, 44, 1700, 0, 20]],
      labels: [{lines: ['LOWER EAST SIDE'], at: [0, 480, 90], off: [0, -70], a: c.and, b: cardAt + 0.4}, {lines: ['THE KELLYS · BROOKLYN'], at: 'kelly', off: [-260, -120], a: c.and + 0.6, b: dur + 1}]}) +
      batonCard(T, cardAt, 'New Neighbors')},
  ];
  return {dur, shots};
};
