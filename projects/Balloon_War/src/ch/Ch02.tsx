// Chapter 2 · The protector: D-Day under balloons, the cable diagram (a plane dives, the cable twangs, it climbs away),
// the 320th walking a balloon up the beach (3D), segregation and Double V, Waverly Woodson and the medal in the sand,
// and the hand-off: a drawn rubber tank inflating ("using air to invent one").
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import words from '../../public/audio/ch02_the_protector.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, PhotoCard, Stamp, type TL, useScene} from '../kit/shell';
import {along, Bed, Sketch, type P} from '../draw';
import {CORAL, Cut, Cutout, Desk, ORANGE} from '../bw';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);

// A barrage balloon in profile (local 0..300 x 0..120), nose at the left, three fins at the tail.
export const BALLOON: P[] = [[0, 60], [20, 26], [70, 6], [160, 0], [230, 14], [270, 38], [286, 60], [270, 82], [230, 106], [160, 120], [70, 114], [20, 94]];
const FIN_T: P[] = [[236, 22], [300, -6], [304, 30], [272, 42]];
const FIN_B: P[] = [[236, 98], [300, 126], [304, 90], [272, 78]];
const DrawnBalloon: React.FC<{x: number; y: number; s: number; at: number; fill?: string}> = ({x, y, s, at, fill = '#24676B'}) => (
  <>
    <Sketch pts={BALLOON} x={x} y={y} s={s} at={at} dur={12} width={6} closed fill={fill} fillOpacity={0.55} />
    <Sketch pts={FIN_T} x={x} y={y} s={s} at={at + 6} dur={6} width={5} closed />
    <Sketch pts={FIN_B} x={x} y={y} s={s} at={at + 6} dur={6} width={5} closed />
  </>
);
// A WWII fighter in profile (local, nose at the right).
const PLANE: P[] = [[0, 18], [20, 8], [120, 6], [148, 0], [162, 8], [200, 12], [206, 18], [200, 24], [160, 26], [120, 30], [24, 28]];
const WING: P[] = [[70, 18], [140, 18], [104, 46]];

/** "June 6, 1944. D-Day." The fleet photo as a card on the desk. */
const Fleet: React.FC<{t: TL}> = ({t}) => (
  <Desk p="ch02_protector/invasion_fleet_balloon_barrage_1944.jpg" box={[780, 260, 1080, 700]} at={0} rot={2}
    tag="The invasion fleet off Normandy under a barrage of balloons, June 1944 · US Army Air Forces">
    <Highlight text="JUNE 6, 1944" x={110} y={90} size={100} at={t.at('June')} seed={21} rot={-2} />
    <Stamp text="D-DAY" x={1380} y={70} at={t.at('D-Day')} size={150} rot={-5} />
    <Note text="thousands of ships" x={120} y={400} size={60} rot={-3} at={t.at('Thousands')} color="#ffffff" />
  </Desk>
);

/** "And floating over a lot of those ships are balloons." */
const Umbrella: React.FC<{t: TL}> = ({t}) => (
  <Desk p="ch02_protector/lst_rhino_under_balloon_umbrella_1944.jpg" box={[640, 150, 1200, 800]} at={t.at('And floating') - 1} rot={-2} pos={[0.5, 0.45]}
    tag="Landing ships unload under a balloon umbrella, Normandy, June 1944 · US Navy">
    <Note text="and floating" x={110} y={380} size={60} rot={-3} at={t.at('And floating')} color="#ffffff" />
    <Note text="over the ships:" x={130} y={480} size={60} rot={-3} at={t.at('those ships')} color="#ffffff" />
    <Note text="balloons" x={150} y={590} size={84} rot={-3} at={t.at('balloons.')} color={CORAL} />
  </Desk>
);

