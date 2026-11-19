// Chapter 3 · Showing off: the 1800s menu, turtle, the mince pie with meat in it.
// Scenes (anchor phrase → scene):
//   0                 Menu         the real 1870 Everett House bill of fare (oysters swiped), then our typeset card slaps over it
//                                  and builds course by course; Turtle Soup swiped coral on "turtle"
//   "shipped"         Dock         the turtle-dock diorama (placeholder): shipped up alive from the Caribbean
//   "Here's"          TurtlePan    full-screen guided pan down Simmons p. 20, landing on the quoted line as it is spoken
//                                  (swiped coral), held
//   "That's"          StepOne      the swiped line alone on the coral desk for "That's step one." (a 1.4 s flash)
//   "Then" (1st)      Steps        steps 2–4 on slips beside the page
//   "Then came"       Pie          mince pie state sheet whole → cut (placeholder), then beside the Simmons minced-pies page,
//                                  exploded into its ingredients, each swiped on the page and labelled as it is said
//   "So count"        Count        three identical beats: soup, platter, pie, each stamped MEAT the same way; held for "Maybe."
//   "But that"        Point        the menu card returns: turtle = ships, mince pie = hours; LOOK WHAT WE CAN AFFORD
//   "But not"         Board        the board (kit/tg_board): the turtle piece lands
import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch03_showing_off.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, Loop, Note, useGFrame} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {FullFrame} from '../kit/tg_placeholder';
import {ChBoard} from '../kit/tg_board';
import {Slip, Spot, Swipe, tornPoly} from '../kit/vox';
import type {PlaceholderInfo} from '../kit/tg_placeholder';
import {DeskScene} from '../kit/tg_desk';
import {AssetOr, MINCE, PageScrap, SIMMONS_P2, TAG_SIMMONS} from './ch34/parts';

const N = words as Narration;
export const CH03_FRAMES = chapterFrames(N, LEAD);

/** tg_parlor_waltz measured -16.1 LUFS (script/MUSIC.md); bed() 13 LU under the -18 LUFS voice (kit/levels.ts isn't ours to edit). */
const bedL = (lufs: number, gap = 13) => +Math.pow(10, (-18 - gap - lufs) / 20).toFixed(3);

export const PLACEHOLDERS: PlaceholderInfo[] = [
  {file: 'img/flow/d2_turtle_dock.png', what: 'Flow D2 turtle-dock diorama (or its planes), a coral turtle in a crate', scene: 'Dock', anchor: 'shipped',
    swap: 'drop the file in public/; AssetOr shows it full frame'},
  {file: 'img/flow/mince_pie_A.png', what: 'Flow S1 state A: the whole mince pie on a pewter plate (RGBA cut-out)', scene: 'Pie', anchor: 'Then came', swap: 'drop in public/'},
  {file: 'img/flow/mince_pie_B.png', what: 'Flow S1 state B: one wedge cut out, the meat filling showing', scene: 'Pie', anchor: 'had meat', swap: 'drop in public/'},
  {file: 'img/flow/mince_pie_C.png', what: 'Flow S1 state C: the ingredients laid out around the empty plate', scene: 'Pie', anchor: 'cattle feet',
    swap: 'drop in public/; re-place the five ingredient slips on the real pieces (PIE_LABELS)'},
];

// ------------------------------------------------------------------ the bill of fare
const MENU_W = 640;
const MENU_H = 860;
const ROWS = ['Oysters', 'Turtle Soup', 'Boiled Cod', 'Roast Turkey', 'Roast Goose', 'Mince Pie'];
const ROW_Y = (i: number) => 190 + i * 104;
const NUMS = ['I.', 'II.', 'III.', 'IV.', 'V.', 'VI.'];

