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
  loadLedger, saveLedger, ledgerJudged, ledgerNote, YEARS_BACK
} from "./lib.mjs";
import {
  filterAbstract, extractRecord, verifyRecord, designFor, FILTER_VERSION
} from "./steps.mjs";
import { FILTER_MODEL, spendLine } from "./model.mjs";
import { validateRecord, mappableAreas } from "./validate.mjs";

const CANDIDATES = join(HERE, "candidates.json");
const DESIGNS_JS = join(REPO, "research-designs.js");

/* Designs accumulate across runs: a second run must not drop the design
   for a record still waiting to be reviewed. This JSON file is where they
   are kept between runs; research-designs.js is rendered from it, so the
   file the app loads is always derived and never hand-edited. */
const DESIGNS_JSON = join(HERE, "designs.json");

/* ---------- 1 · discover ---------- */

/* These phrases are the quality of the whole system and are tuned by
   hand, never generated. Europe PMC has no "this is a data gap" field —
   a gap is a sentence, and these are the sentences researchers actually
   write when they have found one. Adding a phrase here changes what the
   platform is able to see, so it is a deliberate edit, not a setting. */
const GAP_PHRASES = [
  "no studies have examined",
  "data are lacking",
  "data is lacking",
  "remains understudied",
  "have not been studied",
  "has not been investigated",
  "little is known about",
  "evidence is lacking",
  "no data exist"
];

function europePmcQuery() {
  const year = new Date().getFullYear();
  const phrases = GAP_PHRASES
    .map((phrase) => 'ABSTRACT:"' + phrase + '"')
    .join(" OR ");

  return [
    "(" + phrases + ")",
    'AND (ABSTRACT:"women" OR TITLE:"women" OR ABSTRACT:"female")',
    "AND (PUB_YEAR:[" + (year - YEARS_BACK) + " TO " + year + "])",
    'AND (LANG:"eng")'
  ].join(" ");
}

async function discover(pageSize) {
  const url = "https://www.ebi.ac.uk/europepmc/webservices/rest/search" +
    "?format=json&resultType=core&pageSize=" + pageSize +
    "&query=" + encodeURIComponent(europePmcQuery());

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Europe PMC returned " + response.status);
  }

  const body = await response.json();
  const results = (body.resultList && body.resultList.result) || [];

  return {
    hitCount: body.hitCount,
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

/* ---------- main ---------- */

function arg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith("--" + name + "="));
  return hit ? hit.split("=")[1] : fallback;
}

const discoverOnly = process.argv.includes("--discover-only");
const pageSize = Number(arg("page-size", 100));

/* How many papers may reach the expensive steps. The default is the floor
   from the plan — six records across four areas is what the map needs to
   read as a map — and it is a spend control as much as a scope one. */
const limit = Number(arg("limit", 6));

const seed = loadSeed();
const known = seedUrls(seed);
const ledger = loadLedger();

console.log("Query window: last " + YEARS_BACK + " years");
console.log("Phrases:      " + GAP_PHRASES.length);

const found = await discover(pageSize);
console.log("Europe PMC:   " + found.hitCount + " total, " +
            found.papers.length + " fetched");

/* Anything already on a card, or already judged in a previous run, is
   dropped before a single token is spent on it. Merely "seen" is not
   judged — see ledgerJudged. */
const fresh = found.papers.filter((paper) => {
  if (!paper.doi) { return false; }
  if (ledgerJudged(ledger, paper.doi, FILTER_VERSION)) { return false; }
  if (known.has(("https://doi.org/" + paper.doi).toLowerCase())) { return false; }
  if (!paper.abstract) { return false; }
  return true;
});

console.log("Unseen:       " + fresh.length +
            " (" + (found.papers.length - fresh.length) + " already known)");

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

  writeJson(CANDIDATES, {
    run_at: today(),
    stage: "discover-only",
    query_window_years: YEARS_BACK,
    hit_count: found.hitCount,
    fetched: found.papers.length,
    unseen: fresh.length,
    papers: fresh.map((p) => ({
      title: p.title, doi: p.doi, url: p.url, year: p.year, journal: p.journal
    }))
  });

  console.log("");
  console.log("Wrote intake/candidates.json and updated intake/ledger.json.");
  console.log("No model was called and no key was needed.");
  process.exit(0);
}

/* ---------- 2 · filter ---------- */

console.log("");
console.log("Filtering " + fresh.length + " abstracts on " + FILTER_MODEL + "…");

const passed = [];

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

const records = [];
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
        journal: paper.journal
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
    records.push(record);
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
  fetched: found.papers.length,
  unseen: fresh.length,
  passed_filter: passed.length,
  records
});

writeJson(DESIGNS_JSON, designs);

/* research-designs.js is a script, not a module, so the app can load it
   from file:// with no fetch — the same shape as data.js. */
writeFileSync(
  DESIGNS_JS,
  "/* AI-generated study designs. NOT part of the register.\n" +
  " *\n" +
  " * Written by intake/run.mjs, one entry per data need id. A design is\n" +
  " * an answer, not a record: it is never merged into data.js, and the\n" +
  " * app works fully with this file absent (SPEC §11).\n" +
  " *\n" +
  " * Every entry is model output and is labelled unverified on screen.\n" +
  " */\n\n" +
  "const RESEARCH_DESIGNS = " + JSON.stringify(designs, null, 2) + ";\n",
  "utf8"
);

/* The distribution is worth printing: a run that returns mostly
   "collected" means the filter is picking up papers that fill their own
   gap, which is the failure mode this pipeline is most prone to. */
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
console.log("Wrote " + Object.keys(designs).length + " designs to research-designs.js");
console.log("Spend: " + spendLine());
console.log("");
console.log("Nothing has been written to data.js. Open each citation, confirm");
console.log("the note is honest, and merge by hand.");
