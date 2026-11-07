// Portrait (1080x1920) pieces for the Balloon War Shorts. Patterns copied from Diamond Hoax's custom-narration Short
// (projects/Diamond_Hoax/src/vshort_heist.tsx, vshorts.tsx: VSil, Mark, TapeCaption, Band) and rebuilt on this video's kit.
// YouTube's UI covers the top ~150 px, the bottom ~400 px and the right ~150 px below y 900: no TEXT there (pictures run on
// underneath it to the frame's edge). Scene text in x 60-930, y 160-1150; captions at CAP_Y; source tags at TAG_Y.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import * as THREE from 'three';
import {JF} from '../kit/Kit';
import {type Cam} from '../fx/kit3d';
import {type Word} from '../lib/timing';

export const VW = 1080;
export const VH = 1920;
export const TEAL = '#2FE0C4';
export const ORANGE = '#FF9F1C';
export const CORAL = '#FF6F61';
export const CREAM = '#f4efe6';
export const INKBG = '#0d0c09';
/** Caption line top; the band behind it; source tags just above YouTube's bottom UI. */
export const CAP_Y = 1196;
export const TAG_Y = 1468;
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sine = Easing.inOut(Easing.sin);

/** The channel wordmark, small, top-left (YouTube puts its own icons top-right). Fully drawn on frame 0. */
export const Mark: React.FC = () => (
  <div style={{position: 'absolute', left: 40, top: 46, padding: '10px 14px', borderRadius: 10, background: 'rgba(13,12,9,0.62)'}}>
    <Img src={staticFile('img/brand/chunk-history-horizontal.svg')} style={{width: 236, display: 'block'}} />
  </div>
);

/** Soft dark band behind the captions, so they read over any picture without boxing it. */
export const Band: React.FC<{y?: number}> = ({y = CAP_Y}) => (
  <div style={{position: 'absolute', left: 0, top: y - 100, width: VW, height: 340,
    background: 'linear-gradient(180deg, rgba(8,7,5,0) 0%, rgba(8,7,5,0.72) 30%, rgba(8,7,5,0.72) 70%, rgba(8,7,5,0) 100%)'}} />
);

/** Source tag on a small dark pill (cream text vanishes over a pale print otherwise). */
export const VTag: React.FC<{text: string; y?: number; o?: number}> = ({text, y = TAG_Y, o = 1}) => (
  <div style={{position: 'absolute', left: 60, top: y, maxWidth: 860, padding: '6px 12px', borderRadius: 6, background: 'rgba(13,12,9,0.78)', fontFamily: JF.mono, fontSize: 18,
    letterSpacing: 1, color: 'rgba(255,255,255,0.86)', textTransform: 'uppercase', opacity: o}}>{text}</div>
);

/**
 * Live captions from the word timings: up to three words, never across a sentence end (or a comma); the spoken word on
 * orange tape. `quiet` ranges drop the tape (the Bly beat): the spoken word full cream, the others dimmed. Off inside `hide`.
 */
