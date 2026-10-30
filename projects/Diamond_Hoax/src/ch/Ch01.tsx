// Chapter 1 · Paid for Dirt (the cold open), then the one-second beat, the Chunk History intro and the title card.
// Scene plan: script/SCENES.md "ch01". Every cut lands 1 frame before the word that starts its idea; each scene sits in a
// <Sequence from={cut}> so its own beats are passed relative to the cut (t.at(...) - cut).
//   0:00  the reveal (fx/ColdOpenDepth ColdOpenReveal): tight on the mark, the banker's office, pull back to the cousins, $18 million
//   0:11  "Bankers. Generals. The most famous jeweler" three archival prints slap onto the desk
//   0:18  "two guys in slouch hats" back to the H1 picture, the two hats circled
//   0:23  "A diamond field" the mesa (real terrain), stones drop in
//   0:30  "sitting in anthills" the salting silhouette, the ruby on the stick
//   0:32  "The diamonds were real." the rough diamond, coral
//   0:36  "The diamond field wasn't." the mesa again, the coral drains
//   0:38  the driving question over the H1 picture: PAID FOR / DIRT?
//   0:43  "six moves" the Con Card, empty (the tease)
//   0:51  "those anthills... fell apart" the anthill cut-away slices open
//   0:55  "a knock on an office door, late at night" San Francisco at night (silhouette)
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch01_cold_open.words.json';
import {clamp} from '../lib/anim';
import {Finish, Highlight, JF, Loop, Note, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChannelIntro, INTRO_FRAMES} from '../kit/ChunkIntro';
import {makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {Prop} from '../kit/prop';
import {SilScene} from '../kit/silparallax';
import {ConCard} from '../kit/con';
import {ColdOpenDepth, ColdOpenReveal} from '../fx/ColdOpenDepth';
import {Mesa, MESA_CAM} from '../fx/Mesa';
import {AnthillCutaway} from '../fx/AnthillCutaway';
import salting from '../../public/img/layers/sil/sil_salting/layers.json';
import sfNight from '../../public/img/layers/sil/sil_sf_night/layers.json';
import {DATES, SUBTITLE, TITLE} from '../project';

const N = words as Narration;
/** Narration ends; the channel intro starts 20 frames later (the one-second beat, with the last picture held). */
const END = Math.ceil(N.duration * 30) + 20;
const TITLE_FRAMES = 150;
export const CH01_FRAMES = END + INTRO_FRAMES + TITLE_FRAMES;

type L = {size: number[]; glowLayer?: number};
const sz = (l: L) => l.size as [number, number];

/** The title card after the Chunk intro: the H1 picture dimmed behind the title tape (it echoes the thumbnail). */
const TitleCard: React.FC = () => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill style={{background: '#0b0a08'}}>
      <AbsoluteFill style={{opacity: 0.35}}><ColdOpenDepth cam={[{f: 0, d: 30, x: 0, y: 10}, {f: 150, d: 60, x: 0, y: 20}]} /></AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(8,7,5,0.92) 0%, rgba(8,7,5,0.7) 55%, rgba(8,7,5,0.3) 100%)'}} />
      <Highlight text={TITLE} x={200} y={360} size={150} at={4} seed={61} />
      {g >= 14 && <div style={{position: 'absolute', left: 250, top: 590, fontFamily: JF.display, fontSize: 64, color: pal.mark, whiteSpace: 'nowrap',
        textShadow: '0 3px 16px rgba(0,0,0,0.9)', opacity: interpolate(g, [14, 20], [0, 1], clamp)}}>{SUBTITLE}</div>}
      <Note text={DATES} x={1250} y={730} size={60} rot={-5} at={24} />
    </AbsoluteFill>
  );
};

/** An archival print on the black desk (no cream mount: the channel's rule), slapped down with a little overshoot. */
const Print: React.FC<{src: string; x: number; y: number; w: number; h: number; at: number; rot: number; pos?: string; tag: string}> = ({src, x, y, w, h, at, rot, pos = '50% 25%', tag}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 4, at + 7], [1.3, 0.96, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: '50% 60%'}}>
      <Img src={staticFile(src)} style={{width: w, height: h, objectFit: 'cover', objectPosition: pos, display: 'block',
        filter: 'grayscale(1) contrast(1.15) brightness(0.95)', boxShadow: '0 26px 46px rgba(0,0,0,0.8)'}} />
      <div style={{position: 'absolute', left: 0, top: h + 14, width: w + 60, fontFamily: JF.mono, fontSize: 16, letterSpacing: 1,
        color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>{tag}</div>
    </div>
  );
};

