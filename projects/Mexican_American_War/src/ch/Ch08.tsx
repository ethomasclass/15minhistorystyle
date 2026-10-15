// Chapter 8 · The Man Who Was Fired: Trist recalled, the 65-page "no", the Treaty of Guadalupe Hidalgo, the new border
// and the Cession, half of Mexico, gold nine days earlier, and the promises of Articles VIII and X.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import mapData from '../../public/maps/mex1846.json';
import words from '../../public/audio/ch08_the_man_who_was_fired.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {Border, type Cam3, CESSION_STATES, Count, Dot, Fill, Hand, MAP3D, Map3D, type MapData, PlaceTag, RegionName, Route, Slab, Stand} from '../kit/map3d';
import {Parallax} from '../kit/parallax';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, Quote, Stamp, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
const D = mapData as unknown as MapData;
const pl = D.places;
export const CH08_FRAMES = chapterFrames(N, LEAD);

const GEN: [number, number] = [1376, 768];
const TRIST: [number, number] = [1760, 1760];
const POLK: [number, number] = [1920, 2309];
// the gold in his palms (tools/traces/gold.json), for the glint
const GOLD = [[560, 395], [600, 370], [625, 345], [660, 340], [700, 345], [745, 345], [780, 380], [775, 410], [735, 425], [700, 445], [670, 470], [640, 470], [600, 450], [570, 425]];

/** Polk needs a treaty; he sends Trist, then orders him home. */
const Trist: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src="img/ch08/trist.jpg" size={TRIST} x={1150} y={110} w={620} h={760} fx={860} fy={760} scale={0.62} rot={2} at={t.at('He sends') - 2}
        mask={MASKS.trist} tintStrength={0.5} traceAt={t.at('Nicholas')} />
      <Note text="Nicholas Trist" x={1190} y={900} size={54} rot={-2} at={t.at('Nicholas') - 2} color="#ffffff" />
      <Note text="Polk needs a peace treaty" x={110} y={120} size={62} rot={-3} at={t.at('peace') - 4} color="#ffffff" />
      <Note text="he sends a diplomat" x={130} y={240} size={58} rot={-3} at={t.at('diplomat,') - 2} />
      <Note text="the talks drag on…" x={130} y={380} size={58} rot={-3} at={t.at('talks') - 2} color="#ffffff" />
      <Stamp text="RECALLED" x={140} y={500} at={t.at('orders')} size={110} color={pal.subject} rot={-5} />
      {g >= t.at('says no.') && <Highlight text="TRIST SAYS NO" x={130} y={720} size={100} at={t.at('says no.')} seed={191} rot={-2} />}
      <Tag text="Nicholas P. Trist, Brady studio photograph, 1855–65 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** The 65-page letter. */
const Letter: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Parallax name="trist_stack" src="img/gen/ch08_trist_letter.jpg" size={[1198, 600]} a={t.at('Mexico finally') - 1} b={t.at('February')} fx={0.38} fy={0.55}
      cam={{z: [1.0, 1.25], x: [0.04, -0.06]}} depth={interpolate(g, [t.at('65') - 4, t.at('65') + 10], [1.02, 1.1], clamp)} vignette={0.45}
      mask={MASKS.trist_stack} tintStrength={0.6} traceAt={t.at('65')} effects={[{kind: 'flicker', x: 640, y: 380, r: 520, strength: 0.6}]}
      tag="Illustration · Trist writing to Polk, Mexico City, December 1847">
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(to left, rgba(8,7,5,0.92) 0%, rgba(8,7,5,0.8) 36%, rgba(0,0,0,0) 52%)'}} />
          <Note text="Mexico finally has leaders ready for peace" x={980} y={110} size={40} rot={-2} at={t.at('leaders') - 2} color="#ffffff" />
          <Note text="if he leaves, the chance is gone" x={1100} y={210} size={46} rot={-2} at={t.at('chance') - 2} color="#ffffff" />
          <Note text="so: a letter to Polk" x={1180} y={330} size={54} rot={-3} at={t.at('letter') - 2} />
          {g >= t.at('65') && <div style={{position: 'absolute', left: 1240, top: 430}}><Count to={65} at={t.at('65') - 2} dur={18} suffix=" pages" size={110} color={pal.subject} /></div>}
          <Note text="a very long way to say no" x={1150} y={620} size={54} rot={-3} at={t.at('very long') - 2} color="#ffffff" />
        </>
      )}
    </Parallax>
  );
};

