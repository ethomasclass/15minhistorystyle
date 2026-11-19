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
import {DeskScene} from '../kit/tg_desk';
import {bed} from '../kit/levels';
import {Clip, Cut as FlowCut} from '../kit/tg_cut';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {hold, readEnd} from '../lib/timing';
import {type SheetCam, camAt, Slip, Swipe} from '../kit/vox';
import {DocPage, FullFrame, type PlaceholderInfo, PrintOr, TagOn} from '../kit/tg_placeholder';
import {ChBoard} from '../kit/tg_board';
import {Cut} from '../kit/desk';
import {type Box} from '../kit/vox';
import {MASKS_CH05} from '../masks_ch05';
import {clamp} from '../lib/anim';
import {interpolate} from 'remotion';

const N = words as Narration;
export const CH05_FRAMES = chapterFrames(N, LEAD);


/** Every stand-in in this chapter, for the swap: none left (every archival image has landed; see CREDITS.md). */
export const PLACEHOLDERS: PlaceholderInfo[] = [];

// ---------------------------------------------------------------- Hale, the bust (placeholder for a Cut)
/** Where Hale's bust stands: right side, the cut-out's straight foot just below the bottom edge (no straight cut shows). */
const HALE_BOX: [number, number, number, number] = [1060, 130, 780, 990];

const HaleBust: React.FC<{at: number; traceAt?: number}> = ({at, traceAt}) => (
  <Cut name="hale_1880" mask={MASKS_CH05.hale_1880} size={[1046, 1536]} box={HALE_BOX} at={at} traceAt={traceAt} bare />
);
const HALE_TAG = 'Sarah Josepha Hale, engraved portrait, 1880 · Library of Congress';

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
/** Northwood (Boston, 1827), vol. I, pp. 109-110 (Internet Archive): the line boxes measured on the scans (page px). */
const NW_SIZE: [number, number] = [2362, 4200];
const NW_109 = 'img/arch/northwood-1827-thanksgiving-dinner-turkey-p109.jpg';
const NW_110 = 'img/arch/northwood-1827-thanksgiving-dinner-pumpkin-pie-p110.jpg';
const NW_TITLE = 'img/arch/northwood-1827-title-page-vol1.jpg';
const NW_WHAT = 'Northwood (1827), the Thanksgiving dinner';
/** p. 109 "at the head of the table;" */
const NW_HEAD: Box[] = [[995, 1372, 920, 74]];
/** p. 110 "pies of every" / "name and description" */
const NW_EVERY: Box[] = [[1425, 2050, 625, 78], [300, 2142, 960, 78]];
/** p. 110 "the most distinguish-" / "ed niche." */
const NW_NICHE: Box[] = [[1265, 2232, 785, 78], [300, 2326, 330, 78]];
const NW_TAG = 'Sarah Josepha Hale, Northwood: A Tale of New England, Boston, 1827 · Internet Archive';

/** Wide: the title page on the desk; then p. 109, the camera leaning in on the turkey's line; then p. 110 for the pies. */
const Northwood: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  // the wide notes get their reading time before the camera leans in; p. 109 then holds 3 s once it has arrived
  const look = hold(t.at('Look at'), readEnd(t.at('And in it') - 3, '…with a Thanksgiving dinner'));
  const pies = t.at('There are') + 4;
  const keys: [number, SheetCam][] = [
    [a, {x: -40, y: 2100, z: 0.25, rot: -2}],
    [look, {x: -40, y: 2100, z: 0.25, rot: -2}],
    [Math.max(look + 12, t.at('The turkey') - 6), {x: 1400, y: 1410, z: 0.72, tilt: 14, rot: -1, dofY: 1410, dof: 4, band: 140}],
  ];
  const keys2: [number, SheetCam][] = [
    [pies, {x: 1500, y: 2080, z: 0.72, tilt: 14, rot: -1, dofY: 2080, dof: 4, band: 140}],
    [t.at('of every') + 6, {x: 1180, y: 2140, z: 0.72, tilt: 14, rot: -1, dofY: 2140, dof: 4, band: 150}],
  ];
  const wide = g < look;
  return (
    <AbsoluteFill>
      <DarkPaper />
      {wide && <DocPage src={NW_TITLE} what={NW_WHAT} size={NW_SIZE} cam={keys[0][1]} seed="nwt" />}
      {!wide && g < pies && (
        <DocPage src={NW_109} what={NW_WHAT} size={NW_SIZE} cam={camAt(keys, g)} seed="nw">
          <Swipe lines={NW_HEAD} from={t.at('at the head')} to={t.end('at the head of the table')} seed="nw1" />
        </DocPage>
      )}
      {g >= pies && (
        <DocPage src={NW_110} what={NW_WHAT} size={NW_SIZE} cam={camAt(keys2, g)} seed="nw2">
          <Swipe lines={NW_EVERY} from={t.at('of every')} to={t.end('of every name and description')} seed="nw2" />
        </DocPage>
      )}
      {wide && g >= t.at('Northwood.') && <Highlight text="NORTHWOOD · 1827" x={110} y={120} size={84} at={t.at('Northwood.')} seed={52} rot={-2} />}
      {wide && <Note text="a novel" x={140} y={300} size={50} rot={-3} at={t.at('novel') - 3} color="#ffffff" />}
      {wide && <Note text="…with a Thanksgiving dinner" x={140} y={420} size={50} rot={-3} at={t.at('And in it') - 3} />}
      <TagOn text={`${NW_TAG}${wide ? '' : g < pies ? ' · p. 109' : ' · p. 110'}`} />
    </AbsoluteFill>
  );
};

