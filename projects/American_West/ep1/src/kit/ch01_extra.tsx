// Shared pieces for chapters 1-3 (Ep 1): the series map (our own drawn West, tilted in 3D), the race ribbon (from P2),
// the land-grant township and the Act page (from P3), the House of empty chairs, bare-handwriting lines with a coral word,
// tally marks and dark index cards. Everything stays on the black desk: dark land, teal lines, one coral subject.
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {boxOf, JF, PALETTES, useGFrame, useHand, usePal} from './Kit';
import {sectionNo, SHADOW, tornPoly} from '../samples/kit';
import {SZ, IMG} from '../samples/masks';
import {useSlap} from '../previews/fx';
import WEST from '../../public/img/ch01/west_map.json';

const PAL = PALETTES.locked;
const TEXT_SHADOW = '0 0 2px #111, 0 0 4px #111, 2px 2px 0 #111, -2px 2px 0 #111, 2px -2px 0 #111, -2px -2px 0 #111, 0 3px 12px rgba(0,0,0,0.7)';

// ------------------------------------------------------------------------------------------------------------------
// The series map
// ------------------------------------------------------------------------------------------------------------------

type WestData = {size: [number, number]; land: string; lakes: string; rivers: Record<string, string>; states: Record<string, string>;
  places: Record<string, [number, number]>; polylines: Record<string, number[][]>};
export const W_MAP = WEST as unknown as WestData;
export const PL = W_MAP.places;
export const LINES = W_MAP.polylines;

/** Map camera: map point (x, y) at screen centre (960, cy), z screen px per map px, tilt and turn in degrees. */
export type WCam = {f: number; x: number; y: number; z: number; tilt: number; rot?: number};
const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));
export const wcamAt = (ks: WCam[], f: number): Required<WCam> => {
  const fill = (k: WCam): Required<WCam> => ({...k, rot: k.rot ?? 0});
  if (f <= ks[0].f) return fill(ks[0]);
  for (let i = 1; i < ks.length; i++) {
    const a = fill(ks[i - 1]);
    const b = fill(ks[i]);
    if (f <= b.f) {
      const t = ease((f - a.f) / Math.max(1, b.f - a.f));
      const l = (p: number, q: number) => p + (q - p) * t;
      return {f, x: l(a.x, b.x), y: l(a.y, b.y), z: Math.exp(l(Math.log(a.z), Math.log(b.z))), tilt: l(a.tilt, b.tilt), rot: l(a.rot, b.rot)};
    }
  }
  return fill(ks[ks.length - 1]);
};
export type WApi = {cam: Required<WCam>; px: (w: number) => number};

/**
 * The West, drawn: dark land on a darker sea, a teal coast, faint state lines (today's, for orientation) and the big rivers,
 * tilted in 3D with a lamp pool and fog toward the horizon. children(api) draw in map pixels on the same plane.
 */
export const WestMap: React.FC<{keys: WCam[]; states?: number; cy?: number; children?: (api: WApi) => React.ReactNode; frame?: number}> = ({keys, states = 1, cy = 560, children, frame}) => {
  const f0 = useCurrentFrame();
  const cam = wcamAt(keys, frame ?? f0);
  const [W, H] = W_MAP.size;
  const px = (w: number) => w / cam.z;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #1a1814 0%, #0c0b09 75%)', overflow: 'hidden', perspective: 1800, perspectiveOrigin: '50% 30%'}}>
      <div style={{position: 'absolute', left: 960 - cam.x, top: cy - cam.y, width: W, height: H, transformStyle: 'preserve-3d', transformOrigin: `${cam.x}px ${cam.y}px`,
        transform: `scale(${cam.z}) rotateX(${cam.tilt}deg) rotateZ(${cam.rot}deg)`}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <defs>
            <pattern id="wm-sea" width={px(10)} height={px(10)} patternUnits="userSpaceOnUse">
              <rect width={px(10)} height={px(10)} fill="#0e0d0b" />
              <line x1={0} y1={px(5)} x2={px(10)} y2={px(5)} stroke="rgba(47,224,196,0.06)" strokeWidth={px(1.2)} />
            </pattern>
            <radialGradient id="wm-land" cx="50%" cy="45%" r="70%">
              <stop offset="0%" stopColor="#36312a" />
              <stop offset="100%" stopColor="#24211c" />
            </radialGradient>
          </defs>
          <rect x={-3000} y={-3000} width={W + 6000} height={H + 6000} fill="url(#wm-sea)" />
          {[30, 16].map((w, i) => <path key={w} d={W_MAP.land} fill="none" stroke="rgba(47,224,196,0.07)" strokeWidth={px(w)} strokeLinejoin="round" opacity={1 - i * 0.3} />)}
          <path d={W_MAP.land} fill="url(#wm-land)" stroke={PAL.mark} strokeWidth={px(2.2)} strokeLinejoin="round" strokeOpacity={0.75} />
          <path d={W_MAP.lakes} fill="#0e0d0b" stroke="rgba(47,224,196,0.4)" strokeWidth={px(1)} />
          {states > 0 && Object.values(W_MAP.states).map((d, i) => <path key={i} d={d} fill="none" stroke="rgba(47,224,196,0.2)" strokeWidth={px(1.3)} opacity={states} />)}
          {Object.entries(W_MAP.rivers).map(([k, d]) => <path key={k} d={d} fill="none" stroke="#5d7a82" strokeWidth={px(2)} strokeLinecap="round" opacity={0.8} />)}
        </svg>
        {children?.({cam, px})}
      </div>
      {/* lamp pool and fog toward the horizon */}
      <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'soft-light', background: 'radial-gradient(circle 820px at 960px 560px, rgba(255,214,160,0.55) 0%, transparent 100%)'}} />
      <AbsoluteFill style={{pointerEvents: 'none', background: 'linear-gradient(to bottom, #0c0b09 0%, rgba(12,11,9,0.8) 10%, rgba(12,11,9,0) 34%)'}} />
    </AbsoluteFill>
  );
};

