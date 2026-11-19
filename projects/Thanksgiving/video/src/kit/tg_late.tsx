// Thanksgiving, chapters 7-8: small pieces shared by the two chapters (placeholders, the loupe, the MOCK tape, recipe cards
// (dropped on their own by kit/tg_drop.tsx: no hands), the eel loop, the cranberry frames, the mock morph, the music levels for the tg_ cues).
//   PH          a placeholder card (plain dark rectangle + the intended file name in mono) that becomes the real image as soon
//               as the file lands in public/ (hasFile), so swapping an asset is a file drop, not a code change
//   Loupe       a teal ring with a 3x crop of any layer, joined by a bowed arrow to a small loop on the detail
//   MockTape    the running joke: an orange torn-tape "MOCK" slapped onto the fake
//   RecipeCard  a 3x5 recipe card in the channel's terms (dark paper, teal rules, a coral header rule: no cream cards)
//   EelLoop     the cold open's wriggling eel cut-out (48 drawings at 12/s, looped)
//   Cran        one of the six cranberry stop-motion frames, aligned plate-bottom-centre as in tests/cran_cut.py
//   Morph       the first/last-frame "mock" morph: the Flow clip's frames when they exist, else a stepped crossfade
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, Loop, useGFrame} from './Kit';
import {hasFile} from './shell';
import {useMarks} from './tg_desk';

export const TEAL = '#2FE0C4';
export const CORAL = '#FF6F61';
export const ORANGE = '#FF9F1C';
export const BW = 'grayscale(1) contrast(1.15) brightness(0.95)';

/** A torn top and bottom edge as a percentage clip-path (any size): for highlighter swipes behind words. */
export const tornPct = (seed: string, amp = 14, n = 16) => {
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) pts.push(`${(i / n) * 100}% ${(random(`${seed}t${i}`) * amp).toFixed(1)}%`);
  for (let i = n; i >= 0; i--) pts.push(`${(i / n) * 100}% ${(100 - random(`${seed}b${i}`) * amp).toFixed(1)}%`);
  return `polygon(${pts.join(',')})`;
};

// ------------------------------------------------------------------ placeholders
export type Placeholder = {file: string; what: string};

/**
 * A placeholder: a plain dark rectangle at the asset's size and place, the intended file name in mono. Once `file` exists in
 * public/, the real image shows instead (B&W unless `filter` says otherwise; `fit` contain for cut-outs, cover for plates).
 * `tone` lightens the card a little to tell stacked placeholders apart (a diorama's planes, the bronze vs the white bird).
 * `children` draw over either (a stand-in drawing, a label).
 */
export const PH: React.FC<{file: string; x?: number; y?: number; w: number; h: number; what?: string; tone?: number; rot?: number; filter?: string;
  fit?: 'cover' | 'contain'; pos?: string; shadow?: boolean; inset?: number; label?: boolean; children?: React.ReactNode; style?: React.CSSProperties}> = ({
  file, x = 0, y = 0, w, h, what, tone = 0, rot = 0, filter = BW, fit = 'contain', pos = '50% 50%', shadow = true, inset = 14, label = true, children, style,
}) => {
  const real = hasFile(file);
  const c = Math.round(26 + tone * 40);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: rot ? `rotate(${rot}deg)` : undefined, ...style}}>
      {real ? (
        <Img src={staticFile(file)} style={{width: w, height: h, objectFit: fit, objectPosition: pos, display: 'block', filter,
          ...(shadow ? {filter: `${filter} drop-shadow(0 3px 2px rgba(0,0,0,0.7)) drop-shadow(0 16px 22px rgba(0,0,0,0.55))`} : {})}} />
      ) : (
        <div style={{position: 'absolute', inset: 0, background: `rgb(${c},${c - 2},${c - 5})`, border: '2px solid rgba(244,239,230,0.16)', boxSizing: 'border-box',
          boxShadow: shadow ? '0 22px 40px rgba(0,0,0,0.6)' : undefined, overflow: 'hidden'}}>
          {label && <div style={{position: 'absolute', left: inset, top: 12, maxWidth: Math.min(w - inset - 14, 900), fontFamily: JF.mono, fontSize: 16, lineHeight: 1.35, letterSpacing: 0.5, color: 'rgba(244,239,230,0.72)',
            wordBreak: 'break-all'}}>
            PLACEHOLDER: {file}{what ? <div style={{color: 'rgba(244,239,230,0.45)', wordBreak: 'normal'}}>{what}</div> : null}
          </div>}
        </div>
      )}
      {children}
    </div>
  );
};

