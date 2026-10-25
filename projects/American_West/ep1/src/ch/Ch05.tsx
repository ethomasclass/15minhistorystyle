// Chapter 5 · Done. Ten miles in a day, Promontory, the telegraph's one word, the golden-spike myth (in, tap, out; an iron
// spike in its place; Stanford reportedly missed), back to Russell's photograph and the crew that isn't in it (the torn print
// and the coral worker from the cold open), months to a week, and the hand-off to Grant.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch05_done.words.json';
import {clamp} from '../lib/anim';
import {JF, Loop, Note, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration} from '../kit/shell';
import {CircleMount, CutOut, MapCard, Pin, TornPrint} from '../samples/kit';
import {IMG, SM, SZ, WARREN} from '../samples/masks';
import {keys, Lift, PhotoCam, ScrimTag, shake, Shots, SlapTitle, zkeys} from '../previews/fx';
import {Big, BWX, Counter, DeskCam, Float, HBar, Label, Line, LITHO, Lines, Pic, Prop, Sounds, type SfxRow, Stage, Upright} from '../kit/ch04_extra';
import {M5} from '../masks_ch05';
import {M6} from '../masks_ch06';

const N = words as Narration;
export const CH05_FRAMES = chapterFrames(N, LEAD);
const T = makeTimeline(N, 30);
const at = T.at;
const END = Math.ceil(N.duration * 30) + 60;

const I = {
  track: 'img/ch05/hart_end_of_track_humboldt.jpg',
  spike: 'img/ch05/golden_spike_cantor.jpg',
  flats: 'img/ch05/ai_plate_promontory_flats.jpg',
  key: 'img/ch05/ai_prop_telegraph_key.jpg',
  railTie: 'img/ch05/ai_prop_rail_tie.jpg',
  iron: 'img/ch05/ai_prop_iron_spike.jpg',
  sledge: 'img/ch05/ai_prop_sledgehammer.jpg',
  grant: 'img/ch06/grant_brady.jpg',
  worker: 'img/previews/hart_tunnel8_worker_w.jpg',
};
const Z = {
  track: [2027, 2012] as [number, number],
  spike: [1024, 1537] as [number, number],
  flats: [1920, 1036] as [number, number],
  grant: [2625, 4000] as [number, number],
};
const TAG = {
  track: 'A. A. Hart, End of track, on Humboldt Plains, Nev., 1868–69 · Library of Congress',
  spike: 'The Last Spike (gold), 1869 · Cantor Arts Center, Stanford · photo: Wjenning, CC BY-SA 3.0',
  russell: 'A. J. Russell, East and West Shaking Hands at Laying Last Rail, May 10, 1869 · Wikimedia Commons',
  map: 'Map: G. K. Warren, 1868 · Library of Congress',
  grant: 'Ulysses S. Grant · Brady National Photographic Art Gallery · Library of Congress',
};

// ───────────────────────── the race ends ─────────────────────────

/** The Warren map card on the desk with the two lines closing on Promontory (CP solid, UP dashed). */
const MapDesk: React.FC<{a: number; b: number; prog: [number, number]; pinAt: number; zoom: [number, number]; title?: React.ReactNode}> = ({a, b, prog, pinAt, zoom, title}) => {
  const f = useCurrentFrame();
  const w = 1000;
  const h = 680;
  const sc = 0.62;
  const px = 12 + (w - 24) / 2 - 20 * sc;
  const py = 12 + (h - 24 - 34) / 2 - 40 * sc;
  const p = interpolate(f, [a, b], prog, clamp);
  const cp = px - 420 + 410 * p;
  const up = px + 420 - 410 * p;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 24, zoom[0], 0, 0, -2], [b, 16, zoom[1], 0, 20, 0]]}>
        <Lift x={460} y={170} w={w} hgt={h} h={8} at={-99} rot={1} seed={21}>
          <MapCard x={0} y={0} w={w} h={h} src={IMG.warren} size={SZ.warren} fx={WARREN.promontory[0] + 20} fy={WARREN.promontory[1] + 40} scale={sc} at={-99} caption="UTAH TERR. · 1869" bright />
          <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={w} height={h}>
            <path d={`M${px - 420},${py + 34} L${cp},${py + 34}`} stroke="#050403" strokeWidth={16} strokeLinecap="round" />
            <path d={`M${px - 420},${py + 34} L${cp},${py + 34}`} stroke="#2FE0C4" strokeWidth={9} strokeLinecap="round" />
            <path d={`M${px + 420},${py - 14} L${up},${py - 14}`} stroke="#050403" strokeWidth={16} strokeLinecap="round" />
            <path d={`M${px + 420},${py - 14} L${up},${py - 14}`} stroke="#2FE0C4" strokeWidth={9} strokeLinecap="round" strokeDasharray="20 12" />
          </svg>
          <Pin x={px} y={py + 10} at={pinAt} size={26} />
        </Lift>
      </DeskCam>
      <Label text="central pacific →" x={300} y={900} size={26} />
      <Label text="← union pacific" x={1330} y={900} size={26} />
      {title}
      <ScrimTag text={TAG.map} />
    </AbsoluteFill>
  );
};

