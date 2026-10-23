// Chapter 8 · No Land. The land never came (the forty acres crossed out); Frazier's "to have land", Edisto, Stevens;
// everybody had a problem (land, labor, money); the Bureau's labor contracts ("as he use to when a slave") tear apart;
// the deal: an 1867 Mississippi sharecropping contract ("one half of the crop"); one family, step by step, as a drawn
// farm; tenant farming as the step up; "looked like progress"; and the word "partly".
// Sources: the New-York Tribune's minutes of the Savannah meeting (LOC); Moore's Edisto photograph (LOC); a Freedmen's
// Bureau labor agreement, Lumberton, N.C., 1865 (NARA 595055); a sharecropping contract, De Soto County, Miss., 1867
// (Nabb Center, Salisbury Univ., on the Internet Archive); cotton fields, 1860s-1906 (LOC).
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch08_no_land.words.json';
import {DarkPaper, Sfx} from '../kit/common';
import {Highlight, Loop, Tag} from '../kit/Kit';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';
import {SeriesBoard} from '../kit/ep2board';
import {type Box, camAt, carry, cut, DOC_F, FocusIn, PhotoShot, Sheet, type SheetCam, Slip, Spot, Swipe, TEAL, Tear} from '../kit/rc';
import {Cross, Farm, type FarmCues, Have} from './ch08_draw';

const N = words as Narration;
const t = makeTimeline(N, 30);
const c = (p: string, n = 1) => cut(t, p, n);
/** The board after the last word. */
const EXTRA = 40;
export const CH08_FRAMES = chapterFrames(N, LEAD) + EXTRA;

// sources
const TRIB = 'img/ep1/savannah_meeting_minutes_ny_tribune_13feb1865.jpg';
const TRIB_S: [number, number] = [1764, 3000];
const BUREAU = 'img/ch08/freedmens_bureau_labor_agreement_truss_hall_1865_nara.jpg';
const BUREAU_S: [number, number] = [892, 720];
const DEAL = 'img/ch08/desoto_contract_cut.png';          // the contract, cut out of the scan's white surround
const DEAL_S: [number, number] = [1557, 2458];
const HAND_F = 'grayscale(1) sepia(0.15) contrast(1.3) brightness(1.04)';   // pen and ink: keep the strokes soft
const SRC = {
  acres: 'The forty acres, Special Field Order No. 15 (from Part 1) · coast: U.S. Census Bureau',
  trib: 'New-York Daily Tribune, Feb. 13, 1865 · Library of Congress',
  edisto: 'Freedpeople, Hopkinson plantation, Edisto Island, 1862 · Henry P. Moore · Library of Congress',
  stevens: 'Thaddeus Stevens, Brady-Handy studio · Library of Congress',
  desk: 'Edisto Island, 1862 (Henry P. Moore) · Thaddeus Stevens (Brady-Handy) · Library of Congress',
  cotton96: 'Cotton picking, Mississippi, 1896 · Library of Congress',
  bureau: "Freedmen's Bureau labor agreement, Lumberton, N.C., Aug. 28, 1865 · National Archives",
  deal: 'Sharecropping contract, De Soto County, Miss., Feb. 1867 · Nabb Center, Salisbury Univ. · Internet Archive',
  stereo: 'Picking cotton near Montgomery, Alabama, stereograph, 1860s? · Library of Congress',
  ark: 'Picking cotton, Arkansas, stereograph, 1906 · Library of Congress',
};

// line boxes (source px), each drawn on its page and checked
const FRAZIER: Box = [145, 405, 382, 24];        // "Garrison Frazier, aged 67 years,"
const Q1: Box = [190, 2540, 522, 26];            // "The way we can best take care of ourselves"
const Q2: Box = [42, 2568, 196, 26];             // "is to have land,"
const WAGE: Box = [638, 314, 246, 36];           // "4.00 per month"
const SLAVE: Box = [392, 462, 465, 36];          // "as he use to when a slave."
const HALF: Box = [485, 1665, 740, 52];          // "one half of of the crop"

// the shots
const S1 = c('Remember Garrison'), S1B = c('The way we'), S2 = c('Remember Edisto'), S3 = c('Most freedpeople'), S4 = c('And everybody');
const S5 = c("The Freedmen's"), TEAR = t.at('fell apart') - 2, S7 = c('A planter divides'), S8 = c('There was a step'), S9 = c('At first');
const S10 = c('A family working'), B = c('is where');
const word = (p: string, k: number) => t.wordAt(t.idx(p) + k);

