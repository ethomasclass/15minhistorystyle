// Forever Free: the pieces this video shares across chapters.
//  - CORAL / WHITE / U(): colours and state ids, as in Video 1.
//  - Strike, Tick, Box: hand-drawn marks (from Video 1).
//  - Checklist: a column of handwritten lines, each with a teal tick, for "the case for ..." beats.
//  - TwoSides: the recurring question, Lincoln on the left and Robert Smalls on the right (ch01 and ch08).
import React from 'react';
import {interpolate, random} from 'remotion';
import {clamp} from '../lib/anim';
import {Highlight, JF, Note, useGFrame, usePal} from './Kit';
import {sizeOf} from './dk';
import {CropCard} from './shell';
import {MASKS} from '../masks';

export const CORAL = '#FF6F61';
export const WHITE = '#ffffff';
export const BONE = '#EDE7DC';
export const U = (n: string[]) => n.map((s) => `USA:${s}`);

export const READING = 'img/ch04/first_reading_emancipation_ritchie_1866.jpg';
export const READING_TAG = 'Alexander Ritchie after Francis Carpenter, The First Reading of the Emancipation Proclamation, engraving, 1866 · Library of Congress';
export const SMALLS_1862 = 'img/ch01/smalls_harpers_planter_page_1862.jpg';
export const SMALLS_1862_TAG = "Robert Smalls and the Planter, Harper's Weekly, June 14, 1862 · Library of Congress";
export const SMALLS = 'img/ch01/smalls_congressman_portrait_c1870s.jpg';
export const SMALLS_TAG = 'Brady-Handy studio, Robert Smalls as a congressman, c. 1870s · Library of Congress';
export const LETTER = 'img/ch04/lincoln_letter_to_greeley_p2_save_union_1908reprint.jpg';
export const LETTER_TAG = 'Lincoln to Horace Greeley, Aug. 22, 1862, as printed in Three Letters from Lincoln, 1908 · Internet Archive';
/** The quoted sentence on the letter page, line by line in source pixels (x0, y0, x1, y1). */
export const LETTER_QUOTE: [number, number, number, number][] = [[897, 548, 1449, 600], [210, 614, 1449, 675], [210, 685, 1454, 743], [210, 756, 1013, 814]];
export const STAMPEDE = 'img/ch02/stampede_slaves_hampton_fortress_monroe_1861.jpg';
export const STAMPEDE_TAG = "Stampede of slaves from Hampton to Fortress Monroe, Harper's Weekly, 1861 · Library of Congress";
export const NARA = (n: number) => `img/ch05/emancipation_proclamation_nara_page${n}_1863.jpg`;
export const NARA_TAG = 'The Emancipation Proclamation, Jan. 1, 1863 · National Archives';

/** A hand-drawn strike through a rejected idea (orange, 5 frames). */
export const Strike: React.FC<{x1: number; x2: number; y: number; at: number; color?: string}> = ({x1, x2, y, at, color = '#FF9F1C'}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 5], [0, 1], clamp);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <path d={`M${x1},${y + 6} Q${(x1 + x2) / 2},${y - 10} ${x2},${y - 4}`} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/** A hand-drawn teal tick. */
export const Tick: React.FC<{x: number; y: number; at: number; s?: number; color?: string}> = ({x, y, at, s = 1, color}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 5], [0, 1], clamp);
  return (
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={80 * s} height={70 * s}>
      <path d={`M${4 * s},${36 * s} L${28 * s},${62 * s} L${76 * s},${6 * s}`} fill="none" stroke={color ?? pal.mark} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/** A hand-drawn X (coral by default). */
export const Cross: React.FC<{x: number; y: number; at: number; s?: number; color?: string}> = ({x, y, at, s = 1, color = CORAL}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 6], [0, 1], clamp);
  const st = {fill: 'none', stroke: color, strokeWidth: 10, strokeLinecap: 'round' as const, pathLength: 1, strokeDasharray: 1};
  return (
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={70 * s} height={70 * s}>
      <path d={`M${6 * s},${8 * s} L${64 * s},${62 * s}`} {...st} strokeDashoffset={1 - Math.min(1, p * 2)} />
      <path d={`M${62 * s},${6 * s} L${8 * s},${64 * s}`} {...st} strokeDashoffset={1 - Math.max(0, p * 2 - 1)} />
    </svg>
  );
};

