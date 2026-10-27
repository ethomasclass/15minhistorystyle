// Chapter 9 · The Big Die-Up (88.5 s; all quiet: teal and grey only, no coral, no jokes, longer holds, slow cameras).
// The three causes counted on a stacked teal diagram, the investors, the herds outgrowing the grass, 1886, the blizzard of
// January 1887, a drawn 3D slice of the ground (grass under deep snow under a hard crust; a hoof presses and stops), the drift
// into a fence, the dead cattle (Harper's 1886, held), the Big Die-Up, "more than half", Roosevelt and his letter, Russell's
// painting, the new kind of ranching (hay), and the hand-off back to the question.
// Shot list (narration words → shot):
//  A "By the 1880s…crowded."                    series map over Montana, Wyoming and Dakota; longhorns crowd it
//  B "Count the reasons. One: too many cattle." the stacked diagram: 1 writes in
//  C "Investors from the East…open range."      drawn flow: the East, Britain, Scotland → ranches on the open range
//  D "The herds had grown faster than the grass." drawn: a fixed box of grass, cattle multiplying past it
//  E "Two: the summer of 1886 was hot and dry."  the stack: 2 writes in
//  F "The grass came in thin…already weak."      lithograph plains (desaturated), two lines
//  G "Three: the winter. Storm after storm."     the stack: 3 writes in; snow starts over it
//  H "Then, in January 1887…lasted for days."   the blizzard plate, JANUARY 1887, snow
//  I "The snow froze into a hard crust…underneath." the 3D slice of the ground: crust, snow, grass; the hoof presses and stops
//  J "They drifted…a fence, or a ravine. And they stopped." desk: the drifted fence post; wind lines; held
//  K "In the spring…full of dead cattle."        Harper's 1886, "Cattle in a blizzard on the plains": held, no marks
//  L "Cowboys called it the Big Die-Up."         THE BIG DIE-UP + definition
//  M "Nobody knows exactly how many died."       handwriting
//  N "In Montana, some estimates…more than half" a grid of 20 head: more than half go hollow
//  O "One of the ranchers…Dakota Territory,"     map: Medora pinned, Dakota Territory
//  P "Theodore Roosevelt."                        Roosevelt, 1885 (plain print, no coral)
//  Q "That spring…'The losses are crippling.'"   the quote beside the print
//  R "That's the winter Charlie Russell painted." the painting, held
//  S "What came after…Smaller herds. Fenced pastures." handwriting list on the desk
//  T "Hay, cut in the summer and stored for the winter." Watkins: derrick fork stacking hay, Kerr Ranch
//  U "Cattle ranching survived, as a business."  desk: the haystack and the hay rake
//  V "The open range was over."                  the fenced-range plate, held
//  W "So, let's go back to the question."        the painting print on the desk
import React from 'react';
import {bed} from '../kit/levels';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch09_the_big_die_up.words.json';
import {clamp} from '../lib/anim';
import {JF, Note, useGFrame, useHand, usePal} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, Quote, type Narration} from '../kit/shell';
import {keys, Lift, PhotoCam, ScrimTag, SlapTitle, TornPrint, useSlap, zkeys} from '../kit/west';
import {DeskCam, Float, Label, LITHO_QUIET, Lines, Pic, Prop, Stage, Upright} from '../kit/ch04_extra';
import {DeskShot, Hand, Node, Print, Sounds, Wire, WShots} from '../kit/ch07_extra';
import {MPin, W_MAP, WestMap} from '../kit/ch01_extra';
import {MProp, TPL} from '../kit/trails';
import {Bust, CUT, insideBox, PROP, PROPF_QUIET, Quiet, Snow} from '../kit/ch07_10_extra';
import {M9} from '../masks_ch09';

const N = words as Narration;
export const CH09_FRAMES = chapterFrames(N, LEAD);
const T = makeTimeline(N, 30);
const at = T.at;
const END = T.frames + 60;

const I = {
  paint: 'img/ch01/b_chinook_painting.jpg',
  roosevelt: 'img/ch09/roosevelt_buckskin_1885.jpg',
  harpers: 'img/ch09/cattle_in_a_blizzard_harpers_1886.jpg',
  hay: 'img/ch09/derrick_fork_stacking_hay_watkins_1880s.jpg',
  blizzard: 'img/props/L9_blizzard.jpg',
  drift: 'img/ch09/remington_drifting_before_the_storm_c1904.jpg',
  range: 'img/props/L8_fenced_range.jpg',
};
const Z = {
  paint: [4000, 2468] as [number, number],
  roosevelt: [1920, 2819] as [number, number],
  harpers: [3000, 2425] as [number, number],
  hay: [1536, 1190] as [number, number],
  plate: [1920, 1080] as [number, number],
  drift: [3000, 2409] as [number, number],
};
const TAG = {
  paint: 'C. M. Russell, Waiting for a Chinook, 1886 (1907 postcard) · Internet Archive',
  roosevelt: 'Theodore Roosevelt in hunting dress, 1885, G. G. Bain · Library of Congress (via Wikimedia Commons)',
  harpers: "Cattle in a blizzard on the plains, C. Graham after H. Worrall, Harper's Weekly, 1886 · Library of Congress",
  hay: 'C. E. Watkins, Derrick fork stacking hay, Kerr Ranch, 1880s · Library of Congress',
  drift: 'Frederic Remington, Drifting before the storm, c. 1904 · Library of Congress',
  map: 'Map: drawn for the series; state lines today\'s, for reference',
};
/** The painting in black and white, a little warm (as ch01). */
const PBW = 'grayscale(1) sepia(0.12) contrast(1.15) brightness(0.92)';
/** Harper's picture area inside the page scan. */
const HARP_BOX: [number, number, number, number] = [330, 395, 2670, 1975];

