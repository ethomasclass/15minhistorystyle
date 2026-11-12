// Chapter 5 · A kitchen open to everyone (Sikhism): Punjab c. 1500 and Guru Nanak (text only, no face), core beliefs,
// the Guru Granth Sahib, the Golden Temple, gurdwara + langar, the Five Ks and the shared names, universalizing but
// spread by relocation diffusion, the Canada stat, Brampton and Surrey, and the takeaway.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import words from '../../public/audio/ch05_sikhism.words.json';
import credits from '../../public/img/credits.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, CropCard, Definition, hasFile, LEAD, makeTimeline, type Narration, Photo, Stamp, type TL, useScene} from '../kit/shell';
import {Bars} from '../kit/charts';
import {PAL} from '../kit/look';
import {C, Dot, type Fill, MapLabel, P, WorldMap} from '../kit/asia';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH05_FRAMES = chapterFrames(N, LEAD);

/** Modern photos stay in colour, muted so the teal and coral marks read on top. */
const MUTED = 'saturate(0.55) contrast(1.08) brightness(0.82)';
const GEN: [number, number] = [1376, 768];

/** Places used only here, [lon, lat]. */
const PL = {
  brampton: [-79.76, 43.68] as [number, number],
  surrey: [-122.85, 49.19] as [number, number],
  calgary: [-114.07, 51.05] as [number, number],
  london: [-0.12, 51.5] as [number, number],
  california: [-121.3, 37.9] as [number, number],
  lahore: [74.35, 31.55] as [number, number],
};

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

// ---------- scenes ----------

/** Punjab on the map, split by today's India-Pakistan border; Amritsar; c. 1500; Guru Nanak in type only. */
const Punjab: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Punjab');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: 0, lon: 80, lat: 25, z: 3.4}, {f: a - 6, lon: 79, lat: 26.5, z: 4}, {f: t.at('Pakistan') + 6, lon: 74.4, lat: 31.2, z: 8.5}]}
        fills={[{id: C.india, at: t.at('India'), color: PAL.cream, opacity: 0.14}, {id: C.pakistan, at: t.at('Pakistan'), color: PAL.orange, opacity: 0.16}]}>
        {(S) => {
          const [ax, ay] = S(P.amritsar);
          const [lx, ly] = S([74.2, 31.0]);
          const [ix, iy] = S([77.6, 28.4]);
          const [kx, ky] = S([69.6, 28.2]);
          return (
            <>
              <MapLabel text="India" x={ix} y={iy} at={t.at('India')} size={30} />
              <MapLabel text="Pakistan" x={kx} y={ky} at={t.at('Pakistan')} align="right" size={30} color={PAL.orange} />
              {/* the Punjab region straddles the border: one loop across both sides */}
              <Loop cx={lx} cy={ly} rx={250} ry={170} at={t.at('Pakistan') + 8} seed={5} tilt={-12} />
              <Dot x={ax} y={ay} at={t.at('teacher')} color={pal.subject} r={12} />
              <MapLabel text="Amritsar" x={ax + 40} y={ay - 34} at={t.at('teacher')} color={pal.subject} size={30} />
            </>
          );
        }}
      </WorldMap>
      <Highlight text="THE PUNJAB" x={100} y={80} size={84} at={a} seed={71} rot={-2} />
      <Note text="now split between India and Pakistan" x={120} y={220} size={46} rot={-2} at={t.at('split') - 3} color="#ffffff" />
      <Note text="c. 1500" x={1480} y={110} size={84} rot={-4} at={t.at('fifteen') - 3} />
      <Highlight text="GURU NANAK" x={100} y={800} size={90} at={t.at('Guru')} seed={72} rot={-2} />
      <Note text="founded Sikhism" x={760} y={830} size={58} rot={-3} at={t.at('founded') - 3} color={pal.subject} />
      <Tag text="Map: Natural Earth · today's borders" />
    </AbsoluteFill>
  );
};

