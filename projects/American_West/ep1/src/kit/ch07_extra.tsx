// Helpers shared by chapters 7–9 (Ep 1): sound lists, a shaking desk shot, a print lifted on the desk, drawn diagram
// nodes and lines, a big bare-handwriting line and a counting grid. Everything stays on the black desk, teal marks, one coral subject.
import React from 'react';
import {AbsoluteFill, getInputProps, interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {JF, useGFrame, useHand, usePal} from './Kit';
import {Sfx} from './common';
import {SHADOW, TornPrint} from '../samples/kit';
import {Desk3D, Lift, shake, Shots, useSlap} from '../previews/fx';
import type {MaskRef} from './maskref';

/** A list of gentle sound effects: [frame, name in public/sfx, volume]. */
export const Sounds: React.FC<{list: [number, string, number][]}> = ({list}) => (
  <>{list.map(([at, n, v], i) => <Sfx key={i} at={at} src={`sfx/${n}.wav`} volume={v} />)}</>
);

/** A desk shot: the tilted 3D desk, with a decaying shake after each hard landing. */
export const DeskShot: React.FC<{tilt: number; rotZ?: number; z?: number; x?: number; y?: number; hits?: number[]; amp?: number; lamp?: [number, number];
  children: React.ReactNode; over?: React.ReactNode}> = ({tilt, rotZ = 0, z = 1, x = 0, y = 0, hits = [], amp = 8, lamp, children, over}) => {
  const f = useCurrentFrame();
  const sh = shake(f, hits, amp);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={tilt} rotZ={rotZ} z={z} x={x} y={y} lamp={lamp}>{children}</Desk3D>
      {over}
    </AbsoluteFill>
  );
};

/** An archival print lifted on the desk (desk coords), slapped down at `at`, deckled edges, grey tape. */
export const Print: React.FC<{src: string; size: [number, number]; x: number; y: number; w: number; crop?: [number, number, number, number]; at: number; h?: number;
  rot?: number; seed?: number; blur?: number; mask?: MaskRef; tint?: number; traceAt?: number; tapes?: {x: number; y: number; w?: number; rot?: number}[];
  corner?: {at: 'br' | 'bl' | 'tr'; x: number; y: number}; filter?: string; children?: (S: (sx: number, sy: number) => [number, number], w: number, h: number) => React.ReactNode}> = ({
  src, size, x, y, w, crop, at, h = 8, rot = 0, seed = 1, blur, mask, tint, traceAt, tapes, corner, filter, children,
}) => {
  const [sx0, sy0, sx1, sy1] = crop ?? [0, 0, size[0], size[1]];
  const hgt = ((sy1 - sy0) * w) / (sx1 - sx0);
  return (
    <Lift x={x} y={y} w={w} hgt={hgt} h={h} at={at} rot={rot} blur={blur} seed={seed}>
      <TornPrint src={src} size={size} x={0} y={0} w={w} crop={crop} at={-99} seed={seed} real grey shadow={6} mask={mask} tint={tint} traceAt={traceAt}
        tapes={tapes ?? [{x: w * 0.08, y: -14, w: 150, rot: -6}, {x: w * 0.8, y: -12, w: 140, rot: 5}]} corner={corner} filter={filter}>{children}</TornPrint>
    </Lift>
  );
};

