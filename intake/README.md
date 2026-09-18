# intake

How records arrive. This folder is **not part of the app** — `index.html`
never loads anything from here, and the app still opens by double-click
from `file://` with no server, no build step and no dependencies.

## The rule this exists to enforce

**Nothing is invented and stored.** A record carries the gap claim its
source made, cited, plus whether anyone has collected the data since. If
the source also said *how* and *from whom* to collect, that is recorded
too, because it is sourced. Otherwise `collection_guidance` is `null` and
the card says so.

A study design is generated on request, kept in `research-designs.js`,
and is never part of a record.

**No record enters the seed unreviewed.** The run writes to
`candidates.json` and stops. Nothing reaches `data.js` until a decision
has been recorded for it, one record at a time, in the ledger.

### Exactly how the first six records were reviewed, 18 Sep 2026

Stated plainly, because a vaguer version of this paragraph would flatter
the process:

1. `run.mjs` produced nine candidates.
2. **An AI (Claude) fetched all nine abstracts from Europe PMC** and
   compared each record's quoted gap claim against its source, then
   recommended approve or dismiss for each, with reasons.
3. **The maintainer decided** on every record and ran the
   `review.mjs --approve` / `--dismiss` commands herself. Six approved,
   three dismissed.
4. **The AI merged** the six approved blocks into `data.js` and corrected
   three `area` fields that the extractor had got wrong.

So the comparison against the source was machine-made and the decision
was human. That is a weaker claim than "a person read every paper", and
it is the true one. What the human step contributes is a veto that an
automated pipeline does not have: nothing enters the seed that a person
did not choose to admit.

`review.mjs` still never writes `data.js` itself. It emits a block, and
merging is a separate act — done here by the AI, on instruction.

Of those nine candidates, three were dismissed: each was a paper that
collected the very data it called missing, which the search finds because
a paper's introduction names a gap in order to justify the study that
closes it.

**One correction to the record.** A fourth dismissal was made in error —
index-based commands renumbered the list as records were removed, so the
wrong record was dismissed. It was recovered by reprocessing its DOI, and
its ledger entry was deleted by hand so the run would accept it again.
The ledger therefore does not show that mistake; this paragraph is where
it is recorded instead. `review.mjs` now refuses decisions by number and
requires the record id.

## Running it

```bash
node intake/check-key.mjs              # is the key working? never prints it
node intake/run.mjs --discover-only    # search only — no model, no key
node intake/run.mjs --limit=4          # the full run — needs a key
node intake/run.mjs --doi=10.1234/x    # reprocess one named paper
node intake/validate.mjs --self-test   # the acceptance tests
node intake/review.mjs                 # what is waiting for a decision
node intake/review.mjs 1               # read candidate 1 in full
node intake/review.mjs <id> --approve  # approve, and print the data.js block
node intake/review.mjs <id> --dismiss --why="..."
```

Decisions take the record **id**, never its number: removing a candidate
renumbers the rest, so a sequence of index-based commands acts on the
wrong records. `review.mjs` refuses a numbered decision and prints the
id-based form instead.

The run reads `ANTHROPIC_API_KEY` from the environment and never writes
it anywhere; `.env` is gitignored. Set it for one terminal session:

```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-..."
```

`--limit` is the spend control as much as the scope control: it caps how
many papers reach the expensive steps. Roughly **$0.08 per record**,
nearly all of it the verify call, because live search results arrive as
input tokens and are re-read on every tool turn. `max_uses` on that
search is therefore the cost dial for the whole run.

## The files

| | |
|---|---|
| `run.mjs` | discover → filter → extract → verify → design → write |
| `steps.mjs` | the four prompts and their schemas |
| `model.mjs` | the only place that calls the API: retries, refusals, spend |
| `validate.mjs` | deterministic checks, no model. Also the test suite |
| `review.mjs` | the human step: read, approve, dismiss |
| `check-key.mjs` | confirms the key works without printing it |
| `lib.mjs` | shared pieces: the seed reader, the ledger, the year window |
| `ledger.json` | every DOI ever looked at, and what happened to it |
| `candidates.json` | what is waiting for a human |
| `designs.json` | generated designs, kept between runs |
| `preview.json` | output of `--discover-only`, so a free run cannot clobber candidates |

`research-designs.js` is written to the repository root, next to
`data.js`, because the app loads it with its own `<script>` tag.

## The ledger

`ledger.json` is the table that stops the run reprocessing what it has
already seen. It is committed on purpose: a decision is then permanent
and public, rather than living in one person's memory, and the git
history of this file is the provenance of every decision.

Outcomes: `seen`, `rejected-by-filter`, `candidate`, `approved`,
`dismissed`. A dismissal carries its reason.

**`seen` does not block reprocessing.** It means discovered, not judged —
otherwise a free `--discover-only` preview would silently consume its own
queue.

**A filter rejection carries the filter version that made it.** The
filter prompt gets tuned, and a rejection is only as good as the prompt
behind it, so bumping `FILTER_VERSION` in `steps.mjs` reopens every paper
an older filter rejected. Without this, each prompt change quietly burned
the corpus.

## What the search can and cannot do

Europe PMC indexes published literature, filtered here to the window in
`lib.mjs` — currently **one year**. It cannot prove a negative. Data can
exist in unpublished registries, national statistics, industry cohorts or
behind access agreements, and none of that is visible from here.

That limit is stated on every affected card, with a link for anyone who
knows of data the check missed. The platform never asserts that data does
not exist — it reports that an authority named it missing, and what the
check could and could not reach.

## Tuning the search

`GAP_PHRASES` in `run.mjs` is the quality of the whole system. Europe PMC
has no field for "this is a data gap" — a gap is a sentence, and the
choice of sentence decides what the platform can see. Adding one is a
deliberate edit, not a setting.

**They are conclusion phrases, not introduction phrases, and that is the
whole point.** The first version searched for "data are lacking" and
"little is known about" — the sentences a paper writes to justify the
study it then reports. Those gaps are usually closed by the very paper
that named them, and the first six records came back mostly `partial` and
`collected` as a result.

The phrases now match what a systematic review writes when it looked and
found nothing — "no studies met the inclusion criteria", "insufficient
evidence to determine" — and `GAP_GENRES` restricts the search to
reviews, meta-analyses and guidelines. The absence was searched for by
people whose job was to find it, and they published the negative. That is
as close to a verified gap as published literature gets.

The change moved the yield from one `missing` record in six to three in
four.
