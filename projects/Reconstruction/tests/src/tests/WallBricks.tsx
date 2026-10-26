// The chunk wall, take two: every chunk is a block *in* the wall. The wall is courses of chamfered blocks (the brand's
// "chunks" pattern); a chunk is one of those blocks, the same height and shape, with its picture and words on its face.
// Empty blocks wait for chunks still to come. Strings run along the mortar lines.
//   Brick-E1     the wall at the end of Episode 1
//   Brick-Land   close-up: a chunk sliding into its gap, the "therefore" string drawing along the mortar
//   Brick-End    the whole wall at the end of the series: LAW whole, LAND cracked, PROTECTION knocked out
import React from 'react';
import {AbsoluteFill, Img, random, staticFile} from 'remotion';
import {Highlight, Tag} from '../kit/Kit';
import {TestFrame} from './common';

const TEAL = '#2FE0C4';
const CORAL = '#FF6F61';
const CREAM = '#f4efe6';
const DISPLAY = '"Abril Fatface", serif';
const MONO = '"IBM Plex Mono", monospace';
const HAND = '"Nanum Pen Script", cursive';
const QUOTE = '"Playfair Display", serif';

const EMPTY = '#1b2a28';      // an empty block: the brand pattern's dark teal, dimmed
const EMPTY_CORAL = '#2a1d1b';
const FACE = '#22302d';       // a chunk's face: the same stone, lit

type Chunk = {
  id: string; label: string; year?: string; img?: string; fit?: string; doc?: string;
  tone?: 'teal' | 'coral' | 'cream' | 'head'; state?: 'whole' | 'cracked' | 'gone' | 'dim'; small?: boolean;
};
type Placed = Chunk & {course: number; x: number; w: number; out?: number; dx?: number};

const chamfer = (k: number) => `polygon(${k}px 0, calc(100% - ${k}px) 0, 100% ${k}px, 100% calc(100% - ${k}px), calc(100% - ${k}px) 100%, ${k}px 100%, 0 calc(100% - ${k}px), 0 ${k}px)`;

type Wall = {x0: number; x1: number; y0: number; course: number; mortar: number; courses: number; unit: number; seed: string};

/** Fill each course with empty blocks around the placed chunks, staggered course to course. */
const layout = (wall: Wall, chunks: Placed[]) => {
  const empties: {course: number; x: number; w: number; coral: boolean}[] = [];
  for (let c = 0; c < wall.courses; c++) {
    const taken = chunks.filter((k) => k.course === c).map((k) => [k.x - wall.mortar, k.x + k.w + wall.mortar]).sort((a, b) => a[0] - b[0]);
    let x = wall.x0 - (c % 2 ? wall.unit * 0.5 : wall.unit * 1.2);
    let i = 0;
    while (x < wall.x1) {
      const next = taken.find((t) => t[1] > x);
      const w = wall.unit * (1 + Math.floor(random(`${wall.seed}${c}-${i++}`) * 3.2));
      let end = x + w;
      if (next && end > next[0] - wall.mortar) {
        // stop at the chunk; if the leftover gap is tiny, merge it into this block
        end = next[0];
        if (end - x > wall.unit * 0.45) empties.push({course: c, x, w: end - x, coral: random(`${wall.seed}k${c}${i}`) < 0.08});
        x = next[1];
        continue;
      }
      empties.push({course: c, x, w, coral: random(`${wall.seed}k${c}${i}`) < 0.08});
      x = end + wall.mortar;
    }
  }
  return empties;
};

