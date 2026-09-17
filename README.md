# Women Data Gap Platform

A platform for researchers who want to help close the data gap on women,
but don't know which data to collect first.

For each problem, it answers four questions:

1. **What problem do women face?**
2. **What data is needed to solve it?**
3. **Has that data already been collected?**
4. **If not: which women should it come from, how should they be asked,
   and in what form?**

Most gender data projects stop at "there is a gap." This one names the women
the data is missing from, so a researcher knows exactly what to go and collect.

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

Every problem in the app cites a published source, and every missing or
partial data need cites the authority that named the gap — WHO fact
sheets and guidelines, NICE research recommendations, the Lancet women
and cardiovascular disease Commission, the SAGER reporting guidelines,
and peer-reviewed studies. Sources are listed per problem in `SPEC.md`
§9, and every claim links to its source on the record itself.

One data need carries no gap citation, because no published source names
it. The app says so on that record rather than leaving it blank.

**What is not sourced, and is labelled as such:** the collection
requests. Which women to study, which variables to ask for, which
breakdowns the analysis needs and in what form the data comes back is
this platform's own specification in every record. The citations are
the foundation; the specification is the product.

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

Status: the core flow works end to end on sourced data.