// Chapter 4 · The religion that rode the trade winds (Islam): Mecca on the Arabian Peninsula in the early 600s, the Quran,
// the line of prophets (names only), universalizing with about 2 billion, the first century of expansion (hierarchical
// diffusion), Saharan caravans and Indian Ocean ports (contagious diffusion), Mansa Musa and Timbuktu, Sunni and Shia,
// the Five Pillars, prayer and the qibla app, Ramadan, iftar, Eid al-Fitr, halal, the Indonesia answer, and the hajj.
// Respect: no image, drawing, silhouette or figure of the Prophet Muhammad anywhere; his name appears only as text.
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import words from '../../public/audio/ch04_islam.words.json';
import credits from '../../public/img/credits.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, INK, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, CropCard, Definition, DrawnCrown, hasFile, LEAD, makeTimeline, type Narration, Photo, PhotoCard, Stamp, type TL, useScene} from '../kit/shell';
import {Pie} from '../kit/charts';
import {PAL} from '../kit/look';
import {Dot, type Fill, MapLabel, WorldMap} from '../kit/asia';
import {Person} from '../kit/figures';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);

/** Modern photos: muted colour so the teal and coral marks read on top. */
const MUTED = 'saturate(0.55) contrast(1.08) brightness(0.82)';
/** AI paintings and archival art: black and white, a touch darker. */
const PAINT = 'grayscale(1) contrast(1.2) brightness(0.9)';
const ARCHIVE = 'grayscale(1) contrast(1.2)';
const GEN: [number, number] = [1376, 768];
const WHITE = '#ffffff';
type LL = [number, number];

/** Planned images that may still be downloading; each scene falls back to a drawn card or map without them. */
const IMG = {
  catalan: 'img/ch04/catalan_mansa_musa.jpg',
  djinguereber: 'img/ch04/djinguereber.jpg',
  postcard: 'img/ch04/timbuktu_postcard.jpg',
  prostration: 'img/ch04/prayer_prostration.jpg',
  aerial: 'img/ch04/prayer_aerial.jpg',
  dates: 'img/ch04/iftar_dates.jpg',
  eid: 'img/ch04/eid_prayer.jpg',
  istiqlal: 'img/ch04/istiqlal_interior.jpg',
  kaaba: 'img/ch04/kaaba_crowd.jpg',
  hajjKaaba: 'img/ch04/hajj_kaaba.jpg',
};
// TODO size: these planned files are placed with object-fit cover (FullBleed / PhotoCard), so no pixel size is needed.
// If a scene is switched to Photo or CropCard, fill in the real size here: [w, h].
// const SIZE_CATALAN: [number, number] = [0, 0];   // TODO size
// const SIZE_KAABA: [number, number] = [0, 0];     // TODO size

