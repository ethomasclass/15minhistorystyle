// A world map drawn from Natural Earth country shapes (world-atlas), styled for the desk: dark land, faint
// borders, countries that fill in coral or teal on cue, and a camera in longitude/latitude with log-space zoom.
// Use <WorldMap> full frame, or give it x/y/w/h for a small inset (three maps side by side).
import React from 'react';
import {geoNaturalEarth1, geoPath, geoCentroid} from 'd3-geo';
import {feature} from 'topojson-client';
import world from 'world-atlas/countries-50m.json';
import {interpolate, random} from 'remotion';
import {clamp, PAL, FONT} from './look';
import {useGFrame} from './Kit';

type Feat = {id: string; properties: {name: string}; geometry: unknown};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FEATS = (feature(world as any, (world as any).objects.countries) as any).features as Feat[];

/** Base projection: the whole world across a 1920-wide frame. The camera scales and moves it. */
const BASE = geoNaturalEarth1().fitWidth(1920, {type: 'Sphere'} as never);
const PATH = geoPath(BASE);
const SHAPES = FEATS.map((f) => ({id: f.id, name: f.properties.name, d: PATH(f as never) ?? ''}));
const BY_ID: Record<string, Feat> = Object.fromEntries(FEATS.map((f) => [f.id, f]));

export const project = (lon: number, lat: number) => BASE([lon, lat]) as [number, number];
/** Centroid of a country, in [lon, lat]. */
export const centroid = (id: string): [number, number] => geoCentroid(BY_ID[id] as never) as [number, number];

/** ISO numeric ids used in this video. */
export const C = {
  india: '356', nepal: '524', thailand: '764', myanmar: '104', sriLanka: '144', japan: '392', bhutan: '064', china: '156',
  mongolia: '496', laos: '418', cambodia: '116', vietnam: '704', southKorea: '410', taiwan: '158', pakistan: '586',
  bangladesh: '050', mauritius: '480', trinidad: '780', fiji: '242', guyana: '328', canada: '124', uk: '826', usa: '840',
};

/** Places as [lon, lat]. */
export const P = {
  bodhGaya: [84.99, 24.7] as [number, number],
  lhasa: [91.1, 29.65] as [number, number],
  varanasi: [83.0, 25.32] as [number, number],
  amritsar: [74.87, 31.63] as [number, number],
};

/** Camera key: at frame f, centre on (lon, lat) at zoom z (1 = whole world across the frame). */
export type Cam = {f: number; lon: number; lat: number; z: number};

const camAt = (keys: Cam[], f: number) => {
  if (keys.length === 1 || f <= keys[0].f) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (f <= b.f) {
      const raw = (f - a.f) / Math.max(1, b.f - a.f);
      const k = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2; // ease in-out
      return {f, lon: a.lon + (b.lon - a.lon) * k, lat: a.lat + (b.lat - a.lat) * k, z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * k)};
    }
  }
  return keys[keys.length - 1];
};

/** A country fill that fades in on cue. */
export type Fill = {id: string; at: number; color?: string; opacity?: number};
/** Screen-space helper handed to children: [lon, lat] -> [x, y] inside the map's own box. */
export type ToScreen = (ll: [number, number]) => [number, number];

export const WorldMap: React.FC<{
  keys: Cam[]; fills?: Fill[]; x?: number; y?: number; w?: number; h?: number; land?: string; border?: string; frame?: boolean;
  children?: (S: ToScreen, z: number) => React.ReactNode;
}> = ({keys, fills = [], x = 0, y = 0, w = 1920, h = 1080, land = '#2c2822', border = 'rgba(244,239,230,0.22)', frame = false, children}) => {
  const g = useGFrame();
  const cam = camAt(keys, g);
  const [px, py] = project(cam.lon, cam.lat);
  const tx = w / 2 - px * cam.z;
  const ty = h / 2 - py * cam.z;
  const S: ToScreen = ([lon, lat]) => {
    const [a, b] = project(lon, lat);
    return [a * cam.z + tx, b * cam.z + ty];
  };
  const fillOf: Record<string, {o: number; color: string}> = {};
  for (const f of fills) {
    const o = interpolate(g, [f.at, f.at + 8], [0, f.opacity ?? 0.85], clamp);
    if (o > 0) fillOf[f.id] = {o, color: f.color ?? PAL.coral};
  }
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden', borderRadius: frame ? 6 : 0,
      boxShadow: frame ? '0 10px 30px rgba(0,0,0,0.6), 0 0 0 2px rgba(244,239,230,0.25)' : undefined, background: frame ? '#191712' : undefined}}>
      <svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(${tx},${ty}) scale(${cam.z})`}>
          {SHAPES.map((s) => (
            <path key={s.id + s.name} d={s.d} fill={land} stroke={border} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
          ))}
          {SHAPES.filter((s) => fillOf[s.id]).map((s) => (
            <path key={'f' + s.id + s.name} d={s.d} fill={fillOf[s.id].color} fillOpacity={fillOf[s.id].o} stroke={fillOf[s.id].color} strokeOpacity={Math.min(1, fillOf[s.id].o + 0.1)}
              strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      </svg>
      {children?.(S, cam.z)}
    </div>
  );
};

/** A map pin: a dot that pops in with a hand-drawn ring. */
export const Dot: React.FC<{x: number; y: number; at: number; r?: number; color?: string; ring?: boolean}> = ({x, y, at, r = 11, color = PAL.teal, ring = true}) => {
  const g = useGFrame();
  if (g < at) return null;
  const s = interpolate(g, [at, at + 4, at + 7], [0, 1.35, 1], clamp);
  const rp = interpolate(g, [at + 2, at + 12], [0, 1], clamp);
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const a = (i / 38) * Math.PI * 2 * rp - Math.PI / 2;
    const rr = r * 2.3 * (1 + (random(`dot${x}${y}${i}`) - 0.5) * 0.08);
    pts.push(`${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`);
  }
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
      {ring && rp > 0 && <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />}
      <circle cx={x} cy={y} r={r * s} fill={color} stroke="#111" strokeWidth={3} />
    </svg>
  );
};

/** Small mono caps label (country names on maps). */
export const MapLabel: React.FC<{text: string; x: number; y: number; at: number; color?: string; size?: number; align?: 'left' | 'right' | 'center'}> = ({
  text, x, y, at, color = PAL.cream, size = 26, align = 'left',
}) => {
  const g = useGFrame();
  if (g < at) return null;
  const o = interpolate(g, [at, at + 4], [0, 1], clamp);
  const shift = align === 'right' ? '-100%' : align === 'center' ? '-50%' : '0';
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(${shift}, -50%)`, opacity: o, whiteSpace: 'nowrap', fontFamily: FONT.mono, fontSize: size,
      letterSpacing: 2, textTransform: 'uppercase', color, textShadow: '0 2px 8px #000, 0 0 3px #000'}}>{text}</div>
  );
};
