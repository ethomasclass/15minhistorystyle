// YouTube thumbnail concepts for The Balloon War, drawn at 1920x1080 with the video's own kit and exported at 1280x720
// (tools/thumbs.mjs renders frame 140 so every write-on has finished). Same recipe as Europe Ate Mummies' winner:
// one dark real photo, the subject in coral with the teal trace, two orange torn labels, the logo top-left.
//   A · PAPER BOMBS: the recovered Japanese balloon (Alturas, 1945) against black.
//   B · FAKE TANKS: the Anzio rubber tank, full-bleed.
//   C · JAPAN BOMBED OREGON: the same balloon, the claim that makes people click.
import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Wordmark} from './kit/Intro';
import {Finish, Highlight, Note, PALETTES, PaletteCtx, Picture, type Place, Tint, Traced} from './kit/Kit';
import {fill} from './kit/shell';
import {im} from './images';
import {MASKS} from './masks';

export const THUMB_FRAMES = 150;

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

/** A masked photo: dark, the subject coral, the outline teal. */
const Subject: React.FC<{p: string; m: keyof typeof MASKS; place: Place; bright?: number; pop?: number}> = ({p, m, place, bright = 0.62, pop = 1}) => {
  const {src, size} = im(p);
  return (
    <>
      <Picture src={src} place={place} size={size} bw={`grayscale(1) contrast(1.3) brightness(${bright})`} />
      {/* a dark subject (the balloon) needs lifting before the coral can read */}
      {pop > 1 && <div style={{position: 'absolute', left: place.left, top: place.top, width: size[0] * place.scale, height: size[1] * place.scale, background: '#FF6F61',
        mixBlendMode: 'screen', opacity: 0.5 * (pop - 1),
        WebkitMaskImage: `url(${staticFile(MASKS[m].alpha)})`, WebkitMaskSize: '100% 100%'} as React.CSSProperties} />}
      <Tint mask={MASKS[m].alpha} place={place} size={size} strength={pop} />
      <Traced paths={MASKS[m].data.shapes.subject} place={place} at={0} dur={1} width={9} />
    </>
  );
};

/** The balloon on the right, faded into black on the left where the words go. */
const Balloon: React.FC = () => (
  <>
    <Subject p="ch04_paper_balloon/fugo_inflated_alturas_sc226135.jpg" m="alturas" place={{left: 700, top: -40, scale: 0.88}} bright={0.5} pop={1.8} />
    <AbsoluteFill style={{background: 'linear-gradient(90deg, #000 38%, rgba(0,0,0,0.6) 50%, transparent 62%)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(transparent 70%, rgba(0,0,0,0.7) 100%)'}} />
  </>
);

export const ThumbA: React.FC = () => (
  <Frame>
    <Balloon />
    <Note text="Japan, 1945:" x={130} y={300} size={80} rot={-3} at={0} color="#ffffff" />
    <Highlight text="PAPER" x={110} y={440} size={200} at={0} seed={81} rot={-3} />
    <Highlight text="BOMBS" x={210} y={690} size={200} at={0} seed={82} rot={-2} />
  </Frame>
);

export const ThumbB: React.FC = () => {
  const p = 'ch03_fake/rubber_tank_side_view_anzio_1944.jpg';
  const place = fill(im(p).size, 1450, 1400, 1.0);
  return (
    <Frame>
      <Subject p={p} m="rubber_tank" place={place} bright={0.6} />
      <AbsoluteFill style={{background: 'linear-gradient(transparent 55%, rgba(0,0,0,0.8) 82%)'}} />
      <Highlight text="FAKE" x={110} y={740} size={170} at={0} seed={83} rot={-3} />
      <Highlight text="TANKS" x={720} y={760} size={170} at={0} seed={84} rot={-2} />
      <Note text="(93 pounds)" x={1400} y={790} size={70} rot={-4} at={0} color="#ffffff" />
    </Frame>
  );
};

export const ThumbC: React.FC = () => (
  <Frame>
    <Balloon />
    <Highlight text="JAPAN" x={110} y={300} size={180} at={0} seed={85} rot={-3} />
    <Highlight text="BOMBED" x={150} y={520} size={180} at={0} seed={86} rot={-2} />
    <Highlight text="OREGON" x={110} y={740} size={180} at={0} seed={87} rot={-3} />
  </Frame>
);
