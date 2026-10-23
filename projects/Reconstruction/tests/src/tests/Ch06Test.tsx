// Episode 1, chapter 6 ("except as a punishment for crime"), built as a test of the Vox motion study's techniques on
// real primary sources, voiced by the channel narrator (Ellis, tools/voice.py at the locked pace):
//   the tilted page with depth of field  -> the 13th Amendment, the Mississippi acts
//   the word match cut                   -> "vagrant" in 1865-66 newspapers across the South (tools/word_hunt.py)
//   the torn-paper reveal                -> the 13th Amendment tears to reveal the Black Code
//   focus on arrival, motion carried through the cuts, the spotlight cut
// Sources: the joint resolution signed by Lincoln (LOC, Lincoln Papers mal4361100); the Mississippi acts as printed in
// the American Citizen (Canton, Miss.), Nov. 28, 1865, and the Weekly Copiahan (Hazlehurst, Miss.), Dec. 30, 1865.
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch06_except_crime.words.json';
import FA from '../../public/img/ch06/ms_freedmen_act.json';
import VA from '../../public/img/ch06/ms_vagrant_act.json';
import RUN from '../../public/img/ch06/run/run.json';
import {DarkPaper, Sfx} from '../kit/common';
import {Highlight, JF, Note, Tag, useGFrame} from '../kit/Kit';
import {Definition, Stamp, useScene} from '../kit/shell';
import {makeTimeline, type Narration} from '../lib/timing';
import {TestFrame} from './common';
import {APin, Land} from './CollageAnim';
import {BRAND, Ctx, Defs, Scrap, Splats, Strip} from './CollageMocks';
import {type Box, camAt, carry, CORAL, FocusIn, type RunItem, Sheet, type SheetCam, Spot, Swipe, TEAL, Tear, WordRun} from './voxkit';

const N = words as Narration;
const t = makeTimeline(N, 30);
const c = (p: string, n = 1) => t.at(p, n) - 2;        // cut two frames before the word

const T13 = 'img/ch06/thirteenth_src.jpg';
const T13S: [number, number] = [3196, 4253];
const T13F = 'grayscale(1) sepia(0.15) contrast(1.6) brightness(1.08)';
const T13_LINE: Box = [2035, 928, 860, 62];              // "except as a punishment for crime;"
const T13_SIX: Box[] = [[2040, 935, 140, 50], [2158, 945, 60, 40], [2232, 945, 28, 40], [2305, 935, 245, 55], [2580, 930, 85, 55], [2695, 940, 190, 45]];
const FAS = FA.size as [number, number];
const VAS = VA.size as [number, number];
const ph = (j: {phrases: Record<string, number[][]>}, k: string) => j.phrases[k] as Box[];
const F_ENACT = ph(FA, 'Be it enacted by the Legislature of the State of Mississippi');
const F_RENT = ph(FA, 'to rent or lease any lands or tenements, except in incorporated towns or cities');
const F_HOME = ph(FA, 'have a lawful home or employment, and shall have written evidence thereof');
const F_JAN = ph(FA, 'second Monday of January');
const V_TITLE = ph(VA, 'To Amend the Vagrant Laws');
const V_SHERIFF = ph(VA, 'the duty of the sheriff of the proper county to hire out said freedman, free negro or mulatto, to any person who will for the shortest period of service, pay said fine');

const SRC_T13 = 'Joint resolution, 13th Amendment, signed by Lincoln, Feb. 1, 1865 · Library of Congress';
const SRC_FA = 'American Citizen (Canton, Miss.), Nov. 28, 1865 · Library of Congress';
const SRC_VA = 'Weekly Copiahan (Hazlehurst, Miss.), Dec. 30, 1865 · Library of Congress';

// the shots
const S2 = c('But look'), S3 = c('Under'), S4 = c('They picked'), S5 = c('Then those'), S7 = c('One Every'), S8 = c('Two Without');
const WR = t.at('vagrant') - 1, S9 = c('Three If'), S10 = c('And one more'), S11 = c('That means'), S12 = c('Because of');
const END = t.end('crime', 3) + 22;
export const CH06_FRAMES = END + 120;

