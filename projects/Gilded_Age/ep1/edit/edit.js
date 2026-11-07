// Chapter edits timed to the narration (Gilded Age Ep 1). A chapter is a list of shots; each shot draws one full frame
// (scene SVG + HTML overlays) at chapter time T. Shot boundaries are word times from public/audio/<ch>.words.json,
// injected by render_edit.mjs as window.WORDS[ch], so re-voicing re-times the cut without touching the shots.
//   EDITS.ch01 = () => ({dur, shots: [{a, b, draw: (T) => html}, ...]})
const EDITS = {};
const XF = 0.3;                    // crossfade between shots, seconds (centred on the cut)
const IMG = '../public/img/';

/** Start time of the nth (1-based) occurrence of a word in a chapter, matched without punctuation or case. */
function wordAt(ch, word, n = 1) {
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9']/g, '');
  const want = norm(word); let k = 0;
  for (const w of window.WORDS[ch].words) if (norm(w.w) === want && ++k === n) return w.s;
  throw new Error(`wordAt(): "${word}" #${n} not found in ${ch}`);
}
const fin = (T, t0, d = 0.45) => clamp01((T - t0) / d);                       // fade/slide in from t0
const fout = (T, t1, d = 0.45) => 1 - clamp01((T - t1) / d);                  // fade out from t1
const op = (o, html) => `<div style="position:absolute;inset:0;opacity:${o.toFixed(3)}">${html}</div>`;
const slideUp = (o, html, px = 30) => `<div style="position:absolute;inset:0;opacity:${o.toFixed(3)};transform:translateY(${((1 - ease(o)) * px).toFixed(1)}px)">${html}</div>`;

const cache = {};
function editFrame(ch, T) {
  const E = cache[ch] || (cache[ch] = EDITS[ch]());
  const S = E.shots;
  let i = S.findIndex((s) => T >= s.a && T < s.b); if (i < 0) i = T < S[0].a ? 0 : S.length - 1;
  const fade = E.fadeOut ? fout(T, E.dur - E.fadeOut, E.fadeOut) : 1;
  const wrap = (h) => fade < 1 ? `${h}<div style="position:absolute;inset:0;background:#0d0c09;opacity:${(1 - fade).toFixed(3)}"></div>` : h;
  const s = S[i], next = S[i + 1], prev = S[i - 1];
  if (next && !next.cut && T > s.b - XF / 2) return {a: wrap(s.draw(T)), b: wrap(next.draw(T)), mix: ease((T - (s.b - XF / 2)) / XF)};
  if (prev && !s.cut && T < s.a + XF / 2) return {a: wrap(prev.draw(T)), b: wrap(s.draw(T)), mix: ease((T - (s.a - XF / 2)) / XF)};
  return {a: wrap(s.draw(T))};
}

/* ---------- shared pieces ---------- */
const stamp = (text, o = 1) => op(o, mono(text, {x: 44, y: 1022, size: 22, color: C.cream, extra: 'background:rgba(13,12,9,.7);padding:6px 12px'}));
const compositeBar = (o = 1) => op(o, `<div style="position:absolute;left:44px;top:1010px;display:flex;align-items:center;gap:12px;background:rgba(13,12,9,.85);padding:9px 16px">
  <div style="width:16px;height:16px;border-radius:50%;background:${C.coral}"></div>
  <div style="font-family:Mono;font-size:22px;letter-spacing:2px;color:${C.cream}">THE KELLYS ARE A COMPOSITE FAMILY &middot; WHAT HAPPENS TO THEM REALLY HAPPENED</div></div>`);

/** A bust cut-out lying on the desk (tools/bust_cut.py: no border, no mount, aged): a tight contact shadow and a soft lifted
 *  shadow give it depth; it rises into place as it arrives and drifts a few pixels while it sits. */
