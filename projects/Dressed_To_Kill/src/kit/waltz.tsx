// The Arsenic Waltz (Punch, 8 Feb 1862), shared by ch01, ch03 and ch08 so the three shots match: B&W with a faint
// handheld drift, and the lady's gown turning arsenic GREEN from a hand-traced outline (cleaner than the rembg mask).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import {clamp} from '../lib/anim';
import {INK, Picture, type Place, Tag, useGFrame} from './Kit';
import {fill} from './shell';
import {GREEN, sizeOf} from './dk';

export const WALTZ = 'img/ch03/arsenic_waltz_punch_1862.jpg';

/**
 * The lady's gown in the Arsenic Waltz, in source pixels (hand-traced; the waltz_lady mask only catches the line work,
 * so the gown is filled from this outline). Bodice and skirt, not the skull.
 */
export const GOWN: [number, number][] = [[929, 830], [1066, 780], [1230, 800], [1320, 880], [1380, 1010], [1420, 1150], [1546, 1175], [1695, 1219], [1903, 1427], [2082, 1606],
  [2141, 1784], [2090, 1940], [1903, 2030], [1487, 2110], [991, 2130], [595, 2100], [300, 1990], [160, 1800], [110, 1500], [150, 1250], [300, 1130], [560, 1070], [800, 1040], [910, 1000]];

/** The gown turning arsenic green: a colour blend (keeps the engraving's hatching) with a soft edge, stepped on at 12 fps. */
export const GownGreen: React.FC<{place: Place; at: number}> = ({place, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 8], [0, 1], clamp);
  const pts = GOWN.map(([x, y]) => `${x},${y}`).join(' ');
  const layer = (blend: React.CSSProperties['mixBlendMode'], o: number, id: string) => (
    <svg key={id} width={1920} height={1080} style={{position: 'absolute', inset: 0, mixBlendMode: blend, opacity: o * k, pointerEvents: 'none'}}>
      <defs><filter id={`gb${id}`} x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={14} /></filter></defs>
      <g transform={`translate(${place.left} ${place.top}) scale(${place.scale})`}>
        <polygon points={pts} fill={GREEN} filter={`url(#gb${id})`} />
      </g>
    </svg>
  );
  return <>{layer('color', 1, 'c')}{layer('multiply', 0.35, 'm')}{layer('screen', 0.12, 's')}</>;
};

/**
 * One framing of the Waltz: centred on source (fx, fy), pushing z0 → z1 between a and b, with a faint handheld drift.
 * `green` = the frame the gown turns green (stays green after).
 */
export const WaltzShot: React.FC<{fx: number; fy: number; z0: number; z1: number; a: number; b: number; green?: number; shade?: boolean; children?: (p: Place) => React.ReactNode}> = ({
  fx, fy, z0, z1, a, b, green, shade, children,
}) => {
  const f = useCurrentFrame();
  const size = sizeOf(WALTZ);
  const p0 = fill(size, fx, fy, interpolate(f, [a, b], [z0, z1], clamp));
  const place = {left: p0.left + noise2D('wx', f * 0.018, 0) * 3, top: p0.top + noise2D('wy', 0, f * 0.018) * 3, scale: p0.scale};
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Picture src={WALTZ} place={place} size={size} bw="grayscale(1) contrast(1.28) brightness(0.98)" />
      {green !== undefined && <GownGreen place={place} at={green} />}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.6) 100%)'}} />
      {shade && <AbsoluteFill style={{background: 'linear-gradient(180deg, transparent 68%, rgba(0,0,0,0.55) 100%)'}} />}
      {children?.(place)}
      <Tag text="The Arsenic Waltz, Punch, 8 Feb. 1862 · Wellcome Collection" />
    </AbsoluteFill>
  );
};

