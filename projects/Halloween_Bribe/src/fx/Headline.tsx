// The cold open's hook: the real Bismarck Tribune front page (1 Nov 1933) as a sheet of paper in 3D, the camera already
// moving at frame 0, tear-gas smoke rolling across it. Then it pulls back to the whole page on the desk, and pushes back in
// to the headline for "Look at the headline", where a coral loop circles it.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import {DarkPaper} from '../kit/common';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const SRC = 'img/ch03/bismarck_tribune_1933-11-01_front_page.jpg';
const SIZE: [number, number] = [2600, 3426];
/** the headline's box in source pixels (from the LOC phrase finder) */
const HEAD = {x: 78, y: 391, w: 2311, h: 134};
const PW = 1500;
const S = PW / SIZE[0];
const PH = SIZE[1] * S;

/** Rolling smoke: big soft blobs drifting right to left, thickening by `density` (0..1). Smooth (not stepped). */
export const Smoke: React.FC<{density: number; seed?: string; speed?: number; y?: number; spread?: number; over?: 'dark' | 'light'}> = ({density, seed = 'sm', speed = 1, y = 540, spread = 420, over = 'dark'}) => {
  const f = useCurrentFrame();
  if (density <= 0.01) return null;
  const blobs = Array.from({length: 9}, (_, i) => {
    const t = ((f * 0.0035 * speed + i / 9) % 1);
    const x = 2300 - t * 3000;
    const yy = y + noise2D(`${seed}y${i}`, i * 3.1, f * 0.006) * spread;
    const r = 420 + 180 * Math.abs(noise2D(`${seed}r${i}`, i, 0));
    const a = Math.sin(Math.PI * t) * density * (0.5 + 0.5 * Math.abs(noise2D(`${seed}a${i}`, i * 7, f * 0.01)));
    return <div key={i} style={{position: 'absolute', left: x - r, top: yy - r * 0.6, width: r * 2, height: r * 1.2, borderRadius: '50%',
      background: over === 'dark' ? 'radial-gradient(ellipse at center, rgba(228,226,220,0.85) 0%, rgba(210,208,200,0.35) 45%, rgba(200,200,200,0) 70%)'
        : 'radial-gradient(ellipse at center, rgba(150,148,140,0.75) 0%, rgba(165,162,155,0.35) 45%, rgba(170,170,170,0) 70%)',
      filter: 'blur(28px)', opacity: a, mixBlendMode: over === 'dark' ? 'screen' : 'normal'}} />;
  });
  return <AbsoluteFill style={{pointerEvents: 'none'}}>{blobs}</AbsoluteFill>;
};

/**
 * Frames: 0 = the scene starts (close on the headline); `pull` = start pulling back to the whole page; `look` = push back in;
 * `loop` = the coral loop draws round the headline. `smoke` = [frame, density] keys.
 */
export const HeadlineHook: React.FC<{pull: number; look: number; loop: number; smoke: [number, number][]}> = ({pull, look, loop, smoke}) => {
  const f = useCurrentFrame();
  // camera: zoom (1 = whole page fits the height), centre point on the page (0..1), tilt
  const keys = [
    {f: 0, z: 2.55, cx: 0.5, cy: 0.135, tilt: 24, rz: -4},
    {f: Math.max(1, pull - 1), z: 2.35, cx: 0.53, cy: 0.14, tilt: 20, rz: -3},
    {f: pull + 40, z: 0.93, cx: 0.5, cy: 0.47, tilt: 14, rz: -2},
    {f: look, z: 0.98, cx: 0.5, cy: 0.42, tilt: 13, rz: -2},
    {f: look + 24, z: 1.75, cx: 0.48, cy: 0.15, tilt: 18, rz: -3},
    {f: look + 200, z: 1.95, cx: 0.5, cy: 0.15, tilt: 20, rz: -3.5},
  ];
  const fs = keys.map((k) => k.f);
  const ease = Easing.inOut(Easing.cubic);
  const v = (k: 'z' | 'cx' | 'cy' | 'tilt' | 'rz') => interpolate(f, fs, keys.map((q) => q[k]), {...clamp, easing: ease});
  const fit = 1000 / PH;
  const z = v('z') * fit;
  const cx = v('cx') * PW;
  const cy = v('cy') * PH;
  const drift = {x: noise2D('hx', f * 0.008, 0) * 14, y: noise2D('hy', 0, f * 0.008) * 10};
  const dens = interpolate(f, smoke.map((s) => s[0]), smoke.map((s) => s[1]), clamp);
  const lp = interpolate(f, [loop, loop + 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#0b0a08', overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{perspective: 1400, perspectiveOrigin: '50% 40%'}}>
        <div style={{position: 'absolute', left: 960 - cx + drift.x, top: 560 - cy + drift.y, width: PW, height: PH, transformOrigin: `${cx}px ${cy}px`,
          transform: `scale(${z}) rotateX(${v('tilt')}deg) rotateZ(${v('rz')}deg)`, boxShadow: '0 40px 80px rgba(0,0,0,0.8)'}}>
          <Img src={staticFile(SRC)} style={{width: PW, height: PH, display: 'block', filter: 'grayscale(1) contrast(1.25) sepia(0.18) brightness(0.98)'}} />
          {/* paper curl and age: darker at the edges, a soft fold across the middle */}
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 12%, rgba(0,0,0,0) 88%, rgba(0,0,0,0.32) 100%), linear-gradient(180deg, rgba(0,0,0,0) 46%, rgba(0,0,0,0.12) 50%, rgba(255,255,255,0.05) 52%, rgba(0,0,0,0) 56%)'}} />
          {lp > 0 && (
            <svg width={PW} height={PH} style={{position: 'absolute', left: 0, top: 0}}>
              <ellipse cx={(HEAD.x + HEAD.w / 2) * S} cy={(HEAD.y + HEAD.h / 2) * S} rx={HEAD.w * S * 0.54} ry={HEAD.h * S * 1.15} fill="none" stroke="#FF6F61" strokeWidth={6}
                pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lp} strokeLinecap="round" transform={`rotate(-1.5 ${(HEAD.x + HEAD.w / 2) * S} ${(HEAD.y + HEAD.h / 2) * S})`} />
            </svg>
          )}
        </div>
      </AbsoluteFill>
      <Smoke density={dens} seed="hook" y={480} over="light" />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};