const CUES: FarmCues = {
  land: S7 + 2, divide: t.at('divides'), family: t.at('A family moves'), push: t.at('A family moves') + 2, acres: t.at('maybe 20'), cabin: t.at('a cabin'),
  planter: t.at('The planter provides'), pLand: word('provides the land', 2), pMule: t.at('mule'), pTools: t.at('tools'),
  fam: t.at('The family provides'), work: t.at('the work'), harvest: t.at('At harvest'), split: t.at('split the crop'), halves: t.at('half and half'),
};
const TENANT: FarmCues = {...CUES, tenant: S8, rent: t.at('paid in cash'), rentSplit: t.at('fixed amount'), own: t.at('owned their own')};

const Sounds: React.FC = () => (
  <>
    {[S1, S1B, S2, S3, S4, S5, S7, S8, S9, S10].map((f) => <Sfx key={f} at={f - 3} src="sfx/whoosh.wav" volume={0.22} />)}
    {['sharecropping', 'tenant farming'].map((p) => <Sfx key={p} at={t.at(p)} src="sfx/stamp.wav" volume={0.3} />)}
    {[t.at('The way we'), t.at('is to have'), t.at('contracts'), t.at('sometimes'), t.at('a deal')].map((f) => <Sfx key={f} at={f} src="sfx/marker_tick.wav" volume={0.22} />)}
  </>
);

// ---------------------------------------------------------------------------------------------------------- shots
/** A page on the desk with a camera path and its tag. */
const Doc: React.FC<{src: string; size: [number, number]; keys: [number, SheetCam][]; a: number; b: number; tag: string; filter?: string; children?: React.ReactNode; over?: React.ReactNode}> = ({
  src, size, keys, a, b, tag, filter = DOC_F, children, over,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={a}>
        <Sheet src={src} size={size} cam={camAt(keys, f)} seed={src} filter={filter} offset={[carry(f, a, b), 0]}>{children}</Sheet>
      </FocusIn>
      {over}
      <Tag text={tag} />
    </AbsoluteFill>
  );
};

