// YouTube thumbnail concepts for Dressed to Kill, drawn at 1920x1080 with the video's own kit and exported at 1280x720
// (tools/thumbs.mjs renders frame 140 so every write-on has finished). Logo top-left; bottom-right kept clear (duration badge).
//   A · the Arsenic Waltz: both skulls in frame, the lady's gown arsenic green, DRESSED TO KILL.
//   B · the ballroom silhouette, tight on the green gown: DEADLY GREEN.
//   C · Kedzie's book: the poison-green cover on the desk with green leaves fanned: DO NOT TOUCH.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Wordmark} from './kit/Intro';
import {Finish, Highlight, Note, PALETTES, PaletteCtx} from './kit/Kit';
import {DarkPaper} from './kit/common';
import {Sil} from './kit/dk';
import {WaltzShot} from './kit/waltz';

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
    <AbsoluteFill style={{background: '#000'}}>
      {children}
      <Finish vignette={0.35} />
      <Logo />
    </AbsoluteFill>
  </PaletteCtx.Provider>
);

/** Hide the source tag at thumbnail size. */
const NoTag: React.FC = () => <style>{'div[style*="IBM Plex Mono"][style*="uppercase"]{display:none}'}</style>;

export const ThumbA: React.FC = () => (
  <Frame>
    <WaltzShot fx={1487} fy={1000} z0={1.0} z1={1.0} a={0} b={1} green={0} shade>{() => null}</WaltzShot>
    <NoTag />
    <Highlight text="DRESSED" x={90} y={700} size={170} at={0} seed={901} rot={-3} />
    <Highlight text="TO KILL" x={160} y={880} size={150} at={0} seed={903} rot={-2} />
  </Frame>
);

export const ThumbB: React.FC = () => (
  <Frame>
    <Sil name="g_ballroom" file="ch03_ballroom_1862.jpg" label="" a={0} b={1} fx={0.56} fy={0.62} z={[1.75, 1.75]} effects={[]} />
    <NoTag />
    <Highlight text="DEADLY" x={60} y={300} size={150} at={0} seed={911} rot={-3} />
    <Highlight text="GREEN" x={90} y={480} size={150} at={0} seed={913} rot={-2} />
  </Frame>
);

export const ThumbC: React.FC = () => (
  <Frame>
    <DarkPaper />
    {['n110', 'n126', 'n048'].map((n, i) => (
      <Img key={n} src={staticFile(`img/ch01/kedzie_specimen_${n}.jpg`)} style={{position: 'absolute', left: 1180 + i * 150, top: 170 + i * 60, width: 420, height: 560, objectFit: 'cover',
        transform: `rotate(${[8, -4, 12][i]}deg)`, boxShadow: '0 18px 34px rgba(0,0,0,0.6)', border: '14px solid #f4efe6'}} />
    ))}
    <Img src={staticFile('img/ch01/kedzie_cover_green_label_crop_1874.jpg')} style={{position: 'absolute', left: 700, top: 120, width: 720, height: 720, objectFit: 'cover',
      transform: 'rotate(-5deg)', boxShadow: '0 24px 44px rgba(0,0,0,0.7)', border: '18px solid #f4efe6'}} />
    <Highlight text="DO NOT" x={80} y={560} size={170} at={0} seed={921} rot={-3} />
    <Highlight text="TOUCH" x={110} y={760} size={190} at={0} seed={923} rot={-2} />
    <Note text="a library book, 1874" x={110} y={960} size={60} rot={-3} at={0} color="#ffffff" />
  </Frame>
);
