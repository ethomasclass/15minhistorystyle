// The case-file collage: a flat, cut-paper evidence board (reference: the user's two "kidnapper" boards). Halftone photos,
// torn label strips, sticky notes with handwritten questions, rubber stamps, tape, a silhouette with a question mark,
// straight thread pin to pin. No soft shadows: flat paper on black.
//   Collage-1  Episode 1's board, one hot accent for everything (closest to the reference)
//   Collage-2  the same board in the channel's colour jobs (coral = subject, teal = thread and handwriting, orange = titles)
//   Collage-3  a close-up "case": the night of April 14, 1865
import React from 'react';
import {AbsoluteFill, Img, random, staticFile} from 'remotion';
import {Tag} from '../kit/Kit';
import {TestFrame} from './common';

const HAND = '"Nanum Pen Script", cursive';
const DISPLAY = '"Abril Fatface", serif';
const MONO = '"IBM Plex Mono", monospace';
const SERIF = '"Playfair Display", serif';
const SANS = '"Inter", sans-serif';

type Pal = {bg: string; paper: string; accent: string; thread: string; note: string; noteInk: string; hand: string; stamp: string; tape: string; label: string};
const HOT: Pal = {bg: '#0f0f0f', paper: '#ece6d8', accent: '#FF6A2B', thread: '#FF6A2B', note: '#FF6A2B', noteInk: '#1a1a1a', hand: '#1a1a1a', stamp: '#FF6A2B', tape: '#8b97a3', label: '#c9d3dc'};
const BRAND: Pal = {bg: '#0f0f0f', paper: '#ece6d8', accent: '#FF6F61', thread: '#2FE0C4', note: '#FF6F61', noteInk: '#1a1a1a', hand: '#2FE0C4', stamp: '#FF6F61', tape: '#8b97a3', label: '#c9d3dc'};
const Ctx = React.createContext<Pal>(HOT);
const usePal = () => React.useContext(Ctx);

/** A ragged-edged polygon (torn paper), as a CSS clip-path. `edges` picks which sides are torn: t r b l. */
const torn = (seed: string, edges = 'lr', amp = 6) => {
  const pts: string[] = [];
  const n = 18;
  const j = (k: string) => (random(`${seed}${k}`) * amp).toFixed(1);
  for (let i = 0; i <= n; i++) pts.push(`${(i / n) * 100}% ${edges.includes('t') ? j(`t${i}`) : 0}px`);
  for (let i = 0; i <= n; i++) pts.push(`calc(100% - ${edges.includes('r') ? j(`r${i}`) : 0}px) ${(i / n) * 100}%`);
  for (let i = n; i >= 0; i--) pts.push(`${(i / n) * 100}% calc(100% - ${edges.includes('b') ? j(`b${i}`) : 0}px)`);
  for (let i = n; i >= 0; i--) pts.push(`${edges.includes('l') ? j(`l${i}`) : 0}px ${(i / n) * 100}%`);
  return `polygon(${pts.join(',')})`;
};

