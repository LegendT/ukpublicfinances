# UK Public-Finances Data Verification Audit

**Date:** 11 June 2026

## Introduction

This audit reviewed the 33 public-facing figures used across the site (UK public-finances headline numbers, spending lines, the tax ready-reckoner, and the international comparison table). Each figure was checked independently against its primary source (ONS, OBR, HMRC, House of Commons Library, IMF, INSEE, Destatis, and equivalent national statistical offices). Every figure that was not cleanly confirmed on the first pass received a second, independent re-check by a separate reviewer to test the first verdict.

**No data was changed.** This document records findings and recommendations only. All fixes below require human approval before any value is amended on the site.

## Counts by status

| Status | Count |
| --- | ---: |
| Confirmed | 13 |
| Stale | 9 |
| Wrong | 7 |
| Uncertain | 4 |
| **Total** | **33** |

## Discrepancies to approve

Ordered worst-first: wrong, then stale, then uncertain.

### Wrong (7)

#### Health spending
- **Current site value:** £200bn per year
- **Verified value:** £221.7bn for 2025-26 (DHSC Resource DEL £208.1bn + Capital DEL £13.6bn)
- **Measure:** Total DHSC budget for England, 2025-26 fiscal year, comprising Resource DEL (day-to-day) and Capital DEL (investment)
- **Primary source:** UK Parliament House of Commons Library — Estimates Day debate: DHSC spending; Main Estimates 2025-26 — https://commonslibrary.parliament.uk/research-briefings/cdp-2025-0140/
- **Re-check:** Agreed
- **Recommended confidence:** official
- **Recommended fix:** Update to £221.7bn for 2025-26, or £208.1bn if referring specifically to Resource DEL only (clarify in the measure definition).

#### Tax ready-reckoner per point
- **Current site value:** income tax basic rate +1pt about £8.0bn; VAT +1pt about £8.5bn; corporation tax +1pt about £3.7bn
- **Verified value:** Income tax basic rate +1pt £6.9bn; VAT +1pt £8.8bn; corporation tax +1pt £3.6bn (2026-27 financial year)
- **Measure:** HMRC "Direct effects of illustrative tax changes" ready-reckoner, full-year revenue impact per 1 percentage point change for 2026-27 (April 2026 implementation), June 2025 bulletin
- **Primary source:** HMRC — Direct effects of illustrative tax changes bulletin (June 2025) — https://www.gov.uk/government/statistics/direct-effects-of-illustrative-tax-changes/direct-effects-of-illustrative-tax-changes-bulletin-january-2025
- **Re-check:** Agreed
- **Recommended confidence:** official
- **Recommended fix:** Update all three to the HMRC June 2025 bulletin: income tax basic rate £6.9bn, VAT £8.8bn, corporation tax £3.6bn. Clarify reference period as 2026-27 with April 2026 implementation assumption.

#### International: United Kingdom
- **Current site value:** gross debt 103.9% (2025 est), deficit 4.3% (2024), growth 1.3% (2024)
- **Verified value:** gross debt ~101-105% (2024-25 outturn / 2025 est), deficit 5.7% (2024), growth 1.1% (2024)
- **Measure:** IMF WEO general government gross debt %GDP (2025 est), net lending/borrowing %GDP (2024), real GDP growth (2024)
- **Primary source:** IMF World Economic Outlook October 2025; ONS; OBR — https://www.imf.org/en/publications/weo/issues/2025/10/14/world-economic-outlook-october-2025
- **Re-check:** Disagreed — flagged for extra scrutiny (see below)
- **Recommended confidence:** official
- **Recommended fix:** Update deficit to 5.7% (2024, IMF WEO); update growth to 1.1% (2024, ONS); clarify the gross-debt source and year (101% 2024-25 outturn per OBR, or the IMF 2025 projection if citing IMF WEO).

