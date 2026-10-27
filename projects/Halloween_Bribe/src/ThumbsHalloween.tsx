// Halloween thumbnail concepts, drawn at 1920x1080 and exported at 1280x720 by tools/thumbs.mjs (frame 140).
//   C  · IT WAS A BRIBE: silhouette painting, kids paid at the door while a wagon sits on the barn roof against the moon.
//   C2 · PAID TO STOP: same painting, the outline's tape words.
//   D  · HALLOWEEN WAS A RIOT: silhouette painting, boys running from the wagon on the roof, a tiny ghost with a lantern.
//   E  · TEAR GAS: the real Bismarck Tribune headline, 1 Nov 1933, "Tear Gas" looped in coral.
//   F  · masked kids, 1964 (Angelo Rizzuto, LOC), one mask in coral.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Finish, Highlight, Loop, Note, PALETTES, PaletteCtx, Picture, Tint, Traced} from './kit/Kit';
import {DarkPaper} from './kit/common';
import {fill} from './kit/shell';
import {MASKS} from './masks';

const CORAL = '#FF6F61';

/** Chunk History logo, top-left (YouTube covers the bottom corners). */
const Logo: React.FC = () => (
  <div style={{position: 'absolute', left: 40, top: 36, padding: '16px 22px', borderRadius: 14, background: 'rgba(13,12,9,0.8)', boxShadow: '0 8px 24px rgba(0,0,0,0.6)'}}>
    <Img src={staticFile('img/brand/chunk-history-horizontal.svg')} style={{width: 380, display: 'block'}} />
  </div>
);

const Frame: React.FC<{children: React.ReactNode; vignette?: number}> = ({children, vignette = 0.3}) => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {children}
      <Finish vignette={vignette} />
      <Logo />
    </AbsoluteFill>
  </PaletteCtx.Provider>
);

const SIL: [number, number] = [1376, 768];

const DoorPainting: React.FC = () => <Picture src="img/gen/thumb/th1_a.png" place={fill(SIL, 688, 384, 1)} size={SIL} bw="saturate(1.15) contrast(1.08)" />;

export const ThumbC: React.FC = () => (
  <Frame>
    <DoorPainting />
    <Highlight text="IT WAS" x={330} y={200} size={160} at={0} seed={81} rot={-3} />
    <Highlight text="A BRIBE" x={420} y={410} size={160} at={0} seed={82} rot={-2} />
  </Frame>
);

export const ThumbC2: React.FC = () => (
  <Frame>
    <DoorPainting />
    <Highlight text="PAID" x={380} y={200} size={180} at={0} seed={83} rot={-3} />
    <Highlight text="TO STOP" x={440} y={420} size={160} at={0} seed={84} rot={-2} />
  </Frame>
);

export const ThumbD: React.FC = () => (
  <Frame>
    <Picture src="img/gen/thumb/th2_a.png" place={fill(SIL, 688, 384, 1)} size={SIL} bw="saturate(1.15) contrast(1.08)" />
    <Highlight text="HALLOWEEN" x={150} y={210} size={150} at={0} seed={85} rot={-3} />
    <Highlight text="WAS A RIOT" x={230} y={410} size={150} at={0} seed={86} rot={-2} />
  </Frame>
);

/** The real front-page headline as a torn newsprint strip across the desk. */
export const ThumbE: React.FC = () => {
  const size: [number, number] = [2600, 607];
  const w = 1760;
  const s = w / size[0];
  return (
    <Frame vignette={0.4}>
      <DarkPaper />
      <div style={{position: 'absolute', left: 80, top: 250, width: w, height: size[1] * s, transform: 'rotate(-2deg)', boxShadow: '0 22px 40px rgba(0,0,0,0.7)', background: '#efe8da', overflow: 'hidden'}}>
        <Picture src="img/ch03/bismarck_tribune_1933-11-01_tear_gas_headline.jpg" place={{left: 0, top: 0, scale: s}} size={size} bw="grayscale(1) contrast(1.35) sepia(0.2)" />
      </div>
      <Loop cx={362} cy={478} rx={300} ry={88} at={0} seed={87} color={CORAL} width={13} tilt={-2} />
      <Note text="the morning after Halloween, 1933" x={560} y={140} size={64} rot={-3} at={0} color="#ffffff" />
      <Highlight text="ON HALLOWEEN?" x={330} y={760} size={160} at={0} seed={88} rot={-2} />
    </Frame>
  );
};

