// Chapter 3 · The religion that moved south (Christianity): the hearth (Bethlehem, Nazareth, Jerusalem), the Bible, a
// universalizing religion of 2.4 billion, then every type of diffusion in turn (Paul and contagious diffusion, Constantine
// and hierarchical diffusion, colonial routes and relocation diffusion, the Philippines), the three branches, worship around
// the world (Lagos, an Orthodox church, Manila, Día de los Muertos as blending) and the center of gravity moving south.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import words from '../../public/audio/ch03_christianity.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, CropCard, Definition, DrawnCrown, hasFile, LEAD, makeTimeline, type Narration, onScreen, Photo, Stamp, type TL, useScene} from '../kit/shell';
import {Bars, Pie} from '../kit/charts';
import {PAL} from '../kit/look';
import {Dot, type Fill, MapLabel, type ToScreen, WorldMap} from '../kit/asia';

const N = words as Narration;
export const CH03_FRAMES = chapterFrames(N, LEAD);

/** Modern photos stay in colour, muted so the teal and coral marks read on top. */
const MUTED = 'saturate(0.55) contrast(1.08) brightness(0.82)';
/** Paintings: black and white, a touch darker so notes read over them. */
const PAINT = 'grayscale(1) contrast(1.2) brightness(0.9)';
const WHITE = '#ffffff';
/** Christianity's colour across the video (orange, as in the cold open's three maps). */
const XC = PAL.orange;

/** Planned photo, not on disk yet: Día de los Muertos ofrenda. */
const DIA = 'img/ch03/dia_muertos.jpg';
// TODO size: fill in the real pixel size of ch03/dia_muertos.jpg when it arrives (the crop covers its window either way).
const DIA_SIZE: [number, number] = [1920, 1280];

type LL = [number, number];
/** Places used in this chapter, [lon, lat]. */
const L = {
  bethlehem: [35.2, 31.7] as LL,
  nazareth: [35.3, 32.7] as LL,
  jerusalem: [35.23, 31.78] as LL,
  antioch: [36.16, 36.2] as LL,
  tarsus: [34.9, 36.92] as LL,
  iconium: [32.5, 37.87] as LL,
  ephesus: [27.34, 37.94] as LL,
  troas: [26.2, 39.75] as LL,
  philippi: [24.29, 41.01] as LL,
  thessalonica: [22.95, 40.64] as LL,
  athens: [23.73, 37.98] as LL,
  corinth: [22.93, 37.9] as LL,
  caesarea: [34.9, 32.5] as LL,
  crete: [24.6, 34.8] as LL,
  malta: [14.4, 35.9] as LL,
  rome: [12.5, 41.9] as LL,
  carthage: [10.3, 36.8] as LL,
  alexandria: [29.9, 31.2] as LL,
  gaul: [2.5, 46.5] as LL,
  hispania: [-4.5, 39.5] as LL,
  britannia: [-1.5, 52.5] as LL,
  spain: [-4, 40] as LL,
  portugal: [-8.2, 39.6] as LL,
  britain: [-1.5, 52.5] as LL,
  france: [2.2, 46.8] as LL,
  mexico: [-100, 21] as LL,
  mexicoWest: [-105.5, 20] as LL,
  peru: [-75, -10] as LL,
  brazil: [-47, -12] as LL,
  eastUS: [-77, 38.5] as LL,
  quebec: [-71.5, 47] as LL,
  angola: [16, -11.5] as LL,
  southAfrica: [24, -29] as LL,
  philippines: [122, 12.5] as LL,
  london: [-0.12, 51.5] as LL,
  paris: [2.35, 48.85] as LL,
  lagos: [3.4, 6.5] as LL,
  saoPaulo: [-46.6, -23.5] as LL,
  /** Approximate statistical center of the world's Christians. */
  cog1900: [4, 45] as LL,
  cogToday: [-2, 15] as LL,
};
const ISRAEL = '376';
const PALESTINE = '275';
const PHILIPPINES = '608';

/** Roman Empire around 380 CE, simplified outline (Hadrian's Wall, Rhine-Danube, Euphrates, Sahara edge). */
const ROME_380: LL[] = [
  [-9.5, 43.5], [-4.5, 48.4], [-5.6, 50.0], [-4.8, 54.9], [-1.6, 55.0], [1.6, 52.6], [2.0, 51.0], [4.4, 51.9], [6.5, 51.5], [7.6, 50.1], [8.6, 49.0],
  [9.4, 48.4], [12.2, 48.8], [16.3, 48.2], [18.9, 47.8], [19.4, 45.6], [22.3, 44.6], [26.0, 43.8], [28.5, 44.4], [29.7, 45.2], [28.6, 43.0], [29.0, 41.2],
  [31.5, 41.2], [36.0, 41.7], [41.5, 41.5], [42.6, 40.0], [41.2, 38.0], [42.2, 37.2], [40.2, 36.0], [38.6, 34.4], [37.2, 32.0], [35.5, 30.0], [34.9, 29.4],
  [33.6, 27.5], [32.9, 24.0], [31.4, 24.2], [30.4, 29.4], [29.0, 30.8], [25.0, 31.4], [20.0, 30.4], [18.8, 30.2], [15.5, 31.0], [11.2, 32.4], [10.0, 33.5],
  [8.0, 34.6], [5.0, 35.2], [0.0, 35.0], [-2.2, 34.8], [-5.4, 34.0], [-6.9, 34.0], [-6.0, 35.8], [-8.0, 37.0], [-9.0, 38.7], [-9.5, 42.5],
];

/** Mostly Christian countries in the Americas, sub-Saharan Africa and Asia-Pacific (as in the cold open's map). */
const AMERICAS = ['840', '124', '484', '320', '084', '340', '222', '558', '188', '591', '192', '332', '214', '388', '630', '170', '862', '328', '740', '218', '604', '068',
  '076', '600', '152', '032', '858', '780'];
const AFRICA_X = ['231', '180', '024', '710', '404', '800', '834', '894', '716', '508', '454', '450', '288', '120', '178', '266', '516', '072', '646', '108', '140', '728',
  '426', '748', '430'];
const EUROPE = ['826', '372', '250', '724', '620', '380', '276', '528', '056', '756', '040', '616', '203', '703', '348', '642', '100', '300', '688', '191', '705', '807',
  '499', '804', '112', '643', '440', '428', '233', '246', '752', '578', '208', '352', '498', '008'];
const SUB_SAHARAN = [...AFRICA_X, '566', '384', '768', '204', '694', '324', '854', '562', '148', '466', '686', '270', '624', '706', '232', '262', '226', '478'];

/** Largest Christian branch in mostly Christian countries (simplified). */
const CATHOLIC = ['484', '320', '340', '222', '558', '188', '591', '192', '214', '630', '332', '170', '862', '218', '604', '068', '076', '600', '152', '032', '858',
  '124', '724', '620', '380', '250', '372', '056', '040', '616', '191', '705', '703', '348', '440', '608', '626', '180', '024', '108', '178', '266', '226'];
