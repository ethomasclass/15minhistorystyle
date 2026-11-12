// Chapter 2 · Who gets to join? The vocabulary chapter: universalizing vs ethnic religions, the hearth, diffusion,
// and the three diffusion types (relocation, contagious, hierarchical), each drawn as a small dot diagram on the desk
// and brought back side by side at the end.
import React from 'react';
import {AbsoluteFill, interpolate, random} from 'remotion';
import words from '../../public/audio/ch02_who_joins.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, Definition, DrawnCrown, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {Person} from '../kit/figures';
import {PAL} from '../kit/look';
import {Dot, MapLabel, P, type ToScreen, WorldMap} from '../kit/asia';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);

const WHITE = '#ffffff';
/** Frame number far in the past: a diagram drawn this way is already complete. */
const DONE = -999;

/** Places used only in this chapter, [lon, lat]. */
const L = {
  jerusalem: [35.21, 31.77] as [number, number],
  mecca: [39.83, 21.42] as [number, number],
  ganges: [81.85, 25.43] as [number, number], // Prayagraj, middle Ganges valley
};

/** Where universalizing religions travel to in the fan-out diagram (generic, not one religion). */
const FAR: [number, number][] = [
  [138, 36], [114, -1], [134, -25], [100, 15], [10, 49], [60, 56], [2, 9], [25, -5], [-47, -12], [-96, 40],
];
const ORIGIN: [number, number] = [80, 24];
/** A tight cluster around the origin, for the ethnic side. */
const CLUSTER: [number, number][] = Array.from({length: 12}, (_, i) => {
  const a = random(`cl-a${i}`) * Math.PI * 2;
  const r = Math.sqrt(random(`cl-r${i}`)) * 6;
  return [ORIGIN[0] + Math.cos(a) * r, ORIGIN[1] + Math.sin(a) * r * 0.8] as [number, number];
});

// ---------- small drawn pieces ----------

/** A small flame marker for a hearth: pops in, then flickers. */
const Flame: React.FC<{x: number; y: number; at: number; s?: number}> = ({x, y, at, s = 1}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 4, at + 7], [0, 1.3, 1], clamp) * (1 + 0.06 * Math.sin((g - at) / 2.5));
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
      <g transform={`translate(${x} ${y}) scale(${k * s})`}>
        <ellipse cx={0} cy={2} rx={20} ry={8} fill="rgba(255,111,97,0.35)" />
        <path d="M0,-46 C14,-30 22,-18 18,-4 C15,6 7,10 0,10 C-7,10 -15,6 -18,-4 C-22,-18 -8,-26 0,-46 Z" fill={PAL.coral} stroke="#111" strokeWidth={3} />
        <path d="M0,-22 C6,-14 9,-8 7,-1 C5,4 2,5 0,5 C-2,5 -6,4 -7,-1 C-8,-8 -3,-13 0,-22 Z" fill={PAL.orange} />
      </g>
    </svg>
  );
};

/** Rings spreading out from a point, again and again (a religion moving out from its hearth). */
const Ripple: React.FC<{x: number; y: number; at: number; r?: number}> = ({x, y, at, r = 90}) => {
  const g = useGFrame();
  if (g < at) return null;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
      {[0, 1, 2].map((i) => {
        const p = ((g - at) / 30 + i / 3) % 1;
        if (g - at < (i * 30) / 3) return null;
        return <circle key={i} cx={x} cy={y} r={14 + p * r} fill="none" stroke={PAL.teal} strokeWidth={8 - p * 5} strokeOpacity={1 - p} />;
      })}
    </svg>
  );
};

/** Mono caps header for the two columns. */
const Head: React.FC<{text: string; x: number; y: number; at: number; color: string}> = ({text, x, y, at, color}) => {
  const g = useGFrame();
  if (g < at) return null;
  return <div style={{position: 'absolute', left: x, top: y, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color, opacity: interpolate(g, [at, at + 4], [0, 1], clamp)}}>{text}</div>;
};

/** A dot that pops in (local SVG coordinates). */
const pop = (g: number, at: number) => interpolate(g, [at, at + 3, at + 6], [0, 1.35, 1], clamp);

// ---------- the three diffusion diagrams (local 1500 x 520 box, so they can be reused small) ----------

const BOX = {w: 1500, h: 520};

