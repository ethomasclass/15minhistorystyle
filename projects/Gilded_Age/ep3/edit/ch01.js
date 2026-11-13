// Chapter 1, "He Sent Me" (cold open, 0:00 to 1:27): the plan approved shot by shot (CH01_PLAN.md). Lower Manhattan at dusk in the
// 3D model, down to the fort; Sore walks out with the children, the trunk and the feather bed; her husband isn't there; the runner
// in the good coat walks over, takes the trunk, and Shmuel takes his hand; freeze; back up into the model; the question; the map
// home, and the episode title card lands on "behind".
//
// The drawn set is lookdev/ep3.js ep3_runner (a 23 s draft whose first 11.5 s are this action). Its poses are pure functions of
// the clip's own time, so the edit drives that time from narration time (RN_MAP below): holding a time is a freeze, a slow
// stretch is a slow walk, and every contact (E3K) stays solved. The camera, the head turns and the blinks are the edit's; the
// water, smoke and flags run on narration time (te), so a held beat stays alive.
EDITS.ch01 = () => {
  const ch = 'ch01_he_sent_me', W = window.WORDS[ch], w = (word, n) => wordAt(ch, word, n);
  const wa = (word, after) => { const k = W.words.filter((x) => x.s < after && x.w.toLowerCase().replace(/[^a-z0-9']/g, '') === word.toLowerCase()).length; return w(word, k + 1); }; // first after a time
  const dur = W.words[W.words.length - 1].e + 0.1;   // cut on the end of "behind": the title card lands there
  const c = {
    walk: w('woman') - 0.26, three: w('Three'), her: w('Her'), isnt: w("isn't"), but: w('But'), good: w('Good'), clean: w('Clean'), man: w('man', 1),
    over: w('walks', 2), smiling: w('smiling'), welcome: w('Welcome,'), my: w('My'), yankel: w('Yankel', 2), trunk: w('trunk', 2), never: w('never'),
    lets: w('lets'), takes: w('takes'), his: w('his', 2), york: w('New', 1), runners: w('Runners'), state: w('state'), fence: w('fence'), out: w('out', 2),
    work: w('work'), where: w('Where'), so: w('So'), who: w('Who', 4), to: wa('To', 80), behind: w('behind'),
  };
  // ---- the runner scene, retimed: narration time T -> the clip's own time ts (ep3.js renderE3Runner) ----
  // clip beats: walk-out 0 to 3.5, Rivke settles 3.5 to 4.05, the runner walks over 5.6 to 8.4 (settles to 8.8), stoops 8.9,
  // grips the handle 9.45, lifts 9.5 to 10.1, Shmuel lets go 10.2, walks two steps, takes the man's hand 11.3, freeze 11.5
  const RN_MAP = remap([[c.walk, 0], [6.7, 0], [10.9, 3.5], [12.0, 4.05], [34.2, 5.6], [37.0, 8.4], [37.4, 8.8], [50.55, 8.9],
    [51.15, 9.45], [51.2, 9.5], [51.8, 10.1], [c.lets, 10.2], [57.6, 11.3], [58.6, 11.5]]);
  const FREEZE = c.york;                                    // 58.7: the picture stops
  // camera keys [T, zoom, ux, uy] through a monotone cubic (no stops between keys); zoom interpolated in log space
  const CAM = [[6.5, 1.0, 960, 560], [11.0, 1.02, 930, 566], [14.6, 1.05, 900, 576], [24.2, 1.42, 760, 660], [25.0, 1.46, 840, 668], [28.6, 1.72, 1600, 700],
    [31.1, 1.6, 1570, 696], [34.2, 1.42, 1380, 690], [37.4, 1.5, 1000, 690], [50.5, 1.62, 962, 700], [51.8, 1.66, 955, 705], [54.9, 1.8, 942, 720],
    [57.8, 2.3, 922, 760], [FREEZE, 2.32, 921, 761], [66.4, 2.02, 920, 742], [70, 2.02, 920, 742]].map(([t, z, x, y]) => [t, Math.log(z), x, y]);
  const camAtT = (T) => { const [lz, ux, uy] = emInterp(CAM, Math.min(T, 66.4)); return {z: Math.exp(lz), ux, uy}; };
  const blink = (T, ph) => ((T + ph) % 3.7) < 0.12;
  // heads only (tilt, expression, blink): nothing a contact depends on
  const look = (T) => () => {
    const talkM = (T > c.welcome - 0.1 && T < 41.6) || (T > c.yankel - 0.1 && T < 51.3), talkS = T > c.my - 0.1 && T < 45.5;
    const around = smooth(c.her, c.her + 0.4, T) * (1 - smooth(c.isnt + 0.2, c.isnt + 0.7, T));
    return {
      sore: {tilt: around ? 7 * Math.sin((T - c.her) * 1.9) + 3 * around : T > 37.4 ? 9 + (talkS ? 2.5 * Math.sin(T * 6.3) : 0) : 1.5 * Math.sin(T * 0.6),
        expr: T > 17.2 ? 'worried' : 'neutral', blink: blink(T, 0.3)},
      shmuel: {tilt: T > 36.5 ? 13 : 6 + 2 * Math.sin(T * 0.8), blink: blink(T, 1.9)},
      rivke: {tilt: T > 36.5 ? 7 : 4 * Math.sin(T * 0.5 + 1), blink: blink(T, 2.6)},
      man: {tilt: T < 34.2 ? -4 + 2.5 * Math.sin(T * 0.7) : T > 51.8 ? -16 : -6 + (talkM ? 3 * Math.sin(T * 5.7) : 0), expr: T > c.smiling ? 'smile' : 'neutral', blink: blink(T, 1.1)},
    };
  };
  const runner = (T, extra = {}) => { const fz = T >= FREEZE ? T - FREEZE : null;
    return renderE3Runner(RN_MAP(T), {te: Math.min(T, FREEZE), cam: camAtT(T), quiet: true, look: look(T), noFlash: false,
      ring: smooth(c.takes, c.his + 0.3, T), fz, fence: smooth(c.fence - 0.5, c.out + 0.1, T), hardT: T >= c.work ? T - c.work : null, ...extra}); };
  // close-up inserts while he waits at the lamp post: the coat (collar to knees: the face stays above the frame) and the boots
  const insert = (T, cam) => renderE3Runner(RN_MAP(T), {te: T, cam, quiet: true, look: look(T), manDet: 1, manRim: {c: '#FFC88A', a: 0.75, dx: 0.011, dy: -0.004}, boots: true});
  const xm0 = 990 + 6 * e3R(RN.H);                          // where he stands (the clip's xm0)
  const T_ = (txt, x, y, o) => o > 0.01 ? svg(tag(x, y, txt, o)) : '';
  const P_ = (txt, x, y, o, size = 32) => o > 0.01 ? op(o, svg(penS(x, y, txt, size, -3))) : '';
  const goodCoat = (T) => P_('good coat, clean boots', 130, 230, fin(T, c.good, 0.3) * fout(T, 33.7, 0.35));
  // the empty spot where Yankel should be standing, by the fence (teal: it explains)
  const emptySpot = (T) => { const u = smooth(c.her + 1.2, c.her + 2.0, T) * (1 - smooth(c.but, c.but + 0.6, T)); if (u <= 0) return '';
    const cm = cam2(camAtT(T)), x = cm.sx(1030), y = cm.sy(RN.G - 4), rx = 70 * cm.z, ry = 16 * cm.z;
    return svg(drawOn([...Array(41)].map((_, k) => { const q = Math.PI + TAU * k / 40; return [x + Math.cos(q) * rx, y + Math.sin(q) * ry]; }), u, 5)); };
  const shots = [
    // 1. "May, 1884. The bottom tip of Manhattan. The sun is going down." The model at dusk: a glide over lower Manhattan, south-west
    //    to the round fort at the Battery.
    {a: 0, b: c.walk, draw: (T) => renderDuskGlide(T) + T_('THE BATTERY · NEW YORK · MAY 1884', 130, 120, fin(T, 0.5, 0.4))},
    // 2. "A woman walks out of an old round stone fort with two children, a roped feather bed and a trunk. Everything they own."
    //    Sore out of the gate with the trunk and Shmuel's hand, Rivke with the feather bed. Then the slow push on the family; Sore
    //    looks around; the empty spot by the fence ("Her husband was supposed to be waiting right here. He isn't."). "But someone
    //    else is.": the camera drifts right to the dark figure at the lamp post, face in shadow.
    {a: c.walk, b: c.good - 0.08, cut: true, draw: (T) => runner(T) + emptySpot(T) +
      T_('COMPOSITE CHARACTERS', 150, 1000, fin(T, 7.0) * fout(T, 14.2)) +
      P_('everything they own', 1020, 250, fin(T, w('Everything'), 0.3) * fout(T, 17.0)) +
      P_('her husband was supposed to be here', 130, 230, fin(T, c.her + 0.2, 0.3) * fout(T, 25.0))},
    // 3. "Good coat." Insert: the coat, collar to knees.
    {a: c.good - 0.08, b: c.clean - 0.08, cut: true, live: true, draw: (T) => { const u = clamp01((T - c.good) / 1.2);
      return insert(T, {z: 5.0 + 0.3 * u, ux: xm0 + 4, uy: 792 - 6 * u}) + goodCoat(T); }},
    // 4. "Clean boots." Insert: the boots, polished, on the flagstones.
    {a: c.clean - 0.08, b: c.man - 0.12, cut: true, live: true, draw: (T) => { const u = clamp01((T - c.clean) / 1.3);
      return insert(T, {z: 5.5 + 0.3 * u, ux: xm0 + 10 - 8 * u, uy: 888}) + goodCoat(T); }},
    // 5. "A man who has watched a lot of boats come in." Back out; "He walks over, smiling, and speaks to her in her own language."
    //    The two-shot through the dialogue ("SPEAKING YIDDISH"); on "trunk" his hand closes on the handle. "He has never heard of
    //    Yankel Rabinowitz. And the little boy lets go of his mother's hand, and takes his.": the slow push to the hands, the teal
    //    ring. "New York had a name for men like this. Runners.": FREEZE, dimmed. The teal line traces the iron fence ("The state
    //    built a fence around this entire fort to keep them out."). "It didn't work.": the hard freeze.
    {a: c.man - 0.12, b: 67.5, cut: true, draw: (T) => runner(T) + goodCoat(T) +
      T_('SPEAKING YIDDISH', 150, 1000, fin(T, c.welcome - 0.2) * fout(T, c.trunk + 0.4)) +
      T_('NEW YORK CALLED THEM RUNNERS', 150, 1000, fin(T, c.runners, 0.3) * fout(T, 67.2, 0.3))},
    // 6. "Where does he want to take them? We'll get back to that. In America, with almost nothing, you had to decide fast who to
    //    trust." The drawn frame falls away and the model rises: the family a tiny gold marker at the fort among the other arrivals.
    //    "So here's my question." The question across the screen.
    {a: 67.5, b: c.to, cut: true, draw: (T) => { const k = smooth(67.5, 68.3, T), q = fin(T, c.who, 0.45);
      return renderDuskRise(T) +
        (k < 1 ? `<div style="position:absolute;inset:0;opacity:${(1 - k).toFixed(3)};transform:scale(${(1 + 0.35 * ease(k)).toFixed(4)});transform-origin:930px 700px">${runner(67.5)}</div>` : '') +
        dimBy(0.74 * fin(T, c.so, 0.6)) +
        op(fin(T, c.so + 0.1), mono('the question', {x: 130, y: 300, size: 28, color: C.teal, ls: 6})) +
        slideUp(q, `<div class="tx" style="position:absolute;left:124px;top:350px;font-family:Abril;font-size:96px;line-height:1.08;color:${C.cream}">Who helped newcomers<br>make it in America,</div>`) +
        (fin(T, c.who + 0.5) > 0 ? slideUp(fin(T, c.who + 0.5), tape('and who tried to keep them out?', {x: 120, y: 610, size: 84, rot: -2, seed: 31})) : ''); }},
    // 7. "To answer it, we have to go back three weeks and four thousand miles, to what they left behind." The map sweeps east
    //    across the Atlantic to HOME in the Pale; the title card lands on "behind" (the cut to title.js).
    {a: c.to, b: dur, draw: (T) => renderSweepHome(T)},
  ];
  return {dur, shots};
};
