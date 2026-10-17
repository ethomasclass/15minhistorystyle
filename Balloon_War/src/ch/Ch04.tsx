// Chapter 4 · The paper balloon: launches in Japan, a 33-foot paper balloon (3D), the edible paste (a bite out of the
// photo), the schoolgirls and the theaters, the jet stream as moving wind on a real-coastline Pacific map with a balloon
// riding it, the rise-sink-drop-a-bag chart, and the landing map built from the 1973 Smithsonian incident list.
import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch04_the_paper_balloon.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, PhotoCard, Stamp, type TL, useScene} from '../kit/shell';
import {along, Bed, resample, Sketch, smoothPath, type P} from '../draw';
import {CORAL, Cutout, ORANGE, P3, Ph, Redact} from '../bw';
import {Map, Wind} from '../pacmap';
import {INCIDENTS} from '../fugo';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);
const TEAL = '#2FE0C4';

/** "In late 1944, Japan started launching balloons … Not spy balloons. Bombs." */
const Launch: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Ph p="ch04_paper_balloon/japanese_crew_filling_balloon_wind.jpg" fx={1300} fy={600} a={0} b={t.at('Each one')} z0={1.04} z1={1.14} band="top"
      tag="A Japanese crew launches a balloon, 1944–45 · from R. Mikesh, Smithsonian, 1973 (public domain)">
      {() => (
        <>
          {g >= t.at('late 1944') && <Highlight text="LATE 1944" x={110} y={90} size={100} at={t.at('late 1944')} seed={41} rot={-2} />}
          <Note text="across the Pacific" x={120} y={240} size={56} rot={-3} at={t.at('across')} color="#ffffff" />
          <Note text="not spy balloons…" x={1100} y={160} size={58} rot={-3} at={t.at('Not spy')} color="#ffffff" />
          <Stamp text="BOMBS" x={1180} y={260} at={t.at('Bombs')} size={170} rot={-6} color={CORAL} />
        </>
      )}
    </Ph>
  );
};

/** "Each one was about 33 feet wide. And they were made of paper." (3D) */
const Wide: React.FC<{t: TL}> = ({t}) => (
  <P3 name="ch04_moffett" a={t.at('Each one') - 1} b={t.at('thousands')} dolly={200} yaw={[-2, 2]} band="bottom"
    tag="A captured balloon inflated for testing, Moffett Field, California, 1945 · US Navy">
    <Sketch pts={[[700, 520], [1220, 520]]} x={0} y={0} at={t.at('33')} dur={8} width={6} color={ORANGE} />
    <Sketch pts={[[700, 500], [700, 540]]} x={0} y={0} at={t.at('33')} dur={3} width={6} color={ORANGE} smooth={false} />
    <Sketch pts={[[1220, 500], [1220, 540]]} x={0} y={0} at={t.at('33') + 6} dur={3} width={6} color={ORANGE} smooth={false} />
    <Note text="about 33 feet wide" x={760} y={420} size={56} rot={-3} at={t.at('33')} color="#ffffff" />
    <Note text="made of PAPER" x={120} y={880} size={72} rot={-3} at={t.at('paper:')} color={CORAL} />
  </P3>
);

