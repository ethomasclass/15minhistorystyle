// Short 2 · "The Thanksgiving turkey was redesigned." (native 1080x1920). Opens on the end state of the inflating turkey (the heavy
// white bird on its scale) under the cover line, then splices chapter 8: the GMO myth, pick / breed / repeat (rows of birds that get
// bigger each generation), the 1950s white feathers, about thirteen pounds in the 1930s and over thirty today (the dial and the
// counter stacked top-left while the body inflates over the same thin legs), too top-heavy, artificial insemination for nearly
// every one, and "Happy Thanksgiving." on a coral flash. The end card sits over the opening picture, so the replay loops.
// The turkey rig is kit/tg_turkey.tsx, re-laid out for portrait: the bird large and mirrored to face right (its head clears the
// cover type on the left; the tail leaves the top-left free for the dial and counter).
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, Loop, Note, useGFrame} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {type TL, useScene} from '../kit/shell';
import {Counter, Dial, TURKEY, type TurkeyBeats, TurkeyRig} from '../kit/tg_turkey';
import {CUT_COLOUR, DESK_SHADOW} from '../kit/tg_cut';
import {DropIn} from '../kit/tg_drop';
import {Loupe, ORANGE} from '../kit/tg_late';
import {Slip} from '../kit/vox';
import {Print} from '../kit/print';
import {build, type Built, Mode, OUTRO, PTag, type Seg, type ShortDef, storyFrames, VShell} from './vkit';

/** The spliced lines (phrases as in script/ch08_turkey.txt). */
export const SEGS2: Seg[] = [
  {ch: 'ch08', first: 'You may have', last: 'in a lab.'},
  {ch: 'ch08', first: 'They did it', last: 'and repeat.'},
  {ch: 'ch08', first: 'Then in the 1950s,', last: 'white ones.'},
  {ch: 'ch08', first: 'In the 1930s,', last: 'over thirty.'},
  {ch: 'ch08', first: 'It worked so', last: 'artificial insemination.'},
  {ch: 'ch08', first: 'Happy Thanksgiving.', last: 'Happy Thanksgiving.'},
];

// ------------------------------------------------------------------ the portrait set
/** The bird's feet (on the scale's tray) and its rig box size, in screen px at zoom 1. */
const FEET: [number, number] = [470, 1110];
const SIZE = 720;
/** The scale cut-out (482 x 537): the tray's middle (279, 62) under the feet; its width on screen. */
const SW = 396;
/** The dial and the counter, stacked top-left (screen space, so they hold still through camera moves). */
const DIAL: [number, number] = [235, 330];
const COUNTER: [number, number] = [70, 485];

type Cam = {x: number; y: number; z: number};
/** The scale and the bird, mirrored about the feet so the bird faces right. Drawn in set px (the caller places the camera). */
const Bird: React.FC<{b: TurkeyBeats; shadow?: boolean}> = ({b}) => {
  const [fx, fy] = FEET;
  const k = SW / 482;
  return (
    <AbsoluteFill style={{transform: 'scaleX(-1)', transformOrigin: `${fx}px 0px`}}>
      <Img src={staticFile(TURKEY.scale)} style={{position: 'absolute', left: fx - 279 * k, top: fy - 62 * k, width: SW, height: 537 * k, filter: `${CUT_COLOUR} ${DESK_SHADOW}`}} />
      <TurkeyRig x={fx} y={fy} size={SIZE} b={b} label={false} />
    </AbsoluteFill>
  );
};

/** The whole set through a camera looking at (x, y) at zoom z; `dial` shows the dial and counter top-left. */
const TSet: React.FC<{b: TurkeyBeats; cam?: Cam; dial?: boolean; children?: React.ReactNode}> = ({b, cam = {x: 540, y: 960, z: 1}, dial = false, children}) => (
  <AbsoluteFill>
    <DarkPaper />
    <AbsoluteFill style={{transform: `translate(${540 - cam.x * cam.z}px, ${960 - cam.y * cam.z}px) scale(${cam.z})`, transformOrigin: '0 0'}}>
      <Bird b={b} />
    </AbsoluteFill>
    {dial && <Dial x={DIAL[0]} y={DIAL[1]} r={125} b={b} />}
    {dial && <Counter x={COUNTER[0]} y={COUNTER[1]} b={b} size={96} />}
    {children}
  </AbsoluteFill>
);

/** The finished bird: white, the heavy body (the counter's 30+), standing level. The cover, the flash and the end card. */
const DONE: TurkeyBeats = {swapAt: -200, w13At: -200, grow: [-200, -199]};
/** The finished bird's framing: 190 px lower than the story shots, so its back clears the three lines of cover type. */
const DONE_CAM: Cam = {x: 540, y: 770, z: 1};

