// Chapter 2 · One Election: Lincoln wins in November 1860 on a promise to stop slavery spreading west; he wasn't on the
// ballot in ten Southern states; South Carolina leaves on December 20; seven states are gone by February (Davis, Montgomery);
// and Lincoln hasn't taken office yet.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import words from '../../public/audio/ch02_one_election.words.json';
import data from '../../public/maps/civwar1861.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {Desk, DropCard} from '../kit/bs';
import {Doc, sizeOf} from '../kit/dk';
import {type Cam3, Count, Hand, MAP3D, Map3D, type MapData, Pin3, PlaceTag, Stand, StateTiles, UNION_FREE_1861} from '../kit/map3d';
import {Parallax} from '../kit/parallax';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);

const D = data as unknown as MapData;
const pl = D.places as Record<string, [number, number]>;
const CORAL = '#FF6F61';
const BONE = '#EDE7DC';
const U = (n: string[]) => n.map((s) => `USA:${s}`);
const FIRST_SEVEN = U(['South Carolina', 'Mississippi', 'Florida', 'Alabama', 'Georgia', 'Louisiana', 'Texas']);
/** The ten states where Lincoln's name wasn't on the ballot in 1860. */
const NO_BALLOT = U(['South Carolina', 'Georgia', 'Florida', 'Alabama', 'Mississippi', 'Louisiana', 'Texas', 'Arkansas', 'Tennessee', 'North Carolina']);

const LINCOLN = 'img/ch02/lincoln_campaign_portrait_grozelier_1860.jpg';
const LINCOLN_TAG = 'Leopold Grozelier after Thomas Hicks, Hon. Abraham Lincoln, lithograph, 1860 · Library of Congress';
const CARTOON = 'img/ch02/dividing_the_national_map_cartoon_1860.jpg';
const ORDINANCE = 'img/ch02/sc_ordinance_of_secession_printed_1860.jpg';
const DAVIS = 'img/ch02/davis_portrait_brady_1859.jpg';

/** A hand-drawn strike through a rejected idea (orange, 5 frames). */
const Strike: React.FC<{x1: number; x2: number; y: number; at: number}> = ({x1, x2, y, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 5], [0, 1], clamp);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <path d={`M${x1},${y + 6} Q${(x1 + x2) / 2},${y - 10} ${x2},${y - 4}`} fill="none" stroke="#FF9F1C" strokeWidth={8} strokeLinecap="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/** A hand-drawn teal tick. */
const Tick: React.FC<{x: number; y: number; at: number; s?: number}> = ({x, y, at, s = 1}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 5], [0, 1], clamp);
  return (
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={80 * s} height={70 * s}>
      <path d={`M${4 * s},${36 * s} L${28 * s},${62 * s} L${76 * s},${6 * s}`} fill="none" stroke={pal.mark} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/** Lincoln full frame (2.5D, coral subject), notes on the left over a dark band. */
const LincolnShot: React.FC<{a: number; b: number; z: [number, number]; traceAt: number; children?: React.ReactNode}> = ({a, b, z, traceAt, children}) => (
  <Parallax name="lincoln" src={LINCOLN} size={sizeOf(LINCOLN)} a={a} b={b} fx={0} fy={0.3} cam={{z}} depth={1.05} mask={MASKS.lincoln} traceAt={traceAt}
    vignette={0.55} tag={LINCOLN_TAG}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to right, rgba(10,9,7,0.92) 0%, rgba(10,9,7,0.82) 34%, rgba(0,0,0,0) 54%)'}} />
        {children}
      </>
    )}
  </Parallax>
);

/** November 1860: Lincoln wins. */
const Wins: React.FC<{t: TL}> = ({t}) => (
  <LincolnShot a={-10} b={t.at("Lincoln's party")} z={[1.04, 1.12]} traceAt={t.at('Abraham Lincoln') + 3}>
    <Note text="it starts with an election" x={100} y={110} size={50} rot={-3} at={t.at('It starts') + 2} color="#ffffff" />
    <Highlight text="NOVEMBER 1860" x={100} y={250} size={96} at={t.at('November 1860')} seed={201} rot={-2} />
    <Note text="Abraham Lincoln wins" x={110} y={440} size={58} rot={-3} at={t.at('Abraham Lincoln') - 3} />
  </LincolnShot>
);

