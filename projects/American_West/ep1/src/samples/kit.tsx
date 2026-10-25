// Collage pieces for the West style samples, all in the desk palette (no cream or white surfaces):
// torn prints with orange tape, cut-outs with a hard ink (or coral) offset shadow, a dark map card,
// a survey-plat grid, a document focus pull, and the ledger / hinge-year / resistance-card devices.
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile} from 'remotion';
import {clamp} from '../lib/anim';
import {boxOf, Finish, JF, Loop, PALETTES, PaletteCtx, type Place, StepCtx, Tint, Traced, useGFrame, useHand, usePal} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import type {MaskRef} from '../kit/maskref';
import PROFILES from './torn_profiles.json';

export const SHADOW = '#050403';
export const BW = 'grayscale(1) contrast(1.25) brightness(0.97)';
export const MAPLOOK = 'grayscale(1) sepia(0.25) contrast(1.2) brightness(0.62)';

/** Wraps a sample frame: locked palette, 12 fps marks, grain and the chapter vignette. */
export const Sample: React.FC<{children: React.ReactNode; desk?: boolean}> = ({children, desk = true}) => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
        {desk && <DarkPaper />}
        {children}
        <Finish vignette={0.3} />
      </AbsoluteFill>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);

/** Drop-onto-the-desk timing (stepped, so it lands in 12 fps drawings). */
export const useDrop = (at: number) => {
  const g = useGFrame();
  const k = interpolate(g, [at, at + 6], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) * (1 - 2.2 * t * (1 - t))});
  return {on: g >= at, k, air: 1 - Math.min(1, k)};
};

/** A clip-path polygon (px) for a w x h rectangle with deckled edges and an optional torn-away corner. */
export const tornPoly = (w: number, h: number, seed: number, torn: {t?: boolean; r?: boolean; b?: boolean; l?: boolean}, amp = 9,
  corner?: {at: 'br' | 'bl' | 'tr'; x: number; y: number}, real = false) => {
  const pts: [number, number][] = [];
  const run = (x0: number, y0: number, x1: number, y1: number, rough: boolean, nx: number, ny: number, key: string, a = amp) => {
    // `real`: the bite profile of an actual torn paper edge (from the AI texture pack's alpha), sampled along the edge
    const prof = (PROFILES as number[][])[Math.floor(random(`${seed}${key}p`) * PROFILES.length)];
    const off = random(`${seed}${key}o`) * 0.5;
    const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / (real ? 5 : 14)));
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const j = !rough ? 0 : real ? a * 1.6 * (1 - prof[Math.floor(((off + t * 0.5) % 1) * (prof.length - 1))])
        : a * (0.25 + 0.75 * random(`${seed}${key}${i}`)) * (i % 3 === 0 ? 1 : 0.55);
      pts.push([x0 + (x1 - x0) * t + nx * j, y0 + (y1 - y0) * t + ny * j]);
    }
  };
  const c = corner;
  run(0, 0, c?.at === 'tr' ? w * c.x : w, 0, !!torn.t, 0, 1, 't');
  if (c?.at === 'tr') run(w * c.x, 0, w, h * c.y, true, -0.7, 0.7, 'c', amp * 1.8);
  run(w, c?.at === 'tr' ? h * c.y : 0, w, c?.at === 'br' ? h * c.y : h, !!torn.r, -1, 0, 'r');
  if (c?.at === 'br') run(w, h * c.y, w * c.x, h, true, -0.7, -0.7, 'c', amp * 1.8);
  run(c?.at === 'br' ? w * c.x : w, h, c?.at === 'bl' ? w * c.x : 0, h, !!torn.b, 0, -1, 'b');
  if (c?.at === 'bl') run(w * c.x, h, 0, h * c.y, true, 0.7, -0.7, 'c', amp * 1.8);
  run(0, c?.at === 'bl' ? h * c.y : h, 0, 0, !!torn.l, 1, 0, 'l');
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`;
};

/** A strip of orange tape with torn ends, in the parent's coordinates. */
export const Tape: React.FC<{x: number; y: number; w?: number; h?: number; rot?: number; seed?: number; grey?: boolean}> = ({x, y, w = 150, h = 42, rot = -8, seed = 1, grey = false}) => {
  const pal = usePal();
  if (grey) {
    // translucent grey tape scanned from the AI texture pack
    return <Img src={staticFile(`img/previews/tape_grey_${(seed % 2) + 1}.png`)} style={{position: 'absolute', left: x, top: y, width: w, height: w * 0.21,
      transform: `rotate(${rot}deg)`, opacity: 0.82, filter: 'grayscale(0.6) brightness(1.05)'}} />;
  }
  const pts: string[] = [];
  const n = 7;
  for (let i = 0; i <= n; i++) pts.push(`${(random(`tl${seed}${i}`) * 8).toFixed(1)}px ${((i / n) * h).toFixed(1)}px`);
  for (let i = n; i >= 0; i--) pts.push(`${(w - random(`tr${seed}${i}`) * 8).toFixed(1)}px ${((i / n) * h).toFixed(1)}px`);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg)`, background: boxOf(pal), opacity: 0.86,
      clipPath: `polygon(${pts.join(',')})`, boxShadow: 'inset 0 0 14px rgba(120,60,0,0.35)'}} />
  );
};

