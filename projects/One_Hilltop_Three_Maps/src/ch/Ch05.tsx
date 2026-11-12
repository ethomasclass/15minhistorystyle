// Chapter 5 · Back to the hilltop: the puzzle again, three religions as three maps with their labels (ethnic ·
// diaspora; universalizing · contagious, hierarchical, relocation; universalizing · hierarchical + contagious),
// sacred spaces and pilgrimage across both videos, back to Jerusalem, then a music-only end card.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import words from '../../public/audio/ch05_ending.words.json';
import credits from '../../public/img/credits.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, CropCard, Definition, hasFile, LEAD, makeTimeline, type Narration, Photo, type TL, useScene} from '../kit/shell';
import {PAL} from '../kit/look';
import {Dot, type Fill, MapLabel, WorldMap} from '../kit/asia';

const N = words as Narration;
/** Music-only end card after the narration (about 6 s on screen before the fade). */
const EXTRA = 180;
export const CH05_FRAMES = chapterFrames(N, LEAD) + EXTRA;
/** Narration-time frame the end card starts: a short hold on Jerusalem after the last word. */
const CARD = Math.ceil(N.duration * 30) + 40;

const MUTED = 'saturate(0.55) contrast(1.08) brightness(0.82)';

/** Credit line for a picture from public/img/credits.json. */
type Credit = {title: string; artist: string; licence: string};
const CREDITS = credits as unknown as Record<string, Credit>;
const shortCredit = (key: string, what: string, fallback: string) => {
  const c = CREDITS[key];
  if (!c) return fallback;
  const artist = c.artist.replace(/\s*\(.*$/, '').replace(/\s+from .*$/, '').replace(/ of Al Jazeera.*$/, '').slice(0, 22);
  return `${what} · ${artist}, ${c.licence}`;
};

const AERIAL = 'img/ch01/jerusalem_temple_mount_aerial.jpg';
const AERIAL_SIZE: [number, number] = [1920, 1442];
const AERIAL_TAG = 'Jerusalem, aerial view of the Temple Mount · Godot13, CC BY-SA 4.0, via Wikimedia Commons';
const KAABA = 'img/ch04/kaaba_crowd.jpg';
const KAABA_SIZE: [number, number] = [1920, 1275];

const LL = {
  jerusalem: [35.23, 31.78] as [number, number],
  mecca: [39.83, 21.42] as [number, number],
  varanasi: [83.0, 25.32] as [number, number],
  bodhGaya: [84.99, 24.7] as [number, number],
  amritsar: [74.87, 31.63] as [number, number],
  jakarta: [106.85, -6.2] as [number, number],
};

/** Same simplified sets as the cold open (shaded = majority religion). */
const CHRISTIAN = [
  '840', '124', '484', '320', '084', '340', '222', '558', '188', '591', '192', '332', '214', '388', '170', '862', '328', '740', '218', '604', '068', '076', '600', '152', '032', '858', '780',
  '826', '372', '250', '724', '620', '380', '276', '528', '056', '756', '040', '616', '203', '703', '348', '642', '100', '300', '688', '191', '705', '807', '499', '804', '112', '643',
  '440', '428', '233', '246', '752', '578', '208', '352', '498', '268', '051', '442',
  '231', '180', '024', '710', '404', '800', '834', '894', '716', '508', '454', '450', '288', '120', '178', '266', '516', '072', '646', '108', '140', '728', '426', '748', '430',
  '608', '036', '554', '598', '626',
];
const MUSLIM = [
  '504', '012', '788', '434', '818', '729', '478', '466', '562', '686', '706', '682', '887', '512', '784', '634', '414', '048', '400', '760', '368', '364', '792', '004', '586', '050',
  '398', '860', '795', '417', '762', '031', '360', '458', '148', '324', '270', '854', '262', '096', '732', '008', '462',
];
const SPLIT = ['566'];
const INDONESIA = '360';
const JEWISH: [number, number, number][] = [
  [35.0, 31.5, 22], [-77, 40.5, 20],
  [2.35, 48.85, 8], [-79.4, 43.7, 7], [-0.12, 51.5, 7], [-58.4, -34.6, 7], [37.6, 55.75, 6], [13.4, 52.5, 5], [144.96, -37.8, 6],
  [-46.6, -23.5, 5], [28.0, -26.2, 5], [30.5, 50.45, 5], [-99.1, 19.4, 4], [19.05, 47.5, 4], [-118.2, 34.0, 7], [-80.2, 25.8, 6],
];

// ---------- scenes ----------

/** Back on the hilltop: the question again. */
const Question: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Photo src={AERIAL} size={AERIAL_SIZE} fx={960} fy={600} z0={1.14} z1={1.04} a={0} b={t.at('Judaism')} bw={MUTED} vignette={0.75}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 60%)'}} />
          <Note text="so..." x={110} y={60} size={60} rot={-3} at={-2} color="#ffffff" />
          <Highlight text="ONE TINY REGION," x={100} y={150} size={84} at={t.at('same tiny')} seed={91} rot={-2} />
          <Highlight text="THREE DIFFERENT MAPS?" x={100} y={280} size={84} at={t.at('different maps')} seed={92} rot={-1} />
          <Note text="because they spread in different ways" x={120} y={430} size={62} rot={-3} at={t.at('Because') - 3} color={pal.subject} />
          <Tag text={AERIAL_TAG} />
        </>
      )}
    </Photo>
  );
};

