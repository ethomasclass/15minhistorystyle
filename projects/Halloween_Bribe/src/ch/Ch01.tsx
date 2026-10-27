// Chapter 1 · the cold open. Hook-first: the real 1933 tear-gas front page is on screen and moving at frame 0, the tape says
// what the thumbnail says, the driving question lands at ~0:29, then the bribe promise, the Texas loop and the turnip tease.
// Then the Chunk History intro and the title card.
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch01_cold_open.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Finish, Highlight, JF, Note, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChannelIntro, INTRO_FRAMES} from '../kit/ChunkIntro';
import {makeTimeline, type Narration, PhotoCard, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {Prop} from '../kit/prop';
import {SilScene} from '../kit/silparallax';
import {HeadlineHook, Smoke} from '../fx/Headline';
import {DATES, SUBTITLE, TITLE} from '../project';
import mob from '../../public/img/layers/sil/ch04_mob_school/layers.json';
import dark from '../../public/img/layers/sil/ch07_dark_house/layers.json';

const N = words as Narration;
const END = Math.ceil(N.duration * 30) + 20;
const TITLE_FRAMES = 150;
export const CH01_FRAMES = END + INTRO_FRAMES + TITLE_FRAMES;
const TEAL = '#2FE0C4';

const TitleCard: React.FC = () => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill style={{background: '#0b0a08'}}>
      <DarkPaper />
      <Highlight text={TITLE} x={300} y={370} size={150} at={4} seed={61} />
      {g >= 14 && <div style={{position: 'absolute', left: 340, top: 610, fontFamily: JF.display, fontSize: 64, color: pal.mark, whiteSpace: 'nowrap',
        textShadow: '0 3px 16px rgba(0,0,0,0.9)', opacity: interpolate(g, [14, 20], [0, 1], clamp)}}>{SUBTITLE}</div>}
      <Note text={DATES} x={880} y={760} size={56} rot={-5} at={24} />
    </AbsoluteFill>
  );
};

/** 0:00 · the front page in 3D, smoke rolling; the tape says TEAR GAS / ON HALLOWEEN? (the thumbnail's words). */
const Hook: React.FC<{t: TL}> = ({t}) => (
  <AbsoluteFill>
    <HeadlineHook pull={t.at('This is a real')} look={t.at('Look at the headline')} loop={t.at('Tear Gas Used')}
      smoke={[[0, 0.75], [t.at('This is a real') + 30, 0.25], [t.at('Look at the headline'), 0.15], [t.at('Pranks') + 10, 0.55]]} />
    <Highlight text="TEAR GAS" x={140} y={700} size={150} at={t.at('Tear')} seed={21} rot={-3} />
    <Highlight text="ON HALLOWEEN?" x={260} y={880} size={110} at={t.at('On Halloween')} seed={22} rot={-2} />
    <Note text="Bismarck, N.D. · Nov. 1, 1933" x={1020} y={110} size={50} rot={-3} at={t.at('North Dakota')} color="#ffffff" />
    <Tag text="The Bismarck Tribune, 1 Nov 1933 · Library of Congress" />
  </AbsoluteFill>
);

/** 0:13 · the night before: the mob at the school (silhouette painting, parallax), smoke surging on "gassed". */
const Mob: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => {
  const f = useCurrentFrame();
  const surge = interpolate(f, [t.at('police') - a, t.at('gassed') - a + 8, b - a], [0.15, 0.95, 0.8], clamp);
  return (
    <AbsoluteFill>
      <SilScene name="ch04_mob_school" size={mob.size as [number, number]} glowLayer={mob.glowLayer} a={0} b={b - a} cam={{z: [1.05, 1.13], x: [-40, 30]}} fade={4} />
      <Smoke density={surge} seed="mob" y={640} spread={260} speed={1.4} />
      <Highlight text="ABOUT 300 BOYS" x={120} y={110} size={96} at={t.at('about 300') - a} seed={23} rot={-2} />
      <Note text="junk cars + garbage" x={1200} y={160} size={58} rot={-4} at={t.at('junk') - a} color="#ffffff" />
    </AbsoluteFill>
  );
};

/** 0:21 · this Saturday: the candy bowl (coral), two numbers. */
const Saturday: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Prop name="candy_bowl" x={1010} y={300} w={760} at={2} coral trace />
    <Highlight text="THIS SATURDAY" x={120} y={150} size={110} at={t.at('This Saturday') - a} seed={24} rot={-2} />
    <Note text="6 in 10 adults" x={150} y={430} size={92} rot={-3} at={t.at('six in ten') - a} />
    <Note text="hand out candy" x={200} y={560} size={78} rot={-3} at={t.at('hand out') - a} color="#ffffff" />
    <Note text="≈ $4 billion of it" x={170} y={760} size={92} rot={-4} at={t.at('four billion') - a} color={TEAL} />
    <Tag text="NRF Halloween survey, Sept 2026" />
  </AbsoluteFill>
);

