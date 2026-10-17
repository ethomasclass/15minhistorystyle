// YouTube thumbnail concepts for The Exact Spot, drawn at 1920x1080 with the video's own kit and exported at
// 1280x720 (tools/thumbs.mjs renders frame 140 so every write-on has finished).
//   A · the spot: the tilted map, the disputed strip raised and hatched, the X stake; Lincoln cut out on the right.
//   B · the split: Polk (coral) and Lincoln (teal) facing across the line, the strip between them, "WHOSE SOIL?".
//   C · the oddity: the cork-leg engraving, the leg in coral, "HIS LEG IS IN ILLINOIS".
import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import mapData from '../public/maps/mex1846.json';
import {Wordmark} from './kit/Intro';
import {Finish, Highlight, Note, PALETTES, PaletteCtx, Picture, type Place, Tint, Traced} from './kit/Kit';
import {DarkPaper} from './kit/common';
import {Border, Fill, MAP3D, Map3D, type MapData, Slab, Stake, Stand} from './kit/map3d';
import type {MaskRef} from './kit/maskref';
import {MASKS} from './masks';

export const THUMB_FRAMES = 150;
const TEAL = '#2FE0C4';
const CORAL = '#FF6F61';
const D = mapData as unknown as MapData;

/** Channel logo, top-left (YouTube covers the bottom-right with the running time). */
const Logo: React.FC = () => {
  const s = 0.27;
  return (
    <div style={{position: 'absolute', left: 36, top: 30, width: 1440 * s, height: 530 * s, overflow: 'hidden', borderRadius: 14, background: 'rgba(13,12,9,0.78)', boxShadow: '0 8px 24px rgba(0,0,0,0.6)'}}>
      <div style={{position: 'absolute', left: -170 * s, top: -275 * s, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <Wordmark clockAt={0} numAt={0} minAt={0} hisAt={0} />
      </div>
    </div>
  );
};

const cut = (alpha: string): React.CSSProperties =>
  ({WebkitMaskImage: `url(${staticFile(alpha)})`, WebkitMaskSize: '100% 100%', maskImage: `url(${staticFile(alpha)})`, maskSize: '100% 100%'}) as React.CSSProperties;

/** A portrait cut out along its mask, tinted one colour, outlined in cream, with a drop shadow. */
const Cutout: React.FC<{src: string; size: [number, number]; mask: MaskRef; place: Place; color: string}> = ({src, size, mask, place, color}) => (
  <>
    <div style={{position: 'absolute', left: place.left, top: place.top, width: size[0] * place.scale, height: size[1] * place.scale, ...cut(mask.alpha), filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))'}}>
      <Picture src={src} place={{left: 0, top: 0, scale: place.scale}} size={size} bw="grayscale(1) contrast(1.25) brightness(0.92)" />
    </div>
    <Tint mask={mask.alpha} place={place} size={size} color={color} />
    <Traced paths={mask.data.shapes.subject} place={place} at={0} dur={1} width={7} color="#f4efe6" />
  </>
);

const LINCOLN: [number, number] = [1920, 2432];
const POLK: [number, number] = [1920, 2309];

/** The strip on the tilted map: both claim lines, the hatched slab, the X. */
const SpotMap: React.FC<{x: number; y: number; z: number; tilt?: number; rot?: number}> = ({x, y, z, tilt = 50, rot = -10}) => (
  <Map3D data={D} keys={[{f: 0, x, y, z, tilt, rot}]}>
    {(api) => (
      <>
        <Border api={api} d={D.lines.nueces} at={-99} dur={1} color={MAP3D.mexico} width={14} dashed />
        <Border api={api} d={D.lines.rioGrande} at={-99} dur={1} color={MAP3D.us} width={14} dashed />
        <Slab api={api} region="nuecesStrip" at={-99} h={60} hatch="rgba(255,255,255,0.4)" />
        <Stand api={api} at={D.places.carricitos}><div style={{transform: 'scale(2.2)', transformOrigin: '50% 100%'}}><Stake /></div></Stand>
      </>
    )}
  </Map3D>
);

/** A · the spot. */
export const ThumbA: React.FC = () => {
  const place: Place = {left: 1350 - 1030 * 0.5, top: 120, scale: 0.5};
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <AbsoluteFill style={{background: '#15130f', overflow: 'hidden'}}>
        <SpotMap x={3330} y={2420} z={1.25} tilt={46} rot={-6} />
        <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(8,7,5,0.88) 0%, rgba(8,7,5,0.55) 30%, rgba(8,7,5,0) 50%)'}} />
        <Cutout src="img/ch01/lincoln_shepherd_1846.jpg" size={LINCOLN} mask={MASKS.lincoln} place={place} color={TEAL} />
        <Note text="Lincoln asked:" x={90} y={560} size={78} rot={-4} color="#ffffff" />
        <Highlight text="WHERE WAS" x={70} y={660} size={150} at={0} seed={241} rot={-3} />
        <Highlight text="THE SPOT?" x={100} y={860} size={150} at={0} seed={243} rot={-2} />
        <Logo />
        <Finish vignette={0.3} />
      </AbsoluteFill>
    </PaletteCtx.Provider>
  );
};

