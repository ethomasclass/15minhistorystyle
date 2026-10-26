// The collage board in motion. Every piece has a way of arriving:
//   drop   a photo or scrap falls flat onto the board (big hard shadow shrinking to the flat 5 px one)
//   slap   a sticky note smacks down with a little overshoot
//   stamp  a rubber stamp thunks in from 1.8x, and the camera jolts
//   tape   a strip of tape wipes on
//   slide  a label strip is revealed left to right, stepped like the handwriting
//   fade   the worn logo sticker settles in last
// Pins pop in with a knock, thread draws pin to pin (stepped at 12 fps), the highlighter runs along the 13th Amendment's
// loophole, and the camera moves piece to piece before pulling back to the whole board.
//   Collage-Anim   Episode 1's board built from nothing (the end-of-episode recap)
//   Collage-Night  the close-up: one night, three men (Episode 1, chapter 4)
import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../kit/common';
import {Tag, useGFrame} from '../kit/Kit';
import {TestFrame} from './common';
import {BRAND, Ctx, Defs, Herald, Photo, Scrap, Silhouette, Splats, Stamp, Sticky, Strip, SANS, TapeBit, WornLogo} from './CollageMocks';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const p = BRAND;

type Kind = 'drop' | 'slap' | 'stamp' | 'tape' | 'slide' | 'fade';

/** One piece arriving at frame `at`. */
export const Land: React.FC<{at: number; kind: Kind; x: number; y: number; r?: number; z?: number; children: React.ReactNode}> = ({at, kind, x, y, r = 0, z, children}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const {fps} = useVideoConfig();
  if (f < at) return null;
  const t = f - at;
  let tf = '';
  let shadow = 1;
  let opacity = 1;
  let clip: string | undefined;
  if (kind === 'drop') {
    const k = spring({frame: t, fps, config: {damping: 15, stiffness: 170, mass: 0.9}});
    tf = `translateY(${-46 * (1 - k)}px) rotate(${r + 7 * (1 - k)}deg) scale(${1 + 0.2 * (1 - k)})`;
    shadow = 1 + 4.5 * (1 - k);
    opacity = Math.min(1, k * 4);
  } else if (kind === 'slap') {
    const k = spring({frame: t, fps, config: {damping: 12, stiffness: 420, mass: 0.7}});
    tf = `rotate(${r - 12 * (1 - k)}deg) scale(${1 + 0.35 * (1 - k)})`;
    shadow = 1 + 2 * (1 - k);
    opacity = Math.min(1, k * 5);
  } else if (kind === 'stamp') {
    const s = interpolate(t, [0, 3, 6], [1.8, 0.95, 1], clamp);
    tf = `rotate(${r}deg) scale(${s})`;
    opacity = interpolate(t, [0, 2], [0, 1], clamp);
    shadow = 0;
  } else if (kind === 'tape') {
    tf = `rotate(${r}deg)`;
    clip = `inset(-10% ${interpolate(t, [0, 5], [100, 0], clamp)}% -10% 0)`;
  } else if (kind === 'slide') {
    tf = `rotate(${r}deg)`;
    clip = `inset(-20% ${interpolate(g - at, [0, 9], [100, 0], clamp)}% -20% 0)`;
  } else {
    const k = interpolate(t, [0, 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
    tf = `rotate(${r}deg) scale(${1.06 - 0.06 * k})`;
    opacity = k;
    shadow = 0;
  }
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: tf, transformOrigin: '50% 50%', zIndex: z, opacity,
      filter: shadow ? `drop-shadow(${5 * shadow}px ${6 * shadow}px 0 rgba(0,0,0,${0.55 - 0.08 * (shadow - 1)}))` : undefined}}>
      <div style={{clipPath: clip}}>{children}</div>
    </div>
  );
};

/** A pushpin that pops in. */
export const APin: React.FC<{at: number; x: number; y: number}> = ({at, x, y}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at) return null;
  const k = spring({frame: f - at, fps, config: {damping: 9, stiffness: 300}});
  return (
    <div style={{position: 'absolute', left: x - 10, top: y - 10, width: 20, height: 20, borderRadius: 10, background: p.accent, zIndex: 50,
      boxShadow: '2px 3px 0 rgba(0,0,0,0.5)', transform: `scale(${0.3 + 0.7 * k})`}}>
      <div style={{position: 'absolute', left: 5, top: 4, width: 6, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.6)'}} />
    </div>
  );
};

