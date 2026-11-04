// LandingMap (ch05, ch07, ch08): North America as a tilted map slab (Natural Earth 1:50m, Lambert conformal conic so Alaska and
// the Aleutians sit naturally) with the 285 balloon incidents from Mikesh's chronology (public/data/fugo_incidents.json, see its
// .md; dates are recovery/report dates) standing up as pins in date order while a month counter runs. A small chart of
// balloons launched per month (Mikesh: Nov 700, Dec 1,200, Jan 2,000, Feb 2,500, Mar 2,500, early Apr 400, then none) grows
// with the months and drops to zero in April 1945 while pins keep appearing (balloons were found long after they landed).
// One pin at Bly, Oregon (No. 240, 5 May 1945, the Mitchell Monument site) stands taller in its own colour.
// Pins: 282 of the 285 are on the map (No. 12 has no position; No. 283 is at sea off Japan). The counter counts all records.
//
// Props (frames in the parent's time):
//   at, dur      the date window plays from frame `at` over `dur` frames          default 0, 300
//   from, to     ISO dates of the window (pins dated before `from` stand already)  default 1944-11-01, 1945-07-31
//   blyColor     colour of the Bly pin (coral; use CREAM / TEAL in the quiet ch08)  default CORAL
//   blyLabel     the "BLY, OREGON · 5 MAY 1945" tab                                default true
//   dimOthers    dim the other pins once Bly stands (focus)                       default false
//   bars         the launches-per-month chart                                     default true
//   barsScale    size of that chart (grows up and left from its bottom-right corner)  default 1
//   cam          'wide' (whole continent) | 'west' (Pacific Northwest, closer) | CamKey[]   default 'wide'
// Exports: LandingMap, LandingMapTest, LANDING_MAP_TEST_FRAMES, landingPoint(lon, lat), W3(lon, lat) (slab-centred, for cam keys).
import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {JF, PALETTES, PaletteCtx, StepCtx, useGFrame} from '../kit/Kit';
import coastJson from '../../public/data/landing_coast.json';
import incJson from '../../public/data/fugo_incidents.json';
import {type CamKey, camAt, clamp, CORAL, CREAM, DynSegs, Fine, GroundGlow, Hand, Label, makeCam, MapSlab, Poly, project, ramp, slap, Stage, SyncCam, TEAL} from './kit3d';
import {type BBox, clipRect, MapTop, type Proj} from './mapgeo';

type Inc = {n: number; date: string; place: string; region: string; country: string; lat: number | null; lon: number | null; plot?: boolean};
const INC = (incJson as unknown as Inc[]).slice().sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.n - b.n));
const COAST = (coastJson as unknown as {coast: number[][][]}).coast;

// ───────────── Lambert conformal conic (standard parallels 30° and 60°, centred 125° W, 48° N) ─────────────
const r = Math.PI / 180;
const P1 = 30 * r, P2 = 60 * r, L0 = -125, F0 = 48 * r;
const NN = Math.log(Math.cos(P1) / Math.cos(P2)) / Math.log(Math.tan(Math.PI / 4 + P2 / 2) / Math.tan(Math.PI / 4 + P1 / 2));
const FF = (Math.cos(P1) * Math.tan(Math.PI / 4 + P1 / 2) ** NN) / NN;
const rho = (f: number) => FF / Math.tan(Math.PI / 4 + f / 2) ** NN;
const R0 = rho(F0);
const K = 13; // world units per projected unit
const lcc = (lon: number, lat: number): [number, number] => {
  const dl = ((((lon - L0 + 180) % 360) + 360) % 360) - 180;
  const t = NN * dl * r, rr = rho(lat * r);
  return [rr * Math.sin(t) * K, -(R0 - rr * Math.cos(t)) * K];
};
export const landingPoint = (lon: number, lat: number, y = 0): [number, number, number] => {
  const [x, z] = lcc(lon, lat);
  return [x, y, z];
};
const RECT: BBox = [-0.64 * K, -0.48 * K, 0.58 * K, 0.38 * K]; // world x0, z0, x1, z1
const MW = RECT[2] - RECT[0], MD = RECT[3] - RECT[1];
const CX = (RECT[0] + RECT[2]) / 2, CZ = (RECT[1] + RECT[3]) / 2;
const ID: Proj = (x, z) => [x - CX, z - CZ];
const RINGS = COAST.map((ring) => clipRect(ring.map(([lo, la]) => lcc(lo, la)), RECT)).filter((g) => g.length > 2);
const BOX: BBox = RECT;
/** world point centred on the slab (the space the camera keys use) */
export const W3 = (lon: number, lat: number, y = 0): [number, number, number] => {
  const [x, z] = lcc(lon, lat);
  return [x - CX, y, z - CZ];
};
const inRect = (lon: number, lat: number) => {
  const [x, z] = lcc(lon, lat);
  return x > RECT[0] && x < RECT[2] && z > RECT[1] && z < RECT[3];
};

