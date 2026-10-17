// Layered silhouette scenes: a Flow silhouette split by tools/silhouette_layers.py into public/img/layers/<name>/
// (L0.jpg sky, L1..Ln.png nearer planes), moved as true parallax, with an optional cut-out subject (a balloon) that
// drifts across between two planes, bobbing and tilting on the wind.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';

export type Drift = {
  src: string;                 // the subject sprite (e.g. img/layers/<name>/subject.png)
  w: number;                   // its on-screen width (px)
  behind: number;              // drawn just behind plane index `behind` (so planes >= behind pass in front of it)
  from: [number, number];      // screen start (x, y) of the sprite's centre
  to: [number, number];        // screen end
  a: number; b: number;        // frames over which it travels
  bob?: number;                // vertical bob amplitude (px)
  tilt?: number;               // max tilt (degrees)
  sink?: [number, number][];   // optional [frame, dy] keyframes: dips and climbs (rise, sink, drop a bag)
};

export const LayeredScene: React.FC<{
  name: string; planes: number; size: [number, number];
  a: number; b: number;        // the camera move runs from frame a to b
  shift?: number;              // how far the nearest plane slides (px); the sky moves about 6% of that
  push?: number;               // how much the nearest plane grows (dolly in), e.g. 0.06
  dir?: 1 | -1;                // camera moves right (1) or left (-1)
  focusY?: number;             // which part of a tall picture stays in frame (0 top, 0.5 centre, 1 bottom)
  over?: number;               // extra scale over 'cover', room for the parallax (default 1.08)
  drift?: Drift;
  children?: React.ReactNode;
}> = ({name, planes, size, a, b, shift = 140, push = 0.05, dir = 1, focusY = 0.5, over = 1.08, drift, children}) => {
  const f = useCurrentFrame();
  const u = interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
  const base = Math.max(1920 / size[0], 1080 / size[1]) * over;
  const plane = (p: number) => {
    const depth = p === 0 ? 0.06 : 0.15 + (0.85 * p) / (planes - 1);
    const s = base * (1 + push * depth * u);
    const x = 960 - (size[0] * s) / 2 - dir * (u - 0.5) * shift * depth;
    const y = (1080 - size[1] * s) * focusY;
    const src = staticFile(`img/layers/${name}/${p === 0 ? 'L0.jpg' : `L${p}.png`}`);
    return <Img key={p} src={src} style={{position: 'absolute', left: x, top: y, width: size[0] * s, height: size[1] * s}} />;
  };
  let sprite: React.ReactNode = null;
  if (drift && f >= drift.a - 1) {
    const t = interpolate(f, [drift.a, drift.b], [0, 1], clamp);
    const sx = drift.from[0] + (drift.to[0] - drift.from[0]) * t;
    const sink = drift.sink ? interpolate(f, drift.sink.map((k) => k[0]), drift.sink.map((k) => k[1]), clamp) : 0;
    const sy = drift.from[1] + (drift.to[1] - drift.from[1]) * t + Math.sin(f / 22) * (drift.bob ?? 10) + sink;
    const rot = Math.sin(f / 31 + 1) * (drift.tilt ?? 3);
    sprite = (
      <Img key="drift" src={staticFile(drift.src)} style={{position: 'absolute', left: sx - drift.w / 2, top: sy - drift.w * 0.7, width: drift.w,
        transform: `rotate(${rot}deg)`, transformOrigin: '50% 20%'}} />
    );
  }
  const stack: React.ReactNode[] = [];
  for (let p = 0; p < planes; p++) {
    if (drift && p === drift.behind) stack.push(sprite);
    stack.push(plane(p));
  }
  if (drift && drift.behind >= planes) stack.push(sprite);
  return <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>{stack}{children}</AbsoluteFill>;
};
