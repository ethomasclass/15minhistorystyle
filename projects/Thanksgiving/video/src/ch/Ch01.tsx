// Chapter 1 · cold open: the eel (frame 0, the wriggling cut-out), a hard cut to the modern plate, the cranberry stop-motion on
// "And this.", the numbers, the question, a one-second beat, then the Chunk History intro (kit/ChunkIntro.tsx) and the title card.
// Chapter 1 has no logo break in front. Every beat is anchored to a word of script/ch01_cold_open.txt. Tone: deadpan, so the
// picture plays it straight and each punchline gets a held frame (no zooms or wobble on the joke). Cuts are hard and silent.
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch01_cold_open.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Finish, Highlight, JF, Note, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {DeskScene, useMarks} from '../kit/tg_desk';
import {SafeText, TITLE_INTRO_FRAMES, TitleIntro} from '../kit/ga_brand';
import {bed} from '../kit/levels';
import {hasFile, makeTimeline, type Narration, Quote, Stamp, type TL, useScene} from '../kit/shell';
import {type Box, Slip, Swipe} from '../kit/vox';
import {PageScrap} from './ch34/parts';
import {Barrel, Cran, Eel, Placeholder, Strike} from '../kit/tg_props';
import {DATES, SUBTITLE, TITLE} from '../project';
import {Clip, Cut} from '../kit/tg_cut';

const N = words as Narration;
/** The one-second beat after the question, held on the frame, before the channel intro. */
const BEAT = 30;
/** Narration ends; the channel intro starts after the beat. */
const END = Math.ceil(N.duration * 30) + BEAT;
/** The condensed Chunk intro and the title in one card (kit/ga_brand TitleIntro, as the Gilded Age's title.js): it was a 5.5 s
 *  intro and then a 5 s title card. */
export const CH01_FRAMES = END + TITLE_INTRO_FRAMES;

/** Music: tg_table_theme, 17 LU under the voice (kit/levels). */
const TABLE_THEME_VOL = bed('tg_table_theme');

/** Mourt's Relation (London, 1622), BPL copy on the Internet Archive: line boxes measured on the scans (source px). */
const MOURT_SIZE: [number, number] = [3250, 4576];
const MOURT_SRC = 'Boston Public Library / Internet Archive';
const P39 = {src: 'img/arch/mourts-relation-1622-squanto-treads-eeles-p39.jpg', scrap: [230, 1290, 2420, 480] as Box,
  /** "they were fat & sweet," / "he trod them out with his feete," */
  fat: [[1670, 1518, 900, 80], [250, 1615, 1600, 80]] as Box[]};
const P62 = {src: 'img/arch/mourts-relation-1622-hogshead-of-eeles-p62.jpg', scrap: [620, 1525, 2350, 290] as Box,
  /** "we can take a Hogshead of Eeles in" / "a night," */
  hog: [[1480, 1625, 1460, 80], [660, 1718, 300, 80]] as Box[]};

/** Nothing in this chapter is a placeholder any more (the modern plate landed, Nov 2026). */
export const PLACEHOLDERS = [] as const;

type S = {t: TL; a: number};

/** Frame 0: the eel wriggling on the desk. The hook line, the tape and the picture agree in the first two seconds. */
const EelOpen: React.FC<S> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Eel cx={1000} cy={560} w={900} />
    <Highlight text="THE FIRST THANKSGIVING" x={120} y={114} size={80} at={t.at('first Thanksgiving')} seed={11} rot={-2} />
    <Note text="caught with their feet" x={1050} y={770} size={56} rot={-4} at={t.at('feet') - 3} />
    <Note text="eels." x={170} y={430} size={90} rot={-5} at={t.at('Eels') - 2} color={usePal().subject} />
    <Note text="Squanto (Wampanoag) showed them" x={140} y={880} size={40} rot={-3} at={t.at('Squanto') - 3} color="#ffffff" />
  </AbsoluteFill>
);

/** Wade out onto the mud flats, press down with a foot, the eels come up: our drawn scene (lookdev/tg.js tg_eel_river), from the
 *  moment the treading starts. */
const Tread: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <Clip name="eel_river" at={a} start={4.6} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(13,12,9,0.45) 0%, transparent 34%)'}} />
    <Note text="mud flats, low tide" x={170} y={130} size={56} rot={-3} at={t.at('mud') - 3} color="#ffffff" />
    <Note text="tread them out" x={1150} y={150} size={72} rot={-4} at={t.at('tread') - 3} />
    <Tag text="Drawn scene · the figures are anonymous: no portrait of Tisquantum (Squanto) survives" />
  </AbsoluteFill>
);

