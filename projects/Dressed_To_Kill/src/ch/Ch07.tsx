// Chapter 7 · Arsenic-Free: how it ended in Britain (shoppers, not a law; the Swatch drains to grey on "arsenic-free"),
// the bans elsewhere, Massachusetts 28 years after Draper, then the green moves to the potato fields.
import React from 'react';
import {interpolate} from 'remotion';
import words from '../../public/audio/ch07_arsenic_free.words.json';
import {clamp} from '../lib/anim';
import {Arrow, boxOf, Highlight, JF, Loop, Note, Tag, useGFrame, useHand, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, CropCard, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {Desk, Sounds} from '../kit/bs';
import {Doc, Sil, SWATCH_LABELS, Swatch, sizeOf} from '../kit/dk';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH07_FRAMES = chapterFrames(N, LEAD);

const WOOLLAMS = 'img/ch07/advert_wallpaper_free_from_arsenic_c1890_crop.jpg';
const JEFFREY = 'img/ch07/jeffrey_co_ad_patent_hygienic_free_from_arsenic_1884.jpg';
const MASS = 'img/ch07/massachusetts_acts_1900_ch325_arsenic_p259.jpg';
const RILEY = 'img/ch07/riley_potato_pests_1876_cover.jpg';
const GRAY = 'img/ch07/riley_1876_grays_sprinkler_paris_green_crop.jpg';
const DRAPER = 'img/ch06/draper_portrait_burrage_1923.jpg';

/** The swatch arrives full (filled in ch02); every square is already there. */
const FULL = SWATCH_LABELS.map((label) => ({label, at: -99}));

/** "So how did it end? In Britain, not with a law." */
const HowEnd: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={0}>
      <Swatch items={FULL} />
      <Note text="so how did it end?" x={160} y={200} size={64} rot={-3} at={t.at('how did it end') - 2} color="#ffffff" />
      <Highlight text="IN BRITAIN" x={160} y={390} size={120} at={t.at('In Britain')} seed={701} rot={-2} />
      <Note text="not with a law." x={200} y={620} size={80} rot={-3} at={t.at('not with a law') - 2} color={pal.subject} />
    </Desk>
  );
};

/** Doctors, newspapers, scared shoppers; by the 1880s "free from arsenic" was in the ads. The Swatch drains. */
const Scared: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const free = t.at('arsenic-free');
  return (
    <Desk a={t.at('Doctors')}>
      <Note text="doctors kept writing" x={110} y={150} size={44} rot={-3} at={t.at('Doctors') - 2} color="#ffffff" />
      <Note text="newspapers kept printing" x={110} y={255} size={44} rot={-3} at={t.at('newspapers') - 2} color="#ffffff" />
      <Note text="shoppers got scared" x={130} y={370} size={54} rot={-3} at={t.at('shoppers got scared') - 2} color={pal.subject} />
      <Highlight text="BY THE 1880s" x={110} y={580} size={88} at={t.at('By the 1880s')} seed={703} rot={-2} />
      <Doc src={WOOLLAMS} x={800} y={110} w={440} rot={-2} at={t.at('By the 1880s') + 3} push={[t.at('By the 1880s'), t.at('Other countries')]} zoom={1.08} fy={2660}
        marks={[{at: free, to: free + 20, swipe: [[529, 2521, 3396, 2806]]}]} />
      <Doc src={JEFFREY} x={1330} y={370} w={370} rot={3} at={t.at('something you put') - 1}
        marks={[{at: t.at('put in the ad'), to: t.at('ad') + 10, swipe: [[322, 410, 1021, 482]]}]} />
      <Swatch items={FULL} drainAt={free} />
      <Tag text="Wm. Woollams & Co. advert, c.1890 · Wellcome Collection · Jeffrey & Co. advert, 1884 (Hints to Househunters)" />
    </Desk>
  );
};

