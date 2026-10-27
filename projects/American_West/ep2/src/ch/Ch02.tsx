// Chapter 2 · Four-Dollar Cows: the callback to Ep 1, Texas in 1865 (no money, five million longhorns), the $4 / $40 price gap,
// the railroad on the series map (Ep 1's lines, then the Kansas Pacific in coral), Joseph McCoy and Abilene (his book's own line
// about "a dozen log huts"), the stack ("a cow became a ticket"), open range, and the thousand-mile walk.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch02_four_dollar_cows.words.json';
import {Arrow, Loop, Note} from '../kit/Kit';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration} from '../kit/shell';
import {bed} from '../kit/levels';
import {Big, Clip, Counter, Label, Lines, Pic, Prop, Sounds, type SfxRow} from '../kit/ch04_extra';
import {Desk3D, keys, Lift, Mono, ScrimTag, shake, Shots, SlapTitle, TornPrint, zkeys} from '../kit/west';
import {Hand, LINES, MPin, MRoute, PL, WestMap} from '../kit/ch01_extra';
import {MHerd, MTrail, TLINES, TPL} from '../kit/trails';
import {Bust, CropCam, MCattle, MState, PriceTag} from '../kit/ch02_extra';
import {WShots} from '../kit/ch07_extra';
import {M2} from '../masks_ch02';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);
const T = makeTimeline(N, 30);
const at = T.at;
const END = T.frames;

const SPIKE = 'img/samples/spike_russell_1869.jpg';
const MAPTAG = 'Map: Natural Earth outlines (today\'s state lines for reference); routes approx.';
const HERD = 'img/ch02/texas_longhorns_herd_kansas_1878.jpg';
const HERD_SZ: [number, number] = [1536, 979];
const HERD_TAG = 'Frank Leslie\'s Illustrated Newspaper, a herd of Texas "long-horns", July 27, 1878 · LOC';
const CUT = 'img/ch02/texas_cattle_trade_cutting_out_1874.jpg';
const CUT_SZ: [number, number] = [3000, 2393];
const CUT_TAG = 'Frenzeny & Tavernier, The Texas cattle trade: cutting out, Harper\'s Weekly, 1874 · LOC';
const MCCOY = 'img/ch02/mccoy_portrait_engraving_1874.jpg';
const MCCOY_SZ: [number, number] = [1800, 2709];
const BOOK_TAG = 'J. G. McCoy, Historic Sketches of the Cattle Trade, 1874 · Newberry Library via Internet Archive';
const ABI = 'img/ch02/mccoy_abilene_first_cattle_train_1867_plate.jpg';
const ABI_SZ: [number, number] = [2755, 1800];
const PAGE = 'img/ch02/b_mccoy_p61.jpg';
const PAGE_SZ: [number, number] = [1800, 2755];
const HOTEL = 'img/ch02/abilene_drovers_hotel_1867.jpg';
const YARD = 'img/ch02/abilene_loading_cattle_mccoy_yard_1867.jpg';
const STEREO_SZ: [number, number] = [3000, 1478];
const GARDNER_TAG = 'Alexander Gardner, Drover\'s Cottage and McCoy\'s stock yard, Abilene, Kan., 1867 (stereo halves) · LOC';
const SHOOT = 'img/ch02/kansas_pacific_texas_beef_transport_1871.jpg';
const SHOOT_SZ: [number, number] = [1536, 1054];
const SHOOT_TAG = 'Frank Leslie\'s, Texas beef on the Kansas Pacific: a cattle shoot at Abilene, 1871 · LOC';
const GUARD = 'img/ch03/texas_cattle_trade_guarding_herd_1874.jpg';
const GUARD_SZ: [number, number] = [1536, 1131];
const GUARD_TAG = 'The Texas cattle trade: guarding the herd, Harper\'s Weekly, March 28, 1874 · LOC';
const ENGR = 'grayscale(1) sepia(0.15) contrast(1.15) brightness(0.98)';
const PLAINS = ['Kansas', 'Nebraska', 'Colorado', 'Wyoming', 'Montana', 'North Dakota', 'South Dakota', 'Oklahoma', 'New Mexico', 'Texas'];

// ---------------------------------------------------------------------------------------------------------------- 1 · the cows

