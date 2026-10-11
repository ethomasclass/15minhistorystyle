// Chapter 5 · The Party: rallies, "Tippecanoe and Tyler Too", the songs, city cabins and the raccoon, the "booze" myth,
// Greeley's paper, the rolling ball, women at the rallies, Harrison on the road, and the Democrats' O.K. clubs.
import React from 'react';
import words from '../../public/audio/ch05_the_party.words.json';
import {Highlight, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, CropCard, LEAD, makeTimeline, type Narration, onScreen, Photo, Stamp, type TL, useScene} from '../kit/shell';
import {Desk, DropCard, Sounds, SyncQuote} from '../kit/bs';
import {Person} from '../kit/figures';
import {Board, CABIN_BOTTLE, RACCOON, RollingBall, RubberStamp, Sketch} from '../kit/lc';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH05_FRAMES = chapterFrames(N, LEAD);

const PARADE: [number, number] = [2240, 3000];
const BANNER: [number, number] = [1920, 1251];
const TYLER: [number, number] = [2241, 3000];
const SONG: [number, number] = [1884, 3391];
const LEVER: [number, number] = [1536, 1120];
const GREELEY: [number, number] = [2459, 3000];
const HFEN: [number, number] = [1028, 1280];
const HOE: [number, number] = [1536, 1059];

/** It isn't a campaign. It's a party. */
const Party: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Photo src="img/ch05/whig_parade_hard_cider_adams.jpg" size={PARADE} fx={1120} fy={1500} z0={1.02} z1={1.1} a={0} b={t.at('Whig rallies')} bw="grayscale(1) contrast(1.3) brightness(0.7)">
      {() => (
        <>
          <Note text="not really a campaign..." x={110} y={90} size={58} rot={-3} at={t.at("isn't really") - 3} color="#ffffff" />
          {g >= t.at("It's a party.") && <Highlight text="IT'S A PARTY." x={110} y={200} size={130} at={t.at("It's a party.")} seed={71} rot={-3} />}
          <Tag text="John Wolcott Adams, A Whig Parade During the Hard Cider Campaign (drawn c. 1912) · Library of Congress" />
        </>
      )}
    </Photo>
  );
};

/** Rallies: silk ribbons from the 1840 conventions, crowds "in the tens of thousands". */
const Rallies: React.FC<{t: TL}> = ({t}) => (
  <Desk a={0}>
    <Stamp text="TENS OF THOUSANDS" x={110} y={150} at={t.at('tens of thousands')} size={78} color="#f4efe6" />
    <Note text="at a single rally" x={130} y={290} size={52} rot={-3} at={t.at('tens of thousands') + 6} />
    <Note text="(newspapers claim more)" x={130} y={390} size={50} rot={-3} at={t.at('Newspapers claim') - 3} color="#FF9F1C" />
    <Note text="parades" x={140} y={560} size={62} rot={-3} at={t.at('Parades,') - 3} />
    <Note text="flags" x={420} y={600} size={62} rot={-5} at={t.at('flags,') - 3} />
    <Note text="fireworks" x={160} y={700} size={62} rot={-2} at={t.at('fireworks,') - 3} />
    <Note text="songs" x={500} y={760} size={70} rot={-4} at={t.at('and songs.') - 3} color={usePal().subject} />
    <DropCard src="img/ch05/new_england_convention_1840.jpg" x={1060} y={110} w={240} rot={-3} at={t.at('Whig rallies') + 2} />
    <DropCard src="img/ch05/francestown_welcomes_old_tip.jpg" x={1340} y={150} w={200} rot={2} at={t.at('draw crowds')} />
    <DropCard src="img/ch05/nh_delegation_convention.jpg" x={1580} y={120} w={250} rot={-2} at={t.at('in the tens')} />
    <Tag text="Silk ribbons from 1840 Whig conventions · Library of Congress" />
  </Desk>
);

