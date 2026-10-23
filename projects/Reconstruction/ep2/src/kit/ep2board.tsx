// The series board in Episode 2 (techniques/collage_board.md). It opens as Episode 1 left it (src/kit/ep1board.tsx, the
// same table) and grows: a second row under Episode 1's pieces, and a PROTECTION column on the far right.
//
//   <SeriesBoard ch={5} from={cut frame} at={frame the first piece lands} />
//
// Layout (board px; Episode 1 fills 0..1920 x 0..1060):
//   LAW (left)       the 15th Amendment under the 14th
//   centre           the senators print (★ ch01), Caldwell's name, one vote short, bottom rail on top
//   LAND (right)     sharecropping and the debt, under the land that went back
//   PROTECTION       the five military districts and Ames, right of LAND
// The three words (the committee's own strip) go up under the petition in ch02; VOTELESS is struck in ch05.
// Some threads run behind the pieces (`under`), like yarn tucked under a print, so long links don't cross labels.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from './common';
import {useGFrame} from './Kit';
import {BRAND, BoardSounds, type BoardKey, BoardStage, Ctx, Defs, HAND, Land, type LandKind, Photo, Scrap, Silhouette, Stamp, Sticky, Strip, SANS, TapeBit, WornLogo} from './board';
import {COLUMNS as C1, PIECES as P1, PINS as N1, THREADS as T1} from './ep1board';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const W = 'img/wall/';
const CORAL_LABEL = '#f3c6bf';
const TEAL = '#2FE0C4';

type Ctx_ = {hl: number; q: number; labelP: number; strike: number; mark: number};
type Piece = {id: string; ch: number; dt: number; kind: LandKind; x: number; y: number; r?: number; z?: number; el: (c: Ctx_) => React.ReactNode};
type BPin = {ch: number; dt: number; x: number; y: number; coral?: boolean};
type Thread = {ch: number; dt: number; a: [number, number]; b: [number, number]; tag?: string; tagT?: number; dashed?: boolean; under?: boolean; cut?: boolean};

/** Caldwell's name on the convention roll, with the coral highlighter on it (piece px of a 640-wide strip). */
const Roll: React.FC<{mark: number}> = ({mark}) => (
  <div style={{position: 'relative', width: 640}}>
    <Photo src={W + 'cr_roll.png'} w={640} />
    <div style={{position: 'absolute', left: 36, top: 19, width: 136 * mark, height: 22, background: BRAND.accent, mixBlendMode: 'multiply', opacity: 0.85}} />
  </div>
);

