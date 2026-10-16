// Chapter 5 · Witch Fever: why the walls didn't stop being green. Three reasons (messy evidence, the dust-vs-gas
// argument, money), Napoleon's wallpaper, William Morris, his mine and his 1885 "witch-fever" letter, and two readings.
import React from 'react';
import {interpolate, random} from 'remotion';
import words from '../../public/audio/ch05_witch_fever.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, onScreen, Photo, Stamp, type TL, useScene} from '../kit/shell';
import {Desk, DropCard, LOOK, Sounds, SyncQuote} from '../kit/bs';
import {Parallax} from '../kit/parallax';
import {smooth} from '../kit/map';
import {Doc, type DocMark, Sil, sizeOf} from '../kit/dk';
import type {MaskRef} from '../kit/maskref';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH05_FRAMES = chapterFrames(N, LEAD);

const WHITE = '#ffffff';
const ORANGE = '#FF9F1C';
const BONE = '#EDE7DC';

// ---------------------------------------------------------------------------------------------
// Helpers (chapter-local)

/** "1/3" reason counter, top-left, mono. */
const Counter: React.FC<{n: number; at?: number}> = ({n, at = -999}) => {
  const g = useGFrame();
  if (g < at) return null;
  return (
    <div style={{position: 'absolute', left: 64, top: 40, fontFamily: JF.mono, fontSize: 34, letterSpacing: 2, color: WHITE, textShadow: '0 2px 8px rgba(0,0,0,0.9)'}}>
      {n}<span style={{opacity: 0.55}}>/3</span>
    </div>
  );
};

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

