// Five native vertical Shorts (1080x1920) cut from When Europe Ate Mummies. The narration is spliced from the chapter
// WAVs (hook line first, no new voice), scenes are rebuilt for 9:16 from the video's own images, masks and hand-drawn
// pieces, captions run three words at a time, and m_reveal's last accent (61.6 s into the cue) lands on each payoff.
//
// Safe zones: YouTube's UI covers the top ~150 px, the bottom ~400 px and the right ~150 px from y 900 down.
// Scene text stays in x 60–930, y 150–1150; captions at y ~1185; source tags at y ~1490.
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from './lib/anim';
import {makeTimeline, type Narration, type Word} from './lib/timing';
import {Arrow, Finish, Highlight, JF, Loop, Note, PALETTES, PaletteCtx, Picture, type Place, StepCtx, Tint, Traced, useGFrame, useHand, usePal} from './kit/Kit';
import {DarkPaper, Sfx, WRITE} from './kit/common';
import {Stamp, type TL, useScene} from './kit/shell';
import type {MaskRef} from './kit/maskref';
import {Captions, Mark} from './kit/vshort';
import {IndexCard, MOUNTAIN, MUMMY_CASE, type P, Sketch} from './draw';
import {Jar} from './jar';
import {IMG} from './images';
import {MASKS} from './masks';
import w1 from '../public/audio/ch01_cold_open.words.json';
import w2 from '../public/audio/ch02_the_typo.words.json';
import w3 from '../public/audio/ch03_the_trade.words.json';
import w4 from '../public/audio/ch04_the_fakes.words.json';
import w5 from '../public/audio/ch05_fresh.words.json';
import w7 from '../public/audio/ch07_the_party.words.json';
import w8 from '../public/audio/ch08_the_tube.words.json';
import w9 from '../public/audio/ch09_the_answer.words.json';

const FPS = 30;
const GAP = 0.3;
const OUTRO = 90;
const TAG_Y = 1490;
const ACCENT = 61.6; // seconds into m_reveal.mp3: its last strong hit
const CORAL = '#FF6F61';
const CH: Record<number, {n: Narration; wav: string}> = {
  1: {n: w1 as Narration, wav: 'audio/ch01_cold_open.wav'},
  2: {n: w2 as Narration, wav: 'audio/ch02_the_typo.wav'},
  3: {n: w3 as Narration, wav: 'audio/ch03_the_trade.wav'},
  4: {n: w4 as Narration, wav: 'audio/ch04_the_fakes.wav'},
  5: {n: w5 as Narration, wav: 'audio/ch05_fresh.wav'},
  7: {n: w7 as Narration, wav: 'audio/ch07_the_party.wav'},
  8: {n: w8 as Narration, wav: 'audio/ch08_the_tube.wav'},
  9: {n: w9 as Narration, wav: 'audio/ch09_the_answer.wav'},
};

type Seg = [ch: number, first: string, last: string];
type Built = {segs: {wav: string; from: number; to: number; at: number}[]; n: Narration; storyEnd: number};
const SUB: Seg = [9, 'If you want', 'next time.'];

/** Splice the lines back to back (the subscribe line last); word times become local to the Short. */
const build = (segs: Seg[]): Built => {
  let t = 0.25;
  const out: Built['segs'] = [];
  const words: Word[] = [];
  let storyEnd = 0;
  for (const s of [...segs, SUB]) {
    const {n, wav} = CH[s[0]];
    const tl = makeTimeline(n, FPS);
    const i0 = tl.idx(s[1]);
    let i1 = i0;
    const lastToks = s[2].split(/\s+/).length;
    // the end phrase is the first match at or after the start phrase
    for (let k = i0; k < n.words.length; k++) {
      const probe = n.words.slice(k, k + lastToks).map((w) => w.w.toLowerCase().replace(/[^a-z0-9]/g, '')).join(' ');
      if (probe === s[2].toLowerCase().split(/\s+/).map((x) => x.replace(/[^a-z0-9]/g, '')).join(' ')) { i1 = k + lastToks - 1; break; }
    }
    if (s === SUB) storyEnd = t;
    const from = n.words[i0].s - 0.12, to = n.words[i1].e + 0.2;
    out.push({wav, from, to, at: t});
    for (let i = i0; i <= i1; i++) words.push({...n.words[i], s: n.words[i].s - from + t, e: n.words[i].e - from + t});
    t += to - from + GAP;
  }
  return {segs: out, n: {voice: 'spliced', duration: t, words}, storyEnd};
};

// ---------- vertical scene pieces ----------
/** Placement filling 1080x1920, putting source (fx, fy) at screen (540, sy) where possible. */
const vfill = (size: [number, number], fx: number, fy: number, z: number, sy = 700): Place => {
  const sc = Math.max(1080 / size[0], 1920 / size[1]) * z;
  return {left: Math.min(0, Math.max(1080 - size[0] * sc, 540 - fx * sc)), top: Math.min(0, Math.max(1920 - size[1] * sc, sy - fy * sc)), scale: sc};
};
type S = (x: number, y: number) => number[];
const VPhoto: React.FC<{src: string; size: [number, number]; fx: number; fy: number; z0?: number; z1?: number; a: number; b: number; sy?: number; mask?: MaskRef; traceAt?: number;
  bw?: string; tag?: string; children?: (S: S) => React.ReactNode}> = ({src, size, fx, fy, z0 = 1.02, z1 = 1.1, a, b, sy, mask, traceAt, bw = 'grayscale(1) contrast(1.2)', tag, children}) => {
  const f = useCurrentFrame();
  const place = vfill(size, fx, fy, interpolate(f, [a, b], [z0, z1], clamp), sy);
  const S: S = (x, y) => [place.left + x * place.scale, place.top + y * place.scale];
  return (
    <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
      <Picture src={src} place={place} size={size} bw={bw} />
      {mask && <Tint mask={mask.alpha} place={place} size={size} />}
      {mask && <Traced paths={mask.data.shapes.subject} place={place} at={traceAt ?? a + 4} dur={12} width={6} />}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,7,5,0.55) 0%, rgba(8,7,5,0) 22%, rgba(8,7,5,0) 50%, rgba(8,7,5,0.7) 70%)'}} />
      {children?.(S)}
      {tag && <VTag text={tag} />}
    </AbsoluteFill>
  );
};
const VTag: React.FC<{text: string}> = ({text}) => (
  <div style={{position: 'absolute', left: 60, top: TAG_Y, width: 860, fontFamily: JF.mono, fontSize: 22, letterSpacing: 1, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', textShadow: '0 1px 6px #000'}}>{text}</div>
);
const Desk: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill><DarkPaper />{children}</AbsoluteFill>;
const Card: React.FC<{src: string; x: number; y: number; w: number; h?: number; rot?: number; at: number; pos?: string; filter?: string}> = ({src, x, y, w, h, rot = -2, at, pos = '50% 40%', filter = 'grayscale(1) contrast(1.15)'}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 5], [0.7, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `scale(${k}) rotate(${rot}deg)`, background: '#f4efe6', padding: 14, boxShadow: '0 24px 44px rgba(0,0,0,0.7)'}}>
      <Img src={staticFile(src)} style={{width: '100%', height: h, objectFit: 'cover', objectPosition: pos, display: 'block', filter}} />
    </div>
  );
};
const Box: React.FC<{S: S; x0: number; y0: number; x1: number; y1: number; at: number; color?: string}> = ({S, x0, y0, x1, y1, at, color}) => {
  const [a, b] = S(x0, y0);
  const [c, d] = S(x1, y1);
  return <Sketch pts={[[a, b], [c, b], [c, d], [a, d], [a, b + 6]]} x={0} y={0} at={at} dur={10} width={7} smooth={false} color={color} />;
};
const Strike: React.FC<{x0: number; y: number; x1: number; at: number}> = ({x0, y, x1, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0}} width={1080} height={1920}>
      <path d={`M${x0},${y} L${x1},${y - 18}`} stroke="#FF9F1C" strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={Math.max(0, 1 - (g - at) / 5)} />
    </svg>
  );
};