/** The cable diagram: a balloon on a cable over a ship; a plane dives, the cable twangs, the plane climbs away. */
const Cable: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at("They're called");
  const dive = t.at('If an');
  const hit = t.at('hit the');
  const high = t.at('stay up');
  const fence = t.at('Basically');
  // the plane's path: dives from top left toward the cable, pulls up at the hit, climbs away high at the right
  const path: P[] = [[-120, 120], [300, 300], [620, 520], [820, 610], [900, 560], [1050, 300], [1300, 130], [1700, 70], [2100, 40]];
  const u = interpolate(g, [dive, hit, high + 20], [0, 0.42, 1], clamp);
  const [px, py] = along(path, u);
  const [qx, qy] = along(path, Math.min(1, u + 0.01));
  const ang = (Math.atan2(qy - py, qx - px) * 180) / Math.PI;
  // the cable: ship deck (980, 930) to the balloon (980, 300), twanging after the hit
  const k = g >= hit ? Math.exp(-(g - hit) / 14) * Math.sin((g - hit) * 1.1) * 60 : 0;
  const cable = `M980,930 Q${980 + k},${615} 980,300`;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Definition term="barrage balloon" def="a balloon tied down with a long steel cable, to keep enemy planes up high" at={t.at('barrage') + 4} x={120} y={110} w={1100} />
      {/* the ship */}
      <Sketch pts={[[700, 930], [1300, 930], [1240, 990], [760, 990], [700, 930]]} x={0} y={0} at={a} dur={10} width={6} smooth={false} color="#EDE7DC" />
      <Sketch pts={[[880, 930], [880, 880], [1000, 880], [1000, 930]]} x={0} y={0} at={a + 4} dur={6} width={5} smooth={false} color="#EDE7DC" />
      <DrawnBalloon x={830} y={230} s={1.0} at={a + 4} />
      {g >= a + 10 && (
        <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
          <path d={cable} stroke="#EDE7DC" strokeWidth={4} fill="none" />
        </svg>
      )}
      <Note text="a long steel cable" x={1030} y={640} size={48} rot={-3} at={t.at('steel')} color="#ffffff" />
      {/* the plane */}
      {g >= dive && g < high + 26 && (
        <div style={{position: 'absolute', left: px - 103, top: py - 23, width: 206, height: 46, transform: `rotate(${ang}deg)`}}>
          <svg width={220} height={60} style={{overflow: 'visible'}}>
            <path d={'M' + PLANE.map((p) => p.join(',')).join(' L') + ' Z'} fill="#0b0d0d" stroke={pal.mark} strokeWidth={3} />
            <path d={'M' + WING.map((p) => p.join(',')).join(' L') + ' Z'} fill="#0b0d0d" stroke={pal.mark} strokeWidth={3} />
          </svg>
        </div>
      )}
      <Note text="dives low…" x={180} y={420} size={52} rot={-3} at={t.at('dives')} color="#ffffff" />
      <Note text="…could hit the cable" x={560} y={720} size={52} rot={-3} at={t.at('hit the')} color={CORAL} />
      <Note text="so pilots stay HIGH" x={1250} y={180} size={56} rot={-3} at={t.at('stay up')} />
      {/* "a fence you can't see": more balloons and cables fill the sky */}
      {[0, 1, 2, 3].map((i) => {
        const x = [260, 520, 1420, 1680][i];
        const at = fence + 6 + i * 4;
        return (
          <React.Fragment key={i}>
            <DrawnBalloon x={x - 80} y={300 + (i % 2) * 60} s={0.5} at={at} />
            {g >= at && (
              <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
                <path d={`M${x},${360 + (i % 2) * 60} L${x},1000`} stroke="#EDE7DC" strokeWidth={3} strokeDasharray="10 8" opacity={0.8} fill="none" />
              </svg>
            )}
          </React.Fragment>
        );
      })}
      <Note text="a fence you can't see" x={1180} y={860} size={56} rot={-3} at={fence + 4} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** "These were small ones, about 35 feet long": the ship on a card, its balloon in coral. */
const Beached: React.FC<{t: TL}> = ({t}) => (
  <Desk p="ch02_protector/lst388_beached_under_balloon_80g252794.jpg" box={[760, 100, 1080, 860]} at={t.at('These were') - 1} rot={1} m="lst388_balloon" traceAt={t.at('small ones')}
    tag="A landing ship beached at low tide under its balloon, Normandy, June 1944 · US Navy">
    <Note text="small ones:" x={110} y={260} size={60} rot={-3} at={t.at('small ones')} color="#ffffff" />
    <Note text="about 35 feet long" x={120} y={360} size={60} rot={-3} at={t.at('35')} color={CORAL} />
    <Arrow x1={680} y1={400} x2={1150} y2={360} bow={-40} width={7} at={t.at('35') + 4} />
    <Note text="they came ashore" x={110} y={720} size={56} rot={-3} at={t.at('come ashore')} />
    <Note text="with the troops" x={130} y={810} size={56} rot={-3} at={t.at('come ashore') + 6} />
  </Desk>
);

