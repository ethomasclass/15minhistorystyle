// Small pieces for chapters 2 and 3 (Ch03 imports them too). Nothing here is shared with other chapters.
//   Whooshes / Stamps   a whoosh three frames before each cut; a stamp sound on each title
//   Between             show children only between two frames
//   Print               a creased print lying on the desk (no tint), popping on at `at`
//   Cross               a coral hand-drawn ✕, drawn on over 6 frames
//   PageWin / Ink       a torn window onto part of a page, with the coral highlighter already on its lines
import React from 'react';
import {Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {Sfx} from '../kit/common';
import {useGFrame} from '../kit/Kit';
import {type Box, CORAL} from '../kit/rc';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Whooshes: React.FC<{at: number[]; volume?: number}> = ({at, volume = 0.22}) => <>{at.map((f) => <Sfx key={f} at={f - 3} src="sfx/whoosh.wav" volume={volume} />)}</>;
export const Stamps: React.FC<{at: number[]}> = ({at}) => <>{at.map((f) => <Sfx key={f} at={f} src="sfx/stamp.wav" volume={0.32} />)}</>;

export const Between: React.FC<{a?: number; b: number; children: React.ReactNode}> = ({a = -1e7, b, children}) => {
  const f = useCurrentFrame();
  return f >= a && f < b ? <>{children}</> : null;
};

/** A creased print (img/wall/cr_*.png and the like) on the desk, top-left at (x, y), popping on at `at`. */
export const Print: React.FC<{src: string; size: [number, number]; x: number; y: number; w: number; at: number; rot?: number; dim?: number}> = ({src, size, x, y, w, at, rot = 0, dim = 1}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 3, at + 6], [1.15, 0.98, 1], clamp);
  return (
    <>
      <Img src={staticFile(src)} style={{position: 'absolute', left: x, top: y, width: w, height: (size[1] * w) / size[0], transform: `rotate(${rot}deg) scale(${k})`,
        opacity: interpolate(f, [at, at + 2], [0, 1], clamp), filter: `grayscale(1) brightness(${dim}) drop-shadow(0 16px 22px rgba(0,0,0,0.7))`}} />
      <Sfx at={at} src="sfx/tick.wav" volume={0.35} />
    </>
  );
};

/** A coral ✕ over the box (x, y, w, h), drawn on from `at`. */
export const Cross: React.FC<{x: number; y: number; w: number; h: number; at: number; width?: number}> = ({x, y, w, h, at, width = 16}) => {
  const g = useGFrame();
  const p1 = interpolate(g, [at, at + 4], [0, 1], clamp);
  const p2 = interpolate(g, [at + 3, at + 7], [0, 1], clamp);
  if (p1 <= 0) return null;
  const l = (x1: number, y1: number, x2: number, y2: number, p: number) => `M ${x1} ${y1} L ${x1 + (x2 - x1) * p} ${y1 + (y2 - y1) * p}`;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,0.5))'}}>
      <path d={l(x, y, x + w, y + h, p1)} stroke={CORAL} strokeWidth={width} strokeLinecap="round" fill="none" />
      {p2 > 0 && <path d={l(x + w, y + h * 0.04, x + w * 0.03, y + h, p2)} stroke={CORAL} strokeWidth={width} strokeLinecap="round" fill="none" />}
      <Sfx at={at} src="sfx/marker_tick.wav" volume={0.3} />
    </svg>
  );
};

/** A torn window onto part of a page (centred on page px cx, cy at scale s), lying on the desk; children in page px. */
export const PageWin: React.FC<{src: string; cx: number; cy: number; s: number; w: number; h: number; x: number; y: number; r?: number; filter?: string; children?: React.ReactNode}> = ({
  src, cx, cy, s, w, h, x, y, r = 0, filter = 'grayscale(1) sepia(0.12) contrast(1.3)', children,
}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${r}deg)`, filter: 'drop-shadow(0 14px 20px rgba(0,0,0,0.7))'}}>
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#ddd6c6', clipPath: 'polygon(0 3%, 100% 0, 99% 96%, 1% 100%)'}}>
      <div style={{position: 'absolute', left: w / 2 - cx * s, top: h / 2 - cy * s, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <Img src={staticFile(src)} style={{display: 'block', filter}} />
        {children}
      </div>
    </div>
  </div>
);

/** The coral highlighter already laid on lines (page px). */
export const Ink: React.FC<{lines: Box[]; seed?: string}> = ({lines, seed = 'ink'}) => (
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
