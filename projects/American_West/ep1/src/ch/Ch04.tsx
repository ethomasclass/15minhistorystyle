// Chapter 4 · The Mountain. Tunnels through the Sierra granite, the winter of 1866–67, what the records don't say, and
// (quiet from "In June 1867": teal only, no coral, no jokes) the strike of June 1867, with a held picture after
// "The pay didn't change." Sources: Hart stereographs (LOC TIFF masters), the Placer Herald of July 6, 1867 (LOC,
// Chronicling America; line positions from its ALTO OCR), Crocker by Silas Selleck (Commons), lithograph plates and props.
import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch04_the_mountain.words.json';
import {clamp} from '../lib/anim';
import {JF, Loop, Note, PALETTES, PaletteCtx, useGFrame, useHand, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration} from '../kit/shell';
import {CircleMount, MapCard, Pin} from '../samples/kit';
import {IMG, SM, SZ, WARREN} from '../samples/masks';
import {keys, Lift, ScrimTag, shake, Shots, SlapTitle} from '../previews/fx';
import {Big, BWX, Clip, DeskCam, Float, Label, Line, LITHO, LITHO_QUIET, Lines, Pic, Prop, Sounds, type SfxRow, Stage, Tally, Upright} from '../kit/ch04_extra';
import {M4} from '../masks_ch04';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);
const T = makeTimeline(N, 30);
const at = T.at;
const END = Math.ceil(N.duration * 30) + 60;

const I = {
  portal: 'img/ch04/hart_summit_tunnel_portal.jpg',
  inside: 'img/ch04/hart_summit_tunnel_inside.jpg',
  snowBank: 'img/ch04/hart_donner_snow_bank.jpg',
  camp: 'img/ch04/hart_camp_near_summit.jpg',
  chinaCamp: 'img/ch04/hart_chinese_camp_browns.jpg',
  face: 'img/ch04/ai_tunnel_face.jpg',
  tools: 'img/ch04/ai_stacked_tools.jpg',
  snowTunnel: 'img/ch04/ai_snow_tunnel.jpg',
  sierra: 'img/ch04/ai_plate_sierra_snow.jpg',
  paper: 'img/ch04/placer_herald_1867_07_06.jpg',
  crocker: 'img/ch04/crocker_selleck.jpg',
  drill: 'img/ch04/ai_prop_drill_sledge.jpg',
  keg: 'img/ch04/ai_prop_powder_keg.jpg',
  nitro: 'img/ch04/ai_prop_nitro_can.jpg',
};
const Z = {
  portal: [2091, 2015] as [number, number],
  inside: [2052, 1994] as [number, number],
  snowBank: [2090, 1994] as [number, number],
  camp: [1983, 2008] as [number, number],
  chinaCamp: [2043, 1981] as [number, number],
  face: [1850, 962] as [number, number],
  tools: [1920, 963] as [number, number],
  snowTunnel: [1920, 1091] as [number, number],
  sierra: [1920, 1069] as [number, number],
  paper: [1010, 2350] as [number, number],
  crocker: [1920, 2560] as [number, number],
};
const TAG = {
  portal: 'A. A. Hart, East portal of Summit Tunnel, 1865–69 · Library of Congress',
  inside: 'A. A. Hart, Summit Tunnel, before completion · Library of Congress',
  snowBank: 'A. A. Hart, Bluff and snow bank in Donner Pass · Library of Congress',
  camp: 'A. A. Hart, Camp near Summit Tunnel · Library of Congress',
  chinaCamp: "A. A. Hart, Chinese camp, Brown's Station, Nev., 1868–69 · Library of Congress",
  paper: 'Placer Herald (Auburn, Calif.), July 6, 1867 · Library of Congress, Chronicling America',
  crocker: 'Charles Crocker, c. 1865–70 · Silas Selleck · Wikimedia Commons',
  worker: 'A. A. Hart, Heading of east portal, Tunnel No. 8, 1865–69 · Library of Congress',
};
/** Placer Herald lines ([x0, centre y, x1] in the clip's source px, from the page's ALTO OCR). */
const PH = {
  strike: [[144, 907, 888], [144, 956, 889], [144, 1008, 889], [145, 1058, 884]] as [number, number, number][],
  demand: [[144, 1105, 886]] as [number, number, number][],
  starving: [[540, 1955, 889], [144, 2012, 892], [147, 2055, 811]] as [number, number, number][],
};

const Quiet: React.FC<{children: React.ReactNode}> = ({children}) => <PaletteCtx.Provider value={PALETTES.quiet}>{children}</PaletteCtx.Provider>;

// ───────────────────────── tunnels ─────────────────────────

/** 1 · WIDE: the east portal of the Summit Tunnel; push toward the mouth. */
const Portal: React.FC = () => (
  <Pic src={I.portal} size={Z.portal} tag={TAG.portal} k={[[0, 1046, 1000, 0.95], [at('Fifteen'), 910, 1080, 1.3]]}>
    {() => {
      return (
        <>
          <SlapTitle text="THE MOUNTAIN" x={100} y={860} size={104} at={8} seed={41} />
          <Note text="solid granite" x={1240} y={170} size={60} rot={-4} at={at('solid') - 2} />
        </>
      );
    }}
  </Pic>
);

