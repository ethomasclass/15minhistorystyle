// Chapter 6 · Plot Twists: Santa Anna's deal through the blockade, his leg (and the cork one), the three-way push,
// Chapultepec and the Niños Héroes, the San Patricios, Mexico City, and the young officers of a later war.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import mapData from '../../public/maps/mex1846.json';
import words from '../../public/audio/ch06_plot_twists.words.json';
import {clamp} from '../lib/anim';
import {Highlight, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {type Cam3, Dot, Hand, MAP3D, Map3D, type MapData, PlaceTag, Route, Stand} from '../kit/map3d';
import {Parallax} from '../kit/parallax';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
const D = mapData as unknown as MapData;
const pl = D.places;
export const CH06_FRAMES = chapterFrames(N, LEAD);

const GEN: [number, number] = [1376, 768];
const SANTA: [number, number] = [1550, 2370];
const CHAP: [number, number] = [1874, 1150];
const OFF: [number, number] = [900, 1200];

/** A small blockade ship marker standing on the sea. */
const Ship: React.FC = () => (
  <svg width={70} height={60} style={{transform: 'translate(-35px, 0)'}}>
    <path d="M6,40 L64,40 L56,52 L14,52 Z" fill="#f4efe6" stroke="#111" strokeWidth={2} />
    <line x1={35} y1={4} x2={35} y2={40} stroke="#f4efe6" strokeWidth={3} />
    <path d="M37,8 L58,30 L37,30 Z" fill="#f4efe6" />
    <path d="M33,10 L14,30 L33,30 Z" fill="#cfc8bb" />
  </svg>
);

/** The war moves fast; Santa Anna in Cuba; "let me through your blockade". */
const Exile: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const keys: Cam3[] = [
    {f: 0, x: 3700, y: 2500, z: 0.36, tilt: 38, rot: 0},
    {f: t.at('Cuba.'), x: 4500, y: 2800, z: 0.8, tilt: 44, rot: 0},
    {f: t.at('blockade,'), x: 4000, y: 3050, z: 0.8, tilt: 46, rot: -2},
    {f: t.at('The U.S. Navy'), x: 3900, y: 3080, z: 0.85, tilt: 46, rot: -2},
  ];
  const ships: [number, number][] = [[3560, 3190], [3600, 3330], [3540, 3440]];
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Dot api={api} at={pl.havana} show={t.at('exile') - 2} color={MAP3D.mexico} r={14} />
            <Stand api={api} at={[pl.havana[0], pl.havana[1] - 20]} z={20} show={t.at('exile')}><PlaceTag text="Havana, Cuba" size={30} /></Stand>
            <Stand api={api} at={[pl.havana[0] - 60, pl.havana[1] + 110]} z={20} show={t.at('exile') + 4}><Hand text="Santa Anna, in exile" size={56} color="#ffffff" bg /></Stand>
            <Dot api={api} at={pl.veracruz} show={t.at('blockade,') - 4} color={MAP3D.mexico} r={12} />
            <Stand api={api} at={[pl.veracruz[0] - 30, pl.veracruz[1] + 20]} show={t.at('blockade,') - 2}><PlaceTag text="Veracruz" size={26} /></Stand>
            {ships.map((s, i) => <Stand key={i} api={api} at={s} show={t.at('blockade,') + i * 3}><div style={{transform: 'scale(1.8)'}}><Ship /></div></Stand>)}
            <Stand api={api} at={[3760, 3030]} z={30} show={t.at('blockade,') + 8}><Hand text="U.S. Navy blockade" size={50} color="#ffffff" bg /></Stand>
            <Route api={api} pts={[pl.havana, [4200, 3150], [3580, 3260], pl.veracruz]} at={t.at('lets')} dur={30} color={MAP3D.mexico} width={8} bow={0.05} dashed />
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        {g >= t.at('plot') && g < t.at('When the war') + 20 && <Highlight text="PLOT TWIST" x={100} y={90} size={110} at={t.at('plot')} seed={151} rot={-2} />}
        <Note text="“let me through your blockade…" x={100} y={780} size={56} rot={-3} at={t.at('let me') - 2} color="#ffffff" />
        <Note text="…and I'll make you a deal”" x={140} y={870} size={56} rot={-3} at={t.at('deal.') - 6} color="#ffffff" />
        <Stamp text="POLK SAYS YES" x={1100} y={110} at={t.at('yes.')} size={90} color={pal.subject} rot={-5} />
      </AbsoluteFill>
    </>
  );
};

