// Chapter 8 · Cheap as Dirt (86.0 s).
// Glidden's 1874 patent, the barbed wire built in 3D (two strands twist together as the camera turns, then a barb wraps
// around both: ThreeCanvas, drawn style, iron grey with teal outlines), Gates's corral and pitch (the flat p8_barb hero shot
// carries "cheap as dirt"), the two ways to see who fenced, the wire cutters, the range wars, and the hand-off to the winter.
// Shot list (narration words → shot):
//  A "In 1874, the same year as the gold,"       desk: the gold nugget (from ch06) blurred, 1874
//  B "a farmer in DeKalb, Illinois,"            series map: from the Black Hills east to DeKalb (pin, far east)
//  C "named Joseph Glidden got a patent…"        the Washburn & Moen / Ellwood poster: Glidden's portrait (coral), DE KALB, ILL.
//  D "Look at the drawing. Two wires twisted…"   3D: two strands twisting as the camera turns; the patent drawing lands beside
//  E "And every few inches, a short, sharp barb" 3D close: a barb wraps around both strands (coral outline); the drawing's Fig. III
//  F "wrapped on tight…{barbed wire}"            3D pull back: barbs every few inches along the wire; definition
//  G "The Plains had almost no trees…"           lithograph plains (no trees), the note
//  H "Wire was cheap, light and fast to put up." desk: the wire spool, three words
//  I "A young salesman named John Gates"         Gates portrait (coral) on the desk
//  J "built a corral…San Antonio…longhorns"      drawn corral on the desk (teal wire), three longhorns land inside
//  K "…try to break out. They couldn't."         push: the longhorns bump the wire; "they couldn't."
//  L "And the way the story's told, his pitch"   Gates print, "(the way the story's told)"
//  M "Light as air, stronger than whiskey, and cheap as dirt." the p8_barb hero shot over the blurred fenced-range plate, three orange tapes
//  N "So who fenced? There are two ways to see it." the two-views card, wide
//  O "Farmers fenced…they had a point."          push left
//  P "Big ranchers fenced too…around the water." push right (the water coral)
//  Q "And the small ranchers…found it closed."   lithograph: the fence across the range, "found it closed"
//  R "So some of them got out wire cutters."     desk: the nippers (coral) snap
//  S "In 1883…mostly at night."                  map of Texas at night: cut marks spread across the state; 1883
//  T "The range wars had begun."                 RANGE WARS + definition over the dark plate
//  U "In 1884, Texas made fence cutting a prison crime." 1884, the law as a mono strip, the nippers struck
//  V "That means…one battle."                    handwriting
//  W "It ended one fence post at a time."        drawn fence posts step in one at a time
//  X "But the fences changed the range slowly."  the fenced-range plate, slow push
//  Y "The weather did it in one winter."         the plate darkens, the first snow drifts in
import React, {useMemo} from 'react';
import {bed} from '../kit/levels';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import words from '../../public/audio/ch08_cheap_as_dirt.words.json';
import {clamp} from '../lib/anim';
import {Loop, Note, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration} from '../kit/shell';
import {DocFocus, keys, Mono, PhotoCam, ScrimTag, shake, SlapTitle, zkeys} from '../kit/west';
import {DeskCam, Float, Label, LITHO, Lines, Pic, Prop} from '../kit/ch04_extra';
import {DeskShot, Hand, Print, Sounds, WShots} from '../kit/ch07_extra';
import {MCross, MPin, MRegion, W_MAP, WestMap} from '../kit/ch01_extra';
import {TPL, TREGIONS} from '../kit/trails';
import {PROP, Snow} from '../kit/ch07_10_extra';
import {M8} from '../masks_ch08';

const N = words as Narration;
export const CH08_FRAMES = chapterFrames(N, LEAD);
const T = makeTimeline(N, 30);
const at = T.at;
const END = T.frames + 60;

const I = {
  poster: 'img/ch08/glidden_barb_wire_poster_c1877.jpg',
  patent: 'img/ch08/b_glidden_patent_1874.jpg',
  gates: 'img/ch08/b_gates_engraving.jpg',
  range: 'img/props/L8_fenced_range.jpg',
};
const Z = {
  poster: [1186, 1536] as [number, number],
  patent: [1920, 2814] as [number, number],
  gates: [1920, 2591] as [number, number],
  range: [1920, 1080] as [number, number],
};
const TAG = {
  poster: 'Advertising poster for Glidden Steel Barb Fence Wire, Washburn & Moen / I. L. Ellwood & Co., c. 1877 · Library of Congress',
  patent: 'J. F. Glidden, Wire-Fences, U.S. Patent No. 157,124, Nov. 24, 1874 · National Archives (via Wikimedia Commons)',
  gates: "John W. Gates, engraving, Appletons' Cyclopædia of American Biography · via Wikimedia Commons",
};

// ───────────────────────── the wire in 3D ─────────────────────────

const IRON = '#8d9598';
const TEAL = '#2FE0C4';
const CORAL = '#FF6F61';
const R_STRAND = 0.032;
const R_TWIST = 0.055;
const LAY = 0.62; // length of one full twist

/** Camera at (yaw, pitch, dist) around `look`. */
const Cam: React.FC<{yaw: number; pitch: number; dist: number; look: [number, number, number]}> = ({yaw, pitch, dist, look}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.set(look[0] + Math.sin(yaw) * Math.cos(pitch) * dist, look[1] + Math.sin(pitch) * dist, look[2] + Math.cos(yaw) * Math.cos(pitch) * dist);
  if (camera.fov !== 30) {
    camera.fov = 30;
    camera.updateProjectionMatrix();
  }
  camera.lookAt(look[0], look[1], look[2]);
  return null;
};

