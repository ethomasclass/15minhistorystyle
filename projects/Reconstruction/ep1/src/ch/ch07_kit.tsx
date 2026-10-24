// Helpers for chapters 7 and 8 (Ch08 imports them too). Nothing here is shared with other chapters.
//   SheetTint   coral tint + teal trace of a masked subject, drawn inside a Sheet (page pixels)
//   PrintShot   a creased print (tools/crease.py, no crop) on the desk, its subject tinted with the original's mask
//   PageWin     a torn window onto part of a page, with children (swipes) in page pixels
//   Ink         a held swipe: the coral highlighter already on the lines
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {DarkPaper, Sfx} from '../kit/common';
import {Tag, Traced, useGFrame} from '../kit/Kit';
import type {MaskRef} from '../kit/maskref';
import {type Box, carry, CORAL, FocusIn} from '../kit/rc';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Three blended layers of coral limited by an alpha mask (the Kit's Tint), sized w x h at (left, top). `extra` adds a
 *  second mask image that is intersected with the first (the creased print's own alpha: no tint on torn-away paper). */
const TintLayers: React.FC<{mask: string; left: number; top: number; w: number; h: number; o: number; extra?: string}> = ({mask, left, top, w, h, o, extra}) => {
  const img = extra ? `url(${staticFile(mask)}), url(${staticFile(extra)})` : `url(${staticFile(mask)})`;
  const m = {
    position: 'absolute', left, top, width: w, height: h,
    WebkitMaskImage: img, WebkitMaskSize: '100% 100%', maskImage: img, maskSize: '100% 100%',
    ...(extra ? {WebkitMaskComposite: 'source-in', maskComposite: 'intersect'} : {}),
  } as React.CSSProperties;
  return (
    <>
      <div style={{...m, background: CORAL, mixBlendMode: 'color', opacity: o}} />
      <div style={{...m, background: CORAL, mixBlendMode: 'multiply', opacity: 0.3 * o}} />
      <div style={{...m, background: CORAL, mixBlendMode: 'screen', opacity: 0.28 * o}} />
    </>
  );
};

/** Inside a Sheet: tint the masked subject from `at`, trace it from `traceAt`. `z` is the camera zoom (keeps the line ~5 px). */
export const SheetTint: React.FC<{mask: MaskRef; at: number; traceAt?: number; z: number}> = ({mask, at, traceAt, z}) => {
  const g = useGFrame();
  if (g < at) return null;
  const [w, h] = mask.data.size;
  const o = interpolate(g, [at, at + 6], [0, 1], clamp);
  return (
    <>
      <TintLayers mask={mask.alpha} left={0} top={0} w={w} h={h} o={o} />
      <Traced paths={mask.data.shapes.subject} place={{left: 0, top: 0, scale: 1}} at={traceAt ?? at + 3} dur={12} width={5 / z} />
    </>
  );
};

/** A creased print on the desk (focus-in at `a`, carried through the cuts), optionally with its subject tinted and traced. */
export const PrintShot: React.FC<{src: string; size: [number, number]; a: number; b: number; w: number; x?: number; y?: number; rot?: number; tag: string;
  mask?: MaskRef; tintAt?: number; strength?: number; children?: React.ReactNode}> = ({src, size, a, b, w, x = 960, y = 540, rot = 0, tag, mask, tintAt, strength = 0.6, children}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const h = (size[1] * w) / size[0];
  const push = interpolate(f, [a, b], [1, 1.04], clamp);
  const k = w / (mask?.data.size[0] ?? 1);
  const tOn = mask && tintAt !== undefined && g >= tintAt;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={a}>
        <div style={{position: 'absolute', left: x - w / 2 + carry(f, a, b), top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg) scale(${push})`,
          filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.7))'}}>
          <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: w, height: h}} />
          {tOn && <TintLayers mask={mask.alpha} left={0} top={0} w={w} h={h} o={interpolate(g, [tintAt, tintAt + 6], [0, strength], clamp)} extra={src} />}
          {tOn && <Traced paths={mask.data.shapes.subject} place={{left: 0, top: 0, scale: k}} at={tintAt + 3} dur={12} width={5} />}
        </div>
      </FocusIn>
      {children}
      <Sfx at={a} src="sfx/tick.wav" volume={0.35} />
      <Tag text={tag} />
    </AbsoluteFill>
  );
};

/** A torn window onto part of a page (centred on page px cx, cy at scale s), lying on the desk; children in page px. */
export const PageWin: React.FC<{src: string; cx: number; cy: number; s: number; w: number; h: number; x: number; y: number; r?: number; filter?: string; children?: React.ReactNode}> = ({
  src, cx, cy, s, w, h, x, y, r = 0, filter = 'grayscale(1) sepia(0.12) contrast(1.2)', children,
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

/** The coral highlighter already laid on lines (page px), e.g. a swipe the viewer saw in an earlier shot. */
export const Ink: React.FC<{lines: Box[]; seed?: string}> = ({lines, seed = 'ink'}) => (
  <>
    {lines.map(([x, y, w, h], i) => {
      const pts: string[] = [];
      for (let k = 0; k <= 30; k++) pts.push(`${(k / 30) * 100}% ${random(`${seed}t${i}${k}`) * 14}%`);
      for (let k = 30; k >= 0; k--) pts.push(`${(k / 30) * 100}% ${100 - random(`${seed}b${i}${k}`) * 14}%`);
      return <div key={i} style={{position: 'absolute', left: x - h * 0.15, top: y - h * 0.08, width: w + h * 0.3, height: h * 1.16, background: CORAL, opacity: 0.8,
        mixBlendMode: 'multiply', clipPath: `polygon(${pts.join(',')})`}} />;
    })}
  </>
);