/** 1964 street portrait: the monster-mask kid in coral. Needs MASKS.kids (tools/mask.py kids). */
export const ThumbF: React.FC = () => {
  const size: [number, number] = [3000, 2028];
  const place = fill(size, 1000, 560, 1);
  const m = (MASKS as Record<string, {alpha: string; data: {shapes: Record<string, string[]>}}>).kids;
  return (
    <Frame>
      <Picture src="img/ch05/kids_halloween_masks_nywts_1964.jpg" place={place} size={size} bw="grayscale(1) contrast(1.3) brightness(0.95)" />
      {m && <Tint mask={m.alpha} place={place} size={size} />}
      {m && <Traced paths={m.data.shapes.subject} place={place} at={0} dur={1} width={9} />}
      <AbsoluteFill style={{background: 'linear-gradient(200deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 40%)'}} />
      <Highlight text="IT WAS" x={1240} y={60} size={150} at={0} seed={89} rot={-3} />
      <Highlight text="A BRIBE" x={1180} y={250} size={150} at={0} seed={90} rot={-2} />
    </Frame>
  );
};



/** G · hybrid: the real 1933 headline in two torn strips + the 1964 monster mask cut out in coral. No logo (unreadable in the feed). */
const Strip: React.FC<{crop: [number, number, number, number]; x: number; y: number; w: number; rot: number}> = ({crop, x, y, w, rot}) => {
  const [x0, y0, x1, y1] = crop;
  const s = w / (x1 - x0);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w + 40, height: (y1 - y0) * s + 30, padding: '15px 20px', background: '#efe8da', transform: `rotate(${rot}deg)`, boxShadow: '0 18px 34px rgba(0,0,0,0.7)', overflow: 'hidden'}}>
      <div style={{position: 'relative', width: w, height: (y1 - y0) * s, overflow: 'hidden'}}>
        <Picture src="img/ch03/bismarck_tribune_1933-11-01_tear_gas_headline.jpg" place={{left: -x0 * s, top: -y0 * s, scale: s}} size={[2600, 607]} bw="grayscale(1) contrast(1.4) sepia(0.15)" />
      </div>
    </div>
  );
};

export const ThumbG: React.FC = () => {
  const size: [number, number] = [3000, 2028];
  const m = MASKS.kids;
  const sc = 1.45;
  const place = {left: 1240 - 569 * sc, top: 170 - 178 * sc, scale: sc};
  const cutStyle = {WebkitMaskImage: `url(${staticFile(m.alpha)})`, WebkitMaskSize: '100% 100%', maskImage: `url(${staticFile(m.alpha)})`, maskSize: '100% 100%'} as React.CSSProperties;
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
        <DarkPaper />
        <Strip crop={[50, 228, 1195, 392]} x={60} y={170} w={1120} rot={-3} />
        <Strip crop={[1215, 228, 2405, 392]} x={140} y={420} w={1050} rot={-1.5} />
        <Loop cx={420} cy={265} rx={360} ry={120} at={0} seed={91} color={CORAL} width={14} tilt={-3} />
        <div style={{position: 'absolute', left: place.left, top: place.top, width: size[0] * sc, height: size[1] * sc, ...cutStyle, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))'}}>
          <Picture src="img/ch05/kids_halloween_masks_nywts_1964.jpg" place={{left: 0, top: 0, scale: sc}} size={size} bw="grayscale(1) contrast(1.3)" />
        </div>
        <Tint mask={m.alpha} place={place} size={size} />
        <Traced paths={m.data.shapes.subject} place={place} at={0} dur={1} width={10} />
        <Highlight text="ON HALLOWEEN?" x={110} y={760} size={150} at={0} seed={92} rot={-2} />
        <Finish vignette={0.35} />
      </AbsoluteFill>
    </PaletteCtx.Provider>
  );
};

export const HALLOWEEN_THUMBS: Record<string, React.FC> = {C: ThumbC, C2: ThumbC2, D: ThumbD, E: ThumbE, F: ThumbF, G: ThumbG};
