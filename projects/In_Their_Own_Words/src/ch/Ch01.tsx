// Chapter 1 · the cold open: Stephens said slavery in 1861, states' rights in 1868; the driving question; the picnic.
// Then the channel intro and the title card. Chapter 1 has no logo break in front.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import mapData from '../../public/maps/civwar1861.json';
import words from '../../public/audio/ch01_cold_open.words.json';
import {clamp} from '../lib/anim';
import {Finish, Highlight, JF, Loop, Note, PALETTES, PaletteCtx, Picture, StepCtx, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChannelIntro, INTRO_FRAMES} from '../kit/Intro';
import {DropCard} from '../kit/bs';
import {sizeOf} from '../kit/dk';
import {Engraving} from '../kit/engraving';
import {BORDER_1861, type Cam3, CONFEDERACY_1861, Count, MAP3D, Map3D, type MapData, StateTiles, UNION_FREE_1861} from '../kit/map3d';
import {Parallax} from '../kit/parallax';
import {CropCard, Definition, fill, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';
import {DATES, SUBTITLE, TITLE} from '../project';

const N = words as Narration;
const D = mapData as unknown as MapData;
/** Title card length (frames) after the channel intro. */
const TITLE_FRAMES = 150;
/** Narration ends; the channel intro starts 20 frames later. */
const END = Math.ceil(N.duration * 30) + 20;
export const CH01_FRAMES = END + INTRO_FRAMES + TITLE_FRAMES;

const CORAL = '#FF6F61';
const ORANGE = '#FF9F1C';

// Stephens, the two pictures and the book (shared with ch09, which comes back to the same framing)
export const YOUNG = 'img/ch01/stephens_portrait_vannerson_1859.jpg';
export const OLD = 'img/ch01/stephens_portrait_brady_c1870.jpg';
export const BOOK = 'img/ch01/stephens_constitutional_view_title_page_1868.jpg';
export const YOUNG_TAG = 'Julian Vannerson, Alexander H. Stephens, 1859 · Library of Congress';
const SPECTATORS = 'img/gen/v1_ch07_spectators.jpg';
const SUMTER = 'img/ch05/bombardment_fort_sumter_engraving_apr1861.jpg';

/**
 * The Stephens portrait as ch01 frames it: the face in the left third, room on the right for notes.
 * The album page's binding (right) is cropped out.
 */
export const StephensPortrait: React.FC<{a: number; b: number; traceAt: number; tag?: string; children?: React.ReactNode}> = ({a, b, traceAt, tag = YOUNG_TAG, children}) => (
  <Parallax name="stephens" src={YOUNG} size={sizeOf(YOUNG)} a={a} b={b} fx={0.6} fy={0.25} crop={[60, 420, 2150, 2700]}
    cam={{z: [1.0, 1.08]}} depth={1.05} vignette={0.5} mask={MASKS.stephens} tintStrength={0.75} traceAt={traceAt} tag={tag}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to left, rgba(8,7,5,0.78) 0%, rgba(8,7,5,0.55) 38%, rgba(0,0,0,0) 60%)'}} />
        {children}
      </>
    )}
  </Parallax>
);

/** Frame 0: the vice president, camera already moving. */
const Portrait: React.FC<{t: TL}> = ({t}) => (
  <StephensPortrait a={-30} b={t.at('His name was')} traceAt={t.at('vice') + 2}>
    <Note text="the Confederacy's" x={1180} y={150} size={50} rot={-4} at={t.at('vice') - 2} color="#ffffff" />
    <Note text="vice president" x={1220} y={250} size={66} rot={-4} at={t.at('president') - 2} />
    <Note text="why his new country existed" x={1050} y={480} size={48} rot={-3} at={t.at('why') - 2} color="#ffffff" />
    <Note text="...then a different story" x={1090} y={640} size={52} rot={-3} at={t.at('different') - 3} color={CORAL} />
  </StephensPortrait>
);

