// Small motion helpers for the test scene: 2D Catmull-Rom camera paths, handheld drift, directional motion blur.
import React from 'react';
import {noise2D} from '@remotion/noise';

export type V = [number, number, number];

/** A smooth path through keyframe points; u runs 0..1 over the whole path, no stops at the keys. */
export const path = (pts: V[], u: number): V => {
  const n = pts.length - 1;
  const x = Math.min(Math.max(u, 0), 1) * n;
  const i = Math.min(Math.floor(x), n - 1);
  const t = x - i;
  const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, n)];
  return [0, 1, 2].map((k) => {
    const a = p0[k], b = p1[k], c = p2[k], d = p3[k];
    return 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
  }) as V;
};

/** Slow, small handheld drift in px (and degrees for `r`). Different `seed`s give unrelated drifts. */
export const drift = (frame: number, seed: string, amp = 2, speed = 0.018) => ({
  x: noise2D(seed + 'x', frame * speed, 0) * amp,
  y: noise2D(seed + 'y', 0, frame * speed) * amp,
  r: noise2D(seed + 'r', frame * speed * 0.7, 3) * amp * 0.06,
});

/** Horizontal motion blur sized to the camera's speed (px per frame). An SVG blur with a 0 y-deviation only smears sideways. */
export const WhipBlur: React.FC<{id: string; speed: number; children: React.ReactNode}> = ({id, speed, children}) => {
  const dev = Math.min(Math.abs(speed) * 0.45, 140);
  if (dev < 0.5) return <>{children}</>;
  return (
    <>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id={id} x="-10%" y="0" width="120%" height="100%"><feGaussianBlur stdDeviation={`${dev} 0`} edgeMode="duplicate" /></filter>
      </svg>
      <div style={{position: 'absolute', inset: 0, filter: `url(#${id})`}}>{children}</div>
    </>
  );
};

/** Corner label naming the technique on screen (review renders only). */
export const Label: React.FC<{text: string; show: boolean}> = ({text, show}) =>
  show ? (
    <div style={{position: 'absolute', right: 40, top: 34, fontFamily: '"IBM Plex Mono", monospace', fontSize: 20, letterSpacing: 1.5, color: '#2FE0C4', textTransform: 'uppercase',
      background: 'rgba(0,0,0,0.6)', padding: '6px 12px', border: '1px solid rgba(47,224,196,0.5)'}}>{text}</div>
  ) : null;
