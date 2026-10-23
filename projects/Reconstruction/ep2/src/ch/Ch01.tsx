// Chapter 1 · "The First Black Senator": the cold open (Davis walks out; nine years later Revels walks in), the
// question, the senators print landing on the series board, then the channel intro and the title card.
// Sources: Brady studio portraits of Davis (c. 1859) and Revels (Brady-Handy, c. 1870), Currier & Ives, "The First
// Colored Senator and Representatives" (1872), the New-York Tribune of Feb. 26, 1870, and Frank Leslie's of March 12,
// 1870 (Revels taking the oath). All Library of Congress or Internet Archive scans.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch01_cold_open.words.json';
import {clamp} from '../lib/anim';
import {Finish, Highlight, JF, Loop, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx} from '../kit/common';
import {SeriesBoard} from '../kit/ep2board';
import {ChannelIntro, INTRO_FRAMES} from '../kit/Intro';
import {type Box, cut, DocShot, PhotoShot, PRINT_F, Slip, Spot, Swipe} from '../kit/rc';
import {makeTimeline, type Narration, Photo, useScene} from '../kit/shell';
import {MASKS} from '../masks';
import {DATES, SUBTITLE} from '../project';

const N = words as Narration;
const t = makeTimeline(N, 30);
const TITLE_FRAMES = 150;
/** Narration ends; the board holds a little longer, then the channel intro. */
const END = Math.ceil(N.duration * 30) + 45;
export const CH01_FRAMES = END + INTRO_FRAMES + TITLE_FRAMES;

const PRINT = 'img/wall/senators.jpg';
const PRINT_S: [number, number] = [1024, 782];
const PRINT_TAG = 'Currier & Ives, "The First Colored Senator and Representatives", 1872 · Library of Congress';
const TRIB = 'img/ch01/ny_tribune_1870-02-26_revels_sworn_in_48_8.jpg';
const TRIB_S: [number, number] = [680, 1270];
const TRIB_TAG = 'New-York Tribune, Feb. 26, 1870 · Library of Congress';
const T_SWORN: Box = [210, 546, 280, 26];          // "MR. REVELS SWORN IN."
const T_VOTE: Box = [316, 890, 192, 26];           // "Yeas, 48; Nays, 8."
const T_OATH: Box[] = [[48, 1082, 615, 24], [48, 1104, 95, 24]]; // "…took the customary oath / of office."
const CAPTION: Box = [168, 640, 180, 18];          // "U.S. Senator H.R. REVELS, of Mississippi"

// the shots (cut two frames before the phrase)
const S_REVELS = cut(t, 'Nine years later'), S_PRINT = cut(t, 'This is a print'), S_STOP = cut(t, 'But before'), S_SCOTT = cut(t, 'Remember the Dred');
const S_VOTE = cut(t, "It didn't work"), S_OATH = cut(t, 'and Revels took'), S_Q = cut(t, 'Five years earlier'), S_SMITH = cut(t, 'And along the way');
const S_BOARD = cut(t, 'Hold onto him');

/** 1861: Senator Jefferson Davis, who walked out to lead the Confederacy. */
const Davis: React.FC = () => (
  <Photo src="img/ch01/jefferson_davis_1859_brady.jpg" size={[2341, 3000]} fx={1157} fy={790} z0={1.56} z1={1.64} a={0} b={S_REVELS} mask={MASKS.davis1859} tint={null} traceAt={t.at('Jefferson Davis') + 2}>
    {() => (
      <>
        <Slip text="Sen. Jefferson Davis, Mississippi" x={1160} y={250} size={54} at={t.at('Jefferson Davis')} />
        <Slip text="Jan. 1861: walks out" x={1160} y={380} size={54} rot={2} at={t.at('walked out')} />
        <Slip text="to lead the Confederacy" x={1200} y={500} size={54} at={t.at('to lead')} />
        <Tag text="Jefferson Davis, c. 1859 (Brady studio) · Library of Congress" />
      </>
    )}
  </Photo>
);

