// Look tests for the Civil War series' tilted map (not part of a video): one short scene per key map beat,
// built exactly like The Exact Spot's MapTest (same map3d kit, same colour rules).
// Colours: Union = bone (MAP3D.free), border states = grey, Confederacy = coral slabs that rise.
// Lines: dashed = a claim or a plan, solid = what actually happened. Teal = water and the Union's river line,
// orange = routes and armies. Labels stand up and face the camera.
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import data from '../public/maps/civwar1861.json';
import {PALETTES, PaletteCtx, StepCtx} from './kit/Kit';
import {
  BORDER_1861, Border, CONFEDERACY_1861, type Cam3, Count, Dot, Fill, Hand, MAP3D, Map3D, type MapData, Pin3, PlaceTag,
  RegionName, Route, Slab, Stake, Stand, StateTiles, UNION_FREE_1861,
} from './kit/map3d';

const D = data as unknown as MapData;
const pl = D.places as Record<string, [number, number]>;
const BEAT = 120;
export const MAPTEST_FRAMES = BEAT * 6;
const CORAL = '#FF6F61';
const U = (n: string[]) => n.map((s) => `USA:${s}`);
const FIRST_SEVEN = U(['South Carolina', 'Mississippi', 'Florida', 'Alabama', 'Georgia', 'Louisiana', 'Texas']);
const UPPER_SOUTH = U(['Virginia', 'West Virginia', 'Arkansas', 'North Carolina', 'Tennessee']);
const WEST_OF_RIVER = U(['Texas', 'Arkansas', 'Louisiana']);
const EAST_CONFED = CONFEDERACY_1861.filter((s) => !WEST_OF_RIVER.includes(s));

const Shell: React.FC<{children: React.ReactNode}> = ({children}) => (
  <PaletteCtx.Provider value={PALETTES.locked}><StepCtx.Provider value={2.5}>{children}</StepCtx.Provider></PaletteCtx.Provider>
);

const Title: React.FC<{text: string; sub?: string}> = ({text, sub}) => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: 90, top: 70, fontFamily: '"Abril Fatface", serif', fontSize: 110, color: '#f4efe6', textShadow: '0 6px 22px #000'}}>{text}</div>
    {sub && <div style={{position: 'absolute', left: 96, top: 200, fontFamily: '"Nanum Pen Script", cursive', fontSize: 52, color: '#2FE0C4'}}>{sub}</div>}
  </AbsoluteFill>
);

/** A · Video 1 ch02/ch05: the first seven states rise, then four more; the border states stay grey. */
const Secession: React.FC = () => {
  const keys: Cam3[] = [{f: 0, x: 2850, y: 2600, z: 0.36, tilt: 36, rot: 0}, {f: BEAT, x: 2800, y: 2650, z: 0.39, tilt: 44, rot: -4}];
  return (
    <>
      <Map3D data={D} keys={keys} states={0.6} rivers={0.4}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={4} stagger={0} h={20} color={MAP3D.free} />
            <StateTiles api={api} names={FIRST_SEVEN} at={14} stagger={3} h={60} color={CORAL} />
            <Stand api={api} at={pl.montgomery} z={70} show={40}><Pin3 /></Stand>
            <Stand api={api} at={[pl.montgomery[0] - 40, pl.montgomery[1] + 160]} z={70} show={42}><PlaceTag text="Montgomery · Feb 1861" size={34} /></Stand>
            <StateTiles api={api} names={UPPER_SOUTH} at={66} stagger={3} h={60} color={CORAL} />
            <StateTiles api={api} names={BORDER_1861} at={84} stagger={1} h={30} color={MAP3D.grey} />
            <Stand api={api} at={[2300, 2050]} z={50} show={90}><Hand text="border states: stay" size={70} color="#f4efe6" rot={0} /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 90, top: 70}}><Count to={7} at={16} dur={24} suffix=" states" size={84} color={CORAL} /></div>
        <div style={{position: 'absolute', left: 90, top: 170}}><Count from={7} to={11} at={66} dur={20} prefix="then " size={64} color={CORAL} /></div>
      </AbsoluteFill>
    </>
  );
};

