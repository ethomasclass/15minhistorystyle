// The dominoes (ch 8 → ch 9), the hero 3D piece: four tall domino tiles standing in a row on the dark desk (three.js, drawn
// style: dark faces, teal edges, teal pips), each labelled with an orange torn-tape word: INSIDERS · CRASH · BANK · EVERYONE.
// The row runs away from the camera at about 45°, so every face reads and the chain topples away from us.
//
// Props (all frames in the parent's time; leave a beat out to skip it):
//   riseAt     the tiles rise out of the desk into place, one after another (~5 frames apart), with an overshoot settle
//   nameAt     [t1, t2, t3, t4]: each tile's tape label slaps on and the tile tips toward the next one, stopping just short,
//              then rocks back and keeps a small uneasy lean (domino four has no next: it just rocks)
//   wobbleAt   extra wobbles: [{tile: 0, at}] ("Domino one, right there in the room")
//   tallerAt   the tiles grow taller (×1.45), one after another ("every day the secret held, the dominoes got taller")
//   resetAt    "The dominoes stayed standing. For now.": every tile stands straight and goes still
//   fallAt     ch 9, the real fall: domino one is pushed and all four go down. The physics (a pivoting-rigid-body solver with
//              penalty contacts) is baked once at module load per tile height, so every render worker gets the same table;
//              a small camera shake on each hit and on the last tile slamming into the desk
//   portrait   image path for tile three (Ralston, B&W archival; tinted coral while it is the coral tile). Left out, a
//              placeholder bust silhouette is drawn; `false` shows plain pips instead
//   cam        camera keys ({f, pos, look, fov}; raw frames, smooth). Default: a slow push in on the row
//   coral      which tile carries the scene's one coral element (edges): default the most recently named tile until
//              `resetAt`, then none, then tile three (the bank) from `fallAt`
//   showLabels show the tapes from the start (for a cut back to the row after ch 8 named them), default false
//
// Exports: Dominoes, DominoesTest, DOMINOES_TEST_FRAMES, dominoTop (world point of a tile's top, to pin notes with
// `projector(camAt(cam, f))`).
import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {Finish, PALETTES, PaletteCtx, StepCtx} from '../kit/Kit';
import {camAt, type CamKey, CORAL, drawTape, Poly, Shadow, shake, slap, Solid, boxGeo, Stage3D, TAPE_FONTS, TEAL, useCanvasTexture, useTexture, type V3, step} from './desk/kit3d';

// ---------------------------------------------------------------- geometry
const N = 4;
const T = 0.34; // thickness (along the row, x)
const WD = 1.3; // width of the face (z)
const H0 = 2.3; // height
const H1 = H0 * 1.45; // after "the dominoes got taller"
const GAP = 1.6; // pitch along the row
const XS = Array.from({length: N}, (_, i) => (i - (N - 1) / 2) * GAP);
const WORDS = ['INSIDERS', 'CRASH', 'BANK', 'EVERYONE'];
const DEG = Math.PI / 180;

/** The angle at which tile i's top front corner touches tile i+1's back face (standing). */
const contactAngle = (h: number) => Math.asin((GAP - T) / h);

// ---------------------------------------------------------------- the fall (baked)
export const FALL_FRAMES = 150;
type Fall = {th: Float32Array[]; hits: {f: number; amp: number}[]};

/**
 * Each tile is a rigid box pivoting on its front bottom edge (no sliding), angle θ ≥ 0 (clockwise, toward +x) up to lying
 * flat (π/2). Corners of each tile push out of its neighbours with a stiff spring-damper (penalty contact); gravity pulls on
 * the centre of mass. Domino one gets a push at frame 0. Fixed step, no randomness: identical on every worker.
 */
