// Test 3: the forty acres on the 3D map. The Field Order 15 strip rises off the coast (Jan 1865), the camera flies to
// Edisto Island, the island fills with 40-acre plots, and in October 1865 they sink back and the island goes grey.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import mapData from '../../public/maps/sea_islands.json';
import {Api, Cam3, Fill, Hand, MAP3D, Map3D, MapData, PlaceTag, RegionName, Slab, Stand, shade} from '../kit/map3d';
import {Highlight, Note, Tag, useGFrame} from '../kit/Kit';
import {TestFrame} from './common';

type Plot = {d: string; c: [number, number]};
const data = mapData as unknown as MapData & {plots: Plot[]; km: number};
const P = data.places as Record<string, [number, number]>;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const CORAL = '#FF6F61';
const GREY = '#8d877c';

// Positions below were laid out as offsets from Edisto Island on the first build (23.8 px/km); `at` rescales them.
const E = P['Edisto Island'];
const R = data.km / 23.8;
const at = (dx: number, dy: number): [number, number] => [E[0] + dx * R, E[1] + dy * R];
const cam = (f: number, dx: number, dy: number, z: number, tilt: number, rot: number): Cam3 => {
  const [x, y] = at(dx, dy);
  return {f, x, y, z: z / R, tilt, rot};
};

const KEYS: Cam3[] = [
  cam(0, -1100, 2454, 0.115, 46, -24),
  cam(120, -800, 1554, 0.14, 46, -18),
  cam(200, -30, 14, 2.0, 54, -8),
  cam(330, -15, 9, 2.35, 56, -4),
  cam(450, -10, 4, 2.5, 57, -2),
];

const RISE = 214;     // first plot
const SPREAD = 76;    // frames for all plots to rise
const BACK = 340;     // first plot sinks
const BACK_SPREAD = 60;

/** The 40-acre plots: a shadow layer, a side layer and a top layer (three SVGs for all ~1,000 plots), each plot
 * popping up from its centre in order and, later, shrinking back in reverse order. */
const Plots: React.FC<{api: Api}> = ({api}) => {
  const g = useGFrame();
  const n = data.plots.length;
  const H = 7;
  const line = (w: number) => w / api.cam.z;
  const b: [number, number, number, number] = [...at(-260, -215), ...at(220, 225)] as [number, number, number, number];
  const [l, t] = api.P(b[0], b[1]);
  const size = {width: (b[2] - b[0]) * api.cam.z, height: (b[3] - b[1]) * api.cam.z};
  const vb = `${b[0]} ${b[1]} ${b[2] - b[0]} ${b[3] - b[1]}`;
  const k = (i: number) => {
    const up = interpolate(g, [RISE + (i / n) * SPREAD, RISE + (i / n) * SPREAD + 5], [0, 1], clamp);
    const down = interpolate(g, [BACK + ((n - i) / n) * BACK_SPREAD, BACK + ((n - i) / n) * BACK_SPREAD + 5], [1, 0], clamp);
    return Math.min(up, down);
  };
  const ks = data.plots.map((_, i) => k(i));
  const shapes = (fill: (i: number) => string, stroke?: string) =>
    data.plots.map((p, i) => ks[i] > 0.01 && (
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

const Scene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Map3D data={data} keys={KEYS} states={0.8} rivers={0.7}>
      {(api) => (
        <>
          {/* the order's land, rising along the coast; it settles as the camera dives to Edisto */}
          <Slab api={api} region="fo15" at={22} h={34} dur={16} color={'#2FE0C4'} hatch={'rgba(10,30,28,0.35)'} fall={176} layers={8} />
          <Fill api={api} region="fo15" at={190} outline={'#2FE0C4'} />
          <Stand api={api} at={P['Charleston']} show={30} out={175}><PlaceTag text="Charleston" size={34} /></Stand>
          <Stand api={api} at={P['Savannah']} show={36} out={175}><PlaceTag text="Savannah" size={34} /></Stand>
          <Stand api={api} at={P['St. Johns River']} show={42} out={175}><PlaceTag text="St. Johns River" size={34} /></Stand>
          {/* Edisto */}
          <Fill api={api} region="edisto" at={170} out={RISE + 4} color={'#2FE0C4'} opacity={0.22} outline={'#2FE0C4'} />
          <Stand api={api} at={at(160, 244)} show={176} out={BACK - 4} z={6}><RegionName text="Edisto Island" size={64} /></Stand>
          <Plots api={api} />
          <Stand api={api} at={at(-100, 104)} show={RISE + SPREAD - 10} out={BACK - 4} z={10}><Hand text="up to 40 acres a family" size={64} bg /></Stand>
          {/* October 1865: the island goes back, grey */}
          <Slab api={api} region="edisto" at={BACK + BACK_SPREAD - 6} h={10} dur={12} color={GREY} layers={4} />
          <Stand api={api} at={at(-70, 94)} show={BACK + BACK_SPREAD + 10} z={14}><Hand text="back to the old owners" size={64} color={'#f4efe6'} bg /></Stand>
        </>
      )}
    </Map3D>
  );
};

export const ACRES_FRAMES = 450;
export const AcresTest: React.FC = () => {
  return (
    <TestFrame vignette={0.45}>
      <Scene />
      <Highlight text="SPECIAL FIELD ORDER NO. 15" x={110} y={92} size={74} at={30} />
      <Note text="January 1865: coast land set aside for freed families" x={130} y={210} at={44} size={46} out={200} />
      <Note text="October 1865: the President gives it back" x={130} y={210} at={BACK - 6} size={46} />
      <Tag text="Map: the area is approximate (land within 30 miles of the sea, Charleston to the St. Johns River) · coast: U.S. Census Bureau" />
    </TestFrame>
  );
};
