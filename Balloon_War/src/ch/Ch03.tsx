// Chapter 3 · The fake: the Ghost Army. Inflatable tanks (3D), the photos flipping as the tank inflates, a sound truck
// whose rings pulse with the real engine sound, the drawn cyclists and the tank lift, the scale that slams (30 tons vs
// 93 pounds), the colonel, the secret and the medal, decoys today, the mid-video subscribe, and the hand-off to Japan.
import React from 'react';
import {AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {useAudioData, visualizeAudio} from '@remotion/media-utils';
import words from '../../public/audio/ch03_the_fake.words.json';
import {clamp} from '../lib/anim';
import {Highlight, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, PhotoCard, Quote, Stamp, type TL, useScene} from '../kit/shell';
import {Bed, Sketch, type P} from '../draw';
import {CORAL, ORANGE, P3, Ph} from '../bw';

const N = words as Narration;
export const CH03_FRAMES = chapterFrames(N, LEAD);
const TEAL = '#2FE0C4';

// Drawn shapes (local units)
const TANK: P[] = [[0, 80], [20, 50], [90, 48], [110, 20], [190, 20], [210, 48], [280, 50], [300, 80], [280, 112], [200, 118], [100, 118], [20, 112], [0, 80]];
const GUN: P[] = [[190, 34], [330, 24]];
const TRUCK: P[] = [[0, 90], [0, 40], [60, 40], [80, 10], [130, 10], [140, 40], [320, 40], [320, 90], [0, 90]];
const SPEAKER: P[] = [[200, 40], [200, 0], [250, -30], [250, 70], [200, 40]];
/** A little drawn soldier, arms up (local 0..60 x 0..170), helmet on. */
const Soldier: React.FC<{x: number; y: number; at: number; lift?: number}> = ({x, y, at, lift = 0}) => (
  <>
    <Sketch pts={[[18, 22], [30, 6], [42, 22], [18, 22]]} x={x} y={y - lift} at={at} dur={4} width={5} smooth={false} />
    <Sketch pts={[[30, 26], [30, 100]]} x={x} y={y - lift * 0.4} at={at + 2} dur={4} width={5} />
    <Sketch pts={[[30, 40], [8, 10 - lift * 0.3]]} x={x} y={y - lift * 0.4} at={at + 3} dur={4} width={5} />
    <Sketch pts={[[30, 40], [52, 10 - lift * 0.3]]} x={x} y={y - lift * 0.4} at={at + 3} dur={4} width={5} />
    <Sketch pts={[[30, 100], [14, 168]]} x={x} y={y} at={at + 4} dur={4} width={5} />
    <Sketch pts={[[30, 100], [46, 168]]} x={x} y={y} at={at + 4} dur={4} width={5} />
  </>
);
/** A drawn bicycle with its rider standing beside it (local 0..220 x 0..200). */
const Cyclist: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => (
  <>
    <Sketch pts={[...Array(17)].map((_, i): P => [40 + 34 * Math.cos((i / 16) * Math.PI * 2), 160 + 34 * Math.sin((i / 16) * Math.PI * 2)])} x={x} y={y} at={at} dur={6} width={4} color="#EDE7DC" />
    <Sketch pts={[...Array(17)].map((_, i): P => [170 + 34 * Math.cos((i / 16) * Math.PI * 2), 160 + 34 * Math.sin((i / 16) * Math.PI * 2)])} x={x} y={y} at={at + 2} dur={6} width={4} color="#EDE7DC" />
    <Sketch pts={[[40, 160], [90, 110], [150, 110], [170, 160]]} x={x} y={y} at={at + 4} dur={6} width={4} color="#EDE7DC" smooth={false} />
    <Sketch pts={[[150, 110], [145, 90], [165, 88]]} x={x} y={y} at={at + 5} dur={4} width={4} color="#EDE7DC" smooth={false} />
    <Sketch pts={[[230, 40], [230, 130], [215, 200]]} x={x} y={y - 10} at={at + 6} dur={6} width={5} color="#EDE7DC" smooth={false} />
    <Sketch pts={[[230, 130], [248, 200]]} x={x} y={y - 10} at={at + 7} dur={4} width={5} color="#EDE7DC" />
    <Sketch pts={[[214, 18], [246, 18], [230, 38], [214, 18]]} x={x} y={y - 10} at={at + 6} dur={4} width={5} color="#EDE7DC" smooth={false} />
  </>
);

/** "a unit whose main weapons were... inflatable tanks." (3D; tagged honestly: this decoy is in Italy.) */
const TwoTanks: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <P3 name="ch03_two_tanks" a={0} b={t.at('Officially')} dolly={200} yaw={[-2.5, 2]} band="top"
      tag="A US Army inflatable decoy beside a real Sherman, Anzio, Italy, 1944 (not the Ghost Army's own) · US Army Signal Corps">
      {g >= t.at('inflatable') && <Highlight text="INFLATABLE TANKS" x={110} y={90} size={100} at={t.at('inflatable')} seed={31} rot={-2} />}
      <Loop cx={1180} cy={640} rx={520} ry={280} at={t.at('tanks.')} seed={32} color={CORAL} width={7} />
    </P3>
  );
};

