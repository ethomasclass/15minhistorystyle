// SandToBeach (ch06): "Under a microscope... tiny shells... one thing was missing: coral" → "narrowed it down to a few stretches
// of coastline... in Japan". Opens under a microscope ring on drawn sand grains (dark low-poly stones with teal edges) and tiny
// shells (cream: coiled foraminifera, ribbed diatom discs) around an empty dashed slot labelled CORAL?. Then one continuous
// pull-out (log-distance camera) up off the beach to the Boso peninsula, Chiba, as a real-elevation slab (AWS Terrarium tiles,
// public/data/chiba_hm.json; 25 m contours, heights ×10), and the Ichinomiya stretch of the coast lights coral.
// Grains and shells are illustrative, not to scale (said on screen).
//
// Props (frames in the parent's time):
//   at        the microscope view (grains, shells)                           default 0
//   slotAt    the empty CORAL? slot draws, handwritten "none"                 default at + 40
//   pullAt    the camera pulls out to the coast (`pullDur` frames)            default at + 110
//   pullDur                                                                    default 120
//   beachAt   the Ichinomiya stretch lights coral + its label                  default pullAt + pullDur - 10
//   labels    place labels                                                     default true
// Exports: SandToBeach, SandToBeachTest, SAND_TO_BEACH_TEST_FRAMES.
import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {PALETTES, PaletteCtx, StepCtx, useGFrame} from '../kit/Kit';
import chibaJson from '../../public/data/chiba_hm.json';
import {clamp, CORAL, CREAM, ease, Fine, GroundGlow, Hand, Label, lerp, makeCam, Poly, project, ramp, rng, Segs, Stage, SyncCam, TEAL} from './kit3d';
import {buildTerrain, type HM, TerrainSlab} from './terrain';

const HMC = chibaJson as unknown as HM;
const EXAG = 10;
const T = buildTerrain(HMC, 10, EXAG, 25, 4, 0.004, true);

/** The coast at a latitude: the easternmost land cell on that row (Kujukuri / Ichinomiya face east). */
const coastAt = (lat: number): [number, number] => {
  const {w, h, data, bounds} = HMC;
  const j = Math.round(((bounds.lat1 - lat) / (bounds.lat1 - bounds.lat0)) * (h - 1));
  let i = w - 1;
  while (i > 0 && data[j * w + i] <= 0) i--;
  const lon = bounds.lon0 + ((i + 0.5) / (w - 1)) * (bounds.lon1 - bounds.lon0);
  return T.toWorld(lat, lon);
};
const BEACH = coastAt(35.372);
const C0: [number, number, number] = [BEACH[0] - 0.05, T.heightAt(BEACH[0] - 0.05, BEACH[1]), BEACH[1]]; // the grain field, just inland of the waterline
const CENTRE: [number, number, number] = [0.25, 0, 0.35];

// the Ichinomiya stretch: the 0 m contour between 35.33 and 35.42 N on the east-facing coast, ordered south → north
const STRETCH = (() => {
  const c = T.contours[0].pos;
  const zN = T.toWorld(35.43, 140.4)[1], zS = T.toWorld(35.32, 140.4)[1];
  const lat = (z: number) => HMC.bounds.lat1 - (z / T.depth + 0.5) * (HMC.bounds.lat1 - HMC.bounds.lat0);
  const onShore = (x: number, z: number) => Math.abs(x - coastAt(lat(z))[0]) < 0.07; // the open shore, not ponds or rivers inland
  const segs: number[][] = [];
  for (let k = 0; k < c.length; k += 6) {
    const z0 = c[k + 2], z1 = c[k + 5];
    if (z0 < zN || z0 > zS || z1 < zN || z1 > zS || !onShore(c[k], z0) || !onShore(c[k + 3], z1)) continue;
    segs.push([c[k], c[k + 1] + 0.004, c[k + 2], c[k + 3], c[k + 4] + 0.004, c[k + 5]]);
  }
  segs.sort((a, b) => (b[2] + b[5]) - (a[2] + a[5])); // south (larger z) first
  return segs;
})();

