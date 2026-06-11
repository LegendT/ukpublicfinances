/*
 * Big numbers translator (DOM + presentation).
 * The maths lives in lib/calc.js; this reads the assumptions, recalculates on
 * input, formats each row by kind, and renders cards plus a table fallback.
 */
import { translateAmount } from "./lib/calc.js";

const dataEl = document.getElementById("translator-assumptions");
if (dataEl) {
  const A = JSON.parse(dataEl.textContent);

  const input = document.getElementById("amount");
  const errorEl = document.getElementById("amount-error");
  const echo = document.getElementById("echo-amount");
  const resultsEl = document.getElementById("results");
  const tableBody = document.getElementById("results-table-body");
  const section = document.getElementById("results-section");
  const tableWrap = document.getElementById("results-table-wrap");
  const statusEl = document.getElementById("amount-status");

  const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
  const fmt = (r) => {
    switch (r.kind) {
      case "gbp":
        return gbp.format(r.value);
      case "pct":
        return `${r.value.toLocaleString("en-GB", { maximumFractionDigits: 1 })}%`;
      case "millions":
        return `${r.value.toLocaleString("en-GB")} million`;
      case "months":
        return `${r.value.toLocaleString("en-GB", { maximumFractionDigits: 1 })} months`;
      default:
        return String(r.value);
    }
  };

  function render(billions) {
    const rows = translateAmount(billions, A).map((r) => ({ label: r.label, value: fmt(r) }));
    resultsEl.innerHTML = rows
      .map(
        (r) =>
          `<article class="metric-card metric-card--mini"><p class="metric-card__value">${r.value}</p><p class="metric-card__label">${r.label}</p></article>`
      )
      .join("");
    tableBody.innerHTML = rows
      .map((r) => `<tr><th scope="row">${r.label}</th><td class="num">${r.value}</td></tr>`)
      .join("");
    return rows;
  }

  // The results grid is not a live region (ten cards re-announced per
  // keystroke); a short status line carries the announcement, debounced so
  // typing "100" produces one message, not three.
  // The first render happens on page load; announcing it would talk over the
  // page title before the user has done anything.
  let firstRun = true;
  let statusTimer;
  function announce(message) {
    if (firstRun) return;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => {
      statusEl.textContent = message;
    }, 400);
  }

  // Errors wait for blur or submit; "ten" or a cleared field mid-edit should
  // not interrupt with an alert on every keystroke.
  function update(showError) {
    const raw = parseFloat(input.value);
    const valid = Number.isFinite(raw) && raw >= 0;
    // The fallback table holds the same results, so it goes stale together
    // with the cards and must hide with them.
    section.hidden = !valid;
    tableWrap.hidden = !valid;
    if (valid) {
      errorEl.hidden = true;
      input.setAttribute("aria-invalid", "false");
      // Referenced text is exposed even while hidden, so the error id is only
      // linked when the error is actually showing.
      input.setAttribute("aria-describedby", "amount-hint");
      echo.textContent = raw.toLocaleString("en-GB");
      const rows = render(raw);
      const first = rows[0];
      announce(
        `Results updated. £${raw.toLocaleString("en-GB")} billion is roughly ${first.value} ${first.label.charAt(0).toLowerCase()}${first.label.slice(1)}.`
      );
      return;
    }
    announce("");
    if (showError) {
      errorEl.hidden = false;
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", "amount-hint amount-error");
    }
  }

  input.addEventListener("input", () => update(false));
  input.addEventListener("blur", () => update(true));
  document.getElementById("translator").addEventListener("submit", (e) => {
    e.preventDefault();
    update(true);
  });
  update(false);
  firstRun = false;
}
