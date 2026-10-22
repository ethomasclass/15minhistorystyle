// Test 2: Ford's Theatre as an architect's card model (no people). A wide look from the house, up to the box, into
// Lincoln's seat, to the rail, and down the roughly 12-foot drop to the stage. Units are feet. Proportions are
// approximate (from 1865 photographs and descriptions), and the model says so on screen.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {Arrow, Highlight, Note, Tag} from '../kit/Kit';
import {TestFrame} from './common';

const CARD = '#e8e0cd';
const CARD_DARK = '#cfc5ae';
const INK = '#2a2723';
const CORAL = '#FF6F61';
const TEAL = '#2FE0C4';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type V3 = [number, number, number];
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/** A block of card with inked edges. `p` is the min corner, `s` the size. */
const Block: React.FC<{p: V3; s: V3; color?: string; edges?: boolean; opacity?: number}> = ({p, s, color = CARD, edges = true, opacity = 1}) => {
  const geo = React.useMemo(() => new THREE.BoxGeometry(...s), [s[0], s[1], s[2]]);
  const eg = React.useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  const pos: V3 = [p[0] + s[0] / 2, p[1] + s[1] / 2, p[2] + s[2] / 2];
  return (
    <group position={pos}>
      <mesh geometry={geo}>
        <meshLambertMaterial color={color} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {edges && <lineSegments geometry={eg}><lineBasicMaterial color={INK} transparent opacity={0.8 * opacity} /></lineSegments>}
    </group>
  );
};

