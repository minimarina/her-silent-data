# SPEC — Women's Data Gap (working name)

Version: 0.6 (intake pipeline built; nothing invented and stored)
Event: Elevate Women Global Hackathon 2026
Submission deadline: Sep 20, 23:59 Lisbon = **Sep 20, 15:59 PDT**

---

## 1. Purpose

A researcher wants to help close the data gap on women, but doesn't know
which data to collect first. The app shows, for a specific problem, which
data is missing and which women it should come from.

**Positioning:** research intelligence for the gender data gap.

This is the *positioning* line — what the product is, for a write-up or a
pitch. It is deliberately no longer the on-screen tagline. In the header
it sat directly under the name and said "data gap" twice in two lines,
restating the brand instead of adding to it, and it left the lede to
carry the audience, where it landed as a category label straight after
the hero's claim and deflated it. The header now reads **"For researchers
in women's health"**, the `<title>` and the meta description match it, and
the lede answers the hero instead of introducing the product a second
time. Four lines, one job each: name, audience, claim, answer.

**One-sentence problem statement:**
Researchers who want to close the gender data gap don't know which data is
missing most, or which women it has to come from.

**Core problem being addressed:**
The gender data gap — medical and social research often lacks specific,
diverse, high-quality data representative of the global female population.
The gap is historical and structural, so it does not close on its own: it
closes only when individual studies are designed to fill named holes.

**What the platform does about it:** it turns "there is a gap" into a
study someone can design. It records where female health and social data
has been named as missing, checks whether it has been collected since,
and — on request — drafts the data points a new study would need. The
record is borrowed and cited; the draft is generated, labelled, and kept
out of the record (§5a, §11).

## 2. Users

| User | Priority | Need |
|---|---|---|
| Researcher working on female-centric problems | Primary (built now) | "What data should I collect, and from whom?" |
| Woman affected by a problem | Secondary (not built now) | "Is anyone studying my problem? Can I help?" |

The primary user is a researcher already committed to women's health or
women's social issues. The app does not have to sell her the problem —
she needs the *specifics*. Write every screen for someone who knows the
field and is short on time.

## 3. Demo moment (the one thing that must work)

1. Researcher opens the app and sees the body map.
2. She opens an area, and sees the problems in it.
3. She opens one problem, and sees the data needed to solve it, marked
   **collected / partial / missing**.
4. On the same screen she sees **what the source said, when it said it,
   and when the platform last checked whether the data exists now**.
5. She presses **Show research design** and watches a possible study
   design appear — which women, what to find out from them, in which
   breakdowns, in what form — labelled AI-generated and unverified.

Everything else is secondary to this flow.

## 4. The four questions (per problem)

1. What problem do women face?
2. What data is needed to solve it?
3. Has that data already been collected?
4. If not: which women should it come from, what should be found out
   from them, in which breakdowns, and in what form does it come back?

## 5. Data model

Stored as one local seed file, `data.js`, holding a single JSON-shaped
object (see §13 for why it is `.js` and not `.json`). No database.

**Problem**
- `id`
- `title`
- `summary` (1–3 sentences)
- `area` (e.g. menopause, maternal health)
- `affected_women` (short description)
- `source` (URL, or `"demo"` while the record is a placeholder)
- `origin`: `sourced` | `proposed` | `null` — see §5a
- `is_demo` (true/false)

**DataNeed** (belongs to one Problem; 2–5 per problem)
- `id`
- `problem_id`
- `description` (what data)
- `why_it_matters` (1 sentence: how it helps solve the problem)
- `status`: `collected` | `partial` | `missing`
- `existing_data_note` (for collected/partial: what exists and its limits)
- `gap_evidence` (optional; for partial/missing) —
  `{ source, note, region, claimed_date }`. Who established that this data
  is missing, for which population, and **when**. `claimed_date` exists
  because a gap named years ago may have been filled since; the intake
  run rejects a claim older than the window in `intake/lib.mjs`.
- `dataset_source` (optional; for collected/partial) — `{ source, note }`.
  Where the data that *does* exist lives, and what its coverage limit is.
- `verification` — `{ checked_at, method, findings, sources }`. The
  record of a search for data collected since `claimed_date`. Every
  record carries one; the validator rejects a record nobody checked.
- `collection_guidance` — `{ note, source }` **or `null`**. Present only
  where the source itself said how and from whom to collect. `null` is
  the normal case. See §5a.

`gap_evidence` and `dataset_source` are the two halves of provenance, and
a need's status decides which one carries the weight. A `collected` need
cannot cite an absence and a `missing` need cannot link to data that does
not exist; a `partial` need has both. Either may be empty, and the screen
says so rather than leaving a blank.

**ResearchDesign** — *not part of a record.* Generated per data need,
kept in `research-designs.js`, loaded by its own `<script>` tag, and
never merged into `data.js`. The app works fully with the file absent.
Revealed only when a researcher presses **Show research design**, and
labelled *AI-generated study design — unverified* with its date.

This entity was once `CollectionRequest` and lived inside the record.
Moving it out is the rule the register rests on: **nothing is invented
and stored.** A generated design is an answer to a question, so it can
never be mistaken for something an authority said.

