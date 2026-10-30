// GemOrigins: ch07 "Diamonds, rubies and sapphires form in very different kinds of rock. In nature, you basically never
// find them lying around together." A drawn 3D cut-away block of the earth with three settings side by side:
//   DIAMOND  deep in the mantle (~150 km down), carried up in a kimberlite pipe
//   RUBY     in marble (metamorphosed limestone)
//   SAPPHIRE in basalt (carried up by basaltic lava)
// Each gem turns coral as it is named; then all three lift out of their rocks onto the one shared surface on top, and an
// orange X slams over them. "NOT TO SCALE" on screen (the block squeezes ~150 km of depth into one picture).
//
// Props (frames, in the parent's time):
//   at          the block fades up        default 0
//   diamondAt   diamond named (coral)     default at + 20
//   rubyAt      ruby named                default diamondAt + 45
//   sapphireAt  sapphire named            default rubyAt + 45
//   liftAt      all three rise to the surface, side by side   default sapphireAt + 50
//   xAt         the X slams over them     default liftAt + 45
// Exports: GemOrigins, GemOriginsTest, GEM_ORIGINS_TEST_FRAMES.
import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {JF, Note, PALETTES, PaletteCtx, StepCtx, useGFrame} from '../kit/Kit';
import {camAt, clamp, ContactShadow, CORAL, CREAM, ease, GemMesh, type GemKind, makeCam, ORANGE, Poly, project, rng, Segs, shakeAt, slap, Stage, SyncCam, TEAL, type CamKey} from './terrain/drawn3d';

const X0 = -7.5, X1 = 7.5, YB = -8.2, ZB = -3.2; // block (front face at z = 0, top at y = 0)
const MOHO = -3.3; // crust / mantle boundary on the face (drawn, not to scale)
const ROCK = '#16130f';
const FACE = '#1b1712';

type Spot = {kind: GemKind; face: [number, number]; top: [number, number, number]; title: string; sub: string; lab: [number, number]};
const SPOTS: Spot[] = [
  {kind: 'diamond', face: [-5, -6.6], top: [-1.55, 0.42, -1.5], title: 'DIAMOND', sub: 'KIMBERLITE PIPE · ~150 KM DOWN', lab: [-5, -7.45]},
  {kind: 'ruby', face: [0, -2.45], top: [0, 0.38, -1.5], title: 'RUBY', sub: 'IN MARBLE', lab: [0, -3.75]},
  {kind: 'sapphire', face: [5, -0.95], top: [1.55, 0.46, -1.5], title: 'SAPPHIRE', sub: 'IN BASALT', lab: [5.6, -2.4]},
];

const shapeGeo = (pts: [number, number][]) => new THREE.ShapeGeometry(new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y))));
const loop3 = (pts: [number, number][], z: number) => [...pts, pts[0]].map(([x, y]) => [x, y, z]);

// kimberlite pipe: a carrot from a small crater at the surface down into the mantle
const PIPE: [number, number][] = (() => {
  const L: [number, number][] = [], Rr: [number, number][] = [];
  for (let i = 0; i <= 24; i++) {
    const y = -(i / 24) * 7.9;
    const w = 0.32 + 1.15 * Math.pow(1 - i / 24, 2.2) + 0.05 * Math.sin(i * 1.7);
    L.push([-5 - w, y]);
    Rr.push([-5 + w * 0.95, y]);
  }
  return [...L, ...Rr.reverse()];
})();
// marble: a gently folded band
const MARBLE: [number, number][] = (() => {
  const top: [number, number][] = [], bot: [number, number][] = [];
  for (let i = 0; i <= 30; i++) {
    const x = -2.5 + (5 * i) / 30;
    const y = -2.4 + 0.35 * Math.sin((x + 0.6) * 1.1);
    top.push([x, y + 0.6]);
    bot.push([x, y - 0.55]);
  }
  return [...top, ...bot.reverse()];
})();
// basalt: a flow near the surface with a feeder dyke below
const BASALT: [number, number][] = [[2.5, -0.15], [7.5, -0.15], [7.5, -1.75], [5.45, -1.75], [5.3, MOHO - 0.1], [4.75, MOHO - 0.1], [4.6, -1.75], [2.5, -1.75]];

