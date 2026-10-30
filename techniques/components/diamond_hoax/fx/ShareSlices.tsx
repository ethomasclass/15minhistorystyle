// Shares as slices (ch 5): "A share is a small slice of ownership. If the company strikes it rich, every slice is worth
// more." A drawn block on the desk (the company) slices into twelve thin slices in a wave; one slice lifts toward the camera
// (the coral subject) and grows. Then Janin's stack: the block slides away and a stack of 1,000 thin slices rises (coral),
// a counter runs to 1,000, and a hanging price tag steps from a quarter price to full.
//
// Props (frames in the parent's time; leave a beat out to skip it):
//   sliceAt   the block slices (a wave left to right), the slices part
//   liftAt    one slice lifts out toward the camera and turns coral
//   growAt    that slice grows ("every slice is worth more"), a teal note "worth more" (if `notes`)
//   stackAt   the block and slice slide away left; Janin's stack of 1,000 rises, counter 0 → 1,000 SHARES
//   priceAt   the price tag swings in: $250 a share ($10 in 1872)
//   fullAt    the tag steps to full price: $250 struck through, $1,000 a share ($40 in 1872) slaps in. Default priceAt + 40
//   cam       camera keys (raw frames). Default: a slow push in
//   notes     show the teal note and the mono labels (default true)
//
// Exports: ShareSlices, ShareSlicesTest, SHARESLICES_TEST_FRAMES.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {Finish, JF, Note, PALETTES, PaletteCtx, StepCtx} from '../kit/Kit';
import {boxGeo, camAt, type CamKey, clamp, CORAL, Edges, FACE, MoneyTag, Mono, Poly, projector, ramp, Shadow, shake, slap, Solid, Stage3D, step, TEAL,
  useCanvasTexture, type V3, smooth, CREAM} from './desk/kit3d';

const NSL = 12;
const BX = 3.0, BY = 1.7, BZ = 1.7;
const TH = BX / NSL;
const LIFT = 8; // the slice that lifts
const STACK = {x: 0.15, w: 1.5, d: 1.5, h: 2.7};

const drawLayers = (x: CanvasRenderingContext2D) => {
  const {width: w, height: h} = x.canvas;
  x.fillStyle = '#2a1714';
  x.fillRect(0, 0, w, h);
  x.strokeStyle = 'rgba(255,111,97,0.55)';
  x.lineWidth = 2;
  for (let i = 0; i < 90; i++) {
    const y = (i + 0.5) * (h / 90);
    x.beginPath(); x.moveTo(0, y); x.lineTo(w, y); x.stroke();
  }
};

const LayerStack: React.FC<{h: number; tex: THREE.Texture}> = ({h, tex}) => {
  if (h <= 0.01) return null;
  const geo = boxGeo(STACK.w, h, STACK.d);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, h / STACK.h);
  return (
    <group position={[STACK.x, h / 2, 0]}>
      <mesh geometry={geo}>
        <meshLambertMaterial map={tex} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
      </mesh>
      <Edges geo={geo} color={CORAL} width={3.2} />
    </group>
  );
};

export const SLICE_CAM: CamKey[] = [
  {f: 0, pos: [3.2, 4.6, 10.6], look: [0.2, 1.1, 0], fov: 30},
  {f: 360, pos: [2.6, 4.0, 9.0], look: [0.3, 1.2, 0], fov: 30},
];

export type ShareSlicesProps = {sliceAt?: number; liftAt?: number; growAt?: number; stackAt?: number; priceAt?: number; fullAt?: number; cam?: CamKey[]; notes?: boolean};

