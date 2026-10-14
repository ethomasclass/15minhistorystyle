// Chapter 8 · The Tube: Twain's locomotive joke, mummy brown, an 1888 price list, Burne-Jones's burial and the daisy.
import React from 'react';
import {AbsoluteFill, interpolate, random} from 'remotion';
import words from '../../public/audio/ch08_the_tube.words.json';
import {clamp} from '../lib/anim';
import {Highlight, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {CountUp} from '../kit/charts';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, onScreen, Photo, Stamp, type TL, useScene} from '../kit/shell';
import {Bed, Sketch, type P} from '../draw';
import {IMG} from '../images';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH08_FRAMES = chapterFrames(N, LEAD);

/** Mark Twain, 1867 (photographed on the trip that became the book). */
const Twain: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Photo src={IMG.twain.src} size={IMG.twain.size} fx={520} fy={620} z0={1.0} z1={1.1} a={0} b={t.at('wrote that')} mask={MASKS.twain} traceAt={t.at('Mark Twain') + 2}>
      {() => (
        <>
          <Note text="not every mummy ended up in a pharmacy" x={110} y={110} size={48} rot={-3} at={0} color="#ffffff" />
          {g >= t.at('In 1869') && <Highlight text="1869" x={1400} y={300} size={110} at={t.at('In 1869')} seed={81} rot={-2} />}
          <Note text="Mark Twain" x={1400} y={470} size={68} rot={-3} at={t.at('Mark Twain')} color="#ffffff" />
          <Note text="The Innocents Abroad" x={1380} y={580} size={50} rot={-3} at={t.at('Mark Twain') + 6} />
          <Tag text="Mark Twain, Constantinople, 1867 · Library of Congress" />
        </>
      )}
    </Photo>
  );
};

// A side-on 1860s locomotive in local units (0..520 x 0..260): boiler, cab, tall stack, wheels.
const LOCO: P[][] = [
  [[40, 180], [40, 110], [330, 110], [330, 180]],                 // boiler
  [[330, 180], [330, 40], [450, 40], [450, 180], [330, 180]],     // cab
  [[310, 40], [470, 40]],                                         // cab roof
  [[80, 110], [70, 30], [120, 30], [110, 110]],                   // stack
  [[0, 180], [480, 180]],                                         // frame
  [[0, 180], [-30, 225], [40, 225]],                              // cow-catcher
];
const Wheel: React.FC<{cx: number; cy: number; r: number; at: number; spin: number}> = ({cx, cy, r, at, spin}) => {
  const pts: P[] = [];
  for (let i = 0; i <= 24; i++) pts.push([cx + Math.cos((i / 24) * Math.PI * 2) * r, cy + Math.sin((i / 24) * Math.PI * 2) * r]);
  return (
    <>
      <Sketch pts={pts} x={0} y={0} at={at} dur={8} width={6} closed />
      <Sketch pts={[[cx - Math.cos(spin) * r, cy - Math.sin(spin) * r], [cx + Math.cos(spin) * r, cy + Math.sin(spin) * r]]} x={0} y={0} at={at} dur={1} width={4} smooth={false} />
    </>
  );
};
// a little coffin-shaped puff of smoke
const COFFIN: P[] = [[0, -18], [10, -8], [8, 22], [-8, 22], [-10, -8]];

/** The locomotive: chugging along, smoke puffs shaped like coffins; JOKE stamp. */
const Locomotive: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('wrote that');
  const ox = interpolate(g, [a, a + 120], [1380, 300], clamp) - 620;
  const oy = 520;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sketch pts={[[0, oy + 250], [1920, oy + 250]]} x={0} y={0} at={a} dur={8} width={5} smooth={false} color="#EDE7DC" />
      {LOCO.map((p, i) => <Sketch key={i} pts={p} x={ox + 620} y={oy} at={a + i * 2} dur={10} width={7} smooth={false} />)}
      {[[90, 225, 30], [210, 225, 30], [380, 210, 45]].map(([cx, cy, r], i) => <Wheel key={i} cx={ox + 620 + cx} cy={oy + cy} r={r} at={a + 10} spin={g / 3 + i} />)}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const born = a + 8 + i * 10;
        if (g < born) return null;
        const age = g - born;
        const px = ox + 620 + 95 + age * 3;
        const py = oy + 10 - age * 4.5;
        const sc = 1 + age * 0.04;
        return <Sketch key={i} pts={COFFIN.map(([x, y]) => [x * sc, y * sc] as P)} x={px} y={py} at={born} dur={3} width={4} closed color="#EDE7DC" />;
      })}
      <Note text="'the fuel they use for the locomotive is composed of mummies'" x={110} y={110} size={44} rot={-2} at={t.at('railroads')} color="#ffffff" />
      <Stamp text="JOKE" x={1300} y={300} at={t.at('joking')} size={170} color={pal.subject} rot={-10} />
    </AbsoluteFill>
  );
};

