// AnthillCutaway: ch07 "Then they looked at the anthills. Some had rubies in them. And around those anthills, the ground
// had boot prints. The anthills without boot prints? No rubies. ... pushed the stones in with the end of a stick."
// A drawn 3D block of ground with an anthill on it. The block is sliced through the anthill's centre and the front half
// drops away: the cut face shows the soil, the ants' tunnels, and a stick hole running down from the top to a coral ruby
// about eight inches down. Coral boot prints stamp in around it; a neighbouring anthill, intact, has no prints, no ruby.
// World units: 1 = 10 cm (the anthill is ~90 cm across and ~24 cm tall; the ruby is enlarged).
//
// Props (frames, in the parent's time):
//   at         the block fades up                                              default 0
//   sliceAt    a cut line runs across, the front half drops away                default at + 25
//   rubyAt     the stick hole draws down, the ruby glows at its end, "~8 in"     default sliceAt + 45
//   printsAt   boot prints stamp in around the anthill, one by one               default rubyAt + 70
//   compareAt  the camera swings to the neighbouring anthill: no prints, no ruby default printsAt + 80
// Exports: AnthillCutaway, AnthillCutawayTest, ANTHILL_TEST_FRAMES.
import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {JF, PALETTES, PaletteCtx, StepCtx, useGFrame} from '../kit/Kit';
import {camAt, clamp, ContactShadow, CORAL, CREAM, GemMesh, glowTexture, GroundGlow, makeCam, Poly, project, rng, Segs, shakeAt, slap, Stage, SyncCam, TEAL, type CamKey} from './terrain/drawn3d';

// ───────────── layout ─────────────
const X0 = -9, X1 = 21, ZB = -10, ZF = 4, YB = -4.2; // block extents (front part z 0..ZF drops away)
const R = 4.6, HM = 2.4; // the salted anthill (radius, height)
const NB = {x: 14.5, z: -4.6, r: 3.9, h: 2.05}; // the neighbour
const SOIL = '#15130f';
const FACE = '#1a1611';
const mound = (r: number, rad = R, h = HM) => (r >= rad ? 0 : h * Math.pow(1 - (r / rad) ** 2, 0.85));
const HOLE_TOP: [number, number] = [0.55, mound(0.55) - 0.02];
const RUBY_Y = HOLE_TOP[1] - 2.03; // 8 inches = 20.3 cm below the top surface
const HOLE_END: [number, number] = [0.18, RUBY_Y];

const lathe = (rad: number, h: number, phiStart: number, phiLen: number) => {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 28; i++) {
    const r = rad * (1 - i / 28);
    pts.push(new THREE.Vector2(Math.max(0.0001, r), mound(r, rad, h)));
  }
  return new THREE.LatheGeometry(pts, 40, phiStart, phiLen);
};
/** Rings on the mound surface (half or full), as segment pairs. */
const rings = (cx: number, cz: number, rad: number, h: number, a0: number, a1: number) => {
  const out: number[] = [];
  for (let k = 1; k <= 6; k++) {
    const y = (h * k) / 7;
    const r = rad * Math.sqrt(1 - Math.pow(y / h, 1 / 0.85));
    for (let i = 0; i < 40; i++) {
      const p = a0 + ((a1 - a0) * i) / 40, q = a0 + ((a1 - a0) * (i + 1)) / 40;
      out.push(cx + r * Math.sin(p), y + 0.01, cz + r * Math.cos(p), cx + r * Math.sin(q), y + 0.01, cz + r * Math.cos(q));
    }
  }
  // a few meridians
  for (let m = 0; m < 9; m++) {
    const p = a0 + ((a1 - a0) * (m + 0.5)) / 9;
    for (let i = 0; i < 14; i++) {
      const r0 = rad * (i / 14), r1 = rad * ((i + 1) / 14);
      out.push(cx + r0 * Math.sin(p), mound(r0, rad, h) + 0.01, cz + r0 * Math.cos(p), cx + r1 * Math.sin(p), mound(r1, rad, h) + 0.01, cz + r1 * Math.cos(p));
    }
  }
  return new Float32Array(out);
};
const boxEdges = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) => {
  const e = new THREE.EdgesGeometry(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0));
  e.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  return new Float32Array(e.attributes.position.array);
};

