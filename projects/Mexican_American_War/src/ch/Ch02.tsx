// Chapter 2 · Come On In: Mexico's empty north, the invitation, Austin's colonists, slavery, the 1829 and 1830 laws.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import mapData from '../../public/maps/mex1846.json';
import words from '../../public/audio/ch02_come_on_in.words.json';
import {Highlight, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {Border, type Cam3, Dot, Fill, Flow, Hand, MAP3D, Map3D, type MapData, PlaceTag, RegionName, Slab, Stand} from '../kit/map3d';
import {Parallax} from '../kit/parallax';
import {ChapterShell, chapterFrames, CropCard, Definition, hasFile, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
const D = mapData as unknown as MapData;
const pl = D.places;
export const CH02_FRAMES = chapterFrames(N, LEAD);

const GEN: [number, number] = [1376, 768];
const AUSTIN = 'img/ch02/austin_1836.jpg';
const AUSTIN_SIZE: [number, number] = [1960, 2490];

/** Mexico in 1821 rises; then Texas: Comanche lands, a few Tejano towns. */
const North: React.FC<{t: TL}> = ({t}) => {
  const keys: Cam3[] = [
    {f: 0, x: 3000, y: 2350, z: 0.3, tilt: 26, rot: 0},
    {f: t.at('frontier') , x: 3000, y: 2000, z: 0.36, tilt: 34, rot: 0},
    {f: t.at('Comanche'), x: 3200, y: 1800, z: 0.85, tilt: 44, rot: -6},
    {f: t.at('few'), x: 3260, y: 1880, z: 1.0, tilt: 48, rot: -8},
  ];
  const towns: [keyof typeof pl, string][] = [['sanAntonio', 'San Antonio'], ['goliad', 'Goliad'], ['nacogdoches', 'Nacogdoches']];
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Slab api={api} region="mexicoNow" at={t.at('Mexico')} h={34} layers={8} fall={t.at('Comanche')} />
            <Slab api={api} region="mexicoNorth" at={t.at('Mexico') + 3} h={34} layers={8} fall={t.at('Comanche')} />
            <Stand api={api} at={pl.zacatecas} z={60} show={t.at('Mexico') + 8} out={t.at('Comanche')}><RegionName text="MEXICO" size={110} /></Stand>
            <Fill api={api} region="texasProvince" at={t.at('Texas.')} out={t.at('Tejanos,')} outline={MAP3D.mexico} color={MAP3D.mexico} opacity={0.18} />
            <Stand api={api} at={[3300, 1780]} z={60} show={t.at('Texas.')} out={t.at('Tejanos,')}><Hand text="Texas" size={90} bg /></Stand>
            <Fill api={api} region="comancheria" at={t.at('Comanche')} color="#7d6b55" opacity={0.35} hatch="rgba(60,50,40,0.45)" />
            <Stand api={api} at={D.nations.Comanche} z={10} show={t.at('Comanche') + 2}><Hand text="Comanche lands" size={60} color="#f4efe6" bg /></Stand>
            {towns.map(([k, name], i) => (
              <React.Fragment key={k}>
                <Dot api={api} at={pl[k]} show={t.at('Tejanos,') + i * 3} />
                <Stand api={api} at={[pl[k][0], pl[k][1] - 10]} show={t.at('Tejanos,') + 2 + i * 3}><PlaceTag text={name} size={24} /></Stand>
              </React.Fragment>
            ))}
            <Stand api={api} at={[3330, 2060]} z={40} show={t.at('few') - 2}><Hand text="only a few thousand" size={64} color="#ffffff" bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Highlight text="1821" x={100} y={90} size={110} at={t.at('1821.')} seed={71} rot={-2} />
        <Definition term="Tejanos" def="Mexican Texans" at={t.at('Mexican Texans')} x={110} y={880} w={900} />
      </AbsoluteFill>
    </>
  );
};

/** The plan, over a Tejano ranch. */
const Ranch: React.FC<{t: TL}> = ({t}) => (
  <Parallax name="tejano_rancher" src="img/gen/ch02_tejano_ranch.jpg" size={GEN} a={t.at('So Mexico has') - 1} b={t.at('Americans jump')} fx={0.45} fy={0.5}
    cam={{z: [1.0, 1.08], x: [0.02, -0.02]}} depth={1.05} vignette={0.3} mask={MASKS.tejano_rancher} tintStrength={0.6} traceAt={t.at('idea.')}
    tag="Illustration · a Tejano ranch near San Antonio, 1820s">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to right, rgba(0,0,0,0) 45%, rgba(0,0,0,0.72) 85%)'}} />
        <Note text="Mexico's idea:" x={1250} y={160} size={56} rot={-3} at={t.at('idea.') - 2} color="#ffffff" />
        <Note text="invite people in" x={1290} y={280} size={62} rot={-3} at={t.at('Invite') - 2} />
        <Note text="cheap land…" x={1290} y={400} size={62} rot={-3} at={t.at('cheap') - 2} />
        <Note text="→ they farm it" x={1210} y={520} size={56} rot={-3} at={t.at('farm') - 2} />
        <Note text="→ they help defend it" x={1210} y={620} size={56} rot={-3} at={t.at('defend') - 2} />
      </>
    )}
  </Parallax>
);