- `data_need_id` (the key it is stored under)
- `target_women` (who is studied: age range, region, life stage, condition)
- `variables` (list) — what to find out from them. The list a researcher
  carries into a study design; this is the answer §4 question 4 exists for.
- `stratifiers` (list) — the breakdowns the analysis needs (age band,
  parity, stage, region, comorbidity, socioeconomic status). Kept separate
  from `target_women` deliberately: see below.
- `form` (e.g. 10-question online questionnaire, 3-month daily log) —
  absorbs delivery as well as format. "How it is asked" and "what shape it
  comes back in" are one answer, and splitting them broke §8.3.
- `instrument_source` (optional) — where `form` names a published
  instrument, the instrument. A URL where the model returns one; far more
  often it returns the instrument's **name** ("Lake Louise AMS Score",
  "DN4", "ICIQ-UI SF"). Both are shown — a name is printed, a URL is
  linked. Gating the field on "is this a URL" silently threw the answer
  away on seven of eleven designs, which is the one place the
  instruments-over-invented-forms rule in §5a is visible to a reader.

**Why `stratifiers` is its own field.** The gender data gap is not only
missing studies, it is missing *breakdowns* — data collected without the
variables that would make women visible inside it (§11). Holding the
breakdowns as prose inside `target_women` would make the platform's
central claim the one thing on the card that cannot be compared between
records, or shown to be absent. A generated design (§11) fills the same
field, which is why the shape is worth keeping even though the design
itself no longer lives inside the record.

## 5a. Where a gap claim comes from

The app makes a claim most tools do not: that data is *missing*. Absence
needs different evidence from presence, so every problem declares which
of two kinds it is, and the app shows that on every screen.

**`sourced`.** An authority has already published the request — a James
Lind Alliance Top 10, a NICE research recommendation, a Cochrane
"implications for research". `gap_evidence` on each data need cites it.
The gap is borrowed and attributed.

**`proposed`.** The problem is documented, but nobody has specified which
data would close it. The data needs are this platform's hypothesis and
are labelled as one.

**`null`.** Not yet assessed. While `is_demo` is true the record is a
placeholder and its origin is not a claim worth making.

`origin` and `is_demo` are different claims and both stay. `is_demo`
means "placeholder content"; `origin` means "who identified the gap".

**Nothing is invented and stored.** This replaces the earlier rule, under
which §4 question 4 — which women to study, what to find out from them,
in what form — was the platform's own specification written into every
record and labelled unverified.

It no longer is, anywhere in the seed: the records written under the old
rule were removed on 18 Sep (§9). A record carries what its source said
and nothing more.
Where the source itself specified population or method, that is recorded
as `collection_guidance`, because it is sourced; otherwise the field is
`null`, and `null` is the normal case. The validator rejects a guidance
block with no source URL, so the rule is enforced in code rather than
promised in prose.

The answer to question 4 is still offered — generated on request as a
**ResearchDesign** (§5), kept outside the register, and labelled
AI-generated. Generation moved out of storage and into the request, which
is what makes it impossible to mistake for data.

**Every record carries a check.** A gap claim is a statement about a
moment in time, so `gap_evidence.claimed_date` records when it was made
and `verification.checked_at` records when the platform last searched for
data collected since. Finding data does not discard the record: the
status becomes `partial` or `collected` and the card says where the data
is, which is more useful than silence.

**No search proves a negative.** A `missing` record asserts that a search
of published sources found nothing — never that the data does not exist.
Unpublished registries, national statistics, industry cohorts and data
behind access agreements are invisible to it, and every affected card
says so and invites a correction.

**Sourcing one problem at a time.** The seed may be half swapped. Every
screen is computed from the records rather than asserted, so the demo
banner counts placeholders instead of claiming all records are demo, and
disappears when the last one is replaced.

**Instruments over invented forms.** Where a validated instrument exists
for a `form` — WERF EPHect's EPQ-S, a standard time-use diary, the same
screening tool repeated at a later interval — cite and link it rather
than inventing a questionnaire.

## 6. Screens

**The masthead is the way home, from everywhere.** The site name and
tagline are one button that shows Screen 1, on every screen including
Screen 1 itself. A reader expects a masthead to do this and the app did
not, which left the record reachable only by two Backs. It uses the same
`[data-goto]` wiring as the About link — one navigation idea, not two —
and it is a real `<button>`, so Enter and Space arrive for free.

Its accessible name is *"Women's Data Gap — back to the map"* rather than
the two lines read out in sequence: a link should say where it goes, and
the tagline read aloud after the name is a slogan, not a destination. The
focus ring is the teal ring on a white backing that the About link
already uses, because teal alone holds 2.3:1 on `navy-deep`, under the
3:1 non-text floor (§8.2).

**Screen 1 — Home: the body map, and nothing else**

The gap as a picture, the totals in words, and the figure. No list. Every
figure on the screen is computed from the seed, never written here.

- A hero line, and a counts strip over the whole seed: how many data
  needs exist, and how many are missing, partial and collected. Its bar
  separates its segments by a 2px gap, as the map's marker bars do: clay
  and amber butted together read as one bar with a smudge in it, and the
  boundary is the only thing the bar exists to show. A status with no
  records renders no segment, so a gap never appears with nothing beside
  it.
