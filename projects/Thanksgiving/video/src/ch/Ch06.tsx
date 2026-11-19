// Chapter 6 · Midpoint: Jell-O, the fanciest dish in the house. The aspic as a showpiece (Beeton 1869: the jelly engraving, the
// calf's-feet stock recipe swiped over the kitchen diorama, the mould woodcut, colour Plate VII), Knox (the 1891 label, the 1911
// ads), the aspic mould morphing into a Jell-O box, the second MOCK tape on "Mock aspic", the real 1920 Jell-O booklet as a
// colour print, Perfection Salad (Knox 1915). Then the pattern interrupt: a hard cut to the Knox 1915 Tuna Fish Salad page,
// full frame in colour, a pan-to-reveal (this chapter's one pan), the music cut to silence, held through the pause, then a hard
// cut to the dish alone on the coral desk for "Yes. People ate this. On purpose." The Jell-O piece lands on the board on the last
// line. Coral-desk flashes (kit/tg_desk_map): "we have servants", the MOCK tape cut-in, the tuna line.
// Hard, silent cuts. Placeholders are listed in PLACEHOLDERS; every beat is timed to the words.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch06_jello.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {bed} from '../kit/levels';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {Clip, Cut, CutLoop, States} from '../kit/tg_cut';
import {FullFrame, PhLabel, type PlaceholderInfo, TgPrint} from '../kit/tg_placeholder';
import {type Box, Swipe} from '../kit/vox';
import {COLOUR_DOC, PageScrap} from './ch34/parts';
import {MockTape} from '../kit/tg_mock';
import {ChBoard} from '../kit/tg_board';
import {CutIn, DeskScene} from '../kit/tg_desk';

const N = words as Narration;
export const CH06_FRAMES = chapterFrames(N, LEAD);


// Nothing in this chapter is a placeholder any more.
export const PLACEHOLDERS: PlaceholderInfo[] = [];

// ---------------------------------------------------------------- the scans (CREDITS.md), line boxes measured on them (source px)
const BEETON_SIZE: [number, number] = [1523, 2367];
const BEETON_TAG = "Isabella Beeton, Book of Household Management, London, 1869 · Wellcome Collection";
/** p. 729, no. 1477 "To make the stock for jelly": "2 calf's feet, 6 pints of water." / "boil it very gently for 6 or 7 hours," / "then strain it" */
const B729 = {src: 'img/arch/beeton-1869-calfs-feet-jelly-stock-mould-and-bag-p729.jpg', scrap: [40, 120, 1460, 1290] as Box,
  feet: [470, 205, 565, 48] as Box, hours: [85, 1290, 750, 48] as Box, strain: [545, 1340, 560, 48] as Box};
/** p. 751: the woodcut OVAL JELLY-MOULD */
const B751 = {src: 'img/arch/beeton-1869-oval-jelly-mould-p751.jpg', mould: [740, 125, 580, 520] as Box};
/** p. 715: the chapter engraving, moulded jellies on a sideboard */
const B715 = {src: 'img/arch/beeton-1869-creams-jellies-chapter-engraving.jpg', cut: [120, 390, 1180, 860] as Box};
/** colour Plate VII: savoury jellies; the Savoury Jelly a la Belle-Vue top left */
const BPLATE = 'img/arch/beeton-1869-plate-vii-savoury-jelly-belle-vue.jpg';
const BELLEVUE: Box = [0, 40, 640, 600];
/** Knox 1915, Dainty Desserts for Dainty People, p. 26: PERFECTION SALAD (the recipe block) and TUNA FISH SALAD (the dish) */
const K26 = {src: 'img/arch/knox-1915-perfection-salad-and-tuna-fish-salad-p26.jpg', size: [2216, 3340] as [number, number],
  perfection: [220, 1120, 1880, 560] as Box, cabbage: [1210, 1280, 660, 46] as Box, celery: [1210, 1324, 700, 46] as Box, pimentos: [1210, 1364, 690, 46] as Box};
