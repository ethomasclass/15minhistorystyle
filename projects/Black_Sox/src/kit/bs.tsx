// Pieces for Say It Ain't So: the drifting desk, cards that drop onto it, full-bleed archival pictures, word-synced
// quotes (from Good Luck's oj.tsx), the Flow "tobacco card" prints, the BANNED ledger and the wall.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame} from 'remotion';
import {Sfx as Snd} from './common';
import {noise2D} from '@remotion/noise';
import {clamp} from '../lib/anim';
import {FPS} from '../lib/theme';
import {boxOf, JF, Tag, useGFrame, useHand, usePal} from './Kit';
import {DarkPaper} from './common';
import {hasFile, type TL} from './shell';

export const LOOK = {
  bw: 'grayscale(1) contrast(1.2) brightness(0.96)',
  doc: 'grayscale(1) sepia(0.3) contrast(1.12)',
  dim: 'grayscale(1) contrast(1.25) brightness(0.5)',
  card: 'saturate(0.92) contrast(1.04)',
};
export type Look = keyof typeof LOOK;

/** The dark desk with a slow handheld drift and push; children ride on it. */
export const Desk: React.FC<{a?: number; push?: number; children?: React.ReactNode}> = ({a = 0, push = 0.04, children}) => {
  const f = useCurrentFrame();
  const z = 1 + Math.max(0, f - a) * (push / 240);
  const d = {x: noise2D('dkx', f * 0.018, 0) * 3, y: noise2D('dky', 0, f * 0.018) * 3, r: noise2D('dkr', f * 0.012, 3) * 0.18};
  return (
    <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${d.x}px, ${d.y}px) rotate(${d.r}deg) scale(${Math.min(z, 1 + push)})`}}>
        <DarkPaper />
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Labelled placeholder for a picture that hasn't arrived yet (Flow cards before the user makes them). */
export const StandIn: React.FC<{x: number; y: number; w: number; h: number; rot?: number; label: string}> = ({x, y, w, h, rot = 0, label}) => {
  const pal = usePal();
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg)`, border: `4px dashed ${pal.mark}`, background: 'rgba(244,239,230,0.06)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: JF.mono, fontSize: 20, letterSpacing: 2, color: '#fff', textTransform: 'uppercase', padding: 20}}>
      card to come<br />{label}
    </div>
  );
};

/** A picture dropped onto the desk at frame `at`: falls with a spring and a little air rotation; the shadow tightens. */
export const DropCard: React.FC<{src: string; x: number; y: number; w: number; rot?: number; at: number; out?: number; filter?: string; pad?: number; tab?: string; children?: React.ReactNode}> = ({
  src, x, y, w, rot = 0, at, out = 1e7, filter = LOOK.bw, pad, tab, children,
}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  if (f < at || f >= out) return null;
  const sp = spring({frame: f - at, fps: FPS, config: {stiffness: 260, damping: 15, mass: 0.9}});
  const air = 1 - Math.min(sp, 1);
  const scale = 1 + air * 0.4 - Math.max(sp - 1, 0) * 0.6;
  const p = pad ?? Math.max(8, w * 0.03);
  return (
    <div style={{position: 'absolute', left: x, top: y - air * 60, width: w, transform: `scale(${scale}) rotate(${rot + air * 7}deg)`, opacity: Math.min(1, (f - at + 1) / 2)}}>
      <div style={{position: 'relative', background: '#f4efe6', padding: p,
        boxShadow: `0 ${14 + air * 70}px ${12 + air * 60}px rgba(0,0,0,${0.7 - air * 0.35}), 0 2px 3px rgba(0,0,0,${0.5 * (1 - air)})`}}>
        <Img src={staticFile(src)} style={{width: '100%', display: 'block', filter}} />
        {children}
      </div>
      {tab && (
        <div style={{position: 'absolute', left: '50%', bottom: -34, transform: 'translateX(-50%) rotate(-2deg)', background: boxOf(pal), padding: '4px 16px 2px',
          fontFamily: JF.display, fontSize: 30, color: pal.ink, whiteSpace: 'nowrap', boxShadow: '0 6px 14px rgba(0,0,0,0.5)'}}>{tab}</div>
      )}
    </div>
  );
};

/**
 * A Flow "tobacco card" print (public/img/gen/<file>): full colour on a cream card with an orange tab. Until the user
 * makes it, a dashed stand-in of the same size says which card goes here.
 */
