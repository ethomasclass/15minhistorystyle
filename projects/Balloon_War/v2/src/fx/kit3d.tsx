// Shared bits for the Balloon War 3D pieces (PacificWinds, LandingMap, SandToBeach, AltitudeRibbon). Adapted from
// projects/Diamond_Hoax/src/fx/terrain/drawn3d.tsx (same drawn look: teal lines on a dark desk, cream sparingly, one coral).
//   Stage        dark desk + ThreeCanvas + DOM overlay + grain (Finish)
//   camAt/makeCam/project/SyncCam   keyed orbit camera (target, dist, yaw, pitch, fov, near/far) and DOM projection
//   Segs/Poly    thick screen-space lines (LineSegments2), solid or dashed, optional per-vertex colours (additive glow)
//   Balloon      the drawn paper balloon (coral envelope, cream shrouds, the ballast ring)
//   Label/Hand   mono tabs and handwriting for the DOM overlay (kept ≥ 96 px from the frame edge by `safe`)
import React, {useEffect, useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {LineSegments2} from 'three/examples/jsm/lines/LineSegments2.js';
import {LineSegmentsGeometry} from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial.js';
import {DarkPaper} from '../kit/common';
import {Finish, JF, useHand} from '../kit/Kit';

export const TEAL = '#2FE0C4';
export const CORAL = '#FF6F61';
export const CREAM = '#F4EFE6';
export const ORANGE = '#FF9F1C';
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = Easing.inOut(Easing.cubic);
export const W = 1920;
export const H = 1080;
export const SAFE = 100; // keep text this far from the frame edge (the rule is 96 px)

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

/** Overshoot "slap" 0 -> 1 for t in 0..1. */
export const slap = (t: number) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 - Math.cos(t * Math.PI * 1.5) * Math.exp(-t * 4.2) * (1 - t);
};
export const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ───────────────────────── camera ─────────────────────────

export type Cam = {target: [number, number, number]; dist: number; yaw: number; pitch: number; fov?: number; near?: number; far?: number};
export type CamKey = Cam & {f: number};

/** Camera at frame `f` from keys (eased between each pair, held at the ends). `logDist` interpolates distance geometrically. */
export const camAt = (keys: CamKey[], f: number, logDist = false): Cam => {
  if (f <= keys[0].f) return keys[0];
  const last = keys[keys.length - 1];
  if (f >= last.f) return last;
  let i = 0;
  while (i < keys.length - 2 && f > keys[i + 1].f) i++;
  const a = keys[i], b = keys[i + 1];
  const t = ease((f - a.f) / Math.max(1, b.f - a.f));
  return {
    target: [lerp(a.target[0], b.target[0], t), lerp(a.target[1], b.target[1], t), lerp(a.target[2], b.target[2], t)],
    dist: logDist ? Math.exp(lerp(Math.log(a.dist), Math.log(b.dist), t)) : lerp(a.dist, b.dist, t),
    yaw: lerp(a.yaw, b.yaw, t), pitch: lerp(a.pitch, b.pitch, t), fov: lerp(a.fov ?? 30, b.fov ?? 30, t),
  };
};

export const makeCam = (c: Cam) => {
  const near = c.near ?? Math.max(0.0005, c.dist * 0.02);
  const far = c.far ?? c.dist * 6 + 60;
  const cam = new THREE.PerspectiveCamera(c.fov ?? 30, W / H, near, far);
  const [tx, ty, tz] = c.target;
  cam.position.set(tx + Math.sin(c.yaw) * Math.cos(c.pitch) * c.dist, ty + Math.sin(c.pitch) * c.dist, tz + Math.cos(c.yaw) * Math.cos(c.pitch) * c.dist);
  cam.lookAt(tx, ty, tz);
  cam.updateMatrixWorld(true);
  cam.updateProjectionMatrix();
  return cam;
};

/** Screen position (1920x1080 px) of a world point; `vis` false when it is behind the camera. */
export const project = (cam: THREE.PerspectiveCamera, p: readonly number[]) => {
  const v = new THREE.Vector3(p[0], p[1], p[2]).project(cam);
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
export const Stage: React.FC<{children: React.ReactNode; over?: React.ReactNode; lamp?: [number, number]; vignette?: number}> = ({children, over, lamp = [960, 470], vignette = 0.45}) => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{background: `radial-gradient(circle 900px at ${lamp[0]}px ${lamp[1]}px, rgba(255,214,160,0.08) 0%, transparent 100%)`}} />
      <AbsoluteFill>
        <ThreeCanvas width={width} height={height} camera={{fov: 30, near: 0.05, far: 400}} gl={{antialias: true, alpha: true}} flat linear={false}>
          {children}
        </ThreeCanvas>
      </AbsoluteFill>
      {over}
      <Finish vignette={vignette} />
    </AbsoluteFill>
  );
};