const KNOX_1915_TAG = 'Knox Gelatine, Dainty Desserts for Dainty People, 1915 · Internet Archive';

// ---------------------------------------------------------------- The gelatin mold
const Mold: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      {/* our own wobble loop of the ring (24 warped drawings, 12 a second) */}
      <CutLoop dir="jello_ring" stem="ring" n={24} size={[859, 531]} x={960} y={300} w={800} at={a + 1} />
      {g >= t.at('gelatin') && <Highlight text="THE GELATIN MOLD" x={110} y={130} size={88} at={t.at('gelatin')} seed={61} rot={-2} />}
      <Note text="from nowhere?" x={150} y={320} size={54} rot={-3} at={t.at('nowhere.') - 3} color="#ffffff" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- A showpiece
const Showpiece: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <PageScrap src={B715.src} size={BEETON_SIZE} box={B715.cut} x={960} y={200} w={800} at={a + 1} rot={1.5} seed="b715" tag={`${BEETON_TAG} · p. 715`} />
      <Note text="in the 1800s:" x={140} y={150} size={54} rot={-3} at={a + 1} color="#ffffff" />
      <Note text="a shimmering jelly" x={160} y={290} size={56} rot={-3} at={t.at('shimmering') - 3} />
      <Note text="a showpiece." x={180} y={460} size={84} rot={-3} at={t.at('showpiece.') - 3} color={pal.subject} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- How you made one: the drawn kitchen
const Kitchen: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const pal = usePal();
  const steps: [string, string, string?][] = [
    ["1  boil calves' feet", 'boiled'], ['…for hours', 'hours.', '#ffffff'], ['2  skim it', 'skimmed'], ['3  strain it', 'strained'], ['4  clear it', 'cleared'],
    ['5  set it in a copper mold', 'copper', pal.subject],
  ];
  const ys = [130, 225, 340, 445, 550, 665];
  const xs = [130, 560, 130, 130, 130, 130];
  return (
    <AbsoluteFill>
      {/* our drawn scene (lookdev/tg.js tg_victorian_kitchen): the stockpot, the jelly bag, the clock, the coral mould */}
      <Clip name="victorian_kitchen" at={a} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(13,12,9,0.78) 0%, rgba(13,12,9,0.4) 30%, transparent 48%)'}} />
      {steps.map(([text, w, color], i) => <Note key={w} text={text} x={xs[i]} y={ys[i]} size={i === 1 ? 44 : 52} rot={-3} at={t.at(w) - 3} color={color} />)}
      {/* the recipe itself: Beeton's calf's-feet stock, each step swiped as it's said; then the mould, a woodcut */}
      <PageScrap src={B729.src} size={BEETON_SIZE} box={B729.scrap} x={1330} y={96} w={430} at={t.at('boiled') - 2} rot={1.5} seed="b729" tag={`${BEETON_TAG} · p. 729`}>
        <Swipe lines={[B729.feet]} from={t.at("calves' feet") - 1} to={t.end("calves' feet") + 4} seed="bf" />
        <Swipe lines={[B729.hours]} from={t.at('for hours.') - 1} to={t.end('for hours.') + 4} seed="bh" />
        <Swipe lines={[B729.strain]} from={t.at('strained') - 1} to={t.end('strained') + 4} seed="bs" />
      </PageScrap>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Aspic: the vocabulary beat, then who could make one
