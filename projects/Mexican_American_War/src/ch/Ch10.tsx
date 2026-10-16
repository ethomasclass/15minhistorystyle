// Chapter 10 · Poison: the Wilmot Proviso, the sectional vote, why new land made it harder, Emerson's arsenic, back to the
// spot, Appomattox, Grant's "outgrowth", 1848 → 1861, and the built-in end screen.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import mapData from '../../public/maps/mex1846.json';
import words from '../../public/audio/ch10_poison.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {Border, BORDER_1861, type Cam3, CONFEDERACY_1861, Count, Fill, Glow, Hand, MAP3D, Map3D, type MapData, RegionName, Slab, SLAVE_1846, FREE_1846, Stake, Stand,
  StateTiles, UNION_FREE_1861} from '../kit/map3d';
import {Parallax} from '../kit/parallax';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, Quote, Stamp, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
const D = mapData as unknown as MapData;
const pl = D.places;
/** The end screen: music and the thank-you line, then this many frames more (YouTube end-screen elements sit here). */
const EXTRA = 480;
export const CH10_FRAMES = chapterFrames(N, LEAD) + EXTRA;

const GEN: [number, number] = [1376, 768];
const FREE_C = '#4f7186';
const SLAVE_C = '#8a2f26';
const BORDER_C = '#6d6a64';
const MEMOIR: [number, number] = [2458, 3972];

/** August 1846: Polk asks for money; Wilmot adds one sentence. */
const Chamber: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const dim = interpolate(g, [t.at('one sentence') - 2, t.at('one sentence') + 10], [0, 0.45], clamp);
  return (
    <Parallax name="house_speaker" src="img/gen/ch10_house_chamber.jpg" size={GEN} a={-10} b={t.at('No slavery')} fx={0.5} fy={0.48}
      cam={{z: [1.0, 1.18], y: [0.0, 0.03]}} depth={1.05} vignette={0.45} mask={MASKS.house_speaker} tintStrength={0.6} traceAt={t.at('one sentence')}
      tag="Illustration · the House of Representatives, August 8, 1846">
      {() => (
        <>
          <AbsoluteFill style={{background: '#000', opacity: dim}} />
          <Highlight text="AUGUST 1846" x={100} y={80} size={90} at={t.at('August')} seed={221} rot={-2} />
          <Note text="three months into the war" x={110} y={230} size={52} rot={-3} at={t.at('three') - 2} color="#ffffff" />
          <Note text="Polk asks for money to buy land from Mexico" x={110} y={320} size={48} rot={-3} at={t.at('money') - 2} color="#ffffff" />
          <CropCard src="img/ch10/wilmot.jpg" size={[1155, 1380]} x={1440} y={120} w={360} h={440} fx={577} fy={560} scale={0.4} rot={2} at={t.at('David') - 2}
            mask={MASKS.wilmot} tintStrength={0.45} traceAt={t.at('Wilmot,')} />
          <Note text="Rep. David Wilmot" x={1440} y={600} size={46} rot={-2} at={t.at('David')} color="#ffffff" />
          <Note text="adds ONE sentence" x={1380} y={690} size={56} rot={-3} at={t.at('one sentence') - 2} />
        </>
      )}
    </Parallax>
  );
};

/** The proviso itself. */
const Proviso: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const m = t.at('No slavery') - 2;
  const p = interpolate(g, [m, m + 14], [0, 100], clamp);
  const k = interpolate(g, [m - 4, m + 4], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 120, top: 110, width: 1100, padding: '40px 52px', background: '#efe8d8', color: '#1b1712', boxShadow: '0 18px 34px rgba(0,0,0,0.6)',
        opacity: k, transform: `scale(${0.85 + 0.15 * k}) rotate(-1deg)`}}>
        <div style={{fontFamily: '"Playfair Display", serif', fontSize: 37, lineHeight: 1.5}}>
          <i>Provided</i>, That, as an express and fundamental condition to the acquisition of any territory from the Republic of Mexico… {' '}
          <span style={{backgroundImage: `linear-gradient(to right, ${pal.subject}99 ${p}%, transparent ${p}%)`, fontWeight: p > 0 ? 700 : 400}}>neither slavery nor involuntary servitude shall ever exist in any part of said territory</span>, except for crime…
        </div>
      </div>
      {g >= t.at('Wilmot Proviso.') && <Highlight text="THE WILMOT PROVISO" x={120} y={690} size={90} at={t.at('Wilmot Proviso.')} seed={223} rot={-2} />}
      <Definition term="proviso" def="a condition attached to a law" at={t.at('condition')} x={130} y={860} w={800} />
      <CropCard src="img/ch10/wilmot.jpg" size={[1155, 1380]} x={1360} y={120} w={420} h={520} fx={577} fy={600} scale={0.45} rot={2} at={t.at("Wilmot wasn't") - 2}
        mask={MASKS.wilmot} tintStrength={0.45} />
      <Note text="not an abolitionist" x={1240} y={680} size={50} rot={-3} at={t.at('abolitionist.') - 6} color="#ffffff" />
      <Note text="wanted the land for free white workers" x={900} y={770} size={44} rot={-3} at={t.at('white') - 4} color="#ffffff" />
      <Note text="the question Washington had been avoiding" x={860} y={880} size={42} rot={-3} at={t.at('avoiding.') - 8} color={pal.subject} />
      <Tag text="H.R. 534 (Two Million Bill), amendment of Aug. 8, 1846 · excerpt, reset in type · Wilmot portrait, Library of Congress" />
    </AbsoluteFill>
  );
};

