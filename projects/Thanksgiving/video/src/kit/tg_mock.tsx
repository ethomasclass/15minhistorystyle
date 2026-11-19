// Thanksgiving: the running joke. An orange torn-tape "MOCK" slapped across the fake each time the narration says
// "Mock turtle" (ch4), "Mock aspic" (ch6), "Mock homemade" (ch7). Same tape, same size, same tilt every time so it reads as
// one recurring stamp; it lands ON the word "Mock" (pair it with the stamp sound at 0.3) and then just sits there: no wobble.
import React from 'react';
import {interpolate, random} from 'remotion';
import {clamp} from '../lib/anim';
import {INK, JF, useGFrame} from './Kit';
import {edgeFilter, useMarks} from './tg_desk';

const TAPE = '#FF9F1C';

/** (x, y) is the tape's centre. */
export const MockTape: React.FC<{x: number; y: number; at: number; size?: number; rot?: number; text?: string; seed?: string}> = ({
  x, y, at, size = 132, rot = -9, text = 'MOCK', seed = 'mock',
}) => {
  const g = useGFrame();
  const edge = useMarks().edge; // an ink edge on the coral desk, so the orange still pops
  if (g < at) return null;
  const k = interpolate(g, [at, at + 2.5, at + 5, at + 7.5], [1.7, 0.93, 1.02, 1], clamp);
  const pts: string[] = [];
  const n = 36;
  for (let i = 0; i <= n; i++) pts.push(`${(i / n) * 100}% ${random(`${seed}t${i}`) * 10}%`);
  for (let i = 0; i <= 6; i++) pts.push(`${100 - random(`${seed}r${i}`) * 3}% ${(i / 6) * 100}%`);
  for (let i = n; i >= 0; i--) pts.push(`${(i / n) * 100}% ${100 - random(`${seed}b${i}`) * 10}%`);
  for (let i = 6; i >= 0; i--) pts.push(`${random(`${seed}l${i}`) * 3}% ${(i / 6) * 100}%`);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${k})`, opacity: interpolate(g, [at, at + 2.5], [0.6, 1], clamp),
      filter: `${edgeFilter(edge, 4).trim()} drop-shadow(5px 6px 0 rgba(0,0,0,0.55))`.trim()}}>
      <div style={{position: 'relative', padding: `${size * 0.12}px ${size * 0.42}px ${size * 0.06}px`, background: TAPE, clipPath: `polygon(${pts.join(',')})`}}>
        <div style={{position: 'absolute', inset: 0, opacity: 0.16, background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.9) 0 2px, transparent 2px 9px)'}} />
        <div style={{position: 'relative', fontFamily: JF.display, fontSize: size, lineHeight: 1.05, color: INK, letterSpacing: size * 0.04, whiteSpace: 'nowrap'}}>{text}</div>
      </div>
    </div>
  );
};