/** The Navy lets him sail right past; he takes command and fights. So much for the deal. */
const Blockade: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Parallax name="blockade_steamer" src="img/gen/ch06_blockade.jpg" size={GEN} a={t.at('The U.S. Navy') - 1} b={t.at('Santa Anna, by')} fx={0.55} fy={0.5}
      cam={{z: [1.0, 1.1], x: [-0.06, 0.05]}} depth={1.07} vignette={0.4} mask={MASKS.blockade_steamer} tintStrength={0.5} traceAt={t.at('sail')}
      tag="Illustration · a British mail steamer passes the U.S. blockade off Veracruz, August 1846">
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.7) 100%)'}} />
          <Note text="the Navy lets him sail right past" x={100} y={70} size={54} rot={-2} at={t.at('sail') - 2} color="#ffffff" />
          <Note text="he lands…" x={100} y={790} size={54} rot={-3} at={t.at('lands,') - 2} color="#ffffff" />
          <Note text="takes command of Mexico's army…" x={420} y={775} size={54} rot={-3} at={t.at('command') - 2} color="#ffffff" />
          <Note text="…and fights the U.S. for the rest of the war" x={140} y={880} size={54} rot={-3} at={t.at('fights') - 2} color={pal.subject} />
          {g >= t.at('So much') && <AbsoluteFill style={{background: 'rgba(0,0,0,0.45)'}} />}
          {g >= t.at('So much') && <Highlight text="SO MUCH FOR THE DEAL" x={330} y={420} size={110} at={t.at('So much')} seed={153} rot={-3} />}
        </>
      )}
    </Parallax>
  );
};

/** One leg: lost in 1838, given a state funeral, dug up by a crowd. */
const OneLeg: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const z = interpolate(g, [t.at('Santa Anna, by'), t.at('Then in')], [0.56, 0.62], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src="img/ch03/santa_anna.jpg" size={SANTA} x={160} y={110} w={600} h={820} fx={787} fy={1250} scale={z} rot={-2} at={t.at('Santa Anna, by') - 1}
        mask={MASKS.santa_anna} tintStrength={0.5} traceAt={t.at('one leg')} />
      {g >= t.at('one leg') && <Highlight text="ONLY ONE LEG" x={900} y={120} size={96} at={t.at('one leg')} seed={155} rot={-2} />}
      <Note text="lost fighting the French, 1838" x={910} y={300} size={56} rot={-3} at={t.at('French') - 2} color="#ffffff" />
      <Note text="→ a state funeral for the leg" x={930} y={420} size={60} rot={-3} at={t.at('state') - 2} />
      <Note text="→ an angry crowd dug it up" x={930} y={540} size={60} rot={-3} at={t.at('angry') - 2} color={'#FF6F61'} />
      <Tag text="Antonio López de Santa Anna, lithograph · Library of Congress" />
    </AbsoluteFill>
  );
};

/** 1847: Illinois soldiers capture his cork leg. */
const CorkLeg: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Parallax name="corkleg_leg" src="img/gen/ch06_cork_leg.jpg" size={[1340, 705]} a={t.at('Then in') - 1} b={t.at('Meanwhile,')} fx={0.6} fy={0.6}
      cam={{z: [1.0, 1.2], x: [-0.02, 0.03], y: [0.0, 0.02]}} depth={1.07} vignette={0.35} mask={MASKS.corkleg_leg} tintStrength={0.6} traceAt={t.at('cork')}
      tag="Illustration · Illinois volunteers with Santa Anna's cork leg, Cerro Gordo, April 18, 1847">
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.7) 100%)'}} />
          <Highlight text="1847" x={100} y={70} size={100} at={t.at('1847,')} seed={157} rot={-2} />
          <Note text="soldiers from Illinois capture" x={400} y={80} size={56} rot={-3} at={t.at('Illinois') - 2} color="#ffffff" />
          <Note text="his CORK LEG" x={1290} y={70} size={66} rot={-3} at={t.at('cork') - 2} color={pal.subject} />
          <Note text="still in a museum in Springfield, Illinois" x={100} y={850} size={50} rot={-2} at={t.at('museum') - 2} color="#ffffff" />
          <Note text="Mexico has asked for it back" x={130} y={940} size={54} rot={-2} at={t.at('asked') - 2} />
        </>
      )}
    </Parallax>
  );
};

