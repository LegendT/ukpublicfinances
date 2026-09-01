/*
 * Basic data-integrity tests. These guard the data contract that the templates
 * and tools rely on, so swapping placeholder figures for live data fails loudly
 * if a required field goes missing or a confidence level is mistyped.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const load = (name) => JSON.parse(readFileSync(resolve(dir, "../src/_data", name), "utf8"));

const VALID_CONFIDENCE = ["official", "provisional", "estimated", "calculated"];

test("dashboard has the five required headline metrics", () => {
  const d = load("dashboard.json");
  const ids = d.metrics.map((m) => m.id);
  ["net-debt", "debt-gdp", "debt-per-person", "debt-interest", "monthly-borrowing"].forEach((id) => {
    assert.ok(ids.includes(id), `missing metric: ${id}`);
  });
});

test("every dashboard metric carries source and provenance fields", () => {
  const d = load("dashboard.json");
  for (const m of d.metrics) {
    for (const field of ["metric_name", "value", "unit", "source_name", "source_url", "retrieved_date", "confidence_level"]) {
      assert.ok(m[field] !== undefined && m[field] !== "", `${m.id} missing ${field}`);
    }
    assert.ok(VALID_CONFIDENCE.includes(m.confidence_level), `${m.id} bad confidence: ${m.confidence_level}`);
  }
});

test("timeseries years are ascending and ratios are plausible", () => {
  const t = load("debtTimeseries.json");
  let prev = -Infinity;
  for (const row of t.series) {
    assert.ok(row.year > prev, `years not ascending at ${row.year}`);
    prev = row.year;
    if (row.debtToGdp !== null) {
      assert.ok(row.debtToGdp >= 0 && row.debtToGdp < 400, `implausible debt/GDP at ${row.year}`);
    }
  }
});

test("spending comparison areas are positive numbers with sources", () => {
  const s = load("spendingComparisons.json");
  assert.ok(s.areas.length >= 5);
  for (const a of s.areas) {
    assert.ok(typeof a.value === "number" && a.value > 0, `${a.id} bad value`);
    assert.ok(a.source_url, `${a.id} missing source_url`);
  }
});

test("glossary covers the required core terms", () => {
  const g = load("glossary.json");
  const terms = g.terms.map((t) => t.term.toLowerCase());
  ["deficit", "gilts", "gdp"].forEach((req) => {
    assert.ok(terms.some((t) => t.includes(req)), `glossary missing ${req}`);
  });
});

test("every source has a url and valid confidence level", () => {
  const s = load("sources.json");
  for (const src of s.sources) {
    assert.ok(/^https?:\/\//.test(src.url), `${src.id} bad url`);
    assert.ok(VALID_CONFIDENCE.includes(src.confidence_level), `${src.id} bad confidence`);
  }
});

test("international comparison has all eight countries with numeric debt/GDP", () => {
  const i = load("internationalComparisons.json");
  assert.equal(i.countries.length, 8, "expected 8 countries");
  assert.ok(i.countries.some((c) => c.id === "uk"), "UK must be present");
  for (const c of i.countries) {
    assert.ok(typeof c.debtToGdp === "number" && c.debtToGdp > 0, `${c.id} bad debtToGdp`);
  }
});

test("health indicators carry status, source, and valid confidence", () => {
  const ind = load("indicators.json");
  assert.ok(ind.indicators.length >= 8, "expected a wide set of indicators");
  const VALID_STATUS = ["rising", "falling", "stable"];
  for (const m of ind.indicators) {
    assert.ok(VALID_STATUS.includes(m.status), `${m.id} bad status: ${m.status}`);
    assert.ok(/^https?:\/\//.test(m.source_url), `${m.id} bad source_url`);
    assert.ok(VALID_CONFIDENCE.includes(m.confidence_level), `${m.id} bad confidence`);
  }
});

test("monthly updates are well formed, newest first, and match the dashboard", () => {
  const m = load("monthlyUpdates.json");
  const dash = load("dashboard.json");
  assert.ok(m.updates.length >= 1, "need at least one monthly update");

  // Archived entries get edited too, so check every one, not just the newest.
  for (const u of m.updates) {
    for (const field of ["id", "month", "published", "source_url", "headline", "borrowing", "answers"]) {
      assert.ok(u[field] !== undefined && u[field] !== null && u[field] !== "", `${u.id} missing ${field}`);
    }
    // id must be YYYY-MM: it drives the /monthly/<id>/ permalink and the newest-first sort.
    assert.match(u.id, /^\d{4}-\d{2}$/, `${u.id} id must be YYYY-MM`);
    // The sitemap dates this month's page from published, unguarded, so an
    // unparseable value would emit an empty lastmod rather than a wrong one.
    assert.match(u.published, /^\d{4}-\d{2}-\d{2}$/, `${u.id} published must be YYYY-MM-DD`);
    for (const q of ["whatChanged", "borrowingWhy", "taxReceipts", "spending", "debtInterest", "vsObr"]) {
      assert.ok(u.answers[q], `${u.id} answers missing ${q}`);
    }
    assert.equal(typeof u.borrowing.value, "number", `${u.id} borrowing value must be a number`);
    assert.equal(u.borrowing.unit, "£ billion", `${u.id} unit drifted from the unit the template renders`);
  }

  // ids are YYYY-MM, so a reverse lexical sort is newest first. The page renders updates[0].
  const ids = m.updates.map((u) => u.id);
  assert.deepEqual(ids, [...ids].sort().reverse(), "updates must be newest first");

  // The homepage and the monthly page must not tell different stories about the same month.
  const latest = dash.metrics.find((x) => x.id === "monthly-borrowing");
  assert.equal(latest.value, m.updates[0].borrowing.value, "dashboard latest borrowing != newest monthly update");
  assert.equal(dash.referencePeriod, m.updates[0].month, "dashboard referencePeriod != newest monthly update");
});

test("current figures are consistent across data files (no silent drift)", () => {
  const dash = load("dashboard.json");
  const a = load("assumptions.json");
  const spend = load("spendingComparisons.json");
  const intl = load("internationalComparisons.json");
  const ind = load("indicators.json");
  const metric = (id) => dash.metrics.find((m) => m.id === id).value;
  const area = (id) => spend.areas.find((s) => s.id === id).value;
  const indicator = (id) => ind.indicators.find((i) => i.id === id).value;
  const sup = dash.supporting;
  const tr = a.translator;
  const base = a.budgetSimulator.baselineGbpBillion;
  const lever = a.budgetSimulator.spendingLeversGbpBillion;
  const near = (x, y, tol) => Math.abs(x - y) <= tol;

  // Figures that appear in more than one file must match.
  assert.equal(sup.gdp.value, tr.gdpGbpBillion, "GDP differs: dashboard vs translator");
  assert.equal(sup.population.value, tr.population, "population differs");
  assert.equal(sup.adults.value, tr.adults, "adults differ");
  assert.equal(sup.taxpayers.value, tr.taxpayers, "taxpayers differ");
  assert.equal(base.debt, metric("net-debt"), "simulator debt != dashboard net debt");
  assert.equal(tr.annualDebtInterestGbpBillion, metric("debt-interest"), "translator interest != dashboard interest");
  assert.equal(area("defence"), lever.defence, "defence differs: spending vs simulator");
  assert.equal(area("state-pension"), lever.pensions, "pension differs: spending vs simulator");

  // The health-page indicators repeat figures held elsewhere; they must not drift apart.
  assert.equal(indicator("debt-gdp"), metric("debt-gdp"), "debt-gdp differs: indicators vs dashboard");
  assert.equal(indicator("revenue"), base.totalRevenue, "revenue differs: indicators vs simulator");
  assert.equal(indicator("spending"), base.totalSpending, "spending differs: indicators vs simulator");

  // Derived relationships must hold.
  assert.ok(near(metric("net-debt") / (metric("debt-gdp") / 100), sup.gdp.value, 15), "implied GDP != stated GDP");
  assert.equal(base.totalSpending - base.totalRevenue, base.borrowing, "simulator: spending - revenue != borrowing");
  assert.ok(near(area("social-protection"), lever.welfare + lever.pensions, 6), "welfare total != welfare + pension");
  assert.ok(intl.countries.find((c) => c.id === "uk").debtToGdp > metric("debt-gdp"), "intl gross UK should exceed national net");
});

// The timeline, interest and lifetime pages label their latest row with the
// year taken from referencePeriod, so a period that does not end in a year
// renders an empty table heading and nothing else complains.
test("the dashboard reference period yields the year the templates label figures with", () => {
  const dash = load("dashboard.json");
  const match = String(dash.referencePeriod).match(/(\d{4})\s*$/);
  assert.ok(match, `referencePeriod must end in a four-digit year: "${dash.referencePeriod}"`);
  const netDebt = dash.metrics.find((m) => m.id === "net-debt");
  assert.equal(
    Number(match[1]),
    Number(netDebt.date.slice(0, 4)),
    "referencePeriod year differs from the net debt metric's date"
  );
});

// Nothing in this repo can tell you that the Prime Minister changed, or that a
// figure it cites has been superseded. Only a person checking can. These dates
// record when someone last did, and this test fails once one goes stale, so a
// missed refresh surfaces on the next `npm test` rather than on the live site.
// The window is a little longer than the monthly ONS cycle, so an ordinary
// refresh never trips it and a skipped one always does.
const MAX_CHECK_AGE_DAYS = 45;

test("every human-checked date is current", () => {
  const checks = [
    ["dashboard.json", load("dashboard.json").lastUpdated],
    ["indicators.json", load("indicators.json").lastUpdated],
    ["primeMinisters.json", load("primeMinisters.json").checkedOn],
  ];
  // Compared as whole local days. Date.parse on a date-only string gives UTC
  // midnight, so measuring against the current instant reads a date stamped
  // today as a day in the future for the first hour of a BST morning.
  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  checks.forEach(([file, date]) => {
    assert.match(String(date), /^\d{4}-\d{2}-\d{2}$/, `${file}: check date missing or malformed`);
    const ageDays = Math.round((Date.parse(todayIso) - Date.parse(date)) / 86400000);
    // A date typed with the wrong year would otherwise switch the check off
    // for as long as it stayed in the future.
    assert.ok(ageDays >= 0, `${file}: check date ${date} is in the future.`);
    assert.ok(
      ageDays <= MAX_CHECK_AGE_DAYS,
      `${file}: check date ${date} is ${ageDays} days old, past the ${MAX_CHECK_AGE_DAYS} day limit. Re-verify the file against its source, then set the date to today. See docs/UPDATING-DATA.md.`
    );
  });
});
