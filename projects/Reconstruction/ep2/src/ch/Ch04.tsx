// Chapter 4 · One Vote Short. Johnson gets in the way, fires Stanton, is impeached, and survives the Senate by one vote;
// Stevens, who argued the case, dies that summer and his land plan dies with him.
// Built on Episode 1's Ch06/Ch08 model: cuts two frames before a phrase, pages read by the camera with the coral swipe,
// drawn diagrams for the two steps and the 35-19 tally, the series board at the end.
// Sources: McPherson, Political History of the United States during the Period of Reconstruction (1871), pp. 176, 267,
// 282; Harper's Weekly Mar. 14 and Aug. 29, 1868; Frank Leslie's June 6, 1868; Evening Star (Washington), May 16, 1868;
// T. R. Davis's House and Senate engravings (LOC); the Stanton carte de visite (LOC); Stevens's tomb (JamesPFisherIII,
// 2014, CC BY 4.0). Fact check: SCRIPT.md rows 10-13 (fired Feb 21, impeached Feb 24, 1868; vote 35-19 of 54, May 16).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch04_impeachment.words.json';
import {DarkPaper, Sfx} from '../kit/common';
import {Arrow, Highlight, JF, Loop, Tag, useGFrame} from '../kit/Kit';
import {SeriesBoard} from '../kit/ep2board';
import {type Box, CORAL, Counter, DocShot, PhotoShot, PRINT_F, Slip, Swipe, TEAL} from '../kit/rc';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, Photo, Quote, Stamp, useScene} from '../kit/shell';
import {MASKS} from '../masks';
import {FocusIn} from '../kit/vox';
import {PageWin, PrintShot, Stamps, Whooshes} from './ch04_kit';

const N = words as Narration;
const t = makeTimeline(N, 30);
export const CH04_FRAMES = chapterFrames(N, LEAD);

// ------------------------------------------------------------------------------------------------------ pictures
const I = 'img/ch04/';
const TOA = I + 'tenure_of_office_act_text_mcpherson_1871.jpg';
const AOI = I + 'articles_of_impeachment_art1_stanton_mcpherson_1871.jpg';
const STAR = I + 'evening_star_1868-05-16_acquittal_extra.jpg';
const COVER = I + 'stevens_bingham_before_senate_1868.jpg';
const JUDG = I + 'impeachment_judgment_35_19_mcpherson_1871_p282.jpg';
const MCP: [number, number] = [1825, 3000];
// line boxes (source px), each drawn on the page and checked
const TOA_TITLE: Box[] = [[97, 2512, 800, 42], [448, 2553, 110, 40]];           // "An Act regulating the tenure of certain civil / offices."
const TOA_SEC: Box[] = [[1178, 327, 572, 40], [950, 366, 325, 40]];             // "the Secretaries of State, of the / Treasury, of War,"
const TOA_REM: Box[] = [[1268, 557, 482, 40], [950, 595, 705, 40]];             // "subject to removal by and / with the advice and consent of the Senate."
const AOI_HEAD: Box[] = [[553, 98, 772, 40]];                                   // "THE ARTICLES OF IMPEACHMENT, ETC."
const AOI_DATE: Box[] = [[1483, 683, 252, 32]];                                 // "February 21, 1868."
const AOI_FIRED: Box[] = [[982, 713, 775, 30], [953, 742, 805, 30]];            // "Sir: The Hon. Edwin M. Stanton having been this day / removed from office as Secretary for the Department of War,"
const STAR_LINE: Box[] = [[985, 1942, 712, 36]];                                // "Mr. Stevens was carried out in his arm-chair,"
const COVER_NAME: Box[] = [[560, 2808, 240, 30]];                               // "THADDEUS STEVENS" in the caption
const JUDG_LINE: Box[] = [[980, 695, 760, 38]];                                 // "The vote was 35 "guilty," 19 "not guilty,""

