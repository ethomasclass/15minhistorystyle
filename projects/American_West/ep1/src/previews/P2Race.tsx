// Preview P2 · the race as a 3D elevation ribbon, Sacramento -> Omaha, built from teal contour lines on the black desk.
// Elevations are approximate control points (not a DEM); the Pacific Railway Act's bond rates light up along the route
// ($16,000 / $32,000 / $48,000 a mile, Sec. 11); two engine cut-outs crawl toward Promontory.
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {Finish, JF, Note, PALETTES, PaletteCtx, StepCtx, useGFrame, useHand} from '../kit/Kit';
import {Sfx} from '../kit/common';
import {keys, ScrimTag, shake, Shots, SlapTitle, zkeys} from './fx';

export const P2_FRAMES = 450;
const PAL = PALETTES.locked;

/** [miles from Sacramento along the line, feet above sea level, label]. Approximate; see review/previews/README.md. */
const PTS: [number, number, string?][] = [
  [0, 30, 'Sacramento'], [7, 60], [54, 2420], [105, 7017, 'Donner Summit'], [120, 5850], [154, 4500, 'Reno'], [325, 4300], [480, 5060],
  [690, 4900, 'Promontory'], [744, 4300], [821, 6750], [930, 6100], [1067, 6800], [1203, 7160], [1227, 8250, 'Sherman Summit'], [1260, 6060],
  [1485, 2800, 'North Platte'], [1776, 1000, 'Omaha'],
];
const MI = 1776;
const XS = 0.9; // px per mile
const H = 380; // wall height
const FT = 0.04; // px per foot (vertical exaggeration ≈ 230×)
const elev = (mi: number) => {
  for (let i = 1; i < PTS.length; i++) {
    const [m0, e0] = PTS[i - 1];
    const [m1, e1] = PTS[i];
    if (mi <= m1) {
      const t = (mi - m0) / (m1 - m0);
      return e0 + (e1 - e0) * (1 - Math.cos(Math.PI * t)) / 2;
    }
  }
  return PTS[PTS.length - 1][1];
};
const X = (mi: number) => mi * XS;
const Y = (mi: number) => H - elev(mi) * FT;

/** Bond zones: [from mile, to mile, $ thousand per mile]. 150 miles from each range's base at treble, between them double. */
const ZONES: [number, number, number][] = [[0, 7, 16], [7, 157, 48], [157, 1110, 32], [1110, 1260, 48], [1260, MI, 16]];
const zoneColor = (k: number) => (k === 48 ? PAL.subject : k === 32 ? 'rgba(47,224,196,0.55)' : 'rgba(47,224,196,0.22)');

/** A vertical plane standing on the route line at depth `y` (world px; + is nearer the camera). */
const Upright: React.FC<{y: number; children: React.ReactNode; w?: number; extra?: number}> = ({y, children, w = MI * XS, extra = 0}) => (
  // `extra` makes the plane taller upward so content above the profile (labels) stays inside the layer's bounds
  <div style={{position: 'absolute', left: 0, top: y - H - extra, width: w, height: H + extra, transformOrigin: '50% 100%', transform: 'rotateX(-90deg)'}}>
    <div style={{position: 'absolute', left: 0, top: extra, width: w, height: H}}>{children}</div>
  </div>
);

const profilePath = (close: boolean) => {
  const pts: string[] = [];
  for (let mi = 0; mi <= MI; mi += 4) pts.push(`${X(mi).toFixed(1)},${Y(mi).toFixed(1)}`);
  return close ? `M0,${H} L${pts.join(' L')} L${X(MI)},${H} Z` : `M${pts.join(' L')}`;
};
const FILL = profilePath(true);
const LINE = profilePath(false);

/** AI-lithograph engine cut-out (RGBA) riding the profile: bottom centre a little below the line, so the engine sits low in
 * front of the ribbon and clear of the place labels above it. */
const Engine: React.FC<{src: string; size: [number, number]; w: number; mi: number; filter?: string}> = ({src, size, w, mi, filter}) => {
  const h = (w * size[1]) / size[0];
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: MI * XS, height: H, filter: 'drop-shadow(5px 6px 0 #050403)'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', left: X(mi) - w / 2, top: Y(mi) - h * 0.62, width: w, height: h, filter}} />
    </div>
  );
};

