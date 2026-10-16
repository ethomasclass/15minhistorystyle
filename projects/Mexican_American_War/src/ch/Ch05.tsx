// Chapter 5 · Polk Acts First: Polk wants California, Manifest Destiny, the offer Mexico won't hear, Taylor to the
// Rio Grande, the April 25 ambush, two weeks by horse, the May 9 cabinet and diary, the war message and vote, who decided.
import React from 'react';
import {AbsoluteFill, interpolate, random} from 'remotion';
import mapData from '../../public/maps/mex1846.json';
import words from '../../public/audio/ch05_polk_acts_first.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {Border, type Cam3, Count, Dot, Fill, Glow, Hand, MAP3D, Map3D, type MapData, PlaceTag, Route, Slab, Stake, Stand} from '../kit/map3d';
import {Parallax} from '../kit/parallax';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, Quote, Stamp, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
const D = mapData as unknown as MapData;
const pl = D.places;
export const CH05_FRAMES = chapterFrames(N, LEAD);

const GEN: [number, number] = [1376, 768];
const CAMP: [number, number] = [1185, 700];
const GAST: [number, number] = [2414, 1804];
const POLK: [number, number] = [1920, 2309];
const PAGE: [number, number] = [2444, 4152];
const DIARY_TAG = 'The Diary of James K. Polk, ed. M. M. Quaife (1910), vol. 1, pp. 384–386';

/** Meet the new president. */
const Polk: React.FC<{t: TL}> = ({t}) => (
  <Parallax name="polk" src="img/ch01/polk_brady_1849.jpg" size={POLK} a={-10} b={t.at('He wants')} fx={0.5} fy={0.3}
    cam={{z: [1.06, 1.14], x: [0.02, 0.0]}} depth={1.06} vignette={0.5} mask={MASKS.polk} tintStrength={0.6} traceAt={t.at('James')}
    tag="Mathew Brady, James K. Polk, 1849 · Library of Congress">
    {() => <Highlight text="PRESIDENT POLK" x={100} y={100} size={84} at={t.at('James')} seed={131} rot={-2} />}
  </Parallax>
);

/** He wants California and San Francisco Bay. */
const Wants: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('He wants') - 1;
  const keys: Cam3[] = [
    {f: a, x: 2200, y: 1500, z: 0.42, tilt: 40, rot: 0},
    {f: t.at('San Francisco'), x: 1400, y: 1200, z: 0.6, tilt: 46, rot: 4},
  ];
  return (
    <Map3D data={D} keys={keys}>
      {(api) => (
        <>
          <Fill api={api} region="cession" at={t.at('California,')} color={MAP3D.us} opacity={0.3} outline={MAP3D.us} />
          <Stand api={api} at={[1300, 1500]} z={40} show={t.at('California,') + 2}><Hand text="California" size={74} color="#ffffff" bg /></Stand>
          <Dot api={api} at={pl.sanFrancisco} show={t.at('harbor') - 2} color={MAP3D.us} r={14} />
          <Stand api={api} at={[pl.sanFrancisco[0], pl.sanFrancisco[1] - 10]} z={10} show={t.at('harbor')}><PlaceTag text="San Francisco Bay" size={30} /></Stand>
        </>
      )}
    </Map3D>
  );
};

/** Manifest Destiny, over Gast's American Progress. */
const Destiny: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Parallax name="gast_columbia" src="img/ch05/gast_american_progress.jpg" size={GAST} a={t.at('In 1845,') - 1} b={t.at('Polk tries')} fx={0.55} fy={0.42}
      cam={{z: [1.05, 1.15], x: [0.06, -0.3], y: [-0.02, 0.08]}} depth={1.05} vignette={0.45} mask={MASKS.gast_columbia} tintStrength={0.45} traceAt={t.at('Manifest')}
      tag="John Gast, American Progress (painted 1872), chromolithograph c1873 · Library of Congress">
      {(p) => {
        const nx = p.left + 364 * p.scale, ny = p.top + 1216 * p.scale;
        return (
          <>
            <AbsoluteFill style={{background: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 40%)'}} />
            <Highlight text="1845" x={90} y={80} size={100} at={t.at('In 1845,')} seed={133} rot={-2} />
            <Note text="a magazine editor names an idea" x={100} y={240} size={50} rot={-3} at={t.at('editor') - 2} color="#ffffff" out={t.at('believers,')} />
            {g >= t.at('Manifest') && g < t.at('believers,') && <Highlight text="MANIFEST DESTINY" x={100} y={340} size={84} at={t.at('Manifest')} seed={135} rot={-2} />}
            {g < t.at('Mexicans') && <Definition term="Manifest Destiny" def="the belief that the U.S. was meant, even chosen by God, to spread across the whole continent" at={t.at('belief')} x={100} y={840} w={1100} />}
            <Note text="believers: farms, towns, self-government → west" x={100} y={250} size={50} rot={-3} at={t.at('believers,')} color="#ffffff" out={t.at('Mexicans')} />
            {g >= t.at('Mexicans') - 2 && <Loop cx={nx} cy={ny} rx={340 * p.scale} ry={200 * p.scale} at={t.at('Mexicans')} seed={51} tilt={-4} color={pal.subject} />}
            <Note text="the people already there" x={100} y={250} size={54} rot={-3} at={t.at('Native') - 2} color={pal.subject} />
            <Note text="someone else decided" x={110} y={350} size={54} rot={-3} at={t.at('someone') - 2} color="#ffffff" />
            <Note text="their land was America's future" x={130} y={440} size={54} rot={-3} at={t.at('decided') + 4} color="#ffffff" />
            <Note text="(painted 1872)" x={1600} y={970} size={34} rot={-2} at={t.at('Manifest')} color="#ffffff" />
          </>
        );
      }}
    </Parallax>
  );
};

