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

The current version uses **generated demo data**. Problems, datasets and
gaps shown in the app are illustrative, not real findings.
Next step: replace them with real problems from published sources
(WHO, UN and others), with links.

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

Status: the core flow works end to end on demo data.