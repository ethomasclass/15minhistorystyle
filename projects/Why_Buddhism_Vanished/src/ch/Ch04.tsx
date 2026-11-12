// Chapter 4 · The prince who walked away (Buddhism): Siddhartha near the India-Nepal border, the Four Sights, enlightenment
// at Bodh Gaya, the Eightfold Path and nirvana, a universalizing religion, Ashoka and Kalinga, pillars and missionaries
// (hierarchical diffusion), the Silk Road and the sea route (contagious diffusion), the three branches, alms in Luang
// Prabang, short-term novices, meditation apps, then why it faded in India (three reasons) and the hearth that faded.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import words from '../../public/audio/ch04_buddhism.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, CropCard, Definition, DrawnCrown, hasFile, LEAD, makeTimeline, type Narration, Photo, Stamp, type TL, useScene} from '../kit/shell';
import {PAL} from '../kit/look';
import {C, centroid, Dot, type Fill, MapLabel, P, type ToScreen, WorldMap} from '../kit/asia';
import {Person} from '../kit/figures';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);

/** Modern photos stay in colour, muted so the teal and coral marks read on top. */
const MUTED = 'saturate(0.55) contrast(1.08) brightness(0.82)';
/** AI paintings: black and white, a touch darker so notes read over them. */
const PAINT = 'grayscale(1) contrast(1.2) brightness(0.9)';
const GEN: [number, number] = [1376, 768];
const WHITE = '#ffffff';
const NORTH_KOREA = '408';

/** Places used only in this chapter, [lon, lat]. */
const L = {
  lumbini: [83.28, 27.48] as [number, number],
  pataliputra: [85.14, 25.61] as [number, number],
  kalinga: [85.84, 20.19] as [number, number],
  anuradhapura: [80.4, 8.35] as [number, number],
  kandahar: [65.7, 31.6] as [number, number],
  suvarnabhumi: [97.6, 16.5] as [number, number],
  xian: [108.9, 34.3] as [number, number],
  gyeongju: [129.2, 35.8] as [number, number],
  nara: [135.8, 34.7] as [number, number],
  luangPrabang: [102.13, 19.89] as [number, number],
  nalanda: [85.44, 25.14] as [number, number],
};

/** Ashoka's pillar and rock edict sites (approximate), for the "across his empire" dots. */
const EDICTS: [number, number][] = [[83.28, 27.48], [83.02, 25.38], [84.41, 27.0], [85.13, 25.99], [77.2, 30.1], [81.88, 25.43], [77.74, 23.48],
  [84.5, 27.27], [70.5, 21.5], [65.7, 31.6], [77.85, 30.52], [85.84, 20.19], [72.17, 34.22], [76.66, 15.96], [79.9, 16.4]];

/** The Mauryan Empire at its height, c. 250 BCE (simplified outline). */
const MAURYA: [number, number][] = [[61.5, 30.5], [64, 35], [69, 36.5], [73, 35.6], [75.5, 34], [78, 31.5], [81, 30.2], [85, 27.6], [88, 26.8], [89.6, 26],
  [89.4, 22.4], [87, 21.4], [85.6, 19.6], [83.5, 17.6], [81.5, 16], [80.2, 14.4], [78.4, 13.2], [76, 13.2], [74.8, 14.6], [73.8, 17], [73, 19],
  [72.6, 21], [70.4, 21], [68.6, 23.4], [66.8, 24.6], [64, 25.4], [61.6, 27]];

/** The overland Silk Road (Ganges plain, Gandhara, Bactria, Kashgar, Dunhuang, Chang'an), then on to Korea and Japan. */
const SILK: [number, number][] = [[85.14, 25.61], [77.7, 27.5], [72.8, 33.7], [69.2, 34.5], [66.9, 36.75], [71.5, 39.5], [75.99, 39.47], [80.3, 41.2],
  [89.2, 42.9], [94.66, 40.14], [98.3, 39.8], [103.8, 36.06], [108.9, 34.3]];
const KOREA_JAPAN: [number, number][] = [[108.9, 34.3], [113.6, 34.7], [117.0, 36.6], [121.5, 37.2], [126.4, 36.6], [129.2, 35.8], [131.5, 34.5], [135.8, 34.7]];
const SEA: [number, number][] = [[87.9, 22.0], [90.5, 17.5], [94, 13], [97.5, 8], [99.8, 4.5], [102.5, 2.0], [105, 3.5], [106.2, 7.5], [106.7, 10.6]];

/** The Tibetan plateau (simplified), lit for Vajrayana over China's Mahayana fill. */
const TIBET: [number, number][] = [[78.5, 32.5], [79.5, 35.5], [86, 36.2], [92, 35.8], [97, 33.5], [98.8, 29.5], [96.5, 28.3], [92, 27.8], [88.2, 27.9], [84, 28.8], [81, 30.2]];

const BUDDHIST = [C.thailand, C.myanmar, C.sriLanka, C.bhutan, C.cambodia, C.laos, C.mongolia, C.japan, C.vietnam, C.southKorea, C.taiwan, C.china];

// ---------- small drawn pieces ----------

/** A Definition bar that leaves at `out` (so two can share one spot). */
const Def: React.FC<{term: string; def: string; at: number; out?: number; x?: number; y?: number; w?: number}> = ({out = 1e7, ...p}) => {
  const g = useGFrame();
  return g >= out ? null : <Definition {...p} />;
};