- A female silhouette with one marker per AREA (§7.6), each carrying the
  area name, its "X of Y data needs missing" sentence and a three-part
  status bar.
- One line of prose, under the figure: *select an area to see its
  problems.* The map is the only route in, so it has to say so once.
- Banner: shown only while placeholder records exist, and it counts them.
  With the seed fully sourced it does not render.

**The list moved off this screen entirely, on 18 Sep.** It used to sit
under the figure, grouped by area, and a pin scrolled to the matching
heading. Eleven cards made the home screen 4,552 characters long and
6,348px tall to say eleven titles and eleven statuses; it is now 565
characters and 1,378px. The home screen's job is to be understood in one
look, and it now is one.

**Screen 1a — one area's problems**

A pin opens the area it stands for. The pin never opens a *problem* — an
area can hold several, it would have to pick, and picking would hide the
rest — so what it opens is the level between the map and the record.

- The area name as the heading, with its kind above it: *area of the
  body*, or *whole body — not located in one place* for a systemic area
  (§7.6).
- The same gap sentence the pin carries, computed by the same function,
  so the two cannot disagree.
- One card per problem, carrying **two things**: the title, and the gap
  indicator. That is what a reader needs to decide which to open.
- Origin badge **only where the origin is an exception** — a placeholder,
  a gap this platform proposed, an origin nobody has assessed.
- Back returns to the map.

**Three levels, each saying only what is needed to choose the next.** The
map says where the gaps are; the area says which problems sit in one
place; the record says everything. Returning from a record goes back to
the area it was opened from, not to whichever area was rendered last.

**What the card deliberately does not carry.** The affected-women
sentence, the source line and a "Published research request" badge used
to sit on every one of eleven cards, which made the home screen 4,552
characters long and 6,348px tall to say eleven titles and eleven
statuses. All three are on the record itself, one click away.

This is not a retreat from §8.1. That rule asks that every claim show
where it came from, and the claim is the record — Screen 2,
where the source is a **link a researcher can follow**. On a card it could
only ever be printed, never linked, because a link may not be nested
inside a button, so it was non-actionable text duplicating the screen
behind it. The aggregate claim is made once, in the footer: *every record
is sourced from published research.*

The origin badge follows the same logic in reverse. Every record in the
seed is `sourced`, so a badge on each card said the same thing eleven
times and distinguished nothing. What a reader must be warned about is
the record that is *not* sourced, and that one still carries its badge —
verified by flipping a record to `is_demo` and watching exactly one
badge, the banner and the footer sentence all change together.

**Screen 2 — Problem detail**
- Problem title, summary, affected women (question 1).
- Origin badge and the problem's source link.
- List of data needs (question 2) with status badge (question 3).
- Each missing or partial need carries its gap evidence: who established
  that the data is missing, with the coverage region. Where nothing does,
  the need says the assessment is this platform's own.
- Each collected or partial need carries its dataset pointer: where the
  data that does exist lives, and what its coverage limit is.
- Missing/partial items are visually distinct and clickable.

**Screen 2 carries the data need in full. There is no Screen 3.**

Each data need renders as a block on the record: status badge, the need
itself as a heading, why it matters, who says it is missing, what the
check found, the limit of that check or the dataset that exists, what the
source said about collecting it, and the generated design behind its
button. Several needs stack as blocks.

Until 18 Sep this was a screen of its own, reached by clicking a summary
in a list on Screen 2. Every problem in the seed carries exactly one data
need, so that list was a list of one, and opening it showed the reader
the expanded form of the thing they had just clicked — a level with
nothing in it. Reading three needs in a row is also less work than
opening and closing three screens, so the shape holds if a problem ever
carries several (§5).

This is still the climax of the demo and gets the most visual care; it is
now the bottom of the tree rather than one level above it.

**The check is summarised, not dumped.** The verify step writes 150 words
and more. The first sentences carry the verdict and the rest sits behind
*Show the full check*, a disclosure with `aria-expanded`. This is not a
breach of §8.1: that rule is about never hiding what the platform knows,
and nothing here is removed or truncated on the record — it is one
keystroke away, and the alternative is a paragraph nobody finishes on the
one screen that has to land.

**The design can be carried out of the app.** *Copy this design* puts the
whole thing on the clipboard as plain text: the design, the data need, the
gap claim, its source and date, what the check found, and the
AI-generated-and-unverified label. Plain text because the destination is a
protocol document or an email.

The provenance travels with it deliberately. A design pasted without the
claim it answers is orphaned model output, which is the exact thing §5a
exists to prevent — the rule cannot stop at the edge of the screen. This
is also the cheapest thing the register can do for stage 3 of the loop
(§6, Screen 4): the platform ends where study design begins, and until now
it ended by asking the reader to retype it.

**Screen 4 — About**

Reached only from a link in the site header, and it returns to the home
screen. **It never precedes the map.** §3 and criterion 10 hold because
the first thing seen is still the body map; a header link and a back
route to home are what keep that true. The screen reads nothing from
`data.js` and cannot break the demo.

- Block 1, the main content: how the whole system works. Five stages, of
  which this platform is stage 2, drawn as a loop — the arrow from stage
  5 back to stage 2 is the point of the diagram, not decoration.
