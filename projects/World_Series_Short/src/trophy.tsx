// The Commissioner's Trophy, hand-drawn in the channel's teal line: a round base, a silver ball lined like a globe,
// thirty flagpoles fanning up to a tilted ring of gold pennants. Draws itself on from `at`, pole by pole, at 12 fps.
import React from 'react';
import {interpolate, random} from 'remotion';
import {clamp} from './lib/anim';
import {useGFrame, usePal} from './kit/Kit';

export const Trophy: React.FC<{x: number; y: number; w: number; at: number}> = ({x, y, w, at}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const h = w * 1.6;
  const boil = Math.floor(g / 5);
  const j = (k: string, a = 2.5) => (random(`${k}${boil}`) - 0.5) * a;
  const p = (a: number, d: number) => interpolate(g, [at + a, at + a + d], [0, 1], clamp);
  const draw = (a: number, d: number) => ({pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p(a, d)});
  const ink = {fill: 'none', stroke: pal.mark, strokeWidth: 6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  // geometry
  const cx = w / 2;
  const baseTop = h * 0.8, baseBot = h * 0.95, baseRx = w * 0.3, baseRy = w * 0.06;
  const ringCx = cx, ringCy = h * 0.2, ringRx = w * 0.4, ringRy = w * 0.13, tilt = -14;
  const poles = 30;
  const ballCy = h * 0.68, ballR = w * 0.09;
  const t = (tilt * Math.PI) / 180;
  const ringPt = (i: number) => {
    const a = (i / poles) * Math.PI * 2;
    const ex = Math.cos(a) * ringRx, ey = Math.sin(a) * ringRy;
    return [ringCx + ex * Math.cos(t) - ey * Math.sin(t), ringCy + ex * Math.sin(t) + ey * Math.cos(t)];
  };
  const footPt = (i: number) => {
    const a = (i / poles) * Math.PI * 2;
    return [cx + Math.cos(a) * baseRx * 0.62, baseTop + Math.sin(a) * baseRy * 0.6];
  };
  return (
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={w} height={h}>
      {/* base: a short drum */}
      <ellipse cx={cx + j('b1')} cy={baseTop} rx={baseRx} ry={baseRy} {...ink} {...draw(0, 8)} />
      <path d={`M${cx - baseRx},${baseTop} L${cx - baseRx + j('b2')},${baseBot} A${baseRx},${baseRy} 0 0 0 ${cx + baseRx},${baseBot} L${cx + baseRx + j('b3')},${baseTop}`} {...ink} {...draw(3, 8)} />
      {/* the poles, back half first so the front ones draw over them */}
      {Array.from({length: poles}, (_, i) => i)
        .sort((a, b) => Math.sin((a / poles) * Math.PI * 2) - Math.sin((b / poles) * Math.PI * 2))
        .map((i, k) => {
          const [fx, fy] = footPt(i);
          const [tx, ty] = ringPt(i);
          const back = Math.sin((i / poles) * Math.PI * 2) < 0;
          return <line key={i} x1={fx + j(`f${i}`)} y1={fy} x2={tx + j(`t${i}`)} y2={ty} {...ink} strokeWidth={back ? 3 : 4.5} opacity={back ? 0.55 : 1} {...draw(8 + k * 0.6, 8)} />;
        })}
      {/* the ball, lined like a globe */}
      <circle cx={cx} cy={ballCy} r={ballR} {...ink} fill="rgba(13,12,9,0.6)" {...draw(18, 8)} />
      {[-0.5, 0, 0.5].map((k, i) => <ellipse key={i} cx={cx} cy={ballCy + k * ballR} rx={ballR * Math.sqrt(1 - k * k)} ry={ballR * 0.18} {...ink} strokeWidth={3} {...draw(22 + i, 6)} />)}
      <ellipse cx={cx} cy={ballCy} rx={ballR * 0.45} ry={ballR} {...ink} strokeWidth={3} {...draw(24, 6)} />
      {/* the pennants: gold, popping on around the ring */}
      {Array.from({length: poles}, (_, i) => {
        const [tx, ty] = ringPt(i);
        const on = p(30 + i * 0.5, 3);
        if (on <= 0) return null;
        const back = Math.sin((i / poles) * Math.PI * 2) < 0;
        const s = w * 0.05 * on;
        return <path key={i} d={`M${tx},${ty} L${tx + s * 1.1},${ty - s * 0.35} L${tx},${ty - s * 0.7} Z`} fill={pal.box ?? '#FF9F1C'} opacity={back ? 0.6 : 1} />;
      })}
    </svg>
  );
};