/** The Republicans' one big promise: keep slavery out of the territories. Not end it; stop it spreading. */
const Promise: React.FC<{t: TL}> = ({t}) => {
  const a = t.at("Lincoln's party") - 1;
  return (
    <Desk a={a}>
      <DropCard src={CARTOON} x={100} y={110} w={800} rot={-2} at={a} />
      <Highlight text="THE REPUBLICANS" x={1010} y={110} size={74} at={t.at('the Republicans')} seed={203} rot={-2} />
      <Note text="one big promise:" x={1030} y={250} size={50} rot={-3} at={t.at('one big promise') - 3} color="#ffffff" />
      <Note text="keep slavery out of the west" x={1030} y={350} size={52} rot={-3} at={t.at('keep slavery') - 3} />
      <Note text="territories = land out west, not yet states" x={110} y={800} size={50} rot={-2} at={t.at('the land out') - 3} color="#ffffff" />
      <Note text="end it" x={1060} y={500} size={56} rot={-3} at={t.at('Not end') - 3} color="#ffffff" />
      <Strike x1={1050} x2={1250} y={555} at={t.at('where it already') - 2} />
      <Note text="stop it spreading" x={1060} y={620} size={56} rot={-3} at={t.at('Just stop') - 3} />
      <Tick x={1630} y={600} at={t.at('spreading') + 2} />
      <Tag text="[Dividing the] National [Map], cartoon, 1860 · Library of Congress" />
    </Desk>
  );
};

/** For the South that was enough; and Lincoln wasn't on the ballot in ten Southern states. */
const Ballot: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('For much') - 1;
  const b = t.at('ballot');
  const keys: Cam3[] = [{f: a, x: 3000, y: 2500, z: 0.34, tilt: 34, rot: 0}, {f: t.at('Imagine'), x: 2850, y: 2620, z: 0.38, tilt: 42, rot: -4}];
  return (
    <>
      <Map3D data={D} keys={keys} states={0.6} rivers={0.35}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={a + 4} stagger={0} h={14} color={MAP3D.free} />
            <StateTiles api={api} names={NO_BALLOT} at={b} stagger={2} h={44} color={MAP3D.grey} />
            <Stand api={api} at={[2700, 3150]} z={70} show={b + 12}><Hand text="no Lincoln ballots" size={72} color="#f4efe6" rot={-2} bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Note text="for much of the South: enough" x={90} y={70} size={50} rot={-2} at={t.at('enough') - 3} color="#ffffff" out={b} />
        <Note text="slavery that can't grow → slowly dies" x={90} y={170} size={50} rot={-2} at={t.at('slowly die') - 6} out={b} />
        <Note text="and Lincoln won without them" x={90} y={270} size={50} rot={-2} at={t.at('won without') - 3} color="#ffffff" out={b} />
        <div style={{position: 'absolute', left: 90, top: 70}}><Count to={10} at={t.at('ten Southern')} dur={14} suffix=" states" size={96} color="#f4efe6" /></div>
        <Note text="not even on the ballot" x={100} y={190} size={54} rot={-2} at={t.at('ten Southern') + 4} />
      </AbsoluteFill>
    </>
  );
};

