// Chapter 7 · A Picnic at Bull Run: "Forward to Richmond!" on the map, Bull Run, the spectators with their picnic
// baskets, the Union line breaking, the stampede back to Washington, nearly 5,000 men, "This is not going to be quick."
import React from 'react';
import {AbsoluteFill} from 'remotion';
import data from '../../public/maps/civwar1861.json';
import words from '../../public/audio/ch07_bull_run.words.json';
import {Arrow, Highlight, Loop, Note} from '../kit/Kit';
import {Sfx, WRITE} from '../kit/common';
import {type Cam3, Fill, Hand, MAP3D, Map3D, type MapData, Pin3, PlaceTag, Route, Stake, Stand} from '../kit/map3d';
import {Engraving} from '../kit/engraving';
import {sizeOf} from '../kit/dk';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, Photo, Stamp, type TL, useScene} from '../kit/shell';
import {Tag} from '../kit/Kit';
import {MASKS} from '../masks';

const N = words as Narration;
const D = data as unknown as MapData;
const pl = D.places as Record<string, [number, number]>;
export const CH07_FRAMES = chapterFrames(N, LEAD);

const CORAL = '#FF6F61';
const SPECT = 'img/gen/v1_ch07_spectators.jpg';
const RETREAT = 'img/gen/v1_ch07_retreat.jpg';
const WAUD = 'img/ch07/waud_burnside_brigade_bull_run_jul21_1861.jpg';
const HW = 'img/ch07/hw_retreat_of_our_troops_bull_run_aug10_1861.jpg';
const ILN = 'img/ch07/iln_stampede_from_bull_run_aug17_1861.jpg';
const SPECT_TAG = 'Illustration · spectators watching the battle from a hill near Bull Run, July 21, 1861';
const END = Math.ceil(N.duration * 30) + 60;

