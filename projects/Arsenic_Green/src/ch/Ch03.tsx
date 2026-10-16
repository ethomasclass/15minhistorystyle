// Chapter 3 · Dressed to Kill: the ballroom, the green gowns and hair wreaths, Hofmann's "twenty persons", the BMJ's
// "poison enough to slay", the Arsenic Waltz callback, the twist (the makers, not the wearers), the subscribe plug.
import React from 'react';
import {Img, interpolate, staticFile} from 'remotion';
import words from '../../public/audio/ch03_dressed_to_kill.words.json';
import {clamp} from '../lib/anim';
import {Highlight, Note, Tag, Tint, useGFrame, usePal} from '../kit/Kit';
import {Parallax} from '../kit/parallax';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {Desk, DropCard, Sounds} from '../kit/bs';
import {Doc, GREEN, Sil, sizeOf, Swatch, SWATCH_LABELS} from '../kit/dk';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH03_FRAMES = chapterFrames(N, LEAD);

const WALTZ = 'img/ch03/arsenic_waltz_punch_1862.jpg';
const PLATE = 'img/ch03/fashion_plate_moniteur_green_gown_c1863_rijks.jpg';
const BMJ = 'img/ch03/bmj_15feb1862_p177_poison_enough.jpg';
const HOF = 'img/ch03/hofmann_twenty_persons_chicago_med_examiner_sep1862_p537.jpg';

/** The green gown on the Moniteur plate (source px): only this stays in its own colour, the rest of the plate is B&W. */
const GOWN: [number, number][] = [[2500, 1760], [2780, 1740], [2860, 1900], [2900, 2200], [3050, 2500], [3250, 2900], [3420, 3250], [3500, 3500], [3460, 3660],
  [2000, 3660], [1940, 3300], [1930, 3000], [2050, 2700], [2200, 2450], [2330, 2250], [2380, 2000], [2440, 1840]];

/** A plate on a cream card, cropped to a window, B&W except a polygon (source px) left in the print's own colours. */
const ColourCrop: React.FC<{src: string; x: number; y: number; w: number; h: number; fx: number; fy: number; scale: number; rot?: number; at: number; keep: [number, number][]}> = ({
  src, x, y, w, h, fx, fy, scale, rot = 0, at, keep,
}) => {
  const g = useGFrame();
  if (g < at) return null;
  const size = sizeOf(src);
  const k = interpolate(g, [at, at + 5], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) * (1 - 2.2 * t * (1 - t))});
  const left = w / 2 - fx * scale;
  const top = h / 2 - fy * scale;
  const img: React.CSSProperties = {position: 'absolute', left, top, width: size[0] * scale, height: size[1] * scale};
  const poly = keep.map(([sx, sy]) => `${(sx * scale).toFixed(1)}px ${(sy * scale).toFixed(1)}px`).join(', ');
  return (
    <div style={{position: 'absolute', left: x - 14, top: y - 14, width: w + 28, height: h + 28, background: '#f4efe6', boxShadow: '0 18px 34px rgba(0,0,0,0.6)',
      transform: `scale(${0.6 + 0.4 * k}) rotate(${rot}deg)`, opacity: Math.min(1, k * 2)}}>
      <div style={{position: 'absolute', left: 14, top: 14, width: w, height: h, overflow: 'hidden'}}>
        <Img src={staticFile(src)} style={{...img, filter: 'grayscale(1) contrast(1.15)'}} />
        <Img src={staticFile(src)} style={{...img, filter: 'contrast(1.05) saturate(1.1)', clipPath: `polygon(${poly})`}} />
      </div>
    </div>
  );
};

/** The Arsenic Waltz as in the cold open: the lady's gown in arsenic green, slow push. */
const Waltz: React.FC<{a: number; b: number; z?: [number, number]; children?: React.ReactNode}> = ({a, b, z = [1.05, 1.12], children}) => (
  <Parallax name="waltz_lady" src={WALTZ} size={sizeOf(WALTZ)} a={a} b={b} fx={0.5} fy={0.38} cam={{z}} depth={1.05} mask={MASKS.waltz_lady} tint={null}
    tag="Punch, 8 Feb. 1862 · Wellcome Collection" filter="grayscale(1) contrast(1.25) brightness(0.98)">
    {(p) => (
      <>
        <Tint mask={MASKS.waltz_lady.alpha} place={p} size={sizeOf(WALTZ)} color={GREEN} strength={0.7} />
        {children}
      </>
    )}
  </Parallax>
);

