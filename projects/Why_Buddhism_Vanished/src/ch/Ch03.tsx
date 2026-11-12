// Chapter 3 · The religion that stays home (Hinduism): river-valley hearth, the Vedas, 1.2 billion mostly in India and Nepal,
// ethnic religion, puja, many gods, karma and reincarnation, the beef-free menu, Varanasi, the Kumbh Mela, the indenture
// migrations (relocation diffusion), Diwali in the islands, recent migration and Holi, then "moves when people move".
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import words from '../../public/audio/ch03_hinduism.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, onScreen, Photo, Stamp, type TL, useScene} from '../kit/shell';
import {HBars} from '../kit/charts';
import {PAL} from '../kit/look';
import {C, centroid, Dot, type Fill, MapLabel, P, WorldMap} from '../kit/asia';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH03_FRAMES = chapterFrames(N, LEAD);

/** Modern photos stay in colour, muted so the teal and coral marks read on top. */
const MUTED = 'saturate(0.55) contrast(1.08) brightness(0.82)';
/** AI paintings: black and white, a touch darker so notes read over them. */
const PAINT = 'grayscale(1) contrast(1.2) brightness(0.9)';
const GEN: [number, number] = [1376, 768];
const WHITE = '#ffffff';

/** Places used only in this chapter, [lon, lat]. */
const L = {
  trinidad: [-61.3, 10.5] as [number, number],
  guyana: [-58.4, 6.3] as [number, number],
  fiji: [178.0, -17.8] as [number, number],
  mauritius: [57.55, -20.25] as [number, number],
  durban: [31.0, -29.86] as [number, number],
  london: [-0.12, 51.5] as [number, number],
  toronto: [-79.4, 43.7] as [number, number],
  usa: [-88, 39] as [number, number],
  prayagraj: [81.85, 25.43] as [number, number],
  india: [78.5, 22.5] as [number, number],
};
const SOUTH_AFRICA = '710';

/** The two river valleys, traced from real coordinates (source to sea). */
const INDUS: [number, number][] = [[81.3, 30.9], [79.6, 32.4], [77.6, 34.1], [76.0, 35.0], [74.6, 35.7], [73.3, 35.2], [72.7, 34.3], [71.9, 33.8], [71.5, 32.6],
  [71.0, 30.9], [70.4, 29.2], [69.3, 28.2], [68.8, 27.6], [68.2, 26.4], [68.3, 25.4], [67.9, 24.6], [67.4, 24.0]];
const GANGES: [number, number][] = [[78.9, 30.9], [78.2, 30.0], [78.8, 28.6], [79.9, 27.2], [80.4, 26.4], [81.85, 25.43], [83.0, 25.32], [84.2, 25.6], [85.1, 25.6],
  [87.0, 25.25], [87.9, 24.8], [89.0, 24.0], [90.0, 23.4], [90.5, 22.6], [90.7, 22.1]];

// ---------- small drawn pieces ----------

/** A river: a soft teal glow under a crisp line, both drawn on from source to sea. */
const River: React.FC<{pts: number[][]; at: number; dur?: number}> = ({pts, at, dur = 18}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const common = {fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p};
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <path d={d} {...common} stroke={PAL.teal} strokeWidth={26} strokeOpacity={0.22} style={{filter: 'blur(6px)'}} />
      <path d={d} {...common} stroke={PAL.teal} strokeWidth={6} />
    </svg>
  );
};

/** Pops in like a card on the desk. */
const usePop = (at: number) => {
  const g = useGFrame();
  const k = interpolate(g, [at, at + 5], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) * (1 - 2.2 * t * (1 - t))});
  return {show: g >= at, style: {transform: `scale(${0.6 + 0.4 * k})`, opacity: Math.min(1, k * 2)} as React.CSSProperties};
};

/** A teal-ruled index card with a name in Abril and a short handwritten line under it. */
const NameCard: React.FC<{x: number; y: number; w: number; name: string; sub: string; at: number; rot?: number}> = ({x, y, w, name, sub, at, rot = 0}) => {
  const {show, style} = usePop(at);
  if (!show) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, ...style, rotate: `${rot}deg`}}>
      <div style={{background: 'rgba(16,14,11,0.92)', border: `4px solid ${PAL.teal}`, borderRadius: 8, padding: '18px 26px 14px', boxShadow: '0 16px 30px rgba(0,0,0,0.6)'}}>
        <div style={{fontFamily: JF.display, fontSize: 66, lineHeight: 1.05, color: PAL.cream, whiteSpace: 'nowrap'}}>{name}</div>
        <div style={{fontFamily: '"Nanum Pen Script", cursive', fontSize: 50, lineHeight: 1.1, color: PAL.teal, whiteSpace: 'nowrap', marginTop: 6}}>{sub}</div>
      </div>
    </div>
  );
};

