// Chapter 8: drawn pieces. Line-drawn in teal on the dark desk, stepping at 12 fps like every mark.
//   Have      the problem as a table: PLANTERS / FREEDPEOPLE × LAND / LABOR / MONEY, ✓ and ✗ written in as said
//   Farm      one family, step by step: the planter's land divided into small farms, the camera moving in on one; who
//             provides what; the crop split half and half (sharecropping) or a fixed rent off the top (tenant farming)
//   Cross     a coral ✕ drawn over a picture
import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {Sfx} from '../kit/common';
import {Person} from '../kit/figures';
import {JF, useGFrame} from '../kit/Kit';
import {CORAL, TEAL} from '../kit/rc';

const CREAM = '#f4efe6';
const HAND = '"Nanum Pen Script", cursive';

/** A hand-drawn straight line as a slightly wobbly polyline (path d). */
export const wob = (x1: number, y1: number, x2: number, y2: number, seed: string, amp = 3, n = 8) => {
  const pts: string[] = [];
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const j = i === 0 || i === n ? 0 : (random(`${seed}${i}`) - 0.5) * 2 * amp;
    pts.push(`${(x1 + (x2 - x1) * t + nx * j).toFixed(1)},${(y1 + (y2 - y1) * t + ny * j).toFixed(1)}`);
  }
  return `M${pts.join(' L')}`;
};

/** A rough rectangle path (four wobbly sides, corners overshooting a little). */
export const roughRect = (x: number, y: number, w: number, h: number, seed: string, amp = 3) =>
  [wob(x - 4, y, x + w + 3, y + 1, `${seed}a`, amp), wob(x + w, y - 3, x + w + 1, y + h + 4, `${seed}b`, amp),
    wob(x + w + 4, y + h, x - 3, y + h - 1, `${seed}c`, amp), wob(x, y + h + 3, x + 1, y - 4, `${seed}d`, amp)].join(' ');

/** A path drawing on from `at` over `dur` frames (stepped). Use inside an <svg>. */
export const Ink: React.FC<{d: string; at: number; dur?: number; color?: string; width?: number; dash?: string; opacity?: number; fixed?: boolean}> = ({
  d, at, dur = 8, color = TEAL, width = 5, dash, opacity = 1, fixed = true,
}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  return dash
    ? <path d={d} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dash} strokeLinecap="round" opacity={opacity * p} vectorEffect={fixed ? 'non-scaling-stroke' : undefined} />
    : <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={opacity}
      vectorEffect={fixed ? 'non-scaling-stroke' : undefined} />;
};

/** Text that pops in at `at` (absolute, centred on x when `center`). */
const Pop: React.FC<{at: number; x: number; y: number; center?: boolean; style: React.CSSProperties; children: React.ReactNode}> = ({at, x, y, center, style, children}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 3, at + 6], [1.2, 0.97, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, whiteSpace: 'nowrap', opacity: interpolate(f, [at, at + 2], [0, 1], clamp),
      transform: `${center ? 'translateX(-50%) ' : ''}scale(${k})`, transformOrigin: center ? '0 50%' : 'left center', ...style}}>{children}</div>
  );
};

const check = (cx: number, cy: number, s = 1) => `M${cx - 34 * s},${cy + 2 * s} L${cx - 10 * s},${cy + 28 * s} L${cx + 38 * s},${cy - 32 * s}`;
const crossA = (cx: number, cy: number, s = 1) => `M${cx - 30 * s},${cy - 30 * s} L${cx + 30 * s},${cy + 30 * s}`;
const crossB = (cx: number, cy: number, s = 1) => `M${cx + 30 * s},${cy - 30 * s} L${cx - 30 * s},${cy + 30 * s}`;

