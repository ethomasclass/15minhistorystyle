// ShadowBox prototype: the screen itself is a deep shadowbox diorama.
//
// A frame sits around the edges of the video (no desk). Inside, a deep box: a stage platform at the front, the silhouette scene
// as cut-paper layers standing at real depths, small cream lamps along the top, things hanging on threads (two paper clouds and
// the coral paper balloon with its sandbag ring), a jointed puppet standing on a round base. The lamps light it from the front,
// so every layer casts a real shadow on the ones behind it. The scene changes the way a theater does: the layers fly up into the
// top of the box... (v1). Now a cut-paper drop curtain falls, the scene swaps behind it, and the drop rises again.
//
// Test assets (no Gemini): the palette-locked Diamond Hoax layers and puppet from tools/stage_test_prep.py.
// Beats (frames, 30 fps): armAt 60 / 105 / 220 · the drop falls 150 → swap 166 → rises by 188 · end 300
import React, {useEffect, useMemo, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {noise2D} from '@remotion/noise';
import * as THREE from 'three';
import {Finish} from '../kit/Kit';

export const SHADOW_BOX_FRAMES = 300;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.45, 0, 0.25, 1);
const step = (f: number) => Math.floor(f / 2.5) * 2.5; // 12 drawings a second

// ── geometry: the camera looks straight in; the frame's inner opening fills the screen minus the border ──
const D = 2.2; // camera distance to the frame plane
const VH = D * Math.tan((15 * Math.PI) / 180); // half-height visible at the frame plane
const VW = VH * (16 / 9);
const BORDER = 0.072; // frame border width (about 66 px at 1080p)
const OW = VW - BORDER; // opening half-width
const OH = VH - BORDER; // opening half-height
const DEPTH = 1.15;
const WALL = OW * 1.32; // the box is wider than its opening, so only a sliver of side wall shows
const CEIL = OH * 1.18;
const FLOOR = -OH + 0.11; // the stage platform's top
const LAYER_Z = [-0.2, -0.42, -0.68, -1.02];

// palette
const INK = '#0d0c09';
const FRAME = '#16130f';
const BEAD = '#2b4a47';
const WALLC = '#111b1b';
const CREAM = '#F4EFE6';
const CORAL = '#FF6F61';

// ── textures ──
const useTextures = (urls: string[]) => {
  const [tex, setTex] = useState<THREE.Texture[] | null>(null);
  const [handle] = useState(() => delayRender('box textures'));
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    Promise.all(urls.map((u) => new Promise<THREE.Texture>((res, rej) => loader.load(staticFile(u), (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      res(t);
    }, undefined, rej)))).then((t) => {
      setTex(t);
      continueRender(handle);
    });
  }, []);
  return tex;
};

