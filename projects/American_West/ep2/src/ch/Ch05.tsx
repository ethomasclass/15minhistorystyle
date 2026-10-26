// Chapter 5 · Who the Cowboys Were. The myth beat (a dime novel and the Wild West show slapped down; tall, white, older, doing well,
// ticked, then struck through on "none of those", where aw_legend_sours turns); teenagers at about a dollar a day; about one in four
// Black; Bose Ikard (coral) and Goodnight's words; trail vs. town ("Both things were true."); the escape south across the Rio Grande;
// Bass Reeves (coral) north into Indian Territory, deputy U.S. marshal in 1875; the vaqueros and the words they gave English (each
// English word on orange tape, its Spanish source on a dark torn tag, a prop on the desk); the 1874 tease.
// Sources: Beadle's Half Dime Library cover and the Buffalo Bill's Wild West posters (LOC / Commons), Bose Ikard (c. 1920, Commons,
// a small scan, enlarged), Bass Reeves (c. 1907, Commons), Remington's A Mexican Vaquero (Art Institute of Chicago), Vaqueros (1877,
// Commons); AI lithograph props (no tags).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch05_who_the_cowboys_were.words.json';
import {clamp} from '../lib/anim';
import {JF, Note, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration} from '../kit/shell';
import {bed} from '../kit/levels';
import {HingeYear} from '../samples/kit';
import {Lift, ScrimTag, shake, SlapTitle} from '../previews/fx';
import {Big, Counter, DeskCam, Float, Label, Lines, Print, Prop, Sounds, type SfxRow} from '../kit/ch04_extra';
import {Hand, MPin, MRoute, WestMap} from '../kit/ch01_extra';
import {MTrail, TLINES, TPL} from '../kit/trails';
import {WShots} from '../kit/ch07_extra';
import {CheckList, Four, MRiver, MStandLabel, MState, TornTag} from '../kit/ch456_extra';
import {M5} from '../masks_ch05';

const N = words as Narration;
export const CH05_FRAMES = chapterFrames(N, LEAD);
const T = makeTimeline(N, 30);
const at = T.at;
const END = Math.ceil(N.duration * 30) + 60;
const CORAL = '#FF6F61';
const WHITE = '#ffffff';

const I = {
  beadle: 'img/ch05/beadles_half_dime_library_western_cover_1880s.jpg',
  cody: 'img/ch05/b_cody_poster_top.jpg',
  goodnight: 'img/ch04/b_goodnight_1905.jpg',
  ikard: 'img/ch05/b_ikard_up.jpg',
  reeves: 'img/ch05/bass_reeves_c1907.jpg',
  remington: 'img/ch05/remington_mexican_vaquero_1890.jpg',
  vaqueros: 'img/ch05/vaqueros_1877.jpg',
  bbPoster: 'img/ch05/buffalo_bill_wild_west_vaqueros_poster_1899.jpg',
  coin: 'img/props/p2_coin_one.jpg',
  iron: 'img/props/p3_branding_iron.jpg',
  lariat: 'img/props/p3_lariat.jpg',
  chaps: 'img/props/p5_chaps.jpg',
  sombrero: 'img/props/p5_sombrero.jpg',
  corral: 'img/props/p5_corral.jpg',
  bronco: 'img/props/p5_bronco.jpg',
  spurs: 'img/props/p5_spurs.jpg',
};
const Z = {
  beadle: [2000, 2782] as [number, number],
  cody: [880, 720] as [number, number],
  goodnight: [820, 800] as [number, number],
  ikard: [800, 976] as [number, number],
  reeves: [1920, 2866] as [number, number],
  remington: [1520, 2250] as [number, number],
  vaqueros: [1334, 976] as [number, number],
  bbPoster: [2042, 3000] as [number, number],
};
const TAG = {
  myth: "Beadle's Half Dime Library, 1879 · Buffalo Bill's Wild West poster, 1890s · Library of Congress",
  ikard: 'Bose Ikard, c. 1920 · Wikimedia Commons',
  ikardPair: 'Bose Ikard, c. 1920 · Charles Goodnight, 1905 · Wikimedia Commons, Internet Archive',
  reeves: 'Bass Reeves, c. 1907 · Wikimedia Commons',
  remington: 'Frederic Remington, A Mexican Vaquero, 1890 · Art Institute of Chicago',
  vaqueros: 'Vaqueros (lassoing), 1877 · Wikimedia Commons',
  bbPoster: "Buffalo Bill's Wild West: Mexican vaqueros and lariat experts, 1899 · Library of Congress",
  map: "Map: Natural Earth outlines (today's state lines for reference); routes approx.",
};
const PROP_F = 'saturate(0.5) contrast(1.08)';

// ───────────────────────── the myth ─────────────────────────

