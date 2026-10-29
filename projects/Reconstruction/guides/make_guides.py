"""Viewing guides for the three Reconstruction videos, in the format of the teacher's Civil War guide
("In Their Own Words"): page 1 has one big-picture question per chapter, in video order, ending on a thesis frame;
page 2 is Part A (match the term) and Part B (multiple choice), both in video order.

  python3 guides/make_guides.py            # writes guides/Reconstruction_Video_N_viewing_guide.{html,pdf}

Questions use the narration's own wording (ep*/script/ch*.txt). **bold** marks the words to bold.
"""
import html, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
CHROME = next((os.path.join(r, f) for r, _, fs in os.walk('/opt/pw-browsers') for f in fs if f == 'headless_shell'), None)

GUIDES = [
    {
        'n': 1, 'slug': 'Landless_Homeless_Voteless',
        'kicker': 'RECONSTRUCTION · PART 1 · LANDLESS, HOMELESS, VOTELESS',
        'questions': [
            ('A FEW ACRES', 'Identify who wrote to the President from **Edisto Island** in October 1865 and **what they asked for**. What **three words** did they use to describe where that left them?'),
            ('FORTY ACRES', 'Explain what **Garrison Frazier** told Sherman freedpeople needed. What did **Special Field Order No. 15** give freed families, and what was **the catch**?'),
            ('TEN PERCENT', 'Compare **Lincoln\'s Ten Percent Plan** and the **Wade-Davis Bill**. Why did the **Radical Republicans** think Lincoln\'s plan was too weak?'),
            ('FORD\'S THEATRE', 'Describe what Lincoln said outside the White House that **no president had said in public before**. How did **Booth\'s plot** put **Andrew Johnson** in charge?'),
            ('TREASON MUST BE MADE ODIOUS', 'Explain how **Presidential Reconstruction** worked. Why did Johnson\'s **pardons** mean the land on Edisto Island **went back**?'),
            ('EXCEPT AS A PUNISHMENT FOR CRIME', 'Explain the **three steps** of Mississippi\'s **Black Code**. How did the words **"except as a punishment for crime"** make it legal?'),
            ('THE BUREAU', 'Identify **three things the Freedmen\'s Bureau did**. What did Congress do when Johnson **vetoed the Civil Rights Act of 1866**?'),
            ('EQUAL PROTECTION', 'Describe the **three big things** in the first section of the **14th Amendment**. Why does the video say **the Black Codes are why it exists**?'),
            ('SWING AROUND THE CIRCLE', 'Explain why the **1866 election** went against Johnson. What did winning **more than two-thirds of Congress** let the Republicans do?'),
            ('LANDLESS, HOMELESS, VOTELESS', 'Draw a conclusion. Write one thesis sentence: **By the end of 1866**, freedpeople had ___, but they still did not have ___, because ___.'),
        ],
        'terms': [   # (term, definition), in video order; letters are shuffled by SHUFFLE
            ('pardon', 'an official "you\'re forgiven," with your rights given back'),
            ('Radical Republicans', 'the most determined members of Lincoln\'s party, who wanted to remake the South and protect freedpeople'),
            ('homestead', 'a farm of your own'),
            ('Black Codes', 'laws that applied only to Black Southerners, written to keep them working the same fields on their old owners\' terms'),
            ('vagrant', 'someone with no job and no home'),
            ('Freedmen\'s Bureau', 'the government office that handed out food and medicine, made marriages legal, and helped start schools'),
            ('override', 'two-thirds of the House and two-thirds of the Senate make a bill law without the President'),
            ('equal protection', 'a state can\'t have one set of laws for white people and another for Black people'),
        ],
        'shuffle': [5, 2, 7, 0, 4, 1, 6, 3],
        'mc': [
            ('What did **Garrison Frazier** tell Sherman was the best way for freedpeople to take care of themselves?',
             ['money from the government', 'land, worked by their own labor', 'jobs in Northern factories', 'the right to vote right away']),
            ('**Special Field Order No. 15** let freed families farm the land. What was the catch?',
             ['They had to pay rent to the Army.', 'It only lasted until harvest.', 'It didn\'t make them the owners.', 'Only soldiers\' families could use it.']),
            ('Why did Lincoln make the **Ten Percent Plan** generous on purpose?',
             ['He wanted the war over fast and Southerners on his side again.', 'Congress made him do it.', 'He wanted to punish the planters.', 'He planned to give every family 40 acres.']),
            ('How did Johnson\'s **pardons** affect the families on **Edisto Island**?',
             ['The families were given deeds to the land.', 'A pardon gave planters their property back, so the land went back.', 'The Army kept the land for itself.', 'Congress bought the land for the families.']),
            ('Under Mississippi\'s **Black Code**, what could happen to a Black worker with **no written proof of a job**?',
             ['They could be given land of their own.', 'They were sent to work in the North.', 'They had to join the Army.', 'They could be arrested and hired out to pay the fine.']),
            ('Which Southern state was the **only one to ratify the 14th Amendment**?',
             ['Mississippi', 'South Carolina', 'Tennessee', 'Georgia']),
            ('What did the **1866 election** give the Republicans?',
             ['control of the Supreme Court', 'more than two-thirds of Congress, enough to override any veto', 'the presidency', 'control of every Southern state']),
        ],
        'key_mc': 'BCABDCB',
    },
    {
        'n': 2, 'slug': 'Bottom_Rail_on_Top',
        'kicker': 'RECONSTRUCTION · PART 2 · BOTTOM RAIL ON TOP',
        'questions': [
            ('THE FIRST BLACK SENATOR', 'Identify **Hiram Revels** and why his swearing-in in **1870** was historic. What argument did some senators use to **try to stop him**?'),
            ('THE ARMY GOES BACK IN', 'Explain the **three parts of the Reconstruction Act**. Why did **white Southerners** and **freedpeople** see the soldiers so differently?'),
            ('THE BLACKSMITH', 'Describe how freedpeople used their **new right to vote**. Who was **Charles Caldwell**, and what did the **new Southern constitutions** change?'),
            ('ONE VOTE SHORT', 'Explain why the House **impeached Andrew Johnson**. Why did the Senate fall **one vote short** of removing him?'),
            ('THE 15TH AMENDMENT', 'Explain what the **15th Amendment** says. What **three things did it not mention** that would matter later, and **who else did it leave out**?'),
            ('BOTTOM RAIL ON TOP', 'Describe what **"bottom rail on top"** meant. What did the **new state governments** do, and why does the video bring up **New York**?'),
            ('CARPETBAGGERS AND SCALAWAGS', 'Compare **carpetbaggers** and **scalawags**. Why was each name an insult, and who was **Adelbert Ames**?'),
            ('NO LAND', 'Explain why most freedpeople ended up **sharecropping**. How was **tenant farming** different?'),
            ('THE DEBT', 'Explain how a **crop lien** trapped families in **debt**. How did **convict leasing** use the words **"except as a punishment for crime"**?'),
            ('THE GROUND THEY STOOD ON', 'Draw a conclusion. Write one thesis sentence: **By 1870**, freedpeople had won ___ and ___, but it all rested on ___, not ___.'),
        ],
        'terms': [
            ('military districts', 'the five areas the South was split into, each run by a Union general'),
            ('Tenure of Office Act', 'a law saying the President couldn\'t fire certain top officials without the Senate\'s permission'),
            ('impeach', 'like filing charges: the House accuses, then the Senate holds a trial'),
            ('bottom rail', 'freedpeople\'s phrase: the rail that was always in the mud was now on top'),
            ('carpetbaggers', 'Northerners who moved south after the war'),
            ('scalawags', 'white Southerners who voted Republican'),
            ('sharecropping', 'a family farms part of a planter\'s land, and at harvest they split the crop'),
            ('crop lien', 'a promise that the store gets paid first, out of the crop, before the family sees a cent'),
        ],
        'shuffle': [4, 6, 0, 3, 7, 2, 5, 1],
        'mc': [
            ('Some senators tried to stop **Hiram Revels**. What happened?',
             ['The Senate voted 48 to 8, and he took the oath.', 'He had to wait until 1876 to join.', 'The Supreme Court decided the case.', 'Mississippi sent someone else instead.']),
            ('Why was **Tennessee** left out of the **military districts**?',
             ['It was a border state.', 'It had already ratified the 14th Amendment.', 'Johnson refused to let the army in.', 'It had no Black voters.']),
            ('Why did Johnson firing **Edwin Stanton** matter so much to Congress?',
             ['Stanton was the Speaker of the House.', 'Stanton had written the 15th Amendment.', 'Stanton ran the army and was the last Radical ally in the cabinet.', 'Stanton was running for president.']),
            ('The **15th Amendment** says the right to vote can\'t be denied on account of:',
             ['race, color, or previous condition of servitude', 'being a woman', 'not paying a tax', 'not being able to read']),
            ('About how many **Black men held public office** during Reconstruction?',
             ['20', '200', '2,000', '20,000']),
            ('Why did freedpeople end up **sharecropping**?',
             ['They didn\'t own land, and planters had no money to pay workers.', 'The government required it.', 'It paid more than any other job.', 'They had already paid off their land.']),
            ('At **settling up**, what did many sharecropping families find out?',
             ['They had saved enough to buy land.', 'They owed more than they made.', 'The planter owed them money.', 'Their debt had been forgiven.']),
        ],
        'key_mc': 'ABCACAB',
    },
    {
        'n': 3, 'slug': 'Redemption',
        'kicker': 'RECONSTRUCTION · PART 3 · REDEMPTION',
        'questions': [
            ('A CHRISTMAS DRINK', 'Identify **Charles Caldwell** and what happened to him in **December 1875**. How do we know his story?'),
            ('THE NIGHT', 'Describe the **Ku Klux Klan** and who it targeted. Why did the Klan want **"the night back,"** and what was its **goal**?'),
            ('PROTECTION', 'Explain how the federal government fought back with the **Enforcement Acts**. What did the result in **South Carolina** prove?'),
            ('COLFAX', 'Describe what happened at **Colfax** in 1873. Why did the **Supreme Court** throw out the convictions, and who was left to punish the mob?'),
            ('TIRED', 'Explain **three reasons** Northerners got tired of Reconstruction. What happened to the **Civil Rights Act of 1875**?'),
            ('THE BANK', 'Describe the **Freedman\'s Savings Bank** and who saved there. Why did its failure hurt freed families so much?'),
            ('MISSISSIPPI, 1875', 'Explain the **Mississippi Plan**. What happened when **Governor Ames** asked for troops, and why did **Margaret Ann Caldwell** believe they killed her husband?'),
            ('TWO SETS OF RESULTS', 'Explain how the disputed **election of 1876** was settled. What was the understanding called the **Compromise of 1877**?'),
            ('VOTELESS', 'Identify **three ways** Southern states took the vote back without breaking the 15th Amendment. What happened to **Black voter registration in Louisiana**?'),
            ('A FEW ACRES', 'Draw a conclusion. Write one thesis sentence: **Reconstruction delivered** ___, never delivered ___, and gave protection only while ___.'),
        ],
        'terms': [
            ('terrorism', 'violence meant to frighten a whole group of people into giving up their rights'),
            ('Enforcement Acts', 'laws that made it a federal crime to use force to stop someone from voting'),
            ('habeas corpus', 'the right not to be held in jail without being charged with a crime'),
            ('Whiskey Ring', 'tax officials who let whiskey makers skip their taxes, in exchange for a cut'),
            ('Mississippi Plan', 'Democrats\' plan to win the 1875 election by any means necessary, with armed clubs at Republican meetings'),
            ('Redeemers', 'what the white Democrats who took over the South called themselves'),
            ('poll tax', 'a fee you had to pay to vote'),
            ('grandfather clause', 'an escape hatch: you could skip the voting rules if your grandfather had been able to vote'),
        ],
        'shuffle': [3, 7, 1, 5, 0, 6, 2, 4],
        'mc': [
            ('What happened after Grant used the **Enforcement Acts** in South Carolina in 1871?',
             ['The Klan, as an organization, was largely broken.', 'The Klan took over the state government.', 'Congress ended the Enforcement Acts.', 'Grant lost the next election.']),
            ('After **Colfax**, the Supreme Court said the **14th Amendment**:',
             ['let the army punish anyone in the South', 'only covers Northern states', 'did not apply to Louisiana', 'stops states, not private citizens, from denying equal protection']),
            ('What did the **Panic of 1873** lead to?',
             ['a war with Mexico', 'a depression that lasted for years', 'a new Freedmen\'s Bureau', 'the end of the Whiskey Ring']),
            ('When the **Freedman\'s Savings Bank** closed, how much of what depositors were owed was ever paid back?',
             ['all of it', 'about half', 'none of it', 'twice as much']),
            ('When **Ames** asked for troops, the answer quoting the President said the public was:',
             ['ready to send the army right away', 'waiting for Congress to decide', '"tired out with these annual autumnal outbreaks in the South"', 'unaware of what was happening in Mississippi']),
            ('The special **commission of 15 men** voted 8 to 7 and gave the disputed votes to:',
             ['Samuel Tilden', 'Rutherford B. Hayes', 'Ulysses S. Grant', 'the House of Representatives']),
            ('Louisiana had about **130,000 Black men registered** to vote in 1896. Eight years later it had about:',
             ['100,000', '50,000', '13,000', '1,300']),
        ],
        'key_mc': 'ADBBCBD',
    },
]

