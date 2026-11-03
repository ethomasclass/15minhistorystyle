// MOCKUP (storyboard stills, no voice yet): a custom Short written for the vertical feed, not spliced from the chapters.
//   "How to Sell Dirt for $18 Million": a heist recipe in five steps, the twist (the step they couldn't control), the payoff line,
//   and a loop back to the cover. Each panel below is one beat of the draft script in review/shorts/Heist_Short_mockup.md.
// The look is the channel's (dark notebook, coral subject + teal trace, orange tape, teal handwriting, 12 fps steps), composed for
// a tall frame: every picture runs top to bottom, a step rail at the top is the running device, the captions carry the key word
// on orange tape, and the cover restacks the H1 picture vertically (the tycoon in the middle, the cousins in the foreground).
// YouTube's UI covers the top ~150 px, the bottom ~400 px and the right ~150 px below y 900: no TEXT there, but the pictures run
// on underneath it to the frame's edge.
import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile} from 'remotion';
import {Finish, Highlight, JF, Note, PALETTES, PaletteCtx, Picture, type Place, StepCtx, Traced} from './kit/Kit';
import {DarkPaper} from './kit/common';
import {Stamp} from './kit/shell';
import {Prop} from './kit/prop';
import {maskRef} from './kit/maskref';
import {MASKS} from './masks';
import {BareStageCtx} from './fx/terrain/drawn3d';
import {AnthillCutaway} from './fx/AnthillCutaway';
import {Cousin, cut, SIZE, stoneMask, TintLayer} from './fx/ColdOpenDepth';
import {Lamp, Print} from './ch/ch04/bits';
import {Mark, V3D, VSil} from './vshorts';
import sfL from '../public/img/layers/sil/sil_sf_night/layers.json';
import saltL from '../public/img/layers/sil/sil_salting/layers.json';
import kingMask from '../public/img/masks/king.json';
import tiffanyMask from '../public/img/masks/ch04_tiffany.json';

const TEAL = '#2FE0C4';
const ORANGE = '#FF9F1C';
const CREAM = '#f4efe6';
const WHITE = '#ffffff';
/** Captions sit in the lower middle, the band behind them; source tags just above YouTube's bottom UI. */
const CAP_Y = 1290;
const TAG_Y = 1500;
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
const TapeCaption: React.FC<{words: string; hot: string; y?: number}> = ({words, hot, y = CAP_Y}) => (
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

/** A soft dark band behind the captions, so they read over any picture without boxing it. */
const Band: React.FC = () => (
  <div style={{position: 'absolute', left: 0, top: CAP_Y - 90, width: 1080, height: 360,
    background: 'linear-gradient(180deg, rgba(8,7,5,0) 0%, rgba(8,7,5,0.7) 30%, rgba(8,7,5,0.7) 70%, rgba(8,7,5,0) 100%)'}} />
);

/** Source tag on a small dark pill: on a full-height print the plain tag's cream text vanishes over the white paper. */
const VTag: React.FC<{text: string; y?: number}> = ({text, y = TAG_Y}) => (
  <div style={{position: 'absolute', left: 40, top: y, padding: '6px 12px', borderRadius: 6, background: 'rgba(13,12,9,0.78)', fontFamily: JF.mono, fontSize: 18,
    letterSpacing: 1, color: 'rgba(255,255,255,0.88)', textTransform: 'uppercase'}}>{text}</div>
);

const Desk: React.FC<{lamp?: number}> = ({lamp = 900}) => (
  <>
    <DarkPaper />
    <Lamp x={540} y={lamp} r={900} a={0.15} />
  </>
);

const TIFFANY = maskRef('ch04_tiffany', tiffanyMask);
const KING = maskRef('king', kingMask);

// ---------------------------------------------------------------------------------------------
// Cover candidates: frame 0 of the Short, and the frame picked as its thumbnail. Tested at feed size in review/shorts/.

/** The tycoon alone, traced, at any place and scale; `tint` 1 = coral, near 0 = drained to grey. */
const Tycoon: React.FC<{at: Place; tint?: number}> = ({at, tint = 1}) => {
  const t = MASKS.tycoon_b.alpha;
  return (
    <>
      <div style={{position: 'absolute', left: at.left, top: at.top, width: SIZE[0] * at.scale, height: SIZE[1] * at.scale, ...cut(t),
        filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))'}}>
        <Picture src="img/gen/thumb/tycoon_b_clean.png" place={{left: 0, top: 0, scale: at.scale}} size={SIZE} bw="grayscale(1) contrast(1.15) brightness(1.02)" />
      </div>
      <TintLayer place={at} mask={stoneMask(t, false)} strength={tint} />
      <TintLayer place={at} mask={stoneMask(t, true)} strength={tint} />
      <Traced paths={MASKS.tycoon_b.data.shapes.subject} place={at} at={-999} dur={1} width={8} />
    </>
  );
};

/** A · HOW TO SELL DIRT: the face bigger than the first cover, the stone in his hand next to the price, the cousins in front. */
const CoverA: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Lamp x={560} y={900} r={760} a={0.18} />
    <Tycoon at={{left: -200, top: 520, scale: 1.15}} />
    <div style={{position: 'absolute', inset: 0, filter: 'blur(1px)'}}>
      <Cousin mask={MASKS.cousin_l.alpha} at={{left: -300, top: 1050, scale: 1.4}} />
      <Cousin mask={MASKS.cousin_r.alpha} at={{left: -700, top: 1050, scale: 1.4}} />
    </div>
    <Highlight text="HOW TO SELL" x={70} y={150} size={128} at={-30} seed={121} rot={-3} />
    <Highlight text="DIRT" x={240} y={300} size={270} at={-30} seed={122} rot={-2} />
    <Highlight text="$18 MILLION" x={60} y={1190} size={112} at={-30} seed={124} rot={-3} />
  </AbsoluteFill>
);

