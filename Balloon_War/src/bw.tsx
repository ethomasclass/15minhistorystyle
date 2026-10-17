// The Balloon War's own scene pieces: 3D photos by name, plain photos by path, cards, the then/now wipe and the
// censor bar. Archival photos show in black and white; the 2023 photos stay in color (now vs then).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {clamp} from './lib/anim';
import {Tag, useGFrame} from './kit/Kit';
import {Photo} from './kit/shell';
import {Photo3D} from './kit/photo3d';
import {L3D} from './layers3d';
import {im} from './images';

export const BW = 'grayscale(1) contrast(1.12)';
export const COLOR = 'contrast(1.04) saturate(0.92)';
export const CORAL = '#FF6F61';
export const ORANGE = '#FF9F1C';

/** A 3D photo from tools/layers3d_jobs.sh, with an optional source tag and a soft dark band for notes. */
export const P3: React.FC<{name: string; a: number; b: number; dolly?: number; yaw?: [number, number]; pan?: [number, number];
  rise?: [number, number]; deep?: number; color?: boolean; tag?: string; band?: 'top' | 'bottom' | 'left' | null; children?: React.ReactNode}> = ({
  name, a, b, dolly = 220, yaw = [-2.5, 2.5], pan = [0, 0], rise = [0, 0], deep = 1600, color, tag, band = 'bottom', children,
}) => {
  const l = L3D[name];
  if (!l) throw new Error(`No 3D layers for ${name} (run bash tools/layers3d_jobs.sh)`);
  const grad = band === 'top' ? 'linear-gradient(180deg, rgba(0,0,0,0.7), transparent 38%)'
    : band === 'left' ? 'linear-gradient(90deg, rgba(0,0,0,0.75), transparent 48%)'
    : band === 'bottom' ? 'linear-gradient(transparent 55%, rgba(0,0,0,0.78) 88%)' : 'none';
  return (
    <AbsoluteFill>
      <Photo3D name={name} depths={l.depths} size={l.size} a={a} b={b} dolly={dolly} yaw={yaw} pan={pan} rise={rise} deep={deep} filter={color ? COLOR : BW} />
      <AbsoluteFill style={{background: grad}} />
      {children}
      {tag && <Tag text={tag} />}
    </AbsoluteFill>
  );
};

/** A plain photo by path with a slow push toward (fx, fy). */
export const Ph: React.FC<{p: string; fx: number; fy: number; a: number; b: number; z0?: number; z1?: number; color?: boolean; tag?: string;
  band?: 'top' | 'bottom' | 'left' | null; children?: (S: (x: number, y: number) => number[]) => React.ReactNode}> = ({p, fx, fy, a, b, z0 = 1.04, z1 = 1.14, color, tag, band = 'bottom', children}) => {
  const {src, size} = im(p);
  const grad = band === 'top' ? 'linear-gradient(180deg, rgba(0,0,0,0.7), transparent 38%)'
    : band === 'left' ? 'linear-gradient(90deg, rgba(0,0,0,0.75), transparent 48%)'
    : band === 'bottom' ? 'linear-gradient(transparent 55%, rgba(0,0,0,0.78) 88%)' : 'none';
  return (
    <Photo src={src} size={size} fx={fx} fy={fy} z0={z0} z1={z1} a={a} b={b} bw={color ? COLOR : BW} vignette={0.5}>
      {(place) => (
        <>
          <AbsoluteFill style={{background: grad}} />
          {children?.((x, y) => [place.left + x * place.scale, place.top + y * place.scale])}
          {tag && <Tag text={tag} />}
        </>
      )}
    </Photo>
  );
};

/** Then/now: `from` sits on top and a vertical edge wipes it away right to left between frames a and a+dur. */
export const Wipe: React.FC<{a: number; dur?: number; from: React.ReactNode; to: React.ReactNode}> = ({a, dur = 20, from, to}) => {
  const f = useCurrentFrame();
  const u = interpolate(f, [a, a + dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const x = 1920 * (1 - u);
  return (
    <AbsoluteFill>
      {to}
      <AbsoluteFill style={{clipPath: `inset(0 ${1920 - x}px 0 0)`}}>{from}</AbsoluteFill>
      {u > 0 && u < 1 && <div style={{position: 'absolute', left: x - 3, top: 0, width: 6, height: 1080, background: '#f4efe6', boxShadow: '0 0 24px rgba(0,0,0,0.8)'}} />}
    </AbsoluteFill>
  );
};

/** A censor bar that slides across (x, y, w, h) from frame `at`, and lifts again at `lift`. */
export const Redact: React.FC<{x: number; y: number; w: number; h: number; at: number; lift?: number; rot?: number}> = ({x, y, w, h, at, lift = 1e7, rot = -1}) => {
  const g = useGFrame();
  if (g < at) return null;
  const u = interpolate(g, [at, at + 6], [0, 1], clamp);
  const up = interpolate(g, [lift, lift + 8], [0, 1], clamp);
  return <div style={{position: 'absolute', left: x, top: y - up * 40, width: w * u, height: h, background: '#0b0b0b', opacity: 1 - up,
    transform: `rotate(${rot}deg)`, boxShadow: '0 6px 18px rgba(0,0,0,0.6)'}} />;
};