/** A circle of arrows (the cycle of rebirth), drawn on in four arcs. */
const Cycle: React.FC<{cx: number; cy: number; r: number; at: number; labels: string[]}> = ({cx, cy, r, at, labels}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const arcs = [0, 1, 2, 3].map((i) => {
    const a0 = -Math.PI / 2 + (i * Math.PI) / 2 + 0.2;
    const a1 = a0 + Math.PI / 2 - 0.4;
    const p = interpolate(g, [at + i * 6, at + i * 6 + 8], [0, 1], clamp);
    const pt = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const [x0, y0] = pt(a0);
    const [x1, y1] = pt(a1);
    const tip = Math.atan2(y1 - cy, x1 - cx) + Math.PI / 2;
    const h = 24;
    return {d: `M${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1}`, p, x1, y1, tip, h};
  });
  const spots = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        {arcs.map((a, i) => (
          <g key={i}>
            <path d={a.d} fill="none" stroke={pal.mark} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a.p} />
            {a.p >= 1 && <path d={`M${a.x1 - a.h * Math.cos(a.tip - 0.5)},${a.y1 - a.h * Math.sin(a.tip - 0.5)} L${a.x1},${a.y1} L${a.x1 - a.h * Math.cos(a.tip + 0.5)},${a.y1 - a.h * Math.sin(a.tip + 0.5)}`}
              fill="none" stroke={pal.mark} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />}
          </g>
        ))}
      </svg>
      {labels.map((l, i) => {
        const [sx, sy] = spots[i];
        const show = g >= at + i * 6;
        if (!show) return null;
        return (
          <div key={l} style={{position: 'absolute', left: cx + sx * (r + 22), top: cy + sy * (r + 30), transform: `translate(${sx > 0 ? '0' : sx < 0 ? '-100%' : '-50%'}, -50%)`,
            fontFamily: JF.mono, fontSize: 30, letterSpacing: 2, textTransform: 'uppercase', color: PAL.cream, whiteSpace: 'nowrap', textShadow: '0 2px 8px #000'}}>{l}</div>
        );
      })}
    </>
  );
};

/** A drawn menu card (no logos): one row struck out with a coral X, the others ticked. */
const MenuCard: React.FC<{x: number; y: number; at: number; strikeAt: number; tickAt: number}> = ({x, y, at, strikeAt, tickAt}) => {
  const g = useGFrame();
  const {show, style} = usePop(at);
  if (!show) return null;
  const rows = [
    {name: 'beef burger', strike: true},
    {name: 'chicken burger'},
    {name: 'veggie burger'},
    {name: 'paneer wrap'},
  ];
  const W = 700, rowH = 110, top = 150;
  const xp = interpolate(g, [strikeAt, strikeAt + 8], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: W, ...style, rotate: '2deg'}}>
      <div style={{position: 'relative', background: '#f4efe6', borderRadius: 6, height: top + rows.length * rowH + 40, boxShadow: '0 20px 40px rgba(0,0,0,0.65)'}}>
        <div style={{position: 'absolute', left: 44, top: 36, fontFamily: JF.mono, fontSize: 30, letterSpacing: 6, color: '#3a342b'}}>MENU · INDIA</div>
        <div style={{position: 'absolute', left: 44, right: 44, top: 100, height: 3, background: '#3a342b', opacity: 0.6}} />
        {rows.map((r, i) => (
          <div key={r.name} style={{position: 'absolute', left: 44, top: top + i * rowH, fontFamily: JF.display, fontSize: 58, color: r.strike && xp > 0 ? 'rgba(17,17,17,0.45)' : INKC, whiteSpace: 'nowrap'}}>{r.name}</div>
        ))}
        <svg width={W} height={top + rows.length * rowH + 40} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          {xp > 0 && (
            <>
              <path d={`M30,${top + 8} L${W - 60},${top + 82}`} stroke={PAL.coral} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, xp * 2)} />
              <path d={`M30,${top + 82} L${W - 60},${top + 8}`} stroke={PAL.coral} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, xp * 2 - 1)} />
            </>
          )}
          {rows.slice(1).map((r, i) => {
            const p = interpolate(g, [tickAt + i * 4, tickAt + i * 4 + 5], [0, 1], clamp);
            const ty = top + (i + 1) * rowH + 40;
            return p > 0 ? <path key={r.name} d={`M${W - 120},${ty} L${W - 98},${ty + 22} L${W - 56},${ty - 26}`} fill="none" stroke="#14907f" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round"
              pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} /> : null;
          })}
        </svg>
      </div>
    </div>
  );
};
const INKC = '#111111';

// ---------- scenes ----------

/** The hearth: the Indus and Ganges valleys glow on a South Asia map. */
const Rivers: React.FC<{t: TL}> = ({t}) => {
  const fills: Fill[] = [C.india, C.pakistan, C.nepal, C.bangladesh].map((id) => ({id, at: 0, color: PAL.cream, opacity: 0.08}));
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: 0, lon: 80, lat: 26, z: 6.2}, {f: t.at('Ganges') + 30, lon: 79, lat: 28.5, z: 7.4}]} fills={fills}>
        {(S) => {
          const ind = INDUS.map((ll) => S(ll));
          const gan = GANGES.map((ll) => S(ll));
          const [ix, iy] = S([69.4, 27.6]);
          const [gx, gy] = S([84.4, 25.9]);
          return (
            <>
              <River pts={ind} at={t.at('Indus') - 2} />
              <River pts={gan} at={t.at('Ganges') - 2} />
              <MapLabel text="Indus" x={ix - 40} y={iy} at={t.at('Indus')} align="right" color={PAL.teal} size={34} />
              <MapLabel text="Ganges" x={gx} y={gy - 56} at={t.at('Ganges')} align="center" color={PAL.teal} size={34} />
            </>
          );
        }}
      </WorldMap>
      <Highlight text="HINDUISM" x={100} y={80} size={96} at={t.at('Hinduism')} seed={301} rot={-2} />
      <Note text="one of the oldest religions on Earth" x={110} y={240} size={46} rot={-3} at={t.at('oldest') - 3} color={WHITE} />
      <Note text="the hearth: two river valleys" x={1060} y={870} size={50} rot={-3} at={t.at('river valleys') - 3} />
      <Tag text="Rivers simplified · Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** No single founder: the Vedic fire ritual painting, the priest in coral. */
