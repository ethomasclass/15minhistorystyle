// Chapter 2 · 1862. The empty seats in Congress, the deadlock over the West, three laws in one year, the Greater
// Reconstruction, then the deal: two companies, land grants (the 3D township and the Act), loans by the mile (the ribbon),
// "That means…", and the race.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch02_1862.words.json';
import {clamp} from '../lib/anim';
import {Note, useGFrame} from '../kit/Kit';
import {Sfx} from '../kit/common';
import {ChapterShell, chapterFrames, Definition, hasFile, LEAD, makeTimeline, type Narration} from '../kit/shell';
import {CircleMount, CutOut, Desk3D, HingeYear, keys, Lift, Mono, PhotoCam, ScrimTag, shake, Shots, SlapTitle, TornPrint, zkeys} from '../kit/west';
import {IMG, SZ} from '../samples/masks';
import {M2} from '../masks_ch02';
import {ACT_H, ACT_LINE_Y, ACT_W, ActPage, BondKey, Hand, House, HOUSE_EMPTY, HOUSE_SEATS, LINES, MCross, MPin, MRoute, PL, Ribbon, RMI, RX, subLine, Township, townshipTaps, TownLegend, WestMap} from '../kit/ch01_extra';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);
const T = makeTimeline(N, 30);
const at = T.at;
const END = T.frames;

const DOME: [number, number] = [2420, 2260];
const RUINS: [number, number] = [1752, 1440];
const SOULE: [number, number] = [1890, 1314];
const HOME: [number, number] = [3840, 5239];
const MORRILL: [number, number] = [1920, 2680];
const BORONDA: [number, number] = [538, 800];
const EXODUS: [number, number] = [3840, 2829];
const MAPTAG = 'Map: Natural Earth outlines (today\'s state lines for reference); routes simplified, approx.';

/** 1 · "Washington, 1862." The Capitol with its dome half built. */
const Washington: React.FC = () => {
  const f = useCurrentFrame();
  const b = at('The Civil War') - 1;
  return (
    <AbsoluteFill>
      <PhotoCam src="img/ch02/capitol_dome_1861.jpg" size={DOME} cx={keys(f, [[0, 1210], [b, 1210]])} cy={keys(f, [[0, 1000], [b, 820]])} s={zkeys(f, [[0, 0.62], [b, 0.7]])} />
      <SlapTitle text="WASHINGTON, 1862" x={110} y={850} size={100} at={at('Washington') + 2} seed={12} />
      <ScrimTag text="John Wood, the Capitol dome under construction, May 9, 1861 · Library of Congress" x={34} y={24} />
    </AbsoluteFill>
  );
};

/** 2 · The House as a drawing: the chairs fill in, then the seceded states' share empties (wide). */
const HouseWide: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('The Civil War') - 1;
  const b = at('The Southern') - 1;
  return (
    <AbsoluteFill>
      <Desk3D tilt={keys(f, [[a, 4], [b, 10]])} z={1} lamp={[960, 640]}><div /></Desk3D>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${zkeys(f, [[a, 0.92], [b, 1.0]])})`, transformOrigin: '960px 820px'}}>
        <House cx={960} cy={930} s={1.1} at={a + 4} emptyAt={at('empty') - 2} />
      </div>
      <Mono text="U.S. HOUSE OF REPRESENTATIVES · 1862" x={110} y={80} size={26} at={a + 4} />
      <Note text="the war's second year" x={110} y={150} size={52} rot={-3} at={at('second year') - 2} color="#ffffff" />
      <Note text="empty seats" x={1380} y={150} size={62} rot={-3} at={at('empty') - 2} color="#FF6F61" />
    </AbsoluteFill>
  );
};

/** 3 · Cut-in: the empty wedge, labelled; a push along it. */
const HouseDetail: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('The Southern') - 1;
  const b = at('For years') - 1;
  return (
    <AbsoluteFill>
      <Desk3D tilt={keys(f, [[a, 10], [b, 6]])} z={1} lamp={[1300, 600]}><div /></Desk3D>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${zkeys(f, [[a, 1.75], [b, 1.95]])})`, transformOrigin: `${keys(f, [[a, 1420], [b, 1480]])}px 760px`}}>
        <House cx={960} cy={930} s={1.1} at={-99} emptyAt={-99} />
      </div>
      <Mono text={`SEATS OF THE STATES THAT LEFT · ≈ ${HOUSE_EMPTY} OF ${HOUSE_SEATS}`} x={110} y={90} size={26} at={a + 6} color="#FF6F61" />
      <Note text="they went with them" x={120} y={170} size={58} rot={-3} at={at('members went') - 2} />
      <ScrimTag text="Diagram · seats by the 1850 apportionment, approx." />
    </AbsoluteFill>
  );
};

