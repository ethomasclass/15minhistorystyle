// The tilted map: our own drawn map (tools/build_map.py → public/maps/<name>.json) laid on a plane seen in 3D
// perspective. The camera glides, tilts and turns; regions rise off the paper as slabs with real sides and a shadow;
// borders draw on with their names running along them; labels, pins and notes stand up and face the camera.
// Everything is SVG, re-drawn at screen resolution every frame (the zoom happens in the SVG viewBox, only the tilt is
// a CSS 3D transform), so it stays sharp at any zoom.
//
// Pieces (all take `api` from <Map3D>'s children):
//   Slab        a region or state rising as a block (optionally hatched, sliding, sinking)
//   Fill        a region flat on the paper (tint or hatch)
//   Border      a border drawn on, solid or dashed, with ticks, a glow and its name along it (river claims, treaty lines)
//   PathText    a name running along any path
//   Glow        a river lit up
//   Route       a journey arrow;  Flow  many small arrows streaming from one place to another
//   MovingBorder a border sliding from one line to another (the 1848 border passing over the towns)
//   Dot         a town dot on the paper;  Stand  anything standing up off the map (Pin3, PlaceTag, RegionName, Hand,
//               Flag3, Stake)
//   StateTiles  a group of states rising one after another
import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {JF, useGFrame, usePal} from './Kit';

export type MapData = {
  size: [number, number];
  land: string; landMain: string; lakes: string;
  rivers: Record<string, string>; regions: Record<string, string>; lines: Record<string, string>;
  states: Record<string, string>; places: Record<string, [number, number]>;
  polylines: Record<string, number[][]>; nations: Record<string, [number, number]>;
};

/** Camera: map point (x, y) at screen centre, `z` screen pixels per map pixel, `tilt` and `rot` in degrees. */
export type Cam3 = {f: number; x: number; y: number; z: number; tilt: number; rot: number};

export const cam3At = (keys: Cam3[], frame: number): Cam3 => {
  if (frame <= keys[0].f) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame <= b.f) {
      const t = Easing.inOut(Easing.cubic)((frame - a.f) / Math.max(1, b.f - a.f));
      const lerp = (p: number, q: number) => p + (q - p) * t;
      return {f: frame, x: lerp(a.x, b.x), y: lerp(a.y, b.y), z: Math.exp(lerp(Math.log(a.z), Math.log(b.z))), tilt: lerp(a.tilt, b.tilt), rot: lerp(a.rot, b.rot)};
    }
  }
  return keys[keys.length - 1];
};

// the plane is much bigger than the screen so a tilted view never shows its edge
const PW = 1920 * 3;
const PH = 1080 * 5;

/** Map style: bone paper land, ink sea with engraved lines, slate rivers. Claim colours: Mexico teal, Texas/U.S. orange. */
export const MAP3D = {
  sea: '#121416', seaLine: 'rgba(237,231,220,0.05)', land: '#d9d1c1', landEdge: '#2a2723', halo: 'rgba(237,231,220,0.10)',
  river: '#6f8790', lake: '#3b474d', state: 'rgba(42,39,35,0.35)', fog: '#0b0c0d',
  mexico: '#2FE0C4', us: '#FF9F1C', ink: '#1b1915', slave: '#7a2f2a', free: '#e9e3d6', grey: '#8d877c',
};

export type Api = {
  /** map pixel -> plane pixel */
  P: (x: number, y: number) => [number, number];
  cam: Cam3;
  data: MapData;
};

let seq = 0;
const useId = (p: string) => React.useState(() => `${p}${seq++}`)[0];

const ptsOf = (d: string) => [...d.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map((m) => [+m[1], +m[2]]);

const boundsCache = new Map<string, [number, number, number, number]>();
/** Bounding box of an SVG path's coordinates (map pixels). */
export const pathBounds = (d: string): [number, number, number, number] => {
  const hit = boundsCache.get(d);
  if (hit) return hit;
  let x0 = 1e9, y0 = 1e9, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of ptsOf(d)) {
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  const b: [number, number, number, number] = [x0, y0, x1, y1];
  boundsCache.set(d, b);
  return b;
};

/** Centre of a path's bounding box (map pixels). */
export const centreOf = (d: string): [number, number] => {
  const [x0, y0, x1, y1] = pathBounds(d);
  return [(x0 + x1) / 2, (y0 + y1) / 2];
};

/** A smooth, left-to-right version of a wiggly line (for text to run along). */
export const smoothPath = (d: string, step = 10, from = 0, to = 1) => {
  let p = ptsOf(d);
  p = p.slice(Math.floor(p.length * from), Math.max(2, Math.ceil(p.length * to)));
  if (p[0][0] > p[p.length - 1][0]) p = p.reverse();
  const q = p.filter((_, i) => i % step === 0 || i === p.length - 1);
  if (q.length < 3) return `M${q[0][0]},${q[0][1]} L${q[q.length - 1][0]},${q[q.length - 1][1]}`;
  const mid = (a: number[], b: number[]) => `${(a[0] + b[0]) / 2},${(a[1] + b[1]) / 2}`;
  let s = `M${q[0][0]},${q[0][1]} L${mid(q[0], q[1])}`;
  for (let i = 1; i < q.length - 1; i++) s += ` Q${q[i][0]},${q[i][1]} ${mid(q[i], q[i + 1])}`;
  return s + ` L${q[q.length - 1][0]},${q[q.length - 1][1]}`;
};

/** Points of a polyline resampled to n points evenly by length. */
const resample = (pts: number[][], n: number) => {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  const out: number[][] = [];
  let i = 0, acc = 0;
  for (let k = 0; k < n; k++) {
    const t = (total * k) / (n - 1);
    while (i < seg.length - 1 && acc + seg[i] < t) acc += seg[i++];
    const f = seg[i] ? (t - acc) / seg[i] : 0;
    out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]);
  }
  return out;
};

