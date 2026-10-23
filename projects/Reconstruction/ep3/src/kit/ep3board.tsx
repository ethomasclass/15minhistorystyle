// The series board in Episode 3 (techniques/collage_board.md, ../../WALL.md). It opens as Episode 2 left it
// (src/kit/ep2board.tsx, which already carries Episode 1) and grows a third row and the PROTECTION column's lower half.
//
//   <SeriesBoard ch={5} from={cut frame} at={frame the first piece lands} />
//
// Layout (board px; Episodes 1–2 fill 0..2400 x 0..1940):
//   row 3, left      the poll tax scrap (ch09), Caldwell's last words (★ ch01, strung from Ep 2's convention roll)
//   row 3, centre    the 1876 result (ch08) and the dashed "deal"
//   LAND             the Freedman's Bank check (ch06), right of the sharecropping pieces
//   PROTECTION       down the right: the night (ch02, where Ep 2's "part 3 →" string ends), the proclamation (ch03),
//                    Colfax and Cruikshank (ch04, its string to EQUAL PROTECTION cut), Mississippi 1875 (★ ch07)
//   top right        TIRED (ch05), outside the columns, strung to the PROTECTION header
// The column names change: PROTECTION tears in ch07 and comes down in ch10; LAND is struck and LAW stamped
// "ON PAPER" in ch10; VOTELESS is written back in on the three words in ch09.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from './common';
import {useGFrame} from './Kit';
import {BRAND, BoardSounds, type BoardKey, BoardStage, Ctx, Defs, HAND, Land, type LandKind, Photo, Scrap, Stamp, Sticky, Strip, WornLogo} from './board';
import {COLUMNS as C12, PIECES as P12, PINS as N12, THREADS as T12} from './ep2board';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const W = 'img/wall/';
const CORAL_LABEL = '#f3c6bf';

type Ctx_ = {hl: number; q: number; labelP: number; strike: number; mark: number; write: number; landStrike: number; tear: number};
type Piece = {id: string; wh?: [number, number]; ch: number; dt: number; kind: LandKind; x: number; y: number; r?: number; z?: number; el: (c: Ctx_) => React.ReactNode};
type BPin = {ch: number; dt: number; x: number; y: number; coral?: boolean};
type Thread = {ch: number; dt: number; a: [number, number]; b: [number, number]; tag?: string; tagT?: number; dashed?: boolean; under?: boolean; cut?: boolean};

