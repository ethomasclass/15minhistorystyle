// Chapter 6 · Shall We Poison Our Homes?: the same green in America. Frank Draper's 1872 report for the Massachusetts
// board of health ("Everybody knows…", "too sacred"), laissez-faire, then Robert Kedzie's Michigan cases and his book.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch06_poison_our_homes.words.json';
import {clamp} from '../lib/anim';
import {Highlight, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {Arch, Desk, DropCard, Sounds} from '../kit/bs';
import {Parallax} from '../kit/parallax';
import {camAt, type Cam, Pin, smooth} from '../kit/map';
import {Doc, type DocMark, Sil, sizeOf} from '../kit/dk';
import type {MaskRef} from '../kit/maskref';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH06_FRAMES = chapterFrames(N, LEAD);

const WHITE = '#ffffff';
const ORANGE = '#FF9F1C';
const NLM = 'Courtesy of the National Library of Medicine';
const DRAPER = 'Draper, Third Annual Report, Mass. State Board of Health, 1872';

// ---------------------------------------------------------------------------------------------
// Helpers (chapter-local)

/** A portrait as a small parallax scene inside a cream card (the source is too small for full-bleed). */
const PortraitCard: React.FC<{name: string; src: string; x: number; y: number; w: number; h: number; a: number; b: number; at: number; rot?: number;
  fx?: number; fy?: number; z?: [number, number]; mask?: MaskRef; traceAt?: number}> = ({name, src, x, y, w, h, a, b, at, rot = 0, fx = 0.5, fy = 0.45, z = [1.02, 1.1], mask, traceAt}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 5], [0, 1], {...clamp, easing: (u) => 1 - Math.pow(1 - u, 3) * (1 - 2.2 * u * (1 - u))});
  return (
    <div style={{position: 'absolute', left: x - 14, top: y - 14, width: w + 28, height: h + 28, background: '#f4efe6', boxShadow: '0 18px 34px rgba(0,0,0,0.6)',
      transform: `scale(${0.6 + 0.4 * k}) rotate(${rot}deg)`, opacity: Math.min(1, k * 2)}}>
      <div style={{position: 'absolute', left: 14, top: 14, width: w, height: h, overflow: 'hidden'}}>
        <Parallax name={name} src={src} size={sizeOf(src)} a={a} b={b} tag="" frame={[w, h]} fx={fx} fy={fy} cam={{z}} depth={1.05} mask={mask} traceAt={traceAt} vignette={0.35} />
      </div>
    </div>
  );
};

/** A scanned page seen through a window on a cream card: source point (fx, fy) sits at the window centre at scale sc. */
const DocWindow: React.FC<{src: string; x: number; y: number; w: number; h: number; fx: number; fy: number; sc: number; at: number; rot?: number;
  marks?: DocMark[]; push?: [number, number]; zoom?: number}> = ({src, x, y, w, h, fx, fy, sc, at, rot = 0, marks, push, zoom = 1.12}) => {
  const g = useGFrame();
  if (g < at) return null;
  const size = sizeOf(src);
  return (
    <div style={{position: 'absolute', left: x - 14, top: y - 14, width: w + 28, height: h + 28, background: '#f4efe6', boxShadow: '0 18px 34px rgba(0,0,0,0.6)', transform: `rotate(${rot}deg)`}}>
      <div style={{position: 'absolute', left: 14, top: 14, width: w, height: h, overflow: 'hidden', background: '#e9e0cc'}}>
        <Doc src={src} x={w / 2 - fx * sc} y={h / 2 - fy * sc} w={size[0] * sc} at={at} marks={marks} push={push} fx={fx} fy={fy} zoom={zoom} />
      </div>
    </div>
  );
};

