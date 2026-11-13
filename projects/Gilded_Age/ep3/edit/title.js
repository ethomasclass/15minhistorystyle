// The channel intro and the episode title in one card (4.2 s), as Ep 2's (../../ep2/edit/title.js), with one change for Ep 3's baton
// rule (script/SCRIPT.md: "the chapter card slams in on those words"): chapter 1 cuts on the end of "behind" and the TITLE lands on
// that cut, at once; the Chunk History logo assembles above it at 1.4x speed (brand/chunk-history/final/chunk-intro.mp4, frames in
// ep1/public/img/intro/, shared), already in its lifted place, and locks in by about 2.8 s.
// Sound: the brand's clicks (chunk_jingle.mp3) at the same 1.4x, cut before its page turn (no tones, no music: the channel's rule).
const INTRO_SPEED = 1.4;
EDITS.title = () => {
  const dur = 4.2, slam = (T) => ease(clamp01(T / 0.18));
  return {dur, fadeOut: 0.35, shots: [{a: 0, b: dur, live: true, draw: (T) => {
    const f = Math.min(185, 1 + Math.floor(T * 30 * INTRO_SPEED)), u = slam(T);
    return `<div style="position:absolute;inset:0;background:radial-gradient(ellipse 75% 75% at 50% 45%,#1b1b1b 0%,#121212 60%,#0b0b0b 100%)"></div>
      <img src="${IMG}${EP1}intro/f${String(f).padStart(4, '0')}.jpg" style="position:absolute;inset:0;width:1920px;height:1080px;transform:translateY(-300px) scale(0.56);transform-origin:960px 540px;-webkit-mask-image:radial-gradient(ellipse 60% 40% at 50% 50%,#000 55%,transparent 100%)">` +
      `<div style="position:absolute;inset:0;transform:scale(${(1.06 - 0.06 * u).toFixed(4)});transform-origin:960px 650px">` +
      tape('THE GILDED AGE', {x: 330, y: 470, size: 150, rot: -2, seed: 131}) +
      `<div class="tx" style="position:absolute;left:0;top:720px;width:1920px;text-align:center;font-family:Abril;font-size:84px;color:${C.cream}">He Sent Me</div>` +
      mono('episode 3 of 6', {x: 0, y: 860, size: 28, color: C.teal, ls: 6, extra: 'width:1920px;text-align:center'}) + `</div>`;
  }}]};
};