const SRC = {
  johnson: 'Andrew Johnson · Library of Congress',
  toa: 'Tenure of Office Act, 1867, in McPherson, Political History (1871), p. 176 · Internet Archive',
  stanton: 'Secretary of War Edwin Stanton, carte de visite, 1860s · Library of Congress',
  aoi: 'Articles of Impeachment, 1868, in McPherson, Political History (1871), p. 267 · Internet Archive',
  davis: "T. R. Davis, the House and the Senate during the impeachment, Harper's Weekly, 1868 · Library of Congress",
  cover: "Thaddeus Stevens and John A. Bingham before the Senate, Harper's Weekly, Mar. 14, 1868 · Library of Congress",
  stevens: 'Thaddeus Stevens (Brady-Handy) · Library of Congress',
  star: 'Evening Star (Washington), May 16, 1868 · Library of Congress',
  ross: "Taking the vote on the impeachment, May 16, 1868, Frank Leslie's, June 6, 1868 · Internet Archive",
  judg: 'The Judgment of the Senate, in McPherson, Political History (1871), p. 282 · Internet Archive',
  court: 'T. R. Davis, The Senate as a Court of Impeachment, 1868 · Library of Congress',
  acquit: "President Johnson congratulated on his acquittal, Frank Leslie's, June 6, 1868 · Internet Archive",
  state: "The body of Thaddeus Stevens lying in state, Harper's Weekly, Aug. 29, 1868 · Internet Archive",
  grave: "Stevens's tomb, Lancaster, Pa. · photo by JamesPFisherIII, 2014, CC BY 4.0 · Wikimedia Commons",
};

// ------------------------------------------------------------------------------------------------------ the cuts
const S_TOA = t.at('And Congress saw') - 2;
const S_STANTON = t.at('The official they') - 2;
const S_FIRED = t.at('In February') - 2;
const S_STEPS = t.at('The House accuses') - 2;
const S_COVER = t.at('One of the men') - 2;
const S_STEVENS = t.at('Remember him') - 2;
const S_STAR = t.at('He was so sick') - 2;
const S_VOTE = t.at('In May') - 2;
const S_TALLY = t.at('35') - 2;
const S_WHY = t.at('Why') - 2;
const S_ACQUIT = t.at('Either way') - 2;
const S_STATE = t.at('Stevens died') - 2;
const S_GRAVE = t.at('that accepted') - 2;
const S_EPITAPH = t.at('His gravestone') - 2;
const S_BOARD = t.at('His plan to give') - 2;

// ------------------------------------------------------------------------------------------------------ shots
/** He got in its way: Johnson, the same print as Episode 1. */
const Johnson: React.FC = () => (
  <PhotoShot src="img/wall/cr_johnson.png" size={[900, 1101]} a={0} b={S_TOA} w={540} x={600} rot={-1.5} tag={SRC.johnson}>
    <Slip text="the Reconstruction Act, 1867" x={1010} y={250} rot={-2} size={52} at={t.at('Reconstruction Act')} />
    <Slip text="so: he gets in its way" x={1060} y={410} rot={2} at={t.at('got in its way')} coral />
    <Slip text="removes generals who enforce it" x={1000} y={590} rot={-2} size={52} at={t.at('removed army')} />
  </PhotoShot>
);

/** The Act: the camera finds its title, then reads the clause that protects the Secretary of War. */
const Tenure: React.FC = () => (
  <>
    <DocShot src={TOA} size={MCP} tag={SRC.toa} focusAt={S_TOA}
      keys={[
        [S_TOA, {x: 912, y: 1500, z: 0.36}],
        [t.at('Tenure') - 6, {x: 520, y: 2545, z: 0.95}],
        [t.end('Tenure of Office Act') + 4, {x: 540, y: 2545, z: 0.98}],
        [t.at('fire') - 2, {x: 1350, y: 470, z: 1.0}],
        [S_STANTON, {x: 1330, y: 520, z: 1.06}],
      ]}
      over={<>
        <Highlight text="TENURE OF OFFICE ACT" x={110} y={106} size={76} at={t.at('Tenure')} seed={41} rot={-2} />
        <Definition term="Tenure of Office Act" def="a law (1867): the President couldn't fire certain top officials without the Senate's permission" at={t.at('Tenure') + 9} x={120} y={850} w={1340} />
      </>}>
      <Swipe lines={TOA_TITLE} from={t.at('Tenure')} to={t.end('Tenure of Office Act')} seed="t1" />
      <Swipe lines={TOA_SEC} from={t.at('fire')} to={t.end('top officials')} seed="t2" />
      <Swipe lines={TOA_REM} from={t.at('without the')} to={t.end('permission')} seed="t3" />
    </DocShot>
    <Sfx at={t.at('fire')} src="sfx/marker_tick.wav" volume={0.22} />
  </>
);