/**
 * The map scene. `children(api)` renders overlays in plane space; use `api.P(x, y)` to place things by map pixel and
 * `data.places.<name>` for named places. `states` (0..1) shows today's state lines; `rivers` (0..1) the river network.
 */
export const Map3D: React.FC<{data: MapData; keys: Cam3[]; states?: number; rivers?: number; children?: (api: Api) => React.ReactNode}> = ({
  data, keys, states = 0, rivers = 1, children,
}) => {
  const frame = useCurrentFrame();
  const cam = cam3At(keys, frame);
  const vw = PW / cam.z;
  const vh = PH / cam.z;
  const vb = `${cam.x - vw / 2} ${cam.y - vh / 2} ${vw} ${vh}`;
  const P = (x: number, y: number): [number, number] => [(x - cam.x) * cam.z + PW / 2, (y - cam.y) * cam.z + PH / 2];
  const line = (w: number) => w / cam.z;    // a stroke of w screen pixels, in map units
  return (
    <AbsoluteFill style={{background: MAP3D.fog, overflow: 'hidden', perspective: 2000, perspectiveOrigin: '50% 42%'}}>
      <div style={{position: 'absolute', left: 960 - PW / 2, top: 540 - PH / 2, width: PW, height: PH, transformStyle: 'preserve-3d',
        transform: `rotateX(${cam.tilt}deg) rotateZ(${cam.rot}deg)`, transformOrigin: '50% 50%'}}>
        <svg width={PW} height={PH} viewBox={vb} style={{position: 'absolute', left: 0, top: 0}}>
          <defs>
            <pattern id="m3-sea" width={line(9)} height={line(9)} patternUnits="userSpaceOnUse">
              <rect width={line(9)} height={line(9)} fill={MAP3D.sea} />
              <line x1={0} y1={line(4.5)} x2={line(9)} y2={line(4.5)} stroke={MAP3D.seaLine} strokeWidth={line(1.2)} />
            </pattern>
            {/* one copy of the coastline for every slab and fill to clip against (url(#m3-land) works across the page) */}
            <clipPath id="m3-land" clipPathUnits="userSpaceOnUse"><path d={data.land} /></clipPath>
            <clipPath id="m3-main" clipPathUnits="userSpaceOnUse"><path d={data.landMain} /></clipPath>
          </defs>
          <rect x={cam.x - vw} y={cam.y - vh} width={vw * 2} height={vh * 2} fill="url(#m3-sea)" />
          {/* engraved water lines hugging the coast */}
          {[26, 14].map((w, i) => <path key={i} d={data.land} fill="none" stroke={MAP3D.halo} strokeWidth={line(w)} strokeLinejoin="round" opacity={0.6 - i * 0.2} />)}
          <path d={data.land} fill={MAP3D.land} stroke={MAP3D.landEdge} strokeWidth={line(1.6)} strokeLinejoin="round" />
          <path d={data.lakes} fill={MAP3D.lake} />
          {states > 0 && Object.values(data.states).map((d, i) => <path key={i} d={d} fill="none" stroke={MAP3D.state} strokeWidth={line(1.3)} opacity={states} />)}
          {rivers > 0 && Object.entries(data.rivers).map(([k, d]) => <path key={k} d={d} fill="none" stroke={MAP3D.river} strokeWidth={line(1.6)} strokeLinecap="round" opacity={rivers} />)}
        </svg>
        {/* soft light falling across the plane */}
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 55%, rgba(255,250,240,0.10) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.35) 75%)'}} />
        {children?.({P, cam, data})}
      </div>
      {/* fog toward the horizon, the Vox depth cue */}
      <AbsoluteFill style={{background: `linear-gradient(to bottom, ${MAP3D.fog} 0%, rgba(11,12,13,0.85) 12%, rgba(11,12,13,0) 38%)`, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

/** An SVG layer covering a map-pixel box, placed in plane space (optionally lifted to height z). */
const Layer: React.FC<{api: Api; box: [number, number, number, number]; z?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({api, box, z = 0, style, children}) => {
  const pad = 60 / api.cam.z;
  const [x0, y0, x1, y1] = [box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad];
  const [l, t] = api.P(x0, y0);
  return (
    <svg width={(x1 - x0) * api.cam.z} height={(y1 - y0) * api.cam.z} viewBox={`${x0} ${y0} ${x1 - x0} ${y1 - y0}`}
      style={{position: 'absolute', left: l, top: t, transform: `translateZ(${z}px)`, overflow: 'visible', ...style}}>
      {children}
    </svg>
  );
};

export const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (s: number) => Math.min(255, Math.round(((n >> s) & 255) * k)).toString(16).padStart(2, '0');
  return `#${c(16)}${c(8)}${c(0)}`;
};

/** Diagonal hatching (disputed land), drawn in map units so it stays a constant screen width. */
const Hatch: React.FC<{id: string; api: Api; color: string; gap?: number; width?: number}> = ({id, api, color, gap = 16, width = 4}) => {
  const g = gap / api.cam.z;
  return (
    <pattern id={id} width={g} height={g} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1={0} y1={0} x2={0} y2={g} stroke={color} strokeWidth={width / api.cam.z} />
    </pattern>
  );
};

/**
 * A region (or any path `d`) rising off the map as a slab: sides, top face, rim and a cast shadow. Clipped to the
 * coastline unless `clipLand` is false. `h` is the full height in pixels; it rises over `dur` frames from `at`, and
 * sinks back from `fall`. `hatch` lays disputed-land hatching on the top face. `slide` moves the whole slab (map
 * pixels) from `slide.at` over `slide.dur` frames, lifting it a little as it goes.
 */
export const Slab: React.FC<{api: Api; region?: string; d?: string; at: number; h?: number; dur?: number; color?: string; rim?: string; fall?: number;
  layers?: number; clipLand?: boolean; hatch?: string; opacity?: number; slide?: {at: number; dur?: number; dx: number; dy: number; lift?: number}}> = ({
  api, region, d: dIn, at, h = 60, dur = 14, color, rim, fall = 1e9, layers = 12, clipLand, hatch, opacity = 1, slide,
}) => {
  const g = useCurrentFrame();
  const pal = usePal();
  const hid = useId('m3h');
  if (g < at) return null;
  const ease = {...clamp, easing: Easing.out(Easing.back(1.4))};
  const up = fall < 1e9 ? interpolate(g, [at, at + dur, fall, fall + dur], [0, 1, 1, 0], ease) : interpolate(g, [at, at + dur], [0, 1], ease);
  if (up <= 0 && g > at) return null;
  const H = h * up;
  const d = dIn ?? api.data.regions[region!];
  const clip = (clipLand ?? !dIn) ? 'url(#m3-main)' : undefined;
  const box = pathBounds(d);
  const c = color ?? pal.subject;
  const line = (w: number) => w / api.cam.z;
  const sp = slide ? interpolate(g, [slide.at, slide.at + (slide.dur ?? 30)], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)}) : 0;
  const [ox, oy] = slide ? [slide.dx * sp * api.cam.z, slide.dy * sp * api.cam.z] : [0, 0];
  const oz = slide ? (slide.lift ?? h) * Math.sin(Math.PI * Math.min(1, sp * 1.2)) * 0.8 + (slide.lift ?? h) * 0.3 * sp : 0;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d', transform: `translate3d(${ox}px, ${oy}px, ${oz}px)`, opacity}}>
      {/* cast shadow on the paper */}
      <Layer api={api} box={box} z={-oz} style={{filter: `blur(${4 + (H + oz) * 0.25}px)`, opacity: 0.5 * Math.min(1, up * 1.5)}}>
        <g clipPath={clip} transform={`translate(${line((H + oz) * 0.35)},${line((H + oz) * 0.5)})`}><path d={d} fill="#000" /></g>
      </Layer>
      {/* sides: stacked copies, darker toward the base */}
      {Array.from({length: layers}, (_, i) => (
        <Layer key={i} api={api} box={box} z={(H * i) / layers}>
          <g clipPath={clip}><path d={d} fill={shade(c, 0.45 + 0.25 * (i / layers))} /></g>
        </Layer>
      ))}
      {/* top face with a bright rim */}
      <Layer api={api} box={box} z={H}>
        {hatch && <defs><Hatch id={hid} api={api} color={hatch} /></defs>}
        <g clipPath={clip}>
          <path d={d} fill={c} />
          {hatch && <path d={d} fill={`url(#${hid})`} />}
          <path d={d} fill="none" stroke={rim ?? shade(c, 1.15)} strokeWidth={line(3)} strokeLinejoin="round" />
        </g>
      </Layer>
    </div>
  );
};

