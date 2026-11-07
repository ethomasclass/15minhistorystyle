// The episode title card, after the cold open (4 s, no narration): the channel tape over the bridge at night.
EDITS.title = () => {
  const dur = 4.0;
  return {dur, fadeOut: 0.4, shots: [{a: 0, b: dur, draw: (T) => renderScene({look: 'night', t: T + 20, cx: 60 - 40 * (T / dur), zoom: 1.05, fx: 960, fy: 700}) +
    `<div style="position:absolute;inset:0;background:rgba(13,12,9,${(0.55 * fin(T, 0, 0.4)).toFixed(3)})"></div>` +
    op(fin(T, 0.15, 0.3), mono('chunk history &middot; episode 1 of 6', {x: 0, y: 330, size: 28, color: C.teal, ls: 6, extra: 'width:1920px;text-align:center'})) +
    slideUp(fin(T, 0.05, 0.35), tape('THE GILDED AGE', {x: 330, y: 400, size: 150, rot: -2, seed: 131}), 40) +
    op(fin(T, 0.6, 0.4), `<div style="position:absolute;left:0;top:640px;width:1920px;text-align:center;font-family:Abril;font-size:84px;color:${C.cream}">Steel, Oil, and Sugar</div>`)}]};
};
