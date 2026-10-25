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
  budgets: [{ name: "NHS / health", value: 100 }, { name: "Central government receipts", value: 200, noun: "" }],
};

test("translateAmount: £50bn per-person and shares are correct", () => {
  const rows = translateAmount(50, A);
  const by = (label) => rows.find((r) => r.label.startsWith(label));
  assert.ok(near(by("Per person").value, 50e9 / A.population, 1), "per person");
  assert.ok(near(by("Share of GDP").value, (50 / A.gdpGbpBillion) * 100), "share of GDP %");
  assert.ok(near(by("Months of debt interest").value, (50 / A.annualDebtInterestGbpBillion) * 12), "months of interest");
  assert.equal(by("In millions").value, 50000, "£50bn = 50,000 million");
  assert.ok(near(by("Share of annual NHS").value, (50 / A.budgets[0].value) * 100), "share of NHS budget");
  assert.ok(rows.some((r) => r.label === "Share of annual NHS / health spending"), "a budget row says spending");
  assert.ok(rows.some((r) => r.label === "Share of annual Central government receipts"), "receipts are not called spending");
});

test("translateAmount: scales linearly with the amount", () => {
  const a = translateAmount(10, A).find((r) => r.label.startsWith("Per person")).value;
  const b = translateAmount(20, A).find((r) => r.label.startsWith("Per person")).value;
  assert.ok(near(b, a * 2, 1), "doubling the amount doubles per-person");
});

const CFG = {
  baseline: { totalSpending: 1000, totalRevenue: 900, borrowing: 100, debt: 2000 },
  spendingBase: { health: 100, education: 50, defence: 40, welfare: 150, pensions: 60 },
  // 80 is 4% of the 2000 debt, so this year's interest and the model's rate agree.
  debtInterest: 80,
  projection: { years: 10, assumedInterestRate: { value: 0.04 }, assumedNominalGdpGrowth: { value: 0.03 } },
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

// Borrowing is spending minus revenue, and spending already includes debt interest,
// so the debt path must not add interest on top of it a second time.
test("simulateBudget: interest is counted once, so year 1 adds exactly this year's borrowing", () => {
  const r = simulateBudget(CFG, { ...CFG.spendingBase }, [{ perpoint: 8, points: 0 }]);
  assert.ok(near(r.trajectory[0].debt, CFG.baseline.debt + CFG.baseline.borrowing, 0.5), "year 1 debt");
  assert.ok(r.trajectory[4].debt > r.trajectory[0].debt, "a deficit still grows the debt");
});

// The fixture's interest equals rate x debt, which would hide a year 1 that ignored this
// year's actual interest. Pull them apart so that branch is tested on its own.
test("simulateBudget: year 1 uses this year's interest, later years the assumed rate", () => {
  const cfg = { ...CFG, debtInterest: 70 };
  const r = simulateBudget(cfg, { ...cfg.spendingBase }, [{ perpoint: 8, points: 0 }]);
  const rate = cfg.projection.assumedInterestRate.value;
  const primaryDeficit = cfg.baseline.borrowing - cfg.debtInterest;
  assert.ok(near(r.trajectory[0].debt, cfg.baseline.debt + cfg.baseline.borrowing, 0.5), "year 1 debt");
  assert.ok(near(r.trajectory[1].debt, r.trajectory[0].debt * (1 + rate) + primaryDeficit, 0.5), "year 2 debt");
});

test("simulateBudget: interest grows with the debt in later years", () => {
  const r = simulateBudget(CFG, { ...CFG.spendingBase }, [{ perpoint: 8, points: 0 }]);
  const rate = CFG.projection.assumedInterestRate.value;
  const primaryDeficit = CFG.baseline.borrowing - CFG.debtInterest;
  const year2 = r.trajectory[0].debt * (1 + rate) + primaryDeficit;
  assert.ok(near(r.trajectory[1].debt, year2, 0.5), "year 2 debt");
});

test("simulateBudget: a budget balanced after interest holds the debt level", () => {
  const spend = { ...CFG.spendingBase, welfare: CFG.spendingBase.welfare - CFG.baseline.borrowing };
  const r = simulateBudget(CFG, spend, [{ perpoint: 8, points: 0 }]);
  assert.equal(r.borrowing, 0);
  assert.ok(r.trajectory.every((t) => near(t.debt, CFG.baseline.debt, 0.5)), "debt stays at the baseline");
});

test("simulateBudget: GDP grows, so a level debt is a falling share of GDP", () => {
  const spend = { ...CFG.spendingBase, welfare: CFG.spendingBase.welfare - CFG.baseline.borrowing };
  const r = simulateBudget(CFG, spend, [{ perpoint: 8, points: 0 }]);
  const g = CFG.projection.assumedNominalGdpGrowth.value;
  assert.ok(near(r.trajectory[0].pctGdp, (CFG.baseline.debt / (CFG.gdp * (1 + g))) * 100, 0.01), "year 1 ratio");
  assert.ok(r.trajectory[9].pctGdp < r.trajectory[0].pctGdp, "ratio falls");
});