/** A region flat on the paper: a tint, hatching, or both. Fades in at `at`, out at `out`. */
export const Fill: React.FC<{api: Api; region?: string; d?: string; at: number; out?: number; color?: string; opacity?: number; hatch?: string; outline?: string; clipLand?: boolean}> = ({
  api, region, d: dIn, at, out = 1e9, color, opacity = 0.55, hatch, outline, clipLand,
}) => {
  const g = useGFrame();
  const hid = useId('m3f');
  if (g < at || g >= out + 8) return null;
  const k = interpolate(g, [at, at + 8, out, out + 8], [0, 1, 1, 0], clamp);
  const d = dIn ?? api.data.regions[region!];
  const clip = (clipLand ?? !dIn) ? 'url(#m3-land)' : undefined;
  return (
    <Layer api={api} box={pathBounds(d)} z={0.5}>
      {hatch && <defs><Hatch id={hid} api={api} color={hatch} /></defs>}
      <g clipPath={clip} opacity={k}>
        {color && <path d={d} fill={color} opacity={opacity} />}
        {hatch && <path d={d} fill={`url(#${hid})`} />}
        {outline && <path d={d} fill="none" stroke={outline} strokeWidth={3 / api.cam.z} strokeDasharray={`${10 / api.cam.z} ${8 / api.cam.z}`} />}
      </g>
    </Layer>
  );
};