/** Detail cut-in on the eel, the colonist's verdict beside it. */
const FatSweet: React.FC<S> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Eel cx={1340} cy={560} w={920} rot={-4} />
    <Quote text="fat and sweet" at={t.at('Fat and sweet') - 1} x={130} y={300} w={720} size={84} who="Mourt's Relation, 1622 · Squanto's eels, March 1621" />
    {/* the line itself, on the 1622 page: "they were fat & sweet, he trod them out with his feete" */}
    <PageScrap src={P39.src} size={MOURT_SIZE} box={P39.scrap} x={110} y={640} w={800} at={t.at('Fat and sweet') + 4} rot={-1.5} seed="p39">
      <Swipe lines={P39.fat} from={t.at('Fat and sweet') + 6} to={t.at('By that fall') - 6} seed="p39s" />
    </PageScrap>
    <Tag text={`Mourt's Relation, London, 1622, p. 39 · ${MOURT_SRC}`} />
  </AbsoluteFill>
);

/** "A whole barrel with eels in a single night": a drawn barrel, eels dropping into it, one after another. */
const BarrelNight: React.FC<S> = ({t, a}) => {
  const bx = 300, by = 300, bw = 440;
  const drops = [0, 5, 9, 13, 16, 19, 22, 25];
  const fill = t.at('barrel');
  return (
    <AbsoluteFill>
      <DarkPaper />
      {drops.map((d, i) => (
        // each eel drops into the barrel; the last three stay, heaped at the rim
        <Eel key={i} cx={bx + bw / 2 + ((i % 3) - 1) * 70} cy={i < 5 ? by + 120 + (i % 2) * 30 : by + 10 + (i % 2) * 18} w={250} rot={-30 + i * 23} still={(i * 7) % 48}
          at={fill + d} out={i < 5 ? fill + d + 16 : Infinity} shadow={0.6} />
      ))}
      <Barrel x={bx} y={by} w={bw} at={a + 2} />
      <Note text="that fall:" x={980} y={300} size={52} rot={-3} at={t.at('fall') - 3} color="#ffffff" />
      <Note text="a barrel of eels" x={1020} y={420} size={76} rot={-4} at={t.at('barrel') - 3} />
      <Note text="in one night" x={1060} y={560} size={76} rot={-4} at={t.at('single night') - 3} color={usePal().subject} />
      <PageScrap src={P62.src} size={MOURT_SIZE} box={P62.scrap} x={980} y={720} w={800} at={t.at('barrel') - 2} rot={1.5} seed="p62">
        <Swipe lines={P62.hog} from={t.at('barrel')} to={t.end('single night')} seed="p62s" />
      </PageScrap>
      <Tag text={`Edward Winslow, letter of Dec. 1621 · Mourt's Relation, London, 1622, p. 62 · ${MOURT_SRC}`} />
    </AbsoluteFill>
  );
};

/** Hard cut to today: the modern plate full frame, the dishes named on slips as they're said. */
const Plate: React.FC<S> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    {/* the plate whole, big on the desk (a cut-out, its colour kept: the brief allows it); the slips sit beside it, one per dish */}
    <Cut name="tg_modern_plate" x={900} y={70} w={900} land="none" />
    <Slip text="a turkey" x={170} y={330} size={62} rot={-3} at={t.at('A turkey') - 2} />
    <Slip text="green beans, fried onions" x={170} y={500} size={58} rot={-2} at={t.at('Green beans') - 2} />
    <Slip text="marshmallows on sweet potatoes" x={170} y={670} size={54} rot={-3} at={t.at('Marshmallows') - 2} />
  </AbsoluteFill>
);

/** "And this.": the jellied cranberry slides out of its can (the 6-drawing stop-motion), then holds. No marks: the can does it. */
const CranSlide: React.FC<S> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Cran at={t.at('And this') - 1} />
  </AbsoluteFill>
);

/** The numbers, one per line as they're said, the log standing beside them. */
const Numbers: React.FC<S> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Cran at={-999} still={5} k={0.82} right={1880} bottom={860} fade />
    <Stamp text="46 MILLION" x={140} y={150} size={124} at={t.at('forty-six')} />
    <Note text="turkeys, every thanksgiving" x={170} y={300} size={54} rot={-3} at={t.at('turkeys') - 3} />
    <Stamp text="70 MILLION" x={140} y={480} size={124} at={t.at('seventy')} color={usePal().subject} />
    <Note text="cans of cranberry sauce a year" x={170} y={630} size={54} rot={-3} at={t.at('cans') - 3} />
    <Note text="most of them in about two months" x={170} y={760} size={48} rot={-3} at={t.at('most') - 3} color="#ffffff" />
    <Tag text="Turkeys: National Turkey Federation estimate · Cans: Ocean Spray figures (about 67-75 million a year)" />
  </AbsoluteFill>
);

