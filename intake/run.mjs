/* The intake run. Finds published statements that data about women is
   missing, checks whether anyone has collected it since, and stops.
   Nothing here writes to data.js: the seed is never written by a machine.

   Usage:
     node intake/run.mjs --discover-only     search only, no model, no key
     node intake/run.mjs                     the full run
     node intake/run.mjs --limit=3           how many to carry past the filter

   SPEC §13 holds for the tooling too: no dependencies, no build step. */

import { join } from "node:path";
import {
  HERE, today, writeJson, readJson, loadSeed, seedUrls,
  loadLedger, saveLedger, ledgerHas, ledgerNote
} from "./lib.mjs";

const CANDIDATES = join(HERE, "candidates.json");

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

/* Five years. A gap named a decade ago has usually either been filled or
   stopped being the question, and a stale claim is the one failure that
   costs a researcher real work. */
const YEARS_BACK = 5;

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

const seed = loadSeed();
const known = seedUrls(seed);
const ledger = loadLedger();

console.log("Query window: last " + YEARS_BACK + " years");
console.log("Phrases:      " + GAP_PHRASES.length);

const found = await discover(pageSize);
console.log("Europe PMC:   " + found.hitCount + " total, " +
            found.papers.length + " fetched");

/* Anything already on a card, or already judged in a previous run, is
   dropped before a single token is spent on it. */
const fresh = found.papers.filter((paper) => {
  if (!paper.doi) { return false; }
  if (ledgerHas(ledger, paper.doi)) { return false; }
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

console.log("");
console.log("The model steps are not wired up yet. Run with --discover-only.");
process.exit(1);