/** A name running along a path, in mono caps on the paper (it reads in perspective, like a printed map). */
export const PathText: React.FC<{api: Api; d: string; text: string; at: number; out?: number; size?: number; color?: string; offset?: string; dy?: number; step?: number; from?: number; to?: number; z?: number}> = ({
  api, d, text, at, out = 1e9, size = 26, color = '#f4efe6', offset = '50%', dy = -14, step = 10, from = 0, to = 1, z = 2,
}) => {
  const g = useGFrame();
  const id = useId('m3t');
  if (g < at || g >= out + 6) return null;
  const k = Math.min(interpolate(g, [at, at + 6], [0, 1], clamp), interpolate(g, [out, out + 6], [1, 0], clamp));
  const sp = smoothPath(d, step, from, to);
  const fs = size / api.cam.z;
  return (
    <Layer api={api} box={pathBounds(d)} z={z}>
      <defs><path id={id} d={sp} /></defs>
      <text fontFamily={JF.mono} fontSize={fs} letterSpacing={fs * 0.18} fill={color} stroke="rgba(10,10,10,0.85)" strokeWidth={fs * 0.28} paintOrder="stroke"
        strokeLinejoin="round" dy={dy / api.cam.z} opacity={k} textAnchor="middle">
        <textPath href={`#${id}`} startOffset={offset}>{text.toUpperCase()}</textPath>
      </text>
    </Layer>
  );
};

/**
 * A border drawn on: solid (an agreed border) or dashed (a claim), with border ticks, a glow and, optionally, its name
 * running along it. Used for every river border: the Nueces vs. Rio Grande claims, the 1819 line, the 1848 line.
 */
export const Border: React.FC<{api: Api; d: string; at: number; dur?: number; color?: string; width?: number; dashed?: boolean; ticks?: boolean;
  label?: string; labelAt?: number; labelOut?: number; labelSize?: number; labelOffset?: string; labelDy?: number; labelFrom?: number; labelTo?: number; out?: number; z?: number}> = ({
  api, d, at, dur = 22, color, width = 6, dashed = false, ticks = true, label, labelAt, labelOut, labelSize = 26, labelOffset = '50%', labelDy = -16, labelFrom, labelTo, out = 1e9, z = 2,
}) => {
  const g = useGFrame();
  const pal = usePal();
  const mid = useId('m3m');
  if (g < at || g >= out + 8) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const fade = interpolate(g, [out, out + 8], [1, 0], clamp);
  const c = color ?? pal.mark;
  const line = (w: number) => w / api.cam.z;
  const tick = interpolate(g, [at + dur, at + dur + 6], [0, 1], clamp);
  return (
    <>
      <Layer api={api} box={pathBounds(d)} z={z}>
        <defs>
          {/* reveal mask: the line draws on even when it is dashed */}
          <mask id={mid} maskUnits="userSpaceOnUse" x={-1e5} y={-1e5} width={2e5} height={2e5}>
            <path d={d} fill="none" stroke="#fff" strokeWidth={line(width * 8)} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
          </mask>
        </defs>
        <g mask={`url(#${mid})`} opacity={fade}>
          <path d={d} fill="none" stroke={c} strokeOpacity={0.28} strokeWidth={line(width * 3.2)} strokeLinecap="round" strokeLinejoin="round" style={{filter: `blur(${width}px)`}} />
          <path d={d} fill="none" stroke="#0b0b0b" strokeOpacity={0.55} strokeWidth={line(width + 4)} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={dashed ? `${line(22)} ${line(12)}` : undefined} />
          <path d={d} fill="none" stroke={c} strokeWidth={line(width)} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? `${line(22)} ${line(12)}` : undefined} />
          {ticks && <path d={d} fill="none" stroke={c} strokeWidth={line(width * 2.8)} strokeDasharray={`${line(2.5)} ${line(18)}`} opacity={tick} />}
        </g>
      </Layer>
      {label && <PathText api={api} d={d} text={label} at={labelAt ?? at + Math.round(dur * 0.6)} out={labelOut ?? out} size={labelSize} color={c} offset={labelOffset} dy={labelDy} from={labelFrom} to={labelTo} z={z + 1} />}
    </>
  );
};

