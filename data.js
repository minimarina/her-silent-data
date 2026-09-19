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
          status: "partial",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://doi.org/10.1080/17425255.2026.2726547",
            note:
              "The abstract states that 'the effects of testosterone and other androgens on drug metabolism and transport remain understudied in people assigned female at birth' and calls for well-designed probe-substrate studies and use of prescribed medications as clinical probes of relevant enzymes and transporters.",
            region: null,
            claimed_date: "2026-09-02"
          },
          dataset_source: {
            note:
              "Prospective pharmacokinetic study measuring CYP3A and P-glycoprotein activity (via midazolam and digoxin probes) in transgender adults receiving gender-affirming testosterone therapy; does not cover other CYP/UGT enzymes, other transporters, cisgender women, or endogenous androgen-rich conditions like PCOS.",
            source:
              "https://accpjournals.onlinelibrary.wiley.com/doi/10.1002/phar.70093"
          },
          collection_guidance: {
            note:
              "Investigators should use well-designed probe-substrate studies when feasible, and use prescribed medications as clinical probes of relevant drug-metabolizing enzymes and transporters, in cisgender women and transgender people.",
            source:
              "https://doi.org/10.1080/17425255.2026.2726547"
          },
          /* Re-verified 18 Sep. The first check on this record was written
             from a search that never ran — the model reported its tools
             unavailable and answered from prior knowledge, and the status
             "missing" rested on it. The second check completed, and found
             the gap partly filled. search_outcome records that it ran. */
          verification: {
            checked_at: "2026-09-18",
            method: "web search",
            search_outcome: "reviewed",
            findings:
              "A new clinical pharmacokinetic study has since been published: Hunter et al. (Pharmacotherapy, 2026) directly measured CYP3A and P-glycoprotein activity in transgender adults on gender-affirming testosterone therapy using midazolam and digoxin probe substrates, finding no significant effect on these pathways. However, this covers only two specific enzyme/transporter systems in transgender adults on testosterone therapy, not the broader range of CYP/UGT enzymes and transporters, and does not address cisgender women or other androgen-rich conditions (e.g., PCOS) as noted in a related 2022 review calling for more transgender-focused pharmacokinetic data. The gap for androgen-rich endogenous conditions and other drug-metabolizing pathways remains largely unaddressed.",
            sources: ["https://pmc.ncbi.nlm.nih.gov/articles/PMC12863264/","https://www.cell.com/trends/pharmacological-sciences/abstract/S0165-6147(22)00056-6","https://doi.org/10.1080/17425255.2026.2726547","https://accpjournals.onlinelibrary.wiley.com/doi/10.1002/phar.70093","https://pubmed.ncbi.nlm.nih.gov/41452771/","https://pmc.ncbi.nlm.nih.gov/articles/PMC9913858/","https://ascpt.onlinelibrary.wiley.com/doi/10.1111/cts.70396","https://www.sciencedirect.com/science/article/abs/pii/S0165614722000566","https://pubmed.ncbi.nlm.nih.gov/35487786/"]
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

    {
      id: "advanced-therapies-pregnancy",
      title:
        "Pregnant women with immune-mediated inflammatory diseases lack reliable safety data on advanced (non-anti-TNF) therapies",
      area: "Pharmacology",
      summary:
        "A systematic review and meta-analysis assessed pregnancy and neonatal outcomes in women with immune-mediated inflammatory diseases treated with advanced therapies other than anti-TNF drugs. Most available data concerned ustekinumab and vedolizumab, while data on other biologics and JAK inhibitors were very limited. The overall certainty of evidence was very low, relying mainly on small observational studies and case reports.",
      affected_women:
        "Pregnant women with immune-mediated inflammatory diseases treated with advanced therapies such as ustekinumab, vedolizumab, other biologics, or JAK inhibitors",
      source:
        "https://doi.org/10.1093/ecco-jcc/jjag045",
      origin: "sourced",
      is_demo: false,
      data_needs: [
        {
          id: "advanced-therapies-pregnancy-highquality-data",
          problem_id: "advanced-therapies-pregnancy",
          description:
            "Large, high-quality studies on pregnancy and neonatal outcomes for women exposed to advanced therapies (beyond ustekinumab and vedolizumab) for immune-mediated inflammatory diseases",
          why_it_matters:
            "Without robust data, clinicians and patients cannot confidently assess the safety of these drugs during pregnancy, leaving treatment decisions based on very low certainty evidence from case reports and small cohorts.",
          status: "partial",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://doi.org/10.1093/ecco-jcc/jjag045",
            note:
              "The review found that 'data on other biologics and JAK inhibitors were very limited' and that most evidence came from case series and case reports with 'critical risk of bias,' resulting in an overall 'very low' level of evidence; the authors conclude that 'larger, high-quality studies are needed.'",
            region: null,
            claimed_date: "2026-05-01"
          },
          dataset_source: {
            note:
              "A global multicenter cohort study on JAK inhibitor (tofacitinib, upadacitinib, filgotinib) exposure during pregnancy in IBD, and a large US health-system retrospective cohort on IMID maternal-fetal outcomes; these improve on prior case-report-level evidence but do not yet cover most other advanced biologics (e.g., risankizumab, guselkumab, other JAK inhibitors) with comparably large, high-quality cohorts.",
            source:
              "https://academic.oup.com/ecco-jcc/article/20/Supplement_1/jjaf231.078/8432705"
          },
          collection_guidance: null,
          verification: {
            checked_at: "2026-09-18",
            method: "web search",
            findings:
              "Since the review, newer studies have emerged but they remain limited compared to the ustekinumab/vedolizumab evidence base. A 2025 global multicenter cohort study of JAK inhibitor exposure in IBD pregnancies (55 patients on tofacitinib/upadacitinib/filgotinib) provides more systematic data, and a 2024 large US retrospective cohort (eClinicalMedicine) examined maternal-fetal outcomes across IMID patients on various immunomodulators. However, other advanced therapies like risankizumab and other JAK inhibitors are still mostly represented by small case series (e.g., a 3-patient case series, small case series of risankizumab), so robust, high-quality data for the full range of newer biologics/JAK inhibitors beyond ustekinumab and vedolizumab remains sparse and inconsistent across drugs.",
            sources: ["https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12900871/","https://academic.oup.com/ecco-jcc/article/20/Supplement_1/jjaf231.078/8432705","https://www.medrxiv.org/content/10.64898/2026.01.21.26344506.full.pdf","https://pubmed.ncbi.nlm.nih.gov/38586478/","https://pubmed.ncbi.nlm.nih.gov/39141986/","https://www.jrheum.org/content/52/Suppl_2/51.1","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11807636/","https://pubmed.ncbi.nlm.nih.gov/42103443/","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10872036/","https://link.springer.com/article/10.1007/s00404-022-06463-x"]
          }
        }
      ]
    },

    {
      id: "tre-reproductive-hormones",
      title:
        "Uncertain effects of time-restricted eating on reproductive hormones and androgens in women",
      area: "Reproductive health",
      summary:
        "A systematic review found that time-restricted eating (TRE) does not significantly affect testosterone, oestrogen, progesterone, luteinising hormone, cortisol, DHEA or SHBG in women with general obesity, based on randomised controlled trials. Non-randomised studies in women with PCOS suggested beneficial hormonal changes, but these may be confounded by weight loss. Only six studies met inclusion criteria, and evidence is described as inconclusive.",
      affected_women:
        "Adult women with general obesity and adult women with polycystic ovary syndrome (PCOS)",
      source:
        "https://doi.org/10.1177/02601060261467643",
      origin: "sourced",
      is_demo: false,
      data_needs: [
        {
          id: "tre-reproductive-hormones-rct-pcos",
          problem_id: "tre-reproductive-hormones",
          description:
            "Rigorous, long-term randomised controlled trials on TRE's hormonal effects in women, especially those with PCOS",
          why_it_matters:
            "Without such trials, it remains unclear whether TRE can be safely or effectively recommended as a therapeutic strategy for hormonal conditions like PCOS, beyond its weight-loss effects.",
          status: "partial",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://doi.org/10.1177/02601060261467643",
            note:
              "The review concludes that 'the current evidence on TRE's impact on female hormones is inconclusive and varies significantly by population and study design' and states 'more rigorous, long-term RCTs are needed to establish its therapeutic role, in particular for conditions like PCOS.'",
            region: null,
            claimed_date: "2026-07-10"
          },
          dataset_source: {
            note:
              "RCTs and a meta-analysis of RCTs on TRE in women with PCOS/PMOS, covering weight, metabolic (HOMA-IR), and some reproductive/hormonal outcomes over ~6-month trial durations; does not cover multi-year long-term hormonal safety/efficacy or broader female populations without PCOS.",
            source:
              "https://www.nature.com/articles/s41591-026-04316-7"
          },
          collection_guidance: {
            note:
              "The authors call for more rigorous, long-term randomised controlled trials to establish TRE's therapeutic role for female reproductive hormones, particularly in women with PCOS.",
            source:
              "https://doi.org/10.1177/02601060261467643"
          },
          verification: {
            checked_at: "2026-09-18",
            method: "web search",
            findings:
              "Since the review, several RCTs specifically in women with PCOS have appeared. A 2026 Nature Medicine RCT compared TRE vs. calorie restriction vs. no-intervention control in PCOS for body-weight and metabolic outcomes, a PLOS One/PMC protocol describes a 6-month RCT (96 overweight/obese PCOS women) assessing reproductive recovery and hormonal effects, and a 2026 systematic review/meta-analysis pooled four RCTs (216 women with polycystic/polyendocrine metabolic ovarian syndrome) finding TRE improved HOMA-IR versus calorie restriction or ad libitum eating. These studies fill much of the gap but are still only ~6 months in duration (not truly 'long-term' by chronic-disease standards) and sample sizes remain modest, so long-term (multi-year) hormonal outcome data in PCOS are still lacking.",
            sources: ["https://pmc.ncbi.nlm.nih.gov/articles/PMC11717230/","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11717230/","https://pubmed.ncbi.nlm.nih.gov/42451100/","https://www.news-medical.net/news/20260330/Time-restricted-eating-improves-hormone-levels-in-women-with-PCOS.aspx","https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0316333","https://www.nature.com/articles/s41591-026-04316-7","https://clinicaltrials.gov/study/NCT05629858","https://pubmed.ncbi.nlm.nih.gov/41896647/","https://news.feinberg.northwestern.edu/2026/05/12/time-restricted-eating-supports-weight-loss-in-women-with-pcos/"]
          }
        }
      ]
    },

    {
      id: "type-2b-vwd-pregnancy",
      title:
        "Women with type 2B von Willebrand disease face high bleeding risk and unclear management during pregnancy and postpartum",
      area: "Maternal health",
      summary:
        "Type 2B von Willebrand disease is a rare qualitative variant affecting platelet-VWF interaction, causing enhanced clearance of VWF multimers and platelets. During pregnancy and postpartum, women with this condition face complex hemostatic abnormalities and high bleeding risk, with no evidence-based guidelines to manage them until this consensus effort.",
      affected_women:
        "Women with type 2B von Willebrand disease during pregnancy and the postpartum period",
      source:
        "https://doi.org/10.1016/j.jtha.2026.05.032",
      origin: "sourced",
      is_demo: false,
      data_needs: [
        {
          id: "type-2b-vwd-pregnancy-clinical-evidence",
          problem_id: "type-2b-vwd-pregnancy",
          description:
            "Evidence-based data on early diagnosis, prenatal counseling, pregnancy monitoring, and peripartum management for type 2B VWD",
          why_it_matters:
            "Without this evidence, clinicians rely on expert consensus rather than data, which can leave gaps in standardized, optimal care and increase risk of bleeding complications for mother and infant.",
          status: "missing",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://doi.org/10.1016/j.jtha.2026.05.032",
            note:
              "The abstract states a systematic review, international registry analysis, and global physician survey 'highlighted several unmet clinical needs in this population, including gaps in early diagnosis, prenatal counseling, pregnancy monitoring, and peripartum management,' and that there is 'a lack of evidence-based guidelines' for this condition in pregnancy and postpartum.",
            region: null,
            claimed_date: "2026-06-04"
          },
          dataset_source: null,
          collection_guidance: null,
          verification: {
            checked_at: "2026-09-18",
            method: "web search",
            findings:
              "A search attempt did not return results confirming that a dedicated evidence-based dataset (cohort, registry, or trial) specifically on early diagnosis, prenatal counseling, pregnancy monitoring, and peripartum management for type 2B von Willebrand disease has been established since the cited review. No such registry-based or cohort study output could be identified. The gap identified by the systematic review, international registry analysis, and physician survey appears to remain unaddressed by a subsequent dedicated evidence-based study.",
            sources: ["https://onlinelibrary.wiley.com/doi/full/10.1111/hae.14953","https://www.researchgate.net/publication/322780262_How_I_treat_type_2B_von_Willebrand_disease","https://www.sciencedirect.com/science/article/pii/S1538783622071896","https://pubmed.ncbi.nlm.nih.gov/42248413/","https://www.sciencedirect.com/science/article/pii/S1538783626003569","https://pubmed.ncbi.nlm.nih.gov/36695378/","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12858306/","https://pmc.ncbi.nlm.nih.gov/articles/PMC12974098/","https://pubmed.ncbi.nlm.nih.gov/25431025/"]
          }
        }
      ]
    },

    {
      id: "anterior-prolapse-surgery",
      title:
        "Women with anterior compartment prolapse face uncertain comparative outcomes across different surgical repair techniques",
      area: "Pelvic health",
      summary:
        "Anterior compartment prolapse is the most common type of pelvic organ prolapse and is treated with various surgical techniques. A Cochrane review of 41 randomised trials in 4531 women found that native tissue repair is more likely to result in recurrence and repeat surgery compared with biological graft or permanent mesh, while permanent mesh carries other risks. Many transvaginal permanent meshes tested have since been removed from the market due to complications.",
      affected_women:
        "Women undergoing surgery for anterior compartment (anterior vaginal wall) prolapse",
      source:
        "https://doi.org/10.1002/14651858.cd004014.pub7",
      origin: "sourced",
      is_demo: false,
      data_needs: [
        {
          id: "anterior-prolapse-surgery-suistress",
          problem_id: "anterior-prolapse-surgery",
          description:
            "Data on outcomes of surgery for stress urinary incontinence following anterior native tissue repair versus biological graft repair",
          why_it_matters:
            "Without this data, clinicians and women cannot weigh the risk of needing incontinence surgery when choosing between these two prolapse repair techniques.",
          status: "missing",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://doi.org/10.1002/14651858.cd004014.pub7",
            note:
              "The abstract states plainly under the native tissue vs biological graft comparison that 'Surgery for stress urinary incontinence was not reported,' and the authors' conclusions reiterate 'We found no data for surgery for stress urinary incontinence.'",
            region: null,
            claimed_date: "2026-04-24"
          },
          dataset_source: null,
          collection_guidance: null,
          verification: {
            checked_at: "2026-09-18",
            method: "web search",
            findings:
              "The most recent (2026) update of the Cochrane review on surgery for anterior compartment prolapse still explicitly states 'We found no data for surgery for stress urinary incontinence' when comparing native tissue repair versus biological graft repair. A search of related trials (e.g., mesh vs native tissue RCTs, retrospective studies) found data on prolapse recurrence, mesh exposure, and subjective outcomes like PGI-I, but none specifically reporting surgery for stress urinary incontinence as an outcome for the native tissue vs biological graft comparison.",
            sources: ["https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD004014.pub7/full","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10287778/","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8580999/","https://pmc.ncbi.nlm.nih.gov/articles/PMC13314773/","https://www.cochrane.org/zh-hant/evidence/CD004014_surgical-management-pelvic-organ-prolapse-women","https://pmc.ncbi.nlm.nih.gov/articles/PMC6464975","https://www.cochrane.org/evidence/CD004014_surgical-management-pelvic-organ-prolapse-women","https://pmc.ncbi.nlm.nih.gov/articles/PMC6489145","https://eprints.ncl.ac.uk/297526"]
          }
        }
      ]
    },

    {
      id: "remifentanil-pca-labour",
      title:
        "Lack of standardised evidence on safe use of remifentanil patient-controlled analgesia for labour pain, especially when neuraxial analgesia is not possible",
      area: "Maternal health",
      summary:
        "Remifentanil PCA is used for labour analgesia when neuraxial techniques are contraindicated or declined, but its use varies widely between maternity units due to safety and staffing concerns. An expert working group reviewed the literature and used a modified Delphi process to develop recommendations, most of which had only low or moderate certainty due to limited evidence. The guidance highlights that data on higher-risk maternal and foetal groups is lacking.",
      affected_women:
        "Women in labour who are unable to receive or decline neuraxial analgesia, including higher-risk maternal and foetal groups",
      source:
        "https://doi.org/10.1097/eja.0000000000002373",
      origin: "sourced",
      is_demo: false,
      data_needs: [
        {
          id: "remifentanil-pca-labour-highrisk-groups",
          problem_id: "remifentanil-pca-labour",
          description:
            "Evidence on the safety and effectiveness of remifentanil PCA use in higher-risk maternal and foetal groups during labour",
          why_it_matters:
            "Without this evidence, clinicians cannot make well-supported decisions for higher-risk women, and guidance for these groups remains based on low-certainty statements rather than robust data.",
          status: "missing",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://doi.org/10.1097/eja.0000000000002373",
            note:
              "The abstract states recommendations were 'generally assigned a low or moderate level of certainty' and concludes 'there is a lack of data for remifentanil PCA use in higher-risk maternal and foetal groups; this is an area of research priority.'",
            region: "United Kingdom",
            claimed_date: "2026-05-06"
          },
          dataset_source: null,
          collection_guidance: null,
          verification: {
            checked_at: "2026-09-18",
            method: "web search",
            findings:
              "This search found the exact OAA guidance article that made the original 'lack of data' statement (PubMed, indexed with a 2026 date but reflecting the same publication), confirming the gap still stands as of the guidance's own conclusions. Other retrieved studies (RESPITE RCT, dose-finding trials, a small maternal/neonatal side-effect study, and an ongoing remote-monitoring trial NCT07167498) address remifentanil PCA safety/efficacy generally or in specific dosing questions, but none focus on higher-risk maternal or fetal subgroups (e.g. obesity, preterm, multiple pregnancy, cardiac/respiratory comorbidity). No UK cohort, registry, or trial specifically targeting higher-risk groups for remifentanil PCA was found.",
            sources: ["https://clinicaltrials.gov/study/NCT07167498","https://pmc.ncbi.nlm.nih.gov/articles/PMC10378612/","https://pubmed.ncbi.nlm.nih.gov/42080744/","https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(18)31613-1/fulltext","https://pubmed.ncbi.nlm.nih.gov/16113038/","https://www.dovepress.com/remifentanil-at-a-relatively-elevated-dose-in-active-phase-is-safe-and-peer-reviewed-fulltext-article-JPR","https://www.mdpi.com/1648-9144/61/9/1550","http://www.actaanaesthesiologica.be/assets/437/ActaAnaesthBelg-76-279.pdf","https://www.ncbi.nlm.nih.gov/books/NBK596254/"]
          }
        }
      ]
    },
    {
      id: "cvd-sex-hormones-mortality",
      title:
        "Uncertainty about whether endogenous sex hormones predict mortality in people with established cardiovascular disease",
      area: "Cardiovascular health",
      summary:
        "A systematic review and meta-analysis of 12 prospective studies (5,981 patients with established cardiovascular disease) examined links between endogenous sex steroid hormones, SHBG, and mortality. No significant association was found between total testosterone and all-cause or cardiovascular mortality in men, and most studies had high risk of bias. The review found no evidence for an association overall and noted a lack of sufficient evidence, especially concerning women.",
      affected_women:
        "Women with established cardiovascular disease, who were underrepresented in the studies analyzed",
      source:
        "https://doi.org/10.3389/fendo.2026.1878347",
      origin: "sourced",
      is_demo: false,
      data_needs: [
        {
          id: "cvd-sex-hormones-mortality-women-data",
          problem_id: "cvd-sex-hormones-mortality",
          description:
            "Prospective studies on endogenous sex hormones, SHBG, and mortality risk specifically in women with established cardiovascular disease",
          why_it_matters:
            "Without sufficient evidence in women, clinicians and researchers cannot determine whether hormone levels have prognostic value for mortality in women with cardiovascular disease, potentially leading to care guidelines based only on male data.",
          status: "missing",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://doi.org/10.3389/fendo.2026.1878347",
            note:
              "The review concludes 'This study underscored the lack of sufficient evidence on this topic, especially concerning women,' indicating that existing prospective studies have not adequately examined this population.",
            region: null,
            claimed_date: "2026-07-27"
          },
          dataset_source: null,
          collection_guidance: null,
          verification: {
            checked_at: "2026-09-19",
            method: "web search",
            findings:
              "A 2026 systematic review and meta-analysis (Frontiers in Endocrinology / PMC13454103) pooling prospective studies on endogenous sex hormones, SHBG, and mortality in patients with established cardiovascular disease found sufficient data only to analyze men (testosterone and mortality), explicitly noting insufficient evidence in women with established CVD. Related work exists on sex hormones and cardiovascular disease in postmenopausal women generally (e.g., Ann Transl Med review, PMC11765893 Swedish stroke-risk cohort, PubMed 29852978 on incident CVD), but these study hormones as predictors of incident CVD or stroke risk in generally healthy postmenopausal women, not mortality risk in women who already have established cardiovascular disease. No prospective study or registry was found that specifically examines endogenous sex hormones/SHBG and mortality outcomes in women with pre-existing CVD.",
            sources: ["https://pmc.ncbi.nlm.nih.gov/articles/PMC13454103/","https://www.frontiersin.org/journals/endocrinology/articles/10.3389/fendo.2026.1878347/full","https://atm.amegroups.org/article/view/22436/html","https://pubmed.ncbi.nlm.nih.gov/42577268/","https://www.frontiersin.org/journals/endocrinology/articles/10.3389/fendo.2026.1878347/xml","https://pubmed.ncbi.nlm.nih.gov/25550203/","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11765893/","https://pmc.ncbi.nlm.nih.gov/articles/PMC13227368/","https://pubmed.ncbi.nlm.nih.gov/29852978/"]
          }
        }
      ]
    },
    {
      id: "fertility-interventions-30-42",
      title:
        "Women aged 30-42 with infertility lack clear evidence on which interventions actually improve live birth and are safe",
      area: "Reproductive health",
      summary:
        "Female infertility affects about one in six couples worldwide and disproportionately impacts women aged 30-42. A systematic review found many interventions—hormonal therapies, ART strategies, surgery, lifestyle and psychosocial programs—improved pregnancy-related outcomes, but evidence for live birth and safety was limited by small samples, heterogeneity, and indirectness.",
      affected_women:
        "Women aged 30-42 years experiencing infertility, across multiple etiologies",
      source:
        "https://doi.org/10.3389/fendo.2026.1741198",
      origin: "sourced",
      is_demo: false,
      data_needs: [
        {
          id: "fertility-interventions-30-42-safety-reporting",
          problem_id: "fertility-interventions-30-42",
          description:
            "Consistent reporting of live birth outcomes and maternal-neonatal safety data (e.g., ovarian hyperstimulation syndrome, multiple gestation, neonatal outcomes) across fertility intervention studies",
          why_it_matters:
            "Without standardized live birth and safety reporting, clinicians and patients cannot judge which interventions are truly effective and safe, undermining informed, shared decision-making.",
          status: "partial",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://doi.org/10.3389/fendo.2026.1741198",
            note:
              "The review states that 'Safety reporting was limited; few studies reported ovarian hyperstimulation syndrome, multiple gestation, or neonatal outcomes, and patient-reported outcomes were seldom assessed.' This shows a systematic absence of safety and patient-centered data in the existing evidence base.",
            region: null,
            claimed_date: "2026-06-09"
          },
          dataset_source: {
            note:
              "Tracks uptake of the Core Outcome Set (including pregnancy/live birth and neonatal domains) in IVF RCTs 2004-2024, but shows reporting compliance remains very low (<15%) for most outcomes including safety measures; does not itself constitute the missing safety/live-birth dataset, only documents the persistence of the gap.",
            source:
              "https://pmc.ncbi.nlm.nih.gov/articles/PMC11700894/"
          },
          collection_guidance: {
            note:
              "Future trials must center on live birth, adopt standardized core outcomes, and consistently report maternal-neonatal safety.",
            source:
              "https://doi.org/10.3389/fendo.2026.1741198"
          },
          verification: {
            checked_at: "2026-09-19",
            method: "web search",
            findings:
              "A 2024/2025 study (PMC11700894) assessed uptake of the infertility Core Outcome Set (COS) across IVF RCTs from 2004-2024, finding that reporting of core outcomes like pregnancy and neonatal domains remains low (13.6% and 5.7% respectively), with most other core outcomes (including safety-related ones) reported in under 7% of trials, though showing a slowly rising trend over time. This confirms that a standardized outcome framework (the COS) exists and is being tracked, but actual consistent reporting of live birth, OHSS, multiple gestation, and neonatal safety data across fertility studies is still largely absent in practice. This is not a new dataset providing the missing safety data itself, but rather ongoing monitoring showing the gap persists.",
            sources: ["https://pmc.ncbi.nlm.nih.gov/articles/PMC11700894/","https://doi.org/10.1093/humrep/deaa241","https://pmc.ncbi.nlm.nih.gov/articles/PMC7744160/","https://academic.oup.com/humrep/article/40/1/85/7915049","https://www.frontiersin.org/journals/endocrinology/articles/10.3389/fendo.2026.1741198/xml","https://www.ncbi.nlm.nih.gov/pubmed/33252685","https://pubmed.ncbi.nlm.nih.gov/39673431/","https://academic.oup.com/humrep/article/35/12/2735/6010637","https://www.comet-initiative.org/studies/details/1023"]
          }
        }
      ]
    },
    {
      id: "urinary-retention-older-women",
      title:
        "Urinary retention in older women is underdiagnosed and poorly managed due to complex, multifactorial causes",
      area: "Pelvic health",
      summary:
        "Urinary retention in older women results from age-related bladder changes, comorbidities like neurologic disease, diabetic bladder dysfunction, and pelvic organ prolapse, and is often caused by common medications such as anticholinergics and antidepressants. Symptoms are often non-specific in women, complicating diagnosis and management. Treatment options remain poorly studied in this population.",
      affected_women:
        "Older women, particularly those with comorbidities such as neurologic disease, diabetic bladder dysfunction, or pelvic organ prolapse",
      source:
        "https://doi.org/10.1007/s40266-026-01323-8",
      origin: "sourced",
      is_demo: false,
      data_needs: [
        {
          id: "urinary-retention-older-women-trial-data",
          problem_id: "urinary-retention-older-women",
          description:
            "Lack of sex-specific and age-specific clinical trial data on pharmacologic and other therapeutic options for urinary retention in older women",
          why_it_matters:
            "Without dedicated trials in older women, clinicians must extrapolate from data not representative of this population, risking suboptimal or unsafe treatment decisions",
          status: "partial",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://doi.org/10.1007/s40266-026-01323-8",
            note:
              "The abstract states that 'broader therapeutic options remain poorly studied in older female populations' and concludes by highlighting 'the critical need for sex-specific and age-specific trials to guide evidence-based patient-centered management of urinary retention in older women.'",
            region: null,
            claimed_date: "2026-08-31"
          },
          dataset_source: {
            note:
              "A 2025 retrospective single-institution case series (n=9, median age 79) evaluating colpocleisis for POP-associated urinary retention in elderly women. It covers only one surgical intervention, is small and retrospective, and does not address pharmacologic or other non-surgical therapeutic options, nor does it constitute the sex-specific/age-specific clinical trial data called for; the broader gap for pharmacologic/therapeutic trials in urinary retention (distinct from incontinence) in older women remains largely unaddressed.",
            source:
              "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12776221/"
          },
          collection_guidance: {
            note:
              "The review calls for sex-specific and age-specific trials to guide evidence-based, patient-centered management of urinary retention in older women.",
            source:
              "https://doi.org/10.1007/s40266-026-01323-8"
          },
          verification: {
            checked_at: "2026-09-19",
            method: "web search",
            findings:
              "The search found extensive recent RCT and cohort activity on urinary incontinence in older women (e.g., Cochrane network meta-analysis 2025, OnabotulinumtoxinA dose trials, PFMT/androgen trials, telehealth and multidisciplinary intervention trials), but this is a distinct condition from urinary retention. For urinary retention specifically, the only recent dedicated study found is a small retrospective case series (n=9) on colpocleisis for retention in elderly women with pelvic organ prolapse (2025), which is surgical, single-center, and not a sex/age-specific pharmacologic or broader therapeutic trial. No dedicated pharmacologic or broader therapeutic RCT registry/cohort specifically targeting urinary retention (as opposed to incontinence) in older women was identified.",
            sources: ["https://www.tandfonline.com/doi/pdf/10.2147/CIA.S550792","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12776221/","https://cochranelibrary.com/web/cochrane/content?contentLanguage=&doi=10.1002%2F14651858.CD015376.pub2&templateType=references&type=cdsr&urlTitle=%2Fcdsr%2Fdoi%2F10.1002%2F14651858.CD015376.pub2","https://pubmed.ncbi.nlm.nih.gov/42531564/","https://www.sciencedirect.com/org/science/article/pii/S1195947926000170","https://link.springer.com/article/10.1007/s00192-025-06159-1","https://today.uconn.edu/2025/08/could-simply-taking-a-supplement-prevent-many-older-womens-urgent-need-to-urinate/","https://doi.org/10.1093/geroni/igy023.1710","https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0322742"]
          }
        }
      ]
    },
    {
      id: "fertility-preservation-chemo",
      title:
        "Women with cancer undergoing chemotherapy lack clear evidence on which fertility preservation strategy works best",
      area: "Reproductive health",
      summary:
        "Premenopausal women with cancer, especially breast cancer, face risk of ovarian damage and premature ovarian insufficiency from chemotherapy. Two main preservation strategies exist: controlled ovarian hyperstimulation with a protective agent followed by freezing of oocytes/embryos, or ovarian suppression with GnRH agonists. A Cochrane review of 23 RCTs found evidence ranging from very low to moderate certainty, with major gaps on live birth, survival, and head-to-head comparisons.",
      affected_women:
        "Premenopausal women with cancer undergoing chemotherapy, primarily those with breast cancer",
      source:
        "https://doi.org/10.1002/14651858.cd012891.pub2",
      origin: "sourced",
      is_demo: false,
      data_needs: [
        {
          id: "fertility-preservation-chemo-comparative-trials",
          problem_id: "fertility-preservation-chemo",
          description:
            "Direct comparative trial data between controlled ovarian hyperstimulation with a protective agent and GnRH agonist ovarian suppression, and long-term outcome data on live birth and survival for both strategies",
          why_it_matters:
            "Without this evidence, women and clinicians cannot make informed choices between fertility preservation methods, and long-term reproductive and survival outcomes remain unknown.",
          status: "partial",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://doi.org/10.1002/14651858.cd012891.pub2",
            note:
              "The review states there was 'no evidence available for our primary outcomes: ovarian insufficiency, live birth and overall survival' for controlled ovarian hyperstimulation, and separately reports 'No evidence was available for this comparison' between the two main strategies head-to-head.",
            region: null,
            claimed_date: "2025-06-19"
          },
          dataset_source: {
            note:
              "Individual patient-level meta-analysis of 5 RCTs (n=873) on GnRH agonists during chemotherapy for premenopausal early breast cancer patients, reporting premature ovarian insufficiency and some pregnancy outcomes; does not include a comparator arm of controlled ovarian hyperstimulation with protective agent, and does not report long-term overall survival or live birth data across both fertility preservation strategies.",
            source:
              "https://ascopubs.org/doi/10.1200/JCO.2018.78.0858"
          },
          collection_guidance: null,
          verification: {
            checked_at: "2026-09-19",
            method: "web search",
            findings:
              "No direct head-to-head randomized trial comparing controlled ovarian hyperstimulation (with a protective agent) versus GnRH agonist ovarian suppression, nor long-term live birth/overall survival data for both strategies, was found. The closest related evidence is a JCO individual patient-level meta-analysis of GnRH agonists during chemotherapy for ovarian function preservation in breast cancer, which pooled five trials (873 patients) and found lower premature ovarian insufficiency rates with GnRHa (14.1%) versus control (30.9%), plus some pregnancy outcome data, but this compares GnRHa-suppression to no suppression during chemotherapy rather than to ovarian stimulation/cryopreservation, and does not report overall survival or long-term live birth across both strategies head-to-head.",
            sources: ["https://doi.org/10.1093/humrep/deae286","https://pmc.ncbi.nlm.nih.gov/articles/PMC13432987/","https://pmc.ncbi.nlm.nih.gov/articles/PMC3987498/","https://www.nature.com/articles/s41467-026-70964-5","https://pubmed.ncbi.nlm.nih.gov/42425545/","https://www.tandfonline.com/doi/full/10.1080/14647273.2024.2316005","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2259311/","https://www.oncpracticemanagement.com/ofs-summit/rationale-and-evidence-for-ovarian-function-suppression-as-a-fertility-preservation-strategy-beyond-the-poems-trial","https://ascopubs.org/doi/10.1200/JCO.2018.78.0858","https://pmc.ncbi.nlm.nih.gov/articles/PMC12229283/"]
          }
        }
      ]
    },
    {
      id: "sjogrens-ovarian-reserve",
      title:
        "Sjögren's disease may reduce ovarian reserve in reproductive-age women",
      area: "Reproductive health",
      summary:
        "A systematic review and meta-analysis found that women with Sjögren's disease had significantly lower AMH levels than disease-free controls, with a trend toward higher FSH, though no significant differences in antral follicle count or ovarian volume. The evidence base was limited to four observational studies.",
      affected_women:
        "Reproductive-age women with Sjögren's disease",
      source:
        "https://doi.org/10.55563/clinexprheumatol/28g31m",
      origin: "sourced",
      is_demo: false,
      data_needs: [
        {
          id: "sjogrens-ovarian-reserve-evidence-base",
          problem_id: "sjogrens-ovarian-reserve",
          description:
            "Larger, more numerous observational studies directly measuring ovarian reserve markers (AMH, FSH, AFC, OV) in women with Sjögren's disease versus controls",
          why_it_matters:
            "Without a robust evidence base, clinicians cannot give definitive fertility counselling or make confident clinical management decisions for women with Sjögren's disease.",
          status: "partial",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://doi.org/10.55563/clinexprheumatol/28g31m",
            note:
              "The authors state that 'limited data prevent definitive confirmation of how SjD affects ovarian reserve', based on only four observational studies involving 410 participants total.",
            region: null,
            claimed_date: "2026-06-01"
          },
          dataset_source: {
            note:
              "Cross-sectional study comparing AMH levels between primary Sjögren's syndrome patients and healthy controls; adds to but does not resolve the small total evidence base (previously ~410 participants across 4 studies), and does not comprehensively cover all ovarian reserve markers (FSH, AFC, OV) across larger cohorts.",
            source:
              "https://pubmed.ncbi.nlm.nih.gov/39576415/"
          },
          collection_guidance: null,
          verification: {
            checked_at: "2026-09-19",
            method: "web search",
            findings:
              "A new cross-sectional study (Mandosi et al., Clin Rheumatol 2025) found significantly lower serum AMH in primary Sjögren's syndrome patients versus controls, adding one more observational study to the evidence base. However, this is a single additional study and does not by itself constitute the 'larger, more numerous' body of evidence called for; sample sizes remain modest and other markers (FSH, AFC, OV) are not fully addressed in this new report, so the overall evidence base is still limited.",
            sources: ["https://pubmed.ncbi.nlm.nih.gov/39576415/","https://journals.sagepub.com/doi/10.1177/20503121251405020","https://pubmed.ncbi.nlm.nih.gov/41403577/","https://www.tandfonline.com/doi/pdf/10.1080/09513590.2025.2530568","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11729113/","https://pubmed.ncbi.nlm.nih.gov/42370514/","https://www.clinexprheumatol.org/abstract.asp?a=23627","https://pubmed.ncbi.nlm.nih.gov/27987339/","https://clinicaltrials.gov/study/NCT05858307","https://pmc.ncbi.nlm.nih.gov/articles/PMC11729113"]
          }
        }
      ]
    },
    {
      id: "caffeine-female-athletes",
      title:
        "Effects of acute caffeine on female team-sport athletes are poorly quantified for sport-specific skills and cognitive outcomes",
      area: "Pharmacology",
      summary:
        "This meta-analysis of 26 crossover trials found that acute caffeine intake shows small favorable effects on physical performance and reduced perceived exertion in female team-sport athletes, but evidence for sport-specific skills and cognitive performance remained uncertain due to few studies per outcome. Moderator analyses did not reliably show effects of dose, timing, formulation, sport type, competitive level, or habitual caffeine intake. The authors note that current data cannot support population- or protocol-stratified recommendations.",
      affected_women:
        "Female team-sport athletes",
      source:
        "https://doi.org/10.3390/nu18152429",
      origin: "sourced",
      is_demo: false,
      data_needs: [
        {
          id: "caffeine-female-athletes-menstrual-tracking",
          problem_id: "caffeine-female-athletes",
          description:
            "Trials of caffeine's acute effects in female athletes rarely record menstrual-cycle phase, hormonal-contraceptive use, habitual caffeine intake, or adverse symptoms",
          why_it_matters:
            "Without this information, researchers cannot determine whether hormonal status or habitual intake changes caffeine's effects, limiting the ability to give tailored, evidence-based recommendations for female athletes.",
          status: "partial",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://doi.org/10.3390/nu18152429",
            note:
              "The abstract states that 'Future trials should be adequately powered, prospectively report menstrual-cycle phase, hormonal-contraceptive use, habitual caffeine intake, and adverse symptoms, and verify the integrity of blinding,' indicating these factors are currently missing from the evidence base.",
            region: null,
            claimed_date: "2026-07-24"
          },
          dataset_source: {
            note:
              "Covers acute caffeine ingestion and exercise/cognitive performance in women with menstrual-cycle phase and hormonal-contraceptive status now tracked in newer primary trials and synthesized in a 2026 meta-analysis; however, habitual caffeine intake and adverse symptom reporting remain inconsistently captured, and the pilot trial is small (limited power), so the underlying evidence base is still not fully compliant with the original recommendations.",
            source:
              "https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2026.1876198/full"
          },
          collection_guidance: {
            note:
              "Future trials should be adequately powered and should prospectively report menstrual-cycle phase, hormonal-contraceptive use, habitual caffeine intake, and adverse symptoms, and verify the integrity of blinding.",
            source:
              "https://doi.org/10.3390/nu18152429"
          },
          verification: {
            checked_at: "2026-09-19",
            method: "web search",
            findings:
              "New evidence has emerged: a 2026 Frontiers in Nutrition systematic review/meta-analysis specifically examined acute caffeine effects in women by menstrual-cycle phase and hormonal-contraceptive status, and a 2025 randomized double-blind pilot trial (Nutrients) tested caffeine's cognitive and neuromuscular effects across menstrual-cycle phases in eumenorrheic female athletes. These begin to address the reporting gap by prospectively tracking cycle phase and contraceptive use, though the meta-analysis notes most included trials still don't consistently report habitual caffeine intake or adverse symptoms, and blinding integrity verification remains inconsistent across the literature.",
            sources: ["https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2026.1876198/full","https://doi.org/10.3390/nu18101512","https://pubmed.ncbi.nlm.nih.gov/42591203/","https://pubmed.ncbi.nlm.nih.gov/42500255/","https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2026.1876198/pdf","https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2026.1876198/xml","https://pmc.ncbi.nlm.nih.gov/articles/PMC13395651/","https://clinicaltrials.gov/study/NCT07591818","https://pubmed.ncbi.nlm.nih.gov/42355449/"]
          }
        }
      ]
    },
    {
      id: "vbac-outcomes",
      title:
        "Women considering vaginal birth after cesarean lack clear evidence on maternal and neonatal risks",
      area: "Maternal health",
      summary:
        "A systematic review and meta-analysis found that while VBAC has an overall success rate of about 68%, comparative risks between trial of labor after cesarean (TOLAC) and elective repeat cesarean delivery (ERCD) remain imprecisely estimated, especially for uterine rupture. Neonatal outcomes could not be reliably pooled due to inconsistent reporting across studies.",
      affected_women:
        "Women with a prior cesarean section who are considering vaginal birth in a subsequent pregnancy",
      source:
        "https://doi.org/10.3390/medicina62071286",
      origin: "sourced",
      is_demo: false,
      data_needs: [
        {
          id: "vbac-outcomes-standardized-neonatal-reporting",
          problem_id: "vbac-outcomes",
          description:
            "Standardized, consistently reported neonatal outcome data for comparing TOLAC versus ERCD",
          why_it_matters:
            "Without consistent neonatal outcome reporting, women and clinicians cannot reliably weigh the risks of attempting vaginal birth after cesarean versus scheduling a repeat cesarean.",
          status: "partial",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://doi.org/10.3390/medicina62071286",
            note:
              "The abstract states that 'Neonatal outcomes were reported inconsistently and could not be reliably pooled,' and concludes that the evidence is based predominantly on observational studies with 'certainty of evidence for most comparative outcomes remains low or very low.'",
            region: null,
            claimed_date: "2026-07-03"
          },
          dataset_source: {
            note:
              "A 2025 cohort study (Chatzistergiou et al., BMC Pregnancy and Childbirth) and a 2025 systematic review/meta-analysis report TOLAC vs ERCD maternal and neonatal outcomes, but these are individual studies using their own outcome definitions, not a standardized reporting system or pooled registry; certainty of neonatal outcome comparisons remains limited by inconsistent definitions across the literature.",
            source:
              "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12667123/"
          },
          collection_guidance: {
            note:
              "The findings support the need for larger, well-designed comparative studies with standardized outcome reporting.",
            source:
              "https://doi.org/10.3390/medicina62071286"
          },
          verification: {
            checked_at: "2026-09-19",
            method: "web search",
            findings:
              "No standardized core outcome set or registry specifically for TOLAC vs ERCD neonatal outcomes was found. Individual new cohort studies and systematic reviews/meta-analyses continue to be published (e.g., a 2025 cohort study of 2,424 women and a systematic review/meta-analysis of TOLAC vs ERCD), but these still rely on heterogeneous, non-standardized neonatal outcome definitions across studies rather than a consistent reporting framework. This means the underlying inconsistency the original paper flagged has not been resolved by any harmonization effort or unified dataset.",
            sources: ["https://pubmed.ncbi.nlm.nih.gov/41327054/","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12667123/","https://pubmed.ncbi.nlm.nih.gov/42512828/","https://www.frontiersin.org/journals/medicine/articles/10.3389/fmed.2025.1643142/xml","https://pmc.ncbi.nlm.nih.gov/articles/PMC5376362/","https://doi.org/10.3390/medicina62071286","https://pmc.ncbi.nlm.nih.gov/articles/PMC13413987/","https://pubmed.ncbi.nlm.nih.gov/41605508/","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9796916/"]
          }
        }
      ]
    },
    {
      id: "afghan-refugee-srh",
      title:
        "Afghan refugee women in Pakistan face major barriers to sexual and reproductive health and maternal care",
      area: "Maternal health",
      summary:
        "Afghan refugee women in Pakistan face barriers including distance, cost, stigma, and inadequate education around sexual and reproductive health services. High illiteracy rates limit access to pregnancy risk information, and most maternal deaths in this population are considered preventable. Long-term interventions and women's resilience have rarely been studied.",
      affected_women:
        "Afghan refugee women of reproductive age living in Pakistan",
      source:
        "https://doi.org/10.3389/fgwh.2026.1645605",
      origin: "sourced",
      is_demo: false,
      data_needs: [
        {
          id: "afghan-refugee-srh-long-term-interventions",
          problem_id: "afghan-refugee-srh",
          description:
            "Lack of research on long-term sexual and reproductive health interventions and on Afghan refugee women's resilience and self-agency",
          why_it_matters:
            "Without evidence on what sustained interventions work, programs cannot be designed to durably improve maternal outcomes or build on women's existing coping strategies.",
          status: "partial",
          existing_data_note: "",
          gap_evidence: {
            source:
              "https://doi.org/10.3389/fgwh.2026.1645605",
            note:
              "The review states 'Few studies examined the effects of long-term SRH interventions, and only one study analyzed how Afghan women in Pakistan exhibit resilience and self-agency in the face of structural oppression.'",
            region: "Pakistan",
            claimed_date: "2026-07-07"
          },
          dataset_source: {
            note:
              "Related but not equivalent studies: a qualitative study on health-system resilience for MNCH among Afghan refugees (Shafiq et al., 2025), a health-system resilience exploratory case study (Memon et al., 2025), a 2026 scoping review on SRH among Afghan refugee women, and a 2025 cross-sectional study on telehealth SRH access in Pakistan. These touch on resilience and SRH access but do not deliver long-term intervention effectiveness data or a focused resilience/self-agency analysis matching the identified gap.",
            source:
              "https://doi.org/10.1177/11786329241310733"
          },
          collection_guidance: null,
          verification: {
            checked_at: "2026-09-19",
            method: "web search",
            findings:
              "The original review's exact gap statement still appears verbatim in the cited systematic review itself (confirming the gap was noted, not yet closed as of that paper's publication). However, newer related work has emerged: a qualitative study on resilient maternal/neonatal/child health among Afghan refugees in Pakistan, a health system resilience exploratory study, a 2026 scoping review on SRH among Afghan refugee women, and a 2025 cross-sectional telehealth SRH access study. None of these specifically provide long-term (longitudinal/sustained) SRH intervention outcome data or a dedicated study of Afghan women's resilience/self-agency against structural oppression comparable to what the review flagged as needed.",
            sources: ["https://pubmed.ncbi.nlm.nih.gov/42483314/","https://pmc.ncbi.nlm.nih.gov/articles/PMC13384941/","https://www.frontiersin.org/journals/global-womens-health/articles/10.3389/fgwh.2026.1645605/full","https://www.frontiersin.org/journals/global-womens-health/articles/10.3389/fgwh.2026.1645605/pdf","https://www.frontiersin.org/journals/global-womens-health/articles/10.3389/fgwh.2026.1645605/xml","https://doi.org/10.1177/11786329241310733","https://onlinelibrary.wiley.com/doi/10.1002/hpm.70113","https://doi.org/10.1177/10436596251366108","https://pjph.org/pjph/article/view/1918"]
          }
        }
      ]
    },
  ]
};