/** RELOCATION: a believer leaves the hearth, travels far, and a new cluster grows where they settle. */
const RelocationDia: React.FC<{a0: number; a1: number; a2: number}> = ({a0, a1, a2}) => {
  const g = useGFrame();
  const pal = usePal();
  const home = [260, 300];
  const away = [1240, 300];
  const dots = (c: number[], seed: string, n: number) => Array.from({length: n}, (_, i) => {
    const a = random(`${seed}a${i}`) * Math.PI * 2;
    const r = 18 + Math.sqrt(random(`${seed}r${i}`)) * 80;
    return [c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r * 0.75];
  });
  const hd = dots(home, 'rh', 11);
  const nd = dots(away, 'rn', 9);
  const p0 = [home[0] + 60, home[1] - 70];
  const p2 = [away[0] - 40, away[1] - 60];
  const cp = [(p0[0] + p2[0]) / 2, -60];
  const p = interpolate(g, [a1, a2], [0, 1], clamp);
  const q = (u: number) => [(1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * cp[0] + u * u * p2[0], (1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * cp[1] + u * u * p2[1]];
  const [mx, my] = q(p);
  const settled = g >= a2;
  return (
    <svg width={BOX.w} height={BOX.h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {g >= a0 && <ellipse cx={home[0]} cy={home[1]} rx={130} ry={105} fill="rgba(47,224,196,0.08)" stroke={PAL.teal} strokeOpacity={0.5} strokeWidth={3} strokeDasharray="10 8" />}
      {hd.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={15 * pop(g, a0 + i)} fill={PAL.teal} stroke="#111" strokeWidth={3} />)}
      {g >= a2 && <ellipse cx={away[0]} cy={away[1]} rx={130} ry={105} fill="rgba(47,224,196,0.08)" stroke={PAL.teal} strokeOpacity={0.5} strokeWidth={3} strokeDasharray="10 8" />}
      {nd.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={15 * pop(g, a2 + 2 + i * 1.5)} fill={PAL.teal} stroke="#111" strokeWidth={3} />)}
      {g >= a1 && <circle cx={settled ? away[0] : mx} cy={settled ? away[1] : my} r={19} fill={PAL.coral} stroke="#111" strokeWidth={4} />}
    </svg>
  );
};

/** The dashed route of the relocation diagram, drawn on as the believer travels (separate so it sits under the dots). */
const RelocationRoute: React.FC<{a1: number; a2: number}> = ({a1, a2}) => {
  const g = useGFrame();
  if (g < a1) return null;
  const p = interpolate(g, [a1, a2], [0, 1], clamp);
  const p0 = [320, 230];
  const p2 = [1200, 240];
  const cp = [(p0[0] + p2[0]) / 2, -60];
  const pts: string[] = [];
  for (let i = 0; i <= 60 * p; i++) {
    const u = i / 60;
    pts.push(`${((1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * cp[0] + u * u * p2[0]).toFixed(1)},${((1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * cp[1] + u * u * p2[1]).toFixed(1)}`);
  }
  return (
    <svg width={BOX.w} height={BOX.h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <polyline points={pts.join(' ')} fill="none" stroke={PAL.teal} strokeWidth={5} strokeDasharray="16 14" strokeLinecap="round" />
    </svg>
  );
};

/** CONTAGIOUS: one dot lights, then its neighbours, then theirs, out across the grid. */
const ContagiousDia: React.FC<{a: number; per?: number}> = ({a, per = 9}) => {
  const g = useGFrame();
  const cols = 13, rows = 5, dx = 112, dy = 104;
  const ox = 78, oy = 52;
  const o = [6, 2];
  const pts: {x: number; y: number; c: number; r: number; d: number}[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = ox + c * dx + (r % 2 ? dx / 2 : 0) - (r % 2 ? 0 : 0);
      const y = oy + r * dy;
      const jx = (random(`cg${r}-${c}`) - 0.5) * 22, jy = (random(`ch${r}-${c}`) - 0.5) * 22;
      const ux = c + (r % 2 ? 0.5 : 0) - (o[0] + (o[1] % 2 ? 0.5 : 0));
      pts.push({x: x + jx, y: y + jy, c, r, d: Math.hypot(ux, (r - o[1]) * 0.93) + random(`cd${r}-${c}`) * 0.35});
    }
  }
  const lit = (d: number) => a + d * per;
  return (
    <svg width={BOX.w} height={BOX.h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {/* person-to-person links: each dot to the nearest dot that lit before it */}
      {pts.map((p, i) => {
        if (p.d < 0.5) return null;
        let best = -1, bd = 1e9;
        pts.forEach((q, j) => {
          if (q.d < p.d) {
            const dd = Math.hypot(q.x - p.x, q.y - p.y);
            if (dd < bd) {bd = dd; best = j;}
          }
        });
        if (best < 0 || g < lit(p.d) - 2) return null;
        const q = pts[best];
        return <line key={`l${i}`} x1={q.x} y1={q.y} x2={p.x} y2={p.y} stroke={PAL.teal} strokeWidth={4} strokeOpacity={0.55} strokeLinecap="round" />;
      })}
      {pts.map((p, i) => {
        const on = g >= lit(p.d);
        const s = on ? pop(g, lit(p.d)) : 1;
        const ring = on ? interpolate(g, [lit(p.d), lit(p.d) + 10], [0, 1], clamp) : 0;
        return (
          <g key={i}>
            {on && ring < 1 && <circle cx={p.x} cy={p.y} r={16 + ring * 30} fill="none" stroke={PAL.teal} strokeWidth={4} strokeOpacity={1 - ring} />}
            <circle cx={p.x} cy={p.y} r={on ? 17 * s : 11} fill={on ? (p.d < 0.5 ? PAL.coral : PAL.teal) : 'none'} stroke={on ? '#111' : 'rgba(244,239,230,0.45)'} strokeWidth={3} />
          </g>
        );
      })}
    </svg>
  );
};

/** HIERARCHICAL: a ruler at the top, then cities, then the towns beneath them. */
const HierarchyDia: React.FC<{a0: number; a1: number; a2: number}> = ({a0, a1, a2}) => {
  const g = useGFrame();
  const top = [750, 130];
  const cities = [[300, 300], [750, 300], [1200, 300]];
  const towns = cities.flatMap(([cx]) => [-140, 0, 140].map((d) => [cx + d, 470]));
  const line = (x1: number, y1: number, x2: number, y2: number, at: number, k: string) => {
    if (g < at) return null;
    const p = interpolate(g, [at, at + 7], [0, 1], clamp);
    return <line key={k} x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={PAL.teal} strokeWidth={6} strokeLinecap="round" />;
  };
  const cityAt = (i: number) => a1 + i * 2 + 7;
  const townAt = (i: number) => a2 + i * 1.5 + 7;
  return (
    <>
      <svg width={BOX.w} height={BOX.h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {cities.map(([x, y], i) => line(top[0], top[1] + 40, x, y - 26, a1 + i * 2, `c${i}`))}
        {towns.map(([x, y], i) => line(cities[Math.floor(i / 3)][0], cities[Math.floor(i / 3)][1] + 26, x, y - 16, a2 + i * 1.5, `t${i}`))}
        <circle cx={top[0]} cy={top[1]} r={42 * pop(g, a0)} fill={PAL.coral} stroke="#111" strokeWidth={4} />
        {cities.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={28 * pop(g, cityAt(i))} fill={PAL.teal} stroke="#111" strokeWidth={4} />)}
        {towns.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={17 * pop(g, townAt(i))} fill={PAL.teal} stroke="#111" strokeWidth={3} />)}
        {/* unlit outlines, so the whole structure is visible from the start */}
        {cities.map(([x, y], i) => g < cityAt(i) && <circle key={`u${i}`} cx={x} cy={y} r={22} fill="none" stroke="rgba(244,239,230,0.4)" strokeWidth={3} />)}
        {towns.map(([x, y], i) => g < townAt(i) && <circle key={`v${i}`} cx={x} cy={y} r={12} fill="none" stroke="rgba(244,239,230,0.4)" strokeWidth={3} />)}
      </svg>
      <DrawnCrown x0={top[0] - 40} x1={top[0] + 40} y={top[1] - 52} h={42} at={a0 + 2} dur={8} width={6} />
    </>
  );
};

/** Places a 1500 x 520 diagram on screen at (x, y) with scale s. */
const Box: React.FC<{x: number; y: number; s?: number; children: React.ReactNode}> = ({x, y, s = 1, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: BOX.w, height: BOX.h, transform: `scale(${s})`, transformOrigin: 'top left'}}>{children}</div>
);

