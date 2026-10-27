// Chapter 7 · Who Got the Gold (69.5 s; ends with the subscribe plug).
// The spine is a drawn 3D cut-away of a Black Hills hill (Ep 1 ch04's Summit Tunnel style: Stage + Upright, teal lines,
// "not to scale"): the creek gravel (step one), gold veins locked deep in the rock with a shaft and headframe (step two),
// the stamp mill beside it (step three). The three steps light up on their words; the camera orbits slowly.
// Shot list (narration words → shot):
//  A "Every gold rush…three steps."            the cut-away, wide, nothing lit, slow orbit; THREE STEPS
//  B "Step one: a man with a pan in a creek."  desk: the gold pan prop (coral), STEP 1 OF 3
//  C "The gold is loose…placer mining."        cut-away: the creek gravel lights, coral flecks, the sluice stands; {placer mining}
//  D "Step two: the easy gold runs out."       cut-away: the flecks wash out of the gravel (camera slides right)
//  E "The rest is locked…deep underground."    cut-away: the veins light deep in the rock, the shaft drops, the headframe stands
//  F "Step three…shafts, machines, and a mill" cut-away pulls wide: the stamp mill stands, the ore line runs to it
//  G "that crushes rock day and night."        desk: the stamp mill prop thumping (small shakes)
//  H "And that takes money. A lot of it."      desk: the coin stack slaps down, "money." coral
//  I "In 1877…George Hearst,"                  Hearst (coral), 1877
//  J "bought a claim…seventy thousand dollars." series map: the Black Hills, Lead pinned "the Homestake"; $70,000
//  K "It became one of the richest…"           Grabill 1888: the open cut at the Homestake, THE HOMESTAKE
//  L "Over forty million ounces…until 2002."   ≈ 40,000,000 OZ counter + the 1877 → 2002 bar
//  M "So, stack it up…then a company."         cut-away wide, all three lit, labelled free-for-all / hard rock / a company (coral)
//  N "That means most miners…started."         handwriting over the dimmed cut-away
//  O "Working for wages. Just underground."    cut-away push into the drift (ore cart); both lines written by "Just", then a hold as the music stops
//  P "Quick thing…subscribe. It's free."       desk of props pulling out; one small teal note "subscribe ↓"
//  Q "Cheap as dirt, even. Hold onto that phrase." the wire spool edges in from the right; "cheap as dirt" in small handwriting
import React from 'react';
import {bed} from '../kit/levels';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch07_who_got_the_gold.words.json';
import {clamp} from '../lib/anim';
import {JF, Loop, Note, useGFrame, useHand, usePal} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration} from '../kit/shell';
import {keys, PhotoCam, ScrimTag, shake, SlapTitle, zkeys} from '../previews/fx';
import {Big, Counter, DeskCam, Float, Label, Lines, Prop, Stage, Upright} from '../kit/ch04_extra';
import {DeskShot, Hand, Print, Sounds, WShots} from '../kit/ch07_extra';
import {MPin, MRegion, WestMap} from '../kit/ch01_extra';
import {TPL, TREGIONS} from '../kit/trails';
import {insideBox, PROP, StandProp, StepBadge} from '../kit/ch07_10_extra';
import {M7} from '../masks_ch07';

const N = words as Narration;
export const CH07_FRAMES = chapterFrames(N, LEAD);
const T = makeTimeline(N, 30);
const at = T.at;
const END = T.frames + 60;

const I = {
  placer: 'img/ch07/remington_miners_prospecting_1880s.jpg',
  mills: 'img/ch07/homestake_mines_mills_lead_grabill_1889.jpg',
  hearst: 'img/ch07/b_hearst_1891.jpg',
  homestake: 'img/ch07/b_homestake_open_cut_1888.jpg',
};
const PLACER_CROP: [number, number, number, number] = [190, 90, 1380, 990];
/** The print inside Grabill's cabinet-card mount. */
const HS_BOX: [number, number, number, number] = [70, 130, 1860, 2440];
const Z = {
  placer: [1454, 1150] as [number, number],
  mills: [3000, 2457] as [number, number],
  hearst: [1920, 2593] as [number, number],
  homestake: [1920, 2738] as [number, number],
};
const TAG = {
  placer: 'Frederic Remington, Miners prospecting, 1880s · Library of Congress',
  mills: 'J. C. H. Grabill, Lead City: the great Homestake mines and mills, 1889 · Library of Congress',
  hearst: 'George Hearst, Edouart & Cobb, 1891 · Wikimedia Commons',
  homestake: 'J. C. H. Grabill, Open cut in the great Homestake mine, at Lead City, Dakota, 1888 · Library of Congress (via Commons)',
  map: 'Map: drawn for the series; Black Hills and Lead approx.',
};