/** Polk tries to buy it: $25 million; Mexico won't even meet his man. */
const Buy: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Polk tries') - 1;
  const keys: Cam3[] = [
    {f: a, x: 2500, y: 1700, z: 0.36, tilt: 38, rot: 0},
    {f: t.at('diplomat'), x: 3300, y: 2000, z: 0.3, tilt: 36, rot: 0},
    {f: t.at('To Mexico,', 2), x: 2700, y: 1800, z: 0.36, tilt: 40, rot: -2},
  ];
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Fill api={api} region="cession" at={a} color={MAP3D.us} opacity={0.18} />
            <Border api={api} d={D.regions.cession} at={a + 2} dur={24} color={MAP3D.us} dashed />
            <Stand api={api} at={[1700, 1500]} z={50} show={t.at('25') - 2}><Hand text="$25 million?" size={80} color="#ffffff" bg /></Stand>
            <Dot api={api} at={pl.washingtonDC} show={t.at('sends') - 2} color={MAP3D.us} />
            <Dot api={api} at={pl.mexicoCity} show={t.at('sends') - 2} color={MAP3D.mexico} />
            <Route api={api} pts={[pl.washingtonDC, pl.mexicoCity]} at={t.at('sends')} dur={24} color="#f4efe6" width={8} bow={0.25} dashed />
            <Stand api={api} at={[pl.mexicoCity[0], pl.mexicoCity[1] - 30]} z={20} show={t.at('City') + 2}><PlaceTag text="Mexico City" size={30} /></Stand>
            <Slab api={api} d={D.states['USA:Texas']} at={t.at('taken')} h={40} layers={8} color={MAP3D.us} clipLand={false} />
            <Glow api={api} d={D.regions.cession} at={t.at('wanted more') - 2} color={pal.subject} />
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Note text="first, try to buy it" x={110} y={90} size={62} rot={-3} at={t.at('buy') - 2} color="#ffffff" />
        <Note text="California + New Mexico" x={130} y={190} size={54} rot={-3} at={t.at('California', 2) - 2} />
        <Stamp text="WON'T MEET HIM" x={1080} y={120} at={t.at('meet', 2)} size={90} color={pal.subject} rot={-6} />
        <Note text="to Mexico: the U.S. just took Texas…" x={110} y={820} size={56} rot={-3} at={t.at('To Mexico,', 2) - 2} color="#ffffff" />
        <Note text="…now it wants more" x={150} y={920} size={56} rot={-3} at={t.at('wanted more') - 2} color={pal.subject} />
      </AbsoluteFill>
    </>
  );
};

