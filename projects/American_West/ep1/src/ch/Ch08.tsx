// Chapter 8 · Panic (1873 → 1877).
// Shot list (narration words → shot):
//  A "September 18th, 1873."                 desk: Leslie's "Jay Cooke & Company's office" print lands, SEPT. 18, 1873
//  B "Jay Cooke and Company…closes its doors" detail tilt from the bank's sign down to the crowd
//  C "Cooke had bet his bank…Northern Pacific" Cooke in a circle mount + the drawn Northern Pacific line (planned vs built)
//  D "The money ran out before the track did" push to Bismarck, the coral end of track ✕
//  E "What came next is called a panic…"     PANIC + definition over Leslie's crush at the Exchange doors
//  F "The New York Stock Exchange shut down…" Broad Street after the doors closed (pan), CLOSED 10 DAYS
//  G "Then came a long, hard depression…"    DEPRESSION + definition, prices falling (approx.)
//  H "Railroads went bankrupt. Workers…"      counting grid: 89 of 364 railroads
//  I–J "Here's why…Jobs and wages, not the South." bare handwriting, "the South" struck through
//  K–L "In 1874…the party of the white South" the House before/after the 1874 election (seat dots), the party line as text
//  M "A railroad boom. A railroad bust. A tired North." three lines
//  N "That means…Reconstruction…came to an end" the stack
//  O "By 1877, the last federal troops…"     Leslie's: troops leaving the New Orleans State House, April 1877
//  P "That same year, 1877…walked off the job" Harper's cover on the desk → detail of the Baltimore street fight
//  Q "Trains stopped from Baltimore to St. Louis" drawn line map, stops in coral
//  R "Federal troops…a hundred people were killed" Pittsburgh's Union Depot burning
//  S "Remember the strike in the mountains?"  callback: the ch04 tunnel picture, small, beside the depot print
//  T "This time, everyone heard about it."   Harper's masthead (pull back)
//  U "And out West…someone to blame."        Harper's: Chinese immigrants at the San Francisco custom house (hand-off)
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch08_panic.words.json';
import {clamp} from '../lib/anim';
import {JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration} from '../kit/shell';
import {CircleMount, keys, Mono, PhotoCam, Pin, ScrimTag, Shots, SlapTitle, zkeys} from '../kit/west';
import {DeskShot, Hand, Marks, Print, Sounds, Strike, Wire} from '../kit/ch07_extra';

const N = words as Narration;
export const CH08_FRAMES = chapterFrames(N, LEAD);
const T = makeTimeline(N, 30);
const at = T.at;

const I8 = {
  run: 'img/ch08/run_on_jay_cooke_1873.jpg', cooke: 'img/ch08/jay_cooke.png', closing: 'img/ch08/closing_stock_exchange_1873.jpg',
  broad: 'img/ch08/panic_broad_st_1873.jpg', louisiana: 'img/ch08/louisiana_troops_withdrawn_1877.jpg', baltimore: 'img/ch08/strike_baltimore_1877.jpg',
  depot: 'img/ch08/strike_pittsburgh_depot_1877.jpg', tunnel: 'img/ch08/litho_tunnel_face_medium.jpg', custom: 'img/ch09/chinese_immigrants_custom_house_1877.jpg',
};
const Z8: Record<string, [number, number]> = {
  run: [1089, 1536], cooke: [578, 980], closing: [1150, 1536], broad: [1536, 1011], louisiana: [3000, 2394], baltimore: [931, 1536], depot: [1920, 1293],
  tunnel: [1920, 1097], custom: [1004, 1536],
};
const TAG = {
  run: "Scenes in Wall Street during the panic: Jay Cooke & Company's office, Frank Leslie's, 1873 · Library of Congress",
  cooke: 'Jay Cooke, c. 1865, Wenderoth & Taylor · via Wikimedia Commons',
  closing: "The great financial panic of 1873: closing the door of the Stock Exchange, Frank Leslie's · Library of Congress",
  broad: "The great financial panic: Broad Street near the Stock Exchange, Sept. 20, 1873, Frank Leslie's · Library of Congress",
  louisiana: "Louisiana: the withdrawal of the federal troops from the State House, New Orleans, April 1877, Frank Leslie's · LOC",
  baltimore: "The great strike: the Sixth Maryland Regiment fighting its way through Baltimore, Harper's Weekly, Aug. 11, 1877 · LOC",
  depot: "Destruction of the Union Depot, Pittsburgh, Harper's Weekly, Aug. 11, 1877 · via Wikimedia Commons",
  tunnel: 'Chapter 4: the tunnels, 1867 · Illustration (AI lithograph)',
  custom: "Chinese immigrants at the San Francisco custom-house, Harper's Weekly, Feb. 3, 1877 · Library of Congress",
};

