// Chapter 1 · the cold open: the 13th Amendment's exception (six words), Lee marching north in 1863, the driving
// question, two battles in one week. Then the channel intro and the title card. Chapter 1 has no logo break in front.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import mapData from '../../public/maps/civwar1861.json';
import words from '../../public/audio/ch01_cold_open.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Finish, Highlight, JF, Note, PALETTES, PaletteCtx, Picture, StepCtx, Tag, useGFrame, usePal} from '../kit/Kit';
import {Sfx, WRITE} from '../kit/common';
import {ChannelIntro, INTRO_FRAMES} from '../kit/Intro';
import {Desk} from '../kit/bs';
import {Doc, sizeOf} from '../kit/dk';
import {AMEND, AMEND_NEITHER, AMEND_TAG, CORAL, exceptSwipe, SixWords, WHITE} from '../kit/except';
import {BORDER_1861, type Cam3, CONFEDERACY_1861, MAP3D, Map3D, type MapData, PlaceTag, Route, Stake, Stand, StateTiles, UNION_FREE_1861, Hand} from '../kit/map3d';
import {CropCard, Definition, fill, makeTimeline, type Narration, Photo, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';
import {DATES, SUBTITLE, TITLE} from '../project';

const N = words as Narration;
const D = mapData as unknown as MapData;
const pl = D.places as Record<string, [number, number]>;
/** Title card length (frames) after the channel intro. */
const TITLE_FRAMES = 150;
/** Narration ends; the channel intro starts 20 frames later. */
const END = Math.ceil(N.duration * 30) + 20;
export const CH01_FRAMES = END + INTRO_FRAMES + TITLE_FRAMES;

const LEE = 'img/ch01/lee_portrait_vannerson_1864.jpg';
const BATTLE = 'img/ch02/gettysburg_battle_july3_currier_1863.jpg';
const TOWN = 'img/ch02/gettysburg_town_from_cemetery_hill_1863.jpg';
const SIEGE = 'img/ch02/vicksburg_siege_grant_lithograph_1863.jpg';

/** Frame 0: the amendment on the desk. It ended slavery, and it has an exception. */
const Amendment: React.FC<{t: TL}> = ({t}) => (
  <Desk a={0} push={0.03}>
    <Doc src={AMEND} x={1180} y={120} w={620} rot={2} at={-10} />
    <Note text="the amendment that ended slavery" x={110} y={210} size={52} rot={-3} at={-6} color={WHITE} />
    <Note text="has an exception" x={140} y={360} size={70} rot={-3} at={t.at('exception') - 2} color={CORAL} />
    <Note text="in its very first sentence" x={160} y={500} size={52} rot={-3} at={t.at('first sentence') - 2} />
    <Tag text={AMEND_TAG} />
  </Desk>
);

/** Here it is: the 13th Amendment, and what an amendment is. */
const HereItIs: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Here it is') - 1;
  return (
    <Desk a={a} push={0.03}>
      <Doc src={AMEND} x={1060} y={110} w={720} rot={-2} at={a} push={[a, t.at('Neither')]} fx={1300} fy={1500} zoom={1.08} />
      <Highlight text="13TH AMENDMENT" x={110} y={150} size={92} at={t.at('13th')} seed={12} rot={-2} />
      <Definition term="a·mend·ment" def="a change added to the Constitution, the country's rulebook" at={t.at('An amendment') + 2} x={120} y={340} w={780} />
      <Note text="the country's rulebook" x={140} y={640} size={54} rot={-3} at={t.at('rulebook') - 2} />
      <Tag text={AMEND_TAG} />
    </Desk>
  );
};

/** The line itself, close: "Neither slavery ..." then the six words, swiped. */
const SixWordsScene: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Neither') - 1;
  const w = 1700;
  const sc = w / sizeOf(AMEND)[0];
  return (
    <Desk a={a} push={0.02}>
      <Doc src={AMEND} x={110} y={540 - 1530 * sc} w={w} rot={-1} at={a} push={[a, t.at('But first')]} fx={720} fy={1560} zoom={1.08}
        marks={[{at: t.at('Neither'), to: t.at('exist') , swipe: [AMEND_NEITHER]}, exceptSwipe(t.at('except as'), t.end('crime'))]} />
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(10,9,7,0.95) 0%, rgba(10,9,7,0.85) 26%, rgba(0,0,0,0) 44%)'}} />
      <SixWords x={110} y={790} at={t.at('Except as', 2)} size={70} />
      <Note text="six words" x={130} y={940} size={52} rot={-3} at={t.at('Six words') - 2} color={WHITE} />
      <Note text="hold onto them" x={520} y={940} size={52} rot={-3} at={t.at('Hold onto') - 2} color={CORAL} />
      <Note text="we'll come back to them" x={1020} y={940} size={52} rot={-3} at={t.at("We'll come") - 2} />
      <Tag text={AMEND_TAG} x={44} y={40} />
    </Desk>
  );
};

