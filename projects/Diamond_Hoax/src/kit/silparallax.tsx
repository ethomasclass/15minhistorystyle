// Multi-plane parallax for the layered-silhouette paintings (tools/sil_layers.py splits each one into depth planes).
// The camera pushes in and drifts sideways; each plane moves by its own depth (near planes most, the sky barely), soft fog
// drifts between the back planes, and the orange lights flicker like fire. The paintings keep their own colours.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export type SilCam = {z?: [number, number]; x?: [number, number]; y?: [number, number]};

/**
 * `name`: the folder under public/img/layers/sil/. `size`, `bands`, `glowLayer` come from its layers.json.
 * `a..b`: the frames of the move. `cam.z` zoom [start, end] for the near plane (default 1.04 → 1.14), `cam.x`/`cam.y` pan in
 * px at 1080p for the near plane ([start, end]); farther planes get proportionally less. `fog` 0..1, `flicker` 0..1.
 */
export const SilScene: React.FC<{name: string; size: [number, number]; bands?: number; glowLayer?: number; a: number; b: number;
  cam?: SilCam; fog?: number; flicker?: number; fade?: number}> = ({name, size, bands = 4, glowLayer = 0, a, b, cam = {}, fog = 0.35, flicker = 0.6, fade = 8}) => {
  const f = useCurrentFrame();
  const u = interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
  const lerp = (r: [number, number] | undefined, d: [number, number]) => (r ?? d)[0] + ((r ?? d)[1] - (r ?? d)[0]) * u;
  const [W, H] = size;
  const cover = Math.max(1920 / W, 1080 / H);
  // depth weight per plane: near = 1, back plate = 0.08 (the sky still breathes a little)
  const wt = (i: number) => 1 - (i / (bands - 1)) * 0.92;
  const zNear = lerp(cam.z, [1.04, 1.14]);
  const xNear = lerp(cam.x, [-30, 30]);
  const yNear = lerp(cam.y, [0, -10]);
  const drift = (i: number) => ({x: noise2D(`${name}dx${i}`, f * 0.01, 0) * 4 * wt(i), y: noise2D(`${name}dy${i}`, 0, f * 0.01) * 3 * wt(i)});
  const style = (i: number): React.CSSProperties => {
    const z = 1 + (zNear - 1) * wt(i) + 0.02;                  // +2% so the back plate never shows an edge
    const d = drift(i);
    return {position: 'absolute', left: '50%', top: '50%', width: W * cover, height: H * cover, marginLeft: -(W * cover) / 2, marginTop: -(H * cover) / 2,
      transform: `translate(${xNear * wt(i) + d.x}px, ${yNear * wt(i) + d.y}px) scale(${z})`};
  };
  const file = (i: number) => staticFile(`img/layers/sil/${name}/L${i}.${i === bands - 1 ? 'jpg' : 'webp'}`);
  const flick = 1 + flicker * (0.35 * noise2D(`${name}fl`, f * 0.21, 0) + 0.15 * noise2D(`${name}fl2`, f * 0.57, 3));
  const opacity = interpolate(f, [a, a + fade, b - fade, b], [0, 1, 1, 0], clamp);
  const fogBlob = (k: number, i: number) => {
    const t = f * 0.0025 + k * 0.37;
    const x = ((t % 1) * 1.6 - 0.3) * 1920;
    const y = 560 + Math.sin(k * 2.1 + f * 0.004) * 140;
    return <div key={`fog${k}`} style={{position: 'absolute', left: x - 700, top: y - 220, width: 1400, height: 440, borderRadius: '50%',
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
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)'}} />
    </AbsoluteFill>
  );
};
