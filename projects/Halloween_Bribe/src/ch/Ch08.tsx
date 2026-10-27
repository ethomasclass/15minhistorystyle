// Chapter 8 · "Treat or Shakedown?" Both readings (the 1948 letter, the racket callback, the 1933 mob, a two-views card that
// fills), then the recap walk down the 3D Halloween corridor to the 1933 headline and out the front door ("pay up"), then the
// 20 s end screen from "Thanks".
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch08_treat_or_shakedown.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Note, Tag, useGFrame} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, Quote, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {Prop} from '../kit/prop';
import {Slip} from '../kit/vox';
import {SilScene} from '../kit/silparallax';
import {Smoke} from '../fx/Headline';
import {HalloweenCorridor} from '../fx/Corridor';
import {END_FRAMES, EndScreen} from '../fx/EndScreen';
import mob from '../../public/img/layers/sil/ch04_mob_school/layers.json';

const N = words as Narration;
const T = makeTimeline(N, 30);
const THANKS = T.at('Thanks');
/** The end screen runs END_FRAMES from "Thanks"; the shell's `extra` holds the chapter open until then. */
const EXTRA = THANKS + END_FRAMES - Math.ceil(N.duration * 30);
export const CH08_FRAMES = chapterFrames(N, LEAD) + EXTRA;

const TEAL = '#2FE0C4';
const CORAL = '#FF6F61';
const CREAM = '#f4efe6';

/** 0:00 · the 1948 letter: "making gangsters of children", fine the parents. */
const Letter: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="not everybody liked the deal" x={130} y={126} size={62} rot={-3} at={t.at('Not everybody') - a - 3} color="#ffffff" />
    <Highlight text="A LETTER, 1948" x={120} y={234} size={96} at={t.at('In 1948') - a} seed={81} rot={-2} />
    <Quote text="making gangsters of children." at={t.at('making gangsters') - a - 2} x={150} y={420} w={1080} size={80}
      who="Letter to The Washington Post · 11 Nov 1948" />
    <Note text="fine the parents" x={170} y={735} size={76} rot={-3} at={t.at('fine parents') - a - 3} />
    <Note text="who send kids out “to beg”" x={210} y={835} size={60} rot={-3} at={t.at('sent their kids') - a - 3} color="#ffffff" />
    <Prop name="pillowcase_sack" x={1320} y={300} w={460} at={t.at('sent their kids') - a + 6} coral trace />
    <Tag text="Letter to the editor · The Washington Post, 11 Nov 1948, p. 12" />
  </AbsoluteFill>
);

/** 0:14 · "She had a point." The PROTECTION RACKET tape from ch5 comes back. */
const Racket: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="and honestly?" x={150} y={150} size={66} rot={-3} at={t.at('And honestly') - a - 3} color="#ffffff" />
    <Note text="she had a point." x={210} y={260} size={100} rot={-4} at={t.at('She had a point') - a - 3} color={CORAL} />
    <Note text="what we've called it all video:" x={170} y={470} size={56} rot={-2} at={t.at('We did just') - a - 3} color="#ffffff" />
    <Highlight text="PROTECTION RACKET" x={140} y={590} size={116} at={t.at('protection racket') - a} seed={41} rot={-3} />
    <Note text="(with better costumes)" x={980} y={820} size={56} rot={-4} at={t.at('protection racket') - a + 14} />
  </AbsoluteFill>
);

/** 0:20 · towns that had used tear gas 15 years earlier: the 1933 mob (callback), "a miracle". */
const Miracle: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => {
  const f = useCurrentFrame();
  const smoke = interpolate(f, [0, t.at('tear gas') - a, t.at('tear gas') - a + 20, t.at('miracle') - a, b - a], [0.2, 0.25, 0.75, 0.55, 0.25], clamp);
  return (
    <AbsoluteFill>
      <SilScene name="ch04_mob_school" size={mob.size as [number, number]} glowLayer={mob.glowLayer} a={0} b={b - a + 4} cam={{z: [1.12, 1.05], x: [30, -30]}} fade={4} />
      <Smoke density={smoke} seed="mob8" y={640} spread={260} speed={1.2} />
      <Slip text="tear gas on teenagers" x={1120} y={130} at={t.at('tear gas') - a - 3} rot={-3} size={60} />
      <Slip text="15 years earlier" x={1220} y={240} at={t.at('fifteen years') - a - 3} rot={-2} size={56} />
      <Highlight text="A MIRACLE" x={120} y={110} size={120} at={t.at('miracle') - a} seed={42} rot={-3} />
    </AbsoluteFill>
  );
};

