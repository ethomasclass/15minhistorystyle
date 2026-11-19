// The Thanksgiving collage board (techniques/collage_board.md, kit/board.tsx): ONE board for the whole video, used by every
// chapter, so it is visibly the same object growing chapter by chapter and the Ch08 pull-back is the same layout. One piece per
// chapter, each a real image crop: the eel (ch2), the turtle page (ch3), the calf's head "turtle fashion" (ch4), Hale (ch5),
// the Jell-O mould (ch6), the can (ch7), the turkey (ch8). A MOCK tape sits on each fake. Teal yarn pin to pin with the
// but / therefore tag of the chapter turn.
//
//   <ChBoard ch={5} at={f} />      the board as it stands at chapter `ch`: earlier pieces already pinned, this chapter's piece
//                                  drops at `at` (pin +8, MOCK +12, yarn +12), the camera frames the pieces so far (and the
//                                  next slot when `ghost` is given), easing a little toward the new piece and back.
//   <TgBoard cam={...} land={...} /> the same board with a hand-built camera (Ch07, Ch08 close-ups and the final pull-back).
// Board pixels: 1920 x 1080 at zoom 1. A piece with no `land` frame is already on the board; one with `null` is not there yet.
import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {APin, BRAND, BoardStage, type BoardKey, Ctx, Defs, Land, Stamp, Strip, WornLogo} from './board';
import {useGFrame} from './Kit';
import {Sfx} from './common';
import {BW, CORAL, MockTape, TEAL} from './tg_late';

export type PieceId = 'eel' | 'turtle' | 'mock' | 'hale' | 'jello' | 'can' | 'turkey';
/** `crop` [x, y, w, h] in source px of a `size` image (its height on the board follows the crop's aspect); no crop = contain. */
type Piece = {id: PieceId; ch: number; x: number; y: number; w: number; h: number; rot: number; label: string; src: string; size?: [number, number];
  crop?: [number, number, number, number]; colour?: boolean; mock?: boolean; tag?: 'but' | 'therefore'};

const cropped = (p: Omit<Piece, 'h'> & {h?: number}): Piece => ({...p, h: p.h ?? Math.round((p.w * p.crop![3]) / p.crop![2])});

/** In chapter order. `tag` is the word on the yarn from the previous piece. */
export const PIECES: Piece[] = [
  {id: 'eel', ch: 2, x: 110, y: 180, w: 300, h: 170, rot: -3, label: 'EELS · 1621', src: 'img/flow/eel/eel_0000.png'},
  // the Flow cut-outs (their own aspect: h = w x the picture's height / width)
  {id: 'turtle', ch: 3, x: 390, y: 520, w: 250, h: 219, rot: 2, label: 'TURTLE · 1796', src: 'img/flow/tg_turtle.png', colour: true, tag: 'but'},
  {id: 'mock', ch: 4, x: 670, y: 200, w: 300, h: 122, rot: -2, label: 'MOCK TURTLE · 1796', src: 'img/flow/tg_calf_head.png', colour: true, mock: true, tag: 'therefore'},
  cropped({id: 'hale', ch: 5, x: 980, y: 480, w: 210, rot: 3, label: 'SARAH HALE · 1863', src: 'img/arch/sarah-josepha-hale-engraving-1880-signature.jpg', size: [1046, 1536],
    crop: [170, 110, 720, 880], tag: 'but'}),
  {id: 'jello', ch: 6, x: 1230, y: 170, w: 290, h: 194, rot: -3, label: 'JELL-O · 1920', src: 'img/flow/tg_jello.png', colour: true, mock: true, tag: 'therefore'},
  // (the whole frame of the second cranberry set, drawn wide so the log and the can are the size of the other pieces)
  {id: 'can', ch: 7, x: 1400, y: 540, w: 330, h: 184, rot: 2, label: 'THE CAN · 1941', src: 'img/flow/cran2/cran_6.png', colour: true, mock: true, tag: 'therefore'},
  {id: 'turkey', ch: 8, x: 1620, y: 130, w: 210, h: 197, rot: -2, label: 'BROAD-BREASTED WHITE', src: 'img/flow/tg_turkey_white.png', colour: true, tag: 'therefore'},
];
export const piece = (id: PieceId) => PIECES.find((p) => p.id === id)!;
/** Where a piece's pin sits (board px): top-centre. */
export const pinOf = (p: Piece): [number, number] => [p.x + p.w / 2, p.y + 10];
/** A piece's centre (for camera keys). */
export const centreOf = (id: PieceId): [number, number] => { const p = piece(id); return [p.x + p.w / 2, p.y + p.h / 2 + 20]; };

