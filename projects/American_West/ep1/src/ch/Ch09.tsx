// Chapter 9 · The Picture (after 1869 → the Exclusion Act → back to the question → the Promise Ledger → the closing line → end screen).
// Shot list (narration words → shot):
//  A "When the railroad was finished…moved on."     Hart, Tunnel No. 8: the worker (coral), pull out
//  B "To farms, mines, laundries, factories"        desk: Lawrence & Houseworth's Dupont Street print, the list written beside it
//  C "and the growing Chinatown in San Francisco."   detail pan along Dupont Street
//  D "Then the depression hit. Wages fell."          bare handwriting, wages arrow down
//  E "in California…blamed the Chinese…for less."    the 1877 custom-house engraving, dimmed, the blame as handwriting
//  F "In 1877…Denis Kearney…Workingmen's Party."    Kearney in a circle mount, 1877, the party's name
//  G "Its slogan was four words. 'The Chinese must go!'" the slogan set large, "must go" in coral
//  H "Newspapers and even some doctors…white health." 1876 California Senate report lands → detail of its title
//  I "Some of it was dressed up as science."          handwriting, “science” in quotes
//  J "In 1882, Congress passed the Chinese Exclusion Act." the enrolled Act on the desk, title
//  K "No Chinese workers…for ten years."             focus pull + swipe on "until the expiration of ten years / the coming of Chinese laborers / suspended"
//                                                     (line boxes from Gemini: review/ch09_exclusion_act_lines.json, _words.json)
//  L "Then it was renewed…permanent…1943."           three-step timeline, the coral bar 1882 → 1943
//  M "It was the first major law…nationality."       the sentence over the dimmed Act
//  N "So let's go back to the question…to anyone."   Russell's photo: torn print lands → parallax push
//  O "Who did it open it for?"                       the question in bare handwriting, "open" coral
//  P "It did tie…Months became a week…checkerboard…a country they could cross." quick callback cards
//  Q "But the companies…shut out by name."            callback cards: Ames, Grant, the troops leaving, the Hart worker + the Act
//  R "This is our first promise…ran through."         the Promise Ledger, row 1 writes in (wide → push → pan)
//  S "The railroad tied the country together…in the picture." Russell's print, the coral worker slaps into the torn gap
//  T "Meanwhile…Kansas…five million cows."           map card (Kansas) and a small longhorn cut-out drops in
//  U "Thanks for watching…" + 20 s music only        end screen with clean slots for YouTube's elements
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch09_the_picture.words.json';
import {clamp} from '../lib/anim';
import {boxOf, JF, Loop, Note, Tag, useGFrame, useHand, usePal} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, TAIL, FADE, type Narration} from '../kit/shell';
import {CircleMount, CutOut, DocFocus, keys, Lift, MapCard, Mono, PhotoCam, PlatGrid, ScrimTag, SHADOW, Shots, SlapTitle, Tape, tornPoly, TornPrint, useDrop, zkeys} from '../kit/west';
import {IMG, SM, SZ, WARREN} from '../samples/masks';
import {DeskShot, Hand, Print, Sounds, Strike, Wire} from '../kit/ch07_extra';
import {M7} from '../masks_ch07';
import {M9} from '../masks_ch09';

const N = words as Narration;
/** The music-only end screen after the narration (about 20 s), added to the chapter's length. */
const EXTRA = 600;
export const CH09_FRAMES = chapterFrames(N, LEAD) + EXTRA;
const T = makeTimeline(N, 30);
const at = T.at;
const END = T.frames + TAIL + FADE + EXTRA; // last frame in narration time

const I9 = {
  dupont: 'img/ch09/chinese_mercantile_dupont_st_1866.jpg', custom: 'img/ch09/chinese_immigrants_custom_house_1877.jpg', kearney: 'img/ch09/kearney_1878.jpg',
  report: 'img/ch09/calif_senate_chinese_immigration_1876.jpg', act: 'img/ch09/exclusion_act_1882.jpg', cattle: 'img/ch09/texas_cattle_trade_1874.jpg',
  ames: 'img/ch07/oakes_ames_brady.jpg', grant: 'img/ch07/grant_brady_1870s.jpg', louisiana: 'img/ch08/louisiana_troops_withdrawn_1877.jpg',
  worker: 'img/previews/hart_tunnel8_worker_w.jpg',
};
const Z9: Record<string, [number, number]> = {
  dupont: [1536, 1474], custom: [1004, 1536], kearney: [938, 960], report: [1852, 3234], act: [1920, 2768], cattle: [3000, 2393],
  ames: [2472, 3000], grant: [1920, 2571], louisiana: [3000, 2394],
};
const TAG = {
  tunnel8: 'A. A. Hart, Heading of Tunnel No. 8, Central Pacific, 1865–69 · Library of Congress',
  dupont: 'Lawrence & Houseworth, Chinese Mercantile Houses, Dupont Street, San Francisco, c. 1866 · Library of Congress',
  custom: "Chinese immigrants at the San Francisco custom-house, Harper's Weekly, Feb. 3, 1877 · Library of Congress",
  kearney: 'Denis Kearney, engraving, 1878 · via Wikimedia Commons',
  report: 'Chinese Immigration: Testimony before a Committee of the Senate of the State of California, 1876 · Internet Archive',
  act: 'An Act to execute certain treaty stipulations relating to Chinese (Chinese Exclusion Act), May 6, 1882 · National Archives (via Commons)',
  spike: 'A. J. Russell, East and West Shaking Hands at Laying Last Rail, May 10, 1869 · Wikimedia Commons',
  warren: 'Territory of the U.S. from the Mississippi to the Pacific, Warren & Freyhold, 1868 · Library of Congress',
  cattle: "The Texas cattle trade: cutting out, Frenzeny & Tavernier, Harper's Weekly, 1874 · Library of Congress",
};

const inside = (size: [number, number], cx: number, cy: number, s: number) => {
  const hw = 960 / s;
  const hh = 540 / s;
  return {cx: Math.min(size[0] - hw, Math.max(hw, cx)), cy: Math.min(size[1] - hh, Math.max(hh, cy)), s};
};

