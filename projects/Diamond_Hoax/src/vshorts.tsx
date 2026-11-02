// Native vertical YouTube Shorts (1080x1920) for "They Fooled America's Richest Men", built only from this video's own assets: the
// narration is spliced from the chapter WAVs (hook line first), the scenes are re-laid out for 9:16 with the same pictures,
// silhouette paintings, props, 3D pieces and music cues. Captions word by word; an end card points to the full video.
//   1 · Who Put a Ruby in an Anthill?   (the salted field, Clarence King, the boot prints, "fraud")
//   2 · Every Scam Uses These 6 Moves   (the Con Card, one row per move, "Check the list")
//   3 · His Lawyer Was a Rifle          (what became of the two cousins)
//   4 · They Fooled Tiffany             (the quote, the London rejects, $4 million, what nobody asked)
// The splicing helper, captions, end card and shell follow projects/Halloween_Bribe/src/vshorts.tsx. Frame 0 of each Short is its
// cover (type drawn, big, one claim or question), and the last story frames repeat it so a replay loops.
//
// Phone safe zones: the top ~150 px and the bottom ~400 px carry YouTube's own UI, and the right ~150 px from y 900 down
// holds the like/comment buttons. Scene text stays in x 60-930, y 150-1150; captions sit at y ~1185; source tags at y 1490.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import {clamp} from './lib/anim';
import {makeTimeline, type Narration, type Word} from './lib/timing';
import {Finish, Highlight, JF, Note, PALETTES, PaletteCtx, StepCtx, Tag, usePal} from './kit/Kit';
import {DarkPaper, Sfx, WRITE} from './kit/common';
import {Stamp, type TL, useScene} from './kit/shell';
import {Prop} from './kit/prop';
import {bed} from './kit/levels';
import {maskRef} from './kit/maskref';
import {ConCard} from './kit/conCard';
import {BareStageCtx} from './fx/terrain/drawn3d';
import {AnthillCutaway} from './fx/AnthillCutaway';
import {Mesa, MESA_CAM} from './fx/Mesa';
import {ColdOpenDepth} from './fx/ColdOpenDepth';
import {CutGem, Lamp, MoneyTag, Print} from './ch/ch04/bits';
import {SilFigure} from './ch/ch08/parts';
import w01 from '../public/audio/ch01_cold_open.words.json';
import w02 from '../public/audio/ch02_too_late_for_the_bank.words.json';
import w03 from '../public/audio/ch03_everybody_wants_a_diamond_mine.words.json';
import w04 from '../public/audio/ch04_the_tiffany_test.words.json';
import w05 from '../public/audio/ch05_the_long_way_around.words.json';
import w06 from '../public/audio/ch06_cash_out.words.json';
import w07 from '../public/audio/ch07_the_anthills.words.json';
import w08 from '../public/audio/ch08_not_enough_money.words.json';
import w09 from '../public/audio/ch09_paid_for_dirt.words.json';
import coldL from '../public/img/layers/sil/sil_cold_mesa/layers.json';
import saltL from '../public/img/layers/sil/sil_salting/layers.json';
import sfL from '../public/img/layers/sil/sil_sf_night/layers.json';
import feverL from '../public/img/layers/sil/sil_fever/layers.json';
import undertakerL from '../public/img/layers/sil/sil_undertaker/layers.json';
import kingMask from '../public/img/masks/king.json';
import tiffanyMask from '../public/img/masks/ch04_tiffany.json';

const FPS = 30;
const GAP = 0.3;      // seconds of air between spliced lines
const HOLD = 1.0;     // seconds held after the last line: the cover again (the loop frames)
const OUTRO = 90;     // end card, frames
const TAG_Y = 1490;
const TEAL = '#2FE0C4';
const CORAL = '#FF6F61';
const ORANGE = '#FF9F1C';
const WHITE = '#ffffff';
const CH: Record<string, {n: Narration; wav: string}> = {
  ch01: {n: w01 as Narration, wav: 'audio/ch01_cold_open.wav'},
  ch02: {n: w02 as Narration, wav: 'audio/ch02_too_late_for_the_bank.wav'},
  ch03: {n: w03 as Narration, wav: 'audio/ch03_everybody_wants_a_diamond_mine.wav'},
  ch04: {n: w04 as Narration, wav: 'audio/ch04_the_tiffany_test.wav'},
  ch05: {n: w05 as Narration, wav: 'audio/ch05_the_long_way_around.wav'},
  ch06: {n: w06 as Narration, wav: 'audio/ch06_cash_out.wav'},
  ch07: {n: w07 as Narration, wav: 'audio/ch07_the_anthills.wav'},
  ch08: {n: w08 as Narration, wav: 'audio/ch08_not_enough_money.wav'},
  ch09: {n: w09 as Narration, wav: 'audio/ch09_paid_for_dirt.wav'},
};

/** A spoken line taken from a chapter: from the phrase `first` to the end of the phrase `last`. */
type Seg = {ch: string; first: string; last: string; firstNth?: number; lastNth?: number};
type Built = {segs: {wav: string; from: number; to: number; at: number}[]; n: Narration};

/** Splice the lines back to back; the result is a narration whose word times are local to the Short. */
const build = (segs: Seg[]): Built => {
  let t = 0.25;
  const out: Built['segs'] = [];
  const words: Word[] = [];
  for (const s of segs) {
    const {n, wav} = CH[s.ch];
    const tl = makeTimeline(n, FPS);
    const i0 = tl.idx(s.first, s.firstNth ?? 1);
    const i1 = tl.idx(s.last, s.lastNth ?? 1) + s.last.split(/\s+/).length - 1;
    const from = n.words[i0].s - 0.12, to = n.words[i1].e + 0.2;
    out.push({wav, from, to, at: t});
    for (let i = i0; i <= i1; i++) words.push({...n.words[i], s: n.words[i].s - from + t, e: n.words[i].e - from + t});
    t += to - from + GAP;
  }
  return {segs: out, n: {voice: 'spliced', duration: t + HOLD, words}};
};

