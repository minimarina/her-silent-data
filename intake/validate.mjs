/* Ordinary JavaScript. No model touches this file's judgement.

   The rules the platform states about itself are checked here rather than
   promised: a guidance block with no source is rejected, an unchecked
   record is rejected, and a record claiming data exists must say where.

   Usage:
     node intake/validate.mjs --self-test    run the acceptance tests
     node intake/validate.mjs                validate intake/candidates.json */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  HERE, REPO, loadSeed, seedUrls, loadLedger, ledgerHas, readJson
} from "./lib.mjs";

const YEARS_BACK = 5;

/* The areas that have a hand-measured coordinate. Read out of app.js so
   the two cannot drift: adding an area there is what makes it mappable,
   and this file never keeps its own copy of the list. */
export function mappableAreas() {
  const src = readFileSync(join(REPO, "app.js"), "utf8");
  const block = src.slice(src.indexOf("var MAP_POINTS"));
  const body = block.slice(0, block.indexOf("};"));
  const names = [...body.matchAll(/"([^"]+)":\s*\{/g)].map((m) => m[1]);
  return new Set(names);
}

const has = (value) => typeof value === "string" && value.trim() !== "";
const isUrl = (value) => has(value) && /^https?:/i.test(value.trim());

export function validateRecord(record, context) {
  const ctx = context || {};
  const areas = ctx.areas || new Set();
  const errors = [];
  const warnings = [];

  const need = record && record.data_need;
  if (!need) {
    return { ok: false, errors: ["No data_need on the record."], warnings };
  }

  /* --- the rule the whole rebuild rests on --- */
  const guidance = need.collection_guidance;
  if (guidance !== null && guidance !== undefined) {
    if (!has(guidance.note)) {
      errors.push("collection_guidance is present but empty. Use null.");
    }
    if (!isUrl(guidance.source)) {
      errors.push(
        "collection_guidance carries no source URL. Guidance is recorded " +
        "only when a published source gave it; otherwise null."
      );
    }
  }

  /* --- no record enters unchecked --- */
  const check = need.verification;
  if (!check || !has(check.checked_at)) {
    errors.push(
      "verification.checked_at is missing. No record enters unchecked."
    );
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(check.checked_at)) {
    errors.push("verification.checked_at is not an ISO date.");
  }

  /* --- a claim that data exists must say where --- */
  const status = need.status;
  if (["missing", "partial", "collected"].indexOf(status) === -1) {
    errors.push("status must be missing, partial or collected.");
  }
  if (status === "collected" || status === "partial") {
    const dataset = need.dataset_source;
    if (!dataset || !has(dataset.note)) {
      errors.push(
        "status is " + status + " but dataset_source says nothing. " +
        "A record may not claim data exists without naming where."
      );
    }
  }

  /* --- the gap claim is borrowed, so it must be citable and recent --- */
  const evidence = need.gap_evidence;
  if (!evidence || !has(evidence.note)) {
    errors.push(
      "gap_evidence.note is missing. The gap claim is always borrowed."
    );
  } else if (evidence.note.trim().length < 80) {
    warnings.push(
      "gap_evidence.note is short; it should quote the source, not label it."
    );
  }
  if (!isUrl(evidence && evidence.source)) {
    errors.push("gap_evidence.source is not a URL.");
  }
  if (!has(evidence && evidence.claimed_date)) {
    errors.push("gap_evidence.claimed_date is missing.");
  } else {
    const year = Number(String(evidence.claimed_date).slice(0, 4));
    const floor = new Date().getFullYear() - YEARS_BACK;
    if (!year || year < floor) {
      errors.push(
        "claimed_date is older than " + YEARS_BACK + " years (" + year + ")."
      );
    }
  }

  /* --- the record has to be usable --- */
  const required = ["id", "problem_id", "area", "description", "why_it_matters"];
  for (const key of required) {
    if (!has(need[key])) {
      errors.push("data_need." + key + " is missing.");
    }
  }
  if (!Object.hasOwn(need, "collection_guidance")) {
    errors.push("collection_guidance must be present, even as null.");
  }

  if (has(need.area) && !areas.has(need.area)) {
    warnings.push(
      "Area " + JSON.stringify(need.area) + " has no measured map " +
      "coordinate. The record will list but not pin until one is added " +
      "to MAP_POINTS."
    );
  }

  /* --- not already here --- */
  const doi = record.paper && record.paper.doi;
  if (doi && ctx.ledger && ledgerHas(ctx.ledger, doi)) {
    const entry = ctx.ledger.entries[String(doi).toLowerCase()];
    if (entry.outcome === "approved") {
      errors.push("DOI is already approved in the ledger.");
    }
  }
  if (doi && ctx.known) {
    const cited = ("https://doi.org/" + doi).toLowerCase();
    if (ctx.known.has(cited)) {
      errors.push("DOI is already cited in data.js.");
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}

/* ---------- acceptance tests ---------- */

function base() {
  const year = String(new Date().getFullYear());
  return {
    paper: {
      title: "T",
      doi: "10.0000/test",
      url: "https://doi.org/10.0000/test"
    },
    data_need: {
      id: "test-need",
      problem_id: "test-problem",
      area: "Menopause",
      description: "A description.",
      why_it_matters: "Because.",
      status: "missing",
      existing_data_note: "",
      gap_evidence: {
        source: "https://example.org/paper",
        note: "The source states plainly that severity was never recorded " +
              "alongside the working day, which is the gap this record carries.",
        region: "United Kingdom",
        claimed_date: year + "-01-01"
      },
      dataset_source: null,
      collection_guidance: null,
      verification: {
        checked_at: "2026-09-17",
        method: "web search",
        findings: "Nothing found.",
        sources: []
      }
    }
  };
}

function selfTest() {
  const ctx = { areas: mappableAreas() };
  const cases = [];

  cases.push(["a clean record passes", base(), true]);

  const unsourced = base();
  unsourced.data_need.collection_guidance = {
    note: "Ask 500 women aged 40 to 58."
  };
  cases.push(["guidance with no source is rejected", unsourced, false]);

  const unchecked = base();
  delete unchecked.data_need.verification;
  cases.push(["a record with no check is rejected", unchecked, false]);

  const bareClaim = base();
  bareClaim.data_need.status = "collected";
  cases.push(["collected with no dataset_source is rejected", bareClaim, false]);

  const stale = base();
  stale.data_need.gap_evidence.claimed_date = "2014-01-01";
  cases.push(["a claim older than five years is rejected", stale, false]);

  const sourced = base();
  sourced.data_need.collection_guidance = {
    note: "The guideline specifies a 24-hour time-use diary at 3 and 9 months.",
    source: "https://example.org/guideline"
  };
  cases.push(["guidance that cites its source passes", sourced, true]);

  let failed = 0;
  for (const entry of cases) {
    const name = entry[0];
    const result = validateRecord(entry[1], ctx);
    const pass = result.ok === entry[2];
    if (!pass) { failed += 1; }
    console.log((pass ? "  ok   " : "  FAIL ") + name);
    if (!pass) {
      result.errors.forEach((e) => console.log("         " + e));
    }
  }

  console.log("");
  if (failed === 0) {
    console.log("All " + cases.length + " acceptance tests pass.");
  } else {
    console.log(failed + " of " + cases.length + " failed.");
  }
  process.exit(failed === 0 ? 0 : 1);
}

/* Importing this file must not run it: run.mjs uses validateRecord, and a
   module that acts on import would validate twice and exit the process. */
const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (!invokedDirectly) {
  /* imported — nothing runs */
} else if (process.argv.includes("--self-test")) {
  selfTest();
} else {
  const seed = loadSeed();
  const ctx = {
    areas: mappableAreas(),
    ledger: loadLedger(),
    known: seedUrls(seed)
  };
  const file = readJson(join(HERE, "candidates.json"), null);
  const records = (file && file.records) || [];

  if (!records.length) {
    console.log("No extracted records in intake/candidates.json to validate.");
    process.exit(0);
  }

  let bad = 0;
  for (const record of records) {
    const result = validateRecord(record, ctx);
    console.log((result.ok ? "ok   " : "FAIL ") + record.data_need.id);
    result.errors.forEach((e) => { bad += 1; console.log("     error:   " + e); });
    result.warnings.forEach((w) => console.log("     warning: " + w));
  }
  process.exit(bad === 0 ? 0 : 1);
}