// Episode 3's pieces (ch = this episode's chapter). Episodes 1–2 come from their tables, already landed.
const P3: Piece[] = [
  // ch01 ★ Caldwell's last words, under his name on the convention roll
  {id: 'coward', wh: [520, 109], ch: 1, dt: 0, kind: 'drop', x: 440, y: 2010, r: -1.5, el: () => <Photo src={W + 'cr_coward.png'} w={520} />},
  {id: 'cowardStrip', wh: [470, 38], ch: 1, dt: 12, kind: 'slide', x: 470, y: 2136, r: 1.5, el: () => <Strip text="“NEVER SAY YOU KILLED A COWARD”" seed="cw" size={22} bg={CORAL_LABEL} />},
  // ch02 the night (PROTECTION, where Ep 2's "part 3 →" string ends)
  {id: 'night', wh: [380, 282], ch: 2, dt: 0, kind: 'drop', x: 2330, y: 1000, r: 2, el: () => <Photo src={W + 'cr_night.png'} w={380} />},
  {id: 'nightStrip', wh: [300, 38], ch: 2, dt: 12, kind: 'slide', x: 2340, y: 1296, r: -2, el: () => <Strip text="THE NIGHT · 1866–71" seed="nt" size={22} />},
  // ch03 protection works: the check mark by PROTECTION ("On the card, protection gets its check mark"; land `at` on
  // "check"), then Grant's proclamation and the Klan broken. The check falls off when the header tears (ch07).
  {id: 'check', wh: [90, 90], ch: 3, dt: 0, kind: 'fade', x: 2450, y: 4, z: 9, el: (c) => (
    <div style={{fontFamily: HAND, fontSize: 96, color: BRAND.thread, lineHeight: 1, opacity: 1 - 0.75 * c.tear, transform: `rotate(${18 * c.tear}deg) translateY(${40 * c.tear}px)`}}>✔</div>
  )},
  {id: 'proclamation', wh: [300, 250], ch: 3, dt: 30, kind: 'drop', x: 2800, y: 990, r: -2, el: () => <Photo src={W + 'cr_proclamation.png'} w={300} />},
  {id: 'proclamationStrip', wh: [330, 36], ch: 3, dt: 42, kind: 'slide', x: 2780, y: 1256, r: 2, el: () => <Strip text="PROTECTION WORKS · 1871" seed="pw" size={20} />},
  {id: 'broken', wh: [170, 157], ch: 3, dt: 60, kind: 'slap', x: 3150, y: 1080, r: 4, el: () => <Sticky text="Klan broken" w={170} size={42} />},
  // ch04 Colfax, and the ruling that let it go
  {id: 'colfax', wh: [380, 285], ch: 4, dt: 0, kind: 'drop', x: 2330, y: 1420, r: -1.5, el: () => <Photo src={W + 'cr_colfax.png'} w={380} />},
  {id: 'colfaxStrip', wh: [400, 36], ch: 4, dt: 12, kind: 'slide', x: 2330, y: 1712, r: 1.5, el: () => <Strip text="Colfax, Louisiana · Easter 1873" seed="cf" size={20} />},
  {id: 'cruikshank', wh: [360, 240], ch: 4, dt: 24, kind: 'drop', x: 2790, y: 1440, r: 1.5, el: () => (
    <Scrap text="The fourteenth amendment prohibits a State from denying … the equal protection of the laws; but this … does not … add any thing to the rights which one citizen has … against another." mark="against another" w={360} seed="ck" size={21} />
  )},
  {id: 'cruikshankStrip', wh: [340, 36], ch: 4, dt: 34, kind: 'slide', x: 2800, y: 1404, r: -2, el: () => <Strip text="U.S. v. Cruikshank · 1876" seed="ck2" size={20} />},
  {id: 'unpunished', wh: [300, 50], ch: 4, dt: 56, kind: 'stamp', x: 2360, y: 1600, r: -6, z: 6, el: () => <Stamp text="NOBODY PUNISHED" size={28} />},
  // ch05 tired: outside the columns, pulling on PROTECTION
  {id: 'panic', wh: [250, 245], ch: 5, dt: 0, kind: 'drop', x: 2700, y: 150, r: 3, el: () => <Photo src={W + 'cr_panic.png'} w={250} />},
  {id: 'panicStrip', wh: [400, 36], ch: 5, dt: 12, kind: 'slide', x: 2660, y: 412, r: -2, el: () => <Strip text="Panic of 1873 · Whiskey Ring" seed="pn" size={20} />},
  {id: 'tired', wh: [180, 166], ch: 5, dt: 30, kind: 'slap', x: 3010, y: 250, r: -5, el: () => <Sticky text="TIRED" w={180} size={54} />},
  // ch06 the bank (LAND)
  {id: 'check', wh: [330, 146], ch: 6, dt: 0, kind: 'drop', x: 1940, y: 1345, r: 2, el: () => <Photo src={W + 'cr_check.png'} w={330} />},
  {id: 'checkStrip', wh: [310, 36], ch: 6, dt: 12, kind: 'slide', x: 1950, y: 1500, r: -2, el: () => <Strip text="Freedman's Bank · 1874" seed="fbk" size={20} />},
  {id: 'cents', wh: [250, 60], ch: 6, dt: 30, kind: 'stamp', x: 2090, y: 1420, r: -8, z: 6, el: () => <Stamp text="16 CENTS" size={24} />},
  // ch07 ★ Mississippi, 1875: "tired out", and why they killed him
  {id: 'herald', wh: [460, 86], ch: 7, dt: 0, kind: 'drop', x: 2300, y: 1830, r: -1, el: () => <Photo src={W + 'cr_herald.png'} w={460} />},
  {id: 'obeying', wh: [460, 48], ch: 7, dt: 16, kind: 'drop', x: 2800, y: 1850, r: 1.5, el: () => <Photo src={W + 'cr_obeying.png'} w={460} />},
  {id: 'heraldStrip', wh: [280, 42], ch: 7, dt: 28, kind: 'slide', x: 2330, y: 1940, r: 1.5, el: () => <Strip text="MISSISSIPPI, 1875" seed="ms" size={24} bg={CORAL_LABEL} />},
  // ch08 two sets of results (centre), and the deal nobody wrote down
  {id: 'results', wh: [440, 259], ch: 8, dt: 0, kind: 'drop', x: 1060, y: 1990, r: 1.5, el: () => <Photo src={W + 'cr_results.png'} w={440} />},
  {id: 'resultsStrip', wh: [370, 36], ch: 8, dt: 12, kind: 'slide', x: 1070, y: 2262, r: -1.5, el: () => <Strip text="TWO SETS OF RESULTS · 1876" seed="ts" size={20} />},
  {id: 'deal', wh: [170, 157], ch: 8, dt: 30, kind: 'slap', x: 1640, y: 2000, r: 4, el: () => <Sticky text="the deal?" w={170} size={44} />},
  {id: 'troopsOut', wh: [300, 48], ch: 8, dt: 56, kind: 'stamp', x: 1600, y: 2220, r: -5, z: 6, el: () => <Stamp text="TROOPS OUT · 1877" size={26} />},
  // ch09 VOTELESS written back in over the strike, and the gaps in the 15th
  {id: 'writeBack', wh: [190, 60], ch: 9, dt: 0, kind: 'fade', x: 1062, y: 168, r: -5, z: 9, el: (c) => (
    <div style={{fontFamily: HAND, fontSize: 46, color: BRAND.accent, whiteSpace: 'nowrap', clipPath: `inset(-20% ${100 - 100 * c.write}% -20% -5%)`, textShadow: '2px 2px 0 rgba(0,0,0,0.5)'}}>Voteless</div>
  )},
  {id: 'gaps', wh: [340, 170], ch: 9, dt: 20, kind: 'drop', x: 40, y: 1990, r: 1, el: () => (
    <Scrap text="a poll tax · a reading test, graded by white officials · a grandfather clause" mark="graded by white officials" w={340} seed="gp" size={22} />
  )},
  {id: 'louisiana', wh: [280, 50], ch: 9, dt: 44, kind: 'stamp', x: 40, y: 2230, r: -4, z: 6, el: () => <Stamp text="130,344 → 1,342" size={28} />},
  // ch10 the answer on the column names: LAW on paper, LAND struck (PROTECTION comes down in the header itself)
  {id: 'onPaper', wh: [190, 44], ch: 10, dt: 0, kind: 'stamp', x: 440, y: 122, r: -6, z: 9, el: () => <Stamp text="ON PAPER" size={26} />},
  {id: 'landStrike', wh: [240, 40], ch: 10, dt: 24, kind: 'fade', x: 1500, y: 60, z: 9, el: (c) => (
    <svg width={240} height={50} style={{overflow: 'visible'}}><path d={`M 6 30 Q 110 14 ${6 + 228 * c.landStrike} 26`} stroke={BRAND.accent} strokeWidth={10} fill="none" strokeLinecap="round" /></svg>
  )},
];

