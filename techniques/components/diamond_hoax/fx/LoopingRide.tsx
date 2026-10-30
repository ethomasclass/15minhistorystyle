// LoopingRide: ch05 "Four days on horseback, with Arnold leading the way. And Arnold keeps getting lost. Doubling back.
// Going in circles." The same drawn terrain, zoomed out (real elevation, AWS Terrarium, 50 m contours, heights x7): Rawlins,
// Wyoming on the Union Pacific, the diamond field on the Colorado line ~100 miles away as the crow flies (dashed), then
// Arnold's ride drawing itself in orange, looping, doubling back and circling; four day ticks (DAY 1-4) as it goes.
// The ride's path is an honest illustration (the real route was never recorded): "ROUTE ILLUSTRATIVE" on screen.
//
// Props (frames, in the parent's time):
//   at        contours draw on                              default 0
//   pinAt     Rawlins pin and the diamond-field pin stand up  default at + 20
//   lineAt    the straight dashed line Rawlins -> field       default at + 45
//   rideAt    the ride starts drawing                         default at + 85
//   rideDur   frames for the whole ride (4 days)              default 210
//   railroad  show the Union Pacific line through Rawlins     default true
// Exports: LoopingRide, LoopingRideTest, LOOPING_RIDE_TEST_FRAMES.
import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {JF, PALETTES, PaletteCtx, StepCtx, useGFrame} from '../kit/Kit';
import {clamp, CORAL, CREAM, ease, GroundGlow, makeCam, ORANGE, Poly, project, Segs, slap, Stage, SyncCam} from './terrain/drawn3d';
import {buildTerrain, drape} from './terrain/heightmap';
import {TerrainSlab} from './terrain/TerrainSlab';

const T = buildTerrain('region', 10, 7, 50, 5, 0.006);
const W2 = (lat: number, lon: number) => T.toWorld(lat, lon);
const RAWLINS = W2(41.7911, -107.2387);
const FIELD = W2(40.993, -108.8437);
const g3 = ([x, z]: [number, number], lift = 0): [number, number, number] => [x, T.heightAt(x, z) + lift, z];

// Union Pacific main line through Rawlins (approximate stations: Sinclair, Rawlins, Creston, Wamsutter, Table Rock, Point of Rocks)
const RAIL = drape(T, ([[41.775, -106.95], [41.785, -107.11], [41.7911, -107.2387], [41.70, -107.74], [41.672, -107.978], [41.63, -108.38], [41.677, -108.785], [41.62, -109.0], [41.59, -109.17]] as [number, number][]).map(([a, b]) => W2(a, b)), 0.05, 0.02);
const CROW = drape(T, [RAWLINS, FIELD], 0.04, 0.03);

/** The illustrative ride: legs to waypoints plus full circles ("loop" = radius in km, + = clockwise on the map). */
type Op = ['to', number, number] | ['loop', number];
const OPS: Op[] = [
  ['to', 41.70, -107.33], ['to', 41.58, -107.42], ['loop', 5.5], ['to', 41.50, -107.62],
  ['to', 41.60, -107.70], // doubling back north
  ['to', 41.44, -107.84], ['to', 41.36, -107.80], ['loop', -6], ['to', 41.30, -108.02],
  ['to', 41.42, -108.18], ['to', 41.50, -108.10], // back the way they came
  ['to', 41.32, -108.36], ['loop', 5], ['to', 41.16, -108.50], ['to', 41.06, -108.98], // overshoot west
  ['loop', -4.5], ['to', 40.95, -108.92], ['to', 40.993, -108.8437],
];
const KM = T.size / T.hm.kmW;
const RIDE = (() => {
  const pts: THREE.Vector3[] = [new THREE.Vector3(RAWLINS[0], 0, RAWLINS[1])];
  let head = 0;
  for (const op of OPS) {
    const p = pts[pts.length - 1];
    if (op[0] === 'to') {
      const [x, z] = W2(op[1], op[2]);
      head = Math.atan2(z - p.z, x - p.x);
      pts.push(new THREE.Vector3(x, 0, z));
    } else {
      const r = Math.abs(op[1]) * KM, s = Math.sign(op[1]);
      // circle tangent to the current heading, turning to the right (s>0) or left
      const cx = p.x + Math.cos(head + (s * Math.PI) / 2) * r, cz = p.z + Math.sin(head + (s * Math.PI) / 2) * r;
      const a0 = Math.atan2(p.z - cz, p.x - cx);
      for (let k = 1; k <= 14; k++) {
        const a = a0 + s * (k / 14) * Math.PI * 2 * 1.08;
        pts.push(new THREE.Vector3(cx + Math.cos(a) * r, 0, cz + Math.sin(a) * r));
      }
      head += s * Math.PI * 2 * 1.08;
    }
  }
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
  return curve.getSpacedPoints(900).map((v) => [v.x, T.heightAt(v.x, v.z) + 0.035, v.z]);
})();
const DAYS = [0.25, 0.5, 0.75, 1];