// ---------- scenes ----------

/** Title on the desk: a row of members and one dashed outsider with a question mark. */
const Opening: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Every');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="WHO GETS TO JOIN?" x={130} y={150} size={120} at={6} seed={201} rot={-2} />
      <Note text="every religion answers this..." x={150} y={360} size={56} rot={-3} at={t.at('answers') - 3} color={WHITE} />
      <Note text="(even if it never says so out loud)" x={190} y={455} size={48} rot={-3} at={t.at('never') - 3} />
      {[0, 1, 2, 3, 4].map((i) => <Person key={i} x={560 + i * 130} y={930} h={220} hat={false} dress={i % 2 === 1} at={a + 4 + i * 2} />)}
      <div style={{position: 'absolute', left: 1240, top: 690, width: 4, height: 260, background: 'rgba(244,239,230,0.3)', opacity: useGFrame() >= t.at('question') ? 1 : 0}} />
      <Person x={1440} y={930} h={220} hat={false} dashed color={pal.subject} at={t.at('question')} />
      <Note text="?" x={1500} y={640} size={110} rot={8} at={t.at('question') + 2} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** Universalizing: arrows fan out from one place to every corner of the world. */
const Universal: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Some');
  const s = t.at('send');
  const per = Math.max(3, Math.round((t.at('far') - s) / FAR.length));
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 38, lat: 8, z: 1.12}, {f: t.at('far') + 20, lon: 36, lat: 8, z: 1.16}]}>
        {(S: ToScreen) => {
          const [ox, oy] = S(ORIGIN);
          return (
            <>
              <Dot x={ox} y={oy} at={a + 4} r={14} color={PAL.coral} />
              {FAR.map((ll, i) => {
                const [x, y] = S(ll);
                const at = s + i * per;
                const back = Math.hypot(x - ox, y - oy);
                const k = (back - 22) / back;
                return (
                  <React.Fragment key={i}>
                    <Arrow x1={ox + (x - ox) * 0.08} y1={oy + (y - oy) * 0.08} x2={ox + (x - ox) * k} y2={oy + (y - oy) * k} bow={(i % 2 ? 1 : -1) * 34} at={at} dur={8} width={5} />
                    <Dot x={x} y={y} at={at + 8} r={8} ring={false} />
                  </React.Fragment>
                );
              })}
            </>
          );
        }}
      </WorldMap>
      <Note text="our message is for everyone, everywhere" x={110} y={80} size={54} rot={-3} at={t.at('everyone') - 12} color={WHITE} />
      <Highlight text="UNIVERSALIZING RELIGIONS" x={100} y={190} size={80} at={t.at('universalizing')} seed={211} rot={-2} />
      <Definition term="u·ni·ver·sal·iz·ing re·li·gion" def="aims to appeal to everyone, everywhere, and welcomes converts" at={t.at('universalizing') + 9} x={110} y={840} w={1100} />
      <Note text="welcomes converts" x={1300} y={640} size={44} rot={-4} at={t.at('converts') - 3} />
      <Note text="sends people out to share" x={1220} y={715} size={44} rot={-4} at={t.at('send') - 3} />
      <Note text="travels far from home" x={1260} y={800} size={50} rot={-4} at={t.at('travel') - 3} color={PAL.coral} />
      <Tag text="Simplified diagram · Map: Natural Earth" x={1440} y={1030} />
    </AbsoluteFill>
  );
};