/** February 2, 1848: the treaty, signed by a fired man; Polk's "scoundrel"; paid in 1871. */
const Treaty: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('February') - 1;
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('February') && <Highlight text="FEBRUARY 2, 1848" x={110} y={80} size={90} at={t.at('February')} seed={193} rot={-2} />}
      {g >= t.at('Treaty of') && <Highlight text="TREATY OF GUADALUPE HIDALGO" x={110} y={230} size={74} at={t.at('Treaty of')} seed={195} rot={-1} />}
      <Note text="signed by a man who technically" x={130} y={400} size={54} rot={-3} at={t.at('signed') - 2} color="#ffffff" />
      <Note text="doesn't work for the government anymore" x={150} y={490} size={50} rot={-3} at={t.at('technically') - 2} color="#ffffff" />
      <CropCard src="img/ch01/polk_brady_1849.jpg" size={POLK} x={1470} y={500} w={340} h={420} fx={960} fy={820} scale={0.36} rot={2} at={t.at('Polk calls') - 2}
        mask={MASKS.polk} tintStrength={0.45} traceAt={t.at('Polk calls') + 4} />
      <Quote text="scoundrel" at={t.at('"scoundrel"')} x={1250} y={330} w={620} size={70} who="Polk's diary, on Trist" />
      <Note text="…but it's the deal he wanted" x={130} y={650} size={54} rot={-3} at={t.at('deal') - 2} />
      <Note text="the Senate approves it" x={150} y={750} size={54} rot={-3} at={t.at('approves') - 2} color="#ffffff" />
      <Stamp text="TRIST PAID: 1871" x={140} y={860} at={t.at('1871.')} size={90} color={pal.subject} rot={-4} />
      <Tag text="James K. Polk, Mathew Brady, 1849 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** The deal on the map: the Rio Grande border, the Cession, today's states, half of Mexico, $15 million. */