const ASPIC = {x: 1060, y: 230, w: 660, h: 640};
const Aspic: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <TgPrint src={BPLATE} x={ASPIC.x + 60} y={ASPIC.y - 110} w={560} h={870} at={a + 1} rot={2} color fit="cover" tag={`${BEETON_TAG} · Plate VII`} />
      <Note text="some sweet," x={140} y={130} size={52} rot={-3} at={t.at('sweet.') - 3} color="#ffffff" />
      <Note text="some savory" x={540} y={140} size={52} rot={-3} at={t.at('savory') - 3} />
      {g >= t.at('aspic.') && <Highlight text="ASPIC" x={140} y={290} size={130} at={t.at('aspic.')} seed={63} rot={-2} />}
      <Definition term="as·pic" def="a savory jelly with meat or vegetables set inside" at={t.at('aspic.') + 9} x={160} y={500} w={820} />
      <Note text="only a house with a cook" x={150} y={700} size={52} rot={-3} at={t.at('cook,') - 3} color="#ffffff" />
      <Note text="and a lot of time" x={170} y={820} size={52} rot={-3} at={t.at('lot of time') - 3} color="#ffffff" />
    </AbsoluteFill>
  );
};

/** The punchline as a detail cut-in on the same prop: coral, then the frame holds. */
const Servants: React.FC<{t: TL; a: number}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <PageScrap src={BPLATE} size={BEETON_SIZE} box={BELLEVUE} x={960} y={140} w={800} rot={1.5} seed="bv" filter={COLOUR_DOC}
        tag={`Savoury Jelly a la Belle-Vue · ${BEETON_TAG}`} />
      <Note text="a wobbling aspic said:" x={140} y={300} size={54} rot={-3} at={t.at('A wobbling') - 3} />
      <Note text="“we have servants.”" x={160} y={460} size={72} rot={-3} at={t.at('we have servants') - 3} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** "we have servants.": a hard cut in, the line alone and large beside the jelly (the coral flash). */
const ServantsFlash: React.FC<{t: TL; a: number}> = () => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <PageScrap src={BPLATE} size={BEETON_SIZE} box={BELLEVUE} x={1060} y={170} w={700} rot={-2} seed="bv2" filter={COLOUR_DOC} tag="Savoury Jelly a la Belle-Vue · Beeton, 1869" />
      <Note text="“we have servants.”" x={150} y={430} size={104} rot={-3} at={-999} color={pal.subject} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Knox: the shortcut
const Knox: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <PageScrap src="img/arch/knox-sparkling-gelatine-trademark-label-1891.jpg" size={[4216, 6203]} box={[700, 2180, 2650, 1480]} x={1000} y={120} w={800} at={a + 1} rot={1.5}
        seed="kl" filter={COLOUR_DOC} />
      <TgPrint src="img/arch/knox-gelatine-ad-good-housekeeping-dec-1911.jpg" x={1110} y={560} w={170} h={471} at={t.at('ground up') - 2} rot={-3} color fit="cover" pos="50% 0%" />
      <TgPrint src="img/arch/knox-gelatine-ad-cosmopolitan-may-1911.jpg" x={1360} y={545} w={170} h={493} at={t.at('dissolve.') - 2} rot={3} color fit="cover" pos="50% 0%" />
      <Tag text="Knox's Sparkling Gelatine label, trademark reg. 1891 · LOC · Knox ads, Good Housekeeping and Cosmopolitan, 1911 · Internet Archive" x={44} y={40} />
      {g >= t.at('shortcut.') && <Highlight text="THE SHORTCUT" x={110} y={130} size={100} at={t.at('shortcut.')} seed={64} rot={-2} />}
      <Note text="charles knox, around 1890" x={140} y={340} size={50} rot={-3} at={t.at('Charles Knox') - 3} color="#ffffff" />
      <Note text="already ground up" x={160} y={480} size={58} rot={-3} at={t.at('ground up') - 3} />
      <Note text="ready to dissolve" x={180} y={610} size={58} rot={-3} at={t.at('dissolve.') - 3} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- The morph: aspic mould -> Jell-O box
