// Chapter 6 · Sizing Up the Sides: the North on paper (people, factories, railroads), the South's three reasons,
// King Cotton, the Anaconda Plan, and the mid-video subscribe line.
import React from 'react';
import {AbsoluteFill, interpolate, random} from 'remotion';
import mapData from '../../public/maps/civwar1861.json';
import words from '../../public/audio/ch06_sizing_up.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {GREYS} from '../kit/charts';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {sizeOf} from '../kit/dk';
import {type Cam3, CONFEDERACY_1861, Border, Dot, Hand, MAP3D, Map3D, type MapData, PlaceTag, Slab, Stand, StateTiles} from '../kit/map3d';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, Photo, PhotoCard, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH06_FRAMES = chapterFrames(N, LEAD);

const D = mapData as unknown as MapData;
const pl = D.places as Record<string, [number, number]>;
const CORAL = '#FF6F61';
const WHITE = '#ffffff';
const U = (n: string[]) => n.map((s) => `USA:${s}`);
const WEST_OF_RIVER = U(['Texas', 'Arkansas', 'Louisiana']);
const EAST_CONFED = CONFEDERACY_1861.filter((s) => !WEST_OF_RIVER.includes(s));

const LEE = 'img/ch06/lee_full_length_vannerson_c1864.jpg';
const COTTON = 'img/ch06/cotton_shipment_savannah_1865.jpg';
const SNAKE = 'img/ch06/scotts_great_snake_elliott_1861.jpg';

const FONT_HAND = '"Nanum Pen Script", cursive';

// ---------------------------------------------------------------------------------------------
// StepBars, paired: North (bone) vs South (coral), each bar growing on its own spoken number (8 frames), its value in Abril
// on the bar. Each pair is scaled to its own larger value. Numbers: 1860 census (free + enslaved, Union vs Confederate
// states); manufacturing output and railroad mileage shares as commonly cited for 1860.

type Side = {value: number; show: string; at: number};
const Pair: React.FC<{x: number; y: number; h: number; bw: number; gap: number; label: string; north: Side; south: Side; size?: number;
  hatch?: {frac: number; at: number}; seed?: number}> = ({x, y, h, bw, gap, label, north, south, size = 64, hatch, seed = 1}) => {
  const g = useGFrame();
  const pal = usePal();
  const max = Math.max(north.value, south.value);
  const bar = (s: Side, bx: number, fill: string, who: string, k: number) => {
    const p = interpolate(g, [s.at, s.at + 8], [0, 1], clamp);
    const bh = (s.value / max) * h * p;
    return (
      <g key={who}>
        {p > 0 && <path d={`M${bx},${y} L${bx},${y - bh + 6} Q${bx},${y - bh} ${bx + 6},${y - bh} L${bx + bw - 6},${y - bh} Q${bx + bw},${y - bh} ${bx + bw},${y - bh + 6} L${bx + bw},${y} Z`} fill={fill} />}
        {p >= 1 && <text x={bx + bw / 2} y={y - bh - 18} textAnchor="middle" style={{fontFamily: JF.display, fontSize: size, fill: k ? pal.subject : '#f4efe6'}}>{s.show}</text>}
        <text x={bx + bw / 2} y={y + 44} textAnchor="middle" style={{fontFamily: JF.mono, fontSize: 26, letterSpacing: 2, fill: k ? pal.subject : 'rgba(255,255,255,0.85)', opacity: p > 0 ? 1 : 0.3}}>{who}</text>
      </g>
    );
  };
  const bx2 = x + bw + gap;
  const base = Array.from({length: 16}, (_, i) => `${i ? 'L' : 'M'}${x - 24 + ((2 * bw + gap + 48) * i) / 15},${y + (random(`pb${seed}${i}`) - 0.5) * 4}`).join(' ');
  const baseP = interpolate(g, [north.at - 6, north.at + 2], [0, 1], clamp);
  const hp = hatch ? interpolate(g, [hatch.at, hatch.at + 6], [0, 1], clamp) : 0;
  const sh = (south.value / max) * h;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <defs>
        <pattern id={`hatch${seed}`} width={16} height={16} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={16} stroke="#111" strokeWidth={6} />
        </pattern>
      </defs>
      <path d={base} fill="none" stroke={pal.mark} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - baseP} />
      {bar(north, x, GREYS[0], 'NORTH', 0)}
      {bar(south, bx2, pal.subject, 'SOUTH', 1)}
      {hp > 0 && <rect x={bx2} y={y - sh * hatch!.frac * hp} width={bw} height={sh * hatch!.frac * hp} fill={`url(#hatch${seed})`} opacity={0.75} />}
      <text x={x + bw + gap / 2} y={y + 96} textAnchor="middle" style={{fontFamily: FONT_HAND, fontSize: 60, fill: pal.mark, paintOrder: 'stroke', stroke: '#111', strokeWidth: 6, opacity: baseP}}>{label}</text>
    </svg>
  );
};

