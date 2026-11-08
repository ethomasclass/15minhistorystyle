// Chapter edits timed to the narration (Gilded Age Ep 1). A chapter is a list of shots; each shot draws one full frame
// (scene SVG + HTML overlays) at chapter time T. Shot boundaries are word times from public/audio/<ch>.words.json,
// injected by render_edit.mjs as window.WORDS[ch], so re-voicing re-times the cut without touching the shots.
//   EDITS.ch01 = () => ({dur, shots: [{a, b, draw: (T) => html}, ...]})
const EDITS = {};
const XF = 0.3;
const STEP = 12;                   // drawings a second for desk/prop/text shots
const LIVE = /render(Scene|Refinery|Loom|Bessemer|VI|HI|Cutaway|Street)\(|gateScene\(|medicine\(/;                    // crossfade between shots, seconds (centred on the cut)
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
  // The handmade look: desk, print, prop, text and drawn-explainer shots move on 12 drawings a second (each pose held 2-3
  // frames); the animated silhouette scenes and look-dev explainers ("live" shots) stay smooth at 30. Crossfades and the
  // closing fade use real time, so cuts never stutter.
  const live = (sh) => sh.live ?? (sh.live = LIVE.test(sh.draw.toString()));
  const at = (sh) => live(sh) ? T : Math.floor(T * STEP + 1e-6) / STEP;
  const drw = (sh) => sh.draw(at(sh));
  if (next && !next.cut && T > s.b - XF / 2) return {a: wrap(drw(s)), b: wrap(drw(next)), mix: ease((T - (s.b - XF / 2)) / XF)};
  if (prev && !s.cut && T < s.a + XF / 2) return {a: wrap(drw(prev)), b: wrap(drw(s)), mix: ease((T - (s.a - XF / 2)) / XF)};
  return {a: wrap(drw(s))};
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
function cableXray({cx, cy, r, open = 1, bad = 0, seed = 11, extra = 0}) {
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
      ${parts.join('')}${extra > 0 ? Array.from({length: 64}, (_, i) => { const a = i / 64 * TAU, rr2 = strandR * 5.55;
        return `<circle cx="${f1(cx + Math.cos(a) * rr2)}" cy="${f1(cy + Math.sin(a) * rr2)}" r="${f1(wr * 1.1)}" fill="${C.teal}" opacity="${clamp01(extra * 2 - i / 64).toFixed(2)}"/>`; }).join('') : ''}</g>
    <circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(R)}" fill="none" stroke="${C.ink}" stroke-width="10"/>
    <circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(R)}" fill="none" stroke="${C.teal}" stroke-width="5"/>`;
}

if (typeof window !== 'undefined') Object.assign(window, {EDITS, editFrame, wordAt});

/** A prop cut-out (public/img/props/*.webp) on the desk, with the same contact + lifted shadow as deskCut. */
const deskProp = (id, opts) => deskCut(`props/${id}.webp`, opts);

/** An index card for a vocabulary word: the term set big, how to say it, the definition (text.js's vCard, parameterised). */
function vocabCard(term, say, pos, def, {x = 1180, y = 110, w = 660, o = 1, rot = 2, size = 72} = {}) {
  const dy = (1 - ease(o)) * -40;
  return op(Math.min(1, o * 1.5), `<div style="position:absolute;left:${x}px;top:${y + dy}px;width:${w}px;transform:rotate(${rot}deg);background:${C.cream};box-shadow:0 18px 34px rgba(0,0,0,.6);
      background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 45px,rgba(17,17,17,.12) 45px,rgba(17,17,17,.12) 47px);background-position:0 96px;padding:30px 38px 34px">
      <div style="display:flex;align-items:baseline;gap:20px;flex-wrap:wrap"><div style="font-family:Abril;font-size:${size}px;line-height:1;color:${C.ink}">${term}</div>
      <div style="font-family:Mono;font-size:22px;letter-spacing:2px;color:#444">${say} &middot; ${pos}</div></div>
      <div style="font-family:Inter;font-weight:600;font-size:36px;line-height:1.38;color:${C.ink};margin-top:16px">${def}</div></div>` +
    tape('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;', {x: x + 250, y: y - 18 + dy, size: 36, rot: -6, seed: 21}));
}

/** An 1880s station clock, drawn: a turned wooden bezel, an aged white dial with bar markers, black hands.
 *  `time` is in hours (12.0 = noon; 11.8 = 11:48); `flash` (0..1) lights the dial when it strikes. */
function stationClock(cx, cy, r, time, {flash = 0, seconds = true} = {}) {
  const h = ((time % 12) + 12) % 12, m = (time * 60) % 60, s = (time * 3600) % 60;
  const hand = (ang, len, wdt, col = '#141210') => { const a = ang * TAU - TAU / 4;
    return `<line x1="${f1(cx - Math.cos(a) * len * 0.16)}" y1="${f1(cy - Math.sin(a) * len * 0.16)}" x2="${f1(cx + Math.cos(a) * len)}" y2="${f1(cy + Math.sin(a) * len)}" stroke="${col}" stroke-width="${wdt}" stroke-linecap="round"/>`; };
  const ticks = []; for (let i = 0; i < 60; i++) { const a = i / 60 * TAU, big = i % 5 === 0, r0 = r * (big ? 0.74 : 0.82), r1 = r * 0.88;
    ticks.push(`<line x1="${f1(cx + Math.cos(a) * r0)}" y1="${f1(cy + Math.sin(a) * r0)}" x2="${f1(cx + Math.cos(a) * r1)}" y2="${f1(cy + Math.sin(a) * r1)}" stroke="#1d1a16" stroke-width="${big ? r * 0.035 : r * 0.009}"/>`); }
  return `<g filter="url(#ckshadow)">
      <circle cx="${cx}" cy="${cy}" r="${f1(r * 1.13)}" fill="#4A3220"/><circle cx="${cx}" cy="${cy}" r="${f1(r * 1.13)}" fill="url(#ckwood)"/>
      <circle cx="${cx}" cy="${cy}" r="${f1(r * 1.0)}" fill="#2E1F14"/>
      <circle cx="${cx}" cy="${cy}" r="${f1(r * 0.96)}" fill="#E6DFCF"/><circle cx="${cx}" cy="${cy}" r="${f1(r * 0.96)}" fill="url(#ckdial)"/>
      ${flash > 0 ? `<circle cx="${cx}" cy="${cy}" r="${f1(r * 0.96)}" fill="#FFF6D8" opacity="${(0.55 * flash).toFixed(3)}"/>` : ''}
      ${ticks.join('')}${hand(h / 12 + m / 720, r * 0.5, r * 0.06)}${hand(m / 60, r * 0.76, r * 0.04)}${seconds ? hand(s / 60, r * 0.8, r * 0.012, '#8A2E22') : ''}
      <circle cx="${cx}" cy="${cy}" r="${f1(r * 0.05)}" fill="#141210"/></g>`;
}
const clockDefs = `<defs><radialGradient id="ckwood" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#9A6A3E" stop-opacity=".9"/><stop offset=".6" stop-color="#5A3A22" stop-opacity=".4"/><stop offset="1" stop-color="#1E140C" stop-opacity=".9"/></radialGradient>
  <radialGradient id="ckdial" cx=".5" cy=".45" r=".6"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#6B5A3A" stop-opacity=".35"/></radialGradient>
  <filter id="ckshadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#000" flood-opacity=".7"/><feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#000" flood-opacity=".55"/></filter></defs>`;

/** Piecewise-linear time map: [[T0, t0], [T1, t1], ...] -> a function from chapter time to a clip's own time. */
const remap = (pts) => (T) => { if (T <= pts[0][0]) return pts[0][1]; for (let i = 1; i < pts.length; i++) if (T <= pts[i][0]) {
  const [a, x] = pts[i - 1], [b, y] = pts[i]; return x + (y - x) * (T - a) / (b - a); } return pts[pts.length - 1][1]; };
/** A line that draws itself from 0 to 1 (teal, with the ink outline), for connections in explainers. */
function drawLine(pts, k, {w = 5} = {}) {
  if (k <= 0) return ''; const d = 'M' + pts.map((p) => p.join(',')).join(' L');
  const L = pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
  const da = `stroke-dasharray="${f1(L)}" stroke-dashoffset="${f1(L * (1 - clamp01(k)))}"`;
  return `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="${w + 4}" stroke-linecap="round" stroke-linejoin="round" ${da}/><path d="${d}" fill="none" stroke="${C.teal}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${da}/>`;
}
