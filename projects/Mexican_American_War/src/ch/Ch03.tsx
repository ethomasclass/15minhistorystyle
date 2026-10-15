// Chapter 3 · Come and Take It: why Texas broke away (Coahuila y Tejas, Austin's arrest, Santa Anna's centralism),
// Gonzales, the Declaration and its signers, and the constitution two weeks later that protected slavery.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import mapData from '../../public/maps/mex1846.json';
import words from '../../public/audio/ch03_come_and_take_it.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {type Cam3, centreOf, Dot, Fill, Flag3, Hand, MAP3D, Map3D, type MapData, MEXICAN_STATES, PlaceTag, RegionName, Route, Slab, Stand, StateTiles} from '../kit/map3d';
import {Parallax} from '../kit/parallax';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
const D = mapData as unknown as MapData;
const pl = D.places;
export const CH03_FRAMES = chapterFrames(N, LEAD);

const GEN: [number, number] = [1376, 768];
const PAGE: [number, number] = [2719, 4089];
const decl = (p: number) => `img/ch03/decl_p${p}.jpg`;
const DECL_TAG = 'Texas Declaration of Independence, March 2, 1836 (facsimile) · S. H. Dixon, Men Who Made Texas Free (1924)';
const SANTA = 'img/ch03/santa_anna.jpg';
const SANTA_SIZE: [number, number] = [1550, 2370];

/** "Let's look at the evidence": the Declaration's title page on the desk. */
const Evidence: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const z = interpolate(g, [0, t.at("Texas didn't")], [0.3, 0.33], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src={decl(34)} size={PAGE} x={1010} y={90} w={760} h={860} fx={1360} fy={1450} scale={z} rot={2} at={-2} />
      {g >= t.at('why') && <Highlight text="WHY?" x={150} y={250} size={150} at={t.at('why')} seed={81} rot={-3} />}
      <Note text="did Texas break away" x={170} y={470} size={64} rot={-3} at={t.at('break') - 2} color="#ffffff" />
      <Note text="the evidence →" x={240} y={640} size={72} rot={-4} at={t.at('evidence.') - 2} />
      <Tag text={DECL_TAG} />
    </AbsoluteFill>
  );
};

/** Coahuila y Tejas: one state, a far-off capital. */
const Coahuila: React.FC<{t: TL}> = ({t}) => {
  const a = t.at("Texas didn't") - 1;
  const keys: Cam3[] = [
    {f: a, x: 3300, y: 1950, z: 0.9, tilt: 44, rot: -4},
    {f: t.at('Coahuila,'), x: 2950, y: 2150, z: 0.8, tilt: 44, rot: -6},
    {f: t.at('Laws'), x: 2820, y: 2170, z: 0.8, tilt: 46, rot: -8},
  ];
  const coah = D.states['MEX:Coahuila'];
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Fill api={api} region="texasProvince" at={a + 2} out={t.at('bigger')} outline={MAP3D.mexico} color={MAP3D.mexico} opacity={0.16} />
            <Stand api={api} at={[3330, 1800]} z={40} show={a + 4} out={t.at('bigger')}><Hand text="Texas: no state of its own" size={64} bg /></Stand>
            <Slab api={api} region="texasProvince" at={t.at('bigger')} h={30} layers={6} color={MAP3D.mexico} />
            <Slab api={api} d={coah} at={t.at('bigger') + 2} h={30} layers={6} color={MAP3D.mexico} clipLand={false} />
            <Stand api={api} at={[2470, 2400]} z={30} show={t.at('Coahuila,')}><RegionName text="COAHUILA Y TEJAS" size={66} /></Stand>
            <Dot api={api} at={pl.saltillo} show={t.at('capital')} color="#f4efe6" />
            <Stand api={api} at={[pl.saltillo[0], pl.saltillo[1] - 12]} z={40} show={t.at('capital') + 2}><PlaceTag text="Saltillo · the capital" size={26} /></Stand>
            <Dot api={api} at={pl.sanFelipe} show={t.at('capital')} color={MAP3D.us} />
            <Stand api={api} at={[pl.sanFelipe[0], pl.sanFelipe[1] - 12]} z={40} show={t.at('capital') + 2}><PlaceTag text="Austin's colony" size={26} /></Stand>
            <Route api={api} pts={[pl.sanFelipe, pl.saltillo]} at={t.at('hundreds')} dur={18} color={MAP3D.us} width={10} dashed />
            <Stand api={api} at={[3520, 2380]} z={20} show={t.at('hundreds') + 8}><Hand text="hundreds of miles" size={64} color="#ffffff" bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 32%)', opacity: interpolate(useGFrame(), [t.at('Laws'), t.at('Laws') + 6], [0, 1], clamp)}} />
        <Note text="laws in Spanish" x={90} y={150} size={60} rot={-3} at={t.at('Spanish.') - 4} color="#ffffff" />
        <Note text="no jury trials" x={110} y={260} size={60} rot={-3} at={t.at('jury') - 2} color="#ffffff" />
        <Note text="one religion only" x={130} y={370} size={60} rot={-3} at={t.at('religion') - 2} color="#ffffff" />
      </AbsoluteFill>
    </>
  );
};

