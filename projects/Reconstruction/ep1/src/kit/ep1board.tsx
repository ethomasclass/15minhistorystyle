// The Episode 1 board (techniques/collage_board.md). Every chapter ends on it: the earlier chapters' pieces are already
// pinned, this chapter's pieces land on its last line, and the camera eases back to show where they sit. Chapter 10
// pulls back to the whole board. One table of pieces, so the board is the same in every chapter.
//
//   <EpBoard ch={5} from={cut frame} at={frame the first piece lands} />
//
// Columns: LAW on the left (from ch06), LAND on the right (from ch02); the question "who decides?" in the middle.
// Board pixels are 1920x1080 at zoom 1. The chapter's subject pieces (★: ch01's petition, ch06's 13th Amendment) get a
// coral pin and label; everything else is teal.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from './common';
import {useGFrame} from './Kit';
import {BRAND, BoardSounds, type BoardKey, BoardStage, Ctx, Defs, HAND, Land, type LandKind, Photo, Scrap, Silhouette, Stamp, Sticky, Strip, SANS, TapeBit, WornLogo} from './board';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const W = 'img/wall/';

type Ctx_ = {hl: number; q: number; labelP: number};
type Piece = {id: string; ch: number; dt: number; kind: LandKind; x: number; y: number; r?: number; z?: number; el: (c: Ctx_) => React.ReactNode};
type BPin = {ch: number; dt: number; x: number; y: number; coral?: boolean};
type Thread = {ch: number; dt: number; a: [number, number]; b: [number, number]; tag?: string; tagT?: number; dashed?: boolean};

const CORAL_LABEL = '#f3c6bf';