/** Judaism: an ethnic religion scattered by exile and migration into a diaspora. */
const Diaspora: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Judaism');
  const sc = t.at('scattered');
  const d = t.at('diaspora');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 10, lat: 30, z: 1.6}, {f: d + 20, lon: -5, lat: 25, z: 1.25}]} fills={[{id: '376', at: a + 2, color: PAL.teal, opacity: 0.55}]}>
        {(S) => {
          const [jx, jy] = S(LL.jerusalem);
          return (
            <>
              <Dot x={jx} y={jy} at={a + 2} r={12} color={pal.subject} />
              {JEWISH.slice(1).map(([lon, lat, r], k) => {
                const [x, y] = S([lon, lat]);
                return (
                  <React.Fragment key={k}>
                    {k < 6 && k !== 4 && <Arrow x1={jx - 10} y1={jy - 6} x2={x + (x < jx ? 18 : -18)} y2={y} bow={k % 2 ? 50 : -40} at={sc + 4 + k * 3} dur={8} width={4} color={PAL.teal} />}
                    <Dot x={x} y={y} at={d + (k % 8) * 2} r={Math.max(6, r * 0.7)} color={PAL.teal} ring={false} />
                  </React.Fragment>
                );
              })}
              <MapLabel text="hearth" x={jx + 30} y={jy + 44} at={a + 4} color={pal.subject} size={28} />
            </>
          );
        }}
      </WorldMap>
      <Note text="Judaism" x={110} y={60} size={60} rot={-3} at={a - 3} color="#ffffff" />
      <Highlight text="ETHNIC RELIGION" x={100} y={140} size={76} at={t.at('ethnic')} seed={93} rot={-2} />
      <Note text="scattered by exile + migration" x={110} y={760} size={54} rot={-2} at={sc - 3} color="#ffffff" />
      <Highlight text="DIASPORA" x={100} y={850} size={76} at={d} seed={94} rot={-2} />
      <Note text="relocation diffusion" x={600} y={870} size={56} rot={-3} at={d + 8} color={pal.subject} />
      <Tag text="Simplified: dots = notable communities today · Map: Natural Earth" x={1060} />
    </AbsoluteFill>
  );
};

/** A small torn-tape label sized for the three columns. */
const Label: React.FC<{text: string; x: number; y: number; at: number; seed: number}> = ({text, x, y, at, seed}) => (
  <Highlight text={text} x={x} y={y} size={44} at={at} seed={seed} rot={-1.5} />
);