/** A drawn tube: flat-shaded iron with a teal (or coral) back-face outline. */
const Tube: React.FC<{pts: THREE.Vector3[]; r: number; color?: string; line?: string; seg?: number}> = ({pts, r, color = IRON, line = TEAL, seg = 300}) => {
  const [geo, out] = useMemo(() => {
    if (pts.length < 2) return [null, null];
    const curve = new THREE.CatmullRomCurve3(pts);
    return [new THREE.TubeGeometry(curve, seg, r, 7, false), new THREE.TubeGeometry(curve, seg, r + 0.013, 7, false)];
  }, [pts, r, seg]);
  if (!geo || !out) return null;
  return (
    <>
      <mesh geometry={out}><meshBasicMaterial color={line} side={THREE.BackSide} /></mesh>
      <mesh geometry={geo}><meshLambertMaterial color={color} flatShading /></mesh>
    </>
  );
};

/** A sharp point at `p`, pointing along `dir`. */
const Tip: React.FC<{p: THREE.Vector3; dir: THREE.Vector3; r: number; line: string}> = ({p, dir, r, line}) => {
  const q = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()), [dir]);
  const h = 0.11;
  const pos = p.clone().add(dir.clone().normalize().multiplyScalar(h / 2));
  return (
    <group position={pos} quaternion={q}>
      <mesh><coneGeometry args={[r + 0.013, h + 0.03, 7]} /><meshBasicMaterial color={line} side={THREE.BackSide} /></mesh>
      <mesh><coneGeometry args={[r, h, 7]} /><meshLambertMaterial color={IRON} flatShading /></mesh>
    </group>
  );
};

const strandPts = (i: number, twist: number, span: number) => {
  const pts: THREE.Vector3[] = [];
  for (let x = -span; x <= span + 1e-6; x += 0.03) {
    const a = i * Math.PI + (twist * x * 2 * Math.PI) / LAY;
    pts.push(new THREE.Vector3(x, R_TWIST * Math.cos(a), R_TWIST * Math.sin(a)));
  }
  return pts;
};

/** The barb's path: a point up, a coil of 1.5 turns around both strands, a point down. */
const barbPath = (x0: number) => {
  const R = 0.11;
  const pts: THREE.Vector3[] = [new THREE.Vector3(x0 - 0.03, 0.4, 0.05), new THREE.Vector3(x0 - 0.05, 0.2, 0.03)];
  const n = 26;
  for (let k = 0; k <= n; k++) {
    const a = (k / n) * 3 * Math.PI;
    pts.push(new THREE.Vector3(x0 - 0.05 + (0.1 * k) / n, R * Math.cos(a), R * Math.sin(a)));
  }
  pts.push(new THREE.Vector3(x0 + 0.05, -0.2, -0.03), new THREE.Vector3(x0 + 0.03, -0.4, -0.05));
  return pts;
};

const Barb: React.FC<{x: number; p: number; hot?: boolean}> = ({x, p, hot}) => {
  const all = useMemo(() => barbPath(x), [x]);
  const k = Math.max(2, Math.round(2 + (all.length - 2) * p));
  const pts = useMemo(() => all.slice(0, k), [all, k]);
  if (p <= 0) return null;
  const line = hot ? CORAL : TEAL;
  const d0 = all[0].clone().sub(all[1]);
  const n = all.length;
  const d1 = all[n - 1].clone().sub(all[n - 2]);
  return (
    <>
      <Tube pts={pts} r={0.022} color="#a4abad" line={line} seg={120} />
      <Tip p={all[0]} dir={d0} r={0.022} line={line} />
      {p >= 0.999 && <Tip p={all[n - 1]} dir={d1} r={0.022} line={line} />}
    </>
  );
};

const Wire3D: React.FC<{twist: number; barbs: {x: number; p: number; hot?: boolean}[]; yaw: number; pitch: number; dist: number; look?: [number, number, number]; span?: number}> = ({
  twist, barbs, yaw, pitch, dist, look = [0, 0, 0], span = 4,
}) => {
  const {width, height} = useVideoConfig();
  const tw = Math.round(twist * 100) / 100;
  const a = useMemo(() => strandPts(0, tw, span), [tw, span]);
  const b = useMemo(() => strandPts(1, tw, span), [tw, span]);
  return (
    <AbsoluteFill>
      <ThreeCanvas width={width} height={height} camera={{fov: 30, near: 0.05, far: 100}} gl={{antialias: true}} flat linear={false}>
        <Cam yaw={yaw} pitch={pitch} dist={dist} look={look} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[-2, 3, 4]} intensity={1.8} />
        <gridHelper args={[14, 56, TEAL, TEAL]} position={[0, -0.75, 0]} material-transparent material-opacity={0.13} />
        <Tube pts={a} r={R_STRAND} seg={600} />
        <Tube pts={b} r={R_STRAND} seg={600} />
        {barbs.map((br, i) => <Barb key={i} {...br} />)}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

/** The 3D wire over the dark desk paper, with a lamp pool. */
const WireStage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <DarkPaper />
    <AbsoluteFill style={{background: 'radial-gradient(circle 820px at 760px 520px, rgba(255,214,160,0.16) 0%, transparent 100%)'}} />
    {children}
  </AbsoluteFill>
);

// ───────────────────────── shots ─────────────────────────