// ------------------------------------------------------------------ loupe
/**
 * "Look closer": a small teal loop on the detail at (cx, cy), then a 6 px teal ring at `to` holding a `zoom`x view of the same
 * layer, with a bowed arrow between. `layer` must draw in screen pixels (it is drawn twice: once in place by the caller, once
 * magnified here). Anchor on the noun.
 */
export const Loupe: React.FC<{layer: React.ReactNode; cx: number; cy: number; r?: number; zoom?: number; to: [number, number]; at: number; small?: number; bow?: number}> = ({
  layer, cx, cy, r = 160, zoom = 3, to, at, small, bow = -40,
}) => {
  const g = useGFrame();
  const mk = useMarks(); // the ring and the lens's ground follow the desk
  if (g < at) return null;
  const s = small ?? r / zoom + 14;
  const ringAt = at + 8;
  const k = interpolate(g, [ringAt, ringAt + 5], [0, 1], clamp);
  const [tx, ty] = to;
  const d = Math.hypot(tx - cx, ty - cy);
  const ux = (tx - cx) / d, uy = (ty - cy) / d;
  return (
    <>
      <Loop cx={cx} cy={cy} rx={s} ry={s} at={at} dur={8} width={5} seed={7} />
      {g >= ringAt && (
        <div style={{position: 'absolute', left: tx - r, top: ty - r, width: r * 2, height: r * 2, borderRadius: '50%', overflow: 'hidden', background: mk.ground,
          boxShadow: `0 0 0 6px ${mk.teal}, 0 20px 40px rgba(0,0,0,0.75)`, transform: `scale(${0.6 + 0.4 * k})`, opacity: Math.min(1, k * 2)}}>
          <div style={{position: 'absolute', left: r - cx * zoom, top: r - cy * zoom, width: 1920, height: 1080, transform: `scale(${zoom})`, transformOrigin: '0 0'}}>{layer}</div>
        </div>
      )}
      <Arrow x1={cx + ux * (s + 12)} y1={cy + uy * (s + 12)} x2={tx - ux * (r + 16)} y2={ty - uy * (r + 16)} bow={bow} at={at + 4} />
    </>
  );
};