// ---------------------------------------------------------------- A · the workers move on
const MovedOn: React.FC = () => {
  const f = useCurrentFrame();
  const b = at('To farms');
  const c = inside(SZ.tunnel8, keys(f, [[0, 760], [b, 980]]), keys(f, [[0, 1450], [b, 1350]]), zkeys(f, [[0, 1.5], [b, 0.98]]));
  return (
    <AbsoluteFill>
      <PhotoCam src={IMG.tunnel8} size={SZ.tunnel8} cx={c.cx} cy={c.cy} s={c.s} mask={SM.worker} tintAt={4} traceAt={8} />
      <Note text="the men who built it" x={1180} y={760} size={54} rot={-3} at={at('Chinese workers') - 3} />
      <Note text="moved on" x={1260} y={860} size={60} rot={-3} color="#f4efe6" at={at('moved on') - 3} />
      <ScrimTag text={TAG.tunnel8} x={34} y={24} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- B–C · farms, mines… Chinatown
const WORK: [string, string][] = [['farms', 'farms,'], ['mines', 'mines,'], ['laundries', 'laundries,'], ['factories', 'factories']];
const Jobs: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('To farms') - 1;
  const b = at('the growing');
  return (
    <DeskShot tilt={keys(f, [[a, 22], [b, 15]])} z={zkeys(f, [[a, 0.92], [b, 0.99]])} hits={[a + 4]}
      over={<>
        {WORK.map(([w, t], i) => <Hand key={w} parts={[[t]]} x={1180 + i * 30} y={220 + i * 130} size={80} at={at(w) - 3} />)}
        <ScrimTag text={TAG.dupont} x={34} y={24} />
      </>}>
      <Print src={I9.dupont} size={Z9.dupont} x={150} y={120} w={940} at={a + 1} rot={-2} seed={31} />
    </DeskShot>
  );
};
const Chinatown: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('the growing') - 1;
  const b = at('Then the depression');
  const c = inside(Z9.dupont, keys(f, [[a, 700], [b, 980]]), 700, 1.35);
  return (
    <AbsoluteFill>
      <PhotoCam src={I9.dupont} size={Z9.dupont} cx={c.cx} cy={c.cy} s={c.s} />
      <Note text="San Francisco's Chinatown" x={120} y={110} size={58} rot={-3} at={at('Chinatown') - 3} />
      <ScrimTag text={TAG.dupont} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- D · depression, wages fell
const WagesFell: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Then the depression') - 1;
  const z = zkeys(f, [[a, 1.0], [at('And in California'), 1.06]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '30% 50%'}}>
        <Hand parts={[['then the depression hit.']]} x={180} y={300} size={90} at={at('depression') - 3} />
        <Hand parts={[['wages '], ['fell.', true]]} x={380} y={500} size={110} at={at('Wages') - 3} />
        <Wire pts={[[1100, 450], [1220, 640], [1300, 760]]} at={at('fell') - 2} color="#FF6F61" width={9} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- E · blamed the Chinese
const Blamed: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('And in California') - 1;
  const b = at('In 1877');
  const c = inside(Z9.custom, 500, keys(f, [[a, 1100], [b, 980]]), zkeys(f, [[a, 2.05], [b, 1.95]]));
  return (
    <AbsoluteFill>
      <PhotoCam src={I9.custom} size={Z9.custom} cx={c.cx} cy={c.cy} s={c.s} bw="grayscale(1) contrast(1.1) brightness(0.42)" />
      <Mono text="CALIFORNIA, 1870s" x={120} y={110} size={30} at={a + 4} />
      <Hand parts={[['many white workers '], ['blamed', true]]} x={120} y={600} size={84} at={at('blamed') - 4} white />
      <Hand parts={[['the Chinese for working for less']]} x={120} y={740} size={76} at={at('working') - 4} white />
      <ScrimTag text={TAG.custom} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- F · Kearney
const Kearney: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('In 1877') - 1;
  const z = zkeys(f, [[a, 0.97], [at('Its slogan'), 1.04]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '35% 50%'}}>
        <CircleMount src={I9.kearney} size={Z9.kearney} cx={520} cy={560} r={300} fx={480} fy={420} scale={0.78} at={at('speaker') - 2} />
        <SlapTitle text="1877" x={980} y={170} size={110} at={a + 1} seed={61} />
        <Note text="Denis Kearney" x={1000} y={420} size={64} rot={-3} at={at('Denis') - 2} />
        <Mono text="THE WORKINGMEN'S PARTY" x={1000} y={560} size={32} at={at("Workingmen's") - 1} />
        <Mono text="OF CALIFORNIA" x={1000} y={620} size={32} at={at("Workingmen's") + 2} />
      </AbsoluteFill>
      <ScrimTag text={TAG.kearney} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- G · the slogan
const Slogan: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const a = at('Its slogan') - 1;
  const q = at('The Chinese must');
  const z = zkeys(f, [[a, 1.0], [at('Newspapers'), 1.08]]);
  const word = (t: string, w: number, coral = false) => g >= w && (
    <span style={{color: coral ? pal.subject : '#f4efe6', opacity: interpolate(g, [w, w + 3], [0, 1], clamp)}}>{t}</span>
  );
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '50% 50%'}}>
        <Note text="its slogan, four words:" x={200} y={250} size={54} rot={-2} at={a + 3} />
        <div style={{position: 'absolute', left: 200, top: 420, fontFamily: JF.heavy, fontWeight: 900, fontSize: 132, lineHeight: 1.1, whiteSpace: 'nowrap', textShadow: '0 4px 18px #000'}}>
          {word('“The ', q - 1)}{word('Chinese ', at('Chinese', 3) - 1)}{word('must ', at('must') - 1, true)}{word('go!”', at('go') - 1, true)}
        </div>
      </AbsoluteFill>
      <Tag text="Slogan of the Workingmen's Party of California, 1877" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- H · newspapers, doctors: the 1876 Senate report
const ReportDesk: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Newspapers') - 1;
  const b = at('a danger');
  return (
    <DeskShot tilt={keys(f, [[a, 24], [b, 16]])} rotZ={keys(f, [[a, -2], [b, 0]])} z={zkeys(f, [[a, 0.9], [b, 0.98]])} hits={[a + 4]}
      over={<>
        <Note text="newspapers…" x={1150} y={260} size={60} rot={-3} at={a + 4} />
        <Note text="and even some doctors" x={1150} y={370} size={56} rot={-3} at={at('doctors') - 3} />
        <ScrimTag text={TAG.report} x={34} y={24} />
      </>}>
      <Print src={I9.report} size={Z9.report} x={450} y={-60} w={640} crop={[0, 300, 1852, 2700]} at={a + 1} rot={2} seed={33} filter="grayscale(1) sepia(0.3) contrast(1.15) brightness(0.92)" />
    </DeskShot>
  );
};
const ReportDetail: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('a danger') - 1;
  const b = at('Some of it');
  const c = inside(Z9.report, 926, keys(f, [[a, 1050], [b, 1200]]), zkeys(f, [[a, 1.2], [b, 1.3]]));
  return (
    <AbsoluteFill>
      <PhotoCam src={I9.report} size={Z9.report} cx={c.cx} cy={c.cy} s={c.s} bw="grayscale(1) sepia(0.3) contrast(1.2) brightness(0.62)" />
      <Hand parts={[['“a danger”', true], [' to white workers']]} x={150} y={720} size={76} at={at('danger') - 3} white />
      <Hand parts={[['…and to white health']]} x={250} y={860} size={70} at={at('health') - 6} white />
      <ScrimTag text={TAG.report} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- I · dressed up as science
const Science: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Some of it') - 1;
  const x = keys(f, [[a, 20], [at('In 1882'), -20]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `translateX(${x}px)`}}>
        <Hand parts={[['some of it was dressed up as']]} x={200} y={330} size={84} at={a + 2} white />
        <Hand parts={[['“science”', true]]} x={560} y={500} size={140} at={at('science') - 3} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- J–K · the Exclusion Act
const ActDesk: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('In 1882') - 1;
  const b = at('No Chinese');
  return (
    <DeskShot tilt={keys(f, [[a, 26], [b, 16]])} z={zkeys(f, [[a, 0.88], [b, 0.97]])} hits={[a + 4]}
      over={<>
        <SlapTitle text="CHINESE EXCLUSION ACT" x={150} y={840} size={84} at={at('Chinese Exclusion') - 1} seed={63} />
        <SlapTitle text="1882" x={1430} y={160} size={110} at={a + 2} seed={65} />
        <ScrimTag text={TAG.act} x={34} y={24} />
      </>}>
      <Print src={I9.act} size={Z9.act} x={640} y={-120} w={700} crop={[0, 0, 1920, 2400]} at={a + 1} rot={-2} seed={35} />
    </DeskShot>
  );
};
// line boxes (Gemini, review/ch09_exclusion_act_words.json) in page px (1920 x 2768):
// "until the expiration of ten years" y 1138, x 789–1517; "the coming of Chinese laborers" y 1210, x 611–1273; "suspended" y 1283, x 676–991
const ActSwipe: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('No Chinese') - 1;
  const z = zkeys(f, [[a, 1.0], [at('Then it was'), 1.06]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '55% 50%'}}>
        <DocFocus src={I9.act} size={Z9.act} x={120} y={150} w={1680} h={760} sx0={60} sy0={830} scale={0.92} rot={-1} at={a + 1} band={[1095, 1320]} pullAt={a + 10}
          swipes={[[789, 1140, 1517], [611, 1212, 1273], [676, 1285, 991]]} swipeAt={at('for ten') - 2} lineH={58} seed={9} />
      </AbsoluteFill>
      <Note text="no Chinese workers, for ten years" x={200} y={930} size={54} rot={-1} at={at('ten years') + 4} />
      <ScrimTag text={TAG.act} x={34} y={24} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- L · renewed, permanent, repealed
