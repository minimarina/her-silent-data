/* Confirms ANTHROPIC_API_KEY is present and works, without printing it.
   Plain Node, no dependencies — SPEC §13 holds for the tooling too.

   Usage: node intake/check-key.mjs                                     */

const KEY = process.env.ANTHROPIC_API_KEY;

if (!KEY) {
  console.error("ANTHROPIC_API_KEY is not set in this terminal.");
  console.error("Set it in the tab you are running from:");
  console.error('  $env:ANTHROPIC_API_KEY = "sk-ant-..."');
  process.exit(1);
}

/* Shape only. Never the value, and never a prefix long enough to matter. */
console.log(`Key found: ${KEY.length} characters, starts "sk-ant-": ${KEY.startsWith("sk-ant-")}`);

const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "x-api-key": KEY,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json",
  },
  body: JSON.stringify({
    model: "claude-haiku-4-5",
    max_tokens: 16,
    messages: [{ role: "user", content: "Reply with the single word: ready" }],
  }),
});

const body = await response.json();

if (!response.ok) {
  /* The error body carries no secret, so it is safe to show in full —
     and the message is the whole diagnostic. */
  console.error(`\nHTTP ${response.status}`);
  console.error(JSON.stringify(body, null, 2));

  if (response.status === 401) {
    console.error("\n401 means the key was rejected. Re-copy it, or create a new one.");
  }
  if (response.status === 400 && JSON.stringify(body).includes("credit")) {
    console.error("\nThis usually means no credit on the account. Billing → Add credits.");
  }
  process.exit(1);
}

const said = body.content.map((block) => block.text || "").join("").trim();
const used = body.usage;

console.log(`\nWorking. The model said: ${said}`);
console.log(`Tokens: ${used.input_tokens} in, ${used.output_tokens} out.`);
console.log("Cost of this check: well under one cent.");