const PEOPLE = (t: TL) => ({north: {value: 22, show: '22M', at: t.at('22 million') - 1}, south: {value: 9, show: '9M', at: t.at('9 million,') - 1}});

/** "So who should win? On paper, the North": 22 million against 9 million, a third of them enslaved. */
const OnPaper: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="so who should win?" x={130} y={80} size={58} rot={-3} at={t.at('So who should') - 3} color={WHITE} />
      <Highlight text="ON PAPER: THE NORTH" x={120} y={190} size={84} at={t.at('On paper,')} seed={71} rot={-2} />
      <Pair x={1100} y={900} h={520} bw={230} gap={90} label="people" {...PEOPLE(t)} size={76} hatch={{frac: 0.39, at: t.at('a third') - 1}} seed={1} />
      <Note text="more than a third" x={150} y={560} size={58} rot={-3} at={t.at('more than a third') - 3} color={pal.subject} />
      <Note text="of the South's people" x={170} y={660} size={52} rot={-3} at={t.at("the South's people") - 3} color={WHITE} />
      <Note text="were enslaved" x={190} y={750} size={58} rot={-3} at={t.at('enslaved.') - 3} color={WHITE} />
      <Arrow x1={720} y1={790} x2={1400} y2={835} bow={-40} at={t.at('enslaved.') + 2} />
    </AbsoluteFill>
  );
};

/** Factories and railroads join the people. */
const Industry: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('The North made') - 1;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="ON PAPER: THE NORTH" x={120} y={80} size={72} at={a - 10} seed={71} rot={-2} />
      <Pair x={170} y={860} h={460} bw={170} gap={50} label="people" {...PEOPLE(t)} size={58} seed={2} />
      <Pair x={790} y={860} h={460} bw={170} gap={50} label="factory output" north={{value: 90, show: '90%', at: t.at('90 percent') - 1}}
        south={{value: 10, show: '10%', at: t.at('90 percent') + 8}} size={58} seed={3} />
      <Pair x={1410} y={860} h={460} bw={170} gap={50} label="railroad track" north={{value: 70, show: '70%', at: t.at('70 percent') - 1}}
        south={{value: 30, show: '30%', at: t.at('70 percent') + 8}} size={58} seed={4} />
    </AbsoluteFill>
  );
};

/** A 1/3, 2/3, 3/3 counter in the top right. */
const Counter: React.FC<{n: number; at: number; out?: number}> = ({n, at, out}) => <Note text={`${n}/3`} x={1680} y={60} size={66} rot={-4} at={at} out={out} />;

/** Why did the South think it could win? Reason one. */
const ReasonOne: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="so why did the South think it could win?" x={130} y={90} size={56} rot={-2} at={t.at('So why') - 3} color={WHITE} />
      <Highlight text="3 REASONS" x={130} y={240} size={120} at={t.at('Three reasons.')} seed={73} rot={-2} />
      <Counter n={1} at={t.at('One:') - 2} />
      <Note text="1 · it didn't have to conquer anybody" x={150} y={520} size={60} rot={-2} at={t.at('One:') - 2} />
      <Note text="it only had to survive" x={210} y={660} size={72} rot={-3} at={t.at('It only') - 3} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** A drawn scoreboard: a tie goes to the South. Then reason two. */
