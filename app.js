/* Women's Data Gap — renders the three screens from the seed in data.js.
 * No framework, no build step (SPEC §13). */

(function () {
  "use strict";

  var STATUS_WORD = {
    collected: "Collected",
    partial: "Partial",
    missing: "Missing"
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

  /* §8.3 — numbers are always framed in words, and always computed from
     the statuses so Screen 1 cannot disagree with Screen 2 (§12.16). */
  function gapSentence(problem) {
    var total = problem.data_needs.length;
    var missing = problem.data_needs.filter(function (n) {
      return n.status === "missing";
    }).length;

    if (missing === 0) {
      return "All " + total + " data needs have data";
    }
    return missing + " of " + total + " data needs missing";
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

  /* Shows one screen and hides the others, then moves focus to its
     heading so a keyboard user lands in the new content (§12.9, §12.13).
     No reload and no history API — three screens do not need one. */
  function show(screenId) {
    SCREENS.forEach(function (id) {
      el(id).hidden = (id !== screenId);
    });

    var heading = el(screenId).querySelector("h1");
    if (heading) { heading.focus(); }
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
      card.appendChild(make("span", "eyebrow", problem.area));
      card.appendChild(make("span", "card-title", problem.title));
      card.appendChild(
        make("span", "affected-line", "Affected: " + problem.affected_women)
      );
      card.appendChild(make("span", "count", gapSentence(problem)));

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

    el("detail-area").textContent = problem.area;
    el("detail-heading").textContent = problem.title;
    el("detail-summary").textContent = problem.summary;
    el("detail-affected").textContent = problem.affected_women;
    el("detail-count").textContent = gapSentence(problem);

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

  /* A collected need has no collection request and says so plainly
     (§12.7). It is not a button: there is nothing to open. */
  function collectedNeed(need) {
    var item = document.createElement("li");

    item.appendChild(statusBadge(need.status));
    item.appendChild(make("p", "need-description", need.description));
    item.appendChild(make("p", "need-why", need.why_it_matters));

    if (need.existing_data_note) {
      item.appendChild(
        make("p", "need-note", "What exists: " + need.existing_data_note)
      );
    }
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
    button.appendChild(make("span", "need-description", need.description));
    button.appendChild(make("span", "need-why", need.why_it_matters));

    if (need.existing_data_note) {
      button.appendChild(
        make("span", "need-note", "What exists: " + need.existing_data_note)
      );
    }
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

    el("request-problem").textContent = problem.title;

    var card = el("request-card");
    card.textContent = "";

    var heading = make("p", "request-need", need.description);
    heading.appendChild(document.createElement("br"));
    heading.appendChild(statusBadge(need.status));
    card.appendChild(heading);

    var fields = document.createElement("dl");
    fields.appendChild(field("Which women", request.target_women));
    fields.appendChild(field("How to ask them", request.method));
    fields.appendChild(field("In what form", request.form));
    fields.appendChild(field("Why this data matters", need.why_it_matters));
    card.appendChild(fields);

    show("screen-request");
  }

  function field(label, value) {
    var wrapper = make("div", "request-field");
    wrapper.appendChild(make("dt", null, label));
    wrapper.appendChild(make("dd", null, value));
    return wrapper;
  }

  /* ---------- start ---------- */

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

    renderProblemList();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
