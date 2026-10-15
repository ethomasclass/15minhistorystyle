// Look tests for the tilted map (not part of the video): one short scene per map beat.
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import data from '../public/maps/mex1846.json';
import {PALETTES, PaletteCtx, StepCtx} from './kit/Kit';
import {
  BORDER_1861, Border, CONFEDERACY_1861, type Cam3, Count, Dot, Fill, Flag3, Flow, FREE_1837, Hand, MAP3D, Map3D, type MapData,
  MovingBorder, PlaceTag, RegionName, SLAVE_1837, Slab, Stake, Stand, StateTiles, UNION_FREE_1861,
} from './kit/map3d';

const D = data as unknown as MapData;
const pl = D.places;
const BEAT = 120;
export const MAPTEST_FRAMES = BEAT * 6;

const Shell: React.FC<{children: React.ReactNode}> = ({children}) => (
  <PaletteCtx.Provider value={PALETTES.locked}><StepCtx.Provider value={2.5}>{children}</StepCtx.Provider></PaletteCtx.Provider>
);

/** A · the river claims, clearly: Mexico's line (Nueces, teal, dashed), Texas's line (Rio Grande, orange), the disputed strip hatched. */
const Claims: React.FC = () => {
  const keys: Cam3[] = [{f: 0, x: 3080, y: 2200, z: 1.6, tilt: 40, rot: -8}, {f: BEAT, x: 3100, y: 2240, z: 1.9, tilt: 50, rot: -14}];
  return (
    <Map3D data={D} keys={keys}>
      {(api) => (
        <>
          <Fill api={api} region="nuecesStrip" at={40} color="#FF6F61" opacity={0.28} hatch="rgba(255,111,97,0.75)" />
          <Border api={api} d={D.lines.nueces} at={4} color={MAP3D.mexico} dashed label="Nueces · Mexico's line" labelSize={28} labelFrom={0} labelTo={0.9} />
          <Border api={api} d={D.lines.rioGrande} at={20} color={MAP3D.us} dashed label="Rio Grande · Texas's claim" labelSize={30} labelFrom={0} labelTo={0.3} />
          <Stand api={api} at={[3130, 2190]} z={30} show={48}><RegionName text="DISPUTED" size={64} color="#FF6F61" /></Stand>
          <Stand api={api} at={pl.carricitos} show={60}><Stake /></Stand>
          <Stand api={api} at={[pl.carricitos[0] + 20, pl.carricitos[1] - 30]} z={150} show={64}><Hand text="the spot" size={56} color="#ffffff" /></Stand>
        </>
      )}
    </Map3D>
  );
};

/** B · why the U.S. waited: 13 free vs 13 slave states, then Texas lands on the slave side. */
const Balance: React.FC = () => {
  const keys: Cam3[] = [{f: 0, x: 4300, y: 1250, z: 0.52, tilt: 38, rot: 0}, {f: BEAT, x: 4200, y: 1350, z: 0.56, tilt: 46, rot: -6}];
  return (
    <>
      <Map3D data={D} keys={keys} states={0.6} rivers={0.4}>
        {(api) => (
          <>
            <StateTiles api={api} names={FREE_1837} at={6} stagger={1} h={38} color={MAP3D.free} />
            <StateTiles api={api} names={SLAVE_1837} at={10} stagger={1} h={38} color={MAP3D.slave} />
            <Slab api={api} d={D.states['USA:Texas']} clipLand={false} at={62} h={70} color="#FF6F61" layers={8} />
            <Stand api={api} at={[3250, 1900]} z={90} show={70}><Hand text="+1 slave state, and a big one" size={60} color="#ffffff" /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 90, top: 70}}><Count to={13} at={12} dur={20} suffix=" free" size={84} /></div>
        <div style={{position: 'absolute', left: 90, top: 170}}><Count to={13} at={16} dur={20} suffix=" slave" size={84} color="#e0857c" /></div>
      </AbsoluteFill>
    </>
  );
};

/** C · Mexico loses about half its land: Texas and the Cession lift off and slide north. */
const Half: React.FC = () => {
  const keys: Cam3[] = [{f: 0, x: 2700, y: 2050, z: 0.36, tilt: 34, rot: 0}, {f: BEAT, x: 2700, y: 1900, z: 0.34, tilt: 42, rot: 0}];
  const slide = {at: 48, dur: 40, dx: 0, dy: -520, lift: 70};
  return (
    <>
      <Map3D data={D} keys={keys} rivers={0.3}>
        {(api) => (
          <>
            <Slab api={api} region="mexicoNow" at={4} h={40} color="#4a8f86" layers={8} />
            <Slab api={api} region="gadsden" at={4} h={40} color="#4a8f86" layers={8} />
            <Slab api={api} region="texasClaim" at={4} h={40} color="#FF6F61" layers={8} slide={slide} />
            <Slab api={api} region="cession" at={4} h={40} color="#FF6F61" layers={8} slide={slide} />
            <Stand api={api} at={pl.mexicoCity} z={50} show={20}><PlaceTag text="Mexico, 1821" /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 1180, top: 80}}><Count to={50} at={70} dur={24} prefix="about " suffix="%" size={96} color="#FF6F61" /></div>
        <div style={{position: 'absolute', left: 1190, top: 190, fontFamily: '"Nanum Pen Script", cursive', fontSize: 54, color: '#2FE0C4', opacity: 1}}>of Mexico's land, counting Texas</div>
      </AbsoluteFill>
    </>
  );
};

