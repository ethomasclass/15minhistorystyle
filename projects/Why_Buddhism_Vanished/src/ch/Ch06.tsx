// Chapter 6 · Back to the tree: the driving question again, the three religions as three maps with their labels,
// Buddhism carried by an emperor and by traders until it no longer needed its hearth, the pilgrims under the tree,
// then a music-only end card with the before-class question.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import words from '../../public/audio/ch06_ending.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, Photo, type TL, useScene} from '../kit/shell';
import {PAL} from '../kit/look';
import {C, Dot, type Fill, MapLabel, P, WorldMap} from '../kit/asia';

const N = words as Narration;
/** Music-only end card after the narration (about 6 s on screen before the fade). */
const EXTRA = 180;
export const CH06_FRAMES = chapterFrames(N, LEAD) + EXTRA;
/** Narration-time frame the end card starts: a short hold on the pilgrims after the last word. */
const CARD = Math.ceil(N.duration * 30) + 40;

const MUTED = 'saturate(0.55) contrast(1.08) brightness(0.82)';
const BUDDHIST = [C.thailand, C.myanmar, C.sriLanka, C.bhutan, C.cambodia, C.laos, C.mongolia, C.japan, C.vietnam, C.southKorea, C.taiwan, C.china];

// ---------- scenes ----------

const Question: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Photo src="img/bg/tree_gate.jpg" size={[1920, 1310]} fx={960} fy={600} z0={1.03} z1={1.12} a={0} b={t.at('Hinduism')} bw={MUTED} vignette={0.75}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 60%)'}} />
          <Note text="so..." x={110} y={70} size={60} rot={-3} at={-2} color="#ffffff" />
          <Highlight text="WHY DID BUDDHISM VANISH" x={100} y={160} size={84} at={t.at('why')} seed={91} rot={-2} />
          <Highlight text="FROM ITS BIRTHPLACE?" x={100} y={290} size={84} at={t.at('birthplace')} seed={92} rot={-1} />
          <Note text="because of how it spread" x={120} y={440} size={64} rot={-4} at={t.at('Because') - 3} color={pal.subject} />
          <Tag text="Bodhi Tree, Bodh Gaya · Photo Dharma, CC BY 2.0, via Wikimedia Commons" />
        </>
      )}
    </Photo>
  );
};

/** A small torn-tape label sized for the three columns. */
const Label: React.FC<{text: string; x: number; y: number; at: number; seed: number}> = ({text, x, y, at, seed}) => (
  <Highlight text={text} x={x} y={y} size={46} at={at} seed={seed} rot={-1.5} />
);

/** Same region, three maps: each religion with its type and how it spread. */
const ThreeMaps: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('Hinduism');
  const s = t.at('Sikhism');
  const b = t.at('Buddhism', 2);
  const cam = [{f: 0, lon: 25, lat: 22, z: 0.33}];
  const W = 540, H = 340, Y = 300;
  const xs = [90, 690, 1290];
  // the column being talked about stays bright, the others dim a little
  const focus = (i: number) => {
    const on = [a, s, b][i];
    const next = [s, b, 1e7][i];
    if (g < on) return 0.45;
    return g < next ? 1 : 0.6;
  };
  const head = (text: string, x: number, color: string, at: number) => (
    <MapLabel text={text} x={x + W / 2} y={Y - 40} at={at} align="center" color={color} size={36} />
  );
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="three religions, three ways of spreading" x={110} y={80} size={56} rot={-2} at={a - 3} color="#ffffff" />
      {head('Hinduism', xs[0], PAL.orange, a - 4)}
      {head('Sikhism', xs[1], PAL.teal, a - 4)}
      {head('Buddhism', xs[2], PAL.coral, a - 4)}
      <div style={{opacity: focus(0)}}>
        <WorldMap x={xs[0]} y={Y} w={W} h={H} frame keys={cam} fills={[{id: C.india, at: a, color: PAL.orange}, {id: C.nepal, at: a, color: PAL.orange}]}>
          {(S) => (<>{[[-61.3, 10.5], [-58.9, 5.5], [178, -17.8], [57.55, -20.25]].map((ll, i) => {
            const [x, y] = S(ll as [number, number]);
            return <Dot key={i} x={x} y={y} at={t.at('traveled') + i * 2} r={6} color={PAL.orange} ring={false} />;
          })}</>)}
        </WorldMap>
      </div>
      <div style={{opacity: focus(1)}}>
        <WorldMap x={xs[1]} y={Y} w={W} h={H} frame keys={cam}>
          {(S) => {
            const [px, py] = S(P.amritsar);
            return (
              <>
                <Dot x={px} y={py} at={s} r={12} color={PAL.teal} ring={false} />
                {[[-79.76, 43.68], [-122.85, 49.19], [-0.12, 51.5], [-121.3, 37.9]].map((ll, i) => {
                  const [x, y] = S(ll as [number, number]);
                  return <Dot key={i} x={x} y={y} at={t.at('migrating') + i * 2} r={6} color={PAL.teal} ring={false} />;
                })}
              </>
            );
          }}
        </WorldMap>
      </div>
      <div style={{opacity: focus(2)}}>
        <WorldMap x={xs[2]} y={Y} w={W} h={H} frame keys={cam} fills={BUDDHIST.map((id) => ({id, at: b + 2, color: PAL.coral, opacity: 0.75}))} />
      </div>
      <Label text="ETHNIC" x={xs[0] + 6} y={Y + H + 36} at={t.at('ethnic')} seed={93} />
      <Note text="spreads by relocation" x={xs[0] + 10} y={Y + H + 130} size={40} rot={-2} at={t.at('traveled') - 3} />
      <Note text="(when Indians move)" x={xs[0] + 20} y={Y + H + 190} size={36} rot={-2} at={t.at('Indians') - 3} color="#ffffff" />
      <Label text="UNIVERSALIZING" x={xs[1] + 6} y={Y + H + 36} at={t.at('welcomed')} seed={94} />
      <Note text="but spreads by migration" x={xs[1] + 10} y={Y + H + 130} size={40} rot={-2} at={t.at('migrating') - 3} />
      <Note text="(relocation, again)" x={xs[1] + 20} y={Y + H + 190} size={36} rot={-2} at={t.at('families') - 3} color="#ffffff" />
      <Label text="UNIVERSALIZING" x={xs[2] + 6} y={Y + H + 36} at={b} seed={95} />
      <Note text="hierarchical + contagious" x={xs[2] + 10} y={Y + H + 130} size={40} rot={-2} at={t.at('different') - 3} color={PAL.coral} />
      <Tag text="Simplified: shaded = majority or major religion; dots = notable communities · Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** Buddhism carried out of India: an emperor (to Sri Lanka) and traders (the Silk Road and the sea), then the hearth fades. */
