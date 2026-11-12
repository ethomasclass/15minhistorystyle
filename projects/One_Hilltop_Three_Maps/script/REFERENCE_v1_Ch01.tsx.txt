// Video 1 demo · the cold open: the Bodhi tree, pilgrims from across Asia, almost no Buddhists in India,
// the driving question, three religions from one region. Then the channel intro and the title card.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch01_cold_open.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Finish, Highlight, JF, Loop, Note, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChannelIntro, INTRO_FRAMES} from '../kit/Intro';
import {makeTimeline, type Narration, Photo, type TL, useScene} from '../kit/shell';
import {Pie} from '../kit/charts';
import {PAL} from '../kit/look';
import {C, centroid, Dot, type Fill, MapLabel, P, WorldMap} from '../kit/asia';
import {DATES, SUBTITLE, TITLE} from '../project';

const N = words as Narration;
const TITLE_FRAMES = 150;
const END = Math.ceil(N.duration * 30) + 20;
export const CH01_FRAMES = END + INTRO_FRAMES + TITLE_FRAMES;

/** Modern photos stay in colour, muted so the teal and coral marks read on top. */
const MUTED = 'saturate(0.55) contrast(1.08) brightness(0.82)';

/** Countries where Buddhism is the majority or a major religion today (shaded together, labelled as such). */
const BUDDHIST = [C.thailand, C.myanmar, C.sriLanka, C.bhutan, C.cambodia, C.laos, C.mongolia, C.japan, C.vietnam, C.southKorea, C.taiwan, C.china];

// ---------- scenes ----------

const Tree: React.FC<{t: TL}> = ({t}) => (
  <Photo src="img/bg/tree_pilgrims.jpg" size={[1920, 1440]} fx={960} fy={640} z0={1.02} z1={1.12} a={0} b={t.at("It's")} bw={MUTED} vignette={0.75}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 40%)'}} />
        <Highlight text="BODH GAYA, INDIA" x={110} y={90} size={88} at={t.at('Bodh')} seed={11} rot={-2} />
        <Note text="sacred to half a billion people" x={1010} y={250} size={54} rot={-3} at={t.at('half') - 3} />
        <Tag text="The Bodhi tree, Mahabodhi Temple · Hiroki Ogawa, CC BY 3.0, via Wikimedia Commons" />
      </>
    )}
  </Photo>
);

const Buddha: React.FC<{t: TL}> = ({t}) => (
  <Photo src="img/bg/meditators.jpg" size={[1920, 1132]} fx={960} fy={560} z0={1.04} z1={1.14} a={t.at("It's")} b={t.at('Every')} bw={MUTED} vignette={0.8}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 45%)'}} />
        <Note text="about 2,500 years ago" x={120} y={140} size={60} rot={-3} at={t.at('2500') - 3} color="#ffffff" />
        <Note text="sat down to meditate..." x={140} y={250} size={52} rot={-2} at={t.at('sat') - 3} />
        <Highlight text="THE BUDDHA" x={120} y={760} size={120} at={t.at('Buddha')} seed={21} rot={-2} />
        <Note text={'"the awakened one"'} x={1080} y={800} size={56} rot={-4} at={t.at('Buddha') + 12} color="#ffffff" />
        <Tag text="Meditators at the Bodhi tree · Photo Dharma, CC BY 2.0, via Wikimedia Commons" />
      </>
    )}
  </Photo>
);

/** Pilgrims arrive from six places: each lights up and an arrow flies to Bodh Gaya. */
const PILGRIMS: {word: string; label: string; id?: string; ll?: [number, number]; dx: number; dy: number; align?: 'left' | 'right'}[] = [
  {word: 'Thailand', label: 'Thailand', id: C.thailand, dx: 40, dy: 30},
  {word: 'Myanmar', label: 'Myanmar', id: C.myanmar, dx: 30, dy: 70},
  {word: 'Sri', label: 'Sri Lanka', id: C.sriLanka, dx: 50, dy: 10},
  {word: 'Japan', label: 'Japan', id: C.japan, dx: -30, dy: 60, align: 'right'},
  {word: 'Bhutan', label: 'Bhutan', id: C.bhutan, dx: 34, dy: -34},
  {word: 'Tibet', label: 'Tibet', ll: P.lhasa, dx: 36, dy: -40},
];