/** The hook cover: fully drawn on frame 0, holds about a second, fades by frame 45. */
const Cover: React.FC<{lines: {text: string; x: number; y: number; size: number}[]; note?: string; noteY?: number}> = ({lines, note, noteY = 1000}) => {
  const f = useCurrentFrame();
  if (f >= 45) return null;
  return (
    <AbsoluteFill style={{opacity: interpolate(f, [28, 45], [1, 0], clamp)}}>
      <AbsoluteFill style={{background: 'rgba(8,7,5,0.35)'}} />
      {lines.map((l, i) => <Highlight key={i} text={l.text} x={l.x} y={l.y} size={l.size} at={-40} seed={200 + i} rot={i % 2 ? -2 : -3} />)}
      {note && <Note text={note} x={90} y={noteY} size={66} rot={-3} at={-40} color="#ffffff" />}
    </AbsoluteFill>
  );
};

/** The outro, under the subscribe line: the full video's title, a subscribe arrow at YouTube's button, then a hold. */
const Outro: React.FC<{t: TL; at: number}> = ({t, at}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  if (f < at) return null;
  const sub = t.at('subscribe');
  return (
    <AbsoluteFill style={{opacity: interpolate(f, [at, at + 8], [0, 1], clamp)}}>
      <DarkPaper />
      <Note text="the full story:" x={100} y={300} size={72} rot={-3} at={at} color="#ffffff" />
      <Highlight text="WHEN EUROPE" x={80} y={430} size={130} at={at + 3} seed={301} rot={-3} />
      <Highlight text="ATE MUMMIES" x={110} y={610} size={130} at={at + 6} seed={302} rot={-2} />
      <Note text="on the channel" x={130} y={830} size={78} rot={-3} at={at + 10} color={pal.subject} />
      <Note text="subscribe" x={180} y={1100} size={78} rot={-4} at={sub - 2} />
      <Arrow x1={400} y1={1200} x2={560} y2={1430} bow={40} width={8} at={sub + 2} dur={8} />
    </AbsoluteFill>
  );
};

type Def = {id: string; segs: Seg[]; payoff: [string, number?]; cover: React.ReactNode; cuts: (t: TL) => [number, React.ReactNode][]; writes?: (t: TL) => number[]; stamps?: (t: TL) => number[]};

const Short: React.FC<{d: Def; b: Built}> = ({d, b}) => {
  const t = makeTimeline(b.n, FPS);
  const end = Math.round(b.storyEnd * FPS);
  const cuts = d.cuts(t);
  const scene = useScene(cuts);
  const payoff = t.at(d.payoff[0], d.payoff[1] ?? 1) / FPS;
  const startFrom = Math.max(0, Math.round((ACCENT - payoff) * FPS));
  const total = Math.ceil(b.n.duration * FPS) + OUTRO;
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <StepCtx.Provider value={2.5}>
        <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
          {scene}
          {d.cover}
          <Outro t={t} at={end - 6} />
          <Captions n={b.n} until={end - 6} />
          <Mark />
          <Finish vignette={0.25} />
          {b.segs.map((s, i) => (
            <Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={Math.ceil((s.to - s.from) * FPS) + 2} layout="none">
              <Audio src={staticFile(s.wav)} startFrom={Math.round(s.from * FPS)} />
            </Sequence>
          ))}
          <Audio src={staticFile('music/m_reveal.mp3')} startFrom={startFrom}
            volume={(f) => interpolate(f, [0, 8, total - 50, total - 10], [0, 0.2, 0.2, 0], clamp)} />
          {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.28} />)}
          {(d.writes?.(t) ?? []).map((f, i) => <Sfx key={`w${i}`} at={f - 2} src={WRITE.src} volume={WRITE.volume} />)}
          {(d.stamps?.(t) ?? []).map((f, i) => <Sfx key={`s${i}`} at={f} src="sfx/stamp.wav" volume={0.3} />)}
          <Sfx at={end} src="sfx/stamp.wav" volume={0.3} />
        </AbsoluteFill>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};