/** The Ghost Army: its name, its size, its artists; a replica of one of its tanks. */
const Name: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="officially: the 23rd Headquarters Special Troops" x={110} y={110} size={50} rot={-2} at={t.at('Officially')} color="#ffffff" />
      <Stamp text="THE GHOST ARMY" x={110} y={220} at={t.at('Ghost Army')} size={150} rot={-4} />
      <Note text="about 1,100 men" x={140} y={480} size={64} rot={-3} at={t.at('About')} color="#ffffff" />
      <Note text="lots of them artists" x={160} y={590} size={64} rot={-3} at={t.at('artists')} color={pal.subject} />
      <Note text="from art schools and ad agencies" x={180} y={700} size={50} rot={-3} at={t.at('recruited')} />
      <PhotoCard src="img/ch03_fake/replica_dummy_tank_spy_museum_cc0.jpg" x={1060} y={430} w={760} h={520} rot={2} at={t.at('About')} filter="contrast(1.05) saturate(0.85)" />
      <Tag text="A replica of a Ghost Army inflatable Sherman, International Spy Museum · CC0" />
    </AbsoluteFill>
  );
};

/** "They pumped up rubber tanks": four real photos flip as the tank fills, each one bouncing in (squash and stretch). */
const Inflate: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const f = useCurrentFrame();
  const a = t.at('pumped');
  const steps: [string, number, string][] = [
    ['ch03_fake/inflating_rubber_tank_anzio_1944.jpg', t.at('Their job'), 'the bag and the pump'],
    ['ch03_fake/rubber_tank_laid_out_anzio_1944.jpg', a, 'laid out'],
    ['ch03_fake/rubber_tank_quarter_inflated_anzio_1944.jpg', a + 14, 'filling'],
    ['ch03_fake/rubber_tank_side_view_anzio_1944.jpg', a + 28, 'ready'],
  ];
  const cur = steps.filter((s) => g >= s[1]).pop() ?? steps[0];
  const since = f - cur[1];
  const sq = cur[1] >= a ? spring({frame: since, fps: 30, config: {damping: 7, stiffness: 160}}) : 1;
  const sy = 0.82 + 0.18 * sq, sx = 1.1 - 0.1 * sq;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="their job: pretend to be somebody else" x={110} y={90} size={54} rot={-2} at={t.at('pretend')} color="#ffffff" />
      <div style={{position: 'absolute', left: 340, top: 200, width: 1240, height: 780, transform: `scale(${sx}, ${sy})`, transformOrigin: '50% 100%'}}>
        <div style={{position: 'absolute', inset: 0, background: '#f4efe6', padding: 18, boxShadow: '0 24px 44px rgba(0,0,0,0.7)', transform: 'rotate(-1.5deg)'}}>
          <img src={staticFile(`img/${cur[0]}`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 40%', filter: 'grayscale(1) contrast(1.15)', display: 'block'}} />
        </div>
      </div>
      <Note text="rubber tanks" x={1540} y={300} size={52} rot={-4} at={t.at('rubber')} color={ORANGE} />
      <Note text="trucks" x={1640} y={400} size={52} rot={-4} at={t.at('trucks')} color={ORANGE} />
      <Note text="cannons" x={1620} y={500} size={52} rot={-4} at={t.at('cannons')} color={ORANGE} />
      <Note text="real from the air" x={1470} y={760} size={46} rot={-4} at={t.at('from the')} color="#ffffff" />
      <Tag text="A US Army rubber tank decoy being inflated, Anzio, Italy, 1944 · US Army Signal Corps" />
    </AbsoluteFill>
  );
};

