// Chapter 2 · The religion that was scattered (Judaism): the eastern-Mediterranean hearth, about 4,000 years, the Torah,
// an ethnic religion of about 15 million (Israel and the US the two big circles), the diaspora as a run of forced moves
// (586 BCE Babylon, 70 CE Rome, 1492 Spain, 1880s-1920s to the US, 1948 Israel) = relocation diffusion and "scattered dots",
// Shabbat, kosher, bar / bat mitzvah, the four communities (Ashkenazi, Sephardic, Mizrahi, Beta Israel), Operation Solomon.
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import words from '../../public/audio/ch02_judaism.words.json';
import credits from '../../public/img/credits.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, CropCard, Definition, fill, hasFile, LEAD, makeTimeline, type Narration, PhotoCard, Stamp, type TL, useScene} from '../kit/shell';
import {PAL} from '../kit/look';
import {Dot, type Fill, MapLabel, type ToScreen, WorldMap} from '../kit/asia';
import type {Place} from '../kit/Kit';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);

/** Modern photos stay in colour, muted so the teal and coral marks read on top. */
const MUTED = 'saturate(0.55) contrast(1.08) brightness(0.82)';
/** Paintings and archival photos: black and white, contrast up. */
const PAINT = 'grayscale(1) contrast(1.2) brightness(0.88)';
const WHITE = '#ffffff';

// ---------- images (planned files arrive later; every scene has a drawn or map fallback) ----------

const IMG = {
  wallCrowd: 'img/ch01/western_wall_crowd.jpg',
  tissot: 'img/ch02/tissot_exile.jpg',
  arch: 'img/ch02/arch_titus.jpg',
  expulsion: 'img/ch02/expulsion_1492.jpg',
  boy: 'img/ch02/immigrant_boy.jpg',
  inspection: 'img/ch02/ellis_island_inspection.jpg',
  shabbat: 'img/ch02/shabbat.jpg',
  barMitzvah: 'img/ch02/bar_mitzvah.jpg',
  bagel: 'img/ch02/bagel.jpg',
  beta: 'img/ch02/beta_israel_portrait.jpg',
  solomon: 'img/ch02/operation_solomon.jpg',
};
// TODO size: planned files, sizes guessed from the Commons originals scaled to 1920 wide. The picture is drawn with
// objectFit 'cover' inside this box, so a wrong guess never stretches it; it only nudges the framing and the loop.
const EXPULSION_SIZE: [number, number] = [1920, 2147]; // TODO size (Sala 2729 x 3051)
const BAR_MITZVAH_SIZE: [number, number] = [1920, 1276]; // TODO size (Michael's Bar Mitzvah 6, 2500 x 1662)

type Credit = {title: string; artist: string; licence: string};
const CREDITS = credits as unknown as Record<string, Credit>;
/** Source tag from public/img/credits.json when the file's entry exists, else the planned credit. */
const cred = (src: string, fallback: string) => {
  const c = CREDITS[src.replace(/^img\//, '')];
  if (!c) return fallback;
  const title = c.title.replace(/^File:/, '').replace(/\.(jpe?g|png|tiff?)$/i, '').replace(/_/g, ' ');
  const s = `${title} · ${c.artist}, ${c.licence}, via Wikimedia Commons`;
  return s.length > 150 ? s.slice(0, 147) + '...' : s;
};

/** Places used in this chapter, [lon, lat]. */
const L = {
  jerusalem: [35.23, 31.78] as [number, number],
  babylon: [44.42, 32.54] as [number, number],
  rome: [12.5, 41.9] as [number, number],
  toledo: [-4.0, 39.9] as [number, number],
  fez: [-5.0, 34.03] as [number, number],
  istanbul: [28.98, 41.0] as [number, number],
  amsterdam: [4.9, 52.37] as [number, number],
  thessaloniki: [22.94, 40.64] as [number, number],
  newYork: [-74.0, 40.7] as [number, number],
  pale: [27.5, 52.5] as [number, number],
  telAviv: [34.8, 32.1] as [number, number],
  addis: [38.75, 9.03] as [number, number],
  gondar: [37.47, 12.6] as [number, number],
  baghdad: [44.36, 33.3] as [number, number],
  sanaa: [44.2, 15.35] as [number, number],
  casablanca: [-7.6, 33.6] as [number, number],
  paris: [2.35, 48.86] as [number, number],
};

const ISRAEL = '376';
const ASHKENAZ = ['616', '804', '112', '440', '428', '276', '348', '642', '203', '040', '498', '703'];
const SEPHARAD = ['724', '620'];
const MIZRAH = ['368', '364', '887', '760', '504', '012', '788', '434', '818', '422'];
const ETHIOPIA = '231';

/** Jewish population, millions (rounded; DellaPergola, American Jewish Year Book 2023). */
const POP: {ll: [number, number]; m: number; big?: string}[] = [
  {ll: [34.9, 31.6], m: 7.2, big: 'ISRAEL · ABOUT 7M'},
  {ll: [-96, 39], m: 6.3, big: 'U.S. · ABOUT 6M'},
  {ll: [2.4, 46.6], m: 0.44}, {ll: [-79.4, 45.5], m: 0.4}, {ll: [-1.5, 52.6], m: 0.29}, {ll: [-63.6, -34.6], m: 0.17},
  {ll: [37.6, 55.8], m: 0.13}, {ll: [10.4, 51.2], m: 0.12}, {ll: [145, -35], m: 0.12}, {ll: [-47, -20], m: 0.09},
  {ll: [26, -28.5], m: 0.05}, {ll: [-99.1, 19.4], m: 0.04}, {ll: [19.0, 47.5], m: 0.045}, {ll: [30.5, 50.4], m: 0.03},
  {ll: [-56.2, -34.9], m: 0.012}, {ll: [174.8, -41.3], m: 0.007}, {ll: [-70.6, -33.4], m: 0.018}, {ll: [-7.6, 33.6], m: 0.002},
];

// ---------- small drawn pieces ----------

/** Pops in like a card on the desk. */
const usePop = (at: number) => {
  const g = useGFrame();
  const k = interpolate(g, [at, at + 5], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) * (1 - 2.2 * t * (1 - t))});
  return {show: g >= at, style: {transform: `scale(${0.6 + 0.4 * k})`, opacity: Math.min(1, k * 2)} as React.CSSProperties};
};

/** A full-frame svg layer for line drawings. */
const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none'}}>{children}</svg>
);

/** A path that draws on from `at` over `dur` frames. */
const Stroke: React.FC<{d: string; at: number; dur?: number; color?: string; w?: number; fillC?: string; op?: number}> = ({d, at, dur = 10, color = PAL.teal, w = 6, fillC, op = 1}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  return (
    <>
      {fillC && <path d={d} fill={fillC} opacity={interpolate(g, [at + dur * 0.6, at + dur + 4], [0, 1], clamp)} />}
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={op}
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </>
  );
};

/** A coral X drawn in two strokes over a box. */
const CoralX: React.FC<{x: number; y: number; w: number; h: number; at: number; width?: number}> = ({x, y, w, h, at, width = 12}) => (
  <Svg>
    <Stroke d={`M${x},${y} L${x + w},${y + h}`} at={at} dur={4} color={PAL.coral} w={width} />
    <Stroke d={`M${x},${y + h} L${x + w},${y}`} at={at + 4} dur={4} color={PAL.coral} w={width} />
  </Svg>
);

