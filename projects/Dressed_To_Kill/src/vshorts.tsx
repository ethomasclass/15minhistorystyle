// Native vertical YouTube Shorts (1080x1920) for Dressed to Kill, built only from this video's own assets: the narration is
// spliced from the chapter WAVs (hook line first), the scenes are re-laid out for 9:16 with the same pictures, silhouette
// layers, document swipes and the Arsenic Waltz. Captions word by word; an end card points to the full video.
//   1 · The Arsenic Waltz  (the thumbnail's skeletons, the BMJ line, the makers-not-wearers twist)
//   2 · The Library Book   (Kedzie's poison wallpaper book, the girl on the first page, "Still green.")
//
// Phone safe zones: the top ~150 px and the bottom ~400 px carry YouTube's own UI, and the right ~150 px from y 900 down
// holds the like/comment buttons. Scene text stays in x 60-930, y 150-1150; captions sit at y ~1185; source tags at y 1490.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import {clamp} from './lib/anim';
import {makeTimeline, type Narration, type Word} from './lib/timing';
import {Finish, Highlight, JF, Loop, Note, PALETTES, PaletteCtx, Picture, type Place, StepCtx, Tag, useGFrame, usePal} from './kit/Kit';
import {DarkPaper, Sfx} from './kit/common';
import {Wordmark} from './kit/Intro';
import {Stamp, type TL, useScene} from './kit/shell';
import {Desk, DropCard} from './kit/bs';
import {Parallax} from './kit/parallax';
import {Doc, GREEN} from './kit/dk';
import {GOWN} from './kit/waltz';
import {MASKS} from './masks';
import w01 from '../public/audio/ch01_cold_open.words.json';
import w03 from '../public/audio/ch03_dressed_to_kill.words.json';
import w06 from '../public/audio/ch06_poison_our_homes.words.json';
import w08 from '../public/audio/ch08_back_to_the_book.words.json';

