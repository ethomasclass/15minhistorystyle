// The collage board (techniques/collage_board.md): flat cut-paper pieces on black, in the channel's colours, and the
// way each piece arrives. From the Reconstruction mockups (Oct 2026); worked examples, including a full Episode 1
// board built piece by piece, are in techniques/components/reconstruction/.
//
// Pieces (static):  Flat (place + hard shadow), Photo (a creased print, tools/crease.py), Strip (torn typed label),
//   Sticky, Stamp, TapeBit, Pin, Threads, Silhouette (cut-paper profile traced from a real portrait, tools/silhouette.py),
//   Scrap (torn document text, with a highlighter), WornLogo (the channel logo as a worn sticker, tools/distress.py),
//   Defs (the rough filter Stamp uses), Splats.
// Motion:  Land (drop / slap / stamp / tape / slide / fade), APin, AThreads (stepped), BoardStage (camera + jolt + sound),
//   BoardSounds.
// Assets: public/img/brand/ (logo + wear masks), public/img/board/sil/ (silhouettes).
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from './common';
import {useGFrame} from './Kit';

export const HAND = '"Nanum Pen Script", cursive';
export const DISPLAY = '"Abril Fatface", serif';
export const MONO = '"IBM Plex Mono", monospace';
export const SERIF = '"Playfair Display", serif';
export const SANS = '"Inter", sans-serif';

export type Pal = {bg: string; paper: string; accent: string; thread: string; note: string; noteInk: string; hand: string; stamp: string; tape: string; label: string};
export const HOT: Pal = {bg: '#0f0f0f', paper: '#ece6d8', accent: '#FF6A2B', thread: '#FF6A2B', note: '#FF6A2B', noteInk: '#1a1a1a', hand: '#1a1a1a', stamp: '#FF6A2B', tape: '#8b97a3', label: '#c9d3dc'};
export const BRAND: Pal = {bg: '#0f0f0f', paper: '#ece6d8', accent: '#FF6F61', thread: '#2FE0C4', note: '#FF6F61', noteInk: '#1a1a1a', hand: '#2FE0C4', stamp: '#FF6F61', tape: '#8b97a3', label: '#c9d3dc'};
export const Ctx = React.createContext<Pal>(HOT);
export const usePal = () => React.useContext(Ctx);

/** A ragged-edged polygon (torn paper), as a CSS clip-path. `edges` picks which sides are torn: t r b l. */
export const torn = (seed: string, edges = 'lr', amp = 6) => {
  const pts: string[] = [];
  const n = 18;
  const j = (k: string) => (random(`${seed}${k}`) * amp).toFixed(1);
  for (let i = 0; i <= n; i++) pts.push(`${(i / n) * 100}% ${edges.includes('t') ? j(`t${i}`) : 0}px`);
  for (let i = 0; i <= n; i++) pts.push(`calc(100% - ${edges.includes('r') ? j(`r${i}`) : 0}px) ${(i / n) * 100}%`);
  for (let i = n; i >= 0; i--) pts.push(`${(i / n) * 100}% calc(100% - ${edges.includes('b') ? j(`b${i}`) : 0}px)`);
  for (let i = n; i >= 0; i--) pts.push(`${edges.includes('l') ? j(`l${i}`) : 0}px ${(i / n) * 100}%`);
  return `polygon(${pts.join(',')})`;
};

