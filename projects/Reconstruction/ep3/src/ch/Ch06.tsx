// Chapter 6 · The Bank. The Freedman's Savings Bank (its Washington building, photographed in the 1880s after it failed);
// an 1866 newspaper ad ("one among the best institutions in the United States", "the attention of soldiers"); a branch
// at Beaufort and who saved there, with a quick callback to Field Order 15; risky loans; Douglass as president in 1874,
// his signature on the bank's letterhead; what was owed, counted plainly; a commissioners' dividend check for sixteen
// cents and a half-filled bar; the board.
// Sources: Smithsonian Institution Archives and NMAAHC (CC0); the Colored Tennessean, Mar. 24, 1866 (LOC); LOC prints and
// photographs (Beaufort stereograph, Douglass by Brady, the 1878 check).
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import words from '../../public/audio/ch06_the_bank.words.json';
import {DarkPaper, Sfx} from '../kit/common';
import {SeriesBoard} from '../kit/ep3board';
import {Highlight, Tag, useGFrame} from '../kit/Kit';
import {type Box, cut, DocShot, PhotoShot, PRINT_F, type SheetCam, Slip, Swipe, TEAL} from '../kit/rc';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';
import {MASKS} from '../masks';
import {Count, Label, PageWin, Stamps, Whooshes} from './ch04_kit';

const N = words as Narration;
const t = makeTimeline(N, 30);
const c = (p: string, n = 1) => cut(t, p, n);
export const CH06_FRAMES = chapterFrames(N, LEAD);

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ------------------------------------------------------------------------------------------------------ pictures
const I = 'img/ch06/';
const BLDG = I + 'freedmans_savings_bank_exterior_1880s_sia.jpg';
const BLDG_S: [number, number] = [2404, 3000];
const AD = I + 'colored_tennessean_1866-03-24_freedmans_saving_bank_ad.jpg';
const AD_S: [number, number] = [1060, 930];
const BEAU = I + 'freedmans_bank_beaufort_sc_1863.jpg';
const BEAU_S: [number, number] = [3000, 1540];
const LETTER = I + 'douglass_letter_freedmans_savings_bank_letterhead_3jul1874_nmaahc.jpg';
const CHECK = I + 'freedmans_bank_commissioners_dividend_check_1878.jpg';
const CHECK_S: [number, number] = [2442, 1098];
const NEWS_F = 'grayscale(1) sepia(0.12) contrast(1.3) brightness(1.05)';
const HAND_F = 'grayscale(1) sepia(0.15) contrast(1.35) brightness(1.04)';
// line boxes (source px), measured on each image and drawn on it
const BEST: Box[] = [[745, 152, 228, 44], [136, 198, 836, 44], [50, 244, 142, 44]];   // ad: "one among / the best institutions in the United / States,"
const SOLDIERS: Box[] = [[172, 343, 680, 44]];                                        // ad: "THE ATTENTION OF SOLDIERS"
const SIGN: Box[] = [[1560, 2545, 610, 100], [1740, 2665, 290, 85]];                  // letter: "Fredk. Douglass / Prest."
const DATE: Box[] = [[1500, 570, 680, 120]];                                          // letter: "July 3d 1874"
const SIXTEEN: Box[] = [[525, 615, 710, 80]];                                         // check: "Sixteen Cents"

const SRC = {
  bldg: "Freedman's Savings Bank, Washington, D.C., photographed in the 1880s, after it failed · Smithsonian Institution Archives",
  ad: 'The Colored Tennessean (Nashville), Mar. 24, 1866 · Library of Congress',
  beau: "Freedman's Bank, Beaufort, S.C., stereograph, c.1865–74 · Library of Congress",
  beauAd: "Freedman's Bank, Beaufort, S.C., c.1865–74 · ad: Colored Tennessean, 1866 · Library of Congress",
  acres: 'Special Field Order No. 15, Jan. 1865: up to 40 acres a family (drawn map, from Episode 1)',
  douglass: 'Frederick Douglass, Brady studio, c.1877 · Library of Congress',
  letter: "Douglass to J. A. J. Creswell on the bank's letterhead, July 3, 1874 · Smithsonian NMAAHC",
  check: "Dividend check, Commissioners of the Freedman's Savings and Trust Co., Mar. 20, 1878 · Library of Congress",
};

/** A picture on the desk, `h` px tall, centred on screen (sx, sy); a slow push from a to b. */
const placed = (size: [number, number], h: number, sx: number, a: number, b: number, push = 0.05, sy = 540): [number, SheetCam][] => {
  const z = h / size[1];
  const cam = (k: number): SheetCam => ({x: size[0] / 2 - (sx - 960) / (z * k), y: size[1] / 2 - (sy - 540) / (z * k), z: z * k});
  return [[a, cam(1)], [b, cam(1 + push)]];
};

// ------------------------------------------------------------------------------------------------------ the cuts
const S_AD = c('Many depositors'), S_BEAU = c('Tens of thousands'), S_ACRES = c('Forty acres'), S_LOANS = c('But the men'), S_DOUG = c('its trustees');
/** The pieces land on "gone at once". The check sits between the sharecropping papers and Colfax, so the only end shot
 *  that slices nothing is this close one (boardfit: view x 1387..2323). */
