// Bierce's route on the U.S. Geological Survey's 1880 map of the United States, which runs from the
// Great Lakes down through northern Mexico, so one map carries the whole story. Camera keys are in map pixels; the camera glides smoothly while
// pins, legs and labels step at 12 fps like every other mark.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {INK, JF, Tag, useGFrame, usePal} from '../jh/Kit';

export const MAP = {w: 6000, h: 4288, src: 'img/maps/usgs_1880.jpg'};
export const MAP_TAG = "U.S. Geological Survey, Map of the United States, 1880 · Library of Congress";

/** Places in map pixels, computed from latitude and longitude with a projection fitted to landmarks on the scan
 * (Monterey, Cape San Lucas, Brownsville, Cape Sable, Cape Hatteras, Duluth, New Orleans...; error under ~30 px). */
export const P = {
  meigs: [4519, 1677], warsaw: [4115, 1455], shiloh: [3941, 2216], chattanooga: [4248, 2201], kennesaw: [4334, 2325],
  omaha: [3150, 1506], kearny: [2859, 1579], laramie: [2329, 1367], saltlake: [1625, 1465], sf: [563, 1631],
  deadwood: [2406, 1117], dc: [5010, 1616], neworleans: [3793, 2873], sanantonio: [2902, 2956], elpaso: [2080, 2621],
  juarez: [2087, 2630], tierrablanca: [2079, 2685], chihuahua: [2089, 3016], ojinaga: [2276, 2912], sierramojada: [2330, 3204],
} satisfies Record<string, number[]>;

export type Cam = {f: number; x: number; y: number; s: number};

export const camAt = (keys: Cam[], frame: number): Cam => {
  if (frame <= keys[0].f) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame < b.f) {
      const t = Easing.inOut(Easing.cubic)((frame - a.f) / Math.max(1, b.f - a.f));
      return {f: frame, x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, s: Math.exp(Math.log(a.s) + (Math.log(b.s) - Math.log(a.s)) * t)};
    }
  }
  return keys[keys.length - 1];
};

/** A leg of the journey: drawn on between frames a and b; `dashed` for the last leg off the map. */
export type Leg = {pts: number[][]; a: number; b: number; dashed?: boolean; color?: string};
export type Pin = {p: number[]; at: number; label?: string; dx?: number; dy?: number; x?: boolean};

