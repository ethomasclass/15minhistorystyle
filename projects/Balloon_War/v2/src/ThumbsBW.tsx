// Balloon War v2 thumbnail concepts, drawn at 1920x1080 and exported at 1280x720 by tools/thumbs.mjs (frame 140).
// All from the video's own art (no new image credits). v1's packaging (PAPER BOMBS / FAKE TANKS) is already on the channel,
// so none of these repeat it.
//   A · NOBODY WARNED THEM: the cold open's painting (BW03), the coral balloon in the pines. Frame 0 of the video.
//   B · SHE BUILT A BOMB: Rei gluing the coral panel (BW09); "and didn't know" in teal.
//   C · NO PILOT: the 3D jet stream (real January 1945 winds), one big coral balloon riding it over the Pacific.
//   D · Topic-led: WWII BALLOON BOMBS / WHY THE SILENCE? over the 1945 drawing, its envelope in coral.
//   E, F, G · faces (thumbnail-only Gemini ink art, public/img/gen/thumb/f*.txt): see each below.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Finish, Highlight, JF, Note, PALETTES, PaletteCtx} from './kit/Kit';
import {DarkPaper} from './kit/common';

export const THUMB_FRAMES = 150;

/** Chunk History logo, top-left (YouTube covers the bottom-right corner). */
const Logo: React.FC = () => (
  <div style={{position: 'absolute', left: 40, top: 36, padding: '16px 22px', borderRadius: 14, background: 'rgba(13,12,9,0.8)', boxShadow: '0 8px 24px rgba(0,0,0,0.6)'}}>
    <Img src={staticFile('img/brand/chunk-history-horizontal.svg')} style={{width: 360, display: 'block'}} />
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

/** A full-frame painting; `zoom` and `cx/cy` (0–1 of the image) crop in on the subject. */
const Scene: React.FC<{src: string; zoom?: number; cx?: number; cy?: number; dim?: number}> = ({src, zoom = 1, cx = 0.5, cy = 0.5, dim = 0}) => (
  <AbsoluteFill>
    <Img src={staticFile(src)} style={{position: 'absolute', width: 1920 * zoom, height: 1080 * zoom, objectFit: 'cover',
      left: 960 - 1920 * zoom * cx, top: 540 - 1080 * zoom * cy}} />
    {dim ? <AbsoluteFill style={{background: `rgba(0,0,0,${dim})`}} /> : null}
  </AbsoluteFill>
);

export const ThumbA: React.FC = () => (
  <Frame>
    <Scene src="img/gen/scenes/2x/BW03_woods_open.jpg" zoom={1.12} cx={0.44} cy={0.47} />
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)'}} />
    <Highlight text="NOBODY" x={980} y={330} size={180} at={0} seed={91} rot={-3} />
    <Highlight text="WARNED THEM" x={760} y={580} size={140} at={0} seed={92} rot={-2} />
  </Frame>
);

export const ThumbB: React.FC = () => (
  <Frame>
    <Scene src="img/gen/scenes/2x/BW09_rei.jpg" zoom={1.08} cx={0.42} cy={0.5} />
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.5) 100%)'}} />
    <Highlight text="SHE BUILT" x={1020} y={190} size={160} at={0} seed={93} rot={-3} />
    <Highlight text="A BOMB" x={1130} y={400} size={190} at={0} seed={94} rot={-2} />
    <Note text="and didn't know it" x={1020} y={650} size={86} rot={-4} at={0} />
  </Frame>
);

export const ThumbC: React.FC = () => (
  <Frame vignette={0.4}>
    <Scene src="img/gen/thumb/pacific_winds_f360.jpg" zoom={1.12} cx={0.5} cy={0.46} />
    {/* the balloon, big, riding the stream mid-Pacific (the BW02 balloon cut-out) */}
    <Img src={staticFile('img/gen/scenes/plates/balloon_ring.png')} style={{position: 'absolute', left: 871, top: 426, height: 480,
      filter: 'drop-shadow(0 18px 30px rgba(0,0,0,0.7))'}} />
    <Highlight text="NO PILOT." x={110} y={190} size={150} at={0} seed={95} rot={-3} />
    <Highlight text="NO PLANE." x={1060} y={230} size={150} at={0} seed={96} rot={-2} />
  </Frame>
);

