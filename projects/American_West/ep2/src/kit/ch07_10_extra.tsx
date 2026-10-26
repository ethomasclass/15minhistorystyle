// Helpers shared by Ep 2's chapters 7–10 (Who Got the Gold · Cheap as Dirt · The Big Die-Up · The Last of the Five Thousand):
// the quiet palette, a photo-camera clamp, AI prop paths, a standing cut-out prop for the 3D stages, falling snow, a step badge
// and an archival print slot that falls back to a drawn card while the image agent is still downloading.
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {JF, PALETTES, PaletteCtx, useGFrame, usePal} from './Kit';
import {SHADOW} from '../samples/kit';
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
