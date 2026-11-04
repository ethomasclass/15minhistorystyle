// GearhartTerrain (ch08, heavy; ch09 reprise): the real ground around Gearhart Mountain near Bly, Oregon, as a teal-contour
// slab (AWS Terrarium tiles, public/data/gearhart_hm.json; 40 m contours, heights ×4). Quiet: a slow camera, no figures, no
// blast, no coral. ONE small cream marker stands at the Mitchell Monument (42.4316 N, 120.8608 W per OpenStreetMap/GNIS; the
// site where the six died, about 10 miles east-northeast of the town of Bly). The ch09 variant pulls back south to the Tule
// Lake camp at Newell, California (41.888 N, 121.375 W) with a dashed line and its straight-line distance (≈ 46 miles; the
// narration's "about fifty miles"), and the Oregon–California line at 42° N.
//
// Props (frames in the parent's time):
//   at          contours draw on; the camera starts its slow drift          default 0
//   markerAt    the cream marker rises at the monument (slowly)            default at + 50
//   pullBackAt  (variant) pull back to show Tule Lake + the dashed line     default off
//   labels      place labels                                               default true
// Exports: GearhartTerrain, GearhartTerrainTest, GearhartTuleTest, GEARHART_TEST_FRAMES, GEARHART_TULE_TEST_FRAMES.
import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {PALETTES, PaletteCtx, StepCtx, useGFrame} from '../kit/Kit';
import gearJson from '../../public/data/gearhart_hm.json';
import {clamp, CREAM, ease, Fine, GroundGlow, Label, lerp, makeCam, partOf, Poly, project, ramp, Stage, SyncCam} from './kit3d';
import {buildTerrain, type HM, type Terrain, TerrainSlab} from './terrain';

const HMG = gearJson as unknown as HM;
const EXAG = 4;
const T = buildTerrain(HMG, 10, EXAG, 40, 5, 0.004, false);

const drape = (Tr: Terrain, pts: [number, number][], step = 0.03, lift = 0.012): number[][] => {
  const out: number[][] = [];
  for (let k = 0; k < pts.length - 1; k++) {
    const [ax, az] = pts[k], [bx, bz] = pts[k + 1];
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / step));
    for (let s = 0; s < n; s++) {
      const x = ax + ((bx - ax) * s) / n, z = az + ((bz - az) * s) / n;
      out.push([x, Tr.heightAt(x, z) + lift, z]);
    }
  }
  const [lx, lz] = pts[pts.length - 1];
  out.push([lx, Tr.heightAt(lx, lz) + lift, lz]);
  return out;
};
const W2 = (lat: number, lon: number) => T.toWorld(lat, lon);
const g3 = ([x, z]: [number, number], lift = 0): [number, number, number] => [x, T.heightAt(x, z) + lift, z];

