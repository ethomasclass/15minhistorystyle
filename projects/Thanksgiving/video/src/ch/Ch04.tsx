// Chapter 4 · Mock turtle: the fake, and how it outlasted the real thing.
// Scenes (anchor phrase → scene):
//   0                       Pair (empty)  THE REAL THING (the Simmons turtle recipe) beside an empty FAKE slot
//   "Flip"                  Book          the 1796 pages (pp. 21-22) slap down; the recipe's title as a quote
//   "You take"              Recipe        Simmons p. 22, "To dress a Calve's Head. Turtle fashion.": "The head and feet" and
//                                         "open the head, taking the brains" swiped as they are said
//   "And you cook"          Morph         Flow M1 calf's head → turtle tureen (placeholder), finishing on "like turtle"
//   "Mock turtle" (1)       MockFlash     a cut-in on the fake as the MOCK tape slaps on "Mock" (the coral desk flash, ~1.9 s)
//   "It's going"            Pair (mock)   real vs mock again, black desk, the tape on; cheap, always more of it
//   "Caribbean green"       Decline       100 drawn turtles; the stepped number counts to −97% as 97 go grey; 3 stay coral
//   "Mock turtle" (2)       Pair (late)   the real thing faded, the fake still taped: 1796 … 1884; held on "The fake outlasted"
//   "But one"               Board         the board (kit/tg_board): the calf's head piece lands with its MOCK tag
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch04_mock_turtle.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Loop, Note, useGFrame} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {bed} from '../kit/levels';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, Quote, type TL, useScene} from '../kit/shell';
import {MockTape} from '../kit/tg_mock';
import {type PlaceholderInfo, TgPrint} from '../kit/tg_placeholder';
import {ChBoard} from '../kit/tg_board';
import {CutIn, DeskScene, useMarks} from '../kit/tg_desk';
import {camAt, Sheet, Slip, Swipe} from '../kit/vox';
import {BOSTON, FrameSeqOr, PageScrap, SIMMONS_P2, SIMMONS_P22, TAG_SIMMONS} from './ch34/parts';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);

export const PLACEHOLDERS: PlaceholderInfo[] = [
  {file: 'img/flow/m1/m1_0000.png … m1_0035.png', what: "Flow M1 mock morph: a boiled calf's head on a platter → a Victorian tureen with a turtle lid (RGBA, 12/s)",
    scene: 'Morph', anchor: 'And you cook', swap: 'drop the frames in public/img/flow/m1/; FrameSeqOr plays them (set n to the real count)'},
];


// ------------------------------------------------------------------ real vs mock
const SCRAP_L = {x: 110, y: 400, w: 760};
const SCRAP_R = {x: 1060, y: 290, w: 720};
const TAPE: [number, number] = [1420, 470];

/** `solo`: the fake side only (the MOCK flash's cut-in, so nothing is cropped at the frame edge). */
const Pair: React.FC<{mode: 'empty' | 'mock'; tapeAt?: number; fadeAt?: number; solo?: boolean; children?: React.ReactNode}> = ({mode, tapeAt = -999, fadeAt = 1e7, solo, children}) => {
  const g = useGFrame();
  const fade = interpolate(g, [fadeAt, fadeAt + 6], [1, 0.32], clamp);
  const mk = useMarks();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 1080, top: 170, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: mk.coral}}>THE FAKE</div>
      {!solo && <>
      <div style={{position: 'absolute', left: 958, top: 120, width: 4, height: 840, background: 'rgba(244,239,230,0.35)'}} />
      <div style={{position: 'absolute', left: 140, top: 170, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: mk.teal}}>THE REAL THING</div>
      <PageScrap src={SIMMONS_P2.src} size={SIMMONS_P2.size} box={SIMMONS_P2.scrap} x={SCRAP_L.x} y={SCRAP_L.y} w={SCRAP_L.w} rot={-1.5} opacity={fade} seed="pl" />
      <div style={{position: 'absolute', left: SCRAP_L.x, top: SCRAP_L.y + 220, fontFamily: JF.mono, fontSize: 16, letterSpacing: 1, color: 'rgba(244,239,230,0.75)', opacity: fade}}>
        TURTLE · SIMMONS, AMERICAN COOKERY, 1796 · LOC / IA
      </div>
      </>}
      {mode === 'empty' ? (
        <div style={{position: 'absolute', left: SCRAP_R.x, top: SCRAP_R.y, width: SCRAP_R.w, height: 400, border: '4px dashed rgba(244,239,230,0.35)', boxSizing: 'border-box',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: JF.display, fontSize: 180, color: 'rgba(244,239,230,0.35)'}}>?</div>
      ) : (
        <>
          <PageScrap src={BOSTON.src} size={BOSTON.size} box={BOSTON.scrap} x={SCRAP_R.x} y={SCRAP_R.y} w={SCRAP_R.w} rot={1.5} seed="pr" />
          <div style={{position: 'absolute', left: SCRAP_R.x, top: SCRAP_R.y + 420, fontFamily: JF.mono, fontSize: 16, letterSpacing: 1, color: 'rgba(244,239,230,0.75)'}}>
            {"MOCK TURTLE · MRS. LINCOLN'S BOSTON COOK BOOK, 1884 · WELLCOME / IA"}
          </div>
          <MockTape x={TAPE[0]} y={TAPE[1]} at={tapeAt} />
        </>
      )}
      {children}
    </AbsoluteFill>
  );
};

