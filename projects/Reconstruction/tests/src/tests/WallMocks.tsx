// Wall mockups: four looks for the series evidence wall, each showing the wall at the end of Episode 1.
// A  Evidence board   pinned cards, teal yarn, paper tags
// B  Chunk grid       brand slabs snapped into a staggered wall, orthogonal teal connectors, empty chunks waiting
// C  Timeline rail    three lanes (LAW / LAND / PROTECTION) over a year axis, cards hung at their dates
// D  Map table        the wall laid flat as a huge table in 3D, the forty-acres map as part of it
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Highlight, Tag} from '../kit/Kit';
import {TestFrame} from './common';

const TEAL = '#2FE0C4';
const CORAL = '#FF6F61';
const ORANGE = '#FF9F1C';
const CREAM = '#f4efe6';
const INK = '#111111';
const HAND = '"Nanum Pen Script", cursive';
const DISPLAY = '"Abril Fatface", serif';
const MONO = '"IBM Plex Mono", monospace';
const QUOTE = '"Playfair Display", serif';

type Card = {id: string; label: string; img?: string; doc?: string; col: 'TOP' | 'LAND' | 'WHO' | 'LAW' | 'PROT'; year: number; coral?: boolean; dim?: boolean; fit?: string};

// Episode 1's chunks (from WALL.md); documents without a scan yet are shown as typeset stand-ins.
const CARDS: Card[] = [
  {id: 'petition', label: 'A FEW ACRES', doc: '“we wish to have A home if It be but A few acres.”', col: 'TOP', year: 1865.82, coral: true},
  {id: 'forty', label: 'FORTY ACRES', img: 'acres.jpg', col: 'LAND', year: 1865.05, fit: '62% 40%'},
  {id: 'ten', label: 'TEN PERCENT', img: 'lincoln.jpg', col: 'WHO', year: 1863.9, fit: '50% 30%'},
  {id: 'targets', label: 'THREE TARGETS, ONE NIGHT', img: 'johnson.jpg', col: 'WHO', year: 1865.3, fit: '50% 25%'},
  {id: 'back', label: 'THE LAND GOES BACK', img: 'pardons.jpg', col: 'LAND', year: 1865.42, fit: '50% 40%'},
  {id: 'except', label: 'EXCEPT AS A PUNISHMENT FOR CRIME', doc: '“Neither slavery nor involuntary servitude, except as a punishment for crime…”', col: 'LAW', year: 1865.95, coral: true},
  {id: 'bureau', label: 'THE BUREAU', img: 'firstvote.jpg', col: 'PROT', year: 1866.2, dim: true, fit: '50% 45%'},
  {id: 'equal', label: 'EQUAL PROTECTION', doc: '“nor deny to any person within its jurisdiction the equal protection of the laws.”', col: 'LAW', year: 1866.45},
  {id: 'congress', label: 'CONGRESS DECIDES', img: 'stevens.jpg', col: 'WHO', year: 1866.85, fit: '50% 30%'},
];
type Link = {from: string; to: string; word: string; dashed?: boolean};
const LINKS: Link[] = [
  {from: 'ten', to: 'targets', word: 'but'},
  {from: 'targets', to: 'back', word: 'therefore'},
  {from: 'forty', to: 'back', word: 'but'},
  {from: 'except', to: 'equal', word: 'therefore'},
  {from: 'back', to: 'except', word: 'therefore'},
  {from: 'equal', to: 'congress', word: 'but'},
];

const imgOf = (c: Card) => staticFile(`img/wall/${c.img}`);

/** The picture or document face of a card. */
const Face: React.FC<{c: Card; w: number; h: number; dark?: boolean}> = ({c, w, h, dark}) =>
  c.img ? (
    <Img src={imgOf(c)} style={{width: w, height: h, objectFit: 'cover', objectPosition: c.fit ?? '50% 50%', display: 'block', filter: 'grayscale(1) contrast(1.15)'}} />
  ) : (
    <div style={{width: w, height: h, background: dark ? '#1a1916' : '#e9e1cf', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: w * 0.08, boxSizing: 'border-box'}}>
      <div style={{fontFamily: QUOTE, fontWeight: 900, fontSize: Math.max(14, w * 0.075), lineHeight: 1.25, color: dark ? CREAM : '#2a2520', textAlign: 'center'}}>{c.doc}</div>
    </div>
  );

/** String / connector label in handwriting. */
const Word: React.FC<{x: number; y: number; text: string; bg?: string; color?: string; size?: number; rot?: number}> = ({x, y, text, bg = CREAM, color = '#14322d', size = 30, rot = -4}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, background: bg, color, fontFamily: HAND, fontSize: size, lineHeight: 1,
    padding: '3px 10px 6px', boxShadow: '0 4px 10px rgba(0,0,0,0.45)', whiteSpace: 'nowrap'}}>{text}</div>
);