/** 1 · "Last time, I promised you a man with an idea and about five million cows." The longhorn drops in. */
const LastTime: React.FC = () => {
  const f = useCurrentFrame();
  const b = at('Here are the cows') - 1;
  const sh = shake(f, [at('cows') + 3], 9);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={keys(f, [[0, 22], [b, 14]])} z={zkeys(f, [[0, 0.95], [b, 1.02]])} rotZ={keys(f, [[0, 3], [b, 0]])} lamp={[1100, 560]}>
        <Lift x={1080} y={40} w={700} hgt={700 * (2922 / 3840)} h={6} at={2} rot={4} seed={5}>
          <TornPrint src={SPIKE} size={[3840, 2922]} x={0} y={0} w={700} at={-99} seed={6} real grey shadow={5} filter={ENGR} corner={{at: 'br', x: 0.7, y: 0.58}}
            tapes={[{x: 270, y: -14, w: 150, rot: -3}]} />
        </Lift>
      </Desk3D>
      <Mono text="LAST TIME · EPISODE 1" x={130} y={110} size={30} at={4} />
      <Note text="the railroad, done" x={1250} y={70} size={48} rot={-3} at={10} color="#ffffff" />
      <ScrimTag text="A. J. Russell, East and West Shaking Hands at Laying Last Rail, 1869 · Wikimedia Commons" />
      <Hand parts={[['a man with an idea']]} x={140} y={210} size={74} at={at('a man with') - 2} />
      <Hand parts={[['+ about '], ['5 million cows', '#ffffff']]} x={170} y={330} size={66} at={at('five million') - 2} />
      <Prop src="img/props/p2_longhorn.jpg" m={M2.longhorn} x={480} y={440} w={760} at={at('cows') + 1} tint={0.5} traceAt={at('cows') + 6} />
    </AbsoluteFill>
  );
};

/** 2 · "Here are the cows." The 1878 herd, pushing in (the caption kept out of frame). */
const HereCows: React.FC = () => {
  const a = at('Here are the cows') - 1;
  return <Pic src={HERD} size={HERD_SZ} k={[[a, 760, 410, 1.5], [at('Texas 1865') + 4, 820, 420, 1.62]]} filter={ENGR} tag={HERD_TAG} tagY={1026} />;
};

/** 3 · "Texas, 1865. The war is over." */
const Texas65: React.FC = () => {
  const a = at('Texas 1865') - 1;
  const ks = [{f: a, x: 2500, y: 1900, z: 0.42, tilt: 36, rot: 3}, {f: at('Confederate') + 4, x: 2620, y: 2120, z: 0.5, tilt: 42, rot: 0}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>{(api) => <MState api={api} name="Texas" at={a + 3} />}</WestMap>
      <SlapTitle text="TEXAS, 1865" x={120} y={90} size={110} at={at('Texas 1865') + 2} seed={31} />
      <Note text="the war is over" x={150} y={260} size={60} rot={-3} at={at('war is over') - 2} />
      <ScrimTag text={MAPTAG} />
    </AbsoluteFill>
  );
};

/** 4 · "Confederate soldiers come home to a state with almost no money." One coin, alone on the desk. */
const NoMoney: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Confederate') - 1;
  const b = at('But their cattle') - 1;
  return (
    <AbsoluteFill>
      <WestMap keys={[{f: a, x: 2560, y: 2150, z: 0.62, tilt: 48, rot: -4}, {f: b, x: 2640, y: 2200, z: 0.56, tilt: 44, rot: 2}]}>
        {(api) => <>
          <MState api={api} name="Texas" at={-99} />
          <MPin api={api} at={TPL.austin} show={a + 4} label="Austin" sub="TEXAS, 1865" size={42} color="#ffffff" />
        </>}
      </WestMap>
      <Mono text="1865 · CONFEDERATE VETERANS COME HOME" x={150} y={150} size={28} at={a + 3} />
      <Prop src="img/props/p2_coin_one.jpg" m={M2.coinOne} x={1250} y={560} w={260} at={at('almost no money') - 1} rot={-8} />
      <Hand parts={[['soldiers home from the war']]} x={150} y={240} size={70} at={at('Confederate') + 4} />
      <Hand parts={[['almost no money', '#ffffff']]} x={190} y={380} size={84} at={at('almost no money') - 2} />
      <Loop cx={1380} cy={690} rx={190} ry={170} at={at('money') + 4} seed={41} tilt={-6} width={6} />
    </AbsoluteFill>
  );
};

