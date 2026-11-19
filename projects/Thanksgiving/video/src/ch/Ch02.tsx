// Chapter 2 · 1621: the meal that proved nothing. Logo-break lead-in, then scenes cut hard (and silently) on spoken words of
// script/ch02_1621.txt. Winslow's letter is the chapter's document read (its one guided pan, landing on "fowling"), then the fowl
// and the five deer, the alliance, what wasn't there (pie, potatoes, cranberry: struck out), the 200-year gap, and the board: the
// eel is this chapter's pin. Missing assets are labelled placeholders (PLACEHOLDERS below); the motion and marks are built round them.
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch02_1621.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {NoPhoto} from '../kit/print';
import {ChapterShell, chapterFrames, hasFile, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {Slip, Swipe, type Box} from '../kit/vox';
import {APin, AThreads, BRAND, Ctx, Defs, Land, BoardStage, Strip} from '../kit/board';
import {Cran, Diorama, Eel, PageLine, PageRead, Placeholder, PrintSlot, PropSlot, Strike, Tally, type Plane} from '../kit/tg_props';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);

// ------------------------------------------------------------------ assets still to come
const LETTER = 'img/arch/winslow_letter_mourts_relation_1622.jpg';
/** The page's pixel size is a guess until the scan lands: re-read it then, and re-measure FOWL / WEEK with tools/phrase_find.py. */
const LETTER_SIZE: [number, number] = [1700, 2600];
const FOWL: Box[] = [[150, 1180, 1120, 50]];
const WEEK: Box[] = [[150, 1372, 1080, 50]];
const WINSLOW = 'img/arch/winslow_portrait_1651.jpg';
const D1: Plane[] = [
  {src: 'img/flow/d1_sky.png', depth: 0, band: [0, 1080], tone: '#1C3332'},
  {src: 'img/flow/d1_far.png', depth: 0.25, band: [470, 260], tone: '#335652'},
  {src: 'img/flow/d1_mid.png', depth: 0.55, band: [610, 300], tone: '#24403d'},
  {src: 'img/flow/d1_front.png', depth: 1, band: [800, 300], tone: '#0D0C09'},
];

export const PLACEHOLDERS = [
  ...D1.map((p) => ({file: p.src, scenes: ['Plymouth'], note: 'D1 eel river at dawn (FLOW_CUTOUT_PROMPTS §7), one plane, full-frame RGBA cut from black; the rejected d1_sky.jpg is not used. The front plane carries the wading figure and the coral basket.'})),
  {file: LETTER, scenes: ['OneLetter (print)', 'Letter (the guided read)'], note: "Winslow's letter of 11 Dec 1621 as printed in Mourt's Relation (1622), the page with \"sent four men on fowling\" (Dexter ed. 1865, p.[61], per RESEARCH.md). Set LETTER_SIZE to its real size and re-measure the FOWL and WEEK line boxes; the PageLine text then switches off by itself."},
  {file: WINSLOW, scenes: ['Winslow'], note: 'Edward Winslow, 1651 portrait (Pilgrim Hall Museum). Becomes a bust Cut: tools/mask.py winslow, the entry in src/masks_ch02.ts, coral tint + teal trace.'},
  {file: 'img/props/tg_fowl.webp', scenes: ['Translation'], note: 'Flow prop: a brace of wild fowl (ducks/geese), paper look, muted engraving colour, cut with prop_cut.py.'},
  {file: 'img/props/tg_deer.webp', scenes: ['Deer (x5)', 'Translation'], note: 'Flow prop: one deer (side view), paper look, muted engraving colour.'},
  {file: 'img/props/tg_pie.webp', scenes: ['NotThere'], note: 'Flow prop: a pumpkin pie, whole (it is struck out).'},
  {file: 'img/props/tg_potato.webp', scenes: ['NotThere'], note: 'Flow prop: a bowl of mashed potatoes (struck out).'},
] as const;

type S = {t: TL; a: number};