/** 1833: Austin asks for a state and ends up in a Mexico City jail. */
const Jail: React.FC<{t: TL}> = ({t}) => (
  <Parallax name="jail_austin" src="img/gen/ch03_austin_jail.jpg" size={GEN} a={t.at('In 1833,') - 1} b={t.at('Meanwhile,')} fx={0.55} fy={0.5}
    cam={{z: [1.0, 1.1], x: [0.03, -0.02]}} depth={1.05} vignette={0.35} mask={MASKS.jail_austin} tintStrength={0.6} traceAt={t.at('jail,')}
    effects={[{kind: 'dust', x: 330, y: 130, w: 520, h: 650}]} tag="Illustration · Stephen F. Austin in prison, Mexico City, 1834">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to left, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 38%)'}} />
        <Highlight text="1833" x={100} y={90} size={110} at={t.at('1833,')} seed={83} rot={-2} />
        <Note text="Austin asks for" x={1230} y={180} size={56} rot={-3} at={t.at('ask') - 2} color="#ffffff" />
        <Note text="a separate state" x={1260} y={280} size={62} rot={-3} at={t.at('separate') - 2} />
        <Note text="→ jail" x={1290} y={420} size={72} rot={-3} at={t.at('jail,') - 2} color={'#FF6F61'} />
        <Note text="home 2+ years later" x={1220} y={560} size={56} rot={-3} at={t.at('two years') - 4} color="#ffffff" />
      </>
    )}
  </Parallax>
);

/** Santa Anna takes charge: his portrait as a card on the desk. */
const SantaAnna: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const z = interpolate(g, [t.at('Meanwhile,'), t.at('moves power')], [0.6, 0.66], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src={SANTA} size={SANTA_SIZE} x={170} y={110} w={640} h={820} fx={787} fy={1150} scale={z} rot={-2} at={t.at('Meanwhile,') - 1}
        mask={MASKS.santa_anna} tintStrength={0.5} traceAt={t.at('Santa Anna')} />
      {g >= t.at('Santa Anna') && <Highlight text="SANTA ANNA" x={950} y={130} size={100} at={t.at('Santa Anna')} seed={85} rot={-2} />}
      <Note text="General Antonio López de Santa Anna" x={960} y={300} size={46} rot={-3} at={t.at('General') - 2} color="#ffffff" />
      <Note text="takes charge of Mexico" x={980} y={400} size={60} rot={-3} at={t.at('takes charge') - 2} />
      <Note text="throws out the" x={980} y={580} size={56} rot={-3} at={t.at('throws') - 2} color="#ffffff" />
      <Note text="1824 constitution" x={1000} y={670} size={66} rot={-3} at={t.at('federal') - 2} color={'#FF6F61'} />
      <Tag text="Antonio López de Santa Anna, lithograph · Library of Congress" />
    </AbsoluteFill>
  );
};

