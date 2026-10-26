// Chapter 3 · Old Tippecanoe: who Harrison was, 1811 (plain, no jokes), a candidate who promises nothing, and a
// banner still waiting for a slogan.
import React from 'react';
import words from '../../public/audio/ch03_old_tippecanoe.words.json';
import {Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, Photo, Stamp, type TL, useScene} from '../kit/shell';
import {Sounds} from '../kit/bs';
import {type Cam, MapScene, Pin, Route} from '../kit/map';
import {BANNER, BARREL, Board, CABIN, PaperCard, RubberStamp, Sketch, Zipper} from '../kit/lc';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH03_FRAMES = chapterFrames(N, LEAD);

const HOIT: [number, number] = [1920, 2314];
const CUR: [number, number] = [2049, 3000];
const BATTLE: [number, number] = [1536, 1067];
/** Map pixels on Mitchell's 1836 map (fitted from known cities). */
const PROPHETSTOWN = [2103, 1977];
const VINCENNES = [2006, 2216];

/** The candidate. */
const Who: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Photo src="img/ch03/harrison_hoit_1840.jpg" size={HOIT} fx={1000} fy={900} z0={1.02} z1={1.1} a={0} b={t.at('His big')} mask={MASKS.harrison} traceAt={6}>
      {() => (
        <>
          {g >= 2 && <Highlight text="WILLIAM HENRY HARRISON" x={90} y={70} size={84} at={2} seed={41} rot={-2} />}
          <Stamp text="67" x={150} y={330} at={t.at('Age 67.')} size={220} color="#f4efe6" />
          <Note text="age" x={110} y={300} size={54} rot={-6} at={t.at('Age 67.') - 3} color="#ffffff" />
          <Note text="congressman" x={1420} y={420} size={58} rot={-3} at={t.at('Former congressman') - 3} />
          <Note text="governor" x={1440} y={540} size={58} rot={-3} at={t.at('governor and') - 3} />
          <Note text="general" x={1460} y={660} size={58} rot={-3} at={t.at('general.') - 3} />
          <Tag text="Albert Gallatin Hoit, William Henry Harrison, 1840 · National Portrait Gallery, via Wikimedia Commons" />
        </>
      )}
    </Photo>
  );
};

/** 1811: Indiana Territory, Prophetstown, the Tippecanoe River. Plain statements, no marks beyond the facts. */
const Map1811: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const keys: Cam[] = [
    {f: 0, x: 2350, y: 2150, s: 0.5},
    {f: t.at('Indiana Territory'), x: 2080, y: 2080, s: 0.95},
  ];
  return (
    <MapScene keys={keys} dim={0.2}>
      {(S) => {
        const [px, py] = S(PROPHETSTOWN);
        const [vx, vy] = S(VINCENNES);
        return (
          <>
            {g >= t.at('1811.') && <Highlight text="1811" x={100} y={80} size={110} at={t.at('1811.')} seed={43} rot={-2} />}
            <Note text="Indiana Territory" x={110} y={260} size={58} rot={-3} at={t.at('Indiana Territory') - 3} color="#ffffff" />
            <Route pts={[VINCENNES, [2060, 2120], PROPHETSTOWN]} at={t.at('marches') + 2} dur={24} width={10} dashed />
            <Pin x={vx} y={vy} at={t.at('marches')} r={11} />
            <Note text="Harrison's army" x={vx + 30} y={vy + 10} size={44} rot={-3} at={t.at('marches') + 2} />
            <Pin x={px} y={py} at={t.at('a Native')} r={14} color="#EDE7DC" />
            <Note text="Prophetstown" x={px + 30} y={py - 90} size={52} rot={-3} at={t.at('a Native') - 2} color="#ffffff" />
            <Note text="near the Tippecanoe River" x={px + 30} y={py - 20} size={44} rot={-3} at={t.at('Tippecanoe River') - 3} />
            <Tag text="Samuel Augustus Mitchell, Map of the United States, 1836 · Library of Congress" />
          </>
        );
      }}
    </MapScene>
  );
};

/** The fight, from an 1859 print. Quiet: white notes, no coral. */
const Fight: React.FC<{t: TL}> = ({t}) => (
  <Photo src="img/ch03/battle_tippecanoe_1859.jpg" size={BATTLE} fx={768} fy={560} z0={1.04} z1={1.12} a={t.at('The fight')} b={t.at('But it earns')}>
    {() => (
      <>
        <Note text="bloody" x={110} y={90} size={62} rot={-3} at={t.at('bloody.') - 3} color="#ffffff" />
        <Note text="Harrison: 'a victory'" x={110} y={190} size={54} rot={-3} at={t.at('calls it') - 3} color="#ffffff" />
        <Note text="heavy losses on his side" x={1180} y={860} size={52} rot={-3} at={t.at('His army lost') - 3} color="#ffffff" />
        <Note text="disputed even then" x={1240} y={950} size={52} rot={-3} at={t.at('argued about') - 3} color="#ffffff" />
        <Tag text="After Alonzo Chappel, Battle of Tippecanoe (printed 1859, long after the battle) · Library of Congress" />
      </>
    )}
  </Photo>
);