const THREAD_DUR = 14;
/** Teal thread drawn from one pin to another, stepped. */
const AThreads: React.FC<{lines: {a: [number, number]; b: [number, number]; at: number}[]}> = ({lines}) => {
  const g = useGFrame();
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, zIndex: 40, overflow: 'visible'}}>
      {lines.map(({a, b, at}, i) => {
        const q = interpolate(g, [at, at + THREAD_DUR], [0, 1], clamp);
        if (q <= 0) return null;
        return <line key={i} x1={a[0]} y1={a[1]} x2={a[0] + (b[0] - a[0]) * q} y2={a[1] + (b[1] - a[1]) * q} stroke={p.thread} strokeWidth={2.6} />;
      })}
    </svg>
  );
};

type Key = [number, number, number, number]; // frame, centre x, centre y, zoom
const camAt = (keys: Key[], f: number) => {
  let i = keys.length - 2;
  for (let k = 0; k < keys.length - 1; k++) if (f < keys[k + 1][0]) { i = k; break; }
  const [f0, x0, y0, z0] = keys[i];
  const [f1, x1, y1, z1] = keys[i + 1];
  const t = Easing.inOut(Easing.cubic)(Math.min(1, Math.max(0, (f - f0) / (f1 - f0))));
  return {x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t, z: Math.exp(Math.log(z0) + (Math.log(z1) - Math.log(z0)) * t)};
};
/** A short jolt after each stamp. */
const shakeAt = (stamps: number[], f: number) => {
  let x = 0, y = 0;
  stamps.forEach((s, i) => {
    const t = f - s - 2;
    if (t < 0 || t > 10) return;
    const a = 7 * Math.exp(-t / 3) * Math.cos(t * 2.2);
    x += a * (random(`sx${i}`) - 0.5) * 2;
    y += a * (0.6 + random(`sy${i}`) * 0.4);
  });
  return {x, y};
};

/** The board, camera and sound shared by both clips. */
const Stage: React.FC<{cam: Key[]; stamps: number[]; moves: number[]; caption: string; children: React.ReactNode; splats: string}> = ({cam, stamps, moves, caption, children, splats}) => {
  const f = useCurrentFrame();
  const c = camAt(cam, f);
  const s = shakeAt(stamps, f);
  return (
    <TestFrame vignette={0.35}>
      <Ctx.Provider value={BRAND}>
        <AbsoluteFill style={{background: p.bg}}>
          <Defs />
          <AbsoluteFill style={{transform: `translate(${960 - c.x * c.z + s.x}px, ${540 - c.y * c.z + s.y}px) scale(${c.z})`, transformOrigin: '0 0'}}>
            <div style={{position: 'absolute', left: -800, top: -600, width: 3520, height: 2280, background: p.bg}} />
            <Splats seed={splats} />
            {children}
          </AbsoluteFill>
          {moves.map((m) => <Sfx key={`m${m}`} at={m} src="sfx/whoosh.wav" volume={0.12} />)}
          {stamps.map((m) => <Sfx key={`s${m}`} at={m} src="sfx/stamp.wav" volume={0.45} />)}
          <Tag text={caption} />
        </AbsoluteFill>
      </Ctx.Provider>
    </TestFrame>
  );
};

/** Sound for a list of arrivals. */
const Sounds: React.FC<{drops?: number[]; slaps?: number[]; pins?: number[]; slides?: number[]; threads?: number[]}> = ({drops = [], slaps = [], pins = [], slides = [], threads = []}) => (
  <>
    {drops.map((a) => <Sfx key={`d${a}`} at={a} src="sfx/page_turn.wav" volume={0.22} />)}
    {slaps.map((a) => <Sfx key={`l${a}`} at={a} src="sfx/page_turn.wav" volume={0.3} />)}
    {pins.map((a) => <Sfx key={`p${a}`} at={a} src="sfx/knock.wav" volume={0.32} />)}
    {slides.map((a) => <Sfx key={`t${a}`} at={a} src="sfx/tick_soft.wav" volume={0.18} />)}
    {threads.map((a) => <Sfx key={`h${a}`} at={a} src="sfx/marker_tick.wav" volume={0.2} />)}
  </>
);

