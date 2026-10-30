// The bank vault (ch 8, domino three): "a bank doesn't keep your money in a vault. It lends most of it out."
// A cut-away 3D bank on the desk (three.js, drawn style): no front wall, a ghosted roof, a round-door vault at the back.
// Deposits (coin and banknote tokens) pour in from the left through the side door and pile up in the vault; then most of
// the pile streams out the right door as loans to little drawn houses, shops and a mine head; a thin layer stays behind
// (the reserve: the scene's one coral element). Then a line of small silhouette figures forms at the left door, the reserve
// flies out to them, the vault is empty and its door swings shut ("That's called a bank run").
//
// Props (frames in the parent's time):
//   depositAt  tokens start pouring in (72 tokens over ~3 s), the orange dashed stream draws on, label DEPOSITS
//   loanAt     tokens stream out the right door to the buildings (57 of the 72 over ~2.7 s), label LOANS, then RESERVE
//              (coral) on the thin layer that stays
//   runAt      ten figures walk in and queue at the left door
//   emptyAt    the reserve flies out to the front of the line; ~1.5 s later the vault door swings shut (with a shake)
//   cam        camera keys (raw frames). Default: wide, a slow push in
//   labels     show the mono labels (default true)
//
// Exports: BankVault, BankVaultTest, BANKVAULT_TEST_FRAMES.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {Finish, PALETTES, PaletteCtx, StepCtx} from '../kit/Kit';
import {at3, camAt, type CamKey, CORAL, curve, curvePts, DBox, drawTape, Hull, Mono, ORANGE, Poly, projector, ramp, Shadow, shake, slap, Solid, Stage3D, step,
  TAPE_FONTS, TEAL, useCanvasTexture, type V3, boxGeo, hash, smooth} from './desk/kit3d';

// ---------------------------------------------------------------- layout
const PLINTH = 0.2;
const BW = 4.4, BD = 3.2, BH = 2.5; // walls
const DOOR_Z: [number, number] = [0.25, 1.05];
const DOOR_H = 1.35;
const LDOOR: V3 = [-BW / 2, PLINTH + 0.55, 0.65];
const RDOOR: V3 = [BW / 2, PLINTH + 0.55, 0.65];
const VAULT = {x: 0, z: -0.95, w: 1.9, h: 1.35, d: 1.1, t: 0.09};
const FLOOR_Y = PLINTH + VAULT.t;
const COIN_R = 0.125, COIN_H = 0.055;
const STACKS: [number, number][] = [];
for (let r = 0; r < 3; r++) for (let k = 0; k < 5; k++) STACKS.push([VAULT.x - 0.64 + k * 0.32, VAULT.z - 0.3 + r * 0.28]);
const NS = STACKS.length; // 15 stacks
const NDEP = 72; // tokens deposited
const NRES = NS; // the thin layer that stays (one coin per stack)
const slot = (j: number): V3 => {
  const [x, z] = STACKS[j % NS];
  return [x, FLOOR_Y + COIN_H / 2 + Math.floor(j / NS) * COIN_H, z];
};
const BUILDINGS: {kind: 'house' | 'shop' | 'mine'; pos: V3; label: string; drop: V3}[] = [
  {kind: 'house', pos: [3.75, 0, 1.0], label: 'HOMES', drop: [3.75, 1.05, 1.0]},
  {kind: 'shop', pos: [5.15, 0, -0.3], label: 'SHOPS', drop: [5.15, 1.0, -0.15]},
  {kind: 'mine', pos: [6.55, 0, 0.7], label: 'MINES', drop: [6.55, 1.6, 0.7]},
];
const QUEUE = 10;
const qslot = (k: number): V3 => [-2.75 - k * 0.5, 0, 0.75 + k * 0.1];

