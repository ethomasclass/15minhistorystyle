// Chapter 10 helpers: windows onto pages, pop-ins, ticks and crosses, the column headers, and the three amendments laid out
// as one composition on the desk (used for "Reconstruction delivered the law" and again for "a second founding").
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {DarkPaper, Sfx} from '../kit/common';
import {BRAND, Ctx, Scrap} from '../kit/board';
import {JF, Tag, useGFrame} from '../kit/Kit';
import {type Box, CORAL, DOC_F, Slip, Swipe, TEAL} from '../kit/rc';

/** Mounts its children from `at` to `out`, popping in. */
export const Gate: React.FC<{at: number; out?: number; children: React.ReactNode}> = ({at, out = 1e7, children}) => {
  const f = useCurrentFrame();
  if (f < at || f >= out) return null;
  const k = interpolate(f, [at, at + 3, at + 6], [1.12, 0.98, 1], clamp);
  return <AbsoluteFill style={{transform: `scale(${k})`, opacity: interpolate(f, [at, at + 2], [0, 1], clamp)}}>{children}</AbsoluteFill>;
};

/** A torn window onto part of a page (centred on page px cx, cy at scale s), on the desk; children in page px (swipes). */
export const DocWin: React.FC<{src: string; size: [number, number]; cx: number; cy: number; s: number; w: number; h: number; x: number; y: number; r?: number; filter?: string;
  children?: React.ReactNode}> = ({src, size, cx, cy, s, w, h, x, y, r = 0, filter = DOC_F, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${r}deg)`, filter: 'drop-shadow(0 14px 20px rgba(0,0,0,0.7))'}}>
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#ddd6c6', clipPath: 'polygon(0 3%, 100% 0, 99% 96%, 1% 100%)'}}>
      <div style={{position: 'absolute', left: w / 2 - cx * s, top: h / 2 - cy * s, width: size[0], height: size[1], transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: size[0], height: size[1], filter}} />
        {children}
      </div>
    </div>
  </div>
);

/** A hand-drawn tick (teal) or cross (coral), drawn on. */
export const Mark: React.FC<{kind: 'yes' | 'no'; x: number; y: number; at: number; s?: number}> = ({kind, x, y, at, s = 70}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 6], [0, 1], clamp);
  const q = interpolate(g, [at + 4, at + 9], [0, 1], clamp);
  const st = {fill: 'none', stroke: kind === 'yes' ? TEAL : CORAL, strokeWidth: 12, strokeLinecap: 'round' as const, pathLength: 1, strokeDasharray: 1};
  return (
    <svg width={s * 1.4} height={s * 1.4} style={{position: 'absolute', left: x, top: y, overflow: 'visible', filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,0.55))'}}>
      {kind === 'yes'
        ? <path d={`M${s * 0.1},${s * 0.6} L${s * 0.42},${s * 0.95} L${s * 1.2},${s * 0.05}`} {...st} strokeDashoffset={1 - p} />
        : <>
          <path d={`M${s * 0.1},${s * 0.1} L${s * 1.1},${s * 1.1}`} {...st} strokeDashoffset={1 - p} />
          <path d={`M${s * 1.1},${s * 0.1} L${s * 0.1},${s * 1.1}`} {...st} strokeDashoffset={1 - q} />
        </>}
    </svg>
  );
};

/** A column header: mono caps on a dark band. */
export const Header: React.FC<{text: string; x: number; y?: number; color: string; at: number; dim?: number}> = ({text, x, y = 104, color, at, dim = 1}) => {
  const g = useGFrame();
  if (g < at) return null;
  return <div style={{position: 'absolute', left: x, top: y, fontFamily: JF.mono, fontSize: 34, letterSpacing: 3, color, background: 'rgba(10,10,10,0.78)', padding: '8px 18px',
    opacity: interpolate(g, [at, at + 5], [0, 1], clamp) * dim}}>{text}</div>;
};

// ------------------------------------------------------------------------------------------ the three amendments
const T13 = 'img/ep1/thirteenth_src.jpg';
const T13_S: [number, number] = [3196, 4253];
/** "Neither slavery nor involuntary servitude," (measured on the image) */
const T13_LINE: Box = [580, 935, 1230, 62];
const T15 = 'img/ep2/fifteenth_amendment_joint_resolution_1869_nara.jpg';
const T15_S: [number, number] = [1920, 2690];
/** "on account of race, color, or previous condition of servitude" */
const T15_LINE: Box = [190, 1398, 1415, 56];
export const AMEND_TAG = 'Joint resolutions: 13th Amendment, 1865 (Library of Congress) · 15th Amendment, 1869 (National Archives) · 14th Amendment §1, text';

/**
 * The three amendments stacked like the LAW column: the 13th's handwritten line, the 14th's words on a scrap, the 15th's
 * line. Each lands at its frame (t13/t14/t15) and is marked over [from, to] (h13/h14/h15). Pass frames in the past for a
 * finished layout. `a`/`b` frame the slow push.
 */
export const Amendments: React.FC<{a: number; b: number; t13: number; t14: number; t15: number; h13: [number, number]; h14: [number, number]; h15: [number, number];
  head?: React.ReactNode; over?: React.ReactNode}> = ({a, b, t13, t14, t15, h13, h14, h15, head, over}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const push = interpolate(f, [a, b], [1, 1.035], clamp);
  const hl = interpolate(g, h14, [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '55% 50%'}}>
        <Gate at={t13}>
          <DocWin src={T13} size={T13_S} cx={1195} cy={965} s={0.72} w={1220} h={180} x={560} y={190} r={-1} filter="grayscale(1) sepia(0.15) contrast(1.9) brightness(1.08)">
            <Swipe lines={[T13_LINE]} from={h13[0]} to={h13[1]} seed="a13" />
          </DocWin>
        </Gate>
        <Gate at={t14}>
          <Ctx.Provider value={BRAND}>
            <div style={{position: 'absolute', left: 560, top: 455, transform: 'rotate(0.8deg)', filter: 'drop-shadow(0 14px 20px rgba(0,0,0,0.7))'}}>
              <Scrap text="No State shall … deny to any person within its jurisdiction the equal protection of the laws." mark="the equal protection of the laws" w={1220} seed="a14" size={40} hl={hl} />
            </div>
          </Ctx.Provider>
        </Gate>
        <Gate at={t15}>
          <DocWin src={T15} size={T15_S} cx={900} cy={1360} s={0.72} w={1220} h={180} x={560} y={690} r={1} filter="grayscale(1) sepia(0.15) contrast(1.5) brightness(1.02)">
            <Swipe lines={[T15_LINE]} from={h15[0]} to={h15[1]} seed="a15" />
          </DocWin>
        </Gate>
        <Slip text="13th · 1865" x={140} y={235} size={56} rot={-2} at={t13 + 2} />
        <Slip text="14th · 1868" x={140} y={485} size={56} rot={2} at={t14 + 2} />
        <Slip text="15th · 1870" x={140} y={735} size={56} rot={-2} at={t15 + 2} />
        {head}
      </AbsoluteFill>
      {over}
      {[t13, t14, t15].map((x, i) => x >= a && <Sfx key={i} at={x} src="sfx/tick.wav" volume={0.38} />)}
      <Tag text={AMEND_TAG} />
    </AbsoluteFill>
  );
};
