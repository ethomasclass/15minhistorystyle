// Video 2 · the cold open: the Old City of Jerusalem, three holy places in a 15-minute walk, the Abrahamic religions,
// the puzzle (one neighbourhood, three very different maps). Then the channel intro and the title card.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch01_cold_open.words.json';
import credits from '../../public/img/credits.json';
import {clamp} from '../lib/anim';
import {Arrow, Finish, Highlight, JF, Loop, Note, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChannelIntro, INTRO_FRAMES} from '../kit/Intro';
import {CropCard, Definition, hasFile, makeTimeline, type Narration, Photo, PhotoCard, type TL, useScene} from '../kit/shell';
import {Pie} from '../kit/charts';
import {PAL} from '../kit/look';
import {Dot, type Fill, MapLabel, WorldMap} from '../kit/asia';
import {DATES, SUBTITLE, TITLE} from '../project';

const N = words as Narration;
const TITLE_FRAMES = 150;
const END = Math.ceil(N.duration * 30) + 20;
export const CH01_FRAMES = END + INTRO_FRAMES + TITLE_FRAMES;

/** Modern photos stay in colour, muted so the teal and coral marks read on top. */
const MUTED = 'saturate(0.55) contrast(1.08) brightness(0.82)';

/** Credit line for a picture from public/img/credits.json (used for pictures that may arrive later). */
type Credit = {title: string; artist: string; licence: string};
const CREDITS = credits as unknown as Record<string, Credit>;
const credit = (key: string, fallback: string) => {
  const c = CREDITS[key];
  if (!c) return fallback;
  const title = c.title.replace(/^File:/, '').replace(/\.[a-z]+$/i, '').replace(/_/g, ' ').slice(0, 60);
  const artist = c.artist.replace(/\s*\(.*$/, '').replace(/\s+from .*$/, '').slice(0, 36);
  return `${title} · ${artist}, ${c.licence}, via Wikimedia Commons`;
};

const AERIAL = 'img/ch01/jerusalem_temple_mount_aerial.jpg';
const AERIAL_SIZE: [number, number] = [1920, 1442];
const AERIAL_TAG = 'Jerusalem, aerial view of the Temple Mount · Godot13, CC BY-SA 4.0, via Wikimedia Commons';

/** Places as [lon, lat]. */
const LL = {
  jerusalem: [35.23, 31.78] as [number, number],
  mecca: [39.83, 21.42] as [number, number],
  jakarta: [106.85, -6.2] as [number, number],
};

/** Where each faith's followers live today (simplified; shaded = majority religion, lighter = roughly split). */
const CHRISTIAN = [
  // the Americas
  '840', '124', '484', '320', '084', '340', '222', '558', '188', '591', '192', '332', '214', '388', '170', '862', '328', '740', '218', '604', '068', '076', '600', '152', '032', '858', '780',
  // Europe
  '826', '372', '250', '724', '620', '380', '276', '528', '056', '756', '040', '616', '203', '703', '348', '642', '100', '300', '688', '191', '705', '807', '499', '804', '112', '643',
  '440', '428', '233', '246', '752', '578', '208', '352', '498', '268', '051', '442',
  // sub-Saharan Africa
  '231', '180', '024', '710', '404', '800', '834', '894', '716', '508', '454', '450', '288', '120', '178', '266', '516', '072', '646', '108', '140', '728', '426', '748', '430',
  // Asia-Pacific
  '608', '036', '554', '598', '626',
];
const MUSLIM = [
  '504', '012', '788', '434', '818', '729', '478', '466', '562', '686', '706', '682', '887', '512', '784', '634', '414', '048', '400', '760', '368', '364', '792', '004', '586', '050',
  '398', '860', '795', '417', '762', '031', '360', '458', '148', '324', '270', '854', '262', '096', '732', '008', '462',
];
const SPLIT = ['566']; // Nigeria: roughly half Muslim, half Christian
const INDONESIA = '360';

/** Jewish communities: [lon, lat, radius]. Israel and the United States are the two big ones. */
const JEWISH: [number, number, number][] = [
  [35.0, 31.5, 22], [-77, 40.5, 20],
  [2.35, 48.85, 8], [-79.4, 43.7, 7], [-0.12, 51.5, 7], [-58.4, -34.6, 7], [37.6, 55.75, 6], [13.4, 52.5, 5], [144.96, -37.8, 6],
  [-46.6, -23.5, 5], [28.0, -26.2, 5], [30.5, 50.45, 5], [-99.1, 19.4, 4], [19.05, 47.5, 4], [-118.2, 34.0, 7], [-80.2, 25.8, 6],
];

// ---------- scenes ----------

/** The Old City from the air: small enough to walk across in a quarter hour. */
const Aerial: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const w = t.at('walk');
  const bar = interpolate(g, [w + 2, w + 10], [0, 1], clamp);
  const X0 = 1240, X1 = 1760, Y = 930;
  return (
    <Photo src={AERIAL} size={AERIAL_SIZE} fx={960} fy={620} z0={1.02} z1={1.14} a={0} b={t.at('The Western')} bw={MUTED} vignette={0.7}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0) 34%, rgba(0,0,0,0) 72%, rgba(0,0,0,0.6) 100%)'}} />
          <Highlight text="THE OLD CITY OF JERUSALEM" x={100} y={86} size={84} at={t.at('Old City')} seed={11} rot={-2} />
          <Note text="smaller than a lot of high school campuses" x={120} y={226} size={50} rot={-2} at={t.at('smaller') - 3} color="#ffffff" />
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <line x1={X0} y1={Y} x2={X0 + (X1 - X0) * bar} y2={Y} stroke={pal.mark} strokeWidth={7} strokeLinecap="round" />
            {bar > 0 && <line x1={X0} y1={Y - 18} x2={X0} y2={Y + 18} stroke={pal.mark} strokeWidth={6} strokeLinecap="round" />}
            {bar >= 1 && <line x1={X1} y1={Y - 18} x2={X1} y2={Y + 18} stroke={pal.mark} strokeWidth={6} strokeLinecap="round" />}
          </svg>
          <Note text="about 1 km across" x={X0 + 10} y={Y - 92} size={44} rot={-2} at={w + 4} color="#ffffff" />
          <Note text="about 15 min to walk across" x={X0 - 160} y={Y + 18} size={50} rot={-2} at={t.at('15') - 3} />
          <Note text="...packed with some of the holiest places on Earth" x={120} y={306} size={50} rot={-2} at={t.at('packed') - 3} color={pal.subject} />
          <Tag text={AERIAL_TAG} />
        </>
      )}
    </Photo>
  );
};