const Deal: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('The deal: the') - 1;
  const half = t.at('Counting') - 2;
  const keys: Cam3[] = [
    {f: a, x: 2900, y: 2200, z: 0.5, tilt: 40, rot: -2},
    {f: t.at('Cession,') + 4, x: 2100, y: 1500, z: 0.34, tilt: 40, rot: 0},
    {f: half, x: 2300, y: 1700, z: 0.3, tilt: 38, rot: 0},
    {f: t.at('The United States pays'), x: 2600, y: 2100, z: 0.26, tilt: 38, rot: 0},
  ];
  return (
    <>
      <Map3D data={D} keys={keys} states={interpolate(g, [t.at('Today') - 4, t.at('Today') + 8, half - 6, half], [0, 0.8, 0.8, 0], clamp)}>
        {(api) => (
          <>
            <Border api={api} d={D.lines.border1848} at={t.at('Rio') - 2} dur={30} color={MAP3D.mexico} label="Rio Grande · new border, 1848" labelSize={26} labelTo={0.35} labelOut={t.at('Cession,')} />
            <Slab api={api} region="cession" at={t.at('Cession,') - 4} h={40} layers={8} color={pal.subject} fall={half - 4} opacity={0.9} />
            <Stand api={api} at={[1900, 1250]} z={60} show={t.at('530,000') - 2} out={t.at('Today')}><RegionName text="THE MEXICAN CESSION" size={70} /></Stand>
            {[['California', [1350, 1150]], ['Nevada', [1650, 950]], ['Utah', [2050, 850]], ['Arizona', [1780, 1520]], ['New Mexico', [2480, 1560]]].map(([nm, at], i) => (
              <Stand key={nm as string} api={api} at={at as number[]} z={50} show={t.at('Today') + 4 + i * 8} out={half}><PlaceTag text={nm as string} size={30} /></Stand>
            ))}
            {/* half of Mexico: Mexico in 1821 as one slab; Texas and the Cession lift off and slide north */}
            <Slab api={api} region="mexicoNow" at={half} h={30} layers={6} color={MAP3D.mexico} />
            <Slab api={api} region="cession" at={half} h={30} layers={6} color={MAP3D.mexico} slide={{at: half + 16, dur: 30, dx: 0, dy: -260, lift: 40}} />
            <Slab api={api} region="texasClaim" at={half} h={30} layers={6} color={MAP3D.mexico} clipLand slide={{at: half + 16, dur: 30, dx: 120, dy: -260, lift: 40}} />
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Note text="the deal:" x={110} y={80} size={66} rot={-3} at={t.at('The deal: the') - 2} color="#ffffff" />
        <div style={{position: 'absolute', left: 110, top: 820, opacity: g >= t.at('530,000') - 2 && g < half ? 1 : 0}}>
          <Count to={530000} at={t.at('530,000') - 2} dur={24} size={90} suffix=" sq mi" color="#f4efe6" />
        </div>
        {g >= t.at('half') && g < t.at('The United States pays') && <Highlight text="ABOUT HALF OF MEXICO" x={110} y={830} size={80} at={t.at('half')} seed={197} rot={-2} />}
        {g >= t.at('15') - 2 && <div style={{position: 'absolute', left: 110, top: 820}}><Count to={15} at={t.at('15') - 2} dur={12} prefix="$" suffix=" million" size={100} color={pal.subject} /></div>}
        <Note text="the U.S. pays" x={120} y={760} size={50} rot={-3} at={t.at('pays') - 2} color="#ffffff" />
      </AbsoluteFill>
    </>
  );
};

/** Nine days earlier, gold. */
const Gold: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at("And here's") - 1;
  const glint = interpolate(g, [t.at('gold.') - 6, t.at('gold.') + 20], [-0.2, 1.2], clamp);
  return (
    <Parallax name="gold" src="img/gen/ch08_gold.jpg" size={GEN} a={a} b={t.at('The treaty makes')} fx={0.48} fy={0.52}
      cam={{z: [1.0, 1.2]}} depth={1.04} vignette={0.45} mask={MASKS.gold} tint={null} traceAt={t.at('gold.')}
      filter="grayscale(0.15) contrast(1.15) brightness(0.97)" tag="Illustration · gold at Sutter's Mill, Coloma, California, January 24, 1848">
      {(p) => (
        <>
          <div style={{position: 'absolute', left: p.left, top: p.top, width: GEN[0] * p.scale, height: GEN[1] * p.scale, mixBlendMode: 'screen',
            clipPath: `polygon(${GOLD.map(([x, y]) => `${x * p.scale}px ${y * p.scale}px`).join(', ')})`}}>
            <div style={{position: 'absolute', inset: 0, background: `linear-gradient(110deg, transparent ${glint * 100 - 8}%, rgba(255,240,190,0.45) ${glint * 100}%, transparent ${glint * 100 + 8}%)`}} />
          </div>
          <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 22%, rgba(0,0,0,0) 36%)'}} />
          <Note text="what nobody at the table knew…" x={100} y={70} size={58} rot={-3} at={t.at('nobody') - 2} color="#ffffff" />
          <Note text="Coloma, Jan 24 → Guadalupe Hidalgo, Feb 2" x={100} y={170} size={48} rot={-3} at={t.at('Nine') - 2} />
          {g >= t.at('gold.') && <Highlight text="GOLD" x={1290} y={70} size={120} at={t.at('gold.')} seed={199} rot={-3} />}
        </>
      )}
    </Parallax>
  );
};

