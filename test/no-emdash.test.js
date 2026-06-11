/*
 * Style guard: no em-dashes in the source or the committed documentation.
 * The project's copy avoids the em-dash (U+2014) deliberately, so this fails
 * the build if one sneaks back in, whether as the literal character or
 * URL-encoded (%E2%80%94) in a link. En-dashes (U+2013) are allowed, since
 * they are used in numeric ranges.
 *
 * Local-only working docs (the data audit, outreach notes, and the email
 * setup runbook) are gitignored and excluded.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCAN_DIRS = ["src", "docs"].map((d) => path.join(ROOT, d));
const SCAN_FILES = [path.join(ROOT, "README.md")];
const TEXT_EXT = new Set([
  ".njk", ".js", ".mjs", ".cjs", ".json", ".css", ".md",
  ".svg", ".txt", ".webmanifest", ".xml", ".html",
]);
// Gitignored, local-only working documents.
const SKIP = new Set([
  "DATA-AUDIT.md", "DATA-AUDIT-INTL.md", "OUTREACH.md", "EMAIL-SETUP-ZOHO.md",
]);
const EM_DASH = "—";
const EM_DASH_ENCODED = /%e2%80%94/gi;

function textFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...textFiles(full));
    else if (TEXT_EXT.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

test("no em-dashes in source or docs (use commas, colons, full stops, or parentheses)", () => {
  const files = [...SCAN_DIRS.flatMap(textFiles), ...SCAN_FILES];
  const offenders = [];
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const literal = text.split(EM_DASH).length - 1;
    const encoded = (text.match(EM_DASH_ENCODED) || []).length;
    if (literal + encoded > 0) {
      offenders.push(`${path.relative(ROOT, file)} (${literal} literal, ${encoded} encoded)`);
    }
  }
  assert.equal(offenders.length, 0, `em-dash found in: ${offenders.join("; ")}`);
});