const Sun: React.FC<{on: number; active: boolean; label: string}> = ({on, active, label}) => {
  const c = active ? ORANGE : on > 0.5 ? CREAM : 'rgba(244,239,230,0.3)';
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 96}}>
      <svg width={54} height={54} viewBox="-27 -27 54 54">
        {Array.from({length: 8}).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <line key={i} x1={Math.cos(a) * 15} y1={Math.sin(a) * 15} x2={Math.cos(a) * 23} y2={Math.sin(a) * 23} stroke={c} strokeWidth={3} strokeLinecap="round" />;
        })}
        <circle r={10} fill={on > 0.5 ? c : 'none'} stroke={c} strokeWidth={3} />
      </svg>
      <div style={{fontFamily: JF.mono, fontSize: 18, letterSpacing: 2, color: c, marginTop: 4}}>{label}</div>
    </div>
  );
};

const Tag3: React.FC<{x: number; y: number; text: string; sub?: string; color?: string; opacity: number; size?: number}> = ({x, y, text, sub, color = CREAM, opacity, size = 24}) => opacity <= 0.01 ? null : (
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -100%)', opacity, textAlign: 'center', fontFamily: JF.mono, fontSize: size, letterSpacing: 4, color,
    whiteSpace: 'nowrap', background: 'rgba(7,9,8,0.62)', padding: `${size * 0.2}px ${size * 0.45}px`, borderRadius: 4, textShadow: '0 2px 8px #000'}}>
    {text}
    {sub && <div style={{fontSize: size * 0.62, letterSpacing: 1.5, color: 'rgba(244,239,230,0.75)', marginTop: 2}}>{sub}</div>}
  </div>
);

