// Shared pieces for chapters 4 and 5 (builder B): an archival print on the black desk with an optional crop window and coral
// subject, the silhouette figure card (Arnold, Slack, Janin: no reliable photos), a word-synced quote, a drawn cut gem and
// a lamp pool. Print follows Ch01's Print (no cream or white mounts).
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../../lib/anim';
import {JF, Tint, Traced, useGFrame, usePal, type Place} from '../../kit/Kit';
import {hasFile, type TL} from '../../kit/shell';
import type {MaskRef} from '../../kit/maskref';

/**
 * An archival print slapped onto the desk (Ch01's Print), showing the source window `crop` = [sx, sy, sw, sh] (source px,
 * default the whole picture) in a w x h frame. `mask` tints and traces the subject; `tintAt` fades the coral in.
 */
export const Print: React.FC<{src: string; size: [number, number]; x: number; y: number; w: number; h: number; at: number; rot?: number; tag?: string;
  crop?: [number, number, number, number]; mask?: MaskRef; tintAt?: number; traceAt?: number; out?: number; dim?: number; tagW?: number}> = ({
  src, size, x, y, w, h, at, rot = 0, tag, crop, mask, tintAt, traceAt, out = 1e7, dim = 1, tagW,
}) => {
  const g = useGFrame();
  if (g < at || g >= out) return null;
  const k = interpolate(g, [at, at + 4, at + 7], [1.3, 0.96, 1], clamp);
  const [sx, sy, sw, sh] = crop ?? [0, 0, size[0], size[1]];
  const s = Math.max(w / sw, h / sh);
  const place: Place = {left: -sx * s + (w - sw * s) / 2, top: -sy * s + (h - sh * s) / 2, scale: s};
  const tint = mask ? (tintAt === undefined ? 1 : interpolate(g, [tintAt, tintAt + 6], [0, 1], clamp)) : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: '50% 60%'}}>
      <div style={{position: 'relative', width: w, height: h, overflow: 'hidden', background: '#111', boxShadow: '0 26px 46px rgba(0,0,0,0.8)'}}>
        <Img src={staticFile(src)} style={{position: 'absolute', left: place.left, top: place.top, width: size[0] * s, height: size[1] * s,
          filter: `grayscale(1) contrast(1.15) brightness(${0.95 * dim})`}} />
        {mask && tint > 0 && <Tint mask={mask.alpha} place={place} size={size} strength={tint} />}
        {mask && traceAt !== undefined && <Traced paths={mask.data.shapes.subject} place={place} at={traceAt} dur={12} width={5} part={0.94} />}
      </div>
      {tag && <div style={{position: 'absolute', left: 0, top: h + 14, width: tagW ?? w + 60, fontFamily: JF.mono, fontSize: 16, letterSpacing: 1,
        color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>{tag}</div>}
    </div>
  );
};

const SIL: Record<string, [number, number]> = {sil_arnold: [786, 1600], sil_slack: [588, 1600], sil_janin: [618, 1600]};

/**
 * A silhouette figure for a person with no reliable photo: the black cut-out (public/img/props/sil_*.webp) standing in a
 * warm lamp pool with a faint rim, and a mono label ("JOHN SLACK" / "no reliable photo") under the feet. `x, y` = top-left.
 */