/** Callback to the cold open: the eel alone on the desk, before turkey. */
const Before: React.FC<S> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Eel cx={1380} cy={600} w={700} rot={-3} />
    <Note text="thanksgiving dinner," x={150} y={300} size={56} rot={-3} at={t.at('Thanksgiving dinner') - 3} color="#ffffff" />
    <Highlight text="BEFORE TURKEY" x={140} y={430} size={100} at={t.at("wasn't turkey")} seed={21} rot={-2} />
  </AbsoluteFill>
);

/** Plymouth, autumn 1621: the eel-river diorama (placeholder planes) in a slow parallax. */
const Plymouth: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <Diorama planes={D1} a={a} b={t.at('About half')} drift={110} />
    <Highlight text="PLYMOUTH · AUTUMN 1621" x={120} y={114} size={84} at={t.at('Plymouth')} seed={23} rot={-2} />
    <Slip text="first year: survived" x={150} y={280} size={56} rot={-3} at={t.at('first year') - 3} />
    <Slip text="barely." x={170} y={390} size={60} rot={-2} at={t.at('Barely') - 2} coral />
  </AbsoluteFill>
);

/** About half of the Mayflower's people dead: 102 marks, about half going dark. Quiet: no coral, no joke. */
const Half: React.FC<S> = ({t, a}) => {
  const g = useGFrame();
  const pal = usePal();
  const dead = t.at('dead');
  // about half, scattered: the 51 marks with the lowest seeded random rank go dark on "dead"
  const rank = Array.from({length: 102}, (_, i) => i).sort((p, q) => random(`h${p}`) - random(`h${q}`));
  const gone = (i: number) => rank.indexOf(i) < 51;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="everyone who came on the mayflower" x={540} y={170} size={52} rot={-2} at={t.at('people who came') - 3} color="#ffffff" />
      <Tally n={102} cols={17} x={580} y={330} gap={48} r={13} at={a + 2} per={0.12} color={(i) => (g >= dead && gone(i) ? 'rgba(237,231,220,0.16)' : pal.mark)} />
      <Note text="about half: dead" x={600} y={660} size={64} rot={-3} at={dead - 2} color="#ffffff" />
      <Note text="now the harvest is in" x={900} y={800} size={60} rot={-3} at={t.at('harvest') - 3} />
    </AbsoluteFill>
  );
};

/** "Mostly from one letter": the letter lands on the desk. */
const OneLetter: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <PrintSlot src={LETTER} x={1080} y={110} w={560} h={820} rot={2} at={a + 1} fit="cover" pos="50% 0%" note="Winslow's letter (Mourt's Relation, 1622)" />
    <Note text="how do we know what they ate?" x={140} y={260} size={52} rot={-3} at={t.at('how do we know') - 3} color="#ffffff" />
    <Highlight text="ONE LETTER" x={140} y={420} size={120} at={t.at('one letter')} seed={25} rot={-2} />
  </AbsoluteFill>
);

/** Edward Winslow: a bust cut-out (placeholder until the portrait and its mask exist). */
const Winslow: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Placeholder file={WINSLOW} x={1060} y={150} w={660} h={830} at={a + 1} note="bust cut-out (Cut, mask 'winslow'): coral tint + teal trace" />
    <Highlight text="EDWARD WINSLOW" x={120} y={130} size={92} at={t.at('Edward Winslow')} seed={27} rot={-2} />
    <Note text="wrote it home, december 1621" x={150} y={320} size={54} rot={-3} at={t.at('December') - 3} />
    <Note text="the whole meal: a few short lines" x={150} y={460} size={54} rot={-3} at={t.at('few short lines') - 3} color="#ffffff" />
    {hasFile(WINSLOW) && <Tag text="Edward Winslow, portrait, 1651 · Pilgrim Hall Museum" />}
  </AbsoluteFill>
);

/** The document read: the chapter's one guided pan. The camera glides down the page and lands on "fowling" as it is said; the
 *  swipe follows the line; a short glide on to "almost a week", then it holds to the hard cut. */