/** Black's 1873 Atlantic map (5287 x 3649) with a camera in map pixels; the camera is clamped so the image always fills the frame. */
const ATLANTIC = 'img/maps/atlantic_ocean_black_1873.jpg';
const AT_PLACES = {london: [4727, 1265], boston: [2340, 1740]};
const AtlanticMap: React.FC<{keys: Cam[]; dim?: number; svg?: React.ReactNode; children?: (S: (p: number[]) => number[]) => React.ReactNode}> = ({keys, dim = 0.12, svg, children}) => {
  const f = useCurrentFrame();
  const [W, H] = sizeOf(ATLANTIC);
  const c = camAt(keys, f);
  const hw = 960 / c.s, hh = 540 / c.s;
  const cx = Math.min(W - hw, Math.max(hw, c.x));
  const cy = Math.min(3330 - hh, Math.max(hh, c.y));   // stay above the handwritten note in the bottom margin
  const S = ([x, y]: number[]) => [960 + (x - cx) * c.s, 540 + (y - cy) * c.s];
  return (
    <AbsoluteFill style={{background: '#15130f', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 960 - cx * c.s, top: 540 - cy * c.s, width: W * c.s, height: H * c.s}}>
        <Img src={staticFile(ATLANTIC)} style={{width: '100%', height: '100%', filter: `grayscale(1) sepia(0.25) contrast(1.2) brightness(${0.8 - dim})`}} />
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={W * c.s} height={H * c.s} viewBox={`0 0 ${W} ${H}`}>{svg}</svg>
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(8,6,4,0.8) 100%)'}} />
      {children?.(S)}
    </AbsoluteFill>
  );
};