const STEPS: [number, string, string][] = [[1882, 'PASSED · 10 YEARS', 'Exclusion'], [1892, 'RENEWED', 'renewed'], [1902, 'MADE PERMANENT', 'permanent'], [1943, 'REPEALED', '1943']];
const Timeline: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const a = at('Then it was') - 1;
  const X = (y: number) => 180 + ((y - 1880) / 66) * 1560;
  const p = interpolate(g, [a, at('1943') + 6], [0, 1], clamp);
  const pan = keys(f, [[a, 60], [at('It was the first'), -40]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `translateX(${pan}px)`}}>
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
          <line x1={X(1880)} y1={600} x2={X(1946)} y2={600} stroke={pal.mark} strokeWidth={3} opacity={0.6} />
          <rect x={X(1882)} y={580} width={(X(1943) - X(1882)) * p} height={40} fill={pal.subject} opacity={0.9} />
        </svg>
        {STEPS.map(([y, t, w], i) => {
          const s = i === 0 ? a + 2 : at(w, w === 'Exclusion' ? 1 : 1) - 2;
          const sAt = i === 0 ? a + 2 : s;
          return (
            <React.Fragment key={y}>
              <Wire pts={[[X(y), i % 2 ? 700 : 500], [X(y), i % 2 ? 630 : 570]]} at={sAt} head />
              <Mono text={`${y}`} x={X(y) - 50} y={i % 2 ? 720 : 410} size={40} at={sAt} color={i === 3 ? '#f4efe6' : undefined} />
              <Mono text={t} x={X(y) - 50} y={i % 2 ? 790 : 340} size={24} at={sAt + 2} />
            </React.Fragment>
          );
        })}
        <Hand parts={[['61 years', true]]} x={X(1905)} y={180} size={90} at={at('1943') + 6} />
      </AbsoluteFill>
      <Tag text="Chinese Exclusion Act 1882 · Geary Act 1892 · extended without limit 1902 · repealed by the Magnuson Act 1943" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- M · the first major law
