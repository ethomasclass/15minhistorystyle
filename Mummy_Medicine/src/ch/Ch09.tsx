// Chapter 9 · The Answer: the question again, the chain of causes, Merck's archive, and the gallery wall:
// "somewhere, on a gallery wall, in a gilded frame, there may be a person." Then the end screen.
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch09_the_answer.words.json';
import {clamp} from '../lib/anim';
import {Highlight, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, Photo, type TL, useScene} from '../kit/shell';
import {Bed, MOUNTAIN, MUMMY_CASE, Sketch, type P} from '../draw';
import {Jar} from '../jar';
import {IMG} from '../images';

const N = words as Narration;
/** A music-only end screen after the narration (room for YouTube's end-screen elements). */
const EXTRA = 300;
export const CH09_FRAMES = chapterFrames(N, LEAD) + EXTRA;

/** The question, again. */
const Question: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="back to the question:" x={180} y={180} size={60} rot={-3} at={0} color="#ffffff" />
      <Note text="how did eating the dead" x={220} y={320} size={92} rot={-3} at={t.at('How did')} />
      <Note text="become medicine?" x={300} y={460} size={92} rot={-3} at={t.at('become')} color={pal.subject} />
      <Note text="...and how did it last until 1924?" x={240} y={620} size={70} rot={-3} at={t.at('last until')} />
    </AbsoluteFill>
  );
};

/** The chain of causes, each link written on its word. */
const Chain: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const rows: [string, string, string?][] = [
    ['a translation', 'translation'],
    ['→ a rock became a body', 'A rock'],
    ['demand did the rest', 'demand'],
    ['mummies ran out → dealers made fakes', 'dealers made'],
    ['fakes not enough → recipes for fresh ones', 'recipes'],
    ['medicine moved on →', 'moved on', '#ffffff'],
    ['party tricks · a railroad joke · a paint color', 'party tricks', pal.subject],
  ];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sketch pts={MOUNTAIN} x={1460} y={170} s={0.55} at={t.at('translation')} dur={8} width={6} to={MUMMY_CASE} ma={t.at('A rock')} mb={t.at('A rock') + 20} />
      {rows.map(([text, word, color], i) => <Note key={i} text={text} x={160 + (i % 2) * 40} y={120 + i * 120} size={60} rot={-2} at={t.at(word)} color={color} />)}
    </AbsoluteFill>
  );
};

/** Merck's archive. */
const Archive: React.FC<{t: TL}> = ({t}) => (
  <Photo src={IMG.merckFactory.src} size={IMG.merckFactory.size} fx={2114} fy={1250} z0={1.02} z1={1.1} a={t.at('A box of') - 1} b={t.at('And mummy brown')}>
    {() => (
      <>
        <Note text="a box of Merck's mummy:" x={110} y={820} size={56} rot={-3} at={t.at('A box of')} color="#ffffff" />
        <Note text="still in the company archive" x={150} y={920} size={64} rot={-3} at={t.at('still sits')} />
        <Tag text="E. Merck works, Darmstadt, engraving, 1903 · Internet Archive" x={44} y={40} />
      </>
    )}
  </Photo>
);

// The gallery wall, in wall pixels: [image, x, y, w]. The last one is the one that warms.
const WALL: [string, number, number, number, number][] = [
  // src, x, y, w, aspect (h / w)
  ['img/ch09_answer/gallery_5.jpg', 80, 330, 520, 1557 / 2400],
  ['img/ch09_answer/gallery_3.jpg', 720, 280, 500, 1783 / 2400],
  ['img/ch09_answer/gallery_2.jpg', 1340, 220, 380, 2400 / 2009],
  ['img/ch09_answer/gallery_6.jpg', 1840, 300, 500, 1766 / 2400],
  ['img/ch09_answer/gallery_4.jpg', 2460, 290, 500, 1769 / 2400],
  ['img/ch09_answer/gallery_1.jpg', 3080, 200, 400, 2400 / 2000],
];

