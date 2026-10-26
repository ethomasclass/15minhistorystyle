// The Pacific map (Natural Earth coastlines, public domain) and the jet stream as visible wind, shared by ch04 and ch05.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp} from './lib/anim';
import {Note, useGFrame} from './kit/Kit';
import {along, resample, type P} from './draw';
import {CORAL, ORANGE} from './bw';
import {LAND, proj} from './pacific';

const TEAL = '#2FE0C4';

// The jet stream's path, Japan to North America (lon, lat): a broad arc north of Hawaii.
export const JET: P[] = resample(([[136, 35], [150, 38], [165, 42], [180, 45], [195, 46], [210, 46], [225, 45], [236, 44], [248, 43], [262, 42], [280, 41]] as P[]).map(([lo, la]) => proj(lo, la)), 200);

/** The map: land in dark teal with a bright coast, drawn on from `at`. */
export const Map: React.FC<{at: number; dim?: number; children?: React.ReactNode}> = ({at, dim = 0, children}) => {
  const g = useGFrame();
  const o = interpolate(g, [at, at + 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#0d1213'}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: o}}>
        <path d={LAND} fill="#18454A" stroke={TEAL} strokeWidth={1.6} strokeOpacity={0.7} />
      </svg>
      <Note text="JAPAN" x={150} y={680} size={40} rot={-3} at={at + 6} color="#ffffff" />
      <Note text="NORTH AMERICA" x={1280} y={330} size={44} rot={-3} at={at + 8} color="#ffffff" />
      <Note text="Pacific Ocean" x={640} y={760} size={40} rot={-3} at={at + 10} color="#9CC9C4" />
      {children}
      {dim > 0 && <AbsoluteFill style={{background: `rgba(8,8,8,${dim})`}} />}
    </AbsoluteFill>
  );
};

/** Wind you can see: streaks flowing west to east along the jet stream, and an optional balloon riding them. */
export const Wind: React.FC<{at: number; rider?: number; plane?: number}> = ({at, rider, plane}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = Math.min(1, (f - at) / 20);
  const streaks = [...Array(120)].map((_, i) => {
    const r1 = (Math.sin(i * 12.9898) * 43758.5453) % 1, r2 = (Math.sin(i * 78.233) * 12345.678) % 1;
    const u = (((Math.abs(r1) + (f - at) * (0.0016 + 0.0012 * Math.abs(r2))) % 1) + 1) % 1;
    const off = (Math.abs(r2) - 0.5) * 120;
    const a = along(JET, u), b = along(JET, Math.min(1, u + 0.03 + 0.02 * Math.abs(r1)));
    return {a, b, off, o: Math.sin(Math.PI * u) * k};
  });
  let ride: React.ReactNode = null;
  if (rider !== undefined && f >= rider) {
    const u = Math.min(0.97, (f - rider) * 0.0042);
    const [x, y] = along(JET, u);
    const bob = Math.sin((f - rider) / 9) * 14;
    ride = (
      <g transform={`translate(${x} ${y - 40 + bob})`}>
        <circle r={22} fill="#EDE7DC" />
        <path d="M-16,12 L0,44 L16,12" stroke="#EDE7DC" strokeWidth={2} fill="none" />
        <circle cy={48} r={6} fill={CORAL} />
      </g>
    );
  }
  let jet: React.ReactNode = null;
  if (plane !== undefined && f >= plane) {
    const u = interpolate(f, [plane, plane + 70], [0, 1], clamp);
    const x0 = proj(-122, 37.6), x1 = proj(-74, 40.7);
    const x = x0[0] + (x1[0] - x0[0]) * u, y = x0[1] + (x1[1] - x0[1]) * u - Math.sin(Math.PI * u) * 60;
    jet = <text x={x} y={y} fontSize={44} textAnchor="middle" fill={ORANGE}>✈</text>;
  }
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      {streaks.map((s, i) => <path key={i} d={`M${s.a[0]},${s.a[1] + s.off} L${s.b[0]},${s.b[1] + s.off}`} stroke={TEAL} strokeWidth={3} strokeLinecap="round" opacity={0.75 * s.o} />)}
      {ride}
      {jet}
    </svg>
  );
};

