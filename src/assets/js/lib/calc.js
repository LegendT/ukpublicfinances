/*
 * Pure calculations for the interactive tools. No DOM and no formatting, so the
 * maths can be unit-tested in Node (see test/calc.test.js) and reused by the
 * browser scripts, which add only the DOM and presentation around it.
 */

// Big numbers translator: an amount in £ billion against the assumptions.
// Returns rows of { label, kind, value } where value is a raw number and kind
// tells the caller how to format it.
export function translateAmount(billions, a) {
  const pounds = billions * 1e9;
  const rows = [
    { label: "Per person in the UK", kind: "gbp", value: pounds / a.population },
    { label: "Per adult (18 and over)", kind: "gbp", value: pounds / a.adults },
    { label: "Per income tax payer", kind: "gbp", value: pounds / a.taxpayers },
    { label: "In millions", kind: "millions", value: billions * 1000 },
    { label: "Share of GDP", kind: "pct", value: (billions / a.gdpGbpBillion) * 100 },
    { label: "Share of a year's borrowing", kind: "pct", value: (billions / a.annualBorrowingGbpBillion) * 100 },
    { label: "Months of debt interest", kind: "months", value: (billions / a.annualDebtInterestGbpBillion) * 12 },
  ];
  for (const b of a.budgets) {
    rows.push({ label: `Share of annual ${b.name} spending`, kind: "pct", value: (billions / b.value) * 100 });
  }
  return rows;
}

// Budget simulator: given the config, the current spending values, and the tax
// point changes, return totals, borrowing, and the multi-year debt path.
//   spendValues: { health: 200, education: 101, ... }  (current slider values)
//   taxPoints:   [{ perpoint: 8, points: 2 }, ...]
export function simulateBudget(cfg, spendValues, taxPoints) {
  let spendDelta = 0;
  for (const key in spendValues) {
    spendDelta += spendValues[key] - cfg.spendingBase[key];
  }
  const totalSpending = cfg.baseline.totalSpending + spendDelta;

  let revDelta = 0;
  for (const t of taxPoints) {
    revDelta += t.points * t.perpoint;
  }
  const totalRevenue = cfg.baseline.totalRevenue + revDelta;

  const borrowing = totalSpending - totalRevenue;
  const rate = cfg.projection.assumedInterestRate;
  let debt = cfg.baseline.debt;
  const trajectory = [];
  for (let y = 1; y <= cfg.projection.years; y++) {
    // Floor at zero: once the debt is cleared it stays cleared. We don't model
    // a surplus building up into net assets. This tool is about debt.
    debt = Math.max(0, debt * (1 + rate) + borrowing);
    trajectory.push({ year: y, debt, pctGdp: (debt / cfg.gdp) * 100 });
  }
  return { totalSpending, totalRevenue, borrowing, trajectory };
}