const GONE = t.at('gone at once');
const S_LATE = c('It was too late'), S_NUM = c('More than'), S_CHECK = c('The government', 2), B = c('For a lot');

// ------------------------------------------------------------------------------------------------------ shots
const Building: React.FC = () => {
  const b = t.at("Freedman's Savings Bank");
  return (
    <DocShot src={BLDG} size={BLDG_S} tag={SRC.bldg} filter={PRINT_F} keys={placed(BLDG_S, 940, 1320, 0, S_AD)}
      over={<>
        <Highlight text="FREEDMAN'S SAVINGS BANK" x={110} y={108} size={70} at={b} seed={61} rot={-2} />
        <Definition term="Freedman's Savings Bank" def="a bank for freedpeople, chartered by Congress in 1865" at={b + 9} x={120} y={250} w={620} />
        <Slip text="Congress, 1865" x={150} y={560} rot={-2} at={t.at('Congress')} />
        <Stamps at={[b]} />
      </>} />
  );
};

/** The 1866 ad: "one among the best institutions in the United States". */
const Ad: React.FC = () => (
  <DocShot src={AD} size={AD_S} tag={SRC.ad} filter={NEWS_F} focusAt={S_AD}
    keys={[[S_AD, {x: 530, y: 330, z: 1.1}], [t.at('stood behind'), {x: 540, y: 300, z: 1.18}], [S_BEAU, {x: 545, y: 300, z: 1.2}]]}
    over={<Slip text="It didn't." x={1180} y={820} rot={-3} size={84} at={t.at("It didn't")} coral />}>
    <Swipe lines={BEST} from={t.at('believed')} to={t.end('stood behind it')} seed="best" />
  </DocShot>
);

/** A branch at Beaufort, S.C., and who saved there. */
const Beaufort: React.FC = () => {
  const s = t.at('Soldiers');
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DocShot src={BEAU} size={BEAU_S} tag={g >= s ? SRC.beauAd : SRC.beau} filter={PRINT_F} focusAt={S_BEAU} keys={placed(BEAU_S, 600, 760, S_BEAU, S_ACRES, 0.04, 400)} />
      <PageWin src={AD} cx={512} cy={365} s={0.62} w={450} h={64} x={1360} y={150} r={2} at={s - 2} filter={NEWS_F}>
        <Swipe lines={SOLDIERS} from={s + 4} to={t.end('their pay')} seed="sol" />
      </PageWin>
      <Slip text="soldiers' pay" x={1400} y={240} rot={-2} size={54} at={t.at('saved their pay')} />
      <Slip text="churches" x={1420} y={360} rot={2} size={60} at={t.at('Churches')} />
      <Slip text="families" x={1440} y={480} rot={-1.5} size={60} at={t.at('Families')} />
      <Slip text="tens of thousands of accounts" x={150} y={760} rot={-1.5} size={58} at={t.at('Tens of thousands')} />
      <Slip text="a few dollars at a time" x={200} y={880} rot={1} size={56} at={t.at('a few dollars')} />
      <Slip text="hoping to buy a farm" x={1000} y={860} rot={-2} size={58} at={t.at('hoping')} />
      <Sfx at={s - 2} src="sfx/tick.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

/** Risky loans, near collapse: the building again, closer. */
const Loans: React.FC = () => (
  <DocShot src={BLDG} size={BLDG_S} tag={SRC.bldg} filter={PRINT_F} focusAt={S_LOANS}
    keys={[[S_LOANS, {x: 1270, y: 1300, z: 0.78}], [S_DOUG, {x: 1290, y: 1380, z: 0.86}]]}
    over={<>
      <Slip text="risky loans" x={1240} y={150} rot={2} size={66} at={t.at('risky')} />
      <Slip text="some to their friends" x={1180} y={280} rot={-1.5} size={58} at={t.at('some of them')} />
      <Slip text="1874: near collapse" x={150} y={860} rot={-2} size={62} at={t.at('near collapse')} coral />
    </>} />
);

const Douglass: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <CropCard src={I + 'douglass_brady_1877.jpg'} size={[1420, 2280]} x={1040} y={100} w={740} h={880} fx={680} fy={1420} scale={0.6} rot={1.5} at={S_DOUG}
      mask={MASKS.douglass} tintStrength={0.6} traceAt={t.at('Frederick')} />
    <Slip text="the most famous Black man in America" x={140} y={200} rot={-2} size={50} at={t.at('most famous')} />
    <Slip text="Frederick Douglass" x={160} y={340} rot={1.5} size={68} at={t.at('Frederick')} coral />
    <Slip text="president, 1874" x={170} y={490} rot={-2} size={60} at={t.at('president')} />
    <Slip text="$10,000 of his own" x={160} y={630} rot={1.5} size={62} at={t.at('10,000')} />
    <Sfx at={S_DOUG} src="sfx/tick.wav" volume={0.35} />
    <Tag text={SRC.douglass} />
  </AbsoluteFill>
);

