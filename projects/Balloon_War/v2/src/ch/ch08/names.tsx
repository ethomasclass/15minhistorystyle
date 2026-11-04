// The six names, written by hand on a cream paper slip, one at a time as they are said (Elsie first). No faces, no colour.
import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {clamp} from '../../lib/anim';
import {JF, useGFrame} from '../../kit/Kit';

const INKC = '#1d2a28';

/** `names`: [name, frame to start writing]. The slip fades up at `at` and fades out over [out, out + 60]. */
export const NameSlip: React.FC<{names: [string, number][]; at: number; out?: number; x?: number; y?: number; w?: number; footer?: [string, number]}> = ({
  names, at, out = Infinity, x = 660, y = 120, w = 600, footer,
}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  if (f < at) return null;
  const o = interpolate(f, [at, at + 20], [0, 1], clamp) * (out === Infinity ? 1 : interpolate(f, [out, out + 60], [1, 0], clamp));
  const line = 112;
  const h = names.length * line + 120;
  const pts: string[] = [];
  for (let i = 0; i <= 20; i++) pts.push(`${(i / 20) * 100}% ${random(`ns-t${i}`) * 2.2}%`);
  for (let i = 0; i <= 14; i++) pts.push(`${100 - random(`ns-r${i}`) * 1.6}% ${(i / 14) * 100}%`);
  for (let i = 20; i >= 0; i--) pts.push(`${(i / 20) * 100}% ${100 - random(`ns-b${i}`) * 2.2}%`);
  for (let i = 14; i >= 0; i--) pts.push(`${random(`ns-l${i}`) * 1.6}% ${(i / 14) * 100}%`);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, opacity: o, transform: 'rotate(-1.2deg)', filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.8))'}}>
      <div style={{position: 'relative', width: w, height: h, background: '#ebe4d4', clipPath: `polygon(${pts.join(',')})`}}>
        {/* faint ruled lines and a soft grain so it reads as paper */}
        <div style={{position: 'absolute', inset: 0, opacity: 0.35, backgroundImage: 'linear-gradient(rgba(60,90,110,0.35) 1.5px, transparent 1.5px)',
          backgroundSize: `100% ${line}px`, backgroundPosition: `0 ${70 + line * 0.78}px`}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 35%, rgba(255,255,255,0.25) 0%, rgba(120,100,70,0.18) 100%)'}} />
        {names.map(([n, t], i) => {
          const p = interpolate(g, [t, t + 14], [0, 1], clamp);
          if (g < t) return null;
          return (
            <div key={n} style={{position: 'absolute', left: 90 + (i % 2) * 14, top: 50 + i * line, fontFamily: '"Nanum Pen Script", cursive', fontSize: 118, lineHeight: 1,
              color: INKC, whiteSpace: 'nowrap', transform: `rotate(${(random(`nr${i}`) - 0.5) * 3}deg)`, clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`}}>{n}</div>
          );
        })}
      </div>
      {footer && f >= footer[1] && (
        <div style={{position: 'absolute', left: 0, top: h + 34, width: w, textAlign: 'center', fontFamily: JF.mono, fontSize: 24, letterSpacing: 2, color: 'rgba(244,239,230,0.8)',
          textTransform: 'uppercase', opacity: interpolate(f, [footer[1], footer[1] + 10], [0, 1], clamp)}}>{footer[0]}</div>
      )}
    </div>
  );
};