/** A hand-ruled card of the bans: rows written in, BANNED stamped in ink; Britain's row stays empty. */
const BanCard: React.FC<{t: TL; x: number; y: number; w: number}> = ({t, x, y, w}) => {
  const g = useGFrame();
  const hand = useHand();
  const at = t.at('Other countries');
  const k = interpolate(g, [at, at + 5], [0, 1], {...clamp, easing: (v) => 1 - Math.pow(1 - v, 3) * (1 - 2.2 * v * (1 - v))});
  const rowH = 120;
  const rows = [
    {c: 'Sweden', y: '1876', at: t.at('Sweden') - 1, stamp: t.at('1876') + 2},
    {c: 'Germany', y: '1880s', at: t.at('Germany') - 1, stamp: t.at('1880s', 2) + 2},
    {c: 'Britain', y: '', at: t.at('But Britain') - 1},
  ];
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: 130 + rows.length * rowH, background: '#f4efe6', boxShadow: '0 18px 34px rgba(0,0,0,0.6)',
      transform: `scale(${0.6 + 0.4 * k}) rotate(-1.5deg)`, opacity: Math.min(1, k * 2), overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(40,80,120,0.22) 1.5px, transparent 1.5px)', backgroundSize: `100% ${rowH}px`, backgroundPosition: `0 ${110 + rowH - 14}px`}} />
      <div style={{position: 'absolute', left: 190, top: 0, bottom: 0, width: 2, background: 'rgba(200,60,50,0.45)'}} />
      <div style={{position: 'absolute', left: 30, top: 30, fontFamily: JF.mono, fontSize: 26, letterSpacing: 3, color: '#2a2620'}}>BANS ON ARSENIC WALLPAPER</div>
      {rows.map((r, i) => {
        if (g < r.at) return null;
        const wr = interpolate(g, [r.at, r.at + 10], [0, 1], clamp);
        const top = 110 + i * rowH;
        return (
          <div key={r.c} style={{position: 'absolute', left: 0, top, width: '100%', height: rowH}}>
            <div style={{position: 'absolute', left: 34, top: 34, fontFamily: JF.mono, fontSize: 30, color: '#111'}}>{r.y}</div>
            <div style={{position: 'absolute', left: 220, top: 0, fontFamily: hand.family, fontSize: 60 * hand.scale, lineHeight: 1.2, color: '#16233a', whiteSpace: 'nowrap',
              clipPath: `inset(-20% ${(1 - wr) * 100}% -20% -5%)`}}>{r.c}</div>
            {r.stamp !== undefined && g >= r.stamp && (
              <div style={{position: 'absolute', left: w - 300, top: 22, padding: '2px 18px', border: '5px solid rgba(42,38,32,0.85)', fontFamily: JF.display, fontSize: 46, color: 'rgba(42,38,32,0.9)',
                transform: `rotate(-6deg) scale(${interpolate(g, [r.stamp, r.stamp + 3, r.stamp + 6], [1.35, 0.95, 1], clamp)})`}}>BANNED</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/** Sweden, Germany: bans. Britain: none. It didn't have to: by about 1900 nobody wanted it. */
const Bans: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('Other countries')}>
      <Note text="other countries did ban it:" x={150} y={60} size={50} rot={-2} at={t.at('Other countries') - 2} color="#ffffff" />
      <BanCard t={t} x={150} y={180} w={900} />
      <Stamp text="NO BAN" x={660} y={548} at={t.at('never banned')} size={130} color={pal.subject} rot={-5} />
      <Note text="(it didn't have to)" x={1150} y={190} size={54} rot={-3} at={t.at('didnt have to') - 2} color="#ffffff" />
      <Highlight text="BY c.1900" x={1150} y={350} size={100} at={t.at('By about 1900')} seed={705} rot={-2} />
      <Note text="nobody wanted it," x={1160} y={560} size={60} rot={-3} at={t.at('nobody wanted') - 2} />
      <Arrow x1={1300} y1={680} x2={1320} y2={770} bow={-18} at={t.at('so nobody made') - 4} />
      <Note text="so nobody made it." x={1180} y={790} size={64} rot={-3} at={t.at('so nobody made') - 2} color={pal.subject} />
    </Desk>
  );
};

/** A drawn span on the desk: 1872 (Draper's report) to 1900 (the law). */
const Span: React.FC<{x0: number; x1: number; y: number; at: number; dur?: number}> = ({x0, x1, y, at, dur = 22}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  const dot = (x: number, show: boolean) => show && <circle cx={x} cy={y} r={13} fill={pal.mark} stroke="#111" strokeWidth={4} />;
  const label = (x: number, text: string, show: boolean) => show && (
    <div style={{position: 'absolute', left: x - 70, top: y + 26, width: 140, textAlign: 'center', fontFamily: JF.mono, fontSize: 30, letterSpacing: 2, color: '#EDE7DC'}}>{text}</div>
  );
  return (
    <>
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
        <path d={`M${x0},${y} L${x0 + (x1 - x0) * p},${y + 2 * p}`} stroke={pal.mark} strokeWidth={6} strokeLinecap="round" fill="none" />
        {dot(x0, true)}
        {dot(x1, p >= 1)}
      </svg>
      {label(x0, '1872', true)}
      {label(x1, '1900', p >= 1)}
    </>
  );
};

/** America: Draper's "leave it alone", then the Massachusetts act of 1900, 28 years after his report. */
const Mass: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const span = t.at("That's 28");
  return (
    <Desk a={t.at('In America')}>
      <CropCard src={DRAPER} size={sizeOf(DRAPER)} x={150} y={150} w={400} h={540} fx={505} fy={640} scale={0.4} rot={-2} at={t.at('In America') - 1}
        mask={MASKS.draper} traceAt={t.at('Drapers') + 2} />
      <Note text="in America:" x={150} y={40} size={50} rot={-2} at={t.at('In America') + 1} color="#ffffff" />
      <Note text="Draper's idea:" x={130} y={740} size={46} rot={-3} at={t.at('Drapers') - 2} color="#ffffff" />
      <Note text="“leave it alone”" x={150} y={830} size={54} rot={-3} at={t.at('leave it alone') - 2} color={boxOf(pal)} />
      <Note text="...a long test" x={210} y={930} size={42} rot={-3} at={t.at('a long test') - 2} color="#ffffff" />
      <Doc src={MASS} x={700} y={90} w={480} rot={1.5} at={t.at('Massachusetts') - 1} push={[t.at('Massachusetts'), t.at('But the green')]} zoom={1.06} fy={1700}
        marks={[{at: t.at('Massachusetts') + 8, box: [90, 1132, 1550, 1238], pad: 14, seed: 7},
          {at: t.at('legal limit'), to: t.at('cloth') + 8, swipe: [[90, 2010, 1556, 2062]]}]} />
      <Highlight text="1900" x={1260} y={110} size={120} at={t.at('in 1900')} seed={707} rot={-2} />
      <Note text="a legal limit on arsenic" x={1250} y={330} size={46} rot={-3} at={t.at('legal limit') - 2} />
      <Note text="in wallpaper and cloth" x={1270} y={420} size={46} rot={-3} at={t.at('in wallpaper and cloth') - 2} />
      <Span x0={1300} x1={1740} y={640} at={span - 2} />
      <Stamp text="28 YEARS" x={1240} y={750} at={t.at('28')} size={120} color={pal.subject} rot={-3} />
      <Note text="after Draper's report" x={1290} y={900} size={46} rot={-3} at={t.at('after his report') - 2} color="#ffffff" />
      <Tag text="Frank W. Draper (Burrage, 1923) · Acts and Resolves of Massachusetts, 1900, ch. 325" />
    </Desk>
  );
};

/** "But the green didn't disappear. It moved." Riley's Potato Pests, 1876: the beetle. */
const Moved: React.FC<{t: TL}> = ({t}) => {
  const beetle = t.at('a beetle');
  return (
    <Desk a={t.at('But the green')}>
      <Note text="but the green didn't disappear." x={110} y={120} size={56} rot={-3} at={t.at('But the green') - 2} color="#ffffff" />
      <Highlight text="IT MOVED." x={120} y={250} size={120} at={t.at('It moved')} seed={709} rot={-2} />
      <Doc src={RILEY} x={1130} y={60} w={560} rot={2} at={t.at('Back in the') - 1} push={[t.at('Back in the'), t.at('Farmers')]} zoom={1.1} fx={1960} fy={2600}>
        {(S) => {
          const [cx, cy] = S(1960, 2610);
          const [ex] = S(2140, 2610);
          return <Loop cx={cx} cy={cy} rx={(ex - cx) * 1.15} ry={(ex - cx) * 1.5} at={beetle + 3} seed={711} tilt={-8} width={6} />;
        }}
      </Doc>
      <Note text="1860s–70s: a beetle" x={130} y={520} size={60} rot={-3} at={beetle - 2} />
      <Note text="eating its way across" x={150} y={640} size={50} rot={-3} at={t.at('eating its way') - 2} color="#ffffff" />
      <Note text="America's potato fields" x={170} y={730} size={50} rot={-3} at={t.at('potato fields') - 2} color="#ffffff" />
      <Tag text="C. V. Riley, Potato Pests: the Colorado Potato-Beetle, New York, 1876 (cover)" />
    </Desk>
  );
};

/** The strongest closing image: the farmer dusting Paris green over the potato rows (the pigment keeps its colour). */
const Farmer: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Sil name="g_farmer" file="ch07_potato_field.jpg" label="Paris green on the potato fields, 1870s" a={t.at('Farmers') - 1} b={t.at('It became')} fx={0.55} fy={0.5} z={[1.04, 1.13]}>
      {() => (
        <>
          <Highlight text="PARIS GREEN" x={110} y={80} size={96} at={t.at('Paris green')} seed={713} rot={-2} />
          <Note text="killed the beetle" x={130} y={225} size={50} rot={-3} at={t.at('killed it') - 2} color="#ffffff" />
          <Note text="the same poison:" x={120} y={330} size={50} rot={-3} at={t.at('So the same') - 2} color="#ffffff" />
          <Note text="torn off the walls..." x={140} y={420} size={54} rot={-3} at={t.at('tearing off') - 2} color="#ffffff" />
          <Note text="...dusted on the potatoes" x={160} y={515} size={54} rot={-3} at={t.at('dusting onto') - 2} color={pal.subject} />
        </>
      )}
    </Sil>
  );
};

