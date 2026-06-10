# UK Public Finances Explorer

A clean, factual, data-led website that helps people understand UK government debt and public finances. Built with official data sources in mind, plain-English explanations, historical context, and useful comparisons.

It is **not** a political commentary site and **not** a gimmicky debt clock. Every major figure shows its source and date, and figures are clearly marked when estimated, provisional, or calculated.

## Build status — read this first

Headline dashboard figures and the international debt comparison were **verified against ONS, OBR and IMF sources in June 2026** (see each record's `source_url`). The long-run historical series (especially pre-2010), some annual spending figures, and the deficit/growth columns are still **estimates or carry scope caveats** — each is marked with its `confidence_level` and a `notes` field. Re-verify everything against the live source before any public use. See [`docs/UPDATING-DATA.md`](docs/UPDATING-DATA.md).

## Stack

- **[Eleventy](https://www.11ty.dev/) 3.x** — static site generator. No client framework.
- **Vanilla JavaScript** for the interactive tools (translator, timeline chart, lifetime calculator). Each is progressive enhancement over a working no-JS baseline.
- **Hand-rolled inline-SVG charts** with a full data-table fallback — no charting library, keyboard- and screen-reader-friendly.
- **JSON data files** as the single source of truth. No figure is hard-coded into a template.

Requires Node.js 18+ (developed on Node 25).

## Getting started

```bash
npm install      # install Eleventy
npm run dev      # local dev server with live reload, usually http://localhost:8080
npm run build    # production build to ./_site
npm test         # data-integrity tests
npm run a11y:all # build + serve + WCAG 2.2 AA audit of every page (see below)
```

### Accessibility audits

```bash
npm run a11y:all   # one shot: build, serve _site, pa11y-ci over all 8 routes, tear down
npm run a11y       # quick single-page check — needs `npm run dev` running first
```

`a11y:all` is self-contained: it builds, starts a static server on port 8081, runs
[pa11y-ci](https://github.com/pa11y/pa11y-ci) against every route listed in
`.pa11yci.json` at the WCAG 2.2 AA standard, then stops the server. The audit tools are
fetched on demand via `npx` (kept out of the dependency tree to stay lean); **the first
run downloads a headless Chromium**, so expect it to take a minute. To audit a specific
page while developing, run `npm run dev` and `npm run a11y` (defaults to the homepage —
edit the URL in the script for others).

For performance and best-practices scores too, run Lighthouse against the dev server:

```bash
npx lighthouse http://localhost:8080 --only-categories=accessibility --view
```

## Folder structure

```
.
├── .eleventy.js              # Eleventy config + custom filters (number, readableDate, poundsShort, findBy)
├── src/
│   ├── _data/                # SOURCE OF TRUTH — all figures live here as JSON
│   │   ├── dashboard.json            # homepage headline metrics
│   │   ├── debtTimeseries.json       # long-run series for the timeline
│   │   ├── spendingComparisons.json  # annual budgets for context
│   │   ├── internationalComparisons.json
│   │   ├── events.json               # neutral timeline markers
│   │   ├── primeMinisters.json       # context for the lifetime tool
│   │   ├── assumptions.json          # tool assumptions (translator, simulator)
│   │   ├── indicators.json           # wider economic indicators (health page)
│   │   ├── monthlyUpdates.json       # monthly explainer entries
│   │   ├── sources.json              # data source catalogue
│   │   ├── glossary.json             # glossary terms
│   │   ├── meta.json                 # placeholder notice, confidence definitions
│   │   └── site.json                 # site title, nav
│   ├── _includes/
│   │   ├── layouts/base.njk          # page shell, header, footer
│   │   └── components/macros.njk     # reusable components (see below)
│   ├── assets/
│   │   ├── css/main.css              # mobile-first, single stylesheet
│   │   └── js/                       # nav, big-numbers, timeline, lifetime, budget-simulator
│   ├── index.njk                     # 1. Homepage dashboard
│   ├── timeline.njk                  # 2. Historical timeline
│   ├── debt-in-context.njk           # 3. Debt in context
│   ├── interest.njk                  # 7. Interest costs
│   ├── international.njk             # 8. International comparison
│   ├── health.njk                    # 9. Public finance health
│   ├── big-numbers.njk               # 4. Big numbers translator
│   ├── lifetime.njk                  # 5. During your lifetime
│   ├── budget-simulator.njk          # 10. Budget simulator
│   ├── deficit-vs-debt.njk           # 6. Debt vs deficit explainer
│   ├── monthly.njk                   # 11. Monthly update explainer
│   ├── glossary.njk                  # glossary
│   └── sources.njk                   # sources
├── test/data.test.js          # data contract tests
└── docs/                      # data sourcing, updating, next steps
```

## Components

Reusable Nunjucks macros in `src/_includes/components/macros.njk`:

| Macro | Purpose |
| --- | --- |
| `metricCard` | A headline figure: value, explanation, "what this means", source note |
| `sourceNote` | Source name, link, figure date, retrieved date, confidence badge |
| `caveatBox` | A clearly flagged caution |
| `dataFreshnessBadge` | Confidence level marker (official / provisional / estimated / calculated) |
| `glossaryTerm` | A defined term |
| `spendingRow` | One comparison row against an annual budget |

The timeline chart and translator render a `<table>` fallback server-side, then enhance with SVG/JS.

## Data model

Every figure record carries provenance:

```json
{
  "metric_name": "Public sector net debt",
  "value": 2810,
  "unit": "£ billion",
  "date": "2026-04-30",
  "source_name": "ONS, Public sector finances",
  "source_url": "https://www.ons.gov.uk/...",
  "retrieved_date": "2026-06-10",
  "notes": "Excludes public sector banks.",
  "confidence_level": "provisional"
}
```

`confidence_level` is one of: `official`, `provisional`, `estimated`, `calculated` (defined in `meta.json` and enforced by the tests).

## Accessibility

Built to WCAG 2.2 AA principles: semantic headings, keyboard-operable controls, visible focus, 4.5:1 text contrast, 44px touch targets, no chart-only information (every chart has a table), labelled form fields with clear errors, mobile-first responsive layout, and `prefers-reduced-motion` support.

Verify, don't assume — run `npm run a11y:all` (pa11y-ci, WCAG 2.2 AA across every page) before publishing.

## Documentation

- [`docs/DATA-SOURCES.md`](docs/DATA-SOURCES.md) — every source and what it covers.
- [`docs/UPDATING-DATA.md`](docs/UPDATING-DATA.md) — how to replace placeholder figures with live data.
- [`docs/NEXT-STEPS.md`](docs/NEXT-STEPS.md) — what is built and what comes next.

## Editorial principles

Neutral, factual, plain English. Facts are separated from interpretation. No party-political blame. National debt is not presented as updating second-by-second. The household-finance analogy is used only with its limits spelled out.

## Deployment

The site is a static Eleventy build, hosted on **Netlify**. Config is in `netlify.toml` (build `npm run build`, publish `_site`, Node 24).

**Connect the repo (recommended):**
1. In Netlify, *Add new site → Import from Git* and choose this repository.
2. Netlify reads `netlify.toml` — no manual build settings needed.
3. Every push to `main` builds and deploys automatically; pull requests get deploy previews.

**Custom domain:** *Site settings → Domain management → Add a custom domain*, then point your registrar's DNS at Netlify (or use Netlify DNS). HTTPS is automatic.

**Quick one-off deploy (no Git):** `npm run build`, then drag the `_site` folder onto the Netlify deploy page.

Node version is pinned in `.node-version` (24), so local (via fnm) and Netlify use the same runtime.

## Licence

MIT — see [`LICENSE`](LICENSE).