// ───────────────────────── A · the crowded northern plains ─────────────────────────

const NORTH = ['USA:Montana', 'USA:Wyoming', 'USA:North Dakota', 'USA:South Dakota'];
const HERD: [number, number][] = Array.from({length: 26}).map((_, i) => [1500 + random(`hx${i}`) * 1000, 520 + random(`hy${i}`) * 620] as [number, number]);
const Plains: React.FC = () => {
  const g = useGFrame();
  const b = at('Count') - 1;
  return (
    <AbsoluteFill>
      <WestMap keys={[{f: 0, x: 1980, y: 840, z: 0.62, tilt: 30, rot: -3}, {f: b, x: 2000, y: 820, z: 0.74, tilt: 38, rot: 1}]}>
        {(api) => <>
          <svg width={W_MAP.size[0]} height={W_MAP.size[1]} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', transform: 'translateZ(1px)'}}>
            {NORTH.map((k) => <path key={k} d={W_MAP.states[k]} fill="rgba(47,224,196,0.09)" stroke="#2FE0C4" strokeWidth={api.px(2.5)} opacity={interpolate(g, [6, 18], [0, 1], clamp)} />)}
          </svg>
          {HERD.map((p, i) => <MProp key={i} api={api} at={p} name="p2_longhorn" w={64} show={at('crowded') - 30 + i} />)}
          <MPin api={api} at={[1700, 560]} show={at('northern') - 2} label="Montana" />
          <MPin api={api} at={[2000, 980]} show={at('northern') + 2} label="Wyoming" />
          <MPin api={api} at={[2380, 700]} show={at('northern') + 6} label="Dakota" />
        </>}
      </WestMap>
      <SlapTitle text="THE 1880s" x={110} y={100} size={100} at={at('1880s')} seed={91} />
      <Note text="the northern plains: crowded" x={760} y={910} size={50} rot={-3} at={at('crowded') - 3} />
      <ScrimTag text={TAG.map} />
    </AbsoluteFill>
  );
};

// ───────────────────────── B / E / G · the three reasons, stacked ─────────────────────────

const REASONS: {n: string; text: string; sub: string; w: string}[] = [
  {n: '1', text: 'too many cattle', sub: 'money poured in; the herds outgrew the grass', w: 'too many'},
  {n: '2', text: 'a hot, dry summer', sub: '1886: thin grass, weak cattle', w: 'summer'},
  {n: '3', text: 'the winter', sub: 'storm after storm; January 1887', w: 'winter'},
];
const Reasons: React.FC<{upto: number; a: number; b: number; snow?: boolean}> = ({upto, a, b, snow}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  const hand = useHand();
  const g = useGFrame();
  const z = zkeys(f, [[a, 1.0], [b, 1.04]]);
  const ty = keys(f, [[a, 10], [b, -10]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `translateY(${ty}px) scale(${z})`, transformOrigin: '40% 50%'}}>
        <div style={{position: 'absolute', left: 200, top: 110, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: pal.mark}}>COUNT THE REASONS</div>
        {REASONS.map((r, i) => {
          const t = i < upto - 1 ? -99 : at(r.w) - 2;
          if (i >= upto) {
            return <div key={i} style={{position: 'absolute', left: 200, top: 190 + i * 250, width: 1460, height: 200, border: `2px dashed ${pal.mark}`, opacity: 0.25}} />;
          }
          return (
            <Slot key={i} at={i < upto - 1 ? -99 : (i === 0 ? at('One') : i === 1 ? at('Two') : at('Three')) - 1} y={190 + i * 250}>
              <div style={{position: 'absolute', left: 40, top: 22, fontFamily: JF.display, fontSize: 130, lineHeight: 1, color: pal.mark}}>{r.n}</div>
              {g >= t && <div style={{position: 'absolute', left: 170, top: 30, fontFamily: hand.family, fontSize: 80 * hand.scale, color: pal.mark, whiteSpace: 'nowrap',
                clipPath: `inset(-60% ${(1 - interpolate(g, [t, t + 12], [0, 1], clamp)) * 100}% -60% -5%)`}}>{r.text}</div>}
              {g >= t + 10 && <div style={{position: 'absolute', left: 176, top: 152, fontFamily: JF.mono, fontSize: 24, letterSpacing: 2, color: 'rgba(237,231,220,0.8)', whiteSpace: 'nowrap'}}>{r.sub.toUpperCase()}</div>}
            </Slot>
          );
        })}
      </AbsoluteFill>
      {snow && <Snow k={interpolate(g, [at('Storm') - 6, at('Storm') + 20], [0, 0.8], clamp)} n={90} wind={3} seed="r9" />}
    </AbsoluteFill>
  );
};
const Slot: React.FC<{at: number; y: number; children: React.ReactNode}> = ({at: a, y, children}) => {
  const s = useSlap(a, 1.15);
  const pal = usePal();
  if (!s.on) return null;
  return (
    <div style={{position: 'absolute', left: 200, top: y, width: 1460, height: 200, transform: `scale(${s.scale})`, transformOrigin: 'left center', opacity: s.opacity,
      background: 'radial-gradient(ellipse at 40% 30%, #36312a 0%, #221f1a 80%)', boxShadow: '12px 14px 0 #050403'}}>
      <div style={{position: 'absolute', inset: 7, border: `2px solid ${pal.mark}`, opacity: 0.8}} />
      {children}
    </div>
  );
};