/** Articles VIII and X: promises, and the cut. */
const Promises: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('The treaty makes') - 1;
  const mark = (s: string, cue: string) => {
    const m = t.at(cue) - 2;
    const p = interpolate(g, [m, m + 10], [0, 100], clamp);
    return <span style={{backgroundImage: `linear-gradient(to right, ${pal.mark}88 ${p}%, transparent ${p}%)`, fontWeight: p > 0 ? 700 : 400}}>{s}</span>;
  };
  const cut = interpolate(g, [t.at('cuts') - 2, t.at('cuts') + 12], [0, 1], clamp);
  const card = (k: number): React.CSSProperties => ({position: 'absolute', width: 840, padding: '34px 44px', background: '#efe8d8', color: '#1b1712', boxShadow: '0 18px 34px rgba(0,0,0,0.6)', opacity: k, transform: `scale(${0.85 + 0.15 * k})`});
  const k8 = interpolate(g, [t.at('Article 8') - 4, t.at('Article 8') + 4], [0, 1], clamp);
  const k10 = interpolate(g, [t.at('Article 10') - 6, t.at('Article 10') + 2], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="promises to the people already living there" x={110} y={80} size={56} rot={-2} at={t.at('promises') - 2} color="#ffffff" />
      <div style={{...card(k8), left: 110, top: 220, rotate: '-1deg'}}>
        <div style={{fontFamily: JF.heavy, fontWeight: 900, fontSize: 30, letterSpacing: 2}}>ARTICLE VIII</div>
        <div style={{fontFamily: '"Playfair Display", serif', fontSize: 35, lineHeight: 1.45, marginTop: 10}}>
          …property of every kind, now belonging to Mexicans… shall be {mark('inviolably respected', '"inviolably')}… They shall be at liberty… to {mark('acquire the title and rights of citizens of the United States', 'citizens.')}.
        </div>
      </div>
      <div style={{...card(k10), left: 990, top: 400, rotate: '1.2deg'}}>
        <div style={{fontFamily: JF.heavy, fontWeight: 900, fontSize: 30, letterSpacing: 2}}>ARTICLE X</div>
        <div style={{fontFamily: '"Playfair Display", serif', fontSize: 35, lineHeight: 1.45, marginTop: 10}}>
          All grants of land made by the Mexican Government… shall be respected as valid, to the same extent that the same grants would be valid if the said territories had remained within the limits of Mexico…
        </div>
        <svg width={840} height={420} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <line x1={20} y1={30} x2={20 + 780 * cut} y2={30 + 300 * cut} stroke={pal.subject} strokeWidth={12} strokeLinecap="round" />
          <line x1={800} y1={30} x2={800 - 780 * cut} y2={30 + 300 * cut} stroke={pal.subject} strokeWidth={12} strokeLinecap="round" />
        </svg>
      </div>
      <Stamp text="CUT BY THE SENATE" x={1000} y={240} at={t.at('cuts')} size={70} color={pal.subject} rot={-4} />
      <Note text="it protected their land grants" x={130} y={800} size={54} rot={-3} at={t.at('protected') - 2} color="#ffffff" />
      {g >= t.at('Hold') && <Highlight text="HOLD THAT THOUGHT" x={130} y={900} size={74} at={t.at('Hold')} seed={201} rot={-2} />}
      <Tag text="Treaty of Guadalupe Hidalgo (1848), Articles VIII and X · excerpts, reset in type" />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Trist t={t} />],
    [at('Mexico finally') - 1, <Letter t={t} />],
    [at('February') - 1, <Treaty t={t} />],
    [at('The deal: the') - 1, <Deal t={t} />],
    [at("And here's") - 1, <Gold t={t} />],
    [at('The treaty makes') - 1, <Promises t={t} />],
  ];
  const scene = useScene(cuts);
  const notes = ['peace', 'diplomat,', 'talks', 'leaders', 'chance', 'letter', 'very long', 'signed', 'technically', 'deal', 'approves', 'The deal: the', 'pays', 'nobody', 'Nine',
    'promises', 'protected'];
  return (
    <>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['says no.', 'February', 'Treaty of', 'half', 'gold.', 'Hold'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {['orders', '1871.', 'cuts'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.38} />)}
      {notes.map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {['65', '530,000', '15'].map((c) => <Sfx key={c} at={at(c) - 2} src="sfx/tick.wav" volume={0.4} />)}
      <Sfx at={at('Mexico finally') - 1} src="sfx/quill.wav" volume={0.35} />
    </>
  );
};

export const Ch08: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch08_the_man_who_was_fired.wav" lead={LEAD} music={[{src: 'music/a_price.mp3', volume: 0.15, startFrom: 40 * 30}]}>
    <Body />
  </ChapterShell>
);