/** A bill of fare on cream card (our own typesetting, no period source): numerals, then each dish writes on at its frame. */
const MenuCard: React.FC<{x: number; y: number; scale?: number; rot?: number; numAt: number; rowAt: number[]; swipeAt?: number; at?: number; children?: React.ReactNode}> = ({
  x, y, scale = 1, rot = 0, numAt, rowAt, swipeAt, at = -999, children,
}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = at < -900 ? 1 : interpolate(g, [at, at + 4, at + 7], [1.2, 0.97, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: MENU_W, height: MENU_H, transform: `rotate(${rot}deg) scale(${scale * k})`, transformOrigin: '0 0',
      filter: 'drop-shadow(0 24px 34px rgba(0,0,0,0.75))'}}>
      <div style={{position: 'absolute', inset: 0, background: '#ece6d8', clipPath: tornPoly('menu', MENU_W, MENU_H, 8)}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 46, textAlign: 'center', fontFamily: JF.heavy, fontWeight: 900, fontSize: 50, letterSpacing: 6, color: '#2a2622'}}>BILL OF FARE</div>
        <div style={{position: 'absolute', left: 90, right: 90, top: 128, height: 3, background: '#2a2622'}} />
        <div style={{position: 'absolute', left: 90, right: 90, top: 136, height: 1, background: '#2a2622'}} />
        {ROWS.map((r, i) => {
          const numOn = g >= numAt + i * 2.5;
          const p = interpolate(g, [rowAt[i], rowAt[i] + 8], [0, 1], clamp);
          return (
            <React.Fragment key={r}>
              {numOn && <div style={{position: 'absolute', left: 70, top: ROW_Y(i), width: 90, textAlign: 'right', fontFamily: JF.heavy, fontStyle: 'italic', fontSize: 38, color: '#6b6258'}}>{NUMS[i]}</div>}
              {numOn && <div style={{position: 'absolute', left: 190, top: ROW_Y(i) + 58, width: 360, height: 1, background: 'rgba(42,38,34,0.28)'}} />}
              {p > 0 && <div style={{position: 'absolute', left: 190, top: ROW_Y(i) - 6, fontFamily: JF.heavy, fontWeight: 900, fontSize: 50, color: '#1d1a17', whiteSpace: 'nowrap',
                clipPath: `inset(-30% ${(1 - p) * 100}% -30% 0)`}}>{r}</div>}
            </React.Fragment>
          );
        })}
        {swipeAt !== undefined && <Swipe lines={[[190, ROW_Y(1) - 2, 330, 60]]} from={swipeAt} to={swipeAt + 6} seed="ts" />}
      </div>
      {children}
    </div>
  );
};

const NEVER = 1e7;

/** A real bill of fare: the Everett House, Chicago, Thanksgiving 1870 (Newberry Library), its top half, "SOUP. Clam. Oysters." */
const EVERETT = {src: 'img/arch/everett-house-chicago-thanksgiving-dinner-menu-1870.jpg', size: [3412, 2552] as [number, number],
  scrap: [150, 250, 1300, 1000] as [number, number, number, number], oysters: [[755, 788, 118, 36]] as [number, number, number, number][]};
const TAG_EVERETT = 'Annual Thanksgiving Dinner, Everett House, Chicago, Nov. 24, 1870 · Newberry Library';

const Menu: React.FC<{t: TL; a?: number}> = ({t}) => {
  const g = useGFrame();
  // the real 1870 menu first (oysters swiped on it), then our typeset card slaps over it for the turtle, the grandest dinners' dish
  const card = t.at('grandest') - 3;
  const rowAt = [-999, t.at('was turtle') - 2, t.at('grandest') + 2, t.at('grandest') + 6, t.at('grandest') + 10, NEVER];
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('1800s') && <Highlight text="THE 1800s" x={120} y={120} size={110} at={t.at('1800s')} seed={31} rot={-2} />}
      <Note text="course after course" x={150} y={310} size={60} rot={-3} at={t.at('course after') - 3} />
      {g < card + 4 && (
        <PageScrap src={EVERETT.src} size={EVERETT.size} box={EVERETT.scrap} x={980} y={170} w={820} at={t.at('course after') - 2} rot={1.5} tag={TAG_EVERETT} seed="ev">
          <Swipe lines={EVERETT.oysters} from={t.at('oysters') - 1} to={t.at('oysters') + 6} seed="evo" />
        </PageScrap>
      )}
      <Note text="opened with oysters" x={170} y={430} size={48} rot={-2} at={t.at('oysters') - 3} color="#ffffff" out={card} />
      <MenuCard x={1040} y={110} rot={1.5} numAt={card} rowAt={rowAt} swipeAt={t.at('turtle')} at={card} />
      <Slip text="“we've arrived”" x={150} y={560} at={t.at('said') - 2} rot={-3} size={66} />
      <Slip text="green sea turtle" x={190} y={720} at={t.at('Green') - 2} rot={2} size={62} coral />
    </AbsoluteFill>
  );
};

/** Green sea turtles shipped up alive: the Flow turtle-dock diorama, full frame (placeholder until it lands). */
const Dock: React.FC<{t: TL; a?: number}> = ({t}) => (
  <AbsoluteFill style={{background: '#0d0c09'}}>
    <AssetOr src="img/flow/d2_turtle_dock.png" what="Flow D2 · turtle dock, 1800s: harbour haze, masts, crates, a coral turtle" x={0} y={0} w={1920} h={1080} />
    <Slip text="shipped up alive" x={150} y={760} at={t.at('alive') - 2} rot={-3} size={64} />
    <Slip text="from the Caribbean" x={200} y={870} at={t.at('Caribbean') - 2} rot={2} size={56} />
  </AbsoluteFill>
);

