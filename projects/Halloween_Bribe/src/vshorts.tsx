// Native vertical YouTube Shorts (1080x1920) for "Trick-or-Treating Was a Bribe", built only from this video's own assets: the
// narration is spliced from the chapter WAVs (hook line first), the scenes are re-laid out for 9:16 with the same pictures,
// silhouette paintings, props and music cues. Captions word by word; an end card points to the full video.
//   1 · Trick or Treat Was a Bribe       (the 1933 tear-gas headline, the mob, the deal, "pay up")
//   2 · The First Jack-o'-Lanterns Were Turnips  (the museum turnip, the famine crossing, the American upgrade)
// The splicing helper, captions, end card and shell follow projects/Dressed_To_Kill/src/vshorts.tsx.
//
// Phone safe zones: the top ~150 px and the bottom ~400 px carry YouTube's own UI, and the right ~150 px from y 900 down
// holds the like/comment buttons. Scene text stays in x 60-930, y 150-1150; captions sit at y ~1185; source tags at y 1490.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import {clamp} from './lib/anim';
import {makeTimeline, type Narration, type Word} from './lib/timing';
import {Arrow, Finish, Highlight, JF, Loop, Note, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame, usePal} from './kit/Kit';
import {DarkPaper, Sfx, WRITE} from './kit/common';
import {PhotoCard, Stamp, type TL, useScene} from './kit/shell';
import {Prop} from './kit/prop';
import {bed} from './kit/levels';
import {Smoke} from './fx/Headline';
import w01 from '../public/audio/ch01_cold_open.words.json';
import w02 from '../public/audio/ch02_the_night_the_dead_came_home.words.json';
import w03 from '../public/audio/ch03_coffin_ships_and_pumpkins.words.json';
import w04 from '../public/audio/ch04_the_worst_halloween.words.json';
import w05 from '../public/audio/ch05_the_deal.words.json';
import w08 from '../public/audio/ch08_treat_or_shakedown.words.json';
import mob from '../public/img/layers/sil/ch04_mob_school/layers.json';
import door from '../public/img/layers/sil/ch08_door/layers.json';
import party from '../public/img/layers/sil/ch05_party/layers.json';
import hearth from '../public/img/layers/sil/ch02_hearth/layers.json';
import ship from '../public/img/layers/sil/ch03_coffin_ship/layers.json';

const FPS = 30;
const GAP = 0.3;      // seconds of air between spliced lines
const OUTRO = 90;     // end card, frames
const TAG_Y = 1490;
const TEAL = '#2FE0C4';
const CORAL = '#FF6F61';
const WHITE = '#ffffff';
const BW = 'grayscale(1) contrast(1.25) sepia(0.12) brightness(0.98)';
const CH: Record<string, {n: Narration; wav: string}> = {
  ch01: {n: w01 as Narration, wav: 'audio/ch01_cold_open.wav'},
  ch02: {n: w02 as Narration, wav: 'audio/ch02_the_night_the_dead_came_home.wav'},
  ch03: {n: w03 as Narration, wav: 'audio/ch03_coffin_ships_and_pumpkins.wav'},
  ch04: {n: w04 as Narration, wav: 'audio/ch04_the_worst_halloween.wav'},
  ch05: {n: w05 as Narration, wav: 'audio/ch05_the_deal.wav'},
  ch08: {n: w08 as Narration, wav: 'audio/ch08_treat_or_shakedown.wav'},
};

/** A spoken line taken from a chapter: from the phrase `first` to the end of the phrase `last`. */
type Seg = {ch: string; first: string; last: string; firstNth?: number; lastNth?: number};
/** seconds held after the last line: the payoff tape, then the cover again (the loop frames) */
const HOLD = 1.0;
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
      <Note text="the full story:" x={100} y={420} size={84} rot={-3} at={at} color={WHITE} />
      <Highlight text="TRICK-OR-TREATING" x={70} y={580} size={80} at={at + 4} seed={91} rot={-3} />
      <Highlight text="WAS A BRIBE" x={90} y={740} size={128} at={at + 8} seed={92} rot={-2} />
      <div style={{position: 'absolute', left: 120, top: 960, width: 820, fontFamily: JF.display, fontSize: 56, lineHeight: 1.2, color: pal.mark}}>The Real History of Halloween</div>
      <Note text="on the channel" x={130} y={1110} size={84} rot={-3} at={at + 14} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** Small wordmark, top-left (YouTube puts its own icons top-right). Fully drawn on frame 0. */
const Mark: React.FC = () => (
  <div style={{position: 'absolute', left: 40, top: 44, padding: '10px 14px', borderRadius: 10, background: 'rgba(13,12,9,0.6)'}}>
    <Img src={staticFile('img/brand/chunk-history-horizontal-white.svg')} style={{width: 270, display: 'block'}} />
  </div>
);

