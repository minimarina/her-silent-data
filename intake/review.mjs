/* Reading candidates, and deciding about them.

   No model runs here and no key is needed — this is the human step, and
   the point of the whole pipeline is that it exists. The run produces
   claims; this is where someone checks them against the source.

   Approving does NOT write data.js. It prints the block to paste, and
   intake/README.md's rule holds: the seed is never written by a machine.

   Usage:
     node intake/review.mjs                 list what is waiting
     node intake/review.mjs 3               read candidate 3 in full
     node intake/review.mjs 3 --approve     mark approved, print the block
     node intake/review.mjs 3 --dismiss     drop it, with a reason
       --why="the abstract does not support the note"                    */

import { join } from "node:path";
import {
  HERE, readJson, writeJson, loadLedger, saveLedger, ledgerNote
} from "./lib.mjs";
import { mappableAreas } from "./validate.mjs";

const CANDIDATES = join(HERE, "candidates.json");

const file = readJson(CANDIDATES, null);
const records = (file && file.records) || [];

function arg(name) {
  const hit = process.argv.find((a) => a.startsWith("--" + name + "="));
  return hit ? hit.slice(("--" + name + "=").length) : null;
}

const wanted = process.argv.find((a) => /^\d+$/.test(a));
const approving = process.argv.includes("--approve");
const dismissing = process.argv.includes("--dismiss");

if (records.length === 0) {
  console.log("No candidates waiting. Run: node intake/run.mjs --limit=4");
  process.exit(0);
}

const areas = mappableAreas();

/* ---------- the list ---------- */

function list() {
  console.log("");
  console.log(records.length + " candidate" + (records.length === 1 ? "" : "s") +
              " waiting in intake/candidates.json");
  console.log("");

  records.forEach((record, index) => {
    const need = record.data_need;
    const flags = [];

    if (!record.validation || !record.validation.ok) { flags.push("INVALID"); }
    if (!areas.has(need.area)) { flags.push("no map point"); }
    if (need.collection_guidance) { flags.push("has guidance"); }

    console.log("  " + String(index + 1).padStart(2) + ". " +
                need.status.padEnd(9) + " " + need.area);
    console.log("      " + need.description.slice(0, 74));
    if (flags.length) { console.log("      ⚠ " + flags.join(" · ")); }
    console.log("");
  });

  console.log("Read one in full:  node intake/review.mjs 1");
}

/* ---------- one candidate, in full ---------- */

function wrap(text, indent) {
  const width = 74;
  const pad = " ".repeat(indent);
  const words = String(text || "").split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    if ((line + " " + word).trim().length > width) {
      lines.push(pad + line.trim());
      line = word;
    } else {
      line += " " + word;
    }
  }
  if (line.trim()) { lines.push(pad + line.trim()); }
  return lines.join("\n");
}

function show(record, index) {
  const need = record.data_need;
  const paper = record.paper;

  console.log("");
  console.log("CANDIDATE " + (index + 1) + " — " + need.id);
  console.log("=".repeat(76));
  console.log("");
  console.log("THE SOURCE — open this and read the abstract");
  console.log("  " + paper.url);
  console.log("  " + (paper.journal || "unstated") + ", " + (paper.year || "?"));
  console.log(wrap(paper.title, 2));
  console.log("");

  console.log("WHAT THE RECORD CLAIMS THE SOURCE SAID");
  console.log("  This is the sentence to check. It is the record's evidence,");
  console.log("  and a judge can open the citation and compare.");
  console.log("");
  console.log(wrap(need.gap_evidence.note, 2));
  console.log("");
  console.log("  Gap claimed: " + need.gap_evidence.claimed_date +
              "   Region: " + (need.gap_evidence.region || "not specified"));
  console.log("");

  console.log("AREA: " + need.area +
              (areas.has(need.area)
                ? " (has a map point)"
                : "  ⚠ no map point — will list without a pin"));
  console.log("");

  console.log("PROBLEM: " + need.problem_id);
  console.log(wrap(record.problem.title, 2));
  console.log("");
  console.log(wrap(record.problem.summary, 2));
  console.log("");
  console.log("  Affected: " + wrap(record.problem.affected_women, 0).trim());
  console.log("");

  console.log("THE DATA NEED");
  console.log(wrap(need.description, 2));
  console.log("");
  console.log(wrap("Why: " + need.why_it_matters, 2));
  console.log("");

  console.log("STATUS: " + need.status);
  console.log(wrap(need.verification.findings, 2));
  console.log("");
  console.log("  Checked " + need.verification.checked_at + " · " +
              need.verification.sources.length + " sources");
  need.verification.sources.slice(0, 4).forEach((s) => {
    console.log("    " + s.url);
  });
  console.log("");

  if (need.dataset_source) {
    console.log("DATASET FOUND");
    console.log(wrap(need.dataset_source.note, 2));
    console.log("  " + need.dataset_source.source);
    console.log("");
  }

  console.log("COLLECTION GUIDANCE: " +
    (need.collection_guidance
      ? "PRESENT — check the source really specified this"
      : "null (the normal case)"));
  if (need.collection_guidance) {
    console.log(wrap(need.collection_guidance.note, 2));
  }
  console.log("");

  const validation = record.validation || { ok: false, errors: [], warnings: [] };
  console.log("VALIDATION: " + (validation.ok ? "passes" : "FAILS"));
  (validation.errors || []).forEach((e) => console.log("  error:   " + e));
  (validation.warnings || []).forEach((w) => console.log("  warning: " + w));
  console.log("");

  console.log("-".repeat(76));
  console.log("Before approving, confirm against the abstract:");
  console.log("  1. The source really says the data is missing.");
  console.log("  2. The gap is about women, and about DATA, not a mechanism.");
  console.log("  3. The paper does not itself fill the gap it names.");
  console.log("  4. The area is right. Fix it in the block below if not.");
  console.log("");
  console.log("  node intake/review.mjs " + (index + 1) + " --approve");
  console.log("  node intake/review.mjs " + (index + 1) + ' --dismiss --why="..."');
}

