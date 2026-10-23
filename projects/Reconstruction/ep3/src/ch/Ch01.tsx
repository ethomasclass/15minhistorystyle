// Chapter 1 · "A Christmas Drink": the cold open (heavy). Charles Caldwell's death in Clinton, Mississippi, at Christmas
// 1875, told through his widow's sworn testimony on the printed Senate page: no picture of the killing. A held beat
// after "Never say you killed a coward" with a phrase of "Steal Away" (the narration waits; it is never stretched),
// then the question, his last words landing on the series board, the channel intro and the title card.
// Sources: Mississippi in 1875 (Senate report, 1876), vol. 1, title page and pp. 435, 437, 438; Asher & Adams' Louisiana
// and Mississippi (1874); the Journal of the Mississippi Constitutional Convention (1868), p. 5; McPherson, Political
// History (1871), p. 558; Dinwiddie Colored Quartet, "Steal Away" (Victor, 1902, LOC National Jukebox).
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch01_cold_open.words.json';
import {clamp} from '../lib/anim';
import {Finish, Highlight, JF, Loop, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx} from '../kit/common';
import {SeriesBoard} from '../kit/ep3board';
import {ChannelIntro, INTRO_FRAMES} from '../kit/Intro';
import {type Box, DocShot, PhotoShot, PRINT_F, Slip, Spot, Swipe} from '../kit/rc';
import {makeTimeline, type Narration, useScene} from '../kit/shell';
import {DATES, SUBTITLE} from '../project';

const N = words as Narration;
const t0 = makeTimeline(N, 30);
/** The held beat: the narration stops after "…killed a coward." and resumes GAP frames later. */
const SPLIT = Math.round(59.95 * 30);
const GAP = 165;
const shift = (f: number) => (f >= SPLIT ? f + GAP : f);
const t = {at: (p: string, n = 1) => shift(t0.at(p, n)), end: (p: string, n = 1) => shift(t0.end(p, n))};
const cut = (p: string, n = 1) => t.at(p, n) - 2;

const TITLE_FRAMES = 150;
/** Narration ends; the board holds, then the channel intro. */
const END = Math.ceil(N.duration * 30) + GAP + 60;
export const CH01_FRAMES = END + INTRO_FRAMES + TITLE_FRAMES;

// ---------------------------------------------------------------------------------------------------- the pages
const I = 'img/ch01/';
const PAGE_S: [number, number] = [1756, 3000];
const P435 = I + 'caldwell_testimony_p435_when_did_he_die_1876.jpg';
const P437 = I + 'caldwell_testimony_p437_christmas_treat_1876.jpg';
const P438 = I + 'caldwell_testimony_p438_open_air_coward_1876.jpg';
const TITLE_PAGE = I + 'mississippi_in_1875_title_page_1876.jpg';
// line boxes (source px), measured on the pages
const TREAT: Box = [385, 2275, 925, 48];                 // p437 "told him to drink for a Christmas treat"
const NAME: Box = [95, 1170, 762, 52];                   // p435 "Mrs. Margaret Ann Caldwell"
const SWORN: Box = [868, 1170, 672, 52];                 // p435 "(colored) sworn and examined."
const WHEN: Box = [176, 1548, 392, 47];                  // p435 "When did he die?"
const THURSDAY: Box = [722, 1548, 786, 47];              // p435 "Thursday night, in the Christmas."
const AIR: Box[] = [[528, 271, 1162, 45], [108, 319, 712, 44]];   // p438 "that he wanted to die in the open air, … closed up."
const REMEMBER: Box[] = [[598, 1283, 1092, 45], [113, 1330, 390, 45]]; // p438 "Remember when you kill me … and a brave man."
const COWARD: Box = [522, 1330, 675, 45];                // p438 "Never say you killed a coward."
const MAP = 'img/ch07/asher_adams_1874_hinds_county_clinton_jackson_crop.jpg';
const ROLL = 'img/ep2/ms_convention_journal_1868_roll_caldwell_p5.jpg';
const ROLL_CALDWELL: Box = [138, 2190, 362, 44];         // p5 "Charles Caldwell,"
const P558 = 'img/ep2/ms_senate_ratifies_15th_caldwell_yea_1870-01-15_mcpherson_p558.jpg';
const P558_SENATE: Box = [1104, 2742, 450, 36];          // "Senate, January 15, 1870."
const P558_CALDWELL: Box = [1018, 2828, 284, 36];        // "Charles Caldwell,"