const polyD = (pts: number[][]) => 'M' + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L');
const lenOf = (pts: number[][]) => pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
/** The point a fraction t along a polyline. */
export const along = (pts: number[][], t: number): [number, number] => {
  const total = lenOf(pts);
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const s = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (acc + s >= t * total) {
      const k = s ? (t * total - acc) / s : 0;
      return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k];
    }
    acc += s;
  }
  return pts[pts.length - 1] as [number, number];
};

/** The part of a polyline up to fraction t. */
export const subLine = (pts: number[][], t: number): number[][] => {
  if (t >= 1) return pts;
  const total = lenOf(pts);
  const out: number[][] = [pts[0]];
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const s = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (acc + s >= t * total) {
      out.push(along(pts, t));
      return out;
    }
    acc += s;
    out.push(pts[i]);
  }
  return out;
};

/** A line drawn along the map (a railroad: ties + rail; dashed for a proposal). `prog` overrides the draw-on. */
export const MRoute: React.FC<{api: WApi; pts: number[][]; at: number; dur?: number; prog?: number; color?: string; width?: number; dashed?: boolean; ties?: boolean; opacity?: number}> = ({
  api, pts, at, dur = 24, prog, color, width = 7, dashed = false, ties = true, opacity = 1,
}) => {
  const g = useGFrame();
  const p = prog ?? interpolate(g, [at, at + dur], [0, 1], clamp);
  if (p <= 0.001) return null;
  const c = color ?? PAL.subject;
  const [W, H] = W_MAP.size;
  const d = polyD(subLine(pts, p));
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', transform: 'translateZ(2px)', opacity}}>
      <path d={d} fill="none" stroke={SHADOW} strokeWidth={api.px(width + 8)} strokeLinecap="round" strokeLinejoin="round" opacity={0.85}
        strokeDasharray={dashed ? `${api.px(16)} ${api.px(12)}` : undefined} />
      {ties && !dashed && <path d={d} fill="none" stroke={c} strokeWidth={api.px(width * 2.8)} strokeDasharray={`${api.px(3)} ${api.px(13)}`} opacity={0.8} />}
      <path d={d} fill="none" stroke={c} strokeWidth={api.px(width)} strokeLinecap={dashed ? 'butt' : 'round'} strokeLinejoin="round"
        strokeDasharray={dashed ? `${api.px(16)} ${api.px(12)}` : undefined} />
    </svg>
  );
};

/** A region on the map, hatched and tinted. */
export const MRegion: React.FC<{api: WApi; pts: number[][]; at: number; color?: string; out?: number}> = ({api, pts, at, color, out = 1e7}) => {
  const g = useGFrame();
  if (g < at || g > out + 8) return null;
  const k = Math.min(interpolate(g, [at, at + 8], [0, 1], clamp), interpolate(g, [out, out + 8], [1, 0], clamp));
  const c = color ?? PAL.mark;
  const [W, H] = W_MAP.size;
  const gap = api.px(16);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', transform: 'translateZ(1px)', opacity: k}}>
      <defs>
        <pattern id="wm-hatch" width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={gap} stroke={c} strokeWidth={api.px(3)} />
        </pattern>
      </defs>
      <path d={polyD(pts) + ' Z'} fill={c} opacity={0.14} />
      <path d={polyD(pts) + ' Z'} fill="url(#wm-hatch)" opacity={0.55} />
      <path d={polyD(pts) + ' Z'} fill="none" stroke={c} strokeWidth={api.px(3)} strokeDasharray={`${api.px(10)} ${api.px(8)}`} />
    </svg>
  );
};

/**
 * Something standing up off the map at map point (x, y), facing the camera and kept at a constant screen size:
 * a pin with a handwritten label, a mono tag, a note.
 */
export const MStand: React.FC<{api: WApi; at: [number, number] | number[]; show?: number; out?: number; children: React.ReactNode}> = ({api, at, show = -999, out = 1e7, children}) => {
  const g = useGFrame();
  if (g < show || g >= out) return null;
  return (
    <div style={{position: 'absolute', left: at[0], top: at[1], width: 0, height: 0, transformStyle: 'preserve-3d',
      transform: `translateZ(3px) rotateZ(${-api.cam.rot}deg) rotateX(${-api.cam.tilt}deg) scale(${1 / api.cam.z})`, transformOrigin: '0 0'}}>
      {children}
    </div>
  );
};