const Counter: React.FC<{n: number; at: number}> = ({n, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  return <div style={{position: 'absolute', right: 100, top: 100, fontFamily: JF.mono, fontSize: 34, letterSpacing: 2, color: '#f4efe6', textShadow: '0 2px 10px #000'}}>STEP {n}/3</div>;
};

/** A hard cut lands with a whoosh. */
const Cuts: React.FC = () => <>{[S3, S4, S5, S7, S8, S9, S10, S11, S12, END].map((f) => <Sfx key={f} at={f - 3} src="sfx/whoosh.wav" volume={0.18} />)}</>;

// ---------------------------------------------------------------------------------------------------------- shots
/** The amendment arrives: focus on arrival, a slow push. */
const Amend: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt([[0, {x: 1598, y: 1500, z: 0.27}], [S2, {x: 1598, y: 1320, z: 0.32}]], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={2}><Sheet src={T13} size={T13S} cam={cam} seed="t13" filter={T13F} /></FocusIn>
      <Highlight text="13TH AMENDMENT" x={100} y={106} size={70} at={t.at('13th')} seed={4} rot={-2} />
      <Note text="Dec. 1865" x={110} y={215} size={44} at={t.at('December')} />
      <Note text="3 of 4 states say yes" x={1360} y={330} size={38} rot={-3} at={t.at('three out of four')} dur={14} />
      <Note text="slavery: over" x={1460} y={450} size={40} rot={-3} at={t.at('ended slavery')} color={CORAL} />
      <Sfx at={2} src="sfx/tick.wav" volume={0.4} />
      <Tag text={SRC_T13} />
    </AbsoluteFill>
  );
};

/** The page lies back, the camera reads along Section 1 with a narrow depth of field; the swipe runs on the words. */
const Middle: React.FC = () => {
  const f = useCurrentFrame();
  const L: SheetCam = {x: 0, y: 958, z: 0.62, tilt: 40, dof: 3.2, band: 60};
  const cam = camAt([
    [S2, {x: 1598, y: 1320, z: 0.32, tilt: 0, dof: 0, band: 400}],
    [S2 + 24, {...L, x: 1150, z: 0.66}],
    [t.at('except'), {...L, x: 1900, z: 0.74}],
    [t.end('crime'), {...L, x: 2420, z: 0.82}],
    [S3, {...L, x: 2470, z: 0.86}],
  ], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src={T13} size={T13S} cam={cam} seed="t13" filter={T13F}>
        <Swipe lines={[T13_LINE]} from={t.at('except')} to={t.end('crime')} seed="m1" />
        <Spot size={T13S} boxes={[T13_LINE]} at={t.at('Hold onto')} id="sp1" />
      </Sheet>
      <Sfx at={t.at('except')} src="sfx/marker_tick.wav" volume={0.25} />
      <Sfx at={t.at('Hold onto')} src="sfx/tick.wav" volume={0.4} />
      <Tag text={SRC_T13} />
    </AbsoluteFill>
  );
};

/** A creased photo, focusing in, carried through the cuts on either side. */
const PhotoShot: React.FC<{src: string; size: [number, number]; a: number; b: number; w: number; children?: React.ReactNode; tag: string}> = ({src, size, a, b, w, children, tag}) => {
  const f = useCurrentFrame();
  const h = (size[1] * w) / size[0];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={a}>
        <Img src={staticFile(src)} style={{position: 'absolute', left: 960 - w / 2 + carry(f, a, b), top: 540 - h / 2, width: w, height: h, filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.7))'}} />
      </FocusIn>
      {children}
      <Sfx at={a} src="sfx/tick.wav" volume={0.35} />
      <Tag text={tag} />
    </AbsoluteFill>
  );
};