/** Stephen F. Austin, empresario, and the rules. */
const Austin: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('Americans jump') - 1;
  const rules = (
    <>
      {g >= t.at('empresario,') && <Highlight text="EMPRESARIO" x={900} y={110} size={92} at={t.at('empresario,')} seed={73} rot={-2} />}
      <Definition term="em·pre·sa·rio" def="a contractor paid in land for bringing settlers" at={t.at('contractor')} x={900} y={260} w={900} />
      <Stamp text="300 families" x={920} y={420} at={t.at('300')} size={96} />
      <Note text="the rules:" x={930} y={580} size={54} rot={-3} at={t.at('rules:') - 2} color="#ffffff" />
      <Note text="✓ become a Mexican citizen" x={960} y={670} size={52} rot={-3} at={t.at('citizen,') - 6} />
      <Note text="✓ follow Mexican law" x={960} y={760} size={52} rot={-3} at={t.at('law,') - 6} />
      <Note text="✓ become Catholic" x={960} y={850} size={52} rot={-3} at={t.at('Catholic.') - 6} />
    </>
  );
  return (
    <AbsoluteFill>
      <DarkPaper />
      {hasFile(AUSTIN) ? (
        <CropCard src={AUSTIN} size={AUSTIN_SIZE} x={150} y={130} w={600} h={780} fx={1000} fy={1050} scale={0.5} rot={-2} at={a} mask={MASKS.austin} tintStrength={0.5} traceAt={t.at('Austin,')} />
      ) : (
        <Note text="[Stephen F. Austin portrait]" x={160} y={480} size={50} color="#ffffff" />
      )}
      <Note text="Stephen F. Austin" x={190} y={960} size={50} rot={-2} at={t.at('Stephen') - 2} color="#ffffff" />
      {rules}
      <Tag text="Stephen F. Austin, portrait painted 1836 · E. C. Barker, Life of Stephen F. Austin (1925)" />
    </AbsoluteFill>
  );
};

/** Settlers from the South, and the people they brought: the enslaved family is the subject. */
const Settlers: React.FC<{t: TL}> = ({t}) => (
  <Parallax name="settlers_enslaved" src="img/gen/ch02_settlers_arrive.jpg" size={GEN} a={t.at('Many') - 1} b={t.at('By the early')} fx={0.55} fy={0.52}
    cam={{z: [1.0, 1.1], x: [-0.03, 0.04]}} depth={1.05} vignette={0.3} mask={MASKS.settlers_enslaved} tintStrength={0.6} traceAt={t.at('enslaved')}
    tag="Illustration · settlers arriving in Mexican Texas, 1820s">
    {() => (
      <>
        <Note text="from the South…" x={110} y={110} size={60} rot={-3} at={t.at('South') - 2} color="#ffffff" />
        <Note text="…to grow cotton" x={150} y={220} size={60} rot={-3} at={t.at('cotton.') - 2} color="#ffffff" />
      </>
    )}
  </Parallax>
);

/** Too well: settlers stream in; then the two laws (1829, 1830) and the border they didn't stop. */
const Streams: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('By the early') - 1;
  const keys: Cam3[] = [
    {f: a, x: 3500, y: 1800, z: 0.8, tilt: 44, rot: -4},
    {f: t.at('well.'), x: 3450, y: 1820, z: 0.9, tilt: 48, rot: -8},
  ];
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Flow api={api} from={[4050, 1650]} to={[3380, 1950]} at={a} n={30} spread={170} toSpread={140} color={MAP3D.us} seed="ch2a" />
            {(['sanAntonio', 'goliad', 'nacogdoches'] as const).map((k) => <Dot key={k} api={api} at={pl[k]} color={MAP3D.mexico} />)}
            <Stand api={api} at={[3560, 1640]} z={30} show={t.at('Americans in')}><Hand text="Americans" size={70} color={MAP3D.us} bg /></Stand>
            <Stand api={api} at={[3080, 2120]} z={30} show={t.at('Tejanos', 2) - 2}><Hand text="Tejanos" size={56} color={MAP3D.mexico} bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Note text="many times over" x={110} y={80} size={62} rot={-3} at={t.at('many times') - 2} color="#ffffff" />
        <Note text="the plan worked… a little too well" x={140} y={180} size={58} rot={-3} at={t.at('little') - 2} color={pal.subject} />
      </AbsoluteFill>
    </>
  );
};