const simulate = (h: number): Fall => {
  const G = 22; // gravity (world units / s²), tuned for a heavy, readable topple
  const K = 9000, C = 90; // contact stiffness, damping
  const I = (h * h + T * T) / 3; // moment of inertia about the pivot edge (m = 1)
  const SUB = 80;
  const dt = 1 / 30 / SUB;
  const th = new Array(N).fill(0), om = new Array(N).fill(0);
  om[0] = 1.25;
  const pivots = XS.map((x) => x + T / 2);
  const local: [number, number][] = [[-T, 0], [-T, h], [0, h], [0, 0]];
  const toWorld = (j: number, lx: number, ly: number): [number, number] => {
    const c = Math.cos(th[j]), s = Math.sin(th[j]);
    return [pivots[j] + lx * c + ly * s, -lx * s + ly * c];
  };
  const toLocal = (j: number, x: number, y: number): [number, number] => {
    const dx = x - pivots[j], dy = y;
    const c = Math.cos(th[j]), s = Math.sin(th[j]);
    return [dx * c - dy * s, dx * s + dy * c];
  };
  const nWorld = (j: number, nx: number, ny: number): [number, number] => {
    const c = Math.cos(th[j]), s = Math.sin(th[j]);
    return [nx * c + ny * s, -nx * s + ny * c];
  };
  const vel = (j: number, x: number, y: number): [number, number] => [om[j] * y, -om[j] * (x - pivots[j])];
  const out: Float32Array[] = [];
  const hits: {f: number; amp: number}[] = [];
  const touching = new Array(N).fill(false);
  const floored = new Array(N).fill(false);
  for (let f = 0; f <= FALL_FRAMES; f++) {
    out.push(Float32Array.from(th));
    for (let s = 0; s < SUB; s++) {
      const tau = th.map((a) => G * (-T / 2 * Math.cos(a) + h / 2 * Math.sin(a)));
      const touchNow = new Array(N).fill(false);
      for (let i = 0; i < N - 1; i++) {
        for (const [A, B] of [[i, i + 1], [i + 1, i]]) {
          for (const [lx0, ly0] of local) {
            const [px, py] = toWorld(A, lx0, ly0);
            const [lx, ly] = toLocal(B, px, py);
            if (!(lx > -T && lx < 0 && ly > 0 && ly < h)) continue;
            const cands: [number, number, number][] = [[lx + T, -1, 0], [-lx, 1, 0], [h - ly, 0, 1]];
            cands.sort((a, b) => a[0] - b[0]);
            const [d, nlx, nly] = cands[0];
            const [nx, ny] = nWorld(B, nlx, nly);
            const va = vel(A, px, py), vb = vel(B, px, py);
            const vn = (va[0] - vb[0]) * nx + (va[1] - vb[1]) * ny;
            const F = Math.max(0, K * d - C * vn);
            if (F <= 0) continue;
            touchNow[i] = true;
            // clockwise torque from force (Fx, Fy) at (px, py) about a pivot: -(rx Fy - ry Fx)
            const ta = -((px - pivots[A]) * (F * ny) - py * (F * nx));
            const tb = -((px - pivots[B]) * (-F * ny) - py * (-F * nx));
            tau[A] += ta;
            tau[B] += tb;
          }
        }
      }
      for (let j = 0; j < N; j++) {
        om[j] += (tau[j] / I) * dt;
        om[j] *= 0.99995;
        th[j] += om[j] * dt;
        if (th[j] < 0) { th[j] = 0; om[j] = Math.max(0, om[j]); }
        if (th[j] > Math.PI / 2) {
          if (!floored[j] && om[j] > 1) { floored[j] = true; hits.push({f, amp: j === N - 1 ? 10 : 5}); }
          th[j] = Math.PI / 2;
          om[j] = -0.18 * om[j];
        }
      }
      for (let i = 0; i < N - 1; i++) {
        if (touchNow[i] && !touching[i]) hits.push({f, amp: 3.5});
        touching[i] = touchNow[i];
      }
    }
  }
  // keep the first contact of each pair and the floor hits; drop chatter
  const seen: number[] = [];
  const clean = hits.filter((x) => { if (seen.some((s) => Math.abs(s - x.f) < 3)) return false; seen.push(x.f); return true; });
  return {th: out, hits: clean};
};
const FALLS = new Map<number, Fall>();
const fallFor = (h: number) => {
  let r = FALLS.get(h);
  if (!r) { r = simulate(h); FALLS.set(h, r); }
  return r;
};
// bake both heights at module load
fallFor(H0);
fallFor(H1);

// ---------------------------------------------------------------- choreography (pure functions of the stepped frame)
/** The lean of a tile named at `at` (tips toward the next, stops short, rocks back, keeps an uneasy lean). */
const nameLean = (g: number, at: number, max: number, rest: number) => {
  const t = g - at;
  if (t < 0) return 0;
  if (t < 7) return max * Math.sin((t / 7) * Math.PI / 2);
  if (t < 12) return max + Math.sin(t * 2.1) * 0.6 * DEG;
  const u = t - 12;
  const v = rest + (max - rest) * Math.exp(-u / 5) * Math.cos(u * 0.42);
  return Math.max(-2.5 * DEG, v);
};
/** A wobble: a short rock forward and back. */
const wobble = (g: number, at: number, amp = 9 * DEG) => {
  const t = g - at;
  if (t < 0 || t > 40) return 0;
  return amp * Math.exp(-t / 9) * Math.sin(t * 0.5);
};

// ---------------------------------------------------------------- tile
const tapeKey = (i: number) => `domino-tape-${i}`;