// ───────────────────────── C · the investors ─────────────────────────

const Investors: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Investors') - 1;
  const b = at('The herds') - 1;
  const z = zkeys(f, [[a, 1.06], [b, 0.98]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '50% 45%'}}>
        <Label text="investors' money, 1880s" x={160} y={110} size={28} at={a + 2} />
        <Node x={160} y={220} w={460} h={140} label="THE EAST" sub="New York, Boston" at={at('East') - 1} />
        <Node x={730} y={220} w={460} h={140} label="BRITAIN" at={at('Britain') - 1} />
        <Node x={1300} y={220} w={460} h={140} label="SCOTLAND" at={at('Scotland') - 1} />
        <Wire pts={[[390, 370], [700, 690]]} at={at('poured') - 2} width={7} />
        <Wire pts={[[960, 370], [960, 680]]} at={at('poured')} width={7} />
        <Wire pts={[[1530, 370], [1220, 690]]} at={at('poured') + 2} width={7} />
        <Note text="poured money into" x={1000} y={480} size={50} rot={-3} at={at('poured') + 2} />
        <Node x={560} y={700} w={800} h={170} label="RANCHES ON THE OPEN RANGE" sub="Montana · Wyoming · Dakota" at={at('ranches') - 1} size={36} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────── D · faster than the grass ─────────────────────────

const Grass: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const a = at('The herds') - 1;
  const b = at('Two') - 1;
  const n = Math.max(0, Math.min(40, Math.floor((g - (a + 4)) / 1.6)));
  const box = {x: 260, y: 300, w: 760, h: 460};
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${zkeys(f, [[a, 1.0], [b, 0.94]])})`, transformOrigin: '40% 50%'}}>
        <div style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, border: `4px solid ${pal.mark}`, background: 'rgba(47,224,196,0.07)'}} />
        <div style={{position: 'absolute', left: box.x + 16, top: box.y + 14, fontFamily: JF.mono, fontSize: 26, letterSpacing: 3, color: pal.mark}}>THE GRASS</div>
        {Array.from({length: n}).map((_, i) => {
          const col = i % 8;
          const row = Math.floor(i / 8);
          return <Img key={i} src={staticFile(CUT('p2_longhorn'))} style={{position: 'absolute', left: box.x + 30 + col * 150 + (row % 2) * 40, top: box.y + 70 + row * 92, width: 120,
            filter: `${PROPF_QUIET} drop-shadow(4px 5px 0 #050403)`}} />;
        })}
        <Hand parts={[['the herds grew faster']]} x={1060} y={160} size={62} at={at('herds') - 2} />
        <Hand parts={[['than the grass.']]} x={1110} y={260} size={62} at={at('grass') - 3} />
      </AbsoluteFill>
      <ScrimTag text="Drawn · not to scale" />
    </AbsoluteFill>
  );
};

// ───────────────────────── F · thin grass, weak cattle ─────────────────────────

const Thin: React.FC = () => {
  const a = at('The grass came') - 1;
  return (
    <Pic src={I.range} size={Z.plate} filter={`${LITHO_QUIET} brightness(0.9)`} k={[[a, 600, 600, 1.35], [at('Three') - 1, 560, 640, 1.5]]}>
      {() => <Lines x={1060} y={130} size={60} gap={100} rows={[{text: 'the grass came in thin', at: at('thin') - 3}, {text: 'the cattle: already weak', at: at('weak') - 6}]} />}
    </Pic>
  );
};

// ───────────────────────── H · January 1887 ─────────────────────────

const Blizzard: React.FC = () => {
  const g = useGFrame();
  const a = at('Then in January') - 1;
  return (
    <AbsoluteFill>
      <Pic src={I.blizzard} size={Z.plate} filter={`${LITHO_QUIET} brightness(0.95)`} k={[[a, 1100, 560, 1.1], [at('The snow froze') - 1, 1250, 580, 1.25]]} />
      <Snow k={interpolate(g, [a, a + 10], [0.6, 1], clamp)} n={220} wind={5} seed="b9" size={1.2} />
      <SlapTitle text="JANUARY 1887" x={110} y={110} size={100} at={at('January')} seed={93} />
      <Note text="a blizzard that lasted for days" x={130} y={290} size={56} rot={-3} at={at('blizzard') - 2} />
    </AbsoluteFill>
  );
};

// ───────────────────────── I · the 3D slice: grass, snow, crust ─────────────────────────

const SL = 1200;
const SH = 440;
const CRUST = 104;
const CRUST_B = 134;
const GRASS = 352;
const DEPTH = 300;
const crackPts = Array.from({length: 9}).map((_, i) => [80 + i * 130 + random(`ck${i}`) * 50, -30 - random(`cy${i}`) * (DEPTH - 60)]);