/** Detail cut-in: the pumpkin pie's line, close, swiped as it's said. */
const Niche: React.FC<{t: TL; a: number}> = ({t}) => {
  const cam: SheetCam = {x: 1060, y: 2300, z: 1.05, tilt: 10, rot: -1, dofY: 2300, dof: 5, band: 140};
  return (
    <AbsoluteFill>
      <DarkPaper />
      <DocPage src={NW_110} what={NW_WHAT} size={NW_SIZE} cam={cam} seed="nw2">
        <Swipe lines={NW_NICHE} from={t.at('the most distinguished')} to={t.end('the most distinguished niche')} seed="nw3" />
      </DocPage>
      <Slip text="the pumpkin pie:" x={140} y={150} size={52} rot={-3} at={t.at('the pumpkin') - 3} />
      <TagOn text={`${NW_TAG} · p. 110`} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Sound familiar? The menu, as a 3D table
const Menu: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill>
      {/* the table as a 3D model the camera orbits (lookdev/tg_d.js tg_table_3d): plates on "basically", the turkey on "Turkey in",
          the pie on "pie at" (the clip's cues are these words' times) */}
      <Clip name="table_3d" at={a} />
      <Note text="sound familiar?" x={160} y={110} size={54} rot={-3} at={a + 1} color="#ffffff" />
      <Note text="turkey in the middle" x={1160} y={124} size={54} rot={-3} at={t.at('Turkey in') - 3} color={pal.subject} />
      <Note text="pumpkin pie at the end" x={1150} y={224} size={50} rot={-2} at={t.at('pie at') - 3} />
      {g >= t.at('Written') && <Stamp text="1827" x={170} y={800} at={t.at('Written')} size={130} />}
      <Note text="almost 200 years ago" x={560} y={866} size={56} rot={-3} at={t.at('almost two') - 3} color="#ffffff" />
      <TagOn text="Drawn model" x={1500} />
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
      <PrintOr src="img/arch/godeys-ladys-book-nov-1863-masthead.jpg" what="Godey's Lady's Book, Nov. 1863" x={1100} y={110} w={600} h={800} at={t.at("Godey's") - 1} rot={2}
        pos="50% 0%" tag="Godey's Lady's Book, Philadelphia, Nov. 1863 · Internet Archive" />
      {g >= t.at("Godey's") && <Highlight text="GODEY'S LADY'S BOOK" x={110} y={150} size={72} at={t.at("Godey's")} seed={53} rot={-2} />}
      <Note text="hale: editor, 1837–1877" x={140} y={330} size={50} rot={-3} at={t.at('editor') - 3} color="#ffffff" />
      <Note text="one of the most popular" x={140} y={450} size={50} rot={-3} at={t.at('most popular') - 3} />
      <Note text="and she used it." x={170} y={600} size={60} rot={-3} at={t.at('And she used') - 3} color={pal.subject} />
    </AbsoluteFill>
  );
};

const Editorials: React.FC<{t: TL; a: number}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      {/* three years of the Editors' Table, the clippings Hale sent Lincoln with her letter: July 1859, July 1860, Nov. 1861 */}
      <PrintOr src="img/arch/godeys-editors-table-thanksgiving-july-1859-clipping.jpg" what="Godey's Editors' Table, 1859" x={140} y={150} w={430} h={590} at={t.at('Year after') - 1} rot={-4}
        pos="50% 8%" />
      <PrintOr src="img/arch/godeys-editors-table-thanksgiving-july-1860-clipping.jpg" what="Godey's Editors' Table, 1860" x={430} y={190} w={430} h={590} at={t.at('after year') - 1} rot={2}
        pos="50% 4%" />
      <PrintOr src="img/arch/godeys-editors-table-thanksgiving-nov-1861-clipping.jpg" what="Godey's Editors' Table, 1861" x={720} y={140} w={430} h={590} at={t.at('editorials') - 1} rot={-1}
        pos="50% 6%" />
      {[[150, '1859'], [440, '1860'], [730, '1861']].map(([x, y], i) => (
        <Note key={y} text={y as string} x={(x as number) + 300} y={i === 1 ? 700 : 660} size={46} rot={-4} at={t.at(['Year after', 'after year', 'editorials'][i]) + 2} color="#ffffff" />
      ))}
      {g >= t.at('Year after') && <Highlight text="YEAR AFTER YEAR" x={140} y={850} size={84} at={t.at('Year after')} seed={54} rot={-2} />}
      <Note text="one national day" x={1260} y={230} size={56} rot={-3} at={t.at('one national') - 3} color={pal.subject} />
      <Note text="→ to governors" x={1280} y={420} size={50} rot={-3} at={t.at('She wrote to governors') - 3} color="#ffffff" />
      <Note text="→ to presidents" x={1280} y={540} size={50} rot={-3} at={t.at('She wrote to presidents') - 3} color="#ffffff" />
      <Tag text="Godey's Lady's Book, Editors' Table, 1859-61 · Abraham Lincoln Papers, Library of Congress" x={44} y={40} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- The letter to Lincoln, full frame, one guided pan
