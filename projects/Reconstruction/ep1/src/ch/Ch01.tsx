// Chapter 1 · the cold open (driving question), then the channel intro and the title card.
// Chapter 1 has no logo break in front; it ends on the intro + title instead. Replace the scenes, keep the shape.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch01_cold_open.words.json';
import {clamp} from '../lib/anim';
import {Finish, Highlight, JF, Loop, Note, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, MapView, Sfx, WRITE} from '../kit/common';
import {ChannelIntro, INTRO_FRAMES} from '../kit/Intro';
import {CropCard, DrawnCrown, makeTimeline, type Narration, Photo, type TL, useScene} from '../kit/shell';
import {EpBoard} from '../kit/ep1board';
import {DATES, SUBTITLE, TITLE} from '../project';

const N = words as Narration;
/** Title card length (frames) after the channel intro. */
const TITLE_FRAMES = 150;
/** Narration ends; the channel intro starts 20 frames later. */
const END = Math.ceil(N.duration * 30) + 20;
export const CH01_FRAMES = END + INTRO_FRAMES + TITLE_FRAMES;

/** Stub: the board only (scenes to come). */
const Stub: React.FC<{t: TL}> = ({t}) => <DarkPaper />;

/** Title card after the channel intro: the map dimmed, the title on orange, the subtitle in teal. */
const Title: React.FC = () => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapView cx={2600} cy={2320} s={0.26 + g * 0.0003} rot={0} dim={0.5} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(8,6,4,0.2) 30%, rgba(8,6,4,0.85) 100%)'}} />
      <Highlight text={TITLE} x={330} y={360} size={180} at={4} seed={61} rot={-2} />
      {g >= 14 && <div style={{position: 'absolute', left: 380, top: 640, fontFamily: JF.display, fontSize: 64, color: pal.mark, textShadow: '0 3px 16px rgba(0,0,0,0.8)', opacity: interpolate(g, [14, 20], [0, 1], clamp)}}>{SUBTITLE}</div>}
      <Note text={DATES} x={1340} y={760} size={52} rot={-5} at={24} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  // [cut frame, scene]: cut 1 frame before the word that starts the new idea
  const cuts: [number, React.ReactNode][] = [
    [0, <Stub t={t} />],
    [at("We'll come back") - 2, <EpBoard ch={1} from={at("We'll come back") - 2} at={at('this island')} />],
  ];
  let scene = useScene(cuts);
  if (frame >= END + INTRO_FRAMES) scene = <Sequence from={END + INTRO_FRAMES} layout="none"><Title /></Sequence>;
  else if (frame >= END) scene = <Sequence from={END} layout="none"><ChannelIntro /></Sequence>;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {frame < END && <Finish vignette={0.3} />}
      <Audio src={staticFile('audio/ch01_cold_open.wav')} />
      {/* cold-open music bed, e.g. <Audio src={staticFile('music/cold_open.mp3')} volume={(f) => interpolate(f, [0, 15, END - 30, END], [0, 0.17, 0.17, 0], clamp)} /> */}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.35} />)}
      <Sfx at={END + INTRO_FRAMES + 4} src="sfx/stamp.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Ch01: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