/** Imagine winning class president without one vote from half the school. A drawn ballot box and a tally. */
const ClassPresident: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('Imagine') - 1;
  const box = interpolate(g, [a + 2, a + 12], [0, 1], clamp);
  const ticks = Math.floor(interpolate(g, [t.at('without one') - 6, t.at('vote from') + 4], [0, 12], clamp));
  const st = {fill: 'none', stroke: pal.mark, strokeWidth: 7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="CLASS PRESIDENT" x={110} y={90} size={90} at={t.at('class president')} seed={205} rot={-2} />
      {/* the ballot box */}
      <svg style={{position: 'absolute', left: 170, top: 380, overflow: 'visible'}} width={420} height={420}>
        <path d="M20,120 L392,112 L400,400 L14,406 Z" {...st} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - box} />
        <path d="M20,120 L110,40 L470,36 L392,112" {...st} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - box} />
        <path d="M470,36 L476,320 L400,400" {...st} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - box} />
        {box >= 1 && <path d="M190,74 L330,72" {...st} strokeWidth={10} />}
        {box >= 1 && <text x={207} y={290} textAnchor="middle" fontFamily={JF.display} fontSize={64} fill={pal.mark}>VOTE</text>}
      </svg>
      {/* the two halves of the school */}
      <div style={{position: 'absolute', left: 820, top: 330, width: 1, height: 520, background: 'rgba(244,239,230,0.5)'}} />
      <div style={{position: 'absolute', left: 1320, top: 330, width: 1, height: 520, background: 'rgba(244,239,230,0.5)'}} />
      {g >= t.at('without one') - 6 && (
        <>
          <div style={{position: 'absolute', left: 860, top: 360, fontFamily: JF.mono, fontSize: 28, letterSpacing: 3, color: '#f4efe6'}}>THIS HALF</div>
          <div style={{position: 'absolute', left: 1360, top: 360, fontFamily: JF.mono, fontSize: 28, letterSpacing: 3, color: '#f4efe6'}}>THAT HALF</div>
          <svg style={{position: 'absolute', left: 870, top: 440, overflow: 'visible'}} width={420} height={300}>
            {Array.from({length: ticks}).map((_, i) => {
              const grp = Math.floor(i / 5);
              const k = i % 5;
              const x0 = (grp % 2) * 200 + k * 30;
              const y0 = Math.floor(grp / 2) * 140;
              return k === 4
                ? <path key={i} d={`M${x0 - 125},${y0 + 90} L${x0 + 10},${y0 + 20}`} {...st} stroke="#f4efe6" strokeWidth={6} />
                : <path key={i} d={`M${x0},${y0} L${x0 + 4},${y0 + 110}`} {...st} stroke="#f4efe6" strokeWidth={6} />;
            })}
          </svg>
        </>
      )}
      {g >= t.at('half the school') - 2 && (
        <div style={{position: 'absolute', left: 1440, top: 430, fontFamily: JF.display, fontSize: 220, lineHeight: 1, color: pal.subject,
          transform: `scale(${interpolate(g, [t.at('half the school') - 2, t.at('half the school') + 1, t.at('half the school') + 4], [1.35, 0.95, 1], clamp)})`}}>0</div>
      )}
      <Note text="0 votes from half the school" x={960} y={760} size={50} rot={-3} at={t.at('school') - 3} color={pal.subject} />
      <Arrow x1={1560} y1={765} x2={1520} y2={665} bow={14} at={t.at('school') + 6} color={pal.subject} />
      <Note text="that's how it looked in the South" x={170} y={900} size={50} rot={-2} at={t.at('To much') - 3} color="#ffffff" />
    </AbsoluteFill>
  );
};

/** December 20, 1860: South Carolina votes to leave. SECESSION. */
const Secession: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Six weeks') - 1;
  return (
    <Desk a={a}>
      <Doc src={ORDINANCE} x={150} y={70} w={560} rot={-1.5} at={a} push={[a, t.at('By February')]} fx={957} fy={600} zoom={1.08}
        marks={[{at: t.at('South Carolina votes') + 2, ellipse: [957, 340, 330, 70], seed: 2}]} />
      <Note text="six weeks later" x={860} y={110} size={50} rot={-3} at={t.at('Six weeks') + 2} color="#ffffff" />
      <Highlight text="DECEMBER 20, 1860" x={860} y={210} size={80} at={t.at('December 20th')} seed={207} rot={-2} />
      <Note text="South Carolina votes to leave" x={880} y={360} size={52} rot={-3} at={t.at('votes to leave') - 3} />
      <Highlight text="SECESSION" x={860} y={560} size={110} at={t.at('secession')} seed={209} rot={-2} />
      <Definition term="se·ces·sion" def="a state declaring it is no longer part of the United States" at={t.at('secession') + 9} x={870} y={730} w={960} />
      <Tag text="An Ordinance to Dissolve the Union, South Carolina convention, printed Dec. 1860 · Internet Archive" />
    </Desk>
  );
};

/** By February, seven states are gone: the Confederate States of America, Jefferson Davis as president. */
const Seven: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('By February') - 1;
  const s7 = t.at('seven states');
  const dv = t.at('Jefferson Davis') - 2;
  const g = useGFrame();
  const keys: Cam3[] = [{f: a, x: 2850, y: 2600, z: 0.36, tilt: 36, rot: 0}, {f: t.at('And notice'), x: 2780, y: 2680, z: 0.4, tilt: 44, rot: -4}];
  return (
    <>
      <Map3D data={D} keys={keys} states={0.6} rivers={0.4}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={a} stagger={0} h={14} color={MAP3D.free} />
            <StateTiles api={api} names={FIRST_SEVEN} at={s7 - 2} stagger={3} h={60} color={CORAL} />
            <Stand api={api} at={pl.montgomery} z={70} show={t.at('Confederate States') - 2}><Pin3 /></Stand>
            <Stand api={api} at={[pl.montgomery[0] - 40, pl.montgomery[1] + 160]} z={70} show={t.at('Confederate States')}><PlaceTag text="Montgomery · Feb 1861" size={34} /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Note text="by February" x={92} y={60} size={50} rot={-2} at={t.at('By February') + 2} color="#ffffff" />
        <div style={{position: 'absolute', left: 90, top: 150}}><Count to={7} at={s7} dur={20} suffix=" states gone" size={84} color={CORAL} /></div>
        <Note text="the Confederate States of America" x={92} y={260} size={50} rot={-2} at={t.at('Confederate States') - 3} />
        <CropCard src={DAVIS} size={sizeOf(DAVIS)} x={1430} y={170} w={380} h={500} fx={1190} fy={1000} scale={0.3} rot={2} at={dv} mask={MASKS.davis} tintStrength={0.6} traceAt={dv + 4} />
        <Note text="president: Jefferson Davis" x={1230} y={730} size={42} rot={-3} at={dv + 4} color="#ffffff" />
        {g >= dv && <Tag text="Mathew Brady, Jefferson Davis, photograph, 1859 · Library of Congress" />}
      </AbsoluteFill>
    </>
  );
};