/** "Forward to Richmond!": Washington and Richmond, about 100 miles apart (MapTest beat C, on anchors). */
const Forward: React.FC<{t: TL}> = ({t}) => {
  const b = t.at('On July') - 1;
  const keys: Cam3[] = [{f: 0, x: 3790, y: 1990, z: 1.25, tilt: 38, rot: -6}, {f: b, x: 3780, y: 1985, z: 1.4, tilt: 46, rot: -10}];
  const r = t.at('The Confederate capital');
  return (
    <>
      <Map3D data={D} keys={keys} states={0.7} rivers={1}>
        {(api) => (
          <>
            <Fill api={api} d={D.states['USA:Virginia']} at={2} color={CORAL} opacity={0.22} />
            <Stand api={api} at={pl.washingtonDC} z={0} show={6}><Pin3 color={MAP3D.free} /></Stand>
            <Stand api={api} at={[pl.washingtonDC[0] + 90, pl.washingtonDC[1] + 10]} z={70} show={8}><PlaceTag text="Washington" size={30} /></Stand>
            <Stand api={api} at={pl.richmond} z={0} show={r - 2}><Pin3 color={CORAL} /></Stand>
            <Stand api={api} at={[pl.richmond[0] + 230, pl.richmond[1] + 40]} z={70} show={r}><PlaceTag text="Richmond · Confederate capital" size={30} /></Stand>
            <Route api={api} pts={[pl.washingtonDC, pl.richmond]} at={t.at('only about') - 4} dur={22} color={MAP3D.us} dashed bow={0.06} />
            <Stand api={api} at={[3990, 1950]} z={40} show={t.at('100 miles') - 2}><Hand text="about 100 miles" size={64} color={MAP3D.us} /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Highlight text="FORWARD TO RICHMOND!" x={90} y={80} size={92} at={t.at('"Forward to')} seed={71} rot={-2} />
        <Note text="northern newspapers, summer 1861" x={110} y={220} size={44} rot={-2} at={t.at('Northern') - 3} color="#ffffff" />
        <Note text="one big battle and it's over?" x={110} y={900} size={54} rot={-3} at={t.at('One big') - 3} />
      </AbsoluteFill>
    </>
  );
};

/** July 21: the armies meet at Bull Run, between the two capitals. */
const BullRun: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('On July') - 1;
  const keys: Cam3[] = [{f: a, x: 3760, y: 1960, z: 1.9, tilt: 48, rot: -10}, {f: t.at('And they have') - 1, x: 3755, y: 1955, z: 2.05, tilt: 50, rot: -12}];
  return (
    <>
      <Map3D data={D} keys={keys} states={0.7} rivers={1}>
        {(api) => (
          <>
            <Fill api={api} d={D.states['USA:Virginia']} at={-99} color={CORAL} opacity={0.22} />
            <Stand api={api} at={pl.washingtonDC} z={0}><Pin3 color={MAP3D.free} /></Stand>
            <Stand api={api} at={[pl.washingtonDC[0] + 90, pl.washingtonDC[1] + 10]} z={70}><PlaceTag text="Washington" size={30} /></Stand>
            <Route api={api} pts={[pl.washingtonDC, pl.richmond]} at={-99} dur={1} color={MAP3D.us} dashed bow={0.06} />
            <Stand api={api} at={pl.bullRun} show={t.at('Bull Run') - 2}><Stake /></Stand>
            <Stand api={api} at={[pl.bullRun[0] - 170, pl.bullRun[1] + 30]} z={70} show={t.at('Bull Run')}><PlaceTag text="Bull Run · July 21, 1861" size={30} /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Highlight text="JULY 21, 1861" x={90} y={80} size={92} at={t.at('July')} seed={72} rot={-2} />
        <Note text="a creek in Virginia" x={110} y={900} size={54} rot={-3} at={t.at('a creek') - 3} />
      </AbsoluteFill>
    </>
  );
};

/** They have company: the spectators ride out to watch; picnic baskets. */
const Spectators: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('And they have') - 1;
  const b = t.at('Look at this') - 1;
  return (
    <Engraving src={SPECT} px={sizeOf(SPECT)} fx={600} fy={420} a={a} b={b + 12} z0={1} z1={1.06} mask={MASKS.spectator} traceAt={t.at('curious') + 2} tag={SPECT_TAG}>
      {(p) => (
        <>
          <Note text="and they have company" x={110} y={70} size={52} rot={-2} at={t.at('company.') - 3} color="#ffffff" />
          <Note text="congressmen, reporters, the curious" x={1040} y={70} size={44} rot={-2} at={t.at('Congressmen,') - 3} />
          <Loop cx={p.left + 512 * p.scale} cy={p.top + 662 * p.scale} rx={80 * p.scale} ry={62 * p.scale} at={t.at('picnic') - 2} seed={73} tilt={-6} width={6} />
          <Note text="picnic baskets" x={p.left + 620 * p.scale} y={p.top + 640 * p.scale} size={50} rot={-4} at={t.at('picnic') - 3} />
        </>
      )}
    </Engraving>
  );
};

/** Look at this: punch in on the man with the opera glasses; the "game" in the distance. */
const DayOut: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Look at this') - 1;
  const b = t.at('For a while') - 1;
  return (
    <Engraving src={SPECT} px={sizeOf(SPECT)} fx={800} fy={430} a={a} b={b + 12} z0={1.6} z1={1.7} fade={4} mask={MASKS.spectator} traceAt={a + 1} tag={SPECT_TAG}>
      {(p) => {
        const sx = (x: number) => p.left + x * p.scale;
        const sy = (y: number) => p.top + y * p.scale;
        return (
          <>
            <Note text="war, as a day out" x={1000} y={80} size={60} rot={-3} at={t.at('War,') - 3} color="#ffffff" />
            <Note text="basically a tailgate" x={1120} y={780} size={66} rot={-4} at={t.at('Basically') - 3} color={CORAL} />
            <Arrow x1={1500} y1={760} x2={sx(1060)} y2={sy(325)} bow={-40} at={t.at('cannons.') - 4} />
            <Note text="the game" x={sx(1060) + 50} y={sy(325) - 140} size={46} rot={-4} at={t.at('the game') - 3} />
          </>
        );
      }}
    </Engraving>
  );
};

/** For a while the Union seems to be winning (Waud, sketched that day); reinforcements arrive by train. */
const Battle: React.FC<{t: TL}> = ({t}) => (
  <Photo src={WAUD} size={sizeOf(WAUD)} fx={1500} fy={980} z0={1.1} z1={1.18} a={t.at('For a while') - 1} b={t.at('the Union line') - 1}>
    {() => (
      <>
        <Note text="for a while: Union winning" x={110} y={80} size={54} rot={-2} at={t.at('the Union seems') - 3} color="#ffffff" />
        <Note text="then: Confederate reinforcements, by train" x={110} y={890} size={50} rot={-2} at={t.at('Then Confederate') - 3} />
        <Tag text="Alfred Waud, Burnside's brigade attacking at Bull Run, sketched July 21, 1861 · Library of Congress" />
      </>
    )}
  </Photo>
);

/** The line breaks: soldiers run right into the spectators. */
const Breaks: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('the Union line') - 1;
  const b = t.at('Carriages,') - 1;
  return (
    <Engraving src={RETREAT} px={sizeOf(RETREAT)} fx={700} fy={420} a={a} b={b + 8} z0={1.04} z1={1.1} fade={6}
      tag="Illustration · the retreat from Bull Run, July 21, 1861">
      {() => (
        <>
          <Highlight text="THE LINE BREAKS" x={90} y={80} size={84} at={t.at('breaks.')} seed={74} rot={-2} />
          <Note text="right into the spectators" x={1040} y={900} size={54} rot={-3} at={t.at('right into') - 3} />
        </>
      )}
    </Engraving>
  );
};