/** 4-6 · The deadlock: two proposed routes on the map, both crossed out, then the land question. */
const Deadlock: React.FC = () => {
  const a = at('For years') - 1;
  const ks = [{f: a, x: 2150, y: 1500, z: 0.36, tilt: 40, rot: 0}, {f: at('Where would') - 1, x: 2050, y: 1500, z: 0.4, tilt: 44, rot: -2}];
  const n = at('North') - 2;
  const s = at('South') - 2;
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MRoute api={api} pts={LINES.north} at={n} dur={16} color="#2FE0C4" dashed width={7} />
          <MRoute api={api} pts={LINES.south} at={s} dur={16} color="#ffffff" dashed width={7} />
          <MPin api={api} at={LINES.north[0]} show={n} label="a northern route" side="l" size={48} color="#2FE0C4" />
          <MPin api={api} at={LINES.south[0]} show={s} label="a southern route" side="l" size={48} color="#ffffff" />
          <MCross api={api} at={LINES.north[5]} show={at('blocked') + 2} r={50} />
          <MCross api={api} at={LINES.south[4]} show={at('blocked') + 6} r={50} />
        </>}
      </WestMap>
      <SlapTitle text="DEADLOCK" x={110} y={80} size={100} at={at('blocked')} seed={17} />
      <Note text="North vs. South, 1850s" x={120} y={230} size={50} rot={-3} at={at('before the war') - 2} color="#ffffff" />
      <ScrimTag text={MAPTAG} />
    </AbsoluteFill>
  );
};

const Questions: React.FC = () => {
  const a = at('Where would') - 1;
  const ks = [{f: a, x: 1700, y: 1250, z: 0.55, tilt: 48, rot: -6}, {f: at('With the South') - 1, x: 1900, y: 1150, z: 0.62, tilt: 50, rot: -2}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MRoute api={api} pts={LINES.north} at={-99} color="#2FE0C4" dashed width={6} opacity={0.6} />
          <MRoute api={api} pts={LINES.south} at={-99} color="#ffffff" dashed width={6} opacity={0.6} />
        </>}
      </WestMap>
      <Hand parts={[['where would the railroad run?']]} x={150} y={110} size={74} at={at('Where would') - 2} dur={14} />
      <Hand parts={[['who gets the new land?']]} x={190} y={250} size={74} at={at('Who would get') - 2} dur={12} />
      <Hand parts={[['slave', '#FF6F61'], [' or ', '#ffffff'], ['free?']]} x={230} y={390} size={84} at={at('Slave') - 2} dur={10} />
      <ScrimTag text={MAPTAG} />
    </AbsoluteFill>
  );
};

