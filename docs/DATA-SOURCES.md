# Data sources

The project is built to draw from official UK and international sources. The catalogue lives in `src/_data/sources.json` and is rendered on the site's [Sources page](../src/sources.njk).

## Primary sources

| Source | Publisher | Covers | Frequency |
| --- | --- | --- | --- |
| [Public sector finances](https://www.ons.gov.uk/economy/governmentpublicsectorandtaxes/publicsectorfinance) | ONS | Net debt, borrowing, debt interest — the headline UK measures | Monthly |
| [Public finances databank & forecasts](https://obr.uk/data/) | OBR | Long-run series and official forecasts | At fiscal events |
| [Debt Management Office](https://www.dmo.gov.uk/) | DMO | Gilt issuance and who holds UK debt | Ongoing |
| [Public spending statistics](https://www.gov.uk/government/collections/public-spending-statistics) | HM Treasury | Spending by function | Annual |
| [Population estimates](https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates) | ONS | UK population for per-person figures | Annual |
| [World Economic Outlook](https://www.imf.org/en/Publications/WEO) | IMF | Consistent international comparisons | Twice yearly |
| [A millennium of macroeconomic data](https://www.bankofengland.co.uk/statistics/research-datasets) | Bank of England | Long-run historical series | Occasional |

## Notes on measurement

- The UK headline debt measure is **public sector net debt excluding public sector banks**. International comparisons use **general government gross debt**, which is higher and not directly comparable — this is flagged on the international page.
- Debt interest includes the **inflation uplift on index-linked gilts**, which makes it sensitive to inflation as well as interest rates.
- "Debt per person" is a **calculated** scale figure, not a personal liability. The site says so explicitly.

## Keeping sources honest

- Each record's `source_url` should point at the specific dataset, not just a homepage, once real data is in.
- `retrieved_date` records when the figure was last pulled.
- `confidence_level` must reflect reality: ONS monthly figures are `provisional`; anything interpolated for the timeline is `estimated`.
