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

**The seed is never written by a machine.** The run writes to
`candidates.json`. A human reads the citation, confirms the source says
what the record claims, and merges by hand.

## Running it

```bash
node intake/run.mjs --discover-only    # search only — no model, no key
node intake/validate.mjs --self-test   # the acceptance tests
node intake/validate.mjs               # check what is in candidates.json
node intake/run.mjs                    # the full run — needs a key
```

The full run reads `ANTHROPIC_API_KEY` from the environment. It is never
written to a file in this repository; `.env` is gitignored.

## The files

| | |
|---|---|
| `run.mjs` | discover → filter → extract → verify → write |
| `validate.mjs` | deterministic checks, no model. Also the test suite |
| `lib.mjs` | shared pieces: the seed reader, the ledger |
| `ledger.json` | every DOI ever looked at, and what happened to it |
| `candidates.json` | what is waiting for a human |

## The ledger

`ledger.json` is the table that stops the run reprocessing what it has
already seen. It is committed on purpose: a rejection is then permanent
and public, rather than living in one person's memory, and the git
history of this file is the provenance of every decision.

Outcomes: `seen`, `rejected-by-filter`, `candidate`, `approved`,
`dismissed`.

## What the search can and cannot do

Europe PMC indexes published literature, filtered here to the last five
years. It cannot prove a negative. Data can exist in unpublished
registries, national statistics, industry cohorts or behind access
agreements, and none of that is visible from here.

That limit is stated on every affected card, with a link for anyone who
knows of data the check missed. The platform never asserts that data does
not exist — it reports that an authority named it missing, and what the
check could and could not reach.

## Tuning the search

`GAP_PHRASES` in `run.mjs` is the quality of the whole system. Europe PMC
has no field for "this is a data gap" — a gap is a sentence, and those
phrases are the sentences researchers write when they have found one.
Adding one changes what the platform is able to see, so it is a
deliberate edit and not a setting.