/** 5 · "But their cattle had run wild for four years, and multiplied." Harper's 1874: cutting out a wild steer in the brush. */
const Wild: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('But their cattle') - 1;
  const b = at('By most estimates') - 1;
  return (
    <AbsoluteFill>
      <Desk3D tilt={keys(f, [[a, 26], [b, 18]])} rotZ={keys(f, [[a, -4], [b, -1]])} z={zkeys(f, [[a, 0.9], [b, 1.0]])} x={keys(f, [[a, 80], [b, 0]])}>
        <Lift x={250} y={60} w={720} hgt={720 * (1480 / 1190)} h={8} at={a + 3} rot={-3} seed={51}>
          <TornPrint src={CUT} size={CUT_SZ} x={0} y={0} w={720} crop={[250, 470, 1440, 1950]} at={-99} seed={52} real grey shadow={5} filter={ENGR}
            tapes={[{x: 260, y: -14, w: 150, rot: -3}]} />
        </Lift>
      </Desk3D>
      <Note text="run wild for four years" x={1080} y={250} size={60} rot={-3} at={at('run wild') - 2} />
      <Hand parts={[['and ', '#ffffff'], ['multiplied', '#ffffff']]} x={1110} y={400} size={86} at={at('multiplied') - 3} />
      <ScrimTag text={CUT_TAG} />
    </AbsoluteFill>
  );
};

/** 6 · "By most estimates … about five million longhorns in Texas." The herd again, a pan, the count. */
const Millions: React.FC = () => {
  const a = at('By most estimates') - 1;
  const b = at("Here's the problem") - 1;
  return (
    <Pic src={HERD} size={HERD_SZ} k={[[a, 1100, 400, 1.55], [b, 600, 430, 1.5]]} filter="grayscale(1) sepia(0.15) contrast(1.1) brightness(0.62)" tag={HERD_TAG} tagY={1026}>
      {() => <>
        <Mono text="BY MOST ESTIMATES" x={130} y={150} size={30} at={at('most estimates') - 1} />
        <Counter to={5000000} at={at('five million', 2) - 2} dur={22} x={130} y={230} size={150} color="#f4efe6" prefix="≈ " />
        <Label text="LONGHORNS IN TEXAS" x={140} y={410} size={36} at={at('longhorns') - 1} />
      </>}
    </Pic>
  );
};

// ---------------------------------------------------------------------------------------------------------------- 2 · the gap

/** 7-8 · The price gap as a pair: one coin in Texas ≈ $4, a stack in Chicago ≈ $40. */
const Gap: React.FC<{chicago?: boolean}> = ({chicago}) => {
  const f = useCurrentFrame();
  const a = chicago ? at('In Chicago') - 1 : at("Here's the problem") - 1;
  const b = chicago ? at('Northern cities') - 1 : at('In Chicago') - 1;
  const sh = shake(f, chicago ? [at('In Chicago') + 6, at('forty') + 3] : [at('In Texas a steer') + 4, at('four dollars') + 3], 7);
  const z = chicago ? zkeys(f, [[a, 1.12], [b, 1.0]]) : zkeys(f, [[a, 1.0], [b, 1.12]]);
  const ox = chicago ? keys(f, [[a, 700], [b, 960]]) : keys(f, [[a, 960], [b, 600]]);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={chicago ? 12 : 18} z={1} lamp={[960, 560]}><div /></Desk3D>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: `${ox}px 600px`}}>
        <Prop src="img/props/p2_longhorn.jpg" m={M2.longhorn} x={120} y={250} w={560} at={chicago ? -99 : at("Here's the problem") + 6} />
        <Prop src="img/props/p2_coin_one.jpg" m={M2.coinOne} x={560} y={520} w={200} at={chicago ? -99 : at('In Texas a steer') + 1} rot={-6} />
        <PriceTag x={170} y={720} head="TEXAS · A STEER" value="≈ $4" at={chicago ? -99 : at('four dollars') + 1} rot={-3} />
        {chicago && <>
          <Prop src="img/props/p2_coin_stack.jpg" m={M2.coinStack} x={1300} y={300} w={380} at={at('In Chicago') + 4} rot={3} tint={0.45} traceAt={at('forty') + 2} />
          <PriceTag x={1220} y={720} head="CHICAGO · SAME STEER" value="≈ $40" at={at('forty') + 1} rot={2} w={500} color="#FF6F61" />
          <Arrow x1={660} y1={830} x2={1180} y2={830} bow={-60} at={at('forty') + 8} dur={8} />
          <Note text="× 10" x={860} y={680} size={70} rot={-4} at={at('forty') + 14} color="#ffffff" />
        </>}
      </div>
      {!chicago && <>
        <SlapTitle text="THE PROBLEM" x={110} y={80} size={100} at={at('problem') + 1} seed={33} />
        <Note text="if you could find anyone with $4" x={760} y={380} size={56} rot={-3} at={at('if you could') - 2} color="#ffffff" />
      </>}
    </AbsoluteFill>
  );
};