- Each stage carries **Built** or **Planned**, from `BUILD_STATUS`.
- Stage 1 expands, in place, to the seven-step intake pipeline (discover,
  filter, extract, verify, design, validate, review) and the rule that
  pipeline exists to protect: AI finds, extracts and checks, and never
  makes the gap claim. A disclosure with `aria-expanded`, not a fifth
  screen. Criterion 29 counts the same seven.
- Block 2: who built it and how — author, stack and why no framework
  (§13), the two-tier provenance method (§5a), the §14 disclosures and
  the third-party asset credit (§7.6), and the repository link.

**The build labels live in one place.** `BUILD_STATUS` at the top of
`app.js` holds every Built/Planned string; the text list and the diagram
both read it, so they cannot contradict each other and flipping a part
that gets built is one edit. Nothing is labelled built unless it is in
this repository and running (§8.1).

**The two status vocabularies stay apart.** Built/Planned uses
`navy-deep` and `muted`, never the `collected`/`partial`/`missing`
colours: those mean the status of *data* everywhere else and must keep
meaning only that. Each carries its own word and its own border style as
well as its own colour (§8.2).

## 7. Design

**Vibe:** professional, empathetic, data-driven. Trust and scientific
rigour, not campaign material. A researcher should read it as a work
tool; a judge should read it as a credible product.

### 7.1 Palette

Soft teals and deep navy. Values are starting tokens, adjustable, but
every pair below must stay at or above the stated contrast.

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `navy-ink` | `#0B2545` | Body text, headings | 14:1 on white |
| `navy-deep` | `#13355C` | Header bar, chart axes | — |
| `teal-accent` | `#17726B` | Links, focus ring, primary action | 5.6:1 on white |
| `teal-soft` | `#E6F2F1` | Panel and row backgrounds | — |
| `surface` | `#FFFFFF` | Page background | — |
| `border` | `#D3DCE4` | Table rules, card edges | — |
| `muted` | `#53657A` | Captions, secondary labels | 5.9:1 on white |

Status colours — never the only signal (see §8.2):

| Status | Hex | Shape/label |
|---|---|---|
| `collected` | `#17726B` teal | filled square + word "Collected" |
| `partial` | `#8A5A00` amber | half square + word "Partial" |
| `missing` | `#A33A3F` clay | open square + word "Missing" |

No decorative gradients. No stock photography. No illustration filler.

### 7.2 Typography and space

- One clean sans throughout (system stack or a single loaded family —
  no second family for headings).
- Generous whitespace: the page should feel under-filled rather than
  packed. Minimum 24px between sections, 16px inside cards.
- Body text 16px minimum, line height 1.5+. Chart labels 12px minimum.
- Line length capped around 70 characters for prose blocks.

### 7.3 Motion

Restrained. Opacity and short transforms only, 150–200ms. No entrance
animations on data, no parallax, no counting-up numbers. Motion respects
`prefers-reduced-motion`.

### 7.4 No charts in v1

**Decided:** the platform does not hold enough data for a chart to say
anything true. 4–6 problems with a handful of data needs each is a
*list*, not a dataset. A chart over it would be decoration pretending to
be analysis — which contradicts §8.1.

What carries the screens instead: status badges, counts framed in words
("3 of 5 data needs missing"), and clean tabular layout.

Charts are reconsidered only when real sourced data replaces the demo
seed and there is enough of it to have a shape.

**Update, 15 Sep.** The first half of that condition is now met: the seed
is fully sourced. The second half is not, and the reasoning still holds
— five problems are not a dataset, and a chart of *findings* over them
would still be decoration pretending to be analysis.

But the seed now holds something the rule was never written about. 14
collection requests, roughly 70 variables, stratifiers, statuses,
coverage regions and sources are a **structure**, even though they are
not findings. A view of that structure — what is missing, across all
problems at once — would be an analytical instrument rather than
decoration, and would not breach §8.1. It is recorded in the product
backlog rather than built here. Still not this week.

**Update, 17 Sep.** That view now exists, and it is the body map
(§7.6). It is worth being exact about why it does not breach the rule
above: it plots *statuses*, which the seed really holds, and not
*findings*, which it does not. It asserts nothing about endometriosis —
only that two of the three things we would need to know about it have
never been collected. That is the structure this section said would be
an instrument rather than decoration.

The no-charts rule itself stands. There is still no chart in the app.

### 7.5 Responsive

Works from 360px to desktop. Single column on mobile; the matrix becomes
per-problem stacked bars. No horizontal scrolling on any screen except
inside a deliberately scrollable table.

**The home screen fits above the fold.** Its whole argument is that it can
be understood in one look, which is not true if the figure runs past the
bottom of the window. The map's height is capped against the viewport —
`min(560px, calc(100vh - 360px))`, with a 340px floor — so the figure, the
systemic pin and the hint stay on screen together. 360px is the measured
height of everything above and below it. The cap is desktop-only: on a
phone the map *is* the page and scrolling it is expected.

**The hint comes before the legend**, and is left-aligned like everything
else. Under it the legend is the control it refers to, and a reader who
meets an instruction below the list has already scrolled past the thing it
describes. Under 640px it gains a second clause — *the numbers on the
figure match the list below* — because that is the only width where the
pins carry numbers instead of labels, and nothing else says the two are
the same six areas.

