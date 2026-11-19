// Thanksgiving: placeholders for assets that haven't landed yet, and the two picture modes this video adds
// (BUILD_BRIEF.md, IMAGE_PRESENTATION.md). Written for ch05/ch06; any chapter may use them.
//
//   Ph          a labelled placeholder card: a plain dark rectangle the size and place of the missing asset, the intended
//               file name in mono. It arrives the way the real asset will (`land`: rise = a cut-out, slap = a print).
//   TgPrint     Print (kit/print.tsx) with a `color` switch: the 1950s ads, the Jell-O booklet and the food props may keep
//               their colour in this video; archival photos and engravings stay B&W.
//   PrintOr     the print if its file is in public/, otherwise its placeholder (so a scan dropped in swaps itself).
//   FullFrame   a document or ad filling the frame, with an optional slow guided pan or pan-to-reveal (the user's Nov 2026
//               test, documents and ads only, at most 1-2 per chapter, never two in a row, always ending on a held frame
//               or a hard cut). Camera keys in source px; never shows past the image edge. Children in source px.
//   DocPage     a document page on the desk under the vox Sheet camera (tilt, depth of field); the Sheet itself once the
//               scan exists, otherwise a placeholder page with stand-in lines where the quoted lines will be.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp} from '../lib/anim';
import {JF, useGFrame} from './Kit';
import {DarkPaper} from './common';
import {hasFile} from './shell';
import {type SheetCam, Sheet, tornPoly} from './vox';

export const PH_BG = '#15130f';
const PH_LINE = 'rgba(244,239,230,0.24)';

/** One entry per placeholder in a chapter's PLACEHOLDERS list. */
export type PlaceholderInfo = {file: string; what: string; scene: string; anchor: string; swap: string};

/** The label inside a placeholder: PLACEHOLDER, the file, what it is. `scale` shrinks it for small cards. */
export const PhLabel: React.FC<{file: string; what?: string; scale?: number; style?: React.CSSProperties}> = ({file, what, scale = 1, style}) => (
  <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
    padding: 24 * scale, boxSizing: 'border-box', gap: 10 * scale, ...style}}>
    <div style={{fontFamily: JF.mono, fontSize: 15 * scale, letterSpacing: 3, color: 'rgba(244,239,230,0.5)'}}>PLACEHOLDER</div>
    <div style={{fontFamily: JF.mono, fontSize: 19 * scale, color: 'rgba(244,239,230,0.88)', wordBreak: 'break-all', maxWidth: '100%'}}>{file}</div>
    {what ? <div style={{fontFamily: JF.mono, fontSize: 14 * scale, color: 'rgba(244,239,230,0.55)', maxWidth: '100%'}}>{what}</div> : null}
  </div>
);

/**
 * A placeholder card at (x, y), w x h. `land`: 'rise' springs up from below like a Cut cut-out, 'slap' lands like a Print,
 * 'drop' falls in from above like a Prop, 'none' is just there. `float` gives a settled cut-out its slight breathing.
 */
export const Ph: React.FC<{file: string; what?: string; x: number; y: number; w: number; h: number; at?: number; out?: number; rot?: number;
  land?: 'rise' | 'slap' | 'drop' | 'none'; float?: boolean; shadow?: boolean; scale?: number; children?: React.ReactNode}> = ({
  file, what, x, y, w, h, at = -999, out = Infinity, rot = 0, land = 'slap', float = false, shadow = true, scale = 1, children,
}) => {
  const g = useGFrame();
  const {fps} = useVideoConfig();
  if (g < at || g >= out) return null;
  let dy = 0;
  let k = 1;
  let op = 1;
  if (land === 'rise' || land === 'drop') {
    const s = spring({frame: g - at, fps, config: {damping: 14, mass: 0.8}});
    dy = (1 - s) * (land === 'rise' ? 160 : -200);
    op = Math.min(1, s * 1.5);
  } else if (land === 'slap') k = interpolate(g, [at, at + 4, at + 7], [1.3, 0.96, 1], clamp);
  const fl = float ? Math.sin(g / 45) * 4 : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y + dy + fl, width: w, height: h, opacity: op, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: '50% 60%',
      background: PH_BG, outline: `2px solid ${PH_LINE}`, outlineOffset: -2, boxShadow: shadow ? '0 26px 46px rgba(0,0,0,0.8)' : undefined}}>
      <PhLabel file={file} what={what} scale={scale} />
      {children}
    </div>
  );
};

