// Chapter 8 · What It Settled: back to the question (decided on the battlefield), who carried it, the two things it
// settled, what it left open, Reconstruction, the six words one last time, and the built-in end screen.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import mapData from '../../public/maps/civwar1861.json';
import words from '../../public/audio/ch08_what_it_settled.words.json';
import {clamp} from '../lib/anim';
import {Highlight, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {Sfx, WRITE} from '../kit/common';
import {Desk, DropCard} from '../kit/bs';
import {Doc, sizeOf} from '../kit/dk';
import {AMEND, AMEND_TAG, Box, CORAL, exceptSwipe, SixWords, WHITE} from '../kit/except';
import {
  Border, BORDER_1861, type Cam3, CONFEDERACY_1861, MAP3D, Map3D, type MapData, PlaceTag, Stake, Stand, StateTiles, UNION_FREE_1861,
} from '../kit/map3d';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, Photo, type TL, useScene} from '../kit/shell';

const N = words as Narration;
const D = mapData as unknown as MapData;
const pl = D.places as Record<string, [number, number]>;
/** The end screen: after the last word, this many frames more (YouTube's end-screen elements sit here). */
const EXTRA = 200;
export const CH08_FRAMES = chapterFrames(N, LEAD) + EXTRA;

const SUBST = 'img/ch04/wanted_a_substitute_sheet_music_1863.jpg';
const USCT = 'img/ch08/company_e_4th_usct_fort_lincoln_c1864.jpg';
const FARM = 'img/gen/v3_ch05_georgia_farm.jpg';
const VOTE = 'img/ch08/first_vote_harpers_1867.jpg';
const SCHOOL = 'img/ch08/freedmen_school_vicksburg_waud_1866.jpg';
const EDISTO = 'img/ch08/freedmen_school_edisto_island.jpg';
const DOC = 'grayscale(1) sepia(0.3) contrast(1.12)';
const ALL_STATES = [...UNION_FREE_1861, ...BORDER_1861, ...CONFEDERACY_1861];

/** How was the war decided? Mostly on the battlefield: Gettysburg, Vicksburg, Atlanta. */
const Decided: React.FC<{t: TL}> = ({t}) => {
  const keys: Cam3[] = [{f: -10, x: 2800, y: 2350, z: 0.36, tilt: 30, rot: 0}, {f: t.at('And the people'), x: 2800, y: 2400, z: 0.4, tilt: 38, rot: -4}];
  const gb = t.at('Gettysburg ended') - 2;
  const vb = t.at('Vicksburg cut') - 2;
  const at = t.at('Atlanta saved') - 2;
  return (
    <>
      <Map3D data={D} keys={keys} states={0.5} rivers={0.4}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={-20} stagger={0} h={12} color={MAP3D.free} />
            <StateTiles api={api} names={BORDER_1861} at={-20} stagger={0} h={14} color={MAP3D.grey} />
            <StateTiles api={api} names={CONFEDERACY_1861} at={-20} stagger={0} h={28} color={CORAL} />
            <Stand api={api} at={pl.gettysburg} show={gb}><Stake color={MAP3D.us} /></Stand>
            <Stand api={api} at={[pl.gettysburg[0] - 300, pl.gettysburg[1] - 160]} z={80} show={gb + 2}><PlaceTag text="Gettysburg" size={34} /></Stand>
            <Stand api={api} at={pl.vicksburg} show={vb}><Stake color={MAP3D.us} /></Stand>
            <Stand api={api} at={[pl.vicksburg[0] - 360, pl.vicksburg[1] + 120]} z={80} show={vb + 2}><PlaceTag text="Vicksburg" size={34} /></Stand>
            <Border api={api} d={D.lines.lowerMississippi} at={vb + 4} dur={18} color={MAP3D.mexico} width={9} z={34} />
            <Stand api={api} at={pl.atlanta} show={at}><Stake color={MAP3D.us} /></Stand>
            <Stand api={api} at={[pl.atlanta[0] - 120, pl.atlanta[1] + 140]} z={80} show={at + 2}><PlaceTag text="Atlanta" size={34} /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.82) 0%, rgba(0,0,0,0) 36%)'}} />
        <Note text="so: how was the war decided?" x={140} y={100} size={52} rot={-3} at={t.at('How was') - 2} color={WHITE} />
        <Note text="mostly on the battlefield" x={160} y={210} size={54} rot={-3} at={t.at('Mostly') - 2} />
        <Note text="Gettysburg: ended Lee's invasions" x={1000} y={100} size={40} rot={-3} at={gb} color={WHITE} />
        <Note text="Vicksburg: cut it in two" x={1010} y={190} size={40} rot={-3} at={vb} color={WHITE} />
        <Note text="Atlanta: saved Lincoln's presidency" x={1000} y={280} size={40} rot={-3} at={at} color={WHITE} />
        <Tag text="Map · Gettysburg, Vicksburg and Atlanta" />
      </AbsoluteFill>
    </>
  );
};

