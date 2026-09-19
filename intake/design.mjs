/* Study designs, drafted after approval and not before.

   A design used to be generated inside the run, for every candidate, at
   the moment the record was extracted — including for the candidates that
   were about to be dismissed. Roughly a third of them were, so roughly a
   third of the design spend bought nothing. Worse, it inverted the order
   the platform claims: a design is an answer to a record, and the record
   was not yet a record.

   So the design step lives here, behind the human decision. A design is
   drafted only for a data need that is in data.js — approved in the
   ledger AND merged into the seed. Nothing else is eligible, which is the
   whole point: the money follows the approval.

   This is the only file besides run.mjs that spends. It also owns
   intake/designs.json (the archive) and research-designs.js (what the app
   loads), so a render can be re-run for free after a rule changes.

   Usage:
     node intake/design.mjs                  what is pending — free, no key
     node intake/design.mjs --limit=2        draft the next two
     node intake/design.mjs --all            draft every pending one
     node intake/design.mjs --id=<need id>   draft one, named
     node intake/design.mjs --render         re-render only, no model
     node intake/design.mjs --redo --id=...  replace a design already held

   SPEC §13 holds for the tooling too: no dependencies, no build step. */

import { join } from "node:path";
import { writeFileSync } from "node:fs";
import {
  HERE, REPO, readJson, writeJson, loadSeed,
  publishableDesigns, renderDesigns, WITHHELD
} from "./lib.mjs";
import { designFor } from "./steps.mjs";
import { spendLine } from "./model.mjs";
import { validateDesign } from "./validate.mjs";

const DESIGNS_JSON = join(HERE, "designs.json");
const DESIGNS_JS = join(REPO, "research-designs.js");

function arg(name) {
  const hit = process.argv.find((a) => a.startsWith("--" + name + "="));
  return hit ? hit.slice(("--" + name + "=").length) : null;
}

const wantedId = arg("id");
const limitArg = arg("limit");
const all = process.argv.includes("--all");
const renderOnly = process.argv.includes("--render");
const redo = process.argv.includes("--redo");

const seed = loadSeed();
const designs = readJson(DESIGNS_JSON, {});

/* ---------- what is eligible ---------- */

/* Eligible means: in the seed, and still worth answering. A need whose
   data turned out to exist does not need a study design — the study has
   been done and the card points at it. That rule was in the run and moves
   here with the step. */
function eligible() {
  const rows = [];

  for (const problem of seed.problems) {
    for (const need of problem.data_needs || []) {
      rows.push({
        id: need.id,
        status: need.status,
        area: problem.area,
        /* designFor reads the extract shape, and a seed record carries
           every field it wants under different parents. Assembled here so
           the prompt is fed the same thing it always was. */
        extracted: {
          problem: {
            area: problem.area,
            title: problem.title,
            affected_women: problem.affected_women
          },
          data_need: {
            description: need.description,
            why_it_matters: need.why_it_matters
          }
        }
      });
    }
  }
  return rows;
}

const rows = eligible();
const pending = rows.filter((row) =>
  row.status !== "collected" && !Object.hasOwn(designs, row.id));

/* ---------- render ---------- */

/* Free, and separable on purpose: the design rules in validate.mjs get
   tightened, and the way to change what the app serves is to change a
   rule and render again — never to edit research-designs.js. */
function render() {
  const published = publishableDesigns(designs, seed,
    (design) => validateDesign(design));

  writeFileSync(DESIGNS_JS, renderDesigns(published), "utf8");

  for (const id of published[WITHHELD]) {
    console.log("  withheld: " + id);
    validateDesign(designs[id]).errors.forEach((e) => console.log("      " + e));
  }

  console.log("Wrote " + Object.keys(published).length +
              " designs to research-designs.js (" +
              Object.keys(designs).length + " in the archive, " +
              published[WITHHELD].length + " withheld by the design rules).");
}

/* ---------- the list ---------- */

function list() {
  const held = rows.filter((row) => Object.hasOwn(designs, row.id)).length;
  const collected = rows.filter((row) => row.status === "collected").length;

  console.log("");
  console.log(rows.length + " approved data need" +
              (rows.length === 1 ? "" : "s") + " in data.js · " +
              held + " already drafted" +
              (collected ? " · " + collected + " need none (data exists)" : ""));
  console.log("");

  if (pending.length === 0) {
    console.log("Nothing pending. Every approved record that wants a design has one.");
    console.log("Re-render what the app serves:  node intake/design.mjs --render");
    return;
  }

  console.log(pending.length + " waiting for a design:");
  console.log("");
  pending.forEach((row) => {
    console.log("  " + row.status.padEnd(9) + " " + row.id);
    console.log("            " + row.area);
  });
  console.log("");
  /* Stated as money, because that is the decision being made here. The
     design call is the cheap half of a record — the verify search is the
     expensive one — but it is still a choice and it should read like one. */
  console.log("Drafting costs roughly $0.02 each.");
  console.log("");
  console.log("  node intake/design.mjs --limit=" + Math.min(pending.length, 2));
  console.log("  node intake/design.mjs --all");
}

/* ---------- drafting ---------- */

async function draft(queue) {
  let written = 0;

  for (const row of queue) {
    console.log("");
    console.log("· " + row.id);

    try {
      const design = await designFor(row.extracted);
      designs[row.id] = design;
      written += 1;

      const verdict = validateDesign(design);
      console.log("  " + (verdict.ok ? "drafted" : "drafted, WITHHELD by the rules"));
      verdict.errors.forEach((e) => console.log("    error:   " + e));
      verdict.warnings.forEach((w) => console.log("    warning: " + w));

    } catch (error) {
      /* A design failure is never fatal here: §11 requires the app to work
         with research-designs.js absent, so one record simply offers no
         design and the rest of the queue continues. */
      console.log("  failed: " + error.message.split("\n")[0]);
    }
  }

  /* Written even on a partial queue — a draft that was paid for is kept. */
  if (written) { writeJson(DESIGNS_JSON, designs); }

  console.log("");
  console.log(written + " of " + queue.length + " drafted.");
  console.log("Spend: " + spendLine());
  console.log("");
  render();
}

/* ---------- main ---------- */

if (renderOnly) {
  render();

} else if (wantedId) {
  const row = rows.find((r) => r.id === wantedId);

  if (!row) {
    console.log("No approved data need with id " + JSON.stringify(wantedId) + ".");
    console.log("A design is drafted only for a record already merged into");
    console.log("data.js. Approve and merge it first, then come back.");
    process.exit(1);
  }
  if (Object.hasOwn(designs, row.id) && !redo) {
    console.log("Already drafted: " + row.id);
    console.log("Replace it (and pay again):  node intake/design.mjs --redo --id=" + row.id);
    process.exit(0);
  }
  await draft([row]);

} else if (all || limitArg) {
  if (pending.length === 0) {
    console.log("Nothing pending.");
    render();
    process.exit(0);
  }
  const limit = limitArg ? Math.max(1, Number(limitArg)) : pending.length;
  await draft(pending.slice(0, limit));

} else {
  list();
}