const Caption: React.FC<{name: string; note: string}> = ({name, note}) => (
  <>
    <Highlight text={name} x={60} y={36} size={58} at={-99} />
    <Tag text={`Wall mockup · end of Episode 1 · ${note}`} />
  </>
);

// ---------------------------------------------------------------- A: evidence board --------------------------------------------
const POS_A: Record<string, [number, number, number, number, number]> = {
  // x, y, w (image), h, rotation
  petition: [790, 110, 320, 150, -1.5],
  forty: [110, 360, 340, 180, -2],
  back: [170, 680, 250, 220, 2.5],
  ten: [700, 420, 180, 190, 2],
  targets: [960, 440, 180, 190, -3],
  congress: [830, 750, 180, 190, 1.5],
  except: [1430, 330, 320, 160, 2],
  equal: [1450, 640, 320, 160, -2],
  bureau: [1220, 820, 150, 150, 4],
};
const centreA = (id: string) => {
  const [x, y, w, h] = POS_A[id];
  return [x + w / 2 + 12, y + 12] as [number, number]; // the pin, top centre
};

const Pin: React.FC<{x: number; y: number; color?: string}> = ({x, y, color = TEAL}) => (
  <div style={{position: 'absolute', left: x - 11, top: y - 11, width: 22, height: 22, borderRadius: 11, background: `radial-gradient(circle at 35% 35%, #fff 0 15%, ${color} 35%, #0d4b42 100%)`,
    boxShadow: '3px 6px 6px rgba(0,0,0,0.6)'}} />
);

const Yarn: React.FC = () => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
    {LINKS.map((l, i) => {
      const [x1, y1] = centreA(l.from);
      const [x2, y2] = centreA(l.to);
      const sag = 30 + Math.abs(x2 - x1) * 0.08;
      const d = `M${x1},${y1} Q${(x1 + x2) / 2},${Math.max(y1, y2) + sag} ${x2},${y2}`;
      return (
        <g key={i}>
          <path d={d} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth={5} transform="translate(3,5)" />
          <path d={d} fill="none" stroke={TEAL} strokeWidth={3.5} />
        </g>
      );
    })}
  </svg>
);

export const WallA: React.FC = () => (
  <TestFrame vignette={0.55}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #2b2620 0%, #17140f 70%, #0d0c09 100%)'}} />
    <AbsoluteFill style={{opacity: 0.18, backgroundImage: `url(${staticFile('img/wall/pattern-cracks.svg')})`, backgroundSize: '420px'}} />
    {/* column names, chalked on the board */}
    {[['LAND', 230, 300], ['WHO DECIDES?', 830, 352], ['LAW', 1570, 270]].map(([t, x, y]) => (
      <div key={t as string} style={{position: 'absolute', left: x as number, top: y as number, fontFamily: HAND, fontSize: 46, color: 'rgba(244,239,230,0.55)', transform: 'rotate(-2deg)'}}>{t}</div>
    ))}
    <Yarn />
    {Object.entries(POS_A).map(([id, [x, y, w, h, r]]) => {
      const c = CARDS.find((k) => k.id === id)!;
      return (
        <div key={id} style={{position: 'absolute', left: x, top: y, transform: `rotate(${r}deg)`, opacity: c.dim ? 0.5 : 1}}>
          <div style={{background: CREAM, padding: 12, paddingBottom: 66, boxShadow: '0 16px 30px rgba(0,0,0,0.6)', position: 'relative'}}>
            <Face c={c} w={w} h={h} />
            {c.coral && <div style={{position: 'absolute', left: 12, top: 12, width: w, height: h, background: CORAL, mixBlendMode: 'multiply', opacity: 0.55}} />}
            <div style={{position: 'absolute', left: 12, right: 12, bottom: 8, fontFamily: DISPLAY, fontSize: 20, color: c.coral ? '#b8433a' : '#1b1915', lineHeight: 1.05}}>{c.label}</div>
          </div>
        </div>
      );
    })}
    {LINKS.map((l, i) => {
      const [x1, y1] = centreA(l.from);
      const [x2, y2] = centreA(l.to);
      const sag = 30 + Math.abs(x2 - x1) * 0.08;
      const cy = Math.max(y1, y2) + sag;
      // a point a third of the way along the curve, clear of the cards' labels
      const t = 0.62;
      const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * ((x1 + x2) / 2) + t * t * x2;
      const y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
      return <Word key={i} x={x} y={y} text={l.word} rot={i % 2 ? 4 : -5} />;
    })}
    {Object.keys(POS_A).map((id) => {
      const [x, y] = centreA(id);
      const c = CARDS.find((k) => k.id === id)!;
      return <Pin key={id} x={x} y={y} color={c.coral ? CORAL : TEAL} />;
    })}
    <Caption name="A · EVIDENCE BOARD" note="pinned cards, teal yarn, handwritten tags" />
  </TestFrame>
);