/** His name, and what the Confederacy was. */
const Name: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('His name was') - 1;
  const src = YOUNG;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src={src} size={sizeOf(src)} x={170} y={150} w={500} h={640} fx={960} fy={1330} scale={0.44} rot={-2} at={a}
        mask={MASKS.stephens} tintStrength={0.5} traceAt={a + 6} />
      <Highlight text="ALEXANDER STEPHENS" x={800} y={200} size={78} at={t.at('Alexander')} seed={11} rot={-2} />
      <Note text="the Confederacy =" x={830} y={420} size={54} rot={-3} at={t.at('The Confederacy was') - 2} color="#ffffff" />
      <Note text="the new country Southern states formed" x={860} y={530} size={46} rot={-3} at={t.at('Southern') - 2} />
      <Note text="after they left the United States" x={880} y={640} size={46} rot={-3} at={t.at('left') - 2} />
      <Tag text={YOUNG_TAG} />
    </AbsoluteFill>
  );
};

/** A hand-jittered closed box path (stepped wobble, drawn on with a dash). */
const boxPath = (x: number, y: number, w: number, h: number, seed: string) => {
  const j = (k: string) => (random(`${seed}${k}`) - 0.5) * 8;
  const pts = [[x + j('a'), y + j('b')], [x + w + j('c'), y + j('d')], [x + w + j('e'), y + h + j('f')], [x + j('g'), y + h + j('h')], [x + j('a') + 3, y + j('b') + 2]];
  return pts.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(1)},${py.toFixed(1)}`).join(' ');
};

/** The drawn wall: a cornerstone at the bottom corner, blocks stacked on it, SLAVERY stamped into the cornerstone. */
const Wall: React.FC<{x: number; y: number; at: number; stack: number; stackEnd: number; mark: number}> = ({x, y, at, stack, stackEnd, mark}) => {
  const g = useGFrame();
  const pal = usePal();
  const bw = 190;
  const bh = 92;
  const cw = 270;
  const ch = 120;
  // rows above the cornerstone row; bottom row = cornerstone + 2 blocks
  const blocks: {x: number; y: number; w: number; h: number; at: number}[] = [];
  const top = y - ch;
  blocks.push({x: x + cw, y: top, w: bw, h: ch, at: stack}, {x: x + cw + bw, y: top, w: bw, h: ch, at: stack + 2});
  const rows = 4;
  for (let r = 0; r < rows; r++) {
    const ry = top - (r + 1) * bh;
    const off = r % 2 ? 0 : bw / 2;
    for (let c = 0; c < 4; c++) {
      const bx = x + c * bw - off;
      const x0 = Math.max(x, bx);
      const x1 = Math.min(x + cw + 2 * bw, bx + bw);
      if (x1 - x0 < 40) continue;
      blocks.push({x: x0, y: ry, w: x1 - x0, h: bh, at: stack + 4 + Math.round(((r * 4 + c) / (rows * 4)) * (stackEnd - stack))});
    }
  }
  const draw = (d: string, from: number, dur: number, color: string, width: number, key: string) => {
    const p = interpolate(g, [from, from + dur], [0, 1], clamp);
    if (p <= 0) return null;
    return <path key={key} d={d} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
  };
  const fillK = interpolate(g, [mark, mark + 4], [0, 1], clamp);
  const sk = interpolate(g, [mark, mark + 3, mark + 6], [1.35, 0.95, 1], clamp);
  return (
    <>
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
        {/* ground line */}
        {draw(`M${x - 60},${y + 4} L${x + cw + 2 * bw + 60},${y + 2}`, at - 4, 8, '#f4efe6', 4, 'ground')}
        {fillK > 0 && <rect x={x} y={top} width={cw} height={ch} fill={CORAL} opacity={0.85 * fillK} />}
        {blocks.map((b, i) => draw(boxPath(b.x, b.y, b.w, b.h, `w${i}`), b.at, 6, pal.mark, 5, `b${i}`))}
        {draw(boxPath(x, top, cw, ch, 'corner'), at, 10, pal.mark, 8, 'corner')}
      </svg>
      {g >= mark && (
        <div style={{position: 'absolute', left: x, top: top, width: cw, height: ch, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: JF.display, fontSize: 46, color: '#111', transform: `scale(${sk})`}}>SLAVERY</div>
      )}
    </>
  );
};

/** March 1861: the cornerstone. */
const Cornerstone: React.FC<{t: TL}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="March 1861, Stephens says:" x={110} y={110} size={52} rot={-3} at={t.at('In March') - 2} color="#ffffff" />
    <Highlight text="CORNERSTONE" x={110} y={250} size={110} at={t.at('cornerstone')} seed={13} rot={-2} />
    <Definition term="corner·stone" def="the stone at the bottom of a building that holds everything else up" at={t.at('cornerstone') + 9} x={120} y={440} w={760} />
    <Note text="his new country's cornerstone:" x={130} y={720} size={50} rot={-3} at={t.at('That cornerstone') - 2} />
    <Note text="slavery" x={180} y={820} size={80} rot={-3} at={t.at('slavery') - 3} color={CORAL} />
    <Wall x={1060} y={900} at={t.at('cornerstone') + 2} stack={t.at('holds') - 2} stackEnd={t.at('up.')} mark={t.at('slavery')} />
  </AbsoluteFill>
);

/** 1868: the book, the older man, the new story. */
const Book: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Seven years') - 1;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src={OLD} size={sizeOf(OLD)} x={140} y={150} w={400} h={520} fx={1090} fy={1300} scale={0.36} rot={-2} at={a} />
      <DropCard src={BOOK} x={640} y={110} w={400} rot={2} at={t.at('Stephens wrote') - 2} filter="grayscale(1) sepia(0.3) contrast(1.12)" />
      <Note text="1868" x={1160} y={110} size={90} rot={-4} at={t.at('Seven years') - 2} />
      <Note text="the war lost, he writes its history" x={1110} y={280} size={42} rot={-3} at={t.at('history') - 2} color="#ffffff" />
      <Note text="slavery? just the spark" x={1120} y={460} size={52} rot={-3} at={t.at('spark') - 3} />
      <Note text="the real cause:" x={1120} y={620} size={46} rot={-3} at={t.at('The real') - 2} color="#ffffff" />
      <Note text="states' rights" x={1160} y={710} size={84} rot={-4} at={t.at('rights') - 2} color={ORANGE} />
      <Tag text="Brady-Handy studio, Alexander H. Stephens, c. 1870 · Library of Congress · Stephens, A Constitutional View, 1868 · Internet Archive" />
    </AbsoluteFill>
  );
};

/**
 * Same man, two stories: young Stephens (1861: slavery) on the left, the older Stephens and his book (1868: states' rights)
 * on the right. ch09 reuses it with a loop on the 1861 side.
 */
export const Split: React.FC<{a: number; label1: number; label2: number; loopAt?: number; children?: React.ReactNode}> = ({a, label1, label2, loopAt, children}) => {
  const g = useGFrame();
  const pal = usePal();
  const head = (text: string, x: number, color: string) => (
    <div style={{position: 'absolute', left: x, top: 64, fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, color, textShadow: '0 1px 6px #000'}}>{text}</div>
  );
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 958, top: 60, width: 4, height: 960, background: '#f4efe6', opacity: interpolate(g, [a, a + 4], [0, 0.8], clamp)}} />
      {head('THE SPEECH', 140, pal.mark)}
      {head('THE BOOK', 1040, CORAL)}
      <CropCard src={YOUNG} size={sizeOf(YOUNG)} x={250} y={160} w={440} h={540} fx={960} fy={1330} scale={0.4} rot={-2} at={a}
        mask={MASKS.stephens} tintStrength={0.5} traceAt={a + 6} />
      <CropCard src={OLD} size={sizeOf(OLD)} x={1060} y={180} w={360} h={470} fx={1090} fy={1300} scale={0.32} rot={2} at={a + 2} />
      <CropCard src={BOOK} size={sizeOf(BOOK)} x={1500} y={230} w={300} h={420} fx={1176} fy={1100} scale={0.17} rot={-3} at={a + 4} bw="grayscale(1) sepia(0.3) contrast(1.12)" />
      <Note text="1861: slavery" x={230} y={790} size={70} rot={-3} at={label1} />
      <Note text="1868: states' rights" x={1050} y={790} size={64} rot={-3} at={label2} color={ORANGE} />
      {loopAt !== undefined && <Loop cx={470} cy={520} rx={310} ry={410} at={loopAt} seed={19} tilt={-3} color={CORAL} width={7} />}
      {children}
      <Tag text="Vannerson, Stephens, 1859 · Brady-Handy, Stephens, c. 1870 · Library of Congress · A Constitutional View, 1868 · Internet Archive" />
    </AbsoluteFill>
  );
};

const SameMan: React.FC<{t: TL}> = ({t}) => (
  <Split a={t.at('Same man') - 1} label1={t.at('Two') - 2} label2={t.at('stories') - 2}>
    <Note text="funny how that works" x={1060} y={920} size={50} rot={-3} at={t.at('Funny') - 2} color={CORAL} />
  </Split>
);

/** The driving question over the map: eleven states rise. */
const Question: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at("So here's") - 1;
  const keys: Cam3[] = [{f: a, x: 2700, y: 2600, z: 0.36, tilt: 36, rot: 0}, {f: t.at("We'll come") - 1, x: 2650, y: 2650, z: 0.4, tilt: 44, rot: -4}];
  const rise = t.at('eleven');
  return (
    <>
      <AbsoluteFill style={{filter: 'brightness(0.75)'}}>
        <Map3D data={D} keys={keys} states={0.5} rivers={0.3}>
          {(api) => (
            <>
              <StateTiles api={api} names={UNION_FREE_1861} at={a} stagger={0} h={16} color={MAP3D.free} />
              <StateTiles api={api} names={BORDER_1861} at={a} stagger={0} h={20} color={MAP3D.grey} />
              <StateTiles api={api} names={CONFEDERACY_1861} at={rise - 2} stagger={2} h={56} color={CORAL} />
            </>
          )}
        </Map3D>
      </AbsoluteFill>
      <AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(to right, rgba(10,9,7,0.85) 0%, rgba(10,9,7,0.6) 34%, rgba(0,0,0,0) 56%)'}} />
        <Note text="the question:" x={110} y={80} size={54} rot={-3} at={t.at('question') - 2} color="#ffffff" />
        <Note text="why did 11 states leave?" x={130} y={200} size={72} rot={-3} at={t.at('Why did eleven') - 2} />
        <Note text="1860 and 1861" x={170} y={340} size={50} rot={-3} at={t.at('1860') - 2} color="#ffffff" />
        <Note text="and why did almost everyone" x={130} y={560} size={56} rot={-3} at={t.at('why did almost') - 2} />
        <Note text="expect a short war?" x={160} y={680} size={72} rot={-3} at={t.at('think') - 2} color={CORAL} />
        <Note text="over by summer" x={200} y={840} size={52} rot={-3} at={t.at('summer') - 3} color="#ffffff" />
        {g >= rise - 2 && <div style={{position: 'absolute', left: 1500, top: 90}}><Count to={11} at={rise - 2} dur={20} suffix=" states" size={84} color={CORAL} /></div>}
        <Tag text="Map · the United States in 1861 (Union, border states, Confederacy)" />
      </AbsoluteFill>
    </>
  );
};

/** A crowd that packed a picnic to watch a battle. */
const Picnic: React.FC<{t: TL}> = ({t}) => {
  const a = t.at("We'll come") - 1;
  return (
    <Engraving src={SPECTATORS} px={sizeOf(SPECTATORS)} fx={560} fy={430} a={a} b={END} z0={1.0} z1={1.08} fade={8}
      tag="Illustration · spectators watching a battle, 1861">
      {(p) => {
        const [bx, by] = [p.left + 560 * p.scale, p.top + 650 * p.scale];
        return (
          <>
            <Loop cx={bx} cy={by} rx={110} ry={80} at={t.at('picnic') - 2} seed={21} tilt={-4} />
            <Note text="a picnic?" x={bx + 140} y={by - 40} size={70} rot={-4} at={t.at('picnic') - 2} />
          </>
        );
      }}
    </Engraving>
  );
};

/** Title card after the channel intro: the Harper's Fort Sumter engraving, dimmed; title on orange; subtitle in teal. */
const Title: React.FC = () => {
  const g = useGFrame();
  const f = useCurrentFrame();
  const pal = usePal();
  const size = sizeOf(SUMTER);
  return (
    <AbsoluteFill style={{background: '#0b0a08'}}>
      <Picture src={SUMTER} place={fill(size, 1520, 1000, 1.24 + f * 0.0004)} size={size} bw="grayscale(1) contrast(1.25) brightness(0.42)" />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(8,6,4,0.2) 30%, rgba(8,6,4,0.85) 100%)'}} />
      <Highlight text={TITLE} x={170} y={350} size={120} at={4} seed={61} rot={-2} />
      {g >= 14 && <div style={{position: 'absolute', left: 210, top: 580, fontFamily: JF.display, fontSize: 46, color: pal.mark, whiteSpace: 'nowrap', textShadow: '0 3px 16px rgba(0,0,0,0.8)', opacity: interpolate(g, [14, 20], [0, 1], clamp)}}>{SUBTITLE}</div>}
      <Note text={DATES} x={1300} y={720} size={56} rot={-5} at={24} />
      <Tag text="Bombardment of Fort Sumter by the batteries of the Confederate states, Harper's Weekly, April 27, 1861 · Library of Congress" />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  // [cut frame, scene]: cut 1 frame before the word that starts the new idea
  const cuts: [number, React.ReactNode][] = [
    [0, <Portrait t={t} />],
    [at('His name was') - 1, <Name t={t} />],
    [at('In March') - 1, <Cornerstone t={t} />],
    [at('Seven years') - 1, <Book t={t} />],
    [at('Same man') - 1, <SameMan t={t} />],
    [at("So here's") - 1, <Question t={t} />],
    [at("We'll come") - 1, <Picnic t={t} />],
  ];
  let scene = useScene(cuts);
  if (frame >= END + INTRO_FRAMES) scene = <Sequence from={END + INTRO_FRAMES} layout="none"><Title /></Sequence>;
  else if (frame >= END) scene = <Sequence from={END} layout="none"><ChannelIntro /></Sequence>;
  const notes = ['vice', 'president', 'why', 'different', 'The Confederacy was', 'Southern', 'left', 'In March', 'That cornerstone', 'Seven years', 'history', 'spark', 'The real', 'rights',
    'Two', 'stories', 'Funny', 'question', 'Why did eleven', '1860', 'why did almost', 'think', 'summer', 'picnic'];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {frame < END && <Finish vignette={0.3} />}
      <Audio src={staticFile('audio/ch01_cold_open.wav')} />
      <Audio src={staticFile('music/j_cold_open.mp3')} volume={(f) => interpolate(f, [0, 15, END - 70, END - 10], [0, 0.111, 0.111, 0], clamp)} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.35} />)}
      {['Alexander', 'cornerstone', 'slavery'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.3} />)}
      {notes.map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('Stephens wrote') - 2} src="sfx/tick.wav" volume={0.45} />
      <Sfx at={at('eleven') - 2} src="sfx/tick_soft.wav" volume={0.4} />
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