/** The vote: passes the House, dies in the Senate; the map splits North / South. */
const Vote: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('It passes') - 1;
  const tiles = t.at('look at the vote');
  const keys: Cam3[] = [
    {f: a, x: 4200, y: 1250, z: 0.36, tilt: 40, rot: 0},
    {f: tiles, x: 4300, y: 1200, z: 0.34, tilt: 38, rot: 0},
  ];
  return (
    <>
      <Map3D data={D} keys={keys} states={interpolate(g, [a, a + 10], [0, 0.6], clamp)}>
        {(api) => (
          <>
            <StateTiles api={api} names={FREE_1846} at={t.at('North.') - 6} stagger={1} h={40} color={FREE_C} />
            <StateTiles api={api} names={SLAVE_1846} at={t.at('South.') - 6} stagger={1} h={14} color={SLAVE_C} />
            <Stand api={api} at={[4900, 520]} z={60} show={t.at('North.')}><Hand text="YES" size={90} color="#ffffff" bg /></Stand>
            <Stand api={api} at={[4500, 1500]} z={30} show={t.at('South.')}><Hand text="NO" size={90} color="#ffffff" bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(to right, rgba(10,9,7,0.82) 0%, rgba(10,9,7,0.55) 30%, rgba(0,0,0,0) 48%)'}} />
        {g < tiles && (
          <>
            <div style={{position: 'absolute', left: 110, top: 80, display: 'flex', alignItems: 'flex-end', gap: 26, opacity: g >= t.at('83') - 2 ? 1 : 0}}>
              <Count to={83} at={t.at('83') - 2} dur={12} size={130} color="#f4efe6" />
              <div style={{fontFamily: JF.display, fontSize: 70, color: '#8d867b', lineHeight: 1.5}}>to</div>
              <Count to={64} at={t.at('64.') - 4} dur={10} size={130} color={pal.subject} />
            </div>
            <Note text="passes the House" x={120} y={260} size={56} rot={-3} at={t.at('passes') - 2} color="#ffffff" />
            <Note text="dies in the Senate" x={120} y={360} size={56} rot={-3} at={t.at('dies') - 2} color="#ffffff" />
            <Note text="back again… and again…" x={120} y={460} size={56} rot={-3} at={t.at('again,') - 2} color="#ffffff" />
            <Stamp text="NEVER BECOMES LAW" x={110} y={600} at={t.at('never')} size={84} color={pal.subject} rot={-4} />
          </>
        )}
        {g >= tiles && (
          <>
            <Note text="the North: yes" x={110} y={80} size={60} rot={-3} at={t.at('North.') - 4} color="#9fc0d2" />
            <Note text="the South: no" x={110} y={180} size={60} rot={-3} at={t.at('South.') - 4} color="#e3746a" />
            <Note text="Democrats split. Whigs split. Same line." x={110} y={780} size={50} rot={-3} at={t.at('Both big') - 2} color="#ffffff" />
            <Definition term="sectionalism" def="loyalty to your region over your party" at={t.at('sectionalism:')} x={110} y={880} w={900} />
          </>
        )}
      </AbsoluteFill>
    </>
  );
};

/** Why winning made it harder: every acre forced the question. */
const Acre: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at("Here's why") - 1;
  const keys: Cam3[] = [
    {f: a, x: 2600, y: 1500, z: 0.36, tilt: 40, rot: 0},
    {f: t.at('Every acre'), x: 2300, y: 1400, z: 0.42, tilt: 44, rot: 2},
  ];
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Slab api={api} d={D.states['USA:Texas']} at={t.at('Texas') - 2} h={36} layers={8} color={SLAVE_C} clipLand={false} />
            <Stand api={api} at={[3000, 1700]} z={50} show={t.at('slave state')}><Hand text="Texas: already a slave state" size={52} color="#ffffff" bg /></Stand>
            <Slab api={api} region="cession" at={t.at('This land') - 2} h={36} layers={8} color={pal.subject} />
            <Stand api={api} at={[1500, 1000]} z={60} show={t.at('new.') - 2}><RegionName text="NEW LAND" size={80} /></Stand>
            <Stand api={api} at={[2150, 1450]} z={160} show={t.at('forced the question') - 2}><div style={{fontFamily: JF.display, fontSize: 260, color: '#f4efe6', textShadow: '0 10px 30px rgba(0,0,0,0.8)'}}>?</div></Stand>
            <Border api={api} d={D.lines.mo3630} at={t.at('slave, or free') - 4} dur={24} color="#f4efe6" dashed label="36°30′ · the 1820 line" labelSize={24} labelTo={0.4} />
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Note text="why winning made it harder" x={110} y={80} size={62} rot={-3} at={t.at('winning') - 2} color="#ffffff" />
        {g >= t.at('slave, or free') && <Highlight text="SLAVE, OR FREE?" x={110} y={880} size={96} at={t.at('slave, or free')} seed={225} rot={-2} />}
      </AbsoluteFill>
    </>
  );
};