/** January 1846: Taylor to the Rio Grande, straight into the strip. */
const Taylor: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('So in January') - 1;
  const keys: Cam3[] = [
    {f: a, x: 3180, y: 2180, z: 1.3, tilt: 48, rot: -6},
    {f: t.at('Straight'), x: 3200, y: 2300, z: 1.8, tilt: 52, rot: -10},
  ];
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Border api={api} d={D.lines.nueces} at={a + 2} color={MAP3D.mexico} dashed label="Nueces · Mexico's line" labelSize={24} labelTo={0.9} />
            <Border api={api} d={D.lines.rioGrande} at={a + 6} color={MAP3D.us} dashed label="Rio Grande · Texas's claim" labelSize={24} labelTo={0.3} />
            <Dot api={api} at={pl.corpusChristi} show={a + 4} color={MAP3D.us} />
            <Stand api={api} at={[pl.corpusChristi[0] + 10, pl.corpusChristi[1] - 6]} show={a + 6}><PlaceTag text="Corpus Christi" size={24} /></Stand>
            <Route api={api} pts={[pl.corpusChristi, [3255, 2400], pl.fortTexas]} at={t.at('orders')} dur={36} color="#f4efe6" width={16} bow={0.05} />
            <Fill api={api} region="nuecesStrip" at={t.at('Straight')} color="#FF6F61" opacity={0.25} hatch="rgba(255,111,97,0.7)" />
            <Dot api={api} at={pl.matamoros} show={t.at('Rio') - 2} color={MAP3D.mexico} r={12} />
            <Stand api={api} at={[pl.matamoros[0] - 20, pl.matamoros[1] + 16]} show={t.at('Rio')}><PlaceTag text="Matamoros" size={26} /></Stand>
            <Stand api={api} at={[3130, 2330]} z={30} show={t.at("Taylor's")}><Hand text="Taylor's army" size={56} color="#ffffff" bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        {g >= t.at('January') && <Highlight text="JANUARY 1846" x={100} y={90} size={96} at={t.at('January')} seed={137} rot={-2} />}
        <Note text="into the land between the rivers" x={110} y={830} size={60} rot={-3} at={t.at('Straight') - 2} color="#ffffff" />
      </AbsoluteFill>
    </>
  );
};

/** The camp across from Matamoros: "leave." He doesn't. */
const Camp: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Parallax name="camp_matamoros" src="img/gen/ch05_rio_grande_camp.jpg" size={CAMP} a={t.at("Mexico's commander") - 1} b={t.at('April')} fx={0.5} fy={0.35}
      cam={{z: [1.0, 1.1], y: [-0.06, 0.0]}} depth={1.03} vignette={0.4} mask={MASKS.camp_matamoros} tintStrength={0.5} traceAt={t.at("Mexico's commander")}
      tag="Illustration · the U.S. camp across the Rio Grande from Matamoros, April 1846">
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 40%)'}} />
          <Note text="Matamoros" x={820} y={110} size={60} rot={-3} at={t.at("Mexico's commander") + 2} color={pal.subject} />
          <Note text="“leave.”" x={140} y={720} size={84} rot={-4} at={t.at('leave.') - 4} color="#ffffff" />
          <Stamp text="HE DOESN'T" x={900} y={760} at={t.at("doesn't")} size={110} color={pal.subject} rot={-5} />
        </>
      )}
    </Parallax>
  );
};

/** The trap at Rancho de Carricitos, top-down: a field closed in by chaparral, one gate; the dragoons ride in, the
 *  Mexican cavalry rings the brush and shuts the gate. Drawn as a diagram card over the map. Card coordinates 0..800. */
