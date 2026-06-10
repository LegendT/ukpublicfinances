# Next steps

## Built in this MVP skeleton

- **Project setup** — Eleventy 3.x, vanilla JS, JSON data, single stylesheet, data tests.
- **Data model** — provenance-carrying JSON in `src/_data`, confidence levels, contract tests.
- **1. Homepage dashboard** — five headline metrics, each with explanation, "what this means", source note, confidence badge; overall caveat.
- **2. Historical timeline** — inline-SVG line chart with measure/period switching, neutral event markers, full table fallback.
- **3. Debt in context** — debt and annual interest set against NHS, education, defence, pension, welfare, tax receipts.
- **4. Big numbers translator** — per-person/adult/taxpayer, % of GDP, % of budgets, months of interest; table fallback.
- **5. During your lifetime** — birth-year debt/GDP vs now, events and prime ministers for context, neutral framing.
- **6. Debt vs deficit explainer** — plain-English terms, who lends, why ratios and rates matter, household analogy with limits.
- **7. Interest costs** — annual/monthly/daily cost, % of revenue and GDP (build-time computed), historical trend, why the rate matters.
- **8. International comparison** — `internationalComparisons.json` rendered as a table sorted by debt/GDP, UK highlighted, with the measurement caveat.
- **9. Public finance health** — wider indicators from `indicators.json` (inflation, unemployment, productivity, tax burden, etc.) with neutral rising/falling/stable markers.
- **10. Budget simulator** — "You are Chancellor": accessible sliders → live borrowing and 5-year debt path, from `assumptions.budgetSimulator`. Clearly labelled a simplified educational model with visible assumptions.
- **11. Monthly public finances explainer** — template driven by `monthlyUpdates.json`, answering the standard monthly questions.
- **Glossary** and **Sources** pages, **README**, and data documentation.

All 13 pages pass a WCAG 2.2 AA audit (`npm run a11y:all`), and data-contract tests cover every data file (`npm test`).

## Not yet built (from the brief)

All numbered MVP sections (1–11) are now built. Remaining work is quality, data, and polish.

## Quality and verification

- **Replace placeholder figures with verified data** (see `UPDATING-DATA.md`). This is the top priority before any publication.
- **Run an accessibility audit** (axe / pa11y / Lighthouse) on the built `_site` and fix findings.
- Consider **per-figure footnotes** linking directly to the exact source table, not just the dataset homepage.
- Add a **"last verified" stamp** per page once data is real.

## Nice-to-haves

- A tiny build-time fetch script to pull ONS/OBR data into the JSON shape automatically.
- Print stylesheet for the explainer pages.
- A simple search across the glossary.