type Crop = [number, number, number, number];

/**
 * An archival print on the desk: the scan's own pixels with deckled edges (no border), a hard ink offset shadow,
 * orange tape, optional torn-away corner. `crop` is the source window; children get S (source px -> print px).
 */
export const TornPrint: React.FC<{src: string; size: [number, number]; x: number; y: number; w: number; crop?: Crop; rot?: number; at?: number; seed?: number;
  torn?: {t?: boolean; r?: boolean; b?: boolean; l?: boolean}; corner?: {at: 'br' | 'bl' | 'tr'; x: number; y: number}; tapes?: {x: number; y: number; w?: number; rot?: number}[];
  filter?: string; mask?: MaskRef; tint?: number; traceAt?: number; shadow?: number; real?: boolean; grey?: boolean; children?: (S: (sx: number, sy: number) => [number, number], w: number, h: number) => React.ReactNode}> = ({
  src, size, x, y, w, crop, rot = 0, at = 0, seed = 1, torn = {t: true, r: true, b: true, l: true}, corner, tapes = [], filter = BW, mask, tint = 0, traceAt, shadow = 14, real = false, grey = false, children,
}) => {
  const d = useDrop(at);
  if (!d.on) return null;
  const [sx0, sy0, sx1, sy1] = crop ?? [0, 0, size[0], size[1]];
  const sc = w / (sx1 - sx0);
  const h = (sy1 - sy0) * sc;
  const place: Place = {left: -sx0 * sc, top: -sy0 * sc, scale: sc};
  const S = (sx: number, sy: number): [number, number] => [place.left + sx * sc, place.top + sy * sc];
  const clip = tornPoly(w, h, seed, torn, 9, corner, real);
  return (
    <div style={{position: 'absolute', left: x, top: y - d.air * 50, width: w, height: h, transform: `rotate(${rot + d.air * 5}deg) scale(${1 + d.air * 0.25})`, opacity: Math.min(1, d.k * 3)}}>
      <div style={{position: 'absolute', inset: 0, filter: `drop-shadow(${shadow}px ${shadow + 4}px 0 ${SHADOW})`}}>
        <div style={{position: 'absolute', inset: 0, clipPath: clip, overflow: 'hidden'}}>
          <Img src={staticFile(src)} style={{position: 'absolute', left: place.left, top: place.top, width: size[0] * sc, height: size[1] * sc, filter}} />
          {mask && tint > 0 && <Tint mask={mask.alpha} place={place} size={size} strength={tint} />}
        </div>
      </div>
      {mask && traceAt !== undefined && <Traced paths={mask.data.shapes.subject} place={place} at={traceAt} dur={12} width={5} part={0.92} />}
      {tapes.map((t, i) => <Tape key={i} x={t.x} y={t.y} w={t.w} rot={t.rot} seed={seed * 10 + i} grey={grey} />)}
      {children?.(S, w, h)}
    </div>
  );
};

