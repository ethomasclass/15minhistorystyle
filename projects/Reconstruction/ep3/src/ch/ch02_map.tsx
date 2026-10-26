// ch02: the drawn locator (Episode 1's US base map, public/maps/us1861.json, as in Episode 2's ch02_maps.tsx).
// Tennessee, then a pin on Pulaski (1866); on "spread across the South" the camera pulls back and the former Confederate
// states light up one after another, Tennessee outward.
import React from 'react';
import usData from '../../public/maps/us1861.json';
import {type Api, type Cam3, Fill, Glow, Map3D, type MapData, Pin3, PlaceTag, Stand} from '../kit/map3d';
import {CORAL, TEAL} from '../kit/rc';

const US = usData as unknown as MapData & {km: number};
export const MAP_TAG = 'Drawn map: state lines U.S. Census Bureau, coast Natural Earth';

/** Pulaski, Tenn. (35.20 N, 87.03 W) in map pixels, same Albers projection as tools/build_us1861.py. */
const PULASKI: [number, number] = [3671.6, 2672.7];
const S = (n: string) => US.states[`USA:${n}`];
/** The other ten states of the old Confederacy, roughly nearest Tennessee first. */
const SPREAD = ['Alabama', 'Mississippi', 'Georgia', 'Arkansas', 'North Carolina', 'South Carolina', 'Virginia', 'Louisiana', 'Florida', 'Texas'];

export const ucam = (f: number, x: number, y: number, z: number, tilt = 38, rot = -3): Cam3 => ({f, x, y, z, tilt, rot});

export const KlanMap: React.FC<{keys: Cam3[]; tn: number; pin: number; spread: number; stagger?: number}> = ({keys, tn, pin, spread, stagger = 3}) => (
  <Map3D data={US} keys={keys} states={0.9} rivers={0.5}>
    {(api: Api) => (
      <>
        <Glow api={api} d={US.lines.intl} at={-999} color="#2a2723" width={2.5} z={0.5} />
        <Fill api={api} d={S('Tennessee')} at={tn} color={TEAL} opacity={0.14} outline={TEAL} />
        <Fill api={api} d={S('Tennessee')} at={spread - stagger} color={CORAL} opacity={0.3} />
        {SPREAD.map((n, i) => <Fill key={n} api={api} d={S(n)} at={spread + i * stagger} color={CORAL} opacity={0.3} />)}
        <Stand api={api} at={[3742, 2606]} z={6} show={tn + 3} out={pin - 1}><PlaceTag text="Tennessee" size={30} /></Stand>
        <Stand api={api} at={PULASKI} show={pin}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
            <PlaceTag text="Pulaski, Tennessee" size={30} />
            <Pin3 color={CORAL} h={60} />
          </div>
        </Stand>
      </>
    )}
  </Map3D>
);