/** Two columns: universalizing (teal, fanned out) vs ethnic (coral, a tight cluster). */
const Split: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Other');
  const cam = [{f: 0, lon: 38, lat: 12, z: 0.42}];
  const MW = 800, MH = 380, MY = 250;
  const xl = 80, xr = 1040;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 958, top: 70, width: 4, height: 920, background: 'rgba(244,239,230,0.35)'}} />
      <Highlight text="UNIVERSALIZING" x={xl} y={90} size={72} at={DONE} seed={212} rot={-2} />
      <WorldMap x={xl} y={MY} w={MW} h={MH} frame keys={cam}>
        {(S: ToScreen) => {
          const [ox, oy] = S(ORIGIN);
          return (
            <>
              {FAR.map((ll, i) => {
                const [x, y] = S(ll);
                const back = Math.hypot(x - ox, y - oy);
                const k = (back - 12) / back;
                return (
                  <React.Fragment key={i}>
                    <Arrow x1={ox} y1={oy} x2={ox + (x - ox) * k} y2={oy + (y - oy) * k} bow={(i % 2 ? 1 : -1) * 14} width={4} />
                  </React.Fragment>
                );
              })}
              <svg width={MW} height={MH} style={{position: 'absolute', left: 0, top: 0}}>
                {FAR.map((ll, i) => {
                  const [x, y] = S(ll);
                  return <circle key={i} cx={x} cy={y} r={6} fill={PAL.teal} stroke="#111" strokeWidth={2} />;
                })}
                <circle cx={ox} cy={oy} r={9} fill={PAL.coral} stroke="#111" strokeWidth={3} />
              </svg>
            </>
          );
        }}
      </WorldMap>
      <Note text="for everyone, everywhere" x={xl + 20} y={MY + MH + 30} size={42} rot={-2} at={DONE} color={WHITE} />
      <Note text="welcomes converts · travels far" x={xl + 20} y={MY + MH + 105} size={42} rot={-2} at={DONE} />

      <WorldMap x={xr} y={MY} w={MW} h={MH} frame keys={cam}>
        {(S: ToScreen) => {
          const [ox, oy] = S(ORIGIN);
          return (
            <>
              <svg width={MW} height={MH} style={{position: 'absolute', left: 0, top: 0}}>
                {CLUSTER.map((ll, i) => {
                  const [x, y] = S(ll);
                  return <ClusterDot key={i} x={x} y={y} at={a + 4 + i * 2} />;
                })}
              </svg>
              <Loop cx={ox} cy={oy} rx={46} ry={40} at={t.at('clustered')} seed={9} tilt={-6} color={pal.subject} width={5} />
              <Note text="stays near home" x={ox - 360} y={oy + 30} size={42} rot={-3} at={t.at('near') - 3} color={pal.subject} />
            </>
          );
        }}
      </WorldMap>
      <Highlight text="ETHNIC RELIGIONS" x={xr} y={90} size={72} at={t.at('ethnic')} seed={213} rot={-2} />
      <Note text="one people, one place" x={xr + 20} y={MY + MH + 30} size={42} rot={-2} at={t.at('specific people') - 3} color={WHITE} />
      <Note text="usually born into it" x={xr + 20} y={MY + MH + 105} size={42} rot={-2} at={t.at('born') - 3} />
      <Definition term="eth·nic re·li·gion" def="tied to one people and place; you are usually born into it" at={t.at('ethnic') + 9} x={xr} y={MY + MH + 190} w={820} />
      <Note text="rarely seeks converts" x={xr + 20} y={MY + MH + 330} size={42} rot={-2} at={t.at('rarely') - 3} />
      <Tag text="Simplified diagrams · Map: Natural Earth" x={44} y={1030} />
    </AbsoluteFill>
  );
};