/** 1 · the cowboy from the movies: a dime novel and the Wild West show slap onto the desk. */
const Movies: React.FC = () => {
  const a = 0;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 22, 0.94, 0, 0, -2], [at('Tall'), 16, 1.02, 0, 10, 0]]}>
        <Lift x={260} y={120} w={620} hgt={862} h={10} at={at('cowboy') - 2} rot={-5} seed={51}>
          <Print src={I.beadle} size={Z.beadle} x={0} y={0} w={620} at={-99} seed={51} filter="grayscale(1) contrast(1.15)" />
        </Lift>
        <Lift x={980} y={180} w={860} hgt={704} h={16} at={at('movies') - 2} rot={4} seed={52}>
          <Print src={I.cody} size={Z.cody} x={0} y={0} w={860} at={-99} seed={52} filter="grayscale(1) contrast(1.15) brightness(1.02)" />
        </Lift>
      </DeskCam>
      <Hand parts={[['the cowboy from the movies', WHITE]]} x={560} y={930} size={70} at={at('picture') - 2} />
      <ScrimTag text={TAG.myth} x={34} y={24} />
    </AbsoluteFill>
  );
};

/** 2–3 · tall, white, older, doing well: four quick ticks beside the Wild West hero; struck through on "none of those". */
const Myth: React.FC<{sour: boolean}> = ({sour}) => {
  const a = sour ? at('The real') - 1 : at('Tall') - 1;
  const b = sour ? at('Most') : at('The real');
  const cam: [number, number, number, number, number, number][] = sour ? [[a, 10, 1.0, 120, 0, 0], [b, 14, 0.94, 100, 0, -1]] : [[a, 8, 1.2, 320, 60, 0], [b, 8, 1.28, 360, 70, 0]];
  const rows = [{text: 'tall', at: sour ? -99 : at('Tall') - 1}, {text: 'white', at: sour ? -99 : at('white') - 1},
    {text: 'older', at: sour ? -99 : at('older') - 1}, {text: 'doing well', at: sour ? -99 : at('doing') - 1}];
  return (
    <AbsoluteFill>
      <DeskCam k={cam}>
        <Lift x={980} y={180} w={860} hgt={704} h={16} at={-99} rot={4} seed={52}>
          <Print src={I.cody} size={Z.cody} x={0} y={0} w={860} at={-99} seed={52} filter="grayscale(1) contrast(1.15) brightness(1.02)" />
        </Lift>
      </DeskCam>
      <AbsoluteFill style={{background: 'linear-gradient(to right, rgba(8,7,5,0.85) 0%, rgba(8,7,5,0.6) 34%, rgba(8,7,5,0) 52%)'}} />
      <Label text="the movie cowboy" x={130} y={200} size={28} color={WHITE} />
      <CheckList x={140} y={270} rows={rows} strikeAt={sour ? at('none') - 2 : 1e7} size={72} gap={110} />
      {sour && <Hand parts={[['usually none of those.', WHITE]]} x={130} y={760} size={78} at={at('none') - 2} />}
      <ScrimTag text={TAG.myth} x={34} y={24} />
    </AbsoluteFill>
  );
};

// ───────────────────────── the real thing ─────────────────────────

/** 4 · teenagers and young men, about $25–40 a month: about a dollar a day (a coin slaps down). */
const Pay: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Most') - 1;
  const sh = shake(f, [at('About a dollar') + 6], 6);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <DeskCam k={[[a, 24, 1.0, 0, 0, 2], [at('And a lot'), 18, 1.08, -20, 10, 0]]}>
        <Float x={1250} y={330} w={460} hgt={460} h={14} at={at('About a dollar') + 2} rot={-6} seed={9}>
          <Prop src={I.coin} m={M5.coin} x={0} y={0} w={420} at={-99} />
        </Float>
      </DeskCam>
      <Lines x={120} y={110} size={64} gap={96} rows={[{text: 'teenagers', at: at('teenagers') - 2}, {text: 'or young men', at: at('young') - 2}]} />
      <Label text="pay, per month" x={130} y={370} size={28} at={at('paid') - 2} color={WHITE} />
      <Big text="$25–40" x={120} y={420} size={150} at={at('twenty-five')} color={WHITE} />
      <Big text="≈ $1 a day" x={130} y={650} size={130} at={at('About a dollar') + 2} />
    </AbsoluteFill>
  );
};

/** 5 · "a lot of them weren't white": the handwriting, the myth prints pushed aside and out of focus. */
const NotWhite: React.FC = () => {
  const a = at('And a lot') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 26, 1.1, 300, 0, -3], [at('Historians'), 22, 1.18, 340, 0, -4]]}>
        <Lift x={1240} y={160} w={860} hgt={704} h={4} at={-99} rot={6} blur={4} seed={52}>
          <Print src={I.cody} size={Z.cody} x={0} y={0} w={860} at={-99} seed={52} filter="grayscale(1) contrast(1.1) brightness(0.7)" />
        </Lift>
      </DeskCam>
      <Hand parts={[['and a lot of them', WHITE]]} x={130} y={330} size={84} at={at('And a lot') - 2} />
      <Hand parts={[["weren't white."]]} x={170} y={470} size={96} at={at("weren't") - 2} />
    </AbsoluteFill>
  );
};

/** 6 · about one in four on the Texas trails was Black: four drawn riders, one coral. */
const OneInFour: React.FC = () => {
  const a = at('Historians') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 12, 1.0, 0, 0, 0], [at('Many'), 12, 1.05, 0, 10, 0]]}><></></DeskCam>
      <Label text="historians' estimate · cowboys on the Texas trails" x={130} y={110} size={26} at={at('estimate') - 2} color={WHITE} />
      <Four x={420} y={720} h={330} at={at('one in four') - 4} hotAt={at('Black') - 1} gap={330} />
      <Big text="≈ 1 in 4" x={1460} y={330} size={130} at={at('four') - 1} color={WHITE} />
      <Hand parts={[['was Black', CORAL]]} x={1480} y={500} size={84} at={at('Black') - 2} />
    </AbsoluteFill>
  );
};

