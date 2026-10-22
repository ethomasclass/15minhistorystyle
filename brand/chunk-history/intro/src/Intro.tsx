// Chunk History intro: the Quarter past mark assembles from chunks in 3D, the coral quarter swings in
// last like a minute hand landing on a quarter past, then the Two slabs wordmark slides in beside it.
import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import shapes from './shapes.json';

type Piece = {color: string; outer: number[][]; holes: number[][][]; cx: number; cy: number; group: number};

const INK = '#111111';
const DEPTH = 0.09;
const FLIGHT = 22; // frames from launch to landing

// Landing frames: teal chunks first (big rim pieces, then the inner pieces), the coral quarter last.
// Timed to public/jingle.mp3: the coral quarter lands on its big hit (2.80 s), the slabs on 3.60 s and 3.95 s.
const MARK_LAND = [36, 50, 60, 68, 74, 84];
const WM_LAND = [108, 119];

// Final lockup: mark (tablet spans 224/256 of its box) at 1.5x the wordmark's height, gap a quarter of the mark.
const TABLET = 224 / 256;
const WM_K = TABLET / 1.5 / shapes.wordmarkHeight;
const WM_W = shapes.wordmarkWidth * WM_K;
const GAP = TABLET * 0.25;
const TOTAL = TABLET + GAP + WM_W;
const MARK_X = -TOTAL / 2 + TABLET / 2;
const WM_X = TOTAL / 2 - WM_W / 2;

const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

function geometry(p: Piece) {
  const toV = (pts: number[][]) => pts.map(([x, y]) => new THREE.Vector2(x - p.cx, y - p.cy));
  const shape = new THREE.Shape(toV(p.outer));
  p.holes.forEach((h) => shape.holes.push(new THREE.Path(toV(h))));
  const g = new THREE.ExtrudeGeometry(shape, {depth: DEPTH, bevelEnabled: false, curveSegments: 1});
  g.translate(0, 0, -DEPTH);
  return g;
}

function materials(color: string) {
  const side = new THREE.Color(color).multiplyScalar(0.55);
  // Face in the exact brand colour (unlit), sides shaded so the depth reads.
  return [new THREE.MeshBasicMaterial({color}), new THREE.MeshStandardMaterial({color: side, roughness: 0.9, metalness: 0})];
}

const Slab: React.FC<{p: Piece; pos: [number, number, number]; rot: [number, number, number]; scale?: number; visible?: boolean}> = ({p, pos, rot, scale = 1, visible = true}) => {
  const geo = useMemo(() => geometry(p), [p]);
  const mats = useMemo(() => materials(p.color), [p.color]);
  return <mesh geometry={geo} material={mats} position={pos} rotation={rot} scale={scale} visible={visible} />;
};

const Camera: React.FC<{frame: number}> = ({frame}) => {
  const camera = useThree((s) => s.camera);
  const ease = Easing.bezier(0.22, 1, 0.36, 1);
  const settle = interpolate(frame, [0, 84], [0, 1], {extrapolateRight: 'clamp', easing: ease});
  const pull = interpolate(frame, [86, 106], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const yaw = interpolate(settle, [0, 1], [0.55, 0]);
  const pitch = interpolate(settle, [0, 1], [-0.32, 0]);
  const dist = interpolate(settle, [0, 1], [3.6, 2.7]) + pull * (TOTAL / 0.66 / 0.953 - 2.7);
  // landing bump when the coral quarter locks in
  const bump = frame >= MARK_LAND[5] ? Math.exp(-(frame - MARK_LAND[5]) / 3) * Math.sin((frame - MARK_LAND[5]) * 1.9) * 0.012 : 0;
  camera.position.set(Math.sin(yaw) * dist, Math.sin(pitch) * dist + bump, Math.cos(yaw) * Math.cos(pitch) * dist);
  const cam = camera as THREE.PerspectiveCamera;
  if (cam.fov !== 30) {
    cam.fov = 30;
    cam.updateProjectionMatrix();
  }
  camera.lookAt(0, 0, 0);
  return null;
};

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const go = (land: number) => spring({frame: frame - (land - FLIGHT), fps, config: {damping: 15, stiffness: 110, mass: 0.9}});
  const slide = interpolate(frame, [86, 106], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.22, 1, 0.36, 1)});
  const markX = slide * MARK_X;
  const mark = shapes.mark as Piece[];

  return (
    <>
      <Camera frame={frame} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[-3, 2.5, 4]} intensity={2.2} />
      <group position={[markX, 0, 0]}>
        {mark.map((p, i) => {
          const t = go(MARK_LAND[i]);
          const last = i === mark.length - 1;
          if (last) {
            // The coral quarter: a minute hand sweeping from 12 o'clock's far side into quarter past.
            const sweep = interpolate(t, [0, 1], [Math.PI * 0.75, 0]);
            const lift = (1 - t) * 1.6;
            return (
              <group key={i} rotation={[0, 0, sweep]}>
                <Slab p={p} pos={[p.cx, p.cy, lift]} rot={[(1 - t) * 0.8, (1 - t) * -0.6, 0]} visible={frame >= MARK_LAND[i] - FLIGHT} />
              </group>
            );
          }
          const a = rnd(i, 1) * Math.PI * 2;
          const r = 4.2 + rnd(i, 2) * 1.8;
          const pos: [number, number, number] = [
            p.cx + Math.cos(a) * r * (1 - t),
            p.cy + Math.sin(a) * r * (1 - t),
            (-3 + rnd(i, 3) * 4.5) * (1 - t),
          ];
          const rot: [number, number, number] = [(rnd(i, 4) - 0.5) * 5 * (1 - t), (rnd(i, 5) - 0.5) * 5 * (1 - t), (rnd(i, 6) - 0.5) * 3 * (1 - t)];
          return <Slab key={i} p={p} pos={pos} rot={rot} visible={frame >= MARK_LAND[i] - FLIGHT} />;
        })}
      </group>
      <group position={[WM_X, 0, 0]} scale={WM_K}>
        {(shapes.wordmark as Piece[]).map((p, i) => {
          const t = go(WM_LAND[p.group]);
          return <Slab key={i} p={p} pos={[p.cx + (1 - t) * 6, p.cy, (1 - t) * -2]} rot={[0, (1 - t) * -1.1, 0]} visible={frame >= WM_LAND[p.group] - FLIGHT} />;
        })}
      </group>
    </>
  );
};

export const Intro: React.FC = () => {
  const {width, height} = useVideoConfig();
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 8, durationInFrames - 15, durationInFrames - 1], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: INK}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #1b1b1b 0%, #111111 60%, #0a0a0a 100%)'}} />
      <AbsoluteFill style={{opacity: fadeIn}}>
        <ThreeCanvas width={width} height={height} camera={{fov: 30, near: 0.1, far: 100}} gl={{antialias: true}} flat linear={false}>
          <Scene />
        </ThreeCanvas>
      </AbsoluteFill>
      <Audio src={staticFile('jingle.mp3')} />
    </AbsoluteFill>
  );
};