/** Emerson, 1846: "Mexico will poison us." */
const Emerson: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('In 1846,') - 1;
  const arsenic = t.at('but it will be');
  if (g >= arsenic) {
    return (
      <Parallax name="arsenic" src="img/gen/ch10_arsenic.jpg" size={GEN} a={arsenic - 1} b={t.at('So, back')} fx={0.72} fy={0.5}
        cam={{z: [1.1, 1.3], x: [0.0, 0.06]}} depth={1.06} vignette={0.55} mask={MASKS.arsenic} tint={null} traceAt={t.at('arsenic,')}
        effects={[{kind: 'flicker', x: 1150, y: 160, r: 600, strength: 0.7}]} tag="Illustration · a bottle of arsenic">
        {() => (
          <>
            <AbsoluteFill style={{background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 55%)'}} />
            <Quote text="…but it will be as the man swallows the arsenic, which brings him down in turn." at={arsenic} x={100} y={180} w={900} size={56} />
            {g >= t.at('Mexico will') && <Highlight text="MEXICO WILL POISON US." x={100} y={700} size={84} at={t.at('Mexico will')} seed={227} rot={-2} />}
          </>
        )}
      </Parallax>
    );
  }
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src="img/ch10/emerson.jpg" size={[1680, 1940]} x={140} y={120} w={560} h={760} fx={830} fy={900} scale={0.38} rot={-2} at={a}
        mask={MASKS.emerson} tintStrength={0.45} traceAt={t.at('Emerson')} />
      <Note text="Ralph Waldo Emerson, 1846" x={150} y={920} size={50} rot={-2} at={t.at('Ralph') - 2} color="#ffffff" />
      <Note text="saw it coming" x={850} y={150} size={60} rot={-3} at={t.at('saw') - 2} />
      <Quote text="The United States will conquer Mexico…" at={t.at('The United States will')} x={850} y={360} w={960} size={64} who="Emerson's journal, 1846" />
      <Tag text="Ralph Waldo Emerson, lithograph by L. Grozelier (1859) · Library of Congress" />
    </AbsoluteFill>
  );
};

