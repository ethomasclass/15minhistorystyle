// Short 3 · "1796 recipe, step one: cut off its head." (native 1080x1920). It has its OWN voiced narration (audio/short3_turtle.wav,
// script/shorts/short3_turtle.txt), re-ordered with build() so the quote comes first: the quote + "That's step one.", then "In 1796, an
// American cookbook told you how to start dinner.", then the rest in order. It replaces the cranberry Short (VShort1, unused).
// Scenes: the cover (frame 0, also VShort3Cover: the turtle hanging upside down by its hind flippers from a hook, swaying, the 1796
// scrap beside it, under the cover line), closer on "cut off" with the quoted lines big and swiped as spoken, the same picture coral
// on "That's step one.", the Simmons title page, the drawn dining hall and turtle dock, the tureen = money, FAKED IT and the calf's
// head, p. 22 swiped, the Flow M1 dissolve with MOCK, the 100-turtle grid (−97%), the hanging turtle fading on "disappeared", and
// THE FAKE OUTLASTED THE REAL THING. The end card sits over the cover picture, so the replay loops.
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import {clamp} from '../lib/anim';
import {Highlight, JF, Loop, Note, useGFrame} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {type TL, useScene} from '../kit/shell';
import {Clip, CUT_COLOUR, flowH, flowSrc, type FlowName} from '../kit/tg_cut';
import {DropIn} from '../kit/tg_drop';
import {MockTape} from '../kit/tg_mock';
import {useMarks} from '../kit/tg_desk';
import {type Box, Slip, Spot, Swipe} from '../kit/vox';
import {Print} from '../kit/print';
import {BW_DOC, FrameSeqOr, PageScrap, SIMMONS_P2, SIMMONS_P22} from '../ch/ch34/parts';
import {build, type Built, Mode, OUTRO, PTag, type Seg, type ShortDef, storyFrames, VShell} from './vkit';

/** The quoted lines, widened a little from parts.tsx so the swipe covers "the" and "brains," whole. */
const QUOTE: Box[] = [[985, 3162, 1925, 84], [828, 3262, 1880, 84]];
const HEAD22: Box = SIMMONS_P22.head;
const BRAINS: Box = [745, 1532, 1395, 92];
/** The cover's tag and the close shot's are the same text, so it reads as one 7 s run. */
const TAG_P20 = 'Amelia Simmons, American Cookery, Hartford, 1796, p. 20';
/** The calf's head recipe: tagged from "the same cookbook" through the page, so the long tag gets its reading time. */
const TAG_P22 = 'Simmons, American Cookery, 1796, p. 22: “To dress a Calve’s Head. Turtle fashion.”';
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

// ------------------------------------------------------------------ the hanging turtle (the cover, the hook, the loop)
/** The turtle cut-out (654 x 573, head up, top view) turned upside down: the wrap points across its hind flippers, in the turned
 *  image's px (measured on the alpha: the flippers are ~80 px wide at image row 525, i.e. turned row 48, a little in from the tips). */
const TIE_A: [number, number] = [417, 48];
const TIE_B: [number, number] = [233, 48];
const TIE_MID = (TIE_A[0] + TIE_B[0]) / 2;
const TWINE = '#cdb98e';
/** The sway: a slow pendulum about the hook, already at full swing on frame 0 (so frame 0 is the cover, not a fade). */
const SWAY_DEG = 4.5;
const SWAY_T = 96; // frames per full swing
const swayAt = (g: number) => SWAY_DEG * Math.cos((2 * Math.PI * g) / SWAY_T);

type HangLayout = {hx: number; hy: number; tw: number; L: number};
/** The beam, the iron hook and the turtle hanging upside down by its hind flippers from two cords knotted in the hook's bowl.
 *  The cords and the turtle swing as one about the knot (hx, hy); the hook and beam hold still. Stark, not gory. */