const MORPH_BOX = {x: 1000, y: 200, w: 760, h: 700};
const Morph: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const pal = usePal();
  const m0 = t.at('added sugar') - 2;
  const m1 = t.at('Jell-O.');
  // made in code from three registered stills (no video), swapped like stop-motion: the amber aspic and its copper mould; half
  // red, the mould turning to a cardboard box ("added sugar"); the red gelatin and its box ("Jell-O."). Each lands with a wobble.
  return (
    <AbsoluteFill>
      <DarkPaper />
      <States srcs={['morph_aspic_jello_first', 'morph_aspic_jello_mid', 'morph_aspic_jello_last']} at={[a + 1, m0, m1]} x={MORPH_BOX.x - 330} y={MORPH_BOX.y - 30} w={1400} land="drop" wobble />
      {g >= t.at('In 1897') && <Highlight text="1897" x={110} y={120} size={110} at={t.at('In 1897')} seed={65} rot={-2} />}
      <Note text="upstate new york" x={140} y={300} size={50} rot={-3} at={t.at('upstate') - 3} color="#ffffff" />
      <Note text="+ sugar" x={160} y={430} size={58} rot={-3} at={t.at('added sugar') - 3} />
      <Note text="+ fruit flavor" x={160} y={550} size={58} rot={-3} at={t.at('fruit flavor') - 3} />
      <Note text="= jell-o" x={170} y={700} size={92} rot={-3} at={t.at('Jell-O.') - 3} color={pal.subject} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Anyone could make it: the real 1920 booklet, in colour
const BOOK = 'The Jell-O Girl Gives a Party, booklet, 1920 · Genesee Pure Food Co. · Wellcome Collection / Internet Archive';
const Booklet: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <TgPrint src="img/arch/jello-girl-gives-a-party-1920-cover.jpg" x={160} y={100} w={560} h={766} at={a + 1} rot={-2} color tag={BOOK} />
      <Note text="anyone could make it" x={880} y={200} size={60} rot={-3} at={t.at('anyone') - 3} />
      <Note text="the rich family's dessert" x={920} y={330} size={50} rot={-3} at={t.at("rich family's") - 3} color="#ffffff" />
      <Note text="in about 10 minutes" x={900} y={520} size={76} rot={-3} at={t.at('In about') - 3} color={pal.subject} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Mock aspic: the pair, the tape, a held frame
/** `solo`: the box side only (the MOCK flash's cut-in). */
const Mock: React.FC<{t: TL; a: number; solo?: boolean}> = ({t, a, solo}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      {!solo && <div style={{position: 'absolute', left: 958, top: 130, width: 4, height: 820, background: 'rgba(244,239,230,0.35)'}} />}
      {!solo && <div style={{position: 'absolute', left: 200, top: 150, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: pal.mark}}>THE REAL THING</div>}
      <div style={{position: 'absolute', left: 1100, top: 150, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: pal.subject}}>FROM A BOX</div>
      {!solo && <Cut name="tg_aspic" x={190} y={270} w={600} land="none" />}
      <Cut name="tg_gelatin_box" x={1110} y={270} w={600} land="none" />
      <MockTape x={1410} y={560} at={t.at('Mock aspic')} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Perfection Salad
const Perfection: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      {/* the Knox booklet's title page, then its Perfection Salad recipe (p. 26, the recipe block only: the dish on that page is saved for the reveal) */}
      <TgPrint src="img/arch/knox-dainty-desserts-1915-title.jpg" x={1240} y={110} w={460} h={693} at={a + 1} rot={3} color fit="cover" />
      <PageScrap src={K26.src} size={K26.size} box={K26.perfection} x={900} y={560} w={900} at={t.at('Perfection') - 1} rot={-1.5} seed="k26p" filter={COLOUR_DOC}>
        <Swipe lines={[K26.cabbage]} from={t.at('cabbage,') - 1} to={t.end('cabbage,') + 4} seed="kc" />
        <Swipe lines={[K26.celery]} from={t.at('celery') - 1} to={t.end('celery') + 4} seed="ke" />
        <Swipe lines={[K26.pimentos]} from={t.at('peppers,') - 1} to={t.end('peppers,') + 4} seed="kp" />
      </PageScrap>
      <Tag text={`Perfection Salad, as printed in ${KNOX_1915_TAG}, p. 26`} x={44} y={40} />
      <Note text="a prize, around 1905:" x={140} y={140} size={50} rot={-3} at={t.at('prize') - 3} color="#ffffff" />
      {g >= t.at('Perfection') && <Highlight text="PERFECTION SALAD" x={130} y={270} size={80} at={t.at('Perfection')} seed={66} rot={-2} />}
      <Note text="cabbage" x={170} y={480} size={56} rot={-4} at={t.at('cabbage,') - 3} />
      <Note text="celery" x={460} y={490} size={56} rot={-2} at={t.at('celery') - 3} />
      <Note text="peppers" x={720} y={480} size={56} rot={-4} at={t.at('peppers,') - 3} />
      <Note text="…in gelatin" x={200} y={640} size={64} rot={-3} at={t.at('suspended') - 3} />
    </AbsoluteFill>
  );
};