export const ShareSlices: React.FC<ShareSlicesProps> = ({sliceAt = 1e9, liftAt = 1e9, growAt = 1e9, stackAt = 1e9, priceAt = 1e9, fullAt, cam = SLICE_CAM, notes = true}) => {
  const f = useCurrentFrame();
  const g = step(f);
  const c = camAt(cam, f);
  const P = projector(c);
  const layers = useCanvasTexture('share-layers', 128, 512, drawLayers);
  const full = fullAt ?? priceAt + 40;

  // the block (and its slices) slide away left when the stack comes in
  const away = ramp(g, stackAt, stackAt + 16);
  const awayX = -7.5 * away * away;
  const sliced = g >= sliceAt;
  const lift = slap(g, liftAt, 10);
  const grow = 1 + 0.45 * slap(g, growAt, 10);

  const slices: React.ReactNode[] = [];
  if (away < 1) {
    if (!sliced) {
      slices.push(<group key="block" position={[awayX, BY / 2, 0]}><Solid geo={boxGeo(BX, BY, BZ)} width={3.2} /></group>);
    } else {
      for (let k = 0; k < NSL; k++) {
        const part = slap(g, sliceAt + 2 + k * 1.5, 8);
        const x0 = -BX / 2 + TH / 2 + k * TH + (k - (NSL - 1) / 2) * 0.1 * part;
        const isL = k === LIFT;
        const l = isL ? lift : 0;
        const pos: V3 = [awayX + x0 + l * 0.35, BY / 2 + l * 1.85, l * 0.7];
        const rotY = -l * 0.85;
        const s = isL ? (1 - 0.3 * l) * grow : 1;
        slices.push(
          <group key={k} position={pos} rotation={[0, rotY, l * 0.06]} scale={[s, s, s]}>
            <Solid geo={boxGeo(TH - 0.012, BY, BZ)} line={isL && l > 0.05 ? CORAL : TEAL} face={isL && l > 0.05 ? '#2a1714' : FACE} width={isL ? 3.4 : 2.6}
              opacity={1} />
          </group>,
        );
      }
    }
  }

  // Janin's stack
  const rise = g >= stackAt + 10 ? Math.min(1, smooth((g - stackAt - 10) / 26)) : 0;
  const count = Math.round(rise * 1000);
  const stackH = STACK.h * rise;

  // the hanging tag
  const tagIn = slap(g, priceAt, 8);
  const swing = g >= priceAt ? Math.sin((g - priceAt) * 0.32) * 0.35 * Math.exp(-(g - priceAt) / 30) + (g >= full ? Math.sin((g - full) * 0.5) * 0.18 * Math.exp(-(g - full) / 14) : 0) : 0;
  const hook: V3 = [STACK.x + STACK.w / 2 + 0.02, STACK.h - 0.1, STACK.d / 2 + 0.02];
  const tagLen = 0.7;
  const tagPos: V3 = [hook[0] + Math.sin(swing) * tagLen + 0.3, hook[1] - Math.cos(swing) * tagLen, hook[2] + 0.12];

  const [cxs, cys] = P([STACK.x - STACK.w / 2 - 0.35, STACK.h * 0.62, 0]);
  const [tx, ty] = P([tagPos[0] + 0.45, tagPos[1] + 0.25, tagPos[2]]);
  const [lx, ly] = P([0, BY + 0.75, 0]);
  const strike = interpolate(g, [full, full + 5], [0, 1], clamp);

  return (
    <Stage3D cam={c} ready={!!layers} lamp={[880, 470]} shakeXY={shake(f, [stackAt + 34, full + 3], 5)}
      over={<>
        {notes && g < sliceAt && <Mono text="THE COMPANY" x={lx} y={ly} anchor="c" size={22} />}
        {notes && <Note text="worth more" x={1240} y={200} size={60} rot={-4} at={growAt + 6} out={stackAt} />}
        {g >= stackAt + 10 && (
          <div style={{position: 'absolute', left: cxs, top: cys, transform: 'translate(-100%, -50%)', textAlign: 'right', opacity: Math.min(1, (g - stackAt - 10) / 4)}}>
            <div style={{fontFamily: JF.display, fontSize: 80, lineHeight: 1, color: CREAM, textShadow: '0 4px 18px rgba(0,0,0,0.85)'}}>{count.toLocaleString('en-US')}</div>
            <div style={{fontFamily: JF.mono, fontSize: 26, letterSpacing: 3, color: 'rgba(244,239,230,0.8)', marginTop: 10}}>SHARES · JANIN</div>
          </div>
        )}
        {g >= priceAt && g < full + 4 && (
          <div style={{position: 'absolute', left: tx, top: ty, opacity: g >= full ? 0.45 : Math.min(1, tagIn * 2)}}>
            <MoneyTag g={g} at={priceAt + 3} big="$250" small="A SHARE · $10 IN 1872" x={0} y={0} size={84} />
          </div>
        )}
        {g >= full && (
          <>
            <div style={{position: 'absolute', left: tx - 10, top: ty - 6, opacity: 0.55}}>
              <div style={{fontFamily: JF.display, fontSize: 52, lineHeight: 1, color: CREAM, position: 'relative'}}>
                $250
                <div style={{position: 'absolute', left: -6, top: 26, height: 5, width: `${strike * 120}%`, background: TEAL, transform: 'rotate(-8deg)', borderRadius: 3}} />
              </div>
            </div>
            <MoneyTag g={g} at={full} big="$1,000" small="A SHARE · $40 IN 1872" x={tx} y={ty + 64} size={104} />
          </>
        )}
      </>}>
      {away < 1 && <Shadow pos={[awayX, 0, 0]} size={[BX + 1.6, BZ + 1.4]} opacity={0.7} />}
      {slices}
      {lift > 0.05 && away < 1 && <Shadow pos={[awayX + -BX / 2 + TH / 2 + LIFT * TH + 0.35, 0, 0.7]} size={[1.0 * grow, 1.4 * grow]} opacity={0.35} />}
      {rise > 0 && <Shadow pos={[STACK.x, 0, 0]} size={[STACK.w + 1.4, STACK.d + 1.4]} opacity={0.75} />}
      {layers && <LayerStack h={stackH} tex={layers} />}
      {tagIn > 0 && (
        <>
          <Poly pts={[hook, tagPos]} color={TEAL} width={2} />
          <group position={tagPos} rotation={[0, -0.35, swing]} scale={[tagIn, tagIn, tagIn]}>
            <group position={[0, -0.2, 0]}><Solid geo={boxGeo(0.5, 0.4, 0.03)} width={2.4} /></group>
          </group>
        </>
      )}
    </Stage3D>
  );
};

// ---------------------------------------------------------------- test composition
export const SHARESLICES_TEST_FRAMES = 340;
export const ShareSlicesTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <AbsoluteFill style={{background: '#0d0c09'}}>
        <ShareSlices sliceAt={25} liftAt={70} growAt={110} stackAt={165} priceAt={225} fullAt={270} />
        <Finish vignette={0.3} />
      </AbsoluteFill>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
