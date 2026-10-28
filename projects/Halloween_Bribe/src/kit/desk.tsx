// The house look for photos: everything sits on the dark ruled notebook paper. Either the subject is cut out of its photo
// (Cut: black and white, teal trace, coral on the one key subject) or, when a picture has no single subject or its mask
// fails (landscapes, crowds, rooms, a speck in the sky), the photo lands on the desk as a cream card (Desk).
// No full-screen photos with slow pushes, no 3D fly-throughs, no color photos. From The Balloon War.
//
// Masks come from tools/mask.py (src/masks.ts); cut-out layers from tools/layers.py (public/img/layers/<name>_fg.webp).
import React from 'react';
import {AbsoluteFill, Img, spring, staticFile, useVideoConfig} from 'remotion';
import {Tag, Tint, Traced, useGFrame, type Place} from './Kit';
import {DarkPaper} from './common';
import type {MaskRef} from './maskref';

const BW = 'grayscale(1) contrast(1.12)';
type Box = [number, number, number, number];

/** The masked subject at `place`: the cut-out layer alone (springs up at `at`), or with `whole` the full picture `src`. */
export const Cutout: React.FC<{name: string; mask: MaskRef; size: [number, number]; place: Place; at: number; traceAt: number; whole?: boolean; src?: string; tint?: boolean}> = ({
  name, mask, size, place, at, traceAt, whole, src, tint = true,
}) => {
  const g = useGFrame();
  const {fps} = useVideoConfig();
  const k = whole ? 1 : spring({frame: g - at, fps, config: {damping: 14, mass: 0.8}});
  if (!whole && g < at) return null;
  const file = whole ? (src ?? `img/layers/${name}_bg.jpg`) : `img/layers/${name}_fg.webp`;
  const p: Place = {left: place.left, top: place.top + (1 - k) * 160, scale: place.scale};
  const img = (extra?: React.CSSProperties) => (
    <Img src={staticFile(file)} style={{position: 'absolute', left: p.left, top: p.top, width: size[0] * p.scale, height: size[1] * p.scale, filter: BW, ...extra}} />
  );
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: Math.min(1, k * 1.5)}}>
      {!whole && img({filter: 'brightness(0) blur(14px)', opacity: 0.45, transform: 'translate(10px, 14px)'})}
      {img()}
      {tint && <Tint mask={mask.alpha} place={p} size={size} />}
      <Traced paths={mask.data.shapes.subject} place={p} at={traceAt} dur={12} width={5} part={0.92} />
    </div>
  );
};

/**
 * The subject cut out and standing on the paper, fitted into `box` (x, y, w, h; bottom-aligned, centred across). It
 * springs up at `at`, floats very slightly, and its outline draws on at `traceAt`. `tint`: the coral subject (one per scene).
 * `bare` leaves out the paper, for several cut-outs in one scene. Place any edge the source cuts off (a shoulder, a
 * balloon's top) off-frame so no straight cut shows.
 */
export const Cut: React.FC<{name: string; mask: MaskRef; size: [number, number]; box: Box; at: number; traceAt?: number; tint?: boolean; tag?: string;
  valign?: 'bottom' | 'center'; bare?: boolean; children?: React.ReactNode}> = ({name, mask, size, box, at, traceAt, tint = true, tag, valign = 'bottom', bare, children}) => {
  const g = useGFrame();
  const [x0, y0, x1, y1] = mask.data.boxes.subject;
  const [bx, by, bw, bh] = box;
  const sc = Math.min(bw / (x1 - x0), bh / (y1 - y0));
  const float = Math.sin(g / 45) * 4;
  const top = (valign === 'bottom' ? by + bh - (y1 - y0) * sc : by + (bh - (y1 - y0) * sc) / 2) - y0 * sc + float;
  const place: Place = {left: bx + (bw - (x1 - x0) * sc) / 2 - x0 * sc, top, scale: sc};
  return (
    <AbsoluteFill>
      {!bare && <DarkPaper />}
      <Cutout name={name} mask={mask} size={size} place={place} at={at} traceAt={traceAt ?? at + 8} tint={tint} />
      {children}
      {tag && <Tag text={tag} />}
    </AbsoluteFill>
  );
};

/**
 * A photo as a cream card on the desk: drops in at `at`, drifts a few pixels, no zoom. `pos` is the cover crop's
 * focus (0..1). With `mask` the subject inside the card is tinted and traced. Children may be a function of S, which maps
 * a source pixel to the screen (for a loop or arrow on something in the photo).
 */
export const Desk: React.FC<{src: string; size: [number, number]; box: Box; at: number; rot?: number; pos?: [number, number]; name?: string; mask?: MaskRef;
  traceAt?: number; tag?: string; children?: React.ReactNode | ((S: (x: number, y: number) => number[]) => React.ReactNode)}> = ({
  src, size, box, at, rot = -2, pos = [0.5, 0.5], name, mask, traceAt, tag, children,
}) => {
  const g = useGFrame();
  const {fps} = useVideoConfig();
  const [bx, by, bw, bh] = box;
  const k = spring({frame: g - at, fps, config: {damping: 15, mass: 0.7}});
  const pad = Math.max(12, bw * 0.022);
  const iw = bw - 2 * pad, ih = bh - 2 * pad;
  const sc = Math.max(iw / size[0], ih / size[1]);
  const place: Place = {left: (iw - size[0] * sc) * pos[0], top: (ih - size[1] * sc) * pos[1], scale: sc};
  const drift = Math.sin(g / 60) * 3;
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= at && (
        <div style={{position: 'absolute', left: bx, top: by + drift, width: bw, transform: `rotate(${rot}deg) scale(${0.85 + 0.15 * k})`, opacity: Math.min(1, k * 2)}}>
          <div style={{background: '#f4efe6', padding: pad, boxShadow: '0 24px 44px rgba(0,0,0,0.7)'}}>
            <div style={{position: 'relative', width: iw, height: ih, overflow: 'hidden', background: '#111'}}>
              {mask ? <Cutout name={name ?? ''} mask={mask} size={size} place={place} at={-999} traceAt={traceAt ?? at + 8} whole src={src} />
                : <Img src={staticFile(src)} style={{position: 'absolute', left: place.left, top: place.top, width: size[0] * sc, height: size[1] * sc, filter: BW}} />}
            </div>
          </div>
        </div>
      )}
      {typeof children === 'function' ? children((x, y) => [bx + pad + place.left + x * sc, by + pad + place.top + y * sc + drift]) : children}
      {tag && <Tag text={tag} />}
    </AbsoluteFill>
  );
};
