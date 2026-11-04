// BalloonAssembly (ch03 "About 600 pieces made one balloon, 33 feet across. As tall as a three-story house."): a drawn teal
// wire sphere of 600 paper panels (24 gores × 25 bands) fills in, panel by panel from the bottom up, each panel flying in and
// settling, while a counter runs to 600. The paper is the coral of tools/round_balloon.py (alternating LIGHT / MID gores, DARK
// seams). Then a drawn three-story house outline (cream) stands beside it with the 33-foot dimension lines, for scale.
// Panel count and size from the script (Mikesh); the 24 × 25 layout is a drawing, not the real cutting pattern.
//
// Props (frames in the parent's time):
//   at        the wire sphere appears; panels start                        default 0
//   fillDur   frames for all 600 panels                                    default 150
//   houseAt   the camera eases back and the house + dimensions draw on      default at + fillDur + 20
//   labels    counter, dimension labels                                     default true
// Exports: BalloonAssembly, BalloonAssemblyTest, BALLOON_ASSEMBLY_TEST_FRAMES.
import React, {useEffect, useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {JF, PALETTES, PaletteCtx, StepCtx, useGFrame} from '../kit/Kit';
import {clamp, ContactShadow, CREAM, DynSegs, ease, Fine, Label, lerp, makeCam, partOf, Poly, project, ramp, rng, Segs, Stage, SyncCam, TEAL} from './kit3d';

const LIGHT = new THREE.Color('rgb(238,118,96)'), MID = new THREE.Color('rgb(229,109,88)'), DARK = 'rgb(196,92,74)';
const G = 24, B = 25, NPANEL = G * B; // 600
const SUB = 3; // each panel is a 3 × 3 patch
const R = 1; // radius: 16.5 ft
const CY = 1; // centre height: the balloon rests on the ground (y = 0)

const sph = (phi: number, th: number, r = R): [number, number, number] => [Math.sin(th) * Math.cos(phi) * r, Math.cos(th) * r + CY, Math.sin(th) * Math.sin(phi) * r];

// fill order: from the bottom band up, scattered
const ORDER = (() => {
  const rr = rng(600);
  const keys = Array.from({length: NPANEL}, (_, p) => {
    const b = p % B; // 0 = top band
    return {p, key: (B - 1 - b) + rr() * 7};
  });
  keys.sort((a, c) => a.key - c.key);
  const rank = new Array<number>(NPANEL);
  keys.forEach((k, i) => (rank[k.p] = i));
  return rank;
})();

// the wire grid (all gore and band lines, just inside the paper)
const GRID = (() => {
  const out: number[] = [];
  for (let g = 0; g < G; g++) {
    const phi = (g / G) * Math.PI * 2;
    for (let k = 0; k < 40; k++) out.push(...sph(phi, (k / 40) * Math.PI, 0.996), ...sph(phi, ((k + 1) / 40) * Math.PI, 0.996));
  }
  for (let b = 1; b < B; b++) {
    const th = (b / B) * Math.PI;
    for (let k = 0; k < 64; k++) out.push(...sph((k / 64) * Math.PI * 2, th, 0.996), ...sph(((k + 1) / 64) * Math.PI * 2, th, 0.996));
  }
  return new Float32Array(out);
})();

// panel template data: for each panel its patch points (unit sphere directions) and its centre direction
const PANELS = Array.from({length: NPANEL}, (_, p) => {
  const g = Math.floor(p / B), b = p % B;
  const pts: [number, number, number][] = [];
  for (let j = 0; j <= SUB; j++) for (let i = 0; i <= SUB; i++) {
    const phi = ((g + i / SUB) / G) * Math.PI * 2, th = ((b + j / SUB) / B) * Math.PI;
    pts.push([Math.sin(th) * Math.cos(phi), Math.cos(th), Math.sin(th) * Math.sin(phi)]);
  }
  const phiC = ((g + 0.5) / G) * Math.PI * 2, thC = ((b + 0.5) / B) * Math.PI;
  const shade = 0.94 + ((p * 7919) % 13) / 13 * 0.08;
  return {g, b, pts, c: [Math.sin(thC) * Math.cos(phiC), Math.cos(thC), Math.sin(thC) * Math.sin(phiC)] as [number, number, number], col: (g % 2 === 0 ? LIGHT : MID).clone().multiplyScalar(shade)};
});
const VPP = (SUB + 1) * (SUB + 1);
const INDEX = (() => {
  const idx: number[] = [];
  for (let p = 0; p < NPANEL; p++) for (let j = 0; j < SUB; j++) for (let i = 0; i < SUB; i++) {
    const a = p * VPP + j * (SUB + 1) + i, b2 = a + 1, c = a + SUB + 1, d = c + 1;
    idx.push(a, c, b2, b2, c, d);
  }
  return idx;
})();
const EDGE_IDX = (() => { // the patch border as point-index pairs (seams)
  const e: [number, number][] = [];
  for (let i = 0; i < SUB; i++) {
    e.push([i, i + 1]); // top
    e.push([SUB * (SUB + 1) + i, SUB * (SUB + 1) + i + 1]); // bottom
    e.push([i * (SUB + 1), (i + 1) * (SUB + 1)]); // left
    e.push([i * (SUB + 1) + SUB, (i + 1) * (SUB + 1) + SUB]); // right
  }
  return e;
})();

// the house: a gabled three-story outline, eaves at 1.5 (three 10-ft floors... drawn to the balloon's 33 ft at the ridge)
const HX0 = 1.75, HX1 = 3.65, EAVE = 1.5, RIDGE = 2.0, HZ = 0;
const HOUSE: number[][][] = [
  [[HX0, 0, HZ], [HX0, EAVE, HZ], [(HX0 + HX1) / 2, RIDGE, HZ], [HX1, EAVE, HZ], [HX1, 0, HZ]],
  [[HX0 - 0.08, EAVE - 0.04, HZ], [(HX0 + HX1) / 2, RIDGE + 0.05, HZ], [HX1 + 0.08, EAVE - 0.04, HZ]],
  [[HX0, 0.5, HZ], [HX1, 0.5, HZ]], [[HX0, 1.0, HZ], [HX1, 1.0, HZ]],
  ...[0.62, 1.12].flatMap((y) => [0.45, 1.3].map((x) => [[HX0 + x - 0.14, y, HZ], [HX0 + x + 0.14, y, HZ], [HX0 + x + 0.14, y + 0.26, HZ], [HX0 + x - 0.14, y + 0.26, HZ], [HX0 + x - 0.14, y, HZ]])),
  [[HX0 + 0.3, 0, HZ], [HX0 + 0.3, 0.36, HZ], [HX0 + 0.56, 0.36, HZ], [HX0 + 0.56, 0, HZ]],
  [[HX0 + 1.16, 0.12, HZ], [HX0 + 1.44, 0.12, HZ], [HX0 + 1.44, 0.38, HZ], [HX0 + 1.16, 0.38, HZ], [HX0 + 1.16, 0.12, HZ]],
];
const DIM_X = -1.45;
const DIM_V = [[DIM_X, 0, 0], [DIM_X, 2 * R, 0]];
const DIM_V_TICKS = new Float32Array([DIM_X - 0.12, 0, 0, DIM_X + 0.12, 0, 0, DIM_X - 0.12, 2 * R, 0, DIM_X + 0.12, 2 * R, 0]);
const DIM_H = [[-R, 2 * R + 0.28, 0], [R, 2 * R + 0.28, 0]];
const DIM_H_TICKS = new Float32Array([-R, 2 * R + 0.18, 0, -R, 2 * R + 0.38, 0, R, 2 * R + 0.18, 0, R, 2 * R + 0.38, 0]);
const GROUND = [[-4, 0, 0.0], [5.2, 0, 0.0]];

export type BalloonAssemblyProps = {at?: number; fillDur?: number; houseAt?: number; labels?: boolean};

export const BalloonAssembly: React.FC<BalloonAssemblyProps> = ({at = 0, fillDur = 150, houseAt, labels = true}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const hAt = houseAt ?? at + fillDur + 20;
  const FLY = 9;
  const tOf = (rank: number) => at + fillDur * Math.pow(rank / NPANEL, 0.85) - FLY;
  const kOf = (p: number) => ramp(f, tOf(ORDER[p]), tOf(ORDER[p]) + FLY);
  const count = Math.min(NPANEL, ORDER.filter((r) => g >= tOf(r) + FLY).length);
  const spin = -0.5 + 0.35 * ramp(f, at, at + fillDur + 40);

  const geo = useMemo(() => {
    const gg = new THREE.BufferGeometry();
    gg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(NPANEL * VPP * 3), 3));
    gg.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(NPANEL * VPP * 3), 3));
    gg.setIndex(INDEX);
    return gg;
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  const pos = geo.attributes.position.array as Float32Array, col = geo.attributes.color.array as Float32Array;
  const seams: number[] = [];
  for (let p = 0; p < NPANEL; p++) {
    const P = PANELS[p];
    const k = kOf(p);
    const kk = ease(k);
    const out = 1 + 0.9 * (1 - kk); // flies in from outside
    for (let v = 0; v < VPP; v++) {
      const o = (p * VPP + v) * 3;
      if (k <= 0) {
        pos[o] = 0; pos[o + 1] = CY; pos[o + 2] = 0; // collapsed at the centre: hidden inside
        continue;
      }
      const d = P.pts[v];
      // shrink toward the panel centre while flying, then sit on the sphere
      const x = lerp(P.c[0], d[0], 0.3 + 0.7 * kk), y = lerp(P.c[1], d[1], 0.3 + 0.7 * kk), z = lerp(P.c[2], d[2], 0.3 + 0.7 * kk);
      const n = Math.hypot(x, y, z);
      pos[o] = (x / n) * R * out; pos[o + 1] = (y / n) * R * out + CY; pos[o + 2] = (z / n) * R * out;
      col[o] = P.col.r; col[o + 1] = P.col.g; col[o + 2] = P.col.b;
    }
    if (k >= 1) for (const [a, b2] of EDGE_IDX) {
      const pa = P.pts[a], pb = P.pts[b2];
      seams.push(pa[0] * 1.003, pa[1] * 1.003 + CY, pa[2] * 1.003, pb[0] * 1.003, pb[1] * 1.003 + CY, pb[2] * 1.003);
    }
  }
  geo.attributes.position.needsUpdate = true;
  geo.attributes.color.needsUpdate = true;
  geo.computeVertexNormals();
  const seamPos = new Float32Array(seams);

  // camera: close on the sphere, then (at houseAt) easing back to take in the house
  const hk = ease(interpolate(f, [hAt - 6, hAt + 40], [0, 1], clamp));
  const drift = interpolate(f, [at, hAt], [0, 1], clamp);
  const c = useMemo(() => makeCam({target: [lerp(0, 1.15, hk), lerp(1.05, 1.05, hk), 0], dist: lerp(7.6 - 0.4 * drift, 10.6, hk), yaw: lerp(0.22, 0.1, hk), pitch: lerp(0.16, 0.1, hk), fov: 30}), [hk, drift]);
  const S2 = (p: readonly number[]) => project(c, p);
  const houseK = ramp(g, hAt + 6, hAt + 30);
  const houseParts = HOUSE.map((pts, i) => partOf(pts, Math.max(0, Math.min(1, houseK * HOUSE.length - i * 0.6))));
  const dimK = ramp(g, hAt + 24, hAt + 34);
  const gridO = 0.45 * ramp(g, at, at + 8) * (1 - ramp(g, at + fillDur + 4, at + fillDur + 20));
  const vLab = S2([DIM_X - 0.2, R, 0]), hLab = S2([0, 2 * R + 0.42, 0]), houseLab = S2([(HX0 + HX1) / 2, -0.1, 0]);

  return (
    <Stage
      over={<AbsoluteFill>
        {labels && <div style={{position: 'absolute', right: 120, top: 112, textAlign: 'right', opacity: ramp(g, at, at + 8), background: 'rgba(7,9,8,0.55)', padding: '8px 20px', borderRadius: 6}}>
          <div style={{fontFamily: JF.mono, fontSize: 22, letterSpacing: 4, color: CREAM}}>PAPER PANELS</div>
          <div style={{fontFamily: JF.display, fontSize: 110, lineHeight: 1.05, color: CREAM, textShadow: '0 4px 18px rgba(0,0,0,0.9)'}}>{count.toLocaleString('en-US')}</div>
        </div>}
        {labels && dimK > 0 && <>
          <Label x={vLab.x - 20} y={vLab.y + 20} anchor="r" text="33 FT" opacity={dimK} size={26} />
          <Label x={hLab.x} y={hLab.y} text="33 FEET ACROSS" opacity={dimK} size={24} />
          <Label x={houseLab.x} y={houseLab.y + 56} text="A THREE-STORY HOUSE" opacity={ramp(g, hAt + 30, hAt + 38)} size={22} />
        </>}
        <Fine text="ABOUT 600 PANELS OF PAPER · PANEL LAYOUT DRAWN, NOT THE CUTTING PATTERN" opacity={0.7 * ramp(g, at, at + 8)} />
      </AbsoluteFill>}
    >
      <SyncCam cam={c} />
      <ambientLight intensity={1.0} />
      <directionalLight position={[-3, 6, 5]} intensity={1.3} />
      <ContactShadow y={0.001} w={3.2} d={2.2} opacity={0.8} />
      <Poly pts={GROUND} color={TEAL} width={1.8} opacity={0.55 * ramp(g, at, at + 10)} />
      <group rotation={[0, spin, 0]} position={[0, 0, 0]}>
        <Segs pos={GRID} color={TEAL} width={1.2} opacity={gridO} />
        <mesh geometry={geo}>
          <meshLambertMaterial vertexColors emissive="#5a1d16" side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
        </mesh>
        <DynSegs cap={NPANEL * EDGE_IDX.length} pos={seamPos} color={DARK} width={1.2} opacity={0.9} />
      </group>
      {/* scale: the house and the dimensions */}
      {houseParts.map((pts, i) => pts.length > 1 && <Poly key={i} pts={pts} color={CREAM} width={i < 2 ? 2.6 : 1.8} opacity={i < 2 ? 0.95 : 0.7} />)}
      {dimK > 0 && <>
        <Poly pts={DIM_V} color={CREAM} width={2} opacity={dimK} />
        <Segs pos={DIM_V_TICKS} color={CREAM} width={2} opacity={dimK} />
        <Poly pts={DIM_H} color={CREAM} width={2} opacity={dimK} />
        <Segs pos={DIM_H_TICKS} color={CREAM} width={2} opacity={dimK} />
        <Poly pts={[[HX1 + 0.35, 0, 0], [HX1 + 0.35, RIDGE, 0]]} color={CREAM} width={1.4} opacity={0.5 * dimK} dashed dash={0.06} gap={0.05} />
        <Poly pts={[[R + 0.05, 2 * R, 0], [HX1 + 0.45, RIDGE, 0]]} color={CREAM} width={1.2} opacity={0.4 * dimK} dashed dash={0.06} gap={0.05} />
      </>}
    </Stage>
  );
};

// ---------------------------------------------------------------- test composition
export const BALLOON_ASSEMBLY_TEST_FRAMES = 300;
export const BalloonAssemblyTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <BalloonAssembly at={10} fillDur={150} houseAt={190} />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