/** The page itself, and 150 years of people repeating it. */
const TwainPage: React.FC<{t: TL}> = ({t}) => (
  <Photo src={IMG.twainPage.src} size={IMG.twainPage.size} fx={1130} fy={1950} z0={1.2} z1={1.28} a={t.at('People repeated') - 1} b={t.at('And then')} bw="grayscale(1) contrast(1.15) sepia(0.2)">
    {(place) => {
      const S = onScreen(place);
      const [x0, y0] = S(230, 1740);
      const [x1, y1] = S(2190, 2090);
      return (
        <>
          <Sketch pts={[[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0 + 6]]} x={0} y={0} at={t.at('People repeated') + 2} dur={10} width={6} smooth={false} />
          <AbsoluteFill style={{background: 'linear-gradient(transparent 62%, rgba(0,0,0,0.8) 84%)'}} />
          <Note text="repeated as fact for" x={110} y={880} size={54} rot={-3} at={t.at('as fact')} color="#ffffff" />
          <CountUp from={0} to={150} at={t.at('next hundred')} dur={14} x={640} y={850} size={110} label="years" />
          <Tag text="Mark Twain, The Innocents Abroad, 1869, p. 632 · Internet Archive" x={44} y={40} />
        </>
      );
    }}
  </Photo>
);

// A paint tube lying on its side (local 0..360 x 0..120), cap at the right.
const TUBE: P[] = [[0, 20], [250, 30], [300, 45], [300, 75], [250, 90], [0, 100], [10, 60]];
const CAP: P[] = [[300, 45], [345, 45], [345, 75], [300, 75]];

/** Mummy brown: a drawn tube squeezes a brown blob that smears into a brushstroke. */
const MummyBrown: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('And then');
  const sq = t.at('rich brown');
  const smear = interpolate(g, [sq, sq + 24], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sketch pts={TUBE} x={260} y={430} s={1.6} at={a} dur={12} width={7} closed />
      <Sketch pts={CAP} x={260} y={430} s={1.6} at={a + 6} dur={6} width={7} smooth={false} />
      {g >= sq && (
        <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
          <path d={`M820,520 C${900 + smear * 200},${480 - smear * 30} ${1100 + smear * 300},${560 + smear * 20} ${830 + smear * 900},${530}`} stroke="#6b3f24" strokeWidth={70 - smear * 20} strokeLinecap="round" fill="none" opacity={0.95} />
          <path d={`M820,520 C${900 + smear * 200},${480 - smear * 30} ${1100 + smear * 300},${560 + smear * 20} ${830 + smear * 900},${530}`} stroke="#a0623a" strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.5} />
        </svg>
      )}
      {g >= t.at('mummy brown') && <Highlight text="MUMMY BROWN" x={140} y={110} size={110} at={t.at('mummy brown')} seed={82} rot={-2} />}
      <Definition term="mum·my brown" def="an artists' brown paint, made at least some of the time from ground-up mummies" at={t.at('It was made')} x={160} y={740} w={1400} />
      <Note text="for generations, artists bought it" x={1100} y={280} size={50} rot={-3} at={t.at('artists bought')} color="#ffffff" />
      <Note text="(at least some of the time)" x={1100} y={900} size={46} rot={-3} at={t.at('at least')} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** 1888, Philadelphia: the price list. */
const PriceList: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Photo src={IMG.weber.src} size={IMG.weber.size} fx={900} fy={900} z0={1.5} z1={1.6} a={t.at('In 1888') - 1} b={t.at('In 1881')} bw="grayscale(1) contrast(1.15) sepia(0.2)">
      {(place) => {
        const [mx, my] = onScreen(place)(320, 1110);
        return (
          <>
            <Loop cx={mx} cy={my} rx={130} ry={46} at={t.at('listed it')} seed={83} color={pal.subject} />
            {g >= t.at('In 1888') && <Highlight text="1888" x={1460} y={90} size={100} at={t.at('In 1888')} seed={84} rot={-2} />}
            <Note text="Philadelphia" x={1440} y={240} size={58} rot={-3} at={t.at('Philadelphia')} color="#ffffff" />
            <Note text="right there with the other browns" x={1050} y={900} size={50} rot={-3} at={t.at('right there')} />
            <Tag text="F. Weber & Co., artists' price list, Philadelphia, 1888 · Internet Archive" x={44} y={1030} />
          </>
        );
      }}
    </Photo>
  );
};