const Vedas: React.FC<{t: TL}> = ({t}) => {
  const a = t.at("And it's unusual");
  return (
    <Photo src="img/gen/v1_ch2_vedic_fire.jpg" size={GEN} fx={760} fy={384} z0={1.03} z1={1.1} a={a} b={t.at('Today')} bw={PAINT} mask={MASKS.vedic_priest} traceAt={a + 4} vignette={0.7}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(270deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 55%)'}} />
          <Note text="no single founder" x={1090} y={110} size={56} rot={-3} at={t.at('single') - 3} color={WHITE} />
          <Note text="grew over centuries" x={1110} y={240} size={50} rot={-3} at={t.at('grew') - 3} />
          <Note text="from many traditions" x={1110} y={350} size={50} rot={-2} at={t.at('traditions') - 3} />
          <Highlight text="THE VEDAS" x={1100} y={690} size={92} at={t.at('Vedas')} seed={302} rot={-2} />
          <Note text="ancient sacred texts" x={1130} y={850} size={48} rot={-3} at={t.at('Vedas') + 10} color={WHITE} />
          <Tag text="Illustration · a Vedic fire offering beside a river (AI-generated)" />
        </>
      )}
    </Photo>
  );
};

/** 1.2 billion Hindus, almost all in India and Nepal. */
const Billion: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Today');
  const home = [C.india, C.nepal].map((id) => ({id, at: t.at('India'), color: PAL.orange, opacity: 0.7}));
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 70, lat: 22, z: 1.9}, {f: t.at('India') + 10, lon: 74, lat: 24, z: 3.4}]} fills={home}>
        {(S) => {
          const [nx, ny] = S([84.1, 28.3]);
          const [ix, iy] = S([78.5, 21]);
          return (
            <>
              <MapLabel text="India" x={ix} y={iy} at={t.at('India') + 2} align="center" color={PAL.ink} size={34} />
              <MapLabel text="Nepal" x={nx + 70} y={ny - 40} at={t.at('Nepal') + 2} color={PAL.orange} size={30} />
            </>
          );
        }}
      </WorldMap>
      <Stamp text="1.2 BILLION" x={100} y={140} size={140} at={t.at('1.2')} color={PAL.cream} />
      <Note text="Hindus in the world today" x={110} y={300} size={46} rot={-3} at={t.at('Hindus') - 3} color={WHITE} />
      <Note text="about 95% live in India and Nepal" x={110} y={850} size={52} rot={-3} at={t.at('Almost') - 3} />
      <Tag text="Pew Research Center, 2020 estimates · Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** That tight cluster = an ethnic religion. */
const Ethnic: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('That tight');
  const home = [C.india, C.nepal].map((id) => ({id, at: 0, color: PAL.orange, opacity: 0.7}));
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap x={90} y={150} w={700} h={720} frame keys={[{f: a, lon: 81, lat: 22, z: 3.0}, {f: a + 200, lon: 81, lat: 22, z: 3.3}]} fills={home}>
        {(S) => {
          const [cx, cy] = S([80.5, 22.5]);
          return <Loop cx={cx} cy={cy} rx={250} ry={270} at={t.at('tight')} seed={33} tilt={-6} color={pal.mark} />;
        }}
      </WorldMap>
      <Note text="a tight cluster" x={130} y={60} size={50} rot={-3} at={t.at('tight') - 3} color={WHITE} />
      <Highlight text="ETHNIC RELIGION" x={860} y={150} size={84} at={t.at('ethnic')} seed={303} rot={-2} />
      <Definition term="ethnic religion" def="a religion tied to one people, their culture and their homeland; it rarely seeks converts" at={t.at('ethnic') + 9} x={870} y={300} w={940} />
      <Note text="Indian culture" x={890} y={560} size={50} rot={-3} at={t.at('culture') - 3} />
      <Note text="family" x={1290} y={560} size={50} rot={-3} at={t.at('family') - 3} />
      <Note text="place" x={1500} y={560} size={50} rot={-3} at={t.at('place') - 3} />
      <Note text="generally no push to convert" x={890} y={720} size={54} rot={-3} at={t.at("don't try") - 3} color={pal.subject} />
      <Tag text="Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** Puja at a home shrine: the painting, the woman in coral. */
const Puja: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('You can see');
  return (
    <Photo src="img/gen/v1_ch2_home_puja.jpg" size={GEN} fx={688} fy={384} z0={1.02} z1={1.08} a={a} b={t.at('Many Hindus worship')} bw={PAINT} mask={MASKS.puja_woman} traceAt={a + 4} vignette={0.65}>
      {(place) => {
        const S = onScreen(place);
        const [sx, sy] = S(400, 330);
        const [px, py] = S(655, 290);
        return (
          <>
            <Note text="daily life" x={90} y={70} size={56} rot={-3} at={t.at('daily') - 3} color={WHITE} />
            <Note text="a small home shrine" x={70} y={660} size={50} rot={-3} at={t.at('shrine') - 3} />
            <Arrow x1={300} y1={650} x2={sx} y2={sy + 30} bow={-40} at={t.at('shrine')} />
            <Loop cx={px} cy={py} rx={95} ry={60} at={t.at('lighting')} seed={34} tilt={-8} />
            <Highlight text="PUJA" x={1400} y={90} size={110} at={t.at('puja')} seed={304} rot={-2} />
            <Definition term="puja" def="worship: offering flowers or food, lighting a lamp, saying a prayer" at={t.at('puja') + 9} x={1390} y={270} w={470} />
            <Tag text="Illustration · daily puja at a home shrine (AI-generated)" />
          </>
        );
      }}
    </Photo>
  );
};