const ClusterDot: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const g = useGFrame();
  return <circle cx={x} cy={y} r={7 * pop(g, at)} fill={PAL.coral} stroke="#111" strokeWidth={2} />;
};

/** Hearths: small flames on real birthplaces, then ripples of diffusion moving out from them. */
const HEARTHS: {ll: [number, number]; name: string; rel: string; dx: number; dy: number; align?: 'left' | 'right'}[] = [
  {ll: L.jerusalem, name: 'Jerusalem', rel: 'Judaism · Christianity', dx: -36, dy: -10, align: 'right'},
  {ll: L.mecca, name: 'Mecca', rel: 'Islam', dx: 34, dy: 10},
  {ll: P.amritsar, name: 'Punjab', rel: 'Sikhism', dx: -36, dy: -14, align: 'right'},
  {ll: L.ganges, name: 'Ganges valley', rel: 'Hinduism', dx: -30, dy: -78, align: 'right'},
  {ll: P.bodhGaya, name: 'Bodh Gaya', rel: 'Buddhism', dx: 34, dy: 44},
];

const Hearth: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('That birthplace');
  const h = t.at('hearth');
  const m = t.at('moves');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WorldMap keys={[{f: a, lon: 58, lat: 29, z: 3.7}, {f: m + 40, lon: 58, lat: 29, z: 3.5}]}>
        {(S: ToScreen) => (
          <>
            {HEARTHS.map((p, i) => {
              const [x, y] = S(p.ll);
              return <Ripple key={`r${i}`} x={x} y={y - 14} at={m + i * 4} r={110} />;
            })}
            {HEARTHS.map((p, i) => {
              const [x, y] = S(p.ll);
              const at = h - 6 + i * 3;
              return (
                <React.Fragment key={i}>
                  <Flame x={x} y={y} at={at} />
                  <MapLabel text={p.name} x={x + p.dx} y={y + p.dy - 14} at={at} align={p.align} size={28} color={PAL.cream} />
                  <MapLabel text={p.rel} x={x + p.dx} y={y + p.dy + 18} at={at + 2} align={p.align} size={20} color={PAL.orange} />
                </React.Fragment>
              );
            })}
          </>
        )}
      </WorldMap>
      <Note text="that birthplace has a name:" x={110} y={70} size={52} rot={-3} at={a + 2} color={WHITE} />
      <Highlight text="HEARTH" x={110} y={165} size={96} at={h} seed={221} rot={-2} />
      <Definition term="hearth" def="the place where a religion (or any cultural trait) began" at={h + 9} x={110} y={300} w={760} />
      <Highlight text="DIFFUSION" x={1060} y={790} size={84} at={t.at('diffusion')} seed={222} rot={-2} />
      <Definition term="dif·fu·sion" def="how it spreads out from its hearth" at={t.at('diffusion') + 9} x={1060} y={915} w={800} />
      <Note text="3 main ways..." x={130} y={880} size={60} rot={-4} at={t.at('three main') - 3} color={PAL.coral} />
      <Tag text="Map: Natural Earth" x={44} y={40} />
    </AbsoluteFill>
  );
};

