// Chapter 3 · The Race. The Central Pacific's wall (the Sierra), the workers who walked off, Crocker's 50, the Chinese crews,
// the pay gap and the tea; the Union Pacific on the Plains, Hell on Wheels, the hunting grounds; "a mountain".
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch03_the_race.words.json';
import {clamp} from '../lib/anim';
import {Arrow, JF, Loop, Note, useGFrame, usePal} from '../kit/Kit';
import {Sfx} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration} from '../kit/shell';
import {Desk3D, keys, Lift, Mono, PhotoCam, ScrimTag, shake, Shots, SlapTitle, TornPrint, zkeys} from '../kit/west';
import {IMG, SM, SZ} from '../samples/masks';
import {M3} from '../masks_ch03';
import {DarkCard, Hand, LINES, MPin, MRegion, MRoute, PL, Ribbon, RMI, RX, subLine, Tally, WestMap} from '../kit/ch01_extra';

const N = words as Narration;
export const CH03_FRAMES = chapterFrames(N, LEAD);
const T = makeTimeline(N, 30);
const at = T.at;
const END = T.frames;

const CAPE: [number, number] = [2068, 1916];
const SNOW: [number, number] = [2810, 2045];
const MINERS: [number, number] = [755, 520];
const CROCKER: [number, number] = [1920, 2560];
const LAB: [number, number] = [2088, 1971];
const OUTFIT: [number, number] = [1920, 1419];
const HOW: [number, number] = [1920, 1097];
const MAPTAG = 'Map: Natural Earth outlines (today\'s state lines for reference); lines from town control points, approx.';
const CROCKER_TAG = 'Silas Selleck, Charles Crocker, c. 1865–75 · Wikimedia Commons';
const LAB_TAG = 'A. A. Hart, Laborers and Rocks, near Summit Tunnel, c. 1866–67 (CPRR stereo no. 118) · Library of Congress';
const HOW_TAG = 'Illustration (AI lithograph): a rolling tent town on the Union Pacific line, late 1860s';
const CORAL = '#FF6F61';

/** 1 · "The Central Pacific had the harder start": the map, Sacramento, the mountains just east. */
const Start: React.FC = () => {
  const ks = [{f: 0, x: 900, y: 1300, z: 0.95, tilt: 50, rot: -8}, {f: at('Just past') - 1, x: 860, y: 1290, z: 1.1, tilt: 54, rot: -4}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MRoute api={api} pts={subLine(LINES.cp, 0.03)} at={-99} width={8} />
          <MPin api={api} at={PL.sacramento} show={6} label="Sacramento" side="l" size={54} color={CORAL} />
          <MPin api={api} at={PL.donner} show={at('harder') - 2} label="the Sierra Nevada" sub="DONNER SUMMIT · 7,000 FT" size={54} />
        </>}
      </WestMap>
      <SlapTitle text="CENTRAL PACIFIC" x={110} y={80} size={96} at={at('Central Pacific') + 2} seed={41} />
      <Note text="the harder start" x={130} y={220} size={56} rot={-3} at={at('harder start') - 2} />
      <ScrimTag text={MAPTAG} />
    </AbsoluteFill>
  );
};

/** 2 · "a wall: the Sierra Nevada": Hart's Cape Horn, the grade cut into the mountainside, slow tilt up. */
const Wall: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Just past') - 1;
  const b = at('And the company') - 1;
  return (
    <AbsoluteFill>
      <PhotoCam src="img/ch03/hart_cape_horn.jpg" size={CAPE} cx={1034} cy={keys(f, [[a, 1150], [b, 820]])} s={zkeys(f, [[a, 0.98], [b, 1.06]])} />
      <Hand parts={[['a wall', CORAL]]} x={1300} y={130} size={96} at={at('wall') - 2} />
      <SlapTitle text="THE SIERRA NEVADA" x={110} y={850} size={100} at={at('Sierra') + 1} seed={43} />
      <ScrimTag text="A. A. Hart, Cape Horn and Railroad, view from near Colfax, c. 1866 (CPRR stereo no. 43) · Library of Congress" x={34} y={24} />
    </AbsoluteFill>
  );
};

