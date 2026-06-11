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

All 15 routes pass a WCAG 2.2 AA audit (`npm run a11y:all`); `npm test` covers the data contract, the tool maths, and the style guard.

## Data status

Every public-facing figure was re-audited against its primary source (ONS, OBR, HMRC, House of Commons Library, IMF, and DWP) on 11 June 2026, with the international comparison pulled directly from the IMF DataMapper. Known caveats: the long-run historical series before about 2010 is a best-estimate reconstruction (`confidence_level: estimated`); the UK adults (18+) figure predates the ONS mid-2025 age breakdown (due summer 2026); and the GDP figure is the denominator consistent with the published debt-to-GDP ratio rather than a single published release. See [`UPDATING-DATA.md`](UPDATING-DATA.md).

## Next steps

- **Submit the sitemap to Google Search Console**, the one action that actually gets the site crawled and indexed.
- Refresh the figures on each monthly ONS release, the natural cadence (see `UPDATING-DATA.md`).
- Update the **UK adults (18+)** figure once the ONS publishes the mid-2025 age breakdown (expected summer 2026).
- Add a **"last verified" stamp** per page.

## Nice-to-haves

- A small build-time fetch script to pull ONS, OBR, and IMF data into the JSON shape automatically.
- A search box across the glossary.
- A print stylesheet for the explainer pages.