const pathLen = (pts: number[][]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

/** A gently bowed curve through two points, as a polyline (so it can be drawn on and dashed). */
export const arc = (a: number[], b: number[], bow = 0.18, n = 40) => {
  const mx = (a[0] + b[0]) / 2 - (b[1] - a[1]) * bow;
  const my = (a[1] + b[1]) / 2 + (b[0] - a[0]) * bow;
  return Array.from({length: n + 1}, (_, i) => {
    const u = i / n;
    return [(1 - u) ** 2 * a[0] + 2 * (1 - u) * u * mx + u * u * b[0], (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * my + u * u * b[1]];
  });
};

export const RouteMap: React.FC<{keys: Cam[]; legs?: Leg[]; pins?: Pin[]; dim?: number; children?: React.ReactNode; tagTop?: boolean; faded?: Leg[]}> = ({keys, legs = [], pins = [], dim = 0, children, tagTop, faded = []}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  // Keep the map filling the frame: never zoom out past its edges, never pan off them.
  const raw = camAt(keys, frame);
  const s = Math.max(raw.s, 1920 / MAP.w, 1080 / MAP.h);
  const cam = {...raw, s, x: Math.min(Math.max(raw.x, 960 / s), MAP.w - 960 / s), y: Math.min(Math.max(raw.y, 540 / s), MAP.h - 540 / s)};
  const toScreen = ([x, y]: number[]) => [960 + (x - cam.x) * s, 540 + (y - cam.y) * s];
  const lw = 7 / s;
  const drawLeg = (l: Leg, i: number, opacity = 1) => {
    const p = interpolate(g, [l.a, l.b], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
    if (p <= 0) return null;
    const L = pathLen(l.pts);
    let d = 0;
    const out: number[][] = [l.pts[0]];
    for (let k = 1; k < l.pts.length; k++) {
      const seg = Math.hypot(l.pts[k][0] - l.pts[k - 1][0], l.pts[k][1] - l.pts[k - 1][1]);
      if (d + seg >= p * L) {
        const u = (p * L - d) / seg;
        out.push([l.pts[k - 1][0] + (l.pts[k][0] - l.pts[k - 1][0]) * u, l.pts[k - 1][1] + (l.pts[k][1] - l.pts[k - 1][1]) * u]);
        break;
      }
      out.push(l.pts[k]);
      d += seg;
    }
    const dStr = 'M' + out.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L');
    const head = out[out.length - 1];
    return (
      <g key={i} opacity={opacity}>
        <path d={dStr} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth={lw * 1.45} strokeLinejoin="round" strokeLinecap="round" transform={`translate(${4 / s} ${6 / s})`}
          strokeDasharray={l.dashed ? `${40} ${30}` : undefined} />
        <path d={dStr} fill="none" stroke={l.color ?? pal.mark} strokeWidth={lw} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={l.dashed ? `${40} ${30}` : undefined} />
        {p < 1 && <circle cx={head[0]} cy={head[1]} r={8 / s} fill={l.color ?? pal.mark} stroke={INK} strokeWidth={3 / s} />}
      </g>
    );
  };
  return (
    <AbsoluteFill style={{background: '#15130f', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 960 - cam.x * s, top: 540 - cam.y * s, width: MAP.w * s, height: MAP.h * s}}>
        <Img src={staticFile(MAP.src)} style={{width: '100%', height: '100%', filter: `grayscale(1) sepia(0.25) contrast(1.2) brightness(${0.8 - dim})`, boxShadow: '0 30px 80px rgba(0,0,0,0.8)'}} />
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={MAP.w * s} height={MAP.h * s} viewBox={`0 0 ${MAP.w} ${MAP.h}`}>
          {faded.map((l, i) => drawLeg(l, 100 + i, 0.35))}
          {legs.map((l, i) => drawLeg(l, i))}
        </svg>
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(8,6,4,0.8) 100%)'}} />
      {pins.map((pin, i) => {
        if (g < pin.at) return null;
        const [x, y] = toScreen(pin.p);
        const k = interpolate(g, [pin.at, pin.at + 3, pin.at + 6], [0, 1.35, 1], clamp);
        return (
          <React.Fragment key={i}>
            {pin.x
              ? <div style={{position: 'absolute', left: x - 24, top: y - 42, fontFamily: JF.sans, fontWeight: 800, fontSize: 70, color: pal.subject, transform: `scale(${k})`, textShadow: '0 2px 8px #000'}}>✕</div>
              : <div style={{position: 'absolute', left: x - 12, top: y - 12, width: 24, height: 24, borderRadius: '50%', background: pal.mark, border: `4px solid ${INK}`, transform: `scale(${k})`, boxShadow: '0 0 0 4px rgba(47,224,196,0.35)'}} />}
            {pin.label && (
              <div style={{position: 'absolute', left: x + (pin.dx ?? 18), top: y + (pin.dy ?? -60), fontFamily: '"Nanum Pen Script", cursive', fontSize: 62, color: pal.mark, whiteSpace: 'nowrap', transform: 'rotate(-3deg)',
                textShadow: '0 0 2px #111, 0 0 4px #111, 2px 2px 0 #111, -2px 2px 0 #111, 2px -2px 0 #111, -2px -2px 0 #111, 0 3px 12px rgba(0,0,0,0.7)',
                clipPath: `inset(-20% ${(1 - interpolate(g, [pin.at + 2, pin.at + 10], [0, 1], clamp)) * 100}% -20% -5%)`}}>{pin.label}</div>
            )}
          </React.Fragment>
        );
      })}
      {children}
      <Tag text={MAP_TAG} y={tagTop ? 40 : 1030} />
    </AbsoluteFill>
  );
};

/** Bierce's whole life as one line across the map (schematic), for the recap in chapter 9. */
export const LIFE: number[][][] = [
  arc(P.meigs, P.warsaw, 0.1), arc(P.warsaw, P.shiloh, 0.1), arc(P.shiloh, P.kennesaw, -0.15), arc(P.kennesaw, P.omaha, 0.12),
  [P.omaha, P.kearny, P.laramie, P.saltlake, P.sf], arc(P.sf, P.deadwood, -0.15), arc(P.deadwood, P.sf, -0.1), arc(P.sf, P.dc, -0.2),
  arc(P.dc, P.kennesaw, 0.1), arc(P.kennesaw, P.neworleans, 0.1), arc(P.neworleans, P.sanantonio, 0.1), arc(P.sanantonio, P.elpaso, 0.1),
  arc(P.juarez, P.chihuahua, -0.1),
];