/** Three holy places, three faiths: cards on the desk as each is named. */
const DOME = 'img/ch01/dome_of_the_rock.jpg';
const Places: React.FC<{t: TL}> = ({t}) => {
  const W = 500, H = 380, Y = 150;
  const xs = [110, 710, 1310];
  const dome = hasFile(DOME);
  const ww = t.at('Western');
  const hs = t.at('Church');
  const dr = t.at('Dome');
  const label = (text: string, i: number, at: number, seed: number) => <Highlight text={text} x={xs[i] - 4} y={Y + H + 70} size={44} at={at} seed={seed} rot={-1.5} />;
  const faith = (who: string, i: number, at: number) => (
    <>
      <Note text="sacred to" x={xs[i] + 6} y={Y + H + 160} size={40} rot={-2} at={at - 3} color="#ffffff" />
      <Note text={who} x={xs[i] + 16} y={Y + H + 230} size={50} rot={-2} at={at + 2} color={PAL.teal} />
    </>
  );
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src="img/ch01/western_wall_crowd.jpg" size={[1920, 1280]} x={xs[0]} y={Y} w={W} h={H} fx={960} fy={700} scale={0.36} rot={-2} at={ww - 1} bw={MUTED} />
      <CropCard src="img/ch01/holy_sepulchre.jpg" size={[1920, 1785]} x={xs[1]} y={Y} w={W} h={H} fx={1150} fy={820} scale={0.36} rot={2} at={hs - 1} bw={MUTED} />
      {dome ? (
        <PhotoCard src={DOME} x={xs[2] - 14} y={Y - 14} w={W + 28} h={H} rot={-2} at={dr - 1} filter={MUTED} pos="50% 50%" />
      ) : (
        <CropCard src={AERIAL} size={AERIAL_SIZE} x={xs[2]} y={Y} w={W} h={H} fx={975} fy={520} scale={0.95} rot={-2} at={dr - 1} bw={MUTED} />
      )}
      {label('WESTERN WALL', 0, ww, 21)}
      {faith('Jews', 0, t.at('sacred'))}
      {label('HOLY SEPULCHRE', 1, hs, 22)}
      {faith('many Christians', 1, t.at('many Christians'))}
      {label('DOME OF THE ROCK', 2, dr, 23)}
      {faith('Muslims', 2, t.at('sacred', 2))}
      <Note text="all inside the same walls" x={640} y={60} size={48} rot={-2} at={ww - 3} color="#ffffff" />
      <Tag text="Prayers at the Western Wall · Askii, CC BY-SA 3.0, via Wikimedia Commons" y={976} />
      <Tag text="Jerusalem, Holy Sepulchre · Berthold Werner, CC BY-SA 3.0, via Wikimedia Commons" y={1003} />
      <Tag text={dome ? credit(DOME, 'Dome of the Rock, Jerusalem · via Wikimedia Commons') : AERIAL_TAG.replace('aerial view of the Temple Mount', 'Dome of the Rock (detail of aerial view)')} y={1030} />
    </AbsoluteFill>
  );
};