// the cut face (z = 0): ground section plus the mound's profile
const faceShape = (() => {
  const s = new THREE.Shape();
  s.moveTo(X0, YB);
  s.lineTo(X1, YB);
  s.lineTo(X1, 0);
  for (let i = 0; i <= 60; i++) {
    const x = R - (2 * R * i) / 60;
    s.lineTo(x, mound(Math.abs(x)));
  }
  s.lineTo(X0, 0);
  s.lineTo(X0, YB);
  return s;
})();
const faceOutline = (() => {
  const pts: number[][] = [[X0, YB, 0.02], [X1, YB, 0.02], [X1, 0, 0.02], [R, 0, 0.02]];
  for (let i = 0; i <= 60; i++) {
    const x = R - (2 * R * i) / 60;
    pts.push([x, mound(Math.abs(x)) + 0.01, 0.02]);
  }
  pts.push([X0, 0, 0.02], [X0, YB, 0.02]);
  return pts;
})();

// soil strata, pebbles and tunnels on the cut face (seeded)
const FACE_LINES = (() => {
  const Rn = rng(1872);
  const strata: number[] = [];
  for (const y0 of [-1.1, -2.2, -3.3]) {
    let px = X0, py = y0 + (Rn() - 0.5) * 0.2;
    for (let x = X0 + 0.5; x <= X1 + 0.01; x += 0.5) {
      const y = y0 + Math.sin(x * 0.7 + y0 * 3) * 0.12 + (Rn() - 0.5) * 0.08;
      strata.push(px, py, 0.03, x, y, 0.03);
      px = x; py = y;
    }
  }
  const pebbles: number[] = [];
  for (let k = 0; k < 70; k++) {
    const cx = X0 + 0.4 + Rn() * (X1 - X0 - 0.8), cy = YB + 0.3 + Rn() * (-YB - 0.5), r = 0.05 + Rn() * 0.12;
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2, b = ((i + 1) / 7) * Math.PI * 2;
      pebbles.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.7, 0.03, cx + Math.cos(b) * r, cy + Math.sin(b) * r * 0.7, 0.03);
    }
  }
  // ant tunnels: wandering lines inside the mound and just below, with chambers
  const tunnels: number[] = [];
  const walk = (x: number, y: number, n: number, dx: number, dy: number) => {
    for (let i = 0; i < n; i++) {
      const nx = x + dx + (Rn() - 0.5) * 0.35, ny = y + dy + (Rn() - 0.5) * 0.25;
      tunnels.push(x, y, 0.03, nx, ny, 0.03);
      x = nx; y = ny;
    }
    // chamber
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2, b = ((i + 1) / 10) * Math.PI * 2;
      tunnels.push(x + Math.cos(a) * 0.32, y + Math.sin(a) * 0.14, 0.03, x + Math.cos(b) * 0.32, y + Math.sin(b) * 0.14, 0.03);
    }
  };
  walk(-1.4, 1.6, 6, -0.25, -0.35);
  walk(-2.6, 0.7, 7, 0.1, -0.4);
  walk(1.9, 1.3, 7, 0.2, -0.38);
  walk(-0.6, -0.6, 6, -0.3, -0.35);
  walk(2.6, -0.3, 5, 0.35, -0.3);
  return {strata: new Float32Array(strata), pebbles: new Float32Array(pebbles), tunnels: new Float32Array(tunnels)};
})();

// grass tufts on the ground (back part), avoiding the mounds
const TUFTS = (() => {
  const Rn = rng(77);
  const out: number[] = [];
  for (let k = 0; k < 90; k++) {
    const x = X0 + 0.6 + Rn() * (X1 - X0 - 1.2), z = ZB + 0.6 + Rn() * (-ZB - 1.2);
    if (Math.hypot(x, z) < R + 0.6 || Math.hypot(x - NB.x, z - NB.z) < NB.r + 0.5) continue;
    for (let b = -1; b <= 1; b++) out.push(x, 0.01, z, x + b * 0.18, 0.32 + Rn() * 0.15, z + (Rn() - 0.5) * 0.1);
  }
  return new Float32Array(out);
})();

