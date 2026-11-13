// Shared pieces for chapters 6 to 9 (ch06.js to ch09.js). Loaded after edit.js and the look-dev scripts.

/** Render a look-dev clip without its own clip text: the edit sets the text. (The clip's screen layer is the 4th argument of
 *  explainers.js frame(); it is dropped for the duration of the call.) */
function lQuiet(fn) { const f0 = window.frame; window.frame = (d, s, w, scr, t) => f0(d, s, w, '', t); try { return fn(); } finally { window.frame = f0; } }

/** An archival print on the desk (a creased cut-out from public/img/desk/, or any image), with a slow push; returns the whole
 *  backdrop + print; close nothing. */
function lPrint(T, a, b, src, {x, y, w, rot = 0, z = 0.04, ox = 960, oy = 540} = {}) {
  const k = 1 + z * ease(clamp01((T - a) / Math.max(0.1, b - a)));
  return `<div style="position:absolute;inset:0;transform:scale(${k.toFixed(4)});transform-origin:${ox}px ${oy}px">${desk()}${deskCut(src, {x, y, w, rot, o: fin(T, a + 0.05, 0.5), T})}</div>`;
}
/** The source tag under an archival image (mono, dark box, bottom left). */
const lSrc = (txt, o, {x = 100, y = 972} = {}) => o > 0.01 ? op(o, mono(txt, {x, y, size: 22, color: C.cream, extra: 'background:rgba(13,12,9,.78);padding:6px 12px'})) : '';
/** A Pen note (orange handwriting) on the screen. */
const lNote = (txt, x, y, o, size = 32, rot = -3) => o > 0.01 ? op(o, svg(penS(x, y, txt, size, rot))) : '';
/** A mono tag (explainers.js tag) on the screen. */
const lTag = (txt, x, y, o) => o > 0.01 ? svg(tag(x, y, txt, o)) : '';
/** fin * fout in one: visible from a to b. */
const lVis = (T, a, b, d = 0.35) => fin(T, a, d) * fout(T, b - d, d);
/** A teal ellipse drawn on (a ring around something on a print). */
const lRing = (cx, cy, rx, ry, k, w = 5) => k <= 0 ? '' : svg(drawOn([...Array(49)].map((_, i) => { const q = -Math.PI / 2 + TAU * i / 48; return [cx + Math.cos(q) * rx, cy + Math.sin(q) * ry]; }), k, w));
/** Who speaks when, from a words.json's 'who' spans (NARR, MA, RIVKE, SORE ...). */
function lSpeak(ch) { const S = []; window.WORDS[ch].words.forEach((x) => { const L = S[S.length - 1]; if (L && L.who === x.who && x.s - L.e < 0.9) L.e = x.e; else S.push({who: x.who, s: x.s, e: x.e}); }); return S; }
/** Start time of the occurrence of a word nearest a given time (s): unambiguous where a word repeats ("in", "the", "but"). */
function lWord(ch, word, near) {
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9']/g, ''), want = norm(word); let best = null;
  for (const x of window.WORDS[ch].words) if (norm(x.w) === want && (best === null || Math.abs(x.s - near) < Math.abs(best - near))) best = x.s;
  if (best === null) throw new Error(`lWord(): "${word}" not found in ${ch}`); return best;
}
