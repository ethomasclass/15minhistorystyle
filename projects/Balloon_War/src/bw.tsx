// The Balloon War's own scene pieces: cut-outs and desk cards on the notebook paper (everything black and white),
// and the censor bar.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp} from './lib/anim';
import {Tag, Tint, Traced, useGFrame, type Place} from './kit/Kit';
import {DarkPaper} from './kit/common';
import {MASKS} from './masks';
import {im} from './images';

export const BW = 'grayscale(1) contrast(1.12)';
export const COLOR = 'contrast(1.04) saturate(0.92)';
export const CORAL = '#FF6F61';
export const ORANGE = '#FF9F1C';

/** A censor bar that slides across (x, y, w, h) from frame `at`, and lifts again at `lift`. */
export const Redact: React.FC<{x: number; y: number; w: number; h: number; at: number; lift?: number; rot?: number}> = ({x, y, w, h, at, lift = 1e7, rot = -1}) => {
  const g = useGFrame();
  if (g < at) return null;
  const u = interpolate(g, [at, at + 6], [0, 1], clamp);
  const up = interpolate(g, [lift, lift + 8], [0, 1], clamp);
  return <div style={{position: 'absolute', left: x, top: y - up * 40, width: w * u, height: h, background: '#0b0b0b', opacity: 1 - up,
    transform: `rotate(${rot}deg)`, boxShadow: '0 6px 18px rgba(0,0,0,0.6)'}} />;
};

/**
 * A masked subject placed by hand (no full-bleed camera): the cut-out alone from tools/layers.py, or with `whole` the
 * full picture (`src`, for a photo inside a card). Tinted coral; the teal outline draws on at `traceAt`; springs up at `at`.
 */
export const Cutout: React.FC<{name: keyof typeof MASKS; size: [number, number]; place: Place; at: number; traceAt: number; whole?: boolean; src?: string; tint?: boolean}> = ({
  name, size, place, at, traceAt, whole, src, tint = true,
}) => {
  const g = useGFrame();
  const {fps} = useVideoConfig();
  const mask = MASKS[name];
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

type Box = [number, number, number, number];

/**
 * The channel's notebook look: the subject cut out of its photo, standing on the dark ruled paper. It is fitted into
 * `box` (x, y, w, h; bottom-aligned, centred across), springs up at `at`, floats very slightly, and its teal outline
 * draws on at `traceAt`. `tint` makes it the coral subject (one per scene). No camera moves.
 */
export const Cut: React.FC<{p: string; m: keyof typeof MASKS; box: Box; at: number; traceAt?: number; tint?: boolean; tag?: string;
  valign?: 'bottom' | 'center'; bare?: boolean; children?: React.ReactNode}> = ({p, m, box, at, traceAt, tint = true, tag, valign = 'bottom', bare, children}) => {
  const g = useGFrame();
  const {size} = im(p);
  const [x0, y0, x1, y1] = MASKS[m].data.boxes.subject;
  const [bx, by, bw, bh] = box;
  const sc = Math.min(bw / (x1 - x0), bh / (y1 - y0));
  const float = Math.sin(g / 45) * 4;
  const place: Place = {left: bx + (bw - (x1 - x0) * sc) / 2 - x0 * sc, top: (valign === 'bottom' ? by + bh - (y1 - y0) * sc : by + (bh - (y1 - y0) * sc) / 2) - y0 * sc + float, scale: sc};
  return (
    <AbsoluteFill>
      {!bare && <DarkPaper />}
      <Cutout name={m} size={size} place={place} at={at} traceAt={traceAt ?? at + 8} tint={tint} />
      {children}
      {tag && <Tag text={tag} />}
    </AbsoluteFill>
  );
};

/**
 * A photo as a cream card on the desk (for scenes with no single subject: landscapes, crowds, rooms). The card drops in
 * at `at` and drifts a few pixels; no zoom. With `m` the subject inside the card is tinted and traced.
 */
export const Desk: React.FC<{p: string; box: Box; at: number; rot?: number; pos?: [number, number]; m?: keyof typeof MASKS; traceAt?: number;
  tag?: string; children?: React.ReactNode | ((S: (x: number, y: number) => number[]) => React.ReactNode)}> = ({p, box, at, rot = -2, pos = [0.5, 0.5], m, traceAt, tag, children}) => {
  const g = useGFrame();
  const {fps} = useVideoConfig();
  const {src, size} = im(p);
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
              {m ? <Cutout name={m} size={size} place={place} at={-999} traceAt={traceAt ?? at + 8} whole src={src} />
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
