// Chapter 7 · Where It Will Do Most Good (Crédit Mobilier, the Whiskey Ring, the two views of Grant, the subscribe plug).
// Shot list (narration words → shot):
//  A "Remember how…paid by the mile?"      desk: Carbutt's 100th-meridian print, PAID BY THE MILE, the bond rates (push)
//  B "Some of the men running…paid twice"   detail pan across the UP officials in the same print
//  C–F "They set up…the public was paying"  drawn money loop: UP → Crédit Mobilier, gov't loans, THE SAME MEN (coral loop); wide → push → pull → static stack
//  G "To keep Congress friendly…Oakes Ames"  desk: Ames print lands (pull)
//  H "handed out shares…cheap"              detail push into Ames (coral subject)
//  I "He wrote…do most good to us. Subtle." the Poland Committee report, focus pull + swipe on the quoted words (Gemini line boxes)
//  J–K "In 1872…broke the story"            The Sun, Sept 4 1872 lands on the desk → push into THE KING OF FRAUDS
//  L "Grant's own vice president…Colfax"    Colfax portrait (coral)
//  M "To be fair, the deal began before…"   drawn timeline: the share deals 1867–68 vs Grant takes office 1869
//  N "and Grant himself was never accused"  Grant portrait (coral), push
//  O–P "Then, in 1875…the Whiskey Ring"     trial engraving + title → drawn tax diagram (the ring keeps the tax)
//  Q "Let no guilty man escape."            quote beside Grant's print
//  R "one of the men charged…Babcock"       Babcock portrait (coral)
//  S "Grant spoke up for him…not guilty"    desk: Grant and Babcock prints, arrow, NOT GUILTY strip
//  T "So, to his supporters…let it happen"  the two-views card: supporters left (from ch06), critics right writes in
//  U "Quick thing…helps the channel."       the plug: one small teal note "subscribe ↓", nothing louder
import React from 'react';
import {bed} from '../kit/levels';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch07_where_it_will_do_most_good.words.json';
import {clamp} from '../lib/anim';
import {JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, hasFile, LEAD, makeTimeline, Quote, type Narration} from '../kit/shell';
import {DocFocus, keys, Mono, PhotoCam, ScrimTag, Shots, SlapTitle, useSlap, zkeys} from '../kit/west';
import {IMG, SZ} from '../samples/masks';
import {WShots, DeskShot, Hand, Node, Print, Sounds, Strike, Wire} from '../kit/ch07_extra';
import {M7} from '../masks_ch07';
import {CutOut} from '../kit/west';

// AI lithograph props (review/ai_images_ch07.md), 1920 x 1920, masked c7_certificate / c7_coins / c7_barrels
const PROP: [number, number] = [1920, 1920];
const AI = {certificate: 'img/ch07/ai_stock_certificate.jpg', coins: 'img/ch07/ai_coins_notes.jpg', barrels: 'img/ch07/ai_whiskey_barrels.jpg'};
const LITHO = 'grayscale(0.35) contrast(1.05) brightness(0.95)';

const N = words as Narration;
export const CH07_FRAMES = chapterFrames(N, LEAD);
const T = makeTimeline(N, 30);
const at = T.at;

// images (source pixel sizes read from the files)
const I7 = {
  ames: 'img/ch07/oakes_ames_brady.jpg', colfax: 'img/ch07/colfax_brady.jpg', grant: 'img/ch07/grant_brady_1870s.jpg', babcock: 'img/ch07/babcock_brady.jpg',
  sun: 'img/ch07/sun_1872_09_04_p1.jpg', report: 'img/ch07/poland_report_1873_p_most_good.jpg', whiskey: 'img/ch07/whiskey_ring_trial_1876.jpg',
};
const Z7: Record<string, [number, number]> = {
  ames: [2472, 3000], colfax: [2394, 3000], grant: [1920, 2571], babcock: [1920, 2494], sun: [3134, 4099], report: [1538, 2541], whiskey: [3000, 2393],
};
const TAG = {
  carbutt: 'J. Carbutt, Union Pacific excursion at the 100th meridian, Oct. 1866 · Library of Congress',
  ames: 'Oakes Ames, Brady-Handy studio, c. 1860–75 · Library of Congress',
  report: 'Report of the Select Committee (Poland Committee) on Crédit Mobilier, 1873, p. iv · Cornell Univ. Library / Internet Archive',
  sun: 'The Sun (New York), Sept. 4, 1872, p. 1 · Library of Congress, Chronicling America',
  colfax: 'Schuyler Colfax, c. 1860–75 · Library of Congress',
  grant: 'Ulysses S. Grant, Brady-Handy studio, 1870s · Library of Congress (via Wikimedia Commons)',
  babcock: 'Orville E. Babcock, Brady-Handy studio, 1860s · Library of Congress (via Wikimedia Commons)',
  whiskey: "The great Whisky Ring trial, St. Louis, Frank Leslie's Illustrated Newspaper, 1876 · Library of Congress",
};

