/*
 * Budget simulator (DOM + presentation) — a deliberately simple, static model.
 * The maths lives in lib/calc.js; this reads the sliders, recomputes on change,
 * and shows borrowing plus a five-year debt path. No economic feedback is
 * modelled; this is for intuition, not forecasting.
 */
import { simulateBudget } from "./lib/calc.js";

const cfgEl = document.getElementById("sim-config");
const form = document.getElementById("simulator");
if (cfgEl && form) {
  const cfg = JSON.parse(cfgEl.textContent);
  const gbpBn = (n) => `£${Math.round(n).toLocaleString("en-GB")} bn`;
  const spendInputs = Array.from(form.querySelectorAll("[data-spend]"));
  const taxInputs = Array.from(form.querySelectorAll("[data-tax]"));

  function compute() {
    // Gather slider state and update each slider's own label.
    const spendValues = {};
    spendInputs.forEach((el) => {
      const val = parseFloat(el.value);
      spendValues[el.dataset.spend] = val;
      document.getElementById(el.id + "-out").textContent = gbpBn(val);
    });
    const taxPoints = taxInputs.map((el) => {
      const pts = parseFloat(el.value);
      document.getElementById(el.id + "-out").textContent =
        pts === 0 ? "no change" : `${pts > 0 ? "+" : ""}${pts} pts`;
      return { perpoint: parseFloat(el.dataset.perpoint), points: pts };
    });

    const r = simulateBudget(cfg, spendValues, taxPoints);

    document.getElementById("r-spending").textContent = gbpBn(r.totalSpending);
    document.getElementById("r-revenue").textContent = gbpBn(r.totalRevenue);
    const bEl = document.getElementById("r-borrowing");
    const bLabel = document.getElementById("r-borrowing-label");
    if (r.borrowing > 0) {
      bEl.textContent = gbpBn(r.borrowing);
      bLabel.textContent = "Borrowing this year (deficit)";
    } else {
      bEl.textContent = gbpBn(-r.borrowing);
      bLabel.textContent = "Surplus this year";
    }

    document.getElementById("r-trajectory").innerHTML = r.trajectory
      .map(
        (t) =>
          `<tr><th scope="row">Year ${t.year}</th><td class="num">${Math.round(t.debt).toLocaleString("en-GB")}</td><td class="num">${t.pctGdp.toFixed(1)}%</td></tr>`
      )
      .join("");
  }

  form.addEventListener("input", compute);
  document.getElementById("sim-reset").addEventListener("click", () => {
    spendInputs.forEach((el) => (el.value = el.dataset.base));
    taxInputs.forEach((el) => (el.value = 0));
    compute();
  });

  compute();
}