// A · 1874, the same year as the gold
const Year: React.FC = () => {
  const f = useCurrentFrame();
  const b = at('a farmer') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[0, 18, 1.08, 0, 0, 2], [b, 22, 0.98, 0, 0, 0]]}>
        <Float x={1100} y={330} w={560} hgt={600} h={20} at={-99} rot={8} blur={2.2} seed={81}>
          <Prop src={PROP('p6_nugget')} m={M8.p6_nugget} x={0} y={0} w={520} at={-99} />
        </Float>
      </DeskCam>
      <SlapTitle text="1874" x={140} y={260} size={190} at={at('1874')} seed={81} />
      <Note text="the same year as the gold" x={160} y={560} size={60} rot={-3} at={at('same year') - 2} />
    </AbsoluteFill>
  );
};

// B · DeKalb, Illinois, far east of the Black Hills
const DeKalb: React.FC = () => {
  const a = at('a farmer') - 1;
  const b = at('Joseph') - 1;
  return (
    <AbsoluteFill>
      <WestMap keys={[{f: a, x: 2350, y: 860, z: 0.62, tilt: 34}, {f: b, x: 3150, y: 930, z: 0.85, tilt: 30}]}>
        {(api) => <>
          <MRegion api={api} pts={TREGIONS.blackHills} at={-99} />
          <MPin api={api} at={TPL.dekalb} show={at('DeKalb') - 2} label="DeKalb, Illinois" sub="A FARMER'S TOWN" side="l" />
        </>}
      </WestMap>
      <ScrimTag text="Map: drawn for the series; places approx." />
    </AbsoluteFill>
  );
};

// C · Joseph Glidden: his portrait from the barb-wire poster (the oval) lands on the desk, coral
const Glidden: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Joseph') - 1;
  const b = at('Look at') - 1;
  return (
    <DeskShot tilt={keys(f, [[a, 22], [b, 14]])} z={zkeys(f, [[a, 0.94], [b, 1.03]])} x={keys(f, [[a, -20], [b, 20]])} hits={[a + 5]} lamp={[1250, 460]}
      over={<>
        <Note text="Joseph Glidden" x={110} y={250} size={76} rot={-3} color="#FF6F61" at={at('Glidden') - 3} />
        <Mono text="PATENT · NOV. 24, 1874" x={130} y={420} size={30} at={at('patent') - 1} />
        <Note text="for a new kind of fence" x={130} y={520} size={58} rot={-3} at={at('new kind') - 2} />
        <ScrimTag text={TAG.poster} />
      </>}>
      <Print src={I.poster} size={Z.poster} x={1000} y={-20} w={760} crop={[200, 230, 990, 1180]} at={a + 2} rot={2} seed={81} mask={M8.b_glidden_poster} tint={0.22} traceAt={at('Glidden') - 1} />
    </DeskShot>
  );
};

// D · the drawing; two wires twisted together (3D, the camera turning)
const Twist: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Look at') - 1;
  const b = at('And every') - 1;
  const tw = interpolate(f, [at('Two wires') + 4, at('together') + 6], [0, 1], {...clamp, easing: (t) => t * t * (3 - 2 * t)});
  return (
    <WireStage>
      <AbsoluteFill style={{left: -280}}>
        <Wire3D twist={tw} barbs={[]} yaw={keys(f, [[a, 0.55], [b, -0.25]])} pitch={keys(f, [[a, 0.32], [b, 0.18]])} dist={keys(f, [[a, 7.2], [b, 5.4]])} />
      </AbsoluteFill>
      <DocFocus src={I.patent} size={Z.patent} x={1290} y={110} w={560} h={820} sx0={300} sy0={330} scale={0.43} rot={2} at={a + 2} band={[1100, 1940]} pullAt={1e7} seed={8} />
      <Note text="the patent drawing" x={1320} y={950} size={46} rot={-3} at={a + 8} />
      <Lines x={110} y={110} size={64} rows={[{text: 'two wires', at: at('Two wires') - 2}, {text: 'twisted together', at: at('twisted') - 2}]} />
      <ScrimTag text={`Wire: drawn  ·  ${TAG.patent}`} />
    </WireStage>
  );
};

// E · a short, sharp barb wraps around both strands (close)
const BarbWrap: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('And every') - 1;
  const b = at('wrapped') - 1;
  const p = interpolate(f, [at('short') - 4, at('barb') + 10], [0, 1], clamp);
  return (
    <WireStage>
      <AbsoluteFill style={{left: -260}}>
        <Wire3D twist={1} barbs={[{x: 0, p, hot: true}]} yaw={keys(f, [[a, -0.3], [b, 0.5]])} pitch={keys(f, [[a, 0.22], [b, 0.3]])} dist={keys(f, [[a, 3.2], [b, 2.3]])} />
      </AbsoluteFill>
      <DocFocus src={I.patent} size={Z.patent} x={1300} y={150} w={540} h={560} sx0={1140} sy0={690} scale={1.15} rot={2} at={a + 2} band={[860, 1020]} pullAt={1e7} seed={9} />
      <Loop cx={1300 + (1330 - 1140) * 1.15} cy={150 + (940 - 690) * 1.15} rx={120} ry={90} at={at('barb') - 2} seed={81} tilt={-6} width={6} />
      <Label text="fig. iii · the barb" x={1310} y={740} size={24} at={a + 6} />
      <Note text="every few inches" x={110} y={110} size={60} rot={-3} at={at('few inches') - 3} />
      <Note text="a short, sharp barb" x={130} y={210} size={64} rot={-3} color="#FF6F61" at={at('short') - 2} />
      <ScrimTag text={`Wire: drawn  ·  ${TAG.patent}`} />
    </WireStage>
  );
};

