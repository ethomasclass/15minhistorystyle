// The vertical layer for the Gilded Age Shorts (1080x1920). Loaded after Ep1's edit.js, whose wordAt / editFrame / fin / op /
// cableXray / remap are reused unchanged: a short is an EDITS entry like a chapter, and its words are window.WORDS[ch].
// What is new here: the 1920x1080 look-dev scenes cropped into the tall frame (`wide`), the desk and cut-outs laid out natively
// at 1080x1920 (`vdesk`, `vcut`, `vprop`), burned-in captions on the word timings (`captions`), and the end card (`endCard`).
const VW = 1080, VH = 1920;
const VIMG = '../../ep1/public/img/';
// Safe area for Shorts: keep text out of the top 200 px, the bottom 350 px and the right 180 px (the YouTube UI).
const SAFE_V = {x0: 40, x1: VW - 180, y0: 200, y1: VH - 350};
const CAP_Y = 1230;                // captions sit in the lower-middle third, above the bottom UI

const vsvg = (body) => `<svg style="position:absolute;inset:0" width="${VW}" height="${VH}" viewBox="0 0 ${VW} ${VH}">${body}</svg>`;

/** A 1920x1080 scene drawn into the tall frame: scaled by s (>= 1.78 so it always covers the frame, no bars) with the scene
 *  point (fx, fy) placed at (540, cy) of the vertical frame, clamped so no edge ever shows. */
function wide(html, {s = 1.8, fx = 960, fy = 540, cy = 960} = {}) {
  s = Math.max(s, VH / 1080 + 0.001);
  const tx = Math.min(0, Math.max(VW - 1920 * s, 540 - fx * s)), ty = Math.min(0, Math.max(VH - 1080 * s, cy - fy * s));
  return `<div style="position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:0 0;transform:translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) scale(${s.toFixed(4)})">${html}</div>`;
}

/** The desk, tall: near-black wood, a pool of lamp light a little above the middle, the same grain as Ep1's. */
const vdesk = () => `<div style="position:absolute;inset:0;background:radial-gradient(ellipse 85% 55% at 50% 40%,#2a2620 0%,#16140f 58%,#0b0a07 100%)"></div>
  <svg style="position:absolute;inset:0" width="${VW}" height="${VH}"><filter id="vdg"><feTurbulence type="fractalNoise" baseFrequency="0.12 0.004" numOctaves="3" seed="4"/><feColorMatrix type="saturate" values="0"/></filter>
  <rect width="${VW}" height="${VH}" filter="url(#vdg)" opacity="0.22" style="mix-blend-mode:overlay"/></svg>`;
/** The desk with a slow push in between a and b (close the div with `</div>` after the cut-outs). */
const vback = (T, a, b, z = 0.04) => `<div style="position:absolute;inset:0;transform-origin:540px 760px;transform:scale(${(1 + z * ease(clamp01((T - a) / (b - a)))).toFixed(4)})">${vdesk()}`;

/** A cut-out on the desk (Ep1's deskCut, from Ep1's image folder): contact + lifted shadow, rises in, drifts a little. */
function vcut(src, {x, y, w, rot = 0, o = 1, T = 0, caption = '', cx = 0, cy = -40}) {
  const dy = (1 - ease(o)) * 70 + Math.sin(T * 0.9 + x) * 3, lift = 16 + 10 * (1 - ease(o));
  return `<div style="position:absolute;left:${x}px;top:${(y + dy).toFixed(1)}px;width:${w}px;transform:rotate(${rot}deg);opacity:${Math.min(1, o * 1.6).toFixed(3)};
      filter:drop-shadow(0 3px 2px rgba(0,0,0,.75)) drop-shadow(0 ${lift.toFixed(0)}px 22px rgba(0,0,0,.6))">
      <img src="${VIMG + src}" style="display:block;width:100%"></div>` +
    (caption ? op(o, mono(caption, {x: x + cx, y: y + cy, size: 22, color: C.cream, ls: 2})) : '');
}
const vprop = (id, opts) => vcut(`props/${id}.webp`, opts);

/** A big number or figure set in Abril, centred on x. */
const bigNum = (txt, {x = 470, y, size = 220, color = C.cream, o = 1}) => op(o, `<div style="position:absolute;left:${x - 500}px;top:${y}px;width:1000px;text-align:center;font-family:Abril;font-size:${size}px;line-height:1;color:${color};text-shadow:0 10px 30px rgba(0,0,0,.6)">${txt}</div>`);

