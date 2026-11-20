// Short 3 · "1796: step one, hang up your turtle." (native 1080x1920). Unlike Shorts 1 and 2 this one has its OWN voiced narration
// (audio/short3_turtle.wav, script/shorts/short3_turtle.txt), used whole: no splicing. It replaces the cranberry Short (VShort1,
// still registered but unused).
// Scenes: the cover (the turtle cut-out and the 1796 recipe scrap under the cover line), the Simmons title page, the turtle recipe
// (p. 20) with the quoted lines swiped as they are spoken, a coral flash on "That's step one.", the drawn dining hall and the turtle
// dock (cropped to portrait), the tureen = money, FAKED IT and the calf's head, the brains line swiped on p. 22, the Flow M1 dissolve
// (calf's head -> tureen) with the MOCK tape on "Mock turtle", the 100-turtle grid (97 go grey, a stepped counter), the turtle
// fading out on "disappeared", and the tureen with its MOCK tape for "The fake outlasted the real thing." The end card sits over
// the cover picture, so the replay loops.
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import {clamp} from '../lib/anim';
import {Highlight, JF, Loop, Note, useGFrame} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {type Narration} from '../lib/timing';
import {type TL, useScene} from '../kit/shell';
import {Clip, CUT_COLOUR, flowH, flowSrc, type FlowName} from '../kit/tg_cut';
import {DropIn} from '../kit/tg_drop';
import {MockTape} from '../kit/tg_mock';
import {useMarks} from '../kit/tg_desk';
import {type Box, Slip, Spot, Swipe} from '../kit/vox';
import {Print} from '../kit/print';
import {BW_DOC, FrameSeqOr, PageScrap, SIMMONS_P2, SIMMONS_P22} from '../ch/ch34/parts';
import {type Built, Mode, OUTRO, PTag, type ShortDef, storyFrames, VShell} from './vkit';
import words from '../../public/audio/short3_turtle.words.json';

const N = words as Narration;

/** The quoted lines, widened a little from parts.tsx so the swipe covers "the" and "brains," whole. */
const QUOTE: Box[] = [[985, 3162, 1925, 84], [828, 3262, 1880, 84]];
const HEAD22: Box = SIMMONS_P22.head;
const BRAINS: Box = [745, 1532, 1395, 92];
const TAG_P20 = 'Amelia Simmons, American Cookery, Hartford, 1796, p. 20 · Library of Congress / Internet Archive';
const TAG_DRAWN = 'Drawn scene · the people are invented';

// ------------------------------------------------------------------ shared pieces
/** A Flow cut-out dropped onto the desk (contact shadow at rest), natural aspect, `w` wide; `grey` fades it to a grey ghost. */
const Prop: React.FC<{name: FlowName; at: number; x: number; y: number; w: number; rot?: number; from?: [number, number, number]; greyAt?: number}> = ({
  name, at, x, y, w, rot, from, greyAt = 1e9,
}) => {
  const g = useGFrame();
  const q = interpolate(g, [greyAt, greyAt + 8], [0, 1], clamp);
  return (
    <DropIn at={at} x={x} y={y} rot={rot} from={from}>
      <Img src={staticFile(flowSrc(name))} style={{display: 'block', width: w, height: flowH(name, w), opacity: 1 - 0.6 * q,
        filter: q > 0 ? `${CUT_COLOUR} grayscale(${q})` : CUT_COLOUR}} />
    </DropIn>
  );
};

/** A full-frame camera on a scan: page point (x, y) at screen (sx, sy), zoom z. Children in page px (Swipe, Spot). */
const PageCam: React.FC<{src: string; size: [number, number]; x: number; y: number; z: number; sx?: number; sy?: number; children?: React.ReactNode}> = ({
  src, size, x, y, z, sx = 540, sy = 640, children,
}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: sx - x * z, top: sy - y * z, width: size[0], height: size[1], transform: `scale(${z})`, transformOrigin: '0 0'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: size[0], height: size[1], filter: BW_DOC}} />
      {children}
    </div>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 34%, transparent 40%, rgba(0,0,0,0.6) 100%)'}} />
  </AbsoluteFill>
);

/** A drawn 16:9 scene cropped to portrait: the clip at zoom `z` (at least 1.78 to fill the height), clip point (cx, cy) at the frame's centre
 *  (cx moving to `cx2`). Zoomed past the fill so the table and the crate sit above the captions. */
