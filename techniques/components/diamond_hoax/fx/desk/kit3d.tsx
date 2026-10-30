// Shared pieces for the desk builder's drawn-3D scenes (Dominoes, BankVault, ShareSlices, ShortSale, MoneyMap).
// The look: dark faces with thick teal edge lines (LineSegments2, pixel-width, hidden lines depth-tested away), one coral
// element, a faint teal grid on the desk, the HTML dark notebook paper and a lamp pool behind a transparent canvas.
//
// React context does not cross into the <ThreeCanvas> reconciler, so everything the 3D children need (the raw frame for
// the camera, the 12 fps stepped frame `g` for marks) is computed outside and passed down as plain props.
import React, {useEffect, useMemo, useState} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender, Easing, interpolate, staticFile} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {LineSegments2} from 'three/examples/jsm/lines/LineSegments2.js';
import {LineSegmentsGeometry} from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial.js';
import {Line2} from 'three/examples/jsm/lines/Line2.js';
import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry.js';
import {DarkPaper} from '../../kit/common';
import {JF} from '../../kit/Kit';

export const TEAL = '#2FE0C4';
export const CORAL = '#FF6F61';
export const ORANGE = '#FF9F1C';
export const CREAM = '#F4EFE6';
export const FACE = '#1a1814'; // the dark face of every drawn solid
export const W = 1920;
export const H = 1080;
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export type V3 = [number, number, number];

// ---------------------------------------------------------------- deterministic helpers
export const mulberry32 = (a: number) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
/** Stable pseudo-random in [0,1) from a number pair (no state). */
export const hash = (a: number, b = 0) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
/** Marks step at 12 fps. */
export const step = (f: number) => Math.floor(f / 2.5) * 2.5;
export const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
/** 0 -> 1 with a back-overshoot settle (a slap). */
export const slap = (g: number, at: number, dur = 8) => interpolate(g, [at, at + dur], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.7))});
/** 0 -> 1 eased in-out. */
export const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
/** A small exponentially decaying shake (screen px) after each hard landing. */
export const shake = (f: number, hits: number[], amp = 8, decay = 0.22) => {
  let x = 0, y = 0;
  for (const h of hits) {
    if (f < h) continue;
    const k = Math.exp(-(f - h) * decay) * amp;
    x += Math.sin((f - h) * 2.3 + h) * k;
    y += Math.cos((f - h) * 3.1 + h) * k * 0.8;
  }
  return {x, y};
};

// ---------------------------------------------------------------- camera
export type CamKey = {f: number; pos: V3; look: V3; fov?: number};
export type CamState = {pos: V3; look: V3; fov: number};
/** Keyed camera, eased in-out between keys (raw frame: camera moves are smooth). */
export const camAt = (keys: CamKey[], f: number): CamState => {
  const k0 = keys[0];
  if (f <= k0.f || keys.length === 1) return {pos: k0.pos, look: k0.look, fov: k0.fov ?? 30};
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (f <= b.f) {
      const t = Easing.inOut(Easing.cubic)((f - a.f) / Math.max(1, b.f - a.f));
      const l = (p: number, q: number) => p + (q - p) * t;
      return {pos: [l(a.pos[0], b.pos[0]), l(a.pos[1], b.pos[1]), l(a.pos[2], b.pos[2])], look: [l(a.look[0], b.look[0]), l(a.look[1], b.look[1]), l(a.look[2], b.look[2])],
        fov: l(a.fov ?? 30, b.fov ?? 30)};
    }
  }
  const z = keys[keys.length - 1];
  return {pos: z.pos, look: z.look, fov: z.fov ?? 30};
};

const CamRig: React.FC<{c: CamState}> = ({c}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.set(...c.pos);
  if (camera.fov !== c.fov) {
    camera.fov = c.fov;
    camera.updateProjectionMatrix();
  }
  camera.lookAt(...c.look);
  return null;
};

/** World point -> screen px (1920x1080) for this camera: for HTML labels, notes and props pinned to 3D things. */
export const projector = (c: CamState) => {
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.05, 200);
  cam.position.set(...c.pos);
  cam.lookAt(...c.look);
  cam.updateMatrixWorld();
  cam.updateProjectionMatrix();
  const v = new THREE.Vector3();
  return (p: V3): [number, number] => {
    v.set(...p).project(cam);
    return [(v.x * 0.5 + 0.5) * W, (-v.y * 0.5 + 0.5) * H];
  };
};

