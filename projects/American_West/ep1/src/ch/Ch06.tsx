// Chapter 6 · Let Us Have Peace. Grant's 1868 slogan (Brady portrait, Nast's "Matched"), his road from St. Louis firewood and
// the Galena store, what supporters point to (the 15th Amendment lithograph, the Klan and the federal response), the Peace
// Policy (→ Episode 4), the two cartoons (a swappable slot: CARTOON_A admiring, CARTOON_B critical) and the two-views card
// (supporters filled here; critics' side starts here and fills in ch07).
import React from 'react';
import {bed} from '../kit/levels';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch06_let_us_have_peace.words.json';
import {clamp} from '../lib/anim';
import {JF, Loop, Note, useGFrame, useHand, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration} from '../kit/shell';
import {MapCard} from '../samples/kit';
import {IMG, SZ} from '../samples/masks';
import {Lift, ScrimTag, shake, Shots, SlapTitle} from '../previews/fx';
import {DeskCam, Label, Line, Lines, Pic, Print, Sounds, type SfxRow} from '../kit/ch04_extra';
import {M6} from '../masks_ch06';

const N = words as Narration;
export const CH06_FRAMES = chapterFrames(N, LEAD);
const T = makeTimeline(N, 30);
const at = T.at;
const END = Math.ceil(N.duration * 30) + 60;

/**
 * THE CARTOON SLOT (the user's pick, 2026-10-25: keep Nast 1872 + Morgan 1872 here; their test cartoon, Currier & Ives's
 * A Nice Family Party, 1872, plays at "some of his friends" in Friends below). Keppler 1875 is off-message and caricatures Black legislators. Each entry: the scan, its pixel size, where Grant is
 * (source px: loop centre and radii), the detail camera ([cx, cy, s] at the start and end of the shot), a note and the source tag.
 * Alternatives already downloaded to public/img/ch06/ (credits in credits_ch06.json):
 *  - critical: cartoon_keppler_trying_it_on_1875.jpg [3840, 5326] (Keppler, "Trying it on", Frank Leslie's, Jan. 2, 1875: Grant tries on a crown)
 *  - admiring: cartoon_nast_usg_1868.jpg [960, 682] (Nast, "Unconditional Surrender Grant", Harper's Weekly, Nov. 21, 1868; small scan)
 */
type Cartoon = {src: string; size: [number, number]; grant: [number, number, number, number]; cam: [[number, number, number], [number, number, number]]; note: string[]; noteXY: [number, number]; tag: string};
const CARTOON_A: Cartoon = {
  src: 'img/ch06/cartoon_nast_grant_1872.png',
  size: [1920, 2228],
  grant: [530, 1150, 200, 640],
  cam: [[760, 1000, 1.0], [640, 900, 1.25]],
  note: ['the general who saved the Union,', 'guarding its new citizens'],
  noteXY: [960, 110],
  tag: "Thomas Nast, Harper's Weekly, April 13, 1872 · Wikimedia Commons",
};
const CARTOON_B: Cartoon = {
  src: 'img/ch06/cartoon_morgan_civil_service_1872.png',
  size: [2839, 1858],
  grant: [1220, 950, 250, 680],
  cam: [[1300, 900, 0.75], [1220, 820, 0.95]],
  note: ['a soldier out of his depth'],
  noteXY: [110, 900],
  tag: "Matt Morgan, Grant's civil service exam, Frank Leslie's, Jan. 13, 1872 · Wikimedia Commons",
};

