/* Seed data — SPEC.md §5 and §9.
 *
 * SOURCED DATA. Every problem cites a published source, and every
 * missing or partial data need cites the authority that named the gap.
 * No record is a placeholder: is_demo is false throughout and the demo
 * banner no longer renders.
 *
 * Loaded by a <script> tag, not fetch(), so the app opens from file://
 * with no server (SPEC §13). Contents stay JSON-shaped and hand-editable:
 * the only JavaScript here is the assignment on the first line.
 *
 * Data needs are nested inside their problem instead of being a flat list
 * keyed by problem_id. Same fields as §5, less to keep in sync by hand.
 *
 * TWO GENERATIONS, and they are not identical in shape.
 *
 * 1. Five problems sourced by hand, before the intake pipeline existed.
 *    They carry collection_request blocks — this platform's own
 *    specification of which women, which variables and in what form,
 *    labelled unverified on screen. Those blocks predate the rule below
 *    and are kept as history, not as a model to follow. They have no
 *    claimed_date and no verification block, and the card says "Not
 *    established" rather than inventing one.
 *
 * 2. Six records from intake/run.mjs. Each abstract was fetched and
 *    compared against the record's claim by an AI, and each record was
 *    then admitted or rejected by a person, one at a time. See
 *    intake/README.md for exactly how that ran. Each carries
 *    gap_evidence.claimed_date, a
 *    verification block with the date of a live web search, and
 *    collection_guidance that is either sourced or null.
 *
 * THE RULE, from SPEC §5a: nothing is invented and stored. A record
 * carries what its source said and nothing more. A study design is
 * generated on request, kept in research-designs.js, and never enters
 * this file. intake/validate.mjs enforces this rather than trusting it.
 *
 * Two-tier origin (SPEC §5a). A problem is either:
 *   origin: "sourced"  — an authority has published the claim that this
 *                        data is missing, and gap_evidence cites it.
 *   origin: "proposed" — the problem is documented, but nobody has said
 *                        which data would close it.
 *   origin: null       — not yet assessed.
 *
 * origin and is_demo are different claims and both stay. is_demo means
 * "placeholder content"; origin means "who identified the gap".
 *
 * Sources for the five hand-sourced problems:
 *   Menopause      WHO menopause fact sheet; HEAF study; NICE NG23
 *   Maternal       WHO 2022 postnatal guideline; NICE NG194
 *   Autoimmune     J Rheumatology; Cureus narrative review 2025
 *   Cardiac        Lancet women and CVD Commission 2021; NICOR MINAP
 *   Endometriosis  WHO fact sheet; NICE NG73; WERF EPHect
 * The six intake records cite their own source on each card, and they
 * are listed in SPEC §9.
 *
 * One data need carries no gap_evidence: maternal-postnatal-unpaid-care.
 * No published source names that gap, so the record says the assessment
 * is this platform's own. That is the honest state under §8.1, not an
 * omission waiting to be filled.
 */

