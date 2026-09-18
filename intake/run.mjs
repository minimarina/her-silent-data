/* The intake run. Finds published statements that data about women is
   missing, checks whether anyone has collected it since, and stops.
   Nothing here writes to data.js: the seed is never written by a machine.

   Usage:
     node intake/run.mjs --discover-only     search only, no model, no key
     node intake/run.mjs                     the full run
     node intake/run.mjs --limit=3           how many to carry past the filter

   SPEC §13 holds for the tooling too: no dependencies, no build step. */

import { join } from "node:path";
import { writeFileSync } from "node:fs";
import {
  HERE, REPO, today, writeJson, readJson, loadSeed, seedUrls,
  loadLedger, saveLedger, ledgerJudged, ledgerNote, YEARS_BACK,
  publishableDesigns, renderDesigns
} from "./lib.mjs";
import {
  filterAbstract, extractRecord, verifyRecord, designFor, FILTER_VERSION
} from "./steps.mjs";
import { FILTER_MODEL, spendLine } from "./model.mjs";
import { validateRecord, mappableAreas } from "./validate.mjs";

const CANDIDATES = join(HERE, "candidates.json");
const PREVIEW = join(HERE, "preview.json");
const DESIGNS_JS = join(REPO, "research-designs.js");

/* Designs accumulate across runs: a second run must not drop the design
   for a record still waiting to be reviewed. This JSON file is where they
   are kept between runs; research-designs.js is rendered from it, so the
   file the app loads is always derived and never hand-edited. */
const DESIGNS_JSON = join(HERE, "designs.json");

/* ---------- 1 · discover ---------- */

/* These phrases are the quality of the whole system and are tuned by
   hand, never generated. Europe PMC has no "this is a data gap" field —
   a gap is a sentence, and the choice of sentence decides what the
   platform can see. Adding one is a deliberate edit, not a setting.

   They are CONCLUSION phrases, not introduction phrases, and that
   distinction is the whole point. The first version searched for "data
   are lacking" and "little is known about" — the sentences a paper writes
   to justify the study it then reports. Those gaps are usually closed by
   the very paper that named them, and the first six records came back
   mostly "partial" and "collected" as a result.

   A review that looked and found nothing is a different kind of claim:
   the absence was searched for by people whose job was to find it, and
   they published the negative. That is as close to a verified gap as
   published literature gets. */
const GAP_PHRASES = [
  /* MEASURED, not guessed. Mined from 8,000 women's-health review
     abstracts on 18 Sep; the number after each phrase is how many of
     those abstracts contained it. An earlier hand-written list of full
     sentences ("no studies met the inclusion criteria") matched 9
     abstracts in 12,000, because researchers rarely write the whole
     sentence that way. Short fragments are what they actually write.

     Two families, and the order matters. ABSENCE first — these produce
     status "missing", the stronger claim. SPARSE second, at the end of
     the list — these produce "partial", and are there because the gap a
     woman would recognise is usually of that kind. */

  "no studies",                    /* 82 */
  "none of the studies",           /* 21 */
  "no data",                       /* 20 */
  "no trials",                     /* 16 */
  "lack of data",                  /* 16 */
  "lack of evidence",              /* 12 */
  "lack of studies",               /* 11 */
  "lack of information",           /* 10 */
  "lack of research",              /*  7 */
  "none of the included studies",  /*  7 */
  "no randomized controlled trials",
  "no randomised controlled trials",
  "no published data",
  "no eligible studies",

  /* Ambiguous on its own — "no evidence of harm" is a finding, not a gap
     — but it is the second most common absence phrasing in the corpus and
     the filter exists to make exactly this distinction. Kept, and the
     filter earns its keep on it. */
  "no evidence",                   /* 95 */

  /* Women left out of the studies that produced the evidence base now
     used to treat them. Rare, and worth having when it appears. */
  "women were excluded",
  "pregnant women were excluded",

  /* SPARSE, not absent. These produce status "partial": data exists and
     does not cover what it should. They were removed on 18 Sep for
     flooding the register with partial records, and brought back the same
     evening for a better reason than they were dropped.

     The gap they find is the one closest to this platform's problem
     statement — menopause at work, postnatal follow-up, cardiac symptoms
     are all topics where the data exists and women are invisible inside
     it. Filter criterion 2b is what makes them safe to include: a paper
     with sparse data on a rare disease is now rejected, while a paper
     with sparse data BECAUSE women were excluded or never analysed
     separately is exactly what this register is for.

     Kept last so their order in the list matches their standing: a
     "missing" record is the stronger claim, and these must earn their
     place through the filter. */
  "limited evidence",              /* 116 */
  "few studies",                   /*  78 */
  "limited data",                  /*  67 */
  "insufficient evidence",         /*  34 */
  "limited research",              /*  23 */
  "insufficient data"              /*  15 */

  /* Dropped after measuring: the sex-disaggregation phrases. Two reasons.
     They barely occur in this corpus, and mechanically they would produce
     the wrong status — a disaggregation gap means the data WAS collected,
     so the verify step finds it and returns "partial". Making that work
     needs the extract and verify prompts to reason about disaggregated
     versus raw data, which is a different pipeline, not a phrase. */
];