/** Back to Lincoln's question: where was the spot? */
const Spot: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('So, back') - 1;
  const keys: Cam3[] = [
    {f: a, x: 3120, y: 2260, z: 1.1, tilt: 46, rot: -6},
    {f: t.at('But the bigger') - 1, x: 3150, y: 2300, z: 1.45, tilt: 52, rot: -10},
  ];
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Border api={api} d={D.lines.nueces} at={a} dur={8} color={MAP3D.mexico} dashed label="Nueces · Mexico's line" labelSize={26} labelTo={0.9} />
            <Border api={api} d={D.lines.rioGrande} at={a} dur={8} color={MAP3D.us} dashed label="Rio Grande · Texas's claim" labelSize={26} labelTo={0.3} />
            <Fill api={api} region="nuecesStrip" at={t.at('In land') - 2} color="#FF6F61" opacity={0.3} hatch="rgba(255,111,97,0.75)" />
            <Stand api={api} at={pl.carricitos} show={t.at('spot?') - 2}><Stake /></Stand>
            <Stand api={api} at={[3200, 2290]} z={30} show={t.at('both countries') - 2}><Hand text="land both countries claimed" size={56} color="#ffffff" bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Quote text="where was the spot?" at={t.at('Where was')} x={110} y={70} w={900} size={60} who="back to Lincoln's question" />
        <Note text="supporters: Mexico attacked first; America claimed its destiny" x={110} y={820} size={44} rot={-2} at={t.at('supporters,') - 2} color={MAP3D.mexico} out={t.at('To critics,')} />
        <Note text="critics: a president sent an army into disputed land" x={110} y={820} size={44} rot={-2} at={t.at('To critics,') - 2} color={MAP3D.us} />
        <Note text="…and got the war he wanted" x={140} y={910} size={44} rot={-2} at={t.at('got') - 2} color={MAP3D.us} />
        <Note text="both readings, from the start" x={1060} y={180} size={50} rot={-3} at={t.at('Both readings') - 2} color={pal.subject} />
      </AbsoluteFill>
    </>
  );
};

/** The bigger question: what would the new land become? */
const Bigger: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('But the bigger') - 1;
  const keys: Cam3[] = [
    {f: a, x: 3000, y: 2000, z: 0.6, tilt: 46, rot: -4},
    {f: t.at('Remember') - 1, x: 2300, y: 1450, z: 0.36, tilt: 40, rot: 0},
  ];
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Fill api={api} region="nuecesStrip" at={-99} out={t.at('It was what')} color="#FF6F61" opacity={0.3} hatch="rgba(255,111,97,0.75)" />
            <Slab api={api} region="cession" at={t.at('new land') - 4} h={36} layers={8} color="#FF6F61" />
            <Glow api={api} d={D.regions.cession} at={t.at('become.') - 4} color="#FF9F1C" />
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Note text="the bigger question was never where the war started" x={110} y={80} size={50} rot={-2} at={t.at('bigger') - 2} color="#ffffff" />
        {g >= t.at('what the new') && <Highlight text="WHAT WOULD THE NEW LAND BECOME?" x={110} y={880} size={74} at={t.at('what the new')} seed={229} rot={-1} />}
      </AbsoluteFill>
    </>
  );
};

/** Appomattox, April 1865. */
const Appomattox: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Parallax name="grant_lee" src="img/ch10/appomattox.jpg" size={[1590, 2100]} a={t.at('Remember') - 1} b={t.at('Grant also')} fx={0.5} fy={0.275}
      crop={[60, 380, 1590, 1980]} cam={{z: [1.0, 1.05], y: [0, 0]}} depth={1.05} vignette={0.45} mask={MASKS.grant_lee} tint={null}
      traceAt={t.at('Appomattox,')} filter="grayscale(1) contrast(1.15)" tag="Currier & Ives, Surrender of Genl. Lee at Appomattox C.H., April 9th 1865 · Library of Congress">
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 14%, rgba(0,0,0,0) 66%, rgba(0,0,0,0.8) 100%)'}} />
          <Note text="remember those young officers?" x={110} y={870} size={56} rot={-3} at={t.at('Remember') - 2} color="#ffffff" out={t.at('talk about') - 2} />
          {g >= t.at('April') && <Highlight text="APRIL 1865 · APPOMATTOX" x={1080} y={760} size={64} at={t.at('April')} seed={231} rot={-2} />}
          <Note text="they talk about Mexico" x={110} y={850} size={56} rot={-3} at={t.at('talk about') - 2} color={pal.subject} out={t.at('Grant wrote')} />
          <Note text="…back when they were on the same side" x={140} y={950} size={50} rot={-3} at={t.at('same side.') - 6} color="#ffffff" out={t.at('Grant wrote')} />
          <Note text="so pleasant, he almost forgot why they were there" x={110} y={900} size={52} rot={-2} at={t.at('pleasant,') - 2} color="#ffffff" />
        </>
      )}
    </Parallax>
  );
};