/** One block: a shadow underneath, the face, a light top edge. */
const Block: React.FC<{x: number; y: number; w: number; h: number; color: string; rim?: string; lift?: number; children?: React.ReactNode; opacity?: number}> = ({x, y, w, h, color, rim, lift = 0, children, opacity = 1}) => (
  <div style={{position: 'absolute', left: x, top: y - lift, width: w, height: h, opacity}}>
    <div style={{position: 'absolute', left: 3 + lift * 0.6, top: 5 + lift, width: w, height: h, clipPath: chamfer(12), background: 'rgba(0,0,0,0.55)', filter: lift ? `blur(${lift * 0.3}px)` : undefined}} />
    {rim && <div style={{position: 'absolute', inset: 0, clipPath: chamfer(12), background: rim}} />}
    <div style={{position: 'absolute', inset: rim ? 4 : 0, clipPath: chamfer(rim ? 10 : 12), background: `linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 30%, rgba(0,0,0,0.18) 100%), ${color}`, overflow: 'hidden'}}>
      {children}
    </div>
  </div>
);

const ChunkFace: React.FC<{k: Placed; h: number}> = ({k, h}) => {
  const inner = h - 8;
  const accent = k.tone === 'coral' ? CORAL : k.tone === 'cream' ? CREAM : TEAL;
  if (k.tone === 'head') {
    return <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: k.small ? 22 : k.label.length > 12 ? 30 : 40, color: '#111', letterSpacing: 2, whiteSpace: 'nowrap'}}>{k.label}</div>;
  }
  const imgW = k.img || k.doc ? Math.round(inner * (k.small ? 1.0 : 1.25)) : 0;
  return (
    <div style={{display: 'flex', height: '100%'}}>
      {k.img && <Img src={staticFile(`img/wall/${k.img}`)} style={{width: imgW, height: '100%', objectFit: 'cover', objectPosition: k.fit ?? '50% 35%', filter: 'grayscale(1) contrast(1.15) brightness(0.92)', flex: 'none'}} />}
      {!k.img && k.doc && (
        <div style={{width: imgW, height: '100%', flex: 'none', background: '#e7dfcc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10, boxSizing: 'border-box'}}>
          <div style={{fontFamily: QUOTE, fontWeight: 900, fontSize: k.small ? 9 : 14, lineHeight: 1.25, color: '#2a2520', textAlign: 'center'}}>{k.doc}</div>
        </div>
      )}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: k.small ? '0 10px' : '0 18px', minWidth: 0}}>
        {k.year && <div style={{fontFamily: MONO, fontSize: k.small ? 10 : 15, color: accent, letterSpacing: 2}}>{k.year}</div>}
        <div style={{fontFamily: DISPLAY, fontSize: k.small ? (k.label.length > 16 ? 13 : 16) : k.label.length > 22 ? 24 : 30, color: CREAM, lineHeight: 1.05, marginTop: k.small ? 2 : 5}}>{k.label}</div>
      </div>
    </div>
  );
};

const Cracks: React.FC<{seed: string}> = ({seed}) => (
  <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}} viewBox="0 0 100 100" preserveAspectRatio="none">
    {[0, 1].map((i) => {
      const x = 20 + random(`${seed}a${i}`) * 60;
      return <path key={i} d={`M${x},0 L${x + 6},28 L${x - 4},46 L${x + 9},70 L${x + 2},100`} fill="none" stroke="#0a0a0a" strokeWidth={1.6} vectorEffect="non-scaling-stroke" />;
    })}
  </svg>
);

