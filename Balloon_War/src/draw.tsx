// Hand-drawn pieces (ported from When Europe Ate Mummies): line art that draws on and boils at 12 fps, shape morphs,
// positions along a path, and music beds with their own windows.
import React from 'react';
import {Audio, interpolate, random, Sequence, staticFile} from 'remotion';
import {clamp} from './lib/anim';
import {JF, useGFrame, useHand, usePal} from './kit/Kit';

export type P = [number, number];

/** Resample a polyline to n evenly spaced points (so two shapes can morph point for point). */
export const resample = (pts: P[], n: number, closed = false): P[] => {
  const src = closed ? [...pts, pts[0]] : pts;
  const seg: number[] = [];
  let total = 0;
  for (let i = 1; i < src.length; i++) {
    const d = Math.hypot(src[i][0] - src[i - 1][0], src[i][1] - src[i - 1][1]);
    seg.push(d);
    total += d;
  }
  const out: P[] = [];
  for (let k = 0; k < n; k++) {
    let dist = (total * k) / (n - 1);
    let i = 0;
    while (i < seg.length - 1 && dist > seg[i]) dist -= seg[i++];
    const t = seg[i] ? dist / seg[i] : 0;
    out.push([src[i][0] + (src[i + 1][0] - src[i][0]) * t, src[i][1] + (src[i + 1][1] - src[i][1]) * t]);
  }
  return out;
};

/** Smooth path through points (Catmull-Rom → cubic Bézier). */
export const smoothPath = (pts: P[], closed = false) => {
  if (pts.length < 2) return '';
  const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${p[1][0].toFixed(1)},${p[1][1].toFixed(1)}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [x0, y0] = p[i - 1], [x1, y1] = p[i], [x2, y2] = p[i + 1], [x3, y3] = p[i + 2];
    d += ` C${(x1 + (x2 - x0) / 6).toFixed(1)},${(y1 + (y2 - y0) / 6).toFixed(1)} ${(x2 - (x3 - x1) / 6).toFixed(1)},${(y2 - (y3 - y1) / 6).toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
  }
  return d;
};

const boilJ = (g: number, key: string, amp: number) => (random(`${key}${Math.floor(g / 5)}`) - 0.5) * amp;

/**
 * A sketched line: `pts` in local units, placed at (x, y) and scaled by `s`. Draws on from `at` over `dur`.
 * With `to`, morphs into another shape between frames `ma` and `mb`.
 */
export const Sketch: React.FC<{pts: P[]; x: number; y: number; s?: number; at: number; dur?: number; to?: P[]; ma?: number; mb?: number; closed?: boolean;
  color?: string; width?: number; smooth?: boolean; fill?: string; fillOpacity?: number; out?: number; dashed?: boolean; n?: number}> = ({
  pts, x, y, s = 1, at, dur = 12, to, ma = 1e7, mb = 1e7 + 1, closed = false, color, width = 6, smooth = true, fill, fillOpacity = 0.5, out = 1e7, dashed, n = 90,
}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at || g >= out) return null;
  const A = resample(pts, n, closed);
  const B = to ? resample(to, n, closed) : A;
  const u = interpolate(g, [ma, mb], [0, 1], {...clamp, easing: (t) => t * t * (3 - 2 * t)});
  const cur: P[] = A.map(([ax, ay], i) => [x + (ax + (B[i][0] - ax) * u) * s + boilJ(g, `x${i % 7}`, 2), y + (ay + (B[i][1] - ay) * u) * s + boilJ(g, `y${i % 5}`, 2)]);
  const d = smooth ? smoothPath(cur, closed) : 'M' + cur.map((q) => q.map((v) => v.toFixed(1)).join(',')).join(' L') + (closed ? ' Z' : '');
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}} width={1920} height={1080}>
      {fill && p >= 1 && <path d={d} fill={fill} opacity={fillOpacity} stroke="none" />}
      <path d={d} fill="none" stroke={color ?? pal.mark} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} strokeDasharray={dashed ? '0.012 0.012' : 1} strokeDashoffset={dashed ? 0 : 1 - p}
        style={dashed ? {clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`} : undefined} />
    </svg>
  );
};

/** Position along a polyline at fraction u (0..1). */
export const along = (pts: P[], u: number): P => {
  const r = resample(pts, 200);
  return r[Math.min(199, Math.max(0, Math.round(u * 199)))];
};

/** Music bed with its own window: fades in at `from`, out at `to` (narration frames). */
export const Bed: React.FC<{src: string; from: number; to: number; volume?: number; startFrom?: number; fadeIn?: number; fadeOut?: number}> = ({src, from, to, volume = 0.2, startFrom = 0, fadeIn = 20, fadeOut = 30}) => (
  <Sequence from={Math.max(0, from)} durationInFrames={Math.max(1, to - Math.max(0, from))} layout="none">
    <Audio src={staticFile(src)} startFrom={startFrom}
      volume={(f) => interpolate(f, [0, fadeIn, Math.max(fadeIn + 1, to - from - fadeOut), Math.max(fadeIn + 2, to - from)], [0, volume, volume, 0], clamp)} />
  </Sequence>
);