/** 2 · "Fifteen of them": fifteen drawn portals stamp in on the desk. */
const Fifteen: React.FC = () => {
  const g = useGFrame();
  const pal = usePal();
  const a = at('Fifteen');
  return (
    <DeskCam k={[[a - 2, 8, 1.02, 0, 0, 0], [at('The biggest'), 8, 1.0, 0, 0, 0]]}>
      <svg style={{position: 'absolute', left: 400 + 250, top: 300 + 330, overflow: 'visible'}} width={1420} height={400}>
        {Array.from({length: 15}).map((_, i) => {
          const t = a + i * 1;
          if (g < t) return null;
          const k = interpolate(g, [t, t + 3], [1.4, 1], clamp);
          const x = (i % 8) * 180 + (i >= 8 ? 90 : 0);
          const y = i >= 8 ? 200 : 0;
          return <g key={i} transform={`translate(${x} ${y}) scale(${k})`}>
            <path d="M0,120 L0,52 A52,52 0 0 1 104,52 L104,120" fill="rgba(0,0,0,0.35)" stroke={pal.mark} strokeWidth={7} strokeLinejoin="round" />
            <text x={52} y={160} textAnchor="middle" fontFamily={JF.mono} fontSize={24} fill={pal.mark}>{i + 1}</text>
          </g>;
        })}
      </svg>
      <div style={{position: 'absolute', left: 400 + 250, top: 300 + 180, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: '#f4efe6'}}>15 TUNNELS · CENTRAL PACIFIC · SIERRA NEVADA</div>
    </DeskCam>
  );
};

/** The Summit Tunnel cut-away: a drawn granite ridge in 3D with the bore through it (heights approx.). */
const L = 1200;
const H = 460;
const surf = (x: number) => H - (96 + 270 * Math.exp(-(((x - 640) / 330) ** 2)) + 30 * Math.exp(-(((x - 230) / 120) ** 2)));
const YT = H - 58; // bore centre
const RB = 24; // bore radius
const RIDGE = (() => {
  const pts: string[] = [];
  for (let x = 0; x <= L; x += 10) pts.push(`${x},${surf(x).toFixed(1)}`);
  return pts;
})();
const SHAFT_X = 560;

const Cutaway: React.FC<{dug: number; label: boolean}> = ({dug, label}) => {
  const pal = usePal();
  const g = useGFrame();
  const hand = useHand();
  // four faces: both portals and both sides of the shaft (dug = fraction of the way each face has come)
  const segs: [number, number][] = [[0, 300 * dug], [L - 300 * dug, L], [SHAFT_X - 140 * dug, SHAFT_X + 140 * dug]];
  return (
    <>
      <div style={{position: 'absolute', left: -200, top: -420, width: L + 400, height: 760,
        backgroundImage: 'linear-gradient(rgba(47,224,196,0.15) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(47,224,196,0.15) 1.5px, transparent 1.5px)',
        backgroundSize: '60px 60px', WebkitMaskImage: 'radial-gradient(ellipse at 50% 55%, #000 40%, transparent 72%)', maskImage: 'radial-gradient(ellipse at 50% 55%, #000 40%, transparent 72%)'}} />
      {[-120, -90, -60, -30].map((y, i) => (
        <Upright key={y} y={y} w={L} h={H}>
          <svg width={L} height={H} style={{overflow: 'visible'}}>
            <polyline points={RIDGE.join(' ')} fill="none" stroke={pal.mark} strokeWidth={2} opacity={0.22 + i * 0.12} />
            <circle cx={0} cy={YT} r={RB} fill="none" stroke={pal.mark} strokeWidth={1.5} opacity={0.3} />
          </svg>
        </Upright>
      ))}
      <Upright y={0} w={L} h={H}>
        <svg width={L} height={H} style={{overflow: 'visible'}}>
          <path d={`M0,${H} L${RIDGE.join(' L')} L${L},${H} Z`} fill="rgba(12,20,18,0.78)" />
          {Array.from({length: 40}).map((_, i) => {
            const x = 15 + i * 30;
            return <line key={i} x1={x} y1={H} x2={x} y2={surf(x)} stroke={pal.mark} strokeWidth={1} opacity={0.18} />;
          })}
          {/* granite grain: short teal hatching */}
          {Array.from({length: 70}).map((_, i) => {
            const x = 30 + ((i * 97) % (L - 60));
            const y = surf(x) + 30 + ((i * 53) % Math.max(20, H - surf(x) - 60));
            return y < YT - 40 || y > YT + 40 ? <line key={`h${i}`} x1={x} y1={y} x2={x + 16} y2={y - 8} stroke={pal.mark} strokeWidth={1.5} opacity={0.35} /> : null;
          })}
          {/* the bore: dashed outline end to end, dug parts filled */}
          <rect x={0} y={YT - RB} width={L} height={RB * 2} fill="none" stroke={pal.mark} strokeWidth={2.5} strokeDasharray="10 8" />
          {segs.map(([a0, a1], i) => <rect key={i} x={a0} y={YT - RB} width={Math.max(0, a1 - a0)} height={RB * 2} fill={pal.mark} opacity={0.75} />)}
          <line x1={SHAFT_X} y1={surf(SHAFT_X)} x2={SHAFT_X} y2={YT - RB} stroke={pal.mark} strokeWidth={10} opacity={dug > 0 ? 0.75 : 0} />
          <polyline points={RIDGE.join(' ')} fill="none" stroke={pal.mark} strokeWidth={5} strokeLinejoin="round" />
          <line x1={-60} y1={H} x2={L + 60} y2={H} stroke={pal.mark} strokeWidth={2} opacity={0.5} />
        </svg>
      </Upright>
      {label && (
        <Upright y={14} w={L} h={H + 200}>
          <div style={{position: 'absolute', left: 560, top: 200 + surf(640) - 150, whiteSpace: 'nowrap', textShadow: '0 0 2px #111, 2px 2px 0 #111, -2px 2px 0 #111', opacity: interpolate(g, [at('Summit'), at('Summit') + 6], [0, 1], clamp)}}>
            <div style={{fontFamily: hand.family, fontSize: 34 * hand.scale, color: pal.mark}}>granite</div>
          </div>
          <div style={{position: 'absolute', left: 20, top: 200 + YT + 40, fontFamily: JF.mono, fontSize: 20, letterSpacing: 3, color: '#f4efe6', whiteSpace: 'nowrap',
            textShadow: '0 0 2px #111, 2px 2px 0 #111', opacity: interpolate(g, [at('Tunnel'), at('Tunnel') + 6], [0, 1], clamp)}}>← 1,659 FT ALL THE WAY THROUGH →</div>
        </Upright>
      )}
    </>
  );
};