/** 7 · enslaved on Texas ranches before the war; now the same work, for wages. */
const Wages: React.FC = () => {
  const a = at('Many') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 20, 1.04, 0, 0, -2], [at('Remember'), 24, 0.98, 0, 0, 1]]}>
        <Float x={1180} y={200} w={600} hgt={600} h={10} at={at('ranches') - 2} rot={-28} seed={10}>
          <Prop src={I.iron} m={M5.iron} x={0} y={0} w={420} at={-99} filter={PROP_F} />
        </Float>
        <Float x={1300} y={560} w={520} hgt={520} h={16} at={at('wages') - 4} rot={5} seed={11}>
          <Prop src={I.lariat} m={M5.lariat} x={0} y={0} w={460} at={-99} filter={PROP_F} />
        </Float>
      </DeskCam>
      <Label text="before the war" x={130} y={180} size={28} at={at('before') - 2} color={WHITE} />
      <Lines x={130} y={240} size={62} rows={[{text: 'enslaved on Texas ranches', at: at('enslaved') - 2, color: WHITE}]} />
      <Label text="after" x={130} y={520} size={28} at={at('Now') - 2} color={WHITE} />
      <Lines x={130} y={580} size={62} gap={96} rows={[{text: 'the same work,', at: at('same work') - 2}, {text: 'for wages', at: at('wages') - 2}]} />
    </AbsoluteFill>
  );
};

// ───────────────────────── Bose Ikard ─────────────────────────

/** 8 · Remember Goodnight and Loving? One of their riders: Bose Ikard (coral) lands beside Goodnight's portrait. */
const Ikard: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Remember') - 1;
  const b = at('On the trail') - 1;
  const lands = at('Bose') - 3;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 18, 1.12, -380, 20, -2], [lands, 18, 1.0, -60, 10, 0], [b, 16, 1.06, 40, 0, 0]]}>
        <Lift x={150} y={330} w={420} hgt={410} h={4} at={-99} rot={-4} blur={interpolate(f, [lands - 6, lands + 6], [0, 2.2], clamp)} seed={53}>
          <Print src={I.goodnight} size={Z.goodnight} x={0} y={0} w={420} at={-99} seed={53} />
        </Lift>
        <Lift x={760} y={110} w={600} hgt={732} h={14} at={lands} rot={2} seed={54}>
          <Print src={I.ikard} size={Z.ikard} x={0} y={0} w={600} at={-99} seed={54} mask={M5.ikard} tint={0.5} traceAt={at('Ikard') + 2} filter="grayscale(1) contrast(1.15)" />
        </Lift>
      </DeskCam>
      <Hand parts={[['remember Goodnight & Loving?', WHITE]]} x={120} y={90} size={64} at={at('Remember') - 2} out={lands} />
      <SlapTitle text="BOSE IKARD" x={1240} y={150} size={96} at={at('Bose')} seed={81} />
      <Label text="one of their riders" x={1250} y={300} size={26} at={at('riders') - 2} color={WHITE} />
      <Lines x={1250} y={380} size={60} rows={[{text: 'born enslaved', at: at('born') - 2}]} />
      <ScrimTag text={TAG.ikardPair} />
    </AbsoluteFill>
  );
};

/** 9 · on the trail: Comanche raids, stampedes. A cut-in on Ikard. */
const Trail: React.FC = () => {
  const a = at('On the trail') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 10, 1.36, -340, -40, 0], [at('Goodnight said'), 10, 1.44, -380, -60, 0]]}>
        <Lift x={760} y={110} w={600} hgt={732} h={14} at={-99} rot={2} seed={54}>
          <Print src={I.ikard} size={Z.ikard} x={0} y={0} w={600} at={-99} seed={54} mask={M5.ikard} tint={0.5} filter="grayscale(1) contrast(1.15)" />
        </Lift>
      </DeskCam>
      <Label text="on the trail" x={1250} y={250} size={28} at={a + 2} color={WHITE} />
      <Lines x={1250} y={320} size={60} gap={96} rows={[{text: 'fought off Comanche raids', at: at('fought') - 2}, {text: 'rode out stampedes', at: at('rode') - 2}]} />
      <ScrimTag text={TAG.ikard} />
    </AbsoluteFill>
  );
};

/** A quote set large on the dark desk (Playfair-like display), revealed whole; who below. */
const QuoteLine: React.FC<{text: string; x: number; y: number; at: number; size?: number; color?: string}> = ({text, x, y, at: a, size = 84, color}) => {
  const g = useGFrame();
  if (g < a) return null;
  const p = interpolate(g, [a, a + 8], [0, 1], clamp);
  return <div style={{position: 'absolute', left: x, top: y, fontFamily: JF.heavy, fontWeight: 900, fontSize: size, lineHeight: 1.2, color: color ?? '#f4efe6', whiteSpace: 'nowrap',
    opacity: p, transform: `translateY(${(1 - p) * 10}px)`, textShadow: '0 3px 14px #000, 4px 5px 0 #050403'}}>{text}</div>;
};