#### International: United States
- **Current site value:** gross debt 122.5% (2025), deficit 7.6% (2024), growth 2.0% (2024)
- **Verified value:** gross debt 123.9% (2025), deficit approx 7.0-7.4% (2024), growth 2.8% (2024)
- **Measure:** IMF WEO general government gross debt %GDP (2025), net lending/borrowing %GDP (2024), real GDP growth (2024)
- **Primary source:** IMF World Economic Outlook October 2025 and IMF Article IV Consultation with the United States April 2026 — https://www.imf.org/en/news/articles/2026/04/01/pr-26102-usa-imf-executive-board-concludes-2026-article-iv-consult
- **Re-check:** Disagreed — re-check found the 2024 deficit is 7.9%, not 7.0-7.4%; flagged for extra scrutiny (see below)
- **Recommended confidence:** medium
- **Recommended fix:** Update gross debt 2025 to 123.9%; update real GDP growth 2024 to 2.8%; verify net lending/borrowing 2024 against IMF WEO October 2025 Table B6 (re-check indicates 7.9%).

#### International: Germany
- **Current site value:** gross debt 65.4% (2025), deficit 2.0% (2024), growth 0.2% (2024)
- **Verified value:** gross debt 62.6-63.5% (2025), deficit 2.8% (2024), growth -0.2% (2024)
- **Measure:** IMF WEO general government gross debt %GDP (2025), net lending/borrowing %GDP (2024), real GDP growth (2024)
- **Primary source:** IMF 2025 Article IV Consultation; Destatis; Deutsche Bundesbank — https://www.imf.org/en/news/articles/2026/02/11/pr26042-germany-imf-executive-board-concludes-2025-article-iv-consultation
- **Re-check:** Agreed
- **Recommended confidence:** official
- **Recommended fix:** Update to gross debt 62.6-63.5% (2025), deficit 2.8% (2024), growth -0.2% (2024). Note: 0.2% growth refers to 2025, not 2024.

#### International: France
- **Current site value:** gross debt 116.3% (2025), deficit 6.0% (2024), growth 0.9% (2024)
- **Verified value:** gross debt 115.6% (2025, INSEE), deficit -5.8% (2024, INSEE), growth 1.1% (2024, IMF October 2024 outturn)
- **Measure:** IMF WEO methodology — general government gross debt %GDP (2025), net lending/borrowing %GDP (2024), real GDP growth (2024)
- **Primary source:** INSEE for 2024-2025 actuals; IMF October 2024 WEO for growth — https://www.insee.fr/en/statistiques/8961174
- **Re-check:** Agreed
- **Recommended confidence:** provisional
- **Recommended fix:** Update to gross debt 115.6% (2025), deficit 5.8% (2024), growth 1.1% (2024).

#### International: Canada
- **Current site value:** gross debt 112.5% (2025), deficit 2.0% (2024), growth 1.2% (2024)
- **Verified value:** gross debt 113.5% (2025), deficit -2.0% (2024), growth 2.0% (2024)
- **Measure:** IMF WEO general government gross debt %GDP (2025 projection), net lending/borrowing %GDP (2024 outturn), real GDP growth (2024 outturn)
- **Primary source:** IMF World Economic Outlook October 2025; IMF Article IV 2025; Statistics Canada — https://www.imf.org/en/publications/weo/issues/2025/10/14/world-economic-outlook-october-2025
- **Re-check:** Agreed
- **Recommended confidence:** provisional
- **Recommended fix:** Update gross debt to 113.5% (2025); replace growth with 2.0% (2024 outturn) or clarify that 1.2% is a 2025 forecast. Deficit of 2.0% (2024) is correct.

### Stale (9)

#### Annual debt interest
- **Current site value:** £111bn per year
- **Verified value:** £110 billion
- **Measure:** Central government debt interest, net of APF, fiscal year 2025-26
- **Primary source:** OBR Economic and Fiscal Outlook November 2025 — https://obr.uk/efo/economic-and-fiscal-outlook-november-2025/
- **Re-check:** Agreed
- **Recommended confidence:** provisional
- **Recommended fix:** Update to £110bn (OBR November 2025 EFO), or clarify the figure is from the March 2025 forecast.

#### Annual borrowing
- **Current site value:** £130bn per year
- **Verified value:** £129.0 billion (provisional estimate, FY 2025-26 ending March 2026)
- **Measure:** Public sector net borrowing (PSNB), full year ending 31 March 2026
- **Primary source:** ONS Public Sector Finances April 2026 — https://www.ons.gov.uk/economy/governmentpublicsectorandtaxes/publicsectorfinance/bulletins/publicsectorfinances/april2026
- **Re-check:** Agreed
- **Recommended confidence:** provisional
- **Recommended fix:** Update to £129.0bn (provisional estimate), or £132.7bn (OBR March 2026 forecast); note the April 2026 ONS release is the most recent provisional estimate.