export const Flat: React.FC<{x: number; y: number; r?: number; children: React.ReactNode; z?: number}> = ({x, y, r = 0, children, z}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${r}deg)`, zIndex: z, filter: 'drop-shadow(5px 6px 0 rgba(0,0,0,0.55))'}}>{children}</div>
);

/** A photo: a worn, creased print with no border (tools/crease.py), straight on the board. `src` is a path under public/. */
export const Photo: React.FC<{src: string; w: number; h?: number}> = ({src, w, h}) => (
  <Img src={staticFile(src)} style={{width: w, height: h, display: 'block', objectFit: 'contain'}} />
);

/** A torn label strip, typewritten. */
export const Strip: React.FC<{text: string; size?: number; bg?: string; color?: string; seed?: string; font?: string}> = ({text, size = 26, bg, color = '#1a1a1a', seed = 's', font = MONO}) => {
  const p = usePal();
  return <div style={{background: bg ?? p.label, clipPath: torn(seed), padding: `${size * 0.25}px ${size * 0.7}px`, fontFamily: font, fontSize: size, color, whiteSpace: 'nowrap', letterSpacing: 1}}>{text}</div>;
};

/** A sticky note with a handwritten question. */
export const Sticky: React.FC<{text: string; w?: number; size?: number}> = ({text, w = 190, size = 54}) => {
  const p = usePal();
  return (
    <div style={{width: w, height: w * 0.92, background: p.note, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 14, boxSizing: 'border-box'}}>
      <div style={{fontFamily: HAND, fontSize: size, lineHeight: 0.95, color: p.noteInk}}>{text}</div>
    </div>
  );
};

/** A rubber stamp: an outlined box, slightly rough. */
export const Stamp: React.FC<{text: string; size?: number; color?: string}> = ({text, size = 44, color}) => {
  const p = usePal();
  const c = color ?? p.stamp;
  return (
    <div style={{border: `${size * 0.09}px solid ${c}`, padding: `${size * 0.06}px ${size * 0.28}px`, fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: size * 0.06, color: c,
      filter: 'url(#rough)', whiteSpace: 'nowrap', lineHeight: 1.05}}>{text}</div>
  );
};

/** A strip of tape across something. */
export const TapeBit: React.FC<{w?: number; seed?: string}> = ({w = 150, seed = 't'}) => {
  const p = usePal();
  return <div style={{width: w, height: 38, background: p.tape, opacity: 0.88, clipPath: torn(seed, 'lr', 7)}} />;
};

export const Pin: React.FC<{x: number; y: number}> = ({x, y}) => {
  const p = usePal();
  return (
    <div style={{position: 'absolute', left: x - 10, top: y - 10, width: 20, height: 20, borderRadius: 10, background: p.accent, zIndex: 50, boxShadow: '2px 3px 0 rgba(0,0,0,0.5)'}}>
      <div style={{position: 'absolute', left: 5, top: 4, width: 6, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.6)'}} />
    </div>
  );
};

/** Straight thread between pins (drawn above the paper, as in the reference). */
export const Threads: React.FC<{lines: [number, number, number, number][]}> = ({lines}) => {
  const p = usePal();
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, zIndex: 40}}>
      {lines.map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} stroke={p.thread} strokeWidth={2.6} />)}
    </svg>
  );
};

/** The open question at the centre: a cut-paper silhouette traced from a real portrait (tools/silhouette.py), mounted on a
 *  torn cream card like a parlour silhouette, with a coral question mark. profile = Saint-Mémin engraving (LOC pga 13330),
 *  front = an unidentified man, 1860 (LOC ppmsca 32242). */
const SIL = {profile: {w: 509, h: 728}, front: {w: 361, h: 415}} as const;
/** q = the question mark's stamp-in (0..1, it lands from 1.8x), labelP = how much of the label is written (0..1). */
export const Silhouette: React.FC<{label: string; size?: number; kind?: keyof typeof SIL; seed?: string; q?: number; labelP?: number}> = ({label, size = 260, kind = 'profile', seed = 'sl', q = 1, labelP = 1}) => {
  const p = usePal();
  const {w, h} = SIL[kind];
  const sw = size * 0.78, sh = (sw * h) / w;
  const src = staticFile(`img/board/sil/${kind}.png`);
  return (
    <div style={{width: size, textAlign: 'center'}}>
      <div style={{position: 'relative', width: size, padding: `${size * 0.09}px 0 0`, background: p.paper, clipPath: torn(seed, 'lrtb', 7), boxSizing: 'border-box'}}>
        <div style={{width: sw, height: sh, margin: '0 auto', background: '#161514',
          WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: size * (kind === 'profile' ? 0.13 : 0.1), fontFamily: DISPLAY, fontSize: size * 0.42, color: p.accent, lineHeight: 1, opacity: Math.min(1, q * 3), transform: `scale(${q >= 1 ? 1 : 1.8 - 0.8 * q})`}}>?</div>
      </div>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: size * 0.13, letterSpacing: 2, color: p.accent, marginTop: 10, whiteSpace: 'nowrap', marginLeft: -100, marginRight: -100, clipPath: `inset(-20% ${(1 - labelP) * 100}% -20% 0)`}}>{label}</div>
    </div>
  );
};

/** A torn scrap of document text. hl = how far the coral highlighter has run along `mark` (0..1). */
export const Scrap: React.FC<{text: string; w: number; size?: number; seed?: string; mark?: string; italic?: boolean; hl?: number}> = ({text, w, size = 24, seed = 'd', mark, italic, hl = 1}) => {
  const p = usePal();
  const parts = mark ? text.split(mark) : [text];
  return (
    <div style={{width: w, background: p.paper, clipPath: torn(seed, 'tb', 7), padding: '22px 22px', boxSizing: 'border-box', fontFamily: SERIF, fontWeight: 900, fontSize: size, lineHeight: 1.3, color: '#262320', fontStyle: italic ? 'italic' : 'normal'}}>
      {parts.length > 1 ? <>{parts[0]}<span style={{backgroundImage: `linear-gradient(${p.accent}, ${p.accent})`, backgroundRepeat: 'no-repeat', backgroundSize: `${hl * 100}% 100%`, color: '#111', padding: '0 4px'}}>{mark}</span>{parts[1]}</> : text}
    </div>
  );
};

/** The channel logo as a worn, faded sticker: the brand's horizontal lockup under a wear mask (tools/distress.py). */
export const WornLogo: React.FC<{w: number; mark?: boolean; fade?: number}> = ({w, mark, fade = 0.78}) => {
  const src = mark ? 'img/brand/chunk-history-mark.svg' : 'img/brand/chunk-history-horizontal.svg';
  const wear = mark ? 'img/brand/wear_square.png' : 'img/brand/wear_wide.png';
  const h = mark ? w : (w * 210) / 1404;
  return (
    <div style={{width: w, height: h, opacity: fade, filter: 'saturate(0.75) brightness(0.92)',
      WebkitMaskImage: `url(${staticFile(wear)})`, maskImage: `url(${staticFile(wear)})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%'}}>
      <Img src={staticFile(src)} style={{width: w, height: h, display: 'block'}} />
    </div>
  );
};

