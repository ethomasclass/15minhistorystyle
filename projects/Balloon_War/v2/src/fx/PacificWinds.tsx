// PacificWinds (ch02, ch06 reprise): the North Pacific as a tilted map slab, Japan left and North America right (Natural Earth
// 1:50m coastlines), the jet stream as ~2,400 flowing teal streaks driven by REAL winds: NOAA-CIRES-DOE 20th Century
// Reanalysis v3, January 1945 monthly mean, 250 hPa (≈ 34,000 ft) u/v (public/data/pacific_winds.json, see its .md). A coral
// balloon rises off Ichinomiya and rides the stream; its path is integrated through the same January 1945 field and makes
// landfall on the Oregon coast. A "too far" view: no winds, a dashed great-circle line Tokyo → Seattle with its length.
// Streaks are a pure function of the frame (paths baked at module load from a seeded RNG, each streak's age = frame + phase).
//
// Props (frames in the parent's time; leave a beat out to skip it):
//   at         the map and coastlines draw on                              default 0
//   windsAt    the winds switch on, west to east (~1 s)                    default off
//   windsOut   the winds fade out                                          default never
//   tooFarAt   dashed line Tokyo → Seattle draws (~1 s), "≈ 4,800 MILES", handwritten "too far"   default off
//   tooFarOut  the too-far line and note fade                              default windsAt
//   balloonAt  the coral balloon rises off Ichinomiya (Chiba)              default off
//   routeAt    the balloon rides the stream to America, its track drawing   default balloonAt + 24
//   routeDur   frames for the crossing                                     default 210
//   labels     place labels (JAPAN, NORTH AMERICA, PACIFIC OCEAN, JET STREAM)   default true
//   cam        camera keys (CamKey[], raw frames) to override the default slow push-in
// Exports: PacificWinds, PacificWindsTest, PACIFIC_WINDS_TEST_FRAMES, pacificPoint(lon, lat).
import React, {useEffect, useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {LineSegments2} from 'three/examples/jsm/lines/LineSegments2.js';
import {LineSegmentsGeometry} from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial.js';
import {PALETTES, PaletteCtx, StepCtx, useGFrame} from '../kit/Kit';
import windJson from '../../public/data/pacific_winds.json';
import {along, Balloon, type CamKey, camAt, clamp, CREAM, Fine, GroundGlow, H as HH, Hand, Label, makeCam, MapSlab, partOf, Poly, project, ramp, rng, Stage, SyncCam, TEAL, W as WW} from './kit3d';
import {type BBox, gcKm, greatCircle, MapTop, type Proj} from './mapgeo';

type WindData = {month: string; level_hPa: number; lat0: number; lon0: number; dlat: number; dlon: number; nlat: number; nlon: number; u: number[]; v: number[]; coast: number[][][]};
const WD = windJson as unknown as WindData;

// ───────────── projection: equirectangular, x squeezed by cos 40°; lon in 0..360 ─────────────
const B: BBox = [118, 12, 252, 68];
const S = 0.165;
const KX = S * Math.cos((40 * Math.PI) / 180);
const P: Proj = (lon, lat) => [(lon - 185) * KX, -(lat - 40) * S];
const MW = (B[2] - B[0]) * KX, MD = (B[3] - B[1]) * S;
/** World point on the map at height y. */
export const pacificPoint = (lon: number, lat: number, y = 0): [number, number, number] => {
  const [x, z] = P(lon < 0 ? lon + 360 : lon, lat);
  return [x, y, z];
};
const LAYER = 0.16; // the wind layer floats just above the map

// ───────────── the wind field ─────────────
const U = Float32Array.from(WD.u), V = Float32Array.from(WD.v);
const wind = (lon: number, lat: number): [number, number] => {
  const fi = Math.max(0, Math.min(WD.nlon - 1.001, (lon - WD.lon0) / WD.dlon));
  const fj = Math.max(0, Math.min(WD.nlat - 1.001, (lat - WD.lat0) / WD.dlat));
  const i = Math.floor(fi), j = Math.floor(fj), a = fi - i, b = fj - j;
  const k = j * WD.nlon + i, n = WD.nlon;
  const s = (A: Float32Array) => A[k] * (1 - a) * (1 - b) + A[k + 1] * a * (1 - b) + A[k + n] * (1 - a) * b + A[k + n + 1] * a * b;
  return [s(U), s(V)];
};
const DEG = 111320;
/** One step of `dt` seconds (midpoint rule) in degrees. */
const advect = (lon: number, lat: number, dt: number): [number, number] => {
  const [u0, v0] = wind(lon, lat);
  const mlon = lon + (u0 * dt * 0.5) / (DEG * Math.cos((lat * Math.PI) / 180)), mlat = lat + (v0 * dt * 0.5) / DEG;
  const [u1, v1] = wind(mlon, mlat);
  return [lon + (u1 * dt) / (DEG * Math.cos((mlat * Math.PI) / 180)), lat + (v1 * dt) / DEG];
};

// ───────────── streak pool (baked once) ─────────────
const N = 2400, LIFE = 66, TR = 9, POOL = 4800, STEPS = LIFE + 1, DT = 720; // DT seconds of real wind per frame
const POOL_LL = new Float32Array(POOL * STEPS * 2);
const POOL_SP = new Float32Array(POOL * STEPS);
(() => {
  const R = rng(1945);
  let n = 0;
  while (n < POOL) {
    const lon = B[0] + 2 + R() * (B[2] - B[0] - 4), lat = B[1] + 2 + R() * (B[3] - B[1] - 4);
    const [u, v] = wind(lon, lat);
    const sp = Math.hypot(u, v);
    if (R() > 0.1 + 0.9 * Math.pow(Math.min(1, sp / 70), 1.4)) continue;
    let lo = lon, la = lat;
    for (let s = 0; s < STEPS; s++) {
      const o = (n * STEPS + s);
      POOL_LL[o * 2] = lo;
      POOL_LL[o * 2 + 1] = la;
      const [uu, vv] = wind(lo, la);
      POOL_SP[o] = lo < B[0] || lo > B[2] || la < B[1] || la > B[3] ? -1 : Math.hypot(uu, vv);
      [lo, la] = advect(lo, la, DT);
    }
    n++;
  }
})();
const PHASE = (() => {
  const R = rng(311);
  return Array.from({length: N}, () => Math.floor(R() * LIFE * 7));
})();
const TEAL_RGB = new THREE.Color(TEAL);

/** The streaks: one persistent LineSegments2 whose buffers are rewritten each frame. */
const Streaks: React.FC<{f: number; k: number; sweepAt: number}> = ({f, k, sweepAt}) => {
  const obj = useMemo(() => {
    const g = new LineSegmentsGeometry();
    g.setPositions(new Float32Array(N * TR * 6));
    g.setColors(new Float32Array(N * TR * 6));
    const m = new LineMaterial({color: 0xffffff, linewidth: 2.1, worldUnits: false, transparent: true, vertexColors: true});
    m.resolution.set(WW, HH);
    m.blending = THREE.AdditiveBlending;
    m.depthWrite = false;
    const l = new LineSegments2(g, m);
    l.frustumCulled = false;
    l.renderOrder = 3;
    return l;
  }, []);
  useEffect(() => () => {
    obj.geometry.dispose();
    (obj.material as LineMaterial).dispose();
  }, [obj]);
  const g = obj.geometry as LineSegmentsGeometry;
  const posBuf = (g.attributes.instanceStart as THREE.InterleavedBufferAttribute).data;
  const colBuf = (g.attributes.instanceColorStart as THREE.InterleavedBufferAttribute).data;
  const pos = posBuf.array as Float32Array, col = colBuf.array as Float32Array;
  for (let i = 0; i < N; i++) {
    const t = f + PHASE[i];
    const cycle = Math.floor(t / LIFE), age = t - cycle * LIFE;
    const p = (i + cycle * 2731) % POOL;
    const fade = Math.min(1, age / 10, (LIFE - age) / 12);
    for (let j = 0; j < TR; j++) {
      const s0 = Math.max(0, age - TR + j), s1 = Math.max(0, age - TR + j + 1);
      const o0 = p * STEPS + s0, o1 = p * STEPS + s1;
      const [x0, z0] = P(POOL_LL[o0 * 2], POOL_LL[o0 * 2 + 1]);
      const [x1, z1] = P(POOL_LL[o1 * 2], POOL_LL[o1 * 2 + 1]);
      const sp = POOL_SP[o1];
      const sweep = interpolate(f, [sweepAt + (POOL_LL[o1 * 2] - B[0]) * 0.22, sweepAt + (POOL_LL[o1 * 2] - B[0]) * 0.22 + 14], [0, 1], clamp);
      const b = sp < 0 || POOL_SP[o0] < 0 ? 0 : k * sweep * fade * (0.12 + 0.88 * Math.min(1, sp / 72)) * ((j + 1) / TR) ** 1.3;
      const q = (i * TR + j) * 6;
      if (b < 0.004) { // nothing to add: park it off screen (additive black would still write alpha over the desk)
        pos[q] = 1e5; pos[q + 1] = 0; pos[q + 2] = 0; pos[q + 3] = 1e5; pos[q + 4] = 0; pos[q + 5] = 0.001;
        col[q] = col[q + 1] = col[q + 2] = col[q + 3] = col[q + 4] = col[q + 5] = 0;
        continue;
      }
      pos[q] = x0; pos[q + 1] = LAYER; pos[q + 2] = z0; pos[q + 3] = x1; pos[q + 4] = LAYER; pos[q + 5] = z1;
      const r = TEAL_RGB.r * b, gg = TEAL_RGB.g * b, bb = TEAL_RGB.b * b;
      col[q] = r * 0.8; col[q + 1] = gg * 0.8; col[q + 2] = bb * 0.8; col[q + 3] = r; col[q + 4] = gg; col[q + 5] = bb;
    }
  }
  posBuf.needsUpdate = true;
  colBuf.needsUpdate = true;
  obj.visible = k > 0.002;
  return <primitive object={obj} />;
};

// ───────────── places and routes ─────────────
const ICHINOMIYA: [number, number] = [140.40, 35.37];
const TOKYO: [number, number] = [139.69, 35.69];
const SEATTLE: [number, number] = [237.67, 47.61];
const FAR = greatCircle(TOKYO, SEATTLE, 80).map(([lo, la]) => pacificPoint(lo, la, 0.03) as number[]);
const FAR_MI = Math.round(gcKm(TOKYO, SEATTLE) * 0.621371 / 100) * 100;
/** The balloon's path: integrated through the January 1945 field from Ichinomiya to the coast (lon 236.2 ≈ 123.8° W). */
const ROUTE_LL: [number, number][] = (() => {
  const out: [number, number][] = [ICHINOMIYA];
  let [lo, la] = ICHINOMIYA;
  for (let s = 0; s < 2000 && lo < 236.2; s++) {
    [lo, la] = advect(lo, la, 900);
    out.push([lo, la]);
  }
  return out;
})();
const ROUTE = ROUTE_LL.map(([lo, la]) => pacificPoint(lo, la, LAYER + 0.01) as number[]);
const ROUTE_GROUND = ROUTE_LL.map(([lo, la]) => pacificPoint(lo, la, 0.012) as number[]);
const LANDFALL = ROUTE_LL[ROUTE_LL.length - 1];

const BR = 0.24; // balloon envelope radius (world units, hugely exaggerated)
const RING = 2.33; // ring below the envelope centre, in envelope radii

export type PacificWindsProps = {at?: number; windsAt?: number; windsOut?: number; tooFarAt?: number; tooFarOut?: number; balloonAt?: number; routeAt?: number; routeDur?: number;
  labels?: boolean; cam?: CamKey[]};

export const PacificWinds: React.FC<PacificWindsProps> = ({at = 0, windsAt = 1e9, windsOut = 1e9, tooFarAt = 1e9, tooFarOut, balloonAt = 1e9, routeAt, routeDur = 210, labels = true, cam}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const rAt = routeAt ?? balloonAt + 24;
  const farOut = tooFarOut ?? windsAt;
  const end = Math.min(1e6, Math.max(at + 240, Math.min(rAt + routeDur + 40, 1e6), Math.min(windsAt + 240, 1e6)));
  const keys: CamKey[] = cam ?? [
    {f: at, target: [0.3, 0, 0.55], dist: 22.5, yaw: 0, pitch: 0.92},
    {f: end, target: [0.45, 0, 0.4], dist: 22.3, yaw: -0.04, pitch: 0.86},
  ];
  const c = useMemo(() => makeCam(camAt(keys, f)), [f, keys]);
  const S2 = (p: readonly number[]) => project(c, p);

  const mapK = ramp(g, at, at + 18);
  const windK = ramp(f, windsAt, windsAt + 20) * (1 - ramp(f, windsOut, windsOut + 15));
  const farK = ramp(g, tooFarAt, tooFarAt + 30);
  const farO = 1 - ramp(g, farOut, farOut + 10);
  const farPart = useMemo(() => partOf(FAR, farK), [farK]);

  // the balloon: rises off Ichinomiya, then rides
  const rise = ramp(f, balloonAt, balloonAt + 22);
  const rideK = interpolate(f, [rAt, rAt + routeDur], [0, 1], {...clamp, easing: (t) => t * t * (3 - 2 * t) * 0.35 + t * 0.65});
  const ground = pacificPoint(...ICHINOMIYA, 0);
  let bp: number[] = [ground[0], LAYER * rise + 0.02, ground[2]];
  if (f >= rAt) bp = along(ROUTE, rideK);
  const showBalloon = f >= balloonAt;
  const balloonPos = [bp[0], bp[1] + BR * RING + BR * 0.15, bp[2]];
  const track = useMemo(() => (rideK > 0 ? partOf(ROUTE_GROUND, rideK) : []), [rideK]);
  const arrived = rideK >= 1;

  // labels
  const L = (lon: number, lat: number, y = 0) => S2(pacificPoint(lon, lat, y));
  const jp = L(136, 41), na = L(246, 37.5), po = L(188, 24), js = L(172, 39.5, LAYER);
  const farMid = S2(FAR[44]);
  const land = L(LANDFALL[0], LANDFALL[1]);
  const ich = L(...ICHINOMIYA);

  return (
    <Stage
      over={<AbsoluteFill>
        {labels && <>
          <Label x={jp.x} y={jp.y} text="JAPAN" opacity={mapK} size={26} />
          <Label x={na.x} y={na.y} text="NORTH AMERICA" opacity={mapK} size={26} />
          <Label x={po.x} y={po.y} text="PACIFIC OCEAN" opacity={mapK * 0.85} size={22} bg={false} />
          <Label x={js.x} y={js.y - 70} text="JET STREAM" sub="≈ 34,000 FT · UP TO 180 MPH" color={TEAL} opacity={ramp(g, windsAt + 30, windsAt + 38) * (1 - ramp(f, windsOut, windsOut + 10)) * (1 - ramp(g, rAt, rAt + 10))} size={24} />
        </>}
        {farK > 0 && farO > 0 && <>
          <Label x={farMid.x} y={farMid.y - 18} text={`≈ ${FAR_MI.toLocaleString('en-US')} MILES`} sub="TOKYO → SEATTLE" opacity={ramp(g, tooFarAt + 22, tooFarAt + 28) * farO} size={24} />
          {farO > 0.5 && <Hand f={g} text="too far" x={farMid.x + 40} y={farMid.y + 40} at={tooFarAt + 34} size={64} rot={-5} />}
        </>}
        {showBalloon && labels && f < rAt + 8 && <Label x={ich.x} y={ich.y + 46} text="ICHINOMIYA" opacity={ramp(g, balloonAt + 6, balloonAt + 12) * (1 - ramp(g, rAt, rAt + 8))} size={18} />}
        {arrived && labels && <Label x={land.x - 40} y={land.y + 64} anchor="r" text="LANDFALL · OREGON COAST" opacity={ramp(g, rAt + routeDur, rAt + routeDur + 8)} size={18} />}
        {/* honest source line */}
        <Fine text={windK > 0 || rideK > 0 ? `WINDS: NOAA 20TH CENTURY REANALYSIS V3 · JANUARY 1945 MEAN · 250 hPa${rideK > 0 ? ' · PATH FOLLOWS THAT MEAN WIND' : ''}` : 'MAP: NATURAL EARTH COASTLINES'} opacity={0.7 * mapK} />
      </AbsoluteFill>}
    >
      <SyncCam cam={c} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[-6, 10, 6]} intensity={1.6} />
      <MapSlab w={MW} d={MD} />
      <MapTop rings={WD.coast} P={P} b={B} k={mapK} />
      <Streaks f={f} k={windK} sweepAt={windsAt} />
      {farK > 0 && farO > 0 && <Poly pts={farPart} color={CREAM} width={3} opacity={0.9 * farO} dashed dash={0.16} gap={0.12} />}
      {track.length > 1 && <Poly pts={track} color={CREAM} width={2.4} opacity={0.75} dashed dash={0.12} gap={0.09} />}
      {showBalloon && <>
        <Poly pts={[[bp[0], 0.01, bp[2]], [bp[0], bp[1], bp[2]]]} color={CREAM} width={1.2} opacity={0.45} dashed dash={0.03} gap={0.03} />
        <GroundGlow pos={[bp[0], 0.008, bp[2]]} r={0.45} color="#FF6F61" opacity={0.35} />
        <Balloon pos={balloonPos} r={BR} bags={1 - rideK * 0.8} spin={f * 0.02} />
      </>}
    </Stage>
  );
};

// ---------------------------------------------------------------- test composition
export const PACIFIC_WINDS_TEST_FRAMES = 540;
export const PacificWindsTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <PacificWinds at={0} tooFarAt={20} windsAt={130} balloonAt={250} routeAt={280} routeDur={210} />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