/** A pin (drops in) with a label beside it; `side` puts the label left or right. */
export const MPin: React.FC<{api: WApi; at: number[]; show: number; label?: string; sub?: string; side?: 'l' | 'r'; color?: string; size?: number; out?: number}> = ({
  api, at, show, label, sub, side = 'r', color, size = 44, out,
}) => {
  const g = useGFrame();
  const hand = useHand();
  const k = interpolate(g, [show, show + 3, show + 6], [0, 1.35, 1], clamp);
  const lp = interpolate(g, [show + 3, show + 12], [0, 1], clamp);
  const c = color ?? PAL.mark;
  return (
    <MStand api={api} at={at} show={show} out={out}>
      <div style={{position: 'absolute', left: -13, top: -13, width: 26, height: 26, borderRadius: '50%', background: c, border: '4px solid #111', boxSizing: 'border-box', transform: `scale(${k})`}} />
      {label && <div style={{position: 'absolute', top: -size * hand.scale * 0.66, ...(side === 'r' ? {left: 24} : {right: 24}), whiteSpace: 'nowrap', fontFamily: hand.family,
        fontSize: size * hand.scale, color: c, textShadow: TEXT_SHADOW, clipPath: `inset(-20% ${(1 - lp) * 100}% -20% -5%)`, textAlign: side === 'r' ? 'left' : 'right'}}>
        {label}
        {sub && <div style={{fontFamily: JF.mono, fontSize: 18, letterSpacing: 2, color: '#fff', marginTop: -6, textShadow: TEXT_SHADOW}}>{sub}</div>}
      </div>}
    </MStand>
  );
};

/** A hand-drawn X on the map (crossing out a proposal). */
export const MCross: React.FC<{api: WApi; at: number[]; show: number; r?: number}> = ({api, at, show, r = 46}) => {
  const g = useGFrame();
  if (g < show) return null;
  const p1 = interpolate(g, [show, show + 4], [0, 1], clamp);
  const p2 = interpolate(g, [show + 4, show + 8], [0, 1], clamp);
  return (
    <MStand api={api} at={at}>
      <svg width={r * 2 + 20} height={r * 2 + 20} style={{position: 'absolute', left: -r - 10, top: -r - 10, overflow: 'visible'}}>
        {[[10, 10, r * 2 + 10, r * 2 + 10, p1], [r * 2 + 10, 10, 10, r * 2 + 10, p2]].map(([x1, y1, x2, y2, p], i) => (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke="#111" strokeWidth={17} strokeLinecap="round" />
            <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={PAL.subject} strokeWidth={10} strokeLinecap="round" />
          </g>
        ))}
      </svg>
    </MStand>
  );
};

/** A flat, top-down crop of the series map inside a small dark card (locator), for the desk. */
export const WestCard: React.FC<{w: number; h: number; keys: WCam[]; caption?: string; children?: (api: WApi) => React.ReactNode; frame?: number}> = ({w, h, keys, caption, children, frame}) => {
  const pal = usePal();
  const s = w / 1920;
  return (
    <div style={{position: 'absolute', inset: 0, width: w, height: h, background: '#16140f', boxShadow: `12px 14px 0 ${SHADOW}`}}>
      <div style={{position: 'absolute', left: 10, top: 10, width: w - 20, height: h - 20, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: -10, top: -10 - (1080 * s - h) / 2, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: '0 0'}}>
          <WestMap keys={keys} cy={540} frame={frame}>{children}</WestMap>
        </div>
      </div>
      <div style={{position: 'absolute', inset: 5, border: `2px solid ${pal.mark}`, opacity: 0.85}} />
      {caption && <div style={{position: 'absolute', left: 18, bottom: 14, fontFamily: JF.mono, fontSize: 17, letterSpacing: 2, color: pal.mark, background: 'rgba(11,10,8,0.8)', padding: '2px 8px', whiteSpace: 'nowrap'}}>{caption}</div>}
    </div>
  );
};

// ------------------------------------------------------------------------------------------------------------------
// The race ribbon (P2): Sacramento -> Omaha elevation profile, bond zones, engines
// ------------------------------------------------------------------------------------------------------------------

/** [miles from Sacramento along the line, feet above sea level, label]. Approximate control points (see review/previews/README.md). */
const PTS: [number, number, string?][] = [
  [0, 30, 'Sacramento'], [7, 60], [54, 2420], [105, 7017, 'Donner Summit'], [120, 5850], [154, 4500, 'Reno'], [325, 4300], [480, 5060],
  [690, 4900, 'Promontory'], [744, 4300], [821, 6750], [930, 6100], [1067, 6800], [1203, 7160], [1227, 8250, 'Sherman Summit'], [1260, 6060],
  [1485, 2800, 'North Platte'], [1776, 1000, 'Omaha'],
];
export const RMI = 1776;
const XS = 0.9;
const RH = 380;
const FT = 0.04;
const elev = (mi: number) => {
  for (let i = 1; i < PTS.length; i++) {
    const [m0, e0] = PTS[i - 1];
    const [m1, e1] = PTS[i];
    if (mi <= m1) return e0 + (e1 - e0) * (1 - Math.cos(Math.PI * ((mi - m0) / (m1 - m0)))) / 2;
  }
  return PTS[PTS.length - 1][1];
};
export const RX = (mi: number) => mi * XS;
const RY = (mi: number) => RH - elev(mi) * FT;
/** Bond zones (Pacific Railway Act, Sec. 11, approx. boundaries): [from mile, to mile, $ thousand per mile]. */
export const ZONES: [number, number, number][] = [[0, 7, 16], [7, 157, 48], [157, 1110, 32], [1110, 1260, 48], [1260, RMI, 16]];
export const zoneColor = (k: number) => (k === 48 ? PAL.subject : k === 32 ? 'rgba(47,224,196,0.55)' : 'rgba(47,224,196,0.22)');