// ---------- 1 · Mummy, by the kilo ----------
const merckLineScene = (t: TL) => (
  <VPhoto src={IMG.merckPage.src} size={IMG.merckPage.size} fx={1240} fy={3404} z0={1.18} z1={1.25} a={0} b={t.at('Supplies lasted')} sy={640}
    bw="grayscale(1) contrast(1.15) sepia(0.25)" tag="E. Merck, Preis-Liste, 1903, p. 254 · Internet Archive">
    {(S) => {
      const [ux0, uy] = S(240, 3440);
      const [ux1] = S(1030, 3440);
      const [px, py] = S(2160, 3404);
      const [sx0] = S(1050, 3440);
      const [sx1] = S(1545, 3440);
      return (
        <>
          <Sketch pts={[[ux0, uy], [ux1, uy + 4]]} x={0} y={0} at={t.at('Mumia vera')} dur={8} width={7} smooth={false} />
          <Note text="= genuine Egyptian mummy" x={70} y={uy + 60} size={58} rot={-3} at={t.at('Genuine')} />
          <Loop cx={Math.min(px, 980)} cy={py} rx={120} ry={70} at={t.at('Seventeen')} seed={4} color={CORAL} />
          <Note text="17.50 marks a kilo" x={420} y={uy + 170} size={56} rot={-3} at={t.at('Seventeen') + 4} color="#ffffff" />
          <Sketch pts={[[sx0, uy + 4], [sx1, uy + 8]]} x={0} y={0} at={t.at('While supplies')} dur={6} width={7} smooth={false} color="#FF9F1C" />
          {useGFrame() >= t.at('While supplies') && <Highlight text="WHILE SUPPLIES LAST" x={60} y={uy + 290} size={84} at={t.at('While supplies')} seed={12} rot={-2} />}
        </>
      );
    }}
  </VPhoto>
);
const S1: Def = {
  id: 'VShort1',
  segs: [[1, 'Mumia vera', 'supplies last.'], [1, 'Supplies lasted', 'the catalog.'], [1, 'For centuries', 'Scientists did it.'], [3, 'Bruises', 'pretty much everything.'],
    [1, 'And when the real', 'fresher ones.'], [9, 'It started with', 'became a body.'], [2, 'Somebody read', 'wrote people.']],
  payoff: ['wrote people'],
  cover: <Cover lines={[{text: 'MUMMY.', x: 70, y: 280, size: 160}, {text: 'BY THE KILO.', x: 90, y: 490, size: 120}]} />,
  cuts: (t) => [
    [0, merckLineScene(t)],
    [t.at('Supplies lasted') - 1, (
      <VPhoto src={IMG.carter.src} size={IMG.carter.size} fx={620} fy={560} a={t.at('Supplies lasted')} b={t.at('For centuries')} tag="Howard Carter at Tutankhamun's coffin, c. 1925 · Library of Congress">
        {() => (
          <>
            <Note text="(supplies lasted.)" x={80} y={230} size={66} rot={-3} at={t.at('Supplies lasted')} color={CORAL} />
            <Stamp text="1924" x={80} y={340} at={t.at('In 1924')} size={170} color="#f4efe6" rot={-4} />
            <Note text="Tut's tomb: found 1922" x={80} y={550} size={56} rot={-3} at={t.at('Tutankhamuns')} color="#ffffff" />
            <Note text="mummy: still in the catalog" x={70} y={1010} size={58} rot={-3} at={t.at('still in')} color={CORAL} />
          </>
        )}
      </VPhoto>
    )],
    [t.at('For centuries') - 1, (
      <Desk>
        <Jar x={50} y={300} h={720} at={t.at('For centuries')} labels={[{text: 'MUMIA', at: t.at('For centuries') + 8, size: 10}]} fill={[[t.at('For centuries') + 10, 0], [t.at('For centuries') + 26, 0.8]]} />
        <Highlight text="FOR CENTURIES" x={60} y={180} size={88} at={t.at('For centuries')} seed={14} rot={-2} />
        <Note text="eaten as medicine" x={540} y={420} size={52} rot={-3} at={t.at('ate mummies')} color="#ffffff" />
        <Note text="kings ✓" x={560} y={560} size={68} rot={-4} at={t.at('Kings')} />
        <Note text="scientists ✓" x={540} y={700} size={60} rot={-4} at={t.at('Scientists')} />
      </Desk>
    )],
    [t.at('Bruises') - 1, (
      <VPhoto src={IMG.apothecary.src} size={IMG.apothecary.size} fx={570} fy={380} a={t.at('Bruises')} b={t.at('And when')} mask={MASKS.apothecary} sy={760} tag="Illustration · An apothecary grinding mumia, London, c. 1650">
        {() => (
          <>
            {[['bruises', 'Bruises'], ['bleeding', 'bleeding'], ['coughs', 'coughs'], ['headaches', 'headaches'], ['poison', 'poison']].map(([w, k], i) => (
              <Note key={k} text={`${w} ✓`} x={80 + (i % 2) * 420} y={190 + Math.floor(i / 2) * 110} size={60} rot={-4} at={t.at(k)} />
            ))}
            <Note text="pretty much everything." x={70} y={1010} size={62} rot={-3} at={t.at('pretty much')} color={CORAL} />
          </>
        )}
      </VPhoto>
    )],
    [t.at('And when') - 1, (
      <Desk>
        <Jar x={270} y={260} h={760} at={t.at('And when') - 4} labels={[{text: 'MUMIA', at: t.at('And when') - 4, size: 10}]}
          fill={[[t.at('And when'), 0.8], [t.at('ran out'), 0.8], [t.at('ran out') + 12, 0.04], [t.at('fresher'), 0.04], [t.at('fresher') + 12, 0.85]]} />
        <Note text="real mummies: ran out" x={110} y={180} size={56} rot={-3} at={t.at('ran out')} color="#ffffff" />
        <Note text="→ fresher ones" x={220} y={1040} size={76} rot={-4} at={t.at('fresher')} color={CORAL} />
      </Desk>
    )],
    [t.at('It started') - 1, (
      <Desk>
        <Note text="it started with a translation" x={80} y={200} size={58} rot={-3} at={t.at('translation')} color="#ffffff" />
        <Sketch pts={MOUNTAIN} x={290} y={420} s={0.95} at={t.at('It started')} dur={10} width={8} to={MUMMY_CASE} ma={t.at('A rock')} mb={t.at('body') + 4} />
        <Note text="a rock → a body" x={260} y={950} size={70} rot={-3} at={t.at('A rock')} />
      </Desk>
    )],
    [t.at('Somebody') - 1, (
      <Desk>
        <Note text="somebody read" x={110} y={260} size={66} rot={-3} at={t.at('Somebody')} color="#ffffff" />
        <Note text="pitch" x={220} y={400} size={170} rot={-4} at={t.at('read pitch')} />
        <Strike x0={200} y={560} x1={720} at={t.at('wrote') - 2} />
        <Note text="and wrote" x={120} y={700} size={66} rot={-3} at={t.at('wrote')} color="#ffffff" />
        <Note text="people." x={260} y={820} size={190} rot={-4} at={t.at('wrote people') + 6} color={CORAL} />
      </Desk>
    )],
  ],
  writes: (t) => ['Genuine', 'Seventeen', 'Supplies lasted', 'Tutankhamuns', 'still in', 'ate mummies', 'Kings', 'Scientists', 'Bruises', 'bleeding', 'coughs', 'headaches', 'poison', 'pretty much', 'ran out', 'fresher', 'translation', 'A rock', 'Somebody', 'read pitch', 'wrote'].map((p) => t.at(p)),
  stamps: (t) => [t.at('While supplies'), t.at('In 1924'), t.at('For centuries')],
};