/** Same neighbourhood, three maps: each religion with its type and how it spread. */
const ThreeMaps: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const c = t.at('Christianity');
  const i = t.at('Islam');
  const cam = [{f: 0, lon: 15, lat: 12, z: 0.3}];
  const W = 540, H = 330, Y = 250;
  const xs = [90, 690, 1290];
  // the column being talked about stays bright, the others dim a little
  const focus = (k: number) => {
    const on = [-999, c, i][k];
    const next = [c, i, 1e7][k];
    if (g < on) return 0.4;
    return g < next ? 1 : 0.6;
  };
  const head = (text: string, x: number, color: string) => (
    <MapLabel text={text} x={x + W / 2} y={Y - 40} at={-999} align="center" color={color} size={36} />
  );
  const step = (text: string, x: number, y: number, at: number, color = '#ffffff') => <Note text={text} x={x} y={y} size={34} rot={-2} at={at - 3} color={color} />;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="three religions, three ways of spreading" x={110} y={70} size={56} rot={-2} at={-2} color="#ffffff" />
      {head('Judaism', xs[0], PAL.teal)}
      {head('Christianity', xs[1], PAL.orange)}
      {head('Islam', xs[2], PAL.coral)}
      <div style={{opacity: focus(0)}}>
        <WorldMap x={xs[0]} y={Y} w={W} h={H} frame keys={cam}>
          {(S) => (<>{JEWISH.map(([lon, lat, r], k) => {
            const [x, y] = S([lon, lat]);
            return <Dot key={k} x={x} y={y} at={-999} r={Math.max(4, r * 0.45)} color={PAL.teal} ring={false} />;
          })}</>)}
        </WorldMap>
        <Label text="ETHNIC" x={xs[0] + 6} y={Y + H + 36} at={-999} seed={95} />
        {step('diaspora', xs[0] + 10, Y + H + 130, -999, PAL.teal)}
        {step('(relocation)', xs[0] + 20, Y + H + 190, -999)}
      </div>
      <div style={{opacity: focus(1)}}>
        <WorldMap x={xs[1]} y={Y} w={W} h={H} frame keys={cam}
          fills={[...CHRISTIAN.map((id, k) => ({id, at: c + 2 + (k % 6), color: PAL.orange, opacity: 0.75})), ...SPLIT.map((id) => ({id, at: c + 4, color: PAL.orange, opacity: 0.3}))]}>
          {(S) => {
            const [ex, ey] = S([15, 48]);
            const [ax, ay] = S([18, 2]);
            return <Arrow x1={ex} y1={ey} x2={ax} y2={ay} bow={-20} at={t.at('center')} dur={10} width={5} color={pal.subject} />;
          }}
        </WorldMap>
        <Label text="UNIVERSALIZING" x={xs[1] + 6} y={Y + H + 36} at={c} seed={96} />
        {step('contagious (person to person)', xs[1] + 10, Y + H + 130, t.at('person'))}
        {step('→ hierarchical (an empire)', xs[1] + 10, Y + H + 185, t.at('empire'))}
        {step('→ relocation (colonizers)', xs[1] + 10, Y + H + 240, t.at('oceans'))}
        {step('center shifted south', xs[1] + 20, Y + H + 305, t.at('center'), pal.subject)}
      </div>
      <div style={{opacity: focus(2)}}>
        <WorldMap x={xs[2]} y={Y} w={W} h={H} frame keys={cam}
          fills={[...MUSLIM.map((id, k): Fill => ({id, at: i + 2 + (k % 6), color: id === INDONESIA ? PAL.coral : PAL.cream, opacity: id === INDONESIA ? 0.95 : 0.45})),
            ...SPLIT.map((id) => ({id, at: i + 4, color: PAL.cream, opacity: 0.22}))]}>
          {(S) => {
            const [mx, my] = S(LL.mecca);
            const [jx, jy] = S(LL.jakarta);
            return <Arrow x1={mx + 4} y1={my + 4} x2={jx - 6} y2={jy - 4} bow={-24} at={t.at('Indonesia')} dur={10} width={5} color={pal.subject} />;
          }}
        </WorldMap>
        <Label text="UNIVERSALIZING" x={xs[2] + 6} y={Y + H + 36} at={i} seed={97} />
        {step('hierarchical (rulers)', xs[2] + 10, Y + H + 130, t.at('rulers'))}
        {step('+ contagious (traders)', xs[2] + 10, Y + H + 185, t.at('traders'))}
        {step('all the way to Indonesia', xs[2] + 20, Y + H + 250, t.at('all the way'), pal.subject)}
      </div>
      <Tag text="Simplified: shaded = majority religion; dots = notable communities · Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** Five hearths across both videos: what keeps pulling people back is sacred space. */