/** 10–11 · Goodnight's words about Ikard, as quote lines; Ikard small beside them. */
const Words: React.FC<{second: boolean}> = ({second}) => {
  const a = second ? at('He was') - 1 : at('Goodnight said') - 1;
  const b = second ? at('On the trail', 2) : at('He was');
  return (
    <AbsoluteFill>
      <DeskCam k={second ? [[a, 14, 1.06, 30, 0, 1], [b, 14, 1.0, 0, 0, 0]] : [[a, 12, 0.98, 0, 0, -1], [b, 12, 1.04, 0, 0, 0]]}>
        <Lift x={1420} y={300} w={380} hgt={464} h={6} at={-99} rot={3} seed={55}>
          <Print src={I.ikard} size={Z.ikard} x={0} y={0} w={380} at={-99} seed={55} mask={M5.ikard} tint={0.45} filter="grayscale(1) contrast(1.15)" />
        </Lift>
      </DeskCam>
      <Label text="Charles Goodnight, on Bose Ikard" x={130} y={150} size={28} at={a + 2} color={WHITE} />
      {!second && <>
        <Lines x={130} y={240} size={56} rows={[{text: 'he trusted him', at: at('trusted') - 2}]} />
        <QuoteLine text="“farther than any" x={130} y={360} at={at('farther') - 2} />
        <QuoteLine text="living man.”" x={130} y={470} at={at('living') - 2} />
      </>}
      {second && <>
        <QuoteLine text="“my detective," x={130} y={260} at={-99} size={88} />
        <QuoteLine text="banker," x={130} y={380} at={at('banker') - 2} size={88} />
        <QuoteLine text="and everything else.”" x={130} y={500} at={at('everything') - 2} size={88} color={CORAL} />
      </>}
      <ScrimTag text={TAG.ikard} />
    </AbsoluteFill>
  );
};

// ───────────────────────── trail and town ─────────────────────────

/** 12–14 · two views: on the trail (same food, same ground) | in town (the color line); then "Both things were true." */
const TwoViews: React.FC<{stage: 0 | 1 | 2}> = ({stage}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = [at('On the trail', 2), at('In town'), at('Both')][stage] - 1;
  const b = [at('In town'), at('Both'), at("And here's")][stage];
  const cams: [number, number, number, number, number, number][][] = [
    [[a, 14, 1.12, 260, 0, 0], [b, 14, 1.16, 280, 0, 0]],
    [[a, 14, 1.12, -260, 0, 0], [b, 14, 1.16, -280, 0, 0]],
    [[a, 18, 0.98, 0, 0, 0], [b, 20, 0.94, 0, 0, -1]],
  ];
  const cam = cams[stage];
  const dim = (on: boolean) => ({opacity: on ? 1 : 0.35});
  const leftOn = stage !== 1;
  const rightOn = stage !== 0;
  return (
    <AbsoluteFill>
      <DeskCam k={cam}>
        <div style={{position: 'absolute', left: 400 + 160, top: 300 + 140, width: 1600, height: 700, background: 'radial-gradient(ellipse at 40% 30%, #36312a 0%, #26231d 75%, #1d1a15 100%)',
          boxShadow: '16px 20px 0 #050403'}}>
          <div style={{position: 'absolute', left: 798, top: 40, bottom: 40, width: 4, background: pal.mark, opacity: 0.8}} />
          <div style={{position: 'absolute', left: 60, top: 50, fontFamily: JF.mono, fontSize: 34, letterSpacing: 5, color: pal.mark, ...dim(leftOn)}}>ON THE TRAIL</div>
          <div style={{position: 'absolute', left: 860, top: 50, fontFamily: JF.mono, fontSize: 34, letterSpacing: 5, color: pal.subject, ...dim(rightOn)}}>IN TOWN</div>
          <div style={{...dim(leftOn)}}>
            <Lines x={60} y={170} size={58} gap={110} rows={[
              {text: 'ate the same', at: stage === 0 ? at('ate') - 2 : -99},
              {text: 'slept the same', at: stage === 0 ? at('slept') - 2 : -99},
              {text: 'worked the same', at: stage === 0 ? at('worked') - 2 : -99},
            ]} />
          </div>
          <div style={{...dim(rightOn)}}>
            <Lines x={860} y={170} size={58} gap={110} rows={[
              {text: 'the same color line', at: stage === 1 ? at('color line') - 4 : stage === 2 ? -99 : 1e7, color: CORAL},
              {text: 'he had left', at: stage === 1 ? at('left') - 2 : stage === 2 ? -99 : 1e7},
            ]} />
          </div>
        </div>
      </DeskCam>
      {stage === 2 && g >= at('Both') - 2 && <Hand parts={[['Both things were true.', WHITE]]} x={560} y={900} size={84} at={at('Both') - 2} />}
    </AbsoluteFill>
  );
};

// ───────────────────────── the escape south ─────────────────────────