const I = {
  grant: 'img/ch06/grant_brady.jpg',
  matched: 'img/ch06/cartoon_nast_matched_1868.jpg',
  party: 'img/ch06/cartoon_family_party_1872.jpg',
  stl: 'img/ch06/st_louis_locust_st_1857.jpg',
  galena: 'img/ch06/galena_grant_perkins_store.jpg',
  fifteenth: 'img/ch06/fifteenth_amendment_kelly.jpg',
  klan: 'img/ch06/visit_of_the_ku_klux_bellew.jpg',
};
const Z = {
  grant: [2625, 4000] as [number, number],
  matched: [960, 861] as [number, number],
  party: [2000, 1414] as [number, number],
  stl: [3840, 2316] as [number, number],
  galena: [325, 364] as [number, number],
  fifteenth: [4000, 3181] as [number, number],
  klan: [3892, 3048] as [number, number],
};
const TAG = {
  grant: 'Ulysses S. Grant · Brady National Photographic Art Gallery · Library of Congress',
  matched: "Thomas Nast, Matched (detail), Harper's Weekly, Oct. 31, 1868 · Wikimedia Commons",
  party: 'J. Cameron, A Nice Family Party, Currier & Ives, 1872 · Library of Congress',
  stl: 'View in Locust Street, St. Louis, Missouri, 1857 · Wikimedia Commons',
  galena: 'Grant & Perkins leather store, Galena, Ill., c. 1865 · J. E. James · Wikimedia Commons',
  fifteenth: 'Thomas Kelly, The Fifteenth Amendment, c. 1870 · Library of Congress',
  klan: "Frank Bellew, Visit of the Ku-Klux, Harper's Weekly, Feb. 24, 1872 · Library of Congress",
  map: 'Map: G. K. Warren, 1868 · Library of Congress',
};

// ───────────────────────── the slogan ─────────────────────────

/** 1 · Grant in 1868 (coral), a slow push. */
const Grant1868: React.FC = () => (
  <Pic src={I.grant} size={Z.grant} tag={TAG.grant} mask={M6.grant} tintAt={6} tint={0.5} traceAt={10} k={[[0, 1312, 1360, 0.74], [at('Let us'), 1330, 1330, 0.82]]}>
    {() => (
      <>
        <SlapTitle text="1868" x={100} y={120} size={130} at={at('1868')} seed={71} />
        <Note text="four words" x={110} y={360} size={62} rot={-4} at={at('four') - 2} />
        <Label text="from his acceptance letter" x={112} y={470} size={22} at={at('letter') - 2} />
      </>
    )}
  </Pic>
);

/** 2 · "Let us have peace." on Nast's 1868 panel (only the Grant half of "Matched"). */
const Slogan: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Let us') - 1;
  const sh = shake(f, [at('Let us') + 3], 8);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <DeskCam k={[[a, 18, 1.0, 0, 0, -2], [at('Translation'), 12, 1.06, 30, 0, 0]]}>
        <Lift x={170} y={110} w={560} hgt={860} h={10} at={-99} rot={-3} seed={31}>
          <Print src={I.matched} size={Z.matched} x={0} y={0} w={560} crop={[48, 44, 480, 712]} at={-99} seed={31} />
        </Lift>
      </DeskCam>
      <SlapTitle text="“LET US" x={860} y={250} size={150} at={at('Let us')} seed={73} rot={-3} />
      <SlapTitle text="HAVE PEACE.”" x={860} y={460} size={150} at={at('have') - 1} seed={75} rot={-2} />
      <ScrimTag text={TAG.matched} />
    </AbsoluteFill>
  );
};

/** 3 · the translation, bare handwriting on the desk. */
const Translation: React.FC = () => {
  const a = at('Translation') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 12, 1.0, 0, 0, 0], [at('This was'), 12, 1.08, -20, 20, 0]]}><></></DeskCam>
      <Label text="translation:" x={200} y={250} size={34} at={a + 2} />
      <Lines x={200} y={360} size={86} gap={170} rows={[{text: 'the war is over.', at: at('war') - 2}, {text: "let's finish the job.", at: at('finish') - 3, color: '#ffffff'}]} />
    </AbsoluteFill>
  );
};

// ───────────────────────── the road there ─────────────────────────

/** 4 · St. Louis: a pan along Locust Street; firewood. */
const StLouis: React.FC = () => (
  <Pic src={I.stl} size={Z.stl} tag={TAG.stl} k={[[at('This was') - 1, 1500, 1150, 0.7], [at('Then clerking'), 2200, 1180, 0.75]]}>
    {() => (
      <>
        <Label text="ten years earlier · St. Louis" x={110} y={120} size={28} at={at('ten') - 2} />
        <Lines x={110} y={200} size={58} rows={[{text: 'out of the Army,', at: at('out') - 2}, {text: 'selling firewood', at: at('selling') - 2}]} gap={88} />
      </>
    )}
  </Pic>
);

