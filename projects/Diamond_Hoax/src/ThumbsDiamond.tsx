// Diamond Hoax thumbnail concepts (packaging first, before the script), drawn at 1920x1080, exported at 1280x720 by
// tools/thumbs.mjs (frame 140). The tycoon is an anonymous Gemini engraving (no real person); the stones were real, the field was fake.
//   F1 · the shocked tycoon in coral, rough diamond in hand: WHO PUT / IT THERE?
//   F2 · the same tycoon in black and white, only the diamond in coral: IT WAS IN / AN ANTHILL?
//   F3 · the loupe tycoon in coral: WHO PUT / IT THERE?
//   G1/G2 · over the cousins' shoulders: the two of them from behind (fingers crossed, the pouch of stones), the loupe tycoon
//           smaller between them in coral, admiring the stone. G1: IT'S REAL! · G2: WORTH MILLIONS!
//   H1/H2 · the same picture, DIRT the big word. H1: small PAID FOR tape over a huge DIRT tape · H2: teal handwritten
//           "they paid millions for..." over a huge DIRT.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Finish, Highlight, Note, PALETTES, PaletteCtx, Picture, type Place, Tint, Traced} from './kit/Kit';
import {DarkPaper} from './kit/common';
import {MASKS} from './masks';

const TEAL = '#2FE0C4';
const SIZE: [number, number] = [1200, 896];

const Logo: React.FC = () => (
  <div style={{position: 'absolute', left: 40, top: 36, padding: '16px 22px', borderRadius: 14, background: 'rgba(13,12,9,0.8)', boxShadow: '0 8px 24px rgba(0,0,0,0.6)'}}>
    <Img src={staticFile('img/brand/chunk-history-horizontal.svg')} style={{width: 380, display: 'block'}} />
  </div>
);

const cut = (alpha: string): React.CSSProperties =>
  ({WebkitMaskImage: `url(${staticFile(alpha)})`, WebkitMaskSize: '100% 100%', maskImage: `url(${staticFile(alpha)})`, maskSize: '100% 100%'}) as React.CSSProperties;

/** A cut-out engraving on the desk: the paper is masked away, the figure keeps its ink. */
const Figure: React.FC<{src: string; mask: string; place: Place}> = ({src, mask, place}) => (
  <div style={{position: 'absolute', left: place.left, top: place.top, width: SIZE[0] * place.scale, height: SIZE[1] * place.scale, ...cut(mask), filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))'}}>
    <Picture src={src} place={{left: 0, top: 0, scale: place.scale}} size={SIZE} bw="grayscale(1) contrast(1.15) brightness(1.02)" />
  </div>
);

const Frame: React.FC<{children: React.ReactNode}> = ({children}) => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <AbsoluteFill style={{background: '#15130f', overflow: 'hidden'}}>
      <DarkPaper />
      {children}
      <Logo />
      <Finish vignette={0.3} />
    </AbsoluteFill>
  </PaletteCtx.Provider>
);

const C: Place = {left: 640, top: 40, scale: 1.16};

export const ThumbF1: React.FC = () => (
  <Frame>
    <Figure src="img/gen/thumb/tycoon_c_clean.png" mask={MASKS.tycoon_c.alpha} place={C} />
    <Tint mask={MASKS.tycoon_c.alpha} place={C} size={SIZE} />
    <Traced paths={MASKS.tycoon_c.data.shapes.subject} place={C} at={0} dur={1} width={8} />
    <Note text="found in an anthill..." x={70} y={420} size={64} rot={-4} color={TEAL} />
    <Highlight text="WHO PUT" x={60} y={530} size={150} at={0} seed={91} rot={-3} />
    <Highlight text="IT THERE?" x={90} y={740} size={150} at={0} seed={92} rot={-2} />
  </Frame>
);