const Hoof: React.FC<{press: number}> = ({press}) => {
  const pal = usePal();
  // the hoof's sole sits `press` px above the crust top (0 = touching); the leg rises out of frame
  const y = CRUST - 4 - press;
  return (
    <svg width={SL} height={SH} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', transform: 'scale(1.3)', transformOrigin: `852px ${CRUST}px`}}>
      {/* a cow's foreleg in side view, the cloven hoof flat on the crust */}
      <path d={`M832,${y - 170} L832,${y - 120} Q824,${y - 92} 832,${y - 62} L876,${y - 56} Q886,${y - 92} 870,${y - 120} L870,${y - 170}`} fill="rgba(20,26,26,0.92)" stroke={pal.mark} strokeWidth={4} strokeLinejoin="round" />
      <path d={`M832,${y - 62} L816,${y} L890,${y} L876,${y - 56} Z`} fill="#4c5658" stroke={pal.mark} strokeWidth={4} strokeLinejoin="round" />
      <line x1={854} y1={y - 58} x2={852} y2={y} stroke={pal.mark} strokeWidth={3} />
      <path d={`M816,${y} L890,${y}`} stroke="#c9d3d4" strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
};

const Slice: React.FC<{press: number; hit: number; grassAt: number; labels: number}> = ({press, hit, grassAt, labels}) => {
  const pal = usePal();
  const hand = useHand();
  const g = useGFrame();
  const face = (back: boolean) => (
    <svg width={SL} height={SH} style={{overflow: 'visible'}}>
      {/* snow */}
      <rect x={0} y={CRUST_B} width={SL} height={GRASS - CRUST_B} fill={back ? 'rgba(200,212,214,0.06)' : 'rgba(200,212,214,0.16)'} />
      {!back && Array.from({length: 140}).map((_, i) => <circle key={i} cx={10 + random(`sn${i}`) * (SL - 20)} cy={CRUST_B + 10 + random(`sy${i}`) * (GRASS - CRUST_B - 20)} r={1.6}
        fill="#dfe6e7" opacity={0.35} />)}
      {/* crust */}
      <rect x={0} y={CRUST} width={SL} height={CRUST_B - CRUST} fill={back ? 'rgba(170,190,194,0.15)' : 'rgba(170,190,194,0.55)'} stroke={pal.mark} strokeWidth={back ? 1.5 : 4} />
      {/* grass */}
      <rect x={0} y={GRASS} width={SL} height={SH - GRASS} fill={back ? 'rgba(20,40,34,0.3)' : 'rgba(20,46,38,0.85)'} />
      {!back && Array.from({length: 120}).map((_, i) => {
        const x = 6 + i * 10;
        const h = 18 + random(`gh${i}`) * 34;
        const lean = (random(`gl${i}`) - 0.5) * 14;
        return <path key={i} d={`M${x},${SH - 6} Q${x + lean / 2},${SH - h / 2} ${x + lean},${SH - h}`} fill="none" stroke={pal.mark} strokeWidth={2} opacity={0.75} />;
      })}
      <line x1={0} y1={SH} x2={SL} y2={SH} stroke={pal.mark} strokeWidth={3} opacity={0.6} />
      <rect x={0} y={CRUST} width={SL} height={SH - CRUST} fill="none" stroke={pal.mark} strokeWidth={back ? 1.5 : 3} opacity={back ? 0.4 : 0.9} />
    </svg>
  );
  return (
    <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d'}}>
      <div style={{position: 'absolute', left: -260, top: -620, width: SL + 520, height: 900,
        backgroundImage: 'linear-gradient(rgba(47,224,196,0.1) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(47,224,196,0.1) 1.5px, transparent 1.5px)',
        backgroundSize: '60px 60px', WebkitMaskImage: 'radial-gradient(ellipse at 50% 60%, #000 40%, transparent 72%)', maskImage: 'radial-gradient(ellipse at 50% 60%, #000 40%, transparent 72%)'}} />
      <Upright y={-DEPTH} w={SL} h={SH}>{face(true)}</Upright>
      {/* the crust's top surface */}
      <div style={{position: 'absolute', left: 0, top: -DEPTH, width: SL, height: DEPTH, transform: `translateZ(${SH - CRUST}px)`, background: 'rgba(214,224,226,0.28)',
        outline: `3px solid ${pal.mark}`}}>
        <svg width={SL} height={DEPTH} style={{position: 'absolute', left: 0, top: 0}}>
          {crackPts.map(([x, y], i) => <path key={i} d={`M${x},${y + DEPTH} l${18 + i * 2},-14 l12,10 l22,-18`} fill="none" stroke="#9fb3b8" strokeWidth={2} opacity={0.6} />)}
        </svg>
      </div>
      {/* the hoof, halfway back */}
      <Upright y={-70} w={SL} h={SH + 600}><div style={{position: 'absolute', left: 0, top: 600, width: SL, height: SH}}><Hoof press={press} /></div></Upright>
      <Upright y={0} w={SL} h={SH}>
        {face(false)}
        <svg width={SL} height={SH} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          {g >= hit && [[-30, -12], [-12, -22], [10, -24], [30, -14]].map(([dx, dy], i) => (
            <path key={i} d={`M${852 + dx * 0.4},${CRUST} l${dx},${dy}`} stroke={pal.mark} strokeWidth={3} opacity={interpolate(g, [hit, hit + 3, hit + 14], [0, 1, 0.5], clamp)} />
          ))}
          {g >= grassAt && <path d={`M852,${CRUST_B + 16} L852,${GRASS - 18}`} stroke={pal.mark} strokeWidth={4} strokeDasharray="12 10" opacity={0.8} />}
          {g >= grassAt + 8 && <path d={`M836,${GRASS - 40} l32,26 M868,${GRASS - 40} l-32,26`} stroke="#c9d3d4" strokeWidth={5} strokeLinecap="round" />}
        </svg>
        <div style={{position: 'absolute', left: 30, top: CRUST - 52, fontFamily: JF.mono, fontSize: 24, letterSpacing: 3, color: '#e6ecec', whiteSpace: 'nowrap', opacity: labels,
          textShadow: '0 0 2px #111, 2px 2px 0 #111'}}>HARD CRUST</div>
        <div style={{position: 'absolute', left: 30, top: CRUST_B + 70, fontFamily: JF.mono, fontSize: 24, letterSpacing: 3, color: '#e6ecec', whiteSpace: 'nowrap', opacity: labels,
          textShadow: '0 0 2px #111, 2px 2px 0 #111'}}>DEEP SNOW</div>
        {g >= grassAt && <div style={{position: 'absolute', left: 360, top: GRASS - 6, fontFamily: hand.family, fontSize: 56 * hand.scale, color: pal.mark, whiteSpace: 'nowrap',
          clipPath: `inset(-60% ${(1 - interpolate(g, [grassAt, grassAt + 10], [0, 1], clamp)) * 100}% -60% -5%)`, textShadow: '0 0 2px #111, 2px 2px 0 #111, -2px 2px 0 #111'}}>grass</div>}
      </Upright>
    </div>
  );
};

const Crust: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const a = at('The snow froze') - 1;
  const b = at('They drifted') - 1;
  const d0 = at("couldn't dig") - 6;
  // two presses: down, stop on the crust; lift a little; down again, stop
  const press = interpolate(g, [a, d0, d0 + 8, d0 + 18, d0 + 26, d0 + 34], [180, 120, 0, 40, 0, 0], clamp);
  return (
    <AbsoluteFill>
      <Stage w={SL} fx={keys(f, [[a, 520], [b, 640]])} fy={-DEPTH / 2} tilt={keys(f, [[a, 64], [b, 58]])} spin={keys(f, [[a, -26], [b, -12]])} z={zkeys(f, [[a, 0.96], [b, 1.06]])} dy={120}>
        <Slice press={press} hit={d0 + 8} grassAt={at('grass underneath') - 2} labels={interpolate(g, [at('crust') - 4, at('crust') + 6], [0, 1], clamp)} />
      </Stage>
      <Snow k={0.35} n={60} wind={2.5} seed="c9" />
      <Note text="the snow froze into a hard crust" x={110} y={110} size={56} rot={-2} at={at('froze') - 2} />
      <Note text="they couldn't dig through it" x={130} y={210} size={52} rot={-3} at={at("couldn't dig") - 2} />
      <ScrimTag text="Drawn · not to scale" />
    </AbsoluteFill>
  );
};

