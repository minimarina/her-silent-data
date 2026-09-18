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

Every record now in `data.js` came through this path. The five
hand-sourced problems that seeded the project were removed on 18 Sep, so
that a reader never sees two generations of record side by side.

A candidate whose check comes back `collected` is not merged: the data
exists, so it is not a gap. The ledger records it all the same.

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
node intake/run.mjs --want=60          # gather more phrase matches first
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

## What the validator enforces

Rules the platform states about itself are checked in code rather than
promised. `node intake/validate.mjs --self-test` runs them as nine
acceptance tests.

- **A claim must quote its source.** `gap_evidence.note` has to contain a
  span of 20 characters or more that appears **verbatim in the abstract
  the record was extracted from**. A note that states the extractor's own
  reading, or quotes text that is not there, is rejected. Measured
  against seven real candidates on 18 Sep: it caught two of the four that
  were rejected by hand, and passed all three that were approved. It
  cannot catch the third kind of error — a quotation that is accurate and
  misread — which is why the human step stays.
- **A status may not come from a check that did not happen.** The verify
  step declares `search_outcome` separately from the status, and a record
  whose search failed is left unjudged rather than written with a status
  nobody established. On 18 Sep a record was marked `missing` on the back
  of a search the model itself described as failed — `checked_at` was
  present and sources had been captured, so nothing downstream could tell.
- Guidance with no source URL is rejected. Sourced, or null.
- A record with no `verification.checked_at` is rejected.
- `collected` or `partial` without a `dataset_source` is rejected.
- A claim older than the window is rejected.
- A DOI already in `data.js` or approved in the ledger is rejected.

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

## How discovery actually works

**Europe PMC does not phrase-match.** It drops stop words, so
`ABSTRACT:"no studies met the inclusion criteria"` is really a search for
*studies met inclusion criteria* — a sentence in almost every systematic
review, with the negation that carries the entire meaning thrown away.
Measured 18 Sep: 6,654 hits, nought of five sampled abstracts containing
the phrase. For as long as the query looked like it was searching for
sentences, it was not, and the filter was doing all the selection.

So discovery is in two halves:

1. **The query is a recall net.** Reviews, meta-analyses and guidelines
   about women, within the window. About 20,000 papers. It selects on
   genre and population only, because that is all Europe PMC can be
   trusted to do.
2. **The phrase match happens here, in `run.mjs`,** against the abstract
   text the search already returned. Exact, free, and deterministic. It
   pages through the net until enough abstracts have survived — `--want`
   (default 40) and `--max-pages` control that.

Only phrase-matched abstracts reach the filter, so no model is ever paid
to read a paper that never claimed anything was missing.

## Tuning the search

`GAP_PHRASES` in `run.mjs` is the quality of the whole system. A gap is a
sentence, and the choice of sentence decides what the platform can see.
Adding one is a deliberate edit, not a setting.

**The phrases are measured, not guessed.** They were mined from 8,000
women's-health review abstracts, counting how researchers actually write
absence. The first hand-written list was full sentences — "no studies met
the inclusion criteria" — and matched 9 abstracts in 12,000, because
almost nobody writes the whole sentence. Short fragments are what they
write: *no studies* (82 in 8,000), *none of the studies* (21), *no data*
(20), *lack of data* (16). Rewriting the list against those counts took
the yield from 9 in 12,000 to 48 in 1,000.

**What is deliberately excluded** is the *limited evidence* (116), *few
studies* (78), *limited data* (67), *insufficient evidence* (34) family.
Those say data exists and is sparse, which is status `partial`. They
produced every partial record in the early runs. Leaving them out is how
the register fills with `missing` rather than `partial`.

**Sex-disaggregation phrases were tried and dropped.** Conceptually they
are the closest thing to the gender data gap — data collected, women
invisible inside it because nobody broke the results down. But they
barely occur in this corpus, and mechanically they would produce the
wrong status: the underlying data *was* collected, so the verify step
finds it and returns `partial`. Making that work needs the extract and
verify prompts to reason about disaggregated versus raw data. It is a
different pipeline, not a different phrase.

## What the search can and cannot do

Europe PMC indexes published literature, filtered here to the window in
`lib.mjs` — currently **one year**. It cannot prove a negative. Data can
exist in unpublished registries, national statistics, industry cohorts or
behind access agreements, and none of that is visible from here.

That limit is stated on every affected card, with a link for anyone who
knows of data the check missed. The platform never asserts that data does
not exist — it reports that an authority named it missing, and what the
check could and could not reach.
