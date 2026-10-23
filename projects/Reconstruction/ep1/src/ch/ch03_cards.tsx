// Chapter 3: drawn pieces. Two teal line-drawn cards, CONGRESS and PRESIDENT (used for "who was in charge", the
// refresher on how a bill becomes law, and again at the end: "one plan … another"); a dashed card for the state that
// tried to leave; ten drawn voters.
import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {JF, useGFrame} from '../kit/Kit';
import {Sfx} from '../kit/common';
import {TEAL} from '../kit/rc';

/** A rough rectangle path (hand-drawn look) for a w x h box. */
const rough = (w: number, h: number, seed: string) => {
  const j = (k: string) => (random(`${seed}${k}`) - 0.5) * 7;
  return `M${j('a')},${j('b')} L${w + j('c')},${j('d')} L${w + j('e')},${h + j('f')} L${j('g')},${h + j('h')} Z M${j('i') - 4},${j('k') + 6} L${w * 0.6},${j('l') - 3}`;
};

/** A teal line-drawn index card with a big name and a small line under it. It draws on from `at`. */
export const BranchCard: React.FC<{name: string; sub: string; x: number; y: number; w?: number; h?: number; at: number; rot?: number; dashed?: boolean; color?: string}> = ({
  name, sub, x, y, w = 470, h = 250, at, rot = 0, dashed = false, color = TEAL,
}) => {
  const g = useGFrame();
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = interpolate(g, [at, at + 8], [0, 1], clamp);
  const o = interpolate(g, [at + 4, at + 9], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg)`}}>
      <div style={{position: 'absolute', inset: 0, background: 'rgba(12,14,13,0.55)'}} />
      <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {dashed
          ? <path d={rough(w, h, name)} fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" strokeDasharray="18 12" opacity={p} />
          : <path d={rough(w, h, name)} fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: h * 0.2, textAlign: 'center', fontFamily: JF.display, fontSize: 72, lineHeight: 1, color, opacity: o, whiteSpace: 'nowrap'}}>{name}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: h * 0.62, textAlign: 'center', fontFamily: JF.mono, fontSize: 26, letterSpacing: 2, color: '#f4efe6', opacity: o, whiteSpace: 'nowrap'}}>{sub}</div>
      <Sfx at={at} src="sfx/tick.wav" volume={0.4} />
    </div>
  );
};

/** A straight hand-drawn arrow with a label above it, drawn on from `at`. */
export const BillArrow: React.FC<{x1: number; x2: number; y: number; at: number; label: string; color?: string; dashed?: boolean}> = ({x1, x2, y, at, label, color = '#f4efe6', dashed}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 8], [0, 1], clamp);
  const xe = x1 + (x2 - x1) * p;
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <path d={`M${x1},${y} Q${(x1 + xe) / 2},${y - 18} ${xe},${y}`} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeDasharray={dashed ? '16 12' : undefined} />
        {p >= 1 && <path d={`M${x2 - 26},${y - 16} L${x2},${y} L${x2 - 26},${y + 16}`} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
      <div style={{position: 'absolute', left: (x1 + x2) / 2 - 150, width: 300, top: y - 70, textAlign: 'center', fontFamily: JF.mono, fontSize: 28, letterSpacing: 2, color,
        opacity: interpolate(g, [at + 4, at + 8], [0, 1], clamp)}}>{label}</div>
    </>
  );
};