const STANTON_MASK = {alpha: I + 'cr_stanton_cdv_mask.png', paths: MASKS.stanton_cdv.data.shapes.subject, crop: [250, 500, 1550, 2050] as [number, number, number, number]};
/** Edwin Stanton: the man the law protected. */
const Stanton: React.FC = () => (
  <PrintShot src={I + 'cr_stanton_cdv.png'} size={[900, 1073]} a={S_STANTON} b={S_FIRED} w={600} x={600} rot={1.5} tag={SRC.stanton} mask={STANTON_MASK} tintAt={t.at('Edwin Stanton')}>
    <Slip text="Edwin Stanton" x={1030} y={230} rot={-3} at={t.at('Edwin Stanton')} />
    <Slip text="Secretary of War: ran the army" x={1000} y={400} rot={2} size={54} at={t.at('He ran the army')} />
    <Slip text="the last Radical in the cabinet" x={980} y={580} rot={-2} size={54} at={t.at('last Radical')} coral />
  </PrintShot>
);

/** Johnson's own letter removing Stanton, quoted in the Articles; then up to the page's running head: impeachment. */
const Fired: React.FC = () => {
  const g = useGFrame();
  const L = {tilt: 28, dof: 2.4, band: 60};
  const d = t.at('Three days');
  return (
    <>
      <DocShot src={AOI} size={MCP} tag={SRC.aoi} focusAt={S_FIRED}
        keys={[
          [S_FIRED, {x: 1380, y: 690, z: 1.04, ...L}],
          [t.at('Johnson fired'), {x: 1320, y: 735, z: 1.12, ...L}],
          [d - 2, {x: 1300, y: 745, z: 1.14, ...L}],
          [d + 16, {x: 940, y: 150, z: 0.98, tilt: 0, dof: 0, band: 120}],
          [S_STEPS, {x: 940, y: 160, z: 1.02}],
        ]}
        over={<>
          <Slip text="Johnson's order, Feb. 21, 1868" x={130} y={130} rot={-2} size={54} at={t.at('February') + 2} out={d} />
          {g >= t.at('fired') && g < d && <Stamp text="FIRED" x={620} y={700} size={170} color={CORAL} rot={-8} at={t.at('fired')} />}
          <Slip text="3 days later: Feb. 24" x={1260} y={150} rot={2} size={54} at={d + 4} />
          <Highlight text="IMPEACH" x={110} y={106} size={92} at={t.at('impeach')} seed={43} rot={-2} />
          <Definition term="impeach" def="to formally charge an official with wrongdoing: like filing charges" at={t.at('impeach') + 9} x={120} y={850} w={1300} />
        </>}>
        <Swipe lines={AOI_DATE} from={t.at('February')} to={t.end('February 1868')} seed="a1" />
        <Swipe lines={AOI_FIRED} from={t.at('Johnson fired')} to={t.end('anyway')} seed="a2" />
        <Swipe lines={AOI_HEAD} from={t.at('impeach')} to={t.end('impeach him')} seed="a3" />
      </DocShot>
      <Stamps at={[t.at('fired'), t.at('impeach')]} />
    </>
  );
};