/** The image itself: a crop window onto the scan, or the whole cut-out fitted inside. */
const PieceImg: React.FC<{p: Piece}> = ({p}) => {
  const filter = p.colour ? 'saturate(0.85)' : BW;
  if (!p.crop || !p.size) {
    return <Img src={staticFile(p.src)} style={{width: p.w, height: p.h, objectFit: 'contain', display: 'block', filter: `${filter} drop-shadow(0 3px 2px rgba(0,0,0,0.7)) drop-shadow(0 10px 14px rgba(0,0,0,0.5))`}} />;
  }
  const [cx, cy, cw] = p.crop;
  const s = p.w / cw;
  return (
    <div style={{position: 'relative', width: p.w, height: p.h, overflow: 'hidden', boxShadow: '0 10px 18px rgba(0,0,0,0.45)'}}>
      <Img src={staticFile(p.src)} style={{position: 'absolute', left: -cx * s, top: -cy * s, width: p.size[0] * s, height: p.size[1] * s, filter}} />
    </div>
  );
};

const PieceView: React.FC<{p: Piece; subject: boolean; mockAt: number}> = ({p, subject, mockAt}) => (
  <div style={{position: 'relative', width: p.w}}>
    <PieceImg p={p} />
    <div style={{position: 'absolute', left: -6, top: p.h + 8}}>
      <Strip text={p.label} size={20} seed={p.id} bg={subject ? CORAL : undefined} />
    </div>
    {p.mock && <div style={{position: 'absolute', left: p.w - 92, top: p.h - 50}}><MockTape x={0} y={0} at={mockAt} size={28} rot={-8} seed={p.id.length * 7} /></div>}
  </div>
);

/** A cream yarn tag with the handwritten but / therefore, at the yarn's midpoint. */
const YarnTag: React.FC<{x: number; y: number; text: string; at: number}> = ({x, y, text, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%) rotate(-4deg)', zIndex: 45, background: '#ece6d8', padding: '2px 12px 4px',
      fontFamily: '"Nanum Pen Script", cursive', fontSize: 30, lineHeight: 1, color: '#0f3e37', filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,0.5))', whiteSpace: 'nowrap'}}>{text}</div>
  );
};

const THREAD = 14;
const Yarn: React.FC<{a: [number, number]; b: [number, number]; at: number; tag?: string}> = ({a, b, at, tag}) => {
  const g = useGFrame();
  const q = Math.max(0, Math.min(1, (g - at) / THREAD));
  if (q <= 0) return null;
  // a little sag: a quadratic through a midpoint pulled down
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 + 28;
  const pt = (t: number) => [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * mx + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * my + t * t * b[1]];
  const pts = Array.from({length: 25}, (_, i) => pt((i / 24) * q).map((v) => v.toFixed(1)).join(',')).join(' ');
  // the tag sits where along the yarn it is clearest of every piece and label (a tag on a label hid it, Nov 2026)
  const [tx, ty] = tagSpot(a, b, pt);
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, zIndex: 40, overflow: 'visible'}}>
        <polyline points={pts} fill="none" stroke={TEAL} strokeWidth={3} strokeLinecap="round" />
      </svg>
      {tag && q >= 1 && <YarnTag x={tx} y={ty} text={tag} at={at + THREAD} />}
    </>
  );
};