/** 1 · spring 1869: the two lines in sight of each other. */
const Spring: React.FC = () => (
  <MapDesk a={0} b={at('And the Central')} prog={[0.35, 0.75]} pinAt={1e7} zoom={[0.9, 1.0]} title={<SlapTitle text="SPRING 1869" x={100} y={80} size={100} at={8} seed={61} />} />
);

/** 2 · the bet: end of track on the Humboldt plains, wide then the crew. */
const Bet: React.FC<{detail: boolean}> = ({detail}) => {
  const a = detail ? at('that its crews') - 1 : at('And the Central') - 1;
  const b = detail ? at('On April') : at('that its crews');
  const k: [number, number, number, number][] = detail ? [[a, 760, 1380, 1.6], [b, 820, 1300, 1.85]] : [[a, 760, 900, 0.95], [b, 1260, 1000, 0.98]];
  return (
    <Pic src={I.track} size={Z.track} tag={TAG.track} k={k}>
      {() => detail ? (
        <>
          <Note text="the bet:" x={1220} y={140} size={56} rot={-4} at={at('bet') + 0} />
          <Lines x={1220} y={250} size={60} rows={[{text: 'ten miles of track', at: at('ten') - 2}, {text: 'in ONE day', at: at('single') - 2}]} />
        </>
      ) : <Note text="a bet with the Union Pacific" x={110} y={120} size={56} rot={-3} at={at('bet') - 2} />}
    </Pic>
  );
};

/** 3 · April 28: the sledge lands, the distance stamps. */
const April: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('On April') - 1;
  const sh = shake(f, [at('did it') + 3, at('Ten miles', 2) + 2], 7);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <DeskCam k={[[a, 20, 1.0, 0, 0, 2], [at("That's about"), 14, 1.06, 20, 0, 0]]}>
        <Float x={1150} y={430} w={600} hgt={540} h={18} at={at('did it')} rot={-8} seed={22}>
          <Prop src={I.sledge} m={M5.sledgehammer} x={0} y={0} w={580} at={-99} />
        </Float>
      </DeskCam>
      <SlapTitle text="APRIL 28, 1869" x={100} y={90} size={96} at={at('April')} seed={63} />
      <Big text="10 MILES" x={110} y={330} size={190} at={at('Ten miles', 2)} />
      <Big text="+ 56 FEET" x={130} y={560} size={110} at={at('56')} color="#f4efe6" />
      <Note text="in one day" x={140} y={760} size={56} rot={-3} at={at('feet') + 4} />
    </AbsoluteFill>
  );
};

/** 4 · ties and rails as numbers: a drawn 3D track laying itself across the desk. */
const RAIL_L = 1800;
const Track: React.FC<{p: number}> = ({p}) => {
  const pal = usePal();
  const n = Math.floor(48 * p);
  return (
    <>
      <div style={{position: 'absolute', left: -200, top: -400, width: RAIL_L + 400, height: 800,
        backgroundImage: 'linear-gradient(rgba(47,224,196,0.13) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(47,224,196,0.13) 1.5px, transparent 1.5px)', backgroundSize: '60px 60px',
        WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, #000 35%, transparent 70%)', maskImage: 'radial-gradient(ellipse at 50% 50%, #000 35%, transparent 70%)'}} />
      {Array.from({length: n}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: i * 37, top: -70, width: 18, height: 140, background: 'rgba(237,231,220,0.75)', boxShadow: '4px 6px 0 #050403', transform: 'translateZ(2px)'}} />
      ))}
      {[-44, 44].map((y) => (
        <React.Fragment key={y}>
          <div style={{position: 'absolute', left: 0, top: y - 5, width: Math.max(0, n * 37 - 30), height: 10, background: pal.mark, transform: 'translateZ(10px)'}} />
          <Upright y={y + 5} w={RAIL_L} h={10}>
            <div style={{position: 'absolute', left: 0, top: 0, width: Math.max(0, n * 37 - 30), height: 10, background: 'rgba(47,224,196,0.55)'}} />
          </Upright>
        </React.Fragment>
      ))}
    </>
  );
};