export const FlowCard: React.FC<{file: string; x: number; y: number; w: number; ratio?: number; rot?: number; at: number; out?: number; tab?: string}> = ({
  file, x, y, w, ratio = 4 / 3, rot = 0, at, out = 1e7, tab,
}) => {
  const f = useCurrentFrame();
  if (f < at || f >= out) return null;
  const src = `img/gen/${file}`;
  if (!hasFile(src)) return <StandIn x={x} y={y} w={w} h={w * ratio} rot={rot} label={file.replace(/\.png$/, '')} />;
  return <DropCard src={src} x={x} y={y} w={w} rot={rot} at={at} out={out} filter={LOOK.card} pad={14} tab={tab} />;
};

/** Full-bleed archival picture, B&W, slow push with a tiny drift, source tag. `pos` is the CSS object-position. */
export const Arch: React.FC<{src: string; tag: string; a: number; b: number; z?: [number, number]; pos?: string; look?: Look; fit?: 'cover' | 'contain'; children?: React.ReactNode}> = ({
  src, tag, a, b, z = [1.02, 1.1], pos = '50% 50%', look = 'bw', fit = 'cover', children,
}) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [a, b], z, {...clamp, easing: Easing.inOut(Easing.sin)});
  const d = {x: noise2D('arx', f * 0.018, 0) * 3, y: noise2D('ary', 0, f * 0.018) * 3};
  return (
    <AbsoluteFill style={{background: '#0b0a08', overflow: 'hidden'}}>
      {fit === 'contain' && <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: `${LOOK[look]} blur(24px) brightness(0.35)`}} />}
      <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: fit, objectPosition: pos, filter: LOOK[look],
        transform: `translate(${d.x}px, ${d.y}px) scale(${k})`, transformOrigin: pos}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 42%, rgba(0,0,0,0.62) 100%)'}} />
      {children}
      <Tag text={tag} />
    </AbsoluteFill>
  );
};

