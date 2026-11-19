// Shot switcher with gentle transitions (American West Ep 1, Oct 2026: the user asked for gentler transitions than whip pans).
// Each shot is [start frame, node, kind]; the kind says how it comes in:
//  - 'whip': a soft drift, the two shots crossfade over ~half a second, the old one sliding 70 px left and softening,
//    the new one settling in from the right (it used to be an 8-frame, 900 px whip pan with heavy blur);
//  - 'cut': a quick 6-frame dissolve (it used to be a hard cut).
// Transitions are centred on the start frame, so word timings don't move. `plain` gives hard cuts (for tools/probe_text.mjs,
// so the probe measures each shot's own layout). Pair a 'whip' with a 'whip_soft' sound at half level, if any.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

export const SOFT = {whip: 16, cut: 6};
type Shot = [number, React.ReactNode, ('whip' | 'cut')?];
const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

export const Shots: React.FC<{shots: Shot[]; plain?: boolean}> = ({shots, plain = false}) => {
  const f = useCurrentFrame();
  let i = 0;
  shots.forEach(([s], k) => {
    if (f >= s) i = k;
  });
  const len = (k: Shot[2]) => (k === 'whip' ? SOFT.whip : SOFT.cut);
  const next = shots[i + 1];
  const cur = shots[i];
  let from: Shot | null = null;
  let to: Shot | null = null;
  if (!plain && next && f >= next[0] - len(next[2]) / 2) [from, to] = [cur, next];
  else if (!plain && i > 0 && f < cur[0] + len(cur[2]) / 2) [from, to] = [shots[i - 1], cur];
  if (!from || !to) return <>{cur[1]}</>;
  const d = len(to[2]);
  const e = easeInOut(Math.min(1, Math.max(0, (f - (to[0] - d / 2)) / d)));
  const drift = to[2] === 'whip';
  return (
    <>
      <AbsoluteFill style={drift ? {transform: `translateX(${-e * 70}px)`, filter: `blur(${e * 5}px)`} : undefined}>{from[1]}</AbsoluteFill>
      <AbsoluteFill style={{opacity: e, ...(drift ? {transform: `translateX(${(1 - e) * 70}px)`, filter: `blur(${(1 - e) * 5}px)`} : {})}}>{to[1]}</AbsoluteFill>
    </>
  );
};
