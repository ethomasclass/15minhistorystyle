// Helpers for chapters 4 and 5 (Ch05 imports them too). Nothing here is shared with other chapters.
//   CropPrint   a creased print cut out of its mount (tools/crease.py --crop), its subject tinted with a cropped copy of
//               the shared mask and traced with the mask's own paths, offset to the crop
//   PrintShot   one CropPrint on the desk, focusing in, carried through the cuts
//   PageWin     a torn window onto part of a page, with children (swipes) in page pixels
//   Ink         a held swipe: the coral highlighter already on the lines
//   Whooshes    a whoosh three frames before every cut
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {DarkPaper, Sfx} from '../kit/common';
import {Tag, Traced, useGFrame} from '../kit/Kit';
import {type Box, carry, CORAL, FocusIn} from '../kit/rc';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** A print's subject: the cropped alpha (same size as the print), the shared mask's paths, and the crop in source px. */
export type PrintMask = {alpha: string; paths: string[]; crop: [number, number, number, number]};

/** Coral in three blend layers, limited by the cropped mask and the print's own alpha (no tint on torn-away paper). */
const TintLayers: React.FC<{mask: string; print: string; w: number; h: number; o: number}> = ({mask, print, w, h, o}) => {
  const img = `url(${staticFile(mask)}), url(${staticFile(print)})`;
  const m = {
    position: 'absolute', left: 0, top: 0, width: w, height: h,
    WebkitMaskImage: img, WebkitMaskSize: '100% 100%', maskImage: img, maskSize: '100% 100%', WebkitMaskComposite: 'source-in', maskComposite: 'intersect',
  } as React.CSSProperties;
  return (
    <>
      <div style={{...m, background: CORAL, mixBlendMode: 'color', opacity: o}} />
      <div style={{...m, background: CORAL, mixBlendMode: 'multiply', opacity: 0.3 * o}} />
      <div style={{...m, background: CORAL, mixBlendMode: 'screen', opacity: 0.28 * o}} />
    </>
  );
};

/** The print itself, w px wide, at its own top-left; optional tint + trace from `tintAt`. */
export const CropPrint: React.FC<{src: string; size: [number, number]; w: number; mask?: PrintMask; tintAt?: number; strength?: number}> = ({src, size, w, mask, tintAt, strength = 0.6}) => {
  const g = useGFrame();
  const h = (size[1] * w) / size[0];
  const on = mask && tintAt !== undefined && g >= tintAt;
  const k = mask ? w / (mask.crop[2] - mask.crop[0]) : 1;
  return (
    <div style={{position: 'relative', width: w, height: h}}>
      <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: w, height: h}} />
      {on && <TintLayers mask={mask.alpha} print={src} w={w} h={h} o={interpolate(g, [tintAt, tintAt + 6], [0, strength], clamp)} />}
      {on && <Traced paths={mask.paths} place={{left: -mask.crop[0] * k, top: -mask.crop[1] * k, scale: k}} at={tintAt + 3} dur={12} width={5} />}
    </div>
  );
};

/** A creased print on the desk, centred at (x, y), focusing in at `a`, a slow push, carried through the cuts. */
export const PrintShot: React.FC<{src: string; size: [number, number]; a: number; b: number; w: number; x?: number; y?: number; rot?: number; tag: string;
  mask?: PrintMask; tintAt?: number; push?: number; children?: React.ReactNode}> = ({src, size, a, b, w, x = 960, y = 540, rot = 0, tag, mask, tintAt, push = 0.04, children}) => {
  const f = useCurrentFrame();
  const h = (size[1] * w) / size[0];
  const k = interpolate(f, [a, b], [1, 1 + push], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={a}>
        <div style={{position: 'absolute', left: x - w / 2 + carry(f, a, b), top: y - h / 2, transform: `rotate(${rot}deg) scale(${k})`, filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.7))'}}>
          <CropPrint src={src} size={size} w={w} mask={mask} tintAt={tintAt} />
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

/** A whoosh just before every hard cut after the first. */
export const Whooshes: React.FC<{at: number[]; volume?: number}> = ({at, volume = 0.2}) => <>{at.map((f) => <Sfx key={f} at={f - 3} src="sfx/whoosh.wav" volume={volume} />)}</>;
/** A stamp sound on each title or stamp. */
export const Stamps: React.FC<{at: number[]}> = ({at}) => <>{at.map((f) => <Sfx key={f} at={f} src="sfx/stamp.wav" volume={0.33} />)}</>;
