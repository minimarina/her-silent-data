/* AI-generated study designs. NOT part of the register.
 *
 * Written by intake/run.mjs, one entry per data need id. A design is
 * an answer, not a record: it is never merged into data.js, and the
 * app works fully with this file absent (SPEC 11).
 *
 * Only designs whose record is live are published here. The full
 * archive, including designs for records that were dismissed, stays
 * in intake/designs.json.
 *
 * Every entry is model output and is labelled unverified on screen.
 */

const RESEARCH_DESIGNS = {
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
  "epilepsy-fertility-treatment-larger-studies": {
    "target_women": "Recruit 250 women aged 25-46 with a confirmed epilepsy diagnosis who are beginning infertility treatment (ovulation induction, IUI, or IVF with hormonal stimulation) at reproductive endocrinology and epilepsy clinics across 8-10 collaborating fertility and neurology centers; enroll consecutively over 18 months.",
    "variables": [
      "Seizure frequency and type per treatment cycle, recorded via patient seizure diary",
      "Antiseizure medication (ASM) type, dose, and any dose adjustments during treatment",
      "Serum ASM levels drawn at baseline and at each hormonal stimulation phase",
      "Specific fertility protocol used (drug names, doses, duration of hormonal exposure)",
      "Serum estradiol and progesterone levels at each treatment phase",
      "Sleep disruption and stress/anxiety levels (self-reported) during treatment cycles",
      "Pregnancy outcome and any peripartum seizure events if conception occurs"
    ],
    "stratifiers": [
      "Epilepsy syndrome type (focal vs generalized)",
      "ASM regimen category (enzyme-inducing vs non-enzyme-inducing vs newer ASMs)",
      "Type of infertility treatment (ovulation induction vs IUI vs IVF)",
      "Age band (25-34 vs 35-46)",
      "Baseline seizure control status (well-controlled vs breakthrough seizures in prior year)"
    ],
    "form": "Prospective longitudinal cohort study using structured seizure diaries (paper or app-based) completed daily by participants, clinic-administered structured interviews at each treatment visit, and blood draws for ASM and hormone levels timed to each phase of the fertility protocol (baseline, stimulation, post-trigger/retrieval, luteal phase); follow-up continues through one full treatment cycle and, if pregnancy occurs, through delivery, over a total study duration of 24 months to allow for staggered enrollment and follow-up.",
    "instrument_source": "Seizure frequency diary methodology as used in the Epilepsy Birth Control Registry and MONEAD (Maternal Outcomes and Neurodevelopmental Effects of Antiepileptic Drugs) study",
    "generated_at": "2026-09-18",
    "model": "claude-sonnet-5"
  },
  "urinary-incontinence-decision-aids-care-continuum": {
    "target_women": "Recruit approximately 300 women aged 40-75 presenting with symptoms of stress, urgency, or mixed urinary incontinence in primary care clinics (not yet referred to urogynecology or urology), sampled from 8-10 primary care practices across urban, suburban, and rural sites, oversampling women who have not yet decided whether to seek formal care.",
    "variables": [
      "Decisional conflict score before and after exposure to the decision aid",
      "Knowledge of urinary incontinence causes, treatment options, and expected outcomes (test score)",
      "Stated intention to seek care and actual care-seeking behavior at 3 months",
      "Treatment option chosen (watchful waiting, pelvic floor therapy, medication, surgery referral) and whether it matches stated values",
      "Patient-reported satisfaction with the decision-making process",
      "Patient-clinician communication quality during the visit",
      "Time spent deliberating and number of clarifying questions asked of the clinician"
    ],
    "stratifiers": [
      "Age band (40-54 vs 55-69 vs 70+)",
      "Type of incontinence (stress, urgency, mixed)",
      "Symptom severity (mild/moderate/severe by validated score)",
      "Race/ethnicity",
      "Health literacy level",
      "Prior treatment history (treatment-naive vs previously treated)"
    ],
    "form": "A pragmatic randomized controlled trial: women are randomized to receive a new primary-care-stage decision aid (a short video plus printed values-clarification worksheet, used before or during the primary care visit) versus usual care. Outcomes measured at baseline, immediately post-visit, and at 3-month follow-up via phone or online survey; total study duration 18 months including recruitment, intervention, and follow-up.",
    "instrument_source": "Decisional Conflict Scale (O'Connor, 1995); ICIQ-UI Short Form for symptom severity",
    "generated_at": "2026-09-18",
    "model": "claude-sonnet-5"
  },
  "brucellosis-pregnancy-treatment-controlled-trials": {
    "target_women": "Recruit 300 pregnant women (aiming for ~50-60 per treatment arm across at least 5 sites) diagnosed with active brucellosis (positive blood culture or serology consistent with acute infection, e.g. Rose Bengal plus SAT titer ≥1:160) from obstetric and infectious disease clinics in brucellosis-endemic regions (e.g. rural Middle East, Central Asia, Mediterranean basin), recruited at first antenatal presentation with confirmed diagnosis, any gestational age at enrollment.",
    "variables": [
      "Maternal clearance of Brucella infection (repeat blood culture/serology negativity at 3 and 6 months post-treatment)",
      "Relapse of brucellosis within 12 months postpartum",
      "Pregnancy loss (spontaneous abortion before 20 weeks, stillbirth after 20 weeks)",
      "Preterm birth (delivery before 37 weeks gestation)",
      "Birth weight and Apgar score at delivery",
      "Maternal adverse drug reactions by organ system and severity (graded using CTCAE)",
      "Congenital anomalies or neonatal infection with Brucella at birth and 6-week follow-up"
    ],
    "stratifiers": [
      "Gestational age at treatment initiation (first, second, third trimester)",
      "Antibiotic regimen assigned (e.g. rifampicin monotherapy vs rifampicin+trimethoprim-sulfamethoxazole vs other combination)",
      "Maternal age band (under 20, 20-34, 35+)",
      "Rural vs urban residence and access to antenatal care",
      "Presence of comorbid conditions (anemia, diabetes, prior pregnancy loss)"
    ],
    "form": "A multi-site randomized controlled trial comparing at least two antibiotic regimens considered plausibly safe in pregnancy, with women followed from enrollment through 6 weeks postpartum via structured antenatal visits every 4 weeks, telephone symptom check-ins every 2 weeks during treatment, and a structured delivery/neonatal outcome form completed at birth; total study duration approximately 3 years to allow for recruitment, follow-up, and staggered enrollment across sites.",
    "instrument_source": null,
    "generated_at": "2026-09-18",
    "model": "claude-sonnet-5"
  },
  "pelvic-neuropathy-aetiology-standardised-diagnosis": {
    "target_women": "300 women aged 18-55 presenting to specialist pelvic pain or endometriosis clinics (aim for 5-6 centres) with chronic pelvic pain of at least 6 months' duration, recruited consecutively regardless of suspected cause (endometriosis, obstetric injury, prior pelvic/abdominal surgery, trauma, or unexplained), to build a cohort broad enough to identify neuropathic subtypes rather than only clear-cut cases.",
    "variables": [
      "Presence and location of pain in a dermatomal or peripheral nerve distribution (mapped on standardised body diagram)",
      "Score on a validated neuropathic pain screening tool (e.g. DN4 or painDETECT) at baseline",
      "Findings on clinical neurological exam of the pelvis and perineum (allodynia, hyperalgesia, altered sensation, Tinel's sign at named nerve sites)",
      "Response to diagnostic nerve block (percentage pain reduction and duration of relief)",
      "History of plausible causal event (surgery type, obstetric injury, trauma, endometriosis lesion site on imaging or laparoscopy)",
      "Time from symptom onset to neuropathic diagnosis",
      "Pain, function and quality-of-life scores at baseline and follow-up"
    ],
    "stratifiers": [
      "Suspected underlying cause (endometriosis vs obstetric vs iatrogenic surgical vs traumatic vs compressive/other)",
      "Age band (18-30, 31-40, 41-55)",
      "Duration of pain prior to enrolment (<1 year, 1-3 years, >3 years)",
      "Prior number of surgeries for pelvic pain",
      "Ethnicity"
    ],
    "form": "Prospective multicentre observational cohort: baseline structured clinical assessment (history, standardised neuro exam, screening questionnaire, imaging/surgical record review) plus diagnostic nerve block where clinically indicated, with follow-up assessments at 3, 6 and 12 months to track diagnostic stability and treatment response; total recruitment and follow-up window of about 24 months.",
    "instrument_source": "DN4 (Douleur Neuropathique 4 Questions)",
    "generated_at": "2026-09-18",
    "model": "claude-sonnet-5"
  },
  "advanced-therapies-pregnancy-highquality-data": {
    "target_women": "Recruit 600 pregnant women (aiming for at least 100 per drug class exposure group) with immune-mediated inflammatory disease (Crohn's disease, ulcerative colitis, rheumatoid arthritis, psoriasis/psoriatic arthritis, or axial spondyloarthritis) who are exposed to an advanced therapy other than anti-TNF agents (e.g. IL-23 inhibitors such as risankizumab/guselkumab, IL-17 inhibitors, JAK inhibitors such as upadacitinib/tofacitinib, ustekinumab, vedolizumab) at any point from conception through delivery. Recruit through multi-site gastroenterology, rheumatology and dermatology clinics, obstetric medicine referral networks, and national pregnancy exposure registries, over a 3-year enrollment window across at least 15 participating centers in multiple countries.",
    "variables": [
      "Drug name, dose, and trimester(s) of exposure, including last dose before delivery",
      "Gestational age and birthweight at delivery, and preterm birth (<37 weeks) status",
      "Congenital anomalies identified at birth or within first 12 months, by organ system",
      "Rate of spontaneous miscarriage and stillbirth",
      "Serious neonatal infection or hospitalization within first year of life",
      "Maternal disease activity/flare during each trimester and postpartum",
      "Breastfeeding status and infant drug exposure via breast milk"
    ],
    "stratifiers": [
      "Drug class (IL-23 inhibitor, IL-17 inhibitor, JAK inhibitor, ustekinumab, vedolizumab, combination therapy)",
      "Underlying maternal disease (IBD vs rheumatologic vs dermatologic)",
      "Trimester of last exposure (first, second, third, none after conception)",
      "Maternal age band (<25, 25-34, 35+)",
      "Concomitant corticosteroid or immunosuppressant use"
    ],
    "form": "Prospective observational cohort with enrollment as early as possible in pregnancy (ideally first trimester), structured telephone or electronic questionnaires administered each trimester and at 6 weeks, 6 months, and 12 months postpartum, plus linkage to medical records and delivery/neonatal charts for objective outcome confirmation; total follow-up 12 months post-delivery per participant, study conducted over 5 years to allow full recruitment and follow-up.",
    "instrument_source": null,
    "generated_at": "2026-09-18",
    "model": "claude-sonnet-5"
  },
  "tre-reproductive-hormones-rct-pcos": {
    "target_women": "Recruit 160 women aged 18-40 (80 with PCOS per Rotterdam criteria, 80 with obesity but no PCOS as comparator) from endocrinology and gynaecology clinics, reproductive health centres, and community advertising in 3-4 cities, via referral from primary care and social media screening.",
    "variables": [
      "Serum total and free testosterone",
      "Serum LH and FSH, and LH:FSH ratio",
      "Sex hormone-binding globulin (SHBG)",
      "Menstrual cycle regularity and length (self-logged)",
      "Body weight and waist circumference",
      "Insulin resistance (HOMA-IR) and fasting glucose",
      "Self-reported adherence to eating window (hours/day)",
      "Hirsutism score and acne severity"
    ],
    "stratifiers": [
      "PCOS phenotype (classic vs ovulatory vs non-hyperandrogenic)",
      "Baseline BMI category (obese class I/II/III)",
      "Age band (18-25, 26-32, 33-40)",
      "Ethnicity",
      "Baseline insulin resistance status"
    ],
    "form": "Two-arm parallel randomised controlled trial: intervention group follows an 8-hour daily eating window (e.g. 12pm-8pm) with no calorie counting; control group follows usual eating pattern with matched dietary advice. Duration 12 months, with hormone panels, weight, and cycle data collected at baseline, 3, 6, and 12 months; menstrual cycle and adherence logged weekly via app or diary.",
    "instrument_source": "Ferriman-Gallwey score for hirsutism",
    "generated_at": "2026-09-18",
    "model": "claude-sonnet-5"
  },
  "type-2b-vwd-pregnancy-clinical-evidence": {
    "target_women": "Pregnant women aged 18-45 with laboratory-confirmed type 2B von Willebrand disease, recruited from hemophilia treatment centers and high-risk obstetric clinics in a multi-site network (target n=100-150, given rarity, over a 3-4 year enrollment window, ideally coordinated internationally through existing bleeding disorder registries).",
    "variables": [
      "VWF:RCo, VWF:Ag, FVIII, and platelet count measured each trimester and at delivery",
      "Platelet count trend across pregnancy (to capture thrombocytopenia typical of 2B VWD)",
      "Use and type of prophylactic treatment (e.g., VWF concentrate, DDAVP avoidance, platelet transfusion) before and during delivery",
      "Mode of delivery and use of neuraxial anesthesia",
      "Postpartum blood loss volume and clinical postpartum hemorrhage occurrence (yes/no, and severity by transfusion or intervention needed)",
      "Neonatal bleeding events and neonatal platelet count in first week of life",
      "Time from delivery to normalization of maternal platelet count and VWF levels"
    ],
    "stratifiers": [
      "Trimester/timepoint of measurement",
      "Parity (first pregnancy vs. multiparous)",
      "Severity of baseline thrombocytopenia (mild vs. moderate/severe)",
      "Delivery mode (vaginal vs. cesarean)",
      "Use vs. non-use of prophylactic VWF concentrate"
    ],
    "form": "Prospective observational cohort with structured case report forms completed at each prenatal visit (approximately every 4 weeks), at hospital admission for delivery, at delivery, and at 6 weeks postpartum; laboratory values drawn at standard visits plus delivery admission; data pooled across participating hemophilia treatment centers into a shared registry database over 3-4 years.",
    "instrument_source": null,
    "generated_at": "2026-09-18",
    "model": "claude-sonnet-5"
  },
  "anterior-prolapse-surgery-suistress": {
    "target_women": "Recruit approximately 600 women aged 18+ undergoing surgical repair of anterior compartment (anterior vaginal wall) prolapse across 8-12 urogynecology/urology surgical centres, split roughly evenly between those receiving native tissue repair and those receiving biological graft repair, enrolled consecutively over a 2-year recruitment window.",
    "variables": [
      "Type of anterior repair performed (native tissue vs biological graft, and graft material used)",
      "Occurrence and date of subsequent stress urinary incontinence (SUI) surgery post-prolapse repair",
      "Patient-reported urinary incontinence symptoms and severity at each follow-up",
      "Prolapse recurrence (anatomical stage and/or reoperation) at each follow-up",
      "Baseline preoperative SUI status and prior incontinence surgery history",
      "Surgical and postoperative complications (mesh/graft exposure, infection, voiding dysfunction)",
      "Patient-reported quality of life and sexual function scores"
    ],
    "stratifiers": [
      "Age band (under 50, 50-64, 65-74, 75+)",
      "Baseline SUI status (none, occult/latent, overt)",
      "Parity and prior pelvic floor surgery history",
      "Body mass index category",
      "Menopausal status"
    ],
    "form": "Prospective multicentre observational cohort study using clinical case report forms completed at surgery and structured follow-up visits at 6 weeks, 6 months, 12 months, and annually to 3 years; patient-reported outcome questionnaires self-administered at each visit either on paper or via secure online portal.",
    "instrument_source": "International Consultation on Incontinence Questionnaire - Urinary Incontinence Short Form (ICIQ-UI SF), alongside the Pelvic Floor Distress Inventory (PFDI-20) and Pelvic Organ Prolapse Quantification (POP-Q) system for anatomical staging",
    "generated_at": "2026-09-18",
    "model": "claude-sonnet-5"
  },
  "remifentanil-pca-labour-highrisk-groups": {
    "target_women": "Recruit approximately 600 women in labour across 8-10 maternity units who are unable to receive or have declined neuraxial analgesia and who fall into higher-risk categories (BMI ≥35, twin pregnancy, prior caesarean attempting VBAC, preeclampsia, preterm labour 34-37 weeks, or suspected foetal growth restriction), choosing remifentanil PCA for labour pain; recruitment via antenatal clinics and admission screening over 24 months.",
    "variables": [
      "Maternal oxygen desaturation episodes (SpO2 <94%) per hour of remifentanil use",
      "Need for supplemental oxygen or respiratory rescue intervention",
      "Maternal sedation score at set intervals using a standardised sedation scale",
      "Pain score reported by the woman at 30-minute intervals during remifentanil use",
      "Umbilical cord blood gas results and Apgar scores at 1 and 5 minutes",
      "Need for neonatal naloxone or resuscitation beyond routine drying and stimulation",
      "Maternal satisfaction with pain relief measured postpartum",
      "Total remifentanil dose and duration of PCA use before delivery or conversion to another analgesia method"
    ],
    "stratifiers": [
      "Maternal BMI category (35-39.9, 40-44.9, ≥45)",
      "Specific high-risk category (obesity, multiple pregnancy, VBAC attempt, preeclampsia, preterm labour, growth restriction)",
      "Parity (nulliparous vs multiparous)",
      "Gestational age at delivery",
      "Ethnicity"
    ],
    "form": "Prospective observational cohort study with continuous maternal monitoring (pulse oximetry, sedation scoring) during remifentanil PCA use, data recorded on a structured case report form by attending midwives at fixed intervals (every 30 minutes) throughout labour, with a single follow-up questionnaire completed by the woman within 48 hours postpartum; total study duration 24 months of recruitment plus 3 months follow-up and analysis.",
    "instrument_source": "Pasero Opioid-induced Sedation Scale (POSS)",
    "generated_at": "2026-09-18",
    "model": "claude-sonnet-5"
  },
  "sle-hormone-profiles-flare-longitudinal": {
    "target_women": "Recruit 150 women aged 18-45 with a confirmed SLE diagnosis (ACR/EULAR criteria), regular menstrual cycles (not on hormonal contraception or GnRH therapy), followed at 3-5 lupus/rheumatology clinics, enrolled regardless of current disease activity so both flare and quiescent periods can be captured over follow-up.",
    "variables": [
      "Serum estradiol, progesterone, LH, FSH, prolactin, and DHEA levels",
      "SLEDAI-2K disease activity score at each visit",
      "Timing of blood draw relative to menstrual cycle day",
      "Occurrence, date, and severity of clinically defined flare (per treating physician and standardized flare criteria)",
      "Current medications including corticosteroid dose and immunosuppressants",
      "Complement levels (C3, C4) and anti-dsDNA titer",
      "Self-reported menstrual cycle regularity and symptoms"
    ],
    "stratifiers": [
      "Age band (18-25, 26-35, 36-45)",
      "Race/ethnicity",
      "Lupus nephritis status (renal vs non-renal involvement)",
      "Baseline disease duration (new-onset vs established >5 years)",
      "Current corticosteroid/immunosuppressant use"
    ],
    "form": "Prospective cohort study with monthly blood draws and clinical assessments for 12 months, with additional unscheduled visits within 72 hours of any physician-confirmed flare; blood samples timed to a known menstrual cycle day using urinary LH tracking; data collected via structured clinic visit forms plus a daily symptom/menstrual diary app.",
    "instrument_source": "SLEDAI-2K (Systemic Lupus Erythematosus Disease Activity Index 2000)",
    "generated_at": "2026-09-18",
    "model": "claude-sonnet-5"
  },
  "pcos-glp1-treatment-outcomes": {
    "target_women": "Recruit 240 women aged 18-40 with PCOS (Rotterdam criteria) and BMI ≥27 kg/m2, from outpatient endocrinology/gynecology and reproductive medicine clinics across 4-6 sites, plus referrals from primary care; exclude those on fertility treatment seeking pregnancy within 6 months or already on GLP-1 agonists.",
    "variables": [
      "Fasting glucose and insulin levels (mg/dL, HOMA-IR calculated)",
      "Menstrual cycle regularity (self-reported cycle length and frequency of periods over prior 3 months, tracked monthly)",
      "Hirsutism severity (modified Ferriman-Gallwey score)",
      "Health-related quality of life score",
      "Depression and anxiety symptom scores",
      "Direct medical costs and out-of-pocket spending on PCOS-related care (drug cost, visits, labs) over the study period",
      "Body weight and BMI"
    ],
    "stratifiers": [
      "Baseline BMI category (overweight vs obesity class I/II/III)",
      "Age band (18-25, 26-32, 33-40)",
      "Ethnicity/race",
      "Household income or insurance coverage type",
      "Baseline insulin resistance status (HOMA-IR above/below clinical threshold)"
    ],
    "form": "Prospective observational cohort (or pragmatic trial if feasible) comparing women newly started on a GLP-1 receptor agonist versus matched women on standard PCOS care (metformin/lifestyle only); data collected at baseline, 3, 6, and 12 months via clinic visits (labs, exam for hirsutism) and self-administered questionnaires (quality of life, mental health, menstrual diary, cost diary); total duration 12 months per participant with staggered enrollment over 18 months.",
    "instrument_source": "PCOSQ (Polycystic Ovary Syndrome Quality of Life Questionnaire) for quality of life; Patient Health Questionnaire-9 (PHQ-9) for depression; Generalized Anxiety Disorder 7-item scale (GAD-7) for anxiety; modified Ferriman-Gallwey scale for hirsutism",
    "generated_at": "2026-09-18",
    "model": "claude-sonnet-5"
  }
};
