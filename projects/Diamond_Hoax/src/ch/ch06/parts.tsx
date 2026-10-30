// Small pieces shared by Ch06 and Ch07 (builder C). Copies of shared kit pieces live here, changed, so src/kit stays untouched:
//   Print     Ch01's archival print on the black desk (no mount), plus an optional crop window and a coral subject mask
//   Lamp      a warm pool of light on the desk (silhouette figures need a lit patch to read)
//   Figure    a silhouette figure (public/img/props/sil_<who>.webp) on a lamp pool with its mono label
//   Money     fx/ColdOpenDepth's MoneyTag with a size (two tags side by side need to be smaller)
//   Strike    a hand-drawn strike-through line
//   WordQuote a quote that appears word by word on the narration's own word timings (Black Sox's SyncQuote)
import React from 'react';
import {Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../../lib/anim';
import {JF, Tint, Traced, useGFrame, usePal} from '../../kit/Kit';
import type {MaskRef} from '../../kit/maskref';
import type {TL} from '../../kit/shell';

const ORANGE = '#FF9F1C';

/**
 * An archival print slapped onto the desk (Ch01's Print). `h` is the window height; `pos` the object-position of the crop.
 * With `mask` + `src` size, the subject is tinted coral and traced in teal (the crop is computed as object-fit: cover).
 */
export const Print: React.FC<{src: string; x: number; y: number; w: number; h: number; at: number; rot: number; pos?: string; tag: string; tagW?: number;
  size?: [number, number]; fx?: number; fy?: number; mask?: MaskRef; traceAt?: number; out?: number}> = ({
  src, x, y, w, h, at, rot, pos = '50% 25%', tag, tagW, size, fx = 0.5, fy = 0.25, mask, traceAt, out = 1e7,
}) => {
  const g = useGFrame();
  if (g < at || g >= out) return null;
  const k = interpolate(g, [at, at + 4, at + 7], [1.3, 0.96, 1], clamp);
  const bw = 'grayscale(1) contrast(1.15) brightness(0.95)';
  let inner: React.ReactNode;
  if (size) {
    // explicit cover crop so a mask lines up with the picture
    const sc = Math.max(w / size[0], h / size[1]);
    const place = {left: (w - size[0] * sc) * fx, top: (h - size[1] * sc) * fy, scale: sc};
    inner = (
      <div style={{position: 'relative', width: w, height: h, overflow: 'hidden', boxShadow: '0 26px 46px rgba(0,0,0,0.8)'}}>
        <Img src={staticFile(src)} style={{position: 'absolute', left: place.left, top: place.top, width: size[0] * sc, height: size[1] * sc, filter: bw}} />
        {mask && <Tint mask={mask.alpha} place={place} size={size} />}
        {mask && <Traced paths={mask.data.shapes.subject} place={place} at={traceAt ?? at + 4} dur={12} width={4} />}
      </div>
    );
  } else {
    inner = <Img src={staticFile(src)} style={{width: w, height: h, objectFit: 'cover', objectPosition: pos, display: 'block', filter: bw, boxShadow: '0 26px 46px rgba(0,0,0,0.8)'}} />;
  }
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: '50% 60%'}}>
      {inner}
      <div style={{position: 'absolute', left: 0, top: h + 14, width: tagW ?? w + 60, fontFamily: JF.mono, fontSize: 16, letterSpacing: 1,
        color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>{tag}</div>
    </div>
  );
};

/** A warm lamp pool on the desk, centred at (x, y). */
export const Lamp: React.FC<{x: number; y: number; rx?: number; ry?: number; a?: number}> = ({x, y, rx = 620, ry = 460, a = 0.16}) => (
  <div style={{position: 'absolute', left: x - rx, top: y - ry, width: rx * 2, height: ry * 2, borderRadius: '50%',
    background: `radial-gradient(ellipse at center, rgba(255,214,160,${a}) 0%, rgba(255,214,160,${a * 0.45}) 45%, transparent 72%)`}} />
);

const SIL: Record<string, {file: string; w: number; h: number; label: string}> = {
  arnold: {file: 'sil_arnold', w: 786, h: 1600, label: 'PHILIP ARNOLD · NO RELIABLE PHOTO'},
  slack: {file: 'sil_slack', w: 588, h: 1600, label: 'JOHN SLACK · NO RELIABLE PHOTO'},
  janin: {file: 'sil_janin', w: 618, h: 1600, label: 'HENRY JANIN · NO RELIABLE PHOTO'},
};

/**
 * A silhouette figure standing on a pale lamp pool. (x, y) = the point between the feet; `h` = height on screen.
 * `dx` slides it sideways (px), `fade` 0..1 multiplies its opacity; `label` false hides the caption (or pass a short one).
 */