/** 5 · the leather goods store in Galena. */
const Galena: React.FC = () => {
  const a = at('Then clerking') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 20, 1.1, 0, 0, 3], [at('The war changed'), 14, 1.0, 0, 20, 0]]}>
        <Lift x={260} y={120} w={640} hgt={720} h={10} at={a + 1} rot={-3} seed={33}>
          <Print src={I.galena} size={Z.galena} x={0} y={0} w={640} at={-99} seed={33}>
            {(S) => {
              const [sx, sy] = S(205, 197);
              return <Loop cx={sx} cy={sy} rx={130} ry={50} at={at('leather') - 2} seed={21} tilt={-3} width={6} />;
            }}
          </Print>
        </Lift>
      </DeskCam>
      <Lines x={1020} y={340} size={56} gap={90} rows={[{text: "his father's", at: at("father's") - 2}, {text: 'leather goods store', at: at('leather') - 2}]} />
      <Label text="Galena, Illinois" x={1030} y={560} size={26} at={at('store') - 2} />
      <ScrimTag text={TAG.galena} />
    </AbsoluteFill>
  );
};

/** 6 · the war changed everything: Grant again, pulled back. */
const Famous: React.FC = () => (
  <Pic src={I.grant} size={Z.grant} tag={TAG.grant} mask={M6.grant} tintAt={-99} tint={0.5} k={[[at('The war changed') - 1, 1330, 1500, 0.95], [at('And for a lot'), 1330, 1500, 0.77]]}>
    {() => <Lines x={110} y={160} size={56} gap={84} rows={[{text: 'the most famous man', at: at('famous') - 3}, {text: 'in the country', at: at('country') - 3}]} />}
  </Pic>
);

// ───────────────────────── the two views ─────────────────────────

const SUP = ['the 15th Amendment (1870)', 'laws to enforce it', 'troops + prosecutors vs. the Klan', 'a Peace Policy out West'];