/** The road back to Washington jammed (Harper's, by moonlight); nearly 5,000 men. */
const Road: React.FC<{t: TL}> = ({t}) => (
  <Photo src={HW} size={sizeOf(HW)} fx={2850} fy={2350} z0={1.25} z1={1.36} a={t.at('Carriages,') - 1} b={t.at('Both sides') - 1} vignette={0.5}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)'}} />
        <Note text="carriages, wagons, soldiers: one jammed road" x={110} y={80} size={50} rot={-2} at={t.at('Carriages,') - 3} color="#ffffff" />
        <Stamp text="NEARLY 5,000" x={110} y={700} at={t.at('5,000') - 1} size={140} color={CORAL} rot={-2} />
        <Note text="killed, wounded, captured or missing" x={120} y={880} size={50} rot={-2} at={t.at('killed,') - 3} color="#ffffff" />
        <Tag text="Retreat of our troops from Bull Run, by moonlight, Harper's Weekly, Aug 10, 1861 · Internet Archive" />
      </>
    )}
  </Photo>
);

/** The stampede from Bull Run: both sides learn the same thing. Hold. */
const Stampede: React.FC<{t: TL}> = ({t}) => (
  <Photo src={ILN} size={sizeOf(ILN)} fx={2050} fy={4330} z0={1.3} z1={1.38} a={t.at('Both sides') - 1} b={END} vignette={0.55}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 32%)'}} />
        <Note text="both sides learn the same thing" x={110} y={80} size={50} rot={-2} at={t.at('Both sides') - 3} color="#ffffff" />
        <Note text="this is not going to be quick." x={110} y={860} size={72} rot={-3} at={t.at('This is not') - 3} dur={16} />
        <Tag text="The stampede from Bull Run, Illustrated London News, Aug 17, 1861 · Internet Archive" />
      </>
    )}
  </Photo>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Forward t={t} />],
    [at('On July') - 1, <BullRun t={t} />],
    [at('And they have') - 1, <Spectators t={t} />],
    [at('Look at this') - 1, <DayOut t={t} />],
    [at('For a while') - 1, <Battle t={t} />],
    [at('the Union line') - 1, <Breaks t={t} />],
    [at('Carriages,') - 1, <Road t={t} />],
    [at('Both sides') - 1, <Stampede t={t} />],
  ];
  const scene = useScene(cuts);
  const notes = ['Northern', 'One big', 'a creek', 'company.', 'Congressmen,', 'picnic', 'War,', 'Basically', 'the game', 'the Union seems', 'Then Confederate',
    'right into', 'Carriages,', 'killed,', 'Both sides', 'This is not'];
  return (
    <>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['"Forward to', 'July', 'breaks.'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {notes.map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {['The Confederate capital', 'Bull Run'].map((c) => <Sfx key={c} at={at(c) - 2} src="sfx/tick.wav" volume={0.4} />)}
      <Sfx at={at('5,000') - 1} src="sfx/boom.wav" volume={0.28} />
    </>
  );
};

const TM = makeTimeline(N, 30);

export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch07_bull_run.wav" lead={LEAD} music={[
    {src: 'music/j_campaign.mp3', volume: 0.12, to: TM.at('Then Confederate') + 6},
    // war drums from ~40 s in; a music drop just before "This is not going to be quick."
    {src: 'music/m_war_drums.mp3', volume: 0.15, startFrom: 1200, from: TM.at('Then Confederate') - 6, to: TM.at('This is not') - 5, fadeOut: 4},
  ]}>
    <Body />
  </ChapterShell>
);