const TrapDiagram: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const pal = usePal();
  const C = [420, 455];
  const GATE = (150 * Math.PI) / 180;   // the gap in the brush, lower left
  const GAP = (15 * Math.PI) / 180;
  const pol = (r: number, ang: number) => [C[0] + r * Math.cos(ang), C[1] + r * Math.sin(ang)];
  const rnd = (k: string) => random(`trap-${k}`);
  const k = interpolate(g, [a, a + 8], [0, 1], clamp);
  const sur = t.at('surround');
  // the brush ring, drawn on around the field
  const brushP = interpolate(g, [a + 2, a + 18], [0, 1], clamp);
  const bushes = Array.from({length: 230}).map((_, i) => {
    let ang = (i / 230) * Math.PI * 2 + rnd(`ba${i}`) * 0.03;
    const d = Math.atan2(Math.sin(ang - GATE), Math.cos(ang - GATE));
    if (Math.abs(d) < GAP) return null;
    const r = 232 + rnd(`br${i}`) * 50;
    const [x, y] = pol(r, ang);
    const order = ((ang - GATE + Math.PI * 4) % (Math.PI * 2)) / (Math.PI * 2);
    if (order > brushP) return null;
    return <circle key={i} cx={x} cy={y} r={9 + rnd(`bs${i}`) * 9} fill="#3a3229" stroke="#1d1914" strokeWidth={1.5} opacity={0.9} />;
  });
  // dragoons: ride in through the gate, then mill inside
  const inAt = a + 10, inEnd = t.at('Mexican cavalry');
  const killed = t.at('dozen');
  const caught = t.at('captured.') - 6;
  const dragoons = Array.from({length: 16}).map((_, i) => {
    const s = interpolate(g, [inAt + i * 1.2, inEnd + i * 1.2], [0, 1], {...clamp, easing: (x) => 1 - Math.pow(1 - x, 2)});
    const [x0, y0] = pol(380, GATE);
    const [x1, y1] = pol(60 + rnd(`dr${i}`) * 120, GATE + 2.2 + rnd(`da${i}`) * 2.2);
    const x = x0 + (x1 - x0) * s, y = y0 + (y1 - y0) * s;
    const dead = i % 4 === 0 && g >= killed + i;
    const held = !dead && g >= caught;
    if (g < inAt + i * 1.2) return null;
    return (
      <g key={i}>
        {dead ? <text x={x} y={y + 11} textAnchor="middle" fontSize={34} fontFamily={JF.sans} fontWeight={900} fill="#3a332b">✕</text>
          : <circle cx={x} cy={y} r={11} fill={MAP3D.us} stroke="#1b1712" strokeWidth={2.5} />}
        {held && <circle cx={x} cy={y} r={17} fill="none" stroke={MAP3D.mexico} strokeWidth={3} />}
      </g>
    );
  });
  // Mexican cavalry: close in from outside to a ring around the brush; a group shuts the gate
  const lancers = Array.from({length: 34}).map((_, i) => {
    const atGate = i < 7;
    const ang = atGate ? GATE + (i - 3) * 0.045 : (i / 34) * Math.PI * 2 + rnd(`la${i}`) * 0.1;
    const r1 = atGate ? 245 + (i % 2) * 32 : 305 + rnd(`lr${i}`) * 20;
    const s = interpolate(g, [t.at('Mexican cavalry') - 4 + (i % 6), sur + 10 + (i % 6) + (atGate ? 8 : 0)], [0, 1], {...clamp, easing: (x) => 1 - Math.pow(1 - x, 2)});
    const [x0, y0] = pol(520 + rnd(`l0${i}`) * 80, ang);
    const [x1, y1] = pol(r1, ang);
    if (s <= 0) return null;
    const x = x0 + (x1 - x0) * s, y = y0 + (y1 - y0) * s;
    return (
      <g key={i}>
        <line x1={x} y1={y} x2={x + 5} y2={y - 26} stroke="#1b1712" strokeWidth={2} />
        <circle cx={x} cy={y} r={10} fill={MAP3D.mexico} stroke="#1b1712" strokeWidth={2.5} />
      </g>
    );
  });
  const gateShut = interpolate(g, [sur + 14, sur + 22], [0, 1], clamp);
  const [gx, gy] = pol(340, GATE);
  return (
    <div style={{position: 'absolute', left: 1020, top: 110, width: 800, height: 840, background: '#efe8d8', boxShadow: '0 22px 40px rgba(0,0,0,0.65)',
      opacity: k, transform: `scale(${0.85 + 0.15 * k}) rotate(1.2deg)`, transformOrigin: '50% 40%'}}>
      <svg width={800} height={840} style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
        <defs>
          <pattern id="trapgrass" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <line x1="0" y1="0" x2="0" y2="14" stroke="#c9bfa8" strokeWidth="1.2" />
          </pattern>
        </defs>
        <circle cx={C[0]} cy={C[1]} r={232} fill="url(#trapgrass)" />
        {bushes}
        {dragoons}
        {lancers}
        {/* the gate: two posts at the gap */}
        {[-1, 1].map((sgn) => { const [px, py] = pol(258, GATE + sgn * GAP * 0.95); return <rect key={sgn} x={px - 5} y={py - 16} width={10} height={32} fill="#1b1712" opacity={brushP} />; })}
        {/* the way in */}
        <text x={gx + 40} y={gy + 92} textAnchor="middle" style={{fontFamily: '"Nanum Pen Script", cursive', fontSize: 40, fill: '#1b1712', opacity: interpolate(g, [a + 16, a + 22, sur, sur + 6], [0, 1, 1, 0], clamp)}}>the only way in</text>
        <path d={`M${gx + 30},${gy + 58} L${gx + 40},${gy + 18}`} stroke="#1b1712" strokeWidth={3} opacity={interpolate(g, [a + 16, a + 22, sur, sur + 6], [0, 1, 1, 0], clamp)} />
        <text x={640} y={150} textAnchor="middle" style={{fontFamily: '"Nanum Pen Script", cursive', fontSize: 38, fill: '#1b1712', opacity: interpolate(g, [a + 14, a + 20], [0, 1], clamp)}}>thick chaparral</text>
        {gateShut > 0 && <text x={gx - 40} y={gy - 40} textAnchor="middle" style={{fontFamily: '"Nanum Pen Script", cursive', fontSize: 44, fill: pal.subject, opacity: gateShut}}>shut</text>}
      </svg>
      <div style={{position: 'absolute', left: 30, top: 18, fontFamily: JF.heavy, fontWeight: 900, fontSize: 32, letterSpacing: 2, color: '#1b1712'}}>RANCHO DE CARRICITOS</div>
      <div style={{position: 'absolute', left: 30, top: 58, fontFamily: JF.mono, fontSize: 20, letterSpacing: 2, color: '#5a5248'}}>A TRAP · DIAGRAM, NOT TO SCALE</div>
      <div style={{position: 'absolute', left: 30, bottom: 22, display: 'flex', gap: 28, alignItems: 'center', fontFamily: JF.sans, fontWeight: 600, fontSize: 22, color: '#1b1712'}}>
        <span><span style={{display: 'inline-block', width: 18, height: 18, borderRadius: 9, background: MAP3D.us, border: '2px solid #1b1712', verticalAlign: -3, marginRight: 8}} />U.S. dragoons (63)</span>
        <span><span style={{display: 'inline-block', width: 18, height: 18, borderRadius: 9, background: MAP3D.mexico, border: '2px solid #1b1712', verticalAlign: -3, marginRight: 8}} />Mexican cavalry</span>
      </div>
    </div>
  );
};