// F · wrapped on tight, every few inches: pull back along the wire; {barbed wire}
const Barbs: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('wrapped') - 1;
  const b = at('The Plains') - 1;
  const xs = [-2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4];
  return (
    <WireStage>
      <Wire3D twist={1} barbs={xs.map((x, i) => ({x, p: x === 0 ? 1 : interpolate(f, [a + 6 + Math.abs(i - 3) * 5, a + 16 + Math.abs(i - 3) * 5], [0, 1], clamp)}))}
        yaw={keys(f, [[a, 0.5], [b, 0.95]])} pitch={keys(f, [[a, 0.3], [b, 0.36]])} dist={keys(f, [[a, 2.6], [b, 6.4]])} />
      <Note text="wrapped on tight, so it couldn't slide" x={110} y={110} size={56} rot={-2} at={at('wrapped') - 2} />
      <SlapTitle text="BARBED WIRE" x={110} y={640} size={96} at={at('barbed wire') - 1} seed={83} />
      <Definition term="barbed wire" def="fence wire with short, sharp points twisted on every few inches" at={at('barbed wire') + 6} x={110} y={800} w={1300} />
      <ScrimTag text="Drawn after Glidden's patent; not to scale" />
    </WireStage>
  );
};

// G · the Plains had almost no trees
const NoTrees: React.FC = () => {
  const a = at('The Plains') - 1;
  return (
    <Pic src={I.range} size={Z.range} filter={LITHO} k={[[a, 620, 520, 1.25], [at('Wire was') - 1, 860, 500, 1.18]]}>
      {() => <>
        <Note text="the Plains: almost no trees" x={110} y={110} size={62} rot={-3} at={at('almost') - 2} />
        <Note text="(nothing to build wooden fences with)" x={130} y={210} size={46} rot={-3} color="#f4efe6" at={at('wooden') - 2} />
      </>}
    </Pic>
  );
};

// H · cheap, light and fast
const Spool: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Wire was') - 1;
  const sh = shake(f, [a + 6], 8);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <DeskCam k={[[a, 24, 0.94, 0, 0, -2], [at('A young') - 1, 16, 1.04, -20, 0, 0]]}>
        <Float x={1050} y={250} w={720} hgt={720} h={14} at={a + 2} rot={-3} seed={82}>
          <Prop src={PROP('p8_wire_spool')} m={M8.p8_wire_spool} x={0} y={0} w={700} at={-99} />
        </Float>
      </DeskCam>
      <Lines x={150} y={250} size={92} gap={140} rows={[{text: 'cheap,', at: at('cheap') - 2}, {text: 'light,', at: at('light') - 2}, {text: 'fast to put up', at: at('fast') - 2}]} />
    </AbsoluteFill>
  );
};

// I · John Gates
const GatesDesk: React.FC<{late?: boolean}> = ({late}) => {
  const f = useCurrentFrame();
  const a = late ? at('And the way') - 1 : at('A young') - 1;
  const b = late ? at('Light as') - 1 : at('built') - 1;
  return (
    <DeskShot tilt={keys(f, [[a, late ? 14 : 20], [b, late ? 20 : 13]])} z={zkeys(f, [[a, late ? 1.05 : 0.95], [b, late ? 0.96 : 1.05]])} hits={late ? [] : [a + 5]} lamp={[1300, 460]}
      over={<>
        {!late && <Note text="a young salesman" x={110} y={260} size={60} rot={-3} at={at('salesman') - 2} />}
        {!late && <Note text="John Gates" x={130} y={370} size={76} rot={-3} color="#FF6F61" at={at('John') - 2} />}
        {late && <Note text="his pitch" x={110} y={260} size={70} rot={-3} at={at('his pitch') - 2} />}
        {late && <Note text="(the way the story's told)" x={130} y={380} size={50} rot={-3} color="#f4efe6" at={at("story's") - 2} />}
        <ScrimTag text={TAG.gates} />
      </>}>
      <Print src={I.gates} size={Z.gates} x={1060} y={40} w={720} crop={[200, 150, 1720, 2200]} at={late ? -99 : a + 2} rot={3} seed={83} mask={M8.b_gates} tint={late ? 0 : 0.2} traceAt={late ? undefined : at('John') - 1} />
    </DeskShot>
  );
};

