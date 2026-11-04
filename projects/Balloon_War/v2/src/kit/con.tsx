// The Con Card: the video's recurring device (script/SCENES.md, "The Con Card"). A dark slip with six numbered rows, one per
// move of a con. It is never on screen for long: ch 1 shows it empty (the tease), chapters 2/4/5/6 pop it in small at a lower
// corner for 3-4 s as a move is named, and ch 9 shows it full and checks every row off.
//
//   <ConCard x y scale at out? rows={[{n: 1, at}, ...]} checks={[{n, at}]} counter? />
// `rows` fill in their move at `at` (orange, Abril) with the story's example in teal handwriting; rows not listed stay as
// blank rules. Earlier rows can be passed with at: -999 so they show faint (already filled). `checks` tick rows off (ch 9).
import React from 'react';
import {interpolate} from 'remotion';
import {JF, useGFrame} from './Kit';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const TEAL = '#2FE0C4';
const ORANGE = '#FF9F1C';

export const MOVES: {move: string; example: string}[] = [
  {move: 'The bait', example: 'a bag of diamonds'},
  {move: 'Play hard to get', example: 'a secret, a sworn promise'},
  {move: 'Borrowed trust', example: 'Tiffany'},
  {move: 'The proof', example: 'dig it up yourself'},
  {move: 'The rush', example: 'everybody important is in'},
  {move: 'The exit', example: 'get out before it breaks'},
];

export type ConRow = {n: number; at: number; faint?: boolean};
export const ConCard: React.FC<{x: number; y: number; scale?: number; at: number; out?: number; rows?: ConRow[]; checks?: {n: number; at: number}[];
  counter?: boolean; examples?: boolean}> = ({x, y, scale = 1, at, out = Infinity, rows = [], checks = [], counter = true, examples = true}) => {
  const g = useGFrame();
  if (g < at - 1 || g >= out + 6) return null;
  const inK = interpolate(g, [at, at + 5], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const outK = Number.isFinite(out) ? interpolate(g, [out, out + 5], [1, 0], clamp) : 1;
  const k = Math.min(inK, outK);
  const filled = rows.filter((r) => g >= r.at);
  const last = filled.reduce((m, r) => Math.max(m, r.n), 0);
  const W = 620, rowH = 74;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: W, transformOrigin: '0 0',
      transform: `translateY(${(1 - k) * 40}px) scale(${scale}) rotate(-1.5deg)`, opacity: k}}>
      <div style={{background: 'rgba(16,15,12,0.94)', border: `2px solid rgba(47,224,196,0.55)`, borderRadius: 6, padding: '22px 28px 18px',
        boxShadow: '0 26px 50px rgba(0,0,0,0.75)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10}}>
          <div style={{fontFamily: JF.mono, fontSize: 22, letterSpacing: 4, color: TEAL}}>THE SIX MOVES OF A CON</div>
          {counter && last > 0 && <div style={{fontFamily: JF.mono, fontSize: 22, color: ORANGE}}>{last}/6</div>}
        </div>
        {MOVES.map((m, i) => {
          const n = i + 1;
          const r = rows.find((q) => q.n === n);
          const on = r && g >= r.at;
          const w = r ? interpolate(g, [r.at, r.at + 6], [0, 1], clamp) : 0;
          const c = checks.find((q) => q.n === n);
          const ticked = c && g >= c.at;
          return (
            <div key={n} style={{position: 'relative', height: rowH, borderBottom: '1.5px solid rgba(47,224,196,0.28)', display: 'flex', alignItems: 'center', gap: 18}}>
              <div style={{fontFamily: JF.mono, fontSize: 26, color: 'rgba(244,239,230,0.55)', width: 26}}>{n}</div>
              {on && (
                <div style={{opacity: r.faint ? 0.45 : 1, clipPath: `inset(0 ${(1 - w) * 100}% 0 0)`}}>
                  <div style={{fontFamily: JF.display, fontSize: 38, lineHeight: 1, color: ORANGE, whiteSpace: 'nowrap'}}>{m.move}</div>
                  {examples && <div style={{fontFamily: "\"Nanum Pen Script\", cursive", fontSize: 40, lineHeight: 0.95, color: TEAL, whiteSpace: "nowrap", marginTop: 2}}>{m.example}</div>}
                </div>
              )}
              {ticked && <div style={{position: 'absolute', right: 4, top: 14, fontFamily: JF.display, fontSize: 46, color: TEAL,
                transform: `scale(${interpolate(g, [c.at, c.at + 3, c.at + 6], [1.5, 0.9, 1], clamp)})`}}>✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