const Upright: React.FC<{y: number; children: React.ReactNode; w?: number; extra?: number}> = ({y, children, w = RMI * XS, extra = 0}) => (
  <div style={{position: 'absolute', left: 0, top: y - RH - extra, width: w, height: RH + extra, transformOrigin: '50% 100%', transform: 'rotateX(-90deg)'}}>
    <div style={{position: 'absolute', left: 0, top: extra, width: w, height: RH}}>{children}</div>
  </div>
);
const profilePath = (close: boolean) => {
  const pts: string[] = [];
  for (let mi = 0; mi <= RMI; mi += 4) pts.push(`${RX(mi).toFixed(1)},${RY(mi).toFixed(1)}`);
  return close ? `M0,${RH} L${pts.join(' L')} L${RX(RMI)},${RH} Z` : `M${pts.join(' L')}`;
};
const FILL = profilePath(true);
const LINE = profilePath(false);

const Engine: React.FC<{src: string; size: [number, number]; w: number; mi: number; filter?: string}> = ({src, size, w, mi, filter}) => {
  const h = (w * size[1]) / size[0];
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: RMI * XS, height: RH, filter: 'drop-shadow(5px 6px 0 #050403)'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', left: RX(mi) - w / 2, top: RY(mi) - h * 0.62, width: w, height: h, filter}} />
    </div>
  );
};

const RibbonWorld: React.FC<{lit: number[]; cpMi: number; upMi: number; fx: number; z: number; labels: boolean; engines: boolean}> = ({lit, cpMi, upMi, fx, z, labels, engines}) => {
  const labelOp = (x: number) => interpolate(Math.abs(x - fx) * z, [560, 700], [1, 0], clamp);
  const g = useGFrame();
  const hand = useHand();
  return (
    <>
      <div style={{position: 'absolute', left: -160, top: -420, width: RMI * XS + 320, height: 760,
        backgroundImage: 'linear-gradient(rgba(47,224,196,0.16) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(47,224,196,0.16) 1.5px, transparent 1.5px)',
        backgroundSize: '64px 64px', WebkitMaskImage: 'radial-gradient(ellipse at 50% 55%, #000 40%, transparent 72%)', maskImage: 'radial-gradient(ellipse at 50% 55%, #000 40%, transparent 72%)'}} />
      {ZONES.map(([a, b, k], i) => {
        const on = interpolate(g, [lit[i], lit[i] + 6], [0, 1], clamp);
        return <div key={i} style={{position: 'absolute', left: RX(a), top: -70, width: RX(b) - RX(a), height: 150, background: zoneColor(k), opacity: on * (k === 48 ? 0.75 : 1),
          transform: `translateZ(${on * 2}px)`, borderLeft: '2px solid rgba(47,224,196,0.6)'}} />;
      })}
      <Upright y={-70} w={RX(RMI)} extra={200}>
        <Img src={staticFile('img/previews/ridge_sierra_a_cut.png')} style={{position: 'absolute', left: RX(-60), top: RH - 300, width: 640, height: (640 * 646) / 1374, opacity: 0.9, filter: 'saturate(0.75) brightness(0.9)'}} />
        <Img src={staticFile('img/previews/ridge_wyoming_a_cut.png')} style={{position: 'absolute', left: RX(1040), top: RH - 290, width: 560, height: (560 * 646) / 1374, opacity: 0.9, filter: 'saturate(0.75) brightness(0.9)'}} />
      </Upright>
      {[-40, -28, -16, -4].map((y, i) => (
        <Upright key={y} y={y}>
          <svg width={RX(RMI)} height={RH} style={{overflow: 'visible'}}><path d={LINE} fill="none" stroke={PAL.mark} strokeWidth={2} opacity={0.25 + i * 0.15} /></svg>
        </Upright>
      ))}
      <Upright y={8}>
        <svg width={RX(RMI)} height={RH} style={{overflow: 'visible'}}>
          <path d={FILL} fill="rgba(10,20,18,0.72)" />
          {Array.from({length: 75}).map((_, i) => <line key={i} x1={RX(i * 24)} y1={RH} x2={RX(i * 24)} y2={RY(i * 24)} stroke={PAL.mark} strokeWidth={1.2} opacity={0.35} />)}
          {ZONES.map(([a, b, k], i) => {
            const on = interpolate(g, [lit[i], lit[i] + 6], [0, 1], clamp);
            return k === 48 && on > 0 ? <path key={i} d={`M${RX(a)},${RH} ${Array.from({length: 40}).map((_, j) => `L${RX(a + ((b - a) * j) / 39).toFixed(1)},${RY(a + ((b - a) * j) / 39).toFixed(1)}`).join(' ')} L${RX(b)},${RH} Z`}
              fill={PAL.subject} opacity={0.55 * on} /> : null;
          })}
          <path d={LINE} fill="none" stroke={PAL.mark} strokeWidth={5} strokeLinejoin="round" />
        </svg>
      </Upright>
      {labels && <Upright y={22} extra={240}>
        {PTS.filter((p) => p[2]).map(([mi, ft, name]) => (
          <div key={name} style={{position: 'absolute', left: Math.max(6, RX(mi) - 10), top: RY(mi) - 150, whiteSpace: 'nowrap', opacity: labelOp(RX(mi) + 120), textShadow: '0 0 2px #111, 2px 2px 0 #111, -2px 2px 0 #111'}}>
            <div style={{fontFamily: hand.family, fontSize: 30 * hand.scale, color: PAL.mark}}>{name}</div>
            <div style={{fontFamily: JF.mono, fontSize: 16, letterSpacing: 2, color: '#fff'}}>{ft.toLocaleString('en-US')} FT</div>
          </div>
        ))}
      </Upright>}
      {engines && <Upright y={30}>
        <Engine src="img/previews/engine_cp_east_b_cut.png" size={[1415, 465]} w={170} mi={cpMi} />
        <Engine src="img/previews/engine_up_west_b_cut.png" size={[1467, 512]} w={176} mi={upMi} filter="saturate(0.6)" />
      </Upright>}
    </>
  );
};