const HEARTHS: {word: string; label: string; ll: [number, number]; dx: number; dy: number; align?: 'left' | 'right'}[] = [
  {word: 'Jerusalem', label: 'Jerusalem', ll: LL.jerusalem, dx: -30, dy: -40, align: 'right'},
  {word: 'Mecca', label: 'Mecca', ll: LL.mecca, dx: -30, dy: 40, align: 'right'},
  {word: 'Amritsar', label: 'Amritsar', ll: LL.amritsar, dx: -30, dy: -40, align: 'right'},
  {word: 'Varanasi', label: 'Varanasi', ll: LL.varanasi, dx: -30, dy: 46, align: 'right'},
  {word: 'Bodh', label: 'Bodh Gaya', ll: LL.bodhGaya, dx: 34, dy: -30},
];
const Hearths: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('But across');
  const h = t.at('hearths');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 58, lat: 26, z: 3.0}, {f: t.at('sacred spaces') + 30, lon: 58, lat: 25, z: 3.3}]}>
        {(S) => {
          const pts = HEARTHS.map((p) => S(p.ll));
          // a few arrivals from far away, pointing in
          const ins: [number, number, number][] = [[0, -150, 40], [0, 130, 140], [1, 150, 40], [1, -40, 160], [2, 150, -120], [2, -140, -110], [3, -130, 170], [4, 170, 120]];
          return (
            <>
              {HEARTHS.map((p, k) => (
                <React.Fragment key={p.word}>
                  <Dot x={pts[k][0]} y={pts[k][1]} at={h + k * 2} r={12} color={pal.subject} />
                  <MapLabel text={p.label} x={pts[k][0] + p.dx} y={pts[k][1] + p.dy} at={h + k * 2} align={p.align} color={PAL.cream} size={28} />
                </React.Fragment>
              ))}
              {ins.map(([k, dx, dy], j) => {
                const [px, py] = pts[k];
                const d = Math.hypot(dx, dy);
                return <Arrow key={j} x1={px + dx} y1={py + dy} x2={px + (dx / d) * 34} y2={py + (dy / d) * 34} bow={18} at={t.at('pulling') + j * 2} dur={8} width={5} color={PAL.teal} />;
              })}
            </>
          );
        }}
      </WorldMap>
      <Note text="across both videos..." x={110} y={70} size={54} rot={-3} at={a - 3} color="#ffffff" />
      <Note text="pulling people back to the hearths" x={110} y={150} size={54} rot={-3} at={t.at('pulling') - 3} />
      <Highlight text="SACRED SPACES" x={100} y={770} size={80} at={t.at('sacred spaces')} seed={98} rot={-2} />
      <Definition term="sacred space" def="a place a religion treats as holy, set apart for worship" at={t.at('sacred spaces') + 9} x={110} y={900} w={1100} />
      <Tag text="Map: Natural Earth" x={1500} />
    </AbsoluteFill>
  );
};

