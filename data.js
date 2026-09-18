/* Seed data — SPEC.md §5 and §9.
 *
 * Every record in this file has the same shape, and there is exactly one
 * way a record gets here: intake/run.mjs produced it, a person admitted
 * it, and it was merged. No hand-written records remain.
 *
 * Every data need therefore carries:
 *   gap_evidence.claimed_date  when the gap was named
 *   verification               when the platform last searched for data
 *                              collected since, and what it found
 *   collection_guidance        sourced, or null. Null is the normal case.
 *
 * THE RULE, from SPEC §5a: nothing is invented and stored. A record
 * carries what its source said and nothing more. A study design is
 * generated on request, kept in research-designs.js, and never enters
 * this file. intake/validate.mjs enforces this rather than trusting it.
 *
 * Loaded by a <script> tag, not fetch(), so the app opens from file://
 * with no server (SPEC §13). Contents stay JSON-shaped and hand-editable:
 * the only JavaScript here is the assignment on the first line.
 *
 * Data needs are nested inside their problem instead of being a flat list
 * keyed by problem_id. Same fields as §5, less to keep in sync by hand.
 *
 * REMOVED 18 Sep: five hand-sourced problems carrying 17 data needs.
 * They predated the "nothing invented and stored" rule and carried
 * collection_request blocks — this platform's own specification of which
 * women and which variables. They could not be brought into the shape
 * above: claimed_date cannot be invented, and their sources predate the
 * search window. Rather than show a reader two generations of record,
 * they were removed. They are in the git history.
 *
 * Two-tier origin (SPEC §5a). A problem is either:
 *   origin: "sourced"  — an authority has published the claim that this
 *                        data is missing, and gap_evidence cites it.
 *   origin: "proposed" — the problem is documented, but nobody has said
 *                        which data would close it.
 *   origin: null       — not yet assessed.
 *
 * origin and is_demo are different claims and both stay. is_demo means
 * "placeholder content"; origin means "who identified the gap". Every
 * record here is origin "sourced" and is_demo false.
 *
 * Sources are cited on each record and listed in SPEC §9.
 */

const DATA = {
  problems: [

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
