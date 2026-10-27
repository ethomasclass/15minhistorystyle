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

export const HALLOWEEN_THUMBS: Record<string, React.FC> = {C: ThumbC, C2: ThumbC2, D: ThumbD, E: ThumbE, F: ThumbF};