/** Pilgrimage: a montage of sacred places on the desk, as each is named. */
type Pic = {src: string; size: [number, number]; fx: number; fy: number; scale: number; word: string; nth?: number; place: string; credit: string; extra?: number};
const PICS: Pic[] = [
  {src: 'img/v1/varanasi_sunrise_crowd.jpg', size: [1920, 1238], fx: 960, fy: 700, scale: 0.3, word: 'Varanasi', place: 'Varanasi', credit: 'Ninara, CC BY 2.0'},
  {src: 'img/v1/tree_gate.jpg', size: [1920, 1310], fx: 900, fy: 700, scale: 0.3, word: 'Bodh', place: 'Bodh Gaya', credit: 'Photo Dharma, CC BY 2.0'},
  {src: 'img/v1/golden_temple_night.jpg', size: [1920, 1280], fx: 950, fy: 640, scale: 0.3, word: 'Amritsar', place: 'Amritsar', credit: 'shankar s., CC BY 2.0'},
  {src: 'img/ch01/western_wall_crowd.jpg', size: [1920, 1280], fx: 960, fy: 700, scale: 0.3, word: 'Jerusalem', place: 'Jerusalem', credit: 'Western Wall · Askii, CC BY-SA 3.0'},
  {src: 'img/ch01/holy_sepulchre.jpg', size: [1920, 1785], fx: 1150, fy: 900, scale: 0.3, word: 'Jerusalem', place: 'Jerusalem', credit: 'Holy Sepulchre · B. Werner, CC BY-SA 3.0', extra: 4},
  {src: KAABA, size: KAABA_SIZE, fx: 700, fy: 560, scale: 0.3, word: 'Mecca', place: 'Mecca', credit: ''},
];
const Pilgrimage: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const W = 480, H = 240;
  const pos = [[120, 50], [720, 50], [1320, 50], [120, 420], [720, 420], [1320, 420]];
  const kaaba = hasFile(KAABA);
  return (
    <AbsoluteFill>
      <DarkPaper />
      {PICS.map((p, k) => {
        const [x, y] = pos[k];
        const at = t.at(p.word, p.nth) - 1 + (p.extra ?? 0);
        const ok = p.src !== KAABA || kaaba;
        const credit = p.src === KAABA ? shortCredit(KAABA, 'Kaaba', 'Kaaba, Mecca') : p.credit;
        return (
          <React.Fragment key={k}>
            {ok ? (
              <CropCard src={p.src} size={p.size} x={x} y={y} w={W} h={H} fx={p.fx} fy={p.fy} scale={p.scale} rot={k % 2 ? 2 : -2} at={at} bw={MUTED} />
            ) : (
              <DrawnCube x={x} y={y} w={W} h={H} at={at} />
            )}
            <MapLabel text={p.place} x={x + 6} y={y + H + 34} at={at + 2} color={PAL.teal} size={24} />
            <Tag text={credit} x={x} y={y + H + 58} />
          </React.Fragment>
        );
      })}
      <Tag text="Photos via Wikimedia Commons" x={1500} />
      <Note text="millions of people every year" x={1040} y={780} size={46} rot={-3} at={t.at('millions') - 3} color="#ffffff" />
      <Highlight text="PILGRIMAGE" x={100} y={770} size={80} at={t.at('pilgrimage')} seed={99} rot={-2} />
      <Definition term="pilgrimage" def="a journey to a holy place" at={t.at('pilgrimage') + 9} x={110} y={900} w={900} />
    </AbsoluteFill>
  );
};

