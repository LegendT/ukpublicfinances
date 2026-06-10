import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Eleventy configuration.
 *
 * Data lives in src/_data as JSON and is auto-loaded as global data, so no
 * figure is ever hard-coded into a template. Swapping placeholder data for
 * live API output later means changing only the JSON (or the script that
 * writes it) — templates and components stay untouched.
 */
export default function (eleventyConfig) {
  // Copy static assets straight through.
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  // Root-level icons and manifest (favicon.ico answers the default /favicon.ico request).
  eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "favicon.ico" });
  eleventyConfig.addPassthroughCopy({ "src/site.webmanifest": "site.webmanifest" });

  // Find the first item in an array whose key matches a value.
  // Nunjucks' own selectattr(..., "equalto", ...) is unreliable here, so this
  // gives templates a dependable lookup.
  eleventyConfig.addFilter("findBy", (arr, key, value) => {
    if (!Array.isArray(arr)) return undefined;
    return arr.find((item) => item && item[key] === value);
  });

  // Format a number with thousands separators (British locale).
  eleventyConfig.addFilter("number", (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return value;
    }
    return new Intl.NumberFormat("en-GB").format(Number(value));
  });

  // ISO date (YYYY-MM-DD) for sitemap lastmod and machine-readable output.
  eleventyConfig.addFilter("isoDate", (value) => {
    const date = value ? new Date(value) : new Date();
    return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
  });

  // Format an ISO date as a readable British date, e.g. "10 June 2026".
  eleventyConfig.addFilter("readableDate", (value) => {
    if (!value) return value;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  });

  // Render a number of pounds in trillions/billions where it aids reading.
  eleventyConfig.addFilter("poundsShort", (valueInBillions) => {
    const billions = Number(valueInBillions);
    if (Number.isNaN(billions)) return valueInBillions;
    if (Math.abs(billions) >= 1000) {
      return `£${(billions / 1000).toLocaleString("en-GB", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      })} trillion`;
    }
    return `£${billions.toLocaleString("en-GB")} billion`;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
    pathPrefix: process.env.PATH_PREFIX || "/",
  };
}