/** The early-langar painting on a card, the core beliefs listed beside it. */
const Beliefs: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Nine');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src="img/gen/v1_ch4_early_langar.jpg" size={GEN} x={130} y={150} w={740} h={800} fx={450} fy={400} scale={1.1} rot={-1.5} at={a - 1}
        mask={MASKS.langar_volunteer} traceAt={a + 6} />
      <Note text="10 Gurus in all, Nanak first" x={1000} y={130} size={50} rot={-3} at={a - 3} color="#ffffff" />
      <Highlight text="SIKHS BELIEVE IN" x={990} y={260} size={66} at={t.at('believe')} seed={73} rot={-2} />
      <Note text="1. one God" x={1020} y={420} size={60} rot={-3} at={t.at('one God') - 3} />
      <Note text="2. equality of all people" x={1020} y={530} size={60} rot={-3} at={t.at('equality') - 3} />
      <Note text="3. honest work" x={1020} y={640} size={60} rot={-3} at={t.at('honest') - 3} />
      <Note text="4. serving others" x={1020} y={750} size={60} rot={-3} at={t.at('serving') - 3} color={pal.subject} />
      <Tag text="Illustration · an early langar, a volunteer serving food to all (AI-generated)" />
    </AbsoluteFill>
  );
};

/** The holy book as a drawn line graphic: an open book on a stand under a canopy. */
const DrawnBook: React.FC<{cx: number; cy: number; at: number}> = ({cx, cy, at}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = (d: number, dur = 12) => interpolate(g, [at + d, at + d + dur], [0, 1], clamp);
  const line = (d: string, k: number, color = pal.mark, w = 6) => (
    <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
  );
  const L = (x: number, y: number) => `${cx + x},${cy + y}`;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      {/* canopy */}
      {line(`M${L(-300, -250)} Q${L(0, -330)} ${L(300, -250)} L${L(300, -215)} Q${L(150, -180)} ${L(0, -215)} Q${L(-150, -180)} ${L(-300, -215)} Z`, p(0), PAL.orange)}
      {line(`M${L(-280, -215)} L${L(-280, 240)} M${L(280, -215)} L${L(280, 240)}`, p(4), PAL.orange, 4)}
      {/* open pages */}
      {line(`M${L(0, -60)} Q${L(-110, -110)} ${L(-230, -70)} L${L(-230, 90)} Q${L(-110, 50)} ${L(0, 100)} Z`, p(6))}
      {line(`M${L(0, -60)} Q${L(110, -110)} ${L(230, -70)} L${L(230, 90)} Q${L(110, 50)} ${L(0, 100)} Z`, p(8))}
      {/* text lines */}
      {[-40, -10, 20, 50].map((y, i) => (
        <g key={y}>
          {line(`M${L(-200, y - 10)} Q${L(-110, y - 40)} ${L(-30, y - 12)}`, p(14 + i * 2, 6), 'rgba(244,239,230,0.6)', 3)}
          {line(`M${L(30, y - 12)} Q${L(110, y - 40)} ${L(200, y - 10)}`, p(15 + i * 2, 6), 'rgba(244,239,230,0.6)', 3)}
        </g>
      ))}
      {/* cloth-draped stand */}
      {line(`M${L(-260, 110)} L${L(260, 110)} L${L(220, 200)} L${L(-220, 200)} Z`, p(10), pal.subject)}
    </svg>
  );
};

const Granth: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Their holy');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="their holy book:" x={110} y={110} size={56} rot={-3} at={a - 3} color="#ffffff" />
      <Highlight text="GURU GRANTH SAHIB" x={100} y={220} size={84} at={t.at('Granth')} seed={74} rot={-2} />
      <DrawnBook cx={1380} cy={620} at={a + 2} />
      <Note text="treated with the respect" x={120} y={520} size={56} rot={-3} at={t.at('respect') - 3} />
      <Note text="of a living teacher" x={140} y={610} size={66} rot={-3} at={t.at('living') - 3} color={pal.subject} />
      <Note text={'("guru" = teacher)'} x={150} y={730} size={44} rot={-2} at={t.at('living teacher') + 6} color="#ffffff" />
      <Tag text="Drawing: the Guru Granth Sahib under its canopy" />
    </AbsoluteFill>
  );
};