// ───────────── the microscope field (module load, seeded) ─────────────
const R = rng(606);
const ROCKS = Array.from({length: 7}, (_, v) => {
  const g = new THREE.IcosahedronGeometry(1, v % 3 === 0 ? 1 : 0);
  const p = g.attributes.position as THREE.BufferAttribute;
  const RR = rng(90 + v);
  const seen = new Map<string, number>();
  for (let i = 0; i < p.count; i++) {
    const key = `${p.getX(i).toFixed(3)},${p.getY(i).toFixed(3)},${p.getZ(i).toFixed(3)}`;
    if (!seen.has(key)) seen.set(key, 0.72 + RR() * 0.45);
    const s = seen.get(key)!;
    p.setXYZ(i, p.getX(i) * s, p.getY(i) * s * 0.8, p.getZ(i) * s);
  }
  g.computeVertexNormals();
  return {fill: g, edges: new Float32Array(new THREE.EdgesGeometry(g, 1).attributes.position.array)};
});
const FIELD_R = 0.034;
const SLOT: [number, number] = [0.006, -0.002]; // offset of the empty coral slot from the field centre
const SLOT_R = 0.0072;
type Grain = {x: number; z: number; s: number; v: number; rot: [number, number, number]; sx: number; fill: string};
const FILLS = ['#2b2a25', '#23272a', '#30291f', '#1f2421', '#383430'];
const GRAINS: Grain[] = [];
for (let tries = 0; tries < 6000 && GRAINS.length < 70; tries++) {
  const a = R() * Math.PI * 2, d = Math.sqrt(R()) * FIELD_R;
  const x = Math.cos(a) * d, z = Math.sin(a) * d * 0.8;
  const s = 0.0018 + R() * 0.0024;
  if (Math.hypot(x - SLOT[0], z - SLOT[1]) < SLOT_R + s) continue;
  if (GRAINS.some((g) => Math.hypot(g.x - x, g.z - z) < (g.s + s) * 0.95)) continue;
  GRAINS.push({x, z, s, v: Math.floor(R() * ROCKS.length), rot: [R() * 6, R() * 6, R() * 6], sx: 0.8 + R() * 0.5, fill: FILLS[Math.floor(R() * FILLS.length)]});
}
// shells: three coiled foraminifera, three diatom discs (placed in gaps)
const SHELLS: {x: number; z: number; kind: 'fora' | 'diatom'; s: number; rot: number}[] = [
  {x: -0.016, z: -0.006, kind: 'fora', s: 0.0042, rot: 0.4}, {x: 0.02, z: 0.012, kind: 'fora', s: 0.0036, rot: 2.1}, {x: -0.004, z: 0.016, kind: 'fora', s: 0.003, rot: 4},
  {x: -0.022, z: 0.01, kind: 'diatom', s: 0.0038, rot: 0}, {x: 0.018, z: -0.014, kind: 'diatom', s: 0.003, rot: 1}, {x: -0.006, z: -0.019, kind: 'diatom', s: 0.0026, rot: 2},
];
// clear grains away from the shells
const GR = GRAINS.filter((g) => SHELLS.every((s) => Math.hypot(g.x - s.x, g.z - s.z) > g.s + s.s * 1.7));

const ROCK_MATS = new Map<string, THREE.MeshLambertMaterial>();
const rockMat = (c: string) => {
  if (!ROCK_MATS.has(c)) ROCK_MATS.set(c, new THREE.MeshLambertMaterial({color: c, flatShading: true, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1, transparent: true}));
  return ROCK_MATS.get(c)!;
};
const BALL = new THREE.SphereGeometry(1, 14, 10);
const DISC = new THREE.CylinderGeometry(1, 1, 0.28, 24);
const DISC_LINES = (() => {
  const out: number[] = [];
  for (let k = 0; k < 24; k++) {
    const a0 = (k / 24) * Math.PI * 2, a1 = ((k + 1) / 24) * Math.PI * 2;
    out.push(Math.cos(a0), 0.15, Math.sin(a0), Math.cos(a1), 0.15, Math.sin(a1));
    out.push(Math.cos(a0) * 0.62, 0.15, Math.sin(a0) * 0.62, Math.cos(a1) * 0.62, 0.15, Math.sin(a1) * 0.62);
  }
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2;
    out.push(Math.cos(a) * 0.62, 0.15, Math.sin(a) * 0.62, Math.cos(a), 0.15, Math.sin(a));
  }
  return new Float32Array(out);
})();
const SLOT_RING = Array.from({length: 49}, (_, i) => [Math.cos((i / 48) * Math.PI * 2) * SLOT_R, 0, Math.sin((i / 48) * Math.PI * 2) * SLOT_R * 0.92]);

