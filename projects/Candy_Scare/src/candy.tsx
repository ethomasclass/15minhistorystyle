// Drawn pieces for The Candy Man: the hand at the door (the motif), trick-or-treat bags, the Loupe on the stapled
// stick, the insurance policy card, the X-ray scan, the counter that won't move and the walk down the street.
// Everything is teal line on the dark notebook paper, stepping at 12 fps with a slight line boil; coral marks the one
// subject in each shot (the thing in the hand, the poisoned stick).
import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import {clamp} from './lib/anim';
import {JF, useGFrame, usePal} from './kit/Kit';
import {DarkPaper} from './kit/common';

export const TEAL = '#2FE0C4';
export const CORAL = '#FF6F61';
export const ORANGE = '#FF9F1C';
export const CREAM = '#f4efe6';
const DARK = '#14110d';

/** Small per-step jitter so drawn lines boil like the rest of the channel's marks. */
const useBoil = (seed: string, amp = 1.6) => {
  const g = useGFrame();
  const b = Math.floor(g / 5);
  return [(random(`${seed}x${b}`) - 0.5) * amp * 2, (random(`${seed}y${b}`) - 0.5) * amp * 2] as const;
};

const line = {fill: 'none', stroke: TEAL, strokeWidth: 6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};

// ---------- the thing in the hand ----------
export type Held = 'stix' | 'capsule' | 'pill' | null;

/** A giant Pixy Stix: a long paper straw, coral with pale stripes, stapled shut at both ends. Local units, centred on 0. */
export const Stix: React.FC<{len?: number; th?: number}> = ({len = 430, th = 30}) => {
  const n = 9;
  return (
    <g>
      <rect x={-len / 2} y={-th / 2} width={len} height={th} rx={6} fill={CORAL} stroke="#3a1712" strokeWidth={3} />
      {Array.from({length: n}).map((_, i) => {
        const x = -len / 2 + 24 + (i * (len - 48)) / (n - 1);
        return <path key={i} d={`M${x - 10},${th / 2 - 2} L${x + 10},${-th / 2 + 2}`} stroke={CREAM} strokeWidth={6} opacity={0.75} />;
      })}
      {[-1, 1].map((s) => (
        <g key={s}>
          <rect x={s < 0 ? -len / 2 - 4 : len / 2 - 20} y={-th / 2 - 3} width={24} height={th + 6} fill="#e9dcc8" stroke="#3a1712" strokeWidth={3} />
          <path d={`M${s * (len / 2 - 8)},${-th / 2 + 4} L${s * (len / 2 - 8)},${th / 2 - 4}`} stroke="#8a8a8a" strokeWidth={4} />
        </g>
      ))}
    </g>
  );
};

const Capsule: React.FC = () => (
  <g>
    <path d="M-50,-20 L0,-20 L0,20 L-50,20 A20,20 0 0 1 -50,-20 Z" fill={CORAL} stroke="#3a1712" strokeWidth={3} />
    <path d="M0,-20 L50,-20 A20,20 0 0 1 50,20 L0,20 Z" fill={CREAM} stroke="#3a1712" strokeWidth={3} />
  </g>
);

const Pill: React.FC = () => (
  <g>
    <ellipse cx={0} cy={0} rx={34} ry={22} fill={CORAL} stroke="#3a1712" strokeWidth={3} />
    <path d="M-12,-2 L-6,-10 L0,-2 L6,-10 L12,-2" fill="none" stroke="#3a1712" strokeWidth={3} />
  </g>
);

/** An open hand, palm up, reaching out to the right from a dark sleeve (wrist at 0,0). */
const Hand: React.FC<{held: Held}> = ({held}) => (
  <g>
    <rect x={-420} y={-50} width={430} height={98} rx={10} {...line} fill={DARK} />
    <path d="M-6,-42 L-6,44" {...line} strokeWidth={4} />
    <path
      d="M4,-40 C34,-46 52,-54 62,-80 C70,-100 96,-98 96,-76 C96,-60 88,-48 100,-38 L214,-32 C242,-31 258,-20 258,-8 C258,4 244,10 218,10 L126,42 C76,56 34,52 4,44 Z"
      {...line} fill="#1d1915" />
    <path d="M128,-14 C168,-12 206,-10 240,-8" {...line} strokeWidth={4} opacity={0.8} />
    <path d="M124,6 C160,4 192,2 222,2" {...line} strokeWidth={4} opacity={0.6} />
    {held === 'stix' && <g transform="translate(150,-58) rotate(-7)"><Stix /></g>}
    {held === 'capsule' && <g transform="translate(176,-58) rotate(-10)"><Capsule /></g>}
    {held === 'pill' && <g transform="translate(176,-56)"><Pill /></g>}
  </g>
);