/** 3 · the biggest: the cut-away ridge orbiting, the bore drawn through it. */
const Summit: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('The biggest') - 1;
  const b = at('Hammers') - 1;
  return (
    <AbsoluteFill>
      <Stage w={L} fx={keys(f, [[a, 560], [b, 660]])} tilt={keys(f, [[a, 66], [b, 58]])} spin={keys(f, [[a, -22], [b, -8]])} z={keys(f, [[a, 1.0], [b, 1.12]])} dy={160}>
        <Cutaway dug={interpolate(f, [at('mostly'), at('hand') + 10], [0, 0.55], clamp)} label />
      </Stage>
      <SlapTitle text="SUMMIT TUNNEL" x={100} y={80} size={96} at={at('Summit')} seed={43} />
      <Label text="worked from 4 faces: both ends + a shaft" x={104} y={226} size={24} at={at('mostly')} />
      <Note text="by hand" x={1300} y={880} size={58} rot={-3} at={at('hand') - 2} />
      <ScrimTag text="Heights approx." />
    </AbsoluteFill>
  );
};

/** 4 · the tools land on the desk as they're named. */
const Tools: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Hammers') - 1;
  const sh = shake(f, [at('Hammers') + 3, at('black') + 3], 7);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <DeskCam k={[[a, 22, 1.0, 0, 20, -2], [at('and later'), 16, 1.06, -20, 0, 0]]}>
        <Float x={160} y={140} w={760} hgt={760} h={20} at={at('Hammers')} rot={-6} seed={3}>
          <Prop src={I.drill} m={M4.drillsledge} x={0} y={0} w={700} at={-99} />
        </Float>
        <Float x={1050} y={250} w={520} hgt={640} h={14} at={at('black')} rot={4} seed={6}>
          <Prop src={I.keg} m={M4.powderkeg} x={60} y={0} w={380} at={-99} />
        </Float>
      </DeskCam>
      <Lines x={140} y={940} size={50} rows={[{text: 'hammers + drills', at: at('Hammers') + 4}]} />
      <Lines x={1150} y={940} size={50} rows={[{text: 'black powder', at: at('black') + 2}]} />
    </AbsoluteFill>
  );
};

/** 5 · deep push into the unfinished bore; the nitroglycerin can lands. */
const Nitro: React.FC = () => {
  const a = at('and later') - 1;
  return (
    <AbsoluteFill>
      <Pic src={I.inside} size={Z.inside} tag={TAG.inside} k={[[a, 1100, 1050, 0.98], [at('On a good'), 1330, 1260, 1.75]]} />
      <Prop src={I.nitro} m={M4.nitrocan} x={1380} y={520} w={300} at={at('nitroglycerin') - 2} rot={3} />
      <Note text="nitroglycerin" x={1250} y={420} size={60} rot={-4} at={at('nitroglycerin') + 2} />
      <Note text="(new, and dangerous)" x={1290} y={960} size={42} rot={-3} at={at('nitroglycerin') + 12} color="#ffffff" />
    </AbsoluteFill>
  );
};

/** 6 · "about a foot": the driller at the face (coral), a drawn foot rule on the rock. */
const Foot: React.FC = () => {
  const g = useGFrame();
  const pal = usePal();
  const a = at('On a good') - 1;
  return (
    <Pic src={I.face} size={Z.face} filter="grayscale(1) contrast(1.12) brightness(1.02)" mask={M4.driller} tintAt={a + 4} traceAt={a + 6} k={[[a, 760, 560, 1.12], [at('Then came'), 900, 520, 1.2]]}>
      {(S, s) => {
        const [x0, y0] = S(330, 330);
        const len = 300 * s;
        const p = interpolate(g, [at('about') - 2, at('about') + 10], [0, 1], clamp);
        return (
          <>
            <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
              <line x1={x0} y1={y0} x2={x0 + len * p} y2={y0} stroke={pal.mark} strokeWidth={7} strokeLinecap="round" />
              {Array.from({length: 13}).map((_, i) => i / 12 <= p ? <line key={i} x1={x0 + (len * i) / 12} y1={y0 - (i % 6 === 0 ? 30 : 16)} x2={x0 + (len * i) / 12} y2={y0} stroke={pal.mark} strokeWidth={4} /> : null)}
            </svg>
            <Big text="≈ 1 FOOT" x={Math.max(80, x0 - 40)} y={y0 - 200} size={110} at={at('foot') - 1} />
            <Note text="a good day" x={Math.max(80, x0)} y={y0 + 60} size={50} rot={-3} at={at('good') - 2} />
          </>
        );
      }}
    </Pic>
  );
};

