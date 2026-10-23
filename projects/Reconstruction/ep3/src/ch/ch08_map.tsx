// Chapter 8: the drawn map of the South (Episode 1/2's base map, public/maps/us1861.json). The eleven former Confederate
// states; the eight already back under Democrats in dark ink; South Carolina, Louisiana and Florida rising in coral as
// they're named (the last Republican governments, 1876). In the last shot the three sink and take the same ink.
import React from 'react';
import usData from '../../public/maps/us1861.json';
import {type Cam3, Fill, Map3D, type MapData, PlaceTag, Slab, Stand} from '../kit/map3d';
import {CORAL} from '../kit/rc';

const US = usData as unknown as MapData;
export const MAP_TAG = 'Drawn map: Southern state governments, 1876 · state lines U.S. Census Bureau, coast Natural Earth';
const INKC = '#4a443b';

const S = (n: string) => US.states[`USA:${n}`];
const REDEEMED = ['Virginia', 'North Carolina', 'Georgia', 'Alabama', 'Mississippi', 'Texas', 'Arkansas', 'Tennessee'];
export const LAST3: {name: string; at: [number, number]}[] = [
  {name: 'South Carolina', at: [4170, 2760]},
  {name: 'Louisiana', at: [3300, 3020]},
  {name: 'Florida', at: [4170, 3330]},
];

/** A camera key on the US map: centre (x, y) in map pixels. */
export const ucam = (f: number, x: number, y: number, z: number, tilt = 36, rot = -4): Cam3 => ({f, x, y, z, tilt, rot});

/**
 * `ink`: the eight darken; `rise`: frames the three rise (in order); `fall`: they sink and darken like the rest.
 * Anything before `from` is already in place (for the cut back to the map).
 */
export const SouthMap: React.FC<{keys: Cam3[]; ink: number; rise: [number, number, number]; fall?: number; from?: number}> = ({keys, ink, rise, fall = 1e9, from = -1e6}) => {
  const pre = (v: number) => (v < from ? from - 400 : v);
  return (
    <Map3D data={US} keys={keys} states={0.9} rivers={0.4}>
      {(api) => (
        <>
          {REDEEMED.map((n) => <Fill key={n} api={api} d={S(n)} at={pre(ink)} color={INKC} opacity={0.62} />)}
          {LAST3.map((s, i) => (
            <React.Fragment key={s.name}>
              <Slab api={api} d={S(s.name)} at={pre(rise[i])} h={34} dur={12} color={CORAL} layers={6} clipLand={false} fall={fall + i * 4} />
              <Fill api={api} d={S(s.name)} at={fall + i * 4 + 6} color={INKC} opacity={0.62} />
              <Stand api={api} at={s.at} z={50} show={pre(rise[i]) + 4} out={fall + i * 4}><PlaceTag text={s.name} size={28} /></Stand>
            </React.Fragment>
          ))}
        </>
      )}
    </Map3D>
  );
};