const WallView: React.FC<{wall: Wall; chunks: Placed[]; strings?: {pts: [number, number][]; word?: string; at?: [number, number]; partial?: number}[]; showEmpties?: boolean}> = ({wall, chunks, strings = []}) => {
  const empties = layout(wall, chunks);
  const yOf = (c: number) => wall.y0 + c * (wall.course + wall.mortar);
  return (
    <>
      <AbsoluteFill style={{background: '#0e0e0d'}} />
      {empties.map((e, i) => <Block key={`e${i}`} x={e.x} y={yOf(e.course)} w={e.w} h={wall.course} color={e.coral ? EMPTY_CORAL : EMPTY} />)}
      {/* holes where a chunk has been knocked out */}
      {chunks.filter((k) => k.state === 'gone' || k.dx).map((k) => (
        <div key={`h${k.id}`} style={{position: 'absolute', left: k.x, top: yOf(k.course), width: k.w, height: wall.course, clipPath: chamfer(12), background: '#050505', boxShadow: 'inset 0 10px 18px rgba(0,0,0,0.9)'}} />
      ))}
      {/* strings along the mortar */}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {strings.map((s, i) => (
          <polyline key={i} points={s.pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={TEAL} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round"
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - (s.partial ?? 1)} style={{filter: 'drop-shadow(0 0 6px rgba(47,224,196,0.6))'}} />
        ))}
      </svg>
      {chunks.filter((k) => k.state !== 'gone').map((k) => {
        const rim = k.tone === 'coral' ? CORAL : k.tone === 'cream' ? CREAM : k.tone === 'head' ? undefined : TEAL;
        const color = k.tone === 'head' ? (k.label === 'LAND' ? CORAL : k.label === 'LAW' ? TEAL : CREAM) : FACE;
        return (
          <Block key={k.id} x={k.x + (k.dx ?? 0)} y={yOf(k.course)} w={k.w} h={wall.course} color={color} rim={rim} lift={k.out ?? 0} opacity={k.state === 'dim' ? 0.45 : 1}>
            <ChunkFace k={k} h={wall.course} />
            {k.state === 'cracked' && <Cracks seed={k.id} />}
          </Block>
        );
      })}
      {strings.filter((s) => s.word && s.at).map((s, i) => (
        <div key={`w${i}`} style={{position: 'absolute', left: s.at![0], top: s.at![1], transform: 'translate(-50%,-50%)', fontFamily: HAND, fontSize: 30, color: TEAL, background: '#0e0e0d', padding: '0 8px 4px', lineHeight: 1}}>{s.word}</div>
      ))}
    </>
  );
};

// ------------------------------------------------------------------ Episode 1 ----------------------------------------------
const W1: Wall = {x0: 30, x1: 1900, y0: 128, course: 136, mortar: 14, courses: 7, unit: 92, seed: 'e1'};
const yy = (w: Wall, c: number) => w.y0 + c * (w.course + w.mortar);

const E1: Placed[] = [
  {id: 'petition', label: 'A FEW ACRES', year: 'OCT 1865', doc: '“we wish to have A home if It be but A few acres.”', tone: 'coral', course: 0, x: 690, w: 540},
  {id: 'hLand', label: 'LAND', tone: 'head', course: 1, x: 130, w: 220},
  {id: 'hWho', label: 'WHO DECIDES', tone: 'head', course: 1, x: 790, w: 340},
  {id: 'hLaw', label: 'LAW', tone: 'head', course: 1, x: 1450, w: 220},
  {id: 'forty', label: 'FORTY ACRES', year: 'JAN 1865', img: 'acres.jpg', fit: '62% 45%', course: 2, x: 60, w: 520},
  {id: 'ten', label: 'TEN PERCENT', year: '1863', img: 'lincoln.jpg', course: 2, x: 700, w: 500},
  {id: 'except', label: 'EXCEPT AS A PUNISHMENT FOR CRIME', year: 'DEC 1865', doc: '“Neither slavery nor involuntary servitude, except as a punishment for crime…”', tone: 'coral', course: 2, x: 1320, w: 560},
  {id: 'back', label: 'THE LAND GOES BACK', year: 'OCT 1865', img: 'pardons.jpg', course: 3, x: 140, w: 500},
  {id: 'targets', label: 'THREE TARGETS, ONE NIGHT', year: 'APR 1865', img: 'johnson.jpg', fit: '50% 25%', course: 3, x: 760, w: 520},
  {id: 'equal', label: 'EQUAL PROTECTION', year: 'JUN 1866', doc: '“nor deny to any person … the equal protection of the laws.”', course: 3, x: 1380, w: 500},
  {id: 'congress', label: 'CONGRESS DECIDES', year: 'NOV 1866', img: 'stevens.jpg', course: 4, x: 690, w: 500},
  {id: 'bureau', label: 'THE BUREAU', year: '1866', img: 'firstvote.jpg', fit: '50% 45%', course: 4, x: 1290, w: 420, state: 'dim'},
];