/** An orange dashed route in map pixels, revealed along its length from `at` over `dur`. */
const DashRoute: React.FC<{pts: number[][]; at: number; dur: number; width?: number}> = ({pts, at, dur, width = 12}) => {
  const g = useGFrame();
  const p = interpolate(g, [at, at + dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  if (p <= 0) return null;
  const d = smooth(pts);
  return (
    <>
      <mask id="dashreveal">
        <path d={d} fill="none" stroke="#fff" strokeWidth={width * 3} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      </mask>
      <g mask="url(#dashreveal)">
        <path d={d} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth={width * 1.4} strokeDasharray={`${width * 3.4} ${width * 2.4}`} strokeLinecap="round" transform="translate(6 9)" />
        <path d={d} fill="none" stroke={ORANGE} strokeWidth={width} strokeDasharray={`${width * 3.4} ${width * 2.4}`} strokeLinecap="round" />
      </g>
    </>
  );
};

// ---------------------------------------------------------------------------------------------
// Scenes

/** Meanwhile, in America: London to Boston on the 1873 Atlantic map. */
const Atlantic: React.FC<{t: TL}> = ({t}) => {
  const end = t.at('Massachusetts');
  const keys: Cam[] = [
    {f: 0, x: 3700, y: 1380, s: 0.62},
    {f: t.at('in America'), x: 3650, y: 1390, s: 0.63},
    {f: t.at('same walls') + 10, x: 2520, y: 1640, s: 0.8},
    {f: end + 30, x: 2470, y: 1660, s: 0.84},
  ];
  const go = t.at('Meanwhile');
  const arrive = t.at('was on the');
  return (
    <AtlanticMap keys={keys}
      svg={<DashRoute pts={[AT_PLACES.london, [4300, 1300], [3700, 1330], [3000, 1480], [2600, 1640], AT_PLACES.boston]} at={go} dur={arrive - go} />}>
      {(S) => {
        const [lx, ly] = S(AT_PLACES.london);
        const [bx, by] = S(AT_PLACES.boston);
        return (
          <>
            <Pin x={lx} y={ly} at={go - 1} />
            {lx < 1700 && <Note text="London" x={lx - 60} y={ly + 30} size={46} rot={-3} at={go + 2} color={WHITE} />}
            <Pin x={bx} y={by} at={arrive} />
            <Note text="Boston" x={bx - 230} y={by - 110} size={56} rot={-3} at={arrive + 1} />
            <Highlight text="MEANWHILE, IN AMERICA" x={110} y={110} size={84} at={t.at('in America')} seed={601} rot={-2} />
            <Note text="the same green, on the same walls" x={120} y={880} size={56} rot={-3} at={t.at('the same green') - 3} color={WHITE} />
            <Tag text="Atlantic Ocean, Black's General Atlas, Edinburgh, 1873 · Library of Congress, Geography and Map Division" />
          </>
        );
      }}
    </AtlanticMap>
  );
};

/** Massachusetts, 1872: a Boston doctor, Frank Draper, and the board of health. */
const Boston: React.FC<{t: TL}> = ({t}) => (
  <Arch src="img/ch06/boston_washington_franklin_sts_1870s.jpg" tag="Washington & Franklin Sts., Boston, 1870s · G. Klucken, Digital Commonwealth · Draper portrait: Burrage, 1923"
    a={t.at('Massachusetts')} b={t.at('His first')} z={[1.04, 1.14]} pos="40% 60%">
    <AbsoluteFill style={{background: 'linear-gradient(rgba(0,0,0,0.55), transparent 35%, transparent 60%, rgba(0,0,0,0.75))'}} />
    <Highlight text="MASSACHUSETTS, 1872" x={110} y={100} size={88} at={t.at('Massachusetts')} seed={603} rot={-2} />
    <Note text="a Boston doctor..." x={130} y={300} size={56} rot={-3} at={t.at('A Boston') - 3} color={WHITE} />
    <PortraitCard name="draper" src="img/ch06/draper_portrait_burrage_1923.jpg" x={1270} y={110} w={500} h={673} a={t.at('Frank Draper')} b={t.at('His first')} at={t.at('Frank Draper') - 1}
      rot={2} fy={0.42} mask={MASKS.draper} traceAt={t.at('Frank Draper') + 5} />
    <Note text="Frank Draper" x={1300} y={810} size={56} rot={-3} at={t.at('Frank Draper') + 2} />
    <Definition term="board of health" def="a government office that tracks disease" at={t.at('board of health')} x={120} y={900} w={1100} />
  </Arch>
);

/** "Everybody knows that arsenic is a deadly poison." */
const FirstLine: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('His first')}>
      <DocWindow src="img/ch06/draper_report_p17_everybody_knows_1872.jpg" x={120} y={150} w={1680} h={560} fx={975} fy={1000} sc={1.0} at={t.at('His first') - 1} rot={-1}
        push={[t.at('His first'), t.at('Bedroom')]} zoom={1.08}
        marks={[{at: t.at('Everybody knows'), to: t.end('deadly poison'), swipe: [[245, 1100, 1515, 1160]]}]} />
      <Note text="his first line:" x={130} y={800} size={58} rot={-3} at={t.at('His first') - 2} color={WHITE} />
      <Note text="then: where it's hiding" x={900} y={850} size={62} rot={-3} at={t.at('shows where') - 3} color={pal.subject} />
      <Tag text={`${DRAPER}, p. 18 · Internet Archive`} />
    </Desk>
  );
};

/** Bedroom walls, paint boxes, candy wrappers in a Boston shop window. */
const Hiding: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('Bedroom')}>
      <Note text="bedroom walls." x={120} y={170} size={60} rot={-3} at={t.at('Bedroom') - 3} color={WHITE} />
      <Note text="children's paint boxes." x={140} y={300} size={56} rot={-3} at={t.at("Children's") - 3} color={WHITE} />
      <Note text="candy wrappers," x={120} y={470} size={60} rot={-3} at={t.at('Candy') - 3} color={pal.subject} />
      <Note text="in a top Boston shop window" x={140} y={580} size={40} rot={-3} at={t.at('window of') - 3} color={WHITE} />
      <DocWindow src="img/ch06/draper_report_p31_boston_confectioner_1872.jpg" x={900} y={150} w={920} h={700} fx={925} fy={2380} sc={0.56} at={t.at('Candy') - 1} rot={1.5}
        push={[t.at('Candy'), t.at('He even')]} zoom={1.05}
        marks={[{at: t.at('window of'), to: t.end("Boston's best shops"), swipe: [[1600, 2260, 1700, 2308], [145, 2328, 1700, 2378], [145, 2396, 535, 2446]]}]} />
      <Tag text={`${DRAPER}, p. 31 · Internet Archive`} />
    </Desk>
  );
};

