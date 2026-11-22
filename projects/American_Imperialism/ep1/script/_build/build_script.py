import re, os
CH = [
("ch01_the_locked_room", "The Locked Room", 185, """[quiet] The Queen of Hawaiʻi is a prisoner in her own palace.

It's 1895. There's an armed guard outside her door. From her window, she can see the city she used to rule.

And the men who put her here aren't a foreign army. They're mostly Americans. Or the sons of Americans."""),

("ch02_the_question", "The Question", 185, """[curious] So here's the question. How does a country that was born breaking away from a king end up locking a queen in her own palace?

It didn't happen in a day. It happened through a pitch: four arguments for why America should reach beyond its own shores. [wry] Some of them still sound pretty convincing. Which is exactly the problem.

We'll come back to this room. But first, a phrase from 1776. America told the world that a government gets its power from "the consent of the governed." [beat] Hold on to that. It's coming back."""),

("ch03_the_old_guard", "The Old Guard", 185, """For most of the 1800s, America had a simple rule for the rest of the world: stay out of it.

That's called {isolationism}: staying out of other countries' wars and alliances. Thomas Jefferson put it in his first speech as president, in 1801: "entangling alliances with none." [wry] In other words: we are not joining your group project.

America did grow. It just grew across its own continent. In 1867 it bought Alaska from Russia for $7.2 million. That's less than two cents an acre. Critics called it "Seward's Folly," after the Secretary of State who made the deal. [dryly] It got a pretty cold reception. Then people found gold up there. Folly status: revoked.

Then, in 1890, the census announced that "there can hardly be said to be a frontier line" anymore. [beat] The continent was officially full. Please try again later.

[curious] So where next?"""),

("ch04_the_pitch_meeting", "The Pitch Meeting", 185, """By the 1890s, a lot of powerful Americans thought it was time to stop staying out of it.

Think of it as a pitch meeting. The investor is a whole country. [wry] And the product is other people's countries.

Two words before we start. {Imperialism}: a strong country taking control of weaker places, either by owning them outright or by running them from the outside. And {interventionism}: stepping into other countries' affairs to protect your own interests. The model everybody had in mind was the biggest empire on earth: Britain's. [wry] And the pitch was basically: we could totally do this.

Four pitchers. Here's the first.

*The Businessman.* America's farms and factories were making more than Americans could buy. More wheat, more cotton, more steel. And when there's too much of something, prices fall. [wry] America had a classic problem: too much stuff. Anyone who has seen a garage knows it's still a classic problem. The answer, said the Businessman, was new customers overseas. Anywhere with people and money.

*The Admiral.* His name was Alfred Thayer Mahan, a navy captain, and in 1890 he wrote a book about how Britain got so powerful. His answer: Britain ruled the world because it ruled the sea. And a navy needs more than ships. Steamships burned coal, and they burned through it fast. Picture a road trip where every gas station is in somebody else's country. So you need bases and coaling stations, scattered across the ocean. Mahan wrote that "it is equally vain to acquire distant coaling stations without maintaining a powerful navy." You need both. [dryly] His argument held water. Sorry. Meanwhile, Britain, France and Germany were grabbing colonies all over the world, and a lot of Americans did not want to be left out.

And here's the thing about the Pacific. It's enormous. And right in the middle of it sat one of the best harbors anywhere. [beat] It belonged to a queen.

*The Preacher.* Josiah Strong was a Protestant minister, and in 1885 he wrote a bestseller called *Our Country*. His pitch: America had been given Christianity and civilization, and it owed them to the world. In Hawaiʻi, missionaries had been arriving since 1820.

*The "Scientist."* A British writer named Herbert Spencer took Charles Darwin's ideas about plants and animals and coined a phrase: "survival of the fittest." People started applying it to nations and races. Strong peoples, they said, were meant to rule weaker ones. It's called {Social Darwinism}. It sounded like science. [firmly] It wasn't. It was opinions wearing a lab coat.

And here's the strange part. The Preacher and the Scientist were often the same man. Josiah Strong's own book looked forward to "the final competition of races, for which the Anglo-Saxon is being schooled."

[dryly] So much for staying out of it."""),

("ch05_the_same_islands", "The Same Islands", 185, """Four pitches. Four different reasons. [beat] Markets? Hawaiʻi's sugar already sold almost entirely to America. A navy base? The best harbor in the Pacific. Missionaries? Three generations of them. And the "science" told them they had every right.

[wry] It's like four people arguing about where to eat, and every single one of them names the same restaurant."""),

("ch06_the_heist", "The Heist", 185, """In 1875, a trade deal let Hawaiian sugar into America with no tax at all. Plantations boomed, and the men who owned them got very rich. Many of them were the sons and grandsons of those missionaries. [wry] Their parents came to do good. They stayed to do well.

In 1887 the deal was renewed, and this time the U.S. got something extra: the right to use a harbor called Pearl Harbor. That same year, a group of armed planters forced the king to sign a new constitution. It took away most of his power, and most Native Hawaiians' right to vote. People called it the Bayonet Constitution, [dryly] which tells you everything about how the negotiations went.

Then, in 1890, the McKinley Tariff let all foreign sugar in tax-free, and paid American growers a bonus on top. Overnight, Hawaiian sugar went from VIP to standing in line with everybody else. The planters' fastest way back in? Make Hawaiʻi part of America.

In 1891, a new ruler took the throne: Liliʻuokalani, the king's sister. She wanted a new constitution that gave power back to her people. For the planters, that was the last straw.

In January 1893, they made their move. They called themselves the Committee of Safety. [wry] Bold name for a group planning to overthrow a government. That's a {coup}: a small group seizing a government by force. And the American minister in Honolulu, John Stevens, ordered sailors and Marines ashore from the warship USS *Boston*.

The Queen would not start a war with the United States. She stepped aside, in writing, and under protest: "I yield to the superior force of the United States of America."

The new government's president was a lawyer named Sanford Dole. [beat] Yes. Dole. If that name rings a bell, hold that thought.

On February 1st, Stevens raised the American flag and declared Hawaiʻi a {protectorate}: a place under America's protection. [wry] Whether Hawaiʻi wanted protecting was not on the agenda.

The planters told it differently. The Queen, they said, was the one breaking the law, and if America didn't take Hawaiʻi, Britain or Japan would.

In Washington, a new president, Grover Cleveland, sent an investigator to find out what happened. Then he told Congress the overthrow was an "act of war, committed with the participation of a diplomatic representative of the United States and without authority of Congress." He called it a "substantial wrong," and he asked for the Queen to be put back on her throne.

Dole's answer, more or less: no thanks. [wry] It turns out it's hard to give back a government when the other guy has the keys and the guards.

On July 4th, 1894, Dole's government declared itself the Republic of Hawaii. [dryly] The date was not an accident. A few years later his cousin James arrived and started growing pineapples. His company is why the name Dole is on pineapple cans today. [wry] Sanford kept the government. His cousin got the fruit. Talk about a sweet deal.

What the planters wanted was {annexation}: one country officially adding another place to itself. But their treaty kept stalling in the Senate. [beat] Partly because of a stack of paper."""),

("ch07_he_has_we_have", "He Has, We Have", 185, """[slower] Remember the Declaration of Independence? Its list of complaints against King George the Third includes this one: "For taking away our Charters, abolishing our most valuable Laws, and altering fundamentally the Forms of our Governments."

That was what a king did to America. [beat] In Hawaiʻi, Americans did it to a queen."""),

("ch08_under_protest", "Under Protest", 168, """[quiet] In January 1895, the Queen's supporters tried to put her back in power. They failed. She was arrested and brought here, to this room.

A week later, as a prisoner, she signed away her throne. Then a court sentenced her to "a fine of $5,000, and imprisonment at hard labor for five years." She later put it simply: "My palace was my prison."

She was released after about eight months. And she kept fighting, with words. In 1897, Native Hawaiians signed petitions against annexation. One petition alone gathered 21,269 names, on 556 pages. The treaty never got the votes it needed.

In 1898, she published a book, and she wrote to Americans directly.

"Oh, honest Americans, as Christians hear me for my down-trodden people! Their form of government is as dear to them as yours is precious to you. Quite as warmly as you love your country, so they love theirs."

[pause] On July 7th, 1898, Congress annexed Hawaiʻi anyway. Not with a treaty, which needed two-thirds of the Senate, but with a simple majority vote in both houses. The country was at war with Spain, and suddenly a navy base in the middle of the Pacific looked very useful."""),

("ch09_back_to_the_question", "Back to the Question", 185, """[thoughtful] So let's go back to the question. How does a country born breaking away from a king end up locking a queen in her own palace?

With a pitch. Businessmen wanted markets, admirals wanted bases, preachers wanted converts, and a fake science said they deserved to win. All four pointed at the same islands. When a small group of Americans took them, the United States stood by, then admitted it was wrong, then took the islands anyway.

And the harbor the Admiral wanted? It became a naval base. Forty-three years later, its name would be the most famous in American military history: Pearl Harbor. That's what people mean when they say a country "projects its power."

In 1993, a hundred years after the overthrow, Congress formally apologized to Native Hawaiians.

So can a republic born fighting an empire become one? [beat] It had taken a kingdom. It just wouldn't use the word.

[wry] And remember, Hawaiʻi only got annexed because America was suddenly at war. A war that started, depending on who you ask, with a ship that blew up in Havana. Or with a newspaper."""),
]

