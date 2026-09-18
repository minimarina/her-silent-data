/* Shared pieces of the intake run. Plain Node, no dependencies — SPEC §13
   holds for the tooling as well as for the app. */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

export const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO = join(HERE, "..");

export const today = () => new Date().toISOString().slice(0, 10);

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

export function ledgerJudged(ledger, doi) {
  if (!ledgerHas(ledger, doi)) { return false; }
  return JUDGED.indexOf(ledger.entries[doi.toLowerCase()].outcome) !== -1;
}

export function ledgerNote(ledger, doi, outcome, title) {
  if (!doi) { return; }
  const key = doi.toLowerCase();
  const existing = ledger.entries[key];

  ledger.entries[key] = {
    first_seen: (existing && existing.first_seen) || today(),
    last_seen: today(),
    title: title || (existing && existing.title) || "",
    outcome
  };
}
