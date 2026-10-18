// Square (1080x1080) image for a YouTube Community post: the Flow mummy-on-scale art, the wordmark and a tape title.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Finish, Highlight, Note, PALETTES, PaletteCtx, StepCtx} from './kit/Kit';
import {Wordmark} from './kit/Intro';

export const CommunitySpooky: React.FC = () => {
  const w = 1080, h = (1376 * 1080) / 768;
  const s = 0.26;
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <StepCtx.Provider value={2.5}>
        <AbsoluteFill style={{background: '#120e0b', overflow: 'hidden'}}>
          <Img src={staticFile('img/ai/short1_cover_mummy_scale.jpg')} style={{position: 'absolute', left: 0, top: -170, width: w, height: h}} />
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(18,14,11,0.55) 0%, rgba(18,14,11,0) 18%, rgba(18,14,11,0) 52%, rgba(18,14,11,0.92) 74%)'}} />
          <div style={{position: 'absolute', left: 36, top: 30, width: 1440 * s, height: 530 * s, overflow: 'hidden', borderRadius: 14, background: 'rgba(13,12,9,0.78)'}}>
            <div style={{position: 'absolute', left: -170 * s, top: -275 * s, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: '0 0'}}>
              <Wordmark clockAt={-90} numAt={-90} minAt={-90} hisAt={-90} />
            </div>
          </div>
          <Highlight text="SPOOKY SEASON" x={60} y={790} size={118} at={-40} seed={401} rot={-3} />
          <Note text="weird history, all October 🎃" x={90} y={950} size={58} rot={-3} at={-40} />
          <Finish vignette={0.3} />
        </AbsoluteFill>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};