/* Paired with the phrases above: the document types whose genre is
   naming an open question rather than answering one. Without this, the
   conclusion phrases still match primary studies quoting a review. */
const GAP_GENRES = [
  'PUB_TYPE:"systematic review"',
  'PUB_TYPE:"Review"',
  'PUB_TYPE:"Meta-Analysis"',
  'PUB_TYPE:"Guideline"',
  'PUB_TYPE:"Practice Guideline"'
];

function europePmcQuery() {
  const year = new Date().getFullYear();

  /* A RECALL NET, not a filter. Europe PMC drops stop words, so no phrase
     clause here can carry a negation — see abstractContainsGapPhrase.
     This asks only for the genre and the population, and every abstract it
     returns is phrase-matched locally before anything is spent. */
  return [
    "(" + GAP_GENRES.join(" OR ") + ")",
    'AND (ABSTRACT:"women" OR TITLE:"women" OR ABSTRACT:"female")',
    "AND (PUB_YEAR:[" + (year - YEARS_BACK) + " TO " + year + "])",
    'AND (LANG:"eng")'
  ].join(" ");
}

async function search(query, pageSize, cursor) {
  const url = "https://www.ebi.ac.uk/europepmc/webservices/rest/search" +
    "?format=json&resultType=core&pageSize=" + pageSize +
    (cursor ? "&cursorMark=" + encodeURIComponent(cursor) : "") +
    "&query=" + encodeURIComponent(query);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Europe PMC returned " + response.status);
  }

  const body = await response.json();
  const results = (body.resultList && body.resultList.result) || [];

  return {
    hitCount: body.hitCount,
    nextCursor: body.nextCursorMark || null,
    papers: results.map((paper) => ({
      title: paper.title,
      doi: paper.doi || null,
      url: paper.doi
        ? "https://doi.org/" + paper.doi
        : (paper.fullTextUrlList ? null : null),
      pmid: paper.pmid || null,
      year: paper.pubYear || null,
      /* When the gap was named. Taken from the index rather than from the
         model: a date is a fact about the paper, and the validator rejects
         a claim older than the window, so a guessed one would be a bug
         with consequences. */
      date: paper.firstPublicationDate ||
            (paper.pubYear ? paper.pubYear + "-01-01" : null),
      journal: (paper.journalInfo &&
                paper.journalInfo.journal &&
                paper.journalInfo.journal.title) || null,
      abstract: paper.abstractText || ""
    }))
  };
}

/* Pages the recall net, phrase-matching each page as it arrives and
   stopping as soon as enough abstracts have survived. Europe PMC is free
   and keyless, so this costs nothing but seconds — and every abstract it
   discards here is one the filter is not paid to read. */