/** A quote that appears word by word exactly as the narrator speaks `phrase` (the words as written in the script). */
export const SyncQuote: React.FC<{t: TL; phrase: string; nth?: number; x: number; y: number; w: number; size?: number; color?: string; marks?: Record<number, string>; open?: boolean; close?: boolean}> = ({
  t, phrase, nth = 1, x, y, w, size = 64, color = '#f4efe6', marks = {}, open = true, close = true,
}) => {
  const f = useCurrentFrame();
  const i0 = t.idx(phrase, nth);
  const n = phrase.split(/\s+/).length;
  const words = t.words.slice(i0, i0 + n);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, fontFamily: JF.heavy, fontWeight: 900, fontSize: size, lineHeight: 1.3, textShadow: '0 3px 14px #000'}}>
      {words.map((wd, i) => {
        const at = Math.round(wd.s * FPS) - 2;
        const k = interpolate(f, [at, at + 5], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        const u = marks[i];
        const p = u ? interpolate(f, [at + 4, at + 10], [0, 1], clamp) : 0;
        const word = wd.w.replace(/^["“]|["”,]$/g, '').replace(/["”]/g, '');
        return (
          <span key={i} style={{position: 'relative', display: 'inline-block', paddingRight: '0.28em', color, opacity: k, transform: `translateY(${(1 - k) * 12}px)`}}>
            {(i === 0 && open ? '“' : '') + word + (i === n - 1 && close ? '”' : '')}
            {u && p > 0 && <span style={{position: 'absolute', left: -3, bottom: -2, height: 7, borderRadius: 4, background: u, width: `calc(${p} * (100% - 0.2em))`}} />}
          </span>
        );
      })}
    </div>
  );
};

/** A plain bone statement that fades in (no marks): for facts that should just sit there. */
export const Line: React.FC<{text: string; x: number; y: number; at: number; size?: number; w?: number; color?: string; align?: 'left' | 'center'}> = ({text, x, y, at, size = 54, w = 1500, color = '#EDE7DC', align = 'left'}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return <div style={{position: 'absolute', left: x, top: y, width: w, textAlign: align, fontFamily: JF.heavy, fontWeight: 900, fontSize: size, lineHeight: 1.25, color, textShadow: '0 3px 14px #000',
    opacity: interpolate(f, [at, at + 8], [0, 1], clamp)}}>{text}</div>;
};

// ---------------------------------------------------------------------------------------------
// The BANNED ledger: a cream ledger card that fills in across the video, one entry per scandal.

export type Entry = {year: string; who: string; at: number; fate?: string; fateAt?: number; strike?: number; color?: string};

/** One handwritten ledger row: year in the margin, names, and a fate written after them (struck through or stamped). */
export const Ledger: React.FC<{x: number; y: number; w: number; entries: Entry[]; title?: string; rot?: number; at?: number; rowH?: number; size?: number}> = ({
  x, y, w, entries, title = 'BANNED', rot = -1.5, at = 0, rowH = 78, size = 40,
}) => {
  const g = useGFrame();
  const pal = usePal();
  const hand = useHand();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 5], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) * (1 - 2.2 * t * (1 - t))});
  const h = 130 + entries.length * rowH;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `scale(${0.6 + 0.4 * k}) rotate(${rot}deg)`, opacity: Math.min(1, k * 2),
      background: '#f4efe6', boxShadow: '0 18px 34px rgba(0,0,0,0.6)', overflow: 'hidden'}}>
      {/* ruled ledger lines and a red margin rule */}
      <div style={{position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(40,80,120,0.22) 1.5px, transparent 1.5px)`, backgroundSize: `100% ${rowH}px`, backgroundPosition: `0 ${110 + rowH - 14}px`}} />
      <div style={{position: 'absolute', left: 150, top: 0, bottom: 0, width: 2, background: 'rgba(200,60,50,0.45)'}} />
      <div style={{position: 'absolute', left: 30, top: 22, fontFamily: JF.display, fontSize: 56, color: '#111', letterSpacing: 2}}>{title}</div>
      <div style={{position: 'absolute', right: 30, top: 44, fontFamily: JF.mono, fontSize: 18, letterSpacing: 2, color: 'rgba(17,17,17,0.6)'}}>FOR THROWING GAMES</div>
      {entries.map((e, i) => {
        if (g < e.at) return null;
        const top = 110 + i * rowH;
        const wr = interpolate(g, [e.at, e.at + 10], [0, 1], clamp);
        const st = e.strike !== undefined ? interpolate(g, [e.strike, e.strike + 5], [0, 1], clamp) : 0;
        const fate = e.fate && e.fateAt !== undefined && g >= e.fateAt;
        return (
          <div key={i} style={{position: 'absolute', left: 0, top, width: '100%', height: rowH}}>
            <div style={{position: 'absolute', left: 26, top: 18, fontFamily: JF.mono, fontSize: 26, color: '#111'}}>{e.year}</div>
            <div style={{position: 'absolute', left: 172, top: 4, fontFamily: hand.family, fontSize: size * hand.scale, color: '#16233a', whiteSpace: 'nowrap',
              clipPath: `inset(-20% ${(1 - wr) * 100}% -20% -5%)`}}>
              {e.who}
              {st > 0 && <span style={{position: 'absolute', left: -6, top: '52%', height: 6, borderRadius: 3, background: boxOf(pal), width: `calc(${st} * (100% + 12px))`}} />}
            </div>
            {fate && <div style={{position: 'absolute', right: 26, top: 14, fontFamily: JF.display, fontSize: 30, color: e.color ?? pal.subject, transform: 'rotate(-4deg)',
              opacity: interpolate(g, [e.fateAt!, e.fateAt! + 4], [0, 1], clamp)}}>{e.fate}</div>}
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
// The wall: teal hand-drawn bricks built row by row (12 fps), knocked out, then redrawn as one dashed line.

export const Wall: React.FC<{x: number; y: number; w: number; rows?: number; at: number; dur?: number; knock?: number; line?: number; brickW?: number; brickH?: number}> = ({
  x, y, w, rows = 6, at, dur = 24, knock, line, brickW = 120, brickH = 54,
}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const per = Math.ceil(w / brickW) + 1;
  const total = rows * per;
  const shown = Math.floor(interpolate(g, [at, at + dur], [0, total], clamp));
  const lineK = line !== undefined ? interpolate(g, [line, line + 10], [0, 1], clamp) : 0;
  const bricks: React.ReactNode[] = [];
  let n = 0;
  for (let r = rows - 1; r >= 0; r--) {
    const off = r % 2 ? brickW / 2 : 0;
    for (let c = 0; c < per; c++, n++) {
      if (n >= shown) continue;
      const bx = c * brickW - off;
      if (bx + brickW < 0 || bx > w) continue;
      const id = `${r}-${c}`;
      // knocked out: about half the bricks fall away from the top rows down
      let fall = 0;
      if (knock !== undefined && g >= knock && random(`k${id}`) < 0.35 + (rows - r) * 0.08) fall = Math.max(0, g - knock - random(`kd${id}`) * 10);
      if (lineK > 0) fall = Math.max(fall, 60);
      if (fall > 40) continue;
      const j = (s: string) => (random(s + id) - 0.5) * 5;
      const x0 = Math.max(0, bx) + 3, x1 = Math.min(w, bx + brickW) - 3, y0 = r * brickH + 3, y1 = (r + 1) * brickH - 3;
      bricks.push(
        <path key={id} d={`M${x0 + j('a')},${y0 + j('b')} L${x1 + j('c')},${y0 + j('d')} L${x1 + j('e')},${y1 + j('f')} L${x0 + j('g')},${y1 + j('h')} Z`}
          fill="rgba(47,224,196,0.08)" stroke={pal.mark} strokeWidth={4} strokeLinejoin="round"
          transform={fall ? `translate(${(random(`fx${id}`) - 0.5) * fall * 3} ${fall * fall * 0.35}) rotate(${(random(`fr${id}`) - 0.5) * fall * 4} ${(x0 + x1) / 2} ${(y0 + y1) / 2})` : undefined}
          opacity={fall ? 1 - fall / 40 : 1} />,
      );
    }
  }
  return (
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={w} height={rows * brickH}>
      {bricks}
      {lineK > 0 && <path d={`M0,${rows * brickH - 4} L${w * lineK},${rows * brickH - 4}`} stroke={pal.mark} strokeWidth={6} strokeDasharray="26 18" strokeLinecap="round" fill="none" />}
    </svg>
  );
};

// ---------------------------------------------------------------------------------------------
// The ledger's rows across the video. Each chapter passes its own frames for the rows it writes; earlier rows are
// already there (at 0). Fates in coral are bans; teal (mark) means the ban didn't stick.
const TEAL = '#2FE0C4';
export const ROWS = {
  y1865: (at = 0, strike?: number, fateAt?: number): Entry => ({year: '1865', who: 'Wansley, Devyr, Duffy', at, strike, fate: 'back by 1870', fateAt: fateAt ?? (strike !== undefined ? strike + 4 : at), color: TEAL}),
  y1877: (at = 0, fateAt?: number): Entry => ({year: '1877', who: 'Devlin, Hall, Nichols, Craver', at, fate: 'FOR LIFE', fateAt: fateAt ?? at}),
  y1882: (at = 0, fateAt?: number): Entry => ({year: '1882', who: 'Dick Higham, umpire', at, fate: 'FOR LIFE', fateAt: fateAt ?? at}),
  y1908: (at = 0, fateAt?: number): Entry => ({year: '1908', who: "the Giants' team doctor", at, fate: 'every park', fateAt: fateAt ?? at}),
  y1919: (at = 0, strike?: number, fateAt?: number): Entry => ({year: '1919', who: 'Hal Chase', at, strike, fate: 'cleared, rehired', fateAt: fateAt ?? at, color: TEAL}),
  y1921: (at = 0, fateAt?: number): Entry => ({year: '1921', who: 'the eight White Sox', at, fate: 'FOR LIFE', fateAt: fateAt ?? at}),
};

/** Sound for a chapter: a whoosh per cut, a stamp per title, the marker before each note, booms, extras. */
export const Sounds: React.FC<{cuts: number[]; stamps?: number[]; writes?: number[]; booms?: number[]; ticks?: number[]; extra?: {at: number; src: string; volume?: number}[]}> = ({
  cuts, stamps = [], writes = [], booms = [], ticks = [], extra = [],
}) => (
  <>
    {cuts.slice(1).map((f, i) => <Snd key={`c${i}`} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
    {stamps.map((f, i) => <Snd key={`s${i}`} at={f} src="sfx/stamp.wav" volume={0.28} />)}
    {writes.map((f, i) => <Snd key={`w${i}`} at={f - 3} src="sfx/marker_tick.wav" volume={0.2} />)}
    {booms.map((f, i) => <Snd key={`b${i}`} at={f} src="sfx/boom.wav" volume={0.28} />)}
    {ticks.map((f, i) => <Snd key={`t${i}`} at={f} src="sfx/tick.wav" volume={0.4} />)}
    {extra.map((e, i) => <Snd key={`e${i}`} at={e.at} src={e.src} volume={e.volume ?? 0.35} />)}
  </>
);
