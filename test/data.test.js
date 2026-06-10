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

test("monthly updates are present and answer the standard questions", () => {
  const m = load("monthlyUpdates.json");
  assert.ok(m.updates.length >= 1, "need at least one monthly update");
  const u = m.updates[0];
  for (const field of ["month", "published", "source_url", "headline", "borrowing", "answers"]) {
    assert.ok(u[field] !== undefined && u[field] !== "", `latest update missing ${field}`);
  }
  for (const q of ["whatChanged", "borrowingWhy", "taxReceipts", "spending", "debtInterest", "vsObr"]) {
    assert.ok(u.answers[q], `update answers missing ${q}`);
  }
});
