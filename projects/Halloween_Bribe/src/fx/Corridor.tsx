// Chapter 8 finale (the recap): a dark hallway on Halloween night, built from CSS 3D planes (adapted from the
// gallery corridor in Mummy_Medicine/src/short6.tsx). The camera walks past one framed callback per phrase on
// both walls; each frame lights (coral subject, teal trace) as its phrase is spoken. It arrives at the end wall
// where the 1933 tear-gas headline hangs ("that headline from 1933"), which lights on "It's the reason for it".
// On "when a kid knocks on your door" the end wall becomes a front door that swings open and the camera walks
// through it into the painting ch08_door.jpg ("you might want to pay up").
//
// Keys (frames, from `at`): start, turnip, ship, teargas, deal, war, suburbs, scare, fix, end, reason, door, payup.
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, random, staticFile, useCurrentFrame, Easing} from 'remotion';
import {clamp} from '../lib/anim';
import {makeTimeline, type Narration} from '../lib/timing';
import {Finish, Highlight, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame} from '../kit/Kit';
import words from '../../public/audio/ch08_treat_or_shakedown.words.json';

const CORAL = '#FF6F61';
const TEAL = '#2FE0C4';
const CREAM = '#f4efe6';

// ---------- the hallway ----------
const PERSP = 1000; // viewer distance (px); the world origin sits at the screen centre
const CW = 1200; // hallway width
const CHT = 1100; // hallway height (eye at y 0, floor at +550)
const CL = 6400; // depth of the end wall
const SEG = 300;
const DW = 640; // front door
const DH = 1000;
// The painting hangs far behind the end wall, large, so it already fills the doorway when the door opens; at the
// final camera depth (CL + BEHIND + PERSP - PAINT_D) it fills the frame with a little overscan.
const OVER = 1.1;
const PAINT = {w: 1920 * OVER * 4, h: (1920 * OVER * 4 * 1536) / 2752, src: 'img/gen/scenes/ch08_door.jpg'};
const PAINT_D = (1920 * 4 * PERSP) / 1920; // viewer distance at which it fills the frame (x OVER)
const BEHIND = PAINT_D + 100;
const CAM_FINAL = CL + BEHIND + PERSP - PAINT_D;
const HEAD = {src: 'img/ch03/bismarck_tribune_1933-11-01_tear_gas_headline.jpg', w: 1060, h: Math.round((1060 * 607) / 2600), y: -80};
// "Tear Gas Used to Halt Pranks" in source px (2600 x 607): x, y, w, h
const HEAD_LINE = [70, 228, 2345, 150];

type Pic = {key: string; src: string; side: 'L' | 'R'; d: number; w: number; h: number; prop?: boolean; pos?: string; tag: string};
const PICS: Pic[] = [
  {key: 'turnip', src: 'img/props/turnip_lantern.webp', side: 'L', d: 1500, w: 440, h: 480, prop: true, tag: 'Turnip lantern · Illustration'},
  {key: 'ship', src: 'img/ch03/iln_emigration_vessel_between_decks_1851.jpg', side: 'R', d: 1420, w: 640, h: 330, pos: '42% 50%', tag: 'Emigration vessel, between decks · Illustrated London News, 1851'},
  {key: 'teargas', src: HEAD.src, side: 'L', d: 2600, w: 760, h: 177, tag: 'Bismarck Tribune, Nov 1, 1933 · Library of Congress'},
  {key: 'deal', src: 'img/props/candy_bowl.webp', side: 'R', d: 3150, w: 540, h: 400, prop: true, tag: 'Bowl of candy · Illustration'},
  {key: 'war', src: 'img/ch05/war_ration_book_one_sugar_1942.jpg', side: 'L', d: 3750, w: 500, h: 355, tag: 'War Ration Book One (sugar), 1942 · Office of Price Administration'},
  {key: 'suburbs', src: 'img/gen/scenes/ch06_suburbs.jpg', side: 'R', d: 4300, w: 620, h: 349, tag: 'Postwar suburb, Halloween night · Illustration'},
  {key: 'scare', src: 'img/props/treat_bag.webp', side: 'L', d: 4850, w: 430, h: 490, prop: true, tag: 'Plastic treat bag · Illustration'},
];
const SCONCES = [900, 2050, 3450, 4600, 5600];
const ORDER = ['turnip', 'ship', 'teargas', 'deal', 'war', 'suburbs', 'scare', 'fix'];

