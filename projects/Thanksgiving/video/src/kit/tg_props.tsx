// Thanksgiving video pieces (chapters 1-2 builder; any chapter may import them):
//   Eel          the wriggling eel cut-out (img/flow/eel/eel_0000-0047.png: 48 drawings at 12/s, looped), placed by its body box
//   Cran         the cranberry stop-motion (img/flow/cran/cran_cut1-6.png), aligned as tests/cran_cut.py does (plate bottom-centre,
//                the can cropped at the image's right edge, so that edge sits off-frame or is faded with `fade`)
//   Placeholder  a labelled dark card for an asset that hasn't arrived (the brief's PLACEHOLDER rule), with an optional landing
//   PageRead     a document on the desk with a guided camera: the real scan through vox `Sheet` once it exists, else a placeholder
//                page of the same size (faint ruled "lines") so the pan, the swipe and the marks are built around it
//   Strike       the orange strike-through (8 px, drawn over 5 frames), for things that weren't there
//   Tally        a grid of small marks (people counted), each mark coloured by index, popping in quickly
//   Barrel       a hand-drawn teal barrel (draws on), for "a barrel of eels in a night"
//   PrintSlot / PropSlot   a kit Print / Prop once the file exists in public/, a Placeholder of the same box until then
//   Diorama      plane-by-plane diorama (FLOW_CUTOUT_PROMPTS §7: sky, far, mid, front, each its own cut image) in a slow sideways
//                parallax; each missing plane shows as a labelled tone band where its shapes will sit
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp} from '../lib/anim';
import {boxOf, JF, useGFrame, usePal} from './Kit';
import {hasFile} from './shell';
import {camAt, Sheet, tornPoly, type SheetCam} from './vox';
import {Print} from './print';
import {Prop} from './prop';

// ------------------------------------------------------------------ the eel
/** Source size of each eel drawing and the eel's body box in it (x0, y0, x1, y1), from eel_0000.png's alpha. */
export const EEL_SIZE: [number, number] = [1376, 768];
const EEL_BOX = [281, 162, 1090, 682];
export const EEL_FRAMES = 48;

/**
 * The eel, wriggling in place. `cx, cy` = centre of its body on screen, `w` = the body's width on screen. The loop steps at
 * 12 drawings a second off the graphics frame. `at` = it drops onto the desk (omit to have it there already, as at frame 0).
 * `still` freezes it on one drawing.
 */
export const Eel: React.FC<{cx: number; cy: number; w: number; rot?: number; at?: number; out?: number; still?: number; flip?: boolean; shadow?: number}> = ({
  cx, cy, w, rot = 0, at, out = Infinity, still, flip, shadow = 1,
}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const {fps} = useVideoConfig();
  if ((at !== undefined && f < at) || f >= out) return null;
  const k = at === undefined ? 1 : spring({frame: f - at, fps, config: {damping: 14, mass: 0.8}});
  const s = w / (EEL_BOX[2] - EEL_BOX[0]);
  const left = cx - ((EEL_BOX[0] + EEL_BOX[2]) / 2) * s;
  const top = cy - ((EEL_BOX[1] + EEL_BOX[3]) / 2) * s - (1 - k) * 120;
  const i = still ?? Math.floor(g / 2.5) % EEL_FRAMES;
  const src = staticFile(`img/flow/eel/eel_${String(i).padStart(4, '0')}.png`);
  return (
    <div style={{position: 'absolute', left, top, width: EEL_SIZE[0] * s, height: EEL_SIZE[1] * s, opacity: Math.min(1, k * 1.5),
      transform: `rotate(${rot}deg) scaleX(${flip ? -1 : 1})`, filter: `drop-shadow(${10 * shadow}px ${14 * shadow}px 0 rgba(0,0,0,0.5)) drop-shadow(0 ${18 * shadow}px ${22 * shadow}px rgba(0,0,0,0.45))`}}>
      <Img src={src} style={{width: '100%', height: '100%', display: 'block'}} />
    </div>
  );
};

// ------------------------------------------------------------------ the cranberry stop-motion
/** Per drawing: source width, plate bottom-centre x, plate bottom y, plate width (measured as tests/cran_cut.py does). */
const CRAN = [
  {W: 842, cx: 413.5, by: 626, pw: 725}, {W: 842, cx: 414, by: 623, pw: 728}, {W: 841, cx: 411.5, by: 626, pw: 727},
  {W: 841, cx: 418.5, by: 621, pw: 715}, {W: 842, cx: 417.5, by: 613, pw: 713}, {W: 842, cx: 369.5, by: 609, pw: 659},
];
const CRAN_H = 695;
const PW0 = CRAN.reduce((a, c) => a + c.pw, 0) / CRAN.length;
/** Drawings at 12/s, as in the approved test: 4 on the first, 3 on each middle one, then the last held. */
const CRAN_SEQ = [0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4];
export const CRAN_SLIDE_FRAMES = Math.ceil(CRAN_SEQ.length * 2.5);

