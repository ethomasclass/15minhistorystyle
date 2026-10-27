// Chapter 1 · The Last of the Five Thousand: the cold open on Russell's watercolor (the thumbnail image, on screen at frame 0),
// the boss in Helena, the letter, Charlie Russell, the hips and the wolves, the two titles, the chinook that never came, twenty
// years earlier, the question as bare handwriting, back to the steer, the hand-off to Texas; then ChannelIntro and the title card.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch01_last_of_the_5000.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Finish, JF, Loop, Note, PALETTES, PaletteCtx, StepCtx, useGFrame, usePal} from '../kit/Kit';
import {Sfx} from '../kit/common';
import {ChannelIntro, INTRO_FRAMES} from '../kit/ChunkIntro';
import {bed} from '../kit/levels';
import {makeTimeline, type Narration} from '../kit/shell';
import {Definition} from '../kit/shell';
import {Desk3D, keys, Lift, Mono, PhotoCam, ScrimTag, shake, Shots, SlapTitle, TornPrint, zkeys} from '../kit/west';
import {Hand, MPin, WestMap} from '../kit/ch01_extra';
import {LITHO, Pic, Prop} from '../kit/ch04_extra';
import {MProp, TPL} from '../kit/trails';
import {Bust, MCattle, MState} from '../kit/ch02_extra';
import {WShots} from '../kit/ch07_extra';
import {M1} from '../masks_ch01';
import type {MaskRef} from '../kit/maskref';
import {DATES, SUBTITLE, TITLE} from '../project';

const N = words as Narration;
const T = makeTimeline(N, 30);
const at = T.at;
/** Title card length (frames) after the channel intro. */
const TITLE_FRAMES = 150;
/** Narration ends; ~2 s of hold, then the channel intro. */
const END = Math.ceil(N.duration * 30) + 40;
export const CH01_FRAMES = END + INTRO_FRAMES + TITLE_FRAMES;

/**
 * THE PAINTING, in one place so it can be swapped. Every painting shot reads from P: its file, size, tag, steer mask, look, and the
 * steer / head / hip / wolves / sky as fractions of the picture (x, y in 0..1), so the cameras follow the composition.
 * Now: Russell's 1887 original (Montana Historical Society), enlarged from a small scan (user-approved). Its small caption lettering
 * under the title was guessed by the enlargement, so no shot zooms on the bottom strip (y > 0.88). The 1907 repainting is kept below.
 */
type Pt = [number, number];
type Painting = {src: string; size: [number, number]; tag: string; mask?: MaskRef; steer: Pt; head: Pt; hip: Pt; wolves: Pt[]; sky: Pt;
  /** B&W treatment, coral strength, how much the steer is lifted under its mask, the steer close-up (fraction of the width shown),
   *  the hip push (from, to) and loop radius (fraction of the width), and the wolf for the cut-in. */
  bw: string; tint: number; lift: number; steerFrac: number; hipFrac: [number, number]; hipR: number; heroWolf: number};
const REPAINT_1907: Painting = {
  src: 'img/ch01/b_chinook_painting.jpg', size: [4000, 2468], tag: 'C. M. Russell, Waiting for a Chinook (his 1907 version, on a postcard) · Internet Archive',
  mask: M1.steer, steer: [0.42, 0.5], head: [0.7, 0.62], hip: [0.118, 0.29], wolves: [[0.86, 0.668], [0.99, 0.656]], sky: [0.66, 0.36],
  bw: 'grayscale(1) sepia(0.12) contrast(1.15) brightness(0.98)', tint: 0.26, lift: 0.55, steerFrac: 0.8, hipFrac: [0.5, 0.33], hipR: 0.045, heroWolf: 0,
};
export const ORIGINAL_1887: Painting = {
  src: 'img/ch01/chinook_1887_restored.jpg', size: [4000, 2847],
  tag: 'C. M. Russell, Waiting for a Chinook, 1887, watercolor · Montana Historical Society · enhanced from a small scan',
  mask: M1.steer1887, steer: [0.46, 0.43], head: [0.62, 0.43], hip: [0.32, 0.37],
  // two far upper left, two right of the steer's head, one lower right trotting toward us
  wolves: [[0.075, 0.43], [0.145, 0.43], [0.74, 0.47], [0.835, 0.47], [0.79, 0.7]], sky: [0.5, 0.13],
  bw: 'grayscale(1) sepia(0.12) contrast(1.32) brightness(0.92)', tint: 0.34, lift: 0.18, steerFrac: 0.6, hipFrac: [0.42, 0.24], hipR: 0.034, heroWolf: 4,
};
const P: Painting = ORIGINAL_1887;
void REPAINT_1907;
const PAINT = P.src;
const PSZ = P.size;
const PTAG = P.tag;
/** A painting point (fractions) in source px. */
const px = (p: Pt): Pt => [p[0] * PSZ[0], p[1] * PSZ[1]];
/** The zoom that shows `frac` of the painting's width. */
const zw = (frac: number) => 1920 / (PSZ[0] * frac);
/** Camera key on the painting: [frame, point, fraction of the width shown]. */
const pk = (f: number, p: Pt, frac: number): [number, number, number, number] => [f, ...px(p), zw(frac)];
const MID: Pt = [0.5, 0.5];
/** The coral on the steer stays light: the trace carries the subject. */
const STEER_TINT = P.tint;
const RUSS = 'img/ch01/b_russell_c1900.jpg';
const RSZ: [number, number] = [1920, 2673];
const RTAG = 'Charles M. Russell, c. 1900, photographer unknown · Wikimedia Commons';
const COWTOWN = 'img/props/L2_cowtown.jpg';
const LSZ: [number, number] = [1920, 1080];
/** The painting in black and white, a little warm (the series' archive look). */
const PBW = P.bw;
const MAPTAG = 'Map: Natural Earth outlines (today\'s state lines for reference)';

