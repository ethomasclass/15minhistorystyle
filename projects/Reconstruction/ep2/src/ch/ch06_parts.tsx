// Pieces for ch06 (Bottom Rail on Top) and ch07 (Carpetbaggers and Scalawags): a torn window with page-px children, a
// creased print laid on the desk, a teal line-drawn index card, and the drawn diagrams (the officeholder count, the
// seats in Congress, the rail fence).
import React from 'react';
import {Easing, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {JF, useGFrame} from '../kit/Kit';
import {CORAL, DOC_F, TEAL} from '../kit/rc';

export const CREAM = '#f4efe6';

/** A torn window onto part of a page (centred on page px cx, cy at scale s) that pops onto the desk at `at`; children in page px. */
export const WinS: React.FC<{src: string; cx: number; cy: number; s: number; w: number; h: number; x: number; y: number; r?: number; at: number; filter?: string; children?: React.ReactNode}> = ({
  src, cx, cy, s, w, h, x, y, r = 0, at, filter = DOC_F, children,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 3, at + 6], [1.15, 0.98, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${r}deg) scale(${k})`, opacity: interpolate(f, [at, at + 2], [0, 1], clamp),
      filter: 'drop-shadow(0 14px 20px rgba(0,0,0,0.7))'}}>
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#ddd6c6', clipPath: 'polygon(0 2%, 100% 0, 99% 97%, 1% 100%)'}}>
        <div style={{position: 'absolute', left: w / 2 - cx * s, top: h / 2 - cy * s, transform: `scale(${s})`, transformOrigin: '0 0'}}>
          <Img src={staticFile(src)} style={{display: 'block', filter}} />
          {children}
        </div>
      </div>
    </div>
  );
};

/** A creased print (alpha PNG) dropped onto the desk, centred on (x, y), `w` wide. */
export const Print: React.FC<{src: string; size: [number, number]; x: number; y: number; w: number; rot?: number; at: number; dx?: number; filter?: string}> = ({
  src, size, x, y, w, rot = 0, at, dx = 0, filter = 'grayscale(1) contrast(1.08)',
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const h = (size[1] * w) / size[0];
  const p = Easing.out(Easing.cubic)(interpolate(f, [at, at + 8], [0, 1], clamp));
  return (
    <Img src={staticFile(src)} style={{position: 'absolute', left: x - w / 2 + dx, top: y - h / 2 + (1 - p) * 24, width: w, height: h, opacity: Math.min(1, p * 2.5),
      transform: `rotate(${rot}deg) scale(${1.04 - 0.04 * p})`, filter: `${filter} drop-shadow(0 18px 26px rgba(0,0,0,0.7))${p < 1 ? ` blur(${(1 - p) * 16}px)` : ''}`}} />
  );
};

/** A wobbly hand-drawn line between two points, drawn on over `dur` (stepped). */
export const Stroke: React.FC<{x1: number; y1: number; x2: number; y2: number; at: number; dur?: number; color?: string; width?: number; seed?: string; opacity?: number}> = ({
  x1, y1, x2, y2, at, dur = 8, color = TEAL, width = 7, seed = 'st', opacity = 1,
}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  const n = 14;
  const len = Math.hypot(x2 - x1, y2 - y1);
  const nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
  const d = Array.from({length: n + 1}, (_, i) => {
    const t = i / n, j = (random(`${seed}${i}`) - 0.5) * 6;
    return `${i ? 'L' : 'M'}${(x1 + (x2 - x1) * t + nx * j).toFixed(1)},${(y1 + (y2 - y1) * t + ny * j).toFixed(1)}`;
  }).join(' ');
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={opacity} />;
};

/** A teal line-drawn index card with a hand-lettered label (and an optional small mono line under it). */
export const LineCard: React.FC<{x: number; y: number; w: number; h: number; at: number; label: string; sub?: string; color?: string; size?: number; dim?: number; rot?: number}> = ({
  x, y, w, h, at, label, sub, color = TEAL, size = 58, dim = 1, rot = 0,
}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [1.2, 0.97, 1], clamp);
  const draw = interpolate(g, [at, at + 6], [0, 1], clamp);
  const txt = interpolate(g, [at + 3, at + 10], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg) scale(${k})`, opacity: dim}}>
      <svg width={w} height={h} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <rect x={4} y={4} width={w - 8} height={h - 8} rx={10} fill="rgba(16,15,12,0.55)" stroke={color} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        <line x1={24} y1={h * 0.3} x2={w - 24} y2={h * 0.3} stroke={color} strokeWidth={2} opacity={0.5 * draw} />
      </svg>
      <div style={{position: 'absolute', left: 0, width: w, top: h * 0.36, textAlign: 'center', fontFamily: '"Nanum Pen Script", cursive', fontSize: size, lineHeight: 1, color: CREAM,
        whiteSpace: 'nowrap', clipPath: `inset(-20% ${(1 - txt) * 100}% -20% -5%)`}}>{label}</div>
      {sub && <div style={{position: 'absolute', left: 0, width: w, top: h * 0.36 + size * 1.05, textAlign: 'center', fontFamily: JF.mono, fontSize: 22, letterSpacing: 1, color: 'rgba(244,239,230,0.7)',
        whiteSpace: 'nowrap', opacity: txt}}>{sub}</div>}
    </div>
  );
};