/** The 320th walk a balloon up the beach: the balloon and its handler, cut out. */
const Walk: React.FC<{t: TL}> = ({t}) => (
  <Cut p="ch02_protector/320th_walk_balloon_to_winch_1944.jpg" m="walk320" box={[1000, -70, 900, 1130]} at={t.at('Soldiers walked') - 1} tint={false} traceAt={t.at('Soldiers walked') + 6}
    tag="Men of the 320th Barrage Balloon Battalion, Normandy, 1944 · US Army Signal Corps (NARA 111-SC-191713)">
    <Note text="walked up the beach by hand" x={110} y={260} size={56} rot={-3} at={t.at('Soldiers walked')} color="#ffffff" />
    <Note text="like walking a very large," x={120} y={400} size={52} rot={-3} at={t.at('very large')} color={CORAL} />
    <Note text="very flammable dog" x={140} y={480} size={52} rot={-3} at={t.at('very flammable')} color={CORAL} />
    <Note text="who held the cables?" x={120} y={800} size={60} rot={-3} at={t.at('weren\'t who')} />
  </Cut>
);

/** "They were the 320th Barrage Balloon Battalion." */
const Battalion: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Desk p="ch02_protector/omaha_beachhead_panorama_balloons_1944.jpg" box={[1080, 330, 780, 500]} at={t.at('They were the') - 1} rot={2}
      tag="The Omaha Beach beachhead under barrage balloons, June 1944 · US Army Signal Corps">
        <>
          {g >= t.at('320th') && <Highlight text="THE 320TH BARRAGE" x={110} y={90} size={96} at={t.at('320th')} seed={25} rot={-2} />}
          {g >= t.at('320th') + 6 && <Highlight text="BALLOON BATTALION" x={150} y={230} size={96} at={t.at('320th') + 6} seed={26} rot={-3} />}
          <Note text="about 600 men" x={120} y={640} size={58} rot={-3} at={t.at('About 600')} color="#ffffff" />
          <Note text="every one of them Black" x={140} y={740} size={58} rot={-3} at={t.at('every one')} color="#ffffff" />
          <Note text="the only Black combat unit on the beaches" x={160} y={890} size={54} rot={-3} at={t.at('only Black')} color={CORAL} />
        </>
    </Desk>
  );
};

