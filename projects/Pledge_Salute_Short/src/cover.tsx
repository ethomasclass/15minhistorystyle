// Hook cover: the first 1.5 s, fully drawn from frame 0 so it can be picked as the Shorts cover.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Highlight, Loop as Ring, PALETTES, PaletteCtx, StepCtx, usePal} from './kit/Kit';
import {Arch, Desk} from './kit/bs';
import {hasFile} from './kit/shell';
import {SaluteFigure} from './salute';
import {IMG} from './images';

export const Cover: React.FC<{at?: number}> = ({at = 0}) => {
  const pal = usePal();
  const P = IMG.photo1942;
  const body = (
    <>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,7,5,0.55) 0%, rgba(8,7,5,0.1) 35%, rgba(8,7,5,0.15) 60%, rgba(8,7,5,0.8) 100%)'}} />
      <Highlight text="AMERICAN KIDS," x={60} y={250} size={118} at={at} seed={71} rot={-3} />
      <Highlight text="1942" x={100} y={420} size={150} at={at + 3} seed={72} rot={-2} />
      <Ring cx={600} cy={760} rx={360} ry={170} at={at + 4} dur={8} width={8} seed={7} color={pal.subject} />
    </>
  );
  if (!hasFile(P.src)) {
    return <Desk a={0}><SaluteFigure x={300} y={650} h={600} at={at - 30} from="salute" to="salute" />{body}</Desk>;
  }
  return <Arch src={P.src} tag="" a={0} b={45} z={[1.05, 1.05]} pos={P.pos}>{body}</Arch>;
};

export const CoverStill: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <AbsoluteFill style={{background: '#0d0c09'}}>
        <Cover at={-40} />
      </AbsoluteFill>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
