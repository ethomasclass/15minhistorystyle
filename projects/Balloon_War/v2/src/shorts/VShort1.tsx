// Short 1 · "Kept Secret" (1080x1920, 30 fps): a custom narration (public/audio/vshort1_kept_secret.wav, 52.7 s, script
// script/shorts/short1_kept_secret.txt), every cut anchored to its words with t.at().
//   0:00  cover (frame 0, fully drawn): BW10 Wyoming flash cropped tall, AMERICA WAS UNDER ATTACK + KEPT SECRET tape; push + flare
//   0:05.9 "The bombs came on giant paper balloons"            BW01, the coral balloon on the beach
//   0:08.6 "riding the wind five thousand miles"               PacificWinds (3D, portrait), the balloon rides the jet stream
//   0:12.3 "Hundreds came down. Oregon. Montana..."            LandingMap (3D, portrait); the running device starts:
//                                                              LANDED counts to 285 / IN THE NEWS: 0 (on screen until May 5)
//   0:17.9 "So the government asked every newspaper..."        BW13, the presses
//   0:21.9 "don't report them. Not one word."                  the 1945 press code, censor bars, NOT ONE WORD
//   0:24.7 "If Japan never heard... And it did."               balloons launched per month, Nov 1944 -> 0 in May 1945
//   0:29.8 "But nobody warned the public, either."             Klamath Falls, 1941; a third counter, WARNED: 0
//   0:32.1 THE QUIET BEAT (no coral graphics, no tape, no stamps, slower moves, music almost out, captions without tape):
//          "On May 5, 1945" the Gearhart Mountain pines · "a pastor's wife and five kids" BW04 (the car, no people) ·
//          "found one in the woods" BW03 · "All six were killed" the Mitchell Monument, slow push to the plaque
//   0:47.2 "The silence worked. And it cost six lives."        the payoff card, plain type
//   0:50.7 "The whole story is on the channel."                end card: the full video (Japan Bombed America With Paper)
//   0:53.1 the cover again, frozen on frame 0, so a replay loops
// Respect (script/SILHOUETTES.md): no images of the victims, no silhouettes of Elsie or the children, nothing invented.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Freeze, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Highlight, Note, PALETTES, PaletteCtx, StepCtx, useGFrame, Finish} from '../kit/Kit';
import {JF} from '../kit/Kit';
import {DarkPaper, Sfx} from '../kit/common';
import {Print} from '../kit/print';
import {bed} from '../kit/levels';
import {makeTimeline, type Narration} from '../lib/timing';
import {PacificWinds, pacificPoint} from '../fx/PacificWinds';
import {LandingMap, W3} from '../fx/LandingMap';
import {camAt, type CamKey} from '../fx/kit3d';
import incJson from '../../public/data/fugo_incidents.json';
import words from '../../public/audio/vshort1_kept_secret.words.json';
import {atPx, BigType, Captions, clamp, CORAL, CREAM, Cut, INKBG, Mark, ORANGE, projV, TEAL, V3D, VPhoto, VSil, VTag} from './vkit';

const N = words as Narration;
const FPS = 30;
const T = makeTimeline(N, FPS);
const at = T.at;
const SIL: [number, number] = [2752, 1536];

// cuts (frames): one frame before the word that starts the idea
const C = {
  bombs: at('The bombs') - 1, riding: at('riding') - 1, hundreds: at('Hundreds') - 1, so: at('So the government') - 1, dont: at("don't report") - 1,
  ifj: at('If Japan') - 1, but: at('But nobody') - 1, may: at('On May') - 1, pastor: at("a pastor's") - 1, found: at('found one') - 1, all: at('All six') - 1,
  silence: at('The silence') - 1, whole: at('The whole story') - 1,
};
const SPEECH_END = Math.ceil(N.duration * FPS);
const LOOP_AT = SPEECH_END + 12; // the end card holds a beat after the last word, then the cover returns
const LOOP_TAIL = 30;
export const VSHORT1_FRAMES = LOOP_AT + LOOP_TAIL;

