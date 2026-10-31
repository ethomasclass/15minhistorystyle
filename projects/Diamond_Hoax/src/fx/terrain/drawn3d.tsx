// Shared bits for the terrain builder's drawn-3D pieces (Mesa, LoopingRide, AnthillCutaway, GemOrigins).
//   Stage      dark desk + a ThreeCanvas + DOM overlay slot + grain (Finish)
//   CamKey     a keyed orbit camera (target, dist, yaw, pitch) with smooth easing between keys
//   makeCam    the same THREE.PerspectiveCamera the canvas uses, so DOM labels can be projected onto 3D points
//   SyncCam    copies that camera into the canvas
//   Segs       thick screen-space lines (LineSegments2), solid or dashed; Poly for polylines
//   GemMesh    drawn gems: diamond (octahedron), ruby (hex prism), sapphire (hex bipyramid); dark or coral fill + edges
import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {LineSegments2} from 'three/examples/jsm/lines/LineSegments2.js';
import {LineSegmentsGeometry} from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial.js';
import {DarkPaper} from '../../kit/common';
import {Finish} from '../../kit/Kit';

export const TEAL = '#2FE0C4';
export const CORAL = '#FF6F61';
export const CREAM = '#F4EFE6';
export const ORANGE = '#FF9F1C';
export const GREY = '#7d7a74';
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = Easing.inOut(Easing.cubic);
export const W = 1920;
export const H = 1080;

/** Seeded RNG (mulberry32) for module-load layouts. */
export const rng = (seed: number) => {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Overshoot "slap" 0 -> 1 over `dur` frames (lands, overshoots a little, settles). */
export const slap = (t: number) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 - Math.cos(t * Math.PI * 1.5) * Math.exp(-t * 4.2) * (1 - t);
};
/** Exponentially decaying shake after a hard landing at `at` (raw frames). */
export const shakeAt = (f: number, at: number, k = 1) => (f >= at && f < at + 24 ? Math.exp(-(f - at) / 4.5) * Math.sin((f - at) * 2.1) * k : 0);

// ───────────────────────── camera ─────────────────────────

export type Cam = {target: [number, number, number]; dist: number; yaw: number; pitch: number; fov?: number};
export type CamKey = Cam & {f: number};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Camera at frame `f` from keys (eased between each pair, held at the ends). */
export const camAt = (keys: CamKey[], f: number): Cam => {
  if (f <= keys[0].f) return keys[0];
  const last = keys[keys.length - 1];
  if (f >= last.f) return last;
  let i = 0;
  while (i < keys.length - 2 && f > keys[i + 1].f) i++;
  const a = keys[i], b = keys[i + 1];
  const t = ease((f - a.f) / Math.max(1, b.f - a.f));
  return {
    target: [lerp(a.target[0], b.target[0], t), lerp(a.target[1], b.target[1], t), lerp(a.target[2], b.target[2], t)],
    dist: lerp(a.dist, b.dist, t), yaw: lerp(a.yaw, b.yaw, t), pitch: lerp(a.pitch, b.pitch, t), fov: lerp(a.fov ?? 30, b.fov ?? 30, t),
  };
};

/** A PerspectiveCamera for these params; `shake` nudges it (world units). */
export const makeCam = (c: Cam, shake: [number, number] = [0, 0]) => {
  const cam = new THREE.PerspectiveCamera(c.fov ?? 30, W / H, 0.05, 400);
  const [tx, ty, tz] = c.target;
  cam.position.set(tx + Math.sin(c.yaw) * Math.cos(c.pitch) * c.dist, ty + Math.sin(c.pitch) * c.dist, tz + Math.cos(c.yaw) * Math.cos(c.pitch) * c.dist);
  cam.lookAt(tx, ty, tz);
  cam.position.x += shake[0];
  cam.position.y += shake[1];
  cam.updateMatrixWorld(true);
  cam.updateProjectionMatrix();
  return cam;
};

/** Screen position (1920x1080 px) of a world point; `vis` false when it is behind the camera. */
export const project = (cam: THREE.PerspectiveCamera, p: [number, number, number]) => {
  const v = new THREE.Vector3(...p).project(cam);
  return {x: ((v.x + 1) / 2) * W, y: ((1 - v.y) / 2) * H, vis: v.z < 1 && v.z > -1};
};

