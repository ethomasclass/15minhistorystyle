// Chapter 5 · Sarah Josepha Hale writes the menu. Hale as a full bust cut-out; the Northwood dinner read off the page with the
// coral swipe on each quoted line; Godey's; the 1863 letter to Lincoln as a full-frame document with a guided pan that lands on
// "For the last fifteen years" (this chapter's one pan); the proclamation; Hale's piece pinned to the board on the last line.
// Light and deadpan: the picture plays it straight and holds after the punchline. Hard, silent cuts.
// Most assets are still placeholders (PLACEHOLDERS below); every scene is timed to the words, so a re-voice re-times it.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch05_hale.words.json';
import {Highlight, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {type SheetCam, camAt, Swipe} from '../kit/vox';
import {DocPage, FullFrame, Ph, type PlaceholderInfo, PrintOr, type StandIn} from '../kit/tg_placeholder';
import {TgBoard} from '../kit/tg_board';
import {Land, Sticky} from '../kit/board';
import {clamp} from '../lib/anim';
import {interpolate} from 'remotion';

const N = words as Narration;
export const CH05_FRAMES = chapterFrames(N, LEAD);

/** Music level 13 LU under the voice (as levels.ts bed(); the tg_ cues aren't in CUE_LUFS yet, so measured LUFS from MUSIC.md). */
const bedAt = (lufs: number, gap = 13) => +Math.pow(10, (-18 - gap - lufs) / 20).toFixed(3);

/** Every stand-in in this chapter, for the swap. */
export const PLACEHOLDERS: PlaceholderInfo[] = [
  {file: 'img/arch/hale_portrait.jpg', what: 'Hale portrait, full bust cut-out (Cut + mask, coral tint, teal trace)', scene: 'Hale, Homemade, board', anchor: 'Her name / And Hale\'s menu',
    swap: 'mask it (tools/mask.py hale_portrait), add to src/masks_ch05.ts, replace <HaleBust> with <Cut name="hale_portrait" box={HALE_BOX} ...>'},
  {file: 'img/arch/northwood_1827_p109.jpg', what: 'Northwood (1827) pp. 109-110, the Thanksgiving dinner page', scene: 'Northwood, Niche', anchor: 'In 1827 / And among',
    swap: 'drop the scan in (DocPage switches to the Sheet); set NW_SIZE to its pixel size and NW_LINES to the three quoted lines (tools/phrase_find.py)'},
  {file: 'img/arch/godeys_cover.jpg', what: "Godey's Lady's Book cover or title page (any Hale-era issue)", scene: 'Godeys', anchor: "Godey's", swap: 'drop in (PrintOr switches); check the crop'},
  {file: 'img/arch/godeys_editorial_a.jpg', what: "a Godey's Thanksgiving editorial page", scene: 'Editorials', anchor: 'Year after', swap: 'drop in; three different years if found'},
  {file: 'img/arch/godeys_editorial_b.jpg', what: "a second Godey's Thanksgiving editorial", scene: 'Editorials', anchor: 'after year', swap: 'drop in'},
  {file: 'img/arch/godeys_editorial_c.jpg', what: "a third Godey's Thanksgiving editorial", scene: 'Editorials', anchor: 'editorials', swap: 'drop in'},
  {file: 'img/arch/hale_letter_lincoln_1863.jpg', what: 'Hale to Lincoln, 28 Sept 1863, the page with "For the last fifteen years" (LOC mal2669900)', scene: 'Letter',
    anchor: 'In September / For the last', swap: 'set LETTER_SIZE; move LETTER_LINE to the phrase and the pan keys to land on it'},
  {file: 'img/arch/lincoln_proclamation_1863.jpg', what: 'Lincoln, Proclamation of Thanksgiving, 3 Oct 1863', scene: 'Proclamation', anchor: 'Days later', swap: 'drop in; fix the tag source'},
  {file: 'img/arch/hale_portrait.jpg (board crop)', what: 'board piece for ch5 (creased print, tools/crease.py)', scene: 'Board', anchor: 'But homemade', swap: 'give TG_SLOTS ch5 a node'},
];

// ---------------------------------------------------------------- Hale, the bust (placeholder for a Cut)
/** Where Hale's bust stands: right side, shoulders running off the bottom edge (no straight cut shows). */
const HALE_BOX: [number, number, number, number] = [1120, 150, 660, 930];
const HaleBust: React.FC<{at: number; traceAt?: number}> = ({at}) => (
  <Ph file="img/arch/hale_portrait.jpg" what="full bust cut-out · coral tint + teal trace" x={HALE_BOX[0]} y={HALE_BOX[1]} w={HALE_BOX[2]} h={HALE_BOX[3]} at={at} land="rise" float />
);
const HALE_TAG = 'Sarah Josepha Hale, portrait · source tbd';

const Hale: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <HaleBust at={a + 1} traceAt={t.at('Hale.') + 2} />
      {g >= t.at('Sarah') && <Highlight text="SARAH JOSEPHA HALE" x={110} y={120} size={74} at={t.at('Sarah')} seed={51} rot={-2} />}
      <Note text="“mary had a little lamb”" x={130} y={430} size={56} rot={-3} at={t.at('Mary had') - 3} />
      <Note text="that was her." x={170} y={590} size={46} rot={-3} at={t.at('That was her') - 3} color="#ffffff" />
      <Tag text={HALE_TAG} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Northwood, read off the page
const NW_SIZE: [number, number] = [1700, 2700];
const NW_SRC = 'img/arch/northwood_1827_p109.jpg';
const NW_WHAT = 'Northwood (1827), the Thanksgiving dinner, pp. 109-110';
/** The three quoted lines, page px (stand-ins until the scan's real line boxes replace them). */
const NW_LINES: StandIn[] = [
  {x: 170, y: 880, w: 690, h: 70, text: 'at the head of the table'},
  {x: 520, y: 1480, w: 860, h: 70, text: 'of every name and description'},
  {x: 260, y: 2060, w: 840, h: 70, text: 'the most distinguished niche'},
];
const box = (l: StandIn): [number, number, number, number] => [l.x, l.y, l.w, l.h];
const NW_TAG = 'Sarah Josepha Hale, Northwood: A Tale of New England, 1827 · Internet Archive';

/** Wide: the page on the desk, then the camera leans in and tilts the page back to read the first two lines. */
const Northwood: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  // page centre on screen at x ~1290 while the title has the left side; then in on the lines
  const keys: [number, SheetCam][] = [
    [a, {x: 25, y: 1350, z: 0.4, rot: -2}],
    [t.at('Look at'), {x: 25, y: 1350, z: 0.4, rot: -2}],
    [t.at('The turkey') - 2, {x: 520, y: 915, z: 0.78, tilt: 14, rot: -1, dofY: 915, dof: 4, band: 140}],
    [t.at('There are') + 2, {x: 520, y: 915, z: 0.78, tilt: 14, rot: -1, dofY: 915, dof: 4, band: 140}],
    [t.at('of every') - 2, {x: 950, y: 1515, z: 0.78, tilt: 14, rot: -1, dofY: 1515, dof: 4, band: 140}],
  ];
  const cam = camAt(keys, g);
  const wide = g < t.at('Look at');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <DocPage src={NW_SRC} what={NW_WHAT} size={NW_SIZE} cam={cam} seed="nw" lines={NW_LINES}>
        <Swipe lines={[box(NW_LINES[0])]} from={t.at('at the head')} to={t.end('at the head of the table')} seed="nw1" />
        <Swipe lines={[box(NW_LINES[1])]} from={t.at('of every')} to={t.end('of every name and description')} seed="nw2" />
      </DocPage>
      {wide && g >= t.at('Northwood.') && <Highlight text="NORTHWOOD · 1827" x={110} y={120} size={84} at={t.at('Northwood.')} seed={52} rot={-2} />}
      {wide && <Note text="a novel" x={140} y={300} size={50} rot={-3} at={t.at('novel') - 3} color="#ffffff" />}
      {wide && <Note text="…with a Thanksgiving dinner" x={140} y={420} size={50} rot={-3} at={t.at('Thanksgiving dinner') - 3} />}
      <Tag text={NW_TAG} x={44} y={40} />
    </AbsoluteFill>
  );
};

