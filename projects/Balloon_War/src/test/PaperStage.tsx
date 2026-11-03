// PaperStage prototype: a kamishibai-style paper theater on the researcher's desk.
//
// The silhouette scene is built inside a small wooden stage as real cut-paper layers in depth. The desk lamp lights it from the
// front, so each layer casts a real shadow on the ones behind it. The doors swing open, the camera pushes in through the
// opening, a jointed puppet (brass pin at the joint, moving at 12 drawings a second) gestures, mist drifts between the layers and
// the lantern flickers. Then the front card slides out sideways (the kamishibai "pull") to reveal the next card, and the camera
// pulls back to the desk.
//
// Test assets (no Gemini): two Diamond Hoax paintings already split into planes, palette-locked by tools/sil_palette.py, and a
// puppet cut from sil_arnold (tools/stage_test_prep.py -> public/img/stage_test/).
//
// Beats (frames, 30 fps):        doorsAt 40 · pushAt 70 · armAt 150 · pullCardAt 250 · backAt 318
import React, {useEffect, useMemo, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {noise2D} from '@remotion/noise';
import * as THREE from 'three';
import {DarkPaper} from '../kit/common';
import {Finish, JF} from '../kit/Kit';

export const PAPER_STAGE_FRAMES = 360;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.45, 0, 0.25, 1);
const step = (f: number) => Math.floor(f / 2.5) * 2.5; // 12 drawings a second

// ── geometry (world units) ──
const CARD_W = 1.6;
const CARD_H = CARD_W * (1536 / 2752);
const OPEN_W = 1.48; // the stage opening hides the cards' edges
const OPEN_H = 0.82;
const BOX_W = 2.05;
const BOX_H = 1.34;
const BOX_D = 0.9;
const CY = 0.78; // opening centre height above the desk
const LAYER_Z = [0, -0.12, -0.24, -0.38]; // L0 (nearest) .. L3 (back plate)
const CARD2_Z = -0.42; // the next card's stack sits right behind the first

// ── textures ──
const useTextures = (urls: string[]) => {
  const [tex, setTex] = useState<THREE.Texture[] | null>(null);
  const [handle] = useState(() => delayRender('stage textures'));
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

/** Seeded noise textures, built once at module load (deterministic). */
const mistTex = (() => {
  const w = 256, h = 64, d = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let n = 0, a = 1, s = 0.02, tot = 0;
    for (let o = 0; o < 4; o++) { n += a * noise2D('mist', x * s, y * s * 2.2); tot += a; a *= 0.5; s *= 2; }
    n = (n / tot) * 0.5 + 0.5;
    const band = Math.sin((y / h) * Math.PI); // soft top and bottom
    const v = Math.max(0, Math.min(1, (n - 0.42) * 2.4)) * band;
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
    d[i] = 255; d[i + 1] = 111; d[i + 2] = 97; d[i + 3] = Math.round(v * 255);
  }
  const t = new THREE.DataTexture(d, s, s);
  t.needsUpdate = true;
  return t;
})();

const deskTex = (() => {
  const w = 512, h = 512, d = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const n = noise2D('desk', x * 0.01, y * 0.06) * 0.5 + noise2D('desk2', x * 0.08, y * 0.08) * 0.25;
    const rule = y % 64 === 0 ? 10 : 0; // the notebook's faint rules
    const v = 30 + n * 10 + rule;
    const i = (y * w + x) * 4;
    d[i] = v + 4; d[i + 1] = v + 1; d[i + 2] = v - 4; d[i + 3] = 255;
  }
  const t = new THREE.DataTexture(d, w, h);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(4, 4);
  t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
})();

// ── camera ──
type Cam = {tx: number; ty: number; tz: number; dist: number; yaw: number; pitch: number};
const lerpCam = (a: Cam, b: Cam, k: number): Cam => ({
  tx: a.tx + (b.tx - a.tx) * k, ty: a.ty + (b.ty - a.ty) * k, tz: a.tz + (b.tz - a.tz) * k,
  dist: a.dist + (b.dist - a.dist) * k, yaw: a.yaw + (b.yaw - a.yaw) * k, pitch: a.pitch + (b.pitch - a.pitch) * k,
});
const WIDE: Cam = {tx: 0.15, ty: 0.62, tz: 0, dist: 5.2, yaw: -0.42, pitch: 0.36};
const IN: Cam = {tx: 0, ty: CY, tz: 0, dist: 1.72, yaw: -0.035, pitch: 0.02};
const MID: Cam = {tx: 0.05, ty: 0.7, tz: 0, dist: 3.6, yaw: 0.3, pitch: 0.24};

