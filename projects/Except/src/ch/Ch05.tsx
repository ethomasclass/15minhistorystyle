// Chapter 5 · Hard War: Grant after Lee in 1864, Lincoln expecting to lose, McClellan (awkward), Sherman takes Atlanta,
// Lincoln's second term, the march to the sea, total war vs hard war, and the mid-video subscribe.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import mapData from '../../public/maps/civwar1861.json';
import words from '../../public/audio/ch05_hard_war.words.json';
import {Highlight, Loop, Note, Tag, useGFrame} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {Desk, DropCard, SyncQuote} from '../kit/bs';
import {Doc, sizeOf} from '../kit/dk';
import {Engraving} from '../kit/engraving';
import {Box, CORAL, ORANGE, TwoViews, WHITE} from '../kit/except';
import {type Cam3, Count, Fill, MAP3D, Map3D, type MapData, Pin3, PlaceTag, Route, Stand, StateTiles, UNION_FREE_1861, BORDER_1861, CONFEDERACY_1861} from '../kit/map3d';
import {Backdrop, ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, Photo, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH05_FRAMES = chapterFrames(N, LEAD);

const D = mapData as unknown as MapData;
const pl = D.places as Record<string, [number, number]>;
const CITYPOINT = 'img/ch02/grant_city_point_1864.jpg';
const UNION_BANNER = 'img/ch05/lincoln_union_banner_currier_1864.jpg';
const DEM_BANNER = 'img/ch05/mcclellan_democratic_banner_currier_1864.jpg';
const BUTTON = 'img/ch05/mcclellan_campaign_button_1864.jpg';
const SHERMAN = 'img/ch05/sherman_portrait_brady_1865.jpg';
const ATLANTA = 'img/ch05/atlanta_after_capture_barnard_1864.jpg';
const TICKET = 'img/ch05/lincoln_johnson_ticket_lloyd_1864.jpg';
const FARM = 'img/gen/v3_ch05_georgia_farm.jpg';
const RAILS = 'img/ch05/sherman_men_destroying_railroad_barnard_1864.jpg';
const DARLEY = 'img/ch05/sherman_march_to_the_sea_darley_1883.jpg';
const RUINS = 'img/ch05/atlanta_car_shed_ruins_barnard_1864.jpg';
const BLISS1 = 'img/ch03/gettysburg_address_bliss_copy_p1_facsimile_1909.jpg';
const DOC = 'grayscale(1) sepia(0.3) contrast(1.12)';

/** 1864: Grant goes after Lee in Virginia and won't let up. */
const Grant: React.FC<{t: TL}> = ({t}) => (
  <Photo src={CITYPOINT} size={sizeOf(CITYPOINT)} fx={1250} fy={1350} z0={1.0} z1={1.08} a={-10} b={t.at('That summer')} bw="grayscale(1) contrast(1.25) brightness(0.9)">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to right, rgba(10,9,7,0.88) 0%, rgba(10,9,7,0.6) 36%, rgba(0,0,0,0) 54%)'}} />
        <Highlight text="1864" x={110} y={110} size={110} at={t.at('1864') - 1} seed={51} rot={-2} />
        <Note text="Grant goes after Lee in Virginia" x={130} y={300} size={50} rot={-3} at={t.at('Grant went') - 2} color={WHITE} />
        <Note text="battle after battle" x={150} y={430} size={62} rot={-3} at={t.at('battle after') - 2} />
        <Note text="and won't let up" x={170} y={560} size={62} rot={-3} at={t.at("wouldn't") - 2} color={CORAL} />
        <Note text="the losses: enormous" x={150} y={720} size={56} rot={-3} at={t.at('enormous') - 3} />
        <Note text="many Northerners: sick of the war" x={170} y={840} size={48} rot={-3} at={t.at('sick') - 3} color={WHITE} />
        <Tag text="Ulysses S. Grant at City Point, Virginia, August 1864 · Library of Congress" />
      </>
    )}
  </Photo>
);