export const ThumbD: React.FC = () => (
  <Frame>
    <DarkPaper />
    {/* the 1945 general-arrangement drawing as a print, tilted; the envelope washed coral */}
    <div style={{position: 'absolute', left: 1160, top: 40, width: 700, transform: 'rotate(2deg)', boxShadow: '0 20px 50px rgba(0,0,0,0.7)'}}>
      <div style={{position: 'relative', isolation: 'isolate'}}>
        <Img src={staticFile('img/ch04_paper_balloon/balloon_general_arrangement_fig39.jpg')} style={{width: 700, display: 'block'}} />
        <div style={{position: 'absolute', left: 700 * 0.205, top: 1013 * 0.012, width: 700 * 0.475, height: 700 * 0.475,
          borderRadius: '50%', background: '#FF6F61', mixBlendMode: 'multiply', opacity: 0.95}} />
      </div>
    </div>
    <Highlight text="WWII BALLOON BOMBS:" x={80} y={330} size={92} at={0} seed={97} rot={-2} />
    <Highlight text="WHY THE" x={140} y={520} size={170} at={0} seed={98} rot={-3} />
    <Highlight text="SILENCE?" x={170} y={730} size={170} at={0} seed={99} rot={-2} />
  </Frame>
);

/** Big clean type (the Halloween lesson: bold white sans reads best at feed size), optionally one word in coral. */
const Big: React.FC<{text: string; x: number; y: number; size: number; color?: string}> = ({text, x, y, size, color = '#F4EFE6'}) => (
  <div style={{position: 'absolute', left: x, top: y, fontFamily: JF.sans, fontWeight: 800, fontSize: size, lineHeight: 0.95,
    letterSpacing: -2, color, textShadow: '0 6px 24px rgba(0,0,0,0.8)', whiteSpace: 'nowrap'}}>{text}</div>
);

/** Thumbnail-only ink art (Gemini, B&W + one coral accent), full frame. */
const Ink: React.FC<{src: string; zoom?: number; cx?: number; cy?: number}> = (p) => <Scene {...p} />;

//   E · SHE BUILT / A BOMB / and didn't know it: the schoolgirl at her table (f1_b), face lit, the balloon looming behind.
export const ThumbE: React.FC = () => (
  <Frame vignette={0.25}>
    <Ink src="img/gen/thumb/f1_b.png" zoom={1.15} cx={0.56} cy={0.48} />
    <Big text="SHE BUILT" x={90} y={300} size={170} />
    <Highlight text="A BOMB" x={110} y={520} size={190} at={0} seed={101} rot={-3} />
    <Note text="and didn't know it" x={130} y={800} size={92} rot={-4} at={0} />
  </Frame>
);

//   F · SHE BUILT / A BOMB / ...and found out decades later: the same girl grown up at the bookstore window (f2_b), hand to mouth.
export const ThumbF: React.FC = () => (
  <Frame vignette={0.25}>
    <Ink src="img/gen/thumb/f2_b.png" zoom={1.0} cx={0.5} cy={0.5} />
    <Big text="SHE BUILT" x={80} y={290} size={165} />
    <Highlight text="A BOMB" x={100} y={510} size={185} at={0} seed={103} rot={-3} />
    <Note text="...and found out decades later" x={90} y={800} size={70} rot={-4} at={0} />
  </Frame>
);

//   G · SECRET / BOMBS: a 1945 farm woman crying out at the coral balloon and its bomb over the pines (f3_a). Not Elsie, not Bly.
export const ThumbG: React.FC = () => (
  <Frame vignette={0.25}>
    <Ink src="img/gen/thumb/f3_a.png" zoom={1.0} cx={0.5} cy={0.5} />
    <Big text="SECRET" x={90} y={330} size={200} />
    <Highlight text="BOMBS" x={110} y={580} size={210} at={0} seed={105} rot={-3} />
  </Frame>
);

export const THUMBS: {key: string; C: React.FC}[] = [
  {key: 'A', C: ThumbA}, {key: 'B', C: ThumbB}, {key: 'C', C: ThumbC}, {key: 'D', C: ThumbD}, {key: 'E', C: ThumbE}, {key: 'F', C: ThumbF}, {key: 'G', C: ThumbG},
];