// ---------------------------------------------------------------- token paths (built once)
const DEP_FLY = 22, LOAN_FLY = 26, RUN_FLY = 20;
const depCurve = (j: number) => curve([
  [-7.9 + hash(j, 1) * 0.6, 2.7 + hash(j, 2) * 0.6, 0.9 + (hash(j, 3) - 0.5) * 0.5], [-4.6, 2.0, 0.8], LDOOR, [-0.9, 0.85, 0.15], [slot(j)[0], slot(j)[1] + 0.55, slot(j)[2]], slot(j),
]);
const loanCurve = (j: number, b: number) => {
  const d = BUILDINGS[b].drop;
  return curve([slot(j), [slot(j)[0], slot(j)[1] + 0.5, slot(j)[2]], [0.9, 0.85, 0.15], RDOOR, [(RDOOR[0] + d[0]) / 2, 2.3 + b * 0.25, (RDOOR[2] + d[2]) / 2], d]);
};
const runCurve = (j: number) => curve([slot(j), [slot(j)[0], slot(j)[1] + 0.5, slot(j)[2]], [-0.9, 0.85, 0.15], LDOOR, [-2.75, 0.85, 0.75]]);
const DEP = Array.from({length: NDEP}, (_, j) => depCurve(j));
const LOAN = Array.from({length: NDEP}, (_, j) => (j >= NRES ? loanCurve(j, (NDEP - 1 - j) % 3) : null));
const RUN = Array.from({length: NRES}, (_, j) => runCurve(j));
const GUIDE_DEP = curvePts(curve([[-7.6, 2.9, 0.9], [-4.6, 2.0, 0.8], LDOOR]), 40);
const GUIDE_LOAN = BUILDINGS.map((b, i) => curvePts(curve([RDOOR, [(RDOOR[0] + b.drop[0]) / 2, 2.3 + i * 0.25, (RDOOR[2] + b.drop[2]) / 2], b.drop]), 40));

// ---------------------------------------------------------------- pieces
const coinGeo = new THREE.CylinderGeometry(COIN_R, COIN_R, COIN_H, 20);
const noteGeo = new THREE.BoxGeometry(0.34, 0.016, 0.17);
const COIN_FACE = '#b9ae94';
const vaultDoorGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
const colGeo = new THREE.CylinderGeometry(0.13, 0.15, BH, 16);
const roofGeo = new THREE.ConeGeometry(0.68, 0.44, 4, 1);
const wheelGeo = new THREE.TorusGeometry(0.2, 0.025, 6, 24);

const Token: React.FC<{p: V3; note?: boolean; coral?: boolean; spin?: number}> = ({p, note, coral, spin = 0}) => (
  <group position={p} rotation={[spin * 0.6, spin, spin * 0.3]}>
    <Solid geo={note ? noteGeo : coinGeo} face={coral ? '#6b2a24' : COIN_FACE} line={coral ? CORAL : TEAL} width={1.8} angle={30} />
  </group>
);