/** Detail cut-in: the pumpkin pie's line, close, swiped as it's said. */
const Niche: React.FC<{t: TL; a: number}> = ({t}) => {
  const cam: SheetCam = {x: 690, y: 2095, z: 1.35, tilt: 10, rot: -1, dofY: 2095, dof: 5, band: 120};
  return (
    <AbsoluteFill>
      <DarkPaper />
      <DocPage src={NW_SRC} what={NW_WHAT} size={NW_SIZE} cam={cam} seed="nw" lines={NW_LINES}>
        <Swipe lines={[box(NW_LINES[2])]} from={t.at('the most distinguished')} to={t.end('the most distinguished niche')} seed="nw3" />
      </DocPage>
      <Note text="the pumpkin pie:" x={140} y={180} size={52} rot={-3} at={t.at('the pumpkin') - 3} color="#ffffff" />
      <Tag text={NW_TAG} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Sound familiar? The menu, drawn
/** A teal line drawing of the table from above: the turkey (coral) in the middle, the pumpkin pie at the end. */
const TableDrawing: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const pal = usePal();
  const draw = (at: number, dur = 12) => interpolate(g, [at, at + dur], [0, 1], clamp);
  const plates = [[560, 290], [760, 290], [1160, 290], [1360, 290], [560, 640], [760, 640], [1160, 640], [1360, 640]];
  const pTable = draw(a + 2, 14);
  const pPlates = draw(t.at('basically'), 8);
  const pTurkey = draw(t.at('Turkey in') - 1, 10);
  const pPie = draw(t.at('pie at') - 2, 10);
  const stroke = {fill: 'none', stroke: pal.mark, strokeWidth: 6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, pathLength: 1, strokeDasharray: 1};
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <path d="M470,352 Q468,346 476,344 L1444,340 Q1452,341 1452,350 L1450,580 Q1451,590 1442,590 L478,594 Q468,593 470,584 Z" {...stroke} strokeDashoffset={1 - pTable} />
      {plates.map(([x, y], i) => <circle key={i} cx={x} cy={y + (y < 400 ? 18 : -18)} r={34} {...stroke} strokeWidth={4} strokeDashoffset={1 - pPlates} />)}
      {/* the turkey: one coral shape, the subject */}
      <ellipse cx={960} cy={467} rx={92} ry={62} fill={pal.subject} fillOpacity={0.35 * pTurkey} stroke={pal.subject} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pTurkey} />
      {/* the pie, a wedge at the end of the table */}
      <path d="M1352,470 L1412,422 A76,76 0 0 1 1412,518 Z" {...stroke} strokeDashoffset={1 - pPie} />
    </svg>
  );
};