/** Abrahamic, monotheistic, and more than half of humanity. */
const Abrahamic: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const h = t.at('half');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="Judaism" x={110} y={46} size={60} rot={-3} at={t.at('Judaism') - 3} color="#ffffff" />
      <Note text="· Christianity" x={380} y={46} size={60} rot={-3} at={t.at('Christianity') - 3} color="#ffffff" />
      <Note text="· Islam" x={850} y={46} size={60} rot={-3} at={t.at('Islam') - 3} color="#ffffff" />
      <Highlight text="ABRAHAMIC RELIGIONS" x={100} y={150} size={76} at={t.at('Abrahamic')} seed={31} rot={-2} />
      <Definition term="Abrahamic religions" def="Judaism, Christianity and Islam, which all trace their story back to Abraham" at={t.at('Abrahamic') + 9} x={110} y={280} w={780} />
      <Highlight text="MONOTHEISTIC" x={100} y={470} size={76} at={t.at('monotheistic')} seed={32} rot={-2} />
      <Definition term="monotheistic" def="believing in one God" at={t.at('monotheistic') + 9} x={110} y={600} w={780} />
      <Note text="more than half the people alive today" x={110} y={760} size={56} rot={-2} at={h - 3} color={pal.subject} />
      <Note text="about 4.3 of 8.2 billion" x={130} y={850} size={48} rot={-2} at={h + 10} color="#ffffff" />
      <Pie cx={1460} cy={620} r={220} at={t.at('together') - 4} per={9}
        slices={[
          {label: 'Abrahamic', value: 4.3, pct: '52%', subject: true, labelAt: [1520, 935]},
          {label: 'everyone else', value: 3.9, pct: '48%', labelAt: [1230, 320]},
        ]} />
      <Tag text="Pew Research Center, Global Religious Landscape (2020 estimates, rounded)" />
    </AbsoluteFill>
  );
};