/** The Golden Temple at night. */
const Golden: React.FC<{t: TL}> = ({t}) => (
  <Photo src="img/ch04/golden_temple_night.jpg" size={[1920, 1280]} fx={900} fy={640} z0={1.04} z1={1.14} a={t.at('And theres')} b={t.at('Every Sikh')} bw={MUTED} vignette={0.7}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 35%)'}} />
        <Note text="what equality means..." x={1240} y={80} size={52} rot={-3} at={t.at('that equality') - 3} color="#ffffff" />
        <Highlight text="THE GOLDEN TEMPLE" x={100} y={830} size={92} at={t.at('Golden')} seed={75} rot={-2} />
        <Note text="Amritsar, India" x={1220} y={860} size={56} rot={-3} at={t.at('Amritsar') - 3} />
        <Note text="Sikhism's holiest site" x={1220} y={950} size={50} rot={-2} at={t.at('holiest') - 3} color="#ffffff" />
        <Tag text="Golden Temple (Harmandir Sahib) at night · shankar s., CC BY 2.0, via Wikimedia Commons" x={44} y={1036} />
      </>
    )}
  </Photo>
);

/** Gurdwara and langar: the two definitions over the langar hall. */
const Langar: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Photo src="img/ch04/langar_hall.jpg" size={[1920, 1440]} fx={960} fy={760} z0={1.02} z1={1.1} a={t.at('Every Sikh')} b={t.at('Everyone sits')} bw={MUTED} vignette={0.7}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 60%, rgba(0,0,0,0) 88%, rgba(0,0,0,0.7) 100%)'}} />
          <Highlight text="GURDWARA" x={100} y={70} size={80} at={t.at('gurdwara')} seed={76} rot={-2} />
          <Definition term="gurdwara" def="a Sikh house of worship" at={t.at('gurdwara') + 9} x={110} y={200} w={900} />
          <Highlight text="LANGAR" x={100} y={300} size={80} at={t.at('langar')} seed={77} rot={-2} />
          <Definition term="langar" def="a free community kitchen, open to all" at={t.at('langar') + 9} x={110} y={430} w={1000} />
          <Note text="anyone can walk in and eat:" x={1150} y={90} size={50} rot={-3} at={t.at('Anyone') - 3} color="#ffffff" />
          <Note text="any religion" x={1190} y={170} size={54} rot={-3} at={t.at('of religion') - 3} />
          <Note text="any caste" x={1190} y={250} size={54} rot={-3} at={t.at('caste') - 3} />
          <Note text="any income" x={1190} y={330} size={54} rot={-3} at={t.at('money') - 3} color={pal.subject} />
          <Tag text="Langar, participatory community kitchen, Golden Temple · Harvinder Chandigarh, CC BY 4.0, via Wikimedia Commons" />
        </>
      )}
    </Photo>
  );
};

/** Rows of people on the floor: same level. */
const Floor: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Photo src="img/ch04/langar_row.jpg" size={[1920, 729]} fx={820} fy={400} z0={1.0} z1={1.08} a={t.at('Everyone sits')} b={t.at('At the Golden')} bw={MUTED} vignette={0.6}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'radial-gradient(ellipse at 52% 85%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 45%)'}} />
          <Note text="everyone on the floor" x={640} y={700} size={64} rot={-3} at={t.at('floor') - 3} color="#ffffff" />
          <Note text="side by side" x={700} y={800} size={64} rot={-3} at={t.at('side by') - 3} />
          <Note text="same level" x={760} y={900} size={64} rot={-3} at={t.at('same') - 3} color={pal.subject} />
          <Tag text="Langar hall, Darbar Sahib · Ravneetn13, CC BY-SA 4.0, via Wikimedia Commons" />
        </>
      )}
    </Photo>
  );
};

/** The scale of the Golden Temple's langar. */
const Meals: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('At the Golden');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src="img/ch04/langar_crowd.jpg" size={[1920, 1440]} x={130} y={150} w={800} h={720} fx={960} fy={760} scale={0.62} rot={-2} at={a - 1} bw={MUTED} />
      <Note text="Golden Temple volunteers serve" x={1010} y={150} size={48} rot={-3} at={t.at('volunteers') - 3} color="#ffffff" />
      <Note text="tens of thousands of free meals a day" x={1010} y={240} size={44} rot={-3} at={t.at('tens') - 3} />
      <Stamp text="100,000+" x={1030} y={430} size={170} at={t.at('100000')} color={pal.subject} rot={-3} />
      <Note text="on big holidays" x={1080} y={640} size={66} rot={-3} at={t.at('big holidays') - 3} />
      <Tag text="Volunteers at the Golden Temple langar · Ken Wieland, CC BY-SA 2.0, via Wikimedia Commons" />
    </AbsoluteFill>
  );
};