/** Lincoln won't take office until March: he hadn't done anything yet. A month strip, Nov to March. */
const NotYet: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('And notice') - 1;
  const months = ['NOV', 'DEC', 'JAN', 'FEB', 'MAR'];
  const x0 = 100;
  const w = 136;
  const gap = 12;
  return (
    <LincolnShot a={a} b={CH02_FRAMES} z={[1.1, 1.16]} traceAt={a + 4}>
      <Note text="notice:" x={100} y={90} size={52} rot={-3} at={t.at('notice') - 3} color="#ffffff" />
      {g >= t.at('take office') - 6 && months.map((m, i) => {
        const at = t.at('take office') - 6 + i * 2;
        if (g < at) return null;
        const k = interpolate(g, [at, at + 4], [0.6, 1], clamp);
        return (
          <div key={m} style={{position: 'absolute', left: x0 + i * (w + gap), top: 250, width: w, height: 120, border: `4px solid ${i === 4 ? pal.mark : 'rgba(244,239,230,0.75)'}`,
            borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: JF.display, fontSize: 44, color: '#f4efe6', transform: `scale(${k})`,
            background: 'rgba(0,0,0,0.35)'}}>{m}</div>
        );
      })}
      <Note text="wins" x={x0 + 18} y={385} size={44} rot={-3} at={t.at('take office') - 2} color="#ffffff" />
      <Loop cx={x0 + 4 * (w + gap) + w / 2} cy={310} rx={96} ry={86} at={t.at('until March')} seed={21} />
      <Note text="takes office" x={x0 + 3 * (w + gap) + 30} y={385} size={44} rot={-3} at={t.at('until March') + 2} />
      <Note text="Nov → March: still not president" x={100} y={520} size={52} rot={-2} at={t.at('So whatever') - 3} color="#ffffff" />
      <Note text="he hadn't done anything yet" x={100} y={800} size={64} rot={-3} at={t.at("He hadn't") - 2} color={pal.subject} />
    </LincolnShot>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Wins t={t} />],
    [at("Lincoln's party") - 1, <Promise t={t} />],
    [at('For much') - 1, <Ballot t={t} />],
    [at('Imagine') - 1, <ClassPresident t={t} />],
    [at('Six weeks') - 1, <Secession t={t} />],
    [at('By February') - 1, <Seven t={t} />],
    [at('And notice') - 1, <NotYet t={t} />],
  ];
  const stamps = [at('November 1860'), at('the Republicans'), at('class president'), at('December 20th'), at('secession')];
  const writes = ['It starts', 'Abraham Lincoln', 'one big promise', 'keep slavery', 'the land out', 'Not end', 'Just stop', 'enough', 'slowly die', 'won without',
    'ten Southern', 'school', 'To much', 'Six weeks', 'votes to leave', 'By February', 'Confederate States', 'Jefferson Davis', 'notice', 'take office', 'until March',
    'So whatever', "He hadn't"];
  const ticks = [at("Lincoln's party") - 1, at('ballot'), at('seven states'), at('Confederate States') - 2, at('Jefferson Davis') - 2, at('take office') - 6];
  return (
    <>
      {useScene(cuts)}
      {cuts.slice(1).map(([f], i) => <Sfx key={`c${i}`} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {stamps.map((f, i) => <Sfx key={`s${i}`} at={f} src="sfx/stamp.wav" volume={0.28} />)}
      {writes.map((p) => <Sfx key={p} at={at(p) - 5} src={WRITE.src} volume={WRITE.volume} />)}
      {ticks.map((f, i) => <Sfx key={`t${i}`} at={f} src="sfx/tick.wav" volume={0.4} />)}
      <Sfx at={at('half the school') - 2} src="sfx/stamp.wav" volume={0.26} />
    </>
  );
};

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_one_election.wav" lead={LEAD} music={[{src: 'music/g_grip.mp3', volume: 0.093}]}>
    <Body />
  </ChapterShell>
);