/** Fallback card if the Kaaba photo is missing: a drawn cube (the Kaaba as a place), no people. */
const DrawnCube: React.FC<{x: number; y: number; w: number; h: number; at: number}> = ({x, y, w, h, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  const cx = x + w / 2, cy = y + h / 2 + 10;
  return (
    <div style={{position: 'absolute', left: x - 14, top: y - 14, width: w + 28, height: h + 28, background: '#f4efe6', boxShadow: '0 18px 34px rgba(0,0,0,0.6)'}}>
      <div style={{position: 'absolute', left: 14, top: 14, width: w, height: h, background: '#1b1915'}}>
        <svg width={w} height={h}>
          <path d={`M${cx - x - 90},${cy - y - 50} L${cx - x},${cy - y - 85} L${cx - x + 90},${cy - y - 50} L${cx - x + 90},${cy - y + 60} L${cx - x},${cy - y + 95} L${cx - x - 90},${cy - y + 60} Z M${cx - x - 90},${cy - y - 50} L${cx - x},${cy - y - 15} L${cx - x + 90},${cy - y - 50} M${cx - x},${cy - y - 15} L${cx - x},${cy - y + 95}`}
            fill="none" stroke={PAL.teal} strokeWidth={5} strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

/** Pilgrims reshape the landscape: the crowd at the Kaaba, the city built around it. */
const Landscape: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('And those');
  const items: [string, string][] = [['roads', 'roads'], ['markets', 'markets'], ['hotels', 'hotels'], ['whole cities', 'whole']];
  const body = (
    <>
      <AbsoluteFill style={{background: 'linear-gradient(270deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 32%, rgba(0,0,0,0) 55%)'}} />
      <Note text="journeys reshape" x={1240} y={100} size={56} rot={-3} at={t.at('reshape') - 3} color="#ffffff" />
      {items.map(([text, w], k) => (
        <Note key={w} text={'+ ' + text} x={1300} y={300 + k * 105} size={66} rot={-3} at={t.at(w) - 3} color={k === 3 ? pal.subject : PAL.teal} />
      ))}
      <Note text="the landscape:" x={1260} y={180} size={56} rot={-3} at={t.at('landscape') - 3} color="#ffffff" />
      <Note text="built to welcome travelers" x={1180} y={760} size={50} rot={-3} at={t.at('welcome') - 3} color="#ffffff" />
    </>
  );
  if (!hasFile(KAABA)) {
    return (
      <Photo src="img/ch01/jerusalem_panorama.jpg" size={[1920, 1063]} fx={760} fy={560} z0={1.03} z1={1.12} a={a} b={t.at('Which')} bw={MUTED} vignette={0.7}>
        {() => (<>{body}<Tag text="Mount of Olives, Jerusalem · Godot13, CC BY-SA 4.0, via Wikimedia Commons" /></>)}
      </Photo>
    );
  }
  return (
    <Photo src={KAABA} size={KAABA_SIZE} fx={760} fy={600} z0={1.03} z1={1.12} a={a} b={t.at('Which')} bw={MUTED} vignette={0.7}>
      {(p) => (
        <>
          <Loop cx={p.left + 720 * p.scale} cy={p.top + 560 * p.scale} rx={450 * p.scale} ry={360 * p.scale} at={a + 6} seed={81} tilt={-4} color={pal.mark} />
          {body}
          <Tag text={shortCredit(KAABA, 'Pilgrims at the Kaaba, Mecca, during the hajj', 'Pilgrims at the Kaaba, Mecca') + ', via Wikimedia Commons'} />
        </>
      )}
    </Photo>
  );
};

/** Back to the hilltop for the last line. */
const Hilltop: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Photo src={AERIAL} size={AERIAL_SIZE} fx={960} fy={600} z0={1.02} z1={1.16} a={t.at('Which')} b={CARD} bw={MUTED} vignette={0.75}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.6) 100%)'}} />
          <Note text="this tiny walled city" x={110} y={80} size={66} rot={-3} at={t.at('tiny walled') - 3} color="#ffffff" />
          <Note text="still matters to billions" x={760} y={190} size={66} rot={-4} at={t.at('matters') - 3} color={pal.subject} />
          <Note text="who will never live here" x={1080} y={880} size={56} rot={-3} at={t.at('never') - 3} color="#ffffff" />
          <Tag text={AERIAL_TAG} />
        </>
      )}
    </Photo>
  );
};