const N3: BPin[] = [
  {ch: 1, dt: 22, x: 700, y: 2018, coral: true},
  {ch: 2, dt: 22, x: 2440, y: 1012},
  {ch: 3, dt: 52, x: 2950, y: 1000},
  {ch: 3, dt: 70, x: 3235, y: 1092},
  {ch: 4, dt: 22, x: 2520, y: 1432},
  {ch: 4, dt: 44, x: 2970, y: 1450},
  {ch: 5, dt: 22, x: 2825, y: 162},
  {ch: 6, dt: 22, x: 2105, y: 1356},
  {ch: 7, dt: 22, x: 2530, y: 1838, coral: true},
  {ch: 8, dt: 22, x: 1280, y: 2000},
  {ch: 8, dt: 40, x: 1725, y: 2012},
  {ch: 9, dt: 30, x: 210, y: 2000},
];

const T3: Thread[] = [
  // the convention roll (Ep 2) to his last words
  {ch: 1, dt: 30, a: [1120, 1748], b: [700, 2018], under: true},
  {ch: 3, dt: 76, a: [2950, 1000], b: [3235, 1092], tag: 'therefore'},
  // Cruikshank cuts the string to EQUAL PROTECTION (Ep 1's 14th Amendment)
  {ch: 4, dt: 48, a: [2970, 1450], b: [420, 735], tag: '✕', tagT: 0.09, under: true, cut: true},
  {ch: 5, dt: 40, a: [2825, 162], b: [2230, 110], tag: 'pulling', tagT: 0.5},
  // Ames asked for troops: the string to the army is cut
  {ch: 7, dt: 36, a: [2110, 572], b: [2180, 152], tag: '✕', tagT: 0.45, under: true, cut: true},
  {ch: 8, dt: 46, a: [1280, 2000], b: [1725, 2012], tag: 'no proof of a written deal', tagT: 0.5, dashed: true},
  {ch: 9, dt: 36, a: [255, 1360], b: [210, 2000], tag: 'but', tagT: 0.55, under: true},
];