// ───────────────────────── J · drifted into a fence, and stopped ─────────────────────────

const DRIFT_BOX: [number, number, number, number] = [140, 330, 2920, 2140];
const DriftPainting: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('They drifted') - 1;
  const b = at('until') - 1;
  const c = insideBox(DRIFT_BOX, keys(f, [[a, 1300], [b, 1050]]), keys(f, [[a, 1200], [b, 1150]]), zkeys(f, [[a, 0.75], [b, 0.82]]));
  return (
    <AbsoluteFill>
      <PhotoCam src={I.drift} size={Z.drift} cx={c.cx} cy={c.cy} s={c.s} bw="grayscale(1) contrast(1.2) brightness(0.92)" />
      <Note text="they drifted with the wind" x={1080} y={880} size={56} rot={-3} at={at('drifted') - 2} />
      <ScrimTag text={TAG.drift} x={34} y={24} />
    </AbsoluteFill>
  );
};
const Drift: React.FC = () => {
  const a = at('until') - 1;
  const b = at('In the spring') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 18, 0.96, 30, 0, -1], [b, 14, 1.06, 0, 0, 0]]}>
        <Float x={1020} y={150} w={440} hgt={820} h={8} at={-99} rot={-2} seed={92}>
          <Prop src={PROP('p9_post_drift')} m={M9.p9_post_drift} x={0} y={0} w={430} at={-99} filter={PROPF_QUIET} />
        </Float>
      </DeskCam>
      {[0, 1, 2, 3].map((i) => <Wire key={i} pts={[[150, 300 + i * 120], [520 + i * 30, 330 + i * 120]]} at={a + 2 + i * 2} width={4} />)}
      <Lines x={150} y={790} size={56} gap={84} rows={[{text: 'until they hit a fence,', at: at('fence') - 3}, {text: 'or a ravine.', at: at('ravine') - 3}]} />
    </AbsoluteFill>
  );
};

// ───────────────────────── K · the creeks were full of dead cattle (held, no marks) ─────────────────────────

