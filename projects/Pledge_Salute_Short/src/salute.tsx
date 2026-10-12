// Hand-drawn illustrations in the channel's line style: a stick figure whose right arm moves between poses
// (down, the 1892 straight-arm salute, hand over heart), and a sketched flag on a pole. Lines boil at 12 fps.
import React from 'react';
import {Easing, interpolate, random} from 'remotion';
import {clamp} from './lib/anim';
import {useGFrame, useHand, usePal} from './kit/Kit';

export type Pose = 'down' | 'salute' | 'heart';

/** Right-arm joint angles (degrees, 0 = pointing right, positive = down) for each pose: [upper arm, forearm]. */
const ARM: Record<Pose, [number, number]> = {
  down: [80, 85],
  salute: [-12, -12],   // straight out and slightly raised, toward the flag
  heart: [70, 200],     // elbow down and out, forearm folded back across the chest
};

/**
 * A stick figure facing right. `from`/`to` poses animate between frames `a` and `b`. `at` draws the figure on.
 * `color` defaults to the teal mark colour; pass the coral subject colour for the 1930s figure.
 */
export const SaluteFigure: React.FC<{x: number; y: number; h: number; at: number; from?: Pose; to?: Pose; a?: number; b?: number; color?: string; label?: string; labelColor?: string}> = ({
  x, y, h, at, from = 'down', to = 'salute', a = at + 10, b = a + 10, color, label, labelColor,
}) => {
  const g = useGFrame();
  const pal = usePal();
  const hand0 = useHand();
  if (g < at) return null;
  const c = color ?? pal.mark;
  const boil = Math.floor(g / 5);
  const j = (k: string, amp = 2.5) => (random(`${k}${boil}`) - 0.5) * amp;
  const draw = interpolate(g, [at, at + 10], [0, 1], clamp);
  const u = interpolate(g, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const lerp = (p: number, q: number) => p + (q - p) * u;
  const [ua, fa] = [lerp(ARM[from][0], ARM[to][0]), lerp(ARM[from][1], ARM[to][1])];
  const s = h / 100;
  const head = {cx: 50 * s, cy: 12 * s, r: 9 * s};
  const neck = [50 * s, 22 * s], hip = [50 * s, 60 * s], shoulder = [50 * s, 30 * s];
  const seg = 18 * s;
  const rad = (d: number) => (d * Math.PI) / 180;
  const elbow = [shoulder[0] + Math.cos(rad(ua)) * seg, shoulder[1] + Math.sin(rad(ua)) * seg];
  const hand = [elbow[0] + Math.cos(rad(fa)) * seg * 0.95, elbow[1] + Math.sin(rad(fa)) * seg * 0.95];
  const stroke = {fill: 'none', stroke: c, strokeWidth: Math.max(4, 3.2 * s), strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - draw};
  const P = (pts: number[][]) => 'M' + pts.map(([px, py], i) => `${(px + j(`p${i}${px}`)).toFixed(1)},${(py + j(`q${i}${py}`)).toFixed(1)}`).join(' L');
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 100 * s, height: 100 * s}}>
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={100 * s} height={100 * s}>
        <circle cx={head.cx + j('h')} cy={head.cy} r={head.r} {...stroke} />
        <path d={P([neck, hip])} {...stroke} />
        {/* left arm hangs at the side */}
        <path d={P([shoulder, [40 * s, 46 * s], [38 * s, 60 * s]])} {...stroke} />
        {/* legs */}
        <path d={P([hip, [42 * s, 80 * s], [40 * s, 98 * s]])} {...stroke} />
        <path d={P([hip, [58 * s, 80 * s], [60 * s, 98 * s]])} {...stroke} />
        {/* the right arm: the one that changes */}
        <path d={P([shoulder, elbow, hand])} {...stroke} strokeWidth={Math.max(5, 4 * s)} />
        {to === 'heart' && u > 0.85 && <path d={`M${hand[0] - 5 * s},${hand[1] - 2 * s} q${3 * s},${-5 * s} ${6 * s},0 q${3 * s},${-5 * s} ${6 * s},0 q0,${6 * s} ${-6 * s},${10 * s} q${-6 * s},${-4 * s} ${-6 * s},${-10 * s}`}
          fill={pal.subject} opacity={interpolate(u, [0.85, 1], [0, 0.9], clamp)} />}
      </svg>
      {label && <div style={{position: 'absolute', left: 0, width: 100 * s, top: 102 * s, textAlign: 'center', fontFamily: hand0.family, fontSize: 16 * s * hand0.scale, color: labelColor ?? '#f4efe6',
        textShadow: '0 0 4px #111, 0 2px 8px rgba(0,0,0,0.8)'}}>{label}</div>}
    </div>
  );
};

/** A sketched flag on a pole: teal outline, coral stripes, a teal canton with dots. Waves a little. */
export const FlagSketch: React.FC<{x: number; y: number; w: number; at: number}> = ({x, y, w, at}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const h = w * 0.62;
  const draw = interpolate(g, [at, at + 10], [0, 1], clamp);
  const fill = interpolate(g, [at + 6, at + 14], [0, 1], clamp);
  const wave = (k: number) => Math.sin(g / 6 + k) * w * 0.025;
  const pole = h * 2.4;
  const top = (t: number) => [w * 0.06 + t * w, wave(t * 4)];
  const stroke = {fill: 'none', stroke: pal.mark, strokeWidth: 5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - draw};
  const edge = Array.from({length: 9}, (_, i) => top(i / 8));
  const outline = `M${edge.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(' L')} L${edge.slice().reverse().map(([px, py]) => `${px.toFixed(1)},${(py + h).toFixed(1)}`).join(' L')} Z`;
  return (
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={w * 1.1} height={pole}>
      <g opacity={fill}>
        {Array.from({length: 7}, (_, i) => (
          <path key={i} d={`M${edge.map(([px, py]) => `${px.toFixed(1)},${(py + (i * 2 + 0.5) * (h / 13)).toFixed(1)}`).join(' L')}`} fill="none" stroke={pal.subject} strokeWidth={h / 13} opacity={0.85} />
        ))}
        <rect x={w * 0.06} y={wave(0)} width={w * 0.42} height={h * 0.54} fill="#0f2f2b" stroke={pal.mark} strokeWidth={3} />
        {Array.from({length: 12}, (_, i) => <circle key={i} cx={w * 0.06 + w * 0.06 + (i % 4) * w * 0.1} cy={wave(0) + h * 0.1 + Math.floor(i / 4) * h * 0.16} r={w * 0.012} fill="#f4efe6" />)}
      </g>
      <path d={outline} {...stroke} />
      <path d={`M${w * 0.06},${-h * 0.1} L${w * 0.06},${pole}`} {...stroke} strokeWidth={6} />
      <circle cx={w * 0.06} cy={-h * 0.14} r={8} fill={pal.box ?? '#FF9F1C'} opacity={fill} />
    </svg>
  );
};
