// The main video's thumbnail: the split teal/coral eel -> plate image (projects/Thanksgiving/thumbnail/make_thumb.py) with
// "1621" and "NOW" in the channel's torn orange tape. Rendered as a still: npx remotion still src/index.ts ThumbEels-B out.png
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Highlight, PALETTES, PaletteCtx} from './kit/Kit';

export const ThumbEels: React.FC<{variant: 'A' | 'B'}> = ({variant}) => (
  <AbsoluteFill>
    <Img src={staticFile(`thumb/thumb_${variant === 'A' ? 'A_vertical' : 'B_diagonal'}_1920.png`)} style={{width: 1920, height: 1080}} />
    {/* the channel's torn orange tape (the locked palette), with the thin ink edge the coral desk uses */}
    <PaletteCtx.Provider value={{...PALETTES.locked, edge: '#0D0C09'}}>
      <Highlight text="1621" x={170} y={42} size={170} at={-200} seed={21} rot={-4} />
      <Highlight text="NOW" x={1330} y={42} size={170} at={-200} seed={22} rot={3} />
    </PaletteCtx.Provider>
  </AbsoluteFill>
);
