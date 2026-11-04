// TODO(3D): LandingMap. Stand-in until builder D's LandingMap lands (src/fx/LandingMap.tsx): a drawn chart of balloons launched
// per month (Mikesh, 1973: Nov 700, Dec 1,200, Jan 2,000, Feb 2,500, Mar 2,500, early Apr 400, then none), a cream pin at
// 5 May for Bly (never coral: ch08 is the quiet chapter), and a bracket for the month the balloon lay in the woods.
// Swap for <LandingMap ... pinColor="cream"> with the date window ending on 5 May when it exists.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../../lib/anim';
import {JF, Note, useGFrame, usePal} from '../../kit/Kit';

const DATA: [string, number][] = [['NOV', 700], ['DEC', 1200], ['JAN', 2000], ['FEB', 2500], ['MAR', 2500], ['APR', 400], ['MAY', 0]];
const X0 = 360;
const STEP = 180;
const BASE = 800;
const MAXH = 460;

/** `at`: bars start growing; `pin`: the Bly pin drops; `month`: the bracket and its note; `gaveUp`: note on April. */
export const Launches: React.FC<{at: number; pin: number; month: number; gaveUp: number}> = ({at, pin, month, gaveUp}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const bx = (i: number) => X0 + i * STEP;
  const pinX = bx(6) + 20; // 5 May sits at the start of the May column
  const aprX = bx(5) + 40;
  const br = interpolate(g, [month, month + 12], [0, 1], clamp);
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={X0 - 40} y1={BASE} x2={bx(6) + 160} y2={BASE} stroke="rgba(244,239,230,0.55)" strokeWidth={3} />
        {DATA.map(([, v], i) => {
          const k = interpolate(f, [at + i * 5, at + i * 5 + 18], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
          const hh = (v / 2500) * MAXH * k;
          return <rect key={i} x={bx(i)} y={BASE - hh} width={110} height={hh} fill="none" stroke={pal.mark} strokeWidth={4} />;
        })}
        {/* the bracket: from the last launches in April to 5 May */}
        {br > 0 && <path d={`M${aprX},${BASE - 150} L${aprX},${BASE - 175} L${aprX + (pinX - aprX) * br},${BASE - 175}${br >= 1 ? ` L${pinX},${BASE - 150}` : ''}`}
          fill="none" stroke="#ece6d8" strokeWidth={4} strokeLinecap="round" />}
      </svg>
      {DATA.map(([m, v], i) => (
        <React.Fragment key={m}>
          <div style={{position: 'absolute', left: bx(i) - 20, top: BASE + 18, width: 150, textAlign: 'center', fontFamily: JF.mono, fontSize: 26, letterSpacing: 2, color: 'rgba(244,239,230,0.8)'}}>{m}</div>
          {f >= at + i * 5 + 18 && v > 0 && <div style={{position: 'absolute', left: bx(i) - 20, top: BASE - (v / 2500) * MAXH - 40, width: 150, textAlign: 'center', fontFamily: JF.mono,
            fontSize: 22, color: 'rgba(244,239,230,0.7)'}}>{v.toLocaleString('en-US')}</div>}
        </React.Fragment>
      ))}
      <div style={{position: 'absolute', left: X0 - 40, top: 150, fontFamily: JF.mono, fontSize: 24, letterSpacing: 2, color: 'rgba(244,239,230,0.75)', textTransform: 'uppercase'}}>
        Balloons launched from Japan, by month, 1944–45
      </div>
      {/* the Bly pin: cream, quiet */}
      {g >= pin && (
        <div style={{position: 'absolute', left: pinX - 14, top: BASE - 28, width: 28, height: 28, borderRadius: '50%', background: '#ece6d8',
          boxShadow: '0 0 0 6px rgba(236,230,216,0.18)', opacity: interpolate(g, [pin, pin + 8], [0, 1], clamp)}} />
      )}
      {g >= pin && <div style={{position: 'absolute', left: pinX + 26, top: BASE - 74, fontFamily: JF.mono, fontSize: 24, letterSpacing: 2, color: '#ece6d8',
        opacity: interpolate(g, [pin, pin + 8], [0, 1], clamp)}}>MAY 5 · BLY</div>}
      <Note text="about a month" x={aprX - 10} y={BASE - 270} size={56} rot={-3} at={month} />
      <Note text="Japan gave up" x={aprX - 60} y={BASE - 420} size={52} rot={-3} at={gaveUp} />
      <div style={{position: 'absolute', left: X0 - 40, top: BASE + 80, fontFamily: JF.mono, fontSize: 16, letterSpacing: 1, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase'}}>
        Launch estimates · Mikesh, Smithsonian, 1973
      </div>
    </>
  );
};