/** Keep a PhotoCam inside the picture (no black edges): clamp the centre for scale s. */
const inside = (size: [number, number], cx: number, cy: number, s: number) => {
  const hw = 960 / s;
  const hh = 540 / s;
  return {cx: Math.min(size[0] - hw, Math.max(hw, cx)), cy: Math.min(size[1] - hh, Math.max(hh, cy)), s};
};

// ---------------------------------------------------------------- A · paid by the mile (desk, push)
const Mile: React.FC = () => {
  const f = useCurrentFrame();
  const e = at('Some of the men');
  return (
    <DeskShot tilt={keys(f, [[0, 24], [e, 15]])} z={zkeys(f, [[0, 0.9], [e, 1.0]])} y={keys(f, [[0, 20], [e, -10]])} hits={[4]}
      over={<>
        <SlapTitle text="PAID BY THE MILE" x={110} y={880} size={78} at={at('paid') - 1} seed={31} />
        <Mono text="U.S. BOND LOANS PER MILE" x={1250} y={300} size={24} at={at('paid') + 6} />
        <Mono text="$16,000 · FLAT" x={1250} y={370} size={30} at={at('paid') + 10} />
        <Mono text="$32,000 · PLATEAU" x={1250} y={440} size={30} at={at('paid') + 13} />
        <Mono text="$48,000 · MOUNTAINS" x={1250} y={510} size={30} at={at('paid') + 16} color="#FF6F61" />
        <ScrimTag text={TAG.carbutt} x={34} y={24} />
      </>}>
      <Print src={IMG.carbutt} size={SZ.carbutt} x={60} y={140} w={1100} crop={[0, 520, 2012, 1450]} at={2} rot={-2} seed={4} />
    </DeskShot>
  );
};