const House: React.FC<{pos: V3}> = ({pos}) => (
  <group position={pos}>
    <DBox size={[0.9, 0.62, 0.8]} />
    <group position={[0, 0.62 + 0.22, 0]} rotation={[0, Math.PI / 4, 0]}>
      <Solid geo={roofGeo} />
    </group>
    <DBox size={[0.18, 0.32, 0.02]} pos={[0, 0, 0.41]} />
  </group>
);
const Shop: React.FC<{pos: V3}> = ({pos}) => (
  <group position={pos}>
    <DBox size={[1.1, 0.78, 0.75]} />
    <DBox size={[1.12, 0.2, 0.04]} pos={[0, 0.78, 0.36]} />
    <group position={[0, 0.5, 0.52]} rotation={[0.45, 0, 0]}><Solid geo={boxGeo(1.1, 0.03, 0.36)} /></group>
    <DBox size={[0.22, 0.38, 0.02]} pos={[-0.25, 0, 0.385]} />
  </group>
);
const Mine: React.FC<{pos: V3}> = ({pos}) => {
  const wheel = wheelGeo;
  return (
    <group position={pos}>
      <DBox size={[0.9, 0.42, 0.6]} pos={[0.45, 0, 0]} />
      <group position={[-0.28, 0, 0]} rotation={[0, 0, -0.18]}><DBox size={[0.07, 1.55, 0.07]} pos={[0, 0, 0.18]} /><DBox size={[0.07, 1.55, 0.07]} pos={[0, 0, -0.18]} /></group>
      <group position={[0.28, 0, 0]} rotation={[0, 0, 0.18]}><DBox size={[0.07, 1.55, 0.07]} pos={[0, 0, 0.18]} /><DBox size={[0.07, 1.55, 0.07]} pos={[0, 0, -0.18]} /></group>
      <DBox size={[0.5, 0.06, 0.5]} pos={[0, 1.5, 0]} />
      <group position={[0, 1.62, 0]}><Solid geo={wheel} /></group>
      <Poly pts={[[0, 1.62, 0], [0, 0.15, 0]]} width={1.6} />
    </group>
  );
};

const figBody = new THREE.CylinderGeometry(0.1, 0.15, 0.5, 12);
const figHead = new THREE.SphereGeometry(0.095, 14, 10);
const figBrim = new THREE.CylinderGeometry(0.15, 0.15, 0.018, 16);
const figCrown = new THREE.CylinderGeometry(0.075, 0.085, 0.09, 12);
const Figure: React.FC<{p: V3; face: number}> = ({p, face}) => (
  <group position={p} rotation={[0, face, 0]}>
    <Hull geo={figBody} face="#0b0a08" pos={[0, 0.25, 0]} thick={0.12} />
    <Hull geo={figHead} face="#0b0a08" pos={[0, 0.6, 0]} thick={0.14} />
    <Hull geo={figBrim} face="#0b0a08" pos={[0, 0.675, 0]} thick={0.08} />
    <Hull geo={figCrown} face="#0b0a08" pos={[0, 0.725, 0]} thick={0.12} />
  </group>
);