const Flat: React.FC<{x: number; y: number; r?: number; children: React.ReactNode; z?: number}> = ({x, y, r = 0, children, z}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${r}deg)`, zIndex: z, filter: 'drop-shadow(5px 6px 0 rgba(0,0,0,0.55))'}}>{children}</div>
);

/** A photo: a worn, creased print with no border (tools/crease.py), straight on the board. */
const Photo: React.FC<{src: string; w: number; h?: number}> = ({src, w, h}) => (
  <Img src={staticFile(`img/wall/${src}`)} style={{width: w, height: h, display: 'block', objectFit: 'contain'}} />
);

/** A torn label strip, typewritten. */
const Strip: React.FC<{text: string; size?: number; bg?: string; color?: string; seed?: string; font?: string}> = ({text, size = 26, bg, color = '#1a1a1a', seed = 's', font = MONO}) => {
  const p = usePal();
  return <div style={{background: bg ?? p.label, clipPath: torn(seed), padding: `${size * 0.25}px ${size * 0.7}px`, fontFamily: font, fontSize: size, color, whiteSpace: 'nowrap', letterSpacing: 1}}>{text}</div>;
};

/** A sticky note with a handwritten question. */
const Sticky: React.FC<{text: string; w?: number; size?: number}> = ({text, w = 190, size = 54}) => {
  const p = usePal();
  return (
    <div style={{width: w, height: w * 0.92, background: p.note, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 14, boxSizing: 'border-box'}}>
      <div style={{fontFamily: HAND, fontSize: size, lineHeight: 0.95, color: p.noteInk}}>{text}</div>
    </div>
  );
};

/** A rubber stamp: an outlined box, slightly rough. */
const Stamp: React.FC<{text: string; size?: number; color?: string}> = ({text, size = 44, color}) => {
  const p = usePal();
  const c = color ?? p.stamp;
  return (
    <div style={{border: `${size * 0.09}px solid ${c}`, padding: `${size * 0.06}px ${size * 0.28}px`, fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: size * 0.06, color: c,
      filter: 'url(#rough)', whiteSpace: 'nowrap', lineHeight: 1.05}}>{text}</div>
  );
};

/** A strip of tape across something. */
const TapeBit: React.FC<{w?: number; seed?: string}> = ({w = 150, seed = 't'}) => {
  const p = usePal();
  return <div style={{width: w, height: 38, background: p.tape, opacity: 0.88, clipPath: torn(seed, 'lr', 7)}} />;
};

const Pin: React.FC<{x: number; y: number}> = ({x, y}) => {
  const p = usePal();
  return (
    <div style={{position: 'absolute', left: x - 10, top: y - 10, width: 20, height: 20, borderRadius: 10, background: p.accent, zIndex: 50, boxShadow: '2px 3px 0 rgba(0,0,0,0.5)'}}>
      <div style={{position: 'absolute', left: 5, top: 4, width: 6, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.6)'}} />
    </div>
  );
};

/** Straight thread between pins (drawn above the paper, as in the reference). */
const Threads: React.FC<{lines: [number, number, number, number][]}> = ({lines}) => {
  const p = usePal();
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, zIndex: 40}}>
      {lines.map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} stroke={p.thread} strokeWidth={2.6} />)}
    </svg>
  );
};

/** The unknown at the centre: a head-and-shoulders outline with a question mark. */
const Silhouette: React.FC<{label: string; size?: number}> = ({label, size = 260}) => {
  const p = usePal();
  return (
    <div style={{width: size, textAlign: 'center'}}>
      <svg width={size} height={size} viewBox="0 0 200 200">
        <path d="M100 22 C70 22 58 46 60 72 C61 92 72 108 84 116 C58 122 30 138 22 170 L22 186 L178 186 L178 170 C170 138 142 122 116 116 C128 108 139 92 140 72 C142 46 130 22 100 22 Z"
          fill="none" stroke={p.accent} strokeWidth={6} strokeLinejoin="round" />
        <text x="100" y="98" textAnchor="middle" fontFamily="Abril Fatface" fontSize="72" fill={p.accent}>?</text>
      </svg>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: size * 0.13, letterSpacing: 2, color: p.accent, marginTop: -6, whiteSpace: 'nowrap', marginLeft: -100, marginRight: -100}}>{label}</div>
    </div>
  );
};

/** A torn scrap of document text. */
const Scrap: React.FC<{text: string; w: number; size?: number; seed?: string; mark?: string; italic?: boolean}> = ({text, w, size = 24, seed = 'd', mark, italic}) => {
  const p = usePal();
  const parts = mark ? text.split(mark) : [text];
  return (
    <div style={{width: w, background: p.paper, clipPath: torn(seed, 'tb', 7), padding: '22px 22px', boxSizing: 'border-box', fontFamily: SERIF, fontWeight: 900, fontSize: size, lineHeight: 1.3, color: '#262320', fontStyle: italic ? 'italic' : 'normal'}}>
      {parts.length > 1 ? <>{parts[0]}<span style={{background: p.accent, color: '#111', padding: '0 4px'}}>{mark}</span>{parts[1]}</> : text}
    </div>
  );
};

/** The channel logo as a worn, faded sticker: the brand's horizontal lockup under a wear mask (tools/distress.py). */
const WornLogo: React.FC<{w: number; mark?: boolean; fade?: number}> = ({w, mark, fade = 0.78}) => {
  const src = mark ? 'img/brand/chunk-history-mark.svg' : 'img/brand/chunk-history-horizontal.svg';
  const wear = mark ? 'img/brand/wear_square.png' : 'img/brand/wear_wide.png';
  const h = mark ? w : (w * 210) / 1404;
  return (
    <div style={{width: w, height: h, opacity: fade, filter: 'saturate(0.75) brightness(0.92)',
      WebkitMaskImage: `url(${staticFile(wear)})`, maskImage: `url(${staticFile(wear)})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%'}}>
      <Img src={staticFile(src)} style={{width: w, height: h, display: 'block'}} />
    </div>
  );
};

