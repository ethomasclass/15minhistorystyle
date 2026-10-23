// Reconstruction, Episode 1: the shared pieces every chapter uses, so the same picture always looks the same.
//   cut(t, p)       a hard cut two frames before a phrase
//   Counter         "STEP 1/3" in the top-right corner
//   PhotoShot       a creased print on the desk, focusing in, carried through the cuts
//   Win             a torn window onto one part of a page, on the desk
//   DocShot         a page on the desk (Sheet) with a camera path, swipes and a source tag
//   Motif           the three words, on a torn strip of the committee's own letter
//   EDISTO          line boxes on the Edisto documents (source pixels), for Swipe and Spot
// The board each chapter ends on is in ep1board.tsx.
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {DarkPaper, Sfx} from './common';
import {JF, Tag, useGFrame} from './Kit';
import type {TL} from './shell';
import {type Box, camAt, carry, FocusIn, Sheet, type SheetCam} from './vox';

export {type Box, camAt, carry, CORAL, FocusIn, type RunItem, Sheet, type SheetCam, Slip, Spot, Swipe, TEAL, Tear, WordRun} from './vox';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** A hard cut lands two frames before the word that starts the new idea. */
export const cut = (t: TL, p: string, n = 1) => t.at(p, n) - 2;

/** Documents and engravings: near-B&W, the paper lifted, the ink deepened. */
export const DOC_F = 'grayscale(1) sepia(0.15) contrast(1.45) brightness(1.06)';
export const PRINT_F = 'grayscale(1) contrast(1.3) brightness(0.98)';

/** "STEP 1/3" (or any label) in the top-right corner, mono caps. */
export const Counter: React.FC<{n: number; of?: number; at: number; label?: string; out?: number}> = ({n, of = 3, at, label = 'STEP', out = 1e7}) => {
  const g = useGFrame();
  if (g < at || g >= out) return null;
  return <div style={{position: 'absolute', right: 110, top: 100, fontFamily: JF.mono, fontSize: 34, letterSpacing: 2, color: '#f4efe6', textShadow: '0 2px 10px #000'}}>{label} {n}/{of}</div>;
};

/** A creased print (public/img/wall/cr_*.png, tools/crease.py) on the desk, focusing in at `a`, carried through the cuts. */
export const PhotoShot: React.FC<{src: string; size: [number, number]; a: number; b: number; w: number; x?: number; y?: number; rot?: number; tag: string; children?: React.ReactNode}> = ({
  src, size, a, b, w, x = 960, y = 540, rot = 0, tag, children,
}) => {
  const f = useCurrentFrame();
  const h = (size[1] * w) / size[0];
  const push = interpolate(f, [a, b], [1, 1.04], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={a}>
        <Img src={staticFile(src)} style={{position: 'absolute', left: x - w / 2 + carry(f, a, b), top: y - h / 2, width: w, height: h,
          transform: `rotate(${rot}deg) scale(${push})`, filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.7))'}} />
      </FocusIn>
      {children}
      <Sfx at={a} src="sfx/tick.wav" volume={0.35} />
      <Tag text={tag} />
    </AbsoluteFill>
  );
};

/** A torn window onto one part of a page (centred on page px cx, cy at scale s), lying on the desk. */
export const Win: React.FC<{src: string; cx: number; cy: number; s: number; w: number; h: number; x: number; y: number; r?: number; filter?: string; seed?: string}> = ({
  src, cx, cy, s, w, h, x, y, r = 0, filter = 'grayscale(1) sepia(0.12) contrast(1.15)',
}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${r}deg)`, filter: 'drop-shadow(0 14px 20px rgba(0,0,0,0.7))'}}>
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#ddd6c6', clipPath: 'polygon(0 2%, 100% 0, 99% 97%, 1% 100%)'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', left: w / 2 - cx * s, top: h / 2 - cy * s, transform: `scale(${s})`, transformOrigin: '0 0', filter}} />
    </div>
  </div>
);

/** A page on the desk with a camera path: keys are [frame, SheetCam]. Children are drawn in page pixels (swipes, spots). */
export const DocShot: React.FC<{src: string; size: [number, number]; keys: [number, SheetCam][]; tag: string; seed?: string; filter?: string; focusAt?: number;
  carryFrom?: number; carryTo?: number; children?: React.ReactNode; over?: React.ReactNode}> = ({src, size, keys, tag, seed, filter = DOC_F, focusAt, carryFrom, carryTo, children, over}) => {
  const f = useCurrentFrame();
  const cam = camAt(keys, f);
  const off: [number, number] = [carryFrom === undefined ? 0 : carry(f, carryFrom, carryTo ?? 1e7), 0];
  const sheet = <Sheet src={src} size={size} cam={cam} seed={seed ?? src} filter={filter} offset={off}>{children}</Sheet>;
  return (
    <AbsoluteFill>
      <DarkPaper />
      {focusAt === undefined ? sheet : <FocusIn at={focusAt}>{sheet}</FocusIn>}
      {over}
      <Tag text={tag} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------ the Edisto documents
/** The petition's pages, cropped out of the microfilm's black border (boxes below are in these crops' pixels). */
export const PETITION_P1 = 'img/ep1/edisto_petition_to_president_28oct1865_p1_page.jpg';
export const PETITION_P3 = 'img/ep1/edisto_petition_to_president_28oct1865_p3_page.jpg';
export const LETTER_P1 = 'img/ep1/edisto_letter_to_howard_oct1865_p1.jpg';
export const THREE_WORDS = 'img/ep1/edisto_letter_landless_homeless_voteless_detail.jpg';
export const EDISTO = {
  p1Size: [1775, 2640] as [number, number],
  p3Size: [1780, 2635] as [number, number],
  letterSize: [1970, 2672] as [number, number],
  wordsSize: [1700, 961] as [number, number],
  /** p3: "We wish to have A home If / It be but A few acres." */
  fewAcres: [[755, 245, 810, 80], [55, 325, 720, 80]] as Box[],
  /** p3: "In behalf of the Freedmen" and the committee's three names */
  signatures: [550, 1540, 980, 370] as Box,
  bram: [970, 1650, 470, 70] as Box,
  moultrie: [970, 1720, 560, 80] as Box,
  sampson: [970, 1800, 540, 90] as Box,
  /** the three words on the letter's detail crop */
  landless: [176, 382, 250, 76] as Box,
  homeless: [432, 382, 262, 76] as Box,
  voteless: [700, 382, 262, 76] as Box,
};
export const SRC = {
  petition: 'Edisto Island committee to the President, Oct. 28, 1865 · National Archives (M752)',
  letter: 'Edisto Island committee to Gen. O. O. Howard, Oct. 1865 · National Archives (M752)',
};

/** The motif: the committee's own three words, on a torn strip of their letter, with an optional line under it. */
export const Motif: React.FC<{x: number; y: number; w?: number; at: number; rot?: number; under?: React.ReactNode}> = ({x, y, w = 900, at, rot = -2, under}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 4, at + 7], [1.2, 0.97, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: '50% 50%',
      opacity: interpolate(f, [at, at + 2], [0, 1], clamp), filter: 'drop-shadow(6px 8px 0 rgba(0,0,0,0.55))'}}>
      <Img src={staticFile('img/wall/cr_three_words.png')} style={{width: w, display: 'block'}} />
      {under}
    </div>
  );
};