const CamRig: React.FC<{c: Cam}> = ({c}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.set(c.tx + Math.sin(c.yaw) * Math.cos(c.pitch) * c.dist, c.ty + Math.sin(c.pitch) * c.dist, c.tz + Math.cos(c.yaw) * Math.cos(c.pitch) * c.dist);
  camera.lookAt(c.tx, c.ty, c.tz);
  camera.updateMatrixWorld(true);
  return null;
};

// ── pieces ──
const Paper: React.FC<{map: THREE.Texture; w: number; h: number; z: number; x?: number; y?: number; shade?: boolean}> = ({map, w, h, z, x = 0, y = CY, shade = true}) => (
  <mesh position={[x, y, z]} castShadow receiveShadow={shade}>
    <planeGeometry args={[w, h]} />
    <meshLambertMaterial map={map} alphaTest={0.5} side={THREE.DoubleSide} />
  </mesh>
);

const WOOD = '#2a2018';
const WOOD_EDGE = '#3b2e22';

/** The kamishibai box: a frame around the opening, sides, top, back, a base, and two hinged doors. */
const Box: React.FC<{doors: number}> = ({doors}) => {
  const fw = (BOX_W - OPEN_W) / 2; // frame side width
  const fh = (BOX_H - OPEN_H) / 2;
  const front = 0.06;
  const t = 0.04;
  const wood = <meshLambertMaterial color={WOOD} />;
  const B: React.FC<{p: [number, number, number]; s: [number, number, number]; c?: string}> = ({p, s, c}) => (
    <mesh position={p} castShadow receiveShadow>
      <boxGeometry args={s} />
      {c ? <meshLambertMaterial color={c} /> : wood}
    </mesh>
  );
  const zc = front - BOX_D / 2;
  const doorW = OPEN_W / 2 + fw * 0.5;
  const ang = doors * Math.PI * 0.62;
  return (
    <group>
      {/* front frame */}
      <B p={[-(OPEN_W + fw) / 2, CY, front]} s={[fw, BOX_H, t]} />
      <B p={[(OPEN_W + fw) / 2, CY, front]} s={[fw, BOX_H, t]} />
      <B p={[0, CY + (OPEN_H + fh) / 2, front]} s={[OPEN_W, fh, t]} />
      <B p={[0, CY - (OPEN_H + fh) / 2, front]} s={[OPEN_W, fh, t]} />
      {/* a thin lighter bead round the opening */}
      <B p={[0, CY + OPEN_H / 2 + 0.008, front + 0.022]} s={[OPEN_W + 0.03, 0.016, 0.01]} c={WOOD_EDGE} />
      <B p={[0, CY - OPEN_H / 2 - 0.008, front + 0.022]} s={[OPEN_W + 0.03, 0.016, 0.01]} c={WOOD_EDGE} />
      <B p={[-OPEN_W / 2 - 0.008, CY, front + 0.022]} s={[0.016, OPEN_H, 0.01]} c={WOOD_EDGE} />
      <B p={[OPEN_W / 2 + 0.008, CY, front + 0.022]} s={[0.016, OPEN_H, 0.01]} c={WOOD_EDGE} />
      {/* sides, top, back, base */}
      <B p={[-BOX_W / 2 + t / 2, CY, zc]} s={[t, BOX_H, BOX_D]} />
      <B p={[BOX_W / 2 - t / 2, CY, zc]} s={[t, BOX_H, BOX_D]} />
      <B p={[0, CY + BOX_H / 2 - t / 2, zc]} s={[BOX_W, t, BOX_D]} />
      <B p={[0, CY, front - BOX_D]} s={[BOX_W, BOX_H, t]} />
      <B p={[0, CY - BOX_H / 2 - 0.05, zc]} s={[BOX_W + 0.16, 0.1, BOX_D + 0.16]} />
      {/* doors, hinged at the outer edges of the frame */}
      <group position={[-BOX_W / 2, CY, front + 0.035]} rotation={[0, -ang, 0]}>
        <B p={[doorW / 2 + fw * 0.5, 0, 0]} s={[doorW, BOX_H * 0.94, 0.03]} />
        <B p={[doorW + fw * 0.4, 0, 0.022]} s={[0.025, 0.07, 0.02]} c="#b08a3e" />
      </group>
      <group position={[BOX_W / 2, CY, front + 0.035]} rotation={[0, ang, 0]}>
        <B p={[-doorW / 2 - fw * 0.5, 0, 0]} s={[doorW, BOX_H * 0.94, 0.03]} />
        <B p={[-doorW - fw * 0.4, 0, 0.022]} s={[0.025, 0.07, 0.02]} c="#b08a3e" />
      </group>
    </group>
  );
};