/** The losses; the North sick of the war; Lincoln expects to lose. */
const Losing: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('That summer') - 1;
  return (
    <Desk a={a} push={0.02}>
      <DropCard src={UNION_BANNER} x={1240} y={110} w={560} rot={3} at={a + 1} />
      <Note text="summer 1864:" x={130} y={200} size={52} rot={-3} at={t.at('That summer') - 2} color={WHITE} />
      <Note text="Lincoln expects to lose the election" x={150} y={330} size={56} rot={-3} at={t.at('expected') - 2} />
      <Note text="he even writes a private note preparing for it" x={170} y={500} size={46} rot={-2} at={t.at('He even') - 2} color={WHITE} />
      <Tag text="Currier & Ives, Grand National Union Banner for 1864 · Library of Congress" />
    </Desk>
  );
};

/** His opponent: George McClellan, the general Lincoln had fired. */
const McClellan: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('His opponent') - 1;
  return (
    <Desk a={a} push={0.02}>
      <Doc src={DEM_BANNER} x={170} y={100} w={620} rot={-2} at={a + 1} push={[a, t.at('Then, in')]} fx={1200} fy={1150} zoom={1.12} colour />
      <DropCard src={BUTTON} x={700} y={640} w={240} rot={6} at={t.at('McClellan') - 2} filter="contrast(1.05)" />
      <Note text="his opponent: a familiar face" x={1020} y={130} size={50} rot={-3} at={t.at('familiar') - 3} color={WHITE} />
      <Highlight text="GEORGE McCLELLAN" x={1010} y={290} size={70} at={t.at('McClellan') - 1} seed={52} rot={-2} />
      <Note text="the general Lincoln had fired" x={1040} y={480} size={46} rot={-3} at={t.at('The general') - 2} />
      <Note text="awkward." x={1100} y={640} size={88} rot={-5} at={t.at('Awkward') - 2} color={CORAL} />
      <Tag text="Currier & Ives, Grand National Democratic Banner, 1864 · McClellan campaign button, 1864 · Library of Congress" />
    </Desk>
  );
};

/** September 1864: Sherman captures Atlanta. */
const Atlanta: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Then, in') - 1;
  return (
    <Desk a={a} push={0.02}>
      <CropCard src={SHERMAN} size={sizeOf(SHERMAN)} x={160} y={140} w={480} h={680} fx={960} fy={1250} scale={0.42} rot={-2} at={a + 1} mask={MASKS.sherman} tintStrength={0.6} traceAt={t.at('Sherman') + 2} />
      <CropCard src={ATLANTA} size={sizeOf(ATLANTA)} x={780} y={500} w={980} h={430} fx={1100} fy={900} scale={0.62} rot={2} at={t.at('Atlanta') - 2} />
      <Note text="September 1864" x={780} y={100} size={50} rot={-3} at={a + 2} color={WHITE} />
      <Note text="General William Tecumseh Sherman" x={800} y={200} size={46} rot={-3} at={t.at('Sherman') - 2} />
      <Highlight text="CAPTURES ATLANTA" x={800} y={310} size={74} at={t.at('Atlanta')} seed={53} rot={-2} />
      <Note text="the news changes everything" x={180} y={900} size={52} rot={-2} at={t.at('The news') - 2} color={CORAL} />
      <Tag text="Mathew Brady, William T. Sherman, 1865 · George Barnard, Atlanta just after its capture, 1864 · Library of Congress" x={44} y={30} />
    </Desk>
  );
};

/** November: Lincoln wins a second term. */
const SecondTerm: React.FC<{t: TL}> = ({t}) => (
  <Photo src={TICKET} size={sizeOf(TICKET)} fx={780} fy={900} z0={1.25} z1={1.34} a={t.at('In November') - 1} b={t.at('Then Sherman')} bw="grayscale(1) contrast(1.2) brightness(0.92)">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to left, rgba(10,9,7,0.9) 0%, rgba(10,9,7,0.6) 40%, rgba(0,0,0,0) 58%)'}} />
        <Note text="November 1864" x={1180} y={260} size={54} rot={-3} at={t.at('In November') + 1} color={WHITE} />
        <Highlight text="A SECOND TERM" x={1140} y={400} size={74} at={t.at('second term') - 1} seed={54} rot={-2} />
        <Tag text="H. H. Lloyd, Abraham Lincoln and Andrew Johnson, 1864 · Library of Congress" />
      </>
    )}
  </Photo>
);

