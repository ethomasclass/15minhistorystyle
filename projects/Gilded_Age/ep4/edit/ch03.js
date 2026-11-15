// Chapter 3, "Up and Out" (1:06): up first (safety elevators, Otis's patent 1861; the iron and steel frame: a cutaway); the Home
// Insurance Building, Chicago, 1885 (lithograph) and "skyscraper"; then out: the Brooklyn Bridge (1883; Currier and Ives, 1885), the
// elevated railway (photograph, about 1889), the electric streetcar (drawn: no photograph of Richmond's 1888 cars is used; dated
// on screen), the streetcar cities on the map, the streetcar suburb diagram ("suburbs"), and the crowded blocks (Riis's bird's-eye
// drawing, 1890). The baton "Too Many, Too Fast" slams in on "Too".
EDITS.ch03 = () => {
  const ch = 'ch03_up_and_out', W = window.WORDS[ch], w = (word, n) => wordAt(ch, word, n);
  const c = {
    two: w('Two'), safety: w('Safety'), climb: w('climb'), every: w('Every'), groceries: w('groceries.'), frames: w('frames'), strong: w('strong'), hold: w('hold'),
    in1885: w('In', 1), home: w('Home'), ten: w('ten', 2), many: w('Many'), sky: w('skyscraper.'), then: w('Then,'), in1883: w('1883,'), bridge: w('Bridge'),
    steam: w('Steam'), elevated: w('elevated'), and1888: w('And', 3), richmond: w('Richmond,'), sprague: w('Sprague'), within: w('Within'), cities: w('cities'),
    that: w('That'), afford: w('afford'), fare: w('fare'), moved: w('moved'), quiet: w('quiet'), suburbs: w('suburbs.'), ifc: w('If', 2), stayed: w('stayed'),
    crowded: w('crowded'), docks: w('docks.'), those: w('those'), too: w('Too'),
  };
  const cardAt = c.too, dur = cardAt + CARD_HOLD;
  const P_ = (txt, x, y, o, size = 32, rot = -3) => lNote(txt, x, y, o, size, rot);
  const tramDots = [...E4_C1870, ...E4_C1900].map(([nm, lon, lat], i) => [lon, lat, c.within + 0.2 + i * 0.07, C.teal]);
  const shots = [
    // 1. "Up came first. Two things made it possible. Safety elevators, so nobody had to climb ten flights of stairs. Every day. With
    //    groceries. And frames of iron and steel, strong enough to hold the whole building up." The cutaway: the car rises floor by
    //    floor while a neighbour with a grocery bag trudges up the stairs; Otis's patent (1861) beside it; the frame draws on, then
    //    the walls hang on it.
    {a: 0, b: c.in1885 + 0.4, draw: (T) => svg(e4xFrame(T, {a: 0, elev: c.safety + 0.2, frame: c.frames, hold: c.hold})) +
      lTag('UP', 130, 120, lVis(T, 0.2, c.safety + 0.4)) +
      (T < c.frames + 0.2 ? op(fin(T, c.safety, 0.4) * fout(T, c.frames - 0.2, 0.35), printCard('b_building_up/otis_elevator_patent_drawing_1861_commons.jpg', {x: 1120, y: 150, w: 640, ar: 0.676, rot: 1.5, o: 1, T, caption: 'E. G. Otis, elevator patent, 1861'})) : '') +
      lTag('SAFETY ELEVATOR', 1120, 690, lVis(T, c.safety + 0.3, c.frames - 0.1)) +
      P_('ten flights of stairs', 1080, 860, lVis(T, c.climb, c.frames - 0.1), 32) + P_('every day, with groceries', 1080, 950, lVis(T, c.every, c.frames - 0.1), 30) +
      lTag('IRON AND STEEL FRAME', 1120, 360, fin(T, c.frames + 0.2, 0.3)) + P_('the frame holds the building up', 1080, 480, fin(T, c.strong, 0.3), 32) +
      P_('the walls just hang on it', 1080, 590, fin(T, c.hold - 0.6, 0.3), 32)},
    // 2. "In 1885, Chicago's Home Insurance Building rose ten stories into the sky. Many people call it the first skyscraper."
    {a: c.in1885 + 0.4, b: c.then - 0.1, draw: (T) => push(T, c.in1885, c.then, 0.05) +
      printCard('b_building_up/chicago_building_of_the_home_insurance_co_1885_loc.jpg', {x: 200, y: 60, w: 720, ar: 1.222, rot: -1.2, o: fin(T, c.in1885 - 0.1, 0.45), T}) + `</div>` +
      lSrc('The Chicago Building of the Home Insurance Co. &middot; lithograph, 1885', fin(T, c.in1885 + 0.2)) +
      bigFig('1885', {x: 1020, y: 160, size: 150, w: 700, align: 'left', o: fin(T, c.in1885, 0.3)}) +
      lTag('CHICAGO · 10 STORIES', 1030, 380, fin(T, c.ten, 0.3)) +
      vocab(1000, 520, 'Skyscraper', 'A very tall building, held up|by a frame of iron or steel.', fin(T, c.many, 0.35))},
    // 3. "Then, out. In 1883, the Brooklyn Bridge opened across the East River."
    {a: c.then - 0.1, b: c.steam - 0.1, draw: (T) => push(T, c.then, c.steam, 0.06) +
      printCard('c_transit/brooklyn_bridge_grand_birdseye_currier_ives_1885_commons.jpg', {x: 220, y: 90, w: 1480, ar: 0.692, rot: 0.8, o: fin(T, c.then - 0.1, 0.45), T}) + `</div>` +
      lSrc('The Great East River Suspension Bridge &middot; Currier &amp; Ives, 1885', fin(T, c.then + 0.2)) +
      lTag('OUT', 130, 120, fin(T, c.then + 0.5, 0.3)) + lTag('BROOKLYN BRIDGE · OPENED 1883', 1000, 120, fin(T, c.in1883, 0.3))},
    // 4. "Steam trains already rattled along elevated tracks above Manhattan's streets."
    {a: c.steam - 0.1, b: c.and1888 - 0.1, draw: (T) => push(T, c.steam, c.and1888, 0.06) +
      printCard('c_transit/elevated_s_curve_110th_street_photo_c1889_commons.jpg', {x: 300, y: 70, w: 1300, ar: 0.7, rot: -1, o: fin(T, c.steam - 0.1, 0.45), T}) + `</div>` +
      lSrc('The elevated railway at 110th Street &middot; photograph, about 1889', fin(T, c.steam + 0.2)) +
      lTag('ELEVATED RAILWAY · MANHATTAN', 1080, 1000, fin(T, c.steam + 0.3, 0.3))},
    // 5. "And in 1888, in Richmond, Virginia, Frank Sprague got a whole system of electric streetcars running." Drawn.
    {a: c.and1888 - 0.1, b: c.within - 0.1, draw: (T) => svg(e4xTrolley(T, {a: c.and1888 - 0.1})) +
      lTag('ELECTRIC STREETCAR · RICHMOND, VIRGINIA · 1888', 130, 120, fin(T, c.richmond - 0.3, 0.3)) +
      lSrc('A drawing of an 1888 electric streetcar', fin(T, c.and1888 + 0.3), {x: 100, y: 990})},
    // 6. "Within a few years, cities all over the country had them."
    {a: c.within - 0.1, b: c.that - 0.1, draw: (T) => svg(e4xUSCities(T, {dots: tramDots, zoom: [1010, 470, 1.0]})) + lTag('ELECTRIC STREETCARS SPREAD', 130, 120, fin(T, c.within + 0.2, 0.3))},
    // 7. "That changed who lived where. If you could afford the fare and a house, you moved out along the streetcar lines, to quiet
    //    new neighborhoods: the first suburbs. If you couldn't, you stayed in the crowded blocks, by the factories and the docks."
    {a: c.that - 0.1, b: c.those - 0.1, draw: (T) => svg(e4xRings(T, {a: c.that - 0.1, out: c.moved, stayed: c.ifc})) +
      lTag('DOWNTOWN', 330, 200, fin(T, c.that + 0.3, 0.3)) + lTag('STREETCAR LINES', 1240, 200, fin(T, c.that + 0.8, 0.3)) +
      P_('if you could afford the fare', 1000, 960, lVis(T, c.afford, c.suburbs - 0.2), 32) +
      vocab(1000, 560, 'Suburbs', 'Quiet neighborhoods at the edge|of a city, a ride from downtown.', lVis(T, c.suburbs - 0.3, c.crowded + 1.2)) +
      lTag('CROWDED BLOCKS · FACTORIES · DOCKS', 130, 1000, fin(T, c.crowded, 0.3))},
    // 8. "And those blocks were filling with more people than anyone could handle. Too many, too fast." Riis's drawing of a whole East
    //    Side tenement block from above (1890); the baton on "Too".
    {a: c.those - 0.1, b: dur, draw: (T) => push(T, c.those, dur, 0.07) +
      printCard('d_streets_filth/riis_birdseye_view_east_side_tenement_block_1890_commons.jpg', {x: 210, y: 140, w: 1500, ar: 0.577, rot: -0.6, o: fin(T, c.those - 0.1, 0.45), T}) + `</div>` +
      lSrc('Bird&rsquo;s-eye view of an East Side tenement block &middot; Jacob Riis, 1890', fin(T, c.those + 0.2) * fout(T, cardAt, 0.2)) +
      batonCard(T, cardAt, 'Too Many, Too Fast')},
  ];
  return {dur, shots};
};
window.HOLD.ch03 = {}; window.CARRY.ch03 = {};
