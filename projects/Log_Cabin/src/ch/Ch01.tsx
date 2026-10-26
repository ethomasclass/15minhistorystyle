// Chapter 1 · The Insult (cold open): the Baltimore editor's line, the question, the plantation father, a crash ahead.
// Then the channel intro and the title card.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch01_cold_open.words.json';
import {clamp} from '../lib/anim';
import {Finish, Highlight, JF, Loop, Note, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame, usePal} from '../kit/Kit';
import {MapView} from '../kit/common';
import {ChannelIntro, INTRO_FRAMES} from '../kit/Intro';
import {CropCard, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {Sounds, SyncQuote} from '../kit/bs';
import {BARREL, Board, CABIN, CHAIR, CrashChart, NEWSPAPER, PLANTATION, Sketch, Strike} from '../kit/lc';
import {MASKS} from '../masks';
import {DATES, SUBTITLE, TITLE} from '../project';

const N = words as Narration;
/** Title card length (frames) after the channel intro. */
const TITLE_FRAMES = 150;
/** Narration ends; the channel intro starts 20 frames later. */
const END = Math.ceil(N.duration * 30) + 20;
export const CH01_FRAMES = END + INTRO_FRAMES + TITLE_FRAMES;

const BHV: [number, number] = [1920, 2410];

/** December 1839, a newspaper in Baltimore, an editor who is not impressed. */
const Paper: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Board>
      <Highlight text="DECEMBER 1839" x={110} y={100} size={110} at={t.at('December')} seed={11} rot={-2} />
      <Sketch d={NEWSPAPER} x={170} y={330} w={420} at={t.at('newspaper')} dur={14} rot={-4} seed="np" />
      <Note text="a newspaper in Baltimore" x={150} y={900} size={54} rot={-3} at={t.at('newspaper') + 2} />
      <Note text="an editor hears the other party's pick..." x={760} y={360} size={52} rot={-3} at={t.at('An editor') - 3} color="#ffffff" />
      <Note text="not impressed" x={820} y={470} size={64} rot={-3} at={t.at('not impressed') - 3} />
      <Note text="too old" x={860} y={610} size={82} rot={-4} at={t.at('too old') - 3} color={pal.subject} />
      <Note text="too tired" x={1240} y={640} size={82} rot={-3} at={t.at('too tired') - 3} color={pal.subject} />
      <Note text="his advice:" x={880} y={820} size={60} rot={-3} at={t.at('advice') - 3} color="#ffffff" />
    </Board>
  );
};

/** The quote, word by word as it's read, with the barrel and the cabin drawing themselves beside it. */
const TheQuote: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Board>
      <SyncQuote t={t} phrase={'"Give him a barrel of hard cider, and settle a pension of two thousand a year on him, and, my word for it, he will sit the remainder of his days in his log cabin."'}
        x={110} y={110} w={1100} size={58} marks={{3: pal.mark, 6: pal.mark, 33: pal.subject, 34: pal.subject}} />
      <Sketch d={BARREL} x={1330} y={120} w={210} at={t.at('barrel')} dur={12} seed="b1" />
      <Note text="hard cider" x={1560} y={250} size={50} rot={-6} at={t.at('cider,') - 2} />
      <Sketch d={CABIN} x={1250} y={560} w={520} at={t.at('log cabin')} dur={14} seed="c1" />
      <Tag text="Baltimore Republican, December 1839 · as widely reprinted in 1840" />
    </Board>
  );
};

/** It's an insult... and the other party loves it. */
const Insult: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Board>
      {useGFrame() < t.at('The other party', 2) && <Highlight text="AN INSULT." x={110} y={100} size={120} at={t.at('insult.')} seed={13} rot={-2} />}
      <Sketch d={CABIN} x={980} y={300} w={560} at={t.at('insult.') + 2} dur={10} seed="c2" />
      <Sketch d={CHAIR} x={860} y={560} w={110} at={t.at('porch')} dur={8} seed="ch" />
      <Sketch d={BARREL} x={1580} y={600} w={150} at={t.at('drinking cider')} dur={8} seed="b2" />
      <Note text="a president?" x={140} y={420} size={70} rot={-3} at={t.at('A president') - 3} color="#ffffff" />
      <Strike x1={130} y1={480} x2={560} y2={450} at={t.at("doesn't sit") + 4} />
      <Note text="a farmer." x={170} y={560} size={86} rot={-3} at={t.at('A farmer') - 3} color={pal.subject} />
      <Note text="the other party:" x={140} y={140} size={60} rot={-3} at={t.at('The other party', 2) - 3} color="#ffffff" />
      {useGFrame() >= t.at('perfect.') && <Highlight text="PERFECT." x={140} y={760} size={140} at={t.at('perfect.')} seed={15} rot={-3} />}
      <Loop cx={1260} cy={480} rx={390} ry={250} at={t.at('perfect.') + 3} seed={17} tilt={-4} />
    </Board>
  );
};