const canvasTex = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) => {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  draw(cv.getContext('2d')!);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

/** A cut-paper cloud: lumpy, flat, one tone. */
const cloudTex = (seed: string, color: string) => canvasTex(512, 220, (c) => {
  c.fillStyle = color;
  const lumps = 9;
  for (let i = 0; i < lumps; i++) {
    const x = 70 + (i / (lumps - 1)) * 372 + noise2D(seed, i, 0) * 20;
    const r = 46 + 34 * Math.sin((i / (lumps - 1)) * Math.PI) + noise2D(seed, i, 1) * 12;
    c.beginPath();
    c.arc(x, 150 - r * 0.55, r, 0, Math.PI * 2);
    c.fill();
  }
  c.fillRect(40, 140, 432, 50);
  c.beginPath();
  c.ellipse(256, 190, 220, 16, 0, 0, Math.PI * 2);
  c.fill();
});

/** The coral paper balloon in cut paper: the envelope with its gore seams, the shroud lines, the sandbag ring. */
const balloonTex = () => canvasTex(512, 760, (c) => {
  const cx = 256, cy = 230, R = 200;
  c.fillStyle = CORAL;
  c.beginPath();
  c.arc(cx, cy, R, 0, Math.PI * 2);
  c.fill();
  // gore seams (curved meridians)
  c.strokeStyle = 'rgba(13,12,9,0.35)';
  c.lineWidth = 3;
  for (let k = -3; k <= 3; k++) {
    c.beginPath();
    c.ellipse(cx, cy, Math.abs(k) * (R / 3.4) + 2, R, 0, 0, Math.PI * 2);
    c.stroke();
  }
  // shroud lines to the ring
  c.strokeStyle = INK;
  c.lineWidth = 4;
  const ringY = 620;
  for (const a of [-0.8, -0.45, -0.15, 0.15, 0.45, 0.8]) {
    const sx = cx + Math.sin(a) * R * 0.92;
    const sy = cy + Math.cos(a) * R * 0.92;
    c.beginPath();
    c.moveTo(sx, sy);
    c.lineTo(cx + a * 70, ringY);
    c.stroke();
  }
  // the ring and its sandbags
  c.fillStyle = INK;
  c.beginPath();
  c.ellipse(cx, ringY, 78, 14, 0, 0, Math.PI * 2);
  c.fill();
  for (let i = 0; i < 9; i++) {
    const x = cx - 72 + i * 18;
    c.beginPath();
    c.ellipse(x, ringY + 22, 7, 13, 0, 0, Math.PI * 2);
    c.fill();
  }
  c.fillRect(cx - 4, ringY, 8, 110); // the bomb release line
  c.beginPath();
  c.ellipse(cx, ringY + 118, 12, 22, 0, 0, Math.PI * 2);
  c.fill();
});

/** The drop: a cut-paper curtain in the near-haze tone, soft vertical folds, a torn bottom edge. */
const dropTex = () => canvasTex(1024, 640, (c) => {
  const g = c.createLinearGradient(0, 0, 1024, 0);
  for (let i = 0; i <= 16; i++) g.addColorStop(i / 16, i % 2 ? '#1c3332' : '#152826');
  c.fillStyle = g;
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(1024, 0);
  for (let x = 1024; x >= 0; x -= 8) c.lineTo(x, 600 + noise2D('tear', x * 0.03, 0) * 14 + noise2D('tear2', x * 0.2, 0) * 5);
  c.closePath();
  c.fill();
});

const mistTex = (() => {
  const w = 256, h = 64, d = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let n = 0, a = 1, s = 0.02, tot = 0;
    for (let o = 0; o < 4; o++) { n += a * noise2D('mist', x * s, y * s * 2.2); tot += a; a *= 0.5; s *= 2; }
    n = (n / tot) * 0.5 + 0.5;
    const v = Math.max(0, Math.min(1, (n - 0.42) * 2.4)) * Math.sin((y / h) * Math.PI);
    const i = (y * w + x) * 4;
    d[i] = 0xa3; d[i + 1] = 0xba; d[i + 2] = 0xb2; d[i + 3] = Math.round(v * 255);
  }
  const t = new THREE.DataTexture(d, w, h);
  t.wrapS = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
})();

const glowTex = (() => {
  const s = 128, d = new Uint8Array(s * s * 4);
  for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {
    const r = Math.hypot(x - s / 2, y - s / 2) / (s / 2);
    const v = Math.max(0, 1 - r) ** 2.2;
    const i = (y * s + x) * 4;
    d[i] = 255; d[i + 1] = 255; d[i + 2] = 255; d[i + 3] = Math.round(v * 255);
  }
  const t = new THREE.DataTexture(d, s, s);
  t.needsUpdate = true;
  return t;
})();

// a faint worn-wood grain for the frame
const grainTex = (() => {
  const w = 256, h = 256, d = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const n = noise2D('grain', x * 0.01, y * 0.25) * 0.6 + noise2D('grain2', x * 0.08, y * 0.08) * 0.4;
    const v = 22 + n * 9;
    const i = (y * w + x) * 4;
    d[i] = v + 3; d[i + 1] = v; d[i + 2] = v - 4; d[i + 3] = 255;
  }
  const t = new THREE.DataTexture(d, w, h);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
})();

// ── camera ──
const CamRig: React.FC<{x: number; y: number; dist: number}> = ({x, y, dist}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.set(x, y, dist);
  camera.lookAt(x * 0.4, y * 0.4, -0.5);
  camera.updateMatrixWorld(true);
  return null;
};