/** Diagram scene frame: number, title and definition along the bottom, notes along the top. */
const DiaScene: React.FC<{n: string; children: React.ReactNode}> = ({n, children}) => (
  <AbsoluteFill>
    <DarkPaper />
    <div style={{position: 'absolute', right: 70, top: 64, fontFamily: JF.mono, fontSize: 34, letterSpacing: 3, color: 'rgba(244,239,230,0.7)'}}>{n}</div>
    {children}
  </AbsoluteFill>
);

const Relocation: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('People can');
  const r = t.at('relocation');
  return (
    <DiaScene n="1 / 3">
      <Box x={210} y={250}>
        <RelocationRoute a1={t.at('pack') + 2} a2={t.at('with them')} />
        <RelocationDia a0={a} a1={t.at('pack') + 2} a2={t.at('with them')} />
        <MapLabel text="hearth" x={260} y={460} at={a + 4} align="center" color={PAL.teal} size={28} />
        <MapLabel text="new home, far away" x={1240} y={460} at={t.at('with them') + 2} align="center" color={PAL.teal} size={28} />
      </Box>
      <Note text="people pack up and move..." x={120} y={70} size={56} rot={-3} at={t.at('pack') - 3} color={WHITE} />
      <Note text="...and their faith moves with them" x={760} y={150} size={52} rot={-3} at={t.at('carrying') - 3} />
      <Highlight text="RELOCATION DIFFUSION" x={120} y={780} size={84} at={r} seed={231} rot={-2} />
      <Definition term="re·lo·ca·tion dif·fu·sion" def="people move and carry their beliefs to a new place" at={r + 8} x={130} y={915} w={1300} />
    </DiaScene>
  );
};

const Contagious: React.FC<{t: TL}> = ({t}) => {
  const s = t.at('spread');
  const per = Math.max(4, Math.round((t.at('viral') - s) / 6.2));
  const c = t.at('contagious');
  return (
    <DiaScene n="2 / 3">
      <Box x={210} y={215}>
        <ContagiousDia a={s} per={per} />
      </Box>
      <Note text="person to person, neighbor to neighbor" x={120} y={70} size={54} rot={-3} at={t.at('person') - 3} color={WHITE} />
      <Note text="like going viral" x={1260} y={150} size={52} rot={-4} at={t.at('like') - 3} />
      <Highlight text="CONTAGIOUS DIFFUSION" x={120} y={780} size={84} at={c} seed={232} rot={-2} />
      <Definition term="con·ta·gious dif·fu·sion" def="spreads through contact, from person to person" at={c + 8} x={130} y={915} w={1300} />
    </DiaScene>
  );
};