// A daisy: stem, then petals pop one per step.
const Daisy: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const n = Math.floor(interpolate(g, [at + 8, at + 20], [0, 12], clamp));
  return (
    <>
      <Sketch pts={[[x, y], [x - 6, y - 60], [x + 4, y - 130]]} x={0} y={0} at={at} dur={8} width={6} />
      <Sketch pts={[[x - 4, y - 50], [x - 40, y - 74], [x - 6, y - 70]]} x={0} y={0} at={at + 4} dur={6} width={5} />
      <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
        {[...Array(n)].map((_, i) => {
          const ang = (i / 12) * Math.PI * 2 + random(`d${i}`) * 0.2;
          return <ellipse key={i} cx={x + 4 + Math.cos(ang) * 26} cy={y - 130 + Math.sin(ang) * 26} rx={18} ry={8} transform={`rotate(${(ang * 180) / Math.PI} ${x + 4 + Math.cos(ang) * 26} ${y - 130 + Math.sin(ang) * 26})`} fill="#f4efe6" stroke="#ddd" strokeWidth={1} />;
        })}
        {n >= 12 && <circle cx={x + 4} cy={y - 130} r={14} fill={pal.box ?? '#FF9F1C'} />}
      </svg>
    </>
  );
};

/** Burne-Jones, 1881: the burial. */
const Burial: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const bur = t.at('proper burial');
  const drop = interpolate(g, [t.at('garden'), t.at('garden') + 14], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('In 1881') && <Highlight text="1881" x={110} y={90} size={100} at={t.at('In 1881')} seed={85} rot={-2} />}
      <Note text="painter Edward Burne-Jones" x={110} y={240} size={56} rot={-3} at={t.at('Edward')} color="#ffffff" />
      <Note text="found out what was in the tube" x={110} y={340} size={52} rot={-3} at={t.at('found out')} />
      <Note text="(over Sunday lunch)" x={140} y={440} size={50} rot={-3} at={t.at('Sunday')} color="#ffffff" />
      {/* soil line and the grave */}
      <Sketch pts={[[860, 760], [1240, 760], [1280, 780], [1820, 770]]} x={0} y={0} at={t.at('garden')} dur={10} width={6} color="#EDE7DC" />
      <Sketch pts={[[1240, 760], [1250, 840], [1500, 845], [1520, 770]]} x={0} y={0} at={t.at('garden') + 4} dur={8} width={5} color="#EDE7DC" />
      <Sketch pts={TUBE} x={1250} y={560 + drop * 200} s={0.7} at={t.at('Edward') + 4} dur={10} width={6} closed />
      <Sketch pts={CAP} x={1250} y={560 + drop * 200} s={0.7} at={t.at('Edward') + 8} dur={4} width={6} smooth={false} />
      {g >= bur && <Sketch pts={[[1250, 765], [1330, 742], [1420, 744], [1515, 768]]} x={0} y={0} at={bur} dur={8} width={8} color="#8a5a3a" />}
      <Note text="a proper burial." x={860} y={880} size={64} rot={-3} at={bur} color={pal.subject} />
      <Daisy x={1385} y={745} at={t.at('daisy')} />
      <Note text="+ a daisy on top" x={1460} y={560} size={52} rot={-4} at={t.at('daisy') + 6} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Twain t={t} />],
    [at('wrote that') - 1, <Locomotive t={t} />],
    [at('People repeated') - 1, <TwainPage t={t} />],
    [at('And then') - 1, <MummyBrown t={t} />],
    [at('In 1888') - 1, <PriceList t={t} />],
    [at('In 1881') - 1, <Burial t={t} />],
  ];
  const scene = useScene(cuts);
  return (
    <>
      {scene}
      <Bed src="music/m_parlor.mp3" from={0} to={t.frames + 30} volume={0.2} startFrom={30 * 18} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['In 1869', 'mummy brown', 'In 1888', 'In 1881'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      <Sfx at={at('joking')} src="sfx/stamp.wav" volume={0.4} />
      {['Mark Twain', 'railroads', 'as fact', 'artists bought', 'It was made', 'at least', 'Philadelphia', 'right there', 'Edward', 'found out', 'Sunday', 'proper burial', 'daisy'].map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('listed it')} src="sfx/tick.wav" volume={0.4} />
    </>
  );
};

export const Ch08: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch08_the_tube.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