/** B · the split: Polk vs. Lincoln, the strip between them. */
export const ThumbB: React.FC = () => {
  const polk: Place = {left: 470 - 720 * 0.46, top: 150, scale: 0.46};
  const lincoln: Place = {left: 1450 - 1030 * 0.44, top: 150, scale: 0.44};
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <AbsoluteFill style={{background: '#15130f', overflow: 'hidden'}}>
        <AbsoluteFill style={{filter: 'brightness(0.55)'}}><SpotMap x={3160} y={2280} z={1.05} tilt={46} rot={-8} /></AbsoluteFill>
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(8,6,4,0) 25%, rgba(8,6,4,0.75) 100%)'}} />
        <Cutout src="img/ch01/polk_brady_1849.jpg" size={POLK} mask={MASKS.polk} place={polk} color={CORAL} />
        <Cutout src="img/ch01/lincoln_shepherd_1846.jpg" size={LINCOLN} mask={MASKS.lincoln} place={lincoln} color={TEAL} />
        <Note text="“American soil”" x={150} y={760} size={64} rot={-3} color="#ffffff" />
        <Note text="show me the spot" x={1200} y={760} size={64} rot={-3} color="#ffffff" />
        <Highlight text="WHOSE SOIL?" x={500} y={860} size={150} at={0} seed={245} rot={-2} />
        <Logo />
        <Finish vignette={0.3} />
      </AbsoluteFill>
    </PaletteCtx.Provider>
  );
};

/** C · the oddity: Santa Anna's cork leg. */
export const ThumbC: React.FC = () => {
  const size: [number, number] = [1340, 705];
  const s = Math.max(1920 / size[0], 1080 / size[1]) * 1.12;
  const place: Place = {left: Math.max(1920 - size[0] * s, Math.min(0, 960 - 760 * s)), top: 1080 - size[1] * s, scale: s};
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <AbsoluteFill style={{background: '#15130f', overflow: 'hidden'}}>
        <Picture src="img/gen/ch06_cork_leg.jpg" place={place} size={size} bw="grayscale(1) contrast(1.25) brightness(0.92)" />
        <Tint mask={MASKS.corkleg_leg.alpha} place={place} size={size} color={CORAL} />
        <Traced paths={MASKS.corkleg_leg.data.shapes.subject} place={place} at={0} dur={1} width={9} color={TEAL} />
        <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(8,7,5,0.9) 0%, rgba(8,7,5,0.4) 30%, rgba(8,7,5,0) 45%)'}} />
        <div style={{position: 'absolute', left: 1030, top: 175, width: 780, height: 120, background: 'rgba(12,11,9,0.85)', borderRadius: 8, transform: 'rotate(-4deg)', boxShadow: '0 10px 24px rgba(0,0,0,0.5)'}} />
        <Note text="Santa Anna's cork leg" x={1060} y={190} size={66} rot={-4} color="#ffffff" />
        <Highlight text="WHY IS IT IN" x={90} y={760} size={130} at={0} seed={247} rot={-2} />
        <Highlight text="ILLINOIS?" x={1030} y={760} size={130} at={0} seed={249} rot={-3} />
        <Logo />
        <Finish vignette={0.3} />
      </AbsoluteFill>
    </PaletteCtx.Provider>
  );
};


/** D · the war itself: Currier's 1847 Storming of Chapultepec, the U.S. charge washed coral and the Mexican defenders teal
 *  (the map's colours), the question across the bottom. */
export const ThumbD: React.FC = () => {
  const size: [number, number] = [2200, 1355];
  const s = Math.max(1920 / size[0], 1080 / size[1]) * 1.04;
  const place: Place = {left: (1920 - size[0] * s) / 2, top: -60, scale: s};
  const wash = (blend: React.CSSProperties['mixBlendMode'], o: number) => (
    <AbsoluteFill style={{mixBlendMode: blend, opacity: o,
      background: `linear-gradient(90deg, ${CORAL} 0%, ${CORAL} 52%, ${MAP3D.mexico} 70%, ${MAP3D.mexico} 100%)`}} />
  );
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <AbsoluteFill style={{background: '#15130f', overflow: 'hidden'}}>
        <AbsoluteFill style={{isolation: 'isolate'}}>
          <Picture src="img/ch06/currier_chapultepec_1847.jpg" place={place} size={size} bw="grayscale(1) contrast(1.35) brightness(0.92)" />
          {wash('color', 0.75)}
          {wash('multiply', 0.18)}
        </AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(8,7,5,0.92) 0%, rgba(8,7,5,0.65) 28%, rgba(8,7,5,0) 48%)'}} />
        <Highlight text="MEXICAN-AMERICAN WAR:" x={90} y={700} size={92} at={0} seed={251} rot={-2} />
        <Highlight text="WHO STARTED IT?" x={80} y={830} size={170} at={0} seed={253} rot={-2} />
        <Logo />
        <Finish vignette={0.3} />
      </AbsoluteFill>
    </PaletteCtx.Provider>
  );
};