const FACE_DETAIL = (() => {
  const Rn = rng(150);
  const strata: number[] = [], stipple: number[] = [], veins: number[] = [], joints: number[] = [], moho: number[] = [];
  const z = 0.06;
  for (const y0 of [-0.8, -1.5, -2.2, -2.9]) {
    let px = X0, py = y0;
    for (let x = X0 + 0.4; x <= X1 + 0.01; x += 0.4) {
      const y = y0 + Math.sin(x * 0.5 + y0) * 0.1;
      strata.push(px, py, z - 0.03, x, y, z - 0.03);
      px = x; py = y;
    }
  }
  {
    let px = X0, py = MOHO;
    for (let x = X0 + 0.3; x <= X1 + 0.01; x += 0.3) {
      const y = MOHO + Math.sin(x * 0.9) * 0.12;
      moho.push(px, py, z, x, y, z);
      px = x; py = y;
    }
  }
  // mantle: sparse dashes
  for (let k = 0; k < 90; k++) {
    const x = X0 + 0.3 + Rn() * (X1 - X0 - 0.6), y = YB + 0.3 + Rn() * (MOHO - YB - 0.6);
    stipple.push(x, y, z - 0.03, x + 0.18, y + (Rn() - 0.5) * 0.08, z - 0.03);
  }
  // kimberlite breccia: little angular fragments in the pipe
  for (let k = 0; k < 60; k++) {
    const t = Rn();
    const y = -t * 7.6 - 0.2;
    const w = 0.28 + 1.1 * Math.pow(1 - t, 2.2);
    const x = -5 + (Rn() - 0.5) * 1.7 * w;
    const r = 0.06 + Rn() * 0.08;
    const a0 = Rn() * 6;
    for (let i = 0; i < 4; i++) {
      const a = a0 + (i / 4) * 6.283, b = a0 + ((i + 1) / 4) * 6.283;
      stipple.push(x + Math.cos(a) * r, y + Math.sin(a) * r, z, x + Math.cos(b) * r, y + Math.sin(b) * r, z);
    }
  }
  // marble veins
  for (let k = 0; k < 7; k++) {
    let x = -2.3 + Rn() * 0.6, y = -2.4 + (Rn() - 0.5) * 0.7;
    for (let i = 0; i < 9; i++) {
      const nx = x + 0.5 + Rn() * 0.15, ny = y + (Rn() - 0.5) * 0.3;
      if (nx > 2.4) break;
      veins.push(x, y + 0.35 * Math.sin((x + 0.6) * 1.1) * 0.2, z, nx, ny + 0.35 * Math.sin((nx + 0.6) * 1.1) * 0.2, z);
      x = nx; y = Math.max(-2.85, Math.min(-1.95, ny));
    }
  }
  // basalt columns
  for (let x = 2.85; x < 7.4; x += 0.42) joints.push(x, -0.2, z, x + (Rn() - 0.5) * 0.06, -1.7, z);
  return {strata: new Float32Array(strata), stipple: new Float32Array(stipple), veins: new Float32Array(veins), joints: new Float32Array(joints), moho: new Float32Array(moho)};
})();
const TUFTS = (() => {
  const Rn = rng(31);
  const out: number[] = [];
  for (let k = 0; k < 70; k++) {
    const x = X0 + 0.4 + Rn() * (X1 - X0 - 0.8), z = ZB + 0.3 + Rn() * (-ZB - 0.5);
    if (Math.abs(x) < 2.6 && Math.abs(z + 1.5) < 0.9) continue;
    for (let b = -1; b <= 1; b++) out.push(x, 0.01, z, x + b * 0.09, 0.16 + Rn() * 0.08, z + (Rn() - 0.5) * 0.05);
  }
  return new Float32Array(out);
})();
const DIVIDERS = new Float32Array([-2.5, 0.02, 0.07, -2.5, YB, 0.07, 2.5, 0.02, 0.07, 2.5, YB, 0.07]);