const inside = (size: [number, number], cx: number, cy: number, s: number) => {
  const hw = 960 / s;
  const hh = 540 / s;
  return {cx: Math.min(size[0] - hw, Math.max(hw, cx)), cy: Math.min(size[1] - hh, Math.max(hh, cy)), s};
};

// ---------------------------------------------------------------- A · the date
const DateDesk: React.FC = () => {
  const f = useCurrentFrame();
  const e = at('Jay Cooke');
  return (
    <DeskShot tilt={keys(f, [[0, 22], [e, 14]])} z={zkeys(f, [[0, 0.9], [e, 0.98]])} hits={[5]}
      over={<><SlapTitle text="SEPT. 18, 1873" x={100} y={430} size={100} at={2} seed={41} /><ScrimTag text={TAG.run} x={34} y={24} /></>}>
      <Print src={I8.run} size={Z8.run} x={1200} y={20} w={600} crop={[0, 60, 1089, 1500]} at={3} rot={3} seed={21} />
    </DeskShot>
  );
};

// ---------------------------------------------------------------- B · Jay Cooke & Co. closes its doors
const CookeOffice: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Jay Cooke') - 1;
  const b = at('Cooke had');
  const c = inside(Z8.run, 544, keys(f, [[a, 520], [at('closes') - 4, 900], [b, 980]]), zkeys(f, [[a, 1.8], [b, 1.95]]));
  return (
    <AbsoluteFill>
      <PhotoCam src={I8.run} size={Z8.run} cx={c.cx} cy={c.cy} s={c.s} bw="grayscale(1) contrast(1.2) brightness(0.92)" />
      <Note text="Jay Cooke & Co." x={110} y={110} size={60} rot={-3} at={at('Jay Cooke') + 4} />
      <Note text="“the most famous bank in America”" x={120} y={220} size={42} rot={-2} color="#f4efe6" at={at('famous') - 3} />
      <Hand parts={[['closes its doors', true]]} x={1080} y={860} size={84} at={at('closes') - 3} />
      <ScrimTag text={TAG.run} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- C–D · the Northern Pacific, planned vs built (approximate)
const NP_X0 = 640;
const NP_X1 = 1780;
const NP_BUILT = 0.22; // ~450 of ~2,000 miles, Duluth → Bismarck, 1873
const NPLine: React.FC<{a: number; labels?: boolean}> = ({a, labels = true}) => {
  const g = useGFrame();
  const pal = usePal();
  const y = 600;
  const plan = interpolate(g, [a + 4, a + 18], [0, 1], clamp);
  const built = interpolate(g, [at('Northern Pacific'), at('Northern Pacific') + 10], [0, 1], clamp);
  const xb = NP_X0 + (NP_X1 - NP_X0) * NP_BUILT;
  return (
    <>
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
        <line x1={NP_X0} y1={y} x2={NP_X0 + (NP_X1 - NP_X0) * plan} y2={y} stroke={pal.mark} strokeWidth={5} strokeDasharray="16 12" opacity={0.8} />
        {built > 0 && <>
          <line x1={NP_X0} y1={y} x2={NP_X0 + (xb - NP_X0) * built} y2={y} stroke="#050403" strokeWidth={18} />
          <line x1={NP_X0} y1={y} x2={NP_X0 + (xb - NP_X0) * built} y2={y} stroke={pal.subject} strokeWidth={11} strokeLinecap="round" />
        </>}
      </svg>
      <Pin x={NP_X0} y={y} at={a + 4} />
      <Mono text="DULUTH" x={NP_X0 - 70} y={y + 40} size={24} at={a + 6} />
      <Pin x={NP_X1} y={y} at={a + 18} />
      {labels && <Mono text="PUGET SOUND" x={NP_X1 - 190} y={y + 40} size={24} at={a + 18} />}
      {labels && <Mono text="PLANNED · ABOUT 2,000 MILES" x={1080} y={y - 90} size={24} at={a + 18} />}
      {built >= 1 && <Mono text="BISMARCK, 1873" x={xb - 110} y={y + 40} size={24} color={pal.subject} />}
    </>
  );
};
const CookeBet: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Cooke had') - 1;
  const z = zkeys(f, [[a, 1.0], [at('The money ran'), 1.04]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '30% 50%'}}>
        <CircleMount src={I8.cooke} size={Z8.cooke} cx={330} cy={520} r={210} fx={372} fy={190} scale={1.25} at={a + 1} />
        <Note text="Jay Cooke" x={210} y={790} size={52} rot={-3} at={a + 6} />
        <SlapTitle text="NORTHERN PACIFIC" x={640} y={150} size={78} at={at('Northern Pacific') - 1} seed={43} />
        <NPLine a={a} />
      </AbsoluteFill>
      <Tag text={`${TAG.cooke}  ·  Route drawn approx.`} />
    </AbsoluteFill>
  );
};
const RanOut: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const a = at('The money ran') - 1;
  const b = at('What came next');
  const xb = NP_X0 + (NP_X1 - NP_X0) * NP_BUILT;
  const z = zkeys(f, [[a, 1.04], [b, 1.6]]);
  const ox = keys(f, [[a, 960], [b, xb + 120]]);
  const xk = interpolate(g, [at('before'), at('before') + 6], [0, 1], clamp);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `translate(${960 - ox * z}px, ${540 - 600 * z}px) scale(${z})`, transformOrigin: '0 0'}}>
        <NPLine a={-99} labels={false} />
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
          {xk > 0 && <g stroke={pal.subject} strokeWidth={9} strokeLinecap="round">
            <line x1={xb + 20} y1={570} x2={xb + 20 + 50 * xk} y2={570 + 60 * xk} />
            {xk >= 1 && <line x1={xb + 70} y1={570} x2={xb + 20} y2={630} />}
          </g>}
        </svg>
        <Note text="the money ran out here" x={xb - 60} y={430} size={44} rot={-4} at={at('ran out') - 2} />
      </AbsoluteFill>
      <Tag text="Northern Pacific: about 450 of some 2,000 planned miles built by 1873 (approx.)" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- E · panic
