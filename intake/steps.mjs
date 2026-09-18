/* The four model steps: filter, extract, verify, design.

   The prompts live here rather than in run.mjs because they are the part
   worth reading. Each one exists to enforce a rule the platform states
   about itself, and the rules are repeated to the model in the words the
   validator uses, so that what is asked for and what is checked are the
   same sentence.

   The rule underneath all of them: NOTHING IS INVENTED AND STORED. What
   a record carries came from its source, or it is null. */

import {
  callModel, textOf, jsonOf, searchSourcesOf,
  FILTER_MODEL, WORK_MODEL
} from "./model.mjs";
import { mappableAreas } from "./validate.mjs";
import { today } from "./lib.mjs";

/* The areas that already have a hand-measured coordinate. These are
   PREFERRED, not required: a coordinate takes a few minutes to measure
   against the silhouette, so a genuinely new area is a small piece of
   work rather than a dead end.

   Version 2 of the filter forced every paper into one of these five, and
   the result was a knee-health study filed under Autoimmune disease. A
   record in a new area lists without a pin until its coordinate exists,
   which the validator warns about — visible and honest, where a wrong
   area is neither. */
export const AREAS = [...mappableAreas()];

/* ---------- 1 · filter ---------- */

/* Bump this whenever the prompt below changes in a way that would change
   a verdict. Rejections carry the version that produced them, and a
   rejection from an older version is reopened — see ledgerJudged. */
export const FILTER_VERSION = 3;

/* Spelled out because "Maternal health" alone is not enough to judge
   membership by: version 1 filed a paper about bacterial vaginosis under
   it, and the extractor then had no better option in the enum. */
const AREA_GLOSS = {
  "Menopause":
    "perimenopause, menopause, postmenopause; their symptoms and treatment",
  "Maternal health":
    "pregnancy, birth, the postnatal period, breastfeeding",
  "Autoimmune disease":
    "lupus, rheumatoid arthritis, MS, thyroid and other autoimmune " +
    "conditions in women, including diagnostic delay",
  "Cardiovascular health":
    "heart disease and stroke in women; symptoms, diagnosis, treatment",
  "Endometriosis":
    "endometriosis and adenomyosis; diagnosis, pain, treatment response"
};

const FILTER_SYSTEM =
  "You screen medical abstracts for one narrow thing: a statement that " +
  "specific data about women or female subjects has not been collected, " +
  "studied or reported.\n\n" +
  "Answer YES only if ALL of these hold.\n\n" +
  "1. The abstract points to a gap in what has been MEASURED or " +
  "COLLECTED — not merely that a mechanism is poorly understood.\n\n" +
  "2. The MISSING DATA is about women, female patients or female " +
  "subjects. Read this strictly: it is the subject of the absent data " +
  "that matters, not the subject of the paper. A paper about a condition " +
  "in men, noting that the evidence was extrapolated from studies of " +
  "women, is a NO — the gap it names is a gap in data about men.\n\n" +
  "3. The subject is women's health, anywhere in it. These areas are " +
  "already in the register:\n" +
  AREAS.map((area) => "   - " + area + ": " + (AREA_GLOSS[area] || "")).join("\n") +
  "\n   A paper outside all of them is still a YES if it is squarely " +
  "about women's health — bone and joint health, mental health, " +
  "occupational health, access to care and others are all in scope.\n\n" +
  "4. The paper does not itself close the gap it names. An introduction " +
  "often states a gap to justify the work that follows — 'data are " +
  "lacking, therefore we conducted…' — and that describes the past, not " +
  "the present. If the abstract goes on to report collecting or analysing " +
  "the very data it called missing, answer NO.\n\n" +
  "A paper that names a gap it leaves open is a YES whatever its type: a " +
  "review, a guideline, a commentary, a cohort study whose limitations " +
  "expose an absence, or a study that answers one question and reports " +
  "that a neighbouring one has no data.\n\n" +
  "Reply with exactly one word: YES or NO.";

export async function filterAbstract(paper) {
  const response = await callModel({
    model: FILTER_MODEL,
    system: FILTER_SYSTEM,
    user: `Title: ${paper.title}\n\nAbstract: ${paper.abstract}`,
    maxTokens: 16
  });

  return textOf(response).toUpperCase().startsWith("YES");
}

/* ---------- 2 · extract ---------- */

/* Strict schema: every field required, nothing extra, nullable where the
   source may simply not say. `collection_guidance` is the field the whole
   rebuild turns on, so it is nullable and the prompt says null is normal. */