const PortraitClip: React.FC<{name: 'dining_hall' | 'turtle_dock'; at: number; start?: number; cx: number; cx2?: number; cy?: number; dur?: number; z?: number}> = ({
  name, at, start = 0, cx, cx2 = cx, cy = 540, dur = 120, z = 1920 / 1080,
}) => {
  const g = useGFrame();
  const c = interpolate(g, [at, at + dur], [cx, cx2], clamp);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#0d0c09'}}>
      <div style={{position: 'absolute', left: 540 - c * z, top: 960 - cy * z, width: 1920, height: 1080, transform: `scale(${z})`, transformOrigin: '0 0'}}>
        <Clip name={name} at={at} start={start} />
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the cover picture (also the end card's)
const TURTLE = {x: 300, y: 565, w: 760, rot: 8};
const CoverPicture: React.FC<{opacity?: number}> = ({opacity = 1}) => (
  <>
    <DarkPaper />
    <div style={{position: 'absolute', left: TURTLE.x, top: TURTLE.y, transform: `rotate(${TURTLE.rot}deg)`, opacity,
      filter: 'drop-shadow(0 3px 2px rgba(0,0,0,0.7)) drop-shadow(14px 22px 22px rgba(0,0,0,0.5))'}}>
      <Img src={staticFile(flowSrc('tg_turtle'))} style={{display: 'block', width: TURTLE.w, height: flowH('tg_turtle', TURTLE.w), filter: CUT_COLOUR}} />
    </div>
    <PageScrap src={SIMMONS_P2.src} size={SIMMONS_P2.size} box={SIMMONS_P2.scrap} x={55} y={930} w={590} rot={-4} seed="c3" opacity={opacity}>
      <Swipe lines={QUOTE} from={-999} to={-998} seed="q3" />
    </PageScrap>
  </>
);

/** Frame 0: the cover, fully drawn from the first frame (the corner wordmark comes from the shell). */
const Cover: React.FC = () => (
  <Mode m="teal">
    <CoverPicture />
    <Note text="1796, step one:" x={70} y={170} size={84} rot={-3} color="#ffffff" />
    <Highlight text="HANG UP" x={60} y={275} size={132} at={-30} seed={51} rot={-3} />
    <Highlight text="YOUR TURTLE" x={60} y={440} size={132} at={-30} seed={52} rot={-2} />
    <PTag text="Amelia Simmons, American Cookery, 1796" />
  </Mode>
);

/** "an American cookbook": the 1796 title page lands; a loop on its date. */
const Title: React.FC<{a: number}> = ({a}) => (
  <Mode m="black">
    <DarkPaper />
    <Print src="img/arch/simmons-1796-title-page.jpg" x={190} y={170} w={700} h={1027} at={a + 1} rot={-2} pos="50% 50%" />
    <Loop cx={555} cy={1090} rx={90} ry={46} at={a + 8} seed={53} tilt={-4} />
    <PTag text="Amelia Simmons, American Cookery, Hartford, 1796 · title page · Library of Congress" />
  </Mode>
);

/** The quote: Simmons p. 20, the quoted two lines lit and swiped coral as they are spoken; a slow push. */
const Quote: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const z = interpolate(g, [a, a + 170], [0.54, 0.56], clamp);
  const y = interpolate(g, [a, a + 170], [3120, 3200], clamp);
  return (
    <Mode m="black">
      <DarkPaper />
      <PageCam src={SIMMONS_P2.src} size={SIMMONS_P2.size} x={1880} y={y} z={z} sy={620}>
        <Spot size={SIMMONS_P2.size} boxes={[SIMMONS_P2.heading, ...QUOTE]} at={a + 4} id="q3s" dark={0.5} />
        <Swipe lines={QUOTE} from={t.at('"About') - 1} to={t.end('blood."') + 2} seed="q3" />
      </PageCam>
      <PTag text={TAG_P20} />
    </Mode>
  );
};

/** "That's step one.": the swiped lines alone on the coral desk, nothing new to read, held. */
const StepOne: React.FC = () => (
  <Mode m="coral">
    <DarkPaper />
    <PageScrap src={SIMMONS_P2.src} size={SIMMONS_P2.size} box={[780, 3130, 2150, 240]} x={60} y={560} w={960} rot={-2} seed="s3">
      <Swipe lines={QUOTE} from={-999} to={-998} seed="q3" />
    </PageScrap>
  </Mode>
);

/** "Turtle soup was one of the fanciest dishes in America": the drawn dining hall, the waiter and the tureen. */
const Grand: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <PortraitClip name="dining_hall" at={a} start={4.6} cx={1010} cx2={970} cy={680} z={2.4} dur={100} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(13,12,9,0.55) 0%, transparent 34%)'}} />
    <Highlight text="ONE OF THE FANCIEST" x={50} y={180} size={80} at={t.at('Turtle soup')} seed={54} rot={-3} />
    <Highlight text="DISHES IN AMERICA" x={80} y={305} size={80} at={t.at('Turtle soup') + 4} seed={55} rot={-2} />
    <PTag text={TAG_DRAWN} />
  </AbsoluteFill>
);