function deskCut(src, {x, y, w, rot = 0, o = 1, T = 0, caption = '', cx = 0, cy = -44}) {
  const dy = (1 - ease(o)) * 70 + Math.sin(T * 0.9 + x) * 3, lift = 16 + 10 * (1 - ease(o));
  return `<div style="position:absolute;left:${x}px;top:${(y + dy).toFixed(1)}px;width:${w}px;transform:rotate(${rot}deg);opacity:${Math.min(1, o * 1.6).toFixed(3)};
      filter:drop-shadow(0 3px 2px rgba(0,0,0,.75)) drop-shadow(0 ${lift.toFixed(0)}px 22px rgba(0,0,0,.6))">
      <img src="${IMG + src}" style="display:block;width:100%"></div>` +
    (caption ? op(o, mono(caption, {x: x + cx, y: y + cy, size: 20, color: C.cream, ls: 2})) : '');
}
/** The desk itself: near-black wood with a soft pool of lamp light. */
const desk = () => `<div style="position:absolute;inset:0;background:radial-gradient(ellipse 70% 80% at 50% 45%,#2a2620 0%,#16140f 55%,#0b0a07 100%)"></div>
  <svg style="position:absolute;inset:0" width="1920" height="1080"><filter id="dg"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.12" numOctaves="3" seed="4"/><feColorMatrix type="saturate" values="0"/></filter>
  <rect width="1920" height="1080" filter="url(#dg)" opacity="0.22" style="mix-blend-mode:overlay"/></svg>`;

/** Cross-section of a main cable in an x-ray circle: 19 strands (1 + 6 + 12), each a hex bundle of 37 wires, a wrapping wire
 *  around the outside. `bad` (0..1) turns the wires of one strand rust, one by one: the wire that failed its test.
 *  (Schematic: the real cable has about 278 wires a strand, 5,434 in all; RESEARCH.md.) */
function cableXray({cx, cy, r, open = 1, bad = 0, seed = 11}) {
  const R = r * ease(open); if (R < 1) return '';
  const strandR = r * 0.168, wr = strandR / 7.2, rr = rng(seed);
  const hexWires = []; for (let q = -3; q <= 3; q++) for (let s = -3; s <= 3; s++) { const t = -q - s; if (Math.abs(t) > 3) continue;
    hexWires.push([wr * 2 * (q + s / 2), wr * 2 * (s * 0.866)]); }
  const strands = [[0, 0]]; for (let k = 0; k < 6; k++) strands.push([Math.cos(k * TAU / 6) * strandR * 2.05, Math.sin(k * TAU / 6) * strandR * 2.05]);
  for (let k = 0; k < 12; k++) { const a = k * TAU / 12 + TAU / 24; strands.push([Math.cos(a) * strandR * 4.0, Math.sin(a) * strandR * 4.0]); }
  const badStrand = 9, parts = [];
  strands.forEach(([sx, sy], si) => {
    parts.push(`<circle cx="${f1(cx + sx)}" cy="${f1(cy + sy)}" r="${f1(strandR * 1.02)}" fill="#0A1312" stroke="${C.teal}" stroke-opacity=".35" stroke-width="1.5"/>`);
    hexWires.forEach(([wx, wy], wi) => {
      const turn = si === badStrand && rr() < 0.85 ? clamp01(bad * 1.6 - (wi / hexWires.length) * 0.6) : (rr(), 0);
      const fill = turn > 0.5 ? '#9A4A2E' : '#BFD8D3';
      parts.push(`<circle cx="${f1(cx + sx + wx)}" cy="${f1(cy + sy + wy)}" r="${f1(wr * 0.86)}" fill="${fill}" opacity="${turn > 0.5 ? 0.95 : 0.8}"/>`);
    });
  });
  const id = 'cx' + seed;
  return `<defs><clipPath id="${id}"><circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(R)}"/></clipPath></defs>
    <g clip-path="url(#${id})"><rect x="${f1(cx - r)}" y="${f1(cy - r)}" width="${f1(2 * r)}" height="${f1(2 * r)}" fill="#0E1817" opacity=".97"/>
      <circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(strandR * 5.15)}" fill="none" stroke="#7FA7A0" stroke-width="${f1(wr * 1.6)}" stroke-dasharray="${f1(wr * 1.2)} ${f1(wr * 0.5)}"/>
      ${parts.join('')}</g>
    <circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(R)}" fill="none" stroke="${C.ink}" stroke-width="10"/>
    <circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(R)}" fill="none" stroke="${C.teal}" stroke-width="5"/>`;
}

if (typeof window !== 'undefined') Object.assign(window, {EDITS, editFrame, wordAt});