const Letter: React.FC<S> = ({t, a}) => {
  const real = hasFile(LETTER);
  const f = useCurrentFrame();
  const land = t.at('fowling');
  const keys: [number, {x: number; y: number; z: number; tilt: number}][] = [
    [a, {x: 860, y: 640, z: 0.6, tilt: 16}],
    [land, {x: 780, y: 1200, z: 1.0, tilt: 8}],
    [t.at('enough birds'), {x: 780, y: 1200, z: 1.0, tilt: 8}],
    [t.at('almost a week') - 4, {x: 760, y: 1330, z: 1.0, tilt: 8}],
  ];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <PageRead src={LETTER} size={LETTER_SIZE} keys={keys} seed="mourt" note="Winslow, 11 Dec 1621, in Mourt's Relation (1622)">
        {!real && <PageLine text="our governor sent four men on fowling," box={FOWL[0]} />}
        {!real && f >= t.at('In one day') - 3 && <PageLine text="as much fowl as ... served the company almost a week." box={WEEK[0]} />}
        <Swipe lines={FOWL} from={t.at('Four men')} to={t.end('fowling')} seed="fowl" />
        <Swipe lines={WEEK} from={t.at('enough birds')} to={t.end('almost a week')} seed="week" />
      </PageRead>
      <Slip text="fowling: hunting birds" x={1180} y={130} size={54} rot={-3} at={land + 4} />
      <Slip text="almost a week of birds" x={1180} y={860} size={54} rot={-2} at={t.at('almost a week') - 2} />
      <Tag text="Edward Winslow, letter of 11 December 1621 · Mourt's Relation, London, 1622" x={44} y={40} />
    </AbsoluteFill>
  );
};

/** Massasoit arrives with about ninety men: the colonists' ~50 marks, then ninety coral ones. No portrait exists. */
const Massasoit: React.FC<S> = ({t, a}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="MASSASOIT" x={120} y={112} size={100} at={t.at('Massasoit')} seed={29} rot={-2} />
      <Note text="the wampanoag leader" x={150} y={250} size={52} rot={-3} at={t.at('Wampanoag leader') - 3} />
      <Tally n={51} cols={9} x={190} y={440} gap={40} r={12} at={a + 3} per={0.05} color={() => pal.mark} />
      <Note text="the colonists (about 50)" x={160} y={720} size={44} rot={-2} at={a + 6} color="#ffffff" />
      <Tally n={90} cols={15} x={840} y={440} gap={40} r={12} at={t.at('ninety men')} per={0.12} color={() => pal.subject} />
      <Note text="about 90 men" x={860} y={720} size={62} rot={-3} at={t.at('ninety men') - 2} color={pal.subject} />
      <NoPhoto text="Massasoit (Ousamequin), Wampanoag · no portrait survives" at={t.at('Massasoit') + 6} y={900} x={160} />
    </AbsoluteFill>
  );
};

/** "came back with five deer": five deer land in a row, one after another. */
const Deer: React.FC<S> = ({t}) => {
  const five = t.at('five deer');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="FIVE DEER" x={130} y={110} size={110} at={five} seed={31} rot={-2} />
      {[0, 1, 2, 3, 4].map((i) => (
        <PropSlot key={i} name="tg_deer" x={150 + i * 330} y={400 + (i % 2) * 40} w={300} h={250} rot={i % 2 ? 2 : -2} at={five - 6 + i * 4} note="one deer" />
      ))}
      <Note text="a gift from the wampanoag" x={560} y={800} size={56} rot={-3} at={five + 18} color="#ffffff" />
    </AbsoluteFill>
  );
};