// ───────────────────────── the cut-away ─────────────────────────

const L = 1400;
const H = 560;
/** The hill's surface (svg y, 0 = top): the creek valley left, the hill over the veins, the flat right where the mill stands. */
const surf = (x: number) => H - (150 + 330 * Math.exp(-(((x - 720) / 300) ** 2)) - 62 * Math.exp(-(((x - 215) / 110) ** 2)));
const RIDGE = Array.from({length: L / 10 + 1}).map((_, i) => `${i * 10},${surf(i * 10).toFixed(1)}`);
const SHAFT = 900;
const DRIFT_Y = 478;
const MILL = 1230;
const SLUICE = 250;
/** Gold veins in the rock (svg px), jagged quartz seams under the hill. */
const VEINS = [
  [[560, 430], [620, 452], [690, 440], [760, 470], [830, 462], [900, 486]],
  [[600, 500], [660, 488], [720, 512], [790, 500], [860, 520]],
  [[640, 392], [700, 410], [760, 398], [810, 420]],
];
const veinD = (pts: number[][]) => 'M' + pts.map(([x, y]) => `${x},${y}`).join(' L');
/** Loose gold in the creek gravel. */
const FLECKS = Array.from({length: 34}).map((_, i) => {
  const x = 70 + ((i * 83) % 340);
  const y = surf(x) + 10 + ((i * 37) % 34);
  return [x, y];
});

type HillProps = {s1: number; s2: number; s3: number; hot: 0 | 1 | 2 | 3; washed?: number; shaft?: number; drift?: number;
  at2?: number; at3?: number; at1?: number; labels?: boolean; stack?: [number, number, number]; cart?: number; dim?: number};