/** A ✓ (teal) or ✗ (coral) written in at `at`. */
export const Mark: React.FC<{ok: boolean; cx: number; cy: number; at: number; s?: number}> = ({ok, cx, cy, at, s = 1}) => (
  <>
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {ok ? <Ink d={check(cx, cy, s)} at={at} dur={5} width={9} color={TEAL} />
        : <><Ink d={crossA(cx, cy, s)} at={at} dur={3} width={9} color={CORAL} /><Ink d={crossB(cx, cy, s)} at={at + 3} dur={3} width={9} color={CORAL} /></>}
    </svg>
    <Sfx at={at} src="sfx/marker_tick.wav" volume={0.22} />
  </>
);

/** A big coral ✕ drawn over a picture (screen px). */
export const Cross: React.FC<{cx: number; cy: number; r: number; at: number}> = ({cx, cy, r, at}) => (
  <>
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.6))'}}>
      <Ink d={wob(cx - r, cy - r * 0.8, cx + r, cy + r * 0.8, 'xa', 8)} at={at} dur={5} width={22} color={CORAL} />
      <Ink d={wob(cx + r, cy - r * 0.8, cx - r, cy + r * 0.8, 'xb', 8)} at={at + 4} dur={5} width={22} color={CORAL} />
    </svg>
    <Sfx at={at} src="sfx/marker_tick.wav" volume={0.3} />
  </>
);

// ------------------------------------------------------------------------------------------------ the problem
const COLS = [{name: 'PLANTERS', x: 905}, {name: 'FREEDPEOPLE', x: 1415}];
const ROWS = [{name: 'LAND', y: 445}, {name: 'LABOR', y: 590}, {name: 'MONEY', y: 735}];

/** PLANTERS / FREEDPEOPLE × LAND / LABOR / MONEY. `marks`: [col, row, ok, frame]. */
export const Have: React.FC<{at: number; heads: [number, number]; marks: [number, number, boolean, number][]}> = ({at, heads, marks}) => (
  <>
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <Ink d={wob(250, 520, 1680, 518, 'h1')} at={at + 2} dur={10} width={3} color="rgba(244,239,230,0.45)" />
      <Ink d={wob(250, 664, 1680, 666, 'h2')} at={at + 4} dur={10} width={3} color="rgba(244,239,230,0.45)" />
      <Ink d={wob(650, 300, 652, 800, 'v1')} at={at + 6} dur={10} width={3} color="rgba(244,239,230,0.45)" />
      <Ink d={wob(1160, 300, 1158, 800, 'v2')} at={at + 8} dur={10} width={3} color="rgba(244,239,230,0.45)" />
    </svg>
    {ROWS.map((r, i) => (
      <Pop key={r.name} at={at + 6 + i * 3} x={290} y={r.y - 24} style={{fontFamily: JF.mono, fontSize: 40, letterSpacing: 4, color: CREAM}}>{r.name}</Pop>
    ))}
    {COLS.map((c, i) => (
      <Pop key={c.name} at={heads[i]} x={c.x} y={318} center style={{fontFamily: JF.display, fontSize: 64, color: TEAL, textShadow: '0 3px 12px rgba(0,0,0,0.6)'}}>{c.name}</Pop>
    ))}
    {heads.map((h, i) => <Sfx key={i} at={h} src="sfx/tick.wav" volume={0.38} />)}
    {marks.map(([c, r, ok, f], i) => <Mark key={i} ok={ok} cx={COLS[c].x} cy={ROWS[r].y} at={f} />)}
  </>
);

// ------------------------------------------------------------------------------------------------ the farm
/** The planter's land in world px; farms are 360 x 340; the family's is column 1, row 1. */
const LW = 1440, LH = 680, FW = 360, FH = 340;
const FAM = {x: FW, y: FH};
const WIDE = {s: 1, x: 240, y: 236};
const CLOSE = {s: 1.6, x: 150 - FAM.x * 1.6, y: 236 - FAM.y * 1.6};

