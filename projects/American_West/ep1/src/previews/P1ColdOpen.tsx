// Preview P1 · Ep 1 cold open, timed to the one-take v4 narration (public/audio/ch01_v4_onetake.mp3), first ~20 s only.
// Shots: WIDE parallax push (hook tape in the first second) -> desk slap-down + worker in the torn gap ("aren't in it")
// -> whip to a pan across the engines -> deep push to the bottles -> tilt to the handshake -> whip out to the desk.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch01_v4_onetake.words.json';
import {clamp} from '../lib/anim';
import {Finish, Highlight, Loop, Note, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame} from '../kit/Kit';
import {makeTimeline, type Narration} from '../kit/shell';
import {CutOut, MapCard, TornPrint} from '../samples/kit';
import {IMG, SM, SZ, WARREN} from '../samples/masks';
import {Desk3D, keys, Lift, PhotoCam, shake, Shots, useSlap, zkeys} from './fx';

const N = words as Narration;
const T = makeTimeline(N, 30);
export const P1_FRAMES = T.at('The first') + 2;

const SPIKE_TAG = 'A. J. Russell, East and West Shaking Hands at Laying Last Rail, May 10, 1869 · Wikimedia Commons';
const WORKER = 'img/previews/hart_tunnel8_worker_w.jpg';