/** D · they didn't move, the border did (quiet mode): towns stay, the border sweeps south over them; Native nations named. */
const Sweep: React.FC = () => {
  const keys: Cam3[] = [{f: 0, x: 2000, y: 1250, z: 0.62, tilt: 40, rot: 0}, {f: BEAT, x: 1950, y: 1300, z: 0.66, tilt: 46, rot: 4}];
  // [place, name, label nudge in map px]
  const towns: [string, string, number, number][] = [['santaFe', 'Santa Fe', 70, 0], ['taos', 'Taos', 0, -20], ['albuquerque', 'Albuquerque', -60, 30], ['tucson', 'Tucson', 0, 40],
    ['losAngeles', 'Los Angeles', 40, 10], ['sanDiego', 'San Diego', 30, 10], ['santaBarbara', 'Santa Barbara', -10, -20], ['monterey', 'Monterey', -20, 20], ['sanFrancisco', 'San Francisco', 0, -20]];
  return (
    <PaletteCtx.Provider value={PALETTES.quiet}>
      <Map3D data={D} keys={keys} rivers={0.5}>
        {(api) => (
          <>
            {towns.map(([k, name, nx, ny], i) => (
              <React.Fragment key={k}>
                <Dot api={api} at={pl[k]} show={2 + i} />
                <Stand api={api} at={[pl[k][0] + nx, pl[k][1] - 12 + ny]} show={4 + i}><PlaceTag text={name} size={22} /></Stand>
              </React.Fragment>
            ))}
            {Object.entries(D.nations).filter(([n]) => !['Kiowa', 'Comanche', 'Pueblo nations', "Tohono O'odham"].includes(n)).map(([n, xy], i) => (
              <Stand key={n} api={api} at={xy} z={10} show={70 + i * 2}><Hand text={n} size={48} color="#2FE0C4" rot={0} /></Stand>
            ))}
            <MovingBorder api={api} from={D.polylines.oldBorder} to={D.polylines.newBorder} at={18} dur={44} show={6} label="the border" />
          </>
        )}
      </Map3D>
    </PaletteCtx.Provider>
  );
};

/** E · 1861: the same states, split. */
const Split: React.FC = () => {
  const keys: Cam3[] = [{f: 0, x: 3700, y: 1350, z: 0.42, tilt: 40, rot: 0}, {f: BEAT, x: 3600, y: 1400, z: 0.44, tilt: 48, rot: -4}];
  return (
    <>
      <Map3D data={D} keys={keys} states={0.5} rivers={0.3}>
        {(api) => (
          <>
            <Fill api={api} region="cession" at={2} color="#FF6F61" opacity={0.35} />
            <StateTiles api={api} names={UNION_FREE_1861} at={20} stagger={1} h={34} color={MAP3D.free} />
            <StateTiles api={api} names={BORDER_1861} at={30} stagger={1} h={34} color={MAP3D.grey} />
            <StateTiles api={api} names={CONFEDERACY_1861} at={36} stagger={2} h={60} color="#FF6F61" />
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 90, top: 70, fontFamily: '"Abril Fatface", serif', fontSize: 120, color: '#f4efe6', textShadow: '0 6px 22px #000'}}>1861</div>
      </AbsoluteFill>
    </>
  );
};

/** F · ch 2–3: Tejano towns in a big frontier, Comanche lands, settlers streaming in, the Gonzales flag. */
const Frontier: React.FC = () => {
  const keys: Cam3[] = [{f: 0, x: 3250, y: 1750, z: 0.9, tilt: 42, rot: -4}, {f: BEAT, x: 3300, y: 1800, z: 1.0, tilt: 50, rot: -10}];
  return (
    <Map3D data={D} keys={keys}>
      {(api) => (
        <>
          <Fill api={api} region="comancheria" at={2} color="#7d6b55" opacity={0.35} hatch="rgba(60,50,40,0.45)" />
          <Stand api={api} at={D.nations.Comanche} z={10} show={8}><Hand text="Comanche lands" size={50} color="#f4efe6" rot={0} /></Stand>
          {(['sanAntonio', 'goliad', 'nacogdoches'] as const).map((k, i) => (
            <React.Fragment key={k}>
              <Dot api={api} at={pl[k]} show={14 + i * 3} />
              <Stand api={api} at={[pl[k][0], pl[k][1] - 10]} show={16 + i * 3}><PlaceTag text={k === 'sanAntonio' ? 'San Antonio' : k[0].toUpperCase() + k.slice(1)} size={22} /></Stand>
            </React.Fragment>
          ))}
          <Flow api={api} from={[4050, 1650]} to={[3420, 1950]} at={30} n={22} spread={160} toSpread={120} color="#FF9F1C" seed="settlers" />
          <Stand api={api} at={pl.gonzales} show={70}><Flag3 /></Stand>
          <Stand api={api} at={[3900, 1560]} z={20} show={34}><Hand text="settlers from the South" size={52} color="#FF9F1C" /></Stand>
        </>
      )}
    </Map3D>
  );
};

export const MapTest: React.FC = () => (
  <Shell>
    <Sequence durationInFrames={BEAT}><Claims /></Sequence>
    <Sequence from={BEAT} durationInFrames={BEAT}><Balance /></Sequence>
    <Sequence from={BEAT * 2} durationInFrames={BEAT}><Half /></Sequence>
    <Sequence from={BEAT * 3} durationInFrames={BEAT}><Sweep /></Sequence>
    <Sequence from={BEAT * 4} durationInFrames={BEAT}><Split /></Sequence>
    <Sequence from={BEAT * 5} durationInFrames={BEAT}><Frontier /></Sequence>
  </Shell>
);