// ---------------------------------------------------------------- B · the men running the UP (detail pan)
const Twice: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Some of the men') - 1;
  const b = at('They set up');
  const c = inside(SZ.carbutt, keys(f, [[a, 980], [b, 1380]]), 1020, 1.3);
  return (
    <AbsoluteFill>
      <PhotoCam src={IMG.carbutt} size={SZ.carbutt} cx={c.cx} cy={c.cy} s={c.s} bw="grayscale(1) contrast(1.25) brightness(0.95)" />
      <Note text="the men running the Union Pacific" x={120} y={120} size={50} rot={-2} at={at('running') - 3} />
      <Hand parts={[['paid '], ['twice', true]]} x={1260} y={820} size={88} at={at('twice') - 4} />
      <ScrimTag text={TAG.carbutt} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- C–F · the money loop (one drawn diagram, four framings)
const MoneyLoop: React.FC<{z: number; cx: number; cy: number; dim?: number; coins?: boolean}> = ({z, cx, cy, dim = 0, coins = true}) => {
  const pal = usePal();
  const coral = pal.subject;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `translate(${960 - cx * z}px, ${540 - cy * z}px) scale(${z})`, transformOrigin: '0 0', opacity: 1 - dim}}>
        <Node x={150} y={380} w={540} h={170} label="UNION PACIFIC" sub="the railroad" at={at('They set up') + 2} />
        <Node x={1230} y={380} w={540} h={170} label="CRÉDIT MOBILIER" sub="the builder" at={at('construction') - 1} />
        <Wire pts={[[700, 420], [1220, 420]]} at={at('hired') - 2} />
        <Note text="hired to build it" x={830} y={330} size={42} rot={-2} at={at('hired')} />
        <Wire pts={[[1220, 510], [700, 510]]} at={at('far more') - 2} width={8} />
        <Note text="$$$ far more than it cost" x={780} y={525} size={42} rot={-2} at={at('far more')} />
        {coins && <CutOut src={AI.coins} size={PROP} mask={M7.coins} place={{left: 1020, top: 560, scale: 0.13}} at={at('far more') + 4} filter={LITHO} />}
        <Node x={690} y={80} w={540} h={150} label="U.S. GOV'T LOANS" sub="the public's money" at={at('government') - 1} size={32} />
        <Wire pts={[[760, 240], [500, 370]]} at={at('government') + 3} />
        <Node x={690} y={780} w={540} h={160} label="THE SAME MEN" at={at('The same men') - 1} coral size={38} />
        <Wire pts={[[720, 800], [430, 560]]} at={at('ran the railroad') - 2} color={coral} />
        <Note text="ran the railroad" x={210} y={640} size={40} rot={-3} at={at('ran the railroad')} />
        <Wire pts={[[1200, 800], [1490, 560]]} at={at('owned the builder') - 2} color={coral} />
        <Note text="owned the builder" x={1420} y={640} size={40} rot={-3} at={at('owned the builder')} />
        <Wire pts={[[960, 770], [960, 600]]} at={at('set the price') - 2} color={coral} />
        <Note text="set the price" x={990} y={615} size={40} rot={-3} color={coral} at={at('set the price')} />
        <Loop cx={960} cy={560} rx={880} ry={420} at={at('set the price') + 6} seed={7} tilt={-2} width={6} color={coral} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const LoopWide: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('They set up') - 1;
  return (
    <AbsoluteFill>
      <MoneyLoop z={zkeys(f, [[a, 0.94], [at('Then the Union'), 1.0]])} cx={960} cy={keys(f, [[a, 470], [at('Then the Union'), 500]])} />
      <SlapTitle text="CRÉDIT MOBILIER" x={520} y={90} size={96} at={at('Credit Mobilier') - 1} seed={33} />
      <Note text="(a fancy French name)" x={1130} y={230} size={40} rot={-3} color="#f4efe6" at={at('fancy')} />
    </AbsoluteFill>
  );
};
const LoopHired: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Then the Union') - 1;
  return <MoneyLoop z={zkeys(f, [[a, 1.0], [at('And it paid'), 1.04]])} cx={keys(f, [[a, 960], [at('And it paid'), 990]])} cy={470} />;
};
const LoopPush: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('And it paid') - 1;
  return <MoneyLoop z={zkeys(f, [[a, 1.05], [at('government'), 1.22], [at('The same men') - 1, 1.12]])} cx={keys(f, [[a, 960], [at('government'), 980], [at('The same men'), 900]])}
    cy={keys(f, [[a, 470], [at('government') - 4, 470], [at('The same men'), 420]])} />;
};
const LoopSame: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('The same men') - 1;
  return <MoneyLoop coins={false} z={zkeys(f, [[a, 1.06], [at('That means'), 0.9]])} cx={960} cy={keys(f, [[a, 560], [at('That means'), 520]])} />;
};
const LoopStack: React.FC = () => (
  <AbsoluteFill>
    <MoneyLoop z={0.9} cx={960} cy={520} dim={0.72} coins={false} />
    <Hand parts={[['that means…']]} x={180} y={230} size={70} at={at('That means') - 2} white />
    <Hand parts={[['they were billing '], ['themselves', true]]} x={180} y={380} size={96} at={at('billing') - 6} />
    <Hand parts={[['and the public was paying.']]} x={180} y={560} size={84} at={at('public') - 4} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------- G–H · Oakes Ames
const AmesDesk: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('To keep Congress') - 1;
  const b = at('handed out');
  return (
    <DeskShot tilt={keys(f, [[a, 14], [b, 22]])} z={zkeys(f, [[a, 1.02], [b, 0.92]])} hits={[a + 4]}
      over={<>
        <Note text="Rep. Oakes Ames (Mass.)" x={1100} y={220} size={50} rot={-3} at={at('Oakes') - 2} />
        <Note text="(also a Union Pacific man)" x={1120} y={320} size={40} rot={-3} color="#f4efe6" at={at('Oakes') + 10} />
        <ScrimTag text={TAG.ames} x={34} y={24} />
      </>}>
      <Print src={I7.ames} size={Z7.ames} x={260} y={60} w={760} crop={[350, 550, 2350, 2350]} at={a + 1} rot={-3} seed={9} />
    </DeskShot>
  );
};

const AmesPush: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('handed out') - 1;
  const b = at('He wrote');
  const c = inside(Z7.ames, keys(f, [[a, 1600], [b, 1560]]), keys(f, [[a, 1250], [b, 1150]]), zkeys(f, [[a, 0.82], [b, 1.0]]));
  return (
    <AbsoluteFill>
      <PhotoCam src={I7.ames} size={Z7.ames} cx={c.cx} cy={c.cy} s={c.s} mask={M7.ames} tintAt={a + 2} traceAt={a + 4} />
      <Note text="shares in Crédit Mobilier" x={1080} y={150} size={48} rot={-3} at={at('shares') - 2} />
      <Note text="→ other congressmen" x={1110} y={250} size={46} rot={-3} at={at('other members') - 2} />
      {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', inset: 0, transform: `rotate(${-8 + i * 7}deg)`, transformOrigin: `${1420 + i * 60}px ${640 + i * 30}px`}}>
        <CutOut src={AI.certificate} size={PROP} mask={M7.certificate} place={{left: 1150 + i * 60, top: 420 + i * 40, scale: 0.27}} at={at('shares') + 2 + i * 4} filter={LITHO} />
      </div>)}
      <Hand parts={[['cheap.', true]]} x={1360} y={880} size={100} at={at('cheap') - 3} />
      <ScrimTag text={TAG.ames} x={34} y={24} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- I · the report, swipe on "where it will do most good to us"