/** The nickname that sticks. */
const Nickname: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Board>
      <CropCard src="img/ch03/harrison_tippecanoe_currier.jpg" size={CUR} x={160} y={160} w={560} h={760} fx={1000} fy={1250} scale={0.42} rot={-2} at={1} />
      <Note text="it earns him a nickname:" x={840} y={300} size={56} rot={-3} at={t.at('nickname:') - 3} color="#ffffff" />
      {g >= t.at('Old Tippecanoe') && <Highlight text="OLD TIPPECANOE" x={820} y={420} size={110} at={t.at('Old Tippecanoe')} seed={45} rot={-2} />}
      <Tag text="N. Currier, General William H. Harrison at the Battle of Tippecanoe, 1840 · Library of Congress" />
    </Board>
  );
};

/** The platform: nothing. Then the zipper. */
const NoPromises: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const bullets = [0, 1, 2, 3];
  return (
    <Board>
      <Note text="what does he promise?" x={110} y={90} size={58} rot={-3} at={t.at('So what does') - 3} color="#ffffff" />
      <PaperCard x={150} y={220} w={620} at={t.at('Nothing.') - 2} rot={-2} title="PLATFORM">
        {bullets.map((i) => <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, margin: '22px 0'}}><div style={{width: 18, height: 18, borderRadius: 9, background: '#333'}} /><div style={{flex: 1, borderBottom: '3px dashed #aaa', height: 4}} /></div>)}
      </PaperCard>
      <RubberStamp text="NOTHING." x={300} y={520} at={t.at('Nothing.')} size={100} rot={-10} />
      {g >= t.at('platform,') && <Highlight text="PLATFORM" x={900} y={150} size={100} at={t.at('platform,')} seed={47} rot={-2} />}
      <Definition term="plat·form" def="a list of what a party promises to do" at={t.at('a list of') - 2} x={920} y={310} w={900} />
      <Note text="no list. no plans." x={940} y={470} size={64} rot={-3} at={t.at('No list.') - 3} color={pal.subject} />
      <CropCard mask={MASKS.harrison} tint={null} src="img/ch03/harrison_hoit_1840.jpg" size={HOIT} x={1080} y={600} w={300} h={330} fx={1000} fy={700} scale={0.36} rot={3} at={t.at('His advisers') - 2} traceAt={t.at('His advisers') + 4}>
        {(S) => {
          const [mx, my] = S(940, 900);
          return <Zipper x={mx} y={my} w={130} at={t.at('keep quiet.') - 2} rot={-4} />;
        }}
      </CropCard>
      <Note text="keep quiet" x={1440} y={700} size={58} rot={-3} at={t.at('keep quiet.') - 3} />
      <Note text="can't be blamed" x={1420} y={860} size={58} rot={-3} at={t.at('never be blamed') - 3} color={pal.subject} />
    </Board>
  );
};

/** A strategy, not a slogan: an empty banner... until the insult fills it. */
const Banner: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const g = useGFrame();
  const fill = t.at('hands them');
  return (
    <Board>
      <Note text="a strategy ✓" x={140} y={110} size={64} rot={-3} at={t.at("That's a strategy") - 3} />
      <Note text="a slogan?" x={140} y={220} size={64} rot={-3} at={t.at("isn't a slogan") - 3} color={pal.subject} />
      <Sketch d={BANNER} x={360} y={400} w={1200} at={t.at('banners.') - 6} dur={10} seed="bn" />
      {g >= fill && <Sketch d={CABIN} x={600} y={470} w={200} at={fill} dur={8} seed="bc" />}
      {g >= fill && <Sketch d={BARREL} x={1170} y={470} w={110} at={fill + 3} dur={8} seed="bb" />}
      {g >= fill + 6 && <div style={{position: 'absolute', left: 820, top: 520, fontFamily: JF.display, fontSize: 72, color: '#f4efe6', textShadow: '0 3px 12px #000'}}>?</div>}
      <Note text="the editor in Baltimore..." x={420} y={820} size={60} rot={-3} at={t.at('Then the editor') - 3} color="#ffffff" />
      <Note text="hands them one" x={560} y={920} size={64} rot={-3} at={fill - 3} />
      <Loop cx={960} cy={560} rx={640} ry={200} at={fill + 8} seed={49} tilt={-2} />
    </Board>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Who t={t} />],
    [at('His big') - 1, <Map1811 t={t} />],
    [at('The fight') - 1, <Fight t={t} />],
    [at('But it earns') - 1, <Nickname t={t} />],
    [at('So what does') - 1, <NoPromises t={t} />],
    [at("That's a strategy") - 1, <Banner t={t} />],
  ];
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map((c) => c[0])}
        stamps={[2, at('Age 67.'), at('1811.'), at('Old Tippecanoe'), at('Nothing.'), at('platform,')]}
        ticks={[at('marches'), at('a Native')]}
        writes={['Former congressman', 'governor and', 'general.', 'Indiana Territory', 'Tippecanoe River', 'bloody.', 'calls it', 'His army lost', 'argued about', 'nickname:', 'So what does', 'No list.', 'keep quiet.', 'never be blamed', "That's a strategy", "isn't a slogan", 'Then the editor', 'hands them'].map((p) => at(p))} />
    </>
  );
};

export const Ch03: React.FC = () => {
  const t = makeTimeline(N, 30);
  return (
    <ChapterShell n={N} audio="audio/ch03_old_tippecanoe.wav" lead={LEAD}
      music={[{src: 'music/w_frontier.mp3', volume: 0.12, to: t.at('So what does')}, {src: 'music/a_price.mp3', volume: 0.2, from: t.at('So what does') - 10}]}>
      <Body />
    </ChapterShell>
  );
};