/** 0:26 · the two-views card fills: the critic on the left, the towns on the right; both true. */
const TwoViews: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const side = (at: number, x: number, head: string, color: string, lines: {text: string; at: number}[]) => (
    <div style={{position: 'absolute', left: x, top: 190, width: 700}}>
      <div style={{fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color, opacity: interpolate(g, [at, at + 4], [0, 1], clamp)}}>{head}</div>
      {lines.map((l, i) => g >= l.at && (
        <div key={i} style={{marginTop: 34, fontFamily: JF.heavy, fontWeight: 900, fontSize: 70, lineHeight: 1.18, color: CREAM, textShadow: '0 3px 14px #000',
          opacity: interpolate(g, [l.at, l.at + 5], [0, 1], clamp), transform: `translateY(${interpolate(g, [l.at, l.at + 5], [16, 0], clamp)}px)`}}>{l.text}</div>
      ))}
    </div>
  );
  const div = interpolate(g, [0, 8], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 958, top: 140, width: 4, height: 640 * div, background: 'rgba(244,239,230,0.75)'}} />
      {side(2, 140, 'THE CRITIC · 1948', TEAL, [{text: '“making gangsters of children”', at: 4}])}
      {side(t.at('streets got quieter') - a - 2, 1060, 'THE TOWNS', CORAL, [
        {text: 'quieter streets,', at: t.at('streets got quieter') - a - 1},
        {text: 'a safe night out', at: t.at('safe night out') - a - 1},
      ])}
      <Highlight text="BOTH TRUE." x={700} y={836} size={110} at={t.at('true at once') - a} seed={43} rot={-2} />
    </AbsoluteFill>
  );
};

/** The recap corridor keys (frames, relative to the scene). 'ship' moved off "crossed the ocean" so it lights ~1.5 s after the
 *  turnip; 'fix' moved to "Every time grown-ups" so the hall lights up as the line starts (no dead stretch before the headline). */
const corridorKeys = (t: TL, a: number) => {
  const K: Record<string, number> = {
    start: t.at("So let's go back"), turnip: t.at('The turnip crossed') - 4, ship: t.at('ocean') + 6, teargas: t.at('The pranks got worse'),
    deal: t.at('So towns made a deal'), war: t.at('The war took'), suburbs: t.at('The suburbs gave'), scare: t.at('And a scare'),
    fix: t.at('Every time grown-ups') - 2, end: t.at('that headline from 1933'), reason: t.at("It's the reason"), door: t.at('when a kid knocks'),
    // the push through the door lands on "you might" so PAY UP is up ~2 s before the end screen takes over
    payup: t.at('you might want') - 14,
  };
  return (k: string) => {
    if (!(k in K)) throw new Error(`Ch08 corridor: no key "${k}"`);
    return K[k] - a;
  };
};