const SRC = {
  report: (p: number) => `Mississippi in 1875 (Senate report, 1876), vol. 1, p. ${p}: testimony of Margaret Ann Caldwell · Internet Archive`,
  title: 'Mississippi in 1875: Report of the Select Committee, with the Testimony (1876), title page · Internet Archive',
  map: "Asher & Adams' Louisiana and Mississippi, 1874 (detail: Hinds County) · Mississippi Dept. of Archives and History, via Wikimedia Commons",
  roll: 'Journal of the Mississippi Constitutional Convention, 1868, p. 5 · Internet Archive',
  smith: 'Blacksmithing, Agricultural and Mechanical College, Greensboro, N.C., 1899 · Library of Congress',
  p558: 'Mississippi Senate, Jan. 15, 1870, in McPherson, Political History of … Reconstruction (1871), p. 558 · Internet Archive',
  troops: "The withdrawal of the federal troops from the State House, New Orleans, April 24, 1877, Frank Leslie's · Library of Congress",
};

// ---------------------------------------------------------------------------------------------------- the cuts
const S_SHOT = cut('someone fired'), S_PLACE = cut('It was the'), S_NAME = cut('The senator was'), S_SMITH = cut('The blacksmith');
const S_WIFE = cut('Months later'), S_SENATE = cut('testified under'), S_Q = cut('When did he'), S_TOLD = cut('He was shot');
const S_AIR = cut('because in her'), S_STREET = cut('They carried'), S_MIN = cut('Before they did'), S_FIVE = cut('Five years earlier');
const S_QUESTION = cut('So how does'), S_BOARD = cut("We'll come back");

/** "A man talked a state senator into a Christmas drink": the page, the line about the Christmas treat. */
const Treat: React.FC = () => (
  <DocShot src={P437} size={PAGE_S} seed="p437" tag={SRC.report(437)}
    keys={[[0, {x: 860, y: 2240, z: 0.92}], [S_SHOT, {x: 850, y: 2290, z: 1.02}]]}>
    <Spot size={PAGE_S} boxes={[TREAT]} at={t.at('Christmas') - 4} id="trt" dark={0.55} />
    <Swipe lines={[TREAT]} from={t.at('into a')} to={t.end('drink')} seed="trt" />
  </DocShot>
);

/** "someone fired through the window": nothing shown but the words. */
const Shot: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Slip text="as their glasses touched:" x={300} y={360} size={58} at={S_SHOT + 2} />
    <Slip text="a shot, through the window" x={360} y={490} size={64} rot={2} at={t.at('fired')} />
  </AbsoluteFill>
);

/** Christmas, 1875, Clinton: the town on the railroad west of Jackson. */
const Place: React.FC = () => (
  <DocShot src={MAP} size={[1100, 800]} seed="map" filter={PRINT_F} tag={SRC.map}
    keys={[[S_PLACE, {x: 500, y: 330, z: 1.9}], [S_NAME, {x: 470, y: 325, z: 2.35}]]}
    over={<>
      <Slip text="the Christmas holidays, 1875" x={150} y={150} size={56} at={t.at('Christmas holidays')} />
      <Slip text="Clinton, Mississippi" x={1180} y={760} size={60} rot={2} at={t.at('in Clinton')} />
    </>}>
    <Loop cx={452} cy={318} rx={34} ry={30} at={t.at('in Clinton')} seed={11} tilt={-4} width={4} />
  </DocShot>
);