const FirstLaw: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('It was the first') - 1;
  const b = at("So let's");
  const c = inside(Z9.act, 960, keys(f, [[a, 1200], [b, 1100]]), 1.0);
  return (
    <AbsoluteFill>
      <PhotoCam src={I9.act} size={Z9.act} cx={c.cx} cy={c.cy} s={c.s} bw="grayscale(1) sepia(0.3) contrast(1.1) brightness(0.3)" />
      <Hand parts={[['the first major law in American history']]} x={140} y={330} size={70} at={at('first major') - 3} white />
      <Hand parts={[['to ban immigrants because of their']]} x={140} y={470} size={70} at={at('ban') - 3} white />
      <Hand parts={[['nationality.', true]]} x={500} y={610} size={110} at={at('nationality') - 4} />
      <ScrimTag text={TAG.act} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- N–O · back to the question (Russell)
/** The torn Russell print on the desk, the gap empty or with the coral worker (from P1's approved desk). */
const SpikePrint: React.FC<{t0: number; worker?: number}> = ({t0, worker}) => (
  <>
    <Lift x={130} y={80} w={1150} hgt={875} h={10} at={t0} rot={-2} seed={2}>
      <TornPrint src={IMG.spike} size={SZ.spike} x={0} y={0} w={1150} at={-99} seed={3} corner={{at: 'br', x: 0.7, y: 0.58}} real grey shadow={5}
        tapes={[{x: -50, y: 30, w: 190, rot: -38}, {x: 1010, y: -6, w: 190, rot: 30}]} />
    </Lift>
    {worker !== undefined && <Lift x={900} y={440} w={330} hgt={520} h={46} at={worker} seed={7}>
      <CutOut src={I9.worker} size={SZ.tunnel8} mask={SM.worker} place={{left: 10 - 519 * 0.95, top: 18 - 1291 * 0.95, scale: 0.95}} at={-99} tint={0.6} soft traceAt={worker + 6}
        filter="grayscale(1) contrast(1.15) brightness(1.2)" />
    </Lift>}
  </>
);
const BackDesk: React.FC = () => {
  const f = useCurrentFrame();
  const a = at("So let's") - 1;
  const b = at('The railroad was supposed');
  return (
    <DeskShot tilt={keys(f, [[a, 26], [b, 18]])} rotZ={keys(f, [[a, -2], [b, 0]])} z={0.9} hits={[a + 4]}
      over={<><Note text="back to the question" x={1320} y={150} size={50} rot={-3} at={at('question') - 3} /><ScrimTag text={TAG.spike} x={34} y={24} /></>}>
      <SpikePrint t0={a + 1} />
    </DeskShot>
  );
};
const Supposed: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('The railroad was supposed') - 1;
  const b = at('Who did it open');
  const s = zkeys(f, [[a, 0.5], [b, 0.56]]);
  return (
    <AbsoluteFill>
      <PhotoCam src={IMG.spike} size={SZ.spike} cx={1920} cy={keys(f, [[a, 1330], [b, 1290]])} s={s} fg="img/previews/spike_fg.webp" bg="img/previews/spike_bg.jpg" fgK={keys(f, [[a, 0], [b, 0.06]])} />
      <Note text="tie a reunited country together" x={120} y={110} size={52} rot={-2} at={at('tie') - 3} />
      <Note text="open the West to anyone" x={180} y={210} size={52} rot={-2} at={at('open the West') - 3} />
      <ScrimTag text={TAG.spike} />
    </AbsoluteFill>
  );
};
const Question: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Who did it open') - 1;
  return (
    <DeskShot tilt={keys(f, [[a, 30], [at('It did tie'), 26]])} z={0.82} y={60}
      over={<Hand parts={[['who did it '], ['open', true], [' it for?']]} x={330} y={430} size={120} at={a + 1} />}>
      <div style={{filter: 'blur(3px) brightness(0.45)'}}><SpikePrint t0={-99} /></div>
    </DeskShot>
  );
};

// ---------------------------------------------------------------- P · what it did do (quick callbacks)
const TiedWeek: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('It did tie') - 1;
  return (
    <DeskShot tilt={keys(f, [[a, 14], [at('And it built'), 20]])} z={zkeys(f, [[a, 1.0], [at('And it built'), 0.94]])} lamp={[600, 480]}
      over={<>
        <Hand parts={[['it did tie the country together']]} x={760} y={60} size={54} at={a + 2} />
        <Mono text="COAST TO COAST: MONTHS → A WEEK" x={1180} y={190} size={30} at={at('Months') - 1} color="#FF6F61" />
        <ScrimTag text={TAG.spike} x={34} y={24} />
      </>}>
      <SpikePrint t0={-99} />
    </DeskShot>
  );
};
const NextEps: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('And it built') - 1;
  const z = zkeys(f, [[a, 1.0], [at('The railroads got'), 1.06]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '40% 50%'}}>
        <MapCard x={120} y={190} w={900} h={620} src={IMG.warren} size={SZ.warren} fx={2000} fy={1200} scale={0.42} rot={-2} at={a + 1}
          loop={{sx: 2050, sy: 1250, rx: 1100, ry: 650}} caption="THE WEST · 1868" bright />
        <Hand parts={[['it built the West']]} x={1110} y={320} size={70} at={at('built') - 2} />
        <Note text="of the next three episodes" x={1110} y={460} size={46} rot={-3} at={at('three episodes') - 3} />
      </AbsoluteFill>
      <Tag text={TAG.warren} />
    </AbsoluteFill>
  );
};
const Checker: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('The railroads got') - 1;
  const z = zkeys(f, [[a, 1.06], [at('Travelers'), 1.0]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '30% 50%'}}>
        <PlatGrid x={150} y={170} cols={12} rows={12} cell={60} at={a + 1} per={1} railRow={6} numbers={false} />
        <Note text="the railroads got land" x={1000} y={330} size={58} rot={-3} at={at('land') - 3} />
        <Note text="in a checkerboard" x={1030} y={440} size={58} rot={-3} at={at('checkerboard') - 3} />
        <Note text="across half a continent" x={1060} y={550} size={52} rot={-3} color="#f4efe6" at={at('half a') - 3} />
      </AbsoluteFill>
      <Tag text="Land grant: odd-numbered sections within 10 miles of the line (Pacific Railway Acts, 1862–64), drawn" />
    </AbsoluteFill>
  );
};
const Crossers: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Travelers') - 1;
  const b = at('But the companies');
  return (
    <DeskShot tilt={keys(f, [[a, 22], [b, 14]])} z={zkeys(f, [[a, 0.92], [b, 1.0]])} hits={[a + 4]}
      over={<>
        {[['travelers', 'Travelers'], ['shippers', 'shippers'], ['settlers', 'settlers'], ['railroad owners', 'the men who owned']].map(([t, w], i) => (
          <Hand key={t} parts={[[t]]} x={1220 + (i % 2) * 40} y={190 + i * 120} size={74} at={at(w) - 3} />
        ))}
        <Note text="got a country they could cross" x={960} y={760} size={48} rot={-3} color="#f4efe6" at={at('could cross') - 3} />
        <ScrimTag text="J. Carbutt, Union Pacific excursion at the 100th meridian, Oct. 1866 · Library of Congress" x={34} y={24} />
      </>}>
      <Print src={IMG.carbutt} size={SZ.carbutt} x={80} y={200} w={1040} crop={[0, 520, 2012, 1450]} at={a + 1} rot={-2} seed={4} />
    </DeskShot>
  );
};