// ---------- the door ----------
const D = {x0: 150, x1: 590, y0: 330, y1: 1180};
export const HAND_Y = 770;

/**
 * The house front with its door. `open` 0 = open a crack, 1 = wide open on an empty hall. `ext` 0..1 = how far the
 * hand reaches out of the gap. `strikeAt`: an orange line strikes through the hand. `light`: porch-light strength.
 */
export const DoorShot: React.FC<{open?: number; ext?: number; held?: Held; strikeAt?: number; light?: number; children?: React.ReactNode}> = ({
  open = 0, ext = 1, held = 'stix', strikeAt, light = 0.55, children,
}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const [jx, jy] = useBoil('door');
  const [hx, hy] = useBoil('hand', 1.2);
  const W = D.x1 - D.x0;
  const H = D.y1 - D.y0;
  const th = ((26 + open * 58) * Math.PI) / 180;
  const xr = D.x0 + W * Math.cos(th);
  const dy = H * 0.07 * Math.sin(th);
  const lerpY = (t: number, top: boolean) => (top ? D.y0 + dy * t : D.y1 - dy * t);
  const px = (t: number) => D.x0 + (xr - D.x0) * t;
  const panel = (t0: number, t1: number, v0: number, v1: number) => {
    const y = (t: number, v: number) => lerpY(t, true) + (lerpY(t, false) - lerpY(t, true)) * v;
    return `M${px(t0)},${y(t0, v0)} L${px(t1)},${y(t1, v0)} L${px(t1)},${y(t1, v1)} L${px(t0)},${y(t0, v1)} Z`;
  };
  const flick = light * (0.8 + 0.2 * noise2D('porch', g * 0.15, 0));
  const reach = (1 - ext) * 360;
  const strike = strikeAt === undefined ? 0 : interpolate(g, [strikeAt, strikeAt + 6], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      {/* siding */}
      <AbsoluteFill style={{opacity: 0.1, backgroundImage: `linear-gradient(${TEAL} 2px, transparent 2px)`, backgroundSize: '100% 46px', backgroundPosition: '0 12px'}} />
      {/* porch-light glow */}
      <div style={{position: 'absolute', left: 700 - 380, top: 430 - 380, width: 760, height: 760, borderRadius: '50%', opacity: flick,
        background: 'radial-gradient(circle, rgba(255,214,150,0.55) 0%, rgba(255,190,120,0.18) 35%, rgba(0,0,0,0) 70%)'}} />
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <defs>
          <clipPath id="gap"><rect x={xr - 2} y={0} width={1200} height={1920} /></clipPath>
        </defs>
        <g transform={`translate(${jx},${jy})`}>
          {/* doorway and the dark (or the empty hall) behind it */}
          <rect x={D.x0} y={D.y0} width={W} height={H} fill="#040302" />
          {open > 0.05 && (
            <g opacity={interpolate(open, [0.05, 0.7], [0, 0.55], clamp)} {...line} strokeWidth={3}>
              <path d={`M${D.x0 + 120},${D.y0 + 250} L${D.x1 - 120},${D.y0 + 250} L${D.x1 - 120},${D.y1 - 260} L${D.x0 + 120},${D.y1 - 260} Z`} />
              <path d={`M${D.x0},${D.y1} L${D.x0 + 120},${D.y1 - 260} M${D.x1},${D.y1} L${D.x1 - 120},${D.y1 - 260}`} />
              <path d={`M${D.x0},${D.y0} L${D.x0 + 120},${D.y0 + 250} M${D.x1},${D.y0} L${D.x1 - 120},${D.y0 + 250}`} />
            </g>
          )}
          {/* the door itself */}
          <path d={`M${D.x0},${D.y0} L${xr},${D.y0 + dy} L${xr},${D.y1 - dy} L${D.x0},${D.y1} Z`} {...line} fill="#1a1612" />
          <path d={panel(0.14, 0.86, 0.07, 0.44)} {...line} strokeWidth={4} opacity={0.75} />
          <path d={panel(0.14, 0.86, 0.53, 0.92)} {...line} strokeWidth={4} opacity={0.75} />
          <circle cx={px(0.9)} cy={(lerpY(0.9, true) + lerpY(0.9, false)) / 2 + 30} r={11} {...line} strokeWidth={4} />
          {/* frame, trim, steps */}
          <path d={`M${D.x0 - 30},${D.y1} L${D.x0 - 30},${D.y0 - 36} L${D.x1 + 30},${D.y0 - 36} L${D.x1 + 30},${D.y1}`} {...line} />
          <path d={`M${D.x0 - 70},${D.y1} L${D.x1 + 70},${D.y1} L${D.x1 + 70},${D.y1 + 44} L${D.x0 - 70},${D.y1 + 44} Z`} {...line} strokeWidth={5} />
          <path d={`M${D.x0 - 120},${D.y1 + 44} L${D.x1 + 120},${D.y1 + 44} L${D.x1 + 120},${D.y1 + 90} L${D.x0 - 120},${D.y1 + 90} Z`} {...line} strokeWidth={5} />
          {/* porch light */}
          <g {...line} strokeWidth={5}>
            <rect x={676} y={360} width={48} height={22} rx={4} />
            <path d="M672,382 L728,382 L720,470 L680,470 Z" fill={`rgba(255,220,160,${0.15 + flick * 0.5})`} />
            <path d="M686,404 L714,404 M684,428 L716,428 M682,452 L718,452" strokeWidth={3} opacity={0.7} />
          </g>
          {/* house number */}
          <text x={D.x1 + 70} y={D.y0 + 70} fill={TEAL} fontFamily={JF.display} fontSize={52} opacity={0.8}>13</text>
        </g>
        {/* the hand, coming out of the gap */}
        {ext > 0.01 && (
          <g clipPath="url(#gap)">
            <g transform={`translate(${D.x1 - 30 - reach + hx},${HAND_Y + hy}) scale(1.2)`}>
              <Hand held={held} />
            </g>
          </g>
        )}
        {strike > 0 && (
          <path d={`M${D.x1 - 20},${HAND_Y + 70} L${D.x1 - 20 + 420 * strike},${HAND_Y - 120 * strike}`} stroke={ORANGE} strokeWidth={14} strokeLinecap="round" />
        )}
      </svg>
      {children}
    </AbsoluteFill>
  );
};

