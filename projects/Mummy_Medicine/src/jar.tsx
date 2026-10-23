// The Jar: the video's running motif. One hand-drawn apothecary jar (an albarello) in teal line, boiling at 12 fps,
// whose handwritten label rewrites itself chapter by chapter and whose coral fill rises and falls.
import React from 'react';
import {interpolate, random} from 'remotion';
import {clamp} from './lib/anim';
import {JF, useGFrame, useHand, usePal} from './kit/Kit';

/** One label state: text written on at `at`; `strike` crosses out the previous label first. */
export type JarLabel = {text: string; at: number; color?: string; size?: number; strike?: boolean; small?: string};
/** Fill keyframes: [frame, level 0..1]. */
export type JarFill = [number, number][];

// Outline in a 100 x 150 unit box (lid, rim, waisted body, foot).
const LID = 'M30,24 Q50,8 70,24 L72,28 L28,28 Z';
const KNOB = 'M46,12 Q50,4 54,12';
const RIM = 'M25,30 L75,30 L75,37 L25,37 Z';
const BODY = 'M31,37 C20,44 20,56 25,68 C30,82 30,98 25,112 C21,124 23,130 31,134 L69,134 C77,130 79,124 75,112 C70,98 70,82 75,68 C80,56 80,44 69,37';
const FOOT = 'M31,134 L27,145 L73,145 L69,134';
const INSIDE = 'M32,40 C22,46 22,57 27,68 C32,82 32,98 27,112 C23,123 25,129 32,132 L68,132 C75,129 77,123 73,112 C68,98 68,82 73,68 C78,57 78,46 68,40 Z';

export const Jar: React.FC<{x: number; y: number; h: number; at: number; labels?: JarLabel[]; fill?: JarFill; cobweb?: number; dust?: number; out?: number}> = ({
  x, y, h, at, labels = [], fill = [], cobweb, dust, out = 1e7,
}) => {
  const g = useGFrame();
  const pal = usePal();
  const hand = useHand();
  if (g < at || g >= out) return null;
  const s = h / 150;
  const w = 100 * s;
  const boil = Math.floor(g / 5);
  const jx = (random(`jx${boil}`) - 0.5) * 2.2;
  const jy = (random(`jy${boil}`) - 0.5) * 2.2;
  const draw = interpolate(g, [at, at + 12], [0, 1], clamp);
  const level = fill.length ? interpolate(g, fill.map((f) => f[0]), fill.map((f) => f[1]), clamp) : 0;
  const stroke = {fill: 'none', stroke: pal.mark, strokeWidth: 5 / s, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - draw};
  // current label = the last one whose time has come
  const live = labels.filter((l) => g >= l.at);
  const cur = live[live.length - 1];
  const prev = live[live.length - 2];
  const top = 40 + (1 - level) * 92;
  const dustO = dust !== undefined ? interpolate(g, [dust, dust + 12], [0, 1], clamp) : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={w} height={h} viewBox="0 0 100 150">
        <defs>
          <clipPath id={`jarIn${x}${y}`}><path d={INSIDE} /></clipPath>
        </defs>
        {level > 0.001 && (
          <g clipPath={`url(#jarIn${x}${y})`}>
            <rect x={0} y={top} width={100} height={150} fill={pal.subject} opacity={0.55} />
            <path d={`M18,${top} Q35,${top - 2} 50,${top} T82,${top}`} stroke={pal.subject} strokeWidth={1.4} fill="none" />
          </g>
        )}
        <g transform={`translate(${jx / s} ${jy / s})`}>
          <path d={LID} {...stroke} />
          <path d={KNOB} {...stroke} />
          <path d={RIM} {...stroke} />
          <path d={BODY} {...stroke} />
          <path d={FOOT} {...stroke} />
          {/* label cartouche */}
          <ellipse cx={50} cy={84} rx={21} ry={13} {...stroke} strokeWidth={3 / s} />
          {/* glaze bands */}
          <path d="M24,62 Q50,66 76,62" {...stroke} strokeWidth={2.4 / s} opacity={0.7} />
          <path d="M24,106 Q50,110 76,106" {...stroke} strokeWidth={2.4 / s} opacity={0.7} />
        </g>
        {cobweb !== undefined && g >= cobweb && (
          <g opacity={interpolate(g, [cobweb, cobweb + 10], [0, 0.85], clamp)} stroke="#d8d2c6" strokeWidth={0.7} fill="none">
            {[0, 1, 2, 3].map((i) => <path key={i} d={`M75,30 L${92 + i * 2},${12 - i * 6}`} />)}
            {[0, 1, 2].map((i) => <path key={i} d={`M${79 + i * 4},${24 - i * 4} Q${84 + i * 4},${22 - i * 4} ${84 + i * 3},${16 - i * 6}`} />)}
          </g>
        )}
        {dust !== undefined && dustO > 0 && [...Array(14)].map((_, i) => (
          <circle key={i} cx={22 + random(`d${i}`) * 56} cy={26 + random(`e${i}`) * 112} r={0.7} fill="#e9e2d4" opacity={dustO * 0.6} />
        ))}
      </svg>
      {cur && (
        <Label l={cur} prev={prev} g={g} s={s} hand={hand} mark={pal.mark} />
      )}
    </div>
  );
};

const Label: React.FC<{l: JarLabel; prev?: JarLabel; g: number; s: number; hand: {family: string; scale: number; weight: number}; mark: string}> = ({l, prev, g, s, hand, mark}) => {
  const p = interpolate(g, [l.at + (l.strike ? 6 : 0), l.at + (l.strike ? 16 : 10)], [0, 1], clamp);
  const strikeP = l.strike ? interpolate(g, [l.at, l.at + 5], [0, 1], clamp) : 0;
  const box = {position: 'absolute' as const, left: 25 * s, top: 71 * s, width: 50 * s, height: 26 * s, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center'};
  const font = (sz: number) => ({fontFamily: hand.family, fontWeight: hand.weight, fontSize: sz * s * hand.scale, lineHeight: 0.95, whiteSpace: 'nowrap' as const, textAlign: 'center' as const});
  return (
    <>
      {l.strike && prev && strikeP < 1 + 1e-6 && g < l.at + 6 && (
        <div style={box}>
          <div style={{...font(prev.size ?? 9), color: prev.color ?? mark, position: 'relative'}}>
            {prev.text}
            <div style={{position: 'absolute', left: '-6%', top: '52%', height: 3, width: `${strikeP * 112}%`, background: '#FF9F1C'}} />
          </div>
        </div>
      )}
      {(!l.strike || g >= l.at + 6) && (
        <div style={{...box, clipPath: `inset(-30% ${(1 - p) * 100}% -30% -5%)`}}>
          <div style={{...font(l.size ?? 9), color: l.color ?? mark}}>{l.text}</div>
          {l.small && <div style={{fontFamily: JF.mono, fontSize: 3.2 * s, color: '#e9e2d4', marginTop: 1.5 * s, whiteSpace: 'nowrap'}}>{l.small}</div>}
        </div>
      )}
    </>
  );
};