// Episode 2's pieces (ch = this episode's chapter). Episode 1's come from its own table, already landed.
const P2: Piece[] = [
  // ch01 ★ the first Black senator
  {id: 'senators', ch: 1, dt: 0, kind: 'drop', x: 520, y: 1350, r: -2, el: () => <Photo src={W + 'cr_senators.png'} w={400} />},
  {id: 'senatorsStrip', ch: 1, dt: 12, kind: 'slide', x: 530, y: 1662, r: 2, el: () => <Strip text="the first Black senator · 1870" seed="s2" size={22} bg={CORAL_LABEL} />},
  // ch02 the three words go up under the petition; the army goes back in
  {id: 'words', ch: 2, dt: 0, kind: 'drop', x: 680, y: 205, r: 1, el: () => <Photo src={W + 'cr_three_words.png'} w={560} />},
  {id: 'districts', ch: 2, dt: 22, kind: 'drop', x: 2000, y: 140, r: 3, el: () => <Photo src={W + 'cr_districts.png'} w={360} />},
  {id: 'districtsStrip', ch: 2, dt: 34, kind: 'slide', x: 2000, y: 355, r: -2, el: () => <Strip text="5 military districts · 1867" seed="md" size={20} />},
  // ch03 the blacksmith: his name on the roll of the 1868 convention
  {id: 'roll', ch: 3, dt: 0, kind: 'drop', x: 500, y: 1740, r: -1, el: (c) => <Roll mark={c.mark} />},
  {id: 'rollStrip', ch: 3, dt: 14, kind: 'slide', x: 520, y: 1812, r: 1, el: () => <Strip text="Charles Caldwell · Mississippi, 1868" seed="cc" size={20} />},
  // ch04 one vote short
  {id: 'acquittal', ch: 4, dt: 0, kind: 'drop', x: 1000, y: 1350, r: 2, el: () => <Photo src={W + 'cr_acquittal.png'} w={260} />},
  {id: 'short', ch: 4, dt: 26, kind: 'stamp', x: 975, y: 1580, r: -4, z: 6, el: () => <Stamp text="35 – 19 · ONE VOTE SHORT" size={24} />},
  // ch05 ★ the 15th Amendment (LAW), and VOTELESS struck on the three words
  {id: 'fifteenth', ch: 5, dt: 0, kind: 'drop', x: 60, y: 1350, r: 1.5, el: () => (
    <Scrap text="The right of citizens … to vote shall not be denied … on account of race, color, or previous condition of servitude." mark="on account of race, color, or previous condition of servitude" w={390} seed="15" size={23} />
  )},
  {id: 'fifteenthStrip', ch: 5, dt: 12, kind: 'slide', x: 70, y: 1316, r: -2, el: () => <Strip text="15th Amendment · 1870" seed="e15" size={20} bg={CORAL_LABEL} />},
  {id: 'strike', ch: 5, dt: 30, kind: 'fade', x: 1000, y: 232, z: 8, el: (c) => (
    <svg width={160} height={24} style={{overflow: 'visible'}}><path d={`M 4 14 Q 70 4 ${4 + 150 * c.strike} 12`} stroke={TEAL} strokeWidth={8} fill="none" strokeLinecap="round" /></svg>
  )},
  // ch06 bottom rail on top
  {id: 'rail', ch: 6, dt: 0, kind: 'slap', x: 1020, y: 1680, r: -4, el: () => <Sticky text="bottom rail on top" w={190} size={44} />},
  {id: 'officeholders', ch: 6, dt: 20, kind: 'stamp', x: 1230, y: 1760, r: 3, z: 6, el: () => <Stamp text="≈ 2,000 IN OFFICE" size={26} />},
  // ch07 carpetbaggers: Ames (PROTECTION)
  {id: 'ames', ch: 7, dt: 0, kind: 'drop', x: 2010, y: 560, r: -2, el: () => <Photo src={W + 'cr_ames.png'} w={200} />},
  {id: 'amesStrip', ch: 7, dt: 12, kind: 'slide', x: 1990, y: 840, r: 2, el: () => <Strip text="Adelbert Ames · Mississippi" seed="am" size={20} />},
  // ch08 sharecropping (LAND)
  {id: 'contract', ch: 8, dt: 0, kind: 'drop', x: 1510, y: 1350, r: 2, el: () => <Photo src={W + 'cr_contract.png'} w={330} />},
  {id: 'contractStrip', ch: 8, dt: 12, kind: 'slide', x: 1500, y: 1600, r: -2, el: () => <Strip text="sharecropping · 1867" seed="sh" size={20} />},
  // ch09 the debt, and convict leasing
  {id: 'debt', ch: 9, dt: 0, kind: 'drop', x: 1500, y: 1680, r: -1.5, el: () => (
    <Scrap text="Settling up: the crop sold, the family's half, minus the store, plus interest. It owes more than it made." mark="It owes more than it made." w={330} seed="dbt" size={21} />
  )},
  {id: 'convict', ch: 9, dt: 30, kind: 'slap', x: 1900, y: 1760, r: 5, el: () => <Sticky text="convict leasing" w={170} size={42} />},
];

const N2: BPin[] = [
  {ch: 1, dt: 22, x: 720, y: 1365, coral: true},
  {ch: 2, dt: 10, x: 960, y: 212},
  {ch: 2, dt: 42, x: 2180, y: 152},
  {ch: 3, dt: 22, x: 1120, y: 1748},
  {ch: 4, dt: 22, x: 1130, y: 1362},
  {ch: 5, dt: 22, x: 255, y: 1360, coral: true},
  {ch: 7, dt: 22, x: 2110, y: 572},
  {ch: 8, dt: 22, x: 1675, y: 1362},
  {ch: 9, dt: 22, x: 1665, y: 1690},
];