/**
 * Lifts the steer's own levels under its mask (it is nearly black in B&W), so the light coral tint reads as see-through paint
 * on visible fur and ribs rather than a dark red silhouette. Drawn as a child of Pic (S maps source -> screen).
 */
const SteerLift: React.FC<{S: (x: number, y: number) => [number, number]; s: number; at: number}> = ({S, s, at: a}) => {
  const g = useGFrame();
  if (!P.mask || g < a) return null;
  const [l, t] = S(0, 0);
  const m = P.mask.alpha;
  return <div style={{position: 'absolute', left: l, top: t, width: PSZ[0] * s, height: PSZ[1] * s, background: '#8a8a8a', mixBlendMode: 'screen',
    opacity: P.lift * interpolate(g, [a, a + 5], [0, 1], clamp), WebkitMaskImage: `url(${staticFile(m)})`, WebkitMaskSize: '100% 100%', maskImage: `url(${staticFile(m)})`, maskSize: '100% 100%'} as React.CSSProperties} />;
};

/** The painting on the desk as a torn print. */
const PaintPrint: React.FC<{x: number; y: number; w: number; at: number; rot?: number; h?: number; blur?: number; seed?: number; tint?: number; traceAt?: number}> = ({x, y, w, at: a, rot = -2, h = 8, blur = 0, seed = 2, tint = 0, traceAt}) => (
  <Lift x={x} y={y} w={w} hgt={w * (PSZ[1] / PSZ[0])} h={h} at={a} rot={rot} blur={blur} seed={seed}>
    <TornPrint src={PAINT} size={PSZ} x={0} y={0} w={w} at={-99} seed={seed + 1} real grey shadow={5} filter={PBW} mask={P.mask} tint={tint} traceAt={traceAt}
      tapes={[{x: -40, y: 20, w: 160, rot: -36}, {x: w - 120, y: -8, w: 160, rot: 28}]} />
  </Lift>
);

// ---------------------------------------------------------------------------------------------------------------- the open

/** 1 · Frame 0: the watercolor full-bleed, already drifting in; the hook tape at once. */
const Open: React.FC = () => (
  <Pic src={PAINT} size={PSZ} k={[pk(0, MID, 0.96), pk(at('Montana') + 6, [P.steer[0] + 0.01, P.steer[1] - 0.02], 0.84)]} filter={PBW} tag={PTAG} tagY={1026}>
    {() => <>
      <SlapTitle text="A MESSAGE TO THE BOSS" x={820} y={70} size={72} at={12} seed={14} />
      <Note text="his cattle were dead" x={1220} y={210} size={54} rot={-3} at={at('dead') - 2} />
    </>}
  </Pic>
);

/** 2 · Montana on the series map, the winter. */
const Montana: React.FC = () => {
  const a = at('Montana') - 1;
  const ks = [{f: a, x: 2100, y: 1100, z: 0.36, tilt: 34, rot: 2}, {f: at('A businessman') + 4, x: 1750, y: 800, z: 0.46, tilt: 40, rot: 0}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MState api={api} name="Montana" at={a + 4} color="#2FE0C4" />
        </>}
      </WestMap>
      <SlapTitle text="MONTANA, WINTER 1886" x={110} y={80} size={88} at={at('winter') + 2} seed={16} />
      <ScrimTag text={MAPTAG} />
    </AbsoluteFill>
  );
};