/** "The senator was Charles Caldwell": his name on the 1868 convention roll (Episode 2). */
const Name: React.FC = () => (
  <DocShot src={ROLL} size={[1698, 3000]} seed="roll" tag={SRC.roll}
    keys={[[S_NAME, {x: 420, y: 2190, z: 1.35}], [S_SMITH, {x: 380, y: 2205, z: 1.5}]]}
    over={<Slip text="state senator" x={1100} y={300} size={58} at={t.at('The senator')} />}>
    <Swipe lines={[ROLL_CALDWELL]} from={t.at('Charles Caldwell')} to={t.end('Charles Caldwell')} seed="rl" />
  </DocShot>
);

/** "The blacksmith from the last episode": the labelled stand-in, never him. */
const Smith: React.FC = () => (
  <PhotoShot src="img/ep2/cr_blacksmiths.png" size={[640, 473]} a={S_SMITH} b={S_WIFE} w={720} x={700} y={540} tag={SRC.smith}>
    <Slip text="the blacksmith (Episode 2)" x={1130} y={250} size={52} at={t.at('The blacksmith')} />
    <Slip text="born enslaved" x={1170} y={380} size={56} rot={2} at={t.at('Born enslaved')} />
    <Slip text="then a lawmaker" x={1150} y={510} size={56} at={t.at('Then a lawmaker')} />
    <Slip text="(not him: no photograph of him is known)" x={1000} y={840} size={40} rot={1} at={t.at('blacksmith') + 10} />
  </PhotoShot>
);

/** "Months later, his wife, Margaret Ann Caldwell…": her name as the report prints it. */
const Wife: React.FC = () => (
  <DocShot src={P435} size={PAGE_S} seed="p435" tag={SRC.report(435)}
    keys={[[S_WIFE, {x: 830, y: 1120, z: 0.98}], [S_SENATE, {x: 820, y: 1170, z: 1.05}]]}
    over={<Slip text="June 20, 1876" x={150} y={150} size={56} at={t.at('Months later')} />}>
    <Swipe lines={[NAME]} from={t.at('Margaret')} to={t.end('Caldwell', 2)} seed="nm" />
    <Swipe lines={[SWORN]} from={t.end('Caldwell', 2) + 2} to={t.at('testified') + 2} seed="sw" />
  </DocShot>
);

/** "…testified under oath to a committee of the U.S. Senate": the report's title page. */
const Senate: React.FC = () => (
  <DocShot src={TITLE_PAGE} size={PAGE_S} seed="ttl" tag={SRC.title}
    keys={[[S_SENATE, {x: 878, y: 1200, z: 0.5}], [S_Q, {x: 878, y: 1150, z: 0.56}]]}
    over={<Slip text="a committee of the U.S. Senate" x={1120} y={820} size={54} rot={2} at={t.at('committee')} />} />
);

/** The transcript: "When did he die?" "Thursday night, in the Christmas." */
const Question: React.FC = () => (
  <DocShot src={P435} size={PAGE_S} seed="p435" tag={SRC.report(435)}
    keys={[[S_Q, {x: 850, y: 1520, z: 1.04}], [S_TOLD, {x: 850, y: 1560, z: 1.1}]]}>
    <Spot size={PAGE_S} boxes={[WHEN, THURSDAY]} at={S_Q} id="q" dark={0.6} />
    <Swipe lines={[WHEN]} from={t.at('When did')} to={t.end('die')} seed="wh" />
    <Swipe lines={[THURSDAY]} from={t.at('Thursday')} to={t.end('Christmas', 3)} seed="th" />
  </DocShot>
);

/** What she told them, set down plainly: no picture. */
const Told: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Slip text="shot in a store's cellar" x={250} y={200} size={58} at={t.at('He was shot')} />
    <Slip text="he called for help" x={300} y={330} size={58} rot={2} at={t.at('He called')} />
    <Slip text="nobody came" x={260} y={460} size={58} at={t.at('Nobody came')} />
    <Slip text="he asked to be carried outside" x={320} y={590} size={58} rot={2} at={t.at('He asked')} />
  </AbsoluteFill>
);