/** The 13th Amendment tears in two and falls away: the Mississippi act was underneath. It then reads its title line. */
const Codes: React.FC = () => {
  const f = useCurrentFrame();
  const top = (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src={T13} size={T13S} cam={{x: 1598 + carry(f, S5, 99999) * -3, y: 1150, z: 0.36}} seed="t13" filter={T13F}>
        <Swipe lines={[T13_LINE]} from={-10} to={-9} seed="m1" />
      </Sheet>
    </AbsoluteFill>
  );
  const cam = camAt([[S5, {x: 672, y: 560, z: 0.9}], [t.at('Mississippi went') - 10, {x: 672, y: 470, z: 0.92}], [t.at('Mississippi went') + 8, {x: 760, y: 150, z: 1.3}], [S7, {x: 800, y: 170, z: 1.3}]], f);
  return (
    <Tear at={t.at('Black Codes') - 3} top={top} seed="tear">
      <DarkPaper />
      <Sheet src="img/ch06/ms_freedmen_act.jpg" size={FAS} cam={cam} seed="fa">
        <Swipe lines={F_ENACT} from={t.at('Mississippi went')} to={t.end('November 1865')} seed="fa1" />
      </Sheet>
      <Highlight text="BLACK CODES" x={100} y={106} size={84} at={t.at('Black Codes') + 8} seed={6} rot={-2} />
      <Definition term="Black Codes" def="laws that applied only to Black Southerners" at={t.at('laws that')} x={120} y={860} />
      <Note text="Nov. 1865" x={1500} y={120} size={50} at={t.at('November')} />
      <Tag text={SRC_FA} />
    </Tear>
  );
};

/** Step one: a written proof of a job, every January. The page tilts; focus walks down two lines. */
const StepOne: React.FC = () => {
  const f = useCurrentFrame();
  const L: SheetCam = {x: 0, y: 1465, z: 1.3, tilt: 34, dof: 2.6, band: 42};
  const cam = camAt([[S7, {...L, x: 420}], [t.at('needed'), {...L, x: 560, y: 1500, dofY: 1500}], [S8, {...L, x: 760, y: 1510, dofY: 1510}]], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src="img/ch06/ms_freedmen_act.jpg" size={FAS} cam={cam} seed="fa" offset={[carry(f, S7, S8), 0]}>
        <Swipe lines={F_JAN} from={t.at('Every January')} to={t.end('January')} seed="fa2" />
        <Swipe lines={F_HOME} from={t.at('written proof')} to={t.end('ahead')} seed="fa3" />
      </Sheet>
      <Counter n={1} at={S7} />
      <Tag text={SRC_FA} />
    </AbsoluteFill>
  );
};

/** Step two: the Vagrant Law, then "vagrant" in paper after paper across the South. */
const StepTwo: React.FC = () => {
  const f = useCurrentFrame();
  const L: SheetCam = {x: 0, y: 3320, z: 1.25, tilt: 30, dof: 2.6, band: 50};
  const cam = camAt([[S8, {...L, x: 330}], [WR, {...L, x: 420, z: 1.35}]], f);
  const items = RUN as unknown as RunItem[];
  const durs = [9, 8, 7, 6, 5, 4, 4, 3, 3, 3, 3];
  const lastAt = WR + items.slice(0, -1).reduce((s, _, i) => s + durs[Math.min(i, durs.length - 1)], 0);
  if (f >= WR) {
    return (
      <AbsoluteFill>
        <WordRun items={items} at={WR} durs={durs} />
        <Definition term="vagrant" def="someone with no job and no home" at={Math.max(lastAt + 4, t.at('someone'))} x={120} y={860} />
        <Counter n={2} at={S8} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src="img/ch06/ms_vagrant_act.jpg" size={VAS} cam={cam} seed="va" offset={[carry(f, S8, WR + 8), 0]}>
        <Swipe lines={V_TITLE} from={t.at('Without')} to={t.at('vagrant') - 2} seed="va1" />
      </Sheet>
      <Counter n={2} at={S8} />
      <Tag text={SRC_VA} />
    </AbsoluteFill>
  );
};

/** Step three: the sheriff hires them out. */
const StepThree: React.FC = () => {
  const f = useCurrentFrame();
  const L: SheetCam = {x: 1150, y: 250, z: 1.15, tilt: 30, dof: 2.4, band: 70};
  const cam = camAt([[S9, L], [t.at('whoever'), {...L, y: 330, dofY: 330}], [S10, {...L, y: 400, dofY: 400, z: 1.2}]], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src="img/ch06/ms_vagrant_act.jpg" size={VAS} cam={cam} seed="va" offset={[carry(f, S9, S10), 0]}>
        <Swipe lines={V_SHERIFF} from={t.at('the sheriff')} to={t.end('paid it')} seed="va2" />
      </Sheet>
      <Note text="often, a planter" x={1180} y={820} size={54} rot={-3} at={t.at('Often')} color={CORAL} />
      <Counter n={3} at={S9} />
      <Tag text={SRC_VA} />
    </AbsoluteFill>
  );
};

/** One more rule: no renting land outside the towns. Then the rest of the page steps back. */
const Land_: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt([[S10, {x: 620, y: 300, z: 1.3}], [S11, {x: 700, y: 330, z: 1.42}]], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src="img/ch06/ms_freedmen_act.jpg" size={FAS} cam={cam} seed="fa" offset={[carry(f, S10, S11), 0]}>
        <Swipe lines={F_RENT} from={t.at('Freedpeople')} to={t.end('towns')} seed="fa4" />
        <Spot size={FAS} boxes={F_RENT} at={t.at('locked away')} id="sp2" />
      </Sheet>
      <Stamp text="LOCKED AWAY" x={560} y={780} size={110} color={CORAL} rot={-3} at={t.at('locked away')} />
      <Sfx at={t.at('locked away')} src="sfx/stamp.wav" volume={0.45} />
      <Tag text={SRC_FA} />
    </AbsoluteFill>
  );
};

