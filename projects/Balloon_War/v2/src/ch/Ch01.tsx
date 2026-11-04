// Chapter 1 · Something in the Woods (the cold open), then the one-second beat, the Chunk History intro and the title card.
// Scene plan: script/SCENES_v2.md "ch01". Every cut lands 1 frame before the word that starts its idea; each scene sits in a
// <Sequence from={cut}> so its own beats are passed relative to the cut (t.at(...) - cut). This chapter is the pattern the
// other chapters follow (script/BUILD_BRIEF_v2.md).
//   0:00  "Five kids on a church picnic found something strange in the woods." BW03, the balloon in the pines (frame 0 = thumbnail)
//   0:10  "It had come from Japan... the whole Pacific" Mikesh's winter jet-stream map, the route
//   0:18  "And it was made of paper." the paper envelope close-up, PAPER
//   0:20  "The kids called the grown-ups over" back to the woods, closer
//   0:22  "The government knew... Hundreds of them." the incident map (Mikesh Fig. 87)
//   0:29  "It had decided not to tell anyone." the 1945 voluntary press code, a censor bar wipes over a line
//   0:32  the driving question over the woods: HOW DID IT GET HERE? / WHY NO WARNING?
//   0:40  "three more people": the boy on the beach (BW01 + sweet potato), the schoolgirl (BW09), the newspaperman (BW12)
//   1:00  "We'll come back to those woods." the woods, pulling back
//   1:02  "But first, Tokyo..." the 1942 raid over Tokyo rooftops (BW06), held through the beat
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/v2_ch01_something_in_the_woods.words.json';
import {clamp} from '../lib/anim';
import {Finish, Highlight, JF, Note, PALETTES, PaletteCtx, StepCtx, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChannelIntro, INTRO_FRAMES} from '../kit/ChunkIntro';
import {makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {Prop} from '../kit/prop';
import {Print} from '../kit/print';
import {SilScene} from '../kit/silparallax';
import {DATES, SUBTITLE, TITLE} from '../project';

const N = words as Narration;
/** Narration ends; the channel intro starts 30 frames later (the one-second beat, with the last picture held). */
const END = Math.ceil(N.duration * 30) + 30;
const TITLE_FRAMES = 150;
export const CH01_FRAMES = END + INTRO_FRAMES + TITLE_FRAMES;

/** A small mono label for a person with no photo (always anonymous silhouettes). */
const NoPhoto: React.FC<{text: string; at: number}> = ({text, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  return (
    <div style={{position: 'absolute', left: 110, bottom: 104, fontFamily: JF.mono, fontSize: 20, letterSpacing: 2, color: 'rgba(244,239,230,0.8)',
      textTransform: 'uppercase', textShadow: '0 1px 8px rgba(0,0,0,0.95)', opacity: interpolate(g, [at, at + 6], [0, 1], clamp)}}>{text}</div>
  );
};

/** The title card after the Chunk intro: the woods dimmed behind the title tape. */
const TitleCard: React.FC = () => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill style={{background: '#0b0a08'}}>
      <AbsoluteFill style={{opacity: 0.4}}><SilScene name="BW03_woods_open" a={0} b={TITLE_FRAMES} fade={1} cam={{z: [1.1, 1.14], x: [0, -10], y: [0, -4]}} /></AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(8,7,5,0.92) 0%, rgba(8,7,5,0.7) 55%, rgba(8,7,5,0.3) 100%)'}} />
      <Highlight text={TITLE} x={200} y={360} size={150} at={4} seed={61} />
      {g >= 14 && <div style={{position: 'absolute', left: 250, top: 590, fontFamily: JF.display, fontSize: 64, color: pal.mark, whiteSpace: 'nowrap',
        textShadow: '0 3px 16px rgba(0,0,0,0.9)', opacity: interpolate(g, [14, 20], [0, 1], clamp)}}>{SUBTITLE}</div>}
      <Note text={DATES} x={1250} y={730} size={60} rot={-5} at={24} />
    </AbsoluteFill>
  );
};

/** "Five kids on a church picnic found something strange in the woods." The thumbnail's picture at frame 0, camera moving. */
const Woods: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW03_woods_open" a={0} b={b - a} fade={1} cam={{z: [1.06, 1.16], x: [24, -10], y: [0, -14]}} fog={0.35} />
    <Highlight text="SOMETHING IN THE WOODS" x={140} y={110} size={78} at={t.at('found') - a} seed={11} rot={-2} />
    <Note text="nobody in town had seen one" x={760} y={820} size={56} rot={-3} at={t.at('Nobody') - a} />
  </AbsoluteFill>
);

/** "It had come from Japan. It had floated across the whole Pacific Ocean, thousands of miles, all on its own." */
const FromJapan: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src="img/ch04_paper_balloon/jet_stream_winter_map_fig25bottom.jpg" x={250} y={150} w={1420} h={700} at={2} rot={-1} fit="contain"
      tag="Winter winds over the Pacific · Mikesh, Smithsonian, 1973" />
    <Highlight text="FROM JAPAN" x={1220} y={124} size={80} at={t.at('Japan') - a} seed={13} rot={-3} />
    <Note text="thousands of miles" x={720} y={830} size={60} rot={-3} at={t.at('thousands') - a} />
    <Note text="on its own" x={1380} y={830} size={56} rot={-5} at={t.at('own') - a} />
  </AbsoluteFill>
);

