// Chunk History branding (Oct 2026), from brand/chunk-history/intro (the brand's source; its original 8.7 s jingle is there too).
//  - ChunkIntro: the channel intro after the cold open. The Quarter past mark assembles from chunks in 3D, the coral
//    quarter swings in last like a minute hand landing on a quarter past, then the Two slabs wordmark slides in beside it.
//    Trimmed from the brand's 8.7 s to 5.5 s (the user's pick): it ends soon after the full lockup lands.
//  - LogoBreak (the mark snap): the chapter break. Dip to black, the teal mark is already there, the coral quarter swings in
//    and locks on a click-clack as the next chapter fades up (2 s, same overlap contract as the old break).
// Sound: clicks only, no tones and no music (the user's call); the page turns in public/music/chunk_jingle.mp3 and
// public/sfx/chunk_snap.wav are cut off here; both built by projects/American_West/ep1/tools/make_jingle.py.
import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import shapes from './chunk/shapes.json';

type Piece = {color: string; outer: number[][]; holes: number[][][]; cx: number; cy: number; group: number};

const INK = '#111111';
const DEPTH = 0.09;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** Intro length: the brand intro runs 260 frames; the lockup is complete at 119, so 165 leaves ~1.5 s on it. */
export const INTRO_FRAMES = 165;
/** The branding sound is clicks only: no tones, no music (the user's call, Oct 2026), built by tools/make_jingle.py.
 *  The file already carries its level (peak -8 dBFS), so full volume. */
const JINGLE_VOL = 1;
/** The jingle's page turn starts at 4.45 s; it fades out just before that (the user's call: no page turns). */
const JINGLE_END = 133;

const FLIGHT = 22; // frames from launch to landing
// Landing frames, timed to the click track (tools/make_jingle.py): five clicks for the five blocks, the coral quarter locks on a
// click-clack (2.80 s), CHUNK is one firm click (3.60 s), HIS-TO-RY three tiny clicks from 3.95 s.
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

/** Camera at (yaw, pitch, dist) looking at the origin, with an optional small vertical bump. */
const Cam: React.FC<{yaw: number; pitch: number; dist: number; bump?: number}> = ({yaw, pitch, dist, bump = 0}) => {
  const camera = useThree((s) => s.camera);
  camera.position.set(Math.sin(yaw) * dist, Math.sin(pitch) * dist + bump, Math.cos(yaw) * Math.cos(pitch) * dist);
  const cam = camera as THREE.PerspectiveCamera;
  if (cam.fov !== 30) {
    cam.fov = 30;
    cam.updateProjectionMatrix();
  }
  camera.lookAt(0, 0, 0);
  return null;
};

const landBump = (frame: number, land: number, k = 0.012) => (frame >= land ? Math.exp(-(frame - land) / 3) * Math.sin((frame - land) * 1.9) * k : 0);