/** Nine years later: Hiram Revels. */
const Revels: React.FC = () => (
  <Photo src="img/ch01/revels_brady_handy_1870.jpg" size={[2545, 3000]} fx={1600} fy={1000} z0={1.08} z1={1.16} a={S_REVELS} b={S_PRINT} mask={MASKS.revels} traceAt={t.at('Hiram Revels') + 2}>
    {() => (
      <>
        <Slip text="1870 · from Mississippi" x={150} y={240} size={56} at={t.at('his home state')} />
        <Slip text="Hiram Revels" x={150} y={370} size={64} rot={2} at={t.at('Hiram Revels')} coral />
        <Slip text="a minister" x={180} y={500} size={54} at={t.at('Black minister')} />
        <Tag text="Hiram R. Revels, c. 1870 (Brady-Handy) · Library of Congress" />
      </>
    )}
  </Photo>
);

/** The print, then the camera finds the man seated on the left. */
const Print: React.FC = () => {
  const g = useGFrame();
  const left = t.at('Look at');
  return (
    <DocShot src={PRINT} size={PRINT_S} seed="sen" filter={PRINT_F} tag={PRINT_TAG}
      keys={[[S_PRINT, {x: 512, y: 380, z: 1.6}], [left, {x: 470, y: 400, z: 1.7}], [left + 30, {x: 250, y: 380, z: 2.7}], [S_STOP, {x: 240, y: 390, z: 2.85}]]}
      over={<>
        {g >= t.at('The first Black') && <Highlight text="THE FIRST BLACK SENATOR" x={700} y={790} size={80} at={t.at('The first Black')} seed={31} rot={-2} />}
      </>}>
      <Loop cx={205} cy={330} rx={120} ry={160} at={t.at('seated on the left')} seed={33} tilt={-6} />
      <Swipe lines={[CAPTION]} from={t.at('The first Black')} to={t.end('history')} seed="cap" />
    </DocShot>
  );
};

/** The objection: nine years a citizen, and Dred Scott. */
const Stop: React.FC = () => (
  <AbsoluteFill>
    <DocShot src={TRIB} size={TRIB_S} seed="trib" tag="" filter="grayscale(1) sepia(0.15) contrast(1.4) brightness(0.55)"
      keys={[[S_STOP, {x: 340, y: 330, z: 1.35}], [S_SCOTT, {x: 340, y: 380, z: 1.42}]]} />
    <AbsoluteFill style={{background: 'rgba(10,9,7,0.55)'}} />
    <Slip text="the Constitution: a senator needs 9 years as a citizen" x={170} y={200} size={56} at={t.at('The Constitution')} />
    <Slip text="before 1866, they argued: no Black citizens at all" x={220} y={340} size={56} rot={2} at={t.at('until 1866')} coral />
    <Tag text="The Senate debate, New-York Tribune, Feb. 26, 1870 · Library of Congress" />
  </AbsoluteFill>
);
const Scott: React.FC = () => (
  <PhotoShot src="img/ep1/cr_dred_scott.png" size={[900, 1159]} a={S_SCOTT} b={S_VOTE} w={420} x={560} y={560} tag="Dred Scott, photograph, c. 1857 · public domain, via Wikimedia Commons">
    <Slip text="Dred Scott decision, 1857" x={900} y={330} size={58} at={t.at('Dred Scott')} />
    <Slip text="still using it, in 1870" x={940} y={470} size={58} rot={2} at={t.at('still using')} coral />
  </PhotoShot>
);

/** The vote, as the Tribune printed it the next morning. */
const Vote: React.FC = () => (
  <DocShot src={TRIB} size={TRIB_S} seed="trib" tag={TRIB_TAG}
    keys={[[S_VOTE, {x: 330, y: 620, z: 1.25}], [t.at('The Senate voted') - 4, {x: 380, y: 880, z: 1.9}], [S_OATH, {x: 400, y: 900, z: 2.0}]]}>
    <Swipe lines={[T_SWORN]} from={S_VOTE + 4} to={S_VOTE + 16} seed="sw" />
    <Swipe lines={[T_VOTE]} from={t.at('48')} to={t.end('8')} seed="vt" />
  </DocShot>
);

/** And he took the oath: Leslie's cover engraving, with the Tribune's line. */
const Oath: React.FC = () => (
  <Photo src="img/ch01/revels_oath_leslies_1870_engraving.jpg" size={[2844, 3000]} fx={1420} fy={1300} z0={1.04} z1={1.1} a={S_OATH} b={S_Q} bw="grayscale(1) contrast(1.35)">
    {() => (
      <>
        <Slip text="Feb. 25, 1870" x={150} y={170} size={56} at={S_OATH + 4} />
        <Tag text={`"Administering the oath to Hiram Revels", Frank Leslie's, March 12, 1870 · Internet Archive`} />
      </>
    )}
  </Photo>
);

