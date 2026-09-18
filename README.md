# Women Data Gap Platform

A platform for researchers who want to help close the data gap on women,
but don't know which data to collect first.

For each problem, it answers four questions:

1. **What problem do women face?**
2. **What data is needed to solve it?**
3. **Has that data already been collected?**
4. **Has anyone collected it since the gap was named?**
5. **If not: which women should it come from, what should be found out
   from them, and in what form?**

Most gender data projects stop at "there is a gap." This one cites who
named the gap, searches the live web to see whether it has been closed
since, and — on request — drafts the study that would close it.

**The problem in one sentence:** researchers who want to close the gender
data gap don't know which data is missing most, or which women it has to
come from.

## Run it

Open `index.html` — double-click the file, or visit
<https://minimarina.github.io/women-data-gap-map/>.

There is no build step, no install and no server. Plain HTML, CSS and
JavaScript with no dependencies: three screens and one seed file do not
need a framework, and this way nothing can fail to build on submission day.

## Data

Every problem cites a published source, and every missing or partial data
need cites the authority that named the gap — WHO fact sheets and
guidelines, NICE research recommendations, the Lancet women and
cardiovascular disease Commission, the SAGER reporting guidelines, and
peer-reviewed systematic reviews. Sources are listed per problem in
`SPEC.md` §9, and every claim links to its source on the record itself.

One data need carries no gap citation, because no published source names
it. The app says so on that record rather than leaving it blank.

**The rule the register rests on: nothing is invented and stored.** A
record carries what its source said and nothing more. Where a source
itself specified how and from whom to collect, that is recorded and
cited; otherwise the field is `null`, which is the normal case. The
validator rejects a guidance block with no source, so the rule is
enforced in code rather than promised here.

**What the platform generates, it labels and keeps out of the register.**
Pressing *Generate research design* reveals a possible study design —
who to recruit, what to measure, the breakdowns, the instrument — marked
*AI-generated study design — unverified* with the date. It is an answer,
not a finding: it lives in `research-designs.js`, never in `data.js`, and
deleting that file leaves the app fully working.

**Every record carries a check, and states its limit.** A gap claim is
dated, and a live web search records whether the data has been collected
since. Finding it does not discard the record — the status becomes
`partial` or `collected` and the card says where the data is. No search
proves a negative, so a `missing` record says on its face that this was a
search of published sources, not proof, and invites a correction from
anyone who knows of data it missed.

Five problems were sourced by hand before the intake pipeline existed;
six came from it. Both are visible as such in the app.

## Third-party assets

One, and only one: the female silhouette on the home screen.

- **Female body silhouette** — OpenClipart #71126, dedicated to the public
  domain under CC0. <https://freesvg.org/female-body-silhouette>

Its single `<path>` is pasted inline into `index.html` so the app still
opens from `file://` with no server and no network. The path itself is
unaltered; only its fill and stroke are set, from the palette in
`SPEC.md` §7.1.

Everything else — the layout, the markers, the ring, the data and all
the code — is original work.

## Hackathon

Built for the Elevate Women Global Hackathon 2026.
All work in this repository was done during the Hackathon Period
(Sep 14–20, 2026). No pre-existing code is used.

## Accessibility

Built to the rules in `SPEC.md` §8.2: every status carries a colour, a
shape and a word, so it survives greyscale; the whole flow is keyboard
reachable with a visible focus ring; body text is 16px at 4.5:1 contrast
or better; no horizontal scroll at 360px; `prefers-reduced-motion` is
honoured.

## How records arrive

`intake/` holds the pipeline: discover, filter, extract, verify, design,
validate, review. It is not part of the app — `index.html` loads nothing
from it — and the app still opens from `file://` with no server and no
dependencies. See `intake/README.md`.

Status: the core flow works end to end on sourced data, and the intake
pipeline is built and has produced records now in the seed.