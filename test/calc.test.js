/*
 * Unit tests for the interactive tools' maths (lib/calc.js). The browser
 * scripts import the same functions, so these guard the logic users rely on.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { translateAmount, simulateBudget } from "../src/assets/js/lib/calc.js";

const near = (a, b, tol = 0.01) => Math.abs(a - b) <= tol;

// Synthetic round-number fixtures, deliberately not the site's live figures,
// so they cannot be mistaken for real data during a future refresh.
const A = {
  population: 50000000,
  adults: 40000000,
  taxpayers: 30000000,
  gdpGbpBillion: 2000,
  annualBorrowingGbpBillion: 100,
  annualDebtInterestGbpBillion: 50,
  budgets: [{ name: "NHS / health", value: 100 }],
};

test("translateAmount: £50bn per-person and shares are correct", () => {
  const rows = translateAmount(50, A);
  const by = (label) => rows.find((r) => r.label.startsWith(label));
  assert.ok(near(by("Per person").value, 50e9 / A.population, 1), "per person");
  assert.ok(near(by("Share of GDP").value, (50 / A.gdpGbpBillion) * 100), "share of GDP %");
  assert.ok(near(by("Months of debt interest").value, (50 / A.annualDebtInterestGbpBillion) * 12), "months of interest");
  assert.equal(by("In millions").value, 50000, "£50bn = 50,000 million");
  assert.ok(near(by("Share of annual NHS").value, (50 / A.budgets[0].value) * 100), "share of NHS budget");
});

test("translateAmount: scales linearly with the amount", () => {
  const a = translateAmount(10, A).find((r) => r.label.startsWith("Per person")).value;
  const b = translateAmount(20, A).find((r) => r.label.startsWith("Per person")).value;
  assert.ok(near(b, a * 2, 1), "doubling the amount doubles per-person");
});

const CFG = {
  baseline: { totalSpending: 1000, totalRevenue: 900, borrowing: 100, debt: 2000 },
  spendingBase: { health: 100, education: 50, defence: 40, welfare: 150, pensions: 60 },
  projection: { years: 10, assumedInterestRate: 0.04 },
  gdp: 2000,
};

test("simulateBudget: baseline (no change) reproduces the baseline borrowing", () => {
  const r = simulateBudget(CFG, { ...CFG.spendingBase }, [{ perpoint: 8, points: 0 }]);
  assert.equal(r.totalSpending, CFG.baseline.totalSpending);
  assert.equal(r.totalRevenue, CFG.baseline.totalRevenue);
  assert.equal(r.borrowing, CFG.baseline.borrowing);
  assert.equal(r.trajectory.length, CFG.projection.years);
});

test("simulateBudget: +£60bn health and +5pts income tax", () => {
  const spend = { ...CFG.spendingBase, health: CFG.spendingBase.health + 60 };
  const r = simulateBudget(CFG, spend, [{ perpoint: 8, points: 5 }]);
  assert.equal(r.totalSpending, CFG.baseline.totalSpending + 60, "spending +60");
  assert.equal(r.totalRevenue, CFG.baseline.totalRevenue + 40, "revenue +40");
  assert.equal(r.borrowing, CFG.baseline.borrowing + 20, "borrowing +20");
});

test("simulateBudget: deep cuts can produce a surplus (negative borrowing)", () => {
  const spend = { ...CFG.spendingBase, health: 60, welfare: 100 };
  const r = simulateBudget(CFG, spend, [{ perpoint: 8.5, points: 5 }]);
  assert.ok(r.borrowing < 0, "spending cuts + tax rise => surplus");
});

test("simulateBudget: a large surplus clears debt but never goes negative", () => {
  const spend = { health: 30, education: 20, defence: 15, welfare: 40, pensions: 25 };
  const r = simulateBudget(CFG, spend, [{ perpoint: 8.5, points: 30 }]);
  assert.ok(r.borrowing < 0, "deep cuts + big tax rise => surplus");
  assert.ok(r.trajectory.every((t) => t.debt >= 0), "debt is floored at zero");
  assert.equal(r.trajectory[r.trajectory.length - 1].debt, 0, "debt reaches zero");
});

test("simulateBudget: debt path compounds interest then adds borrowing", () => {
  const r = simulateBudget(CFG, { ...CFG.spendingBase }, [{ perpoint: 8, points: 0 }]);
  const grown = CFG.baseline.debt * (1 + CFG.projection.assumedInterestRate) + CFG.baseline.borrowing;
  assert.ok(near(r.trajectory[0].debt, grown, 0.5), "year 1 debt");
  assert.ok(r.trajectory[4].debt > r.trajectory[0].debt, "debt grows over the path");
});