/** 3 · "couldn't keep workers … rode the train to the end of the track": Russell at the summit, a pan along the snowsheds. */
const Summit: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('And the company') - 1;
  const b = at('and walked off') - 1;
  return (
    <AbsoluteFill>
      <PhotoCam src="img/ch03/russell_sierra_snowsheds_1868.jpg" size={SNOW} cx={keys(f, [[a, 1150], [b, 1650]])} cy={1150} s={0.82} />
      <Note text="couldn't keep workers" x={120} y={120} size={60} rot={-3} at={at("couldn't keep") - 2} color="#ffffff" />
      <Note text="signed on, rode to the end of track…" x={150} y={230} size={52} rot={-3} at={at('signed on') - 2} />
      <ScrimTag text="A. J. Russell, Summit of Sierra Nevada, snow sheds, Donner Lake beyond, 1868 · Library of Congress" x={34} y={24} />
    </AbsoluteFill>
  );
};

/** 4 · "…and walked off to look for gold and silver": a gold-rush daguerreotype on the desk, the arrow off to it. */
const Mines: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('and walked off') - 1;
  const b = at('So in 1865') - 1;
  const sh = shake(f, [a + 4], 8);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={keys(f, [[a, 24], [b, 16]])} z={zkeys(f, [[a, 0.95], [b, 1.05]])} x={keys(f, [[a, 60], [b, -40]])}>
        <Lift x={760} y={150} w={900} hgt={620} h={10} at={a + 1} rot={3} seed={3}>
          <TornPrint src="img/ch03/miners_long_tom.jpg" size={MINERS} x={0} y={0} w={900} at={-99} seed={4} real grey shadow={6} tapes={[{x: 360, y: -14, w: 170, rot: -4}]} />
        </Lift>
      </Desk3D>
      <Hand parts={[['walked off →']]} x={110} y={330} size={84} at={at('walked off') - 2} />
      <Hand parts={[['gold', '#FF9F1C'], [' & silver', '#ffffff']]} x={140} y={470} size={84} at={at('gold and silver') - 2} />
      <ScrimTag text="George H. Johnson, California gold miners with a long tom, c. 1850–52 (daguerreotype) · Wikimedia Commons" />
    </AbsoluteFill>
  );
};

/** Crocker's portrait on the desk, coral and traced. */
const CrockerPrint: React.FC<{t0: number; tint: number}> = ({t0, tint}) => (
  <Lift x={160} y={40} w={700} hgt={933} h={12} at={t0} rot={-3} seed={9}>
    <TornPrint src="img/ch03/crocker_selleck.jpg" size={CROCKER} x={0} y={0} w={700} crop={[0, 0, 1920, 2560]} at={-99} seed={10} real grey shadow={6}
      mask={M3.crocker} tint={0.55} traceAt={tint} tapes={[{x: 270, y: -14, w: 170, rot: -3}]} />
  </Lift>
);

/** 5 · "So in 1865, … Charles Crocker tried something new." */
const Crocker: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('So in 1865') - 1;
  const b = at('He hired') - 1;
  const sh = shake(f, [at('Charles') + 3], 8);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={keys(f, [[a, 18], [b, 10]])} z={zkeys(f, [[a, 0.92], [b, 1.0]])}>
        <CrockerPrint t0={at('Charles')} tint={at('Crocker') + 2} />
      </Desk3D>
      <SlapTitle text="1865" x={1150} y={120} size={130} at={at('1865') + 1} seed={47} />
      <SlapTitle text="CHARLES CROCKER" x={1050} y={380} size={78} at={at('Crocker') + 2} seed={49} rot={-3} />
      <Note text="a Central Pacific boss" x={1100} y={520} size={54} rot={-3} at={at('boss') - 2} />
      <Note text="tries something new" x={1120} y={620} size={54} rot={-3} at={at('something new') - 2} color="#ffffff" />
      <ScrimTag text={CROCKER_TAG} />
    </AbsoluteFill>
  );
};

/** 6 · "He hired about 50 Chinese workers": Hart's laborers at the Summit Tunnel, a tally of 50 drawn in coral. */
const Fifty: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('He hired') - 1;
  const b = at('His construction') - 1;
  return (
    <AbsoluteFill>
      <PhotoCam src="img/ch03/hart_laborers_summit_tunnel.jpg" size={LAB} cx={keys(f, [[a, 1150], [b, 1000]])} cy={keys(f, [[a, 1100], [b, 1250]])} s={zkeys(f, [[a, 0.62], [b, 0.72]])}
        bw="grayscale(1) contrast(1.15) brightness(0.62)" vignette={0.75} />
      <Mono text="ABOUT" x={140} y={110} size={26} at={at('about 50') - 1} />
      <SlapTitle text="50" x={140} y={160} size={150} at={at('50') + 1} seed={51} />
      <Tally n={50} x={500} y={170} at={at('50') + 4} per={0.55} size={58} perRow={25} color={CORAL} />
      <Note text="men who came for the gold rush" x={150} y={880} size={56} rot={-3} at={at('gold rush') - 3} color="#ffffff" />
      <ScrimTag text={LAB_TAG} x={34} y={1026} />
    </AbsoluteFill>
  );
};

