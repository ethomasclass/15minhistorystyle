// MOCKUP (storyboard stills, no voice yet): a custom Short written for the vertical feed, not spliced from the chapters.
//   "How to Sell Dirt for $18 Million": a heist recipe in five steps, the twist (the step they couldn't control), the payoff line,
//   and a loop back to the cover. Each panel below is one beat of the draft script in review/shorts/Heist_Short_mockup.md.
// The look is the channel's (dark notebook, coral subject + teal trace, orange tape, teal handwriting, 12 fps steps), adapted for
// a phone: the picture fills the frame top to bottom, a step rail at the top is the running device, the captions carry the
// key word on orange tape, and type on the cover is big enough to read at thumbnail size.
// Safe zones as in vshorts.tsx: YouTube's UI covers the top ~150 px, the bottom ~400 px and the right ~150 px below y 900.
import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile} from 'remotion';
import {Finish, Highlight, JF, Note, PALETTES, PaletteCtx, StepCtx, Tag} from './kit/Kit';
import {DarkPaper} from './kit/common';
import {Stamp} from './kit/shell';
import {Prop} from './kit/prop';
import {maskRef} from './kit/maskref';
import {BareStageCtx} from './fx/terrain/drawn3d';
import {AnthillCutaway} from './fx/AnthillCutaway';
import {Lamp, Print} from './ch/ch04/bits';
import {Mark, V3D, VSil} from './vshorts';
import {ColdOpenDepth} from './fx/ColdOpenDepth';
import sfL from '../public/img/layers/sil/sil_sf_night/layers.json';
import saltL from '../public/img/layers/sil/sil_salting/layers.json';
import kingMask from '../public/img/masks/king.json';
import tiffanyMask from '../public/img/masks/ch04_tiffany.json';

const TEAL = '#2FE0C4';
const ORANGE = '#FF9F1C';
const CREAM = '#f4efe6';
const WHITE = '#ffffff';
const TAG_Y = 1490;
/** Frames per storyboard panel; stills are taken at PANEL - 4 so every write-on has finished. */
export const PANEL = 40;

/** The running device: STEP n on tape, five dots (done = teal, now = orange, to come = outline), the step's name in teal. */
const Rail: React.FC<{n: number; name?: string; twist?: boolean}> = ({n, name, twist}) => (
  <>
    <Highlight text={twist ? 'STEP 6?' : `STEP ${n}`} x={56} y={166} size={76} at={0} seed={110 + n} rot={-2} />
    <div style={{position: 'absolute', left: 420, top: 196, display: 'flex', gap: 22}}>
      {[1, 2, 3, 4, 5].map((k) => (
        <div key={k} style={{width: 34, height: 34, borderRadius: '50%', border: `4px solid ${k < n || twist ? TEAL : k === n ? ORANGE : 'rgba(244,239,230,0.45)'}`,
          background: k < n || twist ? TEAL : k === n ? ORANGE : 'transparent', boxShadow: '0 3px 8px rgba(0,0,0,0.6)'}} />
      ))}
    </div>
    {name && <Note text={name} x={66} y={268} size={66} rot={-2} at={2} color={twist ? ORANGE : TEAL} />}
  </>
);

/** Captions for the feed: two to four words, cream, with the key word set on a strip of orange tape. */
const TapeCaption: React.FC<{words: string; hot: string; y?: number}> = ({words, hot, y = 1200}) => (
  <div style={{position: 'absolute', left: 50, width: 880, top: y, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '6px 22px'}}>
    {words.split(' ').map((w, k) => w === hot ? (
      <span key={k} style={{fontFamily: JF.sans, fontWeight: 800, fontSize: 96, lineHeight: 1.15, textTransform: 'uppercase', color: '#15120d',
        background: ORANGE, padding: '0 18px', transform: 'rotate(-2deg)', display: 'inline-block', boxShadow: '0 6px 0 #0d0c09',
        clipPath: 'polygon(1% 6%, 99% 0, 100% 52%, 98% 100%, 2% 95%, 0 45%)'}}>{w}</span>
    ) : (
      <span key={k} style={{fontFamily: JF.sans, fontWeight: 800, fontSize: 96, lineHeight: 1.15, textTransform: 'uppercase', color: CREAM,
        textShadow: '0 5px 0 #0d0c09, 0 0 18px rgba(0,0,0,0.95)'}}>{w}</span>
    ))}
  </div>
);