// the mortar line under course c, and the vertical joint just left/right of a chunk
const mortarY = (w: Wall, c: number) => yy(w, c) + w.course + w.mortar / 2;
const E1_STRINGS = (w: Wall) => {
  const m2 = mortarY(W1, 2), m3 = mortarY(W1, 3);
  return [
    // ten (WHO) --but--> targets: down the joint to the right of TEN PERCENT
    {pts: [[1207, yy(w, 2) + 60], [1207, m2], [1100, m2]] as [number, number][], word: 'but', at: [1150, m2] as [number, number]},
    // targets --therefore--> back (along the mortar under course 2, leftward)
    {pts: [[760 - 7, yy(w, 3) + 70], [700, yy(w, 3) + 70], [700, m2], [500, m2]] as [number, number][], word: 'therefore', at: [600, m2] as [number, number]},
    // except --therefore--> equal
    {pts: [[1600, m2 - 2], [1600, m2 + 4]] as [number, number][], word: 'therefore', at: [1600, m2] as [number, number]},
    // equal --but--> congress
    {pts: [[1380 - 7, yy(w, 3) + 70], [1310, yy(w, 3) + 70], [1310, m3], [1190, m3]] as [number, number][], word: 'but', at: [1250, m3] as [number, number]},
  ];
};

export const BrickE1: React.FC = () => (
  <TestFrame vignette={0.5}>
    <WallView wall={W1} chunks={E1} strings={E1_STRINGS(W1)} />
    <Highlight text="THE CHUNK WALL" x={60} y={30} size={58} at={-99} />
    <Tag text="Mockup · end of Episode 1 · every chunk is a block in the wall; empty blocks wait for the chunks to come" />
  </TestFrame>
);

// ------------------------------------------------------------------ close-up: a chunk lands --------------------------------
const W2: Wall = {x0: -200, x1: 2100, y0: 40, course: 250, mortar: 22, courses: 4, unit: 170, seed: 'cl'};
export const BrickLand: React.FC = () => {
  const chunks: Placed[] = [
    {id: 'targets', label: 'THREE TARGETS, ONE NIGHT', year: 'APR 1865', img: 'johnson.jpg', fit: '50% 25%', course: 1, x: 940, w: 920},
    {id: 'back', label: 'THE LAND GOES BACK', year: 'OCT 1865', img: 'pardons.jpg', course: 2, x: 90, w: 900, dx: -190, out: 14},
  ];
  const m = yy(W2, 1) + W2.course + W2.mortar / 2;
  return (
    <TestFrame vignette={0.55}>
      <WallView wall={W2} chunks={chunks} strings={[{pts: [[1400, yy(W2, 1) + W2.course], [1400, m], [700, m]], word: 'therefore', at: [1030, m], partial: 0.85}]} />
      <Highlight text="A CHUNK LANDS" x={60} y={30} size={58} at={-99} />
      <Tag text="Mockup · close-up · the block slides into its gap on the chapter's last line; the string draws along the mortar" />
    </TestFrame>
  );
};

// ------------------------------------------------------------------ the end of the series ---------------------------------
const W3: Wall = {x0: 10, x1: 1910, y0: 120, course: 70, mortar: 9, courses: 11, unit: 54, seed: 'end'};
const col = {LAND: 40, WHO: 670, LAW: 1300, PROT: 1300} as const;
const S = (id: string, label: string, course: number, c: keyof typeof col, dx: number, w: number, extra: Partial<Placed> = {}): Placed =>
  ({id, label, course, x: col[c] + dx, w, small: true, ...extra});