/** "Possibly a dance." The ballroom, the green gown. */
const Ball: React.FC<{t: TL}> = ({t}) => (
  <Sil name="g_ballroom" file="ch03_ballroom_1862.jpg" label="a London ballroom, 1862" a={0} b={t.at('enormous skirts')} fx={0.55} fy={0.55} z={[1.04, 1.12]}>
    {() => (
      <>
        <Highlight text="THE 1860s" x={110} y={90} size={96} at={t.at('1860s')} seed={31} rot={-2} />
        <Note text="possibly... a dance." x={120} y={830} size={56} rot={-3} at={t.at('Possibly') - 3} />
      </>
    )}
  </Sil>
);

/** The fashion: the Moniteur plate (gown in its own green), the Met dress, and the Swatch, full. */
const Fashion: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('enormous skirts') - 1;
  return (
    <Desk a={a}>
      <ColourCrop src={PLATE} x={150} y={160} w={520} h={626} fx={2600} fy={2430} scale={0.236} rot={-2} at={a} keep={GOWN} />
      <DropCard src="img/ch03/met_green_silk_dress_1868.jpg" x={770} y={250} w={440} rot={3} at={t.at('bright green') - 1} filter="contrast(1.04)" pad={14} />
      <Note text="(probably arsenic green)" x={790} y={850} size={38} rot={-2} at={t.at('bright green') + 4} color="#ffffff" />
      <Note text="enormous skirts" x={1300} y={380} size={48} rot={-3} at={t.at('enormous skirts') - 2} />
      <Note text="thin fabric" x={1320} y={500} size={48} rot={-3} at={t.at('thin fabric') - 3} />
      <Note text="often bright green" x={1300} y={620} size={48} rot={-3} at={t.at('often dyed') - 3} />
      <Note text="+ leaves in the hair" x={1310} y={740} size={48} rot={-3} at={t.at('green leaves') - 3} />
      <Swatch items={SWATCH_LABELS.map((label) => ({label, at: -100}))} at={a + 4} />
      <Tag text="Moniteur des Dames et des Demoiselles, c.1863 · Rijksmuseum · Dress, 1868, probably arsenic green · The Met" />
    </Desk>
  );
};

/** Hofmann tests a hair wreath: "to poison twenty persons." */
const Wreath: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('In 1862') - 1;
  return (
    <Desk a={a}>
      <DropCard src="img/ch03/met_wedding_headdress_green_leaves_1863.jpg" x={120} y={150} w={620} rot={-3} at={a} filter="contrast(1.04)" pad={14} />
      <Highlight text="1862" x={140} y={720} size={110} at={t.at('1862')} seed={33} rot={-2} />
      <Note text="the chemist: A. W. Hofmann" x={150} y={890} size={46} rot={-3} at={t.at('a chemist') - 3} color="#ffffff" />
      <Doc src={HOF} x={860} y={-330} w={1000} rot={2} at={t.at('hair wreaths') - 1} push={[t.at('hair wreaths'), t.at('The British')]} fx={1425} fy={2100} zoom={1.2}
        marks={[{at: t.at('to poison twenty') - 2, to: t.end('persons'), swipe: [[1138, 2082, 1712, 2124]]}]} />
      <Tag text="Headdress, 1863 · The Met · Chicago Medical Examiner, Sept. 1862" />
    </Desk>
  );
};

/** The BMJ does the math on a whole dress. */
const Journal: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('The British') - 1;
  return (
    <Desk a={a}>
      <Doc src={BMJ} x={-410} y={-1882} w={2200} rot={-1} at={a} push={[a, t.at('Which is one way')]} fx={1875} fy={2935} zoom={1.12}
        marks={[
          {at: t.at('did the math') + 4, box: [1612, 2858, 2400, 2898], tint: true, seed: 4},
          {at: t.at('carries in her') - 2, to: t.end('ball-rooms'), swipe: [[1918, 2982, 2400, 3018], [1330, 3032, 2400, 3070], [1330, 3082, 2172, 3120]]},
        ]} />
      <Highlight text="BRITISH MEDICAL JOURNAL" x={100} y={70} size={76} at={t.at('British Medical Journal')} seed={35} rot={-2} />
      <Tag text="British Medical Journal, 15 Feb. 1862, p.177 · Internet Archive" />
    </Desk>
  );
};