// Line boxes from Gemini (review/ch07_most_good_lines.json, _words.json): page 1538 x 2541 px;
// line "...to place the stock “where" y 577–610, “where” x 1310–1436; line "it will do most good to us.”" y 617–650, x 103–621.
const MostGood: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('He wrote') - 1;
  const z = zkeys(f, [[a, 1.0], [at('In 1872'), 1.07]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '50% 48%'}}>
        <DocFocus src={I7.report} size={Z7.report} x={190} y={170} w={1540} h={700} sx0={50} sy0={340} scale={1.08} rot={-1} at={a + 1} band={[566, 662]}
          pullAt={at('he\'d put') - 2} swipes={[[1300, 594, 1440], [98, 634, 626]]} swipeAt={at('where')} lineH={40} seed={5} />
      </AbsoluteFill>
      <Note text="“where it will do most good to us”" x={250} y={920} size={50} rot={-1} at={at('where') + 12} />
      <Note text="subtle." x={1450} y={900} size={70} rot={-5} color="#f4efe6" at={at('Subtle') - 1} />
      <ScrimTag text={TAG.report} x={34} y={24} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- J–K · The Sun, 1872
const SunDesk: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('In 1872') - 1;
  const b = at('New York');
  return (
    <DeskShot tilt={keys(f, [[a, 26], [b, 18]])} rotZ={keys(f, [[a, -3], [b, 0]])} z={zkeys(f, [[a, 0.9], [b, 0.98]])} hits={[a + 4]}
      over={<>
        <SlapTitle text="1872" x={1240} y={140} size={120} at={a + 2} seed={35} />
        <Note text="Grant runs for a second term" x={1040} y={340} size={44} rot={-3} at={at('campaign') - 2} />
        <ScrimTag text={TAG.sun} x={34} y={24} />
      </>}>
      <Print src={I7.sun} size={Z7.sun} x={420} y={-80} w={820} crop={[0, 0, 3134, 2700]} at={a + 1} rot={2} seed={12} />
    </DeskShot>
  );
};