/** The sound truck at night: rings pulse with the real engine recording, and ghost tanks appear where they reach. */
const SoundTruck: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const a = t.at('At night');
  const audio = useAudioData(staticFile('sfx/tank_engine.wav'));
  const v = audio ? visualizeAudio({fps: 30, frame: Math.max(0, f - (a + 6)) % 290, audioData: audio, numberOfSamples: 16}) : [];
  const amp = v.length ? Math.min(1, (v.slice(0, 6).reduce((x, y) => x + y, 0) / 6) * 6) : 0.4;
  const on = g >= t.at('huge speakers');
  return (
    <AbsoluteFill style={{background: '#070a0b'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 50% at 30% 70%, rgba(36,103,107,0.35), transparent 70%)'}} />
      <Sketch pts={[[0, 860], [1920, 860]]} x={0} y={0} at={a} dur={10} width={4} color="#24676B" />
      <Sketch pts={TRUCK} x={140} y={700} s={1.7} at={a} dur={10} width={7} smooth={false} closed fill="#0b0d0d" fillOpacity={1} />
      <Sketch pts={SPEAKER} x={140} y={700} s={1.7} at={a + 6} dur={6} width={7} smooth={false} closed />
      {[40, 280].map((x) => <Sketch key={x} pts={[...Array(13)].map((_, i): P => [x + 24 * Math.cos((i / 12) * Math.PI * 2), 90 + 24 * Math.sin((i / 12) * Math.PI * 2)])} x={140} y={700} s={1.7} at={a + 4} dur={4} width={6} />)}
      {on && (
        <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const r = ((f * 6 + i * 120) % 720) + 40;
            const o = (1 - r / 760) * (0.35 + 0.65 * amp);
            return <path key={i} d={`M ${580 + r * Math.cos(-0.7)},${720 + r * Math.sin(-0.7)} A ${r} ${r} 0 0 1 ${580 + r * Math.cos(0.5)},${720 + r * Math.sin(0.5)}`}
              stroke={TEAL} strokeWidth={4 + amp * 6} fill="none" opacity={Math.max(0, o)} strokeLinecap="round" />;
          })}
        </svg>
      )}
      {/* the army that isn't there */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{opacity: interpolate(g, [t.at('recordings') + i * 6, t.at('recordings') + i * 6 + 10], [0, 0.55], clamp)}}>
          <Sketch pts={TANK} x={1080 + i * 200} y={620 - i * 30} s={0.55} at={t.at('recordings') + i * 6} dur={8} width={4} color="#9CC9C4" dashed />
        </div>
      ))}
      <Note text="speakers blasting recordings of tanks" x={110} y={100} size={54} rot={-2} at={t.at('huge speakers')} color="#ffffff" />
      <Note text="fake radio messages" x={1120} y={180} size={50} rot={-3} at={t.at('fake radio')} color={ORANGE} />
      <Note text="fake patches" x={1160} y={270} size={50} rot={-3} at={t.at('patches')} color={ORANGE} />
      <Note text="gossip in cafés (for any spies listening)" x={960} y={360} size={42} rot={-3} at={t.at('gossiped')} color={ORANGE} />
    </AbsoluteFill>
  );
};