const Hill: React.FC<HillProps> = ({s1, s2, s3, hot, washed = 0, shaft = s2, drift = 0, at1 = 1e7, at2 = 1e7, at3 = 1e7, labels = true, stack, cart = 1e7, dim = 0}) => {
  const pal = usePal();
  const hand = useHand();
  const g = useGFrame();
  const c = (n: number) => (hot === n ? pal.subject : pal.mark);
  const txt = (x: number, y: number, t: string, k: number, color?: string, size = 24) => k > 0 &&
    <text x={x} y={y} fontFamily={JF.mono} fontSize={size} letterSpacing={3} fill={color ?? '#f4efe6'} opacity={k} style={{paintOrder: 'stroke'}} stroke="#0b0a08" strokeWidth={6}>{t}</text>;
  const sy = surf(SHAFT);
  return (
    <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', opacity: 1 - dim * 0.6, filter: dim ? `brightness(${1 - dim * 0.5})` : undefined}}>
      {/* the ground plane: a faint teal grid fading out */}
      <div style={{position: 'absolute', left: -240, top: -460, width: L + 480, height: 820,
        backgroundImage: 'linear-gradient(rgba(47,224,196,0.13) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(47,224,196,0.13) 1.5px, transparent 1.5px)',
        backgroundSize: '60px 60px', WebkitMaskImage: 'radial-gradient(ellipse at 50% 55%, #000 40%, transparent 72%)', maskImage: 'radial-gradient(ellipse at 50% 55%, #000 40%, transparent 72%)'}} />
      {/* depth: the hill's back profiles */}
      {[-150, -110, -70, -35].map((y, i) => (
        <Upright key={y} y={y} w={L} h={H}>
          <svg width={L} height={H} style={{overflow: 'visible'}}>
            <polyline points={RIDGE.join(' ')} fill="none" stroke={pal.mark} strokeWidth={2} opacity={0.18 + i * 0.1} />
          </svg>
        </Upright>
      ))}
      {/* the front face, in section */}
      <Upright y={0} w={L} h={H}>
        <svg width={L} height={H} style={{overflow: 'visible'}}>
          <path d={`M0,${H} L${RIDGE.join(' L')} L${L},${H} Z`} fill="rgba(12,20,18,0.82)" />
          {/* strata and rock hatching */}
          {[0.25, 0.5, 0.72].map((k, i) => (
            <path key={i} d={'M' + Array.from({length: 29}).map((_, j) => `${j * 50},${(surf(j * 50) + (H - surf(j * 50)) * k + Math.sin(j * 0.9 + i) * 6).toFixed(1)}`).join(' L')}
              fill="none" stroke={pal.mark} strokeWidth={1.2} opacity={0.22} />
          ))}
          {Array.from({length: 80}).map((_, i) => {
            const x = 30 + ((i * 97) % (L - 60));
            const y = surf(x) + 50 + ((i * 53) % Math.max(20, H - surf(x) - 70));
            return <line key={`h${i}`} x1={x} y1={y} x2={x + 14} y2={y - 7} stroke={pal.mark} strokeWidth={1.4} opacity={0.3} />;
          })}
          {/* step one: the creek and its gravel */}
          <path d={`M40,${surf(40) + 2} ${Array.from({length: 38}).map((_, i) => `L${40 + i * 10},${(surf(40 + i * 10) + 2).toFixed(1)}`).join(' ')} L410,${surf(410) + 54} ${Array.from({length: 38}).map((_, i) => `L${410 - i * 10},${(surf(410 - i * 10) + 54).toFixed(1)}`).join(' ')} Z`}
            fill={pal.mark} opacity={0.06 + 0.12 * s1} stroke={pal.mark} strokeWidth={2} strokeOpacity={0.25 + 0.5 * s1} strokeDasharray="8 6" />
          <path d={`M150,${surf(150)} Q215,${surf(215) + 18} 285,${surf(285)} Z`} fill="#5d7a82" opacity={0.85} />
          {FLECKS.map(([x, y], i) => {
            const gone = washed > (i % 7) / 7;
            const k = s1 * (gone ? 0 : 1);
            return k > 0 ? <circle key={i} cx={x} cy={y} r={4 + (i % 3)} fill={c(1)} opacity={k} /> : null;
          })}
          {/* step two: the veins, the shaft and the drift */}
          {VEINS.map((v, i) => (
            <g key={i}>
              <path d={veinD(v)} fill="none" stroke={pal.mark} strokeWidth={2} strokeDasharray="6 8" opacity={0.3} />
              {s2 > 0 && <path d={veinD(v)} fill="none" stroke={c(2)} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - s2} />}
              {s2 > 0 && hot === 2 && <path d={veinD(v)} fill="none" stroke={pal.subject} strokeWidth={22} strokeLinecap="round" opacity={0.18 * s2} />}
            </g>
          ))}
          {shaft > 0 && <rect x={SHAFT - 14} y={sy} width={28} height={(DRIFT_Y + 22 - sy) * shaft} fill="#050403" stroke={pal.mark} strokeWidth={3} />}
          {drift > 0 && <rect x={SHAFT - (SHAFT - 600) * drift} y={DRIFT_Y - 22} width={(SHAFT - 600) * drift + 14} height={44} fill="#050403" stroke={pal.mark} strokeWidth={3} />}
          {/* step three: the ore goes to the mill */}
          {s3 > 0 && <path d={`M${SHAFT + 20},${sy - 30} Q${(SHAFT + MILL) / 2},${sy - 120} ${MILL - 70},${surf(MILL - 70) - 60}`} fill="none" stroke={c(3)} strokeWidth={5}
            strokeDasharray="14 10" opacity={s3} />}
          <polyline points={RIDGE.join(' ')} fill="none" stroke={pal.mark} strokeWidth={5} strokeLinejoin="round" />
          <line x1={-60} y1={H} x2={L + 60} y2={H} stroke={pal.mark} strokeWidth={2} opacity={0.5} />
          {labels && <>
            {txt(70, surf(80) + 90, 'CREEK GRAVEL', hot === 1 ? s1 : 0)}
            {txt(980, 560 - 24, 'SOLID ROCK', s2)}
            {txt(SHAFT + 30, DRIFT_Y - 120, 'SHAFT', s2, pal.mark, 20)}
            {txt(MILL - 110, surf(MILL) + 50, 'STAMP MILL', s3)}
          </>}
          {labels && s2 > 0.5 && <text x={560} y={372} fontFamily={hand.family} fontSize={40 * hand.scale} fill={c(2)} stroke="#0b0a08" strokeWidth={6} style={{paintOrder: 'stroke'}}>gold veins</text>}
          {stack && <>
            {g >= stack[0] && <text x={30} y={surf(100) + 120} fontFamily={hand.family} fontSize={50 * hand.scale} fill={pal.mark} stroke="#0b0a08" strokeWidth={7} style={{paintOrder: 'stroke'}}>a free-for-all</text>}
            {g >= stack[1] && <text x={600} y={DRIFT_Y + 70} fontFamily={hand.family} fontSize={50 * hand.scale} fill={pal.mark} stroke="#0b0a08" strokeWidth={7} style={{paintOrder: 'stroke'}}>hard rock</text>}
            {g >= stack[2] && <text x={MILL - 150} y={surf(MILL) - 250} fontFamily={hand.family} fontSize={58 * hand.scale} fill={pal.subject} stroke="#0b0a08" strokeWidth={7} style={{paintOrder: 'stroke'}}>a company</text>}
          </>}
        </svg>
        {/* the props standing on the section line */}
        <div style={{position: 'absolute', left: 0, top: 0, width: L, height: H}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: L, height: surf(SLUICE) + 26}}><StandProp name="p7_sluice" x={SLUICE} w={210} at={at1} /></div>
          <div style={{position: 'absolute', left: 0, top: 0, width: L, height: sy + 8}}><StandProp name="p7_headframe" x={SHAFT} w={150} at={at2} /></div>
          <div style={{position: 'absolute', left: 0, top: 0, width: L, height: surf(MILL) + 10}}><StandProp name="p7_stamp_mill" x={MILL} w={230} at={at3} /></div>
          <div style={{position: 'absolute', left: 0, top: 0, width: L, height: DRIFT_Y + 20}}><StandProp name="p7_ore_cart" x={700} w={70} at={cart} /></div>
        </div>
      </Upright>
    </div>
  );
};

