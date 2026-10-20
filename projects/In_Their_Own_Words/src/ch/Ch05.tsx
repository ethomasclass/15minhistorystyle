// Chapter 5 · Fort Sumter: Lincoln's dilemma, "only food", the first shots, 75,000 volunteers and the blockade,
// the upper South leaves (11 states), the four border states stay, and who decided on war.
import React from 'react';
import {AbsoluteFill, interpolate, random} from 'remotion';
import mapData from '../../public/maps/civwar1861.json';
import words from '../../public/audio/ch05_fort_sumter.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {sizeOf} from '../kit/dk';
import {Engraving} from '../kit/engraving';
import {
  type Cam3, CONFEDERACY_1861, centreOf, Count, MAP3D, Map3D, type MapData, PlaceTag, Pin3, Stand, StateTiles, UNION_FREE_1861,
} from '../kit/map3d';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, Photo, Stamp, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH05_FRAMES = chapterFrames(N, LEAD);

const D = mapData as unknown as MapData;
const pl = D.places as Record<string, [number, number]>;
const CORAL = '#FF6F61';
const WHITE = '#ffffff';
const U = (n: string[]) => n.map((s) => `USA:${s}`);
const FIRST_SEVEN = U(['South Carolina', 'Mississippi', 'Florida', 'Alabama', 'Georgia', 'Louisiana', 'Texas']);

const HARBOR = 'img/ch05/hw_charleston_harbor_forts_map_dec29_1860.jpg';
const RATIONS = 'img/gen/v1_ch05_last_rations.jpg';
const CURRIER = 'img/ch05/bombardment_fort_sumter_currier_ives_1861.jpg';
const ANDERSON = 'img/ch05/anderson_portrait_engraving_1861.jpg';
const INTERIOR = 'img/ch05/fort_sumter_interior_after_surrender_apr1861.jpg';

/** A hand-jittered rectangle in teal, drawn on (diagram box). */
const Box: React.FC<{x: number; y: number; w: number; h: number; at: number; label?: string; seed?: number; color?: string; size?: number}> = ({x, y, w, h, at, label, seed = 1, color, size = 64}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 8], [0, 1], clamp);
  const j = (k: string) => (random(`bx${seed}${k}`) - 0.5) * 10;
  const pts = [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x + 6, y - 4]];
  const d = pts.map(([px, py], i) => `${i ? 'L' : 'M'}${px + j(`x${i}`)},${py + j(`y${i}`)}`).join(' ');
  return (
    <>
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
        <path d={d} fill="rgba(0,0,0,0.25)" stroke={color ?? pal.mark} strokeWidth={6} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      </svg>
      {label && (
        <div style={{position: 'absolute', left: x, top: y, width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: JF.display,
          fontSize: size, color: '#f4efe6', whiteSpace: 'nowrap', opacity: interpolate(g, [at + 4, at + 8], [0, 1], clamp)}}>{label}</div>
      )}
    </>
  );
};

