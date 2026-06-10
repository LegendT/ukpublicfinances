/*
 * Budget simulator — a deliberately simple, static educational model.
 * Reads baseline assumptions from an inline JSON tag, recomputes on any slider
 * change, and shows borrowing plus a five-year debt path. No economic feedback
 * is modelled; this is for intuition, not forecasting.
 */
(function () {
  "use strict";

  const cfgEl = document.getElementById("sim-config");
  const form = document.getElementById("simulator");
  if (!cfgEl || !form) return;
  const cfg = JSON.parse(cfgEl.textContent);

  const gbpBn = (n) => `£${Math.round(n).toLocaleString("en-GB")} bn`;
  const spendInputs = Array.from(form.querySelectorAll("[data-spend]"));
  const taxInputs = Array.from(form.querySelectorAll("[data-tax]"));

  function compute() {
    // Spending: baseline total adjusted by each lever's change from its base.
    let spendDelta = 0;
    spendInputs.forEach((el) => {
      const val = parseFloat(el.value);
      spendDelta += val - parseFloat(el.dataset.base);
      el.nextElementSibling.textContent = gbpBn(val);
    });
    const totalSpending = cfg.baseline.totalSpending + spendDelta;

    // Revenue: baseline plus each tax change (points × revenue per point).
    let revDelta = 0;
    taxInputs.forEach((el) => {
      const pts = parseFloat(el.value);
      revDelta += pts * parseFloat(el.dataset.perpoint);
      const out = el.nextElementSibling;
      out.textContent = pts === 0 ? "no change" : `${pts > 0 ? "+" : ""}${pts} pts`;
    });
    const totalRevenue = cfg.baseline.totalRevenue + revDelta;

    const borrowing = totalSpending - totalRevenue;

    document.getElementById("r-spending").textContent = gbpBn(totalSpending);
    document.getElementById("r-revenue").textContent = gbpBn(totalRevenue);
    const bEl = document.getElementById("r-borrowing");
    const bLabel = document.getElementById("r-borrowing-label");
    if (borrowing > 0) {
      bEl.textContent = gbpBn(borrowing);
      bLabel.textContent = "Borrowing this year (deficit)";
    } else {
      bEl.textContent = gbpBn(-borrowing);
      bLabel.textContent = "Surplus this year";
    }

    // Five-year debt path: debt grows by interest and by each year's borrowing.
    const rate = cfg.projection.assumedInterestRate;
    let debt = cfg.baseline.debt;
    const rows = [];
    for (let y = 1; y <= cfg.projection.years; y++) {
      debt = debt * (1 + rate) + borrowing;
      rows.push(`<tr><th scope="row">Year ${y}</th><td class="num">${Math.round(debt).toLocaleString("en-GB")}</td><td class="num">${((debt / cfg.gdp) * 100).toFixed(1)}%</td></tr>`);
    }
    document.getElementById("r-trajectory").innerHTML = rows.join("");
  }

  form.addEventListener("input", compute);
  document.getElementById("sim-reset").addEventListener("click", () => {
    spendInputs.forEach((el) => (el.value = el.dataset.base));
    taxInputs.forEach((el) => (el.value = 0));
    compute();
  });

  compute();
})();