/** "Green sea turtles, shipped up alive from the Caribbean": the drawn wharf, the crate coming down off the brig. */
const Dock: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <PortraitClip name="turtle_dock" at={a} cx={590} cx2={620} cy={680} z={2.4} dur={130} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(13,12,9,0.45) 0%, transparent 30%)'}} />
    <Slip text="shipped up alive" x={70} y={190} at={t.at('shipped') - 3} rot={-3} size={78} coral />
    <Slip text="from the Caribbean" x={150} y={310} at={t.at('shipped') + 2} rot={2} size={66} />
    <PTag text={TAG_DRAWN} />
  </AbsoluteFill>
);

/** The tureen, where it stands for the money beat and the ending. */
const TUREEN = {x: 110, y: 700, w: 860};

/** "If turtle was on your table, you had money": the tureen drops in, = MONEY; "people who didn't" greys it out. */
const Money: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <Mode m="teal">
    <DarkPaper />
    <Prop name="tg_tureen" at={a + 4} {...TUREEN} rot={-1} from={[0, -700, 10]} greyAt={t.at("didn't...")} />
    <Note text="turtle on your table" x={70} y={190} size={80} rot={-3} at={t.at('table,') - 6} color="#ffffff" />
    <Highlight text="= MONEY" x={120} y={330} size={150} at={t.at('table,')} seed={56} rot={-3} />
  </Mode>
);

/** "So people who didn't... faked it. The same cookbook: take a calf's head.": FAKED IT, then the calf's head drops in. */
const Faked: React.FC<{t: TL}> = ({t}) => (
  <Mode m="teal">
    <DarkPaper />
    <Highlight text="FAKED IT" x={60} y={180} size={140} at={t.at('faked')} seed={57} rot={-3} />
    <Note text="the same 1796 cookbook:" x={70} y={390} size={74} rot={-3} at={t.at('The same') - 2} color="#ffffff" />
    <Prop name="tg_calf_head" at={t.at("calf's head.")} x={90} y={640} w={900} rot={2} from={[-600, -700, -18]} />
  </Mode>
);

/** "Open it up. Take out the brains.": Simmons p. 22, the head line, then the brains line, swiped as they are said. */
const Brains: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const y = interpolate(g, [a, a + 75], [1420, 1500], clamp);
  return (
    <Mode m="black">
      <DarkPaper />
      <PageCam src={SIMMONS_P22.src} size={SIMMONS_P22.size} x={1760} y={y} z={0.56} sy={620}>
        <Spot size={SIMMONS_P22.size} boxes={[SIMMONS_P22.heading, HEAD22, BRAINS]} at={a + 2} id="b3s" dark={0.5} />
        <Swipe lines={[HEAD22]} from={t.at('Open') - 1} to={t.end('it up.') + 2} seed="b31" />
        <Swipe lines={[BRAINS]} from={t.at('Take out') - 1} to={t.end('brains.') + 3} seed="b32" />
      </PageCam>
      <PTag text="Simmons, American Cookery, 1796, p. 22: “To dress a Calve’s Head. Turtle fashion.”" />
    </Mode>
  );
};

/** "Cook it until it tastes, more or less, like turtle. Mock turtle.": the M1 dissolve, calf's head -> tureen; MOCK slaps on. */
const M1 = {x: 40, y: 560, w: 1000};
const Morph: React.FC<{t: TL}> = ({t}) => (
  <Mode m="teal">
    <DarkPaper />
    <FrameSeqOr base="img/flow/m1/m1" n={36} what="Flow M1 · calf's head → turtle tureen" x={M1.x} y={M1.y} w={M1.w} h={(M1.w * 520) / 900}
      from={t.at('Cook it') + 3} to={t.at('like turtle.') + 4} />
    <Slip text="more or less" x={90} y={250} at={t.at('more or less,') - 2} rot={-3} size={84} />
    <MockTape x={560} y={1000} at={t.at('Mock turtle.')} size={130} />
  </Mode>
);

/** A small drawn turtle (top view), 60 x 46 (as Ch04). */
const TurtleGlyph: React.FC<{x: number; y: number; color: string; k: number}> = ({x, y, color, k}) => (
  <svg width={60} height={46} viewBox="0 0 60 46" style={{position: 'absolute', left: x, top: y, transform: `scale(${k})`, overflow: 'visible'}}>
    <g fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx={30} cy={23} rx={16} ry={13} fill={color} fillOpacity={0.28} />
      <circle cx={51} cy={23} r={5} />
      <path d="M22,11 L13,3 M38,11 L44,4 M22,35 L13,43 M38,35 L44,42 M14,23 L7,23" />
    </g>
  </svg>
);