/** Segregation: the definition, "apart" three times (a café's two doors), the Tennessee training camp, and the two dining rooms. */
const Apart: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const ger = t.at('German');
  const tag = g >= ger ? 'Left: German POWs served in their mess hall, Camp Perry, Ohio, 1944 · US Army  |  Right: a bus rest stop, Kentucky–Tennessee, 1943 · Esther Bubley, OWI'
    : g >= t.at('While the') ? 'Barrage balloon trainees, Camp Tyson, Tennessee · Office of War Information (Library of Congress)'
    : g >= t.at('segregated') ? 'A café with a door for "White" and a door for "Colored", Durham, North Carolina, 1940 · Jack Delano, FSA (Library of Congress)' : '';
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{opacity: interpolate(g, [ger, ger + 6], [1, 0], clamp)}}>
      <Highlight text="1944" x={120} y={90} size={90} at={t.at('In 1944')} seed={27} rot={-2} />
      <Definition term="segregated" def="kept apart by race, by law and by custom" at={t.at('segregated')} x={120} y={230} w={760} />
      {(['trained apart', 'ate apart', 'served apart'] as const).map((s, i) => (
        <Note key={s} text={`✕  ${s}`} x={150} y={400 + i * 100} size={62} rot={-3} at={t.at(s.split(' ')[0])} color={i === 2 ? pal.subject : '#ffffff'} />
      ))}
      <PhotoCard src="img/ch02_protector/jim_crow_white_colored_doors_cafe_durham_1940.jpg" x={1000} y={160} w={800} h={560} rot={-2} at={t.at('segregated')} out={t.at('While the')} pos="50% 45%" />
      {g < t.at('While the') && <Note text="two doors: “White” and “Colored”" x={1040} y={780} size={46} rot={-3} at={t.at('segregated') + 8} color="#ffffff" />}
      <PhotoCard src="img/ch02_protector/camp_tyson_trainees_under_balloons_owi.jpg" x={1000} y={160} w={800} h={560} rot={2} at={t.at('While the')} pos="50% 50%" />
      {g >= t.at('Tennessee') && <Note text="training in Tennessee, 1943" x={1060} y={780} size={46} rot={-3} at={t.at('Tennessee')} color="#ffffff" />}
      </AbsoluteFill>
      {/* the restaurants: who got served */}
      <Note text="in the restaurants near camp:" x={140} y={70} size={50} rot={-2} at={ger} color="#ffffff" />
      <Note text="German prisoners of war" x={150} y={190} size={58} rot={-3} at={t.at('prisoners')} color="#ffffff" />
      <PhotoCard src="img/ch02_protector/pow_camp_perry_mess_hall_1944.jpg" x={140} y={300} w={760} h={470} rot={-2} at={t.at('prisoners')} pos="50% 55%" />
      <Note text="✓ served" x={260} y={830} size={84} rot={-3} at={t.at('eat in')} color="#2FE0C4" />
      <Note text="the 320th's own men" x={1030} y={190} size={58} rot={-3} at={t.at("wouldn't serve")} color="#ffffff" />
      <PhotoCard src="img/ch02_protector/jim_crow_colored_dining_room_rest_stop_ky_tn_1943.jpg" x={1020} y={300} w={760} h={470} rot={2} at={t.at("wouldn't serve")} pos="50% 40%" />
      <Note text="✕ not served" x={1130} y={830} size={84} rot={-3} at={t.at('serve them')} color={CORAL} />
      {tag && <Tag text={tag} />}
    </AbsoluteFill>
  );
};

/** Double V: two V's drawn on, and what they stood for. */
const DoubleV: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Double');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="fighting for a country that didn't treat them as equals" x={130} y={110} size={52} rot={-2} at={t.at('So they')} color="#ffffff" />
      <Note text="Black newspapers called it:" x={130} y={220} size={50} rot={-2} at={t.at('Black newspapers')} />
      <Sketch pts={[[0, 0], [130, 330], [260, 0]]} x={560} y={330} at={a} dur={10} width={26} smooth={false} color={ORANGE} />
      <Sketch pts={[[0, 0], [130, 330], [260, 0]]} x={860} y={330} at={a + 6} dur={10} width={26} smooth={false} color={ORANGE} />
      <Note text="Double V" x={1180} y={420} size={110} rot={-4} at={a + 4} color="#ffffff" />
      <Note text="victory over the enemy overseas" x={340} y={760} size={58} rot={-3} at={t.at('Victory over')} color="#ffffff" />
      <Note text="and over racism at home" x={400} y={870} size={64} rot={-3} at={t.at('racism')} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** Waverly Woodson: his portrait as a card on the desk, a slow drift closer. */
const Woodson: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const k = interpolate(g, [t.at('And one of'), t.at('His landing')], [1, 1.06], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: '1400px 1080px'}}>
        <Cutout name="woodson" size={[1280, 1850]} place={{left: 1270, top: 120, scale: 0.52}} at={t.at('And one of')} traceAt={t.at('Waverly')} />
      </div>
      <Note text="one of them, a medic," x={120} y={220} size={62} rot={-3} at={t.at('a medic')} color="#ffffff" />
      <Note text="would wait EIGHTY years" x={130} y={340} size={60} rot={-3} at={t.at('would wait')} />
      <Note text="for his medal" x={150} y={440} size={60} rot={-3} at={t.at('his medal')} />
      {g >= t.at('Waverly') && <Highlight text="WAVERLY WOODSON" x={110} y={700} size={92} at={t.at('Waverly')} seed={28} rot={-2} />}
      <Tag text="Waverly B. Woodson Jr., US Army medic, 320th Barrage Balloon Battalion · US Army photo" />
    </AbsoluteFill>
  );
};

