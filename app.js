/* Women's Data Gap — renders the three screens from the seed in data.js.
 * No framework, no build step (SPEC §13). */

(function () {
  "use strict";

  var STATUS_WORD = {
    collected: "Collected",
    partial: "Partial",
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

  function sourceLabel(source) {
    if (!hasText(source)) { return UNKNOWN; }
    if (source === "demo") { return "Generated demo data"; }
    if (isUrl(source)) {
      try {
        return new URL(source).hostname.replace(/^www\./, "");
      } catch (e) {
        return source;
      }
    }
    return source;
  }

  /* Plain text version, for use inside a card button: a link may not be
     nested inside a button. */
  function sourceText(source) {
    var span = make("span", "provenance", "Source: " + sourceLabel(source));
    if (!hasText(source)) { span.classList.add("unknown"); }
    return span;
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

    /* §8.1 — the source sits on the record. Inside a button it can only
       be named, because a link may not be nested in one; everywhere else
       it is the link a researcher actually follows. */
    if (isUrl(evidence.source)) {
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

  /* §8.3 — numbers are always framed in words, and always computed from
     the statuses so Screen 1 cannot disagree with Screen 2 (§12.16). */
  function gapSentence(problem) {
    var total = problem.data_needs.length;
    var missing = countStatus(problem, "missing");
    var partial = countStatus(problem, "partial");

    if (missing > 0) {
      return missing + " of " + total + " data needs missing";
    }

    /* §9 guarantees every problem has a missing need, so the branches
       below do not show in the seed. They exist because "nothing is
       missing" and "everything is collected" are different claims, and
       partial data must not be reported as data in hand. */
    if (partial > 0) {
      return "No data needs missing, " + partial + " of " + total + " partial";
    }
    return "All " + total + " data needs collected";
  }

  function countStatus(problem, status) {
    return problem.data_needs.filter(function (n) {
      return n.status === status;
    }).length;
  }

  /* Status badge: colour, shape and word together, so the status survives
     greyscale and colour blindness (§8.2, §12.11). The square is drawn in
     CSS on ::before; the word is real text. */
  function statusBadge(status) {
    var badge = make("span", "badge", STATUS_WORD[status]);
    badge.setAttribute("data-status", status);
    return badge;
  }

  /* ---------- navigation ---------- */

  var SCREENS = ["screen-problems", "screen-detail", "screen-request"];

  /* Shows one screen and hides the others, then moves focus into the new
     screen so a keyboard user lands in the new content (§12.9, §12.13).
     No reload and no history API — three screens do not need one.

     Focus goes to the section, not its heading: the back button sits
     above the heading, so focusing the heading would put Back behind the
     user and out of reach of a forward Tab. The section is labelled by
     its heading, so a screen reader still announces the screen name. */
  function show(screenId) {
    SCREENS.forEach(function (id) {
      el(id).hidden = (id !== screenId);
    });

    el(screenId).focus();
    window.scrollTo(0, 0);
  }

  /* ---------- screen 1: problem list ---------- */

  function renderProblemList() {
    var list = el("problem-list");
    list.textContent = "";

    DATA.problems.forEach(function (problem) {
      var item = document.createElement("li");

      /* A real button, so it is tab-reachable, works on Enter and Space,
         and gets the global focus ring without extra code (§8.2). */
      var card = make("button", "problem-card");
      card.type = "button";
      /* Spans, not paragraphs: a button may only contain phrasing
         content. They are laid out as blocks in CSS. */
      card.appendChild(makeValue("span", "eyebrow", problem.area));
      card.appendChild(makeValue("span", "card-title", problem.title));
      card.appendChild(
        hasText(problem.affected_women)
          ? make("span", "affected-line", "Affected: " + problem.affected_women)
          : makeValue("span", "affected-line", "")
      );
      card.appendChild(make("span", "count", gapSentence(problem)));
      card.appendChild(originBadge(problem));
      card.appendChild(sourceText(problem.source));

      card.addEventListener("click", function () {
        openProblem(problem.id);
      });

      item.appendChild(card);
      list.appendChild(item);
    });
  }

  /* ---------- screen 2: problem detail ---------- */

  var currentProblemId = null;

  function openProblem(problemId) {
    var problem = findProblem(problemId);
    if (!problem) { return; }

    currentProblemId = problemId;

    setValue(el("detail-area"), problem.area);
    setValue(el("detail-heading"), problem.title);
    setValue(el("detail-summary"), problem.summary);
    setValue(el("detail-affected"), problem.affected_women);
    el("detail-count").textContent = gapSentence(problem);

    var originSlot = el("detail-origin");
    originSlot.textContent = "";
    originSlot.appendChild(originBadge(problem, "p"));

    fillSourceSlot("detail-source", problem.source);

    renderNeeds(problem);
    show("screen-detail");
  }

  function renderNeeds(problem) {
    var list = el("need-list");
    list.textContent = "";

    problem.data_needs.forEach(function (need) {
      list.appendChild(
        need.status === "collected"
          ? collectedNeed(need)
          : openableNeed(problem, need)
      );
    });
  }

  /* "What exists" for a need that has some data behind it. The label
     stays outside the value so an unstated note is marked as unknown
     without the label being swallowed by it. */
  function existingDataLine(need, tag) {
    var line = make(tag || "p", "need-note");
    line.appendChild(make("span", null, "What exists: "));
    line.appendChild(makeValue("span", null, need.existing_data_note));
    return line;
  }

  /* A collected need has no collection request and says so plainly
     (§12.7). It is not a button: there is nothing to open. */
  function collectedNeed(need) {
    var item = document.createElement("li");

    item.appendChild(statusBadge(need.status));
    item.appendChild(makeValue("p", "need-description", need.description));
    item.appendChild(makeValue("p", "need-why", need.why_it_matters));

    /* Always shown for a collected need: if the seed does not say what
       exists, the screen says that rather than staying silent (§8.1). */
    item.appendChild(existingDataLine(need));
    item.appendChild(datasetNode(need));
    item.appendChild(
      make("p", "need-note", "No new collection needed for this item.")
    );

    return item;
  }

  /* Missing and partial needs open the collection request card. */
  function openableNeed(problem, need) {
    var item = document.createElement("li");
    item.className = "is-open";

    var button = make("button", "need-open");
    button.type = "button";
    button.setAttribute("data-status", need.status);

    /* Spans again — phrasing content only inside a button. */
    button.appendChild(statusBadge(need.status));
    button.appendChild(makeValue("span", "need-description", need.description));
    button.appendChild(makeValue("span", "need-why", need.why_it_matters));

    /* A partial need has some data, so what exists is always stated.
       A missing need has none, and there is nothing to describe. */
    if (need.status === "partial") {
      button.appendChild(existingDataLine(need, "span"));
      button.appendChild(datasetNode(need, "span"));
    }
    /* The status badge says "Missing". This says who established that,
       which is the claim a reader is entitled to challenge. */
    button.appendChild(gapEvidenceNode(problem, need, "span"));

    button.appendChild(
      make("span", "need-action", "See the collection request →")
    );

    button.addEventListener("click", function () {
      openRequest(problem.id, need.id);
    });

    item.appendChild(button);
    return item;
  }

  /* ---------- screen 3: collection request card ---------- */

  function openRequest(problemId, needId) {
    var problem = findProblem(problemId);
    var need = problem && findNeed(problem, needId);
    if (!need || !need.collection_request) { return; }

    var request = need.collection_request;

    setValue(el("request-problem"), problem.title);

    var card = el("request-card");
    card.textContent = "";

    var heading = makeValue("p", "request-need", need.description);
    heading.appendChild(document.createElement("br"));
    heading.appendChild(statusBadge(need.status));
    card.appendChild(heading);

    /* §4 question 4, in the order a study gets designed: who is studied,
       what is found out from them, in which breakdowns, and in what form
       the data comes back. "How to ask" was folded into the form: the
       delivery and the format are one answer, not two. */
    var fields = document.createElement("dl");
    fields.appendChild(field("Which women", request.target_women));
    fields.appendChild(listField(
      "What to find out from them", request.variables
    ));
    fields.appendChild(listField(
      "Broken down by",
      request.stratifiers,
      "Data collected without these cannot show what happens to which " +
      "women. The missing breakdown is the gap as often as the missing " +
      "study is."
    ));
    fields.appendChild(field(
      "In what form", request.form, request.instrument_source
    ));
    fields.appendChild(field("Why this data matters", need.why_it_matters));
    card.appendChild(fields);

    /* The specification below is this platform's own work in every case.
       What varies is whether the gap it answers was published by someone
       else or proposed here, so the card states both (§5a, §8.1). */
    if (need.status !== "missing") {
      card.appendChild(datasetNode(need));
    }
    card.appendChild(gapEvidenceNode(problem, need));

    var requestOrigin = el("request-origin");
    requestOrigin.textContent = "";
    requestOrigin.appendChild(originBadge(problem, "p"));

    fillSourceSlot("request-source", problem.source);

    show("screen-request");
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
  function field(label, value, instrumentSource) {
    var wrapper = make("div", "request-field");
    wrapper.appendChild(make("dt", null, label));

    var dd = makeValue("dd", null, value);
    if (isUrl(instrumentSource)) {
      var link = make("a", "instrument", sourceLabel(instrumentSource));
      link.href = instrumentSource;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      dd.appendChild(make("span", "instrument-label", "Instrument: "));
      dd.appendChild(link);
    }
    wrapper.appendChild(dd);
    return wrapper;
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

    var count = make("p", "summary-count");
    count.appendChild(make("strong", null, String(sum.needs)));
    count.appendChild(make("span", null, " data needs across "));
    count.appendChild(make("strong", null, String(DATA.problems.length)));
    count.appendChild(make("span", null, " problems"));
    slot.appendChild(count);

    /* The bar is a proportion at a glance and nothing else, so it is hidden
       from assistive tech; the key below it carries the same figures as
       text (§8.2). */
    var bar = make("div", "summary-bar");
    bar.setAttribute("aria-hidden", "true");

    ["missing", "partial", "collected"].forEach(function (status) {
      var seg = make("span", "summary-seg");
      seg.setAttribute("data-status", status);
      seg.style.width = (sum[status] / sum.needs * 100) + "%";
      bar.appendChild(seg);
    });
    slot.appendChild(bar);

    var key = make("p", "summary-key");
    ["missing", "partial", "collected"].forEach(function (status) {
      var item = make("span", "summary-key-item");
      item.setAttribute("data-status", status);
      item.appendChild(make("strong", null, String(sum[status])));
      item.appendChild(make("span", null, " " + status));
      key.appendChild(item);
    });
    slot.appendChild(key);
  }

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
  function statusBar(problem, x, y) {
    var group = svgMake("g", "mark-bar");
    var total = problem.data_needs.length;
    var gap = 2;

    var present = ["missing", "partial", "collected"].filter(function (status) {
      return countStatus(problem, status) > 0;
    });

    var span = 90 - gap * Math.max(0, present.length - 1);
    var offset = 0;

    present.forEach(function (status) {
      var width = countStatus(problem, status) / total * span;
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

  /* One group per problem: pin, leader line and label highlight and
     activate together. Every mark is a real tab stop with a real name, and
     opens the same screen the problem card below it opens (§12.9). */
  function renderMap() {
    var marks = el("map-marks");
    marks.textContent = "";

    DATA.problems.forEach(function (problem, index) {
      var point = problem.map_point;

      /* A problem with no point is not an error: it simply is not on the
         map yet, and the list below still carries it. */
      if (!point) { return; }

      var radius = point.r || 8;
      var sentence = gapSentence(problem);
      var anchor = point.side === "left" ? "end" : "start";

      var mark = svgMake("g", "map-mark");
      attrs(mark, {
        role: "button",
        tabindex: "0",
        "data-kind": point.kind,
        "aria-label": problem.area + " — " + sentence
      });

      var start = leaderStart(point, radius);
      var leader = svgMake("polyline", "mark-leader");
      leader.setAttribute("points", [
        start[0].toFixed(1) + "," + start[1].toFixed(1),
        elbowX(point.side) + "," + (point.label_y + 6),
        labelX(point.side) + "," + (point.label_y + 6)
      ].join(" "));
      mark.appendChild(leader);

      var halo = svgMake("circle", "mark-halo");
      attrs(halo, { cx: point.x, cy: point.y, r: radius + 8 });
      mark.appendChild(halo);

      var pin = svgMake("circle", "mark-pin");
      attrs(pin, { cx: point.x, cy: point.y, r: radius });
      mark.appendChild(pin);

      /* Shown only under 640px, where the labels are gone and the numbered
         legend takes over. */
      var number = svgMake("text", "mark-num", String(index + 1));
      attrs(number, {
        x: point.x, y: point.y + 4, "text-anchor": "middle"
      });
      mark.appendChild(number);

      var title = svgMake("text", "mark-title", problem.area);
      attrs(title, {
        x: labelX(point.side), y: point.label_y, "text-anchor": anchor
      });
      mark.appendChild(title);

      var count = svgMake("text", "mark-count", sentence);
      attrs(count, {
        x: labelX(point.side), y: point.label_y + 20, "text-anchor": anchor
      });
      mark.appendChild(count);

      mark.appendChild(statusBar(
        problem,
        point.side === "left" ? labelX(point.side) - 90 : labelX(point.side),
        point.label_y + 28
      ));

      mark.addEventListener("click", function () {
        openProblem(problem.id);
      });

      /* A <g> is not a button, so Enter and Space are wired by hand to
         match what the problem cards get for free. */
      mark.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openProblem(problem.id);
        }
      });

      marks.appendChild(mark);
    });
  }

  /* Under 640px the side labels do not fit. The pins carry numbers and this
     list carries the words — the same sentence, in the same order. */
  function renderMapLegend() {
    var list = el("map-legend");
    list.textContent = "";

    DATA.problems.forEach(function (problem) {
      if (!problem.map_point) { return; }

      var item = document.createElement("li");
      var button = make("button", "legend-item");
      button.type = "button";
      button.appendChild(make("span", "legend-area", problem.area));
      button.appendChild(make("span", "legend-count", gapSentence(problem)));

      button.addEventListener("click", function () {
        openProblem(problem.id);
      });

      item.appendChild(button);
      list.appendChild(item);
    });
  }

  /* The wide viewBox is built around the label columns either side of the
     figure. Under 640px those are gone, so the frame crops to the ring —
     left wide, the figure renders about 90px across and reads as nothing.
     Kept in JS because a viewBox is an attribute, not a style. */
  var MAP_WIDE = "0 0 880 672";
  var MAP_NARROW = "265 15 330 650";

  function fitMap(isNarrow) {
    var svg = document.querySelector(".map-svg");
    if (svg) { svg.setAttribute("viewBox", isNarrow ? MAP_NARROW : MAP_WIDE); }
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
    document.querySelectorAll("[data-back]").forEach(function (button) {
      button.addEventListener("click", function () {
        var target = button.getAttribute("data-back");

        /* Coming back from the request card, re-enter the problem that
           was open rather than whatever was rendered last. */
        if (target === "screen-detail" && currentProblemId) {
          openProblem(currentProblemId);
          return;
        }
        show(target);
      });
    });

    renderProvenanceSummary();
    renderGapSummary();
    renderMap();
    renderMapLegend();
    watchMapWidth();
    renderProblemList();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
