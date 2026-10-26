// Chapter 3 · The Long Drive. The cattle-drives map is the spine: the Chisholm Trail (coral, a longhorn walking it) through
// Indian Territory to Abilene, the Western Trail to Dodge City, the Goodnight-Loving Trail west and up the Pecos (it stays lit),
// the Shawnee faint and unnamed. Then one drive in numbers, the crew as a drawn formation (boss, cook and wagon, the drag riders
// in the dust), the three things that could end a drive (1/3 · 2/3 · 3/3), five to ten million cattle, and the hand-off.
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch03_the_long_drive.words.json';
import {clamp} from '../lib/anim';
import {JF, Note, useGFrame} from '../kit/Kit';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration} from '../kit/shell';
import {bed} from '../kit/levels';
import {Big, Label, LITHO, Pic, Prop, Sounds, type SfxRow} from '../kit/ch04_extra';
import {Desk3D, keys, Lift, Mono, ScrimTag, shake, Shots, SlapTitle, TornPrint, zkeys} from '../kit/west';
import {Hand, MPin, MRoute, MStand, W_MAP, type WApi, WestMap} from '../kit/ch01_extra';
import {MHerd, MTrail, TLINES, TPL} from '../kit/trails';
import {CropCam, MCattle, MState, NumbersCard, ThreeCount} from '../kit/ch02_extra';
import {WShots} from '../kit/ch07_extra';
import {M3} from '../masks_ch03';

const N = words as Narration;
export const CH03_FRAMES = chapterFrames(N, LEAD);
const T = makeTimeline(N, 30);
const at = T.at;
const END = T.frames;

const MAPTAG = 'Map: Natural Earth outlines (today\'s state lines for reference); trails approx., after period trail maps';
const BOOK_TAG = 'J. G. McCoy, Historic Sketches of the Cattle Trade, 1874 · Newberry Library via Internet Archive';
const ENGR = 'grayscale(1) sepia(0.15) contrast(1.15) brightness(0.98)';
const ON_TRAIL = 'img/ch03/b_mccoy_herd_on_trail_1867.jpg';
const STAMPEDE = 'img/ch03/b_mccoy_midnight_stampede.jpg';
const SWIM = 'img/ch03/b_mccoy_swimming_a_river.jpg';
const PLATE_SZ: [number, number] = [2750, 1800];
const HEADING = 'img/ch03/heading_a_stampede_1888.jpg';
const HEADING_SZ: [number, number] = [2156, 3000];
const FORD = 'img/ch03/cattle_fording_smoky_hill_ellsworth_1867.jpg';
const FORD_SZ: [number, number] = [3000, 1465];
const GUARD = 'img/ch03/texas_cattle_trade_guarding_herd_1874.jpg';
const GUARD_SZ: [number, number] = [1536, 1131];
const RIVER = 'img/props/L3_river_crossing.jpg';

/** The Goodnight-Loving Trail as far as this chapter's narration takes it: west across Texas, up the Pecos to Fort Sumner. */
const GL = TLINES.goodnightLoving.slice(0, 7);
/** The Pecos, drawn along the trail's northern leg (approx.). */
const PECOS = [[2380, 2260], [2336, 2197], [2262, 2110], [2196, 1980], [2160, 1862], [2130, 1760]];
/** Where the Chisholm crosses Indian Territory (map px). */
const IT_POINT = [2686, 1700];

