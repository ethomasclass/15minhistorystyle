// Chapter 7 · The Spot: back to Lincoln's question, the strip on the map, the House's 85–81 vote, "Spotty Lincoln",
// Grant's verdict, what supporters said, defense or conquest, and the mid-video subscribe plug.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import mapData from '../../public/maps/mex1846.json';
import words from '../../public/audio/ch07_the_spot.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {Border, type Cam3, Fill, Hand, MAP3D, Map3D, type MapData, Stake, Stand} from '../kit/map3d';
import {Parallax} from '../kit/parallax';
import {ChapterShell, chapterFrames, CropCard, LEAD, makeTimeline, type Narration, Quote, Stamp, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
const D = mapData as unknown as MapData;
const pl = D.places;
export const CH07_FRAMES = chapterFrames(N, LEAD);

const LINCOLN: [number, number] = [1920, 2432];
const SPOT: [number, number] = [960, 1207];
const SPOT_SRC = 'img/ch01/spot_resolutions.jpg';
const POLK: [number, number] = [1920, 2309];
const OFF: [number, number] = [900, 1200];
const MEMOIR: [number, number] = [2458, 3972];

/** December 1847: Lincoln's question, again. */
const Back: React.FC<{t: TL}> = ({t}) => (
  <Parallax name="lincoln" src="img/ch01/lincoln_shepherd_1846.jpg" size={LINCOLN} a={-10} b={t.at('He had')} fx={0.5} fy={0.3}
    cam={{z: [1.12, 1.02], y: [-0.01, 0.02]}} depth={1.06} vignette={0.45} mask={MASKS.lincoln} tintStrength={0.6} traceAt={t.at('Lincoln.')}
    tag="Nicholas H. Shepherd, Abraham Lincoln, 1846 or 1847 · Library of Congress">
    {() => (
      <>
        <Highlight text="DECEMBER 1847" x={100} y={90} size={90} at={t.at('December')} seed={171} rot={-2} />
        <Note text="the war: basically won" x={1180} y={240} size={54} rot={-3} at={t.at('basically') - 2} color="#ffffff" />
        <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 40%)'}} />
        <Quote text="was the spot really American soil?" at={t.at('was the spot')} x={140} y={800} w={1640} size={60} who="Lincoln's question" />
      </>
    )}
  </Parallax>
);

/** He had a point: the fight was in the strip. */
const Strip: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('He had') - 1;
  const keys: Cam3[] = [
    {f: a, x: 3110, y: 2250, z: 1.1, tilt: 46, rot: -6},
    {f: t.at("And he wasn't"), x: 3140, y: 2300, z: 1.5, tilt: 52, rot: -10},
  ];
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Border api={api} d={D.lines.nueces} at={a} dur={8} color={MAP3D.mexico} dashed label="Nueces · Mexico's line" labelSize={26} labelTo={0.9} />
            <Border api={api} d={D.lines.rioGrande} at={a} dur={8} color={MAP3D.us} dashed label="Rio Grande · Texas's claim" labelSize={26} labelTo={0.3} />
            <Fill api={api} region="nuecesStrip" at={t.at('strip') - 2} color="#FF6F61" opacity={0.3} hatch="rgba(255,111,97,0.75)" />
            <Stand api={api} at={pl.carricitos} show={t.at('fight') - 2}><Stake /></Stand>
            <Stand api={api} at={[3200, 2280]} z={30} show={t.at('Land') - 2}><Hand text="claimed by Texas…" size={60} color="#ffffff" bg /></Stand>
            <Stand api={api} at={[3170, 2380]} z={30} show={t.at('never') - 2}><Hand text="…never really governed" size={60} color="#FF6F61" bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Note text="he had a point" x={110} y={90} size={70} rot={-3} at={t.at('point.') - 4} color="#ffffff" />
      </AbsoluteFill>
    </>
  );
};

/** January 1848: the House votes 85–81 that the war was unconstitutionally begun. */
const Vote: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const v = t.at('85') - 2;
  const yes = Math.round(interpolate(g, [v, v + 16], [0, 85], clamp));
  const no = Math.round(interpolate(g, [v + 6, v + 22], [0, 81], clamp));
  const k = interpolate(g, [v, v + 16], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="he wasn't alone" x={110} y={80} size={66} rot={-3} at={t.at('alone.') - 4} color="#ffffff" />
      {g >= t.at('House') && <Highlight text="JANUARY 3, 1848 · THE HOUSE" x={110} y={200} size={70} at={t.at('House')} seed={173} rot={-2} />}
      {g >= v && (
        <div style={{position: 'absolute', left: 120, top: 360, display: 'flex', alignItems: 'flex-end', gap: 30}}>
          <div style={{fontFamily: JF.display, fontSize: 150, color: '#f4efe6', lineHeight: 1}}>{yes}</div>
          <div style={{fontFamily: JF.display, fontSize: 80, color: '#8d867b', lineHeight: 1.4}}>to</div>
          <div style={{fontFamily: JF.display, fontSize: 150, color: pal.subject, lineHeight: 1}}>{no}</div>
        </div>
      )}
      {g >= v && (
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <rect x={120} y={560} width={760 * (85 / 166) * k} height={40} fill="#f4efe6" />
          <rect x={120 + 760 * (85 / 166) * k} y={560} width={760 * (81 / 166) * k} height={40} fill={pal.subject} />
        </svg>
      )}
      <Quote text="unnecessarily and unconstitutionally begun by the President" at={t.at('"unnecessarily')} x={960} y={330} w={860} size={56} who="Ashmun amendment, adopted Jan. 3, 1848" />
      <Note text="…while it's still going on" x={130} y={720} size={60} rot={-3} at={t.at('While') - 2} color="#ffffff" />
      <Stamp text="AWKWARD." x={960} y={760} at={t.at('Awkward.')} size={130} color={pal.subject} rot={-6} />
      <Tag text="House Journal, 30th Congress, 1st session, Jan. 3, 1848" />
    </AbsoluteFill>
  );
};