const PairEmpty: React.FC<{t: TL; a?: number}> = ({t}) => (
  <Pair mode="empty">
    <Note text="faked it" x={1150} y={760} size={70} rot={-4} at={t.at('faked') - 3} />
  </Pair>
);

/** "Flip a few pages": the two 1796 pages land, then the recipe's title over them. */
const Book: React.FC<{t: TL; a?: number}> = ({t}) => {
  const g = useGFrame();
  const q = t.at('To dress');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <TgPrint src={SIMMONS_P2.p21} x={380} y={130} w={520} h={746} at={t.at('Flip') - 1} rot={-3} />
      <TgPrint src={SIMMONS_P22.src} x={1000} y={150} w={520} h={707} at={t.at('few pages') - 1} rot={2} />
      <AbsoluteFill style={{background: 'rgba(13,12,9,0.74)', opacity: interpolate(g, [q - 2, q + 4], [0, 1], clamp)}} />
      <Quote text="To dress a Calve’s Head, Turtle fashion." at={q - 1} x={160} y={400} w={1600} size={84} who="Amelia Simmons, American Cookery, 1796" />
      <div style={{position: 'absolute', left: 44, top: 1030, fontFamily: JF.mono, fontSize: 18, letterSpacing: 1, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase',
        textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>{TAG_SIMMONS}</div>
    </AbsoluteFill>
  );
};

/** The 1796 recipe itself (Simmons p. 22): the camera leans in on it; the head, then the brains, swiped as they are said. */
const Recipe: React.FC<{t: TL; a?: number}> = ({t}) => {
  const f = useCurrentFrame();
  const a = t.at('You take');
  const P = SIMMONS_P22;
  const cam = camAt([[a, {x: 1780, y: 1420, z: 0.6, tilt: 12}], [t.at('take out the brains'), {x: 1700, y: 1540, z: 0.66, tilt: 12}]], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src={P.src} size={P.size} cam={cam} seed="ch" filter="grayscale(1) sepia(0.15) contrast(1.12) brightness(0.85)">
        <Swipe lines={[P.head]} from={t.at("calf's head") - 1} to={t.end('You open it up') + 2} seed="b1" />
        <Swipe lines={[P.brains]} from={t.at('take out the brains') - 1} to={t.end('the brains') + 4} seed="b2" />
      </Sheet>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,0.6) 100%), linear-gradient(transparent 85%, rgba(0,0,0,0.55) 100%)'}} />
      <div style={{position: 'absolute', left: 44, top: 1030, fontFamily: JF.mono, fontSize: 18, letterSpacing: 1, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase',
        textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>{`${TAG_SIMMONS} · p. 22`}</div>
    </AbsoluteFill>
  );
};

/** Morph #1: the calf's head cooks into turtle (Flow first/last-frame morph, played as frames). */
const Morph: React.FC<{t: TL; a?: number}> = ({t}) => {
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FrameSeqOr base="img/flow/m1/m1" n={36} what="Flow M1 · calf's head → turtle-soup tureen (mock morph #1)" x={460} y={140} w={1000} h={560}
        from={t.at('And you cook') + 3} to={t.at('like turtle') + 4} labels={["calf's head", 'turtle tureen']} />
      <Slip text="more or less" x={1150} y={790} at={t.at('more or less') - 2} rot={-3} size={62} />
    </AbsoluteFill>
  );
};

const PairMock: React.FC<{t: TL; a?: number; solo?: boolean}> = ({t, solo}) => {
  return (
    <Pair mode="mock" tapeAt={t.at('Mock turtle')} solo={solo}>
      <Loop cx={TAPE[0]} cy={TAPE[1]} rx={250} ry={110} at={t.at('Remember')} seed={43} tilt={-8} />
      <Slip text="cheap" x={1080} y={790} at={t.at('cheap') - 2} rot={-3} size={62} />
      <Slip text="always more of it" x={1290} y={800} at={t.at('always more') - 2} rot={2} size={62} />
    </Pair>
  );
};

// ------------------------------------------------------------------ the decline
/** A small drawn turtle (top view), 60 x 46. */
const TurtleGlyph: React.FC<{x: number; y: number; color: string; k: number}> = ({x, y, color, k}) => (
  <svg width={60} height={46} viewBox="0 0 60 46" style={{position: 'absolute', left: x, top: y, transform: `scale(${k})`, overflow: 'visible'}}>
    <g fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx={30} cy={23} rx={16} ry={13} fill={color} fillOpacity={0.28} />
      <circle cx={51} cy={23} r={5} />
      <path d="M22,11 L13,3 M38,11 L44,4 M22,35 L13,43 M38,35 L44,42 M14,23 L7,23" />
    </g>
  </svg>
);

