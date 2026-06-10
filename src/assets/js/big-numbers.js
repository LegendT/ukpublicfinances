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
  }

  function update() {
    const raw = parseFloat(input.value);
    const valid = Number.isFinite(raw) && raw >= 0;
    errorEl.hidden = valid;
    input.setAttribute("aria-invalid", valid ? "false" : "true");
    if (!valid) return;
    echo.textContent = raw.toLocaleString("en-GB");
    render(raw);
  }

  input.addEventListener("input", update);
  document.getElementById("translator").addEventListener("submit", (e) => {
    e.preventDefault();
    update();
  });
  update();
}