const END: Placed[] = [
  {id: 'petition', label: 'LANDLESS · HOMELESS · VOTELESS', doc: '“we wish to have A home if It be but A few acres.”', tone: 'coral', course: 0, x: 690, w: 540, small: true},
  {id: 'hLand', label: 'LAND', tone: 'head', course: 1, x: 200, w: 160, small: true},
  {id: 'hWho', label: 'WHO DECIDES', tone: 'head', course: 1, x: 840, w: 230, small: true},
  {id: 'hLaw', label: 'LAW', tone: 'head', course: 1, x: 1380, w: 160, small: true},
  {id: 'hProt', label: 'PROTECTION', tone: 'head', course: 6, x: 1440, w: 230, small: true},
  // LAND: cracked
  S('forty', 'FORTY ACRES', 2, 'LAND', 0, 280, {img: 'acres.jpg', fit: '62% 45%', state: 'cracked'}),
  S('back', 'THE LAND GOES BACK', 3, 'LAND', 60, 300, {img: 'pardons.jpg', state: 'cracked'}),
  S('share', 'SHARECROPPING', 4, 'LAND', 10, 280, {state: 'cracked'}),
  S('debt', 'THE DEBT', 5, 'LAND', 80, 250, {state: 'cracked'}),
  S('bank', 'THE BANK', 6, 'LAND', 20, 240, {state: 'cracked'}),
  // WHO DECIDES
  S('ten', 'TEN PERCENT', 2, 'WHO', 30, 280, {img: 'lincoln.jpg'}),
  S('targets', 'THREE TARGETS', 3, 'WHO', 0, 300, {img: 'johnson.jpg', fit: '50% 25%'}),
  S('congress', 'CONGRESS DECIDES', 4, 'WHO', 40, 290, {img: 'stevens.jpg'}),
  S('impeach', 'ONE VOTE SHORT', 5, 'WHO', 0, 270),
  S('senator', 'FIRST BLACK SENATOR', 6, 'WHO', 30, 300, {img: 'senators.jpg', fit: '15% 50%', tone: 'coral'}),
  S('smith', 'THE BLACKSMITH', 7, 'WHO', 0, 260),
  S('tired', 'TIRED', 8, 'WHO', 50, 200),
  S('1876', 'TWO SETS OF RESULTS', 9, 'WHO', 0, 300),
  // LAW: whole
  S('except', 'EXCEPT AS A PUNISHMENT', 2, 'LAW', 0, 300, {doc: '“…except as a punishment for crime…”'}),
  S('equal', 'EQUAL PROTECTION', 3, 'LAW', 60, 290, {doc: '“…the equal protection of the laws.”'}),
  S('fifteenth', 'THE 15TH AMENDMENT', 4, 'LAW', 20, 300, {img: 'fifteenth.jpg', tone: 'coral'}),
  // PROTECTION: knocked out
  S('districts', 'FIVE DISTRICTS', 7, 'PROT', 0, 260, {state: 'gone'}),
  S('klan', 'PROTECTION WORKS', 8, 'PROT', 60, 280, {state: 'gone'}),
  S('colfax', 'COLFAX', 9, 'PROT', 10, 220, {state: 'gone'}),
  S('miss', 'MISSISSIPPI, 1875', 10, 'PROT', 70, 280, {state: 'gone'}),
  // voteless again
  S('voteless', 'VOTELESS', 10, 'WHO', 30, 260, {tone: 'coral'}),
];