/** The cut-away on its stage with a keyed camera: each key [frame, fx, tilt, spin, z]. */
const HillShot: React.FC<{k: [number, number, number, number, number][]; hill: HillProps; children?: React.ReactNode}> = ({k, hill, children}) => {
  const f = useCurrentFrame();
  const v = (i: number) => keys(f, k.map((r) => [r[0], r[i]] as [number, number]));
  return (
    <AbsoluteFill>
      <Stage w={L} fx={v(1)} tilt={v(2)} spin={v(3)} z={zkeys(f, k.map((r) => [r[0], r[4]] as [number, number]))} dy={150}>
        <Hill {...hill} />
      </Stage>
      {children}
      <ScrimTag text="Drawn · not to scale" />
    </AbsoluteFill>
  );
};

const lit = (a: number, d = 10) => (f: number) => interpolate(f, [a, a + d], [0, 1], clamp);

// A · three steps
const Open: React.FC = () => {
  const b = at('Step one') - 1;
  return (
    <HillShot k={[[0, 700, 70, -30, 0.95], [b, 700, 64, -18, 1.02]]} hill={{s1: 0, s2: 0, s3: 0, hot: 0, labels: false}}>
      <Note text="every gold rush goes the same way" x={110} y={110} size={52} rot={-2} at={at('Every') + 2} />
      <SlapTitle text="THREE STEPS" x={1180} y={860} size={96} at={at('three')} seed={71} />
    </HillShot>
  );
};

// B · step one: Remington's miners prospecting: a man with a pan at the creek (print on the desk, the pan looped)
const Pan: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Step one') - 1;
  const b = at('The gold is') - 1;
  return (
    <DeskShot tilt={keys(f, [[a, 22], [b, 14]])} z={zkeys(f, [[a, 0.92], [b, 1.04]])} x={keys(f, [[a, -20], [b, 20]])} hits={[a + 5]}
      over={<>
        <StepBadge n={1} of={3} x={110} y={90} at={at('one') - 1} />
        <Lines x={120} y={330} size={66} rows={[{text: 'a man with a pan', at: at('man') - 2}, {text: 'in a creek', at: at('creek') - 3}]} />
        <ScrimTag text={TAG.placer} />
      </>}>
      <Print src={I.placer} size={Z.placer} x={820} y={140} w={1100} crop={PLACER_CROP} at={a + 2} rot={2} seed={72}>
        {(S) => {
          const [px, py] = S(480, 640);
          return <div style={{position: 'absolute', inset: 0}}><Loop cx={px} cy={py} rx={120} ry={80} at={at('pan') - 2} seed={72} tilt={-8} width={6} /></div>;
        }}
      </Print>
    </DeskShot>
  );
};

// C · placer gold in the gravel
const Placer: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('The gold is') - 1;
  const b = at('Step two') - 1;
  return (
    <HillShot k={[[a, 330, 62, -14, 1.35], [b, 380, 58, -6, 1.5]]} hill={{s1: lit(a + 4)(f), s2: 0, s3: 0, hot: 1, at1: a + 6}}>
      <Note text="loose in the gravel" x={110} y={130} size={60} rot={-3} at={at('loose') - 2} />
      <Note text="anyone can wash it out" x={130} y={230} size={52} rot={-3} color="#f4efe6" at={at('anyone') - 2} />
      <Definition term="placer mining" def="washing loose gold out of sand and gravel with water: a pan, a sluice, a creek" at={at('placer') - 4} x={110} y={820} w={1300} />
    </HillShot>
  );
};