/** March 1861: Washington, then down the coast to Charleston Harbor and Fort Sumter, with the 1860 Harper's plan. */
const Harbor: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const glide = t.at('In Charleston');
  const keys: Cam3[] = [
    {f: 0, x: 3700, y: 2150, z: 0.55, tilt: 36, rot: 0},
    {f: glide - 10, x: 3720, y: 2250, z: 0.6, tilt: 38, rot: -2},
    {f: t.at('Fort Sumter') + 12, x: 3700, y: 3010, z: 1.35, tilt: 44, rot: -4},
    {f: t.at('and its soldiers'), x: 3710, y: 3020, z: 1.45, tilt: 46, rot: -6},
  ];
  const card = t.at('a U.S. Army') - 2;
  const S = 0.31;
  return (
    <>
      <Map3D data={D} keys={keys} states={0.6} rivers={0.4}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={-20} stagger={0} h={14} color={MAP3D.free} />
            <StateTiles api={api} names={FIRST_SEVEN} at={-20} stagger={0} h={40} color={CORAL} />
            <Stand api={api} at={pl.washingtonDC} z={14} show={t.at('Lincoln') - 2}><Pin3 color={MAP3D.free} /></Stand>
            <Stand api={api} at={[pl.washingtonDC[0] + 60, pl.washingtonDC[1] + 70]} z={70} show={t.at("Lincoln")} out={glide - 6}><PlaceTag text="Washington · Lincoln takes office" size={30} /></Stand>
            <Stand api={api} at={pl.fortSumter} z={40} show={t.at('Fort Sumter') - 2}><Pin3 /></Stand>
            <Stand api={api} at={[pl.fortSumter[0] - 40, pl.fortSumter[1] + 46]} z={90} show={t.at('Fort Sumter')}><PlaceTag text="Fort Sumter" size={32} /></Stand>
            <Stand api={api} at={[pl.charleston[0] - 260, pl.charleston[1] - 90]} z={60} show={t.at('Charleston') + 2}><PlaceTag text="Charleston" size={26} /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Highlight text="MARCH 1861" x={100} y={90} size={100} at={t.at('March')} seed={51} rot={-2} />
        <Note text="he has a problem" x={130} y={240} size={56} rot={-3} at={t.at('problem.') - 3} color={WHITE} />
        {g >= card && <AbsoluteFill style={{background: 'linear-gradient(to left, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 50%)'}} />}
        <CropCard src={HARBOR} size={sizeOf(HARBOR)} x={1080} y={250} w={760} h={540} fx={1995} fy={2180} scale={S} rot={1.5} at={card}>
          {(Sc) => {
            const [cx, cy] = Sc(2478, 2745);
            return <Loop cx={cx} cy={cy} rx={70} ry={44} at={t.at('Army fort') + 2} seed={53} tilt={-6} width={6} />;
          }}
        </CropCard>
        <Note text="a U.S. Army fort" x={1110} y={840} size={58} rot={-3} at={t.at('a U.S. Army') - 3} />
        {g >= card && <Tag text="Plan of the harbor of Charleston, Harper's Weekly, Dec. 29, 1860 · Internet Archive" />}
      </AbsoluteFill>
    </>
  );
};

/** Short rations inside the fort, then Lincoln's two bad choices over the same picture. */
const Rations: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('and its soldiers') - 1;
  const b = t.at('So he tells');
  const split = t.at('If he sends') - 1;
  const dim = interpolate(g, [split, split + 5], [0, 0.74], clamp);
  return (
    <Engraving src={RATIONS} px={sizeOf(RATIONS)} fx={645} fy={420} a={a} b={b} z0={1.0} z1={1.1}
      tag="Illustration · Fort Sumter's garrison running short of food, 1861">
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 30%)', opacity: 1 - dim}} />
          {g < split && <Note text="running out of food" x={120} y={850} size={62} rot={-3} at={t.at('running') - 3} />}
          <AbsoluteFill style={{background: '#0b0a08', opacity: dim}} />
          {g >= split && (
            <>
              <div style={{position: 'absolute', left: 958, top: 140, width: 4, height: 760, background: '#f4efe6', opacity: 0.8}} />
              <div style={{position: 'absolute', left: 150, top: 170, fontFamily: JF.mono, fontSize: 40, letterSpacing: 3, color: pal.mark}}>IF HE SENDS WARSHIPS</div>
              <div style={{position: 'absolute', left: 1060, top: 170, fontFamily: JF.mono, fontSize: 40, letterSpacing: 3, color: pal.subject, opacity: g >= t.at('If he does') ? 1 : 0}}>IF HE DOES NOTHING</div>
            </>
          )}
          <Arrow x1={330} y1={260} x2={330} y2={400} bow={14} at={t.at('looks like') - 4} />
          <Note text="he looks like" x={170} y={430} size={62} rot={-3} at={t.at('looks like') - 3} color={WHITE} />
          <Note text="he started a war" x={190} y={540} size={66} rot={-3} at={t.at('started') - 3} />
          <Arrow x1={1240} y1={260} x2={1240} y2={400} bow={-14} at={t.at('gives up') - 4} />
          <Note text="he gives up" x={1080} y={430} size={62} rot={-3} at={t.at('gives up') - 3} color={WHITE} />
          <Note text="the fort" x={1100} y={540} size={66} rot={-3} at={t.at('the fort.') - 3} color={pal.subject} />
          <Note text="either way, he loses" x={560} y={760} size={58} rot={-2} at={t.at('the fort.') + 12} color={WHITE} />
        </>
      )}
    </Engraving>
  );
};