/** One ultimate reality, many gods and goddesses (as cards, no drawn faces). */
const Gods: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Many Hindus worship');
  const cx = 960, cy = 560;
  const cards = [
    {word: 'Vishnu', sub: 'the preserver', x: 150, y: 250, ax: 520, ay: 330},
    {word: 'Shiva', sub: 'destroyer + renewer', x: 1290, y: 250, ax: 1290, ay: 330},
    {word: 'Lakshmi', sub: 'goddess of fortune', x: 150, y: 700, ax: 560, ay: 760},
    {word: 'Ganesh', sub: 'remover of obstacles', x: 1240, y: 700, ax: 1240, ay: 760},
  ];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="many Hindus: one ultimate reality, many forms" x={110} y={50} size={50} rot={-2} at={a - 3} color={WHITE} />
      <Loop cx={cx} cy={cy} rx={230} ry={120} at={t.at('one ultimate')} seed={35} tilt={-4} color={pal.mark} />
      {useGFrame() >= t.at('one ultimate') + 4 && (
        <div style={{position: 'absolute', left: cx, top: cy, transform: 'translate(-50%, -50%)', textAlign: 'center', fontFamily: JF.display, fontSize: 52, lineHeight: 1.1, color: PAL.orange, whiteSpace: 'nowrap',
          textShadow: '0 4px 16px rgba(0,0,0,0.8)'}}>one ultimate<br />reality</div>
      )}
      {cards.map((c, i) => (
        <React.Fragment key={c.word}>
          <Arrow x1={cx + (c.ax < cx ? -200 : 200)} y1={cy + (c.ay < cy ? -70 : 70)} x2={c.ax} y2={c.ay} bow={i % 2 ? 30 : -30} at={t.at(c.word) - 1} dur={6} />
          <NameCard x={c.x} y={c.y} w={480} name={c.word} sub={c.sub} at={t.at(c.word)} rot={i % 2 ? 2 : -2} />
        </React.Fragment>
      ))}
      <Note text="elephant-headed" x={1290} y={930} size={44} rot={-3} at={t.at('elephant-headed') - 3} color={pal.subject} />
      <Note text="gods and goddesses" x={720} y={780} size={46} rot={-3} at={t.at('gods') - 3} />
      <Tag text="Names only: Hindu traditions honour many more gods and goddesses" />
    </AbsoluteFill>
  );
};

/** Karma and reincarnation: two definitions and the cycle of rebirth. */
const Karma: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="KARMA" x={100} y={90} size={96} at={t.at('karma')} seed={305} rot={-2} />
      <Definition term="karma" def="your actions, good or bad, shape what comes back to you" at={t.at('karma') + 9} x={110} y={250} w={980} />
      <Highlight text="REINCARNATION" x={100} y={470} size={96} at={t.at('reincarnation')} seed={306} rot={-2} />
      <Definition term="reincarnation" def="the belief that the soul is reborn into new lives" at={t.at('reincarnation') + 9} x={110} y={630} w={980} />
      <Cycle cx={1480} cy={500} r={210} at={t.at('soul')} labels={['birth', 'life', 'death', 'rebirth']} />
      {useGFrame() >= t.at('soul') + 22 && (
        <div style={{position: 'absolute', left: 1480, top: 500, transform: 'translate(-50%, -50%)', fontFamily: JF.display, fontSize: 46, color: PAL.cream, textAlign: 'center', lineHeight: 1.1}}>the<br />soul</div>
      )}
      <Note text="shapes how people live" x={130} y={850} size={54} rot={-3} at={t.at('shape how') - 3} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** It even shows up on the menu: no beef. */
const Menu: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="it even shows up on the menu" x={100} y={70} size={52} rot={-3} at={t.at('menu') - 3} color={WHITE} />
      <Note text="many Hindus are vegetarian" x={110} y={250} size={50} rot={-3} at={t.at('vegetarian') - 3} />
      <Note text="the cow is sacred" x={110} y={370} size={50} rot={-3} at={t.at('cow') - 3} />
      <Note text="McDonald's in India:" x={110} y={530} size={50} rot={-3} at={t.at("McDonald's") - 3} color={WHITE} />
      <Note text="(almost nowhere else does this)" x={110} y={640} size={42} rot={-3} at={t.at('nowhere') - 3} color={WHITE} />
      <MenuCard x={1060} y={200} at={t.at("McDonald's") + 2} strikeAt={t.at('dropped')} tickAt={t.at('beef completely') + 6} />
      <Highlight text="NO BEEF" x={110} y={790} size={110} at={t.at('beef')} seed={307} rot={-2} />
      <Note text="chicken + veg instead" x={1150} y={930} size={46} rot={-3} at={t.at('completely') + 4} color={pal.mark} />
      <Tag text="Drawn menu, simplified · McDonald's India serves no beef" />
    </AbsoluteFill>
  );
};