export const ThumbF2: React.FC = () => (
  <Frame>
    <Figure src="img/gen/thumb/tycoon_c_clean.png" mask={MASKS.tycoon_c.alpha} place={C} />
    <Tint mask={MASKS.rock_c.alpha} place={C} size={SIZE} />
    <Traced paths={MASKS.rock_c.data.shapes.subject} place={C} at={0} dur={1} width={9} />
    <Note text="they paid millions for this..." x={70} y={410} size={58} rot={-4} color={TEAL} />
    <Highlight text="IT WAS IN" x={60} y={520} size={150} at={0} seed={93} rot={-3} />
    <Highlight text="AN ANTHILL?" x={90} y={730} size={150} at={0} seed={94} rot={-2} />
  </Frame>
);

const B: Place = {left: 560, top: 60, scale: 1.2};

export const ThumbF3: React.FC = () => (
  <Frame>
    <Figure src="img/gen/thumb/tycoon_b_clean.png" mask={MASKS.tycoon_b.alpha} place={B} />
    <Tint mask={MASKS.tycoon_b.alpha} place={B} size={SIZE} />
    <Traced paths={MASKS.tycoon_b.data.shapes.subject} place={B} at={0} dur={1} width={8} />
    <Note text="found in an anthill..." x={70} y={420} size={64} rot={-4} color={TEAL} />
    <Highlight text="WHO PUT" x={60} y={530} size={150} at={0} seed={95} rot={-3} />
    <Highlight text="IT THERE?" x={90} y={740} size={150} at={0} seed={96} rot={-2} />
  </Frame>
);

const PAIR: [number, number] = [1376, 768];
const COUSIN_L: Place = {left: -40, top: 250, scale: 1.3};
const COUSIN_R: Place = {left: 250, top: 250, scale: 1.3};
const TYC: Place = {left: 495, top: 370, scale: 0.8};

/** One cousin cut out of the pair picture (both share the same placement; each mask keeps one man). */
const Cousin: React.FC<{mask: string; at: Place}> = ({mask, at}) => (
  <div style={{position: 'absolute', left: at.left, top: at.top, width: PAIR[0] * at.scale, height: PAIR[1] * at.scale, ...cut(mask), filter: 'drop-shadow(0 0 40px rgba(0,0,0,0.85))'}}>
    <Picture src="img/gen/thumb/cousins_a_pro.png" place={{left: 0, top: 0, scale: at.scale}} size={PAIR} bw="grayscale(1) contrast(1.2) brightness(0.8)" />
  </div>
);

const Scene: React.FC<{tyc?: Place; children: React.ReactNode}> = ({tyc = TYC, children}) => (
  <Frame>
    <Figure src="img/gen/thumb/tycoon_b_clean.png" mask={MASKS.tycoon_b.alpha} place={tyc} />
    <Tint mask={MASKS.tycoon_b.alpha} place={tyc} size={SIZE} />
    <Traced paths={MASKS.tycoon_b.data.shapes.subject} place={tyc} at={0} dur={1} width={7} />
    <Cousin mask={MASKS.cousin_l.alpha} at={COUSIN_L} />
    <Cousin mask={MASKS.cousin_r.alpha} at={COUSIN_R} />
    {children}
  </Frame>
);

const OverTheShoulder: React.FC<{words: string; size: number; x: number}> = ({words, size, x}) => (
  <Scene><Highlight text={words} x={x} y={150} size={size} at={0} seed={97} rot={-3} /></Scene>
);

export const ThumbG1: React.FC = () => <OverTheShoulder words="IT'S REAL!" size={170} x={560} />;
export const ThumbG2: React.FC = () => <OverTheShoulder words="WORTH MILLIONS!" size={140} x={470} />;

// DIRT sits above the tycoon's head, so he drops a little and shrinks.
const TYC_LOW: Place = {left: 520, top: 440, scale: 0.75};

export const ThumbH1: React.FC = () => (
  <Scene tyc={TYC_LOW}>
    <Highlight text="PAID FOR" x={600} y={40} size={105} at={0} seed={98} rot={-4} />
    <Highlight text="DIRT" x={640} y={150} size={250} at={0} seed={99} rot={-2} />
  </Scene>
);

export const ThumbH2: React.FC = () => (
  <Scene tyc={TYC_LOW}>
    <Note text="they paid millions for..." x={560} y={70} size={66} rot={-3} color={TEAL} />
    <Highlight text="DIRT." x={600} y={150} size={250} at={0} seed={100} rot={-2} />
  </Scene>
);