/** Real samples bound into the report (colour: the pigment itself). */
const Samples: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('real samples');
  return (
    <Desk a={t.at('He even')}>
      <Note text="he even bound real samples" x={120} y={300} size={58} rot={-3} at={t.at('He even') - 2} color={WHITE} />
      <Note text="of the poisoned paper" x={140} y={410} size={58} rot={-3} at={t.at('poisoned paper') - 3} color={WHITE} />
      <Note text="into his report" x={160} y={520} size={58} rot={-3} at={t.at('into his') - 3} color={WHITE} />
      <DropCard src="img/ch06/draper_sample_leaf_n045_1872.jpg" x={1000} y={170} w={300} rot={-5} at={a - 1} filter="contrast(1.03)" />
      <DropCard src="img/ch06/draper_sample_leaf_n052_1872.jpg" x={1240} y={130} w={300} rot={2} at={a + 3} filter="contrast(1.03)" />
      <DropCard src="img/ch06/draper_sample_leaf_n054_1872.jpg" x={1490} y={190} w={300} rot={6} at={a + 7} filter="contrast(1.03)" />
      <Tag text={`Sample leaves bound into ${DRAPER} · Internet Archive`} />
    </Desk>
  );
};

/** So, ban it? */
const BanIt: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('So, ban')}>
      <Highlight text="SO, BAN IT?" x={120} y={110} size={110} at={t.at('ban it')} seed={605} rot={-2} />
      <Note text="some European governments:" x={130} y={360} size={52} rot={-3} at={t.at('Some European') - 3} color={WHITE} />
      <Note text="already restricting these colours" x={150} y={470} size={52} rot={-3} at={t.at('already restricting') - 3} />
      <Note text="Draper: it won't work here" x={130} y={680} size={66} rot={-3} at={t.at("Draper didn't") - 3} color={pal.subject} />
      <DropCard src="img/ch06/draper_portrait_burrage_1923.jpg" x={1360} y={180} w={400} rot={3} at={t.at("Draper didn't") - 1} />
      <Tag text="Frank W. Draper, from Burrage, History of the Massachusetts Medical Society, 1923 · Internet Archive" />
    </Desk>
  );
};

/** "…under a government organized like our own… deemed too sacred." Translation. */
const TooSacred: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('That would')}>
      <DocWindow src="img/ch06/draper_report_p57_too_sacred_1872.jpg" x={110} y={100} w={1700} h={460} fx={930} fy={1170} sc={1.0} at={t.at('That would') - 1} rot={-1}
        push={[t.at('That would'), t.at("That's laissez-faire")]} zoom={1.08}
        marks={[{at: t.at('under a government'), to: t.end('too sacred'), swipe: [[1370, 1085, 1705, 1146], [150, 1152, 1705, 1216], [150, 1222, 1212, 1282]]}]} />
      <Note text={'"difficult," he wrote...'} x={130} y={640} size={52} rot={-3} at={t.at('difficult') - 3} color={WHITE} />
      <Note text="translation:" x={130} y={740} size={52} rot={-3} at={t.at('Translation') - 3} color={WHITE} />
      <Note text="Americans won't let the government" x={170} y={840} size={56} rot={-3} at={t.at('Americans') - 3} />
      <Note text="tell a business what it can't sell" x={190} y={940} size={56} rot={-3} at={t.at('tell a business') - 3} color={pal.subject} />
      <Tag text={`${DRAPER}, p. 57 · Internet Archive`} y={40} />
    </Desk>
  );
};

