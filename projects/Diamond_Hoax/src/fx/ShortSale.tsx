// The short sale (ch 7): "To sell short is to bet that a price will crash." Four drawn lanes left to right on the desk,
// each with an orange torn-tape header: BORROW → SELL → CRASH → RETURN. One coral share token (the same slice as in
// ShareSlices) travels the lanes: it slides in from the back (borrowed; the cup_of_sugar prop pops up beside it: "like
// borrowing a cup of sugar"), hops to SELL (+$1,000), hops to CRASH and shrinks with a thud ($20), hops to RETURN and slides
// back out to its owner (keep $980).
//
// Props (frames in the parent's time; leave a beat out to skip it):
//   at         the four trays and the arrows between them draw in
//   borrowAt   header BORROW; the token slides in from the back of lane one
//   sugarAt    the cup of sugar pops up beside it (default borrowAt + 24)
//   sellAt     header SELL; the token hops to lane two; +$1,000
//   crashAt    header CRASH; the token hops to lane three and shrinks (thud, shake); $20
//   returnAt   header RETURN; the token hops to lane four and slides back out the back; keep $980
//   cam        camera keys (raw frames). Default: a slow push in over all four lanes
//
// Exports: ShortSale, ShortSaleTest, SHORTSALE_TEST_FRAMES.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {Finish, PALETTES, PaletteCtx, StepCtx} from '../kit/Kit';
import {boxGeo, camAt, type CamKey, CORAL, drawTape, MoneyTag, Poly, projector, ramp, Shadow, shake, slap, Solid, Stage3D, step, TAPE_FONTS, TEAL,
  useCanvasTexture, type V3, smooth} from './desk/kit3d';

const LANES = ['BORROW', 'SELL', 'CRASH', 'RETURN'];
const PITCH = 2.6;
const LX = LANES.map((_, i) => (i - 1.5) * PITCH);
const TRAY: V3 = [2.2, 0.06, 2.4];
const TOKEN: V3 = [0.95, 1.2, 0.12];

/** A cut-out prop popping up at a screen point (B&W, drop shadow), as Kit's Prop but centred and slapped. */
const PropPop: React.FC<{name: string; x: number; y: number; w: number; g: number; at: number; rot?: number}> = ({name, x, y, w, g, at, rot = 0}) => {
  if (g < at) return null;
  const k = slap(g, at, 7);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `translate(-50%, -100%) rotate(${rot}deg) scale(${(0.4 + 0.6 * k).toFixed(3)})`, transformOrigin: '50% 100%',
      opacity: Math.min(1, k * 2), filter: 'drop-shadow(0 18px 20px rgba(0,0,0,0.7))'}}>
      <Img src={staticFile(`img/props/${name}.webp`)} style={{width: '100%', display: 'block', filter: 'grayscale(1) contrast(1.15) brightness(0.95)'}} />
    </div>
  );
};

export const SHORT_CAM: CamKey[] = [
  {f: 0, pos: [0, 9.4, 12.0], look: [0, 0.35, -0.4], fov: 30},
  {f: 330, pos: [0, 8.6, 10.9], look: [0, 0.35, -0.4], fov: 30},
];

export type ShortSaleProps = {at?: number; borrowAt?: number; sugarAt?: number; sellAt?: number; crashAt?: number; returnAt?: number; cam?: CamKey[]};

