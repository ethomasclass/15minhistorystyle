// Helpers shared by Ep 2 chapters 4–6 (Beef for Bosque Redondo, Who the Cowboys Were, 1874): small additions to the series map
// (a named river, a hatched state, a label standing off the map), the quiet palette wrapper, a dark torn tag (Spanish source words,
// the resistance card's paper) and the four-figure "one in four" count. Everything stays on the black desk.
import React from 'react';
import {AbsoluteFill, interpolate, random} from 'remotion';
import {clamp} from '../lib/anim';
import {JF, PALETTES, PaletteCtx, useGFrame, useHand, usePal} from './Kit';
import {CutOut, SHADOW, tornPoly} from '../samples/kit';
import type {MaskRef} from './maskref';
import {useSlap} from '../previews/fx';
import {W_MAP, type WApi} from './ch01_extra';

export const Quiet: React.FC<{children: React.ReactNode}> = ({children}) => <PaletteCtx.Provider value={PALETTES.quiet}>{children}</PaletteCtx.Provider>;

const OUTLINE = '0 0 2px #111, 2px 2px 0 #111, -2px 2px 0 #111, 2px -2px 0 #111, -2px -2px 0 #111';

/** A small mono label standing up off the map (river, region and country names); constant screen size. */
export const MStandLabel: React.FC<{api: WApi; at: number[]; show: number; text: string; color?: string; size?: number; out?: number}> = ({api, at: p, show, text, color, size = 24, out = 1e7}) => {
  const g = useGFrame();
  if (g < show || g >= out) return null;
  return (
    <div style={{position: 'absolute', left: p[0], top: p[1], width: 0, height: 0, transformStyle: 'preserve-3d', transformOrigin: '0 0',
      transform: `translateZ(3px) rotateZ(${-api.cam.rot}deg) rotateX(${-api.cam.tilt}deg) scale(${1 / api.cam.z})`}}>
      <div style={{position: 'absolute', left: 0, top: -size * 1.6, fontFamily: JF.mono, fontSize: size, letterSpacing: 3, color: color ?? '#bfe3ea', whiteSpace: 'nowrap', textTransform: 'uppercase',
        opacity: interpolate(g, [show, show + 6], [0, 1], clamp), textShadow: OUTLINE}}>{text}</div>
    </div>
  );
};

/** A river line on the series map (the base map's river colour, a touch brighter so it can be named); draws on from `at`. */
export const MRiver: React.FC<{api: WApi; pts: number[][]; at: number; width?: number}> = ({api, pts, at: a, width = 4}) => {
  const g = useGFrame();
  const p = interpolate(g, [a, a + 14], [0, 1], clamp);
  const [W, H] = W_MAP.size;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', transform: 'translateZ(1px)'}}>
      <path d={'M' + pts.map(([x, y]) => `${x},${y}`).join(' L')} fill="none" stroke="#8fb4bd" strokeWidth={api.px(width)} strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={0.9} />
    </svg>
  );
};

/** One of today's states on the series map, hatched (orientation only: "Texas", "today's Oklahoma ≈ Indian Territory"). */
export const MState: React.FC<{api: WApi; name: string; at: number; color?: string; out?: number; k?: number}> = ({api, name, at: a, color, out = 1e7, k: kMax = 1}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < a || g > out + 8) return null;
  const k = kMax * Math.min(interpolate(g, [a, a + 8], [0, 1], clamp), interpolate(g, [out, out + 8], [1, 0], clamp));
  const c = color ?? pal.mark;
  const [W, H] = W_MAP.size;
  const gap = api.px(16);
  const id = `st-${name.replace(/\W/g, '')}-${c.replace(/\W/g, '')}`;
  const d = W_MAP.states[`USA:${name}`];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', transform: 'translateZ(1px)', opacity: k}}>
      <defs>
        <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={gap} stroke={c} strokeWidth={api.px(2.5)} />
        </pattern>
      </defs>
      <path d={d} fill={c} opacity={0.1} />
      <path d={d} fill={`url(#${id})`} opacity={0.5} />
      <path d={d} fill="none" stroke={c} strokeWidth={api.px(3)} strokeDasharray={`${api.px(10)} ${api.px(8)}`} />
    </svg>
  );
};