/** "Their numbers fell by about ninety-seven percent": 100 turtles; the stepped counter runs to -97% as 97 go grey; 3 stay coral. */
const GRID = {x: 190, y: 470, gap: 70};
const Decline: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const c0 = t.at('fell by'), c1 = t.at('percent.') + 3;
  const v = Math.round(interpolate(g, [c0, c1], [0, 97], clamp));
  const done = g >= c1;
  const {teal: TEAL, coral: CORAL} = useMarks();
  return (
    <Mode m="teal">
      <DarkPaper />
      {Array.from({length: 100}, (_, i) => {
        const ai = a + 2 + (i % 10) * 0.6 + Math.floor(i / 10) * 0.6;
        if (g < ai) return null;
        const k = interpolate(g, [ai, ai + 2.5, ai + 5], [0, 1.2, 1], clamp);
        const color = i < 97 ? (i < v ? 'rgba(244,239,230,0.22)' : TEAL) : done ? CORAL : TEAL;
        return <TurtleGlyph key={i} x={GRID.x + (i % 10) * GRID.gap} y={GRID.y + Math.floor(i / 10) * GRID.gap} color={color} k={k} />;
      })}
      <div data-tx style={{position: 'absolute', left: 70, top: 160, fontFamily: JF.display, fontSize: 210, lineHeight: 1, color: '#f4efe6', whiteSpace: 'nowrap',
        textShadow: '0 6px 22px rgba(0,0,0,0.8)'}}>{`−${v}%`}</div>
      <div data-tx style={{position: 'absolute', left: 80, top: 385, fontFamily: JF.mono, fontSize: 28, letterSpacing: 2, color: 'rgba(244,239,230,0.85)'}}>
        CARIBBEAN GREEN SEA TURTLES
      </div>
      <PTag text="Estimated decline · reported by phys.org (2018) · Oceanic Society" />
    </Mode>
  );
};

/** "Turtle soup disappeared.": the cover's turtle, alone, fading out. */
const Gone: React.FC<{a: number}> = ({a}) => {
  const g = useGFrame();
  return (
    <Mode m="teal">
      <CoverPicture opacity={interpolate(g, [a + 10, a + 45], [1, 0.08], clamp)} />
    </Mode>
  );
};

/** "The fake outlasted the real thing.": the tureen with its MOCK tape, the line set big. */
const Outlasted: React.FC = () => (
  <Mode m="teal">
    <DarkPaper />
    <Prop name="tg_tureen" at={-999} {...TUREEN} rot={-1} />
    <MockTape x={560} y={1010} at={-999} size={130} />
    <Highlight text="THE FAKE" x={60} y={180} size={124} at={-30} seed={58} rot={-3} />
    <Highlight text="OUTLASTED" x={110} y={330} size={124} at={-30} seed={59} rot={-2} />
    <Highlight text="THE REAL THING" x={60} y={480} size={104} at={-30} seed={60} rot={-3} />
  </Mode>
);

const Scenes: React.FC<{t: TL; len: number}> = ({t, len}) => {
  const at = t.at;
  const c = {
    cover: 0,
    title: at('cookbook') - 1, // the cover holds 2.5 s
    quote: at('"About') - 4,
    step: at("That's step") - 1,
    grand: at('Turtle soup') - 1,
    dock: at('Green sea') - 1,
    money: at('If turtle') + 12,
    faked: at('faked') - 1,
    brains: at('Open it') - 1,
    morph: at('Cook it') - 1,
    decline: at('The real') - 1,
    gone: at('Turtle soup', 2) - 1,
    outlasted: at('The fake') - 4,
  };
  return (
    <>
      {useScene([
        [c.cover, <Cover />],
        [c.title, <Title a={c.title} />],
        [c.quote, <Quote t={t} a={c.quote} />],
        [c.step, <StepOne />],
        [c.grand, <Grand t={t} a={c.grand} />],
        [c.dock, <Dock t={t} a={c.dock} />],
        [c.money, <Money t={t} a={c.money} />],
        [c.faked, <Faked t={t} />],
        [c.brains, <Brains t={t} a={c.brains} />],
        [c.morph, <Morph t={t} />],
        [c.decline, <Decline t={t} a={c.decline} />],
        [c.gone, <Gone a={c.gone} />],
        [c.outlasted, <Outlasted />],
        // the end card's picture: the cover's, so the replay loops (EndText in the shell draws over it)
        [len, <Mode m="teal"><CoverPicture /></Mode>],
      ])}
    </>
  );
};

/** The Short's own narration, whole: one segment from 0 to the end of the file. */
export const B3: Built = {
  segs: [{wav: 'audio/short3_turtle.wav', from: 0, to: N.duration, at: 0, text: N.words.map((w) => w.w).join(' ')}],
  n: {voice: N.voice ?? 'short3', duration: N.duration, words: N.words},
};
const DEF: ShortDef = {music: 'tg_parlor_waltz', Scenes, segs: []};
export const VSHORT3_FRAMES = storyFrames(B3) + OUTRO;
export const VShort3: React.FC = () => <VShell d={DEF} b={B3} />;