/** 7 · "With the South gone": the empty chairs drop away; the House gets to work. */
const SouthGone: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('With the South') - 1;
  const b = at('In one year') - 1;
  return (
    <AbsoluteFill>
      <Desk3D tilt={keys(f, [[a, 14], [b, 6]])} z={1} lamp={[960, 640]}><div /></Desk3D>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${zkeys(f, [[a, 1.0], [b, 0.9]])})`, transformOrigin: '960px 820px'}}>
        <House cx={960} cy={930} s={1.1} at={-99} emptyAt={-99} goneAt={at('gone') - 2} />
      </div>
      <Hand parts={[['stops arguing', '#ffffff']]} x={130} y={110} size={70} at={at('stops arguing') - 2} />
      <Hand parts={[['starts passing laws']]} x={170} y={230} size={70} at={at('starts passing') - 2} />
    </AbsoluteFill>
  );
};

/** 8 · The hinge year (wide), then 9 · the three laws land on the desk, then 10 · the Pacific Railway Act close. */
const Year: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('In one year') - 1;
  const b = at('The Homestead') - 1;
  const sh = shake(f, [at('one year') + 3], 9);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={keys(f, [[a, 20], [b, 12]])} z={zkeys(f, [[a, 0.95], [b, 1.02]])}><div /></Desk3D>
      <HingeYear year="1862" events={['THREE LAWS', 'ONE YEAR']} x={560} y={330} size={220} at={at('one year')} />
      <Note text="that remake the West" x={700} y={720} size={60} rot={-3} at={at('remake') - 2} />
    </AbsoluteFill>
  );
};

const LAW = 'grayscale(1) sepia(0.3) contrast(1.15) brightness(0.92)';
const Laws: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('The Homestead') - 1;
  const hm = at('Homestead') - 1;
  const mo = at('Morrill') - 1;
  const pr = at('Pacific Railway Act') - 1;
  const b = at('Remember that year') - 1;
  const sh = shake(f, [hm + 3, mo + 3, pr + 3], 7);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={keys(f, [[a, 24], [b, 16]])} z={zkeys(f, [[a, 0.82], [b, 0.9]])} x={keys(f, [[a, 120], [b, -120]])} y={30}>
        <Lift x={20} y={120} w={480} hgt={655} h={6} at={hm} rot={-4} seed={11}>
          <TornPrint src="img/ch02/homestead_act_p1.jpg" size={HOME} x={0} y={0} w={480} crop={[150, 150, 3700, 5000]} at={-99} seed={12} real grey shadow={5} filter={LAW}
            tapes={[{x: 170, y: -14, w: 140, rot: -4}]} />
        </Lift>
        <Lift x={600} y={150} w={480} hgt={665} h={8} at={mo} rot={2} seed={13}>
          <TornPrint src="img/ch02/morrill_act_p1.jpg" size={MORRILL} x={0} y={0} w={480} crop={[60, 60, 1860, 2560]} at={-99} seed={14} real grey shadow={5} filter={LAW}
            tapes={[{x: 170, y: -14, w: 140, rot: 3}]} />
        </Lift>
        <Lift x={1180} y={110} w={480} hgt={777} h={12} at={pr} rot={-2} seed={15}>
          <TornPrint src={IMG.act1} size={SZ.act} x={0} y={0} w={480} crop={[100, 60, 2000, 3135]} at={-99} seed={16} real grey shadow={5} filter={LAW}
            tapes={[{x: 170, y: -14, w: 140, rot: -3}]} />
        </Lift>
      </Desk3D>
      <SlapTitle text="HOMESTEAD ACT" x={70} y={800} size={60} at={hm + 2} seed={21} rot={-3} />
      <Note text="free farmland" x={110} y={890} size={50} rot={-3} at={at('farmland') - 3} />
      <SlapTitle text="MORRILL ACT" x={700} y={800} size={60} at={mo + 2} seed={22} rot={-2} />
      <Note text="colleges" x={740} y={890} size={50} rot={-3} at={at('colleges') - 3} />
      <SlapTitle text="PACIFIC RAILWAY ACT" x={1180} y={800} size={60} at={pr + 2} seed={23} rot={-2} />
      <Note text="a railroad to the Pacific" x={1210} y={890} size={50} rot={-3} at={at('builds a railroad') - 2} color="#FF6F61" />
      <ScrimTag text="Homestead Act (May 20, 1862) and Morrill Act (July 2, 1862), National Archives · Pacific Railway Act, Senate print, 1862 · LOC" x={34} y={24} />
    </AbsoluteFill>
  );
};

/** 11 · "Remember that year, 1862" (held, static). */
const Remember: React.FC = () => (
  <AbsoluteFill>
    <Desk3D tilt={12} z={1.02}><div /></Desk3D>
    <HingeYear year="1862" events={['HOMESTEAD ACT', 'MORRILL ACT', 'PACIFIC RAILWAY ACT']} x={150} y={300} size={220} at={at('Remember that year') - 1} />
    <Note text="remember this year" x={1080} y={250} size={70} rot={-4} at={at('Remember') + 2} />
    <Note text="(all three come back)" x={1130} y={380} size={54} rot={-3} at={at('All three') - 2} color="#ffffff" />
  </AbsoluteFill>
);

/** 12 · "the bigger idea behind this whole series": the whole West, a slow pull out. */
const BigIdea: React.FC = () => {
  const a = at("And here's the bigger") - 1;
  const ks = [{f: a, x: 1900, y: 1350, z: 0.42, tilt: 34, rot: 0}, {f: at('When people') - 1, x: 1950, y: 1350, z: 0.34, tilt: 40, rot: 3}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks} />
      <SlapTitle text="THE BIGGER IDEA" x={110} y={80} size={96} at={at('bigger idea') + 2} seed={25} />
      <Note text="the whole series" x={120} y={220} size={54} rot={-3} at={at('whole series') - 2} />
      <ScrimTag text={MAPTAG} />
    </AbsoluteFill>
  );
};

/** 13 · Reconstruction as people picture it: the South after the war. */
const SouthRuins: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('When people') - 1;
  const b = at('But out West') - 1;
  return (
    <AbsoluteFill>
      <PhotoCam src="img/ch02/richmond_ruins_1865.jpg" size={RUINS} cx={keys(f, [[a, 760], [b, 900]])} cy={760} s={zkeys(f, [[a, 0.8], [b, 0.86]])} />
      <SlapTitle text="RECONSTRUCTION" x={110} y={830} size={104} at={at('Reconstruction') + 1} seed={27} />
      <Note text="the South, after the war" x={1060} y={110} size={54} rot={-3} at={at('South after') - 2} color="#ffffff" />
      <ScrimTag text="Ruins of Richmond, Va., April 1865 (Brady studio) · National Archives" x={34} y={24} />
    </AbsoluteFill>
  );
};

/** 14 · Out West, the same question (bare handwriting over the map). */
const OutWest: React.FC = () => {
  const a = at('But out West') - 1;
  const ks = [{f: a, x: 1500, y: 1250, z: 0.5, tilt: 50, rot: 4}, {f: at('Only out there') - 1, x: 1750, y: 1250, z: 0.56, tilt: 46, rot: 0}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks} />
      <Mono text="OUT WEST: THE SAME QUESTION" x={150} y={110} size={26} at={at('same question') - 2} />
      <Hand parts={[['what does '], ['freedom', '#ffffff'], [' mean now,']]} x={150} y={190} size={84} at={at('what does') - 2} dur={14} />
      <Hand parts={[['and '], ['who gets it?', '#FF6F61']]} x={230} y={330} size={84} at={at('and who gets') - 2} dur={10} />
      <ScrimTag text={MAPTAG} />
    </AbsoluteFill>
  );
};

/** 15 · More people in the room: four groups in circle mounts (people stay in their own photographs). */
const ROOM = [
  {w: 'Native nations', src: 'img/ch02/soule_arapaho_camp_1870.jpg', size: SOULE, fx: 1000, fy: 960, s: 0.42, tag: 'W. S. Soule, Arapaho camp near Fort Dodge, Kan., 1870 · National Archives'},
  {w: 'Chinese immigrants', src: IMG.tunnel8, size: SZ.tunnel8, fx: 690, fy: 1480, s: 0.48, tag: 'A. A. Hart, Tunnel No. 8, 1865–69 · LOC'},
  {w: 'Mexican Americans', src: 'img/ch02/boronda_family.jpg', size: BORONDA, fx: 269, fy: 380, s: 0.62, tag: 'The Boronda family of Monterey County, Calif., 19th c. · Wikimedia Commons'},
  {w: 'Black families', src: 'img/ch02/leslies_exodus_1879.jpg', size: EXODUS, fx: 1250, fy: 1500, s: 0.2, tag: "Frank Leslie's Illustrated Newspaper, Exodus to Kansas via St. Louis, 1879 · Commons"},
];
const Room: React.FC<{close?: boolean}> = ({close}) => {
  const f = useCurrentFrame();
  const a = at('Only out there') - 1;
  const m = at('Mexican') - 1;
  const b = at('Historians') - 1;
  const ats = [at('Native') - 1, at('Chinese immigrants') - 1, at('Mexican') - 1, at('Black families') - 1];
  const z = close ? zkeys(f, [[m, 1.18], [b, 1.26]]) : zkeys(f, [[a, 1.06], [m, 1.0]]);
  const ox = close ? keys(f, [[m, 1100], [b, 1250]]) : 960;
  return (
    <AbsoluteFill>
      <Desk3D tilt={close ? 8 : 14} z={1} lamp={[960, 560]}><div /></Desk3D>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: `${ox}px 560px`}}>
        {ROOM.map((r, i) => {
          const cx = 300 + i * 440;
          const ok = !r.src.startsWith('img/ch02/') || hasFile(r.src);
          return (
            <React.Fragment key={r.w}>
              {ok ? <CircleMount src={r.src} size={r.size} cx={cx} cy={520} r={170} fx={r.fx} fy={r.fy} scale={r.s} at={ats[i]} />
                : <CircleMount src={IMG.redcloud} size={SZ.redcloud} cx={cx} cy={520} r={170} fx={1080} fy={1300} scale={0.2} at={ats[i]} />}
              <Note text={r.w} x={cx - 150} y={730} size={50} rot={-3} at={ats[i] + 3} />
            </React.Fragment>
          );
        })}
      </div>
      <Note text="more people in the room" x={600} y={100} size={64} rot={-3} at={close ? -99 : at('more people') - 2} color="#ffffff" />
      <ScrimTag text={ROOM.map((r) => r.tag.split(' · ')[0].split(',')[0]).join(' · ') + ' · sources: NARA, LOC, Commons'} />
    </AbsoluteFill>
  );
};

/** 16 · Greater Reconstruction: the term and its definition. */
const Greater: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Historians') - 1;
  const b = at('Okay') - 1;
  return (
    <AbsoluteFill>
      <Desk3D tilt={keys(f, [[a, 18], [b, 10]])} z={zkeys(f, [[a, 0.96], [b, 1.04]])}><div /></Desk3D>
      <SlapTitle text="GREATER RECONSTRUCTION" x={180} y={330} size={104} at={at('Greater') + 1} seed={29} />
      <Definition term="Greater Reconstruction" def="after the Civil War, the fight over freedom, land and citizenship, out West as well as in the South" at={at('Greater') + 10} x={200} y={540} w={1400} />
    </AbsoluteFill>
  );
};

/** 17 · "Okay. Back to the railroad. Here's the deal": the Act's title page slaps down. */
const Deal: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Okay') - 1;
  const b = at('Two companies') - 1;
  const sh = shake(f, [a + 6], 9);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={keys(f, [[a, 28], [b, 18]])} z={zkeys(f, [[a, 0.85], [b, 1.0]])} lamp={[900, 480]}>
        <Lift x={700} y={60} w={620} hgt={1004} h={10} at={a + 3} rot={3} seed={31}>
          <TornPrint src={IMG.act1} size={SZ.act} x={0} y={0} w={620} crop={[100, 60, 2000, 3135]} at={-99} seed={32} real grey shadow={6} filter={LAW}
            tapes={[{x: 230, y: -14, w: 160, rot: -3}]} />
        </Lift>
      </Desk3D>
      <SlapTitle text="THE DEAL" x={110} y={110} size={120} at={at('deal')} seed={33} />
      <ScrimTag text="Pacific Railway Act, 1862 (Senate Mis. Doc. 108, p. 1) · Library of Congress" />
    </AbsoluteFill>
  );
};

/** 18-19 · Two companies: the Union Pacific from Omaha (east), whip, the Central Pacific from Sacramento (west). */
const Companies: React.FC<{side: 'up' | 'cp'}> = ({side}) => {
  const up = side === 'up';
  const a = up ? at('Two companies') - 1 : at('The Central Pacific') - 1;
  const b = up ? at('The Central Pacific') - 1 : at('For every mile') - 1;
  const ks = up ? [{f: a, x: 2500, y: 1150, z: 0.62, tilt: 48, rot: 4}, {f: b, x: 2350, y: 1130, z: 0.72, tilt: 52, rot: 0}]
    : [{f: a, x: 1000, y: 1250, z: 0.72, tilt: 52, rot: -4}, {f: b, x: 1150, y: 1250, z: 0.66, tilt: 48, rot: 0}];
  const g = useGFrame();
  const go = at(up ? 'build west' : 'build east') - 2;
  const k = interpolate(g, [go, go + 30], [0, 0.22], clamp);
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          {!up && <MRoute api={api} pts={subLine(LINES.up, 0.22)} at={-99} color="#2FE0C4" width={7} ties={false} />}
          <MRoute api={api} pts={up ? LINES.up : LINES.cp} at={-99} prog={k} color={up ? '#2FE0C4' : '#FF6F61'} width={8} ties />
          <MPin api={api} at={up ? PL.omaha : PL.sacramento} show={at(up ? 'Omaha' : 'Sacramento') - 2} label={up ? 'Omaha' : 'Sacramento'} sub={up ? 'NEBRASKA' : 'CALIFORNIA'} side={up ? 'r' : 'l'} size={54}
            color={up ? '#2FE0C4' : '#FF6F61'} />
          {!up && <MPin api={api} at={PL.omaha} show={-99} label="" />}
        </>}
      </WestMap>
      {up ? <SlapTitle text="UNION PACIFIC" x={110} y={80} size={96} at={at('Union Pacific') + 2} seed={35} />
        : <SlapTitle text="CENTRAL PACIFIC" x={110} y={80} size={96} at={at('Central Pacific') + 2} seed={37} />}
      <Mono text={up ? '1 / 2 · BUILDS WEST' : '2 / 2 · BUILDS EAST'} x={120} y={220} size={28} at={up ? at('Two companies') + 6 : at('Central Pacific') + 6} />
      <ScrimTag text={MAPTAG} />
    </AbsoluteFill>
  );
};

/** 20 · The land grant: the 3D township, odd sections rising as the line passes. */
const Grant: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('For every mile') - 1;
  const b = at('land on both') - 1;
  return (
    <AbsoluteFill>
      <Township g0={a + 2} rail0={at('every mile')} z={zkeys(f, [[a, 0.84], [b, 1.0]])} tilt={keys(f, [[a, 58], [b, 52]])} rot={keys(f, [[a, -26], [b, -14]])} />
      <SlapTitle text="LAND GRANT" x={110} y={70} size={100} at={at('land grant') + 1} seed={31} />
      <Definition term="land grant" def="land the government gives away, here for every mile of track" at={at('land grant') + 10} x={110} y={210} w={1100} />
      <TownLegend />
    </AbsoluteFill>
  );
};

/** 21 · The Act on the desk: focus pull, coral swipe on Sec. 3's "every alternate section … odd numbers". */
const ActSwipe: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('land on both') - 1;
  const b = at('Plus loans') - 1;
  const sh = shake(f, [a + 3], 8);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={keys(f, [[a, 30], [b, 18]])} z={zkeys(f, [[a, 1.0], [b, 1.7]])} y={keys(f, [[a, 0], [b, 60]])} lamp={[900, 520]}>
        <Lift x={60} y={120} w={560} hgt={700} h={2} at={-99} rot={-6} blur={3} seed={4}>
          <TornPrint src={IMG.act1} size={SZ.act} x={0} y={0} w={560} crop={[100, 60, 2000, 2400]} at={-99} seed={9} real grey shadow={4} filter="grayscale(1) sepia(0.3) contrast(1.15) brightness(0.8)" />
        </Lift>
        <Lift x={520} y={540 - ACT_LINE_Y - 30} w={ACT_W} hgt={ACT_H} h={14} at={a + 1} rot={2} seed={6}>
          <ActPage pullAt={a + 14} swipeAt={at('checkerboard') - 6} />
        </Lift>
      </Desk3D>
      <SlapTitle text="EVERY ALTERNATE SECTION" x={110} y={60} size={72} at={a + 12} seed={33} />
      <Note text="a checkerboard: odd numbers to the railroad" x={700} y={880} size={50} rot={-3} at={at('checkerboard') + 4} />
      <ScrimTag text="Pacific Railway Act, 1862, Sec. 3 (Senate Mis. Doc. 108, p. 4) · Library of Congress" />
    </AbsoluteFill>
  );
};

/** 22-23 · Loans by the mile: the ribbon wide, then a push into the Sierra while the treble zones light. */
const LIT = (base: number) => [base, base + 12, at('bigger the loan') - 2, base + 12, base];
const progAt = (f: number, f0: number, f1: number, p0: number, p1: number) => interpolate(f, [f0, f1], [p0, p1], clamp);
const LoansWide: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Plus loans') - 1;
  const b = at('Mountains paid') - 1;
  const lit = LIT(at('harder the mile') - 2);
  const p = progAt(f, a, b, 0.0, 0.06);
  return (
    <AbsoluteFill>
      <Ribbon fx={RX(RMI) / 2 - 80} tilt={keys(f, [[a, 64], [b, 58]])} spin={keys(f, [[a, -12], [b, -5]])} z={zkeys(f, [[a, 0.9], [b, 0.97]])} dy={110} lit={lit}
        cpMi={690 * p} upMi={RMI - (RMI - 690) * p} />
      <Hand parts={[['+ loans: '], ['government bonds', '#ffffff']]} x={110} y={80} size={66} at={at('loans') - 2} />
      <Bonds at={at('bonds') - 2} />
      <BondKey ats={[lit[0], lit[1], lit[2]]} y={230} />
      <ScrimTag text="Elevations approx., heights exaggerated · bond rates: Pacific Railway Act, Sec. 11" />
    </AbsoluteFill>
  );
};
/** A stack of bonds (AI-lithograph prop, cut out) slapping onto the bottom right of the frame. */
const Bonds: React.FC<{at: number}> = ({at: s}) => {
  const f = useCurrentFrame();
  const sh = shake(f, [s + 4], 6);
  return (
    <div style={{position: 'absolute', inset: 0, transform: `translate(${sh.x}px, ${sh.y}px) rotate(-6deg)`, transformOrigin: '1500px 860px'}}>
      <CutOut src="img/ch02/ai_bonds_w.jpg" size={[1344, 768]} mask={M2.bonds} place={{left: 1150, top: 640, scale: 0.55}} at={s} filter="saturate(0.7) contrast(1.05)" />
    </div>
  );
};
const Mountains: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Mountains paid') - 1;
  const b = at('Land per mile') - 1;
  const lit = LIT(at('harder the mile') - 2);
  const p = progAt(f, a, b, 0.06, 0.1);
  return (
    <AbsoluteFill>
      <Ribbon fx={keys(f, [[a, RX(420)], [b, RX(130)]])} tilt={keys(f, [[a, 60], [b, 54]])} spin={keys(f, [[a, -14], [b, -18]])} z={zkeys(f, [[a, 1.2], [b, 1.7]])} dy={150} lit={lit}
        cpMi={690 * p} upMi={RMI - (RMI - 690) * p} />
      <BondKey ats={[-99, -99, -99]} y={60} />
      <Hand parts={[['mountain miles paid '], ['3×', '#FF6F61']]} x={1080} y={850} size={70} at={at('three times') - 2} />
      <ScrimTag text="Elevations approx., heights exaggerated · bond rates: Pacific Railway Act, Sec. 11" />
    </AbsoluteFill>
  );
};

/** 24-26 · The stack and "That means": bare handwriting on the desk, one line per beat; "long" in coral. */
const Stack: React.FC<{means?: boolean}> = ({means}) => {
  const f = useCurrentFrame();
  const a = at('Land per mile') - 1;
  const m = at('That means') - 1;
  const b = at('So it became') - 1;
  const z = means ? zkeys(f, [[m, 1.0], [b, 1.08]]) : zkeys(f, [[a, 1.08], [m, 1.0]]);
  return (
    <AbsoluteFill>
      <Desk3D tilt={means ? 8 : 14} z={1} lamp={[900, 480]}><div /></Desk3D>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: means ? '700px 700px' : '600px 300px'}}>
        <Hand parts={[['land per mile']]} x={160} y={means ? 70 : 140} size={means ? 52 : 80} at={means ? -99 : at('Land per') - 2} rot={-3} />
        <Hand parts={[['money per mile']]} x={200} y={means ? 140 : 270} size={means ? 52 : 80} at={means ? -99 : at('Money per') - 2} rot={-3} />
        <Hand parts={[['more money for '], ['hard', '#ffffff'], [' miles']]} x={240} y={means ? 210 : 400} size={means ? 52 : 80} at={means ? -99 : at('More money') - 2} rot={-3} />
        {means && <>
          <Hand parts={[['that means:', '#ffffff']]} x={160} y={340} size={64} at={at('That means') - 2} />
          <Hand parts={[['not paid for a '], ['good', '#ffffff'], [' railroad']]} x={220} y={460} size={78} at={at('weren\'t really') - 2} dur={14} />
          <Hand parts={[['paid for a '], ['long', '#FF6F61'], [' one, '], ['fast', '#ffffff']]} x={260} y={620} size={96} at={at('They were paid') - 2} dur={16} />
        </>}
      </div>
      {means && <StrikeGood at={at('good railroad') + 8} />}
    </AbsoluteFill>
  );
};
const StrikeGood: React.FC<{at: number}> = ({at: s}) => {
  const g = useGFrame();
  if (g < s) return null;
  const p = interpolate(g, [s, s + 5], [0, 1], clamp);
  return <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}><line x1={520} y1={548} x2={520 + 300 * p} y2={530} stroke="#FF6F61" strokeWidth={8} strokeLinecap="round" /></svg>;
};

/** 27 · "So it became a race." The ribbon, both engines moving; the title. */
const Race: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('So it became') - 1;
  const lit = [-99, -99, -99, -99, -99];
  const p = progAt(f, a, END + 50, 0.1, 0.24);
  return (
    <AbsoluteFill>
      <Ribbon fx={keys(f, [[a, X2(820)], [END + 60, X2(760)]])} tilt={keys(f, [[a, 56], [END + 60, 60]])} spin={keys(f, [[a, 6], [END + 60, 2]])} z={zkeys(f, [[a, 1.15], [END + 60, 0.95]])} dy={60} lit={lit}
        cpMi={690 * p} upMi={RMI - (RMI - 690) * p} />
      <SlapTitle text="THE RACE" x={110} y={80} size={130} at={at('race')} seed={45} />
      <ScrimTag text="Elevations approx., heights exaggerated" />
    </AbsoluteFill>
  );
};
const X2 = (mi: number) => RX(mi);

const Sounds: React.FC = () => {
  const c = (w: string) => at(w) - 1;
  const W = (w: string) => at(w) - 4;
  const sfx: [number, string, number][] = [
    [at('Washington') + 2, 'stamp', 0.22],
    [c('The Civil War'), 'whoosh', 0.22], [c('The Civil War') + 4, 'block_tap_soft', 0.12], [W('second year'), 'marker_tick', 0.2], [W('empty'), 'marker_tick', 0.2],
    [c('The Southern'), 'whoosh', 0.2], [W('members went'), 'marker_tick', 0.2],
    [c('For years') - 4, 'whip_soft', 0.25], [W('before the war'), 'marker_tick', 0.2], [at('blocked'), 'stamp', 0.22], [at('blocked') + 3, 'marker_tick', 0.18],
    [c('Where would'), 'whoosh', 0.2], [W('Where would'), 'marker_tick', 0.2], [W('Who would get'), 'marker_tick', 0.2], [W('Slave'), 'marker_tick', 0.2],
    [c('With the South'), 'whoosh', 0.2], [at('gone'), 'block_tap_soft', 0.12], [at('gone') + 5, 'block_tap_soft', 0.1], [W('stops arguing'), 'marker_tick', 0.2], [W('starts passing'), 'marker_tick', 0.2],
    [c('In one year'), 'whoosh', 0.2], [at('one year'), 'stamp', 0.22], [W('remake'), 'marker_tick', 0.2],
    [c('The Homestead') - 4, 'whip_soft', 0.22], [at('Homestead'), 'paper_slap_soft', 0.25], [at('Homestead') + 3, 'stamp', 0.18], [at('Morrill'), 'paper_slap_soft', 0.25], [at('Morrill') + 3, 'stamp', 0.18],
    [at('Pacific Railway Act'), 'paper_slap_soft', 0.25], [at('Pacific Railway Act') + 3, 'stamp', 0.2], [W('farmland'), 'marker_tick', 0.2], [W('colleges'), 'marker_tick', 0.2], [W('builds a railroad'), 'marker_tick', 0.2],
    [c('Remember that year'), 'whoosh', 0.2], [at('Remember that year'), 'stamp', 0.2], [at('Remember') - 2, 'marker_tick', 0.2], [W('All three'), 'marker_tick', 0.2],
    [c("And here's the bigger") - 4, 'whip_soft', 0.22], [at('bigger idea') + 2, 'stamp', 0.2], [W('whole series'), 'marker_tick', 0.2],
    [c('When people'), 'whoosh', 0.2], [at('Reconstruction') + 1, 'stamp', 0.22], [W('South after'), 'marker_tick', 0.2],
    [c('But out West') - 4, 'whip_soft', 0.22], [W('what does'), 'marker_tick', 0.2], [W('and who gets'), 'marker_tick', 0.2],
    [c('Only out there'), 'whoosh', 0.2], [W('more people'), 'marker_tick', 0.2],
    [at('Native') - 1, 'card_slide_soft', 0.2], [at('Chinese immigrants') - 1, 'card_slide_soft', 0.2], [at('Mexican') - 1, 'card_slide_soft', 0.2], [at('Black families') - 1, 'card_slide_soft', 0.2],
    [c('Historians'), 'whoosh', 0.2], [at('Greater') + 1, 'stamp', 0.22],
    [c('Okay') - 4, 'whip_soft', 0.22], [at('Okay') + 2, 'paper_slap_soft', 0.25], [at('Okay') + 5, 'page_turn', 0.3], [at('deal'), 'stamp', 0.22],
    [c('Two companies') - 4, 'whip_soft', 0.22], [at('Union Pacific') + 2, 'stamp', 0.2], [at('Omaha') - 2, 'block_tap_soft', 0.15],
    [c('The Central Pacific') - 4, 'whip_soft', 0.25], [at('Central Pacific') + 2, 'stamp', 0.2], [at('Sacramento') - 2, 'block_tap_soft', 0.15],
    [c('For every mile'), 'whoosh', 0.2], [at('land grant') + 1, 'stamp', 0.22], ...townshipTaps(at('every mile')).map((x, i) => [x, 'block_tap_soft', i % 2 ? 0.1 : 0.14] as [number, string, number]),
    [c('land on both') - 4, 'whip_soft', 0.22], [at('land on both') + 2, 'paper_slap_soft', 0.25], [at('land on both') + 4, 'page_turn', 0.3], [W('checkerboard') + 8, 'marker_tick', 0.2],
    [c('Plus loans'), 'whoosh', 0.2], [W('loans'), 'marker_tick', 0.2], [at('bonds') - 2, 'paper_slap_soft', 0.25], [at('harder the mile') - 2, 'block_tap_soft', 0.15], [at('harder the mile') + 10, 'block_tap_soft', 0.15], [at('bigger the loan') - 2, 'block_tap_soft', 0.18],
    [c('Mountains paid') - 4, 'whip_soft', 0.22], [W('three times'), 'marker_tick', 0.2],
    [c('Land per mile'), 'whoosh', 0.2], [W('Land per'), 'marker_tick', 0.2], [W('Money per'), 'marker_tick', 0.2], [W('More money'), 'marker_tick', 0.2],
    [W('That means'), 'marker_tick', 0.2], [W("weren't really"), 'marker_tick', 0.2], [W('They were paid'), 'marker_tick', 0.2],
    [c('So it became') - 4, 'whip_soft', 0.22], [at('race'), 'stamp', 0.22], [at('race') + 3, 'spike_tap_distant', 0.15],
  ];
  return <>{sfx.map(([f, n, v], i) => <Sfx key={i} at={f} src={`sfx/${n}.wav`} volume={v} />)}</>;
};

const Body: React.FC = () => {
  const shots: [number, React.ReactNode, ('whip' | 'cut')?][] = [
    [0, <Washington />],
    [at('The Civil War') - 1, <HouseWide />, 'cut'],
    [at('The Southern') - 1, <HouseDetail />, 'cut'],
    [at('For years') - 1, <Deadlock />, 'whip'],
    [at('Where would') - 1, <Questions />, 'cut'],
    [at('With the South') - 1, <SouthGone />, 'cut'],
    [at('In one year') - 1, <Year />, 'cut'],
    [at('The Homestead') - 1, <Laws />, 'whip'],
    [at('Remember that year') - 1, <Remember />, 'cut'],
    [at("And here's the bigger") - 1, <BigIdea />, 'whip'],
    [at('When people') - 1, <SouthRuins />, 'cut'],
    [at('But out West') - 1, <OutWest />, 'whip'],
    [at('Only out there') - 1, <Room />, 'cut'],
    [at('Mexican') - 1, <Room close />, 'cut'],
    [at('Historians') - 1, <Greater />, 'cut'],
    [at('Okay') - 1, <Deal />, 'whip'],
    [at('Two companies') - 1, <Companies side="up" />, 'whip'],
    [at('The Central Pacific') - 1, <Companies side="cp" />, 'whip'],
    [at('For every mile') - 1, <Grant />, 'cut'],
    [at('land on both') - 1, <ActSwipe />, 'whip'],
    [at('Plus loans') - 1, <LoansWide />, 'cut'],
    [at('Mountains paid') - 1, <Mountains />, 'whip'],
    [at('Land per mile') - 1, <Stack />, 'cut'],
    [at('That means') - 1, <Stack means />, 'cut'],
    [at('So it became') - 1, <Race />, 'whip'],
  ];
  return (
    <>
      <Shots shots={shots} />
      <Sounds />
    </>
  );
};

const DEAL = at("Here's the deal");
export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_1862.wav" lead={LEAD} music={[
    {src: 'music/g_founding.mp3', volume: 0.15, to: DEAL + 6},
    {src: 'music/g_grip.mp3', volume: 0.15, from: DEAL - 6},
  ]}>
    <Body />
  </ChapterShell>
);