**Touch targets are 44px.** WCAG 2.2 AA asks 24px and the pins rendered
33, but the pins are the only control on the home screen on a phone, and
both Apple and Android ask 44. Each marker carries an invisible hit circle
(`fill` a transparent colour, not `none`, which is not hit-tested); the
About link has a `min-height`.

Below 640px the map's side labels do not fit. They are dropped, the
markers carry numbers instead, and a numbered legend below the figure
carries the words — the same sentence, in the same order. The `viewBox`
crops to the ring at that width, because the wide frame is built around
the label columns and without them the figure renders about 90px across.

### 7.6 The body map

**Decided:** the home screen leads with a figure, because the platform's
claim is anatomical before it is statistical. A handful of red markers on
a body say in one glance what the card list takes a paragraph to say, and
the same image is what a judge meets as a thumbnail.

**One marker per AREA, not per problem.** An area holds however many
problems sit in it, and the marker's sentence and bar count every data
need across them: two problems in Maternal health are one pin reading
"2 of 2 data needs missing". Pinning problems instead produced two
markers labelled "Maternal health", which reads as a rendering fault
rather than as two different gaps.

Because a pin can stand for several problems, it cannot open one of them
— it would have to pick, and picking would hide the rest. Activating a
marker opens that AREA (Screen 1a), which is the thing the pin actually
stands for. Mouse and keyboard call the same function and end in the same
place.

Until 18 Sep this scrolled to a heading in a list below the figure, and
this section read *"the map is a second way into the list, never a
replacement for it."* That is now reversed: the map **is** the route, and
there is no list under it. The reason the old rule existed was that a
pin-only home could hide records — which is still true, and is handled
below rather than by keeping a list of all eleven on the front page.

**An area with no coordinate is listed, not dropped.** When the map was a
second route, an unpinned area still appeared in the list. Now the map is
the only route, so an unpinned area would be genuinely unreachable and
the app would silently hide records, which §8.1 forbids. Those areas
render under the figure at every width, under a line saying why. Empty
today, because all six areas are measured.

**Pin numbers count pins.** The numbers shown under 640px are the
position among *pinned* areas. They used to be the position among all
areas, so a single unpinned area would have made the pins count 1, 2, 4 —
invisible while every area has a coordinate, and wrong the moment one
does not.

**Site markers against ring markers is a claim, not styling.**
Cardiovascular, maternal, pelvic and reproductive gaps sit in one place
in the body. Pharmacology does not — drug metabolism is whole-body, so
its marker sits on a dashed ring around the figure rather than on it.
Putting a systemic condition on a single organ would be a false claim
made in pictures, which §8.1 forbids in words.

**The ring carried a caption, `WHOLE-BODY · NOT LOCATED IN ONE PLACE`,
until 18 Sep.** It was removed once a pin opened its area: the area
screen's first line now says *whole body — not located in one place*, so
the explanation reaches the reader who asked for it instead of sitting
under the figure permanently to account for one pin. The frame was
trimmed with it — `MAP_WIDE` from 672 to 650 and `MAP_NARROW` from 650 to
620 — because the caption's line was what the extra height was for, and
without it the figure sat 47px off centre.

**The figure is recognisably a woman's body, by proportion and not by
detail.** No face, no hair, no anatomical detail. The product's claim is
that women's bodies were studied as if they were men's; a deliberately
neutral figure would quietly repeat that.

**Marker coordinates are measured, not estimated.** The silhouette was
hit-tested with `isPointInFill()` across its height — waist at y 230,
hips at 300, legs separating at 310. Below 310 the centreline is the gap
between the legs, not the body, and a pelvic marker placed by eye lands
in it. Every site marker has its centre and all eight edge points inside
the fill; both ring markers are fully outside it. The coordinates live in
`app.js` as `MAP_POINTS`, keyed by area, and are valid only for the
transform in `index.html` — if that moves, re-measure. An area with no
entry lists without a pin, which is honest and visible; an entry no area
uses is deleted rather than kept.

**A pin is teal, and a pin is not a status.** Pins were clay — the colour
of `missing` — until 18 Sep. Two things were wrong with that. Dark red
dots clustered on a woman's torso read as bullet wounds, which is an
unfortunate picture for a product about women's health and was noticed
straight away by the first person to look at it. And the colour was
making a claim the pin does not make: a pin means "this area has data
needs, open it", it is a button, and four of the six areas are *Partly
covered* with no missing need at all — so the pin asserted in colour the
opposite of the sentence printed next to it. §6 says the status
vocabularies stay apart; the map was the one place they had not.

Pins are now `teal-accent`, the palette's interactive colour (§7.1), at
5.0:1 on the figure's `teal-soft` fill against a 3:1 non-text floor.
Status stays where it always lived on this screen: the three-part bar and
the sentence beside each label, which are the only things on the map still
allowed to use the three status colours.

**Nothing on the map is authored twice.** Labels and the counts strip are
computed from the same `countStatus()` and `gapSentence()` as the cards,
so the map cannot contradict the list below it (§12.16, §12.19).

**Third-party asset.** The silhouette is OpenClipart #71126, public
domain under CC0, pasted inline so the app still opens from `file://`
with no server. Recoloured; the path is otherwise unaltered. It is the
only third-party asset in the project — see README.