/** A Torah scroll: two rollers with knobs, the parchment between with columns of ruled lines. */
const TorahScroll: React.FC<{x: number; y: number; w: number; h: number; at: number}> = ({x, y, w, h, at}) => {
  const rw = w * 0.07;
  const roller = (cx: number) => `M${cx - rw / 2},${y + 30} L${cx + rw / 2},${y + 30} L${cx + rw / 2},${y + h - 30} L${cx - rw / 2},${y + h - 30} Z`;
  const knob = (cx: number, top: boolean) => top ? `M${cx},${y + 30} L${cx},${y - 10} M${cx - rw * 0.7},${y - 10} L${cx + rw * 0.7},${y - 10}` : `M${cx},${y + h - 30} L${cx},${y + h + 20} M${cx - rw * 0.7},${y + h + 20} L${cx + rw * 0.7},${y + h + 20}`;
  const lx = x + rw, rx = x + w - rw;
  const sheet = `M${lx},${y + 40} L${rx},${y + 40} L${rx},${y + h - 40} L${lx},${y + h - 40} Z`;
  const cols = 3, cw = (rx - lx) / cols;
  const lines: string[] = [];
  for (let c = 0; c < cols; c++) for (let r = 0; r < 9; r++) {
    const yy = y + 80 + r * ((h - 160) / 8);
    const len = cw * (0.62 + ((r * 7 + c * 3) % 5) * 0.05);
    lines.push(`M${lx + c * cw + cw * 0.12},${yy} L${lx + c * cw + cw * 0.12 + len},${yy}`);
  }
  return (
    <Svg>
      <Stroke d={sheet} at={at} dur={10} color={PAL.cream} w={4} fillC="rgba(244,239,230,0.07)" />
      {[x + rw / 2, x + w - rw / 2].map((cx, i) => (
        <React.Fragment key={i}>
          <Stroke d={roller(cx)} at={at + 2} dur={8} w={6} fillC="rgba(47,224,196,0.12)" />
          <Stroke d={knob(cx, true)} at={at + 8} dur={4} w={6} />
          <Stroke d={knob(cx, false)} at={at + 8} dur={4} w={6} />
        </React.Fragment>
      ))}
      {lines.map((d, i) => <Stroke key={i} d={d} at={at + 10 + (i % 9)} dur={4} color={PAL.cream} w={3} op={0.45} />)}
    </Svg>
  );
};

/** The Shabbat table: two candles with flames, a braided challah, a cup, the table edge. */
const ShabbatTable: React.FC<{x: number; y: number; at: number; candlesAt: number; challahAt: number}> = ({x, y, at, candlesAt, challahAt}) => {
  const g = useGFrame();
  const flicker = 1 + 0.06 * Math.sin(g / 2.2);
  const candle = (cx: number) => `M${cx - 18},${y + 260} L${cx - 18},${y + 80} L${cx + 18},${y + 80} L${cx + 18},${y + 260}`;
  const base = (cx: number) => `M${cx - 50},${y + 300} L${cx + 50},${y + 300} L${cx + 30},${y + 260} L${cx - 30},${y + 260} Z`;
  const braid = Array.from({length: 5}, (_, i) => {
    const bx = x + 330 + i * 78, by = y + 300 - Math.sin((i / 4) * Math.PI) * 18, rx = 52 - Math.abs(i - 2) * 5, ry = 44 - Math.abs(i - 2) * 4;
    return `M${bx - rx},${by} A${rx},${ry} 0 1,1 ${bx + rx},${by} A${rx},${ry} 0 1,1 ${bx - rx},${by}`;
  });
  return (
    <Svg>
      <Stroke d={`M${x - 40},${y + 380} L${x + 860},${y + 380} M${x - 10},${y + 380} L${x + 30},${y + 520} M${x + 810},${y + 380} L${x + 770},${y + 520}`} at={at} dur={10} color={PAL.cream} w={5} op={0.7} />
      {[x + 90, x + 210].map((cx, i) => (
        <React.Fragment key={cx}>
          <Stroke d={base(cx)} at={candlesAt + i * 2} dur={6} w={6} />
          <Stroke d={candle(cx)} at={candlesAt + i * 2} dur={6} color={PAL.cream} w={6} fillC="rgba(244,239,230,0.12)" />
          {g >= candlesAt + 6 + i * 2 && (
            <g transform={`translate(${cx},${y + 72}) scale(1,${flicker})`}>
              <ellipse cx={0} cy={-30} rx={34} ry={44} fill={PAL.orange} opacity={0.18} />
              <path d="M0,-62 C14,-40 18,-20 0,0 C-18,-20 -14,-40 0,-62 Z" fill={PAL.orange} stroke="#111" strokeWidth={2} />
            </g>
          )}
        </React.Fragment>
      ))}
      {braid.map((d, i) => <Stroke key={i} d={d} at={challahAt + i * 2} dur={6} color={PAL.orange} w={6} fillC="rgba(255,159,28,0.16)" />)}
      <Stroke d={`M${x + 730},${y + 190} L${x + 810},${y + 190} L${x + 795},${y + 270} L${x + 745},${y + 270} Z M${x + 770},${y + 270} L${x + 770},${y + 330} M${x + 740},${y + 340} L${x + 800},${y + 340}`}
        at={at + 6} dur={10} w={6} />
    </Svg>
  );
};

/** A plain drawn cheeseburger (no logos). */
const Burger: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const w = 460;
  const zig = Array.from({length: 13}, (_, i) => `${i ? 'L' : 'M'}${x + 10 + (i * (w - 20)) / 12},${y + 210 + (i % 2) * 34}`).join(' ');
  return (
    <Svg>
      <Stroke d={`M${x},${y + 170} C${x},${y + 20} ${x + w},${y + 20} ${x + w},${y + 170} Z`} at={at} dur={8} color={PAL.cream} w={6} fillC="rgba(255,159,28,0.14)" />
      {[[120, 100], [210, 70], [300, 95], [380, 125], [170, 135], [270, 135]].map(([sx, sy], i) => <Stroke key={i} d={`M${x + sx - 8},${y + sy} L${x + sx + 8},${y + sy - 4}`} at={at + 6} dur={2} color={PAL.cream} w={5} />)}
      <Stroke d={`M${x - 10},${y + 200} L${x + w + 10},${y + 200} ${zig.replace(/^M/, 'L')} Z`} at={at + 3} dur={8} color={PAL.orange} w={5} fillC="rgba(255,159,28,0.35)" />
      <Stroke d={`M${x + 4},${y + 236} L${x + w - 4},${y + 236} Q${x + w + 14},${y + 266} ${x + w - 4},${y + 296} L${x + 4},${y + 296} Q${x - 14},${y + 266} ${x + 4},${y + 236} Z`} at={at + 5} dur={8} color={PAL.cream} w={6} fillC="rgba(120,70,40,0.55)" />
      <Stroke d={`M${x},${y + 316} L${x + w},${y + 316} C${x + w},${y + 380} ${x},${y + 380} ${x},${y + 316} Z`} at={at + 7} dur={8} color={PAL.cream} w={6} fillC="rgba(255,159,28,0.14)" />
    </Svg>
  );
};

/** A drawn poppy-seed bagel on a cream card (fallback for the bagel photo). */
const DrawnBagel: React.FC<{x: number; y: number; w: number; h: number; at: number}> = ({x, y, w, h, at}) => {
  const {show, style} = usePop(at);
  if (!show) return null;
  const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.38;
  const seeds = Array.from({length: 26}, (_, i) => {
    const a = i * 2.4, r = R * (0.62 + ((i * 37) % 10) * 0.035);
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.82];
  });
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, ...style, rotate: '-3deg', background: 'rgba(16,14,11,0.92)', border: `4px solid ${PAL.teal}`, borderRadius: 8,
      boxShadow: '0 16px 30px rgba(0,0,0,0.6)'}}>
      <svg width={w} height={h}>
        <ellipse cx={cx} cy={cy} rx={R} ry={R * 0.82} fill="rgba(255,159,28,0.35)" stroke={PAL.cream} strokeWidth={5} />
        <ellipse cx={cx} cy={cy} rx={R * 0.3} ry={R * 0.22} fill="#16140f" stroke={PAL.cream} strokeWidth={5} />
        {seeds.map(([sx, sy], i) => <circle key={i} cx={sx} cy={sy} r={3.5} fill="#111" />)}
      </svg>
    </div>
  );
};

/** A plane in profile, teal line drawing. */
const Plane: React.FC<{x: number; y: number; s: number; at: number}> = ({x, y, s, at}) => {
  const P = (pts: number[][]) => pts.map(([px, py], i) => `${i ? 'L' : 'M'}${x + px * s},${y + py * s}`).join(' ');
  const body = `M${x},${y + 40 * s} Q${x - 30 * s},${y + 60 * s} ${x},${y + 80 * s} L${x + 560 * s},${y + 80 * s} Q${x + 640 * s},${y + 70 * s} ${x + 660 * s},${y + 50 * s} Q${x + 620 * s},${y + 34 * s} ${x + 560 * s},${y + 30 * s} L${x + 40 * s},${y + 30 * s} Q${x + 10 * s},${y + 30 * s} ${x},${y + 40 * s} Z`;
  const windows = Array.from({length: 12}, (_, i) => `M${x + (120 + i * 34) * s},${y + 48 * s} L${x + (132 + i * 34) * s},${y + 48 * s}`);
  return (
    <Svg>
      <Stroke d={body} at={at} dur={10} w={6} fillC="rgba(47,224,196,0.08)" />
      <Stroke d={P([[40, 30], [0, -60], [50, -60], [130, 30]])} at={at + 6} dur={6} w={6} />
      <Stroke d={P([[250, 70], [380, 170], [440, 170], [360, 70]])} at={at + 8} dur={6} w={6} />
      <Stroke d={P([[30, 74], [-10, 110], [30, 110], [90, 76]])} at={at + 10} dur={5} w={6} />
      {windows.map((d, i) => <Stroke key={i} d={d} at={at + 12 + i} dur={2} color={PAL.cream} w={7} />)}
    </Svg>
  );
};