/** B · Video 1 ch06: the Anaconda Plan. Ships at the blockade stations, then the Mississippi drawn and the South split. */
const Anaconda: React.FC = () => {
  const keys: Cam3[] = [{f: 0, x: 2500, y: 3000, z: 0.4, tilt: 38, rot: 0}, {f: BEAT, x: 2450, y: 3050, z: 0.43, tilt: 46, rot: -4}];
  const ships = ['hamptonRoads', 'capeFear', 'charlestonBar', 'savannahBar', 'fernandina', 'pensacola', 'mobileBay', 'mississippiMouth', 'galvestonBar'];
  const slide = {at: 80, dur: 30, dx: -160, dy: 40, lift: 30};
  return (
    <>
      <Map3D data={D} keys={keys} states={0.4} rivers={0.4}>
        {(api) => (
          <>
            <StateTiles api={api} names={EAST_CONFED} at={2} stagger={0} h={40} color={CORAL} />
            {WEST_OF_RIVER.map((s) => <Slab key={s} api={api} d={D.states[s]} clipLand={false} at={2} h={40} color={CORAL} layers={6} slide={slide} />)}
            {ships.map((k, i) => <Dot key={k} api={api} at={pl[k]} show={12 + i * 4} r={30} color={MAP3D.us} />)}
            <Stand api={api} at={[3650, 3400]} z={20} show={30}><Hand text="1 · blockade the coast" size={70} color={MAP3D.us} rot={0} /></Stand>
            <Border api={api} d={D.lines.lowerMississippi} at={56} dur={24} color={MAP3D.mexico} width={9} z={48} />
            <Stand api={api} at={[1500, 3250]} z={60} show={70}><PlaceTag text="Mississippi River" size={40} /></Stand>
            <Stand api={api} at={[1250, 2650]} z={60} show={62}><Hand text="2 · take the river" size={70} color={MAP3D.mexico} rot={0} /></Stand>
          </>
        )}
      </Map3D>
      <Title text="THE ANACONDA PLAN" />
    </>
  );
};

/** C · Video 1 ch07: Washington and Richmond, about 100 miles apart, Bull Run between them. */
const Forward: React.FC = () => {
  const keys: Cam3[] = [{f: 0, x: 3790, y: 1990, z: 1.25, tilt: 38, rot: -6}, {f: BEAT, x: 3780, y: 1985, z: 1.4, tilt: 46, rot: -10}];
  return (
    <>
      <Map3D data={D} keys={keys} states={0.7} rivers={1}>
        {(api) => (
          <>
            <Fill api={api} d={D.states['USA:Virginia']} at={2} color={CORAL} opacity={0.22} />
            <Stand api={api} at={pl.washingtonDC} z={0} show={6}><Pin3 color={MAP3D.free} /></Stand>
            <Stand api={api} at={[pl.washingtonDC[0] + 90, pl.washingtonDC[1] + 10]} z={70} show={8}><PlaceTag text="Washington" size={30} /></Stand>
            <Stand api={api} at={pl.richmond} z={0} show={12}><Pin3 color={CORAL} /></Stand>
            <Stand api={api} at={[pl.richmond[0] + 60, pl.richmond[1] + 40]} z={70} show={14}><PlaceTag text="Richmond · Confederate capital" size={30} /></Stand>
            <Route api={api} pts={[pl.washingtonDC, pl.richmond]} at={24} dur={22} color={MAP3D.us} dashed bow={0.06} />
            <Stand api={api} at={[3930, 1985]} z={40} show={46}><Hand text="about 100 miles" size={64} color={MAP3D.us} /></Stand>
            <Stand api={api} at={pl.bullRun} show={64}><Stake /></Stand>
            <Stand api={api} at={[pl.bullRun[0] - 170, pl.bullRun[1] + 30]} z={70} show={68}><PlaceTag text="Bull Run · July 21, 1861" size={30} /></Stand>
          </>
        )}
      </Map3D>
      <Title text="FORWARD TO RICHMOND!" />
    </>
  );
};

/** D · Video 2 ch05: what the Emancipation Proclamation covered. Covered = coral, hatched; not covered = grey. */
const Proclamation: React.FC = () => {
  const keys: Cam3[] = [{f: 0, x: 2700, y: 2750, z: 0.38, tilt: 34, rot: 0}, {f: BEAT, x: 2700, y: 2800, z: 0.41, tilt: 42, rot: -4}];
  const covered = CONFEDERACY_1861.filter((s) => !U(['Tennessee', 'West Virginia']).includes(s));
  return (
    <>
      <Map3D data={D} keys={keys} states={0.6} rivers={0.3}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={2} stagger={0} h={14} color={MAP3D.free} />
            <StateTiles api={api} names={covered} at={6} stagger={1} h={46} color={CORAL} hatch="rgba(255,255,255,0.35)" />
            <StateTiles api={api} names={BORDER_1861} at={44} stagger={2} h={22} color={MAP3D.grey} />
            <StateTiles api={api} names={U(['Tennessee', 'West Virginia'])} at={56} stagger={4} h={22} color={MAP3D.grey} />
            {(['exemptLouisiana', 'exemptVaTidewater', 'exemptVaShore'] as const).map((r, i) => (
              <Slab key={r} api={api} region={r} at={68 + i * 4} h={62} color={MAP3D.grey} layers={6} />
            ))}
            <Stand api={api} at={[2650, 3150]} z={60} show={20}><RegionName text="COVERED" size={110} color="#f4efe6" /></Stand>
            <Stand api={api} at={[2250, 2100]} z={50} show={50}><Hand text="not covered" size={80} color="#f4efe6" rot={0} /></Stand>
            <Stand api={api} at={[1800, 3500]} z={80} show={74}><Hand text="New Orleans area" size={60} color="#f4efe6" rot={0} /></Stand>
          </>
        )}
      </Map3D>
      <Title text="JANUARY 1, 1863" sub="what the Proclamation covered" />
    </>
  );
};

