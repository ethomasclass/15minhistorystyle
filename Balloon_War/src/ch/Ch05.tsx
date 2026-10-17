// Chapter 5 · Silence: a drawn 1945 front page whose balloon stories are censored bar by bar, why it worked (Japan
// heard nothing and quit), the Hanford power line, the cost of silence, a phone alert that never came, and the
// hand-off to the Oregon woods.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch05_silence.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, PhotoCard, Stamp, type TL, useScene} from '../kit/shell';
import {Bed, Sketch, type P} from '../draw';
import {CORAL, ORANGE, P3, Ph, Redact} from '../bw';
import {Map} from '../pacmap';
import {proj} from '../pacific';

const N = words as Narration;
export const CH05_FRAMES = chapterFrames(N, LEAD);

/** "Because the newspapers stayed quiet." A real newsroom first. */
const Newsroom: React.FC<{t: TL}> = ({t}) => (
  <Ph p="ch05_silence/nyt_newsroom_1942.jpg" fx={2600} fy={2700} a={0} b={t.at('In January')} z0={1.14} z1={1.2} band="bottom"
    tag="The New York Times newsroom, 1942 · Marjory Collins, Office of War Information (Library of Congress)">
    {() => <Note text="the newspapers stayed quiet" x={120} y={880} size={64} rot={-3} at={t.at('newspapers')} color="#ffffff" />}
  </Ph>
);

/** A drawn front page (illustration, no real masthead): balloon stories blacked out one by one. */
const FrontPage: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('asked');
  const ink = '#1d1a16';
  const story = (x: number, y: number, w: number, head: string, size: number) => (
    <div style={{position: 'absolute', left: x, top: y, width: w}}>
      <div style={{fontFamily: JF.display, fontSize: size, lineHeight: 1.05, color: ink}}>{head}</div>
      {[...Array(6)].map((_, i) => <div key={i} style={{height: 9, marginTop: 14, width: `${92 - (i % 3) * 9}%`, background: 'rgba(29,26,22,0.32)'}} />)}
    </div>
  );
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 200, top: 70, width: 1060, height: 950, background: '#ece3cf', transform: 'rotate(-1.5deg)', boxShadow: '0 30px 60px rgba(0,0,0,0.7)'}}>
        <div style={{position: 'absolute', left: 40, top: 30, width: 980, textAlign: 'center', fontFamily: JF.display, fontSize: 74, color: ink, borderBottom: `6px double ${ink}`, paddingBottom: 10}}>THE MORNING PAPER</div>
        <div style={{position: 'absolute', left: 40, top: 140, width: 980, textAlign: 'center', fontFamily: JF.mono, fontSize: 22, color: ink, letterSpacing: 3}}>JANUARY 1945 · ILLUSTRATION</div>
        {story(40, 200, 600, 'STRANGE BALLOON FOUND ON A RANCH', 54)}
        {story(680, 200, 340, 'WAR BONDS DRIVE TOPS GOAL', 36)}
        {story(40, 520, 460, 'BLAST HEARD IN THE WOODS', 44)}
        {story(540, 520, 480, 'PAPER BALLOON LANDS IN TOWN', 44)}
        {story(680, 380, 340, 'SCHOOL BOARD MEETS', 30)}
        <Redact x={30} y={190} w={620} h={300} at={a + 2} rot={0} />
        <Redact x={30} y={510} w={480} h={260} at={a + 12} rot={0} />
        <Redact x={530} y={510} w={500} h={260} at={t.at('they didn\'t')} rot={0} />
      </div>
      <PhotoCard src="img/ch05_silence/office_of_censorship_pin.jpg" x={1380} y={180} w={400} h={400} rot={4} at={t.at('January')} fit="contain" filter="grayscale(0.2) contrast(1.05)" />
      {g >= t.at('January') && <Highlight text="JANUARY 1945" x={1330} y={640} size={74} at={t.at('January')} seed={51} rot={-3} />}
      <Note text="the government asked papers" x={1280} y={760} size={40} rot={-3} at={a} color="#ffffff" />
      <Note text="not to report the balloons" x={1330} y={830} size={40} rot={-3} at={a + 4} color="#ffffff" />
      <Note text="and they didn't." x={1360} y={920} size={58} rot={-3} at={t.at('they didn\'t')} color={CORAL} />
      <Tag text="Front page: an illustration. Pin: the US Office of Censorship" />
    </AbsoluteFill>
  );
};