def words(t):
    t = re.sub(r'\[[^\]]*\]', '', t)
    return len(re.findall(r"[A-Za-z0-9$ʻ'’.,]+", t.replace('{','').replace('}','').replace('*','')))

total, t_sec, rows, body = 0, 0.0, [], ''
for i, (slug, title, wpm, txt) in enumerate(CH, 1):
    open(f'{slug}.txt', 'w').write(txt.strip() + '\n')
    n = words(txt); sec = n / wpm * 60 + 2.0
    mm = f'{int(t_sec // 60)}:{int(t_sec % 60):02d}'
    rows.append(f'| {i} | {mm} | {title} | {n} | {sec:.0f} s |')
    body += f'## {mm} | {title}\n\n`{slug}.txt` · {n} words · about {sec:.0f} s\n\n{txt.strip()}\n\n---\n\n'
    total += n; t_sec += sec
mm = f'{int(t_sec // 60)}:{int(t_sec % 60):02d}'
head = open('/tmp/claude-0/-home-user-15minhistorystyle/a687a3e2-9d61-5aa4-8eb9-6dddecba1f82/scratchpad/head.md').read()
head = head.replace('{TOTAL}', str(total)).replace('{NARR}', mm).replace('{ROWS}', '\n'.join(rows))
tail = open('/tmp/claude-0/-home-user-15minhistorystyle/a687a3e2-9d61-5aa4-8eb9-6dddecba1f82/scratchpad/tail.md').read()
out = head + body + tail
assert '—' not in out and '–' not in out, 'dash'
open('SCRIPT.md', 'w').write(out)
print(total, mm); print('\n'.join(rows))