const PROTESTANT = ['840', '826', '578', '752', '246', '208', '352', '233', '428', '276', '756', '036', '554', '598', '710', '516', '072', '716', '894', '454', '404',
  '800', '834', '288', '566', '430', '450', '140', '646', '120'];
const ORTHODOX = ['643', '804', '112', '498', '642', '100', '688', '300', '268', '051', '807', '499', '196', '231'];

// ---------- small drawn pieces ----------

/** Pops in like a card on the desk. */
const usePop = (at: number) => {
  const g = useGFrame();
  const k = interpolate(g, [at, at + 5], [0, 1], {...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) * (1 - 2.2 * x * (1 - x))});
  return {show: g >= at, style: {transform: `scale(${0.6 + 0.4 * k})`, opacity: Math.min(1, k * 2)} as React.CSSProperties};
};

/** A shaded region on a WorldMap (lon/lat outline), fading in. */
const Region: React.FC<{pts: LL[]; S: ToScreen; at: number; color: string; opacity?: number; dashed?: boolean}> = ({pts, S, at, color, opacity = 0.3, dashed}) => {
  const g = useGFrame();
  if (g < at) return null;
  const o = interpolate(g, [at, at + 8], [0, 1], clamp);
  const d = pts.map((ll, i) => {
    const [x, y] = S(ll);
    return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ') + ' Z';
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: o}}>
      <path d={d} fill={color} fillOpacity={opacity} stroke={color} strokeWidth={4} strokeDasharray={dashed ? '12 9' : undefined} strokeLinejoin="round" />
    </svg>
  );
};

/** A route through screen points, drawn on from the first point; `dashed` for sea legs. */
const Route: React.FC<{id: string; pts: number[][]; at: number; dur?: number; color?: string; width?: number; dashed?: boolean}> = ({id, pts, at, dur = 12, color = PAL.teal, width = 6, dashed}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x={-200} y={-200} width={2320} height={1480}>
          <path d={d} fill="none" stroke="#fff" strokeWidth={width + 10} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        </mask>
      </defs>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? '14 12' : undefined} mask={`url(#${id})`} />
    </svg>
  );
};

/** A plain person icon (head + shoulders), for counts like "8 in 10". */
const Person: React.FC<{x: number; y: number; h: number; color: string; at: number}> = ({x, y, h, color, at}) => {
  const {show, style} = usePop(at);
  if (!show) return null;
  const w = h * 0.56;
  return (
    <svg width={w} height={h} viewBox="0 0 56 100" style={{position: 'absolute', left: x, top: y, overflow: 'visible', ...style}}>
      <circle cx={28} cy={20} r={16} fill={color} />
      <path d="M4,100 L4,62 Q4,42 28,42 Q52,42 52,62 L52,100 Z" fill={color} />
    </svg>
  );
};

/** A small colour swatch for a map key. */
const Swatch: React.FC<{x: number; y: number; color: string; at: number}> = ({x, y, color, at}) => {
  const {show, style} = usePop(at);
  if (!show) return null;
  return <div style={{position: 'absolute', left: x, top: y, width: 40, height: 40, borderRadius: 6, background: color, boxShadow: '0 0 0 3px #111, 0 6px 14px rgba(0,0,0,0.6)', ...style}} />;
};

/** The Bible as a drawn open book: Hebrew scriptures on the left page, the New Testament on the right. */
const BookCard: React.FC<{x: number; y: number; at: number; leftAt: number; rightAt: number}> = ({x, y, at, leftAt, rightAt}) => {
  const g = useGFrame();
  const {show, style} = usePop(at);
  if (!show) return null;
  const W = 820, H = 520;
  const page = (side: 'l' | 'r', title: string, sub: string, when: number) => {
    const o = interpolate(g, [when, when + 6], [0, 1], clamp);
    return (
      <div style={{position: 'absolute', left: side === 'l' ? 30 : W / 2 + 10, top: 34, width: W / 2 - 40, height: H - 68, background: '#f4efe6', borderRadius: side === 'l' ? '10px 2px 2px 10px' : '2px 10px 10px 2px',
        boxShadow: 'inset 0 0 30px rgba(60,48,30,0.25)'}}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{position: 'absolute', left: 36, right: 36, top: 230 + i * 30, height: 4, borderRadius: 2, background: 'rgba(58,52,43,0.18)'}} />
        ))}
        <div style={{position: 'absolute', left: 0, right: 0, top: 60, textAlign: 'center', opacity: o}}>
          <div style={{fontFamily: JF.display, fontSize: 50, lineHeight: 1.05, color: '#111'}}>{title}</div>
          <div style={{fontFamily: '"Nanum Pen Script", cursive', fontSize: 50, lineHeight: 1.1, color: '#14907f', marginTop: 12}}>{sub}</div>
        </div>
      </div>
    );
  };
  return (
    <div style={{position: 'absolute', left: x, top: y, width: W, height: H, ...style, rotate: '-2deg'}}>
      <div style={{position: 'absolute', inset: 0, background: '#3a2a1c', borderRadius: 16, boxShadow: '0 22px 40px rgba(0,0,0,0.7)'}} />
      {page('l', 'Hebrew', 'scriptures', leftAt)}
      {page('r', 'New', 'Testament', rightAt)}
      <div style={{position: 'absolute', left: W / 2 - 3, top: 30, width: 6, height: H - 60, background: 'rgba(0,0,0,0.35)'}} />
    </div>
  );
};

