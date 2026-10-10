// YouTube thumbnail concepts for Say It Ain't So, drawn at 1920x1080 with the video's own kit and exported at
// 1280x720 (tools/thumbs.mjs renders frame 140).
//   A · the split: Shoeless Joe Jackson (1920, White Sox) cut out, teal half / coral half, SAY IT / AIN'T SO under him.
//   B · title-led: the real 1908 Polo Grounds crowd, "before the Black Sox..." and EVERYBODY BET.
//   C · then vs now: Shoeless Joe Jackson, waist up (BANNED 1921) beside the hand-drawn Polymarket phone (PARTNER 2026).
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Wordmark} from './kit/Intro';
import {Finish, Highlight, JF, Note, PALETTES, PaletteCtx, Picture, type Place, Tint, Traced} from './kit/Kit';
import {DarkPaper} from './kit/common';
import {PhoneSketch} from './kit/bs';
import {MASKS} from './masks';

export const THUMB_FRAMES = 150;
const TEAL = '#2FE0C4';
const CORAL = '#FF6F61';

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

/** A cut-out subject on the desk (the picture limited to its mask), with a drop shadow. */
const Cutout: React.FC<{src: string; size: [number, number]; place: Place; alpha: string}> = ({src, size, place, alpha}) => (
  <div style={{position: 'absolute', left: place.left, top: place.top, width: size[0] * place.scale, height: size[1] * place.scale, ...cut(alpha), filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))'}}>
    <Picture src={src} place={{left: 0, top: 0, scale: place.scale}} size={size} bw="grayscale(1) contrast(1.25) brightness(0.92)" />
  </div>
);

/** The subject tint on one side of x = mid (the clip sits on each blended layer so the blend isn't isolated). */
const SideTint: React.FC<{place: Place; size: [number, number]; alpha: string; color: string; mid: number; side: 'left' | 'right'}> = ({place, size, alpha, color, mid, side}) => {
  const w = size[0] * place.scale;
  const m0 = mid - place.left;
  const m: React.CSSProperties = {
    position: 'absolute', left: place.left, top: place.top, width: w, height: size[1] * place.scale, ...cut(alpha),
    clipPath: side === 'left' ? `inset(0 ${w - m0}px 0 0)` : `inset(0 0 0 ${m0}px)`,
  };
  return (
    <>
      <div style={{...m, background: color, mixBlendMode: 'color'}} />
      <div style={{...m, background: color, mixBlendMode: 'multiply', opacity: 0.3}} />
      <div style={{...m, background: color, mixBlendMode: 'screen', opacity: 0.28}} />
    </>
  );
};

const JX = {src: 'img/ch06/joe_jackson_c1920.jpg', size: [1159, 1536] as [number, number], mask: MASKS.jackson_c1920};

export const ThumbA: React.FC = () => {
  const place: Place = {left: 960 - 715 * 1.15, top: 95 - 154 * 1.15, scale: 1.15};
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <AbsoluteFill style={{background: '#15130f', overflow: 'hidden'}}>
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #2a2620 0%, #16140f 70%, #0d0c09 100%)'}} />
        <Cutout src={JX.src} size={JX.size} place={place} alpha={JX.mask.alpha} />
        <SideTint place={place} size={JX.size} alpha={JX.mask.alpha} color={TEAL} mid={960} side="left" />
        <SideTint place={place} size={JX.size} alpha={JX.mask.alpha} color={CORAL} mid={960} side="right" />
        <Traced paths={JX.mask.data.shapes.subject} place={place} at={0} dur={1} width={7} color="#f4efe6" />
        <div style={{position: 'absolute', left: 956, top: 0, width: 8, height: 1080, background: '#f4efe6'}} />
        <Highlight text="SAY IT" x={150} y={845} size={160} at={0} seed={71} rot={-3} />
        <Highlight text="AIN'T SO" x={1000} y={845} size={160} at={0} seed={73} rot={-2} />
        <Note text="1919" x={1500} y={330} size={110} rot={-6} color={TEAL} />
        <Logo />
        <Finish vignette={0.3} />
      </AbsoluteFill>
    </PaletteCtx.Provider>
  );
};

export const ThumbB: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <AbsoluteFill style={{background: '#15130f', overflow: 'hidden'}}>
      <Img src={staticFile('img/ch04/polo_grounds_crowd_giants_cubs_1908-10-08.jpg')} style={{position: 'absolute', left: 480, top: 0, width: 1440, height: 1080, objectFit: 'cover', objectPosition: '50% 40%',
        filter: 'grayscale(1) contrast(1.25) brightness(0.85)', transform: 'scale(1.16)', transformOrigin: '45% 60%'}} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(8,7,5,1) 0%, rgba(8,7,5,0.92) 38%, rgba(8,7,5,0.2) 62%, rgba(8,7,5,0) 75%)'}} />
      <Note text="before the Black Sox..." x={90} y={300} size={80} rot={-3} color={TEAL} />
      <Highlight text="EVERYBODY" x={70} y={430} size={190} at={0} seed={75} rot={-3} />
      <Highlight text="BET." x={110} y={680} size={210} at={0} seed={77} rot={-2} />
      <Logo />
      <Finish vignette={0.3} />
    </AbsoluteFill>
  </PaletteCtx.Provider>
);


export const ThumbC: React.FC = () => {
  // Jackson from the waist up: cap top at y 190, the face centred on x 500, the belt just above the BANNED tape
  const place: Place = {left: 500 - 715 * 1.12, top: 190 - 154 * 1.12, scale: 1.12};
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <AbsoluteFill style={{background: '#15130f', overflow: 'hidden'}}>
        <DarkPaper />
        <div style={{position: 'absolute', left: 0, top: 0, width: 956, height: 1080, overflow: 'hidden'}}>
          <Cutout src={JX.src} size={JX.size} place={place} alpha={JX.mask.alpha} />
          <Tint mask={JX.mask.alpha} place={place} size={JX.size} />
          <Traced paths={JX.mask.data.shapes.subject} place={place} at={0} dur={1} width={8} />
        </div>
        <div style={{position: 'absolute', left: 956, top: 60, width: 8, height: 960, background: 'rgba(244,239,230,0.75)'}} />
        <PhoneSketch x={1270} y={70} w={360} at={0} rot={4} />
        <div style={{position: 'absolute', left: 740, top: 790, fontFamily: JF.mono, fontSize: 40, letterSpacing: 6, color: TEAL}}>1921</div>
        <div style={{position: 'absolute', left: 1060, top: 800, fontFamily: JF.mono, fontSize: 40, letterSpacing: 6, color: CORAL}}>2026</div>
        <Highlight text="BANNED" x={100} y={855} size={150} at={0} seed={79} rot={-3} />
        <Highlight text="PARTNER" x={1040} y={855} size={150} at={0} seed={81} rot={-2} />
        <Logo />
        <Finish vignette={0.3} />
      </AbsoluteFill>
    </PaletteCtx.Provider>
  );
};
