// No hands (the user, Nov 19 2026: option A of review/quality_pass/hands_A.jpg, prototyped in src/proto/HandsProto.tsx).
// Objects arrive on their own, the Gilded Age deskCut way (ep5/edit/edit.js):
//   DropIn    one object: it flies in lifted (5% larger, a high, wide, soft shadow), touches down at `at` (the shadow closes to the
//             Gilded Age contact shadow, 0 3px 2px, in 4 frames), slides the last 34 px and turns the last few degrees to rest.
//   DropDeal  the same for a list of recipe cards (the drop-in replacement for the old HandDeal): each card lands on its word.
import React from 'react';
import {interpolate} from 'remotion';
import {clamp} from '../lib/anim';
import {useGFrame} from './Kit';

const easeOut = (q: number) => 1 - Math.pow(1 - q, 3);
/** Frames of flight before touch-down. */
export const DROP_F = 11;
/** Where an object comes from: [dx, dy] px off its spot and extra degrees. */
export type From = [number, number, number];

export const DropIn: React.FC<{at: number; x: number; y: number; rot?: number; from?: From; out?: number; origin?: string; children: React.ReactNode}> = ({
  at, x, y, rot = 0, from = [700, -420, -24], out = Infinity, origin = '50% 50%', children,
}) => {
  const f = useGFrame(), t = f - at;
  if (t < -DROP_F || f >= out) return null;
  const slideDir = Math.atan2(-from[1], -from[0]), sx = Math.cos(slideDir) * 34, sy = Math.sin(slideDir) * 34;
  const spin = Math.sign(from[2] || 1) * 6;
  let dx: number, dy: number, dr: number, k: number, lift: number;
  if (t < 0) {
    const p = easeOut((t + DROP_F) / DROP_F);
    dx = from[0] * (1 - p) - sx; dy = from[1] * (1 - p) - sy; dr = from[2] * (1 - p) + spin; k = 1.05; lift = 1;
  } else {
    const p = interpolate(t, [0, 6], [0, 1], {...clamp, easing: easeOut});
    dx = -sx * (1 - p); dy = -sy * (1 - p); dr = spin * (1 - p) - Math.sign(spin) * Math.sin(Math.PI * p);
    k = interpolate(t, [0, 2, 5], [1.05, 0.99, 1], clamp); lift = interpolate(t, [0, 4], [0.35, 0], clamp);
  }
  const L = 3 + 41 * lift, B = 2 + 34 * lift;
  return (
    <div style={{position: 'absolute', left: x + dx, top: y + dy, transform: `rotate(${rot + dr}deg) scale(${k})`, transformOrigin: origin,
      filter: `drop-shadow(0 ${(3 * (1 - lift)).toFixed(1)}px 2px rgba(0,0,0,${(0.75 * (1 - lift)).toFixed(2)})) drop-shadow(${(L * 0.35).toFixed(1)}px ${L.toFixed(1)}px ${B.toFixed(1)}px rgba(0,0,0,${(0.35 + 0.25 * lift).toFixed(2)}))`}}>
      {children}
    </div>
  );
};

export type DropDealCard = {at: number; x: number; y: number; rot?: number; from?: From; card: React.ReactNode};
const FROMS: From[] = [[-900, -300, -30], [500, 700, 26], [700, -420, -24]];

/** Recipe cards dropped one per beat (later cards on top). `from` defaults cycle through three directions. */
export const DropDeal: React.FC<{deals: DropDealCard[]}> = ({deals}) => (
  <>
    {deals.map((d, i) => <DropIn key={i} at={d.at} x={d.x} y={d.y} rot={d.rot} from={d.from ?? FROMS[i % FROMS.length]}>{d.card}</DropIn>)}
  </>
);
