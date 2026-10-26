// Helpers for chapters 4, 5 and 6 (Colfax, Tired, The Bank). Nothing here is shared with other chapters.
//   Whooshes    a whoosh three frames before every hard cut after the first
//   Stamps      the stamp sound on each Highlight
//   Between     show children only between two frames
//   PageWin     a torn window onto part of a page, lying on the desk, with children (swipes) in page pixels
//   MapPin      a teal ring and dot on a map (page px, inside a Sheet)
//   Count       a big number counting up, stepped at 12 fps
import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Sfx} from '../kit/common';
import {JF, useGFrame} from '../kit/Kit';
import {TEAL} from '../kit/rc';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Whooshes: React.FC<{at: number[]; volume?: number}> = ({at, volume = 0.2}) => <>{at.map((f) => <Sfx key={f} at={f - 3} src="sfx/whoosh.wav" volume={volume} />)}</>;
export const Stamps: React.FC<{at: number[]; volume?: number}> = ({at, volume = 0.32}) => <>{at.map((f) => <Sfx key={f} at={f} src="sfx/stamp.wav" volume={volume} />)}</>;

export const Between: React.FC<{a?: number; b: number; children: React.ReactNode}> = ({a = -1e7, b, children}) => {
  const f = useCurrentFrame();
  return f >= a && f < b ? <>{children}</> : null;
};

/** A torn window onto part of a page (centred on page px cx, cy at scale s), on the desk, rising in at `at`. */
export const PageWin: React.FC<{src: string; cx: number; cy: number; s: number; w: number; h: number; x: number; y: number; r?: number; at?: number; filter?: string; children?: React.ReactNode}> = ({
  src, cx, cy, s, w, h, x, y, r = 0, at = -1e7, filter = 'grayscale(1) sepia(0.12) contrast(1.25)', children,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = interpolate(f, [at, at + 7], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y + (1 - p) * 20, width: w, height: h, transform: `rotate(${r}deg)`, opacity: Math.min(1, p * 2.5),
      filter: `drop-shadow(0 14px 20px rgba(0,0,0,0.7))${p < 1 ? ` blur(${(1 - p) * 10}px)` : ''}`}}>
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#ddd6c6', clipPath: 'polygon(0 3%, 100% 0, 99% 96%, 1% 100%)'}}>
        <div style={{position: 'absolute', left: w / 2 - cx * s, top: h / 2 - cy * s, transform: `scale(${s})`, transformOrigin: '0 0'}}>
          <Img src={staticFile(src)} style={{display: 'block', filter}} />
          {children}
        </div>
      </div>
    </div>
  );
};

/** A pin on a map: a teal ring drawn round the place and a dot, from `at` (page px; `k` scales it for the camera zoom). */
export const MapPin: React.FC<{x: number; y: number; at: number; k?: number}> = ({x, y, at, k = 1}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 8], [0, 1], clamp);
  const r = 34 * k;
  return (
    <svg width={4 * r} height={4 * r} style={{position: 'absolute', left: x - 2 * r, top: y - 2 * r, overflow: 'visible'}}>
      <circle cx={2 * r} cy={2 * r} r={r} fill="none" stroke={TEAL} strokeWidth={6 * k} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} transform={`rotate(-90 ${2 * r} ${2 * r})`} />
      <circle cx={2 * r} cy={2 * r} r={7 * k * p} fill={TEAL} />
    </svg>
  );
};

/** A big number counting up from 0 between `from` and `to`, stepped; `fmt` sets it. */
export const Count: React.FC<{value: number; from: number; to: number; x: number; y: number; size?: number; color?: string; fmt?: (n: number) => string}> = ({
  value, from, to, x, y, size = 170, color = '#f4efe6', fmt = (n) => Math.round(n).toLocaleString('en-US'),
}) => {
  const g = useGFrame();
  if (g < from) return null;
  const p = interpolate(g, [from, to], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: JF.display, fontSize: size, lineHeight: 1, color, whiteSpace: 'nowrap',
      textShadow: '0 6px 22px rgba(0,0,0,0.8)', opacity: interpolate(g, [from, from + 3], [0, 1], clamp)}}>{fmt(value * p)}</div>
  );
};

/** A small mono caps label on the desk. */
export const Label: React.FC<{text: string; x: number; y: number; at: number; w?: number; align?: 'left' | 'center' | 'right'; color?: string; size?: number}> = ({
  text, x, y, at, w = 600, align = 'left', color = 'rgba(244,239,230,0.8)', size = 28,
}) => {
  const g = useGFrame();
  if (g < at) return null;
  return <div style={{position: 'absolute', left: x, top: y, width: w, textAlign: align, fontFamily: JF.mono, fontSize: size, letterSpacing: 3, color,
    opacity: interpolate(g, [at, at + 5], [0, 1], clamp)}}>{text}</div>;
};