/** Lincoln's message to the governor, with the key words highlighted as they're said. */
const MESSAGE: {text: string; mark?: string}[] = [
  {text: 'an attempt will be made to supply Fort-Sumpter with '},
  {text: 'provisions only', mark: 'Only food.'},
  {text: '; and that, if such attempt be not resisted, no effort to throw in '},
  {text: 'men, arms, or ammunition', mark: 'No new troops,'},
  {text: ', will be made…'},
];

const OnlyFood: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('So he tells') - 1;
  const k = interpolate(g, [a, a + 6], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 140, top: 100, width: 1640, opacity: k}}>
        <div style={{fontFamily: JF.heavy, fontWeight: 900, fontSize: 50, lineHeight: 1.32, color: '#f4efe6', textShadow: '0 3px 14px #000'}}>
          “{MESSAGE.map((s, i) => {
            if (!s.mark) return <span key={i}>{s.text}</span>;
            const m = t.at(s.mark) - 2;
            const p = interpolate(g, [m, m + 10], [0, 100], clamp);
            return <span key={i} style={{backgroundImage: `linear-gradient(to right, ${pal.subject}aa ${p}%, transparent ${p}%)`}}>{s.text}</span>;
          })}”
        </div>
        <div style={{marginTop: 22, fontFamily: JF.mono, fontSize: 24, letterSpacing: 2, color: 'rgba(244,239,230,0.8)'}}>LINCOLN'S MESSAGE TO SOUTH CAROLINA'S GOVERNOR, APRIL 6, 1861</div>
      </div>
      <Highlight text="ONLY FOOD." x={140} y={600} size={120} at={t.at('Only food.')} seed={55} rot={-2} />
      <Note text="no new troops" x={1060} y={570} size={60} rot={-3} at={t.at('No new troops,') - 3} color={WHITE} />
      <Note text="no guns" x={1080} y={680} size={60} rot={-3} at={t.at('no guns,') - 3} color={WHITE} />
      <Note text="unless the fort is attacked" x={900} y={820} size={60} rot={-3} at={t.at('unless') - 3} />
      <Tag text="Transcription of Lincoln to Gov. Francis Pickens, delivered by Robert S. Chew, April 1861 · Papers of Abraham Lincoln, Library of Congress" />
    </AbsoluteFill>
  );
};

/** A drawn match: the Confederacy's move. */
const Match: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const at = t.at('match') - 2;
  const p = interpolate(g, [at, at + 10], [0, 1], clamp);
  const head = interpolate(g, [at + 8, at + 12], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="basically handing the Confederacy..." x={140} y={120} size={56} rot={-2} at={t.at("It's basically") - 3} color={WHITE} />
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
        <path d="M520,760 L1180,430" stroke={pal.mark} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} fill="none" />
        <path d="M520,760 L1180,430" stroke="#16140f" strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} fill="none" />
        <ellipse cx={1200} cy={420} rx={46 * head} ry={34 * head} fill={pal.subject} transform="rotate(-27 1200 420)" />
      </svg>
      <Highlight text="A MATCH" x={1180} y={560} size={100} at={t.at('match')} seed={57} rot={-2} />
      <Note text="your move" x={1290} y={250} size={70} rot={-5} at={t.at('asking:') - 3} color={pal.subject} />
      <Note text="do you really want to be the one who lights it?" x={170} y={880} size={54} rot={-2} at={t.at('do you really') - 3} color={WHITE} />
    </AbsoluteFill>
  );
};

/** They did: the Currier & Ives print. */
const Bombardment: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('They did.') - 1;
  return (
    <Photo src={CURRIER} size={sizeOf(CURRIER)} fx={1300} fy={850} z0={1.04} z1={1.16} a={a} b={t.at('the fort surrenders') + 10} bw="grayscale(1) contrast(1.3) brightness(0.95)">
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 32%)'}} />
          <Note text="they did." x={1420} y={110} size={72} rot={-4} at={a + 2} color={CORAL} />
          <Highlight text="APRIL 12, 1861" x={100} y={90} size={100} at={t.at('April')} seed={59} rot={-2} />
          <Note text="Confederate cannons open fire" x={120} y={240} size={54} rot={-3} at={t.at('Confederate cannons') - 3} color={WHITE} />
          <Note text="about a day and a half of shelling" x={120} y={880} size={58} rot={-2} at={t.at('After about') - 3} />
          <Tag text="Currier & Ives, Bombardment of Fort Sumter, Charleston Harbor, 1861 · Library of Congress" />
        </>
      )}
    </Photo>
  );
};

