// YouTube thumbnail concepts for When Europe Ate Mummies, drawn at 1920x1080 with the video's own kit and exported
// at 1280x720 (tools/thumbs.mjs renders frame 140 so every write-on has finished).
//   A · WHILE SUPPLIES LAST: the real MUMIA pharmacy jar on a card, the catalog's own phrase as the headline.
//   B · MUMMY, BY THE KILO: Merck's 1903 catalog line blown up, the price circled in coral.
//   C · EUROPE ATE MUMMIES: the tomb-raid painting, the wrapped bundle in coral.
//   D · MEDICINE?: the hand-drawn Jar from the video, coral fill, one question.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Wordmark} from './kit/Intro';
import {Finish, Highlight, Loop, Note, PALETTES, PaletteCtx, Picture, Tint, Traced} from './kit/Kit';
import {DarkPaper} from './kit/common';
import {fill, PhotoCard} from './kit/shell';
import {Jar} from './jar';
import {IMG} from './images';
import {MASKS} from './masks';

export const THUMB_FRAMES = 150;
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

const Frame: React.FC<{children: React.ReactNode}> = ({children}) => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {children}
      <Finish vignette={0.35} />
      <Logo />
    </AbsoluteFill>
  </PaletteCtx.Provider>
);

export const ThumbA: React.FC = () => (
  <Frame>
    <DarkPaper />
    <PhotoCard src={IMG.museumJar.src} x={170} y={210} w={560} h={800} rot={-3} at={0} filter="grayscale(1) contrast(1.25) brightness(1.05) sepia(0.6) hue-rotate(-25deg) saturate(2.2)" />
    <Note text="genuine Egyptian mummy, 1903:" x={860} y={250} size={60} rot={-3} at={0} color="#ffffff" />
    <Highlight text="WHILE" x={860} y={380} size={190} at={0} seed={71} rot={-3} />
    <Highlight text="SUPPLIES" x={860} y={590} size={170} at={0} seed={72} rot={-2} />
    <Highlight text="LAST" x={1160} y={790} size={170} at={0} seed={73} rot={-3} />
  </Frame>
);

export const ThumbB: React.FC = () => {
  const {src, size} = IMG.merckLine;
  const place = {left: 30, top: 0, scale: 0.74};
  return (
    <Frame>
      <DarkPaper />
      <div style={{position: 'absolute', left: -40, top: 290, width: 2000, height: 250, background: '#f4efe6', transform: 'rotate(-2deg)', boxShadow: '0 18px 34px rgba(0,0,0,0.6)', overflow: 'hidden'}}>
        <Picture src={src} place={{left: place.left + 40, top: 40, scale: place.scale}} size={size} bw="grayscale(1) contrast(1.3) sepia(0.25)" />
      </div>
      <Loop cx={1645} cy={420} rx={170} ry={95} at={0} seed={74} color={CORAL} width={12} />
      <Highlight text="MUMMY," x={130} y={620} size={180} at={0} seed={75} rot={-3} />
      <Highlight text="BY THE KILO" x={560} y={830} size={150} at={0} seed={76} rot={-2} />
      <Note text="a real drug catalog, 1903" x={150} y={190} size={60} rot={-3} at={0} color="#ffffff" />
    </Frame>
  );
};

export const ThumbC: React.FC = () => {
  const {src, size} = IMG.tomb;
  const place = fill(size, 600, 420, 1.15);
  return (
    <Frame>
      <Picture src={src} place={place} size={size} bw="grayscale(1) contrast(1.25) brightness(0.95)" />
      <Tint mask={MASKS.tomb_bundle.alpha} place={place} size={size} />
      <Traced paths={MASKS.tomb_bundle.data.shapes.subject} place={place} at={0} dur={1} width={9} />
      <AbsoluteFill style={{background: 'linear-gradient(transparent 52%, rgba(0,0,0,0.75) 80%)'}} />
      <Highlight text="EUROPE ATE" x={110} y={700} size={150} at={0} seed={77} rot={-2} />
      <Highlight text="MUMMIES" x={940} y={860} size={150} at={0} seed={78} rot={-3} />
    </Frame>
  );
};

export const ThumbD: React.FC = () => (
  <Frame>
    <DarkPaper />
    <Jar x={170} y={110} h={880} at={0} labels={[{text: 'MUMIA', at: 0, size: 10}]} fill={[[0, 0.78]]} />
    <Note text="for centuries, Europe took it as" x={830} y={280} size={58} rot={-3} at={0} color="#ffffff" />
    <Highlight text="MEDICINE" x={820} y={400} size={200} at={0} seed={79} rot={-3} />
    <Note text="(it was people)" x={1050} y={700} size={90} rot={-4} at={0} color={CORAL} />
  </Frame>
);