// D · the easy gold runs out
const RunsOut: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Step two') - 1;
  const b = at('The rest') - 1;
  return (
    <HillShot k={[[a, 420, 58, -6, 1.3], [b, 640, 60, -12, 1.12]]} hill={{s1: 1, s2: 0, s3: 0, hot: 1, washed: interpolate(f, [at('easy'), at('runs out') + 8], [0, 1.05], clamp), at1: -99}}>
      <StepBadge n={2} of={3} x={110} y={110} at={at('two') - 1} />
      <Note text="the easy gold runs out" x={1080} y={150} size={58} rot={-3} at={at('easy') - 2} />
    </HillShot>
  );
};

// E · locked inside solid rock, deep underground
const Locked: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('The rest') - 1;
  const b = at('Step three') - 1;
  return (
    <HillShot k={[[a, 700, 60, -12, 1.12], [b, 820, 54, -24, 1.3]]}
      hill={{s1: 0.25, s2: lit(at('locked'), 14)(f), s3: 0, hot: 2, shaft: lit(at('deep') - 4, 16)(f), at1: -99, at2: at('deep') - 2}}>
      <StepBadge n={2} of={3} x={110} y={110} at={-99} />
      <Note text="locked inside solid rock" x={1120} y={790} size={58} rot={-3} at={at('locked') - 2} />
      <Note text="deep underground" x={1180} y={890} size={58} rot={-3} color="#f4efe6" at={at('deep') - 2} />
    </HillShot>
  );
};

// F · shafts, machines, and a mill
const Mill: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Step three') - 1;
  const b = at('crushes') - 1;
  return (
    <HillShot k={[[a, 1000, 58, -20, 1.12], [b, 880, 64, -10, 0.95]]}
      hill={{s1: 0.25, s2: 1, s3: lit(at('mill') - 2)(f), hot: 3, shaft: 1, drift: lit(at('machines') - 2, 12)(f), at1: -99, at2: -99, at3: at('mill') - 2}}>
      <StepBadge n={3} of={3} x={110} y={110} at={at('three', 2) - 1} />
      <Lines x={1180} y={700} size={56} gap={84} rows={[{text: 'shafts,', at: at('shafts') - 2}, {text: 'machines,', at: at('machines') - 2}, {text: 'and a mill', at: at('mill') - 3, color: '#FF6F61'}]} />
    </HillShot>
  );
};

// G · the stamp mill, day and night
const Crush: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('crushes') - 1;
  const beats = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => a + 4 + i * 8);
  const sh = shake(f, beats, 3.5, 0.35);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <DeskCam k={[[a, 12, 1.12, 40, 0, 1], [at('And that takes'), 18, 1.02, 0, 0, 0]]}>
        <Float x={300} y={170} w={760} hgt={860} h={12} at={-99} rot={2} seed={72}>
          <Prop src={PROP('p7_stamp_mill')} m={M7.p7_stamp_mill} x={0} y={0} w={700} at={-99} tint={0.3} traceAt={a + 3} />
        </Float>
      </DeskCam>
      <Note text="crushes rock" x={1200} y={300} size={64} rot={-3} at={at('crushes') + 2} />
      <Note text="day and night" x={1240} y={410} size={64} rot={-3} color="#f4efe6" at={at('day') - 2} />
    </AbsoluteFill>
  );
};

// H · money
const Money: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('And that takes') - 1;
  const d = at('money') - 2;
  const sh = shake(f, [d + 3], 9);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <DeskCam k={[[a, 22, 0.94, 0, 0, -2], [at('In 1877'), 16, 1.04, 0, 10, 0]]}>
        <Float x={1080} y={250} w={640} hgt={760} h={16} at={d} rot={4} seed={73}>
          <Prop src={PROP('p2_coin_stack')} m={M7.p2_coin_stack} x={0} y={0} w={560} at={-99} traceAt={d + 6} />
        </Float>
      </DeskCam>
      <Hand parts={[['and that takes ']]} x={130} y={280} size={72} at={a + 3} white />
      <Hand parts={[['money.', true]]} x={170} y={420} size={140} at={at('money') - 3} />
      <Note text="a lot of it." x={200} y={660} size={64} rot={-3} color="#f4efe6" at={at('A lot') - 2} />
    </AbsoluteFill>
  );
};