/** 7 · "His construction foreman thought they were too small": cut-in on the men at work. */
const TooSmall: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('His construction') - 1;
  const b = at('Crocker reportedly') - 1;
  return (
    <AbsoluteFill>
      <PhotoCam src="img/ch03/hart_laborers_summit_tunnel.jpg" size={LAB} cx={keys(f, [[a, 1450], [b, 1560]])} cy={1400} s={zkeys(f, [[a, 1.15], [b, 1.3]])} />
      <Hand parts={[['the foreman: ', '#ffffff'], ['“too small”']]} x={110} y={110} size={78} at={at('foreman') - 2} />
      <ScrimTag text={LAB_TAG} x={34} y={1026} />
    </AbsoluteFill>
  );
};

/** 8 · Crocker's answer (reportedly): his portrait close, the line in handwriting, "reportedly" in orange. */
const GreatWall: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Crocker reportedly') - 1;
  const b = at('The 50') - 1;
  return (
    <AbsoluteFill>
      <Desk3D tilt={keys(f, [[a, 8], [b, 4]])} z={zkeys(f, [[a, 1.3], [b, 1.42]])} x={keys(f, [[a, 300], [b, 340]])} y={keys(f, [[a, 120], [b, 150]])}>
        <CrockerPrint t0={-99} tint={-99} />
      </Desk3D>
      <Note text="reportedly" x={1090} y={150} size={56} rot={-4} at={at('reportedly') - 2} color="#FF9F1C" />
      <Hand parts={[['“their ancestors']]} x={1060} y={270} size={70} at={at('ancestors') - 4} dur={10} />
      <Hand parts={[['built the '], ['Great Wall', '#ffffff'], ['”']]} x={1090} y={380} size={70} at={at('Great Wall') - 6} dur={10} />
      <ScrimTag text={CROCKER_TAG} />
    </AbsoluteFill>
  );
};

/** 9 · "The 50 worked out … most of the Central Pacific's workforce": the tally becomes a workforce bar. */
const Workforce: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const a = at('The 50') - 1;
  const b = at('Thousands') - 1;
  const fill = interpolate(g, [at('most of the Central') - 2, at('most of the Central') + 14], [0, 0.8], clamp);
  return (
    <AbsoluteFill>
      <Desk3D tilt={keys(f, [[a, 16], [b, 10]])} z={zkeys(f, [[a, 1.04], [b, 0.98]])}><div /></Desk3D>
      <Tally n={50} x={160} y={150} at={-99} size={50} perRow={25} color={CORAL} />
      <Hand parts={[['the 50 worked out']]} x={1060} y={160} size={64} at={at('worked out') - 2} />
      <Mono text="CENTRAL PACIFIC WORKFORCE, A COUPLE OF YEARS LATER" x={160} y={470} size={26} at={at('Within') - 1} />
      {g >= at('Within') && <div style={{position: 'absolute', left: 160, top: 540, width: 1600, height: 130, border: `4px solid ${pal.mark}`, background: 'rgba(0,0,0,0.35)', boxShadow: '12px 14px 0 #050403'}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: CORAL, opacity: 0.85}} />
        {fill > 0.7 && <div style={{position: 'absolute', left: 30, top: 34, fontFamily: JF.mono, fontSize: 40, letterSpacing: 3, color: '#111', whiteSpace: 'nowrap'}}>CHINESE CREWS · MOST</div>}
      </div>}
      <Note text="(most estimates: around 4 in 5)" x={180} y={710} size={50} rot={-2} at={at('workforce') + 6} color="#ffffff" />
      <ScrimTag text="Share approx. (contemporary and historians' estimates vary)" />
    </AbsoluteFill>
  );
};

/** 10 · "Thousands of men, many recruited straight from southern China": the worker at Tunnel No. 8, in coral. */
const Thousands: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Thousands') - 1;
  const b = at('They were not paid') - 1;
  return (
    <AbsoluteFill>
      <PhotoCam src={IMG.tunnel8} size={SZ.tunnel8} cx={keys(f, [[a, 900], [b, 800]])} cy={keys(f, [[a, 1300], [b, 1450]])} s={zkeys(f, [[a, 0.6], [b, 0.82]])} mask={SM.worker} tintAt={a + 3} traceAt={a + 5} />
      <SlapTitle text="THOUSANDS" x={1150} y={110} size={100} at={at('Thousands') + 1} seed={53} />
      <Note text="many from southern China" x={1170} y={260} size={56} rot={-3} at={at('southern China') - 3} />
      <ScrimTag text="A. A. Hart, Heading of east portal, Tunnel No. 8, 1865–69 · Library of Congress" x={34} y={1026} />
    </AbsoluteFill>
  );
};