/** A river or line lit up and drawn on over `dur` frames. */
export const Glow: React.FC<{api: Api; d: string; at: number; dur?: number; color?: string; width?: number; z?: number}> = ({api, d, at, dur = 18, color, width = 6, z = 1}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  const line = (w: number) => w / api.cam.z;
  const c = color ?? pal.mark;
  return (
    <Layer api={api} box={pathBounds(d)} z={z}>
      <path d={d} fill="none" stroke={c} strokeWidth={line(width * 3)} strokeOpacity={0.25} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} style={{filter: `blur(${width}px)`}} />
      <path d={d} fill="none" stroke={c} strokeWidth={line(width)} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </Layer>
  );
};

const curve = (pts: number[][], bow: number) => {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    d += ` Q${(ax + bx) / 2 - (by - ay) * bow},${(ay + by) / 2 + (bx - ax) * bow} ${bx},${by}`;
  }
  return d;
};

/** A route arrow (map pixel points) drawn on, with a head; lifted slightly off the map. `dashed` for a sea voyage. */
export const Route: React.FC<{api: Api; pts: number[][]; at: number; dur?: number; color?: string; width?: number; bow?: number; dashed?: boolean; out?: number}> = ({
  api, pts, at, dur = 24, color, width = 7, bow = 0.18, dashed = false, out = 1e9,
}) => {
  const g = useGFrame();
  const pal = usePal();
  const mid = useId('m3r');
  if (g < at || g >= out + 8) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const fade = interpolate(g, [out, out + 8], [1, 0], clamp);
  const line = (w: number) => w / api.cam.z;
  const c = color ?? pal.mark;
  const d = curve(pts, bow);
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  const box: [number, number, number, number] = [Math.min(...xs) - 200, Math.min(...ys) - 200, Math.max(...xs) + 200, Math.max(...ys) + 200];
  const [ex, ey] = pts[pts.length - 1];
  const [qx, qy] = pts[pts.length - 2];
  const ang = Math.atan2(ey - qy, ex - qx);
  const hl = line(34);
  const dash = dashed ? `${line(16)} ${line(12)}` : undefined;
  return (
    <Layer api={api} box={box} z={4}>
      <defs>
        <mask id={mid} maskUnits="userSpaceOnUse" x={-1e5} y={-1e5} width={2e5} height={2e5}>
          <path d={d} fill="none" stroke="#fff" strokeWidth={line(width * 6)} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        </mask>
      </defs>
      <g opacity={fade}>
        <g mask={`url(#${mid})`}>
          <path d={d} fill="none" stroke="#000" strokeOpacity={0.35} strokeWidth={line(width + 6)} strokeLinecap="round" strokeDasharray={dash} transform={`translate(${line(6)},${line(8)})`} />
          <path d={d} fill="none" stroke={c} strokeWidth={line(width)} strokeLinecap="round" strokeDasharray={dash} />
        </g>
        {p >= 1 && <path d={`M${ex},${ey} L${ex - hl * Math.cos(ang - 0.45)},${ey - hl * Math.sin(ang - 0.45)} L${ex - hl * Math.cos(ang + 0.45)},${ey - hl * Math.sin(ang + 0.45)} Z`} fill={c} />}
      </g>
    </Layer>
  );
};

/**
 * Many small arrows streaming from around `from` to around `to` (map pixels), Vox-style: people, settlers, power.
 * Streaks travel the curves on a loop between `at` and `out`. `spread` scatters start and end points.
 */