/** B · REAL DIAMONDS. FAKE MINE.: the video's paradox in four words, one giant coral stone over the salted mesa at night. */
const CoverB: React.FC = () => (
  <AbsoluteFill>
    <VSil name="sil_salting" size={saltL.size} glowLayer={saltL.glowLayer} a={-20} b={60} fx={[0.5, 0.5]} z={[1.06, 1.06]} />
    <AbsoluteFill style={{background: 'rgba(8,7,5,0.6)'}} />
    <Lamp x={540} y={930} r={560} a={0.22} />
    <Prop name="rough_diamond" x={150} y={540} w={780} rot={-6} at={-30} coral trace from="none" />
    <Highlight text="REAL DIAMONDS." x={50} y={170} size={104} at={-30} seed={161} rot={-3} />
    <Highlight text="FAKE MINE." x={60} y={1260} size={150} at={-30} seed={162} rot={-2} />
  </AbsoluteFill>
);

/**
 * C · the reaction (the chosen cover): the tycoon's shocked face filling the width, the price and the question above and below.
 * `end` is the loop frame: the same close-up drained to grey, and the question answered ("FOR DIRT."), so a replay snaps
 * straight back to the coral face and the "?". In the Short the bottom tape is the caption for those beats.
 */
const CoverC: React.FC<{end?: boolean}> = ({end}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Lamp x={540} y={800} r={760} a={0.2} />
    <Tycoon at={{left: -1000, top: 300, scale: 2.5}} tint={end ? 0.12 : 1} />
    <Highlight text="$18 MILLION" x={70} y={160} size={150} at={-30} seed={171} rot={-3} />
    <Highlight text={end ? 'FOR DIRT.' : 'FOR DIRT?'} x={60} y={1260} size={160} at={-30} seed={172} rot={-2} />
  </AbsoluteFill>
);

const COVERS = [CoverA, CoverB, CoverC];
export const HEIST_COVER_FRAMES = COVERS.length;

/** One cover per frame (0 = A, 1 = B, 2 = C). */
export const HeistCovers: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <BareStageCtx.Provider value>
        <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
          {COVERS.map((C, i) => (
            <Sequence key={i} from={i} durationInFrames={1} layout="none"><C /></Sequence>
          ))}
          <Mark />
          <Finish vignette={0.35} />
        </AbsoluteFill>
      </BareStageCtx.Provider>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);