// ------------------------------------------------------------------ MOCK
/** The orange torn-tape MOCK, slapped onto the fake at `at` (land with a small overshoot; the stamp sound is the caller's). */
export const MockTape: React.FC<{x: number; y: number; at: number; size?: number; rot?: number; seed?: number}> = ({x, y, at, size = 120, rot = -8, seed = 77}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 3, at + 6], [1.45, 0.95, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${k})`, transformOrigin: '30% 50%', filter: 'drop-shadow(5px 7px 0 rgba(0,0,0,0.5))'}}>
      <Highlight text="MOCK" x={0} y={0} size={size} at={-999} seed={seed} rot={rot} />
    </div>
  );
};

// ------------------------------------------------------------------ recipe cards
export const CARD: [number, number] = [520, 320];

/** A 3x5 recipe card: dark paper, faint teal rules, a coral header rule. `title` in the hand (white), `lines` in teal. */
export const RecipeCard: React.FC<{title: string; lines?: string[]; kicker?: string; w?: number; h?: number; children?: React.ReactNode}> = ({
  title, lines = [], kicker = 'RECIPE', w = CARD[0], h = CARD[1], children,
}) => (
  <div style={{position: 'relative', width: w, height: h, background: 'linear-gradient(160deg, #2a2620, #1c1915)', borderRadius: 6, overflow: 'hidden',
    boxShadow: '0 16px 28px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(244,239,230,0.08)'}}>
    {Array.from({length: 6}, (_, i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: h * 0.3 + i * h * 0.12, height: 1.5, background: 'rgba(47,224,196,0.22)'}} />)}
    <div style={{position: 'absolute', left: 0, right: 0, top: h * 0.26, height: 3, background: 'rgba(255,111,97,0.7)'}} />
    <div style={{position: 'absolute', left: w * 0.05, top: h * 0.04, fontFamily: JF.mono, fontSize: Math.round(h * 0.058), letterSpacing: 2, color: 'rgba(244,239,230,0.6)'}}>{kicker}</div>
    <div style={{position: 'absolute', left: w * 0.05, top: h * 0.105, fontFamily: '"Nanum Pen Script", cursive', fontSize: h * 0.15, lineHeight: 1, color: '#f4efe6', whiteSpace: 'nowrap'}}>{title}</div>
    {lines.map((l, i) => (
      <div key={i} style={{position: 'absolute', left: w * 0.06, top: h * 0.3 + (i + 1) * h * 0.12 - h * 0.115, fontFamily: '"Nanum Pen Script", cursive', fontSize: h * 0.12, lineHeight: 1,
        color: TEAL, whiteSpace: 'nowrap'}}>{l}</div>
    ))}
    {children}
  </div>
);

// (HandDeal, the silhouette hand dealing cards, was removed on Nov 19, 2026: cards now drop on their own, kit/tg_drop.tsx DropDeal.)

/** The cold open's wriggling eel (img/flow/eel), 48 drawings at 12/s, looped. `w` = the 1376 px frame's width on screen. */
export const EelLoop: React.FC<{x: number; y: number; w: number; at?: number; filter?: string}> = ({x, y, w, at = 0, filter}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const i = Math.floor((f - at) / 2.5) % 48;
  return <Img src={staticFile(`img/flow/eel/eel_${String(i).padStart(4, '0')}.png`)} style={{position: 'absolute', left: x, top: y, width: w, height: (w * 768) / 1376, filter,
    WebkitFilter: filter}} />;
};

/** The cranberry set with the whole can in frame (img/flow/cran2/cran_1..6.png, each the full 1376 x 768 frame). Each frame's plate,
 *  in its own pixels (centre x, bottom y, width): the plate moves a little between frames, so frames are placed by their plate (as
 *  tests/cran_cut.py aligns the first set). Frame 6 is the payoff: the log standing on the plate with the can's ridges, the empty
 *  can beside it. (The first set, img/flow/cran, crops the can at the right edge: kit/tg_props keeps it for the Ch01 close-up only.) */
export const CRAN_SIZE: [number, number] = [1376, 768];
const CRAN_PLATE: [number, number, number][] = [[686, 630, 665], [673, 663, 665], [678, 624, 665], [657, 642, 665], [571, 594, 665], [591, 637, 665]];
/** Where frame n's source pixel lands on screen when its plate is centred at (cx, by) and `pw` wide. */
export const cranMap = (n: number, cx: number, by: number, pw: number) => {
  const [pcx, pby, pww] = CRAN_PLATE[n - 1];
  const s = pw / pww;
  return {s, left: cx - pcx * s, top: by - pby * s, at: (sx: number, sy: number): [number, number] => [cx + (sx - pcx) * s, by + (sy - pby) * s]};
};
/** One cranberry frame (1-6), its plate centred at (cx, by) on screen and `pw` wide. The real colour stays (the cranberry may). */
export const Cran: React.FC<{n: number; cx: number; by: number; pw: number; shadow?: boolean}> = ({n, cx, by, pw, shadow = true}) => {
  const m = cranMap(n, cx, by, pw);
  return (
    <Img src={staticFile(`img/flow/cran2/cran_${n}.png`)} style={{position: 'absolute', left: m.left, top: m.top, width: CRAN_SIZE[0] * m.s, height: CRAN_SIZE[1] * m.s,
      filter: shadow ? 'saturate(0.9) drop-shadow(10px 16px 14px rgba(0,0,0,0.6))' : 'saturate(0.9)'}} />
  );
};

// ------------------------------------------------------------------ morph
/**
 * The first/last-frame mock morph (Flow technique 6). With the clip's frames in `dir` (frame_0000.png ... at 12/s, `count` of them)
 * it plays them from `from` to `to`; until then the two placeholder frames crossfade in 12 fps steps with a slight swell.
 */
export const Morph: React.FC<{a: Placeholder; b: Placeholder; dir: string; count?: number; from: number; to: number; x: number; y: number; w: number; h: number}> = ({
  a, b, dir, count = 30, from, to, x, y, w, h,
}) => {
  const g = useGFrame();
  const p = interpolate(g, [from, to], [0, 1], clamp);
  const first = `${dir}/frame_0000.png`;
  if (hasFile(first)) {
    const i = Math.min(count - 1, Math.floor(p * (count - 1)));
    return <Img src={staticFile(`${dir}/frame_${String(i).padStart(4, '0')}.png`)} style={{position: 'absolute', left: x, top: y, width: w, height: h, objectFit: 'contain',
      filter: 'saturate(0.9) drop-shadow(0 22px 30px rgba(0,0,0,0.7))'}} />;
  }
  const swell = 1 + 0.04 * Math.sin(p * Math.PI);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `scale(${swell})`}}>
      <PH file={a.file} what={a.what} w={w} h={h} filter="saturate(0.9)" style={{opacity: 1 - p}} />
      <PH file={b.file} what={b.what} w={w} h={h} tone={0.25} filter="saturate(0.9)" style={{opacity: p}} />
      {!hasFile(first) && p > 0 && p < 1 && (
        <div style={{position: 'absolute', left: 14, bottom: 12, fontFamily: JF.mono, fontSize: 16, color: 'rgba(244,239,230,0.6)'}}>MORPH {Math.round(p * 100)}% · PLACEHOLDER: {dir}/</div>
      )}
    </div>
  );
};

