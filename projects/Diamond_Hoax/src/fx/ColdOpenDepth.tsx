// The cold open in depth (ch 1, and back in ch 9): the thumbnail H1 picture (src/ThumbsDiamond.tsx `Scene` with TYC_LOW)
// rebuilt as depth planes on the desk, without its words: the two cousins from behind nearest the camera (fingers crossed,
// the pouch behind his back), the tycoon in coral between them (the stone in his hand), the desk at the back. A slow
// dolly-in is already moving at frame 0 (no fade from black), so the near planes grow and part faster than the far ones.
// Slight focus fall-off: the cousins and the desk a touch soft, the tycoon sharp.
//
// Props (frames in the parent's time):
//   dur      length of the default push (frames, default 300)
//   cam      dolly keys [{f, d, x?, y?}]: d = how far the camera has moved in (px of CSS depth, ~0..220), x/y = a sideways
//            drift (px). Eased so it is already moving at the first key. Default: d 0 → 190 over `dur`, a small drift right
//   drainAt  "The field was dirt": the coral on the stone in his hand drains to grey (~0.6 s); the rest of him stays coral
//   tint     the coral on the tycoon (default 1; 0 = all black and white)
//
// At d = 0 the frame matches H1 exactly (minus the logo and the tape words): each plane is pre-scaled to undo its perspective.
// Exports: ColdOpenDepth, ColdOpenDepthTest, COLDOPEN_TEST_FRAMES.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Finish, PALETTES, PaletteCtx, Picture, type Place, StepCtx, Traced} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {MASKS} from '../masks';

const CORAL = '#FF6F61';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const PERSP = 1200;
const SIZE: [number, number] = [1200, 896];
const PAIR: [number, number] = [1376, 768];
// the H1 layout (ThumbsDiamond.tsx: COUSIN_L, COUSIN_R, TYC_LOW)
const COUSIN_L: Place = {left: -40, top: 250, scale: 1.3};
const COUSIN_R: Place = {left: 250, top: 250, scale: 1.3};
const TYC: Place = {left: 520, top: 440, scale: 0.75};
// the stone in his hand, as an ellipse in % of the tycoon picture (source px ~ (1000, 568), radii ~110 x 85)
const STONE = {cx: 83.3, cy: 63.4, rx: 9.6, ry: 10};
const Z = {cousins: 260, tycoon: 0, desk: -900};

const cut = (alpha: string): React.CSSProperties =>
  ({WebkitMaskImage: `url(${staticFile(alpha)})`, WebkitMaskSize: '100% 100%', maskImage: `url(${staticFile(alpha)})`, maskSize: '100% 100%'}) as React.CSSProperties;

/** Mask = the subject's alpha intersected with the stone ellipse (inside) or with everything but it (outside). */
const stoneMask = (alpha: string, inside: boolean): React.CSSProperties => {
  const ell = `radial-gradient(ellipse ${STONE.rx}% ${STONE.ry}% at ${STONE.cx}% ${STONE.cy}%, ${inside ? '#000 82%, transparent 100%' : 'transparent 82%, #000 100%'})`;
  const url = `url(${staticFile(alpha)})`;
  return {WebkitMaskImage: `${url}, ${ell}`, WebkitMaskSize: '100% 100%, 100% 100%', WebkitMaskRepeat: 'no-repeat', WebkitMaskComposite: 'source-in',
    maskImage: `${url}, ${ell}`, maskSize: '100% 100%, 100% 100%', maskRepeat: 'no-repeat', maskComposite: 'intersect'} as React.CSSProperties;
};

const TintLayer: React.FC<{place: Place; mask: React.CSSProperties; strength: number}> = ({place, mask, strength}) => {
  if (strength <= 0.001) return null;
  const box: React.CSSProperties = {position: 'absolute', left: place.left, top: place.top, width: SIZE[0] * place.scale, height: SIZE[1] * place.scale, ...mask};
  return (
    <>
      <div style={{...box, background: CORAL, mixBlendMode: 'color', opacity: strength}} />
      <div style={{...box, background: CORAL, mixBlendMode: 'multiply', opacity: 0.3 * strength}} />
      <div style={{...box, background: CORAL, mixBlendMode: 'screen', opacity: 0.28 * strength}} />
    </>
  );
};

const Cousin: React.FC<{mask: string; at: Place}> = ({mask, at}) => (
  <div style={{position: 'absolute', left: at.left, top: at.top, width: PAIR[0] * at.scale, height: PAIR[1] * at.scale, ...cut(mask), filter: 'drop-shadow(0 0 40px rgba(0,0,0,0.85))'}}>
    <Picture src="img/gen/thumb/cousins_a_pro.png" place={{left: 0, top: 0, scale: at.scale}} size={PAIR} bw="grayscale(1) contrast(1.2) brightness(0.8)" />
  </div>
);

