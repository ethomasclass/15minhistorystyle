// The Thanksgiving collage board, whole (techniques/collage_board.md): one piece per chapter (the eel, the turtle, the mock
// turtle, Hale, the Jell-O mould, the can, the turkey), teal yarn pin to pin with but / therefore tags, a MOCK tape on each
// fake. Ch7 lands the can, ch8 lands the turkey and the ending pulls back to the whole board. Earlier chapters can land their
// own piece with the same layout (`land={{eel: at(...)}}`), so every chapter's board shot matches the final one.
//   <TgBoard cam={[[f, x, y, zoom], ...]} land={{can: f}} subject="can" threads={{can: f}} stamps={[...]} />
// Board pixels: 1920 x 1080 at zoom 1. A piece with no `land` frame is already on the board; one with `null` is not there yet.
import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {APin, BRAND, BoardStage, type BoardKey, Ctx, Defs, Land, Stamp, Strip, WornLogo} from './board';
import {useGFrame} from './Kit';
import {BW, CORAL, MockTape, PH, TEAL} from './tg_late';

export type PieceId = 'eel' | 'turtle' | 'mock' | 'hale' | 'jello' | 'can' | 'turkey';
type Piece = {id: PieceId; x: number; y: number; w: number; h: number; rot: number; label: string; src: string; ph?: boolean; what?: string;
  fit?: 'cover' | 'contain'; pos?: string; colour?: boolean; mock?: boolean; tag?: 'but' | 'therefore'};

/** In chapter order. `tag` is the word on the yarn from the previous piece. */
export const PIECES: Piece[] = [
  {id: 'eel', x: 120, y: 170, w: 280, h: 160, rot: -3, label: 'EELS · 1621', src: 'img/flow/eel/eel_0000.png', fit: 'contain', colour: true},
  {id: 'turtle', x: 410, y: 520, w: 190, h: 250, rot: 2, label: 'TURTLE · 1796', src: 'img/arch/simmons-1796-to-dress-a-turtle-p1.jpg', pos: '50% 18%', tag: 'but'},
  {id: 'mock', x: 680, y: 150, w: 190, h: 250, rot: -2, label: 'MOCK TURTLE · 1884', src: 'img/arch/mock-turtle-soup-boston-cook-book-1884.jpg', pos: '50% 30%', mock: true, tag: 'therefore'},
  {id: 'hale', x: 935, y: 520, w: 190, h: 250, rot: 3, label: 'SARAH HALE · 1863', src: 'img/arch/hale_portrait.jpg', ph: true, what: 'Hale portrait (ch5)', tag: 'but'},
  {id: 'jello', x: 1190, y: 150, w: 190, h: 260, rot: -3, label: 'JELL-O · 1920', src: 'img/arch/jello-girl-gives-a-party-1920-cover.jpg', pos: '50% 20%', mock: true, tag: 'therefore'},
  {id: 'can', x: 1430, y: 560, w: 230, h: 190, rot: 2, label: 'THE CAN · 1941', src: 'img/flow/cran/cran_cut6.png', fit: 'contain', colour: true, mock: true, tag: 'therefore'},
  {id: 'turkey', x: 1610, y: 150, w: 190, h: 270, rot: -2, label: 'BROAD-BREASTED WHITE', src: 'img/arch/large-white-turkey-female-usda-ars.jpg', pos: '50% 30%', tag: 'therefore'},
];
export const piece = (id: PieceId) => PIECES.find((p) => p.id === id)!;
/** Where a piece's pin sits (board px): top-centre. */
export const pinOf = (p: Piece): [number, number] => [p.x + p.w / 2, p.y + 10];
/** A piece's centre (for camera keys). */
export const centreOf = (id: PieceId): [number, number] => { const p = piece(id); return [p.x + p.w / 2, p.y + p.h / 2 + 20]; };