// ------------------------------------------------------------------- Episode 1's board, built ------------------------------
// Pins, as in the still (Collage-2).
const PIN = {who: [960, 470], lincoln: [560, 230], johnson: [1290, 225], congress: [1330, 640], petition: [420, 610], except: [1560, 470], forty: [190, 245], herald: [820, 760]} as const;
type PinId = keyof typeof PIN;
const at = {
  forty: 8, fortyTape: 20, fortyStrip: 28, fortyPin: 40, whoseLand: 54,
  petition: 84, petitionStrip: 96, petitionPin: 106, t_forty_petition: 112,
  lincoln: 162, tenPercent: 174, lincolnPin: 186, t_lincoln_forty: 192, s1863: 214,
  herald: 262, heraldTape: 274, heraldPin: 284,
  johnson: 332, johnsonStrip: 344, johnsonPin: 356, pardoned: 372,
  except: 424, exceptStrip: 436, exceptPin: 448, t_johnson_except: 454, hl: 474, loophole: 510,
  stevens: 552, stevensPin: 566, overridden: 584,
  who: 640, whoQ: 654, whoLabel: 664, whoPin: 676,
  t_who_lincoln: 684, t_who_johnson: 694, t_who_congress: 704, t_petition_who: 714, t_herald_who: 724,
  part: 772, logo: 792,
};
export const COLLAGE_ANIM_FRAMES = 870;
const CAM1: Key[] = [
  [0, 300, 420, 1.75], [130, 330, 470, 1.7],
  [150, 520, 300, 1.65], [232, 520, 320, 1.62],
  [252, 820, 720, 1.6], [306, 830, 720, 1.58],
  [322, 1320, 320, 1.6], [400, 1330, 330, 1.58],
  [416, 1640, 520, 1.6], [530, 1640, 540, 1.56],
  [546, 1320, 700, 1.6], [606, 1320, 710, 1.58],
  [630, 960, 520, 1.3], [700, 960, 520, 1.27],
  [760, 960, 540, 1.0], [870, 960, 540, 0.985],
];
const T = (a: PinId, b: PinId, t: number) => ({a: PIN[a] as unknown as [number, number], b: PIN[b] as unknown as [number, number], at: t});

