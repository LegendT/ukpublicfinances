/*
 * During your lifetime.
 * Interpolates debt and debt-to-GDP for a birth year, compares with the latest
 * figure, and lists events and prime ministers across the period. Neutral by
 * design: it states changes and context, never blame.
 */
(function () {
  "use strict";

  const dataEl = document.getElementById("lifetime-data");
  const out = document.getElementById("lifetime-results");
  const input = document.getElementById("birth-year");
  const errorEl = document.getElementById("by-error");
  if (!dataEl || !out || !input) return;

  const { series, events, primeMinisters, current } = JSON.parse(dataEl.textContent);
  const gbpBn = (v) => (v === null ? "no comparable figure" : `£${v.toLocaleString("en-GB")} bn`);

  // Linear interpolation of a field at a given year, from the sparse series.
  function valueAt(year, field) {
    const pts = series.filter((d) => d[field] !== null && d[field] !== undefined);
    if (!pts.length) return null;
    if (year <= pts[0].year) return pts[0][field];
    if (year >= pts[pts.length - 1].year) return pts[pts.length - 1][field];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      if (year >= a.year && year <= b.year) {
        const t = (year - a.year) / (b.year - a.year);
        return Math.round((a[field] + t * (b[field] - a[field])) * 10) / 10;
      }
    }
    return null;
  }

  function render(year) {
    const birthGdp = valueAt(year, "debtToGdp");
    const nowGdp = current.debtToGdp;
    const ppChange = birthGdp !== null ? (nowGdp - birthGdp).toFixed(1) : null;

    const livedEvents = events.filter((e) => e.year >= year);
    const pms = primeMinisters.filter((p) => p.to === null || p.to >= year);

    out.innerHTML = `
      <h2>Since ${year}</h2>
      <div class="metric-grid metric-grid--compact">
        <article class="metric-card metric-card--mini">
          <p class="metric-card__value">${birthGdp !== null ? birthGdp + "%" : "n/a"}</p>
          <p class="metric-card__label">Debt-to-GDP in ${year} (estimated)</p>
        </article>
        <article class="metric-card metric-card--mini">
          <p class="metric-card__value">${nowGdp}%</p>
          <p class="metric-card__label">Debt-to-GDP now (${current.year})</p>
        </article>
        <article class="metric-card metric-card--mini">
          <p class="metric-card__value">${ppChange !== null ? (ppChange >= 0 ? "+" : "") + ppChange + " pts" : "n/a"}</p>
          <p class="metric-card__label">Change in the ratio</p>
        </article>
        <article class="metric-card metric-card--mini">
          <p class="metric-card__value">${gbpBn(current.debtGbp)}</p>
          <p class="metric-card__label">Cash debt now (${current.year})</p>
        </article>
      </div>

      <h3>Events during your lifetime</h3>
      <ul class="event-list">
        ${livedEvents
          .map((e) => `<li class="event-list__item"><span class="event-list__year">${e.year}</span><span class="event-list__body"><strong>${e.title}</strong>: ${e.summary}</span></li>`)
          .join("") || "<li>No marked events in this range.</li>"}
      </ul>

      <h3>Prime ministers since ${year}</h3>
      <p class="muted">Listed for context only. Debt is shaped by many forces, not one person or party.</p>
      <ul class="pm-list">
        ${pms
          .map((p) => `<li>${p.name} <span class="muted">(${p.party}, ${p.from}–${p.to || "present"})</span></li>`)
          .join("")}
      </ul>
    `;
  }

  function update() {
    const year = parseInt(input.value, 10);
    const valid = Number.isFinite(year) && year >= 1900 && year <= 2026;
    errorEl.hidden = valid;
    input.setAttribute("aria-invalid", valid ? "false" : "true");
    if (!valid) {
      out.innerHTML = "";
      return;
    }
    render(year);
  }

  input.addEventListener("input", update);
  document.getElementById("lifetime-form").addEventListener("submit", (e) => {
    e.preventDefault();
    update();
  });
  update();
})();
