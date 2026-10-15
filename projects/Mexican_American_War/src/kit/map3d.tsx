// The tilted map: our own drawn map (tools/build_map.py → public/maps/<name>.json) laid on a plane seen in 3D
// perspective. The camera glides, tilts and turns; regions rise off the paper as slabs with real sides and a shadow;
// labels, pins and notes stand up and face the camera. Everything is SVG, re-drawn at screen resolution every
// frame (the zoom happens in the SVG viewBox, only the tilt is a CSS 3D transform), so it stays sharp at any zoom.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {JF, useGFrame, usePal} from './Kit';

export type MapData = {
  size: [number, number];
  land: string; lakes: string;
  rivers: Record<string, string>; regions: Record<string, string>; lines: Record<string, string>;
  states: Record<string, string>; places: Record<string, [number, number]>;
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

/** Map style: bone paper land, ink sea with engraved lines, slate rivers. */
export const MAP3D = {
  sea: '#121416', seaLine: 'rgba(237,231,220,0.05)', land: '#d9d1c1', landEdge: '#2a2723', halo: 'rgba(237,231,220,0.10)',
  river: '#6f8790', lake: '#3b474d', state: 'rgba(42,39,35,0.35)', fog: '#0b0c0d',
};

type Api = {
  /** map pixel -> plane pixel */
  P: (x: number, y: number) => [number, number];
  cam: Cam3;
  data: MapData;
};

const boundsCache = new Map<string, [number, number, number, number]>();
/** Bounding box of an SVG path's coordinates (map pixels). */
export const pathBounds = (d: string): [number, number, number, number] => {
  const hit = boundsCache.get(d);
  if (hit) return hit;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const m of d.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)) {
    const x = +m[1], y = +m[2];
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  const b: [number, number, number, number] = [x0, y0, x1, y1];
  boundsCache.set(d, b);
  return b;
};