/** A plan of the temple with a door on every side and arrows coming in from all four directions. */
const FourDoors: React.FC<{x: number; y: number; s: number; at: number}> = ({x, y, s, at}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 10], [0, 1], clamp);
  const h = s / 2, d = s * 0.14;
  // square with a gap (door) in the middle of each side
  const sq = [
    `M${x - h},${y - h} L${x - d},${y - h} M${x + d},${y - h} L${x + h},${y - h}`,
    `M${x + h},${y - h} L${x + h},${y - d} M${x + h},${y + d} L${x + h},${y + h}`,
    `M${x + h},${y + h} L${x + d},${y + h} M${x - d},${y + h} L${x - h},${y + h}`,
    `M${x - h},${y + h} L${x - h},${y + d} M${x - h},${y - d} L${x - h},${y - h}`,
  ];
  const far = s * 0.95;
  return (
    <>
      <div style={{position: 'absolute', left: x - s * 1.12, top: y - s * 1.12, width: s * 2.24, height: s * 2.24, background: 'rgba(14,12,9,0.78)', borderRadius: 8, opacity: k}} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        {sq.map((p, i) => <path key={i} d={p} fill="none" stroke={PAL.orange} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />)}
        <rect x={x - s * 0.18} y={y - s * 0.18} width={s * 0.36} height={s * 0.36} fill={pal.subject} opacity={k} />
      </svg>
      <Arrow x1={x} y1={y - far} x2={x} y2={y - h - 10} bow={0} at={at + 8} width={6} />
      <Arrow x1={x + far} y1={y} x2={x + h + 10} y2={y} bow={0} at={at + 11} width={6} />
      <Arrow x1={x} y1={y + far} x2={x} y2={y + h + 10} bow={0} at={at + 14} width={6} />
      <Arrow x1={x - far} y1={y} x2={x - h - 10} y2={y} bow={0} at={at + 17} width={6} />
    </>
  );
};

const Doors: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const day = hasFile('img/ch04/golden_temple_day.jpg');
  const a = t.at('The temple even');
  return (
    <Photo src={day ? 'img/ch04/golden_temple_day.jpg' : 'img/ch04/golden_temple_pool.jpg'} size={day ? [1920, 1280] : [1920, 1261]} fx={day ? 960 : 700} fy={day ? 640 : 520}
      z0={1.02} z1={1.1} a={a} b={t.at('Sikh identity')} bw={MUTED} vignette={0.65}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(270deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 45%)'}} />
          <FourDoors x={1500} y={520} s={300} at={t.at('doors')} />
          <Note text="doors on all four sides" x={1180} y={130} size={58} rot={-3} at={t.at('doors') - 3} color="#ffffff" />
          <Note text="welcome from every direction" x={560} y={900} size={56} rot={-3} at={t.at('welcome') - 3} color={pal.subject} />
          <Tag text={day ? credit('ch04/golden_temple_day.jpg', 'The Golden Temple, Amritsar · via Wikimedia Commons') : 'Harmandir Sahib, Amritsar · Dey.sandip, CC BY-SA 4.0, via Wikimedia Commons'} x={44} y={1040} />
        </>
      )}
    </Photo>
  );
};

/** The Five Ks: three of them on a cloth (comb, kara, kirpan), plus uncut hair. */
const FiveKs: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Five Ks');
  return (
    <Photo src="img/ch04/five_ks.jpg" size={[1920, 1440]} fx={960} fy={700} z0={1.0} z1={1.06} a={t.at('Sikh identity')} b={t.at('which many')} bw={MUTED} vignette={0.6}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 32%)'}} />
          <Note text="Sikh identity is visible" x={100} y={70} size={56} rot={-3} at={t.at('Sikh identity') - 3} color="#ffffff" />
          <Highlight text="THE FIVE Ks" x={100} y={800} size={90} at={a} seed={78} rot={-2} />
          <Definition term="Five Ks" def="articles of faith many Sikhs keep" at={a + 9} x={110} y={940} w={1000} />
          <Note text="kangha (comb)" x={260} y={250} size={50} rot={-3} at={a + 8} />
          <Note text="kara" x={1560} y={150} size={56} rot={-3} at={a + 12} />
          <Note text="kirpan" x={1560} y={560} size={56} rot={-3} at={a + 16} />
          <Note text="+ kesh: uncut hair" x={1200} y={820} size={58} rot={-3} at={t.at('uncut') - 3} color={pal.subject} />
          <Tag text="Kakaars: kanga, kara, kirpan · Hari Singh, CC BY-SA 3.0, via Wikimedia Commons" x={44} y={1036} />
        </>
      )}
    </Photo>
  );
};