const Bank: React.FC<{doorOpen: number; tape: THREE.Texture}> = ({doorOpen, tape}) => {
  const y0 = PLINTH;
  const wallSeg = (x: number, z0: number, z1: number, h: number, yb = 0) => <DBox size={[0.12, h, z1 - z0]} pos={[x, y0 + yb, (z0 + z1) / 2]} />;
  return (
    <group>
      {/* plinth and steps */}
      <DBox size={[BW + 0.5, PLINTH, BD + 0.5]} pos={[0, 0, 0]} />
      {/* back wall */}
      <DBox size={[BW, BH, 0.12]} pos={[0, y0, -BD / 2]} />
      {/* side walls with a door each, cut away toward the front */}
      {[-1, 1].map((s) => (
        <group key={s}>
          {wallSeg((s * BW) / 2, -BD / 2, DOOR_Z[0], BH)}
          {wallSeg((s * BW) / 2, DOOR_Z[0], DOOR_Z[1], BH - DOOR_H, DOOR_H)}
          {wallSeg((s * BW) / 2, DOOR_Z[1], BD / 2 - 0.3, 0.9)}
        </group>
      ))}
      {/* columns at the front corners (silhouette outlines) */}
      {[-1, 1].map((s) => <Hull key={s} geo={colGeo} pos={[s * (BW / 2 - 0.05), y0 + BH / 2, BD / 2 - 0.12]} thick={0.1} />)}
      {/* ghosted entablature and pediment */}
      <group position={[0, y0 + BH, 0]}>
        <Solid geo={boxGeo(BW + 0.3, 0.3, BD + 0.2)} opacity={0.18} width={2.2} />
        <Poly pts={[[-(BW + 0.3) / 2, 0.15, BD / 2 + 0.1], [0, 0.95, BD / 2 + 0.1], [(BW + 0.3) / 2, 0.15, BD / 2 + 0.1]]} width={2.6} />
        <mesh position={[0, 0, BD / 2 + 0.13]}>
          <planeGeometry args={[1.5, 0.27]} />
          <meshBasicMaterial map={tape} transparent toneMapped={false} depthWrite={false} />
        </mesh>
      </group>
      {/* the vault: open front, round door swung open on its right hinge */}
      <group position={[VAULT.x, y0, VAULT.z]}>
        <DBox size={[VAULT.w, VAULT.t, VAULT.d]} />
        <DBox size={[VAULT.t, VAULT.h, VAULT.d]} pos={[-VAULT.w / 2, 0, 0]} />
        <DBox size={[VAULT.t, VAULT.h, VAULT.d]} pos={[VAULT.w / 2, 0, 0]} />
        <DBox size={[VAULT.w, VAULT.t, VAULT.d]} pos={[0, VAULT.h - VAULT.t, 0]} />
        <group position={[VAULT.w / 2, VAULT.h / 2, VAULT.d / 2]} rotation={[0, (doorOpen * 105 * Math.PI) / 180, 0]}>
          <group position={[-0.55, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <Solid geo={vaultDoorGeo} width={2.6} />
          </group>
          {/* the wheel on the door */}
          {[0, 1, 2].map((k) => {
            const a = (k * Math.PI) / 3;
            return <Poly key={k} pts={[[-0.55 + Math.cos(a) * 0.22, Math.sin(a) * 0.22, 0.11], [-0.55 - Math.cos(a) * 0.22, -Math.sin(a) * 0.22, 0.11]]} width={2} />;
          })}
        </group>
      </group>
    </group>
  );
};

export const BANK_CAM: CamKey[] = [
  {f: 0, pos: [0.4, 5.2, 17.4], look: [0.2, 1.75, 0], fov: 30},
  {f: 420, pos: [0.15, 4.8, 16.2], look: [0.1, 1.65, 0], fov: 30},
];

export type BankVaultProps = {depositAt?: number; loanAt?: number; runAt?: number; emptyAt?: number; cam?: CamKey[]; labels?: boolean};

export const BankVault: React.FC<BankVaultProps> = ({depositAt = 10, loanAt = 1e9, runAt = 1e9, emptyAt = 1e9, cam = BANK_CAM, labels = true}) => {
  const f = useCurrentFrame();
  const g = step(f);
  const c = camAt(cam, f);
  const P = projector(c);
  const tape = useCanvasTexture('bank-tape', 1024, 190, drawTape('BANK', 61, 150), TAPE_FONTS);

  const depS = (j: number) => depositAt + j * 1.25;
  const loanS = (j: number) => loanAt + (NDEP - 1 - j) * 1.4;
  const runS = (j: number) => emptyAt + (NRES - 1 - j) * 2;
  const reserveCoral = g >= loanAt + (NDEP - NRES) * 1.4 + LOAN_FLY;

  const tokens: React.ReactNode[] = [];
  for (let j = 0; j < NDEP; j++) {
    const s0 = depS(j);
    if (g < s0) continue;
    const isRes = j < NRES;
    const leave = isRes ? runS(j) : loanS(j);
    const fly = isRes ? RUN_FLY : LOAN_FLY;
    if (g < s0 + DEP_FLY) {
      const t = smooth((g - s0) / DEP_FLY);
      tokens.push(<Token key={j} p={at3(DEP[j], t)} note={j % 3 === 2} spin={(1 - t) * (2 + hash(j, 5) * 3)} />);
    } else if (g < leave) {
      tokens.push(<Token key={j} p={slot(j)} coral={isRes && reserveCoral} />);
    } else if (g < leave + fly) {
      const t = smooth((g - leave) / fly);
      const cv = isRes ? RUN[j] : LOAN[j]!;
      tokens.push(<Token key={j} p={at3(cv, t)} note={!isRes && j % 3 === 2} coral={isRes} spin={t * (2 + hash(j, 6) * 3)} />);
    }
  }

  const figs: React.ReactNode[] = [];
  for (let k = 0; k < QUEUE; k++) {
    const s0 = runAt + k * 4;
    if (g < s0) continue;
    const t = Math.min(1, (g - s0) / 34);
    const from: V3 = [-8.6 - k * 0.3, 0, 1.7 + k * 0.08];
    const to = qslot(k);
    const e = smooth(t);
    const bob = t < 1 ? Math.abs(Math.sin((g - s0) * 0.55)) * 0.05 : 0;
    const p: V3 = [from[0] + (to[0] - from[0]) * e, bob, from[2] + (to[2] - from[2]) * e];
    figs.push(<Figure key={k} p={p} face={Math.PI / 2 + (t < 1 ? 0 : (hash(k, 9) - 0.5) * 0.5)} />);
    figs.push(<Shadow key={`fs${k}`} pos={p} size={[0.55, 0.45]} opacity={0.7} />);
  }

  const shutAt = emptyAt + (NRES - 1) * 2 + RUN_FLY + 10;
  const doorOpen = g < shutAt ? 1 : 1 - Math.min(1.03, slap(g, shutAt, 7));
  const sh = shake(f, [shutAt + 6], 7);

  const lab = (p: V3, text: string, at: number, color?: string) => {
    if (!labels || g < at) return null;
    const [x, y] = P(p);
    return <Mono key={text} text={text} x={x} y={y} size={22} anchor="c" color={color} opacity={Math.min(1, (g - at) / 5)} />;
  };

  return (
    <Stage3D cam={c} shakeXY={sh} ready={!!tape} lamp={[900, 520]} fog={[16, 42]}
      over={<>
        {lab([-5.2, 3.3, 0.9], 'DEPOSITS', depositAt + 8)}
        {lab([3.6, 3.25, 0.6], 'LOANS', loanAt + 8)}
        {BUILDINGS.map((b) => lab([b.pos[0], -0.55, b.pos[2]], b.label, loanAt + 20))}
        {lab([0, 2.0, -0.4], 'RESERVE', loanAt + (NDEP - NRES) * 1.4 + LOAN_FLY + 4, CORAL)}
        {labels && <Mono text="NOT TO SCALE" x={1824} y={972} size={18} anchor="r" opacity={0.55} />}
      </>}>
      <Shadow pos={[0, 0, 0]} size={[BW + 2.2, BD + 2]} opacity={0.6} />
      <Bank doorOpen={doorOpen} tape={tape!} />
      <House pos={BUILDINGS[0].pos} />
      <Shop pos={BUILDINGS[1].pos} />
      <Mine pos={BUILDINGS[2].pos} />
      {BUILDINGS.map((b) => <Shadow key={b.kind} pos={b.pos} size={[1.8, 1.4]} opacity={0.6} />)}
      {/* orange dashed streams: money in, loans out */}
      <Poly pts={GUIDE_DEP} color={ORANGE} width={2.6} dashed dash={[0.16, 0.12]} opacity={0.75} draw={ramp(g, depositAt, depositAt + 14)} />
      {GUIDE_LOAN.map((pts, i) => <Poly key={i} pts={pts} color={ORANGE} width={2.6} dashed dash={[0.16, 0.12]} opacity={0.75} draw={ramp(g, loanAt + i * 4, loanAt + 14 + i * 4)} />)}
      {tokens}
      {figs}
    </Stage3D>
  );
};

// ---------------------------------------------------------------- test composition
export const BANKVAULT_TEST_FRAMES = 420;
export const BankVaultTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <AbsoluteFill style={{background: '#0d0c09'}}>
        <BankVault depositAt={10} loanAt={140} runAt={270} emptyAt={330} />
        <Finish vignette={0.3} />
      </AbsoluteFill>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