/** A hand-drawn cross over a box (screen px). */
export const Cross: React.FC<{x: number; y: number; w: number; h: number; at: number; color?: string; width?: number}> = ({x, y, w, h, at, color = CORAL, width = 10}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <Stroke x1={x} y1={y} x2={x + w} y2={y + h} at={at} dur={4} color={color} width={width} seed="xa" />
    <Stroke x1={x + w} y1={y} x2={x} y2={y + h} at={at + 4} dur={4} color={color} width={width} seed="xb" />
  </svg>
);

/** The officeholder count: `n` small teal ticks in a grid that fill from `from` to `to`. */
export const Ticks: React.FC<{x: number; y: number; cols: number; rows: number; cw: number; ch: number; from: number; to: number}> = ({x, y, cols, rows, cw, ch, from, to}) => {
  const g = useGFrame();
  const total = cols * rows;
  const n = Math.round(interpolate(g, [from, to], [0, total], {...clamp, easing: Easing.inOut(Easing.quad)}));
  if (n <= 0) return null;
  let d = '';
  for (let i = 0; i < n; i++) {
    const c = i % cols, r = Math.floor(i / cols);
    const jx = (random(`tk${i}`) - 0.5) * 3, tilt = (random(`tl${i}`) - 0.5) * 4;
    d += `M${(x + c * cw + jx).toFixed(1)},${(y + r * ch).toFixed(1)} l${tilt.toFixed(1)},${(ch * 0.62).toFixed(1)} `;
  }
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <path d={d} stroke={TEAL} strokeWidth={3} strokeLinecap="round" fill="none" />
    </svg>
  );
};

/** Seats in a hemicycle: the outer row of `outer`, the inner row of the rest. Seat i (left to right, outer row first)
 *  appears at at[i]; `coral` seats fill coral from `coralAt`. */
export const Seats: React.FC<{cx: number; cy: number; r1: number; r2: number; outer: number; inner: number; at: (i: number) => number; coral: number[]; coralAt: number; r?: number}> = ({
  cx, cy, r1, r2, outer, inner, at, coral, coralAt, r = 30,
}) => {
  const g = useGFrame();
  const seats: [number, number][] = [];
  for (let i = 0; i < outer; i++) { const a = Math.PI - (Math.PI * i) / (outer - 1); seats.push([cx + Math.cos(a) * r1, cy - Math.sin(a) * r1]); }
  for (let i = 0; i < inner; i++) { const a = Math.PI - (Math.PI * (i + 0.5)) / inner; seats.push([cx + Math.cos(a) * r2, cy - Math.sin(a) * r2]); }
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {seats.map(([sx, sy], i) => {
        const a = at(i);
        if (g < a) return null;
        const k = interpolate(g, [a, a + 3, a + 6], [0.3, 1.2, 1], clamp);
        const isC = coral.includes(i) && g >= coralAt;
        const kc = isC ? interpolate(g, [coralAt, coralAt + 3, coralAt + 6], [1, 1.35, 1.12], clamp) : 1;
        return (
          <g key={i} transform={`translate(${sx} ${sy}) scale(${k * kc})`}>
            <path d={`M ${-r} ${r * 0.55} L ${-r} ${-r * 0.2} Q 0 ${-r * 1.25} ${r} ${-r * 0.2} L ${r} ${r * 0.55} Z`} fill={isC ? CORAL : 'rgba(47,224,196,0.14)'} stroke={isC ? CORAL : TEAL} strokeWidth={5} strokeLinejoin="round" />
          </g>
        );
      })}
    </svg>
  );
};
