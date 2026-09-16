# SPEC — Women's Data Gap (working name)

Version: 0.4 (all five problems sourced)
Event: Elevate Women Global Hackathon 2026
Submission deadline: Sep 20, 23:59 Lisbon = **Sep 20, 15:59 PDT**

---

## 1. Purpose

A researcher wants to help close the data gap on women, but doesn't know
which data to collect first. The app shows, for a specific problem, which
data is missing and which women it should come from.

**Positioning:** research intelligence for the gender data gap.

**One-sentence problem statement:**
Researchers who want to close the gender data gap don't know which data is
missing most, or which women it has to come from.

**Core problem being addressed:**
The gender data gap — medical and social research often lacks specific,
diverse, high-quality data representative of the global female population.
The gap is historical and structural, so it does not close on its own: it
closes only when individual studies are designed to fill named holes.

**What the platform does about it:** it turns "there is a gap" into a
study someone can design. It identifies where female health and social
data is missing, and specifies the data points a new study would need to
collect.

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

1. Researcher opens the app and sees a list of problems.
2. She opens one problem.
3. She sees the data needed to solve it, each marked
   **collected / partial / missing**.
4. She opens a missing item and sees the **collection request card**:
   which women, how to ask them, in what form.

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
- `gap_evidence` (optional; for partial/missing) — `{ source, note, region }`.
  Who established that this data is missing, and for which population.

**CollectionRequest** (belongs to one DataNeed with status partial/missing)
- `data_need_id`
- `target_women` (who is studied: age range, region, life stage, condition)
- `variables` (list) — what to find out from them. The list a researcher
  carries into a study design; this is the answer §4 question 4 exists for.
- `stratifiers` (list) — the breakdowns the analysis needs (age band,
  parity, stage, region, comorbidity, socioeconomic status). Kept separate
  from `target_women` deliberately: see below.
- `form` (e.g. 10-question online questionnaire, 3-month daily log) —
  absorbs delivery as well as format. "How it is asked" and "what shape it
  comes back in" are one answer, and splitting them broke §8.3.
- `instrument_source` (optional URL) — where `form` names a published
  instrument, the link to it

**Why `stratifiers` is its own field.** The gender data gap is not only
missing studies, it is missing *breakdowns* — data collected without the
variables that would make women visible inside it (§11). Holding the
breakdowns as prose inside `target_women` would make the platform's
central claim the one thing on the card that cannot be compared between
records, or shown to be absent. It is also where §11's AI suggestions
attach when that feature is built.

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

**What the platform adds in both tiers** is §4 question 4 — which women
to study, what to find out from them, and in what form the data comes
back. That layer is original in every record, which is why it must stay
visibly separate from the borrowed gap claim.

**Sourcing one problem at a time.** The seed may be half swapped. Every
screen is computed from the records rather than asserted, so the demo
banner counts placeholders instead of claiming all records are demo, and
disappears when the last one is replaced.

**Instruments over invented forms.** Where a validated instrument exists
for a `form` — WERF EPHect's EPQ-S, a standard time-use diary, the same
screening tool repeated at a later interval — cite and link it rather
than inventing a questionnaire.

## 6. Screens

**Screen 1 — Problem list**
- One card per problem: title, area, affected women.
- Gap indicator on each card: "X of Y data needs missing".
- Banner: shown only while placeholder records exist, and it counts
  them. With the seed fully sourced it does not render.

**Screen 2 — Problem detail**
- Problem title, summary, affected women (question 1).
- List of data needs (question 2) with status badge (question 3).
- Missing/partial items are visually distinct and clickable.

**Screen 3 — Collection request card** (panel or separate view)
- Which women, how to ask, in what form (question 4).
- Why this data matters.
- This is the climax of the demo; it gets the most visual care.

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
seed and there is enough of it to have a shape. Not this week.

### 7.5 Responsive

Works from 360px to desktop. Single column on mobile; the matrix becomes
per-problem stacked bars. No horizontal scrolling on any screen except
inside a deliberately scrollable table.

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

**The swap is done.** All five problems are sourced, `is_demo` is false
throughout, and the demo banner no longer renders. The rules below now
govern sourced records; the demo rules they replace are kept in git
history, not here.

- 4–6 problems, each with 2–5 data needs.
- Every problem has at least one `missing` need.
- Every problem carries a real `source` URL and `origin: "sourced"`.
- Every `missing` or `partial` need carries `gap_evidence` **or** the
  screen says no published source names that gap. One need is in the
  second state (`maternal-postnatal-unpaid-care`) and that is a correct
  state, not a hole to be filled.
- `is_demo` and the banner stay in the code. They cost nothing, and a
  future problem added faster than it can be sourced needs them.