export const Defs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" /><feDisplacementMap in="SourceGraphic" scale="3" />
      <feComponentTransfer><feFuncA type="discrete" tableValues="0 1 1 1 0.85 1" /></feComponentTransfer></filter>
  </svg>
);

export const Splats: React.FC<{seed: string}> = ({seed}) => {
  const p = usePal();
  return (
    <>
      {Array.from({length: 9}, (_, i) => {
        const x = random(`${seed}x${i}`) * 1920, y = random(`${seed}y${i}`) * 1080, r = 3 + random(`${seed}r${i}`) * 9;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: r, height: r, borderRadius: r, background: p.accent, opacity: 0.8}} />;
      })}
    </>
  );
};

// ------------------------------------------------------------------- motion
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const p = BRAND;

export type LandKind = 'drop' | 'slap' | 'stamp' | 'tape' | 'slide' | 'fade';

/** One piece arriving at frame `at`. */
export const Land: React.FC<{at: number; kind: LandKind; x: number; y: number; r?: number; z?: number; children: React.ReactNode}> = ({at, kind, x, y, r = 0, z, children}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const {fps} = useVideoConfig();
  if (f < at) return null;
  const t = f - at;
  let tf = '';
  let shadow = 1;
  let opacity = 1;
  let clip: string | undefined;
  if (kind === 'drop') {
    const k = spring({frame: t, fps, config: {damping: 15, stiffness: 170, mass: 0.9}});
    tf = `translateY(${-46 * (1 - k)}px) rotate(${r + 7 * (1 - k)}deg) scale(${1 + 0.2 * (1 - k)})`;
    shadow = 1 + 4.5 * (1 - k);
    opacity = Math.min(1, k * 4);
  } else if (kind === 'slap') {
    const k = spring({frame: t, fps, config: {damping: 12, stiffness: 420, mass: 0.7}});
    tf = `rotate(${r - 12 * (1 - k)}deg) scale(${1 + 0.35 * (1 - k)})`;
    shadow = 1 + 2 * (1 - k);
    opacity = Math.min(1, k * 5);
  } else if (kind === 'stamp') {
    const s = interpolate(t, [0, 3, 6], [1.8, 0.95, 1], clamp);
    tf = `rotate(${r}deg) scale(${s})`;
    opacity = interpolate(t, [0, 2], [0, 1], clamp);
    shadow = 0;
  } else if (kind === 'tape') {
    tf = `rotate(${r}deg)`;
    clip = `inset(-10% ${interpolate(t, [0, 5], [100, 0], clamp)}% -10% 0)`;
  } else if (kind === 'slide') {
    tf = `rotate(${r}deg)`;
    clip = `inset(-20% ${interpolate(g - at, [0, 9], [100, 0], clamp)}% -20% 0)`;
  } else {
    const k = interpolate(t, [0, 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
    tf = `rotate(${r}deg) scale(${1.06 - 0.06 * k})`;
    opacity = k;
    shadow = 0;
  }
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: tf, transformOrigin: '50% 50%', zIndex: z, opacity,
      filter: shadow ? `drop-shadow(${5 * shadow}px ${6 * shadow}px 0 rgba(0,0,0,${0.55 - 0.08 * (shadow - 1)}))` : undefined}}>
      <div style={{clipPath: clip}}>{children}</div>
    </div>
  );
};

