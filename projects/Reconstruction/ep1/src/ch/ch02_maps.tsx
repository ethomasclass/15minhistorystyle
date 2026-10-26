// Chapters 2 and 3: the two drawn maps and the pieces that sit on them.
//   US / UsMap      the 1861-65 United States (public/maps/us1861.json, built from Census + Natural Earth outlines;
//                   states keyed 'USA:<Name>' so the kit's UNION_FREE_1861 / BORDER_1861 / CONFEDERACY_1861 lists work)
//   shiftPath       an SVG path moved by (dx, dy) map pixels (the South "broken away", ch02 -> ch03)
//   AcresMap        the forty acres (ported from tests/src/tests/AcresTest.tsx, the user's favourite test): the Field
//                   Order 15 strip rises off the coast, the camera dives to Edisto Island, the 1,085 forty-acre plots
//                   pop up. Data: public/maps/sea_islands.json (tests/tools/build_sea_islands.py).
//   OrderScrap      a torn strip of a printed page lying over a scene, with the coral swipe running on it
//   Football        one plot = 40 acres, about 30 football fields
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import usData from '../../public/maps/us1861.json';
import seaData from '../../public/maps/sea_islands.json';
import {Api, Cam3, Fill, Glow, MAP3D, Map3D, MapData, PlaceTag, RegionName, Slab, Stand, shade} from '../kit/map3d';
import {JF, useGFrame} from '../kit/Kit';
import {Sfx} from '../kit/common';
import {type Box, CORAL, Swipe, TEAL} from '../kit/rc';
import {tornPoly} from '../kit/vox';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ------------------------------------------------------------------------------------------------- the United States
export const US = usData as unknown as MapData & {km: number};
export const USP = US.places as Record<string, [number, number]>;
/** The Confederacy's colour on the map: brick, darker than the coral subject. */
export const CONF = '#9a3b31';
export const MAP_TAG = 'Map: state lines U.S. Census Bureau, coast Natural Earth';