/** The 3D ribbon stage: camera focus fx (world px along the line), tilt, spin, zoom; engines at cpMi / upMi. */
export const Ribbon: React.FC<{fx: number; tilt: number; spin: number; z: number; dy?: number; lit?: number[]; cpMi?: number; upMi?: number; labels?: boolean; engines?: boolean}> = ({
  fx, tilt, spin, z, dy = 0, lit = [1e7, 1e7, 1e7, 1e7, 1e7], cpMi = 0, upMi = RMI, labels = true, engines = true,
}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #211e18 0%, #12100c 65%, #070605 100%)', perspective: 1500, perspectiveOrigin: '50% 35%', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 960 - fx, top: 640 + dy, width: RX(RMI), height: 0, transformStyle: 'preserve-3d', transformOrigin: `${fx}px 0px`,
      transform: `scale(${z}) rotateX(${tilt}deg) rotateZ(${spin}deg)`}}>
      <RibbonWorld lit={lit} cpMi={cpMi} upMi={upMi} fx={fx} z={z} labels={labels} engines={engines} />
    </div>
  </AbsoluteFill>
);

/** The bond-rate key (Pacific Railway Act, Sec. 11). `ats` = frame each row appears. */
export const BondKey: React.FC<{ats: number[]; x?: number; y?: number}> = ({ats, x = 110, y = 210}) => {
  const g = useGFrame();
  const rows: [string, string, number][] = [['$16,000 A MILE', 'flat ground', 16], ['$32,000', 'between the ranges', 32], ['$48,000', 'mountains', 48]];
  return (
    <div style={{position: 'absolute', left: x, top: y, display: 'flex', flexDirection: 'column', gap: 14}}>
      {rows.map(([a, b, k], i) => g >= ats[i] && (
        <div key={a} style={{display: 'flex', alignItems: 'center', gap: 16, transform: `scale(${interpolate(g, [ats[i], ats[i] + 3, ats[i] + 6], [1.25, 0.96, 1], clamp)})`, transformOrigin: 'left center'}}>
          <div style={{width: 34, height: 22, background: zoneColor(k)}} />
          <div style={{fontFamily: JF.mono, fontSize: 28, letterSpacing: 2, color: '#fff', background: '#0b0a08', padding: '4px 10px', whiteSpace: 'nowrap'}}>{a} <span style={{color: k === 48 ? PAL.subject : PAL.mark}}>· {b}</span></div>
        </div>
      ))}
    </div>
  );
};

// ------------------------------------------------------------------------------------------------------------------
// The land-grant township (P3) and the Act page
// ------------------------------------------------------------------------------------------------------------------

export const T_COLS = 12;
export const T_ROWS = 8;
export const T_CELL = 92;
const RAIL_ROW = 4;
const PER = 6;

const Slab: React.FC<{r: number; c: number; at: number}> = ({r, c, at}) => {
  const sl = useSlap(at, 1.0);
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 5], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const over = sl.scale < 1 ? (1 - sl.scale) * 60 : 0;
  const h = 26 * k + over + 70 * (1 - k);
  const n = sectionNo(r % 6, c % 6);
  const face = (st: React.CSSProperties, bg: string) => <div style={{position: 'absolute', background: bg, ...st}} />;
  const C = T_CELL;
  return (
    <div style={{position: 'absolute', left: c * C + 4, top: r * C + 4, width: C - 8, height: C - 8, transformStyle: 'preserve-3d'}}>
      <div style={{position: 'absolute', inset: -4, background: 'rgba(0,0,0,0.7)', filter: `blur(${3 + h * 0.25}px)`, transform: `translate(${h * 0.2}px, ${h * 0.3}px)`}} />
      {face({left: 0, top: C - 8 - h, width: C - 8, height: h, transformOrigin: '50% 100%', transform: 'rotateX(-90deg)'}, '#a85f0a')}
      {face({left: C - 8 - h, top: 0, width: h, height: C - 8, transformOrigin: '100% 50%', transform: 'rotateY(90deg)'}, '#8a4d08')}
      {face({left: 0, top: 0, width: h, height: C - 8, transformOrigin: '0% 50%', transform: 'rotateY(-90deg)'}, '#8a4d08')}
      <div style={{position: 'absolute', inset: 0, transform: `translateZ(${h}px)`, background: boxOf(PAL), boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: JF.mono, fontSize: 24, color: '#111'}}>{n}</div>
    </div>
  );
};

const Rail: React.FC<{t0: number}> = ({t0}) => {
  const g = useGFrame();
  const W = T_COLS * T_CELL;
  const Hh = T_ROWS * T_CELL;
  const railP = interpolate(g, [t0, t0 + T_COLS * PER], [0, 1], clamp);
  return (
    <svg width={W} height={Hh} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', transform: 'translateZ(34px)'}}>
      {railP > 0 && <>
        {Array.from({length: Math.floor((W * railP) / 22)}).map((_, i) => <line key={i} x1={10 + i * 22} y1={RAIL_ROW * T_CELL - 14} x2={10 + i * 22} y2={RAIL_ROW * T_CELL + 14} stroke={PAL.subject} strokeWidth={4} />)}
        <line x1={0} y1={RAIL_ROW * T_CELL} x2={W * railP} y2={RAIL_ROW * T_CELL} stroke="#050403" strokeWidth={16} />
        <line x1={0} y1={RAIL_ROW * T_CELL} x2={W * railP} y2={RAIL_ROW * T_CELL} stroke={PAL.subject} strokeWidth={9} strokeLinecap="round" />
      </>}
    </svg>
  );
};

