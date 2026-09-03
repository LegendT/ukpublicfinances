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

  // JSON for embedding inside a <script> tag — escapes "<" so a value can never
  // break out of the script element (defensive; the data is trusted).
  eleventyConfig.addFilter("jsonScript", (value) =>
    JSON.stringify(value).replace(/</g, "\\u003c")
  );

  // Format a number with thousands separators (British locale).
  eleventyConfig.addFilter("number", (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return value;
    }
    return new Intl.NumberFormat("en-GB").format(Number(value));
  });

  // ISO date (YYYY-MM-DD) for sitemap lastmod and machine-readable output.
  // Empty for a missing or unparseable value. It must never fall back to
  // today: a date the site did not have is worse than no date at all.
  eleventyConfig.addFilter("isoDate", (value) => {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
  });

  // The newest of several ISO dates, for a page whose figures come from more than
  // one data file. Anything not YYYY-MM-DD is skipped rather than sorted as text,
  // and an empty list gives undefined so the page renders no dateModified at all.
  // Same rule as isoDate: a date the site did not have is worse than no date.
  eleventyConfig.addFilter("latestOf", (values) => {
    if (!Array.isArray(values)) return undefined;
    const dates = values.filter((v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v));
    return dates.length ? dates.sort().at(-1) : undefined;
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

  // Hold one decimal place so a whole-number figure keeps the precision ONS published.
  eleventyConfig.addFilter("oneDp", (value) => {
    const n = Number(value);
    return Number.isNaN(n) ? value : n.toFixed(1);
  });

  // The year the published figures describe, read off the dashboard's
  // reference period ("July 2026"), so no template pins it as a literal.
  // Deliberately throws on a period with no year rather than returning a
  // blank: Netlify deploys run the build alone, so this is the only check
  // between malformed data and a live page.
  eleventyConfig.addFilter("yearOf", (period) =>
    Number(String(period).match(/(\d{4})\s*$/)[1])
  );

  // The calendar year at build time. Deliberately not the same value as
  // yearOf(referencePeriod): the figures describe a past month, whereas the
  // birth-year input has to accept someone born this year.
  eleventyConfig.addGlobalData("buildYear", () => new Date().getFullYear());

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