export const ShortSale: React.FC<ShortSaleProps> = ({at = 0, borrowAt = 1e9, sugarAt, sellAt = 1e9, crashAt = 1e9, returnAt = 1e9, cam = SHORT_CAM}) => {
  const f = useCurrentFrame();
  const g = step(f);
  const c = camAt(cam, f);
  const P = projector(c);
  const tapes = LANES.map((w, i) => useCanvasTexture(`short-tape-${w}`, 1024, 260, drawTape(w, 71 + i * 5, 190), TAPE_FONTS)); // eslint-disable-line react-hooks/rules-of-hooks
  const beats = [borrowAt, sellAt, crashAt, returnAt];
  const sugar = sugarAt ?? borrowAt + 24;

  // the token's path: in from the back, three hops, back out
  const HOP = 13;
  const hop = (from: number, to: number, t: number): V3 => {
    const e = smooth(t);
    return [LX[from] + (LX[to] - LX[from]) * e, Math.sin(Math.PI * t) * 1.3, 0.15];
  };
  let tok: V3 | null = null;
  let scale = 1;
  let spin = 0;
  if (g >= borrowAt) {
    const tin = Math.min(1, (g - borrowAt) / 12);
    tok = [LX[0], 0, -3.4 + 3.55 * Math.min(1.03, slap(g, borrowAt, 12))];
    if (tin < 1) spin = 0;
  }
  if (g >= sellAt) tok = hop(0, 1, Math.min(1, (g - sellAt) / HOP));
  if (g >= crashAt) tok = hop(1, 2, Math.min(1, (g - crashAt) / HOP));
  if (g >= crashAt + HOP) scale = 1 - 0.7 * Math.min(1.04, slap(g, crashAt + HOP, 6));
  if (g >= returnAt) {
    scale = 0.3;
    tok = hop(2, 3, Math.min(1, (g - returnAt) / HOP));
    const back = ramp(g, returnAt + HOP + 6, returnAt + HOP + 24);
    if (back > 0) tok = [LX[3], 0, 0.15 - 3.8 * back];
    if (back >= 1) tok = null;
  }
  if (tok && g >= sellAt && g < sellAt + HOP) spin = Math.sin(Math.PI * ((g - sellAt) / HOP)) * 0.4;

  const sh = shake(f, [crashAt + HOP + 2], 9);
  const lane = (i: number) => {
    const k = ramp(g, at + i * 3, at + i * 3 + 10);
    const lit = g >= beats[i] && (i === 3 || g < beats[i + 1]);
    return {k, lit};
  };

  const tag = (i: number, big: string, small: string | undefined, atF: number) => {
    const [x, yy] = P([LX[i], 0, TRAY[2] / 2 + 0.45]);
    return <MoneyTag g={g} at={atF} big={big} small={small} x={x} y={yy} size={80} anchor="c" />;
  };
  const [sx, sy] = P([LX[0] - 0.62, 0.05, 0.85]);

  return (
    <Stage3D cam={c} shakeXY={sh} ready={tapes.every(Boolean)} lamp={[960, 520]} fog={[16, 40]}
      over={<>
        <PropPop name="cup_of_sugar" x={sx} y={sy} w={150} g={g} at={sugar} rot={-4} />
        {tag(1, '+$1,000', 'SOLD', sellAt + HOP)}
        {tag(2, '$20', 'BUY ONE BACK', crashAt + HOP + 4)}
        {tag(3, '$980', 'YOU KEEP', returnAt + HOP + 14)}
      </>}>
      {LANES.map((w, i) => {
        const {k, lit} = lane(i);
        if (k <= 0) return null;
        return (
          <group key={w} position={[LX[i], 0, 0]} scale={[k, 1, k]}>
            <Shadow pos={[0, 0, 0]} size={[TRAY[0] + 0.8, TRAY[2] + 0.8]} opacity={0.6} />
            <group position={[0, TRAY[1] / 2, 0]}><Solid geo={boxGeo(...TRAY)} line={TEAL} width={lit ? 3.4 : 2.2} opacity={1} /></group>
            {/* inner rim line */}
            <Poly pts={[[-TRAY[0] / 2 + 0.15, TRAY[1] + 0.003, -TRAY[2] / 2 + 0.15], [TRAY[0] / 2 - 0.15, TRAY[1] + 0.003, -TRAY[2] / 2 + 0.15], [TRAY[0] / 2 - 0.15, TRAY[1] + 0.003, TRAY[2] / 2 - 0.15],
              [-TRAY[0] / 2 + 0.15, TRAY[1] + 0.003, TRAY[2] / 2 - 0.15], [-TRAY[0] / 2 + 0.15, TRAY[1] + 0.003, -TRAY[2] / 2 + 0.15]]} width={1.4} opacity={lit ? 0.8 : 0.35} />
            {/* the header tape, standing at the back of the lane */}
            {tapes[i] && g >= beats[i] && (() => {
              const s = slap(g, beats[i], 6);
              return (
                <mesh position={[0, 1.55, -TRAY[2] / 2 - 0.1]} rotation={[-0.35, 0, (i % 2 ? 2 : -2) * Math.PI / 180]} scale={[1.3 - 0.3 * s, 1.3 - 0.3 * s, 1]}>
                  <planeGeometry args={[2.0, 0.51]} />
                  <meshBasicMaterial map={tapes[i]!} transparent opacity={Math.min(1, s * 2)} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} />
                </mesh>
              );
            })()}
          </group>
        );
      })}
      {/* arrows between lanes */}
      {[0, 1, 2].map((i) => {
        const k = ramp(g, at + 8 + i * 3, at + 16 + i * 3);
        const xm = (LX[i] + LX[i + 1]) / 2;
        return k > 0 ? <Poly key={i} pts={[[xm - 0.12, 0.01, -0.28], [xm + 0.14, 0.01, 0], [xm - 0.12, 0.01, 0.28]]} width={3} draw={k} /> : null;
      })}
      {tok && (
        <>
          <Shadow pos={[tok[0], 0.06, tok[2]]} size={[1.2 * scale, 0.7 * scale]} opacity={0.75 * Math.max(0.3, 1 - tok[1] / 1.6)} />
          <group position={[tok[0], tok[1] + 0.06, tok[2]]} rotation={[0, spin, spin * 0.3]} scale={[scale, scale, scale]}>
            <group position={[0, TOKEN[1] / 2, 0]}><Solid geo={boxGeo(...TOKEN)} face="#2a1714" line={CORAL} width={3.4} /></group>
          </group>
        </>
      )}
    </Stage3D>
  );
};

// ---------------------------------------------------------------- test composition
export const SHORTSALE_TEST_FRAMES = 330;
export const ShortSaleTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <AbsoluteFill style={{background: '#0d0c09'}}>
        <ShortSale at={5} borrowAt={30} sugarAt={62} sellAt={110} crashAt={175} returnAt={235} />
        <Finish vignette={0.3} />
      </AbsoluteFill>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