/** Varanasi at dawn. */
const Varanasi: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('And it shows up in');
  return (
    <Photo src="img/ch02/varanasi_sunrise_crowd.jpg" size={[1920, 1238]} fx={960} fy={700} z0={1.02} z1={1.1} a={a} b={t.at('Every few')} bw={MUTED} vignette={0.6}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 35%)'}} />
          <Note text="...and in the landscape" x={100} y={60} size={50} rot={-3} at={t.at('landscape') - 3} color={WHITE} />
          <Highlight text="VARANASI" x={100} y={170} size={96} at={t.at('Varanasi')} seed={308} rot={-2} />
          <Note text="the Ganges at dawn" x={1180} y={180} size={52} rot={-3} at={t.at('dawn') - 3} />
          <Note text="its water washes away sins" x={1020} y={430} size={50} rot={-3} at={t.at('washes') - 3} color={WHITE} />
          <Tag text="Varanasi, India · Ninara, CC BY 2.0, via Wikimedia Commons" />
        </>
      )}
    </Photo>
  );
};

/** The Kumbh Mela crowd. */
const Kumbh: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Every few');
  return (
    <Photo src="img/ch02/kumbh_crowd_bridge.jpg" size={[1920, 1277]} fx={960} fy={720} z0={1.02} z1={1.12} a={a} b={t.at('At the 2025')} bw={MUTED} vignette={0.6}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 40%)'}} />
          <Note text="every few years" x={100} y={50} size={50} rot={-3} at={t.at('Every few') - 3} color={WHITE} />
          <Highlight text="KUMBH MELA" x={100} y={160} size={100} at={t.at('Kumbh')} seed={309} rot={-2} />
          <Note text="a pilgrimage festival" x={110} y={330} size={50} rot={-3} at={t.at('pilgrimage') - 3} />
          <Note text="big enough to see from space" x={1000} y={60} size={46} rot={-3} at={t.at('see it from') - 3} color={WHITE} />
          <Tag text="Kumbh Mela 2019, crowd near Shastri Bridge, Prayagraj · Michael T Balonek, CC BY-SA 4.0, via Wikimedia Commons" />
        </>
      )}
    </Photo>
  );
};

/** 600 million visits vs the US population. */
const Visits: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src="img/ch02/kumbh_sadhu.jpg" size={[1920, 1276]} x={110} y={130} w={600} h={760} fx={1300} fy={640} scale={0.6} rot={-2} at={t.at('At the 2025') + 1} bw={MUTED} />
      <Note text="2025 · Prayagraj" x={860} y={90} size={52} rot={-3} at={t.at('Prayagraj') - 3} color={WHITE} />
      <Stamp text="600 MILLION" x={850} y={270} size={120} at={t.at('600')} color={PAL.coral} />
      <Note text="visits in six weeks" x={870} y={380} size={48} rot={-3} at={t.at('six weeks') - 3} />
      {useGFrame() >= t.at("That's nearly") && <HBars x={870} y={640} w={560} rowH={64} gap={130} max={6.0e8} at={t.at("That's nearly")}
        unit={(v) => (v > 5e8 ? '600M+' : '340M')}
        rows={[
          {label: 'Kumbh Mela visits', parts: [{label: 'visits', value: 6.0e8, subject: true}]},
          {label: 'U.S. population', parts: [{label: 'people', value: 3.4e8}]},
        ]} />}
      <Note text="nearly twice!" x={1480} y={880} size={50} rot={-4} at={t.at('twice') + 6} color={pal.subject} />
      <Tag text="Sadhu at the Kumbh Mela · Michael T Balonek, CC BY-SA 4.0, via Wikimedia Commons · Data: Uttar Pradesh govt. estimate; U.S. Census Bureau" />
    </AbsoluteFill>
  );
};

/** The question: if it stays home, why temples in the Caribbean and the Pacific? */
const Question: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('But wait');
  const home = [C.india, C.nepal].map((id) => ({id, at: a, color: PAL.orange, opacity: 0.7}));
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 55, lat: 5, z: 1.05}, {f: a + 160, lon: 55, lat: 5, z: 1.12}]} fills={home}>
        {(S) => {
          const [tx, ty] = S(L.trinidad);
          const [fx, fy] = S(L.fiji);
          return (
            <>
              <Dot x={tx} y={ty} at={t.at('Caribbean')} r={10} color={pal.subject} />
              <Note text="?" x={tx - 20} y={ty - 130} size={80} rot={-4} at={t.at('Caribbean')} color={pal.subject} />
              <MapLabel text="Caribbean" x={tx} y={ty + 50} at={t.at('Caribbean')} align="center" size={28} />
              <Dot x={fx} y={fy} at={t.at('Pacific')} r={10} color={pal.subject} />
              <Note text="?" x={fx - 20} y={fy - 130} size={80} rot={-4} at={t.at('Pacific')} color={pal.subject} />
              <MapLabel text="Pacific" x={fx} y={fy + 50} at={t.at('Pacific')} align="right" size={28} />
            </>
          );
        }}
      </WorldMap>
      <Note text="but wait..." x={100} y={60} size={56} rot={-3} at={a - 3} color={WHITE} />
      <Note text="if it stays home, why are there Hindu temples way out here?" x={120} y={880} size={48} rot={-2} at={t.at('why') - 3} />
      <Tag text="Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** 1830s: Britain abolishes slavery; plantations need new workers. A drawn timeline. */