/** "Translation: birds. Maybe ducks, maybe geese, maybe turkey. And venison. A lot of venison." Two columns, the punchline held. */
const Translation: React.FC<S> = ({t}) => {
  const pal = usePal();
  const maybe = '#FF9F1C';
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="translation:" x={140} y={116} size={50} rot={-3} at={t.at('Translation') - 3} color="#ffffff" />
      <Highlight text="BIRDS" x={140} y={190} size={110} at={t.at('Translation: birds') + 10} seed={33} rot={-2} />
      <PropSlot name="tg_fowl" x={150} y={420} w={500} h={380} rot={-2} at={t.at('Translation: birds') + 10} note="wild fowl" />
      <Note text="ducks?" x={700} y={440} size={56} rot={-4} at={t.at('maybe ducks') - 3} color={maybe} />
      <Note text="geese?" x={700} y={560} size={56} rot={-3} at={t.at('maybe geese') - 3} color={maybe} />
      <Note text="turkey?" x={700} y={680} size={56} rot={-4} at={t.at('maybe turkey') - 3} color={maybe} />
      <Highlight text="VENISON" x={1120} y={190} size={110} at={t.at('And venison')} seed={35} rot={-2} />
      <PropSlot name="tg_deer" x={1140} y={420} w={560} h={380} rot={2} at={t.at('And venison')} note="the deer again" />
      <Note text="a lot of venison." x={1160} y={836} size={64} rot={-3} at={t.at('A lot of venison') - 3} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** Not a dinner guest: an alliance signed that spring; diplomacy, with food. Two sides of one line. */
const Alliance: React.FC<S> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const guest = t.at('dinner guest');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 958, top: 240, width: 4, height: 420, background: 'rgba(244,239,230,0.35)'}} />
      <div style={{position: 'absolute', left: 200, top: 270, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: pal.mark, opacity: g >= t.at('two sides') ? 1 : 0}}>PLYMOUTH COLONY</div>
      <div style={{position: 'absolute', left: 1080, top: 270, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: pal.subject, opacity: g >= t.at('two sides') ? 1 : 0}}>THE WAMPANOAG</div>
      <Note text="a dinner guest?" x={720} y={116} size={60} rot={-3} at={guest - 3} color="#ffffff" />
      <Strike x1={720} y1={176} x2={1210} y2={166} at={t.at('by the way')} bow={6} />
      <Highlight text="ALLIANCE" x={690} y={400} size={110} at={t.at('alliance')} seed={37} rot={-2} />
      <Note text="spring 1621" x={800} y={560} size={56} rot={-3} at={t.at('that spring') - 3} />
      <Highlight text="DIPLOMACY," after="WITH FOOD." x={260} y={760} size={100} at={t.at('diplomacy')} seed={39} rot={-2} />
    </AbsoluteFill>
  );
};

/** What wasn't there: pie, potatoes, cranberry sauce, each lands and is struck out. */
const NotThere: React.FC<S> = ({t}) => {
  const pie = t.at('Pie'), pot = t.at('No potatoes'), cran = t.at('No cranberry');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="what wasn't there?" x={140} y={118} size={56} rot={-3} at={t.at("What wasn't there") - 3} color="#ffffff" />
      <PropSlot name="tg_pie" x={150} y={290} w={460} h={340} rot={-2} at={pie - 1} note="pie" />
      <Note text="pie" x={180} y={660} size={60} rot={-3} at={pie - 2} />
      <Note text="no real flour" x={190} y={750} size={42} rot={-2} at={t.at('real flour') - 3} color="#ffffff" />
      <Note text="no butter" x={190} y={815} size={42} rot={-2} at={t.at('butter') - 3} color="#ffffff" />
      <Note text="no oven" x={190} y={880} size={42} rot={-2} at={t.at('oven') - 3} color="#ffffff" />
      <Strike x1={150} y1={300} x2={620} y2={630} at={t.at('oven') + 8} bow={14} width={10} />
      <PropSlot name="tg_potato" x={730} y={290} w={460} h={340} rot={2} at={pot - 1} note="potatoes" />
      <Note text="potatoes" x={760} y={660} size={60} rot={-3} at={pot - 2} />
      <Strike x1={730} y1={300} x2={1200} y2={630} at={pot + 9} bow={14} width={10} />
      <Cran at={-999} still={5} k={0.55} right={1800} bottom={630} fade land={cran - 1} />
      <Note text="cranberry sauce" x={1290} y={660} size={60} rot={-3} at={cran - 2} />
      <Strike x1={1300} y1={300} x2={1770} y2={630} at={t.end('No cranberry sauce') + 2} bow={14} width={10} />
    </AbsoluteFill>
  );
};