// I · George Hearst: his portrait lands on the desk (coral), the notes beside it
const Hearst: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('In 1877') - 1;
  const b = at('bought') - 1;
  return (
    <DeskShot tilt={keys(f, [[a, 20], [b, 12]])} z={zkeys(f, [[a, 0.94], [b, 1.04]])} x={keys(f, [[a, 20], [b, -20]])} hits={[a + 5]} lamp={[1300, 450]}
      over={<>
        <SlapTitle text="1877" x={110} y={100} size={110} at={at('1877')} seed={73} />
        <Note text="rich California investors" x={110} y={320} size={56} rot={-3} at={at('rich') - 2} />
        <Note text="led by George Hearst" x={130} y={430} size={62} rot={-3} color="#FF6F61" at={at('George') - 2} />
        <ScrimTag text={TAG.hearst} />
      </>}>
      <Print src={I.hearst} size={Z.hearst} x={1080} y={60} w={760} crop={[120, 120, 1920, 2400]} at={a + 2} rot={2} seed={71} mask={M7.b_hearst} tint={0.2} traceAt={at('George') - 1} />
    </DeskShot>
  );
};

// J · the claim in the Black Hills
const Claim: React.FC = () => {
  const a = at('bought') - 1;
  const b = at('It became') - 1;
  return (
    <AbsoluteFill>
      <WestMap keys={[{f: a, x: 2160, y: 860, z: 0.95, tilt: 40, rot: -4}, {f: b, x: 2170, y: 820, z: 1.8, tilt: 34, rot: 0}]}>
        {(api) => <>
          <MRegion api={api} pts={TREGIONS.blackHills} at={at('Black Hills') - 2} />
          <MPin api={api} at={TPL.lead} show={at('Homestake') - 2} label="the Homestake" sub="LEAD · THE BLACK HILLS" color="#FF6F61" />
        </>}
      </WestMap>
      <Big text="$70,000" x={1200} y={800} size={150} at={at('seventy') - 1} color="#f4efe6" />
      <ScrimTag text={TAG.map} />
    </AbsoluteFill>
  );
};

// K · the Homestake, one of the richest gold mines in the world: Grabill's Lead City, mines and mills, 1889 (pan right)
const MILLS_BOX: [number, number, number, number] = [40, 100, 2960, 2050];
const Homestake: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('It became') - 1;
  const b = at('Over forty') - 1;
  const c = insideBox(MILLS_BOX, keys(f, [[a, 1200], [b, 1900]]), keys(f, [[a, 1150], [b, 1200]]), zkeys(f, [[a, 0.72], [b, 0.82]]));
  return (
    <AbsoluteFill>
      <PhotoCam src={I.mills} size={Z.mills} cx={c.cx} cy={c.cy} s={c.s} bw="grayscale(1) contrast(1.2) brightness(0.95)" />
      <SlapTitle text="THE HOMESTAKE" x={110} y={100} size={100} at={a + 3} seed={75} />
      <Note text="one of the richest gold mines" x={120} y={770} size={60} rot={-2} at={at('richest') - 3} />
      <Note text="in the world" x={160} y={870} size={60} rot={-2} color="#f4efe6" at={at('world') - 3} />
      <ScrimTag text={TAG.mills} x={34} y={24} />
    </AbsoluteFill>
  );
};

// L · forty million ounces, until 2002
const Ounces: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const a = at('Over forty') - 1;
  const z = zkeys(f, [[a, 1.06], [at('So stack') - 1, 0.98]]);
  const X = (y: number) => 220 + ((y - 1870) / 140) * 1480;
  const p = interpolate(g, [at("It didn't"), at('2002') + 8], [0, 1], clamp);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {(() => {
        const cc = insideBox(HS_BOX, 1000, keys(f, [[a, 1500], [at('So stack'), 1300]]), 1.1);
        return <PhotoCam src={I.homestake} size={Z.homestake} cx={cc.cx} cy={cc.cy} s={cc.s} bw="grayscale(1) contrast(1.1) brightness(0.32)" />;
      })()}
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '45% 50%'}}>
        <Counter to={40000000} at={at('forty') - 2} dur={22} x={220} y={170} size={150} prefix="≈ " color="#f4efe6" />
        <Label text="ounces of gold, over its life" x={230} y={350} size={30} at={at('ounces') - 1} />
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
          <line x1={X(1870)} y1={680} x2={X(2010)} y2={680} stroke={pal.mark} strokeWidth={3} opacity={g >= at("It didn't") - 2 ? 0.6 : 0} />
          {g >= at("It didn't") - 2 && <rect x={X(1877)} y={656} width={(X(2002) - X(1877)) * p} height={48} fill={pal.subject} opacity={0.9} />}
        </svg>
        <Big text="1877" x={X(1877) - 60} y={540} size={80} at={at("It didn't") - 2} />
        <Big text="2002" x={X(2002) - 110} y={540} size={80} at={at('2002') - 1} color="#FF6F61" />
        <Note text="it didn't close until 2002" x={X(1900)} y={760} size={56} rot={-2} at={at('until') - 2} />
      </AbsoluteFill>
      <ScrimTag text={`${TAG.homestake.split(' · ')[0]}  ·  output ≈ 40–41 million oz, 1877–2002 (commonly cited)`} />
    </AbsoluteFill>
  );
};