const PieceView: React.FC<{p: Piece; subject: boolean}> = ({p, subject}) => (
  <div style={{position: 'relative', width: p.w}}>
    {p.ph ? <PH file={p.src} what={p.what} w={p.w} h={p.h} fit="cover" shadow={false} />
      : <Img src={staticFile(p.src)} style={{width: p.w, height: p.h, objectFit: p.fit ?? 'cover', objectPosition: p.pos ?? '50% 50%', display: 'block',
        filter: p.colour ? 'saturate(0.85)' : BW}} />}
    <div style={{position: 'absolute', left: -6, top: p.h + 8}}>
      <Strip text={p.label} size={20} seed={p.id} bg={subject ? CORAL : undefined} />
    </div>
    {p.mock && <div style={{position: 'absolute', left: p.w - 70, top: p.h - 6}}><MockTape x={0} y={0} at={-999} size={28} rot={-8} seed={p.id.length * 7} /></div>}
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
  const [tx, ty] = pt(0.5);
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, zIndex: 40, overflow: 'visible'}}>
        <polyline points={pts} fill="none" stroke={TEAL} strokeWidth={3} strokeLinecap="round" />
      </svg>
      {tag && q >= 1 && <YarnTag x={tx} y={ty} text={tag} at={at + THREAD} />}
    </>
  );
};

/**
 * The whole board. `land[id]`: the frame a piece drops in (undefined = already there, null = not yet). `threads[id]`: the frame
 * the yarn into that piece draws (default: with its landing). `subject`: the coral piece (coral pin and label). `stamps`: rubber
 * stamps [{text, x, y, at, rot}] in board px. `ghost`: an empty dashed slot for a piece still to come, with a coral "?" sticky.
 */
export const TgBoard: React.FC<{cam: BoardKey[]; land?: Partial<Record<PieceId, number | null>>; threads?: Partial<Record<PieceId, number>>; subject?: PieceId;
  stamps?: {text: string; x: number; y: number; at: number; rot?: number}[]; ghost?: {id: PieceId; at: number}; children?: React.ReactNode}> = ({
  cam, land = {}, threads = {}, subject, stamps = [], ghost, children,
}) => {
  const f = useCurrentFrame();
  const shown = (p: Piece) => land[p.id] !== null;
  const landAt = (p: Piece) => land[p.id] ?? -1000;
  return (
    <Ctx.Provider value={BRAND}>
      <Defs />
      <BoardStage cam={cam} stamps={stamps.map((s) => s.at)} splats="tg">
        {/* the brand's cracks, very faint, and the worn logo sticker in a corner */}
        <div style={{position: 'absolute', left: 1620, top: 930, opacity: 0.8}}><WornLogo w={190} /></div>
        {ghost && f >= ghost.at && (() => {
          const p = piece(ghost.id);
          return (
            <>
              <div style={{position: 'absolute', left: p.x, top: p.y, width: p.w, height: p.h, border: '3px dashed rgba(244,239,230,0.3)', borderRadius: 4, transform: `rotate(${p.rot}deg)`}} />
              <Land at={ghost.at + 6} kind="slap" x={p.x + p.w / 2 - 60} y={p.y + p.h / 2 - 60} r={6}>
                <div style={{width: 120, height: 112, background: CORAL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Abril Fatface", serif', fontSize: 70, color: '#1a1a1a'}}>?</div>
              </Land>
            </>
          );
        })()}
        {PIECES.map((p, i) => {
          if (!shown(p)) return null;
          const prev = PIECES[i - 1];
          return (
            <React.Fragment key={p.id}>
              <Land at={landAt(p)} kind="drop" x={p.x} y={p.y} r={p.rot} z={10 + i}>
                <PieceView p={p} subject={subject === p.id} />
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

/** A teal pin (coral for the subject) that pops in once its piece has landed. */
const PinDot: React.FC<{at: number; xy: [number, number]; coral?: boolean}> = ({at, xy, coral}) => {
  if (!coral) return <TealPin at={at} x={xy[0]} y={xy[1]} />;
  return <APin at={at} x={xy[0]} y={xy[1]} />;
};
const TealPin: React.FC<{at: number; x: number; y: number}> = ({at, x, y}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = Math.min(1, (f - at) / 4);
  return (
    <div style={{position: 'absolute', left: x - 10, top: y - 10, width: 20, height: 20, borderRadius: 10, background: TEAL, zIndex: 50, boxShadow: '2px 3px 0 rgba(0,0,0,0.5)',
      transform: `scale(${0.3 + 0.7 * k})`}}>
      <div style={{position: 'absolute', left: 5, top: 4, width: 6, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.6)'}} />
    </div>
  );
};
