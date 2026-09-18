/* Shared pieces of the intake run. Plain Node, no dependencies — SPEC §13
   holds for the tooling as well as for the app. */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

export const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO = join(HERE, "..");

export const today = () => new Date().toISOString().slice(0, 10);

/* How far back a gap claim may have been made. One year: a gap named
   within the last twelve months is much less likely to have been quietly
   filled, which is the failure this register most has to avoid. It also
   shrinks what the search returns, so the filter sees fresher papers.

   Both the search window and the validator's staleness check read this,
   so the thing that is collected and the thing that is accepted cannot
   disagree. */
export const YEARS_BACK = 1;

export function readJson(path, fallback) {
  if (!existsSync(path)) { return fallback; }
  return JSON.parse(readFileSync(path, "utf8"));
}

export function writeJson(path, value) {
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n", "utf8");
}

/* data.js is a script, not a module: it assigns a const so the app can
   load it from file:// without fetch(). Running it in a throwaway context
   is how the intake side reads it without changing that. */
export function loadSeed() {
  const src = readFileSync(join(REPO, "data.js"), "utf8");
  return vm.runInNewContext(src + "\nDATA;", {});
}

/* Every source URL the seed already cites, in one set, so the run never
   offers back something that is already on a card. */
export function seedUrls(seed) {
  const urls = new Set();
  const add = (value) => { if (value) { urls.add(String(value).toLowerCase()); } };

  for (const problem of seed.problems) {
    add(problem.source);
    for (const need of problem.data_needs || []) {
      add(need.gap_evidence && need.gap_evidence.source);
      add(need.dataset_source && need.dataset_source.source);
      add(need.collection_guidance && need.collection_guidance.source);
    }
  }
  return urls;
}

/* The ledger is the "table": every DOI the run has ever looked at, with
   what happened to it. It is committed, so a rejection is permanent and
   public rather than living in one person's memory. */
export const LEDGER = join(HERE, "ledger.json");

export function loadLedger() {
  return readJson(LEDGER, { updated_at: null, entries: {} });
}

export function saveLedger(ledger) {
  ledger.updated_at = today();
  writeJson(LEDGER, ledger);
}

export function ledgerHas(ledger, doi) {
  return Boolean(doi) && Object.hasOwn(ledger.entries, doi.toLowerCase());
}

/* "seen" means discovered, not judged: --discover-only records what the
   search returned without spending a token on any of it. Only a judged
   outcome removes a paper from the queue, or a preview run would silently
   consume everything it previewed. */
const JUDGED = ["rejected-by-filter", "candidate", "approved", "dismissed"];

/* A judgement a human made is permanent. A judgement the filter made is
   only as good as the prompt that made it, and that prompt gets tuned —
   so a rejection carries the filter version that produced it, and a
   rejection from an older filter is reopened rather than trusted.
   Without this, every prompt change silently burns the corpus. */
export function ledgerJudged(ledger, doi, filterVersion) {
  if (!ledgerHas(ledger, doi)) { return false; }

  const entry = ledger.entries[doi.toLowerCase()];
  if (JUDGED.indexOf(entry.outcome) === -1) { return false; }

  if (entry.outcome === "rejected-by-filter" && filterVersion !== undefined) {
    return entry.filter_version === filterVersion;
  }
  return true;
}

export function ledgerNote(ledger, doi, outcome, title, filterVersion) {
  if (!doi) { return; }
  const key = doi.toLowerCase();
  const existing = ledger.entries[key];

  const entry = {
    first_seen: (existing && existing.first_seen) || today(),
    last_seen: today(),
    title: title || (existing && existing.title) || "",
    outcome
  };

  if (outcome === "rejected-by-filter" && filterVersion !== undefined) {
    entry.filter_version = filterVersion;
  }

  ledger.entries[key] = entry;
}

/* What the app is allowed to load.

   designs.json is an archive: it keeps every design ever generated, so a
   record that comes back for review does not have to be paid for twice.
   research-designs.js is not an archive — it is published, and it should
   carry designs for records that exist. A design whose record was
   dismissed is dead weight on the public site, and dismissals include
   papers rejected as out of scope, whose designs have no business being
   served from a register of gaps in women's health. */
export function publishableDesigns(designs, seed, candidates) {
  const live = new Set();

  for (const problem of seed.problems) {
    for (const need of problem.data_needs || []) { live.add(need.id); }
  }
  /* Records waiting for a decision are included, so that approving one
     and merging it does not need another run to render its design. */
  for (const record of (candidates && candidates.records) || []) {
    live.add(record.data_need.id);
  }

  const kept = {};
  for (const id of Object.keys(designs)) {
    if (live.has(id)) { kept[id] = designs[id]; }
  }
  return kept;
}

/* research-designs.js is a script, not a module, so the app can load it
   from file:// with no fetch — the same shape as data.js. Built from an
   array of lines: a heredoc and a \n escape do not survive each other,
   and this file has been broken that way twice. */
export function renderDesigns(designs) {
  const header = [
    "/* AI-generated study designs. NOT part of the register.",
    " *",
    " * Written by intake/run.mjs, one entry per data need id. A design is",
    " * an answer, not a record: it is never merged into data.js, and the",
    " * app works fully with this file absent (SPEC 11).",
    " *",
    " * Only designs whose record is live are published here. The full",
    " * archive, including designs for records that were dismissed, stays",
    " * in intake/designs.json.",
    " *",
    " * Every entry is model output and is labelled unverified on screen.",
    " */",
    ""
  ];

  return header.join("\n") + "\n" +
    "const RESEARCH_DESIGNS = " + JSON.stringify(designs, null, 2) + ";\n";
}