/** A drawn ofrenda (home altar for Día de los Muertos): tiers, candles, marigolds, papel picado. No faces. */
const Ofrenda: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const g = useGFrame();
  const {show, style} = usePop(at);
  if (!show) return null;
  const W = 620, H = 700;
  const flick = (i: number) => 1 + 0.12 * Math.sin((g + i * 7) / 3);
  const tiers = [{y: 300, w: 380}, {y: 430, w: 480}, {y: 560, w: 580}];
  const flags = ['#FF6F61', '#FF9F1C', '#2FE0C4', '#f4efe6', '#FF6F61', '#FF9F1C', '#2FE0C4'];
  return (
    <div style={{position: 'absolute', left: x, top: y, width: W, height: H, ...style, rotate: '2deg'}}>
      <div style={{position: 'absolute', inset: 0, background: 'rgba(16,14,11,0.92)', border: `4px solid ${PAL.teal}`, borderRadius: 10, boxShadow: '0 18px 36px rgba(0,0,0,0.65)'}} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {/* papel picado */}
        <path d={`M30,60 Q${W / 2},90 ${W - 30},60`} fill="none" stroke="rgba(244,239,230,0.6)" strokeWidth={3} />
        {flags.map((c, i) => {
          const fx = 50 + i * ((W - 100) / (flags.length - 1));
          return <path key={i} d={`M${fx - 30},${68 + (i === 3 ? 6 : 0)} L${fx + 30},${68 + (i === 3 ? 6 : 0)} L${fx + 30},${130} L${fx},${150} L${fx - 30},${130} Z`} fill={c} opacity={0.85} />;
        })}
        {/* a cross on top */}
        <path d={`M${W / 2},170 L${W / 2},260 M${W / 2 - 30},195 L${W / 2 + 30},195`} stroke={PAL.cream} strokeWidth={9} strokeLinecap="round" />
        {/* tiers */}
        {tiers.map((tr, i) => (
          <rect key={i} x={(W - tr.w) / 2} y={tr.y} width={tr.w} height={24} rx={4} fill={PAL.cream} opacity={0.9} />
        ))}
        {/* framed photo (blank) and bread on the tiers */}
        <rect x={W / 2 - 50} y={330} width={100} height={92} rx={4} fill="none" stroke={PAL.cream} strokeWidth={5} />
        <ellipse cx={W / 2 - 150} cy={540} rx={50} ry={22} fill="#c98a4a" />
        <ellipse cx={W / 2 + 150} cy={540} rx={50} ry={22} fill="#c98a4a" />
        {/* candles */}
        {[-230, -120, 120, 230].map((dx, i) => {
          const cx = W / 2 + dx, top = i % 3 === 0 ? 470 : 360;
          return (
            <g key={i}>
              <rect x={cx - 11} y={top} width={22} height={60} fill={PAL.bone} />
              <ellipse cx={cx} cy={top - 14} rx={8 * flick(i)} ry={15 * flick(i)} fill={PAL.orange} />
            </g>
          );
        })}
        {/* marigolds along the bottom */}
        {Array.from({length: 13}, (_, i) => (
          <circle key={i} cx={40 + i * ((W - 80) / 12)} cy={630 + (i % 2) * 14} r={20} fill={PAL.orange} stroke="#b85f00" strokeWidth={3} />
        ))}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: -60, textAlign: 'center', fontFamily: JF.mono, fontSize: 26, letterSpacing: 3, color: PAL.cream, textShadow: '0 2px 8px #000'}}>AN OFRENDA (HOME ALTAR)</div>
    </div>
  );
};

/** Two overlapping circles: Catholic holidays + Indigenous traditions = blending. */
const Blend: React.FC<{x: number; y: number; aAt: number; bAt: number; midAt: number}> = ({x, y, aAt, bAt, midAt}) => {
  const g = useGFrame();
  const pal = usePal();
  const r = 215;
  const ring = (cx: number, at: number, color: string) => {
    const p = interpolate(g, [at, at + 10], [0, 1], clamp);
    if (p <= 0) return null;
    return <circle cx={cx} cy={y} r={r} fill={color} fillOpacity={0.14 * p} stroke={color} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} transform={`rotate(-90 ${cx} ${y})`} />;
  };
  const txt = (cx: number, at: number, a: string, b: string, color: string) => g >= at ? (
    <div style={{position: 'absolute', left: cx, top: y, transform: 'translate(-50%, -50%)', textAlign: 'center', opacity: interpolate(g, [at + 4, at + 8], [0, 1], clamp)}}>
      <div style={{fontFamily: JF.display, fontSize: 48, lineHeight: 1.05, color, whiteSpace: 'nowrap'}}>{a}</div>
      <div style={{fontFamily: '"Nanum Pen Script", cursive', fontSize: 50, lineHeight: 1.05, color: PAL.cream, whiteSpace: 'nowrap', marginTop: 8}}>{b}</div>
    </div>
  ) : null;
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        {ring(x - 175, aAt, XC)}
        {ring(x + 175, bAt, PAL.teal)}
      </svg>
      {txt(x - 250, aAt, 'Catholic', 'holidays', XC)}
      {txt(x + 250, bAt, 'Indigenous', 'traditions', PAL.teal)}
      {g >= midAt && <div style={{position: 'absolute', left: x, top: y + r + 40, transform: 'translate(-50%, 0)', fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, color: pal.subject,
        textShadow: '0 2px 8px #000', opacity: interpolate(g, [midAt, midAt + 5], [0, 1], clamp), whiteSpace: 'nowrap'}}>BLENDED TOGETHER</div>}
    </>
  );
};

// ---------- scenes ----------

/** The hearth: Bethlehem, Nazareth and Jerusalem on a close map of the region. */
const Hearth: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const fills: Fill[] = [ISRAEL, PALESTINE].map((id) => ({id, at: 0, color: PAL.cream, opacity: 0.08}));
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: 0, lon: 35.6, lat: 32.0, z: 10}, {f: t.at('Nazareth') + 6, lon: 35.45, lat: 32.2, z: 34}]} fills={fills}>
        {(S) => {
          const [bx, by] = S(L.bethlehem);
          const [nx, ny] = S(L.nazareth);
          const [jx, jy] = S(L.jerusalem);
          return (
            <>
              <Dot x={bx} y={by + 6} at={t.at('Jesus')} r={9} color={pal.subject} ring={false} />
              <MapLabel text="Bethlehem" x={bx - 34} y={by + 34} at={t.at('Jesus') + 2} align="right" color={pal.subject} size={30} />
              <Dot x={nx} y={ny} at={t.at('Nazareth')} r={11} color={PAL.teal} />
              <MapLabel text="Nazareth" x={nx + 44} y={ny} at={t.at('Nazareth') + 2} color={PAL.teal} size={34} />
              <Dot x={jx} y={jy - 6} at={t.at('preaching')} r={11} color={PAL.teal} />
              <MapLabel text="Jerusalem" x={jx + 44} y={jy - 16} at={t.at('preaching') + 2} color={PAL.teal} size={34} />
            </>
          );
        }}
      </WorldMap>
      <Note text="about 2,000 years ago" x={90} y={70} size={56} rot={-3} at={t.at('About') - 3} color={WHITE} />
      <Note text="the same small region" x={100} y={180} size={48} rot={-3} at={t.at('same small') - 3} />
      <Note text="Jesus of Nazareth," x={90} y={760} size={56} rot={-3} at={t.at('Jewish') - 3} color={WHITE} />
      <Note text="a Jewish teacher" x={110} y={870} size={52} rot={-3} at={t.at('teacher') - 3} />
      <Tag text="Places: Bethlehem (birthplace in the Gospels), Nazareth, Jerusalem · Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** What his followers came to believe: Calvary in the Church of the Holy Sepulchre. */
const Sepulchre: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('His followers');
  return (
    <Photo src="img/ch03/holy_sepulchre_interior.jpg" size={[1920, 1331]} fx={960} fy={620} z0={1.02} z1={1.08} a={a} b={t.at('Their holy')} bw={MUTED} vignette={0.7}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 28%, rgba(0,0,0,0) 45%)'}} />
          <Note text="his followers believe:" x={60} y={600} size={44} rot={-3} at={a - 3} color={WHITE} />
          <Note text="the Son of God" x={70} y={700} size={52} rot={-3} at={t.at('Son') - 3} />
          <Note text="rose from the dead" x={70} y={810} size={52} rot={-3} at={t.at('rose') - 3} />
          <Tag text="Calvary, Church of the Holy Sepulchre, Jerusalem · Berthold Werner, CC BY-SA 3.0, via Wikimedia Commons" />
        </>
      )}
    </Photo>
  );
};