export const PIECES: Piece[] = [
  // ch01 ★ the petition, top centre
  {id: 'petition', ch: 1, dt: 0, kind: 'drop', x: 660, y: 60, r: -1, el: () => <Photo src={W + 'cr_petition.png'} w={600} />},
  {id: 'petitionStrip', ch: 1, dt: 12, kind: 'slide', x: 700, y: 150, r: 2, el: () => <Strip text="Edisto Island · Oct 28, 1865" seed="ed" size={22} bg={CORAL_LABEL} />},
  // ch02 the forty acres (LAND, right)
  {id: 'acres', ch: 2, dt: 0, kind: 'drop', x: 1500, y: 130, r: -4, el: () => <Photo src={W + 'cr_acres.png'} w={330} />},
  {id: 'acresTape', ch: 2, dt: 10, kind: 'tape', x: 1540, y: 112, r: -14, z: 5, el: () => <TapeBit w={120} seed="a" />},
  {id: 'acresStrip', ch: 2, dt: 18, kind: 'slide', x: 1500, y: 330, r: -3, el: () => <Strip text="Field Order 15 · Jan 1865" seed="e1" size={22} />},
  // ch03 Lincoln's plan, and the open question
  {id: 'lincoln', ch: 3, dt: 0, kind: 'drop', x: 500, y: 300, r: 3, el: () => <Photo src={W + 'cr_lincoln.png'} w={200} />},
  {id: 'lincolnStrip', ch: 3, dt: 12, kind: 'slide', x: 480, y: 622, r: -2, el: () => <Strip text="TEN PERCENT · 1863" seed="tp" size={24} font={SANS} />},
  {id: 'who', ch: 3, dt: 30, kind: 'drop', x: 830, y: 330, el: (c) => <Silhouette label="WHO DECIDES?" q={c.q} labelP={c.labelP} />},
  // ch04 the new president
  {id: 'johnson', ch: 4, dt: 0, kind: 'drop', x: 1180, y: 290, r: -3, el: () => <Photo src={W + 'cr_johnson.png'} w={220} />},
  {id: 'johnsonStrip', ch: 4, dt: 12, kind: 'slide', x: 1150, y: 578, r: 3, el: () => <Strip text="the President · April 1865" seed="pj" size={20} />},
  // ch05 the land goes back (LAND, under the forty acres)
  {id: 'pardons', ch: 5, dt: 0, kind: 'drop', x: 1560, y: 450, r: 3, el: () => <Photo src={W + 'cr_pardons.png'} w={240} />},
  {id: 'pardonsStrip', ch: 5, dt: 12, kind: 'slide', x: 1520, y: 765, r: -2, el: () => <Strip text="the land goes back · 1865" seed="lg" size={20} />},
  {id: 'pardoned', ch: 5, dt: 26, kind: 'stamp', x: 1540, y: 610, r: -8, z: 6, el: () => <Stamp text="PARDONED" size={38} />},
  // ch06 ★ the 13th Amendment and its loophole (LAW, left)
  {id: 'thirteenth', ch: 6, dt: 0, kind: 'drop', x: 60, y: 110, r: 2, el: (c) => (
    <Scrap text="Neither slavery nor involuntary servitude, except as a punishment for crime…" mark="except as a punishment for crime" w={390} seed="13" size={25} hl={c.hl} />
  )},
  {id: 'thirteenthStrip', ch: 6, dt: 12, kind: 'slide', x: 70, y: 76, r: -3, el: () => <Strip text="13th Amendment · Dec 1865" seed="e6" size={20} bg={CORAL_LABEL} />},
  {id: 'codes', ch: 6, dt: 40, kind: 'slap', x: 200, y: 360, r: -5, el: () => <Sticky text="Black Codes" w={170} size={46} />},
  // ch07 the Bureau, and the first override
  {id: 'bureau', ch: 7, dt: 0, kind: 'drop', x: 560, y: 760, r: -2, el: () => <Photo src={W + 'cr_bureau.png'} w={280} />},
  {id: 'bureauStrip', ch: 7, dt: 12, kind: 'slide', x: 560, y: 955, r: 2, el: () => <Strip text="Freedmen's Bureau · 1865" seed="fb" size={20} />},
  {id: 'civil', ch: 7, dt: 22, kind: 'slide', x: 60, y: 560, r: -1, el: () => <Strip text="CIVIL RIGHTS ACT · 1866" seed="cr" size={18} font={SANS} />},
  {id: 'overridden', ch: 7, dt: 34, kind: 'stamp', x: 80, y: 612, r: -6, z: 6, el: () => <Stamp text="OVERRIDDEN" size={30} />},
  // ch08 the 14th Amendment
  {id: 'fourteenth', ch: 8, dt: 0, kind: 'drop', x: 60, y: 720, r: -1.5, el: () => (
    <Scrap text="No State shall … deny to any person within its jurisdiction the equal protection of the laws." mark="the equal protection of the laws" w={390} seed="14" size={24} />
  )},
  {id: 'fourteenthStrip', ch: 8, dt: 12, kind: 'slide', x: 80, y: 690, r: 2, el: () => <Strip text="14th Amendment · 1866" seed="e8" size={20} />},
  // ch09 Congress decides
  {id: 'stevens', ch: 9, dt: 0, kind: 'drop', x: 1180, y: 700, r: 2, el: () => <Photo src={W + 'cr_stevens.png'} w={180} />},
  {id: 'stevensStrip', ch: 9, dt: 12, kind: 'slide', x: 1150, y: 940, r: -2, el: () => <Strip text="Congress · Nov 1866" seed="cg" size={20} />},
  {id: 'congress', ch: 9, dt: 34, kind: 'stamp', x: 800, y: 702, r: -4, z: 60, el: () => <Stamp text="CONGRESS DECIDES" size={30} />},
];

export const PINS: BPin[] = [
  {ch: 1, dt: 22, x: 960, y: 72, coral: true},
  {ch: 2, dt: 28, x: 1665, y: 150},
  {ch: 3, dt: 22, x: 600, y: 315},
  {ch: 3, dt: 50, x: 960, y: 345},
  {ch: 4, dt: 22, x: 1290, y: 305},
  {ch: 5, dt: 22, x: 1680, y: 465},
  {ch: 6, dt: 22, x: 255, y: 125, coral: true},
  {ch: 6, dt: 44, x: 330, y: 250},
  {ch: 7, dt: 22, x: 700, y: 775},
  {ch: 7, dt: 30, x: 46, y: 580},
  {ch: 8, dt: 22, x: 420, y: 735},
  {ch: 9, dt: 22, x: 1270, y: 715},
];