/** Three directions: Taylor in the north, the West, Scott from Veracruz. */
const Push: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('Meanwhile,') - 1;
  const keys: Cam3[] = [
    {f: a, x: 2500, y: 2000, z: 0.3, tilt: 36, rot: 0},
    {f: t.at('Taylor wins'), x: 3060, y: 2480, z: 1.15, tilt: 46, rot: -4},
    {f: t.at('American forces') + 4, x: 2000, y: 1450, z: 0.42, tilt: 40, rot: 2},
    {f: t.at('General Winfield'), x: 3260, y: 3230, z: 1.15, tilt: 46, rot: -4},
    {f: t.at('September') - 1, x: 3200, y: 3260, z: 1.3, tilt: 50, rot: -6},
  ];
  const north = [pl.matamoros, pl.monterrey, pl.buenaVista];
  const west = [pl.fortLeavenworth, pl.santaFe, [1900, 1550], pl.sanDiego, pl.losAngeles];
  const scott = [pl.veracruz, pl.cerroGordo, [3250, 3240], pl.mexicoCity];
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Route api={api} pts={north} at={t.at('Taylor wins') - 6} dur={24} color={MAP3D.us} width={20} bow={0.04} />
            <Stand api={api} at={[pl.monterrey[0] + 40, pl.monterrey[1] - 40]} z={20} show={t.at('north') - 2}><Hand text="Taylor: a national hero" size={52} color="#ffffff" bg /></Stand>
            <Route api={api} pts={west} at={t.at('American forces')} dur={36} color={MAP3D.us} width={24} bow={0.04} />
            <Stand api={api} at={pl.santaFe} z={20} show={t.at('New Mexico,') - 2}><PlaceTag text="New Mexico" size={30} /></Stand>
            <Stand api={api} at={[pl.losAngeles[0] + 120, pl.losAngeles[1] - 80]} z={20} show={t.at('California', 1) - 2}><PlaceTag text="California" size={30} /></Stand>
            <Route api={api} pts={scott} at={t.at('lands at')} dur={30} color={MAP3D.us} width={20} bow={0.05} />
            <Dot api={api} at={pl.veracruz} show={t.at('lands at') - 2} color={MAP3D.mexico} />
            <Stand api={api} at={[pl.veracruz[0] + 20, pl.veracruz[1] + 10]} show={t.at('Veracruz')}><PlaceTag text="Veracruz" size={26} /></Stand>
            <Dot api={api} at={pl.mexicoCity} show={t.at('marches') - 2} color={MAP3D.mexico} r={14} />
            <Stand api={api} at={[pl.mexicoCity[0] - 40, pl.mexicoCity[1] + 20]} show={t.at('City.') - 2}><PlaceTag text="Mexico City" size={30} /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Note text="three directions" x={100} y={90} size={66} rot={-3} at={t.at('three') - 2} color="#ffffff" />
        {g < t.at('General Winfield') && <Definition term="Californios" def="Mexican Californians" at={t.at('Californios,')} x={110} y={880} w={800} />}
        <Note text="General Winfield Scott" x={1100} y={90} size={56} rot={-3} at={t.at('Winfield') - 2} color="#ffffff" />
      </AbsoluteFill>
    </>
  );
};