const EXTRACT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["problem", "data_need"],
  properties: {
    problem: {
      type: "object",
      additionalProperties: false,
      required: ["id", "title", "area", "summary", "affected_women"],
      properties: {
        id: {
          type: "string",
          description: "kebab-case, 2-4 words, e.g. menopause-workplace"
        },
        title: {
          type: "string",
          description: "One sentence naming the problem, not the paper."
        },
        area: {
          type: "string",
          description:
            "Use one of these exactly if the paper sits squarely inside " +
            "it: " + AREAS.join("; ") + ". If none of them fits, name a " +
            "new area in one or two words, as a field of health rather " +
            "than a disease (e.g. 'Bone and joint health', 'Mental " +
            "health'). A forced fit is worse than a new area."
        },
        summary: {
          type: "string",
          description:
            "2-4 sentences. Only what this source supports. No statistics " +
            "the abstract does not contain."
        },
        affected_women: {
          type: "string",
          description: "Who is affected, as the source describes them."
        }
      }
    },
    data_need: {
      type: "object",
      additionalProperties: false,
      required: [
        "id", "description", "why_it_matters", "gap_note",
        "region", "collection_guidance"
      ],
      properties: {
        id: {
          type: "string",
          description: "kebab-case, starts with the problem id."
        },
        description: {
          type: "string",
          description: "The data that is missing, in one line."
        },
        why_it_matters: {
          type: "string",
          description: "One or two sentences on what the absence costs."
        },
        gap_note: {
          type: "string",
          description:
            "At least 80 characters. State what THIS source says is " +
            "missing, closely following its own wording. This is the " +
            "record's evidence, so it must be defensible against the " +
            "abstract."
        },
        region: {
          type: ["string", "null"],
          description: "Country or region, if the source names one. Else null."
        },
        collection_guidance: {
          type: ["object", "null"],
          additionalProperties: false,
          required: ["note"],
          properties: {
            note: {
              type: "string",
              description:
                "How and from whom to collect, as the source specified it."
            }
          },
          description:
            "null unless the source ITSELF recommends how the MISSING " +
            "data should be collected. A description of what this study " +
            "did is not guidance — it belongs nowhere in the record."
        }
      }
    }
  }
};

const EXTRACT_SYSTEM =
  "You turn one published abstract into one record for a register of " +
  "gaps in data about women's health.\n\n" +
  "THE RULE THIS REGISTER RESTS ON: nothing is invented and stored. " +
  "Every field must be supported by the abstract you are given. You may " +
  "compress and rephrase; you may not add a fact, a number, a population " +
  "or a method that the abstract does not contain.\n\n" +
  "`collection_guidance` is the field this matters most for, and there is " +
  "one specific way of getting it wrong.\n\n" +
  "It means: the source RECOMMENDS how the data that is still missing " +
  "should be collected — prospective, addressed to whoever does the work " +
  "next. 'Investigators should use probe-substrate studies in cisgender " +
  "women and transgender people' is guidance.\n\n" +
  "It does NOT mean the methods of the study you are reading. " +
  "'Researchers conducted semi-structured interviews with 35 women " +
  "firefighters' is a description of work already done. It is past tense, " +
  "it describes this paper, and it is NOT guidance — return null. Copying " +
  "a methods section into this field is the most common error here and it " +
  "quietly breaks the rule the whole register rests on.\n\n" +
  "**null is the expected answer.** Most abstracts recommend nothing. " +
  "Returning null is a correct result, not a failure.\n\n" +
  "`gap_note` is the record's evidence. A reader will open the citation " +
  "and check it against your sentence, so stay close to what the authors " +
  "wrote.\n\n" +
  "Write plainly, for a non-specialist reader. No marketing language.";

export async function extractRecord(paper) {
  const response = await callModel({
    model: WORK_MODEL,
    system: EXTRACT_SYSTEM,
    user:
      `Title: ${paper.title}\n` +
      `Journal: ${paper.journal || "unstated"}\n` +
      `Published: ${paper.date || paper.year || "unstated"}\n\n` +
      `Abstract:\n${paper.abstract}`,
    /* Generous on purpose: Opus 5 thinks by default and those tokens come
       out of this budget, so a tight ceiling truncates the JSON rather
       than shortening the answer. Effort is what controls the cost here. */
    maxTokens: 8000,
    /* Rewriting one abstract into fixed fields is not a hard problem, and
       the schema does the structural work. */
    effort: "low",
    schema: EXTRACT_SCHEMA
  });

  return jsonOf(response);
}

/* ---------- 3 · verify ---------- */

/* The step that stops the platform publishing a gap that has since been
   filled. It does not discard: finding data makes a record MORE useful,
   because the platform can then say where that data is. */
const VERIFY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["status", "findings", "dataset_source"],
  properties: {
    status: {
      type: "string",
      enum: ["missing", "partial", "collected"],
      description:
        "missing: nothing found. partial: something overlapping but " +
        "narrower. collected: this data now exists."
    },
    findings: {
      type: "string",
      description:
        "What the search found, or the words 'Nothing found.' Two to " +
        "four sentences. Name datasets and studies where they exist."
    },
    dataset_source: {
      type: ["object", "null"],
      additionalProperties: false,
      required: ["note", "source"],
      properties: {
        note: { type: "string", description: "What the dataset covers, and its limits." },
        source: { type: "string", description: "A URL for it." }
      },
      description:
        "Required when status is partial or collected. null when missing."
    }
  }
};