const T2: Thread[] = [
  {ch: 2, dt: 48, a: [1270, 715], b: [2180, 152], tag: 'therefore', tagT: 0.58, under: true},
  {ch: 4, dt: 30, a: [1270, 715], b: [1665, 150], tag: '✕', tagT: 0.5, under: true, cut: true},
  {ch: 7, dt: 30, a: [2110, 572], b: [2420, 980], tag: 'part 3 →', tagT: 1, dashed: true},
  {ch: 8, dt: 28, a: [1680, 465], b: [1675, 1362], tag: 'therefore', tagT: 0.9, under: true},
  {ch: 9, dt: 40, a: [255, 125], b: [1985, 1770], tag: 'therefore', tagT: 0.93, under: true},
];

// Episode 1's pieces are all landed: their chapters count as before this episode (ch - 100).
const E1 = <T extends {ch: number}>(xs: T[]) => xs.map((x) => ({...x, ch: x.ch - 100}));
export const PIECES: Piece[] = [...E1(P1 as unknown as Piece[]), ...P2];
export const PINS: BPin[] = [...E1(N1), ...N2];
export const THREADS: Thread[] = [...E1(T1 as Thread[]), ...T2];
const COLUMNS = [...E1(C1), {ch: 2, text: 'PROTECTION', x: 2000, y: 34}];

/** Where the camera starts for each chapter's arrival: centre x, centre y, zoom. */
export const FOCUS: Record<number, [number, number, number]> = {
  1: [720, 1500, 1.6], 2: [1700, 260, 1.15], 3: [820, 1780, 1.6], 4: [1130, 1470, 1.6], 5: [255, 1450, 1.6],
  6: [1150, 1760, 1.6], 7: [2110, 700, 1.5], 8: [1675, 1480, 1.5], 9: [1720, 1770, 1.5], 10: [1215, 950, 0.55],
};

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

const THREAD_DUR = 14;
/** Rough piece sizes by kind, for framing. */
const SIZE: Record<LandKind, [number, number]> = {drop: [380, 300], slap: [190, 175], stamp: [360, 60], tape: [120, 40], slide: [360, 40], fade: [160, 30]};

/**
 * The series board at the end of Episode 2's chapter `ch`. Episode 1's pieces and this episode's earlier ones are already
 * pinned; this chapter's land from `at`. `from` is the cut onto the board. The camera starts close on the new piece and
 * settles on this chapter's pieces with some of the board around them. `cam` replaces it (ch10's tour and pull-back).
 */