/** Captions: three words at a time, the spoken word in orange. */
const Captions: React.FC<{n: Narration}> = ({n}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const i = n.words.findIndex((w) => w.e >= t - 0.05);
  if (i < 0 || t < n.words[0].s - 0.1) return null;
  // chunks of up to 3 words that never run across the end of a sentence
  const chunks: number[] = [0];
  n.words.forEach((w, k) => {
    if (k === 0) return;
    const prev = n.words[k - 1].w;
    if (k - chunks[chunks.length - 1] >= 3 || /[.?!:]["”']?$/.test(prev)) chunks.push(k);
  });
  const start = chunks.filter((c) => c <= i).pop() ?? 0;
  const end = chunks.find((c) => c > i) ?? n.words.length;
  return (
    <div style={{position: 'absolute', left: 50, width: 880, top: 1185, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 20px'}}>
      {n.words.slice(start, end).map((w, k) => (
        <span key={k} style={{fontFamily: JF.sans, fontWeight: 800, fontSize: 88, lineHeight: 1.2, textTransform: 'uppercase',
          color: start + k === i ? ORANGE : '#f4efe6', textShadow: '0 5px 0 #0d0c09, 0 0 18px rgba(0,0,0,0.95)'}}>{w.w.replace(/[{}*"“”]/g, '')}</span>
      ))}
    </div>
  );
};

/** End card: the full video's title and where to find it. */
const Outro: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  if (f < at) return null;
  return (
    <AbsoluteFill style={{opacity: interpolate(f, [at, at + 8], [0, 1], clamp)}}>
      <DarkPaper />
      <Note text="the full story:" x={100} y={360} size={84} rot={-3} at={at} color={WHITE} />
      <Highlight text="THEY FOOLED" x={80} y={520} size={124} at={at + 4} seed={91} rot={-3} />
      <Highlight text="AMERICA'S" x={120} y={690} size={124} at={at + 7} seed={92} rot={-2} />
      <Highlight text="RICHEST MEN" x={70} y={860} size={124} at={at + 10} seed={93} rot={-3} />
      <Note text="on the channel" x={150} y={1050} size={84} rot={-3} at={at + 14} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** Small wordmark, top-left (YouTube puts its own icons top-right). Fully drawn on frame 0. */
const Mark: React.FC = () => (
  <div style={{position: 'absolute', left: 40, top: 44, padding: '10px 14px', borderRadius: 10, background: 'rgba(13,12,9,0.6)'}}>
    <Img src={staticFile('img/brand/chunk-history-wordmark-white.svg')} style={{width: 230, display: 'block'}} />
  </div>
);

type Bed = {src: string; vol: number; from?: number; to?: number; startFrom?: number};
type ShortDef = {id: string; segs: Seg[]; beds: (t: TL, len: number) => Bed[]; Scenes: React.FC<{t: TL}>; stamps?: (t: TL) => number[]; writes?: (t: TL) => number[]};

const Shell: React.FC<{d: ShortDef; b: Built}> = ({d, b}) => {
  const t = makeTimeline(b.n, FPS);
  const len = Math.ceil(b.n.duration * FPS);
  const total = len + OUTRO;
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <StepCtx.Provider value={2.5}>
        <BareStageCtx.Provider value>
          <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
            <d.Scenes t={t} />
            {/* a dark band behind the captions so they read over any picture */}
            <div style={{position: 'absolute', left: 0, top: 1130, width: 1080, height: 360, background: 'linear-gradient(180deg, rgba(8,7,5,0) 0%, rgba(8,7,5,0.75) 30%, rgba(8,7,5,0.75) 75%, rgba(8,7,5,0) 100%)'}} />
            <Captions n={b.n} />
            <Mark />
            {b.segs.map((s, i) => (
              <Sequence key={i} from={Math.round(s.at * FPS)} layout="none">
                <Audio src={staticFile(s.wav)} startFrom={Math.round(s.from * FPS)} endAt={Math.round(s.to * FPS)} />
              </Sequence>
            ))}
            {d.beds(t, len).map((m, i) => {
              const from = m.from ?? 0;
              const to = m.to ?? total;
              return (
                <Sequence key={`bed${i}`} from={from} durationInFrames={to - from} layout="none">
                  <Audio src={staticFile(m.src)} startFrom={m.startFrom ?? 0}
                    volume={(f) => interpolate(f, [0, 12, to - from - 25, to - from], [0, m.vol, m.vol, 0], clamp)} />
                </Sequence>
              );
            })}
            {(d.stamps?.(t) ?? []).map((f, i) => <Sfx key={`st${i}`} at={f} src="sfx/stamp.wav" volume={0.25} />)}
            {(d.writes?.(t) ?? []).map((f, i) => <Sfx key={`wr${i}`} at={f - 2} src={WRITE.src} volume={WRITE.volume} />)}
            <Sfx at={len} src="sfx/stamp.wav" volume={0.3} />
            <Outro at={len} />
            <Finish vignette={0.35} />
          </AbsoluteFill>
        </BareStageCtx.Provider>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};

// ---------------------------------------------------------------------------------------------
// shared pieces

/**
 * SilScene (kit/silparallax.tsx) rebuilt for a 1080x1920 frame: the painting fills the height, and the 9:16 window slides
 * across it from `fx[0]` to `fx[1]` (0..1 of the painting's width) between frames a and b while the camera pushes in.
 */
const VSil: React.FC<{name: string; size: number[]; bands?: number; glowLayer?: number; a: number; b: number; fx: [number, number];
  z?: [number, number]; drift?: [number, number]; flicker?: number; fade?: number; dy?: number}> = ({
  name, size, bands = 4, glowLayer = 0, a, b, fx, z = [1.03, 1.12], drift = [20, -20], flicker = 0.5, fade = 4, dy = 0,
}) => {
  const f = useCurrentFrame();
  const u = interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
  const [W, H] = size;
  const cover = Math.max(1080 / W, 1920 / H);
  const Wc = W * cover, Hc = H * cover;
  const lim = 540 / Wc;
  const cx = Math.min(1 - lim, Math.max(lim, fx[0] + (fx[1] - fx[0]) * u));
  const wt = (i: number) => 1 - (i / (bands - 1)) * 0.92;
  const zNear = z[0] + (z[1] - z[0]) * u;
  const xNear = drift[0] + (drift[1] - drift[0]) * u;
  const style = (i: number): React.CSSProperties => {
    const zz = 1 + (zNear - 1) * wt(i) + 0.02;
    const dx = noise2D(`${name}dx${i}`, f * 0.01, 0) * 4 * wt(i);
    const ny = noise2D(`${name}dy${i}`, 0, f * 0.01) * 3 * wt(i);
    return {position: 'absolute', left: 540 - cx * Wc, top: 960 - Hc / 2 - dy, width: Wc, height: Hc, transformOrigin: `${cx * Wc}px ${Hc / 2 + dy}px`,
      transform: `translate(${xNear * wt(i) + dx}px, ${ny}px) scale(${zz})`};
  };
  const file = (i: number) => staticFile(`img/layers/sil/${name}/L${i}.${i === bands - 1 ? 'jpg' : 'webp'}`);
  const flick = 1 + flicker * (0.35 * noise2D(`${name}fl`, f * 0.21, 0) + 0.15 * noise2D(`${name}fl2`, f * 0.57, 3));
  const opacity = interpolate(f, [a - 1, a + fade], [0, 1], clamp);
  const planes = [];
  for (let i = bands - 1; i >= 0; i--) {
    planes.push(<Img key={`L${i}`} src={file(i)} style={style(i)} />);
    if (i === glowLayer) planes.push(<Img key="glow" src={staticFile(`img/layers/sil/${name}/glow.webp`)} style={{...style(i), mixBlendMode: 'screen', opacity: 0.55 * flick, filter: 'blur(6px) brightness(1.4)'}} />);
  }
  return (
    <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden', opacity}}>
      {planes}
      {/* the painting is lifted by dy so its figures clear the captions; its dark ground runs on into the dark below */}
      {dy > 0 && <div style={{position: 'absolute', left: 0, right: 0, top: 1920 - dy - 120, bottom: 0, background: 'linear-gradient(180deg, rgba(13,12,9,0) 0px, #0d0c09 120px)'}} />}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,10,8,0.7) 0%, rgba(11,10,8,0.25) 20%, rgba(11,10,8,0) 32%)'}} />
    </AbsoluteFill>
  );
};

/** A 3D piece (drawn at 1920x1080) on the Short's desk: the canvas is clear, so the portrait crop has no edges. */
const V3D: React.FC<{x: number; y: number; s?: number; children: React.ReactNode}> = ({x, y, s = 1, children}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <DarkPaper />
    <Lamp x={540} y={640} r={700} a={0.1} />
    <div style={{position: 'absolute', left: x, top: y, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: '0 0'}}>{children}</div>
  </AbsoluteFill>
);

/** The H1 picture (ColdOpenDepth, drawn at 1920x1080), scaled so the cousins and the tycoon fill the portrait frame. */
const VH1: React.FC<{cam?: {f: number; d: number; x?: number; y?: number}[]; drainAt?: number}> = ({cam, drainAt}) => (
  <AbsoluteFill style={{overflow: 'hidden', background: '#0d0c09'}}>
    <DarkPaper />
    <div style={{position: 'absolute', left: -330, top: 260, width: 1920, height: 1080, transform: 'scale(0.9)', transformOrigin: '0 0', overflow: 'hidden'}}>
      <ColdOpenDepth cam={cam ?? [{f: 0, d: 0, x: 0, y: 0}, {f: 200, d: 40, x: 0, y: 10}]} drainAt={drainAt} />
    </div>
      </AbsoluteFill>
);

// ---------------------------------------------------------------------------------------------
// 1 · WHO PUT A RUBY IN AN ANTHILL?

const KING = maskRef('king', kingMask);
const KING_SRC = 'img/ch07/king_clarence_age27_c1869.jpg';
const KING_SIZE: [number, number] = [923, 1536];
const KING_TAG = 'Clarence King, c. 1869 · Library of Congress';
const CUTAWAY_TAG = 'Cut-away · ruby enlarged';

/** The opened anthill with the lit ruby: the cover, and what every later anthill shot builds back to. */
const OpenHill: React.FC = () => (
  <V3D x={-692} y={-6} s={1.4}>
    <AnthillCutaway at={-400} sliceAt={-380} rubyAt={-330} printsAt={1e7} compareAt={1e7} labels={false} />
  </V3D>
);

const CoverType1: React.FC = () => (
  <>
    <Highlight text="WHO PUT A RUBY" x={55} y={170} size={106} at={-30} seed={21} rot={-3} />
    <Highlight text="IN AN ANTHILL?" x={70} y={320} size={116} at={-30} seed={22} rot={-2} />
  </>
);

const Cover1: React.FC = () => (
  <AbsoluteFill>
    <OpenHill />
    <CoverType1 />
    <Tag text={CUTAWAY_TAG} y={TAG_Y} />
  </AbsoluteFill>
);

const AnthillScenes: React.FC<{t: TL}> = ({t}) => {
  const at = t.at;
  const pal = usePal();
  const f = useCurrentFrame();
  const c = {
    field: at('were just lying') - 1, hills: at('Some of them') - 1, problem: at('There was just') - 1, bothered: at('Those diamonds') - 1,
    went: at('So King went') - 1, mesa: at('And they started') - 1, ring: at('Every time they found') - 1, ants: at('Then they looked') - 1,
    stick: at("One of King's men") - 1, fraud: at('The diamond field he told') - 1, loop: t.end('was a fraud') + 14,
  };
  const pan = interpolate(f, [at('anthills without'), at('anthills without') + 30], [-335, -780], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const cuts: [number, React.ReactNode][] = [
    [0, <Cover1 />],
    [c.field, (
      <AbsoluteFill>
        <V3D x={-420} y={260}>
          <Mesa at={c.field - 60} saltAt={-280} glowAt={-200} labels={false} cam={[{f: c.field, ...MESA_CAM.wide, dist: 15}, {f: c.hills, ...MESA_CAM.patch}]} />
        </V3D>
        <Note text="a hill out West" x={80} y={190} size={78} rot={-3} at={c.field + 2} color={WHITE} />
        <Highlight text="JUST LYING THERE" x={60} y={300} size={98} at={at('lying')} seed={23} rot={-2} />
      </AbsoluteFill>
    )],
    [c.hills, (
      <AbsoluteFill>
        <V3D x={-335} y={250}>
          <AnthillCutaway at={c.hills - 40} sliceAt={1e7} rubyAt={1e7} printsAt={1e7} compareAt={1e7} labels={false} />
        </V3D>
        <Highlight text="IN ANTHILLS" x={110} y={210} size={130} at={at('anthills')} seed={24} rot={-3} />
      </AbsoluteFill>
    )],
    [c.problem, (
      <AbsoluteFill>
        <VSil name="sil_salting" size={saltL.size} glowLayer={saltL.glowLayer} a={c.problem} b={c.bothered} fx={[0.42, 0.56]} z={[1.04, 1.14]} dy={380} />
        <Note text="just one problem" x={90} y={190} size={76} rot={-3} at={at('one problem') - 2} color={WHITE} />
        <Highlight text="THE FIELD WASN'T" x={55} y={320} size={100} at={at("field wasn't") + 4} seed={25} rot={-3} />
        <Tag text="Illustration · salting the field by night" y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.bothered, (
      <AbsoluteFill>
        <DarkPaper />
        <Lamp x={540} y={620} r={640} a={0.13} />
        <Print src={KING_SRC} size={KING_SIZE} x={190} y={290} w={700} h={780} rot={1.5} at={c.bothered + 1} mask={KING} traceAt={c.bothered + 4} crop={[0, 90, 923, 1055]} />
        <Highlight text="CLARENCE KING" x={70} y={170} size={108} at={c.bothered + 2} seed={26} rot={-2} />
        <Note text="government geologist" x={170} y={1095} size={62} rot={-3} at={at("King's team") - 2} color={TEAL} />
        <Tag text={KING_TAG} y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.went, (
      <AbsoluteFill>
        <VSil name="sil_cold_mesa" size={coldL.size} glowLayer={coldL.glowLayer} a={c.went} b={c.mesa} fx={[0.5, 0.42]} z={[1.04, 1.13]} dy={380} />
        <Highlight text="KING GOES TO LOOK" x={55} y={190} size={92} at={at('King went')} seed={27} rot={-3} />
        <Tag text="Illustration · the survey's camp, November 1872" y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.mesa, (
      <AbsoluteFill>
        <V3D x={-420} y={260}>
          <Mesa at={-30} saltAt={-240} glowAt={at('finding stones')} labels={false} cam={[{f: c.mesa, ...MESA_CAM.wide, dist: 15}, {f: at('finding stones') + 6, ...MESA_CAM.patch}, {f: c.ring, ...MESA_CAM.patch, dist: 5.8}]} />
        </V3D>
        <Highlight text="TOO MANY" x={190} y={210} size={140} at={at('Too many')} seed={28} rot={-3} />
      </AbsoluteFill>
    )],
    [c.ring, (
      <AbsoluteFill>
        <V3D x={-330} y={300} s={0.85}>
          <Mesa at={-300} saltAt={-280} glowAt={-200} rubyRingAt={at('there were') - 3} tidyAt={1e7} labels={false} cam={[{f: c.ring, ...MESA_CAM.patch, dist: 5.8}, {f: c.ring + 44, ...MESA_CAM.ring}, {f: c.ants, ...MESA_CAM.ring, dist: 2.75, yaw: -0.02}]} />
        </V3D>
        <Note text="1 diamond, 12 rubies" x={110} y={190} size={82} rot={-3} at={at('dozen') - 2} color={WHITE} />
        <Note text="every time" x={230} y={300} size={82} rot={-3} at={at('Every time', 2) - 2} color={pal.subject} />
        <Highlight text="NOT THAT TIDY" x={75} y={950} size={110} at={at('not that tidy')} seed={29} rot={-3} />
        <Tag text="Stones not to scale" y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.ants, (
      <AbsoluteFill>
        <V3D x={pan} y={250}>
          <AnthillCutaway at={c.ants - 26} sliceAt={at('the anthills') - 4} rubyAt={at('had rubies') + 2} printsAt={at('boot prints') - 4} compareAt={at('anthills without')} labels={false} />
        </V3D>
        <Note text="rubies..." x={130} y={190} size={90} rot={-3} at={at('had rubies')} out={at('boot prints') - 4} color={WHITE} />
        <Highlight text="BOOT PRINTS" x={100} y={190} size={124} at={at('boot prints')} seed={30} rot={-3} />
        <Note text="no prints? no rubies." x={110} y={350} size={78} rot={-3} at={at('No rubies') - 2} color={TEAL} />
        <Tag text={CUTAWAY_TAG} y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.stick, (
      <AbsoluteFill>
        <OpenHill />
        <Prop name="pointed_stick" x={230} y={120} w={420} at={at('end of a stick') - 3} rot={8} from="top" />
        <Note text="pushed in" x={90} y={190} size={84} rot={-4} at={at('pushed') - 2} color={WHITE} />
        <Note text="with a stick" x={560} y={290} size={80} rot={-3} at={at('end of a stick')} color={pal.subject} />
        <Tag text={CUTAWAY_TAG} y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.fraud, (
      <AbsoluteFill>
        <OpenHill />
        <Stamp text="FRAUD" x={140} y={250} at={at('a fraud')} size={230} color={ORANGE} rot={-5} />
        <Tag text={CUTAWAY_TAG} y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.loop, <Cover1 />],
  ];
  return <>{useScene(cuts)}</>;
};

// ---------------------------------------------------------------------------------------------
// 2 · EVERY SCAM USES THESE 6 MOVES

const CoverType2: React.FC = () => (
  <>
    <Highlight text="EVERY SCAM" x={90} y={165} size={134} at={-30} seed={41} rot={-3} />
    <Highlight text="USES THESE" x={150} y={320} size={100} at={-30} seed={42} rot={-2} />
    <Highlight text="6 MOVES" x={190} y={440} size={140} at={-30} seed={43} rot={-3} />
  </>
);

/** The blank Con Card: six empty rows, the question the Short answers. */
const Card: React.FC<{x?: number; y?: number; s?: number; rows?: {n: number; at: number}[]; checks?: {n: number; at: number}[]}> = ({x = 82, y = 640, s = 1.48, rows = [], checks = []}) => (
  <ConCard x={x} y={y} scale={s} at={-30} rows={rows} checks={checks} />
);

const Cover2: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Lamp x={540} y={900} r={760} a={0.13} />
    <Card x={165} y={640} s={1.2} />
    <CoverType2 />
  </AbsoluteFill>
);

const MovesScenes: React.FC<{t: TL}> = ({t}) => {
  const at = t.at;
  const c = {
    h1: at("they'd walked") - 1, six: at('Almost every') - 1, m1: at('Move one') - 1, m2: at('Move two') - 1, m3: at('This is move') - 1,
    m4: at("And that's move") - 1, m5: at("That's move five") - 1, m6: at('Move six') - 1, next: at('So the next') - 1, list: at('Check the list'),
    loop: t.end('Check the list') + 14,
  };
  const rows = [at('the bait'), at('play hard'), at('borrowed trust'), at('the proof'), at('the rush'), at('the exit')].map((f, i) => ({n: i + 1, at: f}));
  const Scene: React.FC<{n: number; title: string; x?: number; size?: number; prop: React.ReactNode}> = ({n, title, x = 80, size = 120, prop}) => (
    <AbsoluteFill>
      <DarkPaper />
      <Lamp x={540} y={520} r={560} a={0.14} />
      {prop}
      <Stamp text={`${n}/6`} x={830} y={300} at={rows[n - 1].at} size={84} color={TEAL} rot={-3} />
      <Highlight text={title} x={x} y={175} size={size} at={rows[n - 1].at} seed={44 + n} rot={-3} />
    </AbsoluteFill>
  );
  const cuts: [number, React.ReactNode][] = [
    [0, <Cover2 />],
    [c.h1, (
      <AbsoluteFill>
        <VH1 />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,7,5,0.6) 0%, rgba(8,7,5,0) 35%)'}} />
        <MoneyTag at={at('eighteen million') - 2} big="$18 million" small="$660,000 in 1872" x={490} y={190} size={136} />
        <Tag text="Illustration" y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.six, (
      <AbsoluteFill>
        <DarkPaper />
        <Lamp x={540} y={700} r={760} a={0.13} />
        <Card y={420} />
        <Highlight text="SIX MOVES" x={130} y={180} size={134} at={at('same six')} seed={44} rot={-3} />
      </AbsoluteFill>
    )],
    [c.m1, <Scene n={1} title="THE BAIT" prop={(
      <>
        <Prop name="leather_pouch" x={210} y={380} w={640} at={c.m1 + 2} coral trace from="top" />
        <Note text="mark = the one fooled" x={130} y={1040} size={70} rot={-3} at={at('the mark') - 2} color={TEAL} />
      </>
    )} />],
    [c.m2, <Scene n={2} title="HARD TO GET" size={104} x={70} prop={<Prop name="bandana_blindfold" x={120} y={420} w={820} at={c.m2 + 2} coral trace from="top" />} />],
    [c.m3, <Scene n={3} title="BORROWED TRUST" size={84} x={60} prop={(
      <Print src="img/ch04/tiffany_charles_engraving_1893.jpg" size={[1497, 2199]} crop={[0, 0, 1497, 1640]} x={190} y={350} w={700} h={760} rot={-1.5} at={c.m3 + 1} mask={TIFFANY} traceAt={c.m3 + 4} />
    )} />],
    [c.m4, <Scene n={4} title="THE PROOF" prop={(
      <>
        <Prop name="stone_pile" x={190} y={410} w={700} at={c.m4 + 2} coral trace from="top" />
        <Note text="dig it up yourself" x={190} y={1020} size={74} rot={-3} at={at('dig it up') - 2} color={TEAL} />
      </>
    )} />],
    [c.m5, <Scene n={5} title="THE RUSH" prop={<VSil name="sil_fever" size={feverL.size} glowLayer={feverL.glowLayer} a={c.m5} b={c.m6} fx={[0.45, 0.55]} z={[1.04, 1.12]} dy={380} />} />],
    [c.m6, <Scene n={6} title="THE EXIT" prop={(
      <>
        <Prop name="pocket_watch" x={220} y={400} w={640} at={c.m6 + 2} coral trace from="top" />
        <Note text="one round too long" x={160} y={1040} size={72} rot={-3} at={at('round too long') - 2} color={TEAL} />
      </>
    )} />],
    [c.next, (
      <AbsoluteFill>
        <DarkPaper />
        <Lamp x={540} y={800} r={760} a={0.13} />
        <Card y={420} rows={rows.map((r) => ({n: r.n, at: -999}))} checks={[1, 2, 3, 4, 5, 6].map((n) => ({n, at: at('Check the list') + (n - 1) * 2}))} />
        <Note text="too good?" x={90} y={170} size={74} rot={-3} at={at('too good') - 2} color={WHITE} />
        <Note text="no time to think?" x={340} y={270} size={74} rot={-3} at={at('no time') - 2} color={WHITE} />
        <Highlight text="CHECK THE LIST" x={60} y={1010} size={100} at={c.list} seed={52} rot={-3} />
      </AbsoluteFill>
    )],
    [c.loop, <Cover2 />],
  ];
  return <>{useScene(cuts)}</>;
};

// ---------------------------------------------------------------------------------------------
// 3 · HIS LAWYER WAS A RIFLE

const Rifle: React.FC<{at: number; y?: number}> = ({at, y = 690}) => (
  <Prop name="henry_rifle" x={-90} y={y} w={1260} rot={-24} at={at} coral trace from="none" />
);

const CoverType3: React.FC = () => (
  <>
    <Highlight text="HIS LAWYER" x={85} y={170} size={136} at={-30} seed={61} rot={-3} />
    <Highlight text="WAS A RIFLE" x={70} y={345} size={136} at={-30} seed={62} rot={-2} />
  </>
);

const Cover3: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Lamp x={540} y={780} r={680} a={0.16} />
    <SilFigure name="sil_arnold" x={250} y={520} h={640} at={-30} label={false} />
    <Rifle at={-30} y={780} />
    <CoverType3 />
    <Tag text="Philip Arnold · no reliable photo" y={TAG_Y} />
  </AbsoluteFill>
);

const CousinsScenes: React.FC<{t: TL}> = ({t}) => {
  const at = t.at;
  const f = useCurrentFrame();
  const pal = usePal();
  const c = {
    not: at('A Henry rifle is') - 1, two: at('Two cousins') - 1, real: at('The diamonds were real') - 1, charged: at('Arnold was charged') - 1, banker: at('He settled') - 1,
    shoot: at('A few years') - 1, slack: at('And John Slack') - 1, moved: at('He moved') - 1, died: at('He died there') - 1, loop: t.end('small-town bank account') + 14,
  };
  const flash = at('shootout') + 2;
  const cuts: [number, React.ReactNode][] = [
    [0, <Cover3 />],
    [c.not, (
      <AbsoluteFill>
        <DarkPaper />
        <Print src="img/ch09/henry_rifle_cavalryman_kauffman_abell_c1864.jpg" size={[2532, 4071]} crop={[250, 250, 2030, 2500]} x={150} y={330} w={760} h={780} rot={-2} at={c.not + 1} />
        <Highlight text="NOT A LAWYER" x={80} y={180} size={118} at={at('not a lawyer')} seed={63} rot={-3} />
        <Tag text="Kauffman & Abell, 1860s · Library of Congress" y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.two, (
      <AbsoluteFill>
        <VSil name="sil_sf_night" size={sfL.size} glowLayer={sfL.glowLayer} a={c.two} b={at("they'd walked")} fx={[0.45, 0.52]} z={[1.04, 1.12]} dy={380} />
        <Highlight text="TWO COUSINS" x={90} y={190} size={124} at={at('Two cousins')} seed={64} rot={-3} />
        <Note text="a bag of rocks" x={190} y={360} size={82} rot={-3} at={at('bag of rocks') - 2} color={WHITE} />
        <Tag text="Illustration · San Francisco, 1870" y={TAG_Y} />
      </AbsoluteFill>
    )],
    [at("they'd walked") - 1, (
      <AbsoluteFill>
        <VH1 />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,7,5,0.6) 0%, rgba(8,7,5,0) 35%)'}} />
        <MoneyTag at={at('eighteen million') - 2} big="$18 million" small="$660,000 in 1872" x={490} y={190} size={136} />
        <Tag text="Illustration" y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.real, (
      <AbsoluteFill>
        <DarkPaper />
        <Lamp x={540} y={700} r={620} a={0.14} />
        <Prop name="rough_diamond" x={240} y={460} w={600} at={c.real + 1} coral trace from="none" />
        <Note text="the diamonds: real" x={120} y={210} size={84} rot={-3} at={at('were real') - 2} color={WHITE} />
        <Highlight text="THE FIELD: FAKE" x={65} y={320} size={104} at={at("field wasn't") + 4} seed={65} rot={-3} />
      </AbsoluteFill>
    )],
    [c.charged, (
      <AbsoluteFill>
        <DarkPaper />
        <Lamp x={540} y={740} r={620} a={0.14} />
        <SilFigure name="sil_arnold" x={280} y={420} h={700} at={c.charged + 1} label={false} />
        <Note text="charged with fraud" x={120} y={190} size={84} rot={-3} at={at('charged') - 2} color={WHITE} />
        <Stamp text="NEVER TRIED" x={60} y={330} at={at('stood trial')} size={140} color={ORANGE} rot={-3} />
        <Tag text="Philip Arnold · no reliable photo" y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.banker, (
      <AbsoluteFill>
        <DarkPaper />
        <Lamp x={540} y={740} r={620} a={0.14} />
        <SilFigure name="sil_arnold" x={280} y={480} h={640} at={c.banker + 1} label={false} />
        <MoneyTag at={at('four million') - 2} big="$4 million" small="$150,000 in 1872 · one lawsuit" x={500} y={180} size={136} />
        <Highlight text="A BANKER" x={150} y={420} size={134} at={at('banker')} seed={66} rot={-3} />
        <Note text="of course he did." x={230} y={1040} size={84} rot={-3} at={at('Of course') - 2} color={pal.subject} />
      </AbsoluteFill>
    )],
    [c.shoot, (
      <AbsoluteFill>
        <DarkPaper />
        <Lamp x={540} y={740} r={620} a={0.14} />
        <SilFigure name="sil_arnold" x={280} y={480} h={640} at={c.shoot + 1} label={false} />
        <Note text="a feud with a rival banker" x={80} y={190} size={62} rot={-3} at={at('feud') - 2} color={WHITE} />
        <Highlight text="A SHOOTOUT" x={100} y={300} size={124} at={at('shootout')} seed={67} rot={-3} />
        <Note text="pneumonia, 6 months later" x={100} y={1050} size={58} rot={-3} at={at('pneumonia') - 2} color={TEAL} />
        <AbsoluteFill style={{background: '#fff4e0', opacity: interpolate(f, [flash, flash + 5], [0.5, 0], clamp) * (f >= flash ? 1 : 0)}} />
      </AbsoluteFill>
    )],
    [c.slack, (
      <AbsoluteFill>
        <DarkPaper />
        <Lamp x={540} y={740} r={620} a={0.14} />
        <SilFigure name="sil_slack" x={345} y={530} h={600} at={c.slack + 1} label={false} />
        <Highlight text="JOHN SLACK" x={110} y={180} size={124} at={at('John Slack')} seed={68} rot={-3} />
        <Note text="vanished?" x={250} y={340} size={92} rot={-3} at={at('vanished') - 2} color={ORANGE} />
        <Note text="he didn't." x={560} y={1030} size={84} rot={-3} at={at("He didn't") + 2} color={pal.subject} />
        <Tag text="John Slack · no reliable photo" y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.moved, (
      <AbsoluteFill>
        <VSil name="sil_undertaker" size={undertakerL.size} glowLayer={undertakerL.glowLayer} a={c.moved} b={c.died} fx={[0.45, 0.52]} z={[1.04, 1.13]} dy={380} />
        <Note text="a small town in New Mexico" x={70} y={190} size={60} rot={-3} at={at('New Mexico') - 3} color={WHITE} />
        <Highlight text="THE UNDERTAKER" x={60} y={300} size={102} at={at('undertaker')} seed={69} rot={-3} />
        <Tag text="Illustration · the undertaker's shop" y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.died, (
      <AbsoluteFill>
        <DarkPaper />
        <Lamp x={540} y={740} r={620} a={0.14} />
        <Prop name="undertaker_coffin" x={290} y={400} w={520} rot={-3} at={c.died + 1} coral trace from="top" />
        <Stamp text="1896" x={330} y={180} at={at('1896')} size={170} color={ORANGE} rot={-3} />
      </AbsoluteFill>
    )],
    [c.loop, <Cover3 />],
  ];
  return <>{useScene(cuts)}</>;
};

// ---------------------------------------------------------------------------------------------
// 4 · THEY FOOLED TIFFANY

const TIFFANY = maskRef('ch04_tiffany', tiffanyMask);
const TIFF_SRC = 'img/ch04/tiffany_charles_engraving_1893.jpg';
const TIFF_SIZE: [number, number] = [1497, 2199];
const TIFF_CROP: [number, number, number, number] = [80, 30, 1340, 1000];
const TIFF_TAG = 'Charles L. Tiffany and the House of Tiffany & Co., 1893';

const CoverType4: React.FC = () => (
  <>
    <Highlight text="THEY FOOLED" x={75} y={170} size={132} at={-30} seed={71} rot={-3} />
    <Highlight text="TIFFANY" x={190} y={340} size={160} at={-30} seed={72} rot={-2} />
  </>
);

const Portrait: React.FC<{at: number}> = ({at}) => (
  <Print src={TIFF_SRC} size={TIFF_SIZE} crop={TIFF_CROP} x={110} y={530} w={860} h={640} rot={-1.5} at={at} mask={TIFFANY} traceAt={at} />
);

const Cover4: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Lamp x={540} y={820} r={700} a={0.15} />
    <Portrait at={-30} />
    <CoverType4 />
    <Note text="the stones were rejects" x={110} y={1085} size={64} rot={-3} at={-30} color={TEAL} />
    <Tag text={TIFF_TAG} y={TAG_Y} />
  </AbsoluteFill>
);

const TiffanyScenes: React.FC<{t: TL}> = ({t}) => {
  const at = t.at;
  const c = {
    rejects: at('Low-grade') - 1, trip: at('So the cousins') - 1, needed: at('What they needed') - 1, tiff: at('And Charles') - 1, light: at('Tiffany picks') - 1,
    num: at('Two days') - 1, trust: at('Nobody had') - 1, asked: at("Here's what") - 1, loop: t.end('out of the ground') + 14,
  };
  const cuts: [number, React.ReactNode][] = [
    [0, <Cover4 />],
    [c.rejects, (
      <AbsoluteFill>
        <DarkPaper />
        <Lamp x={540} y={720} r={620} a={0.14} />
        <Prop name="stone_pile" x={200} y={420} w={680} at={c.rejects + 1} from="none" />
        <Stamp text="REJECTS" x={130} y={200} at={at('Rejects')} size={170} color={ORANGE} rot={-4} />
      </AbsoluteFill>
    )],
    [c.trip, (
      <AbsoluteFill>
        <DarkPaper />
        <Lamp x={540} y={720} r={620} a={0.14} />
        <SilFigure name="sil_arnold" x={110} y={590} h={530} at={c.trip + 1} label={false} />
        <SilFigure name="sil_slack" x={620} y={590} h={530} at={c.trip + 4} label={false} />
        <Highlight text="LONDON" x={230} y={180} size={150} at={at('To London')} seed={73} rot={-3} />
        <Note text="under fake names" x={190} y={360} size={82} rot={-3} at={at('fake names') - 2} color={WHITE} />
        <MoneyTag at={at('half a million') - 2} big="$500,000" small="about $20,000 in 1872" x={490} y={460} size={100} />
        <Tag text="Philip Arnold, John Slack · no reliable photos" y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.needed, (
      <AbsoluteFill>
        <VH1 />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,7,5,0.6) 0%, rgba(8,7,5,0) 35%)'}} />
        <Note text="they needed somebody" x={100} y={190} size={82} rot={-3} at={at('What they needed') - 2} color={WHITE} />
        <Highlight text="FAMOUS" x={200} y={300} size={150} at={at('famous')} seed={74} rot={-3} />
        <Tag text="Illustration" y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.tiff, (
      <AbsoluteFill>
        <DarkPaper />
        <Lamp x={540} y={820} r={700} a={0.15} />
        <Portrait at={c.tiff + 1} />
        <Highlight text="CHARLES TIFFANY" x={65} y={230} size={100} at={at('Charles')} seed={76} rot={-3} />
        <Tag text={TIFF_TAG} y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.light, (
      <AbsoluteFill>
        <DarkPaper />
        <Lamp x={540} y={620} r={640} a={0.2} />
        <Prop name="rough_diamond" x={190} y={320} w={700} at={c.light + 1} coral trace from="bottom" />
        <Note text="up to the light" x={230} y={190} size={84} rot={-3} at={at('light') - 2} color={WHITE} />
      </AbsoluteFill>
    )],
    [c.num, (
      <AbsoluteFill>
        <DarkPaper />
        <Lamp x={540} y={760} r={620} a={0.14} />
        <Note text="two days later, his number" x={80} y={190} size={60} rot={-3} at={c.num + 2} color={WHITE} />
        <MoneyTag at={at('four million') - 2} big="$4 million" small="$150,000 in 1872" x={500} y={330} size={160} />
        <Prop name="stone_pile" x={240} y={620} w={600} at={c.num + 1} from="none" />
      </AbsoluteFill>
    )],
    [c.trust, (
      <AbsoluteFill>
        <DarkPaper />
        <Lamp x={540} y={820} r={700} a={0.15} />
        <Print src={TIFF_SRC} size={TIFF_SIZE} crop={TIFF_CROP} x={110} y={530} w={860} h={640} rot={-1.5} at={c.trust + 1} mask={TIFFANY} traceAt={c.trust + 4} tintAt={at('trust Tiffany')} />
        <Note text="nobody trusted the cousins" x={70} y={190} size={60} rot={-3} at={at('scruffy') - 2} color={WHITE} />
        <Highlight text="THEY TRUSTED HIM" x={50} y={310} size={96} at={at('trust Tiffany')} seed={77} rot={-3} />
        <Tag text={TIFF_TAG} y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.asked, (
      <AbsoluteFill>
        <DarkPaper />
        <Lamp x={540} y={760} r={700} a={0.1} />
        <Highlight text="WHAT NOBODY ASKED" x={60} y={180} size={82} at={at('nobody asked')} seed={78} rot={-3} />
        <CutGem cx={290} cy={560} w={340} at={at('cut and polished')} />
        <Note text="what he sold" x={110} y={760} size={68} rot={-3} at={at('polished') - 2} color={TEAL} />
        <Prop name="rough_diamond" x={570} y={420} w={390} at={at('rough stones') - 1} coral trace from="top" />
        <Note text="not this" x={640} y={830} size={78} rot={-3} at={at('knew very little') - 2} color={CORAL} />
      </AbsoluteFill>
    )],
    [c.loop, <Cover4 />],
  ];
  return <>{useScene(cuts)}</>;
};

// ---------------------------------------------------------------------------------------------

const DEFS: ShortDef[] = [
  {id: 'VShort1', Scenes: AnthillScenes,
    segs: [{ch: 'ch01', first: 'A hill out West', last: 'sitting in anthills.'},
      {ch: 'ch01', first: 'There was just one problem.', last: "diamond field wasn't."},
      {ch: 'ch07', first: 'Those diamonds bothered', last: 'seen any diamonds.'},
      {ch: 'ch07', first: 'So King went', last: 'place himself,'},
      {ch: 'ch07', first: 'And they started finding', last: 'not that tidy.'},
      {ch: 'ch07', first: 'Then they looked', last: 'end of a stick.'},
      {ch: 'ch08', first: 'The diamond field, he told', last: 'was a fraud.'}],
    beds: () => [{src: 'music/dh_anthills.mp3', vol: bed('dh_anthills')}],
    stamps: (t) => [t.at('lying'), t.at('anthills'), t.at('Too many'), t.at('not that tidy'), t.at('boot prints'), t.at('a fraud')],
    writes: (t) => [t.at('one problem'), t.at('dozen'), t.at('Every time', 2), t.at('had rubies'), t.at('No rubies'), t.at('pushed'), t.at('end of a stick')]},
  {id: 'VShort2', Scenes: MovesScenes,
    segs: [{ch: 'ch01', first: 'Two cousins', last: 'bag of rocks.'},
      {ch: 'ch01', first: "they'd walked away", last: "today's money."},
      {ch: 'ch01', first: 'Almost every con', last: 'the same six'},
      {ch: 'ch02', first: 'Move one:', last: 'already wants.'},
      {ch: 'ch02', first: 'Move two:', last: 'chase it.'},
      {ch: 'ch04', first: 'This is move three', last: 'borrowed trust.'},
      {ch: 'ch04', first: 'They just had to', last: 'trust Tiffany.'},
      {ch: 'ch05', first: "And that's move four", last: 'the proof.'},
      {ch: 'ch05', first: 'Let him dig', last: 'it up himself.'},
      {ch: 'ch06', first: "That's move five", last: 'asking questions.'},
      {ch: 'ch06', first: 'Move six', last: 'too long.'},
      {ch: 'ch09', first: 'So the next time', last: 'Check the list.'}],
    beds: () => [{src: 'music/dh_salted_theme.mp3', vol: bed('dh_salted_theme')}],
    stamps: (t) => [t.at('eighteen million') - 2, t.at('same six'), t.at('the bait'), t.at('play hard'), t.at('borrowed trust'), t.at('the proof'), t.at('the rush'), t.at('the exit'), t.at('Check the list')],
    writes: (t) => [t.at('the mark'), t.at('dig it up'), t.at('round too long'), t.at('too good')]},
  {id: 'VShort3', Scenes: CousinsScenes,
    segs: [{ch: 'ch09', first: 'He reportedly said', last: 'not a lawyer.'},
      {ch: 'ch01', first: 'Two cousins', last: 'bag of rocks.'},
      {ch: 'ch01', first: "they'd walked away", last: "today's money."},
      {ch: 'ch01', first: 'The diamonds were real.', last: "field wasn't."},
      {ch: 'ch09', first: 'Arnold was charged', last: 'stood trial.'},
      {ch: 'ch09', first: 'He settled', last: 'six months later.'},
      {ch: 'ch09', first: 'And John Slack?', last: 'small-town bank account.'}],
    beds: () => [{src: 'music/dh_secret_bag.mp3', vol: bed('dh_secret_bag')}],
    stamps: (t) => [t.at('not a lawyer'), t.at('Two cousins'), t.at('eighteen million') - 2, t.at('stood trial'), t.at('four million') - 2, t.at('banker'), t.at('shootout'), t.at('John Slack'), t.at('undertaker'), t.at('1896')],
    writes: (t) => [t.at('bag of rocks'), t.at('charged'), t.at('Of course'), t.at('feud'), t.at('pneumonia'), t.at('vanished'), t.at("He didn't")]},
  {id: 'VShort4', Scenes: TiffanyScenes,
    segs: [{ch: 'ch04', first: 'Gentlemen, these are', last: 'enormous value.'},
      {ch: 'ch03', first: 'Low-grade stuff.', last: 'Rejects.'},
      {ch: 'ch03', first: 'So the cousins spent', last: 'dollars worth of rough diamonds and rubies.'},
      {ch: 'ch03', first: 'What they needed', last: 'call them treasure.'},
      {ch: 'ch04', first: 'And Charles Tiffany', last: 'up to the light.'},
      {ch: 'ch04', first: 'Two days later', last: 'four million dollars.'},
      {ch: 'ch04', first: 'Nobody had to trust', last: 'trust Tiffany.'},
      {ch: 'ch04', first: "Here's what nobody asked.", last: 'out of the ground.'}],
    beds: () => [{src: 'music/dh_parlor_appraisal.mp3', vol: bed('dh_parlor_appraisal'), startFrom: 1440}],
    stamps: (t) => [t.at('Rejects'), t.at('To London'), t.at('half a million') - 2, t.at('famous'), t.at('Charles'), t.at('four million') - 2, t.at('trust Tiffany'), t.at('nobody asked')],
    writes: (t) => [t.at('fake names'), t.at('light'), t.at('scruffy'), t.at('polished'), t.at('knew very little')]},
];

export const VSHORTS = DEFS.map((d) => {
  const b = build(d.segs);
  return {id: d.id, frames: Math.ceil(b.n.duration * FPS) + OUTRO, C: () => <Shell d={d} b={b} />};
});