type P = {words: string; hot: string; node: React.ReactNode};
const PANELS: P[] = [
  {words: '', hot: '', node: <CoverC />},
  {words: 'cheap rejects nobody wanted', hot: 'rejects', node: (
    <AbsoluteFill>
      <Desk lamp={820} />
      <Prop name="rough_rubies" x={40} y={400} w={660} rot={-6} at={0} coral trace from="none" />
      <Prop name="rough_diamond" x={540} y={600} w={500} rot={8} at={1} coral trace from="none" />
      <Note text="bought in London," x={90} y={1040} size={60} rot={-2} at={3} color={WHITE} />
      <Note text="under fake names" x={300} y={1115} size={60} rot={-2} at={4} color={WHITE} />
      {/* the rest of the reject pile runs off the bottom of the frame, under YouTube's overlay */}
      <Prop name="stone_pile" x={-60} y={1440} w={1200} rot={-3} at={0} from="none" />
      <Rail n={1} name="buy the bait" />
    </AbsoluteFill>
  )},
  {words: 'refuse to say where', hot: 'where', node: (
    <AbsoluteFill>
      <VSil name="sil_sf_night" size={sfL.size} glowLayer={sfL.glowLayer} a={-20} b={60} fx={[0.47, 0.5]} z={[1.06, 1.1]} />
      <Prop name="leather_pouch" x={300} y={620} w={480} rot={-4} at={2} coral trace from="none" />
      <Rail n={2} name="play hard to get" />
      <VTag text="Illustration · San Francisco, late at night" y={TAG_Y} />
    </AbsoluteFill>
  )},
  {words: 'Tiffany called them a fortune', hot: 'Tiffany', node: (
    <AbsoluteFill>
      <Desk />
      {/* the whole engraving, top of the head to the bottom of the frame */}
      <Print src="img/ch04/tiffany_charles_engraving_1893.jpg" size={[1497, 2199]} crop={[60, 20, 1437, 2199]} x={20} y={350} w={1040} h={1645} rot={-1} at={0} mask={TIFFANY} traceAt={0} />
      <Note text={'"precious stones of'} x={70} y={1040} size={58} rot={-2} at={3} color={WHITE} />
      <Note text={'enormous value"'} x={330} y={1112} size={58} rot={-2} at={4} color={WHITE} />
      <Rail n={3} name="borrow someone's trust" />
      <VTag text="Charles L. Tiffany and the House of Tiffany & Co., 1893" y={TAG_Y} />
    </AbsoluteFill>
  )},
  {words: 'even into anthills', hot: 'anthills', node: (
    <AbsoluteFill>
      <VSil name="sil_salting" size={saltL.size} glowLayer={saltL.glowLayer} a={-20} b={60} fx={[0.46, 0.52]} z={[1.06, 1.12]} />
      <Rail n={4} name="make a mine" />
      <VTag text="Illustration · salting the field" y={TAG_Y} />
    </AbsoluteFill>
  )},
  {words: 'take the money and leave', hot: 'leave', node: (
    <AbsoluteFill>
      <Desk lamp={860} />
      <Stamp text="$18 MILLION" x={80} y={380} at={2} size={130} color={ORANGE} rot={-4} />
      <Prop name="banknotes_stack" x={60} y={560} w={760} rot={-5} at={0} coral trace from="none" />
      <Note text="in today's money" x={520} y={1100} size={58} rot={-3} at={3} color={TEAL} />
      {/* the hat on its way out of frame, bottom right */}
      <Prop name="slouch_hat" x={420} y={1430} w={760} rot={12} at={1} from="none" />
      <Rail n={5} name="get out in time" />
    </AbsoluteFill>
  )},
  {words: 'it was too perfect', hot: 'perfect', node: (
    <AbsoluteFill>
      <Desk />
      {/* the whole seated portrait, filling the frame below the rail */}
      <Print src="img/ch07/king_clarence_age27_c1869.jpg" size={[923, 1536]} crop={[0, 40, 923, 1536]} x={40} y={390} w={1000} h={1620} rot={1} at={0} mask={KING} traceAt={0} />
      <Note text="a government geologist" x={90} y={1110} size={60} rot={-2} at={3} color={WHITE} />
      <Rail n={6} name="the one they couldn't plan" twist />
      <VTag text="Clarence King, c. 1869 · Library of Congress" y={TAG_Y} />
    </AbsoluteFill>
  )},
  {words: 'only next to boot prints', hot: 'boot', node: (
    <AbsoluteFill>
      {/* the cut-away scaled up so the hill and the boot prints fill the frame top to bottom */}
      <V3D x={-1180} y={-90} s={2.0}>
        <AnthillCutaway at={-400} sliceAt={-380} rubyAt={-330} printsAt={-300} compareAt={1e7} labels={false} />
      </V3D>
      <Highlight text="NATURE IS" x={70} y={170} size={116} at={0} seed={141} rot={-3} />
      <Highlight text="NOT THAT TIDY." x={60} y={320} size={116} at={2} seed={142} rot={-2} />
      <VTag text="Cut-away · ruby enlarged" y={TAG_Y} />
    </AbsoluteFill>
  )},
  {words: '', hot: '', node: <CoverC end />},
  {words: '', hot: '', node: (
    <AbsoluteFill>
      <Desk lamp={900} />
      <Highlight text="MORE HISTORY" x={80} y={200} size={118} at={0} seed={151} rot={-3} />
      <Highlight text="LIKE THIS?" x={150} y={360} size={118} at={2} seed={152} rot={-2} />
      {/* the full video, as a card on the desk: the thing the Related video link opens */}
      <div style={{position: 'absolute', left: 60, top: 560, width: 680, height: 382, transform: 'rotate(-2deg)', border: `6px solid ${TEAL}`, borderRadius: 10,
        overflow: 'hidden', boxShadow: '0 24px 40px rgba(0,0,0,0.7)'}}>
        <Img src={staticFile('img/brand/diamond_hoax_h1.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
      <Note text="the full con ↑ linked below" x={80} y={1050} size={62} rot={-2} at={5} color={WHITE} />
      <Note text="like →" x={740} y={905} size={66} rot={-6} at={4} color={TEAL} />
      <Note text="subscribe ↓" x={440} y={1330} size={70} rot={-4} at={6} color={ORANGE} />
      <Prop name="rough_diamond" x={700} y={1480} w={420} rot={10} at={1} coral trace from="none" />
      <Prop name="stone_pile" x={-80} y={1560} w={820} rot={-4} at={0} from="none" />
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