// ---------------------------------------------------------------- the stage
/**
 * Dark paper, a lamp pool, and a transparent three.js canvas over it with the camera `cam`. The canvas only renders a
 * frame when Remotion's frame changes, so load every texture OUTSIDE it (useTexture / useCanvasTexture in the piece's
 * outer component) and pass `ready` = all loaded: the canvas mounts once they are in. `grid` lays a faint teal
 * grid on the desk (y = 0). `shakeXY` moves the whole picture (screen px). `over` is HTML drawn over the canvas.
 */
export const Stage3D: React.FC<{cam: CamState; children: React.ReactNode; grid?: number; gridSize?: number; lamp?: [number, number]; shakeXY?: {x: number; y: number};
  over?: React.ReactNode; under?: React.ReactNode; ambient?: number; ready?: boolean; fog?: [number, number]}> = ({cam, children, grid = 0.1, gridSize = 40, lamp = [960, 470], shakeXY = {x: 0, y: 0}, over, under, ambient = 0.9, ready = true, fog = [14, 38]}) => (
  <AbsoluteFill style={{overflow: 'hidden', background: '#0d0c09'}}>
    <AbsoluteFill style={{transform: `translate(${shakeXY.x.toFixed(2)}px, ${shakeXY.y.toFixed(2)}px) scale(1.02)`}}>
      <DarkPaper />
      <AbsoluteFill style={{background: `radial-gradient(circle 900px at ${lamp[0]}px ${lamp[1]}px, rgba(255,214,160,0.13) 0%, rgba(255,200,140,0.04) 55%, transparent 100%)`}} />
      {under}
      {ready && <AbsoluteFill>
        <ThreeCanvas width={W} height={H} camera={{fov: cam.fov, near: 0.05, far: 200}} gl={{antialias: true, alpha: true}} flat linear={false}>
          <CamRig c={cam} />
          <fog attach="fog" args={['#15130f', fog[0], fog[1]]} />
          <ambientLight intensity={ambient} />
          <directionalLight position={[-4, 9, 6]} intensity={1.6} />
          <directionalLight position={[6, 3, -4]} intensity={0.35} />
          {grid > 0 && <gridHelper args={[gridSize, gridSize * 2, TEAL, TEAL]} position={[0, 0, 0]} material-transparent material-opacity={grid} material-depthWrite={false} />}
          {children}
        </ThreeCanvas>
      </AbsoluteFill>}
      {over}
    </AbsoluteFill>
  </AbsoluteFill>
);

// ---------------------------------------------------------------- drawn solids
const lineMat = (color: string, width: number, opacity = 1, dashed = false) => {
  const m = new LineMaterial({color: new THREE.Color(color).getHex(), linewidth: width, transparent: opacity < 1, opacity, dashed, dashSize: 0.18, gapSize: 0.12});
  m.resolution.set(W, H);
  return m;
};

/** Teal edges of any geometry (creases sharper than `angle` degrees), pixel-width lines. */
export const Edges: React.FC<{geo: THREE.BufferGeometry; color?: string; width?: number; angle?: number; opacity?: number}> = ({geo, color = TEAL, width = 3, angle = 25, opacity = 1}) => {
  const obj = useMemo(() => {
    const eg = new THREE.EdgesGeometry(geo, angle);
    const lg = new LineSegmentsGeometry().fromEdgesGeometry(eg);
    eg.dispose();
    return new LineSegments2(lg, lineMat(color, width, opacity));
  }, [geo, angle]);
  const m = obj.material as LineMaterial;
  m.color.set(color);
  m.linewidth = width;
  m.opacity = opacity;
  m.transparent = opacity < 1;
  return <primitive object={obj} />;
};

/** A polyline (or loose segments with `segments`), pixel-width. `dashed` for routes. `draw` 0..1 draws it on. */
export const Poly: React.FC<{pts: V3[]; color?: string; width?: number; opacity?: number; dashed?: boolean; dash?: [number, number]; draw?: number; segments?: boolean}> = ({
  pts, color = TEAL, width = 3, opacity = 1, dashed = false, dash = [0.18, 0.12], draw = 1, segments = false,
}) => {
  const n = Math.max(2, Math.round(2 + (pts.length - 2) * Math.max(0, Math.min(1, draw))));
  const key = `${pts.length}|${n}|${pts[0]?.join(',')}|${pts[pts.length - 1]?.join(',')}`;
  const obj = useMemo(() => {
    const use = pts.slice(0, n);
    const flat = use.flat();
    if (segments) {
      const g = new LineSegmentsGeometry();
      g.setPositions(flat);
      return new LineSegments2(g, lineMat(color, width, opacity, dashed));
    }
    const g = new LineGeometry();
    g.setPositions(flat);
    const l = new Line2(g, lineMat(color, width, opacity, dashed));
    if (dashed) l.computeLineDistances();
    return l;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, segments, dashed]);
  const m = obj.material as LineMaterial;
  m.color.set(color);
  m.linewidth = width;
  m.opacity = opacity;
  m.transparent = opacity < 1;
  m.dashSize = dash[0];
  m.gapSize = dash[1];
  if (draw <= 0) return null;
  return <primitive object={obj} />;
};

