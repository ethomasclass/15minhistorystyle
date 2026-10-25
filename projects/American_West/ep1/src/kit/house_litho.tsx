// The House chamber as a lithograph (the user asked to see it in place of the seat diagram, ch01 + ch02).
// Images: public/img/ch02/ai_house_session.jpg (a session with the right side of the floor empty) and
// public/img/ch01/ai_house_empty.jpg (the whole chamber empty). Generated; no on-screen tag (the user's rule).
// The empty-desk region comes from Gemini's boxes (review/ai_house_chamber/session_regions.json), not by eye.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {Note, useGFrame} from './Kit';
import {keys, Mono, PhotoCam, zkeys} from './west';

export const SESSION = {src: 'img/ch02/ai_house_session.jpg', size: [1920, 1091] as [number, number]};
export const EMPTY_HALL = {src: 'img/ch01/ai_house_empty.jpg', size: [1920, 1099] as [number, number]};
const LITHO_LOOK = 'saturate(0.7) contrast(1.06) brightness(0.9)';

/** The empty side of the floor in source px (union of Gemini's "empty" boxes, normalised 0-1000 → px). */
const n = (x: number, y: number): [number, number] => [(x * SESSION.size[0]) / 1000, (y * SESSION.size[1]) / 1000];
export const EMPTY_POLY: [number, number][] = [n(492, 548), n(672, 535), n(960, 540), n(985, 775), n(985, 935), n(865, 998), n(477, 998), n(477, 845)];

/** A see-through coral wash over the empty desks, fading in at `at` (colour blend, so the drawing shows through). */
const EmptyWash: React.FC<{S: (x: number, y: number) => [number, number]; at: number; out?: number; k?: number; outline?: boolean}> = ({S, at, out = 1e7, k = 1, outline = true}) => {
  const g = useGFrame();
  const o = Math.min(interpolate(g, [at, at + 6], [0, 1], clamp), interpolate(g, [out, out + 8], [1, 0], clamp));
  if (o <= 0) return null;
  const pts = EMPTY_POLY.map(([x, y]) => S(x, y));
  const d = 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' L') + ' Z';
  const per = pts.reduce((acc, p, i) => { const q = pts[(i + 1) % pts.length]; return acc + Math.hypot(q[0] - p[0], q[1] - p[1]); }, 0);
  const draw = interpolate(g, [at + 2, at + 14], [0, 1], clamp);
  return (
    <>
      {/* 1 · everything else dims, so the eye goes to the empty desks */}
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: o}} width={1920} height={1080}>
        <defs><filter id="hlDim"><feGaussianBlur stdDeviation={16} /></filter></defs>
        <path d={`M-400,-400 H2320 V1480 H-400 Z ${d}`} fillRule="evenodd" fill={`rgba(6,5,4,${0.55 * k})`} filter="url(#hlDim)" />
      </svg>
      {/* 2 · a see-through coral on the empty desks (colour blend keeps the drawing) */}
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', mixBlendMode: 'color', opacity: 0.42 * k * o}} width={1920} height={1080}>
        <defs><filter id="hlCo"><feGaussianBlur stdDeviation={8} /></filter></defs>
        <path d={d} fill="#FF6F61" filter="url(#hlCo)" />
      </svg>
      {/* 3 · a teal line traced around them (12 fps, draws on) */}
      {outline && (
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: o}} width={1920} height={1080}>
          <path d={d} fill="none" stroke="#2FE0C4" strokeWidth={5} strokeLinejoin="round" strokeDasharray={`${per * draw} ${per}`} />
        </svg>
      )}
    </>
  );
};

/** ch02 · 2 (wide): the session; on "empty", the right side of the floor washes coral and gets a teal loop. */
export const HouseWideLitho: React.FC<{a: number; b: number; emptyAt: number; secondAt: number}> = ({a, b, emptyAt, secondAt}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <PhotoCam src={SESSION.src} size={SESSION.size} bw={LITHO_LOOK} cx={keys(f, [[a, 960], [b, 1010]])} cy={keys(f, [[a, 560], [b, 600]])} s={zkeys(f, [[a, 1.0], [b, 1.08]])} vignette={0.55}>
        {(S) => <EmptyWash S={S} at={emptyAt} />}
      </PhotoCam>
      <Mono text="U.S. HOUSE OF REPRESENTATIVES · 1862" x={110} y={80} size={26} at={a + 4} />
      <Note text="the war's second year" x={110} y={150} size={52} rot={-3} at={secondAt - 2} color="#ffffff" />
      <Note text="empty seats" x={1380} y={150} size={62} rot={-3} at={emptyAt - 2} color="#FF6F61" />
    </AbsoluteFill>
  );
};

/** ch02 · 3 (cut-in): a push along the empty desks, with the count. */
export const HouseDetailLitho: React.FC<{a: number; b: number; wentAt: number; label: string}> = ({a, b, wentAt, label}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <PhotoCam src={SESSION.src} size={SESSION.size} bw={LITHO_LOOK} cx={keys(f, [[a, 980], [b, 1060]])} cy={keys(f, [[a, 800], [b, 820]])} s={zkeys(f, [[a, 1.55], [b, 1.7]])} vignette={0.6}>
        {(S) => <EmptyWash S={S} at={a - 30} k={0.9} />}
      </PhotoCam>
      <Mono text={label} x={110} y={60} size={26} at={a + 6} color="#FF6F61" />
      <Note text="they went with them" x={120} y={130} size={58} rot={-3} at={wentAt - 2} />
    </AbsoluteFill>
  );
};

/** ch02 · 7: "With the South gone": the coral wash drains away and the camera pulls back over the working floor. */
export const SouthGoneLitho: React.FC<{a: number; b: number; goneAt: number; children?: React.ReactNode}> = ({a, b, goneAt, children}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <PhotoCam src={SESSION.src} size={SESSION.size} bw={LITHO_LOOK} cx={keys(f, [[a, 1000], [b, 960]])} cy={keys(f, [[a, 640], [b, 560]])} s={zkeys(f, [[a, 1.18], [b, 1.0]])} vignette={0.7}>
        {(S) => <EmptyWash S={S} at={a - 30} out={goneAt} />}
      </PhotoCam>
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(8,7,5,0.72) 0%, rgba(8,7,5,0.35) 45%, rgba(8,7,5,0) 70%)'}} />
      {children}
    </AbsoluteFill>
  );
};

/** ch01 · hand-off: "a room full of empty chairs": the whole chamber, empty, a slow push toward the rostrum. */
export const ChairsLitho: React.FC<{a: number; end: number; emptyAt: number}> = ({a, end, emptyAt}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <PhotoCam src={EMPTY_HALL.src} size={EMPTY_HALL.size} bw={LITHO_LOOK} cx={keys(f, [[a, 960], [end, 960]])} cy={keys(f, [[a, 600], [end, 640]])} s={zkeys(f, [[a, 1.0], [end, 1.14]])} vignette={0.6} />
      <Note text="a room full of empty chairs" x={560} y={110} size={64} rot={-3} at={emptyAt - 2} color="#ffffff" />
    </AbsoluteFill>
  );
};