/** A depth plane: content laid out in screen px as at d = 0, pre-scaled so it lands exactly there before the dolly. */
const Plane: React.FC<{z: number; d: number; x: number; y: number; blur?: number; children: React.ReactNode}> = ({z, d, x, y, blur = 0, children}) => (
  <AbsoluteFill style={{transformOrigin: '960px 540px', transform: `translate3d(${(-x).toFixed(2)}px, ${(-y).toFixed(2)}px, ${(z + d).toFixed(2)}px) scale(${((PERSP - z) / PERSP).toFixed(5)})`,
    filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined}}>
    {children}
  </AbsoluteFill>
);

export type DollyKey = {f: number; d: number; x?: number; y?: number};
const dollyAt = (keys: DollyKey[], f: number) => {
  const fs = keys.map((k) => k.f);
  const ease = Easing.bezier(0.2, 0.3, 0.45, 1); // already moving at the first key, settling into the last
  const seg = (vals: number[]) => {
    if (f <= fs[0]) return vals[0] + (vals[1] - vals[0]) * ((f - fs[0]) / Math.max(1, fs[1] - fs[0])) * 0.55; // keep drifting before the first key
    for (let i = 0; i < fs.length - 1; i++) if (f <= fs[i + 1]) return interpolate(f, [fs[i], fs[i + 1]], [vals[i], vals[i + 1]], {...clamp, easing: ease});
    return vals[vals.length - 1];
  };
  return {d: seg(keys.map((k) => k.d)), x: seg(keys.map((k) => k.x ?? 0)), y: seg(keys.map((k) => k.y ?? 0))};
};

export type ColdOpenDepthProps = {dur?: number; cam?: DollyKey[]; drainAt?: number; tint?: number};

export const ColdOpenDepth: React.FC<ColdOpenDepthProps> = ({dur = 300, cam, drainAt = 1e9, tint = 1}) => {
  const f = useCurrentFrame();
  const {d, x, y} = dollyAt(cam ?? [{f: 0, d: 0, x: 0, y: 0}, {f: dur, d: 95, x: 18, y: 34}], f);
  const g = Math.floor(f / 2.5) * 2.5;
  const drain = interpolate(g, [drainAt, drainAt + 18], [0, 1], clamp);
  const near = d / 220;
  return (
    <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden', perspective: PERSP, perspectiveOrigin: '960px 540px'}}>
      <AbsoluteFill style={{transformStyle: 'preserve-3d'}}>
        {/* the desk, far back (oversized so a drift never shows its edge) */}
        <Plane z={Z.desk} d={d} x={x} y={y} blur={1.6}>
          <AbsoluteFill style={{transform: 'scale(1.18)'}}>
            <DarkPaper />
            <AbsoluteFill style={{background: 'radial-gradient(circle 760px at 930px 640px, rgba(255,214,160,0.10) 0%, transparent 100%)'}} />
          </AbsoluteFill>
        </Plane>
        {/* the tycoon: coral, teal trace; his stone drains to grey on "dirt" */}
        <Plane z={Z.tycoon} d={d} x={x} y={y}>
          <div style={{position: 'absolute', left: TYC.left, top: TYC.top, width: SIZE[0] * TYC.scale, height: SIZE[1] * TYC.scale, ...cut(MASKS.tycoon_b.alpha),
            filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))'}}>
            <Picture src="img/gen/thumb/tycoon_b_clean.png" place={{left: 0, top: 0, scale: TYC.scale}} size={SIZE} bw="grayscale(1) contrast(1.15) brightness(1.02)" />
          </div>
          <TintLayer place={TYC} mask={stoneMask(MASKS.tycoon_b.alpha, false)} strength={tint} />
          <TintLayer place={TYC} mask={stoneMask(MASKS.tycoon_b.alpha, true)} strength={tint * (1 - drain)} />
          {drain > 0 && <div style={{position: 'absolute', left: TYC.left, top: TYC.top, width: SIZE[0] * TYC.scale, height: SIZE[1] * TYC.scale, ...stoneMask(MASKS.tycoon_b.alpha, true),
            background: '#3a3530', mixBlendMode: 'multiply', opacity: 0.45 * drain}} />}
          <Traced paths={MASKS.tycoon_b.data.shapes.subject} place={TYC} at={-999} dur={1} width={7} />
        </Plane>
        {/* the cousins, nearest */}
        <Plane z={Z.cousins} d={d} x={x} y={y} blur={1.0 + near * 0.8}>
          <Cousin mask={MASKS.cousin_l.alpha} at={COUSIN_L} />
          <Cousin mask={MASKS.cousin_r.alpha} at={COUSIN_R} />
        </Plane>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- test composition
export const COLDOPEN_TEST_FRAMES = 300;
export const ColdOpenDepthTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <AbsoluteFill style={{background: '#0d0c09'}}>
        <ColdOpenDepth dur={300} drainAt={230} />
        <Finish vignette={0.3} />
      </AbsoluteFill>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