/** September 13, 1847: Chapultepec and the Niños Héroes. */
const Chapultepec: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Parallax name="chapultepec_castle" src="img/ch06/chapultepec_1849.jpg" size={CHAP} a={t.at('September') - 1} b={t.at('That same')} fx={0.5} fy={0.42}
      cam={{z: [1.05, 1.18], y: [0.02, -0.04]}} depth={1.04} vignette={0.45} mask={MASKS.chapultepec_castle} tintStrength={0.5} traceAt={t.at('castle')}
      tag="The Storming of Chapultepec, Sept. 13th 1847, lithograph (1849) · Library of Congress">
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 40%)'}} />
          <Highlight text="SEPTEMBER 13, 1847" x={100} y={70} size={84} at={t.at('September')} seed={159} rot={-2} />
          <Note text="the castle of Chapultepec" x={1150} y={90} size={52} rot={-3} at={t.at('castle') - 2} color="#ffffff" />
          <Note text="six teenage cadets died here" x={110} y={790} size={56} rot={-3} at={t.at('six') - 2} color="#ffffff" />
          {g >= t.at('Niños') && <Highlight text="LOS NIÑOS HÉROES" x={110} y={920} size={70} at={t.at('Niños')} seed={161} rot={-2} />}
          <Note text="“the boy heroes”" x={1000} y={930} size={56} rot={-3} at={t.at('boy') - 2} />
        </>
      )}
    </Parallax>
  );
};

/** The San Patricios (quiet: no tint, no trace on people, nothing close). */
const Patricios: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const end = interpolate(g, [t.at('hanged.') - 4, t.at('hanged.') + 10], [0, 0.55], clamp);
  return (
    <Parallax name="flag_and_gallows" src="img/gen/ch06_flag_and_gallows.jpg" size={GEN} a={t.at('That same') - 1} b={t.at('The next day')} fx={0.5} fy={0.5}
      cam={{z: [1.0, 1.06]}} depth={1} vignette={0.55} tint={null} filter="grayscale(1) contrast(1.05) brightness(0.9)"
      tag="Illustration · outside Mexico City, the morning of September 13, 1847">
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.7) 100%)'}} />
          <Note text="that same morning, a few miles away" x={100} y={70} size={52} rot={-2} at={t.at('That same') + 4} color="#ffffff" />
          <Note text="30 men on wagons" x={110} y={160} size={56} rot={-2} at={t.at('30') - 2} color="#f4efe6" />
          {g >= t.at('San Patricios') && <Highlight text="THE SAN PATRICIOS" x={100} y={800} size={78} at={t.at('San Patricios')} seed={163} rot={-2} />}
          <Note text="mostly Irish Catholic immigrants" x={110} y={910} size={50} rot={-2} at={t.at('Irish') - 2} color="#ffffff" out={t.at('The American colonel')} />
          <Note text="who left the U.S. army to fight for Mexico" x={940} y={910} size={46} rot={-2} at={t.at('deserted') - 2} color="#ffffff" out={t.at('The American colonel')} />
          <Note text="made to wait for the flag over Chapultepec" x={110} y={910} size={52} rot={-2} at={t.at('wait,') - 2} color="#ffffff" />
          <AbsoluteFill style={{background: '#000', opacity: end}} />
        </>
      )}
    </Parallax>
  );
};

/** The next day, Mexico City. */
const City: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('The next day') - 1;
  const keys: Cam3[] = [
    {f: a, x: 3250, y: 3200, z: 0.7, tilt: 46, rot: -6},
    {f: t.at('Some of') - 1, x: 3150, y: 3250, z: 0.9, tilt: 50, rot: -8},
  ];
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Route api={api} pts={[pl.veracruz, pl.cerroGordo, [3250, 3240], pl.mexicoCity]} at={-99} dur={1} color={MAP3D.us} width={20} bow={0.05} />
            <Dot api={api} at={pl.mexicoCity} color={MAP3D.us} r={18} />
            <Stand api={api} at={[pl.mexicoCity[0] - 30, pl.mexicoCity[1] + 20]}><PlaceTag text="Mexico City" size={34} /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>{g >= t.at('next') && <Highlight text="SEPT. 14: INTO MEXICO CITY" x={100} y={90} size={84} at={t.at('next')} seed={165} rot={-2} />}</AbsoluteFill>
    </>
  );
};