/** The whole 3D model; `lit` = frames at which each bond zone lights (or 1e7), engines' progress 0..1. */
const World: React.FC<{lit: number[]; prog: number; fx: number; z: number}> = ({lit, prog, fx, z}) => {
  // labels fade out before the camera would cut them at the frame edge (rough: ignores perspective)
  const labelOp = (x: number) => interpolate(Math.abs(x - fx) * z, [560, 700], [1, 0], clamp);
  const g = useGFrame();
  const hand = useHand();
  const cpMi = 690 * prog;
  const upMi = MI - (MI - 690) * prog;
  return (
    <>
      {/* ground: a faint teal survey grid, the bond bands under the line */}
      <div style={{position: 'absolute', left: -160, top: -420, width: MI * XS + 320, height: 760,
        backgroundImage: 'linear-gradient(rgba(47,224,196,0.16) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(47,224,196,0.16) 1.5px, transparent 1.5px)',
        backgroundSize: '64px 64px', WebkitMaskImage: 'radial-gradient(ellipse at 50% 55%, #000 40%, transparent 72%)', maskImage: 'radial-gradient(ellipse at 50% 55%, #000 40%, transparent 72%)'}} />
      {ZONES.map(([a, b, k], i) => {
        const on = interpolate(g, [lit[i], lit[i] + 6], [0, 1], clamp);
        return <div key={i} style={{position: 'absolute', left: X(a), top: -70, width: X(b) - X(a), height: 150, background: zoneColor(k), opacity: on * (k === 48 ? 0.75 : 1),
          transform: `translateZ(${on * 2}px)`, borderLeft: '2px solid rgba(47,224,196,0.6)'}} />;
      })}
      {/* litho backdrops behind the two mountain sections */}
      <Upright y={-70} w={X(MI)} extra={200}>
        {/* cut-out ridgelines (AI lithograph, transparent sky, feathered base) standing just behind the ribbon */}
        <Img src={staticFile('img/previews/ridge_sierra_a_cut.png')} style={{position: 'absolute', left: X(-60), top: H - 300, width: 640, height: 640 * 646 / 1374, opacity: 0.9, filter: 'saturate(0.75) brightness(0.9)'}} />
        <Img src={staticFile('img/previews/ridge_wyoming_a_cut.png')} style={{position: 'absolute', left: X(1040), top: H - 250 - 40, width: 560, height: 560 * 646 / 1374, opacity: 0.9, filter: 'saturate(0.75) brightness(0.9)'}} />
      </Upright>
      {/* the elevation ribbon: stacked teal contour copies of the profile, the front one filled and ribbed */}
      {[-40, -28, -16, -4].map((y, i) => (
        <Upright key={y} y={y}>
          <svg width={X(MI)} height={H} style={{overflow: 'visible'}}><path d={LINE} fill="none" stroke={PAL.mark} strokeWidth={2} opacity={0.25 + i * 0.15} /></svg>
        </Upright>
      ))}
      <Upright y={8}>
        <svg width={X(MI)} height={H} style={{overflow: 'visible'}}>
          <path d={FILL} fill="rgba(10,20,18,0.72)" />
          {Array.from({length: 75}).map((_, i) => {
            const mi = i * 24;
            return <line key={i} x1={X(mi)} y1={H} x2={X(mi)} y2={Y(mi)} stroke={PAL.mark} strokeWidth={1.2} opacity={0.35} />;
          })}
          {ZONES.map(([a, b, k], i) => {
            const on = interpolate(g, [lit[i], lit[i] + 6], [0, 1], clamp);
            return k === 48 && on > 0 ? <path key={i} d={`M${X(a)},${H} ${Array.from({length: 40}).map((_, j) => `L${X(a + ((b - a) * j) / 39).toFixed(1)},${Y(a + ((b - a) * j) / 39).toFixed(1)}`).join(' ')} L${X(b)},${H} Z`}
              fill={PAL.subject} opacity={0.55 * on} /> : null;
          })}
          <path d={LINE} fill="none" stroke={PAL.mark} strokeWidth={5} strokeLinejoin="round" />
        </svg>
      </Upright>
      <Upright y={22} extra={240}>
        {PTS.filter((p) => p[2]).map(([mi, ft, name]) => (
          <div key={name} style={{position: 'absolute', left: Math.max(6, X(mi) - 10), top: Y(mi) - 150, whiteSpace: 'nowrap', opacity: labelOp(X(mi) + 120), textShadow: '0 0 2px #111, 2px 2px 0 #111, -2px 2px 0 #111'}}>
            <div style={{fontFamily: hand.family, fontSize: 30 * hand.scale, color: PAL.mark}}>{name}</div>
            <div style={{fontFamily: JF.mono, fontSize: 16, letterSpacing: 2, color: '#fff'}}>{ft.toLocaleString('en-US')} FT</div>
          </div>
        ))}
      </Upright>
      <Upright y={30}>
        <Engine src="img/previews/engine_cp_east_b_cut.png" size={[1415, 465]} w={170} mi={cpMi} />
        <Engine src="img/previews/engine_up_west_b_cut.png" size={[1467, 512]} w={176} mi={upMi} filter="saturate(0.6)" />
      </Upright>
    </>
  );
};