/** The puzzle: three religions born within about 800 miles of each other. */
const Hearths: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('So heres');
  const w = t.at('within');
  const lk = t.at('look');
  const p = interpolate(useGFrame(), [w, w + 10], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 38, lat: 27, z: 5.2}, {f: w + 10, lon: 37, lat: 27, z: 5.6}, {f: lk, lon: 37, lat: 27, z: 5.6}, {f: lk + 40, lon: 20, lat: 12, z: 1.05}]}
        fills={[{id: '376', at: t.at('three religions') + 2, color: PAL.coral, opacity: 0.5}]}>
        {(S, z) => {
          const [jx, jy] = S(LL.jerusalem);
          const [mx, my] = S(LL.mecca);
          const big = z > 3;
          return (
            <>
              <Dot x={jx} y={jy} at={t.at('three religions')} r={big ? 13 : 7} color={pal.subject} />
              <Dot x={mx} y={my} at={t.at('three religions') + 4} r={big ? 13 : 7} color={pal.subject} />
              {big && (
                <>
                  <MapLabel text="Jerusalem" x={jx - 96} y={jy - 46} at={t.at('three religions')} align="right" color={PAL.cream} size={30} />
                  <MapLabel text="Mecca" x={mx + 42} y={my + 6} at={t.at('three religions') + 4} color={PAL.cream} size={30} />
                  <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
                    <line x1={jx} y1={jy} x2={jx + (mx - jx) * p} y2={jy + (my - jy) * p} stroke={PAL.cream} strokeWidth={5} strokeDasharray="14 12" strokeLinecap="round" />
                  </svg>
                  <Loop cx={(jx + mx) / 2 + 10} cy={(jy + my) / 2} rx={200} ry={380} at={t.at('started')} seed={41} tilt={-18} color={pal.mark} />
                  <MapLabel text="the hearth region" x={(jx + mx) / 2 + 250} y={(jy + my) / 2 - 300} at={t.at('started') + 6} color={pal.mark} size={30} />
                </>
              )}
            </>
          );
        }}
      </WorldMap>
      <Note text="so here's the puzzle..." x={110} y={80} size={60} rot={-3} at={t.at('puzzle') - 3} color="#ffffff" />
      <Note text="within about 800 miles" x={1180} y={820} size={60} rot={-3} at={w - 3} out={lk} color={pal.subject} />
      <Note text="of each other" x={1240} y={910} size={50} rot={-3} at={w + 12} out={lk} color="#ffffff" />
      <Note text="but where do their followers live now?" x={560} y={880} size={60} rot={-3} at={lk - 3} color="#ffffff" />
      <Tag text="Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** One world map, three layers: where the followers of each religion live now. */