/** Young officers, later enemies. */
const Officers: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const cards: {name: string; src: string; cue: string; x: number; rot: number; side: string}[] = [
    {name: 'grant', src: 'img/ch06/grant.jpg', cue: 'Ulysses', x: 140, rot: -2, side: 'Union'},
    {name: 'lee', src: 'img/ch06/lee.jpg', cue: 'Robert', x: 720, rot: 1.5, side: 'Confederacy'},
    {name: 'jackson', src: 'img/ch06/jackson.jpg', cue: 'Stonewall', x: 1300, rot: -1.5, side: 'Confederacy'},
  ];
  const labels: Record<string, string> = {grant: 'Ulysses S. Grant', lee: 'Robert E. Lee', jackson: '“Stonewall” Jackson'};
  const war = t.at('In about');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="some of the young American officers:" x={110} y={50} size={54} rot={-2} at={t.at('young') - 2} color="#ffffff" />
      {cards.map((c) => (
        <React.Fragment key={c.name}>
          <CropCard src={c.src} size={OFF} x={c.x} y={170} w={480} h={600} fx={450} fy={560} scale={0.6} rot={c.rot} at={t.at(c.cue) - 2}
            mask={MASKS[c.name as 'grant' | 'lee' | 'jackson']} tintStrength={0.45} traceAt={t.at(c.cue) + 2} />
          <Note text={labels[c.name]} x={c.x + 20} y={790} size={46} rot={-2} at={t.at(c.cue)} color="#ffffff" />
          {g >= war + 6 && <Note text={c.side} x={c.x + 40} y={860} size={48} rot={-3} at={war + 6} color={c.side === 'Union' ? '#9fc0d2' : pal.subject} />}
        </React.Fragment>
      ))}
      {g >= war && <Highlight text="~14 YEARS LATER: ENEMIES" x={500} y={945} size={60} at={war} seed={167} rot={-1} />}
      <Tag text="Portraits from the 1860s, during the Civil War · Library of Congress" />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Exile t={t} />],
    [at('The U.S. Navy') - 1, <Blockade t={t} />],
    [at('Santa Anna, by') - 1, <OneLeg t={t} />],
    [at('Then in') - 1, <CorkLeg t={t} />],
    [at('Meanwhile,') - 1, <Push t={t} />],
    [at('September') - 1, <Chapultepec t={t} />],
    [at('That same') - 1, <Patricios t={t} />],
    [at('The next day') - 1, <City t={t} />],
    [at('Some of') - 1, <Officers t={t} />],
  ];
  const scene = useScene(cuts);
  const notes = ['let me', 'sail', 'lands,', 'command', 'fights', 'French', 'state', 'angry', 'Illinois', 'cork', 'museum', 'asked', 'three', 'north',
    'Winfield', 'castle', 'six', 'boy', '30', 'Irish', 'deserted', 'wait,', 'young'];
  return (
    <>
      {scene}
      {cuts.slice(1).map(([f], i) => i !== 5 && <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['plot', 'one leg', '1847,', 'September', 'Niños', 'next', 'In about'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {['yes.', 'So much'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.38} />)}
      {notes.map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {['Ulysses', 'Robert', 'Stonewall'].map((c) => <Sfx key={c} at={at(c) - 2} src="sfx/page_turn.wav" volume={0.3} />)}
    </>
  );
};

const TM = makeTimeline(N, 30);

export const Ch06: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch06_plot_twists.wav" lead={LEAD} music={[
    {src: 'music/a_price.mp3', volume: 0.15, to: TM.at('Meanwhile,') + 6},
    {src: 'music/a_civil_war.mp3', volume: 0.14, from: TM.at('Meanwhile,') - 6, to: TM.at('That same') + 6},
    {src: 'music/j_grief.mp3', volume: 0.11, from: TM.at('That same') - 6},
  ]}>
    <Body />
  </ChapterShell>
);