/* ---------- captions ---------- */
const capCache = {};
/** Group a short's words into caption chunks of 2 to 4 words: break after punctuation, at a pause, or at 4 words / 18 letters.
 *  A one-word chunk is merged into its neighbour unless it ends a sentence. Each chunk shows from its first word to the next. */
function capChunks(ch) {
  if (capCache[ch]) return capCache[ch];
  const W = window.WORDS[ch].words, out = []; let cur = [];
  const len = (a) => a.map((x) => x.w).join(' ').length;
  W.forEach((x, i) => {
    cur.push(x); const nx = W[i + 1];
    const punct = /[.,?!;:]$|\.\.\.$/.test(x.w), gap = nx ? nx.s - x.e : 1;
    if (!nx || cur.length >= 4 || (punct && cur.length >= 1) || gap > 0.45 || len([...cur, nx]) > 18) { out.push(cur); cur = []; }
  });
  for (let i = out.length - 1; i > 0; i--) if (out[i].length === 1 && !/[.?!]$/.test(out[i][0].w) && out[i - 1].length < 4 && len([...out[i - 1], ...out[i]]) <= 20) { out[i - 1].push(...out[i]); out.splice(i, 1); }
  const chunks = out.map((ws) => ({ws, s: ws[0].s - 0.05, e: ws[ws.length - 1].e + 0.35}));
  chunks.forEach((c, i) => { if (chunks[i + 1]) c.e = Math.min(c.e + 0.6, chunks[i + 1].s); });
  return (capCache[ch] = chunks);
}
const capText = (w) => w.replace(/\.\.\.$/, '').replace(/[,;:]$/, '').toUpperCase();
/** The burned-in caption at time T: bold Inter 800, cream with a heavy ink outline, the word being spoken in orange.
 *  It pops in (a small scale-up) when a chunk starts. Hidden from `capEnd` (the end card). */
function captions(ch, T) {
  const E = cache[ch] || (cache[ch] = EDITS[ch]());
  if (E.capEnd && T >= E.capEnd) return '';
  const c = capChunks(E.ch).find((k) => T >= k.s && T < k.e); if (!c) return '';
  const pop = 0.88 + 0.12 * ease(clamp01((T - c.s) / 0.12));
  const words = c.ws.map((x) => `<span style="color:${T >= x.s - 0.02 && T < (x.e + 0.08) ? C.orange : C.cream}">${capText(x.w)}</span>`).join(' ');
  const cx = (SAFE_V.x0 + SAFE_V.x1) / 2;
  return `<div style="position:absolute;left:${cx - 420}px;top:${CAP_Y}px;width:840px;text-align:center;transform:scale(${pop.toFixed(3)});transform-origin:50% 50%;
    font-family:Inter;font-weight:800;font-size:92px;line-height:1.04;letter-spacing:1px;-webkit-text-stroke:14px ${C.ink};paint-order:stroke fill;
    text-shadow:0 8px 24px rgba(0,0,0,.65)">${words}</div>`;
}

/* ---------- end card ---------- */
/** The last ~2 s: the desk, the Chunk History mark snapping in (Ep1's brand.js mark), the name, and the pointer to the episode. */
function endCard(T, t0) {
  const u = clamp01((T - t0) / 0.8), back = 1.70158 * 1.3, k = 1 + (back + 1) * Math.pow(u - 1, 3) + back * Math.pow(u - 1, 2);
  return vdesk() + vsvg(chunkMark(470, 640, 300, -110 * (1 - k), fin(T, t0, 0.25))) +
    slideUp(fin(T, t0 + 0.25, 0.4), `<div style="position:absolute;left:0;top:850px;width:940px;text-align:center;font-family:Abril;font-size:104px;line-height:1;color:${C.cream}">Chunk History</div>`) +
    slideUp(fin(T, t0 + 0.5, 0.4), `<div style="position:absolute;left:0;top:1010px;width:940px;display:flex;justify-content:center">${tape('full episode on the channel', {x: 0, y: 0, size: 58, rot: -2, seed: 31}).replace('position:absolute;left:0px;top:0px;', 'position:relative;')}</div>`) +
    op(fin(T, t0 + 0.7, 0.4), mono('the gilded age &middot; episode 1', {x: 0, y: 1150, size: 28, color: C.teal, ls: 5, extra: 'width:940px;text-align:center'}));
}