/** The coral quarter: a minute hand sweeping from the far side of 12 o'clock into quarter past (t: 0 -> 1). */
const Quarter: React.FC<{p: Piece; t: number; visible: boolean}> = ({p, t, visible}) => (
  <group rotation={[0, 0, interpolate(t, [0, 1], [Math.PI * 0.75, 0])]}>
    <Slab p={p} pos={[p.cx, p.cy, (1 - t) * 1.6]} rot={[(1 - t) * 0.8, (1 - t) * -0.6, 0]} visible={visible} />
  </group>
);

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const go = (land: number) => spring({frame: frame - (land - FLIGHT), fps, config: {damping: 15, stiffness: 110, mass: 0.9}});
  const slide = interpolate(frame, [86, 106], [0, 1], {...clamp, easing: ease});
  const settle = interpolate(frame, [0, 84], [0, 1], {extrapolateRight: 'clamp', easing: ease});
  const mark = shapes.mark as Piece[];
  return (
    <>
      <Cam yaw={interpolate(settle, [0, 1], [0.55, 0])} pitch={interpolate(settle, [0, 1], [-0.32, 0])}
        dist={interpolate(settle, [0, 1], [3.6, 2.7]) + slide * (TOTAL / 0.66 / 0.953 - 2.7)} bump={landBump(frame, MARK_LAND[5])} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[-3, 2.5, 4]} intensity={2.2} />
      <group position={[slide * MARK_X, 0, 0]}>
        {mark.map((p, i) => {
          const t = go(MARK_LAND[i]);
          const visible = frame >= MARK_LAND[i] - FLIGHT;
          if (i === mark.length - 1) return <Quarter key={i} p={p} t={t} visible={visible} />;
          const a = rnd(i, 1) * Math.PI * 2;
          const r = 4.2 + rnd(i, 2) * 1.8;
          const pos: [number, number, number] = [p.cx + Math.cos(a) * r * (1 - t), p.cy + Math.sin(a) * r * (1 - t), (-3 + rnd(i, 3) * 4.5) * (1 - t)];
          const rot: [number, number, number] = [(rnd(i, 4) - 0.5) * 5 * (1 - t), (rnd(i, 5) - 0.5) * 5 * (1 - t), (rnd(i, 6) - 0.5) * 3 * (1 - t)];
          return <Slab key={i} p={p} pos={pos} rot={rot} visible={visible} />;
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

const Stage: React.FC<{opacity: number; children: React.ReactNode}> = ({opacity, children}) => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: INK}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #1b1b1b 0%, #111111 60%, #0a0a0a 100%)'}} />
      <AbsoluteFill style={{opacity}}>
        <ThreeCanvas width={width} height={height} camera={{fov: 30, near: 0.1, far: 100}} gl={{antialias: true}} flat linear={false}>
          {children}
        </ThreeCanvas>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** The channel intro (INTRO_FRAMES long), with its jingle. */
export const ChannelIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 8, INTRO_FRAMES - 15, INTRO_FRAMES - 1], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <Stage opacity={fade}><IntroScene /></Stage>
      <Audio src={staticFile('music/chunk_jingle.mp3')} volume={(f) => interpolate(f, [0, JINGLE_END - 4, JINGLE_END], [JINGLE_VOL, JINGLE_VOL, 0], clamp)} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------------------------
// The chapter break
// ------------------------------------------------------------------------------------------------------------------

/** Frames to fade the old shot to black, and to fade the next one up from black. */
export const FADE = 10;
/** Whole break (2 s). It overlaps the last frames of one chapter and the first of the next (see shell LogoLead). */
export const BREAK_FRAMES = 60;
/** The coral quarter locks in here. */
const SNAP_LAND = 30;
const SNAP_FLIGHT = 14;

const SnapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = spring({frame: frame - (SNAP_LAND - SNAP_FLIGHT), fps, config: {damping: 16, stiffness: 130, mass: 0.8}});
  const mark = shapes.mark as Piece[];
  // a slow drift for life; the mark ~170 px tall, centred
  const drift = interpolate(frame, [0, BREAK_FRAMES], [0.14, -0.04]);
  return (
    <>
      <Cam yaw={drift} pitch={-0.05} dist={5.2} bump={landBump(frame, SNAP_LAND, 0.02)} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[-3, 2.5, 4]} intensity={2.2} />
      {mark.map((p, i) => (i === mark.length - 1
        ? <Quarter key={i} p={p} t={t} visible={frame >= SNAP_LAND - SNAP_FLIGHT} />
        : <Slab key={i} p={p} pos={[p.cx, p.cy, 0]} rot={[0, 0, 0]} />))}
    </>
  );
};

/** Lay this over the end of one chapter and the start of the next. */
export const LogoBreak: React.FC = () => {
  const f = useCurrentFrame();
  const black = interpolate(f, [0, FADE, BREAK_FRAMES - FADE, BREAK_FRAMES], [0, 1, 1, 0], clamp);
  const logo = interpolate(f, [FADE - 2, FADE + 6, BREAK_FRAMES - FADE - 8, BREAK_FRAMES - FADE], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: black}}>
      <Stage opacity={logo}><SnapScene /></Stage>
      {/* chunk_snap.wav: the lock click-clack at 1.0 s in (= SNAP_LAND); it stops before the file's page turn at 1.2 s */}
      <Sequence from={0} durationInFrames={35} layout="none"><Audio src={staticFile('sfx/chunk_snap.wav')} volume={0.3} /></Sequence>
    </AbsoluteFill>
  );
};