const Field: React.FC<{o: number; g: number; at: number}> = ({o, g, at}) => {
  if (o <= 0.01) return null;
  return (
    <group position={C0}>
      {GR.map((gr, i) => {
        const k = ramp(g, at + (i % 12) * 1.5, at + (i % 12) * 1.5 + 6);
        if (k <= 0) return null;
        const r = ROCKS[gr.v];
        const m = rockMat(gr.fill);
        m.opacity = o;
        return (
          <group key={i} position={[gr.x, gr.s * 0.55, gr.z]} rotation={gr.rot} scale={[gr.s * gr.sx * k, gr.s * k, gr.s * k]}>
            <mesh geometry={r.fill} material={m} />
            <Segs pos={r.edges} color={TEAL} width={1.6} opacity={0.75 * o} />
          </group>
        );
      })}
      {SHELLS.map((s, i) => {
        const k = ramp(g, at + 14 + i * 3, at + 22 + i * 3);
        if (k <= 0) return null;
        if (s.kind === 'diatom') return (
          <group key={`s${i}`} position={[s.x, s.s * 0.2, s.z]} rotation={[0.25, s.rot, 0.1]} scale={s.s * k}>
            <mesh geometry={DISC}><meshLambertMaterial color="#2c2b27" transparent opacity={o} /></mesh>
            <Segs pos={DISC_LINES} color={CREAM} width={1.5} opacity={0.85 * o} />
          </group>
        );
        // a coiled foraminifer: chambers growing along a spiral
        return (
          <group key={`s${i}`} position={[s.x, s.s * 0.45, s.z]} rotation={[0, s.rot, 0]} scale={s.s * k}>
            {Array.from({length: 7}).map((_, c) => {
              const a = c * 0.95, rr = 0.25 + c * 0.11, cs = 0.22 + c * 0.07;
              return (
                <mesh key={c} geometry={BALL} position={[Math.cos(a) * rr, 0, Math.sin(a) * rr]} scale={cs}>
                  <meshLambertMaterial color="#d9d2c4" emissive="#3a362f" transparent opacity={o} />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
};

export type SandToBeachProps = {at?: number; slotAt?: number; pullAt?: number; pullDur?: number; beachAt?: number; labels?: boolean};

export const SandToBeach: React.FC<SandToBeachProps> = ({at = 0, slotAt, pullAt, pullDur = 120, beachAt, labels = true}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const sAt = slotAt ?? at + 40;
  const pAt = pullAt ?? at + 110;
  const bAt = beachAt ?? pAt + pullDur - 10;

  // camera: a slow drift over the grains, then one pull-out (distance eased geometrically; the target slides to the slab
  // centre in step with the distance so the beach never leaves the frame)
  const D0 = 0.115, D1 = 16;
  const pk = ease(interpolate(f, [pAt, pAt + pullDur], [0, 1], clamp));
  const drift = interpolate(f, [at, pAt], [0, 1], clamp);
  const dist = Math.exp(lerp(Math.log(D0 * (1 - 0.08 * drift)), Math.log(D1), pk));
  const tk = (dist - D0) / (D1 - D0);
  const target: [number, number, number] = [lerp(C0[0], CENTRE[0], tk), lerp(C0[1], CENTRE[1], tk), lerp(C0[2], CENTRE[2], tk)];
  const cam = useMemo(() => makeCam({target, dist, yaw: lerp(0.35 + 0.08 * drift, 0.12, pk), pitch: lerp(1.0, 0.86, pk), fov: 30}), [target[0], target[2], dist, drift, pk]);
  const S2 = (p: readonly number[]) => project(cam, p);

  const fieldO = 1 - interpolate(dist, [0.5, 2.2], [0, 1], clamp);
  const scope = 1 - ramp(f, pAt, pAt + pullDur * 0.3);
  const slotK = ramp(g, sAt, sAt + 10);
  const beachK = ramp(g, bAt, bAt + 18);
  const nStretch = Math.round(STRETCH.length * beachK);
  const stretchPos = useMemo(() => new Float32Array(STRETCH.slice(0, nStretch).flat()), [nStretch]);
  const mid = STRETCH.length ? STRETCH[Math.floor(STRETCH.length / 2)] : [BEACH[0], 0, BEACH[1]];
  const slotScr = S2([C0[0] + SLOT[0], C0[1], C0[2] + SLOT[1] - SLOT_R]);
  const mapO = ramp(f, pAt + pullDur * 0.55, pAt + pullDur * 0.8);
  const L = (lat: number, lon: number) => {
    const [x, z] = T.toWorld(lat, lon);
    return S2([x, T.heightAt(x, z) + 0.02, z]);
  };
  const ich = S2([mid[0], 0.03, mid[2]]);
  const chiba = L(35.62, 140.25), bay = L(35.48, 139.86), pac = L(35.08, 140.68);

  return (
    <Stage
      over={<AbsoluteFill>
        {/* the microscope ring */}
        {scope > 0.01 && <AbsoluteFill style={{opacity: scope, background: 'radial-gradient(circle 500px at 960px 540px, transparent 93%, rgba(4,5,5,0.97) 100%)'}}>
          <div style={{position: 'absolute', left: 460, top: 40, width: 1000, height: 1000, borderRadius: '50%', border: `3px solid rgba(47,224,196,0.55)`}} />
        </AbsoluteFill>}
        {labels && scope > 0.01 && <>
          <Label x={300} y={260} text="SAND GRAINS" opacity={ramp(g, at + 12, at + 18) * scope} size={22} />
          <Label x={1620} y={300} text="TINY SHELLS" opacity={ramp(g, at + 28, at + 34) * scope} size={22} />
        </>}
        {slotK > 0 && scope > 0.01 && <>
          <Label x={slotScr.x} y={slotScr.y - 12} text="CORAL?" color={CREAM} opacity={slotK * scope} size={26} />
          {scope > 0.6 && <Hand f={g} text="none" x={slotScr.x + 90} y={slotScr.y - 20} at={sAt + 14} size={60} rot={-6} />}
        </>}
        {labels && mapO > 0 && <>
          <Label x={chiba.x} y={chiba.y} text="CHIBA" opacity={mapO * 0.95} size={24} bg={false} />
          <Label x={bay.x} y={bay.y} text="TOKYO BAY" opacity={mapO * 0.85} size={20} bg={false} />
          <Label x={pac.x} y={pac.y} text="PACIFIC OCEAN" opacity={mapO * 0.85} size={22} bg={false} />
        </>}
        {labels && beachK > 0 && <Label x={ich.x + 30} y={ich.y - 30} anchor="l" text="ICHINOMIYA" sub="THE BEACH THE SAND CAME FROM" color={CORAL} opacity={ramp(g, bAt + 10, bAt + 16)} size={24} />}
        <Fine text={mapO > 0.5 ? `ELEVATION: AWS TERRARIUM TILES · HEIGHTS EXAGGERATED ×${EXAG} · 25 M CONTOURS` : 'GRAINS AND SHELLS DRAWN FOR ILLUSTRATION · NOT TO SCALE'}
          opacity={0.7 * (mapO > 0.5 ? mapO : scope)} />
      </AbsoluteFill>}
    >
      <SyncCam cam={cam} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[-4, 9, 5]} intensity={1.7} />
      <TerrainSlab T={T} lines={ramp(f, pAt + pullDur * 0.25, pAt + pullDur * 0.7)} />
      <Field o={fieldO} g={g} at={at} />
      {slotK > 0 && fieldO > 0.01 && (
        <group position={[C0[0] + SLOT[0], C0[1] + 0.0004, C0[2] + SLOT[1]]}>
          <Poly pts={SLOT_RING.slice(0, Math.max(2, Math.round(49 * slotK)))} color={CREAM} width={2.4} opacity={0.9 * fieldO} dashed dash={0.0012} gap={0.0009} />
        </group>
      )}
      {nStretch > 0 && <>
        <Segs pos={stretchPos} color={CORAL} width={6} />
        <GroundGlow pos={[mid[0], 0.02, mid[2]]} r={0.9} color={CORAL} opacity={0.5 * beachK} />
      </>}
    </Stage>
  );
};

// ---------------------------------------------------------------- test composition
export const SAND_TO_BEACH_TEST_FRAMES = 330;
export const SandToBeachTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <SandToBeach at={0} slotAt={45} pullAt={120} pullDur={130} />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
