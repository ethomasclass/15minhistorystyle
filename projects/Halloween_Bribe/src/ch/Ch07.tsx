// Chapter 7 · The Night in Texas. THE QUIET CHAPTER: teal lines only (ChapterShell `quiet`: bone titles, no coral, no orange
// tape), slow camera, long holds, no jokes. The boy and his father are never named or shown. The dark-house painting is the
// same one as the cold open (the callback), and it comes back once more, in silence, for "by his own father."
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch07_the_night_in_texas.words.json';
import {clamp} from '../lib/anim';
import {JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, PhotoCard, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {Prop} from '../kit/prop';
import {SilScene} from '../kit/silparallax';
import {Tally, XRayScan} from '../fx/XRayScan';
import dark from '../../public/img/layers/sil/ch07_dark_house/layers.json';

const N = words as Narration;
export const CH07_FRAMES = chapterFrames(N, LEAD);
const WHITE = '#f4efe6';
const DIM = '#c9c3b8';

/** The dark-house painting (same as the cold open), slow, flicker low, cooled a little. */
const House: React.FC<{len: number; cam: {z: [number, number]; x: [number, number]}; children?: React.ReactNode}> = ({len, cam, children}) => (
  <AbsoluteFill>
    <SilScene name="ch07_dark_house" size={dark.size as [number, number]} glowLayer={dark.glowLayer} a={0} b={len} cam={cam} flicker={0.08} fog={0.25} fade={8} />
    <AbsoluteFill style={{background: 'rgba(8,20,24,0.35)', mixBlendMode: 'multiply'}} />
    {children}
  </AbsoluteFill>
);

/** A teal line drawn through a word (no stranger). */
const Strike: React.FC<{x1: number; x2: number; y: number; at: number; dur?: number}> = ({x1, x2, y, at, dur = 8}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <path d={`M${x1},${y + 8} Q${(x1 + x2) / 2},${y - 10} ${x2},${y - 4}`} fill="none" stroke={pal.mark} strokeWidth={7} strokeLinecap="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/** Quiet display line: fades in, no stamp. */
const Line: React.FC<{text: string; x: number; y: number; at: number; size?: number; color?: string}> = ({text, x, y, at, size = 76, color = WHITE}) => {
  const g = useGFrame();
  if (g < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: JF.display, fontSize: size, lineHeight: 1.15, color, whiteSpace: 'nowrap',
      textShadow: '0 4px 18px rgba(0,0,0,0.85)', opacity: interpolate(g, [at, at + 8], [0, 1], clamp)}}>{text}</div>
  );
};

/** A source tag that only shows once its picture is on screen. */
const TagAt: React.FC<{text: string; at: number}> = ({text, at}) => (useGFrame() >= at ? <Tag text={text} /> : null);

/** 0:00 · Halloween, 1974. The dark street, slow push in. */
const Night: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <House len={b - a} cam={{z: [1.03, 1.1], x: [30, -10]}}>
    <Note text="Halloween, 1974 · outside Houston" x={130} y={130} size={70} rot={-2} at={t.at('Halloween') - a} dur={16} />
    <Note text="age 8 · out with his sister and friends" x={160} y={260} size={48} rot={-2} at={t.at('eight-year-old') - a} dur={16} color={WHITE} />
  </House>
);

/** 0:09 · before bed: the treat bag alone on the desk (B&W), three quiet notes. */
const Bag: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Prop name="treat_bag" x={1080} y={190} w={560} at={4} from="none" />
    <Note text="a candy straw" x={180} y={280} size={70} rot={-3} at={t.at('candy straw') - a} dur={14} />
    <Note text="within an hour" x={200} y={450} size={60} rot={-3} at={t.at('Within an hour') - a} dur={14} color={WHITE} />
    <Note text="cyanide" x={220} y={610} size={80} rot={-3} at={t.at('cyanide') - a} dur={12} />
  </AbsoluteFill>
);

/** 0:18 · the father's story: "a stranger at a dark house". Back to the street. */
const Story: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <House len={b - a} cam={{z: [1.1, 1.2], x: [0, 0]}}>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 40%)'}} />
    <Note text="“a stranger at a dark house”" x={150} y={120} size={66} rot={-2} at={t.at('a stranger') - a} dur={16} color={WHITE} />
    <Note text="the whole country heard it" x={190} y={250} size={52} rot={-2} at={t.at('The whole country') - a} dur={14} />
  </House>
);

/** 0:25 · but there was no stranger. The story crossed out; what the court found, line by line. */
const Truth: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Line text="a stranger" x={180} y={150} at={2} size={96} color={DIM} />
    <Strike x1={170} x2={700} y={225} at={t.at('no stranger') - a} />
    <Note text="his father." x={760} y={150} size={92} rot={-2} at={t.at('his father') - a} dur={12} />
    <Note text="deep in debt" x={240} y={420} size={60} rot={-2} at={t.at('deep in debt') - a} dur={12} color={WHITE} />
    <Note text="life insurance on his children" x={240} y={540} size={60} rot={-2} at={t.at('life insurance') - a} dur={16} color={WHITE} />
    <Note text="convicted of murder" x={240} y={680} size={60} rot={-2} at={t.at('convicted') - a} dur={12} />
    <Note text="executed almost ten years later" x={240} y={800} size={60} rot={-2} at={t.at('executed') - a} dur={16} />
  </AbsoluteFill>
);

