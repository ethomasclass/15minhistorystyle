// Vertical YouTube Shorts (1080x1920) cut from the finished chapters: the same narration, scenes, images and music,
// no new assets. Layout: a hook title on top, the 16:9 scene in the middle (scaled to the full width), big
// word-by-word captions under it, then a short end card pointing to the full video.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from './lib/anim';
import type {Narration} from './lib/timing';
import {Finish, Highlight, JF, Note, PALETTES, PaletteCtx, StepCtx, usePal} from './kit/Kit';
import {DarkPaper} from './kit/common';
import {Wordmark} from './kit/Intro';
import {Body as Ch01Body} from './ch/Ch01';
import {Body as Ch02Body} from './ch/Ch02';
import {Body as Ch05Body} from './ch/Ch05';
import {Body as Ch06Body} from './ch/Ch06';
import w01 from '../public/audio/ch01_cold_open.words.json';
import w02 from '../public/audio/ch02_everybody_bet.words.json';
import w05 from '../public/audio/ch05_prince_hal.words.json';
import w06 from '../public/audio/ch06_the_fix.words.json';

const FPS = 30;
const OUTRO = 75; // end card, frames
const SCALE = 1080 / 1920;
const SCENE_TOP = 520;   // the titles take two lines above it

type Short = {
  id: string; Body: React.FC; words: Narration; audio?: string; music?: string; musicFrom?: number;
  from: number; to: number;   // narration seconds
  title: string[]; kicker: string;
};

export const SHORTS: Short[] = [
  {id: 'Short1', Body: Ch01Body, words: w01 as Narration, from: 0, to: 39.9, title: ['BANNED →', 'PARTNER'], kicker: 'baseball, 1921 vs. 2026'},
  {id: 'Short2', Body: Ch02Body, words: w02 as Narration, audio: 'audio/ch02_everybody_bet.wav', music: 'music/r_temperance.mp3', musicFrom: 20,
    from: 20.15, to: 60.9, title: ['THE FIRST', 'FIXED GAME'], kicker: 'Hoboken, 1865'},
  {id: 'Short3', Body: Ch05Body, words: w05 as Narration, audio: 'audio/ch05_prince_hal.wav', music: 'music/a_price.mp3', musicFrom: 0,
    from: 0.3, to: 52.7, title: ['ACCUSED TWICE.', 'STILL HIRED.'], kicker: 'baseball before the Black Sox'},
  {id: 'Short4', Body: Ch06Body, words: w06 as Narration, audio: 'audio/ch06_the_fix.wav', music: 'music/g_grip.mp3', musicFrom: 30,
    from: 32.25, to: 72.4, title: ['THE SIGNAL'], kicker: 'the 1919 World Series fix'},
];

export const shortFrames = (s: Short) => Math.round((s.to - s.from) * FPS) + OUTRO;

/** Captions: the current 4-word phrase, the spoken word in orange. */
const Captions: React.FC<{s: Short}> = ({s}) => {
  const f = useCurrentFrame();
  const t = s.from + f / FPS;
  const words = s.words.words.filter((w) => w.s >= s.from - 0.05 && w.e <= s.to + 0.3);
  const i = words.findIndex((w) => w.e >= t);
  if (i < 0 || t > s.to) return null;
  const start = Math.floor(i / 4) * 4;
  const chunk = words.slice(start, start + 4);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1250, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 22px'}}>
      {chunk.map((w, k) => (
        <span key={k} style={{fontFamily: JF.sans, fontWeight: 800, fontSize: 82, lineHeight: 1.25, color: start + k === i ? '#FF9F1C' : '#f4efe6',
          textShadow: '0 4px 0 #0d0c09, 0 0 14px rgba(0,0,0,0.9)', textTransform: 'uppercase'}}>{w.w.replace(/[{}*"“”]/g, '')}</span>
      ))}
    </div>
  );
};

/** End card: the full video's title and where to find it. */
const Outro: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 8], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: k}}>
      <DarkPaper />
      <Note text="the full story:" x={110} y={620} size={80} rot={-3} at={at} color="#ffffff" />
      <Highlight text="SAY IT AIN'T SO" x={90} y={760} size={130} at={at + 4} seed={91} rot={-3} />
      <div style={{position: 'absolute', left: 110, top: 1010, fontFamily: JF.display, fontSize: 56, color: pal.mark, width: 880, lineHeight: 1.2}}>Baseball's Gambling Problem Before the Black Sox</div>
      <Note text="on the channel ↓" x={130} y={1260} size={80} rot={-3} at={at + 12} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** Small channel wordmark at the bottom (the top is the title; YouTube's own UI sits at the very bottom). */
const Mark: React.FC = () => {
  const s = 0.42;
  return (
    <div style={{position: 'absolute', left: 540 - (1440 * s) / 2, top: 1530, width: 1440 * s, height: 530 * s, overflow: 'hidden', opacity: 0.9}}>
      <div style={{position: 'absolute', left: -170 * s, top: -275 * s, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <Wordmark clockAt={0} numAt={0} minAt={0} hisAt={0} />
      </div>
    </div>
  );
};

export const ShortComp: React.FC<{s: Short}> = ({s}) => {
  const len = Math.round((s.to - s.from) * FPS);
  const start = Math.round(s.from * FPS);
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <StepCtx.Provider value={2.5}>
        <AbsoluteFill style={{background: '#0d0c09'}}>
          <DarkPaper />
          {/* the chapter's own scenes (and sounds), shifted so the clip starts at `from` */}
          <div style={{position: 'absolute', left: 0, top: SCENE_TOP, width: 1920, height: 1080, transform: `scale(${SCALE})`, transformOrigin: '0 0', overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.7)'}}>
            <Sequence from={-start} durationInFrames={start + len} layout="none">
              <AbsoluteFill><s.Body /></AbsoluteFill>
            </Sequence>
          </div>
          <div style={{position: 'absolute', left: 0, top: SCENE_TOP - 4, width: 1080, height: 4, background: 'rgba(244,239,230,0.5)'}} />
          <div style={{position: 'absolute', left: 0, top: SCENE_TOP + 1080 * SCALE, width: 1080, height: 4, background: 'rgba(244,239,230,0.5)'}} />
          {s.audio && <Audio src={staticFile(s.audio)} startFrom={start} endAt={start + len} />}
          {s.music && <Audio src={staticFile(s.music)} startFrom={Math.round((s.musicFrom ?? 0) * FPS)}
            volume={(f) => interpolate(f, [0, 15, len - 20, len + OUTRO - 10], [0, 0.14, 0.14, 0], clamp)} />}
          <Note text={s.kicker} x={80} y={110} size={64} rot={-3} at={0} color="#2FE0C4" />
          {s.title.map((line, i) => (
            <Highlight key={i} text={line} x={60 + i * 40} y={200 + i * 135} size={line.length > 12 ? 92 : 112} at={2 + i * 4} seed={93 + i} rot={-2} />
          ))}
          <Captions s={s} />
          <Mark />
          <Outro at={len} />
          <Finish vignette={0.35} />
        </AbsoluteFill>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};