/** Lincoln pays for it: "Spotty Lincoln"; one term. */
const Spotty: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const g = useGFrame();
  const a = t.at('Lincoln pays') - 1;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src={SPOT_SRC} size={SPOT} x={160} y={120} w={660} h={820} fx={480} fy={640} scale={0.78} rot={-2} at={a} />
      <Note text="Lincoln pays for it" x={960} y={140} size={66} rot={-3} at={t.at('pays') - 2} color="#ffffff" />
      <Note text="papers back home call him…" x={980} y={280} size={54} rot={-3} at={t.at('Papers') - 2} color="#ffffff" />
      {g >= t.at('"Spotty') && <Stamp text="“SPOTTY LINCOLN”" x={950} y={400} at={t.at('"Spotty')} size={86} color={pal.subject} rot={-5} />}
      <Note text="one term → home to Illinois" x={980} y={640} size={58} rot={-3} at={t.at('one term') - 2} />
      <Tag text="Abraham Lincoln, the Spot Resolutions, Dec. 22, 1847 · National Archives" />
    </AbsoluteFill>
  );
};

/** Grant, later: "one of the most unjust ever waged…" */
const Grant: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('And a young') - 1;
  const s = 0.32;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src="img/ch06/grant.jpg" size={OFF} x={130} y={140} w={480} h={600} fx={450} fy={560} scale={0.6} rot={-2} at={a}
        mask={MASKS.grant} tintStrength={0.45} traceAt={t.at('Ulysses')} />
      <Note text="Ulysses S. Grant" x={160} y={780} size={52} rot={-2} at={t.at('Ulysses') - 2} color="#ffffff" />
      <Note text="fought in the war" x={180} y={860} size={48} rot={-2} at={t.at('fought') - 2} />
      <CropCard src="img/ch07/grant_memoirs_p53.jpg" size={MEMOIR} x={760} y={150} w={1040} h={520} fx={1229} fy={3120} scale={s} rot={1.5} at={t.at('later', 2) - 2}>
        {(S) => {
          const [x1, y1] = S(1300, 3151);
          const [x2, y2] = S(820, 3254);
          return (
            <>
              <Loop cx={x1} cy={y1} rx={1000 * s} ry={34} at={t.at('"one', 2) + 2} seed={71} tilt={-1} color={pal.subject} width={6} />
              <Loop cx={x2} cy={y2} rx={560 * s} ry={34} at={t.at('weaker') - 2} seed={73} tilt={-1} color={pal.subject} width={6} />
            </>
          );
        }}
      </CropCard>
      <Note text="written ~40 years later" x={800} y={730} size={50} rot={-2} at={t.at('later', 2) + 4} color="#ffffff" />
      <Tag text="Personal Memoirs of U. S. Grant (1885), vol. 1, p. 53 · portrait 1860s, Library of Congress" />
    </AbsoluteFill>
  );
};

/** Supporters saw it differently. */
const Supporters: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('But supporters') - 1;
  const items: [string, string][] = [
    ['• Mexico refused to negotiate', 'negotiate.'],
    ['• Mexico stopped paying its debts', 'paying'],
    ['• Mexico\'s soldiers fired first', 'fired'],
    ['• Manifest Destiny: "our future"', 'Manifest'],
  ];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Parallax name="polk" src="img/ch01/polk_brady_1849.jpg" size={POLK} a={a} b={t.at('So was it')} fx={0.5} fy={0.3} frame={[1920, 1080]}
        cam={{z: [1.0, 1.06]}} depth={1.05} vignette={0.7} mask={MASKS.polk} tint={null} tag="Mathew Brady, James K. Polk, 1849 · Library of Congress">
        {() => <AbsoluteFill style={{background: 'linear-gradient(to right, rgba(14,12,9,0.15) 0%, rgba(14,12,9,0.85) 48%, rgba(14,12,9,0.95) 100%)'}} />}
      </Parallax>
      <Note text="supporters saw it differently:" x={880} y={90} size={60} rot={-3} at={t.at('supporters') - 2} color="#ffffff" />
      {items.map(([text, cue], i) => (
        <Note key={cue} text={text} x={900} y={230 + i * 120} size={48} rot={-2} at={t.at(cue) - 4} color="#ffffff" />
      ))}
      {g >= t.at('popular.') - 2 && <Highlight text="THE WAR WAS POPULAR" x={890} y={760} size={72} at={t.at('popular.') - 2} seed={175} rot={-2} />}
      <Note text="in much of the country" x={920} y={900} size={50} rot={-2} at={t.at('much') - 2} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** Defense, or conquest? */