const Pilgrims: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Every');
  const fills: Fill[] = PILGRIMS.filter((p) => p.id).map((p) => ({id: p.id!, at: t.at(p.word), color: PAL.teal, opacity: 0.45}));
  fills.push({id: C.india, at: a + 6, color: PAL.coral, opacity: 0.18});
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 103, lat: 23, z: 3.7}, {f: t.at('Tibet') + 30, lon: 101, lat: 23, z: 4.0}]} fills={fills}>
        {(S) => {
          const [bx, by] = S(P.bodhGaya);
          return (
            <>
              {PILGRIMS.map((p) => {
                const [x, y] = S(p.ll ?? centroid(p.id!));
                const at = t.at(p.word);
                return (
                  <React.Fragment key={p.word}>
                    <Arrow x1={x} y1={y} x2={bx + (x > bx ? 18 : -18)} y2={by + (y > by ? 14 : -14)} bow={p.word === 'Japan' ? 120 : 40} at={at + 2} dur={8} width={5} />
                    <MapLabel text={p.label} x={x + p.dx} y={y + p.dy} at={at} align={p.align} size={28} />
                  </React.Fragment>
                );
              })}
              <Dot x={bx} y={by} at={t.at('Bodh', 2)} r={13} color={PAL.coral} />
              <MapLabel text="Bodh Gaya" x={bx - 34} y={by + 46} at={t.at('Bodh', 2)} align="right" color={PAL.coral} size={30} />
            </>
          );
        }}
      </WorldMap>
      <Highlight text="EVERY YEAR, PILGRIMS" x={100} y={80} size={72} at={t.at('pilgrims')} seed={31} rot={-2} />
      <Tag text="Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** India by religion: the Buddhist sliver in coral. */
const IndiaPie: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="here's what's strange..." x={110} y={110} size={58} rot={-3} at={t.at('strange') - 3} color="#ffffff" />
      <Highlight text="INDIA" x={110} y={210} size={110} at={t.at('country')} seed={41} rot={-2} />
      <Note text="people by religion" x={130} y={380} size={50} rot={-3} at={t.at('actually') - 2} />
      <Pie cx={1200} cy={600} r={280} at={t.at('In India fewer') - 8} per={7}
        slices={[
          {label: 'Hindu', value: 79.8, pct: '80%'},
          {label: 'Muslim', value: 14.2, pct: '14%'},
          {label: 'other', value: 5.3, pct: '5%', labelAt: [1570, 330]},
          {label: 'Buddhist', value: 0.7, pct: '0.7%', subject: true, labelAt: [1580, 170]},
        ]} />
      <Note text="fewer than 1 in 100" x={130} y={560} size={68} rot={-4} at={t.at('fewer') - 3} color={pal.subject} />
      <Tag text="Census of India, 2011" />
    </AbsoluteFill>
  );
};

/** The puzzle: Buddhism thrives across Asia, but India is almost empty of it. */
const Puzzle: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const s = t.at('spread');
  const fills: Fill[] = BUDDHIST.map((id, i) => ({id, at: s + 2 + (i % 6) * 3, color: PAL.coral, opacity: 0.6}));
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: t.at('So how'), lon: 100, lat: 28, z: 3.2}, {f: t.at('born') + 20, lon: 96, lat: 27, z: 3.5}]} fills={fills}>
        {(S) => {
          const [ix, iy] = S([79, 22]);
          const [ex, ey] = S([118, 34]);
          return (
            <>
              <Note text="spread across a continent" x={ex - 640} y={ey - 330} size={60} rot={-3} at={s - 3} color="#ffffff" />
              <Loop cx={ix} cy={iy} rx={210} ry={240} at={t.at('disappear')} seed={7} tilt={-8} color={pal.mark} />
              <Note text="...but vanish from home?" x={ix - 380} y={iy + 280} size={60} rot={-3} at={t.at('disappear') - 2} color={pal.subject} />
            </>
          );
        }}
      </WorldMap>
      <Tag text="Shaded: countries where Buddhism is the majority or a major religion today · Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** Three religions, one region: hearths on a South Asia map. */