/** Turban (photo cutout) and the kara on a wrist. */
const Turban: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('which many');
  return (
    <Photo src="img/ch04/sikh_man_turban.jpg" size={[1920, 1440]} fx={960} fy={620} z0={1.0} z1={1.06} a={a} b={t.at('Many Sikh men share')} bw={MUTED} vignette={0.6}
      mask={MASKS.sikh_man} traceAt={a + 4}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 30%)'}} />
          <Note text="uncut hair," x={70} y={160} size={56} rot={-3} at={a - 3} color="#ffffff" />
          <Note text="covered by" x={70} y={240} size={56} rot={-3} at={t.at('cover') - 3} color="#ffffff" />
          <Note text="a turban" x={70} y={320} size={70} rot={-3} at={t.at('turban') - 3} />
          <CropCard src="img/ch04/kara_wrist.jpg" size={[1920, 1440]} x={1480} y={560} w={380} h={300} fx={1020} fy={760} scale={0.3} rot={3} at={t.at('steel') - 2} bw={MUTED} />
          <Note text="kara: steel bracelet" x={1400} y={470} size={46} rot={-3} at={t.at('steel') - 3} />
          <Tag text="Sikh wearing turban · Harkanwal Singh, CC BY-SA 2.5 · Kara · Hari Singh, CC BY-SA 3.0 · via Wikimedia Commons" />
        </>
      )}
    </Photo>
  );
};

/** Two shared surnames as cards; the point about caste underneath. */
const NameCard: React.FC<{name: string; meaning: string; x: number; at: number; at2: number; rot: number}> = ({name, meaning, x, at, at2, rot}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 5], [0, 1], {...clamp, easing: (q) => 1 - Math.pow(1 - q, 3)});
  return (
    <div style={{position: 'absolute', left: x, top: 230, width: 620, height: 400, transform: `scale(${0.7 + 0.3 * k}) rotate(${rot}deg)`, opacity: k,
      background: 'rgba(14,12,9,0.85)', border: `5px solid ${pal.mark}`, borderRadius: 10, boxShadow: '0 18px 34px rgba(0,0,0,0.6)'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 50, textAlign: 'center', fontFamily: JF.display, fontSize: 150, color: '#f4efe6', lineHeight: 1}}>{name}</div>
      {g >= at2 && <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', fontFamily: '"Nanum Pen Script", cursive', fontSize: 100, color: pal.subject, lineHeight: 1,
        opacity: interpolate(g, [at2, at2 + 4], [0, 1], clamp)}}>{meaning}</div>}
    </div>
  );
};

const Names: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="many share a surname" x={110} y={80} size={60} rot={-3} at={t.at('Many Sikh men share') - 2} color="#ffffff" />
      <NameCard name="Singh" meaning={'= "lion"'} x={180} at={t.at('surname') - 1} at2={t.at('lion') - 2} rot={-2} />
      <NameCard name="Kaur" meaning={'= "princess"'} x={1080} at={t.at('Kaur') - 1} at2={t.at('princess') - 2} rot={2} />
      <MapLabel text="many Sikh men" x={490} y={680} at={t.at('Singh')} align="center" size={30} />
      <MapLabel text="many Sikh women" x={1390} y={680} at={t.at('Kaur')} align="center" size={30} />
      <Note text="one name for everyone:" x={300} y={790} size={60} rot={-3} at={t.at('wipe') - 3} />
      <Note text="no clue to caste or family status" x={300} y={880} size={66} rot={-3} at={t.at('differences') - 3} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** An open circle of dots with a gap and someone walking in. */
const OpenCircle: React.FC<{cx: number; cy: number; r: number; at: number}> = ({cx, cy, r, at}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const n = 14;
  const dots = Array.from({length: n}, (_, i) => {
    const ang = -Math.PI / 2 + Math.PI / n + (i / n) * Math.PI * 2 * 0.86 + 0.45;
    return [cx + Math.cos(ang) * r, cy + Math.sin(ang) * r];
  });
  const walk = interpolate(g, [at + 14, at + 34], [0, 1], clamp);
  const sx = cx - r * 1.8, sy = cy - r * 0.35;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      {dots.map(([x, y], i) => {
        const s = interpolate(g, [at + i, at + i + 4], [0, 1], clamp);
        return <circle key={i} cx={x} cy={y} r={20 * s} fill={PAL.cream} opacity={0.75} stroke="#111" strokeWidth={3} />;
      })}
      {g >= at + 14 && <circle cx={sx + (cx - sx) * walk} cy={sy + (cy - sy) * walk} r={22} fill={pal.subject} stroke="#111" strokeWidth={3} />}
    </svg>
  );
};