// ---------- 2 · Made in France ----------
const S2: Def = {
  id: 'VShort2',
  segs: [[4, 'Genuine Egyptian', 'Made in France.'], [4, 'In 1564', 'four years.'], [4, 'Enslaved', 'and dried.'], [4, 'Ancient Egyptian', 'four years.'], [4, 'And the fakes', 'an oven.'], [4, "Pomet's verdict", 'catching fish.']],
  payoff: ['catching fish'],
  cover: <Cover lines={[{text: 'GENUINE EGYPTIAN', x: 50, y: 280, size: 100}, {text: 'MUMMY…', x: 60, y: 420, size: 120}, {text: 'MADE IN FRANCE', x: 60, y: 900, size: 110}]} />,
  cuts: (t) => [
    [0, (
      <VPhoto src={IMG.oven.src} size={IMG.oven.size} fx={430} fy={460} z0={1.0} z1={1.06} a={0} b={t.at('In 1564')} mask={MASKS.oven_bundles} traceAt={6} sy={700} tag="Illustration · Drying fake mummies, Lyon, c. 1690">
        {() => (
          <>
            <Note text="genuine Egyptian mummy..." x={70} y={200} size={60} rot={-3} at={t.at('Genuine')} color="#ffffff" />
            {useGFrame() >= t.at('Made in') && <Highlight text="MADE IN FRANCE" x={60} y={1000} size={96} at={t.at('Made in')} seed={21} rot={-3} />}
          </>
        )}
      </VPhoto>
    )],
    [t.at('In 1564') - 1, (
      <VPhoto src={IMG.alexandriaMap.src} size={IMG.alexandriaMap.size} fx={1920} fy={1400} a={t.at('In 1564')} b={t.at('The dealer')} tag="Braun & Hogenberg, Alexandria, c. 1575 · BnF">
        {() => (
          <>
            <Stamp text="1564" x={70} y={200} at={t.at('In 1564')} size={170} color="#f4efe6" rot={-4} />
            <Note text="a French royal physician" x={70} y={420} size={58} rot={-3} at={t.at('French royal')} color="#ffffff" />
            <Note text="visits a mummy dealer" x={90} y={1000} size={62} rot={-3} at={t.at('visited')} />
          </>
        )}
      </VPhoto>
    )],
    [t.at('The dealer') - 1, (
      <VPhoto src={IMG.dealer.src} size={IMG.dealer.size} fx={780} fy={420} a={t.at('The dealer')} b={t.at('Ancient Egyptian')} mask={MASKS.dealer} sy={720} tag="Illustration · A mummy dealer's storeroom, Alexandria, 1564">
        {() => (
          <>
            <Stamp text="30–40 BODIES" x={60} y={200} at={t.at('thirty')} size={100} color="#f4efe6" rot={-3} />
            <Note text="none ancient." x={80} y={350} size={84} rot={-4} at={t.at('none')} color={CORAL} />
            <Note text="all made in the last 4 years" x={70} y={480} size={54} rot={-3} at={t.at('last four')} />
            <Note text="enslaved people, and others" x={70} y={940} size={56} rot={-3} at={t.at('Enslaved')} color="#ffffff" />
            <Note text="pitch · wrapped · dried" x={90} y={1040} size={56} rot={-3} at={t.at('Filled')} />
          </>
        )}
      </VPhoto>
    )],
    [t.at('Ancient Egyptian') - 1, (
      <Desk>
        <Jar x={240} y={250} h={800} at={t.at('Ancient Egyptian') - 2}
          labels={[{text: 'MUMIA', at: t.at('Ancient Egyptian') - 2, size: 10}, {text: 'ANCIENT*', at: t.at('Ancient Egyptian') + 2, size: 8, strike: true, small: '*aged 4 years'}]} fill={[[0, 0.75]]} />
        <Note text="*aged a full four years" x={150} y={1060} size={64} rot={-3} at={t.at('Aged')} color={CORAL} />
      </Desk>
    )],
    [t.at('And the fakes') - 1, (
      <Desk>
        <Note text="not only made in Egypt..." x={70} y={180} size={58} rot={-3} at={t.at('And the fakes')} color="#ffffff" />
        <Card src={IMG.pomet.src} x={110} y={300} w={460} h={620} at={t.at('And the fakes') + 2} pos="50% 35%" />
        <Stamp text="1694" x={620} y={340} at={t.at('In 1694')} size={150} color="#f4efe6" rot={-4} />
        <Note text="Pierre Pomet," x={600} y={560} size={58} rot={-3} at={t.at('Pierre')} color="#ffffff" />
        <Note text="the king's" x={620} y={660} size={54} rot={-3} at={t.at('drug expert')} />
        <Note text="drug expert" x={620} y={750} size={54} rot={-3} at={t.at('drug expert') + 4} />
        <VTag text="Pierre Pomet, engraved portrait, 1694 · Wellcome Collection" />
      </Desk>
    )],
    [t.at('mummies were arriving') - 1, (
      <VPhoto src={IMG.oven.src} size={IMG.oven.size} fx={620} fy={420} z0={1.05} z1={1.12} a={t.at('mummies were arriving')} b={t.at("Pomet's verdict")} mask={MASKS.oven_bundles} sy={700} tag="Illustration · Drying fake mummies, Lyon, c. 1690">
        {() => (
          <>
            <Note text="arriving from Venice + Lyon" x={70} y={200} size={58} rot={-3} at={t.at('arriving')} color="#ffffff" />
            <Note text="recent bodies" x={80} y={940} size={66} rot={-4} at={t.at('Recent')} />
            <Note text="+ pitch + an oven" x={100} y={1050} size={60} rot={-3} at={t.at('stuffed')} />
          </>
        )}
      </VPhoto>
    )],
    [t.at("Pomet's verdict") - 1, (
      <VPhoto src={IMG.pomet1712Plate.src} size={IMG.pomet1712Plate.size} fx={2250} fy={1800} z0={1.0} z1={1.06} a={t.at("Pomet's verdict")} b={t.at('If you want')} sy={720}
        bw="grayscale(1) contrast(1.15) sepia(0.2)" tag="Pomet, A Compleat History of Druggs, 1712 · Internet Archive">
        {() => (
          <>
            <Note text="Pomet's verdict on the finest grade:" x={60} y={200} size={50} rot={-3} at={t.at("Pomet's verdict")} color="#ffffff" />
            <Note text="its greatest use:" x={80} y={880} size={62} rot={-3} at={t.at('greatest use')} color="#ffffff" />
            <Stamp text="FISH BAIT" x={70} y={970} at={t.at('catching fish')} size={160} color={CORAL} rot={-6} />
          </>
        )}
      </VPhoto>
    )],
  ],
  writes: (t) => ['Genuine', 'French royal', 'visited', 'none', 'last four', 'Enslaved', 'Filled', 'Aged', 'And the fakes', 'Pierre', 'drug expert', 'arriving', 'Recent', 'stuffed', "Pomet's verdict", 'greatest use'].map((p) => t.at(p)),
  stamps: (t) => [t.at('Made in'), t.at('In 1564'), t.at('thirty'), t.at('In 1694'), t.at('catching fish')],
};