/* ---------- approving ---------- */

/* Printed for pasting, never written. A machine that edited data.js would
   make the register's central claim false. */
function block(record) {
  const need = record.data_need;
  const problem = record.problem;
  const q = (value) => JSON.stringify(value);

  const lines = [];
  lines.push("    {");
  lines.push("      id: " + q(problem.id) + ",");
  lines.push("      title:");
  lines.push("        " + q(problem.title) + ",");
  lines.push("      area: " + q(problem.area) + ",");
  lines.push("      summary:");
  lines.push("        " + q(problem.summary) + ",");
  lines.push("      affected_women:");
  lines.push("        " + q(problem.affected_women) + ",");
  lines.push("      source:");
  lines.push("        " + q(problem.source) + ",");
  lines.push('      origin: "sourced",');
  lines.push("      is_demo: false,");

  if (!areas.has(problem.area)) {
    lines.push("      /* No MAP_POINTS entry for this area yet. Add one in");
    lines.push("         app.js, or this problem lists without a pin. */");
  }

  lines.push("      data_needs: [");
  lines.push("        {");
  lines.push("          id: " + q(need.id) + ",");
  lines.push("          problem_id: " + q(need.problem_id) + ",");
  lines.push("          description:");
  lines.push("            " + q(need.description) + ",");
  lines.push("          why_it_matters:");
  lines.push("            " + q(need.why_it_matters) + ",");
  lines.push("          status: " + q(need.status) + ",");
  lines.push('          existing_data_note: "",');
  lines.push("          gap_evidence: {");
  lines.push("            source:");
  lines.push("              " + q(need.gap_evidence.source) + ",");
  lines.push("            note:");
  lines.push("              " + q(need.gap_evidence.note) + ",");
  lines.push("            region: " + q(need.gap_evidence.region) + ",");
  lines.push("            claimed_date: " + q(need.gap_evidence.claimed_date));
  lines.push("          },");

  if (need.dataset_source) {
    lines.push("          dataset_source: {");
    lines.push("            note:");
    lines.push("              " + q(need.dataset_source.note) + ",");
    lines.push("            source:");
    lines.push("              " + q(need.dataset_source.source));
    lines.push("          },");
  } else {
    lines.push("          dataset_source: null,");
  }

  if (need.collection_guidance) {
    lines.push("          collection_guidance: {");
    lines.push("            note:");
    lines.push("              " + q(need.collection_guidance.note) + ",");
    lines.push("            source:");
    lines.push("              " + q(need.collection_guidance.source));
    lines.push("          },");
  } else {
    lines.push("          collection_guidance: null,");
  }

  lines.push("          verification: {");
  lines.push("            checked_at: " + q(need.verification.checked_at) + ",");
  lines.push("            method: " + q(need.verification.method) + ",");
  lines.push("            findings:");
  lines.push("              " + q(need.verification.findings) + ",");
  lines.push("            sources: " +
             JSON.stringify(need.verification.sources.map((s) => s.url)));
  lines.push("          }");
  lines.push("        }");
  lines.push("      ]");
  lines.push("    },");

  return lines.join("\n");
}

function decide(record, index, outcome) {
  const ledger = loadLedger();
  const why = arg("why");

  if (outcome === "dismissed" && !why) {
    console.log("A dismissal needs a reason: --why=\"...\"");
    console.log("It goes in the ledger, which is committed — the rejection");
    console.log("becomes public provenance rather than a private decision.");
    process.exit(1);
  }

  ledgerNote(ledger, record.paper.doi, outcome, record.paper.title);
  if (why) {
    ledger.entries[String(record.paper.doi).toLowerCase()].reason = why;
  }
  saveLedger(ledger);

  file.records = records.filter((r) => r !== record);
  writeJson(CANDIDATES, file);

  if (outcome === "dismissed") {
    console.log("");
    console.log("Dismissed: " + record.data_need.id);
    console.log("Reason recorded in the ledger. " + file.records.length +
                " candidates left.");
    return;
  }

  console.log("");
  console.log("Approved in the ledger: " + record.data_need.id);
  console.log(file.records.length + " candidates left.");
  console.log("");
  console.log("Paste this into the problems array in data.js:");
  console.log("");
  console.log(block(record));
  console.log("");

  if (!areas.has(record.problem.area)) {
    console.log("⚠ " + record.problem.area + " has no map point. To place it,");
    console.log("  add an entry to MAP_POINTS in app.js. Until then the");
    console.log("  problem lists but does not pin — honest, and visible.");
    console.log("");
  }
}

/* ---------- main ---------- */

if (!wanted) {
  list();
} else {
  const index = Number(wanted) - 1;
  const record = records[index];

  if (!record) {
    console.log("There is no candidate " + wanted + ". " +
                records.length + " are waiting.");
    process.exit(1);
  }

  if (approving) {
    decide(record, index, "approved");
  } else if (dismissing) {
    decide(record, index, "dismissed");
  } else {
    show(record, index);
  }
}