/** The two-views card on the desk (dark, teal rules): supporters left, critics right. */
const TwoViews: React.FC<{left: number[]; right: {text: string; at: number}[]; leftHead: number; rightHead: number}> = ({left, right, leftHead, rightHead}) => {
  const g = useGFrame();
  const pal = usePal();
  const hand = useHand();
  const row = (t: string, a: number, x: number, y: number, color: string) => {
    if (g < a) return null;
    const p = interpolate(g, [a, a + 10], [0, 1], clamp);
    return <div key={t} style={{position: 'absolute', left: x, top: y, fontFamily: hand.family, fontSize: 40 * hand.scale, color, whiteSpace: 'nowrap', clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`,
      textShadow: '0 0 2px #111, 2px 2px 0 #111, -2px 2px 0 #111'}}>{t}</div>;
  };
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1500, height: 760, background: 'radial-gradient(ellipse at 40% 30%, #36312a 0%, #26231d 75%, #1d1a15 100%)', boxShadow: '14px 18px 0 #050403'}}>
      <div style={{position: 'absolute', left: 749, top: 40, bottom: 40, width: 3, background: pal.mark, opacity: 0.8}} />
      <div style={{position: 'absolute', left: 50, top: 46, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: pal.mark, opacity: g >= leftHead ? 1 : 0}}>HIS SUPPORTERS</div>
      <div style={{position: 'absolute', left: 800, top: 46, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: pal.subject, opacity: g >= rightHead ? 1 : 0.25}}>HIS CRITICS</div>
      <div style={{position: 'absolute', left: 30, right: 30, top: 110, height: 2, background: pal.mark, opacity: 0.6}} />
      {SUP.map((t, i) => row(`• ${t}`, left[i] ?? 1e7, 50, 150 + i * 120, pal.mark))}
      {right.map((r, i) => row(`• ${r.text}`, r.at, 800, 150 + i * 120, '#f4efe6'))}
    </div>
  );
};

/** 7 · "for a lot of Americans, he did": the card's supporters' side opens. */
const Supporters: React.FC = () => {
  const a = at('And for a lot') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 18, 0.95, 0, 0, -2], [at('In 1870'), 12, 1.0, 0, 10, 0]]}>
        <Lift x={210} y={150} w={1500} hgt={760} h={8} at={a + 2} rot={-1} seed={35}>
          <TwoViews left={[]} right={[]} leftHead={at('supporters') - 2} rightHead={1e7} />
        </Lift>
      </DeskCam>
      <Note text="they point to the record" x={260} y={940} size={52} rot={-2} at={at('record') - 3} />
    </AbsoluteFill>
  );
};

/** 8 · the 15th Amendment lithograph, wide. */
const Fifteenth: React.FC = () => (
  <Pic src={I.fifteenth} size={Z.fifteenth} tag={TAG.fifteenth} filter="grayscale(1) contrast(1.15) brightness(1.0)" k={[[at('In 1870') - 1, 2000, 1500, 0.5], [at('protecting'), 2000, 1450, 0.56]]}>
    {() => <SlapTitle text="15TH AMENDMENT · 1870" x={100} y={70} size={84} at={at('15th')} seed={77} />}
  </Pic>
);

/** 9 · detail on the parade; the definition; laws to enforce it. */
const Vote: React.FC = () => (
  <Pic src={I.fifteenth} size={Z.fifteenth} tag={TAG.fifteenth} filter="grayscale(1) contrast(1.15) brightness(0.92)" k={[[at('protecting') - 1, 1700, 1500, 1.0], [at('and when'), 2250, 1550, 1.15]]}>
    {() => (
      <>
        <Definition term="15th Amendment" def="the right to vote can't be denied because of race" at={at('protecting')} x={110} y={760} w={1200} />
        <Note text="+ Grant signed laws to enforce it" x={110} y={120} size={56} rot={-3} at={at('signed') - 2} />
      </>
    )}
  </Pic>
);

/** 10 · the Klan's terror (Harper's Weekly, 1872), wide. */
const Klan: React.FC = () => (
  <Pic src={I.klan} size={Z.klan} tag={TAG.klan} k={[[at('and when') - 1, 1950, 1500, 0.5], [at('he sent'), 1700, 1450, 0.56]]}>
    {() => <Note text="terror against Black voters" x={860} y={900} size={52} rot={-3} at={at('terrorized') - 2} />}
  </Pic>
);

/** 11 · the federal response, written over the darkened engraving. */
const Response: React.FC = () => (
  <Pic src={I.klan} size={Z.klan} tag={TAG.klan} filter="grayscale(1) contrast(1.1) brightness(0.42)" k={[[at('he sent') - 1, 1200, 1350, 0.95], [at('Out West'), 1300, 1350, 1.05]]}>
    {() => <Lines x={160} y={340} size={74} gap={130} rows={[{text: '→ federal troops', at: at('troops') - 4}, {text: '→ federal prosecutors', at: at('prosecutors') - 4}]} />}
  </Pic>
);

/** 12 · out West: the map card (the series map), wide. */
const West: React.FC = () => {
  const a = at('Out West') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 26, 0.9, 0, 0, -3], [at('His Peace'), 18, 0.98, 0, 0, 0]]}>
        <Lift x={360} y={150} w={1200} hgt={760} h={8} at={a + 1} rot={1} seed={37}>
          <MapCard x={0} y={0} w={1200} h={760} src={IMG.warren} size={SZ.warren} fx={1700} fy={1300} scale={0.36} at={-99} caption="THE WEST · 1868" bright />
        </Lift>
      </DeskCam>
      <Note text="something different" x={200} y={930} size={54} rot={-2} at={at('different') - 2} />
      <ScrimTag text={TAG.map} />
    </AbsoluteFill>
  );
};

/** 13 · the Peace Policy as a drawn swap: the Army struck through, churches + reservations in its place. */
const Policy: React.FC = () => {
  const pal = usePal();
  const a = at('His Peace') - 1;
  const box = (x: number, y: number, w: number, t: string, on: number, color = pal.mark) => (
    <Lines key={t} x={x} y={y} size={66} rows={[{text: t, at: on, color}]} />
  );
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 14, 1.0, 0, 0, 0], [at('Remember'), 10, 1.06, 0, 20, 0]]}><></></DeskCam>
      <SlapTitle text="PEACE POLICY" x={100} y={80} size={100} at={at('Peace Policy')} seed={79} />
      <Label text="dealing with Native nations, from 1869" x={110} y={230} size={26} at={at('Native') - 2} />
      {box(180, 420, 0, 'the Army', at('promised'), '#f4efe6')}
      <Line d="M150,470 L520,430" at={at('instead') - 2} dur={6} color={pal.subject} width={9} />
      <Line d="M600,470 L860,470 M830,445 L862,470 L830,495" at={at('through') - 2} dur={8} />
      {box(920, 380, 0, 'churches', at('churches') - 2)}
      {box(920, 480, 0, '+ reservations', at('reservations') - 2)}
    </AbsoluteFill>
  );
};

/** 14 · "Remember that policy." A dated note pointing ahead; held. */
const Remember: React.FC = () => {
  const a = at('Remember') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 10, 1.1, 0, 0, 0], [at('Cartoonists'), 10, 1.16, 0, 0, 0]]}><></></DeskCam>
      <Lines x={260} y={330} size={84} gap={150} rows={[{text: 'remember: the Peace Policy', at: at('Remember') - 2}, {text: '→ Episode 4', at: at('last episode') - 3, color: '#ffffff'}]} />
    </AbsoluteFill>
  );
};

// ───────────────────────── the cartoons ─────────────────────────

/** 15 · both cartoons on the desk, side by side. */
const BothWays: React.FC = () => {
  const a = at('Cartoonists') - 1;
  const fit = (c: Cartoon, maxW: number, maxH: number) => Math.min(maxW, (maxH * c.size[0]) / c.size[1]);
  const wa = fit(CARTOON_A, 700, 780);
  const wb = fit(CARTOON_B, 800, 780);
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 20, 0.9, 0, 0, -1], [at('To some'), 14, 0.96, 0, 10, 0]]}>
        <Lift x={150} y={130} w={wa} hgt={(wa * CARTOON_A.size[1]) / CARTOON_A.size[0]} h={10} at={a + 2} rot={-3} seed={41}>
          <Print src={CARTOON_A.src} size={CARTOON_A.size} x={0} y={0} w={wa} at={-99} seed={41} filter="grayscale(1) contrast(1.15)" />
        </Lift>
        <Lift x={980} y={240} w={wb} hgt={(wb * CARTOON_B.size[1]) / CARTOON_B.size[0]} h={14} at={at('both') - 2} rot={3} seed={43}>
          <Print src={CARTOON_B.src} size={CARTOON_B.size} x={0} y={0} w={wb} at={-99} seed={43} filter="grayscale(1) contrast(1.15)" />
        </Lift>
      </DeskCam>
      <Note text="both ways" x={1200} y={110} size={66} rot={-4} at={at('both') - 1} />
      <ScrimTag text={`${CARTOON_A.tag.split(' · ')[0]}  ·  ${CARTOON_B.tag.split(' · ')[0]}`} />
    </AbsoluteFill>
  );
};

/** 16–17 · one cartoon full frame, a push to Grant with a loop. */
const CartoonDetail: React.FC<{c: Cartoon; a: number; b: number; noteAt: number}> = ({c, a, b, noteAt}) => (
  <Pic src={c.src} size={c.size} tag={c.tag} filter="grayscale(1) contrast(1.15)" k={[[a, ...c.cam[0]], [b, ...c.cam[1]]]}>
    {(S, s) => {
      const [gx, gy] = S(c.grant[0], c.grant[1]);
      return (
        <>
          <Loop cx={gx} cy={gy} rx={c.grant[2] * s} ry={c.grant[3] * s} at={a + 8} seed={23} tilt={-4} width={6} />
          <Lines x={c.noteXY[0]} y={c.noteXY[1]} size={44} gap={76} rows={c.note.map((t, i) => ({text: t, at: noteAt + i * 8}))} />
        </>
      );
    }}
  </Pic>
);

/** 18 · the critics' side of the card: loyal, trusted his friends. */
const Critics: React.FC = () => {
  const a = at('Because his') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 14, 1.0, 0, 0, -1], [at('And some'), 10, 1.1, -160, 0, 0]]}>
        <Lift x={210} y={150} w={1500} hgt={760} h={8} at={-99} rot={-1} seed={35}>
          <TwoViews left={[-99, -99, -99, -99]} leftHead={-99} rightHead={at('critics') - 2}
            right={[{text: 'loyal', at: at('loyal') - 2}, {text: 'trusted his friends', at: at('trusted') - 2}]} />
        </Lift>
      </DeskCam>
      <Note text="his critics had a point too" x={260} y={950} size={52} rot={-2} at={at('point', 2) - 3} />
    </AbsoluteFill>
  );
};

/**
 * 19 · "some of his friends did not deserve it": Currier & Ives, A Nice Family Party (1872). Tight on Grant and his own slogan
 * ("Let us have peace." fills teal), then the pull-out finds everyone around him saying "Let us have a piece." (the three boxes
 * fill coral, left to right). Box borders measured in source px (2000 x 1414): peace 1136–1448 × 22–97 · pieces 105–403 × 174–231,
 * 481–771 × 167–229, 1471–1767 × 158–234.
 */
const Friends: React.FC = () => {
  const a = at('And some') - 1;
  const w = at('friends', 2) - 4;
  const pal = usePal();
  const g = useGFrame();
  return (
    <Pic src={I.party} size={Z.party} tag={TAG.party} tagY={1036} filter="grayscale(1) contrast(1.12)" vignette={0.45}
      k={[[a, 1180, 330, 1.45], [w, 1150, 340, 1.5], [w + 16, 1000, 560, 0.96], [at('And the biggest'), 1000, 560, 0.98]]}>
      {(S) => {
        const B = (x0: number, x1: number, y0: number, y1: number, t: number, color: string) => {
          const [l, tp] = S(x0, y0);
          const [r, bt] = S(x1, y1);
          const p = interpolate(g, [t, t + 7], [0, 1], clamp);
          return <div key={x0} style={{position: 'absolute', left: l, top: tp, width: r - l, height: bt - tp, background: color, opacity: 0.55, mixBlendMode: 'multiply',
            clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`}} />;
        };
        return (
          <>
            {B(1136, 1448, 22, 97, a + 6, pal.mark)}
            {B(105, 403, 174, 231, w + 14, pal.subject)}
            {B(481, 771, 167, 229, w + 18, pal.subject)}
            {B(1471, 1767, 158, 234, w + 22, pal.subject)}
            <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(8,7,5,0.92) 0%, rgba(8,7,5,0.75) 16%, rgba(8,7,5,0) 38%)'}} />
            <Lines x={110} y={830} size={54} gap={84} rows={[{text: 'some of his friends', at: w + 10}, {text: 'did not deserve it', at: at('deserve') - 3, color: '#ffffff'}]} />
          </>
        );
      }}
    </Pic>
  );
};

