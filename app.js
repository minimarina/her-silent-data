/* Unasked — renders the three screens from the seed in data.js.
 * No framework, no build step (SPEC §13). */

(function () {
  "use strict";

  /* One word per status, everywhere it appears: the badge, the counts key
     on the home screen, and the copied design all read from here. "Partial"
     on the badge against "Partly covered" in the sentence beside it was one
     status wearing two names within 40px. */
  var STATUS_WORD = {
    collected: "Collected",
    partial: "Partly covered",
    missing: "Missing"
  };

  /* Where the gap claim comes from (SPEC §5a). "sourced" means an
     authority published the request; "proposed" means this platform
     inferred it and says so. The wording is deliberately blunt: a judge
     or a researcher must be able to tell the two apart at a glance. */
  var ORIGIN_WORD = {
    sourced: "Published research request",
    proposed: "Proposed by this platform — unverified"
  };

  /* §8.1 — the app states what it does not know. An empty field says this
     and never guesses, and never renders as a silent blank. */
  var UNKNOWN = "Not established";

  /* Whether each part of the system on the About screen exists today.
     Every Built/Planned label on that screen — the chips in the list and
     the words inside the diagram alike — is read from here, so a part that
     gets built is one edit in this object and nothing else. §8.1: nothing
     is marked built unless it is in this repository and running. */
  var BUILD_STATUS = {
    stage1: "built",
    stage2: "built",
    stage3: "planned",
    stage4: "planned",
    stage5: "planned",

    discover: "built",
    filter:   "built",
    extract:  "built",
    verify:   "built",
    design:   "built",
    validate: "built",
    review:   "built"
  };

  /* The word is the carrier; the colour and the border style repeat it
     (§8.2). Deliberately none of the three data-status colours: those mean
     the status of data everywhere else and must keep meaning only that. */
  var BUILD_WORD = {
    built:   "Built",
    partly:  "Partly built",
    planned: "Planned"
  };

  /* ---------- helpers ---------- */

  function el(id) {
    return document.getElementById(id);
  }

  /* Build an element with text content. Text is set as text, never as
     HTML, so nothing in the seed can be interpreted as markup. */
  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text) { node.textContent = text; }
    return node;
  }

  function hasText(value) {
    return typeof value === "string" && value.trim() !== "";
  }

  var MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  var ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

  /* "2026-07-23" → "23 July 2026". Parsed by hand rather than through Date:
     new Date("2026-07-23") reads a bare ISO date as UTC and prints it in
     local time, so west of Greenwich every claim renders a day early. A
     value that is not a plain ISO date is passed through untouched. */
  function longDate(value) {
    var parts = ISO_DATE.exec(hasText(value) ? value.trim() : "");

    if (!parts) { return value; }
    return Number(parts[3]) + " " + MONTHS[Number(parts[2]) - 1] + " " +
      parts[1];
  }

  /* Whole days from one ISO date to another, or null if either is not one.
     Date.UTC on both sides, so no timezone and no daylight saving. */
  function daysBetween(from, to) {
    var a = ISO_DATE.exec(hasText(from) ? from.trim() : "");
    var b = ISO_DATE.exec(hasText(to) ? to.trim() : "");

    if (!a || !b) { return null; }

    var start = Date.UTC(Number(a[1]), Number(a[2]) - 1, Number(a[3]));
    var end = Date.UTC(Number(b[1]), Number(b[2]) - 1, Number(b[3]));

    return Math.round((end - start) / 86400000);
  }

  /* Like make(), but an empty value becomes "Not established" rather than
     an empty element. Italic as well as muted, so the distinction does not
     rest on colour alone (§8.2). */
  function makeValue(tag, className, text) {
    var node = make(tag, className, hasText(text) ? text : UNKNOWN);
    if (!hasText(text)) { node.classList.add("unknown"); }
    return node;
  }

  /* Same rule, for elements that already exist in the markup. */
  function setValue(node, text) {
    node.textContent = hasText(text) ? text : UNKNOWN;
    node.classList.toggle("unknown", !hasText(text));
  }

  /* ---------- provenance (§8.1) ---------- */

  /* Every claim shows where it came from, on the record itself rather
     than in a footer. A record's source is either the string "demo" or a
     URL, so replacing the seed with real sources is a one-field edit per
     record and needs no change here. */

  function isUrl(value) {
    return hasText(value) && /^https?:\/\//i.test(value);
  }

  /* A hostname is the wrong label for a DOI. Every record in the seed
     cites doi.org, so eleven cards all read "Source: doi.org", which tells
     a researcher nothing and makes the citations look duplicated. A DOI is
     the identifier she actually reads, so it is shown instead of the host
     it resolves through; everything else keeps its hostname. */
  var DOI_HOSTS = /^(dx\.)?doi\.org$/i;

  function sourceLabel(source) {
    if (!hasText(source)) { return UNKNOWN; }
    if (source === "demo") { return "Generated demo data"; }
    if (isUrl(source)) {
      try {
        var url = new URL(source);
        var host = url.hostname.replace(/^www\./, "");

        if (DOI_HOSTS.test(host)) {
          return "doi " + decodeURIComponent(url.pathname).replace(/^\//, "");
        }
        return host;
      } catch (e) {
        return source;
      }
    }
    return source;
  }

  /* Linked version, for the screens where the record stands alone. */
  function sourceNode(source) {
    var line = make("p", "provenance");
    line.appendChild(make("span", "label", "Source: "));

    if (isUrl(source)) {
      var link = make("a", null, sourceLabel(source));
      link.href = source;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      line.appendChild(link);
      return line;
    }

    if (source === "demo") {
      line.appendChild(make(
        "span",
        "is-demo",
        "Generated demo data — illustrative, not a real finding"
      ));
      return line;
    }

    line.appendChild(makeValue("span", null, source));
    return line;
  }

  function fillSourceSlot(slotId, source) {
    var slot = el(slotId);
    slot.textContent = "";
    slot.appendChild(sourceNode(source));
  }

  /* The origin badge. A demo record says so first: while it is a
     placeholder, its origin is not a claim worth making. Colour is never
     the only signal — the word carries it (§8.2). */
  function originWord(problem) {
    if (problem.is_demo) { return "Demo record"; }
    return ORIGIN_WORD[problem.origin] || UNKNOWN;
  }

  function originState(problem) {
    if (problem.is_demo) { return "demo"; }
    return ORIGIN_WORD[problem.origin] ? problem.origin : "unknown";
  }

  function originBadge(problem, tag) {
    var badge = make(tag || "span", "origin", originWord(problem));
    badge.setAttribute("data-origin", originState(problem));
    return badge;
  }

  /* Whether the origin is worth saying on a list. A record whose gap was
     published by an authority is the normal case and the footer states it
     once for the whole seed; anything else — a placeholder, a gap this
     platform proposed, an origin nobody has assessed — is a warning, and
     a warning is worth repeating per card. The record's own screens show
     the badge either way. */
  function flaggedOrigin(problem) {
    return Boolean(problem.is_demo) || problem.origin !== "sourced";
  }

  /* Evidence that somebody looked and named the hole. A missing need
     cannot link to data that does not exist, so it cites this instead —
     a different object, not a weaker version of the same one (§5a).
     Where nothing names the gap, the §8.1 rule applies and the record
     says the gap is this platform's own assessment. */
  function gapEvidenceNode(problem, need, tag) {
    var box = make(tag || "div", "gap-evidence");
    box.appendChild(make("span", "label", "Who says it is missing: "));

    /* A placeholder has not been assessed by anyone, so it must not
       claim to have been assessed here. The three cases are different
       and the screen says which one it is (§8.1). */
    if (problem.is_demo) {
      box.appendChild(make(
        "span",
        "unknown",
        "Nobody yet — this is a demo record, not a real gap claim."
      ));
      return box;
    }

    var evidence = need.gap_evidence;
    if (!evidence || !hasText(evidence.note)) {
      box.appendChild(make(
        "span",
        "unknown",
        "No published source names this gap. Assessed by this platform."
      ));
      return box;
    }

    box.appendChild(make("span", null, evidence.note));

    /* When the claim was made. The check below says when the platform last
       looked; without this, "collected since" has no since, and the reader
       cannot tell a gap named last month from one named four years ago.
       Every record in the seed carries it and none of them showed it. */
    if (hasText(evidence.claimed_date)) {
      box.appendChild(make("span", "gap-claimed",
        "Gap claimed " + longDate(evidence.claimed_date)));
    }

    /* §8.1 — the source sits on the record. Inside a button it can only
       be named, because a link may not be nested in one; everywhere else
       it is the link a researcher actually follows.

       Not when it is the record's own source, which it is on all eleven
       seed records: the Source line sits a few centimetres above this one,
       and the same DOI printed twice on one screen reads as two references
       until the reader compares the strings. */
    if (isUrl(evidence.source) && evidence.source !== problem.source) {
      var cite = make("span", "gap-cite");
      cite.appendChild(make("span", "label", "Read it: "));

      if (box.tagName === "SPAN") {
        cite.appendChild(make("span", null, sourceLabel(evidence.source)));
      } else {
        var link = make("a", null, sourceLabel(evidence.source));
        link.href = evidence.source;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        cite.appendChild(link);
      }
      box.appendChild(cite);
    }

    if (hasText(evidence.region)) {
      box.appendChild(make("span", "region", "Coverage: " + evidence.region));
    }
    return box;
  }

  /* Titles in the seed run to 155 characters, because a gap claim is a
     sentence. That is right on the record, where it is the heading of the
     thing the reader came for, and wrong on a card in a list of four - the
     spec (2) describes this reader as someone who knows the field and is
     short on time, and hands her four sentences to skim.

     The card shows the first clause; the record keeps the sentence. The cut
     falls on a clause boundary where there is one and a word boundary where
     there is not, and nowhere else: this shortens a claim, so it must not be
     able to change one. The full sentence stays the button's accessible
     name, so nothing is hidden from a reader who cannot see the card. */
  var TITLE_KEEP = 105;
  var TITLE_MAX = 115;
  var TITLE_MIN = 45;
  var CLAUSE = /,\s|;\s|\s—\s|:\s/g;

  function cardTitle(title) {
    if (!hasText(title) || title.length <= TITLE_KEEP) { return title; }

    var cut = -1;
    var match;

    CLAUSE.lastIndex = 0;
    while ((match = CLAUSE.exec(title)) !== null) {
      if (match.index > TITLE_MAX) { break; }
      if (match.index >= TITLE_MIN) { cut = match.index; }
    }

    if (cut === -1) { cut = title.lastIndexOf(" ", TITLE_KEEP - 15); }
    if (cut < TITLE_MIN) { return title; }

    return title.slice(0, cut) + "…";
  }

  function findProblem(problemId) {
    return DATA.problems.filter(function (p) {
      return p.id === problemId;
    })[0];
  }

  function findNeed(problem, needId) {
    return problem.data_needs.filter(function (n) {
      return n.id === needId;
    })[0];
  }

  /* The other half of provenance. A missing need cites the authority
     that named the gap; a collected or partial one points at the data
     itself, which is what a researcher came here to be handed. Same
     button rule as gap evidence: named inside a button, linked outside. */
  function datasetNode(need, tag) {
    var box = make(tag || "div", "dataset");
    box.appendChild(make("span", "label", "Where the data is: "));

    var ds = need.dataset_source;
    if (!ds || !hasText(ds.note)) {
      box.appendChild(make(
        "span",
        "unknown",
        "No public dataset identified on this record."
      ));
      return box;
    }

    box.appendChild(make("span", null, ds.note));

    if (isUrl(ds.source)) {
      var cite = make("span", "gap-cite");
      cite.appendChild(make("span", "label", "Go to it: "));

      if (box.tagName === "SPAN") {
        cite.appendChild(make("span", null, sourceLabel(ds.source)));
      } else {
        var link = make("a", null, sourceLabel(ds.source));
        link.href = ds.source;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        cite.appendChild(link);
      }
      box.appendChild(cite);
    }
    return box;
  }

  /* ---------- the check, the guidance, and the generated design ---------- */

  /* Where a correction goes. No backend exists, so a reader who knows of
     data the check missed is sent to a prefilled issue: free to run, and
     the correction history ends up public, which is better provenance
     than a form that mails one person. */
  var REPO_ISSUES =
    "https://github.com/minimarina/women-data-gap-map/issues/new";

  function issueUrl(problem, need) {
    return REPO_ISSUES +
      "?title=" + encodeURIComponent("Data exists: " + need.id) +
      "&body=" + [
        encodeURIComponent("Record: " + need.id),
        encodeURIComponent("Problem: " + problem.title),
        encodeURIComponent("Data need: " + need.description),
        "",
        encodeURIComponent("Where the data is (link):")
      ].join("%0A");
  }

  /* Did anyone collect it after the gap was named? A record that has not
     been checked says so — §8.1 applied to time, because a gap claim from
     four years ago may simply have been answered since. */
  function verificationNode(need, tag) {
    var box = make(tag || "div", "verification");
    box.appendChild(make("span", "label", "Checked for existing data: "));

    var check = need.verification;
    if (!check || !hasText(check.checked_at)) {
      box.appendChild(make(
        "span",
        "unknown",
        "Not checked against literature published since."
      ));
      return box;
    }

    /* The verify step writes 150 words and more, and this is the climax of
       the demo (§6, screen 3), not a place to put an essay. The first
       sentences carry the verdict; the rest is the working, and a reader
       who wants to challenge the claim can open it. Nothing is removed —
       §8.1 is about not hiding what the platform knows, and a disclosure
       hides nothing a reader cannot open in one keystroke. */
    var findings = hasText(check.findings) ? check.findings : "Nothing found.";
    var split = splitFindings(findings);

    box.appendChild(make("span", null, split[0]));

    if (split[1]) {
      var moreId = "check-more-" + need.id;

      /* The cut falls after a sentence's own full stop, so appending an
         ellipsis to it printed four dots on every truncated check. An
         ellipsis marks an omission mid-sentence; after a closed one the
         toggle below is already the signal that there is more. */
      var ellipsis = null;

      if (!/[.!?]["'’”)]?$/.test(split[0])) {
        ellipsis = make("span", "check-ellipsis", "…");
        box.appendChild(ellipsis);
      }

      var more = make("span", "check-more", " " + split[1]);
      more.id = moreId;
      more.hidden = true;
      box.appendChild(more);

      var toggle = make("button", "check-toggle", "Show the full check");
      toggle.type = "button";
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", moreId);

      toggle.addEventListener("click", function () {
        var open = toggle.getAttribute("aria-expanded") === "true";

        toggle.setAttribute("aria-expanded", open ? "false" : "true");
        more.hidden = open;
        if (ellipsis) { ellipsis.hidden = !open; }
        toggle.textContent = open ? "Show the full check" : "Show less";
      });
      box.appendChild(toggle);
    }

    /* The interval is the sentence a researcher is actually weighing, and
       it is arithmetic on two stored dates rather than anything new. */
    var searched = "Searched " + longDate(check.checked_at) +
      (hasText(check.method) ? " — " + check.method : "");

    var days = need.gap_evidence
      ? daysBetween(need.gap_evidence.claimed_date, check.checked_at)
      : null;

    if (days !== null && days >= 0) {
      searched += " · " + days + (days === 1 ? " day" : " days") +
        " after the claim";
    }

    box.appendChild(make("span", "region", searched));

    return box;
  }

  /* Cut at the end of a sentence so the visible half is never a fragment,
     and never cut at all to save a line or two — a disclosure holding one
     sentence costs the reader more than it saves. */
  var FINDINGS_LIMIT = 240;
  var FINDINGS_MIN_REST = 80;

  function splitFindings(text) {
    if (text.length <= FINDINGS_LIMIT + FINDINGS_MIN_REST) { return [text, ""]; }

    var cut = -1;
    var boundary = /[.!?]["'’”)]?\s/g;
    var match;

    while ((match = boundary.exec(text)) !== null) {
      if (match.index >= FINDINGS_LIMIT) { break; }
      cut = match.index + match[0].length - 1;
    }

    /* No sentence ended in range — one very long opening sentence. Fall
       back to a word boundary rather than splitting mid-word. */
    if (cut === -1) {
      cut = text.lastIndexOf(" ", FINDINGS_LIMIT);
      if (cut === -1) { return [text, ""]; }
    }

    var rest = text.slice(cut).trim();
    if (rest.length < FINDINGS_MIN_REST) { return [text, ""]; }

    return [text.slice(0, cut).trim(), rest];
  }

  /* The limit of the check, stated rather than implied. A search of
     published literature cannot prove a negative, and saying so is the
     same rule as §5a: the platform reports what an authority claimed and
     what it could reach, and never asserts that data does not exist. */
  function shallowCheckNote(problem, need) {
    var box = make("div", "check-note");

    box.appendChild(make("p", null,
      "This was a search of published literature, not proof. Data can " +
      "exist in unpublished registries, national statistics, industry " +
      "cohorts or behind access agreements, and none of that is visible " +
      "from here."));

    var link = make("a", "check-invite", "Know of data we missed? Send a link →");
    link.href = issueUrl(problem, need);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    box.appendChild(link);

    return box;
  }

  /* What the source itself said about collecting the data. Present only
     when the published text specifies a population or a method; null is
     the normal case, and the screen says so plainly rather than filling
     the space with the platform's own invention. */
  function guidanceNode(problem, need) {
    var guidance = need.collection_guidance;

    /* The usual answer, on eight of the eleven seed records. It was a
       labelled block with a left rule — the same shape and weight as the
       quotation above it — whose whole content was that there is nothing
       here. The sentence stays, because §8.1 asks the app to say what it
       does not know; it no longer looks like a finding. */
    /* Nothing per need. The answer is "there is nothing" on eight of the
       eleven records, and a labelled block saying so in every card was the
       same sentence given the weight of a finding. renderNeeds() puts it
       once, as a footnote at the foot of the screen. */
    if (!guidance || !hasText(guidance.note)) { return null; }

    var box = make("div", "guidance");
    box.appendChild(make(
      "span", "label", "What the source says about collecting it: "
    ));
    box.appendChild(make("span", null, guidance.note));

    /* Same rule as the gap evidence: not when it is the record's own
       source, which is already linked at the top of the screen. */
    if (isUrl(guidance.source) && guidance.source !== problem.source) {
      var cite = make("span", "gap-cite");
      cite.appendChild(make("span", "label", "Read it: "));
      var link = make("a", null, sourceLabel(guidance.source));
      link.href = guidance.source;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      cite.appendChild(link);
      box.appendChild(cite);
    }
    return box;
  }

  /* A study design is an answer, not a record. It is never part of a data
     need, never stored in the seed, and it is revealed only when asked
     for — so it cannot be mistaken for something an authority said.
     §11: the app works fully with the file absent. */
  function designs() {
    return (typeof RESEARCH_DESIGNS === "object" && RESEARCH_DESIGNS) || {};
  }

  /* What no design in this file contains. Said once per card rather than
     left for each design to imply it is complete: every one of them states
     a sample size it did not calculate, and none of them has been near an
     ethics committee. A researcher reading a plausible-looking protocol
     needs to know which parts are not there. */
  function designLimits() {
    return make("p", "design-limits",
      "No design here includes an ethics approval, a consent procedure, a " +
      "data protection plan or a sample size calculation. Those are yours " +
      "to write, and a study does not begin without them.");
  }

  /* A design the intake rules refused. The record keeps its claim, its date
     and its check; what it does not get is a study design, and it says so.
     The refused design itself is never shown and never repaired by hand —
     a card labelled AI-generated may not carry a sentence a person wrote. */
  function withheldNode(reason) {
    var box = make("div", "design design-withheld");

    box.appendChild(make("p", "design-withheld-head",
      "No study design is offered for this record."));
    box.appendChild(make("p", "design-withheld-why", reason));

    return box;
  }

  function designNode(problem, need) {
    var design = designs()[need.id];
    if (!design) { return null; }
    if (hasText(design.withheld)) { return withheldNode(design.withheld); }

    var wrap = make("div", "design");
    var panelId = "design-panel-" + need.id;

    /* "Show", not "Generate". The app is static and holds no API key
       (§13), so every design was generated during the intake run and is
       already in research-designs.js by the time anyone clicks. The
       button used to say Generate, which described the pipeline rather
       than the click, and was the one place the product overstated
       itself. §11 says so in prose; the label now says it too. */
    var button = make("button", "design-toggle");
    button.type = "button";

    /* The same rotating mark the intake disclosure carries, and a label
       that says what the next click does. It used to do neither: the panel
       it opens runs to several hundred words and the button went on
       reading "Show research design" the whole time it was open. */
    var mark = make("span", "toggle-mark");
    mark.setAttribute("aria-hidden", "true");

    var label = make("span", null, "Show research design");

    button.appendChild(mark);
    button.appendChild(label);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", panelId);

    var panel = make("div", "design-panel");
    panel.id = panelId;
    panel.hidden = true;

    /* One line, not two. This and the paragraph that used to follow the
       fields carried the same warning twice; the clause that was only in
       the second one is folded in here, where it is read first rather than
       after nine hundred words of study design. */
    var badge = make("p", "origin design-origin",
      "AI-generated study design — unverified" +
      (hasText(design.generated_at)
        ? ", generated " + design.generated_at
        : "") +
      ". Nobody has reviewed it; you decide what to collect.");
    badge.setAttribute("data-origin", "proposed");
    panel.appendChild(badge);

    var fields = document.createElement("dl");
    fields.appendChild(field("Which women", design.target_women));
    fields.appendChild(listField(
      "What to find out from them", design.variables
    ));
    fields.appendChild(listField(
      "Broken down by",
      design.stratifiers,
      "Data collected without these cannot show what happens to which " +
      "women. The missing breakdown is the gap as often as the missing " +
      "study is."
    ));
    fields.appendChild(field(
      "In what form", design.form, design.instrument_source
    ));
    panel.appendChild(fields);
    panel.appendChild(designLimits());

    /* The platform ends where study design begins (§6, stage 3), and until
       now it ended by asking the reader to retype it. This hands the whole
       thing over — design, the claim it answers, and the citations — as
       text she can paste into a protocol, a grant application or an email.
       It is the cheapest thing the register can do to make the next stage
       of the loop actually happen. */
    panel.appendChild(copyRow(problem, need, design));

    button.addEventListener("click", function () {
      var open = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", open ? "false" : "true");
      panel.hidden = open;
      label.textContent = open
        ? "Show research design" : "Hide research design";
    });

    wrap.appendChild(button);
    wrap.appendChild(panel);
    return wrap;
  }

  /* Plain text, because the destination is a protocol document or an email
     and neither wants markup. The provenance travels with the design: a
     design pasted without the claim it answers is exactly the orphaned
     model output this whole project exists not to produce. */
  function designAsText(problem, need, design) {
    var lines = [];
    var add = function (label, value) {
      if (hasText(value)) { lines.push(label + ": " + value); }
    };
    var addList = function (label, items) {
      if (!items || !items.length) { return; }
      lines.push(label + ":");
      items.forEach(function (item) { lines.push("  - " + item); });
    };

    lines.push("RESEARCH DESIGN — AI-GENERATED, UNVERIFIED");
    if (hasText(design.generated_at)) {
      lines.push("Generated " + design.generated_at +
        (hasText(design.model) ? " by " + design.model : ""));
    }
    lines.push("");
    add("Problem", problem.title);
    add("Data need", need.description);
    add("Status", STATUS_WORD[need.status]);
    add("Why it matters", need.why_it_matters);
    lines.push("");
    add("Which women", design.target_women);
    addList("What to find out from them", design.variables);
    addList("Broken down by", design.stratifiers);
    add("In what form", design.form);
    add("Instrument", design.instrument_source);
    lines.push("");

    if (need.gap_evidence && hasText(need.gap_evidence.note)) {
      add("Who says it is missing", need.gap_evidence.note);
      add("Source", need.gap_evidence.source);
      add("Gap claimed", need.gap_evidence.claimed_date);
    }
    if (need.verification && hasText(need.verification.checked_at)) {
      add("Checked for existing data", need.verification.checked_at);
      add("What the check found", need.verification.findings);
    }
    if (need.dataset_source && hasText(need.dataset_source.note)) {
      add("Where existing data is", need.dataset_source.note);
      add("Dataset source", need.dataset_source.source);
    }

    lines.push("");
    lines.push("This design is model output and has not been reviewed. " +
      "The gap claim above is quoted from its cited source. A search of " +
      "published literature is not proof that data does not exist.");
    /* The address of the record itself, not of the site. A design pasted
       into a protocol or an email now carries the way back to the claim it
       answers, which is what the provenance rule was reaching for. */
    lines.push("From Unasked — " + SITE_URL +
      recordRoute(problem));

    return lines.join("\n");
  }

  var SITE_URL = "https://minimarina.github.io/women-data-gap-map/";

  /* navigator.clipboard is unavailable in some file:// contexts, and the
     app is built to open from file:// (§13). The textarea fallback is the
     old execCommand path: deprecated, still universally supported, and the
     only thing that works where the modern API is blocked.

     The fallback runs when writeText REJECTS as well as when the API is
     missing. Those are different failures — a blocked permission, a
     document without transient activation, a non-secure context — and an
     earlier version only handled the missing case, so every one of them
     reported "could not copy" without ever trying the path that works. */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () {
        return legacyCopy(text);
      });
    }
    return legacyCopy(text);
  }

  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "-1000px";
      document.body.appendChild(area);
      area.select();

      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(area);

      if (ok) { resolve(); } else { reject(new Error("copy unavailable")); }
    });
  }

  function copyRow(problem, need, design) {
    var row = make("div", "design-copy");

    var button = make("button", "copy-button", "Copy this design");
    button.type = "button";

    /* The result has to be announced, not only coloured: a copy that
       silently succeeded and a copy that silently failed look identical
       (§8.2 — never colour alone, and never nothing at all). */
    var status = make("span", "copy-status");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    button.addEventListener("click", function () {
      copyText(designAsText(problem, need, design)).then(function () {
        status.textContent = "Copied — design, claim and citations.";
        status.classList.remove("copy-failed");
      }, function () {
        status.textContent = "Could not copy. Select the text above instead.";
        status.classList.add("copy-failed");
      });
    });

    row.appendChild(button);
    row.appendChild(status);
    return row;
  }

  /* §8.3 — numbers are always framed in words, and always computed from
     the statuses so Screen 1 cannot disagree with Screen 2 (§12.16). */
  function gapSentence(problem) {
    return gapSentenceFor(problem.data_needs);
  }

  function gapSentenceFor(needs) {
    var total = needs.length;
    var missing = countIn(needs, "missing");
    var partial = countIn(needs, "partial");

    /* One need per problem is the normal case now that records come from
       the intake run, and "1 of 1 data needs missing" reads like a bug.
       The plural form is kept for problems that carry several. */
    if (total === 1) {
      if (missing > 0) { return "Data missing"; }
      if (partial > 0) { return "Partly covered"; }
      return "Data collected";
    }

    if (missing > 0) {
      return missing + " of " + total + " data needs missing";
    }

    /* "Nothing is missing" and "everything is collected" are different
       claims, and partial data must not be reported as data in hand — which
       "partly covered" says without opening on a denial. The old string led
       with "No data needs missing", so a register of gaps began the line by
       arguing against itself. */
    if (partial > 0) {
      return partial + " of " + total + " partly covered";
    }
    return "All " + total + " data needs collected";
  }

  function countStatus(problem, status) {
    return countIn(problem.data_needs, status);
  }

  function countIn(needs, status) {
    return needs.filter(function (n) { return n.status === status; }).length;
  }

  /* The map groups problems by area: one pin per area of the body, with
     however many problems sit inside it. Order follows the seed, so the
     numbered legend under 640px matches the order of the list below. */
  /* An area is on the map only if somebody measured a coordinate for it.
     Both lists are derived from the same order, so pins, their numbers and
     the legend cannot drift apart. */
  /* Sorted down the figure, not in seed order. The hint under the map says
     the numbers match the list below, and a reader checks that by scanning
     the figure — where seed order ran 1, 3, 4, 6, 5, 2 and looked shuffled.
     renderMap() and renderMapLegend() both read this, so the pins, their
     numbers and the legend still cannot drift apart. */
  function pinnedGroups() {
    return areaGroups()
      .filter(function (g) { return MAP_POINTS[g.area]; })
      .sort(function (a, b) {
        return MAP_POINTS[a.area].y - MAP_POINTS[b.area].y;
      });
  }

  function unpinnedGroups() {
    return areaGroups().filter(function (g) { return !MAP_POINTS[g.area]; });
  }

  function areaGroups() {
    var order = [];
    var byArea = {};

    DATA.problems.forEach(function (problem) {
      if (!byArea[problem.area]) {
        byArea[problem.area] = { area: problem.area, problems: [], needs: [] };
        order.push(byArea[problem.area]);
      }
      byArea[problem.area].problems.push(problem);
      byArea[problem.area].needs = byArea[problem.area].needs.concat(
        problem.data_needs
      );
    });
    return order;
  }

  /* Status badge: colour, shape and word together, so the status survives
     greyscale and colour blindness (§8.2, §12.11). The square is drawn in
     CSS on ::before; the word is real text. */
  function statusBadge(status) {
    var badge = make("span", "badge", STATUS_WORD[status]);
    badge.setAttribute("data-status", status);
    return badge;
  }

  /* ---------- routes ---------- */

  /* The hash is the state, so every record has an address. That is this
     register's own argument turned on itself: a claim you can check is a
     claim you can point at, and until now "Copy this design" handed a
     researcher the provenance with nowhere to come back to. Browser Back,
     and the back gesture on a phone, left the site from every screen too.

     A hash and not pushState, because the app is built to open from file://
     as well as from Pages (13), and a path route has no server to answer it
     on either. Back and Forward come free with the hash. */

  var ROUTE_HOME = "#/";

  function recordRoute(problem) {
    return "#/record/" + encodeURIComponent(problem.id);
  }

  function areaRoute(area) {
    return "#/area/" + encodeURIComponent(area);
  }

  /* An area holding one problem has no list to show, so its address is the
     record's. See openProblem. */
  function groupRoute(group) {
    return group.problems.length === 1
      ? recordRoute(group.problems[0])
      : areaRoute(group.area);
  }

  function currentRoute() {
    var hash = window.location.hash || ROUTE_HOME;
    var parts = hash.replace(/^#\/?/, "").split("/");

    return {
      name: parts[0] || "",
      value: decodeURIComponent(parts.slice(1).join("/"))
    };
  }

  /* Setting the hash fires hashchange, which renders. Setting it to what it
     already holds fires nothing, so that case renders directly. */
  function go(hash) {
    if (window.location.hash === hash) { renderRoute(); return; }
    window.location.hash = hash;
  }

  /* Correcting the address without adding a history entry: a Back that
     returned to a route the app had just redirected away from would bounce
     the reader forwards again. replaceState throws on file:// in some
     browsers, and the app has to open from there (13). */
  function replaceHash(hash) {
    if (window.location.hash === hash) { return; }

    if (window.history && window.history.replaceState) {
      try {
        window.history.replaceState(null, "", hash);
        return;
      } catch (e) { /* fall through to the hash, which always works */ }
    }
    window.location.hash = hash;
  }

  /* An address naming something the seed does not hold - a record that was
     dismissed, a mistyped link, a link made against an older seed - lands on
     the map rather than on a blank screen. */
  function renderRoute() {
    var route = currentRoute();

    if (route.name === "about") { show("screen-about"); return; }

    if (route.name === "record") {
      var problem = findProblem(route.value);

      if (problem) { openProblem(problem.id); return; }
    }

    if (route.name === "area") {
      var group = findArea(route.value);

      if (group) {
        if (group.problems.length === 1) {
          replaceHash(recordRoute(group.problems[0]));
          openProblem(group.problems[0].id);
          return;
        }
        openArea(route.value);
        return;
      }
    }

    show("screen-problems");
  }

  /* Which route a Back or a header button stands for. The detail screen's is
     the one that varies: it returns to the area when there is an area worth
     returning to, and to the map when the record was opened off a pin. */
  function routeForScreen(screenId) {
    if (screenId === "screen-about") { return "#/about"; }
    if (screenId === "screen-area" && currentArea) {
      return areaRoute(currentArea);
    }
    return ROUTE_HOME;
  }

  /* ---------- navigation ---------- */

  var SCREENS = [
    "screen-problems", "screen-area", "screen-detail", "screen-about"
  ];

  /* Shows one screen and hides the others, then moves focus into the new
     screen so a keyboard user lands in the new content (§12.9, §12.13).
     No reload and no history API — three screens do not need one.

     Focus goes to the section, not its heading: the back button sits
     above the heading, so focusing the heading would put Back behind the
     user and out of reach of a forward Tab. The section is labelled by
     its heading, so a screen reader still announces the screen name. */
  /* Where the map was left. Every navigation used to scroll to zero,
     including the way back — and on a phone the figure is some 700px tall
     with the legend underneath it, so returning from a record meant
     scrolling all of it again to reach the row you had just left. */
  var mapScroll = 0;

  function show(screenId) {
    var leaving = SCREENS.filter(function (id) { return !el(id).hidden; })[0];

    if (leaving === "screen-problems") { mapScroll = window.pageYOffset; }

    SCREENS.forEach(function (id) {
      el(id).hidden = (id !== screenId);
    });

    el(screenId).focus();
    window.scrollTo(0, screenId === "screen-problems" ? mapScroll : 0);
  }

  /* ---------- screen 1a: one area's problems ---------- */

  /* The home screen is the map and nothing else, so the list lives here,
     one area at a time. Three levels, each saying only what is needed to
     choose the next: the map says where the gaps are, this screen says
     which problems sit in one place, and the record says everything.

     The card carries two things — the problem, and whether the data
     exists. The affected-women sentence, the source and the origin badge
     are on the record, where the source is a link a researcher can follow;
     inside a button it could only ever be printed, because a link may not
     be nested in one. §8.1 asks that every claim show where it came from,
     and the claim is the record, not the card that points at it. */

  /* The area the reader is inside, or null when the record was opened
     straight from a pin. Set by openArea and openProblem rather than by
     their callers, so the route and the Back button cannot disagree. */
  var currentArea = null;

  function findArea(area) {
    return areaGroups().filter(function (group) {
      return group.area === area;
    })[0];
  }

  function openArea(area) {
    var group = findArea(area);
    if (!group) { return; }

    currentArea = area;

    var point = MAP_POINTS[area];
    setValue(el("area-kind"), point && point.kind === "systemic"
      ? "Whole body — not located in one place"
      : "Area of the body");

    setValue(el("area-heading"), group.area);

    /* One problem means the card below prints this very sentence, a few
       lines lower — two identical strings 40px apart read as a fault. The
       line earns its place only when it is totalling several cards up. */
    var areaCount = el("area-count");
    areaCount.hidden = group.problems.length === 1;
    areaCount.textContent = areaCount.hidden
      ? "" : gapSentenceFor(group.needs);

    var list = el("area-problem-list");
    list.textContent = "";

    group.problems.forEach(function (problem) {
      var item = document.createElement("li");

      /* A real button, so it is tab-reachable, works on Enter and Space,
         and gets the global focus ring without extra code (§8.2). */
      var card = make("button", "problem-card");
      card.type = "button";

      /* Spans, not paragraphs: a button may only contain phrasing
         content. They are laid out as blocks in CSS. */
      card.appendChild(
        makeValue("span", "card-title", cardTitle(problem.title))
      );
      card.appendChild(make("span", "count", gapSentence(problem)));

      /* The badge marks the exception rather than the rule. Every record
         in the seed is "sourced", so a badge on every card would say the
         same thing and distinguish nothing. A placeholder, or a gap this
         platform inferred itself, is what a reader has to be warned
         about, and that still carries its badge. */
      if (flaggedOrigin(problem)) {
        card.appendChild(originBadge(problem));
      }

      /* The visible title is shortened; the button's name is not, so a
         reader who cannot see the card still gets the claim in full, with
         the status and any warning that belongs with it. */
      card.setAttribute("aria-label", [
        problem.title,
        gapSentence(problem),
        flaggedOrigin(problem) ? originWord(problem) : ""
      ].filter(hasText).join(" — "));

      card.addEventListener("click", function () {
        go(recordRoute(problem));
      });

      item.appendChild(card);
      list.appendChild(item);
    });

    show("screen-area");
  }


  /* ---------- screen 2: the record, in full ---------- */

  function openProblem(problemId) {
    var problem = findProblem(problemId);
    if (!problem) { return; }

    /* Where Back goes. An area holding one problem is a screen showing one
       card whose two lines this screen then opens with - the same list of
       one that screen 3 was, before it was removed on 18 Sep. So a pin on
       such an area opens the record, and the way back from it is the map. */
    var group = findArea(problem.area);
    currentArea = (group && group.problems.length > 1) ? problem.area : null;

    var back = el("detail-back");
    back.textContent = currentArea
      ? "← Back to the area" : "← Back to the map";

    setValue(el("detail-heading"), problem.title);
    setValue(el("detail-summary"), problem.summary);
    setValue(el("detail-affected"), problem.affected_women);

    /* The badge marks the exception, which is the rule the cards have always
       followed and this screen did not: every record in the seed is
       "sourced", so it printed the same five words on all eleven, directly
       above the heading, and the footer says it once for the whole seed
       anyway. A placeholder or a gap this platform inferred still carries
       its warning here. */
    var originSlot = el("detail-origin");
    originSlot.textContent = "";
    originSlot.hidden = !flaggedOrigin(problem);

    if (!originSlot.hidden) {
      originSlot.appendChild(originBadge(problem, "p"));
    }

    fillSourceSlot("detail-source", problem.source);

    renderNeeds(problem);
    show("screen-detail");
  }

  /* Every data need, in full, on the record itself.

     There used to be a screen between these two: this list held one
     clickable summary per need, and opening one showed the claim, the
     check and the design on a screen of its own. Every problem in the
     seed carries exactly one data need, so that list was a list of one
     and the click revealed what the reader had already been shown the top
     of — a level with nothing in it.

     A problem may carry several needs (§5), and several stack here as
     blocks rather than becoming a menu. Reading three in a row is less
     work than opening and closing three screens. */
  /* One need is not a list, and it was being given the scaffolding of one:
     a section heading, a count line, a <ul>, and a bordered card inside it —
     four levels of nesting around a single item, on all eleven records. The
     level appears when it has something to hold, which is the same rule the
     area screen and the removed screen 3 are now built on.

     The card frame goes with it. Status still carries colour, shape and word
     (8.2) on the badge, which is where it was always carried; what the
     card's coloured edge added was a second frame for the eye to enter. */
  function renderNeeds(problem) {
    var slot = el("need-list");
    var needs = problem.data_needs;

    slot.textContent = "";

    if (needs.length === 1) {
      slot.className = "need-flat";
      renderNeed(slot, problem, needs[0], true);
    } else {
      slot.className = "need-several";
      slot.appendChild(make("h2", null, "Data needed to solve it"));
      slot.appendChild(make("p", "count", gapSentence(problem)));

      var list = make("ul", "need-list-items");

      needs.forEach(function (need) {
        var item = document.createElement("li");

        item.className = "need-block";
        item.setAttribute("data-status", need.status);
        renderNeed(item, problem, need, false);
        list.appendChild(item);
      });
      slot.appendChild(list);
    }

    renderGuidanceFootnote(problem);
  }

  /* Said once, at the foot of the screen, and only while it is true of
     something on it. 8.1 asks the app to state what it does not know; it
     does not ask it to say so in every card. */
  function renderGuidanceFootnote(problem) {
    var slot = el("detail-footnote");
    var silent = problem.data_needs.filter(function (need) {
      return !need.collection_guidance ||
        !hasText(need.collection_guidance.note);
    }).length;

    slot.textContent = "";
    slot.hidden = silent === 0;

    if (silent === 0) { return; }

    slot.appendChild(make("p", null,
      problem.data_needs.length === 1
        ? "The source does not say how to collect this data. Nothing is invented here."
        : silent + " of these data needs cite a source that does not say how to collect them. Nothing is invented here."));
  }

  /* One need's contents, appended into whatever holds them. `flat` means
     the record carries a single need, so this IS the second half of the
     screen and its description is the heading for it; otherwise it is one
     card among several and the description is a heading inside that card.

     The description is the data need — the field this whole register is
     about — so it is never dropped. What was dropped is the generic
     heading that used to sit above it saying "Data needed to solve it",
     which is what made the screen state its thesis twice: an h1 naming the
     problem and, eighty pixels lower, an h3 naming the same thing again
     under a heading that named neither. */
  function renderNeed(item, problem, need, flat) {
    item.appendChild(statusBadge(need.status));
    item.appendChild(makeValue(
      flat ? "h2" : "h3", "need-description", need.description
    ));

    /* Plain prose. It was the only field in a <dl> at this level, under an
       uppercase letterspaced <dt> — the second of three such captions on
       one screen, each at a different depth and meaning something else. */
    if (hasText(need.why_it_matters)) {
      item.appendChild(make("p", "need-why", need.why_it_matters));
    }

    /* A collected need has no gap to answer for: the data exists, and the
       only thing worth saying is where. */
    if (need.status === "collected") {
      var exists = existingDataLine(need);
      if (exists) { item.appendChild(exists); }
      item.appendChild(datasetNode(need));
      item.appendChild(
        make("p", "need-note", "No new collection needed for this item.")
      );
      return;
    }

    /* Provenance in the order a reader challenges it: who said the data is
       missing, then whether anyone has collected it since, then the limit
       of that check. */
    item.appendChild(gapEvidenceNode(problem, need));

    /* The check and the limit of the check are one idea, and they were two
       containers stacked on a third. A reader deciding whether to run a
       study has to weigh what the search found and what it could not see at
       the same moment, so they share a box. */
    var check = make("div", "check-block");
    check.appendChild(verificationNode(need));

    if (need.status === "missing") {
      check.appendChild(shallowCheckNote(problem, need));
    }
    item.appendChild(check);

    if (need.status !== "missing") {
      var note = existingDataLine(need);
      if (note) { item.appendChild(note); }
      item.appendChild(datasetNode(need));
    }

    /* What the source said about collecting it, on the three records where
       it said anything. The other eight are answered once, in the footnote
       renderNeeds() puts at the foot of the screen. */
    var guidance = guidanceNode(problem, need);
    if (guidance) { item.appendChild(guidance); }

    var design = designNode(problem, need);
    if (design) { item.appendChild(design); }
  }

  /* "What exists" for a need that has some data behind it. The label
     stays outside the value so an unstated note is marked as unknown
     without the label being swallowed by it.

     Returns null when the field is empty, and the caller drops the line.
     The intake run writes existing_data_note as "" on every record, so
     rendering it unconditionally put "What exists: Not established"
     directly above "Where the data is:" and a full paragraph describing
     exactly what exists — the screen contradicting itself on every
     partial record. §8.1 asks that the app never leave a silent blank,
     not that it say "not established" about something the next line
     answers: datasetNode() always renders and says so itself when there
     is no dataset either. Nothing goes unstated by dropping this. */
  function existingDataLine(need, tag) {
    if (!hasText(need.existing_data_note)) { return null; }

    var line = make(tag || "p", "need-note");
    line.appendChild(make("span", null, "What exists: "));
    line.appendChild(make("span", null, need.existing_data_note));
    return line;
  }

  /* A field whose value is a list of things to collect. An empty or
     missing list says so rather than rendering an empty bullet (§8.1).
     The optional hint explains a label that is not self-evident. */
  function listField(label, items, hint) {
    var wrapper = make("div", "request-field");
    wrapper.appendChild(make("dt", null, label));

    var dd = document.createElement("dd");

    if (!items || !items.length) {
      dd.appendChild(make("span", "unknown", UNKNOWN));
      wrapper.appendChild(dd);
      return wrapper;
    }

    var list = make("ul", "field-list");
    items.forEach(function (item) {
      list.appendChild(makeValue("li", null, item));
    });
    dd.appendChild(list);

    if (hasText(hint)) {
      dd.appendChild(make("p", "field-hint", hint));
    }

    wrapper.appendChild(dd);
    return wrapper;
  }

  /* Where the form names a published instrument, the instrument is
     linked. Citing a validated tool is a stronger answer than inventing
     a questionnaire, and the link is how a researcher acts on it. */
  /* The model answers this field with the instrument's NAME far more often
     than with a URL — "Lake Louise AMS Score", "DN4", "ICIQ-UI SF". Gating
     the whole line on isUrl() therefore threw away the answer on seven of
     the eleven designs, which is the one place §5a's "instruments over
     invented forms" rule is visible to a reader. A name is linked where it
     is a URL and printed where it is not; either way it is shown. */
  function field(label, value, instrumentSource) {
    var wrapper = make("div", "request-field");
    wrapper.appendChild(make("dt", null, label));

    var dd = makeValue("dd", null, value);
    if (hasText(instrumentSource)) {
      dd.appendChild(make("span", "instrument-label", "Instrument: "));

      if (isUrl(instrumentSource)) {
        var link = make("a", "instrument", sourceLabel(instrumentSource));
        link.href = instrumentSource;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        dd.appendChild(link);
      } else {
        dd.appendChild(make("span", "instrument", instrumentSource));
      }
    }
    wrapper.appendChild(dd);
    return wrapper;
  }

  /* ---------- screen 4: about ---------- */

  /* The About screen is static markup and reads nothing from the seed. The
     one thing it does not hold is its own Built/Planned labels: those are
     stamped in from BUILD_STATUS so the list and the diagram cannot drift
     apart, and so tonight's flip is one edit.

     Two hooks, because two kinds of element need the status: [data-build]
     takes the word as text, [data-build-shape] is a shape with no text of
     its own (the diagram's node boxes) and takes only the state. Both end
     up carrying data-build-state, which is what the CSS hangs the colour
     and the border style on. */
  function applyBuildStatus() {
    document.querySelectorAll("[data-build]").forEach(function (node) {
      var state = BUILD_STATUS[node.getAttribute("data-build")] || "planned";

      node.textContent = BUILD_WORD[state];
      node.setAttribute("data-build-state", state);
    });

    document.querySelectorAll("[data-build-shape]").forEach(function (node) {
      var key = node.getAttribute("data-build-shape");

      node.setAttribute("data-build-state", BUILD_STATUS[key] || "planned");
    });
  }

  /* Stage 1 expands to the intake pipeline. A disclosure inside the screen
     and not a fourth route: the router does not hear about it.

     It is a real <button>, so Enter and Space arrive for free and the focus
     ring comes from the global rule; all this adds is aria-expanded and the
     panel's hidden attribute, kept in step with each other (§8.2). */
  function setupDisclosure() {
    var toggle = el("intake-toggle");
    var panel = el("intake-panel");

    if (!toggle || !panel) { return; }

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";

      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      panel.hidden = open;
    });
  }

  /* ---------- screen 1a: body map ---------- */

  var SVG_NS = "http://www.w3.org/2000/svg";

  /* make() builds HTML elements. An SVG child created that way is an inert
     HTMLUnknownElement that never paints, so it needs the namespace. Same
     shape as make() so the two read alike. */
  function svgMake(tag, className, text) {
    var node = document.createElementNS(SVG_NS, tag);
    if (className) { node.setAttribute("class", className); }
    if (text) { node.textContent = text; }
    return node;
  }

  function attrs(node, map) {
    Object.keys(map).forEach(function (key) {
      node.setAttribute(key, map[key]);
    });
    return node;
  }

  /* Totals across every problem, computed from the statuses for the same
     reason gapSentence() is (§12.16): the strip on screen 1 and the cards
     below it must not be able to disagree. */
  function totals() {
    var sum = { needs: 0, missing: 0, partial: 0, collected: 0 };

    DATA.problems.forEach(function (problem) {
      sum.needs += problem.data_needs.length;
      sum.missing += countStatus(problem, "missing");
      sum.partial += countStatus(problem, "partial");
      sum.collected += countStatus(problem, "collected");
    });
    return sum;
  }

  function renderGapSummary() {
    var sum = totals();
    var slot = el("gap-summary");
    slot.textContent = "";

    /* Areas are the denominator, because they are what the map shows. The
       problem count is named only when it differs from the number of data
       needs — records from the intake run carry one need each, and "11
       data needs across 11 problems" says the same number twice. */
    var problems = DATA.problems.length;
    var areas = areaGroups().length;

    var count = make("p", "summary-count");
    count.appendChild(make("strong", null, String(sum.needs)));

    if (sum.needs === problems) {
      count.appendChild(make("span", null, " data needs across "));
    } else {
      count.appendChild(make("span", null, " data needs in "));
      count.appendChild(make("strong", null, String(problems)));
      count.appendChild(make("span", null, " problems, across "));
    }

    count.appendChild(make("strong", null, String(areas)));
    count.appendChild(make("span", null, areas === 1 ? " area" : " areas"));
    slot.appendChild(count);

    /* The bar is a proportion at a glance and nothing else, so it is hidden
       from assistive tech; the key below it carries the same figures as
       text (§8.2). */
    var bar = make("div", "summary-bar");
    bar.setAttribute("aria-hidden", "true");

    /* Only statuses that have records get a segment. The segments are
       separated by a gap so the boundary between two dark warm colours is
       visible at all, and a zero-width segment would still take its gap —
       a stray 2px notch at the end of the bar with nothing on either side
       of it. Same filter, and the same reason, as statusBar() on the map.

       An empty seed divides by zero and paints every segment "NaN%". The
       seed is never empty today, but the banner and the counts strip are
       the two things written to survive one. */
    ["missing", "partial", "collected"].forEach(function (status) {
      if (!sum[status] || !sum.needs) { return; }

      var seg = make("span", "summary-seg");
      seg.setAttribute("data-status", status);
      seg.style.width = (sum[status] / sum.needs * 100) + "%";
      bar.appendChild(seg);
    });
    slot.appendChild(bar);

    /* A status with no records is left out. No record is "collected" any
       more (SPEC §9), and a permanent "0 collected" is noise rather than
       information. */
    var key = make("p", "summary-key");
    ["missing", "partial", "collected"].forEach(function (status) {
      if (!sum[status]) { return; }

      var item = make("span", "summary-key-item");
      item.setAttribute("data-status", status);
      item.appendChild(make("strong", null, String(sum[status])));
      item.appendChild(make("span", null, " " + STATUS_WORD[status].toLowerCase()));
      key.appendChild(item);
    });
    slot.appendChild(key);
  }

  /* Every coordinate here was measured by hand, with isPointInFill()
     hit-testing against the silhouette, and is valid only for the
     transform in index.html. No agent can produce one, so they are kept
     keyed by area rather than living only inside a record: a new record
     that names a known area gets its marker for free, and clearing the
     seed can no longer take the map with it.

     A record that carries its own map_point still wins. An area that is
     not in this table simply has no pin — the problem still appears in
     the list below, which is the honest state, not a broken one. */
  var MAP_POINTS = {
    "Maternal health":       { kind: "site",     x: 408, y: 248, side: "right", label_y: 330 },
    "Cardiovascular health": { kind: "site",     x: 447, y: 188, side: "right", label_y: 170 },
    "Pelvic health":         { kind: "site",     x: 400, y: 306, side: "left",  label_y: 250 },
    "Chronic pain":          { kind: "site",     x: 455, y: 340, side: "right", label_y: 490 },
    "Pharmacology":          { kind: "systemic", x: 334, y: 555, side: "left",  label_y: 570 },
    "Reproductive health":   { kind: "site",     x: 436, y: 312, side: "left",  label_y: 410 }
  };

  /* Re-measured 18 Sep. Two markers had been placed by eye and failed the
     rule above. Reproductive health sat at x 480, which at hip height is
     the empty gap between the torso and the arm — a site marker floating
     off the body, which is the false claim §7.6 forbids. Pelvic health sat
     at 405, close enough to a notch in the outline that two of its eight
     edge points fell outside. Both were moved to points whose centre and
     all eight edges hit-test inside the fill, and no two pins are now
     closer than their halos.

     Hit-testing is only valid at the WIDE viewBox: getCTM() folds in the
     viewBox transform, so the same coordinates measured under MAP_NARROW
     come back wrong. Measure at 880×672 or not at all.

     Moving a pin moves its leader line, and a leader is as capable of
     running straight through a neighbouring pin as a pin is of sitting
     off the body. The first attempt at this fix did exactly that, twice.
     So label_y and side are measured too, against two rules: every leader
     clears every other pin's centre by at least 14px (a pin's radius is
     8), and two labels in the same column never sit closer than 62px,
     which is the height of a label block.

     WITHIN those rules the labels are laid out for composition, because
     five of the six pins are anatomically crowded into the torso and
     labels placed next to their own pins bunch into the top third of the
     frame with Pharmacology stranded at the bottom. Each column now
     carries three labels 160px apart, and the two columns are staggered
     by 80px, so the eye reads them as one alternating sequence down the
     figure. The search that produced these values hit every target
     exactly, with 31px of leader clearance to spare.

     A pin labels to whichever side keeps it clear, not to the side it
     sits on: Pelvic health is left of the centreline and labels left,
     Maternal health labels right. Neither is a claim about the body — the
     pin is the claim, the label is just typography. Re-check both rules
     together after any change here. */

  /* Where a leader line turns before running out to its label. Computed,
     not stored: only the side varies. */
  function elbowX(side) { return side === "left" ? 345 : 556; }
  function labelX(side) { return side === "left" ? 258 : 622; }

  /* The leader starts on the pin's edge rather than its centre, so no line
     appears to grow out from under the dot. */
  function leaderStart(point, radius) {
    var dx = elbowX(point.side) - point.x;
    var dy = (point.label_y + 6) - point.y;
    var length = Math.sqrt(dx * dx + dy * dy) || 1;
    var out = radius + 4;

    return [point.x + dx / length * out, point.y + dy / length * out];
  }

  /* The three statuses as one 90px bar. Widths come from the same counts as
     the sentence beside them, so the bar cannot contradict the words. */
  function statusBar(needs, x, y) {
    var group = svgMake("g", "mark-bar");
    var total = needs.length;
    var gap = 2;

    var present = ["missing", "partial", "collected"].filter(function (status) {
      return countIn(needs, status) > 0;
    });

    var span = 90 - gap * Math.max(0, present.length - 1);
    var offset = 0;

    present.forEach(function (status) {
      var width = countIn(needs, status) / total * span;
      var rect = svgMake("rect");

      attrs(rect, {
        x: x + offset,
        y: y,
        width: width,
        height: 6,
        rx: 3,
        "data-status": status
      });
      group.appendChild(rect);
      offset += width + gap;
    });
    return group;
  }

  /* One group per AREA: pin, leader line and label highlight and activate
     together. An area holds however many problems sit in it, and the
     sentence and bar count every data need across them — so two problems
     in Maternal health are one pin reading "2 of 2 data needs missing",
     not two pins with the same name. Every mark is a real tab stop.
     Activating it reveals that area's problems in the list below. */
  function renderMap(isNarrow) {
    var marks = el("map-marks");
    marks.textContent = "";

    /* Pinned areas only, so the number a pin carries is its position among
       the pins and not among all areas. An area with no measured
       coordinate is not an error — renderUnpinned() lists it instead. */
    pinnedGroups().forEach(function (group, index) {
      var point = MAP_POINTS[group.area];
      var radius = point.r || 8;
      var sentence = gapSentenceFor(group.needs);
      var anchor = point.side === "left" ? "end" : "start";
      var count = group.problems.length;

      var mark = svgMake("g", "map-mark");
      mark.setAttribute("data-kind", point.kind);

      /* Under 640px the figure is a picture and the numbered legend below it
         is the control. Six areas cannot each be given a 48px touch target
         on a 330px-wide torso without moving pins off the body parts they
         name, which 7.6 forbids - Pelvic health and Reproductive health sit
         36.5px apart, Reproductive health and Chronic pain 33.8px, against
         hit circles 48px across. Overlapping targets are worse than none:
         the sibling drawn last silently takes the tap, so pressing Pelvic
         health opened Reproductive health over much of its own pin.

         The clearance rule measured at MAP_POINTS guarded the 16-unit halo,
         not the 24-unit hit circle this function adds, which is how the two
         came to disagree. */
      if (!isNarrow) {
        attrs(mark, {
          role: "button",
          tabindex: "0",
          "aria-label": group.area + " — " + count +
            (count === 1 ? " problem, " : " problems, ") + sentence
        });
      }

      var start = leaderStart(point, radius);
      var leader = svgMake("polyline", "mark-leader");
      leader.setAttribute("points", [
        start[0].toFixed(1) + "," + start[1].toFixed(1),
        elbowX(point.side) + "," + (point.label_y + 6),
        labelX(point.side) + "," + (point.label_y + 6)
      ].join(" "));
      mark.appendChild(leader);

      /* An invisible hit area. The pin renders about 33px across on a
         phone, which clears WCAG 2.2 AA's 24px floor but is well under the
         44px Apple and Android both ask for — and on a phone the pins are
         the only control on the page. fill is a transparent COLOUR rather
         than "none", because "none" is not hit-tested. */
      if (!isNarrow) {
        var hit = svgMake("circle", "mark-hit");
        attrs(hit, { cx: point.x, cy: point.y, r: radius + 16 });
        mark.appendChild(hit);
      }

      var halo = svgMake("circle", "mark-halo");
      attrs(halo, { cx: point.x, cy: point.y, r: radius + 8 });
      mark.appendChild(halo);

      var pin = svgMake("circle", "mark-pin");
      attrs(pin, { cx: point.x, cy: point.y, r: radius });
      mark.appendChild(pin);

      /* Shown only under 640px, where the labels are gone and the numbered
         legend takes over. */
      var number = svgMake("text", "mark-num", String(index + 1));
      attrs(number, { x: point.x, y: point.y + 4, "text-anchor": "middle" });
      mark.appendChild(number);

      var title = svgMake("text", "mark-title", group.area);
      attrs(title, {
        x: labelX(point.side), y: point.label_y, "text-anchor": anchor
      });

      /* The qualifier the legend has carried under 640px since the ring
         caption was dropped. At desktop width nothing said it, so the one
         pin on the ring sat beside the ankles looking like an ankle.
         Non-breaking spaces: SVG collapses ordinary leading whitespace. */
      if (point.kind === "systemic") {
        title.appendChild(svgMake("tspan", "mark-systemic",
          " · whole body"));
      }
      mark.appendChild(title);

      var line = svgMake("text", "mark-count", sentence);
      attrs(line, {
        x: labelX(point.side), y: point.label_y + 20, "text-anchor": anchor
      });
      mark.appendChild(line);

      mark.appendChild(statusBar(
        group.needs,
        point.side === "left" ? labelX(point.side) - 90 : labelX(point.side),
        point.label_y + 28
      ));

      if (!isNarrow) {
        mark.addEventListener("click", function () {
          go(groupRoute(group));
        });

        /* A <g> is not a button, so Enter and Space are wired by hand to
           match what the problem cards get for free. */
        mark.addEventListener("keydown", function (event) {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            go(groupRoute(group));
          }
        });
      }

      marks.appendChild(mark);
    });
  }

  /* An area can hold several problems, so a pin still cannot open one of
     them — it would have to pick, and picking would hide the rest. It
     opens the AREA, which is the thing the pin actually stands for.

     This used to scroll to a heading in a list below the map. The list is
     gone: the home screen is the map, and a pin is a route rather than an
     anchor. The mouse path and the keyboard path still end in the same
     place, because they call the same function. */

  /* Under 640px the side labels do not fit. The pins carry numbers and
     this list carries the words — the same areas, in the same order. */
  function legendButton(group) {
    var button = make("button", "legend-item");
    button.type = "button";

    var name = make("span", "legend-area", group.area);

    /* A systemic pin sits on the ring rather than on the body, and under
       640px it has no label — just a number beside the shins on a faint
       dashed ellipse, which reads as a stray dot. The ring used to carry a
       caption saying so to everyone all the time; this says it once, to
       the one area it is about, where the words already are. */
    var point = MAP_POINTS[group.area];
    if (point && point.kind === "systemic") {
      name.appendChild(make("span", "legend-systemic", "whole body"));
    }

    button.appendChild(name);
    button.appendChild(make("span", "legend-count",
      gapSentenceFor(group.needs)));

    button.addEventListener("click", function () { go(groupRoute(group)); });
    return button;
  }

  function renderMapLegend() {
    var list = el("map-legend");
    list.textContent = "";

    /* Pinned areas only, in the same order and therefore with the same
       numbers as the pins. An unpinned area used to consume a number here
       and on the figure without drawing anything, so the pins could count
       1, 2, 4 — invisible today because every area has a coordinate, and
       wrong the moment one does not. */
    pinnedGroups().forEach(function (group) {
      var item = document.createElement("li");
      item.appendChild(legendButton(group));
      list.appendChild(item);
    });

    renderUnpinned();
  }

  /* The map is now the only way in, so an area with no measured
     coordinate would be unreachable rather than merely unpinned — the app
     would silently hide records, which §8.1 does not allow. These are
     listed at every width, under a line that says why they are there.
     Empty today, and it renders nothing when empty. */
  function renderUnpinned() {
    var slot = el("map-unpinned");
    slot.textContent = "";

    var groups = unpinnedGroups();
    slot.hidden = groups.length === 0;
    if (!groups.length) { return; }

    slot.appendChild(make("p", "unpinned-note",
      "Not yet placed on the figure — no measured coordinate for " +
      (groups.length === 1 ? "this area" : "these areas") + " yet:"));

    var list = make("ul", "unpinned-list");
    groups.forEach(function (group) {
      var item = document.createElement("li");
      item.appendChild(legendButton(group));
      list.appendChild(item);
    });
    slot.appendChild(list);
  }

  /* The wide viewBox is built around the label columns either side of the
     figure. Under 640px those are gone, so the frame crops to the ring —
     left wide, the figure renders about 90px across and reads as nothing.
     Kept in JS because a viewBox is an attribute, not a style. */
  /* Content runs from y 25 to y 625. The frame was 672 tall to leave room
     for the ring caption underneath; with the caption gone that was 47px
     of dead space under the figure against 25px above it, which reads as
     the map having sagged. 650 puts 25 above and 25 below. */
  var MAP_WIDE = "0 0 880 650";
  /* Same trim as MAP_WIDE, for the same reason: the caption's old line at
     y 650 left 40px under the figure against 10px above it. */
  var MAP_NARROW = "265 15 330 620";

  function fitMap(isNarrow) {
    var svg = document.querySelector(".map-svg");

    if (svg) {
      svg.setAttribute("viewBox", isNarrow ? MAP_NARROW : MAP_WIDE);

      /* Where the legend is the control, the figure is taken out of the
         accessibility tree rather than reading every area name twice. It
         holds nothing focusable at that width, so nothing is trapped
         behind the attribute. */
      if (isNarrow) { svg.setAttribute("aria-hidden", "true"); }
      else { svg.removeAttribute("aria-hidden"); }
    }

    /* The marks are built per width, not restyled: at this one they are not
       controls at all. */
    renderMap(isNarrow);
  }

  function watchMapWidth() {
    var query = window.matchMedia("(max-width: 640px)");

    fitMap(query.matches);
    query.addEventListener("change", function (event) {
      fitMap(event.matches);
    });
  }

  /* ---------- start ---------- */

  /* The banner used to be a fixed sentence claiming every record was
     demo data. Once one problem is sourced that sentence is false, so it
     is computed from the seed and disappears when the swap is finished
     (§8.1: demo data is labelled on every screen, and only while true). */
  function renderProvenanceSummary() {
    var total = DATA.problems.length;
    var demo = DATA.problems.filter(function (p) {
      return p.is_demo;
    }).length;

    var banner = el("demo-banner");
    banner.textContent = "";
    banner.hidden = (demo === 0);

    if (demo > 0) {
      banner.appendChild(make("strong", null, "Demo data"));
      banner.appendChild(make("span", null,
        " — " + demo + " of " + total + " problems below are illustrative " +
        "placeholders, not real findings. Each record says which it is."
      ));
    }

    el("footer-provenance").textContent = demo === 0
      ? "Every record is sourced from published research."
      : demo + " of " + total + " records are generated demo data; the rest " +
        "cite published sources.";
  }

  function init() {
    /* Every Back and every header button names a screen; routeForScreen
       turns that into the address for it, and the hash does the rest. One
       navigation idea, as before - it just writes the address down now. */
    document.querySelectorAll("[data-back], [data-goto]").forEach(
      function (button) {
        button.addEventListener("click", function () {
          go(routeForScreen(
            button.getAttribute("data-back") ||
            button.getAttribute("data-goto")
          ));
        });
      }
    );

    applyBuildStatus();
    setupDisclosure();

    renderProvenanceSummary();
    renderGapSummary();
    renderMapLegend();
    watchMapWidth();

    window.addEventListener("hashchange", renderRoute);

    /* Only when the address asks for something. On a plain load the home
       screen is already the one in the markup, and show() moves focus into
       a screen - right after a click, wrong before the reader has made one.
       A deep link is a click, so it gets the focus move. */
    if (window.location.hash && window.location.hash !== ROUTE_HOME) {
      renderRoute();
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