/** But first, the war: Lee, 1863. */
const Lee: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('But first') - 1;
  return (
    <Desk a={a} push={0.03}>
      <CropCard src={LEE} size={sizeOf(LEE)} x={180} y={130} w={520} h={760} fx={930} fy={1300} scale={0.36} rot={-2} at={a} mask={MASKS.lee} tintStrength={0.6} traceAt={t.at('Robert') + 2} />
      <Note text="but first:" x={860} y={150} size={52} rot={-3} at={a + 2} color={WHITE} />
      <Note text="the Union had to win a war" x={880} y={270} size={56} rot={-3} at={t.at('the Union had') - 2} />
      <Note text="it still wasn't sure it could win" x={900} y={390} size={56} rot={-3} at={t.at("wasn't sure") - 2} color={CORAL} />
      <Highlight text="ROBERT E. LEE" x={880} y={600} size={84} at={t.at('Robert')} seed={14} rot={-2} />
      <Tag text="Julian Vannerson, Robert E. Lee, 1864 · Library of Congress" />
    </Desk>
  );
};

/** Summer 1863: Lee's army marches north into Pennsylvania. */
const March: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('In the summer') - 1;
  const keys: Cam3[] = [{f: a, x: 3700, y: 2050, z: 0.75, tilt: 34, rot: 0}, {f: t.at("So here's") - 1, x: 3760, y: 1880, z: 0.95, tilt: 42, rot: -4}];
  const start: [number, number] = [3640, 2060];
  const pts = [start, [3600, 1920], [3690, 1800], [3790, 1690], pl.gettysburg];
  const go = t.at('marching') - 4;
  return (
    <>
      <Map3D data={D} keys={keys} states={0.6} rivers={0.5}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={-20} stagger={0} h={14} color={MAP3D.free} />
            <StateTiles api={api} names={BORDER_1861} at={-20} stagger={0} h={18} color={MAP3D.grey} />
            <StateTiles api={api} names={CONFEDERACY_1861} at={-20} stagger={0} h={30} color={CORAL} />
            <Route api={api} pts={pts} at={go} dur={36} color={MAP3D.us} width={12} bow={0} />
            <Stand api={api} at={pl.gettysburg} show={t.at('Pennsylvania') - 2}><Stake color={MAP3D.us} /></Stand>
            <Stand api={api} at={[pl.gettysburg[0] - 300, pl.gettysburg[1] - 40]} z={90} show={t.at('Pennsylvania')}><PlaceTag text="Pennsylvania" size={34} /></Stand>
            <Stand api={api} at={[start[0] - 330, start[1] + 40]} z={60} show={go + 4}><Hand text="Lee's army" size={64} color={MAP3D.us} bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.7) 0%, rgba(0,0,0,0) 30%)'}} />
        <Highlight text="SUMMER 1863" x={110} y={100} size={92} at={t.at('1863') - 1} seed={15} rot={-2} />
        <Note text="marching into Pennsylvania" x={130} y={260} size={52} rot={-3} at={t.at('marching') - 2} color={WHITE} />
        <Tag text="Map · Lee's army marches north, summer 1863" />
      </AbsoluteFill>
    </>
  );
};

/** The driving question, over the Currier & Ives Gettysburg print. */
const Question: React.FC<{t: TL}> = ({t}) => {
  const a = t.at("So here's") - 1;
  return (
    <Photo src={BATTLE} size={sizeOf(BATTLE)} fx={1900} fy={900} z0={1.25} z1={1.36} a={a} b={t.at('It starts') + 10} bw="grayscale(1) contrast(1.2) brightness(0.62)">
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(to right, rgba(10,9,7,0.9) 0%, rgba(10,9,7,0.7) 45%, rgba(0,0,0,0.1) 70%)'}} />
          <Note text="the question:" x={110} y={110} size={52} rot={-3} at={t.at('question') - 2} color={WHITE} />
          <Note text="how was the war finally decided?" x={130} y={250} size={70} rot={-3} at={t.at('How was') - 2} />
          <Note text="what did it settle for good?" x={150} y={460} size={62} rot={-3} at={t.at('settled') - 4} color={WHITE} />
          <Note text="what did it leave open?" x={170} y={640} size={70} rot={-3} at={t.at('left open') - 3} color={CORAL} />
          <Tag text="Currier & Ives, The Battle of Gettysburg, Pa. July 3d 1863 · Library of Congress" />
        </>
      )}
    </Photo>
  );
};