const Menu: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="sound familiar?" x={120} y={110} size={54} rot={-3} at={a + 1} color="#ffffff" />
      <TableDrawing t={t} a={a} />
      <Note text="turkey in the middle" x={760} y={170} size={46} rot={-3} at={t.at('Turkey in') - 3} color={pal.subject} />
      <Note text="pumpkin pie at the end" x={1150} y={650} size={46} rot={-3} at={t.at('pie at') - 3} />
      {g >= t.at('Written') && <Stamp text="1827" x={170} y={790} at={t.at('Written')} size={150} />}
      <Note text="almost 200 years ago" x={560} y={830} size={56} rot={-3} at={t.at('two hundred') - 3} color="#ffffff" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Godey's
const Godeys: React.FC<{t: TL; a: number}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <PrintOr src="img/arch/godeys_cover.jpg" what="Godey's Lady's Book, cover or title page" x={1100} y={110} w={600} h={800} at={t.at("Godey's") - 1} rot={2}
        tag="Godey's Lady's Book · source tbd" />
      {g >= t.at("Godey's") && <Highlight text="GODEY'S LADY'S BOOK" x={110} y={150} size={72} at={t.at("Godey's")} seed={53} rot={-2} />}
      <Note text="hale: editor, 1837–1877" x={140} y={330} size={50} rot={-3} at={t.at('editor') - 3} color="#ffffff" />
      <Note text="one of the most popular" x={140} y={450} size={50} rot={-3} at={t.at('most popular') - 3} />
      <Note text="and she used it." x={170} y={600} size={60} rot={-3} at={t.at('used it') - 3} color={pal.subject} />
    </AbsoluteFill>
  );
};