const Followers: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const j = t.at('One is scattered');
  const c = t.at('One is centered');
  const i = t.at('And one');
  const fills: Fill[] = [
    ...CHRISTIAN.map((id, k) => ({id, at: c + 2 + (k % 8), color: PAL.orange, opacity: 0.7})),
    ...SPLIT.map((id) => ({id, at: c + 6, color: PAL.orange, opacity: 0.3})),
  ];
  const islam: Fill[] = [
    ...MUSLIM.filter((id) => id !== INDONESIA).map((id, k) => ({id, at: i + 2 + (k % 8), color: PAL.cream, opacity: 0.45})),
    ...SPLIT.map((id) => ({id, at: i + 6, color: PAL.cream, opacity: 0.22})),
    {id: INDONESIA, at: t.at('largest'), color: PAL.coral, opacity: 0.95},
  ];
  const phase = g < c ? 0 : g < i ? 1 : 2;
  const cam = [{f: j, lon: 15, lat: 12, z: 1.05}, {f: i, lon: 15, lat: 12, z: 1.05}, {f: i + 30, lon: 60, lat: 10, z: 1.7}];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={cam} fills={phase === 1 ? fills : phase === 2 ? islam : []}>
        {(S, z) => {
          const [mx, my] = S(LL.mecca);
          const [jx, jy] = S(LL.jakarta);
          const [ix, iy] = S([117, -1.5]);
          return (
            <>
              {phase === 0 && JEWISH.map(([lon, lat, r], k) => {
                const [x, y] = S([lon, lat]);
                return <Dot key={k} x={x} y={y} at={j + 2 + k * 2} r={r} color={PAL.teal} ring={r > 10} />;
              })}
              {phase === 0 && (() => {
                const [ax, ay] = S([35, 31.5]);
                const [ux, uy] = S([-77, 40.5]);
                return (
                  <>
                    <MapLabel text="Israel" x={ax + 34} y={ay + 40} at={j + 6} color={PAL.teal} size={26} />
                    <MapLabel text="United States" x={ux - 20} y={uy + 60} at={j + 8} align="center" color={PAL.teal} size={26} />
                  </>
                );
              })()}
              {phase === 2 && (
                <>
                  <Dot x={mx} y={my} at={i + 4} r={9} color={pal.subject} />
                  <MapLabel text="Mecca" x={mx - 26} y={my + 34} at={i + 4} align="right" color={PAL.cream} size={26} />
                  <Arrow x1={mx + 16} y1={my + 8} x2={jx - 22} y2={jy - 10} bow={-60} at={t.at('nearly') - 2} dur={14} width={6} color={pal.subject} />
                  <Loop cx={ix} cy={iy} rx={120 * z / 1.7} ry={60 * z / 1.7} at={t.at('country')} seed={51} tilt={-8} color={pal.mark} />
                  <MapLabel text="Indonesia" x={ix - 60} y={iy + 110} at={t.at('country')} align="center" color={pal.subject} size={30} />
                </>
              )}
            </>
          );
        }}
      </WorldMap>
      {phase === 0 && (
        <>
          <Highlight text="JUDAISM" x={100} y={760} size={76} at={j} seed={61} rot={-2} />
          <Note text="scattered in small communities" x={110} y={880} size={52} rot={-2} at={t.at('scattered') - 3} color="#ffffff" />
        </>
      )}
      {phase === 1 && (
        <>
          <Highlight text="CHRISTIANITY" x={100} y={760} size={76} at={c} seed={62} rot={-2} />
          <Note text="centered in Africa + Latin America" x={110} y={880} size={52} rot={-2} at={t.at('Africa') - 3} color="#ffffff" />
        </>
      )}
      {phase === 2 && (
        <>
          <Highlight text="ISLAM" x={100} y={760} size={76} at={i} seed={63} rot={-2} />
          <Note text="largest population: Indonesia" x={110} y={880} size={52} rot={-2} at={t.at('largest') - 3} color="#ffffff" />
          <Note text="nearly 5,000 miles" x={1060} y={330} size={58} rot={-6} at={t.at('nearly') - 3} color={pal.subject} />
        </>
      )}
      <Tag text="Simplified: shaded = majority religion (lighter = roughly split); dots = notable communities · Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** Same neighbourhood, three different maps (the shape the ending comes back to). */
const ThreeMaps: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Same');
  const cam = [{f: 0, lon: 15, lat: 12, z: 0.3}];
  const W = 540, H = 330, Y = 300;
  const xs = [90, 690, 1290];
  const head = (text: string, x: number, color: string, at: number) => (
    <MapLabel text={text} x={x + W / 2} y={Y - 40} at={at} align="center" color={color} size={34} />
  );
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="same neighborhood." x={110} y={80} size={64} rot={-3} at={a - 3} color="#ffffff" />
      <Note text="three totally different maps." x={700} y={100} size={64} rot={-3} at={t.at('Three totally') - 3} />
      {head('Judaism', xs[0], PAL.teal, a)}
      {head('Christianity', xs[1], PAL.orange, a + 4)}
      {head('Islam', xs[2], PAL.coral, a + 8)}
      <WorldMap x={xs[0]} y={Y} w={W} h={H} frame keys={cam}>
        {(S) => (<>{JEWISH.map(([lon, lat, r], k) => {
          const [x, y] = S([lon, lat]);
          return <Dot key={k} x={x} y={y} at={a + 2 + (k % 6)} r={Math.max(4, r * 0.45)} color={PAL.teal} ring={false} />;
        })}</>)}
      </WorldMap>
      <WorldMap x={xs[1]} y={Y} w={W} h={H} frame keys={cam}
        fills={[...CHRISTIAN.map((id) => ({id, at: a + 4, color: PAL.orange, opacity: 0.75})), ...SPLIT.map((id) => ({id, at: a + 4, color: PAL.orange, opacity: 0.3}))]} />
      <WorldMap x={xs[2]} y={Y} w={W} h={H} frame keys={cam}
        fills={[...MUSLIM.map((id) => ({id, at: a + 8, color: id === INDONESIA ? PAL.coral : PAL.cream, opacity: id === INDONESIA ? 0.95 : 0.45})),
          ...SPLIT.map((id) => ({id, at: a + 8, color: PAL.cream, opacity: 0.22}))]} />
      <Note text="scattered" x={xs[0] + 10} y={Y + H + 34} size={40} rot={-2} at={a + 8} color="#ffffff" />
      <Note text="Africa + Latin America" x={xs[1] + 10} y={Y + H + 34} size={40} rot={-2} at={a + 12} color="#ffffff" />
      <Note text="biggest: Indonesia" x={xs[2] + 10} y={Y + H + 34} size={40} rot={-2} at={a + 16} color="#ffffff" />
      <Note text="why?" x={860} y={820} size={120} rot={-4} at={t.at('Why') - 3} color={pal.subject} />
      <Tag text="Simplified: shaded = majority religion; dots = notable communities · Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** Title card: the eastern Mediterranean dimmed behind the title, Jerusalem's hilltop in coral. */