/** "Tippecanoe and Tyler Too": the slogan rhymes. */
const Slogan: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Photo src="img/ch05/tip_and_ty_banner.jpg" size={BANNER} fx={960} fy={560} z0={1.02} z1={1.08} a={t.at('The big hit')} b={t.at('There are songs')} bw="grayscale(1) contrast(1.15) brightness(0.55)">
      {() => (
        <>
          <Note text="the big hit:" x={110} y={80} size={56} rot={-3} at={t.at('The big hit') - 3} color="#ffffff" />
          {g >= t.at('Tippecanoe and Tyler') && <Highlight text="TIPPECANOE AND TYLER TOO" x={100} y={170} size={92} at={t.at('Tippecanoe and Tyler')} seed={73} rot={-2} />}
          {g >= t.at('Tyler is') && <CropCard mask={MASKS.tyler} src="img/ch07/tyler_fenderich_1841.jpg" size={TYLER} x={1440} y={380} w={340} h={430} fx={1180} fy={1200} scale={0.27} rot={3} at={t.at('Tyler is') - 1} traceAt={t.at('John Tyler,') + 2} />}
          <Note text="John Tyler, running mate" x={1020} y={870} size={46} rot={-3} at={t.at('John Tyler,') - 2} />
          <Note text="it rhymes." x={200} y={820} size={86} rot={-4} at={t.at('It rhymes,') - 3} color={pal.subject} />
          <Tag text="'Tip & Ty' campaign banner, 1840 · via Wikimedia Commons; Charles Fenderich, John Tyler, 1841 · Library of Congress" />
        </>
      )}
    </Photo>
  );
};

/** The songbook, and the chorus about Van Buren, word by word. */
const Songs: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Board>
      <CropCard src="img/ch05/log_cabin_song_book_cover.jpg" size={SONG} x={150} y={150} w={520} h={800} fx={940} fy={1620} scale={0.29} rot={-3} at={1} bw="grayscale(1) sepia(0.25) contrast(1.15)" />
      <Note text="songs about Van Buren, too" x={800} y={200} size={56} rot={-3} at={t.at('There are songs') - 3} color="#ffffff" />
      <Note text="the chorus:" x={800} y={320} size={52} rot={-3} at={t.at('The chorus') - 3} />
      <SyncQuote t={t} phrase={'"Van, Van, Van is a used-up man."'} x={800} y={430} w={1000} size={84} marks={{5: pal.subject}} />
      <Tag text="The Harrison and Log Cabin Song Book, Columbus, 1840 · Internet Archive" />
    </Board>
  );
};

/** Cabins built in cities for meetings (and sometimes a real raccoon). */
const CityCabins: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Photo src="img/ch05/almighty_lever.jpg" size={LEVER} fx={620} fy={760} z0={1.45} z1={1.6} a={t.at('Whig clubs')} b={t.at('A Philadelphia')} bw="grayscale(1) contrast(1.2) brightness(0.62)">
      {(p) => {
        const S = onScreen(p);
        const [cx, cy] = S(600, 830);
        return (
          <>
            <Note text="Whig clubs build cabins in cities..." x={110} y={80} size={56} rot={-3} at={t.at('Whig clubs') - 3} color="#ffffff" />
            <Loop cx={cx} cy={cy} rx={330} ry={210} at={t.at('in the middle') + 2} seed={75} />
            <Note text="for meetings" x={1360} y={220} size={60} rot={-4} at={t.at('hold meetings') - 3} />
            <Sketch d={RACCOON} x={1500} y={420} w={300} at={t.at('Sometimes the raccoon') - 1} dur={10} seed="rc2" width={6} />
            <Note text="sometimes the raccoon is real" x={900} y={900} size={52} rot={-3} at={t.at('is real.') - 3} color={pal.subject} />
            <Tag text="Detail · Edward Williams Clay, The Almighty Lever, 1840 · Library of Congress" />
          </>
        );
      }}
    </Photo>
  );
};