/** Print (kit/print.tsx) with a colour switch. Colour keeps the scan's own colour (lightly warmed, never boosted). */
export const TgPrint: React.FC<{src: string; x: number; y: number; w: number; h: number; at: number; out?: number; rot?: number; pos?: string; tag?: string;
  fit?: 'cover' | 'contain'; color?: boolean}> = ({src, x, y, w, h, at, out = Infinity, rot = 0, pos = '50% 25%', tag, fit = 'cover', color = false}) => {
  const g = useGFrame();
  if (g < at || g >= out) return null;
  const k = interpolate(g, [at, at + 4, at + 7], [1.3, 0.96, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: '50% 60%'}}>
      <Img src={staticFile(src)} style={{width: w, height: h, objectFit: fit, objectPosition: pos, display: 'block',
        filter: color ? 'contrast(1.05) saturate(0.95) brightness(0.97)' : 'grayscale(1) contrast(1.15) brightness(0.95)', boxShadow: '0 26px 46px rgba(0,0,0,0.8)'}} />
      {tag ? <PrintTag text={tag} top={h + 14} w={w} /> : null}
    </div>
  );
};

const PrintTag: React.FC<{text: string; top: number; w: number}> = ({text, top, w}) => (
  <div style={{position: 'absolute', left: 0, top, width: 'max-content', maxWidth: w + 60, fontFamily: JF.mono, fontSize: 16, letterSpacing: 1,
    color: 'rgba(244,239,230,0.75)', textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>{text}</div>
);

/** The print when its file exists, otherwise a placeholder card in its place (same size, same landing, same tag). */
export const PrintOr: React.FC<{src: string; what: string; x: number; y: number; w: number; h: number; at: number; out?: number; rot?: number; pos?: string; tag?: string;
  fit?: 'cover' | 'contain'; color?: boolean}> = (p) => {
  const g = useGFrame();
  if (hasFile(p.src)) return <TgPrint {...p} />;
  if (g < p.at || g >= (p.out ?? Infinity)) return null;
  return (
    <>
      <Ph file={p.src} what={p.what} x={p.x} y={p.y} w={p.w} h={p.h} at={p.at} out={p.out} rot={p.rot} land="slap" />
      {p.tag ? <div style={{position: 'absolute', left: p.x, top: p.y, width: p.w, transform: `rotate(${p.rot ?? 0}deg)`}}><PrintTag text={p.tag} top={p.h + 14} w={p.w} /></div> : null}
    </>
  );
};

export type FCam = {x: number; y: number; z: number};
/** Smooth (30 fps) camera between keys [frame, cam]: ease in-out, zoom in log space. */
export const fcamAt = (keys: [number, FCam][], f: number): FCam => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, a] = keys[i];
    const [f1, b] = keys[i + 1];
    if (f < f1) {
      const t = Easing.inOut(Easing.cubic)((f - f0) / Math.max(1, f1 - f0));
      return {x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * t)};
    }
  }
  return keys[keys.length - 1][1];
};

/** A stand-in line on a placeholder page, in source px: where a quoted line will sit once the scan exists. */
export type StandIn = {x: number; y: number; w: number; h: number; text: string; hand?: boolean};

/** Placeholder page body in source px: faint ruled "text" so a pan reads as motion, plus the stand-in lines. */
const PhPageBody: React.FC<{size: [number, number]; lines?: StandIn[]; hand?: boolean}> = ({size: [w, h], lines = [], hand}) => {
  const rows: React.ReactNode[] = [];
  const step = Math.round(h / 34);
  for (let y = Math.round(h * 0.08); y < h * 0.94; y += step) {
    if (lines.some((l) => y > l.y - step * 0.6 && y < l.y + l.h + step * 0.3)) continue;
    const len = 0.62 + ((y * 7919) % 97) / 97 * 0.24;
    rows.push(<div key={y} style={{position: 'absolute', left: w * 0.09, top: y, width: w * 0.82 * len, height: step * 0.22, borderRadius: hand ? step : 2,
      background: 'rgba(244,239,230,0.09)'}} />);
  }
  return (
    <div style={{position: 'absolute', inset: 0, background: PH_BG, outline: `${Math.max(2, w / 600)}px solid ${PH_LINE}`, outlineOffset: -2}}>
      {rows}
      {lines.map((l, i) => (
        <div key={i} style={{position: 'absolute', left: l.x, top: l.y, width: l.w, height: l.h, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', overflow: 'hidden',
          fontFamily: l.hand ?? hand ? '"Nanum Pen Script", cursive' : JF.heavy, fontWeight: l.hand ?? hand ? 400 : 900, fontSize: l.h * (l.hand ?? hand ? 0.95 : 0.72),
          color: 'rgba(244,239,230,0.82)'}}>{l.text}</div>
      ))}
    </div>
  );
};

