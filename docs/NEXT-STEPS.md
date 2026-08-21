# Status and next steps

The site is **live at [ukpublicfinances.org](https://ukpublicfinances.org)**, deployed on Netlify from `main`.

## Built

All 11 numbered sections from the brief:

1. Homepage dashboard: five headline metrics, each with explanation, "what this means", source note, and confidence badge.
2. Historical timeline: inline-SVG chart with measure and period switching, neutral event markers, and a table fallback.
3. Debt in context: sentence-led comparisons with proportion bars (debt and interest against annual budgets).
4. Big numbers translator: per-person, per-adult, and per-taxpayer figures, share of GDP, share of budgets, and months of interest.
5. During your lifetime: birth-year debt as a share of GDP against now, with events and prime ministers for context.
6. Debt vs deficit explainer: plain-English terms and the household analogy with its limits.
7. Interest costs: yearly, monthly, and daily cost, share of revenue and GDP, and the historical trend.
8. International comparison: debt, deficit, and growth for eight economies (IMF), with the measurement caveat.
9. Public finance health: wider indicators with neutral rising, falling, or stable markers.
10. Budget simulator: the "balance the budget" challenge, sliders driving live borrowing and a 10-year debt path.
11. Monthly public finances explainer, driven by `monthlyUpdates.json`.

Plus an About and methodology page, a glossary (33 terms), a sources page, and a privacy page.

Beyond the brief, the site also has:

- **SEO and structured data:** canonical, Open Graph, Twitter Card, JSON-LD (`WebSite`, `Organization`, `WebPage`, `DefinedTermSet`, `FAQPage`), `sitemap.xml`, `robots.txt`, `llms.txt`, and an OG share image.
- **Cookieless analytics:** Cloudflare Web Analytics (no consent banner) plus a privacy page.
- **Security headers:** Content-Security-Policy and others via `netlify.toml`.
- **GOV.UK alignment:** yellow focus state, larger type scale, and content style.
- **Tested tool maths:** pure functions in `assets/js/lib/calc.js` with unit tests. 18 tests in total, including a guard that fails the build if an em-dash returns to the source.

All 16 routes pass a WCAG 2.2 AA audit (`npm run a11y:all`); `npm test` covers the data contract, the tool maths, and the style guard.

## Data status

Every public-facing figure was re-audited against its primary source (ONS, OBR, HMRC, House of Commons Library, IMF, and DWP) on 11 June 2026, with the international comparison pulled directly from the IMF DataMapper. Known caveats: the long-run historical series before about 2010 is a best-estimate reconstruction (`confidence_level: estimated`); the UK adults (18+) figure predates the ONS mid-2025 age breakdown (due summer 2026); and the GDP figure is the denominator consistent with the published debt-to-GDP ratio rather than a single published release. See [`UPDATING-DATA.md`](UPDATING-DATA.md).

## Next steps

Ordered by priority: the accuracy of what is already published first, then what keeps it accurate, then everything else.

- **Move the spending figures onto 2026-27.** `spendingComparisons.json` still declares `fiscalYear: 2025-26` and the site presents it as the current year, nearly five months into 2026-27. Health sits on a 2025-26 plans basis while education, defence and TME are on PESA outturn, so the file mixes vintages. The cross-file identity tests force defence, pensions, welfare and the baseline triple (spending, revenue, borrowing) to move together, so this is one co-ordinated pass rather than a figure-by-figure edit. The largest outstanding piece of work on the project.
- **Replace total revenue with a published figure, or label it plainly as derived.** The £1,230bn in `assumptions.json` and `indicators.json` is spending minus borrowing, not a figure any source publishes, and it moved in August 2026 only because the ONS revised borrowing. Its predecessor (£1,239bn) had been reverse-engineered to make the identity hold and passed every test for weeks. The identity tests cannot catch this class of error, because a fabricated figure satisfies the identity perfectly.
- Refresh the figures on each monthly ONS release, the natural cadence (see `UPDATING-DATA.md`). Next release: 22 September 2026.
- **Watch the sources for a new release**, so a missed refresh is noticed by something other than memory. Nothing in this repo fetches anything, so when a publisher moves ahead of the figures the site cites, no test fails and nothing complains: `npm test` proves the figures are consistent, not current. `UK-Migration-Explorer` does this in `scripts/check-releases.mjs` and is the working precedent, including two lessons it paid for twice: retry HTTP 429 with backoff and send a `User-Agent`, because ONS throttles anonymous datacentre traffic and a throttle otherwise reads as a missed release; and keep the failing source out of the issue title, or one flapping source opens a fresh issue every run. This is the detection half only, distinct from the fetch script under Nice-to-haves, which would write the JSON.
- Update the **UK adults (18+)** figure once the ONS publishes the UK-wide mid-2025 age breakdown. Blocked on the ONS: England and Wales was published on 29 July 2026, the UK-wide figure is still outstanding, and population and adults should move together when it lands.
- **Submit the sitemap to Google Search Console**, the one action that actually gets the site crawled and indexed.
- Add a **"last verified" stamp** per page.

## Nice-to-haves

- A small build-time fetch script to pull ONS, OBR, and IMF data into the JSON shape automatically.
- A search box across the glossary.
- A print stylesheet for the explainer pages.