// ───────────────────────── lines ─────────────────────────

/** Polyline points -> segment pairs (x0,y0,z0,x1,y1,z1, ...). */
export const polySegs = (pts: readonly (readonly number[])[]): Float32Array => {
  const out = new Float32Array(Math.max(0, pts.length - 1) * 6);
  for (let i = 0; i < pts.length - 1; i++) out.set([pts[i][0], pts[i][1], pts[i][2], pts[i + 1][0], pts[i + 1][1], pts[i + 1][2]], i * 6);
  return out;
};

type SegProps = {pos: Float32Array; colors?: Float32Array; color?: string; width?: number; opacity?: number; dashed?: boolean; dash?: number; gap?: number;
  depthTest?: boolean; order?: number; visible?: boolean; additive?: boolean};

/** Thick lines in screen pixels. With `colors` (rgb per vertex) the colours multiply `color`; `additive` makes dark = transparent. */
export const Segs: React.FC<SegProps> = ({pos, colors, color = TEAL, width = 2, opacity = 1, dashed = false, dash = 0.1, gap = 0.08, depthTest = true, order = 0, visible = true, additive = false}) => {
  const obj = useMemo(() => {
    const g = new LineSegmentsGeometry();
    g.setPositions(pos.length ? pos : new Float32Array(6));
    if (colors && colors.length === pos.length) g.setColors(colors);
    const m = new LineMaterial({color: new THREE.Color(color).getHex(), linewidth: width, worldUnits: false, transparent: true, dashed, dashSize: dash, gapSize: gap,
      vertexColors: !!colors});
    m.resolution.set(W, H);
    if (additive) m.blending = THREE.AdditiveBlending;
    const l = new LineSegments2(g, m);
    if (dashed) l.computeLineDistances();
    l.frustumCulled = false;
    return l;
  }, [pos, colors, dashed, dash, gap, additive]);
  useEffect(() => () => {
    obj.geometry.dispose();
    (obj.material as LineMaterial).dispose();
  }, [obj]);
  const m = obj.material as LineMaterial;
  m.color.set(color);
  m.linewidth = width;
  m.opacity = opacity;
  m.depthTest = depthTest;
  m.depthWrite = false;
  obj.renderOrder = order;
  obj.visible = visible && opacity > 0.002 && pos.length > 0;
  return <primitive object={obj} />;
};

export const Poly: React.FC<Omit<SegProps, 'pos'> & {pts: readonly (readonly number[])[]}> = ({pts, ...rest}) => {
  const pos = useMemo(() => polySegs(pts), [pts]);
  return <Segs pos={pos} {...rest} />;
};

/** First `k` (0..1) of a polyline by point count, with the last point interpolated. */
export const partOf = (pts: number[][], k: number): number[][] => {
  if (k <= 0) return [];
  if (k >= 1) return pts;
  const x = k * (pts.length - 1);
  const i = Math.floor(x), u = x - i;
  const a = pts[i], b = pts[i + 1];
  return [...pts.slice(0, i + 1), [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)]];
};
/** A point at `k` (0..1) along a polyline by point count. */
export const along = (pts: number[][], k: number): number[] => {
  const x = Math.max(0, Math.min(1, k)) * (pts.length - 1);
  const i = Math.min(pts.length - 2, Math.floor(x)), u = x - i;
  const a = pts[i], b = pts[i + 1];
  return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
};

// ───────────────────────── glows and shadows ─────────────────────────