/** A full-bleed picture with a slow push, drawn with objectFit 'cover' so a guessed size never stretches it. */
const Pic: React.FC<{src: string; size: [number, number]; fx: number; fy: number; z0?: number; z1?: number; a: number; b: number; bw?: string; vignette?: number;
  children?: (p: Place) => React.ReactNode}> = ({src, size, fx, fy, z0 = 1.02, z1 = 1.1, a, b, bw = PAINT, vignette = 0.65, children}) => {
  const g = useGFrame();
  const place = fill(size, fx, fy, interpolate(g, [a, b], [z0, z1], clamp));
  return (
    <AbsoluteFill style={{background: '#111', overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', left: place.left, top: place.top, width: size[0] * place.scale, height: size[1] * place.scale, objectFit: 'cover', filter: bw}} />
      {children?.(place)}
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,${vignette}) 100%)`}} />
    </AbsoluteFill>
  );
};

/** A small mono caps caption on a dark strip (for cards). */
const Caption: React.FC<{text: string; x: number; y: number; at: number; color?: string}> = ({text, x, y, at, color = PAL.cream}) => {
  const g = useGFrame();
  if (g < at) return null;
  return <div style={{position: 'absolute', left: x, top: y, fontFamily: JF.mono, fontSize: 24, letterSpacing: 2, textTransform: 'uppercase', color, whiteSpace: 'nowrap',
    background: 'rgba(10,10,10,0.8)', padding: '6px 12px', opacity: interpolate(g, [at, at + 4], [0, 1], clamp)}}>{text}</div>;
};

/** Community dots on a world map: circle area by population; the two big ones in coral with labels. */
const PopDots: React.FC<{S: ToScreen; at: number; bigAt?: number[]; k?: number; plain?: boolean}> = ({S, at, bigAt = [], k = 26, plain = false}) => {
  const g = useGFrame();
  let small = 0;
  return (
    <Svg>
      {POP.map((p, i) => {
        const [x, y] = S(p.ll);
        const start = p.big && !plain ? bigAt[i] ?? at : at + (small++) * 2;
        if (g < start) return null;
        const s = interpolate(g, [start, start + 4, start + 7], [0, 1.25, 1], clamp);
        const r = Math.max(6, k * Math.sqrt(p.m)) * s;
        const big = !!p.big && !plain;
        return <circle key={i} cx={x} cy={y} r={r} fill={big ? PAL.coral : PAL.teal} fillOpacity={big ? 0.7 : 0.85} stroke={big ? PAL.coral : '#111'} strokeWidth={big ? 4 : 2} />;
      })}
    </Svg>
  );
};

// ---------- scenes ----------

/** The hearth: the eastern Mediterranean, Israel in coral, Jerusalem pinned. */
const Hearth: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const fills: Fill[] = [{id: ISRAEL, at: t.at('Israel'), color: PAL.coral, opacity: 0.75}];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: 0, lon: 28, lat: 33, z: 2.4}, {f: t.at('eastern') + 4, lon: 33.5, lat: 32.5, z: 6.4}, {f: t.at('Its central'), lon: 34, lat: 32.2, z: 6.8}]} fills={fills}>
        {(S) => {
          const [jx, jy] = S(L.jerusalem);
          const [mx, my] = S([30.5, 33.6]);
          const [ix, iy] = S([34.7, 30.6]);
          return (
            <>
              <MapLabel text="Mediterranean Sea" x={mx} y={my} at={t.at('Mediterranean')} align="center" color={PAL.teal} size={30} />
              <Loop cx={jx - 40} cy={jy - 10} rx={300} ry={230} at={t.at('land')} seed={201} tilt={-10} color={pal.mark} />
              <Dot x={jx} y={jy} at={t.at('Israel') + 4} r={11} color={pal.subject} />
              <MapLabel text="Jerusalem" x={jx + 36} y={jy + 6} at={t.at('Israel') + 6} size={28} />
              <MapLabel text="Israel" x={ix - 30} y={iy + 40} at={t.at('Israel') + 2} align="right" size={30} color={PAL.coral} />
            </>
          );
        }}
      </WorldMap>
      <Highlight text="JUDAISM" x={100} y={90} size={100} at={t.at('Judaism')} seed={201} rot={-2} />
      <Note text="the oldest of the three" x={110} y={250} size={48} rot={-3} at={t.at('oldest') - 3} color={WHITE} />
      <Note text="about 4,000 years" x={110} y={350} size={52} rot={-3} at={t.at('4,000') - 3} />
      <Note text="one of the first to worship a single God" x={110} y={900} size={48} rot={-2} at={t.at('single') - 3} color={pal.subject} />
      <Tag text="Map: Natural Earth" x={1500} />
    </AbsoluteFill>
  );
};

/** The Torah: a drawn scroll and the five books. */
const BOOKS = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'];
const Torah: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('Its central');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="its central text" x={110} y={70} size={52} rot={-3} at={a} color={WHITE} />
      <Highlight text="TORAH" x={100} y={180} size={110} at={t.at('Torah')} seed={202} rot={-2} />
      <Definition term="Torah" def="the first five books of the Hebrew Bible; Judaism's central text" at={t.at('Torah') + 9} x={110} y={360} w={820} />
      {BOOKS.map((b, i) => {
        const at = t.at('five') + i * 3;
        if (g < at) return null;
        return (
          <div key={b} style={{position: 'absolute', left: 130, top: 560 + i * 78, fontFamily: JF.mono, fontSize: 34, letterSpacing: 3, textTransform: 'uppercase', color: PAL.cream, whiteSpace: 'nowrap',
            opacity: interpolate(g, [at, at + 4], [0, 1], clamp)}}>
            <span style={{color: PAL.teal}}>{i + 1}</span>&nbsp;&nbsp;{b}
          </div>
        );
      })}
      <TorahScroll x={1040} y={200} w={760} h={620} at={a + 4} />
      <Note text="handwritten on a scroll" x={1120} y={890} size={46} rot={-3} at={t.at('Hebrew') - 3} />
      <Tag text="Drawn Torah scroll, simplified" />
    </AbsoluteFill>
  );
};

/** Ethnic religion, over the Western Wall plaza. */
const Ethnic: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Judaism', 2);
  return (
    <Pic src={IMG.wallCrowd} size={[1920, 1280]} fx={960} fy={640} z0={1.02} z1={1.08} a={a} b={t.at("It's also")} bw={MUTED} vignette={0.6}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0) 75%)'}} />
          <Highlight text="ETHNIC RELIGION" x={100} y={90} size={92} at={t.at('ethnic')} seed={203} rot={-2} />
          <Definition term="ethnic religion" def="a religion tied to one people, their shared history and their homeland; it rarely seeks converts" at={t.at('ethnic') + 9} x={110} y={250} w={1000} />
          <Note text="a people + a shared history" x={120} y={470} size={52} rot={-3} at={t.at('tied') - 3} />
          <Note text="not just a set of beliefs" x={120} y={580} size={52} rot={-3} at={t.at('not just') - 3} color={WHITE} />
          <Note text="doesn't seek converts" x={1180} y={500} size={54} rot={-3} at={t.at("doesn't seek") - 3} color={pal.subject} />
          <Tag text="Prayers at the Western Wall, Jerusalem · Askii, CC BY-SA 3.0, via Wikimedia Commons" />
        </>
      )}
    </Pic>
  );
};

/** About 15 million: Israel and the US are the two big circles; then dots on nearly every continent. */
const Fifteen: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at("It's also");
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: -40, lat: 36, z: 1.3}, {f: t.at('look'), lon: -40, lat: 36, z: 1.3}, {f: t.at('look') + 30, lon: -10, lat: 26, z: 1.04}]}>
        {(S) => {
          const [ix, iy] = S(POP[0].ll);
          const [ux, uy] = S(POP[1].ll);
          return (
            <>
              <PopDots S={S} at={t.at('look') + 20} bigAt={[t.at('Israel', 2), t.at('United')]} />
              <MapLabel text={POP[0].big!} x={ix + 78} y={iy + 30} at={t.at('Israel', 2) + 4} size={28} color={PAL.coral} />
              <MapLabel text={POP[1].big!} x={ux} y={uy + 100} at={t.at('United') + 4} size={28} align="center" color={PAL.coral} />
            </>
          );
        }}
      </WorldMap>
      <Note text="it's also small:" x={100} y={50} size={52} rot={-3} at={t.at('small') - 3} color={WHITE} />
      <Stamp text="15 MILLION" x={100} y={150} size={120} at={t.at('15')} color={PAL.cream} />
      <Note text="Jews worldwide" x={110} y={290} size={48} rot={-3} at={t.at('people', 2) - 3} />
      <Note text="on nearly every continent..." x={1170} y={640} size={48} rot={-3} at={t.at('nearly') - 3} color={pal.subject} />
      <Note text="why?" x={1260} y={740} size={72} rot={-4} at={t.at('continent') - 3} color={pal.subject} />
      <Tag text="Circle size = Jewish population (DellaPergola, American Jewish Year Book 2023, rounded) · Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** Forced to leave: Babylon (586 BCE) and Rome (70 CE), with the Tissot and Arch of Titus cards when they arrive. */
const Exile: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Because');
  const tissot = hasFile(IMG.tissot);
  const arch = hasFile(IMG.arch);
  const tags = ['Map: Natural Earth', 'via Wikimedia Commons'];
  if (tissot) tags.unshift('The Flight of the Prisoners · James Tissot, public domain');
  if (arch) tags.unshift('Arch of Titus relief, Rome · public domain');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 30, lat: 34, z: 3.0}, {f: t.at('In fourteen'), lon: 29, lat: 34.5, z: 3.2}]} fills={[{id: ISRAEL, at: a, color: PAL.coral, opacity: 0.75}]}>
        {(S) => {
          const [jx, jy] = S(L.jerusalem);
          const [bx, by] = S(L.babylon);
          const [rx, ry] = S(L.rome);
          return (
            <>
              <Dot x={jx} y={jy} at={a} r={11} color={pal.subject} ring={false} />
              <MapLabel text="Jerusalem" x={jx - 26} y={jy + 40} at={a} align="right" size={26} />
              <Arrow x1={jx + 14} y1={jy - 10} x2={bx - 14} y2={by - 6} bow={-40} at={t.at('Babylonians')} dur={8} width={6} />
              <Dot x={bx} y={by} at={t.at('Babylonians') + 8} r={9} color={PAL.teal} ring={false} />
              <MapLabel text="Babylon" x={bx + 24} y={by + 6} at={t.at('Babylonians') + 6} size={28} color={PAL.teal} />
              <Arrow x1={jx - 14} y1={jy - 14} x2={rx + 14} y2={ry + 10} bow={60} at={t.at('Romans')} dur={8} width={6} />
              <Dot x={rx} y={ry} at={t.at('Romans') + 8} r={9} color={PAL.teal} ring={false} />
              <MapLabel text="Rome" x={rx - 24} y={ry - 34} at={t.at('Romans') + 6} align="right" size={28} color={PAL.teal} />
              <Note text="586 BCE" x={bx - 60} y={by - 150} size={60} rot={-3} at={t.at('Babylonians') + 4} color={WHITE} />
              <Note text="70 CE" x={rx - 40} y={ry + 40} size={60} rot={-3} at={t.at('70') - 3} color={WHITE} />
            </>
          );
        }}
      </WorldMap>
      <Note text="again and again, Jews were forced to leave" x={100} y={60} size={52} rot={-2} at={t.at('again') - 3} color={pal.subject} />
      {tissot && <PhotoCard src={IMG.tissot} x={1380} y={640} w={440} h={280} rot={3} at={t.at('exiled')} filter={PAINT} />}
      {tissot && <Caption text="exiled to Babylon" x={1400} y={960} at={t.at('exiled') + 4} />}
      {arch && <PhotoCard src={IMG.arch} x={110} y={640} w={480} h={268} rot={-3} at={t.at('Temple')} filter={PAINT} outline />}
      {arch && <Caption text="Romans carry off the Temple menorah" x={110} y={950} at={t.at('Temple') + 4} />}
      <Note text="the Temple destroyed" x={arch ? 650 : 160} y={arch ? 800 : 820} size={50} rot={-3} at={t.at('destroyed') - 3} />
      <Tag text={tags.join(' / ')} x={tissot || arch ? 44 : 1500} />
    </AbsoluteFill>
  );
};

/** 1492: Sala's painting when it arrives, else Iberia with the routes out. */
const Expulsion: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('In fourteen');
  const b = t.at('In the late');
  const text = (
    <>
      <Stamp text="1492" x={100} y={780} size={150} at={t.at('fourteen')} color={PAL.cream} />
      <Note text="Spain expels its entire Jewish population" x={110} y={940} size={50} rot={-2} at={t.at('expelled') - 3} color={pal.subject} />
    </>
  );
  if (hasFile(IMG.expulsion)) {
    return (
      <Pic src={IMG.expulsion} size={EXPULSION_SIZE} fx={960} fy={1000} z0={1.02} z1={1.08} a={a} b={b} bw={PAINT} vignette={0.6}>
        {(p) => {
          // the kneeling man pleading before the monarchs (Isaac Abravanel), about 30% across and 52% down the canvas
          const kx = p.left + EXPULSION_SIZE[0] * 0.3 * p.scale, ky = p.top + EXPULSION_SIZE[1] * 0.56 * p.scale;
          return (
            <>
              <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0) 45%)'}} />
              <Loop cx={kx} cy={ky} rx={215} ry={235} at={t.at('Spain') + 4} seed={204} tilt={-8} />
              <Note text="pleading with the king and queen" x={1140} y={830} size={42} rot={-3} at={t.at('Spain') + 8} color={WHITE} />
              {text}
              <Tag text={cred(IMG.expulsion, 'The Expulsion of the Jews from Spain · Emilio Sala, 1889, public domain, via Wikimedia Commons')} />
            </>
          );
        }}
      </Pic>
    );
  }
  const dests = [L.fez, L.amsterdam, L.istanbul, L.thessaloniki];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 10, lat: 41, z: 3.3}, {f: b, lon: 10, lat: 41, z: 3.5}]} fills={SEPHARAD.map((id) => ({id, at: t.at('Spain'), color: PAL.coral, opacity: 0.75}))}>
        {(S) => {
          const [sx, sy] = S(L.toledo);
          return (
            <>
              {dests.map((d, i) => {
                const [x, y] = S(d);
                return <Arrow key={i} x1={sx} y1={sy} x2={x} y2={y} bow={i % 2 ? -50 : 50} at={t.at('expelled') + i * 4} dur={8} width={5} />;
              })}
              <MapLabel text="Spain" x={sx} y={sy + 50} at={t.at('Spain')} align="center" size={30} color={PAL.coral} />
              {[['North Africa', L.fez, 0, 50], ['Amsterdam', L.amsterdam, 0, -40], ['Ottoman Empire', L.istanbul, 0, -40]].map(([n, ll, dx, dy], i) => {
                const [x, y] = S(ll as [number, number]);
                return <MapLabel key={i} text={n as string} x={x + (dx as number)} y={y + (dy as number)} at={t.at('expelled') + 8 + i * 4} align="center" size={26} />;
              })}
            </>
          );
        }}
      </WorldMap>
      {text}
      <Tag text="Main routes after the 1492 expulsion, simplified · Map: Natural Earth" x={1060} />
    </AbsoluteFill>
  );
};

/** 1880s-1920s: Eastern Europe to the United States, with the Ellis Island photos when they arrive. */
const Ellis: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('In the late');
  const boy = hasFile(IMG.boy);
  const insp = hasFile(IMG.inspection);
  const fills: Fill[] = [...['616', '804', '112', '440', '498'].map((id) => ({id, at: t.at('Eastern', 2), color: PAL.teal, opacity: 0.35})),
    {id: '840', at: t.at('United', 2) + 8, color: PAL.coral, opacity: 0.5}];
  const tags = ['Map: Natural Earth'];
  if (insp) tags.unshift(cred(IMG.inspection, 'Physicians examining Jewish immigrants, Ellis Island · Library of Congress, public domain'));
  if (boy) tags.unshift(cred(IMG.boy, 'A Russian Jewish boy just landed at Ellis Island · Popular Science Monthly, public domain'));
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: -22, lat: 42, z: 2.0}, {f: t.at('And after'), lon: -22, lat: 42, z: 2.1}]} fills={fills}>
        {(S) => {
          const [ex, ey] = S(L.pale);
          const [nx, ny] = S(L.newYork);
          return (
            <>
              <MapLabel text="Eastern Europe" x={ex} y={ey - 50} at={t.at('Eastern', 2) + 2} align="center" size={28} color={PAL.teal} />
              <Arrow x1={ex - 20} y1={ey} x2={nx + 18} y2={ny - 4} bow={-90} at={t.at('United', 2)} dur={10} width={6} color={pal.subject} />
              <Dot x={nx} y={ny} at={t.at('United', 2) + 10} r={10} color={pal.subject} />
              <MapLabel text="New York" x={nx} y={ny + 50} at={t.at('United', 2) + 10} align="center" size={28} color={PAL.coral} />
            </>
          );
        }}
      </WorldMap>
      <Note text="late 1800s - early 1900s" x={100} y={50} size={52} rot={-3} at={t.at('late') - 3} color={WHITE} />
      <Stamp text="2 MILLION+" x={100} y={150} size={110} at={t.at('two')} color={PAL.cream} />
      <Note text="fled poverty and violence" x={110} y={290} size={48} rot={-3} at={t.at('fled') - 3} />
      {boy && <PhotoCard src={IMG.boy} x={1080} y={560} w={270} h={400} rot={-3} at={t.at('Jews', 2)} filter={PAINT} pos="50% 35%" />}
      {insp && <PhotoCard src={IMG.inspection} x={1420} y={540} w={380} h={420} rot={2} at={t.at('poverty')} filter={PAINT} pos="50% 40%" />}
      {(boy || insp) && <Caption text="Ellis Island, New York" x={1180} y={990} at={t.at('poverty') + 4} />}
      <Tag text={tags.join(' / ')} x={boy || insp ? 44 : 1500} y={boy || insp ? 1030 : 1030} />
    </AbsoluteFill>
  );
};

/** After the Holocaust: many move to the new state of Israel, 1948. */
const Israel48: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('And after');
  const froms = [L.pale, L.paris, L.casablanca, L.baghdad, L.sanaa, [19.0, 47.5] as [number, number]];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 20, lat: 38, z: 2.6}, {f: t.at('This scattering'), lon: 22, lat: 37, z: 2.8}]} fills={[{id: ISRAEL, at: t.at('Israel', 3), color: PAL.coral, opacity: 0.85}]}>
        {(S) => {
          const [ix, iy] = S(L.jerusalem);
          return (
            <>
              {froms.map((f, i) => {
                const [x, y] = S(f);
                return <Arrow key={i} x1={x} y1={y} x2={ix + (x < ix ? -12 : 12)} y2={iy + (y < iy ? -12 : 12)} bow={i % 2 ? 30 : -30} at={t.at('moved') + i * 3} dur={8} width={5} />;
              })}
              <MapLabel text="Israel" x={ix + 40} y={iy + 30} at={t.at('Israel', 3) + 2} size={30} color={PAL.coral} />
            </>
          );
        }}
      </WorldMap>
      <Note text="after the Holocaust" x={100} y={60} size={52} rot={-3} at={t.at('Holocaust') - 3} color={WHITE} />
      <Note text="many moved to the new state of Israel" x={110} y={880} size={50} rot={-2} at={t.at('new state') - 3} />
      <Stamp text="1948" x={1480} y={110} size={150} at={t.at('1948')} color={pal.subject} />
      <Tag text="Arrows show some of the many origins, simplified · Map: Natural Earth" x={1060} />
    </AbsoluteFill>
  );
};

/** Diaspora + relocation diffusion, with the routes on a framed map. */
const Diaspora: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const g = useGFrame();
  const a = t.at('This scattering');
  const dests = [L.babylon, L.rome, L.toledo, L.pale, L.newYork, L.casablanca];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap x={1060} y={250} w={780} h={560} frame keys={[{f: a, lon: -15, lat: 38, z: 1.2}]} fills={[{id: ISRAEL, at: a, color: PAL.coral, opacity: 0.85}]}>
        {(S) => {
          const [jx, jy] = S(L.jerusalem);
          return (
            <>
              {dests.map((d, i) => {
                const [x, y] = S(d);
                return (
                  <svg key={i} width={780} height={560} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
                    {g >= a + i * 3 && <path d={`M${jx},${jy} Q${(jx + x) / 2},${Math.min(jy, y) - 60} ${x},${y}`} fill="none" stroke={PAL.teal} strokeWidth={4}
                      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - interpolate(g, [a + i * 3, a + i * 3 + 8], [0, 1], clamp)} />}
                    {g >= a + i * 3 + 8 && <circle cx={x} cy={y} r={7} fill={PAL.teal} stroke="#111" strokeWidth={2} />}
                  </svg>
                );
              })}
            </>
          );
        }}
      </WorldMap>
      <Highlight text="DIASPORA" x={100} y={100} size={100} at={t.at('diaspora')} seed={205} rot={-2} />
      <Definition term="diaspora" def="a people scattered far from their homeland, and the communities they build" at={t.at('diaspora') + 9} x={110} y={270} w={860} />
      <Highlight text="RELOCATION DIFFUSION" x={100} y={470} size={74} at={t.at('relocation')} seed={206} rot={-2} />
      <Definition term="relocation diffusion" def="a culture spreads because people move and carry it with them" at={t.at('relocation') + 9} x={110} y={600} w={860} />
      <Note text="much of it wasn't by choice" x={120} y={860} size={52} rot={-3} at={t.at('choice') - 3} color={pal.subject} />
      <Tag text="Routes simplified · Map: Natural Earth" x={1060} />
    </AbsoluteFill>
  );
};

/** Scattered dots, not one solid block. */
const Dots: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at("That's why");
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 10, lat: 8, z: 1.04}, {f: t.at('Wherever'), lon: 10, lat: 8, z: 1.1}]}>
        {(S) => <PopDots S={S} at={a} k={22} plain />}
      </WorldMap>
      <Note text="the map of Judaism:" x={100} y={50} size={52} rot={-3} at={t.at('map', 2) - 3} color={WHITE} />
      <Highlight text="SCATTERED DOTS" x={100} y={150} size={84} at={t.at('scattered')} seed={207} rot={-2} />
      <Note text="...not one solid block" x={110} y={900} size={54} rot={-2} at={t.at('instead') - 3} color={pal.subject} />
      <Tag text="Dots = Jewish communities (DellaPergola, 2023) · Map: Natural Earth" x={1080} />
    </AbsoluteFill>
  );
};

/** Shabbat: the photo when it arrives, else the drawn table. */
const Shabbat: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Wherever');
  const photo = hasFile(IMG.shabbat);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="wherever they landed, they carried their traditions" x={100} y={50} size={48} rot={-2} at={a - 3} color={WHITE} />
      <Highlight text="SHABBAT" x={100} y={170} size={104} at={t.at('Shabbat')} seed={208} rot={-2} />
      <Definition term="Shabbat" def="the weekly day of rest, from Friday at sunset to Saturday night" at={t.at('Shabbat') + 9} x={110} y={340} w={760} />
      <Note text="a special family dinner" x={120} y={560} size={50} rot={-3} at={t.at('special') - 3} />
      <Note text="candles" x={120} y={670} size={50} rot={-3} at={t.at('candles') - 3} color={pal.subject} />
      <Note text="blessings" x={360} y={670} size={50} rot={-3} at={t.at('blessings') - 3} />
      <Note text="challah: braided bread" x={120} y={780} size={50} rot={-3} at={t.at('challah') - 3} color={PAL.orange} />
      {photo ? (
        <>
          <PhotoCard src={IMG.shabbat} x={960} y={190} w={860} h={600} rot={2} at={a + 2} filter={MUTED} />
          <Loop cx={1515} cy={495} rx={80} ry={55} at={t.at('candles')} seed={230} tilt={-6} />
          <Arrow x1={790} y1={610} x2={1420} y2={490} bow={-40} at={t.at('candles') + 4} />
          <Note text="(challah under its cover)" x={1180} y={830} size={40} rot={-3} at={t.at('challah') + 4} color={WHITE} />
          <Tag text={cred(IMG.shabbat, 'Shabbat table setting · Wikimedia Commons')} />
        </>
      ) : (
        <>
          <ShabbatTable x={940} y={260} at={a + 2} candlesAt={t.at('candles')} challahAt={t.at('challah')} />
          <Arrow x1={560} y1={700} x2={1010} y2={420} bow={-40} at={t.at('candles') + 4} />
          <Arrow x1={720} y1={810} x2={1240} y2={600} bow={40} at={t.at('challah') + 4} color={PAL.orange} />
          <Tag text="Drawn Shabbat table, simplified" />
        </>
      )}
    </AbsoluteFill>
  );
};

/** A 25-hour, every-week break: the week strip with Friday sunset to Saturday night in coral. */
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const ScreenBreak: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const x0 = 140, dw = 234, y = 360, h = 150;
  const segX0 = x0 + 4 * dw + dw * 0.77; // Friday ~6:30 pm
  const segX1 = x0 + 5 * dw + dw * 0.83; // Saturday ~8 pm
  const sp = interpolate(g, [t.at('25-hour'), t.at('25-hour') + 12], [0, 1], clamp);
  const items = [['work', 'work'], ['driving', 'driving'], ['phones', 'phones']];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="some observant Jews take a full break from..." x={100} y={60} size={50} rot={-2} at={t.at('Some observant') - 3} color={WHITE} />
      <Svg>
        {DAYS.map((d, i) => <Stroke key={d} d={`M${x0 + i * dw},${y} L${x0 + (i + 1) * dw},${y} L${x0 + (i + 1) * dw},${y + h} L${x0 + i * dw},${y + h} Z`} at={t.at('Some observant') + i} dur={6} w={4} op={0.8} />)}
        {sp > 0 && <rect x={segX0} y={y + 8} width={(segX1 - segX0) * sp} height={h - 16} fill={PAL.coral} opacity={0.85} rx={4} />}
      </Svg>
      {DAYS.map((d, i) => (
        <div key={d} style={{position: 'absolute', left: x0 + i * dw, top: y + h + 16, width: dw, textAlign: 'center', fontFamily: JF.mono, fontSize: 28, letterSpacing: 3, color: i >= 4 && i <= 5 ? PAL.coral : 'rgba(244,239,230,0.75)'}}>{d}</div>
      ))}
      {items.map(([w, anchor], i) => {
        const at = t.at(anchor);
        const x = 160 + i * 400;
        return (
          <React.Fragment key={w}>
            <Note text={w} x={x} y={640} size={60} rot={-3} at={at - 3} color={PAL.cream} />
            <CoralX x={x - 10} y={650} w={w.length * 30 + 40} h={90} at={at + 6} width={9} />
          </React.Fragment>
        );
      })}
      <Stamp text="25 HOURS" x={segX0 - 160} y={y - 130} size={86} at={t.at('25-hour')} color={pal.subject} />
      <Note text="every week: a break from your screen" x={110} y={880} size={54} rot={-2} at={t.at('every-week') - 3} color={pal.subject} />
      <Tag text="Friday sunset to Saturday nightfall, about 25 hours" x={1300} />
    </AbsoluteFill>
  );
};

/** Kosher: the rules card and the cheeseburger with a coral X. */
const RULES = [{name: 'pork', at: 'pork'}, {name: 'shellfish', at: 'shellfish'}, {name: 'meat + dairy together', at: 'mixing'}];
const Kosher: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const {show, style} = usePop(t.at('laws'));
  const W = 780, rowH = 96, top = 110;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="KOSHER" x={100} y={80} size={104} at={t.at('kosher')} seed={209} rot={-2} />
      <Definition term="kosher" def="Jewish food laws: which foods are allowed and how they are prepared" at={t.at('kosher') + 9} x={110} y={250} w={800} />
      {show && (
        <div style={{position: 'absolute', left: 110, top: 450, width: W, ...style, rotate: '-1.5deg'}}>
          <div style={{position: 'relative', background: '#f4efe6', borderRadius: 6, height: top + RULES.length * rowH + 30, boxShadow: '0 20px 40px rgba(0,0,0,0.65)'}}>
            <div style={{position: 'absolute', left: 40, top: 30, fontFamily: JF.mono, fontSize: 28, letterSpacing: 6, color: '#3a342b'}}>KEEPING KOSHER · NO...</div>
            <div style={{position: 'absolute', left: 40, right: 40, top: 86, height: 3, background: '#3a342b', opacity: 0.6}} />
            {RULES.map((r, i) => (
              <div key={r.name} style={{position: 'absolute', left: 40, top: top + i * rowH, fontFamily: JF.display, fontSize: 54, color: '#111', whiteSpace: 'nowrap',
                opacity: g >= t.at(r.at) - 2 ? 1 : 0.25}}>{r.name}</div>
            ))}
            <svg width={W} height={top + RULES.length * rowH + 30} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
              {RULES.map((r, i) => {
                const p = interpolate(g, [t.at(r.at), t.at(r.at) + 6], [0, 1], clamp);
                const cy = top + i * rowH + 36;
                return p > 0 ? <path key={r.name} d={`M${W - 110},${cy - 26} L${W - 58},${cy + 26} M${W - 58},${cy - 26} L${W - 110},${cy + 26}`} fill="none" stroke={PAL.coral} strokeWidth={11}
                  strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} /> : null;
              })}
            </svg>
          </div>
        </div>
      )}
      <Burger x={1200} y={300} at={t.at('So,') - 2} />
      <CoralX x={1150} y={280} w={560} h={440} at={t.at('cheeseburgers') + 4} width={16} />
      <Note text="no cheeseburgers" x={1220} y={790} size={56} rot={-3} at={t.at('cheeseburgers') - 3} color={pal.subject} />
      <Note text="at a strictly kosher deli" x={1180} y={900} size={46} rot={-3} at={t.at('strictly') - 3} color={WHITE} />
      <Tag text="Drawn, simplified · many Jews keep kosher, to different degrees" />
    </AbsoluteFill>
  );
};

/** Bar mitzvah and bat mitzvah: two terms, two ages. */
const Mitzvah: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="a coming-of-age milestone" x={100} y={50} size={50} rot={-2} at={t.at('At 13') - 3} color={WHITE} />
      <Highlight text="BAR MITZVAH" x={100} y={170} size={84} at={t.at('bar')} seed={210} rot={-2} />
      <Definition term="bar mitzvah" def="the ceremony when a Jewish boy comes of age, at 13" at={t.at('bar') + 9} x={110} y={320} w={780} />
      <Stamp text="BOYS · 13" x={110} y={540} size={110} at={t.at('boys') + 4} color={PAL.cream} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}><line x1={958} y1={170} x2={958} y2={900} stroke="rgba(244,239,230,0.35)" strokeWidth={4} /></svg>
      <Highlight text="BAT MITZVAH" x={1010} y={170} size={84} at={t.at('bat')} seed={211} rot={-2} />
      <Definition term="bat mitzvah" def="the same milestone for a Jewish girl, usually at 12 or 13" at={t.at('bat') + 9} x={1020} y={320} w={800} />
      <Stamp text="GIRLS · 12 OR 13" x={1020} y={540} size={84} at={t.at('12')} color={PAL.cream} />
      <Note text="both: a big moment for the whole family" x={480} y={870} size={48} rot={-2} at={t.at('usually') - 3} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** Reading from the Torah: the photo when it arrives, else the Western Wall plaza card and the drawn scroll. */
const Reading: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('The teen');
  const b = t.at("And here's");
  const notes = (
    <>
      <Note text="reads from the Torah, in Hebrew" x={70} y={24} size={44} rot={-2} at={t.at('reads') - 3} color={WHITE} />
      <Note text="in front of the whole community" x={70} y={700} size={42} rot={-2} at={t.at('front') - 3} />
      <Note text="nerve-wracking!" x={70} y={800} size={54} rot={-4} at={t.at('nerve-wracking') - 3} color={pal.subject} />
      <Note text="...then everyone celebrates" x={70} y={910} size={44} rot={-2} at={t.at('everyone') - 3} />
    </>
  );
  if (hasFile(IMG.barMitzvah)) {
    return (
      <Pic src={IMG.barMitzvah} size={BAR_MITZVAH_SIZE} fx={960} fy={700} z0={1.02} z1={1.08} a={a} b={b} bw={MUTED} vignette={0.6}>
        {(p) => {
          const sx = p.left + BAR_MITZVAH_SIZE[0] * 0.76 * p.scale, sy = p.top + BAR_MITZVAH_SIZE[1] * 0.86 * p.scale;
          return (
            <>
              <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 14%), linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0) 50%)'}} />
              <Loop cx={sx} cy={sy} rx={260} ry={110} at={t.at('Torah', 2)} seed={212} tilt={-4} />
              {notes}
              <Tag text={cred(IMG.barMitzvah, 'A bar mitzvah reading from the Torah · Wikimedia Commons')} x={1100} />
            </>
          );
        }}
      </Pic>
    );
  }
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src={IMG.wallCrowd} size={[1920, 1280]} x={110} y={280} w={720} h={500} fx={700} fy={1040} scale={0.9} rot={-2} at={a + 1} bw={MUTED} />
      <Caption text="Torah readings at the Western Wall" x={120} y={800} at={a + 6} />
      <TorahScroll x={1040} y={290} w={760} h={480} at={t.at('Torah', 2) - 4} />
      <Loop cx={1420} cy={530} rx={420} ry={300} at={t.at('Hebrew', 2)} seed={212} tilt={-3} color={pal.mark} />
      {notes}
      <Tag text="Prayers at the Western Wall, Jerusalem · Askii, CC BY-SA 3.0, via Wikimedia Commons · drawn scroll, simplified" x={900} />
    </AbsoluteFill>
  );
};

/** Geography gets interesting: four regions loop on one map. */
const REGIONS = [
  {ll: [21, 50] as [number, number], rx: 150, ry: 95, tilt: -6},
  {ll: [-4.5, 40] as [number, number], rx: 80, ry: 60, tilt: 0},
  {ll: [22, 29] as [number, number], rx: 320, ry: 90, tilt: -8},
  {ll: [39, 9.5] as [number, number], rx: 70, ry: 60, tilt: 0},
];
const Communities: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at("And here's");
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 10, lat: 8, z: 1.1}, {f: t.at('Because', 2), lon: 15, lat: 32, z: 2.3}]}>
        {(S) => (
          <>
            <PopDots S={S} at={a} k={18} plain />
            {REGIONS.map((r, i) => {
              const [x, y] = S(r.ll);
              return <Loop key={i} cx={x} cy={y} rx={r.rx} ry={r.ry} at={t.at('developed') + i * 5} seed={220 + i} tilt={r.tilt} color={i === 0 ? pal.subject : pal.mark} />;
            })}
          </>
        )}
      </WorldMap>
      <Note text="here's where geography gets interesting" x={100} y={50} size={52} rot={-2} at={t.at('geography') - 3} color={WHITE} />
      <Note text="each community developed its own culture" x={110} y={900} size={52} rot={-2} at={t.at('each') - 3} color={pal.subject} />
      <Tag text="Map: Natural Earth" x={1500} />
    </AbsoluteFill>
  );
};

/** Ashkenazi: Central and Eastern Europe, Yiddish, and the bagel to New York. */
const Ashkenazi: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Ashkenazi');
  const bagel = hasFile(IMG.bagel);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: -22, lat: 46, z: 2.2}, {f: t.at('Sephardic'), lon: -22, lat: 46, z: 2.3}]} fills={ASHKENAZ.map((id) => ({id, at: a + 2, color: PAL.coral, opacity: 0.7}))}>
        {(S) => {
          const [px, py] = S(L.pale);
          const [nx, ny] = S(L.newYork);
          return (
            <>
              <Note text="spoke Yiddish" x={px - 120} y={py + 90} size={50} rot={-3} at={t.at('Yiddish') - 3} color={WHITE} />
              <Arrow x1={px - 140} y1={py + 10} x2={nx + 20} y2={ny - 10} bow={-80} at={t.at('New York')} dur={10} width={6} />
              <Dot x={nx} y={ny} at={t.at('New York') + 8} r={10} color={PAL.teal} />
              <MapLabel text="New York" x={nx - 30} y={ny - 40} at={t.at('New York') + 8} align="right" size={28} color={PAL.teal} />
            </>
          );
        }}
      </WorldMap>
      <Highlight text="ASHKENAZI" x={100} y={90} size={96} at={a} seed={213} rot={-2} />
      <Definition term="Ashkenazi" def="Jews whose families come from Central and Eastern Europe" at={a + 9} x={110} y={250} w={720} />
      {bagel ? <PhotoCard src={IMG.bagel} x={420} y={650} w={320} h={260} rot={-3} at={t.at('bagel')} filter={MUTED} /> : <DrawnBagel x={420} y={650} w={320} h={260} at={t.at('bagel')} />}
      <Note text="...and brought the bagel" x={790} y={880} size={50} rot={-3} at={t.at('bagel') - 3} color={pal.subject} />
      <Tag text={bagel ? cred(IMG.bagel, 'Bagel · Wikimedia Commons') + ' / Map: Natural Earth' : 'Shaded: historic Ashkenazi heartland, simplified · Map: Natural Earth'} x={bagel ? 44 : 1000} />
    </AbsoluteFill>
  );
};

/** Sephardic (Spain, Ladino) and Mizrahi (Middle East and North Africa). */
const SephMiz: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Sephardic');
  const m = t.at('Mizrahi');
  const fills: Fill[] = [...SEPHARAD.map((id) => ({id, at: a + 2, color: PAL.coral, opacity: 0.75})), ...MIZRAH.map((id) => ({id, at: m + 2, color: PAL.orange, opacity: 0.6}))];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 14, lat: 33, z: 2.6}, {f: t.at('And in Ethiopia'), lon: 16, lat: 32, z: 2.7}]} fills={fills}>
        {(S) => {
          const [sx, sy] = S(L.toledo);
          return <Note text="language: Ladino" x={sx - 330} y={sy + 70} size={50} rot={-3} at={t.at('Ladino') - 3} color={WHITE} />;
        }}
      </WorldMap>
      <Highlight text="SEPHARDIC" x={100} y={70} size={88} at={a} seed={214} rot={-2} />
      <Definition term="Sephardic" def="Jews whose families come from Spain and Portugal" at={a + 9} x={110} y={215} w={720} />
      <Highlight text="MIZRAHI" x={1000} y={720} size={88} at={m} seed={215} rot={-2} />
      <Definition term="Mizrahi" def="Jews from communities across the Middle East and North Africa" at={m + 9} x={1010} y={860} w={820} />
      <Tag text="Shaded: historic homelands, simplified · Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** Beta Israel: Ethiopia, with the portrait when it arrives. */
const Beta: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('And in Ethiopia');
  const photo = hasFile(IMG.beta);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 33, lat: 15, z: 3.6}, {f: t.at('In 1991'), lon: 33, lat: 14, z: 3.9}]} fills={[{id: ETHIOPIA, at: a + 2, color: PAL.coral, opacity: 0.75}]}>
        {(S) => {
          const [ex, ey] = S(L.gondar);
          return <MapLabel text="Ethiopia" x={ex} y={ey + 120} at={t.at('Ethiopia') + 4} align="center" size={30} color={PAL.coral} />;
        }}
      </WorldMap>
      <Highlight text="BETA ISRAEL" x={100} y={90} size={92} at={t.at('Beta')} seed={216} rot={-2} />
      <Definition term="Beta Israel" def="the Jewish community of Ethiopia" at={t.at('Beta') + 9} x={110} y={250} w={720} />
      <Note text="for centuries, in near isolation" x={110} y={880} size={52} rot={-2} at={t.at('centuries') - 3} color={pal.subject} />
      {photo && <PhotoCard src={IMG.beta} x={1400} y={130} w={400} h={560} rot={2} at={t.at('Beta') + 4} filter={MUTED} pos="50% 25%" />}
      <Tag text={photo ? cred(IMG.beta, 'Ethiopian-Israeli woman, Tel Aviv · CC0, via Wikimedia Commons') : 'Map: Natural Earth'} x={photo ? 44 : 1500} />
    </AbsoluteFill>
  );
};

/** 1991: the airlift from Addis Ababa to Israel. */
const Airlift: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('In 1991');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 30, lat: 21, z: 3.2}, {f: t.at('It was called'), lon: 30, lat: 21, z: 3.35}]}
        fills={[{id: ETHIOPIA, at: a, color: PAL.coral, opacity: 0.45}, {id: ISRAEL, at: a, color: PAL.coral, opacity: 0.85}]}>
        {(S) => {
          const [ax, ay] = S(L.addis);
          const [tx, ty] = S(L.telAviv);
          return (
            <>
              <Dot x={ax} y={ay} at={a + 4} r={10} color={PAL.teal} ring={false} />
              <MapLabel text="Addis Ababa" x={ax + 30} y={ay + 10} at={a + 4} size={28} color={PAL.teal} />
              <MapLabel text="Israel" x={tx + 34} y={ty} at={a + 4} size={28} color={PAL.coral} />
              {[-70, 0, 70].map((bow, i) => <Arrow key={i} x1={ax} y1={ay - 14} x2={tx + 4} y2={ty + 14} bow={bow} at={t.at('airlifted') + i * 6} dur={10} width={5} />)}
            </>
          );
        }}
      </WorldMap>
      <Stamp text="1991" x={100} y={90} size={120} at={t.at('1991')} color={PAL.cream} />
      <Stamp text="14,000+" x={100} y={250} size={120} at={t.at('14,000')} color={pal.subject} />
      <Note text="Ethiopian Jews airlifted to Israel" x={110} y={400} size={48} rot={-3} at={t.at('Ethiopian') - 3} color={WHITE} />
      <Note text="out of a civil war" x={110} y={500} size={48} rot={-3} at={t.at('civil') - 3} />
      <Note text="in about 36 hours" x={110} y={880} size={60} rot={-3} at={t.at('36') - 3} color={pal.subject} />
      <Tag text="Map: Natural Earth" x={1500} />
    </AbsoluteFill>
  );
};

/** Operation Solomon: one plane, more than 1,000 people. */
const Solomon: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('It was called');
  const photo = hasFile(IMG.solomon);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="OPERATION SOLOMON" x={100} y={90} size={90} at={t.at('Operation')} seed={217} rot={-2} />
      <Stamp text="1,000+" x={100} y={360} size={160} at={t.at('1,000')} color={pal.subject} />
      <Note text="people on ONE plane" x={110} y={560} size={56} rot={-3} at={t.at('people', 4) - 3} color={WHITE} />
      <Note text="a world record" x={110} y={700} size={64} rot={-4} at={t.at('world') - 3} color={pal.subject} />
      {photo ? <PhotoCard src={IMG.solomon} x={1000} y={300} w={800} h={500} rot={2} at={a + 2} filter={PAINT} /> : <Plane x={1080} y={420} s={1.05} at={a + 2} />}
      {!photo && <Note text="x 1,000+ passengers" x={1220} y={680} size={46} rot={-3} at={t.at('1,000') + 6} color={PAL.teal} />}
      <Tag text={photo ? cred(IMG.solomon, 'Operation Solomon, 1991 · Wikimedia Commons') : 'Drawn plane, simplified · 14,000+ people flown in about 36 hours, May 1991'} />
    </AbsoluteFill>
  );
};

/** Same religion, different cultures: the four communities on one map. */
const Ending: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Same religion');
  const fills: Fill[] = [...ASHKENAZ.map((id) => ({id, at: a, color: PAL.coral, opacity: 0.7})), ...SEPHARAD.map((id) => ({id, at: a + 4, color: PAL.teal, opacity: 0.6})),
    ...MIZRAH.map((id) => ({id, at: a + 8, color: PAL.orange, opacity: 0.55})), {id: ETHIOPIA, at: a + 12, color: PAL.cream, opacity: 0.55}];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 15, lat: 33, z: 1.9}, {f: a + 200, lon: 15, lat: 33, z: 2.0}]} fills={fills}>
        {(S) => {
          const lab = (text: string, ll: [number, number], at: number, color: string) => {
            const [x, y] = S(ll);
            return <MapLabel text={text} x={x} y={y} at={at} align="center" size={34} color={color === PAL.cream ? '#ffffff' : '#fff8ee'} />;
          };
          return (
            <>
              {lab('Ashkenazi', [24, 59], a + 2, PAL.coral)}
              {lab('Sephardic', [-14, 36], a + 6, PAL.teal)}
              {lab('Mizrahi', [12, 25], a + 10, PAL.orange)}
              {lab('Beta Israel', [52, 9], a + 14, PAL.cream)}
            </>
          );
        }}
      </WorldMap>
      <Note text="same religion..." x={100} y={50} size={56} rot={-3} at={a - 3} color={WHITE} />
      <Note text="...completely different cultures" x={700} y={60} size={56} rot={-3} at={t.at('completely') - 3} />
      <Note text="all shaped by where the diaspora landed" x={110} y={900} size={52} rot={-2} at={t.at('shaped') - 3} color={pal.subject} />
      <Tag text="Historic homelands, simplified · Map: Natural Earth" x={1200} />
    </AbsoluteFill>
  );
};

// ---------- the chapter ----------

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Hearth t={t} />],
    [at('Its central') - 1, <Torah t={t} />],
    [at('Judaism', 2) - 1, <Ethnic t={t} />],
    [at("It's also") - 1, <Fifteen t={t} />],
    [at('Because') - 1, <Exile t={t} />],
    [at('In fourteen') - 1, <Expulsion t={t} />],
    [at('In the late') - 1, <Ellis t={t} />],
    [at('And after') - 1, <Israel48 t={t} />],
    [at('This scattering') - 1, <Diaspora t={t} />],
    [at("That's why") - 1, <Dots t={t} />],
    [at('Wherever') - 1, <Shabbat t={t} />],
    [at('Some observant') - 1, <ScreenBreak t={t} />],
    [at('Many Jews also') - 1, <Kosher t={t} />],
    [at('At 13') - 1, <Mitzvah t={t} />],
    [at('The teen') - 1, <Reading t={t} />],
    [at("And here's") - 1, <Communities t={t} />],
    [at('Ashkenazi') - 1, <Ashkenazi t={t} />],
    [at('Sephardic') - 1, <SephMiz t={t} />],
    [at('And in Ethiopia') - 1, <Beta t={t} />],
    [at('In 1991') - 1, <Airlift t={t} />],
    [at('It was called') - 1, <Solomon t={t} />],
    [at('Same religion') - 1, <Ending t={t} />],
  ];
  const scene = useScene(cuts);
  // stamps on every Highlight / Stamp; marker under every Note (3 frames early); ticks on pins, arrows and cards
  const stamps = [at('Judaism'), at('Torah'), at('ethnic'), at('15'), at('fourteen'), at('two'), at('1948'), at('diaspora'), at('relocation'), at('scattered'), at('Shabbat'),
    at('25-hour'), at('kosher'), at('bar'), at('boys') + 4, at('bat'), at('12'), at('Ashkenazi'), at('Sephardic'), at('Mizrahi'), at('Beta'), at('1991'), at('14,000'),
    at('Operation'), at('1,000')];
  const notes = [at('oldest'), at('4,000'), at('single'), at('Its central') + 3, at('Hebrew'), at('tied'), at('not just'), at("doesn't seek"), at('small'), at('people', 2), at('nearly'),
    at('again'), at('Babylonians') + 7, at('70'), at('destroyed'), at('expelled'), at('late'), at('fled'), at('Holocaust'), at('new state'), at('choice'), at('map', 2), at('instead'),
    at('Wherever'), at('special'), at('candles'), at('blessings'), at('challah'), at('challah') + 4, at('Some observant'), at('work'), at('driving'), at('phones'), at('every-week'),
    at('cheeseburgers'), at('strictly'), at('Spain') + 8, at('continent'), at('At 13'), at('usually'), at('reads'), at('front'), at('nerve-wracking'), at('everyone'), at('geography'), at('each'), at('Yiddish'), at('bagel'),
    at('Ladino'), at('centuries'), at('Ethiopian'), at('civil'), at('36'), at('people', 4), at('world'), at('Same religion'), at('completely'), at('shaped')];
  const ticks = [at('Israel') + 4, at('five'), at('Israel', 2), at('United'), at('look') + 20, at('Babylonians'), at('Romans'), at('Eastern', 2), at('United', 2), at('moved'),
    at('candles'), at('challah'), at('pork'), at('shellfish'), at('mixing'), at('developed'), at('New York'), at('Ethiopia') + 4, at('airlifted'), at('laws')];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={'w' + i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {stamps.map((f, i) => <Sfx key={'s' + i} at={f} src="sfx/stamp.wav" volume={0.27} />)}
      {notes.map((f, i) => <Sfx key={'n' + i} at={f - 3} src={WRITE.src} volume={WRITE.volume} />)}
      {ticks.map((f, i) => <Sfx key={'t' + i} at={f} src="sfx/tick.wav" volume={0.4} />)}
      <Sfx at={at('cheeseburgers') + 4} src="sfx/marker_tick.wav" volume={0.3} />
    </AbsoluteFill>
  );
};

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_judaism.wav" lead={LEAD} music={[{src: 'music/g_world_outside.mp3', volume: 0.18}]}>
    <Body />
  </ChapterShell>
);