/** A drawn diagram node: dark paper box with a teal rule and a mono label; slaps in at `at`. `coral` makes it the subject. */
export const Node: React.FC<{x: number; y: number; w: number; h: number; label: string; sub?: string; at: number; coral?: boolean; size?: number}> = ({
  x, y, w, h, label, sub, at, coral = false, size = 34,
}) => {
  const s = useSlap(at, 1.25);
  const pal = usePal();
  if (!s.on) return null;
  const c = coral ? pal.subject : pal.mark;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `scale(${s.scale})`, opacity: s.opacity, background: 'radial-gradient(ellipse at 40% 30%, #36312a 0%, #221f1a 80%)',
      boxShadow: `12px 14px 0 ${SHADOW}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', inset: 7, border: `3px solid ${c}`, opacity: 0.9}} />
      <div style={{fontFamily: JF.mono, fontSize: size, letterSpacing: 3, color: c, whiteSpace: 'nowrap'}}>{label}</div>
      {sub && <div style={{marginTop: 6, fontFamily: JF.mono, fontSize: size * 0.55, letterSpacing: 2, color: 'rgba(237,231,220,0.75)', whiteSpace: 'nowrap'}}>{sub}</div>}
    </div>
  );
};

/** A drawn line (polyline) that writes on, with an arrowhead; screen coords. Stepped at 12 fps. */
export const Wire: React.FC<{pts: [number, number][]; at: number; dur?: number; color?: string; width?: number; head?: boolean; dash?: boolean}> = ({
  pts, at, dur = 10, color, width = 6, head = true, dash = false,
}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  const c = color ?? pal.mark;
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
  const [x1, y1] = pts[pts.length - 1];
  const [x0, y0] = pts[pts.length - 2];
  const a = Math.atan2(y1 - y0, x1 - x0);
  const hl = 26;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}} width={1920} height={1080}>
      <path d={d} fill="none" stroke={SHADOW} strokeWidth={width + 6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={0.6} />
      <path d={d} fill="none" stroke={c} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={dash ? undefined : 1} strokeDashoffset={dash ? undefined : 1 - p}
        style={dash ? {strokeDasharray: '14 12', clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`} : undefined} />
      {head && p >= 1 && <path d={`M${x1 - hl * Math.cos(a - 0.45)},${y1 - hl * Math.sin(a - 0.45)} L${x1},${y1} L${x1 - hl * Math.cos(a + 0.45)},${y1 - hl * Math.sin(a + 0.45)}`}
        fill="none" stroke={c} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
};

/** Bare handwriting, large, written on left to right; `parts` lets one word go coral. */
export const Hand: React.FC<{parts: [string, boolean?][]; x: number; y: number; size?: number; at: number; dur?: number; rot?: number; white?: boolean}> = ({
  parts, x, y, size = 80, at, dur = 14, rot = -3, white = false,
}) => {
  const g = useGFrame();
  const pal = usePal();
  const hand = useHand();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: hand.family, fontSize: size * hand.scale, lineHeight: 1, whiteSpace: 'nowrap', transform: `rotate(${rot}deg)`,
      clipPath: `inset(-60% ${(1 - p) * 100}% -60% -5%)`, textShadow: '0 0 2px #111, 2px 2px 0 #111, -2px 2px 0 #111, 2px -2px 0 #111, -2px -2px 0 #111, 0 4px 14px rgba(0,0,0,0.7)'}}>
      {parts.map(([t, c], i) => <span key={i} style={{color: c ? pal.subject : white ? '#f4efe6' : pal.mark}}>{t}</span>)}
    </div>
  );
};

/** A hand-drawn strike-through over a span of text (screen coords). */
export const Strike: React.FC<{x0: number; x1: number; y: number; at: number; color?: string}> = ({x0, x1, y, at, color}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 6], [0, 1], clamp);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <path d={`M${x0},${y + 6} Q${(x0 + x1) / 2},${y - 10} ${x1},${y - 2}`} fill="none" stroke={color ?? pal.subject} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/** A grid of small marks (counting graphic): `n` marks, the first `hot` in coral, appearing at `at` (staggered by rows). */
export const Marks: React.FC<{n: number; hot: number; x: number; y: number; cols: number; cell: number; at: number; hotAt: number}> = ({n, hot, x, y, cols, cell, at, hotAt}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  return (
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={cols * cell} height={Math.ceil(n / cols) * cell}>
      {Array.from({length: n}).map((_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        if (g < at + r * 0.6) return null;
        const isHot = i < hot && g >= hotAt + Math.floor(i / 6);
        return <rect key={i} x={c * cell + 2} y={r * cell + 2} width={cell - 6} height={cell * 0.42} rx={2} fill={isHot ? pal.subject : 'none'} stroke={isHot ? pal.subject : pal.mark} strokeWidth={2} opacity={isHot ? 1 : 0.7} />;
      })}
    </svg>
  );
};

/** The kit's shot switcher (previews/fx Shots, gentle transitions); under tools/probe_text.mjs (inputProps.probe) it
 *  renders plain cuts, so the probe measures each shot's own layout. */
export const WShots: React.FC<{shots: [number, React.ReactNode, ('whip' | 'cut')?][]}> = ({shots}) => <Shots shots={shots} plain={Boolean(getInputProps().probe)} />;