// ---------- bags ----------
/** A paper trick-or-treat bag (drawn), with an optional stick dropping into it at `dropAt`. Bottom-centre at (x, y). */
export const Bag: React.FC<{x: number; y: number; w?: number; dropAt?: number; checkAt?: number; seed: string; poisoned?: boolean}> = ({x, y, w = 200, dropAt, checkAt, seed, poisoned}) => {
  const g = useGFrame();
  const [jx, jy] = useBoil(seed);
  const h = w * 1.25;
  const drop = dropAt === undefined ? 1 : interpolate(g, [dropAt, dropAt + 8], [0, 1], {...clamp, easing: (t) => t * t});
  const check = checkAt === undefined ? 0 : interpolate(g, [checkAt, checkAt + 6], [0, 1], clamp);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <g transform={`translate(${x + jx},${y + jy})`}>
        {dropAt !== undefined && g >= dropAt && (
          <g transform={`translate(${w * 0.08},${-h - 120 + drop * 120 - (1 - drop) * 500}) rotate(${-78 + (1 - drop) * 20})`}>
            <g transform="scale(0.62)"><Stix /></g>
          </g>
        )}
        <path d={`M${-w / 2},0 L${-w / 2 + 10},${-h} L${w / 2 - 10},${-h} L${w / 2},0 Z`} {...line} fill="#1d1915" />
        <path d={`M${-w / 2 + 10},${-h} L${-w / 2 + 24},${-h + 30} L${w / 2 - 24},${-h + 30} L${w / 2 - 10},${-h}`} {...line} strokeWidth={4} opacity={0.7} />
        <path d={`M${-w * 0.2},${-h + 30} C${-w * 0.2},${-h - 40} ${w * 0.2},${-h - 40} ${w * 0.2},${-h + 30}`} {...line} strokeWidth={5} />
        {check > 0 && (
          <path d={`M${-w * 0.22},${-h * 0.42} L${-w * 0.05},${-h * 0.25} L${w * 0.25},${-h * 0.62}`} {...line} stroke={poisoned ? CORAL : TEAL} strokeWidth={10}
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - check} />
        )}
      </g>
    </svg>
  );
};