const Dead: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('In the spring') - 1;
  const b = at('Cowboys called') - 1;
  const c = insideBox(HARP_BOX, keys(f, [[a, 1300], [b, 1250]]), keys(f, [[a, 1350], [b, 1420]]), zkeys(f, [[a, 1.15], [b, 1.32]]));
  return (
    <AbsoluteFill>
      <PhotoCam src={I.harpers} size={Z.harpers} cx={c.cx} cy={c.cy} s={c.s} bw="grayscale(1) contrast(1.15) brightness(0.92)" vignette={0.7} />
      <ScrimTag text={TAG.harpers} />
    </AbsoluteFill>
  );
};

// ───────────────────────── L · the Big Die-Up ─────────────────────────

const DieUp: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Cowboys called') - 1;
  const b = at('Nobody') - 1;
  const c = insideBox(HARP_BOX, keys(f, [[a, 1500], [b, 1550]]), 1300, 0.9);
  return (
    <AbsoluteFill>
      <PhotoCam src={I.harpers} size={Z.harpers} cx={c.cx} cy={c.cy} s={c.s} bw="grayscale(1) contrast(1.1) brightness(0.38)" vignette={0.7} />
      <SlapTitle text="THE BIG DIE-UP" x={110} y={150} size={120} at={at('Big DieUp') - 1} seed={95} />
      <Definition term="Big Die-Up" def="cowboys' name for the winter of 1886–87, when cattle froze and starved on the northern range" at={at('Big DieUp') + 8} x={110} y={380} w={1300} />
      <ScrimTag text={TAG.harpers} />
    </AbsoluteFill>
  );
};

// ───────────────────────── M–N · how many ─────────────────────────

const Nobody: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Nobody') - 1;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `translateX(${keys(f, [[a, 20], [at('In Montana') - 1, -20]])}px)`}}>
        <Hand parts={[['nobody knows exactly']]} x={260} y={360} size={100} at={a + 2} />
        <Hand parts={[['how many died.']]} x={360} y={510} size={100} at={at('how many') - 3} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const Half: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const a = at('In Montana') - 1;
  const b = at('One of the ranchers') - 1;
  const h0 = at('more than half') - 2;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${zkeys(f, [[a, 0.98], [b, 1.05]])})`, transformOrigin: '45% 50%'}}>
        <Label text="Montana · cattle on the open range, winter 1886–87" x={280} y={150} size={30} at={a + 2} />
        {Array.from({length: 20}).map((_, i) => {
          const col = i % 10;
          const row = Math.floor(i / 10);
          if (g < a + 4 + i * 0.6) return null;
          const gone = i < 11 && g >= h0 + i;
          return (
            <div key={i} style={{position: 'absolute', left: 280 + col * 140, top: 250 + row * 160, width: 130, height: 110}}>
              <Img src={staticFile(CUT('p2_longhorn'))} style={{width: 130, opacity: gone ? 0.16 : 1, filter: `${PROPF_QUIET} drop-shadow(4px 5px 0 #050403)`}} />
              {gone && <div style={{position: 'absolute', left: 6, right: 6, top: 96, height: 3, background: pal.mark, opacity: 0.8}} />}
            </div>
          );
        })}
        <Hand parts={[['some estimates: '], ['more than half', true]]} x={280} y={660} size={84} at={at('some estimates') - 2} />
      </AbsoluteFill>
      <ScrimTag text="Estimates vary widely; one figure = one in twenty, illustrative" />
    </AbsoluteFill>
  );
};

// ───────────────────────── O–Q · Roosevelt ─────────────────────────

const Dakota: React.FC = () => {
  const a = at('One of the ranchers') - 1;
  const b = at('Theodore') - 1;
  return (
    <AbsoluteFill>
      <WestMap keys={[{f: a, x: 2150, y: 640, z: 0.8, tilt: 36, rot: -3}, {f: b, x: 2180, y: 560, z: 1.15, tilt: 32, rot: 0}]}>
        {(api) => <>
          <svg width={W_MAP.size[0]} height={W_MAP.size[1]} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', transform: 'translateZ(1px)'}}>
            {['USA:North Dakota', 'USA:South Dakota'].map((k) => <path key={k} d={W_MAP.states[k]} fill="rgba(47,224,196,0.08)" stroke="#2FE0C4" strokeWidth={api.px(2.5)} />)}
          </svg>
          <MPin api={api} at={TPL.medora} show={at('ranches', 2) + 2} label="his ranches" sub="NEAR MEDORA, DAKOTA TERRITORY" />
        </>}
      </WestMap>
      <Note text="one of the ranchers who lost a fortune" x={110} y={110} size={54} rot={-2} at={at('lost a fortune') - 3} />
      <Note text="a young New Yorker" x={130} y={210} size={54} rot={-2} color="#f4efe6" at={at('New Yorker') - 3} />
      <ScrimTag text={TAG.map} />
    </AbsoluteFill>
  );
};
const RooseveltDesk: React.FC<{quote: boolean}> = ({quote}) => {
  const f = useCurrentFrame();
  const a = quote ? at('That spring') - 1 : at('Theodore') - 1;
  const b = quote ? at("That's the winter") - 1 : at('That spring') - 1;
  return (
    <DeskShot tilt={keys(f, [[a, quote ? 12 : 22], [b, quote ? 16 : 14]])} z={zkeys(f, [[a, quote ? 1.02 : 0.92], [b, quote ? 1.06 : 1.0]])} x={keys(f, [[a, quote ? -10 : 20], [b, quote ? -40 : 0]])}
      hits={quote ? [] : [a + 5]} lamp={[1300, 460]}
      over={<>
        {!quote && <Label text="Theodore Roosevelt, 1885" x={140} y={400} size={34} at={a + 6} />}
        {!quote && <Note text="ranching in Dakota Territory" x={140} y={480} size={54} rot={-3} at={a + 12} />}
        {quote && <Quote text="The losses are crippling." at={at('The losses') - 2} x={110} y={360} w={1000} size={84} who="Theodore Roosevelt to Henry Cabot Lodge, April 1887" />}
        {quote && <Note text="that spring, he wrote to a friend" x={110} y={200} size={50} rot={-2} at={a + 3} />}
        <ScrimTag text={TAG.roosevelt} />
      </>}>
      <Bust src={I.roosevelt} size={Z.roosevelt} mask={M9.b9_roosevelt} x={1160} y={160} w={640} cutY={1150} at={quote ? -99 : a + 2} rot={2} seed={93}
        filter={quote ? 'grayscale(1) contrast(1.15) brightness(0.75)' : undefined} />
    </DeskShot>
  );
};