/** A route on a map, drawn on from its first point; dashed for sea lanes, with a soft glow. */
const Route: React.FC<{pts: [number, number][]; S: ToScreen; at: number; dur?: number; color?: string; dashed?: boolean; width?: number}> = ({pts, S, at, dur = 20, color = PAL.teal, dashed, width = 6}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  const d = pts.map((ll, i) => {
    const [x, y] = S(ll);
    return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <path d={d} fill="none" stroke={color} strokeWidth={width * 4} strokeOpacity={0.18} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} style={{filter: 'blur(5px)'}} />
      {dashed ? (
        <>
          <mask id={`rm${at}`}>
            <path d={d} fill="none" stroke="#fff" strokeWidth={width + 6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
          </mask>
          <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray="14 12" mask={`url(#rm${at})`} />
        </>
      ) : (
        <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      )}
    </svg>
  );
};

/** A filled region on a map from a [lon, lat] outline, fading in. */
const Region: React.FC<{pts: [number, number][]; S: ToScreen; at: number; color: string; opacity?: number; dashed?: boolean}> = ({pts, S, at, color, opacity = 0.3, dashed}) => {
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

/** A drawn phone with a breathing circle (no real app shown). */
const Phone: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 12], [0, 1], clamp);
  const w = 380, h = 740;
  const breath = 0.5 + 0.5 * Math.sin(((g - at) / 75) * Math.PI * 2 - Math.PI / 2);
  const r = 70 + 70 * breath;
  const inhale = Math.cos(((g - at) / 75) * Math.PI * 2 - Math.PI / 2) < 0;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <rect x={x} y={y} width={w} height={h} rx={48} fill="rgba(13,12,9,0.85)" stroke={pal.mark} strokeWidth={7} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
      <rect x={x + w / 2 - 50} y={y + 26} width={100} height={14} rx={7} fill={pal.mark} opacity={k} />
      {k >= 1 && (
        <>
          <circle cx={x + w / 2} cy={y + h / 2 - 20} r={r + 26} fill="none" stroke={pal.subject} strokeOpacity={0.35} strokeWidth={3} />
          <circle cx={x + w / 2} cy={y + h / 2 - 20} r={r} fill={pal.subject} fillOpacity={0.28} stroke={pal.subject} strokeWidth={5} />
          <text x={x + w / 2} y={y + h - 120} textAnchor="middle" style={{fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, fill: '#f4efe6'}}>{inhale ? 'BREATHE IN' : 'BREATHE OUT'}</text>
          <text x={x + w / 2} y={y + h - 72} textAnchor="middle" style={{fontFamily: JF.mono, fontSize: 24, letterSpacing: 2, fill: 'rgba(244,239,230,0.6)'}}>1:00</text>
        </>
      )}
    </svg>
  );
};

