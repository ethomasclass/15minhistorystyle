// Test 1: an 1865 stereograph on the desk -> the two photos flicking (real parallax) -> a camera move into the
// scene on a mesh displaced by a depth map (Depth Anything V2, checked against the stereo pair's own matches).
import React from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, interpolate, Easing, staticFile, useCurrentFrame, useVideoConfig, Sequence} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {DarkPaper} from '../kit/common';
import {Arrow, Note, Tag, useGFrame} from '../kit/Kit';
import {TestFrame} from './common';

const DIR = 'img/tests/stereo';
const PHOTO: [number, number] = [2000, 1726];
const CARD: [number, number] = [2400, 1139];
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);

// --- shot 1: the card on the desk ------------------------------------------------------------------------------
const Desk: React.FC = () => {
  const f = useCurrentFrame();
  const drop = interpolate(f, [0, 14], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.4))});
  const push = interpolate(f, [0, 120], [1, 1.07], clamp);
  const w = 1400;
  const h = (w * CARD[1]) / CARD[0];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${push})`}}>
        <div style={{position: 'absolute', left: (1920 - w) / 2, top: (1080 - h) / 2 + 10 - (1 - drop) * 220, width: w, height: h,
          transform: `rotate(${-1.5 + (1 - drop) * 6}deg) scale(${1.08 - 0.08 * drop})`, opacity: Math.min(1, drop * 3),
          boxShadow: `0 ${30 * drop}px ${50 * drop}px rgba(0,0,0,0.65)`}}>
          <Img src={staticFile(`${DIR}/card.jpg`)} style={{width: '100%', height: '100%', filter: 'sepia(0.25) contrast(1.08)'}} />
        </div>
        <Note text="left eye" x={545} y={918} at={46} size={40} rot={-3} />
        <Note text="right eye" x={1195} y={918} at={56} size={40} rot={-3} />
        <Arrow x1={650} y1={925} x2={650} y2={850} bow={-12} at={50} />
        <Arrow x1={1320} y1={925} x2={1320} y2={850} bow={12} at={60} />
      </AbsoluteFill>
      <Note text="a stereograph, 1865: two photos, two lenses" x={150} y={95} at={18} size={48} />
      <Tag text="E. & H.T. Anthony stereograph, 1865 · Library of Congress" />
    </AbsoluteFill>
  );
};

// --- shot 2: flick between the two photos -----------------------------------------------------------------------
const cover = (z: number, fy = 0.38) => {
  const s = (1920 / PHOTO[0]) * z;
  return {left: (1920 - PHOTO[0] * s) / 2, top: 540 - PHOTO[1] * s * fy, width: PHOTO[0] * s, height: PHOTO[1] * s};
};
const Wiggle: React.FC = () => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 90], [1.0, 1.04], clamp);
  const side = Math.floor(f / 4) % 2 ? 'right' : 'left';
  const r = cover(z);
  return (
    <AbsoluteFill>
      <Img src={staticFile(`${DIR}/${side}.jpg`)} style={{position: 'absolute', ...r, filter: 'contrast(1.1)'}} />
      <Note text="flick between the two photos, and the chimneys jump" x={120} y={90} at={14} size={46} />
      <Tag text="Richmond, Va., April 1865 · Library of Congress" />
    </AbsoluteFill>
  );
};

// --- shot 3: into the picture -----------------------------------------------------------------------------------
const useImageData = (src: string) => {
  const [handle] = React.useState(() => delayRender('depth'));
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
  const [handle] = React.useState(() => delayRender('tex'));
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

/** A photo on a mesh displaced by its depth map. `tear` drops triangles that span a big depth jump, so a near edge
 * separates from what's behind it instead of stretching like a rubber sheet; the back layer fills the gap. */
const Mesh: React.FC<{depth: ImageData; tex: THREE.Texture; tear?: number; z?: number; cut?: boolean; scale?: number}> = ({depth, tex, tear, z = 0, cut, scale = 1}) => {
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
  }, [depth, tear, z, scale]);
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial map={tex} toneMapped={false} transparent={cut} alphaTest={cut ? 0.5 : 0} />
    </mesh>
  );
};

const Rig: React.FC = () => {
  const f = useCurrentFrame();
  const {camera} = useThree();
  const t = ease(interpolate(f, [0, 235], [0, 1], clamp));
  // start: the flat framing of shot 2 (photo fills the width, centred 38% down); end: a few steps in, drifting right
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

const Into: React.FC = () => {
  const {width, height} = useVideoConfig();
  const depth = useImageData(staticFile(`${DIR}/depth.png`));
  const depthBg = useImageData(staticFile(`${DIR}/depth_bg.png`));
  const tex = useTexture(staticFile(`${DIR}/near.png`));
  const texBg = useTexture(staticFile(`${DIR}/bg.jpg`));
  return (
    <AbsoluteFill style={{filter: 'grayscale(1) contrast(1.1)'}}>
      <ThreeCanvas width={width} height={height} camera={{fov: FOV, position: [0, 0, D0], near: 0.05, far: 100}}>
        <color attach="background" args={['#0d0c09']} />
        <Rig />
        {depthBg && texBg && <Mesh depth={depthBg} tex={texBg} z={-0.03} scale={0.5} />}
        {depth && tex && <Mesh depth={depth} tex={tex} cut z={0.02} />}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

const IntoNotes: React.FC = () => (
  <>
    <Note text="the depth is real: the two lenses agree" x={120} y={90} at={120} size={46} />
    <Tag text="Richmond, Va., April 1865 · depth from the photo, checked against the stereo pair" />
  </>
);

export const STEREO_FRAMES = 120 + 90 + 240;
export const StereoTest: React.FC = () => (
  <TestFrame>
    <Sequence durationInFrames={120}><Desk /></Sequence>
    <Sequence from={120} durationInFrames={90}><Wiggle /></Sequence>
    <Sequence from={210}><Into /><IntoNotes /></Sequence>
  </TestFrame>
);