// ───────────────────────── R · Russell's painting ─────────────────────────

const Painted: React.FC = () => {
  const a = at("That's the winter") - 1;
  return (
    <Pic src={I.paint} size={Z.paint} filter={PBW} k={[[a, 1700, 1200, 0.52], [at('What came after') - 1, 1600, 1180, 0.56]]} tag={TAG.paint}>
      {() => <Note text="the winter Charlie Russell painted" x={840} y={110} size={48} rot={-2} at={at('Charlie') - 3} />}
    </Pic>
  );
};

// ───────────────────────── S–U · a different kind of ranching ─────────────────────────

const Different: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('What came after') - 1;
  const b = at('Hay') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 22, 0.94, 0, 0, -2], [b, 16, 1.02, -20, 0, 0]]}>
        <Float x={1250} y={320} w={620} hgt={420} h={10} at={a + 3} rot={3} blur={1.4} seed={94}>
          <Prop src={PROP('p9_haystack')} m={M9.p9_haystack} x={0} y={0} w={600} at={-99} filter={PROPF_QUIET} />
        </Float>
      </DeskCam>
      <Note text="a different kind of ranching" x={140} y={180} size={60} rot={-3} at={at('different') - 2} />
      <Lines x={170} y={360} size={84} gap={140} rows={[{text: '· smaller herds', at: at('Smaller') - 2}, {text: '· fenced pastures', at: at('Fenced') - 2}]} />
    </AbsoluteFill>
  );
};
const Hay: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Hay') - 1;
  const b = at('Cattle ranching') - 1;
  return (
    <AbsoluteFill>
      <PhotoCam src={I.hay} size={Z.hay} cx={keys(f, [[a, 700], [b, 820]])} cy={keys(f, [[a, 520], [b, 500]])} s={zkeys(f, [[a, 1.32], [b, 1.42]])} bw="grayscale(1) contrast(1.2) brightness(0.95)" />
      <Note text="hay: cut in the summer," x={110} y={110} size={58} rot={-3} at={a + 2} />
      <Note text="stored for the winter" x={150} y={210} size={58} rot={-3} color="#f4efe6" at={at('stored') - 2} />
      <ScrimTag text={TAG.hay} />
    </AbsoluteFill>
  );
};
const Survived: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Cattle ranching') - 1;
  const b = at('The open range was') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 14, 1.06, 0, 0, 1], [b, 22, 0.94, 0, 10, 0]]}>
        <Float x={320} y={300} w={760} hgt={520} h={10} at={a + 2} rot={-3} seed={95}>
          <Prop src={PROP('p9_haystack')} m={M9.p9_haystack} x={0} y={0} w={740} at={-99} filter={PROPF_QUIET} />
        </Float>
        <Float x={1100} y={460} w={760} hgt={420} h={16} at={a + 6} rot={4} seed={96}>
          <Prop src={PROP('p9_hay_rake')} m={M9.p9_hay_rake} x={0} y={0} w={740} at={-99} filter={PROPF_QUIET} />
        </Float>
      </DeskCam>
      <Note text="cattle ranching survived" x={140} y={130} size={60} rot={-3} at={at('survived') - 3} />
      <Note text="as a business" x={180} y={230} size={60} rot={-3} color="#f4efe6" at={at('business') - 3} />
    </AbsoluteFill>
  );
};

// ───────────────────────── V–W · over; back to the question ─────────────────────────

const Over: React.FC = () => {
  const a = at('The open range was') - 1;
  return (
    <Pic src={I.range} size={Z.plate} filter={`${LITHO_QUIET} brightness(0.8)`} k={[[a, 1300, 560, 1.15], [at('So lets go') - 1, 1240, 560, 1.22]]}>
      {() => <Hand parts={[['the open range was '], ['over.', true]]} x={130} y={140} size={100} at={at('over') - 6} />}
    </Pic>
  );
};
const BackToQ: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('So lets go') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 24, 0.86, 0, 0, -2], [END, 18, 0.92, 0, 20, 0]]}>
        <Lift x={260} y={170} w={1350} hgt={1350 * (Z.paint[1] / Z.paint[0])} h={8} at={a + 2} rot={-2} seed={97}>
          <TornPrint src={I.paint} size={Z.paint} x={0} y={0} w={1350} at={-99} seed={98} real grey shadow={5} filter={PBW}
            tapes={[{x: -40, y: 20, w: 160, rot: -36}, {x: 1230, y: -8, w: 160, rot: 28}]} />
        </Lift>
      </DeskCam>
      <Note text="back to the question" x={1260} y={110} size={54} rot={-3} at={at('question') - 4} />
      <ScrimTag text={TAG.paint} />
    </AbsoluteFill>
  );
};

