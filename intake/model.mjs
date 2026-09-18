/* The one place the intake run talks to the model.

   Raw HTTP on purpose: SPEC §13 says no dependencies and no build step,
   and intake/README.md makes that a claim about this folder too. Four
   call shapes do not earn an SDK and a node_modules directory.

   The key is read from the environment and never written anywhere. */

const ENDPOINT = "https://api.anthropic.com/v1/messages";
const VERSION = "2023-06-01";

/* Filtering is a yes/no read of an abstract — the cheapest model that can
   do it is the right one.

   The rest ran on claude-opus-5 and now runs on Sonnet 5, at $2/$10 per
   million rather than $5/$25. The judgement that suffers most from this
   is verify's: deciding whether a loosely related study counts as the
   missing data is the call the register's credibility rests on. Every
   record is read by a human before it enters data.js, which is what makes
   the trade acceptable. Put claude-opus-5 back here to undo it. */
export const FILTER_MODEL = "claude-haiku-4-5";
export const WORK_MODEL = "claude-sonnet-5";

/* Per-million-token list prices, for the running total the script prints.
   An estimate for steering the run, not an invoice. */
const PRICES = {
  "claude-haiku-4-5": { input: 1.00, output: 5.00 },
  "claude-sonnet-5": { input: 2.00, output: 10.00 },
  "claude-opus-5": { input: 5.00, output: 25.00 }
};

export const spend = { calls: 0, input: 0, output: 0, dollars: 0 };

function recordSpend(model, usage) {
  if (!usage) { return; }
  const price = PRICES[model] || { input: 0, output: 0 };
  const input = usage.input_tokens || 0;
  const output = usage.output_tokens || 0;

  spend.calls += 1;
  spend.input += input;
  spend.output += output;
  spend.dollars += (input / 1e6) * price.input + (output / 1e6) * price.output;
}

export function spendLine() {
  return `${spend.calls} calls · ${spend.input} in / ${spend.output} out · ` +
         `about $${spend.dollars.toFixed(2)}`;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* Refusals are a live possibility here: the corpus is medical text about
   women's bodies, and a safety classifier declining mid-run would
   otherwise take the whole run down. `fallbacks: "default"` lets the API
   route the request rather than stop. */
const FALLBACK_BETA = "server-side-fallback-2026-07-01";
const SUPPORTS_FALLBACKS = new Set(["claude-opus-5", "claude-fable-5-1"]);

/* One request, with retries on the failures that are worth retrying.
   429 and 5xx are transient; 400 and 401 are bugs and must surface. */
export async function callModel({
  model,
  system,
  user,
  maxTokens = 2048,
  effort,
  schema,
  tools,
  attempts = 3
}) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Set it in this terminal:\n" +
      '  $env:ANTHROPIC_API_KEY = "sk-ant-..."'
    );
  }

  const body = {
    model,
    max_tokens: maxTokens,
    messages: [{ role: "user", content: user }]
  };

  if (system) { body.system = system; }
  if (tools) { body.tools = tools; }

  const outputConfig = {};
  if (effort) { outputConfig.effort = effort; }
  if (schema) { outputConfig.format = { type: "json_schema", schema }; }
  if (Object.keys(outputConfig).length > 0) { body.output_config = outputConfig; }

  const headers = {
    "x-api-key": key,
    "anthropic-version": VERSION,
    "content-type": "application/json"
  };

  /* Server-side fallbacks are an Opus-tier feature, so this is gated on
     the model rather than on "whatever WORK_MODEL happens to be" — the
     parameter would be rejected on Sonnet. The refusal check below still
     runs for every model. */
  if (SUPPORTS_FALLBACKS.has(model)) {
    headers["anthropic-beta"] = FALLBACK_BETA;
    body.fallbacks = "default";
  }

  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    let response;
    try {
      response = await fetch(ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      });
    } catch (networkError) {
      lastError = networkError;
      await sleep(attempt * 2000);
      continue;
    }

    if (response.ok) {
      const parsed = await response.json();
      recordSpend(parsed.model || model, parsed.usage);

      /* HTTP 200 does not mean the model answered. A decline arrives as a
         normal response with stop_reason "refusal", so it has to be read
         before the content is touched. */
      if (parsed.stop_reason === "refusal") {
        const why = (parsed.stop_details && parsed.stop_details.category) || "unstated";
        throw new RefusalError(`The model declined this request (${why}).`);
      }

      return parsed;
    }

    const problem = await response.text();

    if (response.status === 429 || response.status >= 500) {
      /* Respect the server's own pacing when it gives one. */
      const retryAfter = Number(response.headers.get("retry-after"));
      const wait = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : attempt * 2000;

      lastError = new Error(`HTTP ${response.status}: ${problem}`);
      console.log(`    ${response.status} — retrying in ${Math.round(wait / 1000)}s ` +
                  `(attempt ${attempt} of ${attempts})`);
      await sleep(wait);
      continue;
    }

    throw new Error(`HTTP ${response.status}: ${problem}`);
  }

  throw lastError || new Error("Request failed after retries.");
}

export class RefusalError extends Error {}

/* The response content is an array of blocks, and with a server tool in
   play most of them are not text. Joining only the text blocks is the
   whole of "what did it say". */
export function textOf(response) {
  return (response.content || [])
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();
}

/* With output_config.format the text block is the JSON document itself,
   so no fishing for fenced code blocks. */
export function jsonOf(response) {
  const text = textOf(response);

  /* Thinking tokens come out of max_tokens, so a budget that is too small
     truncates the JSON mid-string. That surfaces as a parse error, which
     reads like a model failure and is not one — name it instead. */
  if (response.stop_reason === "max_tokens") {
    throw new Error(
      "Response hit max_tokens before the JSON was complete. " +
      "Raise maxTokens for this step."
    );
  }

  try {
    return JSON.parse(text);
  } catch (parseError) {
    throw new Error("The model did not return parseable JSON:\n" + text.slice(0, 400));
  }
}

/* Every URL the model actually opened during a web-search call. These are
   the record's evidence that a check happened, so they are stored. */
export function searchSourcesOf(response) {
  const urls = [];

  for (const block of response.content || []) {
    if (block.type !== "web_search_tool_result") { continue; }

    /* A failed server tool returns an error object here, not a list —
       branch before indexing. */
    if (!Array.isArray(block.content)) { continue; }

    for (const result of block.content) {
      if (result.url) {
        urls.push({ url: result.url, title: result.title || null });
      }
    }
  }

  /* One entry per URL, first mention wins. */
  const seen = new Set();
  return urls.filter((entry) => {
    if (seen.has(entry.url)) { return false; }
    seen.add(entry.url);
    return true;
  });
}
