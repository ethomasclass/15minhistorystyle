// Shared pieces for this video's native vertical Shorts (1080x1920), cut from the finished chapters: the splice builder (lines
// resolved against the chapters' words.json, as techniques/components/black_sox/vshorts.tsx), captions, the corner wordmark,
// the desk modes (black / teal / coral, as kit/tg_desk), a portrait source tag, the end card's text and the shell.
//
// Phone safe zones: YouTube's UI covers the top ~150 px, the bottom ~400 px and the right ~150 px from y 900 down. Scene text
// stays in x 60-930, y 150-1150; captions sit at y ~1185 on a soft dark band; source tags at y ~1490.
// Standing rules for this video: no sound effects (the Chunk logo clicks are the only exception, and the Shorts have no logo
// animation, so they have none); tg_ cues only; no hands; every text on screen for at least 2.5 s.
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {makeTimeline, type Narration, type Word} from '../lib/timing';
import {Finish, Highlight, JF, Note, PALETTES, PaletteCtx, StepCtx, usePal} from '../kit/Kit';
import {DeskCtx, type DeskMode, marksFor} from '../kit/tg_desk';
import {bed} from '../kit/levels';
import type {TL} from '../kit/shell';
import {SUBTITLE} from '../project';
import w01 from '../../public/audio/ch01_cold_open.words.json';
import w07 from '../../public/audio/ch07_test_kitchens.words.json';
import w08 from '../../public/audio/ch08_turkey.words.json';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
/** Seconds of air between spliced lines. */
const GAP = 0.3;
/** The end card, frames (3 s). */
export const OUTRO = 90;
export const TAG_Y = 1490;
export const CREAM = '#f4efe6';
export const ORANGE = '#FF9F1C';

const CH: Record<string, {n: Narration; wav: string}> = {
  ch01: {n: w01 as Narration, wav: 'audio/ch01_cold_open.wav'},
  ch07: {n: w07 as Narration, wav: 'audio/ch07_test_kitchens.wav'},
  ch08: {n: w08 as Narration, wav: 'audio/ch08_turkey.wav'},
};

/** A spoken line taken from a chapter: from the phrase `first` to the end of the phrase `last`. `pre`: extra air before it (s). */
export type Seg = {ch: string; first: string; last: string; firstNth?: number; lastNth?: number; pre?: number};
export type Built = {segs: {wav: string; from: number; to: number; at: number; text: string}[]; n: Narration};

/** Splice the lines back to back (0.12 s before the first word to 0.2 s after the last, 0.3 s of air between); the result is a
 *  narration whose word times are local to the Short, so makeTimeline and t.at('phrase') work as in a chapter. */
export const build = (segs: Seg[]): Built => {
  let t = 0.25;
  const out: Built['segs'] = [];
  const words: Word[] = [];
  for (const s of segs) {
    const {n, wav} = CH[s.ch];
    const tl = makeTimeline(n, FPS);
    const i0 = tl.idx(s.first, s.firstNth ?? 1);
    const i1 = tl.idx(s.last, s.lastNth ?? 1) + s.last.split(/\s+/).length - 1;
    t += s.pre ?? 0;
    const from = n.words[i0].s - 0.12, to = n.words[i1].e + 0.2;
    out.push({wav, from, to, at: t, text: n.words.slice(i0, i1 + 1).map((w) => w.w).join(' ')});
    for (let i = i0; i <= i1; i++) words.push({...n.words[i], s: n.words[i].s - from + t, e: n.words[i].e - from + t});
    t += to - from + GAP;
  }
  return {segs: out, n: {voice: 'spliced', duration: t, words}};
};

/** Story frames (the narration) of a built Short; the end card follows. */
export const storyFrames = (b: Built) => Math.ceil(b.n.duration * FPS);

