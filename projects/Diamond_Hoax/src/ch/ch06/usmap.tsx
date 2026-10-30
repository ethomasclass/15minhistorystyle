// A drawn map of the United States on the desk (ch06 "Arnold went home to Kentucky, a rich man. Slack just disappeared."):
// teal coastlines on a dark land fill (Natural Earth land, the coast file fx/MoneyMap uses), Mercator, no borders.
// Pins for San Francisco and Elizabethtown, Kentucky (Arnold's home), an orange dashed route that draws on, Arnold's silhouette
// riding it and shrinking away; Slack's silhouette left behind at San Francisco, fading to nothing.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import coast from '../../fx/moneymap/coast.json';
import {clamp} from '../../lib/anim';
import {JF, useGFrame} from '../../kit/Kit';
import {DarkPaper} from '../../kit/common';
import {Figure} from './parts';

const TEAL = '#2FE0C4';
const ORANGE = '#FF9F1C';
const C = coast as {rings: number[][][]};
const merc = (lat: number) => (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI;
// screen = (lon - LON0) * K + 960, (MERC0 - merc(lat)) * K + 560
const K = 26, LON0 = -98, MERC0 = merc(37.6);
export const usPt = (lon: number, lat: number): [number, number] => [(lon - LON0) * K + 960, (MERC0 - merc(lat)) * K + 560];

const LAND = C.rings
  .filter((r) => r.some(([lon, lat]) => lon < -50 && lat < 60 && lat > 10))
  .map((r) => r.map(([lon, lat]) => usPt(lon, lat).map((v) => v.toFixed(1)).join(',')).join(' '));

const SF = usPt(-122.42, 37.77);
const KY = usPt(-85.86, 37.69);
const CTRL: [number, number] = [(SF[0] + KY[0]) / 2, Math.min(SF[1], KY[1]) - 230];
const bez = (u: number): [number, number] => [
  (1 - u) ** 2 * SF[0] + 2 * (1 - u) * u * CTRL[0] + u * u * KY[0],
  (1 - u) ** 2 * SF[1] + 2 * (1 - u) * u * CTRL[1] + u * u * KY[1],
];

const Pin: React.FC<{p: [number, number]; at: number; label: string; sub?: string; dx?: number; dy?: number; g: number}> = ({p, at, label, sub, dx = 0, dy = 28, g}) => {
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [1.6, 0.9, 1], clamp);
  return (
    <>
      <div style={{position: 'absolute', left: p[0] - 11, top: p[1] - 11, width: 22, height: 22, borderRadius: '50%', background: TEAL, transform: `scale(${k})`,
        boxShadow: '0 0 0 5px rgba(13,12,9,0.8), 0 6px 14px rgba(0,0,0,0.8)'}} />
      <div style={{position: 'absolute', left: p[0] + dx, top: p[1] + dy, transform: 'translateX(-50%)', fontFamily: JF.mono, fontSize: 22, letterSpacing: 4, color: '#F4EFE6',
        whiteSpace: 'nowrap', textAlign: 'center', textShadow: '0 2px 8px #000', background: 'rgba(7,9,8,0.6)', padding: '3px 10px', borderRadius: 4}}>
        {label}{sub && <div style={{fontSize: 15, letterSpacing: 2, opacity: 0.75}}>{sub}</div>}
      </div>
    </>
  );
};

/** Frames are the scene's own (parent Sequence time). */
export const HomeMap: React.FC<{goAt: number; arriveAt: number; goneAt: number}> = ({goAt, arriveAt, goneAt}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  // one camera move: a slow push in toward the middle of the route
  const z = interpolate(f, [0, 280], [1, 1.07], {...clamp, easing: Easing.inOut(Easing.sin)});
  const u = interpolate(g, [goAt, arriveAt], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const draw = interpolate(g, [goAt, arriveAt], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const [ax, ay] = bez(u);
  const ah = interpolate(u, [0, 1], [230, 120]);
  const slackFade = interpolate(f, [goneAt, goneAt + 26], [1, 0], clamp) * (f >= goneAt && f < goneAt + 26 ? 0.75 + 0.25 * Math.sin(f * 1.7) : 1);
  const pts = Array.from({length: 41}, (_, i) => bez(i / 40));
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '900px 520px'}}>
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          {LAND.map((p, i) => <polygon key={i} points={p} fill="#1f1c16" stroke={TEAL} strokeWidth={2.2} strokeOpacity={0.85} strokeLinejoin="round" />)}
          {/* the route, dashed, drawn on: a dashed path clipped by a growing solid mask */}
          <defs>
            <mask id="routeMask"><path d={d} fill="none" stroke="#fff" strokeWidth={14} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} /></mask>
          </defs>
          <path d={d} fill="none" stroke={ORANGE} strokeWidth={6} strokeDasharray="18 14" strokeLinecap="round" mask="url(#routeMask)" />
        </svg>
        <Pin p={SF} at={0} label="SAN FRANCISCO" g={g} dy={30} />
        <Pin p={KY} at={arriveAt - 4} label="KENTUCKY" sub="ELIZABETHTOWN" g={g} dy={30} />
        <Figure who="slack" x={SF[0] + 70} y={SF[1] - 26} h={230} at={0} fade={slackFade} label="SLACK" labelSize={16} glow={0.9} />
        <Figure who="arnold" x={ax - 70 * (1 - Math.min(1, u * 4))} y={ay - 50} h={ah} at={0} label="ARNOLD" labelSize={16} glow={0.9} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
