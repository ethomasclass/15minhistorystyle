// Helpers shared by Ep 2's chapters 7–10 (Who Got the Gold · Cheap as Dirt · The Big Die-Up · The Last of the Five Thousand):
// the quiet palette, a photo-camera clamp, AI prop paths, a standing cut-out prop for the 3D stages, falling snow, a step badge
// and an archival print slot that falls back to a drawn card while the image agent is still downloading.
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {JF, PALETTES, PaletteCtx, useGFrame, usePal} from './Kit';
import {CutOut, SHADOW} from '../samples/kit';
import type {MaskRef} from './maskref';
import {useSlap} from '../previews/fx';

/** Quiet sections (all of ch09): teal lines, bone titles, no coral. */
export const Quiet: React.FC<{children: React.ReactNode}> = ({children}) => <PaletteCtx.Provider value={PALETTES.quiet}>{children}</PaletteCtx.Provider>;

/** Keep a PhotoCam inside the picture (no black edges): clamp the centre for scale s. */
export const inside = (size: [number, number], cx: number, cy: number, s: number) => {
  const sm = Math.max(s, 1920 / size[0], 1080 / size[1]);
  const hw = 960 / sm;
  const hh = 540 / sm;
  return {cx: Math.min(size[0] - hw, Math.max(hw, cx)), cy: Math.min(size[1] - hh, Math.max(hh, cy)), s: sm};
};

/** Like inside(), but keeps the camera inside a crop box [x0, y0, x1, y1] of the source (a scan with a mount or border). */
export const insideBox = (box: [number, number, number, number], cx: number, cy: number, s: number) => {
  const [x0, y0, x1, y1] = box;
  const sm = Math.max(s, 1920 / (x1 - x0), 1080 / (y1 - y0));
  const hw = 960 / sm;
  const hh = 540 / sm;
  return {cx: Math.min(x1 - hw, Math.max(x0 + hw, cx)), cy: Math.min(y1 - hh, Math.max(y0 + hh, cy)), s: sm};
};

/** AI lithograph prop image / pre-cut copy. */
export const PROP = (name: string) => `img/props/${name}.jpg`;
export const CUT = (name: string) => `img/props/cut/${name}.webp`;
export const PROP_SIZE: [number, number] = [1920, 1920];
/** AI props keep a little of their muted colour; quiet scenes take more out. */
export const PROPF = 'saturate(0.55) contrast(1.08)';
export const PROPF_QUIET = 'saturate(0.25) contrast(1.05) brightness(0.92)';

/** A pre-cut prop standing upright (for the CSS 3D stages): bottom-centre at (x, 0) of its parent, `w` px wide. */
export const StandProp: React.FC<{name: string; x: number; w: number; at?: number; filter?: string; y?: number}> = ({name, x, w, at = -999, filter = PROPF, y = 0}) => {
  const s = useSlap(at, 1.3);
  if (!s.on) return null;
  return (
    <div style={{position: 'absolute', left: x - w / 2, bottom: y, width: w, transform: `scale(${s.scale})`, transformOrigin: '50% 100%', opacity: s.opacity}}>
      <Img src={staticFile(CUT(name))} style={{width: '100%', display: 'block', filter: `${filter} drop-shadow(6px 8px 0 ${SHADOW})`}} />
    </div>
  );
};