/** The dark band the captions sit on, so they read over a full-height painting. */
const Band: React.FC = () => (
  <div style={{position: 'absolute', left: 0, top: 1110, width: 1080, height: 420,
    background: 'linear-gradient(180deg, rgba(8,7,5,0) 0%, rgba(8,7,5,0.8) 28%, rgba(8,7,5,0.8) 78%, rgba(8,7,5,0) 100%)'}} />
);

const Desk: React.FC<{lamp?: number}> = ({lamp = 760}) => (
  <>
    <DarkPaper />
    <Lamp x={540} y={lamp} r={720} a={0.15} />
  </>
);

const TIFFANY = maskRef('ch04_tiffany', tiffanyMask);
const KING = maskRef('king', kingMask);

/** The whole H1 picture (drawn at 1920x1080) across the frame's width: both cousins and the tycoon between them. */
const H1Wide: React.FC<{top: number; drain?: boolean}> = ({top, drain}) => (
  <div style={{position: 'absolute', left: 0, top, width: 1920, height: 1080, transform: 'scale(0.5625)', transformOrigin: '0 0', overflow: 'hidden'}}>
    <ColdOpenDepth cam={[{f: 0, d: 0, x: 0, y: 0}, {f: 200, d: 30, x: 0, y: 8}]} drainAt={drain ? 0 : undefined} />
  </div>
);

/** Panel 0, the cover (frame 0 of the Short): the H1 picture with the claim in big tape, readable with the sound off. */
const Cover: React.FC<{end?: boolean}> = ({end}) => (
  <AbsoluteFill>
    <DarkPaper />
    <H1Wide top={end ? 560 : 580} drain={end} />
    {end ? (
      <>
        <Highlight text="THEY SOLD" x={90} y={170} size={128} at={0} seed={131} rot={-3} />
        <Highlight text="DIRT." x={230} y={330} size={250} at={2} seed={132} rot={-2} />
      </>
    ) : (
      <>
        <Highlight text="HOW TO SELL" x={70} y={160} size={124} at={-30} seed={121} rot={-3} />
        <Highlight text="DIRT" x={250} y={320} size={250} at={-30} seed={122} rot={-2} />
        <Highlight text="FOR $18 MILLION" x={60} y={1215} size={108} at={-30} seed={123} rot={-2} />
        <Note text="(it worked)" x={560} y={1370} size={72} rot={-4} at={-30} color={TEAL} />
      </>
    )}
  </AbsoluteFill>
);

