// Helpers for chapter 7 (Mississippi, 1875). Nothing here is shared with other chapters.
//   Thread      the telegrams as a message thread: Ames's two telegrams on the left, the attorney general's reply
//               (quoting Grant) on the right, each a cream telegraph slip with the text as printed in the newspapers
//   PageWin     a torn window onto part of a page, lying on the desk; children in page pixels (swipes)
//   Pin         a map pin (page px, inside a Sheet), teal or coral, scaled against the camera zoom
//   Trail       a teal path drawn along the map (page px, inside a Sheet)
//   Range       a plain drawn range on the dark desk ("between 30 and 50")
//   StruckSlip  a Slip with a teal strike drawn through it
//   Whooshes    a whoosh three frames before every cut
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame} from 'remotion';
import {DarkPaper, Sfx} from '../kit/common';
import {JF, useGFrame} from '../kit/Kit';
import {CORAL, Slip, TEAL} from '../kit/rc';
import {CropCard} from '../kit/shell';
import type {MaskRef} from '../kit/maskref';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const INK = '#1b1a17';
const PAPER = '#ece6d8';

// --------------------------------------------------------------------------------------------------------- the thread
export type Wire = {
  id: string;
  side: 'left' | 'right';
  at: number;
  h: number;                 // the slip's height (px): fixed, so the thread can stack without measuring
  w: number;
  head: string[];            // dateline and address, small caps
  label?: string;            // a heading over the body (the paper's own)
  body: string;              // the words, as printed
  bodySize?: number;
  sign?: string;
  foot: string;              // "text as printed in …"
  typeDur?: number;          // frames to type the body out
};

/** Ragged top and bottom edges, like a slip torn off a telegraph pad. */
const padEdge = (seed: string) => {
  const pts: string[] = [];
  for (let i = 0; i <= 24; i++) pts.push(`${(i / 24) * 100}% ${random(`${seed}t${i}`) * 1.6}%`);
  for (let i = 24; i >= 0; i--) pts.push(`${(i / 24) * 100}% ${100 - random(`${seed}b${i}`) * 1.6}%`);
  return `polygon(${pts.join(',')})`;
};

const WireSlip: React.FC<{w: Wire}> = ({w}) => {
  const g = useGFrame();
  const typed = interpolate(g, [w.at + 3, w.at + 3 + (w.typeDur ?? 16)], [0, w.body.length], clamp);
  const n = Math.round(typed);
  return (
    <div style={{width: w.w, height: w.h, background: PAPER, clipPath: padEdge(w.id), padding: '20px 24px 16px', boxSizing: 'border-box', position: 'relative',
      fontFamily: JF.mono, color: INK, borderLeft: w.side === 'left' ? `8px solid ${TEAL}` : undefined, borderRight: w.side === 'right' ? `8px solid ${CORAL}` : undefined}}>
      {w.head.map((l, i) => <div key={i} style={{fontSize: 17, letterSpacing: 1.2, lineHeight: 1.35, opacity: 0.85}}>{l}</div>)}
      {w.label && <div style={{marginTop: 8, fontSize: 16, letterSpacing: 1.5, color: '#7a2a20'}}>{w.label}</div>}
      <div style={{marginTop: 10, fontSize: w.bodySize ?? 25, lineHeight: 1.32}}>
        <span>{w.body.slice(0, n)}</span><span style={{color: 'transparent'}}>{w.body.slice(n)}</span>
      </div>
      {w.sign && <div style={{marginTop: 6, fontSize: 18, letterSpacing: 1.5, textAlign: 'right', opacity: n >= w.body.length ? 0.9 : 0}}>{w.sign}</div>}
      <div style={{position: 'absolute', left: 24, right: 20, bottom: 12, fontSize: 13, letterSpacing: 1, opacity: 0.6}}>{w.foot}</div>
    </div>
  );
};

/** Three dots in a small slip on the reply side, while the answer is being written. */
const Typing: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  return (
    <div style={{width: 120, height: 56, background: PAPER, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12}}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{width: 13, height: 13, borderRadius: 7, background: INK, opacity: 0.3 + 0.6 * Math.max(0, Math.sin(((f - at) / 30) * Math.PI * 2 - i * 0.9))}} />
      ))}
    </div>
  );
};

/** A portrait card beside the thread (a cropped print with its mask tinted at photo strength), and its credit. */
export type Sender = {src: string; size: [number, number]; mask: MaskRef; fx: number; fy: number; scale: number; x: number; y: number; at: number; credit: string};
const SenderCard: React.FC<{s: Sender}> = ({s}) => {
  const g = useGFrame();
  if (g < s.at) return null;
  return (
    <>
      <CropCard src={s.src} size={s.size} x={s.x} y={s.y} w={320} h={400} fx={s.fx} fy={s.fy} scale={s.scale} at={s.at} mask={s.mask} tintStrength={0.6} rot={0} />
      <div style={{position: 'absolute', left: s.x - 14, top: s.y + 400 + 22, width: 348, fontFamily: JF.mono, fontSize: 14, letterSpacing: 1, lineHeight: 1.35,
        color: 'rgba(244,239,230,0.75)', textTransform: 'uppercase'}}>{s.credit}</div>
      <Sfx at={s.at} src="sfx/tick.wav" volume={0.35} />
    </>
  );
};

