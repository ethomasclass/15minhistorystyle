// Small pieces shared by builder D's chapters (ch08 The Dominoes, ch09 Where the Money Went).
//   Print       an archival print on the black desk (Ch01's, no cream mount), optional coral tint + teal trace via a mask
//   SilFigure   a black cut-paper silhouette (no reliable photo) on a lamp pool, with its mono label
//   SyncQuote   a primary-source quote that appears word by word as the narrator says it
//   Lamp        a warm lamp pool on the desk
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../../lib/anim';
import {JF, Tint, Traced, useGFrame, usePal} from '../../kit/Kit';
import type {MaskRef} from '../../kit/maskref';
import type {TL} from '../../kit/shell';

/** An archival print on the black desk, slapped down with a little overshoot. With `mask` the whole image is shown
 *  (no crop, height from `size`) and its subject is tinted (coral, or the palette's subject) and traced. */
export const Print: React.FC<{src: string; x: number; y: number; w: number; h?: number; size?: [number, number]; at: number; rot: number; pos?: string; tag: string;
  mask?: MaskRef; tint?: boolean; traceAt?: number; out?: number; tagW?: number}> = ({src, x, y, w, h, size, at, rot, pos = '50% 25%', tag, mask, tint = true, traceAt, out = 1e7, tagW}) => {
  const g = useGFrame();
  if (g < at || g >= out) return null;
  const k = interpolate(g, [at, at + 4, at + 7], [1.3, 0.96, 1], clamp);
  const full = mask && size;
  const hh = full ? (w * size[1]) / size[0] : h ?? w;
  const place = full ? {left: 0, top: 0, scale: w / size[0]} : null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: '50% 60%'}}>
      <div style={{position: 'relative', width: w, height: hh, boxShadow: '0 26px 46px rgba(0,0,0,0.8)'}}>
        <Img src={staticFile(src)} style={{width: w, height: hh, objectFit: 'cover', objectPosition: pos, display: 'block',
          filter: 'grayscale(1) contrast(1.15) brightness(0.95)'}} />
        {full && place && tint && <Tint mask={mask.alpha} place={place} size={size} strength={0.85} />}
        {full && place && <Traced paths={mask.data.shapes.subject} place={place} at={traceAt ?? at + 6} dur={12} width={5} />}
      </div>
      <div style={{position: 'absolute', left: 0, top: hh + 14, width: tagW ?? w + 60, fontFamily: JF.mono, fontSize: 16, letterSpacing: 1,
        color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>{tag}</div>
    </div>
  );
};

/** A warm lamp pool on the desk at (x, y). */
export const Lamp: React.FC<{x: number; y: number; r?: number; a?: number}> = ({x, y, r = 520, a = 0.22}) => (
  <AbsoluteFill style={{background: `radial-gradient(circle ${r}px at ${x}px ${y}px, rgba(255,214,160,${a}) 0%, rgba(255,200,140,${a * 0.35}) 55%, transparent 100%)`}} />
);

const SIL: Record<string, {size: [number, number]; label: string}> = {
  sil_arnold: {size: [786, 1600], label: 'Philip Arnold · no reliable photo'},
  sil_slack: {size: [588, 1600], label: 'John Slack · no reliable photo'},
  sil_janin: {size: [618, 1600], label: 'Henry Janin · no reliable photo'},
};

/** A black cut-paper silhouette figure standing in a lamp pool, with its mono label underneath. `h` = height on screen. */
export const SilFigure: React.FC<{name: 'sil_arnold' | 'sil_slack' | 'sil_janin'; x: number; y: number; h: number; at: number; out?: number; flip?: boolean;
  label?: boolean; labelX?: number; labelDy?: number; dx?: number}> = ({name, x, y, h, at, out = 1e7, flip = false, label = true, labelX = 0, labelDy = 0, dx = 0}) => {
  const g = useGFrame();
  if (g < at || g >= out) return null;
  const {size, label: text} = SIL[name];
  const w = (h * size[0]) / size[1];
  const k = interpolate(g, [at, at + 6], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  return (
    <>
      <div style={{position: 'absolute', left: x + w / 2 - h * 0.55, top: y - h * 0.05, width: h * 1.1, height: h * 1.1, borderRadius: '50%', opacity: k,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(255,222,178,0.34) 0%, rgba(255,205,150,0.14) 45%, transparent 70%)'}} />
      <Img src={staticFile(`img/props/${name}.webp`)} style={{position: 'absolute', left: x + dx, top: y + (1 - k) * 60, width: w, height: h, opacity: Math.min(1, k * 1.6),
        transform: flip ? 'scaleX(-1)' : undefined,
        filter: 'drop-shadow(0 0 1.5px rgba(237,231,220,0.75)) drop-shadow(0 0 14px rgba(255,214,160,0.35)) drop-shadow(0 24px 22px rgba(0,0,0,0.7))'}} />
      {label && <div style={{position: 'absolute', left: x + labelX, top: y + h + 18 + labelDy, fontFamily: JF.mono, fontSize: 18, letterSpacing: 1.5, whiteSpace: 'nowrap',
        color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.9)', opacity: k}}>{text}</div>}
    </>
  );
};

/** A quote that appears word by word exactly as the narrator speaks `phrase` (the words as written in the script). */
export const SyncQuote: React.FC<{t: TL; phrase: string; nth?: number; x: number; y: number; w: number; size?: number; a?: number; who?: string; whoAt?: number;
  hot?: number[]}> = ({t, phrase, nth = 1, x, y, w, size = 64, a = 0, who, whoAt, hot = []}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  const i0 = t.idx(phrase, nth);
  const n = phrase.split(/\s+/).length;
  const words = t.words.slice(i0, i0 + n);
  const first = Math.round(words[0].s * 30) - a - 2;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w}}>
      <div style={{fontFamily: JF.heavy, fontWeight: 900, fontSize: size, lineHeight: 1.28, textShadow: '0 3px 14px #000'}}>
        {words.map((wd, i) => {
          const at = Math.round(wd.s * 30) - a - 2;
          const k = interpolate(f, [at, at + 5], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
          const word = wd.w.replace(/["“”]/g, '');
          return (
            <span key={i} style={{display: 'inline-block', paddingRight: '0.26em', color: hot.includes(i) ? pal.subject : '#f4efe6', opacity: k,
              transform: `translateY(${(1 - k) * 12}px)`}}>
              {(i === 0 ? '“' : '') + word + (i === n - 1 ? '”' : '')}
            </span>
          );
        })}
      </div>
      {who && <div style={{marginTop: 26, fontFamily: JF.mono, fontSize: 22, letterSpacing: 2, color: 'rgba(244,239,230,0.8)', textTransform: 'uppercase',
        opacity: interpolate(f, [whoAt ?? first + 10, (whoAt ?? first + 10) + 8], [0, 1], clamp)}}>{who}</div>}
    </div>
  );
};

/** Frames (in the scene's time) at which each word of a phrase starts. */
export const wordFrames = (t: TL, phrase: string, a: number, nth = 1) => {
  const i0 = t.idx(phrase, nth), n = phrase.split(/\s+/).length;
  return t.words.slice(i0, i0 + n).map((w) => Math.round(w.s * 30) - a);
};

/** An orange hand-drawn strike-through from (x1, y1) to (x2, y2), drawn over 5 frames (for a myth). */
export const Strike: React.FC<{x1: number; y1: number; x2: number; y2: number; at: number}> = ({x1, y1, x2, y2, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 5], [0, 1], clamp);
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - 10;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} fill="none" stroke="#FF9F1C" strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};