const Three: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('To answer');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 84, lat: 23, z: 4}, {f: t.at('Asia') + 4, lon: 80, lat: 26, z: 7}]}
        fills={[{id: C.india, at: t.at('South'), color: PAL.cream, opacity: 0.12}, {id: C.nepal, at: t.at('South'), color: PAL.cream, opacity: 0.12},
          {id: C.pakistan, at: t.at('South'), color: PAL.cream, opacity: 0.12}, {id: C.bangladesh, at: t.at('South'), color: PAL.cream, opacity: 0.12}]}>
        {(S) => {
          const [vx, vy] = S(P.varanasi);
          const [bx, by] = S(P.bodhGaya);
          const [ax, ay] = S(P.amritsar);
          return (
            <>
              <Dot x={vx} y={vy} at={t.at('Hinduism')} color={PAL.orange} />
              <MapLabel text="Ganges valley" x={vx - 40} y={vy - 50} at={t.at('Hinduism')} align="right" color={PAL.orange} />
              <Dot x={bx} y={by} at={t.at('Buddhism')} color={PAL.coral} />
              <MapLabel text="Bodh Gaya" x={bx + 40} y={by + 44} at={t.at('Buddhism')} color={PAL.coral} />
              <Dot x={ax} y={ay} at={t.at('Sikhism')} color={PAL.teal} />
              <MapLabel text="Punjab" x={ax + 40} y={ay - 6} at={t.at('Sikhism')} color={PAL.teal} />
            </>
          );
        }}
      </WorldMap>
      <Note text="all from South Asia:" x={100} y={90} size={56} rot={-3} at={t.at('South') - 3} color="#ffffff" />
      <Highlight text="HINDUISM" x={110} y={680} size={76} at={t.at('Hinduism')} seed={51} rot={-2} />
      <Highlight text="BUDDHISM" x={110} y={800} size={76} at={t.at('Buddhism')} seed={52} rot={-1} />
      <Highlight text="SIKHISM" x={110} y={920} size={76} at={t.at('Sikhism')} seed={53} rot={-2} />
      <Tag text="Map: Natural Earth" x={1500} />
    </AbsoluteFill>
  );
};

/** Same region, three different maps: where each religion's followers live today. */
const ThreeMaps: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Three completely');
  const cam = [{f: 0, lon: 25, lat: 22, z: 0.33}];
  const W = 540, H = 340, Y = 330;
  const xs = [90, 690, 1290];
  const head = (text: string, x: number, color: string, at: number) => (
    <MapLabel text={text} x={x + W / 2} y={Y - 40} at={at} align="center" color={color} size={34} />
  );
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="same region." x={110} y={90} size={64} rot={-3} at={t.at('Same') - 3} color="#ffffff" />
      <Note text="three different maps." x={620} y={110} size={64} rot={-3} at={a - 3} />
      {head('Hinduism', xs[0], PAL.orange, a)}
      {head('Buddhism', xs[1], PAL.coral, a + 6)}
      {head('Sikhism', xs[2], PAL.teal, a + 12)}
      <WorldMap x={xs[0]} y={Y} w={W} h={H} frame keys={cam} fills={[{id: C.india, at: a, color: PAL.orange}, {id: C.nepal, at: a, color: PAL.orange}]}>
        {(S) => (<>{[[-61.3, 10.5], [-58.9, 5.5], [178, -17.8], [57.55, -20.25]].map((ll, i) => {
          const [x, y] = S(ll as [number, number]);
          return <Dot key={i} x={x} y={y} at={a + 4 + i * 2} r={6} color={PAL.orange} ring={false} />;
        })}</>)}
      </WorldMap>
      <WorldMap x={xs[1]} y={Y} w={W} h={H} frame keys={cam} fills={BUDDHIST.map((id) => ({id, at: a + 6, color: PAL.coral, opacity: 0.75}))} />
      <WorldMap x={xs[2]} y={Y} w={W} h={H} frame keys={cam}>
        {(S) => {
          const [px, py] = S(P.amritsar);
          return (
            <>
              <Dot x={px} y={py} at={a + 12} r={12} color={PAL.teal} ring={false} />
              {[[-79.76, 43.68], [-122.85, 49.19], [-0.12, 51.5], [-121.3, 37.9]].map((ll, i) => {
                const [x, y] = S(ll as [number, number]);
                return <Dot key={i} x={x} y={y} at={a + 14 + i * 2} r={6} color={PAL.teal} ring={false} />;
              })}
            </>
          );
        }}
      </WorldMap>
      <Note text="India + Nepal, plus migrants" x={xs[0] + 10} y={Y + H + 34} size={34} rot={-2} at={a + 8} color="#ffffff" />
      <Note text="East + Southeast Asia" x={xs[1] + 10} y={Y + H + 34} size={34} rot={-2} at={a + 12} color="#ffffff" />
      <Note text="Punjab, plus migrants" x={xs[2] + 10} y={Y + H + 34} size={34} rot={-2} at={a + 16} color="#ffffff" />
      <Note text="why? one simple question..." x={560} y={890} size={66} rot={-3} at={t.at('one simple') - 3} color={pal.subject} />
      <Tag text="Simplified: shaded = majority or major religion; dots = notable communities · Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** Title card: the Asia map dimmed behind the title. */