// boot prints: a man's trail coming in from the back-left, around the salted anthill, leaving to the right
// a hobnailed boot: front sole (toe at +x, wide ball, narrow waist) and a separate heel, 2.6 dm long
const SOLE_SHAPES = (() => {
  const front = new THREE.Shape();
  front.moveTo(-0.25, -0.31);
  front.bezierCurveTo(0.3, -0.34, 0.7, -0.52, 1.08, -0.44);
  front.quadraticCurveTo(1.42, -0.3, 1.42, 0.0);
  front.quadraticCurveTo(1.42, 0.34, 1.04, 0.45);
  front.bezierCurveTo(0.6, 0.52, 0.3, 0.36, -0.25, 0.31);
  front.closePath();
  const heel = new THREE.Shape();
  heel.moveTo(-0.52, -0.35);
  heel.lineTo(-1.08, -0.35);
  heel.quadraticCurveTo(-1.38, -0.35, -1.38, 0);
  heel.quadraticCurveTo(-1.38, 0.35, -1.08, 0.35);
  heel.lineTo(-0.52, 0.35);
  heel.closePath();
  return [front, heel];
})();
const PRINTS = (() => {
  const path: [number, number][] = [[-8.2, -8.5], [-6.8, -6.6], [-6.1, -4.2], [-5.6, -1.6], [-3.8, -5.4], [-1.2, -6.3], [1.6, -6.1], [4.1, -5.0], [5.8, -2.8], [7.6, -1.2], [9.4, -0.7]];
  const out: {x: number; z: number; a: number; side: number}[] = [];
  for (let i = 0; i < path.length - 1; i++) {
    const [ax, az] = path[i], [bx, bz] = path[i + 1];
    const a = Math.atan2(bz - az, bx - ax);
    const side = i % 2 ? 1 : -1;
    out.push({x: (ax + bx) / 2 - Math.sin(a) * 0.45 * side, z: (az + bz) / 2 + Math.cos(a) * 0.45 * side, a, side});
  }
  return out;
})();
const printGeo = (() => {
  const g = new THREE.ShapeGeometry(SOLE_SHAPES);
  g.rotateX(-Math.PI / 2);
  return g;
})();
const printLines = (() => {
  const out: number[] = [];
  for (const sh of SOLE_SHAPES) {
    const pts = sh.getPoints(10);
    pts.push(pts[0]);
    for (let i = 0; i < pts.length - 1; i++) out.push(pts[i].x, 0.02, -pts[i].y, pts[i + 1].x, 0.02, -pts[i + 1].y);
  }
  // hobnails: short tread dashes
  for (const [x, w] of [[0.1, 0.22], [0.5, 0.3], [0.9, 0.3], [-0.95, 0.22]] as [number, number][]) out.push(x, 0.02, -w, x, 0.02, w);
  return new Float32Array(out);
})();

const BootPrint: React.FC<{x: number; z: number; a: number; side: number; k: number; op: number}> = ({x, z, a, side, k, op}) => {
  const s = 0.95 * (1 + 0.35 * (1 - k));
  return (
    <group position={[x, 0.015, z]} rotation={[0, -a, 0]} scale={[s, 1, s * side]}>
      <mesh geometry={printGeo} renderOrder={3}>
        <meshBasicMaterial color={CORAL} transparent opacity={0.32 * op * k} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <Segs pos={printLines} color={CORAL} width={2.6} opacity={op * Math.min(1, k * 1.5)} />
    </group>
  );
};

const Lab: React.FC<{x: number; y: number; text: string; color?: string; size?: number; opacity: number; align?: 'left' | 'center' | 'right'}> = ({x, y, text, color = CREAM, size = 22, opacity, align = 'center'}) => opacity <= 0.01 ? null : (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(${align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0'}, -50%)`, opacity, fontFamily: JF.mono, fontSize: size,
    letterSpacing: 3, color, whiteSpace: 'nowrap', background: 'rgba(7,9,8,0.62)', padding: `${size * 0.2}px ${size * 0.45}px`, borderRadius: 4, textShadow: '0 2px 8px #000'}}>{text}</div>
);