const Debate: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const tilt = interpolate(g, [t.at('Some blame'), t.at('Some blame') + 10, t.at('Others'), t.at('Others') + 10, t.at('The evidence'), t.at('The evidence') + 14], [0, -8, -8, 8, 8, 0], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('defense,') && <Highlight text="DEFENSE?" x={200} y={130} size={120} at={t.at('defense,')} seed={177} rot={-3} />}
      {g >= t.at('conquest?') && <Highlight text="CONQUEST?" x={1060} y={130} size={120} at={t.at('conquest?')} seed={179} rot={2} />}
      <Note text="historians: arguing for more than a century" x={560} y={330} size={54} rot={-2} at={t.at('Historians') - 2} color="#ffffff" />
      {g >= t.at('Some blame') - 6 && (
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <g transform={`rotate(${tilt} 960 560)`}>
            <line x1={560} y1={560} x2={1360} y2={560} stroke="#f4efe6" strokeWidth={10} strokeLinecap="round" />
            <line x1={560} y1={560} x2={560} y2={660} stroke="#f4efe6" strokeWidth={4} />
            <line x1={1360} y1={560} x2={1360} y2={660} stroke="#f4efe6" strokeWidth={4} />
            <path d="M460,660 L660,660 Q560,720 460,660 Z" fill="#f4efe6" />
            <path d="M1260,660 L1460,660 Q1360,720 1260,660 Z" fill="#f4efe6" />
          </g>
          <path d="M960,560 L920,820 L1000,820 Z" fill="#f4efe6" />
        </svg>
      )}
      <Note text="some blame Mexico" x={330} y={790} size={56} rot={-3} at={t.at('Some blame') - 2} color={MAP3D.mexico} />
      <Note text="others blame Polk" x={1180} y={790} size={56} rot={-3} at={t.at('Others') - 2} color={MAP3D.us} />
      <Note text="the evidence gives each side something to hold onto" x={330} y={920} size={52} rot={-2} at={t.at('The evidence') - 2} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** The mid-video subscribe plug, tied to Lincoln's eight questions. */
const Subscribe: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src={SPOT_SRC} size={SPOT} x={1320} y={130} w={400} h={520} fx={480} fy={600} scale={0.5} rot={4} at={t.at('unlike') - 1} />
      <Note text="quick thing before the treaty:" x={170} y={170} size={58} rot={-3} at={t.at('Quick') - 2} color="#ffffff" />
      {g >= t.at('subscribe.') && <Highlight text="SUBSCRIBE" x={170} y={300} size={130} at={t.at('subscribe.')} seed={181} rot={-2} />}
      <Note text="free" x={200} y={530} size={64} rot={-3} at={t.at('free,') - 3} />
      <Note text="really helps the channel" x={200} y={640} size={64} rot={-3} at={t.at('really helps') - 3} />
      <Note text="unlike Lincoln: I'm only asking once" x={170} y={790} size={54} rot={-3} at={t.at('unlike') - 3} color={pal.subject} />
      <Note text="subscribe ↓" x={1500} y={960} size={44} rot={-2} at={t.at('subscribe.') + 6} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Back t={t} />],
    [at('He had') - 1, <Strip t={t} />],
    [at("And he wasn't") - 1, <Vote t={t} />],
    [at('Lincoln pays') - 1, <Spotty t={t} />],
    [at('And a young') - 1, <Grant t={t} />],
    [at('But supporters') - 1, <Supporters t={t} />],
    [at('So was it') - 1, <Debate t={t} />],
    [at('Quick thing') - 1, <Subscribe t={t} />],
  ];
  const scene = useScene(cuts);
  const notes = ['basically', 'point.', 'alone.', 'While', 'pays', 'Papers', 'one term', 'fought', 'supporters', 'negotiate.', 'paying', 'fired', 'Manifest', 'much',
    'Historians', 'Some blame', 'Others', 'The evidence', 'Quick', 'free,', 'really helps', 'unlike'];
  return (
    <>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['December', 'House', 'defense,', 'conquest?', 'subscribe.'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {['Awkward.', '"Spotty'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.38} />)}
      {notes.map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('85') - 2} src="sfx/tick.wav" volume={0.4} />
      <Sfx at={at('"one', 2) + 2} src="sfx/marker_tick.wav" volume={0.4} />
    </>
  );
};

export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch07_the_spot.wav" lead={LEAD} music={[{src: 'music/r_cold_open.mp3', volume: 0.15, startFrom: 30 * 30}]}>
    <Body />
  </ChapterShell>
);