/** Captions: Inter 800, uppercase, 88 px, three words at a time, the spoken word in orange; never across the end of a sentence. */
export const Captions: React.FC<{n: Narration; until: number}> = ({n, until}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  if (f >= until) return null;
  const i = n.words.findIndex((w) => w.e >= t - 0.05);
  if (i < 0 || t < n.words[0].s - 0.1) return null;
  if (t < n.words[i].s - 0.6) return null; // a long pause: clear the line
  const chunks: number[] = [0];
  n.words.forEach((w, k) => {
    if (k === 0) return;
    if (k - chunks[chunks.length - 1] >= 3 || /[.?!:]["”]?$/.test(n.words[k - 1].w)) chunks.push(k);
  });
  const start = chunks.filter((c) => c <= i).pop() ?? 0;
  const end = chunks.find((c) => c > i) ?? n.words.length;
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 1130, width: W, height: 360, background: 'linear-gradient(180deg, rgba(8,7,5,0) 0%, rgba(8,7,5,0.75) 30%, rgba(8,7,5,0.75) 75%, rgba(8,7,5,0) 100%)'}} />
      <div style={{position: 'absolute', left: 50, width: 900, top: 1185, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 20px'}}>
        {n.words.slice(start, end).map((w, k) => (
          <span key={k} style={{fontFamily: JF.sans, fontWeight: 800, fontSize: 88, lineHeight: 1.2, textTransform: 'uppercase',
            color: start + k === i ? ORANGE : CREAM, textShadow: '0 5px 0 #0d0c09, 0 0 18px rgba(0,0,0,0.95)'}}>{w.w.replace(/[{}*"“”[\]]/g, '')}</span>
        ))}
      </div>
    </>
  );
};

/** The channel's wordmark, small, top-left (YouTube puts its own icons top-right). Complete on frame 0. */
export const Mark: React.FC = () => (
  <div style={{position: 'absolute', left: 40, top: 44, padding: '12px 16px', borderRadius: 12, background: 'rgba(13,12,9,0.72)'}}>
    <Img src={staticFile('img/brand/chunk-history-horizontal.svg')} style={{display: 'block', width: 270, height: 270 * (210 / 1404)}} />
  </div>
);

/** A scene's desk: black (evidence), teal (explainers) or coral (a short punchline flash), with the marks that go with it
 *  (kit/tg_desk: on teal the teal marks go pale, on coral the coral marks go cream and the tapes get an ink edge). */
export const Mode: React.FC<{m: DeskMode; children: React.ReactNode}> = ({m, children}) => {
  const pal = usePal();
  const mk = marksFor(m);
  const p = m === 'black' ? pal : {...pal, mark: mk.teal, accent: mk.teal, subject: mk.coral, tint: pal.tint ?? pal.subject, edge: mk.edge ?? undefined};
  return (
    <DeskCtx.Provider value={{mode: m, texture: true}}>
      <PaletteCtx.Provider value={p}>
        <AbsoluteFill>{children}</AbsoluteFill>
      </PaletteCtx.Provider>
    </DeskCtx.Provider>
  );
};

/** A source tag for portrait: mono on a dark box, wrapping inside x 60-930, at y ~1490. */
export const PTag: React.FC<{text: string; y?: number}> = ({text, y = TAG_Y}) => (
  <div style={{position: 'absolute', left: 60, top: y, maxWidth: 870, fontFamily: JF.mono, fontSize: 22, lineHeight: 1.35, letterSpacing: 1, color: 'rgba(244,239,230,0.92)',
    textTransform: 'uppercase', background: 'rgba(13,12,9,0.78)', padding: '6px 12px'}}>{text}</div>
);

/** The end card's words, over the Short's opening picture (so the replay loops into the cover): the full video's title and where. */
export const EndText: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  if (f < at) return null;
  return (
    <AbsoluteFill style={{opacity: interpolate(f, [at, at + 6], [0, 1], clamp)}}>
      <Note text="the full story:" x={80} y={175} size={70} rot={-3} at={at - 20} color="#ffffff" />
      <Highlight text="FROM EELS" x={60} y={275} size={128} at={at - 20} seed={91} rot={-3} />
      <Highlight text="TO THIS" x={150} y={445} size={128} at={at - 20} seed={92} rot={-2} />
      <div style={{position: 'absolute', left: 0, top: 1170, width: W, height: 300, background: 'linear-gradient(180deg, rgba(8,7,5,0) 0%, rgba(8,7,5,0.7) 30%, rgba(8,7,5,0.7) 80%, rgba(8,7,5,0) 100%)'}} />
      <div style={{position: 'absolute', left: 80, top: 1215, width: 850, fontFamily: JF.display, fontSize: 56, lineHeight: 1.15, color: CREAM, textShadow: '0 4px 16px rgba(0,0,0,0.8)'}}>{SUBTITLE}</div>
      <Note text="on the channel" x={90} y={1360} size={80} rot={-3} at={at - 20} color={pal.mark} />
    </AbsoluteFill>
  );
};

export type ShortDef = {music: string; Scenes: React.FC<{t: TL; len: number}>; segs: Seg[]};

/** The Short: scenes (they also draw the end card's picture from `len`), captions, the wordmark, the spliced voice, one music bed. */
export const VShell: React.FC<{d: ShortDef; b: Built}> = ({d, b}) => {
  const t = makeTimeline(b.n, FPS);
  const len = storyFrames(b);
  const vol = bed(d.music);
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <StepCtx.Provider value={2.5}>
        <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
          <d.Scenes t={t} len={len} />
          <Captions n={b.n} until={len} />
          <Mode m="teal"><EndText at={len} /></Mode>
          <Mark />
          {b.segs.map((s, i) => (
            <Sequence key={i} from={Math.round(s.at * FPS)} layout="none">
              <Audio src={staticFile(s.wav)} startFrom={Math.round(s.from * FPS)} endAt={Math.round(s.to * FPS)} />
            </Sequence>
          ))}
          <Audio src={staticFile(`music/${d.music}.mp3`)} volume={(f) => interpolate(f, [0, 10, len + OUTRO - 25, len + OUTRO], [0, vol, vol, 0], clamp)} />
          <Finish vignette={0.3} />
        </AbsoluteFill>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};