/** The Bible: Hebrew scriptures + New Testament. */
const Bible: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Their holy');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="their holy book:" x={110} y={70} size={52} rot={-3} at={a - 3} color={WHITE} />
      <Highlight text="THE BIBLE" x={100} y={170} size={104} at={t.at('Bible')} seed={331} rot={-2} />
      <Definition term="Bible" def="Christianity's holy book: the Hebrew scriptures (the Old Testament) plus the New Testament" at={t.at('Bible') + 9} x={110} y={360} w={760} />
      <BookCard x={980} y={260} at={a + 2} leftAt={t.at('Hebrew')} rightAt={t.at('New Testament')} />
      <Note text="+" x={1365} y={830} size={70} rot={0} at={t.at('New Testament') + 2} color={PAL.orange} />
      <Tag text="Drawn book, simplified" />
    </AbsoluteFill>
  );
};

/** A universalizing religion: a message meant for everyone. */
const Universal: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('From the start');
  const targets: LL[] = [[10, 50], [-100, 42], [-58, -14], [24, -16], [108, 34], [134, -24]];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="from the start:" x={100} y={40} size={48} rot={-3} at={a - 3} color={WHITE} />
      <Highlight text="A UNIVERSALIZING RELIGION" x={90} y={130} size={78} at={t.at('universalizing')} seed={332} rot={-2} />
      <Definition term="universalizing religion" def="a religion that tries to appeal to all people, everywhere, and welcomes converts" at={t.at('universalizing') + 9} x={100} y={270} w={1000} />
      <WorldMap x={820} y={440} w={1000} h={540} frame keys={[{f: a, lon: 15, lat: 8, z: 0.54}, {f: a + 150, lon: 15, lat: 8, z: 0.57}]}>
        {(S) => {
          const [jx, jy] = S(L.jerusalem);
          return (
            <>
              {targets.map((ll, i) => {
                const [x, y] = S(ll);
                return <Arrow key={i} x1={jx} y1={jy} x2={x} y2={y} bow={i % 2 ? 30 : -30} at={t.at('everyone') - 6 + i * 2} dur={8} width={4} color={XC} />;
              })}
              <Dot x={jx} y={jy} at={a + 4} r={9} color={pal.subject} />
            </>
          );
        }}
      </WorldMap>
      <Note text="its message: for everyone" x={110} y={600} size={56} rot={-3} at={t.at('message') - 3} />
      <Tag text="Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** 2.4 billion: the largest religion; every type of diffusion. */
const Billion: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const ev = t.at('every type');
  const kinds = ['1 · contagious', '2 · hierarchical', '3 · relocation'];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="today: the largest religion in the world" x={100} y={60} size={50} rot={-3} at={t.at('largest') - 3} color={WHITE} />
      <Stamp text="2.4 BILLION" x={100} y={250} size={140} at={t.at('2.4')} color={PAL.cream} />
      <Note text="followers" x={120} y={410} size={52} rot={-3} at={t.at('followers', 2) - 3} />
      <Pie cx={1260} cy={430} r={230} at={t.at('largest') + 4} per={10} seed={33}
        slices={[
          {label: 'Christians', value: 29, subject: true, pct: '29%', note: '3 in 10 people', labelAt: [1540, 170]},
          {label: 'everyone else', value: 71, pct: '71%', labelAt: [960, 690]},
        ]} />
      <Note text="its spread uses every type of diffusion:" x={100} y={760} size={48} rot={-2} at={ev - 3} color={WHITE} />
      {kinds.map((k, i) => <Note key={k} text={k} x={110 + i * 560} y={880} size={54} rot={-3} at={ev + 4 + i * 6} color={i === 0 ? pal.subject : PAL.teal} />)}
      <Tag text="Pew Research Center estimates (about 2.3-2.4 billion of 8 billion) · drawn chart" />
    </AbsoluteFill>
  );
};

/** Paul: Raphael's St Paul preaching in Athens, Paul looped. */
const Paul: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('First');
  return (
    <Photo src="img/ch03/paul_athens_raphael.jpg" size={[1536, 1182]} fx={640} fy={560} z0={1.02} z1={1.08} a={a} b={t.at('shipping')} bw={PAINT} vignette={0.65}>
      {(place) => {
        const S = onScreen(place);
        const [px, py] = S(440, 560);
        return (
          <>
            <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 26%)'}} />
            <Loop cx={px} cy={py} rx={240 * place.scale} ry={390 * place.scale} at={t.at('Paul') - 2} seed={34} tilt={-4} color={PAL.coral} width={6} />
            <Note text="first: person to person" x={980} y={40} size={52} rot={-3} at={t.at('person') - 3} color={WHITE} />
            <Note text="missionaries like Paul" x={1000} y={140} size={52} rot={-3} at={t.at('missionaries') - 3} />
            <Tag text="St Paul Preaching in Athens · Raphael, 1515, public domain, via Wikimedia Commons" />
          </>
        );
      }}
    </Photo>
  );
};

/** Paul's journeys on Roman roads and sea lanes: contagious diffusion. */
const Routes: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('shipping');
  const city = t.at('city after');
  const cities: {ll: LL; label?: string; dx?: number; dy?: number; align?: 'left' | 'right' | 'center'}[] = [
    {ll: L.antioch, label: 'Antioch', dx: 30, dy: -30},
    {ll: L.tarsus},
    {ll: L.iconium},
    {ll: L.ephesus, label: 'Ephesus', dx: 0, dy: 44, align: 'center'},
    {ll: L.philippi},
    {ll: L.thessalonica},
    {ll: L.athens, label: 'Athens', dx: -24, dy: 40, align: 'right'},
    {ll: L.corinth},
    {ll: L.rome, label: 'Rome', dx: -26, dy: -30, align: 'right'},
  ];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 24.5, lat: 37.6, z: 5}, {f: a + 150, lon: 24.5, lat: 37.6, z: 5.3}]}>
        {(S) => {
          const P = (ll: LL) => S(ll);
          const land1 = [L.jerusalem, L.antioch, L.tarsus, L.iconium, L.ephesus, L.troas].map(P);
          const sea1 = [L.troas, [25.0, 40.4] as LL, L.philippi].map(P);
          const land2 = [L.philippi, L.thessalonica, [22.6, 39.3] as LL, L.athens, L.corinth].map(P);
          const sea2 = [L.caesarea, [30.0, 34.2] as LL, L.crete, [18.5, 35.4] as LL, L.malta, [15.6, 38.2] as LL, [14.1, 40.8] as LL, L.rome].map(P);
          const [jx, jy] = P(L.jerusalem);
          return (
            <>
              <Route id="c3r1" pts={land1} at={a - 6} dur={14} color={PAL.teal} />
              <Route id="c3r2" pts={sea1} at={a + 6} dur={6} color={PAL.cream} width={5} dashed />
              <Route id="c3r3" pts={land2} at={a + 10} dur={10} color={PAL.teal} />
              <Route id="c3r4" pts={sea2} at={a + 8} dur={20} color={PAL.cream} width={5} dashed />
              <Dot x={jx} y={jy} at={a} r={11} color={pal.subject} />
              <MapLabel text="Jerusalem" x={jx + 34} y={jy + 20} at={a + 2} color={pal.subject} size={30} />
              {cities.map((c, i) => {
                const [x, y] = P(c.ll);
                return (
                  <React.Fragment key={i}>
                    <Dot x={x} y={y} at={city + i * 2} r={9} color={XC} ring={false} />
                    {c.label && <MapLabel text={c.label} x={x + (c.dx ?? 0)} y={y + (c.dy ?? 0)} at={city + i * 2 + 2} align={c.align ?? 'left'} size={28} />}
                  </React.Fragment>
                );
              })}
            </>
          );
        }}
      </WorldMap>
      <Note text="Roman roads" x={1340} y={60} size={46} rot={-3} at={a - 9} color={PAL.teal} />
      <Note text="+ shipping routes" x={1340} y={150} size={46} rot={-3} at={a - 3} color={WHITE} />
      <Note text="small communities, city after city" x={80} y={60} size={46} rot={-3} at={city - 3} />
      <Highlight text="CONTAGIOUS DIFFUSION" x={70} y={740} size={76} at={t.at('contagious')} seed={333} rot={-2} />
      <Definition term="contagious diffusion" def="spreads person to person, like a cold through a classroom" at={t.at('contagious') + 9} x={80} y={870} w={1100} />
      <Tag text="Paul's journeys simplified (approx.) · solid = roads, dashed = sea · Map: Natural Earth" x={1240} y={1030} />
    </AbsoluteFill>
  );
};