const day = (iso: string) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) / 86400000;
const PINS = INC.filter((e) => e.lat != null && e.lon != null && e.plot !== false && inRect(e.lon!, e.lat!)).map((e) => ({...e, d: day(e.date), p: W3(e.lon!, e.lat!)}));
const BLY = PINS.find((e) => e.n === 240)!;

const LAUNCH: [string, number, string][] = [['NOV', 700, '700'], ['DEC', 1200, '1,200'], ['JAN', 2000, '2,000'], ['FEB', 2500, '2,500'], ['MAR', 2500, '2,500'], ['APR', 400, '400'],
  ['MAY', 0, '0'], ['JUN', 0, '0'], ['JUL', 0, '0']];
const MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

const HEAD = new THREE.SphereGeometry(1, 12, 9);
const PIN_H = 0.34, HEAD_R = 0.05;

/** The launches-per-month chart (DOM). `mi` = index of the current month in LAUNCH (Nov 1944 = 0), `mk` = fraction through it. */
const LaunchChart: React.FC<{mi: number; mk: number; x: number; y: number; o: number; f: number; endAt: number; scale?: number}> = ({mi, mk, x, y, o, f, endAt, scale = 1}) => {
  const bw = 40, gap = 14, hMax = 130;
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: o, background: 'rgba(7,9,8,0.7)', padding: '16px 22px 12px', borderRadius: 6, transform: `scale(${scale})`, transformOrigin: 'right bottom'}}>
      <div style={{fontFamily: JF.mono, fontSize: 18, letterSpacing: 2.5, color: CREAM}}>BALLOONS LAUNCHED</div>
      <div style={{fontFamily: JF.mono, fontSize: 14, letterSpacing: 1.5, color: 'rgba(244,239,230,0.6)', marginBottom: 10}}>PER MONTH · APPROX. (MIKESH)</div>
      <svg width={LAUNCH.length * (bw + gap) - gap} height={hMax + 48} style={{display: 'block', overflow: 'visible', marginTop: 26}}>
        <line x1={0} y1={hMax} x2={LAUNCH.length * (bw + gap) - gap} y2={hMax} stroke="rgba(244,239,230,0.45)" strokeWidth={1.5} />
        {LAUNCH.map(([m, v, s], i) => {
          if (i > mi) return null;
          const k = i < mi ? 1 : Math.min(1, mk * 2.5);
          const h = (v / 2500) * hMax * k;
          const cur = i === mi;
          const bx = i * (bw + gap);
          return (
            <g key={m}>
              {v > 0 ? <rect x={bx} y={hMax - h} width={bw} height={h} fill={cur ? CREAM : TEAL} opacity={cur ? 1 : 0.75} />
                : <line x1={bx} y1={hMax - 1} x2={bx + bw} y2={hMax - 1} stroke={cur ? CREAM : TEAL} strokeWidth={4} />}
              <text x={bx + bw / 2} y={hMax - h - 8} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={13} fill={cur ? CREAM : 'rgba(244,239,230,0.7)'} opacity={k}>{s}</text>
              <text x={bx + bw / 2} y={hMax + 22} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={14} letterSpacing={1} fill={cur ? CREAM : 'rgba(244,239,230,0.6)'}>{m}</text>
            </g>
          );
        })}
      </svg>
      <Hand f={f} text="launches stop" x={150} y={-78} at={endAt} size={44} rot={-4} />
    </div>
  );
};