/** 20 · hand-off: the biggest scandal of all, already under way (held through the tail). */
const Scandal: React.FC = () => {
  const a = at('And the biggest') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 12, 1.05, 0, 0, 0], [END, 20, 0.9, 0, -20, -2]]}>
        <Lift x={210} y={150} w={1500} hgt={760} h={8} at={-99} rot={-1} seed={35}>
          <TwoViews left={[-99, -99, -99, -99]} leftHead={-99} rightHead={-99} right={[{text: 'loyal', at: -99}, {text: 'trusted his friends', at: -99}]} />
        </Lift>
      </DeskCam>
      <Lines x={880} y={720} size={52} gap={84} rows={[{text: '+ the biggest scandal of all…', at: at('scandal') - 3, color: '#ffffff'}, {text: 'started before he took office', at: at('started') - 2}]} />
    </AbsoluteFill>
  );
};

// ───────────────────────── assembly ─────────────────────────

const c = (w: string, n = 1) => at(w, n) - 1;
const SHOTS: [number, React.ReactNode, ('whip' | 'cut')?][] = [
  [0, <Grant1868 />],
  [c('Let us'), <Slogan />, 'cut'],
  [c('Translation'), <Translation />, 'cut'],
  [c('This was'), <StLouis />, 'whip'],
  [c('Then clerking'), <Galena />, 'cut'],
  [c('The war changed'), <Famous />, 'cut'],
  [c('And for a lot'), <Supporters />, 'whip'],
  [c('In 1870'), <Fifteenth />, 'cut'],
  [c('protecting'), <Vote />, 'cut'],
  [c('and when'), <Klan />, 'cut'],
  [c('he sent'), <Response />, 'cut'],
  [c('Out West'), <West />, 'whip'],
  [c('His Peace'), <Policy />, 'cut'],
  [c('Remember'), <Remember />, 'cut'],
  [c('Cartoonists'), <BothWays />, 'whip'],
  [c('To some'), <CartoonDetail c={CARTOON_A} a={c('To some')} b={c('To others')} noteAt={at('saved') - 3} />, 'cut'],
  [c('To others'), <CartoonDetail c={CARTOON_B} a={c('To others')} b={c('Because his')} noteAt={at('depth') - 6} />, 'whip'],
  [c('Because his'), <Critics />, 'cut'],
  [c('And some'), <Friends />, 'cut'],
  [c('And the biggest'), <Scandal />, 'cut'],
];