const MRiver: React.FC<{api: WApi; pts: number[][]; at: number}> = ({api, pts, at: a}) => {
  const g = useGFrame();
  const p = interpolate(g, [a, a + 12], [0, 1], clamp);
  if (p <= 0) return null;
  const [W, H] = W_MAP.size;
  const d = 'M' + pts.map(([x, y]) => `${x},${y}`).join(' L');
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', transform: 'translateZ(1px)'}}>
      <path d={d} fill="none" stroke="#7fa3ad" strokeWidth={api.px(4)} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/** A label standing on the map (mono caps, constant size). */
const MLabel: React.FC<{api: WApi; at: number[]; text: string; show: number; color?: string; size?: number; sub?: string}> = ({api, at: p, text, show, color = '#2FE0C4', size = 26, sub}) => {
  const g = useGFrame();
  const o = interpolate(g, [show, show + 6], [0, 1], clamp);
  return (
    <MStand api={api} at={p} show={show}>
      <div style={{position: 'absolute', left: -300, top: -size, width: 600, textAlign: 'center', opacity: o, fontFamily: JF.mono, fontSize: size, letterSpacing: 4, color, whiteSpace: 'nowrap',
        textShadow: '0 0 2px #111, 0 0 6px #111, 2px 2px 0 #111, -2px 2px 0 #111'}}>
        {text}
        {sub && <div style={{fontSize: size * 0.7, letterSpacing: 2, color: '#fff', marginTop: 4}}>{sub}</div>}
      </div>
    </MStand>
  );
};

/**
 * The trail map with everything this chapter has drawn up to now: `focus` says which trail is the coral subject.
 * Every trail draws on its own word; later shots pass at=-99 to show them settled.
 */
type Focus = 'chisholm' | 'western' | 'gl' | 'all' | 'it';
const Trails: React.FC<{api: WApi; focus: Focus}> = ({api, focus}) => {
  const chis = at('Chisholm Trail') - 2;
  const west = at('Western Trail') - 2;
  const gl = at('ran west') - 4;
  const coral = '#FF6F61';
  const teal = '#2FE0C4';
  return <>
    <MRoute api={api} pts={[...TLINES.kansasPacific].reverse()} at={-99} width={6} color="#d9d2c3" ties={false} opacity={0.55} />
    <MTrail api={api} pts={TLINES.shawnee} at={-99} color="#9fb3b8" width={6} opacity={0.35} />
    <MTrail api={api} pts={TLINES.chisholm} at={chis} dur={150} color={focus === 'chisholm' ? coral : teal} opacity={focus === 'gl' ? 0.55 : 1} />
    <MTrail api={api} pts={TLINES.western} at={west} dur={70} color={focus === 'western' ? coral : teal} opacity={focus === 'gl' ? 0.55 : 1} />
    <MTrail api={api} pts={GL} at={gl} dur={110} color={focus === 'gl' ? coral : teal} width={focus === 'gl' ? 11 : 9} />
    <MPin api={api} at={TPL.abilene} show={at('to Abilene') - 2} label="Abilene" size={40} color={focus === 'chisholm' ? coral : teal} />
    <MPin api={api} at={TPL.dodgeCity} show={at('Dodge City') - 2} label="Dodge City" side="l" size={40} />
    <MPin api={api} at={TPL.sanAntonio} show={at('from south Texas') - 2} label="San Antonio" side="l" size={36} color="#ffffff" />
  </>;
};

// ---------------------------------------------------------------------------------------------------------------- 1 · the trails

/** 1 · "The routes they walked became some of the most famous roads in America." McCoy's plate of a herd on the trail, 1867. */
const Roads: React.FC = () => {
  const b = at('And none') - 1;
  return (
    <CropCam src={ON_TRAIL} size={PLATE_SZ} win={[150, 200, 2560, 1500]} k={[[0, 1350, 850, 0.82], [b, 1150, 760, 1.0]]} filter={ENGR} tag={`${BOOK_TAG}: a herd on the trail, 1867`} tagY={1026}>
      {() => <>
        <SlapTitle text="THE LONG DRIVE" x={110} y={80} size={104} at={12} seed={41} />
        <Note text="the most famous roads in America" x={140} y={240} size={58} rot={-3} at={at('most famous') - 2} />
      </>}
    </CropCam>
  );
};

/** 2 · "And none of them were roads." Cattle fording the Smoky Hill, 1867: no road anywhere. */
const NotRoads: React.FC = () => {
  const a = at('And none') - 1;
  return (
    <CropCam src={FORD} size={FORD_SZ} win={[200, 140, 1440, 1300]} k={[[a, 820, 700, 1.05], [at('Watch the map'), 760, 700, 1.0]]} filter={ENGR}
      tag="Alexander Gardner, cattle fording the Smoky Hill River at Ellsworth, Kan., 1867 · LOC" tagY={1026}>
      {() => <Hand parts={[['none of them were '], ['roads', '#ffffff']]} x={160} y={120} size={84} at={at('none of them') - 2} />}
    </CropCam>
  );
};

/** 3 · "Watch the map. The first big one was the Chisholm Trail, from south Texas …" (wide, the trail drawing on in coral). */
const Chisholm: React.FC = () => {
  const a = at('Watch the map') - 1;
  const ks = [{f: a, x: 2600, y: 1900, z: 0.34, tilt: 30, rot: 3}, {f: at('Indian Territory') + 2, x: 2680, y: 1880, z: 0.42, tilt: 42, rot: 0}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <Trails api={api} focus="chisholm" />
          <MHerd api={api} pts={TLINES.chisholm} at={at('Chisholm Trail') - 2} dur={150} w={84} />
        </>}
      </WestMap>
      <Mono text="THE CATTLE TRAILS" x={130} y={90} size={30} at={a + 3} />
      <SlapTitle text="THE CHISHOLM TRAIL" x={120} y={160} size={92} at={at('Chisholm') + 2} seed={43} />
      <ScrimTag text={MAPTAG} />
    </AbsoluteFill>
  );
};