// ---------- 3 · The princess was a man ----------
const BUNDLE: P[] = [[20, 95], [30, 55], [70, 35], [120, 45], [150, 70], [230, 60], [330, 55], [430, 60], [520, 70], [585, 85], [600, 105], [585, 125], [520, 135], [430, 140], [330, 140], [230, 138], [150, 130], [120, 150], [70, 158], [30, 140]];
const TagCard: React.FC<{at: number; man: number}> = ({at, man}) => {
  const g = useGFrame();
  const hand = useHand();
  if (g < at) return null;
  const k = interpolate(g, [man - 4, man + 2], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 120, top: 330, width: 820, height: 200, background: '#e9dcc0', transform: 'rotate(-5deg)', boxShadow: '0 12px 24px rgba(0,0,0,0.5)', borderRadius: '0 22px 22px 0'}}>
      <div style={{position: 'absolute', left: 30, top: 24, fontFamily: JF.mono, fontSize: 26, color: '#555', letterSpacing: 2}}>CONTENTS</div>
      <div style={{position: 'absolute', left: 30, top: 66, fontFamily: hand.family, fontSize: 40 * hand.scale, color: '#2a2418', whiteSpace: 'nowrap', lineHeight: 1}}>
        <span style={{position: 'relative'}}>{k < 1 ? 'DAUGHTER' : 'SON'}
          {k > 0 && k < 1 && <span style={{position: 'absolute', left: -4, top: '50%', height: 6, width: `${k * 110}%`, background: '#FF9F1C'}} />}
        </span> of the High Priest
      </div>
    </div>
  );
};
const S3: Def = {
  id: 'VShort3',
  segs: [[7, 'The princess', 'a man.'], [7, 'The rich', 'an audience.'], [7, 'That same', 'signed up.'], [7, 'Halfway', 'a man.'], [7, "Gliddon's explanation", 'Boston applauded.']],
  payoff: ['Boston applauded'],
  cover: <Cover lines={[{text: 'THE PRINCESS', x: 60, y: 260, size: 130}, {text: 'WAS A MAN.', x: 90, y: 440, size: 140}]} />,
  cuts: (t) => [
    [0, (
      <VPhoto src={IMG.party.src} size={IMG.party.size} fx={470} fy={420} z0={1.0} z1={1.06} a={0} b={t.at('The rich')} mask={MASKS.party_bundle} traceAt={6} sy={760} tag="Illustration · A mummy unwrapping party, 1850">
        {() => <Note text="the princess was a man." x={70} y={1010} size={70} rot={-3} at={t.at('The princess') + 2} color={CORAL} />}
      </VPhoto>
    )],
    [t.at('The rich') - 1, (
      <VPhoto src={IMG.denon.src} size={IMG.denon.size} fx={1150} fy={950} a={t.at('The rich')} b={t.at('That same')} sy={760} tag="'Mr. Denon unrolling a mummy', c. 1820 · Library of Congress">
        {() => (
          <>
            <Note text="the 1800s: the rich found a new hobby" x={60} y={200} size={50} rot={-3} at={t.at('The rich')} color="#ffffff" />
            <Note text="unwrap them." x={80} y={960} size={92} rot={-4} at={t.at('Unwrap')} color={CORAL} />
            <Note text="in front of an audience" x={100} y={1080} size={56} rot={-3} at={t.at('audience')} />
          </>
        )}
      </VPhoto>
    )],
    [t.at('That same') - 1, (
      <VPhoto src={IMG.party.src} size={IMG.party.size} fx={900} fy={380} z0={1.0} z1={1.08} a={t.at('That same')} b={t.at('The poster')} sy={760} tag="Illustration · A mummy unwrapping party, 1850">
        {() => (
          <>
            {useGFrame() >= t.at('Boston') && <Highlight text="BOSTON, 1850" x={60} y={190} size={110} at={t.at('Boston')} seed={31} rot={-2} />}
            <Note text="George Gliddon, lecturer" x={70} y={380} size={58} rot={-3} at={t.at('Gliddon')} color="#ffffff" />
            <Note text="$5 = 4 tickets, 3 lectures" x={70} y={1010} size={62} rot={-3} at={t.at('Five dollars')} />
          </>
        )}
      </VPhoto>
    )],
    [t.at('The poster') - 1, (
      <Desk>
        <Card src={IMG.gliddon.src} x={110} y={180} w={860} h={600} at={t.at('The poster')} pos="50% 30%" rot={-1.5} />
        <Note text="'Daughter of the" x={80} y={860} size={74} rot={-4} at={t.at('Daughter')} color={CORAL} />
        <Note text="High Priest of Thebes'" x={110} y={970} size={74} rot={-4} at={t.at('High Priest')} color={CORAL} />
        <Note text="top doctors + scientists signed up" x={70} y={1080} size={46} rot={-3} at={t.at('signed up')} color="#ffffff" />
        <VTag text="Gliddon's broadsheet, Boston, 1850 · American Antiquarian Society" />
      </Desk>
    )],
    [t.at('Halfway') - 1, (
      <Desk>
        <Sketch pts={[[-40, 175], [680, 175]]} x={180} y={600} at={t.at('Halfway')} dur={8} width={6} smooth={false} color="#EDE7DC" />
        <Sketch pts={BUNDLE} x={180} y={600} at={t.at('Halfway') + 3} dur={14} width={8} closed />
        <TagCard at={t.at('Halfway') + 8} man={t.at('a man', 2)} />
        <Note text="doctors on stage: arguing" x={70} y={180} size={56} rot={-3} at={t.at('arguing')} color="#ffffff" />
        <Note text="last lecture: agreed." x={90} y={860} size={56} rot={-3} at={t.at('agreed')} color="#ffffff" />
        <Note text="the princess was a man." x={70} y={980} size={74} rot={-3} at={t.at('a man', 2)} color={CORAL} />
      </Desk>
    )],
    [t.at("Gliddon's explanation") - 1, (
      <Desk>
        <Note text="Gliddon's explanation:" x={80} y={200} size={64} rot={-3} at={t.at("Gliddon's explanation")} color="#ffffff" />
        <Note text="the labels got switched" x={90} y={330} size={66} rot={-3} at={t.at('labels')} />
        <Note text="during embalming." x={110} y={440} size={66} rot={-3} at={t.at('embalming')} />
        <Stamp text="FILING ERROR" x={60} y={610} at={t.at('Three thousand')} size={130} color={CORAL} rot={-4} />
        <Note text="(3,000 years ago)" x={160} y={790} size={66} rot={-3} at={t.at('Three thousand') + 6} color="#ffffff" />
        <Note text="Boston applauded." x={140} y={960} size={84} rot={-4} at={t.at('applauded')} />
      </Desk>
    )],
  ],
  writes: (t) => ['The rich', 'Unwrap', 'audience', 'Gliddon', 'Five dollars', 'Daughter', 'High Priest', 'signed up', 'arguing', 'agreed', "Gliddon's explanation", 'labels', 'embalming', 'applauded'].map((p) => t.at(p)),
  stamps: (t) => [t.at('Boston'), t.at('Three thousand')],
};