/** 9 · "Northern cities were hungry for beef. So, why not just take the cattle north?" */
const North: React.FC = () => {
  const a = at('Northern cities') - 1;
  const ks = [{f: a, x: 3000, y: 1600, z: 0.36, tilt: 34, rot: 2}, {f: at("That's where the railroad") + 4, x: 2950, y: 1550, z: 0.32, tilt: 40, rot: 0}];
  const why = at('So why not') - 1;
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MState api={api} name="Texas" at={-99} k={0.8} />
          <MPin api={api} at={TPL.chicago} show={a + 4} label="Chicago" sub="AND THE CITIES EAST" size={54} color="#ffffff" />
          <MCattle api={api} at={-99} center={[2640, 2180]} n={8} spread={260} w={56} seed="n2" />
          <MRoute api={api} pts={[TPL.sanAntonio, [2950, 1700], TPL.chicago]} at={why + 6} dur={22} color="#ffffff" dashed ties={false} width={6} />
        </>}
      </WestMap>
      <Hand parts={[['northern cities: '], ['hungry for beef', '#ffffff']]} x={120} y={100} size={70} at={at('hungry for beef') - 2} />
      <Hand parts={[['why not walk them north?']]} x={160} y={230} size={70} at={at('take the cattle') - 2} />
      <ScrimTag text={MAPTAG} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------- 3 · the railroad

/** 10 · "That's where the railroad comes in. Remember the rail lines from last time?" Ep 1's lines on the series map. */
const RailEp1: React.FC = () => {
  const a = at("That's where the railroad") - 1;
  const ks = [{f: a, x: 2000, y: 1250, z: 0.34, tilt: 36, rot: -2}, {f: at('One of them') + 4, x: 2200, y: 1300, z: 0.4, tilt: 42, rot: 0}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MRoute api={api} pts={LINES.cp} at={at('rail lines') - 4} dur={18} width={7} color="#2FE0C4" ties={false} />
          <MRoute api={api} pts={LINES.up} at={at('rail lines') - 2} dur={18} width={7} color="#2FE0C4" ties={false} />
          <MPin api={api} at={PL.promontory} show={at('from last time') - 2} label="Promontory, 1869" size={40} />
        </>}
      </WestMap>
      <SlapTitle text="THE RAILROAD" x={120} y={80} size={104} at={at('railroad') + 2} seed={35} />
      <Note text="from Episode 1" x={150} y={240} size={58} rot={-3} at={at('from last time') - 2} />
      <ScrimTag text={MAPTAG} />
    </AbsoluteFill>
  );
};

/** 11 · "One of them was pushing west across Kansas": the Kansas Pacific draws on in coral. */
const RailKansas: React.FC = () => {
  const a = at('One of them') - 1;
  const ks = [{f: a, x: 2700, y: 1350, z: 0.62, tilt: 46, rot: -3}, {f: at('In 1867') + 4, x: 2620, y: 1340, z: 0.74, tilt: 50, rot: 1}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MState api={api} name="Kansas" at={a + 2} color="#2FE0C4" k={0.6} />
          <MRoute api={api} pts={LINES.up} at={-99} width={6} color="#2FE0C4" ties={false} opacity={0.6} />
          <MRoute api={api} pts={[...TLINES.kansasPacific].reverse()} at={at('pushing west') - 2} dur={30} width={9} />
          <MPin api={api} at={TPL.kansasCity} show={a + 4} label="Kansas City" size={44} color="#ffffff" />
        </>}
      </WestMap>
      <Mono text="THE KANSAS PACIFIC · PUSHING WEST" x={130} y={110} size={30} at={at('pushing west')} color="#FF6F61" />
      <ScrimTag text={MAPTAG} />
    </AbsoluteFill>
  );
};

/** 12 · "In 1867, a cattle dealer from Illinois named Joseph McCoy": his book's frontispiece, McCoy in coral. */
const McCoy: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('In 1867') - 1;
  const b = at('picked a tiny') - 1;
  const sh = shake(f, [a + 6], 8);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={keys(f, [[a, 20], [b, 12]])} z={zkeys(f, [[a, 0.98], [b, 1.08]])} x={keys(f, [[a, -60], [b, -140]])} lamp={[760, 520]}>
        <div />
      </Desk3D>
      <Bust src={MCCOY} size={MCCOY_SZ} m={M2.mccoy} x={380} y={110} w={540} at={a + 3} tint={0.4} tintAt={at('Joseph McCoy')} traceAt={at('Joseph McCoy') + 2} rot={-2} />
      <Big text="1867" x={1180} y={140} size={170} at={at('In 1867') + 2} color="#FF9F1C" />
      <Mono text="JOSEPH McCOY" x={1190} y={380} size={40} at={at('Joseph McCoy') - 1} color="#FF6F61" />
      <Note text="a cattle dealer from Illinois" x={1060} y={470} size={48} rot={-3} at={at('cattle dealer') - 2} />
      <ScrimTag text={`${BOOK_TAG} (frontispiece)`} />
    </AbsoluteFill>
  );
};

