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
import {AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Finish, JF, Loop, Note, PALETTES, PaletteCtx, Picture, type Place, StepCtx, Traced} from '../kit/Kit';
import ch01 from '../../public/audio/ch01_cold_open.words.json';
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

// ---------------------------------------------------------------- the reveal (ch 1, the first sentence)
// "Two cousins from Kentucky walked into a rich man's office with a bag of rocks. By the time they were done, they'd walked
// away with about eighteen million dollars in today's money."
// Opens tight on the tycoon and his stone (the cousins are outside the frame on the near plane), the banker's office fades in
// behind him on "a rich man's office", then the camera pulls back on "with a bag of rocks" and the cousins slide in from both
// sides into the full H1 picture: the mark first, then the con behind his back. A teal loop on the pouch, "fingers crossed",
// then the money tag where the thumbnail's tape words sat.
//
// Props (frames in the parent's time): officeAt, pullAt, pullEnd, loopAt, fingersAt, moneyAt, drainAt, out (fade the notes).
// Camera: d = dolly depth, x/y = focus offset (px). Tight: d 520 centred on (1100, 720) (between his face and the stone);
// wide: d 0 = the exact H1 frame, then a slow drift on.
export type ColdOpenRevealProps = {officeAt: number; pullAt: number; pullEnd: number; loopAt: number; fingersAt: number; moneyAt: number;
  drainAt?: number; out?: number};