/**
 * The thread: a dark column on the desk (x0..x1, y0..y1) that the slips stack into from the bottom, older ones pushed up.
 * `typing` = [from, to] for the dots on the reply side.
 */
export const Thread: React.FC<{wires: Wire[]; typing: [number, number]; header: string; senders: Sender[]; children?: React.ReactNode}> = ({wires, typing, header, senders, children}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const X0 = 580, X1 = 1340, Y0 = 66, Y1 = 1014, GAP = 22, PAD = 22;
  // what's in the thread at frame gg (the dots count as an item while they show), stacked from the bottom
  type Item = {key: string; at: number; h: number; side: 'left' | 'right'; node: React.ReactNode; w: number; y: number};
  const layout = (gg: number) => {
    const items: Item[] = [];
    wires.forEach((w) => { if (gg >= w.at) items.push({key: w.id, at: w.at, h: w.h, side: w.side, w: w.w, y: 0, node: <WireSlip w={w} />}); });
    if (gg >= typing[0] && gg < typing[1]) items.push({key: 'typing', at: typing[0], h: 56, side: 'right', w: 120, y: 0, node: <Typing at={typing[0]} />});
    let bottom = Y1 - PAD;
    for (let i = items.length - 1; i >= 0; i--) { items[i].y = bottom - items[i].h; bottom = items[i].y - GAP; }
    return items;
  };
  const now = layout(g);
  // older items glide up from where they were before the newest arrived (smooth, not stepped)
  const newestAt = Math.max(-1e7, ...now.map((it) => it.at));
  const before = new Map(layout(newestAt - 1).map((it) => [it.key, it.y]));
  const glideK = Easing.out(Easing.cubic)(interpolate(f, [newestAt, newestAt + 7], [0, 1], clamp));
  const placed = now.map((it) => ({...it, y: before.has(it.key) ? before.get(it.key)! + (it.y - before.get(it.key)!) * glideK : it.y}));
  return (
    <AbsoluteFill>
      <DarkPaper />
      {senders.map((s, i) => <SenderCard key={i} s={s} />)}
      <div style={{position: 'absolute', left: X0, top: Y0, width: X1 - X0, height: Y1 - Y0, background: 'linear-gradient(180deg, #0e0d0b 0%, #151410 100%)', borderRadius: 26,
        boxShadow: '0 24px 50px rgba(0,0,0,0.75), inset 0 0 0 2px rgba(244,239,230,0.12)', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 58, borderBottom: '1px solid rgba(244,239,230,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: JF.mono, fontSize: 19, letterSpacing: 2, color: 'rgba(244,239,230,0.75)'}}>{header}</div>
        {placed.map((it) => {
          const k = Easing.out(Easing.cubic)(interpolate(f, [it.at, it.at + 7], [0, 1], clamp));
          const left = it.side === 'left' ? PAD : X1 - X0 - PAD - it.w;
          return (
            <div key={it.key} style={{position: 'absolute', left, top: it.y - Y0 + (1 - k) * 40, opacity: Math.min(1, k * 2.5), filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.6))'}}>
              {it.node}
            </div>
          );
        })}
      </div>
      {wires.map((w) => <Sfx key={w.id} at={w.at} src="sfx/tick.wav" volume={0.38} />)}
      {children}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------------- page window
/** A torn window onto part of a page (centred on page px cx, cy at scale s), lying on the desk; children in page px. */
export const PageWin: React.FC<{src: string; cx: number; cy: number; s: number; w: number; h: number; x: number; y: number; r?: number; filter?: string; children?: React.ReactNode}> = ({
  src, cx, cy, s, w, h, x, y, r = 0, filter = 'grayscale(1) sepia(0.12) contrast(1.25)', children,
}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${r}deg)`, filter: 'drop-shadow(0 14px 20px rgba(0,0,0,0.7))'}}>
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#ddd6c6', clipPath: 'polygon(0 2%, 100% 0, 99% 97%, 1% 100%)'}}>
      <div style={{position: 'absolute', left: w / 2 - cx * s, top: h / 2 - cy * s, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <Img src={staticFile(src)} style={{display: 'block', filter}} />
        {children}
      </div>
    </div>
  </div>
);

// ------------------------------------------------------------------------------------------------------------- the map
/** A pin on the map (page px, inside a Sheet). `z` is the camera zoom, so the pin keeps its size on screen. */
export const Pin: React.FC<{x: number; y: number; at: number; z: number; coral?: boolean}> = ({x, y, at, z, coral}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = spring({frame: f - at, fps: 30, config: {damping: 9, stiffness: 260}});
  const r = (13 / z) * (0.4 + 0.6 * k);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
      <circle cx={x} cy={y} r={r * 2.1} fill="none" stroke={coral ? CORAL : TEAL} strokeWidth={4 / z} opacity={0.9} />
      <circle cx={x} cy={y} r={r} fill={coral ? CORAL : TEAL} stroke="#111" strokeWidth={2 / z} />
    </svg>
  );
};

/** A teal path along the map (page px), drawn on from `at` over `dur` frames, dashed like a route. */
export const Trail: React.FC<{pts: [number, number][]; at: number; dur: number; z: number}> = ({pts, at, dur, z}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
  const end = pts[pts.length - 1];
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
      <defs>
        <mask id="trailm"><path d={d} fill="none" stroke="#fff" strokeWidth={14 / z} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} /></mask>
      </defs>
      <path d={d} fill="none" stroke="#111" strokeWidth={11 / z} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${18 / z} ${10 / z}`} mask="url(#trailm)" opacity={0.6} />
      <path d={d} fill="none" stroke={TEAL} strokeWidth={6.5 / z} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${18 / z} ${10 / z}`} mask="url(#trailm)" />
      {p >= 1 && <path d={`M${end[0] + 16 / z},${end[1] - 12 / z} L${end[0]},${end[1]} L${end[0] + 18 / z},${end[1] + 10 / z}`} fill="none" stroke={TEAL} strokeWidth={6.5 / z} strokeLinecap="round" />}
    </svg>
  );
};

// ------------------------------------------------------------------------------------------------------- range, strike
/** "Somewhere between 30 and 50": a plain teal bar between two numbers, no picture. */
export const Range: React.FC<{lo: string; hi: string; at: number; label: string; note: string}> = ({lo, hi, at, label, note}) => {
  const g = useGFrame();
  const p = interpolate(g, [at + 4, at + 16], [0, 1], clamp);
  const x0 = 560, x1 = 1360, y = 560;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 360, width: 1200, top: 300, textAlign: 'center', fontFamily: JF.mono, fontSize: 32, letterSpacing: 4, color: 'rgba(244,239,230,0.8)',
        opacity: interpolate(g, [at, at + 5], [0, 1], clamp)}}>{label}</div>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={x0} y1={y} x2={x0 + (x1 - x0) * p} y2={y} stroke={TEAL} strokeWidth={10} strokeLinecap="round" />
        {[x0, x1].map((x, i) => (g >= at + 4 + i * 12 ? <line key={i} x1={x} y1={y - 34} x2={x} y2={y + 34} stroke={TEAL} strokeWidth={8} strokeLinecap="round" /> : null))}
      </svg>
      {g >= at + 4 && <div style={{position: 'absolute', left: x0 - 160, top: y + 50, width: 320, textAlign: 'center', fontFamily: JF.display, fontSize: 150, lineHeight: 1, color: '#f4efe6'}}>{lo}</div>}
      {g >= at + 16 && <div style={{position: 'absolute', left: x1 - 160, top: y + 50, width: 320, textAlign: 'center', fontFamily: JF.display, fontSize: 150, lineHeight: 1, color: '#f4efe6'}}>{hi}</div>}
      <div style={{position: 'absolute', left: 260, width: 1400, top: 860, textAlign: 'center', fontFamily: JF.mono, fontSize: 26, letterSpacing: 3, color: 'rgba(244,239,230,0.65)',
        opacity: interpolate(g, [at + 18, at + 24], [0, 1], clamp)}}>{note}</div>
      <Sfx at={at + 4} src="sfx/tick_soft.wav" volume={0.3} />
    </AbsoluteFill>
  );
};

/** A Slip with a teal strike drawn across it from `strike`. `w` is the strike's length (about the slip's width). */
export const StruckSlip: React.FC<{text: string; x: number; y: number; at: number; strike: number; w: number; size?: number; rot?: number}> = ({text, x, y, at, strike, w, size = 66, rot = -2}) => {
  const g = useGFrame();
  const p = interpolate(g, [strike, strike + 6], [0, 1], clamp);
  return (
    <>
      <Slip text={text} x={x} y={y} at={at} size={size} rot={rot} />
      {p > 0 && (
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <path d={`M ${x - 10} ${y + size * 0.62} Q ${x + w / 2} ${y + size * 0.48} ${x - 10 + (w + 20) * p} ${y + size * 0.5}`} stroke={TEAL} strokeWidth={11} fill="none" strokeLinecap="round"
            transform={`rotate(${rot} ${x} ${y + size * 0.6})`} />
        </svg>
      )}
      <Sfx at={strike} src="sfx/marker_tick.wav" volume={0.3} />
    </>
  );
};

/** A whoosh just before every hard cut after the first. */
export const Whooshes: React.FC<{at: number[]; volume?: number}> = ({at, volume = 0.2}) => <>{at.map((f) => <Sfx key={f} at={f - 3} src="sfx/whoosh.wav" volume={volume} />)}</>;
