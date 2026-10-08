// The 3D talking board (react-three-fiber inside Remotion), reused for every board shot in the video:
// chapter titles spelled letter by letter, YES / NO answers, and the camera moves around them.
// The board art is the BoardTexture composition (public/img/test/board_tex.png), matched to the Gemini paintings.
import React, {useEffect, useMemo, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, Easing, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {noise2D} from '@remotion/noise';
import * as THREE from 'three';
import {clamp} from '../lib/anim';
import {FPS} from '../lib/theme';
import {useGFrame} from './Kit';
import {BH, BW, spot, toWorld} from '../test/board';

const TEAL = '#2FE0C4';

/** One planchette move: start frame, target (a letter, digit, YES / NO / GOOD BYE, or texture px), frames to get there. */
export type Move = {f: number; to: string | {x: number; y: number}; dur: number};

/** Moves that spell `word` (spaces are skipped), starting at frame `f`, `per` frames a letter. */
export const spell = (word: string, f: number, per = 9): Move[] =>
  word.replace(/\s+/g, '').split('').map((ch, i) => ({f: f + i * per, to: ch, dur: Math.round(per * 0.7)}));

/** Where each move lands (frame, key): use it for rings and sound. */
export const landings = (moves: Move[]) => moves.map((m) => ({f: m.f + m.dur, key: typeof m.to === 'string' ? m.to : ''}));

const target = (to: Move['to']) => (typeof to === 'string' ? spot(to) : to);

export const planchetteAt = (f: number, moves: Move[], start = {x: 1024, y: 760}, drift = 1) => {
  let p = start;
  let yaw = 0;
  for (const k of moves) {
    if (f <= k.f) break;
    const tg = target(k.to);
    const t = interpolate(f, [k.f, k.f + k.dur], [0, 1], {...clamp, easing: Easing.bezier(0.55, 0, 0.25, 1)});
    const settle = f > k.f + k.dur ? spring({frame: f - (k.f + k.dur), fps: FPS, config: {stiffness: 160, damping: 9}}) : 0;
    const over = f > k.f + k.dur ? (1 - settle) * 0.04 : 0;
    const dx = tg.x - p.x, dy = tg.y - p.y;
    yaw = Math.sin(Math.PI * t) * Math.atan2(dx, -dy) * 0.18;
    p = {x: p.x + dx * (t - over), y: p.y + dy * (t - over)};
  }
  const n = (s: string, k: number) => noise2D(s, f * k, 0);
  // the ideomotor drift: a hand is always on it
  return {x: p.x + n('px', 0.05) * 9 * drift, y: p.y + n('py', 0.05) * 9 * drift, yaw: yaw + n('pr', 0.04) * 0.04};
};

const planchetteShape = () => {
  const r = 0.27, cy = -0.06, tip = 0.42;
  const phi = Math.acos(r / (tip - cy));
  const s = new THREE.Shape();
  s.moveTo(0, tip);
  s.lineTo(Math.cos(Math.PI / 2 + phi) * r, cy + Math.sin(Math.PI / 2 + phi) * r);
  s.absarc(0, cy, r, Math.PI / 2 + phi, Math.PI / 2 - phi + Math.PI * 2, false);
  s.lineTo(0, tip);
  const hole = new THREE.Path();
  hole.absarc(0, 0, 0.085, 0, Math.PI * 2, true);
  s.holes.push(hole);
  return s;
};

const useTexture = (src: string) => {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const [h] = useState(() => delayRender(`texture ${src}`));
  useEffect(() => {
    new THREE.TextureLoader().load(staticFile(src), (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      setTex(t);
      continueRender(h);
    });
  }, [src, h]);
  return tex;
};

const Rig: React.FC<{pos: number[]; look: number[]; fov: number}> = ({pos, look, fov}) => {
  const cam = useThree().camera as THREE.PerspectiveCamera;
  cam.position.set(pos[0], pos[1], pos[2]);
  cam.fov = fov;
  cam.near = 0.02;
  cam.updateProjectionMatrix();
  cam.lookAt(look[0], look[1], look[2]);
  return null;
};

const Ring: React.FC<{at: number; x: number; z: number}> = ({at, x, z}) => {
  const g = useGFrame();
  const p = interpolate(g, [at, at + 8], [0, 1], clamp);
  if (p <= 0) return null;
  return (
    <mesh position={[x, 0.032, z]} rotation={[-Math.PI / 2, 0, 0.6]}>
      <ringGeometry args={[0.105, 0.118, 64, 1, 0, Math.PI * 2 * p * 0.93]} />
      <meshBasicMaterial color={TEAL} toneMapped={false} transparent opacity={0.95} />
    </mesh>
  );
};

export type Light = 'candle' | 'lamp' | 'bulb' | 'day';
export type CamMode = 'low' | 'top' | 'close';

type Props = {
  a: number; b: number; moves: Move[]; start?: {x: number; y: number}; rings?: {at: number; key: string}[];
  light?: Light; cam?: CamMode; whipIn?: number; push?: number; dolly?: number; drift?: number; spooky?: [number, number];
};

const Scene: React.FC<Props & {tex: THREE.Texture}> = ({tex, a, b, moves, start, rings = [], light = 'candle', cam = 'low', whipIn = 0, push, dolly = 0.25, drift = 1, spooky}) => {
  const f = useCurrentFrame();
  const shape = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(planchetteShape(), {depth: 0.03, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 4, curveSegments: 48});
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);
  const pl = planchetteAt(f, moves, start, drift);
  const [px, pz] = toWorld(pl);
  const [lx, lz] = toWorld(planchetteAt(f - 5, moves, start, drift)); // the camera follows a beat late
  const whip = whipIn ? interpolate(f, [a, a + whipIn], [-2.4, 0], {...clamp, easing: Easing.out(Easing.exp)}) : 0;
  const d = interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)}) * dolly;
  const pu = push !== undefined ? interpolate(f, [push, b], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)}) : 0;
  let pos: number[], look: number[], fov = 37;
  if (cam === 'top') {
    pos = [lx * 0.15 + whip, 3.1 - d * 1.2, 0.35 + lz * 0.15];
    look = [lx * 0.2 + whip, 0, -0.02 + lz * 0.2];
    fov = 40;
  } else if (cam === 'close') {
    pos = [lx * 0.75 + 0.15 + whip, 0.62 - d * 0.15, lz + 1.0 - d * 0.25];
    look = [lx + whip * 0.9, 0, lz - 0.1];
    fov = 34;
  } else {
    pos = [0.1 + lx * 0.25 + whip, 1.35 - d * 1.2, 2.15 - d * 1.6];
    look = [lx * 0.35 + whip * 0.9, 0, -0.2 + lz * 0.25];
  }
  pos = pos.map((v, i) => v + ([px, 0.1, pz + 0.025][i] - v) * pu);
  look = look.map((v, i) => v + ([px, 0, pz][i] - v) * pu);
  const sp = spooky ? interpolate(f, spooky, [0, 1], clamp) : 0;
  const flick = 1 + noise2D('c1', f * 0.35, 0) * (0.1 + sp * 0.35) + noise2D('c2', f * 1.3, 1) * 0.05;
  const L = {
    candle: {pos: [-1.7, 0.95, -1.0], color: '#ffb071', i: 9 * flick * (1 - sp * 0.25), amb: 0.06, rim: 0.22},
    lamp: {pos: [-1.4, 1.6, -0.6], color: '#ffc98a', i: 10, amb: 0.12, rim: 0.15},
    bulb: {pos: [0.2, 2.2, -0.2], color: '#f1efe6', i: 11 * (1 + noise2D('b', f * 0.9, 2) * 0.03), amb: 0.05, rim: 0.3},
    day: {pos: [-1.2, 2.6, -1.4], color: '#fff6e8', i: 13, amb: 0.25, rim: 0.1},
  }[light];
  return (
    <>
      <Rig pos={pos} look={look} fov={fov} />
      <ambientLight intensity={L.amb} color="#8899bb" />
      <pointLight position={L.pos as [number, number, number]} intensity={L.i} distance={0} decay={1.6} color={L.color} castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-radius={6} shadow-bias={-0.0004} />
      <directionalLight position={[2.5, 1.2, 1.5]} intensity={L.rim} color="#7f9cff" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color={light === 'bulb' ? '#2a2a28' : '#1b1611'} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.0125, 0]} receiveShadow>
        <boxGeometry args={[BW, 0.025, BH]} />
        <meshStandardMaterial color="#4a3826" roughness={0.75} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0256, 0]} receiveShadow>
        <planeGeometry args={[BW, BH]} />
        <meshStandardMaterial map={tex} roughness={0.62} metalness={0} />
      </mesh>
      {rings.map((r, i) => {
        const [x, z] = toWorld(spot(r.key));
        return <Ring key={i} at={r.at} x={x} z={z} />;
      })}
      <group position={[px, 0.0255 + 0.6 * 0.02, pz]} rotation={[0, -pl.yaw, 0]} scale={0.6}>
        <mesh geometry={shape} castShadow receiveShadow>
          <meshStandardMaterial color="#e2705f" roughness={0.45} metalness={0.05} />
        </mesh>
        {[[-0.17, 0.12], [0.17, 0.12], [0, -0.36]].map(([x, z], i) => (
          <mesh key={i} position={[x, -0.012, z]} castShadow>
            <cylinderGeometry args={[0.022, 0.026, 0.026, 16]} />
            <meshStandardMaterial color="#2a211a" roughness={1} />
          </mesh>
        ))}
      </group>
    </>
  );
};