/** End card: the before-class question, with Italy and Indonesia lit on a small map (no arrows, so it gives nothing away). */
const EndCard: React.FC = () => {
  const g = useGFrame();
  const pal = usePal();
  const a = CARD;
  const q = (text: string, at: number, color = '#f4efe6', size = 48) => (
    <div style={{fontFamily: JF.sans, fontWeight: 600, fontSize: size, lineHeight: 1.3, color, opacity: interpolate(g, [at, at + 8], [0, 1], clamp), marginBottom: 26}}>{text}</div>
  );
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap x={1110} y={230} w={720} h={560} frame keys={[{f: 0, lon: 66, lat: 20, z: 1.0}]}
        fills={[{id: '380', at: a + 40, color: PAL.orange, opacity: 0.8}, {id: INDONESIA, at: a + 10, color: PAL.coral, opacity: 0.9}]}>
        {(S) => {
          const [ix, iy] = S([117, -1.5]);
          const [rx, ry] = S([12.5, 41.9]);
          return (
            <>
              <MapLabel text="Indonesia" x={ix} y={iy + 70} align="center" at={a + 10} color={pal.subject} size={26} />
              <Dot x={rx} y={ry} at={a + 40} r={9} color={PAL.orange} />
              <MapLabel text="Rome" x={rx - 4} y={ry - 44} align="center" at={a + 40} color={PAL.orange} size={26} />
            </>
          );
        }}
      </WorldMap>
      <Highlight text="BEFORE CLASS" x={100} y={90} size={90} at={a + 2} seed={100} rot={-2} />
      <div style={{position: 'absolute', left: 120, top: 270, width: 980}}>
        {q('1. Islam reached Indonesia through merchants.', a + 10)}
        {q('2. Christianity spread after a Roman emperor converted.', a + 40)}
        {q('Which type of diffusion is each?', a + 64, pal.mark, 56)}
      </div>
      <Note text="bring your answer to class" x={140} y={860} size={56} rot={-3} at={a + 84} color={pal.subject} />
      <Tag text="Map: Natural Earth" x={1110} y={810} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Question t={t} />],
    [at('Judaism') - 1, <Diaspora t={t} />],
    [at('Christianity') - 1, <ThreeMaps t={t} />],
    [at('But across') - 1, <Hearths t={t} />],
    [at('Places like') - 1, <Pilgrimage t={t} />],
    [at('And those') - 1, <Landscape t={t} />],
    [at('Which') - 1, <Hilltop t={t} />],
    [CARD, <EndCard />],
  ];
  const scene = useScene(cuts);
  const stamps = [at('same tiny'), at('different maps'), at('ethnic'), at('diaspora'), at('Christianity'), at('Islam'), at('sacred spaces'), at('pilgrimage'), CARD + 2];
  const notes = [at('Because'), at('Judaism'), at('scattered'), at('diaspora') + 8, at('person'), at('empire'), at('oceans'), at('center'), at('rulers'), at('traders'), at('all the way'),
    at('But across'), at('pulling'), at('millions'), at('reshape'), at('landscape'), at('roads'), at('markets'), at('hotels'), at('whole'), at('welcome'), at('tiny walled'), at('matters'), at('never'), CARD + 84];
  const ticks = [at('hearths'), at('Varanasi'), at('Bodh'), at('Amritsar'), at('Jerusalem'), at('Mecca')];
  return (
    <AbsoluteFill>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={'w' + i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {stamps.map((f, i) => <Sfx key={'s' + i} at={f} src="sfx/stamp.wav" volume={0.27} />)}
      {notes.map((f, i) => <Sfx key={'n' + i} at={f - 3} src={WRITE.src} volume={WRITE.volume} />)}
      {ticks.map((f, i) => <Sfx key={'t' + i} at={f} src="sfx/tick.wav" volume={0.4} />)}
    </AbsoluteFill>
  );
};

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_ending.wav" lead={LEAD} extra={EXTRA} music={[{src: 'music/r_ending.mp3', volume: 0.15}]}>
    <Body />
  </ChapterShell>
);