/** The driving question, written on the desk. */
const Question: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Board>
      <Note text="the question:" x={180} y={170} size={60} rot={-3} at={t.at('the question') - 3} color="#ffffff" />
      <Note text="how did an insult" x={230} y={300} size={96} rot={-3} at={t.at('How did') - 3} />
      <Note text="about a log cabin" x={260} y={450} size={96} rot={-3} at={t.at('about a log') - 3} />
      <Note text="get a man elected president?" x={290} y={610} size={96} rot={-3} at={t.at('get a man') - 3} color={pal.subject} />
      <Sketch d={CABIN} x={1420} y={760} w={300} at={t.at('about a log')} dur={8} seed="c3" />
    </Board>
  );
};

/** The man in the log cabin was a plantation son: his father signed the Declaration. */
const Father: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Board>
      <CropCard mask={MASKS.bharrison} src="img/ch01/benjamin_harrison_v.jpg" size={BHV} x={150} y={150} w={560} h={760} fx={980} fy={1180} scale={0.46} rot={-2} at={1} traceAt={t.at('father')} />
      <Sketch d={PLANTATION} x={840} y={150} w={460} at={t.at('plantation')} dur={12} seed="pl" />
      <Note text="born on a Virginia plantation" x={840} y={460} size={52} rot={-3} at={t.at('plantation') - 2} />
      <Note text="his father:" x={840} y={570} size={52} rot={-3} at={t.at('to a father') - 3} color="#ffffff" />
      {useGFrame() >= t.at('signed') && <Highlight text="SIGNED THE DECLARATION" x={830} y={650} size={70} at={t.at('signed')} seed={19} rot={-2} />}
      <Sketch d={CABIN} x={1560} y={770} w={210} at={t.at('Not exactly')} dur={6} seed="c4" />
      <Strike x1={1540} y1={960} x2={1790} y2={790} at={t.at('cabin kid')} />
      <Note text="not exactly a cabin kid" x={850} y={850} size={56} rot={-3} at={t.at('Not exactly') - 3} color={pal.subject} />
      <Tag text="Benjamin Harrison V, signer of the Declaration of Independence · via DPLA" />
    </Board>
  );
};

/** ...but first, a crash. */
const Crash: React.FC<{t: TL}> = ({t}) => (
  <Board>
    <CrashChart x={360} y={240} w={1200} h={560} at={t.at('To see') + 2} dur={30} label="1837" />
    <Note text="first: a crash" x={400} y={880} size={70} rot={-3} at={t.at('crash.') - 3} />
  </Board>
);

/** Title card after the channel intro: the 1836 map dimmed, the title on orange, the subtitle in teal. */
const Title: React.FC = () => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapView cx={2500} cy={2200} s={0.42 + g * 0.0003} rot={0} dim={0.5} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(8,6,4,0.2) 30%, rgba(8,6,4,0.85) 100%)'}} />
      <Highlight text={TITLE} x={420} y={340} size={190} at={4} seed={61} rot={-2} />
      {g >= 14 && <div style={{position: 'absolute', left: 460, top: 630, fontFamily: JF.display, fontSize: 64, color: pal.mark, textShadow: '0 3px 16px rgba(0,0,0,0.8)', opacity: interpolate(g, [14, 20], [0, 1], clamp)}}>{SUBTITLE}</div>}
      <Note text={DATES} x={1300} y={760} size={52} rot={-5} at={24} />
      <Sketch d={CABIN} x={180} y={760} w={240} at={10} dur={10} seed="tc" />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Paper t={t} />],
    [at('Give him') - 2, <TheQuote t={t} />],
    [at("That's an insult") - 1, <Insult t={t} />],
    [at("So here's") - 1, <Question t={t} />],
    [at("And here's the first") - 1, <Father t={t} />],
    [at('To see') - 1, <Crash t={t} />],
  ];
  let scene = useScene(cuts);
  if (frame >= END + INTRO_FRAMES) scene = <Sequence from={END + INTRO_FRAMES} layout="none"><Title /></Sequence>;
  else if (frame >= END) scene = <Sequence from={END} layout="none"><ChannelIntro /></Sequence>;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {frame < END && <Finish vignette={0.3} />}
      <Audio src={staticFile('audio/ch01_cold_open.wav')} />
      <Audio src={staticFile('music/r_cold_open.mp3')} volume={(f) => interpolate(f, [0, 15, END - 40, END], [0, 0.17, 0.17, 0], clamp)} />
      {frame < END + 10 && (
        <Sounds cuts={cuts.map((c) => c[0])} stamps={[at('December'), at('insult.'), at('perfect.'), at('signed')]}
          writes={['newspaper', 'An editor', 'not impressed', 'too old', 'too tired', 'advice', 'cider,', 'A president', 'A farmer', 'reads it,', 'the question', 'How did', 'about a log', 'get a man', 'plantation', 'to a father', 'Not exactly', 'crash.'].map((p) => at(p))} />
      )}
      <Sequence from={END + INTRO_FRAMES + 4} layout="none"><Audio src={staticFile('sfx/stamp.wav')} volume={0.4} /></Sequence>
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