/** Laissez-faire: leave it alone. "The demand ceasing, the supply will cease." */
const Laissez: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at("That's laissez-faire")}>
      <Highlight text="LAISSEZ-FAIRE" x={120} y={110} size={110} at={t.at('laissez-faire')} seed={607} rot={-2} />
      <Definition term="laissez-faire" def={'French for "leave it alone": the government stays out, and buyers look out for themselves'} at={t.at('laissez-faire') + 9} x={130} y={300} w={1500} />
      <Note text="Draper's advice:" x={130} y={600} size={50} rot={-3} at={t.at('Stop buying') - 3} color={WHITE} />
      <Note text="stop buying it..." x={150} y={700} size={60} rot={-3} at={t.at('Stop buying') + 1} color={pal.subject} />
      <Note text="...and they'll stop making it" x={150} y={810} size={52} rot={-3} at={t.at("they'll stop") - 3} color={pal.subject} />
      <DocWindow src="img/ch06/draper_report_p57_too_sacred_1872.jpg" x={1050} y={620} w={770} h={290} fx={1000} fy={1868} sc={0.66} at={t.at('Stop buying') - 1} rot={1.5}
        marks={[{at: t.at('Stop buying') + 6, to: t.end('making it'), swipe: [[460, 1840, 1545, 1895]]}]} />
      <Tag text={`${DRAPER}, p. 57 · Internet Archive`} />
    </Desk>
  );
};

/** Two years later, in Michigan: Robert Kedzie. */
const Michigan: React.FC<{t: TL}> = ({t}) => (
  <Arch src="img/ch06/mac_view_durant_1880_spread.jpg" tag="Michigan State Agricultural College, lithograph, Durant, 1880 · Kedzie portrait: Beal, 1915 · Internet Archive"
    a={t.at('Two years')} b={t.at('He collected')} z={[1.12, 1.2]} pos="50% 70%">
    <AbsoluteFill style={{background: 'linear-gradient(rgba(0,0,0,0.6), transparent 30%, transparent 55%, rgba(0,0,0,0.8))'}} />
    <Highlight text="MICHIGAN, 1874" x={110} y={100} size={96} at={t.at('in Michigan')} seed={609} rot={-2} />
    <Note text="a chemistry professor" x={130} y={300} size={52} rot={-3} at={t.at('a chemistry') - 3} color={WHITE} />
    <PortraitCard name="kedzie" src="img/ch06/kedzie_portrait_beal_1915.jpg" x={1290} y={100} w={470} h={746} a={t.at('Robert Kedzie')} b={t.at('He collected')} at={t.at('Robert Kedzie') - 1}
      rot={2} fy={0.42} mask={MASKS.kedzie} traceAt={t.at('Robert Kedzie') + 5} />
    <Highlight text="ROBERT KEDZIE" x={110} y={760} size={88} at={t.at('Robert Kedzie')} seed={611} rot={-2} />
    <Note text="let people see it for themselves" x={130} y={910} size={54} rot={-3} at={t.at('see it') - 3} />
  </Arch>
);

/** Emma's green bedroom. */
const Emma: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Sil name="g_emma" file="ch06_emma_bedroom.jpg" label="Emma's green bedroom (a case in Kedzie, 1874)" a={t.at('He collected')} b={t.at('And in a')} fx={0.5} fy={0.55} z={[1.04, 1.12]}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(transparent 52%, rgba(0,0,0,0.78))'}} />
          <Note text="he collected cases." x={110} y={640} size={46} rot={-3} at={t.at('He collected') - 2} color={WHITE} />
          <Note text="Emma, 9: sick in her" x={120} y={730} size={50} rot={-3} at={t.at('Emma') - 3} color={WHITE} />
          <Note text="green bedroom" x={140} y={815} size={50} rot={-3} at={t.at('green bedroom') - 3} color={WHITE} />
          <Note text="moved out: got better" x={130} y={920} size={54} rot={-3} at={t.at('got better') - 3} color={pal.subject} />
        </>
      )}
    </Sil>
  );
};