const Fifties: React.FC<{t: TL; a: number}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('1910s,') && <Highlight text="BY THE 1910s" x={300} y={330} size={120} at={t.at('1910s,')} seed={67} rot={-2} />}
      <Note text="…just about anything" x={380} y={560} size={80} rot={-3} at={t.at('anything') - 3} color={pal.subject} />
      {/* eggs, carrots, peas and ham set in a dome: just about anything */}
      <Cut name="tg_aspic_savory" x={1200} y={690} w={520} rot={2} at={t.at('anything') - 1} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- The 1915 tuna salad: hard cut, colour, pan to reveal, then hold
/** The tuna fish salad on Knox p. 26 (source px): where the pan starts, tight on one of the moulds. The recipe above it says it:
 *  ½ envelope Knox gelatine, a cup of tuna, "turn into six individual molds". */
const AD_DISH = {x: 1150, y: 2700};
const Ad: React.FC<{t: TL; a: number}> = ({t, a}) => {
  // C: start tight on the odd detail, pull out to the whole page as the date is said; then the frame holds, no new marks
  const out0 = t.at('A recipe');
  const out1 = t.at("That's tuna") - 4;
  const cam: [number, {x: number; y: number; z: number}][] = [
    [a, {...AD_DISH, z: 2.1}],
    [out0, {x: AD_DISH.x, y: AD_DISH.y - 10, z: 2.0}],
    [out1, {x: 1108, y: 1670, z: 0.1}],
  ];
  return (
    <FullFrame src={K26.src} what="Knox 1915, p. 26, Tuna Fish Salad · colour, pan to reveal" size={K26.size} cam={cam} color
      tag={`Tuna Fish Salad, ${KNOX_1915_TAG}, p. 26`} tagAt={out1} vignette={0.35} />
  );
};