/** "Basically, the most dangerous theater group in history." "But could a rubber tank actually fool anyone?" */
const Theater: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <P3 name="ch03_place_tank" a={t.at('Basically') - 1} b={t.at('One of')} dolly={220} yaw={[2, -2]} band="top"
      tag="Soldiers place a rubber tank decoy under netting, Anzio, Italy, 1944 · US Army Signal Corps">
      {g >= t.at('most dangerous') && <Highlight text="THE MOST DANGEROUS" x={110} y={80} size={84} at={t.at('most dangerous')} seed={33} rot={-2} />}
      {g >= t.at('theater') && <Highlight text="THEATER GROUP IN HISTORY" x={140} y={200} size={84} at={t.at('theater')} seed={34} rot={-3} />}
      <Note text="but could it fool anyone?" x={1100} y={860} size={60} rot={-3} at={t.at('But could')} color={CORAL} />
    </P3>
  );
};

/** The drawn story: two Frenchmen on bicycles, four soldiers lifting a tank. Then (Quote) the punchline. */
const Lift: React.FC<{t: TL; quote?: boolean}> = ({t, quote}) => {
  const g = useGFrame();
  const a = quote ? -40 : t.at('One of');
  const up = quote ? 90 : interpolate(g, [t.at('pick up'), t.at('pick up') + 16], [0, 90], {...clamp, easing: (x) => 1 - (1 - x) * (1 - x)});
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sketch pts={[[60, 900], [1860, 900]]} x={0} y={0} at={a} dur={10} width={4} color="#EDE7DC" />
      <Cyclist x={140} y={700} at={quote ? -40 : t.at('two Frenchmen')} />
      <Cyclist x={420} y={700} at={quote ? -40 : t.at('two Frenchmen') + 6} />
      <Sketch pts={TANK} x={980} y={560 - up} s={2.2} at={quote ? -40 : t.at('four American')} dur={10} width={7} closed fill="#24676B" fillOpacity={0.5} />
      <Sketch pts={GUN} x={980} y={560 - up} s={2.2} at={quote ? -40 : t.at('four American') + 6} dur={6} width={8} />
      {[0, 1, 2, 3].map((i) => <Soldier key={i} x={1010 + i * 170} y={730} at={quote ? -40 : t.at('four American') + i * 3} lift={up * 0.5} />)}
      {!quote && <Note text="one artist remembered:" x={110} y={110} size={54} rot={-2} at={t.at('remembered')} color="#ffffff" />}
      {!quote && <Note text="two Frenchmen on bicycles" x={110} y={210} size={54} rot={-2} at={t.at('two Frenchmen')} />}
      {!quote && <Note text="four soldiers… one tank" x={1080} y={210} size={54} rot={-2} at={t.at('four American')} color={ORANGE} />}
      {quote && <AbsoluteFill style={{background: 'rgba(11,11,11,0.78)'}} />}
      {quote && <Note text="they stared, waiting for an explanation…" x={110} y={110} size={54} rot={-2} at={t.at('stared')} color="#ffffff" />}
      {quote && <Quote text="The Americans are very strong." at={t.at('The Americans')} x={260} y={300} w={1400} size={96} who="a Ghost Army artist, remembering" />}
    </AbsoluteFill>
  );
};