export const SyncCam: React.FC<{cam: THREE.PerspectiveCamera}> = ({cam}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.copy(cam.position);
  camera.quaternion.copy(cam.quaternion);
  if (camera.fov !== cam.fov || camera.near !== cam.near || camera.far !== cam.far) {
    camera.fov = cam.fov;
    camera.near = cam.near;
    camera.far = cam.far;
    camera.updateProjectionMatrix();
  }
  camera.updateMatrixWorld(true);
  return null;
};

// ───────────────────────── stage ─────────────────────────

/** The dark desk, the 3D canvas (children) and a DOM overlay (`over`), then grain + vignette. */
/** Set by a vertical Short: the Stage draws a clear 1920x1080 canvas on the Short's own desk, whatever the composition's size. */
export const BareStageCtx = React.createContext(false);

export const Stage: React.FC<{children: React.ReactNode; over?: React.ReactNode; lamp?: [number, number]}> = ({children, over, lamp = [960, 470]}) => {
  const {width, height} = useVideoConfig();
  const bare = React.useContext(BareStageCtx);
  if (bare) {
    return (
      <AbsoluteFill>
        <ThreeCanvas width={W} height={H} camera={{fov: 30, near: 0.05, far: 400}} gl={{antialias: true, alpha: true}} flat linear={false}>
          {children}
        </ThreeCanvas>
        {over}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{background: `radial-gradient(circle 900px at ${lamp[0]}px ${lamp[1]}px, rgba(255,214,160,0.10) 0%, transparent 100%)`}} />
      <AbsoluteFill>
        <ThreeCanvas width={width} height={height} camera={{fov: 30, near: 0.05, far: 400}} gl={{antialias: true, alpha: true}} flat linear={false}>
          {children}
        </ThreeCanvas>
      </AbsoluteFill>
      {over}
      <Finish vignette={0.45} />
    </AbsoluteFill>
  );
};

// ───────────────────────── lines ─────────────────────────

/** Polyline points -> segment pairs (x0,y0,z0,x1,y1,z1, ...). */
export const polySegs = (pts: number[][]): Float32Array => {
  const out = new Float32Array(Math.max(0, pts.length - 1) * 6);
  for (let i = 0; i < pts.length - 1; i++) out.set([...pts[i], ...pts[i + 1]], i * 6);
  return out;
};

type SegProps = {pos: Float32Array; color?: string; width?: number; opacity?: number; dashed?: boolean; dash?: number; gap?: number; depthTest?: boolean; order?: number; visible?: boolean};

/** Thick lines in screen pixels (of the 1920x1080 frame), depth-tested against the scene unless `depthTest` is false. */
export const Segs: React.FC<SegProps> = ({pos, color = TEAL, width = 2, opacity = 1, dashed = false, dash = 0.1, gap = 0.08, depthTest = true, order = 0, visible = true}) => {
  const obj = useMemo(() => {
    const g = new LineSegmentsGeometry();
    g.setPositions(pos.length ? pos : new Float32Array(6));
    const m = new LineMaterial({color: new THREE.Color(color).getHex(), linewidth: width, worldUnits: false, transparent: true, dashed, dashSize: dash, gapSize: gap});
    m.resolution.set(W, H);
    const l = new LineSegments2(g, m);
    if (dashed) l.computeLineDistances();
    l.frustumCulled = false;
    return l;
  }, [pos, dashed, dash, gap]);
  const m = obj.material as LineMaterial;
  m.color.set(color);
  m.linewidth = width;
  m.opacity = opacity;
  m.depthTest = depthTest;
  m.depthWrite = false;
  m.side = THREE.DoubleSide; // survives mirrored (negative-scale) parents
  obj.renderOrder = order;
  obj.visible = visible && opacity > 0.002 && pos.length > 0;
  return <primitive object={obj} />;
};

export const Poly: React.FC<Omit<SegProps, 'pos'> & {pts: number[][]}> = ({pts, ...rest}) => {
  const pos = useMemo(() => polySegs(pts), [pts]);
  return <Segs pos={pos} {...rest} />;
};