export const Flow: React.FC<{api: Api; from: number[]; to: number[]; at: number; out?: number; n?: number; spread?: number; toSpread?: number; color?: string; period?: number; seed?: string; bow?: number}> = ({
  api, from, to, at, out = 1e9, n = 18, spread = 120, toSpread, color, period = 36, seed = 'flow', bow = 0.12,
}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at || g >= out + 10) return null;
  const k = interpolate(g, [at, at + 8, out, out + 10], [0, 1, 1, 0], clamp);
  const c = color ?? pal.mark;
  const line = (w: number) => w / api.cam.z;
  const ts = toSpread ?? spread * 0.6;
  const arrows = Array.from({length: n}, (_, i) => {
    const a = [from[0] + (random(`${seed}a${i}`) - 0.5) * 2 * spread, from[1] + (random(`${seed}b${i}`) - 0.5) * 2 * spread];
    const b = [to[0] + (random(`${seed}c${i}`) - 0.5) * 2 * ts, to[1] + (random(`${seed}d${i}`) - 0.5) * 2 * ts];
    const ph = (((g - at) / period + random(`${seed}p${i}`)) % 1 + 1) % 1;
    return {d: curve([a, b], bow * (random(`${seed}w${i}`) - 0.3)), ph};
  });
  const xs = [from[0], to[0]];
  const ys = [from[1], to[1]];
  const box: [number, number, number, number] = [Math.min(...xs) - spread - 100, Math.min(...ys) - spread - 100, Math.max(...xs) + spread + 100, Math.max(...ys) + spread + 100];
  const seg = 0.16;
  return (
    <Layer api={api} box={box} z={5}>
      <g opacity={k}>
        {arrows.map((a, i) => (
          <g key={i}>
            <path d={a.d} fill="none" stroke={c} strokeOpacity={0.18} strokeWidth={line(2)} />
            <path d={a.d} fill="none" stroke={c} strokeWidth={line(6)} strokeLinecap="round" pathLength={1}
              strokeDasharray={`${seg} 2`} strokeDashoffset={seg - a.ph * (1 + seg)} opacity={Math.sin(Math.PI * a.ph)} />
          </g>
        ))}
      </g>
    </Layer>
  );
};

/** A border sliding from one line to another (map-pixel point lists, both west -> east), e.g. the 1848 border sweeping south. */
export const MovingBorder: React.FC<{api: Api; from: number[][]; to: number[][]; at: number; dur?: number; color?: string; width?: number; label?: string; show?: number}> = ({
  api, from, to, at, dur = 45, color, width = 6, label, show,
}) => {
  const g = useGFrame();
  const pal = usePal();
  const id = useId('m3b');
  if (g < (show ?? at)) return null;
  const t = interpolate(g, [at, at + dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const A = resample(from, 240);
  const B = resample(to, 240);
  const pts = A.map((a, i) => [a[0] + (B[i][0] - a[0]) * t, a[1] + (B[i][1] - a[1]) * t]);
  const d = 'M' + pts.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join('L');
  const ld = smoothPath(d, 24);   // a smooth path for the name, so letters don't pile up at corners
  const all = [...A, ...B];
  const box: [number, number, number, number] = [Math.min(...all.map((q) => q[0])), Math.min(...all.map((q) => q[1])), Math.max(...all.map((q) => q[0])), Math.max(...all.map((q) => q[1]))];
  const c = color ?? pal.mark;
  const line = (w: number) => w / api.cam.z;
  return (
    <Layer api={api} box={box} z={3}>
      <defs><path id={id} d={ld} /></defs>
      <path d={d} fill="none" stroke={c} strokeOpacity={0.3} strokeWidth={line(width * 3)} style={{filter: `blur(${width}px)`}} />
      <path d={d} fill="none" stroke={c} strokeWidth={line(width)} strokeLinejoin="round" />
      <path d={d} fill="none" stroke={c} strokeWidth={line(width * 2.8)} strokeDasharray={`${line(2.5)} ${line(18)}`} />
      {label && (
        <text fontFamily={JF.mono} fontSize={line(26)} letterSpacing={line(5)} fill={c} stroke="rgba(10,10,10,0.85)" strokeWidth={line(7)} paintOrder="stroke" dy={line(-16)} textAnchor="middle">
          <textPath href={`#${id}`} startOffset="50%">{label.toUpperCase()}</textPath>
        </text>
      )}
    </Layer>
  );
};

/** A town dot on the paper. */
export const Dot: React.FC<{api: Api; at: [number, number]; show?: number; r?: number; color?: string}> = ({api, at, show = -999, r = 9, color = '#1b1915'}) => {
  const g = useGFrame();
  if (g < show) return null;
  const k = interpolate(g, [show, show + 5], [0, 1], clamp);
  const [x, y] = api.P(at[0], at[1]);
  return <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, background: color, border: '3px solid #f4efe6', transform: `translateZ(2px) scale(${k})`, boxShadow: '0 2px 6px rgba(0,0,0,0.5)'}} />;
};