/** E · Video 3 ch02: one week in July 1863. Gettysburg and Vicksburg, then the river is the Union's. */
const July: React.FC = () => {
  const keys: Cam3[] = [{f: 0, x: 2750, y: 2250, z: 0.36, tilt: 28, rot: 0}, {f: BEAT, x: 2700, y: 2280, z: 0.38, tilt: 34, rot: -4}];
  const slide = {at: 84, dur: 30, dx: -180, dy: 40, lift: 30};
  return (
    <>
      <Map3D data={D} keys={keys} states={0.5} rivers={0.4}>
        {(api) => (
          <>
            <StateTiles api={api} names={EAST_CONFED} at={2} stagger={0} h={36} color={CORAL} />
            {WEST_OF_RIVER.map((s) => <Slab key={s} api={api} d={D.states[s]} clipLand={false} at={2} h={36} color={CORAL} layers={6} slide={slide} />)}
            <Stand api={api} at={pl.gettysburg} show={12}><Stake color={MAP3D.us} /></Stand>
            <Stand api={api} at={[pl.gettysburg[0] - 380, pl.gettysburg[1] + 60]} z={80} show={14}><PlaceTag text="Gettysburg · July 1 to 3" size={38} /></Stand>
            <Stand api={api} at={pl.vicksburg} show={30}><Stake color={MAP3D.us} /></Stand>
            <Stand api={api} at={[pl.vicksburg[0] - 360, pl.vicksburg[1] + 120]} z={80} show={32}><PlaceTag text="Vicksburg · July 4" size={38} /></Stand>
            <Border api={api} d={D.lines.lowerMississippi} at={58} dur={24} color={MAP3D.mexico} width={9} z={44} />
            <Stand api={api} at={[2450, 2450]} z={60} show={96}><Hand text="cut in two" size={80} color={MAP3D.mexico} /></Stand>
          </>
        )}
      </Map3D>
      <Title text="JULY 1863" />
    </>
  );
};

/** F · Video 3 ch05: Sherman, Atlanta to Savannah. */
const March: React.FC = () => {
  const keys: Cam3[] = [{f: 0, x: 3020, y: 3000, z: 0.95, tilt: 38, rot: -4}, {f: BEAT, x: 3040, y: 3020, z: 1.05, tilt: 46, rot: -8}];
  return (
    <>
      <Map3D data={D} keys={keys} states={0.7} rivers={0.8}>
        {(api) => (
          <>
            <Fill api={api} d={D.states['USA:Georgia']} at={2} color={CORAL} opacity={0.35} hatch="rgba(255,111,97,0.6)" />
            <Stand api={api} at={pl.atlanta} z={30} show={8}><Pin3 color={MAP3D.us} /></Stand>
            <Stand api={api} at={[pl.atlanta[0] - 40, pl.atlanta[1] - 40]} z={120} show={10}><PlaceTag text="Atlanta · falls Sept 2, 1864" size={24} /></Stand>
            <Route api={api} pts={D.polylines.sherman} at={30} dur={50} color={MAP3D.us} width={10} bow={0} />
            <Stand api={api} at={[pl.milledgeville[0], pl.milledgeville[1] + 30]} z={60} show={52}><PlaceTag text="Milledgeville" size={22} /></Stand>
            <Stand api={api} at={pl.savannah} z={30} show={80}><Pin3 color={MAP3D.us} /></Stand>
            <Stand api={api} at={[pl.savannah[0] + 30, pl.savannah[1] - 30]} z={120} show={82}><PlaceTag text="Savannah · Dec 1864" size={24} /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 90, top: 70}}><Count to={300} at={34} dur={46} prefix="about " suffix=" miles" size={84} color={MAP3D.us} /></div>
        <div style={{position: 'absolute', left: 96, top: 180, fontFamily: '"Nanum Pen Script", cursive', fontSize: 52, color: '#2FE0C4'}}>"the hard hand of war"</div>
      </AbsoluteFill>
    </>
  );
};

export const MapTest: React.FC = () => (
  <Shell>
    <Sequence durationInFrames={BEAT}><Secession /></Sequence>
    <Sequence from={BEAT} durationInFrames={BEAT}><Anaconda /></Sequence>
    <Sequence from={BEAT * 2} durationInFrames={BEAT}><Forward /></Sequence>
    <Sequence from={BEAT * 3} durationInFrames={BEAT}><Proclamation /></Sequence>
    <Sequence from={BEAT * 4} durationInFrames={BEAT}><July /></Sequence>
    <Sequence from={BEAT * 5} durationInFrames={BEAT}><March /></Sequence>
  </Shell>
);