/** 0:29 · "So how did *that* turn into *this*?" Two cards and an arrow. */
const ThatThis: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <PhotoCard src="img/ch03/bismarck_tribune_1933-11-01_tear_gas_headline.jpg" x={110} y={360} w={760} h={180} rot={-3} at={t.at('that') - a} fit="cover" pos="50% 50%"
      filter="grayscale(1) contrast(1.35)" />
    <Note text="that" x={330} y={230} size={100} rot={-4} at={t.at('that') - a} color="#ffffff" />
    <Prop name="candy_bowl" x={1180} y={330} w={560} at={t.at('this?') - a} coral from="none" />
    <Note text="this?" x={1360} y={190} size={100} rot={-4} at={t.at('this?') - a} />
    <Arrow x1={900} y1={470} x2={1150} y2={500} bow={-60} at={t.at('turn') - a} color={TEAL} width={7} />
  </AbsoluteFill>
);

/** 0:31 · the short answer: a bribe (the kid counting candy, matches thumbnail X3), then the bigger promise. */
const Bribe: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 300], [1.03, 1.12], clamp);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img src={staticFile('img/gen/thumb/x3.png')} style={{position: 'absolute', inset: 0, width: 1920, height: 1080, objectFit: 'cover', transform: `scale(${z})`, transformOrigin: '70% 50%'}} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 55%)'}} />
      <Note text="trick-or-treating" x={90} y={150} size={84} rot={-3} at={t.at('Trick-or-treating') - a} color="#ffffff" />
      <Highlight text="WAS A BRIBE" x={90} y={290} size={140} at={t.at('bribe') - a} seed={25} rot={-3} />
      <Note text="almost everything Halloween =" x={100} y={620} size={58} rot={-3} at={t.at('almost everything') - a} color="#ffffff" />
      <Note text="a grown-up's plan to stop it" x={130} y={720} size={70} rot={-3} at={t.at("grown-up's") - a} color={TEAL} />
    </AbsoluteFill>
  );
};

/** 0:40 · the long loop: one night in Texas (quiet, teal only). */
const Texas: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="ch07_dark_house" size={dark.size as [number, number]} glowLayer={dark.glowLayer} a={0} b={b - a} cam={{z: [1.03, 1.1], x: [20, -20]}} flicker={0.1} fade={4} />
    <AbsoluteFill style={{background: 'rgba(8,20,24,0.35)', mixBlendMode: 'multiply'}} />
    <Note text="one night in Texas" x={140} y={160} size={84} rot={-3} at={t.at('Texas') - a} color={TEAL} />
    <Note text="(we'll come back to it)" x={170} y={290} size={56} rot={-3} at={t.at('keep the peace') - a} color="#ffffff" />
  </AbsoluteFill>
);

/** 0:48 · "we need a vegetable. And it's not a pumpkin." The turnip lantern drops onto the desk. */
const Vegetable: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Prop name="turnip_lantern" x={700} y={180} w={540} at={t.at('vegetable') - a} coral trace from="top" />
    <Note text="not a pumpkin." x={1120} y={760} size={80} rot={-5} at={t.at('not a pumpkin') - a} />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {mob: at('The night before') - 1, sat: at('This Saturday') - 1, that: at('So how did') - 1, bribe: at("Here's the short") - 1,
    texas: at("We'll get to") - 1, veg: at('But first') - 1};
  const cuts: [number, React.ReactNode][] = [
    [0, <Hook t={t} />],
    [c.mob, <Sequence from={c.mob} layout="none"><Mob t={t} a={c.mob} b={c.sat} /></Sequence>],
    [c.sat, <Sequence from={c.sat} layout="none"><Saturday t={t} a={c.sat} /></Sequence>],
    [c.that, <Sequence from={c.that} layout="none"><ThatThis t={t} a={c.that} /></Sequence>],
    [c.bribe, <Sequence from={c.bribe} layout="none"><Bribe t={t} a={c.bribe} /></Sequence>],
    [c.texas, <Sequence from={c.texas} layout="none"><Texas t={t} a={c.texas} b={c.veg} /></Sequence>],
    [c.veg, <Sequence from={c.veg} layout="none"><Vegetable t={t} a={c.veg} /></Sequence>],
  ];
  let scene = useScene(cuts);
  if (frame >= END + INTRO_FRAMES) scene = <Sequence from={END + INTRO_FRAMES} layout="none"><TitleCard /><Finish vignette={0.3} /></Sequence>;
  else if (frame >= END) scene = <Sequence from={END} layout="none"><ChannelIntro /></Sequence>;
  const v = bed('hb_black_halloween');
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {frame < END && <Finish vignette={0.3} />}
      <Audio src={staticFile('audio/ch01_cold_open.wav')} />
      {/* the cue from 0:31 so its hush (~1:00 in the cue) lands under "So how did that turn into this?" */}
      <Audio src={staticFile('music/hb_black_halloween.mp3')} startFrom={31 * 30} volume={(f) => interpolate(f, [0, 6, END - 40, END], [0, v, v, 0], clamp)} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      <Sfx at={0} src="sfx/paper_rustle.wav" volume={0.35} />
      {['Tear', 'On Halloween', 'about 300', 'This Saturday', 'bribe'].map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.3} />)}
      {['North Dakota', 'junk', 'six in ten', 'hand out', 'four billion', 'that', 'this?', 'Trick-or-treating', 'almost everything', "grown-up's", 'Texas', 'not a pumpkin'].map((p) =>
        <Sfx key={p} at={at(p) - 2} src={WRITE.src} volume={WRITE.volume} />)}
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