/** Every absolute coordinate pair in a path moved by (dx, dy). The map paths are absolute M/L/Z only. */
export const shiftPath = (d: string, dx: number, dy: number) => d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${(+x + dx).toFixed(1)},${(+y + dy).toFixed(1)}`);

/** The US map with today's state lines and the international border drawn faintly. */
export const UsMap: React.FC<{keys: Cam3[]; children?: (api: Api) => React.ReactNode}> = ({keys, children}) => (
  <Map3D data={US} keys={keys} states={0.9} rivers={0.5}>
    {(api) => (
      <>
        <Glow api={api} d={US.lines.intl} at={-999} color="#2a2723" width={2.5} z={0.5} />
        {children?.(api)}
      </>
    )}
  </Map3D>
);

/** A US camera key: centre (x, y) in map pixels. */
export const ucam = (f: number, x: number, y: number, z: number, tilt = 40, rot = -4): Cam3 => ({f, x, y, z, tilt, rot});

// ---------------------------------------------------------------------------------------------- the forty acres map
type Plot = {d: string; c: [number, number]};
export const SEA = seaData as unknown as MapData & {plots: Plot[]; km: number};
const SP = SEA.places as Record<string, [number, number]>;
const GREY = '#8d877c';
// Positions were laid out as offsets from Edisto Island on the test's first build (23.8 px/km); `at` rescales them.
const E = SP['Edisto Island'];
const R = SEA.km / 23.8;
const at = (dx: number, dy: number): [number, number] => [E[0] + dx * R, E[1] + dy * R];
export const acam = (f: number, dx: number, dy: number, z: number, tilt: number, rot: number): Cam3 => {
  const [x, y] = at(dx, dy);
  return {f, x, y, z: z / R, tilt, rot};
};
export const ACRES_TAG = 'Map: approximate (the order: islands from Charleston south, rice fields 30 miles inland, the St. Johns) · coast U.S. Census Bureau';

/** The 40-acre plots: a shadow, a side and a top layer (three SVGs for all 1,085 plots), each plot popping up from its
 *  centre in order from `rise` over `spread` frames. */
const Plots: React.FC<{api: Api; rise: number; spread: number}> = ({api, rise, spread}) => {
  const g = useGFrame();
  const n = SEA.plots.length;
  const H = 7;
  const line = (w: number) => w / api.cam.z;
  const b: [number, number, number, number] = [...at(-260, -215), ...at(220, 225)] as [number, number, number, number];
  const [l, t] = api.P(b[0], b[1]);
  const size = {width: (b[2] - b[0]) * api.cam.z, height: (b[3] - b[1]) * api.cam.z};
  const vb = `${b[0]} ${b[1]} ${b[2] - b[0]} ${b[3] - b[1]}`;
  const ks = SEA.plots.map((_, i) => interpolate(g, [rise + (i / n) * spread, rise + (i / n) * spread + 5], [0, 1], clamp));
  if (ks[0] <= 0) return null;
  const shapes = (fill: (i: number) => string, stroke?: string) =>
    SEA.plots.map((p, i) => ks[i] > 0.01 && (
      <path key={i} d={p.d} fill={fill(i)} stroke={stroke} strokeWidth={stroke ? line(1.4) : 0}
        transform={`translate(${p.c[0]},${p.c[1]}) scale(${0.88 * ks[i]}) translate(${-p.c[0]},${-p.c[1]})`} />
    ));
  const layer = (z: number, children: React.ReactNode, style?: React.CSSProperties) => (
    <svg {...size} viewBox={vb} style={{position: 'absolute', left: l, top: t, transform: `translateZ(${z}px)`, overflow: 'visible', ...style}}>{children}</svg>
  );
  return (
    <>
      {layer(0, <g transform={`translate(${line(3)},${line(4)})`}>{shapes(() => '#000')}</g>, {filter: 'blur(3px)', opacity: 0.45})}
      {layer(H * 0.5, shapes(() => shade(CORAL, 0.55)))}
      {layer(H, shapes((i) => (random(`p${i}`) < 0.08 ? shade(CORAL, 1.12) : CORAL), shade(CORAL, 0.5)))}
    </>
  );
};

/**
 * The forty acres. `strip`: the frame the order's strip rises (it settles as the camera dives at `settle`); `labels`:
 * frames for the Charleston / Savannah / St. Johns tags; `edisto`: the island is picked out; `rise`: the first plot.
 * Pass the camera keys. Anything not wanted is left at 1e7 (never) or a large negative frame (long done).
 */
export const AcresMap: React.FC<{keys: Cam3[]; strip: number; settle: number; labels: [number, number, number]; labelsOut: number; edisto: number;
  rise: number; spread?: number; nameOut?: number}> = ({keys, strip, settle, labels, labelsOut, edisto, rise, spread = 76, nameOut = 1e7}) => (
  <Map3D data={SEA} keys={keys} states={0.8} rivers={0.7}>
    {(api) => (
      <>
        {/* the order's land, rising along the coast; it settles as the camera dives to Edisto */}
        <Slab api={api} region="fo15" at={strip} h={34} dur={16} color={TEAL} hatch="rgba(10,30,28,0.35)" fall={settle} layers={8} />
        <Fill api={api} region="fo15" at={settle + 14} outline={TEAL} />
        <Stand api={api} at={SP['Charleston']} show={labels[0]} out={labelsOut}><PlaceTag text="Charleston" size={34} /></Stand>
        <Stand api={api} at={SP['Savannah']} show={labels[1]} out={labelsOut}><PlaceTag text="Savannah" size={34} /></Stand>
        <Stand api={api} at={SP['St. Johns River']} show={labels[2]} out={labelsOut}><PlaceTag text="St. Johns River" size={34} /></Stand>
        {/* Edisto */}
        <Fill api={api} region="edisto" at={edisto} out={rise + 4} color={TEAL} opacity={0.22} outline={TEAL} />
        <Stand api={api} at={at(160, 244)} show={edisto + 6} out={nameOut} z={6}><RegionName text="Edisto Island" size={64} /></Stand>
        <Plots api={api} rise={rise} spread={spread} />
      </>
    )}
  </Map3D>
);
export {GREY};

// ------------------------------------------------------------------------------------------------ pieces over a scene
/** A torn strip of a printed page lying over the scene (source px window cx, cy at scale s), with the swipe on it. */
export const OrderScrap: React.FC<{src: string; size: [number, number]; cx: number; cy: number; s: number; w: number; h: number; x: number; y: number; r?: number;
  at: number; swipe?: {lines: Box[]; from: number; to: number}; filter?: string; seed?: string}> = ({src, size, cx, cy, s, w, h, x, y, r = -1.5, at, swipe, filter = 'grayscale(1) sepia(0.15) contrast(1.45) brightness(1.06)', seed = 'scrap'}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 3, at + 6], [1.15, 0.98, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${r}deg) scale(${k})`, opacity: interpolate(f, [at, at + 2], [0, 1], clamp),
      filter: 'drop-shadow(6px 9px 0 rgba(0,0,0,0.55))'}}>
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#e6e0d2', clipPath: tornPoly(seed, w, h, 9, 22)}}>
        <div style={{position: 'absolute', left: w / 2 - cx * s, top: h / 2 - cy * s, width: size[0], height: size[1], transform: `scale(${s})`, transformOrigin: '0 0'}}>
          <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: size[0], height: size[1], filter}} />
          {swipe && <Swipe lines={swipe.lines} from={swipe.from} to={swipe.to} seed={`${seed}sw`} />}
        </div>
      </div>
      <Sfx at={at} src="sfx/tick.wav" volume={0.4} />
    </div>
  );
};