/** Constantine: School of Raphael's Vision of the Cross, the emperor looped. */
const Constantine: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('from the top');
  return (
    <Photo src="img/ch03/vision_of_the_cross.jpg" size={[1920, 1243]} fx={930} fy={600} z0={1.55} z1={1.65} a={a} b={t.at('and by 380')} bw={PAINT} vignette={0.65}>
      {(place) => {
        const S = onScreen(place);
        const [cx, cy] = S(765, 640);
        return (
          <>
            <AbsoluteFill style={{background: 'linear-gradient(270deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 32%, rgba(0,0,0,0) 48%)'}} />
            <Loop cx={cx} cy={cy} rx={100 * place.scale} ry={200 * place.scale} at={t.at('Constantine') - 2} seed={35} tilt={-3} color={PAL.coral} width={6} />
            <Note text="then: from the top" x={1290} y={60} size={52} rot={-3} at={a - 3} color={WHITE} />
            <Stamp text="313" x={1330} y={260} size={170} at={t.at('313')} color={PAL.cream} />
            <Note text="Emperor Constantine" x={1290} y={450} size={50} rot={-3} at={t.at('Constantine') - 3} />
            <Note text="makes Christianity legal" x={1290} y={540} size={46} rot={-3} at={t.at('legalized') - 3} color={WHITE} />
            <Tag text="The Vision of the Cross (detail) · School of Raphael, 1520-24, public domain, via Wikimedia Commons" />
          </>
        );
      }}
    </Photo>
  );
};

/** 380: the official religion of the Roman Empire; the emperor converts, the empire follows. */
const Empire: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('and by 380');
  const fol = t.at('empire follows');
  const outs: LL[] = [L.britannia, L.gaul, L.hispania, L.carthage, L.alexandria, L.antioch];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 14, lat: 41, z: 3.3}, {f: a + 260, lon: 14, lat: 41, z: 3.5}]}>
        {(S) => {
          const [rx, ry] = S(L.rome);
          const [ex, ey] = S([20, 36.5]);
          return (
            <>
              <Region pts={ROME_380} S={S} at={t.at('official')} color={XC} opacity={0.22} dashed />
              <MapLabel text="Roman Empire, c. 380" x={ex} y={ey} at={t.at('official') + 4} color={XC} size={30} align="center" />
              {outs.map((ll, i) => {
                const [x, y] = S(ll);
                return <Arrow key={i} x1={rx} y1={ry} x2={x} y2={y} bow={i % 2 ? 26 : -26} at={fol + i * 2} dur={8} width={5} />;
              })}
              <Dot x={rx} y={ry} at={t.at('emperor', 2)} r={13} color={pal.subject} />
              <DrawnCrown x0={rx - 34} x1={rx + 34} y={ry - 40} h={34} at={t.at('emperor', 2) + 2} color={pal.subject} width={6} />
              <MapLabel text="Rome" x={rx - 30} y={ry + 40} at={t.at('emperor', 2) + 2} color={pal.subject} size={30} align="right" />
            </>
          );
        }}
      </WorldMap>
      <Stamp text="380" x={1330} y={60} size={150} at={t.at('380')} color={PAL.cream} />
      <Note text="the official religion" x={1300} y={220} size={50} rot={-3} at={t.at('official') - 3} />
      <Note text="the emperor converts..." x={1260} y={360} size={46} rot={-3} at={t.at('emperor', 2) - 3} color={WHITE} />
      <Note text="...the empire follows" x={1290} y={440} size={46} rot={-3} at={fol - 3} />
      <Highlight text="HIERARCHICAL DIFFUSION" x={60} y={740} size={74} at={t.at('hierarchical')} seed={334} rot={-2} />
      <Definition term="hierarchical diffusion" def="spreads from the top down: from powerful people or places to everyone else" at={t.at('hierarchical') + 9} x={70} y={865} w={1060} />
      <Tag text="Empire outline simplified · Map: Natural Earth" x={1340} />
    </AbsoluteFill>
  );
};

