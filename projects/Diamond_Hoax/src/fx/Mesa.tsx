// Mesa: the diamond field as a tilted teal-contour terrain slab (ch05 salting -> ch07 King finds it).
// Real elevation: AWS Terrarium tiles around the Diamond Field flat (GNIS: 40.9930 N, 108.8437 W, Moffat County, CO), 0.7 km
// south of the Colorado-Wyoming line (41 N; Sweetwater County, WY to the north), with Diamond Peak (2,946 m, 40.9504 N
// 108.8780 W) on the slab. Baked by public/img/fx/mesa/bake_heightmap.py; 20 m contours, 100 m index contours, heights x2.5.
//
// Props (frames, in the parent's time; leave a beat undefined to skip it):
//   at          contours draw on (lowest first)                      default 0
//   saltAt      coral stones drop one by one into the salted patch   "Pressing them into the dirt"
//   glowAt      the patch glows under a teal circle                  "start finding stones"
//   stakesAt    four claim stakes rise at the corners of Janin's ~3,000-acre square, the boundary draws  "3,000 acres"
//   drainAt     the coral drains to grey                             "The diamond field wasn't"
//   rubyRingAt  ch07: one diamond, exactly 12 rubies in a ring, counter 1-12   "about a dozen rubies near it"
//   tidyAt      Note "Nature is not that tidy."                      (defaults to rubyRingAt + 75)
//   cam         camera keys [{f, target:[x,y,z], dist, yaw, pitch, fov?}] (raw frames, eased); MESA_SPOTS has the places
//   labels      show the state names / peak / scale notes (default true)
// Exports: Mesa, MesaTest, MESA_TEST_FRAMES, MESA_SPOTS, MESA_CAM (presets).
import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {JF, Note, PALETTES, PaletteCtx, StepCtx, useGFrame} from '../kit/Kit';
import {camAt, clamp, CORAL, CREAM, GemMesh, GREY, GroundGlow, makeCam, Poly, project, ringPts, rng, Segs, shakeAt, slap, Stage, SyncCam, TEAL, type CamKey} from './terrain/drawn3d';
import {buildTerrain, drape} from './terrain/heightmap';
import {TerrainSlab} from './terrain/TerrainSlab';

const T = buildTerrain('mesa', 10, 2.5, 20, 5);
const at3 = (lat: number, lon: number, lift = 0): [number, number, number] => {
  const [x, z] = T.toWorld(lat, lon);
  return [x, T.heightAt(x, z) + lift, z];
};
export const MESA_SPOTS = {
  field: at3(40.993, -108.8437),
  peak: at3(40.9504, -108.878),
  centre: [0, 0.4, 0] as [number, number, number],
};
const FIELD = MESA_SPOTS.field;
const ACRE_SIDE = (Math.sqrt(3000 * 4046.86) / 1000) * (T.size / T.hm.kmW); // 3,000 acres as a square, world units

/** Camera presets (no `f`): spread with a frame number into `cam` keys. */
export const MESA_CAM = {
  wide: {target: [-0.3, 0.2, 0.9] as [number, number, number], dist: 19, yaw: -0.3, pitch: 0.62},
  patch: {target: [FIELD[0], FIELD[1], FIELD[2]] as [number, number, number], dist: 6.2, yaw: -0.22, pitch: 0.66},
  claim: {target: [FIELD[0] - 0.1, FIELD[1], FIELD[2] + 0.15] as [number, number, number], dist: 9.6, yaw: -0.18, pitch: 0.72},
  ring: {target: [FIELD[0] + 0.12, FIELD[1] + 0.02, FIELD[2] + 0.02] as [number, number, number], dist: 3.0, yaw: -0.1, pitch: 0.88},
};

// salted stones: positions in the patch, kinds, spin (seeded at module load)
const STONES = (() => {
  const R = rng(1872);
  const out: {x: number; z: number; kind: 'diamond' | 'ruby'; ry: number; rx: number}[] = [];
  for (let i = 0; i < 15; i++) {
    const a = R() * Math.PI * 2, r = 0.05 + Math.sqrt(R()) * 0.2;
    out.push({x: FIELD[0] + Math.cos(a) * r, z: FIELD[2] + Math.sin(a) * r * 0.85, kind: i % 3 === 1 ? 'diamond' : 'ruby', ry: R() * 6.28, rx: (R() - 0.5) * 0.8});
  }
  return out;
})();

const STATE_LINE = drape(T, [T.toWorld(41.0, -108.96), T.toWorld(41.0, -108.77)], 0.03, 0.015);

const mix = (a: string, b: string, t: number) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), Math.max(0, Math.min(1, t))).getHexString();