export const CollageAnim: React.FC = () => {
  const g = useGFrame();
  const hl = interpolate(g, [at.hl, at.hl + 22], [0, 1], clamp);
  const q = interpolate(useCurrentFrame(), [at.whoQ, at.whoQ + 6], [0, 1], clamp);
  const labelP = interpolate(g, [at.whoLabel, at.whoLabel + 10], [0, 1], clamp);
  return (
    <Stage cam={CAM1} stamps={[at.s1863, at.pardoned, at.overridden, at.whoQ]} moves={[134, 236, 308, 402, 532, 608, 702]} splats="b1"
      caption="Mockup · the collage board in motion · Episode 1's board, built piece by piece (no narration)">
      {/* the forty acres map, taped */}
      <Land at={at.forty} kind="drop" x={70} y={210} r={-4}><Photo src="cr_acres.png" w={330} /></Land>
      <Land at={at.fortyTape} kind="tape" x={110} y={190} r={-14} z={5}><TapeBit w={120} seed="a" /></Land>
      <Land at={at.fortyStrip} kind="slide" x={64} y={420} r={-3}><Strip text="Field Order 15 · Jan 1865" seed="e1" size={22} /></Land>
      <Land at={at.whoseLand} kind="slap" x={80} y={480} r={-6}><Sticky text="whose land?" w={170} size={50} /></Land>
      {/* the petition */}
      <Land at={at.petition} kind="drop" x={300} y={590} r={-2}><Scrap text="“we wish to have A home if It be but A few acres.”" w={330} seed="pt" size={30} italic /></Land>
      <Land at={at.petitionStrip} kind="slide" x={330} y={555} r={3}><Strip text="Edisto Island · Oct 1865" seed="ed" size={20} /></Land>
      {/* Lincoln */}
      <Land at={at.lincoln} kind="drop" x={470} y={170} r={3}><Photo src="cr_lincoln.png" w={205} /></Land>
      <Land at={at.tenPercent} kind="slide" x={440} y={420} r={-2}><Strip text="TEN PERCENT" seed="tp" size={28} font={SANS} /></Land>
      <Land at={at.s1863} kind="stamp" x={380} y={80} r={-5}><Stamp text="1863" size={34} /></Land>
      {/* the Herald */}
      <Land at={at.herald} kind="drop" x={640} y={730} r={1.5}><Herald /></Land>
      <Land at={at.heraldTape} kind="tape" x={600} y={700} r={-20} z={5}><TapeBit w={110} seed="h" /></Land>
      {/* Johnson */}
      <Land at={at.johnson} kind="drop" x={1200} y={160} r={-3}><Photo src="cr_johnson.png" w={235} /></Land>
      <Land at={at.johnsonStrip} kind="slide" x={1420} y={120} r={4}><Strip text="president · Apr 1865" seed="pj" size={20} /></Land>
      <Land at={at.pardoned} kind="stamp" x={1160} y={390} r={6} z={6}><Stamp text="PARDONED" size={40} /></Land>
      {/* the 13th Amendment */}
      <Land at={at.except} kind="drop" x={1480} y={430} r={2}><Scrap text="Neither slavery nor involuntary servitude, except as a punishment for crime…" mark="except as a punishment for crime" w={380} seed="13" size={25} hl={hl} /></Land>
      <Land at={at.exceptStrip} kind="slide" x={1500} y={385} r={-3}><Strip text="13th Amendment · 1865" seed="e6" size={20} /></Land>
      <Land at={at.loophole} kind="slap" x={1650} y={640} r={-8}><Sticky text="loophole?" w={170} size={48} /></Land>
      {/* Congress */}
      <Land at={at.stevens} kind="drop" x={1240} y={600} r={-2}><Photo src="cr_stevens.png" w={200} /></Land>
      <Land at={at.overridden} kind="stamp" x={1170} y={830} r={-7} z={6}><Stamp text="OVERRIDDEN" size={36} /></Land>
      {/* the open question */}
      <Land at={at.who} kind="drop" x={830} y={330}><Silhouette label="WHO DECIDES?" q={q} labelP={labelP} /></Land>
      {/* the series label and the worn logo */}
      <Land at={at.part} kind="slide" x={1000} y={980}><Strip text="RECONSTRUCTION · PART 1" seed="cs" size={22} bg={p.paper} /></Land>
      <Land at={at.logo} kind="fade" x={1490} y={940} r={-3}><WornLogo w={360} /></Land>
      <AThreads lines={[
        T('forty', 'petition', at.t_forty_petition), T('lincoln', 'forty', at.t_lincoln_forty), T('johnson', 'except', at.t_johnson_except),
        T('who', 'lincoln', at.t_who_lincoln), T('who', 'johnson', at.t_who_johnson), T('who', 'congress', at.t_who_congress),
        T('petition', 'who', at.t_petition_who), T('herald', 'who', at.t_herald_who),
      ]} />
      {([['forty', at.fortyPin], ['petition', at.petitionPin], ['lincoln', at.lincolnPin], ['herald', at.heraldPin], ['johnson', at.johnsonPin],
        ['except', at.exceptPin], ['congress', at.stevensPin], ['who', at.whoPin]] as [PinId, number][]).map(([id, t]) => <APin key={id} at={t} x={PIN[id][0]} y={PIN[id][1]} />)}
      <Sounds drops={[at.forty, at.petition, at.lincoln, at.herald, at.johnson, at.except, at.stevens, at.who]} slaps={[at.whoseLand, at.loophole, at.fortyTape, at.heraldTape]}
        pins={[at.fortyPin, at.petitionPin, at.lincolnPin, at.heraldPin, at.johnsonPin, at.exceptPin, at.stevensPin, at.whoPin]}
        slides={[at.fortyStrip, at.petitionStrip, at.tenPercent, at.johnsonStrip, at.exceptStrip, at.whoLabel, at.part, at.hl]}
        threads={[at.t_forty_petition, at.t_lincoln_forty, at.t_johnson_except, at.t_who_lincoln, at.t_who_johnson, at.t_who_congress, at.t_petition_who, at.t_herald_who]} />
    </Stage>
  );
};