export const THREADS: Thread[] = [
  {ch: 3, dt: 56, a: [600, 315], b: [960, 345]},
  {ch: 4, dt: 28, a: [960, 345], b: [1290, 305]},
  {ch: 5, dt: 30, a: [1290, 305], b: [1680, 465], tag: 'therefore', tagT: 0.33},
  {ch: 6, dt: 50, a: [330, 250], b: [300, 372], tag: 'but'},
  {ch: 7, dt: 40, a: [222, 498], b: [46, 580], tag: 'therefore'},
  {ch: 8, dt: 28, a: [360, 430], b: [420, 735], tag: 'therefore'},
];

/** Where the camera looks for each chapter's arrival: centre x, centre y, and the zoom to land at. */
export const FOCUS: Record<number, [number, number, number]> = {
  1: [960, 160, 1.9], 2: [1640, 260, 1.8], 3: [760, 470, 1.55], 4: [1180, 420, 1.6], 5: [1560, 520, 1.55],
  6: [260, 290, 1.6], 7: [480, 700, 1.4], 8: [260, 700, 1.55], 9: [1060, 620, 1.45], 10: [960, 540, 1.0],
};

/** Chalked column names, once the story has earned them. */
const COLUMNS: {ch: number; text: string; x: number; y: number}[] = [
  {ch: 2, text: 'LAND', x: 1520, y: 36},
  {ch: 6, text: 'LAW', x: 470, y: 30},
];