/** Drawn gilded frames on a dark wall; a slow push to the last portrait, whose browns warm to coral. */
const Gallery: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('And mummy brown');
  const end = t.at('a person');
  const warm = t.at('there may be');
  const [, lx, ly, lw, lr] = WALL[WALL.length - 1];
  const cx = lx + lw / 2;
  const cy = ly + (lw * lr) / 2;
  const u = interpolate(frame, [a, end + 10], [0, 1], {...clamp, easing: (x) => x * x * (3 - 2 * x)});
  const z = interpolate(frame, [warm - 30, end + 60], [1, 1.35], clamp);
  const tx = 960 - (960 + u * (cx - 960)) * z;
  const ty = 540 - (470 + u * (cy - 470)) * z;
  const gold = '#c9a34a';
  return (
    <AbsoluteFill style={{background: '#14110d', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 3600, height: 1200, transform: `translate(${tx}px, ${ty}px) scale(${z})`, transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, #1b1712 0, #1b1712 180px, #19150f 181px, #19150f 360px)'}} />
        {WALL.map(([src, x, y, w, r], i) => {
          const h = w * r;
          const last = i === WALL.length - 1;
          const k = last ? interpolate(g, [warm, warm + 30], [0, 1], clamp) : 0;
          const pts: P[] = [[x - 26, y - 26], [x + w + 26, y - 26], [x + w + 26, y + h + 26], [x - 26, y + h + 26], [x - 26, y - 20]];
          const inner: P[] = [[x - 8, y - 8], [x + w + 8, y - 8], [x + w + 8, y + h + 8], [x - 8, y + h + 8], [x - 8, y - 4]];
          return (
            <React.Fragment key={i}>
              <div style={{position: 'absolute', left: x, top: y, width: w, height: h, boxShadow: '0 20px 40px rgba(0,0,0,0.7)'}}>
                <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.1) brightness(0.9)'}} />
                {last && k > 0 && <div style={{position: 'absolute', inset: 0, background: pal.subject, mixBlendMode: 'color', opacity: 0.75 * k}} />}
              </div>
              <Sketch pts={pts} x={0} y={0} at={a + i * 6} dur={12} width={12} smooth={false} color={gold} />
              <Sketch pts={inner} x={0} y={0} at={a + i * 6 + 4} dur={12} width={4} smooth={false} color={gold} />
            </React.Fragment>
          );
        })}
      </div>
      <Note text="which browns? artists rarely wrote it down" x={110} y={90} size={50} rot={-2} at={t.at('rarely')} color="#ffffff" out={t.at('Which means')} />
      <Note text="and they're hard to tell apart" x={140} y={180} size={50} rot={-2} at={t.at('tell them apart')} out={t.at('Which means')} />
      <Loop cx={960} cy={540} rx={330} ry={420} at={end} dur={20} seed={91} />
      <Tag text="Raeburn, Constable, Decamps, Burne-Jones, Crome, Michel · The Metropolitan Museum of Art (illustrative)" />
    </AbsoluteFill>
  );
};

/** Thanks, and the end screen (YouTube places its own end-screen elements over the right half). */
const EndScreen: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('Thanks');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Jar x={170} y={170} h={740} at={a} labels={[{text: 'MUMIA', at: a, size: 10}]} fill={[[a, 0.7]]} />
      {g >= a + 4 && <Highlight text="THANKS FOR WATCHING" x={760} y={150} size={80} at={a + 4} seed={92} rot={-2} />}
      <Note text="subscribe ↓" x={800} y={330} size={84} rot={-3} at={t.at('subscribe')} />
      <Note text="more stories like this one" x={820} y={480} size={54} rot={-3} at={t.at('more stories')} color="#ffffff" />
      <Note text="(contains no one)" x={840} y={590} size={50} rot={-3} at={t.at('subscribe') + 10} color={pal.subject} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Question t={t} />],
    [at('It started') - 1, <Chain t={t} />],
    [at('A box of') - 1, <Archive t={t} />],
    [at('And mummy brown') - 1, <Gallery t={t} />],
    [at('Thanks') - 1, <EndScreen t={t} />],
  ];
  const scene = useScene(cuts);
  return (
    <>
      {scene}
      <Bed src="music/m_1924.mp3" from={0} to={at('Which means') + 10} volume={0.18} startFrom={30 * 6} fadeOut={45} />
      <Bed src="music/m_1924.mp3" from={at('Thanks') - 10} to={t.frames + 30 + EXTRA} volume={0.2} startFrom={30 * 52} fadeIn={30} fadeOut={60} />
      {cuts.slice(1, 4).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.28} />)}
      {['How did', 'become', 'last until', 'translation', 'A rock', 'demand', 'dealers made', 'recipes', 'moved on', 'party tricks', 'A box of', 'still sits', 'rarely', 'tell them apart', 'subscribe', 'more stories'].map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
    </>
  );
};

export const Ch09: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch09_the_answer.wav" lead={LEAD} extra={EXTRA}>
    <Body />
  </ChapterShell>
);