/** Grant: "largely the outgrowth of the Mexican war." */
const Outgrowth: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Grant also') - 1;
  const s = 0.36;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src="img/ch10/grant_memoirs_p56.jpg" size={MEMOIR} x={180} y={170} w={1000} h={600} fx={1229} fy={1260} scale={s} rot={-1} at={a}>
        {(S) => {
          const [x1, y1] = S(1840, 1332);
          const [x2, y2] = S(1229, 1448);
          return (
            <>
              <Loop cx={x1} cy={y1} rx={420 * s} ry={30} at={t.at('largely') - 2} seed={81} tilt={-1} color={pal.subject} width={6} />
              <Loop cx={x2} cy={y2} rx={1050 * s} ry={34} at={t.at('outgrowth') - 2} seed={83} tilt={-1} color={pal.subject} width={6} />
            </>
          );
        }}
      </CropCard>
      <CropCard src="img/ch06/grant.jpg" size={[900, 1200]} x={1340} y={200} w={420} h={520} fx={450} fy={560} scale={0.52} rot={2} at={a + 4}
        mask={MASKS.grant} tintStrength={0.45} traceAt={a + 10} />
      <Note text="Grant, in his memoirs" x={1290} y={760} size={44} rot={-2} at={a + 6} color="#ffffff" />
      <Tag text="Personal Memoirs of U. S. Grant (1885), vol. 1, p. 56" />
    </AbsoluteFill>
  );
};