/** The two steps, drawn: the House accuses, the Senate holds the trial, and removal takes two-thirds. */
const StepCard: React.FC<{n: number; title: string; x: number; at: number; win: React.ReactNode}> = ({n, title, x, at, win}) => {
  const g = useGFrame();
  if (g < at) return null;
  return (
    <FocusIn at={at}>
      <div style={{position: 'absolute', left: x, top: 200, width: 660, height: 500, border: `3px solid ${TEAL}`, borderRadius: 6, background: 'rgba(10,10,9,0.55)', boxShadow: '0 16px 30px rgba(0,0,0,0.6)'}}>
        <div style={{position: 'absolute', left: 30, top: 24, width: 60, height: 60, borderRadius: 30, border: `3px solid ${TEAL}`, color: TEAL, fontFamily: JF.display, fontSize: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{n}</div>
        <div style={{position: 'absolute', left: 112, top: 32, fontFamily: JF.mono, fontSize: 42, letterSpacing: 4, color: '#f4efe6'}}>{title}</div>
        {win}
      </div>
    </FocusIn>
  );
};
const Steps: React.FC = () => {
  const s2 = t.at('then the Senate') - 1;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <StepCard n={1} title="THE HOUSE" x={170} at={S_STEPS + 1}
        win={<PageWin src={I + 'stevens_closing_debate_harpers_1868.jpg'} cx={1450} cy={1150} s={0.26} w={600} h={360} x={28} y={112} filter={PRINT_F} />} />
      <StepCard n={2} title="THE SENATE" x={1090} at={s2}
        win={<PageWin src={I + 'senate_court_of_impeachment_1868_alt.jpg'} cx={768} cy={560} s={0.46} w={600} h={360} x={28} y={112} filter={PRINT_F} />} />
      <Arrow x1={850} y1={450} x2={1075} y2={450} bow={-30} color={TEAL} width={6} at={s2 - 2} />
      <Slip text="accuses" x={360} y={660} rot={-3} size={66} at={t.at('accuses')} />
      <Slip text="holds a trial" x={1240} y={660} rot={2} size={66} at={t.at('holds a trial')} />
      <Slip text="to remove: ⅔ of the Senate" x={1090} y={820} rot={-2} size={58} at={t.at('two-thirds')} coral />
      <Counter n={1} of={2} at={S_STEPS} out={s2} />
      <Counter n={2} of={2} at={s2} />
      <Sfx at={S_STEPS + 1} src="sfx/tick.wav" volume={0.4} />
      <Sfx at={s2} src="sfx/tick.wav" volume={0.4} />
      <Tag text={SRC.davis} />
    </AbsoluteFill>
  );
};

/** Stevens and Bingham before the Senate: the camera comes down to the caption and finds his name. */
const Cover: React.FC = () => (
  <DocShot src={COVER} size={[2400, 3000]} tag={SRC.cover} filter={PRINT_F} focusAt={S_COVER}
    keys={[[S_COVER, {x: 1120, y: 1700, z: 0.5}], [t.at('Thaddeus') - 4, {x: 1080, y: 2180, z: 0.7}], [S_STEVENS, {x: 1080, y: 2190, z: 0.73}]]}
    over={<Slip text="one of the House's prosecutors" x={1170} y={140} rot={2} size={54} at={t.at('argued')} />}>
    <Swipe lines={COVER_NAME} from={t.at('Thaddeus')} to={t.end('Thaddeus Stevens')} seed="cv" />
  </DocShot>
);

/** Remember him? Episode 1's print. */
const Stevens: React.FC = () => (
  <PhotoShot src="img/wall/cr_stevens.png" size={[900, 1134]} a={S_STEVENS} b={S_STAR} w={500} x={600} rot={-1.5} tag={SRC.stevens}>
    <Slip text="Thaddeus Stevens" x={1000} y={300} rot={-3} at={S_STEVENS + 4} />
    <Slip text="the Radical with the land plan" x={960} y={470} rot={2} size={58} at={t.at('The Radical with')} coral />
  </PhotoShot>
);

/** The Evening Star the day of the vote: "Mr. Stevens was carried out in his arm-chair". */
const Star: React.FC = () => {
  const L = {tilt: 30, dof: 2.4, band: 50, y: 1960};
  return (
    <DocShot src={STAR} size={[2139, 3000]} tag={SRC.star}
      keys={[[S_STAR, {...L, x: 1220, z: 1.08}], [t.end('carried in'), {...L, x: 1420, z: 1.16}], [S_VOTE, {...L, x: 1440, z: 1.18}]]}
      over={<Slip text="too sick to walk" x={1180} y={800} rot={-2} at={t.at('carried in')} coral />}>
      <Swipe lines={STAR_LINE} from={t.at('so sick')} to={t.end('carried in')} seed="st" />
    </DocShot>
  );
};

/** In May, the Senate voted. */
const Vote: React.FC = () => (
  <DocShot src={I + 'impeachment_vote_may16_ross_not_guilty_leslies_1868.jpg'} size={[3000, 2335]} tag={SRC.ross} filter={PRINT_F} focusAt={S_VOTE}
    keys={[[S_VOTE, {x: 1500, y: 1120, z: 0.64}], [S_TALLY, {x: 1450, y: 1080, z: 0.7}]]}
    over={<Slip text="May 16, 1868" x={130} y={130} rot={-2} at={t.at('In May') + 2} />} />
);

/** The tally: 54 senators, 35 to remove, 19 to keep him, the two-thirds line at 36. One short. */
const Tally: React.FC = () => {
  const g = useGFrame();
  const X = 150, CW = 30, Y = 450, H = 160;
  const a35 = t.at('35'), a19 = t.at('19'), short = t.at('One vote short');
  const fill = (i: number) => (i < 35 ? a35 + Math.floor(i * 0.6) : a19 + Math.floor((53 - i) * 0.6));
  const lineAt = S_TALLY + 6;
  const lineX = X + 36 * CW - 1;
  const lp = interpolate(g, [lineAt, lineAt + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={S_TALLY + 1}>
        <PageWin src={JUDG} cx={1360} cy={712} s={1.0} w={900} h={130} x={510} y={150} r={-1}>
          <Swipe lines={JUDG_LINE} from={a35} to={t.end('keep him')} seed="jd" />
        </PageWin>
      </FocusIn>
      {Array.from({length: 54}, (_, i) => {
        const on = g >= fill(i);
        const guilty = i < 35;
        return <div key={i} style={{position: 'absolute', left: X + i * CW + 2, top: Y, width: CW - 4, height: H, borderRadius: 3,
          background: on ? (guilty ? CORAL : 'rgba(237,231,220,0.55)') : 'rgba(237,231,220,0.08)', border: '2px solid rgba(237,231,220,0.25)', boxSizing: 'border-box'}} />;
      })}
      {/* the two-thirds line */}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={lineX} y1={Y - 40} x2={lineX} y2={Y - 40 + (H + 80) * lp} stroke={TEAL} strokeWidth={6} strokeDasharray="14 10" />
      </svg>
      {g >= lineAt + 4 && <div style={{position: 'absolute', left: lineX - 150, top: Y + H + 52, width: 300, textAlign: 'center', fontFamily: JF.mono, fontSize: 30, letterSpacing: 2, color: TEAL}}>⅔ = 36 VOTES</div>}
      {g >= a35 && <div style={{position: 'absolute', left: X, top: Y - 70, fontFamily: JF.mono, fontSize: 40, letterSpacing: 2, color: CORAL}}>35 · REMOVE</div>}
      {g >= a19 && <div style={{position: 'absolute', left: X + 54 * CW - 400, top: Y - 70, width: 400, textAlign: 'right', fontFamily: JF.mono, fontSize: 40, letterSpacing: 2, color: '#ede7dc'}}>19 · KEEP HIM</div>}
      <Loop cx={X + 35 * CW + CW / 2} cy={Y + H / 2} rx={34} ry={H / 2 + 26} at={short} color={CORAL} width={6} seed={4} />
      <Highlight text="ONE VOTE SHORT" x={560} y={790} size={96} at={short} seed={47} rot={-2} />
      <Stamps at={[short]} />
      <Sfx at={a35} src="sfx/tick.wav" volume={0.4} />
      <Sfx at={a19} src="sfx/tick.wav" volume={0.4} />
      <Tag text={SRC.judg} />
    </AbsoluteFill>
  );
};

/** Why? Two reasons, over the Senate sitting as a court. */
const Why: React.FC = () => (
  <DocShot src={I + 'senate_court_of_impeachment_1868_alt.jpg'} size={[1536, 979]} tag={SRC.court} filter={PRINT_F} focusAt={S_WHY}
    keys={[[S_WHY, {x: 768, y: 490, z: 1.12}], [S_ACQUIT, {x: 760, y: 520, z: 1.22}]]}
    over={<>
      <Slip text="why?" x={150} y={120} rot={-4} size={84} at={t.at('Why')} coral />
      <Slip text="firing a cabinet member: a crime?" x={210} y={300} rot={-2} size={56} at={t.at('Some Republicans')} />
      <Slip text="nervous about who'd replace him" x={760} y={740} rot={2} size={56} at={t.at('Others were')} />
      <Slip text="next in line: Sen. Ben Wade, a Radical" x={800} y={870} rot={-1} size={44} at={t.at('replace him') + 4} />
    </>} />
);

/** Johnson stays: his friends congratulate him at the White House. */
const Acquit: React.FC = () => {
  const f = useCurrentFrame();
  const z = interpolate(f, [S_ACQUIT, S_STATE], [0.66, 0.8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <DocShot src={I + 'johnson_congratulated_on_acquittal_leslies_1868.jpg'} size={[3000, 2582]} tag={SRC.acquit} filter={PRINT_F} focusAt={S_ACQUIT}
      keys={[[S_ACQUIT, {x: 1500, y: 1150, z: 0.66}], [S_STATE, {x: 1200, y: 1060, z: 0.8}]]}
      over={<>
        <Slip text="acquitted: he stays" x={130} y={130} rot={-2} at={t.at('Johnson stayed')} />
        <Slip text="almost no power left" x={1180} y={820} rot={2} at={t.at('almost no power')} coral />
      </>}>
      <Loop cx={1085} cy={930} rx={190} ry={260} at={t.at('Johnson stayed')} color={TEAL} width={6 / z} seed={7} />
    </DocShot>
  );
};

/** Stevens lying in state, guarded by Black soldiers. */
const State: React.FC = () => (
  <DocShot src={I + 'stevens_lying_in_state_harpers_1868-08-29_cover.jpg'} size={[2113, 3000]} tag={SRC.state} filter={PRINT_F} focusAt={S_STATE}
    keys={[[S_STATE, {x: 1080, y: 1880, z: 1.0}], [S_GRAVE, {x: 1060, y: 1920, z: 1.08}]]}
    over={<>
      <Slip text="Aug. 1868" x={130} y={130} rot={-2} at={t.at('summer')} />
      <Slip text="lying in state at the Capitol" x={1210} y={300} rot={2} size={50} at={t.at('He asked')} />
      <Slip text="guarded by Black soldiers" x={1230} y={430} rot={-2} size={50} at={t.at('cemeteries')} />
    </>} />
);

/** His grave: the cemetery that took Black and white alike. (A modern photograph, credited.) */
const Grave: React.FC = () => (
  <AbsoluteFill>
    <Photo src={I + 'stevens_grave_shreiner_concord_2014_ccby.jpg'} size={[1280, 1024]} fx={560} fy={420} z0={1.0} z1={1.06} a={S_GRAVE} b={S_EPITAPH} />
    <Slip text="Lancaster, Pa." x={130} y={130} rot={-2} at={S_GRAVE + 3} />
    <Slip text="Black and white alike" x={1180} y={780} rot={2} at={t.at('Black and white')} coral />
    <Tag text={SRC.grave} />
  </AbsoluteFill>
);

/** The epitaph, set over the stone. */
const Epitaph: React.FC = () => (
  <AbsoluteFill>
    <Photo src={I + 'stevens_grave_shreiner_concord_2014_ccby.jpg'} size={[1280, 1024]} fx={470} fy={330} z0={1.25} z1={1.32} a={S_EPITAPH} b={S_BOARD}
      bw="grayscale(1) contrast(1.1) brightness(0.4)" vignette={0.8} />
    <Slip text="on his gravestone:" x={170} y={250} rot={-3} size={56} at={S_EPITAPH + 4} />
    <Quote text="Equality of man before his Creator." at={t.at('equality')} x={170} y={400} w={1580} size={88} who="Thaddeus Stevens's epitaph, 1868" />
    <Tag text={SRC.grave} />
  </AbsoluteFill>
);

/** Music (MUSIC.md): j_intrigue under the whole chapter; it lifts after the last word. */
const Body: React.FC = () => {
  const scene = useScene([
    [0, <Johnson key="j" />],
    [S_TOA, <Tenure key="toa" />],
    [S_STANTON, <Stanton key="st" />],
    [S_FIRED, <Fired key="fi" />],
    [S_STEPS, <Steps key="steps" />],
    [S_COVER, <Cover key="cov" />],
    [S_STEVENS, <Stevens key="stv" />],
    [S_STAR, <Star key="star" />],
    [S_VOTE, <Vote key="vote" />],
    [S_TALLY, <Tally key="tally" />],
    [S_WHY, <Why key="why" />],
    [S_ACQUIT, <Acquit key="acq" />],
    [S_STATE, <State key="state" />],
    [S_GRAVE, <Grave key="grave" />],
    [S_EPITAPH, <Epitaph key="ep" />],
    [S_BOARD, <SeriesBoard key="b" ch={4} from={S_BOARD} at={t.at('died with him')} />],
  ]);
  return (
    <>
      {scene}
      <Whooshes at={[S_TOA, S_STANTON, S_FIRED, S_STEPS, S_COVER, S_STEVENS, S_STAR, S_VOTE, S_TALLY, S_WHY, S_ACQUIT, S_STATE, S_GRAVE, S_EPITAPH]} />
      <Stamps at={[t.at('Tenure')]} />
    </>
  );
};

export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch04_impeachment.wav" lead={LEAD} music={[{src: 'music/j_intrigue.mp3', volume: 0.15}]}>
    <Body />
  </ChapterShell>
);