export const AnthillCutaway: React.FC<{at?: number; sliceAt?: number; rubyAt?: number; printsAt?: number; compareAt?: number}> = ({at = 0, sliceAt, rubyAt, printsAt, compareAt}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const SL = sliceAt ?? at + 25;
  const RB = rubyAt ?? SL + 45;
  const PR = printsAt ?? RB + 70;
  const CM = compareAt ?? PR + 80;

  const keys: CamKey[] = [
    {f: at, target: [4.5, 0.4, -2], dist: 46, yaw: 0.3, pitch: 0.4},
    {f: SL, target: [4, 0.4, -2], dist: 44, yaw: 0.27, pitch: 0.38},
    {f: SL + 30, target: [0.6, 0.2, 0], dist: 27, yaw: 0.2, pitch: 0.24},
    {f: RB + 10, target: [0.8, 0.6, 0], dist: 19.5, yaw: 0.12, pitch: 0.2},
    {f: PR - 4, target: [0.8, 0.6, 0], dist: 19, yaw: 0.1, pitch: 0.2},
    {f: PR + 26, target: [0.5, 0, -2.6], dist: 32, yaw: 0.26, pitch: 0.62},
    {f: CM, target: [0.7, 0, -2.6], dist: 31.5, yaw: 0.24, pitch: 0.62},
    {f: CM + 40, target: [7.6, 0.4, -3.2], dist: 40, yaw: 0.06, pitch: 0.5},
    {f: CM + 200, target: [7.8, 0.4, -3.2], dist: 38.5, yaw: 0.02, pitch: 0.5},
  ];
  const base = camAt(keys, f);
  const shake = shakeAt(f, SL + 16, 0.25);
  const camP = {...base, yaw: base.yaw + Math.sin((f - at) / 120) * 0.012};
  const cam = useMemo(() => makeCam(camP, [shake * 0.3, shake]), [camP.dist, camP.yaw, camP.pitch, camP.target[0], camP.target[1], camP.target[2], shake]);
  const S = (p: [number, number, number]) => project(cam, p);

  const fadeIn = interpolate(f, [at, at + 10], [0, 1], clamp);
  const cut = interpolate(g, [SL, SL + 8], [0, 1], clamp);
  const drop = interpolate(g, [SL + 8, SL + 22], [0, 1], {...clamp, easing: (t) => t * t});
  const front = drop < 1;
  const hole = interpolate(g, [RB, RB + 12], [0, 1], clamp);
  const rubyK = slap(Math.min(1, Math.max(0, (g - RB - 10) / 8)));
  const pulse = 0.8 + 0.2 * Math.sin(g / 4);
  const dim = interpolate(g, [CM, CM + 25], [1, 0.55], clamp); // the salted hill's coral dims a little as we look away

  const geo = useMemo(() => ({
    back: lathe(R, HM, Math.PI / 2, Math.PI),
    frontHalf: lathe(R, HM, -Math.PI / 2, Math.PI),
    nb: lathe(NB.r, NB.h, 0, Math.PI * 2),
    face: new THREE.ShapeGeometry(faceShape),
    ringsBack: rings(0, 0, R, HM, Math.PI / 2, Math.PI * 1.5),
    ringsFront: rings(0, 0, R, HM, -Math.PI / 2, Math.PI / 2),
    ringsNb: rings(NB.x, NB.z, NB.r, NB.h, 0, Math.PI * 2),
    backEdges: boxEdges(X0, X1, YB, 0, ZB, 0),
    frontEdges: boxEdges(X0, X1, YB, 0, 0, ZF),
  }), []);
  const cutLine = useMemo(() => [[X0, 0.03, 0.01], [X0 + (X1 - X0) * cut, 0.03, 0.01]], [cut]);
  const holeTop: [number, number, number] = [HOLE_TOP[0], HOLE_TOP[1], 0.04];
  const holeEnd: [number, number, number] = [HOLE_TOP[0] + (HOLE_END[0] - HOLE_TOP[0]) * hole, HOLE_TOP[1] + (HOLE_END[1] - HOLE_TOP[1]) * hole, 0.04];
  // the hole as a dark channel with cream walls
  const hw = 0.11;
  const holeWalls = useMemo(() => [[holeTop[0] - hw, holeTop[1] + 0.03, 0.05], [holeEnd[0] - hw, holeEnd[1], 0.05], [holeEnd[0] + hw, holeEnd[1], 0.05], [holeTop[0] + hw, holeTop[1] + 0.03, 0.05]], [hole]); // eslint-disable-line react-hooks/exhaustive-deps
  const holeFill = useMemo(() => {
    const s = new THREE.Shape([new THREE.Vector2(holeTop[0] - hw, holeTop[1] + 0.05), new THREE.Vector2(holeEnd[0] - hw, holeEnd[1]), new THREE.Vector2(holeEnd[0] + hw, holeEnd[1]), new THREE.Vector2(holeTop[0] + hw, holeTop[1] + 0.05)]);
    return new THREE.ShapeGeometry(s);
  }, [hole]); // eslint-disable-line react-hooks/exhaustive-deps
  // the "8 in" bracket
  const BX = 5.6;
  const bracket = useMemo(() => new Float32Array([
    BX, HOLE_TOP[1], 0.05, BX, RUBY_Y, 0.05,
    BX - 0.25, HOLE_TOP[1], 0.05, BX + 0.25, HOLE_TOP[1], 0.05,
    BX - 0.25, RUBY_Y, 0.05, BX + 0.25, RUBY_Y, 0.05,
  ]), []);
  const leaders = useMemo(() => new Float32Array([HOLE_TOP[0] + 0.3, HOLE_TOP[1], 0.05, BX - 0.3, HOLE_TOP[1], 0.05, HOLE_END[0] + 0.45, RUBY_Y, 0.05, BX - 0.3, RUBY_Y, 0.05]), []);
  const bracketK = interpolate(g, [RB + 18, RB + 26], [0, 1], clamp);

  const lab8 = S([BX + 0.45, (HOLE_TOP[1] + RUBY_Y) / 2, 0.05]);
  const labRuby = S([HOLE_END[0] - 0.7, RUBY_Y - 0.1, 0.1]);
  const labStick = S([HOLE_TOP[0] - 0.6, HOLE_TOP[1] + 0.9, 0]);
  const labPrints = S([-1.5, 3.4, -3]);
  const labNb = S([NB.x, NB.h + 1.6, NB.z]);
  const printsK = interpolate(g, [PR + 30, PR + 38], [0, 1], clamp);
  const cmpK = interpolate(g, [CM + 30, CM + 40], [0, 1], clamp);

  const frontOff: [number, number, number] = [0, -drop * 9, drop * 3];
  return (
    <Stage
      lamp={[900, 430]}
      over={
        <AbsoluteFill style={{opacity: fadeIn}}>
          <Lab x={labStick.x} y={labStick.y} text="STICK HOLE" size={20} opacity={bracketK * (1 - printsK)} />
          <Lab x={lab8.x} y={lab8.y} text="≈ 8 INCHES" size={26} opacity={bracketK * (1 - printsK)} align="left" />
          <Lab x={labRuby.x} y={labRuby.y} text="RUBY" color={CORAL} size={22} opacity={bracketK * (1 - printsK)} align="right" />
          <Lab x={labPrints.x} y={labPrints.y} text="BOOT PRINTS · A RUBY" color={CORAL} size={22} opacity={printsK} />
          <Lab x={labNb.x} y={labNb.y} text="NO PRINTS · NO RUBY" size={22} opacity={cmpK} />
          <div style={{position: 'absolute', right: 150, top: 940, fontFamily: JF.mono, fontSize: 17, letterSpacing: 2, color: 'rgba(244,239,230,0.7)'}}>CUT-AWAY · RUBY ENLARGED</div>
        </AbsoluteFill>
      }
    >
      <SyncCam cam={cam} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[-8, 12, 9]} intensity={1.8} />
      <group visible={fadeIn > 0.01}>
        <ContactShadow y={YB - 0.05} w={(X1 - X0) * 1.4} d={(ZF - ZB) * 1.6} x={(X0 + X1) / 2} z={-3} />
        {/* back block (stays): top, sides */}
        <mesh position={[(X0 + X1) / 2, YB / 2, ZB / 2]}>
          <boxGeometry args={[X1 - X0, -YB, -ZB]} />
          <meshLambertMaterial color={SOIL} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
        </mesh>
        <Segs pos={geo.backEdges} color={TEAL} width={2.2} opacity={0.75} />
        <Segs pos={TUFTS} color={TEAL} width={1.6} opacity={0.5} />
        {/* the cut face */}
        <mesh geometry={geo.face} position={[0, 0, 0.005]}>
          <meshLambertMaterial color={FACE} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
        </mesh>
        <Poly pts={faceOutline} color={TEAL} width={2.6} opacity={0.95} />
        <Segs pos={FACE_LINES.strata} color={TEAL} width={1.3} opacity={0.35} />
        <Segs pos={FACE_LINES.pebbles} color={TEAL} width={1.1} opacity={0.3} />
        <Segs pos={FACE_LINES.tunnels} color={TEAL} width={1.8} opacity={0.75} />
        {/* the salted anthill, back half */}
        <mesh geometry={geo.back}>
          <meshLambertMaterial color={SOIL} side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
        </mesh>
        <Segs pos={geo.ringsBack} color={TEAL} width={1.6} opacity={0.6} />
        {/* front piece: falls away on the slice */}
        {front && (
          <group position={frontOff}>
            <mesh position={[(X0 + X1) / 2, YB / 2, ZF / 2]}>
              <boxGeometry args={[X1 - X0, -YB, ZF]} />
              <meshLambertMaterial color={SOIL} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
            </mesh>
            <Segs pos={geo.frontEdges} color={TEAL} width={2.2} opacity={0.75} />
            <mesh geometry={geo.frontHalf}>
              <meshLambertMaterial color={SOIL} side={THREE.DoubleSide} />
            </mesh>
            <Segs pos={geo.ringsFront} color={TEAL} width={1.6} opacity={0.6} />
          </group>
        )}
        {cut > 0 && drop < 1 && <Poly pts={cutLine} color={CREAM} width={3.4} depthTest={false} order={9} />}
        {/* the stick hole and the ruby */}
        {hole > 0 && <>
          <mesh geometry={holeFill} renderOrder={4}><meshBasicMaterial color="#030303" /></mesh>
          <Poly pts={[holeWalls[0], holeWalls[1]]} color={CREAM} width={2} />
          <Poly pts={[holeWalls[3], holeWalls[2]]} color={CREAM} width={2} />
        </>}
        {rubyK > 0 && <>
          <GemMesh kind="ruby" pos={[HOLE_END[0], HOLE_END[1] - 0.08, 0.2]} s={0.62 * rubyK} rot={[0.35, 0.5, 0.15]} fill={CORAL} line={CREAM} width={2} glow={0.25 * pulse * dim} />
          <mesh position={[HOLE_END[0], HOLE_END[1] - 0.08, 0.3]} renderOrder={6}>
            <planeGeometry args={[3.2, 3.2]} />
            <meshBasicMaterial color={CORAL} transparent opacity={0.4 * rubyK * pulse * dim} depthWrite={false} blending={THREE.AdditiveBlending}
              map={glowTexture()} />
          </mesh>
        </>}
        {bracketK > 0 && <>
          <Segs pos={bracket} color={CREAM} width={2.2} opacity={bracketK * (1 - printsK * 0.7)} depthTest={false} order={8} />
          <Segs pos={leaders} color={CREAM} width={1.4} opacity={0.7 * bracketK * (1 - printsK * 0.7)} dashed dash={0.12} gap={0.1} depthTest={false} order={8} />
        </>}
        {/* boot prints */}
        {PRINTS.map((p, i) => {
          const t0 = PR + i * 4;
          if (g < t0) return null;
          const k = slap(Math.min(1, (g - t0) / 6));
          return <BootPrint key={i} x={p.x} z={p.z} a={p.a} side={p.side} k={k} op={dim} />;
        })}
        <GroundGlow pos={[-0.5, 0.02, -2.5]} r={7} color={CORAL} opacity={0.12 * printsK * dim} />
        {/* the neighbour: intact, no prints, no ruby */}
        <mesh geometry={geo.nb} position={[NB.x, 0, NB.z]}>
          <meshLambertMaterial color={SOIL} side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
        </mesh>
        <Segs pos={geo.ringsNb} color={TEAL} width={1.6} opacity={0.6} />
      </group>
    </Stage>
  );
};

export const ANTHILL_TEST_FRAMES = 330;
export const AnthillCutawayTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <AnthillCutaway at={0} sliceAt={30} rubyAt={75} printsAt={150} compareAt={230} />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