/** Nobody called it Thanksgiving, and for about 200 years almost nobody remembered it: a timeline 1621 → the 1840s. */
const Forgot: React.FC<S> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const tl = t.at('two hundred');
  const p = interpolate(g, [tl, tl + 14], [0, 1], clamp);
  const x0 = 200, x1 = 1700, y = 600;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="the strangest part:" x={140} y={116} size={52} rot={-3} at={t.at('strangest') - 3} color="#ffffff" />
      <Highlight text="“THANKSGIVING”" x={150} y={200} size={96} at={t.at('called it Thanksgiving')} seed={41} rot={-2} />
      <Strike x1={150} y1={265} x2={960} y2={238} at={t.end('called it Thanksgiving') + 2} bow={8} />
      <Note text="nobody called it that" x={1060} y={230} size={54} rot={-3} at={t.end('called it Thanksgiving')} color="#ffffff" />
      {g >= tl && (
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <line x1={x0} y1={y} x2={x0 + (x1 - x0) * p} y2={y} stroke={pal.mark} strokeWidth={6} strokeLinecap="round" />
          <circle cx={x0} cy={y} r={14} fill={pal.mark} stroke="#111" strokeWidth={4} />
          {p >= 1 && <circle cx={x1} cy={y} r={14} fill={pal.subject} stroke="#111" strokeWidth={4} />}
        </svg>
      )}
      {g >= tl && <div style={{position: 'absolute', left: x0 - 50, top: y + 34, fontFamily: JF.display, fontSize: 56, color: '#fff'}}>1621</div>}
      {g >= tl + 14 && <div style={{position: 'absolute', left: x1 - 90, top: y + 34, fontFamily: JF.display, fontSize: 56, color: pal.subject}}>1840s</div>}
      <Note text="about 200 years" x={760} y={470} size={60} rot={-3} at={tl + 2} />
      <Note text="almost nobody remembered it" x={560} y={760} size={64} rot={-3} at={t.at('nobody remembered') - 3} color="#ffffff" />
    </AbsoluteFill>
  );
};