const Universal: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const u = t.at('universalizing');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="Sikhism is classified as a..." x={110} y={80} size={52} rot={-3} at={t.at('classified') - 3} color="#ffffff" />
      <Highlight text="UNIVERSALIZING RELIGION" x={100} y={170} size={84} at={u} seed={79} rot={-2} />
      <Definition term="universalizing religion" def="a religion open to anyone, anywhere" at={u + 9} x={110} y={320} w={1100} />
      <OpenCircle cx={1450} cy={700} r={170} at={t.at('anyone can become') - 4} />
      <Note text="anyone can become a Sikh" x={130} y={480} size={64} rot={-3} at={t.at('anyone can become') - 3} />
      <Note text="...but Sikhs don't focus" x={130} y={640} size={60} rot={-3} at={t.at('But Sikhs') - 3} color={pal.subject} />
      <Note text="on converting people" x={160} y={730} size={60} rot={-3} at={t.at('converting') - 3} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** Relocation diffusion: arrows from the Punjab to the UK, Canada and the US. */
const DEST: {word: string; label: string; ll: [number, number]; dx: number; dy: number; align?: 'left' | 'right'; bow: number}[] = [
  {word: 'families', label: 'UK', ll: PL.london, dx: 26, dy: -40, bow: 60},
  {word: 'migrated', label: 'Canada', ll: PL.brampton, dx: 30, dy: -44, bow: 120},
  {word: 'around the world', label: 'USA', ll: PL.california, dx: -20, dy: 46, align: 'right', bow: 150},
];
const RELOC_CAM = {lon: -28, lat: 38, z: 1.45};

const Relocation: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Instead');
  const r = t.at('relocation');
  const fills: Fill[] = [
    {id: C.uk, at: t.at('families'), color: PAL.teal, opacity: 0.45},
    {id: C.canada, at: t.at('migrated'), color: PAL.teal, opacity: 0.45},
    {id: C.usa, at: t.at('around'), color: PAL.teal, opacity: 0.3},
    {id: C.india, at: a, color: PAL.cream, opacity: 0.12},
  ];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 70, lat: 32, z: 3.2}, {f: r + 10, ...RELOC_CAM}]} fills={fills}>
        {(S) => {
          const [px, py] = S(P.amritsar);
          return (
            <>
              <Dot x={px} y={py} at={a + 2} color={PAL.coral} r={12} />
              <MapLabel text="Punjab" x={px - 30} y={py + 46} at={a + 2} color={PAL.coral} align="right" size={28} />
              {DEST.map((d) => {
                const [x, y] = S(d.ll);
                return (
                  <React.Fragment key={d.label}>
                    <Arrow x1={px - 16} y1={py - 10} x2={x + 10} y2={y} bow={d.bow} at={t.at(d.word)} dur={10} width={5} />
                    <MapLabel text={d.label} x={x + d.dx} y={y + d.dy} at={t.at(d.word) + 8} align={d.align} size={30} color={PAL.teal} />
                  </React.Fragment>
                );
              })}
            </>
          );
        }}
      </WorldMap>
      <Note text="it spread the way Hinduism did:" x={110} y={680} size={52} rot={-3} at={t.at('spread mostly') - 3} color="#ffffff" />
      <Highlight text="RELOCATION DIFFUSION" x={100} y={760} size={78} at={r} seed={80} rot={-2} />
      <Definition term="relocation diffusion" def="beliefs spread as people move and carry them along" at={r + 9} x={110} y={900} w={1300} />
      <Note text="as Sikh families migrated" x={110} y={80} size={60} rot={-3} at={t.at('families') - 3} />
      <Tag text="Map: Natural Earth" x={1560} />
    </AbsoluteFill>
  );
};