const tick = (w: string, d = 2, n = 1): SfxRow => [at(w, n) - d, 'marker_tick', 0.2];
const SFX: SfxRow[] = [
  ...SHOTS.slice(1).map(([s, , k]): SfxRow => (k === 'whip' ? [s - 4, 'whip_soft', 0.25] : [s, 'whoosh', 0.22])),
  [at('1868'), 'stamp', 0.22], tick('four', 4), tick('letter', 4),
  [at('Let us'), 'stamp', 0.24], [at('have') - 1, 'stamp', 0.2],
  tick('war', 4), tick('finish', 5),
  tick('out', 4), tick('selling', 4), [at('Then clerking') + 1, 'paper_slap_soft', 0.25], tick("father's", 4), tick('leather', 4),
  tick('famous', 5), tick('country', 5),
  [at('And for a lot') + 1, 'card_slide_soft', 0.2], tick('supporters', 4), tick('record', 5),
  [at('15th'), 'stamp', 0.22], [at('protecting'), 'card_slide_soft', 0.15], tick('signed', 4), tick('terrorized', 4), tick('troops', 6), tick('prosecutors', 6),
  [at('Out West'), 'card_slide_soft', 0.2], tick('different', 4),
  [at('Peace Policy'), 'stamp', 0.22], tick('promised', 2), tick('churches', 4), tick('reservations', 4), tick('instead', 4),
  tick('Remember', 4), tick('last episode', 5),
  [at('Cartoonists') + 1, 'paper_slap_soft', 0.22], [at('both') - 1, 'paper_slap_soft', 0.22], tick('both', 3),
  tick('saved', 5), tick('depth', 8),
  tick('critics', 4), tick('loyal', 4), tick('trusted', 4), tick('point', 5, 2),
  tick('friends', 5, 2), tick('deserve', 5), [at('friends', 2) - 4 + 14, 'marker_tick', 0.16], [at('friends', 2) - 4 + 22, 'marker_tick', 0.16], tick('scandal', 5), tick('started', 4),
];

const Body: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Shots shots={SHOTS} />
    <Sounds list={SFX} />
  </AbsoluteFill>
);

export const Ch06: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch06_let_us_have_peace.wav" lead={LEAD} music={[
    // library cue (r_curtain); fallback g_world_outside. No aw_ cue planned here.
    {src: 'music/r_curtain.mp3', volume: bed('r_curtain')},
  ]}>
    <Body />
  </ChapterShell>
);