/** Spring Port, and the girl from the first page (the book's first specimen leaf). */
const SpringPort: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const map = 'img/ch06/springport_township_map_1874.jpg';
  const [mw, mh] = sizeOf(map);
  const w = 560, x = 140, y = 90, pad = Math.max(8, w * 0.03);
  const sc = (w - 0) / mw;
  const at = t.at('And in a');
  return (
    <Desk a={at}>
      <DropCard src={map} x={x} y={y} w={w} rot={0} at={at - 1} />
      <Loop cx={x + pad + 1270 * sc * ((w - 2 * pad) / w)} cy={y + pad + 2690 * sc * ((w - 2 * pad) / w)} rx={70} ry={40} at={t.at('Spring Port') + 2} seed={613} tilt={-4} />
      <Note text="Spring Port, Michigan" x={130} y={y + mh * sc + 40} size={50} rot={-3} at={t.at('Spring Port') - 3} color={WHITE} />
      <DropCard src="img/ch01/kedzie_specimen_n018_first_leaf_spring_port.jpg" x={1160} y={80} w={560} rot={3} at={t.at('the girl from') - 1} filter="contrast(1.04)" />
      <Note text="page one" x={850} y={330} size={60} rot={-4} at={t.at('first page') - 3} color={WHITE} />
      <Note text="green in nearly every room" x={150} y={910} size={54} rot={-3} at={t.at('nearly every') - 3} color={pal.subject} />
      <Tag text={`Springport Twp., Atlas of Jackson County, 1874 · Kedzie's first specimen leaf, 1874 · ${NLM}`} />
    </Desk>
  );
};

/** Kedzie goes shopping and tests every sheet: all 86. */
const Shopping: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Sil name="g_chemist" file="ch06_chemist_testing.jpg" label="Kedzie tests the wallpapers, 1874" a={t.at('So Kedzie')} b={t.at('Then he bound')} fx={0.5} fy={0.5} z={[1.04, 1.12]}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.78), rgba(0,0,0,0.5) 38%, transparent 58%)'}} />
          <Note text="so Kedzie went shopping" x={110} y={110} size={56} rot={-3} at={t.at('So Kedzie') - 2} color={WHITE} />
          <Note text="wallpaper from ordinary stores" x={120} y={220} size={48} rot={-3} at={t.at('ordinary stores') - 3} color={WHITE} />
          <Note text="tested every sheet himself" x={120} y={320} size={52} rot={-3} at={t.at('tested every') - 3} />
          <Stamp text="ALL 86" x={110} y={470} at={t.at('All 86')} size={190} color="#EDE7DC" rot={-3} />
          <Note text="had arsenic." x={140} y={720} size={78} rot={-3} at={t.at('had arsenic') - 3} color={pal.subject} />
        </>
      )}
    </Sil>
  );
};

/** Then he bound them into a book and mailed it to the libraries. This book. */
const TheBook: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('Then he bound')}>
    <DropCard src="img/ch01/kedzie_cover_green_label_crop_1874.jpg" x={840} y={80} w={680} rot={-2} at={t.at('Then he bound') - 1} filter="contrast(1.04)" />
    <Note text="bound into a book..." x={110} y={300} size={52} rot={-3} at={t.at('into a book') - 3} color={WHITE} />
    <Note text="...mailed to the libraries" x={110} y={420} size={48} rot={-3} at={t.at('mailed it') - 3} color={WHITE} />
    <Highlight text="THIS BOOK." x={880} y={880} size={110} at={t.at('This book.')} seed={615} rot={-2} />
    <Tag text={`Kedzie, Shadows from the Walls of Death, 1874: cover label (itself arsenical paper) · ${NLM}`} y={40} />
  </Desk>
);