/** A small line-drawn cabin (world px, bottom-left at x, y). */
const cabin = (x: number, y: number) => [
  wob(x, y, x + 110, y, 'cb1', 1.5), wob(x + 110, y, x + 110, y - 62, 'cb2', 1.5), wob(x + 110, y - 62, x, y - 62, 'cb3', 1.5), wob(x, y - 62, x, y, 'cb4', 1.5),
  wob(x - 12, y - 58, x + 55, y - 108, 'cb5', 1.5), wob(x + 55, y - 108, x + 122, y - 58, 'cb6', 1.5),
  wob(x + 42, y, x + 42, y - 36, 'cb7', 1), wob(x + 42, y - 36, x + 66, y - 36, 'cb8', 1), wob(x + 66, y - 36, x + 66, y, 'cb9', 1),
].join(' ');

/** A provides-card: a rough teal box with a word in the hand, popping in; x/y may move (screen px). */
const Card: React.FC<{text: string; x: number; y: number; at: number; w?: number; dim?: boolean}> = ({text, x, y, at, w = 380, dim}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 3, at + 6], [1.18, 0.97, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: 74, transform: `scale(${k})`, transformOrigin: 'left center', opacity: dim ? 0.35 : 1}}>
      <div style={{position: 'absolute', inset: 0, background: 'rgba(12,14,13,0.72)'}} />
      <svg width={w} height={74} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <path d={roughRect(0, 0, w, 74, text, 2.5)} fill="none" stroke={TEAL} strokeWidth={3.5} strokeLinecap="round" />
      </svg>
      <div style={{position: 'absolute', left: 24, top: 6, fontFamily: HAND, fontSize: 58, lineHeight: 1, color: CREAM}}>{text}</div>
      <Sfx at={at} src="sfx/tick_soft.wav" volume={0.35} />
    </div>
  );
};

const Head: React.FC<{text: string; x: number; at: number}> = ({text, x, at}) => (
  <Pop at={at} x={x} y={250} style={{fontFamily: JF.mono, fontSize: 28, letterSpacing: 3, color: CREAM, borderBottom: `3px solid ${TEAL}`, paddingBottom: 6}}>{text}</Pop>
);

export type FarmCues = {
  /** sharecropping: the land, divided, the family moving onto one farm */
  land: number; divide: number; family: number; push: number; acres: number; cabin: number;
  planter: number; pLand: number; pMule: number; pTools: number; fam: number; work: number; harvest: number; split: number; halves: number;
  /** tenant farming (from `tenant`): rent off the top, the tools and mule move across */
  tenant?: number; rent?: number; rentSplit?: number; own?: number;
};

const COL_A = 860, COL_B = 1350, BAR = {x: 860, y: 676, w: 870, h: 78};

