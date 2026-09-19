/* AI-generated study designs. NOT part of the register.
 *
 * Written by intake/design.mjs, one entry per data need id, and only
 * for records already approved and merged into data.js. A design is
 * an answer, not a record: it is never merged into data.js, and the
 * app works fully with this file absent (SPEC 11).
 *
 * Only designs whose record is live are published here, AND only
 * those that pass the design rules in intake/validate.mjs. A design
 * that assigns an intervention to a vulnerable population without
 * naming its oversight, that doses a participant with something it
 * does not name, or that restricts eating without screening for
 * eating disorders, is withheld: the record still stands and simply
 * offers no design. The app renders that case already (SPEC 11).
 *
 * The full archive, including designs that were withheld and designs
 * for records that were dismissed, stays in intake/designs.json.
 * Nothing here is hand-edited or hand-corrected — a design is model
 * output in full or it is not published, so what is on screen is
 * always what the model wrote.
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
    "withheld": "This design administers something it does not name. Every substance given to a participant is named, or the design is withheld: a reader cannot weigh a risk described as \"a panel of commonly prescribed drugs\"."
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
    "withheld": "This design assigns an intervention to a vulnerable population and names no oversight. An interventional design on pregnant women, women in labour, children or a comparable group must name its ethics approval, its consent procedure and its independent safety monitoring, or it is not publishable here."
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
    "withheld": "This design restricts eating and says nothing about disordered eating. A dietary-restriction intervention names its screening and exclusion for eating disorders, and monitors for them, or it is withheld."
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
  "cvd-sex-hormones-mortality-women-data": {
    "target_women": "Approximately 1,800 women aged 40 and older with established cardiovascular disease (prior myocardial infarction, documented coronary artery disease, heart failure, or ischemic stroke), recruited consecutively from cardiology and cardiac rehabilitation clinics at 8-10 collaborating hospitals, oversampling postmenopausal and racially/ethnically diverse women to correct prior underrepresentation.",
    "variables": [
      "Baseline serum total and free estradiol concentration",
      "Baseline serum total and free testosterone concentration",
      "Baseline sex hormone-binding globulin (SHBG) concentration",
      "Baseline follicle-stimulating hormone (FSH) concentration and self-reported menopausal status",
      "All-cause mortality (date and cause, from death certificates/registry linkage)",
      "Cardiovascular mortality specifically (adjudicated cause of death)",
      "Incident major adverse cardiovascular events during follow-up (recurrent MI, stroke, heart failure hospitalization)"
    ],
    "stratifiers": [
      "Age band (40-54, 55-64, 65-74, 75+)",
      "Menopausal status (pre-, peri-, post-menopausal, and surgical menopause)",
      "Race/ethnicity, analyzed as a marker of structural factors such as differential access to cardiac care and diagnostic delay rather than biological difference",
      "Type of established cardiovascular disease (coronary artery disease, heart failure, cerebrovascular disease)",
      "Comorbidity burden (diabetes, chronic kidney disease, obesity)"
    ],
    "form": "Purely observational prospective cohort study: no intervention or exposure is assigned, since the exposure of interest (endogenous hormone levels) already exists in this population and is simply measured. A single fasting morning blood draw is taken at enrollment for hormone and SHBG assay via liquid chromatography-mass spectrometry, alongside a structured interview covering menopausal history and cardiovascular risk factors. Participants are then followed annually for 10 years via clinic visits or telephone follow-up, with mortality and event ascertainment cross-checked against national death and hospitalization registries. Standard ethics approval and written informed consent are obtained at each site; because this is observational with no assigned treatment, no data safety monitoring board or equipoise justification is required.",
    "instrument_source": null,
    "generated_at": "2026-09-19",
    "model": "claude-sonnet-5"
  },
  "fertility-interventions-30-42-safety-reporting": {
    "target_women": "Approximately 2,500 women aged 30-42 presenting for infertility treatment (any etiology: ovulatory dysfunction, tubal factor, male factor, unexplained, diminished ovarian reserve) at 15-20 fertility clinics across a mix of academic and community settings, recruited consecutively over a 24-month enrollment window as they begin a treatment cycle (IUI, conventional IVF/ICSI, or IVF with donor eggs), each followed to pregnancy outcome.",
    "variables": [
      "Live birth (yes/no) per treatment cycle and cumulatively across up to 3 cycles per woman",
      "Clinical pregnancy and biochemical pregnancy rates per cycle",
      "Incidence and severity grade of ovarian hyperstimulation syndrome (mild/moderate/severe, per ASRM/ESHRE criteria) among stimulated cycles",
      "Multiple gestation rate (twin, triplet+) among clinical pregnancies",
      "Gestational age at delivery and preterm birth (<37 weeks) rate",
      "Neonatal outcomes: birth weight, NICU admission, major congenital anomaly, and neonatal death within 28 days",
      "Maternal obstetric complications during pregnancy (gestational diabetes, preeclampsia, postpartum hemorrhage)",
      "Specific intervention type and protocol used (e.g., named gonadotropin agents, letrozole, clomiphene citrate, GnRH agonist/antagonist protocol, number of embryos transferred)"
    ],
    "stratifiers": [
      "Maternal age band (30-34, 35-37, 38-40, 41-42)",
      "Infertility etiology (ovulatory dysfunction, tubal, male factor, diminished ovarian reserve, unexplained)",
      "Body mass index category (underweight, normal, overweight, obese)",
      "Race/ethnicity, recorded to examine differences in access to care, insurance coverage, and clinic referral patterns rather than to imply biological difference",
      "Number of prior treatment cycles/failed attempts before enrollment"
    ],
    "form": "Prospective observational cohort with data captured via a standardized electronic case report form completed by clinic staff at four fixed points: (1) baseline/enrollment, (2) end of each stimulation cycle, (3) pregnancy confirmation (or cycle failure), and (4) delivery/neonatal outcome, with the last woman followed for up to 12 months post-enrollment to capture a full pregnancy course. No exposure is assigned by the study; women and clinicians choose their treatment as part of usual care, and the cohort simply standardizes what is measured and how, since randomizing women already selecting an infertility treatment pathway would not answer the question and is not appropriate here. Sample size of 2,500 is a pragmatic estimate based on typical clinic volumes and expected event rates, not a formal power calculation. All sites obtain local ethics/IRB approval and written informed consent from participants prior to data collection; no experimental intervention is administered, so no DSMB is required, but a data quality and safety oversight committee reviews adverse event reports (OHSS, maternal complications) quarterly.",
    "instrument_source": "ASRM/ESHRE consensus criteria for OHSS classification (Golan/Rizk criteria as adopted in ASRM Practice Committee guidance)",
    "generated_at": "2026-09-19",
    "model": "claude-sonnet-5"
  },
  "urinary-retention-older-women-trial-data": {
    "target_women": "Approximately 150 women aged 65 and older with confirmed chronic urinary retention (post-void residual >150mL on two occasions), recruited from urogynecology, urology, and geriatric medicine clinics at 3-4 academic medical centers, including those with neurogenic bladder, diabetic bladder dysfunction, or pelvic organ prolapse as underlying causes.",
    "variables": [
      "post-void residual urine volume (mL) measured by bladder scan or catheterization",
      "incidence of urinary tract infection over follow-up",
      "need for escalation to clean intermittent catheterization or indwelling catheter",
      "patient-reported voiding symptom score (ICIQ-FLUTS voiding subscale)",
      "adverse events attributable to assigned treatment, named individually",
      "health-related quality of life score",
      "treatment discontinuation and reasons"
    ],
    "stratifiers": [
      "age band (65-74, 75-84, 85+)",
      "underlying cause (neurogenic disease, diabetic bladder dysfunction, pelvic organ prolapse, idiopathic)",
      "race and ethnicity, tracked as a marker of differential access to specialist urogynecologic care and prior diagnostic workup, not biological difference",
      "baseline severity (post-void residual volume tertile)",
      "frailty status (using a validated frailty index)"
    ],
    "form": "A randomized, three-arm, open-label trial comparing (1) pharmacologic treatment with bethanechol chloride, (2) supervised pelvic floor and bladder retraining behavioral therapy, and (3) patient education plus clean intermittent self-catheterization, all as add-ons to usual urologic care. Genuine equipoise exists because no arm has established superiority for retention specifically in older women, and current guidance is extrapolated from younger or male populations. Women are excluded if they have bladder outlet obstruction requiring immediate surgical correction, active untreated urinary tract infection, or contraindications to bethanechol (bradycardia, asthma, hyperthyroidism, active peptic ulcer disease, seizure disorder, Parkinsonism). Follow-up visits occur at 4, 8, and 12 weeks, then at 6 and 12 months, with bladder scans and symptom questionnaires at each visit. The trial requires ethics approval at every participating site, written informed consent from each participant (with assessment of decision-making capacity given the neurologic comorbidities in this population), and an independent data safety monitoring board reviewing adverse events, particularly UTI rates and cardiac or gastrointestinal events related to bethanechol, at quarterly intervals with authority to halt any arm. The total duration is 18 months including recruitment. Sample size of 150 (50 per arm) is an estimate based on feasibility and prior observational retention studies, not a formal power calculation.",
    "instrument_source": "International Consultation on Incontinence Questionnaire - Female Lower Urinary Tract Symptoms (ICIQ-FLUTS), voiding/obstructive subscale",
    "generated_at": "2026-09-19",
    "model": "claude-sonnet-5"
  },
  "fertility-preservation-chemo-comparative-trials": {
    "target_women": "1,000 premenopausal women (aged 18-40) newly diagnosed with early-stage breast cancer, planning to undergo chemotherapy and wishing to pursue fertility preservation, recruited from ~20 oncofertility referral centers across multiple countries over a 3-year enrollment window.",
    "variables": [
      "Number of mature oocytes or embryos cryopreserved per cycle",
      "Time from cancer diagnosis to start of chemotherapy (days)",
      "Anti-Müllerian hormone (AMH) level at baseline, 6 months, and 24 months post-chemotherapy",
      "Live birth rate among women who later attempt pregnancy, followed for up to 10 years",
      "Disease-free survival at 5 years",
      "Overall survival at 5 and 10 years",
      "Rate of treatment-related adverse events (e.g., ovarian hyperstimulation syndrome, thromboembolism)"
    ],
    "stratifiers": [
      "Age band (18-30, 31-35, 36-40)",
      "Cancer stage at diagnosis (I-II vs III)",
      "Chemotherapy regimen type (anthracycline-based vs other)",
      "Race/ethnicity (recorded to examine structural differences in access to fertility clinics and insurance coverage for preservation, not biological difference)",
      "Baseline ovarian reserve (AMH tertile)"
    ],
    "form": "Multicenter randomized controlled trial with 1:1 allocation to (a) controlled ovarian hyperstimulation using recombinant FSH plus letrozole (an aromatase inhibitor used as the protective co-treatment to limit estrogen exposure) for oocyte or embryo cryopreservation, versus (b) GnRH agonist (goserelin) ovarian suppression administered monthly starting before and continuing through chemotherapy. All participants have histologically confirmed hormone-receptor-status-documented breast cancer and are excluded if pregnant, less than 3 months postpartum, or breastfeeding, since letrozole and goserelin are contraindicated in pregnancy and lactation. Both arms are followed with clinic visits before, during, and after chemotherapy, then annual follow-up for 10 years capturing fertility attempts, pregnancy, live birth, and survival status. Genuine equipoise exists because no trial has directly compared live birth and survival outcomes between these two widely used but never head-to-head-tested strategies. The trial requires ethics approval at every participating site, written informed consent from each participant (with counseling on the experimental nature of the comparison given some sites currently favor one method by convention), and an independent data safety monitoring board reviewing adverse events (including cancer recurrence) at 6-month intervals with pre-specified stopping rules. Women with active eating disorders or severe malnutrition are excluded from the hyperstimulation arm's dietary and hormonal monitoring protocol, and all participants are screened at baseline using clinician assessment for disordered eating given the hormonal manipulation involved.",
    "instrument_source": null,
    "generated_at": "2026-09-19",
    "model": "claude-sonnet-5"
  },
  "sjogrens-ovarian-reserve-evidence-base": {
    "target_women": "Recruit 300 reproductive-age women (18-40 years) with a confirmed diagnosis of primary Sjögren's disease (per 2016 ACR/EULAR classification criteria) from rheumatology clinics at 5-8 collaborating hospitals, plus 300 age-matched healthy controls (within 2-year age bands) recruited from the same hospitals' general gynaecology or primary care clinics.",
    "variables": [
      "Serum anti-Müllerian hormone (AMH) level (ng/mL)",
      "Serum follicle-stimulating hormone (FSH) level on cycle day 2-4 (IU/L)",
      "Antral follicle count (AFC) via transvaginal ultrasound",
      "Ovarian volume (OV) via transvaginal ultrasound",
      "Sjögren's disease duration and current disease activity score (ESSDAI)",
      "Current and past immunosuppressive/DMARD medication use (name each drug used, e.g. hydroxychloroquine, methotrexate, cyclophosphamide, rituximab)",
      "Self-reported menstrual cycle regularity and any prior fertility diagnosis or treatment"
    ],
    "stratifiers": [
      "Age band (18-24, 25-30, 31-35, 36-40)",
      "Disease duration since Sjögren's diagnosis (<2 years, 2-5 years, 5-10 years, >10 years)",
      "History of cyclophosphamide exposure (yes/no), given its known gonadotoxicity",
      "Ethnicity (recorded to explore differential access to rheumatology/fertility care and diagnostic delay, not biological difference)",
      "Body mass index category (underweight, normal, overweight, obese), as this affects AMH and ultrasound-based AFC readings"
    ],
    "form": "Cross-sectional observational cohort study with a single baseline measurement (blood draw and transvaginal ultrasound scheduled on cycle day 2-4) for each participant, plus a linked medical record review of disease history and medication exposure. No intervention or exposure is assigned — this is a purely observational comparison between women who already have Sjögren's disease and matched controls, so randomisation does not apply. Recruitment and data collection conducted over 18 months, with optional annual follow-up for 2 years for a subset of 100 case-control pairs to assess change in ovarian reserve markers over time. All participating sites obtain local ethics committee approval; all participants give written informed consent; a data monitoring board is not required since no intervention is administered, but a data safety and confidentiality officer oversees handling of sensitive reproductive and health data. Women who are pregnant, breastfeeding, or post-menopausal at enrollment are excluded, as are women with other known causes of diminished ovarian reserve (e.g. prior oophorectomy, pelvic radiotherapy) to reduce confounding.",
    "instrument_source": "ESSDAI (EULAR Sjögren's Syndrome Disease Activity Index)",
    "generated_at": "2026-09-19",
    "model": "claude-sonnet-5"
  },
  "caffeine-female-athletes-menstrual-tracking": {
    "target_women": "Recruit 48 competitive female team-sport athletes (soccer, basketball, netball, or similar) aged 18-35, training at least 4 times/week, from university and club teams via coach referral and sports-science department mailing lists; exclude pregnant women, those with cardiac arrhythmia, anxiety disorders, or caffeine allergy.",
    "variables": [
      "Sport-specific skill test performance (e.g. sprint, agility, shooting/passing accuracy) pre- and post-dose",
      "Cognitive test performance (reaction time, decision-making accuracy) via a standard cognitive battery",
      "Self-reported habitual daily caffeine intake (mg/day) via food-frequency/caffeine intake questionnaire",
      "Menstrual cycle phase at test session confirmed by urinary LH test and self-reported cycle day, or hormonal contraceptive type and phase of pill pack",
      "Adverse symptoms after dosing (jitteriness, GI upset, palpitations, headache, insomnia) via structured symptom checklist",
      "Perceived exertion and subjective alertness/mood ratings post-exercise"
    ],
    "stratifiers": [
      "Menstrual cycle phase (early follicular, late follicular/ovulatory, mid-luteal) or hormonal contraceptive status (combined pill, progestin-only, none)",
      "Habitual caffeine intake tertile (low <100mg/day, moderate 100-200mg/day, high >200mg/day)",
      "Sport/discipline type",
      "Age band (18-24, 25-35)"
    ],
    "form": "Randomised, double-blind, placebo-controlled crossover trial. Each participant completes two identical test sessions (caffeine 3mg/kg body mass, capsule form, vs identical placebo capsule with matching taste-masking), at least one week apart, timed to the same self-reported cycle phase where possible or matched by contraceptive pill-pack day. Naturally cycling women are scheduled using LH-confirmed timing for follicular vs luteal sessions; hormonal contraceptive users are tested during active-pill and placebo-pill weeks. Each session: baseline symptom and alertness questionnaire, cognitive battery, sport-specific skill circuit, 60 minutes post-dose testing repeat of cognitive and skill battery, symptom checklist at 30, 60, 120 minutes. Total participation spans one full menstrual cycle or one contraceptive pack cycle (about 4-5 weeks) per participant. This is a randomised crossover intervention in a non-pregnant, non-labouring, non-paediatric, non-institutionalised adult population with genuine equipoise (optimal caffeine dosing strategy for female athletes is unknown), so standard ethics approval, written informed consent, and a data safety monitoring board are sufficient; no additional vulnerable-population safeguards are required. Sample size of 48 is a pragmatic estimate based on typical crossover caffeine-performance study sizes, not a formal power calculation.",
    "instrument_source": "Profile of Mood States (POMS) for subjective mood/alertness; Borg Rating of Perceived Exertion (RPE) scale for exertion; menstrual phase confirmed via urinary LH ovulation test kits",
    "generated_at": "2026-09-19",
    "model": "claude-sonnet-5"
  },
  "vbac-outcomes-standardized-neonatal-reporting": {
    "target_women": "Recruit approximately 3,000 pregnant women with exactly one prior low-transverse cesarean delivery, singleton gestation, and no contraindication to labor, from 10-15 hospital obstetric units across varied urban, suburban, and rural settings; enroll at 36-38 weeks gestation once they have made an informed choice (with their clinician) between attempting TOLAC or scheduling ERCD, and follow through delivery and 6 weeks postpartum.",
    "variables": [
      "Mode of delivery achieved (successful vaginal birth, emergency cesarean during labor, or scheduled repeat cesarean)",
      "Neonatal 5-minute Apgar score",
      "Umbilical cord arterial blood gas pH and base excess at birth",
      "Admission to neonatal intensive care unit and length of stay",
      "Diagnosis of hypoxic-ischemic encephalopathy (any grade) confirmed by neonatologist",
      "Uterine rupture or dehiscence occurrence and timing relative to labor",
      "Neonatal birth trauma (fracture, brachial plexus injury, or significant laceration) recorded by attending pediatrician"
    ],
    "stratifiers": [
      "Maternal age band (under 25, 25-34, 35 and older)",
      "Race and ethnicity, recorded to examine differences in access to trial-of-labor units, midwifery support, and induction protocols rather than biological difference",
      "Household income or insurance status (as a proxy for access to prenatal care and choice of delivery setting)",
      "Number of prior vaginal deliveries (none vs one or more)",
      "Indication for the original cesarean (e.g., failure to progress, breech, fetal distress)",
      "Gestational age at delivery (37-38 weeks, 39-40 weeks, 41+ weeks)"
    ],
    "form": "Prospective multicenter observational cohort study, not a randomized trial, because women and clinicians are already making the TOLAC-versus-ERCD choice based on clinical circumstances and preference, so there is no ethical basis to assign one option experimentally. Data collected via structured case report forms completed by labor-and-delivery staff at the time of birth, supplemented by chart abstraction of neonatal records, with a single follow-up phone survey at 6 weeks postpartum for late-onset complications. Enrollment runs continuously for 24 months to capture seasonal and staffing variation across sites. All participating sites obtain local ethics (IRB) approval, and all women give written informed consent to have their delivery and neonatal outcome data recorded and linked; no experimental intervention is given, so no data safety monitoring board is required, but a study steering committee reviews data quality quarterly.",
    "instrument_source": "American College of Obstetricians and Gynecologists (ACOG) Practice Bulletin on Vaginal Birth After Cesarean outcome definitions, used to standardize case report form categories (not a scored instrument, but the closest existing standardized definitional framework).",
    "generated_at": "2026-09-19",
    "model": "claude-sonnet-5"
  },
  "afghan-refugee-srh-long-term-interventions": {
    "target_women": "600 Afghan refugee women of reproductive age (15-49) living in Pakistan, recruited from a mix of UNHCR-registered refugee villages in Khyber Pakhtunkhwa (e.g. Peshawar-area camps) and undocumented/urban Afghan communities in Peshawar and Quetta, via community health workers and women's community organisations already working with these populations.",
    "variables": [
      "Use of any sexual or reproductive health service in the past 3 months (ANC visit, contraceptive counselling, postnatal check, skilled birth attendance) - self-report",
      "Current contraceptive method in use, if any, and reason for choice or non-use",
      "Score on a resilience scale measuring perceived ability to cope with adversity",
      "Self-reported autonomy in health decisions (who decides on care-seeking, spacing, delivery location)",
      "Exposure to and duration of participation in any existing SRH program or NGO intervention",
      "Maternal health outcome in the reporting period (pregnancy complication, mode of delivery, referral for emergency care)",
      "Score on a brief depression/anxiety screening instrument"
    ],
    "stratifiers": [
      "Age band (15-19, 20-34, 35-49)",
      "Registration status (UNHCR-registered vs undocumented) - a proxy for legal access to public health facilities, not a biological category",
      "Residence type (camp/refugee village vs urban informal settlement)",
      "Parity (nulliparous, 1-2 children, 3+ children)",
      "Duration of prior exposure to any SRH program (none, under 1 year, 1+ years)"
    ],
    "form": "Prospective observational cohort study following the same 600 women over 24 months with structured face-to-face interviews every 3 months (8 waves total), conducted by trained female Dari/Pashto-speaking interviewers in participants' homes or at community health centres, using a mix of validated scales and structured questions. This is observational because the women's exposure to programs, contraceptive use, and coping strategies already exist in the population and are not assigned by the researchers - randomising women into 'gets intervention' vs 'does not' would be both impractical and ethically unjustifiable given unequal existing access. Written informed consent obtained in participant's own language; study protocol and consent procedures approved by an independent ethics review board in Pakistan and by the researchers' home institution; given this is a low-resource, refugee population, an independent data safety and community advisory board reviews the study every 6 months and can pause data collection if any distress or safety issue (e.g. disclosure of violence) arises without an established, pre-agreed referral pathway. Sample size of 600 is an estimate based on feasibility of quarterly follow-up over 24 months and expected attrition of refugee populations (~30%), not a formal power calculation.",
    "instrument_source": "Connor-Davidson Resilience Scale (CD-RISC-25)",
    "generated_at": "2026-09-19",
    "model": "claude-sonnet-5"
  }
};