// ───────────────────────── winter ─────────────────────────

/** 7 · WIDE: the Sierra under snow; pull out; the winter title. */
const Winter: React.FC = () => (
  <AbsoluteFill>
    <Pic src={I.sierra} size={Z.sierra} filter={LITHO} k={[[at('Then came') - 1, 1100, 520, 1.35], [at('More than'), 960, 540, 1.0]]} />
    <SlapTitle text="WINTER 1866–67" x={100} y={90} size={100} at={at('winter')} seed={47} />
  </AbsoluteFill>
);

/** 8 · forty-plus storms, as tally marks over the dimmed plate. */
const Storms: React.FC = () => {
  const a = at('More than') - 1;
  return (
    <AbsoluteFill>
      <Pic src={I.sierra} size={Z.sierra} filter={`${LITHO} brightness(0.35) blur(2px)`} k={[[a, 960, 540, 1.04], [at('Snow deeper'), 960, 560, 1.08]]} />
      <Tally n={40} x={240} y={300} at={at('40') - 4} per={0.9} perRow={20} h={84} gap={20} />
      <Big text="40+" x={250} y={630} size={170} at={at('snowstorms')} />
      <Label text="snowstorms that winter" x={640} y={720} size={34} at={at('snowstorms') + 4} />
    </AbsoluteFill>
  );
};

/** 9 · "Snow deeper than the buildings": a camp bunkhouse (lithograph cut-out) and the snow rising past its roof,
 *  until only the stovepipe shows. */
const HOUSE = {src: 'img/ch04/ai_house.png', w: 879, h: 641};
const SnowDepth: React.FC = () => {
  const g = useGFrame();
  const pal = usePal();
  const a = at('Snow deeper') - 1;
  const rise = interpolate(g, [a + 6, at('buildings') + 10], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 2)});
  const ground = 860;
  const hw = 760, hh = Math.round((hw * HOUSE.h) / HOUSE.w);
  const top = ground - rise * (hh - 40);
  const wave = Array.from({length: 33}).map((_, i) => `${i * 60},${(top + Math.sin(i * 0.9) * 10 + Math.sin(i * 2.3) * 4).toFixed(1)}`).join(' L');
  return (
    <DeskCam k={[[a, 6, 1.0, 0, 0, 0], [at('Crews dug'), 6, 1.06, 0, 30, 0]]}>
      <div style={{position: 'absolute', left: 400, top: 300, width: 1920, height: 1080}}>
        {/* contact shadow, then the bunkhouse */}
        <div style={{position: 'absolute', left: 580, top: ground - 18, width: hw + 40, height: 36, borderRadius: '50%',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.6), rgba(0,0,0,0) 70%)'}} />
        <img src={staticFile(HOUSE.src)} style={{position: 'absolute', left: 600, top: ground - hh, width: hw, height: hh, filter: 'saturate(0.7) brightness(0.92)'}} />
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
          <defs>
            {/* snow as a drawn diagram: teal hatching over a dark wash, so the house stays faintly visible under it */}
            <pattern id="c4hatch" patternUnits="userSpaceOnUse" width={22} height={22} patternTransform="rotate(-35)">
              <line x1={0} y1={0} x2={0} y2={22} stroke={pal.mark} strokeWidth={2.4} strokeOpacity={0.55} />
            </pattern>
            <linearGradient id="c4fade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity={0} />
              <stop offset="0.12" stopColor="#fff" stopOpacity={1} />
              <stop offset="0.88" stopColor="#fff" stopOpacity={1} />
              <stop offset="1" stopColor="#fff" stopOpacity={0} />
            </linearGradient>
            <mask id="c4mask"><rect x={0} y={0} width={1920} height={1200} fill="url(#c4fade)" /></mask>
          </defs>
          {rise > 0 && (
            <g mask="url(#c4mask)">
              <path d={`M0,${ground + 6} L0,${top} L${wave} L1920,${top} L1920,${ground + 6} Z`} fill="rgba(12,11,9,0.62)" />
              <path d={`M0,${ground + 6} L0,${top} L${wave} L1920,${top} L1920,${ground + 6} Z`} fill="url(#c4hatch)" />
              <path d={`M0,${top} L${wave} L1920,${top}`} fill="none" stroke={pal.mark} strokeWidth={5} strokeLinejoin="round" />
            </g>
          )}
          <line x1={0} y1={ground} x2={1920} y2={ground} stroke={pal.mark} strokeWidth={3} opacity={rise > 0.05 ? 0 : 0.6} />
        </svg>
      </div>
      <div style={{position: 'absolute', left: 400 + 1420, top: 300 + 300, fontFamily: JF.mono, fontSize: 24, letterSpacing: 3, color: '#f4efe6', whiteSpace: 'nowrap', opacity: rise > 0.9 ? 1 : 0,
        textShadow: '0 0 2px #111, 2px 2px 0 #111'}}>DRIFTS OVER THE ROOFS</div>
    </DeskCam>
  );
};

