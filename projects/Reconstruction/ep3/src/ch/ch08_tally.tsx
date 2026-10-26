// Chapter 8: the electoral count as a drawn tally. A dashed line at 185 ("to win"); Tilden's bar to 184, Hayes's to
// 165; the 20 disputed votes as their own coral pile below. Then the commission gives the pile to Hayes: it lifts and
// slides onto the end of his bar, and his count ticks 165 -> 185. Scale: 6.4 px a vote, from zero (no cut axis).
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {Sfx} from '../kit/common';
import {JF, useGFrame} from '../kit/Kit';
import {CORAL, TEAL} from '../kit/rc';
import {CREAM, HAND, Ink, Pop, roughRect, wob} from './ch08_kit';

const X0 = 300, U = 6.4, BH = 92;
const ROW = {tilden: 300, hayes: 500};
const LINE_X = X0 + 185 * U;
const PILE = {x: 760, y: 735};
const DOCK = {x: X0 + 165 * U, y: ROW.hayes};
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

export type TallyCues = {need: number; tilden: number; hayes: number; disputed: number; slide?: number; slideEnd?: number};

const Hatch: React.FC<{id: string; color: string; bg: string}> = ({id, color, bg}) => (
  <pattern id={id} width={16} height={16} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width={16} height={16} fill={bg} /><line x1={0} y1={0} x2={0} y2={16} stroke={color} strokeWidth={5} />
  </pattern>
);

/** A bar growing from zero to `v` votes over [at, at+dur]. */
const Bar: React.FC<{y: number; v: number; at: number; dur?: number; seed: string; fill: string; stroke: string}> = ({y, v, at, dur = 14, seed, fill, stroke}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = Easing.out(Easing.cubic)(interpolate(g, [at, at + dur], [0, 1], clamp));
  const w = v * U * p;
  return (
    <g>
      <rect x={X0} y={y} width={w} height={BH} fill={fill} />
      <path d={roughRect(X0, y, w, BH, seed + Math.round(p * 4), 2)} fill="none" stroke={stroke} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};

/** Before `from` everything up to that point is already drawn (for the cut back to the tally). */
export const Tally: React.FC<{c: TallyCues; from?: number}> = ({c, from = -1e6}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const pre = (v: number) => (v < from ? from - 400 : v);
  const slide = c.slide ?? 1e7, slideEnd = c.slideEnd ?? slide + 30;
  const sp = Easing.inOut(Easing.cubic)(interpolate(f, [slide, slideEnd], [0, 1], clamp));
  const lift = Math.sin(Math.PI * sp) * 90;
  const px = PILE.x + (DOCK.x - PILE.x) * sp, py = PILE.y + (DOCK.y - PILE.y) * sp - lift;
  const docked = f >= slideEnd;
  const hv = docked ? interpolate(g, [slideEnd, slideEnd + 8], [165, 185], clamp) : interpolate(g, [pre(c.hayes), pre(c.hayes) + 14], [0, 165], clamp);
  const tv = interpolate(g, [pre(c.tilden), pre(c.tilden) + 14], [0, 184], clamp);
  const pileOn = g >= pre(c.disputed);
  const pk = interpolate(f, [pre(c.disputed), pre(c.disputed) + 4, pre(c.disputed) + 7], [1.25, 0.96, 1], clamp);
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <defs>
          <Hatch id="tlBone" color="rgba(244,239,230,0.45)" bg="rgba(244,239,230,0.12)" />
          <Hatch id="tlCoral" color="rgba(255,111,97,0.85)" bg="rgba(255,111,97,0.25)" />
        </defs>
        {/* the baseline at zero and the line to win */}
        <Ink d={wob(X0, ROW.tilden - 40, X0, ROW.hayes + BH + 40, 'zero', 1.5)} at={pre(c.need) - 6} dur={6} width={4} color={CREAM} />
        <Ink d={wob(LINE_X, 200, LINE_X, 880, 'need', 1.5)} at={pre(c.need)} dur={8} width={4} color={TEAL} dash="14 10" />
        <Bar y={ROW.tilden} v={184} at={pre(c.tilden)} seed="bt" fill="url(#tlBone)" stroke={CREAM} />
        <Bar y={ROW.hayes} v={165} at={pre(c.hayes)} seed="bh" fill="url(#tlBone)" stroke={CREAM} />
        {/* the disputed pile: lifted and carried onto Hayes's bar */}
        {pileOn && (
          <g transform={`translate(${px} ${py}) scale(${pk})`}>
            <rect x={0} y={0} width={20 * U} height={BH} fill="url(#tlCoral)" />
            <path d={roughRect(0, 0, 20 * U, BH, 'pile', 2)} fill="none" stroke={CORAL} strokeWidth={5} strokeLinecap="round" />
          </g>
        )}
      </svg>
      <Pop at={pre(c.need) + 4} x={LINE_X} y={128} center style={{fontFamily: HAND, fontSize: 64, color: TEAL, textShadow: '0 3px 10px rgba(0,0,0,0.8)'}}>185 to win</Pop>
      <Pop at={pre(c.tilden)} x={X0} y={ROW.tilden - 52} style={{fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, color: CREAM}}>TILDEN · DEMOCRAT</Pop>
      <Pop at={pre(c.hayes)} x={X0} y={ROW.hayes - 52} style={{fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, color: CREAM}}>HAYES · REPUBLICAN</Pop>
      {g >= pre(c.tilden) && <div style={{position: 'absolute', left: X0 + tv * U + 46, top: ROW.tilden + 4, fontFamily: JF.display, fontSize: 76, lineHeight: 1, color: CREAM}}>{fmt(tv)}</div>}
      {g >= pre(c.hayes) && <div style={{position: 'absolute', left: X0 + Math.max(hv, docked ? 185 : 0) * U + 46, top: ROW.hayes + 4, fontFamily: JF.display, fontSize: 76, lineHeight: 1,
        color: docked ? CORAL : CREAM}}>{fmt(hv)}</div>}
      <Pop at={pre(c.disputed) + 4} out={slide} x={PILE.x + 20 * U + 40} y={PILE.y + 8} style={{fontFamily: JF.display, fontSize: 76, lineHeight: 1, color: CORAL}}>20</Pop>
      <Pop at={pre(c.disputed) + 8} out={slide} x={PILE.x - 40} y={PILE.y + BH + 22} style={{fontFamily: HAND, fontSize: 52, color: CORAL, textShadow: '0 3px 10px rgba(0,0,0,0.8)'}}>
        disputed: S.C., La., Fla. (and one in Oregon)
      </Pop>
      {[c.need, c.tilden, c.hayes].filter((v) => v >= from).map((v) => <Sfx key={v} at={v} src="sfx/tick.wav" volume={0.32} />)}
      {c.disputed >= from && <Sfx at={c.disputed} src="sfx/page_turn.wav" volume={0.35} />}
      {c.slide !== undefined && <Sfx at={c.slide} src="sfx/whoosh.wav" volume={0.18} />}
      {c.slide !== undefined && <Sfx at={slideEnd} src="sfx/stamp.wav" volume={0.3} />}
    </>
  );
};
