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

/** Assets not here yet: each is a labelled placeholder card in the scenes below (swap them when the files land). */
export const PLACEHOLDERS = [
  {file: 'img/flow/tg_modern_plate.png', scenes: ['Plate (full frame, "Now look")', 'Meal (a print on the desk, "It\'s a great meal")'],
    note: 'the modern plate: turkey, green bean casserole with fried onions, sweet potatoes with marshmallows; colour is OK (brief). 16:9. When it lands, Plate shows it full frame (hasFile swap) and the slips can become loops on each dish.'},
] as const;

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

/** A drawn diagram: wade out onto the mud flats, press down with a foot, the eels come up. */
const Tread: React.FC<S> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const press = t.at('tread');
  const dy = interpolate(g, [press, press + 5, press + 12, press + 17], [0, 46, 46, 40], clamp);
  const mud = 712;
  const ground = useMarks().ground; // the mud: the desk's own darkest tone
  const wave = Array.from({length: 33}, (_, i) => `${i ? 'L' : 'M'} ${120 + i * 52} ${420 + Math.sin(i * 1.3) * 7}`).join(' ');
  const draw = interpolate(g, [t.at('You wade'), t.at('You wade') + 10], [0, 1], clamp);
  // a bare leg in profile, facing left: shin, ankle, foot, heel, calf (the thigh runs off the top of the frame)
  const Y = (y: number) => y + dy;
  const leg = `M 1080 ${Y(20)} Q 970 ${Y(150)} 928 ${Y(262)} Q 910 ${Y(440)} 935 ${Y(610)} Q 900 ${Y(636)} 842 ${Y(660)} L 806 ${Y(674)} Q 786 ${Y(690)} 808 ${Y(698)} L 990 ${Y(698)} `
    + `Q 1018 ${Y(692)} 1010 ${Y(650)} L 1002 ${Y(610)} Q 1050 ${Y(400)} 1012 ${Y(270)} Q 1090 ${Y(150)} 1170 ${Y(20)}`;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <path d={wave} stroke={pal.mark} strokeWidth={5} fill="none" opacity={0.75} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        <path d={leg} stroke={pal.mark} strokeWidth={7} fill="rgba(13,12,9,0.6)" strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        <rect x={0} y={mud} width={1920} height={440} fill={ground} opacity={0.93} />
        {Array.from({length: 26}, (_, i) => <line key={i} x1={100 + i * 70} y1={mud + 40 + (i % 3) * 30} x2={140 + i * 70} y2={mud + 70 + (i % 3) * 30} stroke={pal.mark} strokeWidth={3} opacity={0.3} />)}
        <path d={`M 100 ${mud} Q 960 ${mud - 14} 1820 ${mud}`} stroke={pal.mark} strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      </svg>
      <Eel cx={560} cy={mud - 40} w={300} rot={-8} at={press + 6} />
      <Eel cx={1380} cy={mud - 30} w={340} rot={6} flip at={press + 11} />
      <Note text="water" x={150} y={330} size={42} rot={-3} at={t.at('wade') - 2} color="#ffffff" />
      <Note text="mud flats" x={150} y={700} size={56} rot={-3} at={t.at('mud') - 3} />
      <Note text="tread them out" x={1180} y={790} size={64} rot={-4} at={t.at('tread') - 3} />
    </AbsoluteFill>
  );
};

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
  <AbsoluteFill style={{background: '#111'}}>
    {hasFile('img/flow/tg_modern_plate.png')
      ? <Img src={staticFile('img/flow/tg_modern_plate.png')} style={{position: 'absolute', inset: 0, width: 1920, height: 1080, objectFit: 'cover'}} />
      : <Placeholder full file="img/flow/tg_modern_plate.png" note="the modern Thanksgiving plate, full frame (colour OK)" />}
    <Slip text="a turkey" x={140} y={620} size={56} rot={-3} at={t.at('A turkey') - 2} />
    <Slip text="green beans, fried onions" x={160} y={740} size={56} rot={-2} at={t.at('Green beans') - 2} />
    <Slip text="marshmallows on sweet potatoes" x={140} y={860} size={56} rot={-3} at={t.at('Marshmallows') - 2} />
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
      {hasFile('img/flow/tg_modern_plate.png')
        ? <Img src={staticFile('img/flow/tg_modern_plate.png')} style={{position: 'absolute', left: 520, top: 120, width: 880, height: 495, objectFit: 'cover', transform: 'rotate(-2deg)',
          boxShadow: '0 26px 46px rgba(0,0,0,0.8)'}} />
        : <Placeholder file="img/flow/tg_modern_plate.png" x={520} y={120} w={880} h={495} rot={-2} at={a + 1} note="the modern plate, as a print" />}
      <Note text="a great meal." x={1400} y={170} size={56} rot={-4} at={t.at('great') - 3} color="#ffffff" />
      <Strike x1={560} y1={170} x2={1370} y2={580} at={none + 4} bow={20} width={10} />
      <Strike x1={1360} y1={150} x2={560} y2={600} at={none + 8} bow={-20} width={10} />
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