// ── pieces ──
const Seg: React.FC<{p: [number, number, number]; s: [number, number, number]; c?: string; grain?: boolean}> = ({p, s, c = FRAME, grain}) => (
  <mesh position={p} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshLambertMaterial color={grain ? '#ffffff' : c} map={grain ? grainTex : null} />
  </mesh>
);

/** The shadowbox: frame border round the screen, an inner bevel and bead, walls, ceiling, back, and a stage platform. */
const Box: React.FC = () => {
  const big = 0.6; // the frame runs well past the screen edge
  const t = 0.05;
  const zc = -DEPTH / 2;
  return (
    <group>
      {/* frame */}
      <Seg p={[0, OH + big / 2, 0.02]} s={[2 * (OW + big), big, t]} grain />
      <Seg p={[0, -OH - big / 2, 0.02]} s={[2 * (OW + big), big, t]} grain />
      <Seg p={[-OW - big / 2, 0, 0.02]} s={[big, 2 * OH, t]} grain />
      <Seg p={[OW + big / 2, 0, 0.02]} s={[big, 2 * OH, t]} grain />
      {/* the inner bead: a thin muted-teal line round the opening */}
      {[1, -1].map((sd) => <Seg key={`h${sd}`} p={[0, sd * (OH + 0.006), 0.048]} s={[2 * OW + 0.024, 0.012, 0.01]} c={BEAD} />)}
      {[1, -1].map((sd) => <Seg key={`v${sd}`} p={[sd * (OW + 0.006), 0, 0.048]} s={[0.012, 2 * OH + 0.024, 0.01]} c={BEAD} />)}
      {/* the box itself */}
      <Seg p={[-WALL, 0, zc]} s={[t, 2 * CEIL, DEPTH]} c={WALLC} />
      <Seg p={[WALL, 0, zc]} s={[t, 2 * CEIL, DEPTH]} c={WALLC} />
      <Seg p={[0, CEIL, zc]} s={[2 * WALL, t, DEPTH]} c={INK} />
      <Seg p={[0, 0, -DEPTH - 0.02]} s={[2 * WALL, 2 * CEIL, t]} c={WALLC} />
      {/* the stage platform: top, and its front lip */}
      <Seg p={[0, FLOOR - 0.03, -0.12]} s={[2 * WALL, 0.06, 0.26]} c="#1a1712" />
      <Seg p={[0, (FLOOR - 0.06 - OH - 0.05) / 2, 0.005]} s={[2 * WALL, FLOOR - 0.06 + OH + 0.05, 0.02]} grain />
    </group>
  );
};

const Layer: React.FC<{map: THREE.Texture; z: number; dy: number; shade: boolean}> = ({map, z, dy, shade}) => {
  // sized so its projection matches the painting: farther planes are bigger
  const k = (D - z) / D;
  const w = 2 * OW * 1.06 * k;
  const h = w * (1536 / 2752);
  return (
    <mesh position={[0, dy, z]} castShadow receiveShadow={shade}>
      <planeGeometry args={[w, h]} />
      <meshLambertMaterial map={map} alphaTest={0.5} side={THREE.DoubleSide} />
    </mesh>
  );
};

/** Something hanging on a thread from the ceiling, swaying a little at 12 drawings a second. */
const Hanging: React.FC<{map: THREE.Texture; x: number; y: number; z: number; w: number; h: number; f: number; amp: number; seed: string; glow?: number}> = ({map, x, y, z, w, h, f, amp, seed, glow = 0}) => {
  const g = step(f);
  const sway = amp * noise2D(seed, g * 0.012, 0);
  const len = CEIL - (y + h / 2);
  return (
    <group position={[x, CEIL, z]} rotation={[0, 0, sway]}>
      <mesh position={[0, -len / 2, 0]}>
        <cylinderGeometry args={[0.0018, 0.0018, len, 5]} />
        <meshLambertMaterial color="#c9c3b5" />
      </mesh>
      <mesh position={[0, -len - h / 2, 0]} castShadow>
        <planeGeometry args={[w, h]} />
        <meshLambertMaterial map={map} transparent alphaTest={0.5} side={THREE.DoubleSide} emissive={glow ? CORAL : '#000'} emissiveIntensity={glow} />
      </mesh>
    </group>
  );
};