/** "thousands of small sheets … glued together with a paste … edible … workers got caught eating it." A bite out of the photo. */
const Paste: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const bite = t.at('eating');
  const bites = [[0, 0], [70, 30], [20, 90]].filter((_, i) => g >= bite + i * 4);
  const mask = bites.map(([dx, dy]) => `radial-gradient(circle 70px at calc(100% - ${30 + dx}px) ${30 + dy}px, transparent 98%, black 100%)`).join(', ');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 100, top: 160, width: 820, transform: 'rotate(-2deg)', WebkitMaskImage: bites.length ? mask : undefined, WebkitMaskComposite: 'source-in' as never, maskComposite: 'intersect' as never}}>
        <div style={{background: '#f4efe6', padding: 18, boxShadow: '0 24px 44px rgba(0,0,0,0.7)'}}>
          <div style={{position: 'relative', width: 784, height: 700, overflow: 'hidden'}}>
            <Cutout name="collapsed" size={[1920, 1488]} place={{left: -59.6, top: 0, scale: 700 / 1488}} at={-999} traceAt={t.at('thousands')} whole src="img/ch04_paper_balloon/collapsed_balloon_on_ground_nara285257.jpg" />
          </div>
        </div>
      </div>
      <Note text="thousands of small sheets of tough paper" x={920} y={200} size={42} rot={-3} at={t.at('thousands')} color="#ffffff" />
      <Note text="glued with paste from a root vegetable" x={1010} y={300} size={42} rot={-3} at={t.at('glued')} color="#ffffff" />
      <Note text="the paste was EDIBLE" x={1030} y={460} size={64} rot={-3} at={t.at('edible')} color={ORANGE} />
      <Note text="(wartime food shortage)" x={1050} y={570} size={46} rot={-3} at={t.at('food shortage')} />
      <Note text="workers got caught eating it" x={1010} y={680} size={52} rot={-3} at={t.at('workers')} color={CORAL} />
      <Tag text="A recovered balloon envelope, 1945 · US Navy (NARA 285257)" />
    </AbsoluteFill>
  );
};

/** The schoolgirls, the theaters, the rules, and what they were never told. */
const Girls: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <PhotoCard src="img/ch04_paper_balloon/schoolgirls_pasting_envelope_fig12.jpg" x={110} y={140} w={760} h={620} rot={-3} at={t.at('And most')} pos="50% 40%" />
      <Note text="mostly teenage girls" x={150} y={830} size={60} rot={-3} at={t.at('teenage')} color="#ffffff" />
      <PhotoCard src="img/ch04_paper_balloon/nichigeki_music_hall_fig13.jpg" x={1000} y={120} w={800} h={500} rot={2} at={t.at('Schools sent')} />
      <Note text="giant theaters and a sumo hall, Tokyo" x={980} y={680} size={42} rot={-3} at={t.at('theaters')} color="#ffffff" />
      <Note text="✕ hairpins   ✕ long nails" x={1000} y={790} size={52} rot={-3} at={t.at('hairpins')} color={ORANGE} />
      <Note text="what they were making:" x={980} y={900} size={44} rot={-3} at={t.at('Officially')} color="#ffffff" />
      <Note text="bombs" x={1580} y={900} size={50} rot={-3} at={t.at('Officially')} color={pal.subject} />
      <Redact x={1565} y={895} w={200} h={64} at={t.at('never told')} rot={-3} />
      <Tag text="Schoolgirls pasting balloon paper; the Nichigeki Music Hall, Tokyo · R. Mikesh, Smithsonian, 1973 (public domain)" />
      {g < 0 && null}
    </AbsoluteFill>
  );
};

/** "But how do you get a paper balloon across the biggest ocean on Earth? You use the wind." */
const JetStream: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('But how');
  return (
    <Map at={a}>
      <Note text="across the biggest ocean on Earth?" x={420} y={90} size={56} rot={-2} at={a + 4} color="#ffffff" />
      <Wind at={t.at('the wind') - 6} rider={t.at('river')} plane={t.at('your flight')} />
      <Note text="a fast river of air, about 30,000 feet up" x={420} y={180} size={46} rot={-2} at={t.at('About 30,000')} color={TEAL} />
      <Highlight text="THE JET STREAM" x={520} y={880} size={90} at={t.at('jet stream')} seed={42} rot={-2} />
      <Note text="west → east" x={1100} y={720} size={52} rot={-3} at={t.at('west')} color="#ffffff" />
      <Note text="(why your flight east is shorter)" x={1000} y={965} size={44} rot={-3} at={t.at('your flight')} color={ORANGE} />
      <Tag text="Coastlines: Natural Earth (public domain); jet stream path illustrative" />
    </Map>
  );
};