/**
 * The jellied cranberry sliding out of its can. Each drawing is scaled so the plate keeps one width (`k` = the plate's scale),
 * its bottom at `bottom` and the drawing's right edge (where the can is cropped) at `right`; keep `right` past 1920 or set
 * `fade` to soften that edge. `at` = the slide starts; before it the first drawing shows. `still` shows one drawing (0-5).
 */
export const Cran: React.FC<{at: number; k?: number; right?: number; bottom?: number; still?: number; fade?: boolean; land?: number}> = ({
  at, k = 1.6875, right = 1929, bottom = 929, still, fade, land,
}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const {fps} = useVideoConfig();
  if (land !== undefined && f < land) return null;
  const step = Math.floor(Math.max(0, g - at) / 2.5);
  const i = still ?? (g < at ? 0 : step < CRAN_SEQ.length ? CRAN_SEQ[step] : 5);
  const c = CRAN[i];
  const s = k * (PW0 / c.pw);
  const kk = land === undefined ? 1 : spring({frame: f - land, fps, config: {damping: 14, mass: 0.8}});
  const left = right - c.W * s;
  const top = bottom - c.by * s - (1 - kk) * 120;
  const m = fade ? {WebkitMaskImage: 'linear-gradient(90deg, #000 80%, transparent 99%)', maskImage: 'linear-gradient(90deg, #000 80%, transparent 99%)'} : {};
  return (
    <div style={{position: 'absolute', left, top, width: c.W * s, height: CRAN_H * s, opacity: Math.min(1, kk * 1.5), filter: 'drop-shadow(18px 15px 15px rgba(0,0,0,0.55))'}}>
      <Img src={staticFile(`img/flow/cran/cran_cut${i + 1}.png`)} style={{width: '100%', height: '100%', display: 'block', ...m}} />
    </div>
  );
};

// ------------------------------------------------------------------ placeholders
/**
 * A plain dark card standing in for a missing asset: the intended file name in mono, a one-line note under it. With `at` it
 * slaps down like a Print (from 1.3x with an overshoot); `out` switches it off. `full` fills the frame (full-frame images).
 */