/** A hand-jittered rectangle in teal, drawn on (diagram box), with an optional centred label. */
export const Box: React.FC<{x: number; y: number; w: number; h: number; at: number; label?: string; seed?: number; color?: string; size?: number; fill?: string}> = ({
  x, y, w, h, at, label, seed = 1, color, size = 56, fill = 'rgba(0,0,0,0.25)',
}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 8], [0, 1], clamp);
  const j = (k: string) => (random(`bx${seed}${k}`) - 0.5) * 10;
  const pts = [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x + 6, y - 4]];
  const d = pts.map(([px, py], i) => `${i ? 'L' : 'M'}${px + j(`x${i}`)},${py + j(`y${i}`)}`).join(' ');
  return (
    <>
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
        <path d={d} fill={fill} stroke={color ?? pal.mark} strokeWidth={6} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      </svg>
      {label && (
        <div style={{position: 'absolute', left: x, top: y, width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: JF.display,
          fontSize: size, lineHeight: 1.1, color: '#f4efe6', opacity: interpolate(g, [at + 4, at + 8], [0, 1], clamp)}}>{label}</div>
      )}
    </>
  );
};

/** Handwritten lines stacked down the frame, each with a tick (or a cross) drawn as it is said. */
export const Checklist: React.FC<{x: number; y: number; items: {text: string; at: number; mark?: 'tick' | 'cross'; color?: string}[]; gap?: number; size?: number}> = ({
  x, y, items, gap = 110, size = 54,
}) => (
  <>
    {items.map((it, i) => (
      <React.Fragment key={i}>
        {it.mark === 'cross' ? <Cross x={x} y={y + i * gap + 6} at={it.at + 4} s={0.8} /> : <Tick x={x} y={y + i * gap + 4} at={it.at + 4} s={0.8} />}
        <Note text={it.text} x={x + 90} y={y + i * gap} size={size} rot={-2} at={it.at} color={it.color ?? WHITE} />
      </React.Fragment>
    ))}
  </>
);

/** The driving question: Lincoln (left) or the people who didn't wait, like Robert Smalls (right). */
export const TwoSides: React.FC<{at: number; lincolnAt: number; smallsAt: number; leftLabel?: string; rightLabel?: string; leftNote?: string; rightNote?: string}> = ({
  at, lincolnAt, smallsAt, leftLabel = 'PRESIDENT LINCOLN?', rightLabel = 'OR ROBERT SMALLS?', leftNote, rightNote,
}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <>
      <div style={{position: 'absolute', left: 958, top: 230, width: 4, height: 700, background: 'rgba(244,239,230,0.55)', opacity: interpolate(g, [at, at + 6], [0, 1], clamp)}} />
      <CropCard src={READING} size={sizeOf(READING)} x={250} y={290} w={420} h={520} fx={1120} fy={1180} scale={0.5} rot={-2} at={lincolnAt - 2} mask={MASKS.lincoln_reading}
        traceAt={lincolnAt + 4} />
      <CropCard src={SMALLS_1862} size={sizeOf(SMALLS_1862)} x={1250} y={290} w={420} h={520} fx={770} fy={1200} scale={0.47} rot={2} at={smallsAt - 2} mask={MASKS.smalls_1862}
        traceAt={smallsAt + 4} />
      {g >= lincolnAt - 2 && <div style={{position: 'absolute', left: 150, top: 860, width: 640, textAlign: 'center', fontFamily: JF.mono, fontSize: 34, letterSpacing: 3, color: pal.mark}}>{leftLabel}</div>}
      {g >= smallsAt - 2 && <div style={{position: 'absolute', left: 1130, top: 860, width: 660, textAlign: 'center', fontFamily: JF.mono, fontSize: 34, letterSpacing: 3, color: CORAL}}>{rightLabel}</div>}
      {leftNote && <Note text={leftNote} x={190} y={905} size={40} rot={-2} at={lincolnAt + 6} color={WHITE} />}
      {rightNote && <Note text={rightNote} x={1170} y={905} size={40} rot={-2} at={smallsAt + 6} color={WHITE} />}
    </>
  );
};

export {Highlight};