/** Rise, sink, drop a bag: an altitude chart drawn live, a sandbag falling at each dip; the real Smithsonian profile below. */
const RiseSink: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const a = t.at('The balloons had');
  const x0 = 160, x1 = 1760, yTop = 260, yLow = 640;
  const dur = t.at('For about') - a;
  const u = interpolate(f, [a + 10, a + 10 + dur], [0, 1], clamp);
  // altitude: up by day, down by night, a sandbag dropped each time it gets too low
  const alt = (s: number) => 0.55 + 0.33 * Math.sin(s * Math.PI * 2 * 3 - Math.PI / 2) * -1;
  const pts: P[] = [...Array(Math.max(2, Math.floor(u * 160)))].map((_, i, arr) => {
    const s = (i / 159);
    return [x0 + (x1 - x0) * s, yLow - (yLow - yTop) * alt(s)];
  });
  const lows = [1, 2, 3].map((k) => (k - 0.75) / 3).filter((s) => s < u);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="the trick:" x={120} y={90} size={56} rot={-2} at={a} color="#ffffff" />
      <Sketch pts={[[x0, yLow + 40], [x1, yLow + 40]]} x={0} y={0} at={a + 2} dur={8} width={4} color="#EDE7DC" />
      <Sketch pts={[[x0, yLow + 40], [x0, yTop - 60]]} x={0} y={0} at={a + 2} dur={8} width={4} color="#EDE7DC" />
      <Note text="height ↑" x={x0 + 14} y={yTop - 70} size={36} rot={-3} at={a + 4} />
      <Note text="3 days →" x={x1 - 160} y={yLow + 60} size={40} rot={-3} at={a + 4} />
      <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
        <path d={`M${x0},${yLow - (yLow - yTop) * 0.22 + 10} L${x1},${yLow - (yLow - yTop) * 0.22 + 10}`} stroke={CORAL} strokeWidth={3} strokeDasharray="12 10" opacity={g >= t.at('sank too') ? 0.9 : 0} />
        {pts.length > 1 && <path d={smoothPath(pts)} stroke={TEAL} strokeWidth={7} fill="none" strokeLinecap="round" />}
        {lows.map((s, i) => {
          const sx = x0 + (x1 - x0) * s, sy = yLow - (yLow - yTop) * alt(s);
          const fall = Math.min(1, (u - s) * 8);
          return <rect key={i} x={sx - 12} y={sy + 20 + fall * 160} width={24} height={30} rx={4} fill={ORANGE} opacity={1 - fall * 0.6} />;
        })}
      </svg>
      <Note text="day: the sun warms the gas → it rises" x={360} y={150} size={40} rot={-2} at={t.at('daytime')} color="#ffffff" />
      <Note text="night: it cools → it sinks" x={1180} y={150} size={40} rot={-2} at={t.at('At night')} color="#ffffff" />
      <Note text="too low? drop a sandbag" x={1100} y={yLow + 120} size={48} rot={-3} at={t.at('let go')} color={ORANGE} />
      {g >= t.at('Rise') && <Highlight text="RISE, SINK, DROP A BAG" x={360} y={880} size={84} at={t.at('Rise')} seed={43} rot={-2} />}
      <Note text="for about three days" x={1300} y={970} size={46} rot={-3} at={t.at('For about')} />
    </AbsoluteFill>
  );
};

/** "Then, over North America, it dropped its bombs." A tall photo, so it sits on a card: balloon in coral, traced. */
const Drop: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('Then, over');
  const k = interpolate(g, [a - 1, a + 90], [1, 1.05], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 1020, top: 70, transform: `rotate(2deg) scale(${k})`, transformOrigin: '50% 30%'}}>
        <div style={{background: '#f4efe6', padding: 18, boxShadow: '0 24px 44px rgba(0,0,0,0.7)'}}>
          <div style={{position: 'relative', width: 749, height: 900, overflow: 'hidden'}}>
            <Cutout name="alturas" size={[1390, 1670]} place={{left: 0, top: 0, scale: 900 / 1670}} at={-999} traceAt={a + 4} whole src="img/ch04_paper_balloon/fugo_inflated_alturas_sc226135.jpg" />
          </div>
        </div>
      </div>
      <Note text="over North America:" x={120} y={420} size={64} rot={-3} at={a} color="#ffffff" />
      <Note text="the bombs" x={160} y={540} size={80} rot={-3} at={t.at('dropped')} color={CORAL} />
      <Tag text="A balloon recovered and re-inflated near Alturas, California, 1945 · US Army Signal Corps" />
    </AbsoluteFill>
  );
};