export const LoopingRide: React.FC<{at?: number; pinAt?: number; lineAt?: number; rideAt?: number; rideDur?: number; railroad?: boolean}> = ({
  at = 0, pinAt, lineAt, rideAt, rideDur = 210, railroad = true,
}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const P = pinAt ?? at + 20, L = lineAt ?? at + 45, R = rideAt ?? at + 85;
  // one slow camera move: settle in from a little higher and to the east, then ease along with the ride
  const t = interpolate(f, [at, R + rideDur + 30], [0, 1], {...clamp, easing: ease});
  const cam = useMemo(() => makeCam({target: [interpolate(t, [0, 1], [0.0, -0.3]), 0.2, interpolate(t, [0, 1], [0.35, 0.5])], dist: interpolate(t, [0, 1], [17.6, 16.4]),
    yaw: interpolate(t, [0, 1], [-0.14, -0.28]), pitch: interpolate(t, [0, 1], [0.74, 0.68])}), [t]);
  const S = (p: [number, number, number]) => project(cam, p);

  const reveal = interpolate(g, [at, at + 40], [0, 1], clamp);
  const pinK = slap(Math.min(1, Math.max(0, (g - P) / 10)));
  const pin2K = slap(Math.min(1, Math.max(0, (g - P - 8) / 10)));
  const crow = interpolate(g, [L, L + 18], [0, 1], clamp);
  const rideP = interpolate(g, [R, R + rideDur], [0, 1], clamp);
  const crowDim = 1 - 0.45 * interpolate(g, [R, R + 20], [0, 1], clamp);
  const crowPart = useMemo(() => CROW.slice(0, Math.max(2, Math.round(CROW.length * crow))), [crow]);
  const n = Math.max(2, Math.round(RIDE.length * rideP));
  const ridePart = useMemo(() => RIDE.slice(0, n), [n]);
  const tip = RIDE[n - 1];
  const day = Math.min(4, Math.floor(rideP * 4 + 1e-6) + 1);

  // day ticks: short cross-strokes on the route where each day ends
  const ticks = useMemo(() => {
    const out: number[] = [];
    DAYS.slice(0, 3).forEach((d) => {
      const i = Math.round(d * (RIDE.length - 1));
      const a = RIDE[Math.max(0, i - 3)], b = RIDE[Math.min(RIDE.length - 1, i + 3)];
      const dx = b[0] - a[0], dz = b[2] - a[2], l = Math.hypot(dx, dz) || 1;
      const nx = (-dz / l) * 0.13, nz = (dx / l) * 0.13;
      const p = RIDE[i];
      out.push(p[0] - nx, p[1] + 0.01, p[2] - nz, p[0] + nx, p[1] + 0.01, p[2] + nz);
    });
    return new Float32Array(out);
  }, []);
  const ticksShown = DAYS.slice(0, 3).filter((d) => rideP >= d).length;
  const tickPos = useMemo(() => ticks.slice(0, ticksShown * 6), [ticks, ticksShown]);

  const raw = S(g3(RAWLINS, 0.75 * pinK));
  const fld = S(g3(FIELD, 0.75 * pin2K));
  const crowMid = S(CROW[Math.floor(CROW.length * 0.6)] as [number, number, number]);
  const railLab = S(RAIL[Math.floor(RAIL.length * 0.47)] as [number, number, number]);
  const H0 = 0.75;

  return (
    <Stage
      over={
        <AbsoluteFill>
          <Tag3 x={raw.x} y={raw.y - 22} text="RAWLINS" sub="WYOMING · UNION PACIFIC" opacity={pinK} />
          <Tag3 x={fld.x} y={fld.y - 22} text="THE DIAMOND FIELD" sub="COLORADO–WYOMING LINE" opacity={pin2K} color={CORAL} size={22} />
          {railroad && <Tag3 x={railLab.x} y={railLab.y - 14} text="UNION PACIFIC RAILROAD" opacity={reveal * 0.85 * (1 - rideP * 0.4)} size={15} />}
          <div style={{position: 'absolute', left: crowMid.x - 20, top: crowMid.y + 14, transform: 'translateX(-100%)', opacity: crow * crowDim, fontFamily: JF.mono, fontSize: 18, letterSpacing: 2, color: CREAM,
            background: 'rgba(7,9,8,0.62)', padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap'}}>≈ 100 MI AS THE CROW FLIES</div>
          {/* the four days */}
          <div style={{position: 'absolute', left: 150, top: 130, display: 'flex', gap: 6, opacity: interpolate(g, [R - 6, R + 4], [0, 1], clamp)}}>
            {[1, 2, 3, 4].map((d) => <Sun key={d} label={`DAY ${d}`} on={rideP > 0 && d <= day ? 1 : 0} active={rideP > 0 && rideP < 1 && d === day} />)}
          </div>
          <div style={{position: 'absolute', right: 150, top: 940, fontFamily: JF.mono, fontSize: 17, letterSpacing: 2, color: 'rgba(244,239,230,0.7)', opacity: reveal}}>
            {rideP > 0 ? 'ROUTE ILLUSTRATIVE · HEIGHTS EXAGGERATED ×7' : 'HEIGHTS EXAGGERATED ×7 · 50 M CONTOURS'}
          </div>
        </AbsoluteFill>
      }
    >
      <SyncCam cam={cam} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[-6, 8, 4]} intensity={1.7} />
      <TerrainSlab T={T} reveal={reveal} contourW={1.1} indexW={2.1} />
      {railroad && <Poly pts={RAIL} color={CREAM} width={1.8} opacity={0.5 * reveal} dashed dash={0.05} gap={0.035} />}
      {/* pins */}
      {pinK > 0 && <>
        <Poly pts={[g3(RAWLINS, 0.02), g3(RAWLINS, H0 * pinK)]} color={CREAM} width={2.4} />
        <mesh position={g3(RAWLINS, H0 * pinK)}><sphereGeometry args={[0.07, 16, 12]} /><meshLambertMaterial color={CREAM} emissive={CREAM} emissiveIntensity={0.4} /></mesh>
      </>}
      {pin2K > 0 && <>
        <Poly pts={[g3(FIELD, 0.02), g3(FIELD, H0 * pin2K)]} color={CORAL} width={2.6} />
        <mesh position={g3(FIELD, H0 * pin2K)}><sphereGeometry args={[0.08, 16, 12]} /><meshLambertMaterial color={CORAL} emissive={CORAL} emissiveIntensity={0.5} /></mesh>
        <GroundGlow pos={g3(FIELD, 0.03)} r={0.5} color={CORAL} opacity={0.45 * pin2K} />
      </>}
      {crow > 0 && <Poly pts={crowPart} color={CREAM} width={2.6} opacity={0.9 * crowDim} dashed dash={0.11} gap={0.08} />}
      {rideP > 0 && <>
        <Poly pts={ridePart} color={ORANGE} width={4.2} />
        <Segs pos={tickPos} color={CREAM} width={3} />
        {rideP < 1 && <mesh position={[tip[0], tip[1] + 0.03, tip[2]]}><sphereGeometry args={[0.055, 14, 10]} /><meshBasicMaterial color={CREAM} /></mesh>}
        {rideP < 1 && <GroundGlow pos={[tip[0], tip[1] + 0.01, tip[2]]} r={0.35} color={ORANGE} opacity={0.55} />}
      </>}
    </Stage>
  );
};

export const LOOPING_RIDE_TEST_FRAMES = 340;
export const LoopingRideTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <LoopingRide at={0} />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);