/** The people who carried the war. */
const Carried: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('And the people') - 1;
  return (
    <Desk a={a} push={0.02}>
      <Note text="who carried the war? often, the ones with the least say:" x={150} y={100} size={42} rot={-2} at={a + 2} color={WHITE} />
      <DropCard src={SUBST} x={150} y={220} w={430} rot={-3} at={t.at('poor men') - 2} filter={DOC} />
      <DropCard src={USCT} x={700} y={260} w={560} rot={2} at={t.at('Black soldiers') - 2} />
      <DropCard src={FARM} x={1340} y={240} w={440} rot={-2} at={t.at('civilians') - 2} />
      <Note text="poor men who couldn't pay $300" x={140} y={700} size={44} rot={-3} at={t.at('poor men') - 2} />
      <Note text="Black soldiers, paid less to fight" x={720} y={790} size={44} rot={-3} at={t.at('Black soldiers') - 2} />
      <Note text="civilians in the army's path" x={1120} y={880} size={44} rot={-3} at={t.at('civilians') - 2} />
      <Tag text="Wanted a Substitute, 1863 · Company E, 4th U.S. Colored Infantry, Fort Lincoln, D.C. · Library of Congress · Illustration · a Georgia farm, 1864" />
    </Desk>
  );
};

/** What did it settle? Two big things. */
const Settled: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('What did it settle') - 1;
  return (
    <Desk a={a} push={0.02}>
      <Doc src={AMEND} x={1240} y={130} w={560} rot={2} at={t.at('And slavery') - 2} marks={[{at: t.at('written') - 2, to: t.at('written') + 14, swipe: [[1132, 1424, 2290, 1500]]}]} />
      <Highlight text="WHAT IT SETTLED" x={124} y={80} size={84} at={t.at('settle')} seed={81} rot={-2} />
      <Note text="two big things" x={140} y={240} size={52} rot={-3} at={t.at('Two big') - 2} color={WHITE} />
      <Box x={140} y={360} w={940} h={160} at={t.at('No state') - 2} label="1 · no state could leave the Union" size={50} font="hand" seed={82} />
      <Box x={140} y={580} w={940} h={160} at={t.at('And slavery') - 2} label="2 · slavery was over, in the Constitution" size={50} font="hand" seed={83} color={CORAL} />
      <Note text="where no president or court could easily undo it" x={150} y={800} size={40} rot={-2} at={t.at('no president') - 2} color={WHITE} />
      <Tag text={AMEND_TAG} />
    </Desk>
  );
};

