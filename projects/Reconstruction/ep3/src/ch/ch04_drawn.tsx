// ch04's two drawings (a heavy chapter: plain teal line, no picture of the killing).
//   CourthousePlan  the courthouse at Colfax as a plan: the guards round it, the militia's line closing in, a cannon
//   RangeBar        how many died: at least 60 …… possibly more than 150, on a plain number line
import React from 'react';
import {AbsoluteFill, interpolate, random} from 'remotion';
import {DarkPaper, Sfx} from '../kit/common';
import {JF, Tag, useGFrame} from '../kit/Kit';
import {TEAL} from '../kit/rc';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const CREAM = 'rgba(236,230,216,0.9)';

export type PlanCues = {a: number; guards: number; militia: number; close: number; cannon: number; dim: number};

const CX = 1300, CY = 560;
const ell = (rx: number, ry: number, deg: number) => [CX + rx * Math.cos((deg * Math.PI) / 180), CY + ry * Math.sin((deg * Math.PI) / 180)];

export const CourthousePlan: React.FC<{c: PlanCues; children?: React.ReactNode}> = ({c, children}) => {
  const g = useGFrame();
  const draw = interpolate(g, [c.a + 3, c.a + 15], [0, 1], clamp);
  const dim = interpolate(g, [c.dim, c.dim + 6], [1, 0.45], clamp);
  const close = interpolate(g, [c.close, c.close + 50], [0, 1], clamp);
  const rx = 480 - 150 * close, ry = 340 - 100 * close;
  const N_G = 16, N_M = 40;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: dim}}>
        {/* the courthouse */}
        <path d={`M ${CX - 130} ${CY + 80} L ${CX - 130} ${CY - 70} L ${CX} ${CY - 120} L ${CX + 130} ${CY - 70} L ${CX + 130} ${CY + 80} Z`} fill="rgba(47,224,196,0.06)" stroke={TEAL} strokeWidth={6}
          strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        <rect x={CX - 22} y={CY + 30} width={44} height={50} fill="none" stroke={TEAL} strokeWidth={4} opacity={draw >= 1 ? 1 : 0} />
        {/* the guards */}
        {Array.from({length: N_G}, (_, i) => {
          const at = c.guards + Math.floor(i * 0.8);
          if (g < at) return null;
          const [x, y] = ell(200 + random(`gr${i}`) * 14, 150 + random(`gy${i}`) * 10, (360 * i) / N_G + 8);
          return <circle key={i} cx={x} cy={y} r={10} fill={TEAL} />;
        })}
        {/* the militia's line */}
        {Array.from({length: N_M}, (_, i) => {
          const at = c.militia + Math.floor(i * 0.5);
          if (g < at) return null;
          const deg = (360 * i) / N_M + random(`md${i}`) * 4;
          const [x, y] = ell(rx + random(`mr${i}`) * 20, ry + random(`my${i}`) * 14, deg);
          const a = Math.atan2(CY - y, CX - x);
          return <path key={i} d={`M ${x - 9 * Math.sin(a)} ${y + 9 * Math.cos(a)} L ${x + 9 * Math.sin(a)} ${y - 9 * Math.cos(a)}`} stroke={CREAM} strokeWidth={6} strokeLinecap="round" />;
        })}
        {/* the cannon, on the line to the left */}
        {g >= c.cannon && (() => {
          const [x, y] = ell(rx - 40, ry, 180);
          return (
            <g transform={`translate(${x} ${y})`}>
              <rect x={-6} y={-10} width={62} height={18} rx={6} fill={CREAM} />
              <circle cx={4} cy={14} r={15} fill="none" stroke={CREAM} strokeWidth={5} />
            </g>
          );
        })()}
      </svg>
      <div style={{position: 'absolute', left: CX - 110, top: CY - 40, width: 220, textAlign: 'center', fontFamily: JF.mono, fontSize: 20, letterSpacing: 3, color: TEAL,
        opacity: draw >= 1 ? dim : 0}}>COURTHOUSE</div>
      {children}
      <Sfx at={c.a + 3} src="sfx/tick.wav" volume={0.3} />
      <Tag text="Drawn: the courthouse at Colfax, Easter Sunday, April 13, 1873 (not to scale; no picture of it survives)" />
    </AbsoluteFill>
  );
};

