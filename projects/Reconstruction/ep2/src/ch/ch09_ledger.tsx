// Chapter 9: drawn pieces (plain: no numbers, no jokes).
//   YearLine   a year from planting to harvest; the months a family has to eat before the crop is sold
//   Ledger     settling up, line by line as narrated, in bars (no dollar figures): the crop sold, the family's half,
//              minus the store, plus interest, = owes (a bar on the wrong side of zero)
//   YearCard   another year's page, already behind: it opens with last year's debt carried over
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {Sfx} from '../kit/common';
import {JF, useGFrame} from '../kit/Kit';
import {TEAL, tornPoly} from '../kit/vox';
import {Ink, wob} from './ch08_draw';

const CREAM = '#f4efe6';
const PAPER = '#ece6d8';
const INKC = '#0f3e37';
const DEEP = '#1f7d6e';
const RED = '#e2554a';
const HAND = '"Nanum Pen Script", cursive';

// ------------------------------------------------------------------------------------------------ the year
const MONTHS = 'JFMAMJJASOND'.split('');
const X0 = 230, X1 = 1690, LY = 560;
const mx = (i: number) => X0 + (i * (X1 - X0)) / 11;

/** The year: the crop grows from spring to the harvest; the family eats all the months before it. */
export const YearLine: React.FC<{grow: number; harvest: number; eat: number}> = ({grow, harvest, eat}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const crop = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `${i ? 'L' : 'M'}${mx(i + 0.5).toFixed(1)},${(LY - 14 - 210 * Math.pow(i / 9, 1.4)).toFixed(1)}`).join(' ');
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <Ink d={wob(X0 - 20, LY, X1 + 20, LY, 'yl', 2)} at={2} dur={10} width={4} color={CREAM} />
        {MONTHS.map((_, i) => <Ink key={i} d={wob(mx(i), LY - 10, mx(i), LY + 10, `t${i}`, 0.5)} at={4 + i} dur={3} width={3} color={CREAM} />)}
        <Ink d={crop} at={grow} dur={40} width={7} color={TEAL} />
        <Ink d={wob(mx(9.5), 250, mx(9.5), LY - 4, 'hv', 2)} at={harvest} dur={6} width={4} color={CREAM} dash="12 10" />
        <Ink d={`M${mx(0)},${LY + 70} L${mx(0)},${LY + 86} L${mx(9.4)},${LY + 86} L${mx(9.4)},${LY + 70}`} at={eat} dur={10} width={5} color={CREAM} />
      </svg>
      {MONTHS.map((m, i) => (
        <div key={i} style={{position: 'absolute', left: mx(i) - 20, width: 40, top: LY + 18, textAlign: 'center', fontFamily: JF.mono, fontSize: 26, color: CREAM,
          opacity: interpolate(g, [4 + i, 7 + i], [0, 0.85], clamp)}}>{m}</div>
      ))}
      {f >= grow + 10 && <div style={{position: 'absolute', left: mx(4.2), top: LY - 200, fontFamily: HAND, fontSize: 60, color: TEAL, transform: 'rotate(-14deg)',
        opacity: interpolate(g, [grow + 10, grow + 16], [0, 1], clamp)}}>the crop</div>}
      <Sfx at={2} src="sfx/tick.wav" volume={0.35} />
    </>
  );
};

// ------------------------------------------------------------------------------------------------ the ledger
/** Card geometry (card px): label column on the left, a zero line, bars to the right (made) or left (owed). */
const CW = 1520, CH = 830, ZX = 640, U = 8.2, BH = 60;
const ROWS = [200, 320, 440, 560, 730];
const bx = (v: number) => ZX + v * U;

export type LedgerCues = {sold: number; half: number; store: number; storeEnd: number; interest: number; interestEnd: number; owes: number};