const DATA = {
  problems: [

    {
      id: "menopause-workplace",
      title: "Menopause symptoms go unmeasured in working life",
      area: "Menopause",
      summary:
        "Most women reach menopause between 45 and 55, and women " +
        "aged 50 and over were 26% of all women and girls globally " +
        "in 2021. WHO notes the symptoms can disrupt professional " +
        "as well as personal life, and that awareness and access to " +
        "menopause services remain a challenge in most countries. " +
        "Severity is recorded in clinical settings, if at all, and " +
        "almost never alongside what a working day actually " +
        "demands.",
      affected_women:
        "Women aged 40–58 in paid employment, including shift and " +
        "frontline workers",
      source:
        "https://www.who.int/news-room/fact-sheets/detail/menopause",
      origin: "sourced",
      is_demo: false,
      map_point: { kind: "systemic", x: 334, y: 95, side: "left", label_y: 80 },
      data_needs: [
        {
          id: "menopause-workplace-symptom-diary",
          problem_id: "menopause-workplace",
          description:
            "Daily symptom severity paired with the work tasks done that day",
          why_it_matters:
            "Without the pairing, no one can tell which symptoms actually " +
            "interfere with which kinds of work.",
          status: "missing",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://pmc.ncbi.nlm.nih.gov/articles/PMC9819903/",
            note:
              "The HEAF study, one of the largest UK surveys of menopause " +
              "symptoms at work, found about a third of working women had " +
              "moderate or severe difficulty coping at work — and states " +
              "plainly that women were not asked to rate the severity of " +
              "their symptoms. The link between severity and the working " +
              "day is missing from the evidence, not from the question.",
            region: "United Kingdom"
          },
          collection_request: {
            data_need_id: "menopause-workplace-symptom-diary",
            target_women:
              "Women aged 40–58 in paid employment, mixed sectors, " +
              "including shift workers and those in physically demanding " +
              "roles. Perimenopausal and postmenopausal both included.",
            variables: [
              "Hot flush frequency and severity",
              "Sleep quality the night before",
              "Concentration and memory difficulty",
              "Mood",
              "Joint or muscle pain",
              "Heavy or unpredictable bleeding",
              "The day's main work task",
              "Whether a symptom changed what she did at work that day"
            ],
            stratifiers: [
              "Age band",
              "Menopausal stage (peri- or post-)",
              "Sector",
              "Shift pattern",
              "Whether HRT or another treatment is in use"
            ],
            form:
              "A short baseline questionnaire at enrolment, then a " +
              "3-month daily diary on a phone: six symptom sliders plus " +
              "one multiple-choice question on the day's main work task. " +
              "Under two minutes a day.",
            instrument_source: ""
          }
        },
        {
          id: "menopause-workplace-adjustments",
          problem_id: "menopause-workplace",
          description:
            "Which workplace adjustments were requested, granted or refused",
          why_it_matters:
            "Tells employers which adjustments are worth offering, rather " +
            "than which ones sound reasonable.",
          status: "missing",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://www.who.int/news-room/fact-sheets/detail/menopause",
            note:
              "WHO records that awareness of and access to menopause " +
              "information and services remain a significant challenge in " +
              "most countries, and that many governments have no health " +
              "policy covering them. WHO names the policy vacuum; " +
              "recording which adjustments were asked for, granted or " +
              "refused is this platform's specification for filling it.",
            region: "Global"
          },
          collection_request: {
            data_need_id: "menopause-workplace-adjustments",
            target_women:
              "Women aged 40–58 who have disclosed menopause symptoms to " +
              "an employer, and a comparison group who chose not to " +
              "disclose.",
            variables: [
              "Which adjustments were requested",
              "Which were granted, refused or left unanswered",
              "How long the decision took, and who made it",
              "What changed at work afterwards",
              "Reasons given for refusal, recorded verbatim",
              "Reasons for not disclosing at all"
            ],
            stratifiers: [
              "Sector",
              "Organisation size",
              "Seniority",
              "Union presence",
              "Whether a written menopause policy exists"
            ],
            form:
              "One 45-minute semi-structured interview, 12 fixed " +
              "questions plus follow-ups, transcribed and coded against a " +
              "fixed category list.",
            instrument_source: ""
          }
        },
        {
          id: "menopause-workplace-prevalence",
          problem_id: "menopause-workplace",
          description: "Age at onset of first symptoms, by region",
          why_it_matters:
            "Sets the age range that any workplace policy has to cover.",
          status: "partial",
          existing_data_note:
            "Cohort data exists for several high-income countries. Coverage " +
            "of South Asia, sub-Saharan Africa and Latin America is thin, and " +
            "the age bands used are not comparable between studies.",
          dataset_source: {
            source:
              "https://www.swanstudy.org/swan-research/data-access/",
            note:
              "The Study of Women's Health Across the Nation (SWAN) " +
              "follows 3,302 women through the menopausal transition, " +
              "with public-use datasets from baseline to the tenth annual " +
              "visit available to any registered user. United States " +
              "only, which is the coverage limit described above."
          },
          gap_evidence: {
            source:
              "https://www.nice.org.uk/guidance/ng23/chapter/Recommendations-for-research",
            note:
              "NICE NG23 research recommendation 9 asks what the impact " +
              "of HRT is for people from ethnic minority backgrounds — " +
              "NICE naming, as an open question, that the menopause " +
              "evidence base is not evenly distributed across " +
              "populations. WHO separately notes a paucity of data on " +
              "trans and gender diverse experiences of menopause. The " +
              "extension to regional coverage of age at onset is this " +
              "platform's.",
            region: "United Kingdom"
          },
          collection_request: {
            data_need_id: "menopause-workplace-prevalence",
            target_women:
              "Women aged 35–60 in regions with no existing cohort data, " +
              "recruited through primary care and community health " +
              "workers.",
            variables: [
              "Age at first symptom",
              "Which symptom came first",
              "Age at last menstrual period",
              "Which symptoms are still present now",
              "Whether care was sought, and what was offered"
            ],
            stratifiers: [
              "Region",
              "Urban or rural",
              "Age band matched to the existing cohorts",
              "Parity",
              "Education"
            ],
            form:
              "A 20-question interviewer-administered survey, one " +
              "contact, in the local language. The age bands must match " +
              "those the existing cohorts already use, or the results " +
              "cannot be pooled with them.",
            instrument_source: ""
          }
        },
        {
          id: "menopause-workplace-exit",
          problem_id: "menopause-workplace",
          description:
            "Employment status before and after symptom onset",
          why_it_matters:
            "Shows whether symptoms push women out of paid work, and when.",
          status: "collected",
          existing_data_note:
            "Several national labour-force surveys track employment by age " +
            "and sex, and can be linked to health survey waves. The data " +
            "exists and is usable for this question without new collection.",
          dataset_source: {
            source:
              "https://genderdata.worldbank.org/en/indicators",
            note:
              "World Bank Gender Data Portal, labour force participation " +
              "and employment indicators by sex and age, free to access. " +
              "These are aggregate indicators; linking employment status " +
              "to symptom onset at the individual level needs the " +
              "national labour force surveys behind them."
          },
          collection_request: null
        }
      ]
    },

    {
      id: "maternal-postnatal-followup",
      title: "Postnatal recovery stops being recorded after six weeks",
      area: "Maternal health",
      summary:
        "WHO's 2022 postnatal guideline sets out 63 " +
        "recommendations, and scopes all of them to the six-week " +
        "(42-day) period after birth. Problems that appear or " +
        "persist after that window — pain, incontinence, wound " +
        "complications — fall outside the period anyone is required " +
        "to write anything down.",
      affected_women:
        "Women in the first two years after giving birth, in any setting " +
        "with routine postnatal care",
      source:
        "https://www.who.int/publications/i/item/9789240045989",
      origin: "sourced",
      is_demo: false,
      map_point: { kind: "site", x: 408, y: 248, side: "left", label_y: 234 },
      data_needs: [
        {
          id: "maternal-postnatal-symptoms-12m",
          problem_id: "maternal-postnatal-followup",
          description:
            "Physical symptoms at 6 and 12 months after birth",
          why_it_matters:
            "Defines how long postnatal care needs to last, using numbers " +
            "rather than custom.",
          status: "missing",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://www.nice.org.uk/guidance/ng194/chapter/Recommendations-for-research",
            note:
              "NICE NG194 research recommendation 3 asks which tools for " +
              "the clinical review of women, including pain scores, are " +
              "effective during the first 8 weeks after birth. The " +
              "committee could not identify effective tools even inside " +
              "that window, and neither NG194 nor the WHO guideline " +
              "reaches beyond it.",
            region: "United Kingdom"
          },
          collection_request: {
            data_need_id: "maternal-postnatal-symptoms-12m",
            target_women:
              "Women 6 and 12 months after a first or subsequent birth, " +
              "covering vaginal and caesarean births, recruited at " +
              "discharge.",
            variables: [
              "Pain, and where it is",
              "Urinary and faecal continence",
              "Wound or scar healing",
              "Pain during sex, and whether sex has resumed",
              "Fatigue and sleep",
              "Whether help was sought, and what was offered"
            ],
            stratifiers: [
              "Mode of birth",
              "Parity",
              "Perineal trauma or caesarean",
              "Gestation at birth",
              "Whether breastfeeding"
            ],
            form:
              "Two follow-up questionnaires sent by SMS at 6 and 12 " +
              "months, 15 questions each, with a phone option for anyone " +
              "who prefers it.",
            instrument_source: ""
          }
        },
        {
          id: "maternal-postnatal-mode-of-birth",
          problem_id: "maternal-postnatal-followup",
          description: "Mode of birth and complications during delivery",
          why_it_matters:
            "Every later outcome has to be read against what happened at " +
            "the birth itself.",
          status: "collected",
          existing_data_note:
            "Routinely recorded in hospital delivery records and national " +
            "birth registries in most settings. Available for linkage where " +
            "ethics approval allows it.",
          dataset_source: {
            source:
              "https://www.gov.uk/government/statistics/maternity-services-monthly-statistics-final-january-2026-provisional-february-2026-official-statistics",
            note:
              "NHS England publishes Maternity Services Monthly " +
              "Statistics from the Maternity Services Data Set, a " +
              "patient-level national collection. Delivery method " +
              "analysis files are published with each release. England " +
              "only."
          },
          collection_request: null
        },
        {
          id: "maternal-postnatal-unpaid-care",
          problem_id: "maternal-postnatal-followup",
          description:
            "Hours of unpaid care and household work in the recovery period",
          why_it_matters:
            "Recovery is measured against rest that many women do not get; " +
            "without this, slow recovery looks like a medical mystery.",
          status: "missing",
          existing_data_note: "",
          collection_request: {
            data_need_id: "maternal-postnatal-unpaid-care",
            target_women: "Women in the first year after giving birth.",
            variables: [
              "Hours of infant care",
              "Hours of care for other children or dependent adults",
              "Hours of housework",
              "Hours of paid work",
              "Hours of uninterrupted sleep",
              "Longest continuous rest in the day",
              "Who else was present to help"
            ],
            stratifiers: [
              "Household composition",
              "Number and ages of other children",
              "Partner's leave status",
              "Paid help available",
              "Whether she has returned to paid work"
            ],
            form:
              "Two 24-hour time-use diaries, one weekday and one weekend " +
              "day, repeated at 3 and 9 months. The time-use diary is an " +
              "established standard instrument, not a new one.",
            instrument_source: ""
          }
        },
        {
          id: "maternal-postnatal-mental-health",
          problem_id: "maternal-postnatal-followup",
          description: "Mental health screening beyond the first three months",
          why_it_matters:
            "Late-onset depression and anxiety are missed entirely if " +
            "screening stops early.",
          status: "partial",
          existing_data_note:
            "Screening at 6–8 weeks is widespread and well recorded. " +
            "Screening after three months happens inconsistently, and where " +
            "it does happen the results are rarely held in a form anyone " +
            "can analyse.",
          gap_evidence: {
            source:
              "https://www.ncbi.nlm.nih.gov/books/NBK579653/",
            note:
              "WHO's 2022 postnatal guideline scopes all 63 of its " +
              "recommendations to the 42 days after birth. Screening " +
              "later than that is not covered by the global standard, so " +
              "where it happens it happens without a common instrument or " +
              "a common schedule.",
            region: "Global"
          },
          collection_request: {
            data_need_id: "maternal-postnatal-mental-health",
            target_women:
              "Women 4–18 months after birth, including those who " +
              "screened negative at six weeks.",
            variables: [
              "The same validated screening score used at six weeks, repeated",
              "Onset date of any new symptoms",
              "Whether help was sought",
              "What treatment was offered, and whether it was taken up"
            ],
            stratifiers: [
              "Six-week screening result",
              "Parity",
              "Mode of birth and complications",
              "History of mental illness before pregnancy"
            ],
            form:
              "Three contacts at 6, 12 and 18 months, 10 questions each, " +
              "self-completed online or on paper. It must be the same " +
              "validated instrument used at six weeks, or the scores are " +
              "not comparable.",
            instrument_source: ""
          }
        }
      ]
    },

    {
      id: "autoimmune-diagnosis-delay",
      title: "Years pass between first autoimmune symptom and diagnosis",
      area: "Autoimmune disease",
      summary:
        "Most autoimmune conditions are far more common in women, " +
        "and the path to diagnosis often runs through several " +
        "specialties. Diagnostic delay is described in the " +
        "rheumatology literature as a global health problem, but " +
        "what gets recorded is the diagnosis. The years before it — " +
        "the visits, the tests, the other explanations offered — " +
        "usually do not.",
      affected_women:
        "Women of any age presenting with fatigue, joint pain or " +
        "neurological symptoms that are not yet explained",
      source:
        "https://www.jrheum.org/content/50/12/1528",
      origin: "sourced",
      is_demo: false,
      map_point: { kind: "systemic", x: 545, y: 518, side: "right", label_y: 506 },
      data_needs: [
        {
          id: "autoimmune-pathway",
          problem_id: "autoimmune-diagnosis-delay",
          description:
            "The full sequence of appointments between first symptom and " +
            "diagnosis, with dates and specialties",
          why_it_matters:
            "Identifies the exact step where the pathway stalls, which is " +
            "the only step a health system can fix.",
          status: "missing",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://www.jrheum.org/content/50/12/1528",
            note:
              "The Journal of Rheumatology argues that current " +
              "definitions of diagnostic delay are incomplete: they fail " +
              "to systematically incorporate individual, community, " +
              "sociocultural and economic factors, and the care-seeking " +
              "models in use were built for other conditions. The authors " +
              "call for a model built for rheumatic disease, which needs " +
              "the pathway recorded before it can be built.",
            region: "Global"
          },
          collection_request: {
            data_need_id: "autoimmune-pathway",
            target_women:
              "Women diagnosed with an autoimmune condition in the last " +
              "two years, across at least three conditions, recruited " +
              "through specialist clinics and patient organisations.",
            variables: [
              "Date of first symptom",
              "Date and specialty of every appointment before diagnosis",
              "Tests ordered, and their results",
              "Referrals made, and referrals refused",
              "Date of diagnosis, and who made it"
            ],
            stratifiers: [
              "Condition",
              "Age at first symptom",
              "Sex, against a male comparison group",
              "Route of first presentation",
              "Country and health system"
            ],
            form:
              "One 60-minute retrospective timeline interview producing a " +
              "dated event timeline, supported by the woman's own records " +
              "where she consents to release them.",
            instrument_source: ""
          }
        },
        {
          id: "autoimmune-alternative-explanations",
          problem_id: "autoimmune-diagnosis-delay",
          description:
            "Explanations offered before diagnosis, recorded verbatim",
          why_it_matters:
            "Turns a widely reported experience into something countable, " +
            "which is what changes clinical training.",
          status: "missing",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://pmc.ncbi.nlm.nih.gov/articles/PMC12829432/",
            note:
              "A 2025 narrative review finds women's symptoms attributed " +
              "to stress, anxiety or psychosomatic causes rather than " +
              "organic disease, and notes that diagnostic inequity in " +
              "young women remains under-synthesised across specialties. " +
              "It calls for routine disaggregation of diagnostic " +
              "intervals by sex, age and ethnicity. Recording the " +
              "explanations verbatim is what makes that countable.",
            region: "Global"
          },
          collection_request: {
            data_need_id: "autoimmune-alternative-explanations",
            target_women:
              "The same diagnosed cohort, with a comparison group of men " +
              "diagnosed with the same conditions.",
            variables: [
              "Every explanation offered before diagnosis, recorded verbatim",
              "Who offered it, and at which visit",
              "What was advised or prescribed as a result",
              "Whether she was referred onward"
            ],
            stratifiers: [
              "Sex",
              "Condition",
              "Age band",
              "Specialty of the clinician offering the explanation"
            ],
            form:
              "One open-ended question inside the timeline interview, " +
              "unlimited free text, coded against a fixed category list " +
              "by two independent raters.",
            instrument_source: ""
          }
        },
        {
          id: "autoimmune-sex-disaggregated-trials",
          problem_id: "autoimmune-diagnosis-delay",
          description:
            "Trial results for existing treatments, reported separately by sex",
          why_it_matters:
            "Dosing and side-effect profiles cannot be assumed to carry over " +
            "from a mixed or mostly male trial population.",
          status: "partial",
          existing_data_note:
            "Many trials enrol women but publish pooled results. The " +
            "underlying data usually exists with the trial sponsor; what is " +
            "missing is the disaggregated reporting, not the collection.",
          gap_evidence: {
            source:
              "https://pmc.ncbi.nlm.nih.gov/articles/PMC5793986/",
            note:
              "The SAGER guidelines have defined how sex and gender " +
              "should be reported in research since 2016, and exist " +
              "because sex differences are routinely overlooked in " +
              "design, analysis and reporting. Here the data was " +
              "collected and the reporting was not done, which is why " +
              "this request goes to sponsors rather than to women.",
            region: "Global"
          },
          collection_request: {
            data_need_id: "autoimmune-sex-disaggregated-trials",
            target_women:
              "No new participants. The request goes to trial sponsors " +
              "for re-analysis of women already enrolled.",
            variables: [
              "Primary and secondary outcomes, reported separately by sex",
              "Adverse events by sex",
              "Dose and dose adjustments by sex",
              "Withdrawals, and the reasons for them, by sex"
            ],
            stratifiers: [
              "Sex",
              "Age band",
              "Menopausal status where recorded",
              "Body weight",
              "Concomitant medication"
            ],
            form:
              "A structured data request to sponsors, returned on a " +
              "standard reporting template. The SAGER guidelines already " +
              "define how sex and gender should be reported; the template " +
              "follows them.",
            instrument_source: ""
          }
        }
      ]
    },

    {
      id: "cardiac-symptom-recognition",
      title: "Heart attack symptoms in women are described from male baselines",
      area: "Cardiovascular health",
      summary:
        "Cardiovascular disease is the leading cause of death in " +
        "women, and the 2021 Lancet Commission describes it as " +
        "understudied, under-recognised, underdiagnosed and " +
        "undertreated. Presentation guidance is built on symptom " +
        "patterns most studied in men, and the presentations that " +
        "fall outside that picture are not recorded in a form that " +
        "could update it.",
      affected_women:
        "Women of all ages presenting with chest, jaw, back or abdominal " +
        "symptoms, and women under 55 in particular",
      source:
        "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(21)00684-X/abstract",
      origin: "sourced",
      is_demo: false,
      map_point: { kind: "site", x: 447, y: 188, side: "right", label_y: 170 },
      data_needs: [
        {
          id: "cardiac-presenting-symptoms",
          problem_id: "cardiac-symptom-recognition",
          description:
            "Presenting symptoms in women's own words at first contact",
          why_it_matters:
            "Triage responds to how a symptom is described, not to how it is " +
            "later classified.",
          status: "missing",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(21)00684-X/abstract",
            note:
              "The Lancet women and cardiovascular disease Commission " +
              "identifies knowledge gaps in research, prevention, " +
              "treatment and access to care for women, and describes the " +
              "disease in women as under-recognised and underdiagnosed. " +
              "Capturing the first description in her own words is where " +
              "recognition either happens or fails.",
            region: "Global"
          },
          collection_request: {
            data_need_id: "cardiac-presenting-symptoms",
            target_women:
              "Women arriving at emergency departments with any symptom " +
              "later confirmed as cardiac, across the full adult age " +
              "range and including women under 55.",
            variables: [
              "The first description of the symptom in her own words, verbatim",
              "The words used for location, quality and severity",
              "Associated symptoms mentioned unprompted",
              "What she thought was happening",
              "The triage category assigned"
            ],
            stratifiers: [
              "Age band",
              "Final diagnosis",
              "First language",
              "Whether she arrived by ambulance or self-presented"
            ],
            form:
              "One free-text field added to the existing triage intake " +
              "form, plus a 5-item structured checklist, completed at the " +
              "point of arrival.",
            instrument_source: ""
          }
        },
        {
          id: "cardiac-time-to-treatment",
          problem_id: "cardiac-symptom-recognition",
          description: "Time from arrival to treatment, by sex and age",
          why_it_matters:
            "Shows whether the recognition problem translates into a delay " +
            "that can be measured in minutes.",
          status: "collected",
          existing_data_note:
            "Hospital systems already timestamp arrival, assessment and " +
            "treatment, and national cardiac registries record " +
            "patient sex alongside them, so the analysis needs no " +
            "new collection. Whether a given published summary " +
            "presents the breakdown is a separate question from " +
            "whether the registry holds the fields.",
          dataset_source: {
            source:
              "https://www.nicor.org.uk/national-cardiac-audit-programme/heart-attack-audit-minap",
            note:
              "The Myocardial Ischaemia National Audit Project (MINAP) " +
              "records the patient journey from the call to emergency " +
              "services or arrival at an emergency department through " +
              "diagnosis and treatment, across hospitals in England and " +
              "Wales, with public interim and annual reports."
          },
          collection_request: null
        },
        {
          id: "cardiac-pre-hospital-decision",
          problem_id: "cardiac-symptom-recognition",
          description:
            "How long women waited before seeking help, and what decided it",
          why_it_matters:
            "A delay that happens at home cannot be fixed inside the " +
            "hospital, and it is invisible in hospital data.",
          status: "missing",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(21)00684-X/abstract",
            note:
              "The same Commission names awareness and recognition among " +
              "the gaps it sets out to close. A delay that happens at " +
              "home is invisible in hospital data by construction: no " +
              "hospital system holds a timestamp for the hours before " +
              "arrival.",
            region: "Global"
          },
          collection_request: {
            data_need_id: "cardiac-pre-hospital-decision",
            target_women:
              "Women admitted with a confirmed cardiac event, interviewed " +
              "before discharge.",
            variables: [
              "Time from first symptom to seeking help",
              "What she did in between",
              "Who she told first",
              "What finally prompted the decision",
              "Whether caring or work duties delayed her",
              "What she thought the symptom was"
            ],
            stratifiers: [
              "Age band",
              "Caregiving responsibilities at home",
              "Living alone or with others",
              "Distance to hospital",
              "Prior cardiac history"
            ],
            form:
              "One 15-minute bedside interview before discharge: 8 fixed " +
              "questions on timing, plus two open questions on what " +
              "prompted the decision to seek help.",
            instrument_source: ""
          }
        }
      ]
    },

    {
      id: "endometriosis-symptom-burden",
      title: "Endometriosis pain is recorded only at the point of diagnosis",
      area: "Endometriosis",
      summary:
        "Endometriosis affects around 10% of women and girls of " +
        "reproductive age — roughly 190 million people — and diagnosis " +
        "takes four to twelve years on average. The record usually begins " +
        "at the diagnosis itself, so the years of symptoms before it, and " +
        "the day-to-day burden after it, stay largely unwritten.",
      affected_women:
        "Women and girls from menarche onward with cyclical or chronic " +
        "pelvic pain, diagnosed or not",
      source: "https://www.who.int/news-room/fact-sheets/detail/endometriosis",
      origin: "sourced",
      is_demo: false,
      map_point: { kind: "site", x: 430, y: 283, side: "left", label_y: 372, r: 10.5 },
      data_needs: [
        {
          id: "endo-pain-over-cycle",
          problem_id: "endometriosis-symptom-burden",
          description:
            "Pain severity mapped across the menstrual cycle over several months",
          why_it_matters:
            "A single clinic score cannot show a pattern that only appears " +
            "across a cycle.",
          status: "missing",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://www.nice.org.uk/guidance/ng73/chapter/" +
              "Recommendations-for-research",
            note:
              "NICE NG73, research recommendations 1 and 3. The committee " +
              "found the evidence on managing endometriosis pain small and " +
              "not clearly generalisable, and identified no high-quality " +
              "research on whether non-medical approaches reduce pain and " +
              "fatigue. NICE names the missing outcome evidence; the " +
              "cycle-anchored longitudinal design below is this platform's " +
              "specification, not NICE's.",
            region: "United Kingdom"
          },
          collection_request: {
            data_need_id: "endo-pain-over-cycle",
            target_women:
              "Women and girls aged 15–45 with suspected or diagnosed " +
              "endometriosis, including those not yet under specialist " +
              "care.",
            variables: [
              "Pain severity (0–10)",
              "Cycle day",
              "Whether pain interfered with the day's activities (0–10)",
              "Analgesia taken",
              "Bleeding",
              "Bowel or bladder pain"
            ],
            stratifiers: [
              "Age band",
              "Diagnosed or not",
              "Time since first symptom",
              "Current treatment",
              "Whether trying to conceive"
            ],
            form:
              "The WERF EPHect patient questionnaire (EPQ) at enrolment, " +
              "so the cohort is described in the terms other " +
              "endometriosis studies already use. Then a 6-month daily " +
              "log on a phone, under 30 seconds a day.",
            instrument_source: "http://www.ephect.org/"
          }
        },
        {
          id: "endo-education-work-impact",
          problem_id: "endometriosis-symptom-burden",
          description:
            "Days of school, study or paid work lost to symptoms",
          why_it_matters:
            "Converts symptom burden into a figure that reaches people who " +
            "set health budgets.",
          status: "partial",
          existing_data_note:
            "Some patient surveys ask about days lost, but they recruit " +
            "through specialist clinics, so they miss undiagnosed women and " +
            "over-represent severe cases. WHO notes that access to early " +
            "diagnosis is limited in many settings, which means clinic-" +
            "recruited samples miss much of the affected population.",
          gap_evidence: {
            source:
              "https://www.nice.org.uk/guidance/ng73/chapter/" +
              "Recommendations-for-research",
            note:
              "NICE NG73, research recommendations 3 and 4. Ability to " +
              "work, quality of life and level of function are named as " +
              "outcomes endometriosis affects, while the guideline found " +
              "their effectiveness as measured outcomes untested in the " +
              "interventions meant to improve them.",
            region: "United Kingdom"
          },
          collection_request: {
            data_need_id: "endo-education-work-impact",
            target_women:
              "A general-population sample of women and girls aged 15–45, " +
              "not recruited through clinics, so undiagnosed cases are " +
              "included.",
            variables: [
              "Days of school, study or paid work missed",
              "Days attended while symptomatic",
              "Tasks dropped or handed to someone else",
              "Income lost",
              "Whether a reason was given to the employer or school, and which"
            ],
            stratifiers: [
              "Age band",
              "Diagnosed, suspected or neither",
              "Student or employed",
              "Sector",
              "Country"
            ],
            form:
              "A 12-month population survey, one 10-question contact per " +
              "month, online with a phone alternative.",
            instrument_source: ""
          }
        },
        {
          id: "endo-treatment-response",
          problem_id: "endometriosis-symptom-burden",
          description:
            "Symptom change after starting each treatment option",
          why_it_matters:
            "Lets a clinician say what usually happens next, instead of " +
            "trying options in turn.",
          status: "missing",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://www.nice.org.uk/guidance/ng73/chapter/" +
              "Recommendations-for-research",
            note:
              "NICE NG73, research recommendation 2, which also records " +
              "why the existing literature cannot answer it: disease stage " +
              "is often not sufficiently defined in studies and treatment " +
              "modalities vary, so outcomes cannot be pooled with " +
              "certainty. Recommendation 5 adds that the effect of " +
              "hormonal treatment dose and duration on fertility outcomes " +
              "is still unknown.",
            region: "United Kingdom"
          },
          collection_request: {
            data_need_id: "endo-treatment-response",
            target_women:
              "Women starting any endometriosis treatment — hormonal, " +
              "surgical or pain management.",
            variables: [
              "Pain and interference scores carried over from the daily log",
              "Treatment started, with dose and duration",
              "Side effects",
              "Treatments stopped, and why",
              "Whether conception was attempted, and the outcome"
            ],
            stratifiers: [
              "Disease stage, recorded on the EPHect surgical form",
              "Age band",
              "Prior treatments",
              "Whether trying to conceive",
              "Comorbid conditions"
            ],
            form:
              "A baseline month plus 12 months of the daily log, with a " +
              "10-question review at 3, 6 and 12 months. Stage and " +
              "surgical findings recorded on the WERF EPHect standard " +
              "surgical form (SSF) and patient questionnaire (EPQ-S), so " +
              "results pool with other studies — the exact failure NICE " +
              "identified in the existing literature.",
            instrument_source: "http://www.ephect.org/"
          }
        }
      ]
    },


    /* ---- Below: produced by the intake run (intake/run.mjs) and
       admitted one at a time by a person, after an AI compared each
       abstract against the claim made from it. Each record
       carries the date its gap was claimed and the date it was checked
       against the live web. ---- */

    {
      id: "high-altitude-cardiometabolic-women",
      title:
        "Women's cardiometabolic responses to high-altitude exposure are poorly understood, leaving them vulnerable to altitude-related illness.",
      area: "Cardiovascular health",
      summary:
        "An increasing number of women live, work, and engage in athletic activity at high altitude, yet little is known about how sex-specific factors such as the menstrual cycle, contraceptive use, pregnancy, and menopause interact with cardiometabolic risk in these environments. This lack of knowledge may contribute to impaired acclimatization and increased risk of altitude-related illness in women. The review synthesizes existing evidence to identify knowledge gaps and guide future research.",
      affected_women:
        "Women exposed to high altitude through occupational, athletic, or residential settings.",
      source:
        "https://doi.org/10.3390/ijms27146349",
      origin: "sourced",
      is_demo: false,
      map_point: { kind: "site", x: 390, y: 153, side: "left",  label_y: 150 },
      data_needs: [
        {
          id: "high-altitude-cardiometabolic-women-adaptation-data",
          problem_id: "high-altitude-cardiometabolic-women",
          description:
            "Data on physiological and cardiometabolic adaptations of women at high altitude, including how menstrual cycle, contraceptive use, pregnancy, and menopause affect acclimatization.",
          why_it_matters:
            "Without this data, prevention, acclimatization strategies, and clinical management for women at high altitude cannot be properly informed, potentially increasing their risk of altitude-related illness.",
          status: "partial",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://doi.org/10.3390/ijms27146349",
            note:
              "The abstract states 'little is known about the physiological adaptations experienced by women at high altitude, particularly regarding metabolic alterations that may contribute to impaired acclimatization,' and that the review aims to 'identify existing knowledge gaps' in this area.",
            region: null,
            claimed_date: "2026-07-17"
          },
          dataset_source: {
            note:
              "Covers menstrual-cycle-phase effects on cardiorespiratory/exercise responses at high altitude (Sci Rep 2024) and menstrual cycle/menopause/progesterone effects on acute mountain sickness (Wilderness Environ Med 2024), plus a broader narrative review of hormonal life-course effects on hypoxia responses. Does NOT constitute a large-scale primary dataset on cardiometabolic adaptation across menstrual cycle, contraceptive use, pregnancy, and menopause combined; pregnancy-specific and chronic long-term acclimatization data at altitude remain limited.",
            source:
              "https://www.nature.com/articles/s41598-024-79702-7"
          },
          collection_guidance: null,
          verification: {
            checked_at: "2026-09-18",
            method: "web search",
            findings:
              "This exact knowledge gap comes from the review 'Cardiometabolic Risk Factors in Women Exposed to High Altitude' (PubMed 42511692 / PMC13410897), which itself synthesizes existing evidence rather than reflecting a total void. Since related work has begun to fill parts of the gap: a 2024 Scientific Reports study examined menstrual-cycle-phase effects on cardiorespiratory responses to submaximal exercise at high altitude, a 2024 study in Wilderness & Environmental Medicine ('Women at Altitude') examined menstrual-cycle phase, menopause, and exogenous progesterone in relation to acute mountain sickness, and a newer review ('Hormonal status and reproductive life-course states as modulators of women's physiological responses to acute and chronic hypoxia') explicitly covers menstrual cycle, contraception, pregnancy, and menopause effects on hypoxic responses. These sources address menstrual cycle and menopause effects on acute responses and AMS risk fairly directly, but the deeper cardiometabolic and long-term acclimatization data - especially for pregnancy and for chronic/long-term high-altitude residents - remains comparatively sparse and is described in these same recent papers as still needing more research.",
            sources: ["https://www.sciencedirect.com/science/article/pii/S0026286225001177?via=ihub","https://pmc.ncbi.nlm.nih.gov/articles/PMC13410897/","https://link.springer.com/article/10.1007/s40279-023-01954-6","https://ouci.dntb.gov.ua/en/works/7pYRmAx4/","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10031815/","https://pubmed.ncbi.nlm.nih.gov/42511692/","https://clinicaltrials.gov/study/NCT05001048","https://pmc.ncbi.nlm.nih.gov/articles/PMC11052836/","https://journals.physiology.org/doi/abs/10.1152/jappl.1973.34.4.471","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11561278/","https://www.academia.edu/31405651/Hormone_profile_during_the_menstrual_cycle_at_high_altitude","https://www.nature.com/articles/s41598-024-79702-7","https://link.springer.com/article/10.1186/s13293-026-00954-1","https://pubmed.ncbi.nlm.nih.gov/42471728/","https://journals.sagepub.com/doi/full/10.1089/ham.2023.0100","https://www.frontiersin.org/journals/global-womens-health/articles/10.3389/fgwh.2025.1544832/full","https://clinicaltrials.gov/study/NCT06894550","https://clinicaltrials.gov/study/NCT06446427","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12832471/","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12497735/","https://clinicaltrials.gov/study/NCT06039475","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12368545/","https://www.frontiersin.org/journals/cardiovascular-medicine/articles/10.3389/fcvm.2022.1024263/pdf"]
          }
        }
      ]
    },

    {
      id: "androgen-drug-metabolism",
      title:
        "It is unclear how testosterone and androgen-rich conditions affect drug metabolism and transport in people assigned female at birth",
      area: "Pharmacology",
      summary:
        "Endogenous and exogenous androgens affect health outcomes across life in people assigned female at birth, but little is known about how exogenous testosterone or androgen-rich conditions like PCOS affect how drugs are metabolized and transported. A narrative synthesis of in vivo evidence found this area remains understudied.",
      affected_women:
        "Cisgender women and transgender people assigned female at birth, including those with polycystic ovary syndrome or using exogenous testosterone",
      source:
        "https://doi.org/10.1080/17425255.2026.2726547",
      origin: "sourced",
      is_demo: false,
      data_needs: [
        {
          id: "androgen-drug-metabolism-probe-studies",
          problem_id: "androgen-drug-metabolism",
          description:
            "Clinical pharmacology data on how testosterone and androgen-rich conditions affect drug-metabolizing enzymes and transporters in people assigned female at birth",
          why_it_matters:
            "Without this data, clinicians lack evidence to guide drug dosing and safety for cisgender women and transgender people exposed to exogenous testosterone or androgen-rich conditions.",
          status: "missing",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://doi.org/10.1080/17425255.2026.2726547",
            note:
              "The abstract states that 'the effects of testosterone and other androgens on drug metabolism and transport remain understudied in people assigned female at birth' and calls for well-designed probe-substrate studies and use of prescribed medications as clinical probes of relevant enzymes and transporters.",
            region: null,
            claimed_date: "2026-09-02"
          },
          dataset_source: null,
          collection_guidance: {
            note:
              "Investigators should use well-designed probe-substrate studies when feasible, and use prescribed medications as clinical probes of relevant drug-metabolizing enzymes and transporters, in cisgender women and transgender people.",
            source:
              "https://doi.org/10.1080/17425255.2026.2726547"
          },
          verification: {
            checked_at: "2026-09-18",
            method: "web search",
            findings:
              "Web search tools were unavailable for this query in this session (repeated tool-limit errors prevented any live search from completing), so no confirmed new dataset can be verified. Based on prior knowledge of the field, dedicated clinical pharmacology studies systematically probing how testosterone or androgen-rich states (e.g., PCOS, gender-affirming hormone therapy) alter CYP450 enzyme activity or drug transporter function specifically in people assigned female at birth remain sparse and fragmented; most existing work on gender-affirming hormone therapy pharmacology focuses on hormone levels themselves rather than their downstream effects on other drugs' metabolism. No comprehensive, well-designed probe-substrate dataset addressing this exact gap could be identified or confirmed.",
            sources: ["https://pmc.ncbi.nlm.nih.gov/articles/PMC12863264/","https://www.cell.com/trends/pharmacological-sciences/abstract/S0165-6147(22)00056-6","https://accpjournals.onlinelibrary.wiley.com/doi/10.1002/phar.70093","https://doi.org/10.1080/17425255.2026.2726547","https://www.sciencedirect.com/science/article/abs/pii/S0165614722000566","https://pubmed.ncbi.nlm.nih.gov/35487786/","https://pubmed.ncbi.nlm.nih.gov/37439842/","https://ascpt.onlinelibrary.wiley.com/doi/10.1111/cts.70396","https://ascpt.onlinelibrary.wiley.com/doi/10.1002/cpt.2234","https://www.tandfonline.com/doi/full/10.1080/17425255.2025.2481891","https://www.biorxiv.org/content/10.1101/2020.01.24.918920.full.pdf","https://www.biorxiv.org/content/10.1101/2024.10.01.616176.full.pdf","https://clinicaltrials.gov/study/NCT06939608","https://www.medrxiv.org/content/10.1101/2021.03.13.21253531.full.pdf","https://pubmed.ncbi.nlm.nih.gov/41452771/","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11975601/","https://doi.org/10.1089/andro.2020.0002","https://clinicaltrials.gov/study/NCT04593680","https://myadlm.org/cln/articles/2020/september/laboratory-monitoring-in-transgender-people","https://pmc.ncbi.nlm.nih.gov/articles/PMC12438667/"]
          }
        }
      ]
    },

    {
      id: "epilepsy-fertility-treatment",
      title:
        "The effect of infertility treatments on seizure control in women with epilepsy is not well understood.",
      area: "Maternal health",
      summary:
        "A systematic review found only four studies, totaling 16 women, examining how assisted reproductive technologies (ART) such as IVF, ovulation induction, and hormonal therapies affect seizure control in women with epilepsy. Seizure control was generally stable, but hormonal therapy and lowered antiseizure medication levels were linked to some seizure exacerbations. The review concludes larger prospective studies are needed to define drug-specific effects.",
      affected_women:
        "Women with epilepsy aged 25-46 undergoing infertility treatment involving IVF, ovulation induction, or hormonal therapy.",
      source:
        "https://doi.org/10.1016/j.yebeh.2026.111210",
      origin: "sourced",
      is_demo: false,
      map_point: { kind: "site", x: 380, y: 270, side: "left",  label_y: 300 },
      data_needs: [
        {
          id: "epilepsy-fertility-treatment-larger-studies",
          problem_id: "epilepsy-fertility-treatment",
          description:
            "Lack of larger prospective studies on how ART and hormonal therapies affect seizure control and antiseizure medication levels in women with epilepsy.",
          why_it_matters:
            "Without this evidence, clinicians cannot reliably predict which hormonal treatments or ASM regimens carry higher seizure risk during fertility treatment, limiting safe, individualized care.",
          status: "missing",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://doi.org/10.1016/j.yebeh.2026.111210",
            note:
              "The review identified only four eligible studies with a total of 16 women, described as case reports, a case series, and one cohort study; the authors state that 'larger prospective studies are needed to better define ASM-specific effects and optimize care.'",
            region: null,
            claimed_date: "2026-07-23"
          },
          dataset_source: null,
          collection_guidance: null,
          verification: {
            checked_at: "2026-09-18",
            method: "web search",
            findings:
              "The single search result is the very systematic review that identified this gap (PubMed 42492305), confirming only four small studies (16 women total) exist and explicitly calling for larger prospective studies. No newer or larger prospective cohort/registry study on ART/hormonal therapy effects on seizure control and ASM levels in women with epilepsy was found.",
            sources: ["https://pubmed.ncbi.nlm.nih.gov/42492305/","https://pubmed.ncbi.nlm.nih.gov/37596834/","https://doi.org/10.1177/15357597241235782","https://pmc.ncbi.nlm.nih.gov/articles/PMC11185206/","https://onlinelibrary.wiley.com/doi/full/10.1111/epi.17862","https://www.sciencedirect.com/science/article/abs/pii/S1059131125002870","https://www.seizure-journal.com/article/S1059-1311(25)00287-0/abstract","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12194816/","https://www.aan.com/msa/Public/Events/AbstractDetails/62192"]
          }
        }
      ]
    },

    {
      id: "urinary-incontinence-decision-aids",
      title:
        "Women with urinary incontinence lack decision support tools covering the full care journey, from deciding to seek care through choosing treatment.",
      area: "Pelvic health",
      summary:
        "A systematic review found only 9 studies of patient decision aids for women with stress, urgency, or mixed urinary incontinence, covering 956 women. All existing decision aids addressed treatment selection in specialty care only, none addressed the initial decision to seek care or primary care settings. Evidence that these aids improve knowledge, communication, or satisfaction was lacking, and studies had high risk of bias due to nonrandomized designs.",
      affected_women:
        "Women with stress, urgency, or mixed urinary incontinence, mean age 48-69 years, in specialty care settings.",
      source:
        "https://doi.org/10.1097/spv.0000000000001880",
      origin: "sourced",
      is_demo: false,
      /* No MAP_POINTS entry for this area yet. Add one in
         app.js, or this problem lists without a pin. */
      data_needs: [
        {
          id: "urinary-incontinence-decision-aids-care-continuum",
          problem_id: "urinary-incontinence-decision-aids",
          description:
            "Rigorously evaluated patient decision aids covering the whole urinary incontinence care continuum, including the decision to seek care and primary care settings.",
          why_it_matters:
            "Without decision aids addressing whether to seek care or supporting decisions in primary care, women may face unaddressed uncertainty earlier in their care journey, and existing tools' benefits for knowledge, communication, and satisfaction remain unproven.",
          status: "partial",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://doi.org/10.1097/spv.0000000000001880",
            note:
              "The review states that all identified PDAs focused on treatment selection in specialty care; none addressed care-seeking decisions or occurred in primary care, and evidence for improved knowledge, patient-clinician communication, or satisfaction was lacking, with high risk of bias due to nonrandomized designs.",
            region: null,
            claimed_date: "2026-09-01"
          },
          dataset_source: {
            note:
              "OUTPACE (Outcomes of Urinary Incontinence Treatment in Primary Care) is a multi-site cluster-randomized trial measuring UI care quality, patient knowledge, and shared decision-making in primary care, and a companion project is building EHR-based clinical decision support tools for PCPs; neither is a validated patient decision aid, and neither addresses the initial 'whether to seek care' decision point.",
            source:
              "https://pubmed.ncbi.nlm.nih.gov/40268237/"
          },
          collection_guidance: null,
          verification: {
            checked_at: "2026-09-18",
            method: "web search",
            findings:
              "A very recent systematic review and meta-analysis (PubMed, searched through Feb 2026) confirms this gap still stands: existing PDAs for women with UI \"focus on reducing uncertainty about treatment selection in specialty care\" and do not address the decision to seek care nor occur in primary care. However, related but non-equivalent efforts are underway: the OUTPACE pragmatic trial (UCSD/UCLA/KU) is testing primary-care UI management strategies and measuring shared decision-making and patient knowledge outcomes, and a separate initiative is developing clinical decision support (CDS) tools embedded in EHRs for PCPs managing UI. Neither of these constitutes a rigorously evaluated patient decision aid spanning the full care-seeking-through-treatment continuum, so the specific gap identified by the source review has not been closed.",
            sources: ["https://clinicaltrials.ucsd.edu/trial/NCT06040645","https://www.auajournals.org/doi/10.1097/JU.0000000000003275.09","https://pubmed.ncbi.nlm.nih.gov/40268237/","https://pubmed.ncbi.nlm.nih.gov/33499824/","https://pubmed.ncbi.nlm.nih.gov/42165445/","https://clinicaltrials.gov/study/NCT05534412","https://clinicaltrials.gov/study/NCT04504084","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3751736/","https://pmc.ncbi.nlm.nih.gov/articles/PMC9328108/"]
          }
        }
      ]
    },

    {
      id: "brucellosis-pregnancy-treatment",
      title:
        "There is no standardized, well-evidenced drug treatment for brucellosis in pregnant women",
      area: "Maternal health",
      summary:
        "A systematic review of therapeutic interventions for brucellosis in pregnant women found only six studies covering 403 women, with highly variable treatment regimens. Sulfamethoxazole-trimethoprim plus rifampicin was the most common combination, but adverse obstetric outcomes such as abortion, preterm birth and low birth weight remained frequent. The authors conclude there is no standardized treatment protocol for this condition in pregnancy.",
      affected_women:
        "Pregnant women diagnosed with brucellosis",
      source:
        "https://doi.org/10.1590/s1678-9946202668032",
      origin: "sourced",
      is_demo: false,
      map_point: { kind: "site", x: 455, y: 262, side: "right", label_y: 230 },
      data_needs: [
        {
          id: "brucellosis-pregnancy-treatment-controlled-trials",
          problem_id: "brucellosis-pregnancy-treatment",
          description:
            "Controlled studies establishing safe and effective treatment protocols for brucellosis during pregnancy",
          why_it_matters:
            "Without controlled evidence, clinicians rely on heterogeneous, inconsistently reported regimens while adverse obstetric outcomes like abortion and preterm birth remain common.",
          status: "missing",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://doi.org/10.1590/s1678-9946202668032",
            note:
              "The review states there is no standardized treatment for brucellosis during pregnancy, that heterogeneity in outcomes and definitions limited comparability across the six included studies, and that controlled studies are needed to establish safe and effective therapeutic protocols.",
            region: null,
            claimed_date: "2026-05-18"
          },
          dataset_source: null,
          collection_guidance: null,
          verification: {
            checked_at: "2026-09-18",
            method: "web search",
            findings:
              "No controlled trials (RCTs or comparative cohort studies) specifically evaluating brucellosis treatment protocols in pregnant women were found. General brucellosis RCTs and meta-analyses of therapeutic regimens exist for the non-pregnant population, but a recent case report explicitly notes 'no randomized trials exist for the treatment of brucellosis in pregnancy'. Search results also returned an unrelated mHealth behavioral intervention RCT for brucellosis patients, which does not address treatment protocols or pregnancy outcomes.",
            sources: ["https://pmc.ncbi.nlm.nih.gov/articles/PMC12646887/","https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2025.1619608/full","https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2025.1619608/pdf","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3290537/","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11340890/","https://acr.amegroups.org/article/view/10072/html","https://pmc.ncbi.nlm.nih.gov/articles/PMC13185525/","https://pubmed.ncbi.nlm.nih.gov/42154841/","https://pmc.ncbi.nlm.nih.gov/articles/PMC2276295"]
          }
        }
      ]
    },

    {
      id: "pelvic-neuropathy-aetiology",
      title:
        "Pelvic neuropathy is an under-recognised and often late-diagnosed cause of chronic pelvic pain in women",
      area: "Chronic pain",
      summary:
        "A narrative review of 306 studies covering 2,413 women found five recurring causes of pelvic neuropathy: iatrogenic injury, nerve invasion or traction by disease such as endometriosis or tumours, pregnancy- and childbirth-related injury, external trauma, and compression by muscular, vascular, benign or malignant structures. Specific syndromes like piriformis, May-Thurner, pelvic congestion and Alcock's canal syndrome were inconsistently defined. Neuropathy was frequently recognised late, and no randomised controlled trials existed on the topic.",
      affected_women:
        "Women with chronic pelvic pain due to nerve injury, including those with endometriosis, obstetric injuries, iatrogenic surgical injury, trauma or compressive structural causes",
      source:
        "https://doi.org/10.52054/fvvo.2026.363",
      origin: "sourced",
      is_demo: false,
      data_needs: [
        {
          id: "pelvic-neuropathy-aetiology-standardised-diagnosis",
          problem_id: "pelvic-neuropathy-aetiology",
          description:
            "Standardised diagnostic criteria and higher-quality evidence (beyond case reports) for defining and identifying specific pelvic neuropathic syndromes in women",
          why_it_matters:
            "Inconsistent definitions and reliance on small case series or case reports mean neuropathy is frequently recognised late, delaying treatment and worsening outcomes for women with pelvic pain.",
          status: "partial",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://doi.org/10.52054/fvvo.2026.363",
            note:
              "The review states that specific neuropathic syndromes were 'inconsistently defined across studies,' that 'diagnostic strategies and reporting quality varied widely,' that the evidence base was 'dominated by case reports and small series,' the overall certainty of evidence is low, and 'no randomised controlled trials were identified.'",
            region: null,
            claimed_date: "2026-09-01"
          },
          dataset_source: {
            note:
              "Retrospective single-center cohort (Sept 2019–Jan 2023) at University Hospital Center of Limoges using DN4 and PPSC scores to estimate neuropathic pain and central sensitization prevalence in endometriosis patients; does not provide standardized diagnostic criteria for distinct pelvic neuropathic syndromes, nor RCT-level evidence, and is limited to one center's population.",
            source:
              "https://www.ejog.org/article/S0301-2115(24)00348-8/fulltext"
          },
          collection_guidance: {
            note:
              "The review calls for 'standardised diagnostic pathways' and greater awareness of nerve-specific injury mechanisms, particularly endometriosis-related and obstetric neuropathies, to improve recognition and outcomes.",
            source:
              "https://doi.org/10.52054/fvvo.2026.363"
          },
          verification: {
            checked_at: "2026-09-18",
            method: "web search",
            findings:
              "A 2024 retrospective single-center cohort study (Limoges, France) applied the validated DN4 questionnaire to endometriosis patients, finding a 44.1% prevalence of neuropathic pain and 39.4% positive central sensitization scores, associating factors like younger age and laparoscopy. This represents a step toward standardized screening tools for neuropathic pain in endometriosis, but it addresses general neuropathic pain prevalence via a validated screening score rather than defining specific pelvic neuropathic syndromes (e.g., pudendal neuralgia, obturator neuropathy) with diagnostic criteria, and remains a single-center retrospective cohort, not the higher-quality multi-site or RCT evidence the original review found lacking.",
            sources: ["https://www.ejog.org/article/S0301-2115(24)00348-8/fulltext","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11727753/","https://pmc.ncbi.nlm.nih.gov/articles/PMC11753943/","https://pubmed.ncbi.nlm.nih.gov/41517280/","https://pubmed.ncbi.nlm.nih.gov/39025040/","https://clinicaltrials.gov/study/NCT02911090","https://pubmed.ncbi.nlm.nih.gov/42088810/","https://www.guidelinecentral.com/guideline/4543736/","https://pmc.ncbi.nlm.nih.gov/articles/PMC11228648/"]
          }
        }
      ]
    },
  ]
};