LETTERS = 'ABCDEFGH'


def rich(s):
    s = html.escape(s, quote=False)
    s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
    return s.replace('___', '<span class="blank"></span>')


CSS = """
@font-face { font-family: 'Archivo'; src: url('fonts/Archivo.woff2') format('woff2'); font-weight: 100 900; }
@page { size: letter; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Archivo', sans-serif; color: #111; font-size: 10.2pt; }
.page { width: 8.5in; height: 11in; padding: 0.42in 0.62in 0.3in; position: relative; page-break-after: always; overflow: hidden; }
.page:last-child { page-break-after: auto; }
.topbar { position: absolute; left: 0; right: 0; top: 0; height: 0.13in; background: #111; }
.kicker { font-weight: 800; font-size: 7.6pt; letter-spacing: 2.6pt; color: #555; margin-top: 0.05in; }
.title { font-weight: 900; font-size: 27pt; letter-spacing: -0.4pt; line-height: 1.02; margin-top: 2pt; }
.pill { display: inline-block; background: #111; color: #fff; font-weight: 800; font-size: 8.6pt; letter-spacing: 3.4pt; padding: 2.5pt 9pt 2.5pt 10pt; margin-top: 5pt; }
.credit { position: absolute; right: 0.62in; top: 0.5in; width: 0.62in; text-align: center; font-weight: 800; font-size: 5.6pt; letter-spacing: 0.9pt; line-height: 1.15; }
.credit .box { width: 0.48in; height: 0.48in; border: 1.6pt solid #111; margin: 3pt auto 0; }
.nameline { display: flex; align-items: flex-end; gap: 10pt; margin-top: 10pt; padding-bottom: 5pt; border-bottom: 2.4pt solid #111; font-weight: 800; font-size: 8.4pt; letter-spacing: 1.6pt; }
.nameline span.l { border-bottom: 0.8pt solid #111; height: 11pt; }
.directions { font-size: 8.6pt; color: #333; margin-top: 4pt; }
.q { display: flex; gap: 12pt; margin-top: 4.5pt; }
.q .num { font-weight: 900; font-size: 15pt; width: 16pt; line-height: 1.05; }
.q .body { flex: 1; line-height: 1.3; }
.q .ch { font-weight: 800; font-size: 6.8pt; letter-spacing: 2pt; color: #333; margin-right: 3pt; }
.q b { font-weight: 800; }
.lines { margin-top: 1pt; }
.lines div { border-bottom: 0.7pt solid #9a9a9a; height: 16pt; }
.blank { display: inline-block; width: 46pt; border-bottom: 1pt solid #111; height: 10pt; vertical-align: baseline; }
.p2head { display: flex; align-items: center; gap: 12pt; margin-top: 0.06in; }
.p2head .title { font-size: 21pt; margin-top: 0; }
.p2head .pill { margin-top: 2pt; }
.bar { background: #111; color: #fff; font-weight: 900; font-size: 11.6pt; letter-spacing: 2.6pt; padding: 3pt 10pt; margin-top: 11pt; }
.match { display: grid; grid-template-columns: 2.5in 1fr; column-gap: 0.2in; margin-top: 7pt; }
.match .terms div { height: 25pt; display: flex; align-items: center; gap: 6pt; font-weight: 800; font-size: 9.6pt; }
.match .terms .ln { width: 28pt; border-bottom: 0.9pt solid #111; height: 12pt; }
.match .terms .n { width: 18pt; text-align: right; }
.match .defs div { height: 25pt; display: flex; align-items: center; gap: 7pt; font-size: 9pt; line-height: 1.18; }
.match .defs .let { flex: none; width: 12pt; height: 12pt; border-radius: 6pt; background: #111; color: #fff; font-weight: 800; font-size: 7.2pt; display: flex; align-items: center; justify-content: center; }
.mc { margin-top: 8.5pt; }
.mc .stem { display: flex; gap: 8pt; font-weight: 600; line-height: 1.3; }
.mc .stem .num { font-weight: 900; font-size: 13.5pt; width: 21pt; line-height: 1; }
.mc .stem b { font-weight: 800; }
.mc .opts { display: grid; grid-template-columns: 1fr 1fr; column-gap: 12pt; row-gap: 1.5pt; margin: 3pt 0 0 29pt; font-size: 9pt; }
.mc .opts b { font-weight: 800; margin-right: 3pt; }
"""