const Panic: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('What came next') - 1;
  const b = at('The New York');
  const c = inside(Z8.closing, 575, keys(f, [[a, 820], [b, 1000]]), zkeys(f, [[a, 1.68], [b, 1.85]]));
  return (
    <AbsoluteFill>
      <PhotoCam src={I8.closing} size={Z8.closing} cx={c.cx} cy={c.cy} s={c.s} bw="grayscale(1) contrast(1.15) brightness(0.5)" />
      <SlapTitle text="PANIC" x={120} y={300} size={130} at={at('panic') - 1} seed={45} />
      <Definition term="panic" def="when people rush to pull their money out all at once, and the banks can't pay" at={at('when people') - 2} x={120} y={520} w={1250} />
      <ScrimTag text={TAG.closing} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- F · the Exchange shut for ten days
const Closed: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('The New York') - 1;
  const b = at('Then came a');
  const c = inside(Z8.broad, keys(f, [[a, 640], [b, 860]]), 560, 1.3);
  return (
    <AbsoluteFill>
      <PhotoCam src={I8.broad} size={Z8.broad} cx={c.cx} cy={c.cy} s={c.s} />
      <Note text="the Stock Exchange" x={1240} y={110} size={54} rot={-3} at={at('Stock Exchange') - 3} />
      <SlapTitle text="CLOSED 10 DAYS" x={1000} y={860} size={84} at={at('ten days') - 1} seed={47} />
      <ScrimTag text={TAG.broad} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- G · depression (prices: approximate, wholesale index 1873 = 100 → about 70 by 1879)
const Depression: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const a = at('Then came a') - 1;
  const pts: [number, number][] = [[1873, 100], [1874, 93], [1875, 87], [1876, 81], [1877, 78], [1878, 69], [1879, 68]];
  const X = (y: number) => 1020 + (y - 1873) * 130;
  const Y = (v: number) => 860 - (v - 60) * 9;
  const p = interpolate(g, [at('falling') - 2, at('falling') + 22], [0, 1], clamp);
  const n = 1 + p * (pts.length - 1);
  const shown = pts.slice(0, Math.floor(n));
  const pan = keys(f, [[a, 0], [at('Railroads went'), -40]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `translateX(${pan}px)`}}>
        <SlapTitle text="DEPRESSION" x={110} y={110} size={110} at={at('depression') - 1} seed={49} />
        <Definition term="depression" def="years of falling prices and lost jobs" at={at('years') - 2} x={120} y={330} w={760} />
        {p > 0 && <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
          <line x1={X(1873)} y1={Y(60)} x2={X(1879) + 40} y2={Y(60)} stroke={pal.mark} strokeWidth={2} opacity={0.6} />
          <polyline points={shown.map(([y, v]) => `${X(y)},${Y(v)}`).join(' ')} fill="none" stroke={pal.subject} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
          {[1873, 1876, 1879].map((y) => <text key={y} x={X(y)} y={Y(60) + 40} textAnchor="middle" fontFamily={JF.mono} fontSize={26} fill={pal.mark}>{y}</text>)}
        </svg>}
        <Note text="prices" x={1000} y={Y(100) - 90} size={44} rot={-3} at={at('falling') - 2} />
      </AbsoluteFill>
      <Tag text="Wholesale prices, 1873 = 100 (approx., after the Warren–Pearson index)" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- H · railroads bankrupt (89 of 364, as commonly cited)
const Bankrupt: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Railroads went') - 1;
  const z = zkeys(f, [[a, 1.0], [at("Here's why"), 1.06]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '35% 50%'}}>
        <Mono text="AMERICA'S RAILROADS, 1873: 364" x={140} y={120} size={30} at={a + 2} />
        <Marks n={364} hot={89} x={140} y={200} cols={28} cell={36} at={a + 2} hotAt={at('bankrupt') - 2} />
        <Hand parts={[['89', true], [' went bankrupt']]} x={1200} y={340} size={62} at={at('bankrupt') + 4} />
        <Note text="workers laid off" x={1240} y={540} size={52} rot={-3} at={at('Workers') - 2} />
        <Note text="by the thousands" x={1260} y={630} size={52} rot={-3} at={at('thousands') - 2} />
      </AbsoluteFill>
      <Tag text="Railroad failures by 1876, as commonly cited (89 of 364)" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- I–J · why it matters
const WhyMatters: React.FC = () => {
  const f = useCurrentFrame();
  const a = at("Here's why") - 1;
  const y = keys(f, [[a, 20], [at('Jobs and wages'), -20]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `translateY(${y}px)`}}>
        <Note text="why it matters for our question:" x={170} y={200} size={50} rot={-2} color="#f4efe6" at={at('matters') - 3} />
        <Hand parts={[['hard times changed']]} x={170} y={380} size={92} at={at('Hard times') - 3} />
        <Hand parts={[['what Northern voters cared about']]} x={170} y={520} size={80} at={at('Northern voters') - 3} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const JobsWages: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Jobs and wages') - 1;
  const z = zkeys(f, [[a, 1.06], [at('In 1874'), 1.0]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '40% 50%'}}>
        <Hand parts={[['jobs and wages,']]} x={200} y={330} size={120} at={a + 1} />
        <Hand parts={[['not the South.']]} x={260} y={540} size={110} at={at('not the South') - 2} white />
        <Strike x0={540} x1={1150} y={625} at={at('South') + 4} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- K–L · the House flips in 1874 (seat counts approx.)
const HOUSE = {before: {r: 199, d: 88, o: 5}, after: {r: 103, d: 182, o: 8}};
const Seats: React.FC<{cx: number; cy: number; R: number; d: number; r: number; o: number; at: number}> = ({cx, cy, R, d, r, o, at: a}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < a) return null;
  const n = d + r + o;
  const rows = 8;
  const dots: {x: number; y: number}[] = [];
  for (let k = 0; k < rows; k++) {
    const rr = R * (0.45 + (0.55 * k) / (rows - 1));
    const cnt = Math.round((n * rr) / (R * rows * 0.725));
    for (let i = 0; i < cnt; i++) {
      const t = Math.PI * (1 - (i + 0.5) / cnt);
      dots.push({x: cx + Math.cos(t) * rr, y: cy - Math.sin(t) * rr});
    }
  }
  dots.sort((p, q) => Math.atan2(cy - p.y, p.x - cx) - Math.atan2(cy - q.y, q.x - cx)).reverse();
  const shown = Math.floor(interpolate(g, [a, a + 12], [0, 1], clamp) * dots.length);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      {dots.slice(0, shown).map((p, i) => {
        // left = Democrats (coral), right = Republicans (teal), middle = others
        const col = i < d ? pal.subject : i < d + o ? '#8a8378' : pal.mark;
        return <circle key={i} cx={p.x} cy={p.y} r={R * 0.032} fill={col} />;
      })}
    </svg>
  );
};
const House: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('In 1874') - 1;
  const z = zkeys(f, [[a, 0.96], [at('Same name'), 1.04]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '50% 55%'}}>
        <SlapTitle text="1874" x={110} y={90} size={110} at={a + 1} seed={51} />
        <Mono text="THE HOUSE · BEFORE" x={250} y={820} size={26} at={a + 4} />
        <Seats cx={480} cy={760} R={330} {...HOUSE.before} at={a + 4} />
        <Wire pts={[[860, 620], [1060, 620]]} at={at('won') - 4} />
        <Mono text="AFTER THE 1874 ELECTION" x={1190} y={820} size={26} at={at('won') - 2} />
        <Seats cx={1440} cy={760} R={330} {...HOUSE.after} at={at('won') - 2} />
        <Note text="Democrats" x={1150} y={290} size={56} rot={-3} color="#FF6F61" at={at('Democrats') - 2} />
        <Note text="win the House" x={1200} y={380} size={50} rot={-3} at={at('won') + 4} />
      </AbsoluteFill>
      <Tag text="House seats, 43rd vs 44th Congress (approx.): Republicans teal, Democrats coral" />
    </AbsoluteFill>
  );
};
const Party: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Same name') - 1;
  const z = zkeys(f, [[a, 1.15], [at('A railroad boom'), 1.3]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '75% 75%', opacity: 0.16}}>
        <Seats cx={1440} cy={760} R={330} {...HOUSE.after} at={-99} />
      </AbsoluteFill>
      <Hand parts={[["same name as today's Democrats,"]]} x={140} y={230} size={74} at={a + 2} white />
      <Hand parts={[['a very different party']]} x={140} y={380} size={92} at={at('very different') - 3} />
      <Hand parts={[['1870s: the party of the '], ['white South', true]]} x={140} y={560} size={80} at={at('party of the') - 3} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- M · boom, bust, tired North