let GLOW_TEX: THREE.Texture | null = null;
/** A soft radial glow texture (white centre -> transparent), drawn on a canvas once (synchronous: no load to wait for). */
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
export const GroundGlow: React.FC<{pos: readonly number[]; r: number; color: string; opacity: number}> = ({pos, r, color, opacity}) => {
  const tex = useMemo(() => glowTexture(), []);
  if (opacity <= 0.002) return null;
  return (
    <mesh position={[pos[0], pos[1], pos[2]]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={5}>
      <planeGeometry args={[r * 2, r * 2]} />
      <meshBasicMaterial map={tex} color={color} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
};

/** A soft dark contact shadow on a plane at y. */
export const ContactShadow: React.FC<{y: number; w: number; d: number; opacity?: number; x?: number; z?: number}> = ({y, w, d, opacity = 0.75, x = 0, z = 0}) => {
  const tex = useMemo(() => glowTexture(), []);
  return (
    <mesh position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
      <planeGeometry args={[w, d]} />
      <meshBasicMaterial map={tex} color="#000000" transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
};

/** A flat dark slab (box) with teal edges: the map table. Top face at y = 0. */
export const MapSlab: React.FC<{w: number; d: number; h?: number; face?: string; edge?: number}> = ({w, d, h = 0.35, face = '#121614', edge = 0.6}) => {
  const box = useMemo(() => new THREE.BoxGeometry(w, h, d), [w, h, d]);
  const edges = useMemo(() => new Float32Array(new THREE.EdgesGeometry(box).attributes.position.array), [box]);
  return (
    <group>
      <ContactShadow y={-h - 0.01} w={w * 1.3} d={d * 1.5} opacity={0.8} z={d * 0.06} />
      <group position={[0, -h / 2, 0]}>
        <mesh geometry={box}>
          <meshLambertMaterial color={face} polygonOffset polygonOffsetFactor={2} polygonOffsetUnits={2} />
        </mesh>
        <Segs pos={edges} color={TEAL} width={1.8} opacity={edge} />
      </group>
    </group>
  );
};

// ───────────────────────── the balloon ─────────────────────────

const ENV = new THREE.SphereGeometry(1, 28, 20);
const GORES = (() => {
  const out: number[] = [];
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2;
    for (let i = 0; i < 16; i++) {
      const t0 = (i / 16) * Math.PI, t1 = ((i + 1) / 16) * Math.PI;
      out.push(Math.sin(t0) * Math.cos(a) * 1.004, Math.cos(t0) * 1.004, Math.sin(t0) * Math.sin(a) * 1.004, Math.sin(t1) * Math.cos(a) * 1.004, Math.cos(t1) * 1.004, Math.sin(t1) * Math.sin(a) * 1.004);
    }
  }
  return new Float32Array(out);
})();
const SHROUDS = (() => {
  const out: number[] = [];
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2;
    out.push(Math.cos(a) * 0.86, -0.5, Math.sin(a) * 0.86, Math.cos(a) * 0.16, -2.1, Math.sin(a) * 0.16);
  }
  for (let k = 0; k < 12; k++) {
    const a0 = (k / 12) * Math.PI * 2, a1 = ((k + 1) / 12) * Math.PI * 2;
    out.push(Math.cos(a0) * 0.3, -2.25, Math.sin(a0) * 0.3, Math.cos(a1) * 0.3, -2.25, Math.sin(a1) * 0.3);
  }
  return new Float32Array(out);
})();

/** The paper balloon, drawn: coral envelope with darker gore seams, cream shroud lines to the ballast ring. `r` = envelope radius
 * (world units); `bags` 0..1 how full the ring is (little cream dots). Origin at the envelope centre. */
export const Balloon: React.FC<{pos: readonly number[]; r: number; bags?: number; opacity?: number; spin?: number; color?: string}> = ({pos, r, bags = 1, opacity = 1, spin = 0, color = CORAL}) => {
  if (r <= 0 || opacity <= 0.01) return null;
  const nb = Math.round(bags * 16);
  return (
    <group position={[pos[0], pos[1], pos[2]]} scale={r} rotation={[0, spin, 0]}>
      <mesh geometry={ENV}>
        <meshLambertMaterial color={color} emissive={color} emissiveIntensity={0.55} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      <Segs pos={GORES} color="#8a2f27" width={1.4} opacity={0.55 * opacity} />
      <Segs pos={SHROUDS} color={CREAM} width={1.3} opacity={0.75 * opacity} />
      {Array.from({length: nb}).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return <mesh key={i} position={[Math.cos(a) * 0.3, -2.33, Math.sin(a) * 0.3]}><boxGeometry args={[0.1, 0.12, 0.1]} /><meshBasicMaterial color={CREAM} transparent opacity={opacity} /></mesh>;
      })}
    </group>
  );
};

// ───────────────────────── overlay text ─────────────────────────

const keep = (x: number, y: number, w = 0, h = 0) => [Math.max(SAFE + w / 2, Math.min(W - SAFE - w / 2, x)), Math.max(SAFE + h, Math.min(H - SAFE, y))];