/** 10 · a tunnel dug through the snow (lithograph); push into its mouth. */
const SnowTunnel: React.FC = () => {
  const a = at('Crews dug') - 1;
  return (
    <Pic src={I.snowTunnel} size={Z.snowTunnel} filter={`${LITHO} saturate(0.5)`} k={[[a, 900, 560, 1.0], [at('Avalanches'), 940, 700, 1.45]]}>
      {(S) => {
        const [tx, ty] = S(960, 720);
        return (
          <>
            <Arrow2 x1={tx + 520} y1={ty - 330} x2={tx + 110} y2={ty - 60} at={at('the snow') - 2} />
            <Note text="a tunnel through the snow" x={Math.min(1080, tx + 200)} y={Math.max(60, ty - 430)} size={50} rot={-4} at={at('the snow')} />
            <Note text="…to reach the rock" x={Math.min(1300, tx + 300)} y={Math.min(930, ty + 240)} size={46} rot={-3} at={at('reach') - 2} />
          </>
        );
      }}
    </Pic>
  );
};

const Arrow2: React.FC<{x1: number; y1: number; x2: number; y2: number; at: number}> = ({x1, y1, x2, y2, at: a}) => (
  <Line d={`M${x1},${y1} Q${(x1 + x2) / 2 + 60},${(y1 + y2) / 2 - 60} ${x2},${y2} M${x2 + 30},${y2 - 6} L${x2},${y2} L${x2 + 8},${y2 - 30}`} at={a} dur={8} />
);

/** 11 · avalanche country: tilt down Hart's snow bank to the road beneath it. */
const Avalanche: React.FC = () => {
  const a = at('Avalanches') - 1;
  return (
    <Pic src={I.snowBank} size={Z.snowBank} tag={TAG.snowBank} k={[[a, 1100, 700, 1.0], [at('How many'), 1100, 1250, 1.0]]}>
      {(S) => {
        const [rx, ry] = S(1150, 1690);
        return <Note text="whole work camps, carried away" x={120} y={Math.min(900, ry - 120)} size={52} rot={-3} at={at('camps') - 4} />;
      }}
    </Pic>
  );
};

// ───────────────────────── what we know ─────────────────────────

/** 12 · the question, written bare on the desk; "We don't know." held. */
const Question: React.FC = () => {
  const a = at('How many') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 14, 1.0, 0, 0, 0], [at('The company'), 10, 1.08, 0, 20, 0]]}><></></DeskCam>
      <Lines x={200} y={300} size={78} rot={-3} rows={[{text: 'How many Chinese workers died', at: at('How many')}, {text: 'building this railroad?', at: at('building') - 2}]} gap={120} />
      <Lines x={560} y={640} size={96} rot={-2} rows={[{text: "We don't know.", at: at("don't") - 2, color: '#ffffff'}]} />
    </AbsoluteFill>
  );
};

/** 13 · the company's records: track and money ticked off, the deaths row nearly empty. */
const Records: React.FC<{detail: boolean}> = ({detail}) => {
  const g = useGFrame();
  const pal = usePal();
  const hand = useHand();
  const f = useCurrentFrame();
  const a = detail ? at('It kept') - 1 : at('The company') - 1;
  const b = detail ? at('Most of') : at('It kept');
  const rows: [string, number, number][] = [['MILES OF TRACK', at('track'), 7], ['MONEY', at('money'), 7], ['CHINESE DEATHS', at('Chinese', 2), 1]];
  const cam = detail ? {z: keys(f, [[a, 1.12], [b, 1.2]]), x: -40, y: -170} : {z: keys(f, [[a, 0.84], [b, 0.88]]), x: 0, y: -20};
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 12, cam.z, cam.x, cam.y, -1], [b, 12, cam.z, cam.x, cam.y, -1]]}>
        <Lift x={330} y={110} w={1260} hgt={700} h={8} at={detail ? -99 : at('company')} rot={-1} seed={4}>
          <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 30%, #36312a 0%, #26231d 75%, #1d1a15 100%)', boxShadow: `14px 18px 0 #050403`}}>
            {!detail && <div style={{position: 'absolute', left: 50, top: 40, fontFamily: JF.mono, fontSize: 28, letterSpacing: 4, color: pal.mark}}>THE COMPANY KEPT</div>}
            {rows.map(([t, on, n], i) => (
              <React.Fragment key={t}>
                <div style={{position: 'absolute', left: 30, right: 30, top: 140 + i * 170, height: 2, background: pal.mark, opacity: 0.5}} />
                <div style={{position: 'absolute', left: 50, top: 180 + i * 170, fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, color: '#f4efe6'}}>{t}</div>
                {Array.from({length: n}).map((_, j) => g >= on + j * 2 ? (
                  <div key={j} style={{position: 'absolute', left: 520 + j * 92, top: 150 + i * 170, fontFamily: hand.family, fontSize: 80 * hand.scale, color: pal.mark,
                    textShadow: '0 0 2px #111, 2px 2px 0 #111'}}>✓</div>
                ) : null)}
              </React.Fragment>
            ))}
            {detail && g >= at('deaths') && <div style={{position: 'absolute', left: 640, top: 470, fontFamily: hand.family, fontSize: 110 * hand.scale, color: '#ffffff',
              textShadow: '0 0 2px #111, 3px 3px 0 #111'}}>?</div>}
          </div>
        </Lift>
      </DeskCam>
      {detail && <Note text="very few records" x={1180} y={860} size={56} rot={-3} at={at('very few') - 2} />}
    </AbsoluteFill>
  );
};