/** Colonial routes across the oceans from the 1500s. */
const Colonial: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('across oceans');
  const am = t.at('Americas');
  const af = t.at('Africa');
  const as = t.at('Asia');
  const fills: Fill[] = [
    ...AMERICAS.map((id) => ({id, at: am + 6, color: XC, opacity: 0.6})),
    ...AFRICA_X.map((id) => ({id, at: af + 6, color: XC, opacity: 0.6})),
    {id: PHILIPPINES, at: as + 6, color: XC, opacity: 0.9},
  ];
  const routes: {from: LL; to: LL; at: number; bow: number}[] = [
    {from: L.spain, to: L.mexico, at: am, bow: 70},
    {from: L.spain, to: L.peru, at: am + 3, bow: 60},
    {from: L.portugal, to: L.brazil, at: am + 5, bow: 40},
    {from: L.britain, to: L.eastUS, at: am + 8, bow: 50},
    {from: L.france, to: L.quebec, at: am + 10, bow: 60},
    {from: L.portugal, to: L.angola, at: af, bow: 60},
    {from: L.britain, to: L.southAfrica, at: af + 3, bow: 90},
  ];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 2, lat: 12, z: 1.06}, {f: a + 230, lon: 2, lat: 12, z: 1.1}]} fills={fills}>
        {(S) => {
          const [mx, my] = S(L.mexicoWest);
          const [px, py] = S(L.philippines);
          return (
            <>
              {routes.map((r, i) => {
                const [x1, y1] = S(r.from);
                const [x2, y2] = S(r.to);
                return <Arrow key={i} x1={x1} y1={y1} x2={x2} y2={y2} bow={r.bow} at={r.at} dur={8} width={5} />;
              })}
              <Arrow x1={mx} y1={my} x2={30} y2={my + 60} bow={20} at={as - 4} dur={6} width={5} />
              <Arrow x1={1890} y1={py + 70} x2={px + 18} y2={py + 8} bow={-20} at={as + 2} dur={6} width={5} />
              <MapLabel text="Spain, via the Pacific" x={px + 10} y={py + 120} at={as + 6} size={24} align="center" />
            </>
          );
        }}
      </WorldMap>
      <Note text="then: across oceans" x={60} y={660} size={52} rot={-3} at={a - 3} color={WHITE} />
      <Note text="starting in the 1500s" x={70} y={760} size={50} rot={-3} at={t.at('1500s') - 3} />
      <Note text="colonizers + missionaries" x={70} y={860} size={50} rot={-3} at={t.at('colonizers') - 3} />
      <Note text="Spain · Portugal · Britain · France" x={1000} y={60} size={44} rot={-2} at={t.at('European') - 3} color={WHITE} />
      <Highlight text="RELOCATION DIFFUSION" x={60} y={40} size={70} at={t.at('relocation')} seed={335} rot={-2} />
      <Definition term="relocation diffusion" def="spreads when people move and carry it with them to a new place" at={t.at('relocation') + 9} x={70} y={170} w={900} />
      <Tag text="Main colonial routes, simplified · shaded = mostly Christian today · Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** Relocation diffusion; about 8 in 10 Filipinos are Catholic. */
const Relocation: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const e = t.at('8 in 10');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="that's why..." x={100} y={80} size={56} rot={-3} at={t.at("and it's why")} color={WHITE} />
      <WorldMap x={1260} y={120} w={560} h={640} frame keys={[{f: t.at("and it's why"), lon: 122.5, lat: 12, z: 9.5}]} fills={[{id: PHILIPPINES, at: t.at("and it's why") + 4, color: pal.subject, opacity: 0.85}]}>
        {(S) => {
          const [mx, my] = S([121, 14.6]);
          return (
            <>
              <Dot x={mx} y={my} at={t.at('Philippines')} r={9} color={PAL.cream} ring={false} />
              <MapLabel text="Manila" x={mx - 22} y={my - 4} at={t.at('Philippines') + 2} align="right" size={26} />
            </>
          );
        }}
      </WorldMap>
      <MapLabel text="The Philippines" x={1540} y={80} at={t.at('Philippines')} align="center" color={pal.subject} size={30} />
      {Array.from({length: 10}, (_, i) => (
        <Person key={i} x={110 + i * 100} y={380} h={150} color={i < 8 ? pal.subject : 'rgba(237,231,220,0.45)'} at={e + i} />
      ))}
      <Stamp text="8 IN 10" x={100} y={650} size={130} at={e} color={pal.subject} />
      <Note text="of the people in the Philippines" x={110} y={810} size={52} rot={-3} at={t.at('people') - 3} color={WHITE} />
      <Note text="are Catholic today" x={130} y={900} size={52} rot={-3} at={t.at('Catholic') - 3} />
      <Tag text="Philippine Statistics Authority, 2020 census (about 79% Roman Catholic) · Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** Three branches with a key: Catholic, Protestant, Orthodox. */
const Branches: React.FC<{t: TL}> = ({t}) => {
  const c = t.at('Catholics');
  const p = t.at('Protestants');
  const o = t.at('Orthodox Christians');
  const fills: Fill[] = [
    ...CATHOLIC.map((id) => ({id, at: c + 4, color: PAL.orange, opacity: 0.8})),
    ...PROTESTANT.map((id) => ({id, at: p + 4, color: PAL.teal, opacity: 0.7})),
    ...ORTHODOX.map((id) => ({id, at: o + 4, color: PAL.coral, opacity: 0.85})),
  ];
  const rows = [
    {at: c, color: PAL.orange, word: 'CATHOLIC', term: 'Catholic', def: 'led by the Pope in Rome', y: 150, seed: 336},
    {at: p, color: PAL.teal, word: 'PROTESTANT', term: 'Protestant', def: 'broke from Rome in the 1500s', y: 420, seed: 337},
    {at: o, color: PAL.coral, word: 'ORTHODOX', term: 'Orthodox', def: 'Eastern churches, split in 1054', y: 690, seed: 338},
  ];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="three major branches" x={60} y={30} size={52} rot={-3} at={t.at('three major') - 3} color={WHITE} />
      {rows.map((r) => (
        <React.Fragment key={r.word}>
          <Swatch x={60} y={r.y + 22} color={r.color} at={r.at} />
          <Highlight text={r.word} x={120} y={r.y} size={60} at={r.at} seed={r.seed} rot={-2} />
          <Definition term={r.term} def={r.def} at={r.at + 9} x={120} y={r.y + 100} w={560} />
        </React.Fragment>
      ))}
      <WorldMap x={730} y={130} w={1130} h={800} frame keys={[{f: t.at('Today Christianity has'), lon: 18, lat: 14, z: 0.6}, {f: t.at('And a church'), lon: 18, lat: 14, z: 0.63}]} fills={fills}>
        {(S) => {
          const lab = (text: string, ll: LL, at: number, color: string) => {
            const [x, y] = S(ll);
            return <MapLabel text={text} x={x} y={y} at={at} align="center" color={color} size={22} />;
          };
          return (
            <>
              {lab('Latin America', [-62, -28], t.at('Latin America') + 2, PAL.orange)}
              {lab('southern Europe', [-8, 33.5], t.at('southern') + 2, PAL.orange)}
              {lab('Philippines', [123, 4], t.at('Philippines', 2) + 2, PAL.orange)}
              {lab('northern Europe', [10, 70], t.at('northern') + 2, PAL.teal)}
              {lab('United States', [-100, 33], t.at('United States') + 2, PAL.teal)}
              {lab('much of Africa', [25, -37], t.at('much of') + 2, PAL.teal)}
              {lab('Russia', [95, 64], t.at('Russia') + 2, PAL.coral)}
              {lab('Eastern Europe', [40, 44.5], t.at('Eastern') + 2, PAL.coral)}
            </>
          );
        }}
      </WorldMap>
      <Tag text="Simplified: largest Christian branch in mostly Christian countries · Map: Natural Earth" x={730} y={960} />
    </AbsoluteFill>
  );
};