// headline boxes (Gemini, review/ch07_sun_headline_lines.json): THE KING OF FRAUDS. x 74–475, y 340–396 (page px)
const SunHeadline: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('New York') - 1;
  const b = at("Grant's own");
  const s = zkeys(f, [[a, 1.5], [b, 2.4]]);
  return (
    <AbsoluteFill>
      <PhotoCam src={I7.sun} size={Z7.sun} cx={keys(f, [[a, 460], [b, 290]])} cy={keys(f, [[a, 560], [b, 450]])} s={s}
        bw="grayscale(1) sepia(0.25) contrast(1.25) brightness(0.95)">
        {(S) => {
          const [x0, y0] = S(74, 340);
          const [x1, y1] = S(475, 396);
          return <Loop cx={(x0 + x1) / 2} cy={(y0 + y1) / 2} rx={(x1 - x0) / 2 + 40} ry={(y1 - y0) / 2 + 30} at={a + 14} seed={17} tilt={-3} width={6} />;
        }}
      </PhotoCam>
      <Note text="broke the story" x={1240} y={880} size={56} rot={-3} at={at('broke') - 2} />
      <ScrimTag text={TAG.sun} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- L · Colfax
const Colfax: React.FC = () => {
  const f = useCurrentFrame();
  const a = at("Grant's own") - 1;
  const b = at('To be fair');
  const c = inside(Z7.colfax, keys(f, [[a, 1450], [b, 1420]]), keys(f, [[a, 1050], [b, 1000]]), zkeys(f, [[a, 0.85], [b, 0.95]]));
  return (
    <AbsoluteFill>
      <PhotoCam src={I7.colfax} size={Z7.colfax} cx={c.cx} cy={c.cy} s={c.s} mask={M7.colfax} tintAt={at('Schuyler') - 2} traceAt={at('Schuyler')} />
      <Note text="Vice President Schuyler Colfax" x={940} y={170} size={46} rot={-3} at={at('vice') - 2} />
      <Note text="caught up in it" x={1180} y={280} size={56} rot={-3} color="#FF6F61" at={at('caught') - 2} />
      <ScrimTag text={TAG.colfax} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- M · fairness timeline
const Fair: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const a = at('To be fair') - 1;
  const x0 = 220;
  const x1 = 1700;
  const yr = (y: number) => x0 + ((y - 1866) / 7) * (x1 - x0);
  const p = interpolate(g, [a, a + 10], [0, 1], clamp);
  const pan = keys(f, [[a, 30], [at('and Grant himself'), -30]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `translateX(${pan}px)`}}>
        <Hand parts={[['to be fair…']]} x={220} y={150} size={70} at={a + 2} white />
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
          <line x1={x0} y1={600} x2={x0 + (x1 - x0) * p} y2={600} stroke={pal.mark} strokeWidth={5} />
          {[1866, 1867, 1868, 1869, 1870, 1871, 1872, 1873].map((y) => p >= (y - 1866) / 7 && (
            <g key={y}><line x1={yr(y)} y1={585} x2={yr(y)} y2={615} stroke={pal.mark} strokeWidth={4} />
              <text x={yr(y)} y={660} textAnchor="middle" fontFamily={JF.mono} fontSize={28} fill={pal.mark}>{y}</text></g>
          ))}
          {g >= at('deal') && <rect x={yr(1867.6)} y={520} width={(yr(1868.4) - yr(1867.6)) * interpolate(g, [at('deal'), at('deal') + 6], [0, 1], clamp)} height={40} fill={pal.subject} opacity={0.9} />}
        </svg>
        <Mono text="AMES'S SHARE DEALS · 1867–68" x={yr(1866.3)} y={440} size={26} at={at('deal') + 2} color="#FF6F61" />
        <Wire pts={[[yr(1869.2), 470], [yr(1869.2), 580]]} at={at('before Grant') - 2} />
        <Mono text="GRANT TAKES OFFICE · MARCH 1869" x={yr(1869.2) - 60} y={380} size={26} at={at('before Grant')} />
      </AbsoluteFill>
      <Tag text="Dates: Poland Committee report, 1873" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- N · Grant never accused
const GrantClean: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('and Grant himself') - 1;
  const b = at('Then, in 1875');
  const c = inside(Z7.grant, 960, keys(f, [[a, 1150], [b, 1050]]), zkeys(f, [[a, 1.0], [b, 1.1]]));
  return (
    <AbsoluteFill>
      <PhotoCam src={I7.grant} size={Z7.grant} cx={c.cx} cy={c.cy} s={c.s} mask={M7.grant} tintAt={a + 3} traceAt={a + 5} />
      <Note text="Grant: never accused" x={1260} y={760} size={54} rot={-3} at={at('never') - 3} />
      <Note text="of taking any shares" x={1290} y={860} size={46} rot={-3} at={at('taking') - 2} />
      <ScrimTag text={TAG.grant} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- O–P · the Whiskey Ring
const RingTitle: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Then, in 1875') - 1;
  const b = at('Whiskey makers');
  const has = hasFile(I7.whiskey);
  return (
    <AbsoluteFill>
      {has ? (() => {
        const c = inside(Z7.whiskey, keys(f, [[a, 1300], [b, 1700]]), 1250, 1.0);
        return <PhotoCam src={I7.whiskey} size={Z7.whiskey} cx={c.cx} cy={c.cy} s={c.s} />;
      })() : <DarkPaper />}
      <SlapTitle text="THE WHISKEY RING" x={110} y={100} size={100} at={at('Whiskey Ring') - 1} seed={37} />
      <Mono text="1875" x={120} y={260} size={40} at={at('1875')} />
      {has && <ScrimTag text={TAG.whiskey} />}
    </AbsoluteFill>
  );
};

const RingDiagram: React.FC = () => {
  const f = useCurrentFrame();
  const pal = usePal();
  const a = at('Whiskey makers') - 1;
  const z = zkeys(f, [[a, 1.08], [at('Grant said'), 0.98]]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '50% 45%'}}>
        <Node x={140} y={300} w={500} h={160} label="WHISKEY MAKERS" sub="distillers" at={a + 2} />
        <CutOut src={AI.barrels} size={PROP} mask={M7.barrels} place={{left: 150, top: 470, scale: 0.19}} at={a + 6} filter={LITHO} />
        <Node x={1280} y={300} w={500} h={160} label="U.S. TREASURY" sub="the tax should go here" at={at('Treasury') - 1} />
        <Wire pts={[[650, 380], [1270, 380]]} at={at('Treasury') + 2} dash head />
        <Note text="whiskey tax" x={860} y={300} size={44} rot={-2} at={at('Treasury') + 4} />
        <Strike x0={760} x1={1180} y={392} at={at('keeping') + 2} />
        <Node x={700} y={690} w={520} h={160} label="THE RING" sub="officials + distillers" at={at('keeping') - 1} coral />
        <Wire pts={[[900, 400], [960, 680]]} at={at('keeping') + 4} color={pal.subject} width={8} />
        <Note text="kept it for themselves" x={1250} y={740} size={50} rot={-3} color={pal.subject} at={at('for themselves') - 3} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Q · "Let no guilty man escape."
const NoGuilty: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Grant said') - 1;
  const b = at('Then one of');
  return (
    <DeskShot tilt={keys(f, [[a, 10], [b, 16]])} z={zkeys(f, [[a, 1.0], [b, 1.05]])} x={keys(f, [[a, 0], [b, -30]])} lamp={[1400, 480]}
      over={<>
        <Quote text="Let no guilty man escape." at={at('Let no') - 2} x={110} y={330} w={980} size={80} who="Ulysses S. Grant, 1875" />
        <ScrimTag text={TAG.grant} x={34} y={24} />
      </>}>
      <Print src={I7.grant} size={Z7.grant} x={1240} y={110} w={640} crop={[150, 300, 1920, 2400]} at={-99} rot={3} seed={14} filter="grayscale(1) contrast(1.2) brightness(0.8)" />
    </DeskShot>
  );
};

// ---------------------------------------------------------------- R · Babcock
const Babcock: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Then one of') - 1;
  const b = at('Grant spoke');
  const c = inside(Z7.babcock, 1000, keys(f, [[a, 760], [b, 640]]), zkeys(f, [[a, 1.0], [b, 1.12]]));
  return (
    <AbsoluteFill>
      <PhotoCam src={I7.babcock} size={Z7.babcock} cx={c.cx} cy={c.cy} s={c.s} mask={M7.babcock} tintAt={at('Orville') - 2} traceAt={at('Orville')} />
      <Note text="one of the men charged:" x={1140} y={640} size={44} rot={-3} at={at('charged') - 2} />
      <Note text="Grant's private secretary" x={1140} y={740} size={48} rot={-3} at={at('private secretary') - 2} />
      <Note text="Orville Babcock" x={1200} y={850} size={56} rot={-3} color="#FF6F61" at={at('Orville') - 2} />
      <ScrimTag text={TAG.babcock} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- S · Grant spoke up, not guilty
const Acquitted: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Grant spoke') - 1;
  const b = at('So, to his');
  return (
    <DeskShot tilt={keys(f, [[a, 14], [b, 24]])} z={zkeys(f, [[a, 1.0], [b, 0.9]])} hits={[a + 4]}
      over={<>
        <Note text="Grant spoke up for him" x={720} y={120} size={50} rot={-3} at={at('spoke') - 2} />
        <Wire pts={[[760, 210], [1040, 300]]} at={at('spoke') + 4} />
        <ScrimTag text={`${TAG.grant.split(' · ')[0]}  ·  ${TAG.babcock}`} x={34} y={24} />
      </>}>
      <Print src={I7.grant} size={Z7.grant} x={170} y={180} w={560} crop={[150, 300, 1920, 2400]} at={-99} rot={-3} seed={14} />
      <Print src={I7.babcock} size={Z7.babcock} x={1050} y={210} w={620} crop={[150, 0, 1920, 1900]} at={a + 1} rot={2} seed={15}>
        {(_S, w, h) => <NotGuilty x={w * 0.12} y={h * 0.78} at={at('not guilty') - 1} />}
      </Print>
    </DeskShot>
  );
};
const NotGuilty: React.FC<{x: number; y: number; at: number}> = ({x, y, at: a}) => {
  const s = useSlap(a, 1.4);
  if (!s.on) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `scale(${s.scale}) rotate(-4deg)`, opacity: s.opacity}}><Mono text="1876 · FOUND NOT GUILTY" x={0} y={0} size={30} /></div>;
};