/** Board rectangles a yarn tag must stay clear of: each piece and the label strip under it. */
const KEEP_OUT: [number, number, number, number][] = PIECES.flatMap((p) => [
  [p.x, p.y, p.w, p.h] as [number, number, number, number],
  [p.x - 6, p.y + p.h + 8, p.label.length * 13.5 + 30, 34] as [number, number, number, number],
]);
const pickSpot = (pt: (t: number) => number[]): number[] => {
  // score: the clear distance from the tag's box (about 110 x 40) to the nearest keep-out rectangle, or, when it touches one,
  // minus the area it covers (so the least-covered spot wins when no spot is clear)
  let best = pt(0.5), bestS = -Infinity;
  for (let t = 0.2; t <= 0.801; t += 0.025) {
    const [x, y] = pt(t);
    const [l, r, tp, bt] = [x - 55, x + 55, y - 20, y + 20];
    let d = Infinity, cover = 0;
    for (const [rx, ry, rw, rh] of KEEP_OUT) {
      const ox = Math.min(r, rx + rw) - Math.max(l, rx), oy = Math.min(bt, ry + rh) - Math.max(tp, ry);
      if (ox > 0 && oy > 0) cover += ox * oy;
      d = Math.min(d, Math.hypot(Math.max(rx - r, 0, l - (rx + rw)), Math.max(ry - bt, 0, tp - (ry + rh))));
    }
    const sc = cover > 0 ? -cover : d - Math.abs(t - 0.5) * 20;
    if (sc > bestS) { best = [x, y]; bestS = sc; }
  }
  return best;
};
/** The sagging yarn between two pins (the same curve Yarn draws). */
const curve = (a: [number, number], b: [number, number]) => {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 + 28;
  return (t: number) => [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * mx + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * my + t * t * b[1]];
};
/** Every yarn's tag spot, chosen once in chapter order; each placed tag becomes a keep-out for the next, so two tags never stack. */
const SPOTS = new Map<string, number[]>();
PIECES.forEach((p, i) => {
  if (!i) return;
  const a = pinOf(PIECES[i - 1]), b = pinOf(p);
  const spot = pickSpot(curve(a, b));
  SPOTS.set(`${a}|${b}`, spot);
  KEEP_OUT.push([spot[0] - 60, spot[1] - 22, 120, 44]);
});
const tagSpot = (a: [number, number], b: [number, number], pt: (t: number) => number[]) => SPOTS.get(`${a}|${b}`) ?? pt(0.5);

type Ghost = {id: PieceId; at: number; yarnAt?: number};

/**
 * The whole board. `land[id]`: the frame a piece drops in (undefined = already there, null = not yet). `threads[id]`: the frame
 * the yarn into that piece draws (default: 12 frames after its landing). `subject`: the coral piece (coral pin and label).
 * `stamps`: rubber stamps [{text, x, y, at, rot}] in board px. `ghost`: an empty dashed slot for the piece still to come, with a
 * coral "?" sticky; with `yarnAt`, the yarn and its tag run to it from the last piece.
 */