const Scoreboard: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('Think of') - 1;
  const p = interpolate(g, [a + 2, a + 12], [0, 1], clamp);
  const j = (k: string) => (random(`sb${k}`) - 0.5) * 10;
  const [x0, y0, x1, y1] = [560, 130, 1360, 440];
  const d = [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0 + 8, y0 - 4]].map(([px, py], i) => `${i ? 'L' : 'M'}${px + j(`x${i}`)},${py + j(`y${i}`)}`).join(' ');
  const k = interpolate(g, [a + 8, a + 12], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
        <path d={d} fill="rgba(0,0,0,0.3)" stroke={pal.mark} strokeWidth={6} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        <path d={`M960,${y0 + 30} L962,${y1 - 30}`} stroke={pal.mark} strokeWidth={5} strokeLinecap="round" opacity={k} />
      </svg>
      {[['NORTH', 760, '#f4efe6'], ['SOUTH', 1160, pal.subject]].map(([who, cx, c]) => (
        <React.Fragment key={who as string}>
          <div style={{position: 'absolute', left: (cx as number) - 150, width: 300, top: 160, textAlign: 'center', fontFamily: JF.mono, fontSize: 34, letterSpacing: 4, color: c as string, opacity: k}}>{who}</div>
          <div style={{position: 'absolute', left: (cx as number) - 150, width: 300, top: 210, textAlign: 'center', fontFamily: JF.display, fontSize: 170, lineHeight: 1, color: c as string, opacity: k}}>0</div>
        </React.Fragment>
      ))}
      <Note text="tie = South wins" x={700} y={480} size={74} rot={-3} at={t.at('a tie') - 3} color={WHITE} />
      <Note text="North: invade, take the whole thing back" x={300} y={630} size={54} rot={-2} at={t.at('The North had') - 3} />
      <Counter n={1} at={-99} out={t.at('Two:') - 2} />
      <Counter n={2} at={t.at('Two:') - 2} />
      <Note text="2 · it fought on its own ground, close to home" x={200} y={820} size={56} rot={-2} at={t.at('Two:') - 2} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** Reason three: leaders. Robert E. Lee. */
const Leaders: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Three: leaders.') - 1;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src={LEE} size={sizeOf(LEE)} x={150} y={110} w={500} h={860} fx={1040} fy={1640} scale={0.36} rot={-1.5} at={t.at('Robert E. Lee') - 2}
        mask={MASKS.lee} tintStrength={0.5} traceAt={t.at('Robert E. Lee') + 4} />
      <Counter n={3} at={a + 1} />
      <Highlight text="LEADERS" x={780} y={110} size={110} at={t.at('leaders.')} seed={75} rot={-2} />
      <Note text="many top officers: Southern" x={790} y={290} size={56} rot={-3} at={t.at('Many of') - 3} color={WHITE} />
      <Note text="Robert E. Lee" x={800} y={430} size={76} rot={-3} at={t.at('Robert E. Lee') - 3} />
      <Note text="offered a top Union command" x={810} y={570} size={54} rot={-3} at={t.at('offered') - 3} color={WHITE} />
      <Note text="turned it down" x={820} y={700} size={66} rot={-3} at={t.at('He turned') - 3} color={pal.subject} />
      <Note text="to go with Virginia" x={840} y={810} size={60} rot={-3} at={t.at('go with Virginia') - 3} />
      <Tag text="Julian Vannerson, General Robert E. Lee, c. 1864 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** King Cotton over the Savannah cotton wharf. */
const Cotton: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('And the South') - 1;
  return (
    <Photo src={COTTON} size={sizeOf(COTTON)} fx={1500} fy={780} z0={1.45} z1={1.6} a={a} b={t.at("The Union's")} bw="grayscale(1) contrast(1.3) brightness(0.95)">
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 35%)'}} />
          <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 45%)'}} />
          <Note text="the South had a bet" x={1180} y={90} size={56} rot={-3} at={t.at('a bet,') - 3} color={WHITE} />
          <Highlight text="KING COTTON" x={100} y={90} size={100} at={t.at('King Cotton.')} seed={77} rot={-2} />
          <Definition term="King Cot·ton" def="the bet that Britain needed Southern cotton so badly it would have to help the South" at={t.at('King Cotton.') + 9} x={110} y={250} w={1150} />
          <Note text="Britain's textile mills" x={120} y={690} size={58} rot={-3} at={t.at("Britain's textile") - 3} color={WHITE} />
          <Note text="(cotton in, cloth out)" x={140} y={790} size={50} rot={-3} at={t.at('turned cotton') - 3} />
          <Note text="cut it off, and Britain steps in?" x={840} y={720} size={52} rot={-3} at={t.at('Cut it off,') - 3} color="#FF9F1C" />
          <Note text="hold that thought, too." x={980} y={850} size={58} rot={-3} at={t.at('Hold that') - 3} color={WHITE} />
          <Tag text="W. T. Crane, Shipment of cotton at Savannah, Frank Leslie's, 1865 · Library of Congress" />
        </>
      )}
    </Photo>
  );
};