const Timeline: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const x0 = 180, x1 = 1740, y = 560;
  const X = (yr: number) => x0 + ((yr - 1830) / 90) * (x1 - x0);
  const lineP = interpolate(g, [t.at("Here's what") , t.at("Here's what") + 10], [0, 1], clamp);
  const brP = interpolate(g, [t.at('needed'), t.at('needed') + 12], [0, 1], clamp);
  const ticks = [1830, 1850, 1870, 1890, 1910];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="THE 1830s" x={100} y={80} size={96} at={t.at('1830s')} seed={310} rot={-2} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <path d={`M${x0},${y} L${x1},${y}`} stroke={pal.mark} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lineP} />
        {lineP >= 1 && ticks.map((yr) => <line key={yr} x1={X(yr)} y1={y - 14} x2={X(yr)} y2={y + 14} stroke={pal.mark} strokeWidth={4} />)}
        {brP > 0 && <path d={`M${X(1834)},${y + 90} L${X(1834)},${y + 110} L${X(1834) + (X(1917) - X(1834)) * brP},${y + 110}${brP >= 1 ? ` L${X(1917)},${y + 90}` : ''}`}
          fill="none" stroke={PAL.orange} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
      {lineP >= 1 && ticks.map((yr) => (
        <div key={yr} style={{position: 'absolute', left: X(yr), top: y - 50, transform: 'translate(-50%, -50%)', fontFamily: JF.mono, fontSize: 26, color: 'rgba(244,239,230,0.7)', letterSpacing: 2}}>{yr}</div>
      ))}
      <Dot x={X(1834)} y={y} at={t.at('abolished')} r={13} color={pal.subject} />
      <Note text="1834: Britain ends slavery in its colonies" x={X(1834) - 30} y={y - 230} size={48} rot={-3} at={t.at('abolished') - 3} color={WHITE} />
      <Note text="plantation owners need new workers" x={300} y={y + 150} size={50} rot={-2} at={t.at('plantation') - 3} />
      <Dot x={X(1917)} y={y} at={t.at('new workers') + 4} r={11} color={PAL.orange} />
      <Note text="1917: system ends" x={X(1917) - 380} y={y - 130} size={44} rot={-3} at={t.at('new workers') + 4} color={PAL.orange} />
      <Tag text="Slavery Abolition Act (1833, in force 1834); Indian indenture ended 1917" />
    </AbsoluteFill>
  );
};

/** Indentured laborers: the arrival painting, the woman in coral. */
const Indenture: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('So the British');
  return (
    <Photo src="img/gen/v1_ch2_indenture_arrival.jpg" size={GEN} fx={688} fy={384} z0={1.02} z1={1.08} a={a} b={t.at("That's relocation")} bw={'grayscale(1) contrast(1.2) brightness(0.8)'} mask={MASKS.indenture_woman} traceAt={a + 4} vignette={0.7}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(270deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 75%)'}} />
          <Note text="1830s - 1917" x={1000} y={60} size={56} rot={-3} at={t.at('recruited') - 3} color={WHITE} />
          <Note text="hundreds of thousands of Indians" x={1000} y={170} size={46} rot={-3} at={t.at('hundreds') - 3} />
          <Highlight text="INDENTURED LABORERS" x={880} y={300} size={70} at={t.at('indentured')} seed={311} rot={-2} />
          <Definition term="indentured laborer" def="a worker bound by contract to work for years, far from home" at={t.at('indentured') + 9} x={890} y={430} w={900} />
          <Note text="to sugar plantations" x={1000} y={640} size={48} rot={-3} at={t.at('sugar') - 3} />
          <Note text="they brought their religion with them" x={820} y={850} size={46} rot={-3} at={t.at('brought') - 3} color={pal.subject} />
          <Tag text="Illustration · indentured workers arriving at a colonial port (AI-generated)" />
        </>
      )}
    </Photo>
  );
};

/** Relocation diffusion: arrows from India to the old sugar colonies. */
const DEST = [
  {word: 'Trinidad', label: 'Trinidad and Tobago', ll: L.trinidad, id: C.trinidad, dx: 30, dy: -44, bow: 120, align: 'left' as const},
  {word: 'Guyana', label: 'Guyana', ll: L.guyana, id: C.guyana, dx: 30, dy: 44, bow: 140, align: 'left' as const},
  {word: 'Fiji', label: 'Fiji', ll: L.fiji, id: C.fiji, dx: -30, dy: 50, bow: -80, align: 'right' as const},
  {word: 'Mauritius', label: 'Mauritius', ll: L.mauritius, id: C.mauritius, dx: 30, dy: 30, bow: -30, align: 'left' as const},
  {word: 'relocation', label: 'South Africa', ll: L.durban, id: SOUTH_AFRICA, dx: -30, dy: 46, bow: -40, align: 'right' as const},
];

const Relocation: React.FC<{t: TL}> = ({t}) => {
  const a = t.at("That's relocation");
  const fills: Fill[] = [{id: C.india, at: a, color: PAL.orange, opacity: 0.7}, {id: C.nepal, at: a, color: PAL.orange, opacity: 0.7}];
  for (const d of DEST) fills.push({id: d.id, at: t.at(d.word) + (d.word === 'relocation' ? 14 : 2), color: PAL.orange, opacity: 0.45});
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 58, lat: -2, z: 1.2}, {f: a + 190, lon: 58, lat: -2, z: 1.26}]} fills={fills}>
        {(S) => {
          const [ix, iy] = S(L.india);
          return (
            <>
              {DEST.map((d) => {
                const [x, y] = S(d.ll);
                const at = t.at(d.word) + (d.word === 'relocation' ? 14 : 0);
                return (
                  <React.Fragment key={d.label}>
                    <Arrow x1={ix} y1={iy} x2={x + (x > ix ? -10 : 10)} y2={y - 8} bow={d.bow} at={at} dur={8} width={5} />
                    <Dot x={x} y={y} at={at + 8} r={8} color={PAL.orange} ring={false} />
                    <MapLabel text={d.label} x={x + d.dx} y={y + d.dy} at={at + 4} align={d.align} size={28} />
                  </React.Fragment>
                );
              })}
            </>
          );
        }}
      </WorldMap>
      <Highlight text="RELOCATION DIFFUSION" x={100} y={70} size={78} at={t.at('relocation')} seed={312} rot={-2} />
      <Definition term="relocation diffusion" def="a culture spreads because people move and carry it with them" at={t.at('relocation') + 9} x={110} y={200} w={1000} />
      <Tag text="Main destinations of Indian indentured laborers, 1834-1917 · Map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** Diwali as a national holiday; Mauritius about half Hindu. */