/** 11 · Not paid the same: a pair of dark cards (wide), then a cut-in on the Chinese crews' card. */
const Pay: React.FC<{close?: boolean}> = ({close}) => {
  const f = useCurrentFrame();
  const a = at('They were not paid') - 1;
  const m = at('White workers') - 1;
  const b = at('They did have') - 1;
  const z = close ? zkeys(f, [[m, 1.0], [b, 1.06]]) : zkeys(f, [[a, 1.1], [m, 1.25]]);
  const ox = close ? 960 : keys(f, [[a, 960], [m, 640]]);
  const cn = at('Chinese workers earned') - 1;
  return (
    <AbsoluteFill>
      <Desk3D tilt={close ? 10 : 16} z={1} lamp={close ? [960, 520] : [640, 520]}><div /></Desk3D>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: `${ox}px 520px`}}>
        <DarkCard x={170} y={230} w={720} h={500} at={close ? -99 : cn} rot={-2} head="CHINESE CREWS" headColor={CORAL} accent={CORAL} seed={7}
          lines={[{text: 'less pay', at: close ? -99 : at('less than') - 2, color: CORAL}, {text: 'buy their own food', at: close ? -99 : at('buy their own') - 2}]} />
        <DarkCard x={1030} y={250} w={720} h={500} at={close ? m : 1e7} rot={2} head="WHITE CREWS" seed={8}
          lines={[{text: 'more pay', at: m + 6}, {text: 'meals came with the job', at: at('meals') - 2}]} />
      </div>
      {!close && <SlapTitle text="NOT THE SAME PAY" x={110} y={70} size={84} at={at('not paid') + 2} seed={55} />}
      {close && <Note text="(exact wages vary by source)" x={1180} y={900} size={42} rot={-2} at={at('job') + 2} color="#ffffff" />}
    </AbsoluteFill>
  );
};

