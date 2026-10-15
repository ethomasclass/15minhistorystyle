// Look test for the tilted map (not part of the video).
import React from 'react';
import data from '../public/maps/mex1846.json';
import {PALETTES, PaletteCtx, StepCtx} from './kit/Kit';
import {type Cam3, Glow, Hand, Map3D, type MapData, Pin3, PlaceTag, RegionName, Route, Slab, Stand} from './kit/map3d';

const D = data as unknown as MapData;
const pl = D.places;
export const MAPTEST_FRAMES = 330;

export const MapTest: React.FC = () => {
  const keys: Cam3[] = [
    {f: 0, x: 3300, y: 2000, z: 0.4, tilt: 18, rot: 0},
    {f: 80, x: 3120, y: 2270, z: 2.3, tilt: 52, rot: -14},
    {f: 190, x: 3120, y: 2270, z: 2.5, tilt: 55, rot: -18},
    {f: 250, x: 2050, y: 1350, z: 0.72, tilt: 46, rot: 6},
    {f: 330, x: 2050, y: 1380, z: 0.8, tilt: 50, rot: 9},
  ];
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <StepCtx.Provider value={2.5}>
        <Map3D data={D} keys={keys}>
          {(api) => (
            <>
              <Glow api={api} d={D.lines.nueces} at={90} />
              <Glow api={api} d={D.lines.rioLower} at={104} />
              <Slab api={api} region="nuecesStrip" at={128} h={46} fall={235} />
              <Stand api={api} at={pl.corpusChristi} z={60} show={96}><Hand text="Mexico: the Nueces" size={64} /></Stand>
              <Stand api={api} at={pl.matamoros} show={110}><Pin3 /></Stand>
              <Stand api={api} at={[pl.matamoros[0] - 40, pl.matamoros[1] + 40]} show={112}><PlaceTag text="Matamoros" /></Stand>
              <Stand api={api} at={pl.laredo} z={60} show={140}><Hand text="Texas: the Rio Grande" size={64} color="#FF9F1C" /></Stand>
              <Stand api={api} at={[3110, 2230]} z={50} show={150}><Hand text="the spot?" size={78} color="#ffffff" /></Stand>
              <Route api={api} pts={[pl.corpusChristi, [3230, 2420], pl.fortTexas]} at={160} dur={20} />
              <Slab api={api} region="cession" at={250} h={70} />
              <Stand api={api} at={[1700, 1250]} z={80} show={262}><RegionName text="MEXICAN CESSION" size={96} color="#ffffff" /></Stand>
              <Stand api={api} at={[1700, 1360]} z={80} show={268}><Hand text="about 530,000 square miles" size={58} /></Stand>
            </>
          )}
        </Map3D>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};
