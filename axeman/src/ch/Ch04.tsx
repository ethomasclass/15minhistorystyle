// Chapter 4 · A City Sitting Up at Night: August 1918 (Schneider, Romano), the second back door, the name
// "the Axeman", the panic, and seven quiet months under the flu and the armistice.
import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import words from '../../public/audio/ch04_sitting_up.words.json';
import {Highlight, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {Bed, Clip, Counter, Desk, Door, DropCard, Pic, Shadow, Sounds, Witness} from '../kit/ax';
import {P} from '../pics';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);

const August: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Desk a={0}>
      <Clip src={P.axMap1918.src} x={1080} y={130} w={600} rot={3} at={4} />
      {g >= t.at('August.') && <Highlight text="AUGUST 1918" x={140} y={330} size={120} at={t.at('August.')} seed={41} rot={-2} />}
      <Note text="things speed up" x={200} y={530} size={70} rot={-4} at={t.at('speed')} />
      <Tag text={P.axMap1918.tag} />
    </Desk>
  );
};

/** Anna Schneider: no photograph survives that we can use, so the scene is the desk at night and her facts. */
const Schneider: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('August 5th.')} flicker>
      <Shadow a={t.at('dark figure') - 10} b={t.at('dark figure') + 70} y={60} size={1100} opacity={0.6} />
      <Note text="august 5" x={140} y={110} size={60} rot={-3} at={t.at('August 5th.')} color="#ffffff" />
      <Note text="Anna Schneider, eight months pregnant" x={180} y={260} size={66} rot={-3} at={t.at('Anna Schneider,')} />
      <Note text="a dark figure over her bed" x={220} y={420} size={66} rot={-3} at={t.at('dark figure')} />
      <Note text="she survives" x={260} y={620} size={74} rot={-4} at={t.at('She survives,')} color={pal.subject} />
      <Note text="...and two days later, a healthy baby girl" x={300} y={770} size={62} rot={-3} at={t.at('healthy')} color="#ffffff" />
    </Desk>
  );
};

/** Joseph Romano: the nieces' description, drawn like a police sketch as each detail is spoken. */
const Romano: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('August 10th.')}>
      <Note text="august 10 · Joseph Romano" x={120} y={100} size={60} rot={-3} at={t.at('August 10th.')} color="#ffffff" />
      <Note text="what his nieces saw:" x={120} y={220} size={56} rot={-3} at={t.at('The nieces')} />
      <Witness x={760} y={230} h={720} at={t.at('running away.')} />
      <Note text="heavy-set" x={1260} y={420} size={70} rot={-4} at={t.at('Heavy-set.')} />
      <Note text="dark suit" x={1260} y={560} size={70} rot={-4} at={t.at('Dark suit.')} />
      <Note text="slouch hat" x={1220} y={240} size={70} rot={-4} at={t.at('Slouch hat.')} />
      <Note text="Romano dies two days later" x={140} y={900} size={58} rot={-3} at={t.at('Romano dies')} color={pal.subject} />
    </Desk>
  );
};

/** The second back door. */
const Door2: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('In the yard,')} flicker>
    <Door x={790} y={150} h={720} at={t.at('In the yard,')} cut={t.at('a panel chiseled')} />
    <Note text="a bloody axe in the yard" x={120} y={160} size={60} rot={-3} at={t.at('bloody axe.')} color="#ffffff" />
    <Note text="the back door again" x={1240} y={820} size={60} rot={-4} at={t.at('back door,')} />
    <Counter label="BACK DOORS" n={2} at={t.at('a panel chiseled') + 6} />
  </Desk>
);

/** The papers name him. */
const Name: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Desk a={t.at('Now the newspapers')}>
      <Clip src={P.axMap1918.src} x={160} y={110} w={560} rot={-3} at={t.at('Now the newspapers')} />
      <Note text="the newspapers' name for him:" x={860} y={260} size={58} rot={-3} at={t.at('a name')} color="#ffffff" />
      {g >= t.at('The Axeman.') && <Highlight text="THE AXEMAN" x={840} y={420} size={140} at={t.at('The Axeman.')} seed={43} rot={-3} />}
      <Tag text={P.axMap1918.tag} />
    </Desk>
  );
};

/** The panic: a street at night, and everything people reported. */
const Panic: React.FC<{t: TL}> = ({t}) => (
  <Pic src={P.street.src} tag={P.street.tag} a={t.at('And New Orleans panics.')} b={t.at("That's mass")} z0={1.03} z1={1.16} look="night" flicker>
    {() => (
      <>
        <Note text="a prowler on every block" x={110} y={110} size={64} rot={-3} at={t.at('prowler')} />
        <Note text="shotguns across their knees" x={150} y={260} size={64} rot={-3} at={t.at('shotguns')} />
        <Note text={'"i found an axe in my backyard!"'} x={190} y={420} size={64} rot={-3} at={t.at('found an axe')} />
        <Note text="(that's where axes live)" x={1120} y={860} size={58} rot={-4} at={t.at('where a lot')} color="#ffffff" />
      </>
    )}
  </Pic>
);