/** Something standing up off the map at a map pixel, facing the camera (labels, pins, notes, portraits). */
export const Stand: React.FC<{api: Api; at: [number, number] | number[]; z?: number; show?: number; out?: number; children: React.ReactNode}> = ({api, at, z = 0, show = -999, out = 1e9, children}) => {
  const g = useGFrame();
  if (g < show || g >= out + 6 || out <= show + 5) return null;
  const k = interpolate(g, [show, show + 5, out, out + 6], [0, 1, 1, 0], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const [x, y] = api.P(at[0], at[1]);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, transformStyle: 'preserve-3d',
      transform: `translateZ(${z}px) rotateZ(${-api.cam.rot}deg) rotateX(${-api.cam.tilt}deg)`, transformOrigin: '0 0'}}>
      <div style={{position: 'absolute', left: 0, bottom: 0, transform: `translateX(-50%) scale(${0.7 + 0.3 * k})`, transformOrigin: '50% 100%', opacity: k}}>{children}</div>
    </div>
  );
};

/** A group of states (names as in data.states, e.g. 'USA:Texas') rising one after another. */
export const StateTiles: React.FC<{api: Api; names: string[]; at: number; stagger?: number; h?: number; color?: string; fall?: number; layers?: number; hatch?: string}> = ({
  api, names, at, stagger = 2, h = 40, color, fall, layers = 6, hatch,
}) => (
  <>
    {names.map((nm, i) => {
      const d = api.data.states[nm];
      if (!d) return null;
      return <Slab key={nm} api={api} d={d} at={at + i * stagger} h={h} color={color} fall={fall} layers={layers} clipLand={false} hatch={hatch} rim={shade(color ?? '#ffffff', 1.25)} />;
    })}
  </>
);

/** A pin: a stake with a head, standing on the map. */
export const Pin3: React.FC<{color?: string; h?: number}> = ({color, h = 70}) => {
  const pal = usePal();
  const c = color ?? pal.mark;
  return (
    <div style={{position: 'relative', width: 28, height: h + 28}}>
      <div style={{position: 'absolute', left: 12, top: 22, width: 4, height: h, background: '#f4efe6', boxShadow: '0 0 6px rgba(0,0,0,0.6)'}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 28, height: 28, borderRadius: 14, background: c, boxShadow: '0 4px 10px rgba(0,0,0,0.6)'}} />
    </div>
  );
};

/** A stake with an X flag: "the spot". */
export const Stake: React.FC<{color?: string; h?: number}> = ({color, h = 120}) => {
  const pal = usePal();
  const c = color ?? pal.subject;
  return (
    <div style={{position: 'relative', width: 90, height: h}}>
      <div style={{position: 'absolute', left: 8, top: 0, width: 5, height: h, background: '#f4efe6', boxShadow: '0 0 6px rgba(0,0,0,0.6)'}} />
      <svg width={80} height={60} style={{position: 'absolute', left: 13, top: 2}}>
        <path d="M0,0 L74,8 L66,30 L74,52 L0,58 Z" fill={c} />
        <path d="M24,16 L46,42 M46,16 L24,42" stroke="#111" strokeWidth={7} strokeLinecap="round" />
      </svg>
    </div>
  );
};

/** The Gonzales flag in miniature: a cannon, a star and COME AND TAKE IT, on a pole. */
export const Flag3: React.FC<{h?: number}> = ({h = 150}) => (
  <div style={{position: 'relative', width: 190, height: h}}>
    <div style={{position: 'absolute', left: 6, top: 0, width: 5, height: h, background: '#3a2f25', boxShadow: '0 0 6px rgba(0,0,0,0.6)'}} />
    <svg width={180} height={110} style={{position: 'absolute', left: 11, top: 2}}>
      <path d="M0,0 Q90,10 176,2 L176,100 Q90,110 0,104 Z" fill="#f2ede2" stroke="#2a2723" strokeWidth={2} />
      <polygon points="88,10 92,22 105,22 95,30 99,42 88,35 77,42 81,30 71,22 84,22" fill="#111" />
      <rect x={50} y={50} width={62} height={14} rx={4} fill="#111" />
      <circle cx={62} cy={70} r={9} fill="#111" />
      <text x={88} y={96} textAnchor="middle" fontFamily={JF.heavy} fontWeight={900} fontSize={17} fill="#111">COME AND TAKE IT</text>
    </svg>
  </div>
);