export const Captions: React.FC<{words: Word[]; fps: number; hide: [number, number][]; quiet: [number, number][]}> = ({words, fps, hide, quiet}) => {
  const f = useCurrentFrame();
  if (hide.some(([a, b]) => f >= a && f < b)) return null;
  const t = f / fps;
  const i = words.findIndex((w) => w.e >= t - 0.05);
  if (i < 0 || t < words[0].s - 0.1) return null;
  // nothing between sentences: a caption clears 0.35 s after its last word when the next is a while off
  if (t < words[i].s - 0.35 && i > 0 && t > words[i - 1].e + 0.35) return null;
  const chunks: number[] = [0];
  words.forEach((w, k) => {
    if (k === 0) return;
    if (k - chunks[chunks.length - 1] >= 3 || /[.?!:,]["”']?$/.test(words[k - 1].w)) chunks.push(k);
  });
  const start = chunks.filter((c) => c <= i).pop() ?? 0;
  const end = chunks.find((c) => c > i) ?? words.length;
  const q = quiet.some(([a, b]) => f >= a && f < b);
  const base: React.CSSProperties = {fontFamily: JF.sans, fontWeight: 800, fontSize: 88, lineHeight: 1.15, textTransform: 'uppercase', display: 'inline-block'};
  return (
    <>
      <Band />
      <div style={{position: 'absolute', left: 60, width: 870, top: CAP_Y, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '4px 20px'}}>
        {words.slice(start, end).map((w, k) => {
          const txt = w.w.replace(/[{}*"“”]/g, '').replace(/[,:]$/, '');
          const hot = start + k === i && t >= w.s - 0.05;
          if (q) return <span key={k} style={{...base, color: CREAM, opacity: hot ? 1 : 0.62, textShadow: '0 5px 0 #0d0c09, 0 0 18px rgba(0,0,0,0.95)'}}>{txt}</span>;
          return hot ? (
            <span key={k} style={{...base, color: '#15120d', background: ORANGE, padding: '0 16px', transform: 'rotate(-2deg)', boxShadow: '0 6px 0 #0d0c09',
              clipPath: 'polygon(1% 6%, 99% 0, 100% 52%, 98% 100%, 2% 95%, 0 45%)'}}>{txt}</span>
          ) : (
            <span key={k} style={{...base, color: CREAM, textShadow: '0 5px 0 #0d0c09, 0 0 18px rgba(0,0,0,0.95)'}}>{txt}</span>
          );
        })}
      </div>
    </>
  );
};

/** A plane insert: a cut-out or glow placed on one depth plane, in the painting's own pixels. */
export type VInsert = {plane: number; node: React.ReactNode};

/**
 * SilScene (kit/silparallax.tsx) rebuilt for the tall frame. The painting is scaled to `k` x the height that fills 1920
 * (k >= 1), its top edge sits at screen y `top` (default: centred), and the painting x `cx` sits at the frame's centre,
 * sliding from cx[0] to cx[1] between frames a and b while the camera pushes in (`z`, near plane; farther planes less) about
 * screen point (540, `oy`). When `top` > 0 the sky plate is continued above the painting by its top rows, mirrored and stretched, so a
 * scene can sit low in the frame under the type. `glow` adds the glow plate (screen blend, flickering) on `glowLayer`.
 */
export const VSil: React.FC<{name: string; size?: [number, number]; bands?: number; glowLayer?: number; glow?: number; a: number; b: number; cx: [number, number];
  k?: number; top?: number; z?: [number, number]; oy?: number; drift?: [number, number]; insert?: VInsert[]; fog?: number; quietGrade?: boolean}> = ({
  name, size = [2752, 1536], bands = 4, glowLayer = 0, glow = 0.55, a, b, cx, k = 1, top, z = [1.02, 1.08], oy = 960, drift = [14, -14], insert = [], fog = 0, quietGrade = false,
}) => {
  const f = useCurrentFrame();
  const u = interpolate(f, [a, b], [0, 1], {...clamp, easing: sine});
  const [W, H] = size;
  const S = (VH / H) * k;
  const Wc = W * S, Hc = H * S;
  const y0 = top ?? (VH - Hc) / 2;
  const lim = VW / 2 / S;
  const x = Math.min(W - lim, Math.max(lim, cx[0] + (cx[1] - cx[0]) * u));
  const wt = (i: number) => 1 - (i / (bands - 1)) * 0.92;
  const zNear = z[0] + (z[1] - z[0]) * u;
  const xNear = drift[0] + (drift[1] - drift[0]) * u;
  const box = (i: number): React.CSSProperties => {
    const zz = 1 + (zNear - 1) * wt(i) + 0.02;
    const dx = noise2D(`${name}dx${i}`, f * 0.01, 0) * 4 * wt(i);
    const dy = noise2D(`${name}dy${i}`, 0, f * 0.01) * 3 * wt(i);
    return {position: 'absolute', left: VW / 2 - x * S, top: y0, width: Wc, height: Hc, transformOrigin: `${x * S}px ${oy - y0}px`,
      transform: `translate(${xNear * wt(i) + dx}px, ${dy}px) scale(${zz})`};
  };
  const file = (i: number) => staticFile(`img/layers/sil/${name}/L${i}.${i === bands - 1 ? 'jpg' : 'webp'}`);
  const flick = 1 + 0.5 * (0.35 * noise2D(`${name}fl`, f * 0.21, 0) + 0.15 * noise2D(`${name}fl2`, f * 0.57, 3));
  const img: React.CSSProperties = {position: 'absolute', left: 0, top: 0, width: '100%', height: '100%'};
  const planes: React.ReactNode[] = [];
  for (let i = bands - 1; i >= 0; i--) {
    planes.push(
      <div key={`L${i}`} style={box(i)}>
        {/* the sky continued upward: its top rows mirrored and stretched 3x, so nothing below them (a moon, a flash) repeats */}
        {i === bands - 1 && y0 > 0 && <Img src={file(i)} style={{...img, transform: 'scaleY(-3)', transformOrigin: '50% 0%'}} />}
        <Img src={file(i)} style={img} />
        {insert.filter((s) => s.plane === i).map((s, j) => <React.Fragment key={j}>{s.node}</React.Fragment>)}
      </div>,
    );
    if (glow > 0 && i === glowLayer) planes.push(
      <div key="glow" style={box(i)}><Img src={staticFile(`img/layers/sil/${name}/glow.webp`)} style={{...img, mixBlendMode: 'screen', opacity: glow * flick, filter: 'blur(6px) brightness(1.4)'}} /></div>,
    );
    if (fog > 0 && (i === bands - 2 || i === bands - 3)) planes.push(<FogBlob key={`fog${i}`} f={f} k={i} fog={fog} />);
  }
  return (
    <AbsoluteFill style={{background: INKBG, overflow: 'hidden', filter: quietGrade ? 'saturate(0.85)' : undefined}}>
      {planes}
      {/* a painting lifted above the frame's foot: its dark ground runs on into the dark below */}
      {y0 + Hc < VH && <div style={{position: 'absolute', left: 0, right: 0, top: y0 + Hc - 140, bottom: 0, background: `linear-gradient(180deg, rgba(13,12,9,0) 0px, ${INKBG} 120px)`}} />}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.38) 100%)'}} />
    </AbsoluteFill>
  );
};

const FogBlob: React.FC<{f: number; k: number; fog: number}> = ({f, k, fog}) => {
  const t = f * 0.0022 + k * 0.37;
  const x = ((t % 1) * 1.6 - 0.3) * VW;
  const y = 1000 + Math.sin(k * 2.1 + f * 0.004) * 160;
  return <div style={{position: 'absolute', left: x - 600, top: y - 220, width: 1200, height: 440, borderRadius: '50%',
    background: 'radial-gradient(ellipse at center, rgba(163,186,178,0.5) 0%, rgba(163,186,178,0) 70%)', opacity: fog, filter: 'blur(30px)', mixBlendMode: 'screen'}} />;
};

/** A point in painting pixels inside a plane box (for inserts). */
export const atPx = (size: [number, number], x: number, y: number): React.CSSProperties => ({position: 'absolute', left: `${(x / size[0]) * 100}%`, top: `${(y / size[1]) * 100}%`});

/**
 * A B&W archival photo filling the tall frame: centred on source pixel (fx, fy) and pushed from z0 to z1 (x the cover scale)
 * between frames a and b, never showing an edge. `fade` frames of fade-in (0 = a hard cut), `dim` darkens it.
 */
export const VPhoto: React.FC<{src: string; size: [number, number]; fx: [number, number]; fy: [number, number]; z: [number, number]; a: number; b: number; dim?: number;
  fade?: number; vignette?: number; ease?: (t: number) => number}> = ({src, size, fx, fy, z, a, b, dim = 0, fade = 0, vignette = 0.6, ease = sine}) => {
  const f = useCurrentFrame();
  const u = interpolate(f, [a, b], [0, 1], {...clamp, easing: ease});
  const [W, H] = size;
  const sc = Math.max(VW / W, VH / H) * (z[0] + (z[1] - z[0]) * u);
  const px = fx[0] + (fx[1] - fx[0]) * u, py = fy[0] + (fy[1] - fy[0]) * u;
  const left = Math.min(0, Math.max(VW - W * sc, VW / 2 - px * sc));
  const top = Math.min(0, Math.max(VH - H * sc, VH / 2 - py * sc));
  const o = fade > 0 ? interpolate(f, [a, a + fade], [0, 1], clamp) : 1;
  return (
    <AbsoluteFill style={{background: INKBG, overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', left, top, width: W * sc, height: H * sc, opacity: o, filter: `grayscale(1) contrast(1.15) brightness(${0.95 - dim})`}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,${vignette}) 100%)`}} />
    </AbsoluteFill>
  );
};

/**
 * A 3D piece from fx/ at the Short's own size: its Stage reads the 1080x1920 frame, so the canvas renders natively in portrait
 * (no upscaling). Pass `hud={false}` to the piece (its DOM overlay is laid out for 1920x1080) and draw labels with `projV`.
 */
export const V3D: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill style={{overflow: 'hidden'}}>{children}</AbsoluteFill>;

/** Screen position (1080x1920) of a world point for a kit3d camera (the same placement as makeCam, at the portrait aspect). */
export const projV = (c: Cam, p: readonly number[]) => {
  const near = c.near ?? Math.max(0.0005, c.dist * 0.02);
  const far = c.far ?? c.dist * 6 + 60;
  const cam = new THREE.PerspectiveCamera(c.fov ?? 30, VW / VH, near, far);
  const [tx, ty, tz] = c.target;
  cam.position.set(tx + Math.sin(c.yaw) * Math.cos(c.pitch) * c.dist, ty + Math.sin(c.pitch) * c.dist, tz + Math.cos(c.yaw) * Math.cos(c.pitch) * c.dist);
  cam.lookAt(tx, ty, tz);
  cam.updateMatrixWorld(true);
  cam.updateProjectionMatrix();
  const v = new THREE.Vector3(p[0], p[1], p[2]).project(cam);
  return {x: ((v.x + 1) / 2) * VW, y: ((1 - v.y) / 2) * VH};
};

/** Big plain type (the cover and the payoff): Inter 800, white, heavy shadow, fades in at `at` (frame 0 = fully drawn if at < 0). */
export const BigType: React.FC<{lines: string[]; x: number; y: number; size: number; at?: number; color?: string; align?: 'left' | 'center'; w?: number; lh?: number}> = ({
  lines, x, y, size, at = -99, color = '#ffffff', align = 'left', w = 870, lh = 1.02,
}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 8], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, textAlign: align, opacity: o, fontFamily: JF.sans, fontWeight: 800, fontSize: size, lineHeight: lh, letterSpacing: -1,
      color, textTransform: 'uppercase', textShadow: '0 6px 0 #0d0c09, 0 0 30px rgba(0,0,0,0.85), 0 0 8px rgba(0,0,0,0.9)'}}>
      {lines.map((l, i) => <div key={i}>{l}</div>)}
    </div>
  );
};

/** One scene: rendered only between its cut and the next, in its own time (frame 0 = the cut). */
export const Cut: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => (
  <Sequence from={from} durationInFrames={Math.max(1, to - from)} layout="none"><AbsoluteFill>{children}</AbsoluteFill></Sequence>
);
