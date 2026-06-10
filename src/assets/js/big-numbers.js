/*
 * Big numbers translator.
 * Reads assumptions from an inline JSON script tag, recalculates on input, and
 * renders both cards (progressive enhancement) and a table fallback.
 */
(function () {
  "use strict";

  const dataEl = document.getElementById("translator-assumptions");
  if (!dataEl) return;
  const A = JSON.parse(dataEl.textContent);

  const input = document.getElementById("amount");
  const errorEl = document.getElementById("amount-error");
  const echo = document.getElementById("echo-amount");
  const resultsEl = document.getElementById("results");
  const tableBody = document.getElementById("results-table-body");

  const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
  const pct = (n) => `${n.toLocaleString("en-GB", { maximumFractionDigits: 1 })}%`;

  // Build the list of comparisons for a given amount (in £ billion).
  function translate(billions) {
    const pounds = billions * 1e9;
    const rows = [
      { label: "Per person in the UK", value: gbp.format(pounds / A.population) },
      { label: "Per adult (18 and over)", value: gbp.format(pounds / A.adults) },
      { label: "Per income tax payer", value: gbp.format(pounds / A.taxpayers) },
      { label: "In millions", value: `${(billions * 1000).toLocaleString("en-GB")} million` },
      { label: "Share of GDP", value: pct((billions / A.gdpGbpBillion) * 100) },
      { label: "Share of a year's borrowing", value: pct((billions / A.annualBorrowingGbpBillion) * 100) },
      {
        label: "Months of debt interest",
        value: `${((billions / A.annualDebtInterestGbpBillion) * 12).toLocaleString("en-GB", { maximumFractionDigits: 1 })} months`,
      },
    ];
    A.budgets.forEach((b) => {
      rows.push({ label: `Share of annual ${b.name} spending`, value: pct((billions / b.value) * 100) });
    });
    return rows;
  }

  function render(billions) {
    const rows = translate(billions);

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
})();