/** "Shall we poison our homes?" */
const Headline: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('His headline')}>
    <DocWindow src="img/ch06/kedzie_essay_p1_shall_we_poison_crop_1874.jpg" x={260} y={110} w={1400} h={620} fx={1190} fy={1010} sc={0.95} at={t.at('His headline') - 1} rot={-1}
      push={[t.at('His headline'), t.at('homes') + 40]} zoom={1.12}
      marks={[{at: t.at('Shall we poison'), to: t.end('homes'), swipe: [[700, 1098, 1680, 1148]]}]} />
    <Note text="his headline was a question:" x={300} y={830} size={60} rot={-3} at={t.at('His headline') - 2} color={WHITE} />
    <Tag text={`Kedzie, "Arsenical Wall Paper," 1874, p. 1 · ${NLM}`} />
  </Desk>
);

export const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Atlantic t={t} />],
    [at('Massachusetts') - 1, <Boston t={t} />],
    [at('His first') - 1, <FirstLine t={t} />],
    [at('Bedroom') - 1, <Hiding t={t} />],
    [at('He even') - 1, <Samples t={t} />],
    [at('So, ban') - 1, <BanIt t={t} />],
    [at('That would') - 1, <TooSacred t={t} />],
    [at("That's laissez-faire") - 1, <Laissez t={t} />],
    [at('Two years') - 1, <Michigan t={t} />],
    [at('He collected') - 1, <Emma t={t} />],
    [at('And in a') - 1, <SpringPort t={t} />],
    [at('So Kedzie') - 1, <Shopping t={t} />],
    [at('Then he bound') - 1, <TheBook t={t} />],
    [at('His headline') - 1, <Headline t={t} />],
  ];
  // note frames (the marker sound plays 2 frames before each; Sounds subtracts 3)
  const notes = [
    at('Meanwhile') + 2, at('was on the') + 1, at('the same green') - 3,
    at('A Boston') - 3, at('Frank Draper') + 2,
    at('His first') - 2, at('shows where') - 3,
    at('Bedroom') - 3, at("Children's") - 3, at('Candy') - 3, at('window of') - 3,
    at('He even') - 2, at('poisoned paper') - 3, at('into his') - 3,
    at('Some European') - 3, at('already restricting') - 3, at("Draper didn't") - 3,
    at('difficult') - 3, at('Translation') - 3, at('Americans') - 3, at('tell a business') - 3,
    at('Stop buying') - 3, at('Stop buying') + 1, at("they'll stop") - 3,
    at('a chemistry') - 3, at('see it') - 3,
    at('He collected') - 2, at('Emma') - 3, at('green bedroom') - 3, at('got better') - 3,
    at('Spring Port') - 3, at('first page') - 3, at('nearly every') - 3,
    at('So Kedzie') - 2, at('ordinary stores') - 3, at('tested every') - 3, at('had arsenic') - 3,
    at('into a book') - 3, at('mailed it') - 3, at('His headline') - 2,
  ];
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map((c) => c[0])}
        stamps={[at('in America'), at('Massachusetts'), at('ban it'), at('laissez-faire'), at('in Michigan'), at('Robert Kedzie'), at('This book.')]}
        booms={[at('All 86')]}
        writes={notes.map((f) => f + 1)}
        ticks={[at('Meanwhile') - 1, at('was on the'), at('real samples') - 1, at('real samples') + 3, at('real samples') + 7]}
        extra={[{at: at('Then he bound'), src: 'sfx/page_turn.wav', volume: 0.35}]} />
    </>
  );
};

export const Ch06: React.FC = () => {
  const t = makeTimeline(N, 30);
  const mi = t.at('Two years');
  return (
    <ChapterShell n={N} audio="audio/ch06_poison_our_homes.wav" lead={LEAD}
      music={[{src: 'music/g_grip.mp3', volume: 0.2, to: mi, fadeOut: 20}, {src: 'music/j_cold_open.mp3', volume: 0.26, from: mi - 6}]}>
      <Body />
    </ChapterShell>
  );
};