/** Falling snow over the frame, stepped at 12 fps like the marks; `k` fades it in (0..1). Wind slants it. */
export const Snow: React.FC<{k?: number; n?: number; wind?: number; seed?: string; size?: number}> = ({k = 1, n = 140, wind = 2.2, seed = 's', size = 1}) => {
  const g = useGFrame();
  if (k <= 0) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: k}}>
      <svg width={1920} height={1080}>
        {Array.from({length: n}).map((_, i) => {
          const r = (1.2 + random(`${seed}r${i}`) * 3.6) * size;
          const sp = 1.4 + random(`${seed}v${i}`) * 2.6;
          const y = ((random(`${seed}y${i}`) * 1180 + g * sp * 2.2) % 1180) - 50;
          const x = ((random(`${seed}x${i}`) * 2200 + g * wind * sp + Math.sin(g / 20 + i) * 12) % 2200) - 140;
          return <circle key={i} cx={x} cy={y} r={r} fill="#f1f3f2" opacity={0.35 + random(`${seed}o${i}`) * 0.45} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** "STEP 1 / 3" style badge: mono caps, teal rule, slaps in. */
export const StepBadge: React.FC<{n: number; of: number; label?: string; x: number; y: number; at: number}> = ({n, of, label, x, y, at}) => {
  const s = useSlap(at, 1.3);
  const pal = usePal();
  if (!s.on) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${s.scale})`, transformOrigin: 'left center', opacity: s.opacity, display: 'flex', alignItems: 'center', gap: 22,
      textShadow: `4px 5px 0 ${SHADOW}`}}>
      <div style={{fontFamily: JF.display, fontSize: 120, lineHeight: 1, color: pal.mark}}>{n}</div>
      <div>
        <div style={{fontFamily: JF.mono, fontSize: 28, letterSpacing: 4, color: pal.mark, whiteSpace: 'nowrap'}}>STEP {n} OF {of}</div>
        {label && <div style={{fontFamily: JF.mono, fontSize: 22, letterSpacing: 3, color: 'rgba(244,239,230,0.85)', whiteSpace: 'nowrap', marginTop: 6}}>{label}</div>}
      </div>
    </div>
  );
};

/** A simple fade value between frames (for overlays that should not pop). */
export const useFade = (a: number, d = 8) => interpolate(useGFrame(), [a, a + d], [0, 1], clamp);

/** Camera frame helper for shots that want the real (unstepped) frame. */
export const useF = () => useCurrentFrame();

/**
 * A portrait as a bust cut-out lying on the desk (the user's rule, Oct 27): only the head and shoulders, cut from the page with its
 * mask, a straight cut at `cutY` (source px) below the shoulders, a soft contact shadow, slapped down at `at`. Desk coordinates (like
 * fx's Lift). The beat's subject gets the coral see-through tint (`tint`) and the teal trace (`traceAt`); anyone else is plain B&W.
 */
export const Bust: React.FC<{src: string; size: [number, number]; mask: MaskRef; x: number; y: number; w: number; cutY?: number; at: number; rot?: number;
  tint?: number; traceAt?: number; h?: number; seed?: number; filter?: string}> = ({src, size, mask, x, y, w, cutY, at, rot = 0, tint = 0, traceAt, h = 14, seed = 1,
  filter = 'grayscale(1) contrast(1.18) brightness(0.98)'}) => {
  const f = useCurrentFrame();
  const sl = useSlap(at, 1.25);
  if (!sl.on) return null;
  const [bx0, by0, bx1, by1] = mask.data.boxes.subject;
  const bottom = Math.min(by1, cutY ?? by1);
  const sc = w / (bx1 - bx0);
  const pad = 14;
  const hgt = (bottom - by0) * sc;
  const z = h + sl.lift * 600;
  const sway = Math.sin(f / 38 + seed) * 0.25;
  return (
    <div style={{position: 'absolute', left: x + 400 - pad, top: y + 300 - pad, width: w + pad * 2, height: hgt + pad, opacity: sl.opacity, transformOrigin: '50% 100%',
      transform: `translateZ(${z}px) rotate(${rot + sway}deg) scale(${sl.scale})`, filter: `drop-shadow(10px 16px 12px rgba(0,0,0,${0.7 - Math.min(0.3, sl.lift)}))`}}>
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
        <CutOut src={src} size={size} mask={mask} place={{left: pad - bx0 * sc, top: pad - by0 * sc, scale: sc}} at={-99} shadow="none" tint={tint} soft traceAt={traceAt} filter={filter} />
      </div>
    </div>
  );
};