const SILK: [number, number][] = [[84.99, 24.7], [72.8, 33.7], [76, 39.5], [94.7, 40.1], [108.9, 34.3]];
const Carried: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const e = t.at('emperor');
  const tr = t.at('traders');
  const own = t.at('made it');
  const h = t.at('hearth');
  const fills: Fill[] = [
    {id: C.sriLanka, at: e + 6, color: PAL.coral, opacity: 0.7},
    ...BUDDHIST.filter((id) => id !== C.sriLanka).map((id, i) => ({id, at: own + (i % 6) * 2, color: PAL.coral, opacity: 0.6})),
  ];
  const fade = interpolate(g, [t.at('Once'), h], [1, 0.25], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: t.at('carried'), lon: 97, lat: 24, z: 3.2}, {f: h + 10, lon: 100, lat: 25, z: 2.9}]} fills={fills}>
        {(S) => {
          const [bx, by] = S(P.bodhGaya);
          const [lx, ly] = S([80.7, 7.8]);
          const silk = SILK.map((ll) => S(ll));
          const [kx, ky] = S([127, 37.5]);
          const [jx, jy] = S([135.5, 34.7]);
          const [tx, ty] = S([100.5, 13.7]);
          return (
            <>
              <div style={{opacity: fade}}>
                <Dot x={bx} y={by} at={-999} color={pal.subject} r={14} />
                <MapLabel text="Bodh Gaya" x={bx - 36} y={by + 48} at={-999} align="right" color={pal.subject} size={28} />
              </div>
              <Arrow x1={bx - 8} y1={by + 18} x2={lx + 4} y2={ly - 22} bow={50} at={e} dur={10} width={6} />
              {silk.slice(0, -1).map(([x1, y1], i) => (
                <Arrow key={i} x1={x1} y1={y1} x2={silk[i + 1][0]} y2={silk[i + 1][1]} bow={i === 0 ? -30 : 20} at={tr + i * 5} dur={6} width={5} />
              ))}
              <Arrow x1={silk[4][0] + 10} y1={silk[4][1] - 10} x2={kx - 10} y2={ky + 6} bow={-30} at={tr + 20} dur={6} width={5} />
              <Arrow x1={kx + 10} y1={ky + 10} x2={jx - 12} y2={jy} bow={-20} at={tr + 24} dur={6} width={5} />
              <Arrow x1={bx + 12} y1={by + 20} x2={tx - 6} y2={ty - 18} bow={-60} at={tr + 8} dur={10} width={5} />
              {g >= h && <Loop cx={bx - 40} cy={by - 20} rx={250} ry={210} at={h} seed={9} tilt={-6} color={pal.mark} />}
            </>
          );
        }}
      </WorldMap>
      <Note text="Buddhism was different:" x={110} y={80} size={56} rot={-3} at={t.at('Buddhism was') - 3} color="#ffffff" />
      <Note text="emperor = hierarchical" x={1180} y={760} size={50} rot={-3} at={e - 3} />
      <Note text="traders = contagious" x={1180} y={850} size={50} rot={-3} at={tr - 3} />
      <Note text="new places made it their own" x={980} y={160} size={44} rot={-3} at={own - 3} color={pal.subject} />
      <Highlight text="HEARTH" x={100} y={800} size={90} at={h} seed={96} rot={-2} />
      <Note text="it didn't need its hearth anymore" x={110} y={940} size={50} rot={-2} at={t.at('didnt') - 3} color="#ffffff" />
      <Tag text="Simplified routes · Map: Natural Earth" x={1400} />
    </AbsoluteFill>
  );
};

