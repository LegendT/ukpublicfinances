/*
 * Unit tests for the interactive tools' maths (lib/calc.js). The browser
 * scripts import the same functions, so these guard the logic users rely on.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { translateAmount, simulateBudget } from "../src/assets/js/lib/calc.js";

const near = (a, b, tol = 0.01) => Math.abs(a - b) <= tol;

const A = {
  population: 68300000,
  adults: 54200000,
  taxpayers: 36200000,
  gdpGbpBillion: 3097,
  annualBorrowingGbpBillion: 130,
  annualDebtInterestGbpBillion: 111,
  budgets: [{ name: "NHS / health", value: 200 }],
};

test("translateAmount: £50bn per-person and shares are correct", () => {
  const rows = translateAmount(50, A);
  const by = (label) => rows.find((r) => r.label.startsWith(label));
  assert.ok(near(by("Per person").value, 50e9 / 68300000, 1), "per person");
  assert.ok(near(by("Share of GDP").value, (50 / 3097) * 100), "share of GDP %");
  assert.ok(near(by("Months of debt interest").value, (50 / 111) * 12), "months of interest");
  assert.equal(by("In millions").value, 50000, "£50bn = 50,000 million");
  assert.ok(near(by("Share of annual NHS").value, (50 / 200) * 100), "share of NHS budget");
});

test("translateAmount: scales linearly with the amount", () => {
  const a = translateAmount(10, A).find((r) => r.label.startsWith("Per person")).value;
  const b = translateAmount(20, A).find((r) => r.label.startsWith("Per person")).value;
  assert.ok(near(b, a * 2, 1), "doubling the amount doubles per-person");
});

const CFG = {
  baseline: { totalSpending: 1368, totalRevenue: 1238, borrowing: 130, debt: 2917 },
  spendingBase: { health: 200, education: 101, defence: 56, welfare: 210, pensions: 125 },
  projection: { years: 10, assumedInterestRate: 0.04 },
  gdp: 3097,
};

test("simulateBudget: baseline (no change) reproduces £130bn borrowing", () => {
  const r = simulateBudget(CFG, { ...CFG.spendingBase }, [{ perpoint: 8, points: 0 }]);
  assert.equal(r.totalSpending, 1368);
  assert.equal(r.totalRevenue, 1238);
  assert.equal(r.borrowing, 130);
  assert.equal(r.trajectory.length, 10);
});

test("simulateBudget: +£60bn health and +5pts income tax", () => {
  const spend = { ...CFG.spendingBase, health: 260 };
  const r = simulateBudget(CFG, spend, [{ perpoint: 8, points: 5 }]);
  assert.equal(r.totalSpending, 1428, "spending +60");
  assert.equal(r.totalRevenue, 1278, "revenue +40");
  assert.equal(r.borrowing, 150, "borrowing 150");
});

test("simulateBudget: deep cuts can produce a surplus (negative borrowing)", () => {
  const spend = { ...CFG.spendingBase, health: 140, welfare: 140 };
  const r = simulateBudget(CFG, spend, [{ perpoint: 8.5, points: 5 }]);
  assert.ok(r.borrowing < 0, "spending cuts + tax rise => surplus");
});

test("simulateBudget: a large surplus clears debt but never goes negative", () => {
  const spend = { health: 100, education: 50, defence: 28, welfare: 105, pensions: 63 };
  const r = simulateBudget(CFG, spend, [{ perpoint: 8.5, points: 30 }]);
  assert.ok(r.borrowing < 0, "deep cuts + big tax rise => surplus");
  assert.ok(r.trajectory.every((t) => t.debt >= 0), "debt is floored at zero");
  assert.equal(r.trajectory[r.trajectory.length - 1].debt, 0, "debt reaches zero");
});

test("simulateBudget: debt path compounds interest then adds borrowing", () => {
  const r = simulateBudget(CFG, { ...CFG.spendingBase }, [{ perpoint: 8, points: 0 }]);
  assert.ok(near(r.trajectory[0].debt, 2917 * 1.04 + 130, 0.5), "year 1 debt");
  assert.ok(r.trajectory[4].debt > r.trajectory[0].debt, "debt grows over the path");
});