/** A window onto one part of a page (page px box centred), torn, on the desk. */
const Win: React.FC<{src: string; cx: number; cy: number; s: number; w: number; h: number; x: number; y: number; r: number; seed: string; filter?: string}> = ({src, cx, cy, s, w, h, x, y, r, filter = 'grayscale(1) sepia(0.12) contrast(1.15)'}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${r}deg)`, filter: 'drop-shadow(0 14px 20px rgba(0,0,0,0.7))'}}>
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#ddd6c6', clipPath: `polygon(0 2%, 100% 0, 99% 97%, 1% 100%)`}}>
      <Img src={staticFile(src)} style={{position: 'absolute', left: w / 2 - cx * s, top: h / 2 - cy * s, transform: `scale(${s})`, transformOrigin: '0 0', filter}} />
    </div>
  </div>
);

/** Free, arrested, put to work: three pieces of the same page set, each on its words. */
const ThreeUp: React.FC = () => {
  const f = useCurrentFrame();
  const dx = carry(f, S11, S12);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `translateX(${dx}px)`}}>
        <FocusIn at={t.at('free under')}><Win src={T13} cx={1150} cy={958} s={0.66} filter={T13F} w={560} h={190} x={70} y={330} r={-2} seed="w1" /></FocusIn>
        <FocusIn at={t.at('arrested for')}><Win src="img/ch06/ms_vagrant_act.jpg" cx={330} cy={4250} s={1.05} w={560} h={190} x={680} y={360} r={1.5} seed="w2" /></FocusIn>
        <FocusIn at={t.at('put to work')}><Win src="img/ch06/ms_vagrant_act.jpg" cx={1120} cy={300} s={0.82} w={560} h={190} x={1290} y={330} r={-1.5} seed="w3" /></FocusIn>
        <Note text="free" x={300} y={560} size={60} at={t.at('free under')} />
        <Note text="arrested" x={840} y={590} size={60} at={t.at('arrested for')} />
        <Note text="put to work" x={1400} y={560} size={60} at={t.at('put to work')} />
      </AbsoluteFill>
      <Highlight text="AND IT WAS LEGAL." x={520} y={780} size={84} at={t.at('And it was legal')} seed={8} rot={-2} />
      {['free under', 'arrested for', 'put to work'].map((p) => <Sfx key={p} at={t.at(p)} src="sfx/tick.wav" volume={0.35} />)}
    </AbsoluteFill>
  );
};

/** Six words: the line again, each word numbered as it's said. */
const Six: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const i0 = t.idx('Except', 3);
  const L: SheetCam = {x: 2300, y: 958, z: 0.82, tilt: 40, dof: 3.2, band: 60};
  const cam = camAt([[S12, {...L, x: 2150}], [t.end('crime', 3), {...L, x: 2470, z: 0.9}]], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src={T13} size={T13S} cam={cam} seed="t13" filter={T13F} offset={[carry(f, S12, END), 0]}>
        <Swipe lines={[T13_LINE]} from={t.wordAt(i0)} to={t.end('crime', 3)} seed="m3" />
        {T13_SIX.map(([x, y, w], k) => g >= t.wordAt(i0 + k) && (
          <div key={k} style={{position: 'absolute', left: x + w / 2 - 30, top: y - 120, width: 60, textAlign: 'center', fontFamily: JF.display, fontSize: 84, color: TEAL,
            textShadow: '0 0 4px #111, 3px 3px 0 #111, -3px 3px 0 #111, 0 4px 16px rgba(0,0,0,0.8)'}}>{k + 1}</div>
        ))}
      </Sheet>
      {T13_SIX.map((_, k) => <Sfx key={k} at={t.wordAt(i0 + k)} src="sfx/tick_soft.wav" volume={0.3} />)}
      <Tag text={SRC_T13} />
    </AbsoluteFill>
  );
};

/** The chapter's piece lands on the board. */
const Board: React.FC = () => (
  <Ctx.Provider value={BRAND}>
    <AbsoluteFill style={{background: BRAND.bg}}>
      <Defs />
      <Splats seed="c6" />
      <div style={{position: 'absolute', left: 1450, top: 160, fontFamily: '"Nanum Pen Script", cursive', fontSize: 74, color: 'rgba(244,239,230,0.55)', transform: 'rotate(-2deg)'}}>LAW</div>
      <Land at={END + 8} kind="drop" x={720} y={380} r={2}><Scrap text="Neither slavery nor involuntary servitude, except as a punishment for crime…" mark="except as a punishment for crime" w={480} seed="13" size={32} /></Land>
      <Land at={END + 22} kind="slide" x={740} y={330} r={-3}><Strip text="13th Amendment · 1865" seed="e6" size={26} /></Land>
      <APin at={END + 32} x={960} y={400} />
      <Sfx at={END + 8} src="sfx/page_turn.wav" volume={0.3} />
      <Sfx at={END + 32} src="sfx/knock.wav" volume={0.4} />
    </AbsoluteFill>
  </Ctx.Provider>
);

/** Two period-instrument beds (MUSIC.md): hopeful banjo and fiddle for "the good news", handing over to the trapped
 *  harmonium-and-fiddle cue at "Then those governments", which lifts after the last word and fades with the board. */
const clampX = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const Music: React.FC = () => {
  const hand = c('Then those');
  return (
    <>
      <Audio src={staticFile('music/rc_jubilo.mp3')} volume={(f) => interpolate(f, [0, 20, hand - 24, hand + 6], [0, 0.24, 0.24, 0], clampX)} />
      <Sequence from={hand - 12} layout="none">
        <Audio src={staticFile('music/rc_codes.mp3')} volume={(f) => {
          const end = CH06_FRAMES - (hand - 12);
          const said = t.end('crime', 3) - (hand - 12);
          return interpolate(f, [0, 18, said, said + 18, end - 30, end], [0, 0.17, 0.17, 0.26, 0.26, 0], clampX);
        }} />
      </Sequence>
    </>
  );
};

export const Ch06Test: React.FC = () => {
  const scene = useScene([
    [0, <Amend key="a" />],
    [S2, <Middle key="m" />],
    [S3, <PhotoShot key="j" src="img/wall/cr_johnson.png" size={[900, 1101]} a={S3} b={S4} w={560} tag="Andrew Johnson · Library of Congress">
      <Note text="new state governments" x={1240} y={300} size={40} rot={-3} at={t.at('elected')} />
    </PhotoShot>],
    [S4, <PhotoShot key="p" src="img/wall/cr_pardons.png" size={[900, 1114]} a={S4} b={S5} w={560} tag="Pardon applications · Library of Congress">
      <Note text="the same men" x={1290} y={330} size={50} rot={-3} at={t.at('same men')} color={CORAL} />
    </PhotoShot>],
    [S5, <Codes key="c" />],
    [S7, <StepOne key="1" />],
    [S8, <StepTwo key="2" />],
    [S9, <StepThree key="3" />],
    [S10, <Land_ key="l" />],
    [S11, <ThreeUp key="u" />],
    [S12, <Six key="s" />],
    [END, <Board key="b" />],
  ]);
  return (
    <TestFrame vignette={0.4}>
      {scene}
      <Audio src={staticFile('audio/ch06_except_crime.wav')} />
      <Music />
      <Cuts />
    </TestFrame>
  );
};
