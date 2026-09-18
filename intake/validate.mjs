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
  HERE, REPO, loadSeed, seedUrls, loadLedger, ledgerHas, readJson, YEARS_BACK
} from "./lib.mjs";

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

/* Punctuation, case and markup differ between a quotation and the source
   it came from, and none of those differences change what was said. */
export function normalise(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/* Straight and curly quotes both, because the model uses either. A span
   shorter than 20 characters is a phrase, not a quotation, and would
   match almost any abstract by accident. */
const QUOTE = /['"‘’“”]([^'"‘’“”]{20,}?)['"‘’“”]/g;

export function quotedSpans(text) {
  return [...String(text || "").matchAll(QUOTE)]
    .map((match) => normalise(match[1]))
    .filter((span) => span.length >= 20);
}

/* One paper reachable by several addresses: a DOI, a PMC page, a
   publisher link. Compared as text so the check stays offline.

   A URL carrying an identifier is compared on the identifier, because
   the host in front of it varies without the paper changing —
   ncbi.nlm.nih.gov/pmc/articles/PMC123 and pmc.ncbi.nlm.nih.gov/
   articles/PMC123 are one article, and so are doi.org and dx.doi.org. */
const PMC_ID = /pmc\d{5,}/i;
const DOI_IN_URL = /10\.\d{4,9}\/[^\s?#]+/i;

function documentId(value) {
  const url = String(value || "").toLowerCase().replace(/\/+$/, "");
  const pmc = url.match(PMC_ID);
  if (pmc) { return pmc[0]; }

  const doi = url.match(DOI_IN_URL);
  if (doi) { return doi[0].replace(/\/(full|abstract|pdf)$/, ""); }

  return url.replace(/^https?:\/\//, "").replace(/^www\./, "");
}

function sameUrl(a, b) {
  const id = documentId(a);
  return id !== "" && id === documentId(b);
}

/* Titles arrive with a trailing full stop, or a " - PMC" suffix, and a
   containment test in either direction survives both. The length floor
   stops two short titles matching on a shared opening. */
function sameTitle(a, b) {
  const x = normalise(a);
  const y = normalise(b);
  if (x.length < 30 || y.length < 30) { return false; }
  return x.includes(y) || y.includes(x);
}

/* A record that claims data partly exists must point at the data, not
   back at the paper reporting its absence.

   Found on 18 Sep on the disability-inclusive maternity record: status
   "partial", and dataset_source cited the PMC page of the very review
   whose quoted claim was "no eligible studies identified from 22,719
   publications". Nothing caught it, because the rule above only asks
   whether a dataset_source is present.

   A plain URL comparison would have missed that one — the gap claim
   cited doi.org and the dataset cited PMC, two addresses for one paper.
   So three ways in, all offline: the same URL, the record's own DOI
   appearing inside the dataset URL, and the dataset URL matching a
   verification source whose title is the paper's own. */
function citesSamePaper(need, paper) {
  const dataset = need.dataset_source;
  if (!dataset || !isUrl(dataset.source)) { return false; }

  const url = String(dataset.source).toLowerCase();

  if (sameUrl(dataset.source, need.gap_evidence && need.gap_evidence.source)) {
    return true;
  }

  const doi = paper && paper.doi;
  if (has(doi) && url.includes(String(doi).toLowerCase())) { return true; }

  const sources = (need.verification && need.verification.sources) || [];
  return sources.some((entry) =>
    sameUrl(entry && entry.url, dataset.source) &&
    sameTitle(entry && entry.title, paper && paper.title)
  );
}


/* ---------- the design rules ---------- */

/* A design is not a record and never becomes one, so nothing here is about
   provenance. It is about what the platform is willing to hand a researcher
   under its own name.

   Ordinary JavaScript, like every other rule in this file. These are string
   rules over prose and they will misfire in both directions; that is
   tolerable in ONE direction only, and the direction is chosen deliberately.
   A design is optional by construction (SPEC 11) - the app renders a record
   with no design and loses nothing the register claims - so a rule that
   withholds a good design costs a convenience, and a rule that publishes a
   harmful one costs the thing this platform exists to be. When in doubt the
   design is withheld and the record still stands.

   Errors withhold the design. Warnings are for the person at step 7. */

/* Groups whose capacity to consent, or whose exposure to harm, is not an
   ordinary adult volunteer's. */
const VULNERABLE =
  /\bpregnan\w*|\bin lab(o|ou)r\b|\bbreast-?feed\w*|\blactating\b|\bneonat\w*|\bfoetal\b|\bfetal\b|\bchildren\b|\badolescent\w*|\bminors\b|\bprisoner\w*|\brefugee\w*|\basylum\b/i;

/* Language that assigns an exposure rather than observing one. The
   distinction is the whole ethical difference between the pregnancy designs
   in this seed: a cohort of women already taking a drug is not a trial that
   puts them on it. */
const INTERVENTIONAL =
  /\brandomi[sz]\w*|\brandomly assigned?\b|\ballocat\w+ to\b|\btrial arm\b|\btreatment arm\b|\bintervention (group|arm)\b|\bplacebo\b|\bcontrolled trial\b|\bassigned to receive\b|\bcross-?over trial\b/i;

/* The machinery that makes assigning an exposure legitimate. */
const OVERSIGHT =
  /\bethics (approval|committee|review|board)\b|\bIRB\b|\binstitutional review\b|\bdata (and )?safety monitoring\b|\bDSMB\b|\bindependent (monitoring|oversight)\b|\binformed consent\b|\bequipoise\b/i;

/* Administering something to a participant without saying what. */
const UNNAMED_EXPOSURE =
  /\ba panel of\b[^.]{0,80}\b(drugs?|medications?|agents?)\b|\bcommonly prescribed (drugs?|medications?)\b|\bvarious (drugs?|medications?)\b|\ba range of (drugs?|medications?)\b|\bother (drugs?|medications?) as (needed|appropriate|indicated)\b/i;

/* Interventions that restrict eating. */
const RESTRICTION =
  /\btime-?restricted\b|\bintermittent fasting\b|\bfasting (window|protocol|intervention)\b|\bcalorie[- ]restrict\w*|\benergy[- ]restrict\w*|\beating window\b|\bweight[- ]loss (intervention|programme|program|trial)\b/i;

const EATING_SAFEGUARD =
  /\beating disorder\w*\b|\bdisordered eating\b|\bEDE-?Q\b|\bSCOFF\b|\bbinge[- ]eating\b/i;

/* Whether a breakdown by race or ethnicity says what it stands for. */
const RACE = /\brace\b|\bracial\b|\bethnicit\w*|\bethnic group\b/i;
const RACE_RATIONALE =
  /\bstructural\b|\bdisparit\w*|\binequit\w*|\bsocio-?economic\b|\baccess to care\b|\bracism\b|\bproxy for\b|\bunder-?served\b/i;

const POWERED =
  /\bpower(ed)?\b|\bsample size\b|\bprecision\b|\bdetect an?\b|\beffect size\b|\balpha\b/i;

function designText(design) {
  const d = design || {};
  return [
    d.target_women,
    d.form,
    ...(Array.isArray(d.variables) ? d.variables : []),
    ...(Array.isArray(d.stratifiers) ? d.stratifiers : [])
  ].filter(has).join(" \n ");
}

export function validateDesign(design) {
  const errors = [];
  const warnings = [];

  if (!design || typeof design !== "object") {
    return { ok: false, errors: ["No design."], warnings };
  }

  const text = designText(design);
  const assigns = INTERVENTIONAL.test(text);
  const vulnerable = VULNERABLE.test(design.target_women || "");

  /* The one that matters. A trial arm handed to pregnant women in an
     endemic low-resource region, with no ethics approval, no consent
     procedure and no monitoring board named anywhere in it, is not a
     starting point for a researcher - it is a liability with a citation
     attached, and "AI-generated, unverified" does not cover it. */
  if (assigns && vulnerable && !OVERSIGHT.test(text)) {
    errors.push(
      "This design assigns an intervention to a vulnerable population and " +
      "names no oversight. An interventional design on pregnant women, " +
      "women in labour, children or a comparable group must name its " +
      "ethics approval, its consent procedure and its independent safety " +
      "monitoring, or it is not publishable here."
    );
  }

  /* What exactly is being given to the participant. */
  if (UNNAMED_EXPOSURE.test(text)) {
    errors.push(
      "This design administers something it does not name. Every substance " +
      "given to a participant is named, or the design is withheld: a " +
      "reader cannot weigh a risk described as \"a panel of commonly " +
      "prescribed drugs\"."
    );
  }

  /* Restricting what a young woman eats, for months, is an intervention
     with a known harm, and screening for it is standard rather than
     optional. */
  if (RESTRICTION.test(text) && !EATING_SAFEGUARD.test(text)) {
    errors.push(
      "This design restricts eating and says nothing about disordered " +
      "eating. A dietary-restriction intervention names its screening and " +
      "exclusion for eating disorders, and monitors for them, or it is " +
      "withheld."
    );
  }

  /* Warnings: the design is published, and the person at step 7 is told. */
  const stratifiers = Array.isArray(design.stratifiers) ? design.stratifiers : [];
  if (stratifiers.some((s) => RACE.test(String(s))) && !RACE_RATIONALE.test(text)) {
    warnings.push(
      "Breaks results down by race or ethnicity without saying what it " +
      "stands for. A breakdown that does not say whether it is tracking " +
      "structural factors or is being read as biology invites the second."
    );
  }

  if (/\d/.test(design.target_women || "") && !POWERED.test(text)) {
    warnings.push(
      "States a sample size and does not say where it came from. It is a " +
      "figure, not a calculation, and a reader will take it for one."
    );
  }

  if (!OVERSIGHT.test(text)) {
    warnings.push(
      "Names no ethics approval, consent procedure or data protection. " +
      "True of every design this pipeline has produced; the app says so on " +
      "the card rather than letting each design imply it is complete."
    );
  }

  return { ok: errors.length === 0, errors, warnings };
}

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

  /* A date is not a result. A record was marked "missing" on 18 Sep on
     the back of a search the model itself reported as failed — its
     findings read "I cannot confirm or deny" — and it passed, because
     checked_at was present and sources had been captured. A status is a
     claim about what a search found, so a search that found nothing
     usable may not produce one. */
  if (check && check.search_outcome && check.search_outcome !== "reviewed") {
    errors.push(
      "verification.search_outcome is " + JSON.stringify(check.search_outcome) +
      ". A status may not be set from a check that did not happen."
    );
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
    } else if (citesSamePaper(need, record.paper)) {
      errors.push(
        "dataset_source cites the same paper as the gap claim. A record " +
        "may not use the source that reported the absence as evidence " +
        "that the data exists."
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

  /* --- the claim must carry the source's own words --- */

  /* Checked against the abstract the record was extracted from, while it
     is still on the candidate. Three of four records rejected by hand on
     18 Sep would have failed here: two quoted nothing at all and stated
     the extractor's own reading, and one quoted correctly but inverted
     the meaning — "concordant findings" turned into a claim that
     measurement varies. The middle case is the one a human misses,
     because a quotation mark reads as provenance.

     A record already merged into data.js carries no abstract, so the
     rule applies where it can be enforced: before a human sees it. */
  const abstract = record.paper && record.paper.abstract;
  if (has(abstract) && evidence && has(evidence.note)) {
    const spans = quotedSpans(evidence.note);
    const source = normalise(abstract);

    if (spans.length === 0) {
      errors.push(
        "gap_evidence.note quotes nothing. The claim must carry the " +
        "source's own words in quotation marks, so a reader can check it."
      );
    } else if (!spans.some((span) => source.includes(span))) {
      errors.push(
        "gap_evidence.note quotes text that is not in the abstract. " +
        "Quoted: " + JSON.stringify(spans[0].slice(0, 70))
      );
    }
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


/* ---------- the design acceptance tests ---------- */

function baseDesign() {
  return {
    target_women:
      "Recruit 300 women aged 40-75 with symptoms of urinary incontinence " +
      "from 8-10 primary care practices.",
    variables: ["Symptom severity at baseline and 3 months"],
    stratifiers: ["Age band (40-54 vs 55-69 vs 70+)"],
    form:
      "Prospective observational cohort with follow-up at 3 and 12 months.",
    instrument_source: "ICIQ-UI Short Form"
  };
}

function designSelfTest() {
  const cases = [];

  cases.push(["an observational design passes", baseDesign(), true]);

  /* The shape that started this: a randomised trial in pregnant women in
     endemic low-resource regions, with no oversight named anywhere. */
  const trial = baseDesign();
  trial.target_women =
    "Recruit 300 pregnant women diagnosed with active brucellosis from " +
    "obstetric clinics in endemic regions, any gestational age.";
  trial.form =
    "A multi-site randomized controlled trial comparing at least two " +
    "antibiotic regimens considered plausibly safe in pregnancy.";
  cases.push([
    "a trial on pregnant women with no oversight is withheld", trial, false
  ]);

  const supervised = JSON.parse(JSON.stringify(trial));
  supervised.form +=
    " Ethics approval at every site, written informed consent before " +
    "enrolment, and an independent data safety monitoring board.";
  cases.push([
    "the same trial naming its oversight passes", supervised, true
  ]);

  /* An interventional design on adults who are not a vulnerable group is
     not caught by that rule, and should not be. */
  const ordinary = baseDesign();
  ordinary.form =
    "A pragmatic randomized controlled trial of a decision aid versus " +
    "usual care.";
  cases.push(["a trial on ordinary adults passes", ordinary, true]);

  const unnamed = baseDesign();
  unnamed.variables = [
    "Plasma concentration-time curve for a panel of commonly prescribed " +
    "drugs metabolized by these pathways"
  ];
  cases.push([
    "a design dosing unnamed drugs is withheld", unnamed, false
  ]);

  const named = baseDesign();
  named.variables = [
    "CYP3A4 activity measured via midazolam probe drug clearance"
  ];
  cases.push(["a design naming its probe drug passes", named, true]);

  const fasting = baseDesign();
  fasting.target_women = "Recruit 160 women aged 18-40 with PCOS.";
  fasting.form =
    "Two-arm randomised trial: the intervention group follows an 8-hour " +
    "daily eating window for 12 months.";
  cases.push([
    "a dietary-restriction trial with no eating-disorder safeguard is " +
    "withheld", fasting, false
  ]);

  const screened = JSON.parse(JSON.stringify(fasting));
  screened.form +=
    " Women with a current or past eating disorder are excluded at " +
    "screening and disordered eating is monitored throughout.";
  cases.push([
    "the same trial screening for eating disorders passes", screened, true
  ]);

  /* Warnings do not withhold. */
  const raced = baseDesign();
  raced.stratifiers = ["Ethnicity"];
  const racedResult = validateDesign(raced);
  cases.push(["an unexplained ethnicity breakdown still publishes", raced, true]);

  let failed = 0;
  for (const entry of cases) {
    const result = validateDesign(entry[1]);
    const pass = result.ok === entry[2];
    if (!pass) { failed += 1; }
    console.log((pass ? "  ok   " : "  FAIL ") + entry[0]);
    if (!pass) { result.errors.forEach((e) => console.log("         " + e)); }
  }

  const warned = racedResult.warnings.length > 0;
  if (!warned) { failed += 1; }
  console.log((warned ? "  ok   " : "  FAIL ") +
              "an unexplained ethnicity breakdown warns the reviewer");

  return { failed, total: cases.length + 1 };
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
  cases.push(["a claim older than the window is rejected", stale, false]);

  /* The circularity rule, on the shape that produced it: a partial
     record whose dataset_source leads back to the paper that said
     nothing had been collected. */
  const partial = () => {
    const record = base();
    record.paper.title =
      "A lack of evidence for disability-inclusive maternal health " +
      "interventions and promising progress: an updated systematic review.";
    record.data_need.status = "partial";
    record.data_need.gap_evidence.source = "https://doi.org/10.0000/test";
    record.data_need.dataset_source = {
      note: "Some adjacent work exists but does not fill the gap.",
      source: "https://example.org/registry"
    };
    return record;
  };

  const other = partial();
  cases.push(["a dataset_source naming another source passes", other, true]);

  const repeated = partial();
  repeated.data_need.dataset_source.source = "https://doi.org/10.0000/test/";
  cases.push([
    "a dataset_source repeating the gap URL is rejected", repeated, false
  ]);

  const byDoi = partial();
  byDoi.data_need.dataset_source.source =
    "https://www.frontiersin.org/articles/10.0000/test/full";
  cases.push([
    "a dataset_source carrying the record's own DOI is rejected", byDoi, false
  ]);

  /* The real one. Two addresses for a single paper, so the URLs differ
     and only the title reached through verification.sources gives it
     away. This case is why the rule is not a string comparison. */
  const byTitle = partial();
  byTitle.data_need.dataset_source.source =
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12748227/";
  byTitle.data_need.verification.sources = [{
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12748227/",
    title: "A lack of evidence for disability-inclusive maternal health " +
           "interventions and promising progress: an updated systematic " +
           "review - PMC"
  }];
  cases.push([
    "a dataset_source reaching the gap paper by another URL is rejected",
    byTitle, false
  ]);

  const sourced = base();
  sourced.data_need.collection_guidance = {
    note: "The guideline specifies a 24-hour time-use diary at 3 and 9 months.",
    source: "https://example.org/guideline"
  };
  cases.push(["guidance that cites its source passes", sourced, true]);

  /* The quotation rule. Only bites where the abstract is on the record,
     which is exactly where it can be enforced: before a human sees it. */
  const ABSTRACT =
    "We searched four databases through March 2026. No studies reported " +
    "outcomes beyond six weeks postpartum, and the certainty of evidence " +
    "was low throughout.";

  const quoted = base();
  quoted.paper.abstract = ABSTRACT;
  quoted.data_need.gap_evidence.note =
    "The review states that 'no studies reported outcomes beyond six " +
    "weeks postpartum', which is the gap this record carries forward.";
  cases.push(["a note quoting the abstract passes", quoted, true]);

  const unquoted = base();
  unquoted.paper.abstract = ABSTRACT;
  unquoted.data_need.gap_evidence.note =
    "The review suggests that follow-up after birth is probably too " +
    "short to detect the outcomes that matter to women over a year.";
  cases.push(["a note that quotes nothing is rejected", unquoted, false]);

  const unchecked2 = base();
  unchecked2.data_need.verification.search_outcome = "failed";
  cases.push([
    "a status from a failed search is rejected", unchecked2, false
  ]);

  const checked = base();
  checked.data_need.verification.search_outcome = "reviewed";
  cases.push(["a status from a completed search passes", checked, true]);

  const misquoted = base();
  misquoted.paper.abstract = ABSTRACT;
  misquoted.data_need.gap_evidence.note =
    "The review states that 'no studies measured symptoms at twelve " +
    "months or later', which is the gap this record carries forward.";
  cases.push(["a quotation not in the abstract is rejected", misquoted, false]);

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
  const designs = designSelfTest();
  failed += designs.failed;

  const total = cases.length + designs.total;
  console.log("");
  if (failed === 0) {
    console.log("All " + total + " acceptance tests pass.");
  } else {
    console.log(failed + " of " + total + " failed.");
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
} else if (process.argv.includes("--designs")) {
  /* Reports; it never writes. research-designs.js is rendered by run.mjs
     from intake/designs.json and is not hand-edited, so the way to change
     what the app serves is to change a rule here and render again. */
  const archive = readJson(join(HERE, "designs.json"), {});
  const ids = Object.keys(archive);

  if (!ids.length) {
    console.log("No designs in intake/designs.json.");
    process.exit(0);
  }

  let withheld = 0;
  for (const id of ids) {
    const result = validateDesign(archive[id]);
    if (!result.ok) { withheld += 1; }
    console.log((result.ok ? "ok       " : "WITHHELD ") + id);
    result.errors.forEach((e) => console.log("     error:   " + e));
    result.warnings.forEach((w) => console.log("     warning: " + w));
  }

  console.log("");
  console.log(ids.length - withheld + " of " + ids.length +
              " designs publishable; " + withheld + " withheld.");
  process.exit(0);
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