## 8. Design principles

Three principles, each with a concrete rule that can be checked.

### 8.1 Ethical transparency

- Placeholder data is labelled as such on every screen, not only on the
  first, and the label is computed from the records rather than asserted.
- Every claim shows where it came from. When sources replace demo data,
  the source link sits on the record, not in a footer.
- Anything generated by AI is labelled as a suggestion, never as a
  finding (see §11).
- The app states what it does not know. An empty field says "not
  established", never guesses.

### 8.2 Inclusive accessibility

- Text contrast 4.5:1 minimum, large text 3:1, non-text 3:1.
- Colour is never the only carrier of meaning — status also has a word
  and a shape.
- Every interactive element is keyboard reachable, in a sensible order,
  with a visible focus ring (`teal-accent`, 2px, never removed).
- Semantic HTML: headings in order, real buttons and links, alt text.
- `prefers-reduced-motion` honoured.

### 8.3 Data clarity and visualisation

- One idea per view. If a screen needs a paragraph to explain its chart,
  the chart is wrong.
- Numbers are always framed: "3 of 5 data needs missing", not "3".
- No chart junk: no 3D, no dual axes, no pie charts, no truncated axes.
- The data speaks; the design gets out of its way.

## 9. Seed data rules

**One generation, one shape.** Every record in `data.js` was produced by
`intake/run.mjs` and admitted by a person. `is_demo` is false throughout
and the demo banner does not render.

The five hand-sourced problems that seeded this project were **removed on
18 Sep**, with their 17 data needs. They predated the "nothing invented
and stored" rule (§5a) and carried `collection_request` blocks — this
platform's own specification of which women and which variables. They
could not be brought into the current shape: `claimed_date` cannot be
invented, and their sources predate the search window. Showing a reader
two generations of record, one carrying an unsourced specification and
one not, was the worse option. They are in the git history.

Rules that hold for every record:

- One data need per problem, as the intake run produces them.
- Every problem carries a real `source` URL and `origin: "sourced"`.
- Every data need carries `gap_evidence` with a `claimed_date`, and a
  `verification` block. The validator rejects a record without them.
- `collection_guidance` is sourced or `null`. `null` is the normal case.
- `is_demo` and the banner stay in the code. They cost nothing, and a
  future problem added faster than it can be sourced needs them.

**No record has `status: "collected"`.** A register of gaps that lists
data which exists is listing the wrong thing, so a `collected` verdict
from the verify step means the candidate is not a gap and is not merged.
The capability stays visible on `partial` records, which name the dataset
that does exist and say what it does not cover.

**There is no "every problem has a missing need" rule.** Six records are
`partial`: the verify step searched, found overlapping data, and said
what it does not cover. A rule requiring every problem to show a gap
would mean overriding a check that did its job.

The sixth arrived by re-check rather than by intake. The androgen record
was written `missing` on 18 Sep from a search that never ran — the model
reported its tools unavailable and answered from prior knowledge, and
nothing downstream could tell, because `search_outcome` is set by the
verify step and a merged record no longer carries the candidate that
would have failed. Re-run on the same day, the check completed and found
the gap partly filled. The record now carries `search_outcome:
"reviewed"`; the other ten predate the field and do not.

**Sources from the intake run.** Each is a systematic or narrative review
published within the last twelve months, found by searching for the
sentences a review writes when it looked and found nothing. Areas in
brackets are new to the map and have hand-measured coordinates.

| Record | Source | Status after the check |
|---|---|---|
| High-altitude cardiometabolic [Cardiovascular] | Int J Mol Sci review | partial |
| Androgens and drug metabolism [Pharmacology] | Expert Opin Drug Metab Toxicol | partial (re-checked 18 Sep) |
| Epilepsy and infertility treatment [Maternal] | Epilepsy & Behavior, systematic review | missing |
| Urinary incontinence decision aids [Pelvic health] | Urogynecology, systematic review | partial |
| Brucellosis in pregnancy [Maternal] | Rev Inst Med Trop São Paulo | missing |
| Pelvic neuropathies [Chronic pain] | Facts Views Vis Obgyn, narrative review | partial |
| Type 2B von Willebrand disease in pregnancy [Maternal] | ISTH SSC guidance | missing |
| Anterior compartment prolapse surgery [Pelvic health] | Cochrane review | missing |
| Remifentanil PCA in labour [Maternal] | Obstetric Anaesthetists Association guidance | missing |
| Advanced therapies in pregnancy [Pharmacology] | J Crohns Colitis / systematic review and meta-analysis | partial |
| Time-restricted eating and reproductive hormones [Reproductive health] | Systematic review | partial |


## 10. Out of scope (hackathon)

- Geographic map
- Login, accounts, roles, permissions
- Backend, database, deployment pipeline (unless the demo needs a public URL)
- Screens for affected women
- Researcher profiles, participant sign-up, results tracking
  (system parts 4–6: pitch material only)
- Search, filters, editing data in the UI

## 11. AI-generated research design — BUILT

**Status: built, 18 Sep.** This section described a feature that was
explicitly not for this hackathon. It was built, in a different and
better form than the one planned below, and the old text is kept in git
history rather than here.