/**
 * Full frame: the image (or its placeholder page) fills the frame under a smooth camera. `cam` keys are [frame, {x, y, z}]
 * in source px, z = 1 is the smallest zoom that fills the frame (no black edges, the camera never leaves the image); z < 1
 * pulls back as far as the whole page on the desk (a pan-to-reveal's last frame).
 * `children` are drawn in source px over the picture (a Swipe, a loop). `color` keeps a colour ad in colour.
 */
export const FullFrame: React.FC<{src: string; what: string; size: [number, number]; cam: [number, FCam][]; color?: boolean; lines?: StandIn[]; hand?: boolean;
  tag?: string; tagAt?: number; vignette?: number; children?: React.ReactNode}> = ({src, what, size, cam, color = false, lines, hand, tag, tagAt = -999, vignette = 0.45, children}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const [w, h] = size;
  const c = fcamAt(cam, f);
  // z = 1 fills the frame; z < 1 (a pull-back to the whole page) stops at "contain", the page whole on the dark desk
  const s = Math.max(Math.min(1920 / w, 1080 / h), Math.max(1920 / w, 1080 / h) * c.z);
  const fit = (span: number, screen: number, centre: number) => (span <= screen ? (screen - span) / 2 : Math.min(0, Math.max(screen - span, screen / 2 - centre * s)));
  const left = fit(w * s, 1920, c.x);
  const top = fit(h * s, 1080, c.y);
  const real = hasFile(src);
  return (
    <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
      <DarkPaper />
      <div style={{position: 'absolute', left, top, width: w, height: h, transform: `scale(${s})`, transformOrigin: '0 0', boxShadow: '0 26px 60px rgba(0,0,0,0.85)'}}>
        {real ? <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: w, height: h,
          filter: color ? 'contrast(1.05) saturate(0.95)' : 'grayscale(1) sepia(0.12) contrast(1.15) brightness(1.02)'}} /> : <PhPageBody size={size} lines={lines} hand={hand} />}
        {children}
      </div>
      {!real && <div style={{position: 'absolute', left: 560, top: 850, width: 800, height: 150, background: 'rgba(13,12,9,0.82)'}}><PhLabel file={src} what={what} /></div>}
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,${vignette}) 100%)`}} />
      {tag && g >= tagAt ? <div style={{position: 'absolute', left: 44, top: 1030, fontFamily: JF.mono, fontSize: 18, letterSpacing: 1, color: 'rgba(255,255,255,0.85)',
        textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>{tag}</div> : null}
    </AbsoluteFill>
  );
};

/**
 * A document page on the desk under the Sheet camera (kit/vox.tsx): the real Sheet once `src` exists, otherwise a placeholder
 * page with the same camera, torn edge and shadow. Children (Swipe, Spot) are in page px either way.
 */
export const DocPage: React.FC<{src: string; what: string; size: [number, number]; cam: SheetCam; seed?: string; lines?: StandIn[]; children?: React.ReactNode}> = ({
  src, what, size, cam, seed = 'dp', lines, children,
}) => {
  if (hasFile(src)) return <Sheet src={src} size={size} cam={cam} seed={seed}>{children}</Sheet>;
  const [w, h] = size;
  const {x, y, z, tilt = 0, rot = 0} = cam;
  return (
    <AbsoluteFill style={{perspective: 1400, perspectiveOrigin: '960px 540px', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 960 - x, top: 540 - y, width: w, height: h, transformOrigin: `${x}px ${y}px`,
        transform: `scale(${z}) rotateX(${tilt}deg) rotateZ(${rot}deg)`, filter: `drop-shadow(0 ${18 / z}px ${30 / z}px rgba(0,0,0,0.75))`}}>
        <div style={{position: 'absolute', inset: 0, clipPath: tornPoly(seed, w, h, 12 / Math.max(z, 0.3))}}>
          <PhPageBody size={size} lines={lines} />
          <div style={{position: 'absolute', left: w * 0.1, top: h * 0.02, width: w * 0.8, height: h * 0.07}}><PhLabel file={src} what={what} scale={Math.min(2.4, 1 / z)} /></div>
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};