const Hierarchical: React.FC<{t: TL}> = ({t}) => {
  const top = t.at('top');
  const hd = t.at('hierarchical');
  return (
    <DiaScene n="3 / 3">
      <Box x={210} y={190}>
        <HierarchyDia a0={top} a1={t.at('flow')} a2={t.at('through everyone')} />
        <MapLabel text="king / emperor" x={680} y={140} at={t.at('king') + 2} align="right" color={PAL.coral} size={30} />
        <MapLabel text="cities" x={1290} y={300} at={t.at('flow') + 8} color={PAL.teal} size={26} />
        <MapLabel text="towns + villages" x={1390} y={470} at={t.at('through everyone') + 10} color={PAL.teal} size={26} />
      </Box>
      <Note text="it starts at the top..." x={120} y={70} size={56} rot={-3} at={t.at('start') - 3} color={WHITE} />
      <Note text="...and flows down" x={1100} y={250} size={52} rot={-4} at={t.at('flow') - 3} />
      <Highlight text="HIERARCHICAL DIFFUSION" x={120} y={780} size={84} at={hd} seed={233} rot={-2} />
      <Definition term="hi·er·ar·chi·cal dif·fu·sion" def="spreads from powerful people and places down to everyone else" at={hd + 8} x={130} y={915} w={1400} />
    </DiaScene>
  );
};

/** All three side by side: replayed small, each with its label. */
const Three: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Hold onto');
  const s = 0.37;
  const xs = [60, 682, 1304];
  const Y = 300;
  const labels = ['RELOCATION', 'CONTAGIOUS', 'HIERARCHICAL'];
  const subs = ['people move', 'person to person', 'top down'];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="hold onto these three:" x={110} y={70} size={56} rot={-3} at={a - 3} color={WHITE} />
      {[0, 1].map((i) => <div key={i} style={{position: 'absolute', left: xs[i + 1] - 28, top: 260, width: 3, height: 560, background: 'rgba(244,239,230,0.25)'}} />)}
      <Box x={xs[0]} y={Y} s={s}>
        <RelocationRoute a1={a + 4} a2={a + 16} />
        <RelocationDia a0={a} a1={a + 4} a2={a + 16} />
      </Box>
      <Box x={xs[1]} y={Y} s={s}><ContagiousDia a={a + 6} per={3} /></Box>
      <Box x={xs[2]} y={Y} s={s}><HierarchyDia a0={a + 12} a1={a + 16} a2={a + 22} /></Box>
      {labels.map((l, i) => <Highlight key={l} text={l} x={xs[i] + 20} y={Y + 250} size={58} at={a + 6 + i * 6} seed={241 + i} rot={i % 2 ? 2 : -2} />)}
      {subs.map((l, i) => <Note key={l} text={l} x={xs[i] + 30} y={Y + 370} size={46} rot={-3} at={a + 10 + i * 6} />)}
      <Note text="each religion spread a different way..." x={110} y={860} size={60} rot={-3} at={t.at('different') - 6} color={pal.subject} />
      <Note text="...and that explains the map" x={1050} y={940} size={52} rot={-3} at={t.at('explains') - 3} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Opening t={t} />],
    [at('Some religions') - 1, <Universal t={t} />],
    [at('Other religions') - 1, <Split t={t} />],
    [at('That birthplace') - 1, <Hearth t={t} />],
    [at('People can') - 1, <Relocation t={t} />],
    [at('A belief') - 1, <Contagious t={t} />],
    [at('Or it') - 1, <Hierarchical t={t} />],
    [at('Hold onto') - 1, <Three t={t} />],
  ];
  const scene = useScene(cuts);
  const stamps = ['universalizing', 'ethnic', 'hearth', 'diffusion', 'relocation', 'contagious', 'hierarchical'];
  const notes = ['answers', 'never', 'converts', 'send', 'travel', 'specific people', 'born', 'rarely', 'near', 'pack', 'carrying', 'person', 'like',
    'start', 'flow', 'Hold onto', 'explains', 'three main'];
  const ticks = ['send', 'Other', 'hearth', 'pack', 'spread', 'top', 'king'];
  const a = t.at('Hold onto');
  return (
    <>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      <Sfx at={6} src="sfx/stamp.wav" volume={0.3} />
      {stamps.map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.27} />)}
      {[0, 1, 2].map((i) => <Sfx key={`s${i}`} at={a + 6 + i * 6} src="sfx/stamp.wav" volume={0.22} />)}
      {notes.map((c) => <Sfx key={c} at={at(c) - 3} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('everyone') - 15} src={WRITE.src} volume={WRITE.volume} />
      <Sfx at={at('different') - 8} src={WRITE.src} volume={WRITE.volume} />
      {ticks.map((c) => <Sfx key={`t${c}`} at={at(c)} src="sfx/tick.wav" volume={0.4} />)}
    </>
  );
};

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_who_joins.wav" lead={LEAD} music={[{src: 'music/r_schools.mp3', volume: 0.12}]}>
    <Body />
  </ChapterShell>
);
