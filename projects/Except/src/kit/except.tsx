// Except: the pieces this video adds on top of the template kit.
//  - the six words: the recurring torn tape EXCEPT AS A PUNISHMENT FOR CRIME (ch01, ch07, ch08) and the enrolled
//    13th Amendment with the line marked in its own pixels (AMEND_*)
//  - Box: a hand-jittered diagram box (from Video 1, ch05) for drawn diagrams
//  - TwoViews: the cream divider with mono caps headers, one per side
//  - Chain: boxes that step on one by one, joined by drawn arrows (the Black Codes chain, the draft's catch)
//  - PaperNote: a drawn slip of paper with handwriting on it, for documents that survive but have no image here
import React from 'react';
import {interpolate, random} from 'remotion';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, useGFrame, usePal, useHand} from './Kit';
import type {DocMark} from './dk';

export const CORAL = '#FF6F61';
export const ORANGE = '#FF9F1C';
export const BONE = '#EDE7DC';
export const WHITE = '#ffffff';

/** The enrolled 13th Amendment (National Archives scan) and the lines on it, in source pixels. */
export const AMEND = 'img/ch01/thirteenth_amendment_enrolled_1865.jpg';
export const AMEND_TAG = 'Joint resolution proposing the 13th Amendment, enrolled copy, 1865 · National Archives';
/** "except as a punishment for crime" */
export const AMEND_EXCEPT: [number, number, number, number] = [330, 1522, 1112, 1602];
/** "Neither slavery nor involuntary servitude," */
export const AMEND_NEITHER: [number, number, number, number] = [1132, 1424, 2290, 1500];

/** The six words, swiped coral (or bone in a quiet chapter) along their line on the amendment. */
export const exceptSwipe = (at: number, to: number): DocMark => ({at, to, swipe: [AMEND_EXCEPT]});

/** The recurring tape strip: the six words. */
export const SixWords: React.FC<{x: number; y: number; at: number; size?: number; rot?: number}> = ({x, y, at, size = 74, rot = -2}) => (
  <Highlight text="EXCEPT AS A PUNISHMENT FOR CRIME" x={x} y={y} size={size} at={at} seed={66} rot={rot} />
);

/** A hand-jittered rectangle in teal, drawn on (diagram box), with an optional label. */
export const Box: React.FC<{x: number; y: number; w: number; h: number; at: number; label?: string; seed?: number; color?: string; size?: number; font?: 'display' | 'hand'; fillBg?: string}> = ({
  x, y, w, h, at, label, seed = 1, color, size = 56, font = 'display', fillBg = 'rgba(0,0,0,0.35)',
}) => {
  const g = useGFrame();
  const pal = usePal();
  const hand = useHand();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 8], [0, 1], clamp);
  const j = (k: string) => (random(`bx${seed}${k}`) - 0.5) * 10;
  const pts = [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x + 6, y - 4]];
  const d = pts.map(([px, py], i) => `${i ? 'L' : 'M'}${px + j(`x${i}`)},${py + j(`y${i}`)}`).join(' ');
  return (
    <>
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
        <path d={d} fill={fillBg} stroke={color ?? pal.mark} strokeWidth={6} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      </svg>
      {label && (
        <div style={{position: 'absolute', left: x, top: y, width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          fontFamily: font === 'display' ? JF.display : hand.family, fontSize: font === 'display' ? size : size * hand.scale, lineHeight: 1.05, color: '#f4efe6',
          textShadow: '0 2px 8px #000', opacity: interpolate(g, [at + 4, at + 8], [0, 1], clamp)}}>{label}</div>
      )}
    </>
  );
};

/** Two views: a cream divider down the middle and a mono caps header over each half. */
export const TwoViews: React.FC<{a: number; left: string; right: string; leftAt?: number; rightAt?: number; top?: number; leftColor?: string; rightColor?: string}> = ({
  a, left, right, leftAt, rightAt, top = 70, leftColor, rightColor = CORAL,
}) => {
  const g = useGFrame();
  const pal = usePal();
  const head = (text: string, x: number, color: string, at: number) => g >= at && (
    <div style={{position: 'absolute', left: x, top, fontFamily: JF.mono, fontSize: 32, letterSpacing: 4, color, textShadow: '0 1px 6px #000', whiteSpace: 'nowrap'}}>{text}</div>
  );
  return (
    <>
      <div style={{position: 'absolute', left: 958, top: top - 10, width: 4, height: 1010 - top, background: '#f4efe6', opacity: interpolate(g, [a, a + 4], [0, 0.8], clamp)}} />
      {head(left, 140, leftColor ?? pal.mark, leftAt ?? a)}
      {head(right, 1040, rightColor, rightAt ?? a)}
    </>
  );
};

export type Link = {label: string; at: number; color?: string};
/** A chain of boxes left to right, each stepping on at its word, joined by drawn arrows. */
export const Chain: React.FC<{links: Link[]; x: number; y: number; w: number; h: number; gap: number; size?: number}> = ({links, x, y, w, h, gap, size = 50}) => (
  <>
    {links.map((l, i) => {
      const bx = x + i * (w + gap);
      return (
        <React.Fragment key={i}>
          <Box x={bx} y={y} w={w} h={h} at={l.at} label={l.label} seed={i + 30} color={l.color} size={size} font="hand" />
          {i > 0 && <Arrow x1={bx - gap + 12} y1={y + h / 2} x2={bx - 12} y2={y + h / 2} bow={-14} at={l.at - 2} dur={5} />}
        </React.Fragment>
      );
    })}
  </>
);

/** A drawn slip of paper with handwritten lines, popping onto the desk. */
export const PaperNote: React.FC<{x: number; y: number; w: number; h: number; at: number; rot?: number; lines: string[]; size?: number; foot?: string}> = ({x, y, w, h, at, rot = -3, lines, size = 40, foot}) => {
  const g = useGFrame();
  const hand = useHand();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 5], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) * (1 - 2.2 * t * (1 - t))});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: '#ece2cc', boxShadow: '0 18px 34px rgba(0,0,0,0.6)', padding: '36px 40px',
      transform: `scale(${0.6 + 0.4 * k}) rotate(${rot}deg)`, opacity: Math.min(1, k * 2), backgroundImage: 'repeating-linear-gradient(transparent 0 58px, rgba(60,80,120,0.18) 58px 60px)'}}>
      {lines.map((l, i) => (
        <div key={i} style={{fontFamily: hand.family, fontSize: size * hand.scale, lineHeight: `${60}px`, color: '#2a2622', whiteSpace: 'nowrap'}}>{l}</div>
      ))}
      {foot && <div style={{position: 'absolute', right: 30, bottom: 20, fontFamily: JF.mono, fontSize: 18, letterSpacing: 1, color: 'rgba(40,36,30,0.7)', textTransform: 'uppercase'}}>{foot}</div>}
    </div>
  );
};