/** The scale: a real Sherman (30 tons) slams one pan down; the decoy (93 pounds) barely registers. */
const Scale: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const real = t.at('A real');
  const fake = t.at('This one');
  const s1 = f >= real ? spring({frame: f - real - 4, fps: 30, config: {damping: 6, stiffness: 120}}) : 0;
  const s2 = f >= fake ? spring({frame: f - fake - 4, fps: 30, config: {damping: 9, stiffness: 200}}) : 0;
  const ang = -15 * s1 + 0.6 * Math.sin((f - fake) / 3) * (1 - s2) * (f >= fake ? 1 : 0);
  const cx = 960, cy = 330, L = 600;
  const r = (ang * Math.PI) / 180;
  const left: P = [cx - L * Math.cos(r), cy - L * Math.sin(r)];
  const right: P = [cx + L * Math.cos(r), cy + L * Math.sin(r)];
  const pan = (p: P) => (
    <>
      <path d={`M${p[0]},${p[1]} L${p[0] - 150},${p[1] + 230} M${p[0]},${p[1]} L${p[0] + 150},${p[1] + 230}`} stroke="#EDE7DC" strokeWidth={4} fill="none" />
      <path d={`M${p[0] - 200},${p[1] + 230} Q${p[0]},${p[1] + 290} ${p[0] + 200},${p[1] + 230} Z`} stroke="#EDE7DC" strokeWidth={5} fill="#1a1a1a" />
    </>
  );
  const drop = (start: number) => interpolate(f, [start, start + 6], [-500, 0], {...clamp, easing: (x) => x * x});
  return (
    <AbsoluteFill>
      <DarkPaper />
      <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
        <path d={`M${cx},${cy} L${cx - 90},1000 L${cx + 90},1000 Z`} fill="#24676B" opacity={0.6} stroke="#2FE0C4" strokeWidth={4} />
        <path d={`M${left[0]},${left[1]} L${right[0]},${right[1]}`} stroke="#2FE0C4" strokeWidth={14} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={18} fill="#2FE0C4" />
        {pan(left)}
        {pan(right)}
      </svg>
      {g >= real && (
        <div style={{position: 'absolute', left: left[0] - 190, top: left[1] + 40 + drop(real), width: 380}}>
          <div style={{background: '#f4efe6', padding: 10, boxShadow: '0 14px 28px rgba(0,0,0,0.7)'}}>
            <img src={staticFile('img/ch03_fake/rubber_tank_beside_real_tank_anzio_1944.jpg')} style={{width: '100%', height: 200, objectFit: 'cover', objectPosition: '8% 45%', filter: 'grayscale(1) contrast(1.15)', display: 'block'}} />
          </div>
        </div>
      )}
      {g >= fake && (
        <div style={{position: 'absolute', left: right[0] - 190, top: right[1] + 40 + drop(fake), width: 380}}>
          <div style={{background: '#f4efe6', padding: 10, boxShadow: '0 14px 28px rgba(0,0,0,0.7)'}}>
            <img src={staticFile('img/ch03_fake/rubber_tank_side_view_anzio_1944.jpg')} style={{width: '100%', height: 200, objectFit: 'cover', objectPosition: '50% 50%', filter: 'grayscale(1) contrast(1.15)', display: 'block'}} />
          </div>
        </div>
      )}
      <Stamp text="30 TONS" x={left[0] - 200} y={left[1] + 330} at={t.at('30 tons')} size={110} rot={-4} />
      <Stamp text="93 LB" x={right[0] - 110} y={right[1] + 330} at={t.at('93')} size={110} rot={-3} color={CORAL} />
      <Note text="a real Sherman" x={120} y={90} size={52} rot={-3} at={real} color="#ffffff" />
      <Note text="the decoy" x={1500} y={90} size={52} rot={-3} at={fake} color="#ffffff" />
    </AbsoluteFill>
  );
};

/** "more than 20 fake operations"; the colonel who was fooled. */
const Colonel: React.FC<{t: TL}> = ({t}) => (
  <Ph p="ch03_fake/rubber_tank_side_view_anzio_1944.jpg" fx={1400} fy={1150} a={t.at('The Ghost Army pulled') - 1} b={t.at('So why')} z0={1.1} z1={1.24} band={null}
    m="rubber_tank" traceAt={t.at('fooled')} depth={1.08}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'rgba(8,8,8,0.45)'}} />
        <Stamp text="20+ FAKE OPERATIONS" x={110} y={90} at={t.at('more than')} size={110} rot={-4} />
        <Note text="sometimes they fooled their own side" x={120} y={260} size={54} rot={-3} at={t.at('Sometimes')} color="#ffffff" />
        <Quote text="Well, son, you certainly could have fooled me." at={t.at('Well, son')} x={200} y={480} w={1500} size={78} who="a colonel who missed the briefing" />
        <Note text="(which was the whole point)" x={960} y={900} size={54} rot={-3} at={t.at('Which, to')} color={CORAL} />
        <Tag text="A US Army rubber tank decoy, Anzio, Italy, 1944 · US Army Signal Corps" />
      </>
    )}
  </Ph>
);