const MONUMENT = W2(42.4316, -120.8608);
const PEAK = W2(42.4960, -120.8773);
const BLY = W2(42.3982, -121.0411);
const TULE = W2(41.888, -121.375);
const MILES = (() => {
  const r = Math.PI / 180, a = [42.4316, -120.8608], b = [41.888, -121.375];
  const h = Math.sin(((b[0] - a[0]) * r) / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(((b[1] - a[1]) * r) / 2) ** 2;
  return Math.round(2 * 6371 * Math.asin(Math.sqrt(h)) * 0.621371);
})();
const LINE = drape(T, [MONUMENT, TULE], 0.04, 0.03);
const STATE = drape(T, [W2(42, -121.5), W2(42, -120.7)], 0.05, 0.015);
const MK_H = 0.32;

export type GearhartTerrainProps = {at?: number; markerAt?: number; pullBackAt?: number; labels?: boolean};

export const GearhartTerrain: React.FC<GearhartTerrainProps> = ({at = 0, markerAt, pullBackAt = 1e9, labels = true}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const mAt = markerAt ?? at + 50;

  // slow camera: a long gentle drift around the monument; the variant pulls back (one move) to take in Tule Lake
  const drift = interpolate(f, [at, at + 600], [0, 1], clamp);
  const pk = ease(interpolate(f, [pullBackAt, pullBackAt + 90], [0, 1], clamp));
  const close = {x: MONUMENT[0] - 0.25, z: MONUMENT[1] + 0.35};
  const wideT = {x: (MONUMENT[0] + TULE[0]) / 2 + 0.3, z: (MONUMENT[1] + TULE[1]) / 2 + 1.1};
  const c = useMemo(() => makeCam({
    target: [lerp(close.x, wideT.x, pk), 0.25, lerp(close.z, wideT.z, pk)],
    dist: lerp(6.2 - 0.6 * drift, 22.5, pk), yaw: lerp(-0.35 + 0.22 * drift, -0.1, pk), pitch: lerp(0.62, 1.0, pk), fov: 30,
  }), [drift, pk]);
  const S2 = (p: readonly number[]) => project(c, p);

  const reveal = ramp(g, at, at + 45);
  const mk = ease(ramp(f, mAt, mAt + 30));
  const lineK = ramp(g, pullBackAt + 70, pullBackAt + 100);
  const linePart = useMemo(() => partOf(LINE, lineK), [lineK]);
  const tuleK = ramp(g, pullBackAt + 96, pullBackAt + 104);

  const mon = S2(g3(MONUMENT, MK_H * mk + 0.06));
  const peak = S2(g3(PEAK, 0.05)), bly = S2(g3(BLY, 0.02)), tule = S2(g3(TULE, 0.03));
  const mid = S2(LINE[Math.floor(LINE.length * 0.55)]);
  const or = S2(g3(W2(42.06, -120.84), 0.02)), ca = S2(g3(W2(41.94, -120.84), 0.02));
  const closeO = 1 - pk;

  return (
    <Stage
      over={<AbsoluteFill>
        {labels && <>
          <Label x={peak.x} y={peak.y - 16} text="GEARHART MOUNTAIN" opacity={ramp(g, at + 30, at + 40) * closeO * 0.9} size={20} bg={false} />
          <Label x={bly.x} y={bly.y - 12} text="BLY" opacity={ramp(g, at + 36, at + 46)} size={22} bg={false} />
          <Label x={mon.x} y={mon.y - 16} text="MITCHELL MONUMENT" sub="5 MAY 1945" opacity={ramp(g, mAt + 30, mAt + 40) * (1 - 0.4 * pk)} size={22} />
          {tuleK > 0 && <Label x={tule.x} y={tule.y - 14} text="TULE LAKE CAMP" sub="NEWELL, CALIFORNIA" opacity={tuleK} size={22} />}
          {lineK > 0.6 && <Label x={mid.x + 24} y={mid.y} anchor="l" text={`≈ ${MILES} MILES`} opacity={ramp(g, pullBackAt + 100, pullBackAt + 108)} size={24} />}
          {pk > 0.5 && <>
            <Label x={or.x + 120} y={or.y - 4} text="OREGON" opacity={(pk - 0.5) * 1.4} size={18} bg={false} />
            <Label x={ca.x + 120} y={ca.y + 26} text="CALIFORNIA" opacity={(pk - 0.5) * 1.4} size={18} bg={false} />
          </>}
        </>}
        <Fine text={`ELEVATION: AWS TERRARIUM TILES · HEIGHTS EXAGGERATED ×${EXAG} · 40 M CONTOURS${pk > 0.5 ? ' · STRAIGHT-LINE DISTANCE' : ''}`} opacity={0.7 * reveal} />
      </AbsoluteFill>}
    >
      <SyncCam cam={c} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[-5, 8, 4]} intensity={1.6} />
      <TerrainSlab T={T} reveal={reveal} contourW={1.05} indexW={2} land="#141b18" />
      {pk > 0 && <Poly pts={STATE} color={CREAM} width={1.4} opacity={0.4 * pk} dashed dash={0.08} gap={0.07} />}
      {mk > 0 && <>
        <Poly pts={[g3(MONUMENT, 0.01), g3(MONUMENT, MK_H * mk)]} color={CREAM} width={2.2} opacity={0.9} />
        <mesh position={g3(MONUMENT, MK_H * mk)}><sphereGeometry args={[0.04, 16, 12]} /><meshBasicMaterial color={CREAM} /></mesh>
        <GroundGlow pos={g3(MONUMENT, 0.02)} r={0.35} color={CREAM} opacity={0.22 * mk} />
      </>}
      {lineK > 0 && <Poly pts={linePart} color={CREAM} width={2.4} opacity={0.85} dashed dash={0.1} gap={0.08} />}
      {tuleK > 0 && <mesh position={g3(TULE, 0.05)}><sphereGeometry args={[0.05, 16, 12]} /><meshBasicMaterial color={CREAM} transparent opacity={tuleK} /></mesh>}
    </Stage>
  );
};

// ---------------------------------------------------------------- test compositions
export const GEARHART_TEST_FRAMES = 300;
export const GearhartTerrainTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.quiet}>
    <StepCtx.Provider value={2.5}>
      <GearhartTerrain at={0} markerAt={60} />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
export const GEARHART_TULE_TEST_FRAMES = 300;
export const GearhartTuleTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <GearhartTerrain at={0} markerAt={20} pullBackAt={90} />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
