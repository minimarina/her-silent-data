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
  },
  "penile-microbiome-bv-risk-exchange-and-definition-data": {
    "target_women": "Recruit 400 women aged 18–45 attending sexual health, family planning, or antenatal clinics in two or three urban sites (ideally one high-BV-prevalence setting such as a South African or US southern city plus one lower-prevalence comparator), each enrolled together with her current male sex partner as a couple; oversample women presenting with symptomatic or recurrent BV (target 200 of the 400) and enrol 200 women with no BV history as a comparison group.",
    "variables": [
      "Vaginal microbiota composition by 16S rRNA sequencing plus quantitative PCR for key taxa (Gardnerella, Fannyhessea/Atopobium vaginae, Prevotella, Lactobacillus crispatus, L. iners), reported as community state type at each visit",
      "Penile microbiota from the male partner at each matched visit, sampled separately from the coronal sulcus/glans and distal urethra, using the same sequencing and qPCR panel so taxa can be matched between partners",
      "Strain-level concordance between partners for shared taxa (whole-genome or strain-resolved sequencing on the subset of couples sharing a taxon), recorded as same-strain / different-strain",
      "Nugent score and Amsel criteria at each visit, and date of each incident BV episode (symptomatic or asymptomatic)",
      "Laboratory-confirmed incident chlamydia, gonorrhoea, trichomonas and Mycoplasma genitalium in both partners at each visit",
      "Sexual and hygiene exposure diary between visits: number of coital acts, condom use per act, receptive oral and anal sex, new partners outside the couple, vaginal washing/douching, and antibiotic use",
      "Male circumcision status, penile moisture/smegma presence on examination, and self-reported penile symptoms (discharge, irritation, odour)"
    ],
    "stratifiers": [
      "Woman's age band (18–24, 25–34, 35–45)",
      "Male circumcision status",
      "Race/ethnicity and study site",
      "Pregnancy status and hormonal contraception use (none, combined oral, progestin injectable, IUD)",
      "Household income or education band as a socioeconomic proxy"
    ],
    "form": "Prospective couple cohort followed for 12 months. Clinic visits for both partners at baseline, then months 1, 3, 6, 9 and 12, with self-collected vaginal swabs and partner-collected penile swabs mailed in every 2 weeks in between (26 self-collection kits per couple) to capture short-term shifts and exchange after individual sex acts. Behavioural diary completed weekly on a phone-based form. Nested within the cohort, an intensive sub-study of 60 couples collects daily self-swabs from both partners for 28 consecutive days plus a swab within 12 hours after each coital act, to measure how quickly taxa transfer and how long they persist. A further embedded open-label arm randomises 120 couples in which the woman has recurrent BV to woman-only metronidazole versus concurrent treatment of both partners, with microbiome and BV recurrence followed to 6 months post-treatment to test durability of clearance.",
    "instrument_source": "Nugent score for vaginal Gram stain; Amsel criteria for clinical BV diagnosis",
    "generated_at": "2026-09-18",
    "model": "claude-opus-5"
  }
};