/** "His landing craft was hit … kept going for about 30 hours … about 200 men." Medics at work, cut out (not Woodson). */
const AidStation: React.FC<{t: TL}> = ({t}) => (
  <Cut p="ch02_protector/medics_first_aid_utah_beach_1944.jpg" m="medics" box={[960, 200, 920, 780]} at={t.at('His landing') - 1} tint={false} traceAt={t.at('aid station')}
    tag="Army medics give first aid on Utah Beach, June 6, 1944 (not Woodson) · US Army Signal Corps">
    <Note text="his landing craft was hit" x={110} y={110} size={54} rot={-3} at={t.at('was hit')} color="#ffffff" />
    <Note text="he was wounded" x={130} y={200} size={54} rot={-3} at={t.at('wounded')} color="#ffffff" />
    <Note text="an aid station on the sand" x={140} y={310} size={54} rot={-3} at={t.at('aid station')} />
    <Stamp text="30 HOURS" x={110} y={560} at={t.at('30 hours')} size={130} rot={-4} />
    <Stamp text="~200 MEN" x={110} y={760} at={t.at('200')} size={130} rot={-3} color={CORAL} />
    <Note text="(credited with treating)" x={130} y={920} size={44} rot={-3} at={t.at('credited')} />
  </Cut>
);

/** The recommendation, and the paperwork that disappeared. */
const Paperwork: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const gone = t.at('disappeared');
  const o = interpolate(g, [gone, gone + 14], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 560, top: 170, width: 820, height: 720, opacity: g >= t.at('He was recommended') ? o : 0,
        transform: `rotate(-2deg) translateY(${(1 - o) * -60}px)`}}>
        <div style={{position: 'absolute', inset: 0, background: '#efe6d3', boxShadow: '0 20px 40px rgba(0,0,0,0.6)'}} />
      </div>
      {o > 0.05 && <Note text="recommended for:" x={630} y={250} size={48} rot={-2} at={t.at('recommended')} color="#1a1a1a" />}
      {o > 0.05 && <Note text="the Medal of Honor" x={640} y={350} size={60} rot={-2} at={t.at('Medal')} color="#1a1a1a" />}
      {o > 0.05 && <Note text="W. B. Woodson Jr., 320th" x={650} y={500} size={42} rot={-2} at={t.at('Medal') + 6} color="#5a4a3a" />}
      {g >= gone && <Sketch pts={[[560, 170], [1380, 170], [1380, 890], [560, 890], [560, 176]]} x={0} y={0} at={gone + 4} dur={12} width={5} smooth={false} color="#EDE7DC" dashed />}
      <Note text="…then the paperwork disappeared" x={520} y={950} size={52} rot={-3} at={gone + 2} color="#ffffff" />
    </AbsoluteFill>
  );
};

/** June 2024: the medal in the sand (color: now). */
const Sand: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Cut p="ch02_protector/woodson_dsc_omaha_2024.jpg" m="dsc_medal" box={[1060, 380, 760, 420]} valign="center" at={t.at('In June') - 1} traceAt={t.at('Distinguished')}
      tag="Woodson's Distinguished Service Cross on Omaha Beach, June 3, 2024 · US Army">
        <>
          {g >= t.at('June 2024') && <Highlight text="JUNE 2024" x={110} y={90} size={96} at={t.at('June 2024')} seed={29} rot={-2} />}
          <Note text="eighty years after D-Day" x={120} y={240} size={56} rot={-3} at={t.at('eighty years')} color="#ffffff" />
          <Note text="placed in the sand, on that same beach" x={120} y={330} size={50} rot={-3} at={t.at('placed')} />
          <Note text="the Distinguished Service Cross" x={1000} y={800} size={54} rot={-3} at={t.at('Distinguished')} color="#ffffff" />
          <Note text="still no Medal of Honor" x={1050} y={900} size={58} rot={-3} at={t.at('still has')} color={pal.subject} />
        </>
    </Cut>
  );
};