// ---------------------------------------------------------------- B: chunk grid ------------------------------------------------
const chamfer = (k: number) => `polygon(${k}px 0, calc(100% - ${k}px) 0, 100% ${k}px, 100% calc(100% - ${k}px), calc(100% - ${k}px) 100%, ${k}px 100%, 0 calc(100% - ${k}px), 0 ${k}px)`;

// grid: three columns of slabs + a header row; cells are [col, row]
const COLS_B = {LAND: 120, WHO: 720, LAW: 1320} as const;
const CW = 480; // column width
const RH = 196; // row height
const GRID_B: Record<string, [keyof typeof COLS_B | 'TOP', number, number?]> = {
  petition: ['TOP', 0],
  forty: ['LAND', 1], back: ['LAND', 2],
  ten: ['WHO', 1], targets: ['WHO', 2], congress: ['WHO', 3],
  except: ['LAW', 1], equal: ['LAW', 2], bureau: ['LAW', 3],
};
const cellB = (id: string) => {
  const [col, row] = GRID_B[id];
  if (col === 'TOP') return {x: 720, y: 112, w: CW - 20, h: 150};
  return {x: COLS_B[col], y: 330 + (row - 1) * RH, w: CW - 20, h: RH - 24};
};

type Box = {x: number; y: number; w: number; h: number};
/** Connector along the grout: same column = straight down; otherwise out of the bottom, along the gap, into the target. */
const routeB = (a: Box, b: Box) => {
  if (Math.abs(a.x - b.x) < 5) return `M${a.x + a.w - 40},${a.y + a.h} L${b.x + b.w - 40},${b.y - 8}`;
  const right = b.x > a.x;
  const sx = right ? a.x + a.w - 30 : a.x + 30;
  const gy = a.y + a.h + 12;
  const ex = right ? b.x + 30 : b.x + b.w - 30;
  const ey = b.y > gy ? b.y - 8 : b.y + b.h + 8;
  return `M${sx},${a.y + a.h} L${sx},${gy} L${ex},${gy} L${ex},${ey}`;
};
const labelB = (a: Box, b: Box): [number, number] => {
  if (Math.abs(a.x - b.x) < 5) return [a.x + a.w - 40, (a.y + a.h + b.y) / 2];
  return [(a.x + b.x + b.w) / 2 + (b.x > a.x ? a.w / 2 - b.w / 2 : 0), a.y + a.h + 12];
};

const Slab: React.FC<{c: Card; x: number; y: number; w: number; h: number}> = ({c, x, y, w, h}) => {
  const imgW = Math.round(h * 1.15);
  const accent = c.coral ? CORAL : TEAL;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.55))', opacity: c.dim ? 0.45 : 1}}>
      <div style={{position: 'absolute', inset: 0, clipPath: chamfer(16), background: accent}} />
      <div style={{position: 'absolute', inset: 5, clipPath: chamfer(13), background: '#171614', display: 'flex'}}>
        <div style={{width: imgW, height: '100%', overflow: 'hidden', flex: 'none'}}><Face c={c} w={imgW} h={h - 10} dark /></div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 18px'}}>
          <div style={{fontFamily: MONO, fontSize: 15, color: accent, letterSpacing: 2}}>{String(c.year).slice(0, 4)}</div>
          <div style={{fontFamily: DISPLAY, fontSize: c.label.length > 22 ? 25 : 31, color: CREAM, lineHeight: 1.05, marginTop: 6}}>{c.label}</div>
        </div>
      </div>
    </div>
  );
};