async function discover(want, pageSize, maxPages) {
  const query = europePmcQuery();
  const matched = [];
  let cursor = "*";
  let scanned = 0;
  let hitCount = 0;

  for (let page = 0; page < maxPages; page += 1) {
    const found = await search(query, pageSize, cursor);
    hitCount = found.hitCount;
    scanned += found.papers.length;

    for (const paper of found.papers) {
      if (abstractContainsGapPhrase(paper)) { matched.push(paper); }
    }

    console.log("  scanned " + scanned + ", matched " + matched.length);

    if (matched.length >= want) { break; }
    if (!found.nextCursor || found.nextCursor === cursor) { break; }
    if (found.papers.length === 0) { break; }
    cursor = found.nextCursor;
  }

  console.log("");
  return { hitCount, scanned, papers: matched };
}

/* Europe PMC does not phrase-match. It drops stop words, so
   ABSTRACT:"no studies met the inclusion criteria" is really a search for
   "studies met inclusion criteria" — a sentence in almost every
   systematic review, with the negation that carries the whole meaning
   thrown away. Measured 18 Sep: 6,654 hits, nought of five sampled
   abstracts containing the phrase.

   So the query is a recall net, and the phrase match happens here, on the
   abstract text the search already returned. It is free, it is exact, and
   it is what makes GAP_PHRASES mean what intake/README.md says it means.
   Everything downstream now sees only abstracts that really do contain a
   sentence about absence. */
function abstractContainsGapPhrase(paper) {
  const text = " " + String(paper.abstract || "")
    .toLowerCase()
    .replace(/\s+/g, " ") + " ";

  return GAP_PHRASES.some((phrase) => text.includes(phrase.toLowerCase()));
}

/* One named paper, straight past discovery and the filter. For putting
   back a record that was dismissed by mistake, and for re-running a
   single paper after a prompt change without paying for a whole run. */
const fetchByDoi = (doi) => search('DOI:"' + doi + '"', 1);

/* ---------- main ---------- */

function arg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith("--" + name + "="));
  return hit ? hit.split("=")[1] : fallback;
}

const discoverOnly = process.argv.includes("--discover-only");
/* One page of the recall net. 1000 is Europe PMC's maximum. */
const pageSize = Number(arg("page-size", 1000));

/* How many phrase-matched abstracts to gather before stopping, and how
   many pages to spend looking. Both free — this is the keyless half. */
const want = Number(arg("want", 40));
const maxPages = Number(arg("max-pages", 12));

/* How many papers may reach the expensive steps. The default is the floor
   from the plan — six records across four areas is what the map needs to
   read as a map — and it is a spend control as much as a scope one. */
const limit = Number(arg("limit", 6));

/* --doi=... reprocesses one named paper and skips discovery and the
   filter entirely. It is the recovery path: a dismissal is meant to be
   permanent, but a dismissal made in error is just an error. */
const onlyDoi = arg("doi", null);

const seed = loadSeed();
const known = seedUrls(seed);
const ledger = loadLedger();

let found;

if (onlyDoi) {
  console.log("Single paper:  " + onlyDoi);
  found = await fetchByDoi(onlyDoi);

  if (found.papers.length === 0) {
    console.log("Europe PMC has no record with that DOI.");
    process.exit(1);
  }
} else {
  console.log("Query window: last " + YEARS_BACK + " years");
  console.log("Phrases:      " + GAP_PHRASES.length);

  found = await discover(want, pageSize, maxPages);
  console.log("Europe PMC:   " + found.hitCount + " reviews in scope, " +
              found.scanned + " scanned, " + found.papers.length +
              " contain a gap sentence");
}

/* Anything already on a card, or already judged in a previous run, is
   dropped before a single token is spent on it. Merely "seen" is not
   judged — see ledgerJudged. */
const fresh = onlyDoi ? found.papers : found.papers.filter((paper) => {
  if (!paper.doi) { return false; }
  if (ledgerJudged(ledger, paper.doi, FILTER_VERSION)) { return false; }
  if (known.has(("https://doi.org/" + paper.doi).toLowerCase())) { return false; }
  if (!paper.abstract) { return false; }
  return true;
});

