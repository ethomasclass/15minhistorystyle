// Chapter 9: drawn pieces.
//   YearsLine   1877 -> 1902, "25 years", with the two constitutions the chapter reads (Mississippi 1890, Louisiana 1898)
//   RegBars     Louisiana's registered Black voters as two bars on one scale: 130,344 (1896), then 1,342 (1904), a
//               sliver you have to circle to see (the scale shock)
import React from 'react';
import {Easing, interpolate} from 'remotion';
import {clamp} from '../lib/anim';
import {Sfx} from '../kit/common';
import {JF, Loop, useGFrame} from '../kit/Kit';
import {CORAL, TEAL} from '../kit/rc';
import {CREAM, HAND, Ink, Pop, roughRect, wob} from './ch08_kit';

// ------------------------------------------------------------------------------------------------ the years
const YX0 = 260, YX1 = 1660, YY = 560;
const yx = (yr: number) => YX0 + ((yr - 1877) / 25) * (YX1 - YX0);

export const YearsLine: React.FC<{at: number; span: number; marks: number}> = ({at, span, marks}) => (
  <>
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <Ink d={wob(YX0 - 20, YY, YX1 + 20, YY, 'yl', 2)} at={at + 2} dur={12} width={5} color={CREAM} />
      {[1877, 1882, 1887, 1892, 1897, 1902].map((y, i) => <Ink key={y} d={wob(yx(y), YY - 14, yx(y), YY + 14, `t${y}`, 0.5)} at={at + 4 + i * 2} dur={3} width={4} color={CREAM} />)}
      <Ink d={`M${yx(1877)},${YY - 70} Q${(yx(1877) + yx(1902)) / 2},${YY - 150} ${yx(1902)},${YY - 70}`} at={span} dur={12} width={6} color={TEAL} />
      {[1890, 1898].map((y, i) => <Ink key={y} d={wob(yx(y), YY + 20, yx(y), YY + 110, `m${y}`, 1)} at={marks + i * 5} dur={5} width={4} color={CORAL} />)}
    </svg>
    <Pop at={at + 4} x={yx(1877)} y={YY + 30} center style={{fontFamily: JF.display, fontSize: 64, color: CREAM}}>1877</Pop>
    <Pop at={at + 14} x={yx(1902)} y={YY + 30} center style={{fontFamily: JF.display, fontSize: 64, color: CREAM}}>1902</Pop>
    <Pop at={span + 8} x={(yx(1877) + yx(1902)) / 2} y={YY - 240} center style={{fontFamily: HAND, fontSize: 84, color: TEAL, textShadow: '0 3px 10px rgba(0,0,0,0.8)'}}>25 years</Pop>
    <Pop at={marks + 2} x={yx(1890)} y={YY + 120} center style={{fontFamily: JF.mono, fontSize: 28, letterSpacing: 2, color: CREAM}}>MISSISSIPPI, 1890</Pop>
    <Pop at={marks + 7} x={yx(1898)} y={YY + 120} center style={{fontFamily: JF.mono, fontSize: 28, letterSpacing: 2, color: CREAM}}>LOUISIANA, 1898</Pop>
    <Sfx at={at + 2} src="sfx/tick.wav" volume={0.35} />
    <Sfx at={span} src="sfx/marker_tick.wav" volume={0.25} />
  </>
);

// ------------------------------------------------------------------------------------------------ the bars
const BASE = 880, MAXH = 600, BW = 300;
const B1 = 620, B2 = 1180;   // left edges
const V1 = 130344, V2 = 1342;
const h = (v: number) => (v / V1) * MAXH;
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

export type BarCues = {first: number; later: number; second: number; ratio: number};

export const RegBars: React.FC<{c: BarCues}> = ({c}) => {
  const g = useGFrame();
  const p1 = Easing.out(Easing.cubic)(interpolate(g, [c.first, c.first + 16], [0, 1], clamp));
  const p2 = interpolate(g, [c.second, c.second + 4], [0, 1], clamp);
  const h1 = h(V1) * p1, h2 = Math.max(h(V2) * p2, 0);
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <defs>
          <pattern id="rbBone" width={16} height={16} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width={16} height={16} fill="rgba(244,239,230,0.14)" /><line x1={0} y1={0} x2={0} y2={16} stroke="rgba(244,239,230,0.5)" strokeWidth={5} />
          </pattern>
        </defs>
        <Ink d={wob(B1 - 80, BASE, B2 + BW + 80, BASE, 'base', 2)} at={c.first - 6} dur={8} width={5} color={TEAL} />
        {g >= c.first && <>
          <rect x={B1} y={BASE - h1} width={BW} height={h1} fill="url(#rbBone)" />
          <path d={roughRect(B1, BASE - h1, BW, h1, `b1${Math.round(p1 * 4)}`, 2)} fill="none" stroke={CREAM} strokeWidth={4} strokeLinecap="round" />
        </>}
        {g >= c.second && <rect x={B2} y={BASE - h2} width={BW} height={h2} fill={CORAL} />}
        {/* the ghost of the first bar's height over the second */}
        {g >= c.later && <Ink d={wob(B2, BASE - h(V1), B2 + BW, BASE - h(V1), 'ghost', 1.5)} at={c.later} dur={6} width={3} color={CREAM} dash="10 10" opacity={0.5} />}
      </svg>
      <Loop cx={B2 + BW / 2} cy={BASE - 14} rx={200} ry={30} at={c.second + 6} dur={10} width={6} color={CORAL} seed={9} tilt={-3} />
      <Pop at={c.first - 4} x={960} y={92} center style={{fontFamily: JF.mono, fontSize: 32, letterSpacing: 3, color: CREAM}}>BLACK MEN REGISTERED TO VOTE · LOUISIANA</Pop>
      <Pop at={c.first} x={B1 + BW / 2} y={BASE + 20} center style={{fontFamily: JF.display, fontSize: 60, color: CREAM}}>1896</Pop>
      <Pop at={c.later} x={B2 + BW / 2} y={BASE + 20} center style={{fontFamily: JF.display, fontSize: 60, color: CREAM}}>1904</Pop>
      {g >= c.first && <div style={{position: 'absolute', left: B1 + BW / 2, top: BASE - h1 - 100, transform: 'translateX(-50%)', fontFamily: JF.display, fontSize: 84, lineHeight: 1, color: CREAM,
        whiteSpace: 'nowrap'}}>{fmt(V1 * p1)}</div>}
      <Pop at={c.second + 2} x={B2 + BW / 2} y={BASE - 150} center style={{fontFamily: JF.display, fontSize: 84, lineHeight: 1, color: CORAL}}>1,342</Pop>
      <Pop at={c.ratio} x={B2 - 10} y={BASE - 330} style={{fontFamily: HAND, fontSize: 70, color: CORAL, textShadow: '0 3px 10px rgba(0,0,0,0.8)'}}>about 1 in 100</Pop>
      <Sfx at={c.first} src="sfx/tick.wav" volume={0.35} />
      <Sfx at={c.second} src="sfx/stamp.wav" volume={0.32} />
    </>
  );
};