const Pips: React.FC<{n: number; cy: number; color: string}> = ({n, cy, color}) => {
  const layouts: Record<number, [number, number][]> = {
    1: [[0, 0]], 2: [[-0.3, 0.3], [0.3, -0.3]], 3: [[-0.33, 0.33], [0, 0], [0.33, -0.33]], 4: [[-0.3, 0.3], [0.3, 0.3], [-0.3, -0.3], [0.3, -0.3]],
  };
  return (
    <>
      {layouts[n].map(([u, v], k) => (
        <mesh key={k} position={[0, cy + v, u]} rotation={[0, -Math.PI / 2, 0]}>
          <circleGeometry args={[0.1, 24]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </>
  );
};

const drawPlaceholder = (x: CanvasRenderingContext2D) => {
  x.fillStyle = '#26221d';
  x.fillRect(0, 0, 380, 440);
  x.fillStyle = '#8a837a';
  // head-and-shoulders bust
  x.beginPath(); x.ellipse(190, 170, 78, 96, 0, 0, Math.PI * 2); x.fill();
  x.beginPath(); x.moveTo(40, 440); x.bezierCurveTo(50, 320, 120, 280, 190, 280); x.bezierCurveTo(260, 280, 330, 320, 340, 440); x.fill();
  x.strokeStyle = '#8a837a'; x.lineWidth = 10; x.strokeRect(5, 5, 370, 430);
};

const Portrait: React.FC<{tex: THREE.Texture; cy: number; coral: number}> = ({tex, cy, coral}) => {
  const col = new THREE.Color('#d8d4cc').lerp(new THREE.Color(CORAL), coral);
  return (
    <mesh position={[0, cy, 0]} rotation={[0, -Math.PI / 2, 0]}>
      <planeGeometry args={[0.92, 1.02]} />
      <meshBasicMaterial map={tex} color={col} toneMapped={false} />
    </mesh>
  );
};

const Tile: React.FC<{i: number; h: number; rise: number; lean: number; tape: number; line: string; tex: THREE.Texture; portrait: THREE.Texture | null; coral: number}> = ({
  i, h, rise, lean, tape, line, tex, portrait, coral,
}) => {
  if (rise <= 0.001) return null;
  const hh = h * rise;
  const pivot = lean >= 0 ? T / 2 : -T / 2;
  const fx = -T / 2 - 0.004; // the face toward the camera (−x)
  const showFace = rise > 0.95;
  return (
    <group position={[XS[i] + pivot, 0, 0]} rotation={[0, 0, -lean]}>
      <group position={[-pivot, 0, 0]}>
        <group position={[0, hh / 2, 0]}>
          <Solid geo={boxGeo(T, hh, WD)} line={line} width={3.2} />
        </group>
        {showFace && <group position={[fx, 0, 0]}>
          {/* divider across the middle of the face */}
          <Poly pts={[[0, h * 0.5, -WD * 0.38], [0, h * 0.5, WD * 0.38]]} color={line} width={2.4} />
          {portrait && i === 2 ? <Portrait tex={portrait} cy={h * 0.75} coral={coral} /> : <Pips n={i + 1} cy={h * 0.75} color={line} />}
          {tex && tape > 0 && (
            <mesh position={[-0.002, h * 0.27, 0]} rotation={[(i % 2 ? 3 : -3) * DEG, -Math.PI / 2, 0]} scale={[1.35 - 0.35 * tape, 1.35 - 0.35 * tape, 1]}>
              <planeGeometry args={[1.28, 0.41]} />
              <meshBasicMaterial map={tex} transparent opacity={Math.min(1, tape * 2)} toneMapped={false} depthWrite={false} />
            </mesh>
          )}
        </group>}
      </group>
    </group>
  );
};

/** World position of the top centre of tile i (standing), for pinning HTML notes to it. */
export const dominoTop = (i: number, tall = false): V3 => [XS[i], tall ? H1 : H0, 0];

export const DOMINO_CAM: CamKey[] = [
  {f: 0, pos: [-8.4, 4.0, 9.6], look: [0.5, 1.55, 0], fov: 30},
  {f: 420, pos: [-7.2, 3.7, 8.2], look: [0.6, 1.7, 0], fov: 30},
];

export type DominoProps = {riseAt?: number; nameAt?: number[]; wobbleAt?: {tile: number; at: number}[]; tallerAt?: number; resetAt?: number; fallAt?: number;
  portrait?: string | false; cam?: CamKey[]; coral?: number | null; showLabels?: boolean};

export const Dominoes: React.FC<DominoProps> = ({riseAt = -999, nameAt = [], wobbleAt = [], tallerAt = 1e9, resetAt = 1e9, fallAt = 1e9, portrait, cam = DOMINO_CAM, coral, showLabels = false}) => {
  const f = useCurrentFrame();
  const g = step(f);
  const c = camAt(cam, f);
  const tapes = WORDS.map((w, i) => useCanvasTexture(tapeKey(i), 1024, 330, drawTape(w, 31 + i * 7, 210), TAPE_FONTS)); // eslint-disable-line react-hooks/rules-of-hooks
  const photo = useTexture(portrait || undefined);
  const ph = useCanvasTexture('domino-portrait-placeholder', 380, 440, drawPlaceholder);
  const pic = portrait === false ? null : portrait ? photo : ph;
  const ready = tapes.every(Boolean) && (portrait === false || !!pic);

  const tall = (i: number) => Math.min(1.08, slap(g, tallerAt + i * 4, 12));
  const height = (i: number) => H0 + (H1 - H0) * tall(i);
  const fallH = tallerAt < fallAt ? H1 : H0;
  const fall = fallFor(fallH);
  const fi = Math.max(0, Math.min(FALL_FRAMES, Math.floor(g - fallAt)));
  const falling = g >= fallAt;

  const named = (i: number) => showLabels || (nameAt[i] !== undefined && g >= nameAt[i]);
  const lastNamed = nameAt.reduce((acc, at, i) => (g >= at ? i : acc), -1);
  const coralTile = coral !== undefined ? coral : falling ? 2 : g >= resetAt ? -1 : lastNamed;

  const tiles = Array.from({length: N}, (_, i) => {
    const h = height(i);
    const rise = riseAt < -900 ? 1 : slap(g, riseAt + i * 5, 10);
    let lean = 0;
    if (falling) lean = fall.th[fi][i];
    else {
      const max = (i < N - 1 ? contactAngle(h) * 0.82 : 14 * DEG);
      const rest = 3.5 * DEG + (i === 0 ? 0.5 * DEG : 0);
      if (nameAt[i] !== undefined) lean += nameLean(g, nameAt[i], max, rest);
      for (const w of wobbleAt) if (w.tile === i) lean += wobble(g, w.at);
      if (g >= resetAt) {
        const k = g - resetAt;
        lean = k < 8 ? lean * (1 - k / 8) - Math.sin((k / 8) * Math.PI) * 1.2 * DEG : 0;
      } else if (nameAt[i] !== undefined && g > nameAt[i] + 40) lean += Math.sin(g * 0.9 + i) * 0.35 * DEG; // uneasy tremble
    }
    const tape = named(i) ? (showLabels && (nameAt[i] === undefined || g < nameAt[i]) ? 1 : slap(g, nameAt[i] ?? -999, 6)) : 0;
    return {i, h, rise, lean, tape, line: i === coralTile ? CORAL : TEAL, coral: i === coralTile ? 1 : 0};
  });

  const hits = falling ? fall.hits.map((x) => ({f: fallAt + x.f, amp: x.amp})) : [];
  let sh = {x: 0, y: 0};
  for (const hh of hits) { const s = shake(f, [hh.f], hh.amp); sh = {x: sh.x + s.x, y: sh.y + s.y}; }
  const riseHits = riseAt > -900 ? XS.map((_, i) => riseAt + i * 5 + 6) : [];
  const rs = shake(f, riseHits, 2.5);
  sh = {x: sh.x + rs.x, y: sh.y + rs.y};

  return (
    <Stage3D cam={c} shakeXY={sh} lamp={[900, 430]} ready={ready}>
      {tiles.map((t) => {
        // contact shadow: follows the tile's footprint as it tips
        const reach = t.h * Math.sin(Math.max(0, t.lean));
        const cx = XS[t.i] + reach / 2;
        return t.rise > 0.001 ? <Shadow key={`s${t.i}`} pos={[cx, 0, 0]} size={[T + reach + 0.9, WD + 0.9]} opacity={0.75} /> : null;
      })}
      {tiles.map((t) => <Tile key={t.i} {...t} tex={tapes[t.i]!} portrait={pic} />)}
    </Stage3D>
  );
};

// ---------------------------------------------------------------- test composition
// (two shots in one test: the ch 8 push in, then the ch 9 fall seen from higher, framed on where the tiles land)
const TEST_CAM: CamKey[] = [
  {f: 0, pos: [-8.4, 4.0, 9.6], look: [0.5, 1.55, 0], fov: 30},
  {f: 300, pos: [-7.4, 3.8, 8.6], look: [0.6, 1.8, 0], fov: 30},
  {f: 330, pos: [-7.4, 3.8, 8.6], look: [0.6, 1.8, 0], fov: 30},
  {f: 440, pos: [-6.2, 7.4, 8.6], look: [1.9, 0.4, 0], fov: 30},
];
export const DOMINOES_TEST_FRAMES = 450;
export const DominoesTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <AbsoluteFill style={{background: '#0d0c09'}}>
        <Dominoes riseAt={8} nameAt={[45, 80, 115, 150]} wobbleAt={[{tile: 0, at: 200}]} tallerAt={235} resetAt={275} fallAt={320} cam={TEST_CAM} />
        <Finish vignette={0.3} />
      </AbsoluteFill>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