def page1(g):
    qs = []
    for i, (ch, q) in enumerate(g['questions'], 1):
        qs.append(f'<div class="q"><div class="num">{i}</div><div class="body"><span class="ch">{html.escape(ch)} ·</span> {rich(q)}'
                  f'<div class="lines"><div></div><div></div></div></div></div>')
    return f"""<section class="page"><div class="topbar"></div>
<div class="credit">TEACHER<br>CREDIT<div class="box"></div></div>
<div class="kicker">{html.escape(g['kicker'])}</div>
<div class="title">RECONSTRUCTION VIDEO {g['n']}</div>
<div class="pill">VIEWING GUIDE</div>
<div class="nameline">NAME <span class="l" style="flex:2.4"></span> PERIOD <span class="l" style="flex:0.7"></span> DATE <span class="l" style="flex:1"></span></div>
<div class="directions">Watch the video and answer each question in your own words, in the order you hear it. Page 2 is matching and multiple choice.</div>
{''.join(qs)}
</section>"""


def page2(g):
    nq = len(g['questions'])
    sh = g['shuffle']              # sh[k] = which term's definition sits at letter k
    terms = ''.join(f'<div><span class="ln"></span><span class="n">{nq + 1 + i}.</span>{html.escape(t)}</div>' for i, (t, _) in enumerate(g['terms']))
    defs = ''.join(f'<div><span class="let">{LETTERS[k]}</span><span>{html.escape(g["terms"][sh[k]][1])}</span></div>' for k in range(len(sh)))
    mcs = []
    for i, (stem, opts) in enumerate(g['mc']):
        n = nq + len(g['terms']) + 1 + i
        o = ''.join(f'<div><b>{"ABCD"[j]}.</b>{html.escape(x)}</div>' for j, x in enumerate(opts))
        mcs.append(f'<div class="mc"><div class="stem"><span class="num">{n}</span><span>{rich(stem)}</span></div><div class="opts">{o}</div></div>')
    return f"""<section class="page"><div class="topbar"></div>
<div class="p2head"><div class="title">RECONSTRUCTION VIDEO {g['n']}</div><div class="pill">VIEWING GUIDE · PAGE 2</div></div>
<div class="nameline">NAME <span class="l" style="flex:2.4"></span> PERIOD <span class="l" style="flex:0.7"></span> DATE <span class="l" style="flex:1"></span></div>
<div class="bar">PART A · MATCH THE TERM</div>
<div class="directions">Write the letter of the best definition on the line. The terms are in the order they appear in the video.</div>
<div class="match"><div class="terms">{terms}</div><div class="defs">{defs}</div></div>
<div class="bar">PART B · MULTIPLE CHOICE</div>
<div class="directions">Circle the best answer. The questions are in video order.</div>
{''.join(mcs)}
</section>"""