/** Centralism: every state's power pulled into Mexico City. */
const Centralism: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('moves power') - 1;
  const keys: Cam3[] = [
    {f: a, x: 2900, y: 2700, z: 0.36, tilt: 40, rot: 0},
    {f: t.at('centralism:'), x: 2950, y: 2850, z: 0.42, tilt: 48, rot: -4},
  ];
  const states = MEXICAN_STATES(D).filter((k) => k !== 'MEX:None' && k !== 'MEX:Distrito Federal' && k !== 'MEX:México');
  const pull = t.at('capital', 2) - 6;
  return (
    <>
      <Map3D data={D} keys={keys} states={interpolate(g, [a, a + 8, t.at('national') + 6, t.at('national') + 18], [0, 1, 1, 0.25], clamp)}>
        {(api) => (
          <>
            <StateTiles api={api} names={states} at={a} stagger={0.5} h={14} layers={3} color={MAP3D.mexico} fall={t.at('national') + 4} />
            {states.map((nm, i) => (
              <Route key={nm} api={api} pts={[centreOf(D.states[nm]), pl.mexicoCity]} at={pull + (i % 6)} dur={14} color="#f4efe6" width={4} bow={0.12} />
            ))}
            <Slab api={api} d={D.states['MEX:México']} at={t.at('capital', 2)} h={60} layers={8} color={MAP3D.us} clipLand={false} />
            <Dot api={api} at={pl.mexicoCity} show={t.at('capital', 2)} color={MAP3D.us} />
            <Stand api={api} at={[pl.mexicoCity[0], pl.mexicoCity[1] - 40]} z={90} show={t.at('capital', 2) + 2}><PlaceTag text="Mexico City" size={34} /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Definition term="centralism" def="the national government decides, not the states" at={t.at('centralism:')} x={110} y={860} w={1000} />
        <Note text="all power → the capital" x={110} y={90} size={64} rot={-3} at={t.at('moves power') - 2} color="#ffffff" />
      </AbsoluteFill>
    </>
  );
};

/** October 1835: the flag stands up at Gonzales. */
const GonzalesMap: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('October') - 1;
  const keys: Cam3[] = [
    {f: a, x: 3230, y: 2060, z: 2.2, tilt: 50, rot: -8},
    {f: t.at('Mexican soldiers'), x: 3240, y: 2070, z: 2.8, tilt: 54, rot: -12},
  ];
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Dot api={api} at={pl.gonzales} show={a + 2} color={MAP3D.us} />
            <Stand api={api} at={pl.gonzales} show={t.at('Gonzales,')}><Flag3 h={190} /></Stand>
            <Stand api={api} at={[pl.gonzales[0] + 30, pl.gonzales[1] + 14]} show={t.at('Gonzales,') + 3}><PlaceTag text="Gonzales" size={30} /></Stand>
            <Dot api={api} at={pl.sanAntonio} show={a + 4} color={MAP3D.mexico} />
            <Stand api={api} at={[pl.sanAntonio[0] - 20, pl.sanAntonio[1] + 14]} show={a + 6}><PlaceTag text="San Antonio" size={24} /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>{g >= t.at('October') && <Highlight text="OCTOBER 1835" x={100} y={90} size={100} at={t.at('October')} seed={87} rot={-2} />}</AbsoluteFill>
    </>
  );
};

