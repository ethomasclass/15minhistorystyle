// The Irish mischief list (ch02, "Hold onto that list. It's about to cross an ocean."): a cream index card with a tape title and
// three handwritten lines, pinned to the desk. Exported so ch03's callback ("remember those gates off their hinges?") can show the
// very same card: <MischiefList x y lines={MISCHIEF.map((text) => ({text, at: -999}))} pinAt={-999} />.
import React from 'react';
import {interpolate, random} from 'remotion';
import {Highlight, Loop, useGFrame} from '../../kit/Kit';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const MISCHIEF = ['gates off their hinges', 'cabbages thrown at doors', 'chimneys stuffed up'];

/** `at` = the card lands; each line writes on at its own `at`; `pinAt` = the pin goes in and a teal loop draws round the card. */
export const MischiefList: React.FC<{x: number; y: number; w?: number; rot?: number; at?: number; lines: {text: string; at: number; strike?: number}[]; pinAt?: number; loopAt?: number}> = ({
  x, y, w = 860, rot = -2, at = -999, lines, pinAt = 1e7, loopAt = 1e7,
}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 5], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) * (1 - 2.2 * t * (1 - t))});
  const h = 200 + lines.length * 120;
  const pin = interpolate(g, [pinAt, pinAt + 3], [0, 1], clamp);
  const pts: string[] = [];
  for (let i = 0; i <= 18; i++) pts.push(`${(i / 18) * 100}% ${random(`mlt${i}`) * 2.2}%`);
  for (let i = 18; i >= 0; i--) pts.push(`${(i / 18) * 100}% ${100 - random(`mlb${i}`) * 2.2}%`);
  return (
    <>
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg) scale(${0.6 + 0.4 * k})`, opacity: Math.min(1, k * 2),
        filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.65))'}}>
        <div style={{position: 'absolute', inset: 0, background: '#ece6d8', clipPath: `polygon(${pts.join(',')})`}}>
          {/* ruled lines and a red margin, like an index card */}
          <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(40,80,120,0.22) 2px, transparent 2px)', backgroundSize: '100% 120px', backgroundPosition: '0 178px'}} />
          <div style={{position: 'absolute', left: 70, top: 0, bottom: 0, width: 2, background: 'rgba(200,60,50,0.35)'}} />
        </div>
        <Highlight text="MISCHIEF" x={96} y={40} size={84} at={at + 2} seed={71} rot={-2} />
        {lines.map((l, i) => {
          if (g < l.at) return null;
          const p = interpolate(g, [l.at, l.at + 12], [0, 1], clamp);
          const s = l.strike === undefined ? 0 : interpolate(g, [l.strike, l.strike + 6], [0, 1], clamp);
          return (
            <div key={i} style={{position: 'absolute', left: 96, top: 196 + i * 120, fontFamily: '"Nanum Pen Script", cursive', fontSize: 70, lineHeight: 1, color: '#0f3e37', whiteSpace: 'nowrap',
              clipPath: `inset(-30% ${(1 - p) * 100}% -30% -5%)`}}>
              {`${i + 1}. ${l.text}`}
              {s > 0 && <div style={{position: 'absolute', left: 0, top: '52%', height: 5, width: `${s * 100}%`, background: '#FF9F1C'}} />}
            </div>
          );
        })}
        {pin > 0 && (
          <div style={{position: 'absolute', left: w / 2 - 22, top: -18, width: 44, height: 44, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #ff9c8f, #FF6F61 45%, #a8382d 100%)',
            boxShadow: '0 8px 10px rgba(0,0,0,0.6)', transform: `scale(${interpolate(pin, [0, 1], [1.8, 1])})`, opacity: pin}} />
        )}
      </div>
      {g >= loopAt && <Loop cx={x + w / 2} cy={y + h / 2} rx={w / 2 + 70} ry={h / 2 + 60} at={loopAt} width={6} seed={72} tilt={-3} />}
    </>
  );
};