export const Figure: React.FC<{who: 'arnold' | 'slack' | 'janin'; x: number; y: number; h: number; at: number; dx?: number; fade?: number; label?: string | false;
  glow?: number; labelSize?: number}> = ({who, x, y, h, at, dx = 0, fade = 1, label, glow = 1, labelSize = 18}) => {
  const g = useGFrame();
  if (g < at || fade <= 0.001) return null;
  const s = SIL[who];
  const w = (h * s.w) / s.h;
  const k = interpolate(g, [at, at + 6], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const text = label === undefined ? s.label : label;
  return (
    <div style={{position: 'absolute', left: x + dx - w / 2, top: y - h, width: w, height: h, opacity: Math.min(1, k * 1.5) * fade}}>
      {/* the pale backing: an oval of lamp light behind the figure so the black reads on the dark desk */}
      <div style={{position: 'absolute', left: w / 2 - h * 0.55, top: h * 0.02, width: h * 1.1, height: h * 1.02, borderRadius: '50%',
        background: `radial-gradient(ellipse at 50% 45%, rgba(236,220,190,${0.26 * glow}) 0%, rgba(236,220,190,${0.1 * glow}) 45%, transparent 70%)`}} />
      <Img src={staticFile(`img/props/${s.file}.webp`)} style={{position: 'absolute', left: 0, top: (1 - k) * 30, width: w, height: h, filter: 'drop-shadow(0 18px 22px rgba(0,0,0,0.7))'}} />
      {text && <div style={{position: 'absolute', left: w / 2, top: h + 16, transform: 'translateX(-50%)', fontFamily: JF.mono, fontSize: labelSize, letterSpacing: 2,
        color: 'rgba(244,239,230,0.85)', whiteSpace: 'nowrap', textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>{text}</div>}
    </div>
  );
};

/** fx/ColdOpenDepth's MoneyTag (big today's figure in Abril, the 1872 figure small in mono) with a size. Centred on x. */
export const Money: React.FC<{at: number; big: string; small: string; x: number; y: number; size?: number; out?: number; plate?: boolean}> = ({at, big, small, x, y, size = 150, out = 1e7, plate = false}) => {
  const g = useGFrame();
  if (g < at || g >= out) return null;
  const s = interpolate(g, [at, at + 5, at + 9], [1.35, 0.95, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translateX(-50%) scale(${s}) rotate(${plate ? -2 : 0}deg)`, textAlign: 'center', transformOrigin: '50% 60%',
      ...(plate ? {background: 'rgba(16,15,12,0.92)', padding: `${size * 0.14}px ${size * 0.3}px ${size * 0.16}px`, boxShadow: '0 14px 30px rgba(0,0,0,0.6)'} : {})}}>
      <div style={{fontFamily: JF.display, fontSize: size, lineHeight: 1, color: ORANGE, whiteSpace: 'nowrap', textShadow: '0 6px 24px rgba(0,0,0,0.85)'}}>{big}</div>
      <div style={{fontFamily: JF.mono, fontSize: Math.max(24, size * 0.23), color: '#F4EFE6', opacity: 0.85, marginTop: 10, whiteSpace: 'nowrap', textShadow: '0 2px 10px rgba(0,0,0,0.9)'}}>{small}</div>
    </div>
  );
};

/** A hand-drawn strike line, drawn on over `dur` frames. */
export const Strike: React.FC<{x1: number; y1: number; x2: number; y2: number; at: number; dur?: number; color?: string; width?: number}> = ({x1, y1, x2, y2, at, dur = 5, color = ORANGE, width = 8}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <path d={`M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 - 10} ${x2},${y2}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/**
 * A quote that appears word by word as it is spoken (Black Sox's SyncQuote). `a` = the scene's start frame (the parent
 * Sequence offset), so word times are shifted into the scene's time. `marks` underlines word i in a colour.
 */
export const WordQuote: React.FC<{t: TL; a: number; phrase: string; nth?: number; x: number; y: number; w: number; size?: number; marks?: Record<number, string>}> = ({
  t, a, phrase, nth = 1, x, y, w, size = 86, marks = {},
}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  const i0 = t.idx(phrase, nth);
  const n = phrase.split(/\s+/).length;
  const words = t.words.slice(i0, i0 + n);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, fontFamily: JF.heavy, fontWeight: 900, fontSize: size, lineHeight: 1.25, color: '#f4efe6', textShadow: '0 3px 14px #000'}}>
      {words.map((wd, i) => {
        const at = Math.round(wd.s * t.fps) - a - 2;
        const k = interpolate(f, [at, at + 5], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        const u = marks[i];
        const p = u ? interpolate(f, [at + 4, at + 10], [0, 1], clamp) : 0;
        const word = wd.w.replace(/["“”]/g, '');
        return (
          <span key={i} style={{position: 'relative', display: 'inline-block', paddingRight: '0.26em', opacity: k, transform: `translateY(${(1 - k) * 12}px)`}}>
            {(i === 0 ? '“' : '') + word + (i === n - 1 ? '”' : '')}
            {u && p > 0 && <span style={{position: 'absolute', left: -3, bottom: 2, height: 8, borderRadius: 4, background: u === 'mark' ? pal.mark : u, width: `calc(${p} * (100% - 0.2em))`}} />}
          </span>
        );
      })}
    </div>
  );
};

/** The kit's source Tag on a dark chip, for when the picture under it is pale (a newspaper close-up, a map). */
export const DarkTag: React.FC<{text: string; x?: number; y?: number}> = ({text, x = 34, y = 1022}) => (
  <div style={{position: 'absolute', left: x, top: y, background: 'rgba(10,9,7,0.85)', padding: '3px 10px', fontFamily: JF.mono, fontSize: 18, letterSpacing: 1,
    color: 'rgba(255,255,255,0.88)', textTransform: 'uppercase', whiteSpace: 'nowrap'}}>{text}</div>
);