/** 0:32 · the recap: the corridor, with a few handwritten asides on the dark. */
const Recap: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const at = (p: string) => t.at(p) - a;
  return (
    <AbsoluteFill>
      <HalloweenCorridor at={corridorKeys(t, a)} />
      <Note text="the most destructive night…" x={140} y={126} size={64} rot={-3} at={at('most destructive') - 3} out={at('The turnip') - 4} color="#ffffff" />
      <Note text="…a candy holiday for little kids?" x={200} y={226} size={64} rot={-3} at={at('candy holiday') - 3} out={at('The turnip') - 4} />
      <Note text="every scare → a fix" x={150} y={740} size={72} rot={-3} at={at('invented a fix') - 3} out={at("isn't the opposite") - 4} color="#ffffff" />
      {f < at("isn't the opposite") - 4 && <Highlight text="THE TRADITION" x={220} y={840} size={100} at={at('the tradition')} seed={44} rot={-3} />}
      <Note text="not the opposite…" x={140} y={765} size={68} rot={-3} at={at("isn't the opposite") - 3} out={at('So when a kid') - 1} color="#ffffff" />
      {f < at('So when a kid') - 1 && <Highlight text="THE REASON FOR IT" x={220} y={858} size={90} at={at("It's the reason")} seed={45} rot={-2} />}
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {racket: at('And honestly') - 1, miracle: at('But to towns') - 1, views: at('The streets got') - 1, recap: at("So let's go back") - 21};
  const cuts: [number, React.ReactNode][] = [
    [0, <Letter t={t} a={0} />],
    [c.racket, <Sequence from={c.racket} layout="none"><Racket t={t} a={c.racket} /></Sequence>],
    [c.miracle, <Sequence from={c.miracle} layout="none"><Miracle t={t} a={c.miracle} b={c.views} /></Sequence>],
    [c.views, <Sequence from={c.views} layout="none"><TwoViews t={t} a={c.views} /></Sequence>],
    [c.recap, <Sequence from={c.recap} layout="none"><Recap t={t} a={c.recap} /></Sequence>],
  ];
  const scene = useScene(cuts);
  const XF = 12; // the corridor's last shot (PAY UP) dissolves into the end screen
  const recapOut = interpolate(frame, [THANKS, THANKS + XF], [1, 0], clamp);
  const k = (p: string) => at(p) - c.recap;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {frame < THANKS ? scene : (
        <>
          <Sequence from={THANKS} layout="none"><EndScreen start={THANKS} subscribe={at('subscribe')} more={at('more stories')} /></Sequence>
          {frame < THANKS + XF && <AbsoluteFill style={{opacity: recapOut}}>{scene}</AbsoluteFill>}
        </>
      )}
      {[c.racket, c.miracle, c.views].map((f) => <Sfx key={f} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      <Sfx at={c.recap + 4} src="sfx/whoosh.wav" volume={0.2} />
      {['In 1948', 'protection racket', 'miracle', 'true at once', 'the tradition', "It's the reason"].map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.28} />)}
      {['Not everybody', 'fine parents', 'sent their kids', 'And honestly', 'She had a point', 'We did just', 'most destructive', 'candy holiday', 'invented a fix', "isn't the opposite"].map((p) =>
        <Sfx key={p} at={at(p) - 5} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('protection racket') + 12} src={WRITE.src} volume={WRITE.volume} />
      {/* the corridor: a knock on the door, PAY UP stamps on */}
      <Sfx at={c.recap + k('when a kid knocks') + 12} src="sfx/knock.wav" volume={0.45} />
      <Sfx at={at('you might want') - 14 + 20} src="sfx/stamp.wav" volume={0.28} />
      {/* end screen (relative to "Thanks", as in EndScreenTest) */}
      <Sfx at={THANKS + 2} src="sfx/stamp.wav" volume={0.28} />
      <Sfx at={THANKS + 8} src="sfx/chunk_snap.wav" volume={0.3} />
      {[at('more stories'), at('subscribe')].map((a) => <Sfx key={a} at={a - 2} src={WRITE.src} volume={WRITE.volume} />)}
    </AbsoluteFill>
  );
};

// Music: one continuous pass of the hb_oiche_shamhna reprise, offset so cue second 117-140 (its fullest) runs from "And every
// fix became the tradition" through "pay up" into the thank-you, and its own soft outro (140-150 s) closes the end screen.
// Its quiet middle (88-97 s) falls under "So let's go back to the question"; the both-readings stretch sits 2 LU lower
// (the same audio, crossfaded to the louder entry as the corridor fades up).
const OFFSET = Math.round(52.5 * 30); // cue frame at narration frame 0
const REC = T.at("So let's go back") - 21;
const MUSIC = [
  {src: 'music/hb_oiche_shamhna.mp3', volume: bed('hb_oiche_shamhna', 15), startFrom: OFFSET, to: REC + 20, fadeOut: 20},
  {src: 'music/hb_oiche_shamhna.mp3', volume: bed('hb_oiche_shamhna'), startFrom: OFFSET + REC, from: REC},
];

export const Ch08: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch08_treat_or_shakedown.wav" lead={LEAD} extra={EXTRA} music={MUSIC}>
    <Body />
  </ChapterShell>
);