const Editorials: React.FC<{t: TL; a: number}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <PrintOr src="img/arch/godeys_editorial_a.jpg" what="Godey's Thanksgiving editorial" x={140} y={150} w={430} h={590} at={t.at('Year after') - 1} rot={-4} />
      <PrintOr src="img/arch/godeys_editorial_b.jpg" what="Godey's Thanksgiving editorial" x={430} y={190} w={430} h={590} at={t.at('after year') - 1} rot={2} />
      <PrintOr src="img/arch/godeys_editorial_c.jpg" what="Godey's Thanksgiving editorial" x={720} y={140} w={430} h={590} at={t.at('editorials') - 1} rot={-1} />
      {g >= t.at('Year after') && <Highlight text="YEAR AFTER YEAR" x={140} y={850} size={84} at={t.at('Year after')} seed={54} rot={-2} />}
      <Note text="one national day" x={1260} y={230} size={56} rot={-3} at={t.at('one national') - 3} color={pal.subject} />
      <Note text="→ to governors" x={1280} y={420} size={50} rot={-3} at={t.at('governors') - 3} color="#ffffff" />
      <Note text="→ to presidents" x={1280} y={540} size={50} rot={-3} at={t.at('presidents') - 3} color="#ffffff" />
      <Tag text="Godey's Lady's Book, editorials · source tbd" x={44} y={40} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- The letter to Lincoln, full frame, one guided pan
const LETTER_SIZE: [number, number] = [2400, 3200];
const LETTER_LINE: StandIn = {x: 330, y: 1700, w: 1180, h: 130, text: 'For the last fifteen years', hand: true};
const LETTER_LINES: StandIn[] = [{x: 1450, y: 250, w: 760, h: 110, text: 'Philada Sept 28th 1863', hand: true}, LETTER_LINE];

const Letter: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const land = t.at('For the last') - 3;
  // A: a slow guided pan from the dateline down the page; it lands on the line as it's spoken, then holds to the hard cut
  const cam: [number, {x: number; y: number; z: number}][] = [
    [a, {x: 1500, y: 560, z: 1.2}],
    [t.at('in the middle of'), {x: 1450, y: 600, z: 1.22}],
    [land, {x: 920, y: 1765, z: 1.55}],
  ];
  return (
    <FullFrame src="img/arch/hale_letter_lincoln_1863.jpg" what="Hale to Lincoln, 28 Sept 1863 · full frame, guided pan" size={LETTER_SIZE} cam={cam} lines={LETTER_LINES} hand
      tag="Sarah J. Hale to Abraham Lincoln, Sept. 28, 1863 · Library of Congress">
      <Swipe lines={[[LETTER_LINE.x, LETTER_LINE.y, LETTER_LINE.w, LETTER_LINE.h]]} from={t.at('For the last')} to={t.end('For the last fifteen years,')} seed="hl" />
    </FullFrame>
  );
};
/** The date as a title in screen space over the page, off once the pan lands so the swipe has the frame. */
const LetterTitle: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const land = t.at('For the last') - 3;
  if (g < t.at('September') || g >= land) return null;
  return <Highlight text="SEPTEMBER 1863" x={110} y={110} size={84} at={t.at('September')} seed={55} rot={-2} />;
};