const Defs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" /><feDisplacementMap in="SourceGraphic" scale="3" />
      <feComponentTransfer><feFuncA type="discrete" tableValues="0 1 1 1 0.85 1" /></feComponentTransfer></filter>
  </svg>
);

const Splats: React.FC<{seed: string}> = ({seed}) => {
  const p = usePal();
  return (
    <>
      {Array.from({length: 9}, (_, i) => {
        const x = random(`${seed}x${i}`) * 1920, y = random(`${seed}y${i}`) * 1080, r = 3 + random(`${seed}r${i}`) * 9;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: r, height: r, borderRadius: r, background: p.accent, opacity: 0.8}} />;
      })}
    </>
  );
};

// ------------------------------------------------------------------- Episode 1's board ---------------------------------------
const Board1: React.FC<{caption: string}> = ({caption}) => {
  const p = usePal();
  // pins (x, y) for thread anchors
  const pin = {who: [960, 470], lincoln: [560, 230], johnson: [1290, 225], congress: [1330, 640], petition: [420, 610], except: [1560, 470], forty: [190, 245], herald: [820, 760]} as const;
  const T = (a: keyof typeof pin, b: keyof typeof pin): [number, number, number, number] => [pin[a][0], pin[a][1], pin[b][0], pin[b][1]];
  return (
    <AbsoluteFill style={{background: p.bg}}>
      <Defs />
      <Splats seed="b1" />
      {/* the forty acres map, taped */}
      <Flat x={70} y={210} r={-4}><Photo src="cr_acres.png" w={330} /></Flat>
      <Flat x={110} y={190} r={-14} z={5}><TapeBit w={120} seed="a" /></Flat>
      <Flat x={64} y={420} r={-3}><Strip text="evidence #1 · Jan 1865" seed="e1" size={22} /></Flat>
      <Flat x={80} y={480} r={-6}><Sticky text="whose land?" w={170} size={50} /></Flat>
      {/* Lincoln */}
      <Flat x={470} y={170} r={3}><Photo src="cr_lincoln.png" w={205} /></Flat>
      <Flat x={440} y={420} r={-2}><Strip text="TEN PERCENT" seed="tp" size={28} font={SANS} /></Flat>
      <Flat x={380} y={80} r={-5}><Stamp text="1863" size={34} /></Flat>
      {/* the centre: who decides? */}
      <div style={{position: 'absolute', left: 830, top: 330}}><Silhouette label="WHO DECIDES?" /></div>
      {/* Johnson */}
      <Flat x={1200} y={160} r={-3}><Photo src="cr_johnson.png" w={235} /></Flat>
      <Flat x={1160} y={390} r={6} z={6}><Stamp text="PARDONED" size={40} /></Flat>
      <Flat x={1420} y={120} r={4}><Strip text="president · Apr 1865" seed="pj" size={20} /></Flat>
      {/* the 13th Amendment */}
      <Flat x={1480} y={430} r={2}><Scrap text="Neither slavery nor involuntary servitude, except as a punishment for crime…" mark="except as a punishment for crime" w={380} seed="13" size={25} /></Flat>
      <Flat x={1650} y={640} r={-8}><Sticky text="loophole?" w={170} size={48} /></Flat>
      <Flat x={1500} y={385} r={-3}><Strip text="evidence #6 · 13th Amendment" seed="e6" size={20} /></Flat>
      {/* Congress */}
      <Flat x={1240} y={600} r={-2}><Photo src="cr_stevens.png" w={200} /></Flat>
      <Flat x={1170} y={830} r={-7} z={6}><Stamp text="OVERRIDDEN" size={36} /></Flat>
      {/* the petition */}
      <Flat x={300} y={590} r={-2}><Scrap text="“we wish to have A home if It be but A few acres.”" w={330} seed="pt" size={30} italic /></Flat>
      <Flat x={330} y={555} r={3}><Strip text="Edisto Island · Oct 1865" seed="ed" size={20} /></Flat>
      {/* the Herald */}
      <Flat x={640} y={730} r={1.5}>
        <div style={{width: 380, background: p.paper, clipPath: torn('hd', 'br', 8), padding: '14px 18px 22px', boxSizing: 'border-box'}}>
          <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 34, color: '#1a1a1a', borderBottom: '3px double #1a1a1a', paddingBottom: 4}}>NEW YORK HERALD</div>
          <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 30, color: '#1a1a1a', lineHeight: 1.05, marginTop: 8}}>ASSASSINATION OF PRESIDENT LINCOLN.</div>
          <div style={{fontFamily: MONO, fontSize: 13, color: '#444', marginTop: 8}}>April 15, 1865</div>
        </div>
      </Flat>
      <Flat x={600} y={700} r={-20} z={5}><TapeBit w={110} seed="h" /></Flat>
      <Flat x={1000} y={980} r={0}><Strip text="CASE: RECONSTRUCTION · PART 1" seed="cs" size={22} bg={p.paper} /></Flat>
      {p === BRAND && <div style={{position: 'absolute', left: 1490, top: 940, transform: 'rotate(-3deg)'}}><WornLogo w={360} /></div>}
      <Threads lines={[T('who', 'lincoln'), T('who', 'johnson'), T('who', 'congress'), T('lincoln', 'forty'), T('johnson', 'except'), T('petition', 'who'), T('herald', 'who'), T('forty', 'petition')]} />
      {Object.values(pin).map(([x, y], i) => <Pin key={i} x={x} y={y} />)}
      <Tag text={caption} />
    </AbsoluteFill>
  );
};