// ---------------------------------------------------------------- T · the two views (ch06 fills the left, ch07 writes the right)
const TwoViews: React.FC<{z: number; cx: number; cy: number}> = ({z, cx, cy}) => {
  const pal = usePal();
  const L = 150;
  const R = 1010;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `translate(${960 - cx * z}px, ${540 - cy * z}px) scale(${z})`, transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', left: 90, top: 90, width: 1740, height: 900, background: 'radial-gradient(ellipse at 40% 30%, #36312a 0%, #26231d 75%, #1d1a15 100%)',
          boxShadow: '16px 20px 0 #050403', transform: 'rotate(-0.6deg)'}}>
          <div style={{position: 'absolute', inset: 10, border: `2px solid ${pal.mark}`, opacity: 0.6}} />
          <div style={{position: 'absolute', left: 868, top: 40, bottom: 40, width: 3, background: pal.mark, opacity: 0.7}} />
        </div>
        <Mono text="HIS SUPPORTERS" x={L} y={140} size={30} />
        <Mono text="HIS CRITICS" x={R} y={140} size={30} color={pal.subject} />
        {/* left: what ch06 filled in (same wording as ch06's card) */}
        <Note text="· the 15th Amendment (1870)" x={L} y={230} size={38} rot={-1} />
        <Note text="· laws to enforce it" x={L} y={300} size={38} rot={-1} />
        <Note text="· troops + prosecutors vs. the Klan" x={L} y={370} size={38} rot={-1} />
        <Note text="· a Peace Policy out West" x={L} y={440} size={38} rot={-1} />
        <Hand parts={[['an honest man']]} x={L} y={590} size={80} at={at('honest') - 3} />
        <Hand parts={[['with '], ['bad friends', true]]} x={L} y={700} size={80} at={at('bad friends') - 3} />
        {/* right: writes in now */}
        <Note text="· Crédit Mobilier" x={R} y={230} size={38} rot={-1} at={at('critics') - 2} />
        <Note text="· the Whiskey Ring" x={R} y={300} size={38} rot={-1} at={at('critics') + 4} />
        <Note text="· Babcock let off" x={R} y={370} size={38} rot={-1} at={at('critics') + 10} />
        <Hand parts={[['a president who']]} x={R} y={590} size={80} at={at('president who') - 3} />
        <Hand parts={[['let it '], ['happen', true]]} x={R} y={700} size={80} at={at('let it happen') - 3} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const ViewsLeft: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('So, to his') - 1;
  return <TwoViews z={zkeys(f, [[a, 1.0], [at('To his critics'), 1.18]])} cx={keys(f, [[a, 960], [at('To his critics'), 560]])} cy={keys(f, [[a, 540], [at('To his critics'), 520]])} />;
};
const ViewsRight: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('To his critics') - 1;
  return <TwoViews z={zkeys(f, [[a, 1.12], [at('Quick thing'), 1.06]])} cx={keys(f, [[a, 960], [at('Quick thing'), 1000]])} cy={520} />;
};