/**
 * The map scene. `children(api)` renders overlays (Slab, Stand, RiverGlow, Route...) in plane space;
 * use `api.P(x, y)` to place things by map pixel and `data.places.<name>` for named places.
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
          </defs>
          <rect x={cam.x - vw} y={cam.y - vh} width={vw * 2} height={vh * 2} fill="url(#m3-sea)" />
          {/* engraved water lines hugging the coast */}
          {[26, 14].map((w, i) => <path key={i} d={data.land} fill="none" stroke={MAP3D.halo} strokeWidth={line(w)} strokeLinejoin="round" opacity={0.6 - i * 0.2} />)}
          <path d={data.land} fill={MAP3D.land} stroke={MAP3D.landEdge} strokeWidth={line(1.6)} strokeLinejoin="round" />
          <path d={data.lakes} fill={MAP3D.lake} />
          {states > 0 && Object.values(data.states).map((d, i) => <path key={i} d={d} fill="none" stroke={MAP3D.state} strokeWidth={line(1.3)} opacity={states} />)}
          {rivers > 0 && Object.entries(data.rivers).map(([k, d]) => <path key={k} d={d} fill="none" stroke={MAP3D.river} strokeWidth={line(1.6)} strokeLinecap="round" opacity={rivers} />)}
        </svg>
        {/* paper grain + soft light falling across the plane */}
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 55%, rgba(255,250,240,0.10) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.35) 75%)'}} />
        {children?.({P, cam, data})}
      </div>
      {/* fog toward the horizon, the Vox depth cue */}
      <AbsoluteFill style={{background: `linear-gradient(to bottom, ${MAP3D.fog} 0%, rgba(11,12,13,0.85) 14%, rgba(11,12,13,0) 46%)`, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

/** An SVG layer covering a map-pixel box, placed in plane space (optionally lifted to height z). */
const Layer: React.FC<{api: Api; box: [number, number, number, number]; z?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({api, box, z = 0, style, children}) => {
  const pad = 40 / api.cam.z;
  const [x0, y0, x1, y1] = [box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad];
  const [l, t] = api.P(x0, y0);
  return (
    <svg width={(x1 - x0) * api.cam.z} height={(y1 - y0) * api.cam.z} viewBox={`${x0} ${y0} ${x1 - x0} ${y1 - y0}`}
      style={{position: 'absolute', left: l, top: t, transform: `translateZ(${z}px)`, overflow: 'visible', ...style}}>
      {children}
    </svg>
  );
};

const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (s: number) => Math.round(((n >> s) & 255) * k).toString(16).padStart(2, '0');
  return `#${c(16)}${c(8)}${c(0)}`;
};

let clipSeq = 0;
/**
 * A region rising off the map as a slab: sides, top face, rim and a cast shadow. `region` is a key of data.regions
 * (clipped to land, so coasts stay coasts). `h` is the full height in pixels; it rises over `dur` frames from `at`.
 */
export const Slab: React.FC<{api: Api; region: string; at: number; h?: number; dur?: number; color?: string; rim?: string; fall?: number; layers?: number}> = ({
  api, region, at, h = 60, dur = 14, color, rim, fall = Infinity, layers = 12,
}) => {
  const g = useCurrentFrame();
  const pal = usePal();
  const [id] = React.useState(() => `m3clip${clipSeq++}`);
  if (g < at) return null;
  const ease = {...clamp, easing: Easing.out(Easing.back(1.4))};
  const up = Number.isFinite(fall) ? interpolate(g, [at, at + dur, fall, fall + dur], [0, 1, 1, 0], ease) : interpolate(g, [at, at + dur], [0, 1], ease);
  const H = h * up;
  const d = api.data.regions[region];
  const box = pathBounds(d);
  const c = color ?? pal.subject;
  const line = (w: number) => w / api.cam.z;
  const clip = (
    <defs><clipPath id={id}><path d={api.data.land} /></clipPath></defs>
  );
  return (
    <>
      {/* cast shadow on the paper */}
      <Layer api={api} box={box} style={{filter: `blur(${4 + H * 0.25}px)`, opacity: 0.55 * Math.min(1, up * 1.5)}}>
        {clip}
        <g clipPath={`url(#${id})`} transform={`translate(${line(H * 0.35)},${line(H * 0.5)})`}><path d={d} fill="#000" /></g>
      </Layer>
      {/* sides: stacked copies, darker toward the base */}
      {Array.from({length: layers}, (_, i) => {
        const z = (H * i) / layers;
        return (
          <Layer key={i} api={api} box={box} z={z}>
            {clip}
            <g clipPath={`url(#${id})`}><path d={d} fill={shade(c, 0.45 + 0.25 * (i / layers))} /></g>
          </Layer>
        );
      })}
      {/* top face with a bright rim */}
      <Layer api={api} box={box} z={H}>
        {clip}
        <g clipPath={`url(#${id})`}>
          <path d={d} fill={c} />
          <path d={d} fill="none" stroke={rim ?? shade(c, 1.15)} strokeWidth={line(3)} strokeLinejoin="round" />
        </g>
      </Layer>
    </>
  );
};

/** A river or line drawn on over `dur` frames, glowing in the mark colour. `src` is 'rivers' or 'lines'. */
export const Glow: React.FC<{api: Api; d: string; at: number; dur?: number; color?: string; width?: number; z?: number}> = ({api, d, at, dur = 18, color, width = 6, z = 1}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  const box = pathBounds(d);
  const line = (w: number) => w / api.cam.z;
  const c = color ?? pal.mark;
  return (
    <Layer api={api} box={box} z={z}>
      <path d={d} fill="none" stroke={c} strokeWidth={line(width * 3)} strokeOpacity={0.25} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} style={{filter: `blur(${width}px)`}} />
      <path d={d} fill="none" stroke={c} strokeWidth={line(width)} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </Layer>
  );
};

/** A route arrow (map pixel points) drawn on, dashed, with a head; lifted slightly off the map. */
export const Route: React.FC<{api: Api; pts: number[][]; at: number; dur?: number; color?: string; width?: number; bow?: number}> = ({api, pts, at, dur = 24, color, width = 7, bow = 0.18}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const line = (w: number) => w / api.cam.z;
  const c = color ?? pal.mark;
  // a gentle curve through the points
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const mx = (ax + bx) / 2 - (by - ay) * bow;
    const my = (ay + by) / 2 + (bx - ax) * bow;
    d += ` Q${mx},${my} ${bx},${by}`;
  }
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  const box: [number, number, number, number] = [Math.min(...xs) - 200, Math.min(...ys) - 200, Math.max(...xs) + 200, Math.max(...ys) + 200];
  const [ex, ey] = pts[pts.length - 1];
  const [qx, qy] = pts[pts.length - 2];
  const ang = Math.atan2(ey - qy, ex - qx);
  const hl = line(34);
  return (
    <Layer api={api} box={box} z={4}>
      <path d={d} fill="none" stroke="#000" strokeOpacity={0.35} strokeWidth={line(width + 6)} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} transform={`translate(${line(6)},${line(8)})`} />
      <path d={d} fill="none" stroke={c} strokeWidth={line(width)} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      {p >= 1 && <path d={`M${ex},${ey} L${ex - hl * Math.cos(ang - 0.45)},${ey - hl * Math.sin(ang - 0.45)} L${ex - hl * Math.cos(ang + 0.45)},${ey - hl * Math.sin(ang + 0.45)} Z`} fill={c} />}
    </Layer>
  );
};