export const WallB: React.FC = () => {
  const header = (t: string, x: number, color: string) => (
    <div key={t} style={{position: 'absolute', left: x, top: 150 + RH - 4 - 66 + RH, width: CW - 20}} />
  );
  void header;
  return (
    <TestFrame vignette={0.45}>
      <AbsoluteFill style={{background: INK}} />
      <AbsoluteFill style={{opacity: 0.55, backgroundImage: `url(${staticFile('img/wall/pattern-chunks.svg')})`, backgroundSize: '520px'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(17,17,17,0.2) 30%, rgba(17,17,17,0.85) 100%)'}} />
      {/* column headers as brand slabs */}
      {([['LAND', COLS_B.LAND, CORAL], ['WHO DECIDES', COLS_B.WHO, CREAM], ['LAW', COLS_B.LAW, TEAL]] as const).map(([t, x, col]) => (
        <div key={t} style={{position: 'absolute', left: x, top: 290, width: CW - 20, height: 0}}>
          <div style={{position: 'absolute', left: 0, top: -2, padding: '4px 16px', background: col, clipPath: chamfer(8), fontFamily: DISPLAY, fontSize: 26, color: INK, letterSpacing: 1}}>{t}</div>
        </div>
      ))}
      {/* connectors along the grout lines */}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <marker id="ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={TEAL} /></marker>
        </defs>
        {LINKS.map((l, i) => {
          const a = cellB(l.from), b = cellB(l.to);
          const d = routeB(a, b);
          return <path key={i} d={d} fill="none" stroke={TEAL} strokeWidth={4} strokeLinejoin="round" markerEnd="url(#ah)" />;
        })}
      </svg>
      {Object.keys(GRID_B).map((id) => {
        const c = CARDS.find((k) => k.id === id)!;
        const {x, y, w, h} = cellB(id);
        return <Slab key={id} c={c} x={x} y={y} w={w} h={h} />;
      })}
      {LINKS.map((l, i) => {
        const a = cellB(l.from), b = cellB(l.to);
        const [x, y] = labelB(a, b);
        return <Word key={i} x={x} y={y} text={l.word} bg={INK} color={TEAL} size={28} rot={0} />;
      })}
      <Caption name="B · CHUNK GRID" note="brand slabs in a staggered wall, connectors on the grout lines, empty chunks waiting" />
    </TestFrame>
  );
};

// ---------------------------------------------------------------- C: timeline rail ---------------------------------------------
const LANES: [Card['col'], string, string][] = [['LAND', 'LAND', CORAL], ['WHO', 'WHO DECIDES', CREAM], ['LAW', 'LAW', TEAL], ['PROT', 'PROTECTION', '#8d877c']];
const X0 = 330, X1 = 1840, Y0 = 1863.5, Y1 = 1867.2;
const xOf = (yr: number) => X0 + ((yr - Y0) / (Y1 - Y0)) * (X1 - X0);
const laneY = (i: number) => 230 + i * 180;

export const WallC: React.FC = () => {
  const lane = (col: Card['col']) => LANES.findIndex((l) => l[0] === col);
  const pos = (c: Card) => {
    const l = c.col === 'TOP' ? lane('LAND') : lane(c.col);
    return {x: xOf(c.year) - 75, y: laneY(l) - 74, w: 150};
  };
  return (
    <TestFrame vignette={0.45}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #24211b 0%, #12110d 75%)'}} />
      {LANES.map(([k, t, col], i) => (
        <React.Fragment key={k}>
          <div style={{position: 'absolute', left: 0, right: 0, top: laneY(i) - 90, height: 180, background: i % 2 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.05)'}} />
          <div style={{position: 'absolute', left: 50, top: laneY(i) - 20, fontFamily: DISPLAY, fontSize: 34, color: col, opacity: k === 'PROT' ? 0.5 : 1}}>{t}</div>
        </React.Fragment>
      ))}
      {/* year axis */}
      <div style={{position: 'absolute', left: X0, width: X1 - X0, top: 950, height: 3, background: TEAL}} />
      {[1864, 1865, 1866, 1867].map((y) => (
        <React.Fragment key={y}>
          <div style={{position: 'absolute', left: xOf(y) - 1, top: 940, width: 3, height: 22, background: TEAL}} />
          <div style={{position: 'absolute', left: xOf(y) - 40, top: 966, width: 80, textAlign: 'center', fontFamily: MONO, fontSize: 22, color: CREAM}}>{y}</div>
          <div style={{position: 'absolute', left: xOf(y), top: 140, width: 1, height: 800, background: 'rgba(47,224,196,0.15)'}} />
        </React.Fragment>
      ))}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <defs><marker id="ahc" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={TEAL} /></marker></defs>
        {LINKS.map((l, i) => {
          const a = CARDS.find((c) => c.id === l.from)!, b = CARDS.find((c) => c.id === l.to)!;
          const pa = pos(a), pb = pos(b);
          const x1 = pa.x + pa.w / 2, y1 = pa.y + 70, x2 = pb.x + pb.w / 2, y2 = pb.y + 70;
          return <path key={i} d={`M${x1},${y1} C${x1 + 90},${y1} ${x2 - 90},${y2} ${x2 - 10},${y2}`} fill="none" stroke={TEAL} strokeWidth={3.5} strokeDasharray="10 7" markerEnd="url(#ahc)" opacity={0.9} />;
        })}
      </svg>
      {CARDS.map((c) => {
        const p = pos(c);
        const h = 100;
        return (
          <div key={c.id} style={{position: 'absolute', left: p.x, top: p.y, width: p.w, opacity: c.dim ? 0.45 : 1}}>
            <div style={{background: CREAM, padding: 7, boxShadow: '0 10px 18px rgba(0,0,0,0.6)', clipPath: chamfer(10)}}>
              <Face c={c} w={p.w - 14} h={h} />
            </div>
            <div style={{fontFamily: DISPLAY, fontSize: 19, color: c.coral ? CORAL : CREAM, marginTop: 6, lineHeight: 1.05, textShadow: '0 2px 8px #000'}}>{c.label}</div>
          </div>
        );
      })}
      <Caption name="C · TIMELINE RAIL" note="lanes for LAW / LAND / PROTECTION, cards hung at their dates" />
    </TestFrame>
  );
};

// ---------------------------------------------------------------- D: map table (3D) -------------------------------------------
export const WallD: React.FC = () => {
  // table space: 3200 x 2000, viewed in perspective
  const P: Record<string, [number, number, number, number, number]> = {
    petition: [1380, 160, 420, 240, -2],
    ten: [1300, 640, 230, 270, 3], targets: [1600, 700, 230, 270, -4], congress: [1450, 1080, 230, 270, 2],
    back: [700, 980, 300, 320, 4],
    except: [2150, 520, 400, 240, -3], equal: [2200, 940, 400, 240, 2], bureau: [1900, 1300, 230, 270, -5],
  };
  return (
    <TestFrame vignette={0.5}>
      <AbsoluteFill style={{background: '#0b0c0d', perspective: 1500, perspectiveOrigin: '50% 20%'}}>
        <div style={{position: 'absolute', left: 960 - 1600, top: 600 - 1000, width: 3200, height: 2000, transformStyle: 'preserve-3d', transform: 'scale(0.6) rotateX(44deg) rotateZ(-4deg)',
          background: 'radial-gradient(ellipse at 50% 40%, #2a2620 0%, #15130f 70%)'}}>
          {/* the forty-acres map is part of the table */}
          <div style={{position: 'absolute', left: 160, top: 260, width: 960, height: 540, boxShadow: '0 30px 60px rgba(0,0,0,0.7)', transform: 'rotate(-3deg)'}}>
            <Img src={staticFile('img/wall/acres.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            <div style={{position: 'absolute', left: 16, bottom: -54, fontFamily: DISPLAY, fontSize: 40, color: CREAM}}>FORTY ACRES</div>
          </div>
          <svg width={3200} height={2000} style={{position: 'absolute', left: 0, top: 0}}>
            {[[1120, 600, 1300, 760], [1530, 790, 1600, 820], [1700, 970, 1600, 1080], [1000, 1150, 1300, 1150], [2350, 760, 2400, 940], [1000, 900, 2150, 640]].map(([a, b, c, d], i) => (
              <path key={i} d={`M${a},${b} Q${(a + c) / 2 + 60},${(b + d) / 2 - 80} ${c},${d}`} fill="none" stroke={TEAL} strokeWidth={7} strokeLinecap="round" />
            ))}
          </svg>
          {Object.entries(P).map(([id, [x, y, w, h, r]]) => {
            const c = CARDS.find((k) => k.id === id)!;
            return (
              <div key={id} style={{position: 'absolute', left: x, top: y, transform: `rotate(${r}deg)`, opacity: c.dim ? 0.5 : 1, boxShadow: '0 24px 40px rgba(0,0,0,0.7)', background: CREAM, padding: 14, paddingBottom: 60}}>
                <Face c={c} w={w} h={h} />
                {c.coral && <div style={{position: 'absolute', left: 14, top: 14, width: w, height: h, background: CORAL, mixBlendMode: 'multiply', opacity: 0.55}} />}
                <div style={{position: 'absolute', left: 14, right: 14, bottom: 12, fontFamily: DISPLAY, fontSize: 28, color: c.coral ? '#b8433a' : '#1b1915', lineHeight: 1}}>{c.label}</div>
              </div>
            );
          })}
        </div>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, #0b0c0d 0%, rgba(11,12,13,0.7) 14%, rgba(11,12,13,0) 40%)'}} />
      </AbsoluteFill>
      <Caption name="D · MAP TABLE" note="the wall laid flat as one big table in 3D; the 40-acres map is part of it" />
    </TestFrame>
  );
};
