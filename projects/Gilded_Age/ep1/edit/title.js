// The channel intro and the episode title in one card (about 4.2 s): the Chunk History logo assembles at 1.4x speed
// (brand/chunk-history/final/chunk-intro.mp4, frames in public/img/intro/), locks in by ~2.8 s, lifts, and the title lands under it.
// Sound: the brand's clicks (chunk_jingle.mp3) at the same 1.4x, cut before its page turn (no tones, no music: the channel's rule).
const INTRO_SPEED = 1.4;
EDITS.title = () => {
  const dur = 4.2, lift = (T) => ease(clamp01((T - 2.75) / 0.45));
  return {dur, fadeOut: 0.35, shots: [{a: 0, b: dur, live: true, draw: (T) => {
    const f = Math.min(185, 1 + Math.floor(T * 30 * INTRO_SPEED)), u = lift(T);
    return `<div style="position:absolute;inset:0;background:radial-gradient(ellipse 75% 75% at 50% 45%,#1b1b1b 0%,#121212 60%,#0b0b0b 100%)"></div>
      <img src="${IMG}intro/f${String(f).padStart(4, '0')}.jpg" style="position:absolute;inset:0;width:1920px;height:1080px;transform:translateY(${(-250 * u).toFixed(1)}px) scale(${(1 - 0.28 * u).toFixed(3)});transform-origin:960px 540px;-webkit-mask-image:radial-gradient(ellipse 72% 46% at 50% 50%,#000 62%,transparent 100%)">` +
      (T > 2.9 ? slideUp(fin(T, 2.95, 0.3), tape('THE GILDED AGE', {x: 330, y: 470, size: 150, rot: -2, seed: 131}), 40) : '') +
      op(fin(T, 3.25, 0.3), `<div style="position:absolute;left:0;top:720px;width:1920px;text-align:center;font-family:Abril;font-size:84px;color:${C.cream}">Steel, Oil, and Sugar</div>`) +
      op(fin(T, 3.4, 0.3), mono('episode 1 of 6', {x: 0, y: 860, size: 28, color: C.teal, ls: 6, extra: 'width:1920px;text-align:center'}));
  }}]};
};