export type LandingMapProps = {at?: number; dur?: number; from?: string; to?: string; blyColor?: string; blyLabel?: boolean; dimOthers?: boolean; bars?: boolean; barsScale?: number;
  cam?: 'wide' | 'west' | CamKey[]};

export const LandingMap: React.FC<LandingMapProps> = ({at = 0, dur = 300, from = '1944-11-01', to = '1945-07-31', blyColor = CORAL, blyLabel = true, dimOthers = false, bars = true, barsScale = 1, cam = 'wide'}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const d0 = day(from), d1 = day(to);
  const dayAt = (fr: number) => d0 + ((fr - at) / Math.max(1, dur)) * (d1 - d0);
  const frameOf = (d: number) => at + ((d - d0) / Math.max(1, d1 - d0)) * dur;
  const now = Math.max(d0, Math.min(d1, dayAt(g)));

  const keys: CamKey[] = Array.isArray(cam) ? cam : cam === 'west'
    ? [{f: at - 10, target: [W3(-118, 47)[0], 0, W3(-118, 47)[2]], dist: 15.5, yaw: 0.05, pitch: 0.92}, {f: at + dur + 30, target: [W3(-119, 45.5)[0], 0, W3(-119, 45.5)[2]], dist: 13.8, yaw: 0, pitch: 0.88}]
    : [{f: at - 10, target: [-0.6, 0, 0.9], dist: 24.5, yaw: 0, pitch: 0.98}, {f: at + dur + 30, target: [-0.3, 0, 0.7], dist: 22.8, yaw: -0.04, pitch: 0.92}];
  const c = useMemo(() => makeCam(camAt(keys, f)), [f, keys]);
  const S2 = (p: readonly number[]) => project(c, p);

  const mapK = ramp(g, at - 12, at + 4);
  const blyF = frameOf(BLY.d);
  const blyK = g >= blyF ? slap(Math.min(1, (g - blyF) / 10)) : 0;
  const dimK = dimOthers ? 1 - 0.65 * ramp(g, blyF, blyF + 12) : 1;

  // pins
  const {stems, heads} = useMemo(() => {
    const pos: number[] = [];
    const hs: {p: number[]; s: number; fresh: number; bly: boolean}[] = [];
    for (const e of PINS) {
      const pf = frameOf(e.d);
      if (g < pf) continue;
      const bly = e.n === 240;
      const k = slap(Math.min(1, (g - pf) / 8));
      const h = (bly ? PIN_H * 1.9 : PIN_H) * k;
      if (!bly) pos.push(e.p[0], 0.006, e.p[2], e.p[0], h, e.p[2]);
      hs.push({p: [e.p[0], h, e.p[2]], s: bly ? HEAD_R * 1.8 : HEAD_R, fresh: 1 - Math.min(1, (g - pf) / 14), bly});
    }
    return {stems: new Float32Array(pos), heads: hs};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [g, at, dur, d0, d1]);

  const count = INC.filter((e) => day(e.date) <= now).length;
  const dt = new Date(now * 86400000);
  const monthName = `${MONTHS[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`;
  const mi = (dt.getUTCFullYear() - 1944) * 12 + dt.getUTCMonth() - 10; // Nov 1944 = 0
  const dim = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth() + 1, 0)).getUTCDate();
  const mk = (dt.getUTCDate() - 1) / dim;
  const endAt = frameOf(day('1945-04-20'));
  const blyS = S2(BLY.p.map((v, i) => (i === 1 ? PIN_H * 1.9 + 0.12 : v)));

  return (
    <Stage
      over={<AbsoluteFill>
        <div style={{position: 'absolute', left: 110, top: 104, opacity: mapK, background: 'rgba(7,9,8,0.55)', padding: '6px 18px 10px', borderRadius: 6}}>
          <div style={{fontFamily: JF.display, fontSize: 64, color: CREAM, letterSpacing: 1, textShadow: '0 3px 14px rgba(0,0,0,0.9)', whiteSpace: 'nowrap'}}>{monthName}</div>
          <div style={{fontFamily: JF.mono, fontSize: 24, letterSpacing: 3, color: TEAL, marginTop: 6, textShadow: '0 2px 8px #000', whiteSpace: 'nowrap'}}>
            BALLOON INCIDENTS: {count}
          </div>
        </div>
        {bars && mi >= 0 && <LaunchChart mi={Math.min(LAUNCH.length - 1, mi)} mk={mi > LAUNCH.length - 1 ? 1 : mk} x={1290} y={690} o={mapK} f={g} endAt={endAt} scale={barsScale} />}
        {blyLabel && blyK > 0 && <Label x={blyS.x} y={blyS.y - 10} text="BLY, OREGON" sub="5 MAY 1945" color={blyColor} opacity={ramp(g, blyF + 6, blyF + 12)} size={22} />}
        <Fine text="INCIDENTS: MIKESH (1973) FROM THE ARMY'S G-2 LIST · DATE FOUND OR REPORTED · MAP: NATURAL EARTH" opacity={0.7 * mapK} />
      </AbsoluteFill>}
    >
      <SyncCam cam={c} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[-6, 10, 6]} intensity={1.5} />
      <MapSlab w={MW} d={MD} />
      <MapTop rings={RINGS} P={ID} b={BOX} k={mapK} grat={0} coastW={1.7} />
      <DynSegs cap={PINS.length} pos={stems} color={CREAM} width={1.6} opacity={0.55 * dimK} />
      {heads.map((h, i) => (
        <mesh key={i} geometry={HEAD} position={h.p as [number, number, number]} scale={h.s}>
          <meshBasicMaterial color={h.bly ? blyColor : h.fresh > 0.3 ? CREAM : TEAL} transparent opacity={h.bly ? 1 : dimK} />
        </mesh>
      ))}
      {heads.filter((h) => h.fresh > 0 && !h.bly).map((h, i) => <GroundGlow key={`g${i}`} pos={[h.p[0], 0.01, h.p[2]]} r={0.32} color={TEAL} opacity={0.5 * h.fresh} />)}
      {blyK > 0 && <>
        <Poly pts={[[BLY.p[0], 0.006, BLY.p[2]], [BLY.p[0], PIN_H * 1.9 * blyK, BLY.p[2]]]} color={blyColor} width={2.6} />
        <GroundGlow pos={[BLY.p[0], 0.012, BLY.p[2]]} r={0.6} color={blyColor} opacity={0.55} />
      </>}
    </Stage>
  );
};

// ---------------------------------------------------------------- test composition
export const LANDING_MAP_TEST_FRAMES = 420;
export const LandingMapTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <LandingMap at={20} dur={360} />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);

/** The quiet ch08 variant for review: Pacific Northwest, April → May, Bly in cream, others dimmed, no chart. */
export const LANDING_MAP_BLY_TEST_FRAMES = 180;
export const LandingMapBlyTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.quiet}>
    <StepCtx.Provider value={2.5}>
      <LandingMap at={10} dur={140} from="1945-04-01" to="1945-05-10" blyColor={CREAM} dimOthers bars={false} cam="west" />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