const Title: React.FC = () => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <DarkPaper />
      <AbsoluteFill style={{opacity: 0.55}}>
        <WorldMap keys={[{f: 0, lon: 38, lat: 28, z: 3.3}, {f: 150, lon: 37, lat: 28, z: 3.6}]} fills={[{id: '376', at: 0, color: PAL.coral, opacity: 0.6}]} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(8,6,4,0.2) 30%, rgba(8,6,4,0.85) 100%)'}} />
      <Highlight text={TITLE} x={130} y={330} size={100} at={4} seed={71} rot={-2} />
      {g >= 14 && <div style={{position: 'absolute', left: 190, top: 540, fontFamily: JF.display, fontSize: 70, color: pal.mark, textShadow: '0 3px 16px rgba(0,0,0,0.8)', opacity: interpolate(g, [14, 20], [0, 1], clamp)}}>{SUBTITLE}</div>}
      <Note text={DATES} x={1180} y={760} size={56} rot={-5} at={24} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Aerial t={t} />],
    [at('The Western') - 1, <Places t={t} />],
    [at('Judaism') - 1, <Abrahamic t={t} />],
    [at('So heres') - 1, <Hearths t={t} />],
    [at('One is scattered') - 1, <Followers t={t} />],
    [at('Same') - 1, <ThreeMaps t={t} />],
  ];
  let scene = useScene(cuts);
  if (frame >= END + INTRO_FRAMES) scene = <Sequence from={END + INTRO_FRAMES} layout="none"><Title /></Sequence>;
  else if (frame >= END) scene = <Sequence from={END} layout="none"><ChannelIntro /></Sequence>;
  const stamps = [at('Old City'), at('Western'), at('Church'), at('Dome'), at('Abrahamic'), at('monotheistic'), at('One is scattered'), at('One is centered'), at('And one')];
  const notes = [at('smaller'), at('walk') + 7, at('15'), at('packed'), at('Western'), at('sacred'), at('many Christians'), at('sacred', 2), at('Judaism'), at('Christianity'), at('Islam'),
    at('half'), at('half') + 13, at('puzzle'), at('within'), at('look'), at('scattered'), at('Africa'), at('largest'), at('nearly'), at('Same'), at('Three totally'), at('Why')];
  const ticks = [at('three religions'), at('three religions') + 4, at('country')];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {frame < END && <Finish vignette={0.3} />}
      <Audio src={staticFile('audio/ch01_cold_open.wav')} />
      <Audio src={staticFile('music/r_cold_open.mp3')} volume={(f) => interpolate(f, [0, 15, END - 40, END], [0, 0.15, 0.15, 0], clamp)} />
      {cuts.slice(1).map(([f], i) => <Sfx key={'w' + i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {stamps.map((f, i) => <Sfx key={'s' + i} at={f} src="sfx/stamp.wav" volume={0.27} />)}
      {notes.map((f, i) => <Sfx key={'n' + i} at={f - 3} src={WRITE.src} volume={WRITE.volume} />)}
      {ticks.map((f, i) => <Sfx key={'t' + i} at={f} src="sfx/tick.wav" volume={0.4} />)}
      <Sfx at={END + INTRO_FRAMES + 4} src="sfx/stamp.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Ch01: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