/** A dark torn paper tag (no cream) with a word in handwriting; slaps down at `at`. Used for the Spanish source words. */
export const TornTag: React.FC<{text: string; x: number; y: number; at: number; size?: number; color?: string; rot?: number; seed?: number; sub?: string}> = ({
  text, x, y, at, size = 70, color, rot = -3, seed = 3, sub,
}) => {
  const sl = useSlap(at, 1.3);
  const hand = useHand();
  const pal = usePal();
  if (!sl.on) return null;
  const w = text.length * size * 0.5 * hand.scale + size * 0.9;
  const h = size * 1.55 + (sub ? 34 : 0);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: sl.opacity, transform: `rotate(${rot}deg) scale(${sl.scale})`, transformOrigin: '20% 50%'}}>
      <div style={{position: 'absolute', inset: 0, filter: `drop-shadow(10px 12px 0 ${SHADOW})`}}>
        <div style={{position: 'absolute', inset: 0, clipPath: tornPoly(w, h, seed, {l: true, r: true, t: true, b: true}, 6),
          background: 'radial-gradient(ellipse at 40% 30%, #36312a 0%, #26231d 75%, #1d1a15 100%)'}} />
      </div>
      {sub && <div style={{position: 'absolute', left: size * 0.45, top: 14, fontFamily: JF.mono, fontSize: 18, letterSpacing: 3, color: '#f4efe6', opacity: 0.8, whiteSpace: 'nowrap'}}>{sub}</div>}
      <div style={{position: 'absolute', left: size * 0.45, top: (sub ? 34 : 0) + size * 0.2, fontFamily: hand.family, fontSize: size * hand.scale, color: color ?? pal.mark, whiteSpace: 'nowrap',
        textShadow: '0 0 2px #111, 2px 2px 0 #111'}}>{text}</div>
    </div>
  );
};

/** Four drawn trail riders (hat, shoulders) in a row; `hot` of them turn coral at `hotAt` ("about one in four"). */
export const Four: React.FC<{x: number; y: number; h?: number; at: number; hotAt: number; gap?: number}> = ({x, y, h = 300, at, hotAt, gap = 250}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      {[0, 1, 2, 3].map((i) => {
        const t = at + i * 3;
        if (g < t) return null;
        const k = interpolate(g, [t, t + 3, t + 6], [0, 1.15, 1], clamp);
        const hot = i === 3 && g >= hotAt;
        const s = h / 300;
        const c = hot ? pal.subject : pal.mark;
        const cx = x + i * gap;
        const jit = (random(`f4${i}`) - 0.5) * 6;
        return (
          <g key={i} transform={`translate(${cx} ${y}) scale(${s * k}) rotate(${jit})`}>
            {/* head, hat brim + crown, shoulders and body: a bust, drawn */}
            <ellipse cx={0} cy={-190} rx={44} ry={52} fill={hot ? 'rgba(255,111,97,0.35)' : 'rgba(10,18,16,0.6)'} stroke={c} strokeWidth={7} />
            <path d="M-92,-226 Q0,-246 92,-226 L70,-236 L52,-292 Q0,-308 -52,-292 L-70,-236 Z" fill={hot ? 'rgba(255,111,97,0.5)' : 'rgba(10,18,16,0.8)'} stroke={c} strokeWidth={7} strokeLinejoin="round" />
            <path d="M-110,0 Q-104,-108 -40,-128 L40,-128 Q104,-108 110,0 Z" fill={hot ? 'rgba(255,111,97,0.35)' : 'rgba(10,18,16,0.6)'} stroke={c} strokeWidth={7} strokeLinejoin="round" />
            <path d="M-30,-128 L0,-84 L30,-128" fill="none" stroke={c} strokeWidth={6} />
          </g>
        );
      })}
    </svg>
  );
};

/** Bare handwriting check list with optional strike-through per row (the myth's four marks). */
export const CheckList: React.FC<{x: number; y: number; rows: {text: string; at: number}[]; strikeAt?: number; size?: number; gap?: number}> = ({x, y, rows, strikeAt = 1e7, size = 64, gap = 100}) => {
  const g = useGFrame();
  const pal = usePal();
  const hand = useHand();
  return (
    <>
      {rows.map((r, i) => {
        if (g < r.at) return null;
        const p = interpolate(g, [r.at, r.at + 8], [0, 1], clamp);
        const st = interpolate(g, [strikeAt + i * 3, strikeAt + i * 3 + 6], [0, 1], clamp);
        const w = r.text.length * size * 0.46 * hand.scale + 90;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y + i * gap, width: w, height: size * 1.2}}>
            <div style={{position: 'absolute', left: 0, top: 0, fontFamily: hand.family, fontSize: size * hand.scale, color: st > 0 ? 'rgba(244,239,230,0.55)' : pal.mark, whiteSpace: 'nowrap',
              clipPath: `inset(-60% ${(1 - p) * 100}% -60% -5%)`, textShadow: OUTLINE}}>{r.text} ✓</div>
            {st > 0 && <svg style={{position: 'absolute', left: -10, top: 0, overflow: 'visible'}} width={w} height={size * 1.2}>
              <path d={`M0,${size * 0.68} Q${w / 2},${size * 0.52} ${w},${size * 0.62}`} fill="none" stroke={pal.subject} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - st} />
            </svg>}
          </div>
        );
      })}
    </>
  );
};

