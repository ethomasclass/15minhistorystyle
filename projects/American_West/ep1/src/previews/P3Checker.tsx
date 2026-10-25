// Preview P3 · the land-grant checkerboard: a tilted 3D township where the odd sections rise as orange slabs as the
// coral line passes, then the Act itself on the desk with a focus pull and a coral swipe placed from Gemini's line boxes
// (review/ai_tests/assets/act_lines.json, normalised [ymin, xmin, ymax, xmax] 0-1000 on pacific_railway_act_1862_p4.jpg).
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {boxOf, Finish, Highlight, JF, Note, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame} from '../kit/Kit';
import {sectionNo, TornPrint} from '../samples/kit';
import {IMG, SZ} from '../samples/masks';
import {Desk3D, keys, Lift, shake, Shots, useSlap, zkeys} from './fx';

export const P3_FRAMES = 360;
const PAL = PALETTES.locked;
const COLS = 12;
const ROWS = 8;
const CELL = 92;
const RAIL_ROW = 4;
const RAIL0 = 20;
const PER = 6; // frames per column for the line

/** One odd section rising as a slab (top face, front and side faces), with a contact shadow under it. */
const Slab: React.FC<{r: number; c: number; at: number}> = ({r, c, at}) => {
  const sl = useSlap(at, 1.0);
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 5], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const over = sl.scale < 1 ? (1 - sl.scale) * 60 : 0;
  const h = 26 * k + over + 70 * (1 - k);
  const n = sectionNo(r % 6, c % 6);
  const face = (st: React.CSSProperties, bg: string) => <div style={{position: 'absolute', background: bg, ...st}} />;
  return (
    <div style={{position: 'absolute', left: c * CELL + 4, top: r * CELL + 4, width: CELL - 8, height: CELL - 8, transformStyle: 'preserve-3d'}}>
      <div style={{position: 'absolute', inset: -4, background: 'rgba(0,0,0,0.7)', filter: `blur(${3 + h * 0.25}px)`, transform: `translate(${h * 0.2}px, ${h * 0.3}px)`}} />
      {face({left: 0, top: CELL - 8 - h, width: CELL - 8, height: h, transformOrigin: '50% 100%', transform: 'rotateX(-90deg)'}, '#a85f0a')}
      {face({left: CELL - 8 - h, top: 0, width: h, height: CELL - 8, transformOrigin: '100% 50%', transform: 'rotateY(90deg)'}, '#8a4d08')}
      {face({left: 0, top: 0, width: h, height: CELL - 8, transformOrigin: '0% 50%', transform: 'rotateY(-90deg)'}, '#8a4d08')}
      <div style={{position: 'absolute', inset: 0, transform: `translateZ(${h}px)`, background: boxOf(PAL), boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: JF.mono, fontSize: 24, color: '#111'}}>{n}</div>
    </div>
  );
};

const Township: React.FC = () => {
  const g = useGFrame();
  const W = COLS * CELL;
  const Hh = ROWS * CELL;
  const railP = interpolate(g, [RAIL0, RAIL0 + COLS * PER], [0, 1], clamp);
  const grid = interpolate(g, [0, 10], [0, 1], clamp);
  return (
    <>
      <svg width={W} height={Hh} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <rect width={W} height={Hh} fill="rgba(0,0,0,0.3)" opacity={grid} />
        {Array.from({length: COLS + 1}).map((_, c) => <line key={`v${c}`} x1={c * CELL} y1={0} x2={c * CELL} y2={Hh * grid} stroke={PAL.mark} strokeWidth={c % 6 === 0 ? 5 : 2} opacity={c % 6 === 0 ? 1 : 0.6} />)}
        {Array.from({length: ROWS + 1}).map((_, r) => <line key={`h${r}`} x1={0} y1={r * CELL} x2={W * grid} y2={r * CELL} stroke={PAL.mark} strokeWidth={r % 6 === 0 ? 5 : 2} opacity={r % 6 === 0 ? 1 : 0.6} />)}
        {grid >= 1 && Array.from({length: ROWS * COLS}).map((_, i) => {
          const r = Math.floor(i / COLS);
          const c = i % COLS;
          const n = sectionNo(r % 6, c % 6);
          return n % 2 === 0 ? <text key={i} x={c * CELL + CELL / 2} y={r * CELL + CELL / 2 + 8} textAnchor="middle" fontFamily={JF.mono} fontSize={22} fill="rgba(47,224,196,0.6)">{n}</text> : null;
        })}
      </svg>
      <svg width={W} height={Hh} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', transform: 'translateZ(30px)'}}>
        {railP > 0 && <>
          {Array.from({length: Math.floor((W * railP) / 22)}).map((_, i) => <line key={i} x1={10 + i * 22} y1={RAIL_ROW * CELL - 14} x2={10 + i * 22} y2={RAIL_ROW * CELL + 14} stroke={PAL.subject} strokeWidth={4} />)}
          <line x1={0} y1={RAIL_ROW * CELL} x2={W * railP} y2={RAIL_ROW * CELL} stroke="#050403" strokeWidth={16} />
          <line x1={0} y1={RAIL_ROW * CELL} x2={W * railP} y2={RAIL_ROW * CELL} stroke={PAL.subject} strokeWidth={9} strokeLinecap="round" />
        </>}
      </svg>
      {Array.from({length: ROWS * COLS}).map((_, i) => {
        const r = Math.floor(i / COLS);
        const c = i % COLS;
        const n = sectionNo(r % 6, c % 6);
        return n % 2 === 1 ? <Slab key={i} r={r} c={c} at={RAIL0 + c * PER + 3 + Math.abs(r - RAIL_ROW + 0.5) * 2} /> : null;
      })}
    </>
  );
};