/** The wild stat: Sikhs as a share of the population, Canada vs India. */
const Stat: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Sikhs make');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="here's a wild stat..." x={110} y={80} size={58} rot={-3} at={t.at('wild') - 3} color="#ffffff" />
      <Note text="Sikhs as a share of each country's population" x={110} y={170} size={50} rot={-2} at={a - 3} />
      <Bars x={620} y={330} w={760} h={520} max={2.4} at={t.at('Sikhs make')} per={10}
        bars={[{label: 'INDIA', value: 1.7, show: '1.7%'}, {label: 'CANADA', value: 2.1, subject: true, show: '2.1%'}]} />
      <Note text="a bigger share" x={1420} y={520} size={60} rot={-5} at={t.at('Indias') + 2} color={pal.subject} />
      <Note text="in Canada!" x={1440} y={610} size={60} rot={-5} at={t.at('Indias') + 8} color={pal.subject} />
      <Tag text="Census of India, 2011 · Statistics Canada, 2021 Census" />
    </AbsoluteFill>
  );
};

/** Canada: Brampton and Surrey, with an early gurdwara and a modern one on cards. */
const Canada: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('In cities');
  const g = t.at('gurdwaras');
  const arch = hasFile('img/ch04/gurdwara_archival.jpg');
  const modern = hasFile('img/ch04/gurdwara_canada.jpg');
  const tags = [
    'Map: Natural Earth',
    arch ? 'Second Avenue Gurdwara, Vancouver, c. 1910 · public domain' : 'Sikh men, California, 1910 · Unknown photographer, public domain, via Wikimedia Commons',
    ...(modern ? ['Gurdwara Sikh Society Calgary · Harpreet Sandhu, CC BY-SA 4.0'] : []),
  ];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: -98, lat: 55, z: 2.6}, {f: t.at('Surrey') + 10, lon: -92, lat: 52, z: 3.0}]}
        fills={[{id: C.canada, at: a, color: PAL.teal, opacity: 0.18}]}>
        {(S) => {
          const [bx, by] = S(PL.brampton);
          const [sx, sy] = S(PL.surrey);
          return (
            <>
              <Dot x={bx} y={by} at={t.at('Brampton')} color={pal.subject} />
              <MapLabel text="Brampton, Ontario" x={bx - 30} y={by + 50} at={t.at('Brampton')} align="right" color={pal.subject} size={28} />
              <Dot x={sx} y={sy} at={t.at('Surrey')} color={pal.subject} />
              <MapLabel text="Surrey, B.C." x={sx + 30} y={sy + 50} at={t.at('Surrey')} color={pal.subject} size={28} />
            </>
          );
        }}
      </WorldMap>
      <Highlight text="CANADA" x={100} y={80} size={84} at={a} seed={81} rot={-2} />
      {arch
        ? <CropCard src="img/ch04/gurdwara_archival.jpg" size={[1920, 1440]} x={1250} y={110} w={560} h={360} fx={960} fy={720} scale={0.3} rot={2} at={g - 1} />
        : <CropCard src="img/ch04/sikh_men_archival.jpg" size={[1920, 1533]} x={1250} y={110} w={560} h={360} fx={960} fy={780} scale={0.31} rot={2} at={g - 1} />}
      <Note text={arch ? 'Vancouver gurdwara, c. 1910' : 'Sikh migrants, California, 1910'} x={1250} y={500} size={42} rot={-2} at={g + 2} color="#ffffff" />
      {modern && <CropCard src="img/ch04/gurdwara_canada.jpg" size={[1920, 1280]} x={1330} y={640} w={480} h={290} fx={960} fy={640} scale={0.26} rot={-2} at={t.at('just like') - 1} bw={MUTED} />}
      <Note text="gurdwaras serving langar," x={110} y={830} size={58} rot={-3} at={g - 3} />
      <Note text="just like in Amritsar" x={140} y={920} size={58} rot={-3} at={t.at('just like') - 3} color={pal.subject} />
      <Tag text={tags.slice(1).join(' · ') + ' · via Wikimedia Commons'} x={44} y={1036} />
      <Tag text={tags[0]} x={1640} y={1000} />
    </AbsoluteFill>
  );
};

