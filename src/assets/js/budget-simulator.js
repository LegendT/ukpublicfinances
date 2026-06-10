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
      const rate = parseFloat(el.value);
      const pts = rate - parseFloat(el.dataset.base);
      document.getElementById(el.id + "-out").textContent =
        pts === 0 ? `${rate}%` : `${rate}% (${pts > 0 ? "+" : ""}${pts})`;
      return { perpoint: parseFloat(el.dataset.perpoint), points: pts };
    });

    const r = simulateBudget(cfg, spendValues, taxPoints);

    document.getElementById("r-spending").textContent = gbpBn(r.totalSpending);
    document.getElementById("r-revenue").textContent = gbpBn(r.totalRevenue);
    const bEl = document.getElementById("r-borrowing");
    const bLabel = document.getElementById("r-borrowing-label");
    const status = document.getElementById("sim-status");
    const endDebt = r.trajectory[r.trajectory.length - 1];
    if (r.borrowing > 0) {
      // Stage 1: still in deficit.
      bEl.textContent = gbpBn(r.borrowing);
      bLabel.textContent = "Borrowing this year (deficit)";
      status.className = "sim-goal sim-goal--todo";
      status.textContent = `Not balanced yet — a deficit of ${gbpBn(r.borrowing)} left to close.`;
    } else {
      bEl.textContent = gbpBn(-r.borrowing);
      bLabel.textContent = r.borrowing === 0 ? "Balanced this year" : "Surplus this year";
      if (endDebt.debt < cfg.baseline.debt) {
        // Stage 3: surplus beats the interest, so debt actually falls.
        status.className = "sim-goal sim-goal--win";
        status.textContent = `Debt is falling — your surplus now outweighs the interest. It reaches ${endDebt.pctGdp.toFixed(0)}% of GDP by year 5.`;
      } else {
        // Stage 2: balanced or in surplus, but interest still outpaces it.
        status.className = "sim-goal sim-goal--mid";
        status.textContent = `Budget balanced, but debt is still rising — the interest bill outweighs your surplus. A bigger surplus would bring it down.`;
      }
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
    taxInputs.forEach((el) => (el.value = el.dataset.base));
    compute();
  });

  compute();
}