/** 1829: Mexico abolishes slavery; Texas wins an exception. */
const Abolition: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="Mexico tries to slow things down" x={160} y={150} size={58} rot={-3} at={t.at('slow') - 2} color="#ffffff" />
      {g >= t.at('1829,') && <Highlight text="1829" after="SLAVERY ABOLISHED" x={160} y={330} size={110} at={t.at('1829,')} seed={75} rot={-2} />}
      <Note text="…except in Texas" x={260} y={560} size={80} rot={-4} at={t.at('exception.') - 6} color="#FF9F1C" />
    </AbsoluteFill>
  );
};

/** 1830: no more Americans, no more enslaved people, taxes and soldiers. They keep coming. */
const Closed: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const g = useGFrame();
  const a = t.at('In 1830,') - 1;
  const keys: Cam3[] = [
    {f: a, x: 3650, y: 1750, z: 1.0, tilt: 46, rot: -6},
    {f: t.at('anyway.'), x: 3600, y: 1780, z: 1.1, tilt: 50, rot: -10},
  ];
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Border api={api} d={D.lines.sabine} at={a + 2} color="#f4efe6" label="Sabine River · Mexico's border" labelSize={24} />
            <Stand api={api} at={[3930, 1700]} z={40} show={t.at('bans')}><div style={{fontFamily: '"Abril Fatface", serif', fontSize: 90, color: pal.subject, border: `8px solid ${pal.subject}`, padding: '0 22px', transform: 'rotate(-8deg)', background: 'rgba(14,14,14,0.6)'}}>CLOSED</div></Stand>
            <Flow api={api} from={[4100, 1600]} to={[3350, 1900]} at={t.at('keep')} n={30} spread={170} toSpread={140} color={MAP3D.us} seed="ch2b" />
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        {g >= t.at('1830,') && <Highlight text="1830" x={100} y={90} size={110} at={t.at('1830,')} seed={77} rot={-2} />}
        <Note text="no new Americans" x={120} y={250} size={56} rot={-3} at={t.at('American settlers') - 2} color="#ffffff" />
        <Note text="no new enslaved people" x={140} y={340} size={56} rot={-3} at={t.at('enslaved', 2) - 2} color="#ffffff" />
        <Note text="+ soldiers to collect taxes" x={160} y={430} size={56} rot={-3} at={t.at('soldiers') - 2} color="#ffffff" />
        <Note text="they keep coming anyway" x={1000} y={800} size={64} rot={-3} at={t.at('keep') - 2} />
        <Note text="something has to give" x={1040} y={900} size={64} rot={-3} at={t.at('Something') - 2} color={pal.subject} />
      </AbsoluteFill>
    </>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <North t={t} />],
    [at('So Mexico has') - 1, <Ranch t={t} />],
    [at('Americans jump') - 1, <Austin t={t} />],
    [at('Many') - 1, <Settlers t={t} />],
    [at('By the early') - 1, <Streams t={t} />],
    [at('So Mexico tries') - 1, <Abolition t={t} />],
    [at('In 1830,') - 1, <Closed t={t} />],
  ];
  const scene = useScene(cuts);
  const notes = ['idea.', 'Invite', 'cheap', 'farm', 'defend', 'Stephen', 'rules:', 'South', 'cotton.', 'many times', 'little', 'slow', 'American settlers', 'soldiers', 'keep', 'Something'];
  return (
    <>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['1821.', 'empresario,', '1829,', '1830,'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {['300', 'bans'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.35} />)}
      {notes.map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {['citizen,', 'law,', 'Catholic.'].map((c) => <Sfx key={c} at={at(c) - 8} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('Tejanos,')} src="sfx/tick.wav" volume={0.45} />
    </>
  );
};

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_come_on_in.wav" lead={LEAD} music={[{src: 'music/j_good_feelings.mp3', volume: 0.15}]}>
    <Body />
  </ChapterShell>
);