/** A dark solid with drawn edges. */
export const Solid: React.FC<{geo: THREE.BufferGeometry; face?: string; line?: string; width?: number; angle?: number; opacity?: number; emissive?: string; noEdges?: boolean}> = ({
  geo, face = FACE, line = TEAL, width = 3, angle = 25, opacity = 1, emissive, noEdges,
}) => (
  <>
    <mesh geometry={geo}>
      <meshLambertMaterial color={face} emissive={emissive ?? '#000000'} transparent={opacity < 1} opacity={opacity} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
    </mesh>
    {!noEdges && <Edges geo={geo} color={line} width={width} angle={angle} opacity={opacity} />}
  </>
);

const boxCache = new Map<string, THREE.BoxGeometry>();
/** Shared box geometry by size (so edges are built once per size). */
export const boxGeo = (w: number, h: number, d: number) => {
  const k = `${w.toFixed(4)}|${h.toFixed(4)}|${d.toFixed(4)}`;
  let g = boxCache.get(k);
  if (!g) { g = new THREE.BoxGeometry(w, h, d); boxCache.set(k, g); }
  return g;
};

/** A drawn box sitting on its base (origin at the bottom centre). */
export const DBox: React.FC<{size: V3; pos?: V3; rot?: V3; face?: string; line?: string; width?: number; opacity?: number; emissive?: string}> = ({size, pos = [0, 0, 0], rot = [0, 0, 0], face, line, width, opacity, emissive}) => (
  <group position={pos} rotation={rot}>
    <group position={[0, size[1] / 2, 0]}>
      <Solid geo={boxGeo(...size)} face={face} line={line} width={width} opacity={opacity} emissive={emissive} />
    </group>
  </group>
);

// ---------------------------------------------------------------- soft contact shadow
let SHADOW_TEX: THREE.Texture | null = null;
const shadowTex = () => {
  if (SHADOW_TEX) return SHADOW_TEX;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d')!;
  const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(0,0,0,0.85)');
  gr.addColorStop(0.5, 'rgba(0,0,0,0.45)');
  gr.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = gr;
  x.fillRect(0, 0, 128, 128);
  SHADOW_TEX = new THREE.CanvasTexture(c);
  return SHADOW_TEX;
};
/** A soft dark blot on the desk under something (size in world units). */
export const Shadow: React.FC<{pos: V3; size: [number, number]; opacity?: number; rotY?: number}> = ({pos, size, opacity = 0.8, rotY = 0}) => (
  <mesh position={[pos[0], pos[1] + 0.004, pos[2]]} rotation={[-Math.PI / 2, 0, rotY]} renderOrder={-1}>
    <planeGeometry args={size} />
    <meshBasicMaterial map={shadowTex()} transparent opacity={opacity} depthWrite={false} />
  </mesh>
);

// ---------------------------------------------------------------- textures
const texCache = new Map<string, THREE.Texture>();
/** Load an image as a texture (holds the render until it's in). */
export const useTexture = (src: string | undefined) => {
  const [tex, setTex] = useState<THREE.Texture | null>(() => (src ? texCache.get(src) ?? null : null));
  useEffect(() => {
    if (!src || texCache.has(src)) return;
    const h = delayRender(`texture ${src}`);
    new THREE.TextureLoader().load(staticFile(src), (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      texCache.set(src, t);
      setTex(t);
      continueRender(h);
    }, undefined, (e) => cancelRender(e));
  }, [src]);
  return tex;
};