/** Credit line for an image from public/img/credits.json: "<what> · artist, licence, via Wikimedia Commons". */
const CR = credits as Record<string, {title?: string; artist?: string; licence?: string}>;
const credit = (src: string, what: string) => {
  const c = CR[src.replace(/^img\//, '')];
  if (!c) return what;
  const artist = (c.artist ?? 'unknown').replace(/\s+/g, ' ').slice(0, 48);
  return `${what} · ${artist}, ${c.licence ?? 'see credits'}, via Wikimedia Commons`;
};

/** Places used in this chapter, [lon, lat]. */
const L = {
  mecca: [39.83, 21.42] as LL,
  medina: [39.61, 24.47] as LL,
  cordoba: [-4.78, 37.88] as LL,
  damascus: [36.3, 33.5] as LL,
  baghdad: [44.4, 33.3] as LL,
  samarkand: [66.97, 39.65] as LL,
  niani: [-8.4, 11.4] as LL,
  timbuktu: [-3.0, 16.77] as LL,
  cairo: [31.24, 30.04] as LL,
  aden: [45.03, 12.8] as LL,
  calicut: [75.78, 11.25] as LL,
  malacca: [102.25, 2.19] as LL,
  jakarta: [106.85, -6.2] as LL,
  kano: [8.52, 12.0] as LL,
  detroit: [-83.05, 42.33] as LL,
  tehran: [54.5, 32.5] as LL,
  iraq: [42.6, 32.2] as LL,
};

/** Country ids (ISO numeric). */
const K = {
  saudi: '682', yemen: '887', oman: '512', uae: '784', qatar: '634', bahrain: '048', kuwait: '414', iraq: '368', syria: '760', jordan: '400',
  israel: '376', palestine: '275', lebanon: '422', egypt: '818', libya: '434', tunisia: '788', algeria: '012', morocco: '504', wSahara: '732',
  spain: '724', portugal: '620', iran: '364', afghanistan: '004', turkmenistan: '795', uzbekistan: '860', tajikistan: '762', pakistan: '586',
  mali: '466', indonesia: '360', nigeria: '566',
};
const ARABIA = [K.saudi, K.yemen, K.oman, K.uae, K.qatar, K.bahrain, K.kuwait];
/** Muslim-majority countries (simplified), for the "2 billion" map. */
const MUSLIM_MAJORITY = ['504', '012', '788', '434', '818', '729', '478', '466', '562', '686', '270', '324', '148', '706', '262', '682', '887', '512', '784', '634',
  '048', '414', '368', '760', '400', '792', '364', '004', '586', '050', '398', '860', '795', '762', '417', '031', '360', '458', '096', '008', '854', '694', '732',
  '275', '462', '174'];

// ---------- small drawn pieces ----------

const popEase = (t: number) => 1 - Math.pow(1 - t, 3) * (1 - 2.2 * t * (1 - t));
/** Pops in like a card on the desk. */
const usePop = (at: number) => {
  const g = useGFrame();
  const k = interpolate(g, [at, at + 5], [0, 1], {...clamp, easing: popEase});
  return {show: g >= at, style: {transform: `scale(${0.6 + 0.4 * k})`, opacity: Math.min(1, k * 2)} as React.CSSProperties};
};

/** A full-bleed photo whose pixel size is not known yet (planned downloads): object-fit cover with a slow push. */
const FullBleed: React.FC<{src: string; a: number; b: number; z0?: number; z1?: number; pos?: string; bw?: string; vignette?: number; children?: React.ReactNode}> = ({
  src, a, b, z0 = 1.02, z1 = 1.1, pos = '50% 50%', bw = MUTED, vignette = 0.65, children,
}) => {
  const g = useGFrame();
  const z = interpolate(g, [a, b], [z0, z1], clamp);
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: bw, transform: `scale(${z})`, transformOrigin: pos}} />
      {children}
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,${vignette}) 100%)`, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

/** A teal-ruled index card with a name in Abril and a short handwritten line under it. */
const NameCard: React.FC<{x: number; y: number; w: number; name: string; sub: string; at: number; rot?: number; hot?: boolean}> = ({x, y, w, name, sub, at, rot = 0, hot}) => {
  const {show, style} = usePop(at);
  if (!show) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, ...style, rotate: `${rot}deg`}}>
      <div style={{background: 'rgba(16,14,11,0.92)', border: `4px solid ${hot ? PAL.coral : PAL.teal}`, borderRadius: 8, padding: '18px 26px 14px', boxShadow: '0 16px 30px rgba(0,0,0,0.6)'}}>
        <div style={{fontFamily: JF.display, fontSize: 60, lineHeight: 1.05, color: PAL.cream, whiteSpace: 'nowrap'}}>{name}</div>
        <div style={{fontFamily: '"Nanum Pen Script", cursive', fontSize: 48, lineHeight: 1.1, color: hot ? PAL.coral : PAL.teal, whiteSpace: 'nowrap', marginTop: 6}}>{sub}</div>
      </div>
    </div>
  );
};

/** A route on the map: a soft teal glow under a crisp line, drawn on from start to end. */
const Route: React.FC<{pts: number[][]; at: number; dur?: number; color?: string; dashed?: boolean}> = ({pts, at, dur = 18, color = PAL.teal, dashed}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const common = {fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p};
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <path d={d} {...common} stroke={color} strokeWidth={22} strokeOpacity={0.2} style={{filter: 'blur(5px)'}} />
      <path d={d} {...common} stroke={color} strokeWidth={6} />
      {dashed && p >= 1 && <path d={d} fill="none" stroke="#111" strokeWidth={3} strokeDasharray="10 14" />}
    </svg>
  );
};

/** A coral hand-drawn X (no, not this one). */
const Cross: React.FC<{x: number; y: number; at: number; r?: number; width?: number}> = ({x, y, at, r = 34, width = 10}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 8], [0, 1], clamp);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d={`M${x - r},${y - r} L${x + r},${y + r}`} stroke={PAL.coral} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, p * 2)} />
      <path d={`M${x - r},${y + r} L${x + r},${y - r}`} stroke={PAL.coral} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, p * 2 - 1)} />
    </svg>
  );
};

/** An open book in teal line (the Quran as text, no calligraphy). */
const OpenBook: React.FC<{x: number; y: number; w: number; at: number}> = ({x, y, w, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 12], [0, 1], clamp);
  const h = w * 0.55;
  const mid = x + w / 2;
  const dash = {pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p};
  const lines = [0.3, 0.42, 0.54, 0.66, 0.78];
  const lp = interpolate(g, [at + 8, at + 20], [0, 1], clamp);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <path d={`M${mid},${y + h * 0.12} Q${x + w * 0.25},${y - h * 0.05} ${x},${y + h * 0.1} L${x},${y + h} Q${x + w * 0.25},${y + h * 0.85} ${mid},${y + h * 1.02} Z`}
        fill="rgba(244,239,230,0.06)" stroke={PAL.teal} strokeWidth={6} strokeLinejoin="round" {...dash} />
      <path d={`M${mid},${y + h * 0.12} Q${x + w * 0.75},${y - h * 0.05} ${x + w},${y + h * 0.1} L${x + w},${y + h} Q${x + w * 0.75},${y + h * 0.85} ${mid},${y + h * 1.02} Z`}
        fill="rgba(244,239,230,0.06)" stroke={PAL.teal} strokeWidth={6} strokeLinejoin="round" {...dash} />
      {lines.map((f, i) => (
        <g key={i} opacity={0.7}>
          <line x1={x + w * 0.08} y1={y + h * f} x2={x + w * 0.08 + (w * 0.36) * lp} y2={y + h * f} stroke={PAL.cream} strokeWidth={4} strokeLinecap="round" />
          <line x1={mid + w * 0.06} y1={y + h * f} x2={mid + w * 0.06 + (w * 0.36) * lp} y2={y + h * f} stroke={PAL.cream} strokeWidth={4} strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
};

/** One drawn column: base, shaft with flutes, capital; draws on bottom to top. */
const Pillar: React.FC<{cx: number; top: number; bottom: number; w: number; at: number; label: string}> = ({cx, top, bottom, w, at, label}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 10], [0, 1], clamp);
  const capH = 26;
  const yTop = bottom - (bottom - top) * p;
  const x0 = cx - w / 2;
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <rect x={x0 - 18} y={bottom - capH} width={w + 36} height={capH} rx={4} fill="rgba(244,239,230,0.08)" stroke={pal.mark} strokeWidth={5} />
        <rect x={x0} y={yTop + (p >= 1 ? capH : 0)} width={w} height={Math.max(0, bottom - capH - yTop - (p >= 1 ? capH : 0))} fill="rgba(244,239,230,0.06)" stroke={pal.mark} strokeWidth={5} />
        {[0.28, 0.5, 0.72].map((f) => <line key={f} x1={x0 + w * f} y1={yTop + capH + 10} x2={x0 + w * f} y2={bottom - capH - 10} stroke={pal.mark} strokeWidth={3} strokeOpacity={0.6} />)}
        {p >= 1 && <rect x={x0 - 18} y={top} width={w + 36} height={capH} rx={4} fill="rgba(244,239,230,0.08)" stroke={pal.mark} strokeWidth={5} />}
      </svg>
      {p >= 1 && (
        <div style={{position: 'absolute', left: cx, top: bottom + 20, transform: 'translateX(-50%)', fontFamily: JF.display, fontSize: 42, color: PAL.cream, whiteSpace: 'nowrap', textShadow: '0 3px 10px #000'}}>{label}</div>
      )}
    </>
  );
};

/** The sun's path from dawn to night with the five prayer times as dots. */
const DayArc: React.FC<{cx: number; cy: number; r: number; at: number}> = ({cx, cy, r, at}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 14], [0, 1], clamp);
  const spots = [
    {deg: 172, label: 'dawn', dx: -20, dy: 46, align: 'right'},
    {deg: 95, label: 'midday', dx: 0, dy: -50, align: 'center'},
    {deg: 45, label: 'afternoon', dx: 26, dy: -26, align: 'left'},
    {deg: 6, label: 'sunset', dx: 26, dy: -10, align: 'left'},
    {deg: -16, label: 'night', dx: 26, dy: 20, align: 'left'},
  ];
  const pt = (deg: number) => [cx + r * Math.cos((deg * Math.PI) / 180), cy - r * Math.sin((deg * Math.PI) / 180)];
  const [sx, sy] = pt(185);
  const [ex, ey] = pt(-20);
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <line x1={cx - r - 80} y1={cy} x2={cx + r + 80} y2={cy} stroke="rgba(244,239,230,0.45)" strokeWidth={4} strokeDasharray="14 12" />
        <path d={`M${sx},${sy} A${r},${r} 0 1 1 ${ex},${ey}`} fill="none" stroke={pal.mark} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      </svg>
      {spots.map((s, i) => {
        const [x, y] = pt(s.deg);
        const a = at + 8 + i * 5;
        return (
          <React.Fragment key={s.label}>
            <Dot x={x} y={y} at={a} r={14} color={i === 1 ? PAL.orange : pal.mark} ring={false} />
            <MapLabel text={s.label} x={x + s.dx} y={y + s.dy} at={a + 2} size={30} align={s.align as 'left' | 'right' | 'center'} />
          </React.Fragment>
        );
      })}
    </>
  );
};

/** A drawn phone with a compass needle that swings round to point at Mecca. */
const Phone: React.FC<{x: number; y: number; at: number; pointAt: number}> = ({x, y, at, pointAt}) => {
  const g = useGFrame();
  const {show, style} = usePop(at);
  if (!show) return null;
  const W = 380, H = 740;
  const cx = W / 2, cy = 420, r = 140;
  const rot = interpolate(g, [pointAt, pointAt + 8, pointAt + 12, pointAt + 15], [-118, 10, -4, 0], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: W, height: H, ...style, rotate: '3deg'}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <rect x={0} y={0} width={W} height={H} rx={52} fill="#0f0e0b" stroke={PAL.cream} strokeWidth={7} />
        <rect x={22} y={70} width={W - 44} height={H - 150} rx={14} fill="#1c1a15" stroke="rgba(244,239,230,0.25)" strokeWidth={2} />
        <rect x={cx - 50} y={30} width={100} height={12} rx={6} fill="rgba(244,239,230,0.35)" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={PAL.teal} strokeWidth={5} />
        {Array.from({length: 24}).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const r0 = i % 6 === 0 ? r - 22 : r - 12;
          return <line key={i} x1={cx + Math.cos(a) * r0} y1={cy + Math.sin(a) * r0} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} stroke={PAL.teal} strokeWidth={3} />;
        })}
        <g transform={`rotate(${rot} ${cx} ${cy})`}>
          <path d={`M${cx},${cy - r + 26} L${cx + 18},${cy} L${cx},${cy + 30} L${cx - 18},${cy} Z`} fill={PAL.coral} stroke="#111" strokeWidth={3} />
          <circle cx={cx} cy={cy} r={9} fill={PAL.cream} />
        </g>
      </svg>
      {g >= pointAt + 12 && (
        <div style={{position: 'absolute', left: cx, top: cy - r - 92, transform: 'translateX(-50%)', fontFamily: JF.display, fontSize: 46, color: PAL.coral, whiteSpace: 'nowrap'}}>Mecca</div>
      )}
      <div style={{position: 'absolute', left: cx, top: H - 130, transform: 'translateX(-50%)', fontFamily: JF.mono, fontSize: 22, letterSpacing: 2, color: 'rgba(244,239,230,0.7)', whiteSpace: 'nowrap'}}>PRAYER DIRECTION</div>
    </div>
  );
};

/** A drawn minaret with sound rings (the call to prayer) — the fallback when the prayer photo has not arrived. */
const Minaret: React.FC<{x: number; base: number; at: number}> = ({x, base, at}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 12], [0, 1], clamp);
  const dash = {pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p};
  const top = base - 520;
  const rings = [0, 1, 2].map((i) => interpolate(g, [at + 10 + i * 6, at + 18 + i * 6], [0, 1], clamp));
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <path d={`M${x - 55},${base} L${x - 45},${top + 140} L${x + 45},${top + 140} L${x + 55},${base} Z`} fill="rgba(244,239,230,0.06)" stroke={pal.mark} strokeWidth={6} strokeLinejoin="round" {...dash} />
      <path d={`M${x - 80},${top + 140} L${x + 80},${top + 140} L${x + 70},${top + 115} L${x - 70},${top + 115} Z`} fill="rgba(244,239,230,0.08)" stroke={pal.mark} strokeWidth={6} strokeLinejoin="round" {...dash} />
      <path d={`M${x - 38},${top + 115} L${x - 38},${top + 60} L${x + 38},${top + 60} L${x + 38},${top + 115}`} fill="none" stroke={pal.mark} strokeWidth={6} {...dash} />
      <path d={`M${x - 46},${top + 60} Q${x},${top - 40} ${x + 46},${top + 60} Z`} fill="rgba(244,239,230,0.08)" stroke={pal.mark} strokeWidth={6} strokeLinejoin="round" {...dash} />
      <line x1={x} y1={top - 40} x2={x} y2={top + 10} stroke={pal.mark} strokeWidth={5} {...dash} />
      {rings.map((rp, i) => rp > 0 && (
        <g key={i}>
          <path d={`M${x + 70 + i * 50},${top + 30 - i * 26} Q${x + 110 + i * 60},${top + 85} ${x + 70 + i * 50},${top + 140 + i * 26}`} fill="none" stroke={PAL.cream} strokeWidth={5} strokeLinecap="round"
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - rp} opacity={0.85 - i * 0.2} />
          <path d={`M${x - 70 - i * 50},${top + 30 - i * 26} Q${x - 110 - i * 60},${top + 85} ${x - 70 - i * 50},${top + 140 + i * 26}`} fill="none" stroke={PAL.cream} strokeWidth={5} strokeLinecap="round"
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - rp} opacity={0.85 - i * 0.2} />
        </g>
      ))}
    </svg>
  );
};

/** Sunrise to sunset: the fasting window as a band between two half-suns. */
const SunBand: React.FC<{x0: number; x1: number; y: number; at: number}> = ({x0, x1, y, at}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 12], [0, 1], clamp);
  const sun = (cx: number) => (
    <g>
      <path d={`M${cx - 44},${y} A44,44 0 0 1 ${cx + 44},${y}`} fill={PAL.orange} stroke="#111" strokeWidth={3} />
      {[-60, -30, 0, 30, 60].map((d) => {
        const a = ((d - 90) * Math.PI) / 180;
        return <line key={d} x1={cx + Math.cos(a) * 56} y1={y + Math.sin(a) * 56} x2={cx + Math.cos(a) * 76} y2={y + Math.sin(a) * 76} stroke={PAL.orange} strokeWidth={5} strokeLinecap="round" />;
      })}
    </g>
  );
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <line x1={x0 - 90} y1={y} x2={x1 + 90} y2={y} stroke="rgba(244,239,230,0.5)" strokeWidth={4} />
        {sun(x0)}
        {p >= 1 && sun(x1)}
        <rect x={x0 + 60} y={y - 40} width={Math.max(0, (x1 - x0 - 120) * p)} height={28} rx={8} fill={pal.mark} opacity={0.85} />
      </svg>
      <MapLabel text="sunrise" x={x0} y={y + 40} at={at} align="center" size={28} />
      <MapLabel text="sunset" x={x1} y={y + 40} at={at + 12} align="center" size={28} />
    </>
  );
};

/** A drawn glass of water, struck out. */
const Glass: React.FC<{x: number; y: number; at: number; crossAt: number}> = ({x, y, at, crossAt}) => {
  const {show, style} = usePop(at);
  if (!show) return null;
  return (
    <>
      <div style={{position: 'absolute', left: x, top: y, width: 200, height: 260, ...style}}>
        <svg width={200} height={260} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <path d="M30,20 L170,20 L150,250 L50,250 Z" fill="none" stroke={PAL.cream} strokeWidth={7} strokeLinejoin="round" />
          <path d="M42,90 L158,90 L150,244 L50,244 Z" fill={PAL.teal} opacity={0.35} />
        </svg>
      </div>
      <Cross x={x + 100} y={y + 135} at={crossAt} r={110} width={12} />
    </>
  );
};

/** Fallback for the iftar photo: a drawn plate of dates beside a glass of water. */
const Plate: React.FC<{cx: number; cy: number; at: number}> = ({cx, cy, at}) => {
  const {show, style} = usePop(at);
  if (!show) return null;
  const dates = [[-90, -40, -20], [-20, -70, 15], [60, -45, -30], [-70, 40, 25], [10, 10, -10], [85, 45, 20], [-10, 85, 5]];
  return (
    <div style={{position: 'absolute', left: cx - 330, top: cy - 260, width: 660, height: 520, ...style}}>
      <svg width={660} height={520} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <ellipse cx={260} cy={280} rx={240} ry={200} fill="rgba(244,239,230,0.1)" stroke={PAL.cream} strokeWidth={7} />
        <ellipse cx={260} cy={280} rx={180} ry={146} fill="none" stroke="rgba(244,239,230,0.35)" strokeWidth={3} />
        {dates.map(([dx, dy, r], i) => (
          <ellipse key={i} cx={260 + dx} cy={280 + dy} rx={46} ry={24} transform={`rotate(${r} ${260 + dx} ${280 + dy})`} fill="#a4572a" stroke="#111" strokeWidth={3} />
        ))}
        <path d="M520,150 L630,150 L615,470 L535,470 Z" fill="none" stroke={PAL.cream} strokeWidth={7} strokeLinejoin="round" />
        <path d="M528,210 L622,210 L615,464 L535,464 Z" fill={PAL.teal} opacity={0.35} />
      </svg>
    </div>
  );
};

/** Fallback for the Eid photo: the month of Ramadan crossed off day by day, then EID circled. */
const Calendar: React.FC<{x: number; y: number; at: number; span: number; eidAt: number}> = ({x, y, at, span, eidAt}) => {
  const g = useGFrame();
  const {show, style} = usePop(at);
  if (!show) return null;
  const cols = 6, rows = 5, cw = 92, ch = 58;
  const W = cols * cw + 40;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: W, ...style, rotate: '-2deg'}}>
      <div style={{position: 'relative', background: '#f4efe6', borderRadius: 6, width: W, height: rows * ch + 90, boxShadow: '0 18px 34px rgba(0,0,0,0.6)'}}>
        <div style={{position: 'absolute', left: 20, top: 16, fontFamily: JF.mono, fontSize: 26, letterSpacing: 6, color: '#3a342b'}}>RAMADAN</div>
        <svg width={W} height={rows * ch + 90} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          {Array.from({length: 30}).map((_, i) => {
            const cx = 20 + (i % cols) * cw;
            const cy = 70 + Math.floor(i / cols) * ch;
            const last = i === 29;
            const xp = interpolate(g, [at + (i / 29) * span, at + (i / 29) * span + 3], [0, 1], clamp);
            return (
              <g key={i}>
                <rect x={cx + 3} y={cy + 3} width={cw - 6} height={ch - 6} fill="none" stroke="rgba(17,17,17,0.25)" strokeWidth={2} />
                {!last && <text x={cx + 12} y={cy + 36} style={{fontFamily: JF.mono, fontSize: 22, fill: '#3a342b'}}>{i + 1}</text>}
                {!last && xp > 0 && <path d={`M${cx + 14},${cy + ch - 12} L${cx + cw - 14},${cy + 12}`} stroke="#14907f" strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - xp} />}
                {last && g >= eidAt && <text x={cx + cw / 2} y={cy + 40} textAnchor="middle" style={{fontFamily: JF.display, fontSize: 30, fill: '#c2412f'}}>EID</text>}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

/** Halal: a drawn food card with pork and alcohol struck out. */
const HalalCard: React.FC<{x: number; y: number; at: number; porkAt: number; alcoholAt: number}> = ({x, y, at, porkAt, alcoholAt}) => {
  const g = useGFrame();
  const {show, style} = usePop(at);
  if (!show) return null;
  const rows = [{name: 'pork', at: porkAt}, {name: 'alcohol', at: alcoholAt}, {name: 'chicken, beef, lamb*'}, {name: 'rice + vegetables'}];
  const W = 680, rowH = 96, top = 110;
  const H = top + rows.length * rowH + 20;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: W, ...style, rotate: '2deg'}}>
      <div style={{position: 'relative', background: '#f4efe6', borderRadius: 6, height: H, boxShadow: '0 20px 40px rgba(0,0,0,0.65)'}}>
        <div style={{position: 'absolute', left: 40, top: 30, fontFamily: JF.mono, fontSize: 28, letterSpacing: 6, color: '#3a342b'}}>HALAL?</div>
        <div style={{position: 'absolute', left: 40, right: 40, top: 84, height: 3, background: '#3a342b', opacity: 0.6}} />
        {rows.map((r, i) => {
          const struck = r.at !== undefined && g >= r.at;
          return <div key={r.name} style={{position: 'absolute', left: 40, top: top + i * rowH, fontFamily: JF.display, fontSize: 50, color: struck ? 'rgba(17,17,17,0.45)' : '#111', whiteSpace: 'nowrap'}}>{r.name}</div>;
        })}
        <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          {rows.map((r, i) => {
            const ty = top + i * rowH + 34;
            if (r.at !== undefined) {
              const xp = interpolate(g, [r.at, r.at + 8], [0, 1], clamp);
              return xp > 0 ? (
                <g key={r.name}>
                  <path d={`M${W - 150},${ty - 30} L${W - 70},${ty + 30}`} stroke={PAL.coral} strokeWidth={11} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, xp * 2)} />
                  <path d={`M${W - 150},${ty + 30} L${W - 70},${ty - 30}`} stroke={PAL.coral} strokeWidth={11} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, xp * 2 - 1)} />
                </g>
              ) : null;
            }
            const p = interpolate(g, [alcoholAt + 8 + (i - 2) * 4, alcoholAt + 13 + (i - 2) * 4], [0, 1], clamp);
            return p > 0 ? <path key={r.name} d={`M${W - 140},${ty} L${W - 118},${ty + 22} L${W - 76},${ty - 26}`} fill="none" stroke="#14907f" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round"
              pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} /> : null;
          })}
        </svg>
      </div>
    </div>
  );
};

/** A stack of drawn gold bars (fallback for the Catalan Atlas detail). */
const GoldCard: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const {show, style} = usePop(at);
  if (!show) return null;
  const bars = [[60, 300], [210, 300], [360, 300], [135, 236], [285, 236], [210, 172]];
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 700, height: 560, ...style, rotate: '-2deg'}}>
      <div style={{position: 'absolute', inset: 0, background: 'rgba(16,14,11,0.92)', border: `4px solid ${PAL.teal}`, borderRadius: 8, boxShadow: '0 16px 30px rgba(0,0,0,0.6)'}} />
      <svg width={700} height={560} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        {bars.map(([bx, by], i) => (
          <path key={i} d={`M${bx + 70},${by + 40} L${bx + 230},${by + 40} L${bx + 200},${by + 100} L${bx + 40},${by + 100} Z`} fill={PAL.orange} stroke="#111" strokeWidth={4} transform="translate(0 40)" />
        ))}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 440, textAlign: 'center', fontFamily: JF.display, fontSize: 64, color: PAL.cream, whiteSpace: 'nowrap'}}>Mansa Musa</div>
    </div>
  );
};

/** A short handwritten label centered on x (pillar captions). */
const SubLabel: React.FC<{text: string; x: number; y: number; at: number; color: string}> = ({text, x, y, at, color}) => {
  const g = useGFrame();
  if (g < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, 0) rotate(-2deg)', fontFamily: '"Nanum Pen Script", cursive', fontSize: 50, lineHeight: 1, color, whiteSpace: 'nowrap',
      opacity: interpolate(g, [at, at + 4], [0, 1], clamp), textShadow: '0 0 2px #111, 2px 2px 0 #111, -2px 2px 0 #111, 2px -2px 0 #111, -2px -2px 0 #111'}}>{text}</div>
  );
};

// ---------- scenes ----------

/** Mecca, a trading city on the Arabian Peninsula, early 600s CE. */
const Hearth: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const fills: Fill[] = ARABIA.map((id) => ({id, at: t.at('Arabian'), color: PAL.orange, opacity: 0.32}));
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: 0, lon: 43, lat: 23, z: 3.6}, {f: t.at('Those revelations'), lon: 41.5, lat: 22.5, z: 5.0}]} fills={fills}>
        {(S) => {
          const [mx, my] = S(L.mecca);
          const [dx, dy] = S(L.medina);
          const [ax, ay] = S([50.5, 19]);
          return (
            <>
              <Dot x={mx} y={my} at={t.at('Mecca')} r={13} color={pal.subject} />
              <MapLabel text="Mecca" x={mx - 40} y={my + 6} at={t.at('Mecca') + 2} align="right" size={40} color={PAL.coral} />
              <Dot x={dx} y={dy} at={t.at('Arabian') + 8} r={9} color={pal.mark} ring={false} />
              <MapLabel text="Medina" x={dx - 34} y={dy - 6} at={t.at('Arabian') + 10} align="right" size={32} />
              <MapLabel text="Arabian Peninsula" x={ax} y={ay} at={t.at('Arabian') + 2} align="center" size={30} color={PAL.ink} />
            </>
          );
        }}
      </WorldMap>
      <Highlight text="EARLY 600s CE" x={100} y={80} size={92} at={t.at('600s')} seed={401} rot={-2} />
      <Note text="Mecca: a trading city" x={1180} y={90} size={50} rot={-3} at={t.at('trading') - 3} color={WHITE} />
      <Note text="a merchant named Muhammad" x={110} y={800} size={50} rot={-3} at={t.at('merchant') - 3} />
      <Note text="said he received revelations from God" x={110} y={900} size={46} rot={-2} at={t.at('revelations') - 3} color={WHITE} />
      <Tag text="Map: Natural Earth · modern borders" x={1440} />
    </AbsoluteFill>
  );
};

/** The Quran; the line of prophets (names only); "Allah" is the Arabic word for God. */
const Quran: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const cards = [
    {name: 'Abraham', at: t.at('Abraham'), x: 90},
    {name: 'Moses', at: t.at('Moses'), x: 520},
    {name: 'Jesus', at: t.at('Jesus'), x: 950},
  ];
  const lineP = interpolate(g, [t.at('line'), t.at('line') + 12], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <OpenBook x={1340} y={90} w={460} at={t.at('Those revelations')} />
      <Note text="written down" x={1440} y={370} size={44} rot={-3} at={t.at('became') - 3} color={WHITE} />
      <Highlight text="QURAN" x={100} y={80} size={110} at={t.at('Quran')} seed={402} rot={-2} />
      <Definition term="Quran" def="the holy book of Islam; Muslims believe it is God's word, revealed to Muhammad" at={t.at('Quran') + 9} x={110} y={250} w={1080} />
      <Note text="Muslims see a line of prophets:" x={110} y={440} size={46} rot={-2} at={t.at('line') - 3} color={WHITE} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <path d={`M110,${740} L1780,${740}`} stroke={pal.mark} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lineP} />
      </svg>
      {cards.map((c, i) => <NameCard key={c.name} x={c.x} y={560} w={370} name={c.name} sub="prophet" at={c.at} rot={i % 2 ? 2 : -2} />)}
      <NameCard x={1380} y={560} w={410} name="Muhammad" sub="the final prophet" at={t.at('final')} rot={2} hot />
      <Highlight text="ALLAH" x={100} y={850} size={78} at={t.at('Allah')} seed={403} rot={-2} />
      <Note text="= simply the Arabic word for God" x={460} y={862} size={52} rot={-2} at={t.at('Arabic') - 3} />
      <Tag text="Names only · no images of the Prophet Muhammad" x={1260} />
    </AbsoluteFill>
  );
};

/** Universalizing, about 2 billion, second largest. */
const Universal: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Islam is a');
  const fills: Fill[] = MUSLIM_MAJORITY.map((id, i) => ({id, at: t.at('2 billion') + (i % 9) * 2, color: PAL.coral, opacity: 0.72}));
  fills.push({id: K.nigeria, at: t.at('2 billion') + 8, color: PAL.coral, opacity: 0.35});
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 30, lat: 14, z: 1.25}, {f: t.at('And it spread'), lon: 34, lat: 14, z: 1.33}]} fills={fills} />
      <Highlight text="UNIVERSALIZING RELIGION" x={100} y={70} size={76} at={t.at('universalizing')} seed={404} rot={-2} />
      <Definition term="universalizing religion" def="a religion that welcomes anyone, anywhere, and seeks converts" at={t.at('universalizing') + 9} x={110} y={200} w={980} />
      <Stamp text="2 BILLION" x={100} y={700} size={130} at={t.at('2 billion')} color={PAL.coral} />
      <Note text="the 2nd largest religion in the world" x={110} y={850} size={46} rot={-2} at={t.at('second') - 3} color={WHITE} />
      <Note text="+ one of the fastest growing" x={110} y={935} size={44} rot={-2} at={t.at('fastest') - 3} />
      <Tag text="Shaded: Muslim-majority countries (Nigeria about half) · Pew Research Center · Map: Natural Earth" x={760} />
    </AbsoluteFill>
  );
};

/** Within about 100 years: Spain to Central Asia. Hierarchical diffusion. */
const Expansion: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('And it spread');
  const w1 = t.at('Within') + 8;
  const w2 = t.at('years') + 4;
  const fills: Fill[] = [
    ...ARABIA.map((id) => ({id, at: a, color: PAL.coral, opacity: 0.7})),
    ...[K.syria, K.jordan, K.israel, K.palestine, K.lebanon, K.iraq, K.egypt].map((id, i) => ({id, at: w1 + i, color: PAL.coral, opacity: 0.6})),
    ...[K.iran, K.libya].map((id, i) => ({id, at: w2 + i * 2, color: PAL.coral, opacity: 0.55})),
    ...[K.tunisia, K.algeria, K.morocco, K.wSahara].map((id, i) => ({id, at: t.at('Spain') - 8 + i * 2, color: PAL.coral, opacity: 0.5})),
    ...[K.spain, K.portugal].map((id) => ({id, at: t.at('Spain'), color: PAL.coral, opacity: 0.5})),
    ...[K.afghanistan, K.turkmenistan, K.uzbekistan, K.tajikistan].map((id, i) => ({id, at: t.at('Central') + i * 2, color: PAL.coral, opacity: 0.5})),
  ];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 24, lat: 31, z: 2.3}, {f: t.at('But a huge'), lon: 26, lat: 30, z: 2.45}]} fills={fills}>
        {(S) => {
          const [mx, my] = S(L.mecca);
          const [cx, cy] = S(L.cordoba);
          const [sx, sy] = S(L.samarkand);
          return (
            <>
              <Dot x={mx} y={my} at={a + 2} r={11} color={PAL.coral} ring={false} />
              <MapLabel text="Mecca" x={mx + 26} y={my + 10} at={a + 4} size={30} />
              <Arrow x1={mx - 30} y1={my - 30} x2={cx + 20} y2={cy + 10} bow={-90} at={t.at('Spain') - 4} dur={10} />
              <MapLabel text="Spain" x={cx - 20} y={cy - 56} at={t.at('Spain')} align="center" size={36} color={PAL.cream} />
              <Arrow x1={mx + 30} y1={my - 30} x2={sx - 14} y2={sy + 20} bow={60} at={t.at('Central') - 4} dur={10} />
              <MapLabel text="Central Asia" x={sx} y={sy - 56} at={t.at('Central')} align="center" size={36} color={PAL.cream} />
            </>
          );
        }}
      </WorldMap>
      <Note text="within about 100 years" x={100} y={60} size={56} rot={-3} at={t.at('Within') - 3} color={WHITE} />
      <Note text="632 CE → c. 750 CE" x={110} y={160} size={44} rot={-3} at={t.at('100') - 3} />
      <Highlight text="HIERARCHICAL DIFFUSION" x={100} y={770} size={72} at={t.at('hierarchical')} seed={405} rot={-2} />
      <Definition term="hierarchical diffusion" def="spreads from the top down: from rulers and powerful places to everyone else" at={t.at('hierarchical') + 9} x={110} y={890} w={1180} />
      <Note text="new rulers + empires took over" x={1140} y={60} size={44} rot={-3} at={t.at('rulers') - 3} />
      <Tag text="Approx. extent of Muslim rule, c. 750 CE · Map: Natural Earth" x={1180} />
    </AbsoluteFill>
  );
};

/** Not just armies: trade. The Saharan caravan painting, the guide in coral. */
const Caravan: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('But a huge');
  return (
    <Photo src="img/gen/v2_ch3_sahara_caravan.jpg" size={GEN} fx={560} fy={450} z0={1.02} z1={1.08} a={a} b={t.at('and sailed')} bw={PAINT} mask={MASKS.caravan_guide} traceAt={t.at('merchants') + 2} vignette={0.65}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 28%, rgba(0,0,0,0) 40%)'}} />
          <Note text="not just armies..." x={100} y={40} size={52} rot={-3} at={t.at('armies') - 3} color={WHITE} />
          <Highlight text="TRADE" x={100} y={140} size={100} at={t.at('trade')} seed={406} rot={-2} />
          <Note text="Muslim merchants" x={1150} y={40} size={50} rot={-3} at={t.at('merchants') - 3} />
          <Note text="camel caravans across the Sahara" x={1000} y={140} size={44} rot={-3} at={t.at('Sahara') - 3} />
          <Tag text="Illustration · a camel caravan crossing the Sahara (AI-generated)" />
        </>
      )}
    </Photo>
  );
};

/** Indian Ocean ports: the port painting, the merchant in coral. Contagious diffusion. */
const Port: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('and sailed');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src="img/gen/v2_ch3_indian_ocean_port.jpg" size={GEN} x={100} y={90} w={1080} h={620} fx={780} fy={410} scale={1.2} rot={-1.5} at={a + 1} bw={PAINT}
        mask={MASKS.port_merchant} traceAt={t.at('port after') + 2} />
      <Note text="...and the Indian Ocean" x={1270} y={90} size={48} rot={-3} at={t.at('Indian') - 3} color={WHITE} />
      <Note text="on the monsoon winds" x={1270} y={190} size={48} rot={-3} at={t.at('monsoon') - 3} />
      <Note text="port after port" x={1270} y={330} size={50} rot={-3} at={t.at('port after') - 3} />
      <Note text="local people adopted" x={1270} y={460} size={48} rot={-3} at={t.at('local') - 3} color={PAL.coral} />
      <Note text="their faith" x={1300} y={545} size={48} rot={-3} at={t.at('adopted') + 4} color={PAL.coral} />
      <Highlight text="CONTAGIOUS DIFFUSION" x={100} y={790} size={76} at={t.at('contagious')} seed={407} rot={-2} />
      <Definition term="contagious diffusion" def="spreads person to person through everyday contact, like a cold" at={t.at('contagious') + 9} x={110} y={920} w={1700} />
      <Tag text="Illustration · a Muslim merchant trading at an Indian Ocean port (AI-generated)" />
    </AbsoluteFill>
  );
};

/** Mansa Musa, ruler of Mali: the Catalan Atlas if present, else a drawn gold card; Mali on a small map. */
const Mansa: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('One famous');
  const real = hasFile(IMG.catalan);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="one famous example..." x={110} y={50} size={50} rot={-3} at={a - 3} color={WHITE} />
      {real
        ? <PhotoCard src={IMG.catalan} x={110} y={170} w={720} h={640} rot={-2} at={a + 2} filter={ARCHIVE} pos="50% 40%" outline />
        : <>
            <GoldCard x={120} y={190} at={a + 2} />
            <DrawnCrown x0={360} x1={580} y={300} h={80} at={t.at('Mansa') + 4} />
          </>}
      <Highlight text="MANSA MUSA" x={960} y={110} size={96} at={t.at('Mansa')} seed={408} rot={-2} />
      <Note text="ruler of Mali, a West African empire" x={980} y={270} size={40} rot={-2} at={t.at('ruler') - 3} />
      <WorldMap x={990} y={390} w={820} h={340} frame keys={[{f: a, lon: -4, lat: 16, z: 3.5}]} fills={[{id: K.mali, at: t.at('Mali'), color: PAL.orange, opacity: 0.75}]}>
        {(S) => {
          const [x, y] = S([-2, 18]);
          return <MapLabel text="Mali" x={x} y={y} at={t.at('Mali') + 2} align="center" size={40} color={PAL.ink} />;
        }}
      </WorldMap>
      <Note text="possibly the richest person" x={990} y={790} size={48} rot={-2} at={t.at('richest') - 3} color={PAL.coral} />
      <Note text="who ever lived" x={1020} y={890} size={48} rot={-2} at={t.at('ever lived') - 3} color={PAL.coral} />
      <Tag text={real ? credit(IMG.catalan, 'Mansa Musa, Catalan Atlas (1375), detail') : 'Drawn card · Map: Natural Earth, modern borders'} />
    </AbsoluteFill>
  );
};

/** 1324: Mali to Cairo to Mecca with a caravan of gold. */
const MUSA_ROUTE: LL[] = [L.niani, [-5.5, 14.2], L.timbuktu, [-1, 22], [1.0, 27.5], [10, 27], [20, 28.5], L.cairo, [33.0, 28.3], [35.5, 25], L.mecca];
const Pilgrimage: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('In thirteen');
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 14, lat: 22, z: 2.9}, {f: t.at('Trade brought'), lon: 16, lat: 22, z: 3.05}]} fills={[{id: K.mali, at: a, color: PAL.orange, opacity: 0.6}]}>
        {(S) => {
          const pts = MUSA_ROUTE.map((ll) => S(ll));
          const [mx, my] = S(L.mecca);
          const [cx, cy] = S(L.cairo);
          const [tx, ty] = S(L.timbuktu);
          return (
            <>
              <Route pts={pts} at={t.at('he made')} dur={34} color={PAL.orange} />
              <Dot x={tx} y={ty} at={a + 4} r={9} color={pal.mark} ring={false} />
              <MapLabel text="Mali" x={tx - 40} y={ty + 60} at={a + 4} align="right" size={34} />
              <Dot x={mx} y={my} at={t.at('Mecca', 2)} r={12} color={PAL.coral} />
              <MapLabel text="Mecca" x={mx + 34} y={my + 4} at={t.at('Mecca', 2) + 2} size={36} color={PAL.coral} />
              <Dot x={cx} y={cy} at={t.at('Cairo')} r={11} color={pal.mark} />
              <MapLabel text="Cairo" x={cx} y={cy - 52} at={t.at('Cairo') + 2} align="center" size={34} />
              <Note text="gold lost its value here for years" x={cx - 300} y={cy - 200} size={44} rot={-3} at={t.at('crashed') - 3} color={PAL.coral} />
            </>
          );
        }}
      </WorldMap>
      <Stamp text="1324" x={100} y={70} size={150} at={t.at('thirteen')} color={PAL.cream} />
      <Note text="the pilgrimage to Mecca" x={110} y={240} size={50} rot={-3} at={t.at('pilgrimage') - 3} />
      <Note text="a caravan loaded with gold" x={110} y={860} size={52} rot={-3} at={t.at('loaded') - 3} color={WHITE} />
      <Tag text="Route simplified · Map: Natural Earth, modern borders" x={1240} />
    </AbsoluteFill>
  );
};

/** Trade brought Islam to Mali; its rulers embraced it; Timbuktu a center of learning. */
const Timbuktu: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Trade brought');
  const pal = usePal();
  const real = hasFile(IMG.djinguereber);
  const card = hasFile(IMG.postcard);
  return (
    <AbsoluteFill>
      <DarkPaper />
      {real ? (
        <>
          <PhotoCard src={IMG.djinguereber} x={100} y={120} w={820} h={540} rot={-2} at={a + 1} filter={MUTED} />
          {card && <PhotoCard src={IMG.postcard} x={520} y={560} w={460} h={300} rot={3} at={t.at('Timbuktu') + 2} filter={ARCHIVE} />}
        </>
      ) : (
        <WorldMap x={100} y={130} w={860} h={720} frame keys={[{f: a, lon: -3, lat: 15.5, z: 5.0}, {f: t.at('Islam has two'), lon: -3, lat: 16.2, z: 5.4}]}
          fills={[{id: K.mali, at: a, color: PAL.orange, opacity: 0.55}]}>
          {(S) => {
            const [x, y] = S(L.timbuktu);
            const [mx, my] = S([-6.5, 13.0]);
            return (
              <>
                <MapLabel text="Mali" x={mx} y={my} at={a + 2} align="center" size={40} color={PAL.ink} />
                <Dot x={x} y={y} at={t.at('Timbuktu')} r={13} color={pal.subject} />
                <MapLabel text="Timbuktu" x={x + 34} y={y - 30} at={t.at('Timbuktu') + 2} size={38} color={PAL.coral} />
              </>
            );
          }}
        </WorldMap>
      )}
      <Note text="trade brought Islam to Mali" x={1040} y={110} size={46} rot={-3} at={a - 3} color={WHITE} />
      <Note text="its rulers embraced it" x={1040} y={220} size={46} rot={-3} at={t.at('embraced') - 3} />
      <Highlight text="TIMBUKTU" x={1030} y={400} size={96} at={t.at('Timbuktu')} seed={409} rot={-2} />
      <Note text="a center of Islamic learning" x={1040} y={570} size={48} rot={-3} at={t.at('learning') - 3} color={PAL.coral} />
      <Tag text={real ? credit(IMG.djinguereber, 'Djinguereber Mosque, Timbuktu') : 'Map: Natural Earth, modern borders'} />
    </AbsoluteFill>
  );
};

/** Two branches: Sunni 85-90%, Shia 10-15%, Shia concentrated in Iran and Iraq. */
const Branches: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Islam has two');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="two main branches" x={100} y={50} size={54} rot={-3} at={a - 3} color={WHITE} />
      <Pie cx={470} cy={590} r={250} at={t.at('Most Muslims')} per={60} seed={4}
        slices={[{label: 'Sunni', value: 87.5, pct: '85-90%', labelAt: [640, 930]}, {label: 'Shia', value: 12.5, pct: '10-15%', subject: true, labelAt: [320, 250]}]} />
      <Highlight text="SUNNI" x={990} y={100} size={86} at={t.at('Sunni')} seed={410} rot={-2} />
      <Definition term="Sunni" def="the largest branch of Islam" at={t.at('Sunni') + 9} x={1000} y={240} w={820} />
      <Highlight text="SHIA" x={990} y={370} size={86} at={t.at('Shia')} seed={411} rot={-2} />
      <Definition term="Shia" def="the second branch; it split with Sunnis over who should lead after Muhammad" at={t.at('Shia') + 9} x={1000} y={510} w={820} />
      <WorldMap x={1000} y={700} w={820} h={290} frame keys={[{f: a, lon: 48, lat: 32, z: 3.2}]}
        fills={[{id: K.iran, at: t.at('Iran'), color: PAL.coral, opacity: 0.75}, {id: K.iraq, at: t.at('Iraq'), color: PAL.coral, opacity: 0.75}]}>
        {(S) => {
          const [ix, iy] = S(L.tehran);
          const [qx, qy] = S(L.iraq);
          return (
            <>
              <MapLabel text="Iran" x={ix} y={iy} at={t.at('Iran') + 2} align="center" size={38} color={PAL.ink} />
              <MapLabel text="Iraq" x={qx} y={qy} at={t.at('Iraq') + 2} align="center" size={32} color={PAL.ink} />
            </>
          );
        }}
      </WorldMap>
      <Tag text="Pew Research Center estimates · Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** The Five Pillars as five drawn columns. */
const Pillars: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const cols = [
    {label: 'FAITH', sub: 'one God', at: t.at('declaring')},
    {label: 'PRAYER', sub: '5 times a day', at: t.at('praying')},
    {label: 'CHARITY', sub: 'giving', at: t.at('giving')},
    {label: 'FASTING', sub: 'in Ramadan', at: t.at('fasting')},
    {label: 'PILGRIMAGE', sub: 'Mecca, once', at: t.at('making')},
  ];
  const xs = [300, 630, 960, 1290, 1620];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="FIVE PILLARS" x={100} y={70} size={96} at={t.at('Five Pillars')} seed={412} rot={-2} />
      <Definition term="Five Pillars" def="the five core duties at the center of Muslim life" at={t.at('Five Pillars') + 9} x={110} y={220} w={1100} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <line x1={120} y1={800} x2={1800} y2={800} stroke="rgba(244,239,230,0.35)" strokeWidth={4} />
      </svg>
      {cols.map((c, i) => (
        <React.Fragment key={c.label}>
          <Pillar cx={xs[i]} top={420} bottom={800} w={120} at={c.at} label={c.label} />
          <SubLabel text={c.sub} x={xs[i]} y={905} at={c.at + 4} color={i === 4 ? PAL.coral : pal.mark} />
        </React.Fragment>
      ))}
      <Note text="if you're able" x={1500} y={340} size={44} rot={-4} at={t.at('able') - 3} color={WHITE} />
    </AbsoluteFill>
  );
};

/** Five daily prayers, dawn to night, facing Mecca: the photo if present, else the sun's path. */
const Prayer: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('The five daily');
  const pal = usePal();
  if (hasFile(IMG.prostration)) {
    return (
      <FullBleed src={IMG.prostration} a={a} b={t.at('In much')} bw={MUTED}>
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0) 50%)'}} />
        <Note text="five daily prayers" x={100} y={50} size={56} rot={-3} at={a - 3} color={WHITE} />
        <Note text="at set times, dawn to night" x={110} y={160} size={48} rot={-3} at={t.at('set times') - 3} />
        <Note text="always facing Mecca" x={1200} y={60} size={52} rot={-3} at={t.at('always') - 3} color={PAL.coral} />
        <Tag text={credit(IMG.prostration, 'Muslims at prayer')} />
      </FullBleed>
    );
  }
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="five daily prayers" x={100} y={50} size={56} rot={-3} at={a - 3} color={WHITE} />
      <DayArc cx={960} cy={820} r={520} at={t.at('set times')} />
      <Note text="at set times, dawn to night" x={110} y={150} size={46} rot={-3} at={t.at('set times') - 3} />
      <Note text="always facing Mecca" x={760} y={620} size={56} rot={-3} at={t.at('always') - 3} color={pal.subject} />
      <Tag text="Drawn diagram · exact prayer times change with the sun and the season" />
    </AbsoluteFill>
  );
};

/** The call to prayer, and the app that points to Mecca. */
const CallApp: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('In much');
  const real = hasFile(IMG.aerial);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="in much of the world..." x={100} y={50} size={50} rot={-3} at={a - 3} color={WHITE} />
      {real
        ? <PhotoCard src={IMG.aerial} x={110} y={170} w={860} h={560} rot={-2} at={a + 1} filter={MUTED} />
        : <Minaret x={520} base={780} at={t.at('call')} />}
      <Note text="the call to prayer, from mosques" x={110} y={850} size={50} rot={-3} at={t.at('call') - 3} />
      <Phone x={1320} y={150} at={t.at('apps') - 1} pointAt={t.at('point')} />
      <Note text="yes, there's an app" x={1040} y={60} size={48} rot={-3} at={t.at('apps') - 3} color={PAL.coral} />
      <Tag text={real ? credit(IMG.aerial, 'Friday prayers') : 'Drawn minaret and phone'} />
    </AbsoluteFill>
  );
};

/** Ramadan: no food, no water, sunrise to sunset. */
const Ramadan: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const r = t.at('Ramadan', 2);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="RAMADAN" x={100} y={80} size={110} at={r} seed={413} rot={-2} />
      <Definition term="Ramadan" def="the holy month when many Muslims fast from sunrise to sunset" at={r + 9} x={110} y={250} w={960} />
      <Note text="no food, no drink" x={110} y={450} size={54} rot={-3} at={t.at("don't eat") - 3} color={WHITE} />
      <Note text="not even water" x={110} y={560} size={54} rot={-3} at={t.at('not even') - 3} color={pal.subject} />
      <SunBand x0={1230} x1={1710} y={330} at={t.at('sunrise')} />
      <Glass x={1370} y={520} at={t.at('water') - 2} crossAt={t.at('water') + 4} />
      <Note text="picture a full school day..." x={110} y={720} size={50} rot={-2} at={t.at('Picture') - 3} />
      <Note text="or football practice, without a single sip" x={110} y={830} size={50} rot={-2} at={t.at('football') - 3} color={WHITE} />
    </AbsoluteFill>
  );
};

/** Iftar: breaking the fast at sunset, often with dates and water. */
const Iftar: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('At sunset');
  const real = hasFile(IMG.dates);
  return (
    <AbsoluteFill>
      <DarkPaper />
      {real
        ? <PhotoCard src={IMG.dates} x={110} y={150} w={800} h={640} rot={-2} at={a + 1} filter={MUTED} />
        : <Plate cx={500} cy={520} at={a + 1} />}
      <Note text="at sunset: family + friends" x={1010} y={70} size={50} rot={-3} at={a - 3} color={WHITE} />
      <Highlight text="IFTAR" x={1000} y={190} size={110} at={t.at('iftar')} seed={414} rot={-2} />
      <Definition term="iftar" def="the evening meal that breaks the day's fast" at={t.at('iftar') + 9} x={1010} y={360} w={820} />
      <Note text="often dates + water first" x={1010} y={560} size={50} rot={-3} at={t.at('dates') - 3} color={PAL.coral} />
      <Tag text={real ? credit(IMG.dates, 'Dates for iftar') : 'Drawn plate: dates and a glass of water'} />
    </AbsoluteFill>
  );
};

/** Eid al-Fitr (left) and halal (right). */
const EidHalal: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('When Ramadan');
  const real = hasFile(IMG.eid);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 958, top: 60, width: 4, height: 900, background: 'rgba(244,239,230,0.5)'}} />
      <Note text="when Ramadan ends:" x={90} y={50} size={50} rot={-3} at={a - 3} color={WHITE} />
      <Highlight text="EID AL-FITR" x={80} y={150} size={86} at={t.at('Eid')} seed={415} rot={-2} />
      <Definition term="Eid al-Fitr" def="the festival that celebrates the end of Ramadan" at={t.at('Eid') + 9} x={90} y={300} w={800} />
      {real
        ? <PhotoCard src={IMG.eid} x={110} y={470} w={700} h={380} rot={-2} at={t.at('Eid') + 2} filter={MUTED} />
        : <Calendar x={150} y={470} at={a + 1} span={t.at('Eid') - a - 8} eidAt={t.at('Eid')} />}
      <Note text="new clothes" x={90} y={900} size={42} rot={-2} at={t.at('clothes') - 3} />
      <Note text="gifts" x={390} y={900} size={42} rot={-2} at={t.at('gifts') - 3} />
      <Note text="+ lots of food" x={560} y={900} size={42} rot={-2} at={t.at('food') - 3} color={PAL.coral} />
      <Note text="many Muslims eat only:" x={1040} y={50} size={48} rot={-3} at={t.at('Muslims also') - 3} color={WHITE} />
      <Highlight text="HALAL" x={1030} y={150} size={96} at={t.at('halal')} seed={416} rot={-2} />
      <Definition term="halal" def="allowed under Islamic law (for food: no pork, no alcohol)" at={t.at('halal') + 9} x={1040} y={300} w={800} />
      <HalalCard x={1100} y={480} at={t.at('halal') + 4} porkAt={t.at('pork')} alcoholAt={t.at('alcohol')} />
      <Tag text={real ? credit(IMG.eid, 'Eid al-Fitr prayers') : 'Drawn cards · *halal meat is also prepared in a set way'} />
    </AbsoluteFill>
  );
};

/** Back to the puzzle: not Saudi Arabia, not Egypt: Indonesia, 240 million. */
const Puzzle: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Now back');
  const z = t.at('Indonesia');
  const fills: Fill[] = [
    {id: K.saudi, at: t.at('Saudi'), color: PAL.cream, opacity: 0.35},
    {id: K.egypt, at: t.at('Egypt'), color: PAL.cream, opacity: 0.35},
    {id: K.indonesia, at: z, color: PAL.coral, opacity: 0.85},
  ];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 62, lat: 14, z: 1.55}, {f: z, lon: 66, lat: 12, z: 1.6}, {f: z + 30, lon: 112, lat: 0, z: 3.4}, {f: t.at('And Islam got'), lon: 114, lat: 0, z: 3.6}]} fills={fills}>
        {(S) => {
          const [sx, sy] = S([44.5, 24]);
          const [ex, ey] = S([29.8, 26.6]);
          const [ix, iy] = S([116, -6.5]);
          return (
            <>
              <Cross x={sx} y={sy} at={t.at('Arabia')} />
              <Cross x={ex} y={ey} at={t.at('Egypt') + 2} />
              <MapLabel text="Indonesia" x={ix} y={iy + 110} at={z + 30} align="center" size={42} color={PAL.coral} />
            </>
          );
        }}
      </WorldMap>
      <Note text="back to our puzzle..." x={100} y={50} size={54} rot={-3} at={a - 3} color={WHITE} />
      <Note text="which country has the most Muslims?" x={110} y={150} size={50} rot={-3} at={t.at('Which') - 3} />
      <MapLabel text="Southeast Asia" x={1500} y={240} at={t.at('Southeast')} size={34} color={PAL.teal} align="center" />
      <Highlight text="INDONESIA" x={100} y={700} size={96} at={z} seed={417} rot={-2} />
      <Stamp text="240 MILLION" x={100} y={850} size={110} at={t.at('240')} color={PAL.coral} />
      <Note text="Muslims" x={890} y={880} size={52} rot={-3} at={t.at('240') + 12} color={WHITE} />
      <Tag text="Pew Research Center estimates · Map: Natural Earth" x={1300} />
    </AbsoluteFill>
  );
};

/** Through traders, not conquest; only 1 in 5 Muslims live in the Middle East and North Africa. */
const SEA_ROUTE: LL[] = [[49, 24], [45.5, 13.5], [58, 16], [72, 16], L.calicut, [80.5, 6.5], [92, 6], [98, 4.6], L.malacca, [105, -2], L.jakarta];
const Traders: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('And Islam got');
  const real = hasFile(IMG.istiqlal);
  const one = t.at('1 in 5');
  const fills: Fill[] = [{id: K.indonesia, at: a, color: PAL.coral, opacity: 0.8}, ...ARABIA.map((id) => ({id, at: a, color: PAL.cream, opacity: 0.25}))];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap x={100} y={110} w={real ? 860 : 1060} h={520} frame keys={[{f: a, lon: 80, lat: 8, z: 2.15}]} fills={fills}>
        {(S) => {
          const pts = SEA_ROUTE.map((ll) => S(ll));
          return <Route pts={pts} at={t.at('traders') - 2} dur={24} />;
        }}
      </WorldMap>
      {real && <PhotoCard src={IMG.istiqlal} x={1040} y={110} w={780} h={520} rot={2} at={a + 2} filter={MUTED} />}
      {!real && <Note text="Indian Ocean trade routes" x={1220} y={150} size={46} rot={-3} at={a - 3} color={WHITE} />}
      <Note text="mostly through traders," x={real ? 110 : 1220} y={real ? 660 : 260} size={50} rot={-3} at={t.at('traders') - 3} />
      <Note text="not conquest" x={real ? 790 : 1220} y={real ? 660 : 360} size={50} rot={-3} at={t.at('conquest') - 3} color={PAL.coral} />
      <Stamp text="1 in 5" x={110} y={770} size={120} at={one} color={PAL.coral} />
      <Note text="Muslims live in the Middle East + North Africa" x={110} y={915} size={40} rot={-2} at={t.at('Middle East') - 3} color={WHITE} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Person key={i} x={1330 + i * 115} y={990} h={180} hat={false} color={i === 0 ? PAL.coral : 'rgba(244,239,230,0.75)'} at={one + 2 + i * 2} />
      ))}
      <Loop cx={1330} cy={900} rx={70} ry={120} at={t.at('Middle East')} seed={41} tilt={-4} color={pal.mark} />
      <Tag text={real ? credit(IMG.istiqlal, 'Istiqlal Mosque, Jakarta') : 'Route simplified · Pew Research Center estimates · Map: Natural Earth'} x={real ? 44 : 44} y={1040} />
    </AbsoluteFill>
  );
};

/** The hajj: pilgrims converge on Mecca from Indonesia, Nigeria and Michigan. */
const Hajj: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('And every year');
  const pal = usePal();
  const from = [
    {ll: L.jakarta, word: 'Indonesia', nth: 2, label: 'Indonesia', bow: -80, dx: 0, dy: 50, align: 'center' as const},
    {ll: L.kano, word: 'Nigeria', nth: 1, label: 'Nigeria', bow: 50, dx: 0, dy: 50, align: 'center' as const},
    {ll: L.detroit, word: 'Michigan', nth: 1, label: 'Michigan', bow: 140, dx: 0, dy: -50, align: 'center' as const},
  ];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 18, lat: 18, z: 1.3}, {f: t.at('Many men'), lon: 20, lat: 18, z: 1.36}]} fills={[{id: K.saudi, at: a, color: PAL.cream, opacity: 0.2}]}>
        {(S) => {
          const [mx, my] = S(L.mecca);
          return (
            <>
              {from.map((f) => {
                const [x, y] = S(f.ll);
                const at = t.at(f.word, f.nth);
                return (
                  <React.Fragment key={f.label}>
                    <Dot x={x} y={y} at={at} r={9} color={pal.mark} ring={false} />
                    <MapLabel text={f.label} x={x + f.dx} y={y + f.dy} at={at + 2} align={f.align} size={32} />
                    <Arrow x1={x} y1={y} x2={mx + (x < mx ? -14 : 14)} y2={my + 6} bow={f.bow} at={at + 2} dur={10} />
                  </React.Fragment>
                );
              })}
              <Dot x={mx} y={my} at={t.at('travel')} r={14} color={PAL.coral} />
              <MapLabel text="Mecca" x={mx + 30} y={my - 44} at={t.at('travel') + 2} size={38} color={PAL.coral} />
            </>
          );
        }}
      </WorldMap>
      <Note text="every year" x={100} y={50} size={52} rot={-3} at={a - 3} color={WHITE} />
      <Stamp text="NEARLY 2 MILLION" x={100} y={140} size={100} at={t.at('nearly 2')} color={PAL.cream} />
      <Highlight text="HAJJ" x={100} y={800} size={110} at={t.at('hajj')} seed={418} rot={-2} />
      <Tag text="Hajj figures: Saudi statistics authority · Map: Natural Earth" x={1150} />
    </AbsoluteFill>
  );
};

/** Same plain white cloth: everyone stands equal. The Kaaba crowd photo if present, else two drawn pilgrims. */
const Equal: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Many men');
  const pal = usePal();
  const src = hasFile(IMG.kaaba) ? IMG.kaaba : hasFile(IMG.hajjKaaba) ? IMG.hajjKaaba : null;
  const text = (
    <>
      <Highlight text="HAJJ" x={100} y={70} size={100} at={t.at('hajj')} seed={418} rot={-2} />
      <Definition term="hajj" def="the pilgrimage to Mecca that Muslims are asked to make once in life, if able" at={t.at('hajj') + 9} x={110} y={220} w={1000} />
    </>
  );
  if (src) {
    return (
      <FullBleed src={src} a={a} b={a + 300} bw={MUTED} vignette={0.7}>
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0) 55%), linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 30%)'}} />
        {text}
        <Note text="the same plain white cloth" x={110} y={420} size={52} rot={-3} at={t.at('plain') - 3} />
        <Note text="a billionaire? a farmer? you can't tell" x={110} y={860} size={48} rot={-2} at={t.at('billionaire') - 3} color={WHITE} />
        <Note text="everyone stands equal" x={1200} y={740} size={60} rot={-3} at={t.at('Everyone') - 3} color={pal.subject} />
        <Tag text={credit(src, 'Pilgrims at the Kaaba, Mecca')} x={44} y={1040} />
      </FullBleed>
    );
  }
  return (
    <AbsoluteFill>
      <DarkPaper />
      {text}
      <Note text="many men wear the same" x={110} y={440} size={50} rot={-3} at={a - 3} color={WHITE} />
      <Note text="2 pieces of plain white cloth" x={110} y={540} size={50} rot={-3} at={t.at('plain') - 3} />
      <Person x={1300} y={900} h={420} hat={false} color={PAL.cream} at={t.at('billionaire') - 2} />
      <Person x={1660} y={900} h={420} hat={false} color={PAL.cream} at={t.at('farmer') - 2} />
      <MapLabel text="billionaire" x={1300} y={950} at={t.at('billionaire')} align="center" size={32} />
      <MapLabel text="farmer" x={1660} y={950} at={t.at('farmer')} align="center" size={32} />
      <Stamp text="=" x={1450} y={600} size={140} at={t.at('farmer') + 4} color={PAL.teal} />
      <Note text="everyone stands equal" x={110} y={780} size={62} rot={-3} at={t.at('Everyone') - 3} color={pal.subject} />
      <Tag text="Drawn figures: pilgrims in the plain white ihram" />
    </AbsoluteFill>
  );
};

// ---------- the chapter ----------

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Hearth t={t} />],
    [at('Those revelations') - 1, <Quran t={t} />],
    [at('Islam is a') - 1, <Universal t={t} />],
    [at('And it spread') - 1, <Expansion t={t} />],
    [at('But a huge') - 1, <Caravan t={t} />],
    [at('and sailed') - 1, <Port t={t} />],
    [at('One famous') - 1, <Mansa t={t} />],
    [at('In thirteen') - 1, <Pilgrimage t={t} />],
    [at('Trade brought') - 1, <Timbuktu t={t} />],
    [at('Islam has two') - 1, <Branches t={t} />],
    [at('Muslim life') - 1, <Pillars t={t} />],
    [at('The five daily') - 1, <Prayer t={t} />],
    [at('In much') - 1, <CallApp t={t} />],
    [at('During the month') - 1, <Ramadan t={t} />],
    [at('At sunset') - 1, <Iftar t={t} />],
    [at('When Ramadan') - 1, <EidHalal t={t} />],
    [at('Now back') - 1, <Puzzle t={t} />],
    [at('And Islam got') - 1, <Traders t={t} />],
    [at('And every year') - 1, <Hajj t={t} />],
    [at('Many men') - 1, <Equal t={t} />],
  ];
  const scene = useScene(cuts);
  // stamps on every Highlight / Stamp; marker under every Note (3 frames early); ticks on pins, cards and arrows
  const stamps = [at('600s'), at('Quran'), at('Allah'), at('universalizing'), at('2 billion'), at('hierarchical'), at('trade'), at('contagious'), at('Mansa'),
    at('thirteen'), at('Timbuktu'), at('Sunni'), at('Shia'), at('Five Pillars'), at('Ramadan', 2), at('iftar'), at('Eid'), at('halal'), at('Indonesia'), at('240'),
    at('1 in 5'), at('nearly 2'), at('hajj')];
  const notes = [at('trading'), at('merchant'), at('revelations'), at('became'), at('line'), at('Arabic'), at('second'), at('fastest'), at('Within'), at('100'),
    at('rulers'), at('armies'), at('merchants'), at('Sahara'), at('Indian'), at('monsoon'), at('port after'), at('local'), at('adopted') + 7, at('One famous'), at('ruler'),
    at('richest'), at('pilgrimage'), at('loaded'), at('crashed'), at('Trade brought'), at('embraced'), at('learning'), at('Islam has two'), at('declaring') + 7,
    at('praying') + 7, at('giving') + 7, at('fasting') + 7, at('making') + 7, at('able'), at('The five daily'), at('set times'), at('always'), at('In much'), at('call'),
    at('apps'), at("don't eat"), at('not even'), at('Picture'), at('football'), at('At sunset'), at('dates'), at('When Ramadan'), at('clothes'), at('gifts'), at('food'),
    at('Muslims also'), at('Now back'), at('Which'), at('240') + 15, at('traders'), at('conquest'), at('Middle East'), at('And every year'), at('plain'), at('billionaire'),
    at('Everyone')];
  const ticks = [at('Mecca'), at('Arabian') + 8, at('Abraham'), at('Moses'), at('Jesus'), at('final'), at('Spain'), at('Central'), at('Mali'), at('Mecca', 2), at('Cairo'),
    at('declaring'), at('praying'), at('giving'), at('fasting'), at('making'), at('point'), at('water') + 4, at('pork'), at('alcohol'), at('Arabia'), at('Egypt') + 2,
    at('Indonesia', 2), at('Nigeria'), at('Michigan'), at('travel'), at('farmer') + 4];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={'w' + i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {stamps.map((f, i) => <Sfx key={'s' + i} at={f} src="sfx/stamp.wav" volume={0.27} />)}
      {notes.map((f, i) => <Sfx key={'n' + i} at={f - 3} src={WRITE.src} volume={WRITE.volume} />)}
      {ticks.map((f, i) => <Sfx key={'t' + i} at={f} src="sfx/tick.wav" volume={0.4} />)}
    </AbsoluteFill>
  );
};

export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch04_islam.wav" lead={LEAD} music={[{src: 'music/j_intrigue.mp3', volume: 0.18}]}>
    <Body />
  </ChapterShell>
);