/** Why it was smart: no news reaches Japan; Japan gives up. */
const NoNews: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const [jx, jy] = proj(139, 36);
  const [ux, uy] = proj(-110, 42);
  const arrow = `M${ux},${uy} Q${(ux + jx) / 2},${uy - 380} ${jx + 40},${jy - 20}`;
  const k = interpolate(g, [t.at('If Japan'), t.at('If Japan') + 18], [0, 1], clamp);
  return (
    <Map at={t.at('The reason') - 1}>
      <Note text="actually smart:" x={420} y={90} size={58} rot={-2} at={t.at('smart')} color="#ffffff" />
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <path d={arrow} stroke="#EDE7DC" strokeWidth={5} strokeDasharray="16 12" fill="none" pathLength={1} strokeDashoffset={0} opacity={k} />
        {g >= t.at('heard about') && <text x={(ux + jx) / 2} y={uy - 210} fontSize={150} textAnchor="middle" fill={CORAL} fontFamily={JF.display}>✕</text>}
      </svg>
      <Note text="no news of a single landing…" x={380} y={190} size={50} rot={-3} at={t.at('heard about')} color="#ffffff" />
      <Note text="…so they must not be working" x={420} y={280} size={50} rot={-3} at={t.at('would think')} color={ORANGE} />
      <Note text="it worked: Japan heard almost nothing" x={120} y={880} size={52} rot={-3} at={t.at('it worked')} color="#ffffff" />
      <Stamp text="APRIL 1945: THEY GAVE UP" x={300} y={480} at={t.at('gave up')} size={110} rot={-5} color={CORAL} />
    </Map>
  );
};

/** Hanford: a power line, a balloon, three days. */
const Hanford: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const f = useCurrentFrame();
  const hit = t.at('power line');
  const spark = g >= hit + 6 && g < hit + 40 && Math.floor(f / 3) % 2 === 0;
  return (
    <Ph p="ch05_silence/hanford_b_reactor_100b_area_1944.jpg" fx={1800} fy={1300} a={t.at('Some of') - 1} b={t.at('But silence')} z0={1.06} z1={1.16} band="top"
      tag="The Hanford B Reactor area, Washington State, 1944 · US Department of Energy / Manhattan Project">
      {() => (
        <>
          <Note text="some did real damage" x={110} y={100} size={56} rot={-3} at={t.at('real damage')} color="#ffffff" />
          {/* the drawn power line, with a balloon tangled in it */}
          <Sketch pts={[[1150, 360], [1880, 430]]} x={0} y={0} at={hit} dur={8} width={4} color="#EDE7DC" />
          <Sketch pts={[[1150, 380], [1880, 450]]} x={0} y={0} at={hit + 2} dur={8} width={4} color="#EDE7DC" />
          {g >= hit + 4 && <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
            <ellipse cx={1500} cy={330} rx={90} ry={70} fill="#EDE7DC" opacity={0.9} />
            <path d="M1440,370 L1490,405 M1560,370 L1510,405" stroke="#EDE7DC" strokeWidth={3} />
            {spark && <path d="M1500,405 l-30,40 l25,-6 l-20,46 l48,-58 l-26,6 l18,-28 Z" fill={ORANGE} />}
          </svg>}
          <Note text="a power line in Washington State" x={1000} y={500} size={44} rot={-3} at={hit} color="#ffffff" />
          <Note text="→ the secret plant making material for the atomic bomb" x={110} y={200} size={44} rot={-3} at={t.at('secret plant')} color={ORANGE} />
          <Stamp text="3 DAYS" x={1280} y={760} at={t.at('three days')} size={150} rot={-5} />
          <Note text="to get back to full power" x={1260} y={930} size={46} rot={-3} at={t.at('full power')} color="#ffffff" />
        </>
      )}
    </Ph>
  );
};