/** One way to keep admirers at a distance; Punch draws the two skeletons. */
const Dance: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Waltz a={t.at('Which is one way') - 1} b={t.at("But here's")}>
      <Note text="one way to keep admirers at a distance" x={80} y={70} size={42} rot={-2} at={t.at('Which is one way') + 2} color={pal.subject} />
      <Note text="Punch, Feb. 1862" x={1400} y={80} size={46} rot={-3} at={t.at('Punch') - 3} color="#ffffff" />
      <Highlight text="THE ARSENIC WALTZ" x={110} y={850} size={92} at={t.at('Arsenic Waltz')} seed={37} rot={-2} />
    </Waltz>
  );
};

/** The twist: the wearers were mostly fine. */
const Twist: React.FC<{t: TL}> = ({t}) => (
  <Sil name="g_ballroom" file="ch03_ballroom_1862.jpg" label="a London ballroom, 1862" a={t.at("But here's") - 1} b={t.at('The people in')} fx={0.62} fy={0.6} z={[1.16, 1.24]}>
    {() => (
      <>
        <Note text="the twist:" x={100} y={130} size={56} rot={-3} at={t.at("But here's") + 2} color="#ffffff" />
        <Note text="most of them were fine" x={110} y={250} size={56} rot={-3} at={t.at('Most of the women') - 3} />
        <Note text="one evening: usually not enough" x={100} y={850} size={50} rot={-3} at={t.at('One evening') - 3} color="#ffffff" />
      </>
    )}
  </Sil>
);

/** The people in real danger: the makers, breathing the dust. */
const Makers: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Sil name="g_workshop" file="ch04_flower_workshop.jpg" label="an artificial-flower workshop" a={t.at('The people in') - 1} b={t.at('Hold onto')} fx={0.5} fy={0.5} z={[1.04, 1.1]}>
      {() => (
        <>
          <Note text="the ones who made them" x={1010} y={90} size={54} rot={-3} at={t.at('made them') - 3} color={pal.subject} />
          <Note text="breathing the dust, all day" x={1040} y={200} size={50} rot={-3} at={t.at('breathing') - 3} />
        </>
      )}
    </Sil>
  );
};

/** Hold onto that: one of them. */
const Hold: React.FC<{t: TL}> = ({t}) => (
  <Sil name="g_matilda" file="ch04_matilda_workbench.jpg" label="an artificial-flower maker, 1861" a={t.at('Hold onto') - 1} b={t.at('hit subscribe')} fx={0.45} fy={0.45} z={[1.1, 1.14]}>
    {() => <Note text="hold onto that." x={1150} y={110} size={54} rot={-3} at={t.at('Hold onto') + 2} color="#ffffff" />}
  </Sil>
);

/** The subscribe plug, over the Waltz. */
const Subscribe: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Waltz a={t.at('If youre enjoying') - 1} b={CH03_FRAMES} z={[1.12, 1.18]}>
      <Note text="(completely safe to touch)" x={90} y={80} size={46} rot={-2} at={t.at('completely safe') - 3} color={pal.subject} />
      <Note text="subscribe ↓" x={1480} y={900} size={58} rot={-3} at={t.at('hit subscribe') - 2} />
    </Waltz>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Ball t={t} />],
    [at('enormous skirts') - 1, <Fashion t={t} />],
    [at('In 1862') - 1, <Wreath t={t} />],
    [at('The British') - 1, <Journal t={t} />],
    [at('Which is one way') - 1, <Dance t={t} />],
    [at("But here's") - 1, <Twist t={t} />],
    [at('The people in') - 1, <Makers t={t} />],
    [at('Hold onto') - 1, <Hold t={t} />],
    [at('If youre enjoying') - 1, <Subscribe t={t} />],
  ];
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map((c) => c[0])}
        stamps={[at('1860s'), at('1862'), at('British Medical Journal'), at('Arsenic Waltz')]}
        writes={['Possibly', 'enormous skirts', 'thin fabric', 'often dyed', 'green leaves', 'a chemist', 'Which is one way', 'Punch', "But here's", 'Most of the women', 'One evening',
          'made them', 'breathing', 'Hold onto', 'hit subscribe', 'completely safe'].map((p) => at(p))}
        ticks={[at('bright green') - 1, at('In 1862') - 1, at('hair wreaths') - 1]}
        extra={[{at: at('carries in her'), src: 'sfx/marker_tick.wav', volume: 0.18}]} />
    </>
  );
};

export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch03_dressed_to_kill.wav" lead={LEAD} music={[{src: 'music/j_good_feelings.mp3', volume: 0.27}]}>
    <Body />
  </ChapterShell>
);