/** "Come and take it": the flag gets its three words, shots, the revolution is on. */
const Gonzales: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const words = 'COME AND TAKE IT';
  const w0 = t.at('"Come and take') - 1;
  const shown = Math.max(0, Math.min(words.length, Math.floor((g - w0) / 1.2)));
  const flash = interpolate(g, [t.at('Shots'), t.at('Shots') + 2, t.at('Shots') + 9], [0, 0.7, 0], clamp);
  return (
    <Parallax name="gonzales_flag" src="img/gen/ch03_come_and_take_it.jpg" size={GEN} a={t.at('Mexican soldiers') - 1} b={t.at('March 2nd')} fx={0.42} fy={0.36}
      cam={{z: [1.0, 1.22], x: [0.06, -0.04], y: [0.06, -0.05]}} depth={1.06} vignette={0.35} mask={MASKS.gonzales_flag} tintStrength={0.45} traceAt={t.at('flag:')}
      tag="Illustration · Gonzales, Texas, October 2, 1835">
      {(p) => (
        <>
          {/* the three words, lettered onto the cloth (source pixels, riding the flag layer) */}
          <div style={{position: 'absolute', left: p.left + 386 * p.scale, top: p.top + 146 * p.scale, width: 150 * p.scale, transform: 'rotate(-6deg)', transformOrigin: 'left top',
            fontFamily: JF.heavy, fontWeight: 900, fontSize: 17 * p.scale, lineHeight: 1, letterSpacing: 0.4 * p.scale, color: '#16120d', whiteSpace: 'nowrap', mixBlendMode: 'multiply'}}>
            {words.slice(0, shown)}
          </div>
          <Note text="a cannon ✓" x={1250} y={130} size={56} rot={-3} at={t.at('cannon', 2) - 2} color="#ffffff" />
          <Note text="a star ✓" x={1270} y={230} size={56} rot={-3} at={t.at('star,') - 2} color="#ffffff" />
          <Note text="three words…" x={1290} y={330} size={56} rot={-3} at={t.at('three words') - 2} color="#ffffff" />
          <AbsoluteFill style={{background: '#fff6e0', opacity: flash, mixBlendMode: 'screen'}} />
          {g >= t.at('revolution') - 2 && <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 40%)'}} />}
          {g >= t.at('revolution') && <Highlight text="THE REVOLUTION IS ON" x={150} y={830} size={90} at={t.at('revolution')} seed={89} rot={-2} />}
        </>
      )}
    </Parallax>
  );
};

/** March 2, 1836: independence declared at Washington-on-the-Brazos. */
const Signing: React.FC<{t: TL}> = ({t}) => (
  <Parallax name="signer" src="img/gen/ch03_washington_on_the_brazos.jpg" size={GEN} a={t.at('March 2nd') - 1} b={t.at('Their declaration')} fx={0.47} fy={0.5}
    cam={{z: [1.02, 1.14], y: [0.02, -0.02]}} depth={1.05} vignette={0.45} mask={MASKS.signer} tintStrength={0.6} traceAt={t.at('declare')}
    tag="Illustration · the convention at Washington-on-the-Brazos, March 1836">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 30%)'}} />
        <Highlight text="MARCH 2, 1836" x={100} y={70} size={96} at={t.at('March 2nd')} seed={91} rot={-2} />
        <Note text="Washington-on-the-Brazos" x={1080} y={80} size={56} rot={-3} at={t.at('delegates') - 2} color="#ffffff" />
        <Note text="independence!" x={1200} y={180} size={66} rot={-3} at={t.at('independence.') - 2} />
      </>
    )}
  </Parallax>
);

/** One grievance: a window on the facsimile, the phrase looped. */
const Grievance: React.FC<{p: number; fx: number; fy: number; lx: number; ly: number; rx: number; x: number; y: number; at: number; loopAt: number; label: string; seed: number; rot: number}> = ({
  p, fx, fy, lx, ly, rx, x, y, at, loopAt, label, seed, rot,
}) => {
  const s = 0.4;
  return (
    <>
      <CropCard src={decl(p)} size={PAGE} x={x} y={y} w={760} h={290} fx={fx} fy={fy} scale={s} rot={rot} at={at}>
        {(S) => {
          const [cx, cy] = S(lx, ly);
          return <Loop cx={cx} cy={cy} rx={rx * s} ry={34} at={loopAt} seed={seed} tilt={-2} />;
        }}
      </CropCard>
      <Note text={label} x={x + 30} y={y + 312} size={50} rot={-2} at={loopAt} color="#ffffff" />
    </>
  );
};

