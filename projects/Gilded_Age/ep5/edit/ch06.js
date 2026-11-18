// Chapter 6, "Uncle Owen's Letters" (85.6 s of narration + the baton card). The map: O'Neill on the Great Plains, the letter route
// to Brooklyn (lookdev/ep5_map.js ep5_map_owen); Owen writing in the sod house (ep5_farm_kitchen) under his letter lines; the three
// problems (ep5_x_owen3) with a Butcher sod house for the borrowed money and the mortgage card; the corn in the stove
// (ep5_corn_stove) under the corn line and Owen's own; the Grange ("Gift for the Grangers", 1873; "No relation."); the Farmers'
// Alliance (Gillam, Judge 1891); the co-ops against a world market (grain elevators loading a ship, Chicago, about 1895); door 2
// closes (ep5_door2_close: the slam on "closed"); the card "The Money Problem" on "the money problem".
//
// Shared helpers for chapters 6 to 10 (this file loads first of the five): q-prefixed so they never clash with chapters 1 to 5.
// The maps (lookdev/ep5_map.js) are loaded here, right after this file, so edit.html stays untouched.
document.write('<script src="../../lookdev/ep5_map.js"><\/script>');
/** The desk with a slow push, and a body on it. */
const qDesk = (T, a, b, body, z = 0.04, ox = 960, oy = 540) => `<div style="position:absolute;inset:0;transform:scale(${(1 + z * ease(clamp01((T - a) / Math.max(0.1, b - a)))).toFixed(4)});transform-origin:${ox}px ${oy}px">${desk()}${body}</div>`;
/** An archival print shot: the print on the desk from a to b, its source tag; `p` = printCard options (x, y, w, ar, rot). */
const qPrint = (T, a, b, src, p, credit, {z = 0.04, ox = 960, oy = 540} = {}) => qDesk(T, a, b, printCard(src, {...p, o: fin(T, a + 0.05, 0.5), T}), z, ox, oy) + lSrc(credit, lVis(T, a + 0.2, b + 0.4));
/** Torn orange strips slapped in at their times: [[t0, text, x, y, size, rot], ...] */
const qTapes = (T, list) => list.map(([t0, txt, x, y, size = 72, rot = -2], i) => (T > t0 ? slideUp(fin(T, t0, 0.3), tape(txt, {x, y, size, rot, seed: 600 + i * 7 + txt.length})) : '')).join('');
/** A tag inside the 8% safe area (lTag clamps to the older 5% area only). */
const qTag = (txt, x, y, o) => lTag(txt, Math.max(172, x), Math.max(124, Math.min(y, 976)), o);
/** A drawn set without its own clip text (the Ep 5 clips put their tags at x 130): the edit draws its own tag. */
const qQ = (fn) => lQuiet(fn);
/** A cropped archival print (crop = [x0, y0, x1, y1] fractions of the image; size = its pixel size), as Ep 4's kCrop. */
function qCrop(src, {x, y, w, size, crop = [0, 0, 1, 1], rot = 0, o = 1, T = 0, filter = 'sepia(.18) contrast(1.04)'}) {
  const [W, H] = size, cw = (crop[2] - crop[0]) * W, chh = (crop[3] - crop[1]) * H, h = w * chh / cw, iw = w * W / cw;
  const dy = (1 - ease(o)) * 60 + Math.sin(T * 0.7 + x) * 2.5;
  return `<div style="position:absolute;left:${x}px;top:${(y + dy).toFixed(1)}px;width:${w + 20}px;transform:rotate(${rot}deg);opacity:${Math.min(1, o * 1.6).toFixed(3)};
      background:#E9E2D2;padding:10px;filter:drop-shadow(0 3px 2px rgba(0,0,0,.7)) drop-shadow(0 18px 22px rgba(0,0,0,.55))">
      <div style="width:${w}px;height:${h.toFixed(1)}px;overflow:hidden;position:relative"><img src="${IMG}${src}" style="position:absolute;left:${(-crop[0] * iw).toFixed(1)}px;top:${(-crop[1] * iw * H / W).toFixed(1)}px;width:${iw.toFixed(1)}px;filter:${filter}"></div></div>`;
}
/** A character's spoken line as handwriting (orange Pen), shown on the words. */
const qSay = (T, lines, o) => lines.map(([txt, x, y, t0, size = 30]) => lNote(txt, x, y, o * fin(T, t0, 0.3), size, -2)).join('');

