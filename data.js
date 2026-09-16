/* Seed data — SPEC.md §5 and §9.
 *
 * SOURCED DATA. Every problem cites a published source, and every
 * missing or partial data need cites the authority that named the gap.
 * No record is a placeholder any more: is_demo is false throughout and
 * the demo banner no longer renders.
 *
 * What is NOT sourced, and is labelled as such on screen: the collection
 * requests. Which women, which variables, which breakdowns and in what
 * form is this platform's own specification in every record. That is the
 * product; the citations are its foundation.
 *
 * Loaded by a <script> tag, not fetch(), so the app opens from file://
 * with no server (SPEC §13). Contents stay JSON-shaped and hand-editable:
 * the only JavaScript here is the assignment on the first line.
 *
 * Data needs are nested inside their problem instead of being a flat list
 * keyed by problem_id. Same fields as §5, less to keep in sync by hand.
 *
 * Two-tier origin (SPEC §5a). A problem is either:
 *   origin: "sourced"  — an authority has already published the request
 *                        that this data is missing, and gap_evidence on
 *                        each data need cites it.
 *   origin: "proposed" — the problem is documented, but nobody has said
 *                        which data would close it. The data needs are
 *                        this platform's hypothesis, labelled as one.
 *   origin: null       — not yet assessed. While is_demo is true the
 *                        record is a placeholder and origin says nothing.
 *
 * origin and is_demo are different claims and both stay. is_demo means
 * "placeholder content"; origin means "who identified the gap".
 *
 * Sources, by problem:
 *   Menopause      WHO menopause fact sheet; HEAF study; NICE NG23
 *   Maternal       WHO 2022 postnatal guideline; NICE NG194
 *   Autoimmune     J Rheumatology; Cureus narrative review 2025
 *   Cardiac        Lancet women and CVD Commission 2021; NICOR MINAP
 *   Endometriosis  WHO fact sheet; NICE NG73; WERF EPHect
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
    }

  ]
};
