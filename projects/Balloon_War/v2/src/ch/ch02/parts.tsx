// Small pieces shared by builder A's chapters (2, 3, 4). Copies of Ch01 patterns plus a Print variant:
//   NoPhoto    the mono label for a person with no photo (Ch01's, copied: it isn't exported there)
//   CropPrint  a Print (kit/print.tsx) showing a window of the source, so marks can sit on source pixels (S(sx, sy) -> screen)
import React from 'react';
import {Img, interpolate, staticFile} from 'remotion';
import {clamp} from '../../lib/anim';
import {JF, useGFrame, usePal} from '../../kit/Kit';
import {Print} from '../../kit/print';

/** A small mono label for a person with no photo (always anonymous silhouettes). */
export const NoPhoto: React.FC<{text: string; at: number}> = ({text, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  return (
    <div style={{position: 'absolute', left: 110, bottom: 104, fontFamily: JF.mono, fontSize: 20, letterSpacing: 2, color: 'rgba(244,239,230,0.8)',
      textTransform: 'uppercase', textShadow: '0 1px 8px rgba(0,0,0,0.95)', opacity: interpolate(g, [at, at + 6], [0, 1], clamp)}}>{text}</div>
  );
};

/** Print's slap-down scale (kit/print.tsx). */
const slap = (g: number, at: number) => interpolate(g, [at, at + 4, at + 7], [1.3, 0.96, 1], clamp);

const tagStyle = (w: number, h: number): React.CSSProperties => ({position: 'absolute', left: 0, top: h + 14, width: 'max-content', maxWidth: w + 60, fontFamily: JF.mono,
  fontSize: 16, letterSpacing: 1, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.9)'});

const BW = 'grayscale(1) contrast(1.15) brightness(0.95)';

export type Crop = [number, number, number, number];

/** Screen mapper for a CropPrint once it has landed: source pixel -> screen. */
export const cropMap = (x: number, y: number, w: number, crop: Crop) => (sx: number, sy: number): [number, number] => {
  const s = w / crop[2];
  return [x + (sx - crop[0]) * s, y + (sy - crop[1]) * s];
};

/** A print of a window `crop` = [sx, sy, sw, sh] of the source, `w` px wide on screen (height follows the crop). */
export const CropPrint: React.FC<{src: string; size: [number, number]; crop: Crop; x: number; y: number; w: number; at: number; rot?: number; tag?: string}> = ({
  src, size, crop, x, y, w, at, rot = 0, tag,
}) => {
  const g = useGFrame();
  if (g < at) return null;
  const s = w / crop[2];
  const h = crop[3] * s;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `rotate(${rot}deg) scale(${slap(g, at)})`, transformOrigin: '50% 60%'}}>
      <div style={{position: 'relative', width: w, height: h, overflow: 'hidden', boxShadow: '0 26px 46px rgba(0,0,0,0.8)'}}>
        <Img src={staticFile(src)} style={{position: 'absolute', left: -crop[0] * s, top: -crop[1] * s, width: size[0] * s, height: size[1] * s, filter: BW}} />
      </div>
      {tag ? <div style={tagStyle(w, h)}>{tag}</div> : null}
    </div>
  );
};

/** A hand-drawn path in screen px (a door, a house, a sawtooth), drawn on from `at` over `dur` frames. */
export const DrawPath: React.FC<{d: string; at: number; dur?: number; width?: number; color?: string; dash?: string}> = ({d, at, dur = 12, width = 6, color, dash}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      {dash ? (
        <>
          <defs><mask id={`dp${at}`} maskUnits="userSpaceOnUse" x={0} y={0} width={1920} height={1080}>
            <path d={d} stroke="#fff" strokeWidth={width * 3} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} /></mask></defs>
          <path d={d} mask={`url(#dp${at})`} fill="none" stroke={color ?? pal.mark} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} />
        </>
      ) : (
        <path d={d} fill="none" stroke={color ?? pal.mark} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      )}
    </svg>
  );
};

/** A rubber stamp: cream letters in a ruled box, thumped down at `at`. */
export const RubberStamp: React.FC<{text: string; x: number; y: number; at: number; size?: number; rot?: number}> = ({text, x, y, at, size = 110, rot = -8}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [1.4, 0.95, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: 'center', padding: `${size * 0.08}px ${size * 0.22}px`,
      border: `${Math.round(size * 0.07)}px solid rgba(244,239,230,0.92)`, borderRadius: 8, fontFamily: JF.display, fontSize: size, lineHeight: 1.05, letterSpacing: 4,
      color: 'rgba(244,239,230,0.92)', whiteSpace: 'nowrap', textShadow: '0 4px 18px rgba(0,0,0,0.8)', boxShadow: '0 4px 18px rgba(0,0,0,0.5), inset 0 0 18px rgba(0,0,0,0.4)',
      opacity: interpolate(g, [at, at + 2], [0, 1], clamp)}}>{text}</div>
  );
};