/** Too late: his signature as president, then up to the letterhead and the date. */
const Letter: React.FC = () => {
  const w = t.at('Within');
  return (
    <DocShot src={LETTER} size={[2397, 3000]} tag={SRC.letter} filter={HAND_F} focusAt={S_LATE}
      keys={[[S_LATE, {x: 1850, y: 2610, z: 0.88}], [w - 2, {x: 1830, y: 2600, z: 0.9}], [w + 16, {x: 1250, y: 470, z: 0.6}], [S_NUM, {x: 1250, y: 460, z: 0.62}]]}
      over={<>
        <Slip text="Douglass, president" x={150} y={170} rot={-2} size={56} at={S_LATE + 6} out={w + 4} />
        <Slip text="closed: summer 1874" x={150} y={860} rot={-1.5} size={62} at={t.at('the bank closed')} />
      </>}>
      <Swipe lines={SIGN} from={S_LATE + 8} to={w - 4} seed="sig" />
      <Swipe lines={DATE} from={t.at('the bank closed')} to={t.end('closed')} seed="dt" />
    </DocShot>
  );
};

/** What was owed, counted plainly. */
const Owed: React.FC = () => {
  const d = t.at('60,000'), m = t.at('almost');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Label text="MORE THAN" x={300} y={170} at={d - 4} />
      <Count value={60000} from={d} to={d + 26} x={300} y={215} size={190} />
      <Label text="DEPOSITORS" x={1060} y={350} at={t.at('depositors', 2)} />
      <Label text="OWED ALMOST" x={300} y={580} at={m - 2} />
      <Count value={3000000} from={m + 4} to={t.end('dollars', 3)} x={300} y={625} size={190} fmt={(n) => '$' + (Math.round(n / 1000) * 1000).toLocaleString('en-US')} />
      <Sfx at={d} src="sfx/tick.wav" volume={0.35} />
      <Sfx at={m + 4} src="sfx/tick.wav" volume={0.35} />
      <Tag text="When the bank closed, 1874: about 61,000 depositors, about $3 million owed" />
    </AbsoluteFill>
  );
};

/** About half ever paid back: a commissioners' dividend check for sixteen cents, and a half-filled bar. */
const BX = 300, BW = 900, BY = 800;
const Check: React.FC = () => {
  const g = useGFrame();
  const h = t.at('about half');
  const fill = interpolate(g, [h, h + 12], [0, 0.5], clamp);
  const box = interpolate(g, [h - 6, h], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DocShot src={CHECK} size={CHECK_S} tag={SRC.check} filter="grayscale(1) contrast(1.2) brightness(1.05)" focusAt={S_CHECK} keys={placed(CHECK_S, 600, 960, S_CHECK, B, 0.04, 455)}
        over={<Slip text="a dividend check, 1878: sixteen cents" x={150} y={108} rot={-1} size={48} at={t.at('Over the years')} />}>
        <Swipe lines={SIXTEEN} from={t.at('Over the years')} to={t.end('years')} seed="sx" />
      </DocShot>
      {box > 0 && (
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <rect x={BX} y={BY} width={BW * fill} height={52} fill="#ece6d8" />
          <rect x={BX} y={BY} width={BW} height={52} fill="none" stroke={TEAL} strokeWidth={5} opacity={box} />
        </svg>
      )}
      <Slip text="about half, over years" x={1240} y={784} rot={-2} size={48} at={h + 4} />
      <Slip text="many never saw a cent" x={300} y={900} rot={1} size={58} at={t.at('never saw')} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const scene = useScene([
    [0, <Building key="bl" />],
    [S_AD, <Ad key="ad" />],
    [S_BEAU, <Beaufort key="be" />],
    [S_ACRES, <PhotoShot key="ac" src="img/wall/cr_acres.png" size={[900, 506]} a={S_ACRES} b={S_LOANS} w={1040} x={960} y={460} rot={-1} tag={SRC.acres}>
      <Slip text="forty acres, maybe" x={680} y={860} rot={-2} size={66} at={t.at('Forty acres')} />
    </PhotoShot>],
    [S_LOANS, <Loans key="ln" />],
    [S_DOUG, <Douglass key="dg" />],
    [S_LATE, <Letter key="lt" />],
    [S_NUM, <Owed key="ow" />],
    [S_CHECK, <Check key="ck" />],
    [B, <SeriesBoard key="b" ch={6} from={B} at={GONE} cam={[[B, 2125, 1440, 1.6], [GONE + 50, 1855, 1400, 2.05], [GONE + 300, 1855, 1400, 2.05]]} />],
  ]);
  return <>{scene}<Whooshes at={[S_AD, S_BEAU, S_ACRES, S_LOANS, S_DOUG, S_LATE, S_NUM, S_CHECK]} /></>;
};

/** Music (MUSIC.md): rc_parlor again, later in the cue (it sours as it goes); it runs out on its own around "only about
 *  half … paid back", so the last lines and the board sit in near silence. */
export const Ch06: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch06_the_bank.wav" lead={LEAD} music={[{src: 'music/rc_parlor.mp3', volume: 0.2, startFrom: 150}]}>
    <Body />
  </ChapterShell>
);