/** Secret for forty years, then the Gold Medal (color: now). */
const Secret: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const medal = t.at('Their Congressional');
  return (
    <AbsoluteFill>
      {g < medal ? (
        <AbsoluteFill>
          <DarkPaper />
          <Note text="so why haven't you heard of them?" x={140} y={140} size={60} rot={-2} at={t.at('So why')} color="#ffffff" />
          <div style={{position: 'absolute', left: 560, top: 300, width: 800, height: 560, background: '#c9a46a', transform: 'rotate(-3deg)', boxShadow: '0 24px 44px rgba(0,0,0,0.7)'}} />
          <Stamp text="SECRET" x={680} y={480} at={t.at('secret')} size={180} rot={-10} color={CORAL} />
          <Note text="for more than forty years" x={620} y={900} size={58} rot={-3} at={t.at('forty')} color="#ffffff" />
        </AbsoluteFill>
      ) : (
        <Ph p="ch03_fake/ghost_army_congressional_gold_medal.jpg" fx={1920} fy={1440} a={medal} b={t.at('And the idea')} z0={1.04} z1={1.14} color band="top"
          tag="The Ghost Army Congressional Gold Medal, presented at the US Capitol, March 2024 · US Mint">
          {() => (
            <>
              {g >= t.at('2024') && <Highlight text="2024" x={110} y={90} size={100} at={t.at('2024')} seed={35} rot={-2} />}
              <Note text="the Congressional Gold Medal" x={110} y={240} size={56} rot={-3} at={medal} color="#ffffff" />
              <Note text="only seven of them still alive" x={900} y={900} size={56} rot={-3} at={t.at('only seven')} color={pal.subject} />
            </>
          )}
        </Ph>
      )}
    </AbsoluteFill>
  );
};

/** Decoys today: a missile flies at the decoy card, and the decoy goes flat. Then the subscribe ask. */
const Today: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const fire = t.at('waste');
  const hitF = fire + 14;
  const mx = interpolate(f, [fire, hitF], [1900, 1230], clamp), my = interpolate(f, [fire, hitF], [140, 470], clamp);
  const flat = f >= hitF ? spring({frame: f - hitF, fps: 30, config: {damping: 12}}) : 0;
  const sub = t.at('Quick thing');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="the idea never went away" x={110} y={100} size={58} rot={-2} at={t.at('never went')} color="#ffffff" />
      <PhotoCard src="img/ch03_fake/inflatable_m47_tank_decoy_1950s_nara292565.jpg" x={110} y={260} w={640} h={460} rot={-3} at={t.at('never went')} />
      <Note text="1950s" x={150} y={770} size={50} rot={-3} at={t.at('never went')} />
      <div style={{position: 'absolute', left: 980, top: 230, width: 560, transform: `scaleY(${1 - 0.7 * flat})`, transformOrigin: '50% 100%'}}>
        <PhotoCard src="img/ch03_fake/inflatable_scud_decoy_usaf_2009.jpg" x={0} y={0} w={500} h={600} rot={2} at={t.at('Companies')} filter="contrast(1.05) saturate(0.85)" />
      </div>
      <Note text="still built for today's wars" x={1000} y={900} size={52} rot={-3} at={t.at('Companies')} color={ORANGE} />
      {f >= fire && f < hitF + 2 && (
        <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
          <path d={`M${mx},${my} l60,-30 M${mx},${my} l70,-14`} stroke={CORAL} strokeWidth={10} strokeLinecap="round" />
          <circle cx={mx} cy={my} r={14} fill={CORAL} />
        </svg>
      )}
      <Note text="pfft." x={1600} y={600} size={80} rot={-6} at={hitF + 2} color="#ffffff" />
      <Note text="a missile that costs far more than the balloon" x={600} y={970} size={44} rot={-2} at={t.at('missile')} />
      {g >= sub && <AbsoluteFill style={{background: 'rgba(11,11,11,0.86)'}} />}
      <Note text="quick thing:" x={600} y={360} size={60} rot={-3} at={sub} color="#ffffff" />
      <Note text="subscribe ↓" x={640} y={480} size={96} rot={-3} at={t.at('hit subscribe')} />
      <Note text="(unlike the Ghost Army, this channel is real)" x={560} y={660} size={52} rot={-3} at={t.at('unlike')} color={CORAL} />
      <Tag text={g < sub ? 'Inflatable decoys: an M47 tank, 1950s (NARA) and a Scud launcher, 2009 (US Air Force)' : ' '} />
    </AbsoluteFill>
  );
};