// M · stack it up
const Stack: React.FC = () => {
  const a = at('So stack') - 1;
  const b = at('That means') - 1;
  return (
    <HillShot k={[[a, 700, 66, -20, 0.92], [b, 700, 62, -8, 0.96]]}
      hill={{s1: 1, s2: 1, s3: 1, hot: 0, shaft: 1, drift: 1, at1: -99, at2: -99, at3: -99, labels: false, stack: [at('freeforall') - 2, at('hard rock') - 2, at('company') - 2]}}>
      <Hand parts={[['so, stack it up.']]} x={110} y={100} size={70} at={at('stack') - 3} white />
    </HillShot>
  );
};

// N · that means…
const Means: React.FC = () => {
  const a = at('That means') - 1;
  return (
    <HillShot k={[[a, 700, 62, -8, 0.96], [at('Working') - 1, 700, 60, -2, 0.98]]}
      hill={{s1: 1, s2: 1, s3: 1, hot: 0, shaft: 1, drift: 1, at1: -99, at2: -99, at3: -99, labels: false, dim: 1}}>
      <Hand parts={[['that means…']]} x={180} y={180} size={70} at={a + 2} white />
      <Hand parts={[['most miners ended up']]} x={180} y={330} size={96} at={at('most') - 3} />
      <Hand parts={[["where they'd "], ['started.', true]]} x={240} y={480} size={96} at={at("where they'd") - 3} />
    </HillShot>
  );
};

// O · working for wages, just underground
/** On "Just underground." the music stops (aw_boomtown's rush ends at 101.2 s into the file) and the picture holds: no new marks. */
const Underground: React.FC = () => {
  const a = at('Working') - 1;
  const b = at('Quick thing') - 1;
  return (
    <HillShot k={[[a, 760, 56, -10, 1.35], [at('Just') - 2, 730, 52, -16, 1.62], [b, 730, 52, -16, 1.62]]}
      hill={{s1: 0.2, s2: 1, s3: 1, hot: 0, shaft: 1, drift: 1, at1: -99, at2: -99, at3: -99, labels: false, cart: a + 4}}>
      <Hand parts={[['working for wages.']]} x={150} y={130} size={84} at={at('Working') - 2} />
      <Hand parts={[['just ', false], ['underground.', true]]} x={200} y={260} size={96} at={at('wages') + 8} />
    </HillShot>
  );
};

// P · the plug
const PlugDesk: React.FC = () => {
  const a = at('Quick thing') - 1;
  const b = at('Cheap') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 14, 1.04, 0, 0, -1], [b, 22, 0.9, 0, 20, 0]]}>
        <Float x={240} y={360} w={640} hgt={460} h={8} at={-99} rot={-8} blur={0.8} seed={74}>
          <Prop src={PROP('p6_gold_pan')} m={M7.p6_gold_pan} x={0} y={0} w={620} at={-99} />
        </Float>
        <Float x={980} y={300} w={560} hgt={560} h={14} at={-99} rot={5} seed={75}>
          <Prop src={PROP('p7_ore_cart')} m={M7.p7_ore_cart} x={0} y={0} w={540} at={-99} />
        </Float>
        <Float x={820} y={760} w={240} hgt={260} h={20} at={-99} rot={-12} seed={76}>
          <Prop src={PROP('p6_nugget')} m={M7.p6_nugget} x={0} y={0} w={220} at={-99} />
        </Float>
      </DeskCam>
      <Note text="subscribe ↓" x={1500} y={900} size={48} rot={-4} at={at('subscribe') - 2} />
    </AbsoluteFill>
  );
};

// Q · cheap as dirt, hold onto that
const PlugSpool: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Cheap') - 1;
  const slide = keys(f, [[a, 520], [a + 30, 0]]);
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 22, 0.9, 0, 20, 0], [END, 18, 0.96, -30, 20, 0]]}>
        <Float x={240} y={360} w={640} hgt={460} h={8} at={-99} rot={-8} blur={1.6} seed={74}>
          <Prop src={PROP('p6_gold_pan')} m={M7.p6_gold_pan} x={0} y={0} w={620} at={-99} />
        </Float>
        <Float x={1360 + slide} y={250} w={620} hgt={640} h={18} at={-99} rot={-4} seed={77}>
          <Prop src={PROP('p8_wire_spool')} m={M7.p8_wire_spool} x={0} y={0} w={600} at={-99} />
        </Float>
      </DeskCam>
      <Note text="subscribe ↓" x={1500} y={900} size={48} rot={-4} at={-99} />
      <Note text="cheap as dirt" x={160} y={160} size={56} rot={-4} at={at('Cheap') - 2} />
      <Note text="(hold onto that)" x={200} y={250} size={44} rot={-4} color="#f4efe6" at={at('Hold') - 2} />
    </AbsoluteFill>
  );
};

