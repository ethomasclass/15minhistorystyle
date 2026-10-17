// A real photo as a true 3D scene: the depth layers from tools/photo3d.py (public/img/layers3d/<name>/) placed at
// their estimated distance in front of a perspective camera. Each layer is scaled so the stack lines up exactly with
// the original photo at the start; then the camera dollies in and orbits a little, and near things sweep past far ones.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';

export const Photo3D: React.FC<{
  name: string; depths: number[]; size: [number, number];
  a: number; b: number;             // camera move from frame a to b
  dolly?: number;                   // how far the camera moves in (px of scene depth)
  yaw?: [number, number];           // orbit, degrees, start → end
  pan?: [number, number];           // sideways drift, px, start → end
  rise?: [number, number];          // vertical drift, px
  deep?: number;                    // scene depth from nearest to farthest layer (px); more = stronger 3D
  over?: number;                    // overscan so edges never show
  filter?: string;
  children?: React.ReactNode;
}> = ({name, depths, size, a, b, dolly = 260, yaw = [-3, 3], pan = [0, 0], rise = [0, 0], deep = 1600, over = 1.14,
  filter = 'grayscale(1) contrast(1.12)', children}) => {
  const f = useCurrentFrame();
  const u = interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
  const P = 1000;
  const cover = Math.max(1920 / size[0], 1080 / size[1]) * over;
  const w = size[0] * cover, h = size[1] * cover;
  const cam = dolly * u;
  const ry = yaw[0] + (yaw[1] - yaw[0]) * u;
  const tx = pan[0] + (pan[1] - pan[0]) * u;
  const ty = rise[0] + (rise[1] - rise[0]) * u;
  return (
    <AbsoluteFill style={{background: '#0b0b0b', overflow: 'hidden', perspective: P, perspectiveOrigin: '50% 50%', filter}}>
      <div style={{position: 'absolute', left: 960, top: 540, width: 0, height: 0, transformStyle: 'preserve-3d',
        transform: `translate3d(${tx}px, ${ty}px, ${cam}px) translateZ(${-deep * 0.45}px) rotateY(${ry}deg) translateZ(${deep * 0.45}px)`}}>
        {depths.map((d, k) => {
          const z = -(1 - d) * deep;              // far layers pushed back
          const s = (P - z) / P;                  // and enlarged so they line up at the start
          return (
            <Img key={k} src={staticFile(`img/layers3d/${name}/L${String(k).padStart(2, '0')}.png`)}
              style={{position: 'absolute', left: -w / 2, top: -h / 2, width: w, height: h,
                transform: `translateZ(${z}px) scale(${s})`}} />
          );
        })}
      </div>
      {children}
    </AbsoluteFill>
  );
};