def key(g):
    nq = len(g['questions'])
    inv = {t: k for k, t in enumerate(g['shuffle'])}
    a = [f'{nq + 1 + i}. {LETTERS[inv[i]]}' for i in range(len(g['terms']))]
    b = [f'{nq + len(g["terms"]) + 1 + i}. {c}' for i, c in enumerate(g['key_mc'])]
    return a, b


def main():
    keys = []
    for g in GUIDES:
        assert sorted(g['shuffle']) == list(range(len(g['terms'])))
        assert len(g['key_mc']) == len(g['mc'])
        doc = f'<!doctype html><html><head><meta charset="utf-8"><title>Reconstruction Video {g["n"]} viewing guide</title><style>{CSS}</style></head><body>{page1(g)}{page2(g)}</body></html>'
        base = os.path.join(HERE, f'Reconstruction_Video_{g["n"]}_viewing_guide')
        open(base + '.html', 'w').write(doc)
        subprocess.run([CHROME, '--headless', '--no-sandbox', '--disable-gpu', '--no-pdf-header-footer', f'--print-to-pdf={base}.pdf', 'file://' + base + '.html'],
                       check=True, capture_output=True)
        a, b = key(g)
        keys.append(f'Video {g["n"]}  Part A: {", ".join(a)}\n         Part B: {", ".join(b)}')
        print('wrote', base + '.pdf')
    open(os.path.join(HERE, 'answer_key_matching_and_mc.txt'), 'w').write('\n'.join(keys) + '\n')
    print('\n'.join(keys))


if __name__ == '__main__':
    main()
