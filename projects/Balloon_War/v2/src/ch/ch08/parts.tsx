// Pieces shared by chapters 8 and 9 (builder C): quiet print, full-bleed photo with its tag, plain-type quotes, the no-photo
// label (Ch01's NoPhoto with a position), a zoom wrapper for pushing into one spot of a silhouette painting, a typed line.
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../../lib/anim';
import {JF, Tag, useGFrame} from '../../kit/Kit';
import {Photo} from '../../kit/shell';

/** A small mono label for a person with no photo (Ch01's NoPhoto), optionally placed. */
export const NoPhoto: React.FC<{text: string; at: number; x?: number; y?: number; out?: number}> = ({text, at, x = 110, y, out = Infinity}) => {
  const g = useGFrame();
  if (g < at || g >= out) return null;
  return (
    <div style={{position: 'absolute', left: x, ...(y === undefined ? {bottom: 104} : {top: y}), fontFamily: JF.mono, fontSize: 20, letterSpacing: 2,
      color: 'rgba(244,239,230,0.8)', textTransform: 'uppercase', textShadow: '0 1px 8px rgba(0,0,0,0.95)', opacity: interpolate(g, [at, at + 6], [0, 1], clamp)}}>{text}</div>
  );
};

/**
 * An archival print on the black desk like kit/print.tsx, but it fades in and settles instead of slapping down (for the heavy
 * chapter and the quiet ending). Same look: B&W, deep shadow, mono source tag under it.
 */
export const QuietPrint: React.FC<{src: string; x: number; y: number; w: number; h: number; at: number; rot?: number; pos?: string; tag?: string;
  fit?: 'cover' | 'contain'; dur?: number; dim?: number; crop?: number}> = ({src, x, y, w, h, at, rot = 0, pos = '50% 25%', tag, fit = 'cover', dur = 12, dim = 0, crop = 1}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + dur], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, opacity: k, transform: `rotate(${rot}deg) scale(${1.03 - 0.03 * k})`, transformOrigin: '50% 60%'}}>
      {/* `crop` > 1 trims a scan's film border by zooming the picture inside its own frame */}
      <div style={{width: w, height: h, overflow: 'hidden', boxShadow: '0 26px 46px rgba(0,0,0,0.8)'}}>
        <Img src={staticFile(src)} style={{width: w, height: h, objectFit: fit, objectPosition: pos, display: 'block', transform: `scale(${crop})`,
          filter: `grayscale(1) contrast(1.15) brightness(${0.95 - dim})`}} />
      </div>
      {tag ? <div style={{position: 'absolute', left: 0, top: h + 14, width: 'max-content', maxWidth: w + 60, fontFamily: JF.mono, fontSize: 16, letterSpacing: 1,
        color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>{tag}</div> : null}
    </div>
  );
};

/** Full-bleed B&W archival photo (kit Photo, slow push between a and b) with its source tag bottom left. */
export const FullPhoto: React.FC<{src: string; size: [number, number]; fx: number; fy: number; z0?: number; z1?: number; a: number; b: number; tag: string;
  dim?: number; vignette?: number}> = ({src, size, fx, fy, z0 = 1.02, z1 = 1.08, a, b, tag, dim = 0, vignette = 0.65}) => (
  <AbsoluteFill>
    <Photo src={src} size={size} fx={fx} fy={fy} z0={z0} z1={z1} a={a} b={b} vignette={vignette} bw={`grayscale(1) contrast(1.15) brightness(${0.95 - dim})`} />
    <Tag text={tag} x={110} y={1010} />
  </AbsoluteFill>
);

/**
 * Plain type, no tape (Archie's words, Dottie's question, the closing line): cream Inter on the dark, revealed in parts.
 * `parts`: [text, frame] pairs; each part fades in at its frame. `who`: a mono attribution under it.
 */
export const Plain: React.FC<{parts: [string, number][]; x: number; y: number; w: number; size?: number; who?: string; whoAt?: number; out?: number; align?: 'left' | 'center'}> = ({
  parts, x, y, w, size = 58, who, whoAt, out = Infinity, align = 'left',
}) => {
  const f = useCurrentFrame();
  if (f < parts[0][1] || f >= out) return null;
  const fade = out === Infinity ? 1 : interpolate(f, [out - 12, out], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, opacity: fade, textAlign: align}}>
      <div style={{fontFamily: JF.sans, fontWeight: 600, fontSize: size, lineHeight: 1.32, color: '#f4efe6', whiteSpace: 'pre-line', textShadow: '0 3px 16px rgba(0,0,0,0.95)'}}>
        {parts.map(([s, at], i) => <span key={i} style={{opacity: interpolate(f, [at, at + 8], [0, 1], clamp)}}>{s}</span>)}
      </div>
      {who && f >= (whoAt ?? parts[0][1]) && <div style={{marginTop: 26, fontFamily: JF.mono, fontSize: 22, letterSpacing: 2, color: 'rgba(244,239,230,0.75)', textTransform: 'uppercase',
        opacity: interpolate(f, [whoAt ?? parts[0][1], (whoAt ?? parts[0][1]) + 8], [0, 1], clamp)}}>{who}</div>}
    </div>
  );
};

/**
 * Push into one spot of a full-frame picture: scales the children from 1 to `s` about (ox, oy) while moving that point toward
 * (tx, ty), eased between frames a and b. Keep (tx, ty) close enough that the frame stays covered: ox(1-s) + (tx-ox) <= 0 etc.
 */
export const Zoom: React.FC<{a: number; b: number; s: number; ox: number; oy: number; tx?: number; ty?: number; children: React.ReactNode}> = ({a, b, s, ox, oy, tx = ox, ty = oy, children}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [a, b], [0, 1], {...clamp, easing: (t) => (1 - Math.cos(Math.PI * t)) / 2});
  return (
    <AbsoluteFill style={{transformOrigin: `${ox}px ${oy}px`, transform: `translate(${(tx - ox) * p}px, ${(ty - oy) * p}px) scale(${1 + (s - 1) * p})`}}>
      {children}
    </AbsoluteFill>
  );
};

/** A typed line, character by character from `at` over `dur` frames, with a blinking caret while it types. */
export const Typed: React.FC<{text: string; x: number; y: number; at: number; dur: number; size?: number; w?: number}> = ({text, x, y, at, dur, size = 46, w = 1500}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const n = Math.round(interpolate(f, [at, at + dur], [0, text.length], clamp));
  const caret = n < text.length || Math.floor(f / 15) % 2 === 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, fontFamily: JF.mono, fontSize: size, lineHeight: 1.4, color: '#ece6d8', textShadow: '0 2px 10px #000'}}>
      {text.slice(0, n)}<span style={{opacity: caret ? 0.8 : 0}}>▌</span>
    </div>
  );
};
