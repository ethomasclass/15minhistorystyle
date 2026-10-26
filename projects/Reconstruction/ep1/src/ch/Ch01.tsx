// Chapter 1 · "A Few Acres": the cold open on the Edisto petition (hook first: the letter is on screen at frame 0), the
// question, the petition landing on the board, then the channel intro and the title card. No logo break in front.
// Sources: the committee's petition to the President, Oct. 28, 1865, its Executive Office docket, and their letter to
// Gen. Howard with the three words (National Archives, M752); Henry P. Moore's Edisto Island photographs, 1862 (LOC).
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch01_cold_open.words.json';
import {clamp} from '../lib/anim';
import {Finish, Highlight, JF, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx} from '../kit/common';
import {EpBoard} from '../kit/ep1board';
import {ChannelIntro, INTRO_FRAMES} from '../kit/Intro';
import {type Box, cut, DocShot, EDISTO, Motif, PETITION_P1, PETITION_P3, Slip, Spot, SRC, Swipe, THREE_WORDS} from '../kit/rc';
import {makeTimeline, type Narration, Photo, useScene} from '../kit/shell';
import {DATES, SUBTITLE} from '../project';

const N = words as Narration;
const t = makeTimeline(N, 30);
/** Title card length (frames) after the channel intro. */
const TITLE_FRAMES = 150;
/** Narration ends; the board holds a little longer, then the channel intro. */
const END = Math.ceil(N.duration * 30) + 45;
export const CH01_FRAMES = END + INTRO_FRAMES + TITLE_FRAMES;

const DOCKET = 'img/ch01/edisto_petition_docket_P27_1865.jpg';
const DOCKET_S: [number, number] = [2091, 2829];
const P1_TO: Box = [55, 160, 1200, 80];          // "To the President of these United States."
const P1_PLACE: Box = [840, 40, 600, 95];        // "Edisto Island S.C."
const P1_DATE: Box = [1360, 110, 310, 85];        // "Oct 28th 1865"
const D_RESTORE: Box[] = [[640, 1035, 980, 70], [640, 1110, 700, 70]]; // "restoration of those lands / to the Rebel owners"
const D_ORDER: Box = [660, 1565, 900, 80];        // "By order of the President"
const MOORE = (what: string) => `Henry P. Moore, ${what}, Edisto Island, S.C., 1862 · Library of Congress`;

// the shots (cut two frames before the phrase)
const S_REQ = cut(t, 'It came'), S_NO = cut(t, 'The President had'), S_LETTER = cut(t, 'This is their'), S_NAMES = cut(t, 'Henry Bram');
const S_LAND = cut(t, "Here's what"), S_PLANT = cut(t, 'They had planted'), S_BACK = cut(t, 'Now the government'), S_WORDS = cut(t, 'A week earlier');
const S_Q = cut(t, "So here's"), S_BOARD = cut(t, "We'll come back");

/** Frame 0: the letter itself, to the President. */
const Hook: React.FC = () => (
  <DocShot src={PETITION_P1} size={EDISTO.p1Size} seed="p1" tag={SRC.petition}
    keys={[[0, {x: 900, y: 420, z: 0.86}], [S_REQ, {x: 820, y: 330, z: 0.96}]]}
    over={<Slip text="Edisto Island, South Carolina" x={1080} y={760} size={56} at={t.at('island')} />}>
    <Swipe lines={[P1_PLACE]} from={t.at('island')} to={t.end('Carolina')} seed="h0" />
    <Swipe lines={[P1_TO]} from={t.at('the President')} to={t.end('States')} seed="h1" />
  </DocShot>
);

/** The one request, read in their own hand: the page laid back, the swipe at reading speed. */
const Request: React.FC = () => (
  <DocShot src={PETITION_P3} size={EDISTO.p3Size} seed="p3" tag={SRC.petition} focusAt={S_REQ}
    keys={[[S_REQ, {x: 905, y: 500, z: 0.7, tilt: 0, dof: 0, band: 400}], [t.at('We wish'), {x: 1050, y: 290, z: 0.9, tilt: 26, dof: 2.4, band: 120, dofY: 290}],
      [t.at('It be'), {x: 550, y: 365, z: 0.95, tilt: 26, dof: 2.4, band: 120, dofY: 365}], [S_NO, {x: 410, y: 365, z: 0.98, tilt: 26, dof: 2.4, band: 120, dofY: 365}]]}>
    <Swipe lines={EDISTO.fewAcres} from={t.at('We wish')} to={t.end('acres')} seed="fa" />
  </DocShot>
);