/** The cabin bottle, and the "booze" myth. */
const Booze: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Board>
      <Sketch d={CABIN_BOTTLE} x={260} y={180} w={330} at={t.at('cabin-shaped bottles') - 6} dur={12} seed="bt" width={6} />
      <Note text="a Philadelphia distiller" x={760} y={120} size={56} rot={-3} at={t.at('A Philadelphia') - 3} color="#ffffff" />
      <Note text="whiskey in cabin-shaped bottles" x={780} y={230} size={56} rot={-3} at={t.at('sells whiskey') - 3} />
      <Note text="the word 'booze' comes from this?" x={780} y={380} size={52} rot={-3} at={t.at('some people say') - 3} color="#FF9F1C" />
      {g >= t.at('booze') && <Highlight text="BOOZE?" x={800} y={480} size={120} at={t.at('booze')} seed={77} rot={-3} />}
      <RubberStamp text="MYTH" x={1260} y={470} at={t.at("It isn't.", 2)} size={120} rot={-12} />
      <Note text="the word is much older" x={800} y={760} size={64} rot={-3} at={t.at('much older.') - 3} />
    </Board>
  );
};

/** Greeley's campaign weekly. */
const Greeley: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Board>
      <CropCard src="img/ch05/greeley_brady.jpg" size={GREELEY} x={160} y={160} w={500} h={760} fx={1220} fy={1400} scale={0.34} rot={-2} at={1} />
      <Note text="a weekly newspaper:" x={760} y={150} size={56} rot={-3} at={t.at('A weekly') - 3} color="#ffffff" />
      {g >= t.at('The Log Cabin,') && <Highlight text="THE LOG CABIN" x={760} y={250} size={110} at={t.at('The Log Cabin,')} seed={79} rot={-2} />}
      <Note text="editor: a young Horace Greeley" x={780} y={450} size={56} rot={-3} at={t.at('edited by') - 3} />
      <Note text="prints the songs" x={800} y={570} size={60} rot={-3} at={t.at('prints the') - 3} />
      <Tag text="Mathew Brady studio, Horace Greeley (photographed later in life) · Library of Congress" />
    </Board>
  );
};

/** The rolling ball (drawn: a ball covered in slogans, rolled town to town). */
const Ball: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('Supporters roll');
  return (
    <Board>
      <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}><path d="M0,840 L1920,840" stroke="rgba(237,231,220,0.5)" strokeWidth={4} strokeDasharray="30 22" /></svg>
      <RollingBall x0={240} x1={1300} y={840} d={420} a={a} b={a + 110} text="TIP & TY" />
      <Note text="town to town" x={1350} y={880} size={52} rot={-3} at={t.at('town to town') - 3} color="#ffffff" />
      {g >= t.at('keep the ball') && <Highlight text="KEEP THE BALL ROLLING!" x={110} y={110} size={100} at={t.at('keep the ball')} seed={81} rot={-2} />}
      <Note text="(that's where the phrase is said to come from)" x={130} y={290} size={46} rot={-3} at={t.at('said to') - 3} color="#FF9F1C" />
    </Board>
  );
};

/** Women at the rallies. */
const Women: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Board>
      {[0, 1, 2, 3, 4, 5].map((i) => <Person key={i} x={360 + i * 230} y={820} h={300} at={t.at('Women') + i} dress={i % 2 === 0} color="#EDE7DC" />)}
      <Note text="women can't vote" x={140} y={110} size={64} rot={-3} at={t.at('Women') - 3} color="#ffffff" />
      <Note text="but plenty come to the rallies" x={180} y={230} size={64} rot={-3} at={t.at('but plenty') - 3} />
      <Note text="the Whigs love it" x={1240} y={900} size={58} rot={-3} at={t.at('love having') - 3} color={pal.subject} />
    </Board>
  );
};

/** The candidate goes on the road. He's 67. */
const Road: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Board>
      <CropCard src="img/ch03/harrison_fenderich_1841.jpg" size={HFEN} x={160} y={170} w={480} h={600} fx={514} fy={620} scale={0.62} rot={-2} at={1} />
      <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
        <path d="M220,900 C600,960 900,820 1250,880 S1700,960 1860,880" stroke={pal.mark} strokeWidth={8} strokeDasharray="26 20" fill="none" strokeLinecap="round" />
      </svg>
      <Note text="on the road: speeches" x={760} y={200} size={60} rot={-3} at={t.at('He goes on') - 3} />
      <Note text="(most candidates stayed home)" x={780} y={320} size={50} rot={-3} at={t.at('Candidates mostly') - 3} color="#ffffff" />
      <Note text="a lot to prove:" x={780} y={470} size={58} rot={-3} at={t.at('a lot to prove') - 3} />
      <Stamp text="AGE 67" x={1240} y={540} at={t.at("He's 67.")} size={150} color={pal.subject} rot={-4} />
      <Tag text="Charles Fenderich, Wm. H. Harrison, 1841 · Library of Congress" />
    </Board>
  );
};