/** The guided pan: from the page top down Simmons p. 20 to the turtle line, landing as "About nine o'clock" is said. */
const TurtlePan: React.FC<{t: TL; a?: number}> = ({t}) => {
  const f = useCurrentFrame();
  const a = t.at("Here's"), land = t.at('About');
  return (
    <AbsoluteFill>
      <FullFrame src={SIMMONS_P2.src} what="Simmons p. 20" size={SIMMONS_P2.size} cam={[[a, {x: 1850, y: 1000, z: 1.28}], [land, {x: 1860, y: 3255, z: 1.6}]]}
        tag={TAG_SIMMONS}>
        <Spot size={SIMMONS_P2.size} boxes={SIMMONS_P2.quote} at={land} id="tp" dark={0.5} />
        <Swipe lines={SIMMONS_P2.quote} from={land - 1} to={t.end('save the blood')} seed="tq" />
      </FullFrame>
      {f < land && <Slip text="American Cookery · 1796" x={130} y={130} at={t.at('1796') - 2} rot={-3} size={60} />}
    </AbsoluteFill>
  );
};

/**
 * The "That's step one" hold as a hard cut to the swiped line alone on the desk: the coral flash (kit/tg_desk_map), 1.4 s,
 * then the hard cut to the steps on the black desk.
 */
const StepOne: React.FC<{t: TL; a?: number}> = () => (
  <AbsoluteFill>
    <DarkPaper />
    <PageScrap src={SIMMONS_P2.src} size={SIMMONS_P2.size} box={[780, 3130, 2150, 240]} x={260} y={450} w={1400} rot={-1.5} tag={TAG_SIMMONS} seed="s1">
      <Swipe lines={SIMMONS_P2.quote} from={-999} to={-998} seed="tq" />
    </PageScrap>
  </AbsoluteFill>
);