/** "On the other side of the world, Japan had balloons too. Theirs weren't fake." */
const Japan: React.FC<{t: TL}> = ({t}) => (
  <Ph p="ch04_paper_balloon/balloon_above_clouds_342fh3b23432.jpg" fx={1300} fy={600} a={t.at('On the other') - 1} b={t.frames + 20} z0={1.05} z1={1.15} band="bottom"
    tag="A Japanese balloon high above the clouds, 1945 · US Army (NARA 342-FH)">
    {() => (
      <>
        <Note text="Japan had balloons too" x={120} y={860} size={60} rot={-3} at={t.at('Japan')} color="#ffffff" />
        <Note text="theirs weren't fake" x={1150} y={860} size={64} rot={-3} at={t.at("Theirs")} color={CORAL} />
      </>
    )}
  </Ph>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <TwoTanks t={t} />],
    [at('Officially') - 1, <Name t={t} />],
    [at('Their job') - 1, <Inflate t={t} />],
    [at('At night') - 1, <SoundTruck t={t} />],
    [at('Basically') - 1, <Theater t={t} />],
    [at('One of') - 1, <Lift t={t} />],
    [at('A real') - 1, <Scale t={t} />],
    [at('The Frenchmen stared') - 1, <Lift t={t} quote />],
    [at('The Ghost Army pulled') - 1, <Colonel t={t} />],
    [at('So why') - 1, <Secret t={t} />],
    [at('And the idea') - 1, <Today t={t} />],
    [at('On the other') - 1, <Japan t={t} />],
  ];
  const scene = useScene(cuts.map(([f, n], i): [number, React.ReactNode] => [f, <React.Fragment key={i}>{n}</React.Fragment>]));
  return (
    <>
      {scene}
      {/* b_caper_40s: started so its end button lands on "the whole point" (cue 116 s → ch 81.5 s) */}
      <Bed src="music/b_caper_40s.mp3" from={0} to={at('So why') + 10} volume={0.2} startFrom={Math.round(30 * 34.5)} fadeOut={20} />
      <Bed src="music/b_caper_40s.mp3" from={at('So why')} to={at('On the other')} volume={0.13} startFrom={30 * 8} fadeIn={30} />
      <Bed src="music/b_paper_wind.mp3" from={at('On the other') - 8} to={t.frames + 24} volume={0.2} startFrom={0} fadeIn={20} />
      <Bed src="sfx/tank_engine.wav" from={at('At night') + 6} to={at('Basically')} volume={0.22} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.28} />)}
      {['inflatable', 'Ghost Army', 'most dangerous', 'theater', '30 tons', '93', 'more than', 'secret', '2024'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {['Officially', 'About', 'artists', 'recruited', 'pretend', 'rubber', 'trucks', 'cannons', 'from the', 'huge speakers', 'fake radio', 'patches', 'gossiped', 'But could',
        'remembered', 'two Frenchmen', 'four American', 'stared', 'Sometimes', 'Which, to', 'So why', 'forty', 'only seven', 'never went', 'Companies', 'missile', 'Quick thing',
        'hit subscribe', 'unlike', 'Japan', 'Theirs'].map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {[at('pumped'), at('pumped') + 14, at('pumped') + 28].map((f, i) => <Sfx key={`i${i}`} at={f} src="sfx/balloon_inflate.wav" volume={0.3} />)}
      <Sfx at={at('fake radio')} src="sfx/radio_static.wav" volume={0.2} />
      <Sfx at={at('patches')} src="sfx/morse_code.wav" volume={0.14} />
      <Sfx at={at('A real') + 6} src="sfx/boom.wav" volume={0.35} />
      <Sfx at={at('This one') + 6} src="sfx/tick.wav" volume={0.4} />
      <Sfx at={at('waste') + 14} src="sfx/gas_hiss.wav" volume={0.3} />
    </>
  );
};

export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch03_the_fake.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