// ---------------------------------------------------------------- U · the plug: only a small teal note
const PlugNote: React.FC = () => <Note text="subscribe ↓" x={1530} y={930} size={48} rot={-4} at={at('subscribe') - 2} />;
const PlugWide: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Quick thing') - 1;
  return (
    <AbsoluteFill>
      <TwoViews z={zkeys(f, [[a, 1.0], [at('Unlike'), 0.9]])} cx={960} cy={540} />
      <PlugNote />
    </AbsoluteFill>
  );
};
const PlugDesk: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Unlike') - 1;
  const e = T.frames + 60;
  return (
    <DeskShot tilt={keys(f, [[a, 16], [e, 22]])} z={zkeys(f, [[a, 0.98], [e, 0.9]])} x={keys(f, [[a, 20], [e, -20]])}
      over={<><PlugNote /><ScrimTag text="Oakes Ames, Brady-Handy · LOC  ·  The Sun, Sept. 4, 1872 · LOC" x={34} y={24} /></>}>
      <Print src={I7.sun} size={Z7.sun} x={980} y={60} w={680} crop={[0, 0, 3134, 2700]} at={-99} rot={4} seed={12} blur={0.8} h={4} />
      <Print src={I7.ames} size={Z7.ames} x={300} y={140} w={640} crop={[350, 550, 2350, 2350]} at={-99} rot={-3} seed={9} h={12} />
    </DeskShot>
  );
};