/** Steps 2-4, beside the page with the line still swiped. */
const Steps: React.FC<{t: TL; a?: number}> = ({t}) => {
  return (
    <AbsoluteFill>
      <DarkPaper />
      <PageScrap src={SIMMONS_P2.src} size={SIMMONS_P2.size} box={SIMMONS_P2.scrap} x={110} y={360} w={880} rot={-1.5} tag={TAG_SIMMONS} seed="st">
        <Swipe lines={SIMMONS_P2.quote} from={-999} to={-998} seed="tq" />
      </PageScrap>
      <Slip text="1. hang it up" x={1110} y={210} at={-999} rot={-2} size={60} />
      <Slip text="2. cleaned" x={1110} y={360} at={t.at('cleaned') - 2} rot={-3} size={60} />
      <Slip text="3. seasoned" x={1110} y={510} at={t.at('seasoned') - 2} rot={-2} size={60} />
      <Slip text="4. baked with Madeira wine" x={1110} y={660} at={t.at('Madeira') - 2} rot={-3} size={60} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the mince pie
/** Ingredient labels around the exploded pie: [text, word, x, y] on screen, for the placeholder layout of state C. */
const PIE_LABELS: [string, string, number, number][] = [
  ['cattle feet', 'cattle feet', 1060, 230],
  ['beef suet', 'beef suet', 1480, 300],
  ['wine', 'and wine', 1620, 560],
  ['apples', 'apples', 1080, 790],
  ['raisins', 'raisins', 1450, 840],
];

const Pie: React.FC<{t: TL; a?: number}> = ({t}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const mince = t.at('Mince');
  const px = interpolate(f, [mince, mince + 12], [760, 1020], {...clamp, easing: (p) => 1 - Math.pow(1 - p, 3)});
  const st = g >= t.at('cattle feet') - 1 ? 'C' : g >= t.at('had meat') ? 'B' : 'A';
  const what = {A: 'state A · the whole pie', B: 'state B · a wedge cut out', C: 'state C · the ingredients apart'}[st];
  const P = MINCE;
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('dessert') && g < mince && <Highlight text="DESSERT" x={120} y={110} size={104} at={t.at('dessert')} seed={33} rot={-2} />}
      {g >= mince && <Highlight text="MINCE PIE" x={110} y={110} size={104} at={mince} seed={35} rot={-2} />}
      <AssetOr key={st} src={`img/flow/mince_pie_${st}.png`} what={`Flow S1 mince pie, ${what}`} x={px} y={190} w={800} h={720} />
      {st === 'B' && <Slip text="meat" x={px + 520} y={640} at={t.at('meat in it') + 3} rot={-4} size={66} coral />}
      <PageScrap src={P.src} size={P.size} box={P.scrap} x={90} y={350} w={860} at={mince + 2} rot={-1.5} tag={TAG_SIMMONS} seed="mp">
        <Swipe lines={[P.feet]} from={t.at('cattle feet') - 1} to={t.at('cattle feet') + 7} seed="m1" />
        <Swipe lines={P.suet} from={t.at('beef suet') - 1} to={t.at('beef suet') + 8} seed="m2" />
        <Swipe lines={[P.wine]} from={t.at('and wine') - 1} to={t.at('and wine') + 7} seed="m3" />
        <Swipe lines={[P.apples]} from={t.at('apples') - 1} to={t.at('apples') + 6} seed="m4" />
        <Swipe lines={[P.raisins]} from={t.at('raisins') - 1} to={t.at('raisins') + 7} seed="m5" />
      </PageScrap>
      {PIE_LABELS.map(([text, w, x, y]) => <Slip key={text} text={text} x={x} y={y} at={t.at(w) - 2} rot={random(text) * 6 - 3} size={54} />)}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the count
const CORAL = '#FF6F61';
const TEAL = '#2FE0C4';
/** Teal line icons, drawn on over 10 frames: a tureen, a platter with a roast, a pie with a wedge out. */
const Icon: React.FC<{kind: 'soup' | 'platter' | 'pie'; at: number}> = ({kind, at}) => {
  const g = useGFrame();
  const p = interpolate(g, [at, at + 10], [0, 1], clamp);
  const d = {
    soup: ['M60,120 Q60,210 170,210 Q280,210 280,120 Z', 'M40,120 L300,120', 'M110,120 Q170,60 230,120', 'M160,72 Q170,56 180,72', 'M120,210 L110,236 L230,236 L220,210'],
    platter: ['M30,190 Q170,250 310,190 Q170,150 30,190 Z', 'M90,182 Q100,110 170,104 Q240,110 250,182', 'M140,118 Q150,150 140,176', 'M200,118 Q190,150 200,176'],
    pie: ['M40,170 Q170,240 300,170', 'M40,170 Q40,120 170,108 Q300,120 300,170', 'M170,108 L210,186 L300,170', 'M90,150 L110,140 M140,136 L160,128 M230,140 L250,150'],
  }[kind];
  return (
    <svg width={340} height={260} style={{position: 'absolute', left: 40, top: 70, overflow: 'visible'}}>
      {d.map((s, i) => <path key={i} d={s} fill="none" stroke="#0f6e62" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1}
        strokeDashoffset={1 - Math.max(0, Math.min(1, p * 1.5 - i * 0.12))} />)}
    </svg>
  );
};

/** One beat of the count, identical each time: the card drops on "Meat", the icon draws, MEAT stamps in on the next word. */
const CountCard: React.FC<{x: number; at: number; label: string; kind: 'soup' | 'platter' | 'pie'}> = ({x, at, label, kind}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 4, at + 7], [1.25, 0.97, 1], clamp);
  const s = at + 6;
  const ks = interpolate(g, [s, s + 3, s + 6], [1.8, 0.95, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: 270, width: 440, height: 560, transform: `rotate(-1.5deg) scale(${k})`, transformOrigin: '50% 60%', filter: 'drop-shadow(0 22px 30px rgba(0,0,0,0.7))'}}>
      <div style={{position: 'absolute', inset: 0, background: '#ece6d8', clipPath: tornPoly(`cc${kind}`, 440, 560, 7)}}>
        <Icon kind={kind} at={at + 2} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 340, textAlign: 'center', fontFamily: '"Nanum Pen Script", cursive', fontSize: 74, color: '#0f3e37'}}>{label}</div>
      </div>
      {g >= s && (
        <div style={{position: 'absolute', left: 70, top: 430, transform: `rotate(-8deg) scale(${ks})`, border: `9px solid ${CORAL}`, padding: '0 26px', fontFamily: JF.sans, fontWeight: 800,
          fontSize: 76, letterSpacing: 6, color: CORAL, lineHeight: 1.1, opacity: interpolate(g, [s, s + 2], [0, 1], clamp), background: 'rgba(236,230,216,0.6)'}}>MEAT</div>
      )}
    </div>
  );
};