/** One family's farm, step by step. Everything before frame `from` is already drawn (for the cut into tenant farming). */
export const Farm: React.FC<{c: FarmCues; from: number}> = ({c, from}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const T = c.tenant ?? 1e7;
  const pre = (x: number) => (x < from ? from - 400 : x);   // already there before the shot started
  const zp = Easing(interpolate(f, [c.push, c.push + 40], [0, 1], clamp));
  const s = WIDE.s + (CLOSE.s - WIDE.s) * zp;
  const ox = WIDE.x + (CLOSE.x - WIDE.x) * zp, oy = WIDE.y + (CLOSE.y - WIDE.y) * zp;
  const dimOthers = interpolate(f, [c.push, c.push + 20], [1, 0.18], clamp);
  const famFill = interpolate(g, [c.family, c.family + 6], [0, 0.22], clamp);
  // the mule and tools move to the tenant's side
  const mv = c.own === undefined ? 0 : Easing(interpolate(f, [c.own, c.own + 18], [0, 1], clamp));
  const cardX = (k: number) => COL_A + (COL_B - COL_A) * mv * k;
  const tenant = f >= T;
  // the crop bar: one bar, split in two halves; or a rent slice off the front for the tenant
  const halvesGap = tenant ? 0 : interpolate(f, [c.halves, c.halves + 8], [0, 18], clamp);
  const splitP = tenant ? interpolate(g, [c.rentSplit ?? 1e7, (c.rentSplit ?? 1e7) + 6], [0, 1], clamp) : interpolate(g, [c.split, c.split + 6], [0, 1], clamp);
  const cutAt = tenant ? 0.24 : 0.5;
  const cx = BAR.x + BAR.w * cutAt;
  const others = [0, 1, 2, 3].flatMap((col) => [0, 1].map((row) => [col, row])).filter(([col, row]) => !(col === 1 && row === 1));
  return (
    <>
      {/* the land, in world px under the camera */}
      <div style={{position: 'absolute', left: ox, top: oy, width: LW, height: LH, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <svg width={LW} height={LH} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <rect x={FAM.x} y={FAM.y} width={FW} height={FH} fill={CORAL} opacity={famFill} />
          <g opacity={dimOthers}>
            <Ink d={roughRect(0, 0, LW, LH, 'land', 3)} at={pre(c.land)} dur={12} width={5} />
            {[1, 2, 3].map((k) => <Ink key={k} d={wob(FW * k, 0, FW * k, LH, `dv${k}`, 4)} at={pre(c.divide) + (k - 1) * 5} dur={8} width={3.5} />)}
            <Ink d={wob(0, FH, LW, FH, 'dh', 4)} at={pre(c.divide) + 15} dur={10} width={3.5} />
            {others.map(([col, row]) => (
              <g key={`${col}${row}`}>{[0.3, 0.5, 0.7].map((q, i) => (
                <Ink key={i} d={wob(col * FW + 40, row * FH + FH * q, col * FW + FW - 40, row * FH + FH * q, `r${col}${row}${i}`, 2)} at={pre(c.divide) + 20 + col * 2 + i} dur={6} width={2} color="rgba(47,224,196,0.4)" dash="10 9" />
              ))}</g>
            ))}
          </g>
          {/* the family's farm stays bright */}
          <Ink d={roughRect(FAM.x, FAM.y, FW, FH, 'fam', 3)} at={pre(c.family)} dur={8} width={6} color={CORAL} />
          <Ink d={cabin(FAM.x + 34, FAM.y + 146)} at={pre(c.cabin)} dur={10} width={4} color={CREAM} />
          {[0.62, 0.74, 0.86].map((q, i) => (
            <Ink key={i} d={wob(FAM.x + 24, FAM.y + FH * q, FAM.x + FW - 24, FAM.y + FH * q, `cr${i}`, 2)} at={pre(c.work) + i * 3} dur={8} width={3} color={TEAL} dash="12 8" />
          ))}
        </svg>
        <Person x={FAM.x + 210} y={FAM.y + 172} h={92} at={pre(c.family) + 2} color={CREAM} />
        <Person x={FAM.x + 262} y={FAM.y + 172} h={86} at={pre(c.family) + 4} color={CREAM} dress hat={false} />
        <Person x={FAM.x + 306} y={FAM.y + 172} h={56} at={pre(c.family) + 6} color={CREAM} hat={false} />
      </div>
      <Pop at={pre(c.land) + 4} x={240} y={168} style={{fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, color: CREAM, opacity: 1 - zp}}>THE PLANTER'S LAND</Pop>
      {/* who provides what */}
      <Head text={tenant ? 'THE LANDOWNER PROVIDES' : 'THE PLANTER PROVIDES'} x={COL_A} at={pre(c.planter)} />
      <Head text={tenant ? 'THE TENANT PROVIDES' : 'THE FAMILY PROVIDES'} x={COL_B} at={pre(c.fam)} />
      <Card text="the land" x={COL_A} y={316} at={pre(c.pLand)} w={400} />
      <Card text={tenant ? 'a mule' : 'maybe a mule'} x={cardX(1)} y={408} at={pre(c.pMule)} w={tenant ? 380 : 400} />
      <Card text={tenant ? 'tools' : 'maybe tools'} x={cardX(1)} y={500} at={pre(c.pTools)} w={tenant ? 380 : 400} />
      <Card text="the work" x={COL_B} y={316} at={pre(c.work)} w={380} />
      {/* the crop */}
      {f >= pre(c.harvest) && (
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <defs>
            <pattern id="cropHatch" width={16} height={16} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width={16} height={16} fill="rgba(244,239,230,0.12)" /><line x1={0} y1={0} x2={0} y2={16} stroke="rgba(47,224,196,0.55)" strokeWidth={5} />
            </pattern>
          </defs>
          {[[BAR.x - halvesGap, cx - BAR.x], [cx + halvesGap, BAR.x + BAR.w - cx]].map(([x, w], i) => (
            <g key={i}>
              <rect x={x} y={BAR.y} width={w} height={BAR.h} fill={i === 0 && tenant && splitP > 0 ? 'rgba(255,111,97,0.35)' : 'url(#cropHatch)'} />
              <path d={roughRect(x, BAR.y, w, BAR.h, `bar${i}${tenant ? 't' : ''}`, 2)} fill="none" stroke={TEAL} strokeWidth={4} strokeLinecap="round" opacity={i === 0 || splitP > 0 ? 1 : 0} />
            </g>
          ))}
          {splitP <= 0 && <path d={roughRect(BAR.x, BAR.y, BAR.w, BAR.h, 'barAll', 2)} fill="none" stroke={TEAL} strokeWidth={4} strokeLinecap="round" />}
          {splitP > 0 && <path d={wob(cx, BAR.y - 18, cx, BAR.y - 18 + (BAR.h + 36) * splitP, 'cut', 2)} stroke={CREAM} strokeWidth={4} strokeDasharray="10 8" fill="none" />}
        </svg>
      )}
      <Pop at={pre(c.harvest) + 2} x={BAR.x + 24} y={BAR.y - 62} style={{fontFamily: JF.mono, fontSize: 28, letterSpacing: 3, color: CREAM}}>THE CROP</Pop>
      {!tenant && <Pop at={c.halves} x={BAR.x + BAR.w * 0.25 - 18} y={BAR.y + BAR.h + 14} center style={{fontFamily: HAND, fontSize: 56, color: CREAM}}>½ the planter</Pop>}
      {!tenant && <Pop at={c.halves + 3} x={BAR.x + BAR.w * 0.75 + 18} y={BAR.y + BAR.h + 14} center style={{fontFamily: HAND, fontSize: 56, color: CREAM}}>½ the family</Pop>}
      {tenant && <Pop at={(c.rentSplit ?? 1e7) + 2} x={BAR.x + BAR.w * 0.12} y={BAR.y + BAR.h + 14} center style={{fontFamily: HAND, fontSize: 56, color: CREAM}}>rent</Pop>}
      {tenant && <Pop at={(c.rentSplit ?? 1e7) + 5} x={BAR.x + BAR.w * 0.62} y={BAR.y + BAR.h + 14} center style={{fontFamily: HAND, fontSize: 56, color: CREAM}}>the rest: the tenant's</Pop>}
      {[c.harvest, c.split, c.halves].filter((x) => x >= from && !tenant).map((x) => <Sfx key={x} at={x} src="sfx/tick.wav" volume={0.35} />)}
      {[c.planter, c.fam].filter((x) => x >= from).map((x) => <Sfx key={`h${x}`} at={x} src="sfx/tick.wav" volume={0.3} />)}
      {tenant && c.rentSplit !== undefined && <Sfx at={c.rentSplit} src="sfx/tick.wav" volume={0.35} />}
      {tenant && c.own !== undefined && <Sfx at={c.own} src="sfx/page_turn.wav" volume={0.25} />}
    </>
  );
};

const Easing = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
