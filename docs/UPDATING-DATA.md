# Updating the data

All figures live in `src/_data/*.json`. Templates never hard-code numbers, so updating the site means editing JSON only, with no template changes.

## Golden rules

1. **One source of truth.** Change the figure in `src/_data`, rebuild, done.
2. **Always update provenance.** When you change a `value`, also update `date`, `retrieved_date`, and `confidence_level`. Where the file carries its own date, update that too: `dashboard.json`, `indicators.json` and `sources.json` use a top-level `lastUpdated`, `meta.json` uses `lastReviewed`, and `assumptions.json` carries one per section (`translator.lastUpdated`, `budgetSimulator.lastUpdated`) so editing one tool does not restamp the pages that render the other. Those fields set the page's `dateModified` in the JSON-LD and its `lastmod` in the sitemap, so leaving one stale tells search engines and language models the page did not change when it did. `npm test` checks the field is present and well formed, not that you moved it.
3. **Be honest about confidence.** Use `official` only for a figure taken directly from a published release. Use `provisional`, `estimated`, or `calculated` otherwise. Definitions are in `meta.json`.
4. **Name the exact measure.** Most errors come from a figure that is self-consistent but the wrong measure or year, for example the MoD departmental budget versus NATO-definition defence spending, or net versus gross debt. State the measure in the record's `notes`.
5. **Run the tests.** `npm test` checks that every record still has its required fields and a valid confidence level, that figures shared across files still match, that no em-dash has crept into the copy, and that the three files carrying a check date (`dashboard.json`, `indicators.json`, `primeMinisters.json`) have all been checked within the last 45 days.

## Refreshing the figures

The whole figure set was last re-audited against its primary sources on 21 July 2026; the headline, monthly and indicator figures were refreshed on 21 August 2026. The pre-2010 historical series remains a best-estimate reconstruction. Each file maps to one official source:

| File | Replace with | From |
| --- | --- | --- |
| `dashboard.json` | Net debt, debt/GDP, debt interest, monthly borrowing | ONS Public sector finances (monthly); OBR for debt interest |
| `dashboard.json` supporting | GDP, population, tax receipts | ONS; HMRC for income tax payers |
| `debtTimeseries.json` | Long-run series | Bank of England millennium dataset and OBR databank |
| `spendingComparisons.json` | Annual budgets | HM Treasury PESA, DWP benefit tables, House of Commons Library |
| `internationalComparisons.json` | Debt, deficit, growth by country | IMF World Economic Outlook |
| `assumptions.json` | Tool assumptions and tax ready-reckoner values | HMRC ready reckoner, OBR |

After editing: `npm run build` then `npm test`.

### Reading the ONS figures from the time series

The monthly bulletin is prose and easy to misread, and its summary can restate the same figure in two places. The underlying time series are JSON and settle it, appending `/data` to the series URL:

```
curl -s "https://www.ons.gov.uk/economy/governmentpublicsectorandtaxes/publicsectorfinance/timeseries/hf6w/pusf/data"
```

Useful series: `HF6W` (net debt, £bn), `HF6X` (net debt as % of GDP), `J5II` (net borrowing, £m, where a negative value is borrowing), `J5IJ` (borrowing as % of GDP, financial years stamped at Q1), `NMFX` (central government net interest payable). Financial-year totals are the twelve months from April, summed.

### Pulling the international figures from the IMF

The IMF DataMapper website blocks automated fetching, but its JSON API works from `curl`. Pull all eight countries in one call per indicator:

```
curl -s "https://www.imf.org/external/datamapper/api/v1/GGXWDG_NGDP/GBR/USA/JPN/DEU/FRA/ITA/CAN/AUS"
```

Indicators: `GGXWDG_NGDP` (general government gross debt, % of GDP), `GGXCNL_NGDP` (net lending or borrowing, % of GDP, where a deficit shows as negative), and `NGDP_RPCH` (real GDP growth). Read the value at `.values.<INDICATOR>.<ISO3>.<year>`. The site uses debt as the latest-year estimate, and deficit and growth as the prior-year outturn.

## When the monthly ONS release lands

1. Open `src/_data/dashboard.json`.
2. Update `lastUpdated`, `referencePeriod`, and each metric's `value`, `date`, and `retrieved_date`. `referencePeriod` must stay in the form "July 2026": the timeline, interest and lifetime pages take the year they label the latest figures with from its last four digits, and the build fails if it does not end in a year.
3. Set `confidence_level` to `provisional` (ONS monthly figures are routinely revised).
4. Add the new month's row to `debtTimeseries.json` if you keep the series current.
5. Add a new entry to the top of `monthlyUpdates.json` for the month, which drives the monthly explainer page.
6. Keep the cross-file figures in step: `data.test.js` enforces that values shared across files (population, taxpayers, debt interest, defence, pension) match, and that the simulator's accounting identities still hold.
7. Check the figures no test binds. `assumptions.json` `translator.annualBorrowingGbpBillion` and `indicators.json` `borrowing-gdp` both describe the financial year's borrowing, and nothing fails if they go stale. The August 2026 refresh found the ONS had revised financial year 2025-26 borrowing from £128.0bn to £129.8bn, which moved the simulator baseline and both of these; only the baseline was test-enforced.
8. Take a published ratio from its publisher rather than dividing it yourself. Debt interest as a share of GDP was broken once by dividing by the debt-ratio denominator, and borrowing as a share of GDP would break the same way: the ONS publishes it as series J5IJ, stamped at Q1 of the year it ends. That rule governs ratios the site quotes as figures. A modelling assumption inside a tool is a different thing, and `assumptions.json` `budgetSimulator.projection.assumedInterestRate` is the only one: no publisher issues a single effective interest rate on UK debt, so it is set here, labelled `estimated` rather than `calculated`, and drift-tested against debt interest over net debt. Do not promote that arithmetic to a published figure on the strength of the test.
9. Re-check the facts no publisher will correct for you, and stamp the date. `primeMinisters.json` is the one that rots: its last entry has an open `to`, and nothing in this repo or in any ONS release can tell you the Prime Minister has changed. Confirm the sitting Prime Minister against the [GOV.UK past prime ministers](https://www.gov.uk/government/history/past-prime-ministers) page, correct the list if it has moved, then set `checkedOn` to today. The list was wrong for six weeks in 2026 because nothing prompted anyone to look.
10. `npm run build && npm test`, then `npm run a11y:all`. The accessibility audit reads `sitemap.xml`, so the new month's page is picked up with nothing to configure.
11. Before you close the bulletin, read its forward notices and record anything that changes the shape of the next refresh. Each release announces its own coming changes, under headings such as "Improvements and data updates in September 2026", and the annual alignment is announced there a month ahead rather than on any calendar. That is how the September 2026 alignment was found, from the July bulletin. Put what you find on the matching item in `NEXT-STEPS.md`, not in a new document: a dated list of future releases is a second list that rots, whereas the bulletin republishes its own notice every month and cannot go stale.

## Moving to live or API data later

The JSON shape is deliberately API-friendly. To automate:

- Write a small fetch script that pulls from the ONS, OBR, and IMF endpoints and writes the same JSON shape into `src/_data`.
- Keep the field names identical (`value`, `unit`, `date`, `source_name`, `source_url`, `retrieved_date`, `notes`, `confidence_level`).
- The tests in `test/data.test.js` act as a contract: if the generated JSON misses a field, the test step fails before anything ships.