const VERIFY_SYSTEM =
  "You check whether data that a paper called missing has been collected " +
  "since. Search the live web before answering — do not rely on memory.\n\n" +
  "You get ONE search, so build the query carefully before you spend it: " +
  "the condition or exposure, the population, and the kind of data " +
  "(cohort, registry, trial, survey). Then answer from what comes back.\n\n" +
  "This is the step that protects a researcher from being sent to collect " +
  "data that already exists. Missing a gap costs nothing; publishing a " +
  "false gap wastes someone's work.\n\n" +
  "Set the status from what you find:\n" +
  "- `collected` — a dataset now exists that answers this need. Give its " +
  "URL in dataset_source.\n" +
  "- `partial` — something overlapping exists but is narrower, older, or " +
  "covers a different population. Give it, and say in the note what it " +
  "does NOT cover.\n" +
  "- `missing` — your search found nothing that answers this. Set " +
  "dataset_source to null.\n\n" +
  "You cannot prove a negative and you are not asked to. `missing` here " +
  "means 'a search of published sources found nothing', and the platform " +
  "says exactly that on the card. Do not overstate it, and do not stretch " +
  "a loosely related study into a match to avoid saying nothing was found.";

export async function verifyRecord(extracted) {
  const need = extracted.data_need;

  const response = await callModel({
    model: WORK_MODEL,
    system: VERIFY_SYSTEM,
    user:
      `Area: ${extracted.problem.area}\n` +
      `The data called missing: ${need.description}\n` +
      `Why it matters: ${need.why_it_matters}\n` +
      `What the source said: ${need.gap_note}\n` +
      `Region: ${need.region || "not specified"}\n\n` +
      "Has this data been collected since? Search, then answer.",
    maxTokens: 16000,
    /* max_uses is the cost dial for the entire run. Search results arrive
       as input tokens and the model re-reads them on every tool turn, so
       the bill grows faster than the number of searches: three searches
       cost roughly 87,000 input tokens per record.

       One search, with the prompt asking for a single well-built query,
       is the floor that still performs a real check. Below this there is
       nothing left to cut that is not the check itself. */
    effort: "low",
    schema: VERIFY_SCHEMA,
    tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 1 }]
  });

  const result = jsonOf(response);

  return {
    status: result.status,
    dataset_source: result.dataset_source,
    verification: {
      checked_at: today(),
      method: "web search",
      findings: result.findings,
      sources: searchSourcesOf(response)
    }
  };
}

/* ---------- 4 · design ---------- */

/* Generated on request and kept OUT of the register: a design is an
   answer, not a record. It lands in research-designs.js, which the app
   loads separately and works fully without.

   The shape is not free prose — designNode() in app.js renders four named
   fields, two of them lists, so the schema is that card. */
const DESIGN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "target_women", "variables", "stratifiers", "form", "instrument_source"
  ],
  properties: {
    target_women: {
      type: "string",
      description:
        "Who to recruit, how many, and where from. One or two sentences, " +
        "concrete enough to act on."
    },
    /* Counts live in the descriptions, not in minItems/maxItems: structured
       outputs reject a minItems other than 0 or 1. */
    variables: {
      type: "array",
      items: { type: "string" },
      description:
        "Three to seven entries. What to find out from them — one " +
        "measurable thing per entry, phrased as the thing recorded, not " +
        "as a research question."
    },
    stratifiers: {
      type: "array",
      items: { type: "string" },
      description:
        "Two to five entries. The breakdowns without which the result " +
        "hides who it happens to — age band, ethnicity, income, " +
        "occupation, comorbidity."
    },
    form: {
      type: "string",
      description:
        "How it is collected and over what period: instrument, cadence, " +
        "duration."
    },
    instrument_source: {
      type: ["string", "null"],
      description:
        "A named, existing validated instrument if a suitable one exists " +
        "(e.g. a published symptom scale). null if none fits — do not " +
        "invent a name."
    }
  }
};

const DESIGN_SYSTEM =
  "You draft a possible study design for collecting data that is " +
  "currently missing. The reader is a researcher deciding whether this " +
  "is worth pursuing.\n\n" +
  "This is explicitly YOUR proposal, not something any source published. " +
  "The platform labels it AI-generated and unverified and keeps it out of " +
  "the register, so you may specify freely here — the opposite of the " +
  "rule everywhere else in this system, and it holds only because this " +
  "never becomes a record.\n\n" +
  "The one thing you may NOT invent is `instrument_source`. A named " +
  "instrument must be one that really exists; if none fits, return null.\n\n" +
  "Be concrete. A sample size, a cadence, a duration. Plain language for " +
  "a reader who is not a methodologist.";

export async function designFor(extracted) {
  const need = extracted.data_need;

  const response = await callModel({
    model: WORK_MODEL,
    system: DESIGN_SYSTEM,
    user:
      `Area: ${extracted.problem.area}\n` +
      `Problem: ${extracted.problem.title}\n` +
      `The data that is missing: ${need.description}\n` +
      `Why it matters: ${need.why_it_matters}\n` +
      `Population affected: ${extracted.problem.affected_women}`,
    maxTokens: 6000,
    effort: "medium",
    schema: DESIGN_SCHEMA
  });

  const design = jsonOf(response);
  design.generated_at = today();
  design.model = WORK_MODEL;
  return design;
}