/** The tea and the stream, drawn: a barrel and a kettle with steam (left), a stream and a tin cup (right). */
const TeaStream: React.FC<{teaAt: number; streamAt: number; loopAt?: number}> = ({teaAt, streamAt, loopAt = 1e7}) => {
  const g = useGFrame();
  const pal = usePal();
  const draw = (s: number, dur = 14) => interpolate(g, [s, s + dur], [0, 1], clamp);
  const pt = draw(teaAt);
  const ps = draw(streamAt);
  const P = (p: number) => ({pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p});
  const S = {fill: 'none', stroke: pal.mark, strokeWidth: 7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  const steam = (x: number, k: number) => `M${x},${380 - k * 4} q-20,-30 0,-60 q20,-30 0,-60`;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <g style={{filter: 'drop-shadow(4px 5px 0 #050403)'}}>
        {g >= teaAt && <g>
          {/* barrel */}
          <path d="M220,500 q-20,130 0,260 h190 q20,-130 0,-260 z" {...S} {...P(pt)} />
          <path d="M210,560 h210 M210,700 h210" {...S} strokeWidth={5} {...P(pt)} />
          {/* kettle over a fire */}
          <path d="M520,520 q0,-90 110,-90 q110,0 110,90 q0,60 -110,60 q-110,0 -110,-60 z M740,470 l70,-40" {...S} stroke={CORAL} {...P(pt)} />
          <path d="M560,640 l30,-40 l30,40 l30,-40 l30,40" {...S} stroke="#FF9F1C" {...P(pt)} />
          {[600, 650].map((x, i) => <path key={x} d={steam(x, i)} {...S} strokeWidth={5} opacity={0.8} {...P(draw(teaAt + 8, 10))} />)}
        </g>}
        {g >= streamAt && <g>
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M1080,${520 + i * 60} q60,-30 120,0 t120,0 t120,0 t120,0 t120,0`} {...S} strokeWidth={6} opacity={0.9 - i * 0.15} {...P(ps)} />)}
          <path d="M1300,330 v110 q0,30 30,30 h80 q30,0 30,-30 v-110 z M1440,360 q50,0 50,40 q0,40 -50,40" {...S} stroke="#ffffff" {...P(draw(streamAt + 6, 10))} />
        </g>}
      </g>
      {g >= loopAt && <path d="" />}
    </svg>
  );
};

/** 12-14 · The one advantage: tea (boiled water) vs. straight from the streams; then the question, held. */
const Tea: React.FC<{phase: 0 | 1 | 2}> = ({phase}) => {
  const f = useCurrentFrame();
  const a = at('They did have') - 1;
  const s = at('White crews mostly') - 1;
  const q = at('Guess') - 1;
  const b = at('Meanwhile') - 1;
  const z = phase === 0 ? zkeys(f, [[a, 1.35], [s, 1.45]]) : phase === 1 ? zkeys(f, [[s, 1.3], [q, 1.4]]) : zkeys(f, [[q, 1.0], [b, 1.02]]);
  const ox = phase === 0 ? 520 : phase === 1 ? 1380 : 960;
  return (
    <AbsoluteFill>
      <Desk3D tilt={phase === 2 ? 10 : 16} z={1} lamp={[ox, 560]}><div /></Desk3D>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: `${ox}px 600px`}}>
        <TeaStream teaAt={phase === 0 ? at('tea') - 2 : -99} streamAt={phase === 1 ? at('streams') - 8 : phase === 2 ? -99 : 1e7} />
        <Note text="tea: boiled water" x={200} y={790} size={54} rot={-3} at={phase === 0 ? at('boiled') - 2 : -99} />
        <Note text="carried up in barrels" x={210} y={880} size={46} rot={-3} at={phase === 0 ? at('barrels') - 4 : -99} color="#ffffff" />
        {phase > 0 && <Note text="straight from the streams" x={1080} y={790} size={54} rot={-3} at={phase === 1 ? at('streams') - 6 : -99} />}
      </div>
      {phase === 0 && <Mono text="CHINESE CREWS" x={170} y={110} size={28} at={a + 2} color={CORAL} />}
      {phase === 1 && <Mono text="WHITE CREWS" x={1180} y={110} size={28} at={s + 2} />}
      {phase === 2 && <>
        <Mono text="CHINESE CREWS" x={210} y={240} size={26} at={-99} color={CORAL} />
        <Mono text="WHITE CREWS" x={1100} y={240} size={26} at={-99} />
        <Hand parts={[['who got sick less often?', '#ffffff']]} x={480} y={90} size={74} at={at('Guess') - 2} dur={14} />
      </>}
      {phase === 2 && <Loop cx={500} cy={560} rx={360} ry={230} at={at('less often') + 6} seed={71} tilt={-4} width={6} />}
    </AbsoluteFill>
  );
};

/** 15 · "Meanwhile, the Union Pacific was racing across the flat Great Plains": the UP line runs west fast. */
const Plains: React.FC = () => {
  const g = useGFrame();
  const a = at('Meanwhile') - 1;
  const b = at('Its crews') - 1;
  const ks = [{f: a, x: 2600, y: 1150, z: 0.62, tilt: 52, rot: 6}, {f: b, x: 2250, y: 1150, z: 0.58, tilt: 50, rot: 2}];
  const p = interpolate(g, [at('racing') - 2, b], [0.08, 0.5], clamp);
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MRoute api={api} pts={LINES.up} at={-99} prog={p} color={CORAL} width={8} />
          <MPin api={api} at={PL.omaha} show={a + 2} label="Omaha" size={50} />
        </>}
      </WestMap>
      <SlapTitle text="UNION PACIFIC" x={110} y={80} size={96} at={at('Union Pacific') + 2} seed={57} />
      <Note text="flat ground: fast" x={130} y={220} size={58} rot={-3} at={at('flat Great Plains') - 2} />
      <ScrimTag text={MAPTAG} />
    </AbsoluteFill>
  );
};

/** 16 · The UP's crews: Russell's photo of Casement's outfit, three lines of who they were. */
const Crews: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Its crews') - 1;
  const b = at('Behind them') - 1;
  return (
    <AbsoluteFill>
      <PhotoCam src="img/ch03/russell_casement_outfit.jpg" size={OUTFIT} cx={keys(f, [[a, 1150], [b, 1000]])} cy={keys(f, [[a, 760], [b, 720]])} s={zkeys(f, [[a, 1.0], [b, 1.12]])} />
      <Mono text="UNION PACIFIC CREWS" x={110} y={90} size={28} at={a + 3} />
      <Note text="Irish immigrants" x={120} y={160} size={56} rot={-3} at={at('Irish') - 2} />
      <Note text="Civil War veterans (both armies)" x={140} y={250} size={56} rot={-3} at={at('Civil War veterans') - 2} />
      <Note text="formerly enslaved men" x={160} y={340} size={56} rot={-3} at={at('formerly enslaved') - 2} color="#ffffff" />
      <ScrimTag text="A. J. Russell, General John S. Casement and his outfit (Union Pacific), 1867–68 · Wikimedia Commons" x={34} y={1026} />
    </AbsoluteFill>
  );
};

/** 17-18 · Hell on Wheels: the AI-lithograph tent town wide (push), then a cut-in as the name lands. */
const Hell: React.FC<{close?: boolean}> = ({close}) => {
  const f = useCurrentFrame();
  const a = at('Behind them') - 1;
  const n = at('People called') - 1;
  const b = at('And the Union') - 1;
  return (
    <AbsoluteFill>
      {close ? <PhotoCam src="img/ch03/litho_hell_on_wheels.jpg" size={HOW} cx={keys(f, [[n, 700], [b, 760]])} cy={760} s={zkeys(f, [[n, 1.75], [b, 1.6]])} bw="saturate(0.55) contrast(1.05) brightness(0.92)" />
        : <PhotoCam src="img/ch03/litho_hell_on_wheels.jpg" size={HOW} cx={keys(f, [[a, 960], [n, 900]])} cy={keys(f, [[a, 548], [n, 600]])} s={zkeys(f, [[a, 1.0], [n, 1.12]])} bw="saturate(0.55) contrast(1.05) brightness(0.92)" />}
      {!close && <>
        <Note text="tent towns: saloons, gambling" x={110} y={110} size={56} rot={-3} at={at('saloons') - 3} />
        <Note text="packed up every few weeks →" x={130} y={200} size={56} rot={-3} at={at('packed up') - 2} color="#ffffff" />
      </>}
      {close && <>
        <SlapTitle text="“HELL ON WHEELS”" x={110} y={90} size={110} at={at('Hell') + 1} seed={59} />
        <Note text="(says it all)" x={140} y={260} size={56} rot={-3} at={at('tells you') - 2} color="#ffffff" />
      </>}
      <ScrimTag text={HOW_TAG} x={34} y={1026} />
    </AbsoluteFill>
  );
};

/** 19-20 · The hunting grounds of the Lakota, Cheyenne and Arapaho; the line runs straight through. Then: hold that thought. */
const Hunting: React.FC<{hold?: boolean}> = ({hold}) => {
  const a = at('And the Union') - 1;
  const h = at('Hold that') - 1;
  const b = at('So the Union') - 1;
  const ks = hold ? [{f: h, x: 2150, y: 1000, z: 0.8, tilt: 52, rot: -6}, {f: b, x: 2150, y: 990, z: 0.9, tilt: 54, rot: -8}]
    : [{f: a, x: 2300, y: 1100, z: 0.5, tilt: 44, rot: 4}, {f: h, x: 2200, y: 1050, z: 0.6, tilt: 50, rot: -2}];
  const hunt = LINES.hunt;
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MRegion api={api} pts={hunt} at={hold ? -99 : at('hunting grounds') - 2} />
          <MRoute api={api} pts={LINES.up} at={hold ? -99 : a} dur={24} color={CORAL} width={8} />
          <MPin api={api} at={[hunt[1][0] + 80, hunt[1][1] + 140]} show={hold ? -99 : at('Lakota') - 1} label="Lakota" size={56} color="#ffffff" />
          <MPin api={api} at={[hunt[6][0] + 110, hunt[6][1] - 30]} show={hold ? -99 : at('Cheyenne') - 1} label="Cheyenne" size={56} color="#ffffff" />
          <MPin api={api} at={[hunt[8][0] + 120, hunt[8][1] - 120]} show={hold ? -99 : at('Arapaho') - 1} label="Arapaho" size={56} color="#ffffff" />
        </>}
      </WestMap>
      {!hold && <Note text="hunting grounds" x={120} y={110} size={64} rot={-3} at={at('hunting grounds') - 2} />}
      {hold && <>
        <Hand parts={[['hold that thought', '#ffffff']]} x={110} y={90} size={74} at={at('Hold that') - 2} />
        <Hand parts={[['→ Episode 4']]} x={150} y={210} size={84} at={at('last episode') - 2} />
      </>}
      <ScrimTag text="Hunting grounds: 1851 Fort Laramie treaty territories, merged and simplified, approx. · map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** 21-22 · "So the Union Pacific had the Plains. The Central Pacific had a mountain." The ribbon: flat east, then the Sierra. */
const Ending: React.FC<{mountain?: boolean}> = ({mountain}) => {
  const f = useCurrentFrame();
  const a = at('So the Union') - 1;
  const m = at('The Central Pacific had a') - 1;
  const lit = [1e7, 1e7, 1e7, 1e7, 1e7];
  return (
    <AbsoluteFill>
      {mountain ? <Ribbon fx={keys(f, [[m, RX(260)], [END + 60, RX(110)]])} tilt={keys(f, [[m, 58], [END + 60, 52]])} spin={keys(f, [[m, -10], [END + 60, -16]])} z={zkeys(f, [[m, 1.3], [END + 60, 1.75]])} dy={160}
        lit={lit} cpMi={6} upMi={1300} />
        : <Ribbon fx={keys(f, [[a, RX(1500)], [m, RX(1350)]])} tilt={keys(f, [[a, 62], [m, 58]])} spin={keys(f, [[a, 10], [m, 6]])} z={zkeys(f, [[a, 1.15], [m, 1.25]])} dy={110} lit={lit} cpMi={6} upMi={1300} />}
      {!mountain && <Note text="the Union Pacific: the Plains" x={110} y={110} size={60} rot={-3} at={at('had the Plains') - 2} />}
      {mountain && <Hand parts={[['the Central Pacific: '], ['a mountain', CORAL]]} x={110} y={100} size={80} at={at('a mountain') - 2} />}
      <ScrimTag text="Elevations approx., heights exaggerated · ridges and engines: illustration (AI lithograph)" />
    </AbsoluteFill>
  );
};

const Sounds: React.FC = () => {
  const c = (w: string) => at(w) - 1;
  const W = (w: string) => at(w) - 4;
  const sfx: [number, string, number][] = [
    [8, 'block_tap_soft', 0.15], [at('Central Pacific') + 2, 'stamp', 0.22], [W('harder start'), 'marker_tick', 0.2],
    [c('Just past') - 4, 'whip_soft', 0.22], [W('wall'), 'marker_tick', 0.2], [at('Sierra') + 1, 'stamp', 0.22],
    [c('And the company'), 'whoosh', 0.2], [W("couldn't keep"), 'marker_tick', 0.2], [W('signed on'), 'marker_tick', 0.2],
    [c('and walked off'), 'whoosh', 0.2], [at('and walked off') + 1, 'paper_slap_soft', 0.25], [at('and walked off') + 4, 'tape_press', 0.18], [W('walked off'), 'marker_tick', 0.2], [W('gold and silver'), 'marker_tick', 0.2],
    [c('So in 1865') - 4, 'whip_soft', 0.22], [at('1865') + 1, 'stamp', 0.22], [at('Charles'), 'paper_slap_soft', 0.25], [at('Charles') + 3, 'tape_press', 0.18], [at('Crocker') + 2, 'stamp', 0.2],
    [W('boss'), 'marker_tick', 0.2], [W('something new'), 'marker_tick', 0.2],
    [c('He hired'), 'whoosh', 0.2], [at('50') + 1, 'stamp', 0.22], ...[0, 1, 2, 3, 4].map((i) => [at('50') + 4 + i * 6, 'block_tap_soft', 0.1] as [number, string, number]), [W('gold rush') + 1, 'marker_tick', 0.2],
    [c('His construction'), 'whoosh', 0.2], [W('foreman'), 'marker_tick', 0.2],
    [c('Crocker reportedly') - 4, 'whip_soft', 0.22], [W('reportedly'), 'marker_tick', 0.2], [W('ancestors') - 2, 'marker_tick', 0.2], [W('Great Wall') - 2, 'marker_tick', 0.2],
    [c('The 50'), 'whoosh', 0.2], [W('worked out'), 'marker_tick', 0.2], [at('most of the Central') - 2, 'card_slide_soft', 0.2], [at('workforce') + 4, 'marker_tick', 0.2],
    [c('Thousands'), 'whoosh', 0.2], [at('Thousands') + 1, 'stamp', 0.22], [W('southern China') + 1, 'marker_tick', 0.2],
    [c('They were not paid') - 4, 'whip_soft', 0.22], [at('not paid') + 2, 'stamp', 0.22], [at('Chinese workers earned') - 1, 'paper_slap_soft', 0.25], [W('less than') + 2, 'marker_tick', 0.2], [W('buy their own') + 2, 'marker_tick', 0.2],
    [c('White workers'), 'whoosh', 0.2], [at('White workers'), 'paper_slap_soft', 0.25], [at('White workers') + 4, 'marker_tick', 0.2], [W('meals') + 2, 'marker_tick', 0.2],
    [c('They did have') - 4, 'whip_soft', 0.22], [W('tea') + 2, 'marker_tick', 0.2], [W('boiled') + 2, 'marker_tick', 0.2], [W('barrels'), 'marker_tick', 0.2],
    [c('White crews mostly') - 4, 'whip_soft', 0.22], [W('streams') - 4, 'marker_tick', 0.2],
    [c('Guess'), 'whoosh', 0.18], [W('Guess') + 2, 'marker_tick', 0.2], [at('less often') + 4, 'marker_tick', 0.2],
    [c('Meanwhile') - 4, 'whip_soft', 0.25], [at('Union Pacific') + 2, 'stamp', 0.22], [W('flat Great Plains') + 2, 'marker_tick', 0.2],
    [c('Its crews'), 'whoosh', 0.2], [W('Irish') + 2, 'marker_tick', 0.2], [W('Civil War veterans') + 2, 'marker_tick', 0.2], [W('formerly enslaved') + 2, 'marker_tick', 0.2],
    [c('Behind them'), 'whoosh', 0.2], [W('saloons'), 'marker_tick', 0.2], [W('packed up') + 2, 'marker_tick', 0.2],
    [c('People called'), 'whoosh', 0.2], [at('Hell') + 1, 'stamp', 0.22], [W('tells you') + 2, 'marker_tick', 0.2],
    [c('And the Union') - 4, 'whip_soft', 0.22], [W('hunting grounds') + 2, 'marker_tick', 0.2], [at('Lakota') - 1, 'block_tap_soft', 0.14], [at('Cheyenne') - 1, 'block_tap_soft', 0.14], [at('Arapaho') - 1, 'block_tap_soft', 0.14],
    [c('Hold that'), 'whoosh', 0.18], [W('Hold that') + 2, 'marker_tick', 0.2], [W('last episode') + 2, 'marker_tick', 0.2],
    [c('So the Union') - 4, 'whip_soft', 0.22], [W('had the Plains') + 2, 'marker_tick', 0.2],
    [c('The Central Pacific had a'), 'whoosh', 0.2], [W('a mountain') + 2, 'marker_tick', 0.2],
  ];
  return <>{sfx.map(([fr, n, v], i) => <Sfx key={i} at={fr} src={`sfx/${n}.wav`} volume={v} />)}</>;
};

const Body: React.FC = () => {
  const shots: [number, React.ReactNode, ('whip' | 'cut')?][] = [
    [0, <Start />],
    [at('Just past') - 1, <Wall />, 'whip'],
    [at('And the company') - 1, <Summit />, 'cut'],
    [at('and walked off') - 1, <Mines />, 'cut'],
    [at('So in 1865') - 1, <Crocker />, 'whip'],
    [at('He hired') - 1, <Fifty />, 'cut'],
    [at('His construction') - 1, <TooSmall />, 'cut'],
    [at('Crocker reportedly') - 1, <GreatWall />, 'whip'],
    [at('The 50') - 1, <Workforce />, 'cut'],
    [at('Thousands') - 1, <Thousands />, 'cut'],
    [at('They were not paid') - 1, <Pay />, 'whip'],
    [at('White workers') - 1, <Pay close />, 'cut'],
    [at('They did have') - 1, <Tea phase={0} />, 'whip'],
    [at('White crews mostly') - 1, <Tea phase={1} />, 'whip'],
    [at('Guess') - 1, <Tea phase={2} />, 'cut'],
    [at('Meanwhile') - 1, <Plains />, 'whip'],
    [at('Its crews') - 1, <Crews />, 'cut'],
    [at('Behind them') - 1, <Hell />, 'cut'],
    [at('People called') - 1, <Hell close />, 'cut'],
    [at('And the Union') - 1, <Hunting />, 'whip'],
    [at('Hold that') - 1, <Hunting hold />, 'cut'],
    [at('So the Union') - 1, <Ending />, 'whip'],
    [at('The Central Pacific had a') - 1, <Ending mountain />, 'cut'],
  ];
  return (
    <>
      <Shots shots={shots} />
      <Sounds />
    </>
  );
};

export const Ch03: React.FC = () => (
  // SUNO: aw_iron_horse replaces this (g_cotton_engine is the library fallback)
  <ChapterShell n={N} audio="audio/ch03_the_race.wav" lead={LEAD} music={[{src: 'music/g_cotton_engine.mp3', volume: 0.15}]}>
    <Body />
  </ChapterShell>
);
void Arrow;