const Mist: React.FC<{z: number; y: number; f: number; speed: number; opacity: number}> = ({z, y, f, speed, opacity}) => {
  const tex = useMemo(() => { const t = mistTex.clone(); t.needsUpdate = true; return t; }, []);
  tex.offset.x = (f * speed) % 1;
  const k = (D - z) / D;
  return (
    <mesh position={[0, y, z]}>
      <planeGeometry args={[2 * OW * 1.2 * k, 0.32 * k]} />
      <meshBasicMaterial map={tex} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
};

const Glow: React.FC<{x: number; y: number; z: number; s: number; k: number; color: string}> = ({x, y, z, s, k, color}) => (
  <mesh position={[x, y, z]}>
    <planeGeometry args={[s, s]} />
    <meshBasicMaterial map={glowTex} color={color} transparent opacity={k} blending={THREE.AdditiveBlending} depthWrite={false} />
  </mesh>
);

const Puppet: React.FC<{body: THREE.Texture; arm: THREE.Texture; x: number; z: number; h: number; angle: number}> = ({body, arm, x, z, h, angle}) => {
  const W0 = 786, H0 = 1600, PX = 212, PY = 612;
  const w = h * (W0 / H0);
  const px = (PX / W0 - 0.5) * w;
  const py = (0.5 - PY / H0) * h;
  const y = FLOOR + 0.022 + h / 2;
  return (
    <group position={[x, y, z]}>
      <mesh castShadow receiveShadow>
        <planeGeometry args={[w, h]} />
        <meshLambertMaterial map={body} alphaTest={0.5} side={THREE.DoubleSide} />
      </mesh>
      <group position={[px, py, 0.004]} rotation={[0, 0, angle]}>
        <mesh position={[-px, -py, 0]} castShadow>
          <planeGeometry args={[w, h]} />
          <meshLambertMaterial map={arm} alphaTest={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <mesh position={[px, py, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.009, 0.009, 0.005, 24]} />
        <meshStandardMaterial color="#c9a04a" metalness={0.85} roughness={0.3} emissive="#3a2a0c" />
      </mesh>
      {/* the round base it stands on */}
      <mesh position={[0, -h / 2 - 0.011, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[w * 0.42, w * 0.46, 0.022, 40]} />
        <meshLambertMaterial color="#1f1a14" />
      </mesh>
      <mesh position={[0, -h / 2 + 0.0005, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[w * 0.43, w * 0.43, 0.002, 40]} />
        <meshStandardMaterial color="#8a6d33" metalness={0.7} roughness={0.4} />
      </mesh>
    </group>
  );
};

const Scene: React.FC<{tex: THREE.Texture[]}> = ({tex}) => {
  const f = useCurrentFrame();
  const g = step(f);
  const card1 = tex.slice(0, 4);
  const card2 = tex.slice(4, 8);
  const [body, arm] = tex.slice(8);
  const clouds = useMemo(() => [cloudTex('c1', '#5f857f'), cloudTex('c2', '#335652')], []);
  const balloon = useMemo(() => balloonTex(), []);

  // camera: a slow push and drift (small, so the frame always covers the screen edges)
  const push = interpolate(f, [0, 300], [0, 1], {...clamp, easing: ease});
  const cam = {x: -0.03 + push * 0.06, y: 0.01 - push * 0.015, dist: D - push * 0.06};

  // scene change: a cut-paper drop falls, the scene swaps behind it, the drop rises again
  const drop = useMemo(() => dropTex(), []);
  const dropK = interpolate(f, [150, 162, 170, 188], [0, 1, 1, 0], {...clamp, easing: Easing.bezier(0.5, 0, 0.3, 1)});
  const second = f >= 166;
  const DROP_H = 2 * CEIL * 1.15;

  // puppet: offers the bag twice
  const lift = (a: number) => interpolate(g, [a, a + 10, a + 24, a + 34], [0, 1, 1, 0], {...clamp, easing: ease});
  const angle = -0.42 * (lift(60) + lift(105) + lift(220)) + 0.03 * Math.sin(g / 6);

  // the top lamps, flickering a touch
  const lamps = [-0.78, -0.47, -0.16, 0.16, 0.47, 0.78];
  return (
    <>
      <CamRig {...cam} />
      <ambientLight intensity={0.62} color={CREAM} />
      <spotLight position={[0, OH - 0.02, 0.9]} angle={0.75} penumbra={0.8} intensity={22} decay={2} color="#ffeedd" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} shadow-radius={4} target-position={[0, -0.1, -0.7]} />
      <pointLight position={[-0.6, OH - 0.05, -0.1]} intensity={0.5} distance={2} decay={2} color="#ffe6c8" />
      <pointLight position={[0.6, OH - 0.05, -0.1]} intensity={0.5} distance={2} decay={2} color="#ffe6c8" />
      <Box />
      {/* top lamps along the inside of the frame */}
      {lamps.map((x, i) => {
        const k = 0.75 + 0.2 * noise2D('lamp', i, g * 0.15);
        return (
          <group key={i}>
            <mesh position={[x, OH - 0.012, -0.03]}>
              <sphereGeometry args={[0.012, 12, 12]} />
              <meshBasicMaterial color={CREAM} />
            </mesh>
            <Glow x={x} y={OH - 0.012} z={-0.02} s={0.13} k={0.35 * k} color="#ffe9cc" />
          </group>
        );
      })}
      {(second ? card2 : card1).map((t, k) => <Layer key={`${second}${k}`} map={t} z={LAYER_Z[k]} dy={0} shade={k > 0} />)}
      {/* lantern glow in card 1 */}
      {second ? null : <Glow x={-0.092 * ((D - LAYER_Z[1]) / D)} y={-0.17 * ((D - LAYER_Z[1]) / D)} z={LAYER_Z[1] + 0.01} s={0.15} k={0.5 + 0.35 * noise2D('flicker', g * 0.25, 0)} color={CORAL} />}
      {/* the drop */}
      <mesh position={[0, CEIL + DROP_H / 2 - dropK * DROP_H * 0.97, -0.045]} castShadow>
        <planeGeometry args={[2 * WALL, DROP_H]} />
        <meshLambertMaterial map={drop} transparent alphaTest={0.5} side={THREE.DoubleSide} />
      </mesh>
      <Mist z={(LAYER_Z[2] + LAYER_Z[3]) / 2} y={-0.2} f={f} speed={0.0011} opacity={0.3} />
      <Mist z={(LAYER_Z[1] + LAYER_Z[2]) / 2} y={-0.28} f={f} speed={0.0019} opacity={0.22} />
      {/* things hanging on threads */}
      <Hanging map={clouds[0]} x={-0.58} y={0.3} z={-0.55} w={0.42} h={0.18} f={f} amp={0.03} seed="h1" />
      <Hanging map={clouds[1]} x={0.18} y={0.36} z={-0.85} w={0.5} h={0.21} f={f} amp={0.025} seed="h2" />
      <Hanging map={balloon} x={0.24} y={0.2} z={-0.3} w={0.19} h={0.28} f={f} amp={0.05} seed="h3" glow={0.15} />
      <Puppet body={body} arm={arm} x={0.52} z={-0.07} h={0.5} angle={angle} />
    </>
  );
};

export const ShadowBoxTest: React.FC = () => {
  const urls = [
    ...[0, 1, 2, 3].map((k) => `img/stage_test/card1/L${k}.png`),
    ...[0, 1, 2, 3].map((k) => `img/stage_test/card2/L${k}.png`),
    'img/stage_test/puppet/body.png', 'img/stage_test/puppet/arm.png',
  ];
  const tex = useTextures(urls);
  return (
    <AbsoluteFill style={{background: INK}}>
      {tex ? (
        <AbsoluteFill>
          {/* mounted only once the textures are in: the canvas draws on frame changes, not when state arrives */}
          <ThreeCanvas width={1920} height={1080} camera={{fov: 30, near: 0.05, far: 60}} gl={{antialias: true}} shadows flat linear={false}>
            <Scene tex={tex} />
          </ThreeCanvas>
        </AbsoluteFill>
      ) : null}
      <Finish vignette={0.35} />
    </AbsoluteFill>
  );
};