/** The Union's plan: blockade the coast, take the river, cut the Confederacy in two (MapTest beat B). */
const Anaconda: React.FC<{t: TL}> = ({t}) => {
  const a = t.at("The Union's") - 1;
  const b = t.at('Newspapers');
  const keys: Cam3[] = [{f: a, x: 2500, y: 3000, z: 0.4, tilt: 38, rot: 0}, {f: b, x: 2450, y: 3050, z: 0.43, tilt: 46, rot: -4}];
  const ships = ['hamptonRoads', 'capeFear', 'charlestonBar', 'savannahBar', 'fernandina', 'pensacola', 'mobileBay', 'mississippiMouth', 'galvestonBar'];
  const coast = t.at('Blockade the') - 1;
  const river = t.at('Take the Mississippi') - 1;
  const slide = {at: t.at('cut the') - 2, dur: 30, dx: -160, dy: 40, lift: 30};
  return (
    <>
      <Map3D data={D} keys={keys} states={0.4} rivers={0.4}>
        {(api) => (
          <>
            <StateTiles api={api} names={EAST_CONFED} at={a - 20} stagger={0} h={40} color={CORAL} />
            {WEST_OF_RIVER.map((s) => <Slab key={s} api={api} d={D.states[s]} clipLand={false} at={a - 20} h={40} color={CORAL} layers={6} slide={slide} />)}
            {ships.map((k, i) => <Dot key={k} api={api} at={pl[k]} show={coast + i * 3} r={30} color={MAP3D.us} />)}
            <Stand api={api} at={[3650, 3400]} z={20} show={coast + 4}><Hand text="1 · blockade the coast" size={70} color={MAP3D.us} rot={0} bg /></Stand>
            <Border api={api} d={D.lines.lowerMississippi} at={river} dur={24} color={MAP3D.mexico} width={9} z={48} />
            <Stand api={api} at={[1500, 3250]} z={60} show={river + 14}><PlaceTag text="Mississippi River" size={40} /></Stand>
            <Stand api={api} at={[1150, 3050]} z={60} show={river + 6}><Hand text="2 · take the river" size={70} color={MAP3D.mexico} rot={0} bg /></Stand>
            <Stand api={api} at={[2500, 2500]} z={60} show={t.at('in two.') - 2}><Hand text="3 · cut it in two" size={70} color="#f4efe6" rot={0} bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Highlight text="THE UNION'S PLAN" x={90} y={70} size={88} at={t.at("The Union's")} seed={79} rot={-2} />
        <Note text="slower: squeeze." x={150} y={220} size={64} rot={-3} at={t.at('slower:') - 3} color={WHITE} />
      </AbsoluteFill>
    </>
  );
};

/** The real 1861 cartoon map: Scott's Great Snake. */
const Snake: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Newspapers') - 1;
  return (
    <Photo src={SNAKE} size={sizeOf(SNAKE)} fx={960} fy={820} z0={1.02} z1={1.12} a={a} b={t.at('Quick thing.')} bw="grayscale(1) contrast(1.25) brightness(0.98)">
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0) 42%)'}} />
          <Note text="newspapers called it" x={1180} y={500} size={54} rot={-3} at={a + 2} color={WHITE} />
          <Highlight text="ANACONDA PLAN" x={100} y={740} size={100} at={t.at('Anaconda Plan,')} seed={81} rot={-2} />
          <Definition term="An·a·con·da Plan" def="named after the snake that crushes its prey" at={t.at('Anaconda Plan,') + 9} x={110} y={900} w={1400} />
          <Note text="people wanted something faster" x={1000} y={630} size={50} rot={-3} at={t.at('People wanted') - 3} color={WHITE} />
          <Tag text="J. B. Elliott, Scott's Great Snake, 1861 · Library of Congress" x={44} y={40} />
        </>
      )}
    </Photo>
  );
};