export const Collage1: React.FC = () => (
  <TestFrame vignette={0.35}><Ctx.Provider value={HOT}><Board1 caption="Mockup · collage board, one hot accent (set aside: you chose the channel colours)" /></Ctx.Provider></TestFrame>
);
export const Collage2: React.FC = () => (
  <TestFrame vignette={0.35}><Ctx.Provider value={BRAND}><Board1 caption="Mockup · collage board in the channel's colours (coral subject, teal thread) · end of Episode 1" /></Ctx.Provider></TestFrame>
);

// ------------------------------------------------------------------- a close-up case ----------------------------------------
export const Collage3: React.FC = () => {
  const p = BRAND;
  const pin = {booth: [960, 300], lincoln: [420, 260], seward: [962, 690], johnson: [1500, 260]} as const;
  return (
    <TestFrame vignette={0.35}>
      <Ctx.Provider value={BRAND}>
        <AbsoluteFill style={{background: p.bg}}>
          <Defs />
          <Splats seed="c3" />
          {/* Booth at the centre */}
          <Flat x={840} y={210} r={-2}><Photo src="cr_booth.png" w={240} /></Flat>
          <Flat x={820} y={540} r={2}><Strip text="J. WILKES BOOTH · actor" seed="jb" size={26} font={SANS} /></Flat>
          <Flat x={1130} y={600} r={7}><Sticky text="three targets, one night" w={200} size={46} /></Flat>
          {/* the targets */}
          <Flat x={300} y={190} r={3}><Photo src="cr_lincoln.png" w={215} /></Flat>
          <Flat x={270} y={460} r={-3}><Strip text="the President · Ford's Theatre" seed="t1" size={22} /></Flat>
          <Flat x={250} y={540} r={-8} z={6}><Stamp text="SHOT · AFTER 10 P.M." size={36} /></Flat>
          <Flat x={1390} y={190} r={-3}><Photo src="cr_johnson.png" w={240} /></Flat>
          <Flat x={1370} y={460} r={2}><Strip text="the vice president · his hotel" seed="t3" size={22} /></Flat>
          <Flat x={1400} y={540} r={6} z={6}><Stamp text="NEVER ATTACKED" size={36} /></Flat>
          <Flat x={860} y={660} r={1}><Photo src="cr_seward.png" w={205} /></Flat>
          <Flat x={800} y={910} r={-2}><Strip text="the Secretary of State · his home" seed="t2" size={22} /></Flat>
          <Flat x={1090} y={850} r={-6} z={6}><Stamp text="STABBED · SURVIVED" size={34} /></Flat>
          <Flat x={140} y={760} r={-4}><Sticky text="why the vice president?" w={210} size={44} /></Flat>
          <Flat x={1620} y={720} r={5}><Sticky text="who else knew?" w={200} size={46} /></Flat>
          <Threads lines={[[960, 300, 420, 260], [960, 300, 1500, 260], [960, 300, 962, 690]]} />
          {Object.values(pin).map(([x, y], i) => <Pin key={i} x={x} y={y} />)}
          <div style={{position: 'absolute', left: 60, top: 40}}><Strip text="CASE FILE · APRIL 14, 1865" seed="cf" size={34} bg={p.paper} font={SANS} /></div>
          <div style={{position: 'absolute', left: 1560, top: 40, transform: 'rotate(4deg)'}}><WornLogo w={300} /></div>
          <Tag text="Mockup · a close-up case (Episode 1, chapter 4)" />
        </AbsoluteFill>
      </Ctx.Provider>
    </TestFrame>
  );
};