const GRID = {x: 1010, y: 230, gap: 76};

const Decline: React.FC<{t: TL; a?: number}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('Caribbean green');
  const c0 = t.at('fell by'), c1 = t.at('percent') + 3;
  const v = Math.round(interpolate(g, [c0, c1], [0, 97], clamp));
  const done = g >= c1;
  const {teal: TEAL, coral: CORAL} = useMarks();
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= a && <Highlight text="GREEN SEA TURTLES" x={120} y={114} size={80} at={a} seed={45} rot={-2} />}
      {Array.from({length: 100}, (_, i) => {
        const ai = a + 2 + (i % 10) * 0.6 + Math.floor(i / 10) * 0.6;
        if (g < ai) return null;
        const k = interpolate(g, [ai, ai + 2.5, ai + 5], [0, 1.2, 1], clamp);
        const color = i < 97 ? (i < v ? 'rgba(244,239,230,0.22)' : TEAL) : done ? CORAL : TEAL;
        return <TurtleGlyph key={i} x={GRID.x + (i % 10) * GRID.gap} y={GRID.y + Math.floor(i / 10) * GRID.gap} color={color} k={k} />;
      })}
      {g >= c0 && (
        <div style={{position: 'absolute', left: 120, top: 330, fontFamily: JF.display, fontSize: 230, lineHeight: 1, color: '#f4efe6', whiteSpace: 'nowrap',
          textShadow: '0 6px 22px rgba(0,0,0,0.8)'}}>{`−${v}%`}</div>
      )}
      {g >= c0 && (
        <div style={{position: 'absolute', left: 130, top: 600, fontFamily: JF.mono, fontSize: 24, letterSpacing: 2, lineHeight: 1.5, color: 'rgba(244,239,230,0.8)'}}>
          CARIBBEAN GREEN TURTLES<br />ESTIMATED DECLINE, BY THE MID-1900S
        </div>
      )}
      <Slip text="off the menu" x={140} y={800} at={t.at('disappeared') - 2} rot={-3} size={64} />
      <div style={{position: 'absolute', left: 44, top: 1030, fontFamily: JF.mono, fontSize: 18, letterSpacing: 1, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase',
        textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>Estimate reported by phys.org (2018) · Oceanic Society</div>
    </AbsoluteFill>
  );
};

const PairLate: React.FC<{t: TL; a?: number}> = ({t}) => {
  return (
    <Pair mode="mock" fadeAt={t.at('Mock turtle', 2)}>
      <Slip text="in cookbooks: 1796" x={1080} y={790} at={t.at('hung around') - 2} rot={-3} size={58} />
      <Slip text="… 1884" x={1560} y={800} at={t.at('generations') - 2} rot={2} size={58} />
    </Pair>
  );
};

const Board: React.FC<{t: TL; a?: number}> = ({t}) => <ChBoard ch={4} at={t.at('But one') + 2} pull={34} ghost={{id: 'hale', at: t.at('one woman') + 2}} />;

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {
    pairEmpty: 0,
    book: at('Flip') - 1,
    recipe: at('You take') - 1,
    morph: at('And you cook') - 1,
    mockFlash: at('Mock turtle') - 1,
    pairMock: at("It's going") - 1,
    decline: at('Caribbean green') - 1,
    pairLate: at('Mock turtle', 2) - 1,
    board: at('But one') - 1,
  };
  const cuts: [number, React.ReactNode][] = [
    [c.pairEmpty, <PairEmpty t={t} a={c.pairEmpty} />],
    [c.book, <Book t={t} a={c.book} />],
    [c.recipe, <Recipe t={t} a={c.recipe} />],
    [c.morph, <Morph t={t} a={c.morph} />],
    [c.mockFlash, <CutIn x={1420} y={470} z={1.3}><PairMock t={t} a={c.mockFlash} solo /></CutIn>],
    [c.pairMock, <PairMock t={t} a={c.pairMock} />],
    [c.decline, <Decline t={t} a={c.decline} />],
    [c.pairLate, <PairLate t={t} a={c.pairLate} />],
    [c.board, <Board t={t} a={c.board} />],
  ];
  const scene = useScene(cuts);
  return (
    <>
      <DeskScene ch="ch04" cuts={c} t={t}>{scene}</DeskScene>
      {/* silent cuts; the stamp on the MOCK tape and the tape title; the marker (nearly silent) per note */}
      <Sfx at={at('Mock turtle')} src="sfx/stamp.wav" volume={0.3} />
      <Sfx at={at('Caribbean green')} src="sfx/stamp.wav" volume={0.27} />
      <Sfx at={at('faked') - 5} src={WRITE.src} volume={WRITE.volume} />
      {/* the counter steps: a soft tick on its last step */}
      <Sfx at={at('percent') + 3} src="sfx/tick.wav" volume={0.4} />
    </>
  );
};

export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch04_mock_turtle.wav" lead={LEAD} baton="Hale Writes the Menu" music={[{src: 'music/tg_parlor_waltz.mp3', volume: bed('tg_parlor_waltz')}]}>
    <Body />
  </ChapterShell>
);