/** Atlanta to the sea at Savannah, about 300 miles. */
const March: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('Then Sherman') - 1;
  const keys: Cam3[] = [{f: a, x: 3020, y: 3000, z: 0.95, tilt: 38, rot: -4}, {f: t.at('His army'), x: 3040, y: 3020, z: 1.05, tilt: 46, rot: -8}];
  const go = t.at('marched') - 2;
  return (
    <>
      <Map3D data={D} keys={keys} states={0.7} rivers={0.8}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={-20} stagger={0} h={10} color={MAP3D.free} />
            <StateTiles api={api} names={BORDER_1861} at={-20} stagger={0} h={10} color={MAP3D.grey} />
            <Fill api={api} d={D.states['USA:Georgia']} at={-20} color={CORAL} opacity={0.35} hatch="rgba(255,111,97,0.6)" />
            <Stand api={api} at={pl.atlanta} z={30} show={a}><Pin3 color={MAP3D.us} /></Stand>
            <Stand api={api} at={[pl.atlanta[0] - 40, pl.atlanta[1] - 40]} z={120} show={a + 2}><PlaceTag text="Atlanta" size={26} /></Stand>
            <Route api={api} pts={D.polylines.sherman} at={go} dur={60} color={MAP3D.us} width={10} bow={0} />
            <Stand api={api} at={[pl.milledgeville[0], pl.milledgeville[1] + 30]} z={60} show={go + 24}><PlaceTag text="Milledgeville" size={22} /></Stand>
            <Stand api={api} at={pl.savannah} z={30} show={t.at('Savannah') - 2}><Pin3 color={MAP3D.us} /></Stand>
            <Stand api={api} at={[pl.savannah[0] + 30, pl.savannah[1] - 30]} z={120} show={t.at('Savannah')}><PlaceTag text="Savannah · the sea" size={26} /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.75) 0%, rgba(0,0,0,0) 30%)'}} />
        <Note text="Sherman marches from Atlanta to the sea" x={110} y={90} size={52} rot={-3} at={go} color={WHITE} />
        {g >= t.at('300') - 2 && <div style={{position: 'absolute', left: 110, top: 200}}><Count to={300} at={t.at('300') - 2} dur={30} prefix="about " suffix=" miles" size={84} color={MAP3D.us} /></div>}
        <Tag text="Map · Sherman's march, Atlanta to Savannah, 1864" />
      </AbsoluteFill>
    </>
  );
};

/** Living off the land. */
const OffTheLand: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={FARM} px={sizeOf(FARM)} fx={900} fy={330} a={t.at('His army') - 1} b={t.at('It tore')} z0={1.0} z1={1.07} fade={6}
    tag="Illustration · Sherman's army passing a Georgia farm, 1864">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.8) 0%, rgba(10,9,7,0.4) 22%, rgba(0,0,0,0) 36%)'}} />
        <Note text="his army lives off the land" x={110} y={80} size={58} rot={-3} at={t.at('lived') - 3} />
        <Note text="taking food from the farms it passes" x={130} y={200} size={48} rot={-2} at={t.at('taking food') - 2} color={WHITE} />
      </>
    )}
  </Engraving>
);

/** Tearing up the railroads. */
const Rails: React.FC<{t: TL}> = ({t}) => (
  <Photo src={RAILS} size={sizeOf(RAILS)} fx={760} fy={760} z0={1.9} z1={2.0} a={t.at('It tore') - 1} b={t.at('Sherman wanted')} bw="grayscale(1) contrast(1.25) brightness(0.9)">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(10,9,7,0.9) 0%, rgba(10,9,7,0.6) 28%, rgba(0,0,0,0) 46%)'}} />
        <Note text="it tears up railroads" x={110} y={700} size={60} rot={-3} at={t.at('tore') - 2} />
        <Note text="burns barns and supplies" x={130} y={820} size={56} rot={-3} at={t.at('burned') - 2} color={WHITE} />
        <Note text="and takes what it needs" x={1040} y={820} size={56} rot={-3} at={t.at('took what') - 2} color={CORAL} />
        <Tag text="George Barnard, Gen. Sherman's men destroying the railroad, Atlanta, 1864 · Library of Congress" x={44} y={40} />
      </>
    )}
  </Photo>
);