/** April 25: on the map, the X in the strip; beside it, the trap. */
const Ambush: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('April') - 1;
  const keys: Cam3[] = [
    {f: a, x: 3420, y: 2380, z: 1.6, tilt: 52, rot: -10},
    {f: t.at('In 1846,') - 1, x: 3440, y: 2420, z: 1.9, tilt: 54, rot: -12},
  ];
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Border api={api} d={D.lines.nueces} at={-99} dur={1} color={MAP3D.mexico} dashed />
            <Border api={api} d={D.lines.rioGrande} at={-99} dur={1} color={MAP3D.us} dashed />
            <Fill api={api} region="nuecesStrip" at={-99} color="#FF6F61" opacity={0.25} hatch="rgba(255,111,97,0.7)" />
            <Dot api={api} at={pl.matamoros} color={MAP3D.mexico} r={12} />
            <Stand api={api} at={[pl.matamoros[0] - 20, pl.matamoros[1] + 16]}><PlaceTag text="Matamoros" size={26} /></Stand>
            <Stand api={api} at={pl.carricitos} show={a + 2}><Stake /></Stand>
            <Stand api={api} at={[pl.carricitos[0] - 70, pl.carricitos[1] - 30]} z={20} show={a + 6}><PlaceTag text="Rancho de Carricitos" size={26} /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 40%)'}} />
        {g >= t.at('April') && <Highlight text="APRIL 25, 1846" x={90} y={70} size={84} at={t.at('April')} seed={139} rot={-2} />}
        <Note text="a U.S. patrol rides into a ranch field" x={90} y={230} size={44} rot={-2} at={a + 8} color="#ffffff" />
        <Note text="Mexican cavalry surround it" x={90} y={320} size={48} rot={-2} at={t.at('surround') - 2} color="#ffffff" />
        <Note text="a dozen+ killed or wounded" x={90} y={800} size={50} rot={-3} at={t.at('dozen') - 2} color="#ffffff" />
        <Note text="most of the rest captured" x={110} y={890} size={50} rot={-3} at={t.at('captured.') - 4} color="#ffffff" />
        <TrapDiagram t={t} a={a} />
        <Tag text="Diagram after the accounts of the Thornton Affair · not to scale" />
      </AbsoluteFill>
    </>
  );
};

/** News travels at the speed of a horse. */
const Rider: React.FC<{t: TL}> = ({t}) => (
  <Parallax name="rider" src="img/gen/ch05_rider.jpg" size={GEN} a={t.at('In 1846,') - 1} b={t.at('It takes')} fx={0.45} fy={0.5}
    cam={{z: [1.0, 1.1], x: [0.06, -0.06]}} depth={1.08} vignette={0.45} mask={MASKS.rider} tintStrength={0.6} traceAt={t.at('horse.') - 4}
    tag="Illustration · an express rider, 1846">
    {() => <Note text="news moves at the speed of a horse" x={110} y={880} size={60} rot={-3} at={t.at('speed') - 4} color="#ffffff" />}
  </Parallax>
);