// Episodes 1–2 are all landed: their chapters count as before this episode (ch - 100).
const E2 = <T extends {ch: number}>(xs: T[]) => xs.map((x) => ({...x, ch: x.ch - 100}));
export const PIECES: Piece[] = [...E2(P12 as unknown as Piece[]), ...P3];
export const PINS: BPin[] = [...E2(N12), ...N3];
export const THREADS: Thread[] = [...E2(T12 as Thread[]), ...T3];
const COLUMNS = E2(C12 as {ch: number; text: string; x: number; y: number}[]);

/** Where the camera starts for each chapter's arrival: centre x, centre y, zoom. */
export const FOCUS: Record<number, [number, number, number]> = {
  1: [700, 2080, 1.6], 2: [2520, 1150, 1.5], 3: [3000, 1130, 1.5], 4: [2650, 1560, 1.4], 5: [2830, 300, 1.5],
  6: [2105, 1430, 1.6], 7: [2530, 1880, 1.5], 8: [1300, 2120, 1.5], 9: [1140, 220, 1.8], 10: [1660, 1170, 0.45],
};

/** When the PROTECTION header tears (ch07) and comes down (ch10), relative to `at`. */
const TEAR_DT = 44;
const DOWN_DT = 40;

const ThreadTag: React.FC<{text: string; x: number; y: number; show: number; coral?: boolean}> = ({text, x, y, show, coral}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(-4deg) scale(${show})`, zIndex: 45, background: coral ? CORAL_LABEL : '#ece6d8',
    padding: '0 12px 3px', fontFamily: HAND, fontSize: 34, color: coral ? '#5a1d17' : '#0f3e37', boxShadow: '2px 3px 0 rgba(0,0,0,0.5)', whiteSpace: 'nowrap'}}>{text}</div>
);

const BoardPin: React.FC<{at: number; x: number; y: number; coral?: boolean}> = ({at, x, y, coral}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at) return null;
  const k = spring({frame: f - at, fps, config: {damping: 9, stiffness: 300}});
  return (
    <div style={{position: 'absolute', left: x - 10, top: y - 10, width: 20, height: 20, borderRadius: 10, background: coral ? BRAND.accent : BRAND.thread, zIndex: 50,
      boxShadow: '2px 3px 0 rgba(0,0,0,0.5)', transform: `scale(${0.3 + 0.7 * k})`}}>
      <div style={{position: 'absolute', left: 5, top: 4, width: 6, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.6)'}} />
    </div>
  );
};

const COL_STYLE: React.CSSProperties = {position: 'absolute', fontFamily: HAND, fontSize: 78, color: 'rgba(244,239,230,0.5)', whiteSpace: 'nowrap'};
// a ragged vertical tear through the word, as clip-path points (x in %, top to bottom)
const TEAR = [54, 50, 56, 51, 55, 49, 53];
const tearPath = (left: boolean) => {
  const pts = TEAR.map((x, i) => `${x}% ${(i * 100) / (TEAR.length - 1)}%`);
  return left ? `polygon(-5% -20%, ${pts.join(', ')}, -5% 120%)` : `polygon(${pts.join(', ')}, 105% 120%, 105% -20%)`;
};

/** PROTECTION, torn in two (`tear` 0..1) and then hanging down (`down` 0..1). */
const TornHeader: React.FC<{text: string; x: number; y: number; tear: number; down: number}> = ({text, x, y, tear, down}) => {
  if (tear <= 0) return <div style={{...COL_STYLE, left: x, top: y, transform: 'rotate(-2deg)'}}>{text}</div>;
  const gap = 10 * tear;
  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      <div style={{...COL_STYLE, position: 'relative', clipPath: tearPath(true), transformOrigin: '0% 50%', transform: `rotate(${-2 - 4 * down}deg) translateY(${30 * down}px)`}}>{text}</div>
      <div style={{...COL_STYLE, left: 0, top: 0, clipPath: tearPath(false), transformOrigin: '100% 0%',
        transform: `translateX(${gap}px) rotate(${-2 + 7 * tear + 28 * down}deg) translateY(${8 * tear + 140 * down}px)`, opacity: 1 - 0.35 * down}}>{text}</div>
    </div>
  );
};

const THREAD_DUR = 14;
/** Rough piece sizes by kind, for framing. */
const SIZE: Record<LandKind, [number, number]> = {drop: [380, 300], slap: [190, 175], stamp: [360, 60], tape: [120, 40], slide: [360, 40], fade: [160, 30]};

/**
 * The series board at the end of Episode 3's chapter `ch`. Episodes 1–2 and this episode's earlier pieces are already
 * pinned; this chapter's land from `at`. `from` is the cut onto the board. The camera starts close on the new piece and
 * settles on this chapter's pieces with some of the board around them. `cam` replaces it (ch10's pull-back).
 */
export const SeriesBoard: React.FC<{ch: number; from: number; at: number; cam?: BoardKey[]; whoosh?: boolean; children?: React.ReactNode; overlay?: React.ReactNode}> = ({
  ch, from, at, cam, whoosh = true, children, overlay,
}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  // earlier chapters: landed long ago (not -1e7: spring() would simulate every frame since)
  const when = (pch: number, dt: number) => (pch < ch ? from - 400 : pch === ch ? at + dt : 1e7);
  const [fx, fy, fz] = FOCUS[ch];
  const lastDt = Math.max(0, ...[...P3, ...N3, ...T3].filter((p) => p.ch === ch).map((p) => p.dt));
  // end shot: this chapter's pieces (and non-tucked thread ends) in frame, and the frame's edges in empty board, so no
  // other piece is sliced: try the tightest zoom first, then nudge the centre and widen until nothing is cut
  const rect = (p: {kind: LandKind; x: number; y: number; wh?: [number, number]}) => [p.x, p.y, p.x + (p.wh ?? SIZE[p.kind])[0], p.y + (p.wh ?? SIZE[p.kind])[1]];
  const mineP = P3.filter((p) => p.ch === ch);
  let box = [1e9, 1e9, -1e9, -1e9];
  const grow = (r: number[]) => { box = [Math.min(box[0], r[0]), Math.min(box[1], r[1]), Math.max(box[2], r[2]), Math.max(box[3], r[3])]; };
  // marks drawn on the column names (kind 'fade': the check, the write-back, the strike) sit far from the chapter's pieces;
  // the end shot frames the pieces, and a chapter that shows the mark passes its own `cam`
  (mineP.some((p) => p.kind !== 'fade') ? mineP.filter((p) => p.kind !== 'fade') : mineP).forEach((p) => grow(rect(p)));
  T3.filter((t) => t.ch === ch && !t.under).forEach((t) => grow([Math.min(t.a[0], t.b[0]), Math.min(t.a[1], t.b[1]), Math.max(t.a[0], t.b[0]), Math.max(t.a[1], t.b[1])]));
  // the string labels count too ("therefore", "✕"): about 17 px a character plus padding, centred on their point
  const tagRects = THREADS.filter((t) => t.ch <= ch && t.tag).map((t) => {
    const k = t.tagT ?? 0.5, x = t.a[0] + (t.b[0] - t.a[0]) * k, y = t.a[1] + (t.b[1] - t.a[1]) * k, w = t.tag!.length * 17 + 30;
    return [x - w / 2, y - 24, x + w / 2, y + 24];
  });
  const others = [...PIECES.filter((p) => p.ch <= ch && !(p.ch === ch && mineP.includes(p))).map(rect), ...tagRects];
  const fits = (cx: number, cy: number, z: number) => {
    const hw = 960 / z, hh = 540 / z, m = 70 / z;   // keep the chapter's pieces 70 px inside the edge
    const v = [cx - hw, cy - hh, cx + hw, cy + hh];
    if (box[0] < v[0] + m || box[2] > v[2] - m || box[1] < v[1] + m || box[3] > v[3] - m) return false;
    // every other piece is either off screen or wholly inside the safe margin (100 px)
    const sm = 100 / z;
    return others.every((r) => r[2] <= v[0] || r[0] >= v[2] || r[3] <= v[1] || r[1] >= v[3] ||
      (r[0] >= v[0] + sm && r[2] <= v[2] - sm && r[1] >= v[1] + sm && r[3] <= v[3] - sm));
  };
  const end = React.useMemo((): [number, number, number] => {
    if (!mineP.length) return [fx, fy, 0.9];
    const cx0 = (box[0] + box[2]) / 2, cy0 = (box[1] + box[3]) / 2;
    const z0 = Math.min(1.25, Math.min(1760 / (box[2] - box[0] + 140), 940 / (box[3] - box[1] + 140)));
    // every framing that slices nothing, scored: closer in is better, and so is keeping the chapter's pieces central
    // (a slide of 300 screen px costs about as much as zooming out by half)
    let best: [number, number, number] | null = null, bestS = -1;
    for (let z = z0; z >= 0.4; z *= 0.96) {
      for (let r = 0; r <= 300 / z; r += 20 / z) {
        for (let k = 0; k < (r ? 16 : 1); k++) {
          const cx = cx0 + r * Math.cos((k * Math.PI) / 8), cy = cy0 + r * Math.sin((k * Math.PI) / 8);
          const score = (z / z0) * (1 - (r * z) / 600);
          if (score > bestS && fits(cx, cy, z)) { best = [cx, cy, z]; bestS = score; }
        }
      }
    }
    return best ?? [cx0, cy0, Math.max(0.4, z0 * 0.6)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ch]);
  const [ex, ey, endZ] = end;
  const keys: BoardKey[] = cam ?? [
    [from, fx + 20, fy + 10, fz],
    [Math.max(from + 20, at + lastDt + 18), ex, ey, endZ],
    [Math.max(from + 21, at + lastDt + 260), ex, ey, endZ * 0.985],
  ];
  const tearAt = when(7, TEAR_DT), downAt = when(10, DOWN_DT);
  const tear = interpolate(g, [tearAt, tearAt + 8], [0, 1], clamp);
  const w9 = when(9, 0), w10 = when(10, 24);
  const c: Ctx_ = {
    hl: 1, q: 1, labelP: 1, strike: 1, mark: 1,
    write: interpolate(g, [w9 + 4, w9 + 22], [0, 1], clamp),
    landStrike: interpolate(g, [w10, w10 + 10], [0, 1], clamp),
    tear,
  };
  const down = ch < 10 ? 0 : spring({frame: Math.max(0, g - downAt), fps: 30, config: {damping: 11, stiffness: 90}}) * (g >= downAt ? 1 : 0);
  const mine = (k: LandKind) => P3.filter((p) => p.ch === ch && p.kind === k).map((p) => at + p.dt);
  const threads = THREADS.filter((t) => t.ch <= ch);
  const line = (t: Thread, i: number) => {
    const s = when(t.ch, t.dt);
    const q = interpolate(g, [s, s + THREAD_DUR], [0, 1], clamp);
    if (q <= 0) return null;
    // a cut thread goes slack: dashed, dimmed, once the cut mark is on
    const cutNow = t.cut && g >= s + THREAD_DUR + 8;
    return <line key={i} x1={t.a[0]} y1={t.a[1]} x2={t.a[0] + (t.b[0] - t.a[0]) * q} y2={t.a[1] + (t.b[1] - t.a[1]) * q} stroke={BRAND.thread} strokeWidth={2.6}
      strokeDasharray={t.dashed || cutNow ? '10 8' : undefined} opacity={cutNow ? 0.55 : 1} />;
  };
  return (
    <Ctx.Provider value={BRAND}>
      <AbsoluteFill>
        <Defs />
        <BoardStage cam={keys} stamps={mine('stamp')} splats="ep2">
          <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>{threads.map((t, i) => (t.under ? line(t, i) : null))}</svg>
          {COLUMNS.map((k) => (k.text === 'PROTECTION'
            ? <TornHeader key={k.text} text={k.text} x={k.x} y={k.y} tear={tear} down={down} />
            : <div key={k.text} style={{...COL_STYLE, left: k.x, top: k.y, transform: 'rotate(-2deg)'}}>{k.text}</div>))}
          {PIECES.filter((p) => p.ch <= ch).map((p) => (
            <Land key={p.id} at={when(p.ch, p.dt)} kind={p.kind} x={p.x} y={p.y} r={p.r} z={p.z}>{p.el(c)}</Land>
          ))}
          <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, zIndex: 40, overflow: 'visible'}}>{threads.map((t, i) => (t.under ? null : line(t, i)))}</svg>
          {threads.filter((t) => t.tag).map((t, i) => {
            const s = when(t.ch, t.dt) + THREAD_DUR + (t.cut ? 8 : 0);
            const show = interpolate(f, [s, s + 3, s + 6], [0, 1.15, 1], clamp);
            const k = t.tagT ?? 0.5;
            return show > 0 ? <ThreadTag key={i} text={t.tag!} x={t.a[0] + (t.b[0] - t.a[0]) * k} y={t.a[1] + (t.b[1] - t.a[1]) * k} show={show} coral={t.cut} /> : null;
          })}
          {PINS.filter((p) => p.ch <= ch).map((p, i) => <BoardPin key={i} at={when(p.ch, p.dt)} x={p.x} y={p.y} coral={p.coral} />)}
          {children}
        </BoardStage>
        {overlay}
        {whoosh && <Sfx at={from} src="sfx/whoosh.wav" volume={0.2} />}
        {ch === 7 && <Sfx at={tearAt} src="sfx/page_turn.wav" volume={0.35} />}
        <BoardSounds drops={mine('drop')} slaps={[...mine('slap'), ...mine('tape')]} slides={mine('slide')}
          pins={N3.filter((p) => p.ch === ch).map((p) => at + p.dt)} threads={T3.filter((t) => t.ch === ch).map((t) => at + t.dt)} />
      </AbsoluteFill>
    </Ctx.Provider>
  );
};

/** The finished series board's extras for the very end: the series label and the worn logo sticker. */
export const BoardSignoff: React.FC<{at: number}> = ({at}) => (
  <>
    <Land at={at} kind="slide" x={60} y={2330}><Strip text="RECONSTRUCTION · 1865 – 1877" seed="cs3" size={22} bg={BRAND.paper} /></Land>
    <Land at={at + 20} kind="fade" x={3000} y={2240} r={-3}><WornLogo w={300} /></Land>
  </>
);