/** "The hard hand of war." */
const HardHand: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Sherman wanted') - 1;
  return (
    <Desk a={a} push={0.02}>
      <CropCard src={SHERMAN} size={sizeOf(SHERMAN)} x={170} y={130} w={520} h={780} fx={960} fy={1350} scale={0.4} rot={-2} at={a + 1} mask={MASKS.sherman} tintStrength={0.6} traceAt={a + 6} />
      <Note text="Sherman wanted Southerners," x={830} y={130} size={52} rot={-3} at={a + 2} color={WHITE} />
      <Note text="not just Southern armies, to feel" x={850} y={240} size={52} rot={-3} at={t.at('not just') - 2} color={WHITE} />
      <SyncQuote t={t} phrase="the hard hand of war." x={830} y={430} w={960} size={86} />
      <Tag text="Mathew Brady, William T. Sherman, 1865 · Library of Congress" />
    </Desk>
  );
};

/** Total war or hard war? */
const Debate: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Was that') - 1;
  return (
    <AbsoluteFill>
      <Backdrop src={RUINS} size={sizeOf(RUINS)} fx={750} a={a} dim={0.26} />
      <TwoViews a={a} left="WAS IT..." right="OR WAS IT..." top={90} leftAt={a + 1} rightAt={t.at('Or hard') - 2} rightColor={ORANGE} />
      <Highlight text="TOTAL WAR" x={140} y={180} size={84} at={t.at('total war')} seed={55} rot={-2} />
      <Definition term="to·tal war" def="a war against a whole society" at={t.at('a war against') - 1} x={150} y={340} w={700} />
      <Highlight text="HARD WAR" x={1040} y={180} size={84} at={t.at('hard war')} seed={56} rot={-2} />
      <Definition term="hard war" def="aimed mostly at property and supplies, not at civilians' lives" at={t.at('aimed') - 1} x={1050} y={340} w={720} />
      <CropCard src={DARLEY} size={sizeOf(DARLEY)} x={190} y={560} w={600} h={300} fx={1500} fy={1000} scale={0.36} rot={-2} at={a + 3} />
      <CropCard src={RUINS} size={sizeOf(RUINS)} x={1100} y={560} w={600} h={300} fx={740} fy={800} scale={0.6} rot={2} at={t.at('Or hard') - 1} />
      <Note text="historians still argue" x={680} y={890} size={52} rot={-2} at={t.at('Historians') - 2} color={WHITE} />
      <Tag text="F. O. C. Darley, Sherman's March to the Sea, engraving, c. 1883 (later depiction) · Barnard, ruins of the Atlanta car shed, 1864 · Library of Congress" x={44} y={30} />
    </AbsoluteFill>
  );
};

/** What each side saw. */
const TwoSides: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('To the North') - 1;
  return (
    <AbsoluteFill>
      <Backdrop src={RAILS} size={sizeOf(RAILS)} fx={750} a={a} dim={0.26} />
      <TwoViews a={a} left="TO THE NORTH" right="TO GEORGIANS IN HIS PATH" top={90} leftAt={a + 1} rightAt={t.at('To Georgians') - 2} />
      <CropCard src={DARLEY} size={sizeOf(DARLEY)} x={190} y={190} w={600} h={420} fx={1500} fy={1000} scale={0.36} rot={-2} at={a + 2} />
      <CropCard src={FARM} size={sizeOf(FARM)} x={1100} y={190} w={600} h={420} fx={1000} fy={330} scale={0.62} rot={2} at={t.at('To Georgians') - 1} />
      <Note text="Sherman broke the Confederacy's" x={170} y={700} size={48} rot={-3} at={t.at('Sherman broke') - 2} />
      <Note text="will to fight" x={190} y={810} size={64} rot={-3} at={t.at('will to') - 2} />
      <Note text="destruction" x={1080} y={700} size={64} rot={-3} at={t.at('destruction') - 2} color={CORAL} />
      <Note text="for its own sake" x={1100} y={820} size={56} rot={-3} at={t.at('own sake') - 2} color={CORAL} />
      <Tag text="Darley, Sherman's March to the Sea, c. 1883 (later depiction) · Illustration · a Georgia farm, 1864" />
    </AbsoluteFill>
  );
};

