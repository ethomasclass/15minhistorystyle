// Preview P2 · the race as a 3D elevation ribbon, Sacramento -> Omaha, built from teal contour lines on the black desk.
// Elevations are approximate control points (not a DEM); the Pacific Railway Act's bond rates light up along the route
// ($16,000 / $32,000 / $48,000 a mile, Sec. 11); two engine cut-outs crawl toward Promontory.
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {Finish, Highlight, JF, Note, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame, useHand} from '../kit/Kit';
import {SM, SZ} from '../samples/masks';
import type {MaskRef} from '../kit/maskref';
import {keys, shake, Shots, useSlap, zkeys} from './fx';

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
const Upright: React.FC<{y: number; children: React.ReactNode; w?: number}> = ({y, children, w = MI * XS}) => (
  <div style={{position: 'absolute', left: 0, top: y - H, width: w, height: H, transformOrigin: '50% 100%', transform: 'rotateX(-90deg)'}}>{children}</div>
);

const profilePath = (close: boolean) => {
  const pts: string[] = [];
  for (let mi = 0; mi <= MI; mi += 4) pts.push(`${X(mi).toFixed(1)},${Y(mi).toFixed(1)}`);
  return close ? `M0,${H} L${pts.join(' L')} L${X(MI)},${H} Z` : `M${pts.join(' L')}`;
};
const FILL = profilePath(true);
const LINE = profilePath(false);

/** Engine cut-out standing on the profile: mask bbox bottom-centre at (x, y) in the plane. */
const Engine: React.FC<{src: string; size: [number, number]; mask: MaskRef; scale: number; mi: number}> = ({src, size, mask, scale, mi}) => {
  const [bx0, , bx1, by1] = mask.data.boxes.subject;
  const left = X(mi) - ((bx0 + bx1) / 2) * scale;
  const top = Y(mi) - by1 * scale + 4;
  const m = {WebkitMaskImage: `url(${staticFile(mask.alpha)})`, WebkitMaskSize: '100% 100%', maskImage: `url(${staticFile(mask.alpha)})`, maskSize: '100% 100%'} as React.CSSProperties;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: MI * XS, height: H, filter: 'drop-shadow(5px 6px 0 #050403)'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', left, top, width: size[0] * scale, height: size[1] * scale, filter: 'grayscale(1) contrast(1.2)', ...m}} />
    </div>
  );
};

/** The whole 3D model; `lit` = frames at which each bond zone lights (or 1e7), engines' progress 0..1. */
const World: React.FC<{lit: number[]; prog: number}> = ({lit, prog}) => {
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
      <Upright y={-300} w={X(MI)}>
        <Img src={staticFile('img/previews/litho_sierra_medium.jpg')} style={{position: 'absolute', left: -120, top: 20, width: 620, height: 354, opacity: 0.6, filter: 'saturate(0.7) brightness(0.85)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 15%, #000 70%, transparent 100%)', maskImage: 'linear-gradient(90deg, transparent 0%, #000 15%, #000 70%, transparent 100%)'}} />
        <Img src={staticFile('img/previews/litho_plains_medium.jpg')} style={{position: 'absolute', left: X(980), top: 40, width: 600, height: 343, opacity: 0.5, filter: 'saturate(0.6) brightness(0.8)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 20%, #000 75%, transparent 100%)', maskImage: 'linear-gradient(90deg, transparent 0%, #000 20%, #000 75%, transparent 100%)'}} />
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
        {PTS.filter((p) => p[2]).map(([mi, ft, name]) => (
          <div key={name} style={{position: 'absolute', left: X(mi) - 10, top: Y(mi) - 92, whiteSpace: 'nowrap', textShadow: '0 0 2px #111, 2px 2px 0 #111, -2px 2px 0 #111'}}>
            <div style={{fontFamily: hand.family, fontSize: 30 * hand.scale, color: PAL.mark, transform: 'rotate(-4deg)'}}>{name}</div>
            <div style={{fontFamily: JF.mono, fontSize: 16, letterSpacing: 2, color: '#fff'}}>{ft.toLocaleString('en-US')} FT</div>
          </div>
        ))}
      </Upright>
      <Upright y={30}>
        <Engine src="img/previews/hart_goliah_mirrored_w.jpg" size={SZ.goliah} mask={SM.goliah} scale={0.12} mi={cpMi} />
        <Engine src="img/previews/carbutt_up_100th_1866_w.jpg" size={SZ.carbutt} mask={SM.up} scale={0.15} mi={upMi} />
      </Upright>
    </>
  );
};

/** The 3D stage: camera focus (fx world px along the line), tilt, spin, zoom. */
const Stage: React.FC<{fx: number; tilt: number; spin: number; z: number; dy?: number; lit: number[]; prog: number}> = ({fx, tilt, spin, z, dy = 0, lit, prog}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #211e18 0%, #12100c 65%, #070605 100%)', perspective: 1500, perspectiveOrigin: '50% 35%', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 960 - fx, top: 640 + dy, width: X(MI), height: 0, transformStyle: 'preserve-3d', transformOrigin: `${fx}px 0px`,
      transform: `scale(${z}) rotateX(${tilt}deg) rotateZ(${spin}deg)`}}>
      <World lit={lit} prog={prog} />
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
      <Stage fx={keys(f, [[150, X(420)], [300, X(110)]])} tilt={keys(f, [[150, 60], [300, 54]])} spin={keys(f, [[150, -14], [300, -18]])} z={zkeys(f, [[150, 1.25], [300, 2.1]])} dy={60} lit={LIT} prog={progAt(f)} />
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

const PromontoryTag: React.FC = () => {
  const s = useSlap(418, 1.35);
  if (!s.on) return null;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${s.scale})`, transformOrigin: '1400px 900px'}}>
      <Highlight text="PROMONTORY, 1869" x={1180} y={870} size={70} at={418} seed={57} rot={-2} />
    </div>
  );
};

const TitleSlap: React.FC = () => {
  const s = useSlap(6, 1.35);
  if (!s.on) return null;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${s.scale})`, transformOrigin: '400px 140px'}}>
      <Highlight text="THE RACE" x={110} y={80} size={110} at={6} seed={45} rot={-2} />
    </div>
  );
};

export const P2Race: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <PaletteCtx.Provider value={PAL}>
      <StepCtx.Provider value={2.5}>
        <AbsoluteFill style={{background: '#000'}}>
          <Shots shots={[[0, <ShotWide />], [150, <ShotBonds />, 'whip'], [300, <ShotMeet />, 'cut']]} />
          {f < 150 && <TitleSlap />}
          <PromontoryTag />
          <Tag text="Elevations approx. · Sierra & Wyoming backdrops: illustration (AI lithograph) · engines: A. A. Hart (mirrored), J. Carbutt 1866 · LOC" x={44} y={1036} />
          <Finish vignette={0.3} />
        </AbsoluteFill>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};
