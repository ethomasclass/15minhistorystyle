// Shared Ep 3 edit pieces for chapters 2 to 9 (load after edit.js): the baton chapter card and archival prints on the desk.
//
// batonCard(T, t0, title): the next chapter's title on a torn orange strip (Abril, -2 degrees) slams in ON its spoken words at t0
//   (from the outgoing chapter's words.json; SCRIPT.md "Transitions: the baton rule"), over the dimmed picture; it holds to the
//   chapter's end (t0 + 2.6 s: 2.0 s of hold after the words, and 2.5 s of reading). Sound: chunk_snap at t0 (build_ch.sh SFX).
function batonCard(T, t0, title) {
  if (T < t0) return '';
  const u = clamp01((T - t0) / 0.16), size = 132, w = title.length * size * 0.6 + size * 0.44, x = Math.round(960 - w / 2);
  return dimBy(0.62 * clamp01((T - t0) / 0.12)) +
    `<div style="position:absolute;inset:0;transform:scale(${(1.12 - 0.12 * ease(u)).toFixed(4)});transform-origin:960px 540px;opacity:${Math.min(1, u * 2).toFixed(3)}">` +
    tape(title, {x, y: 460, size, rot: -2, seed: 300 + title.length}) + `</div>`;
}
const CARD_HOLD = 2.6;
/** An archival print lying on the desk: the picture in a thin cream border, a contact shadow and a lifted shadow, a slow drift;
 *  its source and date in mono under it (credits in ../public/img/credits.json). */
function printCard(src, {x, y, w, ar = 0.75, rot = 0, o = 1, T = 0, caption = ''}) { // ar: the picture's height / width
  const cy = w * ar + 36;
  const dy = (1 - ease(o)) * 60 + Math.sin(T * 0.7 + x) * 2.5;
  return `<div style="position:absolute;left:${x}px;top:${(y + dy).toFixed(1)}px;width:${w}px;transform:rotate(${rot}deg);opacity:${Math.min(1, o * 1.6).toFixed(3)};
      background:#E9E2D2;padding:10px;filter:drop-shadow(0 3px 2px rgba(0,0,0,.7)) drop-shadow(0 18px 22px rgba(0,0,0,.55))">
      <img src="${IMG}${src}" style="display:block;width:100%;filter:sepia(.18) contrast(1.04)"></div>` +
    (caption ? op(o, mono(caption, {x, y: y + dy + cy, size: 20, color: C.cream, ls: 2, extra: 'background:rgba(13,12,9,.75);padding:4px 10px'})) : '');
}
/** A vocabulary index card (explainers.js card(), the series' style), in screen space. */
const vocab = (x, y, term, def, o) => (o > 0.01 ? svg(card(x, y, term, def, null, o)) : '');