/** Rings spreading from one point: fear outrunning the facts. */
const Hysteria: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('Fear spreading');
  return (
    <Desk a={t.at("That's mass")}>
      <AbsoluteFill>
        <svg width={1920} height={1080}>
          {g >= a && Array.from({length: 6}).map((_, i) => {
            const u = ((g - a - i * 8) % 48) / 48;
            if (g - a - i * 8 < 0) return null;
            return <circle key={i} cx={1320} cy={600} r={40 + u * 520} fill="none" stroke={pal.mark} strokeWidth={10 - u * 7} opacity={1 - u} />;
          })}
          {g >= a && <circle cx={1320} cy={600} r={22} fill={pal.subject} />}
        </svg>
      </AbsoluteFill>
      {g >= t.at('mass hysteria.') && <Highlight text="MASS HYSTERIA" x={120} y={150} size={120} at={t.at('mass hysteria.')} seed={45} rot={-2} />}
      <Note text="fear spreading" x={160} y={420} size={78} rot={-4} at={t.at('Fear spreading')} />
      <Note text="faster than the facts" x={200} y={560} size={78} rot={-4} at={t.at('faster')} color={pal.subject} />
    </Desk>
  );
};

/** Then nothing: the flu closes the city, the war ends, and seven months go by. */
const Quiet: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('seven months,');
  const months = ['AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB'];
  return (
    <Desk a={t.at('And then, nothing.')}>
      <Note text="and then... nothing" x={120} y={90} size={64} rot={-3} at={t.at('And then, nothing.')} color="#ffffff" />
      <DropCard src={P.flu.src} x={140} y={240} w={640} rot={-3} at={t.at('flu')} />
      <DropCard src={P.armistice.src} x={980} y={220} w={700} rot={3} at={t.at('war ends.')} />
      <Note text="the flu: schools, churches, theaters closed" x={140} y={720} size={50} rot={-2} at={t.at('flu')} />
      <Note text="november: the war ends" x={1000} y={720} size={50} rot={-2} at={t.at('In November,')} />
      {months.map((m, i) => g >= a + i * 3 && (
        <div key={m} style={{position: 'absolute', left: 300 + i * 190, top: 860, fontFamily: '"IBM Plex Mono"', fontSize: 40, letterSpacing: 2, color: '#fff', transform: `rotate(${(random(m) - 0.5) * 8}deg)`}}>{m}</div>
      ))}
      <Note text="7 quiet months" x={760} y={950} size={60} rot={-2} at={t.at('quiet.')} color={pal.subject} />
      <Tag text={`${P.flu.tag} · ${P.armistice.tag}`} y={40} />
    </Desk>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <August t={t} />],
    [at('August 5th.') - 1, <Schneider t={t} />],
    [at('August 10th.') - 1, <Romano t={t} />],
    [at('In the yard,') - 1, <Door2 t={t} />],
    [at('Now the newspapers') - 1, <Name t={t} />],
    [at('And New Orleans panics.') - 1, <Panic t={t} />],
    [at("That's mass") - 1, <Hysteria t={t} />],
    [at('And then, nothing.') - 1, <Quiet t={t} />],
  ];
  const scene = useScene(cuts);
  const quiet = at('And then, nothing.');
  return (
    <>
      {scene}
      <Bed src="music/g_grip.mp3" from={0} to={at('Now the newspapers') + 6} vol={0.17} fadeOut={10} />
      <Bed src="music/a_newsroom.mp3" from={at('Now the newspapers') - 2} to={quiet + 2} vol={0.17} fadeIn={6} fadeOut={8} />
      <Bed src="music/r_dix.mp3" from={quiet + 10} to={t.frames + 34} vol={0.1} fadeIn={30} />
      <Sounds t={t} cuts={cuts.map(([f]) => f)}
        stamps={['August.', 'The Axeman.', 'mass hysteria.']}
        writes={['speed', 'August 5th.', 'Anna Schneider,', 'dark figure', 'She survives,', 'healthy', 'August 10th.', 'The nieces', 'Heavy-set.', 'Dark suit.', 'Slouch hat.', 'Romano dies',
          'bloody axe.', 'back door,', 'a name', 'prowler', 'shotguns', 'found an axe', 'where a lot', 'Fear spreading', 'faster', 'And then, nothing.', 'flu', 'In November,', 'quiet.']}
        ticks={['war ends.', ...[0, 1, 2, 3, 4, 5, 6].map((i) => at('seven months,') + i * 3)]}
        booms={['The Axeman.']}
        extra={[[at('a panel chiseled'), 'sfx/chisel.wav', 0.45], [at('dark figure'), 'sfx/heartbeat.wav', 0.45]]} />
    </>
  );
};

export const Ch04 = () => (
  <ChapterShell n={N} audio="audio/ch04_sitting_up.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