/** The collage board: the eel is this chapter's piece; teal yarn with a "but" tag runs to the next slot, and the new job lands. */
const BOARD_EEL: [number, number] = [250, 290];
const Board: React.FC<S> = ({t, a}) => {
  const pin: [number, number] = [BOARD_EEL[0] + 250, BOARD_EEL[1] + 20];
  const next: [number, number] = [1520, 380];
  const job = t.at('new job');
  return (
    <AbsoluteFill>
      <Ctx.Provider value={BRAND}>
        <Defs />
        <BoardStage cam={[[a, 640, 500, 1.3], [a + 45, 900, 540, 1]]}>
          <div style={{position: 'absolute', left: next[0] - 190, top: next[1] - 30, width: 380, height: 300, border: '3px dashed rgba(47,224,196,0.35)'}} />
          <Land at={a + 4} kind="drop" x={BOARD_EEL[0]} y={BOARD_EEL[1]} r={-3}>
            <Img src={staticFile('img/flow/eel/eel_0000.png')} style={{width: 860, display: 'block', margin: '-150px -150px -150px -180px'}} />
          </Land>
          <APin at={a + 12} x={pin[0]} y={pin[1]} />
          <Land at={a + 16} kind="slide" x={BOARD_EEL[0] + 120} y={BOARD_EEL[1] + 330} r={-2}><Strip text="EELS · PLYMOUTH, 1621" seed="eel" /></Land>
          <AThreads lines={[{a: pin, b: next, at: t.at('feasting')}]} />
          <Land at={t.at('feasting') + 12} kind="slap" x={(pin[0] + next[0]) / 2 - 40} y={(pin[1] + next[1]) / 2 - 30} r={-4} z={60}>
            <div style={{background: '#ece6d8', padding: '2px 16px 6px', fontFamily: '"Nanum Pen Script", cursive', fontSize: 46, color: '#0f3e37'}}>but</div>
          </Land>
        </BoardStage>
      </Ctx.Provider>
      <Note text="a new job:" x={1130} y={640} size={52} rot={-3} at={job - 3} color="#ffffff" />
      <Highlight text="SHOWING OFF" x={1080} y={740} size={96} at={t.at('Showing off')} seed={43} rot={-3} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  // hard cuts, 1 frame before the word that starts the new idea (beatscope reads these keys)
  const c = {
    before: at('To understand') - 1,
    plymouth: at('Plymouth') - 1,
    half: at('About half') - 1,
    letter1: at('So how do we know') - 1,
    winslow: at('Edward Winslow') - 1,
    read: at('Four men') - 1,
    massasoit: at('Then Massasoit') - 1,
    deer: at('They went out') - 1,
    translation: at('Translation') - 1,
    alliance: at("Massasoit wasn't") - 1,
    notthere: at("What wasn't there") - 1,
    forgot: at("And here's the strangest") - 1,
    board: at('But when Americans') - 1,
  };
  const cuts: [number, React.ReactNode][] = [
    [0, <Before t={t} a={c.before} />],
    [c.plymouth, <Plymouth t={t} a={c.plymouth} />],
    [c.half, <Half t={t} a={c.half} />],
    [c.letter1, <OneLetter t={t} a={c.letter1} />],
    [c.winslow, <Winslow t={t} a={c.winslow} />],
    [c.read, <Letter t={t} a={c.read} />],
    [c.massasoit, <Massasoit t={t} a={c.massasoit} />],
    [c.deer, <Deer t={t} a={c.deer} />],
    [c.translation, <Translation t={t} a={c.translation} />],
    [c.alliance, <Alliance t={t} a={c.alliance} />],
    [c.notthere, <NotThere t={t} a={c.notthere} />],
    [c.forgot, <Forgot t={t} a={c.forgot} />],
    [c.board, <Board t={t} a={c.board} />],
  ];
  const scene = useScene(cuts);
  return (
    <>
      {scene}
      {/* no sound on cuts (the user, Nov 2026): cuts are silent; the voice and the music carry them. Slips tick on their own. */}
      {["wasn't turkey", 'Plymouth', 'one letter', 'Edward Winslow', 'Massasoit', 'five deer', 'And venison', 'alliance', 'diplomacy', 'called it Thanksgiving', 'Showing off'].map((p) => (
        <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.27} />
      ))}
      <Sfx at={at('Translation: birds') + 10} src="sfx/stamp.wav" volume={0.27} />
      {[0, 1, 2, 3, 4].map((i) => <Sfx key={`d${i}`} at={at('five deer') - 6 + i * 4} src="sfx/tick.wav" volume={0.4} />)}
      <Sfx at={c.board + 12} src="sfx/knock.wav" volume={0.32} />
      {['Thanksgiving dinner', 'people who came', 'dead', 'harvest', 'how do we know', 'December', 'few short lines', 'Wampanoag leader', 'ninety men', 'Translation',
        'maybe ducks', 'maybe geese', 'maybe turkey', 'A lot of venison', 'dinner guest', 'that spring', "What wasn't there", 'Pie', 'real flour', 'butter', 'oven',
        'No potatoes', 'No cranberry', 'strangest', 'nobody remembered', 'new job'].map((p) => <Sfx key={p} at={at(p) - 5} src={WRITE.src} volume={WRITE.volume} />)}
    </>
  );
};

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_1621.wav" lead={LEAD} music={[{src: 'music/g_world_outside.mp3', volume: bed('g_world_outside')}]}>
    <Body />
  </ChapterShell>
);
