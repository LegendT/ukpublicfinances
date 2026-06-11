# Data sources

The project draws from official UK and international sources. The catalogue lives in `src/_data/sources.json` and is rendered on the site's [Sources page](../src/sources.njk).

## Primary sources

| Source | Publisher | Covers | Frequency |
| --- | --- | --- | --- |
| [Public sector finances](https://www.ons.gov.uk/economy/governmentpublicsectorandtaxes/publicsectorfinance) | ONS | Net debt, borrowing, debt interest, the headline UK measures | Monthly |
| [Public finances databank and forecasts](https://obr.uk/data/) | OBR | Long-run series, official forecasts, debt interest | At fiscal events |
| [Debt Management Office](https://www.dmo.gov.uk/) | DMO | Gilt issuance and who holds UK debt | Ongoing |
| [Public Expenditure Statistical Analyses (PESA)](https://www.gov.uk/government/collections/public-expenditure-statistical-analyses-pesa) | HM Treasury | Spending by function | Annual |
| [UK defence spending (CBP-8175)](https://commonslibrary.parliament.uk/research-briefings/cbp-8175/) | House of Commons Library | Defence budget and commitments | Updated as needed |
| [Benefit expenditure tables](https://www.gov.uk/government/collections/benefit-expenditure-tables) | DWP | State pension and welfare spending | Annual, with forecasts |
| [Personal incomes statistics](https://www.gov.uk/government/collections/personal-incomes-statistics) | HMRC | Income tax payers and the tax ready reckoner | Annual |
| [Population estimates](https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates) | ONS | UK population for per-person figures | Annual |
| [World Economic Outlook](https://www.imf.org/en/Publications/WEO) | IMF | Consistent international comparisons (via the DataMapper API) | Twice yearly |
| [A millennium of macroeconomic data](https://www.bankofengland.co.uk/statistics/research-datasets) | Bank of England | Long-run historical series | Occasional |

## Notes on measurement

- The UK headline debt measure is **public sector net debt excluding public sector banks**. International comparisons use **general government gross debt**, which is higher and not directly comparable. This is flagged on the international page.
- "Defence spending" has several definitions. The site uses the **MoD departmental budget**; the broader NATO-definition figure (which adds items such as armed-forces pensions) is higher. The measure is stated in the figure's note.
- Debt interest includes the **inflation uplift on index-linked gilts**, which makes it sensitive to inflation as well as interest rates.
- "Debt per person" is a **calculated** scale figure, not a personal liability. The site says so explicitly.

## Keeping sources honest

- Each record's `source_url` should point at the specific dataset or release, not just a homepage (the dashboard and monthly figures already deep-link to the relevant ONS bulletin).
- `retrieved_date` records when the figure was last pulled.
- `confidence_level` must reflect reality: ONS monthly figures are `provisional`; anything interpolated for the timeline is `estimated`.