/** The President's office filed it and sent it back to the general. */
const Docket: React.FC = () => (
  <DocShot src={DOCKET} size={DOCKET_S} seed="dk" tag="Executive Office docket of the petition, Nov. 1865 · National Archives (M752)"
    keys={[[S_NO, {x: 1130, y: 1150, z: 0.74}], [S_LETTER, {x: 1130, y: 1200, z: 0.8}]]}>
    <Swipe lines={D_RESTORE} from={t.at('already')} to={t.end('no') + 6} seed="dr" />
  </DocShot>
);

/** Their letter: the date, then the handwriting with the page tilted back and a narrow band in focus. */
const Letter: React.FC = () => (
  <DocShot src={PETITION_P1} size={EDISTO.p1Size} seed="p1" tag={SRC.petition}
    keys={[[S_LETTER, {x: 1000, y: 560, z: 0.62}], [t.at('October'), {x: 1200, y: 360, z: 0.82}],
      [t.at('Look at'), {x: 900, y: 1020, z: 0.66, tilt: 34, dof: 2.6, band: 110, dofY: 1020}], [S_NAMES, {x: 900, y: 1320, z: 0.74, tilt: 34, dof: 2.6, band: 110, dofY: 1320}]]}
    over={<Slip text="S.C. law since 1834: no teaching them to write" x={250} y={850} size={54} at={t.at('against the law')} />}>
    <Swipe lines={[P1_DATE]} from={t.at('October')} to={t.end('1865')} seed="dt" />
  </DocShot>
);

/** The three names, each in his own hand. */
const Names: React.FC = () => (
  <DocShot src={PETITION_P3} size={EDISTO.p3Size} seed="p3" tag={SRC.petition}
    keys={[[S_NAMES, {x: 1330, y: 1700, z: 0.95}], [S_LAND, {x: 1350, y: 1730, z: 1.02}]]}
    over={<>
      <Slip text="Henry Bram" x={1280} y={440} size={46} at={t.at('Henry Bram')} coral />
      <Slip text="Ishmael Moultrie" x={1280} y={530} size={46} at={t.at('all three')} />
      <Slip text="Yates Sampson" x={1280} y={620} size={46} at={t.at('signed')} />
    </>}>
    <Spot size={EDISTO.p3Size} boxes={[EDISTO.bram, EDISTO.moultrie, EDISTO.sampson]} at={t.at('all three')} id="names" dark={0.45} />
    <Swipe lines={[EDISTO.bram]} from={t.at('Henry Bram')} to={t.end('anyway')} seed="n1" />
    <Swipe lines={[EDISTO.moultrie]} from={t.at('all three')} to={t.at('signed')} seed="n2" />
    <Swipe lines={[EDISTO.sampson]} from={t.at('signed')} to={t.end('names')} seed="n3" />
  </DocShot>
);

/** Moore's 1862 photographs of the island under the Union army. */
const Island: React.FC = () => (
  <Photo src="img/ch01/edisto_freedpeople_hopkinson_plantation_1862_moore.jpg" size={[3000, 2055]} fx={1500} fy={1000} z0={1.03} z1={1.12} a={S_LAND} b={S_PLANT}>
    {() => (
      <>
        <Slip text="spring 1865: the war ends" x={140} y={130} size={56} at={t.at('Civil War ended')} />
        <Slip text="Edisto, 1862" x={1450} y={830} size={52} rot={2} at={t.at('islands like')} />
        <Tag text={MOORE("freedpeople at Hopkinson's plantation")} />
      </>
    )}
  </Photo>
);
const Planted: React.FC = () => (
  <Photo src="img/ch01/edisto_sweet_potato_planting_hopkinson_1862_moore.jpg" size={[3000, 2286]} fx={1500} fy={1150} z0={1.05} z1={1.14} a={S_PLANT} b={S_BACK}>
    {() => <Tag text={MOORE("sweet potato planting, Hopkinson's plantation")} />}
  </Photo>
);
const Mansion: React.FC = () => (
  <Photo src="img/ch05/edisto_hopkinson_mansion_1862_moore.jpg" size={[3000, 2301]} fx={1500} fy={1100} z0={1.04} z1={1.12} a={S_BACK} b={S_WORDS}>
    {() => (
      <>
        <Slip text="back to the old owners" x={1180} y={140} size={58} at={t.at('handing it back')} coral />
        <Tag text={MOORE('the mansion of James Hopkinson')} />
      </>
    )}
  </Photo>
);