/** The Declaration's list of wrongs, each on the facsimile. */
const Wrongs: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('wrongs:') && <Highlight text="MEXICO'S WRONGS" x={560} y={34} size={70} at={t.at('wrongs:')} seed={93} rot={-1} />}
      <Grievance p={38} fx={1250} fy={2330} lx={661} ly={2392} rx={380} x={120} y={170} at={t.at('Their declaration') - 1} loopAt={t.at('jury', 2)} label="no jury trials" seed={11} rot={-1.5} />
      <Grievance p={38} fx={1350} fy={2930} lx={1460} ly={2958} rx={660} x={1030} y={190} at={t.at('public') - 4} loopAt={t.at('public')} label="no public schools" seed={12} rot={1.2} />
      <Grievance p={40} fx={1250} fy={2560} lx={850} ly={2606} rx={500} x={140} y={600} at={t.at('demanded') - 4} loopAt={t.at('weapons')} label="demanded their weapons" seed={13} rot={1} />
      <Grievance p={37} fx={1350} fy={1800} lx={1460} ly={1787} rx={580} x={1010} y={620} at={t.at('threw') - 4} loopAt={t.at('threw')} label="threw out the constitution" seed={14} rot={-1.2} />
      <Tag text={DECL_TAG} />
    </AbsoluteFill>
  );
};

/** Three Mexican-born signers. */
const Signers: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Three of') - 1;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src={decl(43)} size={PAGE} x={110} y={130} w={820} h={640} fx={950} fy={2620} scale={0.5} rot={-1.5} at={a}>
        {(S) => {
          const [nx, ny] = S(967, 2793);
          const [rx, ry] = S(895, 2580);
          return (
            <>
              <Loop cx={rx} cy={ry} rx={170} ry={46} at={t.at('Mexican-born') + 4} seed={31} tilt={-2} />
              <Loop cx={nx} cy={ny} rx={255} ry={46} at={t.at('Navarro') - 2} seed={33} tilt={-3} width={7} />
            </>
          );
        }}
      </CropCard>
      <CropCard src={decl(44)} size={PAGE} x={1050} y={140} w={760} h={250} fx={820} fy={600} scale={0.55} rot={1.5} at={a + 6}>
        {(S) => {
          const [zx, zy] = S(820, 590);
          return <Loop cx={zx} cy={zy} rx={260} ry={50} at={t.at('Mexican-born') + 10} seed={35} tilt={-2} />;
        }}
      </CropCard>
      <Stamp text="3 Mexican-born signers" x={1010} y={470} at={t.at('Mexican-born')} size={66} color={pal.subject} rot={-2} />
      <Note text="José Antonio Navarro" x={1030} y={590} size={60} rot={-3} at={t.at('José') - 2} />
      <Note text="+ Francisco Ruiz, Lorenzo de Zavala" x={1040} y={700} size={42} rot={-3} at={t.at('Mexican-born') + 12} color="#ffffff" />
      <Note text="not only an American fight" x={300} y={860} size={68} rot={-3} at={t.at("wasn't") - 2} color="#ffffff" />
      <Tag text={DECL_TAG} />
    </AbsoluteFill>
  );
};

/** What the Declaration doesn't mention. */
const NotOnce: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at("But here's") - 1;
  return (
    <AbsoluteFill>
      <DarkPaper />
      {[37, 38, 34].map((p, i) => (
        <CropCard key={p} src={decl(p)} size={PAGE} x={150 + i * 70} y={110 + i * 30} w={560} h={800} fx={1360} fy={2000} scale={0.22} rot={-4 + i * 3} at={a + i * 2} />
      ))}
      <Note text="what's missing?" x={1050} y={160} size={70} rot={-3} at={t.at("doesn't", 2) - 2} color="#ffffff" />
      {g >= t.at('Slavery.') && <Highlight text="SLAVERY" x={1050} y={330} size={130} at={t.at('Slavery.')} seed={95} rot={-2} />}
      <Stamp text="0 mentions" x={1080} y={560} at={t.at('Not once') + 2} size={110} color={pal.subject} rot={-4} />
      <Tag text={DECL_TAG} />
    </AbsoluteFill>
  );
};

/** The constitution of March 17, 1836, General Provisions Sec. 9 (excerpts, reset in type), marked up. */
const SEC9: {text: string; mark?: string}[] = [
  {text: 'All persons of color who were slaves for life previous to their emigration to Texas, and who are now held in bondage, shall remain in the like state of servitude… '},
  {text: 'Congress shall pass no laws to prohibit emigrants from the United States of America from bringing their slaves into the Republic with them… '},
  {text: 'nor shall Congress have power to emancipate slaves', mark: 'free'},
  {text: '… '},
  {text: 'No free person of African descent, either in whole or in part, shall be permitted to reside permanently in the Republic, without the consent of Congress', mark: 'Free Black'},
  {text: '…'},
];