/** 14 · how we know: a newspaper on the desk (the Placer Herald, July 1867). */
const Newspaper: React.FC = () => {
  const a = at('Most of') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 20, 0.95, 0, 0, 2], [at('In June'), 14, 1.05, 0, 30, 0]]}>
        <Lift x={250} y={60} w={900} hgt={940} h={10} at={at('newspaper') - 1} rot={-3} seed={8}>
          <Clip src={I.paper} size={Z.paper} x={0} y={0} w={900} h={940} sx0={60} sy0={560} scale={0.95} at={-99} />
        </Lift>
      </DeskCam>
      <Lines x={1200} y={360} size={50} rows={[{text: 'newspaper reports', at: at('newspaper') + 2}, {text: '+ letters', at: at('letters') - 2}]} />
      <ScrimTag text={TAG.paper} x={34} y={24} />
    </AbsoluteFill>
  );
};

// ───────────────────────── the strike (quiet) ─────────────────────────

/** 15 · JUNE 1867 over the camp near the Summit Tunnel; a slow push. */
const June: React.FC = () => (
  <Quiet>
    <Pic src={I.camp} size={Z.camp} tag={TAG.camp} k={[[at('In June') - 1, 1000, 1000, 0.97], [at('About 3,000'), 700, 1000, 1.12]]}>
      {() => <SlapTitle text="JUNE 1867" x={110} y={110} size={110} at={at('June')} seed={51} />}
    </Pic>
  </Quiet>
);

/** 16 · about 3,000 put down their tools (lithograph): the stacked shovels and picks. */
const ToolsDown: React.FC = () => (
  <Quiet>
    <Pic src={I.tools} size={Z.tools} filter={LITHO_QUIET} k={[[at('About 3,000') - 1, 1000, 500, 1.02], [at('They had'), 760, 640, 1.3]]}>
      {(S) => {
        const [tx, ty] = S(560, 690);
        return (
          <>
            <Big text="≈ 3,000" x={1180} y={110} size={140} at={at('3,000')} />
            <Loop cx={tx} cy={ty} rx={330} ry={230} at={at('tools') - 2} seed={11} tilt={-5} width={6} />
            <Note text="tools down" x={Math.min(1400, tx + 320)} y={Math.min(860, ty + 120)} size={56} rot={-3} at={at('tools')} />
          </>
        );
      }}
    </Pic>
  </Quiet>
);

/** 17 · the Placer Herald's report, focus on the demand, a teal swipe. */
const Demands: React.FC = () => {
  const a = at('They had') - 1;
  const teal = PALETTES.quiet.mark;
  return (
    <Quiet>
      <AbsoluteFill>
        <DeskCam k={[[a, 8, 1.0, 0, 0, 0], [at('Shorter'), 8, 1.05, 30, -10, 0]]}>
          <Lift x={150} y={60} w={1000} hgt={960} h={6} at={-99} rot={-1} seed={9}>
            <Clip src={I.paper} size={Z.paper} x={0} y={0} w={1000} h={960} sx0={90} sy0={780} scale={1.25} at={-99} band={[880, 1130]} pullAt={at('three')}
              swipes={PH.demand} swipeAt={at('demands') - 2} dur={12} lineH={44} color={teal} />
          </Lift>
        </DeskCam>
        <Note text="“They demand more wages" x={1200} y={420} size={44} rot={-3} at={at('demands') + 4} />
        <Note text="and less hours work.”" x={1230} y={500} size={44} rot={-3} at={at('demands') + 10} />
        <Note text="three demands" x={1240} y={250} size={60} rot={-4} at={at('three') - 2} />
        <ScrimTag text={TAG.paper} x={34} y={24} />
      </AbsoluteFill>
    </Quiet>
  );
};

/** 18 · the three demands as bare handwriting on the desk. */
const Three: React.FC = () => {
  const a = at('Shorter') - 1;
  return (
    <Quiet>
      <AbsoluteFill>
        <DeskCam k={[[a, 16, 1.06, 0, 0, -1], [at('Charles'), 12, 0.98, -20, 10, 0]]}>
          <Lift x={1240} y={560} w={600} hgt={560} h={2} at={-99} rot={6} blur={2.5} seed={12}>
            <Clip src={I.paper} size={Z.paper} x={0} y={0} w={600} h={560} sx0={100} sy0={820} scale={0.75} at={-99} />
          </Lift>
        </DeskCam>
        <Label text="the strikers' demands · June 1867" x={150} y={190} size={26} />
        <Lines x={150} y={290} size={62} gap={150} rot={-2} rows={[
          {text: '1 · the same pay as white workers', at: -99},
          {text: '2 · shorter shifts inside the tunnels', at: at('Shorter')},
          {text: '3 · no whipping, free to leave', at: at('And an end')},
        ]} />
      </AbsoluteFill>
    </Quiet>
  );
};