const Ties: React.FC = () => {
  const f = useCurrentFrame();
  const a = at("That's about") - 1;
  const b = at('set by') - 1;
  return (
    <AbsoluteFill>
      <Stage w={RAIL_L} fx={keys(f, [[a, 500], [b, 1200]])} tilt={keys(f, [[a, 62], [b, 56]])} spin={keys(f, [[a, -28], [b, -18]])} z={zkeys(f, [[a, 1.0], [b, 1.1]])} dy={140}>
        <Track p={interpolate(f, [a + 4, b], [0.15, 1], clamp)} />
      </Stage>
      <Counter to={25000} at={at('25,000') - 2} dur={20} x={110} y={90} size={130} color="#f4efe6" />
      <Label text="wooden ties" x={120} y={240} size={30} at={at('wooden')} />
      <Counter to={3500} at={at('3,500') - 2} dur={16} x={1180} y={90} size={130} />
      <Label text="iron rails" x={1190} y={240} size={30} at={at('iron')} />
    </AbsoluteFill>
  );
};

/** 5 · set by hand: a rail on its tie and a spike, slapped onto the desk. */
const ByHand: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('set by') - 1;
  const sh = shake(f, [at('hand') + 3], 7);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <DeskCam k={[[a, 24, 1.08, 0, 0, -3], [at('The Chinese crews'), 18, 1.0, 0, 0, 0]]}>
        <Float x={300} y={300} w={900} hgt={640} h={12} at={at('hand')} rot={-4} seed={23}>
          <Prop src={I.railTie} m={M5.railtie} x={0} y={0} w={880} at={-99} />
        </Float>
        <Float x={1250} y={560} w={420} hgt={140} h={20} at={at('one day') - 2} rot={12} seed={24}>
          <Prop src={I.iron} m={M5.ironspike} x={0} y={0} w={400} at={-99} />
        </Float>
      </DeskCam>
      <Note text="set by hand" x={1200} y={170} size={66} rot={-4} at={at('hand') + 2} />
    </AbsoluteFill>
  );
};

/** 6 · who did it: the crew at the end of track. */
const Crew: React.FC = () => {
  const a = at('The Chinese crews') - 1;
  return (
    <Pic src={I.track} size={Z.track} tag={TAG.track} k={[[a, 1000, 1350, 1.3], [at('Two weeks'), 900, 1400, 1.4]]}>
      {(S) => {
        const [cx, cy] = S(780, 1380);
        return (
          <>
            <Loop cx={cx} cy={cy} rx={300} ry={260} at={at('Chinese') - 2} seed={17} tilt={-6} width={6} />
            <Note text="Chinese crews: most of it" x={Math.min(1180, cx + 320)} y={150} size={58} rot={-3} at={at('most') - 2} />
            <Note text="+ eight Irish rail lifters" x={Math.min(1220, cx + 360)} y={260} size={50} rot={-3} at={at('eight') - 2} color="#ffffff" />
          </>
        );
      }}
    </Pic>
  );
};

/** 7 · the lines meet at Promontory Summit. */
const Meet: React.FC = () => (
  <MapDesk a={at('Two weeks') - 1} b={at('Summit') + 6} prog={[0.75, 1]} pinAt={at('Promontory') - 2} zoom={[1.05, 1.22]}
    title={<SlapTitle text="PROMONTORY SUMMIT" x={100} y={80} size={92} at={at('Promontory')} seed={65} />} />
);

/** 8 · May 10, 1869: Russell's photograph (callback to the cold open), parallax push. */
const May10: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('May') - 1;
  const b = at('A telegraph');
  return (
    <AbsoluteFill>
      <PhotoCam src={IMG.spike} size={SZ.spike} cx={1920} cy={keys(f, [[a, 1330], [b, 1290]])} s={zkeys(f, [[a, 0.52], [b, 0.58]])} fg="img/previews/spike_fg.webp" bg="img/previews/spike_bg.jpg" fgK={keys(f, [[a, 0], [b, 0.06]])} />
      <SlapTitle text="MAY 10, 1869" x={100} y={880} size={100} at={at('May')} seed={11} />
      <ScrimTag text={TAG.russell} x={34} y={24} />
    </AbsoluteFill>
  );
};