const fog = (dist: number, max = 0.86) => Math.min(max, Math.max(0, (dist - 1400) / 3600));
const blk = (a: number) => `rgba(5,4,3,${a.toFixed(3)})`;
const sm = (x: number) => x * x * (3 - 2 * x);

/** A flat div placed in the 3D world: origin at its top-left corner. */
const Plane: React.FC<{x: number; y: number; z: number; ry?: number; rx?: number; w: number; h: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({x, y, z, ry = 0, rx = 0, w, h, style, children}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: '0 0', transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg) rotateX(${rx}deg)`, ...style}}>{children}</div>
);

/** A loose hand-drawn teal rectangle around (0,0,w,h), drawn on from `at`, boiling at 12 fps. */
const TraceRect: React.FC<{w: number; h: number; at: number; pad?: number; seed: number; width?: number; color?: string}> = ({w, h, at, pad = 22, seed, width = 6, color = TEAL}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 12], [0, 0.93], clamp);
  const boil = Math.floor(g / 5);
  const corners: [number, number][] = [[-pad, -pad], [w + pad, -pad * 0.6], [w + pad * 0.8, h + pad], [-pad * 0.7, h + pad * 0.8], [-pad, -pad]];
  const pts: [number, number][] = [];
  for (let i = 0; i < 4; i++) {
    const [ax, ay] = corners[i], [bx, by] = corners[i + 1];
    for (let j = 0; j < 12; j++) {
      const t = j / 12;
      const bow = Math.sin(Math.PI * t) * (random(`b${seed}${i}`) - 0.5) * 18;
      const nx = -(by - ay), ny = bx - ax, nl = Math.hypot(nx, ny);
      pts.push([ax + (bx - ax) * t + (nx / nl) * bow + (random(`x${seed}${i}${j}${boil}`) - 0.5) * 3, ay + (by - ay) * t + (ny / nl) * bow + (random(`y${seed}${i}${j}${boil}`) - 0.5) * 3]);
    }
  }
  pts.push([corners[0][0] + 14, corners[0][1] + 8]);
  const d = 'M' + pts.map((q) => q.map((v) => v.toFixed(1)).join(',')).join(' L');
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}} width={w} height={h}>
      <path d={d} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth={width + 4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} transform="translate(2,4)" />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/** A framed picture on the wall. `lit` 0..1 is the light on it, `coral` 0..1 its subject colour. */
const Framed: React.FC<{p: Pic; lit: number; coral: number; traceAt: number; seed: number}> = ({p, lit, coral, traceAt, seed}) => {
  const {w, h, src} = p;
  const fr = 22; // wooden frame
  const bright = 0.3 + 0.72 * lit;
  return (
    <>
      {/* the warm pool of light on the wall around it */}
      <div style={{position: 'absolute', left: -300, top: -340, width: w + 600, height: h + 620, opacity: 0.25 + 0.75 * lit,
        background: `radial-gradient(ellipse 46% 44% at 50% 44%, rgba(255,170,90,${(0.06 + 0.16 * lit).toFixed(3)}), rgba(255,140,60,0) 70%)`}} />
      {coral > 0.01 && <div style={{position: 'absolute', left: -fr - 30, top: -fr - 30, width: w + 2 * fr + 60, height: h + 2 * fr + 60, borderRadius: 30, boxShadow: `0 0 70px 24px rgba(255,111,97,${(0.42 * coral).toFixed(3)})`}} />}
      <div style={{position: 'absolute', left: -fr, top: -fr, width: w + 2 * fr, height: h + 2 * fr, background: '#24170e', boxShadow: '0 22px 46px rgba(0,0,0,0.8), inset 0 0 0 3px #3b2817, inset 0 0 0 9px #1a100a',
        outline: coral > 0.01 ? `4px solid rgba(255,111,97,${coral.toFixed(3)})` : undefined}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, overflow: 'hidden', background: p.prop ? '#1c1915' : '#111'}}>
        {p.prop && <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, #3a342b 0%, #1c1915 75%)', filter: `brightness(${bright})`}} />}
        <Img src={staticFile(src)} style={{position: 'absolute', inset: p.prop ? 26 : 0, width: p.prop ? w - 52 : w, height: p.prop ? h - 52 : h, objectFit: p.prop ? 'contain' : 'cover', objectPosition: p.pos ?? '50% 50%',
          filter: `grayscale(1) contrast(1.25) brightness(${bright.toFixed(3)})`}} />
        {coral > 0.01 && (p.prop
          ? (['color', 'multiply', 'screen'] as const).map((m, i) => (
            <div key={m} style={{position: 'absolute', left: 26, top: 26, width: w - 52, height: h - 52, background: CORAL, mixBlendMode: m, opacity: coral * [0.8, 0.25, 0.22][i],
              WebkitMaskImage: `url(${staticFile(src)})`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: `url(${staticFile(src)})`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center'}} />
          ))
          : <>
            <div style={{position: 'absolute', inset: 0, background: CORAL, mixBlendMode: 'color', opacity: 0.55 * coral}} />
            <div style={{position: 'absolute', inset: 0, background: CORAL, mixBlendMode: 'multiply', opacity: 0.18 * coral}} />
          </>)}
        {/* cream mat line */}
        <div style={{position: 'absolute', inset: 0, boxShadow: `inset 0 0 0 5px rgba(244,239,230,${(0.25 + 0.5 * lit).toFixed(3)})`}} />
      </div>
      {coral > 0.01 && <div style={{opacity: Math.min(1, coral * 1.5)}}><TraceRect w={w} h={h} at={traceAt} pad={fr + 20} seed={seed} /></div>}
    </>
  );
};

/** A candle sconce: an iron bracket, a flickering flame and its glow on the wall. */
const Sconce: React.FC<{flare: number; seed: number}> = ({flare, seed}) => {
  const f = useCurrentFrame();
  const fl = 0.82 + 0.18 * Math.sin(f / 3.1 + seed) * Math.sin(f / 5.3 + seed * 2) + 0.08 * (random(`fl${seed}${Math.floor(f / 2)}`) - 0.5);
  const k = fl * (1 + 0.8 * flare);
  return (
    <>
      <div style={{position: 'absolute', left: -230, top: -260, width: 460, height: 520, background: `radial-gradient(ellipse 50% 50% at 50% 46%, rgba(255,150,60,${(0.2 * k).toFixed(3)}), rgba(255,120,40,0) 70%)`}} />
      <div style={{position: 'absolute', left: -14, top: 20, width: 28, height: 70, background: '#0c0a08', borderRadius: '4px 4px 12px 12px', boxShadow: '0 0 0 2px #2a2118'}} />
      <div style={{position: 'absolute', left: -8, top: -20, width: 16, height: 42, background: '#d9cfbf', borderRadius: 3, filter: `brightness(${(0.6 + 0.3 * k).toFixed(3)})`}} />
      <div style={{position: 'absolute', left: -9, top: -52, width: 18, height: 34, borderRadius: '50% 50% 45% 45% / 65% 65% 35% 35%', background: 'radial-gradient(ellipse at 50% 70%, #fff6dc 0%, #ffc25e 45%, rgba(255,120,40,0) 80%)',
        transform: `scale(${(0.9 + 0.2 * fl).toFixed(3)})`, boxShadow: `0 0 ${(26 * k).toFixed(1)}px ${(10 * k).toFixed(1)}px rgba(255,150,60,0.55)`}} />
    </>
  );
};

const wainscot = 'linear-gradient(180deg, transparent 0, transparent 690px, #3a3024 690px, #3a3024 698px, #110e0a 698px, #110e0a 1080px, #2a2219 1080px)';
const WALL = '#1a1510';

/** Piecewise-linear keyed value, box-filtered over +-r frames so the walk never stops dead. */
const keyed = (f: number, ks: [number, number][], r: number) => {
  const fs = ks.map((k) => k[0]), vs = ks.map((k) => k[1]);
  if (r <= 0) return interpolate(f, fs, vs, clamp);
  let s = 0, n = 0;
  for (let i = -r; i <= r; i += 2) { s += interpolate(f + i, fs, vs, clamp); n++; }
  return s / n;
};

export const HalloweenCorridor: React.FC<{at: (key: string) => number}> = ({at}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const K = Object.fromEntries(['start', ...ORDER, 'end', 'reason', 'door', 'payup'].map((k) => [k, at(k)])) as Record<string, number>;

  // --- camera: walk depth `cam`, glance `yaw` toward the lit side, then push through the door ---
  const pic = (k: string) => PICS.find((p) => p.key === k)!;
  const view = (k: string, ahead = 30) => pic(k).d + pic(k).w / 2 + ahead; // cam where that frame is nicely in view
  const camEnd = CL + PERSP - 900;
  const walkKeys: [number, number][] = [
    [K.start - 20, -500], [K.turnip, view('turnip', -40)], [K.ship + 12, view('ship', 60)],
    [K.teargas + 8, view('teargas')], [K.deal + 8, view('deal')], [K.war + 6, view('war')], [K.suburbs + 6, view('suburbs')], [K.scare + 6, view('scare', 120)],
    [K.end, camEnd],
  ];
  const walk = keyed(f, walkKeys, 22);
  const pushT = interpolate(f, [K.door + 60, K.payup], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const cam = f < K.door ? walk : camEnd + (CAM_FINAL - camEnd) * pushT;
  const side = (k: string) => (pic(k).side === 'L' ? -1 : 1);
  const Y = 15;
  const yaw = keyed(f, [
    [K.start, 0], [K.turnip - 18, 0], [K.turnip + 4, Y * side('turnip')], [K.ship + 2, Y * side('ship')], [K.ship + 30, Y * side('ship')],
    [K.teargas + 4, Y * side('teargas')], [K.deal - 14, Y * side('teargas')], [K.deal + 4, Y * side('deal')], [K.war - 14, Y * side('deal')], [K.war + 4, Y * side('war')],
    [K.suburbs + 4, Y * side('suburbs')], [K.scare + 4, Y * side('scare')], [K.scare + 45, Y * side('scare')], [K.scare + 90, 0],
  ], 10);
  const still = 1 - interpolate(f, [K.end - 30, K.end], [0, 1], clamp) * 0.6 - pushT * 0.4;
  const sway = Math.sin(f / 19) * 6 * still;
  const bob = Math.sin(f / 9) * 3 * still;
  const dist = (d: number) => PERSP + d - cam;

  // --- light ---
  const lightOf = (k: string, i: number) => {
    const t0 = K[k], t1 = K[ORDER[i + 1]];
    const on = interpolate(f, [t0 - 3, t0 + 5], [0, 1], clamp);
    const coral = on * (1 - interpolate(f, [t1 - 2, t1 + 8], [0, 1], clamp));
    const fix = interpolate(f, [K.fix - 4, K.fix + 10], [0, 1], clamp);
    return {lit: Math.max(coral, on * 0.55, fix * 0.75), coral};
  };
  const flare = interpolate(f, [K.fix - 4, K.fix + 8, K.fix + 50], [0, 1, 0.25], clamp) + interpolate(f, [K.door + 30, K.door + 70], [0, 0.6], clamp);
  const endLit = interpolate(f, [K.fix, K.end + 10], [0.15, 0.8], clamp);
  const headCoral = interpolate(f, [K.reason - 2, K.reason + 6], [0, 1], clamp);
  const headOut = interpolate(f, [K.door - 2, K.door + 10], [1, 0], clamp);
  const doorIn = interpolate(f, [K.door, K.door + 12], [0, 1], clamp);
  const knock = f >= K.door + 12 && f < K.door + 26 ? Math.sin((f - K.door - 12) * 2.4) * 1.6 * (1 - (f - K.door - 12) / 14) : 0;
  const open = sm(interpolate(f, [K.door + 22, K.door + 72], [0, 1], clamp));
  const doorAng = -100 * open;
  const spill = open;

  const segs: number[] = [];
  for (let d0 = -900; d0 < CL; d0 += SEG) if (dist(d0) > 40) segs.push(d0);
  const lit0 = PICS.map((p) => lightOf(p.key, ORDER.indexOf(p.key)));
  const current = [...PICS].reverse().find((p, j) => lit0[PICS.length - 1 - j].coral > 0.5);

  const endVisible = dist(CL) > 30;
  const S = HEAD.w / 2600;
  const paintFull = interpolate(f, [K.payup - 10, K.payup], [0, 1], clamp);

  return (
    <AbsoluteFill style={{background: '#050403', overflow: 'hidden'}}>
      <AbsoluteFill style={{perspective: `${PERSP}px`, perspectiveOrigin: '960px 540px', opacity: interpolate(f, [K.start - 20, K.start + 6], [0, 1], clamp)}}>
        <div style={{position: 'absolute', left: 960, top: 540, width: 0, height: 0, transformStyle: 'preserve-3d',
          transform: `translateZ(${PERSP}px) rotateY(${yaw.toFixed(3)}deg) translateZ(${-PERSP}px) translate3d(${sway.toFixed(2)}px, ${bob.toFixed(2)}px, ${cam.toFixed(2)}px)`}}>
          {/* outside: the painting, beyond the front door (a blurred, larger copy fills the doorway's edges) */}
          {open > 0 && <>
            <Plane x={-PAINT.w} y={-PAINT.h} z={-(CL + BEHIND + 2)} w={PAINT.w * 2} h={PAINT.h * 2} style={{background: 'linear-gradient(180deg, #3b2c17 0%, #5a4320 45%, #120d06 55%, #070504 100%)'}} />
            <Plane x={-PAINT.w / 2} y={-PAINT.h / 2} z={-(CL + BEHIND)} w={PAINT.w} h={PAINT.h}>
              <Img src={staticFile(PAINT.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </Plane>
          </>}
          {endVisible && <>
            {/* end wall: three pieces around the doorway */}
            <Plane x={-CW / 2} y={-CHT / 2} z={-CL} w={(CW - DW) / 2} h={CHT} style={{background: WALL, backgroundImage: wainscot}} />
            <Plane x={DW / 2} y={-CHT / 2} z={-CL} w={(CW - DW) / 2} h={CHT} style={{background: WALL, backgroundImage: wainscot}} />
            <Plane x={-DW / 2} y={-CHT / 2} z={-CL} w={DW} h={CHT - DH} style={{background: WALL, backgroundImage: wainscot}} />
            {/* door casing */}
            <Plane x={-DW / 2 - 34} y={CHT / 2 - DH - 34} z={-CL + 1} w={DW + 68} h={DH + 34} style={{opacity: doorIn,
              boxShadow: 'inset 0 0 0 34px #2b1e14, inset 0 0 0 38px #120c08'}} />
            {/* the door (wall-coloured until it becomes a door) */}
            {dist(CL - DW) > 90 && <Plane x={-DW / 2} y={CHT / 2 - DH} z={-CL + 2} ry={doorAng} w={DW} h={DH} style={{transform: `translate3d(${(-DW / 2 + knock).toFixed(2)}px, ${CHT / 2 - DH}px, ${-CL + 2}px) rotateY(${doorAng}deg)`, backfaceVisibility: 'visible'}}>
              <div style={{position: 'absolute', inset: 0, background: WALL, backgroundImage: wainscot, backgroundPosition: `0 ${-(CHT - DH)}px`}} />
              <div style={{position: 'absolute', inset: 0, opacity: doorIn, background: 'linear-gradient(90deg, #3a2414, #4a2e19 50%, #34200f)', boxShadow: 'inset 0 0 0 3px #1a0f07'}}>
                {[[60, 70, 210, 380], [370, 70, 210, 380], [60, 540, 210, 380], [370, 540, 210, 380]].map(([x, y, w, h], i) => (
                  <div key={i} style={{position: 'absolute', left: x, top: y, width: w, height: h, background: 'linear-gradient(180deg, #432a17, #2f1c0e)', boxShadow: 'inset 0 0 0 6px #26170b, inset 8px 8px 0 4px rgba(0,0,0,0.25), 0 0 0 3px #5a3a20'}} />
                ))}
                {/* knocker and knob */}
                <div style={{position: 'absolute', left: DW / 2 - 34, top: 240, width: 68, height: 76, borderRadius: '50%', border: '9px solid #b08a3e', boxSizing: 'border-box', boxShadow: '0 4px 8px rgba(0,0,0,0.6)'}} />
                <div style={{position: 'absolute', left: DW / 2 - 14, top: 226, width: 28, height: 28, borderRadius: '50%', background: '#c79b48'}} />
                <div style={{position: 'absolute', left: DW - 80, top: 510, width: 34, height: 34, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #f0cf7c, #8a6326)', boxShadow: '0 3px 6px rgba(0,0,0,0.7)'}} />
              </div>
              <div style={{position: 'absolute', inset: 0, background: blk(Math.max(fog(dist(CL), 0.85), 0.5 - 0.5 * endLit) * (1 - 0.6 * open))}} />
            </Plane>}
            {/* the headline, hung large on the end wall */}
            {headOut > 0 && <Plane x={-HEAD.w / 2} y={HEAD.y - HEAD.h / 2} z={-CL + 4} w={HEAD.w} h={HEAD.h} style={{opacity: headOut}}>
              <Framed p={{key: 'head', src: HEAD.src, side: 'L', d: 0, w: HEAD.w, h: HEAD.h, tag: ''}} lit={endLit} coral={0} traceAt={1e7} seed={9} />
              {headCoral > 0 && <>
                {(['color', 'multiply', 'screen'] as const).map((m, i) => (
                  <div key={m} style={{position: 'absolute', left: HEAD_LINE[0] * S, top: HEAD_LINE[1] * S, width: HEAD_LINE[2] * S, height: HEAD_LINE[3] * S, background: CORAL, mixBlendMode: m, opacity: headCoral * [0.9, 0.55, 0.15][i]}} />
                ))}
                <div style={{position: 'absolute', left: -320, top: -300, width: HEAD.w + 640, height: HEAD.h + 600, background: `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,111,97,${(0.3 * headCoral).toFixed(3)}), rgba(255,111,97,0) 70%)`, zIndex: -1}} />
                <div style={{position: 'absolute', left: HEAD_LINE[0] * S, top: HEAD_LINE[1] * S}}>
                  <TraceRect w={HEAD_LINE[2] * S} h={HEAD_LINE[3] * S} at={K.reason + 3} pad={16} seed={11} />
                </div>
              </>}
              <div style={{position: 'absolute', left: -40, top: -40, width: HEAD.w + 80, height: HEAD.h + 80, background: blk(fog(dist(CL), 0.85) * (1 - endLit * 0.6))}} />
            </Plane>}
            {/* end-wall fog (around the door) */}
            <Plane x={-CW / 2} y={-CHT / 2} z={-CL + 0.5} w={(CW - DW) / 2} h={CHT} style={{background: blk(Math.max(fog(dist(CL), 0.85), 0.55 - 0.45 * endLit))}} />
            <Plane x={DW / 2} y={-CHT / 2} z={-CL + 0.5} w={(CW - DW) / 2} h={CHT} style={{background: blk(Math.max(fog(dist(CL), 0.85), 0.55 - 0.45 * endLit))}} />
            <Plane x={-DW / 2} y={-CHT / 2} z={-CL + 0.5} w={DW} h={CHT - DH} style={{background: blk(Math.max(fog(dist(CL), 0.85), 0.55 - 0.45 * endLit))}} />
          </>}
          {segs.map((d0) => {
            const d1 = d0 + SEG;
            const fa = fog(dist(d0)), fb = fog(dist(d1));
            return (
              <React.Fragment key={d0}>
                <Plane x={-CW / 2} y={-CHT / 2} z={-d0} ry={90} w={SEG + 1} h={CHT} style={{background: WALL, backgroundImage: `linear-gradient(90deg, ${blk(fa)}, ${blk(fb)}), ${wainscot}`}} />
                <Plane x={CW / 2} y={-CHT / 2} z={-d1} ry={-90} w={SEG + 1} h={CHT} style={{background: WALL, backgroundImage: `linear-gradient(90deg, ${blk(fb)}, ${blk(fa)}), ${wainscot}`}} />
                <Plane x={-CW / 2} y={CHT / 2} z={-d0} rx={-90} w={CW} h={SEG + 1}
                  style={{background: '#120e0a', backgroundImage: `linear-gradient(180deg, ${blk(fa)}, ${blk(fb)}), linear-gradient(90deg, transparent 330px, #2a1512 330px, #2a1512 870px, transparent 870px), repeating-linear-gradient(90deg, #0a0806 0, #0a0806 3px, transparent 3px, transparent 120px)`}} />
                <Plane x={-CW / 2} y={-CHT / 2} z={-d0} rx={-90} w={CW} h={SEG + 1} style={{background: '#090806', backgroundImage: `linear-gradient(180deg, ${blk(fa)}, ${blk(fb)})`}} />
              </React.Fragment>
            );
          })}
          {/* warm light spilling in through the open door, across the floor */}
          {spill > 0 && endVisible && <Plane x={-CW / 2} y={CHT / 2 - 1} z={-CL} rx={-90} w={CW} h={1400}
            style={{transform: `translate3d(${-CW / 2}px, ${CHT / 2 - 1}px, ${-CL}px) rotateX(90deg)`, background: `radial-gradient(ellipse 34% 60% at 50% 0%, rgba(255,170,80,${(0.35 * spill).toFixed(3)}), rgba(255,140,60,0) 100%)`}} />}
          {/* sconces, both walls */}
          {SCONCES.flatMap((d, i) => (['L', 'R'] as const).map((s) => {
            const dd = d + (s === 'R' ? 280 : 0);
            if (dist(dd) < 60 || dd > CL - 100) return null;
            const k = fog(dist(dd), 0.75);
            return (
              <Plane key={`${i}${s}`} x={s === 'L' ? -CW / 2 + 4 : CW / 2 - 4} y={-150} z={-dd} ry={s === 'L' ? 90 : -90} w={1} h={1} style={{opacity: 1 - k}}>
                <Sconce flare={flare} seed={i * 2 + (s === 'L' ? 0 : 1)} />
              </Plane>
            );
          }))}
          {PICS.map((p, i) => {
            if (dist(p.d) < 40) return null;
            const {lit, coral} = lit0[i];
            const k = fog(dist(p.d + p.w / 2), 0.8);
            const y = -60 - p.h / 2;
            const inner = (
              <>
                <Framed p={p} lit={lit} coral={coral} traceAt={K[p.key] + 3} seed={i + 2} />
                <div style={{position: 'absolute', left: -340, top: -360, width: p.w + 680, height: p.h + 700, background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${blk(k)} 60%, ${blk(k * 0.6)} 100%)`}} />
              </>
            );
            return p.side === 'L'
              ? <Plane key={p.key} x={-CW / 2 + 3} y={y} z={-p.d} ry={90} w={p.w} h={p.h}>{inner}</Plane>
              : <Plane key={p.key} x={CW / 2 - 3} y={y} z={-(p.d + p.w)} ry={-90} w={p.w} h={p.h}>{inner}</Plane>;
          })}
        </div>
      </AbsoluteFill>
      {/* the room's light falls off toward the edges of the frame (lifts as we step outside) */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 60% at 50% 48%, transparent 40%, rgba(4,3,2,0.6) 100%)', opacity: 1 - paintFull * 0.7}} />
      {/* source tags */}
      {f < K.scare + 90 && current && <Tag text={current.tag} />}
      {f >= K.end && f < K.door && <Tag text="The Bismarck Tribune, Nov 1, 1933 · Library of Congress" />}
      {f >= K.payup - 10 && <Tag text="Illustration · Halloween night, a front door" />}
      {g >= K.payup + 20 && <Highlight text="PAY UP." x={150} y={790} size={120} at={K.payup + 20} rot={-2} seed={8} />}
    </AbsoluteFill>
  );
};

// ---------- test composition: the real chapter-8 timings and audio ----------
const N = words as Narration;
const T = makeTimeline(N, 30);
const LEAD = 0; // chapter lead before the narration (use 0 here)
const PHRASES: Record<string, string> = {
  start: "So let's go back",
  turnip: 'The turnip crossed',
  ship: 'crossed the ocean',
  teargas: 'The pranks got worse',
  deal: 'So towns made a deal',
  war: 'The war took',
  suburbs: 'The suburbs gave',
  scare: 'And a scare',
  fix: 'And every fix',
  end: 'that headline from 1933',
  reason: "It's the reason",
  door: 'when a kid knocks',
  payup: 'you might want to pay up',
};
const ABS = Object.fromEntries(Object.entries(PHRASES).map(([k, ph]) => [k, LEAD + T.at(ph)])) as Record<string, number>;
const T0 = ABS.start - 24; // the test starts just before "So let's go back"
const TAIL = 75;
export const Corridor_TEST_FRAMES = ABS.payup - T0 + 30 + TAIL;
const atTest = (k: string) => {
  if (!(k in ABS)) throw new Error(`Corridor: no key "${k}"`);
  return ABS[k] - T0;
};

export const CorridorTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <AbsoluteFill style={{background: '#000'}}>
        <HalloweenCorridor at={atTest} />
        <Audio src={staticFile('audio/ch08_treat_or_shakedown.wav')} trimBefore={T0 - LEAD} />
        <Finish vignette={0.3} />
      </AbsoluteFill>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