/** What did it leave open? Almost everything else. */
const LeftOpen: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('What did it leave') - 1;
  return (
    <Desk a={a} push={0.02}>
      <Doc src={VOTE} x={1220} y={70} w={580} rot={2} at={a} push={[a, t.at('The war answered')]} fx={1000} fy={1500} zoom={1.08} />
      <Highlight text="WHAT IT LEFT OPEN" x={124} y={80} size={80} at={t.at('leave open') - 1} seed={84} rot={-2} />
      <Note text="almost everything else" x={140} y={240} size={56} rot={-3} at={t.at('Almost') - 2} color={WHITE} />
      <Note text="were freed people citizens?" x={150} y={400} size={56} rot={-3} at={t.at('Were freed') - 2} />
      <Note text="could they vote?" x={170} y={530} size={64} rot={-3} at={t.at('Could they') - 2} color={CORAL} />
      <Note text="who would protect their rights?" x={150} y={680} size={56} rot={-3} at={t.at('Who would') - 2} />
      <Note text="Washington, or the states?" x={170} y={800} size={52} rot={-3} at={t.at('Washington or') - 2} color={WHITE} />
      <Tag text="A. R. Waud, The First Vote, Harper's Weekly, November 16, 1867 · Library of Congress" />
    </Desk>
  );
};

/** Together, yes. What kind of country, no. */
const WhatKind: React.FC<{t: TL}> = ({t}) => (
  <Photo src={SCHOOL} size={sizeOf(SCHOOL)} fx={1500} fy={1250} z0={1.15} z1={1.22} a={t.at('The war answered') - 1} b={t.at('That fight')} bw="grayscale(1) contrast(1.2) brightness(0.55)">
    {() => (
      <>
        <Note text="the war answered:" x={124} y={140} size={52} rot={-3} at={t.at('The war answered') + 1} color={WHITE} />
        <Note text="would the country stay together?" x={150} y={260} size={66} rot={-3} at={t.at('stay together') - 4} />
        <Note text="it didn't answer:" x={124} y={520} size={52} rot={-3} at={t.at("It didn't") - 2} color={WHITE} />
        <Note text="what kind of country would it be?" x={150} y={640} size={66} rot={-3} at={t.at('what kind') - 2} color={CORAL} />
        <Tag text="A. R. Waud, primary school for freedmen, Vicksburg, Harper's Weekly, 1866 · Library of Congress" />
      </>
    )}
  </Photo>
);

/** That fight is called Reconstruction. */
const Reconstruction: React.FC<{t: TL}> = ({t}) => (
  <Photo src={EDISTO} size={sizeOf(EDISTO)} fx={1500} fy={1000} z0={1.12} z1={1.2} a={t.at('That fight') - 1} b={t.at('And it started')} bw="grayscale(1) contrast(1.2) brightness(0.8)">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(10,9,7,0.92) 0%, rgba(10,9,7,0.7) 30%, rgba(0,0,0,0) 50%)'}} />
        <Note text="that fight is called" x={124} y={560} size={52} rot={-3} at={t.at('That fight') + 1} color={WHITE} />
        <Highlight text="RECONSTRUCTION" x={124} y={660} size={100} at={t.at('Reconstruction')} seed={85} rot={-2} />
        <Definition term="Re·con·struc·tion" def="the years when the country tried to rebuild the South and decide what freedom would mean" at={t.at('the years') - 1} x={130} y={850} w={1300} />
        <Tag text="Freedmen's school, Edisto Island, South Carolina, 1860s · Library of Congress" x={44} y={40} />
      </>
    )}
  </Photo>
);

/** And it started with six words. The last image before the end screen. */
const SixWordsEnd: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('And it started') - 1;
  const w = 1700;
  const sc = w / sizeOf(AMEND)[0];
  return (
    <Desk a={a} push={0.02}>
      <Doc src={AMEND} x={110} y={480 - 1530 * sc} w={w} rot={-1} at={a} push={[a, t.at('Thanks')]} fx={720} fy={1560} zoom={1.12} marks={[exceptSwipe(t.at('Except') - 2, t.end('crime'))]} />
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(10,9,7,0.95) 0%, rgba(10,9,7,0.85) 26%, rgba(0,0,0,0) 44%)'}} />
      <Note text="and it started with six words" x={130} y={760} size={54} rot={-3} at={a + 2} color={WHITE} />
      <SixWords x={124} y={870} at={t.at('Except')} size={70} />
      <Tag text={AMEND_TAG} x={44} y={40} />
    </Desk>
  );
};