/** 19 · Charles Crocker, traced in teal; "cut off their food". */
const Crocker: React.FC = () => {
  const a = at('Charles') - 1;
  return (
    <Quiet>
      <AbsoluteFill>
        <DeskCam k={[[a, 10, 1.0, 0, 0, 0], [at('No supplies'), 10, 1.04, 0, 0, 0]]}><></></DeskCam>
        <CircleMount src={I.crocker} size={Z.crocker} cx={560} cy={520} r={330} fx={960} fy={1080} scale={0.36} at={a + 1} mask={M4.crocker} traceAt={a + 6} />
        <Label text="Charles Crocker · Central Pacific" x={1020} y={300} size={26} at={a + 4} />
        <Lines x={1020} y={400} size={70} rows={[{text: 'cut off their food', at: at('cut') - 2}]} />
        <ScrimTag text={TAG.crocker} />
      </AbsoluteFill>
    </Quiet>
  );
};

/** 20 · no supplies reached the camps: a slow pan across a Chinese camp. */
const Camps: React.FC = () => (
  <Quiet>
    <Pic src={I.chinaCamp} size={Z.chinaCamp} tag={TAG.chinaCamp} k={[[at('No supplies') - 1, 760, 1150, 1.05], [at('After about'), 1100, 1100, 1.1]]}>
      {() => <Note text="no supplies" x={1280} y={150} size={60} rot={-4} at={at('supplies')} />}
    </Pic>
  </Quiet>
);

/** 21 · after about a week: the paper's "starving them back to work", swiped in teal. */
const Starving: React.FC = () => {
  const a = at('After about') - 1;
  return (
    <Quiet>
      <AbsoluteFill>
        <DeskCam k={[[a, 6, 1.12, 0, 0, 0], [at('The pay'), 6, 1.2, 0, 0, 0]]}>
          <Lift x={160} y={40} w={1120} hgt={1000} h={4} at={-99} rot={1} seed={10}>
            <Clip src={I.paper} size={Z.paper} x={0} y={0} w={1120} h={1000} sx0={100} sy0={1560} scale={1.3} at={-99} band={[1925, 2085]} pullAt={a + 4}
              swipes={PH.starving} swipeAt={at('week')} dur={16} lineH={44} color={PALETTES.quiet.mark} />
          </Lift>
        </DeskCam>
        <Note text="after about a week" x={1340} y={760} size={52} rot={-3} at={at('week') + 2} />
        <ScrimTag text={TAG.paper} x={34} y={24} />
      </AbsoluteFill>
    </Quiet>
  );
};

/** 22 · "The pay didn't change.": the held picture (no marks for ~2 s), then the line on the strike's size. */
const Held: React.FC = () => {
  const a = at('The pay') - 1;
  return (
    <Quiet>
      <Pic src={IMG.tunnel8} size={SZ.tunnel8} tag={TAG.worker} vignette={0.7} k={[[a, 960, 1320, 0.95], [at('Almost no'), 900, 1300, 1.0]]} traceAt={at('country')} mask={SM.worker}>
        {() => <Lines x={1000} y={240} size={46} gap={80} rows={[{text: 'one of the largest strikes', at: at('country') + 2}, {text: 'in the country so far', at: at('country') + 10}]} />}
      </Pic>
    </Quiet>
  );
};

/** 23 · almost no one heard: the desk pulls away from one small clipping. */
const Unheard: React.FC = () => {
  const a = at('Almost no') - 1;
  return (
    <Quiet>
      <AbsoluteFill>
        <DeskCam k={[[a, 18, 1.05, 0, 0, 0], [at('The work'), 26, 0.72, 0, -40, -3]]}>
          <Lift x={820} y={330} w={300} hgt={420} h={6} at={-99} rot={-4} seed={13}>
            <Clip src={I.paper} size={Z.paper} x={0} y={0} w={300} h={420} sx0={120} sy0={860} scale={0.38} at={-99} />
          </Lift>
        </DeskCam>
        <Note text="almost no one outside the camps heard" x={300} y={860} size={52} rot={-2} at={at('outside') - 2} />
      </AbsoluteFill>
    </Quiet>
  );
};

/** 24 · the work went on; two years later the lines met (map card, teal only). Holds through the tail. */
const Onward: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('The work') - 1;
  const mx = 560;
  const my = 210;
  const w = 800;
  const h = 560;
  const sc = 0.55;
  // pin position on the card (MapCard maths: pad 12, caption strip 34)
  const px = 12 + (w - 24) / 2 - (WARREN.promontory[0] + 20) * sc + WARREN.promontory[0] * sc;
  const py = 12 + (h - 24 - 34) / 2 - (WARREN.promontory[1] + 40) * sc + WARREN.promontory[1] * sc;
  return (
    <Quiet>
      <AbsoluteFill>
        <DeskCam k={[[a, 24, 0.94, 0, 0, -2], [END, 14, 1.05, 0, 30, 0]]}>
          <Lift x={mx} y={my} w={w} hgt={h} h={8} at={a + 2} rot={2} seed={14}>
            <MapCard x={0} y={0} w={w} h={h} src={IMG.warren} size={SZ.warren} fx={WARREN.promontory[0] + 20} fy={WARREN.promontory[1] + 40} scale={sc} at={-99} caption="UTAH TERR. · 1869" bright />
            <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={w} height={h}>
              <path d={`M${px - 360 + 330 * interpolate(f, [at('two years'), at('met')], [0, 1], clamp)},${py + 30} L${px - 360},${py + 30}`} stroke="#2FE0C4" strokeWidth={8} strokeLinecap="round" />
              <path d={`M${px + 360 - 330 * interpolate(f, [at('two years'), at('met')], [0, 1], clamp)},${py - 10} L${px + 360},${py - 10}`} stroke="#2FE0C4" strokeWidth={8} strokeLinecap="round" strokeDasharray="18 10" />
            </svg>
            <Pin x={px} y={py + 10} at={at('met')} />
          </Lift>
        </DeskCam>
        <Label text="central pacific →" x={200} y={820} size={26} at={at('two years')} />
        <Label text="← union pacific" x={1380} y={820} size={26} at={at('two years') + 4} />
        <ScrimTag text="Map: G. K. Warren, 1868 · Library of Congress" />
      </AbsoluteFill>
    </Quiet>
  );
};