export type RangeCues = {a: number; least: number; more: number};

const X0 = 260, X1 = 1660, MAX = 200;
const xv = (v: number) => X0 + ((X1 - X0) * v) / MAX;
const AY = 690;

/** A plain number line: the dead at Colfax, at least 60, possibly more than 150 (drawn, no picture). */
export const RangeBar: React.FC<{c: RangeCues; children?: React.ReactNode}> = ({c, children}) => {
  const g = useGFrame();
  const axis = interpolate(g, [c.a + 2, c.a + 12], [0, 1], clamp);
  const span = interpolate(g, [c.more, c.more + 14], [0, 1], clamp);
  const num = (v: string, label: string, x: number, at: number) => g >= at && (
    <div style={{position: 'absolute', left: x - 300, top: AY - 250, width: 600, textAlign: 'center', opacity: interpolate(g, [at, at + 4], [0, 1], clamp)}}>
      <div style={{fontFamily: JF.mono, fontSize: 28, letterSpacing: 3, color: 'rgba(244,239,230,0.8)'}}>{label}</div>
      <div style={{fontFamily: JF.display, fontSize: 150, lineHeight: 1.05, color: '#f4efe6', textShadow: '0 6px 22px rgba(0,0,0,0.8)'}}>{v}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <DarkPaper />
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={X0} y1={AY} x2={X0 + (X1 - X0) * axis} y2={AY} stroke="rgba(244,239,230,0.55)" strokeWidth={4} strokeLinecap="round" />
        {axis >= 1 && [0, 50, 100, 150, 200].map((v) => <line key={v} x1={xv(v)} y1={AY - 10} x2={xv(v)} y2={AY + 10} stroke="rgba(244,239,230,0.55)" strokeWidth={3} />)}
        {g >= c.least && <line x1={xv(60)} y1={AY - 34} x2={xv(60)} y2={AY + 34} stroke={TEAL} strokeWidth={8} strokeLinecap="round" />}
        {span > 0 && <line x1={xv(60)} y1={AY} x2={xv(60) + (xv(150) - xv(60)) * span} y2={AY} stroke={TEAL} strokeWidth={12} strokeDasharray="4 18" strokeLinecap="round" />}
        {span >= 1 && (
          <>
            <line x1={xv(150)} y1={AY - 34} x2={xv(150)} y2={AY + 34} stroke={TEAL} strokeWidth={8} strokeLinecap="round" />
            <line x1={xv(150)} y1={AY} x2={xv(178)} y2={AY} stroke={TEAL} strokeWidth={6} strokeDasharray="10 12" opacity={0.6} />
            <path d={`M ${xv(178) - 16} ${AY - 14} L ${xv(178)} ${AY} L ${xv(178) - 16} ${AY + 14}`} fill="none" stroke={TEAL} strokeWidth={6} opacity={0.6} strokeLinecap="round" />
          </>
        )}
      </svg>
      {axis >= 1 && [0, 50, 100, 150, 200].map((v) => (
        <div key={v} style={{position: 'absolute', left: xv(v) - 50, top: AY + 26, width: 100, textAlign: 'center', fontFamily: JF.mono, fontSize: 24, color: 'rgba(244,239,230,0.6)'}}>{v}</div>
      ))}
      {num('60', 'AT LEAST', xv(60), c.least)}
      {num('150+', 'POSSIBLY MORE THAN', xv(150), c.more)}
      {children}
      <Sfx at={c.least} src="sfx/tick.wav" volume={0.3} />
      <Sfx at={c.more} src="sfx/tick.wav" volume={0.3} />
      <Tag text="Drawn: estimates of the dead at Colfax, April 1873 (the count was never settled)" />
    </AbsoluteFill>
  );
};