/** A numbered reason card on cream stock. `x` crosses it out in coral. */
const ReasonCard: React.FC<{n: number; text: string; x: number; y: number; w?: number; h?: number; at: number; rot?: number; size?: number; num?: number; ghost?: boolean}> = ({
  n, text, x, y, w = 500, h = 300, at, rot = 0, size = 46, num = 96, ghost,
}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 5], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) * (1 - 2.2 * t * (1 - t))});
  if (ghost) {
    return (
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, border: '4px dashed rgba(244,239,230,0.35)', borderRadius: 6, transform: `rotate(${rot}deg)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: JF.display, fontSize: 120, color: 'rgba(244,239,230,0.3)', opacity: k}}>{n}</div>
    );
  }
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: '#f4efe6', boxShadow: '0 18px 34px rgba(0,0,0,0.6)', transform: `scale(${0.6 + 0.4 * k}) rotate(${rot}deg)`,
      opacity: Math.min(1, k * 2), padding: '22px 30px', boxSizing: 'border-box'}}>
      <div style={{fontFamily: JF.display, fontSize: num, lineHeight: 1, color: PAL.coral}}>{n}</div>
      <div style={{marginTop: num > 70 ? 14 : 6, fontFamily: JF.heavy, fontWeight: 900, fontSize: size, lineHeight: 1.12, color: '#111'}}>{text}</div>
    </div>
  );
};

/** A plain map scene used when a photo has not been downloaded yet: a pin on the place. */
const PinMap: React.FC<{ll: [number, number]; label: string; at: number; z?: number}> = ({ll, label, at, z = 7}) => (
  <AbsoluteFill>
    <DarkPaper />
    <WorldMap keys={[{f: at, lon: ll[0], lat: ll[1], z}, {f: at + 240, lon: ll[0], lat: ll[1], z: z * 1.15}]}>
      {(S) => {
        const [x, y] = S(ll);
        return (
          <>
            <Dot x={x} y={y} at={at + 4} r={13} color={PAL.coral} />
            <MapLabel text={label} x={x + 46} y={y + 2} at={at + 4} color={PAL.coral} size={32} />
          </>
        );
      }}
    </WorldMap>
  </AbsoluteFill>
);

// ---------- scenes ----------

/** Where it began: the India-Nepal border, Lumbini, a prince. */
const Border: React.FC<{t: TL}> = ({t}) => {
  const a = 0;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 84, lat: 25, z: 4.2}, {f: t.at('The story') - 1, lon: 83.4, lat: 27.0, z: 9.5}]}
        fills={[{id: C.india, at: t.at('India'), color: PAL.cream, opacity: 0.12}, {id: C.nepal, at: t.at('Nepal'), color: PAL.teal, opacity: 0.3}]}>
        {(S, z) => {
          const [lx, ly] = S(L.lumbini);
          const [ix, iy] = S([80.2, 24.2]);
          const [nx, ny] = S([84.3, 28.4]);
          return (
            <>
              <MapLabel text="India" x={ix} y={iy} at={t.at('India')} size={z > 7 ? 34 : 28} align="center" />
              <MapLabel text="Nepal" x={nx} y={ny} at={t.at('Nepal')} size={z > 7 ? 34 : 28} align="center" color={PAL.teal} />
              <Dot x={lx} y={ly} at={t.at('prince')} r={13} color={PAL.coral} />
              <MapLabel text="Lumbini" x={lx - 36} y={ly + 40} at={t.at('prince')} align="right" color={PAL.coral} size={30} />
            </>
          );
        }}
      </WorldMap>
      <Note text="about 2,500 years ago" x={110} y={90} size={60} rot={-3} at={t.at('2500') - 3} color={WHITE} />
      <Highlight text="SIDDHARTHA GAUTAMA" x={110} y={760} size={84} at={t.at('Siddhartha')} seed={401} rot={-2} />
      <Note text="a prince, raised in luxury" x={150} y={900} size={54} rot={-3} at={t.at('surrounded') - 3} />
      <Tag text="Lumbini, his traditional birthplace · Map: Natural Earth" x={1060} />
    </AbsoluteFill>
  );
};

/** The Four Sights: the prince (from behind) meets an old man. */
const FourSights: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('The story') - 1;
  return (
    <Photo src="img/gen/v1_ch3_four_sights.jpg" size={GEN} fx={688} fy={384} z0={1.02} z1={1.1} a={a} b={t.at('He gave')} bw={PAINT} vignette={0.7}
      mask={MASKS.old_man} traceAt={t.at('old') + 2}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 32%)'}} />
          <Note text="he left the palace and saw..." x={560} y={70} size={52} rot={-2} at={t.at('left') - 3} color={WHITE} />
          <Note text="an old man" x={660} y={170} size={56} rot={-3} at={t.at('old') - 3} />
          <Note text="a sick man" x={660} y={250} size={56} rot={-3} at={t.at('sick') - 3} />
          <Note text="a dead body" x={660} y={330} size={56} rot={-3} at={t.at('dead') - 3} />
          <Note text="if everyone suffers... what's the point?" x={60} y={950} size={52} rot={-2} at={t.at('If everyone') - 3} color={pal.subject} />
          <Tag text="Illustration · Prince Siddhartha, seen from behind, meets an old man (AI-generated)" />
        </>
      )}
    </Photo>
  );
};

/** Enlightenment under the Bodhi tree. */
const Tree: React.FC<{t: TL}> = ({t}) => (
  <Photo src="img/bg/tree_gate.jpg" size={[1920, 1310]} fx={960} fy={560} z0={1.03} z1={1.12} a={t.at('He gave')} b={t.at('His answer')} bw={MUTED} vignette={0.75}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 42%)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 42%)'}} />
        <Note text="gave up everything" x={110} y={90} size={54} rot={-3} at={t.at('gave') - 3} color={WHITE} />
        <Note text="Bodh Gaya, India" x={140} y={195} size={50} rot={-2} at={t.at('Bodh') - 3} />
        <Note text="→ enlightenment" x={140} y={300} size={54} rot={-3} at={t.at('enlightenment') - 3} />
        <Highlight text="THE BUDDHA" x={110} y={780} size={112} at={t.at('Buddha')} seed={402} rot={-2} />
        <Note text={'"the awakened one"'} x={900} y={820} size={60} rot={-4} at={t.at('awakened') - 3} color={WHITE} />
        <Tag text="The Bodhi tree, Mahabodhi Temple · Photo Dharma, CC BY 2.0, via Wikimedia Commons" />
      </>
    )}
  </Photo>
);

/** The teaching: suffering, desire, the Eightfold Path to nirvana. */
const Teaching: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const g = useGFrame();
  const p0 = t.at('Path');
  const nv = t.at('nirvana');
  // eight stepping stones rising left to right toward nirvana
  const stones = Array.from({length: 8}, (_, i) => ({x: 200 + i * 135, y: 930 - i * 32 - Math.sin(i * 0.9) * 14}));
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="his answer:" x={110} y={80} size={56} rot={-3} at={t.at('was this') - 3} color={WHITE} />
      <Note text="suffering" x={130} y={170} size={78} rot={-3} at={t.at('suffering') - 3} color={pal.subject} />
      <Note text="← comes from desire + attachment" x={480} y={190} size={58} rot={-2} at={t.at('desire') - 3} />
      <Highlight text="EIGHTFOLD PATH" x={110} y={320} size={84} at={t.at('Eightfold')} seed={403} rot={-2} />
      <Def term="Eightfold Path" def="the Buddha's eight practices (right speech, right action, right mindfulness and more) that lead out of suffering"
        at={t.at('Eightfold') + 9} out={nv + 8} x={110} y={470} w={1180} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        {stones.map((s, i) => {
          const at = p0 + i * 3;
          if (g < at) return null;
          const k = interpolate(g, [at, at + 4, at + 6], [0, 1.25, 1], clamp);
          return (
            <g key={i}>
              {i > 0 && <line x1={stones[i - 1].x + 40} y1={stones[i - 1].y} x2={s.x - 40} y2={s.y} stroke={pal.mark} strokeWidth={4} strokeDasharray="8 8" opacity={0.7} />}
              <ellipse cx={s.x} cy={s.y} rx={40 * k} ry={22 * k} fill="rgba(47,224,196,0.18)" stroke={pal.mark} strokeWidth={5} />
              <text x={s.x} y={s.y + 11} textAnchor="middle" style={{fontFamily: JF.display, fontSize: 32 * k, fill: '#f4efe6'}}>{i + 1}</text>
            </g>
          );
        })}
      </svg>
      {g >= nv && <Arrow x1={stones[7].x + 50} y1={stones[7].y - 10} x2={1350} y2={700} bow={-30} at={nv} dur={6} />}
      <Highlight text="NIRVANA" x={1370} y={610} size={92} at={nv} seed={404} rot={-3} />
      <Def term="Nirvana" def="freedom from suffering and from the cycle of rebirth; perfect peace" at={nv + 9} x={110} y={470} w={1180} />
      <Tag text="Diagram · the Eightfold Path, simplified" />
    </AbsoluteFill>
  );
};

/** Open to anyone: a universalizing religion. */
const Open: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('open') - 1;
  const people = [
    {x: 1000, dress: false, hat: false}, {x: 1110, dress: true, hat: false}, {x: 1220, dress: false, hat: true}, {x: 1330, dress: true, hat: false},
    {x: 1440, dress: false, hat: false}, {x: 1550, dress: false, hat: true}, {x: 1660, dress: true, hat: false}, {x: 1770, dress: false, hat: false},
  ];
  const cols = [PAL.cream, PAL.teal, PAL.orange, PAL.cream, PAL.coral, PAL.teal, PAL.cream, PAL.orange];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="the path is open to anyone" x={110} y={90} size={64} rot={-3} at={a + 2} color={WHITE} />
      <Note text="any family, any background" x={150} y={200} size={58} rot={-2} at={t.at('family') - 3} />
      {people.map((p, i) => (
        <Person key={i} x={p.x} y={520} h={200 - (i % 3) * 14} color={cols[i]} at={a + 4 + i * 3} dress={p.dress} hat={p.hat} />
      ))}
      <Highlight text="UNIVERSALIZING RELIGION" x={110} y={600} size={84} at={t.at('universalizing')} seed={405} rot={-2} />
      <Definition term="Universalizing religion" def="a religion that tries to appeal to all people, anywhere, not just one ethnic group or place"
        at={t.at('universalizing') + 9} x={110} y={740} w={1250} />
      <Note text="so how did it leave India?" x={900} y={910} size={58} rot={-3} at={t.at('So how') - 3} color={pal.subject} />
      <Tag text="Diagram" />
    </AbsoluteFill>
  );
};

/** Ashoka at Kalinga. */
const Ashoka: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Photo src="img/gen/v1_ch3_ashoka_kalinga.jpg" size={GEN} fx={688} fy={384} z0={1.02} z1={1.09} a={t.at('The answer starts')} b={t.at('Afterward')} bw={PAINT} vignette={0.7}
      mask={MASKS.ashoka} traceAt={t.at('Ashoka') + 2}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 40%)'}} />
          <Note text="it starts with a war" x={1000} y={80} size={56} rot={-3} at={t.at('war') - 3} color={WHITE} />
          <Note text="c. 260 BCE" x={1000} y={160} size={60} rot={-3} at={t.at('260') - 3} />
          <Highlight text="ASHOKA" x={1000} y={260} size={96} at={t.at('Ashoka')} seed={406} rot={-2} />
          <Note text="conquers Kalinga" x={1000} y={400} size={56} rot={-2} at={t.at('Kalinga') - 3} color={WHITE} />
          <Stamp text="100,000+" x={1000} y={560} size={130} at={t.at('100000')} color={pal.subject} rot={-3} />
          <Note text="killed" x={1480} y={700} size={60} rot={-3} at={t.at('people', 2) - 3} color={WHITE} />
          <Tag text="Illustration · Ashoka surveys the Kalinga battlefield (AI-generated)" />
        </>
      )}
    </Photo>
  );
};

/** Ashoka close: horrified, he turns to Buddhism and spreads it. */
const Turn: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Photo src="img/gen/v1_ch3_ashoka_kalinga.jpg" size={GEN} fx={640} fy={330} z0={1.45} z1={1.58} a={t.at('Afterward')} b={t.at('He carved')} bw={PAINT} vignette={0.75}
      mask={MASKS.ashoka} traceAt={t.at('Afterward') + 3}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(270deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 45%)'}} />
          <Note text="horrified" x={1080} y={140} size={72} rot={-3} at={t.at('horrified') - 3} color={WHITE} />
          <Note text="→ turns to Buddhism" x={1080} y={260} size={56} rot={-2} at={t.at('turned') - 3} />
          <Note text="then spreads it" x={1180} y={760} size={64} rot={-3} at={t.at('spread') - 3} color={pal.subject} />
          <Note text="everywhere" x={1260} y={850} size={64} rot={-3} at={t.at('everywhere', 1) - 3} color={pal.subject} />
          <Tag text="Illustration · Ashoka after the Kalinga war (AI-generated)" />
        </>
      )}
    </Photo>
  );
};

/** Pillars and edicts on the desk. */
const Pillars: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('He carved');
  const lion = hasFile('img/ch03/lion_capital.jpg');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src="img/ch03/ashoka_pillar.jpg" size={[888, 1644]} x={150} y={90} w={360} h={660} fx={444} fy={822} scale={0.405} rot={-3} at={a + 1} bw={MUTED} />
      <CropCard src="img/ch03/ashoka_edict.jpg" size={[1920, 2697]} x={640} y={130} w={600} h={600} fx={960} fy={1250} scale={0.55} rot={2} at={t.at('teachings') - 1} />
      {lion && <CropCard src="img/ch03/lion_capital.jpg" size={[1920, 2560]} x={1370} y={90} w={410} h={600} fx={930} fy={760} scale={0.66} rot={-2} at={t.at('pillars') - 1} bw={MUTED} />}
      <Note text="Buddhist teachings carved in stone" x={120} y={790} size={54} rot={-2} at={t.at('teachings') - 3} />
      <Note text="on pillars across his empire" x={160} y={868} size={54} rot={-3} at={t.at('across') - 3} color={WHITE} />
      <Note text="+ missionaries sent abroad" x={1000} y={868} size={54} rot={-3} at={t.at('missionaries') - 3} />
      <Tag text={`Pillar: M. V. P. Maurya, CC BY 2.0 · Edict rubbing: E. Hultzsch 1925, PD${lion ? ' · Lion capital: lisa bat, CC BY 2.0' : ''} · via Wikimedia Commons`} x={44} y={1036} />
    </AbsoluteFill>
  );
};

/** The Mauryan Empire, edict sites, the son to Sri Lanka: hierarchical diffusion. */
const Hierarchical: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('including') - 1;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 68, lat: 20, z: 4.2}, {f: t.at('Then came'), lon: 69, lat: 20, z: 4.4}]}>
        {(S) => {
          const [px, py] = S(L.pataliputra);
          const [sx, sy] = S(L.anuradhapura);
          const [kx, ky] = S(L.kandahar);
          const [mx, my] = S(L.suvarnabhumi);
          const [ex, ey] = S([77.5, 24.5]);
          return (
            <>
              <Region pts={MAURYA} S={S} at={a} color={PAL.orange} opacity={0.16} dashed />
              <MapLabel text="Mauryan Empire" x={ex} y={ey} at={a + 2} color={PAL.orange} size={30} align="center" />
              {EDICTS.map((ll, i) => {
                const [x, y] = S(ll);
                return <Dot key={i} x={x} y={y} at={a + 2 + i} r={6} color={PAL.cream} ring={false} />;
              })}
              <Dot x={px} y={py} at={a + 2} r={13} color={PAL.coral} />
              <MapLabel text="Pataliputra (capital)" x={px + 40} y={py + 10} at={a + 2} color={PAL.coral} size={28} />
              <Arrow x1={px - 10} y1={py + 30} x2={sx + 10} y2={sy - 30} bow={-90} at={t.at('carried') - 2} dur={10} width={6} />
              <MapLabel text="his son → Sri Lanka" x={sx + 50} y={sy + 6} at={t.at('Sri')} color={PAL.teal} size={30} />
              <Arrow x1={px - 40} y1={py - 30} x2={kx + 30} y2={ky + 20} bow={50} at={t.at('his own') - 2} dur={10} width={4} />
              <Arrow x1={px + 36} y1={py + 10} x2={mx - 20} y2={my - 10} bow={-40} at={t.at('his own') + 2} dur={10} width={4} />
              <MapLabel text="missionaries" x={mx - 30} y={my + 50} at={t.at('his own') + 10} color={PAL.teal} size={24} align="center" />
            </>
          );
        }}
      </WorldMap>
      <Highlight text="HIERARCHICAL DIFFUSION" x={70} y={720} size={70} at={t.at('hierarchical')} seed={407} rot={-2} />
      <Definition term="Hierarchical diffusion" def="spreads from the top down: from powerful people or places to everyone else" at={t.at('hierarchical') + 9} x={70} y={845} w={1000} />
      <Tag text="Dots: Ashoka's pillar and rock edict sites (approx.) · Empire outline simplified · Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** The second wave: a monk with a Silk Road caravan. */
const SilkMonk: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Photo src="img/gen/v1_ch3_silk_road.jpg" size={GEN} fx={688} fy={384} z0={1.02} z1={1.1} a={t.at('Then came')} b={t.at('into China')} bw={PAINT} vignette={0.7}
      mask={MASKS.silk_monk} traceAt={t.at('Monks') + 2}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 36%)'}} />
          <Note text="the second wave" x={900} y={80} size={60} rot={-3} at={t.at('second') - 3} color={WHITE} />
          <Note text="monks + merchants" x={940} y={180} size={64} rot={-2} at={t.at('Monks') - 3} />
          <Note text="person to person" x={940} y={280} size={64} rot={-3} at={t.at('person') - 3} color={pal.subject} />
          <Tag text="Illustration · a Buddhist monk travels with a Silk Road caravan (AI-generated)" />
        </>
      )}
    </Photo>
  );
};

/** The Silk Road and the sea route: contagious diffusion. */
const SilkMap: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('into China') - 1;
  const c = t.at('contagious');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 96, lat: 30, z: 3.0}, {f: t.at('forming'), lon: 101, lat: 27, z: 3.1}]}
        fills={[{id: C.china, at: t.at('China') + 4, color: PAL.coral, opacity: 0.3}, {id: C.southKorea, at: t.at('Korea') + 4, color: PAL.coral, opacity: 0.35},
          {id: NORTH_KOREA, at: t.at('Korea') + 4, color: PAL.coral, opacity: 0.35}, {id: C.japan, at: t.at('Japan') + 4, color: PAL.coral, opacity: 0.35},
          {id: C.myanmar, at: t.at('Southeast') + 2, color: PAL.coral, opacity: 0.3}, {id: C.thailand, at: t.at('Southeast') + 4, color: PAL.coral, opacity: 0.3},
          {id: C.cambodia, at: t.at('Southeast') + 6, color: PAL.coral, opacity: 0.3}, {id: C.india, at: a, color: PAL.cream, opacity: 0.1}]}>
        {(S) => {
          const [hx, hy] = S(L.pataliputra);
          const [cx, cy] = S([86, 41.5]);
          const [sx, sy] = S([93, 11]);
          const [kx, ky] = S(L.nara);
          const [xx, xy] = S(L.xian);
          return (
            <>
              <Route pts={SILK} S={S} at={a + 1} dur={22} />
              <MapLabel text="Silk Road" x={cx} y={cy - 40} at={a + 10} color={PAL.teal} size={30} align="center" />
              <Dot x={xx} y={xy} at={t.at('China')} r={9} color={PAL.coral} />
              <MapLabel text="China" x={xx + 30} y={xy + 34} at={t.at('China')} size={28} />
              <Route pts={KOREA_JAPAN} S={S} at={t.at('Korea') - 2} dur={14} />
              <MapLabel text="Korea + Japan" x={kx - 20} y={ky + 54} at={t.at('Japan')} size={28} align="right" />
              <Route pts={SEA} S={S} at={t.at('sea') - 2} dur={18} dashed />
              <MapLabel text="by sea" x={sx - 60} y={sy + 40} at={t.at('sea') + 4} color={PAL.teal} size={30} align="right" />
              <Dot x={hx} y={hy} at={a} r={11} color={PAL.coral} ring={false} />
              {/* contagious: town to town along the road, each lights its neighbour */}
              {SILK.slice(1).concat(KOREA_JAPAN.slice(1)).map((ll, i) => {
                const [x, y] = S(ll);
                return <Dot key={i} x={x} y={y} at={c + 2 + i * 2} r={7} color={PAL.teal} ring={false} />;
              })}
            </>
          );
        }}
      </WorldMap>
      <Highlight text="CONTAGIOUS DIFFUSION" x={50} y={720} size={58} at={c} seed={408} rot={-2} />
      <Definition term="Contagious diffusion" def="spreads person to person, neighbor to neighbor, like a contagion" at={c + 9} x={50} y={820} w={660} />
      <Note text="adapting to each new place..." x={1000} y={930} size={54} rot={-3} at={t.at('adapted') - 3} color={pal.subject} />
      <Tag text="Routes simplified · Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** Three branches, three colours. */
const Branches: React.FC<{t: TL}> = ({t}) => {
  const th = t.at('Theravada');
  const ma = t.at('Mahayana');
  const va = t.at('Vajrayana');
  const fills: Fill[] = [
    ...[C.sriLanka, C.myanmar, C.thailand, C.laos, C.cambodia].map((id, i) => ({id, at: th + i * 2, color: PAL.orange, opacity: 0.7})),
    ...[C.china, C.southKorea, NORTH_KOREA, C.japan, C.vietnam, C.taiwan].map((id, i) => ({id, at: ma + i * 2, color: PAL.coral, opacity: 0.6})),
    ...[C.bhutan, C.mongolia].map((id, i) => ({id, at: va + 4 + i * 2, color: PAL.teal, opacity: 0.7})),
  ];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: t.at('forming') - 1, lon: 92, lat: 24, z: 2.9}, {f: t.at('Walk'), lon: 93, lat: 25, z: 3.05}]} fills={fills}>
        {(S) => {
          const [tx, ty] = S([91, 31.8]);
          return (
            <>
              <Region pts={TIBET} S={S} at={va + 2} color={PAL.teal} opacity={0.7} />
              <MapLabel text="Tibet" x={tx} y={ty} at={va + 6} size={26} align="center" color="#111" />
            </>
          );
        }}
      </WorldMap>
      <Note text="different branches:" x={90} y={70} size={60} rot={-3} at={t.at('branches') - 3} color={WHITE} />
      <div style={{position: 'absolute', left: 60, top: 160, width: 600, height: 480, background: 'rgba(13,12,9,0.78)', borderRadius: 6, opacity: interpolate(useGFrame(), [th - 4, th], [0, 1], clamp)}} />
      <Swatch color={PAL.orange} x={90} y={200} at={th} />
      <Highlight text="THERAVADA" x={150} y={180} size={52} at={th} seed={409} rot={-1} />
      <Note text="Sri Lanka + Southeast Asia" x={160} y={258} size={36} rot={-2} at={th + 6} color={WHITE} />
      <Swatch color={PAL.coral} x={90} y={355} at={ma} />
      <Highlight text="MAHAYANA" x={150} y={335} size={52} at={ma} seed={410} rot={-1} />
      <Note text="China, Korea, Japan, Vietnam" x={160} y={413} size={36} rot={-2} at={ma + 6} color={WHITE} />
      <Swatch color={PAL.teal} x={90} y={510} at={va} />
      <Highlight text="VAJRAYANA" x={150} y={490} size={52} at={va} seed={411} rot={-1} />
      <Note text="Tibet + Mongolia" x={160} y={568} size={36} rot={-2} at={va + 6} color={WHITE} />
      <Tag text="Simplified: main branch by country; many places mix traditions · Map: Natural Earth" x={760} />
    </AbsoluteFill>
  );
};

const Swatch: React.FC<{color: string; x: number; y: number; at: number}> = ({color, x, y, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  return <div style={{position: 'absolute', left: x, top: y, width: 34, height: 34, borderRadius: 4, background: color, boxShadow: '0 0 0 3px #111'}} />;
};

/** Luang Prabang at sunrise: the alms line. */
const Alms: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Walk');
  const ok = hasFile('img/ch03/alms_luang_prabang.jpg');
  const notes = (
    <>
      <Highlight text="LUANG PRABANG, LAOS" x={90} y={70} size={76} at={t.at('Luang')} seed={412} rot={-2} />
      <Note text="just after sunrise" x={1060} y={330} size={58} rot={-3} at={t.at('sunrise') - 3} color={WHITE} />
      <Note text="Buddhism in daily life" x={1060} y={420} size={58} rot={-3} at={t.at('daily') - 3} />
      <Note text="monks in saffron robes" x={620} y={200} size={52} rot={-2} at={t.at('saffron') - 3} color={WHITE} />
    </>
  );
  if (!ok) return <AbsoluteFill><PinMap ll={L.luangPrabang} label="Luang Prabang" at={a} />{notes}<Tag text="Map: Natural Earth" /></AbsoluteFill>;
  return (
    <Photo src="img/ch03/alms_luang_prabang.jpg" size={[1920, 1280]} fx={960} fy={640} z0={1.02} z1={1.1} a={a} b={t.at('and people kneel')} bw={MUTED} vignette={0.7}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 30%)'}} />
          {notes}
          <Tag text="Morning alms, Luang Prabang · Akiyoshi Matsuoka, CC BY 3.0, via Wikimedia Commons" />
        </>
      )}
    </Photo>
  );
};

/** Sticky rice into the bowls: community and monks give to each other. */
const Rice: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('and people kneel');
  const pal = usePal();
  const ok = hasFile('img/ch03/alms_line.jpg');
  const notes = (
    <>
      <Note text="sticky rice" x={1380} y={560} size={60} rot={-3} at={t.at('sticky') - 3} color={WHITE} />
      <Note text="the community feeds the monks →" x={110} y={820} size={56} rot={-2} at={t.at('community') - 3} />
      <Note text="← the monks offer teaching + blessings" x={110} y={910} size={56} rot={-2} at={t.at('offer') - 3} color={pal.subject} />
    </>
  );
  if (!ok) return <AbsoluteFill><PinMap ll={L.luangPrabang} label="Luang Prabang" at={a} />{notes}<Tag text="Map: Natural Earth" /></AbsoluteFill>;
  return (
    <Photo src="img/ch03/alms_line.jpg" size={[1920, 1280]} fx={960} fy={700} z0={1.04} z1={1.1} a={a} b={t.at('In Thailand')} bw={MUTED} vignette={0.7}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 40%)'}} />
          <Loop cx={1250} cy={700} rx={120} ry={70} at={t.at('sticky')} seed={41} tilt={-6} />
          {notes}
          <Tag text="Monks' alms at dawn, Luang Prabang · Benh Lieu Song, CC BY-SA 3.0, via Wikimedia Commons" />
        </>
      )}
    </Photo>
  );
};

/** Young novices. */
const Novices: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('In Thailand');
  const pal = usePal();
  const ok = hasFile('img/ch03/young_novices.jpg');
  const notes = (
    <>
      <Note text="Thailand + Myanmar" x={110} y={700} size={58} rot={-3} at={t.at('Thailand') - 3} color={WHITE} />
      <Note text="many young men become monks..." x={110} y={790} size={62} rot={-2} at={t.at('many') - 3} />
      <Note text="...for just a few weeks" x={160} y={880} size={62} rot={-3} at={t.at('few') - 3} color={pal.subject} />
    </>
  );
  if (!ok) return <AbsoluteFill><PinMap ll={centroid(C.myanmar)} label="Myanmar" at={a} z={5} />{notes}<Tag text="Map: Natural Earth" /></AbsoluteFill>;
  return (
    <Photo src="img/ch03/young_novices.jpg" size={[1920, 1280]} fx={960} fy={560} z0={1.02} z1={1.08} a={a} b={t.at('Families')} bw={MUTED} vignette={0.7}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 45%)'}} />
          {notes}
          <Tag text="Novice monks at Shwedagon, Yangon · Daniel Julie, CC BY 2.0, via Wikimedia Commons" />
        </>
      )}
    </Photo>
  );
};

/** The shinbyu: a celebration, then head shaved, robes, temple, home. */
const Shinbyu: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Families');
  const pal = usePal();
  const ok = hasFile('img/ch03/shinbyu_procession.jpg');
  const steps: [string, string, number][] = [['shave head', 'shaves', 0], ['robes', 'the robes', 1], ['live at temple', 'temple', 2], ['come home', 'comes home', 3]];
  const xs = [100, 450, 720, 1150];
  const notes = (
    <>
      <Note text="families throw a celebration" x={100} y={80} size={58} rot={-3} at={t.at('celebration') - 3} color={WHITE} />
      {steps.map(([s, w, i]) => (
        <Note key={s} text={i < 3 ? `${s} →` : s} x={xs[i]} y={945} size={46} rot={-2} at={t.at(w) - 3} color={i === 3 ? WHITE : undefined} />
      ))}
      <Highlight text="A RITE OF PASSAGE" x={100} y={690} size={76} at={t.at('rite')} seed={413} rot={-2} />
      <Note text="a gap semester for the soul" x={130} y={820} size={54} rot={-3} at={t.at('gap') - 3} color={pal.subject} />
    </>
  );
  if (!ok) return <AbsoluteFill><DarkPaper />{notes}<Tag text="Diagram" /></AbsoluteFill>;
  return (
    <Photo src="img/ch03/shinbyu_procession.jpg" size={[1920, 1447]} fx={960} fy={640} z0={1.02} z1={1.08} a={a} b={t.at('And Buddhism is still')} bw={MUTED} vignette={0.7}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 38%)'}} />
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 22%)'}} />
          {notes}
          <Tag text="Shinbyu novice celebration, Rakhine State, Myanmar · Daniel Julie, CC BY 2.0, via Wikimedia Commons" />
        </>
      )}
    </Photo>
  );
};

/** Still diffusing: meditation apps and the mindfulness minute. */
const Meditation: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('And Buddhism is still');
  const b = t.at('Buddhist meditation');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="still diffusing, in new ways" x={100} y={90} size={64} rot={-3} at={t.at('still') - 3} color={WHITE} />
      <Phone x={1300} y={170} at={t.at('apps') - 4} />
      <Note text="meditation apps" x={140} y={260} size={62} rot={-2} at={t.at('meditation') - 3} />
      <Arrow x1={620} y1={290} x2={1270} y2={300} bow={-30} at={t.at('apps')} />
      <Note text="the mindfulness minute before a test" x={140} y={380} size={58} rot={-3} at={t.at('mindfulness') - 3} />
      <Note text="both trace back to..." x={140} y={520} size={58} rot={-2} at={t.at('Both') - 3} color={WHITE} />
      <Highlight text="BUDDHIST MEDITATION" x={110} y={640} size={84} at={b} seed={414} rot={-2} />
      <Tag text="Drawn phone · no real app shown" />
    </AbsoluteFill>
  );
};

/** The puzzle again: India dark, Buddhist Asia lit. */
const Puzzle: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Which brings');
  const fills: Fill[] = BUDDHIST.map((id, i) => ({id, at: a + 2 + (i % 6) * 3, color: PAL.coral, opacity: 0.6}));
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 100, lat: 28, z: 3.2}, {f: t.at('Historians'), lon: 96, lat: 27, z: 3.5}]} fills={fills}>
        {(S) => {
          const [ix, iy] = S([79, 22]);
          return (
            <>
              <Loop cx={ix} cy={iy} rx={200} ry={230} at={t.at('fade')} seed={9} tilt={-8} />
              <Note text="so why did it fade in India?" x={Math.max(60, ix - 360)} y={iy + 270} size={60} rot={-3} at={t.at('why') - 3} color={pal.subject} />
            </>
          );
        }}
      </WorldMap>
      <Note text="back to our puzzle:" x={110} y={80} size={60} rot={-3} at={t.at('puzzle') - 3} color={WHITE} />
      <Note text="it spread so far..." x={150} y={170} size={60} rot={-3} at={t.at('spread', 2) - 3} />
      <Tag text="Shaded: countries where Buddhism is the majority or a major religion today · Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** Reason 1: lost the kings. */
const Reason1: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Historians');
  const l = t.at('lost');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="historians point to a few reasons" x={110} y={80} size={62} rot={-3} at={a - 2} color={WHITE} />
      <ReasonCard n={1} text="lost royal support" x={120} y={260} at={l - 2} rot={-2} />
      <ReasonCard n={2} text="" x={710} y={260} at={a + 6} ghost rot={1} />
      <ReasonCard n={3} text="" x={1300} y={260} at={a + 9} ghost rot={-1} />
      <DrawnCrown x0={250} x1={470} y={800} h={110} at={t.at('kings') - 2} />
      {useGFrame() >= t.at('kings') + 10 && (
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <path d="M220,660 L500,830 M500,660 L220,830" stroke={pal.subject} strokeWidth={12} strokeLinecap="round" />
        </svg>
      )}
      <Note text="Indian kings stopped backing it" x={600} y={700} size={58} rot={-2} at={t.at('kings') - 3} />
      <Note text="the same royal backing that spread it" x={600} y={800} size={58} rot={-3} at={t.at('same kind') - 3} color={WHITE} />
      <Tag text="Diagram" />
    </AbsoluteFill>
  );
};

/** Reason 2: Hinduism revived and absorbed Buddhist ideas. */
const Reason2: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const g = useGFrame();
  const a = t.at('Hinduism revived');
  const ab = t.at('absorbed');
  // the small Buddhist-ideas circle drifts into the big Hinduism circle
  const k = interpolate(g, [ab, ab + 30], [0, 1], {...clamp, easing: (x) => 1 - Math.pow(1 - x, 3)});
  const bx = 1790 - 380 * k;
  const by = 480;
  const grow = interpolate(g, [a, a + 8], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <ReasonCard n={1} text="lost royal support" x={80} y={60} w={340} h={190} size={32} num={56} at={-999} rot={-2} />
      <ReasonCard n={2} text="Hinduism absorbed it" x={460} y={60} w={440} h={190} size={32} num={56} at={a} rot={1} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <circle cx={1400} cy={480} r={240 * grow} fill="rgba(255,159,28,0.16)" stroke={PAL.orange} strokeWidth={6} />
        {g >= ab - 4 && <circle cx={bx} cy={by} r={90} fill="rgba(255,111,97,0.3)" stroke={pal.subject} strokeWidth={6} />}
      </svg>
      <MapLabel text="Hinduism" x={1400} y={200} at={a + 2} color={PAL.orange} size={38} align="center" />
      <MapLabel text="Buddhist ideas" x={Math.min(bx, 1700)} y={770} at={ab - 2} color={pal.subject} size={30} align="center" />
      <Note text="revived" x={110} y={360} size={66} rot={-3} at={t.at('revived') - 3} color={WHITE} />
      <Note text="and absorbed many Buddhist ideas" x={110} y={450} size={58} rot={-2} at={ab - 3} />
      <Note text="some Hindus honor the Buddha" x={110} y={800} size={60} rot={-3} at={t.at('honor') - 3} color={WHITE} />
      <Note text="as a form of the god Vishnu" x={160} y={890} size={60} rot={-3} at={t.at('Vishnu') - 3} color={pal.subject} />
      <Tag text="Diagram" />
    </AbsoluteFill>
  );
};

/** Reason 3: Nalanda destroyed. */
const Nalanda: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('And around');
  return (
    <Photo src="img/gen/v1_ch3_nalanda.jpg" size={GEN} fx={688} fy={384} z0={1.02} z1={1.09} a={a} b={t.at('whose ruins')} bw={PAINT} vignette={0.7}
      mask={MASKS.nalanda_monk} traceAt={t.at('monastery-universities') + 2}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 45%)'}} />
          <ReasonCard n={3} text="Nalanda destroyed, c. 1200" x={70} y={60} w={440} h={200} size={34} num={56} at={a} rot={-2} />
          <Note text="around 1200: invading armies" x={100} y={640} size={58} rot={-3} at={t.at('invading') - 3} color={WHITE} />
          <Note text="destroyed great monastery-universities" x={100} y={730} size={54} rot={-2} at={t.at('destroyed') - 3} />
          <Highlight text="NALANDA" x={100} y={840} size={100} at={t.at('Nalanda')} seed={415} rot={-2} />
          <Tag text="Illustration · Nalanda, a Buddhist monastery-university, before 1200 (AI-generated)" />
        </>
      )}
    </Photo>
  );
};

/** Nalanda's ruins today, and the turn to the conclusion. */
const Ruins: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('whose ruins');
  const ok = hasFile('img/ch03/nalanda_ruins.jpg');
  const notes = (
    <>
      <Note text="Nalanda's ruins, Bihar, India" x={100} y={90} size={58} rot={-3} at={a + 2} color={WHITE} />
      <Note text="you can still visit today" x={140} y={180} size={56} rot={-3} at={t.at('visit') - 3} />
      <Note text="what made it spread:" x={110} y={790} size={58} rot={-3} at={t.at('In other words') - 3} color={WHITE} />
      <Note text="it could travel anywhere" x={160} y={880} size={64} rot={-2} at={t.at('travel') - 3} color={pal.subject} />
    </>
  );
  if (!ok) return <AbsoluteFill><PinMap ll={L.nalanda} label="Nalanda" at={a} />{notes}<Tag text="Map: Natural Earth" /></AbsoluteFill>;
  return (
    <Photo src="img/ch03/nalanda_ruins.jpg" size={[1920, 1280]} fx={960} fy={600} z0={1.02} z1={1.1} a={a} b={t.at('also meant')} bw={MUTED} vignette={0.7}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 40%)'}} />
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 25%)'}} />
          {notes}
          <Tag text="Nalanda Mahavihara, Bihar · Sumitsurai, CC BY-SA 4.0, via Wikimedia Commons" />
        </>
      )}
    </Photo>
  );
};

/** The ending: the hearth faded, the religion lived on. */
const Ending: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const g = useGFrame();
  const a = t.at('also meant');
  const h = t.at('hearth');
  const fills: Fill[] = BUDDHIST.map((id) => ({id, at: a - 30, color: PAL.coral, opacity: 0.6}));
  const fade = interpolate(g, [h + 6, h + 30], [1, 0.25], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 92, lat: 24, z: 3.6}, {f: a + 200, lon: 100, lat: 26, z: 3.0}]} fills={fills}>
        {(S) => {
          const [bx, by] = S(P.bodhGaya);
          const targets: [number, number][] = [centroid(C.sriLanka), centroid(C.thailand), [104, 34], centroid(C.japan), centroid(C.mongolia), [91.1, 29.65]];
          return (
            <>
              {targets.map((ll, i) => {
                const [x, y] = S(ll);
                return <Arrow key={i} x1={bx} y1={by} x2={x} y2={y} bow={i % 2 ? 40 : -40} at={a + 4 + i * 3} dur={8} width={4} />;
              })}
              <div style={{opacity: fade}}>
                <Dot x={bx} y={by} at={a} r={15} color={PAL.orange} />
              </div>
              <MapLabel text="Bodh Gaya" x={bx - 40} y={by + 50} at={a} align="right" color={PAL.orange} size={30} />
            </>
          );
        }}
      </WorldMap>
      <Note text="it didn't need India to survive" x={100} y={80} size={62} rot={-3} at={t.at("didn't") - 3} color={WHITE} />
      <Highlight text="HEARTH" x={100} y={770} size={90} at={h} seed={416} rot={-2} />
      <Definition term="Hearth" def="the place where a religion or other culture trait began" at={h + 9} x={100} y={900} w={760} />
      <Note text="...the religion lived on" x={1120} y={920} size={54} rot={-3} at={t.at('lived') - 3} color={pal.subject} />
      <Tag text="Shaded: countries where Buddhism is the majority or a major religion today · Map: Natural Earth" />
    </AbsoluteFill>
  );
};

// ---------- the chapter ----------

const T = makeTimeline(N, 30);

const Body: React.FC = () => {
  const t = T;
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Border t={t} />],
    [at('The story') - 1, <FourSights t={t} />],
    [at('He gave') - 1, <Tree t={t} />],
    [at('His answer') - 1, <Teaching t={t} />],
    [at('open') - 1, <Open t={t} />],
    [at('The answer starts') - 1, <Ashoka t={t} />],
    [at('Afterward') - 1, <Turn t={t} />],
    [at('He carved') - 1, <Pillars t={t} />],
    [at('including') - 1, <Hierarchical t={t} />],
    [at('Then came') - 1, <SilkMonk t={t} />],
    [at('into China') - 1, <SilkMap t={t} />],
    [at('forming') - 1, <Branches t={t} />],
    [at('Walk') - 1, <Alms t={t} />],
    [at('and people kneel') - 1, <Rice t={t} />],
    [at('In Thailand') - 1, <Novices t={t} />],
    [at('Families') - 1, <Shinbyu t={t} />],
    [at('And Buddhism is still') - 1, <Meditation t={t} />],
    [at('Which brings') - 1, <Puzzle t={t} />],
    [at('Historians') - 1, <Reason1 t={t} />],
    [at('Hinduism revived') - 1, <Reason2 t={t} />],
    [at('And around') - 1, <Nalanda t={t} />],
    [at('whose ruins') - 1, <Ruins t={t} />],
    [at('also meant') - 1, <Ending t={t} />],
  ];
  const scene = useScene(cuts);
  // stamps on every Highlight / Stamp; marker under every Note (3 frames early); ticks on pins, arrows and cards
  const stamps = ['Siddhartha', 'Buddha', 'Eightfold', 'nirvana', 'universalizing', 'Ashoka', '100000', 'hierarchical', 'contagious', 'Theravada', 'Mahayana',
    'Vajrayana', 'Luang', 'rite', 'Buddhist meditation', 'Nalanda', 'hearth'].map((w) => at(w));
  const notes = ['2500', 'surrounded', 'left', 'old', 'sick', 'dead', 'If everyone', 'gave', 'Bodh', 'enlightenment', 'awakened', 'was this', 'suffering', 'desire',
    'family', 'So how', 'war', '260', 'Kalinga', 'horrified', 'turned', 'spread', 'teachings', 'across', 'missionaries', 'second', 'Monks', 'person', 'adapted',
    'branches', 'sunrise', 'daily', 'saffron', 'sticky', 'community', 'offer', 'Thailand', 'many', 'few', 'celebration', 'shaves', 'the robes', 'temple', 'comes home',
    'gap', 'still', 'meditation', 'mindfulness', 'Both', 'puzzle', 'why', 'kings', 'same kind', 'revived', 'absorbed', 'honor', 'Vishnu', 'invading', 'destroyed',
    'visit', 'In other words', 'travel', "didn't", 'lived'].map((w) => at(w)).concat([at('open') + 1, at('people', 2), at('whose ruins') + 2, at('Historians') - 2]);
  const ticks = ['prince', 'carried', 'Sri', 'China', 'Korea', 'sea', 'lost', 'apps'].map((w) => at(w)).concat([at('And around'), at('also meant') + 4]);
  return (
    <>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={'w' + i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {stamps.map((f, i) => <Sfx key={'s' + i} at={f} src="sfx/stamp.wav" volume={0.27} />)}
      {notes.map((f, i) => <Sfx key={'n' + i} at={f - 3} src={WRITE.src} volume={WRITE.volume} />)}
      {ticks.map((f, i) => <Sfx key={'t' + i} at={f} src="sfx/tick.wav" volume={0.4} />)}
    </>
  );
};

const SWITCH = T.at('Which brings');

export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch04_buddhism.wav" lead={LEAD}
    music={[{src: 'music/w_calm_sea.mp3', volume: 0.17, to: SWITCH + 6}, {src: 'music/j_intrigue.mp3', volume: 0.22, from: SWITCH - 6}]}>
    <Body />
  </ChapterShell>
);