const ConstitutionCard: React.FC<{t: TL; x: number; y: number; w: number; size: number; at: number; rot?: number; marks?: boolean}> = ({t, x, y, w, size, at, rot = 0, marks = true}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 6], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, padding: `${size * 1.4}px ${size * 1.6}px`, background: '#efe8d8', color: '#1b1712', boxShadow: '0 18px 34px rgba(0,0,0,0.6)',
      transform: `scale(${0.7 + 0.3 * k}) rotate(${rot}deg)`, opacity: k, transformOrigin: 'center top'}}>
      <div style={{fontFamily: JF.heavy, fontWeight: 900, fontSize: size * 1.25, textAlign: 'center', letterSpacing: 2}}>CONSTITUTION</div>
      <div style={{fontFamily: JF.heavy, fontWeight: 400, fontSize: size * 0.8, textAlign: 'center', letterSpacing: 3, marginTop: 4}}>OF THE REPUBLIC OF TEXAS · MARCH 17, 1836</div>
      <div style={{height: 2, background: '#1b1712', margin: `${size * 0.7}px 0`}} />
      <div style={{fontFamily: JF.heavy, fontSize: size * 0.85, letterSpacing: 2, marginBottom: size * 0.5}}>GENERAL PROVISIONS · SEC. 9</div>
      <div style={{fontFamily: '"Playfair Display", serif', fontSize: size, lineHeight: 1.45, textAlign: 'justify'}}>
        {SEC9.map((s, i) => {
          if (!s.mark || !marks) return <span key={i}>{s.text}</span>;
          const m = t.at(s.mark) - 2;
          const p = interpolate(g, [m, m + 10], [0, 100], clamp);
          return <span key={i} style={{backgroundImage: `linear-gradient(to right, ${pal.subject}99 ${p}%, transparent ${p}%)`, fontWeight: p > 0 ? 700 : 400}}>{s.text}</span>;
        })}
      </div>
    </div>
  );
};

/** Two weeks later: the constitution protects slavery. */
const Constitution: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <ConstitutionCard t={t} x={100} y={90} w={960} size={29} at={t.at('Two weeks') - 1} rot={-1} />
      {g >= t.at('Two weeks') && <Highlight text="2 WEEKS LATER" x={1180} y={110} size={74} at={t.at('Two weeks')} seed={97} rot={-2} />}
      <Note text="it protects slavery" x={1190} y={300} size={62} rot={-3} at={t.at('protects') - 2} />
      <Note text="congress can never" x={1190} y={430} size={50} rot={-3} at={t.at('never') - 2} color="#ffffff" />
      <Note text="free anyone enslaved" x={1210} y={510} size={50} rot={-3} at={t.at('free') - 2} color="#ffffff" />
      <Note text="free Black people" x={1190} y={600} size={50} rot={-3} at={t.at('Free Black') - 2} color="#ffffff" />
      <Note text="need permission to live there" x={1210} y={690} size={50} rot={-3} at={t.at('permission.') - 4} color="#ffffff" />
      <Tag text="Constitution of the Republic of Texas (1836), General Provisions Sec. 9 · excerpts, reset in type" />
    </AbsoluteFill>
  );
};