const TownGrid: React.FC<{g0: number; rail0: number}> = ({g0, rail0}) => {
  const g = useGFrame();
  const W = T_COLS * T_CELL;
  const Hh = T_ROWS * T_CELL;
  const grid = interpolate(g, [g0, g0 + 10], [0, 1], clamp);
  return (
    <>
      <svg width={W} height={Hh} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <rect width={W} height={Hh} fill="rgba(0,0,0,0.3)" opacity={grid} />
        {Array.from({length: T_COLS + 1}).map((_, c) => <line key={`v${c}`} x1={c * T_CELL} y1={0} x2={c * T_CELL} y2={Hh * grid} stroke={PAL.mark} strokeWidth={c % 6 === 0 ? 5 : 2} opacity={c % 6 === 0 ? 1 : 0.6} />)}
        {Array.from({length: T_ROWS + 1}).map((_, r) => <line key={`h${r}`} x1={0} y1={r * T_CELL} x2={W * grid} y2={r * T_CELL} stroke={PAL.mark} strokeWidth={r % 6 === 0 ? 5 : 2} opacity={r % 6 === 0 ? 1 : 0.6} />)}
        {grid >= 1 && Array.from({length: T_ROWS * T_COLS}).map((_, i) => {
          const r = Math.floor(i / T_COLS);
          const c = i % T_COLS;
          const n = sectionNo(r % 6, c % 6);
          return n % 2 === 0 ? <text key={i} x={c * T_CELL + T_CELL / 2} y={r * T_CELL + T_CELL / 2 + 8} textAnchor="middle" fontFamily={JF.mono} fontSize={22} fill="rgba(47,224,196,0.6)">{n}</text> : null;
        })}
      </svg>
      {Array.from({length: T_ROWS * T_COLS}).map((_, i) => {
        const r = Math.floor(i / T_COLS);
        const c = i % T_COLS;
        const n = sectionNo(r % 6, c % 6);
        return n % 2 === 1 ? <Slab key={i} r={r} c={c} at={rail0 + c * PER + 3 + Math.abs(r - RAIL_ROW + 0.5) * 2} /> : null;
      })}
    </>
  );
};

/** The township in 3D: grid draws at g0, the coral line from rail0 and the odd sections rise as it passes. Camera keyed by the caller. */
export const Township: React.FC<{g0: number; rail0: number; z: number; tilt: number; rot: number; cy?: number}> = ({g0, rail0, z, tilt, rot, cy = 500}) => {
  const W = T_COLS * T_CELL;
  const Hh = T_ROWS * T_CELL;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #2a2620 0%, #15130f 65%, #0a0907 100%)', perspective: 1500, perspectiveOrigin: '50% 30%', overflow: 'hidden'}}>
      {[<TownGrid key="t" g0={g0} rail0={rail0} />, <Rail key="r" t0={rail0} />].map((layer) => (
        <div key={layer.key} style={{position: 'absolute', left: 960 - W / 2, top: cy - Hh / 2, width: W, height: Hh, transformStyle: 'preserve-3d', transformOrigin: '50% 50%',
          transform: `scale(${z}) rotateX(${tilt}deg) rotateZ(${rot}deg)`}}>
          {layer}
        </div>
      ))}
      <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'soft-light', background: 'radial-gradient(circle 800px at 960px 480px, rgba(255,214,160,0.6) 0%, transparent 100%)'}} />
    </AbsoluteFill>
  );
};
export const townshipTaps = (rail0: number) => Array.from({length: T_COLS}).map((_, c) => rail0 + c * PER + 3);

export const TownLegend: React.FC<{y?: number}> = ({y = 950}) => (
  <div style={{position: 'absolute', left: 110, top: y, display: 'flex', gap: 40}}>
    {[[boxOf(PAL), 'RAILROAD · ODD SECTIONS'], ['transparent', 'GOVERNMENT · EVEN'], [PAL.subject, 'THE LINE']].map(([c, t]) => (
      <div key={t} style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <div style={{width: t === 'THE LINE' ? 40 : 28, height: t === 'THE LINE' ? 8 : 28, background: c, border: c === 'transparent' ? `2px solid ${PAL.mark}` : undefined}} />
        <span style={{fontFamily: JF.mono, fontSize: 24, letterSpacing: 2, color: '#fff', background: '#0b0a08', padding: '2px 8px', whiteSpace: 'nowrap'}}>{t}</span>
      </div>
    ))}
  </div>
);