/** A hand-drawn stroke in screen pixels (points smoothed), drawn on from `at` over `dur`. */
const Stroke: React.FC<{pts: number[][]; at: number; dur?: number; color?: string; width?: number; dash?: string; closed?: boolean; seed?: string}> = ({
  pts, at, dur = 10, color, width = 5, dash, closed, seed = 's',
}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  const jit = pts.map(([x, y], i) => [x + (random(`${seed}x${i}`) - 0.5) * 3, y + (random(`${seed}y${i}`) - 0.5) * 3]);
  const d = smooth(closed ? [...jit, jit[0]] : jit);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <path d={d} fill="none" stroke={color ?? pal.mark} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"
        pathLength={dash ? undefined : 1} strokeDasharray={dash ?? 1} strokeDashoffset={dash ? undefined : 1 - p}
        style={dash ? {clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`} : undefined} />
    </svg>
  );
};

// ---------------------------------------------------------------------------------------------
// Scenes

/** "So if doctors were finding arsenic in the walls, why didn't it stop?" (callback: the doctor at the wall) */
const Why: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Sil name="g_doctor" file="ch04_limehouse_room.jpg" label="a doctor at the green walls, London, 1862" a={0} b={t.at('One:') + 10} fx={0.55} fy={0.5} z={[1.03, 1.12]}>
      {() => (
        <>
          <div style={{position: 'absolute', left: 0, top: 700, width: 1920, height: 380, background: 'linear-gradient(transparent, rgba(0,0,0,0.6))'}} />
          <Note text="doctors kept finding arsenic in the walls..." x={100} y={780} size={50} rot={-3} at={t.at('doctors were finding') - 3} color={WHITE} />
          <Note text="so why didn't it stop?" x={120} y={880} size={62} rot={-3} at={t.at('why') - 3} color={pal.subject} />
          <Highlight text="THREE REASONS" x={110} y={110} size={92} at={t.at('Three reasons')} seed={501} rot={-2} />
        </>
      )}
    </Sil>
  );
};

/** One: the evidence was messy. */
const Messy: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('One:')}>
      <Counter n={1} />
      <Highlight text="MESSY EVIDENCE" x={110} y={110} size={92} at={t.at('messy')} seed={503} rot={-2} />
      <DropCard src="img/ch02/green_wallpaper_ivy_england_1840s_ch.jpg" x={130} y={330} w={600} rot={-3} at={t.at('green wallpaper') - 1} filter="contrast(1.05)" />
      <Note text="lived with it. felt fine." x={150} y={800} size={56} rot={-3} at={t.at('felt fine') - 3} color={WHITE} />
      <Note text="arsenic poisoning looks like..." x={900} y={330} size={46} rot={-3} at={t.at('looks like') - 3} />
      <Note text="stomach trouble?" x={960} y={440} size={48} rot={-2} at={t.at('lot of') - 3} color={WHITE} />
      <Note text="headaches?" x={1010} y={530} size={48} rot={-4} at={t.at('other illnesses') - 3} color={WHITE} />
      <Note text="just run down?" x={970} y={620} size={48} rot={-2} at={t.at('illnesses') + 4} color={WHITE} />
      <Note text="every case could be argued." x={900} y={790} size={56} rot={-3} at={t.at('every case') - 3} color={pal.subject} />
      <Tag text="Sidewall, England, 1840s: ivy in five greens · Cooper Hewitt, Smithsonian Design Museum" />
    </Desk>
  );
};

/** Two: nobody agreed HOW a wall poisons you. Theory one: a gas from mould. */
const How: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('Two:')}>
    <Counter n={2} />
    <Highlight text="HOW DOES A WALL POISON YOU?" x={100} y={110} size={78} at={t.at('how')} seed={505} rot={-2} />
    <DropCard src="img/ch05/cooke_1872_plate12_paper_moulds.jpg" x={1270} y={280} w={380} rot={3} at={t.at('One theory') - 1} />
    <Note text="moulds on damp paper, 1872" x={1200} y={965} size={36} rot={-2} at={t.at('mold') - 2} color={WHITE} />
    <Note text="theory one:" x={130} y={360} size={52} rot={-3} at={t.at('One theory') - 3} color={WHITE} />
    <Note text="a garlic-smelling gas" x={150} y={470} size={66} rot={-3} at={t.at('garlic-smelling') - 3} color={ORANGE} />
    <Note text="from mould on damp walls" x={170} y={600} size={56} rot={-3} at={t.at('from mold') - 3} color={ORANGE} />
    <Arrow x1={1000} y1={720} x2={1230} y2={600} bow={-30} at={t.at('damp walls') + 2} />
    <Tag text="M. C. Cooke, Rust, Smut, Mildew & Mould (1872), plate XII · Internet Archive" />
  </Desk>
);

/** Falling dust flakes along the wall face from `at`: `loop` keeps them falling (a steady shed); a small pile grows on the floor. */
const Dust: React.FC<{x0: number; x1: number; y0: number; y1: number; floor: number; at: number; n: number; seed: string; rate?: number; loop?: number; pile?: number}> = ({
  x0, x1, y0, y1, floor, at, n, seed, rate = 1.6, loop, pile = 0,
}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const flake = (key: string, x: number, y: number, s: number, r: number, h: number) => (
    <div key={key} style={{position: 'absolute', left: x, top: y, width: s, height: s * h, background: pal.subject, transform: `rotate(${r}deg)`, boxShadow: '0 0 0 1.5px #111', borderRadius: 2}} />
  );
  const piled = Math.min(pile, Math.floor((g - at) / 3));
  return (
    <>
      {Array.from({length: n}).map((_, i) => {
        const born = at + i * rate;
        if (g < born) return null;
        const age = loop ? (g - born) % loop : g - born;
        const sy = y0 + random(`${seed}y${i}`) * (y1 - y0);
        const vy = 3 + random(`${seed}v${i}`) * 3;
        const y = sy + age * vy + age * age * 0.03;
        if (y > floor - 6) return null;
        const x = x0 + random(`${seed}x${i}`) * (x1 - x0) + Math.sin(age * 0.22 + i) * 7 + Math.min(age, 24) * (0.9 + random(`${seed}d${i}`) * 1.3);
        return flake(`f${i}`, x, y, 7 + random(`${seed}s${i}`) * 8, random(`${seed}r${i}`) * 90 + age * 7, 0.6 + random(`${seed}h${i}`) * 0.5);
      })}
      {Array.from({length: piled}).map((_, i) => flake(`p${i}`, x1 + random(`${seed}px${i}`) * 90 * (1 - i / (pile * 1.4)), floor - 8 - random(`${seed}py${i}`) * 4 - (i / pile) * 14,
        6 + random(`${seed}ps${i}`) * 6, random(`${seed}pr${i}`) * 90, 0.6))}
    </>
  );
};

/** The drawn diagram: the wall; the gas (struck out); dust; a child's hand; the mouth. */
const Diagram: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('That gas');
  const weak = t.at('pretty weak');
  const dust = t.at('flaked off');
  const brush = t.at('brushed past');
  const touch = t.at('child touched');
  const mouth = t.at('in their mouth');
  // wall panel (screen px)
  const W = {x0: 150, x1: 430, y0: 200, y1: 880};
  const lattice: number[][][] = [];
  for (let i = 0; i < 6; i++) lattice.push([[W.x0, W.y0 + i * 130], [W.x1, W.y0 + i * 130 + 120]]);
  for (let i = 0; i < 6; i++) lattice.push([[W.x1, W.y0 + i * 130], [W.x0, W.y0 + i * 130 + 120]]);
  const wisp = (i: number) => {
    const bx = 455 + i * 55;
    return Array.from({length: 7}, (_, k) => [bx + Math.sin(k * 1.3 + i) * 24 + k * 22, 470 - k * 50]);
  };
  // a child's hand, open, fingers up (local 0..200 x 0..250)
  const hand = [[70, 250], [64, 160], [36, 128], [22, 104], [34, 94], [72, 126], [72, 48], [82, 34], [94, 46], [96, 116], [100, 30], [112, 18], [124, 30], [122, 112],
    [128, 40], [140, 32], [150, 44], [146, 118], [154, 70], [164, 62], [172, 72], [164, 150], [150, 196], [142, 250]];
  const HX = 1000, HY = 560, HS = 1.2;
  const handPts = hand.map(([x, y]) => [HX + x * HS, HY + y * HS]);
  // a child's head in profile, facing left (local 0..200 x 0..270)
  const head = [[150, 270], [168, 200], [172, 120], [150, 50], [100, 18], [52, 30], [26, 76], [24, 112], [8, 136], [24, 148], [22, 166], [34, 176], [22, 186], [30, 214], [60, 232], [84, 238], [86, 272]];
  const FX = 1400, FY = 380, FS = 1.45;
  const headPts = head.map(([x, y]) => [FX + x * FS, FY + y * FS]);
  const strike = interpolate(g, [weak, weak + 5], [0, 1], clamp);
  return (
    <Desk a={a}>
      <Counter n={2} />
      {/* the wall */}
      <Stroke pts={[[W.x0, W.y0], [W.x1, W.y0], [W.x1, W.y1], [W.x0, W.y1]]} closed at={a - 1} dur={8} width={6} seed="wall" />
      {g >= a + 6 && lattice.map((l, i) => <Stroke key={i} pts={l} at={a + 6 + i} dur={4} width={2.5} color="rgba(47,224,196,0.45)" seed={`lat${i}`} />)}
      <Stroke pts={[[90, 880], [1860, 880]]} at={a + 2} dur={8} width={4} color="rgba(237,231,220,0.55)" seed="floor" />
      <Note text="the wall" x={170} y={90} size={44} rot={-3} at={a + 2} color={WHITE} />
      {/* the gas theory: wisps rising, then struck out */}
      {[0, 1, 2].map((i) => <Stroke key={`w${i}`} pts={wisp(i)} at={a + 4 + i * 3} dur={10} width={4} dash="14 12" color="rgba(237,231,220,0.75)" seed={`wisp${i}`} />)}
      <Note text="gas from mould?" x={760} y={150} size={56} rot={-3} at={t.at('gas is real') - 3} color={ORANGE} />
      <Note text="real, but pretty weak" x={800} y={260} size={46} rot={-3} at={weak - 3} color={WHITE} />
      {strike > 0 && <div style={{position: 'absolute', left: 440, top: 300, height: 9, borderRadius: 5, background: ORANGE, width: 760 * strike, transform: 'rotate(-17deg)', transformOrigin: 'left center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.5)'}} />}
      {/* the dust */}
      <Dust x0={W.x1 - 8} x1={W.x1 + 4} y0={W.y0 + 40} y1={W.y1 - 160} floor={W.y1} at={dust} n={26} seed="d1" rate={2.4} loop={64} pile={40} />
      <Dust x0={W.x1 - 6} x1={W.x1 + 6} y0={430} y1={560} floor={W.y1} at={brush + 4} n={24} seed="d2" rate={0.6} />
      <Highlight text="DUST" x={560} y={560} size={88} at={t.at('as dust')} seed={507} rot={-3} />
      <Note text="every brush past the wall" x={480} y={720} size={42} rot={-3} at={brush - 3} color={WHITE} />
      {/* the hand, then the mouth */}
      <Arrow x1={560} y1={850} x2={990} y2={800} bow={30} at={touch - 1} />
      <Stroke pts={handPts} at={touch} dur={12} width={6} seed="hand" />
      <Note text="a child's hand" x={1000} y={890} size={46} rot={-3} at={touch + 2} color={WHITE} />
      <Stroke pts={headPts} at={t.at('then put') - 2} dur={12} width={6} seed="head" />
      {g >= t.at('then put') + 8 && <div style={{position: 'absolute', left: FX + 70 * FS - 7, top: FY + 104 * FS - 7, width: 14, height: 14, borderRadius: '50%', background: pal.mark}} />}
      <Arrow x1={1200} y1={600} x2={1400} y2={628} bow={-30} at={mouth - 2} />
      <Loop cx={FX + 26 * FS} cy={FY + 176 * FS} rx={46} ry={40} at={t.at('mouth') + 1} seed={509} color={pal.subject} />
      <Note text="into the mouth" x={1340} y={800} size={56} rot={-3} at={t.at('mouth') - 2} color={pal.subject} />
    </Desk>
  );
};

/** "It was coming off them." The torn green fragment (real colour). */
const OffTheWall: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('That means')}>
    <DropCard src="img/ch02/green_wallpaper_fragment_usa_c1850_ch.jpg" x={340} y={100} w={1240} rot={-2} at={t.at('That means') - 1} filter="contrast(1.05)" />
    <Note text="not just sitting in the walls..." x={150} y={770} size={58} rot={-3} at={t.at('sitting in') - 3} color={WHITE} />
    <Highlight text="IT WAS COMING OFF THEM" x={130} y={890} size={96} at={t.at('coming off')} seed={511} rot={-2} />
    <Tag text="Sidewall fragments, USA, c. 1850 · Cooper Hewitt, Smithsonian Design Museum" y={40} />
  </Desk>
);

/** Napoleon's wallpaper: true, and not what killed him. */
const Napoleon: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const src = 'img/ch05/death_of_napoleon_steuben_lithograph.jpg';
  return (
    <Photo src={src} size={sizeOf(src)} fx={1500} fy={1150} z0={1.12} z1={1.22} a={t.at('You might')} b={t.at('Three:', 2)} bw="grayscale(1) contrast(1.3) brightness(0.95)">
      {(p) => {
        const S = onScreen(p);
        const [hx, hy] = S(1235, 985);
        return (
          <>
            <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 330, background: 'linear-gradient(rgba(0,0,0,0.75), transparent)'}} />
            <div style={{position: 'absolute', left: 0, top: 760, width: 1920, height: 320, background: 'linear-gradient(transparent, rgba(0,0,0,0.75))'}} />
            <Note text="wallpaper killed Napoleon?" x={110} y={90} size={62} rot={-3} at={t.at('wallpaper killed') - 3} color={ORANGE} />
            <Loop cx={hx} cy={hy} rx={150} ry={110} at={t.at('Napoleon') + 2} seed={513} tilt={-6} />
            <Note text="his wallpaper: yes, arsenic in it" x={110} y={830} size={54} rot={-3} at={t.at('really did') - 3} color={WHITE} />
            <Stamp text="MYTH" x={1300} y={90} at={t.at("didn't kill")} size={150} color={ORANGE} rot={-6} />
            <Note text="stomach cancer did." x={1150} y={880} size={66} rot={-3} at={t.at('Stomach') - 3} color={pal.subject} />
            <Tag text="The death of Napoleon, St Helena, 1821 · lithograph after Steuben · Wellcome Collection" x={44} y={1030} />
          </>
        );
      }}
    </Photo>
  );
};

/** Three: money. */
const Money: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('Three:', 2)}>
    <Counter n={3} />
    <Highlight text="MONEY" x={110} y={110} size={110} at={t.at('money')} seed={515} rot={-2} />
    <Note text="one manufacturer went through about..." x={130} y={330} size={56} rot={-3} at={t.at('One manufacturer') - 3} color={WHITE} />
    <Stamp text="2 TONS" x={130} y={440} at={t.at('two tons')} size={240} color={BONE} rot={-3} />
    <Stamp text="OF ARSENIC" x={1190} y={470} at={t.at('of arsenic')} size={80} color={BONE} rot={-3} />
    <Stamp text="A WEEK" x={1190} y={580} at={t.at('a week')} size={130} color="#FF6F61" rot={-3} />
  </Desk>
);

/** William Morris. */
const Morris: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('Which brings')}>
    <PortraitCard name="morris" src="img/ch05/william_morris_hollyer_c1887.jpg" x={150} y={120} w={640} h={800} a={t.at('Which brings')} b={t.at('copper mine') + 20} at={t.at('Which brings') - 1}
      rot={-2} fy={0.42} mask={MASKS.morris} traceAt={t.at('William Morris') + 4} />
    <Highlight text="WILLIAM MORRIS" x={880} y={130} size={104} at={t.at('William Morris')} seed={517} rot={-2} />
    <Note text="probably the most famous" x={900} y={340} size={50} rot={-3} at={t.at('most famous') - 3} color={WHITE} />
    <Note text="designer of his day" x={930} y={430} size={50} rot={-3} at={t.at('designer of') - 3} color={WHITE} />
    <Note text="his family's fortune came from..." x={900} y={620} size={48} rot={-3} at={t.at("family's fortune") - 3} />
    <Tag text="William Morris, photograph by Frederick Hollyer, c. 1887 · Wikimedia Commons" />
  </Desk>
);

/** The family mine: "the largest arsenic producers". The board, 1871-1875. */
const Mine: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const src = 'img/ch05/mining_journal_1876-12-09_devon_great_consols_arsenic_letters.jpg';
  return (
    <Desk a={t.at('copper mine')}>
      <DocWindow src={src} x={110} y={110} w={1060} h={470} fx={2240} fy={1305} sc={0.9} at={t.at('copper mine') - 1} rot={-1.5}
        push={[t.at('copper mine'), t.at('His early')]} zoom={1.12}
        marks={[{at: t.at('biggest arsenic'), to: t.end('producers'), swipe: [[1993, 1288, 2495, 1323]]}]} />
      <Note text="a copper mine..." x={130} y={640} size={56} rot={-3} at={t.at('copper mine') + 2} color={WHITE} />
      <Note text="...one of the biggest arsenic producers" x={150} y={740} size={46} rot={-3} at={t.at('biggest arsenic') - 3} />
      <DropCard src="img/ch05/arsenic_furnace_encyclopedie_goussier.jpg" x={1300} y={90} w={470} rot={3} at={t.at('in the world') - 1} filter={LOOK.bw} />
      <Highlight text="1871–1875" x={140} y={860} size={84} at={t.at('1871')} seed={519} rot={-2} />
      <Note text="Morris sits on its board" x={720} y={880} size={58} rot={-3} at={t.at('sat on') - 3} color={pal.subject} />
      <Tag text="Mining Journal, 9 Dec. 1876 · Internet Archive · Arsenic furnace, Encyclopédie plate, 18th c. · Wellcome Collection" />
    </Desk>
  );
};

/** His early wallpapers (Trellis, real colour), and the 1885 letter. */
const Trellis: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('His early')}>
      <DropCard src="img/ch05/morris_trellis_wallpaper_1864_met.jpg" x={1150} y={80} w={600} rot={2} at={t.at('His early') - 1} filter="contrast(1.04)" />
      <Note text="his early wallpapers:" x={130} y={180} size={56} rot={-3} at={t.at('His early') - 2} color={WHITE} />
      <Note text="arsenic green." x={160} y={290} size={70} rot={-3} at={t.at('arsenic green', 2) - 3} color={pal.subject} />
      <Highlight text="1885" x={130} y={540} size={120} at={t.at('1885,')} seed={521} rot={-2} />
      <Note text="Morris writes to a colleague:" x={140} y={740} size={56} rot={-3} at={t.at('wrote to') - 3} color={WHITE} />
      <Tag text="'Trellis' wallpaper, Morris & Co., designed 1862 · The Metropolitan Museum of Art" />
    </Desk>
  );
};

const QUOTE = 'As to the arsenic scare a greater folly it is hardly possible to imagine: the doctors were bitten as people were bitten by the witch-fever.';

/** The letter, word by word; then the term. */
const Letter: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const g = useGFrame();
  const who = t.at('As to the') + 8;
  return (
    <Desk a={t.at('As to the')}>
      <SyncQuote t={t} phrase={QUOTE} x={140} y={130} w={1640} size={62} marks={{7: pal.mark, 24: pal.subject}} />
      {g >= who && <div style={{position: 'absolute', left: 140, top: 560, fontFamily: JF.mono, fontSize: 24, letterSpacing: 2, color: 'rgba(244,239,230,0.8)',
        opacity: interpolate(g, [who, who + 6], [0, 1], clamp)}}>WILLIAM MORRIS TO THOMAS WARDLE, 3 OCT. 1885</div>}
      <Highlight text="WITCH FEVER" x={140} y={700} size={100} at={t.at('Witch fever.')} seed={523} rot={-2} />
      <Definition term="witch fever" def="a panic, like the old witch hunts" at={t.at('Witch fever.') + 9} x={150} y={880} w={1400} />
    </Desk>
  );
};

/** His own theory: the toilets. */
const Toilets: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('His own')}>
      <DropCard src="img/ch05/doulton_lambeth_combination_closet_ad_1884.jpg" x={240} y={90} w={540} rot={-3} at={t.at('His own') - 1} filter={LOOK.doc} />
      <Note text="his own theory?" x={900} y={300} size={62} rot={-3} at={t.at('His own') - 2} color={WHITE} />
      <Note text="the toilets." x={940} y={440} size={110} rot={-4} at={t.at('the toilets') - 3} color={pal.subject} />
      <Tag text="Doulton & Co. advertisement, 1884 (Hints to Househunters) · Internet Archive" />
    </Desk>
  );
};

/** To be fair / to his critics. */
const TwoViews: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const g = useGFrame();
  const right = t.at('To his critics');
  return (
    <Desk a={t.at('To be fair')}>
      <div style={{position: 'absolute', left: 958, top: 110, width: 4, height: 860, background: 'rgba(244,239,230,0.55)'}} />
      <div style={{position: 'absolute', left: 140, top: 150, fontFamily: JF.mono, fontSize: 32, letterSpacing: 4, color: pal.mark}}>TO BE FAIR</div>
      {g >= right && <div style={{position: 'absolute', left: 1040, top: 150, fontFamily: JF.mono, fontSize: 32, letterSpacing: 4, color: pal.subject}}>TO HIS CRITICS</div>}
      <Note text="his company had stopped" x={140} y={270} size={48} rot={-3} at={t.at('his company') - 3} />
      <Note text="using arsenic years earlier" x={160} y={365} size={48} rot={-3} at={t.at('using arsenic') - 3} />
      <Note text="and the science really" x={140} y={540} size={48} rot={-3} at={t.at('the science') - 3} />
      <Note text="was disputed" x={160} y={635} size={48} rot={-3} at={t.at('was disputed') - 3} />
      <Note text="a fortune that came" x={1040} y={270} size={48} rot={-3} at={t.at('whose fortune') - 3} color={pal.subject} />
      <Note text="out of that mine..." x={1060} y={365} size={48} rot={-3} at={t.at('out of that') - 3} color={pal.subject} />
      <Note text="...calling the danger" x={1040} y={540} size={48} rot={-3} at={t.at('calling the') - 3} color={pal.subject} />
      <Highlight text="A PANIC" x={1060} y={660} size={100} at={t.at('a panic.', 2)} seed={525} rot={-2} />
    </Desk>
  );
};

export const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Why t={t} />],
    [at('One:') - 1, <Messy t={t} />],
    [at('Two:') - 1, <How t={t} />],
    [at('That gas') - 1, <Diagram t={t} />],
    [at('That means') - 1, <OffTheWall t={t} />],
    [at('You might') - 1, <Napoleon t={t} />],
    [at('Three:', 2) - 1, <Money t={t} />],
    [at('Which brings') - 1, <Morris t={t} />],
    [at('copper mine') - 1, <Mine t={t} />],
    [at('His early') - 1, <Trellis t={t} />],
    [at('As to the') - 1, <Letter t={t} />],
    [at('His own') - 1, <Toilets t={t} />],
    [at('To be fair') - 1, <TwoViews t={t} />],
  ];
  // the marker sound plays 2 frames before each note (Sounds subtracts 3 from each frame given)
  const notes = [
    at('doctors were finding') - 3, at('why') - 3,
    at('felt fine') - 3, at('looks like') - 3, at('lot of') - 3, at('other illnesses') - 3, at('illnesses') + 4, at('every case') - 3,
    at('mold') - 2, at('One theory') - 3, at('garlic-smelling') - 3, at('from mold') - 3,
    at('That gas') + 2, at('gas is real') - 3, at('pretty weak') - 3, at('brushed past') - 3, at('child touched') + 2, at('mouth') - 2,
    at('sitting in') - 3, at('wallpaper killed') - 3, at('really did') - 3, at('Stomach') - 3, at('One manufacturer') - 3,
    at('most famous') - 3, at('designer of') - 3, at("family's fortune") - 3, at('copper mine') + 2, at('biggest arsenic') - 3, at('sat on') - 3,
    at('His early') - 2, at('arsenic green', 2) - 3, at('wrote to') - 3, at('His own') - 2, at('the toilets') - 3,
    at('his company') - 3, at('using arsenic') - 3, at('the science') - 3, at('was disputed') - 3, at('whose fortune') - 3, at('out of that') - 3, at('calling the') - 3,
  ];
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map((c) => c[0])}
        stamps={[at('Three reasons'), at('messy'), at('how'), at('as dust'), at('coming off'), at('money'), at('William Morris'), at('1871'), at('1885,'), at('Witch fever.'), at('a panic.', 2)]}
        booms={[at("didn't kill"), at('two tons'), at('a week')]}
        writes={notes.map((f) => f + 1)}
        ticks={[at('a week') - 6]}
        extra={[{at: at('As to the'), src: 'sfx/quill.wav', volume: 0.3}]} />
    </>
  );
};

export const Ch05: React.FC = () => {
  const t = makeTimeline(N, 30);
  const morris = t.at('Which brings');
  return (
    <ChapterShell n={N} audio="audio/ch05_witch_fever.wav" lead={LEAD}
      music={[{src: 'music/r_cold_open.mp3', volume: 0.14, to: morris, fadeOut: 20}, {src: 'music/j_intrigue.mp3', volume: 0.17, from: morris - 6}]}>
      <Body />
    </ChapterShell>
  );
};