**What it does:** on a data need, **Show research design** reveals a
possible study design — which women to recruit and how many, what to
measure, the breakdowns the analysis needs, over what period, and a named
validated instrument where one exists. It is labelled *AI-generated study
design — unverified*, with the date it was generated.

**Where it runs.** The app is static, opens from `file://`, and has no
backend, so it cannot hold an API key (§13). Designs are therefore
generated during the intake run, on the maintainer's machine, and stored
in `research-designs.js`. The button is real and the output is real model
output; it was produced at intake time rather than at click time. This is
the only option that keeps §13, and it is stated here rather than
implied.

**The button says *Show*, not *Generate*.** It said Generate until 18 Sep,
which described the pipeline rather than the click: by the time anyone
presses it the design has been in `research-designs.js` for days. The
paragraph above was always here, so the product was never lying in its
documentation — but the label was the one place it overstated itself on
screen, and a judge who read §13 and then clicked Generate would have
caught it. Changed everywhere at once: `app.js`, this file, the README and
the demo script.

**Why it is not part of a record.** A design is an answer, not a
finding. Keeping generation out of storage is what makes it impossible
for a generated design to be mistaken for something an authority said —
see §5a.

**Also built, and not planned here:** the verification step. A live web
search checks whether data called missing has been collected since, and
sets the status from what it finds. It is the answer to the question this
product is most vulnerable to — *how do you know the data isn't already
out there?* — and on the first record it produced, it caught the platform
about to publish a gap that the cited paper had itself just filled.

## 12. Acceptance criteria

Core flow:

1. The app opens by double-clicking `index.html` — no server, no install,
   no build.
2. Every problem in the seed is reachable from Screen 1 — through its
   area's pin, or, for an area with no measured coordinate, through the
   list under the figure. No record can be unreachable.
3. Each card shows the correct count of missing data needs.
4. Clicking a card opens Screen 2 for that problem.
5. Each data need shows exactly one status badge matching the seed file.
6. Each data need shows what its source said, the date the gap was
   claimed, and the date the platform last checked — or "Not established"
   where a record predates those fields, without a further click.
7. A `missing` need carries the disclaimer that the check was a search of
   published sources and is not proof, with a link to report data the
   check missed.
8. The demo banner renders on every screen while any record is a
   placeholder, and does not render when none is. It states the count.
9. Returning from a record lands on the area it was opened from, and from
   there on the map, without reloading.
10. The full demo flow (1 → 4 in section 3) takes under 90 seconds.

Design and accessibility:

11. Every status is identifiable in greyscale (colour + shape + word).
12. All body text meets 4.5:1 contrast and is 16px or larger.
13. The whole core flow is completable by keyboard alone, with a visible
    focus ring at every step.
14. No horizontal scroll at 360px width.
15. With `prefers-reduced-motion: reduce`, no transition exceeds an
    opacity change.
16. Every count shown on Screen 1 and Screen 1a agrees with the statuses
    on Screen 2 for the same problem.

Body map (§7.6). Numbered after the original sixteen on purpose: the
code cites these by number, so existing criteria keep theirs.

17. Screen 1 shows one marker per mapped area in the seed. An area with no
    `MAP_POINTS` entry draws no marker, does not consume a pin number, and
    is listed under the figure instead, so it stays reachable.
18. Every site marker sits on the figure — centre and all eight edge
    points inside the fill — and every ring marker sits off it.
19. Each marker's sentence counts every data need in its area, and
    agrees with the heading on that area's screen.
20. The counts strip totals agree with the sum of the card counts.
21. A marker opens its area's screen, by click, Enter and Space alike, and
    focus lands in the new screen.
22. Returning from an area lands on the home screen with the map intact.
23. Below 640px the labels are gone, the numbered legend is present, and
    there is no horizontal scroll.

Generated research design (§11). Reserved as a stretch pair; both now
pass.

24. The design appears in its own labelled block, marked AI-generated and
    unverified, with the date it was generated.
25. With `research-designs.js` deleted, every criterion 1–23 still passes
    and the button is absent rather than broken.

About screen (§6, Screen 4). Appended after that pair rather than before
it: 24–25 belong to §11 and are not renumbered.

26. The header link opens the About screen by mouse and by keyboard, with
    a visible focus ring on the link.
27. Back returns to the home screen with the map, the counts strip and the
    cards intact.
28. The home screen is still what loads first; About is hidden until it is
    asked for.
29. The five system stages and the seven intake steps are present as list
    text, not only inside the SVG.
30. The stage 1 disclosure opens and closes by Enter and by Space, and
    `aria-expanded` matches the panel's state at every point. It is
    collapsed on load.
31. No horizontal scroll at 360px, including the diagram.
32. The §14 disclosure paragraph — built during the Hackathon Period, no
    pre-existing code, AI-assisted with Claude Code — is on the screen.
33. Built and Planned are identifiable in greyscale, and use none of the
    three data-status colours.

Carrying the design out, and the summarised check (§6, Screen 2). Appended
after 33 for the same reason as every block before it: nothing is
renumbered.

34. The design block's button reads **Show research design**, and no
    screen or document calls it *Generate*.
35. *Copy this design* puts the design on the clipboard together with the
    data need, the gap claim, its source and `claimed_date`, what the
    check found, and the AI-generated-and-unverified label. A design never
    leaves the app without the claim it answers.
