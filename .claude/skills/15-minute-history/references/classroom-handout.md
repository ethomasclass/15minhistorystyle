# Classroom note-taking handout

The user teaches with these videos. When they ask for a handout, viewing guide or questions to go with a video,
make a **simple** note-taking guide students fill in while they watch.

## What it is

- **10–12 numbered questions**, one or two sentences each, in the exact order of the video.
- Each starts with a **time stamp** (where the answer starts, from the chapter start times) and a **bold task
  verb**: Explain, Describe, Identify, Define, Compare, Draw a conclusion.
- **Use the video's own wording** for terms and quotes, so students can match what they hear.
- A name line and one line of directions at the top. That's all.

The first draft for *King Andrew* had fill-in blanks, writing lines, section headings, "big idea" tags and a
chart, and the user said: "no, way more simple. Like just the main concepts. Explain, describe, identify, etc."
Start simple. Add blanks, answer lines, an answer key or a graph only if the user asks.

## Covering what the teacher needs

- The user often gives a list of required concepts (sometimes with sub-points and "these three matter most").
  Cover every one, merging two into one question when needed to stay at 12 and keep video order. Don't add
  tag systems or extra sections to show the weighting; let the last question do the synthesis.
- The last question can ask students to **draw a conclusion** across the video (e.g. from three short headlines
  about events in the video). Label headlines like that as written for the activity, not real newspaper
  headlines.
- **Say when a question uses a fact the video doesn't state.** If the teacher's list includes something the
  narration leaves out (a name, a distance, a number), put it in the question as a given, and tell the user which
  ones you added. On *King Andrew*: Marcy's name for the spoils quote, and the Trail of Tears' 1,200 miles.
- If a question points at an on-screen graphic ("the graph"), check the video actually shows it at that time.

## Format

Make it a document the user can edit and print: a Claude doc if a docs connector is available (one short
document, no tabs), otherwise a `.docx` or Markdown file in `review/`. Example question style:

```
1. (2:45) Explain how Jackson lost the Election of 1824. He won the most popular and electoral votes, so why did
   the House pick the winner? Why did Jackson call it the "Corrupt Bargain"?
2. (4:10) Define expanding suffrage. What rule did most states drop by 1828, and who could vote as a result?
...
12. (14:01) Draw a conclusion. Read the headlines below. What do they show about how Jackson expanded the power of
    the president, and why did his opponents call him "King Andrew"?
    - JACKSON REPLACES OFFICEHOLDERS WITH LOYAL SUPPORTERS
    - JACKSON VETOES BANK RECHARTER
    - SUPREME COURT SIDES WITH CHEROKEE; JACKSON LETS GEORGIA IGNORE IT
```

Offer an answer key in one line at the end of your reply rather than building one unasked.

## Viewing guide built from a lesson card (from *The Exact Spot*)

When the user gives a lesson card (an image of the day's required content) and asks for a worksheet to fill in **while
watching**, this format worked:

- **True/false and short answer only.** No essays; a few words per answer.
- **20 questions at most** (the first draft had more and the user asked to pare it down), plus one warm-up blank.
- **The video's exact wording**: blanks are words the narrator says ("one of the most ______ ever waged by a stronger
  against a weaker nation"), and true/false statements reuse its phrasing, with false ones changed in one clear detail.
- **No date questions.** Dates aren't important to this teacher.
- A **time stamp** on each, in video order, grouped into parts that match the card's sections so every required point is
  covered. A few **ASK** questions (the card's discussion questions) and **Define** questions for its vocabulary.
- A **Teacher Key** in a second tab of the same Claude Doc: each answer in the narration's own words, with any
  "also accept" alternatives.

The example is `examples/08_Exact_Spot/Exact_Spot_viewing_guide.md` and `Exact_Spot_teacher_key.md`. Check every time
stamp against the master (chapter start + the word's time in the chapter's `words.json`).
