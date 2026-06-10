# Status and next steps

The site is **live at [ukpublicfinances.org](https://ukpublicfinances.org)**, deployed on Netlify from `main`.

## Built

All 11 numbered sections from the brief:

1. Homepage dashboard — five headline metrics, each with explanation, "what this means", source note, confidence badge.
2. Historical timeline — inline-SVG chart with measure/period switching, neutral event markers, table fallback.
3. Debt in context — sentence-led comparisons with proportion bars (debt and interest vs annual budgets).
4. Big numbers translator — per-person/adult/taxpayer, % of GDP, % of budgets, months of interest.
5. During your lifetime — birth-year debt/GDP vs now, events and prime ministers for context.
6. Debt vs deficit explainer — plain-English terms, the household analogy with its limits.
7. Interest costs — yearly/monthly/daily cost, % of revenue and GDP, historical trend.
8. International comparison — debt, deficit, and growth for eight economies (IMF), with the measurement caveat.
9. Public finance health — wider indicators with neutral rising/falling/stable markers.
10. Budget simulator — "balance the budget" challenge: sliders → live borrowing and a 5-year debt path.
11. Monthly public finances explainer — driven by `monthlyUpdates.json`.

Plus a glossary (33 terms), sources page, and privacy page.

Beyond the brief, the site also has:

- **SEO and structured data** — canonical, Open Graph, Twitter Card, JSON-LD (`WebSite`/`Organization`/`WebPage`/`DefinedTermSet`/`FAQPage`), `sitemap.xml`, `robots.txt`, `llms.txt`, and an OG share image.
- **Cookieless analytics** — Cloudflare Web Analytics (no consent banner) plus a privacy page.
- **Security headers** — Content-Security-Policy and others via `netlify.toml`.
- **GOV.UK alignment** — yellow focus state, larger type scale, and content style.
- **Tested tool maths** — pure functions in `assets/js/lib/calc.js` with unit tests; 16 tests in total.

All 14 routes pass a WCAG 2.2 AA audit (`npm run a11y:all`); `npm test` covers the data contract and the tool maths.

## Data status

Verified June 2026 against ONS, OBR, IMF, and HM Treasury sources: dashboard headlines, health indicators, the monthly update, spending comparisons, and the full international comparison (debt 2025; deficit and growth 2024). The only remaining estimates are the **long-run historical series before about 2010** — best-estimate reconstructions where exact pre-1900 figures are inherently uncertain. See [`UPDATING-DATA.md`](UPDATING-DATA.md).

## Next steps

- **Submit the sitemap to Google Search Console** — the one action that actually gets the site crawled and indexed.
- Tighten the **pre-2010 historical series** against the Bank of England millennium dataset if exact figures are wanted.
- Add a **"last verified" stamp** per page.

## Nice-to-haves

- A small build-time fetch script to pull ONS/OBR data into the JSON shape automatically.
- A search box across the glossary.
- Print stylesheet for the explainer pages.