// ---------- 4 · A real recipe ----------
const recipeLines = (t: TL, pre: boolean) => [
  {text: 'a red-haired man', at: pre ? -999 : t.at('Take the body'), tick: true},
  {text: 'age 24', at: pre ? -999 : t.at('Twenty-four'), tick: true},
  {text: 'hanged, or broken on the wheel', at: pre ? -999 : t.at('Hanged'), tick: true},
  ...(pre ? [
    {text: '1 day + 1 night, sun & moon', at: t.at('Leave him'), tick: true},
    {text: 'cut into small pieces', at: t.at('Cut the'), tick: true},
    {text: 'myrrh, aloe, spirit of wine', at: t.at('Soak'), tick: true},
    {text: 'dry.', at: t.at('Dry'), tick: true},
  ] : []),
];
const S4: Def = {
  id: 'VShort4',
  segs: [[5, 'Take the body', 'the wheel.'], [5, "That's a real", 'for decades.'], [5, 'A popular theory', 'pharaoh.'], [5, 'So in 1609', 'your own.'], [5, 'Leave him', 'Dry.'], [5, 'Why red', 'that sentence.']],
  payoff: ['that sentence'],
  cover: <Cover lines={[{text: 'THIS WAS A', x: 60, y: 200, size: 120}, {text: 'REAL RECIPE.', x: 80, y: 360, size: 130}]} note="(a medical book, 1609)" noteY={1060} />,
  cuts: (t) => [
    [0, (
      <Desk>
        <IndexCard x={60} y={520} w={960} h={460} at={-40} rot={-2} title="RECIPE: MODERN MUMMY · 1609" size={46} lineH={88} lines={recipeLines(t, false)} />
      </Desk>
    )],
    [t.at("That's a real") - 1, (
      <VPhoto src={IMG.crollPage.src} size={IMG.crollPage.size} fx={950} fy={1310} z0={1.1} z1={1.16} a={t.at("That's a real")} b={t.at('A popular')} sy={680}
        bw="grayscale(1) contrast(1.15) sepia(0.25)" tag="Croll, Basilica Chymica (1635 printing) · BIU Santé / Internet Archive">
        {(S) => {
          const [rx, ry] = S(1190, 1210);
          return (
            <>
              <Box S={S} x0={330} y0={1160} x1={1560} y1={1470} at={t.at("That's a real") + 4} />
              <Loop cx={Math.min(rx, 960)} cy={ry} rx={100} ry={52} at={t.at("That's a real") + 10} seed={52} color={CORAL} />
              <Note text="a real recipe." x={80} y={200} size={84} rot={-4} at={t.at('real recipe')} color={CORAL} />
              <Note text="printed in a medical book" x={80} y={960} size={58} rot={-3} at={t.at('printed')} color="#ffffff" />
              <Note text="copied for decades" x={100} y={1060} size={58} rot={-3} at={t.at('copied')} />
            </>
          );
        }}
      </VPhoto>
    )],
    [t.at('A popular') - 1, (
      <Desk>
        <Note text="the theory:" x={70} y={180} size={60} rot={-3} at={t.at('A popular')} color="#ffffff" />
        <Note text="young ✓  healthy ✓  died suddenly ✓" x={60} y={290} size={46} rot={-3} at={t.at('young')} />
        <Card src={IMG.mummyCase.src} x={80} y={420} w={340} h={560} at={t.at('By that')} />
        <Sketch pts={[[80, 430], [440, 1000]]} x={0} y={0} at={t.at('pharaoh')} dur={5} width={14} color="#FF9F1C" smooth={false} />
        <Sketch pts={[[440, 430], [80, 1000]]} x={0} y={0} at={t.at('pharaoh') + 4} dur={5} width={14} color="#FF9F1C" smooth={false} />
        <Jar x={560} y={420} h={600} at={t.at('fresh body')} labels={[{text: 'FRESH', at: t.at('fresh body') + 4, size: 10}]} fill={[[t.at('fresh body'), 0], [t.at('fresh body') + 14, 0.85]]} />
      </Desk>
    )],
    [t.at('So in 1609') - 1, (
      <Desk>
        <Card src={IMG.crollTitle.src} x={110} y={330} w={500} h={700} at={t.at('So in 1609')} pos="50% 30%" />
        <Stamp text="1609" x={560} y={200} at={t.at('So in 1609')} size={160} color="#f4efe6" rot={-4} />
        <Note text="Oswald Croll," x={600} y={600} size={60} rot={-3} at={t.at('Oswald')} color="#ffffff" />
        <Note text="chemist" x={640} y={700} size={60} rot={-3} at={t.at('chemist')} />
        <Note text="a recipe for making your own." x={80} y={1070} size={56} rot={-3} at={t.at('making your own')} color={CORAL} />
        <VTag text="Croll, Basilica Chymica (1635 printing) · BIU Santé" />
      </Desk>
    )],
    [t.at('Leave him') - 1, (
      <Desk>
        <IndexCard x={60} y={260} w={960} h={820} at={t.at('Leave him') - 4} rot={-2} title="RECIPE: MODERN MUMMY · 1609" size={46} lineH={88} lines={recipeLines(t, true)} />
      </Desk>
    )],
    [t.at('Why red') - 1, (
      <VPhoto src={IMG.schroederPage.src} size={IMG.schroederPage.size} fx={1580} fy={1800} z0={2.6} z1={2.7} a={t.at('Why red')} b={t.at('If you want')} sy={700}
        bw="grayscale(1) contrast(1.15) sepia(0.25)" tag="Schroeder, The Compleat Chymical Dispensatory, London, 1669 · Internet Archive">
        {(S) => {
          const [hx, hy] = S(1450, 1752);
          const [a1, b1] = S(1640, 1782);
          const [c1] = S(2140, 1782);
          return (
            <>
              <Loop cx={hx} cy={hy} rx={170} ry={58} at={t.at('Why red')} seed={54} color={CORAL} />
              <Sketch pts={[[a1, b1], [Math.min(c1, 1040), b1 + 4]]} x={0} y={0} at={t.at('Because')} dur={8} width={8} color="#FF9F1C" smooth={false} />
              <Note text="why red hair?" x={80} y={200} size={78} rot={-3} at={t.at('Why red')} color="#ffffff" />
              {useGFrame() >= t.at('least disturbing') && <Highlight text="THE LEAST" x={60} y={900} size={100} at={t.at('least disturbing')} seed={55} rot={-2} />}
              {useGFrame() >= t.at('least disturbing') && <Highlight text="DISTURBING PART" x={80} y={1030} size={84} at={t.at('least disturbing') + 3} seed={56} rot={-2} />}
            </>
          );
        }}
      </VPhoto>
    )],
  ],
  writes: (t) => ['real recipe', 'printed', 'copied', 'A popular', 'young', 'Oswald', 'chemist', 'making your own', 'Why red'].map((p) => t.at(p)),
  stamps: (t) => [t.at('So in 1609'), t.at('least disturbing')],
};