#### UK population
- **Current site value:** 68.3 million
- **Verified value:** 69.5 million (69,487,000), mid-2025 estimate
- **Measure:** UK total population, provisional mid-year estimate as of 30 June 2025
- **Primary source:** ONS — https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/bulletins/provisionalpopulationestimatefortheuk/mid2025
- **Re-check:** Agreed
- **Recommended confidence:** provisional
- **Recommended fix:** Update to 69.5 million (mid-2025), or use 69.3 million for finalised mid-2024 data.

#### UK adults (18+)
- **Current site value:** 54.2 million
- **Verified value:** 54.3-54.4 million (mid-2025, provisional) — disputed by re-check
- **Measure:** UK population aged 18 and over, mid-year estimate
- **Primary source:** ONS — https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/bulletins/provisionalpopulationestimatefortheuk/mid2025
- **Re-check:** Disagreed — the mid-2025 bulletin excludes age/sex breakdowns; the 54.3-54.4m figure is not supported by the cited source until detailed breakdowns publish (summer 2026). Flagged for extra scrutiny (see below)
- **Recommended confidence:** provisional
- **Recommended fix:** Either wait for ONS age breakdowns (expected summer 2026) before updating, or update to ~54.3-54.4 million with an explicit "derived estimate" caveat rather than citing the mid-2025 bulletin as direct evidence.

#### Income tax payers
- **Current site value:** 36.2 million
- **Verified value:** 36.7 million for tax year 2023-24 (outturn)
- **Measure:** Total individual income tax payers in the UK, tax year 2023-24 (confirmed outturn)
- **Primary source:** HMRC Personal Incomes Statistics 2023-24 — https://www.gov.uk/government/statistics/personal-incomes-statistics-for-the-tax-year-2023-to-2024/personal-incomes-statistics-2023-to-2024-summary-statistics
- **Re-check:** Agreed
- **Recommended confidence:** official
- **Recommended fix:** Update to 36.7 million (2023-24 outturn, HMRC).

#### Total tax receipts
- **Current site value:** £1,120bn per year
- **Verified value:** £1,121.5 billion (central government total current receipts, FYE March 2026); ~£1,112bn for the tax component
- **Measure:** Total current receipts (central government), FYE March 2026; or National Accounts taxes at ~36% of GDP for 2025-26
- **Primary source:** ONS Public Sector Finances March 2026; OBR EFO March 2026 — https://www.ons.gov.uk/economy/governmentpublicsectorandtaxes/publicsectorfinance/bulletins/publicsectorfinances/march2026
- **Re-check:** Agreed
- **Recommended confidence:** official
- **Recommended fix:** Update to £1,121.5bn (or £1,122.8bn per the April 2026 ONS release) for FYE March 2026. Clarify the measure: if tax only, state National Accounts taxes ~36% of GDP; if all receipts, state ~40.4% of national income.

#### Government revenue
- **Current site value:** £1,238bn per year
- **Verified value:** £1,235bn for 2025-26
- **Measure:** Total public sector current receipts, 2025-26 (OBR forecast as of March 2026)
- **Primary source:** OBR March 2026 EFO — https://obr.uk/forecasts-in-depth/brief-guides-and-explainers/public-finances/
- **Re-check:** Agreed
- **Recommended confidence:** provisional
- **Recommended fix:** Update to £1,235bn (OBR March 2026 forecast), or £1,232bn if using the House of Commons Library June 2026 citation of ONS data.

#### State pension
- **Current site value:** £125bn per year
- **Verified value:** £125bn confirmed only for 2023-24; the 2025-26 forecast is £146.1bn (re-check)
- **Measure:** State pension expenditure — the published £125bn is the 2023-24 actual, used against a 2025-26 measure
- **Primary source:** OBR Welfare Spending — Pensioner Benefits; DWP benefit expenditure tables — https://www.gov.uk/government/publications/benefit-expenditure-and-caseload-tables-guidance-and-methodology/benefit-expenditure-and-caseload-tables-information-and-guidance
- **Re-check:** Agreed on "stale"; re-check supplied the current figure of £146.1bn (2025-26) per DWP tables
- **Recommended confidence:** estimated (upgrade to official/provisional once the £146.1bn DWP figure is adopted)
- **Recommended fix:** Update to the 2025-26 forecast of £146.1bn (DWP tables), or cite the OBR March 2026 EFO / June 2026 Welfare Trends Report. The triple-lock uprating makes the £125bn figure materially understated.

