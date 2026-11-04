// Multi-plane parallax for the silhouette paintings (tools/sil_layers.py splits each into depth planes). Copied from Diamond Hoax
// and adapted for the Balloon War palette: the camera pushes in and drifts; each plane moves by its own depth (near planes most,
// the sky barely); sage mist drifts between the back planes; optional dust motes hang in a lamp beam (12 drawings a second); and
// `insert` puts a separate cut-out (the balloon) on a chosen plane, in painting pixels, so it rides that plane's parallax and can
// move on its own.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const step = (f: number) => Math.floor(f / 2.5) * 2.5;

export type SilCam = {z?: [number, number]; x?: [number, number]; y?: [number, number]};
export type SilInsert = {plane: number; node: React.ReactNode};
/** A dust beam: a region of the painting (px), how many motes, and a seed. */
export type Dust = {x: number; y: number; w: number; h: number; n?: number; seed?: string};

/**
 * `name`: the folder under public/img/layers/sil/. `size`, `bands` come from its layers.json.
 * `a..b`: the frames of the move. `cam.z` zoom [start, end] for the near plane (default 1.04 → 1.12), `cam.x`/`cam.y` pan in px at
 * 1080p for the near plane; farther planes get proportionally less. `fog` 0..1. `insert`: cut-outs placed on a plane, positioned in
 * the painting's own pixels. `dust`: motes drifting in a lamp beam (painting pixels).
 */
export const SilScene: React.FC<{name: string; size?: [number, number]; bands?: number; glowLayer?: number; a: number; b: number;
  cam?: SilCam; fog?: number; fade?: number; insert?: SilInsert[]; dust?: Dust}> = ({name, bands = 4, a, b, cam = {}, fog = 0.3, fade = 10, insert = [], dust, size = [2752, 1536]}) => {
  const f = useCurrentFrame();
  const u = interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
  const lerp = (r: [number, number] | undefined, d: [number, number]) => (r ?? d)[0] + ((r ?? d)[1] - (r ?? d)[0]) * u;
  const [W, H] = size;
  const cover = Math.max(1920 / W, 1080 / H);
  const wt = (i: number) => 1 - (i / (bands - 1)) * 0.92; // near = 1, back plate = 0.08
  const zNear = lerp(cam.z, [1.04, 1.12]);
  const xNear = lerp(cam.x, [-30, 30]);
  const yNear = lerp(cam.y, [0, -10]);
  const drift = (i: number) => ({x: noise2D(`${name}dx${i}`, f * 0.01, 0) * 4 * wt(i), y: noise2D(`${name}dy${i}`, 0, f * 0.01) * 3 * wt(i)});
  const box = (i: number): React.CSSProperties => {
    const z = 1 + (zNear - 1) * wt(i) + 0.02; // +2% so the back plate never shows an edge
    const d = drift(i);
    return {position: 'absolute', left: '50%', top: '50%', width: W * cover, height: H * cover, marginLeft: -(W * cover) / 2, marginTop: -(H * cover) / 2,
      transform: `translate(${xNear * wt(i) + d.x}px, ${yNear * wt(i) + d.y}px) scale(${z})`};
  };
  const file = (i: number) => staticFile(`img/layers/sil/${name}/L${i}.${i === bands - 1 ? 'jpg' : 'webp'}`);
  const opacity = interpolate(f, [a, a + fade, b - fade, b], [0, 1, 1, 0], clamp);
  const fogBlob = (k: number, i: number) => {
    const t = f * 0.0022 + k * 0.37;
    const x = ((t % 1) * 1.6 - 0.3) * 1920;
    const y = 600 + Math.sin(k * 2.1 + f * 0.004) * 120;
    return <div key={`fog${k}`} style={{position: 'absolute', left: x - 700, top: y - 200, width: 1400, height: 400, borderRadius: '50%',
      background: 'radial-gradient(ellipse at center, rgba(163,186,178,0.5) 0%, rgba(163,186,178,0) 70%)', opacity: fog * (0.5 + 0.5 * wt(i)), filter: 'blur(30px)', mixBlendMode: 'screen'}} />;
  };
  // painting px -> % inside a plane's box
  const px = (x: number, y: number): React.CSSProperties => ({position: 'absolute', left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`});
  const motes = () => {
    if (!dust) return null;
    const g = step(f);
    const n = dust.n ?? 26;
    return Array.from({length: n}, (_, k) => {
      const sx = noise2D(`${dust.seed ?? name}mx`, k, 0) * 0.5 + 0.5;
      const sy = noise2D(`${dust.seed ?? name}my`, 0, k) * 0.5 + 0.5;
      const x = dust.x + ((sx + g * 0.0009 * (0.5 + (k % 3) * 0.3)) % 1) * dust.w;
      const y = dust.y + ((sy + g * 0.0006 + noise2D('mz', k, g * 0.01) * 0.02 + 1) % 1) * dust.h;
      const s = 3 + (k % 4) * 1.6;
      const tw = 0.35 + 0.35 * (noise2D('mt', k, g * 0.05) * 0.5 + 0.5);
      return <div key={`m${k}`} style={{...px(x, y), width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2, borderRadius: '50%', background: '#F4EFE6', opacity: tw, filter: 'blur(0.6px)'}} />;
    });
  };
  const planes: React.ReactNode[] = [];
  for (let i = bands - 1; i >= 0; i--) {
    planes.push(
      <div key={`L${i}`} style={box(i)}>
        <Img src={file(i)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />
        {insert.filter((s) => s.plane === i).map((s, k) => <React.Fragment key={k}>{s.node}</React.Fragment>)}
        {i === 1 ? motes() : null}
      </div>,
    );
    if (i === bands - 2 || i === bands - 3) planes.push(fogBlob(i * 3, i), fogBlob(i * 3 + 1, i));
  }
  return (
    <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden', opacity}}>
      {planes}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.4) 100%)'}} />
    </AbsoluteFill>
  );
};

/** Place a cut-out inside a plane at painting pixel (x, y) = its anchor (centre-bottom by default), `w` painting px wide. */
export const PlaneImg: React.FC<{src: string; size: [number, number]; x: number; y: number; w: number; aspect: number; anchor?: [number, number]; style?: React.CSSProperties}> = ({src, size, x, y, w, aspect, anchor = [0.5, 0.5], style}) => {
  const [W, H] = size;
  return (
    <Img src={staticFile(src)} style={{position: 'absolute', left: `${((x - w * anchor[0]) / W) * 100}%`, top: `${((y - w * aspect * anchor[1]) / H) * 100}%`,
      width: `${(w / W) * 100}%`, height: 'auto', ...style}} />
  );
};