const boxEdges = (() => {
  const e = new THREE.EdgesGeometry(new THREE.BoxGeometry(X1 - X0, -YB, -ZB));
  e.translate((X0 + X1) / 2, YB / 2, ZB / 2);
  return new Float32Array(e.attributes.position.array);
})();

const Lab: React.FC<{x: number; y: number; title: string; sub: string; on: number; hot: boolean}> = ({x, y, title, sub, on, hot}) => on <= 0.01 ? null : (
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, 0)', opacity: on, textAlign: 'center', fontFamily: JF.mono, whiteSpace: 'nowrap',
    background: 'rgba(7,9,8,0.62)', padding: '6px 12px', borderRadius: 4, textShadow: '0 2px 8px #000'}}>
    <div style={{fontSize: 30, letterSpacing: 6, color: hot ? CORAL : CREAM}}>{title}</div>
    <div style={{fontSize: 17, letterSpacing: 2, color: 'rgba(244,239,230,0.75)', marginTop: 2}}>{sub}</div>
  </div>
);

/** A rough brushed X (two tapered strokes) centred at (cx, cy). */
const BigX: React.FC<{cx: number; cy: number; size: number; k1: number; k2: number}> = ({cx, cy, size, k1, k2}) => {
  const stroke = (x1: number, y1: number, x2: number, y2: number, k: number, seed: number) => {
    if (k <= 0) return null;
    const s = 1 + 0.5 * (1 - k);
    const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l;
    const R = rng(seed);
    const pts: string[] = [];
    const N = 14;
    for (let i = 0; i <= N; i++) {
      const t = i / N, w = 16 + 14 * Math.sin(Math.PI * Math.min(1, t * 1.1)) + (R() - 0.5) * 5;
      pts.push(`${x1 + dx * t + nx * w},${y1 + dy * t + ny * w}`);
    }
    for (let i = N; i >= 0; i--) {
      const t = i / N, w = 14 + 12 * Math.sin(Math.PI * Math.min(1, t * 1.1)) + (R() - 0.5) * 5;
      pts.push(`${x1 + dx * t - nx * w},${y1 + dy * t - ny * w}`);
    }
    return <polygon points={pts.join(' ')} fill={ORANGE} opacity={Math.min(1, k * 2)} transform={`translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`} />;
  };
  const h = size / 2;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.7))'}} width={1920} height={1080}>
      {stroke(cx - h, cy - h * 0.8, cx + h, cy + h * 0.8, k1, 3)}
      {stroke(cx + h * 0.95, cy - h * 0.85, cx - h * 0.9, cy + h * 0.8, k2, 9)}
    </svg>
  );
};