/** A texture drawn on a 2D canvas once the fonts are in (tape labels, price tags, silhouettes). */
export const useCanvasTexture = (key: string, w: number, h: number, draw: (x: CanvasRenderingContext2D) => void, fonts: string[] = []) => {
  const [tex, setTex] = useState<THREE.Texture | null>(() => texCache.get(key) ?? null);
  useEffect(() => {
    if (texCache.has(key)) return;
    const hd = delayRender(`canvas texture ${key}`);
    Promise.all(fonts.map((f) => document.fonts.load(f))).then(() => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const x = c.getContext('2d')!;
      draw(x);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      texCache.set(key, t);
      setTex(t);
      continueRender(hd);
    }).catch((e) => cancelRender(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return tex;
};

/** Torn orange tape with heavy serif ink: drawn into a 2D canvas (the 3D counterpart of Kit's `Highlight`). */
export const drawTape = (text: string, seed: number, size = 150, color = ORANGE) => (x: CanvasRenderingContext2D) => {
  const {width: w, height: h} = x.canvas;
  const r = mulberry32(seed);
  const steps = 40;
  x.beginPath();
  for (let i = 0; i <= steps; i++) x.lineTo((i / steps) * w, r() * h * 0.09);
  for (let i = steps; i >= 0; i--) x.lineTo((i / steps) * w, h - r() * h * 0.09);
  x.closePath();
  x.fillStyle = color;
  x.fill();
  x.fillStyle = '#111111';
  x.font = `400 ${size}px "Abril Fatface"`;
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  let s = size;
  while (x.measureText(text).width > w * 0.86 && s > 20) { s -= 4; x.font = `400 ${s}px "Abril Fatface"`; }
  x.fillText(text, w / 2, h * 0.54);
};
export const TAPE_FONTS = ['400 40px "Abril Fatface"'];

// ---------------------------------------------------------------- HTML overlays pinned to 3D
/** Small mono label (allowed near edges, but keep it inside the 96 px margin anyway). */
export const Mono: React.FC<{text: string; x: number; y: number; size?: number; color?: string; opacity?: number; anchor?: 'l' | 'c' | 'r'}> = ({text, x, y, size = 22, color = 'rgba(244,239,230,0.8)', opacity = 1, anchor = 'l'}) => (
  <div style={{position: 'absolute', left: x, top: y, fontFamily: JF.mono, fontSize: size, letterSpacing: 2, color, textTransform: 'uppercase', whiteSpace: 'nowrap', opacity,
    transform: anchor === 'c' ? 'translateX(-50%)' : anchor === 'r' ? 'translateX(-100%)' : undefined, textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>{text}</div>
);

/** A money tag: the converted figure big in Abril, the 1872 figure small in mono under it. Slaps in at `at`. */
export const MoneyTag: React.FC<{g: number; at: number; big: string; small?: string; x: number; y: number; size?: number; color?: string; out?: number; anchor?: 'l' | 'c'}> = ({
  g, at, big, small, x, y, size = 96, color = CREAM, out = Infinity, anchor = 'l',
}) => {
  if (g < at || g >= out) return null;
  const k = slap(g, at, 6);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `${anchor === 'c' ? 'translateX(-50%) ' : ''}scale(${(1.3 - 0.3 * k).toFixed(3)})`, transformOrigin: anchor === 'c' ? '50% 50%' : '0 50%',
      opacity: Math.min(1, k * 2), textAlign: anchor === 'c' ? 'center' : 'left'}}>
      <div style={{fontFamily: JF.display, fontSize: size, lineHeight: 1, color, whiteSpace: 'nowrap', textShadow: '0 4px 18px rgba(0,0,0,0.85)'}}>{big}</div>
      {small && <div style={{fontFamily: JF.mono, fontSize: Math.max(20, size * 0.26), letterSpacing: 2, color: 'rgba(244,239,230,0.75)', marginTop: size * 0.12, whiteSpace: 'nowrap', textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>{small}</div>}
    </div>
  );
};

/** A solid with a silhouette outline (inverted hull): for round things whose crease edges say nothing (columns, figures). */
export const Hull: React.FC<{geo: THREE.BufferGeometry; face?: string; line?: string; thick?: number; opacity?: number; pos?: V3; rot?: V3; scale?: V3}> = ({
  geo, face = FACE, line = TEAL, thick = 0.06, opacity = 1, pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1],
}) => (
  <group position={pos} rotation={rot} scale={scale}>
    <mesh geometry={geo}><meshLambertMaterial color={face} transparent={opacity < 1} opacity={opacity} /></mesh>
    <mesh geometry={geo} scale={[1 + thick, 1 + thick * 0.6, 1 + thick]}><meshBasicMaterial color={line} side={THREE.BackSide} transparent={opacity < 1} opacity={opacity} /></mesh>
  </group>
);

/** Points along a Catmull-Rom curve through `pts` (for paths that tokens follow and dashed guide lines). */
export const curve = (pts: V3[]) => new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)), false, 'centripetal');
export const curvePts = (c: THREE.CatmullRomCurve3, n = 48): V3[] => c.getPoints(n).map((v) => [v.x, v.y, v.z] as V3);
export const at3 = (c: THREE.CatmullRomCurve3, t: number): V3 => {
  const v = c.getPoint(Math.max(0, Math.min(1, t)));
  return [v.x, v.y, v.z];
};
