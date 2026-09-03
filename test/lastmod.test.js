/*
 * Style guards for sitemap.xml: how pages are dated, and what may be left out.
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

test("a page left out of the sitemap is still audited for accessibility", () => {
  // a11y:ci takes its route list from sitemap.xml, so omitting a page there drops
  // it from the WCAG audit as well, silently. .pa11yci.json is where such pages are
  // named, as 404.html already is. This pairs the two so neither can move alone.
  const pa11y = JSON.parse(fs.readFileSync(path.join(ROOT, ".pa11yci.json"), "utf8"));
  const listed = pa11y.urls.join(" ");
  const src = path.join(ROOT, "src");
  for (const file of fs.readdirSync(src).filter((f) => f.endsWith(".njk"))) {
    const text = fs.readFileSync(path.join(src, file), "utf8");
    if (!/^\s*canonicalUrl:/m.test(text)) continue;
    const route = `/${file.replace(/\.njk$/, "")}/`;
    assert.ok(listed.includes(route), `${file} canonicalises elsewhere, so the sitemap omits it; add ${route} to .pa11yci.json`);
  }
});