/** The fort surrenders: Anderson, the battered interior, and no one killed. */
const Surrender: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('the fort surrenders') - 1;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src={ANDERSON} size={sizeOf(ANDERSON)} x={130} y={110} w={520} h={680} fx={1240} fy={1920} scale={0.43} rot={-2} at={a}
        mask={MASKS.anderson} tintStrength={0.5} traceAt={a + 6} />
      <Note text="Maj. Robert Anderson" x={140} y={860} size={52} rot={-3} at={a + 6} color={WHITE} />
      <Note text="in command of the fort" x={160} y={950} size={44} rot={-3} at={a + 10} color={WHITE} />
      <CropCard src={INTERIOR} size={sizeOf(INTERIOR)} x={790} y={150} w={1000} h={520} fx={1500} fy={1350} scale={0.4} rot={1.5} at={a + 5} />
      <Highlight text="SURRENDER" x={800} y={50} size={70} at={t.at('surrenders.')} seed={61} rot={-1} />
      <Note text="no one killed in the bombardment" x={800} y={730} size={56} rot={-2} at={t.at('No one is') - 3} />
      <Note text="but the war has started" x={830} y={850} size={62} rot={-2} at={t.at('But the war') - 3} color={CORAL} />
      <Tag text="Major Robert Anderson, Frank Leslie's, 1861 · Interior of Fort Sumter after its surrender, April 1861 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** 75,000 volunteers and a blockade. */
const Volunteers: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="Lincoln calls for" x={150} y={90} size={56} rot={-3} at={t.at('Lincoln calls') - 3} color={WHITE} />
      <Stamp text="75,000" x={140} y={190} at={t.at('75,000')} size={210} color={pal.subject} rot={-2} />
      <Note text="volunteers" x={860} y={250} size={72} rot={-3} at={t.at('volunteers') - 3} />
      <Note text="to put down the rebellion" x={870} y={360} size={52} rot={-3} at={t.at('put down') - 3} color={WHITE} />
      <Highlight text="BLOCKADE" x={140} y={560} size={110} at={t.at('blockade,')} seed={63} rot={-2} />
      <Definition term="block·ade" def="warships closing off an enemy's ports, so nothing gets in or out" at={t.at('blockade,') + 9} x={160} y={740} w={1200} />
    </AbsoluteFill>
  );
};

/** Whose call is it? The President acts; Congress comes back July 4. */
const Whose: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="normally, that's Congress's call" x={140} y={90} size={60} rot={-2} at={t.at('Normally,') - 3} color={WHITE} />
      <Box x={170} y={300} w={640} h={220} at={t.at('Lincoln does') - 2} label="PRESIDENT" seed={3} />
      <Box x={1110} y={300} w={640} h={220} at={t.at('Normally,') + 4} label="CONGRESS" seed={5} />
      <Note text="does both, first" x={210} y={570} size={62} rot={-3} at={t.at('both') - 3} color={pal.subject} />
      <Note text="not even meeting yet" x={1130} y={570} size={56} rot={-3} at={t.at('even meets,') - 3} />
      <Arrow x1={820} y1={410} x2={1090} y2={410} bow={-40} at={t.at('calls it back') - 2} />
      <Highlight text="JULY 4" x={1140} y={720} size={100} at={t.at('July')} seed={65} rot={-2} />
      <Note text="called back for" x={560} y={760} size={50} rot={-3} at={t.at('calls it back') - 3} color={WHITE} />
    </AbsoluteFill>
  );
};