const Islands: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const m2 = t.at('Mauritius', 2);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src="img/ch02/fiji_temple.jpg" size={[1920, 2560]} x={130} y={150} w={480} h={600} fx={900} fy={1150} scale={0.32} rot={-3} at={t.at('Diwali') + 1} bw={MUTED} />
      <CropCard src="img/ch02/mauritius_ganga_talao.jpg" size={[1920, 1280]} x={820} y={170} w={900} h={520} fx={760} fy={700} scale={0.62} rot={2} at={t.at('Diwali') + 4} bw={MUTED} outline={false} />
      <MapLabel text="Fiji" x={140} y={110} at={t.at('Diwali') + 1} size={30} color={PAL.teal} />
      <MapLabel text="Mauritius" x={830} y={130} at={t.at('Diwali') + 4} size={30} color={PAL.teal} />
      <Highlight text="DIWALI" x={110} y={820} size={96} at={t.at('Diwali')} seed={313} rot={-2} />
      <Note text="festival of lights = a national holiday" x={560} y={830} size={46} rot={-3} at={t.at('national') - 3} />
      <Loop cx={1270} cy={430} rx={500} ry={320} at={m2} seed={36} tilt={-3} color={pal.subject} />
      <Note text="Mauritius: about half Hindu" x={1060} y={730} size={50} rot={-3} at={t.at('half') - 3} color={pal.subject} />
      <Note text="(off the coast of Africa)" x={1120} y={940} size={40} rot={-3} at={t.at('Africa') - 3} color={WHITE} />
      <Tag text="Nadi temple, Fiji · Dead.rabbit / Ganga Talao, Mauritius · Diego Delso · both CC BY-SA 4.0, via Wikimedia Commons" />
    </AbsoluteFill>
  );
};

/** More recent migration: UK, Canada, United States. */
const Migration: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('More recent');
  const dests = [
    {word: 'UK', label: 'UK', ll: L.london, id: C.uk, dx: -24, dy: -40, align: 'right' as const, bow: 60},
    {word: 'Canada', label: 'Canada', ll: L.toronto, id: C.canada, dx: 0, dy: -50, align: 'center' as const, bow: 120},
    {word: 'United States', nth: 2, label: 'United States', ll: L.usa, id: C.usa, dx: 0, dy: 50, align: 'center' as const, bow: 140},
  ];
  const fills: Fill[] = [{id: C.india, at: a, color: PAL.orange, opacity: 0.7}, {id: C.nepal, at: a, color: PAL.orange, opacity: 0.7},
    ...dests.map((d) => ({id: d.id, at: t.at(d.word, d.nth ?? 1), color: PAL.teal, opacity: 0.22}))];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 0, lat: 32, z: 1.45}, {f: a + 200, lon: 0, lat: 32, z: 1.52}]} fills={fills}>
        {(S) => {
          const [ix, iy] = S(L.india);
          return (
            <>
              {dests.map((d) => {
                const [x, y] = S(d.ll);
                const at = t.at(d.word, d.nth ?? 1);
                return (
                  <React.Fragment key={d.label}>
                    <Arrow x1={ix} y1={iy} x2={x + 12} y2={y + 6} bow={d.bow} at={at} dur={8} width={5} />
                    <Dot x={x} y={y} at={at + 8} r={9} color={pal.mark} ring={false} />
                    <MapLabel text={d.label} x={x + d.dx} y={y + d.dy} at={at + 3} align={d.align} size={30} />
                  </React.Fragment>
                );
              })}
            </>
          );
        }}
      </WorldMap>
      <Note text="more recent migration" x={100} y={60} size={54} rot={-3} at={a - 3} color={WHITE} />
      <Note text="sometimes the culture travels further than the religion" x={110} y={900} size={46} rot={-2} at={t.at('sometimes') - 3} color={pal.subject} />
      <Tag text="Map: Natural Earth" x={1500} />
    </AbsoluteFill>
  );
};

/** Holi and the color run. */
const Holi: React.FC<{t: TL}> = ({t}) => {
  const a = t.at("If you've ever");
  return (
    <Photo src="img/ch02/holi_colors.jpg" size={[1920, 1676]} fx={960} fy={760} z0={1.02} z1={1.1} a={a} b={t.at('So Hinduism mostly')} bw={MUTED} vignette={0.7}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 40%)'}} />
          <Note text="ever done a color run?" x={100} y={60} size={54} rot={-3} at={t.at('color run') - 3} color={WHITE} />
          <Highlight text="HOLI" x={100} y={190} size={120} at={t.at('Holi')} seed={314} rot={-2} />
          <Note text="the Hindu festival of colors" x={110} y={380} size={50} rot={-3} at={t.at('festival of colors') - 3} />
          <Tag text="Lathmar Holi 2022 in Nandgaon, Uttar Pradesh · Sachinghai09, edited by Radomianin, CC BY-SA 4.0, via Wikimedia Commons" />
        </>
      )}
    </Photo>
  );
};