/** A closed loop of `n` points around (cx, y, cz) at radius r on a horizontal plane, optionally draped by `yAt`. */
export const ringPts = (cx: number, cz: number, r: number, n: number, yAt: (x: number, z: number) => number, wobble = 0, seed = 1) => {
  const R = rng(seed);
  const ph = R() * 6.28;
  const pts: number[][] = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (1 + wobble * Math.sin(a * 3 + ph) + wobble * 0.5 * Math.sin(a * 5 + ph * 2));
    const x = cx + Math.cos(a) * rr, z = cz + Math.sin(a) * rr;
    pts.push([x, yAt(x, z), z]);
  }
  return pts;
};

// ───────────────────────── gems ─────────────────────────

export type GemKind = 'diamond' | 'ruby' | 'sapphire';

const gemGeo = (kind: GemKind): THREE.BufferGeometry => {
  if (kind === 'diamond') return new THREE.OctahedronGeometry(0.5, 0);
  if (kind === 'ruby') {
    const g = new THREE.CylinderGeometry(0.36, 0.36, 0.55, 6, 1);
    return g;
  }
  // sapphire: a hexagonal bipyramid (barrel)
  const pts = [new THREE.Vector2(0, -0.62), new THREE.Vector2(0.34, -0.18), new THREE.Vector2(0.34, 0.18), new THREE.Vector2(0, 0.62)];
  return new THREE.LatheGeometry(pts, 6);
};
const GEO_CACHE: Partial<Record<GemKind, {fill: THREE.BufferGeometry; edges: Float32Array}>> = {};
export const gemGeometry = (kind: GemKind) => {
  if (!GEO_CACHE[kind]) {
    const fill = gemGeo(kind);
    const e = new THREE.EdgesGeometry(fill, 20);
    GEO_CACHE[kind] = {fill, edges: new Float32Array(e.attributes.position.array)};
  }
  return GEO_CACHE[kind]!;
};

/** A drawn gem: flat-shaded fill (`fill`) with `line` edges, at `pos`, size `s`, rotation [x,y,z]. */
export const GemMesh: React.FC<{kind: GemKind; pos: [number, number, number]; s: number; rot?: [number, number, number]; fill: string; line: string; width?: number; opacity?: number; glow?: number}> = ({
  kind, pos, s, rot = [0, 0, 0], fill, line, width = 2.2, opacity = 1, glow = 0,
}) => {
  const g = gemGeometry(kind);
  if (s <= 0.0001 || opacity <= 0.002) return null;
  return (
    <group position={pos} rotation={rot} scale={s}>
      <mesh geometry={g.fill}>
        <meshLambertMaterial color={fill} flatShading emissive={fill} emissiveIntensity={0.35 + glow} transparent={opacity < 1} opacity={opacity}
          polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
      </mesh>
      <Segs pos={g.edges} color={line} width={width} opacity={opacity} />
    </group>
  );
};

/** A soft radial glow sprite texture (white centre -> transparent), cached. */
let GLOW_TEX: THREE.Texture | null = null;
export const glowTexture = () => {
  if (GLOW_TEX) return GLOW_TEX;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d')!;
  const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = gr;
  x.fillRect(0, 0, 128, 128);
  GLOW_TEX = new THREE.CanvasTexture(c);
  return GLOW_TEX;
};

/** A flat glow disc lying on the ground (additive). */
export const GroundGlow: React.FC<{pos: [number, number, number]; r: number; color: string; opacity: number}> = ({pos, r, color, opacity}) => {
  const tex = useMemo(() => glowTexture(), []);
  if (opacity <= 0.002) return null;
  return (
    <mesh position={pos} rotation={[-Math.PI / 2, 0, 0]} renderOrder={5}>
      <planeGeometry args={[r * 2, r * 2]} />
      <meshBasicMaterial map={tex} color={color} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
};

/** A soft dark contact shadow on the desk plane at y, size w x d. */
export const ContactShadow: React.FC<{y: number; w: number; d: number; opacity?: number; x?: number; z?: number}> = ({y, w, d, opacity = 0.75, x = 0, z = 0}) => {
  const tex = useMemo(() => glowTexture(), []);
  return (
    <mesh position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
      <planeGeometry args={[w, d]} />
      <meshBasicMaterial map={tex} color="#000000" transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
};

/** Value keyed by frames, eased, clamped (handy for beat-driven cameras). */
export const keyed = (f: number, fs: number[], vs: number[]) => interpolate(f, fs, vs, {...clamp, easing: ease});