/** Four more states leave: eleven. */
const Eleven: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('That call for') - 1;
  const keys: Cam3[] = [{f: a, x: 2850, y: 2600, z: 0.36, tilt: 36, rot: 0}, {f: t.at('But four slave'), x: 2800, y: 2650, z: 0.39, tilt: 44, rot: -4}];
  return (
    <>
      <Map3D data={D} keys={keys} states={0.6} rivers={0.4}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={-20} stagger={0} h={20} color={MAP3D.free} />
            <StateTiles api={api} names={FIRST_SEVEN} at={-20} stagger={0} h={60} color={CORAL} />
            <StateTiles api={api} names={U(['Virginia', 'West Virginia'])} at={t.at('Virginia,') - 1} stagger={2} h={60} color={CORAL} />
            <StateTiles api={api} names={U(['North Carolina'])} at={t.at('North Carolina,') - 1} h={60} color={CORAL} />
            <StateTiles api={api} names={U(['Tennessee'])} at={t.at('Tennessee') - 1} h={60} color={CORAL} />
            <StateTiles api={api} names={U(['Arkansas'])} at={t.at('Arkansas.') - 1} h={60} color={CORAL} />
            {([['Virginia', 'Virginia,', [0, 0]], ['North Carolina', 'North Carolina,', [0, 40]], ['Tennessee', 'Tennessee', [0, 0]], ['Arkansas', 'Arkansas.', [0, 0]]] as [string, string, number[]][]).map(([s, w, o]) => {
              const [cx, cy] = centreOf(D.states[`USA:${s}`]);
              return <Stand key={s} api={api} at={[cx + o[0], cy + o[1]]} z={70} show={t.at(w) + 2}><PlaceTag text={s} size={28} /></Stand>;
            })}
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 90, top: 70}}><Count from={7} to={7} at={a} dur={1} suffix=" states" size={84} color={CORAL} /></div>
        <div style={{position: 'absolute', left: 90, top: 175}}><Count from={7} to={11} at={t.at('That makes') - 2} dur={14} prefix="now " size={84} color={CORAL} /></div>
        <Note text="+4 after the call for troops" x={980} y={90} size={50} rot={-2} at={t.at('tips') - 3} color={WHITE} />
        <Note text="they won't fight other Southern states" x={560} y={900} size={54} rot={-2} at={t.at("They won't") - 3} color={WHITE} />
      </AbsoluteFill>
    </>
  );
};

/** The four border states stay: grey tiles, named as they're said. */
const Border: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('But four slave') - 1;
  const keys: Cam3[] = [{f: a, x: 2900, y: 2150, z: 0.44, tilt: 34, rot: 0}, {f: t.at('So who decided'), x: 2900, y: 2180, z: 0.47, tilt: 40, rot: -3}];
  const names: [string, string, number[]][] = [['Delaware', 'Delaware,', [260, 10]], ['Maryland', 'Maryland,', [-60, 60]], ['Kentucky', 'Kentucky', [0, 0]], ['Missouri', 'Missouri.', [0, 0]]];
  return (
    <>
      <Map3D data={D} keys={keys} states={0.6} rivers={0.4}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={-20} stagger={0} h={20} color={MAP3D.free} />
            <StateTiles api={api} names={CONFEDERACY_1861} at={-20} stagger={0} h={60} color={CORAL} />
            {names.map(([s, w]) => <StateTiles key={s} api={api} names={U([s])} at={t.at(w) - 1} h={34} color={MAP3D.grey} />)}
            {names.map(([s, w, o]) => {
              const [cx, cy] = centreOf(D.states[`USA:${s}`]);
              return <Stand key={s} api={api} at={[cx + o[0], cy + o[1]]} z={60} show={t.at(w) + 1}><PlaceTag text={s} size={28} /></Stand>;
            })}
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 34%)'}} />
        <Highlight text="BORDER STATES" x={100} y={780} size={96} at={t.at('border states.')} seed={67} rot={-2} />
        <Definition term="bor·der states" def="slave states that stayed in the Union" at={t.at('border states.') + 9} x={120} y={930} w={1100} />
        <Note text="4 slave states stay in the Union" x={110} y={90} size={54} rot={-2} at={t.at('stay') - 3} color={WHITE} />
        <Note text="Lincoln badly needs them" x={1020} y={790} size={58} rot={-3} at={t.at('Lincoln badly') - 3} />
        <Note text="hold onto that." x={1240} y={900} size={58} rot={-3} at={t.at('Hold onto') - 3} color={WHITE} />
      </AbsoluteFill>
    </>
  );
};