type Bed = {src: string; vol: number; from?: number; to?: number; startFrom?: number};
type ShortDef = {id: string; segs: Seg[]; beds: (t: TL, len: number) => Bed[]; Scenes: React.FC<{t: TL}>; whoosh: (t: TL) => number[]; stamps?: (t: TL) => number[]; writes?: (t: TL) => number[]};

const Shell: React.FC<{d: ShortDef; b: Built}> = ({d, b}) => {
  const t = makeTimeline(b.n, FPS);
  const len = Math.ceil(b.n.duration * FPS);
  const total = len + OUTRO;
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
          {d.beds(t, len).map((m, i) => {
            const from = m.from ?? 0;
            const to = m.to ?? total;
            return (
              <Sequence key={`bed${i}`} from={from} durationInFrames={to - from} layout="none">
                <Audio src={staticFile(m.src)} startFrom={Math.round((m.startFrom ?? 0) * FPS)}
                  volume={(f) => interpolate(f, [0, 12, to - from - 25, to - from], [0, m.vol, m.vol, 0], clamp)} />
              </Sequence>
            );
          })}
          {d.whoosh(t).map((f, i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
          {(d.stamps?.(t) ?? []).map((f, i) => <Sfx key={`st${i}`} at={f} src="sfx/stamp.wav" volume={0.25} />)}
          {(d.writes?.(t) ?? []).map((f, i) => <Sfx key={`wr${i}`} at={f - 2} src={WRITE.src} volume={WRITE.volume} />)}
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

/** Show children only from frame `from` until frame `to`. */
const Win: React.FC<{from?: number; to: number; children: React.ReactNode}> = ({from = 0, to, children}) => {
  const f = useCurrentFrame();
  return f >= from && f < to ? <>{children}</> : null;
};

/**
 * SilScene (kit/silparallax.tsx) rebuilt for a 1080x1920 frame: the painting fills the height, and the 9:16 window slides
 * across it from `fx[0]` to `fx[1]` (0..1 of the painting's width) between frames a and b while the camera pushes in.
 * Each plane still moves by its own depth; the push scales about the point at the centre of the screen.
 */
const VSil: React.FC<{name: string; size: number[]; bands?: number; glowLayer?: number; a: number; b: number; fx: [number, number];
  z?: [number, number]; drift?: [number, number]; fog?: number; flicker?: number; fade?: number; dy?: number}> = ({
  name, size, bands = 4, glowLayer = 0, a, b, fx, z = [1.03, 1.12], drift = [20, -20], fog = 0.3, flicker = 0.5, fade = 4, dy = 0,
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
  const fogBlob = (k: number, i: number) => {
    const t = f * 0.0025 + k * 0.37;
    const x = ((t % 1) * 1.6 - 0.3) * 1080;
    const y = 900 + Math.sin(k * 2.1 + f * 0.004) * 220;
    return <div key={`fog${k}`} style={{position: 'absolute', left: x - 500, top: y - 220, width: 1000, height: 440, borderRadius: '50%',
      background: 'radial-gradient(ellipse at center, rgba(236,214,170,0.55) 0%, rgba(236,214,170,0) 70%)', opacity: fog * (0.5 + 0.5 * wt(i)), filter: 'blur(30px)', mixBlendMode: 'screen'}} />;
  };
  const planes = [];
  for (let i = bands - 1; i >= 0; i--) {
    planes.push(<Img key={`L${i}`} src={file(i)} style={style(i)} />);
    if (i === glowLayer) planes.push(<Img key="glow" src={staticFile(`img/layers/sil/${name}/glow.webp`)} style={{...style(i), mixBlendMode: 'screen', opacity: 0.55 * flick, filter: 'blur(6px) brightness(1.4)'}} />);
    if (i === bands - 2 || i === bands - 3) planes.push(fogBlob(i * 3, i), fogBlob(i * 3 + 1, i));
  }
  return (
    <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden', opacity}}>
      {planes}
      {/* the painting is lifted by dy so its figures clear the captions; its black ground runs on into the dark below */}
      {dy > 0 && <div style={{position: 'absolute', left: 0, right: 0, top: 960 + (960 - dy) * zNear - 60, bottom: 0, background: 'linear-gradient(180deg, rgba(13,12,9,0) 0px, #0d0c09 90px)'}} />}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)'}} />
    </AbsoluteFill>
  );
};

/** A flat picture filling the 9:16 frame: the camera glides from centre `c0` to `c1` (source px) and zooms z0 -> z1 over a..b. */
const VPic: React.FC<{src: string; size: [number, number]; c0: [number, number]; c1?: [number, number]; z?: [number, number]; a: number; b: number; filter?: string; tag?: string; dy?: number}> = ({
  src, size, c0, c1 = c0, z = [1, 1.08], a, b, filter = BW, tag, dy = 0,
}) => {
  const f = useCurrentFrame();
  const u = interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
  const s = Math.max(1080 / size[0], 1920 / size[1]) * (z[0] + (z[1] - z[0]) * u);
  const cx = c0[0] + (c1[0] - c0[0]) * u, cy = c0[1] + (c1[1] - c0[1]) * u;
  const left = Math.min(0, Math.max(1080 - size[0] * s, 540 - cx * s)) + noise2D(`${src}x`, f * 0.015, 0) * 3;
  const top = Math.min(0, Math.max(1920 - size[1] * s, 960 - cy * s)) - dy + noise2D(`${src}y`, 0, f * 0.015) * 3;
  return (
    <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden', opacity: interpolate(f, [a - 1, a + 3], [0, 1], clamp)}}>
      <Img src={staticFile(src)} style={{position: 'absolute', left, top, width: size[0] * s, height: size[1] * s, filter}} />
      {dy > 0 && <div style={{position: 'absolute', left: 0, right: 0, top: top + size[1] * s - 120, bottom: 0, background: 'linear-gradient(180deg, rgba(13,12,9,0) 0px, #0d0c09 150px)'}} />}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,0.6) 100%)'}} />
      {tag && <Tag text={tag} y={TAG_Y} />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// 1 · TRICK OR TREAT WAS A BRIBE

const PAGE = 'img/ch03/bismarck_tribune_1933-11-01_front_page.jpg';
const PAGE_SIZE: [number, number] = [2600, 3426];
const HEAD = {x: 78, y: 391, w: 2311, h: 134};   // the banner headline in source px (from the LOC phrase finder)
const PW = 1000;
const PS = PW / PAGE_SIZE[0];
const PH = PAGE_SIZE[1] * PS;
const BISMARCK_TAG = 'The Bismarck Tribune, 1 Nov 1933 · Library of Congress';
type HKey = {f: number; z: number; cx: number; cy: number; tilt: number; rz: number};
/** The cover frame (and the loop's last frame): the camera close on "Tear Gas Used". */
const HEAD_COVER: Omit<HKey, 'f'> = {z: 1.8, cx: 0.26, cy: 0.133, tilt: 16, rz: -3};

/** The real 1933 front page as a sheet of paper in 3D, portrait; tear-gas smoke rolling across it. */
const HeadlineV: React.FC<{keys: HKey[]; smoke: [number, number][]; loopAt?: number}> = ({keys, smoke, loopAt = Infinity}) => {
  const f = useCurrentFrame();
  const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
  const fs = keys.map((k) => k.f);
  const v = (k: 'z' | 'cx' | 'cy' | 'tilt' | 'rz') => (keys.length === 1 ? keys[0][k] : interpolate(f, fs, keys.map((q) => q[k]), ease));
  const z = v('z'), cx = v('cx') * PW, cy = v('cy') * PH;
  const drift = {x: noise2D('hvx', f * 0.008, 0) * 10, y: noise2D('hvy', 0, f * 0.008) * 8};
  const dens = smoke.length === 1 ? smoke[0][1] : interpolate(f, smoke.map((s) => s[0]), smoke.map((s) => s[1]), clamp);
  const lp = Number.isFinite(loopAt) ? interpolate(f, [loopAt, loopAt + 14], [0, 1], clamp) : 0;
  const hx = (HEAD.x + HEAD.w / 2) * PS, hy = (HEAD.y + HEAD.h / 2) * PS;
  return (
    <AbsoluteFill style={{background: '#0b0a08', overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{perspective: 1500, perspectiveOrigin: '50% 45%'}}>
        <div style={{position: 'absolute', left: 540 - cx + drift.x, top: 840 - cy + drift.y, width: PW, height: PH, transformOrigin: `${cx}px ${cy}px`,
          transform: `scale(${z}) rotateX(${v('tilt')}deg) rotateZ(${v('rz')}deg)`, boxShadow: '0 40px 80px rgba(0,0,0,0.8)'}}>
          <Img src={staticFile(PAGE)} style={{width: PW, height: PH, display: 'block', filter: 'grayscale(1) contrast(1.25) sepia(0.18) brightness(0.98)'}} />
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 12%, rgba(0,0,0,0) 88%, rgba(0,0,0,0.32) 100%)'}} />
          {lp > 0 && (
            <svg width={PW} height={PH} style={{position: 'absolute', left: 0, top: 0}}>
              <ellipse cx={hx} cy={hy} rx={HEAD.w * PS * 0.54} ry={HEAD.h * PS * 1.2} fill="none" stroke={CORAL} strokeWidth={5}
                pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lp} strokeLinecap="round" transform={`rotate(-1.5 ${hx} ${hy})`} />
            </svg>
          )}
        </div>
      </AbsoluteFill>
      <Smoke density={dens} seed="vhook" y={820} spread={420} over="light" />
      {/* darken the top so the cover type and the wordmark read */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,10,8,0.85) 0%, rgba(11,10,8,0.55) 22%, rgba(11,10,8,0) 36%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};

/** Cover type for Short 1 (frame 0, and the loop's last frame). */
const CoverType1: React.FC = () => (
  <>
    <Highlight text="TEAR GAS" x={90} y={190} size={150} at={-30} seed={21} rot={-3} />
    <Highlight text="ON HALLOWEEN?" x={70} y={390} size={112} at={-30} seed={22} rot={-2} />
  </>
);

const Cover1: React.FC = () => (
  <AbsoluteFill>
    <HeadlineV keys={[{f: 0, ...HEAD_COVER}]} smoke={[[0, 0.6]]} />
    <CoverType1 />
    <Tag text={BISMARCK_TAG} y={TAG_Y} />
  </AbsoluteFill>
);

const BribeScenes: React.FC<{t: TL}> = ({t}) => {
  const at = t.at;
  const pal = usePal();
  const pull = at('This is a real');
  const look = at('Look at the headline');
  const c = {
    mob: at('The night before') - 1, riot: at('It was a riot') - 1, pay: at('Some towns') - 1, listen: at('So listen') - 1,
    deal: at("It's a deal") - 1, racket: at("It's a protection") - 1, worked: at('And mostly') - 1, door: at('So when a kid') - 1,
    loop: t.end('pay up') + 14,
  };
  const keys: HKey[] = [
    {f: 0, ...HEAD_COVER},
    {f: pull - 1, z: 1.7, cx: 0.28, cy: 0.135, tilt: 15, rz: -3},
    {f: pull + 40, z: 0.92, cx: 0.5, cy: 0.45, tilt: 10, rz: -2},
    {f: look, z: 0.95, cx: 0.5, cy: 0.42, tilt: 10, rz: -2},
    {f: look + 24, z: 1.06, cx: 0.5, cy: 0.16, tilt: 14, rz: -2.5},
    {f: c.mob, z: 1.12, cx: 0.5, cy: 0.16, tilt: 15, rz: -3},
  ];
  const cuts: [number, React.ReactNode][] = [
    [0, (
      <AbsoluteFill>
        <HeadlineV keys={keys} loopAt={at('Tear Gas Used')}
          smoke={[[0, 0.6], [pull + 20, 0.25], [look, 0.15], [at('Halt Pranks') + 10, 0.5]]} />
        <Win to={pull + 4}><CoverType1 /></Win>
        <Note text="Bismarck, N.D. · Nov. 1, 1933" x={70} y={200} size={58} rot={-3} at={at('North Dakota') - 2} color={WHITE} />
        <Note text="the morning after Halloween" x={90} y={290} size={54} rot={-3} at={at('the morning after') - 2} color={pal.subject} />
        <Tag text={BISMARCK_TAG} y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.mob, (() => {
      return (
        <AbsoluteFill>
          <VSil name="ch04_mob_school" size={mob.size} glowLayer={mob.glowLayer} a={c.mob} b={c.pay} fx={[0.3, 0.72]} z={[1.04, 1.12]} dy={760} />
          <MobSmoke from={at('police')} peak={at('gassed') + 8} />
          <Highlight text="ABOUT 300 BOYS" x={60} y={190} size={92} at={at('about 300')} seed={23} rot={-2} />
          <Win to={c.riot}>
            <Note text="junk cars + garbage" x={80} y={360} size={62} rot={-3} at={at('junk') - 2} color={WHITE} />
          </Win>
          <Prop name="teargas_grenade" x={720} y={330} w={190} rot={14} at={at('gassed') - 2} coral trace from="top" />
          <Highlight text="A RIOT" x={80} y={760} size={150} at={at('riot')} seed={24} rot={-3} />
          <Note text="in costume." x={120} y={960} size={78} rot={-3} at={at('in costume') - 2} color={pal.subject} />
          <Tag text="Illustration · Bismarck, Halloween night, 1933" y={TAG_Y} />
        </AbsoluteFill>
      );
    })()],
    [c.pay, (
      <AbsoluteFill>
        <DarkPaper />
        <Note text="some towns had a better idea:" x={70} y={200} size={56} rot={-3} at={at('Some towns') - 2} color={WHITE} />
        <Highlight text="THEY DECIDED" x={70} y={330} size={112} at={at('They decided')} seed={25} rot={-3} />
        <Highlight text="TO PAY." x={170} y={500} size={150} at={at('to pay')} seed={26} rot={-2} />
        <Prop name="candy_bowl" x={160} y={720} w={700} at={at('to pay') - 3} coral trace />
      </AbsoluteFill>
    )],
    [c.listen, (
      <AbsoluteFill>
        <DarkPaper />
        <Note text="listen to the words:" x={80} y={200} size={60} rot={-3} at={at('So listen') + 2} color={WHITE} />
        <div style={{position: 'absolute', left: 70, top: 380, fontFamily: JF.display, fontSize: 150, lineHeight: 1.05, color: '#f4efe6',
          textShadow: '0 6px 22px rgba(0,0,0,0.8)', opacity: interpolate(useCurrentFrame(), [at('Trick or treat') - 4, at('Trick or treat')], [0, 1], clamp)}}>
          “TRICK<br />OR TREAT”
        </div>
        <Note text="isn't a greeting." x={120} y={760} size={84} rot={-4} at={at('greeting') - 3} color={TEAL} />
      </AbsoluteFill>
    )],
    [c.deal, (
      <AbsoluteFill>
        <DarkPaper />
        <Highlight text="IT'S A DEAL." x={80} y={190} size={140} at={at("It's a deal")} seed={27} rot={-3} />
        <Prop name="treat_bag" x={70} y={470} w={380} rot={-4} at={at('Give me something') - 2} coral trace />
        <Note text="give me something..." x={60} y={950} size={58} rot={-3} at={at('Give me something') - 2} color={WHITE} />
        <Prop name="outhouse" x={480} y={560} w={480} rot={6} at={at('or else') - 2} from="top" />
        <Note text="...or else." x={470} y={1030} size={70} rot={-3} at={at('or else') - 2} color={pal.subject} />
      </AbsoluteFill>
    )],
    [c.racket, (
      <AbsoluteFill>
        <VSil name="ch05_party" size={party.size} glowLayer={party.glowLayer} a={c.racket} b={c.worked} fx={[0.36, 0.5]} z={[1.03, 1.1]} dy={800} />
        <Highlight text="A PROTECTION" x={60} y={200} size={110} at={at('protection racket')} seed={28} rot={-3} />
        <Highlight text="RACKET" x={150} y={360} size={150} at={at('racket') + 3} seed={29} rot={-2} />
        <Note text="with better costumes." x={90} y={600} size={68} rot={-3} at={at('better costumes') - 3} color={TEAL} />
        <Tag text="Illustration · a town Halloween party, 1930s" y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.worked, (
      <AbsoluteFill>
        <DarkPaper />
        <Highlight text="AND IT WORKED." x={60} y={190} size={112} at={at('it worked')} seed={30} rot={-3} />
        <Prop name="treat_bag" x={90} y={420} w={420} rot={-5} at={at('filling a bag') - 3} coral trace />
        <Note text="busy filling a bag" x={60} y={960} size={60} rot={-3} at={at('filling a bag') - 2} color={WHITE} />
        <Prop name="outhouse" x={540} y={600} w={430} rot={4} at={at('tipping over') - 3} from="none" />
        <Arrow x1={620} y1={560} x2={760} y2={640} bow={-40} at={at('tipping over') - 1} color={TEAL} width={6} />
        <Note text="not this." x={600} y={470} size={70} rot={-4} at={at('your outhouse') - 3} color={pal.subject} />
      </AbsoluteFill>
    )],
    [c.door, (
      <AbsoluteFill>
        <VSil name="ch08_door" size={door.size} glowLayer={door.glowLayer} a={c.door} b={c.loop} fx={[0.53, 0.22]} z={[1.03, 1.12]} dy={350} />
        <Note text="this Saturday" x={80} y={200} size={66} rot={-3} at={at('this Saturday') - 2} color={WHITE} />
        <Note text="“trick or treat!”" x={100} y={330} size={74} rot={-3} at={at('trick or treat', 2) - 2} color={TEAL} />
        <Highlight text="PAY UP." x={120} y={960} size={170} at={at('pay up')} seed={31} rot={-3} />
        <Tag text="Illustration · trick-or-treat at the door" y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.loop, <Cover1 />],
  ];
  return <>{useScene(cuts)}</>;
};

/** Smoke rolling through the mob painting, thickening on "gassed". */
const MobSmoke: React.FC<{from: number; peak: number}> = ({from, peak}) => {
  const f = useCurrentFrame();
  const d = interpolate(f, [from, peak, peak + 120], [0.15, 0.9, 0.75], clamp);
  return <Smoke density={d} seed="vmob" y={1000} spread={300} speed={1.4} />;
};

// ---------------------------------------------------------------------------------------------
// 2 · THE FIRST JACK-O'-LANTERNS WERE TURNIPS

const TURNIP = 'img/ch02/turnip_jackolantern_museum_country_life.jpg';
const TURNIP_TAG = 'Museum of Country Life, Ireland · photo Rannṗáirtí anaithnid, CC BY-SA 3.0';

/** The museum turnip: a sharp, feathered photo over a blurred copy that fills the frame. `z` pushes in on the face. */
const TurnipPhoto: React.FC<{z?: number; top?: number}> = ({z = 1, top = 430}) => {
  const w = 1000 * z;
  const left = 540 - w / 2;
  const feather = 'radial-gradient(ellipse at 50% 45%, #000 55%, transparent 74%)';
  return (
    <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
      <Img src={staticFile(TURNIP)} style={{position: 'absolute', left: -300, top: -100, width: 1680, height: 2162, objectFit: 'cover', filter: 'blur(40px) brightness(0.4) saturate(0.8)'}} />
      <Img src={staticFile(TURNIP)} style={{position: 'absolute', left, top: top - 300 * (z - 1), width: w, height: 1287 * z, filter: 'contrast(1.08) saturate(1.05)',
        WebkitMaskImage: feather, maskImage: feather}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(13,12,9,0.8) 0%, rgba(13,12,9,0.3) 24%, rgba(13,12,9,0) 32%)'}} />
    </AbsoluteFill>
  );
};

const CoverType2: React.FC = () => (
  <>
    <Highlight text="THE FIRST" x={80} y={170} size={110} at={-30} seed={41} rot={-3} />
    <Highlight text="JACK-O'-LANTERNS" x={60} y={320} size={96} at={-30} seed={42} rot={-2} />
    <Highlight text="WERE TURNIPS" x={90} y={455} size={124} at={-30} seed={43} rot={-3} />
  </>
);

const Cover2: React.FC = () => (
  <AbsoluteFill>
    <TurnipPhoto />
    <CoverType2 />
    <Tag text={TURNIP_TAG} y={TAG_Y} />
  </AbsoluteFill>
);

/** A drawn jack-o'-lantern pumpkin in coral with a teal outline and a candle glow; drops in at `at`. */
const DrawnPumpkin: React.FC<{x: number; y: number; w: number; at: number; out?: number}> = ({x, y, w, at, out = Infinity}) => {
  const g = useGFrame();
  if (g < at || g >= out) return null;
  const k = interpolate(g, [at, at + 6], [0, 1], {...clamp, easing: (v) => 1 - Math.pow(1 - v, 3)});
  const flick = 0.85 + 0.15 * noise2D('pk', g * 0.2, 0);
  const lobe = (cx: number, rx: number, shade: string) => <ellipse cx={cx} cy={225} rx={rx} ry={140} fill={shade} stroke="#B9473C" strokeWidth={5} />;
  return (
    <div style={{position: 'absolute', left: x, top: y + (1 - k) * 260, width: w, opacity: Math.min(1, k * 1.6),
      filter: `drop-shadow(3px 0 0 ${TEAL}) drop-shadow(-3px 0 0 ${TEAL}) drop-shadow(0 3px 0 ${TEAL}) drop-shadow(0 -3px 0 ${TEAL}) drop-shadow(0 22px 26px rgba(0,0,0,0.7))`}}>
      <svg viewBox="0 0 400 380" width="100%">
        <path d="M188,96 C186,60 194,34 214,18 L230,28 C214,42 208,64 212,96 Z" fill="#4b4636" stroke="#2a271d" strokeWidth={4} />
        {lobe(105, 95, '#E8584C')}
        {lobe(295, 95, '#E8584C')}
        {lobe(150, 105, '#F26557')}
        {lobe(250, 105, '#F26557')}
        {lobe(200, 85, CORAL)}
        <g fill="#2a1408">
          <path d="M112,200 L170,200 L141,150 Z" />
          <path d="M230,200 L288,200 L259,150 Z" />
          <path d="M188,232 L212,232 L200,210 Z" />
          <path d="M95,258 Q200,345 305,258 L288,270 L272,258 L256,282 L238,266 L220,292 L200,272 L180,292 L162,266 L144,282 L128,258 L112,270 Z" />
        </g>
        <g fill="#FFB347" opacity={0.55 * flick}>
          <path d="M122,197 L160,197 L141,163 Z" />
          <path d="M240,197 L278,197 L259,163 Z" />
          <path d="M120,268 Q200,322 280,268 L262,276 L246,288 L200,300 L154,288 L138,276 Z" />
        </g>
      </svg>
    </div>
  );
};

const TurnipScenes: React.FC<{t: TL}> = ({t}) => {
  const at = t.at;
  const pal = usePal();
  const f = useCurrentFrame();
  const c = {
    kids: at('made from') - 2, face: at('with a face') - 1, look: at('Look at this one') - 1, famine: at('Then, in 1845') - 1,
    left: at('Around two million') - 1, ship: at('many on ships') - 1, brought: at('And they brought') - 1, pumpkins: at('First, America') - 1,
    switched: at('So over time') - 1, upgrade: at('If you carve') - 1, loop: t.end('American upgrade') + 14,
  };
  const zoomFace = interpolate(f, [c.look, at('Way creepier'), at('Way creepier') + 30], [1.0, 1.08, 1.22], {...clamp, easing: Easing.inOut(Easing.sin)});
  const cuts: [number, React.ReactNode][] = [
    [0, <Cover2 />],
    [c.kids, (
      <AbsoluteFill>
        <VPic src="img/gen/tests/lay_pro2.png" size={[1376, 768]} c0={[600, 450]} c1={[540, 450]} z={[1.0, 1.06]} a={c.kids} b={c.face + 10} filter="contrast(1.04) saturate(1.05)" dy={450} />
        <Highlight text="TURNIP" x={80} y={200} size={140} at={at('turnips')} seed={44} rot={-3} />
        <Highlight text="LANTERNS" x={130} y={380} size={120} at={at('turnips') + 3} seed={45} rot={-2} />
        <Note text="Ireland, ~200 years ago" x={90} y={1000} size={58} rot={-3} at={c.kids + 4} color={WHITE} />
        <Tag text="Illustration · Halloween night in rural Ireland" y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.face, (
      <AbsoluteFill>
        <DarkPaper />
        <Prop name="turnip_lantern" x={190} y={360} w={700} at={c.face} coral trace from="top" />
        <Note text="a carved face" x={80} y={200} size={72} rot={-3} at={at('face carved') - 2} color={WHITE} />
        <Note text="+ a candle inside" x={300} y={1040} size={72} rot={-3} at={at('candle inside') - 3} color={pal.subject} />
      </AbsoluteFill>
    )],
    [c.look, (
      <AbsoluteFill>
        <TurnipPhoto z={zoomFace} top={430} />
        <Note text="a real one, in a museum" x={80} y={200} size={62} rot={-3} at={at('museum') - 3} color={WHITE} />
        <Note text="Ireland" x={600} y={290} size={70} rot={-3} at={at('in Ireland') - 2} color={TEAL} />
        <Highlight text="WAY CREEPIER" x={80} y={380} size={120} at={at('Way creepier')} seed={46} rot={-3} />
        <Tag text={TURNIP_TAG} y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.famine, (
      <AbsoluteFill>
        <VPic src="img/ch03/iln_searching_potatoes_stubble_field_1849.jpg" size={[1405, 1450]} c0={[640, 760]} c1={[640, 820]} z={[1.0, 1.08]} a={c.famine} b={c.left}
          tag="Searching for potatoes in a stubble field · Illustrated London News, 1849" />
        <Highlight text="1845" x={80} y={200} size={150} at={at('1845')} seed={47} rot={-3} />
        <Note text="the potatoes rot" x={90} y={420} size={74} rot={-3} at={at("Ireland's potatoes") - 3} color={pal.subject} />
      </AbsoluteFill>
    )],
    [c.left, (
      <AbsoluteFill>
        <VPic src="img/ch03/iln_emigrants_leaving_home_priests_blessing_1851.jpg" size={[3585, 2097]} c0={[1500, 1050]} c1={[2100, 1000]} z={[1.05, 1.15]} a={c.left} b={c.ship}
          tag="Irish emigrants leaving home: the priest's blessing · Illustrated London News, 1851" />
        <Stamp text="2,000,000" x={70} y={200} at={at('two million')} size={150} color={WHITE} />
        <Note text="left Ireland" x={110} y={370} size={70} rot={-3} at={at('left Ireland') - 2} color={WHITE} />
        <Note text="1,000,000+ to America" x={80} y={960} size={66} rot={-3} at={at('to America') - 4} color={TEAL} />
      </AbsoluteFill>
    )],
    [c.ship, (
      <AbsoluteFill>
        <VSil name="ch03_coffin_ship" size={ship.size} glowLayer={ship.glowLayer} a={c.ship} b={c.brought} fx={[0.45, 0.6]} z={[1.04, 1.12]} flicker={0.3} dy={250} />
        <Note text="crowded. sick." x={90} y={200} size={70} rot={-3} at={at('so crowded') - 2} color={WHITE} />
        <Highlight text="COFFIN SHIPS" x={70} y={320} size={130} at={at('coffin ships')} seed={48} rot={-3} />
        <Tag text="Illustration · an emigrant ship, 1840s" y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.brought, (
      <AbsoluteFill>
        <VSil name="ch02_hearth" size={hearth.size} glowLayer={hearth.glowLayer} a={c.brought} b={c.pumpkins} fx={[0.44, 0.5]} z={[1.04, 1.1]} dy={420} />
        <Note text="and they brought" x={90} y={200} size={64} rot={-3} at={c.brought + 2} color={WHITE} />
        <Highlight text="THEIR HALLOWEEN" x={60} y={300} size={94} at={at('their Halloween')} seed={49} rot={-3} />
        <Tag text="Illustration · an Irish cottage on Halloween night" y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.pumpkins, (
      <AbsoluteFill>
        <DarkPaper />
        <Highlight text="AMERICA HAD" x={70} y={190} size={110} at={at('America had')} seed={50} rot={-3} />
        <Highlight text="PUMPKINS" x={160} y={340} size={150} at={at('pumpkins')} seed={51} rot={-2} />
        <DrawnPumpkin x={130} y={560} w={560} at={at('pumpkins') - 2} />
        <Note text="big." x={700} y={640} size={80} rot={-4} at={at('Big') - 2} color={WHITE} />
        <Note text="cheap." x={700} y={750} size={80} rot={-4} at={at('cheap') - 2} color={WHITE} />
        <Note text="easy to carve." x={540} y={1010} size={70} rot={-4} at={at('easier to carve') - 2} color={TEAL} />
      </AbsoluteFill>
    )],
    [c.switched, (
      <AbsoluteFill>
        <DarkPaper />
        <Note text="the jack-o'-lantern" x={80} y={200} size={66} rot={-3} at={c.switched + 2} color={WHITE} />
        <Highlight text="SWITCHED" x={80} y={300} size={130} at={at('switched')} seed={52} rot={-3} />
        <Prop name="turnip_lantern" x={60} y={620} w={360} at={c.switched} from="none" />
        <Arrow x1={430} y1={800} x2={590} y2={800} bow={-40} at={at('switched') - 2} color={TEAL} width={7} />
        <DrawnPumpkin x={600} y={640} w={380} at={at('vegetables') - 2} />
        <Note text="turnip" x={140} y={1030} size={60} rot={-3} at={c.switched + 4} color={WHITE} />
        <Note text="pumpkin" x={680} y={1030} size={60} rot={-3} at={at('vegetables')} color={pal.subject} />
      </AbsoluteFill>
    )],
    [c.upgrade, (
      <AbsoluteFill>
        <DarkPaper />
        <Note text="carving one this week?" x={70} y={200} size={62} rot={-3} at={at('carve a pumpkin') - 2} out={at('American upgrade')} color={WHITE} />
        <PhotoCard src="img/ch02/postcard_boys_carry_jackolantern_c1910.jpg" x={90} y={520} w={900} rot={-2} at={c.upgrade} filter={BW} />
        <Loop cx={505} cy={795} rx={150} ry={130} at={at('carve a pumpkin') + 4} seed={53} color={CORAL} width={6} />
        <Highlight text="THE AMERICAN" x={70} y={180} size={100} at={at('American upgrade')} seed={54} rot={-3} />
        <Highlight text="UPGRADE" x={200} y={330} size={130} at={at('upgrade')} seed={55} rot={-2} />
        <Tag text="Halloween Greetings postcard, c. 1910 · Boston Public Library" y={TAG_Y} />
      </AbsoluteFill>
    )],
    [c.loop, <Cover2 />],
  ];
  return <>{useScene(cuts)}</>;
};

// ---------------------------------------------------------------------------------------------

const DEFS: ShortDef[] = [
  {id: 'VShort1', Scenes: BribeScenes,
    segs: [{ch: 'ch01', first: 'Tear gas.', last: 'On Halloween.'},
      {ch: 'ch01', first: 'This is a real front page', last: 'Halt Pranks.'},
      {ch: 'ch01', first: 'The night before', last: 'gassed them.'},
      {ch: 'ch04', first: 'It was a riot', last: 'in costume.'},
      {ch: 'ch04', first: 'Some towns came up', last: 'decided to pay.'},
      {ch: 'ch05', first: 'So listen to the words', last: 'with better costumes.'},
      {ch: 'ch05', first: 'And mostly, it worked.', last: 'over your outhouse.'},
      {ch: 'ch08', first: 'So when a kid knocks', last: 'pay up.'}],
    // the dark cue under the tear gas, then the chapter-5 bed (lighter) from "Some towns"
    beds: (t) => [
      {src: 'music/hb_black_halloween.mp3', vol: bed('hb_black_halloween'), startFrom: 31, to: t.at('Some towns') + 10},
      {src: 'music/m_1924.mp3', vol: bed('m_1924'), from: t.at('Some towns') - 14},
    ],
    whoosh: (t) => ['The night before', 'Some towns', 'So listen', "It's a deal", "It's a protection", 'And mostly', 'So when a kid'].map((p) => t.at(p) - 1),
    stamps: (t) => [t.at('about 300'), t.at('riot'), t.at('to pay'), t.at("It's a deal"), t.at('racket') + 3, t.at('it worked'), t.at('pay up')],
    writes: (t) => [t.at('North Dakota'), t.at('junk'), t.at('greeting'), t.at('Give me something'), t.at('or else'), t.at('better costumes'), t.at('this Saturday')]},
  {id: 'VShort2', Scenes: TurnipScenes,
    segs: [{ch: 'ch02', first: 'Kids carried lanterns', last: 'a candle inside.'},
      {ch: 'ch02', first: 'Look at this one.', last: 'than a pumpkin.'},
      {ch: 'ch03', first: 'Then, in 1845,', last: "Ireland's potatoes."},
      {ch: 'ch03', first: 'Around two million', last: 'them coffin ships.'},
      {ch: 'ch03', first: 'And they brought', last: 'with them.'},
      {ch: 'ch03', first: 'First, America had pumpkins.', last: 'American upgrade.'}],
    beds: () => [{src: 'music/hb_oiche_shamhna.mp3', vol: bed('hb_oiche_shamhna')}],
    whoosh: (t) => ['made from', 'with a face', 'Look at this one', 'Then, in 1845', 'Around two million', 'many on ships', 'And they brought', 'First, America', 'So over time', 'If you carve'].map((p) => t.at(p) - 1),
    stamps: (t) => [t.at('turnips'), t.at('Way creepier'), t.at('two million'), t.at('coffin ships'), t.at('pumpkins'), t.at('switched'), t.at('American upgrade')],
    writes: (t) => [t.at('face carved'), t.at('museum'), t.at("Ireland's potatoes"), t.at('left Ireland'), t.at('Big'), t.at('cheap'), t.at('carve a pumpkin')]},
];

export const VSHORTS = DEFS.map((d) => {
  const b = build(d.segs);
  return {id: d.id, frames: Math.ceil(b.n.duration * FPS) + OUTRO, C: () => <Shell d={d} b={b} />};
});
