// Chapters 2 and 3: the drawn maps (Episode 1's US 1861 base map, public/maps/us1861.json, from ../ep1/src/ch/ch02_maps.tsx).
//   UsMap / ucam      the map and a camera key
//   DistrictMap       ch02: the Reconstruction Act's five military districts (1867) rise as slab groups with their
//                     numbers; a general stands on the 4th; Tennessee stays flat
//   MsLocator         ch03: Mississippi, then Clinton and Jackson, 12 miles apart
//   TopShade          a dark band behind a title on a busy map
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import usData from '../../public/maps/us1861.json';
import {type Api, type Cam3, Fill, Glow, Map3D, type MapData, Pin3, PlaceTag, RegionName, Route, Slab, Stand, Hand} from '../kit/map3d';
import {JF} from '../kit/Kit';
import {CORAL, TEAL} from '../kit/rc';

export const US = usData as unknown as MapData & {km: number};
export const MAP_TAG = 'Map: state lines U.S. Census Bureau, coast Natural Earth';
const ORANGE = '#FF9F1C';
const SAND = '#c9b48a';
const BRICK = '#9a3b31';

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

/** Screen-space dark band behind a title on a busy map (top-left), so the Highlight reads. */
export const TopShade: React.FC = () => <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(8,8,8,0.5) 0%, rgba(8,8,8,0) 26%)', pointerEvents: 'none'}} />;

const S = (n: string) => US.states[`USA:${n}`];

// Map pixels of towns not in the map's own places (same Albers projection as tools/build_us1861.py).
export const TOWN = {Jackson: [3444.7, 2971.1] as [number, number], Clinton: [3433.4, 2967.7] as [number, number]};

/** The Reconstruction Act of March 2, 1867: ten states, five districts. Tennessee was left out. */
export const DISTRICTS = [
  {n: 1, states: ['Virginia'], color: TEAL, label: [4210, 2360]},
  {n: 2, states: ['North Carolina', 'South Carolina'], color: ORANGE, label: [4190, 2600]},
  {n: 3, states: ['Georgia', 'Alabama', 'Florida'], color: SAND, label: [3860, 2930]},
  {n: 4, states: ['Mississippi', 'Arkansas'], color: CORAL, label: [3300, 2760]},
  {n: 5, states: ['Louisiana', 'Texas'], color: BRICK, label: [2860, 3030]},
];

/** A district number standing on the map. */
const Num: React.FC<{n: number; color: string}> = ({n, color}) => (
  <div style={{width: 84, height: 84, borderRadius: 42, background: 'rgba(14,13,11,0.9)', border: `5px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: JF.display, fontSize: 54, color: '#f4efe6', boxShadow: '0 10px 22px rgba(0,0,0,0.6)'}}>{n}</div>
);

/**
 * The five military districts. `rise`: the first district's slab rises (the others follow every `stagger` frames);
 * `ord`: the general stands up on the 4th District; `tn`: Tennessee is picked out (flat, dashed teal).
 */
export const DistrictMap: React.FC<{keys: Cam3[]; rise: number; stagger?: number; ord: number; ordOut: number; tn: number}> = ({keys, rise, stagger = 7, ord, ordOut, tn}) => (
  <UsMap keys={keys}>
    {(api) => (
      <>
        {DISTRICTS.map((d, i) => (
          <Slab key={d.n} api={api} d={d.states.map(S).join(' ')} at={rise + i * stagger} h={30} dur={12} color={d.color} layers={6} />
        ))}
        <Fill api={api} d={S('Tennessee')} at={tn} color={TEAL} opacity={0.12} outline={TEAL} />
        {DISTRICTS.map((d, i) => (
          <Stand key={d.n} api={api} at={d.label} z={40} show={rise + i * stagger + 6}><Num n={d.n} color={d.color} /></Stand>
        ))}
        <Stand api={api} at={[3742, 2600]} z={6} show={tn + 2}><PlaceTag text="Tennessee" size={30} /></Stand>
        <Stand api={api} at={[3470, 2920]} z={40} show={ord} out={ordOut}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
            <Img src={staticFile('img/ch02/cr_ord.png')} style={{width: 190, filter: 'drop-shadow(0 14px 18px rgba(0,0,0,0.7))'}} />
            <PlaceTag text="Gen. Ord · 4th District" size={24} />
          </div>
        </Stand>
      </>
    )}
  </UsMap>
);

/** A town: its name over a pin. */
const Town: React.FC<{name: string; color: string}> = ({name, color}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
    <PlaceTag text={name} size={30} />
    <Pin3 color={color} h={60} />
  </div>
);

/** Mississippi, then Clinton (coral: his town) and Jackson (the capital), 12 miles apart. */
export const MsLocator: React.FC<{keys: Cam3[]; at: number; clinton: number; miles: number; jackson: number; nameOut: number; fillOut?: number}> = ({keys, at, clinton, miles, jackson, nameOut, fillOut = 1e7}) => {
  const [cx, cy] = TOWN.Clinton, [jx, jy] = TOWN.Jackson;
  return (
    <UsMap keys={keys}>
      {(api) => (
        <>
          <Fill api={api} d={S('Mississippi')} at={at} out={fillOut} color={CORAL} opacity={0.18} outline={CORAL} />
          <Stand api={api} at={[3468, 2860]} z={4} show={at + 4} out={nameOut}><RegionName text="Mississippi" size={72} /></Stand>
          <Route api={api} pts={[[cx, cy], [jx, jy]]} at={miles} dur={14} color={TEAL} width={6} bow={0} dashed />
          <Stand api={api} at={[(cx + jx) / 2, (cy + jy) / 2 - 0.5]} z={2} show={miles + 10}><Hand text="12 miles" size={64} bg /></Stand>
          <Stand api={api} at={[cx, cy]} show={clinton}><Town name="Clinton" color={CORAL} /></Stand>
          <Stand api={api} at={[jx, jy]} show={jackson}><Town name="Jackson" color={TEAL} /></Stand>
        </>
      )}
    </UsMap>
  );
};