/** The question. */
const Question: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Slip text="1865: not one Black man in Mississippi could vote" x={180} y={180} size={58} at={t.at('Five years earlier')} />
    <Slip text="1870: a Black senator from Mississippi" x={260} y={320} size={58} rot={2} at={t.at('not one') + 20} />
    <Highlight text="HOW SO FAST?" x={300} y={520} size={110} at={t.at('how did that')} seed={35} rot={-2} />
    <Slip text="and what was it all resting on?" x={420} y={740} size={66} at={t.at('what was all')} coral />
  </AbsoluteFill>
);

/** A blacksmith, still to come: a labelled stand-in, never him. */
const Smith: React.FC = () => (
  <PhotoShot src="img/ch03/LATER_blacksmithing_am_college_greensboro_1899.jpg" size={[640, 473]} a={S_SMITH} b={S_BOARD} w={760} x={760} y={520}
    tag="Blacksmithing, Agricultural and Mechanical College, Greensboro, N.C., 1899 · Library of Congress">
    <Slip text="a blacksmith, Clinton, Mississippi" x={1180} y={300} size={54} at={t.at('blacksmith')} />
    <Slip text="(not him: no photo of him is known)" x={1220} y={420} size={46} rot={2} at={t.at('small town') + 6} />
  </PhotoShot>
);

/** Title card after the channel intro: the senators print dimmed behind, the title on orange. */
const Title: React.FC = () => {
  const g = useGFrame();
  const f = useCurrentFrame();
  const pal = usePal();
  return (
    <AbsoluteFill style={{background: '#0d0c09'}}>
      <AbsoluteFill style={{opacity: 0.32, filter: 'blur(2px)'}}>
        <DocShot src={PRINT} size={PRINT_S} seed="tt" filter={PRINT_F} tag="" keys={[[0, {x: 512, y: 360, z: 1.95 + f * 0.0006}], [200, {x: 512, y: 360, z: 2.07}]]} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 45% 50%, rgba(8,6,4,0.25) 30%, rgba(8,6,4,0.88) 100%)'}} />
      <Highlight text="BOTTOM RAIL" x={260} y={250} size={160} at={4} seed={71} rot={-2} />
      <Highlight text="ON TOP" x={360} y={470} size={160} at={10} seed={72} rot={-2} />
      {g >= 20 && <div style={{position: 'absolute', left: 420, top: 720, fontFamily: JF.display, fontSize: 64, color: pal.mark, textShadow: '0 3px 16px rgba(0,0,0,0.8)',
        opacity: interpolate(g, [20, 26], [0, 1], clamp)}}>{SUBTITLE}</div>}
      <Slip text={DATES} x={1380} y={760} size={60} rot={-4} at={28} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const shots: [number, React.ReactNode][] = [
    [0, <Davis key="d" />],
    [S_REVELS, <Revels key="r" />],
    [S_PRINT, <Print key="p" />],
    [S_STOP, <Stop key="s" />],
    [S_SCOTT, <Scott key="c" />],
    [S_VOTE, <Vote key="v" />],
    [S_OATH, <Oath key="o" />],
    [S_Q, <Question key="q" />],
    [S_SMITH, <Smith key="m" />],
    [S_BOARD, <SeriesBoard key="b" ch={1} from={S_BOARD} at={t.at('Hold onto him') + 2} />],
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
      <Audio src={staticFile('music/r_cold_open.mp3')} volume={(f) => interpolate(f, [0, 15, S_Q, END - 40, END], [0, 0.17, 0.17, 0.1, 0], clamp)} />
      {shots.slice(1, -1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.28} />)}
      {[t.at('The first Black'), t.at('how did that')].map((f) => <Sfx key={f} at={f} src="sfx/stamp.wav" volume={0.3} />)}
      {[4, 10].map((d) => <Sfx key={d} at={END + INTRO_FRAMES + d} src="sfx/stamp.wav" volume={0.36} />)}
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

void Spot;