const SlapTitle: React.FC<{text: string; x: number; y: number; size: number; at: number; seed: number}> = ({text, x, y, size, at, seed}) => {
  const s = useSlap(at, 1.35);
  if (!s.on) return null;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${s.scale})`, transformOrigin: `${x + 300}px ${y + 50}px`}}>
      <Highlight text={text} x={x} y={y} size={size} at={at} seed={seed} rot={-2} />
    </div>
  );
};

const Legend: React.FC = () => (
  <div style={{position: 'absolute', left: 110, top: 950, display: 'flex', gap: 40}}>
    {[[boxOf(PAL), 'RAILROAD · ODD SECTIONS'], ['transparent', 'GOVERNMENT · EVEN'], [PAL.subject, 'THE LINE']].map(([c, t]) => (
      <div key={t} style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <div style={{width: t === 'THE LINE' ? 40 : 28, height: t === 'THE LINE' ? 8 : 28, background: c, border: c === 'transparent' ? `2px solid ${PAL.mark}` : undefined}} />
        <span style={{fontFamily: JF.mono, fontSize: 24, letterSpacing: 2, color: '#fff', background: '#0b0a08', padding: '2px 8px'}}>{t}</span>
      </div>
    ))}
  </div>
);

/** 1 · the township in 3D, orbiting slowly while the line draws and the railroad's sections rise. */
const ShotTownship: React.FC = () => {
  const f = useCurrentFrame();
  const W = COLS * CELL;
  const Hh = ROWS * CELL;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #2a2620 0%, #15130f 65%, #0a0907 100%)', perspective: 1500, perspectiveOrigin: '50% 30%', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 960 - W / 2, top: 500 - Hh / 2, width: W, height: Hh, transformStyle: 'preserve-3d', transformOrigin: '50% 50%',
        transform: `scale(${zkeys(f, [[0, 0.86], [170, 1.0]])}) rotateX(${keys(f, [[0, 58], [170, 52]])}deg) rotateZ(${keys(f, [[0, -26], [170, -12]])}deg)`}}>
        <Township />
      </div>
      <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'soft-light', background: 'radial-gradient(circle 800px at 960px 480px, rgba(255,214,160,0.6) 0%, transparent 100%)'}} />
      <SlapTitle text="LAND GRANT" x={110} y={70} size={100} at={8} seed={31} />
      <Note text="every odd section → the railroad" x={120} y={220} size={48} rot={-3} at={RAIL0 + 40} />
      <Legend />
    </AbsoluteFill>
  );
};

type Box = {box_2d: [number, number, number, number]; text: string};
// lines 1-2 of review/ai_tests/assets/act_lines.json (copied here so the bundle does not reach into review/)
const LINES: Box[] = [
  {box_2d: [661, 109, 679, 937], text: 'public stores thereon, every alternate section of public land, desig-'},
  {box_2d: [678, 109, 696, 937], text: 'nated by odd numbers, to the amount of five alternate sections per'},
];
const PAGE_W = 900;
const PAGE_H = PAGE_W * (SZ.act[1] / SZ.act[0]);
/** where "every" starts on line 1 (fraction of page width; measured on the scan) */
const EVERY_X = 0.388;

/** The page lying on the desk: focus pull to the two lines, then the coral swipe along them. */
const ActPage: React.FC<{pullAt: number; swipeAt: number}> = ({pullAt, swipeAt}) => {
  const g = useGFrame();
  const pull = interpolate(g, [pullAt, pullAt + 10], [0, 1], clamp);
  const y0 = (LINES[0].box_2d[0] / 1000) * PAGE_H - 10;
  const y1 = (LINES[1].box_2d[2] / 1000) * PAGE_H + 10;
  const fm = `linear-gradient(to bottom, #000 0px, #000 ${y0 - 18}px, transparent ${y0}px, transparent ${y1}px, #000 ${y1 + 18}px, #000 100%)`;
  const segs = LINES.map((l, i) => {
    const [ymin, xmin, ymax, xmax] = l.box_2d.map((v) => v / 1000);
    const x0 = i === 0 ? EVERY_X : xmin;
    return {x: x0 * PAGE_W, y: ymin * PAGE_H, w: (xmax - x0) * PAGE_W, h: (ymax - ymin) * PAGE_H};
  });
  const total = segs.reduce((a, s) => a + s.w, 0);
  const sp = interpolate(g, [swipeAt, swipeAt + 12], [0, 1], clamp) * total;
  let acc = 0;
  const img = (st: React.CSSProperties) => <Img src={staticFile(IMG.act4)} style={{position: 'absolute', left: 0, top: 0, width: PAGE_W, height: PAGE_H, ...st}} />;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      {img({filter: 'grayscale(1) sepia(0.3) contrast(1.15) brightness(0.9)'})}
      {segs.map((s, i) => {
        const w = Math.max(0, Math.min(s.w, sp - acc));
        acc += s.w;
        return w > 0 ? <div key={i} style={{position: 'absolute', left: s.x, top: s.y, width: w, height: s.h, background: PAL.subject, mixBlendMode: 'multiply', opacity: 0.85}} /> : null;
      })}
      {pull > 0 && <div style={{position: 'absolute', inset: 0, WebkitMaskImage: fm, maskImage: fm} as React.CSSProperties}>
        {img({filter: `grayscale(1) sepia(0.3) blur(${pull * 4}px) brightness(${0.9 - pull * 0.5})`})}
      </div>}
    </div>
  );
};

