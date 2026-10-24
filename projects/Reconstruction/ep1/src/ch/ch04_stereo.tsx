// Chapter 4's opening shot: a camera move into an 1865 stereograph of Richmond's burnt district, on a mesh displaced by a
// depth map (ported from tests/src/tests/StereoTest.tsx, the part the user liked: the move *into* the photo).
// Source: "View from the Petersburgh railroad depot, Richmond, Va., looking south-west, showing a portion of the burnt
// district", E. & H.T. Anthony & Co., 1865 (LOC LC-DIG-ppmsca-18951). Depth: Depth Anything V2 on the left photo, checked
// against the stereo pair's own matches; near chimneys cut out (near.png) over a painted back layer (bg.jpg).
// Needs WebGL: render with --gl=swangle (tools/render.sh: SWANGLE="04"). The text probe renders without WebGL, so with
// the probe on (and only then) this draws the flat photo instead.
import React from 'react';
import {AbsoluteFill, continueRender, delayRender, Easing, getInputProps, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';

const DIR = 'img/stereo';
const PHOTO: [number, number] = [2000, 1726];
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);

const useImageData = (src: string) => {
  const [handle] = React.useState(() => delayRender('depth ' + src));
  const [data, setData] = React.useState<ImageData | null>(null);
  React.useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const g = c.getContext('2d')!;
      g.drawImage(img, 0, 0);
      setData(g.getImageData(0, 0, img.width, img.height));
      continueRender(handle);
    };
    img.src = src;
  }, [src, handle]);
  return data;
};

const useTexture = (src: string) => {
  const [handle] = React.useState(() => delayRender('tex ' + src));
  const [tex, setTex] = React.useState<THREE.Texture | null>(null);
  React.useEffect(() => {
    new THREE.TextureLoader().load(src, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      setTex(t);
      continueRender(handle);
    });
  }, [src, handle]);
  return tex;
};

const PW = 10; // plane width in scene units
const PH = (PW * PHOTO[1]) / PHOTO[0];
const DEPTH = 2.2; // displacement for depth 1.0 (near)
const FOV = 34;
const D0 = (PW * 0.5) / (Math.tan(((FOV / 2) * Math.PI) / 180) * (16 / 9)); // camera distance where the plane just fills the width

/** A photo on a mesh displaced by its depth map. */
const Mesh: React.FC<{depth: ImageData; tex: THREE.Texture; z?: number; cut?: boolean; scale?: number; tear?: number}> = ({depth, tex, z = 0, cut, scale = 1, tear}) => {
  const geo = React.useMemo(() => {
    const sx = 640, sy = Math.round(640 * (PH / PW));
    const g = new THREE.PlaneGeometry(PW, PH, sx, sy);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const u = uv.getX(i), v = uv.getY(i);
      const px = Math.min(depth.width - 1, Math.round(u * (depth.width - 1)));
      const py = Math.min(depth.height - 1, Math.round((1 - v) * (depth.height - 1)));
      pos.setZ(i, (depth.data[(py * depth.width + px) * 4] / 255) * DEPTH * scale + z);
    }
    // `tear`: drop triangles that span a big depth jump, so a near edge separates from what's behind it instead of
    // stretching its texture back like a rubber sheet (the back layer fills the gap)
    if (tear) {
      const idx = g.index!.array as ArrayLike<number>;
      const keep: number[] = [];
      for (let t = 0; t < idx.length; t += 3) {
        const a = pos.getZ(idx[t]), b = pos.getZ(idx[t + 1]), c = pos.getZ(idx[t + 2]);
        if (Math.max(a, b, c) - Math.min(a, b, c) < tear) keep.push(idx[t], idx[t + 1], idx[t + 2]);
      }
      g.setIndex(keep);
    }
    pos.needsUpdate = true;
    return g;
  }, [depth, z, scale, tear]);
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial map={tex} toneMapped={false} transparent={cut} alphaTest={cut ? 0.5 : 0} />
    </mesh>
  );
};

/** The camera: from the flat framing (photo fills the width, centred 38% down) a few steps in, drifting right. */
const Rig: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {camera} = useThree();
  const t = ease(interpolate(f, [0, dur], [0, 1], clamp));
  const y0 = PH * (0.5 - 0.38);
  const x = interpolate(t, [0, 1], [0, 0.22]);
  const y = interpolate(t, [0, 1], [y0, y0 - 0.22]);
  const z = interpolate(t, [0, 1], [D0 - 0.2, D0 - 1.9]);
  camera.position.set(x, y, z);
  camera.lookAt(x * 0.2, y0 - 0.12, 0);
  (camera as THREE.PerspectiveCamera).fov = FOV;
  camera.updateProjectionMatrix();
  return null;
};

const Into: React.FC<{dur: number}> = ({dur}) => {
  const {width, height} = useVideoConfig();
  const depth = useImageData(staticFile(`${DIR}/depth.png`));
  const depthBg = useImageData(staticFile('img/ch04/stereo_depth_bg_fill.png'));  // depth_bg.png filled the same way, so the filled holes sit at the depth beside them
  const tex = useTexture(staticFile(`${DIR}/near.png`));
  const texBg = useTexture(staticFile('img/ch04/stereo_bg_fill.jpg'));  // bg.jpg with the chimney holes filled by a mirror clone from their inner side (sharper than the painted fill)
  // Mount the canvas only once everything has loaded: while rendering, R3F draws only when the frame changes, so meshes
  // added after the canvas was created would be missing (or the canvas black) in that frame.
  if (!depth || !depthBg || !tex || !texBg) return null;
  return (
    <ThreeCanvas width={width} height={height} camera={{fov: FOV, position: [0, 0, D0], near: 0.05, far: 100}}>
      <color attach="background" args={['#0d0c09']} />
      <Rig dur={dur} />
      <Mesh depth={depthBg} tex={texBg} z={-0.03} scale={0.5} />
      <Mesh depth={depth} tex={tex} cut z={0.02} tear={0.12} />
    </ThreeCanvas>
  );
};

/** Flat stand-in for the text probe (no WebGL there): the left photo with a plain push. */
const Flat: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const s = (1920 / PHOTO[0]) * interpolate(f, [0, dur], [1, 1.25], clamp);
  return <Img src={staticFile(`${DIR}/left.jpg`)} style={{position: 'absolute', left: 960 - PHOTO[0] * s * 0.5, top: 540 - PHOTO[1] * s * 0.38, width: PHOTO[0] * s, height: PHOTO[1] * s}} />;
};

/** The move into the photograph over `dur` frames (from frame 0 of its sequence). */
export const StereoInto: React.FC<{dur: number}> = ({dur}) => (
  <AbsoluteFill style={{background: '#0d0c09', filter: 'grayscale(1) contrast(1.12)'}}>
    {getInputProps().probe ? <Flat dur={dur} /> : <Into dur={dur} />}
  </AbsoluteFill>
);