/** A teal ring with a magnified, drawn close-up of the stick's stapled end, tied by a line to the spot on the source. */
export const Loupe: React.FC<{cx: number; cy: number; r?: number; fromX: number; fromY: number; at: number}> = ({cx, cy, r = 190, fromX, fromY, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 6], [0.2, 1], clamp);
  const ln = interpolate(g, [at, at + 6], [0, 1], clamp);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <defs><clipPath id="loupe"><circle cx={cx} cy={cy} r={r * k} /></clipPath></defs>
      <circle cx={fromX} cy={fromY} r={34} {...line} strokeWidth={5} />
      <path d={`M${fromX},${fromY} L${fromX + (cx - fromX) * ln},${fromY + (cy - fromY) * ln}`} {...line} strokeWidth={4} />
      <circle cx={cx} cy={cy} r={r * k} fill="#0d0c09" />
      <g clipPath="url(#loupe)">
        <g transform={`translate(${cx},${cy + 40}) rotate(-72) scale(${2.4 * k}) translate(-170,0)`}><Stix /></g>
      </g>
      <circle cx={cx} cy={cy} r={r * k} {...line} strokeWidth={8} />
    </svg>
  );
};

// ---------- the policy ----------
export const Policy: React.FC<{x: number; y: number; w: number; at: number; rot?: number}> = ({x, y, w, at, rot = -2}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 6], [1.08, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `scale(${k}) rotate(${rot}deg)`, background: '#f1ead9', padding: '40px 44px 44px',
      boxShadow: '0 26px 54px rgba(0,0,0,0.75)', border: '2px solid #cbbd9c'}}>
      <div style={{fontFamily: JF.heavy, fontWeight: 900, fontSize: 52, color: '#1d1a14', letterSpacing: 2, textAlign: 'center'}}>LIFE INSURANCE</div>
      <div style={{fontFamily: JF.mono, fontSize: 26, color: '#3b342a', textAlign: 'center', marginTop: 6, letterSpacing: 3}}>POLICY · ON EACH CHILD · 1974</div>
      <div style={{height: 3, background: '#1d1a14', margin: '22px 0 0'}} />
      <div style={{height: 330}} />
      <div style={{height: 2, background: '#8a7f6a'}} />
      <div style={{fontFamily: JF.mono, fontSize: 22, color: '#5b5245', marginTop: 10}}>Amounts per child, taken out across 1974</div>
    </div>
  );
};

// ---------- the X-ray ----------
/** A drawn trick-or-treat bag; a teal scan line sweeps down from `at` and turns everything behind it into an X-ray negative. */
export const XRay: React.FC<{cx: number; top: number; at: number}> = ({cx, top, at}) => {
  const g = useGFrame();
  const w = 520, h = 620;
  const scan = interpolate(g, [at, at + 30], [0, 1], clamp);
  const sy = top - 30 + (h + 60) * scan;
  const candy = (
    <g>
      {[
        [-150, 200, -20], [-40, 160, 15], [80, 210, -10], [150, 300, 25], [-120, 330, 10], [10, 300, -25], [-170, 450, 5], [-30, 440, 18], [110, 430, -8], [40, 540, 12], [-110, 540, -15], [160, 540, 0],
      ].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
          {i % 3 === 0 ? <rect x={-70} y={-22} width={140} height={44} rx={8} /> : i % 3 === 1 ? <><ellipse rx={36} ry={24} /><path d="M-36,0 L-60,-16 L-60,16 Z M36,0 L60,-16 L60,16 Z" /></> : <path d="M-30,24 L0,-30 L30,24 Z" />}
        </g>
      ))}
    </g>
  );
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <defs>
        <clipPath id="xr"><rect x={0} y={0} width={1080} height={sy} /></clipPath>
        <clipPath id="bagShape"><path d={`M${cx - w / 2},${top + h} L${cx - w / 2 + 16},${top} L${cx + w / 2 - 16},${top} L${cx + w / 2},${top + h} Z`} /></clipPath>
      </defs>
      {/* the bag as drawn */}
      <path d={`M${cx - w / 2},${top + h} L${cx - w / 2 + 16},${top} L${cx + w / 2 - 16},${top} L${cx + w / 2},${top + h} Z`} {...line} fill="#1d1915" />
      <path d={`M${cx - 110},${top + 40} C${cx - 110},${top - 90} ${cx + 110},${top - 90} ${cx + 110},${top + 40}`} {...line} />
      {/* behind the scan line: the negative */}
      <g clipPath="url(#xr)">
        <g clipPath="url(#bagShape)">
          <rect x={cx - w / 2} y={top} width={w} height={h} fill="#0a1a1d" />
          <g transform={`translate(${cx},${top})`} fill="rgba(200,245,240,0.55)" stroke="rgba(230,255,252,0.9)" strokeWidth={3}>{candy}</g>
        </g>
        <path d={`M${cx - w / 2},${top + h} L${cx - w / 2 + 16},${top} L${cx + w / 2 - 16},${top} L${cx + w / 2},${top + h} Z`} fill="none" stroke="rgba(230,255,252,0.9)" strokeWidth={5} />
      </g>
      {scan > 0 && scan < 1 && (
        <>
          <rect x={cx - w / 2 - 60} y={sy - 3} width={w + 120} height={6} fill={TEAL} />
          <rect x={cx - w / 2 - 60} y={sy - 28} width={w + 120} height={28} fill="url(#none)" style={{fill: 'rgba(47,224,196,0.18)'}} />
        </>
      )}
    </svg>
  );
};