/** The end screen: the whole map, one country again, drifting; two video slots, a subscribe circle, thanks. */
const EndScreen: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('Thanks') - 1;
  const k = interpolate(g, [a, a + 18], [0, 1], clamp);
  const keys: Cam3[] = [
    {f: a, x: 2900, y: 2500, z: 0.34, tilt: 40, rot: 0},
    {f: a + 600, x: 2700, y: 2700, z: 0.38, tilt: 44, rot: -6},
  ];
  const slot = (x: number, y: number, at: number) => (
    <div style={{position: 'absolute', left: x, top: y, width: 640, height: 360, border: `5px solid ${pal.mark}`, borderRadius: 10, background: 'rgba(10,10,10,0.55)',
      opacity: interpolate(g, [at, at + 10], [0, 1], clamp), boxShadow: '0 16px 30px rgba(0,0,0,0.5)'}} />
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: `brightness(${1 - 0.55 * k})`}}>
        <Map3D data={D} keys={keys} states={0.5}>
          {(api) => <StateTiles api={api} names={ALL_STATES} at={-99} stagger={0} h={20} color={MAP3D.free} />}
        </Map3D>
      </AbsoluteFill>
      {slot(124, 150, a + 6)}
      {slot(124, 590, a + 12)}
      <div style={{position: 'absolute', left: 1240, top: 200, width: 330, height: 330, borderRadius: '50%', border: `5px solid ${pal.mark}`, background: 'rgba(10,10,10,0.55)',
        opacity: interpolate(g, [a + 18, a + 28], [0, 1], clamp)}} />
      <Note text="thanks for watching" x={1060} y={600} size={62} rot={-3} at={a + 4} color={WHITE} />
      <Note text="the whole series: parts 1 and 2" x={950} y={720} size={50} rot={-3} at={t.at('more stories') - 2} color={CORAL} />
      <Note text="subscribe ↑" x={1270} y={840} size={54} rot={-3} at={t.at('subscribe') - 2} />
      <Tag text="Map · the United States, 1865" />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Decided t={t} />],
    [at('And the people') - 1, <Carried t={t} />],
    [at('What did it settle') - 1, <Settled t={t} />],
    [at('What did it leave') - 1, <LeftOpen t={t} />],
    [at('The war answered') - 1, <WhatKind t={t} />],
    [at('That fight') - 1, <Reconstruction t={t} />],
    [at('And it started') - 1, <SixWordsEnd t={t} />],
    [at('Thanks') - 1, <EndScreen t={t} />],
  ];
  const writes = ['How was', 'Mostly', 'Gettysburg ended', 'Vicksburg cut', 'Atlanta saved', 'poor men', 'Black soldiers', 'civilians', 'Two big', 'no president', 'Almost',
    'Were freed', 'Could they', 'Who would', 'Washington or', 'stay together', "It didn't", 'what kind', 'more stories', 'subscribe'];
  return (
    <>
      {useScene(cuts)}
      {cuts.slice(1).map(([f], i) => <Sfx key={`c${i}`} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['settle', 'Reconstruction', 'Except'].map((p) => <Sfx key={p} at={at(p) - 1} src="sfx/stamp.wav" volume={0.27} />)}
      <Sfx at={at('leave open') - 1} src="sfx/stamp.wav" volume={0.27} />
      {writes.map((p) => <Sfx key={p} at={at(p) - 4} src={WRITE.src} volume={WRITE.volume} />)}
      {['No state', 'And slavery'].map((p) => <Sfx key={p} at={at(p) - 2} src="sfx/tick.wav" volume={0.4} />)}
    </>
  );
};

export const Ch08: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch08_what_it_settled.wav" lead={LEAD} extra={EXTRA} music={[{src: 'music/r_ending.mp3', volume: 0.057}]}>
    <Body />
  </ChapterShell>
);