export const SilFigure: React.FC<{name: 'sil_arnold' | 'sil_slack' | 'sil_janin'; x: number; y: number; h: number; at: number; label: string;
  from?: 'left' | 'right' | 'bottom' | 'none'; labelAt?: number; flip?: boolean; dim?: number}> = ({name, x, y, h, at, label, from = 'bottom', labelAt, flip, dim = 1}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  if (f < at) return null;
  const [iw, ih] = SIL[name];
  const w = (h * iw) / ih;
  const k = interpolate(f, [at, at + 8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const dx = from === 'left' ? -(1 - k) * 220 : from === 'right' ? (1 - k) * 220 : 0;
  const dy = from === 'bottom' ? (1 - k) * 120 : 0;
  const la = labelAt ?? at + 6;
  const lk = interpolate(g, [la, la + 5], [0, 1], clamp);
  const file = `img/props/${name}.webp`;
  return (
    <div style={{position: 'absolute', left: x + dx, top: y + dy, width: w, height: h, opacity: Math.min(1, k * 1.5) * dim}}>
      <div style={{position: 'absolute', left: -w * 0.7, top: h * 0.02, width: w * 2.4, height: h * 1.05, borderRadius: '50%',
        background: 'radial-gradient(ellipse at 50% 45%, rgba(255,214,160,0.20) 0%, rgba(255,190,120,0.07) 45%, transparent 70%)'}} />
      {hasFile(file) ? (
        <Img src={staticFile(file)} style={{position: 'absolute', left: 0, top: 0, width: w, height: h, transform: flip ? 'scaleX(-1)' : undefined,
          filter: 'drop-shadow(0 0 1.5px rgba(244,239,230,0.55)) drop-shadow(0 0 16px rgba(255,214,160,0.18)) drop-shadow(14px 22px 18px rgba(0,0,0,0.7))'}} />
      ) : (
        <div style={{position: 'absolute', left: w * 0.15, top: 0, width: w * 0.7, height: h, background: '#050505', borderRadius: '40% 40% 8% 8%', border: '2px dashed rgba(244,239,230,0.4)'}} />
      )}
      <div style={{position: 'absolute', left: w / 2, top: h + 16, transform: 'translateX(-50%)', textAlign: 'center', opacity: lk, whiteSpace: 'nowrap',
        fontFamily: JF.mono, textShadow: '0 2px 8px #000'}}>
        <div style={{fontSize: 24, letterSpacing: 3, color: '#f4efe6'}}>{label}</div>
        <div style={{fontSize: 17, letterSpacing: 2, color: 'rgba(244,239,230,0.6)', marginTop: 4}}>NO RELIABLE PHOTO</div>
      </div>
    </div>
  );
};

/**
 * A quote that appears word by word exactly as the narrator speaks `phrase` (Black Sox's SyncQuote, keeps commas). `a` is the
 * scene's start frame, since word times are in narration time. `marks` underlines words (by index) in a colour.
 */
export const SyncQuote: React.FC<{t: TL; a: number; phrase: string; nth?: number; x: number; y: number; w: number; size?: number; color?: string;
  marks?: Record<number, string>}> = ({t, a, phrase, nth = 1, x, y, w, size = 64, color = '#f4efe6', marks = {}}) => {
  const f = useCurrentFrame();
  const i0 = t.idx(phrase, nth);
  const n = phrase.split(/\s+/).length;
  const words = t.words.slice(i0, i0 + n);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, fontFamily: JF.heavy, fontWeight: 900, fontSize: size, lineHeight: 1.3, textShadow: '0 3px 14px #000'}}>
      {words.map((wd, i) => {
        const at = Math.round(wd.s * t.fps) - a - 2;
        const k = interpolate(f, [at, at + 5], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        const u = marks[i];
        const p = u ? interpolate(f, [at + 4, at + 10], [0, 1], clamp) : 0;
        const word = wd.w.replace(/["“”*]/g, '');
        return (
          <span key={i} style={{position: 'relative', display: 'inline-block', paddingRight: '0.28em', color, opacity: k, transform: `translateY(${(1 - k) * 12}px)`}}>
            {(i === 0 ? '“' : '') + word + (i === n - 1 ? '”' : '')}
            {u && p > 0 && <span style={{position: 'absolute', left: -3, bottom: -2, height: 7, borderRadius: 4, background: u, width: `calc(${p} * (100% - 0.2em))`}} />}
          </span>
        );
      })}
    </div>
  );
};

/** A cut and polished brilliant, side view, drawn on in cream/teal lines with twinkling sparkles. Centre (cx, cy), width w. */
export const CutGem: React.FC<{cx: number; cy: number; w: number; at: number}> = ({cx, cy, w, at}) => {
  const g = useGFrame();
  const f = useCurrentFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 10], [0, 1], clamp);
  const r = w / 2;
  const girdle = 0, table = -0.42 * r, culet = 0.95 * r, tw = 0.56 * r;
  const gx = [-1, -0.62, -0.22, 0.22, 0.62, 1].map((k) => k * r);
  const tx = [-tw, -tw / 3, tw / 3, tw];
  const lines: string[] = [
    `M${-r},${girdle} L${-tw},${table} L${tw},${table} L${r},${girdle} Z`,          // crown outline
    `M${-r},${girdle} L0,${culet} L${r},${girdle}`,                                  // pavilion outline
    ...gx.slice(1, -1).map((x) => `M${x},${girdle} L0,${culet}`),                    // pavilion facets
    `M${-r},${girdle} L${tx[1]},${table} M${gx[2]},${girdle} L${tx[1]},${table} M${gx[2]},${girdle} L${tx[2]},${table} M${gx[3]},${girdle} L${tx[2]},${table} M${gx[3]},${girdle} L${tx[3]},${table} M${gx[1]},${girdle} L${tx[0]},${table} M${gx[4]},${girdle} L${tx[3]},${table}`,
  ];
  const stars = [[-0.3, -0.62, 1.0], [0.55, -0.2, 0.8], [0.05, 0.35, 0.6], [-0.7, 0.05, 0.55]];
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <defs>
        <linearGradient id="gemfill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(244,239,230,0.30)" />
          <stop offset="0.5" stopColor="rgba(47,224,196,0.10)" />
          <stop offset="1" stopColor="rgba(244,239,230,0.22)" />
        </linearGradient>
      </defs>
      <g transform={`translate(${cx} ${cy})`}>
        <ellipse cx={0} cy={culet * 0.4} rx={r * 1.5} ry={r * 1.2} fill="rgba(244,239,230,0.035)" />
        <path d={`M${-r},${girdle} L${-tw},${table} L${tw},${table} L${r},${girdle} L0,${culet} Z`} fill="url(#gemfill)" opacity={p} />
        {lines.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={i < 2 ? '#f4efe6' : 'rgba(47,224,196,0.9)'} strokeWidth={i < 2 ? 4 : 2.4} strokeLinejoin="round"
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        ))}
        {p >= 1 && stars.map(([sx, sy, s], i) => {
          const tw2 = 0.5 + 0.5 * Math.sin((f - at) / 6 + i * 1.9);
          const L = r * 0.32 * s * (0.6 + 0.6 * tw2);
          return (
            <g key={i} transform={`translate(${sx * r} ${sy * r}) rotate(${random(`gs${i}`) * 20})`} opacity={0.5 + 0.5 * tw2}>
              <path d={`M0,${-L} Q0,0 ${L * 0.28},0 Q0,0 0,${L} Q0,0 ${-L * 0.28},0 Q0,0 0,${-L} Z`} fill="#fffaf0" />
              <path d={`M${-L * 0.7},0 Q0,0 0,${L * 0.2} Q0,0 ${L * 0.7},0 Q0,0 0,${-L * 0.2} Q0,0 ${-L * 0.7},0 Z`} fill="#fffaf0" />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

/** A warm lamp pool on the desk, centred at (x, y). */
export const Lamp: React.FC<{x: number; y: number; r?: number; a?: number}> = ({x, y, r = 640, a = 0.1}) => (
  <AbsoluteFill style={{background: `radial-gradient(circle ${r}px at ${x}px ${y}px, rgba(255,214,160,${a}) 0%, transparent 100%)`}} />
);

/** A light flare that blooms behind something held up "to the light". */
export const Flare: React.FC<{x: number; y: number; at: number; r?: number}> = ({x, y, at, r = 420}) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at, at + 14], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const pulse = 1 + 0.04 * Math.sin(f / 9);
  return (
    <AbsoluteFill style={{opacity: k, mixBlendMode: 'screen'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle ${r * pulse}px at ${x}px ${y}px, rgba(255,240,215,0.55) 0%, rgba(255,214,160,0.18) 35%, transparent 70%)`}} />
    </AbsoluteFill>
  );
};

/** A label in mono caps, centred on x. */
export const Mono: React.FC<{text: string; x: number; y: number; at: number; size?: number; color?: string}> = ({text, x, y, at, size = 24, color = '#f4efe6'}) => {
  const g = useGFrame();
  if (g < at) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: 'translateX(-50%)', fontFamily: JF.mono, fontSize: size, letterSpacing: 3, color, whiteSpace: 'nowrap',
    textShadow: '0 2px 10px #000', opacity: interpolate(g, [at, at + 5], [0, 1], clamp)}}>{text}</div>;
};

export const usePalSubject = () => usePal().subject;

/**
 * Copy of fx/ColdOpenDepth's MoneyTag (big today's figure, small 1872 figure) with `whiteSpace: nowrap`: the original's
 * absolute box shrinks to the room left of `x`, so "$4 million" broke onto two lines anywhere right of centre. `size` scales it.
 */
export const MoneyTag: React.FC<{at: number; big: string; small: string; x: number; y: number; size?: number}> = ({at, big, small, x, y, size = 150}) => {
  const f = useCurrentFrame();
  const g = Math.floor(f / 2.5) * 2.5;
  if (g < at) return null;
  const s = interpolate(g, [at, at + 5, at + 9], [1.35, 0.95, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translateX(-50%) scale(${s})`, textAlign: 'center', transformOrigin: '50% 60%', whiteSpace: 'nowrap'}}>
      <div style={{fontFamily: JF.display, fontSize: size, lineHeight: 1, color: '#FF9F1C', textShadow: '0 6px 24px rgba(0,0,0,0.85)'}}>{big}</div>
      <div style={{fontFamily: JF.mono, fontSize: size * 0.227, color: '#F4EFE6', opacity: 0.85, marginTop: 10, textShadow: '0 2px 10px rgba(0,0,0,0.9)'}}>{small}</div>
    </div>
  );
};