/** 0:37 · the callback: the same painting as the cold open, same note. */
const Callback: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <House len={b - a} cam={{z: [1.03, 1.08], x: [20, -10]}}>
    <Note text="one night in Texas" x={140} y={160} size={84} rot={-3} at={t.at('night in Texas') - a} dur={14} />
  </House>
);

/** 0:40 · the fear spread: the 1982 AP story (fair use). */
const Spread: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <PhotoCard src="img/ch06/FAIRUSE_thehour_1982-10-28_halloween_kooks_xrays.png" x={560} y={110} w={900} rot={-2} at={2} fit="contain" filter="grayscale(1) contrast(1.15)" />
    <Note text="the fear spread" x={110} y={700} size={64} rot={-4} at={t.at('spread') - a} dur={12} />
    <Tag text="AP / The Hour, Oct. 28, 1982 · fair use" />
  </AbsoluteFill>
);

/** 0:43 · hospitals X-ray the candy (3D scan, bone tape in quiet mode). */
const XRay: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const k: Record<string, number> = {title: t.at('Hospitals') - a + 4, bag: 6, scanner: 16, sweep: 24, note: 124};
  return <XRayScan at={(s) => k[s] ?? 0} />;
};

/** 0:48 · every October, the same warning: the 1982 front page (fair use), the hospital line looped. */
const Warning: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <PhotoCard src="img/ch06/FAIRUSE_freelancestar_1982-10-27_xray_trick_or_treat_goodies.png" x={110} y={110} w={1200} rot={0} at={2} fit="contain" filter="grayscale(1) contrast(1.15)" />
    <Loop cx={623} cy={737} rx={200} ry={48} at={t.at('the same warning') - a} dur={12} />
    <Note text="every October:" x={1380} y={250} size={56} rot={-3} at={t.at('Every October') - a} dur={12} color={WHITE} />
    <Note text="check the candy" x={1380} y={390} size={60} rot={-3} at={t.at('check the candy') - a} dur={12} />
    <Note text="don't trust" x={1380} y={530} size={60} rot={-3} at={t.at("don't trust") - a} dur={10} />
    <Note text="strangers" x={1420} y={640} size={60} rot={-3} at={t.at('strangers') - a} dur={10} />
    <Tag text="The Free Lance-Star, Oct. 27, 1982 · fair use" />
  </AbsoluteFill>
);

/** 0:54 · the question, plain on the desk. */
const Question: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="so here's the question." x={200} y={210} size={56} rot={-2} at={t.at("So here's the question") - a} dur={14} color={DIM} />
    <Line text="How many kids has" x={200} y={360} at={t.at('How many') - a} size={92} />
    <Line text="a stranger's Halloween candy" x={200} y={490} at={t.at("a stranger's") - a} size={92} />
    <Line text="actually hurt?" x={200} y={620} at={t.at('actually hurt') - a} size={92} color="#2FE0C4" />
  </AbsoluteFill>
);

/** 0:59 · the sociologist's tally: ~130 reports, most hoaxes, and the zero. */
const Count: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const k: Record<string, number> = {title: t.at('One sociologist') - a, axis: t.at('One sociologist') - a + 8, dots: t.at('tracked') - a,
    counter: t.at('about 130') - a, grey: t.at('Most turned out') - a, zero: t.at('never found') - a};
  return <Tally at={(s) => k[s] ?? 0} />;
};

/** 1:20 · "by his own father." The dark house again, nothing written. */
const Silence: React.FC<{a: number; b: number}> = ({a, b}) => (
  <House len={b - a} cam={{z: [1.12, 1.17], x: [0, 0]}} />
);

/** 1:25 · the fear stuck: the 1983 Senate hearing. */
const Stuck: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <PhotoCard src="img/ch06/senate_hearing_1983_halloween_cancelled_quote.jpg" x={210} y={300} w={1500} rot={-1} at={2} fit="contain" />
    <Loop cx={760} cy={640} rx={520} ry={44} at={t.at('stuck') - a} dur={12} />
    <Note text="a fix of its own" x={330} y={790} size={66} rot={-3} at={t.at('a fix') - a} dur={12} />
    <Tag text="Senate Judiciary hearing, 1983" />
  </AbsoluteFill>
);