/** Something standing up off the map at a map pixel, facing the camera (labels, pins, notes, portraits). */
export const Stand: React.FC<{api: Api; at: [number, number]; z?: number; show?: number; children: React.ReactNode}> = ({api, at, z = 0, show = -999, children}) => {
  const g = useGFrame();
  if (g < show) return null;
  const k = interpolate(g, [show, show + 5], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const [x, y] = api.P(at[0], at[1]);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, transformStyle: 'preserve-3d',
      transform: `translateZ(${z}px) rotateZ(${-api.cam.rot}deg) rotateX(${-api.cam.tilt}deg)`, transformOrigin: '0 0'}}>
      <div style={{position: 'absolute', left: 0, bottom: 0, transform: `translateX(-50%) scale(${0.7 + 0.3 * k})`, transformOrigin: '50% 100%', opacity: k}}>{children}</div>
    </div>
  );
};

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

/** Place name in mono caps on a dark tab. */
export const PlaceTag: React.FC<{text: string; size?: number; color?: string}> = ({text, size = 30, color = '#f4efe6'}) => (
  <div style={{fontFamily: JF.mono, fontSize: size, letterSpacing: 3, color, background: 'rgba(12,12,12,0.78)', padding: '6px 14px', whiteSpace: 'nowrap', textTransform: 'uppercase', boxShadow: '0 8px 18px rgba(0,0,0,0.5)'}}>{text}</div>
);

/** Big region name in heavy serif, standing on the map. */
export const RegionName: React.FC<{text: string; size?: number; color?: string}> = ({text, size = 84, color = '#f4efe6'}) => (
  <div style={{fontFamily: JF.display, fontSize: size, lineHeight: 1, color, whiteSpace: 'nowrap', textShadow: '0 6px 18px rgba(0,0,0,0.85)'}}>{text}</div>
);

/** Handwritten teal note standing on the map. */
export const Hand: React.FC<{text: string; size?: number; color?: string; rot?: number}> = ({text, size = 60, color, rot = -3}) => {
  const pal = usePal();
  return <div style={{fontFamily: '"Nanum Pen Script", cursive', fontSize: size, lineHeight: 1, color: color ?? pal.mark, whiteSpace: 'nowrap', transform: `rotate(${rot}deg)`, textShadow: '0 3px 10px rgba(0,0,0,0.9)'}}>{text}</div>;
};