// ---------------------------------------------------------------- Q · who paid (callback cards)
const CallCard: React.FC<{src: string; size: [number, number]; crop: [number, number, number, number]; a: number; b: number; tag: string; children: React.ReactNode; mask?: typeof M7.ames; rot?: number; w?: number}> = ({
  src, size, crop, a, b, tag, children, mask, rot = -2, w = 760,
}) => {
  const f = useCurrentFrame();
  return (
    <DeskShot tilt={keys(f, [[a, 18], [b, 13]])} z={zkeys(f, [[a, 0.94], [b, 1.02]])} x={keys(f, [[a, 30], [b, -30]])} hits={[a + 4]}
      over={<>{children}<ScrimTag text={tag} x={34} y={24} /></>}>
      <Print src={src} size={size} x={180} y={120} w={w} crop={crop} at={a + 1} rot={rot} seed={a % 50} mask={mask} tint={mask ? 0.55 : undefined} traceAt={mask ? a + 6 : undefined} />
    </DeskShot>
  );
};
const PaidFast: React.FC = () => (
  <CallCard src={I9.ames} size={Z9.ames} crop={[350, 550, 2350, 2350]} a={at('But the companies') - 1} b={at('The president who')} tag="Oakes Ames, Brady-Handy studio · Library of Congress">
    <Mono text="PAID BY THE MILE" x={1080} y={220} size={34} at={at('paid to build') - 2} />
    <Note text="paid to build fast" x={1080} y={300} size={54} rot={-3} at={at('build fast') - 3} />
    <Hand parts={[['billing the '], ['public', true]]} x={1080} y={470} size={80} at={at('billing') - 3} />
  </CallCard>
);
const Shaken: React.FC = () => (
  <CallCard src={I9.grant} size={Z9.grant} crop={[150, 300, 1920, 2400]} a={at('The president who') - 1} b={at('The railroad bust')} rot={2} w={680}
    tag="Ulysses S. Grant, Brady-Handy studio, 1870s · Library of Congress">
    <Note text="“Let us have peace”" x={1040} y={240} size={58} rot={-3} at={at('promised peace') - 3} />
    <Note text="shaken by the people around him" x={1000} y={380} size={50} rot={-3} at={at('shaken') - 3} />
    <Mono text="CRÉDIT MOBILIER · WHISKEY RING" x={1040} y={500} size={26} at={at('shaken') + 4} color="#FF6F61" />
  </CallCard>
);
const Freedmen: React.FC = () => (
  <CallCard src={I9.louisiana} size={Z9.louisiana} crop={[150, 760, 2850, 1650]} a={at('The railroad bust') - 1} b={at('And the men who did')} w={1080}
    tag="Federal troops leave the New Orleans State House, 1877, Frank Leslie's · LOC">
    <Note text="the bust helped end Reconstruction" x={260} y={700} size={52} rot={-2} at={at('bust') - 2} />
    <Hand parts={[['freedmen in the South', true]]} x={330} y={820} size={74} at={at('freedmen') - 3} />
  </CallCard>
);
const ShutOut: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('And the men who did') - 1;
  const b = at('This is our');
  const c = inside(SZ.tunnel8, keys(f, [[a, 1150], [b, 900]]), keys(f, [[a, 1420], [b, 1450]]), zkeys(f, [[a, 1.0], [b, 1.12]]));
  return (
    <AbsoluteFill>
      <PhotoCam src={IMG.tunnel8} size={SZ.tunnel8} cx={c.cx} cy={c.cy} s={c.s} mask={SM.worker} tintAt={a + 3} traceAt={a + 5} />
      <Note text="the hardest work" x={1160} y={150} size={56} rot={-3} at={at('hardest') - 3} />
      <Note text="in the mountains, in the snow" x={1060} y={250} size={50} rot={-3} at={at('mountains') - 3} />
      <Hand parts={[['shut out ', true], ['by name']]} x={1080} y={820} size={88} at={at('shut out') - 3} />
      <ScrimTag text={TAG.tunnel8} x={34} y={24} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- R · the Promise Ledger
// Same dark card as the kit's Ledger (S4), but each cell has its own write-on frame, a tall first row and grey tape.
type Cell = {text: string; at: number; coral?: boolean};
const LedgerCard: React.FC<{x: number; y: number; w: number; at: number; cells: Cell[]}> = ({x, y, w, at: a, cells}) => {
  const d = useDrop(a);
  const g = useGFrame();
  const pal = usePal();
  const hand = useHand();
  if (!d.on) return null;
  const heads = ['THE PROMISE', 'WHO GOT IT', "WHO DIDN'T"];
  const cols = [0, 0.31, 0.57];
  const mx = 130;
  const colX = cols.map((c) => mx + c * (w - mx - 30));
  const headY = 118;
  const row1 = 300;
  const rowH = 70;
  const empty = 3;
  const h = headY + 62 + row1 + empty * rowH + 30;
  const margin = ['EP 1', 'EP 2', 'EP 3', 'EP 4'];
  const lineY = (i: number) => headY + 62 + (i === 0 ? 0 : row1 + (i - 1) * rowH);
  return (
    <div style={{position: 'absolute', left: x, top: y - d.air * 40, width: w, height: h, transform: `rotate(${-1 + d.air * 3}deg)`, opacity: Math.min(1, d.k * 3)}}>
      <div style={{position: 'absolute', inset: 0, filter: `drop-shadow(14px 18px 0 ${SHADOW})`}}>
        <div style={{position: 'absolute', inset: 0, clipPath: tornPoly(w, h, 7, {t: true}, 10), background: 'radial-gradient(ellipse at 40% 30%, #36312a 0%, #26231d 75%, #1d1a15 100%)'}}>
          {Array.from({length: empty + 2}).map((_, i) => <div key={i} style={{position: 'absolute', left: 20, right: 20, top: lineY(i), height: 2, background: pal.mark, opacity: i === 0 ? 0.9 : 0.35}} />)}
          <div style={{position: 'absolute', left: mx - 18, top: 20, bottom: 0, width: 2, background: pal.mark, opacity: 0.6}} />
          {colX.slice(1).map((cx, i) => <div key={i} style={{position: 'absolute', left: cx - 18, top: headY, bottom: 20, width: 1.5, background: pal.mark, opacity: 0.35}} />)}
        </div>
      </div>
      <div style={{position: 'absolute', left: mx, top: 30, fontFamily: JF.display, fontSize: 58, color: boxOf(pal), whiteSpace: 'nowrap'}}>THE PROMISE LEDGER</div>
      {heads.map((t, i) => <div key={t} style={{position: 'absolute', left: colX[i], top: headY + 16, fontFamily: JF.mono, fontSize: 24, letterSpacing: 3, color: pal.mark, whiteSpace: 'nowrap'}}>{t}</div>)}
      {margin.map((t, i) => <div key={t} style={{position: 'absolute', left: 26, top: (i === 0 ? lineY(0) + 24 : lineY(i) + rowH / 2 - 14), fontFamily: JF.mono, fontSize: 22, letterSpacing: 2,
        color: i === 0 ? pal.mark : 'rgba(47,224,196,0.4)', whiteSpace: 'nowrap'}}>{t}</div>)}
      {cells.map((c, ci) => {
        if (g < c.at) return null;
        const p = interpolate(g, [c.at, c.at + 14], [0, 1], clamp);
        return <div key={ci} style={{position: 'absolute', left: colX[ci], top: lineY(0) + 18, fontFamily: hand.family, fontSize: 34 * hand.scale, lineHeight: 1.02, color: c.coral ? pal.subject : pal.mark,
          whiteSpace: 'pre', clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`, textShadow: '0 0 2px #111, 2px 2px 0 #111, -2px 2px 0 #111'}}>{c.text}</div>;
      })}
      <Tape x={w * 0.12} y={-16} w={170} rot={-6} seed={1} grey />
      <Tape x={w * 0.78} y={-14} w={160} rot={5} seed={2} grey />
    </div>
  );
};
const CELLS = (): Cell[] => [
  {text: 'Progress for a\nreunited nation', at: at('Progress') - 2},
  {text: 'travelers,\nsettlers,\nrailroad owners', at: at('Travelers', 2) - 2},
  {text: 'the Chinese workers\nwho built it,\nfreedmen in the South,\nthe nations whose land\nthe track ran through', at: at('The Chinese workers', 2) - 2, coral: true},
];
const LEDGER = {x: 110, y: 130, w: 1700};
const LedgerCam: React.FC<{z: number; cx: number; cy: number}> = ({z, cx, cy}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <DarkPaper />
    <AbsoluteFill style={{transform: `translate(${960 - cx * z}px, ${540 - cy * z}px) scale(${z})`, transformOrigin: '0 0'}}>
      <LedgerCard {...LEDGER} at={at('This is our')} cells={CELLS()} />
    </AbsoluteFill>
    <Tag text="The Promise Ledger · one row per episode" />
  </AbsoluteFill>
);
const LedgerWide: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('This is our') - 1;
  return <LedgerCam z={zkeys(f, [[a, 0.92], [at('Progress'), 1.0]])} cx={960} cy={keys(f, [[a, 520], [at('Progress'), 540]])} />;
};
const LedgerPush: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Progress') - 1;
  return <LedgerCam z={zkeys(f, [[a, 1.05], [at("Who didn't"), 1.3]])} cx={keys(f, [[a, 760], [at("Who didn't"), 820]])} cy={keys(f, [[a, 470], [at("Who didn't"), 430]])} />;
};
const LedgerPan: React.FC = () => {
  const f = useCurrentFrame();
  const a = at("Who didn't") - 1;
  return <LedgerCam z={zkeys(f, [[a, 1.18], [at('The railroad tied') - 1, 1.1]])} cx={keys(f, [[a, 900], [at('The railroad tied') - 1, 1000]])} cy={keys(f, [[a, 440], [at('The railroad tied') - 1, 480]])} />;
};

// ---------------------------------------------------------------- S · the closing line on Russell's photo
const Tied: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('The railroad tied') - 1;
  const b = at('Then the country');
  return (
    <DeskShot tilt={keys(f, [[a, 20], [b, 14]])} z={zkeys(f, [[a, 0.86], [b, 0.95]])} y={keys(f, [[a, 30], [b, 0]])}
      over={<ScrimTag text={TAG.spike} x={34} y={24} />}>
      <SpikePrint t0={-99} />
    </DeskShot>
  );
};
const InThePicture: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Then the country') - 1;
  const w = at('who was allowed') - 2;
  const e = at('Meanwhile');
  return (
    <DeskShot tilt={keys(f, [[a, 14], [e, 20]])} z={zkeys(f, [[a, 0.97], [e, 0.88]])} hits={[w + 3]}
      over={<>
        <SlapTitle text="NOT IN THE PICTURE" x={110} y={900} size={84} at={at('picture') - 1} seed={21} />
        <ScrimTag text="A. J. Russell, 1869 · Commons  ·  A. A. Hart, Heading of Tunnel No. 8, 1865–69 · LOC" x={34} y={24} />
      </>}>
      <SpikePrint t0={-99} worker={w} />
    </DeskShot>
  );
};

// ---------------------------------------------------------------- T · Kansas, five million cows
const Kansas: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Meanwhile') - 1;
  const b = at('It involved');
  return (
    <DeskShot tilt={keys(f, [[a, 22], [b, 16]])} z={zkeys(f, [[a, 0.92], [b, 1.0]])} hits={[a + 4]}
      over={<>
        <Note text="the end of a new rail line" x={1150} y={250} size={50} rot={-3} at={at('rail lines') - 3} />
        <Note text="a man had an idea" x={1200} y={360} size={54} rot={-3} at={at('idea') - 3} />
        <ScrimTag text={TAG.warren} x={34} y={24} />
      </>}>
      <Lift x={330} y={180} w={980} hgt={640} h={8} at={a + 1} rot={-2} seed={41}>
        <MapCard x={0} y={0} w={980} h={640} src={IMG.warren} size={SZ.warren} fx={2550} fy={1500} scale={0.85} at={-99}
          loop={{sx: 2560, sy: 1500, rx: 330, ry: 150}} caption="KANSAS · 1867" bright />
      </Lift>
    </DeskShot>
  );
};
const Cows: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('It involved') - 1;
  const d = at('five million') - 2;
  return (
    <DeskShot tilt={keys(f, [[a, 16], [at('Thanks'), 12]])} z={zkeys(f, [[a, 1.0], [at('Thanks'), 1.04]])} hits={[d + 3]}
      over={<>
        <Mono text="ABOUT 5,000,000 COWS" x={1200} y={760} size={36} at={at('million') + 2} color="#FF6F61" />
        <Note text="→ Episode 2" x={1240} y={850} size={54} rot={-3} at={at('cows') + 2} />
        <ScrimTag text="Map: Warren & Freyhold, 1868 · LOC  ·  Longhorn: Frenzeny & Tavernier, Harper's, 1874 · LOC" x={34} y={24} />
      </>}>
      <Lift x={330} y={180} w={980} hgt={640} h={8} at={-99} rot={-2} seed={41} blur={1.2}>
        <MapCard x={0} y={0} w={980} h={640} src={IMG.warren} size={SZ.warren} fx={2550} fy={1500} scale={0.85} at={-99}
          loop={{sx: 2560, sy: 1500, rx: 330, ry: 150}} caption="KANSAS · 1867" bright />
      </Lift>
      <Lift x={1250} y={300} w={330} hgt={430} h={40} at={d} seed={43}>
        <CutOut src={I9.cattle} size={Z9.cattle} mask={M9.longhorn} place={{left: 20 - 2160 * 0.55, top: 10 - 1030 * 0.55, scale: 0.55}} at={-99} />
      </Lift>
    </DeskShot>
  );
};

// ---------------------------------------------------------------- U · end screen (clean slots for YouTube's end-screen elements)
const Slot: React.FC<{x: number; y: number; w: number; h: number; round?: boolean; at: number}> = ({x, y, w, h, round = false, at: a}) => {
  const g = useGFrame();
  const pal = usePal();
  const k = interpolate(g, [a, a + 10], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: round ? '50%' : 4, background: 'rgba(8,7,5,0.55)', opacity: k,
      boxShadow: `inset 0 0 0 2px rgba(47,224,196,0.35), 12px 14px 0 ${SHADOW}`}}>
      {!round && <div style={{position: 'absolute', inset: 10, border: `1px solid ${pal.mark}`, opacity: 0.15}} />}
    </div>
  );
};
const EndScreen: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Thanks') - 1;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DeskShot tilt={keys(f, [[a, 16], [END, 10]])} z={zkeys(f, [[a, 0.84], [END, 0.8]])} lamp={[960, 420]}>
        <div style={{filter: 'blur(4px) brightness(0.35)'}}><SpikePrint t0={-99} /></div>
      </DeskShot>
      <SlapTitle text="NOT IN THE PICTURE" x={110} y={80} size={64} at={a + 2} seed={21} />
      <Note text="thanks for watching" x={1220} y={90} size={52} rot={-3} at={at('watching') - 3} />
      {/* video slot (16:9) left, a second video slot right, subscribe circle bottom centre: left empty for YouTube */}
      <Slot x={130} y={300} w={800} h={450} at={a + 6} />
      <Slot x={990} y={300} w={800} h={450} at={a + 8} />
      <Slot x={850} y={800} w={220} h={220} round at={a + 10} />
      <Mono text="NEXT · EP 2" x={130} y={250} size={24} at={a + 6} />
    </AbsoluteFill>
  );
};

const SFX: [number, string, number][] = [
  [8, 'marker_tick', 0.12], [at('Chinese workers') - 5, 'marker_tick', 0.2], [at('moved on') - 5, 'marker_tick', 0.2],
  [at('To farms') - 2, 'whip_soft', 0.25], [at('To farms') + 3, 'paper_slap_soft', 0.25], ...WORK.map(([w]) => [at(w) - 5, 'marker_tick', 0.2] as [number, string, number]),
  [at('the growing') - 2, 'whoosh', 0.25], [at('Chinatown') - 5, 'marker_tick', 0.2],
  [at('Then the depression') - 2, 'whip_soft', 0.25], [at('depression') - 5, 'marker_tick', 0.2], [at('Wages') - 5, 'marker_tick', 0.2],
  [at('And in California') - 2, 'whoosh', 0.25], [at('blamed') - 6, 'marker_tick', 0.2],
  [at('In 1877') - 2, 'whip_soft', 0.25], [at('In 1877'), 'stamp', 0.22], [at('speaker') - 2, 'card_slide_soft', 0.2], [at('Denis') - 4, 'marker_tick', 0.2],
  [at("Workingmen's") - 1, 'block_tap_soft', 0.15],
  [at('Its slogan') - 2, 'whoosh', 0.25], [at('Its slogan') + 1, 'marker_tick', 0.2],
  [at('Newspapers') - 2, 'whip_soft', 0.25], [at('Newspapers') + 3, 'paper_slap_soft', 0.25], [at('Newspapers') + 2, 'marker_tick', 0.2], [at('doctors') - 5, 'marker_tick', 0.2],
  [at('a danger') - 2, 'whoosh', 0.25], [at('danger') - 5, 'marker_tick', 0.2],
  [at('Some of it') - 2, 'whip_soft', 0.2], [at('science') - 5, 'marker_tick', 0.2],
  [at('In 1882') - 2, 'whip_soft', 0.25], [at('In 1882') + 2, 'stamp', 0.22], [at('In 1882') + 3, 'page_turn', 0.4], [at('Chinese Exclusion') - 1, 'stamp', 0.22],
  [at('No Chinese') - 2, 'whoosh', 0.25], [at('ten years') + 2, 'marker_tick', 0.2],
  [at('Then it was') - 2, 'whip_soft', 0.25], [at('renewed') - 2, 'block_tap_soft', 0.15], [at('permanent') - 2, 'block_tap_soft', 0.15], [at('1943') - 2, 'block_tap_soft', 0.15],
  [at('It was the first') - 2, 'whoosh', 0.25], [at('nationality') - 6, 'marker_tick', 0.2],
  [at("So let's") - 2, 'whip_soft', 0.25], [at("So let's") + 3, 'paper_slap_soft', 0.25], [at('question') - 5, 'marker_tick', 0.2],
  [at('The railroad was supposed') - 2, 'whoosh', 0.25], [at('tie') - 5, 'marker_tick', 0.2],
  [at('Who did it open') - 2, 'whip_soft', 0.2], [at('Who did it open'), 'marker_tick', 0.2],
  [at('It did tie') - 2, 'whoosh', 0.25], [at('Months') - 1, 'block_tap_soft', 0.15],
  [at('And it built') - 2, 'whip_soft', 0.25], [at('And it built') + 1, 'card_slide_soft', 0.2],
  [at('The railroads got') - 2, 'whoosh', 0.25], [at('The railroads got') + 4, 'block_tap_soft', 0.12], [at('checkerboard') - 5, 'marker_tick', 0.2],
  [at('Travelers') - 2, 'whip_soft', 0.25], [at('Travelers') + 3, 'paper_slap_soft', 0.22],
  [at('But the companies') - 2, 'whip_soft', 0.25], [at('But the companies') + 3, 'paper_slap_soft', 0.22], [at('billing') - 5, 'marker_tick', 0.2],
  [at('The president who') - 2, 'whip_soft', 0.25], [at('The president who') + 3, 'paper_slap_soft', 0.22], [at('promised peace') - 5, 'marker_tick', 0.2],
  [at('The railroad bust') - 2, 'whip_soft', 0.25], [at('The railroad bust') + 3, 'paper_slap_soft', 0.22], [at('freedmen') - 5, 'marker_tick', 0.2],
  [at('And the men who did') - 2, 'whoosh', 0.25], [at('shut out') - 5, 'marker_tick', 0.2],
  [at('This is our') - 2, 'whip_soft', 0.25], [at('This is our') + 2, 'paper_slap_soft', 0.25], [at('This is our') + 5, 'tape_press', 0.2],
  [at('Progress') - 4, 'marker_tick', 0.2], [at('Travelers', 2) - 4, 'marker_tick', 0.2], [at('The Chinese workers', 2) - 4, 'marker_tick', 0.2],
  [at('The railroad tied') - 2, 'whip_soft', 0.2],
  [at('who was allowed') - 1, 'paper_slap_soft', 0.25], [at('who was allowed') + 4, 'tape_press', 0.18], [at('picture') - 1, 'stamp', 0.22],
  [at('Meanwhile') - 2, 'whip_soft', 0.25], [at('Meanwhile') + 3, 'card_slide_soft', 0.2], [at('rail lines') - 5, 'marker_tick', 0.2], [at('idea') - 5, 'marker_tick', 0.2],
  [at('five million') - 1, 'paper_slap_soft', 0.22], [at('cows'), 'marker_tick', 0.2],
  [at('Thanks') - 2, 'whip_soft', 0.2], [at('Thanks') + 1, 'stamp', 0.18], [at('watching') - 5, 'marker_tick', 0.2],
];

const Body: React.FC = () => {
  const shots: [number, React.ReactNode, ('whip' | 'cut')?][] = [
    [0, <MovedOn />],
    [at('To farms') - 1, <Jobs />, 'whip'],
    [at('the growing') - 1, <Chinatown />, 'cut'],
    [at('Then the depression') - 1, <WagesFell />, 'whip'],
    [at('And in California') - 1, <Blamed />, 'cut'],
    [at('In 1877') - 1, <Kearney />, 'whip'],
    [at('Its slogan') - 1, <Slogan />, 'cut'],
    [at('Newspapers') - 1, <ReportDesk />, 'whip'],
    [at('a danger') - 1, <ReportDetail />, 'cut'],
    [at('Some of it') - 1, <Science />, 'cut'],
    [at('In 1882') - 1, <ActDesk />, 'whip'],
    [at('No Chinese') - 1, <ActSwipe />, 'cut'],
    [at('Then it was') - 1, <Timeline />, 'whip'],
    [at('It was the first') - 1, <FirstLaw />, 'cut'],
    [at("So let's") - 1, <BackDesk />, 'whip'],
    [at('The railroad was supposed') - 1, <Supposed />, 'cut'],
    [at('Who did it open') - 1, <Question />, 'cut'],
    [at('It did tie') - 1, <TiedWeek />, 'cut'],
    [at('And it built') - 1, <NextEps />, 'whip'],
    [at('The railroads got') - 1, <Checker />, 'cut'],
    [at('Travelers') - 1, <Crossers />, 'whip'],
    [at('But the companies') - 1, <PaidFast />, 'whip'],
    [at('The president who') - 1, <Shaken />, 'whip'],
    [at('The railroad bust') - 1, <Freedmen />, 'whip'],
    [at('And the men who did') - 1, <ShutOut />, 'cut'],
    [at('This is our') - 1, <LedgerWide />, 'whip'],
    [at('Progress') - 1, <LedgerPush />, 'cut'],
    [at("Who didn't") - 1, <LedgerPan />, 'cut'],
    [at('The railroad tied') - 1, <Tied />, 'whip'],
    [at('Then the country') - 1, <InThePicture />, 'cut'],
    [at('Meanwhile') - 1, <Kansas />, 'whip'],
    [at('It involved') - 1, <Cows />, 'cut'],
    [at('Thanks') - 1, <EndScreen />, 'whip'],
  ];
  return (
    <>
      <Shots shots={shots} />
      <Sounds list={SFX} />
    </>
  );
};

export const Ch09: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch09_the_picture.wav" lead={LEAD} extra={EXTRA}
    music={[
      {src: 'music/r_nativism.mp3', volume: 0.15, to: at("So let's") + 6, fadeOut: 24},
      // SUNO: aw_promise_theme replaces this (from "So let's go back to the question" to the end, end screen music-only)
      {src: 'music/r_ending.mp3', volume: 0.16, from: at("So let's") - 6, to: at("Let's write") + 6, fadeOut: 30},
      // SUNO: aw_promise_theme replaces this (r_ending is 61 s, so the fallback restarts under the ledger and carries the end screen)
      {src: 'music/r_ending.mp3', volume: 0.16, from: at("Let's write") - 6},
    ]}>
    <Body />
  </ChapterShell>
);
