/*
 * Style guard: no page is dated by its file timestamp.
 *
 * Netlify builds from a fresh clone, so every file carries the checkout time.
 * Dating a page by it restamped all fifteen pages as modified on every deploy,
 * whatever had actually changed, which is the pattern search engines learn to
 * ignore. Pages are dated by the data they render (`dataUpdated`), or they
 * carry no date at all.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

test("no page is dated by its file timestamp", () => {
  const dated = [
    ["src/sitemap.njk", /<lastmod>([^<]*)<\/lastmod>/g],
    ["src/_includes/layouts/base.njk", /"dateModified":\s*"([^"]*)"/g],
  ];
  const offenders = [];
  for (const [file, pattern] of dated) {
    const text = fs.readFileSync(path.join(ROOT, file), "utf8");
    for (const [, expression] of text.matchAll(pattern)) {
      if (/\b(page|item)\.date\b/.test(expression)) {
        offenders.push(`${file}: ${expression.trim()}`);
      }
    }
  }
  assert.equal(offenders.length, 0, `dated by file timestamp: ${offenders.join("; ")}`);
});