/** The landing map: about 9,300 launched; every recorded find pops up on its date. */
const Landings: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const a = t.at('Japan launched');
  const run0 = t.at('About 300'), run1 = t.at('So why') - 4;
  const days = INCIDENTS[INCIDENTS.length - 1].t;
  const day = interpolate(f, [run0, run1], [0, days], clamp);
  const shown = INCIDENTS.filter((x) => x.t <= day);
  const date = new Date(Date.UTC(1944, 10, 1) + day * 86400000);
  const label = date.toLocaleDateString('en-US', {month: 'long', year: 'numeric', timeZone: 'UTC'});
  const pal = usePal();
  return (
    <Map at={a - 1} dim={g >= t.at('So why') ? 0.55 : 0}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {shown.map((x, i) => {
          const age = day - x.t;
          const r = 7 + Math.max(0, 10 - age * 0.8);
          return <circle key={i} cx={x.x} cy={x.y} r={r} fill={CORAL} opacity={0.85} stroke="#0d1213" strokeWidth={1.5} />;
        })}
      </svg>
      <Stamp text="~9,300 LAUNCHED" x={110} y={90} at={t.at('9,300')} size={100} rot={-4} />
      {f >= run0 && <div style={{position: 'absolute', left: 120, top: 900, fontFamily: JF.mono, fontSize: 44, color: '#f4efe6', textShadow: '0 2px 10px #000'}}>{label} · {shown.length} found</div>}
      <Note text="Alaska" x={620} y={250} size={48} rot={-3} at={t.at('Alaska')} color="#ffffff" />
      <Note text="Mexico" x={1300} y={760} size={48} rot={-3} at={t.at('Mexico')} color="#ffffff" />
      <Note text="Michigan" x={1675} y={420} size={48} rot={-3} at={t.at('Michigan')} color="#ffffff" />
      <Note text="so why didn't" x={180} y={400} size={74} rot={-3} at={t.at('So why')} color={pal.subject} />
      <Note text="anyone hear about it?" x={200} y={500} size={74} rot={-3} at={t.at('So why') + 6} color={pal.subject} />
      <Tag text="Every dot is a recorded find · R. Mikesh, Japan's World War II Balloon Bomb Attacks on North America, Smithsonian, 1973" />
    </Map>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Launch t={t} />],
    [at('Each one') - 1, <Wide t={t} />],
    [at('thousands') - 1, <Paste t={t} />],
    [at('And most') - 1, <Girls t={t} />],
    [at('But how') - 1, <JetStream t={t} />],
    [at('The balloons had') - 1, <RiseSink t={t} />],
    [at('Then, over') - 1, <Drop t={t} />],
    [at('Japan launched') - 1, <Landings t={t} />],
  ];
  const scene = useScene(cuts.map(([f, n], i): [number, React.ReactNode] => [f, <React.Fragment key={i}>{n}</React.Fragment>]));
  return (
    <>
      {scene}
      {/* b_paper_wind: its floating opening, picked up where ch03 left it (it started 3.5 s before ch03 ended) */}
      <Bed src="music/b_paper_wind.mp3" from={0} to={t.frames + 20} volume={0.2} startFrom={30 * 4} fadeIn={10} />
      <Bed src="sfx/wind_high.wav" from={at('the wind') - 10} to={at('The balloons had')} volume={0.18} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.28} />)}
      {['late 1944', 'Bombs', 'jet stream', 'Rise', '9,300'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {['across', 'Not spy', '33', 'paper:', 'thousands', 'glued', 'edible', 'food shortage', 'workers', 'teenage', 'theaters', 'hairpins', 'Officially', 'About 30,000',
        'west', 'your flight', 'daytime', 'At night', 'let go', 'For about', 'dropped', 'Alaska', 'Mexico', 'Michigan', 'So why'].map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('thousands')} src="sfx/paper_rustle.wav" volume={0.3} />
      {[0, 4, 8].map((d) => <Sfx key={d} at={at('eating') + d} src="sfx/tick.wav" volume={0.35} />)}
      <Sfx at={at('your flight')} src="sfx/plane_flyby.wav" volume={0.18} />
      <Sfx at={at('dropped')} src="sfx/explosion_distant.wav" volume={0.3} />
    </>
  );
};

export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch04_the_paper_balloon.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
