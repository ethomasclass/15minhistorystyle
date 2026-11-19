// Thanksgiving: the collage board (techniques/collage_board.md, kit/board.tsx). One piece per chapter, in fixed slots, so
// every chapter's board beat shows the same board growing: the eel (ch2), the turtle (ch3), the calf's head (ch4), Hale
// (ch5), the Jell-O mould (ch6), the can (ch7), the turkey (ch8). A MOCK tag sits on each fake. Teal yarn with a "but" /
// "therefore" tag runs from the previous chapter's piece to the new one. The ending pulls back to the whole board.
//
//   <TgBoard ch={5} at={...} />   the board as it stands at chapter `ch`: earlier pieces already pinned, this chapter's
//                                  piece drops at `at`, its pin pops, its label reveals, the yarn draws from the last piece,
//                                  and the camera eases from close on the new piece back to the board.
// Pieces whose assets haven't landed are placeholder cards (Ph). Swap a piece by giving its slot a `node`.
import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp} from '../lib/anim';
import {BoardStage, BRAND, Ctx, Defs, HAND, Land, MONO, torn, WornLogo} from './board';
import {useGFrame} from './Kit';
import {Sfx} from './common';
import {PhLabel, PH_BG} from './tg_placeholder';

const TEAL = '#2FE0C4';
const CORAL = '#FF6F61';

export type Slot = {ch: number; x: number; y: number; w: number; h: number; r: number; label: string; mock?: boolean; link?: 'but' | 'therefore';
  file: string; node?: React.ReactNode};

/** The Jell-O piece: the real 1920 booklet's Paradise Pudding (a lemon Jell-O mould), cut from page 2, in its own colour. */
const JelloPiece: React.FC<{w: number; h: number}> = ({w, h}) => {
  // source crop of jello-girl-gives-a-party-1920-p2.jpg (2472 x 3351): the pudding on its plate, x 120-1960, y 60-1120
  const [cx, cy, cw, ch] = [120, 60, 1840, 1060];
  const sc = Math.max(w / cw, h / ch);
  return (
    <div style={{position: 'relative', width: w, height: h, overflow: 'hidden', clipPath: torn('jp', 'lrtb', 6)}}>
      <Img src={staticFile('img/arch/jello-girl-gives-a-party-1920-p2.jpg')} style={{position: 'absolute', left: -cx * sc, top: -cy * sc, width: 2472 * sc, height: 3351 * sc,
        filter: 'contrast(1.05) saturate(0.95)'}} />
    </div>
  );
};