/** The cost of silence: a phone alert that would come today, and the blank screen of 1945. */
const Cost: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const buzz = t.at('buzz');
  const blank = t.at('In 1945');
  const shake = g >= buzz && g < blank ? Math.sin(f * 2.4) * 6 : 0;
  const lit = g >= t.at('Today') && g < blank;
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('a cost') && <Highlight text="SILENCE HAS A COST" x={110} y={90} size={96} at={t.at('a cost')} seed={52} rot={-2} />}
      <Note text="nobody warned the people where the balloons came down" x={120} y={250} size={48} rot={-3} at={t.at('Nobody')} color="#ffffff" />
      <div style={{position: 'absolute', left: 1180, top: 330, width: 360, height: 680, borderRadius: 46, background: '#0b0b0b', border: '8px solid #2b2b2b',
        transform: `translateX(${shake}px) rotate(${shake * 0.3}deg)`, boxShadow: '0 30px 60px rgba(0,0,0,0.7)', opacity: g >= t.at('Today') ? 1 : 0}}>
        <div style={{position: 'absolute', left: 18, top: 60, right: 18, bottom: 60, borderRadius: 12, background: lit ? '#1b2a2c' : '#050505'}}>
          {lit && g >= buzz && (
            <div style={{margin: 16, padding: '18px 20px', borderRadius: 16, background: 'rgba(244,239,230,0.95)', fontFamily: JF.sans, fontWeight: 700, color: '#111'}}>
              <div style={{fontSize: 22, letterSpacing: 2, color: '#b23a2c'}}>⚠ EMERGENCY ALERT</div>
              <div style={{fontSize: 26, marginTop: 8, lineHeight: 1.25}}>Do not touch unknown balloons or objects in the woods.</div>
            </div>
          )}
        </div>
      </div>
      <Note text="today: a warning in seconds" x={200} y={520} size={60} rot={-3} at={t.at('Today')} color={ORANGE} />
      <Note text="1945: the choice was to say nothing" x={200} y={700} size={60} rot={-3} at={blank} color={pal.subject} />
      <Tag text="Illustration: an alert that never came" />
    </AbsoluteFill>
  );
};

/** "Which brings us to a spring day in Oregon." The woods near Bly, in 3D. */
const Oregon: React.FC<{t: TL}> = ({t}) => (
  <P3 name="ch06_forest" a={t.at('Which brings') - 1} b={t.frames + 24} dolly={140} yaw={[-1, 1]} band="bottom"
    tag="The Fremont-Winema National Forest, southern Oregon · US Forest Service">
    <Note text="a spring day in Oregon" x={120} y={890} size={60} rot={-3} at={t.at('spring')} color="#ffffff" />
  </P3>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Newsroom t={t} />],
    [at('In January') - 1, <FrontPage t={t} />],
    [at('The reason') - 1, <NoNews t={t} />],
    [at('Some of') - 1, <Hanford t={t} />],
    [at('But silence') - 1, <Cost t={t} />],
    [at('Which brings') - 1, <Oregon t={t} />],
  ];
  const scene = useScene(cuts.map(([f, n], i): [number, React.ReactNode] => [f, <React.Fragment key={i}>{n}</React.Fragment>]));
  return (
    <>
      {scene}
      <Bed src="music/g_grip.mp3" from={0} to={at('Which brings') + 10} volume={0.14} startFrom={30 * 6} fadeOut={30} />
      <Bed src="sfx/forest_birds.wav" from={at('Which brings') - 6} to={t.frames + 24} volume={0.16} fadeIn={20} fadeOut={8} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.26} />)}
      {[at('asked') + 2, at('asked') + 12, at("they didn't")].map((f, i) => <Sfx key={`r${i}`} at={f} src="sfx/typewriter.wav" volume={0.22} />)}
      {['January', 'gave up', 'three days', 'a cost'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {['asked', "they didn't", 'smart', 'heard about', 'would think', 'it worked', 'real damage', 'power line', 'secret plant', 'full power', 'Nobody', 'Today', 'In 1945', 'spring'].map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('power line') + 6} src="sfx/gas_hiss.wav" volume={0.25} />
      {[0, 8, 16].map((d) => <Sfx key={d} at={at('buzz') + d} src="sfx/tick.wav" volume={0.35} />)}
    </>
  );
};

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_silence.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