// ---------- the counter that won't move ----------
export const YearFlip: React.FC<{a: number; b: number; x: number; y: number; size?: number}> = ({a, b, x, y, size = 150}) => {
  const g = useGFrame();
  if (g < a) return null;
  const year = Math.round(interpolate(g, [a, b], [1958, 2026], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 2)}));
  return <div style={{position: 'absolute', left: x, top: y, fontFamily: JF.display, fontSize: size, lineHeight: 1, color: CREAM, textShadow: '0 6px 22px rgba(0,0,0,0.85)'}}>{year}</div>;
};

/** A small grey tag ("hoax", "pin") that pops in at `at`. */
export const Chip: React.FC<{text: string; x: number; y: number; at: number; rot?: number}> = ({text, x, y, at, rot = 0}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [1.3, 0.95, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${k}) rotate(${rot}deg)`, border: '3px solid rgba(237,231,220,0.55)', borderRadius: 10, padding: '6px 18px 4px',
      fontFamily: JF.mono, fontSize: 34, letterSpacing: 2, color: 'rgba(237,231,220,0.75)', background: 'rgba(13,12,9,0.6)'}}>{text}</div>
  );
};

// ---------- the walk ----------
const Figure: React.FC<{x: number; y: number; s: number; phase: number; bag?: boolean}> = ({x, y, s, phase, bag}) => {
  const sw = Math.sin(phase) * 18;
  const bob = Math.abs(Math.sin(phase)) * 4 * s;
  return (
    <g transform={`translate(${x},${y - bob}) scale(${s})`} {...line} strokeWidth={6 / s}>
      <circle cx={0} cy={-150} r={20} fill="#0d0c09" />
      <path d="M0,-128 L0,-52" />
      <path d={`M0,-52 L${-sw},0 M0,-52 L${sw},0`} />
      <path d={`M0,-112 L${sw * 0.8 + 6},-66 M0,-112 L${-sw * 0.8 - 6},-66`} />
      {bag && <path d={`M${-sw * 0.8 - 18},-66 L${-sw * 0.8 + 6},-66 L${-sw * 0.8 + 2},-36 L${-sw * 0.8 - 14},-36 Z`} />}
    </g>
  );
};

/** The street at night: houses with porch lights, a man walking two kids from house to house. */
export const Street: React.FC<{a: number}> = ({a}) => {
  const g = useGFrame();
  const t = g - a;
  const [jx, jy] = useBoil('street');
  const walk = 60 + t * 4.5;
  const ph = t / 4;
  const houses = [-40, 380, 800];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <g transform={`translate(${jx},${jy})`}>
          {houses.map((hx, i) => (
            <g key={i} {...line} strokeWidth={5} opacity={0.85} transform="translate(0,222)">
              <path d={`M${hx},880 L${hx},560 L${hx + 160},430 L${hx + 320},560 L${hx + 320},880`} />
              <rect x={hx + 125} y={720} width={70} height={160} />
              <rect x={hx + 30} y={620} width={70} height={60} />
              <rect x={hx + 220} y={620} width={70} height={60} />
              <circle cx={hx + 215} cy={700} r={8} fill="rgba(255,214,150,0.9)" />
            </g>
          ))}
          {houses.map((hx, i) => (
            <circle key={`g${i}`} cx={hx + 215} cy={922} r={70} fill="rgba(255,214,150,0.12)" />
          ))}
          <path d="M-20,1102 L1100,1102" {...line} strokeWidth={5} />
          <path d="M-20,1150 L1100,1150" {...line} strokeWidth={3} opacity={0.5} />
          <Figure x={walk} y={1100} s={2.1} phase={ph} />
          <Figure x={walk + 110} y={1100} s={1.3} phase={ph + 1.3} bag />
          <Figure x={walk + 200} y={1100} s={1.15} phase={ph + 2.4} bag />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