/** Hale to Lincoln, 28 Sept. 1863, p. 1 (LOC, Lincoln Papers mal2669900): "For the last fifteen years" measured on the scan. */
const LETTER_SRC = 'img/arch/hale-letter-to-lincoln-1863-p1.jpg';
const LETTER_SIZE: [number, number] = [4820, 6084];
const LETTER_LINE: Box = [580, 4380, 1990, 205];

const Letter: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const land = t.at('For the last') - 3;
  // A: a slow guided pan from the dateline down the page; it lands on the line as it's spoken, then holds to the hard cut
  // page px; z 1 fills the frame (0.398 px per page px here): the dateline, then a slow glide down the page to the line
  const cam: [number, {x: number; y: number; z: number}][] = [
    [a, {x: 3050, y: 520, z: 1.35}],
    [t.at('in the middle of'), {x: 2950, y: 600, z: 1.37}],
    [land, {x: 1580, y: 4480, z: 1.6}],
  ];
  return (
    <FullFrame src={LETTER_SRC} what="Hale to Lincoln, 28 Sept 1863" size={LETTER_SIZE} cam={cam}
      tag="Sarah J. Hale to Abraham Lincoln, Sept. 28, 1863, p. 1 · Abraham Lincoln Papers, Library of Congress">
      <Swipe lines={[LETTER_LINE]} from={t.at('For the last')} to={t.end('For the last fifteen years,')} seed="hl" />
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
      <PrintOr src="img/arch/lincoln-thanksgiving-proclamation-1863-p1.jpg" what="Lincoln, Proclamation of Thanksgiving, 3 Oct 1863" x={1150} y={110} w={540} h={837} at={a + 1} rot={-1}
        tag="Thanksgiving Proclamation, Oct. 3, 1863, p. 1 · National Archives, via Wikimedia Commons" />
      <PrintOr src="img/arch/lincoln-thanksgiving-proclamation-1863-p2.jpg" what="Proclamation, p. 2" x={900} y={360} w={400} h={610} at={t.at('Thanksgiving, on') - 1} rot={3} pos="50% 30%" />
      {g >= t.at('Days later') && <Highlight text="OCT. 3, 1863" x={110} y={130} size={96} at={t.at('Days later')} seed={56} rot={-2} />}
      <Note text="a national thanksgiving" x={140} y={360} size={52} rot={-3} at={t.at('proclaimed') - 3} />
      <Note text="last thursday of november" x={140} y={500} size={52} rot={-3} at={t.at('on the last') - 3} color={pal.subject} />
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
      <FlowCut name="tg_homemade_pie" x={610} y={230} w={400} rot={-3} at={t.at('From scratch') + 6} />
      <Tag text={HALE_TAG} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- The board: Hale's piece lands, the question opens
const Board: React.FC<{t: TL; a: number}> = ({t, a}) => <ChBoard ch={5} at={a + 4} ghost={{id: 'jello', at: t.at('shortcut.') - 8, yarnAt: t.at('shortcut.') - 2}} />;

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {
    hale: at('Her name') - 1,
    northwood: hold(at('In 1827') - 1, readEnd(at('That was her') - 3, 'that was her.')),
    niche: at('And among') - 1,
    menu: at('Sound familiar') - 1,
    godeys: hold(at("Hale didn't") - 1, readEnd(at('almost two') - 3, 'almost 200 years ago')),
    editorials: hold(at('Year after') - 1, readEnd(at('And she used') - 3, 'and she used it.')),
    letter: hold(at('In September') - 1, readEnd(at('She wrote to presidents') - 3, '→ to presidents')),
    procl: at('Days later') - 1,
    homemade: hold(at("And Hale's") - 1, readEnd(at('on the last') - 3, 'last thursday of november'), at('Thanksgiving, on') + 6 + 93),
    board: hold(at('But homemade') - 1, readEnd(at('All day long') - 3, 'all day long.')),
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
      <DeskScene ch="ch05" cuts={c} t={t}>{scene}</DeskScene>
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
  <ChapterShell n={N} audio="audio/ch05_hale.wav" lead={LEAD} baton="Jell-O" music={[{src: 'music/tg_hale.mp3', volume: bed('tg_hale')}]}>
    <Body />
  </ChapterShell>
);