export const SeriesBoard: React.FC<{ch: number; from: number; at: number; cam?: BoardKey[]; whoosh?: boolean; label?: string; children?: React.ReactNode; overlay?: React.ReactNode}> = ({
  ch, from, at, cam, whoosh = true, children, overlay,
}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  // earlier chapters: landed long ago (not -1e7: spring() would simulate every frame since)
  const when = (pch: number, dt: number) => (pch < ch ? from - 400 : pch === ch ? at + dt : 1e7);
  const [fx, fy, fz] = FOCUS[ch];
  const lastDt = Math.max(0, ...[...P2, ...N2, ...T2].filter((p) => p.ch === ch).map((p) => p.dt));
  // end shot: this chapter's pieces (and non-tucked thread ends) in frame, and the frame's edges in empty board, so no
  // other piece is sliced: try the tightest zoom first, then nudge the centre and widen until nothing is cut
  const rect = (p: {kind: LandKind; x: number; y: number}) => [p.x, p.y, p.x + SIZE[p.kind][0], p.y + SIZE[p.kind][1]];
  const mineP = P2.filter((p) => p.ch === ch);
  let box = [1e9, 1e9, -1e9, -1e9];
  const grow = (r: number[]) => { box = [Math.min(box[0], r[0]), Math.min(box[1], r[1]), Math.max(box[2], r[2]), Math.max(box[3], r[3])]; };
  mineP.forEach((p) => grow(rect(p)));
  T2.filter((t) => t.ch === ch && !t.under).forEach((t) => grow([Math.min(t.a[0], t.b[0]), Math.min(t.a[1], t.b[1]), Math.max(t.a[0], t.b[0]), Math.max(t.a[1], t.b[1])]));
  const others = PIECES.filter((p) => p.ch <= ch).map(rect);
  const fits = (cx: number, cy: number, z: number) => {
    const hw = 960 / z, hh = 540 / z, m = 70 / z;   // keep the chapter's pieces 70 px inside the edge
    const v = [cx - hw, cy - hh, cx + hw, cy + hh];
    if (box[0] < v[0] + m || box[2] > v[2] - m || box[1] < v[1] + m || box[3] > v[3] - m) return false;
    return others.every((r) => r[2] <= v[0] || r[0] >= v[2] || r[3] <= v[1] || r[1] >= v[3] || (r[0] >= v[0] && r[2] <= v[2] && r[1] >= v[1] && r[3] <= v[3]));
  };
  let end: [number, number, number] = [fx, fy, 0.9];
  if (mineP.length) {
    const cx0 = (box[0] + box[2]) / 2, cy0 = (box[1] + box[3]) / 2;
    const z0 = Math.min(1.25, Math.min(1760 / (box[2] - box[0] + 140), 940 / (box[3] - box[1] + 140)));
    let found = false;
    for (let z = z0; z >= 0.55 && !found; z *= 0.96) {
      for (let r = 0; r <= 400 && !found; r += 40) {
        for (let k = 0; k < (r ? 8 : 1) && !found; k++) {
          const cx = cx0 + r * Math.cos((k * Math.PI) / 4), cy = cy0 + r * Math.sin((k * Math.PI) / 4) * 0.6;
          if (fits(cx, cy, z)) { end = [cx, cy, z]; found = true; }
        }
      }
    }
    if (!found) end = [cx0, cy0, Math.max(0.55, z0 * 0.7)];
  }
  const [ex, ey, endZ] = end;
  const keys: BoardKey[] = cam ?? [
    [from, fx + 20, fy + 10, fz],
    [Math.max(from + 20, at + lastDt + 18), ex, ey, endZ],
    [Math.max(from + 21, at + lastDt + 260), ex, ey, endZ * 0.985],
  ];
  const strikeAt = when(5, 30);
  const markAt = when(3, 24);
  const c: Ctx_ = {
    hl: 1, q: 1, labelP: 1,
    strike: interpolate(g, [strikeAt, strikeAt + 8], [0, 1], clamp),
    mark: interpolate(g, [markAt, markAt + 10], [0, 1], clamp),
  };
  const mine = (k: LandKind) => P2.filter((p) => p.ch === ch && p.kind === k).map((p) => at + p.dt);
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
          {COLUMNS.filter((k) => k.ch <= ch).map((k) => (
            <div key={k.text} style={{position: 'absolute', left: k.x, top: k.y, fontFamily: HAND, fontSize: 78, color: 'rgba(244,239,230,0.5)', transform: 'rotate(-2deg)',
              opacity: k.ch === ch ? interpolate(g, [at - 30, at - 18], [0, 1], clamp) : 1}}>{k.text}</div>
          ))}
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
        <BoardSounds drops={mine('drop')} slaps={[...mine('slap'), ...mine('tape')]} slides={mine('slide')}
          pins={N2.filter((p) => p.ch === ch).map((p) => at + p.dt)} threads={T2.filter((t) => t.ch === ch).map((t) => at + t.dt)} />
      </AbsoluteFill>
    </Ctx.Provider>
  );
};

/** The finished board's extras for the ending: the series label and the worn logo sticker. */
export const BoardSignoff: React.FC<{at: number}> = ({at}) => (
  <>
    <Land at={at} kind="slide" x={60} y={1920}><Strip text="RECONSTRUCTION · PART 2" seed="cs2" size={22} bg={BRAND.paper} /></Land>
    <Land at={at + 20} kind="fade" x={2080} y={1910} r={-3}><WornLogo w={300} /></Land>
  </>
);

// keep unused imports referenced for the pieces Episode 1 builds with
void Scrap; void Silhouette; void SANS; void TapeBit;