/** 13 · "picked a tiny stop on that line called Abilene": McCoy's own plate of Abilene in 1867. */
const Abilene: React.FC = () => {
  const a = at('picked a tiny') - 1;
  const b = at('He later described') - 1;
  return (
    <CropCam src={ABI} size={ABI_SZ} win={[200, 190, 2640, 1640]} k={[[a, 1400, 900, 0.8], [b, 1250, 950, 1.05]]} filter={ENGR} tag={`${BOOK_TAG}, p. 46`} tagY={1026}>
      {(S) => {
        const [hx, hy] = S(1110, 900);
        return <>
          <SlapTitle text="ABILENE, KANSAS" x={110} y={80} size={96} at={at('Abilene') + 1} seed={37} />
          <Note text="a tiny stop on the line" x={1080} y={230} size={54} rot={-3} at={at('tiny stop') - 2} />
          <Loop cx={hx} cy={hy} rx={150} ry={80} at={at('Abilene') + 6} seed={63} tilt={-4} width={6} />
        </>;
      }}
    </CropCam>
  );
};

/** 14 · "He later described it as about a dozen log huts." His page, focus pulled to the line, coral swipe. */
const LogHuts: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('He later described') - 1;
  const b = at('McCoy built') - 1;
  return (
    <AbsoluteFill>
      <Desk3D tilt={keys(f, [[a, 16], [b, 10]])} z={zkeys(f, [[a, 1.0], [b, 1.06]])} lamp={[960, 520]}><div /></Desk3D>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${zkeys(f, [[a, 0.96], [b, 1.04]])})`, transformOrigin: '960px 560px'}}>
        <Clip src={PAGE} size={PAGE_SZ} x={180} y={200} w={1560} h={640} sx0={170} sy0={1330} scale={1.0} rot={-1} at={a + 2}
          band={[1595, 1725]} pullAt={a + 12} swipes={[[695, 1630, 1645], [215, 1693, 1240]]} swipeAt={at('dozen') - 8} dur={18} lineH={56} />
      </div>
      <Mono text="McCOY, HISTORIC SKETCHES OF THE CATTLE TRADE, 1874 · P. 44" x={200} y={110} size={26} at={a + 6} />
      <Hand parts={[['"about one dozen '], ['log huts', '#FF6F61'], ['"']]} x={420} y={900} size={70} at={at('log huts') - 2} />
      <ScrimTag text={BOOK_TAG} />
    </AbsoluteFill>
  );
};

/** 15 · "McCoy built pens, a hotel and a shipping yard": Gardner's 1867 stereo halves on the desk. */
const Built: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('McCoy built') - 1;
  const b = at('and sent word') - 1;
  const sh = shake(f, [at('pens') + 3, at('a hotel') + 3], 7);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={keys(f, [[a, 24], [b, 16]])} z={zkeys(f, [[a, 0.86], [b, 0.92]])} rotZ={keys(f, [[a, 2], [b, -1]])}>
        <Lift x={160} y={200} w={820} hgt={820 * (1190 / 1220)} h={8} at={at('pens') + 1} rot={-3} seed={71}>
          <TornPrint src={YARD} size={STEREO_SZ} x={0} y={0} w={820} crop={[220, 130, 1440, 1320]} at={-99} seed={72} real grey shadow={5} filter={ENGR} />
        </Lift>
        <Lift x={1100} y={160} w={820} hgt={820 * (1170 / 1210)} h={12} at={at('a hotel') + 1} rot={3} seed={73}>
          <TornPrint src={HOTEL} size={STEREO_SZ} x={0} y={0} w={820} crop={[230, 120, 1440, 1290]} at={-99} seed={74} real grey shadow={5} filter={ENGR} />
        </Lift>
      </Desk3D>
      <Hand parts={[['pens']]} x={180} y={120} size={78} at={at('pens') - 2} />
      <Hand parts={[['a hotel', '#ffffff']]} x={1240} y={100} size={78} at={at('a hotel') - 2} />
      <Hand parts={[['+ a shipping yard']]} x={260} y={880} size={78} at={at('shipping yard') - 2} />
      <ScrimTag text={GARDNER_TAG} x={34} y={24} />
    </AbsoluteFill>
  );
};

/** 16 · "and sent word to Texas. Bring your cattle here." Leslie's 1871: the cattle shoot at Abilene. */
const Word: React.FC = () => {
  const a = at('and sent word') - 1;
  const b = at('So stack it up') - 1;
  return (
    <Pic src={SHOOT} size={SHOOT_SZ} k={[[a, 700, 480, 1.3], [b, 820, 470, 1.42]]} filter={ENGR} tag={SHOOT_TAG} tagY={1026}>
      {() => <>
        <Note text="word sent to Texas:" x={120} y={110} size={56} rot={-3} at={at('sent word') - 2} />
        <Hand parts={[['"Bring your cattle '], ['here', '#FF6F61'], ['."']]} x={140} y={210} size={88} at={at('Bring your') - 2} dur={14} />
      </>}
    </Pic>
  );
};

// ---------------------------------------------------------------------------------------------------------------- 4 · the stack

/** 17-18 · "So, stack it up." Three lines of bare handwriting, then "That means a cow became a ticket" (the stock car rolls). */
const Stack: React.FC<{means?: boolean}> = ({means}) => {
  const f = useCurrentFrame();
  const a = at('So stack it up') - 1;
  const m = at('That means') - 1;
  const b = at('And you didnt') - 1;
  const z = means ? zkeys(f, [[m, 1.0], [b, 1.06]]) : zkeys(f, [[a, 1.06], [m, 1.0]]);
  const roll = keys(f, [[at('became') - 2, -1100], [at('ticket') + 4, 0]]);
  return (
    <AbsoluteFill>
      <Desk3D tilt={means ? 8 : 14} z={1} lamp={[900, 480]}><div /></Desk3D>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: means ? '900px 700px' : '600px 300px'}}>
        <Lines x={160} y={means ? 60 : 200} gap={means ? 70 : 100} size={means ? 46 : 66} rows={[
          {text: 'cheap cows in Texas', at: means ? -99 : at('Cheap cows') - 2},
          {text: 'hungry cities in the North', at: means ? -99 : at('Hungry cities') - 2},
          {text: 'a railroad in between', at: means ? -99 : at('A railroad in') - 2, color: '#ffffff'},
        ]} />
        {means && <>
          <Hand parts={[['that means:', '#ffffff']]} x={160} y={330} size={64} at={at('That means') - 2} />
          <Hand parts={[['a cow became a '], ['ticket', '#FF6F61']]} x={220} y={440} size={104} at={at('a cow became') - 2} dur={16} />
          <div style={{position: 'absolute', inset: 0, transform: `translateX(${roll}px)`}}>
            <Prop src="img/props/p2_stock_car.jpg" m={M2.stockCar} x={900} y={720} w={760} at={at('became') - 2} shadow />
          </div>
        </>}
      </div>
      {!means && <>
        <SlapTitle text="STACK IT UP" x={150} y={50} size={84} at={a + 2} seed={53} />
        <Prop src="img/props/p2_longhorn.jpg" m={M2.longhorn} x={160} y={600} w={440} at={a + 8} />
        <Prop src="img/props/p2_coin_one.jpg" m={M2.coinOne} x={520} y={800} w={120} at={at('Cheap cows') + 3} rot={-8} />
        <Prop src="img/props/p2_coin_stack.jpg" m={M2.coinStack} x={800} y={560} w={230} at={at('Hungry cities') - 1} rot={3} />
        <Label text="$40 IN CHICAGO" x={780} y={920} size={26} at={at('Hungry cities') + 2} />
        <div style={{position: 'absolute', left: 1160, top: 520, width: 520, height: 300}}>
          <TornPrint src={YARD} size={STEREO_SZ} x={0} y={0} w={480} crop={[220, 130, 1440, 1320]} at={at('A railroad in') - 1} seed={57} real grey shadow={6} filter={ENGR} rot={3} />
        </div>
      </>}
    </AbsoluteFill>
  );
};

/** 19 · "And you didn't even need to own land to feed them." Harper's 1874: guarding the herd on open grass. */
const NoLand: React.FC = () => {
  const a = at('And you didnt') - 1;
  const b = at('Most of the Plains') - 1;
  return (
    <Pic src={GUARD} size={GUARD_SZ} k={[[a, 900, 450, 1.35], [b, 760, 480, 1.3]]} filter={ENGR} tag={GUARD_TAG} tagY={1026}>
      {() => <Hand parts={[['no need to '], ['own the land', '#ffffff']]} x={760} y={110} size={74} at={at('own land') - 3} />}
    </Pic>
  );
};

/** 20 · Open range: the Plains lit on the series map, the definition. */
const OpenRange: React.FC = () => {
  const a = at('Most of the Plains') - 1;
  const ks = [{f: a, x: 2300, y: 1250, z: 0.33, tilt: 32, rot: 2}, {f: at('All you had') + 4, x: 2350, y: 1350, z: 0.38, tilt: 40, rot: -1}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          {PLAINS.map((s, i) => <MState key={s} api={api} name={s} at={a + 3 + i} color="#2FE0C4" k={0.75} />)}
          <MCattle api={api} at={at('graze') - 6} center={[2300, 1150]} n={14} spread={560} w={52} seed="or" per={1} />
        </>}
      </WestMap>
      <SlapTitle text="OPEN RANGE" x={120} y={80} size={110} at={at('open range') + 1} seed={39} />
      <Definition term="open range" def="public land with no fences, where anyone's cattle could graze for free" at={at('public land') - 2} x={120} y={820} w={1500} />
      <ScrimTag text={MAPTAG} x={34} y={24} />
    </AbsoluteFill>
  );
};

/** 21 · "All you had to do was walk them to the railroad. About a thousand miles." The walk, a longhorn on it; held into the tail. */
const Walk: React.FC = () => {
  const a = at('All you had') - 1;
  const w = at('walk them') - 2;
  const ks = [{f: a, x: 2700, y: 1950, z: 0.5, tilt: 44, rot: -3}, {f: at('About a thousand') + 6, x: 2700, y: 1800, z: 0.45, tilt: 40, rot: 0}, {f: END + 60, x: 2700, y: 1780, z: 0.43, tilt: 38, rot: 1}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MState api={api} name="Texas" at={-99} k={0.5} />
          <MRoute api={api} pts={[...TLINES.kansasPacific].reverse()} at={-99} width={8} />
          <MPin api={api} at={TPL.sanAntonio} show={a + 3} label="San Antonio" side="l" size={44} color="#ffffff" />
          <MPin api={api} at={TPL.abilene} show={a + 5} label="Abilene" size={50} color="#FF6F61" />
          <MTrail api={api} pts={TLINES.chisholm} at={w} dur={60} color="#ffffff" width={8} />
          <MHerd api={api} pts={TLINES.chisholm} at={w} dur={60} w={80} />
        </>}
      </WestMap>
      <Hand parts={[['walk them to the railroad']]} x={120} y={100} size={70} at={at('walk them') - 2} />
      <Hand parts={[['≈ 1,000 miles', '#ffffff']]} x={170} y={220} size={96} at={at('thousand miles') - 2} />
      <ScrimTag text={MAPTAG} />
    </AbsoluteFill>
  );
};

const sfx = (): SfxRow[] => {
  const c = (w: string) => at(w) - 1;
  const W = (w: string) => at(w) - 4;
  return [
    [4, 'block_tap_soft', 0.12], [W('a man with'), 'marker_tick', 0.2], [W('five million'), 'marker_tick', 0.2], [at('cows') + 2, 'paper_slap_soft', 0.25],
    [c('Here are the cows'), 'whoosh', 0.2],
    [c('Texas 1865') - 4, 'whip_soft', 0.22], [at('Texas 1865') + 2, 'stamp', 0.22], [W('war is over'), 'marker_tick', 0.2],
    [c('Confederate'), 'whoosh', 0.2], [c('Confederate') + 5, 'block_tap_soft', 0.15], [W('soldiers'), 'marker_tick', 0.2], [W('almost no money'), 'marker_tick', 0.2],
    [c('But their cattle'), 'whoosh', 0.2], [c('But their cattle') + 4, 'paper_slap_soft', 0.25], [W('run wild'), 'marker_tick', 0.2], [at('multiplied') - 5, 'marker_tick', 0.2],
    [c('By most estimates'), 'whoosh', 0.2], [at('five million', 2) - 2, 'block_tap_soft', 0.15],
    [c("Here's the problem") - 4, 'whip_soft', 0.22], [at('problem') + 1, 'stamp', 0.22], [at('In Texas a steer') + 2, 'paper_slap_soft', 0.22], [at('four dollars') + 1, 'stamp', 0.18], [W('if you could'), 'marker_tick', 0.2],
    [c('In Chicago'), 'whoosh', 0.18], [at('In Chicago') + 5, 'paper_slap_soft', 0.25], [at('forty') + 1, 'stamp', 0.2], [at('forty') + 12, 'marker_tick', 0.2],
    [c('Northern cities') - 4, 'whip_soft', 0.22], [W('hungry for beef'), 'marker_tick', 0.2], [W('take the cattle'), 'marker_tick', 0.2],
    [c("That's where the railroad") - 4, 'whip_soft', 0.22], [at('railroad') + 2, 'stamp', 0.22], [W('from last time'), 'marker_tick', 0.2],
    [c('One of them'), 'whoosh', 0.2], [at('pushing west') - 2, 'train_distant', 0.12],
    [c('In 1867'), 'whoosh', 0.2], [c('In 1867') + 4, 'paper_slap_soft', 0.25], [at('In 1867') + 2, 'stamp', 0.18], [W('cattle dealer'), 'marker_tick', 0.2],
    [c('picked a tiny'), 'whoosh', 0.2], [at('Abilene') + 1, 'stamp', 0.22], [W('tiny stop'), 'marker_tick', 0.2],
    [c('He later described'), 'whoosh', 0.2], [c('He later described') + 3, 'page_turn', 0.4], [W('log huts'), 'marker_tick', 0.2],
    [c('McCoy built'), 'whoosh', 0.18], [at('pens') + 2, 'paper_slap_soft', 0.25], [at('a hotel') + 2, 'paper_slap_soft', 0.22], [W('pens'), 'marker_tick', 0.2], [W('a hotel'), 'marker_tick', 0.2], [W('shipping yard'), 'marker_tick', 0.2],
    [c('and sent word') - 4, 'whip_soft', 0.2], [W('sent word'), 'marker_tick', 0.2], [W('Bring your'), 'marker_tick', 0.2],
    [c('So stack it up'), 'whoosh', 0.2], [W('Cheap cows'), 'marker_tick', 0.2], [W('Hungry cities'), 'marker_tick', 0.2], [W('A railroad in'), 'marker_tick', 0.2],
    [W('That means'), 'marker_tick', 0.2], [W('a cow became'), 'marker_tick', 0.2], [at('became'), 'card_slide_soft', 0.22],
    [c('And you didnt') - 4, 'whip_soft', 0.2], [W('own land'), 'marker_tick', 0.2],
    [c('Most of the Plains'), 'whoosh', 0.2], [at('open range') + 1, 'stamp', 0.22],
    [c('All you had') - 4, 'whip_soft', 0.22], [W('walk them'), 'marker_tick', 0.2], [W('thousand miles'), 'marker_tick', 0.2],
  ];
};

const Body: React.FC = () => {
  const shots: [number, React.ReactNode, ('whip' | 'cut')?][] = [
    [0, <LastTime />],
    [at('Here are the cows') - 1, <HereCows />, 'cut'],
    [at('Texas 1865') - 1, <Texas65 />, 'whip'],
    [at('Confederate') - 1, <NoMoney />, 'cut'],
    [at('But their cattle') - 1, <Wild />, 'cut'],
    [at('By most estimates') - 1, <Millions />, 'cut'],
    [at("Here's the problem") - 1, <Gap />, 'whip'],
    [at('In Chicago') - 1, <Gap chicago />, 'cut'],
    [at('Northern cities') - 1, <North />, 'whip'],
    [at("That's where the railroad") - 1, <RailEp1 />, 'whip'],
    [at('One of them') - 1, <RailKansas />, 'cut'],
    [at('In 1867') - 1, <McCoy />, 'cut'],
    [at('picked a tiny') - 1, <Abilene />, 'cut'],
    [at('He later described') - 1, <LogHuts />, 'cut'],
    [at('McCoy built') - 1, <Built />, 'cut'],
    [at('and sent word') - 1, <Word />, 'whip'],
    [at('So stack it up') - 1, <Stack />, 'cut'],
    [at('That means') - 1, <Stack means />, 'cut'],
    [at('And you didnt') - 1, <NoLand />, 'whip'],
    [at('Most of the Plains') - 1, <OpenRange />, 'cut'],
    [at('All you had') - 1, <Walk />, 'whip'],
  ];
  return (
    <>
      <WShots shots={shots} />
      <Sounds list={sfx()} />
    </>
  );
};

const RAIL = at("That's where the railroad");
export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_four_dollar_cows.wav" lead={LEAD} music={[
    {src: 'music/m_frontier.mp3', volume: bed('m_frontier'), to: RAIL + 6},
    {src: 'music/aw_iron_horse.mp3', volume: bed('aw_iron_horse'), from: RAIL - 6},
  ]}>
    <Body />
  </ChapterShell>
);