/** 9 · the telegraph: a key on the flats, clicks running down the wire toward the rest of the country. */
const Wire: React.FC = () => {
  const g = useGFrame();
  const pal = usePal();
  const a = at('A telegraph') - 1;
  return (
    <Pic src={I.flats} size={Z.flats} filter={LITHO} k={[[a, 1000, 560, 1.0], [at('And when'), 1060, 500, 1.12]]}>
      {(S) => {
        const [hx, hy] = S(1030, 400);
        const x0 = 330;
        const y0 = 720;
        const dots = g >= at('blows') - 3 ? Array.from({length: 5}).map((_, i) => {
          const t = (((g - at('blows')) / 34 + i / 5) % 1 + 1) % 1;
          return [x0 + (hx - x0) * t, y0 + (hy - y0) * t, 1 - t] as [number, number, number];
        }) : [];
        return (
          <>
            <Line d={`M${x0},${y0} L${hx},${hy}`} at={at('wire') - 2} dur={10} width={4} />
            <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
              {dots.map(([x, y, k], i) => <circle key={i} cx={x} cy={y} r={6 + 10 * k} fill={pal.mark} opacity={0.4 + 0.6 * k} />)}
            </svg>
            <Prop src={I.key} m={M5.telegraphkey} x={80} y={640} w={420} at={at('telegraph') - 1} />
            <Note text="wired to the last spike" x={110} y={130} size={54} rot={-3} at={at('last spike') - 2} />
            <Note text="(sort of)" x={Math.min(1500, hx + 40)} y={Math.max(80, hy - 160)} size={52} rot={-4} at={at('sort') - 1} color="#ffffff" />
            <Label text="→ the rest of the country" x={Math.min(1350, hx + 20)} y={hy + 40} size={24} at={at('across') - 2} />
          </>
        );
      }}
    </Pic>
  );
};

/** 10 · the message: one word, DONE., on the desk (held ~3 s). */
const Done: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('And when') - 1;
  const sh = shake(f, [at('Done') + 2], 9);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <DeskCam k={[[a, 18, 0.98, 0, 0, -2], [at('golden'), 10, 1.08, 0, 20, 0]]}>
        <Float x={1250} y={560} w={520} hgt={380} h={10} at={a + 2} rot={6} blur={1.2} seed={25}>
          <Prop src={I.key} m={M5.telegraphkey} x={0} y={0} w={500} at={-99} />
        </Float>
      </DeskCam>
      <Label text="the message, May 10, 1869, in one word:" x={300} y={260} size={30} at={at('message') - 2} />
      <SlapTitle text="DONE." x={300} y={360} size={250} at={at('Done')} seed={67} rot={-3} />
    </AbsoluteFill>
  );
};

// ───────────────────────── the myth ─────────────────────────

/** 11 · the golden spike itself (coral), tilting from the head down the engraved shank. */
const Golden: React.FC = () => {
  const a = at('golden') - 1;
  return (
    <AbsoluteFill>
      <Pic src={I.spike} size={Z.spike} tag={TAG.spike} mask={M5.spike} tintAt={a + 3} tint={0.68} traceAt={a + 5} k={[[a, 520, 560, 1.25], [at('The gold spike'), 520, 1000, 1.25]]} />
      <Note text="the golden spike" x={1300} y={180} size={60} rot={-4} at={a + 6} />
      <Note text="Sort of." x={1330} y={760} size={70} rot={-3} at={at('Sort', 2) - 1} color="#ffffff" />
    </AbsoluteFill>
  );
};