/** Frame 0: the cover, fully drawn from the first frame (the corner wordmark comes from the shell). */
const Cover: React.FC = () => (
  <Mode m="teal">
    <TSet b={DONE} cam={DONE_CAM}>
      <Highlight text="THIS TURKEY" x={60} y={180} size={112} at={-30} seed={31} rot={-3} />
      <Highlight text="CAN'T MATE" x={90} y={330} size={112} at={-30} seed={32} rot={-2} />
      <Highlight text="ON ITS OWN" x={60} y={480} size={112} at={-30} seed={33} rot={-3} />
    </TSet>
  </Mode>
);

/** "You may have heard it's a GMO turkey. It isn't.": the USDA photograph of the breed, the claim struck through. */
const Gmo: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const sAt = t.at("isn't.");
  const p = interpolate(g, [sAt, sAt + 5], [0, 1], clamp);
  return (
    <Mode m="black">
      <DarkPaper />
      <Print src="img/arch/large-white-turkey-female-usda-ars.jpg" x={300} y={330} w={560} h={843} at={a + 1} rot={2} pos="50% 50%" />
      <Note text="a GMO turkey?" x={70} y={180} size={96} rot={-3} at={a} color={ORANGE} />
      {g >= sAt && (
        <svg width={1080} height={400} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <path d="M60,282 Q330,250 610,226" fill="none" stroke={ORANGE} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        </svg>
      )}
      <PTag text="Large White turkey hen · USDA Agricultural Research Service" />
    </Mode>
  );
};

/** A bird icon (the rig's cut-out, mirrored to face right), `w` wide, its feet at (x, y), dropped in on its own at `at`. */
const Icon: React.FC<{src: string; x: number; y: number; w: number; at: number}> = ({src, x, y, w, at}) => {
  const h = (w * 628) / 671;
  return (
    <DropIn at={at} x={x} y={y - h} from={[0, -500, 0]}>
      <Img src={staticFile(src)} style={{display: 'block', width: w, height: h, transform: 'scaleX(-1)', filter: CUT_COLOUR}} />
    </DropIn>
  );
};

/** Pick the biggest birds, breed them, and repeat: three generations as rows; the two biggest of each row are ringed and
 *  arrows run down to the next, bigger row. */
const ROWS: {y: number; ws: number[]}[] = [
  {y: 580, ws: [150, 175, 160, 200]},
  {y: 840, ws: [185, 205, 195, 225]},
  {y: 1100, ws: [215, 240, 225, 255]},
];
const rowX = (ws: number[], i: number) => 540 - (ws.reduce((s, w) => s + w, 0) + 30 * (ws.length - 1)) / 2 + ws.slice(0, i).reduce((s, w) => s + w + 30, 0);
const OldWay: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const show = [a + 2, t.at('breed them,'), t.at('and repeat.')];
  const ring = [t.at('biggest birds,'), t.at('and repeat.') - 6, 1e9];
  return (
    <Mode m="teal">
      <DarkPaper />
      <Note text="the old-fashioned way:" x={70} y={185} size={84} rot={-3} at={t.at('old-fashioned') - 2} color="#ffffff" />
      {ROWS.map((r, ri) => {
        if (g < show[ri]) return null;
        const big = [...r.ws.keys()].sort((p, q) => r.ws[q] - r.ws[p]).slice(0, 2);
        return (
          <React.Fragment key={ri}>
            {r.ws.map((w, i) => (
              <Icon key={i} src={TURKEY.bronze} x={rowX(r.ws, i)} y={r.y} w={w} at={show[ri] + i} />
            ))}
            {big.map((i) => <Loop key={i} cx={rowX(r.ws, i) + r.ws[i] / 2} cy={r.y - r.ws[i] * 0.45} rx={r.ws[i] * 0.62} ry={r.ws[i] * 0.55} at={ring[ri]} seed={ri * 10 + i} />)}
            {ri < 2 && g >= show[ri + 1] - 4 && <Arrow x1={540} y1={r.y + 18} x2={540} y2={ROWS[ri + 1].y - ROWS[ri + 1].ws[0] * 0.9} bow={0} at={show[ri + 1] - 4} />}
          </React.Fragment>
        );
      })}
      <PTag text="Illustration" />
    </Mode>
  );
};

const beatsOf = (t: TL): TurkeyBeats => ({
  swapAt: t.at('white ones.'),
  w13At: t.at('thirteen pounds,'),
  grow: [t.at('Today,'), t.at('over thirty.') + 10],
  tipAt: t.at('top-heavy'),
});

/** The 1950s: the dark feathers wiped to white. */
const White: React.FC<{t: TL}> = ({t}) => (
  <Mode m="teal">
    <TSet b={beatsOf(t)}>
      <Highlight text="1950s" x={60} y={180} size={130} at={t.at('1950s,')} seed={34} rot={-3} />
      <Note text="dark feathers → white" x={70} y={380} size={70} rot={-3} at={t.at('swapped') - 2} color="#ffffff" />
    </TSet>
  </Mode>
);