const Label: React.FC<{x: number; y: number; text: string; size?: number; color?: string; spacing?: number; opacity?: number; align?: 'left' | 'center' | 'right'; sub?: string}> = ({
  x, y, text, size = 24, color = CREAM, spacing = 3, opacity = 1, align = 'center', sub,
}) => opacity <= 0.01 ? null : (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(${align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0'}, -50%)`, opacity, textAlign: align,
    fontFamily: JF.mono, fontSize: size, letterSpacing: spacing, color, whiteSpace: 'nowrap', textShadow: '0 0 4px #000, 0 2px 10px rgba(0,0,0,0.9)',
    background: 'rgba(7,9,8,0.62)', padding: `${size * 0.18}px ${size * 0.4}px`, borderRadius: 4}}>
    {text}
    {sub && <div style={{fontSize: size * 0.62, letterSpacing: 1.5, opacity: 0.8, marginTop: 2}}>{sub}</div>}
  </div>
);

export type MesaProps = {
  at?: number; saltAt?: number; glowAt?: number; stakesAt?: number; drainAt?: number; rubyRingAt?: number; tidyAt?: number;
  cam?: CamKey[]; labels?: boolean;
};

export const Mesa: React.FC<MesaProps> = ({at = 0, saltAt, glowAt, stakesAt, drainAt, rubyRingAt, tidyAt, cam, labels = true}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const keys: CamKey[] = cam ?? [{f: at, ...MESA_CAM.wide}, {f: at + 300, ...MESA_CAM.wide, dist: 17.5, yaw: -0.24}];
  // gentle drift on top of the keyed move, plus a little shake when stakes land
  const base = camAt(keys, f);
  const drift = {...base, yaw: base.yaw + Math.sin((f - at) / 160) * 0.025, dist: base.dist * (1 - 0.00012 * (f - at))};
  const stakeShake = stakesAt === undefined ? 0 : [0, 1, 2, 3].reduce((s, i) => s + shakeAt(f, stakesAt + i * 7 + 5, 0.035), 0);
  const camera = useMemo(() => makeCam(drift, [stakeShake * 0.4, stakeShake]), [drift.dist, drift.yaw, drift.pitch, drift.target[0], drift.target[1], drift.target[2], stakeShake]);

  const reveal = interpolate(g, [at, at + 40], [0, 1], clamp);
  const drain = drainAt === undefined ? 0 : interpolate(g, [drainAt, drainAt + 20], [0, 1], clamp);
  const ringOn = rubyRingAt !== undefined && g >= rubyRingAt - 20;
  const stonesFade = rubyRingAt === undefined ? 1 : interpolate(g, [rubyRingAt - 20, rubyRingAt - 5], [1, 0], clamp);
  const stoneCol = mix(CORAL, GREY, drain);
  const glow = glowAt === undefined ? 0 : interpolate(g, [glowAt, glowAt + 8], [0, 1], clamp) * (1 - drain) * stonesFade;
  const ringDraw = glowAt === undefined ? 0 : interpolate(g, [glowAt + 4, glowAt + 16], [0, 1], clamp);
  const ringPath = useMemo(() => ringPts(FIELD[0], FIELD[2], 0.36, 64, (x, z) => T.heightAt(x, z) + 0.02, 0.06, 7), []);
  const ringPart = useMemo(() => ringPath.slice(0, Math.max(2, Math.round(ringPath.length * Math.min(1, ringDraw * 1.04)))), [ringPath, ringDraw]);

  // claim square
  const half = ACRE_SIDE / 2;
  const corners: [number, number][] = [[FIELD[0] - half, FIELD[2] - half], [FIELD[0] + half, FIELD[2] - half], [FIELD[0] + half, FIELD[2] + half], [FIELD[0] - half, FIELD[2] + half]];
  const claimPath = useMemo(() => drape(T, [...corners, corners[0]], 0.03, 0.02), []); // eslint-disable-line react-hooks/exhaustive-deps
  const claimDraw = stakesAt === undefined ? 0 : interpolate(g, [stakesAt + 30, stakesAt + 54], [0, 1], clamp);
  const claimPart = useMemo(() => claimPath.slice(0, Math.max(2, Math.round(claimPath.length * claimDraw))), [claimPath, claimDraw]);

  // ruby ring (ch07)
  const RUBY_STEP = 5;
  const rubiesIn = rubyRingAt === undefined ? 0 : Math.max(0, Math.min(12, Math.floor((g - rubyRingAt - 12) / RUBY_STEP) + 1));
  const tidy = tidyAt ?? (rubyRingAt !== undefined ? rubyRingAt + 12 + 12 * RUBY_STEP + 15 : undefined);
  const S = (p: [number, number, number]) => project(camera, p);

  // state names ride along the line, anchored where it crosses ~30 % of the frame width (so they slide, never jump)
  const lonNear = (sx: number) => {
    let best = -108.935, bd = Infinity;
    for (let i = 0; i <= 120; i++) {
      const lon = -108.957 + (i / 120) * 0.184;
      const p = S(at3(41.0, lon, 0.05));
      const d = Math.abs(p.x - sx);
      if (p.vis && d < bd) { bd = d; best = lon; }
    }
    return best;
  };
  const lonAt = lonNear(520);
  const line41 = S(at3(41.0, lonNear(1500), 0.05));
  const near = camera.position.distanceTo(new THREE.Vector3(...drift.target));
  const off = Math.min(0.026, 0.0013 * near); // label offset from the line in degrees of latitude, shrinking as we push in
  const co = S(at3(41.0 - off, lonAt, 0.05));
  const wy = S(at3(41.0 + off * 1.25, lonAt, 0.05));
  const peak = S(at3(40.9504, -108.878, 0.12));
  const fieldP = S([FIELD[0], FIELD[1] + 0.05, FIELD[2]]);
  const claimLab = S([FIELD[0], T.heightAt(FIELD[0], FIELD[2] + half) + 0.05, FIELD[2] + half]);
  const inFrame = (p: {x: number; y: number; vis: boolean}) => (p.vis ? interpolate(Math.min(p.x - 150, 1770 - p.x, p.y - 130, 950 - p.y), [-40, 30], [0, 1], clamp) : 0);
  const labelK = labels ? reveal * (ringOn ? interpolate(g, [rubyRingAt! - 20, rubyRingAt! - 6], [1, 0], clamp) : 1) : 0;

  return (
    <Stage
      over={
        <AbsoluteFill>
          <Label x={co.x} y={co.y} text="COLORADO" sub="MOFFAT COUNTY" size={30} spacing={9} opacity={labelK * inFrame(co)} />
          <Label x={wy.x} y={wy.y} text="WYOMING" sub="SWEETWATER COUNTY" size={30} spacing={9} opacity={labelK * inFrame(wy)} />
          <Label x={line41.x} y={line41.y - 24} text="41° N · STATE LINE" size={17} color={CREAM} opacity={labelK * 0.85 * inFrame(line41)} align="right" />
          <Label x={peak.x} y={peak.y - 40} text="DIAMOND PEAK" sub="2,946 M" size={20} color={TEAL} opacity={labelK * inFrame(peak)} />
          {stakesAt !== undefined && <Label x={claimLab.x} y={claimLab.y + 34} text="≈ 3,000 ACRES" size={24} color={CREAM} opacity={interpolate(g, [stakesAt + 50, stakesAt + 56], [0, 1], clamp) * (ringOn ? 0 : 1)} />}
          {saltAt !== undefined && <Label x={fieldP.x - 130} y={fieldP.y + 110} text="THE DIAMOND FIELD" size={20} color={CREAM} align="left" opacity={interpolate(g, [saltAt + 50, saltAt + 56], [0, 1], clamp) * (ringOn || (stakesAt !== undefined && g >= stakesAt) ? 0 : 1)} />}
          {rubyRingAt !== undefined && g >= rubyRingAt + 12 && (
            <div style={{position: 'absolute', left: Math.max(150, Math.min(1500, fieldP.x + 470)), top: Math.max(130, Math.min(700, fieldP.y - 190)), fontFamily: JF.mono, color: CREAM, textShadow: '0 2px 12px #000'}}>
              <div style={{fontSize: 150, lineHeight: 1, color: CORAL, fontWeight: 600}}>{rubiesIn}</div>
              <div style={{fontSize: 26, letterSpacing: 6, marginTop: 8}}>{rubiesIn === 1 ? 'RUBY' : 'RUBIES'}</div>
              <div style={{fontSize: 20, letterSpacing: 3, marginTop: 6, color: TEAL}}>PER DIAMOND</div>
            </div>
          )}
          {tidy !== undefined && <Note text="Nature is not that tidy." x={250} y={830} size={58} rot={-3} at={tidy} dur={14} />}
          <Label x={150} y={960} text={(saltAt !== undefined && g >= saltAt) || (rubyRingAt !== undefined && g >= rubyRingAt) ? 'HEIGHTS EXAGGERATED ×2.5 · STONES NOT TO SCALE' : 'HEIGHTS EXAGGERATED ×2.5 · 20 M CONTOURS'} size={17} spacing={2} color="rgba(244,239,230,0.7)" align="left" opacity={reveal} />
        </AbsoluteFill>
      }
    >
      <SyncCam cam={camera} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[-6, 8, 4]} intensity={1.7} />
      <TerrainSlab T={T} reveal={reveal} dim={drain * 0.5} />
      {/* the state line, dashed */}
      <Poly pts={STATE_LINE} color={CREAM} width={2.6} opacity={0.85 * reveal} dashed dash={0.12} gap={0.08} />
      {/* salted stones dropping in */}
      {saltAt !== undefined && stonesFade > 0 && STONES.map((s, i) => {
        const t0 = saltAt + i * 4;
        if (g < t0) return null;
        const k = Math.min(1, (g - t0) / 7);
        const fall = 1 - Math.min(1, k * k * 1.15);
        const sq = slap(Math.min(1, (g - t0 - 5) / 8));
        const y = T.heightAt(s.x, s.z) + 0.03 + fall * 1.6;
        const sc = 0.07 * (g - t0 < 5 ? 1 : 0.85 + 0.15 * sq);
        const lit = glow > 0 ? 0.5 * glow : 0;
        return <GemMesh key={i} kind={s.kind} pos={[s.x, y, s.z]} s={sc} rot={[s.rx, s.ry, 0]} fill={stoneCol} line={mix(CREAM, GREY, drain)} width={1.4} glow={lit} opacity={stonesFade} />;
      })}
      <GroundGlow pos={[FIELD[0], FIELD[1] + 0.03, FIELD[2]]} r={0.9} color={CORAL} opacity={glow * (0.55 + 0.1 * Math.sin(g / 5))} />
      {ringDraw > 0 && stonesFade > 0 && <Poly pts={ringPart} color={drain > 0.5 ? GREY : TEAL} width={3.2} opacity={stonesFade} />}
      {/* claim stakes + boundary */}
      {stakesAt !== undefined && !ringOn && corners.map(([x, z], i) => {
        const t0 = stakesAt + i * 7;
        if (g < t0) return null;
        const k = slap(Math.min(1, (g - t0) / 9));
        const y0 = T.heightAt(x, z);
        const h = 0.55;
        return (
          <group key={i} position={[x, y0 - h * (1 - k) * 0.9, z]}>
            <mesh position={[0, h / 2, 0]}>
              <boxGeometry args={[0.07, h, 0.07]} />
              <meshLambertMaterial color="#1b1712" />
            </mesh>
            <Segs pos={STAKE_EDGES} color={CREAM} width={1.8} />
          </group>
        );
      })}
      {claimDraw > 0 && !ringOn && <Poly pts={claimPart} color={TEAL} width={3.4} opacity={1} />}
      {/* ch07: one diamond and its ring of exactly twelve rubies */}
      {ringOn && (() => {
        const dk = slap(Math.min(1, (g - rubyRingAt!) / 8));
        const c: [number, number, number] = [FIELD[0], FIELD[1] + 0.035, FIELD[2]];
        return (
          <group>
            <GemMesh kind="diamond" pos={[c[0], c[1] + 0.02, c[2]]} s={0.1 * dk} rot={[0.3, 0.5, 0]} fill="#5d6b68" line={CREAM} width={2.4} />
            {Array.from({length: rubiesIn}).map((_, i) => {
              const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
              const x = c[0] + Math.cos(a) * 0.17, z = c[2] + Math.sin(a) * 0.17;
              const t0 = rubyRingAt! + 12 + i * RUBY_STEP;
              const k = slap(Math.min(1, (g - t0) / 6));
              return <GemMesh key={i} kind="ruby" pos={[x, T.heightAt(x, z) + 0.025, z]} s={0.05 * k} rot={[0.2, a, 0.1]} fill={CORAL} line={CREAM} width={1.6} />;
            })}
          </group>
        );
      })()}
    </Stage>
  );
};

const STAKE_EDGES = (() => {
  const e = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.07, 0.55, 0.07));
  e.translate(0, 0.275, 0);
  return new Float32Array(e.attributes.position.array);
})();

// ───────────── test: every beat in one pass ─────────────
export const MESA_TEST_FRAMES = 480;
const TB = {at: 0, saltAt: 70, glowAt: 150, stakesAt: 200, drainAt: 285, rubyRingAt: 330};
const TEST_CAM: CamKey[] = [
  {f: 0, ...MESA_CAM.wide},
  {f: 60, ...MESA_CAM.wide, dist: 18.2, yaw: -0.27},
  {f: 100, ...MESA_CAM.patch},
  {f: 160, ...MESA_CAM.patch, dist: 5.8},
  {f: 210, ...MESA_CAM.claim},
  {f: 300, ...MESA_CAM.claim, dist: 9.2, yaw: -0.12},
  {f: 345, ...MESA_CAM.ring},
  {f: 480, ...MESA_CAM.ring, dist: 2.75, yaw: -0.02},
];
export const MesaTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Mesa {...TB} cam={TEST_CAM} />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