const ThreadTag: React.FC<{text: string; x: number; y: number; show: number}> = ({text, x, y, show}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(-4deg) scale(${show})`, zIndex: 45, background: '#ece6d8',
    padding: '0 12px 3px', fontFamily: HAND, fontSize: 34, color: '#0f3e37', boxShadow: '2px 3px 0 rgba(0,0,0,0.5)', whiteSpace: 'nowrap'}}>{text}</div>
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

/**
 * The board as it stands at the end of chapter `ch`. Pieces of earlier chapters are already there; this chapter's land
 * from frame `at` (narration time). `from` is the cut onto the board (the camera starts close on the new piece).
 * `cam` replaces the default camera; `whoosh={false}` drops the entry whoosh (a chapter that opens on the board); `upTo` shows the board through a later chapter without animating it (ch10's pull-back
 * passes ch=10). `children` are drawn in board pixels on top (ch10's motif card, notes).
 */
export const EpBoard: React.FC<{ch: number; from: number; at: number; cam?: BoardKey[]; whoosh?: boolean; children?: React.ReactNode; overlay?: React.ReactNode}> = ({ch, from, at, cam, whoosh = true, children, overlay}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  // earlier chapters: landed long ago (not -1e7: spring() would simulate every frame since)
  const when = (pch: number, dt: number) => (pch < ch ? from - 400 : pch === ch ? at + dt : 1e7);
  const [fx, fy, fz] = FOCUS[ch];
  const lastDt = Math.max(0, ...[...PIECES, ...PINS, ...THREADS].filter((p) => p.ch === ch).map((p) => p.dt));
  // the end shot frames what's pinned so far (rough piece sizes by kind), inside the safe margin
  const SIZE: Record<LandKind, [number, number]> = {drop: [340, 300], slap: [175, 165], stamp: [330, 60], tape: [120, 40], slide: [330, 40], fade: [300, 60]};
  const shown = PIECES.filter((p) => p.ch <= ch);
  const bx0 = Math.min(...shown.map((p) => p.x), ...COLUMNS.filter((k) => k.ch <= ch).map((k) => k.x));
  const by0 = Math.min(...shown.map((p) => p.y), ...COLUMNS.filter((k) => k.ch <= ch).map((k) => k.y));
  const bx1 = Math.max(...shown.map((p) => p.x + SIZE[p.kind][0]));
  const by1 = Math.max(...shown.map((p) => p.y + SIZE[p.kind][1]));
  const endZ = Math.min(1.5, Math.max(0.86, Math.min(1640 / (bx1 - bx0), 860 / (by1 - by0))));
  const ex = (bx0 + bx1) / 2, ey = (by0 + by1) / 2;
  const keys: BoardKey[] = cam ?? [
    // start close on the new piece, settle on everything pinned so far
    [from, fx + 20, fy + 10, fz],
    [Math.max(from + 20, at + lastDt + 18), ex, ey, endZ],
    [Math.max(from + 21, at + lastDt + 260), ex, ey, endZ * 0.985],
  ];
  // the 13th Amendment's highlighter runs on arrival in ch06; the silhouette's question mark and label in ch03
  const hlAt = when(6, 70);
  const qAt = when(3, 40);
  const c: Ctx_ = {
    hl: interpolate(g, [hlAt, hlAt + 22], [0, 1], clamp),
    q: interpolate(f, [qAt, qAt + 6], [0, 1], clamp),
    labelP: interpolate(g, [qAt + 8, qAt + 18], [0, 1], clamp),
  };
  const mine = (k: LandKind) => PIECES.filter((p) => p.ch === ch && p.kind === k).map((p) => at + p.dt);
  const stamps = mine('stamp');
  const threads = THREADS.filter((t) => t.ch <= ch);
  return (
    <Ctx.Provider value={BRAND}>
      <AbsoluteFill>
        <Defs />
        <BoardStage cam={keys} stamps={stamps} splats="ep1">
          {COLUMNS.filter((k) => k.ch <= ch).map((k) => (
            <div key={k.text} style={{position: 'absolute', left: k.x, top: k.y, fontFamily: HAND, fontSize: 78, color: 'rgba(244,239,230,0.5)', transform: 'rotate(-2deg)',
              opacity: k.ch === ch ? interpolate(g, [at - 30, at - 18], [0, 1], clamp) : 1}}>{k.text}</div>
          ))}
          {PIECES.filter((p) => p.ch <= ch).map((p) => (
            <Land key={p.id} at={when(p.ch, p.dt)} kind={p.kind} x={p.x} y={p.y} r={p.r} z={p.z}>{p.el(c)}</Land>
          ))}
          <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, zIndex: 40, overflow: 'visible'}}>
            {threads.map((t, i) => {
              const s = when(t.ch, t.dt);
              const q = interpolate(g, [s, s + THREAD_DUR], [0, 1], clamp);
              if (q <= 0) return null;
              return <line key={i} x1={t.a[0]} y1={t.a[1]} x2={t.a[0] + (t.b[0] - t.a[0]) * q} y2={t.a[1] + (t.b[1] - t.a[1]) * q} stroke={BRAND.thread} strokeWidth={2.6}
                strokeDasharray={t.dashed ? '10 8' : undefined} />;
            })}
          </svg>
          {threads.filter((t) => t.tag).map((t, i) => {
            const s = when(t.ch, t.dt) + THREAD_DUR;
            const show = interpolate(f, [s, s + 3, s + 6], [0, 1.15, 1], clamp);
            const k = t.tagT ?? 0.5;
            return show > 0 ? <ThreadTag key={i} text={t.tag!} x={t.a[0] + (t.b[0] - t.a[0]) * k} y={t.a[1] + (t.b[1] - t.a[1]) * k} show={show} /> : null;
          })}
          {PINS.filter((p) => p.ch <= ch).map((p, i) => <BoardPin key={i} at={when(p.ch, p.dt)} x={p.x} y={p.y} coral={p.coral} />)}
          {children}
        </BoardStage>
        {overlay}
        {whoosh && <Sfx at={from} src="sfx/whoosh.wav" volume={0.2} />}
        <BoardSounds drops={mine('drop')} slaps={[...mine('slap'), ...mine('tape')]} slides={mine('slide')}
          pins={PINS.filter((p) => p.ch === ch).map((p) => at + p.dt)} threads={THREADS.filter((t) => t.ch === ch).map((t) => at + t.dt)} />
      </AbsoluteFill>
    </Ctx.Provider>
  );
};

/** The finished board's extras for the ending: the series label and the worn logo sticker. */
export const BoardSignoff: React.FC<{at: number}> = ({at}) => (
  <>
    <Land at={at} kind="slide" x={60} y={1000}><Strip text="RECONSTRUCTION · PART 1" seed="cs" size={22} bg={BRAND.paper} /></Land>
    <Land at={at + 20} kind="fade" x={1560} y={985} r={-3}><WornLogo w={300} /></Land>
  </>
);