if (!onlyDoi) {
  console.log("Unseen:       " + fresh.length +
              " (" + (found.papers.length - fresh.length) + " already known)");
}

/* A run that finds nothing must not erase what is still waiting to be
   reviewed. The ledger still records that the papers were looked at. */
if (fresh.length === 0) {
  saveLedger(ledger);
  console.log("");
  console.log("Nothing new. intake/candidates.json left as it was.");
  process.exit(0);
}

if (discoverOnly) {
  for (const paper of fresh) { ledgerNote(ledger, paper.doi, "seen", paper.title); }
  saveLedger(ledger);

  /* A preview writes to its own file. candidates.json holds records that
     cost real money and are waiting for review — a free, read-only run
     must not be able to touch it, and twice now it could. */
  writeJson(PREVIEW, {
    run_at: today(),
    stage: "discover-only",
    query_window_years: YEARS_BACK,
    hit_count: found.hitCount,
    scanned: found.scanned,
    phrase_matched: found.papers.length,
    unseen: fresh.length,
    papers: fresh.map((p) => ({
      title: p.title, doi: p.doi, url: p.url, year: p.year, journal: p.journal
    }))
  });

  console.log("");
  console.log("Wrote intake/preview.json and updated intake/ledger.json.");
  console.log("No model was called and no key was needed.");
  process.exit(0);
}

/* ---------- 2 · filter ---------- */

const passed = [];

/* A named DOI has already been judged worth processing by the person who
   named it. Screening it again would only be able to disagree. */
if (onlyDoi) {
  passed.push(fresh[0]);
} else {

console.log("");
console.log("Filtering " + fresh.length + " abstracts on " + FILTER_MODEL + "…");

for (const paper of fresh) {
  let keep = false;
  try {
    keep = await filterAbstract(paper);
  } catch (error) {
    /* One unreadable abstract must not end the run. It is left out of the
       ledger entirely so a later run can try it again. */
    console.log("  skipped (" + error.message.split("\n")[0] + "): " +
                paper.title.slice(0, 60));
    continue;
  }

  if (keep) {
    passed.push(paper);
  } else {
    ledgerNote(ledger, paper.doi, "rejected-by-filter", paper.title, FILTER_VERSION);
  }

  if (passed.length >= limit) { break; }
}

console.log("Passed:       " + passed.length +
            (passed.length >= limit ? " (stopped at --limit=" + limit + ")" : ""));

}

/* The ledger is saved before the expensive steps: a crash in extract must
   not make the run re-screen everything it already rejected. */
saveLedger(ledger);

if (passed.length === 0) {
  console.log("");
  console.log("Nothing passed the filter. intake/candidates.json left as it was.");
  console.log("Spend: " + spendLine());
  process.exit(0);
}

/* ---------- 3 · extract, verify, design ---------- */

/* Candidates accumulate, like designs do. A run that overwrote this file
   would throw away records still waiting to be reviewed — the same bug
   the designs file already had, in the file next to it. Records already
   merged into data.js are removed by hand along with the merge. */
const previous = readJson(CANDIDATES, null);
const records = (previous && Array.isArray(previous.records))
  ? previous.records.slice()
  : [];
const alreadyHeld = new Set(
  records.map((record) => record.paper && record.paper.doi).filter(Boolean)
);

const designs = readJson(DESIGNS_JSON, {});