// ───────────────────────── assembly ─────────────────────────

const c = (w: string, n = 1) => at(w, n) - 1;
const SHOTS: [number, React.ReactNode, ('whip' | 'cut')?][] = [
  [0, <Portal />],
  [c('Fifteen'), <Fifteen />, 'cut'],
  [c('The biggest'), <Summit />, 'whip'],
  [c('Hammers'), <Tools />, 'cut'],
  [c('and later'), <Nitro />, 'cut'],
  [c('On a good'), <Foot />, 'whip'],
  [c('Then came'), <Winter />, 'cut'],
  [c('More than'), <Storms />, 'cut'],
  [c('Snow deeper'), <SnowDepth />, 'cut'],
  [c('Crews dug'), <SnowTunnel />, 'cut'],
  [c('Avalanches'), <Avalanche />, 'whip'],
  [c('How many'), <Question />, 'cut'],
  [c('The company'), <Records detail={false} />, 'cut'],
  [c('It kept'), <Records detail />, 'cut'],
  [c('Most of'), <Newspaper />, 'whip'],
  [c('In June'), <June />, 'cut'],
  [c('About 3,000'), <ToolsDown />, 'cut'],
  [c('They had'), <Demands />, 'cut'],
  [c('Shorter'), <Three />, 'cut'],
  [c('Charles'), <Crocker />, 'cut'],
  [c('No supplies'), <Camps />, 'cut'],
  [c('After about'), <Starving />, 'cut'],
  [c('The pay'), <Held />, 'cut'],
  [c('Almost no'), <Unheard />, 'cut'],
  [c('The work'), <Onward />, 'cut'],
];

const tick = (w: string, d = 2, n = 1): SfxRow => [at(w, n) - d, 'marker_tick', 0.2];
const SFX: SfxRow[] = [
  // cuts (whoosh on hard cuts, whip_soft on whips); fewer and softer in the quiet part
  ...SHOTS.slice(1).map(([s, , k]): SfxRow => (k === 'whip' ? [s - 4, 'whip_soft', 0.25] : [s, 'whoosh', s > at('In June') ? 0.12 : 0.22])),
  [8, 'stamp', 0.22], tick('solid'),
  ...Array.from({length: 15}).map((_, i): SfxRow => [at('Fifteen') + i, 'block_tap_soft', 0.1]).filter((_, i) => i % 3 === 0),
  [at('Summit'), 'stamp', 0.22], tick('hand'),
  [at('Hammers') + 1, 'paper_slap_soft', 0.25], [at('black') + 1, 'paper_slap_soft', 0.25], tick('Hammers', -2), tick('black', 0),
  [at('nitroglycerin') - 1, 'paper_slap_soft', 0.22], tick('nitroglycerin', 0),
  tick('about'), [at('foot'), 'stamp', 0.2],
  [at('winter'), 'stamp', 0.22],
  ...Array.from({length: 8}).map((_, i): SfxRow => [at('40') - 4 + i * 4.5, 'block_tap_soft', 0.12]), [at('snowstorms'), 'stamp', 0.2],
  tick('the snow'), tick('reach', 4), tick('camps', 6),
  tick('How many', 3), tick("don't", 4),
  [at('company') - 1, 'card_slide_soft', 0.2], tick('track'), tick('money'), tick('very few', 4),
  [at('newspaper') - 2, 'page_turn', 0.4], tick('newspaper', 0),
  // quiet: titles still stamp (softer), notes still tick
  [at('June'), 'stamp', 0.16], [at('3,000'), 'stamp', 0.14], tick('tools', 4),
  [at('three') - 3, 'page_turn', 0.3], tick('three', 4), tick('demands', -2), tick('Shorter', 2), tick('And an end', 2),
  tick('cut', 4), tick('supplies', 2), tick('week', 0),
  tick('country', 0), tick('outside', 4),
  [at('two years'), 'card_slide_soft', 0.16],
];

const Body: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Shots shots={SHOTS} />
    <Sounds list={SFX} />
  </AbsoluteFill>
);

export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch04_the_mountain.wav" lead={LEAD} music={[
    // SUNO: none planned for the first half (w_aftermath is the library cue)
    {src: 'music/w_aftermath.mp3', volume: 0.14, to: at('In June') + 4, fadeOut: 20},
    // SUNO: aw_long_grief replaces this (j_grief is only 40 s, so it enters after a short silence on "About 3,000")
    {src: 'music/j_grief.mp3', volume: 0.12, from: at('About 3,000') - 12},
  ]}>
    <Body />
  </ChapterShell>
);