/** 1:29 · the fix: wrapped candy, parents behind, trunk-or-treat. */
const Fix: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const p = t.at('Parents walking') - a;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Prop name="candy_bowl" x={130} y={330} w={500} at={t.at('Factory-wrapped') - a} from="none" />
      <Note text="factory-wrapped only" x={110} y={170} size={48} rot={-3} at={t.at('Factory-wrapped') - a} dur={12} />
      <PhotoCard src="img/ch06/nbc_trick_or_treat_door_1969.jpg" x={800} y={210} w={400} h={528} rot={1.5} at={p} />
      <Note text="parents walk behind" x={720} y={830} size={56} rot={-3} at={p} dur={12} />
      <Note text="trunk-or-treat" x={1290} y={380} size={70} rot={-3} at={t.at('Trunk-or-treat') - a} dur={12} />
      <Note text="in church parking lots" x={1300} y={500} size={48} rot={-3} at={t.at('church parking') - a} dur={12} color={WHITE} />
      <TagAt text="NBC publicity still, 1969" at={p} />
    </AbsoluteFill>
  );
};

/** 1:35 · three beats. */
const Again: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Line text="Another scare." x={260} y={250} at={t.at('Another scare') - a} size={96} color={DIM} />
    <Line text="Another fix." x={420} y={420} at={t.at('Another fix') - a} size={96} color={DIM} />
    <Line text="Another tradition." x={580} y={590} at={t.at('Another tradition') - a} size={96} color="#2FE0C4" />
  </AbsoluteFill>
);

/** 1:38 · the closing question; the bag on the desk. */
const Ask: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Prop name="treat_bag" x={1180} y={260} w={480} at={2} from="none" />
    <Note text="was any of this a good idea?" x={150} y={330} size={66} rot={-2} at={t.at('was any') - a} dur={16} color={WHITE} />
    <Note text="it depends who you ask." x={190} y={500} size={66} rot={-2} at={t.at('It depends') - a} dur={16} />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {
    bag: at('That night') - 1, story: at('His father') - 1, truth: at('But there was') - 1, cb: at("That's the night") - 1,
    spread: at('But the fear') - 1, xray: at('Hospitals') - 1, warn: at('Every October') - 1, q: at("So here's the question") - 1,
    tally: at('How do we know') - 1, sil: at('The one boy') - 1, stuck: at('The fear stuck') - 1, fix: at('Factory-wrapped') - 1,
    again: at('Another scare') - 1, ask: at('So was any') - 1,
  };
  const S = (from: number, node: React.ReactNode) => <Sequence from={from} layout="none">{node}</Sequence>;
  const cuts: [number, React.ReactNode][] = [
    [0, <Night t={t} a={0} b={c.bag} />],
    [c.bag, S(c.bag, <Bag t={t} a={c.bag} />)],
    [c.story, S(c.story, <Story t={t} a={c.story} b={c.truth} />)],
    [c.truth, S(c.truth, <Truth t={t} a={c.truth} />)],
    [c.cb, S(c.cb, <Callback t={t} a={c.cb} b={c.spread} />)],
    [c.spread, S(c.spread, <Spread t={t} a={c.spread} />)],
    [c.xray, S(c.xray, <XRay t={t} a={c.xray} />)],
    [c.warn, S(c.warn, <Warning t={t} a={c.warn} />)],
    [c.q, S(c.q, <Question t={t} a={c.q} />)],
    [c.tally, S(c.tally, <Count t={t} a={c.tally} />)],
    [c.sil, S(c.sil, <Silence a={c.sil} b={c.stuck} />)],
    [c.stuck, S(c.stuck, <Stuck t={t} a={c.stuck} />)],
    [c.fix, S(c.fix, <Fix t={t} a={c.fix} />)],
    [c.again, S(c.again, <Again t={t} a={c.again} />)],
    [c.ask, S(c.ask, <Ask t={t} a={c.ask} />)],
  ];
  const scene = useScene(cuts);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {/* soft whooshes only: this chapter moves quietly */}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.14} />)}
      {[c.spread + 2, c.warn + 2, c.stuck + 2, at('Parents walking')].map((f, i) => <Sfx key={`p${i}`} at={f} src="sfx/paper_rustle.wav" volume={0.25} />)}
      <Sfx at={at('Hospitals') + 4} src="sfx/tape_pull.wav" volume={0.2} />
      <Sfx at={at('One sociologist')} src="sfx/tape_pull.wav" volume={0.2} />
      <Sfx at={at('never found')} src="sfx/stamp.wav" volume={0.25} />
      <Sfx at={at('no stranger')} src={WRITE.src} volume={WRITE.volume} />
      {['Halloween', 'eight-year-old', 'candy straw', 'Within an hour', 'cyanide', 'a stranger', 'The whole country', 'his father', 'deep in debt', 'life insurance',
        'convicted', 'executed', 'night in Texas', 'spread', 'Every October', 'check the candy', "don't trust", 'about 130', 'a fix', 'Factory-wrapped', 'Parents walking',
        'Trunk-or-treat', 'It depends'].map((p) => <Sfx key={p} at={at(p) - 2} src={WRITE.src} volume={WRITE.volume} />)}
    </AbsoluteFill>
  );
};

export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch07_the_night_in_texas.wav" lead={LEAD} quiet music={[{src: 'music/r_dix.mp3', volume: bed('r_dix', 14)}]}>
    <Body />
  </ChapterShell>
);