/** 15–17 · Texas before the war; not north, south: across the Rio Grande to Mexico; 3,000–10,000 made it. */
const South: React.FC<{stage: 0 | 1 | 2}> = ({stage}) => {
  const a = [at("And here's"), at('Not north'), at('Somewhere')][stage] - 1;
  const b = [at('Not north'), at('Somewhere'), at('One man')][stage];
  const ks = [
    [{f: a, x: 2620, y: 1900, z: 0.78, tilt: 44, rot: -2}, {f: b, x: 2640, y: 2050, z: 0.92, tilt: 46, rot: 0}],
    [{f: a, x: 2620, y: 2150, z: 1.05, tilt: 46, rot: 2}, {f: b, x: 2600, y: 2330, z: 1.35, tilt: 50, rot: 4}],
    [{f: a, x: 2560, y: 2420, z: 1.7, tilt: 52, rot: 6}, {f: b, x: 2540, y: 2430, z: 1.85, tilt: 54, rot: 8}],
  ][stage];
  const north: number[][] = [[2740, 2200], [2760, 1950]];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MState api={api} name="Texas" at={stage === 0 ? a + 4 : -99} k={stage === 0 ? 1 : 0.5} />
          <MStandLabel api={api} at={[2560, 2180]} show={stage === 0 ? a + 8 : -99} text="Texas" color="#bfe3ea" size={30} />
          {stage >= 1 && <MRoute api={api} pts={north} at={at('Not north') - 4} dur={8} color="rgba(244,239,230,0.55)" width={6} dashed />}
          {stage >= 1 && <MTrail api={api} pts={TLINES.southToMexico} at={stage === 1 ? at('South') - 2 : -99} dur={at('Rio') - at('South') + 8} color={CORAL} width={11} />}
          {stage >= 1 && <MStandLabel api={api} at={[2470, 2400]} show={stage === 1 ? at('Rio') - 2 : -99} text="Rio Grande" />}
          {stage >= 1 && <MStandLabel api={api} at={[2360, 2560]} show={stage === 1 ? at('Mexico') - 2 : -99} text="Mexico" color={WHITE} size={34} />}
          {stage >= 1 && <MPin api={api} at={TPL.piedrasNegras} show={stage === 1 ? at('Mexico') : -99} label="" color={CORAL} />}
        </>}
      </WestMap>
      {stage === 0 && <>
        <Note text="a strange turn" x={130} y={110} size={60} rot={-3} at={at('strange') - 2} color={WHITE} />
        <Lines x={130} y={230} size={58} gap={88} rows={[{text: 'before the war:', at: at('Before the war') - 2}, {text: 'a place enslaved people ran from', at: at('ran from') - 6}]} />
      </>}
      {stage === 1 && <>
        <Hand parts={[['Not north. ', 'rgba(244,239,230,0.7)'], ['South.', CORAL]]} x={130} y={100} size={96} at={at('Not north') - 2} dur={at('South') - at('Not north') + 6} />
        <Lines x={130} y={260} size={56} rows={[{text: 'slavery was illegal in Mexico', at: at('illegal') - 6}]} />
      </>}
      {stage === 2 && <>
        <Counter from={0} to={3000} at={at('three') - 2} dur={10} x={120} y={110} size={120} color={WHITE} suffix="" prefix="" />
        <Big text="– 10,000" x={480} y={120} size={110} at={at('ten') - 1} color={WHITE} />
        <Lines x={130} y={290} size={60} rows={[{text: 'made it', at: at('made it') - 2}]} />
      </>}
      <ScrimTag text={TAG.map} />
    </AbsoluteFill>
  );
};

// ───────────────────────── Bass Reeves ─────────────────────────

/** 18 · one man ran north instead, into Indian Territory (today's Oklahoma, hatched). */
const North: React.FC = () => {
  const a = at('One man') - 1;
  const b = at('His name') - 1;
  const ks = [{f: a, x: 2760, y: 1900, z: 0.9, tilt: 46, rot: -3}, {f: b, x: 2800, y: 1760, z: 1.05, tilt: 50, rot: -6}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MState api={api} name="Texas" at={-99} k={0.35} />
          <MState api={api} name="Oklahoma" at={at('Indian') - 4} />
          <MStandLabel api={api} at={[2620, 1700]} show={at('Indian') - 2} text="Indian Territory" color={WHITE} size={28} />
          <MTrail api={api} pts={[[2752.8, 2272.9], [2800, 2050], [2880, 1820], [2930, 1720]]} at={at('ran north') - 2} dur={at('Indian') - at('ran north') + 10} color={CORAL} width={10} />
          <MPin api={api} at={TPL.fortSmith} show={at('learned') - 2} label="Fort Smith" side="r" size={44} color={WHITE} />
        </>}
      </WestMap>
      <Lines x={130} y={100} size={60} gap={90} rows={[{text: 'one man ran north instead', at: at('ran north') - 2}, {text: 'learned the land + its languages', at: at('learned') - 2, color: WHITE}]} />
      <Label text="(today's Oklahoma, roughly)" x={140} y={300} size={24} at={at('Indian') + 4} color={WHITE} />
      <ScrimTag text={TAG.map} />
    </AbsoluteFill>
  );
};