/** "But almost none of it was on the table in 1621": the plate as a print on the desk, struck out. */
const Meal: React.FC<S> = ({t, a}) => {
  const none = t.at('almost none');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Cut name="tg_modern_plate" x={700} y={90} w={560} rot={-2} at={a + 1} land="slap" />
      <Note text="a great meal." x={1330} y={170} size={56} rot={-4} at={t.at('great') - 3} color="#ffffff" />
      <Strike x1={720} y1={130} x2={1250} y2={620} at={none + 4} bow={20} width={10} />
      <Strike x1={1250} y1={120} x2={720} y2={630} at={none + 8} bow={-20} width={10} />
      <Highlight text="ALMOST NONE OF IT" x={160} y={760} size={86} at={none} seed={17} rot={-2} />
      <Highlight text="1621" x={1290} y={770} size={120} at={t.at('1621')} seed={19} rot={3} />
    </AbsoluteFill>
  );
};

/** The driving question: the eel and the can on one desk, then the promise. Held through the one-second beat. */
const Question: React.FC<S> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Eel cx={500} cy={440} w={640} rot={-3} />
      <Cran at={-999} still={5} k={0.78} right={1830} bottom={620} fade />
      <Note text="from eels..." x={250} y={690} size={70} rot={-4} at={t.at('from eels') - 2} />
      <Arrow x1={860} y1={470} x2={1110} y2={460} bow={-50} at={t.at('to this')} />
      <Note text="...to this?" x={1230} y={670} size={70} rot={-4} at={t.at('to this') - 2} />
      <Note text="and why is it shaped like a can?" x={340} y={826} size={62} rot={-3} at={t.at('shaped') - 3} color={pal.subject} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  // hard cuts, 1 frame before the word that starts the new idea (beatscope reads these keys)
  const c = {
    eel: at('The people') - 1,
    tread: at('You wade') - 1,
    fat: at('Fat and sweet') - 1,
    barrel: at('By that fall') - 1,
    plate: at('Now look') - 1,
    cran: at('And this') - 1,
    numbers: at('Americans') - 1,
    meal: at("It's a great") - 1,
    question: at('So how did we get') - 1,
  };
  const cuts: [number, React.ReactNode][] = [
    [0, <EelOpen t={t} a={c.eel} />],
    [c.tread, <Tread t={t} a={c.tread} />],
    [c.fat, <FatSweet t={t} a={c.fat} />],
    [c.barrel, <BarrelNight t={t} a={c.barrel} />],
    [c.plate, <Plate t={t} a={c.plate} />],
    [c.cran, <CranSlide t={t} a={c.cran} />],
    [c.numbers, <Numbers t={t} a={c.numbers} />],
    [c.meal, <Meal t={t} a={c.meal} />],
    [c.question, <Question t={t} a={c.question} />],
  ];
  let scene = useScene(cuts);
  if (frame >= END) scene = <Sequence from={END} layout="none"><TitleIntro title={TITLE} subtitle={SUBTITLE} line={DATES} /></Sequence>;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SafeText>{frame < END ? <DeskScene ch="ch01" cuts={c} t={t}>{scene}</DeskScene> : scene}</SafeText>
      {frame < END && <Finish vignette={0.3} />}
      <Audio src={staticFile('audio/ch01_cold_open.wav')} />
      <Audio src={staticFile('music/tg_table_theme.mp3')} volume={(f) => interpolate(f, [0, 15, CH01_FRAMES - 24, CH01_FRAMES - 4], [0, TABLE_THEME_VOL, TABLE_THEME_VOL, 0], clamp)} />
      {/* the theme carries on under the title card and fades with it: the card itself is silent (no sound effects in this video,
          so the Gilded Age's click track under the logo is left out) */}
      {/* no sound on cuts (the user, Nov 2026): cuts are silent; the voice and the music carry them. Slips tick on their own. */}
      {['first Thanksgiving', 'forty-six', 'seventy', 'almost none', '1621'].map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.28} />)}
      {['feet', 'Eels', 'Squanto', 'wade', 'mud', 'tread', 'fall', 'barrel', 'single night', 'turkeys', 'cans', 'most', 'great', 'from eels', 'to this', 'shaped'].map((p) => (
        <Sfx key={p} at={at(p) - 5} src={WRITE.src} volume={WRITE.volume} />
      ))}
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