/** One of the first big insecticides: Gray's sprinkler "for the use of Paris green water". */
const Insecticide: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('It became')}>
    <Doc src={GRAY} x={230} y={70} w={540} rot={-2} at={t.at('It became') - 1} push={[t.at('It became'), t.at('country') + 60]} zoom={1.06} fy={1800}
      marks={[{at: t.at('It became') + 6, to: t.at('one of the first'), swipe: [[470, 2330, 1060, 2376]]}]} />
    <Note text="one of the first big..." x={900} y={250} size={56} rot={-3} at={t.at('one of the first') - 2} />
    <Highlight text="INSECTICIDES" x={900} y={400} size={104} at={t.at('insecticides')} seed={715} rot={-2} />
    <Note text="in the country" x={940} y={600} size={54} rot={-3} at={t.at('in the country') - 2} color="#ffffff" />
    <Tag text="C. V. Riley, Potato Pests, 1876, fig. 35: Gray's sprinkler, for the use of Paris green water" />
  </Desk>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <HowEnd t={t} />],
    [at('Doctors') - 1, <Scared t={t} />],
    [at('Other countries') - 1, <Bans t={t} />],
    [at('In America') - 1, <Mass t={t} />],
    [at('But the green') - 1, <Moved t={t} />],
    [at('Farmers') - 1, <Farmer t={t} />],
    [at('It became') - 1, <Insecticide t={t} />],
  ];
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map((c) => c[0])}
        stamps={[at('In Britain'), at('By the 1880s'), at('By about 1900'), at('in 1900'), at('It moved'), at('Paris green'), at('insecticides'), at('1876') + 2, at('1880s', 2) + 2]}
        booms={[at('never banned'), at('28')]}
        writes={[at('how did it end') - 2, at('not with a law') - 2, at('Doctors') - 2, at('newspapers') - 2, at('shoppers got scared') - 2, at('Other countries') - 2,
          at('Sweden') - 1, at('Germany') - 1, at('But Britain') - 1, at('didnt have to') - 2, at('nobody wanted') - 2, at('so nobody made') - 2, at('In America') + 1, at('Drapers') - 2,
          at('leave it alone') - 2, at('a long test') - 2, at('legal limit') - 2, at('in wallpaper and cloth') - 2, at('after his report') - 2, at('But the green') - 2,
          at('a beetle') - 2, at('eating its way') - 2, at('potato fields') - 2, at('killed it') - 2, at('So the same') - 2, at('tearing off') - 2, at('dusting onto') - 2,
          at('one of the first') - 2, at('in the country') - 2]}
        ticks={[at('By the 1880s') + 3, at('something you put') - 1, at('Massachusetts') - 1, at('Back in the') - 1, at("That's 28") + 20]} />
    </>
  );
};

export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch07_arsenic_free.wav" lead={LEAD} music={[{src: 'music/a_newsroom.mp3', volume: 0.17}]}>
    <Body />
  </ChapterShell>
);