// ------------------------------------------------------------------- the close-up: one night, three men -------------------
const N = {
  date: 10, booth: 34, boothStrip: 48, boothPin: 58,
  lincoln: 92, lincolnStrip: 104, lincolnPin: 114, tLincoln: 118, shot: 140,
  seward: 172, sewardStrip: 184, sewardPin: 194, tSeward: 198, stabbed: 220,
  johnson: 252, johnsonStrip: 264, johnsonPin: 274, tJohnson: 278, never: 300,
  oneNight: 346, whyVp: 362, whatIf: 378, logo: 396,
};
export const COLLAGE_NIGHT_FRAMES = 470;
const CAM2: Key[] = [
  [0, 690, 330, 1.42], [26, 690, 330, 1.42], [40, 960, 360, 1.5], [70, 960, 360, 1.5],
  [84, 450, 380, 1.45], [160, 450, 400, 1.42],
  [166, 980, 780, 1.45], [240, 980, 790, 1.42],
  [246, 1530, 380, 1.45], [318, 1530, 400, 1.42],
  [350, 960, 540, 1.0], [470, 960, 540, 0.985],
];
export const CollageNight: React.FC = () => {
  const booth: [number, number] = [960, 300];
  return (
    <Stage cam={CAM2} stamps={[N.shot, N.stabbed, N.never]} moves={[26, 72, 162, 242, 322]} splats="c3"
      caption="Mockup · the collage board in motion · a close-up: one night, three men (Episode 1, chapter 4)">
      <Land at={N.date} kind="slide" x={60} y={40}><Strip text="APRIL 14, 1865" seed="cf" size={34} bg={p.paper} font={SANS} /></Land>
      <Land at={N.booth} kind="drop" x={840} y={210} r={-2}><Photo src="cr_booth.png" w={240} /></Land>
      <Land at={N.boothStrip} kind="slide" x={820} y={540} r={2}><Strip text="J. WILKES BOOTH · actor" seed="jb" size={26} font={SANS} /></Land>
      <Land at={N.lincoln} kind="drop" x={300} y={190} r={3}><Photo src="cr_lincoln.png" w={215} /></Land>
      <Land at={N.lincolnStrip} kind="slide" x={270} y={460} r={-3}><Strip text="the President · Ford's Theatre" seed="t1" size={22} /></Land>
      <Land at={N.shot} kind="stamp" x={250} y={540} r={-8} z={6}><Stamp text="SHOT · AFTER 10 P.M." size={36} /></Land>
      <Land at={N.seward} kind="drop" x={860} y={660} r={1}><Photo src="cr_seward.png" w={205} /></Land>
      <Land at={N.sewardStrip} kind="slide" x={800} y={910} r={-2}><Strip text="the Secretary of State · his home" seed="t2" size={22} /></Land>
      <Land at={N.stabbed} kind="stamp" x={1090} y={850} r={-6} z={6}><Stamp text="STABBED · SURVIVED" size={34} /></Land>
      <Land at={N.johnson} kind="drop" x={1390} y={190} r={-3}><Photo src="cr_johnson.png" w={240} /></Land>
      <Land at={N.johnsonStrip} kind="slide" x={1370} y={460} r={2}><Strip text="the vice president · his hotel" seed="t3" size={22} /></Land>
      <Land at={N.never} kind="stamp" x={1400} y={540} r={6} z={6}><Stamp text="NEVER ATTACKED" size={36} /></Land>
      <Land at={N.oneNight} kind="slap" x={1130} y={600} r={7}><Sticky text="one night, three men" w={200} size={46} /></Land>
      <Land at={N.whyVp} kind="slap" x={140} y={760} r={-4}><Sticky text="why the vice president?" w={210} size={44} /></Land>
      <Land at={N.whatIf} kind="slap" x={1620} y={720} r={5}><Sticky text="what if all three died?" w={210} size={44} /></Land>
      <Land at={N.logo} kind="fade" x={1560} y={40} r={4}><WornLogo w={300} /></Land>
      <AThreads lines={[{a: booth, b: [420, 260], at: N.tLincoln}, {a: booth, b: [962, 690], at: N.tSeward}, {a: booth, b: [1500, 260], at: N.tJohnson}]} />
      <APin at={N.boothPin} x={booth[0]} y={booth[1]} />
      <APin at={N.lincolnPin} x={420} y={260} />
      <APin at={N.sewardPin} x={962} y={690} />
      <APin at={N.johnsonPin} x={1500} y={260} />
      <Sounds drops={[N.booth, N.lincoln, N.seward, N.johnson]} slaps={[N.oneNight, N.whyVp, N.whatIf]}
        pins={[N.boothPin, N.lincolnPin, N.sewardPin, N.johnsonPin]} slides={[N.date, N.boothStrip, N.lincolnStrip, N.sewardStrip, N.johnsonStrip]}
        threads={[N.tLincoln, N.tSeward, N.tJohnson]} />
    </Stage>
  );
};