// ───────────────────────── assembly ─────────────────────────

const c = (w: string, n = 1) => at(w, n) - 1;
const SHOTS: [number, React.ReactNode, ('whip' | 'cut')?][] = [
  [0, <Open />],
  [c('Step one'), <Pan />, 'whip'],
  [c('The gold is'), <Placer />, 'whip'],
  [c('Step two'), <RunsOut />, 'cut'],
  [c('The rest'), <Locked />, 'cut'],
  [c('Step three'), <Mill />, 'cut'],
  [c('crushes'), <Crush />, 'cut'],
  [c('And that takes'), <Money />, 'cut'],
  [c('In 1877'), <Hearst />, 'whip'],
  [c('bought'), <Claim />, 'cut'],
  [c('It became'), <Homestake />, 'whip'],
  [c('Over forty'), <Ounces />, 'cut'],
  [c('So stack'), <Stack />, 'whip'],
  [c('That means'), <Means />, 'cut'],
  [c('Working'), <Underground />, 'cut'],
  [c('Quick thing'), <PlugDesk />, 'whip'],
  [c('Cheap'), <PlugSpool />, 'cut'],
];

const tick = (w: string, d = 2, n = 1): [number, string, number] => [at(w, n) - d, 'marker_tick', 0.2];
const SFX: [number, string, number][] = [
  ...SHOTS.slice(1).map(([s, , k]): [number, string, number] => (k === 'whip' ? [s - 4, 'whip_soft', 0.25] : [s, 'whoosh', 0.2])),
  tick('Every', -2), [at('three'), 'stamp', 0.22],
  [at('Step one') + 1, 'paper_slap_soft', 0.25], [at('one') - 1, 'block_tap_soft', 0.15], tick('man', 4), tick('creek', 5),
  [at('The gold is') + 5, 'card_slide_soft', 0.18], tick('loose', 4), tick('anyone', 4), [at('placer') - 4, 'card_slide_soft', 0.15],
  [at('two') - 1, 'block_tap_soft', 0.15], tick('easy', 4),
  tick('locked', 4), [at('deep') - 2, 'paper_slap_soft', 0.2], tick('deep', 4),
  [at('three', 2) - 1, 'block_tap_soft', 0.15], tick('shafts', 4), tick('machines', 4), [at('mill') - 2, 'paper_slap_soft', 0.22],
  ...[0, 1, 2, 3, 4, 5, 6, 7].map((i): [number, string, number] => [at('crushes') + 3 + i * 8, 'block_tap_soft', 0.1]), tick('day', 4),
  tick('And that takes', -2), [at('money') - 1, 'paper_slap_soft', 0.25], tick('money', 5), tick('A lot', 4),
  [at('1877'), 'stamp', 0.22], tick('rich', 4), tick('George', 4),
  [at('Black Hills') - 2, 'card_slide_soft', 0.15], [at('Homestake') - 2, 'block_tap_soft', 0.15], [at('seventy') - 1, 'block_tap_soft', 0.15],
  [at('It became') + 2, 'stamp', 0.22], tick('richest', 5), tick('world', 5),
  [at('forty') - 2, 'block_tap_soft', 0.12], tick('until', 4), [at('2002') - 1, 'block_tap_soft', 0.15],
  tick('stack', 5), tick('freeforall'), tick('hard rock'), tick('company'),
  tick('That means', 0), tick('most', 5), tick("where they'd", 5),
  [at('Working') + 3, 'paper_slap_soft', 0.15], tick('Working', 4), tick('wages', -6),
  tick('subscribe', 4), tick('Cheap', 4), [at('Cheap') + 2, 'card_slide_soft', 0.15], tick('Hold', 4),
];

const Body: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <WShots shots={SHOTS} />
    <Sounds list={SFX} />
  </AbsoluteFill>
);

export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch07_who_got_the_gold.wav" lead={LEAD} music={[
    // aw_boomtown (Suno): the rush joined to a hollow. From 42.67 s in, the rush slows to a stop at 101.2 s in the file, just
    // before "Just" (ch07 58.68 s); the hollow comes in under "Just underground." and carries the plug. Don't move it.
    {src: 'music/aw_boomtown.mp3', volume: bed('aw_boomtown'), startFrom: 1280},
  ]}>
    <Body />
  </ChapterShell>
);