**Sources by problem**

| Problem | Problem statement | Gap evidence |
|---|---|---|
| Menopause at work | WHO menopause fact sheet | HEAF study; NICE NG23 |
| Postnatal follow-up | WHO 2022 postnatal guideline | NICE NG194; WHO exec summary |
| Autoimmune delay | J Rheumatology | J Rheumatology; Cureus 2025; SAGER |
| Cardiac recognition | Lancet CVD Commission 2021 | Lancet CVD Commission |
| Endometriosis | WHO endometriosis fact sheet | NICE NG73 |

- Geographic honesty: global sources carry the problem statement, and
  national priority-setting sources (NICE) carry the gap claim, so
  `gap_evidence.region` states the coverage rather than implying the
  finding is worldwide.
- What is **not** sourced, and is labelled as such: the collection
  requests. Which women, which variables, which breakdowns and in what
  form is this platform's own specification in every record.

## 10. Out of scope (hackathon)

- Geographic map
- Login, accounts, roles, permissions
- Backend, database, deployment pipeline (unless the demo needs a public URL)
- Screens for affected women
- Researcher profiles, participant sign-up, results tracking
  (system parts 4–6: pitch material only)
- Search, filters, editing data in the UI

## 11. Later — AI variable suggestion (NOT for this hackathon)

**Decided: not in v1. Not built this week.** It is recorded here because
it is the right next feature, and it goes in the write-up as Development
Potential. It gets built only if the core is finished, frozen and
demo-ready with hours to spare — and that is not the expected outcome.

Nothing in sections 1–10 or 12 may depend on it.

**What it does:** on a problem detail screen, a "Suggest missing
variables" action sends the problem and its listed data needs to a model,
which returns 2–3 *additional* variables a study on this problem commonly
omits — typically stratifiers (age band, parity, life stage, comorbidity,
socioeconomic status, region, ethnicity) or under-recorded outcomes.
Each suggestion comes with one line on why it matters.

**Why it belongs here:** the gender data gap is not only missing studies,
it is missing *breakdowns* — data collected without the variables that
would make women visible inside it. Suggesting those variables is the
same job as the rest of the app, one level deeper.

**Non-negotiable constraints:**
- Output is labelled **"AI suggestion — unverified"** wherever it appears.
- Suggestions are visually separate from seed data; they never merge into
  the data needs list.
- Suggestions are not saved as findings and not exported as fact.
- The app works fully with this feature switched off, offline, or failing.
  A failed call shows a plain message, never a broken screen.

**Why it can be dropped without cost:** the Kaggle brief asks for a
product built with vibe-coding tools *or* with AI integrated. The build
itself already satisfies that. Nothing is lost by leaving this out.

## 12. Acceptance criteria

Core flow:

1. The app opens by double-clicking `index.html` — no server, no install,
   no build.
2. Screen 1 lists all problems from the seed file.
3. Each card shows the correct count of missing data needs.
4. Clicking a card opens Screen 2 for that problem.
5. Each data need shows exactly one status badge matching the seed file.
6. Clicking a missing or partial need shows its collection request card
   with all three fields filled.
7. A collected need has no collection request card and says so clearly.
8. The demo banner renders on every screen while any record is a
   placeholder, and does not render when none is. It states the count.
9. Returning from detail to the list works without reloading.
10. The full demo flow (1 → 4 in section 3) takes under 90 seconds.

Design and accessibility:

11. Every status is identifiable in greyscale (colour + shape + word).
12. All body text meets 4.5:1 contrast and is 16px or larger.
13. The whole core flow is completable by keyboard alone, with a visible
    focus ring at every step.
14. No horizontal scroll at 360px width.
15. With `prefers-reduced-motion: reduce`, no transition exceeds an
    opacity change.
16. Every count shown on Screen 1 agrees with the statuses on Screen 2
    for the same problem.

Stretch (only if §11 is built):

17. AI suggestions appear in their own labelled block, marked unverified.
18. With the AI call disabled or failing, every criterion 1–16 still passes.

## 13. Tech

**Decided: plain HTML, CSS and JavaScript. No framework, no build step,
no dependencies.**

```
index.html      all three screens, shown and hidden by JS
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

## 15. Open decisions

- [ ] Project name. ("Research intelligence for the gender data gap"
      works as the Kaggle subtitle; the title is still open.)
- [ ] Demo day time in PDT (confirm 4:00 vs 16:00 Lisbon in WhatsApp)

Resolved since 0.1: tech stack (§13), hosting and public URL (§13),
charts (§7.4), AI feature (§11), several problem areas rather than one
(session 05), two-tier gap provenance (§5a), collection request fields
and the wording of question 4 (§5).