/** 19–20 · Bass Reeves (coral); 1875, one of the first Black deputy U.S. marshals in the West. */
const Reeves: React.FC<{detail: boolean}> = ({detail}) => {
  const a = detail ? at('In 1875') - 1 : at('His name') - 1;
  const b = detail ? at('riding') : at('In 1875');
  return (
    <AbsoluteFill>
      <DeskCam k={detail ? [[a, 10, 1.0, 0, 0, 0], [b, 10, 1.06, -20, 10, 0]] : [[a, 18, 0.94, 0, 0, -2], [b, 16, 1.0, 0, 0, 0]]}>
        <Lift x={1140} y={60} w={640} hgt={955} h={10} at={detail ? -99 : a + 2} rot={2} seed={56}>
          <Print src={I.reeves} size={Z.reeves} x={0} y={0} w={640} at={-99} seed={56} mask={M5.reeves} tint={0.45} traceAt={detail ? undefined : at('Reeves') + 2} />
        </Lift>
      </DeskCam>
      {!detail && <SlapTitle text="BASS REEVES" x={110} y={360} size={110} at={at('Bass')} seed={83} />}
      {detail && <>
        <SlapTitle text="1875" x={110} y={110} size={120} at={at('1875')} seed={85} />
        <Lines x={130} y={330} size={62} gap={96} rows={[
          {text: 'one of the first Black', at: at('first') - 2},
          {text: 'deputy U.S. marshals', at: at('deputy') - 2, color: CORAL},
          {text: 'in the West', at: at('West') - 2},
        ]} />
      </>}
      <ScrimTag text={TAG.reeves} />
    </AbsoluteFill>
  );
};

/** 21 · riding the same country the cattle trails crossed: Indian Territory with the Chisholm and Western trails over it. */
const SameCountry: React.FC = () => {
  const a = at('riding') - 1;
  const b = at('And then') - 1;
  const ks = [{f: a, x: 2700, y: 1720, z: 1.0, tilt: 50, rot: 6}, {f: b, x: 2700, y: 1700, z: 0.9, tilt: 46, rot: 2}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MState api={api} name="Oklahoma" at={-99} />
          <MTrail api={api} pts={TLINES.chisholm} at={at('cattle trails') - 8} dur={18} width={8} />
          <MTrail api={api} pts={TLINES.western} at={at('cattle trails') - 4} dur={18} width={8} />
          <MTrail api={api} pts={TLINES.shawnee} at={at('cattle trails')} dur={18} width={7} opacity={0.6} />
          <MPin api={api} at={TPL.fortSmith} show={-99} label="Fort Smith" side="r" size={40} color={WHITE} />
          <MStandLabel api={api} at={[2560, 1700]} show={-99} text="Indian Territory" color={WHITE} size={26} />
        </>}
      </WestMap>
      <Hand parts={[['the same country the ', WHITE], ['cattle trails', '#2FE0C4'], [' crossed', WHITE]]} x={120} y={100} size={64} at={at('riding') - 2} dur={30} />
      <ScrimTag text={TAG.map} />
    </AbsoluteFill>
  );
};

// ───────────────────────── the vaqueros ─────────────────────────

/** 22 · the vaqueros: Remington's Mexican vaquero (coral) as a print; the title. */
const Vaquero: React.FC = () => {
  const a = at('And then') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 16, 1.0, 0, 0, 2], [at('working cattle'), 12, 1.1, -40, 20, 0]]}>
        <Lift x={1080} y={40} w={680} hgt={1006} h={10} at={a + 2} rot={2} seed={57}>
          <Print src={I.remington} size={Z.remington} x={0} y={0} w={680} at={-99} seed={57} mask={M5.vaquero} tint={0.4} traceAt={at('vaqueros') + 4} filter="grayscale(1) contrast(1.1)" />
        </Lift>
      </DeskCam>
      <SlapTitle text="VAQUEROS" x={110} y={300} size={120} at={at('vaqueros')} seed={87} />
      <Lines x={130} y={480} size={62} rows={[{text: 'Mexican cowboys', at: at('Mexican cowboys') - 2}]} />
      <ScrimTag text={TAG.remington} />
    </AbsoluteFill>
  );
};

/** 23 · working cattle in Texas long before it was part of the United States (the 1877 Vaqueros painting, wide). */
const LongBefore: React.FC = () => {
  const a = at('working cattle') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 8, 1.24, 160, 40, 0], [at('They taught'), 8, 1.12, 60, 20, 0]]}>
        <Lift x={80} y={90} w={1300} hgt={951} h={8} at={-99} rot={-1} seed={58}>
          <Print src={I.vaqueros} size={Z.vaqueros} x={0} y={0} w={1300} at={-99} seed={58} filter="grayscale(1) contrast(1.15) brightness(0.98)" />
        </Lift>
      </DeskCam>
      <Lines x={1180} y={120} size={56} gap={86} rows={[{text: 'working cattle in Texas', at: at('working cattle') - 2}, {text: 'long before it was', at: at('long before') - 2}, {text: 'part of the U.S.', at: at('United') - 2}]} />
      <ScrimTag text={TAG.vaqueros} />
    </AbsoluteFill>
  );
};

/** 24 · they taught the trade; you can still hear it in the words (the 1899 Wild West poster of vaqueros, in grey). */
const Taught: React.FC = () => {
  const a = at('They taught') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 18, 0.98, 0, 0, -1], [at('Lariat'), 14, 1.04, 0, 10, 0]]}>
        <Lift x={1120} y={20} w={700} hgt={1028} h={8} at={-99} rot={3} seed={59}>
          <Print src={I.bbPoster} size={Z.bbPoster} x={0} y={0} w={700} at={-99} seed={59} filter="grayscale(1) contrast(1.1)" />
        </Lift>
      </DeskCam>
      <Lines x={130} y={260} size={66} gap={110} rows={[{text: 'they taught the trade', at: at('taught') - 2}, {text: 'you can still hear it', at: at('hear') - 4, color: WHITE}, {text: 'in the words', at: at('words') - 2}]} />
      <ScrimTag text={TAG.bbPoster} />
    </AbsoluteFill>
  );
};