// J–K · the corral of barbed wire in San Antonio (drawn on the desk), longhorns try to break out
const CORRAL = {x: 560, y: 210, w: 900, h: 640};
const Corral: React.FC<{phase: 0 | 1}> = ({phase}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const a = phase === 0 ? at('built') - 1 : at('let them') - 1;
  const b = phase === 0 ? at('let them') - 1 : at('And the way') - 1;
  const draw = interpolate(g, [at('corral') - 2, at('corral') + 16], [0, 1], clamp);
  const bumps = phase === 1 ? [at('break') - 2, at('break') + 6, at('out') + 4] : [];
  const sh = shake(f, bumps, 10, 0.3);
  const posts = 14;
  const per = 2 * (CORRAL.w + CORRAL.h);
  const P = (t: number): [number, number] => {
    let d = t * per;
    const {x, y, w, h} = CORRAL;
    if (d < w) return [x + d, y];
    d -= w;
    if (d < h) return [x + w, y + d];
    d -= h;
    if (d < w) return [x + w - d, y + h];
    d -= w;
    return [x, y + h - d];
  };
  const wirePath = (inset: number) => {
    const {x, y, w, h} = CORRAL;
    return `M${x + inset},${y + inset} L${x + w - inset},${y + inset} L${x + w - inset},${y + h - inset} L${x + inset},${y + h - inset} Z`;
  };
  const cattle: [number, number, number, boolean][] = [[660, 330, 400, false], [1010, 430, 370, true], [720, 560, 340, false]];
  const lean = phase === 1 ? interpolate(g, [at('break') - 4, at('break') + 4, at("They couldn't") - 2, at("They couldn't") + 6], [0, 1, 1, 0], clamp) : 0;
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <DeskCam k={phase === 0 ? [[a, 30, 1.0, 0, 20, -3], [b, 26, 1.08, 0, 20, -1]] : [[a, 24, 1.05, -60, -30, 0], [b, 20, 1.18, -80, -60, 1]]}>
        <svg style={{position: 'absolute', left: 400, top: 300, overflow: 'visible'}} width={1920} height={1080}>
          {[0, 14, 28].map((inset, i) => (
            <path key={i} d={wirePath(inset)} fill="none" stroke={pal.mark} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} opacity={0.9} />
          ))}
          {Array.from({length: 60}).map((_, i) => {
            const t = i / 60;
            if (t > draw) return null;
            const [x, y] = P(t);
            return <path key={i} d={`M${x - 6},${y - 8} L${x + 6},${y + 8} M${x + 6},${y - 8} L${x - 6},${y + 8}`} stroke={pal.mark} strokeWidth={2.5} />;
          })}
          {Array.from({length: posts}).map((_, i) => {
            const t = i / posts;
            if (t > draw) return null;
            const [x, y] = P(t);
            return <rect key={i} x={x - 9} y={y - 9} width={18} height={18} fill="#1d1a15" stroke={pal.mark} strokeWidth={3} />;
          })}
        </svg>
        {cattle.map(([x, y, w, flip], i) => (
          <Float key={i} x={x + (phase === 1 ? lean * (i === 1 ? 40 : -30) : 0)} y={y} w={w} hgt={w * 0.76} h={10} at={phase === 0 ? at('longhorns') - 2 + i * 3 : -99} rot={flip ? 4 : -3} seed={84 + i}>
            <div style={{position: 'absolute', inset: 0, transform: flip ? 'scaleX(-1)' : undefined}}>
              <Prop src={PROP('p2_longhorn')} m={M8.p2_longhorn} x={0} y={0} w={w} at={-99} />
            </div>
          </Float>
        ))}
      </DeskCam>
      {phase === 0 && <Label text="San Antonio, Texas" x={140} y={130} size={30} at={at('San Antonio') - 2} />}
      {phase === 0 && <Note text="a corral of barbed wire" x={130} y={200} size={56} rot={-3} at={at('corral') - 2} />}
      {phase === 1 && <Note text="let them try to break out" x={110} y={110} size={56} rot={-3} at={a + 2} />}
      {phase === 1 && <Hand parts={[['they '], ["couldn't.", true]]} x={1180} y={860} size={100} at={at("They couldn't") - 3} />}
      <ScrimTag text="Drawn · as the story is told (San Antonio, c. 1876)" />
    </AbsoluteFill>
  );
};

