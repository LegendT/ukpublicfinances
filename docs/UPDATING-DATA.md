# Updating the data

All figures live in `src/_data/*.json`. Templates never hard-code numbers, so updating the site means editing JSON only — no template changes.

## Golden rules

1. **One source of truth.** Change the figure in `src/_data`, rebuild, done.
2. **Always update provenance.** When you change a `value`, also update `date`, `retrieved_date`, and `confidence_level`.
3. **Be honest about confidence.** Use `official` only for a figure taken directly from a published release. Use `provisional`, `estimated`, or `calculated` otherwise. Definitions are in `meta.json`.
4. **Run the tests.** `npm test` checks every record still has its required fields and a valid confidence level.

## Refreshing the figures

The headline, health, spending, monthly, and international figures were verified against source in June 2026; the pre-2010 historical series remains a best-estimate reconstruction. To bring any of it up to date, each file maps to one official source.

| File | Replace with | From |
| --- | --- | --- |
| `dashboard.json` | Net debt, debt/GDP, debt interest, monthly borrowing | ONS Public sector finances (monthly) |
| `dashboard.json` → `supporting` | GDP, population, tax receipts | ONS |
| `debtTimeseries.json` | Long-run series | Bank of England millennium dataset + OBR databank |
| `spendingComparisons.json` | Annual budgets | HM Treasury public spending statistics |
| `internationalComparisons.json` | Debt/deficit by country | IMF World Economic Outlook |
| `assumptions.json` | Tool assumptions and tax ready-reckoner values | HMRC / OBR |

After editing: `npm run build` then `npm test`.

## When the monthly ONS release lands

1. Open `src/_data/dashboard.json`.
2. Update `lastUpdated`, `referencePeriod`, and each metric's `value`, `date`, `retrieved_date`.
3. Set `confidence_level` to `provisional` (ONS monthly figures are routinely revised).
4. Add the new month's row to `debtTimeseries.json` if you keep the series current.
5. Add a new entry to the top of `monthlyUpdates.json` for the month, which drives the monthly explainer page.
6. `npm run build && npm test`, then run an accessibility check on `_site`.

## Moving to live/API data later

The JSON shape is deliberately API-friendly. To automate:

- Write a small fetch script that pulls from the ONS/OBR endpoints and writes the same JSON shape into `src/_data`.
- Keep the field names identical (`value`, `unit`, `date`, `source_name`, `source_url`, `retrieved_date`, `notes`, `confidence_level`).
- The tests in `test/data.test.js` act as a contract: if the generated JSON misses a field, the build's test step fails before anything ships.