// ---------------------------------------------------------------- sound
const SFX: [number, string, number][] = [
  [2, 'paper_slap_soft', 0.25], [at('paid') - 1, 'stamp', 0.22], [at('paid') + 6, 'block_tap_soft', 0.15], [at('paid') + 13, 'block_tap_soft', 0.15], [at('paid') + 16, 'block_tap_soft', 0.15],
  [at('Some of the men') - 2, 'whoosh', 0.25], [at('running') - 5, 'marker_tick', 0.2], [at('twice') - 6, 'marker_tick', 0.2],
  [at('They set up') - 2, 'whoosh', 0.25], [at('They set up') + 2, 'card_slide_soft', 0.2], [at('construction') - 1, 'card_slide_soft', 0.2], [at('fancy') - 2, 'marker_tick', 0.2],
  [at('Credit Mobilier') - 1, 'stamp', 0.22], [at('hired') - 2, 'marker_tick', 0.2], [at('far more') - 2, 'marker_tick', 0.2], [at('government') - 1, 'card_slide_soft', 0.2],
  [at('The same men') - 1, 'paper_slap_soft', 0.22], [at('ran the railroad') - 2, 'marker_tick', 0.2], [at('owned the builder') - 2, 'marker_tick', 0.2], [at('set the price') - 2, 'marker_tick', 0.2],
  [at('That means') - 4, 'marker_tick', 0.2], [at('billing') - 8, 'marker_tick', 0.2], [at('public') - 6, 'marker_tick', 0.2],
  [at('To keep Congress') - 2, 'whip_soft', 0.25], [at('To keep Congress') + 3, 'paper_slap_soft', 0.25], [at('Oakes') - 4, 'marker_tick', 0.2],
  [at('handed out') - 2, 'whoosh', 0.25], [at('shares') - 4, 'marker_tick', 0.2], [at('other members') - 4, 'marker_tick', 0.2], [at('cheap') - 5, 'marker_tick', 0.2],
  [at('He wrote') - 1, 'page_turn', 0.4], [at('where') + 10, 'marker_tick', 0.2], [at('Subtle') - 3, 'marker_tick', 0.2],
  [at('In 1872') - 2, 'whip_soft', 0.25], [at('In 1872') + 3, 'paper_slap_soft', 0.25], [at('In 1872') + 2, 'stamp', 0.22], [at('campaign') - 4, 'marker_tick', 0.2],
  [at('New York') - 2, 'whoosh', 0.25], [at('New York') + 11, 'marker_tick', 0.2], [at('broke') - 4, 'marker_tick', 0.2],
  [at("Grant's own") - 2, 'whoosh', 0.25], [at('vice') - 4, 'marker_tick', 0.2], [at('caught') - 4, 'marker_tick', 0.2],
  [at('To be fair') - 2, 'whip_soft', 0.25], [at('deal'), 'block_tap_soft', 0.15], [at('before Grant') - 2, 'marker_tick', 0.2],
  [at('and Grant himself') - 2, 'whoosh', 0.25], [at('never') - 5, 'marker_tick', 0.2],
  [at('Then, in 1875') - 2, 'whip_soft', 0.25], [at('Whiskey Ring') - 1, 'stamp', 0.22],
  [at('Whiskey makers') - 2, 'whoosh', 0.25], [at('Whiskey makers') + 2, 'card_slide_soft', 0.2], [at('Treasury') - 1, 'card_slide_soft', 0.2], [at('keeping') - 1, 'paper_slap_soft', 0.22],
  [at('for themselves') - 5, 'marker_tick', 0.2],
  [at('Grant said') - 2, 'whip_soft', 0.25],
  [at('Then one of') - 2, 'whoosh', 0.25], [at('charged') - 4, 'marker_tick', 0.2], [at('private secretary') - 4, 'marker_tick', 0.2],
  [at('Grant spoke') - 2, 'whip_soft', 0.25], [at('Grant spoke') + 3, 'paper_slap_soft', 0.25], [at('spoke') - 4, 'marker_tick', 0.2], [at('not guilty') - 1, 'tape_press', 0.2],
  [at('So, to his') - 2, 'whoosh', 0.25], [at('honest') - 5, 'marker_tick', 0.2], [at('critics') - 4, 'marker_tick', 0.2], [at('let it happen') - 5, 'marker_tick', 0.2],
  [at('subscribe') - 4, 'marker_tick', 0.2], [at('Unlike') - 2, 'whip_soft', 0.2],
];

const Body: React.FC = () => {
  const shots: [number, React.ReactNode, ('whip' | 'cut')?][] = [
    [0, <Mile />],
    [at('Some of the men') - 1, <Twice />, 'cut'],
    [at('They set up') - 1, <LoopWide />, 'cut'],
    [at('Then the Union') - 1, <LoopHired />, 'cut'],
    [at('And it paid') - 1, <LoopPush />, 'cut'],
    [at('The same men') - 1, <LoopSame />, 'cut'],
    [at('That means') - 1, <LoopStack />, 'cut'],
    [at('To keep Congress') - 1, <AmesDesk />, 'whip'],
    [at('handed out') - 1, <AmesPush />, 'cut'],
    [at('He wrote') - 1, <MostGood />, 'cut'],
    [at('In 1872') - 1, <SunDesk />, 'whip'],
    [at('New York') - 1, <SunHeadline />, 'cut'],
    [at("Grant's own") - 1, <Colfax />, 'cut'],
    [at('To be fair') - 1, <Fair />, 'whip'],
    [at('and Grant himself') - 1, <GrantClean />, 'cut'],
    [at('Then, in 1875') - 1, <RingTitle />, 'whip'],
    [at('Whiskey makers') - 1, <RingDiagram />, 'cut'],
    [at('Grant said') - 1, <NoGuilty />, 'whip'],
    [at('Then one of') - 1, <Babcock />, 'cut'],
    [at('Grant spoke') - 1, <Acquitted />, 'whip'],
    [at('So, to his') - 1, <ViewsLeft />, 'cut'],
    [at('To his critics') - 1, <ViewsRight />, 'cut'],
    [at('Quick thing') - 1, <PlugWide />, 'cut'],
    [at('Unlike') - 1, <PlugDesk />, 'whip'],
  ];
  return (
    <>
      <WShots shots={shots} />
      <Sounds list={SFX} />
    </>
  );
};

export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch07_where_it_will_do_most_good.wav" lead={LEAD}
    music={[
      // aw_robber_barons (Suno, 2:08): one cue for the whole chapter (1:48)
      {src: 'music/aw_robber_barons.mp3', volume: bed('aw_robber_barons')},
    ]}>
    <Body />
  </ChapterShell>
);