const Hanging: React.FC<HangLayout & {opacity?: number}> = ({hx, hy, tw, L, opacity = 1}) => {
  const g = useGFrame();
  const k = tw / 654;
  const th = flowH('tg_turtle', tw);
  const ang = swayAt(g);
  const [ax, bx] = [(TIE_A[0] - TIE_MID) * k, (TIE_B[0] - TIE_MID) * k];
  const band = 36 * k; // half the flipper's width at the wrap
  return (
    <>
      {/* the beam: a dark timber across the top, the hook's eye bolted under it */}
      <div style={{position: 'absolute', left: -20, top: hy - 168, width: 1120, height: 46, background: 'linear-gradient(180deg, #4a3a2a 0%, #33281d 60%, #1d1712 100%)',
        boxShadow: '0 14px 22px rgba(0,0,0,0.55)', transform: 'rotate(-1.2deg)', opacity}} />
      <svg width={200} height={200} viewBox="-100 -170 200 200" style={{position: 'absolute', left: hx - 100, top: hy - 170, overflow: 'visible', opacity,
        filter: 'drop-shadow(6px 10px 8px rgba(0,0,0,0.55))'}}>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* the eye plate and the shank */}
          <rect x={-22} y={-128} width={44} height={14} rx={3} fill="#2a2621" stroke="#0e0c0a" strokeWidth={3} />
          <path d="M0,-114 L0,-34 C0,-6 -8,8 -22,8 C-40,8 -46,-12 -38,-26" stroke="#0e0c0a" strokeWidth={15} />
          <path d="M0,-114 L0,-34 C0,-6 -8,8 -22,8 C-40,8 -46,-12 -38,-26" stroke="#4b4640" strokeWidth={9} />
          <path d="M-2,-110 L-2,-36" stroke="#8a847b" strokeWidth={2.5} strokeOpacity={0.7} />
        </g>
      </svg>
      {/* the cords and the turtle, swinging about the knot in the hook's bowl (the bowl's bottom is 6 px under the hook point) */}
      <div style={{position: 'absolute', left: hx - 22, top: hy + 2, width: 0, height: 0, transform: `rotate(${ang}deg)`, transformOrigin: '0 0', opacity}}>
        <div style={{position: 'absolute', left: -TIE_MID * k, top: L - TIE_A[1] * k, width: tw, height: th, transform: 'rotate(180deg)',
          filter: 'drop-shadow(0 3px 2px rgba(0,0,0,0.7)) drop-shadow(18px 28px 26px rgba(0,0,0,0.5))'}}>
          <Img src={staticFile(flowSrc('tg_turtle'))} style={{display: 'block', width: tw, height: th, filter: CUT_COLOUR}} />
        </div>
        <svg width={10} height={10} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <g strokeLinecap="round" fill="none">
            {[ax, bx].map((x, i) => {
              // the cord from the knot to the wrap; the wrap is three turns across the flipper, square to the cord
              // the flipper's axis (turned image) leans ~20 deg out from vertical; the wraps go square across it
              const sx = Math.sign(x);
              const [ux, uy] = [0.34 * sx, -0.94];
              const [px, py] = [0.94, 0.34 * sx];
              const turns = [-6, 0, 6].map((o) => ({cx: x + ux * o, cy: L + uy * o}));
              return (
                <React.Fragment key={i}>
                  <line x1={0} y1={0} x2={x} y2={L} stroke="#16120d" strokeWidth={8} />
                  <line x1={0} y1={0} x2={x} y2={L} stroke={TWINE} strokeWidth={4.5} />
                  {turns.map((q, j) => (
                    <React.Fragment key={j}>
                      <line x1={q.cx - px * band} y1={q.cy - py * band} x2={q.cx + px * band} y2={q.cy + py * band} stroke="#16120d" strokeWidth={6.5} />
                      <line x1={q.cx - px * band} y1={q.cy - py * band} x2={q.cx + px * band} y2={q.cy + py * band} stroke={TWINE} strokeWidth={3.5} />
                    </React.Fragment>
                  ))}
                </React.Fragment>
              );
            })}
            <circle cx={0} cy={0} r={8} fill={TWINE} stroke="#16120d" strokeWidth={3} />
          </g>
        </svg>
      </div>
    </>
  );
};

/** The cover framing: the hook high, the turtle hanging in the top half, the recipe scrap pinned beside it; the type sits under it. */
const COVER_HANG: HangLayout = {hx: 640, hy: 232, tw: 560, L: 70};
/** The close framing (from "cut off"): the turtle bigger and the recipe scrap across the frame, big enough to read. */
const CLOSE_HANG: HangLayout = {hx: 580, hy: 240, tw: 720, L: 64};
/** The scrap: the heading and the two quoted lines of p. 20. */
const SCRAP_BOX: Box = [770, 2840, 2160, 520];
const LINES_BOX: Box = [790, 3120, 2140, 250];

/** The cover picture (also the end card's and "disappeared"): the hanging turtle and the 1796 scrap, the quote already swiped. */
const CoverPicture: React.FC<{opacity?: number}> = ({opacity = 1}) => (
  <>
    <DarkPaper />
    <Hanging {...COVER_HANG} opacity={opacity} />
    <PageScrap src={SIMMONS_P2.src} size={SIMMONS_P2.size} box={SCRAP_BOX} x={30} y={300} w={420} rot={-6} seed="c3" opacity={opacity}>
      <Swipe lines={QUOTE} from={-999} to={-998} seed="q3" />
    </PageScrap>
  </>
);