EDITS.ch06 = () => {
  const ch = 'ch06_uncle_owens_letters', L = (word, near) => lWord(ch, word, near);
  const cardAt = L('the', 84.7), dur = cardAt + CARD_HOLD;
  const c = {oneill: L("O'Neill,", 5.3), great: L('Great', 6.8), every: L('Every', 11.6), brooklyn: L('Brooklyn.', 13.5), wheat: L("Wheat's", 14.8), half: L('Half.', 17.8),
    bank: L('And', 18.9), farmers: L('Farmers', 21.9), first: L('First,', 24.5), most: L('Most', 26.1), mortgage: L('mortgage:', 30.7), second: L('Second,', 35.8),
    third: L('Third,', 42.9), worst: L('worst:', 43.8), crop: L('crop', 44.7), corn: L('Corn', 46.9), burned: L('burned', 49.3), coal: L('coal.', 51.9),
    oBurned: L('Burned', 53.5), cheaper: L('Cheaper', 55.9), so: L('So', 58.0), grange: L('Grange,', 60.4), kelley: L('Kelley.', 64.0), no: L('No', 64.9),
    then: L('Then', 66.1), alliance: L('Alliance.', 67.7), coops: L('co-ops', 69.2), it: L('It', 71.6), cropP: L('Crop', 72.7), world: L('world,', 75.2),
    door: L('The', 79.4), closed: L('closed.', 80.5)};
  const cut = {farm: c.wheat - 0.35, x1: c.farmers - 0.3, sod: c.most - 0.15, x2: c.second - 0.3, stove: c.corn - 0.2, gr: c.so - 0.25, al: c.alliance - 0.4, co: c.it - 0.2, door: c.door - 0.15};
  // the map (E5M_OW beats): O'Neill on its name, the plains on "Great Plains", the pull out on "middle of the country", Brooklyn and the letters
  const mMap = remap([[0, 0], [c.oneill, 0.8], [c.great, 3.2], [9.6, 5.6], [c.every, 8.4], [c.brooklyn + 1.0, 12.4], [cut.farm + 0.5, 13.6]]);
  // the three problems (X5_O3): the title on "Farmers had three big problems", 1 on "First, debt", 2 on "Second, railroads", 3 on "Third"
  const O3 = {...X5_O3, title: 0.3, p1: 1.0, p2: 2.8, p3: 4.6, fall: 5.0, worst: 6.6};
  const mX1 = remap([[cut.x1, 0], [c.farmers + 0.1, 0.3], [c.first, 1.0], [cut.sod, 2.0]]);
  const mX2 = remap([[cut.x2, 2.0], [c.second, 2.8], [c.third, 4.6], [c.worst, 6.6], [cut.stove + 0.5, 8.4]]);
  // the corn in the stove (CS beats): first ear in on "burned", the flares 1.4 s after each feed; the door shut by the end
  const mCS = remap([[cut.stove, 0.7], [c.burned, 3.0], [c.oBurned - 0.2, 5.6], [c.cheaper - 0.6, 8.2], [cut.gr + 0.5, 11.9]]);
  // door 2: the slam on "closed"
  const mDoor = remap([[cut.door, 0.6], [c.closed, DCL.shut], [c.closed + 1.6, 3.6], [dur, 5.0]]);
  const shots = [
    // "Uncle Owen was Michael's uncle, his father's younger brother. He farmed near O'Neill, Nebraska, on the Great Plains, the wide, flat
    //  grasslands in the middle of the country. Every few months, a letter came to Brooklyn."
    {a: 0, b: cut.farm, live: true, draw: (T) => e5Live(renderE5MapOwen(mMap(T), {...E5M_OW, note: 8.6}))},
    // OWEN: "Wheat's selling for half what it did when I came out. Half. And the bank still wants its payment." He writes by the lamp.
    {a: cut.farm, b: cut.x1, cut: true, live: true, draw: (T) => qQ(() => renderE5Farm(T - cut.farm + 0.6)) +
      qTag('UNCLE OWEN · NEAR O\'NEILL, NEBRASKA · 1890', 172, 124, lVis(T, cut.farm + 0.2, cut.x1 + 0.3)) +
      qSay(T, [["“Wheat's selling for half", 190, 290, c.wheat], ["what it did when I came out.”", 220, 380, c.wheat + 0.6], ['“Half.”', 250, 480, c.half], ['“And the bank still', 190, 840, c.bank - 0.2], ['wants its payment.”', 230, 930, c.bank - 0.2]], lVis(T, cut.farm, cut.x1 + 0.2))},
    // "Farmers had three big problems. First, debt."
    {a: cut.x1, b: cut.sod, cut: true, draw: (T) => renderX5Owen3(mX1(T), O3)},
    // "Most farmers borrowed money for land, seed and machines. Many took out a mortgage: a loan where, if you can't pay, the bank takes your farm."
    {a: cut.sod, b: cut.x2, cut: true, draw: (T) => qPrint(T, cut.sod, cut.x2, 'g_farm_life/rawding_family_sod_house_butcher_1886_loc.jpg', {x: 190, y: 130, w: 860, ar: 0.748, rot: -1.2},
      'A SOD HOUSE, CUSTER COUNTY, NEBRASKA · SOLOMON D. BUTCHER, 1886 · LIBRARY OF CONGRESS', {ox: 600}) +
      op(1, qTapes(T, [[c.most + 0.4, 'LAND', 1180, 200, 64, -3], [L('seed', 28.3), 'SEED', 1240, 330, 64, 2], [L('machines.', 28.9), 'MACHINES', 1180, 460, 64, -2]])) +
      vocab(946, 620, 'Mortgage', 'A loan where, if you can’t pay,|the bank takes your farm.', fin(T, c.mortgage - 0.2, 0.4))},
    // "Second, railroads. Often only one railroad served a town, so it charged whatever it wanted. Third, and worst: crop prices kept falling."
    {a: cut.x2, b: cut.stove, cut: true, draw: (T) => renderX5Owen3(mX2(T), O3) + lNote('one railroad, any price', 980, 240, lVis(T, L('Often', 37.8), c.third - 0.2), 30, -3)},
    // "Corn got so cheap that some farmers burned it in their stoves, because it was cheaper than coal."
    // OWEN: "Burned corn in the stove this winter. Cheaper than coal."
    {a: cut.stove, b: cut.gr, cut: true, live: true, draw: (T) => qQ(() => renderE5CornStove(mCS(T))) +
      qTag('NEAR O\'NEILL, NEBRASKA · WINTER 1890', 172, 124, lVis(T, cut.stove + 0.2, cut.stove + 4.0)) +
      qSay(T, [['“Burned corn in the stove', 190, 300, c.oBurned], ['this winter.', 230, 390, c.oBurned + 0.9], ['Cheaper than coal.”', 230, 480, c.oBurned + 1.6]], lVis(T, c.oBurned - 0.3, cut.gr + 0.2))},
    // "So farmers teamed up. First came the Grange, farmers' clubs started by a guy named Oliver Kelley. No relation."
    {a: cut.gr, b: cut.al, cut: true, draw: (T) => qPrint(T, cut.gr, cut.al, 'h_grange_alliance/gift_for_the_grangers_strobridge_1873_loc.jpg', {x: 300, y: 70, w: 560, ar: 1.257, rot: 1},
      '"GIFT FOR THE GRANGERS" · STROBRIDGE &amp; CO., 1873 · LIBRARY OF CONGRESS', {ox: 600, oy: 420}) +
      vocab(946, 170, 'The Grange', 'Farmers’ clubs: meetings, picnics,|and buying together.', fin(T, c.grange - 0.1, 0.4)) +
      lNote('no relation.', 1160, 640, fin(T, c.no - 0.15, 0.3), 38, -4)},
    // "Then came the bigger Farmers' Alliance. They set up co-ops to buy and sell together."
    {a: cut.al, b: cut.co, cut: true, draw: (T) => qPrint(T, cut.al, cut.co, 'h_grange_alliance/new_uncle_sam_farmers_alliance_gillam_1891_loc.jpg', {x: 330, y: 190, w: 520, ar: 1.266, rot: -1},
      '"THE NEW UNCLE SAM" · GILLAM, JUDGE, 1891 · LIBRARY OF CONGRESS', {ox: 600, oy: 420}) +
      qTag('AN EASTERN MAGAZINE MAKES FUN OF THE ALLIANCE', 172, 124, lVis(T, cut.al + 0.4, cut.co + 0.3)) +
      vocab(946, 200, 'Farmers’ Alliance', 'A bigger farmers’ group that set up|co-ops: farmers buying and|selling together.', fin(T, c.alliance - 0.3, 0.4))},
    // "It didn't work. Crop prices were set by markets all over the world, and even thousands of farmers were too small to change them."
    {a: cut.co, b: cut.door, cut: true, draw: (T) => qPrint(T, cut.co, cut.door, 'g_farm_life/loading_whaleback_ship_at_grain_elevator_c1895_loc.jpg', {x: 1060, y: 90, w: 620, ar: 1.132, rot: 1.2},
      'GRAIN ELEVATORS LOADING A SHIP, CHICAGO · STEREOGRAPH, ABOUT 1895 · LIBRARY OF CONGRESS', {ox: 1300, oy: 420}) +
      qTapes(T, [[c.it, "IT DIDN'T WORK", 200, 230, 76, -2]]) +
      lNote('prices set by markets', 230, 560, lVis(T, c.cropP, cut.door + 0.2), 34) + lNote('all over the world', 280, 660, lVis(T, c.world - 0.2, cut.door + 0.2), 34)},
    // "The second door had closed. Why were prices falling in the first place? That's the money problem."
    {a: cut.door, b: dur, cut: true, live: true, draw: (T) => renderDoorClose(mDoor(T), 1) + batonCard(T, cardAt, 'The Money Problem')},
  ];
  return {dur, shots};
};
window.HOLD.ch06 = {}; window.CARRY.ch06 = {};
