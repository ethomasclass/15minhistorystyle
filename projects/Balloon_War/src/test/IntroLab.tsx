// Three gentler channel-intro candidates (no ticking): 4 · lamp on, 5 · pull back to the desk, 6 · tape pull.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {Finish, PALETTES, PaletteCtx, StepCtx} from '../kit/Kit';
import {DarkPaper, Sfx} from '../kit/common';
import {Wordmark} from '../kit/Intro';
import {INTRO_CARDS} from '../project';

export const LAB_FRAMES = {lamp: 100, desk: 112, tape: 100};
const STILL = -200; // a wordmark that is already fully drawn

const Shell: React.FC<{frames: number; sting: number; children: React.ReactNode}> = ({frames, sting, children}) => {
  const f = useCurrentFrame();
  const fade = interpolate(f, [frames - 10, frames], [1, 0], clamp);
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <StepCtx.Provider value={2.5}>
        <AbsoluteFill style={{background: '#050403', opacity: fade}}>{children}</AbsoluteFill>
        <Sequence from={sting} layout="none">
          <Audio src={staticFile('music/title_sting.mp3')} volume={(x) => interpolate(x, [0, 4, 50, 80], [0, 0.32, 0.32, 0], clamp)} />
        </Sequence>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};

/** 4 · Lamp on: a click in the dark, a warm pool of light sweeps across the desk, the logo is already there. */
export const IntroLamp: React.FC = () => {
  const f = useCurrentFrame();
  const on = 10;
  const flicker = f >= on && f < on + 5 ? [1, 0.25, 1, 0.6, 1][f - on] : f >= on ? 1 : 0;
  const r = interpolate(f, [on, on + 34], [380, 1500], {...clamp, easing: Easing.out(Easing.cubic)});
  const cx = interpolate(f, [on, on + 40], [30, 47], {...clamp, easing: Easing.out(Easing.quad)});
  return (
    <Shell frames={LAB_FRAMES.lamp} sting={on + 6}>
      <DarkPaper />
      <Wordmark clockAt={STILL} numAt={STILL} minAt={STILL} hisAt={STILL} />
      <Finish vignette={0.45} />
      <AbsoluteFill style={{background: `radial-gradient(circle ${r}px at ${cx}% 46%, rgba(255,205,140,0.16) 0%, transparent 60%)`, mixBlendMode: 'screen', opacity: flicker}} />
      <AbsoluteFill style={{background: `radial-gradient(circle ${r}px at ${cx}% 46%, transparent 30%, rgba(5,4,3,0.97) 100%)`, opacity: flicker}} />
      <AbsoluteFill style={{background: '#050403', opacity: 1 - flicker}} />
      <Sfx at={on} src="sfx/lamp_click.wav" volume={0.5} />
    </Shell>
  );
};

/** 5 · Pull back: from one taped-down photo, the camera drifts back to the whole notebook page, logo in the middle. */
const PAGE: {src: string; x: number; y: number; w: number; rot: number}[] = [
  {src: INTRO_CARDS[0], x: 70, y: 60, w: 400, rot: -4},
  {src: INTRO_CARDS[1], x: 1460, y: 70, w: 400, rot: 3},
  {src: INTRO_CARDS[2], x: 80, y: 740, w: 380, rot: 2},
  {src: INTRO_CARDS[3], x: 1470, y: 750, w: 390, rot: -3},
  {src: INTRO_CARDS[4], x: 760, y: 40, w: 360, rot: 1.5},
  {src: 'img/ch06_bly/gearhart_mountain_ponderosa_pine_1964.jpg', x: 790, y: 830, w: 340, rot: -2},
];
export const IntroDesk: React.FC = () => {
  const f = useCurrentFrame();
  const u = interpolate(f, [0, 72], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const s = 3.1 + (1 - 3.1) * u;
  const c0 = [PAGE[0].x + PAGE[0].w / 2, PAGE[0].y + PAGE[0].w * 0.34];
  const cx = c0[0] + (960 - c0[0]) * u, cy = c0[1] + (540 - c0[1]) * u;
  const logo = 0.6;
  return (
    <Shell frames={LAB_FRAMES.desk} sting={44}>
      <AbsoluteFill style={{transform: `translate(${960 - cx * s}px, ${540 - cy * s}px) scale(${s})`, transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080}}><DarkPaper /></div>
        {PAGE.map((c, i) => (
          <div key={i} style={{position: 'absolute', left: c.x, top: c.y, width: c.w, transform: `rotate(${c.rot}deg)`}}>
            <div style={{background: '#f4efe6', padding: 10, boxShadow: '0 14px 28px rgba(0,0,0,0.65)'}}>
              <Img src={staticFile(c.src)} style={{width: c.w - 20, height: (c.w - 20) * 0.66, objectFit: 'cover', display: 'block', filter: 'grayscale(1) contrast(1.2)'}} />
            </div>
            {[[-18, -14, -8], [c.w - 70, -12, 9]].map(([tx, ty, tr], k) => (
              <div key={k} style={{position: 'absolute', left: tx, top: ty, width: 90, height: 30, background: 'rgba(236,222,190,0.62)', transform: `rotate(${tr + (random(`tp${i}${k}`) - 0.5) * 8}deg)`}} />
            ))}
          </div>
        ))}
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${960 - 895 * logo}px, ${540 - 540 * logo}px) scale(${logo})`, transformOrigin: '0 0'}}>
          <Wordmark clockAt={STILL} numAt={STILL} minAt={STILL} hisAt={STILL} />
        </div>
      </AbsoluteFill>
      <Finish vignette={0.45} />
      <Sfx at={2} src="sfx/paper_rustle.wav" volume={0.22} />
    </Shell>
  );
};

/** 6 · Tape pull: the clock draws on in silence, the MINUTE tape is pulled across with a quiet tape sound, one soft stamp. */
export const IntroTape: React.FC = () => {
  const clockAt = 4, numAt = 30, minAt = 40, hisAt = 52;
  return (
    <Shell frames={LAB_FRAMES.tape} sting={numAt - 2}>
      <DarkPaper />
      <Wordmark clockAt={clockAt} numAt={numAt} minAt={minAt} hisAt={hisAt} />
      <Finish vignette={0.45} />
      <Sfx at={clockAt} src="sfx/quill.wav" volume={0.18} />
      <Sfx at={numAt} src="sfx/stamp.wav" volume={0.22} />
      <Sfx at={minAt - 3} src="sfx/tape_pull.wav" volume={0.4} />
    </Shell>
  );
};