/** The 3D stage: camera focus (fx world px along the line), tilt, spin, zoom. */
const Stage: React.FC<{fx: number; tilt: number; spin: number; z: number; dy?: number; lit: number[]; prog: number}> = ({fx, tilt, spin, z, dy = 0, lit, prog}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #211e18 0%, #12100c 65%, #070605 100%)', perspective: 1500, perspectiveOrigin: '50% 35%', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 960 - fx, top: 640 + dy, width: X(MI), height: 0, transformStyle: 'preserve-3d', transformOrigin: `${fx}px 0px`,
      transform: `scale(${z}) rotateX(${tilt}deg) rotateZ(${spin}deg)`}}>
      <World lit={lit} prog={prog} fx={fx} z={z} />
    </div>
  </AbsoluteFill>
);

const LIT = [168, 192, 216, 192, 168];
const progAt = (f: number) => interpolate(f, [30, 420], [0, 1], {...clamp, easing: (t) => t});

const Legend: React.FC<{at: number}> = ({at}) => {
  const g = useGFrame();
  if (g < at) return null;
  const rows: [string, string, number][] = [['$16,000 A MILE', 'flat ground', 168], ['$32,000', 'between the ranges', 192], ['$48,000', 'mountains (150 mi each)', 216]];
  return (
    <div style={{position: 'absolute', left: 110, top: 60, display: 'flex', flexDirection: 'column', gap: 14}}>
      {rows.map(([a, b, t], i) => g >= t && (
        <div key={a} style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 34, height: 22, background: zoneColor([16, 32, 48][i])}} />
          <div style={{fontFamily: JF.mono, fontSize: 26, letterSpacing: 2, color: '#fff', background: '#0b0a08', padding: '4px 10px', whiteSpace: 'nowrap'}}>{a} <span style={{color: PAL.mark}}>· {b}</span></div>
        </div>
      ))}
    </div>
  );
};

const ShotWide: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage fx={X(MI) / 2 - 80} tilt={keys(f, [[0, 64], [150, 58]])} spin={keys(f, [[0, -12], [150, -5]])} z={zkeys(f, [[0, 0.9], [150, 0.97]])} dy={110} lit={[1e7, 1e7, 1e7, 1e7, 1e7]} prog={progAt(f)} />
      <Note text="Sacramento → Omaha, 1,776 miles" x={110} y={210} size={46} rot={-3} at={30} />
    </AbsoluteFill>
  );
};

const ShotBonds: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage fx={keys(f, [[150, X(420)], [300, X(110)]])} tilt={keys(f, [[150, 60], [300, 54]])} spin={keys(f, [[150, -14], [300, -18]])} z={zkeys(f, [[150, 1.2], [300, 1.7]])} dy={150} lit={LIT} prog={progAt(f)} />
      <Legend at={160} />
      <Note text="mountain miles paid 3×" x={1180} y={860} size={54} rot={-3} at={236} />
    </AbsoluteFill>
  );
};

const ShotMeet: React.FC = () => {
  const f = useCurrentFrame();
  const sh = shake(f, [422], 9);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Stage fx={keys(f, [[300, X(560)], [450, X(760)]])} tilt={keys(f, [[300, 56], [450, 60]])} spin={keys(f, [[300, 8], [450, 2]])} z={zkeys(f, [[300, 1.6], [450, 1.0]])} dy={50} lit={LIT} prog={progAt(f)} />
      <Note text="paid by the mile: build fast, build long" x={110} y={60} size={46} rot={-3} at={330} />
    </AbsoluteFill>
  );
};

const SOUNDS: [number, string, number][] = [
  [6, 'stamp', 0.22], [28, 'marker_tick', 0.2], [146, 'whip_soft', 0.25],
  [168, 'block_tap_soft', 0.15], [192, 'block_tap_soft', 0.15], [216, 'block_tap_soft', 0.18], [234, 'marker_tick', 0.2],
  [300, 'whip_soft', 0.14], [328, 'marker_tick', 0.2], [418, 'stamp', 0.22], [421, 'spike_tap_distant', 0.15],
];

export const P2Race: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <PaletteCtx.Provider value={PAL}>
      <StepCtx.Provider value={2.5}>
        <AbsoluteFill style={{background: '#000'}}>
          <Shots shots={[[0, <ShotWide />], [150, <ShotBonds />, 'whip'], [300, <ShotMeet />, 'cut']]} />
          {f < 150 && <SlapTitle text="THE RACE" x={110} y={80} size={110} at={6} seed={45} />}
          <SlapTitle text="PROMONTORY, 1869" x={1180} y={870} size={70} at={418} seed={57} />
          <Audio src={staticFile('sfx/train_distant.wav')} loop volume={(fr) => interpolate(fr, [0, 30, P2_FRAMES - 40, P2_FRAMES - 1], [0, 0.1, 0.1, 0], clamp)} />
          {SOUNDS.map(([at, n, v], i) => <Sfx key={i} at={at} src={`sfx/${n}.wav`} volume={v} />)}
          <ScrimTag text="Elevations approx., heights exaggerated · ridges and engines: illustration (AI lithograph)" />
          <Finish vignette={0.3} />
        </AbsoluteFill>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};