export const GemOrigins: React.FC<{at?: number; diamondAt?: number; rubyAt?: number; sapphireAt?: number; liftAt?: number; xAt?: number}> = ({at = 0, diamondAt, rubyAt, sapphireAt, liftAt, xAt}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const D = diamondAt ?? at + 20, Ru = rubyAt ?? D + 45, Sa = sapphireAt ?? Ru + 45, L = liftAt ?? Sa + 50, X = xAt ?? L + 45;
  const named = [D, Ru, Sa];

  const keys: CamKey[] = [
    {f: at, target: [-1.3, -4.2, -1], dist: 31, yaw: 0.26, pitch: 0.2},
    {f: Sa + 30, target: [-0.5, -4.0, -1], dist: 29.5, yaw: 0.1, pitch: 0.17},
    {f: L + 34, target: [0, -0.9, -1.4], dist: 19.5, yaw: 0.05, pitch: 0.5},
    {f: X + 120, target: [0, -0.8, -1.4], dist: 18.6, yaw: -0.02, pitch: 0.52},
  ];
  const base = camAt(keys, f);
  const sh = shakeAt(f, X + 3, 0.12);
  const cam = useMemo(() => makeCam(base, [sh * 0.4, sh]), [base.dist, base.yaw, base.pitch, base.target[0], base.target[1], base.target[2], sh]);
  const S = (p: [number, number, number]) => project(cam, p);

  const fadeIn = interpolate(f, [at, at + 10], [0, 1], clamp);
  const lift = (i: number) => interpolate(g, [L + i * 5, L + i * 5 + 18], [0, 1], {...clamp, easing: ease});
  const landK = (i: number) => slap(Math.max(0, Math.min(1, (g - (L + i * 5 + 18)) / 8)));
  const geo = useMemo(() => ({
    face: shapeGeo([[X0, YB], [X1, YB], [X1, 0], [X0, 0]]),
    pipe: shapeGeo(PIPE),
    marble: shapeGeo(MARBLE),
    basalt: shapeGeo(BASALT),
    mantle: shapeGeo([[X0, YB], [X1, YB], [X1, MOHO], [X0, MOHO]]),
  }), []);

  const gemPos = (i: number): [number, number, number] => {
    const s = SPOTS[i];
    const t = lift(i);
    const a: [number, number, number] = [s.face[0], s.face[1], 0.35];
    // rise straight up out of the face, then swing back onto the top
    const up = Math.min(1, t * 1.6), back = Math.max(0, t * 1.6 - 0.6) / 1.0;
    const x = a[0] + (s.top[0] - a[0]) * ease(Math.min(1, back));
    const y = a[1] + (1.6 - a[1]) * ease(up) + (s.top[1] - 1.6) * ease(Math.min(1, back));
    const z = a[2] + (s.top[2] - a[2]) * ease(Math.min(1, back));
    return [x, y, z];
  };
  const xK1 = slap(Math.max(0, Math.min(1, (g - X) / 6)));
  const xK2 = slap(Math.max(0, Math.min(1, (g - X - 3) / 6)));
  const xc = S([0, 0.5, -1.5]);
  const xr = S([2.1, 0.5, -1.5]);
  const lifted = g >= L;

  return (
    <Stage
      lamp={[960, 380]}
      over={
        <AbsoluteFill style={{opacity: fadeIn}}>
          {SPOTS.map((s, i) => {
            const p = S([s.lab[0], s.lab[1], 0.1]);
            const on = interpolate(g, [named[i], named[i] + 6], [0, 1], clamp) * interpolate(g, [L - 4, L + 3], [1, 0], clamp);
            const hot = g >= named[i] && (i === 2 || g < named[i + 1]);
            return <Lab key={i} x={p.x} y={p.y} title={s.title} sub={s.sub} on={on} hot={hot} />;
          })}
          {(() => {
            const k = interpolate(g, [at + 6, at + 16], [0, 1], clamp) * interpolate(g, [L - 4, L + 3], [1, 0], clamp);
            const c = S([X0 - 0.15, -0.6, 0]), m = S([X0 - 0.15, MOHO - 0.6, 0]);
            return k > 0.01 && <>
              <div style={{position: 'absolute', left: c.x - 14, top: c.y, transform: 'translate(-100%, -50%)', opacity: k, fontFamily: JF.mono, fontSize: 18, letterSpacing: 3, color: 'rgba(244,239,230,0.75)'}}>CRUST</div>
              <div style={{position: 'absolute', left: m.x - 14, top: m.y, transform: 'translate(-100%, -50%)', opacity: k, fontFamily: JF.mono, fontSize: 18, letterSpacing: 3, color: 'rgba(244,239,230,0.75)'}}>MANTLE</div>
            </>;
          })()}
          {lifted && <div style={{position: 'absolute', left: S([-5.2, 0, -1.4]).x, top: S([-5.2, 0, -1.4]).y, transform: 'translate(-50%, -50%)', fontFamily: JF.mono, fontSize: 20, letterSpacing: 4, color: CREAM,
            opacity: interpolate(g, [L + 30, L + 38], [0, 1], clamp), background: 'rgba(7,9,8,0.62)', padding: '4px 10px', borderRadius: 4}}>THE SURFACE</div>}
          {g >= X && <BigX cx={xc.x} cy={xc.y} size={(xr.x - xc.x) * 2.3} k1={xK1} k2={xK2} />}
          <Note text="never together" x={xc.x + 280} y={xc.y - 230} size={58} rot={-5} at={X + 14} dur={12} />
          <div style={{position: 'absolute', right: 150, top: 940, fontFamily: JF.mono, fontSize: 17, letterSpacing: 2, color: 'rgba(244,239,230,0.7)'}}>NOT TO SCALE</div>
        </AbsoluteFill>
      }
    >
      <SyncCam cam={cam} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[-6, 10, 8]} intensity={1.7} />
      <group visible={fadeIn > 0.01}>
        <ContactShadow y={YB - 0.05} w={(X1 - X0) * 1.6} d={-ZB * 3} z={ZB / 2} />
        <mesh position={[(X0 + X1) / 2, YB / 2, ZB / 2]}>
          <boxGeometry args={[X1 - X0, -YB, -ZB]} />
          <meshLambertMaterial color={ROCK} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
        </mesh>
        <mesh geometry={geo.face} position={[0, 0, 0.005]}><meshLambertMaterial color={FACE} /></mesh>
        <mesh geometry={geo.mantle} position={[0, 0, 0.012]}><meshLambertMaterial color="#20150f" /></mesh>
        <mesh geometry={geo.pipe} position={[0, 0, 0.02]}><meshLambertMaterial color="#1c1a20" /></mesh>
        <mesh geometry={geo.marble} position={[0, 0, 0.02]}><meshLambertMaterial color="#2a2722" /></mesh>
        <mesh geometry={geo.basalt} position={[0, 0, 0.02]}><meshLambertMaterial color="#0c0d0e" /></mesh>
        <Segs pos={boxEdges} color={TEAL} width={2.4} opacity={0.85} />
        <Segs pos={TUFTS} color={TEAL} width={1.4} opacity={0.45} />
        <Segs pos={FACE_DETAIL.strata} color={TEAL} width={1.2} opacity={0.28} />
        <Segs pos={FACE_DETAIL.stipple} color={TEAL} width={1.1} opacity={0.35} />
        <Segs pos={FACE_DETAIL.moho} color={TEAL} width={1.6} opacity={0.6} dashed dash={0.25} gap={0.15} />
        <Segs pos={FACE_DETAIL.veins} color={CREAM} width={1.1} opacity={0.35} />
        <Segs pos={FACE_DETAIL.joints} color={TEAL} width={1.3} opacity={0.5} />
        <Segs pos={DIVIDERS} color={CREAM} width={1.4} opacity={0.3} dashed dash={0.2} gap={0.18} />
        <Poly pts={loop3(PIPE, 0.07)} color={TEAL} width={2.2} />
        <Poly pts={loop3(MARBLE, 0.07)} color={TEAL} width={2.2} />
        <Poly pts={loop3(BASALT, 0.07)} color={TEAL} width={2.2} />
        {SPOTS.map((s, i) => {
          const isHot = g >= named[i] && (lifted || i === 2 || g < named[i + 1]);
          const wasNamed = g >= named[i];
          const pop = wasNamed ? slap(Math.min(1, (g - named[i]) / 7)) : 0;
          const sc = 0.85 * (1 + 0.25 * (pop < 1 ? Math.sin(pop * Math.PI) : 0)) * (lifted ? 0.9 + 0.1 * landK(i) : 1);
          return (
            <GemMesh key={i} kind={s.kind} pos={gemPos(i)} s={sc} rot={[0.35, g / 40 + i * 1.3, 0.12]}
              fill={isHot ? CORAL : wasNamed ? '#3a3631' : '#24211d'} line={isHot ? CREAM : TEAL} width={isHot ? 2.4 : 1.8} glow={isHot ? 0.25 : 0} />
          );
        })}
      </group>
    </Stage>
  );
};

export const GEM_ORIGINS_TEST_FRAMES = 330;
export const GemOriginsTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <GemOrigins at={0} diamondAt={20} rubyAt={65} sapphireAt={110} liftAt={160} xAt={210} />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