/** So who decided on war? */
const Who: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="WHO DECIDED ON WAR?" x={130} y={110} size={96} at={t.at('who decided')} seed={69} rot={-2} />
      <div style={{position: 'absolute', left: 170, top: 350, fontFamily: JF.mono, fontSize: 36, letterSpacing: 3, color: pal.mark, opacity: useGFrame() >= t.at('The Confederacy fired') ? 1 : 0}}>FIRED FIRST</div>
      <Note text="the Confederacy" x={170} y={410} size={80} rot={-2} at={t.at('The Confederacy fired') - 3} color={pal.subject} />
      <div style={{position: 'absolute', left: 170, top: 640, fontFamily: JF.mono, fontSize: 36, letterSpacing: 3, color: pal.mark, opacity: useGFrame() >= t.at('The president') ? 1 : 0}}>ANSWERED</div>
      <Note text="the president" x={170} y={700} size={80} rot={-2} at={t.at('The president') - 3} color={WHITE} />
      <Note text="(Congress later)" x={880} y={730} size={62} rot={-3} at={t.at('asked Congress') - 3} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Harbor t={t} />],
    [at('and its soldiers') - 1, <Rations t={t} />],
    [at('So he tells') - 1, <OnlyFood t={t} />],
    [at("It's basically") - 1, <Match t={t} />],
    [at('They did.') - 1, <Bombardment t={t} />],
    [at('the fort surrenders') - 1, <Surrender t={t} />],
    [at('Lincoln calls') - 1, <Volunteers t={t} />],
    [at('Normally,') - 1, <Whose t={t} />],
    [at('That call for') - 1, <Eleven t={t} />],
    [at('But four slave') - 1, <Border t={t} />],
    [at('So who decided') - 1, <Who t={t} />],
  ];
  const scene = useScene(cuts);
  const stamps = ['March', 'Only food.', 'match', 'April', 'surrenders.', '75,000', 'blockade,', 'July', 'border states.', 'who decided'];
  const notes: [string, number][] = [['problem.', 1], ['a U.S. Army', 1], ['running', 1], ['looks like', 1], ['started', 1], ['gives up', 1], ['the fort.', 1],
    ['No new troops,', 1], ['no guns,', 1], ['unless', 1], ["It's basically", 1], ['asking:', 1], ['do you really', 1], ['Confederate cannons', 1], ['After about', 1],
    ['No one is', 1], ['But the war', 1], ['Lincoln calls', 1], ['volunteers', 1], ['put down', 1], ['Normally,', 1], ['both', 1], ['even meets,', 1], ['calls it back', 1],
    ['tips', 1], ["They won't", 1], ['stay', 1], ['Lincoln badly', 1], ['Hold onto', 1], ['The Confederacy fired', 1], ['The president', 1], ['asked Congress', 1]];
  const ticks = [at('Lincoln') - 2, at('Fort Sumter') - 2, at('a U.S. Army') - 2, at('the fort surrenders') - 1, at('Virginia,'), at('North Carolina,'), at('Tennessee'), at('Arkansas.'),
    at('Delaware,'), at('Maryland,'), at('Kentucky'), at('Missouri.')];
  return (
    <>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {stamps.map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {notes.map(([c, n]) => <Sfx key={c} at={at(c, n) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {ticks.map((f, i) => <Sfx key={`t${i}`} at={f} src="sfx/tick.wav" volume={0.4} />)}
      <Sfx at={at('fire.') - 2} src="sfx/boom.wav" volume={0.45} />
      <Sfx at={at('That makes')} src="sfx/stamp.wav" volume={0.3} />
    </>
  );
};

const TM = makeTimeline(N, 30);
// m_war_drums (69 s): its peak sits around 50 s into the cue, so start 50 s before "They did." lands. The cue runs out about
// 47 s into the chapter, so a second copy (from its build, 8 s in) picks up under "Normally" and carries to the end.
const PEAK = 50 * 30;
const DRUMS_START = PEAK - TM.at('They did.');

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_fort_sumter.wav" lead={LEAD} music={[
    {src: 'music/m_war_drums.mp3', volume: 0.17, startFrom: DRUMS_START, to: TM.at('July') + 10, fadeOut: 60},
    {src: 'music/m_war_drums.mp3', volume: 0.15, startFrom: 240, from: TM.at('Normally,') - 20},
  ]}>
    <Body />
  </ChapterShell>
);