export const BrickEnd: React.FC = () => (
  <TestFrame vignette={0.55}>
    <WallView wall={W3} chunks={END} />
    {/* the knocked-out blocks lie at the foot of the wall */}
    {['FIVE DISTRICTS', 'COLFAX', 'MISSISSIPPI, 1875'].map((t, i) => (
      <div key={t} style={{position: 'absolute', left: 1330 + i * 190, top: 1020 - (i % 2) * 8, width: 170, height: 40, clipPath: chamfer(8), background: '#1d2826',
        transform: `rotate(${[-8, 5, -3][i]}deg)`, fontFamily: DISPLAY, fontSize: 13, color: 'rgba(244,239,230,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{t}</div>
    ))}
    <Highlight text="THE WHOLE WALL" x={60} y={30} size={58} at={-99} />
    <div style={{position: 'absolute', right: 60, top: 58, fontFamily: MONO, fontSize: 16, color: 'rgba(255,255,255,0.8)', letterSpacing: 1}}>
      MOCKUP · END OF THE SERIES · LAW STANDS · LAND CRACKED · PROTECTION KNOCKED OUT · VOTELESS AGAIN
    </div>
  </TestFrame>
);

// ------------------------------------------------------------------ the channel wall -------------------------------------
// Every video is one chunk; the courses are eras. The video you just watched lights up, its neighbours are the end-screen
// suggestions, and empty blocks are the chunks still to come.
const W4: Wall = {x0: 10, x1: 1910, y0: 150, course: 150, mortar: 14, courses: 6, unit: 100, seed: 'ch'};
const V = (id: string, label: string, year: string, course: number, x: number, img: string, extra: Partial<Placed> = {}): Placed =>
  ({id, label, year, course, x, w: 470, img, fit: '50% 50%', ...extra});
const CHANNEL: Placed[] = [
  {id: 'e1', label: '1770s – 1810s', tone: 'head', course: 0, x: 40, w: 250},
  V('king', 'KING ANDREW', '1767 – 1845', 0, 330, 'thumbs/04_King_Andrew_A.jpg'),
  V('war', 'THE WAR NOBODY WON', '1812 – 1815', 0, 840, 'thumbs/02_War_Nobody_Won.jpg'),
  V('green', 'DRESSED TO KILL', '1775 – 1900', 0, 1350, 'thumbs/09_Dressed_To_Kill_A.jpg'),
  {id: 'e2', label: '1820s – 1850s', tone: 'head', course: 1, x: 90, w: 250},
  V('fix', 'FIX EVERYTHING', '1820s – 1850s', 1, 380, 'thumbs/01_Fix_Everything.jpg'),
  V('spot', 'THE EXACT SPOT', '1821 – 1848', 1, 890, 'thumbs/08_Exact_Spot_D.jpg'),
  V('grip', 'GRIP TIGHTER', '1790 – 1860', 1, 1400, 'thumbs/05_Grip_Tighter_A.jpg'),
  {id: 'e3', label: '1860s – 1870s', tone: 'head', course: 2, x: 40, w: 250},
  V('r1', 'LANDLESS, HOMELESS, VOTELESS', 'RECONSTRUCTION 1', 2, 330, 'acres.jpg', {tone: 'coral', fit: '62% 45%'}),
  V('r2', 'BOTTOM RAIL ON TOP', 'RECONSTRUCTION 2', 2, 840, 'senators.jpg', {tone: 'coral'}),
  V('r3', 'REDEMPTION', 'RECONSTRUCTION 3', 2, 1350, 'fifteenth.jpg', {tone: 'coral'}),
  {id: 'e4', label: '1880s – 1920s', tone: 'head', course: 3, x: 90, w: 250},
  V('bierce', 'THE MAN WHO COULDN\'T SIT STILL', '1842 – 1914', 3, 380, 'thumbs/03_Bierce_A.jpg'),
  V('sox', 'SAY IT AIN\'T SO', '1865 – 1921', 3, 890, 'thumbs/07_Say_It_Aint_So_A.jpg'),
  V('ouija', 'GOOD LUCK', '1886 – 1973', 3, 1400, 'thumbs/06_Good_Luck_Ouija.jpg'),
];
export const BrickChannel: React.FC = () => (
  <TestFrame vignette={0.5}>
    <WallView wall={W4} chunks={CHANNEL} />
    <Highlight text="THE CHUNK HISTORY WALL" x={60} y={30} size={58} at={-99} />
    <div style={{position: 'absolute', left: 60, top: 1030, fontFamily: MONO, fontSize: 16, color: 'rgba(255,255,255,0.8)', letterSpacing: 1}}>
      MOCKUP · THE CHANNEL WALL · EVERY VIDEO IS ONE CHUNK · ERAS ARE COURSES · EMPTY BLOCKS ARE VIDEOS STILL TO COME
    </div>
  </TestFrame>
);
