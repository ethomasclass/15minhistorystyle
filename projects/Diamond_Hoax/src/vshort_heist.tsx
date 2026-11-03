// MOCKUP (storyboard stills, no voice yet): a custom Short written for the vertical feed, not spliced from the chapters.
//   "How to Sell Dirt for $18 Million": a heist recipe in five steps, the twist (the step they couldn't control), the payoff line,
//   and a loop back to the cover. Each panel below is one beat of the draft script in review/shorts/Heist_Short_mockup.md.
// The look is the channel's (dark notebook, coral subject + teal trace, orange tape, teal handwriting, 12 fps steps), composed for
// a tall frame: every picture runs top to bottom, a step rail at the top is the running device, the captions carry the key word
// on orange tape, and the cover restacks the H1 picture vertically (the tycoon in the middle, the cousins in the foreground).
// YouTube's UI covers the top ~150 px, the bottom ~400 px and the right ~150 px below y 900: no TEXT there, but the pictures run
// on underneath it to the frame's edge.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Finish, Highlight, JF, Note, PALETTES, PaletteCtx, Picture, type Place, StepCtx, Traced} from './kit/Kit';
import {DarkPaper, Sfx, WRITE} from './kit/common';
import {Stamp, useScene} from './kit/shell';
import {bed} from './kit/levels';
import {Slip} from './kit/vox';
import {makeTimeline, type Narration} from './lib/timing';
import {SyncQuote} from './ch/ch08/parts';
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
import coldL from '../public/img/layers/sil/sil_cold_mesa/layers.json';
import heistWords from '../public/audio/vshort_heist.words.json';
import musicTiming from '../review/shorts/heist_music_timing.json';
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
const Rail: React.FC<{n: number; name?: string; twist?: boolean; a?: number}> = ({n, name, twist, a = 0}) => (
  <>
    <Highlight text={twist ? 'STEP 6?' : `STEP ${n}`} x={56} y={166} size={76} at={a} seed={110 + n} rot={-2} />
    <div style={{position: 'absolute', left: 420, top: 196, display: 'flex', gap: 22}}>
      {[1, 2, 3, 4, 5].map((k) => (
        <div key={k} style={{width: 34, height: 34, borderRadius: '50%', border: `4px solid ${k < n || twist ? TEAL : k === n ? ORANGE : 'rgba(244,239,230,0.45)'}`,
          background: k < n || twist ? TEAL : k === n ? ORANGE : 'transparent', boxShadow: '0 3px 8px rgba(0,0,0,0.6)'}} />
      ))}
    </div>
    {name && <Note text={name} x={66} y={268} size={66} rot={-2} at={a + 2} color={twist ? ORANGE : TEAL} />}
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

// =============================================================================================
// THE SHORT: "How to Sell Dirt for $18 Million", timed to the spliced narration (public/audio/vshort_heist.*: one Ellis take
// with Tiffany's quote spliced in, 63.2 s). Frame 0 is cover C; the payoff drains the same close-up to grey ("FOR DIRT."), the
// outro plays over it, and the last second returns to the cover exactly, so a replay loops.

const HN = heistWords as Narration;
const HT = makeTimeline(HN, 30);
const at = HT.at;
const FPS_H = 30;
const LOOP_TAIL = 30; // frames of the cover at the very end (the loop back to frame 0)
const SPEECH_END = Math.ceil(HN.duration * FPS_H);
export const HEIST_FRAMES = SPEECH_END + LOOP_TAIL;
const fr = (s: number) => Math.round(s * FPS_H);

/** Live captions: up to three words, never across a sentence end; the spoken word sits on orange tape. Off inside `hide`. */
const LiveCaptions: React.FC<{hide: [number, number][]}> = ({hide}) => {
  const f = useCurrentFrame();
  if (hide.some(([a, b]) => f >= a && f < b)) return null;
  const t = f / FPS_H;
  const ws = HN.words;
  const i = ws.findIndex((w) => w.e >= t - 0.05);
  if (i < 0 || t < ws[0].s - 0.1 || (ws[i] as {voice?: string}).voice) return null;
  const chunks: number[] = [0];
  ws.forEach((w, k) => {
    if (k === 0) return;
    const prev = ws[k - 1].w;
    if (k - chunks[chunks.length - 1] >= 3 || /[.?!:,]["”']?$/.test(prev)) chunks.push(k);
  });
  const start = chunks.filter((c) => c <= i).pop() ?? 0;
  const end = chunks.find((c) => c > i) ?? ws.length;
  return (
    <>
      <Band />
      <div style={{position: 'absolute', left: 50, width: 880, top: CAP_Y, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '6px 22px'}}>
        {ws.slice(start, end).map((w, k) => {
          const txt = w.w.replace(/[{}*"“”]/g, '');
          const hot = start + k === i;
          return hot ? (
            <span key={k} style={{fontFamily: JF.sans, fontWeight: 800, fontSize: 96, lineHeight: 1.15, textTransform: 'uppercase', color: '#15120d',
              background: ORANGE, padding: '0 18px', transform: 'rotate(-2deg)', display: 'inline-block', boxShadow: '0 6px 0 #0d0c09',
              clipPath: 'polygon(1% 6%, 99% 0, 100% 52%, 98% 100%, 2% 95%, 0 45%)'}}>{txt}</span>
          ) : (
            <span key={k} style={{fontFamily: JF.sans, fontWeight: 800, fontSize: 96, lineHeight: 1.15, textTransform: 'uppercase', color: CREAM,
              textShadow: '0 5px 0 #0d0c09, 0 0 18px rgba(0,0,0,0.95)'}}>{txt}</span>
          );
        })}
      </div>
    </>
  );
};

/** A slow push-in on whatever it wraps, from frame a to b (keeps still panels alive between cuts). */
const Push: React.FC<{a: number; b: number; z?: [number, number]; origin?: string; children: React.ReactNode}> = ({a, b, z = [1, 1.05], origin = '50% 45%', children}) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [a, b], z, {...clamp, easing: Easing.inOut(Easing.sin)});
  return <AbsoluteFill style={{transform: `scale(${k})`, transformOrigin: origin}}>{children}</AbsoluteFill>;
};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// scene cuts (frames)
const C = {
  cousins: at('two cousins'), mesa: at('field of dirt'), s1: at('Step one'), s2: at('Step two'), s3: at('Step three'),
  theranos2: at('Theranos', 2), tiffany: at('The cousins had'), s4: at('Step four'), s5: at('Step five'), twist: at('It worked'),
  clues: at('A dozen'), loop: at("They hadn't"), dirt: at('dirt', 2), tap: at('Tap like'),
};
const QUOTE_A = at('Gentlemen');
const QUOTE_B = HT.end('enormous value') + 8;

/** The chosen cover, live: coral face, $18 MILLION, and the bottom tape (the question) until it lifts for the captions. */
const LiveCover: React.FC<{b: number}> = ({b}) => {
  const f = useCurrentFrame();
  const lift = interpolate(f, [30, 40], [0, 1], clamp);
  return (
    <Push a={0} b={b} z={[1, 1.06]} origin="50% 40%">
      <DarkPaper />
      <Lamp x={540} y={800} r={760} a={0.2} />
      <Tycoon at={{left: -1000, top: 300, scale: 2.5}} />
      <Highlight text="$18 MILLION" x={70} y={160} size={150} at={-30} seed={171} rot={-3} />
      <div style={{position: 'absolute', inset: 0, opacity: 1 - lift, transform: `translateY(${lift * 220}px)`}}>
        <Highlight text="FOR DIRT?" x={60} y={1260} size={160} at={-30} seed={172} rot={-2} />
      </div>
      <Slip text="Theranos, 2018" x={60} y={880} at={at('Theranos')} rot={-5} size={58} />
      <Note text="a blood test that didn't work" x={70} y={985} size={50} rot={-3} at={at('blood test')} color={TEAL} />
    </Push>
  );
};

/** The loop frame and the outro: the same close-up; on "dirt" it drains to grey and the tape answers the cover. The last
 *  LOOP_TAIL frames are frame 0 again (coral, "FOR DIRT?"), so the replay is seamless. */
const LiveLoop: React.FC = () => {
  const f = useCurrentFrame();
  const back = f >= SPEECH_END;
  const drain = back ? 0 : interpolate(f, [C.dirt, C.dirt + 15], [0, 1], clamp);
  const answered = f >= C.dirt && !back;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Lamp x={540} y={800} r={760} a={0.2} />
      <Tycoon at={{left: -1000, top: 300, scale: 2.5}} tint={1 - 0.88 * drain} />
      <Highlight text="$18 MILLION" x={70} y={160} size={150} at={-30} seed={171} rot={-3} />
      {answered && <Highlight text="FOR DIRT." x={60} y={1260} size={160} at={C.dirt} seed={173} rot={-2} />}
      {back && <Highlight text="FOR DIRT?" x={60} y={1260} size={160} at={-30} seed={172} rot={-2} />}
      {!back && (
        <>
          <Note text="like →" x={740} y={905} size={66} rot={-6} at={at('like')} color={TEAL} />
          <Note text="full story ↓" x={70} y={1448} size={56} rot={-3} at={at('linked')} color={WHITE} />
          <Note text="subscribe ↓" x={470} y={1448} size={56} rot={-3} at={at('subscribe')} color={ORANGE} />
        </>
      )}
    </AbsoluteFill>
  );
};

const HeistScenes: React.FC = () => {
  const cuts: [number, React.ReactNode][] = [
    [0, <LiveCover key="c" b={C.cousins} />],
    [C.cousins, (
      <Push key="cz" a={C.cousins} b={C.mesa} z={[1.02, 1.08]}>
        <DarkPaper />
        <Lamp x={560} y={900} r={760} a={0.18} />
        <Tycoon at={{left: -200, top: 520, scale: 1.15}} />
        <div style={{position: 'absolute', inset: 0, filter: 'blur(1px)'}}>
          <Cousin mask={MASKS.cousin_l.alpha} at={{left: -300, top: 1050, scale: 1.4}} />
          <Cousin mask={MASKS.cousin_r.alpha} at={{left: -700, top: 1050, scale: 1.4}} />
        </div>
        <Highlight text="TWO COUSINS" x={70} y={170} size={120} at={C.cousins + 2} seed={181} rot={-3} />
      </Push>
    )],
    [C.mesa, (
      <AbsoluteFill key="m">
        <VSil name="sil_cold_mesa" size={coldL.size} glowLayer={coldL.glowLayer} a={C.mesa} b={C.s1} fx={[0.44, 0.52]} z={[1.04, 1.12]} />
        <AbsoluteFill style={{background: 'rgba(8,7,5,0.42)'}} />
        <Stamp text="$18 MILLION" x={80} y={420} at={at('eighteen')} size={140} color={ORANGE} rot={-4} />
        <Note text="in today's money" x={420} y={600} size={58} rot={-3} at={at('eighteen') + 6} color={TEAL} />
        <Highlight text="A FIELD OF DIRT" x={70} y={170} size={108} at={C.mesa + 2} seed={182} rot={-3} />
        <VTag text="Illustration · a mesa in northwest Colorado" />
      </AbsoluteFill>
    )],
    [C.s1, (
      <Push key="s1" a={C.s1} b={C.s2}>
        <Desk lamp={820} />
        <Prop name="rough_rubies" x={40} y={400} w={660} rot={-6} at={C.s1 + 2} coral trace from="top" />
        <Prop name="rough_diamond" x={540} y={600} w={500} rot={8} at={C.s1 + 6} coral trace from="top" />
        <Note text="bought in London," x={90} y={1040} size={60} rot={-2} at={at('rejects')} color={WHITE} />
        <Note text="under fake names" x={300} y={1115} size={60} rot={-2} at={at('rejects') + 5} color={WHITE} />
        <Prop name="stone_pile" x={-60} y={1440} w={1200} rot={-3} at={C.s1} from="none" />
        <Rail n={1} name="buy the bait" a={C.s1} />
      </Push>
    )],
    [C.s2, (
      <AbsoluteFill key="s2">
        <VSil name="sil_sf_night" size={sfL.size} glowLayer={sfL.glowLayer} a={C.s2} b={C.s3} fx={[0.45, 0.52]} z={[1.04, 1.12]} />
        <Prop name="leather_pouch" x={300} y={620} w={480} rot={-4} at={at('bag')} coral trace from="top" />
        <Rail n={2} name="play hard to get" a={C.s2} />
        <VTag text="Illustration · San Francisco, late at night" />
      </AbsoluteFill>
    )],
    [C.s3, (
      <Push key="s3" a={C.s3} b={C.s4} z={[1, 1.04]} origin="50% 35%">
        <Desk />
        {useCurrentFrame() < C.tiffany && (
          <>
            <Prop name="share_certificate" x={40} y={760} w={1000} rot={-4} at={C.theranos2} coral trace from="bottom" />
            <Slip text="Theranos, 2018" x={80} y={420} at={C.theranos2} rot={-4} size={104} />
            <Slip text="famous names" x={170} y={590} at={at('famous names')} rot={3} size={92} />
            <Slip text="on its board" x={330} y={740} at={at('on its board')} rot={-2} size={92} />
          </>
        )}
        {useCurrentFrame() >= C.tiffany && (
          <>
            <Print src="img/ch04/tiffany_charles_engraving_1893.jpg" size={[1497, 2199]} crop={[60, 20, 1437, 2199]} x={20} y={350} w={1040} h={1645} rot={-1} at={C.tiffany} mask={TIFFANY} traceAt={C.tiffany + 3} />
          </>
        )}
        {useCurrentFrame() >= QUOTE_A - 4 && (
          <>
            <div style={{position: 'absolute', left: 0, top: 1020, width: 1080, height: 470, background: 'linear-gradient(180deg, rgba(8,7,5,0) 0%, rgba(8,7,5,0.88) 22%, rgba(8,7,5,0.88) 85%, rgba(8,7,5,0) 100%)'}} />
            <SyncQuote t={HT} phrase="Gentlemen, these are beyond question precious stones of enormous value." x={70} y={1085} w={880} size={70} />
            <VTag text="His words, 1871 · voice dramatized" y={1450} />
          </>
        )}
        <Rail n={3} name="borrow trust" a={C.s3} />
      </Push>
    )],
    [C.s4, (
      <AbsoluteFill key="s4">
        <VSil name="sil_salting" size={saltL.size} glowLayer={saltL.glowLayer} a={C.s4} b={C.s5} fx={[0.44, 0.54]} z={[1.04, 1.14]} />
        <Rail n={4} name="make a mine" a={C.s4} />
        <VTag text="Illustration · salting the field" />
      </AbsoluteFill>
    )],
    [C.s5, (
      <Push key="s5" a={C.s5} b={C.twist}>
        <Desk lamp={860} />
        <Prop name="banknotes_stack" x={60} y={560} w={760} rot={-5} at={at('take the money')} coral trace from="top" />
        <Prop name="slouch_hat" x={420} y={1430} w={760} rot={12} at={at('run')} from="bottom" />
        <Rail n={5} name="take the money and run" a={C.s5} />
      </Push>
    )],
    [C.twist, (
      <Push key="tw" a={C.twist} b={C.clues} z={[1, 1.05]} origin="50% 40%">
        <Desk />
        <Print src="img/ch07/king_clarence_age27_c1869.jpg" size={[923, 1536]} crop={[0, 40, 923, 1536]} x={40} y={390} w={1000} h={1620} rot={1} at={at('Until')} mask={KING} traceAt={at('government') } />
        <Note text="Clarence King, geologist" x={90} y={1110} size={58} rot={-2} at={at('geologist')} color={WHITE} />
        <Rail n={6} name="the one they couldn't plan" twist a={C.twist} />
        <VTag text="Clarence King, c. 1869 · Library of Congress" />
      </Push>
    )],
    [C.clues, (
      <AbsoluteFill key="cl">
        <V3D x={-1180} y={-90} s={2.0}>
          <AnthillCutaway at={C.clues - 40} sliceAt={C.clues - 30} rubyAt={at('dozen rubies')} printsAt={at('boot prints') - 4} compareAt={1e7} labels={false} />
        </V3D>
        <Highlight text="NATURE IS" x={70} y={170} size={116} at={at('Nature')} seed={141} rot={-3} />
        <Highlight text="NOT THAT TIDY." x={60} y={320} size={116} at={at('not that tidy')} seed={142} rot={-2} />
        <VTag text="Cut-away · ruby enlarged" />
      </AbsoluteFill>
    )],
    [C.loop, <LiveLoop key="lp" />],
  ];
  return <>{useScene(cuts)}</>;
};

export const VShortHeist: React.FC = () => {
  const music = bed('dh_salted_theme');
  const out = fr(musicTiming.twist_out);
  const back = fr(musicTiming.back_in);
  const cueStart = fr(musicTiming.back_in + musicTiming.cue_offset_seg2);
  const cutFrames = [C.cousins, C.mesa, C.s1, C.s2, C.s3, C.s4, C.s5, C.twist, C.clues, C.loop];
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <StepCtx.Provider value={2.5}>
        <BareStageCtx.Provider value>
          <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
            <HeistScenes />
            <LiveCaptions hide={[[0, 40], [QUOTE_A - 4, QUOTE_B], [C.dirt, HEIST_FRAMES]]} />
            <Mark />
            <Finish vignette={0.35} />
            <Audio src={staticFile('audio/vshort_heist.wav')} />
            {/* the theme from the top, out on "It worked.", back so its closing chord lands on "dirt" */}
            <Sequence from={0} durationInFrames={out} layout="none">
              <Audio src={staticFile('music/dh_salted_theme.mp3')} volume={(f) => interpolate(f, [0, 3, out - 9, out], [music, music, music, 0], clamp)} />
            </Sequence>
            <Sequence from={back} layout="none">
              <Audio src={staticFile('music/dh_salted_theme.mp3')} startFrom={cueStart}
                volume={(f) => interpolate(f, [0, 8], [0, music * 1.25], clamp)} />
            </Sequence>
            {cutFrames.map((c) => <Sfx key={`w${c}`} at={c - 2} src="sfx/whoosh.wav" volume={0.18} />)}
            {[C.s1, C.s2, C.s3, C.s4, C.s5, C.twist].map((c) => <Sfx key={`s${c}`} at={c} src="sfx/stamp.wav" volume={0.24} />)}
            {[at('eighteen'), at('Nature'), C.dirt].map((c) => <Sfx key={`b${c}`} at={c} src="sfx/stamp.wav" volume={0.3} />)}
            {[at('Theranos'), C.theranos2, at('famous names'), at('rejects'), at('geologist'), at('like'), at('subscribe')].map((c) => <Sfx key={`p${c}`} at={c - 2} src={WRITE.src} volume={WRITE.volume} />)}
          </AbsoluteFill>
        </BareStageCtx.Provider>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};