/** "And it was made of paper." */
const Paper: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src="img/ch04_paper_balloon/paper_envelope_gores_closeup_nara285259.jpg" x={360} y={170} w={1200} h={680} at={1} rot={1}
      tag="Balloon envelope, close up · National Archives" />
    <Highlight text="PAPER" x={1300} y={720} size={150} at={t.at('paper') - a} seed={15} rot={-4} />
  </AbsoluteFill>
);

/** "The kids called the grown-ups over to come and look." Back in the woods, closer. */
const Closer: React.FC<{a: number; b: number}> = ({a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW03_woods_open" a={0} b={b - a} fade={1} cam={{z: [1.2, 1.3], x: [40, 60], y: [-20, -30]}} fog={0.4} />
  </AbsoluteFill>
);

/** "The government knew these things were coming down all over North America. Hundreds of them." */
const Hundreds: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 200], [1, 1.06], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`}}>
        <Print src="img/ch04_paper_balloon/incident_map_us_mexico_fig87.jpg" x={330} y={130} w={1260} h={760} at={1} rot={-1} fit="contain"
          tag="Balloon incidents, 1944–45 · Mikesh, Smithsonian, 1973" />
      </AbsoluteFill>
      <Highlight text="THE GOVERNMENT KNEW" x={150} y={124} size={74} at={t.at('knew') - a} seed={17} rot={-2} />
      <Note text="hundreds" x={1340} y={820} size={72} rot={-4} at={t.at('Hundreds') - a} />
    </AbsoluteFill>
  );
};

/** "It had decided not to tell anyone." The 1945 voluntary press code; a censor bar wipes across a line of it. */
const Silence: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const w = interpolate(g, [t.at('not') - a, t.at('anyone') - a], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Print src="img/v2/price/code_of_wartime_practices_press_radio_may1945.jpg" x={690} y={70} w={540} h={850} at={1} rot={-1} fit="contain"
        tag="Code of Wartime Practices, 1945 · Office of Censorship" />
      <div style={{position: 'absolute', left: 735, top: 430, width: 450 * w, height: 70, background: '#0d0c09', transform: 'rotate(-1deg)',
        boxShadow: '0 6px 18px rgba(0,0,0,0.6)'}} />
      <Highlight text="NOT ONE WORD" x={1160} y={560} size={84} at={t.at('anyone') - a} seed={19} rot={-3} />
    </AbsoluteFill>
  );
};

/** The driving question over the woods. */
const Question: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW03_woods_open" a={0} b={b - a} fade={1} cam={{z: [1.12, 1.06], x: [-10, 10], y: [-8, 0]}} fog={0.3} />
    <AbsoluteFill style={{background: 'rgba(8,7,5,0.35)'}} />
    <Highlight text="HOW DID IT GET HERE?" x={160} y={150} size={92} at={t.at('How') - a} seed={21} rot={-3} />
    <Highlight text="NOBODY" x={260} y={700} size={110} at={t.at('nobody') - a} seed={23} rot={-2} />
    <Highlight text="WARNED THEM" x={420} y={830} size={110} at={t.at('warn') - a} seed={25} rot={-1} />
  </AbsoluteFill>
);

/** "To answer that, we need three more people." */
const Three: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <AbsoluteFill style={{background: 'radial-gradient(circle 620px at 960px 540px, rgba(255,214,160,0.08) 0%, transparent 100%)'}} />
    <Highlight text="THREE MORE PEOPLE" x={470} y={440} size={110} at={t.at('three') - a} seed={27} rot={-2} />
  </AbsoluteFill>
);

/** "A teenage boy on a beach in Japan, who hunted for holes in balloons... for sweet potatoes." */
const Boy: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW01_beach_dawn" a={0} b={b - a} fade={1} cam={{z: [1.06, 1.12], x: [-30, 20], y: [0, -6]}} fog={0.25} />
    <Prop name="sweet_potato" x={1360} y={180} w={380} at={t.at('sweet') - a} trace from="top" />
    <Note text="one hole = one sweet potato" x={1020} y={400} size={50} rot={-4} at={t.at('potatoes') - a} />
    <NoPhoto text="A boy on a beach in Japan, 1944" at={8} />
  </AbsoluteFill>
);

/** "A schoolgirl in Tokyo who glued them together, and didn't find out what she'd made for decades." */
const Girl: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW09_rei" a={0} b={b - a} fade={1} cam={{z: [1.06, 1.16], x: [10, -10], y: [4, -14]}} fog={0.2}
      dust={{x: 1080, y: 260, w: 560, h: 760, n: 30, seed: 'rei1'}} />
    <Note text="didn't find out for decades" x={960} y={150} size={56} rot={-4} at={t.at('decades') - a} />
    <NoPhoto text="A schoolgirl in Tokyo" at={8} />
  </AbsoluteFill>
);

/** "And an American newspaperman whose job, all of a sudden, was keeping news out of the newspapers." */
const Newsman: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW12_price_desk" a={0} b={b - a} fade={1} cam={{z: [1.05, 1.13], x: [20, -20], y: [0, -8]}} fog={0.2} />
    <Highlight text="KEEP IT OUT" x={1180} y={150} size={92} at={t.at('keeping') - a} seed={29} rot={-3} />
    <NoPhoto text="An American newspaperman" at={8} />
  </AbsoluteFill>
);

/** "We'll come back to those woods." */
const Back: React.FC<{a: number; b: number}> = ({a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW03_woods_open" a={0} b={b - a} fade={1} cam={{z: [1.18, 1.04], x: [30, 0], y: [-16, 0]}} fog={0.4} />
  </AbsoluteFill>
);

/** "But first, Tokyo... where this story starts with a really bad day for Japan." Held through the one-second beat. */
const Tokyo: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW06_raid_tokyo" a={0} b={b - a + 12} fade={1} cam={{z: [1.04, 1.12], x: [-20, 20], y: [0, -10]}} fog={0.25} />
    <Note text="Tokyo" x={180} y={190} size={70} rot={-4} at={t.at('Tokyo') - a} />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {
    japan: at('It had come') - 1, paper: at('And it was') - 1, closer: at('The kids') - 1, hundreds: at("And here's") - 1,
    silence: at('It had decided') - 1, q: at("So here's") - 1, three: at('To answer') - 1, boy: at('A teenage') - 1,
    girl: at('A schoolgirl') - 1, news: at('And an American') - 1, back: at("We'll come") - 1, tokyo: at('But first') - 1,
  };
  const cuts: [number, React.ReactNode][] = [
    [0, <Woods t={t} a={0} b={c.japan} />],
    [c.japan, <Sequence from={c.japan} layout="none"><FromJapan t={t} a={c.japan} /></Sequence>],
    [c.paper, <Sequence from={c.paper} layout="none"><Paper t={t} a={c.paper} /></Sequence>],
    [c.closer, <Sequence from={c.closer} layout="none"><Closer a={c.closer} b={c.hundreds} /></Sequence>],
    [c.hundreds, <Sequence from={c.hundreds} layout="none"><Hundreds t={t} a={c.hundreds} /></Sequence>],
    [c.silence, <Sequence from={c.silence} layout="none"><Silence t={t} a={c.silence} /></Sequence>],
    [c.q, <Sequence from={c.q} layout="none"><Question t={t} a={c.q} b={c.three} /></Sequence>],
    [c.three, <Sequence from={c.three} layout="none"><Three t={t} a={c.three} /></Sequence>],
    [c.boy, <Sequence from={c.boy} layout="none"><Boy t={t} a={c.boy} b={c.girl} /></Sequence>],
    [c.girl, <Sequence from={c.girl} layout="none"><Girl t={t} a={c.girl} b={c.news} /></Sequence>],
    [c.news, <Sequence from={c.news} layout="none"><Newsman t={t} a={c.news} b={c.back} /></Sequence>],
    [c.back, <Sequence from={c.back} layout="none"><Back a={c.back} b={c.tokyo} /></Sequence>],
    [c.tokyo, <Sequence from={c.tokyo} layout="none"><Tokyo t={t} a={c.tokyo} b={END} /></Sequence>],
  ];
  let scene = useScene(cuts);
  if (frame >= END + INTRO_FRAMES) scene = <Sequence from={END + INTRO_FRAMES} layout="none"><TitleCard /><Finish vignette={0.3} /></Sequence>;
  else if (frame >= END) scene = <Sequence from={END} layout="none"><ChannelIntro /></Sequence>;
  const v = bed('bw_something_in_the_woods');
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {frame < END && <Finish vignette={0.3} />}
      <Audio src={staticFile('audio/v2_ch01_something_in_the_woods.wav')} />
      {/* calm open (the user's note on v1): felt piano, dipping out through the one-second beat */}
      <Audio src={staticFile('music/bw_something_in_the_woods.mp3')} volume={(f) => interpolate(f, [0, 6, END - 40, END], [v, v, v, 0], clamp)} />
      <Sequence from={0} durationInFrames={c.japan + 10} layout="none"><Audio src={staticFile('sfx/forest_birds.wav')} volume={0.12} /></Sequence>
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.22} />)}
      {['found', 'Japan', 'paper', 'knew', 'anyone', 'How', 'nobody', 'warn', 'three', 'keeping'].map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.22} />)}
      {['Nobody', 'thousands', 'own', 'Hundreds', 'potatoes', 'decades', 'Tokyo'].map((p) => <Sfx key={p} at={at(p) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={c.silence + 2} src="sfx/tape_pull.wav" volume={0.25} />
      <Sfx at={at('sweet') - 1} src="sfx/paper_slap_soft.wav" volume={0.3} />
      <Sfx at={c.tokyo + 4} src="sfx/plane_flyby.wav" volume={0.18} />
      <Sfx at={END + INTRO_FRAMES + 4} src="sfx/stamp.wav" volume={0.3} />
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