const Title: React.FC = () => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <DarkPaper />
      <AbsoluteFill style={{opacity: 0.55}}>
        <WorldMap keys={[{f: 0, lon: 96, lat: 25, z: 3.3}, {f: 150, lon: 94, lat: 25, z: 3.6}]} fills={[{id: C.india, at: 0, color: PAL.coral, opacity: 0.35}]} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(8,6,4,0.2) 30%, rgba(8,6,4,0.85) 100%)'}} />
      <Highlight text={TITLE} x={130} y={330} size={108} at={4} seed={61} rot={-2} />
      {g >= 14 && <div style={{position: 'absolute', left: 190, top: 540, fontFamily: JF.display, fontSize: 70, color: pal.mark, textShadow: '0 3px 16px rgba(0,0,0,0.8)', opacity: interpolate(g, [14, 20], [0, 1], clamp)}}>{SUBTITLE}</div>}
      <Note text={DATES} x={1220} y={760} size={56} rot={-5} at={24} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Tree t={t} />],
    [at("It's") - 1, <Buddha t={t} />],
    [at('Every') - 1, <Pilgrims t={t} />],
    [at("But here's") - 1, <IndiaPie t={t} />],
    [at('So how') - 1, <Puzzle t={t} />],
    [at('To answer') - 1, <Three t={t} />],
    [at('Same region') - 1, <ThreeMaps t={t} />],
  ];
  let scene = useScene(cuts);
  if (frame >= END + INTRO_FRAMES) scene = <Sequence from={END + INTRO_FRAMES} layout="none"><Title /></Sequence>;
  else if (frame >= END) scene = <Sequence from={END} layout="none"><ChannelIntro /></Sequence>;
  const stamps = ['Bodh', 'Buddha', 'pilgrims', 'country', 'Hinduism', 'Buddhism', 'Sikhism'];
  const notes = ['half', '2500', 'sat', 'strange', 'actually', 'fewer', 'spread', 'disappear', 'South', 'Same', 'Three completely', 'one simple'];
  const ticks = ['Thailand', 'Myanmar', 'Sri', 'Japan', 'Bhutan', 'Tibet'];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {frame < END && <Finish vignette={0.3} />}
      <Audio src={staticFile('audio/ch01_cold_open.wav')} />
      <Audio src={staticFile('music/r_cold_open.mp3')} volume={(f) => interpolate(f, [0, 15, END - 40, END], [0, 0.15, 0.15, 0], clamp)} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {stamps.map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.27} />)}
      {notes.map((c) => <Sfx key={c} at={at(c) - 3} src={WRITE.src} volume={WRITE.volume} />)}
      {ticks.map((c) => <Sfx key={c} at={at(c)} src="sfx/tick.wav" volume={0.4} />)}
      <Sfx at={END + INTRO_FRAMES + 4} src="sfx/stamp.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Ch01: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
