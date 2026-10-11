// Hook covers: a bold title frame for the first ~1.5 s of the Short, so it can be picked as the Shorts cover
// (and exported as a still for a custom thumbnail). Key text stays in the middle band (y ~250–1300) because feeds
// crop the cover. `at` is when it starts drawing; by `at + 12` it is complete.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Highlight, Note, PALETTES, PaletteCtx, StepCtx, usePal} from './kit/Kit';
import {Stamp} from './kit/shell';
import {Arch, Desk, DropCard, LOOK} from './kit/bs';
import {PhoneWide, ScreenStill} from './kit/vshort';
import {IMG} from './images';

export type CoverId = 'A' | 'B' | 'C';

const Shade: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,7,5,0.6) 0%, rgba(8,7,5,0.1) 35%, rgba(8,7,5,0.1) 55%, rgba(8,7,5,0.75) 100%)'}} />
);

export const Cover: React.FC<{id: CoverId; at?: number}> = ({id, at = 0}) => {
  const pal = usePal();
  if (id === 'A') {
    // the clip in the phone, stamped: "YOU REMEMBER THIS? IT NEVER EXISTED"
    return (
      <Desk a={0}>
        <Highlight text="YOU REMEMBER THIS?" x={50} y={300} size={92} at={at} seed={91} rot={-3} />
        <PhoneWide x={50} y={470} w={980} at={at - 30}>
          {(sw, sh) => <ScreenStill src="video/ai_clip_shush.jpg" sw={sw} sh={sh} />}
        </PhoneWide>
        <Stamp text="NEVER EXISTED" x={80} y={1110} at={at + 6} size={118} color={pal.subject} rot={-4} />
      </Desk>
    );
  }
  if (id === 'B') {
    // real vs fake: the 1987 poster and the AI frame
    return (
      <Desk a={0}>
        <Highlight text="ONE IS FAKE" x={150} y={290} size={120} at={at} seed={92} rot={-3} />
        <DropCard src={IMG.poster.src} x={60} y={500} w={430} rot={-4} at={at - 30} filter={LOOK.card} />
        <DropCard src="video/ai_clip_shush.jpg" x={520} y={600} w={500} rot={4} at={at - 30} filter={LOOK.card} />
        <Stamp text="1987" x={120} y={1100} at={at + 4} size={120} color={pal.mark} rot={-4} />
        <Stamp text="2026" x={640} y={1060} at={at + 6} size={120} color={pal.subject} rot={5} />
      </Desk>
    );
  }
  // C: the shush, full frame: "THIS MOVIE NEVER EXISTED"
  return (
    <Arch src="video/ai_clip_shush.jpg" tag="" a={0} b={45} z={[1.0, 1.0]} pos="42% 40%" look="card">
      <Shade />
      <Highlight text="THIS MOVIE" x={70} y={300} size={140} at={at} seed={94} rot={-3} />
      <Highlight text="NEVER EXISTED" x={70} y={480} size={120} at={at + 3} seed={95} rot={-2} />
      <Note text="Rumpelstiltskin (1987)?" x={100} y={1440} size={78} rot={-4} at={at + 6} color="#ffffff" />
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
