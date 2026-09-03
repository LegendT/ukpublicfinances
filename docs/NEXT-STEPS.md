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
11. Monthly public finances explainer, driven by `monthlyUpdates.json`, with a permanent URL per month and an Atom feed at `/feed.xml`.

Plus an About and methodology page, a glossary (33 terms), a sources page, and a privacy page.

Beyond the brief, the site also has:

- **SEO and structured data:** canonical, Open Graph, Twitter Card, JSON-LD (`WebSite`, `Organization`, `WebPage`, `DefinedTermSet`, `FAQPage`, `NewsArticle`, `Dataset`), `sitemap.xml`, `robots.txt`, `llms.txt`, and an OG share image.
- **Cookieless analytics:** Cloudflare Web Analytics (no consent banner) plus a privacy page.
- **Security headers:** Content-Security-Policy and others via `netlify.toml`.
- **GOV.UK alignment:** yellow focus state, larger type scale, and content style.
- **Tested tool maths:** pure functions in `assets/js/lib/calc.js` with unit tests. 18 tests in total, including a guard that fails the build if an em-dash returns to the source.

Every route the site builds passes a WCAG 2.2 AA audit (`npm run a11y:all`, 20 routes at the time of writing). The route list comes from `sitemap.xml` at run time, so the audit follows the site rather than a hand-kept list. `npm test` covers the data contract, the tool maths, and the style guard.

## Data status

The headline, monthly, and indicator figures were refreshed on 21 August 2026 for the ONS July 2026 public sector finances release. The whole figure set was last re-audited against its primary sources (ONS, OBR, HMRC, HM Treasury, House of Commons Library, IMF, and DWP) on 21 July 2026, when the international comparison was pulled directly from the IMF DataMapper. Known caveats: the long-run historical series before about 2010 is a best-estimate reconstruction (`confidence_level: estimated`); the UK adults (18+) figure is the mid-2024 age breakdown, because the UK-wide mid-2025 breakdown is still unpublished; and both the GDP figure and total revenue are derived rather than published, the first as the denominator consistent with the debt-to-GDP ratio and the second as spending minus borrowing. See [`UPDATING-DATA.md`](UPDATING-DATA.md).

## Next steps

Ordered by priority: the accuracy of what is already published first, then what keeps it accurate, then everything else.

- **Move the spending figures onto 2026-27.** `spendingComparisons.json` still declares `fiscalYear: 2025-26` and the site presents it as the current year, five months into 2026-27. Health sits on a 2025-26 plans basis while education, defence and TME are on PESA outturn, so the file mixes vintages. The cross-file identity tests force defence, pensions, welfare and the baseline triple (spending, revenue, borrowing) to move together, so this is one co-ordinated pass rather than a figure-by-figure edit. The largest outstanding piece of work on the project.
- **Replace total revenue with a published figure, or label it plainly as derived.** The £1,230bn in `assumptions.json` and `indicators.json` is spending minus borrowing, not a figure any source publishes, and it moved in August 2026 only because the ONS revised borrowing. Its predecessor (£1,239bn) had been reverse-engineered to make the identity hold and passed every test for weeks. The identity tests cannot catch this class of error, because a fabricated figure satisfies the identity perfectly.
- Refresh the figures on each monthly ONS release, the natural cadence (see `UPDATING-DATA.md`). **The next one, 22 September 2026, is not a routine monthly.** The ONS has said it carries the regular annual data updates and classification decisions: public sector pension fund liabilities re-estimated, recognition and valuation of equity in multilateral development banks, central government lease liability modelling, and the Scottish National Investment Bank brought into the public sector finances. Changes of that kind move the back series, not just the newest month, so check the debt chain, the simulator baseline and the timeline tail rather than editing the latest figures and stopping. The same release is the first to sit on Blue Book 2026, published 20 August 2026, which revises nominal GDP and so touches every ratio the site quotes.
- **Refresh for the October pair, then check them against each other. 28 October is Budget day.** The OBR publishes its Economic and fiscal outlook on 28 October 2026, superseding the March 2026 EFO that debt interest (£110bn, and the 3.6% of GDP indicator), the tax burden and GDP growth all still rest on. It lands alongside the Budget itself, the first of a new Chancellor (John Healey, appointed 20 July 2026), so this is not a forecast refresh alone: announced policy moves spending and tax, which are the figures the simulator baseline and the spending comparisons are built from. Treat it as the heaviest refresh of the three, not the second. The simulator's assumed interest rate is now derived from the £110bn and is drift-tested against it, so it moves in this pass too and `npm test` will say so if it is forgotten. The IMF publishes its new World Economic Outlook vintage the same month, which moves all 24 figures in the international comparison, unchanged since the April 2026 vintage. Both land weeks after the September annual alignment, so three heavier-than-usual refreshes run back to back and the UK rows in the international table should be reconciled against the domestic figures afterwards, remembering they are different measures: gross general government debt against national net debt.
- **Watch the sources for a new release**, so a missed refresh is noticed by something other than memory. Nothing in this repo fetches anything, so when a publisher moves ahead of the figures the site cites, no test fails and nothing complains: `npm test` proves the figures are consistent, not current. `UK-Migration-Explorer` does this in `scripts/check-releases.mjs` and is the working precedent, including two lessons it paid for twice: retry HTTP 429 with backoff and send a `User-Agent`, because ONS throttles anonymous datacentre traffic and a throttle otherwise reads as a missed release; and keep the failing source out of the issue title, or one flapping source opens a fresh issue every run. This is the detection half only, distinct from the fetch script under Nice-to-haves, which would write the JSON.
- Update the **UK adults (18+)** figure once the ONS publishes the UK-wide mid-2025 age breakdown. Blocked on the ONS: England and Wales was published on 29 July 2026, the UK-wide figure is still outstanding, and population and adults should move together when it lands. The ONS gives no date, listing the next release of the UK-wide dataset as "to be announced" (checked 1 September 2026, still on the mid-2024 edition). Its mid-2024 edition landed on 26 September 2025, so on that cadence late September 2026 is the likely window. That is an inference from one prior release rather than a published date, but it makes the 22 September refresh the moment to look.
- **Publish the effective interest rate on debt as a figure.** The interest page runs a section headed "Why the interest rate matters as much as the debt" and then shows no rate on it, or anywhere else on the site: the figures are pounds per year, per month and per day, and shares of revenue and GDP. A reader arriving from a gilt-yield headline cannot tell from this site whether the rate government actually pays has moved. The figure to publish is the effective rate on the stock, annual debt interest divided by the debt stock on the OBR's own illustrative method, currently about 3.7%. It is the number that reconciles the simulator's 4% with market yields above 5%, and it now exists as a provenanced record in `assumptions.json` for the simulator alone. Promoting it to a dashboard or indicator figure is separate work: a `sources.json` entry, a place on `interest.njk`, and a refresh path. Do not put the market gilt yield beside it. It would be visibly stale within a day, and no confidence level in `meta.json` honestly describes a figure that is correct for a few hours.
- Add a **"last verified" stamp** per page.

## Nice-to-haves

- A small build-time fetch script to pull ONS, OBR, and IMF data into the JSON shape automatically.
- A search box across the glossary.
- A print stylesheet for the explainer pages.
