// Example short for the template project: the cold-open narration (script/ch01_cold_open.txt), then the outro.
// It shows the four layouts a short is built from: a tinted portrait card that is the cover from frame 0, a
// full-bleed picture, the 1836 map with a pin, and the two outro scenes. Copy it, rename it, replace the clips
// and scenes. Register it in src/Root.tsx:
//   <Composition id="Short-Example" width={SW} height={SH} fps={FPS} durationInFrames={SHORT_EXAMPLE_FRAMES} component={() => <JFonts><ShortExample /></JFonts>} />
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import ch01 from '../../public/audio/ch01_cold_open.words.json';
import outro from '../../public/audio/short_outro_subscribe.words.json';
import {clamp} from '../lib/anim';
import {makeTimeline, type Narration} from '../lib/timing';
import {Highlight, INK, Note, Picture, Tint, Traced, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {PLACES} from '../kit/map';
import {MASKS} from '../masks';
import {type Clip, CropV, fillV, joinWords, MapViewV, mapToScreenV, OutroSubscribe, OutroWatch, PinV, ShortShell, shortFrames, TagV} from './Short';

// Cut points from: python3 <skill>/scripts/segments.py public/audio/ch01_cold_open.words.json "Here's" "evidence."
const CLIPS: Clip[] = [
  {stem: 'ch01_cold_open', words: ch01 as Narration, from: 0.2, to: (ch01 as Narration).duration},
  {stem: 'short_outro_subscribe', words: outro as Narration, from: 0, to: (outro as Narration).duration},
];
export const SHORT_EXAMPLE_FRAMES = shortFrames(CLIPS);
const N = joinWords(CLIPS);
const T = makeTimeline(N, 30);
type TL = typeof T;
const SULLY: [number, number] = [1920, 2288];
/** The long video's thumbnail for the outro card (copy renders/thumbnails/<SLUG>_A.png into public/img/shorts/). */
const THUMB = 'img/demo/sully_jackson_1845.jpg';

/** The cover: the portrait on a card, tinted and traced, fully drawn from frame 0. */
const Portrait: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropV src="img/demo/sully_jackson_1845.jpg" size={SULLY} x={170} y={520} w={740} h={680} fx={960} fy={1000} scale={0.5} rot={-2} at={-100}
        mask={{alpha: MASKS.sully.alpha, paths: MASKS.sully.data.shapes.subject}} traceAt={-100} />
      {g >= t.at('1845.') && <Highlight text="1845" x={60} y={500} size={96} at={t.at('1845.')} seed={11} rot={-3} />}
      <Note text="wild white hair" x={560} y={1140} size={50} rot={-4} at={t.at('wild')} />
      <TagV text="Thomas Sully, Andrew Jackson, 1845 · National Gallery of Art" />
    </AbsoluteFill>
  );
};

/** Full-bleed: the portrait fills the tall frame with a slow push, the two names in the middle band. */
const TwoNames: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const place = fillV(SULLY, 960, 1000, interpolate(frame, [t.at("That's"), t.at("So here's")], [1.0, 1.06], clamp));
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Picture src="img/demo/sully_jackson_1845.jpg" place={place} size={SULLY} bw="grayscale(1) contrast(1.25) brightness(0.7)" />
      <Tint mask={MASKS.sully.alpha} place={place} size={SULLY} strength={0.6} />
      <Traced paths={MASKS.sully.data.shapes.subject} place={place} at={-100} dur={1} width={6} />
      {g >= t.at("People's") && <Highlight text="THE PEOPLE'S PRESIDENT" x={50} y={1020} size={60} at={t.at("People's")} seed={13} rot={-2} />}
      {g >= t.at('King') && <Highlight text="KING ANDREW" x={60} y={1120} size={84} at={t.at('King')} seed={15} rot={-3} />}
      <TagV text="Thomas Sully, Andrew Jackson, 1845 · National Gallery of Art" />
    </AbsoluteFill>
  );
};

/** The map: camera centre lands mid-frame, one pin, a note. */
const Question: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const s = 0.9;
  const S = mapToScreenV(PLACES.washington[0], PLACES.washington[1], s);
  const [wx, wy] = S(PLACES.washington);
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <MapViewV cx={PLACES.washington[0]} cy={PLACES.washington[1]} s={s} dim={0.2} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(8,6,4,0.8) 100%)'}} />
      <PinV x={wx} y={wy} at={t.at('question')} label="Washington" />
      <Note text="how did one man" x={80} y={540} size={64} rot={-3} at={t.at('How')} />
      <Note text="earn both names?" x={110} y={640} size={64} rot={-3} at={t.at('both')} color={pal.subject} />
      <TagV text="Mitchell's Map of the United States, 1836 · Library of Congress" />
    </AbsoluteFill>
  );
};

const Body: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Portrait t={t} />],
    [at("That's") - 1, <TwoNames t={t} />],
    [at("So here's") - 1, <Question t={t} />],
    [at('Want') - 1, <OutroWatch t={t} thumb={THUMB} />],
    [at('And subscribe') - 1, <OutroSubscribe t={t} />],
  ];
  return (
    <>
      {cuts.reduce((acc, [f, node]) => (frame >= f ? node : acc), cuts[0][1])}
      {['1845.', "People's", 'King', 'subscribe'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.26} />)}
      {['wild', 'How', 'both', 'Want'].map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
    </>
  );
};

const CUTS = ["That's", "So here's", 'Want', 'And subscribe'].map((p) => T.at(p) - 1);

export const ShortExample: React.FC = () => (
  <ShortShell clips={CLIPS} headline={["THE PEOPLE'S MAN", 'OR A KING?']} headlineSize={86} cuts={CUTS}>
    {/* add music={{src: 'music/<cue>.mp3', volume: 0.12, duck: [[startFrame, endFrame]]}} with a fun cue from the style repo's music/ */}
    <Body t={T} />
  </ShortShell>
);