type P = {words: string; hot: string; band?: boolean; node: React.ReactNode};
const PANELS: P[] = [
  {words: '', hot: '', node: <Cover />},
  {words: 'cheap rejects nobody wanted', hot: 'rejects', node: (
    <AbsoluteFill>
      <Desk lamp={700} />
      <Prop name="rough_rubies" x={90} y={420} w={560} rot={-6} at={0} coral trace from="none" />
      <Prop name="rough_diamond" x={520} y={560} w={420} rot={8} at={1} coral trace from="none" />
      <Note text="bought in London," x={110} y={930} size={62} rot={-2} at={3} color={WHITE} />
      <Note text="under fake names" x={300} y={1010} size={62} rot={-2} at={4} color={WHITE} />
      <Rail n={1} name="buy the bait" />
    </AbsoluteFill>
  )},
  {words: 'refuse to say where', hot: 'where', band: true, node: (
    <AbsoluteFill>
      <VSil name="sil_sf_night" size={sfL.size} glowLayer={sfL.glowLayer} a={-20} b={60} fx={[0.47, 0.5]} z={[1.06, 1.1]} />
      <Prop name="leather_pouch" x={330} y={640} w={420} rot={-4} at={2} coral trace from="none" />
      <Rail n={2} name="play hard to get" />
      <Tag text="Illustration · San Francisco, late at night" y={TAG_Y} />
    </AbsoluteFill>
  )},
  {words: 'Tiffany called them a fortune', hot: 'Tiffany', node: (
    <AbsoluteFill>
      <Desk />
      <Print src="img/ch04/tiffany_charles_engraving_1893.jpg" size={[1497, 2199]} crop={[80, 30, 1340, 1000]} x={90} y={360} w={900} h={620} rot={-1.5} at={0} mask={TIFFANY} traceAt={0} />
      <Note text={'"precious stones of'} x={90} y={985} size={60} rot={-2} at={3} color={WHITE} />
      <Note text={'enormous value"'} x={330} y={1050} size={60} rot={-2} at={4} color={WHITE} />
      <Rail n={3} name="borrow someone's trust" />
      <Tag text="Charles L. Tiffany and the House of Tiffany & Co., 1893" y={TAG_Y} />
    </AbsoluteFill>
  )},
  {words: 'even into anthills', hot: 'anthills', band: true, node: (
    <AbsoluteFill>
      <VSil name="sil_salting" size={saltL.size} glowLayer={saltL.glowLayer} a={-20} b={60} fx={[0.46, 0.52]} z={[1.06, 1.12]} />
      <Rail n={4} name="make a mine" />
      <Tag text="Illustration · salting the field" y={TAG_Y} />
    </AbsoluteFill>
  )},
  {words: 'take the money and leave', hot: 'leave', node: (
    <AbsoluteFill>
      <Desk />
      <Prop name="banknotes_stack" x={120} y={560} w={600} rot={-5} at={0} coral trace from="none" />
      <Prop name="slouch_hat" x={560} y={760} w={400} rot={10} at={1} from="none" />
      <Stamp text="$18 MILLION" x={80} y={400} at={2} size={130} color={ORANGE} rot={-4} />
      <Note text="today's money" x={560} y={1010} size={58} rot={-3} at={3} color={TEAL} />
      <Rail n={5} name="get out in time" />
    </AbsoluteFill>
  )},
  {words: 'it was too perfect', hot: 'perfect', node: (
    <AbsoluteFill>
      <Desk />
      <Print src="img/ch07/king_clarence_age27_c1869.jpg" size={[923, 1536]} crop={[0, 90, 923, 1055]} x={250} y={370} w={580} h={640} rot={1.5} at={0} mask={KING} traceAt={0} />
      <Note text="a government geologist" x={170} y={1030} size={60} rot={-2} at={3} color={WHITE} />
      <Rail n={6} name="the one they couldn't plan" twist />
      <Tag text="Clarence King, c. 1869 · Library of Congress" y={TAG_Y} />
    </AbsoluteFill>
  )},
  {words: 'only next to boot prints', hot: 'boot', node: (
    <AbsoluteFill>
      <V3D x={-692} y={-6} s={1.4}>
        <AnthillCutaway at={-400} sliceAt={-380} rubyAt={-330} printsAt={-300} compareAt={1e7} labels={false} />
      </V3D>
      <Highlight text="NATURE IS" x={70} y={170} size={116} at={0} seed={141} rot={-3} />
      <Highlight text="NOT THAT TIDY." x={60} y={320} size={116} at={2} seed={142} rot={-2} />
      <Tag text="Cut-away · ruby enlarged" y={TAG_Y} />
    </AbsoluteFill>
  )},
  {words: "they'd sold dirt", hot: 'dirt', node: <Cover end />},
  {words: '', hot: '', node: (
    <AbsoluteFill>
      <Desk lamp={640} />
      <Highlight text="MORE HISTORY" x={80} y={250} size={118} at={0} seed={151} rot={-3} />
      <Highlight text="LIKE THIS?" x={150} y={410} size={118} at={2} seed={152} rot={-2} />
      <Img src={staticFile('img/brand/chunk-history-mark.svg')} style={{position: 'absolute', left: 380, top: 640, width: 320, height: 320}} />
      <Note text="like →" x={700} y={900} size={70} rot={-6} at={4} color={TEAL} />
      <Note text="the full con, linked below ↓" x={90} y={1130} size={62} rot={-2} at={5} color={WHITE} />
      <Note text="subscribe ↓" x={470} y={1330} size={70} rot={-4} at={6} color={ORANGE} />
    </AbsoluteFill>
  )},
];

export const HEIST_BOARD_FRAMES = PANELS.length * PANEL;

/** The storyboard: one panel per beat, each held PANEL frames. */
export const HeistBoard: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <BareStageCtx.Provider value>
        <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
          {PANELS.map((p, i) => (
            <Sequence key={i} from={i * PANEL} durationInFrames={PANEL} layout="none">
              <AbsoluteFill>
                {p.node}
                {p.words && <Band />}
                {p.words && <TapeCaption words={p.words} hot={p.hot} />}
              </AbsoluteFill>
            </Sequence>
          ))}
          <Mark />
          <Finish vignette={0.35} />
        </AbsoluteFill>
      </BareStageCtx.Provider>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