/** A pushpin that pops in. */
export const APin: React.FC<{at: number; x: number; y: number}> = ({at, x, y}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at) return null;
  const k = spring({frame: f - at, fps, config: {damping: 9, stiffness: 300}});
  return (
    <div style={{position: 'absolute', left: x - 10, top: y - 10, width: 20, height: 20, borderRadius: 10, background: p.accent, zIndex: 50,
      boxShadow: '2px 3px 0 rgba(0,0,0,0.5)', transform: `scale(${0.3 + 0.7 * k})`}}>
      <div style={{position: 'absolute', left: 5, top: 4, width: 6, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.6)'}} />
    </div>
  );
};

const THREAD_DUR = 14;
/** Teal thread drawn from one pin to another, stepped. */
export const AThreads: React.FC<{lines: {a: [number, number]; b: [number, number]; at: number}[]}> = ({lines}) => {
  const g = useGFrame();
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, zIndex: 40, overflow: 'visible'}}>
      {lines.map(({a, b, at}, i) => {
        const q = interpolate(g, [at, at + THREAD_DUR], [0, 1], clamp);
        if (q <= 0) return null;
        return <line key={i} x1={a[0]} y1={a[1]} x2={a[0] + (b[0] - a[0]) * q} y2={a[1] + (b[1] - a[1]) * q} stroke={p.thread} strokeWidth={2.6} />;
      })}
    </svg>
  );
};

export type BoardKey = [number, number, number, number]; // frame, centre x, centre y, zoom
export const boardCamAt = (keys: BoardKey[], f: number) => {
  let i = keys.length - 2;
  for (let k = 0; k < keys.length - 1; k++) if (f < keys[k + 1][0]) { i = k; break; }
  const [f0, x0, y0, z0] = keys[i];
  const [f1, x1, y1, z1] = keys[i + 1];
  const t = Easing.inOut(Easing.cubic)(Math.min(1, Math.max(0, (f - f0) / (f1 - f0))));
  return {x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t, z: Math.exp(Math.log(z0) + (Math.log(z1) - Math.log(z0)) * t)};
};
/** A short jolt after each stamp. */
export const shakeAt = (stamps: number[], f: number) => {
  let x = 0, y = 0;
  stamps.forEach((s, i) => {
    const t = f - s - 2;
    if (t < 0 || t > 10) return;
    const a = 7 * Math.exp(-t / 3) * Math.cos(t * 2.2);
    x += a * (random(`sx${i}`) - 0.5) * 2;
    y += a * (0.6 + random(`sy${i}`) * 0.4);
  });
  return {x, y};
};

/** The board: dark ground, splats, a camera (keys: frame, centre x, centre y, zoom) with a jolt after each stamp, and the
 *  stamp and whoosh sounds. Children are drawn in board pixels (1920x1080 at zoom 1). Wrap in Ctx (BRAND) and add Defs. */
export const BoardStage: React.FC<{cam: BoardKey[]; stamps?: number[]; moves?: number[]; splats?: string; children: React.ReactNode}> = ({cam, stamps = [], moves = [], splats = 'b', children}) => {
  const f = useCurrentFrame();
  const c = boardCamAt(cam, f);
  const s = shakeAt(stamps, f);
  return (
    <AbsoluteFill style={{background: p.bg}}>
      <AbsoluteFill style={{transform: `translate(${960 - c.x * c.z + s.x}px, ${540 - c.y * c.z + s.y}px) scale(${c.z})`, transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', left: -1600, top: -1200, width: 6400, height: 4400, background: p.bg}} />
        <Splats seed={splats} />
        {children}
      </AbsoluteFill>
      {moves.map((m) => <Sfx key={`m${m}`} at={m} src="sfx/whoosh.wav" volume={0.12} />)}
      {stamps.map((m) => <Sfx key={`s${m}`} at={m} src="sfx/stamp.wav" volume={0.45} />)}
    </AbsoluteFill>
  );
};

/** Sound for a list of arrivals. */
export const BoardSounds: React.FC<{drops?: number[]; slaps?: number[]; pins?: number[]; slides?: number[]; threads?: number[]}> = ({drops = [], slaps = [], pins = [], slides = [], threads = []}) => (
  <>
    {drops.map((a) => <Sfx key={`d${a}`} at={a} src="sfx/page_turn.wav" volume={0.22} />)}
    {slaps.map((a) => <Sfx key={`l${a}`} at={a} src="sfx/page_turn.wav" volume={0.3} />)}
    {pins.map((a) => <Sfx key={`p${a}`} at={a} src="sfx/knock.wav" volume={0.32} />)}
    {slides.map((a) => <Sfx key={`t${a}`} at={a} src="sfx/tick_soft.wav" volume={0.18} />)}
    {threads.map((a) => <Sfx key={`h${a}`} at={a} src="sfx/marker_tick.wav" volume={0.2} />)}
  </>
);