/** A dashed teal measuring line in 3D, drawn on downward from `at` (thin cylinders: GL lines are 1 px wide). */
const Dashed: React.FC<{a: V3; b: V3; at: number}> = ({a, b, at}) => {
  const f = useCurrentFrame();
  const n = 14;
  const shown = Math.floor(interpolate(f, [at, at + 12], [0, n], clamp));
  return (
    <group>
      {Array.from({length: shown}, (_, i) => {
        const t = (i + 0.3) / n;
        const p = lerp3(a, b, t);
        return (
          <mesh key={i} position={p}>
            <cylinderGeometry args={[0.09, 0.09, ((b[1] - a[1]) / n) * -0.55, 8]} />
            <meshBasicMaterial color={TEAL} toneMapped={false} />
          </mesh>
        );
      })}
      {shown >= n && [a, b].map((q, i) => (
        <mesh key={`t${i}`} position={q}>
          <boxGeometry args={[1.2, 0.12, 0.12]} />
          <meshBasicMaterial color={TEAL} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
};

/** The theatre, roughly: stage and apron, proscenium, the house floor with benches, a horseshoe dress circle, and the
 * President's box (two boxes joined) on the right wall, 12 feet above the stage. Right wall left off, as in a model. */
const Theatre: React.FC = () => {
  const f = useCurrentFrame();
  const wall = interpolate(f, [110, 160, 225, 255], [1, 0, 0, 1], clamp);
  const benches: React.ReactNode[] = [];
  for (let r = 0; r < 12; r++) {
    for (const side of [-1, 1]) {
      const x0 = side < 0 ? -21 : 2;
      benches.push(<Block key={`b${r}${side}`} p={[x0, -3, 16 + r * 3.4]} s={[19, 1.6, 1.6]} color={CARD_DARK} />);
    }
  }
  return (
    <group>
      {/* the table the model sits on */}
      <Block p={[-80, -5.5, -80]} s={[160, 1, 200]} color={'#3a352d'} edges={false} />
      {/* stage and apron */}
      <Block p={[-34, -4, -34]} s={[68, 4, 34]} />
      <Block p={[-30, -4, 0]} s={[60, 4, 10]} />
      {Array.from({length: 22}, (_, i) => <Block key={`pl${i}`} p={[-34 + i * 3.1, 0, -34]} s={[0.05, 0.02, 44]} color={INK} edges={false} opacity={0.35} />)}
      {/* house floor */}
      <Block p={[-30, -4.2, 10]} s={[60, 0.2, 64]} color={CARD_DARK} />
      {benches}
      {/* proscenium wall with its opening */}
      <Block p={[-40, 0, -3]} s={[16, 42, 2]} />
      <Block p={[24, 0, -3]} s={[16, 42, 2]} />
      <Block p={[-24, 26, -3]} s={[48, 16, 2]} />
      {/* back wall of the stage (scenery flat) */}
      <Block p={[-34, 0, -35]} s={[68, 34, 1]} color={CARD_DARK} />
      {/* left wall of the house, and the back wall */}
      <Block p={[-31, -4, -1]} s={[1, 46, 76]} />
      <Block p={[-31, -4, 74]} s={[62, 46, 1]} />
      <Block p={[-41, 42, -36]} s={[82, 1, 112]} color={'#4a443a'} />
      {/* stage side walls (the wings) */}
      <Block p={[-35, 0, -35]} s={[1, 42, 32]} color={CARD_DARK} />
      <Block p={[34, 0, -35]} s={[1, 42, 32]} color={CARD_DARK} />
      {wall > 0.01 && <Block p={[32.6, -4, -1]} s={[1, 46, 76]} opacity={wall} />}
      {/* dress circle: back and left side, plus the right side behind the box */}
      <Block p={[-30, 12, 60]} s={[60, 1, 14]} />
      <Block p={[-30, 13, 60]} s={[60, 3, 0.6]} color={CARD_DARK} />
      <Block p={[-30, 12, 18]} s={[9, 1, 42]} />
      <Block p={[-21.6, 13, 18]} s={[0.6, 3, 42]} color={CARD_DARK} />
      <Block p={[21, 12, 20]} s={[9, 1, 40]} />
      <Block p={[21, 13, 20]} s={[0.6, 3, 40]} color={CARD_DARK} />
      {/* columns under the dress circle */}
      {[24, 36, 48].map((z) => <Block key={`cl${z}`} p={[-22, -3, z]} s={[0.8, 15, 0.8]} />)}
      {[30, 44].map((z) => <Block key={`cr${z}`} p={[21.4, -3, z]} s={[0.8, 15, 0.8]} />)}
      {/* the President's box: floor at 12 ft, overhanging the right edge of the apron */}
      <Block p={[24, 11, 1]} s={[8, 1, 16]} />
      <Block p={[24, 12, 1]} s={[0.6, 3.2, 16]} color={CORAL} />
      {/* drapes */}
      <Block p={[24.2, 18, 1.2]} s={[0.3, 5, 2.4]} color={CORAL} edges={false} opacity={0.85} />
      <Block p={[24.2, 18, 14.4]} s={[0.3, 5, 2.4]} color={CORAL} edges={false} opacity={0.85} />
      {/* Lincoln's rocking chair, roughly where it stood */}
      <Block p={[27.5, 12, 12]} s={[2.2, 1.6, 2.2]} color={CARD_DARK} />
      <Block p={[29.2, 12, 12]} s={[0.4, 4.2, 2.2]} color={CARD_DARK} />
      {/* the corridor door behind the box */}
      <Block p={[32, 11, 3]} s={[0.6, 8, 3.2]} color={CARD_DARK} />
    </group>
  );
};

// camera path: [frame, position, look-at]
const PATH: [number, V3, V3][] = [
  [0, [-12, 8, 66], [10, 9, 2]],
  [80, [-6, 11, 46], [24, 14, 8]],
  [170, [44, 18, 22], [22, 13, 6]],
  [215, [40.5, 17.5, 18.5], [23, 12, 6]],
  [270, [14, 10, 19], [24, 6, 7.5]],
  [300, [14.4, 10, 18.6], [24, 6, 7.5]],
  [318, [24.3, 17.4, 7.6], [16, 0, 3]],
  [336, [21.3, 5.6, 5.6], [8, 5, -6]],
  [450, [16, 5.4, 1], [27, 14, 9]],
];
const io = Easing.inOut(Easing.cubic);
const EASES: ((t: number) => number)[] = [io, io, io, io, io, Easing.inOut(Easing.quad), Easing.in(Easing.quad), Easing.out(Easing.cubic)];

const Rig: React.FC = () => {
  const f = useCurrentFrame();
  const {camera} = useThree();
  let i = PATH.length - 2;
  for (let k = 0; k < PATH.length - 1; k++) if (f < PATH[k + 1][0]) { i = k; break; }
  const [f0, p0, l0] = PATH[i];
  const [f1, p1, l1] = PATH[i + 1];
  const t = EASES[i](Math.min(1, Math.max(0, (f - f0) / (f1 - f0))));
  const p = lerp3(p0, p1, t);
  const l = lerp3(l0, l1, t);
  // a little camera shake on landing
  const shake = f > 336 && f < 352 ? Math.sin(f * 2.3) * 0.12 * (352 - f) / 16 : 0;
  camera.position.set(p[0], p[1] + shake, p[2]);
  camera.lookAt(l[0], l[1], l[2]);
  (camera as THREE.PerspectiveCamera).fov = 50;
  camera.updateProjectionMatrix();
  return null;
};

const Scene3D: React.FC = () => {
  const {width, height} = useVideoConfig();
  const f = useCurrentFrame();
  return (
    <ThreeCanvas width={width} height={height} camera={{fov: 50, position: [0, 10, 60], near: 0.1, far: 400}}>
      <color attach="background" args={['#0d0c09']} />
      <fog attach="fog" args={['#0d0c09', 60, 140]} />
      <ambientLight intensity={1.3} color={'#fff3e0'} />
      <directionalLight position={[-30, 60, 40]} intensity={1.6} color={'#fff8ec'} />
      {/* gas footlights along the apron */}
      <pointLight position={[0, 2, 9]} intensity={60} distance={40} decay={1.4} color={'#ffcf8a'} />
      <pointLight position={[26, 20, 9]} intensity={25} distance={22} decay={1.4} color={'#ffcf8a'} />
      <Rig />
      <Theatre />
      <Dashed a={[23.4, 11.9, 7]} b={[23.4, 0.05, 7]} at={256} />
    </ThreeCanvas>
  );
};

export const FORDS_FRAMES = 450;
export const FordsTest: React.FC = () => (
  <TestFrame vignette={0.5}>
    <AbsoluteFill style={{filter: 'sepia(0.15) contrast(1.05)'}}><Scene3D /></AbsoluteFill>
    <Highlight text="FORD'S THEATRE" x={110} y={92} size={84} at={10} />
    <Note text="April 14, 1865" x={130} y={218} at={22} size={50} out={150} />
    <Note text="the President's box" x={1180} y={250} at={50} size={50} out={150} />
    <Arrow x1={1340} y1={320} x2={1420} y2={420} bow={-30} at={58} out={150} />
    <Note text="Lincoln's seat: a rocking chair, at the back of the box" x={130} y={218} at={162} size={46} out={236} />
    <Note text="from the rail to the stage: about 12 feet" x={130} y={218} at={262} size={46} out={322} />
    <Note text="Booth jumped. He broke his leg landing." x={130} y={218} at={338} size={46} />
    <Tag text="Model · approximate proportions, from 1865 photographs and descriptions · no people shown" />
  </TestFrame>
);