/** 25–29 · one English word on orange tape, its Spanish source on a dark torn tag, the prop on the desk. */
const Word: React.FC<{i: number}> = ({i}) => {
  const f = useCurrentFrame();
  const W = WORDS[i];
  const a = at(W.en) - 1;
  const b = i < WORDS.length - 1 ? at(WORDS[i + 1].en, WORDS[i + 1].n ?? 1) : at('In 1874');
  const sh = shake(f, [at(W.es, W.esN ?? 1) + 2], 5);
  const moves: [number, number, number, number, number][] = [[22, 1.0, 0, 0, -2], [16, 1.08, -30, 10, 1], [24, 1.04, 20, -10, 2], [14, 0.98, 0, 20, -1], [20, 1.06, -20, 0, 0]];
  const [t0, z0, x0, y0, r0] = moves[i];
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <DeskCam k={[[a, t0, z0, x0, y0, r0], [b, t0 - 4, z0 + 0.06, x0 + 20, y0 + 10, r0 / 2]]}>
        <Float x={W.px} y={W.py} w={W.pw + 60} hgt={W.ph} h={14} at={a + 2} rot={W.rot} seed={20 + i}>
          <Prop src={W.src} m={W.m()} x={0} y={0} w={W.pw} at={-99} filter={PROP_F} />
        </Float>
      </DeskCam>
      <SlapTitle text={W.en.toUpperCase()} x={120} y={230} size={130} at={at(W.en, W.n ?? 1)} seed={90 + i} />
      <Label text="from the Spanish" x={150} y={430} size={26} at={at(W.es, W.esN ?? 1) - 6} color={WHITE} />
      <TornTag text={W.spanish} x={140} y={480} at={at(W.es, W.esN ?? 1) - 2} size={92} color="#2FE0C4" seed={30 + i} rot={-2} />
      {W.note && <Hand parts={[[W.note, WHITE]]} x={160} y={720} size={80} at={at('rough') - 4} />}
    </AbsoluteFill>
  );
};
type WordRow = {en: string; n?: number; es: string; esN?: number; spanish: string; src: string; m: () => typeof M5.lariat; px: number; py: number; pw: number; ph: number; rot: number; note?: string};
const WORDS: WordRow[] = [
  {en: 'Lariat', es: 'la reata', spanish: 'la reata', src: I.lariat, m: () => M5.lariat, px: 1080, py: 200, pw: 640, ph: 700, rot: -4},
  {en: 'Chaps', es: 'chaparreras', spanish: 'chaparreras', src: I.chaps, m: () => M5.chaps, px: 1240, py: 80, pw: 420, ph: 900, rot: 3},
  {en: 'Ranch', es: 'rancho', spanish: 'rancho', src: I.sombrero, m: () => M5.sombrero, px: 1000, py: 360, pw: 760, ph: 420, rot: -3},
  {en: 'Rodeo', es: 'rodeo', esN: 2, spanish: 'rodeo', src: I.corral, m: () => M5.corral, px: 980, py: 300, pw: 820, ph: 520, rot: 2},
  {en: 'bronco', n: 1, es: 'bronco', esN: 2, spanish: 'bronco', src: I.bronco, m: () => M5.bronco, px: 1000, py: 180, pw: 760, ph: 640, rot: -3, note: '= rough'},
];

/** 30 · 1874: two things that would help end all of this; the first in the Black Hills (hinge-year tease). */
const Tease: React.FC = () => {
  const a = at('In 1874') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 18, 1.0, 0, 0, 0], [END, 12, 1.1, 0, 20, 0]]}><></></DeskCam>
      <HingeYear year="1874" events={['the Black Hills', '…and one more']} x={160} y={260} size={210} at={at('1874')} />
      <Lines x={170} y={700} size={60} gap={92} rows={[{text: 'two things that would help end all of this', at: at('two things') - 2, color: WHITE}, {text: 'first: the Black Hills', at: at('Black Hills') - 4}]} />
    </AbsoluteFill>
  );
};

// ───────────────────────── assembly ─────────────────────────

const c = (w: string, n = 1) => at(w, n) - 1;
const SHOTS: [number, React.ReactNode, ('whip' | 'cut')?][] = [
  [0, <Movies />],
  [c('Tall'), <Myth sour={false} />, 'cut'],
  [c('The real'), <Myth sour />, 'cut'],
  [c('Most'), <Pay />, 'whip'],
  [c('And a lot'), <NotWhite />, 'cut'],
  [c('Historians'), <OneInFour />, 'cut'],
  [c('Many'), <Wages />, 'cut'],
  [c('Remember'), <Ikard />, 'whip'],
  [c('On the trail'), <Trail />, 'cut'],
  [c('Goodnight said'), <Words second={false} />, 'cut'],
  [c('He was'), <Words second />, 'cut'],
  [c('On the trail', 2), <TwoViews stage={0} />, 'whip'],
  [c('In town'), <TwoViews stage={1} />, 'cut'],
  [c('Both'), <TwoViews stage={2} />, 'cut'],
  [c("And here's"), <South stage={0} />, 'whip'],
  [c('Not north'), <South stage={1} />, 'cut'],
  [c('Somewhere'), <South stage={2} />, 'cut'],
  [c('One man'), <North />, 'cut'],
  [c('His name'), <Reeves detail={false} />, 'whip'],
  [c('In 1875'), <Reeves detail />, 'cut'],
  [c('riding'), <SameCountry />, 'cut'],
  [c('And then'), <Vaquero />, 'whip'],
  [c('working cattle'), <LongBefore />, 'cut'],
  [c('They taught'), <Taught />, 'cut'],
  ...WORDS.map((w, i): [number, React.ReactNode, 'cut'] => [c(w.en, w.n ?? 1), <Word i={i} />, 'cut']),
  [c('In 1874'), <Tease />, 'whip'],
];