/** Two weeks to Washington: the day counter. */
const TwoWeeks: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('It takes') - 1;
  const end = t.at('And on May') - 1;
  const keys: Cam3[] = [
    {f: a, x: 3500, y: 2100, z: 0.7, tilt: 46, rot: -4},
    {f: end, x: 4200, y: 1500, z: 0.36, tilt: 36, rot: 0},
  ];
  const day = Math.round(interpolate(g, [a + 4, end + 2], [1, 14], clamp));
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Fill api={api} region="nuecesStrip" at={-99} color="#FF6F61" opacity={0.25} hatch="rgba(255,111,97,0.7)" />
            <Stand api={api} at={pl.carricitos}><Stake /></Stand>
            <Route api={api} pts={[pl.carricitos, pl.neworleans, pl.washingtonDC]} at={a + 2} dur={end - a} color="#f4efe6" width={8} bow={0.12} dashed />
            <Dot api={api} at={pl.washingtonDC} show={a} color={MAP3D.us} r={14} />
            <Stand api={api} at={[pl.washingtonDC[0], pl.washingtonDC[1] - 20]} z={20} show={a + 2}><PlaceTag text="Washington" size={30} /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 110, top: 80, fontFamily: JF.display, fontSize: 120, color: '#f4efe6', textShadow: '0 6px 22px rgba(0,0,0,0.8)'}}>day {day}</div>
        <Note text="about two weeks to Washington" x={120} y={260} size={56} rot={-3} at={t.at('two weeks') - 2} color="#ffffff" />
      </AbsoluteFill>
    </>
  );
};

/** May 9: the cabinet agrees on war before the news; that evening it comes. Polk's diary. */
const Diary: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('And on May') - 1;
  const ev = t.at('That same') - 1;
  const s = 0.3;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src="img/ch05/polk_diary_429.jpg" size={PAGE} x={120} y={110} w={720} h={860} fx={1222} fy={1700} scale={s} rot={-1.5} at={a}>
        {(S) => {
          const [dx, dy] = S(970, 893);
          const [nx, ny] = S(1322, 1985);
          const [cx, cy] = S(812, 2281);
          return (
            <>
              <Loop cx={dx} cy={dy} rx={630 * s} ry={30} at={t.at('May 9th') + 2} seed={61} tilt={-1} />
              <Loop cx={nx} cy={ny} rx={1000 * s} ry={30} at={t.at('before it arrives') + 2} seed={63} tilt={-1} />
              <Loop cx={cx} cy={cy} rx={470 * s} ry={30} at={t.at('anyway.') - 6} seed={65} tilt={-2} color={pal.subject} width={6} />
            </>
          );
        }}
      </CropCard>
      <CropCard src="img/ch05/polk_diary_431.jpg" size={PAGE} x={1000} y={170} w={720} h={700} fx={1222} fy={1000} scale={s} rot={1.5} at={ev}>
        {(S) => {
          const [ax, ay] = S(890, 397);
          const [kx, ky] = S(1398, 988);
          return (
            <>
              <Loop cx={ax} cy={ay} rx={450 * s} ry={30} at={ev + 6} seed={67} tilt={-2} color={pal.subject} width={6} />
              <Loop cx={kx} cy={ky} rx={1040 * s} ry={30} at={t.at('news arrives') + 2} seed={69} tilt={-1} />
            </>
          );
        }}
      </CropCard>
      {g >= t.at('May 9th') && g < ev && <Highlight text="MAY 9, 1846" x={1000} y={110} size={90} at={t.at('May 9th')} seed={141} rot={-2} />}
      {g < ev && <Note text="no attack heard of yet…" x={1010} y={280} size={52} rot={-3} at={t.at('before it arrives') - 2} color="#ffffff" />}
      {g < ev && <Note text="…“ample cause of war” anyway" x={1010} y={380} size={46} rot={-3} at={t.at('anyway.') - 8} color={pal.subject} />}
      <Note text="6 p.m.: the news arrives" x={1030} y={920} size={56} rot={-3} at={ev + 6} color={pal.subject} />
      <Note text="Polk's own diary" x={190} y={985} size={46} rot={-2} at={t.at('diary') - 2} color="#ffffff" />
      <Tag text={DIARY_TAG} />
    </AbsoluteFill>
  );
};