/** "…in her words, he 'wanted to die in the open air…'" */
const Air: React.FC = () => (
  <DocShot src={P438} size={PAGE_S} seed="p438" tag={SRC.report(438)}
    keys={[[S_AIR, {x: 900, y: 290, z: 0.98}], [S_STREET, {x: 900, y: 300, z: 1.05}]]}
    over={<Slip text="in her words" x={150} y={150} size={54} at={t.at('in her words')} />}>
    <Spot size={PAGE_S} boxes={AIR} at={t.at('wanted') - 4} id="air" dark={0.6} />
    <Swipe lines={AIR} from={t.at('wanted')} to={t.end('closed up')} seed="air" />
  </DocShot>
);

/** "They carried him into the street…": words only. */
const Street: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Slip text="carried into the street" x={300} y={300} size={58} at={t.at('They carried')} />
    <Slip text="a crowd of armed men" x={340} y={430} size={58} rot={2} at={t.at('a crowd')} />
    <Slip text="shot him again, many times" x={300} y={560} size={58} at={t.at('shot him again')} />
  </AbsoluteFill>
);

/** His last words, as a minister who was there told them to her, then the held beat. */
const Minister: React.FC = () => (
  <DocShot src={P438} size={PAGE_S} seed="p438" tag={SRC.report(438)}
    keys={[[S_MIN, {x: 900, y: 1280, z: 0.95}], [t.at('Remember'), {x: 900, y: 1310, z: 1.04}], [SPLIT, {x: 870, y: 1330, z: 1.1}], [S_FIVE, {x: 860, y: 1335, z: 1.2}]]}
    over={<Slip text="according to a minister who was there" x={150} y={150} size={52} at={t.at('according to')} />}>
    <Spot size={PAGE_S} boxes={[...REMEMBER, COWARD]} at={t.at('Remember') - 4} id="rm" dark={0.72} />
    <Swipe lines={REMEMBER} from={t.at('Remember')} to={t.end('brave man')} seed="rm" color="#2FE0C4" />
    <Swipe lines={[COWARD]} from={t.at('Never say')} to={t.end('a coward')} seed="cw" />
  </DocShot>
);

/** "Five years earlier, Caldwell had been elected to the state senate": his vote as a state senator, 1870. */
const Five: React.FC = () => (
  <DocShot src={P558} size={[1825, 3000]} seed="p558" tag={SRC.p558}
    keys={[[S_FIVE, {x: 1240, y: 2760, z: 1.25}], [S_QUESTION, {x: 1220, y: 2790, z: 1.35}]]}
    over={<Slip text="1870: state senator" x={150} y={170} size={58} at={t.at('Five years')} />}>
    <Swipe lines={[P558_SENATE]} from={t.at('Five years')} to={t.at('Caldwell had')} seed="sn" color="#2FE0C4" />
    <Swipe lines={[P558_CALDWELL]} from={t.at('Caldwell had')} to={t.end('state senate')} seed="cc" />
  </DocShot>
);

/** The question. */
const Why: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Slip text="1870: elected to the state senate" x={220} y={190} size={58} at={t.at('So how')} />
    <Slip text="1875: shot in the street" x={300} y={320} size={58} rot={2} at={t.at('to this')} />
    <Highlight text="WHY DID NOBODY STOP IT?" x={250} y={560} size={96} at={t.at('why did nobody')} seed={41} rot={-2} />
  </AbsoluteFill>
);

