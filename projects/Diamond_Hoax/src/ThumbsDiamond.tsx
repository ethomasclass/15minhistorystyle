// Diamond Hoax thumbnail concepts (packaging first, before the script), drawn at 1920x1080, exported at 1280x720 by
// tools/thumbs.mjs (frame 140). The tycoon is an anonymous Gemini engraving (no real person); the stones were real, the field was fake.
//   F1 · the shocked tycoon in coral, rough diamond in hand: WHO PUT / IT THERE?
//   F2 · the same tycoon in black and white, only the diamond in coral: IT WAS IN / AN ANTHILL?
//   F3 · the loupe tycoon in coral: WHO PUT / IT THERE?
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