/** One plot = 40 acres ≈ 30 football fields: a dark card, a teal square, the fields popping in one by one. */
export const Football: React.FC<{x: number; y: number; at: number; size?: number}> = ({x, y, at, size = 330}) => {
  const g = useGFrame();
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 3, at + 6], [1.15, 0.97, 1], clamp);
  const pad = 26;
  const W = size + pad * 2;
  const cols = 6, rows = 5;
  const cw = size / cols, ch = size / rows;
  const fw = cw * 0.44, fh = ch * 0.84;   // a field (with end zones) is about 2.25 : 1
  const sq = interpolate(g, [at + 2, at + 8], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: W, transform: `rotate(2deg) scale(${k})`, transformOrigin: '50% 0', filter: 'drop-shadow(6px 8px 0 rgba(0,0,0,0.55))'}}>
      <div style={{background: '#1a1814', clipPath: tornPoly('fb', W, W + 120, 8, 20), height: W + 120, position: 'relative'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 22, textAlign: 'center', fontFamily: JF.mono, fontSize: 26, letterSpacing: 2, color: TEAL}}>ONE PLOT · 40 ACRES</div>
        <svg width={size} height={size} style={{position: 'absolute', left: pad, top: 70, overflow: 'visible'}}>
          <rect x={0} y={0} width={size} height={size} fill="none" stroke={TEAL} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sq} />
          {Array.from({length: cols * rows}, (_, i) => {
            const show = g >= at + 8 + i * 0.6;
            if (!show) return null;
            const cx = (i % cols) * cw + cw / 2, cy = Math.floor(i / cols) * ch + ch / 2;
            return (
              <g key={i}>
                <rect x={cx - fw / 2} y={cy - fh / 2} width={fw} height={fh} fill="#3f6b3a" stroke="#f4efe6" strokeWidth={1.6} />
                <line x1={cx - fw / 2} x2={cx + fw / 2} y1={cy} y2={cy} stroke="#f4efe6" strokeWidth={1.2} />
                <line x1={cx - fw / 2} x2={cx + fw / 2} y1={cy - fh * 0.41} y2={cy - fh * 0.41} stroke="#f4efe6" strokeWidth={1} />
                <line x1={cx - fw / 2} x2={cx + fw / 2} y1={cy + fh * 0.41} y2={cy + fh * 0.41} stroke="#f4efe6" strokeWidth={1} />
              </g>
            );
          })}
        </svg>
        <div style={{position: 'absolute', left: 0, right: 0, top: size + 86, textAlign: 'center', fontFamily: JF.mono, fontSize: 26, letterSpacing: 2, color: '#f4efe6',
          opacity: interpolate(g, [at + 24, at + 28], [0, 1], clamp)}}>≈ 30 FOOTBALL FIELDS</div>
      </div>
      <Sfx at={at} src="sfx/tick.wav" volume={0.4} />
    </div>
  );
};

/** Screen-space dark band behind a title on a busy map (top-left), so the Highlight reads. */
export const TopShade: React.FC = () => <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(8,8,8,0.5) 0%, rgba(8,8,8,0) 26%)', pointerEvents: 'none'}} />;
export {MAP3D};
