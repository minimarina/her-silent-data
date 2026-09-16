/* Seed data — SPEC.md §5 and §9.
 *
 * GENERATED DEMO DATA. Plausible, but not real findings and not sourced.
 * Every record carries is_demo: true and the UI says so on every screen.
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
 * Endometriosis is swapped (WHO + NICE NG73 + WERF EPHect). The other
 * four are still demo. The app renders a half-swapped seed correctly and
 * states per record which it is, so the swap proceeds one problem at a
 * time.
 */

const DATA = {
  problems: [

    {
      id: "menopause-workplace",
      title: "Menopause symptoms go unmeasured in working life",
      area: "Menopause",
      summary:
        "Women in their forties and fifties report symptoms that affect " +
        "concentration, sleep and confidence at work. Symptom severity is " +
        "recorded in clinical settings, if at all, and almost never " +
        "alongside what a working day actually demands.",
      affected_women:
        "Women aged 40–58 in paid employment, including shift and " +
        "frontline workers",
      source: "demo",
      origin: null,
      is_demo: true,
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
          collection_request: {
            data_need_id: "menopause-workplace-symptom-diary",
            target_women:
              "Women aged 40–58 in paid employment, mixed sectors, " +
              "including shift workers and those in physically demanding " +
              "roles. Perimenopausal and postmenopausal both included.",
            method:
              "Daily self-report diary on a phone, with a short baseline " +
              "questionnaire at enrolment",
            form:
              "3-month daily log: 6 symptom sliders plus one multiple-choice " +
              "question on the day's main work task. Under two minutes a day."
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
          collection_request: {
            data_need_id: "menopause-workplace-adjustments",
            target_women:
              "Women aged 40–58 who have disclosed menopause symptoms to an " +
              "employer, and a comparison group who chose not to disclose",
            method: "Structured interview, one sitting",
            form:
              "45-minute semi-structured interview, 12 fixed questions plus " +
              "follow-ups, transcribed and coded"
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
          collection_request: {
            data_need_id: "menopause-workplace-prevalence",
            target_women:
              "Women aged 35–60 in regions with no existing cohort data, " +
              "recruited through primary care and community health workers",
            method:
              "Cross-sectional survey using the age bands already used by " +
              "the existing cohorts, so the results can be pooled",
            form:
              "20-question interviewer-administered survey, one contact, " +
              "available in the local language"
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
          collection_request: null
        }
      ]
    },

    {
      id: "maternal-postnatal-followup",
      title: "Postnatal recovery stops being recorded after six weeks",
      area: "Maternal health",
      summary:
        "Follow-up after birth is commonly built around a single check at " +
        "about six weeks. Problems that appear or persist later — pain, " +
        "incontinence, wound complications — fall outside the window where " +
        "anyone is writing anything down.",
      affected_women:
        "Women in the first two years after giving birth, in any setting " +
        "with routine postnatal care",
      source: "demo",
      origin: null,
      is_demo: true,
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
          collection_request: {
            data_need_id: "maternal-postnatal-symptoms-12m",
            target_women:
              "Women 6 and 12 months after a first or subsequent birth, " +
              "covering vaginal and caesarean births, recruited at discharge",
            method:
              "Two follow-up questionnaires sent by SMS, with a phone option " +
              "for anyone who prefers it",
            form:
              "Two contacts, 15 questions each, covering pain, continence, " +
              "wound healing, sexual health and sleep"
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
            target_women:
              "Women in the first year after birth, stratified by household " +
              "composition and whether other children or dependent adults " +
              "are at home",
            method: "Time-use diary, already a standard instrument",
            form:
              "Two 24-hour diaries, one weekday and one weekend day, " +
              "repeated at 3 and 9 months"
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
          collection_request: {
            data_need_id: "maternal-postnatal-mental-health",
            target_women:
              "Women 4–18 months after birth, including those who screened " +
              "negative at six weeks",
            method:
              "Repeat of the same validated screening instrument used at " +
              "six weeks, so scores are directly comparable",
            form:
              "Three contacts at 6, 12 and 18 months, 10 questions each, " +
              "self-completed online or on paper"
          }
        }
      ]
    },

    {
      id: "autoimmune-diagnosis-delay",
      title: "Years pass between first autoimmune symptom and diagnosis",
      area: "Autoimmune disease",
      summary:
        "Most autoimmune conditions are far more common in women, and the " +
        "path to diagnosis often runs through several specialties. What " +
        "gets recorded is the diagnosis. What happened in the years before " +
        "it — the visits, the tests, the other explanations offered — " +
        "usually does not.",
      affected_women:
        "Women of any age presenting with fatigue, joint pain or " +
        "neurological symptoms that are not yet explained",
      source: "demo",
      origin: null,
      is_demo: true,
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
          collection_request: {
            data_need_id: "autoimmune-pathway",
            target_women:
              "Women diagnosed with an autoimmune condition in the last two " +
              "years, across at least three conditions, recruited through " +
              "specialist clinics and patient organisations",
            method:
              "Retrospective timeline interview, supported by the woman's own " +
              "records where she consents to share them",
            form:
              "One 60-minute interview producing a dated event timeline, " +
              "plus optional records release"
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
          collection_request: {
            data_need_id: "autoimmune-alternative-explanations",
            target_women:
              "The same diagnosed cohort, with a comparison group of men " +
              "diagnosed with the same conditions",
            method:
              "Open-ended question inside the timeline interview, coded " +
              "against a fixed category list",
            form:
              "One question with unlimited free text, coded by two " +
              "independent raters"
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
          collection_request: {
            data_need_id: "autoimmune-sex-disaggregated-trials",
            target_women:
              "No new participants needed — the request goes to trial " +
              "sponsors for re-analysis of women already enrolled",
            method:
              "Structured data request to sponsors and re-analysis of " +
              "existing trial datasets",
            form:
              "Standard reporting template: outcome and adverse events by " +
              "sex, with age band and menopausal status where recorded"
          }
        }
      ]
    },

    {
      id: "cardiac-symptom-recognition",
      title: "Heart attack symptoms in women are described from male baselines",
      area: "Cardiovascular health",
      summary:
        "Presentation guidance is built on symptom patterns most studied in " +
        "men. Women more often report symptoms that fall outside that " +
        "picture, and those presentations are not systematically recorded " +
        "in a way that could update the guidance.",
      affected_women:
        "Women of all ages presenting with chest, jaw, back or abdominal " +
        "symptoms, and women under 55 in particular",
      source: "demo",
      origin: null,
      is_demo: true,
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
          collection_request: {
            data_need_id: "cardiac-presenting-symptoms",
            target_women:
              "Women arriving at emergency departments with any symptom " +
              "later confirmed as cardiac, across the full adult age range " +
              "and including women under 55",
            method:
              "Verbatim capture of the first description at triage, added to " +
              "the existing intake form",
            form:
              "One free-text field at triage, plus a 5-item structured " +
              "checklist, completed at the point of arrival"
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
            "treatment, and most national cardiac audits publish this " +
            "broken down by sex.",
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
          collection_request: {
            data_need_id: "cardiac-pre-hospital-decision",
            target_women:
              "Women admitted with a confirmed cardiac event, interviewed " +
              "before discharge, with caregiving responsibilities recorded",
            method: "Short bedside interview before discharge",
            form:
              "15-minute interview, 8 fixed questions on timing plus two " +
              "open questions on what prompted the decision to seek help"
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
              "endometriosis, including those not yet under specialist care",
            method: "Daily pain diary on a phone, anchored to cycle day",
            form:
              "Enrolment: the WERF EPHect patient questionnaire (EPQ), so " +
              "the cohort is described in the terms other endometriosis " +
              "studies already use. Then a 6-month daily log — one pain " +
              "score, one interference score and cycle day, under 30 " +
              "seconds a day.",
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
              "included",
            method: "Population survey with monthly recall",
            form:
              "12-month study, one 10-question contact per month, online " +
              "with a phone alternative",
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
              "surgical or pain management — stratified by age, prior " +
              "treatments and whether they are trying to conceive",
            method:
              "Prospective follow-up using the same pain diary, starting " +
              "before treatment begins",
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