const Pilgrims: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Photo src="img/bg/tree_pilgrims.jpg" size={[1920, 1440]} fx={960} fy={640} z0={1.04} z1={1.16} a={t.at('Which')} b={CARD} bw={MUTED} vignette={0.75}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 35%)'}} />
          <Note text="2,500 years later..." x={110} y={80} size={66} rot={-3} at={t.at('2500') - 3} color="#ffffff" />
          <Note text="mostly from somewhere else" x={760} y={190} size={60} rot={-4} at={t.at('mostly') - 3} color={pal.subject} />
          <Tag text="The Bodhi tree, Mahabodhi Temple · Hiroki Ogawa, CC BY 3.0, via Wikimedia Commons" />
        </>
      )}
    </Photo>
  );
};

/** End card: the before-class question, with India and Mauritius on a small map (no arrow, so it gives nothing away). */
const EndCard: React.FC = () => {
  const g = useGFrame();
  const pal = usePal();
  const a = CARD;
  const q = (text: string, at: number, color = '#f4efe6', size = 50) => (
    <div style={{fontFamily: JF.sans, fontWeight: 600, fontSize: size, lineHeight: 1.3, color, opacity: interpolate(g, [at, at + 8], [0, 1], clamp), marginBottom: 26}}>{text}</div>
  );
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap x={1180} y={180} w={620} h={660} frame keys={[{f: 0, lon: 70, lat: 4, z: 2.1}]}
        fills={[{id: C.india, at: a + 10, color: PAL.orange, opacity: 0.6}, {id: C.mauritius, at: a + 16, color: PAL.coral, opacity: 0.9}]}>
        {(S) => {
          const [mx, my] = S([57.55, -20.25]);
          const [ix, iy] = S([78, 22]);
          return (
            <>
              <Dot x={mx} y={my} at={a + 16} r={10} color={pal.subject} />
              <MapLabel text="Mauritius" x={mx + 32} y={my + 4} at={a + 16} color={pal.subject} size={26} />
              <MapLabel text="India" x={ix - 70} y={iy + 20} align="right" at={a + 10} color={PAL.orange} size={26} />
            </>
          );
        }}
      </WorldMap>
      <Highlight text="BEFORE CLASS" x={100} y={90} size={90} at={a + 2} seed={97} rot={-2} />
      <div style={{position: 'absolute', left: 120, top: 280, width: 980}}>
        {q('Mauritius is about half Hindu, even though it\'s thousands of miles from India.', a + 10)}
        {q('1. Is Hinduism ethnic or universalizing?', a + 40, pal.mark, 54)}
        {q('2. What type of diffusion brought it there?', a + 60, pal.mark, 54)}
      </div>
      <Note text="bring your answer to class" x={140} y={860} size={56} rot={-3} at={a + 80} color={pal.subject} />
      <Tag text="Map: Natural Earth" x={1180} y={870} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Question t={t} />],
    [at('Hinduism') - 1, <ThreeMaps t={t} />],
    [at('carried') - 1, <Carried t={t} />],
    [at('Which') - 1, <Pilgrims t={t} />],
    [CARD, <EndCard />],
  ];
  const scene = useScene(cuts);
  const stamps = [at('why'), at('birthplace'), at('ethnic'), at('welcomed'), at('Buddhism', 2), at('hearth'), CARD + 2];
  const notes = [at('Because'), at('Hinduism'), at('traveled'), at('Indians'), at('migrating'), at('families'), at('different'), at('Buddhism was'),
    at('emperor'), at('traders'), at('made it'), at('didnt'), at('2500'), at('mostly'), CARD + 80];
  const ticks = [at('emperor'), at('traders'), at('Sikhism')];
  return (
    <AbsoluteFill>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={'w' + i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {stamps.map((f, i) => <Sfx key={'s' + i} at={f} src="sfx/stamp.wav" volume={0.27} />)}
      {notes.map((f, i) => <Sfx key={'n' + i} at={f - 3} src={WRITE.src} volume={WRITE.volume} />)}
      {ticks.map((f, i) => <Sfx key={'t' + i} at={f} src="sfx/tick.wav" volume={0.4} />)}
    </AbsoluteFill>
  );
};

export const Ch06: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch06_ending.wav" lead={LEAD} extra={EXTRA} music={[{src: 'music/r_ending.mp3', volume: 0.15}]}>
    <Body />
  </ChapterShell>
);