/** Freedom, or slavery? Both, at once. */
const Both: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('So was') - 1;
  const dim = interpolate(g, [t.at('Freedom for') - 4, t.at('Freedom for') + 4, t.at('Both,') - 2, t.at('Both,') + 6], [0, 0.5, 0.5, 0.65], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src={decl(34)} size={PAGE} x={150} y={250} w={620} h={620} fx={1360} fy={900} scale={0.36} rot={-2} at={a} />
      <ConstitutionCard t={t} x={1030} y={250} w={760} size={21} at={a + 4} rot={1.5} marks={false} />
      {g >= t.at('freedom,') && <Highlight text="FREEDOM?" x={200} y={80} size={96} at={t.at('freedom,')} seed={99} rot={-2} />}
      {g >= t.at('slavery', 3) && <Highlight text="SLAVERY?" x={1080} y={80} size={96} at={t.at('slavery', 3)} seed={101} rot={-2} />}
      <Note text="vs. a dictator, for promised rights" x={120} y={900} size={46} rot={-2} at={t.at('dictator') - 2} color="#ffffff" />
      <Note text="what else they meant to protect" x={1030} y={900} size={46} rot={-2} at={t.at('protect.') - 4} color="#ffffff" />
      <AbsoluteFill style={{background: '#000', opacity: dim}} />
      <Note text="freedom for some Texans" x={130} y={420} size={64} rot={-3} at={t.at('Freedom for') - 2} />
      <Note text="slavery for others" x={1150} y={420} size={64} rot={-3} at={t.at('Slavery for') - 2} color={pal.subject} />
      {g >= t.at('Both,') && <Highlight text="BOTH, AT ONCE." x={520} y={600} size={120} at={t.at('Both,')} seed={103} rot={-2} />}
      <Tag text={`${DECL_TAG} · Constitution of 1836, Sec. 9`} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Evidence t={t} />],
    [at("Texas didn't") - 1, <Coahuila t={t} />],
    [at('In 1833,') - 1, <Jail t={t} />],
    [at('Meanwhile,') - 1, <SantaAnna t={t} />],
    [at('moves power') - 1, <Centralism t={t} />],
    [at('October') - 1, <GonzalesMap t={t} />],
    [at('Mexican soldiers') - 1, <Gonzales t={t} />],
    [at('March 2nd') - 1, <Signing t={t} />],
    [at('Their declaration') - 1, <Wrongs t={t} />],
    [at('Three of') - 1, <Signers t={t} />],
    [at("But here's") - 1, <NotOnce t={t} />],
    [at('Two weeks') - 1, <Constitution t={t} />],
    [at('So was') - 1, <Both t={t} />],
  ];
  const scene = useScene(cuts);
  const notes = ['break', 'evidence.', 'Spanish.', 'jury', 'religion', 'ask', 'separate', 'jail,', 'General', 'takes charge', 'throws', 'federal', 'moves power',
    'star,', 'three words', 'delegates', 'independence.', 'José', "wasn't", 'protects', 'never', 'Free Black', 'dictator', 'protect.', 'Freedom for', 'Slavery for'];
  return (
    <>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['why', '1833,', 'Santa Anna', 'October', 'March 2nd', 'wrongs:', 'Slavery.', 'Two weeks', 'freedom,'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {['Mexican-born', 'Not once', 'Both,'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.38} />)}
      {notes.map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {[['jury', 2], ['public', 1], ['weapons', 1], ['threw', 1]].map(([c, n]) => <Sfx key={c as string} at={at(c as string, n as number)} src="sfx/marker_tick.wav" volume={0.4} />)}
      <Sfx at={at('capital', 2) - 6} src="sfx/whoosh.wav" volume={0.35} />
      <Sfx at={at('"Come and take') - 1} src="sfx/quill.wav" volume={0.4} />
      <Sfx at={at('slavery', 3)} src="sfx/stamp.wav" volume={0.28} />
      <Sfx at={at('cannon', 2) - 2} src={WRITE.src} volume={WRITE.volume} />
      <Sfx at={at("doesn't", 2) - 2} src={WRITE.src} volume={WRITE.volume} />
      <Sfx at={at('Shots')} src="sfx/boom.wav" volume={0.5} />
      <Sfx at={at('Two weeks') - 1} src="sfx/page_turn.wav" volume={0.4} />
    </>
  );
};

const TM = makeTimeline(N, 30);

export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch03_come_and_take_it.wav" lead={LEAD} music={[
    {src: 'music/g_grip.mp3', volume: 0.15, to: TM.at('October') + 6},
    {src: 'music/r_abolition_b.mp3', volume: 0.15, from: TM.at('October') - 6},
  ]}>
    <Body />
  </ChapterShell>
);