// ───────────────────────── assembly ─────────────────────────

const c = (w: string, n = 1) => at(w, n) - 1;
const SHOTS: [number, React.ReactNode, ('whip' | 'cut')?][] = [
  [0, <Plains />],
  [c('Count'), <Reasons upto={1} a={c('Count')} b={c('Investors')} />, 'whip'],
  [c('Investors'), <Investors />, 'cut'],
  [c('The herds'), <Grass />, 'cut'],
  [c('Two'), <Reasons upto={2} a={c('Two')} b={c('The grass came')} />, 'whip'],
  [c('The grass came'), <Thin />, 'cut'],
  [c('Three'), <Reasons upto={3} a={c('Three')} b={c('Then in January')} snow />, 'whip'],
  [c('Then in January'), <Blizzard />, 'cut'],
  [c('The snow froze'), <Crust />, 'whip'],
  [c('They drifted'), <DriftPainting />, 'cut'],
  [c('until'), <Drift />, 'cut'],
  [c('In the spring'), <Dead />, 'whip'],
  [c('Cowboys called'), <DieUp />, 'cut'],
  [c('Nobody'), <Nobody />, 'cut'],
  [c('In Montana'), <Half />, 'cut'],
  [c('One of the ranchers'), <Dakota />, 'whip'],
  [c('Theodore'), <RooseveltDesk quote={false} />, 'cut'],
  [c('That spring'), <RooseveltDesk quote />, 'cut'],
  [c("That's the winter"), <Painted />, 'whip'],
  [c('What came after'), <Different />, 'whip'],
  [c('Hay'), <Hay />, 'cut'],
  [c('Cattle ranching'), <Survived />, 'cut'],
  [c('The open range was'), <Over />, 'cut'],
  [c('So lets go'), <BackToQ />, 'whip'],
];

// quiet: fewer, softer sounds; titles still stamp (softer), notes still tick
const tick = (w: string, d = 2, n = 1): [number, string, number] => [at(w, n) - d, 'marker_tick', 0.16];
const SFX: [number, string, number][] = [
  ...SHOTS.slice(1).map(([s, , k]): [number, string, number] => (k === 'whip' ? [s - 4, 'whip_soft', 0.18] : [s, 'whoosh', 0.12])),
  [at('1880s'), 'stamp', 0.16], tick('crowded', 5),
  [at('One') - 1, 'card_slide_soft', 0.14], tick('too many', 4),
  [at('East') - 1, 'card_slide_soft', 0.12], [at('Britain') - 1, 'card_slide_soft', 0.12], [at('Scotland') - 1, 'card_slide_soft', 0.12], tick('poured', 2), [at('ranches') - 1, 'card_slide_soft', 0.12],
  tick('herds', 4), tick('grass', 5),
  [at('Two') - 1, 'card_slide_soft', 0.14], tick('summer', 4), tick('thin', 5), tick('weak', 8),
  [at('Three') - 1, 'card_slide_soft', 0.14], tick('winter', 4),
  [at('January'), 'stamp', 0.16], tick('blizzard', 4),
  tick('froze', 4), [at("couldn't dig") + 2, 'block_tap_soft', 0.1], [at("couldn't dig") + 20, 'block_tap_soft', 0.08], tick('grass underneath', 4),
  tick('drifted', 4), tick('fence', 5), tick('ravine', 5),
  [at('Big DieUp') - 1, 'stamp', 0.16],
  tick('Nobody', 0), tick('how many', 5),
  tick('some estimates', 4),
  tick('lost a fortune', 5), tick('New Yorker', 5), [at('ranches', 2) + 2, 'block_tap_soft', 0.1],
  [at('Theodore') + 1, 'paper_slap_soft', 0.18], tick('Theodore', -4),
  tick('That spring', -1), tick('Charlie', 5),
  tick('different', 4), tick('Smaller', 4), tick('Fenced', 4), tick('Hay', -1), tick('stored', 4),
  tick('survived', 5), tick('business', 5), tick('over', 8),
  [at('So lets go') + 2, 'paper_slap_soft', 0.18], tick('question', 6),
];

const Body: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <WShots shots={SHOTS} />
    <Sounds list={SFX} />
  </AbsoluteFill>
);

export const Ch09: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch09_the_big_die_up.wav" lead={LEAD} quiet music={[
    // aw_white_cold (Suno) from 80 s in (ch01 uses its first ~75 s), at the grave bed gap (14 LU under the voice)
    {src: 'music/aw_white_cold.mp3', volume: bed('aw_white_cold', 14), startFrom: 30 * 80},
  ]}>
    <Quiet>
      <Body />
    </Quiet>
  </ChapterShell>
);