/** Lagos: one faith, very different services. */
const Lagos: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('And a church');
  return (
    <Photo src="img/ch03/lagos_cathedral.jpg" size={[1920, 1440]} fx={960} fy={760} z0={1.02} z1={1.1} a={a} b={t.at('In Greece')} bw={MUTED} vignette={0.65}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 66%, rgba(0,0,0,0.65) 100%)'}} />
          <Note text="same faith, very different services" x={70} y={40} size={52} rot={-3} at={t.at('completely') - 3} color={WHITE} />
          <Note text="Lagos, Nigeria" x={80} y={150} size={56} rot={-3} at={t.at('Lagos') - 3} />
          <Note text="a Pentecostal service can run for hours" x={70} y={800} size={48} rot={-3} at={t.at('Pentecostal') - 3} color={WHITE} />
          <Note text="full band + dancing in the aisles" x={80} y={900} size={50} rot={-3} at={t.at('band') - 3} />
          <Tag text="Cathedral Church of Christ, Marina, Lagos · PHOTOMORA, CC BY-SA 4.0, via Wikimedia Commons" />
        </>
      )}
    </Photo>
  );
};

/** An Orthodox church: icons and gold. */
const Orthodox: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('In Greece');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src="img/ch03/iconostasis.jpg" size={[1920, 1278]} x={100} y={170} w={1020} h={620} fx={960} fy={600} scale={0.56} rot={-2} at={a + 1} bw={MUTED} />
      <CropCard src="img/ch03/orthodox_icon.jpg" size={[1920, 2885]} x={1310} y={130} w={460} h={640} fx={960} fy={1400} scale={0.26} rot={2} at={t.at('golden') - 2} bw={MUTED} />
      <Note text="Orthodox service:" x={100} y={40} size={52} rot={-3} at={t.at('Orthodox', 2) - 3} color={WHITE} />
      <Note text="incense" x={110} y={850} size={56} rot={-3} at={t.at('incense') - 3} />
      <Note text="+ golden painted icons" x={420} y={850} size={56} rot={-3} at={t.at('golden') - 3} />
      <Arrow x1={1000} y1={880} x2={1290} y2={720} bow={-40} at={t.at('icons') - 2} />
      <Tag text="Greek Orthodox church, Aleppo, Syria · Dosseman, CC BY-SA 4.0, via Wikimedia Commons" />
    </AbsoluteFill>
  );
};

/** Manila: crowds fill the streets for processions. */
const Manila: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('In Manila');
  return (
    <Photo src="img/ch03/manila_crowd.jpg" size={[1920, 1280]} fx={960} fy={720} z0={1.02} z1={1.1} a={a} b={a + 140} bw={MUTED} vignette={0.65}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 32%)'}} />
          <Note text="Manila, Philippines" x={70} y={40} size={56} rot={-3} at={t.at('Manila') - 3} />
          <Note text="millions fill the streets for processions" x={80} y={150} size={50} rot={-3} at={t.at('millions') - 3} color={WHITE} />
          <Tag text="Feast of the Black Nazarene procession, Quiapo, Manila, 2024 · FroyR, CC BY-SA 4.0, via Wikimedia Commons" />
        </>
      )}
    </Photo>
  );
};

/** Día de los Muertos: Catholic holidays + Indigenous traditions = blending. */
const Muertos: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.wordAt(t.idx('de los') - 1);
  const m = t.at('In Mexico');
  const photo = hasFile(DIA);
  const W = 640, H = 700;
  const sc = Math.max(W / DIA_SIZE[0], H / DIA_SIZE[1]);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="Mexico" x={100} y={40} size={52} rot={-3} at={m + 2} color={WHITE} />
      <Highlight text="DÍA DE LOS MUERTOS" x={90} y={130} size={82} at={a + 2} seed={339} rot={-2} />
      <Blend x={560} y={560} aAt={t.at('Catholic', 2)} bAt={t.at('Indigenous')} midAt={t.at('blends') + 2} />
      {photo
        ? <CropCard src={DIA} size={DIA_SIZE} x={1160} y={170} w={W} h={H} fx={DIA_SIZE[0] / 2} fy={DIA_SIZE[1] / 2} scale={sc} rot={2} at={a + 4} bw={MUTED} />
        : <Ofrenda x={1170} y={230} at={m + 4} />}
      <Note text="blending: a big deal in geography" x={100} y={880} size={50} rot={-3} at={t.at('blending') - 3} color={pal.subject} />
      <Note text="(more on this soon)" x={1180} y={950} size={44} rot={-3} at={t.at('soon') - 3} color={WHITE} />
      <Tag text={photo ? 'Día de los Muertos ofrenda, Mexico · see credits (Wikimedia Commons)' : 'Drawn ofrenda, simplified: candles, marigolds, bread, papel picado'} y={1036} />
    </AbsoluteFill>
  );
};

/** 1900: most Christians in Europe; today: sub-Saharan Africa. The center of gravity slides south. */
const Gravity: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at("But here's");
  const td = t.at('Today', 4);
  const fills: Fill[] = [
    ...EUROPE.map((id) => ({id, at: t.at('Europe', 3), color: PAL.cream, opacity: 0.35})),
    ...SUB_SAHARAN.map((id) => ({id, at: t.at('sub-Saharan') + 2, color: XC, opacity: 0.75})),
  ];
  const g = useGFrame();
  const k = interpolate(g, [td, t.at('any other')], [0, 1], {...clamp, easing: (x) => x * x * (3 - 2 * x)});
  const ll: LL = [L.cog1900[0] + (L.cogToday[0] - L.cog1900[0]) * k, L.cog1900[1] + (L.cogToday[1] - L.cog1900[1]) * k];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: -12, lat: 16, z: 1.65}, {f: a + 300, lon: -12, lat: 16, z: 1.72}]} fills={fills}>
        {(S) => {
          const [x0, y0] = S(L.cog1900);
          const [x, y] = S(ll);
          const show = g >= t.at('In 1900');
          return show ? (
            <>
              <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
                {k > 0 && <path d={`M${x0},${y0} L${x},${y}`} stroke={pal.subject} strokeWidth={5} strokeDasharray="10 10" strokeLinecap="round" />}
              </svg>
              <Dot x={x0} y={y0} at={t.at('In 1900')} r={10} color={PAL.cream} ring={false} />
              <MapLabel text="1900 · center of gravity" x={x0 + 26} y={y0 - 24} at={t.at('In 1900') + 2} size={26} />
              {k > 0 && <Dot x={x} y={y} at={td} r={14} color={pal.subject} ring={k >= 1} />}
              {k >= 1 && <MapLabel text="today" x={x - 30} y={y + 40} at={t.at('any other')} color={PAL.cream} size={30} align="right" />}
            </>
          ) : null;
        }}
      </WorldMap>
      <Note text="the part most people don't know:" x={60} y={40} size={48} rot={-3} at={a - 3} color={WHITE} />
      <Note text="1900: about 2 in 3 in Europe" x={60} y={140} size={46} rot={-3} at={t.at('In 1900') - 3} />
      <div style={{position: 'absolute', left: 1330, top: 300, width: 550, height: 470, background: 'rgba(13,12,9,0.85)', borderRadius: 8, opacity: g >= td ? 1 : 0}} />
      {g >= td && <Bars x={1380} y={430} w={470} h={230} max={34} at={td + 4} per={5} unit="%"
        bars={[{label: 'AFRICA*', value: 31, subject: true}, {label: 'LAT AM', value: 24}, {label: 'EUROPE', value: 22}]} />}
      <Note text="share of all Christians, 2020" x={1360} y={320} size={36} rot={-2} at={td + 2} color={WHITE} />
      <Note text="today: more in sub-Saharan Africa than any other region" x={60} y={900} size={46} rot={-2} at={t.at('more Christians') - 3} color={pal.subject} />
      <Tag text="*sub-Saharan Africa · Pew Research Center (1910 and 2020 estimates) · center of gravity approximate · Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** The typical Christian: Lagos or São Paulo, not London or Paris. Moved south. */