// ------------------------------------------------------------------- a title card in the same language -------------------
export const Collage4: React.FC = () => {
  const p = BRAND;
  return (
    <TestFrame vignette={0.35}>
      <Ctx.Provider value={BRAND}>
        <AbsoluteFill style={{background: p.bg}}>
          <Defs />
          <Splats seed="c4" />
          <Flat x={250} y={170} r={-3}><Strip text="CASE FILE · RECONSTRUCTION · PART 1 OF 3" seed="k1" size={30} bg={p.paper} font={SANS} /></Flat>
          {['LANDLESS.', 'HOMELESS.', 'VOTELESS.'].map((w, i) => (
            <Flat key={w} x={250 + i * 70} y={290 + i * 170} r={[-2, 1.5, -1][i]}>
              <div style={{background: i === 2 ? p.accent : p.paper, clipPath: torn(`w${i}`, 'lrtb', 8), padding: '10px 34px 4px', fontFamily: DISPLAY, fontSize: 150, lineHeight: 1, color: '#151515'}}>{w}</div>
            </Flat>
          ))}
          <Flat x={1340} y={210} r={4}><Photo src="cr_firstvote.png" w={330} /></Flat>
          <Flat x={1380} y={180} r={-12} z={5}><TapeBit w={160} seed="k2" /></Flat>
          <Flat x={1290} y={690} r={-6} z={6}><Stamp text="1865 – 1866" size={48} /></Flat>
          <Flat x={1450} y={800} r={5}><Sticky text="who decides?" w={210} size={52} /></Flat>
          <div style={{position: 'absolute', left: 260, top: 860, transform: 'rotate(-2deg)'}}><WornLogo w={420} /></div>
          <Tag text="Mockup · the title card in the collage language" />
        </AbsoluteFill>
      </Ctx.Provider>
    </TestFrame>
  );
};