/** The tie in section with a pre-drilled hole; spikes go in and out. Screen px. */
const TIE = {x: 560, y: 690, w: 800, h: 210, hole: 960};
const Tie: React.FC<{holeAt: number}> = ({holeAt}) => {
  const pal = usePal();
  const g = useGFrame();
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <rect x={TIE.x} y={TIE.y} width={TIE.w} height={TIE.h} fill="rgba(0,0,0,0.45)" stroke={pal.mark} strokeWidth={6} />
      {Array.from({length: 7}).map((_, i) => <path key={i} d={`M${TIE.x + 20},${TIE.y + 30 + i * 26} Q${TIE.x + TIE.w / 2},${TIE.y + 18 + i * 26 + (i % 2) * 12} ${TIE.x + TIE.w - 20},${TIE.y + 30 + i * 26}`} fill="none" stroke={pal.mark} strokeWidth={1.5} opacity={0.35} />)}
      <rect x={TIE.x - 120} y={TIE.y - 34} width={TIE.w + 240} height={34} fill="rgba(0,0,0,0.5)" stroke={pal.mark} strokeWidth={4} opacity={0.8} />
      {g >= holeAt && <rect x={TIE.hole - 22} y={TIE.y - 34} width={44} height={150} fill="#050403" stroke={pal.mark} strokeWidth={3} strokeDasharray="8 6" opacity={interpolate(g, [holeAt, holeAt + 6], [0, 1], clamp)} />}
      <line x1={0} y1={TIE.y + TIE.h} x2={1920} y2={TIE.y + TIE.h} stroke={pal.mark} strokeWidth={2} opacity={0.4} />
    </svg>
  );
};

/** The golden spike as a cut-out (coral soft tint), its tip at (x, tipY), 86 px wide. */
const GoldSpike: React.FC<{x: number; tipY: number; traceAt?: number}> = ({x, tipY, traceAt}) => {
  const [bx0, by0, bx1, by1] = M5.spike.data.boxes.subject;
  const sc = 86 / (bx1 - bx0);
  return <CutOut src={I.spike} size={Z.spike} mask={M5.spike} place={{left: x - 43 - bx0 * sc, top: tipY - by1 * sc, scale: sc}} at={-99} tint={0.7} soft traceAt={traceAt} filter={BWX} />;
};

/** 12 · in, a gentle tap, and right back out. */
const InAndOut: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const a = at('The gold spike') - 1;
  const down = interpolate(g, [at('went into') , at('went into') + 6], [0, 1], {...clamp, easing: (t) => t * t});
  const up = interpolate(g, [at('came right'), at('came right') + 10], [0, 1], {...clamp, easing: (t) => 1 - (1 - t) * (1 - t)});
  const tap = g >= at('tap') - 2 && g < at('tap') + 4 ? 8 : 0;
  const tipY = TIE.y + 70 - 330 * (1 - down) - 360 * up + tap;
  const sh = shake(f, [at('tap')], 3);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <DeskCam k={[[a, 4, 1.0, 0, 0, 0], [at('An ordinary'), 4, 1.04, 0, 0, 0]]}><></></DeskCam>
      <Tie holeAt={at('hole') - 2} />
      <GoldSpike x={TIE.hole} tipY={tipY} traceAt={a + 4} />
      <Label text="hole drilled ahead of time" x={1020} y={TIE.y + 130} size={24} at={at('drilled') - 1} />
      <Note text="a gentle tap" x={1080} y={300} size={56} rot={-4} at={at('gentle') - 2} />
      <Note text="…and back out" x={1080} y={400} size={56} rot={-4} at={at('back out') - 1} color="#ffffff" />
      <ScrimTag text={TAG.spike} />
    </AbsoluteFill>
  );
};

