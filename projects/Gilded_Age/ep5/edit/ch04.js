// Chapter 4, "Two Kinds of Unions" (0:00 to 1:48). lookdev/ep5_explain.js ep5_x_unions with its beats on the words (the Knights:
// everyone, big goals, arbitration; HAYMARKET · 1886 and the Knights' column cracking; the AFL: skilled workers, bread and butter,
// collective bargaining; "it lasted"); the Knights' leaders (1886) and the five little stars (a drawn newspaper line); women delegates
// (1886); the May 1886 strikes (Leslie's); Haymarket handled through the trial print (no riot picture, no bodies); Gompers (photographed
// 1908, dated); ep5_union_meeting (Michael raises his hand on "Michael joined the Knights anyway"); ep5_kitchen_1887 lip-synced to Tommy
// and Michael (clip t = chapter t - 91.4); the stereo view of "Fort Frick" and the baton "Fort Frick".
/** A newspaper line of 1880s type with the Knights' name printed as five stars (drawn, cream paper). */
function e5StarsClip(T, a, stars, {x = 1000, y = 300, w = 720} = {}) {
  const o = fin(T, a, 0.4), dy = (1 - ease(o)) * 50 + Math.sin(T * 0.8) * 2, k = fin(T, stars, 0.25);
  const star = (i) => `<span style="display:inline-block;opacity:${clamp01(k * 5 - i).toFixed(2)};transform:scale(${(1.6 - 0.6 * clamp01(k * 5 - i)).toFixed(2)})">&#9733;</span>`;
  return op(Math.min(1, o * 1.5), `<div class="tx" style="position:absolute;left:${x}px;top:${(y + dy).toFixed(1)}px;width:${w}px;transform:rotate(1.5deg);background:#EAE2CF;
    box-shadow:0 3px 2px rgba(0,0,0,.6),0 18px 26px rgba(0,0,0,.55);padding:34px 40px 38px;font-family:Playfair;font-weight:900;color:#1d1a16">
    <div style="font-family:Mono;font-size:20px;letter-spacing:3px;color:#5a5348;border-bottom:2px solid #5a5348;padding-bottom:10px;margin-bottom:22px">LABOR NOTES &middot; A NEWSPAPER OF THE 1870s</div>
    <div style="font-size:50px;line-height:1.18">A meeting of the<br><span style="font-size:76px;letter-spacing:10px;color:#1d1a16">${[0, 1, 2, 3, 4].map(star).join('')}</span><br>was held last night.</div></div>`);
}
EDITS.ch04 = () => {
  const ch = 'ch04_two_kinds_of_unions', w = (word, n) => wordAt(ch, word, n), L = (word, near) => lWord(ch, word, near);
  const c = {
    knights: w('Knights'), news: w('newspapers'), five: w('five'), swear: w('Like'), let: w('let'), anyone: w('anyone'), women: w('women,'), not: w('not'),
    y1886: w('1886,'), big: w('big'), eight: w('eight-hour'), child: w('child'), arb: w('arbitration:'), may: w('May'), three: w('Three'), haymarket: w('Haymarket'),
    seven: w('Seven'), nobody: w('Nobody'), anarch: w('anarchists,'), forMany: L('For', 60.16), violence: w('violence.'), blame: w('blame,'), second: w('second'),
    lasted: w('lasted:'), american: w('American'), gompers: w('Gompers.'), took: w('took'), bread: w('"bread'), better: w('better'), main: w('main'),
    michael: lWord(ch, 'Michael', 87.9), joined: w('joined'), his: w('His'), but2: L('But', 101.5), fort: w('Fort'),
  };
  const cardAt = c.fort, dur = cardAt + CARD_HOLD;
  // ep5_x_unions' cue table in chapter seconds
  const UC = {...X5_UN, k: -1, k1: c.anyone, k2: c.big, k3: c.arb, a: c.american - 0.2, a1: c.took + 0.6, a2: c.bread, a3: c.main - 1.0,
    hay: c.forMany + 0.2, crack: c.blame - 0.4, last: c.lasted};
  const board = (T) => renderX5Unions(T, UC);
  const V = (term, say, pos, def, o, {x = 1040, y = 250, w = 660} = {}) => vocabCard(term, say, pos, def, {x, y, w, o, size: 58});
  const cuts = {stars: c.news - 0.3, any: c.anyone - 0.3, women: c.women - 0.6, goals: c.big - 0.9, may: c.may - 0.15, hay: c.three - 0.1, blame: c.forMany - 0.1,
    gompers: c.gompers - 1.0, bread: c.bread - 0.9, meet: 87.2, kitchen: c.his + 1.0, fort: c.but2 - 0.1};
  const MEET = remap([[cuts.meet, 8.6], [c.joined + 0.1, 10.3], [cuts.kitchen, 13.0]]);
  const P_ = (txt, x, y, o, size = 32, rot = -3) => lNote(txt, x, y, o, size, rot);
  const shots = [
    // "There were two kinds of unions. The first was the Knights of Labor. The Knights started out so secret that"
    {a: 0, b: cuts.stars, draw: (T) => board(T) + V('Knights of Labor', 'NYTS uv LAY-ber', 'noun', 'a union open to almost every kind of worker', fin(T, c.knights, 0.35))},
    // "newspapers printed their name as five little stars. Like a swear word." The Knights' leaders (Kurz & Allison, 1886); the stars.
    {a: cuts.stars, b: cuts.any, draw: (T) => push(T, cuts.stars, cuts.any, 0.035) +
      printCard('c_knights_haymarket/leaders_of_the_knights_of_labor_powderly_1886_commons.jpg', {x: 200, y: 130, w: 600, ar: 1.271, rot: -1.5, o: fin(T, cuts.stars, 0.4), T,
        caption: 'Leaders of the Knights of Labor &middot; Kurz &amp; Allison, 1886'}) + `</div>` +
      e5StarsClip(T, cuts.stars + 0.2, c.five) + P_('like a swear word', 1040, 830, fin(T, c.swear - 0.5, 0.3), 36)},
    // "They let almost anyone join:"
    {a: cuts.any, b: cuts.women, draw: (T) => board(T)},
    // "skilled and unskilled workers, women, and Black workers, but not Chinese immigrants. By 1886, they had hundreds of thousands of
    //  members." Women delegates to the Knights' 1886 convention.
    {a: cuts.women, b: cuts.goals, draw: (T) => push(T, cuts.women, cuts.goals, 0.035) +
      printCard('c_knights_haymarket/women_delegates_knights_of_labor_convention_1886_loc.jpg', {x: 200, y: 150, w: 940, ar: 0.748, rot: -1, o: fin(T, cuts.women, 0.4), T,
        caption: 'women delegates to the Knights of Labor convention &middot; 1886'}) + `</div>` +
      P_('but not Chinese immigrants', 1180, 300, fin(T, c.not - 0.1, 0.3), 30) +
      lTag('1886: HUNDREDS OF THOUSANDS OF MEMBERS', 980, 960, fin(T, c.y1886, 0.35))},
    // "The Knights wanted big changes, like an eight-hour workday and an end to child labor. And they liked settling fights through
    //  arbitration: both sides explain their case to a neutral person, who decides."
    {a: cuts.goals, b: cuts.may, draw: (T) => board(T) + P_('an eight-hour day', 1060, 470, lVis(T, c.eight, c.arb - 0.1), 34) + P_('an end to child labor', 1060, 580, lVis(T, c.child, c.arb - 0.1), 34) +
      V('arbitration', 'ar-bih-TRAY-shun', 'noun', 'both sides explain their case to a neutral person, who decides', fin(T, c.arb, 0.35), {y: 240})},
    // "On May 1st, 1886, hundreds of thousands of workers went on strike for an eight-hour day." The New York street railway strike (Leslie's).
    {a: cuts.may, b: cuts.hay, draw: (T) => push(T, cuts.may, cuts.hay, 0.04) +
      printCard('c_knights_haymarket/street_railway_strike_nyc_car_obstruction_1886_loc.jpg', {x: 520, y: 172, w: 880, ar: 0.828, rot: -1, o: fin(T, cuts.may, 0.4), T,
        caption: "the street railway strike, New York &middot; Leslie's, 1886"}) + `</div>` + lTag('MAY 1, 1886 · STRIKES FOR AN EIGHT-HOUR DAY', 172, 124, fin(T, c.may + 0.2, 0.35))},
    // "Three days later, at a protest in Haymarket Square in Chicago, someone threw a bomb at police. Seven officers and at least four
    //  other people died. Nobody ever proved who threw it, but eight anarchists, people who wanted no government at all, were convicted."
    //  (Sensitive: no picture of the bomb or the dead; the trial's people, the date, the vocabulary card.)
    {a: cuts.hay, b: cuts.blame, draw: (T) => push(T, cuts.hay, cuts.blame, 0.05) +
      printCard('c_knights_haymarket/personnel_of_the_great_anarchist_trial_1886_loc.jpg', {x: 190, y: 120, w: 820, ar: 0.842, rot: -1, o: fin(T, cuts.hay, 0.4), T,
        caption: 'the people of the Haymarket trial, Chicago &middot; print, 1886'}) + `</div>` +
      lTag('HAYMARKET SQUARE · MAY 4, 1886', 1060, 160, fin(T, c.haymarket, 0.35)) +
      P_('7 officers and', 1090, 310, lVis(T, c.seven, c.anarch + 0.6), 28) + P_('at least 4 others died', 1090, 380, lVis(T, c.seven, c.anarch + 0.6), 28) +
      P_('nobody ever proved who threw it', 1090, 465, lVis(T, c.nobody - 0.3, c.anarch + 0.6), 28) +
      V('anarchists', 'AN-er-kists', 'noun', 'people who wanted no government at all', fin(T, c.anarch, 0.35), {x: 1060, y: 520, w: 620})},
    // "For many Americans, unions now meant violence. The Knights had nothing to do with the bomb, but they got the blame, and soon fell
    //  apart. The second kind of union lasted: the American Federation of Labor, or AFL, led by"
    {a: cuts.blame, b: cuts.gompers, draw: (T) => board(T) + V('American Federation of Labor', 'the AFL', 'noun', 'a union of skilled workers, led by Samuel Gompers', fin(T, c.american, 0.35), {x: 1030, y: 520, w: 680}) },
    // "Samuel Gompers. It took only skilled workers, mostly white men," Gompers, photographed 1908 (the only public-domain photograph;
    //  dated on screen).
    {a: cuts.gompers, b: cuts.bread, draw: (T) => push(T, cuts.gompers, cuts.bread, 0.04) +
      printCard('d_afl_gompers/samuel_gompers_and_wife_LATE_1908_loc.jpg', {x: 440, y: 180, w: 1040, ar: 0.712, rot: -1, o: fin(T, cuts.gompers, 0.4), T,
        caption: 'Samuel Gompers (right) with his wife Sophia &middot; photographed 1908, later than our story'}) + `</div>` +
      lTag('SAMUEL GOMPERS · AFL', 172, 124, fin(T, c.gompers, 0.3))},
    // "and it focused on 'bread and butter': better pay, shorter hours, safer jobs. Its main tool was collective bargaining." (the AFL column fills)
    {a: cuts.bread, b: cuts.meet, draw: (T) => board(T)},
    // "Michael joined the Knights anyway. His little brother Tommy was not happy." ep5_union_meeting: Michael's hand goes up on "joined".
    {a: cuts.meet, b: cuts.kitchen, live: true, draw: (T) => renderE5Meeting(MEET(T), {quiet: true}) + lTag('A KNIGHTS OF LABOR ASSEMBLY · BROOKLYN', 172, 124, fin(T, cuts.meet + 0.1, 0.3))},
    // TOMMY: "A union? Mr. Duffy says the Knights are nothing but trouble."  MICHAEL: "Mr. Duffy doesn't work at the refinery."
    {a: cuts.kitchen, b: cuts.fort, live: true, draw: (T) => renderE5Kitchen1887(Math.max(0, T - K7.off), {quiet: true}) +
      lTag("THE KELLYS' KITCHEN · WINTER 1887", 172, 124, lVis(T, cuts.kitchen + 0.1, cuts.kitchen + 3.6))},
    // "But the biggest fight was still coming, at a steel mill the workers called Fort Frick." Guard duty around "Fort Frick" (stereo, 1892).
    {a: cuts.fort, b: dur, draw: (T) => push(T, cuts.fort, dur, 0.05) +
      printCard('e_homestead/guard_duty_around_fort_frick_carnegie_mills_1892_loc.jpg', {x: 220, y: 200, w: 1480, ar: 0.517, rot: -1, o: fin(T, cuts.fort, 0.4), T,
        caption: 'on guard duty around "Fort Frick," Homestead &middot; stereograph, 1892'}) + `</div>` + batonCard(T, cardAt, 'Fort Frick')},
  ];
  return {dur, shots};
};
window.HOLD.ch04 = {}; window.CARRY.ch04 = {};
