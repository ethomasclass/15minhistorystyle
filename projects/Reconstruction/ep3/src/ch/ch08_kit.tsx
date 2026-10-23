// Helpers for chapters 8 and 9 (Ch09 imports them too). Nothing here is shared with other chapters.
//   wob / roughRect / Ink   hand-drawn teal lines drawing on, stepping at 12 fps
//   Held                    the coral highlighter already on the lines (a swipe seen in an earlier shot)
//   Pop                     text that pops in at a frame
//   Between                 children only between two frames
//   Whooshes / Stamps       a whoosh before each cut, a stamp under each title
import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {Sfx} from '../kit/common';
import {useGFrame} from '../kit/Kit';
import {type Box, CORAL, TEAL} from '../kit/rc';

export const CREAM = '#f4efe6';
export const HAND = '"Nanum Pen Script", cursive';

/** A hand-drawn straight line as a slightly wobbly polyline (path d). */
export const wob = (x1: number, y1: number, x2: number, y2: number, seed: string, amp = 3, n = 8) => {
  const pts: string[] = [];
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const j = i === 0 || i === n ? 0 : (random(`${seed}${i}`) - 0.5) * 2 * amp;
    pts.push(`${(x1 + (x2 - x1) * t + nx * j).toFixed(1)},${(y1 + (y2 - y1) * t + ny * j).toFixed(1)}`);
  }
  return `M${pts.join(' L')}`;
};

/** A rough rectangle path (four wobbly sides, corners overshooting a little). */
export const roughRect = (x: number, y: number, w: number, h: number, seed: string, amp = 3) =>
  [wob(x - 4, y, x + w + 3, y + 1, `${seed}a`, amp), wob(x + w, y - 3, x + w + 1, y + h + 4, `${seed}b`, amp),
    wob(x + w + 4, y + h, x - 3, y + h - 1, `${seed}c`, amp), wob(x, y + h + 3, x + 1, y - 4, `${seed}d`, amp)].join(' ');

/** A path drawing on from `at` over `dur` frames (stepped). Use inside an <svg>. */
export const Ink: React.FC<{d: string; at: number; dur?: number; color?: string; width?: number; dash?: string; opacity?: number}> = ({
  d, at, dur = 8, color = TEAL, width = 5, dash, opacity = 1,
}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  return dash
    ? <path d={d} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dash} strokeLinecap="round" opacity={opacity * p} />
    : <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={opacity} />;
};

/** The coral highlighter already laid on lines (page px). */
export const Held: React.FC<{lines: Box[]; seed?: string}> = ({lines, seed = 'held'}) => (
  <>
    {lines.map(([x, y, w, h], i) => {
      const pts: string[] = [];
      for (let k = 0; k <= 30; k++) pts.push(`${(k / 30) * 100}% ${random(`${seed}t${i}${k}`) * 14}%`);
      for (let k = 30; k >= 0; k--) pts.push(`${(k / 30) * 100}% ${100 - random(`${seed}b${i}${k}`) * 14}%`);
      return <div key={i} style={{position: 'absolute', left: x - h * 0.15, top: y - h * 0.08, width: w + h * 0.3, height: h * 1.16, background: CORAL, opacity: 0.8,
        mixBlendMode: 'multiply', clipPath: `polygon(${pts.join(',')})`}} />;
    })}
  </>
);

/** Text that pops in at `at` (absolute; centred on x when `center`). */
export const Pop: React.FC<{at: number; x: number; y: number; center?: boolean; out?: number; style: React.CSSProperties; children: React.ReactNode}> = ({at, x, y, center, out = 1e7, style, children}) => {
  const f = useCurrentFrame();
  if (f < at || f >= out) return null;
  const k = interpolate(f, [at, at + 3, at + 6], [1.2, 0.97, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, whiteSpace: 'nowrap', opacity: interpolate(f, [at, at + 2], [0, 1], clamp),
      transform: `${center ? 'translateX(-50%) ' : ''}scale(${k})`, transformOrigin: center ? '0 50%' : 'left center', ...style}}>{children}</div>
  );
};

/** Children only between frames a and b. */
export const Between: React.FC<{a?: number; b: number; children: React.ReactNode}> = ({a = -1e7, b, children}) => {
  const f = useCurrentFrame();
  return f >= a && f < b ? <>{children}</> : null;
};

/** A whoosh just before every hard cut after the first. */
export const Whooshes: React.FC<{at: number[]; volume?: number}> = ({at, volume = 0.22}) => <>{at.map((f) => <Sfx key={f} at={f - 3} src="sfx/whoosh.wav" volume={volume} />)}</>;
/** A stamp sound under each title. */
export const Stamps: React.FC<{at: number[]}> = ({at}) => <>{at.map((f) => <Sfx key={f} at={f} src="sfx/stamp.wav" volume={0.33} />)}</>;