// ---------------------------------------------------------------------------------------------
// The cover: BW10 cropped tall and set low (the sky continued above it), the flash and the parachute under the type.

const FLASH: [number, number] = [1224, 250]; // the coral burst, painting px

/** The flash flaring: a coral glow on the sky plate that surges from frame 1 and keeps flickering. */
const Flare: React.FC = () => {
  const f = useCurrentFrame();
  const surge = interpolate(f, [0, 6, 30], [0, 1, 0.35], clamp);
  const flick = 0.12 * Math.sin(f * 0.9) + 0.08 * Math.sin(f * 2.3);
  const k = 0.55 + surge * 0.9 + flick;
  const r = 230 * (0.85 + surge * 0.5);
  return (
    <div style={{...atPx(SIL, FLASH[0], FLASH[1]), width: 0, height: 0}}>
      <div style={{position: 'absolute', left: -r, top: -r, width: r * 2, height: r * 2, borderRadius: '50%', mixBlendMode: 'screen', opacity: Math.min(1, k),
        background: `radial-gradient(circle, rgba(255,243,224,0.95) 0%, ${CORAL}cc 10%, rgba(255,111,97,0.32) 34%, transparent 70%)`}} />
    </div>
  );
};

const Cover: React.FC<{b: number}> = ({b}) => {
  const f = useCurrentFrame();
  const kept = at('kept');
  const pulse = interpolate(f, [kept, kept + 4, kept + 10], [1, 1.09, 1], clamp);
  return (
    <AbsoluteFill>
      <VSil name="BW10_wyoming_flash" a={0} b={b} cx={[1530, 1515]} top={320} z={[1.0, 1.08]} oy={820} drift={[0, -10]} glow={0.5}
        insert={[{plane: 3, node: <Flare />}]} />
      {/* darken the top so the type reads; the continued sky is dark there anyway */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,7,5,0.55) 0%, rgba(8,7,5,0.25) 28%, rgba(8,7,5,0) 40%)'}} />
      <BigType lines={['AMERICA', 'WAS UNDER', 'ATTACK']} x={60} y={176} size={138} />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${pulse})`, transformOrigin: '550px 710px'}}>
        <Highlight text="KEPT SECRET" x={196} y={646} size={100} at={-30} seed={211} rot={-3} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// The running device: LANDED counts with the map's pins; IN THE NEWS stays at 0; WARNED joins on "warned".

type Inc = {date: string};
const day = (iso: string) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) / 86400000;
const INC_DAYS = (incJson as unknown as Inc[]).map((e) => day(e.date)).sort((a, b) => a - b);
const MAP_FROM = '1944-11-01', MAP_TO = '1945-07-25', MAP_DUR = 150; // the map's date window, from the cut to "Alaska"
const landedAt = (g: number) => {
  const d = day(MAP_FROM) + (Math.max(0, g) / MAP_DUR) * (day(MAP_TO) - day(MAP_FROM));
  return INC_DAYS.filter((x) => x <= d).length;
};

const Chip: React.FC<{label: string; value: string; w: number; color: string; at: number; pulse?: number[]}> = ({label, value, w, color, at: a, pulse = []}) => {
  const g = useGFrame();
  if (g < a) return null;
  const k = interpolate(g, [a, a + 3, a + 6], [1.25, 0.96, 1], clamp);
  const p = pulse.reduce((m, q) => Math.max(m, interpolate(g, [q, q + 3, q + 10], [0, 1, 0], clamp)), 0);
  return (
    <div style={{width: w, padding: '10px 14px 8px 16px', borderRadius: 6, background: 'rgba(10,9,7,0.8)', borderLeft: `7px solid ${color}`, boxShadow: '0 10px 24px rgba(0,0,0,0.55)',
      transform: `scale(${k * (1 + 0.08 * p)})`, transformOrigin: 'left center'}}>
      <div style={{fontFamily: JF.mono, fontSize: 21, letterSpacing: 3, color: 'rgba(244,239,230,0.85)', whiteSpace: 'nowrap'}}>{label}</div>
      <div style={{fontFamily: JF.sans, fontWeight: 800, fontSize: 74, lineHeight: 1.0, color: p > 0.3 ? ORANGE : color === TEAL ? CREAM : color, fontVariantNumeric: 'tabular-nums'}}>{value}</div>
    </div>
  );
};

const Counters: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  if (f < C.hundreds || f >= C.may) return null;
  const o = interpolate(f, [C.may - 8, C.may], [1, 0], clamp);
  const landed = landedAt(g - C.hundreds);
  return (
    <div style={{position: 'absolute', left: 60, top: 168, display: 'flex', gap: 14, opacity: o}}>
      <Chip label="LANDED" value={String(landed)} w={270} color={TEAL} at={C.hundreds} />
      <Chip label="IN THE NEWS" value="0" w={300} color={ORANGE} at={C.hundreds + 8} pulse={[at('Not one'), at('heard')]} />
      <Chip label="WARNED" value="0" w={260} color={ORANGE} at={at('warned')} />
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
// Beats

/** "The bombs came on giant paper balloons," BW01: the coral balloon on the beach at dawn. */
const Giant: React.FC<{b: number}> = ({b}) => (
  <AbsoluteFill>
    <VSil name="BW01_beach_dawn" glowLayer={1} a={0} b={b} cx={[700, 790]} top={-60} z={[1.03, 1.11]} oy={700} fog={0.25} />
    <Note text="33 feet across" x={110} y={268} size={64} rot={-4} at={at('giant') - C.bombs} color={TEAL} />
  </AbsoluteFill>
);

/** "riding the wind five thousand miles across the Pacific." The map tracks the balloon from Japan to Oregon. */
const PW_CAM: CamKey[] = [
  {f: 0, target: pacificPoint(150, 40), dist: 15, yaw: 0, pitch: 1.0},
  {f: 108, target: pacificPoint(222, 44), dist: 15.5, yaw: -0.02, pitch: 0.96},
];
const Winds: React.FC = () => {
  const f = useCurrentFrame();
  const c = camAt(PW_CAM, f);
  const jp = projV(c, pacificPoint(138, 36.5));
  const or = projV(c, pacificPoint(237, 44));
  return (
    <AbsoluteFill>
      <V3D>
        <PacificWinds at={-40} windsAt={-30} balloonAt={-30} routeAt={0} routeDur={104} labels={false} hud={false} cam={PW_CAM} />
      </V3D>
      <MapTag text="JAPAN" x={jp.x} y={jp.y + 30} o={interpolate(f, [0, 40, 52], [1, 1, 0], clamp)} />
      <MapTag text="OREGON" x={or.x} y={or.y + 30} o={interpolate(f, [70, 80], [0, 1], clamp)} />
      <Highlight text="5,000 MILES" x={70} y={300} size={112} at={at('five thousand') - C.riding} seed={212} rot={-3} />
      <VTag text="Winds: NOAA reanalysis, January 1945 · path follows that mean wind" />
    </AbsoluteFill>
  );
};

const MapTag: React.FC<{text: string; x: number; y: number; o?: number; color?: string}> = ({text, x, y, o = 1, color = CREAM}) => {
  if (o <= 0.01) return null;
  const cx = Math.min(930 - text.length * 16, Math.max(60 + text.length * 16, x));
  return (
    <div style={{position: 'absolute', left: cx, top: y, transform: 'translate(-50%, 0)', opacity: o, fontFamily: JF.mono, fontSize: 30, letterSpacing: 5, color, whiteSpace: 'nowrap',
      background: 'rgba(7,9,8,0.66)', padding: '4px 12px', borderRadius: 4, textShadow: '0 2px 8px #000'}}>{text}</div>
  );
};

/** "Hundreds came down. Oregon. Montana. Wyoming. Even Alaska." The pins stand up in date order; the camera opens out for Alaska. */
const LM_ALASKA = at('Even') - C.hundreds;
const LM_CAM: CamKey[] = [
  {f: 0, target: W3(-116, 45), dist: 19, yaw: 0, pitch: 1.02},
  {f: LM_ALASKA - 18, target: W3(-117, 46), dist: 21, yaw: 0, pitch: 1.0},
  {f: LM_ALASKA + 20, target: W3(-128, 52), dist: 31, yaw: 0, pitch: 1.04},
];
const STATES: [string, number, number, string][] = [
  ['Oregon', -120.6, 43.9, 'Oregon.'], ['Montana', -109.6, 47.0, 'Montana.'], ['Wyoming', -107.5, 43.0, 'Wyoming.'], ['Alaska', -151, 63.5, 'Alaska.'],
];
const Landing: React.FC = () => {
  const f = useCurrentFrame();
  const c = camAt(LM_CAM, f);
  return (
    <AbsoluteFill>
      <V3D>
        <LandingMap at={0} dur={MAP_DUR} from={MAP_FROM} to={MAP_TO} blyColor={CREAM} blyLabel={false} bars={false} hud={false} cam={LM_CAM} />
      </V3D>
      {/* each state is written beside its pins while it is said, then gives way to the next (labels kept inside x 60-930) */}
      {STATES.map(([name, lon, lat, word], i) => {
        const a = at(word) - C.hundreds;
        const out = i < STATES.length - 1 ? at(STATES[i + 1][3]) - C.hundreds : 1e9;
        if (f < a || f >= out) return null;
        const p = projV(c, W3(lon, lat, 0.4));
        const w = name.length * 58;
        return <Note key={name} text={name} x={Math.min(920 - w, Math.max(70, p.x - w / 2))} y={Math.max(330, p.y - 110)} size={76} rot={-4} at={a} color={TEAL} />;
      })}
      <VTag text="285 balloon incidents · Mikesh, Smithsonian, 1973 · map: Natural Earth" />
    </AbsoluteFill>
  );
};

/** "So the government asked every newspaper and radio station in the country:" BW13, the presses. */
const Presses: React.FC<{b: number}> = ({b}) => (
  <AbsoluteFill>
    <VSil name="BW13_presses" a={0} b={b} cx={[1660, 1800]} k={1.08} z={[1.04, 1.1]} oy={900} fog={0.2} />
    <VTag text="Illustration · a newspaper pressroom" />
  </AbsoluteFill>
);

/** "don't report them. Not one word." The 1945 press code; black bars wipe over its paragraph. */
const CODE = {x: 230, y: 330, w: 620, s: 620 / 2523};
const Code: React.FC = () => {
  const g = useGFrame();
  const r = (p: string) => at(p) - C.dont;
  const bars: [number, number, number][] = [[1440, 1560, r('report')], [1590, 1710, r('report') + 5], [1730, 1860, r('them.')]];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{background: 'radial-gradient(circle 760px at 540px 760px, rgba(255,214,160,0.1) 0%, transparent 100%)'}} />
      <Print src="img/v2/price/code_of_wartime_practices_press_radio_may1945.jpg" x={CODE.x} y={CODE.y} w={CODE.w} h={Math.round(3958 * CODE.s)} at={1} rot={-1} fit="contain" />
      {bars.map(([y0, y1, a], i) => {
        const w = interpolate(g, [a, a + 8], [0, 1], clamp);
        return <div key={i} style={{position: 'absolute', left: CODE.x + 360 * CODE.s, top: CODE.y + y0 * CODE.s, width: 1820 * CODE.s * w, height: (y1 - y0) * CODE.s,
          background: '#0d0c09', transform: 'rotate(-1deg)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)'}} />;
      })}
      <Highlight text="NOT ONE WORD" x={70} y={960} size={92} at={r('Not one')} seed={213} rot={-3} />
      <VTag text="Code of Wartime Practices, 1945 · Office of Censorship" />
    </AbsoluteFill>
  );
};

/** "If Japan never heard the balloons were working, it would stop sending them. And it did." Launches per month to zero. */
const LAUNCH: [string, number, string][] = [['NOV', 700, '700'], ['DEC', 1200, '1,200'], ['JAN', 2000, '2,000'], ['FEB', 2500, '2,500'], ['MAR', 2500, '2,500'], ['APR', 400, '400'], ['MAY', 0, '0']];
const Launches: React.FC = () => {
  const g = useGFrame();
  const r = (p: string) => at(p) - C.ifj;
  const starts = [2, 9, 16, 23, 30, r('stop'), r('did')];
  const x0 = 96, slot = 120, bw = 86, base = 1066, hMax = 380;
  const cur = starts.reduce((m, s, i) => (g >= s ? i : m), 0);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{background: 'radial-gradient(circle 800px at 520px 800px, rgba(255,214,160,0.09) 0%, transparent 100%)'}} />
      <div style={{position: 'absolute', left: 70, top: 334, fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, color: CREAM, whiteSpace: 'nowrap'}}>BALLOONS LAUNCHED</div>
      <Note text="per month, 1944-45" x={80} y={382} size={54} rot={-3} at={-30} color={TEAL} />
      {LAUNCH.map(([m, v, s], i) => {
        const k = interpolate(g, [starts[i], starts[i] + 8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        const h = (v / 2500) * hMax * k;
        const x = x0 + i * slot;
        const on = g >= starts[i];
        const isCur = i === cur;
        return (
          <React.Fragment key={m}>
            {on && v > 0 && <div style={{position: 'absolute', left: x, top: base - h, width: bw, height: h, background: isCur ? CREAM : TEAL, opacity: isCur ? 1 : 0.78, borderRadius: '3px 3px 0 0'}} />}
            {on && v === 0 && <div style={{position: 'absolute', left: x, top: base - 6, width: bw, height: 6, background: CREAM}} />}
            {on && <div style={{position: 'absolute', left: x - 20, width: bw + 40, top: base - h - 44, textAlign: 'center', fontFamily: JF.mono, fontSize: v === 0 ? 40 : 27,
              color: isCur ? CREAM : 'rgba(244,239,230,0.75)', opacity: k}}>{s}</div>}
            <div style={{position: 'absolute', left: x - 10, width: bw + 20, top: base + 12, textAlign: 'center', fontFamily: JF.mono, fontSize: 26, letterSpacing: 2,
              color: on ? CREAM : 'rgba(244,239,230,0.35)'}}>{m}</div>
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', left: x0 - 14, top: base, width: slot * 7, height: 3, background: 'rgba(244,239,230,0.6)'}} />
      <Highlight text="THEY STOPPED." x={200} y={480} size={88} at={r('did')} seed={214} rot={-3} />
      <VTag text="Launches: Mikesh, Smithsonian, 1973 · April = early April" />
    </AbsoluteFill>
  );
};

/** "But nobody warned the public, either." An Oregon town in 1941 (Klamath Falls, the county seat near Bly). */
const Town: React.FC<{b: number}> = ({b}) => (
  <AbsoluteFill>
    <VPhoto src="img/ch06_bly/klamath_falls_town_view_1941.jpg" size={[6000, 4584]} fx={[2700, 2900]} fy={[2250, 2300]} z={[1.1, 1.17]} a={0} b={b} />
    <VTag text="Klamath Falls, Oregon, 1941 · Russell Lee, Library of Congress" />
  </AbsoluteFill>
);

// ---- the quiet beat: no coral graphics, no tape, no stamps; slow moves, prints fade in ----

/** "On May 5, 1945," the ponderosa pines of Gearhart Mountain; the date in plain type. */
const Pines: React.FC<{b: number}> = ({b}) => (
  <AbsoluteFill>
    <VPhoto src="img/ch06_bly/gearhart_mountain_ponderosa_pine_1964.jpg" size={[1390, 1925]} fx={[700, 700]} fy={[1000, 1050]} z={[1.08, 1.12]} a={0} b={b} fade={10} dim={0.05} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,7,5,0.55) 0%, rgba(8,7,5,0.1) 30%, transparent 45%)'}} />
    <BigType lines={['MAY 5, 1945']} x={70} y={250} size={118} at={at('May') - C.may} color={CREAM} />
    <div style={{position: 'absolute', left: 70, top: 392, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: 'rgba(244,239,230,0.92)', textShadow: '0 2px 10px #000',
      background: 'rgba(10,9,7,0.72)', padding: '6px 14px', borderRadius: 5,
      opacity: interpolate(useCurrentFrame(), [12, 22], [0, 1], clamp)}}>GEARHART MOUNTAIN, OREGON</div>
    <VTag text="Ponderosa pines, Gearhart Mountain · USFS / National Archives" />
  </AbsoluteFill>
);

/** "a pastor's wife and five kids on a church picnic in Oregon" BW04: the car on the forest road, no people. */
const Road: React.FC<{b: number}> = ({b}) => (
  <AbsoluteFill>
    <VSil name="BW04_bly_road" a={0} b={b} cx={[1500, 1560]} top={-430} z={[1.0, 1.04]} oy={1000} drift={[6, -6]} fog={0.3} quietGrade />
    <Fade frames={10} />
    <VTag text="Illustration · a forest road near Bly" />
  </AbsoluteFill>
);

/** "found one in the woods. It exploded." BW03: the balloon in the pines, no one near it; the woods darken on "exploded". */
const Woods: React.FC<{b: number}> = ({b}) => {
  const f = useCurrentFrame();
  const dark = interpolate(f, [at('exploded') - C.found, at('exploded') - C.found + 24], [0, 0.5], clamp);
  return (
    <AbsoluteFill>
      <VSil name="BW03_woods_open" glowLayer={2} glow={0.3} a={0} b={b} cx={[1080, 1060]} z={[1.04, 1.08]} oy={760} drift={[6, -6]} fog={0.4} />
      <AbsoluteFill style={{background: `rgba(8,7,5,${0.15 + dark})`}} />
      <Fade frames={10} />
      <VTag text="Illustration · the woods on Gearhart Mountain" />
    </AbsoluteFill>
  );
};

/** "All six were killed, the only people killed by enemy action on the American mainland in the whole war." The monument. */
const Monument: React.FC<{b: number}> = ({b}) => (
  <AbsoluteFill>
    <VPhoto src="img/ch06_bly/mitchell_monument_usfs_2007.jpg" size={[1920, 1276]} fx={[960, 945]} fy={[700, 640]} z={[1.0, 1.32]} a={0} b={b} fade={14} dim={0.04}
      ease={(t) => t} />
    <VTag text="The Mitchell Monument, Gearhart Mountain, Oregon · USFS, 2007" />
  </AbsoluteFill>
);

const Fade: React.FC<{frames: number}> = ({frames}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, frames], [1, 0], clamp);
  return o > 0 ? <AbsoluteFill style={{background: INKBG, opacity: o}} /> : null;
};

/** "The silence worked. And it cost six lives." One quotable card. */
const Payoff: React.FC = () => {
  const r = (p: string) => at(p) - C.silence;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{background: 'radial-gradient(circle 700px at 540px 760px, rgba(255,214,160,0.08) 0%, transparent 100%)'}} />
      <BigType lines={['THE SILENCE', 'WORKED.']} x={60} y={430} size={128} at={r('The silence')} color="#ffffff" />
      <BigType lines={['AND IT COST', 'SIX LIVES.']} x={60} y={760} size={128} at={r('And it cost')} color={CREAM} />
    </AbsoluteFill>
  );
};

/** "The whole story is on the channel." The full video, as a card. */
const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{opacity: o}}>
        <Note text="the whole story:" x={80} y={250} size={70} rot={-3} at={0} color={TEAL} />
        <div style={{position: 'absolute', left: 70, top: 390, width: 900, height: 506, transform: 'rotate(-2deg)', border: `6px solid ${TEAL}`, borderRadius: 10, overflow: 'hidden',
          boxShadow: '0 24px 40px rgba(0,0,0,0.7)'}}>
          <Img src={staticFile('img/brand/bw_full_video_thumb.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
        </div>
        <BigType lines={['JAPAN BOMBED', 'AMERICA WITH PAPER']} x={60} y={950} size={74} at={4} color={CREAM} />
        <Note text="on the channel" x={90} y={1140} size={62} rot={-3} at={10} color={ORANGE} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Scenes: React.FC = () => (
  <>
    <Cut from={0} to={C.bombs}><Cover b={C.bombs} /></Cut>
    <Cut from={C.bombs} to={C.riding}><Giant b={C.riding - C.bombs} /></Cut>
    <Cut from={C.riding} to={C.hundreds}><Winds /></Cut>
    <Cut from={C.hundreds} to={C.so}><Landing /></Cut>
    <Cut from={C.so} to={C.dont}><Presses b={C.dont - C.so} /></Cut>
    <Cut from={C.dont} to={C.ifj}><Code /></Cut>
    <Cut from={C.ifj} to={C.but}><Launches /></Cut>
    <Cut from={C.but} to={C.may}><Town b={C.may - C.but} /></Cut>
    <Cut from={C.may} to={C.pastor}><Pines b={C.pastor - C.may} /></Cut>
    <Cut from={C.pastor} to={C.found}><Road b={C.found - C.pastor} /></Cut>
    <Cut from={C.found} to={C.all}><Woods b={C.all - C.found} /></Cut>
    <Cut from={C.all} to={C.silence}><Monument b={C.silence - C.all} /></Cut>
    <Cut from={C.silence} to={C.whole}><Payoff /></Cut>
    <Cut from={C.whole} to={LOOP_AT}><EndCard /></Cut>
    {/* the loop: the cover exactly as on frame 0 */}
    <Cut from={LOOP_AT} to={VSHORT1_FRAMES}><Freeze frame={0}><Cover b={C.bombs} /></Freeze></Cut>
  </>
);

export const VShort1: React.FC = () => {
  const v = bed('bw_the_newspaperman');
  const lo = v * 0.12;
  const music = (f: number) => interpolate(f, [0, 3, C.may - 12, C.may + 20, C.whole - 30, C.whole, VSHORT1_FRAMES - 14, VSHORT1_FRAMES], [0, v, v, lo, lo, v, v, 0], clamp);
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <StepCtx.Provider value={2.5}>
        <AbsoluteFill style={{background: INKBG, overflow: 'hidden'}}>
          <Scenes />
          <Counters />
          <Captions words={N.words} fps={FPS} hide={[[0, C.bombs], [C.silence, VSHORT1_FRAMES]]} quiet={[[C.may, C.silence]]} />
          <Mark />
          <Finish vignette={0.3} />
          <Audio src={staticFile('audio/vshort1_kept_secret.wav')} />
          <Audio src={staticFile('music/bw_the_newspaperman.mp3')} startFrom={105} volume={music} />
          {/* the stamp on tape, only before the Bly beat */}
          {[at('secret'), at('five thousand'), at('Not one'), at('did')].map((s) => <Sfx key={s} at={s} src="sfx/stamp.wav" volume={0.25} />)}
        </AbsoluteFill>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};