/** Two battles in the same week, hundreds of miles apart. */
const TwoBattles: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('It starts') - 1;
  return (
    <Desk a={a} push={0.03}>
      <CropCard src={TOWN} size={sizeOf(TOWN)} x={150} y={250} w={700} h={480} fx={1500} fy={1150} scale={0.3} rot={-3} at={a + 2} />
      <CropCard src={SIEGE} size={sizeOf(SIEGE)} x={1070} y={280} w={700} h={480} fx={1500} fy={1200} scale={0.3} rot={2} at={a + 6} />
      <Note text="two battles, the same week" x={150} y={70} size={60} rot={-3} at={t.at('two battles') - 2} color={WHITE} />
      <Note text="Gettysburg" x={240} y={810} size={60} rot={-3} at={a + 4} />
      <Note text="Vicksburg" x={1180} y={830} size={60} rot={-3} at={a + 8} />
      <Arrow x1={880} y1={520} x2={1040} y2={520} bow={-30} at={t.at('hundreds') - 2} dur={6} />
      <Note text="hundreds of miles apart" x={620} y={940} size={50} rot={-2} at={t.at('hundreds') - 2} color={CORAL} />
      <Tag text="Gettysburg from Cemetery Hill, 1863 · The Siege of Vicksburg, lithograph, 1863 · Library of Congress" />
    </Desk>
  );
};

/** Title card after the channel intro: the amendment, dimmed; title on orange; subtitle in teal. */
const Title: React.FC = () => {
  const g = useGFrame();
  const f = useCurrentFrame();
  const pal = usePal();
  const size = sizeOf(AMEND);
  return (
    <AbsoluteFill style={{background: '#0b0a08'}}>
      <Picture src={AMEND} place={fill(size, 1100, 1560, 1.5 + f * 0.0006)} size={size} bw="grayscale(1) sepia(0.3) contrast(1.2) brightness(0.4)" />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(8,6,4,0.2) 30%, rgba(8,6,4,0.85) 100%)'}} />
      <Highlight text={TITLE} x={170} y={330} size={150} at={4} seed={61} rot={-2} />
      {g >= 14 && <div style={{position: 'absolute', left: 210, top: 580, fontFamily: JF.display, fontSize: 46, color: pal.mark, whiteSpace: 'nowrap', textShadow: '0 3px 16px rgba(0,0,0,0.8)', opacity: interpolate(g, [14, 20], [0, 1], clamp)}}>{SUBTITLE}</div>}
      <Note text={DATES} x={1300} y={720} size={56} rot={-5} at={24} />
      <Tag text={AMEND_TAG} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  // [cut frame, scene]: cut 1 frame before the word that starts the new idea
  const cuts: [number, React.ReactNode][] = [
    [0, <Amendment t={t} />],
    [at('Here it is') - 1, <HereItIs t={t} />],
    [at('Neither') - 1, <SixWordsScene t={t} />],
    [at('But first') - 1, <Lee t={t} />],
    [at('In the summer') - 1, <March t={t} />],
    [at("So here's") - 1, <Question t={t} />],
    [at('It starts') - 1, <TwoBattles t={t} />],
  ];
  let scene = useScene(cuts);
  if (frame >= END + INTRO_FRAMES) scene = <Sequence from={END + INTRO_FRAMES} layout="none"><Title /></Sequence>;
  else if (frame >= END) scene = <Sequence from={END} layout="none"><ChannelIntro /></Sequence>;
  const notes = ['exception', 'first sentence', 'rulebook', 'Six words', 'Hold onto', "We'll come", 'the Union had', "wasn't sure", 'marching', 'question', 'How was', 'two battles', 'hundreds'];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {frame < END && <Finish vignette={0.3} />}
      <Audio src={staticFile('audio/ch01_cold_open.wav')} />
      <Audio src={staticFile('music/j_cold_open.mp3')} volume={(f) => interpolate(f, [0, 15, END - 70, END - 10], [0, 0.111, 0.111, 0], clamp)} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.32} />)}
      {['13th', 'Robert'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      <Sfx at={at('Except as', 2)} src="sfx/stamp.wav" volume={0.3} />
      <Sfx at={at('1863') - 1} src="sfx/stamp.wav" volume={0.26} />
      {notes.map((c) => <Sfx key={c} at={at(c) - 4} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('except as') - 2} src="sfx/marker_tick.wav" volume={0.2} />
      <Sfx at={END + INTRO_FRAMES + 4} src="sfx/stamp.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Ch01: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