export const TgBoard: React.FC<{cam: BoardKey[]; land?: Partial<Record<PieceId, number | null>>; threads?: Partial<Record<PieceId, number>>; subject?: PieceId;
  stamps?: {text: string; x: number; y: number; at: number; rot?: number}[]; ghost?: Ghost; only?: PieceId[]; children?: React.ReactNode}> = ({
  cam, land = {}, threads = {}, subject, stamps = [], ghost, only, children,
}) => {
  const f = useCurrentFrame();
  // `only`: draw just these pieces (a close-up, so nothing sits half-cut at the frame's edge)
  const shown = (p: Piece) => land[p.id] !== null && (!only || only.includes(p.id));
  const landAt = (p: Piece) => land[p.id] ?? -1000;
  const gi = ghost ? PIECES.findIndex((p) => p.id === ghost.id) : -1;
  return (
    <Ctx.Provider value={BRAND}>
      <Defs />
      <BoardStage cam={cam} stamps={stamps.map((s) => s.at)} splats="tg">
        {/* the worn logo sticker in a corner */}
        <div style={{position: 'absolute', left: 1620, top: 930, opacity: 0.8}}><WornLogo w={190} /></div>
        {ghost && f >= ghost.at && (() => {
          const p = PIECES[gi];
          return (
            <>
              <div style={{position: 'absolute', left: p.x, top: p.y, width: p.w, height: p.h, border: '3px dashed rgba(244,239,230,0.3)', borderRadius: 4, transform: `rotate(${p.rot}deg)`}} />
              <Land at={ghost.at + 6} kind="slap" x={p.x + p.w / 2 - 60} y={p.y + p.h / 2 - 56} r={6}>
                <div style={{width: 120, height: 112, background: CORAL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Abril Fatface", serif', fontSize: 70, color: '#1a1a1a'}}>?</div>
              </Land>
            </>
          );
        })()}
        {ghost?.yarnAt !== undefined && gi > 0 && shown(PIECES[gi - 1]) && (
          <Yarn a={pinOf(PIECES[gi - 1])} b={pinOf(PIECES[gi])} at={ghost.yarnAt} tag={PIECES[gi].tag} />
        )}
        {PIECES.map((p, i) => {
          if (!shown(p)) return null;
          const prev = PIECES[i - 1];
          return (
            <React.Fragment key={p.id}>
              <Land at={landAt(p)} kind="drop" x={p.x} y={p.y} r={p.rot} z={10 + i}>
                <PieceView p={p} subject={subject === p.id} mockAt={land[p.id] === undefined ? -999 : landAt(p) + 12} />
              </Land>
              <PinDot at={landAt(p) + 8} xy={pinOf(p)} coral={subject === p.id} />
              {prev && shown(prev) && <Yarn a={pinOf(prev)} b={pinOf(p)} at={threads[p.id] ?? landAt(p) + 12} tag={p.tag} />}
            </React.Fragment>
          );
        })}
        {stamps.map((s, i) => (
          <Land key={i} at={s.at} kind="stamp" x={s.x} y={s.y} r={s.rot ?? -8} z={60}><Stamp text={s.text} size={40} /></Land>
        ))}
        {children}
      </BoardStage>
    </Ctx.Provider>
  );
};

/** The board at chapter `ch`, for chapters 2-6: later pieces are not there yet; this chapter's piece lands at `at` (or, with
 *  `ghost`, only the next slot opens). The camera frames everything shown (yarn tags and labels included, never cut at the edge),
 *  leans 12% toward the new piece as it lands, then settles back. */
export const ChBoard: React.FC<{ch: number; at: number; pull?: number; ghost?: Ghost; children?: React.ReactNode}> = ({ch, at, pull = 75, ghost, children}) => {
  const land: Partial<Record<PieceId, number | null>> = {};
  PIECES.forEach((p) => { if (p.ch > ch) land[p.id] = null; else if (p.ch === ch) land[p.id] = at; });
  const cur = PIECES.find((p) => p.ch === ch)!;
  const framed = PIECES.filter((p) => p.ch <= ch || (ghost && p.id === ghost.id));
  // labels hang ~50 px under a piece and the rotation adds a little: pad the box, then fit it to 16:9
  const x0 = Math.min(...framed.map((p) => p.x)) - 110, x1 = Math.max(...framed.map((p) => p.x + p.w)) + 110;
  const y0 = Math.min(...framed.map((p) => p.y)) - 110, y1 = Math.max(...framed.map((p) => p.y + p.h)) + 150;
  const z = Math.min(1.5, 1920 / (x1 - x0), 1080 / (y1 - y0));
  const [bx, by] = [(x0 + x1) / 2, (y0 + y1) / 2];
  const [cx, cy] = [cur.x + cur.w / 2, cur.y + cur.h / 2];
  const [nx, ny] = [bx + (cx - bx) * 0.12, by + (cy - by) * 0.12];
  const cam: BoardKey[] = [[0, bx, by, z * 0.985], [at, bx, by, z * 0.985], [at + 24, nx, ny, z * 1.02], [at + pull + 30, bx, by, z * 0.99], [at + pull + 400, bx, by, z * 0.97]];
  return (
    <>
      <TgBoard cam={cam} land={land} subject={cur.id} ghost={ghost}>{children}</TgBoard>
      {/* sounds: a tick on the pin, a stamp on the MOCK tag; no paper sounds */}
      <Sfx at={at + 8} src="sfx/tick.wav" volume={0.45} />
      {cur.mock && <Sfx at={at + 12} src="sfx/stamp.wav" volume={0.28} />}
      {ch > 2 && <Sfx at={at + 14} src="sfx/marker_tick.wav" volume={0.03} />}
    </>
  );
};

/** A teal pin (coral for the subject) that pops in once its piece has landed. */
const PinDot: React.FC<{at: number; xy: [number, number]; coral?: boolean}> = ({at, xy, coral}) => {
  if (coral) return <APin at={at} x={xy[0]} y={xy[1]} />;
  return <TealPin at={at} x={xy[0]} y={xy[1]} />;
};
const TealPin: React.FC<{at: number; x: number; y: number}> = ({at, x, y}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 4], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x - 10, top: y - 10, width: 20, height: 20, borderRadius: 10, background: TEAL, zIndex: 50, boxShadow: '2px 3px 0 rgba(0,0,0,0.5)',
      transform: `scale(${0.3 + 0.7 * k})`}}>
      <div style={{position: 'absolute', left: 5, top: 4, width: 6, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.6)'}} />
    </div>
  );
};