// M · the pitch on three orange tapes, the barb hero over the blurred fenced range
const Pitch: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Light as') - 1;
  const b = at('So who') - 1;
  const [x0, y0, x1, y1] = M8.p8_barb.data.boxes.subject;
  const w = 2300;
  const sc = w / (x1 - x0);
  const cx = keys(f, [[a, -150], [b, -230]]);
  const rot = keys(f, [[a, -9], [b, -5]]);
  const sh = shake(f, [at('dirt') + 2], 7);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Pic src={I.range} size={Z.range} filter={`${LITHO} blur(7px) brightness(0.55)`} k={[[a, 960, 560, 1.06], [b, 1000, 540, 1.12]]} />
      <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px) rotate(${rot}deg) scale(${zkeys(f, [[a, 1.0], [b, 1.08]])})`, transformOrigin: '50% 55%'}}>
        <Prop src={PROP('p8_barb')} m={M8.p8_barb} x={cx} y={580 - ((y1 - y0) * sc) / 2} w={w} at={-99} tint={0.2} traceAt={a + 4} />
      </AbsoluteFill>
      <SlapTitle text="LIGHT AS AIR" x={130} y={110} size={92} at={at('Light as')} seed={85} rot={-3} />
      <SlapTitle text="STRONGER THAN WHISKEY" x={260} y={250} size={92} at={at('stronger')} seed={86} rot={-1} />
      <SlapTitle text="CHEAP AS DIRT" x={520} y={800} size={128} at={at('cheap as dirt')} seed={87} rot={-3} />
    </AbsoluteFill>
  );
};

// N–P · the two ways to see it (Ep 1's two-views card)
const TwoViews: React.FC<{z: number; cx: number; cy: number; dimL?: number; dimR?: number}> = ({z, cx, cy, dimL = 0, dimR = 0}) => {
  const pal = usePal();
  const L = 150;
  const R = 1010;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `translate(${960 - cx * z}px, ${540 - cy * z}px) scale(${z})`, transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', left: 90, top: 90, width: 1740, height: 900, background: 'radial-gradient(ellipse at 40% 30%, #36312a 0%, #26231d 75%, #1d1a15 100%)',
          boxShadow: '16px 20px 0 #050403', transform: 'rotate(-0.6deg)'}}>
          <div style={{position: 'absolute', inset: 10, border: `2px solid ${pal.mark}`, opacity: 0.6}} />
          <div style={{position: 'absolute', left: 868, top: 40, bottom: 40, width: 3, background: pal.mark, opacity: 0.7}} />
        </div>
        <Mono text="WHO FENCED? · TWO WAYS TO SEE IT" x={560} y={50} size={28} at={at('So who') + 2} />
        <div style={{position: 'absolute', inset: 0, opacity: 1 - dimL * 0.7}}>
          <Mono text="FARMERS FENCED" x={L} y={150} size={34} at={at('two ways') - 1} />
          <Note text="· to keep cattle out" x={L} y={270} size={54} rot={-1} at={at('keep') - 2} />
          <Note text="  of their crops" x={L} y={355} size={54} rot={-1} at={at('crops') - 3} />
          <Hand parts={[['and they had a point']]} x={L} y={560} size={76} at={at('had a point') - 3} />
        </div>
        <div style={{position: 'absolute', inset: 0, opacity: 1 - dimR * 0.7}}>
          <Mono text="BIG RANCHERS FENCED, TOO" x={R} y={150} size={34} at={at('two ways') + 3} />
          <Note text="· sometimes around public land" x={R} y={270} size={50} rot={-1} at={at('public land') - 3} />
          <Note text="  they didn't own" x={R} y={355} size={50} rot={-1} at={at("didn't own") - 2} />
          <Hand parts={[['and around the '], ['water', true]]} x={R} y={560} size={76} at={at('water') - 4} />
        </div>
        <Note text="→ small ranchers + cowboys: the open range, closed" x={L} y={820} size={50} rot={-1} color="#f4efe6" at={at('found it') - 3} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const ViewsWide: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('So who') - 1;
  return <TwoViews z={zkeys(f, [[a, 0.92], [at('Farmers') - 1, 0.98]])} cx={960} cy={keys(f, [[a, 520], [at('Farmers') - 1, 540]])} />;
};
const ViewsLeft: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Farmers') - 1;
  const b = at('Big ranchers') - 1;
  return <TwoViews z={zkeys(f, [[a, 1.0], [b, 1.05]])} cx={keys(f, [[a, 960], [b, 900]])} cy={keys(f, [[a, 540], [b, 500]])} dimR={1} />;
};
const ViewsRight: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Big ranchers') - 1;
  const b = at('And the small') - 1;
  return <TwoViews z={zkeys(f, [[a, 1.05], [b, 1.02]])} cx={keys(f, [[a, 1010], [b, 1030]])} cy={keys(f, [[a, 500], [b, 530]])} dimL={1} />;
};

// Q · the fence across the range: found it closed
const Closed: React.FC = () => {
  const a = at('And the small') - 1;
  return (
    <Pic src={I.range} size={Z.range} filter={LITHO} k={[[a, 1300, 600, 1.5], [at('So some') - 1, 1050, 620, 1.3]]}>
      {(S) => {
        const [fx, fy] = S(1480, 620);
        return (
          <>
            <Note text="the small ranchers and cowboys" x={110} y={110} size={56} rot={-3} at={at('small') - 2} />
            <Note text="who depended on the open range" x={130} y={200} size={50} rot={-3} color="#f4efe6" at={at('depended') - 2} />
            <Loop cx={fx} cy={fy} rx={330} ry={160} at={at('closed') - 6} seed={88} tilt={-14} width={6} color="#FF6F61" />
            <Hand parts={[['found it '], ['closed.', true]]} x={1100} y={880} size={90} at={at('found') - 2} />
          </>
        );
      }}
    </Pic>
  );
};

// R · wire cutters
const Cutters: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('So some') - 1;
  const d = at('wire cutters') - 3;
  const sh = shake(f, [d + 3], 9);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <DeskCam k={[[a, 18, 1.0, 0, 0, 2], [at('In 1883') - 1, 26, 0.92, 0, 0, 0]]}>
        <Float x={980} y={120} w={420} hgt={1000} h={18} at={d} rot={-24} seed={89}>
          <Prop src={PROP('p8_nippers')} m={M8.p8_nippers} x={0} y={0} w={330} at={-99} tint={0.3} traceAt={d + 5} />
        </Float>
      </DeskCam>
      <Note text="so some of them got out" x={140} y={260} size={60} rot={-3} at={a + 4} />
      <Hand parts={[['wire cutters', true]]} x={170} y={400} size={110} at={at('wire cutters') - 3} />
    </AbsoluteFill>
  );
};

// S · 1883, a drought year: fence cutting spreads across Texas, mostly at night
const TX_CUTS: [number, number][] = [[2690, 2368], [2752, 2273], [2766, 2008], [2644, 1975], [2560, 2120], [2470, 2050], [2820, 2150], [2716, 1895], [2600, 2260], [2380, 2180], [2900, 2050], [2500, 1900]];
const Night: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const a = at('In 1883') - 1;
  const b = at('The range') - 1;
  const dark = interpolate(g, [at('night') - 6, at('night') + 6], [0, 0.45], clamp);
  const tx = W_MAP.states['USA:Texas'];
  return (
    <AbsoluteFill>
      <WestMap keys={[{f: a, x: 2620, y: 2120, z: 0.9, tilt: 36, rot: -4}, {f: b, x: 2640, y: 2120, z: 1.05, tilt: 40, rot: 2}]}>
        {(api) => <>
          <svg width={W_MAP.size[0]} height={W_MAP.size[1]} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', transform: 'translateZ(1px)'}}>
            <path d={tx} fill="rgba(47,224,196,0.08)" stroke="#2FE0C4" strokeWidth={api.px(3)} opacity={interpolate(g, [a, a + 8], [0, 1], clamp)} />
          </svg>
          {TX_CUTS.map((p, i) => <MCross key={i} api={api} at={p} show={at('fence cutting') - 2 + i * 4} r={26} />)}
        </>}
      </WestMap>
      <AbsoluteFill style={{background: `rgba(4,6,14,${dark})`}} />
      <SlapTitle text="1883" x={110} y={100} size={110} at={at('1883')} seed={89} />
      <Note text="a drought year in Texas" x={110} y={270} size={56} rot={-3} at={at('drought') - 2} />
      <Note text="fence cutting spread" x={1250} y={800} size={56} rot={-3} at={at('spread') - 2} />
      <Note text="mostly at night" x={1290} y={900} size={60} rot={-3} color="#f4efe6" at={at('night') - 3} />
      <ScrimTag text="Map: drawn for the series · cut marks illustrative, not individual incidents" />
    </AbsoluteFill>
  );
};

// T · the range wars had begun
const RangeWars: React.FC = () => {
  const a = at('The range') - 1;
  return (
    <Pic src={I.range} size={Z.range} filter={`${LITHO} brightness(0.42)`} k={[[a, 1500, 640, 1.6], [at('In 1884') - 1, 1420, 650, 1.7]]}>
      {() => <>
        <SlapTitle text="THE RANGE WARS" x={110} y={150} size={110} at={at('range wars') + 2} seed={90} />
        <Definition term="range wars" def="fights over who could use the open range: its grass, its water and its fences" at={at('range wars') + 10} x={110} y={360} w={1200} />
      </>}
    </Pic>
  );
};

// U · 1884: a prison crime
const Law: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('In 1884') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 26, 0.92, 0, 0, -2], [at('That means') - 1, 18, 1.0, 0, 0, 0]]}>
        <Float x={1150} y={260} w={420} hgt={900} h={6} at={-99} rot={-70} seed={91}>
          <Prop src={PROP('p8_nippers')} m={M8.p8_nippers} x={0} y={0} w={300} at={-99} />
        </Float>
      </DeskCam>
      <SlapTitle text="1884" x={110} y={110} size={110} at={at('1884')} seed={91} />
      <Note text="Texas made fence cutting" x={130} y={320} size={64} rot={-3} at={at('Texas made') - 2} />
      <Hand parts={[['a '], ['prison crime.', true]]} x={150} y={460} size={110} at={at('prison') - 3} />
      <Mono text="TEXAS, 1884 · FENCE CUTTING A FELONY: 1 TO 5 YEARS" x={150} y={680} size={30} at={at('crime') + 4} />
    </AbsoluteFill>
  );
};

// V–W · that means… one fence post at a time
const Posts: React.FC<{phase: 0 | 1}> = ({phase}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const a = phase === 0 ? at('That means') - 1 : at('It ended') - 1;
  const b = phase === 0 ? at('It ended') - 1 : at('But the fences') - 1;
  const p0 = at('fence post') - 6;
  const n = phase === 1 ? Math.max(0, Math.min(16, Math.floor((g - p0) / 3))) : 0;
  const pan = keys(f, [[a, 0], [b, phase === 1 ? -120 : 0]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `translateX(${pan}px) scale(${zkeys(f, [[a, 1.0], [b, 1.05]])})`, transformOrigin: '30% 50%'}}>
        <Hand parts={[['that means…']]} x={180} y={140} size={66} at={at('That means') - 1} white />
        <Hand parts={[["the open range didn't end"]]} x={180} y={270} size={90} at={at('open range', 2) - 3} />
        <Hand parts={[['with '], ['one battle.', true]]} x={240} y={400} size={90} at={at('one battle') - 3} />
        {phase === 1 && <Hand parts={[['it ended one '], ['fence post', true], [' at a time.']]} x={180} y={590} size={84} at={at('It ended') - 2} />}
        {phase === 1 && (
          <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={2200} height={1080}>
            {n > 1 && [0, 1, 2].map((k) => <line key={k} x1={180} y1={800 + k * 34} x2={180 + (n - 1) * 120} y2={800 + k * 34} stroke={pal.mark} strokeWidth={3} />)}
            {Array.from({length: n}).map((_, i) => (
              <g key={i}>
                <rect x={180 + i * 120 - 9} y={770} width={18} height={150} fill="#1d1a15" stroke={pal.mark} strokeWidth={4} />
                {[0, 1, 2].map((k) => <path key={k} d={`M${180 + i * 120 + 52},${800 + k * 34 - 9} l14,18 M${180 + i * 120 + 66},${800 + k * 34 - 9} l-14,18`} stroke={pal.mark} strokeWidth={2.5} />)}
              </g>
            ))}
          </svg>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// X–Y · slowly; then the weather (first snow)
const Slowly: React.FC<{snow: boolean}> = ({snow}) => {
  const f = useCurrentFrame();
  const a = snow ? at('The weather') - 1 : at('But the fences') - 1;
  const b = snow ? END : at('The weather') - 1;
  const g = useGFrame();
  const dim = snow ? interpolate(f, [a, a + 60], [0.95, 0.55], clamp) : 0.95;
  return (
    <AbsoluteFill>
      <Pic src={I.range} size={Z.range} filter={`${LITHO} brightness(${dim})`} k={snow ? [[a, 1100, 560, 1.12], [b, 1150, 560, 1.2]] : [[a, 760, 560, 1.3], [b, 1000, 560, 1.18]]}>
        {() => <>
          {!snow && <Note text="the fences changed the range slowly" x={110} y={110} size={56} rot={-3} at={at('changed') - 2} />}
          {snow && <Note text="the weather did it in one winter" x={110} y={110} size={60} rot={-3} at={at('weather') - 2} />}
        </>}
      </Pic>
      {snow && <Snow k={interpolate(g, [a + 4, at('winter') + 10], [0, 1], clamp)} n={120} wind={2.8} seed="c8" />}
    </AbsoluteFill>
  );
};

// ───────────────────────── assembly ─────────────────────────

const c = (w: string, n = 1) => at(w, n) - 1;
const SHOTS: [number, React.ReactNode, ('whip' | 'cut')?][] = [
  [0, <Year />],
  [c('a farmer'), <DeKalb />, 'whip'],
  [c('Joseph'), <Glidden />, 'cut'],
  [c('Look at'), <Twist />, 'whip'],
  [c('And every'), <BarbWrap />, 'cut'],
  [c('wrapped'), <Barbs />, 'cut'],
  [c('The Plains'), <NoTrees />, 'whip'],
  [c('Wire was'), <Spool />, 'cut'],
  [c('A young'), <GatesDesk />, 'whip'],
  [c('built'), <Corral phase={0} />, 'cut'],
  [c('let them'), <Corral phase={1} />, 'cut'],
  [c('And the way'), <GatesDesk late />, 'cut'],
  [c('Light as'), <Pitch />, 'cut'],
  [c('So who'), <ViewsWide />, 'whip'],
  [c('Farmers'), <ViewsLeft />, 'cut'],
  [c('Big ranchers'), <ViewsRight />, 'cut'],
  [c('And the small'), <Closed />, 'whip'],
  [c('So some'), <Cutters />, 'cut'],
  [c('In 1883'), <Night />, 'whip'],
  [c('The range'), <RangeWars />, 'cut'],
  [c('In 1884'), <Law />, 'cut'],
  [c('That means'), <Posts phase={0} />, 'whip'],
  [c('It ended'), <Posts phase={1} />, 'cut'],
  [c('But the fences'), <Slowly snow={false} />, 'whip'],
  [c('The weather'), <Slowly snow />, 'cut'],
];

const tick = (w: string, d = 2, n = 1): [number, string, number] => [at(w, n) - d, 'marker_tick', 0.2];
const SFX: [number, string, number][] = [
  ...SHOTS.slice(1).map(([s, , k]): [number, string, number] => (k === 'whip' ? [s - 4, 'whip_soft', 0.25] : [s, 'whoosh', 0.2])),
  [at('1874'), 'stamp', 0.22], tick('same year', 4),
  [at('DeKalb') - 2, 'block_tap_soft', 0.15],
  tick('Glidden', 5), [at('patent') - 1, 'block_tap_soft', 0.15], tick('new kind', 4),
  [at('Look at') + 1, 'page_turn', 0.4], tick('Two wires', 4), tick('twisted', 4),
  tick('few inches', 5), tick('short', 4), [at('barb') + 6, 'tape_press', 0.12],
  tick('wrapped', 4), [at('barbed wire') - 1, 'stamp', 0.22],
  tick('almost', 4), tick('wooden', 4),
  [at('Wire was') + 1, 'paper_slap_soft', 0.25], tick('cheap', 4), tick('light', 4), tick('fast', 4),
  [at('A young') + 1, 'paper_slap_soft', 0.22], tick('salesman', 4), tick('John', 4),
  tick('corral', 4), [at('San Antonio') - 2, 'block_tap_soft', 0.12], ...[0, 1, 2].map((i): [number, string, number] => [at('longhorns') - 1 + i * 3, 'paper_slap_soft', 0.18]),
  [at('break') - 1, 'block_tap_soft', 0.15], [at('break') + 7, 'block_tap_soft', 0.12], [at('out') + 5, 'block_tap_soft', 0.12], tick("They couldn't", 5),
  tick('his pitch', 4), tick("story's", 4),
  [at('Light as'), 'stamp', 0.22], [at('stronger'), 'stamp', 0.22], [at('cheap as dirt'), 'stamp', 0.24],
  tick('So who', -2), [at('two ways') - 1, 'card_slide_soft', 0.18], tick('keep', 4), tick('had a point', 5), tick('public land', 5), tick('water', 6),
  tick('small', 4), tick('depended', 4), tick('found', 4),
  [at('wire cutters') - 2, 'paper_slap_soft', 0.25], tick('wire cutters', 5),
  [at('1883'), 'stamp', 0.22], tick('drought', 4), ...Array.from({length: 12}).map((_, i): [number, string, number] => [at('fence cutting') - 2 + i * 4, 'tick_soft', 0.08]), tick('night', 5),
  [at('range wars') + 2, 'stamp', 0.22],
  [at('1884'), 'stamp', 0.22], tick('Texas made', 4), tick('prison', 5), [at('crime') + 4, 'block_tap_soft', 0.15],
  tick('That means', 1), tick('open range', 5, 2), tick('one battle', 5),
  tick('It ended', 4), ...Array.from({length: 16}).map((_, i): [number, string, number] => [at('fence post') - 6 + i * 3, 'block_tap_soft', 0.07]),
  tick('changed', 4), tick('weather', 4),
];

const Body: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <WShots shots={SHOTS} />
    <Sounds list={SFX} />
  </AbsoluteFill>
);

export const Ch08: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch08_cheap_as_dirt.wav" lead={LEAD} music={[
    // g_grip (library): one cue for the chapter; it lifts in the tail into the winter
    {src: 'music/g_grip.mp3', volume: bed('g_grip')},
  ]}>
    <Body />
  </ChapterShell>
);