/** Title card after the channel intro: the troops leaving the Louisiana statehouse, 1877, dimmed behind. */
const Title: React.FC = () => {
  const g = useGFrame();
  const f = useCurrentFrame();
  const pal = usePal();
  return (
    <AbsoluteFill style={{background: '#0d0c09'}}>
      <AbsoluteFill style={{opacity: 0.3, filter: 'blur(2px)'}}>
        <DocShot src="img/ch08/louisiana_withdrawal_federal_troops_state_house_april_1877.jpg" size={[3000, 2394]} seed="tt" filter={PRINT_F} tag=""
          keys={[[0, {x: 1500, y: 1150, z: 0.62 + f * 0.0002}], [200, {x: 1500, y: 1150, z: 0.66}]]} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 45% 50%, rgba(8,6,4,0.25) 30%, rgba(8,6,4,0.88) 100%)'}} />
      <Highlight text="REDEMPTION" x={300} y={330} size={170} at={4} seed={73} rot={-2} />
      {g >= 16 && <div style={{position: 'absolute', left: 420, top: 620, fontFamily: JF.display, fontSize: 64, color: pal.mark, textShadow: '0 3px 16px rgba(0,0,0,0.8)',
        opacity: interpolate(g, [16, 22], [0, 1], clamp)}}>{SUBTITLE}</div>}
      <Slip text={DATES} x={1380} y={700} size={60} rot={-4} at={26} />
      {f >= 30 && <Tag text={SRC.troops} />}
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const shots: [number, React.ReactNode][] = [
    [0, <Treat key="tr" />],
    [S_SHOT, <Shot key="sh" />],
    [S_PLACE, <Place key="pl" />],
    [S_NAME, <Name key="nm" />],
    [S_SMITH, <Smith key="sm" />],
    [S_WIFE, <Wife key="wf" />],
    [S_SENATE, <Senate key="se" />],
    [S_Q, <Question key="q" />],
    [S_TOLD, <Told key="to" />],
    [S_AIR, <Air key="ai" />],
    [S_STREET, <Street key="st" />],
    [S_MIN, <Minister key="mi" />],
    [S_FIVE, <Five key="fv" />],
    [S_QUESTION, <Why key="wy" />],
    [S_BOARD, <SeriesBoard key="b" ch={1} from={S_BOARD} at={t.at('kept asking')}
      cam={[[S_BOARD, 720, 2085, 1.6], [t.at('kept asking') + 24, 700, 2070, 1.45], [t.at('why did they') + 6, 700, 2070, 1.42], [t.at('why did they') + 40, 1065, 1765, 0.875], [END, 1065, 1765, 0.86]]}
      overlay={<Slip text="why did they kill him?" x={1120} y={850} size={56} rot={2} at={t.at('why did they')} />} />],
  ];
  let scene = useScene(shots);
  if (frame >= END + INTRO_FRAMES) scene = <Sequence from={END + INTRO_FRAMES} layout="none"><Title /></Sequence>;
  else if (frame >= END) scene = <Sequence from={END} layout="none"><ChannelIntro /></Sequence>;
  const fadeOut = interpolate(frame, [END - 14, END], [1, 0], clamp);
  const fired = t.at('fired');
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{opacity: frame < END ? fadeOut : 1}}>{scene}</AbsoluteFill>
      {frame < END && <Finish vignette={0.3} />}
      {/* the narration, paused for the held beat after "…killed a coward." */}
      <Sequence from={0} durationInFrames={SPLIT} layout="none"><Audio src={staticFile('audio/ch01_cold_open.wav')} /></Sequence>
      <Sequence from={SPLIT + GAP} layout="none"><Audio src={staticFile('audio/ch01_cold_open.wav')} startFrom={SPLIT} /></Sequence>
      {/* night riders, low, until the shot; silence; a phrase of "Steal Away" in the beat; the bed back, low, for the question */}
      <Audio src={staticFile('music/rc_night_riders.mp3')} volume={(f) => interpolate(f, [0, 12, fired - 4, fired + 2], [0, 0.17, 0.17, 0], clamp)} />
      <Sequence from={SPLIT + 4} durationInFrames={GAP + 20} layout="none">
        <Audio src={staticFile('music/period/steal_away_dinwiddie_1902.mp3')} startFrom={156}
          volume={(f) => interpolate(f, [0, 10, GAP - 26, GAP + 8], [0, 0.4, 0.4, 0], clamp)} />
      </Sequence>
      <Sequence from={S_QUESTION} durationInFrames={END - S_QUESTION} layout="none">
        <Audio src={staticFile('music/rc_night_riders.mp3')} startFrom={600}
          volume={(f) => interpolate(f, [0, 30, END - S_QUESTION - 40, END - S_QUESTION], [0, 0.12, 0.12, 0], clamp)} />
      </Sequence>
      {shots.slice(1, -1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.18} />)}
      <Sfx at={t.at('why did nobody')} src="sfx/stamp.wav" volume={0.26} />
      {[4].map((d) => <Sfx key={d} at={END + INTRO_FRAMES + d} src="sfx/stamp.wav" volume={0.36} />)}
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