36. The copy result is announced in words through a live region, not by
    colour alone, and a failure says what to do instead. It works from
    `file://`, where `navigator.clipboard` may be unavailable.
37. Where the check is long, the verdict is visible and the rest is behind
    *Show the full check*, with `aria-expanded` matching the panel at
    every point and collapsed on load. Where it is short, no disclosure
    appears at all.
38. An instrument named but not linked is shown as text, at the same size
    as a linked one.
39. The masthead returns to Screen 1 from the detail screen, the data need
    screen, About and Screen 1 itself, by mouse, Enter and Space. It is
    the first tab stop after the skip link, its focus ring is visible
    against `navy-deep`, and its click target is the words rather than the
    width of the bar.

## 13. Tech

**Decided: plain HTML, CSS and JavaScript. No framework, no build step,
no dependencies.**

```
index.html      all three screens, shown and hidden by JS; also holds
                the map's figure and ring, which never change
styles.css      the §7 tokens as CSS custom properties
data.js         the seed file (§5, §9) — loaded by <script>, not fetch
app.js          renders from the seed, handles navigation
```

The seed is `data.js` and not `data.json` for one concrete reason:
`fetch()` on a local file is blocked by the browser from `file://`, so a
`.json` seed would force a local web server just to open the page. A
`.js` file assigning one object loads from a plain `<script>` tag and
works identically from `file://` and from Pages. The contents stay
JSON-shaped and hand-editable.

- Hosting: **GitHub Pages**, served from `main` at the repo root.
  Repo `minimarina/women-data-gap-map` is already public.
  Public URL: `https://minimarina.github.io/women-data-gap-map/`
  Enable once via Settings → Pages → Source: *Deploy from a branch* →
  `main` → `/ (root)`. No build workflow, because there is no build.
- `index.html` therefore lives at the repo root, beside `README.md`.
- **All asset paths must be relative** (`styles.css`, not `/styles.css`),
  because the site is served from the `/women-data-gap-map/` subpath.
  An absolute path works locally and 404s on Pages — the one mistake
  this setup can make.
- Every push to `main` republishes the site, so the public URL is always
  the latest commit. No deploy step on submission day.
- Seed data in one JSON file in the repo.
- No code is copied from the cycle tracker. If that changes, update the
  disclosure in README.

**Why no framework.** Three screens and one JSON file do not need one.
The cost of a framework here is setup time, a build step that can fail
on submission day, and dependencies to audit — with no benefit at this
size. The engineering effort goes into §8.2 accessibility and into the
source methodology instead. State this in the write-up as a choice, so
it reads as judgment rather than as a gap.

**Acceptance criterion 1 becomes:** the app opens by double-clicking
`index.html`, with no server and no install.

## 14. Compliance

- Git history from commit one; commit after every working step.
- Keep Claude Code session logs (evidence of work during the period).
- Submission states what was built during the event vs before it.
- No confidential or employer material. Check licenses on any asset or
  dataset used.
- The Writeup becomes public under CC BY 4.0 — paraphrase and link
  sources, never paste their text, charts or images. Gallery image must
  be my own.
- **AI use, stated plainly.** Claude Code wrote most of the application
  code, pair-programmed. Inside the product, the Anthropic API is used at
  intake time for four steps — filter, extract, verify, design — and the
  models used are named in `intake/model.mjs`. Every study design shown
  in the app is model output and is labelled *AI-generated —
  unverified* on screen with its generation date. No gap claim is ever
  model-authored: claims are quoted from cited sources, and no record
  enters `data.js` without a person deciding to admit it.
- **How the review actually ran, 18 Sep.** The AI fetched all nine
  candidate abstracts and compared each quoted claim against its source,
  and recommended a verdict; the maintainer decided on each record and ran
  the approve and dismiss commands; the AI then merged the six approved
  blocks into `data.js` and corrected three `area` fields. The comparison
  was machine-made and the decision human. `intake/README.md` records this
  in full, including a dismissal made in error and recovered.
- **The limit stated on the product itself:** no search proves a
  negative. A `missing` record reports that a search of published sources
  found nothing, not that the data does not exist.

## 15. Open decisions

- [ ] Project name. ("Research intelligence for the gender data gap"
      works as the Kaggle subtitle; the title is still open.)
- [ ] Demo day time in PDT (confirm 4:00 vs 16:00 Lisbon in WhatsApp)
(Resolved 18 Sep: the five hand-written `collection_request` blocks were
retired with the records that carried them. One generation, one shape.)

Resolved since 0.1: tech stack (§13), hosting and public URL (§13),
charts (§7.4), several problem areas rather than one
(session 05), two-tier gap provenance (§5a), collection request fields
and the wording of question 4 (§5), and where the disclosures go — inside
the product, on Screen 4 (§6). That last one was never written down here
as an open item; it was tracked outside the repo, and it is recorded as
resolved here because §14 requires the built-before / built-during split
to be stated somewhere and this is now that somewhere.

Resolved since 0.5: the AI feature (§11) — built, as a generated research
design rather than the variable suggester planned; where a generated
design lives (§5, §11) — outside the record, because the app has no
backend to hold a key; and what a record may contain (§5a) — nothing
invented and stored, enforced by `intake/validate.mjs` rather than
promised.