/** 13 · an ordinary iron spike goes in its place. */
const Iron: React.FC = () => {
  const g = useGFrame();
  const f = useCurrentFrame();
  const a = at('An ordinary') - 1;
  const down = interpolate(g, [at('went in') - 2, at('went in') + 4], [0, 1], {...clamp, easing: (t) => t * t});
  const sh = shake(f, [at('went in') + 4], 6);
  const [bx0, by0, bx1, by1] = M5.ironspike.data.boxes.subject;
  const len = 420;
  const sc = len / (bx1 - bx0);
  const thick = (by1 - by0) * sc;
  // the prop lies on its side, tip left; rotate +90° so the tip points down, then drop it into the hole
  const tipY = TIE.y + 70 - 380 * (1 - down);
  const cx = TIE.hole;
  const cy = tipY - len / 2;
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <DeskCam k={[[a, 4, 1.04, 0, 0, 0], [at('And the man'), 4, 1.08, 0, 0, 0]]}><></></DeskCam>
      <Tie holeAt={-99} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${cx}px ${cy}px`, transform: `rotate(-90deg)`}}>
        <CutOut src={I.iron} size={[1920, 1920]} mask={M5.ironspike} place={{left: cx - len / 2 - bx0 * sc, top: cy - thick / 2 - by0 * sc, scale: sc}} at={-99} filter="saturate(0.4) contrast(1.1)" />
      </div>
      <Note text="an ordinary iron spike" x={1080} y={300} size={58} rot={-4} at={at('ordinary') - 1} />
    </AbsoluteFill>
  );
};

/** 14 · Stanford swings… and (reportedly) misses. */
const Miss: React.FC = () => {
  const g = useGFrame();
  const f = useCurrentFrame();
  const a = at('And the man') - 1;
  const hit = at('missed') - 3;
  const rot = interpolate(g, [a, at('swinging'), hit - 5, hit], [-8, -18, -24, -123], {...clamp, easing: (t) => t * t});
  const sh = shake(f, [hit + 1], 12);
  const [bx0, , bx1] = M5.sledgehammer.data.boxes.subject;
  const w = 480;
  const sc = w / (bx1 - bx0);
  const pivot: [number, number] = [1500, 760];
  const len = 420;
  const sscale = len / (M5.ironspike.data.boxes.subject[2] - M5.ironspike.data.boxes.subject[0]);
  const ib = M5.ironspike.data.boxes.subject;
  const icy = TIE.y + 70 - len / 2;
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <DeskCam k={[[a, 4, 1.08, 0, 0, 0], [at('So go back'), 4, 1.14, 0, 20, 0]]}><></></DeskCam>
      <Tie holeAt={-99} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${TIE.hole}px ${icy}px`, transform: 'rotate(-90deg)'}}>
        <CutOut src={I.iron} size={[1920, 1920]} mask={M5.ironspike} place={{left: TIE.hole - len / 2 - ib[0] * sscale, top: icy - ((ib[3] - ib[1]) * sscale) / 2 - ib[1] * sscale, scale: sscale}} at={-99} filter="saturate(0.4) contrast(1.1)" />
      </div>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${pivot[0]}px ${pivot[1]}px`, transform: `rotate(${rot}deg)`}}>
        <CutOut src={I.sledge} size={[1920, 1920]} mask={M5.sledgehammer} place={{left: pivot[0] - 190 * sc, top: pivot[1] - 1660 * sc, scale: sc}} at={-99} filter="saturate(0.45) contrast(1.1)" />
      </div>
      <Label text="Leland Stanford · Central Pacific president" x={110} y={110} size={26} at={at('Leland') - 2} />
      <Note text="reportedly missed" x={110} y={200} size={70} rot={-3} at={at('reportedly') - 1} />
    </AbsoluteFill>
  );
};

// ───────────────────────── back to the photograph ─────────────────────────

/** The desk with the torn Russell print, the worker cut-out in the gap (coral), the Promontory map card. */
const DeskPieces: React.FC<{worker: number}> = ({worker}) => (
  <>
    <Lift x={130} y={80} w={1150} hgt={875} h={10} at={-99} rot={-2} seed={2}>
      <TornPrint src={IMG.spike} size={SZ.spike} x={0} y={0} w={1150} at={-99} seed={3} corner={{at: 'br', x: 0.7, y: 0.58}} real grey shadow={5}
        tapes={[{x: -50, y: 30, w: 190, rot: -38}, {x: 1010, y: -6, w: 190, rot: 30}]} />
    </Lift>
    <Lift x={900} y={440} w={330} hgt={520} h={46} at={worker} seed={7}>
      <CutOut src={I.worker} size={SZ.tunnel8} mask={SM.worker} place={{left: 10 - 519 * 0.95, top: 18 - 1291 * 0.95, scale: 0.95}} at={-99} tint={0.6} soft traceAt={worker + 6}
        filter="grayscale(1) contrast(1.15) brightness(1.2)" />
    </Lift>
  </>
);

/** 15 · "So go back to the photograph": the torn print on the desk; the worker lands in the gap on "A Chinese crew". */
const Back: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('So go back') - 1;
  const w = at('Chinese crew') - 2;
  const sh = shake(f, [w + 3], 10);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <DeskCam k={[[a, 26, 0.86, 0, 0, -2], [at('By some'), 15, 0.92, 0, 10, 0]]}>
        <DeskPieces worker={w} />
      </DeskCam>
      <Note text="laid some of the last rails" x={1290} y={140} size={52} rot={-3} at={at('laid') - 2} />
      <ScrimTag text={`${TAG.russell}  ·  worker: A. A. Hart, Tunnel No. 8 · LOC`} x={34} y={1026} />
    </AbsoluteFill>
  );
};

/** 16 · push into the gap: cheered, and not in the picture. */
const Gap: React.FC = () => {
  const a = at('By some') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 14, 1.3, -260, -160, 0], [at('What the'), 12, 1.55, -380, -260, 0]]}>
        <DeskPieces worker={-99} />
      </DeskCam>
      <Note text="by some accounts, the crowd cheered them" x={100} y={90} size={50} rot={-2} at={at('accounts') - 2} color="#ffffff" />
      <Note text="not in the famous picture" x={100} y={900} size={64} rot={-3} at={at('not in') - 2} />
    </AbsoluteFill>
  );
};

// ───────────────────────── what it changed ─────────────────────────

/** 17 · the flats, wide: what the railroad changed; New York → San Francisco. */
const Changed: React.FC = () => (
  <Pic src={I.flats} size={Z.flats} filter={LITHO} k={[[at('What the') - 1, 960, 520, 1.3], [at('took'), 960, 540, 1.0]]}>
    {() => (
      <>
        <Note text="what it changed: enormous" x={110} y={110} size={60} rot={-3} at={at('enormous') - 2} />
        <SlapTitle text="NEW YORK → SAN FRANCISCO" x={110} y={860} size={80} at={at('New York')} seed={69} />
      </>
    )}
  </Pic>
);

/** 18–19 · two bars: months before; about a week after (coral, the subject). */
const Bars: React.FC<{detail: boolean}> = ({detail}) => {
  const a = detail ? at('Now') - 1 : at('took') - 1;
  const b = detail ? at('And the man', 2) : at('Now');
  const pal = usePal();
  const cam = detail ? [[a, 8, 1.35, 300, -60, 0], [b, 8, 1.5, 380, -80, 0]] : [[a, 10, 1.0, 0, 0, -1], [b, 10, 1.04, 0, 0, 0]];
  return (
    <AbsoluteFill>
      <DeskCam k={cam as [number, number, number, number, number, number][]}>
        <div style={{position: 'absolute', left: 400, top: 300, width: 1920, height: 1080}}>
          <div style={{position: 'absolute', left: 140, top: 150, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: pal.mark}}>NEW YORK → SAN FRANCISCO · TRAVEL TIME (APPROX.)</div>
          <HBar x={140} y={380} w={1380} h={90} at={detail ? -99 : at('months')} color="rgba(237,231,220,0.7)" label="BEFORE · BY WAGON, OR BY SHIP AROUND SOUTH AMERICA" value="" />
          <Lines x={150} y={490} size={56} rows={[{text: 'months', at: detail ? -99 : at('months') + 4, color: '#f4efe6'}]} />
          <HBar x={140} y={720} w={80} h={90} at={detail ? at('About a') - 1 : 1e7} color={pal.subject} label="1869 · BY RAIL" value="about a week" />
        </div>
      </DeskCam>
    </AbsoluteFill>
  );
};

/** 20 · hand-off: the man who won the war (Grant, traced in teal), about to become president. */
const Handoff: React.FC = () => {
  const a = at('And the man', 2) - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 14, 0.96, 0, 0, 0], [END, 10, 1.06, 0, 20, 0]]}><></></DeskCam>
      <CircleMount src={I.grant} size={Z.grant} cx={1300} cy={520} r={340} fx={1250} fy={1500} scale={0.4} at={a + 1} mask={M6.grant} traceAt={at('Civil War') - 2} />
      <Label text="Ulysses S. Grant" x={140} y={330} size={30} at={at('won') - 2} />
      <Lines x={140} y={420} size={60} rows={[{text: 'won the Civil War', at: at('Civil War') - 2}, {text: '→ president?', at: at('president', 2) - 2}]} />
      <Note text="he promised something too" x={140} y={760} size={52} rot={-3} at={at('promised') - 2} color="#ffffff" />
      <ScrimTag text={TAG.grant} />
    </AbsoluteFill>
  );
};

// ───────────────────────── assembly ─────────────────────────

const c = (w: string, n = 1) => at(w, n) - 1;
const SHOTS: [number, React.ReactNode, ('whip' | 'cut')?][] = [
  [0, <Spring />],
  [c('And the Central'), <Bet detail={false} />, 'cut'],
  [c('that its crews'), <Bet detail />, 'cut'],
  [c('On April'), <April />, 'whip'],
  [c("That's about"), <Ties />, 'cut'],
  [c('set by'), <ByHand />, 'cut'],
  [c('The Chinese crews'), <Crew />, 'cut'],
  [c('Two weeks'), <Meet />, 'whip'],
  [c('May'), <May10 />, 'cut'],
  [c('A telegraph'), <Wire />, 'cut'],
  [c('And when'), <Done />, 'cut'],
  [c('golden'), <Golden />, 'whip'],
  [c('The gold spike'), <InAndOut />, 'cut'],
  [c('An ordinary'), <Iron />, 'cut'],
  [c('And the man'), <Miss />, 'cut'],
  [c('So go back'), <Back />, 'whip'],
  [c('By some'), <Gap />, 'cut'],
  [c('What the'), <Changed />, 'whip'],
  [c('took'), <Bars detail={false} />, 'cut'],
  [c('Now'), <Bars detail />, 'cut'],
  [c('And the man', 2), <Handoff />, 'cut'],
];

const tick = (w: string, d = 2, n = 1): SfxRow => [at(w, n) - d, 'marker_tick', 0.2];
const SFX: SfxRow[] = [
  ...SHOTS.slice(1).map(([s, , k]): SfxRow => (k === 'whip' ? [s - 4, 'whip_soft', 0.25] : [s, 'whoosh', 0.22])),
  [8, 'stamp', 0.22], [0, 'card_slide_soft', 0.18],
  tick('bet'), tick('ten'), tick('single'),
  [at('April'), 'stamp', 0.22], [at('did it') + 1, 'paper_slap_soft', 0.25], [at('Ten miles', 2), 'block_tap_soft', 0.15], [at('56'), 'block_tap_soft', 0.15], tick('feet', -2),
  ...Array.from({length: 6}).map((_, i): SfxRow => [at("That's about") + 6 + i * 22, 'spike_tap_distant', 0.14]),
  [at('hand') + 1, 'paper_slap_soft', 0.25], [at('one day') - 1, 'paper_slap_soft', 0.2], tick('hand', 0),
  tick('Chinese'), tick('most'), tick('eight'),
  [at('Promontory'), 'stamp', 0.22], [at('Promontory') - 2, 'block_tap_soft', 0.15],
  [at('May'), 'stamp', 0.22],
  [at('telegraph'), 'paper_slap_soft', 0.2], tick('last spike'), ...Array.from({length: 5}).map((_, i): SfxRow => [at('blows') + i * 7, 'tick_soft', 0.12]), tick('sort', 1),
  tick('message', 2), [at('Done'), 'stamp', 0.26],
  tick('golden', -4), tick('Sort', 1, 2),
  [at('went into') + 6, 'spike_tap_distant', 0.15], [at('tap'), 'spike_tap_distant', 0.12], tick('gentle'), tick('back out', 1),
  [at('went in') + 4, 'spike_tap_distant', 0.15], tick('ordinary', 1),
  [at('missed') - 2, 'paper_slap_soft', 0.25], tick('Leland', 2), tick('reportedly', 1),
  [at('Chinese crew') + 1, 'paper_slap_soft', 0.25], [at('Chinese crew') + 6, 'tape_press', 0.18], tick('laid'),
  tick('accounts'), tick('not in'),
  tick('enormous'), [at('New York'), 'stamp', 0.22],
  [at('months'), 'card_slide_soft', 0.18], tick('months', -4), [at('About a') - 1, 'block_tap_soft', 0.15],
  [at('And the man', 2) + 1, 'card_slide_soft', 0.18], tick('Civil War'), tick('promised'),
];

const Body: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Shots shots={SHOTS} />
    <Sounds list={SFX} />
  </AbsoluteFill>
);

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_done.wav" lead={LEAD} music={[
    // SUNO: aw_iron_horse replaces this (ten miles in a day)
    {src: 'music/g_cotton_engine.mp3', volume: 0.15, to: at('You may') + 4, fadeOut: 24},
    // SUNO: aw_legend_sours replaces this (the golden-spike myth)
    {src: 'music/a_price.mp3', volume: 0.15, from: at('You may') - 6, to: at('So go back') + 6, fadeOut: 30},
    // SUNO: aw_iron_horse reprise replaces this
    {src: 'music/g_cotton_engine.mp3', volume: 0.14, from: at('So go back') - 6, startFrom: 30 * 40},
  ]}>
    <Body />
  </ChapterShell>
);