export const Placeholder: React.FC<{file: string; x?: number; y?: number; w?: number; h?: number; rot?: number; note?: string; at?: number; out?: number; full?: boolean;
  tone?: string; children?: React.ReactNode}> = ({file, x = 0, y = 0, w = 1920, h = 1080, rot = 0, note, at, out = Infinity, full, tone = '#1d1b17', children}) => {
  const g = useGFrame();
  if ((at !== undefined && g < at) || g >= out) return null;
  const k = at === undefined ? 1 : interpolate(g, [at, at + 4, at + 7], [1.3, 0.96, 1], clamp);
  const [L, T, Wd, Ht] = full ? [0, 0, 1920, 1080] : [x, y, w, h];
  const fs = Math.max(12, Math.min(20, Wd / 26));
  return (
    <div style={{position: 'absolute', left: L, top: T, width: Wd, height: Ht, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: '50% 60%',
      background: tone, boxShadow: full ? undefined : '0 26px 46px rgba(0,0,0,0.8)', outline: '2px dashed rgba(244,239,230,0.28)', outlineOffset: -10,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
      {children}
      <div style={{position: 'relative', fontFamily: JF.mono, fontSize: fs, letterSpacing: 1, color: 'rgba(244,239,230,0.7)', textAlign: 'center', padding: '0 18px', maxWidth: Wd - 40,
        overflowWrap: 'anywhere'}}>PLACEHOLDER: {file}</div>
      {note && <div style={{position: 'relative', marginTop: 8, fontFamily: JF.mono, fontSize: fs * 0.8, color: 'rgba(244,239,230,0.45)', textAlign: 'center', padding: '0 18px', maxWidth: Wd - 40}}>{note}</div>}
    </div>
  );
};

// ------------------------------------------------------------------ a document read
/**
 * A page on the desk with a guided camera (`keys`: [frame, SheetCam], vox camAt). With the scan in public/ it is vox's `Sheet`;
 * until then a placeholder page of the same pixel size, with faint ruled lines so the move reads. Children are drawn in page px
 * either way (swipes, loops), so the line boxes are the only thing to re-measure when the scan lands (tools/phrase_find.py).
 */
export const PageRead: React.FC<{src: string; size: [number, number]; keys: [number, SheetCam][]; note?: string; seed?: string; children?: React.ReactNode}> = ({
  src, size, keys, note, seed = 'pg', children,
}) => {
  const f = useCurrentFrame();
  const cam = camAt(keys, f);
  if (hasFile(src)) return <Sheet src={src} size={size} cam={cam} seed={seed}>{children}</Sheet>;
  const [w, h] = size;
  const {x, y, z, tilt = 0, rot = 0} = cam;
  return (
    <AbsoluteFill style={{perspective: 1400, perspectiveOrigin: '960px 540px', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 960 - x, top: 540 - y, width: w, height: h, transformOrigin: `${x}px ${y}px`,
        transform: `scale(${z}) rotateX(${tilt}deg) rotateZ(${rot}deg)`, filter: `drop-shadow(0 ${18 / z}px ${30 / z}px rgba(0,0,0,0.75))`}}>
        <div style={{position: 'absolute', inset: 0, clipPath: tornPoly(seed, w, h, 12 / Math.max(z, 0.3)), background: '#24211c'}}>
          {Array.from({length: Math.floor((h - 260) / 64)}, (_, i) => (
            <div key={i} style={{position: 'absolute', left: 150, top: 170 + i * 64, height: 22, width: (w - 300) * (0.82 + random(`${seed}l${i}`) * 0.18), background: 'rgba(244,239,230,0.08)'}} />
          ))}
          <div style={{position: 'absolute', left: 0, right: 0, top: 60, textAlign: 'center', fontFamily: JF.mono, fontSize: 34, letterSpacing: 2, color: 'rgba(244,239,230,0.7)'}}>PLACEHOLDER: {src}</div>
          {note && <div style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', fontFamily: JF.mono, fontSize: 24, color: 'rgba(244,239,230,0.45)'}}>{note}</div>}
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** A line of text set on a placeholder page at a line box, so a guided read shows the words that will be on the scan. */
export const PageLine: React.FC<{text: string; box: [number, number, number, number]}> = ({text, box: [x, y, , hh]}) => (
  <div style={{position: 'absolute', left: x, top: y - hh * 0.12, fontFamily: JF.heavy, fontWeight: 900, fontSize: hh, lineHeight: 1.1, color: 'rgba(244,239,230,0.82)', whiteSpace: 'nowrap'}}>{text}</div>
);

// ------------------------------------------------------------------ marks
/** The orange strike-through: a slightly bowed 8 px stroke from (x1, y1) to (x2, y2), drawn over 5 frames. */
export const Strike: React.FC<{x1: number; y1: number; x2: number; y2: number; at: number; bow?: number; width?: number; out?: number}> = ({x1, y1, x2, y2, at, bow = -10, width = 8, out = Infinity}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at || g >= out) return null;
  const p = interpolate(g, [at, at + 5], [0, 1], clamp);
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + bow;
  const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  const len = Math.hypot(x2 - x1, y2 - y1) * 1.05;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
      <path d={d} stroke="rgba(0,0,0,0.5)" strokeWidth={width + 4} fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} transform="translate(3 4)" />
      <path d={d} stroke={boxOf(pal)} strokeWidth={width} fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
    </svg>
  );
};

/** A grid of `n` small round marks, `cols` across from (x, y), `gap` apart; `color(i)` per mark; they pop in `per` frames apart. */
export const Tally: React.FC<{n: number; cols: number; x: number; y: number; gap?: number; r?: number; at: number; per?: number; color: (i: number) => string}> = ({
  n, cols, x, y, gap = 34, r = 11, at, per = 0.25, color,
}) => {
  const g = useGFrame();
  return (
    <>
      {Array.from({length: n}, (_, i) => {
        const a = at + i * per;
        if (g < a) return null;
        const k = interpolate(g, [a, a + 2.5, a + 5], [0, 1.3, 1], clamp);
        return <div key={i} style={{position: 'absolute', left: x + (i % cols) * gap - r, top: y + Math.floor(i / cols) * gap - r, width: r * 2, height: r * 2, borderRadius: r,
          background: color(i), border: '3px solid #111', transform: `scale(${k})`, transition: 'none'}} />;
      })}
    </>
  );
};

/** A hand-drawn barrel in teal (bowed staves, three hoops, an open top), drawing on over `dur` frames. (x, y) = top-left, w wide. */
export const Barrel: React.FC<{x: number; y: number; w: number; at: number; dur?: number}> = ({x, y, w, at, dur = 12}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  const h = w * 1.25, b = w * 0.1, ry = w * 0.14;
  const paths = [
    `M ${b} ${ry} Q ${-b * 0.6} ${h / 2} ${b} ${h - ry}`,
    `M ${w - b} ${ry} Q ${w + b * 0.6} ${h / 2} ${w - b} ${h - ry}`,
    `M ${b} ${h - ry} Q ${w / 2} ${h + ry * 0.9} ${w - b} ${h - ry}`,
    `M ${b * 0.2} ${h * 0.3} Q ${w / 2} ${h * 0.3 + ry * 1.1} ${w - b * 0.2} ${h * 0.3}`,
    `M ${b * 0.2} ${h * 0.7} Q ${w / 2} ${h * 0.7 + ry * 1.1} ${w - b * 0.2} ${h * 0.7}`,
  ];
  return (
    <svg width={w + 40} height={h + 40} style={{position: 'absolute', left: x - 20, top: y - 20, overflow: 'visible'}}>
      <g transform="translate(20 20)" fill="none" stroke={pal.mark} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx={w / 2} cy={ry} rx={w / 2 - b} ry={ry} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, p * 1.6)} />
        {paths.map((d, i) => <path key={i} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, Math.min(1, p * 1.6 - 0.12 * i))} />)}
      </g>
    </svg>
  );
};

