/* AI-generated study designs. NOT part of the register.
 *
 * Written by intake/run.mjs, one entry per data need id. A design is
 * an answer, not a record: it is never merged into data.js, and the
 * app works fully with this file absent (SPEC §11).
 *
 * Every entry is model output and is labelled unverified on screen.
 */

const RESEARCH_DESIGNS = {
  "lactation-covid-antiviral-data-milk-plasma-pharmacokinetics": {
    "target_women": "Forty lactating women aged 18-45 who are prescribed a standard 5-day course of nirmatrelvir/ritonavir for symptomatic COVID-19 while breastfeeding an infant under 12 months, recruited through COVID therapeutic pathways, maternity units and primary care in 6-8 hospital sites (target: at least 10 women within 6 weeks postpartum and 10 with infants over 6 months, so milk composition varies).",
    "variables": [
      "Nirmatrelvir and ritonavir concentration in breast milk (ng/mL) in each expressed sample across the dosing interval",
      "Nirmatrelvir and ritonavir concentration in maternal plasma (ng/mL) at matched time points, giving a milk-to-plasma ratio per woman",
      "Estimated absolute and relative infant dose (mg/kg/day and % of maternal weight-adjusted dose) calculated from measured milk levels and recorded feed volumes",
      "Milk fat content and volume of each expressed sample, and time since delivery",
      "Maternal adverse events over the 5-day course and 7 days after (including dysgeusia, diarrhoea, and any interruption or early discontinuation)",
      "Infant adverse events over the same period: feeding refusal, vomiting, diarrhoea, rash, unusual sleepiness, and weight at baseline and day 14",
      "Whether the mother interrupted, reduced or stopped breastfeeding during or after treatment, and for how long"
    ],
    "stratifiers": [
      "Time postpartum (0-6 weeks, 6 weeks-6 months, over 6 months)",
      "Maternal age band (18-24, 25-34, 35-45)",
      "Ethnicity and preferred language",
      "Renal function (eGFR band) and whether the dose was renally reduced",
      "Concomitant medications, especially other CYP3A substrates",
      "Household income or area deprivation quintile, and occupation (to capture who can manage timed sampling at home)"
    ],
    "form": "Intensive PK sampling on day 3 of treatment (steady state): the woman expresses milk and gives a capillary or venous plasma sample before the morning dose and at approximately 1, 2, 4, 6, 8 and 12 hours after it, using a pump and pre-labelled collection kit either in a day unit or at home with a visiting research nurse. One further pre-dose milk and plasma pair on day 5 and a single milk sample 24 and 48 hours after the last dose to show washout. Assay by validated LC-MS/MS. Maternal and infant symptom diary completed daily from day 1 to day 12, then a single telephone or video follow-up at day 14 and at 4 weeks. Total participant involvement about 4 weeks; recruitment expected to take 12-18 months given seasonality of COVID prescribing.",
    "instrument_source": null,
    "generated_at": "2026-09-18",
    "model": "claude-opus-5"
  }
};