/** The eel (ch2): frame 0 of the Flow cut-out, B&W on the board. */
const EelPiece: React.FC<{w: number; h: number}> = ({w, h}) => (
  <div style={{width: w, height: h, background: '#1b1a17', clipPath: torn('ep', 'lrtb', 6), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <Img src={staticFile('img/flow/eel/eel_0000.png')} style={{width: w * 1.25, filter: 'grayscale(1) contrast(1.15)'}} />
  </div>
);

export const TG_SLOTS: Slot[] = [
  {ch: 2, x: 150, y: 150, w: 330, h: 220, r: -3, label: 'EELS · 1621', file: 'img/flow/eel/eel_0000.png', node: <EelPiece w={330} h={220} />},
  {ch: 3, x: 590, y: 110, w: 300, h: 260, r: 2, label: 'TURTLE SOUP · 1796', link: 'therefore', file: 'img/props/turtle_plate.webp'},
  {ch: 4, x: 1000, y: 160, w: 300, h: 240, r: -2, label: 'MOCK TURTLE · 1884', mock: true, link: 'but', file: 'img/props/calf_head.webp'},
  {ch: 5, x: 1420, y: 100, w: 290, h: 370, r: 3, label: 'SARAH JOSEPHA HALE · 1863', link: 'but', file: 'img/arch/hale_portrait.jpg'},
  {ch: 6, x: 260, y: 600, w: 380, h: 250, r: 2, label: 'JELL-O · 1897', mock: true, link: 'therefore', file: 'img/arch/jello-girl-gives-a-party-1920-p2.jpg',
    node: <JelloPiece w={380} h={250} />},
  {ch: 7, x: 800, y: 620, w: 280, h: 300, r: -3, label: 'THE CAN · 1941', mock: true, link: 'therefore', file: 'img/props/cranberry_can.webp'},
  {ch: 8, x: 1280, y: 590, w: 420, h: 330, r: 2, label: 'THE TURKEY', link: 'therefore', file: 'img/arch/large-white-turkey-female-usda-ars.jpg'},
];

const pinOf = (s: Slot): [number, number] => [s.x + s.w / 2, s.y + 14];

const BoardPin: React.FC<{x: number; y: number; color: string; at?: number}> = ({x, y, color, at = -999}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at) return null;
  const k = at < -900 ? 1 : spring({frame: f - at, fps, config: {damping: 9, stiffness: 300}});
  return (
    <div style={{position: 'absolute', left: x - 11, top: y - 11, width: 22, height: 22, borderRadius: 11, background: color, zIndex: 50, boxShadow: '2px 3px 0 rgba(0,0,0,0.5)',
      transform: `scale(${0.3 + 0.7 * k})`}}>
      <div style={{position: 'absolute', left: 5, top: 4, width: 7, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.6)'}} />
    </div>
  );
};

/** The piece itself: its node, or a placeholder card. */
const Piece: React.FC<{s: Slot}> = ({s}) => (s.node ? <>{s.node}</> : (
  <div style={{position: 'relative', width: s.w, height: s.h, background: PH_BG, clipPath: torn(`ph${s.ch}`, 'lrtb', 6)}}>
    <PhLabel file={s.file} what={`ch${s.ch} board piece`} scale={0.8} />
  </div>
));

const Label: React.FC<{s: Slot; p?: number; subject?: boolean}> = ({s, p = 1, subject}) => (
  <div style={{position: 'absolute', left: s.x + 10, top: s.y + s.h - 6, transform: `rotate(${s.r * -0.6}deg)`, zIndex: 30, clipPath: `inset(-20% ${(1 - p) * 100}% -20% 0)`}}>
    <div style={{background: subject ? '#f3c6bf' : '#ece6d8', clipPath: torn(`lb${s.ch}`, 'lr', 5), padding: '5px 16px', fontFamily: MONO, fontSize: 21, letterSpacing: 1,
      color: '#1a1a1a', whiteSpace: 'nowrap', filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,0.5))'}}>{s.label}</div>
  </div>
);

const SmallMock: React.FC<{s: Slot; at?: number}> = ({s, at = -999}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = at < -900 ? 1 : interpolate(g, [at, at + 2.5, at + 5], [1.7, 0.94, 1], clamp);
  return (
    <div style={{position: 'absolute', left: s.x + s.w - 150, top: s.y + 30, transform: `rotate(-10deg) scale(${k})`, zIndex: 35, filter: 'drop-shadow(4px 5px 0 rgba(0,0,0,0.55))'}}>
      <div style={{background: '#FF9F1C', clipPath: torn(`mk${s.ch}`, 'tb', 4), padding: '4px 18px 2px', fontFamily: '"Abril Fatface", serif', fontSize: 44, color: '#111', letterSpacing: 2}}>MOCK</div>
    </div>
  );
};

/** Yarn with a little sag, drawn pin to pin from `at` (stepped), and its paper tag. */
const Yarn: React.FC<{a: [number, number]; b: [number, number]; word: string; at?: number}> = ({a, b, word, at = -999}) => {
  const g = useGFrame();
  const q = at < -900 ? 1 : interpolate(g, [at, at + 14], [0, 1], clamp);
  if (q <= 0) return null;
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 + Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.08;
  const tag = q >= 1;
  // the tag sits 65% of the way along (clear of the pieces the yarn passes)
  const k = 0.65;
  const tx = (1 - k) ** 2 * a[0] + 2 * k * (1 - k) * mx + k * k * b[0];
  const ty = (1 - k) ** 2 * a[1] + 2 * k * (1 - k) * my + k * k * b[1];
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, zIndex: 40, overflow: 'visible'}}>
        <path d={`M${a[0]},${a[1]} Q${mx},${my} ${b[0]},${b[1]}`} fill="none" stroke={TEAL} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - q} />
      </svg>
      {tag && <div style={{position: 'absolute', left: tx - 50, top: ty - 22, zIndex: 45, transform: 'rotate(-4deg)',
        background: '#ece6d8', clipPath: torn(`yt${word}${a[0]}`, 'lrtb', 4), padding: '0 16px 4px', fontFamily: HAND, fontSize: 44, color: '#0f3e37',
        filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,0.5))'}}>{word}</div>}
    </>
  );
};

