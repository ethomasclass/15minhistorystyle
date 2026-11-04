// Small pieces shared by builder A's chapters (2, 3, 4). Copies of Ch01 patterns plus two Print variants:
//   NoPhoto    the mono label for a person with no photo (Ch01's, copied: it isn't exported there)
//   CropPrint  a Print (kit/print.tsx) showing a window of the source, so marks can sit on source pixels (S(sx, sy) -> screen)
//   TintPrint  a Print with an existing tools/mask.py mask laid over it as the coral subject tint (fades in at `tintAt`)
//   JetMap     placeholder for the 3D PacificWinds piece: Mikesh's winter jet-stream map with drawn teal marks
import React from 'react';
import {Img, interpolate, staticFile} from 'remotion';
import {clamp} from '../../lib/anim';
import {JF, Tint, useGFrame, usePal} from '../../kit/Kit';
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

/** A whole print, `w` wide, with a mask's coral tint fading in at `tintAt` (only for masks that already exist in public/img/masks). */
export const TintPrint: React.FC<{src: string; size: [number, number]; mask: string; x: number; y: number; w: number; at: number; tintAt: number; rot?: number; tag?: string}> = ({
  src, size, mask, x, y, w, at, tintAt, rot = 0, tag,
}) => {
  const g = useGFrame();
  if (g < at) return null;
  const s = w / size[0];
  const h = size[1] * s;
  const place = {left: 0, top: 0, scale: s};
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `rotate(${rot}deg) scale(${slap(g, at)})`, transformOrigin: '50% 60%'}}>
      <div style={{position: 'relative', width: w, height: h, boxShadow: '0 26px 46px rgba(0,0,0,0.8)'}}>
        <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: w, height: h, filter: BW}} />
        <div style={{position: 'absolute', inset: 0, opacity: interpolate(g, [tintAt, tintAt + 8], [0, 1], clamp)}}>
          <Tint mask={mask} place={place} size={size} />
        </div>
      </div>
      {tag ? <div style={tagStyle(w, h)}>{tag}</div> : null}
    </div>
  );
};

// ---- the jet-stream map (placeholder for PacificWinds) ----
export const JET_SRC = 'img/ch04_paper_balloon/jet_stream_winter_map_fig25bottom.jpg';
export const JET_SIZE: [number, number] = [1990, 857];
/** Map pixels: Tokyo, the Oregon coast, and the winter jet stream's core (the dashed arrows on Mikesh's map). */
export const JAPAN: [number, number] = [245, 578];
export const OREGON: [number, number] = [1318, 470];
const CORE: [number, number][] = [[150, 585], [245, 572], [330, 563], [460, 553], [600, 543], [720, 532], [850, 523], [980, 530], [1100, 538], [1220, 532],
  [1300, 522], [1400, 492], [1500, 468], [1600, 452], [1700, 446], [1780, 448]];

const smooth = (pts: [number, number][], dy = 0) => {
  let d = `M${pts[0][0]},${pts[0][1] + dy}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    d += ` Q${x0},${y0 + dy} ${(x0 + x1) / 2},${(y0 + y1) / 2 + dy}`;
  }
  const [xl, yl] = pts[pts.length - 1];
  return d + ` L${xl},${yl + dy}`;
};

/**
 * The jet-stream map as a print on the desk (`x`, `y`, `w`; height from the map), with optional drawn marks in map pixels:
 * `flowAt` starts teal streams flowing west to east along the core; `children` are extra SVG marks in map pixels.
 */
export const JetMap: React.FC<{x: number; y: number; w: number; at: number; tag?: string; flowAt?: number; children?: React.ReactNode}> = ({x, y, w, at, tag, flowAt, children}) => {
  const g = useGFrame();
  const pal = usePal();
  const s = w / JET_SIZE[0];
  const h = JET_SIZE[1] * s;
  const reveal = flowAt === undefined ? 0 : interpolate(g, [flowAt, flowAt + 24], [0, 1], clamp);
  return (
    <>
      <Print src={JET_SRC} x={x} y={y} w={w} h={h} at={at} fit="contain" tag={tag} />
      {g >= at + 7 && (
        <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={w} height={h} viewBox={`0 0 ${JET_SIZE[0]} ${JET_SIZE[1]}`}>
          <defs><clipPath id="jetReveal"><rect x={0} y={0} width={JET_SIZE[0] * reveal} height={JET_SIZE[1]} /></clipPath></defs>
          {flowAt !== undefined && g >= flowAt && (
            <g clipPath="url(#jetReveal)" fill="none" strokeLinecap="round">
              {/* a band of streams, each its own speed, so the river reads as moving air */}
              {[-26, -13, 0, 13, 26].map((dy, i) => (
                <path key={i} d={smooth(CORE, dy)} stroke={pal.mark} strokeWidth={i === 2 ? 9 : 5} opacity={i === 2 ? 0.95 : 0.6}
                  strokeDasharray={i === 2 ? '46 30' : '22 34'} strokeDashoffset={-(g - flowAt) * (i === 2 ? 7 : 4 + i)} />
              ))}
            </g>
          )}
          {children}
        </svg>
      )}
    </>
  );
};

/** A hand-drawn line in map pixels (the JetMap's SVG), drawn on from `at` over `dur` frames; dashed if `dash`. */
export const MapLine: React.FC<{pts: [number, number][]; at: number; dur?: number; width?: number; color?: string; dash?: boolean}> = ({pts, at, dur = 16, width = 8, color, dash}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  const d = smooth(pts);
  const id = `ml${at}${pts.length}`;
  return (
    <>
      <defs><mask id={id} maskUnits="userSpaceOnUse" x={-2000} y={-2000} width={6000} height={5000}><path d={d} stroke="#fff" strokeWidth={width * 3} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} /></mask></defs>
      <path d={d} mask={`url(#${id})`} fill="none" stroke={color ?? pal.mark} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash ? '26 20' : undefined} />
    </>
  );
};

/** A drawn X in map pixels. */
export const MapX: React.FC<{x: number; y: number; at: number; r?: number; color?: string}> = ({x, y, at, r = 24, color}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 6], [0, 1], clamp);
  return (
    <g stroke={color ?? pal.mark} strokeWidth={9} strokeLinecap="round">
      <line x1={x - r} y1={y - r} x2={x - r + 2 * r * Math.min(1, p * 2)} y2={y - r + 2 * r * Math.min(1, p * 2)} />
      {p > 0.5 && <line x1={x + r} y1={y - r} x2={x + r - 2 * r * (p - 0.5) * 2} y2={y - r + 2 * r * (p - 0.5) * 2} />}
    </g>
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