// lines 1-2 of review/ai_tests/assets/act_lines.json (normalised [ymin, xmin, ymax, xmax] on pacific_railway_act_1862_p4.jpg)
const ACT_LINES: [number, number, number, number][] = [[661, 109, 679, 937], [678, 109, 696, 937]];
export const ACT_W = 900;
export const ACT_H = ACT_W * (SZ.act[1] / SZ.act[0]);
const EVERY_X = 0.388;
const ODD_END_X = 0.39;
/** Page 4 of the Act: focus pull to Sec. 3's two lines, then the coral swipe from "every" to "odd numbers,". */
export const ActPage: React.FC<{pullAt: number; swipeAt: number}> = ({pullAt, swipeAt}) => {
  const g = useGFrame();
  const pull = interpolate(g, [pullAt, pullAt + 10], [0, 1], clamp);
  const y0 = (ACT_LINES[0][0] / 1000) * ACT_H - 10;
  const y1 = (ACT_LINES[1][2] / 1000) * ACT_H + 10;
  const fm = `linear-gradient(to bottom, #000 0px, #000 ${y0 - 18}px, transparent ${y0}px, transparent ${y1}px, #000 ${y1 + 18}px, #000 100%)`;
  const segs = ACT_LINES.map((l, i) => {
    const [ymin, xmin, ymax, xmax] = l.map((v) => v / 1000);
    const x0 = i === 0 ? EVERY_X : xmin;
    const x1 = i === 1 ? ODD_END_X : xmax;
    return {x: x0 * ACT_W, y: ymin * ACT_H, w: (x1 - x0) * ACT_W, h: (ymax - ymin) * ACT_H};
  });
  const total = segs.reduce((a, s) => a + s.w, 0);
  const sp = interpolate(g, [swipeAt, swipeAt + 12], [0, 1], clamp) * total;
  let acc = 0;
  const img = (st: React.CSSProperties) => <Img src={staticFile(IMG.act4)} style={{position: 'absolute', left: 0, top: 0, width: ACT_W, height: ACT_H, ...st}} />;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      {img({filter: 'grayscale(1) sepia(0.3) contrast(1.15) brightness(0.9)'})}
      {segs.map((s, i) => {
        const w = Math.max(0, Math.min(s.w, sp - acc));
        acc += s.w;
        return w > 0 ? <div key={i} style={{position: 'absolute', left: s.x, top: s.y, width: w, height: s.h, background: PAL.subject, mixBlendMode: 'multiply', opacity: 0.85}} /> : null;
      })}
      {pull > 0 && <div style={{position: 'absolute', inset: 0, WebkitMaskImage: fm, maskImage: fm} as React.CSSProperties}>
        {img({filter: `grayscale(1) sepia(0.3) blur(${pull * 4}px) brightness(${0.9 - pull * 0.5})`})}
      </div>}
    </div>
  );
};
export const ACT_LINE_Y = (ACT_LINES[0][0] / 1000) * ACT_H;

// ------------------------------------------------------------------------------------------------------------------
// The House of empty chairs
// ------------------------------------------------------------------------------------------------------------------

/** 237 seats in rows of a half-circle (the House after the 1850 apportionment plus the new states). The last 66 seats of
 * the arc (the eleven seceded states' share, 1850 apportionment) are the empty chairs. A diagram, not a seating chart. */
export const HOUSE_SEATS = 237;
export const HOUSE_EMPTY = 66;
const ROWS_R = [300, 360, 420, 480, 540, 600];
const seatList = (() => {
  const per = ROWS_R.map((r) => r);
  const tot = per.reduce((a, b) => a + b, 0);
  const counts = per.map((r) => Math.round((HOUSE_SEATS * r) / tot));
  counts[counts.length - 1] += HOUSE_SEATS - counts.reduce((a, b) => a + b, 0);
  const seats: {r: number; a: number; row: number}[] = [];
  counts.forEach((n, row) => {
    for (let i = 0; i < n; i++) seats.push({r: ROWS_R[row], a: Math.PI * (1 - (i + 0.5) / n), row});
  });
  // order by angle from the left (west) to the right, so a wedge of seats is a contiguous block
  return seats.sort((p, q) => q.a - p.a);
})();

/** Chairs in a half-circle, centred at (cx, cy). Filled seats draw in at `at`; the empty wedge turns to empty coral chairs at `emptyAt`;
 * `goneAt` lets the empty chairs fall away. */
export const House: React.FC<{cx: number; cy: number; s?: number; at: number; emptyAt: number; goneAt?: number; dim?: number}> = ({cx, cy, s = 1, at, emptyAt, goneAt = 1e7, dim = 1}) => {
  const g = useGFrame();
  const pal = usePal();
  const n = seatList.length;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <g transform={`translate(${cx} ${cy}) scale(${s})`} opacity={dim}>
        {/* the speaker's dais */}
        <rect x={-90} y={-40} width={180} height={50} fill="none" stroke={pal.mark} strokeWidth={4} opacity={interpolate(g, [at, at + 6], [0, 0.8], clamp)} />
        {seatList.map((st, i) => {
          const show = at + Math.floor((i / n) * 24);
          if (g < show) return null;
          const empty = i >= n - HOUSE_EMPTY;
          const e = empty ? interpolate(g, [emptyAt + (i - (n - HOUSE_EMPTY)) * 0.25, emptyAt + 6 + (i - (n - HOUSE_EMPTY)) * 0.25], [0, 1], clamp) : 0;
          const fall = empty ? interpolate(g, [goneAt + (i % 9) * 1.5, goneAt + 10 + (i % 9) * 1.5], [0, 1], clamp) : 0;
          if (fall >= 1) return null;
          const x = Math.cos(st.a) * st.r;
          const y = -Math.sin(st.a) * st.r;
          const rot = 90 - (st.a * 180) / Math.PI;
          const pop = interpolate(g, [show, show + 3], [0.4, 1], clamp);
          return (
            <g key={i} transform={`translate(${x} ${y + fall * 120}) rotate(${rot}) scale(${pop})`} opacity={1 - fall}>
              {/* a chair seen from above: seat + back; an occupied seat has a head */}
              <rect x={-11} y={-9} width={22} height={18} rx={3} fill={e > 0.5 ? 'none' : 'rgba(47,224,196,0.18)'} stroke={e > 0.5 ? pal.subject : pal.mark}
                strokeWidth={3} strokeDasharray={e > 0.5 ? '5 4' : undefined} />
              <line x1={-13} y1={-14} x2={13} y2={-14} stroke={e > 0.5 ? pal.subject : pal.mark} strokeWidth={4} strokeLinecap="round" />
              {e < 0.5 && <circle cx={0} cy={2} r={7} fill={pal.mark} opacity={1 - e * 2} />}
            </g>
          );
        })}
      </g>
    </svg>
  );
};