/** A torn cream page with faint rules, landing at `at`. Children in card px. */
const Page: React.FC<{x: number; y: number; w: number; h: number; s?: number; rot?: number; at: number; seed: string; dim?: number; children: React.ReactNode}> = ({
  x, y, w, h, s = 1, rot = 0, at, seed, dim = 0, children,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 4, at + 7], [1.12, 0.98, 1], clamp);
  const dy = interpolate(f, [at, at + 5], [-40, 0], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y + dy, width: w, height: h, transform: `rotate(${rot}deg) scale(${s * k})`, transformOrigin: '0 0',
      opacity: interpolate(f, [at, at + 2], [0, 1], clamp), filter: 'drop-shadow(8px 12px 0 rgba(0,0,0,0.45)) drop-shadow(0 18px 30px rgba(0,0,0,0.55))'}}>
      <div style={{position: 'absolute', inset: 0, clipPath: tornPoly(seed, w, h, 9), background: PAPER,
        backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 119px, rgba(15,62,55,0.14) 119px, rgba(15,62,55,0.14) 121px)', backgroundPosition: '0 30px'}}>
        {children}
        {dim > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(10,9,7,${dim})`}} />}
      </div>
    </div>
  );
};

const Label: React.FC<{text: string; y: number; at: number; size?: number; color?: string}> = ({text, y, at, size = 58, color = INKC}) => {
  const g = useGFrame();
  if (g < at) return null;
  const w = interpolate(g, [at, at + 8], [0, 1], clamp);
  return <div style={{position: 'absolute', left: 60, top: y - size * 0.55, fontFamily: HAND, fontSize: size, lineHeight: 1, color, whiteSpace: 'nowrap',
    clipPath: `inset(-20% ${(1 - w) * 100}% -20% -5%)`}}>{text}</div>;
};

/** A bar from value a to value b (card px row y), growing from `from` toward `to`'s end over frames [at, end]. */
const Bar: React.FC<{a: number; b: number; y: number; at: number; end: number; color: string; grow?: 'right' | 'left'; outline?: boolean}> = ({a, b, y, at, end, color, grow = 'right', outline}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, Math.max(at + 1, end)], [0, 1], clamp);
  const lo = Math.min(a, b), hi = Math.max(a, b);
  const L = grow === 'right' ? bx(lo) : bx(hi) - (bx(hi) - bx(lo)) * p;
  const W = (bx(hi) - bx(lo)) * p;
  return outline
    ? <div style={{position: 'absolute', left: L, top: y - BH / 2, width: W, height: BH, border: `3px dashed ${color}`, boxSizing: 'border-box', opacity: 0.6}} />
    : <div style={{position: 'absolute', left: L, top: y - BH / 2, width: W, height: BH, background: color, opacity: 0.9,
      clipPath: 'polygon(0 4%, 100% 0, 99.6% 96%, 0.4% 100%)'}} />;
};

const Axis: React.FC<{at: number; top: number; bottom: number}> = ({at, top, bottom}) => (
  <svg width={CW} height={CH} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <Ink d={wob(ZX, top, ZX, bottom, 'ax', 1)} at={at} dur={8} width={3} color={INKC} dash="10 8" fixed={false} />
  </svg>
);

/** Settling up, line by line. Before `from` everything is already written (for a cut back to it). */
export const Ledger: React.FC<{c: LedgerCues; at: number; x?: number; y?: number; s?: number; rot?: number; dim?: number; from?: number}> = ({c, at, x = 200, y = 112, s = 1, rot = -0.6, dim = 0, from = -1e6}) => {
  const pre = (v: number) => (v < from ? from - 400 : v);
  return (
    <Page x={x} y={y} w={CW} h={CH} s={s} rot={rot} at={pre(at)} seed="ledger" dim={dim}>
      <div style={{position: 'absolute', left: 60, top: 34, fontFamily: HAND, fontSize: 80, lineHeight: 1, color: INKC}}>settling up</div>
      <div style={{position: 'absolute', left: ZX - 14, top: 112, fontFamily: JF.mono, fontSize: 26, color: INKC, opacity: 0.7}}>0</div>
      <Axis at={pre(at) + 2} top={150} bottom={780} />
      <Label text="the crop, sold" y={ROWS[0]} at={pre(c.sold)} />
      <Bar a={0} b={100} y={ROWS[0]} at={pre(c.sold) + 2} end={pre(c.sold) + 14} color={DEEP} />
      <Label text="the family's half" y={ROWS[1]} at={pre(c.half)} />
      <Bar a={0} b={50} y={ROWS[1]} at={pre(c.half) + 2} end={pre(c.half) + 10} color={DEEP} />
      <Bar a={50} b={100} y={ROWS[1]} at={pre(c.half) + 8} end={pre(c.half) + 9} color={INKC} outline />
      {useGFrame() >= pre(c.half) + 10 && <div style={{position: 'absolute', left: bx(57), top: ROWS[1] - 22, fontFamily: HAND, fontSize: 42, color: INKC, opacity: 0.6}}>the planter's half</div>}
      <Label text="minus the store" y={ROWS[2]} at={pre(c.store)} />
      <Bar a={-6} b={50} y={ROWS[2]} at={pre(c.store) + 2} end={pre(c.storeEnd)} color={RED} grow="left" />
      <Label text="plus interest" y={ROWS[3]} at={pre(c.interest)} />
      <Bar a={-18} b={-6} y={ROWS[3]} at={pre(c.interest) + 2} end={pre(c.interestEnd)} color={RED} grow="left" />
      <svg width={CW} height={CH} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <Ink d={wob(50, 640, CW - 50, 640, 'r1', 1.5)} at={pre(c.owes) - 6} dur={6} width={3} color={INKC} fixed={false} />
        <Ink d={wob(50, 650, CW - 50, 650, 'r2', 1.5)} at={pre(c.owes) - 3} dur={6} width={3} color={INKC} fixed={false} />
      </svg>
      <Label text="= owes" y={ROWS[4]} at={pre(c.owes)} size={70} color="#8f2a20" />
      <Bar a={-18} b={0} y={ROWS[4]} at={pre(c.owes) + 1} end={pre(c.owes) + 7} color={RED} grow="left" />
      {[c.sold, c.half, c.store, c.interest].filter((v) => v >= from).map((v) => <Sfx key={v} at={v} src="sfx/marker_tick.wav" volume={0.25} />)}
    </Page>
  );
};

/** Another year's page: it opens already behind (last year's debt carried over). */
export const YearCard: React.FC<{title: string; x: number; y: number; rot: number; at: number; seed: string; s?: number}> = ({title, x, y, rot, at, seed, s = 0.62}) => (
  <>
    <Page x={x} y={y} w={CW} h={420} s={s} rot={rot} at={at} seed={seed}>
      <div style={{position: 'absolute', left: 60, top: 34, fontFamily: HAND, fontSize: 80, lineHeight: 1, color: INKC}}>{title}</div>
      <Axis at={at} top={150} bottom={380} />
      <Label text="carried over" y={ROWS[0] + 60} at={at} />
      <Bar a={-18} b={0} y={ROWS[0] + 60} at={at} end={at + 1} color={RED} />
    </Page>
    <Sfx at={at} src="sfx/page_turn.wav" volume={0.4} />
  </>
);