/** "Bankers. Generals. The most famous jeweler in the country." */
const Customers: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Highlight text="THE RICHEST MEN IN AMERICA" x={300} y={110} size={84} at={t.at('customers') - a} seed={27} rot={-2} />
    <Print src="img/ch02/ralston_william_harpending_plate_1913.jpg" x={190} y={250} w={430} h={540} rot={-3} at={t.at('Bankers') - a - 1}
      tag="Harpending, The Great Diamond Hoax, 1913" />
    <Print src="img/ch04/mcclellan_george_brady_cdv_1861.jpg" x={745} y={230} w={430} h={560} rot={2} pos="50% 18%" at={t.at('Generals') - a - 1}
      tag="Brady, 1861 · Library of Congress" />
    <Print src="img/ch04/tiffany_charles_engraving_1893.jpg" x={1300} y={260} w={420} h={540} rot={-2} at={t.at('jeweler') - a - 1}
      tag="Engraving, 1893" />
    <Note text="bankers" x={260} y={848} size={60} rot={-4} at={t.at('Bankers') - a + 2} />
    <Note text="generals" x={820} y={848} size={60} rot={-3} at={t.at('Generals') - a + 2} />
    <Note text="a jeweler" x={1370} y={848} size={60} rot={-4} at={t.at('jeweler') - a + 2} />
  </AbsoluteFill>
);

/** "Not the kind of people who usually lose money to two guys in slouch hats." */
const SlouchHats: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <ColdOpenDepth cam={[{f: 0, d: 10, x: 0, y: 0}, {f: 130, d: 70, x: -10, y: -20}]} />
    <Loop cx={235} cy={265} rx={170} ry={78} at={t.at('slouch') - a} dur={10} width={6} seed={21} tilt={-4} />
    <Loop cx={1640} cy={300} rx={170} ry={78} at={t.at('slouch') - a + 4} dur={10} width={6} seed={22} tilt={3} />
    <Note text="these two" x={760} y={150} size={70} rot={-4} at={t.at('two', 2) - a} />
  </AbsoluteFill>
);

/** "A diamond field. A hill out West where diamonds and rubies were just lying on the ground." */
const Field: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <Mesa at={-20} saltAt={t.at('diamonds') - a} glowAt={t.at('ground') - a} labels
      cam={[{f: 0, ...MESA_CAM.wide}, {f: t.at('Some') - a, ...MESA_CAM.patch}]} />
    <Highlight text="A DIAMOND FIELD" x={130} y={120} size={86} at={t.at('diamond') - a} seed={31} rot={-2} />
    <Tag text="Elevation: USGS data · heights exaggerated" />
  </AbsoluteFill>
);

/** "Some of them were sitting in anthills." */
const Anthills: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="sil_salting" size={sz(salting)} glowLayer={(salting as L).glowLayer} a={0} b={b - a} cam={{z: [1.08, 1.22], x: [20, -10], y: [-10, -30]}} />
    <Note text="in anthills" x={1180} y={760} size={70} rot={-4} at={t.at('anthills') - a} />
  </AbsoluteFill>
);

/** "There was just one problem. The diamonds were real." */
const Real: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <AbsoluteFill style={{background: 'radial-gradient(circle 620px at 960px 560px, rgba(255,214,160,0.10) 0%, transparent 100%)'}} />
    <Prop name="rough_diamond" x={720} y={290} w={480} at={t.at('diamonds', 2) - a - 2} coral trace from="top" />
    <Highlight text="REAL" x={1240} y={420} size={130} at={t.at('real') - a} seed={33} rot={-3} />
  </AbsoluteFill>
);

/** "The diamond field wasn't." */
const Wasnt: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <Mesa at={-200} saltAt={-150} glowAt={-60} drainAt={t.at("wasn't") - a} cam={[{f: 0, ...MESA_CAM.patch}, {f: 80, ...MESA_CAM.claim}]} />
    <Highlight text="FAKE" x={1260} y={160} size={120} at={t.at("wasn't") - a + 2} seed={35} rot={-4} />
  </AbsoluteFill>
);

/** "So how do two cousins get the richest men in America to pay millions for dirt?" over the H1 picture. */
const Question: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <ColdOpenDepth cam={[{f: 0, d: 0, x: 0, y: 0}, {f: 160, d: 45, x: 0, y: 14}]} />
    <AbsoluteFill style={{background: 'rgba(8,7,5,0.35)'}} />
    <Highlight text="PAID FOR" x={600} y={104} size={100} at={t.at('pay') - a} seed={98} rot={-4} />
    <Highlight text="DIRT?" x={640} y={212} size={220} at={t.at('dirt') - a} seed={99} rot={-2} />
  </AbsoluteFill>
);