const COUNT: [string, string, 'soup' | 'platter' | 'pie', number][] = [
  ['Meat in the soup', 'the soup', 'soup', 170],
  ['Meat on the platter', 'the platter', 'platter', 740],
  ['Meat in the pie', 'the pie', 'pie', 1310],
];

const Count: React.FC<{t: TL; a?: number}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="count it out:" x={150} y={110} size={60} rot={-3} at={t.at('count') - 3} color="#ffffff" />
    {COUNT.map(([ph, label, kind, x]) => <CountCard key={kind} x={x} at={t.at(ph) - 1} label={label} kind={kind} />)}
  </AbsoluteFill>
);

/** The point: the menu card again; what each dish cost. */
const Point: React.FC<{t: TL; a?: number}> = ({t}) => {
  const g = useGFrame();
  const s = 0.86;
  const rowAt = [-999, -999, -999, -999, -999, t.at('mince pie meant') - 2];
  // screen positions of the Turtle Soup and Mince Pie rows (card at 140,110, scale s, rotation small enough to ignore here)
  const rowY = (i: number) => 110 + (ROW_Y(i) + 26) * s;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <MenuCard x={140} y={100} scale={s} rot={-1} numAt={-999} rowAt={rowAt} />
      <Note text="the point:" x={860} y={150} size={58} rot={-3} at={t.at('point') - 3} color="#ffffff" />
      <Loop cx={140 + 330 * s} cy={rowY(1)} rx={210} ry={52} at={t.at('turtle meant')} seed={37} tilt={-2} />
      <Arrow x1={140 + 560 * s} y1={rowY(1)} x2={1010} y2={340} bow={-30} at={t.at('turtle meant') + 4} />
      <Slip text="= ships" x={1030} y={290} at={t.at('ships') - 2} rot={-3} size={70} />
      <Loop cx={140 + 320 * s} cy={rowY(5)} rx={200} ry={52} at={t.at('mince pie meant') + 6} seed={39} tilt={2} />
      <Arrow x1={140 + 560 * s} y1={rowY(5)} x2={1010} y2={570} bow={30} at={t.at('mince pie meant') + 9} />
      <Slip text="= hours" x={1030} y={520} at={t.at('hours') - 2} rot={-2} size={70} />
      {g >= t.at('look what') && <Highlight text="LOOK WHAT WE CAN AFFORD" x={720} y={800} size={64} at={t.at('look what')} seed={41} rot={-2} />}
    </AbsoluteFill>
  );
};

const Board: React.FC<{t: TL; a?: number}> = ({t}) => <ChBoard ch={3} at={t.at('But not') + 2} ghost={{id: 'mock', at: t.at('afford a turtle') + 4}} />;

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c: Record<string, number> = {
    menu: 0,
    dock: at('shipped') - 1,
    turtlePan: at("Here's") - 1,
    stepOne: at("That's") - 1,
    steps: at('Then') - 1,
    pie: at('Then came') - 1,
    count: at('So count') - 1,
    point: at('But that') - 1,
    board: at('But not') - 1,
  };
  const cuts: [number, React.ReactNode][] = [
    [c.menu, <Menu t={t} a={c.menu} />],
    [c.dock, <Dock t={t} a={c.dock} />],
    [c.turtlePan, <TurtlePan t={t} a={c.turtlePan} />],
    [c.stepOne, <StepOne t={t} a={c.stepOne} />],
    [c.steps, <Steps t={t} a={c.steps} />],
    [c.pie, <Pie t={t} a={c.pie} />],
    [c.count, <Count t={t} a={c.count} />],
    [c.point, <Point t={t} a={c.point} />],
    [c.board, <Board t={t} a={c.board} />],
  ];
  const scene = useScene(cuts);
  return (
    <>
      <DeskScene ch="ch03" cuts={c} t={t}>{scene}</DeskScene>
      {/* silent cuts; a stamp per tape title and per MEAT stamp; the marker (nearly silent) per note */}
      {['1800s', 'dessert', 'Mince', 'look what'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.27} />)}
      {COUNT.map(([ph]) => <Sfx key={ph} at={at(ph) + 5} src="sfx/stamp.wav" volume={0.3} />)}
      {['course after', 'count', 'point'].map((c) => <Sfx key={c} at={at(c) - 5} src={WRITE.src} volume={WRITE.volume} />)}
    </>
  );
};

export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch03_showing_off.wav" lead={LEAD} music={[{src: 'music/tg_parlor_waltz.mp3', volume: bedL(-16.1)}]}>
    <Body />
  </ChapterShell>
);