/** A jointed puppet on rods: body + forearm pinned with a brass paper fastener. Angle in radians (negative = raise). */
const Puppet: React.FC<{body: THREE.Texture; arm: THREE.Texture; x: number; y: number; z: number; h: number; angle: number}> = ({body, arm, x, y, z, h, angle}) => {
  const W0 = 786, H0 = 1600, PX = 212, PY = 612;
  const w = h * (W0 / H0);
  const px = (PX / W0 - 0.5) * w;
  const py = (0.5 - PY / H0) * h;
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
        {/* the arm's rod, from the hand down */}
        <mesh position={[-w * 0.36, -h * 0.42, -0.006]} rotation={[0, 0, -0.08]}>
          <cylinderGeometry args={[0.0025, 0.0025, h * 0.75, 6]} />
          <meshLambertMaterial color="#14120e" />
        </mesh>
      </group>
      {/* brass paper fastener at the joint */}
      <mesh position={[px, py, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.011, 0.011, 0.006, 24]} />
        <meshStandardMaterial color="#c9a04a" metalness={0.85} roughness={0.3} emissive="#3a2a0c" />
      </mesh>
      {/* the body's rod */}
      <mesh position={[0.02, -h * 0.75, -0.006]}>
        <cylinderGeometry args={[0.003, 0.003, h * 0.6, 6]} />
        <meshLambertMaterial color="#14120e" />
      </mesh>
    </group>
  );
};