/** The takeaway: mostly stays home; moves when people move. Then: next door. */
const Ending: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('So Hinduism mostly');
  const home = [C.india, C.nepal].map((id) => ({id, at: a, color: PAL.orange, opacity: 0.7}));
  const spots = [L.trinidad, L.guyana, L.fiji, L.mauritius, L.durban, L.london, L.toronto, L.usa];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 40, lat: 12, z: 1.15}, {f: t.at('Now compare'), lon: 40, lat: 12, z: 1.22}, {f: t.at('born') + 6, lon: 82, lat: 24, z: 4.2}]} fills={home}>
        {(S) => {
          const [bx, by] = S(P.bodhGaya);
          return (
            <>
              {spots.map((ll, i) => {
                const [x, y] = S(ll);
                return <Dot key={i} x={x} y={y} at={t.at('moves') + i * 2} r={7} color={PAL.orange} ring={false} />;
              })}
              <Dot x={bx} y={by} at={t.at('born') + 8} r={13} color={pal.subject} />
              <Arrow x1={1250} y1={290} x2={bx + 22} y2={by - 20} bow={-50} at={t.at('born') + 8} color={pal.subject} />
            </>
          );
        }}
      </WorldMap>
      <Note text="...the religion born next door" x={1020} y={190} size={50} rot={-3} at={t.at('born') + 6} color={pal.subject} />
      <Note text="mostly stays home" x={100} y={70} size={56} rot={-3} at={t.at('mostly') - 3} color={WHITE} />
      <Note text="when it moves, it's because people move" x={110} y={880} size={52} rot={-2} at={t.at('because people') - 3} />
      <Tag text="Map: Natural Earth" x={1500} />
    </AbsoluteFill>
  );
};

// ---------- the chapter ----------

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Rivers t={t} />],
    [at("And it's unusual") - 1, <Vedas t={t} />],
    [at('Today') - 1, <Billion t={t} />],
    [at('That tight') - 1, <Ethnic t={t} />],
    [at('You can see') - 1, <Puja t={t} />],
    [at('Many Hindus worship') - 1, <Gods t={t} />],
    [at('Ideas like') - 1, <Karma t={t} />],
    [at('It even shows') - 1, <Menu t={t} />],
    [at('And it shows up in') - 1, <Varanasi t={t} />],
    [at('Every few') - 1, <Kumbh t={t} />],
    [at('At the 2025') - 1, <Visits t={t} />],
    [at('But wait') - 1, <Question t={t} />],
    [at("Here's what happened") - 1, <Timeline t={t} />],
    [at('So the British') - 1, <Indenture t={t} />],
    [at("That's relocation") - 1, <Relocation t={t} />],
    [at('Diwali') - 1, <Islands t={t} />],
    [at('More recent') - 1, <Migration t={t} />],
    [at("If you've ever") - 1, <Holi t={t} />],
    [at('So Hinduism mostly') - 1, <Ending t={t} />],
  ];
  const scene = useScene(cuts);
  // stamps on every Highlight / Stamp; marker under every Note (3 frames early); ticks on pins, arrows and cards
  const stamps = [at('Hinduism'), at('Vedas'), at('1.2'), at('ethnic'), at('puja'), at('karma'), at('reincarnation'), at('beef'), at('Varanasi'), at('Kumbh'),
    at('600'), at('1830s'), at('indentured'), at('relocation'), at('Diwali'), at('Holi')];
  const notes = [at('oldest'), at('river valleys'), at('single'), at('grew'), at('traditions'), at('Vedas') + 10, at('Hindus'), at('Almost'), at('tight'), at('culture'),
    at('family'), at('place'), at("don't try"), at('daily'), at('shrine'), at('Many Hindus worship'), at('gods'), at('elephant-headed'), at('shape how'), at('menu'),
    at('vegetarian'), at('cow'), at("McDonald's"), at('nowhere'), at('completely') + 4, at('landscape'), at('dawn'), at('washes'), at('Every few'), at('pilgrimage'),
    at('see it from'), at('Prayagraj'), at('six weeks'), at('twice') + 6, at('But wait'), at('why'), at('abolished'), at('plantation'), at('recruited'), at('hundreds'),
    at('sugar'), at('brought'), at('national'), at('half'), at('Africa'), at('More recent'), at('sometimes'), at('color run'), at('festival of colors'), at('mostly'),
    at('because people')];
  const ticks = [at('Indus'), at('Ganges'), at('India'), at('Nepal'), at('shrine'), at('Vishnu'), at('Shiva'), at('Lakshmi'), at('Ganesh'), at('soul'), at("McDonald's") + 2,
    at('Caribbean'), at('Pacific'), at('new workers') + 4, at('Trinidad'), at('Guyana'), at('Fiji'), at('Mauritius'), at('relocation') + 14, at('UK'), at('Canada'),
    at('United States', 2), at('moves'), at('born') + 8];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={'w' + i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {stamps.map((f, i) => <Sfx key={'s' + i} at={f} src="sfx/stamp.wav" volume={0.27} />)}
      {notes.map((f, i) => <Sfx key={'n' + i} at={f - 3} src={WRITE.src} volume={WRITE.volume} />)}
      {ticks.map((f, i) => <Sfx key={'t' + i} at={f} src="sfx/tick.wav" volume={0.4} />)}
      <Sfx at={at('dropped')} src="sfx/marker_tick.wav" volume={0.3} />
    </AbsoluteFill>
  );
};

export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch03_hinduism.wav" lead={LEAD} music={[{src: 'music/g_world_outside.mp3', volume: 0.2}]}>
    <Body />
  </ChapterShell>
);