#### International: Japan
- **Current site value:** gross debt 234.9% (2025), deficit 6.1% (2024), growth 1.1% (2024)
- **Verified value:** gross debt 234.9% (2025) confirmed; deficit -2.5% (2024); growth ~0.7-0.9% (2024 outturn)
- **Measure:** IMF WEO general government gross debt %GDP (2025), net lending/borrowing %GDP (2024), real GDP growth (2024)
- **Primary source:** IMF WEO April 2024 (2025 debt projection); IMF April 2025 Article IV Consultation (2024 outturn) — https://www.imf.org/en/news/articles/2025/04/01/pr25084-japan-imf-executive-board-concludes-2025-article-iv-consultation-with-japan
- **Re-check:** Agreed on "stale" — though the re-check cited a higher gross-debt figure (248.7% per Trading Economics), creating uncertainty on the debt level. Flagged for extra scrutiny (see below)
- **Recommended confidence:** estimated
- **Recommended fix:** Update deficit to -2.5% (2024) and growth to 0.7-0.9% (2024). Reconcile the gross-debt figure (234.9% IMF vs 248.7% Trading Economics) against a single authoritative IMF WEO edition before publishing.

### Uncertain (4)

#### UK nominal GDP
- **Current site value:** £3,097bn
- **Verified value:** £3,037bn (confirmed for calendar year 2025)
- **Measure:** UK nominal (current-price) GDP at market prices, seasonally adjusted — reference period (calendar 2025 vs fiscal 2025-26) is ambiguous in the published description
- **Primary source:** ONS and OBR — https://www.ons.gov.uk/economy/grossdomesticproductgdp and https://obr.uk/efo/economic-and-fiscal-outlook-march-2026/
- **Re-check:** Agreed that £3,037bn is the confirmed 2025 calendar-year outturn; the £3,097bn site figure differs by £60bn
- **Recommended confidence:** estimated
- **Recommended fix:** Clarify whether the figure is calendar year 2025 (£3,037bn outturn confirmed) or fiscal year 2025-26 (forecast). If the fiscal-year forecast is intended, source the exact figure from OBR detailed forecast tables or provide the basis for £3,097bn.

#### Education spending
- **Current site value:** £116bn per year
- **Verified value:** First reviewer could not access PESA 2025 tables; re-check found £120.8bn (2025-26 budgeted total UK education spending)
- **Measure:** Total UK public education spending, 2025-26 (DfE England day-to-day ~£101bn)
- **Primary source:** HM Treasury PESA 2025 — https://www.gov.uk/government/statistics/public-expenditure-statistical-analyses-2025
- **Re-check:** Disagreed — re-check rated the figure "wrong", finding £116bn is 2024-25 spending in constant prices, with the actual 2025-26 budgeted total at £120.8bn. Flagged for extra scrutiny (see below)
- **Recommended confidence:** provisional
- **Recommended fix:** Verify against PESA_2025_CP_Chapter_1_tables.xlsx (departmental breakdown) or PESA_2025_CP_Annex_C.xlsx (Total Expenditure on Services by function). If the re-check is upheld, update to £120.8bn (2025-26) and clarify the constant-prices vs current-prices basis.

#### International: Italy
- **Current site value:** gross debt 137.3% (2025), deficit 4.0% (2024), growth 0.5% (2024)
- **Verified value:** First reviewer could not access IMF WEO; re-check found gross debt 137.1% (2025), deficit -3.4% (2024), growth 0.7% (2024)
- **Measure:** General government gross debt %GDP (2025), net lending/borrowing %GDP (2024), real GDP growth (2024)
- **Primary source:** IMF WEO (datamapper access blocked); re-check via Eurostat/EC/IMF Country Reports — https://www.eunews.it/en/2026/04/22/italys-2025-public-debt-exceeds-expectations-deficit-deteriorates/
- **Re-check:** Disagreed — re-check rated all three figures "wrong". Flagged for extra scrutiny (see below)
- **Recommended confidence:** provisional
- **Recommended fix:** Verify all three from the IMF WEO April 2026 report or latest release; cross-check growth and deficit against recent Eurostat/ISTAT releases. If the re-check is upheld, update to debt 137.1%, deficit 3.4%, growth 0.7%.