/** 4 · "… up through Indian Territory, today's Oklahoma, to Abilene." Closer on Indian Territory; the definition. */
const IndianTerritory: React.FC = () => {
  const a = at('Indian Territory') - 1;
  const ks = [{f: a, x: 2690, y: 1620, z: 0.66, tilt: 46, rot: -2}, {f: at('Later the Western') + 4, x: 2700, y: 1500, z: 0.74, tilt: 50, rot: 0}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MState api={api} name="Oklahoma" at={a + 1} color="#2FE0C4" k={0.8} />
          <Trails api={api} focus="chisholm" />
          <MHerd api={api} pts={TLINES.chisholm} at={at('Chisholm Trail') - 2} dur={150} w={84} />
          <MLabel api={api} at={[2560, 1760]} text="INDIAN TERRITORY" sub="today's Oklahoma" show={a + 4} size={30} />
        </>}
      </WestMap>
      <Definition term="Chisholm Trail" def="the first big cattle trail: from south Texas, through Indian Territory, to the railroad at Abilene, Kansas" at={a + 8} x={120} y={830} w={1560} />
      <ScrimTag text={MAPTAG} x={34} y={24} />
    </AbsoluteFill>
  );
};

/** 5 · "Later, the Western Trail ran farther west, to Dodge City." */
const Western: React.FC = () => {
  const a = at('Later the Western') - 1;
  const ks = [{f: a, x: 2620, y: 1700, z: 0.48, tilt: 40, rot: 2}, {f: at('And one went') + 4, x: 2540, y: 1680, z: 0.46, tilt: 36, rot: -2}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>{(api) => <Trails api={api} focus="western" />}</WestMap>
      <SlapTitle text="THE WESTERN TRAIL" x={120} y={90} size={92} at={at('Western Trail') + 2} seed={45} />
      <Note text="farther west" x={150} y={240} size={60} rot={-3} at={at('farther west') - 2} />
      <ScrimTag text={MAPTAG} />
    </AbsoluteFill>
  );
};

/** 6-7 · "And one went another way entirely. The Goodnight-Loving Trail ran west across Texas, then north, up the Pecos River into New Mexico." */
const Goodnight: React.FC<{draw?: boolean}> = ({draw}) => {
  const a = draw ? at('ran west') - 1 : at('And one went') - 1;
  const b = draw ? at('Hold onto') - 1 : at('ran west') - 1;
  const ks = draw ? [{f: a, x: 2350, y: 2050, z: 0.6, tilt: 44, rot: 2}, {f: at('then north') + 6, x: 2300, y: 1980, z: 0.62, tilt: 46, rot: 0}, {f: b, x: 2220, y: 1880, z: 0.58, tilt: 44, rot: -2}]
    : [{f: a, x: 2600, y: 1800, z: 0.42, tilt: 36, rot: -2}, {f: b, x: 2400, y: 1950, z: 0.52, tilt: 42, rot: 3}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MState api={api} name="New Mexico" at={at('New Mexico') - 2} color="#2FE0C4" k={0.6} />
          <MRiver api={api} pts={PECOS} at={at('Pecos') - 4} />
          <Trails api={api} focus="gl" />
          <MLabel api={api} at={[2080, 2060]} text="PECOS RIVER" show={at('Pecos') - 1} size={24} color="#9fc4cc" />
          <MLabel api={api} at={[1960, 1840]} text="NEW MEXICO" show={at('New Mexico') - 1} size={28} />
        </>}
      </WestMap>
      {!draw && <Note text="another way entirely" x={140} y={110} size={64} rot={-3} at={at('another way') - 2} />}
      {draw && <SlapTitle text="THE GOODNIGHT-LOVING TRAIL" x={110} y={80} size={80} at={at('Goodnight-Loving') + 2} seed={47} />}
      {!draw && <SlapTitle text="THE GOODNIGHT-LOVING TRAIL" x={110} y={900} size={80} at={at('Goodnight-Loving') + 2} seed={47} />}
      <ScrimTag text={MAPTAG} />
    </AbsoluteFill>
  );
};