/** Mid-video subscribe line. */
const Subscribe: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('hit subscribe.') - 2;
  const p = interpolate(g, [a, a + 8], [0, 1], clamp);
  const j = (k: string) => (random(`sub${k}`) - 0.5) * 8;
  const [x0, y0, x1, y1] = [660, 380, 1260, 540];
  const d = [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0 + 8, y0 - 4]].map(([px, py], i) => `${i ? 'L' : 'M'}${px + j(`x${i}`)},${py + j(`y${i}`)}`).join(' ');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <PhotoCard src={SNAKE} x={1380} y={110} w={420} rot={3} at={t.at('Quick thing.') - 1} />
      <Note text="quick thing." x={150} y={110} size={64} rot={-3} at={t.at('Quick thing.') - 3} color={WHITE} />
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
        <path d={d} fill={g >= a + 6 ? `${pal.mark}22` : 'none'} stroke={pal.mark} strokeWidth={7} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      </svg>
      {g >= a + 5 && <div style={{position: 'absolute', left: x0, top: y0, width: x1 - x0, height: y1 - y0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: JF.display, fontSize: 76, color: '#f4efe6'}}>SUBSCRIBE</div>}
      <Note text="it's free" x={300} y={620} size={60} rot={-3} at={t.at("It's free,") - 3} color={WHITE} />
      <Note text="it really helps the channel" x={660} y={620} size={60} rot={-3} at={t.at('really helps') - 3} color={WHITE} />
      <Note text="(unlike the Anaconda Plan)" x={300} y={760} size={64} rot={-3} at={t.at('unlike the') - 3} color={pal.subject} />
      <Note text="it works right away" x={380} y={880} size={60} rot={-3} at={t.at('it works') - 3} />
      <Note text="subscribe ↓" x={1320} y={930} size={58} rot={-2} at={t.at('hit subscribe.') - 3} />
      <Tag text="J. B. Elliott, Scott's Great Snake, 1861 · Library of Congress" />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <OnPaper t={t} />],
    [at('The North made') - 1, <Industry t={t} />],
    [at('So why') - 1, <ReasonOne t={t} />],
    [at('Think of') - 1, <Scoreboard t={t} />],
    [at('Three: leaders.') - 1, <Leaders t={t} />],
    [at('And the South') - 1, <Cotton t={t} />],
    [at("The Union's") - 1, <Anaconda t={t} />],
    [at('Newspapers') - 1, <Snake t={t} />],
    [at('Quick thing.') - 1, <Subscribe t={t} />],
  ];
  const scene = useScene(cuts);
  const stamps = ['On paper,', 'Three reasons.', 'leaders.', 'King Cotton.', "The Union's", 'Anaconda Plan,'];
  const notes = ['So who should', 'more than a third', "the South's people", 'enslaved.', 'So why', 'One:', 'It only', 'a tie', 'The North had', 'Two:', 'Many of', 'Robert E. Lee',
    'offered', 'He turned', 'go with Virginia', 'a bet,', "Britain's textile", 'turned cotton', 'Cut it off,', 'Hold that', 'slower:', 'People wanted', 'Quick thing.',
    'hit subscribe.', "It's free,", 'really helps', 'unlike the', 'it works'];
  const bars = [at('22 million') - 1, at('9 million,') - 1, at('90 percent') - 1, at('90 percent') + 8, at('70 percent') - 1, at('70 percent') + 8];
  return (
    <>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {stamps.map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {notes.map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {bars.map((f, i) => <Sfx key={`b${i}`} at={f} src="sfx/tick.wav" volume={0.4} />)}
      <Sfx at={at('Blockade the') - 1} src="sfx/tick.wav" volume={0.4} />
      <Sfx at={at('cut the') - 2} src="sfx/whoosh.wav" volume={0.3} />
    </>
  );
};

const TM = makeTimeline(N, 30);
// a_civil_war (85 s): the young fife-and-snare march under the tallies, turning somber on its own around the Union's plan.
export const Ch06: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch06_sizing_up.wav" lead={LEAD} music={[
    {src: 'music/a_civil_war.mp3', volume: 0.084},
  ]}>
    <Body />
  </ChapterShell>
);