// ---------- 5 · There may be a person in this painting ----------
const G1 = 'img/ch09_answer/gallery_1.jpg';
const Portrait: React.FC<{warmAt: number; loopAt: number; drawAt?: number}> = ({warmAt, loopAt, drawAt = -40}) => {
  const g = useGFrame();
  const k = interpolate(g, [warmAt, warmAt + 24], [0, 1], clamp);
  const x = 190, y = 260, w = 700, h = 840;
  const gold = '#c9a34a';
  return (
    <>
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, boxShadow: '0 30px 60px rgba(0,0,0,0.75)'}}>
        <Img src={staticFile(G1)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.1) brightness(0.92)'}} />
        {k > 0 && <div style={{position: 'absolute', inset: 0, background: CORAL, mixBlendMode: 'color', opacity: 0.75 * k}} />}
      </div>
      <Sketch pts={[[x - 34, y - 34], [x + w + 34, y - 34], [x + w + 34, y + h + 34], [x - 34, y + h + 34], [x - 34, y - 28]]} x={0} y={0} at={drawAt} dur={12} width={16} smooth={false} color={gold} />
      <Sketch pts={[[x - 10, y - 10], [x + w + 10, y - 10], [x + w + 10, y + h + 10], [x - 10, y + h + 10], [x - 10, y - 6]]} x={0} y={0} at={drawAt + 4} dur={12} width={5} smooth={false} color={gold} />
      <Loop cx={x + w / 2} cy={y + h / 2} rx={440} ry={520} at={loopAt} dur={20} seed={91} width={7} />
    </>
  );
};
const TUBE: P[] = [[0, 20], [250, 30], [300, 45], [300, 75], [250, 90], [0, 100], [10, 60]];
const CAP: P[] = [[300, 45], [345, 45], [345, 75], [300, 75]];
const S5: Def = {
  id: 'VShort5',
  segs: [[9, 'somewhere on a', 'a person.'], [8, 'And then there', 'other browns.'], [8, 'In 1881', 'on top.'], [9, 'And mummy brown', 'them apart.'], [9, 'Which means', 'a person.']],
  payoff: ['a person', 2],
  cover: <Cover lines={[{text: 'THERE MAY BE', x: 50, y: 150, size: 100}, {text: 'A PERSON IN', x: 60, y: 1120, size: 100}, {text: 'THIS PAINTING', x: 80, y: 1260, size: 90}]} />,
  cuts: (t) => [
    [0, (
      <AbsoluteFill style={{background: '#14110d'}}>
        <Portrait warmAt={-40} loopAt={t.at('a person') - 6} />
        <VTag text="Sir Henry Raeburn, William Forsyth, c. 1800 · The Met (illustrative)" />
      </AbsoluteFill>
    )],
    [t.at('And then there') - 1, (
      <Desk>
        <Highlight text="MUMMY BROWN" x={60} y={190} size={120} at={t.at('mummy brown')} seed={41} rot={-2} />
        <Sketch pts={TUBE} x={90} y={470} s={1.4} at={t.at('And then there')} dur={12} width={8} closed />
        <Sketch pts={CAP} x={90} y={470} s={1.4} at={t.at('And then there') + 6} dur={6} width={8} smooth={false} />
        <BrownSmear at={t.at('rich brown')} />
        <Note text="made, at least some of the time," x={70} y={820} size={52} rot={-3} at={t.at('It was made')} color="#ffffff" />
        <Note text="from ground-up mummies" x={90} y={920} size={62} rot={-3} at={t.at('ground-up')} color={CORAL} />
      </Desk>
    )],
    [t.at('In 1888') - 1, (
      <VPhoto src={IMG.weber.src} size={IMG.weber.size} fx={600} fy={1180} z0={1.5} z1={1.58} a={t.at('In 1888')} b={t.at('In 1881')} sy={640}
        bw="grayscale(1) contrast(1.15) sepia(0.2)" tag="F. Weber & Co. price list, Philadelphia, 1888 · Internet Archive">
        {(S) => {
          const [mx, my] = S(340, 1252);
          return (
            <>
              <Loop cx={mx} cy={my} rx={170} ry={58} at={t.at('listed it')} seed={83} color={CORAL} />
              <Stamp text="1888" x={560} y={190} at={t.at('In 1888')} size={150} color="#f4efe6" rot={-4} />
              <Note text="Philadelphia" x={560} y={380} size={60} rot={-3} at={t.at('Philadelphia')} color="#ffffff" />
              <Note text="'Mummy', with the other browns" x={60} y={1030} size={52} rot={-3} at={t.at('right there')} />
            </>
          );
        }}
      </VPhoto>
    )],
    [t.at('In 1881') - 1, (
      <Desk>
        <Stamp text="1881" x={60} y={190} at={t.at('In 1881')} size={150} color="#f4efe6" rot={-4} />
        <Note text="painter Edward Burne-Jones" x={70} y={400} size={56} rot={-3} at={t.at('Edward')} color="#ffffff" />
        <Note text="found out over Sunday lunch" x={80} y={500} size={52} rot={-3} at={t.at('Sunday')} />
        <Burial t={t} />
      </Desk>
    )],
    [t.at('And mummy brown') - 1, (
      <AbsoluteFill style={{background: '#14110d'}}>
        <WallColumn t={t} />
        <Note text="which browns? rarely written down" x={60} y={180} size={50} rot={-2} at={t.at('rarely')} color="#ffffff" />
        <Note text="and hard to tell apart" x={80} y={270} size={50} rot={-2} at={t.at('tell them apart')} />
        <VTag text="Constable, Decamps, Crome · The Met (illustrative)" />
      </AbsoluteFill>
    )],
    [t.at('Which means') - 1, (
      <AbsoluteFill style={{background: '#14110d'}}>
        <Portrait warmAt={t.at('there may be', 2)} loopAt={t.at('a person', 2)} drawAt={t.at('Which means')} />
        <VTag text="Sir Henry Raeburn, William Forsyth, c. 1800 · The Met (illustrative)" />
      </AbsoluteFill>
    )],
  ],
  writes: (t) => ['It was made', 'ground-up', 'Philadelphia', 'right there', 'Edward', 'Sunday', 'proper burial', 'daisy', 'rarely', 'tell them apart'].map((p) => t.at(p)),
  stamps: (t) => [t.at('mummy brown'), t.at('In 1888'), t.at('In 1881')],
};
const BrownSmear: React.FC<{at: number}> = ({at}) => {
  const g = useGFrame();
  if (g < at) return null;
  const s = interpolate(g, [at, at + 24], [0, 1], clamp);
  const d = `M580,560 C${640 + s * 120},${520 - s * 20} ${760 + s * 120},${620 + s * 10} ${590 + s * 420},${590 + s * 60}`;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0}} width={1080} height={1920}>
      <path d={d} stroke="#6b3f24" strokeWidth={70 - s * 20} strokeLinecap="round" fill="none" />
      <path d={d} stroke="#a0623a" strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.5} />
    </svg>
  );
};
const Burial: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const garden = t.at('garden');
  const bur = t.at('proper burial');
  const daisy = t.at('daisy');
  const drop = interpolate(g, [garden, garden + 14], [0, 1], clamp);
  const n = Math.floor(interpolate(g, [daisy + 8, daisy + 20], [0, 12], clamp));
  const cx = 560, cy = 905;
  return (
    <>
      <Sketch pts={[[80, 920], [420, 920], [460, 940], [1000, 930]]} x={0} y={0} at={garden} dur={10} width={6} color="#EDE7DC" />
      <Sketch pts={[[420, 920], [430, 1010], [700, 1015], [720, 930]]} x={0} y={0} at={garden + 4} dur={8} width={5} color="#EDE7DC" />
      <Sketch pts={TUBE} x={430} y={700 + drop * 230} s={0.8} at={t.at('Edward') + 4} dur={10} width={7} closed />
      <Sketch pts={CAP} x={430} y={700 + drop * 230} s={0.8} at={t.at('Edward') + 8} dur={4} width={7} smooth={false} />
      {g >= bur && <Sketch pts={[[430, 925], [520, 900], [620, 902], [715, 928]]} x={0} y={0} at={bur} dur={8} width={9} color="#8a5a3a" />}
      <Note text="a proper burial." x={300} y={1060} size={70} rot={-3} at={bur} color={pal.subject} />
      {g >= daisy && (
        <>
          <Sketch pts={[[cx, cy], [cx - 6, cy - 70], [cx + 4, cy - 150]]} x={0} y={0} at={daisy} dur={8} width={6} />
          <svg style={{position: 'absolute', left: 0, top: 0}} width={1080} height={1920}>
            {[...Array(n)].map((_, i) => {
              const ang = (i / 12) * Math.PI * 2;
              const px = cx + 4 + Math.cos(ang) * 30, py = cy - 150 + Math.sin(ang) * 30;
              return <ellipse key={i} cx={px} cy={py} rx={22} ry={9} transform={`rotate(${(ang * 180) / Math.PI} ${px} ${py})`} fill="#f4efe6" />;
            })}
            {n >= 12 && <circle cx={cx + 4} cy={cy - 150} r={16} fill="#FF9F1C" />}
          </svg>
          <Note text="+ a daisy on top" x={620} y={660} size={52} rot={-4} at={daisy + 6} />
        </>
      )}
    </>
  );
};
const WallColumn: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const a = t.at('And mummy brown');
  const b = t.at('Which means');
  const y = interpolate(f, [a, b], [0, -900], {...clamp, easing: (x) => x * x * (3 - 2 * x)});
  const items: [string, number][] = [['img/ch09_answer/gallery_5.jpg', 1557 / 2400], ['img/ch09_answer/gallery_3.jpg', 1783 / 2400], ['img/ch09_answer/gallery_2.jpg', 2400 / 2009], ['img/ch09_answer/gallery_6.jpg', 1766 / 2400]];
  let top = 420;
  const gold = '#c9a34a';
  return (
    <div style={{position: 'absolute', left: 0, top: y, width: 1080, height: 3200}}>
      {items.map(([src, r], i) => {
        const w = i === 2 ? 560 : 820;
        const h = w * r;
        const x = (1080 - w) / 2;
        const yy = top;
        top += h + 120;
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: x, top: yy, width: w, height: h, boxShadow: '0 20px 40px rgba(0,0,0,0.7)'}}>
              <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.1) brightness(0.9)'}} />
            </div>
            <div style={{position: 'absolute', left: x - 26, top: yy - 26, width: w + 52, height: h + 52, border: `12px solid ${gold}`, boxSizing: 'border-box', borderRadius: 4, opacity: 0.9}} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ---------- registry ----------
const DEFS: Def[] = [S1, S2, S3, S4, S5];
export const VSHORTS = DEFS.map((d) => {
  const b = build(d.segs);
  return {id: d.id, frames: Math.ceil(b.n.duration * FPS) + OUTRO, C: () => <Short d={d} b={b} />, cover: () => <Short d={d} b={b} />};
});