/** Horizontal motion blur sized to speed (px/frame). */
export const WhipBlur: React.FC<{id: string; speed: number; children: React.ReactNode}> = ({id, speed, children}) => {
  const dev = Math.min(Math.abs(speed) * 0.45, 140);
  if (dev < 0.5) return <>{children}</>;
  return (
    <>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id={id} x="-10%" y="0" width="120%" height="100%"><feGaussianBlur stdDeviation={`${dev} 0`} edgeMode="duplicate" /></filter>
      </svg>
      <div style={{position: 'absolute', inset: 0, filter: `url(#${id})`}}>{children}</div>
    </>
  );
};

/** A full-frame 3D board shot between frames a and b. Children are 2D overlays (titles, notes). */
export const BoardShot: React.FC<Props & {children?: React.ReactNode; tiltShift?: boolean}> = ({children, tiltShift = true, ...p}) => {
  const f = useCurrentFrame();
  const tex = useTexture('img/test/board_tex.png');
  const w = (k: number) => (p.whipIn ? interpolate(k, [p.a, p.a + p.whipIn], [-2.4, 0], {...clamp, easing: Easing.out(Easing.exp)}) : 0);
  const mask = 'linear-gradient(180deg, #000 0%, transparent 14%, transparent 58%, #000 100%)';
  return (
    <AbsoluteFill style={{background: '#0b0a08'}}>
      <WhipBlur id={`bw${p.a}`} speed={(w(f) - w(f - 1)) * 700}>
        {tex && (
          <ThreeCanvas width={1920} height={1080} shadows gl={{antialias: true, preserveDrawingBuffer: true}}
            onCreated={({gl}) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.15; gl.shadowMap.type = THREE.PCFSoftShadowMap; }}>
            <Scene tex={tex} {...p} />
          </ThreeCanvas>
        )}
        {tiltShift && p.cam !== 'top' && <AbsoluteFill style={{backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', maskImage: mask, WebkitMaskImage: mask}} />}
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 45% 45%, transparent 35%, rgba(5,4,3,0.75) 100%)'}} />
      </WhipBlur>
      {children}
    </AbsoluteFill>
  );
};