const OFFICE: [number, number] = [2752, 1536];
const MoneyTag: React.FC<{at: number; big: string; small: string; x: number; y: number}> = ({at, big, small, x, y}) => {
  const f = useCurrentFrame();
  const g = Math.floor(f / 2.5) * 2.5;
  if (g < at) return null;
  const s = interpolate(g, [at, at + 5, at + 9], [1.35, 0.95, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translateX(-50%) scale(${s})`, textAlign: 'center', transformOrigin: '50% 60%'}}>
      <div style={{fontFamily: JF.display, fontSize: 150, lineHeight: 1, color: '#FF9F1C', textShadow: '0 6px 24px rgba(0,0,0,0.85)'}}>{big}</div>
      <div style={{fontFamily: JF.mono, fontSize: 34, color: '#F4EFE6', opacity: 0.85, marginTop: 10, textShadow: '0 2px 10px rgba(0,0,0,0.9)'}}>{small}</div>
    </div>
  );
};


// The office painting split into depth planes by tools/sil_layers.py (public/img/layers/sil/office/): L0 front chairs and floor,
// L1 the desk and carpet, L2 the chandelier, the lamp, the ship painting and the side chairs, L3 the back wall and windows.
// Every plane draws the whole painting box at the same place, so at d = 0 they line up exactly; the dolly makes them part.
const OFFICE_LAYERS = [
  {src: 'img/layers/sil/office/L3.jpg', z: -1100, blur: 2.2},
  {src: 'img/layers/sil/office/L2.webp', z: -760, blur: 1.6},
  {src: 'img/layers/sil/office/L1.webp', z: -480, blur: 1.2},
  {src: 'img/layers/sil/office/L0.webp', z: -260, blur: 1.6},
];
const BLUE = '#5AA8FF';
const WARM = '#FF8A5C';
const glow = (cx: number, cy: number, rx: number, ry: number, color: string, a: number): React.CSSProperties => ({position: 'absolute', inset: 0,
  background: `radial-gradient(ellipse ${rx}% ${ry}% at ${cx}% ${cy}%, ${color} 0%, transparent 100%)`, opacity: a, mixBlendMode: 'screen'});
/** One office plane: the painting box (grayscale, dimmed) plus the coloured light that belongs at that depth. */
const OfficeLayer: React.FC<{src: string; fade: number; f: number; accents: number}> = ({src, fade, f, accents}) => {
  const flick = 0.85 + 0.15 * Math.sin(f * 0.37) * Math.sin(f * 0.11 + 1.3);
  return (
    <AbsoluteFill style={{transform: 'scale(1.22)', opacity: fade}}>
      <div style={{position: 'absolute', left: -60, top: -40, width: 2040, height: 2040 * OFFICE[1] / OFFICE[0]}}>
        <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'grayscale(1) contrast(1.05) brightness(0.52)'}} />
        {accents === 0 && <>
          {/* daylight through the two windows: a blue tint on the glass and a cool spill into the room */}
          <div style={{...glow(41.5, 42, 9, 26, BLUE, 0.55)}} />
          <div style={{...glow(69, 42, 8, 26, BLUE, 0.55)}} />
          <div style={{...glow(55, 55, 40, 45, BLUE, 0.12)}} />
          <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 85% 80% at 55% 50%, transparent 45%, rgba(13,12,9,0.8) 100%)'}} />
        </>}
        {accents === 1 && <>
          {/* the chandelier's bulbs and the desk lamp, warm, the lamp flickering a little */}
          <div style={{...glow(54, 19, 9, 7, WARM, 0.6 * flick)}} />
          <div style={{...glow(41.6, 50, 4.5, 6, WARM, 0.95 * flick)}} />
          <div style={{...glow(42, 55, 16, 14, WARM, 0.32 * flick)}} />
        </>}
        {accents === 2 && <div style={{...glow(43, 62, 20, 9, WARM, 0.22 * flick)}} />}
      </div>
    </AbsoluteFill>
  );
};

export const ColdOpenReveal: React.FC<ColdOpenRevealProps> = ({officeAt, pullAt, pullEnd, loopAt, fingersAt, moneyAt, drainAt = 1e9, out = 1e9}) => {
  const f = useCurrentFrame();
  const {d, x, y} = dollyAt([{f: 0, d: 560, x: 150, y: 190}, {f: pullAt, d: 500, x: 135, y: 170}, {f: pullEnd, d: 0, x: 0, y: 0}, {f: pullEnd + 240, d: 60, x: 10, y: 22}], f);
  const g = Math.floor(f / 2.5) * 2.5;
  const drain = interpolate(g, [drainAt, drainAt + 18], [0, 1], clamp);
  const office = interpolate(f, [officeAt, officeAt + 24], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const notes = interpolate(f, [out, out + 8], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
      <AbsoluteFill style={{perspective: PERSP, perspectiveOrigin: '960px 540px'}}>
        <AbsoluteFill style={{transformStyle: 'preserve-3d'}}>
          {/* the desk paper at the back; the banker's office fades in on "a rich man's office" as four depth planes (real parallax:
              the front chairs and the desk slide past the chandelier, the lamp and the back wall), with cool blue window light and
              warm coral-orange lamplight */}
          <Plane z={-1250} d={d} x={x} y={y} blur={2}>
            <AbsoluteFill style={{transform: 'scale(1.3)'}}><DarkPaper /></AbsoluteFill>
          </Plane>
          {OFFICE_LAYERS.map((L, i) => (
            <Plane key={L.src} z={L.z} d={d} x={x} y={y} blur={L.blur}>
              <OfficeLayer src={L.src} fade={office} f={f} accents={i} />
            </Plane>
          ))}
          <Plane z={Z.tycoon} d={d} x={x} y={y}>
            <div style={{position: 'absolute', left: TYC.left, top: TYC.top, width: SIZE[0] * TYC.scale, height: SIZE[1] * TYC.scale, ...cut(MASKS.tycoon_b.alpha),
              filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.7))'}}>
              <Picture src="img/gen/thumb/tycoon_b_clean.png" place={{left: 0, top: 0, scale: TYC.scale}} size={SIZE} bw="grayscale(1) contrast(1.15) brightness(1.02)" />
            </div>
            <TintLayer place={TYC} mask={stoneMask(MASKS.tycoon_b.alpha, false)} strength={1} />
            <TintLayer place={TYC} mask={stoneMask(MASKS.tycoon_b.alpha, true)} strength={1 - drain} />
            {drain > 0 && <div style={{position: 'absolute', left: TYC.left, top: TYC.top, width: SIZE[0] * TYC.scale, height: SIZE[1] * TYC.scale, ...stoneMask(MASKS.tycoon_b.alpha, true),
              background: '#3a3530', mixBlendMode: 'multiply', opacity: 0.45 * drain}} />}
            <Traced paths={MASKS.tycoon_b.data.shapes.subject} place={TYC} at={-999} dur={1} width={7} />
          </Plane>
          <Plane z={Z.cousins} d={d} x={x} y={y} blur={0.8 + (d / 560) * 3}>
            <Cousin mask={MASKS.cousin_l.alpha} at={COUSIN_L} />
            <Cousin mask={MASKS.cousin_r.alpha} at={COUSIN_R} />
          </Plane>
        </AbsoluteFill>
      </AbsoluteFill>
      {/* marks, in screen space once the camera has settled on the H1 frame */}
      <AbsoluteFill style={{opacity: notes}}>
        <Loop cx={1712} cy={968} rx={95} ry={88} at={loopAt} dur={10} width={6} seed={7} />
        <Note text="a bag of rocks" x={1330} y={735} size={58} rot={-5} at={loopAt + 4} />
        <Loop cx={262} cy={1000} rx={92} ry={70} at={fingersAt} dur={10} width={6} seed={9} />
        <Note text="fingers crossed" x={110} y={846} size={62} rot={-4} at={fingersAt + 4} />
      </AbsoluteFill>
      <MoneyTag at={moneyAt} big="$18 million" small="$660,000 in 1872" x={960} y={110} />
    </AbsoluteFill>
  );
};

type W = {w: string; s: number};
const WORDS: W[] = ((ch01 as unknown as {words: W[]}).words ?? (ch01 as unknown as W[]));
const wAt = (word: string, nth = 1) => {
  let k = 0;
  for (const x of WORDS) if (x.w.toLowerCase().replace(/[^a-z']/g, '') === word && ++k === nth) return Math.round(x.s * 30);
  throw new Error('no word ' + word);
};
export const COLDOPEN_REVEAL_FRAMES = 345;
export const ColdOpenRevealTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <AbsoluteFill style={{background: '#0d0c09'}}>
        <Audio src={staticFile('audio/ch01_cold_open.wav')} />
        <ColdOpenReveal officeAt={wAt('rich') - 6} pullAt={wAt('with') - 4} pullEnd={wAt('by') + 6} loopAt={wAt('by') + 2}
          fingersAt={wAt('by') + 22} moneyAt={wAt('eighteen') - 2} out={wAt('their') - 4} />
        <Finish vignette={0.3} />
      </AbsoluteFill>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