/** "They used six moves. Almost every con still uses the same six..." the Con Card's first appearance: empty. */
const SixMoves: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 240], [1, 1.06], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`}}>
        <ConCard x={560} y={150} scale={1.3} at={t.at('six') - a} rows={[]} counter={false} />
      </AbsoluteFill>
      <Note text="spot every one" x={1300} y={830} size={62} rot={-4} at={t.at('spot') - a} />
    </AbsoluteFill>
  );
};

/** "And we'll get to those anthills. That's where it all fell apart." */
const FellApart: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <AnthillCutaway at={-10} sliceAt={t.at('fell') - a - 6} rubyAt={t.at('fell') - a + 14} printsAt={9999} compareAt={9999} />
  </AbsoluteFill>
);

/** "But first: a knock on an office door, late at night, and a bag nobody wanted to talk about." */
const Knock: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="sil_sf_night" size={sz(sfNight)} glowLayer={(sfNight as L).glowLayer} a={0} b={b - a} cam={{z: [1.04, 1.16], x: [-30, 20], y: [0, -10]}} />
    <Note text="late at night" x={180} y={190} size={66} rot={-4} at={t.at('late') - a} />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {
    cust: at('Their') - 1, hats: at('Not') - 1, field: at('And what') - 1, ants: at('Some of them') - 1, real: at('There was') - 1,
    wasnt: at('The diamond field') - 1, q: at('So how') - 1, six: at('They used') - 1, apart: at("And we'll") - 1, knock: at('But first') - 1,
  };
  const cuts: [number, React.ReactNode][] = [
    [0, <ColdOpenReveal officeAt={at('rich') - 6} pullAt={at('with') - 4} pullEnd={at('By') + 6} loopAt={at('By') + 2} fingersAt={at('By') + 22}
      moneyAt={at('eighteen') - 2} out={at('Their') - 4} />],
    [c.cust, <Sequence from={c.cust} layout="none"><Customers t={t} a={c.cust} /></Sequence>],
    [c.hats, <Sequence from={c.hats} layout="none"><SlouchHats t={t} a={c.hats} /></Sequence>],
    [c.field, <Sequence from={c.field} layout="none"><Field t={t} a={c.field} /></Sequence>],
    [c.ants, <Sequence from={c.ants} layout="none"><Anthills t={t} a={c.ants} b={c.real} /></Sequence>],
    [c.real, <Sequence from={c.real} layout="none"><Real t={t} a={c.real} /></Sequence>],
    [c.wasnt, <Sequence from={c.wasnt} layout="none"><Wasnt t={t} a={c.wasnt} /></Sequence>],
    [c.q, <Sequence from={c.q} layout="none"><Question t={t} a={c.q} /></Sequence>],
    [c.six, <Sequence from={c.six} layout="none"><SixMoves t={t} a={c.six} /></Sequence>],
    [c.apart, <Sequence from={c.apart} layout="none"><FellApart t={t} a={c.apart} /></Sequence>],
    [c.knock, <Sequence from={c.knock} layout="none"><Knock t={t} a={c.knock} b={END} /></Sequence>],
  ];
  let scene = useScene(cuts);
  if (frame >= END + INTRO_FRAMES) scene = <Sequence from={END + INTRO_FRAMES} layout="none"><TitleCard /><Finish vignette={0.3} /></Sequence>;
  else if (frame >= END) scene = <Sequence from={END} layout="none"><ChannelIntro /></Sequence>;
  const v = bed('aw_robber_barons');
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {frame < END && <Finish vignette={0.3} />}
      <Audio src={staticFile('audio/ch01_cold_open.wav')} />
      {/* placeholder bed until the user picks the music: smug Gilded Age swagger */}
      <Audio src={staticFile('music/aw_robber_barons.mp3')} volume={(f) => interpolate(f, [0, 6, END - 40, END], [v, v, v, 0], clamp)} />
      {cuts.slice(2).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      <Sfx at={c.cust} src="sfx/paper_rustle.wav" volume={0.3} />
      {['Bankers', 'Generals', 'jeweler'].map((p) => <Sfx key={p} at={at(p) - 1} src="sfx/stamp.wav" volume={0.22} />)}
      {['eighteen', 'real', 'dirt'].map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.3} />)}
      <Sfx at={at('knock')} src="sfx/knock.wav" volume={0.45} />
      {['slouch', 'spot', 'late', 'anthills'].map((p) => <Sfx key={p} at={at(p) - 2} src={WRITE.src} volume={WRITE.volume} />)}
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