/**
 * A cut-out on the desk: the masked subject only, no sticker edge, lifted by a hard offset shadow (ink by default,
 * or coral, which then replaces tint + trace as the frame's one coral subject). Grain comes from Finish.
 */
export const CutOut: React.FC<{src: string; size: [number, number]; mask: MaskRef; place: Place; at?: number; shadow?: 'ink' | 'coral' | 'none'; off?: [number, number];
  tint?: number; traceAt?: number; filter?: string; soft?: boolean}> = ({src, size, mask, place, at = 0, shadow = 'ink', off = [12, 14], tint = 0, traceAt, filter = BW, soft = false}) => {
  const d = useDrop(at);
  const pal = usePal();
  if (!d.on) return null;
  const W = size[0] * place.scale;
  const H = size[1] * place.scale;
  const m: React.CSSProperties = {WebkitMaskImage: `url(${staticFile(mask.alpha)})`, WebkitMaskSize: '100% 100%', maskImage: `url(${staticFile(mask.alpha)})`, maskSize: '100% 100%'} as React.CSSProperties;
  const [bx0, by0, bx1, by1] = mask.data.boxes.subject;
  const ox = place.left + ((bx0 + bx1) / 2) * place.scale;
  const oy = place.top + by1 * place.scale;
  return (
    <AbsoluteFill style={{transform: `translateY(${-d.air * 60}px) scale(${1 + d.air * 0.12})`, transformOrigin: `${ox}px ${oy}px`, opacity: Math.min(1, d.k * 3)}}>
      {shadow === 'coral' && <div style={{position: 'absolute', left: place.left + off[0], top: place.top + off[1], width: W, height: H, background: pal.subject, ...m}} />}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, filter: shadow === 'ink' ? `drop-shadow(${off[0]}px ${off[1]}px 0 ${SHADOW})` : undefined}}>
        <Img src={staticFile(src)} style={{position: 'absolute', left: place.left, top: place.top, width: W, height: H, filter, ...m}} />
        {tint > 0 && (soft ? <SoftTint mask={mask.alpha} place={place} size={size} strength={tint} /> : <Tint mask={mask.alpha} place={place} size={size} strength={tint} />)}
      </div>
      {traceAt !== undefined && <Traced paths={mask.data.shapes.subject} place={place} at={traceAt} dur={12} width={5} part={0.93} />}
    </AbsoluteFill>
  );
};

/** A lighter coral tint (colour blend + a little multiply, no screen layer) so the photo's own detail stays visible. */
export const SoftTint: React.FC<{mask: string; place: Place; size: [number, number]; strength?: number}> = ({mask, place, size, strength = 0.6}) => {
  const pal = usePal();
  const m: React.CSSProperties = {position: 'absolute', left: place.left, top: place.top, width: size[0] * place.scale, height: size[1] * place.scale,
    WebkitMaskImage: `url(${staticFile(mask)})`, WebkitMaskSize: '100% 100%', maskImage: `url(${staticFile(mask)})`, maskSize: '100% 100%'} as React.CSSProperties;
  return (
    <>
      <div style={{...m, background: pal.subject, mixBlendMode: 'color', opacity: strength}} />
      <div style={{...m, background: pal.subject, mixBlendMode: 'multiply', opacity: 0.18 * strength}} />
    </>
  );
};