/** Three words, a week earlier, in Henry Bram's hand: each one swiped as it's said. */
const Words: React.FC = () => (
  <DocShot src={THREE_WORDS} size={EDISTO.wordsSize} seed="lhv" tag={SRC.letter} focusAt={S_WORDS}
    keys={[[S_WORDS, {x: 850, y: 480, z: 1.0}], [t.at('Landless') - 8, {x: 600, y: 420, z: 1.5}], [S_Q, {x: 620, y: 420, z: 1.6}]]}>
    <Swipe lines={[EDISTO.landless]} from={t.at('Landless')} to={t.end('Landless')} seed="w1" />
    <Swipe lines={[EDISTO.homeless]} from={t.at('Homeless')} to={t.end('Homeless')} seed="w2" />
    <Swipe lines={[EDISTO.voteless]} from={t.at('Voteless')} to={t.end('Voteless')} seed="w3" />
  </DocShot>
);

/** The driving question, under the three words. */
const Question: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Motif x={460} y={110} w={1000} at={S_Q} />
    <Slip text="the war: over" x={250} y={360} size={60} at={t.at('war was over')} />
    <Slip text="slavery: over" x={900} y={350} size={60} rot={2} at={t.at('Slavery was over')} />
    <Highlight text="WHO DECIDED" x={240} y={520} size={104} at={t.at('Who got')} seed={21} rot={-2} />
    <Slip text="what freedom would look like?" x={300} y={690} size={64} at={t.at('freedom')} />
    <Slip text="why was the land going back?" x={760} y={840} size={64} rot={-2} at={t.at('why was')} coral />
    <Tag text={SRC.letter} />
  </AbsoluteFill>
);

/** Title card after the channel intro: the petition dimmed behind, the three words stacked on orange. */
const Title: React.FC = () => {
  const g = useGFrame();
  const f = useCurrentFrame();
  const pal = usePal();
  return (
    <AbsoluteFill style={{background: '#0d0c09'}}>
      <AbsoluteFill style={{opacity: 0.35, filter: 'blur(2px)'}}>
        <DocShot src={PETITION_P1} size={EDISTO.p1Size} seed="tt" tag="" keys={[[0, {x: 900, y: 800, z: 0.75 + f * 0.0004}], [200, {x: 900, y: 800, z: 0.83}]]} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 45% 50%, rgba(8,6,4,0.25) 30%, rgba(8,6,4,0.88) 100%)'}} />
      <Highlight text="LANDLESS," x={250} y={170} size={150} at={4} seed={61} rot={-2} />
      <Highlight text="HOMELESS," x={330} y={370} size={150} at={10} seed={62} rot={-2} />
      <Highlight text="VOTELESS" x={410} y={570} size={150} at={16} seed={63} rot={-2} />
      {g >= 24 && <div style={{position: 'absolute', left: 430, top: 800, fontFamily: JF.display, fontSize: 64, color: pal.mark, textShadow: '0 3px 16px rgba(0,0,0,0.8)',
        opacity: interpolate(g, [24, 30], [0, 1], clamp)}}>{SUBTITLE}</div>}
      <Slip text={DATES} x={1380} y={830} size={60} rot={-4} at={32} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const shots: [number, React.ReactNode][] = [
    [0, <Hook key="h" />],
    [S_REQ, <Request key="r" />],
    [S_NO, <Docket key="d" />],
    [S_LETTER, <Letter key="l" />],
    [S_NAMES, <Names key="n" />],
    [S_LAND, <Island key="i" />],
    [S_PLANT, <Planted key="p" />],
    [S_BACK, <Mansion key="m" />],
    [S_WORDS, <Words key="w" />],
    [S_Q, <Question key="q" />],
    [S_BOARD, <EpBoard key="b" ch={1} from={S_BOARD} at={t.at('this island')} cam={[[S_BOARD, 960, 130, 2.1], [S_BOARD + 160, 960, 160, 1.75]]} />],
  ];
  let scene = useScene(shots);
  if (frame >= END + INTRO_FRAMES) scene = <Sequence from={END + INTRO_FRAMES} layout="none"><Title /></Sequence>;
  else if (frame >= END) scene = <Sequence from={END} layout="none"><ChannelIntro /></Sequence>;
  const fadeOut = interpolate(frame, [END - 14, END], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{opacity: frame < END ? fadeOut : 1}}>{scene}</AbsoluteFill>
      {frame < END && <Finish vignette={0.3} />}
      <Audio src={staticFile('audio/ch01_cold_open.wav')} />
      <Audio src={staticFile('music/r_cold_open.mp3')} volume={(f) => interpolate(f, [0, 15, t.at("So here's"), END - 40, END], [0, 0.17, 0.17, 0.1, 0], clamp)} />
      {shots.slice(1, -1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.28} />)}
      <Sfx at={t.at('Who got')} src="sfx/stamp.wav" volume={0.3} />
      {[4, 10, 16].map((d) => <Sfx key={d} at={END + INTRO_FRAMES + d} src="sfx/stamp.wav" volume={0.36} />)}
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