/** 8 · "Hold onto that one." All trails settled, the Goodnight-Loving glowing coral. */
const HoldOn: React.FC = () => {
  const a = at('Hold onto') - 1;
  const ks = [{f: a, x: 2450, y: 1800, z: 0.4, tilt: 38, rot: 0}, {f: at('Picture one drive') + 4, x: 2420, y: 1780, z: 0.37, tilt: 34, rot: 1}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>{(api) => <><MRiver api={api} pts={PECOS} at={-99} /><Trails api={api} focus="gl" /></>}</WestMap>
      <Hand parts={[['hold onto '], ['that one', '#FF6F61']]} x={150} y={110} size={80} at={at('Hold onto') - 2} />
      <ScrimTag text={MAPTAG} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------- 2 · one drive

const DRIVE_ROWS = () => [
  {fig: '≈ 2,500', label: 'cattle', at: at('twenty-five hundred') - 1, color: '#FF6F61'},
  {fig: '10–12', label: 'men', at: at('ten or twelve') - 1},
  {fig: '10–15 mi', label: 'a day', at: at('Ten to fifteen') - 1},
  {fig: '2–3', label: 'months', at: at('two or three months') - 1},
];

/** 9 · "Picture one drive." The numbers on a dark card over Harper's 1874 herd (A), then on the desk (B). */
const Numbers: React.FC<{desk?: boolean}> = ({desk}) => {
  const f = useCurrentFrame();
  const a = desk ? at('Ten to fifteen') - 1 : at('Picture one drive') - 1;
  const b = desk ? at('Up front') - 1 : at('Ten to fifteen') - 1;
  if (!desk) return (
    <Pic src={GUARD} size={GUARD_SZ} k={[[a, 1000, 430, 1.32], [b, 1100, 440, 1.4]]} filter="grayscale(1) sepia(0.15) contrast(1.1) brightness(0.6)"
      tag="The Texas cattle trade: guarding the herd, Harper's Weekly, 1874 · LOC" tagY={1026}>
      {() => <>
        <Mono text="PICTURE ONE DRIVE" x={130} y={90} size={30} at={a + 3} />
        <NumbersCard x={130} y={170} w={760} head="ONE DRIVE · ROUGHLY" rows={DRIVE_ROWS()} at={a + 6} />
      </>}
    </Pic>
  );
  return (
    <AbsoluteFill>
      <Desk3D tilt={keys(f, [[a, 14], [b, 20]])} z={zkeys(f, [[a, 1.0], [b, 0.95]])} lamp={[760, 520]}><div /></Desk3D>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${zkeys(f, [[a, 1.15], [b, 1.05]])})`, transformOrigin: '520px 760px'}}>
        <NumbersCard x={130} y={170} w={760} head="ONE DRIVE · ROUGHLY" rows={DRIVE_ROWS()} at={-99} />
      </div>
      <Prop src="img/props/p2_longhorn.jpg" m={M3.longhorn} x={1080} y={360} w={640} at={a + 2} />
      <Note text="for two or three months" x={1060} y={760} size={58} rot={-3} at={at('two or three months') - 2} color="#ffffff" />
    </AbsoluteFill>
  );
};

/** The drive as a drawn formation on the desk: the herd strung out, the trail boss ahead, the cook's wagon, the drag riders in the dust. */
const HERD_PTS = Array.from({length: 46}).map((_, i) => {
  const t = i / 45;
  const x = 620 + t * 1500 + Math.sin(i * 7.1) * 40;
  const y = 860 + Math.sin(t * Math.PI) * -40 + Math.cos(i * 3.7) * (70 + 90 * Math.sin(t * Math.PI));
  return [x, y];
});
const Formation: React.FC<{back?: boolean}> = ({back}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const a = back ? at('And at the very back') - 1 : at('Up front') - 1;
  const b = back ? at('Three things') - 1 : at('And at the very back') - 1;
  const cx = back ? keys(f, [[a, -700], [b, -900]]) : keys(f, [[a, 300], [b, 120]]);
  const dust = interpolate(g, [at('eating dust') - 8, at('eating dust') + 10], [0.25, 1], clamp);
  return (
    <AbsoluteFill>
      <Desk3D tilt={back ? 30 : 34} z={back ? zkeys(f, [[a, 1.05], [b, 1.12]]) : zkeys(f, [[a, 1.1], [b, 1.0]])} x={cx} y={back ? -120 : 40} rotZ={back ? -3 : 2} lamp={back ? [1300, 560] : [700, 560]}>
        {/* the direction of travel */}
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={2720} height={1680}>
          <path d="M 2300 1120 C 1700 1180, 1000 1160, 330 1020" fill="none" stroke="#2FE0C4" strokeOpacity={0.4} strokeWidth={5} strokeDasharray="26 16" />
        </svg>
        {/* the dust behind the herd */}
        <div style={{position: 'absolute', left: 1950, top: 620, width: 760, height: 520, borderRadius: '50%', opacity: 0.85 * dust,
          background: 'radial-gradient(ellipse at 40% 50%, rgba(214,190,150,0.8) 0%, rgba(160,140,110,0.45) 45%, transparent 72%)', filter: 'blur(18px)'}} />
        {HERD_PTS.map(([x, y], i) => (
          <Img key={i} src={staticFile('img/props/cut/p2_longhorn.webp')} style={{position: 'absolute', left: x, top: y, width: 92, transform: 'scaleX(-1)',
            filter: 'grayscale(0.5) brightness(0.9) drop-shadow(5px 6px 0 #050403)'}} />
        ))}
      </Desk3D>
      {!back && <>
        <Prop src="img/props/p3_saddle.jpg" m={M3.saddle} x={150} y={470} w={200} at={at('trail boss') - 3} />
        <Label text="UP FRONT · THE TRAIL BOSS" x={110} y={400} size={30} at={at('trail boss') - 2} color="#FF9F1C" />
        <Prop src="img/props/p4_chuck_wagon.jpg" m={M3.wagon} x={560} y={700} w={400} at={at('Then the cook') + 2} tint={0.4} traceAt={at('his wagon') + 2} />
        <Label text="THE COOK + HIS WAGON" x={980} y={860} size={30} at={at('the cook') + 2} />
      </>}
      {back && <>
        <Prop src="img/props/p3_lariat.jpg" m={M3.lariat} x={1440} y={420} w={260} at={at('newest riders') - 2} rot={6} />
        <Label text="AT THE VERY BACK · THE NEWEST RIDERS" x={760} y={110} size={30} at={at('newest riders') - 2} color="#FF9F1C" />
        <Hand parts={[['eating dust ', '#ffffff'], ['all day']]} x={900} y={190} size={80} at={at('eating dust') - 2} />
      </>}
      <Mono text={back ? 'THE DRAG' : 'A DRIVE, FROM ABOVE (DIAGRAM)'} x={130} y={980} size={24} at={a + 3} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------- 3 · three things

/** 10 · "Three things could end a drive." */
const ThreeThings: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Three things') - 1;
  const b = at('One a stampede') - 1;
  return (
    <AbsoluteFill>
      <Desk3D tilt={keys(f, [[a, 20], [b, 14]])} z={zkeys(f, [[a, 1.0], [b, 1.06]])}><div /></Desk3D>
      <SlapTitle text="THREE THINGS" x={480} y={300} size={140} at={at('Three things') + 1} seed={49} />
      <Hand parts={[['could end a drive']]} x={620} y={540} size={84} at={at('end a drive') - 2} />
    </AbsoluteFill>
  );
};

/** 11 · "One: a stampede." McCoy's plate, the midnight storm; the counter. */
const Stampede: React.FC = () => {
  const a = at('One a stampede') - 1;
  const b = at('A clap of thunder') - 1;
  return (
    <CropCam src={STAMPEDE} size={PLATE_SZ} win={[170, 200, 2560, 1560]} k={[[a, 1900, 760, 0.9], [b, 2000, 720, 1.05]]} filter={ENGR} tag={`${BOOK_TAG}: midnight storm and stampede`} tagY={1026}>
      {() => <ThreeCount x={120} y={90} n={1} at={at('One a stampede') + 1} label="A STAMPEDE" />}
    </CropCam>
  );
};

/** 12 · "A clap of thunder at night, and the whole herd runs." Heading a stampede (1888 print) on the desk. */
const Thunder: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('A clap of thunder') - 1;
  const b = at('Two rivers') - 1;
  const sh = shake(f, [at('thunder') + 2], 12, 0.15);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={keys(f, [[a, 22], [b, 16]])} z={zkeys(f, [[a, 0.95], [b, 1.04]])} rotZ={keys(f, [[a, 3], [b, 0]])} lamp={[900, 480]}>
        <Lift x={620} y={0} w={620} hgt={620 * (2500 / 1780)} h={10} at={a + 2} rot={-3} seed={81}>
          <TornPrint src={HEADING} size={HEADING_SZ} x={0} y={0} w={620} crop={[190, 150, 1970, 2650]} at={-99} seed={82} real grey shadow={6} filter="grayscale(1) contrast(1.2) brightness(0.95)" />
        </Lift>
      </Desk3D>
      <ThreeCount x={120} y={90} n={1} at={-99} label="A STAMPEDE" />
      <Note text="a clap of thunder at night" x={120} y={220} size={58} rot={-3} at={at('clap of thunder') - 2} />
      <Hand parts={[['the whole herd '], ['runs', '#FF6F61']]} x={1060} y={830} size={72} at={at('whole herd') - 2} />
      <ScrimTag text="Heading a stampede, chromolithograph, 1888 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** 13 · "Two: rivers." McCoy's plate, swimming a river; then the crossing (litho plate), "drowned at the crossings". */
const Rivers: React.FC<{plate?: boolean}> = ({plate}) => {
  const a = plate ? at('Cattle and men') - 1 : at('Two rivers') - 1;
  const b = plate ? at('Three the people') - 1 : at('Cattle and men') - 1;
  if (!plate) return (
    <CropCam src={SWIM} size={PLATE_SZ} win={[170, 200, 2560, 1560]} k={[[a, 1300, 900, 0.85], [b, 1200, 900, 0.95]]} filter={ENGR} tag={`${BOOK_TAG}: swimming a river`} tagY={1026}>
      {() => <ThreeCount x={120} y={90} n={2} at={at('Two rivers') + 1} label="RIVERS" />}
    </CropCam>
  );
  return (
    <Pic src={RIVER} size={[1920, 1080]} k={[[a, 900, 560, 1.06], [b, 1150, 600, 1.2]]} filter={LITHO}>
      {() => <>
        <ThreeCount x={120} y={90} n={2} at={-99} label="RIVERS" />
        <Hand parts={[['cattle and men '], ['drowned', '#ffffff'], [' at the crossings']]} x={130} y={210} size={70} at={at('drowned') - 4} dur={16} />
      </>}
    </Pic>
  );
};

/** 14-15 · "Three: the people whose land you were crossing." Indian Territory; the Cherokee's toll. */
const Toll: React.FC<{close?: boolean}> = ({close}) => {
  const a = close ? at('In Indian Territory') - 1 : at('Three the people') - 1;
  const b = close ? at('Over about twenty') - 1 : at('In Indian Territory') - 1;
  const ks = close ? [{f: a, x: 2700, y: 1680, z: 0.95, tilt: 50, rot: -3}, {f: b, x: 2690, y: 1700, z: 1.08, tilt: 54, rot: 0}]
    : [{f: a, x: 2650, y: 1750, z: 0.5, tilt: 40, rot: 2}, {f: b, x: 2690, y: 1700, z: 0.66, tilt: 46, rot: -1}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MState api={api} name="Oklahoma" at={close ? -99 : at('whose land') - 2} color="#FF6F61" k={0.8} />
          <Trails api={api} focus="it" />
          <MLabel api={api} at={[2560, 1760]} text="INDIAN TERRITORY" show={close ? -99 : at('whose land') + 2} size={28} />
          {close && <>
            <MLabel api={api} at={[2880, 1590]} text="CHEROKEE NATION" sub="and other nations" show={at('Cherokee') - 1} size={28} color="#FF9F1C" />
            <MPin api={api} at={IT_POINT} show={at('toll') - 2} label="a toll for every herd" side="r" size={44} color="#FF9F1C" />
            <MCattle api={api} at={at('paid in cattle') - 4} center={[2730, 1730]} n={5} spread={50} w={58} seed="toll" />
          </>}
        </>}
      </WestMap>
      <ThreeCount x={120} y={90} n={3} at={close ? -99 : at('Three the people') + 1} label="WHOSE LAND IT WAS" />
      {close && <Note text="sometimes paid in cattle" x={140} y={220} size={58} rot={-3} at={at('paid in cattle') - 2} color="#ffffff" />}
      <ScrimTag text={MAPTAG} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------- 4 · the total, the hand-off

/** 16 · "Over about twenty years, somewhere between five and ten million cattle went north this way." */
const Millions: React.FC = () => {
  const a = at('Over about twenty') - 1;
  const ks = [{f: a, x: 2550, y: 1700, z: 0.5, tilt: 46, rot: -2}, {f: at('But one pair') + 4, x: 2500, y: 1650, z: 0.36, tilt: 36, rot: 1}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <Trails api={api} focus="all" />
          {[0, 1, 2].map((i) => <MHerd key={`c${i}`} api={api} pts={TLINES.chisholm} at={a + i * 40} dur={110} w={60} />)}
          {[0, 1].map((i) => <MHerd key={`w${i}`} api={api} pts={TLINES.western} at={a + 20 + i * 40} dur={110} w={60} />)}
        </>}
      </WestMap>
      <Mono text="OVER ABOUT TWENTY YEARS" x={130} y={90} size={30} at={a + 3} />
      <Big text="5–10 million" x={120} y={150} size={140} at={at('five and ten') - 1} color="#f4efe6" />
      <Hand parts={[['cattle went north this way']]} x={150} y={330} size={66} at={at('went north') - 2} />
      <ScrimTag text={MAPTAG} />
    </AbsoluteFill>
  );
};

/** 17 · "But one pair of ranchers went the other way. And their best customer was the United States Army." */
const OtherWay: React.FC = () => {
  const a = at('But one pair') - 1;
  const ks = [{f: a, x: 2400, y: 1850, z: 0.46, tilt: 40, rot: 2}, {f: END + 50, x: 2300, y: 1820, z: 0.56, tilt: 46, rot: -2}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MRiver api={api} pts={PECOS} at={-99} />
          <Trails api={api} focus="gl" />
          <MHerd api={api} pts={GL} at={at('the other way') - 4} dur={90} w={80} />
        </>}
      </WestMap>
      <Hand parts={[['one pair of ranchers went '], ['the other way', '#FF6F61']]} x={120} y={100} size={68} at={at('one pair') - 2} dur={16} />
      <Hand parts={[['best customer: '], ['the U.S. Army', '#ffffff']]} x={160} y={220} size={76} at={at('best customer') - 2} dur={14} />
      <ScrimTag text={MAPTAG} />
    </AbsoluteFill>
  );
};

const sfx = (): SfxRow[] => {
  const c = (w: string) => at(w) - 1;
  const W = (w: string) => at(w) - 4;
  return [
    [12, 'stamp', 0.22], [W('most famous'), 'marker_tick', 0.2],
    [c('And none'), 'whoosh', 0.2], [W('none of them'), 'marker_tick', 0.2],
    [c('Watch the map') - 4, 'whip_soft', 0.22], [c('Watch the map') + 3, 'block_tap_soft', 0.12], [at('Chisholm') + 2, 'stamp', 0.22],
    [c('Indian Territory'), 'whoosh', 0.18],
    [c('Later the Western'), 'whoosh', 0.2], [at('Western Trail') + 2, 'stamp', 0.22], [W('farther west'), 'marker_tick', 0.2],
    [c('And one went'), 'whoosh', 0.2], [W('another way'), 'marker_tick', 0.2], [at('Goodnight-Loving') + 2, 'stamp', 0.22],
    [c('ran west'), 'whoosh', 0.18],
    [c('Hold onto'), 'whoosh', 0.2], [W('Hold onto'), 'marker_tick', 0.2],
    [c('Picture one drive') - 4, 'whip_soft', 0.22], [c('Picture one drive') + 6, 'paper_slap_soft', 0.22],
    [at('twenty-five hundred') - 1, 'block_tap_soft', 0.15], [at('ten or twelve') - 1, 'block_tap_soft', 0.15], [at('Ten to fifteen') - 1, 'block_tap_soft', 0.15], [at('two or three months') - 1, 'block_tap_soft', 0.15],
    [c('Ten to fifteen'), 'whoosh', 0.16], [W('two or three months'), 'marker_tick', 0.2],
    [c('Up front') - 4, 'whip_soft', 0.2], [at('trail boss') - 3, 'paper_slap_soft', 0.22], [at('Then the cook') + 2, 'paper_slap_soft', 0.22],
    [c('And at the very back'), 'whoosh', 0.2], [at('newest riders') - 2, 'paper_slap_soft', 0.2], [W('eating dust'), 'marker_tick', 0.2],
    [c('Three things') - 4, 'whip_soft', 0.22], [at('Three things') + 1, 'stamp', 0.22], [W('end a drive'), 'marker_tick', 0.2],
    [c('One a stampede'), 'whoosh', 0.2], [at('One a stampede') + 1, 'block_tap_soft', 0.18],
    [c('A clap of thunder'), 'whoosh', 0.2], [at('thunder'), 'paper_slap_soft', 0.25], [W('whole herd'), 'marker_tick', 0.2],
    [c('Two rivers') - 4, 'whip_soft', 0.2], [at('Two rivers') + 1, 'block_tap_soft', 0.18], [c('Cattle and men'), 'whoosh', 0.18], [W('drowned'), 'marker_tick', 0.2],
    [c('Three the people') - 4, 'whip_soft', 0.2], [at('Three the people') + 1, 'block_tap_soft', 0.18],
    [c('In Indian Territory'), 'whoosh', 0.18], [at('toll') - 2, 'block_tap_soft', 0.15], [W('paid in cattle'), 'marker_tick', 0.2],
    [c('Over about twenty') - 4, 'whip_soft', 0.22], [at('five and ten') - 1, 'stamp', 0.2], [W('went north'), 'marker_tick', 0.2],
    [c('But one pair'), 'whoosh', 0.2], [W('one pair'), 'marker_tick', 0.2], [W('best customer'), 'marker_tick', 0.2],
  ];
};

const Body: React.FC = () => {
  const shots: [number, React.ReactNode, ('whip' | 'cut')?][] = [
    [0, <Roads />],
    [at('And none') - 1, <NotRoads />, 'cut'],
    [at('Watch the map') - 1, <Chisholm />, 'whip'],
    [at('Indian Territory') - 1, <IndianTerritory />, 'cut'],
    [at('Later the Western') - 1, <Western />, 'cut'],
    [at('And one went') - 1, <Goodnight />, 'cut'],
    [at('ran west') - 1, <Goodnight draw />, 'cut'],
    [at('Hold onto') - 1, <HoldOn />, 'cut'],
    [at('Picture one drive') - 1, <Numbers />, 'whip'],
    [at('Ten to fifteen') - 1, <Numbers desk />, 'cut'],
    [at('Up front') - 1, <Formation />, 'whip'],
    [at('And at the very back') - 1, <Formation back />, 'cut'],
    [at('Three things') - 1, <ThreeThings />, 'whip'],
    [at('One a stampede') - 1, <Stampede />, 'cut'],
    [at('A clap of thunder') - 1, <Thunder />, 'cut'],
    [at('Two rivers') - 1, <Rivers />, 'whip'],
    [at('Cattle and men') - 1, <Rivers plate />, 'cut'],
    [at('Three the people') - 1, <Toll />, 'whip'],
    [at('In Indian Territory') - 1, <Toll close />, 'cut'],
    [at('Over about twenty') - 1, <Millions />, 'whip'],
    [at('But one pair') - 1, <OtherWay />, 'cut'],
  ];
  return (
    <>
      <WShots shots={shots} />
      <Sounds list={sfx()} />
    </>
  );
};

export const Ch03: React.FC = () => (
  // SUNO: aw_long_drive replaces this
  <ChapterShell n={N} audio="audio/ch03_the_long_drive.wav" lead={LEAD} music={[
    // m_frontier runs 69 s: a second pass picks up from 12 s in, crossfading under the toll beat
    {src: 'music/m_frontier.mp3', volume: bed('m_frontier'), to: 30 * 67, fadeOut: 60},
    {src: 'music/m_frontier.mp3', volume: bed('m_frontier'), from: 30 * 65, startFrom: 30 * 12},
  ]}>
    <Body />
  </ChapterShell>
);