const South: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('The typical');
  const fills: Fill[] = SUB_SAHARAN.map((id) => ({id, at: 0, color: XC, opacity: 0.45}));
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: -12, lat: 16, z: 1.72}, {f: a + 260, lon: -14, lat: 12, z: 1.85}]} fills={fills}>
        {(S) => {
          const [lx, ly] = S(L.lagos);
          const [sx, sy] = S(L.saoPaulo);
          const [nx, ny] = S(L.london);
          const [px, py] = S(L.paris);
          const [c0x, c0y] = S(L.cog1900);
          const [c1x, c1y] = S(L.cogToday);
          return (
            <>
              <Dot x={lx} y={ly} at={t.at('Lagos', 2)} r={13} color={pal.subject} />
              <MapLabel text="Lagos" x={lx + 40} y={ly + 4} at={t.at('Lagos', 2) + 2} color={pal.subject} size={32} />
              <Dot x={sx} y={sy} at={t.at('São') - 1} r={13} color={pal.subject} />
              <MapLabel text="São Paulo" x={sx + 40} y={sy + 4} at={t.at('São') + 1} color={pal.subject} size={32} />
              <Dot x={nx} y={ny} at={t.at('London')} r={9} color="rgba(237,231,220,0.5)" ring={false} />
              <MapLabel text="London" x={nx - 26} y={ny - 22} at={t.at('London') + 2} align="right" color="rgba(237,231,220,0.7)" size={26} />
              <Dot x={px} y={py} at={t.at('Paris')} r={9} color="rgba(237,231,220,0.5)" ring={false} />
              <MapLabel text="Paris" x={px + 26} y={py + 4} at={t.at('Paris') + 2} color="rgba(237,231,220,0.7)" size={26} />
              <Arrow x1={c0x} y1={c0y + 20} x2={c1x} y2={c1y - 20} bow={-30} at={t.at('center of gravity')} dur={14} width={8} color={pal.subject} />
            </>
          );
        }}
      </WorldMap>
      <Note text="the typical Christian today:" x={60} y={40} size={52} rot={-3} at={a - 3} color={WHITE} />
      <Note text="more likely Lagos or São Paulo" x={60} y={140} size={48} rot={-3} at={t.at('more likely') - 3} />
      <Note text="than London or Paris" x={60} y={230} size={48} rot={-3} at={t.at('than in London') - 3} color={WHITE} />
      <Note text="Christianity's center of gravity" x={1040} y={760} size={44} rot={-3} at={t.at("Christianity's") - 3} color={WHITE} />
      <Highlight text="HAS MOVED SOUTH" x={1030} y={850} size={78} at={t.at('south')} seed={340} rot={-2} />
      <Tag text="Map: Natural Earth" />
    </AbsoluteFill>
  );
};

// ---------- the chapter ----------

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const dia = t.wordAt(t.idx('de los') - 1);
  const cuts: [number, React.ReactNode][] = [
    [0, <Hearth t={t} />],
    [at('His followers') - 1, <Sepulchre t={t} />],
    [at('Their holy') - 1, <Bible t={t} />],
    [at('From the start') - 1, <Universal t={t} />],
    [at("Today it's") - 1, <Billion t={t} />],
    [at('First') - 1, <Paul t={t} />],
    [at('shipping') - 1, <Routes t={t} />],
    [at('from the top') - 6, <Constantine t={t} />],
    [at('and by 380') - 1, <Empire t={t} />],
    [at('across oceans') - 8, <Colonial t={t} />],
    [at("and it's why") - 1, <Relocation t={t} />],
    [at('Today Christianity has') - 1, <Branches t={t} />],
    [at('And a church') - 1, <Lagos t={t} />],
    [at('In Greece') - 1, <Orthodox t={t} />],
    [at('In Manila') - 1, <Manila t={t} />],
    [at('In Mexico') - 1, <Muertos t={t} />],
    [at("But here's") - 1, <Gravity t={t} />],
    [at('The typical') - 1, <South t={t} />],
  ];
  const scene = useScene(cuts);
  // stamps on every Highlight / Stamp; marker under every Note (3 frames early); ticks on pins, arrows and cards
  const stamps = [at('Bible'), at('universalizing'), at('2.4'), at('contagious'), at('313'), at('380'), at('hierarchical'), at('relocation'), at('8 in 10'),
    at('Catholics'), at('Protestants'), at('Orthodox Christians'), dia + 2, at('south')];
  const notes = [at('About'), at('same small'), at('Jewish'), at('teacher'), at('His followers'), at('Son'), at('rose'), at('Their holy'), at('New Testament') + 2,
    at('From the start'), at('message'), at('largest'), at('followers', 2), at('every type'), at('every type') + 4, at('every type') + 10, at('every type') + 16,
    at('person'), at('missionaries'), at('shipping') - 6, at('shipping'), at('city after'), at('from the top'), at('Constantine'), at('legalized'), at('official'),
    at('emperor', 2), at('empire follows'), at('across oceans'), at('1500s'), at('colonizers'), at('European'), at("and it's why") + 3, at('people'), at('Catholic'), at('three major'),
    at('completely'), at('Lagos'), at('Pentecostal'), at('band'), at('Orthodox', 2), at('incense'), at('golden'), at('Manila'), at('millions'), at('In Mexico') + 5,
    at('blending'), at('soon'), at("But here's"), at('In 1900'), t.at('Today', 4) + 5, at('more Christians'), at('The typical'), at('more likely'), at('than in London'),
    at("Christianity's")];
  const ticks = [at('Jesus'), at('Nazareth'), at('preaching'), at('Hebrew'), at('New Testament'), at('everyone') - 6, at('Paul') - 2, at('city after'), at('Constantine') - 2,
    at('emperor', 2), at('empire follows'), at('Americas'), at('Africa'), at('Asia'), at('Philippines'), at('Latin America') + 2, at('northern') + 2, at('Russia') + 2,
    at('icons') - 2, at('Catholic', 2), at('Indigenous'), at('In 1900'), t.at('Today', 4), at('Lagos', 2), at('São') - 1, at('London'), at('Paris'), at('center of gravity')];
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

export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch03_christianity.wav" lead={LEAD} music={[{src: 'music/r_revival.mp3', volume: 0.13}]}>
    <Body />
  </ChapterShell>
);