const polyD = (pts: number[][]) => 'M' + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L');
/**
 * A trail or route on the series map, like trails.tsx's MTrail (dusty dash, soft glow) but drawn at translateZ(1px): in some
 * camera set-ups Chrome drops the 2px layers MTrail/MRoute use (seen in ch04/ch05 stills), while 1px layers always show.
 * `solid` gives a plain line (a direction arrow's shaft); `dash` false keeps the glow but no dash.
 */
export const MLine: React.FC<{api: WApi; pts: number[][]; at: number; dur?: number; prog?: number; color?: string; width?: number; opacity?: number; dash?: boolean}> = ({
  api, pts, at: a, dur = 30, prog, color, width = 9, opacity = 1, dash = true,
}) => {
  const g = useGFrame();
  const pal = usePal();
  const p = prog ?? interpolate(g, [a, a + dur], [0, 1], clamp);
  if (p <= 0.001) return null;
  const c = color ?? pal.mark;
  const [W, H] = W_MAP.size;
  // the part of the line up to p (by length)
  const seg = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const total = seg.reduce((s, v) => s + v, 0);
  const out: number[][] = [pts[0]];
  let acc = 0;
  for (let i = 0; i < seg.length; i++) {
    if (acc + seg[i] >= p * total) {
      const k = seg[i] ? (p * total - acc) / seg[i] : 0;
      out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]);
      break;
    }
    acc += seg[i];
    out.push(pts[i + 1]);
  }
  const d = polyD(out);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', transform: 'translateZ(1px)', opacity}}>
      <path d={d} fill="none" stroke={SHADOW} strokeWidth={api.px(width + 8)} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
      <path d={d} fill="none" stroke={c} strokeWidth={api.px(width * 2.4)} strokeLinecap="round" strokeLinejoin="round" opacity={0.18} />
      <path d={d} fill="none" stroke={c} strokeWidth={api.px(width)} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash ? `${api.px(22)} ${api.px(12)}` : undefined} />
    </svg>
  );
};

/**
 * A portrait bust cut out of its photograph (the Oct 27 rule: no print, no mount, no oval; head and shoulders on the desk with a
 * soft contact shadow). (x, y) is the top-left of the mask's subject box, `w` its width. `tint` > 0 + `traceAt` for the beat's
 * coral subject; tint 0 and no trace for everyone else (and always in quiet sections). Slaps down at `at`.
 */
export const Bust: React.FC<{src: string; m: MaskRef; x: number; y: number; w: number; at: number; tint?: number; traceAt?: number; rot?: number; filter?: string}> = ({
  src, m, x, y, w, at, tint = 0, traceAt, rot = 0, filter = 'grayscale(1) contrast(1.15) brightness(1.02)',
}) => {
  const sl = useSlap(at, 1.18);
  if (!sl.on) return null;
  const [x0, y0, x1, y1] = m.data.boxes.subject;
  const sc = w / (x1 - x0);
  const h = (y1 - y0) * sc;
  const cx = x + w / 2;
  const cy = y + h / 2;
  return (
    <AbsoluteFill style={{opacity: sl.opacity, transform: `rotate(${rot}deg) scale(${sl.scale})`, transformOrigin: `${cx}px ${cy}px`}}>
      {/* soft contact shadow under the cut-out, offset down-right as if the bust lies a little above the desk */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, filter: 'drop-shadow(10px 20px 18px rgba(0,0,0,0.7)) drop-shadow(2px 4px 3px rgba(0,0,0,0.5))'}}>
        <CutOut src={src} size={m.data.size} mask={m} place={{left: x - x0 * sc, top: y - y0 * sc, scale: sc}} at={-99} shadow="none" tint={tint} soft traceAt={traceAt} filter={filter} />
      </div>
    </AbsoluteFill>
  );
};