for (const paper of passed) {
  console.log("");
  console.log("· " + paper.title.slice(0, 70));

  try {
    console.log("  extract…");
    const extracted = await extractRecord(paper);

    console.log("  verify (live search)…");
    const checked = await verifyRecord(extracted);

    /* The design is the one optional product of this loop: §11 requires
       the app to work with research-designs.js absent. So a design
       failure must not discard a record that extract and verify already
       paid for — it is caught here rather than by the outer catch. */
    /* A record whose data turned out to exist does not need a study
       design — the study has been done, and the card points at it. */
    let design = null;
    try {
      if (checked.status === "collected") {
        console.log("  design skipped (data exists)");
      } else {
        console.log("  design…");
        design = await designFor(extracted);
      }
    } catch (designError) {
      console.log("  design failed (record kept): " +
                  designError.message.split("\n")[0]);
    }

    const need = extracted.data_need;

    /* Assembled here rather than by the model: ids, dates and the shape
       the validator checks are facts about the pipeline, not judgements
       about the paper. */
    const record = {
      paper: {
        title: paper.title,
        doi: paper.doi,
        url: paper.url,
        year: paper.year,
        journal: paper.journal,
        /* Kept on the candidate so the validator can check the record's
           quotation against the text it came from. It is dropped when the
           record is merged: data.js cites the source, it does not mirror
           it. */
        abstract: paper.abstract
      },
      problem: {
        id: extracted.problem.id,
        title: extracted.problem.title,
        area: extracted.problem.area,
        summary: extracted.problem.summary,
        affected_women: extracted.problem.affected_women,
        source: paper.url,
        origin: "sourced",
        is_demo: false
      },
      data_need: {
        id: need.id,
        problem_id: extracted.problem.id,
        area: extracted.problem.area,
        description: need.description,
        why_it_matters: need.why_it_matters,
        status: checked.status,
        existing_data_note: "",
        gap_evidence: {
          source: paper.url,
          note: need.gap_note,
          region: need.region,
          claimed_date: paper.date
        },
        dataset_source: checked.dataset_source,
        /* Sourced, or null. The rule is this one field. */
        collection_guidance: need.collection_guidance
          ? { note: need.collection_guidance.note, source: paper.url }
          : null,
        verification: checked.verification
      }
    };

    const result = validateRecord(record, {
      areas: mappableAreas(), ledger, known
    });

    record.validation = result;
    if (!alreadyHeld.has(paper.doi)) {
      records.push(record);
      alreadyHeld.add(paper.doi);
    }
    if (design) { designs[need.id] = design; }

    ledgerNote(ledger, paper.doi, "candidate", paper.title);

    console.log("  " + (result.ok ? "valid" : "INVALID") +
                " · status " + checked.status +
                " · " + checked.verification.sources.length + " sources checked");
    result.errors.forEach((e) => console.log("    error:   " + e));
    result.warnings.forEach((w) => console.log("    warning: " + w));

  } catch (error) {
    console.log("  failed: " + error.message.split("\n")[0]);
  }
}

/* ---------- 4 · write ---------- */

saveLedger(ledger);

writeJson(CANDIDATES, {
  run_at: today(),
  stage: "full",
  query_window_years: YEARS_BACK,
  hit_count: found.hitCount,
  scanned: found.scanned,
  phrase_matched: found.papers.length,
  unseen: fresh.length,
  passed_filter: passed.length,
  records
});

writeJson(DESIGNS_JSON, designs);

const published = publishableDesigns(designs, seed, { records });
writeFileSync(DESIGNS_JS, renderDesigns(published), "utf8");

/* The distribution is worth printing: a run returning mostly "collected"
   or "partial" means the phrases are finding sparse data rather than
   absence, which is the failure this pipeline is most prone to. */
const byStatus = {};
const byArea = {};
for (const record of records) {
  const need = record.data_need;
  byStatus[need.status] = (byStatus[need.status] || 0) + 1;
  byArea[need.area] = (byArea[need.area] || 0) + 1;
}

console.log("");
console.log("Status: " + (Object.entries(byStatus)
  .map(([k, v]) => v + " " + k).join(", ") || "none"));
console.log("Areas:  " + (Object.keys(byArea).length + " — " +
  Object.keys(byArea).join(", ")));
console.log("");
console.log("Wrote " + records.length + " records to intake/candidates.json");
console.log("Wrote " + Object.keys(published).length + " designs to research-designs.js" +
            " (" + Object.keys(designs).length + " in the archive)");
console.log("Spend: " + spendLine());
console.log("");
console.log("Nothing has been written to data.js. Open each citation, confirm");
console.log("the note is honest, and merge by hand.");