/** The 1930s: about thirteen pounds, live (the dial and the counter land on 13). */
const Weight: React.FC<{t: TL}> = ({t}) => (
  <Mode m="teal">
    <TSet b={beatsOf(t)} dial>
      <Highlight text="1930s" x={560} y={180} size={120} at={t.at('1930s,')} seed={35} rot={-3} />
      <Note text="average, live" x={590} y={345} size={60} rot={-3} at={t.at('average') - 2} color="#ffffff" />
    </TSet>
  </Mode>
);

/** Today: over thirty. The counter runs 13 -> 30+, the body inflates over the same thin legs; a slow push. */
const Today: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const z = interpolate(g, [a, a + 120], [1.0, 1.06], clamp);
  return (
    <Mode m="teal">
      <TSet b={beatsOf(t)} dial cam={{x: 560, y: 960, z}}>
        <Highlight text="TODAY" x={600} y={180} size={120} at={t.at('Today,')} seed={36} rot={-3} />
        <Note text="same thin legs" x={60} y={1030} size={60} rot={-3} at={t.at('Today,') + 10} color="#ffffff" />
        <Arrow x1={400} y1={1040} x2={470} y2={1010} bow={-16} at={t.at('Today,') + 16} />
      </TSet>
    </Mode>
  );
};

/** Too top-heavy: the bird tips forward about its feet and holds; on "the shape is wrong" a loupe on the thin legs. */
const Tip: React.FC<{t: TL}> = ({t}) => {
  const b = beatsOf(t);
  const layer = <Bird b={b} />;
  return (
    <Mode m="teal">
      <TSet b={b}>
        <Highlight text="TOO TOP-HEAVY" x={60} y={180} size={104} at={t.at('top-heavy')} seed={37} rot={-3} />
        <Loupe layer={layer} cx={FEET[0] - 6} cy={FEET[1] - 70} r={150} zoom={2.2} to={[230, 640]} at={t.at('shape is wrong.')} bow={40} />
      </TSet>
    </Mode>
  );
};

/** Nearly every one of them now comes from artificial insemination: a flock of the same heavy white bird fills the frame. */
const Nearly: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <Mode m="teal">
    <DarkPaper />
    {Array.from({length: 20}, (_, i) => {
      const c = i % 5, r = Math.floor(i / 5);
      return (
        <Icon key={i} src={TURKEY.big} x={50 + c * 196 + (r % 2) * 20} y={520 + r * 190} w={176} at={a + 2 + Math.floor(i * 0.8)} />
      );
    })}
    <Slip text="artificial insemination" x={70} y={190} at={t.at('now comes')} size={84} rot={-2} />
    <PTag text="Illustration" />
  </Mode>
);

/** "Happy Thanksgiving.": the finished bird alone on the coral desk, nothing new on it, held. */
const Happy: React.FC = () => (
  <Mode m="coral">
    <TSet b={DONE} cam={DONE_CAM} />
  </Mode>
);

const Scenes: React.FC<{t: TL; len: number}> = ({t, len}) => {
  const at = t.at;
  const c = {
    cover: 0,
    gmo: Math.max(75, at("It isn't.") - 1), // the cover holds at least 2.5 s
    oldway: at('They did it') - 1,
    white: at('Then in the 1950s,') - 1,
    weight: at('In the 1930s,') - 1,
    today: at('Today,') - 1,
    tip: at('top-heavy') - 1,
    nearly: at('So nearly') - 1,
    happy: at('Happy Thanksgiving.') - 1,
  };
  return (
    <>
      {useScene([
        [c.cover, <Cover />],
        [c.gmo, <Gmo t={t} a={c.gmo} />],
        [c.oldway, <OldWay t={t} a={c.oldway} />],
        [c.white, <White t={t} />],
        [c.weight, <Weight t={t} />],
        [c.today, <Today t={t} a={c.today} />],
        [c.tip, <Tip t={t} />],
        [c.nearly, <Nearly t={t} a={c.nearly} />],
        [c.happy, <Happy />],
        // the end card's picture: the cover's, so the replay loops (EndText in the shell draws over it)
        [len, <Mode m="teal"><TSet b={DONE} cam={DONE_CAM} /></Mode>],
      ])}
    </>
  );
};

const DEF: ShortDef = {music: 'tg_turkey', Scenes, segs: SEGS2};
export const B2: Built = build(SEGS2);
export const VSHORT2_FRAMES = storyFrames(B2) + OUTRO;
export const VShort2: React.FC = () => <VShell d={DEF} b={B2} />;