/** The Democrats' O.K. clubs, on a Whig cartoon's signpost. */
const OK: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Photo src="img/ch05/hard_road_to_hoe.jpg" size={HOE} fx={420} fy={420} z0={1.6} z1={1.75} a={t.at('The Democrats fight')} b={t.at('outlived') + 60} bw="grayscale(1) contrast(1.2) brightness(0.55)">
      {(p) => {
        const S = onScreen(p);
        const [ox, oy] = S(232, 345);
        return (
          <>
            <Note text="the Democrats' answer:" x={1050} y={90} size={56} rot={-3} at={t.at('The Democrats fight') - 3} color="#ffffff" />
            {g >= t.at('O.K. clubs.') && <Highlight text="O.K. CLUBS" x={1060} y={190} size={100} at={t.at('O.K. clubs.')} seed={83} rot={-2} />}
            <Loop cx={ox + 10} cy={oy} rx={175} ry={100} at={t.at('O.K. for') + 1} seed={85} color={pal.subject} />
            <Note text="O.K. = Old Kinderhook" x={1060} y={380} size={60} rot={-3} at={t.at('Old Kinderhook') - 3} />
            <Note text="(Van Buren's hometown)" x={1080} y={480} size={48} rot={-3} at={t.at("Van Buren's hometown") - 3} color="#ffffff" />
            <Note text="already a joke abbreviation" x={1060} y={600} size={52} rot={-3} at={t.at('already a silly') - 3} />
            <Note text="lost the election..." x={1060} y={740} size={56} rot={-3} at={t.at('It lost') - 3} color="#ffffff" />
            <Note text="outlived both parties" x={1080} y={850} size={66} rot={-3} at={t.at('outlived') - 3} color={pal.subject} />
            <Tag text="Detail · A Hard Road to Hoe! (Whig cartoon), 1840 · Library of Congress" />
          </>
        );
      }}
    </Photo>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Party t={t} />],
    [at('Whig rallies') - 1, <Rallies t={t} />],
    [at('The big hit') - 1, <Slogan t={t} />],
    [at('There are songs') - 1, <Songs t={t} />],
    [at('Whig clubs') - 1, <CityCabins t={t} />],
    [at('A Philadelphia') - 1, <Booze t={t} />],
    [at('A weekly') - 1, <Greeley t={t} />],
    [at('Supporters roll') - 1, <Ball t={t} />],
    [at('Women') - 1, <Women t={t} />],
    [at('And the candidate') - 1, <Road t={t} />],
    [at('The Democrats fight') - 1, <OK t={t} />],
  ];
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map((c) => c[0])}
        stamps={[at("It's a party."), at('tens of thousands'), at('Tippecanoe and Tyler'), at('booze'), at("It isn't.", 2), at('The Log Cabin,'), at('keep the ball'), at("He's 67."), at('O.K. clubs.')]}
        ticks={[at('Whig rallies') + 2, at('draw crowds'), at('in the tens')]}
        writes={["isn't really", 'Newspapers claim', 'Parades,', 'flags,', 'fireworks,', 'and songs.', 'The big hit', 'John Tyler,', 'It rhymes,', 'There are songs', 'The chorus', 'Whig clubs', 'hold meetings', 'is real.', 'A Philadelphia', 'sells whiskey', 'some people say', 'much older.', 'A weekly', 'edited by', 'prints the', 'town to town', 'said to', 'Women', 'but plenty', 'love having', 'He goes on', 'Candidates mostly', 'a lot to prove', 'The Democrats fight', 'Old Kinderhook', "Van Buren's hometown", 'already a silly', 'It lost', 'outlived'].map((p) => at(p))} />
    </>
  );
};

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_the_party.wav" lead={LEAD} music={[{src: 'music/j_campaign.mp3', volume: 0.16}]}>
    <Body />
  </ChapterShell>
);
