// AltitudeRibbon (ch03 "A metal ring of sandbags kept it at the right height for three days. Then it dropped its bombs and blew
// itself up."): the flight from Japan to North America as a drawn ribbon, distance across (left → right) and altitude up.
// By day the sun warms the hydrogen and the balloon floats near 38,000 ft (above that a valve vents gas); each night it cools
// and sinks, and at 30,000 ft the barometer fires a charge that drops two sandbags, so it bounces back up: a sawtooth.
// Day/night bands behind; two cream sandbags fall at every low point and a counter runs 32 → 0; after the last pair the next
// low point releases the bombs (four small drawn bombs fall) and the balloon is gone (a small cream ring, no blast).
// The profile follows Mikesh's description of the mechanism; its exact shape is illustrative (said on screen).
//
// Props (frames in the parent's time):
//   at        the ribbon starts drawing from the launch                  default 0
//   dur       frames for the whole flight (74 hours)                     default 360
//   bombsAt   frame the bombs drop (overrides dur so they land on a word)  default at + dur·72.6/74
//   cam       'follow' (tracks the balloon) | 'wide' (all three days)     default 'follow'
//   labels    band labels, altitude guides, counter                      default true
// Exports: AltitudeRibbon, AltitudeRibbonTest, ALTITUDE_RIBBON_TEST_FRAMES.
import React, {useEffect, useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {JF, PALETTES, PaletteCtx, StepCtx, useGFrame} from '../kit/Kit';
import {Balloon, clamp, CREAM, DynSegs, Fine, Hand, Label, lerp, makeCam, Poly, project, ramp, Segs, Stage, SyncCam, TEAL} from './kit3d';

const HOURS = 74;
const BOMB_H = 72.6;
const X0 = -8, X1 = 8;
const xOf = (h: number) => X0 + ((X1 - X0) * h) / HOURS;
const yOf = (ft: number) => ((ft - 30000) / 8000) * 2.4;
const FLOOR = yOf(28000);
const ZW = 0.28; // half-width of the ribbon (z)

// ───────────── the profile (keyframes in hours, feet) ─────────────
const NIGHTS: [number, number, number][] = [[12, 24, 5], [36, 48, 5], [60, 72, 6]]; // start, end, drops (5 + 5 + 6 = 16 drops = 32 bags)
const KEYS: [number, number][] = [[0, 28000], [1.6, 37600]];
const DROPS: number[] = [];
{
  const day = (a: number, b: number) => {
    for (let h = a + 1.5; h < b - 0.5; h += 2.5) KEYS.push([h, 37600 + 400 * Math.sin(h * 1.7)]);
  };
  day(1.6, 12);
  NIGHTS.forEach(([s, e, n], k) => {
    KEYS.push([s, 37400]);
    const first = s + 1.6, span = e - 1.2 - first;
    for (let i = 0; i < n; i++) {
      const d = first + (span * i) / Math.max(1, n - 1);
      KEYS.push([d, 30000]);
      DROPS.push(d);
      if (i < n - 1) KEYS.push([d + 0.35, 33400 - (i % 2) * 300]);
    }
    if (k < NIGHTS.length - 1) {
      KEYS.push([DROPS[DROPS.length - 1] + 0.35, 33200], [e, 32400], [e + 1.6, 37600]);
      day(e + 1.6, NIGHTS[k + 1][0]);
    } else {
      KEYS.push([DROPS[DROPS.length - 1] + 0.35, 33000], [BOMB_H, 30000], [HOURS, 31200]); // the next low point: the bombs
    }
  });
}
const altAt = (h: number) => {
  if (h <= KEYS[0][0]) return KEYS[0][1];
  for (let i = 0; i < KEYS.length - 1; i++) {
    const [a, fa] = KEYS[i], [b, fb] = KEYS[i + 1];
    if (h <= b) {
      const t = (h - a) / Math.max(1e-6, b - a);
      const sink = fb < fa; // sinking eases in (gas cooling), rising is quick after a drop
      return lerp(fa, fb, sink ? t * t * (3 - 2 * t) : 1 - (1 - t) * (1 - t));
    }
  }
  return KEYS[KEYS.length - 1][1];
};
const PER_H = 12;
const NP = HOURS * PER_H + 1;
const PROF = Array.from({length: NP}, (_, i) => {
  const h = i / PER_H;
  return [xOf(h), yOf(altAt(h))];
});

// ribbon geometry (built once; drawRange shows the part flown so far)
const RIBBON = (() => {
  const pos: number[] = [];
  for (let i = 0; i < NP - 1; i++) {
    const [xa, ya] = PROF[i], [xb, yb] = PROF[i + 1];
    pos.push(xa, ya, -ZW, xb, yb, -ZW, xb, yb, ZW, xa, ya, -ZW, xb, yb, ZW, xa, ya, ZW);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
})();
const EDGE_F = new Float32Array(PROF.slice(0, -1).flatMap(([x, y], i) => [x, y, ZW, PROF[i + 1][0], PROF[i + 1][1], ZW]));
const EDGE_B = new Float32Array(PROF.slice(0, -1).flatMap(([x, y], i) => [x, y, -ZW, PROF[i + 1][0], PROF[i + 1][1], -ZW]));
const HATCH = new Float32Array(PROF.filter((_, i) => i % 4 === 0).flatMap(([x, y]) => [x, FLOOR, ZW, x, y - 0.01, ZW]));
const HATCH_PER = 4;

const BANDS = (() => {
  const out: {a: number; b: number; night: boolean; label: string}[] = [];
  let prev = 0;
  NIGHTS.forEach(([s, e], k) => {
    out.push({a: prev, b: s, night: false, label: `DAY ${k + 1}`});
    out.push({a: s, b: e, night: true, label: `NIGHT ${k + 1}`});
    prev = e;
  });
  out.push({a: prev, b: HOURS, night: false, label: 'DAY 4'});
  return out;
})();
const BAND_TOP = yOf(40200), BAND_Z = -0.7;
const BAND_LINES = new Float32Array(BANDS.slice(1).flatMap((b) => [xOf(b.a), FLOOR, BAND_Z + 0.01, xOf(b.a), BAND_TOP, BAND_Z + 0.01]));

/** A falling sandbag (small cream box) or bomb (cream cylinder with a dark band). */
const BAG = new THREE.BoxGeometry(0.09, 0.07, 0.07);
const BOMB = new THREE.CylinderGeometry(0.035, 0.035, 0.16, 10);

export type AltitudeRibbonProps = {at?: number; dur?: number; bombsAt?: number; cam?: 'follow' | 'wide'; labels?: boolean};

export const AltitudeRibbon: React.FC<AltitudeRibbonProps> = ({at = 0, dur: durIn = 360, bombsAt, cam = 'follow', labels = true}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const dur = bombsAt != null ? ((bombsAt - at) * HOURS) / BOMB_H : durIn;
  const hourOf = (fr: number) => interpolate(fr, [at, at + dur], [0, HOURS], clamp);
  const frameOfH = (h: number) => at + (h / HOURS) * dur;
  const hour = hourOf(f);
  const i = Math.min(NP - 1, Math.floor(hour * PER_H));
  const bx = xOf(hour), by = yOf(altAt(hour));

  // camera: follow the balloon (smoothly, a little behind), or the whole flight
  const follow = Math.max(-4.2, Math.min(4.2, xOf(hourOf(f - 12))));
  const c = useMemo(() => cam === 'wide'
    ? makeCam({target: [0.3, 0.9, 0], dist: 25, yaw: -0.18, pitch: 0.15, fov: 30})
    : makeCam({target: [follow + 0.6, 1.0, 0], dist: 15.5, yaw: -0.32, pitch: 0.14, fov: 30}), [cam, follow]);
  const S2 = (p: readonly number[]) => project(c, p);

  const ribbon = useMemo(() => RIBBON.clone(), []);
  useEffect(() => () => ribbon.dispose(), [ribbon]);
  ribbon.setDrawRange(0, i * 6);

  const dropsDone = DROPS.filter((d) => d <= hour).length;
  const bags = 32 - dropsDone * 2;
  const bombed = hour >= BOMB_H;
  const gone = ramp(f, frameOfH(BOMB_H) + 22, frameOfH(BOMB_H) + 30);
  const hatchN = Math.floor(i / HATCH_PER);

  // falling things: bags for each drop, bombs at the end (positions a pure function of the frame)
  const falling: {p: [number, number, number]; kind: 'bag' | 'bomb'; o: number; rot: number}[] = [];
  const fallFrames = 26;
  DROPS.forEach((d, k) => {
    const t = (f - frameOfH(d)) / fallFrames;
    if (t < 0 || t > 1) return;
    [-1, 1].forEach((s) => falling.push({p: [xOf(d) + s * 0.07 + t * 0.15, yOf(30000) - 0.5 - 2.2 * t * t, s * 0.08], kind: 'bag', o: 1 - t ** 3, rot: t * 4 * s + k}));
  });
  {
    const t = (f - frameOfH(BOMB_H)) / 34;
    if (t >= 0 && t <= 1) [-0.12, -0.04, 0.04, 0.12].forEach((s, k) => falling.push({p: [xOf(BOMB_H) + s + t * 0.2, yOf(30000) - 0.55 - 3.4 * t * t, s * 0.5], kind: 'bomb', o: 1 - t ** 4, rot: k * 0.2 + t}));
  }

  const g30 = S2([follow - 4.8, yOf(30000), ZW]), g38 = S2([follow - 4.8, yOf(38000), ZW]);
  const wide = cam === 'wide';
  const gl30 = wide ? S2([X0, yOf(30000), ZW]) : g30, gl38 = wide ? S2([X0, yOf(38000), ZW]) : g38;
  const jp = S2([X0, FLOOR, 0]), na = S2([X1, FLOOR, 0]);
  const bScr = S2([bx, by + 0.6, 0]);

  return (
    <Stage
      over={<AbsoluteFill>
        {labels && BANDS.map((b) => {
          const p = S2([xOf((b.a + b.b) / 2), BAND_TOP + 0.1, BAND_Z]);
          if (p.x < 160 || p.x > 1760 || b.b - b.a < 5) return null;
          return <Label key={b.label} x={p.x} y={p.y} text={b.label} color={b.night ? 'rgba(244,239,230,0.8)' : CREAM} size={20} bg={false} opacity={ramp(g, at, at + 8)} />;
        })}
        {labels && <>
          <Label x={wide ? gl38.x - 24 : Math.max(180, gl38.x + 30)} y={gl38.y + (wide ? 22 : -6)} anchor={wide ? 'r' : 'l'} text="38,000 FT" sub="ABOVE THIS, A VALVE VENTS GAS" opacity={ramp(g, at + 4, at + 10)} size={20} />
          <Label x={wide ? gl30.x - 24 : Math.max(180, gl30.x + 30)} y={gl30.y + (wide ? 22 : 64)} anchor={wide ? 'r' : 'l'} text="30,000 FT" sub="BAROMETER DROPS TWO SANDBAGS" opacity={ramp(g, at + 8, at + 14)} size={20} />
 {jp.x > 140 && <Label x={jp.x + (wide ? 60 : 0)} y={jp.y + 50} text="JAPAN" opacity={ramp(g, at, at + 8)} size={22} />}
          {na.x < 1780 && <Label x={na.x} y={na.y + 50} text="NORTH AMERICA" opacity={ramp(g, at + dur * 0.6, at + dur * 0.6 + 8)} size={22} />}
          {/* the counter */}
          <div style={{position: 'absolute', right: 120, top: 112, textAlign: 'right', opacity: ramp(g, at, at + 8), background: 'rgba(7,9,8,0.55)', padding: '8px 20px', borderRadius: 6}}>
            <div style={{fontFamily: JF.mono, fontSize: 22, letterSpacing: 4, color: CREAM}}>SANDBAGS LEFT</div>
            <div style={{fontFamily: JF.display, fontSize: 110, lineHeight: 1.05, color: bags === 0 ? TEAL : CREAM, textShadow: '0 4px 18px rgba(0,0,0,0.9)'}}>{bags}</div>
          </div>
          <div style={{position: 'absolute', left: 120, top: 112, opacity: ramp(g, at, at + 8), background: 'rgba(7,9,8,0.55)', padding: '8px 20px', borderRadius: 6}}>
            <div style={{fontFamily: JF.mono, fontSize: 22, letterSpacing: 4, color: CREAM}}>HOURS ALOFT</div>
            <div style={{fontFamily: JF.display, fontSize: 64, lineHeight: 1.1, color: CREAM}}>{Math.floor(Math.min(hour, BOMB_H))}</div>
          </div>
        </>}
        {bombed && <Hand f={g} text="bombs away" x={Math.min(1460, bScr.x + (cam === 'wide' ? -60 : 60))} y={bScr.y + (cam === 'wide' ? -150 : 130)} at={frameOfH(BOMB_H) + 4} size={56} rot={-4} />}
        <Fine text="FLIGHT PROFILE ILLUSTRATIVE · AFTER MIKESH (1973) · DISTANCE NOT TO SCALE" opacity={0.7 * ramp(g, at, at + 8)} />
      </AbsoluteFill>}
    >
      <SyncCam cam={c} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[-4, 8, 6]} intensity={1.4} />
      {/* day / night bands */}
      {BANDS.map((b) => (
        <mesh key={b.label} position={[(xOf(b.a) + xOf(b.b)) / 2, (BAND_TOP + FLOOR) / 2, BAND_Z]} renderOrder={-2}>
          <planeGeometry args={[xOf(b.b) - xOf(b.a), BAND_TOP - FLOOR]} />
          <meshBasicMaterial color={b.night ? '#060a14' : '#2a2518'} transparent opacity={b.night ? 0.85 : 0.45} />
        </mesh>
      ))}
      <Segs pos={BAND_LINES} color={CREAM} width={1} opacity={0.25} />
      {/* altitude guides */}
      <Poly pts={[[X0, yOf(38000), ZW], [X1, yOf(38000), ZW]]} color={CREAM} width={1.4} opacity={0.4} dashed dash={0.12} gap={0.1} />
      <Poly pts={[[X0, yOf(30000), ZW], [X1, yOf(30000), ZW]]} color={CREAM} width={1.4} opacity={0.55} dashed dash={0.12} gap={0.1} />
      <Poly pts={[[X0, FLOOR, ZW], [X1, FLOOR, ZW]]} color={TEAL} width={1.6} opacity={0.5} />
      {/* the ribbon */}
      <mesh geometry={ribbon}>
        <meshLambertMaterial color="#123b35" emissive="#0b2a26" side={THREE.DoubleSide} transparent opacity={0.9} />
      </mesh>
      <DynSegs cap={HATCH.length / 6} pos={HATCH.subarray(0, hatchN * 6)} color={TEAL} width={1} opacity={0.22} />
      <DynSegs cap={NP} pos={EDGE_B.subarray(0, i * 6)} color={TEAL} width={1.6} opacity={0.6} />
      <DynSegs cap={NP} pos={EDGE_F.subarray(0, i * 6)} color={TEAL} width={2.6} />
      {/* drop marks on the ribbon */}
      <DynSegs cap={DROPS.length} pos={new Float32Array(DROPS.filter((d) => d <= hour).flatMap((d) => [xOf(d), yOf(30000) - 0.12, ZW, xOf(d), yOf(30000) - 0.32, ZW]))} color={CREAM} width={2} opacity={0.8} />
      {falling.map((o, k) => (
        <mesh key={k} geometry={o.kind === 'bag' ? BAG : BOMB} position={o.p} rotation={[0, 0, o.rot]}>
          <meshLambertMaterial color={CREAM} emissive={CREAM} emissiveIntensity={0.35} transparent opacity={o.o} />
        </mesh>
      ))}
      {hour > 0 && gone < 1 && (
        <Balloon pos={[bx, by + 0.22 * 2.33 + 0.02, 0]} r={0.22} bags={bags / 32} opacity={1 - gone} spin={f * 0.03} />
      )}
      {gone > 0 && gone < 1 && <Poly pts={Array.from({length: 33}, (_, k) => [bx + Math.cos((k / 32) * Math.PI * 2) * (0.2 + gone * 0.6), by + 0.5 + Math.sin((k / 32) * Math.PI * 2) * (0.2 + gone * 0.6), 0])}
        color={CREAM} width={2} opacity={1 - gone} />}
    </Stage>
  );
};

// ---------------------------------------------------------------- test composition
export const ALTITUDE_RIBBON_TEST_FRAMES = 420;
export const AltitudeRibbonTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <AltitudeRibbon at={10} dur={360} />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
export const AltitudeRibbonWideTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <AltitudeRibbon at={10} dur={360} cam="wide" />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