// ---------------------------------------------------------------- The proclamation
const Proclamation: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <PrintOr src="img/arch/lincoln_proclamation_1863.jpg" what="Lincoln, Proclamation of Thanksgiving, 3 Oct 1863" x={1100} y={100} w={620} h={840} at={a + 1} rot={-1}
        fit="contain" tag="Proclamation of Thanksgiving, Oct. 3, 1863 · source tbd" />
      {g >= t.at('Days later') && <Highlight text="OCT. 3, 1863" x={110} y={130} size={96} at={t.at('Days later')} seed={56} rot={-2} />}
      <Note text="a national thanksgiving" x={140} y={360} size={52} rot={-3} at={t.at('proclaimed') - 3} />
      <Note text="last thursday of november" x={140} y={500} size={52} rot={-3} at={t.at('last Thursday') - 3} color={pal.subject} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Homemade: Hale again, the three-beat list
const Homemade: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <HaleBust at={a + 1} />
      <Note text="hale's menu:" x={140} y={170} size={54} rot={-3} at={t.at("Hale's menu") - 3} color="#ffffff" />
      <Note text="homemade." x={180} y={330} size={72} rot={-3} at={t.at('was homemade') - 1} />
      <Note text="from scratch." x={200} y={490} size={72} rot={-3} at={t.at('From scratch') - 3} />
      <Note text="all day long." x={220} y={650} size={72} rot={-3} at={t.at('All day long') - 3} color={pal.subject} />
      <Tag text={HALE_TAG} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- The board: Hale's piece lands, the question opens
const Board: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <TgBoard ch={5} at={a + 4}>
    <Land at={t.at('shortcut.') - 2} kind="slap" x={1236} y={446} r={-4} z={60}><Sticky text="a shortcut?" w={176} size={48} /></Land>
  </TgBoard>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {
    hale: at('Her name') - 1,
    northwood: at('In 1827') - 1,
    niche: at('And among') - 1,
    menu: at('Sound familiar') - 1,
    godeys: at("Hale didn't") - 1,
    editorials: at('Year after') - 1,
    letter: at('In September') - 1,
    procl: at('Days later') - 1,
    homemade: at("And Hale's") - 1,
    board: at('But homemade') - 1,
  };
  const cuts: [number, React.ReactNode][] = [
    [0, <Hale t={t} a={c.hale} />],
    [c.northwood, <Northwood t={t} a={c.northwood} />],
    [c.niche, <Niche t={t} a={c.niche} />],
    [c.menu, <Menu t={t} a={c.menu} />],
    [c.godeys, <Godeys t={t} a={c.godeys} />],
    [c.editorials, <Editorials t={t} a={c.editorials} />],
    [c.letter, <><Letter t={t} a={c.letter} /><LetterTitle t={t} /></>],
    [c.procl, <Proclamation t={t} a={c.procl} />],
    [c.homemade, <Homemade t={t} a={c.homemade} />],
    [c.board, <Board t={t} a={c.board} />],
  ];
  const scene = useScene(cuts);
  return (
    <>
      {scene}
      {/* silent cuts; a stamp per title, the near-silent marker before each note, sound only for things on screen */}
      {['Sarah', 'Northwood.', 'Written', "Godey's", 'Year after', 'September', 'Days later'].map((w) => <Sfx key={w} at={at(w)} src="sfx/stamp.wav" volume={0.27} />)}
      {['Mary had', 'That was her', 'novel', 'Thanksgiving dinner', 'the pumpkin', 'Turkey in', 'pie at', 'two hundred', 'editor', 'most popular', 'used it',
        'one national', 'governors', 'presidents', 'proclaimed', 'last Thursday', "Hale's menu", 'was homemade', 'From scratch', 'All day long'].map((w) => (
        <Sfx key={w} at={at(w) - 5} src={WRITE.src} volume={WRITE.volume} />
      ))}
      <Sfx at={at('shortcut.') - 2} src="sfx/tick_soft.wav" volume={0.3} />
    </>
  );
};

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_hale.wav" lead={LEAD} music={[{src: 'music/tg_hale.mp3', volume: bedAt(-14.7)}]}>
    <Body />
  </ChapterShell>
);