/**
 * The board at chapter `ch`. The new piece drops at `at`; pin +6, label +9, MOCK +12 (if a fake), yarn +16. The camera
 * starts close on the new piece and eases back to the whole board by `at + pull`.
 */
export const TgBoard: React.FC<{ch: number; at: number; pull?: number; children?: React.ReactNode}> = ({ch, at, pull = 75, children}) => {
  const g = useGFrame();
  const slots = TG_SLOTS.filter((s) => s.ch <= ch);
  const cur = TG_SLOTS.find((s) => s.ch === ch)!;
  const prev = TG_SLOTS.filter((s) => s.ch < ch).slice(-1)[0];
  const cx = cur.x + cur.w / 2, cy = cur.y + cur.h / 2;
  // pull back to frame the pieces pinned so far (the whole board once the last row is in), never past z 1
  const x0 = Math.min(...slots.map((s) => s.x)) - 90, x1 = Math.max(...slots.map((s) => s.x + s.w)) + 90;
  const y0 = Math.min(...slots.map((s) => s.y)) - 90, y1 = Math.max(...slots.map((s) => s.y + s.h)) + 200;
  const zw = Math.min(1, 1920 / (x1 - x0), 1080 / (y1 - y0));
  const [bx, by] = [(x0 + x1) / 2, (y0 + y1) / 2];
  // the board framed from the start (a tight start on the new piece cut neighbours' labels at the frame edge), easing a
  // little toward the new piece as it lands, then settling back
  const [nx, ny] = [bx + (cx - bx) * 0.12, by + (cy - by) * 0.12];
  const cam: [number, number, number, number][] = [[0, bx, by, zw * 0.985], [at, bx, by, zw * 0.985], [at + 24, nx, ny, zw * 1.02], [at + pull + 30, bx, by, zw * 0.99],
    [at + pull + 400, bx, by, zw * 0.97]];
  const labelP = interpolate(g, [at + 9, at + 18], [0, 1], clamp);
  return (
    <Ctx.Provider value={BRAND}>
      <Defs />
      <BoardStage cam={cam}>
        <div style={{position: 'absolute', left: 1640, top: 960, opacity: 0.8}}><WornLogo w={200} /></div>
        {slots.map((s) => {
          const isCur = s.ch === ch;
          const inner = <Piece s={s} />;
          return (
            <React.Fragment key={s.ch}>
              {isCur ? <Land at={at} kind="drop" x={s.x} y={s.y} r={s.r} z={20}>{inner}</Land>
                : <div style={{position: 'absolute', left: s.x, top: s.y, transform: `rotate(${s.r}deg)`, zIndex: 20, filter: 'drop-shadow(5px 6px 0 rgba(0,0,0,0.55))',
                  opacity: 0.9}}>{inner}</div>}
              <BoardPin x={pinOf(s)[0]} y={pinOf(s)[1]} color={isCur ? CORAL : TEAL} at={isCur ? at + 6 : -999} />
              {(!isCur || g >= at + 9) && <Label s={s} p={isCur ? labelP : 1} subject={isCur} />}
              {s.mock && <SmallMock s={s} at={isCur ? at + 12 : -999} />}
            </React.Fragment>
          );
        })}
        {slots.filter((s) => s.link).map((s) => {
          const p = TG_SLOTS.find((q) => q.ch === s.ch - 1);
          if (!p) return null;
          return <Yarn key={`y${s.ch}`} a={pinOf(p)} b={pinOf(s)} word={s.link!} at={s.ch === ch ? at + 16 : -999} />;
        })}
        {children}
      </BoardStage>
      {/* sounds: a tick on the pin, a stamp on the MOCK tag; no paper sounds (Sfx mutes them) */}
      <Sfx at={at + 6} src="sfx/tick.wav" volume={0.45} />
      {cur.mock && <Sfx at={at + 12} src="sfx/stamp.wav" volume={0.28} />}
      {prev && <Sfx at={at + 14} src="sfx/marker_tick.wav" volume={0.03} />}
    </Ctx.Provider>
  );
};

