/*
 * Style guard: no em-dashes anywhere in the source. The project's copy avoids
 * the em-dash (U+2014) deliberately, so this fails the build if one sneaks back
 * in, whether as the literal character or URL-encoded (%E2%80%94) in a link.
 * En-dashes (U+2013) are allowed, since they are used in numeric ranges.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SRC = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");
const TEXT_EXT = new Set([
  ".njk", ".js", ".mjs", ".cjs", ".json", ".css", ".md",
  ".svg", ".txt", ".webmanifest", ".xml", ".html",
]);
const EM_DASH = "—";
const EM_DASH_ENCODED = /%e2%80%94/i;

function textFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...textFiles(full));
    else if (TEXT_EXT.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

test("no em-dashes in source files (use commas, colons, full stops, or parentheses)", () => {
  const offenders = [];
  for (const file of textFiles(SRC)) {
    const text = fs.readFileSync(file, "utf8");
    const literal = text.split(EM_DASH).length - 1;
    const encoded = (text.match(new RegExp(EM_DASH_ENCODED, "gi")) || []).length;
    if (literal + encoded > 0) {
      offenders.push(`${path.relative(SRC, file)} (${literal} literal, ${encoded} encoded)`);
    }
  }
  assert.equal(offenders.length, 0, `em-dash found in: ${offenders.join("; ")}`);
});