/** 2 · the Act on the desk: push in, focus pull, swipe; the title page lies under it, out of focus. */
const ShotAct: React.FC = () => {
  const f = useCurrentFrame();
  const a = 170;
  const sh = shake(f, [a + 3], 8);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={keys(f, [[a, 30], [P3_FRAMES, 18]])} z={zkeys(f, [[a, 1.0], [P3_FRAMES, 1.75]])} y={keys(f, [[a, 0], [P3_FRAMES, 60]])} lamp={[900, 520]}>
        <Lift x={60} y={120} w={560} hgt={700} h={2} at={-99} rot={-6} blur={3} seed={4}>
          <TornPrint src={IMG.act1} size={SZ.act} x={0} y={0} w={560} crop={[100, 60, 2000, 2400]} at={-99} seed={9} real grey shadow={4}
            filter="grayscale(1) sepia(0.3) contrast(1.15) brightness(0.8)" />
        </Lift>
        <Lift x={520} y={540 - (0.675 * PAGE_H)} w={PAGE_W} hgt={PAGE_H} h={14} at={a + 1} rot={2} seed={6}>
          <ActPage pullAt={a + 40} swipeAt={a + 62} />
        </Lift>
      </Desk3D>
      <SlapTitle text="EVERY ALTERNATE SECTION" x={110} y={60} size={72} at={a + 20} seed={33} />
      <Note text="odd numbers: the railroad's" x={1080} y={860} size={50} rot={-3} at={a + 90} />
      <Tag text="Pacific Railway Act, 1862, Sec. 3 (Senate Mis. Doc. 108, p. 4) · Library of Congress" x={44} y={1036} />
    </AbsoluteFill>
  );
};

export const P3Checker: React.FC = () => (
  <PaletteCtx.Provider value={PAL}>
    <StepCtx.Provider value={2.5}>
      <AbsoluteFill style={{background: '#000'}}>
        <Shots shots={[[0, <ShotTownship />], [170, <ShotAct />, 'whip']]} />
        <Finish vignette={0.3} />
      </AbsoluteFill>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
