// Hook covers: a bold title frame for the first ~1.5 s of the Short, so it can be picked as the Shorts cover
// (and exported as a still for a custom thumbnail). Key text stays in the middle band (y ~250–1300) because feeds
// crop the cover. `at` is when it starts drawing; by `at + 12` it is complete.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Highlight, Note, PALETTES, PaletteCtx, StepCtx, usePal} from './kit/Kit';
import {Stamp} from './kit/shell';
import {Arch, Desk, DropCard, LOOK} from './kit/bs';
import {IMG} from './images';

export type CoverId = 'A' | 'B' | 'C';

const Shade: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,7,5,0.55) 0%, rgba(8,7,5,0.15) 35%, rgba(8,7,5,0.15) 55%, rgba(8,7,5,0.7) 100%)'}} />
);

export const Cover: React.FC<{id: CoverId; at?: number}> = ({id, at = 0}) => {
  const pal = usePal();
  if (id === 'A') {
    // the crowd, full frame: "20,000 CAME TO WATCH"
    return (
      <Arch src={IMG.crowd.src} tag="" a={0} b={45} z={[1.06, 1.06]}>
        <Shade />
        <Note text="Kentucky, 1936" x={120} y={470} size={80} rot={-4} at={at} color="#ffffff" />
        <Stamp text="20,000" x={70} y={600} at={at + 2} size={290} color={pal.subject} rot={-4} />
        <Highlight text="CAME TO WATCH" x={70} y={930} size={118} at={at + 5} seed={91} rot={-3} />
      </Arch>
    );
  }
  if (id === 'B') {
    // the 1936 clipping: "AMERICA'S LAST PUBLIC EXECUTION"
    return (
      <Desk a={0}>
        <Highlight text="AMERICA'S LAST" x={60} y={290} size={108} at={at} seed={92} rot={-3} />
        <Highlight text="PUBLIC EXECUTION" x={60} y={440} size={100} at={at + 3} seed={93} rot={-2} />
        <DropCard src={IMG.thompson.src} x={330} y={620} w={420} rot={-3} at={at - 30} filter={LOOK.doc} />
        <Stamp text="1936" x={770} y={700} at={at + 6} size={120} color={pal.subject} rot={-8} />
      </Desk>
    );
  }
  // C: the faces in the crowd: "THEY CAME TO WATCH"
  return (
    <Arch src={IMG.faces.src} tag="" a={0} b={45} z={[1.15, 1.15]} pos="55% 100%">
      <Shade />
      <Highlight text="THEY CAME" x={70} y={330} size={140} at={at} seed={94} rot={-3} />
      <Highlight text="TO WATCH" x={120} y={520} size={140} at={at + 3} seed={95} rot={-2} />
      <Note text="20,000 people · 1936" x={120} y={1440} size={80} rot={-4} at={at + 6} color="#ffffff" />
    </Arch>
  );
};

/** A still of one cover, for review and as a custom thumbnail. */
export const CoverStill: React.FC<{id: CoverId}> = ({id}) => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <AbsoluteFill style={{background: '#0d0c09'}}>
        <Cover id={id} at={-40} />
      </AbsoluteFill>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