/** The war bill: a war "already exists… by the act of the Republic of Mexico". */
const Bill: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const mark = (phrase: string, cue: string) => {
    const m = t.at(cue) - 2;
    const p = interpolate(g, [m, m + 10], [0, 100], clamp);
    return <span style={{backgroundImage: `linear-gradient(to right, ${pal.subject}99 ${p}%, transparent ${p}%)`, fontWeight: p > 0 ? 700 : 400}}>{phrase}</span>;
  };
  const k = interpolate(g, [t.at('The bill') - 2, t.at('The bill') + 6], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('Two days') && <Highlight text="MAY 11, 1846" x={110} y={80} size={84} at={t.at('Two days')} seed={143} rot={-2} />}
      <Quote text="shed American blood upon the American soil" at={t.at('"shed')} x={130} y={230} w={1660} size={58} who="Polk's war message to Congress" />
      {k > 0 && (
        <div style={{position: 'absolute', left: 260, top: 560, width: 1400, padding: '34px 48px', background: '#efe8d8', color: '#1b1712', boxShadow: '0 18px 34px rgba(0,0,0,0.6)',
          opacity: k, transform: `scale(${0.8 + 0.2 * k}) rotate(-1deg)`}}>
          <div style={{fontFamily: JF.heavy, fontWeight: 900, fontSize: 30, letterSpacing: 2, textAlign: 'center'}}>AN ACT providing for the prosecution of the existing war between the United States and the Republic of Mexico.</div>
          <div style={{fontFamily: '"Playfair Display", serif', fontSize: 34, lineHeight: 1.45, marginTop: 18}}>
            Whereas, {mark('by the act of the Republic of Mexico', 'by the act')}, a state of war {mark('exists', 'already exists')} between that Government and the United States: Be it enacted…
          </div>
        </div>
      )}
      <Tag text="Act of May 13, 1846 (9 Stat. 9), preamble · reset in type" />
    </AbsoluteFill>
  );
};

/** Doubts, the trap of voting no, and the vote of May 13. */
const Vote: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const v = t.at('declares') - 2;
  const bar = (label: string, yes: number, no: number, y: number, at: number) => {
    const p = interpolate(g, [at, at + 14], [0, 1], clamp);
    const W = 1100;
    const yw = (yes / (yes + no)) * W * p;
    const nw = (no / (yes + no)) * W * p;
    return (
      <div style={{position: 'absolute', left: 560, top: y}}>
        <div style={{fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, color: '#f4efe6', marginBottom: 10}}>{label}</div>
        <div style={{display: 'flex', height: 70}}>
          <div style={{width: yw, background: '#f4efe6'}} />
          <div style={{width: nw, background: pal.subject}} />
        </div>
        {p >= 1 && <div style={{fontFamily: JF.display, fontSize: 64, color: '#f4efe6', marginTop: 8}}>{yes} yes · <span style={{color: pal.subject}}>{no} no</span></div>}
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="some members doubt it…" x={110} y={110} size={60} rot={-3} at={t.at('doubt') - 2} color="#ffffff" />
      <Note text="but voting no could look like" x={110} y={220} size={54} rot={-3} at={t.at('voting') - 2} color="#ffffff" />
      <Note text="abandoning soldiers under fire" x={140} y={310} size={60} rot={-3} at={t.at('abandoning') - 2} color={pal.subject} />
      {g >= t.at('May 13th,') && <Highlight text="MAY 13, 1846" x={1150} y={110} size={84} at={t.at('May 13th,')} seed={145} rot={-2} />}
      {g >= v && bar('HOUSE', 174, 14, 470, v)}
      {g >= v + 10 && bar('SENATE', 40, 2, 720, v + 10)}
      <Note text="a huge margin" x={120} y={760} size={64} rot={-4} at={t.at('huge') - 2} />
      <Tag text="Votes on the war bill, May 11 (House) and May 12 (Senate), 1846" />
    </AbsoluteFill>
  );
};