/** A creased print on the desk (no FocusIn on the second one: it lands on its word). */
const Print: React.FC<{src: string; size: [number, number]; w: number; x: number; y: number; rot?: number; at: number}> = ({src, size, w, x, y, rot = 0, at}) => {
  const h = (size[1] * w) / size[0];
  return (
    <FocusIn at={at}>
      <Img src={staticFile(src)} style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg)`, filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.7))'}} />
    </FocusIn>
  );
};

/** Remember Edisto? Remember Stevens? Two prints on the desk. */
const Callbacks: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `translateX(${carry(f, S2, S3) * 0.6}px)`}}>
        <Print src="img/ch08/cr_edisto.png" size={[900, 657]} w={760} x={560} y={470} rot={-2} at={S2} />
        <Print src="img/wall/cr_stevens.png" size={[900, 1134]} w={430} x={1440} y={500} rot={2} at={t.at('Thaddeus') - 1} />
      </AbsoluteFill>
      <Slip text="Edisto: the land, taken back" x={240} y={800} rot={-2} size={56} at={t.at('Edisto') + 4} />
      <Slip text="died 1868" x={1300} y={850} rot={2} size={60} at={t.at('died with him') - 2} />
      <Sfx at={S2} src="sfx/tick.wav" volume={0.35} />
      <Sfx at={t.at('Thaddeus') - 1} src="sfx/tick.wav" volume={0.35} />
      <Tag text={SRC.desk} />
    </AbsoluteFill>
  );
};

/** The Bureau's labor contract: $4 a month, "as he use to when a slave", signed with his mark. */
const Bureau: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt([[S5, {x: 446, y: 380, z: 1.32}], [t.at('sign') - 4, {x: 446, y: 380, z: 1.36}], [t.at('contracts'), {x: 600, y: 430, z: 1.72}], [TEAR, {x: 610, y: 440, z: 1.78}]], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={S5}>
        <Sheet src={BUREAU} size={BUREAU_S} cam={cam} seed="bureau" filter={HAND_F} offset={[carry(f, S5, 1e7) * 0.5, 0]}>
          <Loop cx={654} cy={560} rx={62} ry={40} at={t.at('sign')} width={3} color={TEAL} seed={81} />
          <Swipe lines={[WAGE]} from={t.at('contracts')} to={t.end('with planters') + 4} seed="wg" />
          <Swipe lines={[SLAVE]} from={t.at('sometimes')} to={t.end('owned them')} seed="sl" />
        </Sheet>
      </FocusIn>
      <Slip text="$4 a month" x={1240} y={130} rot={2} at={t.at('contracts') + 6} />
      <Slip text="“as he use to when a slave”" x={250} y={860} rot={-1.5} size={58} at={t.at('sometimes') + 8} />
      <Tag text={SRC.bureau} />
    </AbsoluteFill>
  );
};

/** The deal: the 1867 contract, "one half of the crop", then the freedman's name and mark. */
const Deal: React.FC = () => {
  const f = useCurrentFrame();
  const sc = t.at('sharecropping');
  const L: SheetCam = {x: 0, y: 1692, z: 1.0, tilt: 24, dof: 2.2, band: 80};
  const cam = camAt([
    [TEAR, {x: 778, y: 1229, z: 0.42}], [t.at('So they landed'), {x: 778, y: 1229, z: 0.43}], [t.at('a deal'), {...L, x: 760}], [t.end('sharecropping'), {...L, x: 880}],
    [t.at("Here's how") + 4, {...L, x: 900, z: 1.02}], [t.at('one family') - 2, {x: 1150, y: 2120, z: 0.9, tilt: 16, dof: 0, band: 120}], [S7, {x: 1170, y: 2130, z: 0.94, tilt: 16, dof: 0, band: 120}],
  ], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src={DEAL} size={DEAL_S} cam={cam} seed="deal" filter={HAND_F}>
        <Swipe lines={[HALF]} from={t.at('a deal')} to={t.end('deal') + 6} seed="hf" />
        <Spot size={DEAL_S} boxes={[HALF]} at={t.end('deal') + 8} out={t.at("Here's how") + 6} id="hfs" dark={0.5} />
        <Loop cx={1228} cy={2168} rx={260} ry={78} at={t.at('one family')} width={5} color={TEAL} seed={82} />
      </Sheet>
      <Slip text="Mississippi, 1867" x={1350} y={150} rot={2} at={TEAR + 10} />
      <Slip text="one half of the crop" x={1240} y={260} rot={-2} at={t.at('a deal') + 8} />
      <Slip text="Elias Daniel, freedman: his mark" x={1000} y={760} rot={-2} size={54} at={t.at('one family') + 4} />
      <Highlight text="SHARECROPPING" x={110} y={106} size={84} at={sc} seed={81} rot={-2} />
      <Definition term="sharecropping" def="farming someone else's land for a share of the crop" at={sc + 9} x={120} y={840} w={1640} />
      <Tag text={SRC.deal} />
    </AbsoluteFill>
  );
};

/** One family, step by step (sharecropping). */
const Share: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Farm c={CUES} from={S7} />
    <Slip text="20 or 30 acres" x={250} y={846} rot={-2} at={CUES.acres - 2} />
    <Tag text="Drawn: one family's farm under sharecropping" />
  </AbsoluteFill>
);

/** The step up: tenant farming, on the same farm. */
const Tenant: React.FC = () => {
  const tf = t.at('tenant farming');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Farm c={TENANT} from={S8} />
      <Highlight text="TENANT FARMING" x={110} y={112} size={80} at={tf} seed={82} rot={-2} />
      <Definition term="tenant farming" def="renting the land for cash or a fixed amount of crop, with your own tools" at={tf + 9} x={120} y={840} w={1640} />
      <Slip text="rent: cash, or a fixed amount of crop" x={1000} y={140} rot={2} size={54} at={t.at('paid in cash') - 2} out={t.at('More freedom') - 2} />
      <Slip text="more freedom" x={1080} y={126} rot={-2} at={t.at('More freedom') - 2} />
      <Slip text="more risk" x={1460} y={170} rot={2} coral at={t.at('More risk') - 2} />
      <Tag text="Drawn: the same farm under tenant farming" />
    </AbsoluteFill>
  );
};

/** "A crop that was partly theirs": the slip, and the loop round "partly" as the narration points at the word. */
const Partly: React.FC = () => (
  <PhotoShot src="img/ch08/cr_arkansas_1906.png" size={[900, 918]} a={S10} b={B} w={700} x={620} y={540} rot={-1.5} tag={SRC.ark}>
    <Slip text="a crop that was partly theirs" x={1030} y={470} rot={-2} size={62} at={t.at('growing a crop') - 2} dur={22} />
    <Loop cx={1486} cy={488} rx={92} ry={44} at={t.at('But that word')} dur={12} width={7} color="#FF6F61" seed={83} tilt={-2} />
    <Sfx at={t.at('But that word')} src="sfx/marker_tick.wav" volume={0.3} />
  </PhotoShot>
);

/** Music (MUSIC.md): m_lament under the whole chapter; it runs out at about 66 s, so a second pass picks up at
 *  "At first, sharecropping looked like progress". */
const Body: React.FC = () => {
  const scene = useScene([
    [0, <PhotoShot key="ac" src="img/wall/cr_acres.png" size={[900, 506]} a={0} b={S1} w={1180} x={960} y={520} rot={-1.5} tag={SRC.acres}>
      <Cross cx={960} cy={520} r={300} at={t.at('The land')} />
    </PhotoShot>],
    [S1, <Doc key="fz" src={TRIB} size={TRIB_S} a={S1} b={S1B} tag={SRC.trib}
      keys={[[S1, {x: 250, y: 432, z: 1.35, tilt: 30, dof: 2.6, band: 55}], [S1B, {x: 360, y: 440, z: 1.38, tilt: 30, dof: 2.6, band: 55}]]}
      over={<Slip text="Savannah, January 1865" x={1150} y={760} rot={-2} at={S1 + 6} />}>
      <Swipe lines={[FRAZIER]} from={t.at('Garrison Frazier')} to={t.end('Savannah')} seed="fz" />
    </Doc>],
    [S1B, <Doc key="q" src={TRIB} size={TRIB_S} a={S1B} b={S2} tag={SRC.trib}
      keys={[[S1B, {x: 330, y: 2556, z: 1.3, tilt: 32, dof: 2.6, band: 60}], [t.at('is to have'), {x: 300, y: 2582, z: 1.3, tilt: 32, dof: 2.6, band: 60, dofY: 2582}],
        [S2, {x: 380, y: 2582, z: 1.34, tilt: 32, dof: 2.6, band: 60, dofY: 2582}]]}>
      <Swipe lines={[Q1]} from={t.at('The way we')} to={t.end('ourselves')} seed="q1" />
      <Swipe lines={[Q2]} from={t.at('is to have')} to={t.end('have land')} seed="q2" />
    </Doc>],
    [S2, <Callbacks key="cb" />],
    [S3, <PhotoShot key="c96" src="img/ch08/cr_cotton_1896.png" size={[900, 918]} a={S3} b={S4} w={640} x={720} y={540} rot={1.5} tag={SRC.cotton96}>
      <Slip text="someone else's land" x={1120} y={640} rot={-2} at={t.at('owned by') - 2} />
    </PhotoShot>],
    [S4, <AbsoluteFill key="have">
      <DarkPaper />
      <Slip text="everybody had a problem" x={140} y={120} rot={-2} at={t.at('everybody') - 2} />
      <Have at={S4} heads={[t.at('Planters') - 1, t.at('Freedpeople had') - 1]}
        marks={[[0, 0, true, t.at('had land')], [0, 2, false, t.at('no money')], [0, 1, false, t.at('workers')],
          [1, 1, true, t.at('labor')], [1, 0, false, t.at('no land')], [1, 2, false, t.at('no money', 2)]]} />
      <Tag text="Drawn: who had what, 1865" />
    </AbsoluteFill>],
    [S5, <Tear key="tr" at={TEAR} top={<Bureau />} seed="t8"><Deal /></Tear>],
    [S7, <Share key="sh" />],
    [S8, <Tenant key="tn" />],
    [S9, <PhotoShot key="st" src="img/ch08/cr_stereo_cotton.png" size={[900, 894]} a={S9} b={S10} w={760} x={680} y={540} rot={-1} tag={SRC.stereo}>
      <Slip text="no overseer" x={1180} y={330} rot={-2} size={70} at={t.at('No overseer') - 2} />
      <Slip text="no whip" x={1260} y={480} rot={2} size={70} at={t.at('No whip') - 2} />
    </PhotoShot>],
    [S10, <Partly key="pt" />],
    [B, <SeriesBoard key="b" ch={8} from={B} at={t.at('where the trouble started')} />],
  ]);
  return <>{scene}<Sounds /></>;
};

const PROGRESS = t.at('At first');

export const Ch08: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch08_no_land.wav" lead={LEAD} extra={EXTRA}
    music={[{src: 'music/m_lament.mp3', volume: 0.13, to: PROGRESS + 6}, {src: 'music/m_lament.mp3', volume: 0.13, from: PROGRESS - 6}]}>
    <Body />
  </ChapterShell>
);