const BoomBust: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('A railroad boom') - 1;
  const x = keys(f, [[a, 20], [at('That means'), -20]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `translateX(${x}px)`}}>
        <Hand parts={[['a railroad boom.']]} x={220} y={220} size={100} at={a + 2} />
        <Hand parts={[['a railroad '], ['bust.', true]]} x={420} y={430} size={100} at={at('bust') - 6} />
        <Hand parts={[['a tired North.']]} x={620} y={640} size={100} at={at('tired') - 3} white />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- N · that means
const Stack: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('That means') - 1;
  const z = zkeys(f, [[a, 1.0], [at('By 1877'), 1.05]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '20% 40%'}}>
        <Hand parts={[['that means…']]} x={160} y={170} size={72} at={a + 1} white />
        <Hand parts={[["the railroad didn't only change the West."]]} x={160} y={320} size={64} at={at("railroad didn't") - 3} />
        <Hand parts={[['it helped '], ['end', true], [' Reconstruction']]} x={160} y={500} size={96} at={at('reasons') - 3} />
        <Hand parts={[['in the South.']]} x={260} y={640} size={96} at={at('South came') - 3} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- O · 1877, troops leave the statehouses
const Troops: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('By 1877') - 1;
  const b = at('That same year');
  const c = inside(Z8.louisiana, keys(f, [[a, 1700], [b, 1300]]), 1230, 1.22);
  return (
    <AbsoluteFill>
      <PhotoCam src={I8.louisiana} size={Z8.louisiana} cx={c.cx} cy={c.cy} s={c.s} />
      <SlapTitle text="1877" x={110} y={90} size={110} at={a + 2} seed={53} />
      <Note text="the last federal troops" x={1060} y={110} size={50} rot={-3} at={at('last federal') - 3} />
      <Note text="leave the Southern statehouses" x={880} y={200} size={48} rot={-3} at={at('pulled') - 3} />
      <ScrimTag text={TAG.louisiana} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- P · the Great Strike of 1877
const StrikeDesk: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('That same year') - 1;
  const b = at('railroad workers');
  return (
    <DeskShot tilt={keys(f, [[a, 24], [b, 16]])} rotZ={keys(f, [[a, 2], [b, 0]])} z={zkeys(f, [[a, 0.9], [b, 0.98]])} hits={[a + 4]}
      over={<>
        <SlapTitle text="1877" x={1250} y={160} size={110} at={at('1877', 2) - 1} seed={55} />
        <Note text="another round of pay cuts" x={1120} y={380} size={48} rot={-3} at={at('pay cuts') - 4} />
        <ScrimTag text={TAG.baltimore} x={34} y={24} />
      </>}>
      <Print src={I8.baltimore} size={Z8.baltimore} x={540} y={-40} w={620} crop={[0, 0, 931, 1500]} at={a + 1} rot={-2} seed={23} />
    </DeskShot>
  );
};
const StrikeStreet: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('railroad workers') - 1;
  const b = at('Trains stopped');
  const c = inside(Z8.baltimore, 465, keys(f, [[a, 1000], [b, 1150]]), zkeys(f, [[a, 2.1], [b, 2.25]]));
  return (
    <AbsoluteFill>
      <PhotoCam src={I8.baltimore} size={Z8.baltimore} cx={c.cx} cy={c.cy} s={c.s} />
      <SlapTitle text="THE GREAT STRIKE" x={110} y={90} size={96} at={at('walked') - 1} seed={57} />
      <Note text="railroad workers walk off the job" x={120} y={260} size={48} rot={-2} at={at('walked') + 6} />
      <ScrimTag text={TAG.baltimore} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Q · trains stopped (drawn line map; positions approximate)
const CITIES: [string, number, number][] = [['ST. LOUIS', 330, 690], ['CHICAGO', 560, 330], ['PITTSBURGH', 1150, 480], ['MARTINSBURG', 1390, 600], ['BALTIMORE', 1620, 560]];
const Stopped: React.FC = () => {
  const f = useCurrentFrame();
  const pal = usePal();
  const a = at('Trains stopped') - 1;
  const ox = keys(f, [[a, 1300], [at('Federal troops', 2), 780]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `translateX(${(960 - ox) * 0.35}px)`}}>
        <Wire pts={[[1620, 560], [1390, 600], [1150, 480], [560, 330]]} at={a + 2} dur={12} head={false} width={5} />
        <Wire pts={[[1150, 480], [800, 560], [330, 690]]} at={a + 8} dur={12} head={false} width={5} />
        {CITIES.map(([n, x, y], i) => <React.Fragment key={n}>
          <Pin x={x} y={y} at={a + 4 + i * 3} size={26} />
          <Loop cx={x} cy={y} rx={46} ry={36} at={a + 16 + i * 3} seed={60 + i} color={pal.subject} width={6} />
          <Mono text={n} x={x - 60} y={y + 40} size={24} at={a + 4 + i * 3} />
        </React.Fragment>)}
        <Hand parts={[['trains '], ['stopped', true]]} x={760} y={800} size={90} at={at('stopped') - 3} />
      </AbsoluteFill>
      <Tag text="The 1877 strike, a few of the cities where trains stopped (drawn, positions approx.)" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- R · Pittsburgh
const Pittsburgh: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Federal troops', 2) - 1;
  const b = at('Remember the strike');
  const c = inside(Z8.depot, keys(f, [[a, 1100], [b, 1000]]), keys(f, [[a, 700], [b, 640]]), zkeys(f, [[a, 1.0], [b, 1.12]]));
  return (
    <AbsoluteFill>
      <PhotoCam src={I8.depot} size={Z8.depot} cx={c.cx} cy={c.cy} s={c.s} bw="grayscale(1) contrast(1.2) brightness(0.9)" />
      <Note text="federal troops sent in" x={120} y={110} size={52} rot={-3} at={at('sent in') - 3} />
      <Hand parts={[['about 100 killed', true]]} x={1150} y={860} size={80} at={at('hundred') - 3} />
      <ScrimTag text={TAG.depot} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- S · callback to the strike in the mountains
const Callback: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Remember the strike') - 1;
  const b = at('This time');
  return (
    <DeskShot tilt={keys(f, [[a, 16], [b, 22]])} z={zkeys(f, [[a, 1.0], [b, 0.94]])} hits={[a + 4]}
      over={<>
        <Note text="1867: the strike in the mountains" x={150} y={760} size={46} rot={-3} at={a + 4} />
        <Note text="(almost no one heard)" x={190} y={850} size={40} rot={-3} color="#f4efe6" at={a + 12} />
        <ScrimTag text={`${TAG.tunnel}  ·  ${TAG.depot}`} x={34} y={24} />
      </>}>
      <Print src={I8.depot} size={Z8.depot} x={960} y={160} w={900} at={-99} rot={2} seed={25} blur={0.6} h={4} />
      <Print src={I8.tunnel} size={Z8.tunnel} x={420} y={250} w={520} at={a + 1} rot={-4} seed={26} h={20} />
    </DeskShot>
  );
};

// ---------------------------------------------------------------- T · everyone heard
const Everyone: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('This time') - 1;
  const b = at('And out West');
  const c = inside(Z8.baltimore, 465, keys(f, [[a, 230], [b, 520]]), zkeys(f, [[a, 2.4], [b, 2.06]]));
  return (
    <AbsoluteFill>
      <PhotoCam src={I8.baltimore} size={Z8.baltimore} cx={c.cx} cy={c.cy} s={c.s} />
      <Hand parts={[['this time, '], ['everyone', true], [' heard']]} x={160} y={860} size={84} at={at('everyone') - 4} />
      <ScrimTag text={TAG.baltimore} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- U · out West (hand-off to ch09)
const OutWest: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('And out West') - 1;
  const e = T.frames + 70;
  const c = inside(Z8.custom, 500, keys(f, [[a, 980], [e, 1060]]), zkeys(f, [[a, 1.95], [e, 2.15]]));
  return (
    <AbsoluteFill>
      <PhotoCam src={I8.custom} size={Z8.custom} cx={c.cx} cy={c.cy} s={c.s} bw="grayscale(1) contrast(1.15) brightness(0.75)" />
      <Mono text="SAN FRANCISCO, 1877" x={120} y={110} size={30} at={a + 6} />
      <ScrimTag text={TAG.custom} />
    </AbsoluteFill>
  );
};

const SFX: [number, string, number][] = [
  [2, 'stamp', 0.22], [3, 'paper_slap_soft', 0.25], [4, 'tape_press', 0.18],
  [at('Jay Cooke') - 2, 'whoosh', 0.25], [at('Jay Cooke') + 2, 'marker_tick', 0.2], [at('famous') - 5, 'marker_tick', 0.2], [at('closes') - 5, 'marker_tick', 0.2],
  [at('Cooke had') - 2, 'whip_soft', 0.25], [at('Cooke had'), 'card_slide_soft', 0.2], [at('Cooke had') + 4, 'marker_tick', 0.2], [at('Northern Pacific') - 1, 'stamp', 0.22],
  [at('Cooke had') + 4, 'block_tap_soft', 0.15], [at('Cooke had') + 18, 'block_tap_soft', 0.15],
  [at('The money ran') - 2, 'whoosh', 0.25], [at('ran out') - 4, 'marker_tick', 0.2], [at('before'), 'block_tap_soft', 0.15],
  [at('What came next') - 2, 'whip_soft', 0.25], [at('panic') - 1, 'stamp', 0.22],
  [at('The New York') - 2, 'whoosh', 0.25], [at('Stock Exchange') - 5, 'marker_tick', 0.2], [at('ten days') - 1, 'stamp', 0.22],
  [at('Then came a') - 2, 'whip_soft', 0.25], [at('depression') - 1, 'stamp', 0.22], [at('falling') - 4, 'marker_tick', 0.2],
  [at('Railroads went') - 2, 'whoosh', 0.25], [at('bankrupt') - 2, 'block_tap_soft', 0.15], [at('bankrupt') + 2, 'marker_tick', 0.2], [at('Workers') - 4, 'marker_tick', 0.2],
  [at("Here's why") - 2, 'whip_soft', 0.25], [at('matters') - 5, 'marker_tick', 0.2], [at('Hard times') - 5, 'marker_tick', 0.2],
  [at('Jobs and wages') - 2, 'whoosh', 0.25], [at('not the South') - 4, 'marker_tick', 0.2], [at('South') + 4, 'marker_tick', 0.2],
  [at('In 1874') - 2, 'whip_soft', 0.25], [at('In 1874'), 'stamp', 0.22], [at('In 1874') + 4, 'block_tap_soft', 0.15], [at('won') - 2, 'block_tap_soft', 0.15], [at('Democrats') - 4, 'marker_tick', 0.2],
  [at('Same name') - 2, 'whoosh', 0.25], [at('very different') - 5, 'marker_tick', 0.2], [at('party of the') - 5, 'marker_tick', 0.2],
  [at('A railroad boom') - 2, 'whip_soft', 0.25], [at('bust') - 8, 'marker_tick', 0.2], [at('tired') - 5, 'marker_tick', 0.2],
  [at('That means') - 2, 'whoosh', 0.25], [at('reasons') - 5, 'marker_tick', 0.2],
  [at('By 1877') - 2, 'whip_soft', 0.25], [at('By 1877') + 2, 'stamp', 0.22], [at('last federal') - 5, 'marker_tick', 0.2],
  [at('That same year') - 2, 'whip_soft', 0.25], [at('That same year') + 3, 'paper_slap_soft', 0.25], [at('1877', 2) - 1, 'stamp', 0.22], [at('pay cuts') - 6, 'marker_tick', 0.2],
  [at('railroad workers') - 2, 'whoosh', 0.25], [at('walked') - 1, 'stamp', 0.22],
  [at('Trains stopped') - 2, 'whip_soft', 0.25], [at('Trains stopped') + 4, 'block_tap_soft', 0.12], [at('Trains stopped') + 10, 'block_tap_soft', 0.12], [at('stopped') - 5, 'marker_tick', 0.2],
  [at('Federal troops', 2) - 2, 'whoosh', 0.25], [at('sent in') - 5, 'marker_tick', 0.2],
  [at('Remember the strike') - 2, 'whip_soft', 0.25], [at('Remember the strike') + 3, 'paper_slap_soft', 0.22],
  [at('This time') - 2, 'whoosh', 0.25], [at('everyone') - 6, 'marker_tick', 0.2],
  [at('And out West') - 2, 'whip_soft', 0.2],
];

const Body: React.FC = () => {
  const shots: [number, React.ReactNode, ('whip' | 'cut')?][] = [
    [0, <DateDesk />],
    [at('Jay Cooke') - 1, <CookeOffice />, 'cut'],
    [at('Cooke had') - 1, <CookeBet />, 'whip'],
    [at('The money ran') - 1, <RanOut />, 'cut'],
    [at('What came next') - 1, <Panic />, 'whip'],
    [at('The New York') - 1, <Closed />, 'cut'],
    [at('Then came a') - 1, <Depression />, 'whip'],
    [at('Railroads went') - 1, <Bankrupt />, 'cut'],
    [at("Here's why") - 1, <WhyMatters />, 'whip'],
    [at('Jobs and wages') - 1, <JobsWages />, 'cut'],
    [at('In 1874') - 1, <House />, 'whip'],
    [at('Same name') - 1, <Party />, 'cut'],
    [at('A railroad boom') - 1, <BoomBust />, 'whip'],
    [at('That means') - 1, <Stack />, 'cut'],
    [at('By 1877') - 1, <Troops />, 'whip'],
    [at('That same year') - 1, <StrikeDesk />, 'whip'],
    [at('railroad workers') - 1, <StrikeStreet />, 'cut'],
    [at('Trains stopped') - 1, <Stopped />, 'whip'],
    [at('Federal troops', 2) - 1, <Pittsburgh />, 'cut'],
    [at('Remember the strike') - 1, <Callback />, 'whip'],
    [at('This time') - 1, <Everyone />, 'cut'],
    [at('And out West') - 1, <OutWest />, 'whip'],
  ];
  return (
    <>
      <Shots shots={shots} />
      <Sounds list={SFX} />
    </>
  );
};

export const Ch08: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch08_panic.wav" lead={LEAD}
    music={[
      // SUNO: aw_panic replaces this (one cue for the whole chapter; drop the second entry then)
      {src: 'music/w_fire.mp3', volume: 0.15, to: at('By 1877') + 6, fadeOut: 30},
      // SUNO: aw_panic replaces this (w_fire is 88 s, so the fallback restarts at "By 1877")
      {src: 'music/w_fire.mp3', volume: 0.15, from: at('By 1877') - 6},
    ]}>
    <Body />
  </ChapterShell>
);