/** "Those balloons protected an army … another unit started using air to invent one." A flat rubber sheet inflates into a tank. */
const Invent: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('another unit');
  const flat: P[] = [[0, 110], [40, 104], [80, 112], [120, 102], [160, 112], [200, 104], [240, 112], [280, 104], [300, 110], [280, 116], [200, 118], [100, 118], [20, 116]];
  const tank: P[] = [[0, 80], [20, 50], [90, 48], [110, 20], [190, 20], [210, 48], [280, 50], [300, 80], [280, 112], [200, 118], [100, 118], [20, 112], [0, 80]];
  return (
    <AbsoluteFill>
      <Desk p="ch02_protector/camp_tyson_trainees_under_balloons_owi.jpg" box={[760, 200, 1040, 700]} at={t.at('Those balloons') - 1} rot={-2} />
      {g >= a - 6 && <AbsoluteFill style={{background: 'rgba(11,11,11,0.82)', opacity: interpolate(g, [a - 6, a + 4], [0, 1], clamp)}} />}
      <Note text="protected an army" x={120} y={110} size={60} rot={-3} at={t.at('protected')} color="#ffffff" />
      <Sketch pts={flat} x={660} y={420} s={2} at={a} dur={8} width={7} closed to={tank} ma={t.at('using air')} mb={t.at('using air') + 20} fill="#24676B" fillOpacity={0.5} />
      {g >= t.at('using air') + 16 && <Sketch pts={[[300, 34], [470, 20]]} x={660} y={420} s={2} at={t.at('using air') + 16} dur={6} width={8} />}
      <Note text="…using air to INVENT one" x={600} y={820} size={64} rot={-3} at={t.at('invent')} color={CORAL} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Fleet t={t} />],
    [at('And floating') - 1, <Umbrella t={t} />],
    [at("They're called") - 1, <Cable t={t} />],
    [at('These were') - 1, <Beached t={t} />],
    [at('Soldiers walked') - 1, <Walk t={t} />],
    [at('They were the') - 1, <Battalion t={t} />],
    [at("That's worth") - 1, <Apart t={t} />],
    [at('So they') - 1, <DoubleV t={t} />],
    [at('And one of') - 1, <Woodson t={t} />],
    [at('His landing') - 1, <AidStation t={t} />],
    [at('He was recommended') - 1, <Paperwork t={t} />],
    [at('In June') - 1, <Sand t={t} />],
    [at('Those balloons') - 1, <Invent t={t} />],
  ];
  const scene = useScene(cuts.map(([f, n], i): [number, React.ReactNode] => [f, <React.Fragment key={i}>{n}</React.Fragment>]));
  return (
    <>
      {scene}
      {/* b_newsreel's broad, noble middle under the beach; then the dignified cello under the 320th and Woodson */}
      <Bed src="music/b_newsreel.mp3" from={0} to={at("That's worth") + 20} volume={0.2} startFrom={30 * 62} fadeOut={40} />
      <Bed src="music/g_world_outside.mp3" from={at("That's worth") - 10} to={t.frames + 20} volume={0.16} startFrom={0} fadeIn={40} />
      <Bed src="sfx/waves_beach.wav" from={0} to={at("They're called")} volume={0.16} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.28} />)}
      {['June', 'D-Day', '320th', 'In 1944', 'June 2024', '30 hours', '200'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {['Thousands', 'steel', 'dives', 'stay up', 'Basically', '35', 'come ashore', 'Soldiers walked', 'very flammable', 'About 600', 'every one', 'only Black',
        'segregated', 'trained', 'ate', 'served', 'Tennessee', 'German', 'prisoners', 'eat in', "wouldn't serve", 'So they', 'Black newspapers', 'Victory over', 'racism',
        'a medic', 'would wait', 'was hit', 'aid station', 'credited', 'recommended', 'Medal', 'eighty years', 'placed', 'Distinguished', 'still has', 'protected', 'invent'].map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('dives')} src="sfx/plane_flyby.wav" volume={0.3} />
      <Sfx at={at('hit the')} src="sfx/rope_creak.wav" volume={0.35} />
      <Sfx at={at('Double')} src="sfx/stamp.wav" volume={0.3} />
      <Sfx at={at('disappeared')} src="sfx/paper_rustle.wav" volume={0.3} />
      <Sfx at={at('using air')} src="sfx/balloon_inflate.wav" volume={0.35} />
    </>
  );
};

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_the_protector.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