/** Frame 0: the cover, fully drawn from the first frame (the corner wordmark comes from the shell); held until "cut off". */
const Cover: React.FC = () => (
  <Mode m="teal">
    <CoverPicture />
    <Note text="1796 recipe, step one:" x={80} y={800} size={72} rot={-3} color="#ffffff" />
    <Highlight text="CUT OFF" x={60} y={888} size={132} at={-30} seed={51} rot={-3} />
    <Highlight text="ITS HEAD" x={130} y={1030} size={132} at={-30} seed={52} rot={-2} />
    <PTag text={TAG_P20} />
  </Mode>
);

/** From "cut off the head": closer, still swinging; the quote on the real page, big, swiped as it is spoken.
 *  On "That's step one." the same picture goes coral (nothing new to read). */
const Close: React.FC<{t: TL; coral?: boolean}> = ({t, coral}) => (
  <Mode m={coral ? 'coral' : 'teal'}>
    <DarkPaper />
    <Hanging {...CLOSE_HANG} />
    <PageScrap src={SIMMONS_P2.src} size={SIMMONS_P2.size} box={LINES_BOX} x={40} y={900} w={1000} rot={-2} seed="s3">
      <Swipe lines={QUOTE} from={t.at('"About') - 1} to={t.end('blood."') + 2} seed="q3" />
    </PageScrap>
    <PTag text={TAG_P20} />
  </Mode>
);

/** "In 1796, an American cookbook told you how to start dinner.": the 1796 title page lands, a slow push; a loop on its date. */
const Title: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const z = interpolate(g, [a, a + 150], [1, 1.08], clamp);
  return (
    <Mode m="black">
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '540px 700px'}}>
        <Print src="img/arch/simmons-1796-title-page.jpg" x={190} y={170} w={700} h={1027} at={a + 1} rot={-2} pos="50% 50%" />
        <Loop cx={555} cy={1090} rx={90} ry={46} at={t.at('cookbook') - 2} seed={53} tilt={-4} />
      </AbsoluteFill>
      <PTag text="Amelia Simmons, American Cookery, Hartford, 1796 · title page · Library of Congress" />
    </Mode>
  );
};

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
    <Slip text="shipped up alive" x={70} y={190} at={a + 2} rot={-3} size={78} coral />
    <Slip text="from the Caribbean" x={150} y={310} at={a + 7} rot={2} size={66} />
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
    <Note text="the same 1796 cookbook:" x={70} y={390} size={74} rot={-3} at={t.at('faked') + 8} color="#ffffff" />
    <Prop name="tg_calf_head" at={t.at("calf's head.")} x={90} y={640} w={900} rot={2} from={[-1100, 60, -18]} />
    <PTag text={TAG_P22} />
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
      <PTag text={TAG_P22} />
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
      {g >= c0 && <div data-tx style={{position: 'absolute', left: 70, top: 160, fontFamily: JF.display, fontSize: 210, lineHeight: 1, color: '#f4efe6', whiteSpace: 'nowrap',
        textShadow: '0 6px 22px rgba(0,0,0,0.8)'}}>{`−${v}%`}</div>}
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
    close: at('cut off') - 2, // the cover holds 3.7 s
    step: at("That's step") - 1,
    title: at('In 1796,') - 2,
    grand: at('Turtle soup') - 1,
    dock: at('Green sea') - 1,
    money: at('If turtle') + 12,
    faked: at('faked') - 1,
    brains: at('Open it') - 1,
    morph: Math.max(at('Cook it') - 1, at('Open it') + 92), // p. 22 in full view for 3 s
    decline: at('The real') - 1,
    gone: at('Turtle soup', 2) - 1,
    outlasted: at('The fake') - 4,
  };
  return (
    <>
      {useScene([
        [c.cover, <Cover />],
        [c.close, <Close t={t} />],
        [c.step, <Close t={t} coral />],
        [c.title, <Title t={t} a={c.title} />],
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

/** The Short's own narration, re-ordered at word boundaries (build(): 0.12 s before, 0.2 s after, 0.3 s of air): the quote and
 *  "That's step one." first, then the opening line, then the rest in order. */
export const SEGS3: Seg[] = [
  {ch: 'short3', first: '"About nine', last: 'step one.'},
  {ch: 'short3', first: 'In 1796,', last: 'start dinner.'},
  {ch: 'short3', first: 'Turtle soup was', last: 'real thing.'},
];
export const B3: Built = build(SEGS3);
const DEF: ShortDef = {music: 'tg_parlor_waltz', Scenes, segs: SEGS3};
export const VSHORT3_FRAMES = storyFrames(B3) + OUTRO;
export const VShort3: React.FC = () => <VShell d={DEF} b={B3} />;