/** Place name in mono caps on a dark tab. */
export const PlaceTag: React.FC<{text: string; size?: number; color?: string}> = ({text, size = 30, color = '#f4efe6'}) => (
  <div style={{fontFamily: JF.mono, fontSize: size, letterSpacing: 3, color, background: 'rgba(12,12,12,0.78)', padding: '6px 14px', whiteSpace: 'nowrap', textTransform: 'uppercase', boxShadow: '0 8px 18px rgba(0,0,0,0.5)'}}>{text}</div>
);

/** Big region name in heavy serif, standing on the map. */
export const RegionName: React.FC<{text: string; size?: number; color?: string}> = ({text, size = 84, color = '#f4efe6'}) => (
  <div style={{fontFamily: JF.display, fontSize: size, lineHeight: 1, color, whiteSpace: 'nowrap', textShadow: '0 4px 0 rgba(0,0,0,0.35), 0 8px 22px rgba(0,0,0,0.9)'}}>{text}</div>
);

/** Handwritten teal note standing on the map. */
export const Hand: React.FC<{text: string; size?: number; color?: string; rot?: number; bg?: boolean}> = ({text, size = 60, color, rot = -3, bg = false}) => {
  const pal = usePal();
  // `bg`: a dark tab behind the writing, for notes that sit on the light paper of the map
  return <div style={{fontFamily: '"Nanum Pen Script", cursive', fontSize: size, lineHeight: 1, color: color ?? pal.mark, whiteSpace: 'nowrap', transform: `rotate(${rot}deg)`,
    textShadow: '0 3px 10px rgba(0,0,0,0.9), 0 0 2px #000', ...(bg ? {background: 'rgba(14,14,14,0.82)', padding: '6px 18px 10px', borderRadius: 6, boxShadow: '0 8px 18px rgba(0,0,0,0.45)'} : {})}}>{text}</div>;
};

/** A count that ticks up (stepped), in display type, for screen-space overlays. */
export const Count: React.FC<{from?: number; to: number; at: number; dur?: number; prefix?: string; suffix?: string; size?: number; color?: string; fmt?: (n: number) => string}> = ({
  from = 0, to, at, dur = 30, prefix = '', suffix = '', size = 96, color = '#f4efe6', fmt = (n) => Math.round(n).toLocaleString('en-US'),
}) => {
  const g = useGFrame();
  if (g < at) return null;
  const v = interpolate(g, [at, at + dur], [from, to], {...clamp, easing: Easing.out(Easing.cubic)});
  return <div style={{fontFamily: JF.display, fontSize: size, lineHeight: 1, color, whiteSpace: 'nowrap', textShadow: '0 6px 22px rgba(0,0,0,0.85)'}}>{prefix}{fmt(v)}{suffix}</div>;
};

// ---- state groups for the political maps ---------------------------------------------------------------------------
const U = (names: string[]) => names.map((n) => `USA:${n}`);
/** 1836–37: 13 free and 13 slave states (Michigan and Arkansas just admitted). */
export const FREE_1837 = U(['Maine', 'New Hampshire', 'Vermont', 'Massachusetts', 'Rhode Island', 'Connecticut', 'New York', 'New Jersey', 'Pennsylvania', 'Ohio', 'Indiana', 'Illinois', 'Michigan']);
export const SLAVE_1837 = U(['Delaware', 'Maryland', 'Virginia', 'West Virginia', 'North Carolina', 'South Carolina', 'Georgia', 'Alabama', 'Mississippi', 'Louisiana', 'Tennessee', 'Kentucky', 'Missouri', 'Arkansas']);
/** August 1846 (the Wilmot vote): the same 13 free states; slave states plus Florida (1845) and Texas (1845). */
export const FREE_1846 = FREE_1837;
export const SLAVE_1846 = [...SLAVE_1837, ...U(['Florida', 'Texas'])];
/** April–May 1861: Union free states, Union slave (border) states, the Confederacy. West Virginia is still Virginia. */
export const UNION_FREE_1861 = [...FREE_1837, ...U(['Wisconsin', 'Iowa', 'Minnesota', 'California', 'Oregon', 'Kansas'])];
export const BORDER_1861 = U(['Delaware', 'Maryland', 'Kentucky', 'Missouri']);
export const CONFEDERACY_1861 = U(['South Carolina', 'Mississippi', 'Florida', 'Alabama', 'Georgia', 'Louisiana', 'Texas', 'Virginia', 'West Virginia', 'Arkansas', 'North Carolina', 'Tennessee']);
/** Today's states made wholly or partly from the Mexican Cession. */
export const CESSION_STATES = U(['California', 'Nevada', 'Utah', 'Arizona', 'New Mexico', 'Colorado', 'Wyoming']);
/** Mexican states (today's lines) for the centralism beat. */
export const MEXICAN_STATES = (data: MapData) => Object.keys(data.states).filter((k) => k.startsWith('MEX:'));