const FPS = 30;
const FRAME: [number, number] = [1080, 1920];
const GAP = 0.3;      // seconds of air between spliced lines
const OUTRO = 90;     // end card, frames
const TAG_Y = 1490;
const NLM = 'Courtesy of the National Library of Medicine';
const COLOUR = 'contrast(1.05) saturate(1.02)';
const CH: Record<string, {n: Narration; wav: string}> = {
  ch01: {n: w01 as Narration, wav: 'audio/ch01_cold_open.wav'},
  ch03: {n: w03 as Narration, wav: 'audio/ch03_dressed_to_kill.wav'},
  ch06: {n: w06 as Narration, wav: 'audio/ch06_poison_our_homes.wav'},
  ch08: {n: w08 as Narration, wav: 'audio/ch08_back_to_the_book.wav'},
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
  return {segs: out, n: {voice: 'spliced', duration: t, words}};
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
    if (k - chunks[chunks.length - 1] >= 3 || /[.?!:]["”]?$/.test(prev)) chunks.push(k);
  });
  const start = chunks.filter((c) => c <= i).pop() ?? 0;
  const end = chunks.find((c) => c > i) ?? n.words.length;
  return (
    <div style={{position: 'absolute', left: 50, width: 900, top: 1185, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 20px'}}>
      {n.words.slice(start, end).map((w, k) => (
        <span key={k} style={{fontFamily: JF.sans, fontWeight: 800, fontSize: 88, lineHeight: 1.2, textTransform: 'uppercase',
          color: start + k === i ? '#FF9F1C' : '#f4efe6', textShadow: '0 5px 0 #0d0c09, 0 0 18px rgba(0,0,0,0.95)'}}>{w.w.replace(/[{}*"“”]/g, '')}</span>
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
      <Note text="the full story:" x={100} y={520} size={84} rot={-3} at={at} color="#ffffff" />
      <Highlight text="DRESSED" x={80} y={660} size={170} at={at + 4} seed={91} rot={-3} />
      <Highlight text="TO KILL" x={120} y={890} size={170} at={at + 8} seed={92} rot={-2} />
      <div style={{position: 'absolute', left: 110, top: 1130, width: 860, fontFamily: JF.display, fontSize: 54, lineHeight: 1.2, color: pal.mark}}>How Arsenic Green Took Over the 1800s</div>
      <Note text="on the channel" x={120} y={1300} size={84} rot={-3} at={at + 14} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** Small wordmark, top-left (YouTube puts its own icons top-right). */
const Mark: React.FC = () => {
  const s = 0.2;
  return (
    <div style={{position: 'absolute', left: 40, top: 40, width: 1440 * s, height: 530 * s, overflow: 'hidden', borderRadius: 12, background: 'rgba(13,12,9,0.7)'}}>
      <div style={{position: 'absolute', left: -170 * s, top: -275 * s, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <Wordmark clockAt={0} numAt={0} minAt={0} hisAt={0} />
      </div>
    </div>
  );
};

type ShortDef = {id: string; segs: Seg[]; music: string; musicFrom?: number; musicVol?: number; Scenes: React.FC<{t: TL}>; whoosh: (t: TL) => number[]};

const Shell: React.FC<{d: ShortDef; b: Built}> = ({d, b}) => {
  const t = makeTimeline(b.n, FPS);
  const len = Math.ceil(b.n.duration * FPS);
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <StepCtx.Provider value={2.5}>
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
          <Audio src={staticFile(d.music)} startFrom={Math.round((d.musicFrom ?? 0) * FPS)}
            volume={(f) => interpolate(f, [0, 12, len + OUTRO - 25, len + OUTRO], [0, d.musicVol ?? 0.15, d.musicVol ?? 0.15, 0], clamp)} />
          {d.whoosh(t).map((f, i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
          <Sfx at={len} src="sfx/stamp.wav" volume={0.3} />
          <Outro at={len} />
          <Finish vignette={0.35} />
        </AbsoluteFill>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};

// ---------------------------------------------------------------------------------------------
// shared pieces

/** One silhouette painting, cropped to a 9:16 window around its figure. `name` is the mask/layer name. */
const SilV: React.FC<{name: string; file: string; label: string; crop: [number, number, number, number]; a: number; b: number; z?: [number, number]; children?: (p: Place) => React.ReactNode}> = ({
  name, file, label, crop, a, b, z = [1.02, 1.1], children,
}) => (
  <Parallax name={name} src={`img/gen/${file}`} size={[1376, 768]} a={a} b={b} crop={crop} frame={FRAME} fx={0.5} fy={0.5} cam={{z}} depth={1.05}
    filter="contrast(1.04) saturate(1.05)" tint={null} mask={MASKS[name as keyof typeof MASKS]} vignette={0.45} tag={`Illustration · ${label}`} tagY={TAG_Y}
    effects={[{kind: 'dust', x: 0, y: 0, w: 1080, h: 1920}]}>
    {children}
  </Parallax>
);

const WALTZ = 'img/ch03/arsenic_waltz_punch_1862.jpg';
const WALTZ_SIZE: [number, number] = [2974, 2358];

/** The lady's gown turning arsenic green (vertical frame): a colour blend through a hand-traced outline, stepped at 12 fps. */
const GownGreenV: React.FC<{place: Place; at: number}> = ({place, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 8], [0, 1], clamp);
  const pts = GOWN.map(([x, y]) => `${x},${y}`).join(' ');
  const layer = (blend: React.CSSProperties['mixBlendMode'], o: number, id: string) => (
    <svg key={id} width={1080} height={1920} style={{position: 'absolute', inset: 0, mixBlendMode: blend, opacity: o * k, pointerEvents: 'none'}}>
      <defs><filter id={`vgb${id}`} x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={14} /></filter></defs>
      <g transform={`translate(${place.left} ${place.top}) scale(${place.scale})`}>
        <polygon points={pts} fill={GREEN} filter={`url(#vgb${id})`} />
      </g>
    </svg>
  );
  return <>{layer('color', 1, 'c')}{layer('multiply', 0.35, 'm')}{layer('screen', 0.12, 's')}</>;
};

/** Show children only from frame `from` until frame `to` (for notes that must clear before the next beat). */
const Win: React.FC<{from?: number; to: number; children: React.ReactNode}> = ({from = 0, to, children}) => {
  const f = useCurrentFrame();
  return f >= from && f < to ? <>{children}</> : null;
};

type WKey = {f: number; fx: number; fy: number; z: number};
/** The Arsenic Waltz full height in a 9:16 window; the camera glides through the keys (centre in source px, zoom). */
const WaltzV: React.FC<{keys: WKey[]; greenAt?: number; children?: (p: Place) => React.ReactNode}> = ({keys, greenAt, children}) => {
  const f = useCurrentFrame();
  const ease = {easing: Easing.inOut(Easing.sin), ...clamp};
  const fs = keys.map((k) => k.f);
  const z = interpolate(f, fs, keys.map((k) => k.z), ease);
  const s = (1920 / WALTZ_SIZE[1]) * z;
  const hw = 540 / s, hh = 960 / s;
  const cx = Math.min(WALTZ_SIZE[0] - hw, Math.max(hw, interpolate(f, fs, keys.map((k) => k.fx), ease)));
  const cy = Math.min(WALTZ_SIZE[1] - hh, Math.max(hh, interpolate(f, fs, keys.map((k) => k.fy), ease)));
  const place: Place = {left: 540 - cx * s + noise2D('wvx', f * 0.018, 0) * 3, top: 960 - cy * s + noise2D('wvy', 0, f * 0.018) * 3, scale: s};
  return (
    <AbsoluteFill style={{background: '#111', overflow: 'hidden'}}>
      <Picture src={WALTZ} place={place} size={WALTZ_SIZE} bw="grayscale(1) contrast(1.28) brightness(0.98)" />
      {greenAt !== undefined && <GownGreenV place={place} at={greenAt} />}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.6) 100%)'}} />
      {children?.(place)}
      <Tag text="The Arsenic Waltz, Punch, 8 Feb. 1862 · Wellcome Collection" y={TAG_Y} />
    </AbsoluteFill>
  );
};

/** A clear plastic sleeve drawn over a card: gloss streaks, a heat-sealed top edge; slides on at `at`. */
const Sleeve: React.FC<{x: number; y: number; w: number; h: number; at: number; rot?: number}> = ({x, y, w, h, at, rot = 0}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 7], [0, 1], {...clamp, easing: (v) => 1 - Math.pow(1 - v, 3)});
  const pad = 26;
  const W = w + 2 * pad;
  const H = h + 2 * pad + 30;
  const j = (s: string) => (random(`vsl${s}`) - 0.5) * 5;
  const line = `M${4 + j('a')},${34 + j('b')} L${W - 4 + j('c')},${34 + j('d')} L${W - 6 + j('e')},${H - 4 + j('f')} L${6 + j('g')},${H - 4 + j('h')} Z`;
  return (
    <div style={{position: 'absolute', left: x - pad, top: y - pad - 30 - (1 - k) * 140, width: W, height: H, opacity: k, transform: `rotate(${rot}deg)`}}>
      <div style={{position: 'absolute', left: 0, top: 30, right: 0, bottom: 0, borderRadius: 8, background: 'rgba(225,235,240,0.07)',
        boxShadow: 'inset 0 0 30px rgba(255,255,255,0.10), 0 10px 30px rgba(0,0,0,0.35)'}} />
      <div style={{position: 'absolute', left: 0, top: 30, right: 0, bottom: 0, borderRadius: 8,
        background: 'linear-gradient(118deg, transparent 22%, rgba(255,255,255,0.22) 27%, transparent 33%, transparent 58%, rgba(255,255,255,0.13) 62%, transparent 67%)'}} />
      <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 40, borderRadius: '8px 8px 0 0', background: 'rgba(230,236,240,0.20)', borderBottom: '3px dashed rgba(255,255,255,0.55)'}} />
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={W} height={H}>
        <path d={line} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={3} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
// 1 · THE ARSENIC WALTZ

const WaltzScenes: React.FC<{t: TL}> = ({t}) => {
  const at = t.at;
  const pal = usePal();
  const lookAt = at('Now look') - 4;
  const bothAt = at('skeletons') + 4;
  const dressAt = at('The joke') - 6;
  const keys: WKey[] = [
    {f: 0, fx: 1560, fy: 1179, z: 1.0},
    {f: lookAt, fx: 1560, fy: 1179, z: 1.0},
    {f: bothAt, fx: 1560, fy: 738, z: 1.6},
    {f: dressAt, fx: 1560, fy: 738, z: 1.6},
    {f: dressAt + 22, fx: 1230, fy: 1179, z: 1.0},
    {f: at('The British') - 1, fx: 1200, fy: 1179, z: 1.0},
  ];
  const cuts: [number, React.ReactNode][] = [
    [0, (
      <WaltzV keys={keys} greenAt={at('green dress')}>
        {(p) => {
          const sx = (x: number) => p.left + x * p.scale, sy = (y: number) => p.top + y * p.scale;
          return (<>
            <Note text="the most fashionable colour" x={70} y={190} size={54} rot={-3} at={at('most fashionable') - 3} out={at('London magazine') - 6} color="#ffffff" />
            <Win to={lookAt}>
              <Highlight text="ARSENIC" x={70} y={870} size={140} at={at('arsenic.')} seed={71} rot={-3} />
              <Note text="and people knew it." x={90} y={1040} size={58} rot={-3} at={at('people knew') - 3} color={pal.subject} />
            </Win>
            <Note text="Punch, London, 1862" x={70} y={190} size={54} rot={-3} at={at('London magazine') - 3} out={lookAt + 24} color="#ffffff" />
            <Win to={dressAt}>
              <Loop cx={sx(1335)} cy={sy(660)} rx={140 * p.scale} ry={150 * p.scale} at={at('Now look')} seed={72} tilt={-6} />
              <Loop cx={sx(1775)} cy={sy(400)} rx={170 * p.scale} ry={185 * p.scale} at={at('closer') + 2} seed={73} tilt={5} />
              <Stamp text="SKELETONS." x={60} y={920} at={at('skeletons')} size={130} color={pal.subject} />
            </Win>
            <Note text="the joke:" x={70} y={190} size={58} rot={-3} at={at('The joke') - 2} color="#ffffff" />
            <Note text="her dress." x={110} y={270} size={72} rot={-3} at={at('her green dress') - 2} color={pal.subject} />
          </>);
        }}
      </WaltzV>
    )],
    [at('The British') - 1, (
      <Desk a={at('The British')}>
        <Doc src="img/ch03/bmj_15feb1862_p177_poison_enough.jpg" x={-1232} y={-2257} w={2512} at={at('The British') - 1} rot={0} fx={1865} fy={3050}
          marks={[
            {at: at('did the math') + 4, box: [1612, 2858, 2400, 2898], tint: true, seed: 4},
            {at: at('carries in her') - 2, to: t.end('ball-rooms'), swipe: [[1918, 2982, 2400, 3018], [1330, 3032, 2400, 3070], [1330, 3082, 2172, 3120]]},
          ]} />
        <Highlight text="BRITISH MEDICAL JOURNAL" x={60} y={170} size={58} at={at('British Medical Journal')} seed={74} rot={-2} />
        <Note text="15 Feb. 1862" x={80} y={300} size={50} rot={-3} at={at('did the math') - 4} color="#ffffff" />
        <Tag text="British Medical Journal, 15 Feb. 1862, p.177 · Internet Archive" y={TAG_Y} />
      </Desk>
    )],
    [at('Which is one way') - 1, (
      <Desk a={at('Which is one way')}>
        <DropCard src="img/ch03/met_green_silk_dress_1868.jpg" x={250} y={250} w={580} rot={2} at={at('Which is one way') - 1} filter={COLOUR} />
        <Note text="a green silk gown, 1868" x={70} y={170} size={54} rot={-3} at={at('Which is one way') - 2} color="#ffffff" />
        <Note text="keep your distance." x={90} y={1040} size={64} rot={-3} at={at('admirers') - 3} color={pal.subject} />
        <Tag text="Dress, 1868 (probably arsenic green) · The Metropolitan Museum of Art" y={TAG_Y} />
      </Desk>
    )],
    [at("But here's") - 1, (
      <SilV name="g_workshop" file="ch04_flower_workshop.jpg" label="an artificial-flower workshop" crop={[114, 0, 546, 768]} a={at("But here's")} b={at('The people in') + 4} z={[1.02, 1.12]}>
        {() => (<>
          <Highlight text="THE TWIST" x={70} y={190} size={120} at={at('twist')} seed={75} rot={-3} />
          <Note text="most wearers: fine." x={80} y={380} size={62} rot={-3} at={at('were fine') - 3} color="#ffffff" />
        </>)}
      </SilV>
    )],
    [at('The people in') - 1, (
      <SilV name="g_matilda" file="ch04_matilda_workbench.jpg" label="an artificial-flower maker, London, 1861" crop={[190, 0, 622, 768]} a={at('The people in')} b={t.frames} z={[1.03, 1.12]}>
        {() => (<>
          <Note text="the people in danger:" x={70} y={190} size={58} rot={-3} at={at('The people in') - 2} out={at('who made') - 2} color="#ffffff" />
          <Highlight text="THE MAKERS" x={70} y={300} size={120} at={at('who made')} seed={76} rot={-3} />
          <Note text="breathing the dust, all day" x={70} y={850} size={54} rot={-3} at={at('breathing') - 3} color="#ffffff" />
        </>)}
      </SilV>
    )],
  ];
  return <>{useScene(cuts)}</>;
};

// ---------------------------------------------------------------------------------------------
// 2 · THE LIBRARY BOOK

const COVER = 'img/ch01/kedzie_cover_green_label_crop_1874.jpg';
const BOARD = 'img/ch01/kedzie_cover_green_label_1874.jpg';
const LETTER = 'img/ch01/kedzie_baker_letter_1874.jpg';
const FIRST = 'img/ch01/kedzie_specimen_n018_first_leaf_spring_port.jpg';

const BookScenes: React.FC<{t: TL}> = ({t}) => {
  const at = t.at;
  const pal = usePal();
  const first = at('And the very first') - 1;
  const cuts: [number, React.ReactNode][] = [
    [0, (
      <Desk a={0}>
        <Highlight text="MICHIGAN, 1874" x={60} y={170} size={104} at={at('Michigan')} seed={81} rot={-3} />
        <DropCard src={COVER} x={90} y={310} w={680} rot={-3} at={2} filter={COLOUR} />
        <Win to={at('Every page') - 2}><Stamp text="100 LIBRARIES" x={70} y={1050} at={at('100')} size={96} color={pal.subject} /></Win>
        {(['n110', 'n126', 'n048'] as const).map((n, i) => (
          <DropCard key={n} src={`img/ch01/kedzie_specimen_${n}.jpg`} x={[680, 740, 660][i]} y={[360, 560, 760][i]} w={290} rot={[8, 13, 4][i]} at={at('Every page') - 1 + i * 5} filter={COLOUR} />
        ))}
        <Note text="every page: real wallpaper" x={60} y={1005} size={50} rot={-3} at={at('real wallpaper') - 3} color="#ffffff" />
        <Note text="every page: arsenic" x={70} y={1090} size={50} rot={-3} at={at('arsenic in it') - 3} color={pal.subject} />
        <Tag text={`R. C. Kedzie, Shadows from the Walls of Death, 1874 · ${NLM}`} y={TAG_Y} />
      </Desk>
    )],
    [at('The letter in') - 1, (
      <Desk a={at('The letter in')}>
        <Doc src={LETTER} x={-135} y={-973} w={1380} at={at('The letter in') - 1} fx={1040} fy={2500}
          marks={[{at: at('asks') - 2, to: t.end('handle it'), swipe: [[325, 2385, 1845, 2450], [240, 2480, 1845, 2545], [240, 2570, 445, 2620]]}]} />
        <Note text="the cover letter, 1874" x={70} y={170} size={54} rot={-3} at={at('The letter in') - 2} color="#ffffff" />
        <Note text="not for children." x={80} y={1060} size={60} rot={-3} at={at('children') - 3} color={pal.subject} />
        <Tag text={`Henry B. Baker, Michigan State Board of Health, 1874 · ${NLM}`} y={TAG_Y} />
      </Desk>
    )],
    [first, (
      <Desk a={first}>
        <DropCard src={FIRST} x={270} y={250} w={520} rot={-3} at={first} filter={COLOUR} />
        <Note text="page one" x={70} y={170} size={64} rot={-3} at={first + 2} color="#ffffff" />
        <Note text="a girl, about ten," x={80} y={1010} size={58} rot={-3} at={at('a girl') - 3} color={pal.subject} />
        <Note text="had died that year" x={110} y={1085} size={58} rot={-3} at={at('had died') - 3} color={pal.subject} />
        <Tag text={`Kedzie, Shadows from the Walls of Death, 1874: first specimen · ${NLM}`} y={TAG_Y} />
      </Desk>
    )],
    [at('So Kedzie') - 1, (
      <SilV name="g_chemist" file="ch06_chemist_testing.jpg" label="Robert Kedzie tests the wallpapers" crop={[700, 0, 1132, 768]} a={at('So Kedzie')} b={at('Then he bound') + 6}>
        {() => (<>
          <Note text="Robert Kedzie, chemist" x={70} y={190} size={54} rot={-3} at={at('So Kedzie') - 2} out={at('tested every') - 4} color="#ffffff" />
          <Note text="tested every sheet." x={70} y={190} size={58} rot={-3} at={at('tested every') - 3} color="#ffffff" />
          <Stamp text="ALL 86" x={70} y={940} at={at('All 86')} size={150} color={pal.subject} />
        </>)}
      </SilV>
    )],
    [at('Then he bound') - 1, (
      <Desk a={at('Then he bound')}>
        <DropCard src={COVER} x={150} y={310} w={720} rot={2} at={at('Then he bound') - 1} filter={COLOUR} />
        <Highlight text="THIS BOOK." x={80} y={170} size={130} at={at('This book')} seed={82} rot={-3} />
        <Note text="mailed to the libraries" x={90} y={1065} size={56} rot={-3} at={at('mailed') - 3} color="#ffffff" />
        <Tag text={`R. C. Kedzie, Shadows from the Walls of Death, 1874 · ${NLM}`} y={TAG_Y} />
      </Desk>
    )],
    [at('His headline') - 1, (
      <Desk a={at('His headline')}>
        <Doc src="img/ch06/kedzie_essay_p1_shall_we_poison_crop_1874.jpg" x={-226} y={-23} w={1500} at={at('His headline') - 1} fx={1190} fy={1123}
          marks={[{at: at('Shall we poison'), to: t.end('homes'), swipe: [[700, 1098, 1680, 1148]]}]} />
        <Note text="his headline was a question:" x={70} y={170} size={54} rot={-3} at={at('His headline') - 2} color="#ffffff" />
        <Tag text={`R. C. Kedzie, "Arsenical Wall Paper," 1874, p. 1 · ${NLM}`} y={TAG_Y} />
      </Desk>
    )],
    [at("Kedzie's book") - 1, (() => {
      const [x, y, w] = [190, 240, 700];
      const h = (w * 7483) / 5569;
      return <SealedBook t={t} x={x} y={y} w={w} h={h} />;
    })()],
  ];
  return <>{useScene(cuts)}</>;
};

/** "Kedzie's book is still out there, sealed in plastic. Still green." */
const SealedBook: React.FC<{t: TL; x: number; y: number; w: number; h: number}> = ({t, x, y, w, h}) => {
  const g = useGFrame();
  const a = t.at("Kedzie's book");
  const sealed = t.at('sealed in plastic');
  const green = t.at('Still green');
  const pal = usePal();
  const k = interpolate(g, [a, a + 5], [0, 1], {...clamp, easing: (v) => 1 - Math.pow(1 - v, 3) * (1 - 2.2 * v * (1 - v))});
  const col = interpolate(g, [green, green + 8], [0, 1], clamp);
  return (
    <Desk a={a}>
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(-2deg) scale(${0.6 + 0.4 * k})`, opacity: Math.min(1, k * 2), boxShadow: '0 18px 34px rgba(0,0,0,0.6)', overflow: 'hidden'}}>
        <Img src={staticFile(BOARD)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'grayscale(1) sepia(0.2) contrast(1.1)'}} />
        <Img src={staticFile(BOARD)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', filter: COLOUR, opacity: col}} />
      </div>
      <Sleeve x={x} y={y} w={w} h={h} at={sealed} rot={-2} />
      <Note text="still out there," x={70} y={170} size={60} rot={-3} at={t.at('still out there') - 2} color="#ffffff" />
      <Note text="sealed in plastic." x={90} y={250} size={60} rot={-3} at={sealed - 2} color={pal.subject} />
      <Highlight text="STILL GREEN." x={90} y={1010} size={130} at={green} seed={83} rot={-2} />
      <Tag text={`R. C. Kedzie, Shadows from the Walls of Death, 1874: cover label, arsenical paper · ${NLM}`} y={TAG_Y} />
    </Desk>
  );
};

// ---------------------------------------------------------------------------------------------

const DEFS: ShortDef[] = [
  {id: 'VShort1', music: 'music/r_spirits_dark.mp3', musicVol: 0.15, Scenes: WaltzScenes,
    segs: [{ch: 'ch01', first: 'The most fashionable', last: 'her green dress.'},
      {ch: 'ch03', first: 'The British Medical', last: 'half a dozen ball-rooms.'},
      {ch: 'ch03', first: 'Which is one way', last: 'at a distance.'},
      {ch: 'ch03', first: "But here's the twist.", last: 'were fine.'},
      {ch: 'ch03', first: 'The people in real danger', last: 'all day, every day.'}],
    whoosh: (t) => [t.at('The British'), t.at('Which is one way'), t.at("But here's"), t.at('The people in')].map((f) => f - 1)},
  {id: 'VShort2', music: 'music/j_cold_open.mp3', musicVol: 0.25, Scenes: BookScenes,
    segs: [{ch: 'ch01', first: 'the state of Michigan', last: 'arsenic in it.'},
      {ch: 'ch01', first: 'The letter in the front', last: 'had died that year.'},
      {ch: 'ch06', first: 'So Kedzie went shopping', last: 'poison our homes?'},
      {ch: 'ch08', first: "Kedzie's book is still", last: 'Still green.'}],
    whoosh: (t) => [t.at('The letter in'), t.at('And the very first'), t.at('So Kedzie'), t.at('Then he bound'), t.at('His headline'), t.at("Kedzie's book")].map((f) => f - 1)},
];

export const VSHORTS = DEFS.map((d) => {
  const b = build(d.segs);
  return {id: d.id, frames: Math.ceil(b.n.duration * FPS) + OUTRO, C: () => <Shell d={d} b={b} />};
});