const Mist: React.FC<{z: number; f: number; speed: number; opacity: number; y?: number}> = ({z, f, speed, opacity, y = CY - 0.18}) => {
  const tex = useMemo(() => { const t = mistTex.clone(); t.needsUpdate = true; return t; }, []);
  tex.offset.x = (f * speed) % 1;
  return (
    <mesh position={[0, y, z]}>
      <planeGeometry args={[CARD_W * 1.25, CARD_H * 0.45]} />
      <meshBasicMaterial map={tex} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
};

const Glow: React.FC<{x: number; y: number; z: number; s: number; k: number}> = ({x, y, z, s, k}) => (
  <mesh position={[x, y, z]}>
    <planeGeometry args={[s, s]} />
    <meshBasicMaterial map={glowTex} transparent opacity={k} blending={THREE.AdditiveBlending} depthWrite={false} />
  </mesh>
);

const Card: React.FC<{tex: THREE.Texture[]; z0: number; scale?: number; f: number; glow?: [number, number, number]}> = ({tex, z0, scale = 1, f, glow}) => (
  <group>
    {tex.map((t, k) => {
      const back = k === tex.length - 1;
      const s = scale * (1 + (back ? 0.12 : k * 0.035)); // farther layers a touch larger so the camera never sees past them
      return <Paper key={k} map={t} w={CARD_W * s} h={CARD_H * s} z={z0 + LAYER_Z[k]} shade={k > 0} />;
    })}
    {[-1, 1].map((sd) => (
      <mesh key={sd} position={[sd * CARD_W * scale * 0.5, CY, z0 + LAYER_Z[3] / 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[-LAYER_Z[3] + 0.02, CARD_H * scale * 1.04]} />
        <meshLambertMaterial color="#1b1712" side={THREE.DoubleSide} />
      </mesh>
    ))}
    <Mist z={z0 + (LAYER_Z[2] + LAYER_Z[3]) / 2} f={f} speed={0.0011} opacity={0.32} />
    <Mist z={z0 + (LAYER_Z[1] + LAYER_Z[2]) / 2} f={f} speed={0.0019} opacity={0.22} y={CY - 0.26} />
    {glow ? <Glow x={glow[0]} y={glow[1]} z={z0 + LAYER_Z[glow[2]] + 0.01} s={0.16} k={0.55 + 0.35 * noise2D('flicker', step(f) * 0.25, 0)} /> : null}
  </group>
);

const DeskPhoto: React.FC<{map: THREE.Texture; x: number; z: number; w: number; rot: number}> = ({map, x, z, w, rot}) => {
  const img = map.image as {width: number; height: number};
  const h = w * (img.height / img.width);
  return (
    <mesh position={[x, 0.002, z]} rotation={[-Math.PI / 2, 0, rot]} receiveShadow>
      <planeGeometry args={[w, h]} />
      <meshLambertMaterial map={map} />
    </mesh>
  );
};

const Scene: React.FC<{tex: THREE.Texture[]}> = ({tex}) => {
  const f = useCurrentFrame();
  const card1 = tex.slice(0, 4);
  const card2 = tex.slice(4, 8);
  const [body, arm, photo] = tex.slice(8);

  // camera: wide on the desk → push in through the opening → a slow drift (parallax) → pull back
  const push = interpolate(f, [70, 150], [0, 1], {...clamp, easing: ease});
  const back = interpolate(f, [318, 360], [0, 1], {...clamp, easing: ease});
  const drift = interpolate(f, [150, 318], [0, 1], clamp);
  let c = lerpCam(WIDE, IN, push);
  c = {...c, yaw: c.yaw + drift * 0.07 * push, tx: c.tx + drift * 0.03 * push};
  c = lerpCam(c, MID, back);
  const wideDrift = interpolate(f, [0, 70], [0, 0.05], clamp);
  c = {...c, yaw: c.yaw + wideDrift * (1 - push)};

  // doors: open with a little overshoot
  const dk = interpolate(f, [40, 78], [0, 1], {...clamp, easing: Easing.bezier(0.3, 0, 0.2, 1.25)});

  // the kamishibai pull: card 1 slides out to the right
  const pull = interpolate(f, [250, 286], [0, 1], {...clamp, easing: Easing.bezier(0.55, 0, 0.35, 1)});
  const pullX = pull * (CARD_W * 1.25);

  // puppet arm: offers the bag, twice, at 12 drawings a second
  const g = step(f);
  const lift = (a: number) => interpolate(g, [a, a + 10, a + 26, a + 36], [0, 1, 1, 0], {...clamp, easing: ease});
  const angle = -0.42 * (lift(160) + lift(205)) + 0.03 * Math.sin(g / 6);

  return (
    <>
      <CamRig c={c} />
      <ambientLight intensity={0.7} color="#f4efe6" />
      <spotLight position={[-0.55, 1.95, 3.1]} angle={0.5} penumbra={0.75} intensity={30} decay={2} color="#ffe9cc" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} shadow-radius={4} target-position={[0, CY, -0.2]} />
      {/* desk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshLambertMaterial map={deskTex} />
      </mesh>
      <DeskPhoto map={photo} x={1.75} z={0.75} w={0.9} rot={-0.18} />
      <mesh position={[-1.6, 0.003, 0.9]} rotation={[-Math.PI / 2, 0, 0.12]} receiveShadow>
        <planeGeometry args={[0.55, 0.32]} />
        <meshLambertMaterial color="#e9e1d0" />
      </mesh>
      <Box doors={dk} />
      <group position={[pullX, 0, 0]}>
        <Card tex={card1} z0={0} f={f} glow={[-0.091, CY - 0.164, 1]} />
      </group>
      <Card tex={card2} z0={CARD2_Z} scale={1.07} f={f} />
      <Puppet body={body} arm={arm} x={0.5} y={CY - 0.11} z={0.03} h={0.62} angle={angle} />
    </>
  );
};

export const PaperStageTest: React.FC = () => {
  const urls = [
    ...[0, 1, 2, 3].map((k) => `img/stage_test/card1/L${k}.png`),
    ...[0, 1, 2, 3].map((k) => `img/stage_test/card2/L${k}.png`),
    'img/stage_test/puppet/body.png', 'img/stage_test/puppet/arm.png',
    'img/ch04_paper_balloon/fugo_moffett_classic_a37180c.jpg',
  ];
  const tex = useTextures(urls);
  return (
    <AbsoluteFill style={{background: '#0d0c09'}}>
      <DarkPaper />
      {tex ? (
        <AbsoluteFill>
          {/* mounted only once the textures are in: the canvas draws on frame changes, not when state arrives */}
          <ThreeCanvas width={1920} height={1080} camera={{fov: 30, near: 0.05, far: 60}} gl={{antialias: true, alpha: true}} shadows flat linear={false}>
            <Scene tex={tex} />
          </ThreeCanvas>
        </AbsoluteFill>
      ) : null}
      <Finish vignette={0.45} />
      <div style={{position: 'absolute', left: 110, bottom: 104, fontFamily: JF.mono, fontSize: 16, letterSpacing: 1, color: 'rgba(244,239,230,0.55)', textTransform: 'uppercase'}}>
        PaperStage prototype · test layers from Diamond Hoax, palette-locked
      </div>
    </AbsoluteFill>
  );
};