/** 3 · Cut-in: Helena, the boss's five thousand cattle out on the plains. */
const Helena: React.FC = () => {
  const a = at('A businessman') - 1;
  const ks = [{f: a, x: 1700, y: 640, z: 0.78, tilt: 46, rot: -3}, {f: at('He wrote') + 4, x: 1640, y: 600, z: 0.92, tilt: 50, rot: 1}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MState api={api} name="Montana" at={-99} color="#2FE0C4" k={0.7} />
          <MPin api={api} at={TPL.helena} show={at('Helena') - 2} label="Helena" sub="MONTANA TERR." size={56} side="l" />
          <MCattle api={api} at={at('thousand cattle') - 4} center={[TPL.helena[0] + 230, TPL.helena[1] + 120]} n={9} spread={190} w={64} seed="hel" />
        </>}
      </WestMap>
      <Note text="a businessman in Helena" x={120} y={120} size={56} rot={-3} at={a + 6} />
      <Hand parts={[['≈ 5,000 ', '#ffffff'], ['cattle on the open plains']]} x={150} y={880} size={62} at={at('five thousand') - 2} />
      <ScrimTag text={MAPTAG} x={34} y={24} />
    </AbsoluteFill>
  );
};

/** 4 · The letter slides onto the desk: "How had the herd come through?" */
const Letter: React.FC<{noWords?: boolean}> = ({noWords}) => {
  const f = useCurrentFrame();
  const a = noWords ? at('The foreman') - 1 : at('He wrote') - 1;
  const b = noWords ? at('So the way') - 1 : at('The foreman') - 1;
  const dx = noWords ? 0 : keys(f, [[a, 260], [a + 10, 0]]);
  return (
    <AbsoluteFill>
      <Desk3D tilt={noWords ? keys(f, [[a, 10], [b, 16]]) : keys(f, [[a, 24], [b, 18]])} z={noWords ? zkeys(f, [[a, 1.18], [b, 1.3]]) : zkeys(f, [[a, 0.94], [b, 1.0]])} lamp={[820, 560]}><div /></Desk3D>
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${dx}px)`}}>
        <Prop src="img/props/p1_letter.jpg" m={M1.letter} x={noWords ? 470 : 560} y={noWords ? 230 : 300} w={noWords ? 560 : 460} at={noWords ? -99 : a + 2} rot={-6} />
      </div>
      {!noWords && <>
        <Note text="to the foreman" x={1150} y={300} size={54} rot={-3} at={at('foreman') - 2} />
        <Hand parts={[['how had the herd '], ['come through?', '#ffffff']]} x={200} y={860} size={72} at={at('How had') - 2} dur={14} />
      </>}
      {noWords && <Hand parts={[['no words for it', '#ffffff']]} x={1130} y={480} size={76} at={at('words') - 6} />}
    </AbsoluteFill>
  );
};

/** 5 · "So, the way the story is usually told": the painting slaps onto the desk beside the letter. */
const StoryDesk: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('So the way') - 1;
  const b = at('a young cowhand') - 1;
  const sh = shake(f, [a + 6], 8);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={keys(f, [[a, 26], [b, 20]])} rotZ={keys(f, [[a, -3], [b, -1]])} z={zkeys(f, [[a, 0.9], [b, 0.95]])}>
        <PaintPrint x={620} y={170} w={1000} at={a + 3} rot={-2} />
      </Desk3D>
      <Prop src="img/props/p1_letter.jpg" m={M1.letter} x={90} y={560} w={330} at={-99} rot={-12} />
      <Note text="the way the story's usually told" x={760} y={900} size={52} rot={-2} at={at('usually') - 2} color="#ffffff" />
    </AbsoluteFill>
  );
};

/** 6 · "a young cowhand named Charlie Russell painted this instead. And the foreman sent it." */
const Russell: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('a young cowhand') - 1;
  const b = at('Look at it') - 1;
  const sh = shake(f, [a + 6], 8);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={keys(f, [[a, 16], [b, 22]])} z={zkeys(f, [[a, 1.0], [b, 0.92]])} x={keys(f, [[a, 40], [b, -20]])} lamp={[640, 520]}>
        <PaintPrint x={1130} y={260} w={820} at={-99} rot={3} h={4} blur={1.5} seed={4} />
      </Desk3D>
      <Bust src={RUSS} size={RSZ} m={M1.russell} x={200} y={165} w={540} at={a + 3} tint={0.4} tintAt={at('Charlie')} traceAt={at('Charlie') + 2} rot={-2} />
      <Mono text="CHARLIE RUSSELL · PHOTOGRAPHED C. 1900" x={250} y={60} size={30} at={at('Charlie') - 1} color="#FF6F61" />
      <Note text="(in 1886 he was 22)" x={130} y={930} size={46} rot={-2} at={at('young cowhand') + 2} color="#ffffff" />
      <Note text="painted this instead" x={1120} y={170} size={58} rot={-3} at={at('painted') - 2} />
      <Arrow x1={1360} y1={260} x2={1450} y2={400} bow={-30} at={at('painted') + 4} />
      <Note text="and the foreman sent it" x={1120} y={850} size={54} rot={-3} at={at('sent it') - 2} color="#ffffff" />
      <ScrimTag text={`${RTAG} (photo taken years later)`} x={34} y={1026} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------- the painting

/** 7 · "Look at it. One steer, alone in the snow." The steer in coral. */
const LookSteer: React.FC = () => {
  const a = at('Look at it') - 1;
  const b = at('Look at the hip') - 1;
  return (
    <Pic src={PAINT} size={PSZ} k={[pk(a, MID, 0.96), pk(b, P.steer, P.steerFrac)]} filter={PBW} tag={PTAG} tagY={1026} mask={P.mask} tintAt={at('One steer')} tint={STEER_TINT} traceAt={at('One steer') + 2}>
    {(S, sc) => <><SteerLift S={S} s={sc} at={at('One steer')} /><Note text="one steer, alone" x={1240} y={180} size={60} rot={-3} at={at('alone') - 2} /></>}
    </Pic>
  );
};

/** 8 · Deep push to the hips; teal loops. */
const Hips: React.FC = () => {
  const a = at('Look at the hip') - 1;
  const b = at('Now look behind') - 1;
  return (
    <Pic src={PAINT} size={PSZ} k={[pk(a, [P.hip[0] + 0.1, P.hip[1] + 0.06], P.hipFrac[0]), pk(b, P.hip, P.hipFrac[1])]} filter={PBW} mask={P.mask} tintAt={-99} tint={STEER_TINT * 0.8}>
      {(S, sc) => {
        const [hx, hy] = S(...px(P.hip));
        const r = PSZ[0] * sc * P.hipR;
        return <>
          <SteerLift S={S} s={sc} at={-99} />
          <Loop cx={hx} cy={hy} rx={r} ry={r * 0.73} at={at('hip bones') - 2} seed={7} tilt={-8} width={7} />
          <Note text="the hip bones" x={Math.min(1400, hx + 300)} y={Math.max(120, hy - 280)} size={58} rot={-3} at={at('bones') - 2} />
        </>;
      }}
    </Pic>
  );
};

/** Where the wolves are, together: the camera ends framing all of them (works for one coyote or a ring of wolves). */
const WOLF_X = P.wolves.map((p) => p[0]);
const WOLF_Y = P.wolves.map((p) => p[1]);
const WOLF_C: Pt = [(Math.min(...WOLF_X) + Math.max(...WOLF_X)) / 2, (Math.min(...WOLF_Y) + Math.max(...WOLF_Y)) / 2];
const WOLF_FRAC = Math.min(0.96, Math.max(0.5, Math.max(...WOLF_X) - Math.min(...WOLF_X) + 0.28, (Math.max(...WOLF_Y) - Math.min(...WOLF_Y) + 0.25) * (PSZ[1] / PSZ[0]) * (16 / 9)));

/** 9 · "Now look behind him. Those are wolves. They're waiting." Pan to the wolves; the beat lands on "wolves". */
const Wolves: React.FC = () => {
  const a = at('Now look behind') - 1;
  const w = at('wolves');
  const b = at('Russell called') - 1;
  return (
    <Pic src={PAINT} size={PSZ} k={[pk(a, P.head, 0.6), pk(w - 4, WOLF_C, WOLF_FRAC), pk(at('waiting') - 4, WOLF_C, WOLF_FRAC * 0.97), pk(b, P.wolves[P.heroWolf], 0.4)]} filter={PBW} tag={PTAG} tagY={1026}>
      {(S, sc) => <>
        {P.wolves.map((p, i) => {
          const [x, y] = S(...px(p));
          const r = PSZ[0] * sc * 0.05;
          // a loop is only drawn while it sits wholly inside the frame (x 60…1860); it fades out as the push carries it to the edge
          const margin = Math.min(x - r * 1.1 - 60, 1860 - x - r * 1.1, y - r * 0.85 - 60, 1020 - y - r * 0.85);
          const op = Math.max(0, Math.min(1, 1 + margin / 30));
          return op > 0 ? <div key={i} style={{position: 'absolute', inset: 0, opacity: op}}>
            <Loop cx={x} cy={y} rx={r} ry={r * 0.75} at={w - 2 + i * 3} seed={11 + i} tilt={i % 2 ? 6 : -6} width={7} />
          </div> : null;
        })}
        <Note text="wolves" x={820} y={90} size={78} rot={-4} at={w} />
        <Note text="waiting" x={140} y={860} size={66} rot={-3} at={at('waiting') - 2} color="#ffffff" />
      </>}
    </Pic>
  );
};

/** 10 · "Russell called it Waiting for a Chinook": the print on the desk, the title tape. */
const ChinookTitle: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Russell called') - 1;
  const b = at('A chinook is') - 1;
  const sh = shake(f, [at('Waiting for') + 3], 8);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={keys(f, [[a, 14], [b, 22]])} z={zkeys(f, [[a, 1.08], [b, 0.96]])} rotZ={keys(f, [[a, 2], [b, -1]])}>
        <PaintPrint x={420} y={160} w={1180} at={-99} rot={-1} />
      </Desk3D>
      <SlapTitle text="WAITING FOR A CHINOOK" x={140} y={820} size={92} at={at('Waiting for')} seed={18} />
      <ScrimTag text={PTAG} x={34} y={24} />
    </AbsoluteFill>
  );
};

/** 11 · The chinook: a warm wind drawn across the sky that never arrives; definition; "It never came." */
const Chinook: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const a = at('A chinook is') - 1;
  const b = at('The picture has') - 1;
  const never = at('never came');
  // the wind arrows blow in from the left, then stall and fade before reaching the steer
  const fade = interpolate(g, [never - 2, never + 10], [1, 0.15], clamp);
  return (
    <AbsoluteFill>
      <Pic src={PAINT} size={PSZ} k={[pk(a, P.sky, 0.7), pk(b, [P.sky[0] - 0.03, P.sky[1] + 0.04], 0.76)]} filter={PBW} />
      <div style={{position: 'absolute', inset: 0, opacity: fade}}>
        {[0, 1, 2].map((i) => (
          <Arrow key={i} x1={560 + i * 40} y1={130 + i * 90} x2={1180 + i * 60} y2={110 + i * 95} bow={-40 + i * 20} at={at('warm wind') - 4 + i * 3} dur={14} width={6} />
        ))}
      </div>
      <Definition term="chinook" def="a warm, dry wind that blows down off the Rockies in winter and can melt the snow in hours" at={at('warm') + 2} x={120} y={760} w={1500} />
      <Hand parts={[['it never came.', '#ffffff']]} x={1240} y={420} size={86} at={never - 2} />
      <ScrimTag text={PTAG} x={34} y={24} />
    </AbsoluteFill>
  );
};

/** 12 · "The Last of the Five Thousand": the whole painting, pulling out, the second title. */
const LastOf: React.FC = () => {
  const a = at('The picture has') - 1;
  const b = at('Twenty years') - 1;
  return (
    <Pic src={PAINT} size={PSZ} k={[pk(a, [0.5, 0.46], 0.84), pk(b, [0.5, 0.53], 0.96)]} filter={PBW} tag={PTAG} tagY={24} mask={P.mask} tintAt={a} tint={STEER_TINT} traceAt={a + 4}>
      {(S, sc) => <>
        <SteerLift S={S} s={sc} at={a} />
        <Note text="its other name" x={1300} y={150} size={56} rot={-3} at={at('another name') - 2} />
        <SlapTitle text="THE LAST OF THE FIVE THOUSAND" x={170} y={920} size={70} at={at('Last')} seed={19} />
      </>}
    </Pic>
  );
};

// ---------------------------------------------------------------------------------------------------------------- the question

/** 13 · "Twenty years earlier": a glimpse of plenty (the cowtown plate). */
const Plenty: React.FC = () => {
  const a = at('Twenty years') - 1;
  const b = at('Anyone with') - 1;
  return (
    <Pic src={COWTOWN} size={LSZ} k={[[a, 900, 560, 1.12], [b, 1100, 580, 1.2]]} filter={LITHO}>
      {() => <>
        <Mono text="TWENTY YEARS EARLIER" x={110} y={90} size={30} at={a + 4} />
        <Hand parts={[['cattle: a sure way to get '], ['rich', '#ffffff']]} x={120} y={170} size={70} at={at('surest') - 2} dur={14} />
      </>}
    </Pic>
  );
};

/** 14 · "Anyone with a horse and some nerve could try": the longhorn (coral) and the saddle on the desk. */
const Nerve: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Anyone with') - 1;
  const b = at("here's the question") - 1;
  const sh = shake(f, [a + 6, at('horse') + 4], 7);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={keys(f, [[a, 20], [b, 12]])} z={zkeys(f, [[a, 0.96], [b, 1.04]])} lamp={[900, 560]}><div /></Desk3D>
      <Prop src="img/props/p2_longhorn.jpg" m={M1.longhorn} x={260} y={300} w={820} at={a + 3} tint={0.55} traceAt={a + 8} />
      <Prop src="img/props/p3_saddle.jpg" m={M1.saddle} x={1180} y={380} w={360} at={at('horse') + 1} rot={4} />
      <Hand parts={[['anyone with a horse'], [' + some nerve', '#ffffff']]} x={260} y={120} size={72} at={at('Anyone with') - 2} dur={16} />
    </AbsoluteFill>
  );
};

/** 15 · "So here's the question. How did it go from that, to this?" Both pictures on the desk; THE QUESTION. */
const Question: React.FC = () => {
  const f = useCurrentFrame();
  const a = at("here's the question") - 1;
  const b = at('And who actually') - 1;
  const sh = shake(f, [at('question') + 3], 8);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={keys(f, [[a, 28], [b, 20]])} z={zkeys(f, [[a, 0.84], [b, 0.9]])} rotZ={keys(f, [[a, -2], [b, 1]])}>
        <Lift x={140} y={330} w={760} hgt={427} h={6} at={-99} rot={-4} seed={21}>
          <TornPrint src={COWTOWN} size={LSZ} x={0} y={0} w={760} crop={[30, 30, 1890, 1050]} at={-99} seed={22} real grey shadow={5} filter={LITHO} />
        </Lift>
        <Lift x={1080} y={300} w={780} hgt={481} h={10} at={-99} rot={3} seed={23}>
          <TornPrint src={PAINT} size={PSZ} x={0} y={0} w={780} at={-99} seed={24} real grey shadow={5} filter={PBW} />
        </Lift>
      </Desk3D>
      <SlapTitle text="THE QUESTION" x={600} y={90} size={110} at={at('question')} seed={25} />
      <Hand parts={[['that,']]} x={300} y={830} size={84} at={at('from that') - 2} />
      <Arrow x1={560} y1={880} x2={1180} y2={880} bow={-50} at={at('to this') - 2} dur={8} />
      <Hand parts={[['to this?', '#ffffff']]} x={1260} y={830} size={84} at={at('to this', 1) - 2} />
    </AbsoluteFill>
  );
};

/** 16-17 · The question as bare handwriting ("rich" in coral), then its answer line. */
const QuestionDesk: React.FC<{second?: boolean}> = ({second}) => {
  const f = useCurrentFrame();
  const a = at('And who actually') - 1;
  const b = at('The answer') - 1;
  const c = at("And we'll") - 1;
  return (
    <AbsoluteFill>
      <Desk3D tilt={second ? keys(f, [[b, 8], [c, 14]]) : keys(f, [[a, 12], [b, 7]])} z={second ? zkeys(f, [[b, 1.0], [c, 0.93]]) : zkeys(f, [[a, 1.0], [b, 1.06]])} lamp={[900, 440]}><div /></Desk3D>
      <Hand parts={[['who actually got '], ['rich?', '#FF6F61']]} x={240} y={second ? 170 : 360} size={second ? 80 : 108} at={second ? -99 : at('who actually') - 2} dur={12} />
      {!second && <Loop cx={1220} cy={430} rx={210} ry={95} at={at('got rich') + 4} seed={31} tilt={-5} width={6} color="#FF6F61" />}
      {second && <>
        <Hand parts={[['the answer: ', '#ffffff'], ['who owned the grass']]} x={260} y={450} size={84} at={at('who owned') - 2} dur={16} />
        <Loop cx={1030} cy={520} rx={330} ry={90} at={at('grass') + 4} seed={33} tilt={-3} width={6} />
      </>}
    </AbsoluteFill>
  );
};

/** 18 · "And we'll come back to this steer." The painting again, held still, the steer coral. */
const BackToSteer: React.FC = () => {
  const a = at("And we'll") - 1;
  return (
    <Pic src={PAINT} size={PSZ} k={[pk(a, P.steer, P.steerFrac), pk(a + 60, [P.steer[0] - 0.002, P.steer[1]], P.steerFrac * 0.99)]} filter={PBW} tag={PTAG} tagY={24} mask={P.mask} tintAt={a} tint={STEER_TINT} traceAt={a + 3}>
      {(S, sc) => <><SteerLift S={S} s={sc} at={a} /><Note text="we'll come back to him" x={1180} y={860} size={58} rot={-3} at={at('come back') - 2} /></>}
    </Pic>
  );
};

/** 19 · Hand-off: "It starts in Texas, with too many cows and no money at all." */
const Texas: React.FC = () => {
  const a = at('It starts') - 1;
  const ks = [{f: a, x: 2300, y: 1700, z: 0.38, tilt: 34, rot: 3}, {f: END, x: 2600, y: 2080, z: 0.56, tilt: 46, rot: -1}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MState api={api} name="Texas" at={at('Texas') - 2} />
          <MCattle api={api} at={at('too many') - 2} center={[2640, 2180]} n={16} spread={300} w={60} seed="tx" per={1} />
          <MProp api={api} at={[2480, 2330]} name="p2_coin_one" w={70} show={at('no money') + 4} />
        </>}
      </WestMap>
      <SlapTitle text="TEXAS" x={120} y={90} size={110} at={at('Texas') + 1} seed={27} />
      <Hand parts={[['too many cows']]} x={150} y={260} size={70} at={at('too many') - 2} />
      <Hand parts={[['no money at all', '#ffffff']]} x={190} y={370} size={70} at={at('no money') - 2} />
      <ScrimTag text={MAPTAG} />
    </AbsoluteFill>
  );
};

/** Title card after the channel intro: the painting dimmed, the title on orange, the subtitle in teal. */
const Title: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill style={{background: '#0b0a08'}}>
      <PhotoCam src={PAINT} size={PSZ} cx={PSZ[0] / 2} cy={PSZ[1] / 2} s={zkeys(f, [[0, zw(0.96)], [TITLE_FRAMES, zw(0.9)]])} bw="grayscale(1) sepia(0.12) contrast(1.15) brightness(0.4)" vignette={0.8} />
      <SlapTitle text={TITLE} x={300} y={360} size={130} at={4} seed={61} />
      {g >= 14 && <div style={{position: 'absolute', left: 340, top: 590, fontFamily: JF.display, fontSize: 56, color: pal.mark, whiteSpace: 'nowrap', textShadow: '0 3px 16px rgba(0,0,0,0.9)',
        opacity: interpolate(g, [14, 20], [0, 1], clamp)}}>{SUBTITLE}</div>}
      <Note text={DATES} x={1300} y={720} size={56} rot={-5} at={24} />
      <ScrimTag text={PTAG} />
    </AbsoluteFill>
  );
};

/** Gentle sound effects under the narration. */
const Sounds: React.FC = () => {
  const c = (w: string) => at(w) - 1;
  const W = (w: string) => at(w) - 4;
  const sfx: [number, string, number][] = [
    [12, 'stamp', 0.22], [W('dead'), 'marker_tick', 0.2],
    [c('Montana') - 4, 'whip_soft', 0.22], [at('winter') + 2, 'stamp', 0.2],
    [c('A businessman'), 'whoosh', 0.2], [W('A businessman') + 6, 'marker_tick', 0.2], [at('Helena') - 2, 'block_tap_soft', 0.15], [W('five thousand'), 'marker_tick', 0.2],
    [c('He wrote'), 'whoosh', 0.2], [c('He wrote') + 2, 'card_slide_soft', 0.22], [W('foreman'), 'marker_tick', 0.2], [W('How had'), 'marker_tick', 0.2],
    [c('The foreman'), 'whoosh', 0.18], [at('words') - 8, 'marker_tick', 0.2],
    [c('So the way'), 'whoosh', 0.2], [c('So the way') + 4, 'paper_slap_soft', 0.25], [c('So the way') + 7, 'tape_press', 0.18], [W('usually'), 'marker_tick', 0.2],
    [c('a young cowhand'), 'whoosh', 0.2], [c('a young cowhand') + 4, 'paper_slap_soft', 0.25], [W('painted'), 'marker_tick', 0.2], [W('sent it'), 'marker_tick', 0.2],
    [c('Look at it') - 4, 'whip_soft', 0.2], [W('alone'), 'marker_tick', 0.2],
    [c('Look at the hip'), 'whoosh', 0.2], [W('hip bones'), 'marker_tick', 0.2],
    [c('Now look behind'), 'whoosh', 0.2], [at('wolves') - 4, 'marker_tick', 0.22], [W('waiting'), 'marker_tick', 0.2],
    [c('Russell called'), 'whoosh', 0.2], [at('Waiting for'), 'stamp', 0.22],
    [c('A chinook is'), 'whoosh', 0.2], [W('never came'), 'marker_tick', 0.2],
    [c('The picture has'), 'whoosh', 0.2], [W('another name'), 'marker_tick', 0.2], [at('Last'), 'stamp', 0.22],
    [c('Twenty years') - 4, 'whip_soft', 0.22], [W('surest'), 'marker_tick', 0.2],
    [c('Anyone with'), 'whoosh', 0.2], [c('Anyone with') + 4, 'paper_slap_soft', 0.25], [at('horse') + 2, 'paper_slap_soft', 0.2], [W('Anyone with'), 'marker_tick', 0.2],
    [c("here's the question"), 'whoosh', 0.2], [at('question'), 'stamp', 0.22], [W('from that'), 'marker_tick', 0.2], [W('to this'), 'marker_tick', 0.2],
    [c('And who actually'), 'whoosh', 0.2], [W('who actually'), 'marker_tick', 0.2],
    [c('The answer'), 'whoosh', 0.18], [W('who owned'), 'marker_tick', 0.2],
    [c("And we'll") - 4, 'whip_soft', 0.2], [W('come back'), 'marker_tick', 0.2],
    [c('It starts') - 4, 'whip_soft', 0.22], [at('Texas') + 1, 'stamp', 0.2], [W('too many'), 'marker_tick', 0.2], [W('no money'), 'marker_tick', 0.2],
  ];
  return <>{sfx.map(([fr, n, v], i) => <Sfx key={i} at={fr} src={`sfx/${n}.wav`} volume={v} />)}</>;
};

const COLD = bed('aw_white_cold');
const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const shots: [number, React.ReactNode, ('whip' | 'cut')?][] = [
    [0, <Open />],
    [at('Montana') - 1, <Montana />, 'whip'],
    [at('A businessman') - 1, <Helena />, 'cut'],
    [at('He wrote') - 1, <Letter />, 'cut'],
    [at('The foreman') - 1, <Letter noWords />, 'cut'],
    [at('So the way') - 1, <StoryDesk />, 'cut'],
    [at('a young cowhand') - 1, <Russell />, 'cut'],
    [at('Look at it') - 1, <LookSteer />, 'whip'],
    [at('Look at the hip') - 1, <Hips />, 'cut'],
    [at('Now look behind') - 1, <Wolves />, 'cut'],
    [at('Russell called') - 1, <ChinookTitle />, 'cut'],
    [at('A chinook is') - 1, <Chinook />, 'cut'],
    [at('The picture has') - 1, <LastOf />, 'cut'],
    [at('Twenty years') - 1, <Plenty />, 'whip'],
    [at('Anyone with') - 1, <Nerve />, 'cut'],
    [at("here's the question") - 1, <Question />, 'cut'],
    [at('And who actually') - 1, <QuestionDesk />, 'cut'],
    [at('The answer') - 1, <QuestionDesk second />, 'cut'],
    [at("And we'll") - 1, <BackToSteer />, 'whip'],
    [at('It starts') - 1, <Texas />, 'whip'],
  ];
  let scene: React.ReactNode = <WShots shots={shots} />;
  if (frame >= END + INTRO_FRAMES) scene = <Sequence from={END + INTRO_FRAMES} layout="none"><Title /></Sequence>;
  else if (frame >= END) scene = <Sequence from={END} layout="none"><ChannelIntro /></Sequence>;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {frame < END && <Finish vignette={0.3} />}
      {frame >= END + INTRO_FRAMES && <Finish vignette={0.3} />}
      <Audio src={staticFile('audio/ch01_last_of_the_5000.wav')} />
      {/* cold-open bed: aw_white_cold, dipping out under the hand-off into the channel intro (clicks only) */}
      <Audio src={staticFile('music/aw_white_cold.mp3')} volume={(fr) => interpolate(fr, [0, 15, at('It starts'), END - 10, END + 6], [0, COLD, COLD, COLD * 0.6, 0], clamp)} />
      {/* the title card is not silent: the cold-open cue comes back under it, picking up where it left off, then fades with the card */}
      <Sequence from={END + INTRO_FRAMES} layout="none">
        <Audio src={staticFile('music/aw_white_cold.mp3')} startFrom={END + INTRO_FRAMES} volume={(fr) => interpolate(fr, [0, 12, TITLE_FRAMES - 30, TITLE_FRAMES], [0, COLD * 1.2, COLD * 1.2, 0], clamp)} />
      </Sequence>
      {frame < END && <Sounds />}
      <Sfx at={END + INTRO_FRAMES + 4} src="sfx/stamp.wav" volume={0.3} />
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