/** Mono uppercase label on an ink strip (field tags, card captions). */
export const Mono: React.FC<{text: string; x: number; y: number; size?: number; color?: string; bg?: string; at?: number; rot?: number}> = ({text, x, y, size = 22, color, bg = '#0b0a08', at = -999, rot = 0}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: JF.mono, fontSize: size, letterSpacing: 2, color: color ?? pal.mark, textTransform: 'uppercase', whiteSpace: 'nowrap',
      background: bg, padding: `${size * 0.25}px ${size * 0.55}px`, transform: `rotate(${rot}deg)`}}>{text}</div>
  );
};

/** Teal map pin. */
export const Pin: React.FC<{x: number; y: number; at: number; size?: number}> = ({x, y, at, size = 22}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [0, 1.35, 1], clamp);
  return <div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: '50%', background: pal.mark, border: '4px solid #111', boxSizing: 'border-box', transform: `scale(${k})`}} />;
};

/**
 * Locator map card: a dark card, thin teal rule, a flat crop of a period map around (fx, fy), a pin or a loop.
 */
export const MapCard: React.FC<{x: number; y: number; w: number; h: number; src: string; size: [number, number]; fx: number; fy: number; scale: number; rot?: number; at: number;
  pin?: [number, number]; loop?: {sx: number; sy: number; rx: number; ry: number}; label?: string; labelAt?: [number, number]; caption?: string; bright?: boolean}> = ({
  x, y, w, h, src, size, fx, fy, scale, rot = 0, at, pin, loop, label, labelAt, caption, bright = false,
}) => {
  const d = useDrop(at);
  const pal = usePal();
  const hand = useHand();
  if (!d.on) return null;
  const pad = 12;
  const iw = w - pad * 2;
  const ih = h - pad * 2 - (caption ? 34 : 0);
  const left = iw / 2 - fx * scale;
  const top = ih / 2 - fy * scale;
  const P = (sx: number, sy: number) => [pad + left + sx * scale, pad + top + sy * scale];
  return (
    <div style={{position: 'absolute', left: x, top: y - d.air * 40, width: w, height: h, transform: `rotate(${rot + d.air * 4}deg)`, opacity: Math.min(1, d.k * 3),
      background: '#16140f', boxShadow: `12px 14px 0 ${SHADOW}`}}>
      <div style={{position: 'absolute', left: pad, top: pad, width: iw, height: ih, overflow: 'hidden'}}>
        <Img src={staticFile(src)} style={{position: 'absolute', left, top, width: size[0] * scale, height: size[1] * scale, filter: bright ? 'grayscale(1) sepia(0.3) contrast(1.15) brightness(0.95)' : MAPLOOK}} />
        <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(8,6,4,${bright ? 0.4 : 0.7}) 100%)`}} />
      </div>
      <div style={{position: 'absolute', inset: 5, border: `2px solid ${pal.mark}`, opacity: 0.85}} />
      {loop && (() => {
        const [cx, cy] = P(loop.sx, loop.sy);
        return <Loop cx={cx} cy={cy} rx={loop.rx * scale} ry={loop.ry * scale} at={at + 6} seed={41} tilt={-8} width={5} />;
      })()}
      {pin && (() => {
        const [px, py] = P(pin[0], pin[1]);
        return <Pin x={px} y={py} at={at + 6} />;
      })()}
      {label && labelAt && (
        <div style={{position: 'absolute', left: labelAt[0], top: labelAt[1], fontFamily: hand.family, fontSize: 40 * hand.scale, color: pal.mark, whiteSpace: 'nowrap',
          textShadow: '0 0 2px #111, 2px 2px 0 #111, -2px 2px 0 #111, 2px -2px 0 #111, -2px -2px 0 #111', transform: 'rotate(-4deg)'}}>{label}</div>
      )}
      {caption && <div style={{position: 'absolute', left: pad + 4, bottom: pad - 2, fontFamily: JF.mono, fontSize: 17, letterSpacing: 2, color: pal.mark, whiteSpace: 'nowrap'}}>{caption}</div>}
    </div>
  );
};

/** Standard survey-township section number for row r, column c (sections 1-36, serpentine from the NE corner). */
export const sectionNo = (r: number, c: number) => (r % 2 === 0 ? r * 6 + (6 - c) : r * 6 + c + 1);

/**
 * Public Land Survey plat in teal on the desk: townships of 6 x 6 sections; the rail line (coral, the subject) draws
 * across the middle and the odd-numbered sections it passes fill orange for the railroad; even ones stay open
 * (government). `per` = frames per column.
 */
export const PlatGrid: React.FC<{x: number; y: number; cols: number; rows: number; cell: number; at: number; per?: number; railRow?: number; numbers?: boolean; fillOdd?: boolean}> = ({
  x, y, cols, rows, cell, at, per = 2, railRow, numbers = true, fillOdd = true,
}) => {
  const g = useGFrame();
  const pal = usePal();
  const W = cols * cell;
  const H = rows * cell;
  const grid = interpolate(g, [at, at + 8], [0, 1], clamp);
  const railStart = at + 8;
  const railP = interpolate(g, [railStart, railStart + cols * per], [0, 1], clamp);
  const ry = (railRow ?? rows / 2) * cell;
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const n = sectionNo(r % 6, c % 6);
    const odd = n % 2 === 1;
    const on = fillOdd && odd && g >= railStart + c * per + 2;
    cells.push(
      <g key={`${r}-${c}`}>
        {on && <rect x={c * cell + 3} y={r * cell + 3} width={cell - 6} height={cell - 6} fill={boxOf(pal)} opacity={0.82} />}
        {numbers && grid >= 1 && <text x={c * cell + cell / 2} y={r * cell + cell / 2 + 7} textAnchor="middle" fontFamily={JF.mono} fontSize={Math.round(cell * 0.24)}
          fill={on ? '#111' : 'rgba(47,224,196,0.55)'}>{n}</text>}
      </g>,
    );
  }
  const lines: React.ReactNode[] = [];
  for (let c = 0; c <= cols; c++) lines.push(<line key={`v${c}`} x1={c * cell} y1={0} x2={c * cell} y2={H * grid} stroke={pal.mark} strokeWidth={c % 6 === 0 ? 4 : 1.6} opacity={c % 6 === 0 ? 1 : 0.7} />);
  for (let r = 0; r <= rows; r++) lines.push(<line key={`h${r}`} x1={0} y1={r * cell} x2={W * grid} y2={r * cell} stroke={pal.mark} strokeWidth={r % 6 === 0 ? 4 : 1.6} opacity={r % 6 === 0 ? 1 : 0.7} />);
  const ties: React.ReactNode[] = [];
  for (let t = 10; t < W * railP; t += 18) ties.push(<line key={t} x1={t} y1={ry - 12} x2={t} y2={ry + 12} stroke={pal.subject} strokeWidth={3} />);
  return (
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={W} height={H}>
      <rect x={0} y={0} width={W} height={H} fill="rgba(0,0,0,0.25)" opacity={grid} />
      {cells}
      {lines}
      {railP > 0 && <>
        {ties}
        <line x1={0} y1={ry} x2={W * railP} y2={ry} stroke={SHADOW} strokeWidth={14} />
        <line x1={0} y1={ry} x2={W * railP} y2={ry} stroke={pal.subject} strokeWidth={8} strokeLinecap="round" />
      </>}
    </svg>
  );
};

/**
 * A scanned page lifted on the desk (no mount) with a focus pull: everything outside the quoted band blurs and dims,
 * and a coral highlighter runs along the quoted lines. Window shows source x from sx0, y from sy0 at `scale`.
 */
export const DocFocus: React.FC<{src: string; size: [number, number]; x: number; y: number; w: number; h: number; sx0: number; sy0: number; scale: number; rot?: number; at: number;
  band: [number, number]; pullAt: number; swipes?: [number, number, number][]; swipeAt?: number; lineH?: number; seed?: number}> = ({
  src, size, x, y, w, h, sx0, sy0, scale, rot = 0, at, band, pullAt, swipes = [], swipeAt = 1e7, lineH = 50, seed = 3,
}) => {
  const d = useDrop(at);
  const g = useGFrame();
  const pal = usePal();
  if (!d.on) return null;
  const left = -sx0 * scale;
  const top = -sy0 * scale;
  const pull = interpolate(g, [pullAt, pullAt + 8], [0, 1], clamp);
  const t0 = (band[0] - sy0) * scale;
  const t1 = (band[1] - sy0) * scale;
  const fm = `linear-gradient(to bottom, #000 0px, #000 ${t0 - 14}px, transparent ${t0}px, transparent ${t1}px, #000 ${t1 + 14}px, #000 100%)`;
  const total = swipes.reduce((a, [x0, , x1]) => a + (x1 - x0), 0);
  let acc = 0;
  const sp = interpolate(g, [swipeAt, swipeAt + 10], [0, 1], clamp) * total;
  const img = (extra: React.CSSProperties) => <Img src={staticFile(src)} style={{position: 'absolute', left, top, width: size[0] * scale, height: size[1] * scale, ...extra}} />;
  return (
    <div style={{position: 'absolute', left: x, top: y - d.air * 40, width: w, height: h, transform: `rotate(${rot}deg)`, opacity: Math.min(1, d.k * 3),
      filter: `drop-shadow(14px 18px 0 ${SHADOW})`}}>
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', clipPath: tornPoly(w, h, seed, {t: true, b: true, l: false, r: false}, 8)}}>
        {img({filter: 'grayscale(1) sepia(0.3) contrast(1.15) brightness(0.92)'})}
        {swipes.map(([x0, ly, x1], i) => {
          const wd = Math.max(0, Math.min(x1 - x0, sp - acc));
          acc += x1 - x0;
          return wd > 0 ? <div key={i} style={{position: 'absolute', left: left + x0 * scale, top: top + (ly - lineH / 2) * scale, width: wd * scale, height: lineH * scale,
            background: pal.subject, mixBlendMode: 'multiply', opacity: 0.85}} /> : null;
        })}
        {pull > 0 && <div style={{position: 'absolute', inset: 0, WebkitMaskImage: fm, maskImage: fm} as React.CSSProperties}>
          {img({filter: `grayscale(1) sepia(0.3) contrast(1.1) blur(${pull * 5}px) brightness(${1 - pull * 0.55})`})}
        </div>}
      </div>
    </div>
  );
};

/** The dark ledger card: torn top with orange tape, teal rules, mono column heads, rows written in teal hand. */
export type LedgerRow = {cells: string[]; at: number; colors?: (string | undefined)[]};
export const Ledger: React.FC<{x: number; y: number; w: number; cols: number[]; heads: string[]; rows: LedgerRow[]; empty?: number; rowH?: number; size?: number; rot?: number; at: number;
  margin?: string[]; title?: string}> = ({x, y, w, cols, heads, rows, empty = 0, rowH = 92, size = 40, rot = -1, at, margin, title}) => {
  const d = useDrop(at);
  const g = useGFrame();
  const pal = usePal();
  const hand = useHand();
  if (!d.on) return null;
  const headY = title ? 118 : 50;
  const h = headY + 70 + (rows.length + empty) * rowH + 30;
  const mx = margin ? 120 : 30;
  const colX = cols.map((c) => mx + c * (w - mx - 30));
  return (
    <div style={{position: 'absolute', left: x, top: y - d.air * 40, width: w, height: h, transform: `rotate(${rot + d.air * 3}deg)`, opacity: Math.min(1, d.k * 3)}}>
      <div style={{position: 'absolute', inset: 0, filter: `drop-shadow(14px 18px 0 ${SHADOW})`}}>
        <div style={{position: 'absolute', inset: 0, clipPath: tornPoly(w, h, 7, {t: true}, 10),
          background: 'radial-gradient(ellipse at 40% 30%, #36312a 0%, #26231d 75%, #1d1a15 100%)'}}>
          {/* ruled lines and the margin rule, in teal */}
          {Array.from({length: rows.length + empty + 1}).map((_, i) => (
            <div key={i} style={{position: 'absolute', left: 20, right: 20, top: headY + 62 + i * rowH, height: 2, background: pal.mark, opacity: i === 0 ? 0.9 : 0.35}} />
          ))}
          {margin && <div style={{position: 'absolute', left: mx - 18, top: 20, bottom: 0, width: 2, background: pal.mark, opacity: 0.6}} />}
          {colX.slice(1).map((cx, i) => <div key={i} style={{position: 'absolute', left: cx - 18, top: headY, bottom: 20, width: 1.5, background: pal.mark, opacity: 0.35}} />)}
        </div>
      </div>
      {title && <div style={{position: 'absolute', left: mx, top: 34, fontFamily: JF.display, fontSize: 52, color: boxOf(pal), whiteSpace: 'nowrap'}}>{title}</div>}
      {heads.map((t, i) => <div key={t} style={{position: 'absolute', left: colX[i], top: headY + 16, fontFamily: JF.mono, fontSize: 24, letterSpacing: 3, color: pal.mark, whiteSpace: 'nowrap'}}>{t}</div>)}
      {margin?.map((t, i) => <div key={t} style={{position: 'absolute', left: 26, top: headY + 62 + i * rowH + rowH / 2 - 14, fontFamily: JF.mono, fontSize: 22, letterSpacing: 2,
        color: i < rows.length ? pal.mark : 'rgba(47,224,196,0.4)', whiteSpace: 'nowrap'}}>{t}</div>)}
      {rows.map((row, ri) => row.cells.map((t, ci) => {
        const a = row.at + ci * 8;
        if (g < a) return null;
        const p = interpolate(g, [a, a + 10], [0, 1], clamp);
        return <div key={`${ri}-${ci}`} style={{position: 'absolute', left: colX[ci], top: headY + 62 + ri * rowH + (t.includes('\n') ? 10 : rowH / 2 - size * hand.scale * 0.62), fontFamily: hand.family,
          fontSize: size * hand.scale, lineHeight: 0.98, color: row.colors?.[ci] ?? pal.mark, whiteSpace: 'pre', clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`,
          textShadow: '0 0 2px #111, 2px 2px 0 #111, -2px 2px 0 #111'}}>{t}</div>;
      }))}
      <Tape x={w * 0.12} y={-18} w={170} rot={-6} seed={71} />
      <Tape x={w * 0.78} y={-16} w={150} rot={5} seed={72} />
    </div>
  );
};

/** Hinge-year stamp: the year on a torn orange box, a dark mono strip listing that year's events in teal. */
export const HingeYear: React.FC<{year: string; events: string[]; x: number; y: number; size?: number; at: number; rot?: number}> = ({year, events, x, y, size = 190, at, rot = -2}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [1.35, 0.95, 1], clamp);
  const strip = interpolate(g, [at + 6, at + 14], [0, 1], clamp);
  const pts: string[] = [];
  for (let i = 0; i <= 30; i++) pts.push(`${(i / 30) * 100}% ${random(`hy${i}`) * 8}%`);
  for (let i = 30; i >= 0; i--) pts.push(`${(i / 30) * 100}% ${100 - random(`hyb${i}`) * 8}%`);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
      <div style={{position: 'relative', display: 'inline-block', padding: `${size * 0.06}px ${size * 0.18}px ${size * 0.02}px`, transform: `scale(${k})`, transformOrigin: 'left center'}}>
        <div style={{position: 'absolute', inset: 0, background: boxOf(pal), clipPath: `polygon(${pts.join(',')})`, filter: `drop-shadow(10px 12px 0 ${SHADOW})`}} />
        <div style={{position: 'relative', fontFamily: JF.display, fontSize: size, lineHeight: 1.05, color: pal.ink}}>{year}</div>
      </div>
      <div style={{marginTop: 14, marginLeft: size * 0.12, background: '#0b0a08', padding: '12px 22px', display: 'inline-block', boxShadow: `8px 10px 0 ${SHADOW}`,
        clipPath: `inset(0 ${(1 - strip) * 100}% 0 0)`, fontFamily: JF.mono, fontSize: 26, letterSpacing: 3, color: pal.mark, whiteSpace: 'nowrap'}}>
        {[year, ...events].join('  ·  ')}
      </div>
    </div>
  );
};

/** Portrait in a dark circle mount with a teal ring; the subject traced in teal (no tint, no gimmick). */
export const CircleMount: React.FC<{src: string; size: [number, number]; cx: number; cy: number; r: number; fx: number; fy: number; scale: number; at: number; mask?: MaskRef; traceAt?: number}> = ({
  src, size, cx, cy, r, fx, fy, scale, at, mask, traceAt,
}) => {
  const d = useDrop(at);
  const g = useGFrame();
  const pal = usePal();
  if (!d.on) return null;
  const place: Place = {left: r - fx * scale, top: r - fy * scale, scale};
  const ring = interpolate(g, [at + 4, at + 14], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: cx - r, top: cy - r - d.air * 40, width: r * 2, height: r * 2, opacity: Math.min(1, d.k * 3)}}>
      <div style={{position: 'absolute', inset: -16, borderRadius: '50%', background: '#16140f', boxShadow: `14px 16px 0 ${SHADOW}`}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden'}}>
        <Img src={staticFile(src)} style={{position: 'absolute', left: place.left, top: place.top, width: size[0] * scale, height: size[1] * scale, filter: BW}} />
        <div style={{position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.6)'}} />
        {mask && traceAt !== undefined && <Traced paths={mask.data.shapes.subject} place={place} at={traceAt} dur={12} width={5} part={0.9} />}
      </div>
      <svg style={{position: 'absolute', left: -16, top: -16, overflow: 'visible'}} width={r * 2 + 32} height={r * 2 + 32}>
        <circle cx={r + 16} cy={r + 16} r={r + 8} fill="none" stroke={pal.mark} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring}
          transform={`rotate(-100 ${r + 16} ${r + 16})`} strokeLinecap="round" />
      </svg>
    </div>
  );
};

/** One labelled field on a resistance card: a mono tag on ink, the answer in teal hand beside it. */
export const Field: React.FC<{tag: string; text: string; x: number; y: number; at: number; tagW?: number; size?: number; color?: string}> = ({tag, text, x, y, at, tagW = 250, size = 40, color}) => {
  const g = useGFrame();
  const pal = usePal();
  const hand = useHand();
  if (g < at) return null;
  const p = interpolate(g, [at + 3, at + 13], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 22}}>
      <div style={{width: tagW, flex: 'none', fontFamily: JF.mono, fontSize: 22, letterSpacing: 3, color: '#111', background: boxOf(pal), padding: '6px 12px', whiteSpace: 'nowrap', boxSizing: 'border-box',
        boxShadow: `6px 7px 0 ${SHADOW}`}}>{tag}</div>
      <div style={{fontFamily: hand.family, fontSize: size * hand.scale, color: color ?? pal.mark, whiteSpace: 'nowrap', clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`,
        textShadow: '0 0 2px #111, 2px 2px 0 #111, -2px 2px 0 #111, 0 3px 12px rgba(0,0,0,0.7)'}}>{text}</div>
    </div>
  );
};