// ------------------------------------------------------------------------------------------------------------------
// Handwriting, tallies, cards
// ------------------------------------------------------------------------------------------------------------------

/** Bare handwriting with one or more coloured words: segments [text, colour?]. Writes on left to right. */
export const Hand: React.FC<{parts: [string, string?][]; x: number; y: number; size?: number; rot?: number; at: number; dur?: number; out?: number}> = ({parts, x, y, size = 80, rot = -3, at, dur = 14, out = 1e7}) => {
  const g = useGFrame();
  const hand = useHand();
  const pal = usePal();
  if (g < at || g >= out) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: hand.family, fontWeight: hand.weight, fontSize: size * hand.scale, color: pal.mark, whiteSpace: 'nowrap',
      transform: `rotate(${rot}deg)`, textShadow: TEXT_SHADOW, clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`}}>
      {parts.map(([t, c], i) => <span key={i} style={{color: c ?? pal.mark}}>{t}</span>)}
    </div>
  );
};

/** Tally marks in fives (teal), drawn in batches from `at`; `coral` = how many of the first marks are coral. */
export const Tally: React.FC<{n: number; x: number; y: number; at: number; per?: number; size?: number; perRow?: number; color?: string}> = ({n, x, y, at, per = 0.6, size = 64, perRow = 25, color}) => {
  const g = useGFrame();
  const pal = usePal();
  const c = color ?? pal.mark;
  const marks: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const show = at + i * per;
    if (g < show) break;
    const row = Math.floor(i / perRow);
    const k = i % perRow;
    const group = Math.floor(k / 5);
    const inG = k % 5;
    const gx = x + group * size * 1.25;
    const gy = y + row * size * 1.4;
    const j = (random(`tl${i}`) - 0.5) * 6;
    if (inG < 4) marks.push(<line key={i} x1={gx + inG * size * 0.22 + j} y1={gy} x2={gx + inG * size * 0.22 - j} y2={gy + size} stroke={c} strokeWidth={6} strokeLinecap="round" />);
    else marks.push(<line key={i} x1={gx - size * 0.12} y1={gy + size * 0.8} x2={gx + size * 0.8} y2={gy + size * 0.2} stroke={c} strokeWidth={6} strokeLinecap="round" />);
  }
  return <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
    <g style={{filter: 'drop-shadow(3px 4px 0 #050403)'}}>{marks}</g>
  </svg>;
};

/** A dark index card on the desk (no cream): torn top, teal rule, mono header, handwritten lines. Slaps down at `at`. */
export const DarkCard: React.FC<{x: number; y: number; w: number; h: number; at: number; rot?: number; head: string; headColor?: string; lines: {text: string; at: number; color?: string}[];
  size?: number; seed?: number; accent?: string}> = ({x, y, w, h, at, rot = 0, head, headColor, lines, size = 50, seed = 5, accent}) => {
  const sl = useSlap(at, 1.25);
  const g = useGFrame();
  const pal = usePal();
  const hand = useHand();
  if (!sl.on) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg) scale(${sl.scale})`, opacity: sl.opacity}}>
      <div style={{position: 'absolute', inset: 0, filter: `drop-shadow(14px 18px 0 ${SHADOW})`}}>
        <div style={{position: 'absolute', inset: 0, clipPath: tornPoly(w, h, seed, {t: true}, 9), background: 'radial-gradient(ellipse at 40% 30%, #36312a 0%, #26231d 75%, #1d1a15 100%)'}}>
          <div style={{position: 'absolute', left: 18, right: 18, top: 92, height: 2, background: accent ?? pal.mark, opacity: 0.9}} />
          {lines.map((_, i) => <div key={i} style={{position: 'absolute', left: 18, right: 18, top: 92 + (i + 1) * (size * 1.7), height: 1.5, background: pal.mark, opacity: 0.3}} />)}
        </div>
      </div>
      <div style={{position: 'absolute', left: 30, top: 36, fontFamily: JF.mono, fontSize: 28, letterSpacing: 3, color: headColor ?? pal.mark, whiteSpace: 'nowrap'}}>{head}</div>
      {lines.map((l, i) => {
        if (g < l.at) return null;
        const p = interpolate(g, [l.at, l.at + 10], [0, 1], clamp);
        return <div key={i} style={{position: 'absolute', left: 32, top: 92 + i * size * 1.7 + size * 0.35, fontFamily: hand.family, fontSize: size * hand.scale, color: l.color ?? pal.mark, whiteSpace: 'nowrap',
          clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`, textShadow: '0 0 2px #111, 2px 2px 0 #111, -2px 2px 0 #111'}}>{l.text}</div>;
      })}
    </div>
  );
};

/** The orange count/label stamp used for "≈ 4 in 5" style numbers: Abril on a torn orange box. */
export { SlapTitle } from '../previews/fx';