/** A mono caps tab anchored above (x, y) (bottom-centre). `safe` keeps an estimated box inside the 96 px margin. */
export const Label: React.FC<{x: number; y: number; text: string; sub?: string; color?: string; opacity?: number; size?: number; anchor?: 'c' | 'l' | 'r'; bg?: boolean}> = ({
  x, y, text, sub, color = CREAM, opacity = 1, size = 24, anchor = 'c', bg = true,
}) => {
  if (opacity <= 0.01) return null;
  const estW = Math.max(text.length, (sub?.length ?? 0) * 0.62) * size * 0.66 + size;
  const estH = size * (sub ? 2.2 : 1.5);
  const cx = anchor === 'c' ? x : anchor === 'l' ? x + estW / 2 : x - estW / 2;
  const [kx, ky] = keep(cx, y, estW, estH);
  return (
    <div style={{position: 'absolute', left: kx, top: ky, transform: 'translate(-50%, -100%)', opacity, textAlign: 'center', fontFamily: JF.mono, fontSize: size, letterSpacing: size * 0.16, color,
      whiteSpace: 'nowrap', background: bg ? 'rgba(7,9,8,0.62)' : 'transparent', padding: `${size * 0.18}px ${size * 0.42}px`, borderRadius: 4, textShadow: '0 2px 8px #000'}}>
      {text}
      {sub && <div style={{fontSize: size * 0.62, letterSpacing: 1.5, color: 'rgba(244,239,230,0.75)', marginTop: 2}}>{sub}</div>}
    </div>
  );
};

/** Small mono line (source / honesty notes), placed by its corner inside the safe frame. */
export const Fine: React.FC<{text: string; x?: number; y?: number; right?: boolean; opacity?: number; size?: number}> = ({text, x = SAFE + 10, y = H - SAFE - 42, right = false, opacity = 0.75, size = 17}) => (
  <div style={{position: 'absolute', ...(right ? {right: W - x} : {left: x}), top: y, fontFamily: JF.mono, fontSize: size, letterSpacing: 1.5, color: `rgba(244,239,230,${opacity})`,
    textTransform: 'uppercase', whiteSpace: 'nowrap', textShadow: '0 1px 6px rgba(0,0,0,0.95)', background: 'rgba(7,9,8,0.55)', padding: '3px 8px', borderRadius: 3}}>{text}</div>
);

/** Handwriting written on left to right over `dur` frames from `at` (`f` = the stepped frame). */
export const Hand: React.FC<{f: number; text: string; x: number; y: number; at: number; size?: number; rot?: number; color?: string; dur?: number; out?: number}> = ({
  f, text, x, y, at, size = 52, rot = -4, color = TEAL, dur = 10, out = Infinity,
}) => {
  const hand = useHand();
  if (f < at || f >= out) return null;
  const p = interpolate(f, [at, at + dur], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: hand.family, fontWeight: hand.weight, fontSize: size * hand.scale, color, transform: `rotate(${rot}deg)`, whiteSpace: 'nowrap',
      textShadow: '0 0 2px #111, 0 0 4px #111, 2px 2px 0 #111, -2px 2px 0 #111, 2px -2px 0 #111, -2px -2px 0 #111, 0 3px 12px rgba(0,0,0,0.7)', clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`}}>{text}</div>
  );
};

/** Lines whose count changes every frame, without new GPU buffers per frame: capacity `cap` segments; `pos` (and optional
 * rgb `colors`, same length) hold the first n segments. */
export const DynSegs: React.FC<{cap: number; pos: Float32Array; colors?: Float32Array; color?: string; width?: number; opacity?: number; additive?: boolean; order?: number}> = ({
  cap, pos, colors, color = TEAL, width = 2, opacity = 1, additive = false, order = 0,
}) => {
  const obj = useMemo(() => {
    const g = new LineSegmentsGeometry();
    g.setPositions(new Float32Array(cap * 6));
    if (colors) g.setColors(new Float32Array(cap * 6).fill(1));
    const m = new LineMaterial({color: 0xffffff, linewidth: width, worldUnits: false, transparent: true, vertexColors: !!colors});
    m.resolution.set(W, H);
    if (additive) m.blending = THREE.AdditiveBlending;
    m.depthWrite = false;
    const l = new LineSegments2(g, m);
    l.frustumCulled = false;
    return l;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cap, !!colors, additive]);
  useEffect(() => () => {
    obj.geometry.dispose();
    (obj.material as LineMaterial).dispose();
  }, [obj]);
  const g = obj.geometry as LineSegmentsGeometry;
  const pb = (g.attributes.instanceStart as THREE.InterleavedBufferAttribute).data;
  const n = Math.min(cap, Math.floor(pos.length / 6));
  (pb.array as Float32Array).set(pos.subarray(0, n * 6));
  pb.needsUpdate = true;
  if (colors) {
    const cb = (g.attributes.instanceColorStart as THREE.InterleavedBufferAttribute).data;
    (cb.array as Float32Array).set(colors.subarray(0, n * 6));
    cb.needsUpdate = true;
  }
  g.instanceCount = n;
  const m = obj.material as LineMaterial;
  m.color.set(color);
  m.linewidth = width;
  m.opacity = opacity;
  obj.renderOrder = order;
  obj.visible = n > 0 && opacity > 0.002;
  return <primitive object={obj} />;
};