/** Who decided? A timeline: Congress voted after the shooting started. */
const Who: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('So who') - 1;
  const X0 = 180, X1 = 1780, Y = 560;
  // a broken axis: January on the left, then the last 18 days (Apr 25 → May 13) spread out at ~41 px a day
  const xOf = (doy: number) => (doy < 100 ? 240 : 900 + (doy - 115) * 41);
  const k = interpolate(g, [a, a + 14], [0, 1], clamp);
  const events: {doy: number; top: string; bottom: string; at: number; color: string}[] = [
    {doy: 13, top: 'JAN 13', bottom: 'Polk sends the army', at: t.at('the President put'), color: MAP3D.us},
    {doy: 115, top: 'APR 25', bottom: 'shooting starts', at: t.at('after the shooting'), color: pal.subject},
    {doy: 129, top: 'MAY 9', bottom: 'news arrives', at: t.at('after the shooting') + 6, color: '#f4efe6'},
    {doy: 133, top: 'MAY 13', bottom: 'Congress declares war', at: t.at('Congress declared'), color: '#f4efe6'},
  ];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="who decided to go to war?" x={110} y={90} size={70} rot={-3} at={t.at('who') - 2} color="#ffffff" />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <line x1={X0} y1={Y} x2={X0 + (X1 - X0) * k} y2={Y} stroke="#f4efe6" strokeWidth={6} />
        {k >= 1 && <g><rect x={560} y={Y - 30} width={120} height={60} fill="#1c1914" /><line x1={575} y1={Y + 26} x2={600} y2={Y - 26} stroke="#f4efe6" strokeWidth={5} /><line x1={640} y1={Y + 26} x2={665} y2={Y - 26} stroke="#f4efe6" strokeWidth={5} /></g>}
        {k >= 1 && <text x={620} y={Y - 50} textAnchor="middle" style={{fontFamily: '"Nanum Pen Script", cursive', fontSize: 40, fill: '#bdb6a8'}}>3 months</text>}
        {events.map((e) => g >= e.at && <circle key={e.top} cx={xOf(e.doy)} cy={Y} r={18} fill={e.color} stroke="#111" strokeWidth={4} />)}
        {g >= t.at('after the shooting') && (
          <path d={`M${xOf(115)},${Y + 110} Q${(xOf(115) + xOf(133)) / 2},${Y + 230} ${xOf(133)},${Y + 110}`} fill="none" stroke={pal.subject} strokeWidth={6}
            pathLength={1} strokeDasharray={1} strokeDashoffset={interpolate(g, [t.at('after the shooting'), t.at('after the shooting') + 14], [1, 0], clamp)} />
        )}
      </svg>
      {events.map((e, i) => g >= e.at && (
        <React.Fragment key={e.top}>
          <div style={{position: 'absolute', left: xOf(e.doy) - 150, width: 300, top: i === 2 ? Y - 120 : Y - 120, textAlign: 'center', fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, color: e.color}}>{e.top}</div>
          <div style={{position: 'absolute', left: Math.min(1880 - 260, Math.max(40, xOf(e.doy) - 130)), width: 260, top: i === 2 ? Y - 200 : Y + 50, textAlign: 'center', fontFamily: '"Nanum Pen Script", cursive', fontSize: 40, lineHeight: 1, color: e.color}}>{e.bottom}</div>
        </React.Fragment>
      ))}
      {g >= t.at('after the shooting') && <Highlight text="CONGRESS VOTED AFTER THE SHOOTING STARTED" x={150} y={850} size={62} at={t.at('after the shooting')} seed={147} rot={-1} />}
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Polk t={t} />],
    [at('He wants') - 1, <Wants t={t} />],
    [at('In 1845,') - 1, <Destiny t={t} />],
    [at('Polk tries') - 1, <Buy t={t} />],
    [at('So in January') - 1, <Taylor t={t} />],
    [at("Mexico's commander") - 1, <Camp t={t} />],
    [at('April') - 1, <Ambush t={t} />],
    [at('In 1846,') - 1, <Rider t={t} />],
    [at('It takes') - 1, <TwoWeeks t={t} />],
    [at('And on May') - 1, <Diary t={t} />],
    [at('Two days') - 1, <Bill t={t} />],
    [at('Some members') - 1, <Vote t={t} />],
    [at('So who') - 1, <Who t={t} />],
  ];
  const scene = useScene(cuts);
  const notes = ['editor', 'believers,', 'Native', 'someone', 'buy', 'wanted more', 'Straight', 'leave.', 'surround', 'dozen', 'speed', 'two weeks',
    'before it arrives', 'diary', 'doubt', 'voting', 'abandoning', 'huge', 'who'];
  return (
    <>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['James', 'In 1845,', 'Manifest', 'January', 'April', 'May 9th', 'Two days', 'May 13th,', 'after the shooting'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {[['meet', 2], ["doesn't", 1]].map(([c, n]) => <Sfx key={c as string} at={at(c as string, n as number)} src="sfx/stamp.wav" volume={0.38} />)}
      {notes.map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('To Mexico,', 2) - 2} src={WRITE.src} volume={WRITE.volume} />
      <Sfx at={at('25') - 2} src="sfx/tick.wav" volume={0.4} />
      <Sfx at={at('surround')} src="sfx/boom.wav" volume={0.3} />
      <Sfx at={at('It takes')} src="sfx/tick_soft.wav" volume={0.35} />
      <Sfx at={at('And on May') - 1} src="sfx/page_turn.wav" volume={0.4} />
      <Sfx at={at('declares') - 2} src="sfx/gavel.wav" volume={0.4} />
    </>
  );
};

const TM = makeTimeline(N, 30);

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_polk_acts_first.wav" lead={LEAD} music={[
    {src: 'music/j_intrigue.mp3', volume: 0.15, to: TM.at('So in January') + 6},
    {src: 'music/m_war_drums.mp3', volume: 0.17, from: TM.at('So in January') - 6},
  ]}>
    <Body />
  </ChapterShell>
);