// ------------------------------------------------------------------ slots: the real asset when it exists, a placeholder until then
/** A Print (archival print slapped on the desk) once `src` is in public/, else a Placeholder in the same box. */
export const PrintSlot: React.FC<{src: string; x: number; y: number; w: number; h: number; at: number; out?: number; rot?: number; pos?: string; tag?: string;
  fit?: 'cover' | 'contain'; note?: string}> = ({note, ...p}) => (hasFile(p.src)
  ? <Print {...p} />
  : <Placeholder file={p.src} x={p.x} y={p.y} w={p.w} h={p.h} rot={p.rot} at={p.at} out={p.out} note={note} />);

/** A Prop (img/props/<name>.webp cut-out) once it exists, else a Placeholder `w` x `h` at (x, y). */
export const PropSlot: React.FC<{name: string; x: number; y: number; w: number; h: number; at: number; out?: number; rot?: number; coral?: boolean; trace?: boolean;
  note?: string}> = ({name, h, note, ...p}) => (hasFile(`img/props/${name}.webp`)
  ? <Prop name={name} {...p} />
  : <Placeholder file={`img/props/${name}.webp`} x={p.x} y={p.y} w={p.w} h={h} rot={p.rot} at={p.at} out={p.out} note={note} tone="#22201b" />);

// ------------------------------------------------------------------ the diorama
/** One plane: its file (full-frame 16:9 RGBA, cut from black), its depth (0 = sky, 1 = front) and, until it exists, the band
 *  (y, h, tone) its shapes will occupy, so the composition and the motion are already right. */
export type Plane = {src: string; depth: number; band: [number, number]; tone: string};

/** Planes slide sideways at different speeds between frames a and b (smooth camera, `drift` px at depth 1), with a slow 2% push. */
export const Diorama: React.FC<{planes: Plane[]; a: number; b: number; drift?: number}> = ({planes, a, b, drift = 90}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [a, b], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
      {planes.map((pl, i) => {
        const dx = -drift * pl.depth * p + drift * pl.depth * 0.5;
        const z = 1.08 + 0.02 * pl.depth * p;
        const real = hasFile(pl.src);
        return (
          <AbsoluteFill key={i} style={{transform: `translateX(${dx}px) scale(${z})`, transformOrigin: '50% 60%'}}>
            {real ? <Img src={staticFile(pl.src)} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover'}} />
              : (
                <div style={{position: 'absolute', left: -120, width: 2160, top: pl.band[0], height: pl.band[1], background: pl.tone, clipPath: tornPoly(`dio${i}`, 2160, pl.band[1], 26, 40),
                  outline: '2px dashed rgba(244,239,230,0.22)', outlineOffset: -14}}>
                  <div style={{position: 'absolute', left: i === 0 ? 1150 : 260 + i * 330, top: pl.band[0] < 100 ? 160 : 26, fontFamily: JF.mono, fontSize: 18, letterSpacing: 1, color: 'rgba(244,239,230,0.7)', whiteSpace: 'nowrap',
                    textShadow: '0 1px 4px rgba(0,0,0,0.8)'}}>PLACEHOLDER: {pl.src}</div>
                </div>
              )}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