/** Takeaway: universalizing, and still spread because people moved. */
const Takeaway: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('So Sikhism');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{opacity: 0.6}}>
        <WorldMap keys={[{f: a, ...RELOC_CAM}]} fills={[{id: C.uk, at: -999, color: PAL.teal, opacity: 0.35}, {id: C.canada, at: -999, color: PAL.teal, opacity: 0.35}, {id: C.usa, at: -999, color: PAL.teal, opacity: 0.25}]}>
          {(S) => {
            const [px, py] = S(P.amritsar);
            return (
              <>
                <Dot x={px} y={py} at={-999} color={PAL.coral} r={12} ring={false} />
                {DEST.map((d) => {
                  const [x, y] = S(d.ll);
                  return <Arrow key={d.label} x1={px - 16} y1={py - 10} x2={x + 10} y2={y} bow={d.bow} at={-999} width={5} />;
                })}
              </>
            );
          }}
        </WorldMap>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 40%, rgba(8,6,4,0.75) 20%, rgba(8,6,4,0.2) 80%)'}} />
      <Note text="so Sikhism shows something important:" x={110} y={110} size={56} rot={-3} at={t.at('shows') - 3} color="#ffffff" />
      <Note text="a religion can be" x={130} y={250} size={60} rot={-3} at={t.at('a religion can') - 3} />
      <Highlight text="UNIVERSALIZING" x={110} y={350} size={100} at={t.at('universalizing', 2)} seed={82} rot={-2} />
      <Note text="and still spread mainly" x={130} y={560} size={60} rot={-3} at={t.at('still') - 3} />
      <Note text="because people move" x={150} y={660} size={80} rot={-3} at={t.at('because people') - 3} color={pal.subject} />
      <Tag text="Map: Natural Earth" />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Punjab t={t} />],
    [at('Nine') - 1, <Beliefs t={t} />],
    [at('Their holy') - 1, <Granth t={t} />],
    [at('And theres') - 1, <Golden t={t} />],
    [at('Every Sikh') - 1, <Langar t={t} />],
    [at('Everyone sits') - 1, <Floor t={t} />],
    [at('At the Golden') - 1, <Meals t={t} />],
    [at('The temple even') - 1, <Doors t={t} />],
    [at('Sikh identity') - 1, <FiveKs t={t} />],
    [at('which many') - 1, <Turban t={t} />],
    [at('Many Sikh men share') - 1, <Names t={t} />],
    [at('Sikhism is classified') - 1, <Universal t={t} />],
    [at('Instead') - 1, <Relocation t={t} />],
    [at('And heres') - 1, <Stat t={t} />],
    [at('In cities') - 1, <Canada t={t} />],
    [at('So Sikhism') - 1, <Takeaway t={t} />],
  ];
  const scene = useScene(cuts);
  // the second 'universalizing' (takeaway) is offset from the first, so use explicit frames
  const stamps = [at('Punjab'), at('Guru'), at('believe'), at('Granth'), at('Golden'), at('gurdwara'), at('langar'), at('100000'), at('Five Ks'),
    at('universalizing'), at('relocation'), at('In cities'), at('universalizing', 2)];
  const notes = ['split', 'fifteen', 'founded', 'Nine', 'one God', 'equality', 'honest', 'serving', 'Their holy', 'respect', 'living', 'Amritsar', 'holiest',
    'Anyone', 'of religion', 'that equality', 'caste', 'money', 'floor', 'side by', 'same', 'volunteers', 'tens', 'big holidays', 'doors', 'welcome', 'Sikh identity', 'uncut',
    'which many', 'cover', 'turban', 'steel', 'surname', 'wipe', 'differences', 'classified', 'anyone can become', 'But Sikhs', 'converting', 'spread mostly', 'families',
    'wild', 'Sikhs make', 'gurdwaras', 'just like', 'shows', 'a religion can', 'still', 'because people'];
  const ticks = [at('teacher'), at('India'), at('Pakistan'), ...DEST.map((d) => at(d.word)), at('Brampton'), at('Surrey'), at('Singh'), at('Kaur'), at('steel')];
  return (
    <AbsoluteFill>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={'w' + i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {stamps.map((f, i) => <Sfx key={'s' + i} at={f} src="sfx/stamp.wav" volume={0.27} />)}
      {notes.map((c) => <Sfx key={'n' + c} at={at(c) - 3} src={WRITE.src} volume={WRITE.volume} />)}
      {ticks.map((f, i) => <Sfx key={'t' + i} at={f} src="sfx/tick.wav" volume={0.4} />)}
    </AbsoluteFill>
  );
};

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_sikhism.wav" lead={LEAD} music={[{src: 'music/r_utopia.mp3', volume: 0.15}]}>
    <Body />
  </ChapterShell>
);