/** Quick thing before the surrender: subscribe. */
const Subscribe: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('Quick thing') - 1;
  const sub = t.at('subscribe');
  return (
    <Desk a={a} push={0.02}>
      <DropCard src={BLISS1} x={1290} y={160} w={430} rot={3} at={t.at('shorter') - 4} filter={DOC} />
      <Note text="quick thing before the surrender" x={150} y={110} size={52} rot={-3} at={a + 2} color={WHITE} />
      <Box x={150} y={300} w={560} h={150} at={sub - 2} label="SUBSCRIBE" seed={57} size={70} fillBg="rgba(255,111,97,0.25)" color={CORAL} />
      {g >= sub + 6 && <Loop cx={430} cy={375} rx={330} ry={120} at={sub + 6} seed={58} tilt={-3} />}
      <Note text="it's free, and it really helps the channel" x={130} y={560} size={52} rot={-3} at={t.at("It's free") - 2} />
      <Note text="promise: this plug is shorter than" x={150} y={720} size={52} rot={-3} at={t.at('I promise') - 2} color={WHITE} />
      <Note text="the Gettysburg Address" x={170} y={830} size={64} rot={-3} at={t.at('Gettysburg Address') - 2} color={CORAL} />
      <Tag text="Bliss copy of the Gettysburg Address, facsimile, 1909 · Internet Archive" />
    </Desk>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Grant t={t} />],
    [at('That summer') - 1, <Losing t={t} />],
    [at('His opponent') - 1, <McClellan t={t} />],
    [at('Then, in') - 1, <Atlanta t={t} />],
    [at('In November') - 1, <SecondTerm t={t} />],
    [at('Then Sherman') - 1, <March t={t} />],
    [at('His army') - 1, <OffTheLand t={t} />],
    [at('It tore') - 1, <Rails t={t} />],
    [at('Sherman wanted') - 1, <HardHand t={t} />],
    [at('Was that') - 1, <Debate t={t} />],
    [at('To the North') - 1, <TwoSides t={t} />],
    [at('Quick thing') - 1, <Subscribe t={t} />],
  ];
  const writes = ['Grant went', 'battle after', "wouldn't", 'enormous', 'sick', 'That summer', 'expected', 'He even', 'familiar', 'The general', 'Awkward', 'Sherman', 'The news',
    'lived', 'taking food', 'tore', 'burned', 'took what', 'not just', 'Historians', 'Sherman broke', 'will to', 'destruction', 'own sake', "It's free", 'I promise', 'Gettysburg Address'];
  return (
    <>
      {useScene(cuts)}
      {cuts.slice(1).map(([f], i) => <Sfx key={`c${i}`} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['1864', 'McClellan', 'Atlanta', 'second term', 'total war', 'subscribe'].map((p) => <Sfx key={p} at={at(p) - 1} src="sfx/stamp.wav" volume={0.26} />)}
      <Sfx at={at('hard war') - 1} src="sfx/stamp.wav" volume={0.26} />
      {writes.map((p) => <Sfx key={p} at={at(p) - 4} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('Savannah') - 2} src="sfx/tick.wav" volume={0.4} />
    </>
  );
};

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_hard_war.wav" lead={LEAD} music={[{src: 'music/w_fire.mp3', volume: 0.051}]}>
    <Body />
  </ChapterShell>
);