#### International: Australia
- **Current site value:** gross debt 50.9% (2025), deficit 1.7% (2024), growth 1.8% (2024)
- **Verified value:** First reviewer could not access the live IMF database; re-check confirmed gross debt ~51.0% (2025) but found growth ~1.04% (2024), not 1.8%
- **Measure:** General government gross debt %GDP (2025), net lending/borrowing %GDP (2024), real GDP growth (2024)
- **Primary source:** IMF World Economic Outlook database — https://www.imf.org/external/datamapper/GGXWDG_NGDP@WEO
- **Re-check:** Disagreed — re-check rated the figure "wrong", flagging the 2024 growth figure of 1.8% as clearly incorrect (actual ~1.04%); gross debt essentially correct; deficit unverified. Flagged for extra scrutiny (see below)
- **Recommended confidence:** provisional
- **Recommended fix:** Access the live IMF WEO April 2026 database to confirm. If the re-check is upheld, correct 2024 growth to ~1.0% and retain gross debt ~51.0% (subject to rounding). The 1.7% deficit remains unverified.

## Confirmed figures

| Label | Value | Source |
| --- | --- | --- |
| Public sector net debt | £2,917bn | ONS Public Sector Finances April 2026 |
| Debt as % of GDP | 94.2% of GDP | ONS Public Sector Finances April 2026 |
| Latest monthly borrowing | £24.3bn (April 2026) | ONS Public Sector Finances April 2026 |
| Government spending | £1,368bn per year | OBR March 2026 EFO (Brief Guide) |
| Borrowing as % of GDP | 4.2% of GDP | ONS Public Sector Finances April 2026 |
| Debt interest as % of GDP | 3.6% of GDP | OBR Public Finances Databank (April 2026) |
| Tax burden | 36.3% of GDP | OBR March 2026 EFO |
| CPI inflation | 2.8% (to April 2026) | ONS Consumer Price Inflation April 2026 |
| Unemployment rate | 5.0% (Jan-Mar 2026) | ONS Labour Market Overview May 2026 |
| GDP growth | 1.1% (2026 forecast) | OBR March 2026 EFO |
| Productivity growth | 0.4% (Q1 2026) | ONS UK Productivity Jan-Mar 2026 |
| Defence spending | £62bn per year (2025-26) | HoC Library CBP-8175; SR 2025 |
| Welfare and social protection (total) | £334bn per year (2025-26) | DWP / HM Treasury benefit expenditure tables |

## Reviewer disagreements — flag for extra human scrutiny

On these figures the first reviewer and the independent re-check did not fully agree. Treat them as the highest-priority items for human judgement.

| Label | Nature of disagreement |
| --- | --- |
| UK adults (18+) | First reviewer reported 54.3-54.4m (mid-2025); re-check found the source does not publish age breakdowns and the figure is unverifiable until summer 2026. |
| Education spending | First reviewer was "uncertain" (could not access PESA); re-check rated it "wrong" and supplied £120.8bn (2025-26) vs the site's £116bn. |
| International: United Kingdom | Re-check noted the first reviewer's own 101-105% range includes the site's 103.9% debt figure, so the "wrong" verdict on debt is internally inconsistent. The deficit and growth corrections stand. |
| International: United States | First reviewer estimated the 2024 deficit at 7.0-7.4%; re-check found 7.9% per IMF Article IV, suggesting the first reviewer conflated federal and general-government measures. |
| International: Italy | First reviewer was "uncertain" (IMF access blocked); re-check rated all three figures "wrong" with specific corrected values. |
| International: Japan | Both agreed on "stale", but they cited materially different gross-debt levels (234.9% IMF vs 248.7% Trading Economics); the debt figure needs reconciliation. |
| International: Australia | First reviewer was "uncertain" (live IMF access blocked); re-check rated it "wrong", with 2024 growth of ~1.04% against the site's 1.8%. |
