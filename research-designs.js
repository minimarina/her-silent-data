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
  },
  "high-altitude-cardiometabolic-women-adaptation-data": {
    "target_women": "Recruit 240 women aged 18-55 travelling from low altitude (<500m) to high-altitude settings (>2500m) for occupational, athletic, or residential reasons—via trekking/expedition operators, mountain occupational health clinics, and high-altitude research stations in regions such as the Andes, Himalayas, and Rockies—stratified to include roughly equal numbers of naturally cycling, hormonal-contraceptive-using, pregnant, and post-menopausal women.",
    "variables": [
      "Resting and exercise heart rate, blood pressure, and oxygen saturation measured at baseline and at defined altitude time points",
      "Presence and severity of acute mountain sickness symptoms (headache, nausea, fatigue, dizziness, sleep disturbance)",
      "Menstrual cycle phase or hormonal status (natural cycle day, contraceptive type/dose, pregnancy trimester, menopausal status) at each measurement point",
      "Hematologic and metabolic markers: hemoglobin, hematocrit, fasting glucose, lipid profile drawn at sea level and after altitude exposure",
      "Self-reported exercise capacity or perceived exertion during standardized activity at altitude",
      "Occurrence of clinically significant altitude illness events (HAPE, HACE, or medical evacuation) during the exposure period",
      "Sleep quality and nocturnal oxygen desaturation episodes recorded via pulse oximetry"
    ],
    "stratifiers": [
      "Age band (18-25, 26-35, 36-45, 46-55)",
      "Reproductive/hormonal status (naturally cycling, hormonal contraceptive user, pregnant, post-menopausal, post-menopausal on hormone therapy)",
      "Altitude exposure context (occupational, athletic/expedition, residential)",
      "Rate of ascent and peak altitude reached",
      "Pre-existing cardiometabolic conditions (hypertension, diabetes, obesity) and prior high-altitude exposure history"
    ],
    "form": "Prospective longitudinal cohort with measurements at baseline (sea level, within 7 days pre-ascent), on days 1, 3, and 7 after arrival at altitude, and at departure or after 14 days (whichever is sooner); data collected via wearable pulse oximeters/heart rate monitors, a daily symptom diary app, and in-person clinical assessments with blood draws at baseline and end of exposure; follow-up phone survey at 2 weeks post-return to capture delayed effects.",
    "instrument_source": "Lake Louise Acute Mountain Sickness Score",
    "generated_at": "2026-09-18",
    "model": "claude-sonnet-5"
  },
  "knee-health-women-runners-factors": {
    "target_women": "Recruit 400 adult female runners (running at least 10km/week for 6+ months) from parkrun clubs, running club registries, and orthopedic/sports medicine clinics across a mixed urban/suburban region, including both those with no knee surgery history and those with prior ACL, meniscus, or cartilage surgery.",
    "variables": [
      "Current knee pain severity and location (self-reported)",
      "Menstrual cycle phase and history (regular/irregular, hormonal contraceptive use, menopause status)",
      "Knee structural findings from clinical exam or imaging (alignment, laxity, cartilage/meniscus status where available)",
      "Weekly running volume, pace, and terrain/surface type (training load)",
      "Psychological readiness to run/return to sport and fear of movement or re-injury",
      "Perceived social and gendered barriers to training, recovery time, or seeking care (e.g. caregiving load, access to coaching, body-image pressure)",
      "History and outcome of any prior knee surgery (function scores, return-to-running success)"
    ],
    "stratifiers": [
      "Age band (18-29, 30-39, 40-49, 50+)",
      "Menopausal status (pre-, peri-, post-menopausal)",
      "Prior knee surgery status (none, surgery with return to running, surgery without return)",
      "Running experience level (recreational vs competitive/high-mileage)",
      "Socioeconomic/occupational status (sedentary vs physically demanding job, access to paid rehab care)"
    ],
    "form": "A baseline questionnaire and brief clinical/imaging assessment at enrollment, followed by a weekly running and symptom diary (5-minute app or paper log) for 12 months, with psychological and hormonal-status questionnaires repeated every 3 months.",
    "instrument_source": "Knee injury and Osteoarthritis Outcome Score (KOOS)",
    "generated_at": "2026-09-18",
    "model": "claude-sonnet-5"
  },
  "androgen-drug-metabolism-probe-studies": {
    "target_women": "Recruit 90 people assigned female at birth aged 18-50 from endocrinology and gender-affirming care clinics, split into three groups of 30: transgender men on stable exogenous testosterone therapy for at least 6 months, cisgender women with polycystic ovary syndrome and biochemical hyperandrogenism, and cisgender women with normal androgen levels as controls.",
    "variables": [
      "Serum free and total testosterone level",
      "CYP3A4 activity measured via midazolam probe drug clearance",
      "CYP2D6 activity measured via dextromethorphan probe metabolite ratio",
      "P-glycoprotein transporter activity measured via digoxin pharmacokinetics or probe substrate",
      "Plasma concentration-time curve (AUC) for a panel of commonly prescribed drugs metabolized by these pathways",
      "Self-reported adverse drug reactions or unexpected drug effects in the prior 6 months",
      "Concurrent medications and hormonal therapy dose/duration"
    ],
    "stratifiers": [
      "Age band (18-25, 26-35, 36-50)",
      "Group type (testosterone therapy vs PCOS vs control)",
      "Duration and dose of exogenous testosterone exposure",
      "Body mass index category",
      "Presence of liver or kidney comorbidity"
    ],
    "form": "Single-visit clinical pharmacokinetic study using a validated cocktail probe drug approach (low-dose midazolam and dextromethorphan administered orally), with blood draws at baseline and at 1, 2, 4, 8, and 24 hours post-dose; hormone panels drawn at the same visit; a follow-up questionnaire on medication history and adverse effects administered at baseline and repeated at 6 months to capture any new drug-related issues.",
    "instrument_source": null,
    "generated_at": "2026-09-18",
    "model": "claude-sonnet-5"
  },
  "afghan-refugee-womens-health-experience-data": {
    "target_women": "Recruit 150 Afghan refugee women aged 19-55 who resettled in the US within the past 5 years and currently reside in the San Francisco Bay Area, sampled through resettlement agencies (e.g., Jewish Family and Community Services East Bay, International Rescue Committee San Francisco), Afghan community organizations, mosques, and English-language/ESL classes serving Afghan populations, using respondent-driven and snowball sampling with trained bicultural Dari/Pashto-speaking community health worker recruiters.",
    "variables": [
      "Self-reported access to a regular primary care provider and time since last preventive care visit (well-woman exam, prenatal/postpartum care if applicable)",
      "Specific barriers encountered when seeking care, categorized as linguistic (interpreter availability/quality), transportation, childcare, financial/insurance, documentation status, and gender-of-provider preference",
      "Level of health insurance coverage and understanding of how to use it (Medicaid, refugee medical assistance, employer coverage, uninsured)",
      "Self-rated general and reproductive/maternal health status and unmet health needs in the past 12 months",
      "Experiences of discrimination, cultural insensitivity, or religious accommodation failures in health care settings",
      "Level of health literacy and comfort navigating the US health care system independently versus needing family/community intermediary support",
      "Mental health symptom burden (depression, anxiety, trauma-related distress) and whether this was ever discussed with a health provider"
    ],
    "stratifiers": [
      "Age band (19-25, 26-35, 36-45, 46-55)",
      "Time since US resettlement (<1 year, 1-3 years, 3-5 years)",
      "English proficiency level (none, limited, conversational, fluent)",
      "Household income/employment status of primary earner",
      "Parity and current pregnancy/postpartum status",
      "Educational attainment (no formal schooling, primary, secondary, tertiary)"
    ],
    "form": "A one-time structured, interviewer-administered survey (45-60 minutes) conducted face-to-face or by phone in the respondent's preferred language (Dari or Pashto) by trained bicultural female interviewers, followed by an optional semi-structured qualitative interview (30-45 minutes) with a subsample of 25-30 women for narrative depth; data collection to run over a 9-month enrollment period with no longitudinal follow-up in this phase.",
    "instrument_source": "Health Care Access Barriers (HCAB) Model survey instrument",
    "generated_at": "2026-09-18",
    "model": "claude-sonnet-5"
  },
  "male-breast-cancer-care-prospective-data": {
    "target_women": "Recruit approximately 400 men newly diagnosed with primary invasive breast cancer (stage I-III) across 25-30 cancer centers participating in a national or international consortium (e.g., NCI community oncology network sites plus academic centers), enrolled within 8 weeks of diagnosis over a 3-year accrual window.",
    "variables": [
      "Tumor pathology profile (ER/PR/HER2 status, grade, Ki-67, histologic subtype)",
      "Systemic therapy regimen selected (chemotherapy, endocrine agent and duration, HER2-targeted therapy) and sequencing relative to surgery/radiation",
      "Adherence to and discontinuation of endocrine therapy, with reasons recorded",
      "Treatment-related toxicities graded by CTCAE at each visit",
      "Time to recurrence (local, regional, distant) and disease-free survival",
      "Overall survival and cause of death",
      "Patient-reported quality of life, sexual/body-image concerns, and psychosocial distress"
    ],
    "stratifiers": [
      "Age band (under 50, 50-64, 65-74, 75+)",
      "Race/ethnicity",
      "BRCA1/BRCA2 or other germline mutation status",
      "Comorbidity burden (Charlson Comorbidity Index category)",
      "Tumor stage at diagnosis and receptor subtype"
    ],
    "form": "A prospective multicenter cohort embedded within a clinical trial registry: baseline clinical/pathology data collected at diagnosis, treatment and toxicity data collected at each oncology visit (approximately every 3 months) for 5 years, patient-reported outcomes collected via electronic survey at baseline, 6 months, 12 months, and annually thereafter, with survival follow-up continuing to 10 years via registry linkage.",
    "instrument_source": "EORTC QLQ-C30 (with breast cancer module QLQ-BR23)",
    "generated_at": "2026-09-18",
    "model": "claude-sonnet-5"
  }
};