/** "Yes. People ate this. On purpose.": a hard cut from the held page to the dish alone, a colour print on the coral desk (the flash). */
const TUNA_DISH: Box = [380, 2300, 1560, 780];
const TunaFlash: React.FC<{t: TL; a: number}> = () => (
  <AbsoluteFill>
    <DarkPaper />
    <PageScrap src={K26.src} size={K26.size} box={TUNA_DISH} x={300} y={250} w={1320} rot={-1.5} seed="k26t" filter={COLOUR_DOC} tag={`Tuna Fish Salad, ${KNOX_1915_TAG}, p. 26`} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------- The board: the Jell-O piece lands with its MOCK tag
const Board: React.FC<{t: TL; a: number}> = ({t, a}) => <ChBoard ch={6} at={a + 4} ghost={{id: 'can', at: t.at('write the recipe') - 2}} />;

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {
    mold: at("Here's a dish") - 1,
    show: at('a shimmering') - 1,
    kitchen: at('To make one') - 1,
    aspic: at('Some were') - 1,
    servants: at('A wobbling') - 1,
    servantsFlash: at('we have servants') - 1,
    knox: at('Then came the shortcut') - 1,
    morph: at('In 1897') - 1,
    booklet: at('Suddenly') - 1,
    mockFlash: at('Mock aspic') - 1,
    mock: at('Mock aspic') + 44,
    perfection: at('Around 1905') - 1,
    fifties: at('By the 1910s') - 1,
    ad: at('Like this') - 1,
    tunaFlash: at('Yes.') - 1,
    board: at('And the companies') - 1,
  };
  const cuts: [number, React.ReactNode][] = [
    [0, <Mold t={t} a={c.mold} />],
    [c.show, <Showpiece t={t} a={c.show} />],
    [c.kitchen, <Kitchen t={t} a={c.kitchen} />],
    [c.aspic, <Aspic t={t} a={c.aspic} />],
    [c.servants, <Servants t={t} a={c.servants} />],
    [c.servantsFlash, <ServantsFlash t={t} a={c.servantsFlash} />],
    [c.knox, <Knox t={t} a={c.knox} />],
    [c.morph, <Morph t={t} a={c.morph} />],
    [c.booklet, <Booklet t={t} a={c.booklet} />],
    [c.mockFlash, <CutIn x={1410} y={490} z={1.2}><Mock t={t} a={c.mockFlash} solo /></CutIn>],
    [c.mock, <Mock t={t} a={c.mock} />],
    [c.perfection, <Perfection t={t} a={c.perfection} />],
    [c.fifties, <Fifties t={t} a={c.fifties} />],
    [c.ad, <Ad t={t} a={c.ad} />],
    [c.tunaFlash, <TunaFlash t={t} a={c.tunaFlash} />],
    [c.board, <Board t={t} a={c.board} />],
  ];
  const scene = useScene(cuts);
  return (
    <>
      <DeskScene ch="ch06" cuts={c} t={t}>{scene}</DeskScene>
      {/* silent cuts. Stamps on titles and the MOCK tape; the near-silent marker before notes. Nothing at all in the held ad frame. */}
      {['gelatin', 'aspic.', 'shortcut.', 'In 1897', 'Perfection', '1910s,'].map((w) => <Sfx key={w} at={at(w)} src="sfx/stamp.wav" volume={0.27} />)}
      <Sfx at={at('Mock aspic')} src="sfx/stamp.wav" volume={0.32} />
      {['nowhere.', 'showpiece.', 'shimmering', 'boiled', 'hours.', 'skimmed', 'strained', 'cleared', 'copper', 'sweet.', 'savory', 'cook,', 'lot of time', 'A wobbling',
        'we have servants', 'Charles Knox', 'ground up', 'dissolve.', 'upstate', 'added sugar', 'fruit flavor', 'Jell-O.', 'anyone', 'In about', "rich family's", 'prize', 'cabbage,', 'celery',
        'peppers,', 'suspended', 'anything'].map((w) => <Sfx key={w} at={at(w) - 5} src={WRITE.src} volume={WRITE.volume} />)}
    </>
  );
};

/** Music: the gelatin cue, dropped to silence 4 frames before the ad; the ad sting under the reveal, gone by the end of "box." so
 *  the pause and the deadpan line sit in silence; the gelatin cue back for the board, picked up where it stopped. */
const Music = (t: TL) => {
  const like = t.at('Like this');
  const back = t.at('And the companies') - 2;
  return [
    {src: 'music/tg_gelatin.mp3', volume: bed('tg_gelatin'), to: like - 4, fadeOut: 5},
    {src: 'music/tg_ad_sting.mp3', volume: bed('tg_ad_sting', 15), from: like - 1, to: t.end('box.') + 4, fadeOut: 12},
    {src: 'music/tg_gelatin.mp3', volume: bed('tg_gelatin'), from: back, startFrom: like},
  ];
};

export const Ch06: React.FC = () => {
  const t = makeTimeline(N, 30);
  return (
    <ChapterShell n={N} audio="audio/ch06_jello.wav" lead={LEAD} baton="The Test Kitchens" music={Music(t)}>
      <Body />
    </ChapterShell>
  );
};