/** Emerson had warned; it took about 13 years. 1848 → 1861. */
const Thirteen: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('Emerson had') - 1;
  // the states split on "poison the country"; the war is named on "13 years" (the end screen keeps the labels)
  const split = t.at('poison the country') - 4;
  const war = t.at('13') - 2;
  const keys: Cam3[] = [
    {f: a, x: 3600, y: 1500, z: 0.3, tilt: 38, rot: 0},
    {f: t.at('Thanks') - 1, x: 3700, y: 1450, z: 0.32, tilt: 40, rot: 0},
  ];
  return (
    <>
      <Map3D data={D} keys={keys} states={interpolate(g, [a, a + 10], [0, 0.5], clamp)}>
        {(api) => (
          <>
            <Slab api={api} region="cession" at={a} h={30} layers={6} color="#FF6F61" fall={split + 20} />
            <Glow api={api} d={D.regions.cession} at={a + 6} color="#FF9F1C" />
            <StateTiles api={api} names={UNION_FREE_1861} at={split + 10} stagger={1} h={26} color={FREE_C} />
            <StateTiles api={api} names={BORDER_1861} at={split + 16} stagger={1} h={20} color={BORDER_C} />
            <StateTiles api={api} names={CONFEDERACY_1861} at={split + 22} stagger={1} h={48} color={SLAVE_C} />
            <Stand api={api} at={[4800, 560]} z={60} show={split + 22}><RegionName text="UNION" size={86} /></Stand>
            <Stand api={api} at={[4150, 1880]} z={60} show={split + 28}><RegionName text="CONFEDERACY" size={86} /></Stand>
            <Stand api={api} at={[4050, 1020]} z={30} show={split + 32}><Hand text="border states" size={44} color="#ffffff" bg /></Stand>
            <Stand api={api} at={[5420, 1330]} z={20} show={war}><Hand text="← Fort Sumter, April 1861" size={40} color="#ffffff" bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Note text="Emerson's warning: the poison" x={110} y={80} size={54} rot={-2} at={t.at('Emerson had') - 2} color="#ffffff" />
        {g >= t.at('It took') - 2 && <Highlight text="1848 → 1861" x={110} y={190} size={110} at={t.at('It took') - 2} seed={233} rot={-2} />}
        <Note text="about 13 years" x={130} y={380} size={66} rot={-3} at={t.at('13') - 2} color={pal.subject} />
        {g >= war && <Highlight text="THE CIVIL WAR" x={110} y={840} size={120} at={war} seed={235} rot={-2} />}
        {g >= war + 8 && (
          <div style={{position: 'absolute', left: 120, top: 560, display: 'flex', flexDirection: 'column', gap: 12, fontFamily: JF.sans, fontWeight: 700, fontSize: 30, color: '#f4efe6',
            opacity: interpolate(g, [war + 8, war + 16], [0, 1], clamp), background: 'rgba(12,12,12,0.78)', padding: '18px 26px', borderRadius: 6}}>
            {[[FREE_C, 'Union'], [BORDER_C, 'Union slave states (border)'], [SLAVE_C, 'Confederacy']].map(([c, l]) => (
              <span key={l}><span style={{display: 'inline-block', width: 26, height: 26, background: c, verticalAlign: -5, marginRight: 14, border: '2px solid #111'}} />{l}</span>
            ))}
          </div>
        )}
      </AbsoluteFill>
    </>
  );
};

/** The end screen: the map drifting, two video slots, a subscribe circle, thanks. (YouTube's elements go on top.) */
const EndScreen: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('Thanks') - 1;
  const k = interpolate(g, [a, a + 18], [0, 1], clamp);
  const keys: Cam3[] = [
    {f: a, x: 3700, y: 1450, z: 0.32, tilt: 40, rot: 0},
    {f: a + 900, x: 3300, y: 1700, z: 0.36, tilt: 44, rot: -6},
  ];
  const slot = (x: number, y: number, at: number) => (
    <div style={{position: 'absolute', left: x, top: y, width: 640, height: 360, border: `5px solid ${pal.mark}`, borderRadius: 10, background: 'rgba(10,10,10,0.55)',
      opacity: interpolate(g, [at, at + 10], [0, 1], clamp), boxShadow: '0 16px 30px rgba(0,0,0,0.5)'}} />
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: `brightness(${1 - 0.55 * k})`}}>
        <Map3D data={D} keys={keys} states={0.5}>
          {(api) => (
            <>
              <StateTiles api={api} names={UNION_FREE_1861} at={-99} stagger={0} h={26} color={FREE_C} />
              <StateTiles api={api} names={BORDER_1861} at={-99} stagger={0} h={20} color={BORDER_C} />
              <StateTiles api={api} names={CONFEDERACY_1861} at={-99} stagger={0} h={48} color={SLAVE_C} />
            </>
          )}
        </Map3D>
      </AbsoluteFill>
      {slot(110, 150, a + 6)}
      {slot(110, 590, a + 12)}
      <div style={{position: 'absolute', left: 1240, top: 230, width: 330, height: 330, borderRadius: '50%', border: `5px solid ${pal.mark}`, background: 'rgba(10,10,10,0.55)',
        opacity: interpolate(g, [a + 18, a + 28], [0, 1], clamp)}} />
      <Note text="thanks for watching" x={1080} y={640} size={66} rot={-3} at={a + 4} color="#ffffff" />
      <Note text="subscribe ↑" x={1270} y={750} size={54} rot={-3} at={t.at('subscribe,') - 2} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Chamber t={t} />],
    [at('No slavery') - 1, <Proviso t={t} />],
    [at('It passes') - 1, <Vote t={t} />],
    [at("Here's why") - 1, <Acre t={t} />],
    [at('In 1846,') - 1, <Emerson t={t} />],
    [at('So, back') - 1, <Spot t={t} />],
    [at('But the bigger') - 1, <Bigger t={t} />],
    [at('Remember') - 1, <Appomattox t={t} />],
    [at('Grant also') - 1, <Outgrowth t={t} />],
    [at('Emerson had') - 1, <Thirteen t={t} />],
    [at('Thanks') - 1, <EndScreen t={t} />],
  ];
  const scene = useScene(cuts);
  const notes = ['three', 'money', 'David', 'one sentence', 'abolitionist.', 'white', 'avoiding.', 'passes', 'dies', 'again,', 'Both big', 'winning', 'saw',
    'supporters,', 'To critics,', 'got', 'Both readings', 'bigger', 'Remember', 'talk about', 'same side.', 'pleasant,', 'Emerson had', '13'];
  return (
    <>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['August', 'Wilmot Proviso.', 'slave, or free', 'Mexico will', 'what the new', 'April'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {['never'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.38} />)}
      {notes.map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('83') - 2} src="sfx/tick.wav" volume={0.4} />
      <Sfx at={at('North.') - 6} src="sfx/tick_soft.wav" volume={0.4} />
      <Sfx at={at('It took') + 8} src="sfx/tick_soft.wav" volume={0.4} />
    </>
  );
};

const TM = makeTimeline(N, 30);

export const Ch10: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch10_poison.wav" lead={LEAD} extra={EXTRA} music={[
    {src: 'music/g_grip.mp3', volume: 0.15, to: TM.at('In 1846,') + 6},
    {src: 'music/j_grief.mp3', volume: 0.12, from: TM.at('In 1846,') - 6, to: TM.at('But the bigger') + 6},
    {src: 'music/r_ending.mp3', volume: 0.16, from: TM.at('But the bigger') - 6},
  ]}>
    <Body />
  </ChapterShell>
);