/** A title that slaps down (scale 1.3 -> 1 with overshoot) as its tape wipes on. */
const SlapTitle: React.FC<{text: string; x: number; y: number; size: number; at: number; seed?: number; rot?: number}> = ({text, x, y, size, at, seed = 21, rot = -2}) => {
  const s = useSlap(at, 1.35);
  if (!s.on) return null;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${s.scale})`, transformOrigin: `${x + 200}px ${y + 50}px`}}>
      <Highlight text={text} x={x} y={y} size={size} at={at} seed={seed} rot={rot} />
    </div>
  );
};

/** 1 · WIDE: the photo full-bleed, sky and crowd on separate layers so the push has depth. Hook tape at once. */
const Wide: React.FC = () => {
  const f = useCurrentFrame();
  const s = zkeys(f, [[0, 0.5], [175, 0.545]]);
  return (
    <AbsoluteFill>
      <PhotoCam src={IMG.spike} size={SZ.spike} cx={1920} cy={keys(f, [[0, 1330], [175, 1300]])} s={s} fg="img/previews/spike_fg.webp" bg="img/previews/spike_bg.jpg" fgK={keys(f, [[0, 0], [175, 0.06]])} />
      <SlapTitle text="NOT IN THE PICTURE" x={100} y={890} size={100} at={12} />
      <Tag text={SPIKE_TAG} x={44} y={30} />
    </AbsoluteFill>
  );
};

/** The desk with the torn print, the worker in the gap and the map card (shots 2 and 6). */
const DeskPieces: React.FC<{t0: number; worker: number; map: number}> = ({t0, worker, map}) => (
  <>
    <Lift x={130} y={80} w={1150} hgt={875} h={10} at={t0} rot={-2} seed={2}>
      <TornPrint src={IMG.spike} size={SZ.spike} x={0} y={0} w={1150} at={-99} seed={3} corner={{at: 'br', x: 0.7, y: 0.58}} real grey shadow={5}
        tapes={[{x: -50, y: 30, w: 190, rot: -38}, {x: 1010, y: -6, w: 190, rot: 30}]} />
    </Lift>
    <Lift x={1360} y={640} w={440} hgt={300} h={4} at={map} rot={3} blur={1.4} seed={5}>
      <MapCard x={0} y={0} w={440} h={300} src={IMG.warren} size={SZ.warren} fx={WARREN.promontory[0] + 20} fy={WARREN.promontory[1] + 40} scale={0.62} at={-99}
        pin={WARREN.promontory} label="Promontory" labelAt={[228, 40]} caption="UTAH TERR. · 1869" />
    </Lift>
    <Lift x={900} y={440} w={330} hgt={520} h={46} at={worker} seed={7}>
      <CutOut src={WORKER} size={SZ.tunnel8} mask={SM.worker} place={{left: 10 - 519 * 0.95, top: 18 - 1291 * 0.95, scale: 0.95}} at={-99} tint={0.6} traceAt={worker + 6}
        filter="grayscale(1) contrast(1.15) brightness(1.2)" />
    </Lift>
  </>
);

/** 2 · DESK: the print slaps onto the desk on "And most…", the worker lands in the torn gap on "aren't in it". */
const DeskReveal: React.FC = () => {
  const f = useCurrentFrame();
  const a = T.at('And most') - 1;
  const w = T.at("aren't") - 2;
  const sh = shake(f, [a + 3, w + 3], 10);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={keys(f, [[a, 26], [T.at('Look at it') - 1, 15]])} rotZ={keys(f, [[a, -2], [T.at('Look at it'), 0]])} z={0.9} y={10}>
        <DeskPieces t0={a} worker={w} map={a + 10} />
      </Desk3D>
      <Note text="the men who built it" x={1270} y={130} size={50} rot={-3} at={w + 10} />
      <Tag text="A. J. Russell, 1869 · Commons  ·  A. A. Hart, Heading of Tunnel No. 8, 1865–69 · LOC" x={44} y={30} />
    </AbsoluteFill>
  );
};

/** 3 · DETAIL pan across the two engines, a loop on each as it's named. */
const Engines: React.FC = () => {
  const f = useCurrentFrame();
  const a = T.at('Look at it');
  return (
    <PhotoCam src={IMG.spike} size={SZ.spike} cx={keys(f, [[a, 1150], [T.at('Two locomotives') + 22, 1150], [T.at('nose to nose') + 6, 2700], [T.at('Men'), 2760]])} cy={820} s={0.95}>
      {(S) => {
        const [jx, jy] = S(720, 720);
        const [ux, uy] = S(2700, 720);
        return (
          <>
            <Loop cx={jx} cy={jy} rx={330} ry={250} at={T.at('Two locomotives') + 3} seed={5} tilt={-6} width={6} />
            <Loop cx={ux} cy={uy} rx={320} ry={260} at={T.at('nose to nose') + 6} seed={9} tilt={4} width={6} />
            <Note text="Central Pacific" x={jx - 240} y={Math.min(880, jy + 260)} size={50} rot={-3} at={T.at('Two locomotives') + 8} />
            <Note text="Union Pacific" x={ux - 200} y={Math.min(880, uy + 270)} size={50} rot={-3} at={T.at('nose to nose') + 10} />
          </>
        );
      }}
    </PhotoCam>
  );
};

/** 4 · DETAIL deep push (≈6× the wide) into the men holding up bottles. */
const Bottles: React.FC = () => {
  const f = useCurrentFrame();
  const a = T.at('Men') - 1;
  return (
    <PhotoCam src={IMG.spike} size={SZ.spike} cx={keys(f, [[a, 1850], [a + 85, 1680]])} cy={keys(f, [[a, 900], [a + 85, 940]])} s={zkeys(f, [[a, 1.1], [a + 85, 3.0]])}>
      {(S) => {
        const [bx, by] = S(1612, 925);
        return <Loop cx={bx} cy={by} rx={130} ry={190} at={T.at('bottles') - 2} seed={13} tilt={-8} width={6} />;
      }}
    </PhotoCam>
  );
};

/** 5 · DETAIL tilt from the faces down to the handshake; Montague in coral as the hands meet. */
const Handshake: React.FC = () => {
  const f = useCurrentFrame();
  const a = T.at('Two engineers') - 1;
  return (
    <PhotoCam src={IMG.spike} size={SZ.spike} cx={1860} cy={keys(f, [[a, 1400], [T.at('in the middle'), 1660]])} s={1.7} mask={SM.montague} tintAt={T.at('shaking') + 4} traceAt={T.at('shaking') + 6}>
      {() => <Note text="the engineers" x={1240} y={130} size={52} rot={-3} at={T.at('Two engineers') + 4} />}
    </PhotoCam>
  );
};

/** 6 · WIDE pull-out back on the desk: everything settled, the date slaps on. */
const DeskWide: React.FC = () => {
  const f = useCurrentFrame();
  const a = T.at('May');
  const sh = shake(f, [a + 2], 7);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={keys(f, [[a - 2, 12], [P1_FRAMES, 18]])} z={zkeys(f, [[a - 2, 1.03], [P1_FRAMES, 0.88]])} y={keys(f, [[a - 2, 40], [P1_FRAMES, 0]])}>
        <DeskPieces t0={-99} worker={-99} map={-99} />
      </Desk3D>
      <SlapTitle text="MAY 10, 1869" x={1290} y={110} size={84} at={a} seed={11} rot={-3} />
      <Note text="the men who built it" x={1330} y={300} size={46} rot={-3} at={-99} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const shots: [number, React.ReactNode, ('whip' | 'cut')?][] = [
    [0, <Wide />],
    [T.at('And most') - 1, <DeskReveal />, 'cut'],
    [T.at('Look at it') - 1, <Engines />, 'whip'],
    [T.at('Men') - 1, <Bottles />, 'cut'],
    [T.at('Two engineers') - 1, <Handshake />, 'cut'],
    [T.at('May') - 2, <DeskWide />, 'whip'],
  ];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots shots={shots} />
      <Finish vignette={0.3} />
      <Audio src={staticFile('audio/ch01_v4_onetake.mp3')} volume={(fr) => interpolate(fr, [P1_FRAMES - 14, P1_FRAMES - 1], [1, 0], clamp)} />
    </AbsoluteFill>
  );
};

export const P1ColdOpen: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