const tick = (w: string, d = 2, n = 1): SfxRow => [at(w, n) - d, 'marker_tick', 0.2];
const SFX: SfxRow[] = [
  ...SHOTS.slice(1).map(([s, , k]): SfxRow => (k === 'whip' ? [s - 4, 'whip_soft', 0.25] : [s, 'whoosh', 0.2])),
  [at('cowboy') - 1, 'paper_slap_soft', 0.25], [at('movies') - 1, 'paper_slap_soft', 0.25], tick('picture'),
  tick('Tall', 1), tick('white', 1), tick('older', 1), tick('doing', 1), [at('none') - 2, 'marker_tick', 0.22], [at('none') + 4, 'marker_tick', 0.18],
  tick('teenagers'), tick('young'), [at('twenty-five'), 'stamp', 0.18], [at('About a dollar') + 3, 'paper_slap_soft', 0.22], [at('About a dollar') + 2, 'stamp', 0.16],
  tick('And a lot'), tick("weren't"),
  ...[0, 1, 2, 3].map((i): SfxRow => [at('one in four') - 4 + i * 3, 'block_tap_soft', 0.13]), [at('four') - 1, 'stamp', 0.18], tick('Black'),
  tick('enslaved'), [at('ranches') - 1, 'paper_slap_soft', 0.2], tick('same work'), [at('wages') - 3, 'paper_slap_soft', 0.2],
  tick('Remember'), [at('Bose') - 2, 'paper_slap_soft', 0.25], [at('Bose'), 'stamp', 0.22], tick('born'),
  tick('fought'), tick('rode'), tick('trusted'), [at('farther') - 2, 'page_turn', 0.3], [at('banker') - 2, 'tick_soft', 0.12], [at('everything') - 2, 'tick_soft', 0.12],
  [at('On the trail', 2), 'card_slide_soft', 0.2], tick('ate'), tick('slept'), tick('worked'), tick('color line', 4), tick('Both'),
  tick('strange'), tick('Before the war', 2, 2), tick('Not north'), [at('South') - 2, 'marker_tick', 0.2], tick('illegal', 6), [at('ten') - 1, 'stamp', 0.16], tick('made it'),
  tick('ran north'), [at('Indian') - 4, 'card_slide_soft', 0.15], tick('learned'),
  [at('His name') + 1, 'paper_slap_soft', 0.22], [at('Bass'), 'stamp', 0.22], [at('1875'), 'stamp', 0.22], tick('first'), tick('deputy'), tick('riding'),
  [at('And then') + 1, 'paper_slap_soft', 0.22], [at('vaqueros'), 'stamp', 0.22], tick('Mexican cowboys'), tick('working cattle'), tick('taught'), tick('hear', 4),
  ...WORDS.flatMap((w, i): SfxRow[] => [[at(w.en, w.n ?? 1) + 1, 'paper_slap_soft', 0.2], [at(w.en, w.n ?? 1), 'stamp', 0.2], [at(w.es, w.esN ?? 1) - 2, 'tape_press', 0.18]]),
  tick('rough', 4), [at('1874'), 'stamp', 0.22], tick('two things'), tick('Black Hills', 4),
];

const Body: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <WShots shots={SHOTS} />
    <Sounds list={SFX} />
  </AbsoluteFill>
);

/** Where aw_legend_sours turns (seconds into the cue, as in Ep 1 ch05); the cue starts so the turn lands on "none of those". */
const LEGEND_TURN = 25;
const LEGEND_START = Math.max(0, Math.round(LEGEND_TURN * 30 - at('none')));

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_who_the_cowboys_were.wav" lead={LEAD} music={[
    // the myth: aw_legend_sours, started so its turn lands on "none of those"; it runs out under the real cowboys
    {src: 'music/aw_legend_sours.mp3', volume: bed('aw_legend_sours'), startFrom: LEGEND_START, to: at('Remember') + 6, fadeOut: 30},
    // the riders, the escape south, Reeves and the vaqueros (SUNO: aw_long_drive replaces a_mexico)
    {src: 'music/a_mexico.mp3', volume: bed('a_mexico'), from: at('Remember') - 6, to: at('In 1874') + 6, fadeOut: 30},
    // the 1874 tease: ch06's opening cue comes in under it
    {src: 'music/j_intrigue.mp3', volume: bed('j_intrigue'), from: at('In 1874') - 6},
  ]}>
    <Body />
  </ChapterShell>
);
