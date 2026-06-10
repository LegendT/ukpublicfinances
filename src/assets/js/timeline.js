/*
 * Historical timeline chart.
 * Draws a lightweight inline SVG line chart from the embedded series. The data
 * table is the canonical, accessible representation; this is enhancement only,
 * so the SVG is marked aria-hidden and the container carries a text label.
 */
(function () {
  "use strict";

  const dataEl = document.getElementById("timeline-data");
  const chartEl = document.getElementById("chart");
  if (!dataEl || !chartEl) return;

  const parsed = JSON.parse(dataEl.textContent);
  const events = parsed.events;
  // The current-year point lives in the dashboard data and is appended here, so
  // the time series holds no duplicate "latest" figure to drift out of step.
  const series = parsed.current ? parsed.series.concat([parsed.current]) : parsed.series;
  const measureLabels = {
    debtToGdp: "Debt as a share of GDP",
    debtGbp: "Debt in £ billion",
    borrowingGbp: "Borrowing in £ billion",
    interestGbp: "Debt interest in £ billion",
  };

  const NS = "http://www.w3.org/2000/svg";
  const W = 760;
  const H = 360;
  const pad = { top: 30, right: 16, bottom: 36, left: 56 };

  function el(name, attrs) {
    const node = document.createElementNS(NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  const periodSelect = document.getElementById("period");

  // The earliest year for which the chosen measure actually has data.
  function earliestYearFor(measure) {
    const yrs = series.filter((d) => d[measure] !== null && d[measure] !== undefined).map((d) => d.year);
    return yrs.length ? Math.min(...yrs) : Infinity;
  }

  // Disable period options that can't show anything different for this measure.
  // Cash-£ measures only run from 1979, so "Since 1700/1900/1945" would all be
  // identical to "Since 1979" — disabling them stops the period looking broken.
  // If the current selection becomes disabled, snap to the earliest valid one.
  function syncPeriodOptions(earliest) {
    const opts = Array.from(periodSelect.options);
    let floor = -Infinity;
    opts.forEach((o) => {
      const v = +o.value;
      if (v <= earliest && v > floor) floor = v;
    });
    opts.forEach((o) => {
      if (!o.dataset.label) o.dataset.label = o.textContent;
      o.disabled = +o.value < floor;
      // Make the disabled state explicit in the text — some browsers don't grey
      // disabled options, which can look like broken functionality.
      o.textContent = o.disabled ? `${o.dataset.label} — no data` : o.dataset.label;
    });
    if (periodSelect.options[periodSelect.selectedIndex].disabled) {
      periodSelect.value = String(floor);
    }
  }

  function draw() {
    const measure = document.querySelector('input[name="measure"]:checked').value;
    const earliest = earliestYearFor(measure);
    syncPeriodOptions(earliest);
    const startYear = parseInt(periodSelect.value, 10);
    const startNote = earliest > 1700 && earliest !== Infinity ? ` (data from ${earliest})` : "";
    document.getElementById("chart-measure-label").textContent = measureLabels[measure] + startNote;
    chartEl.setAttribute(
      "aria-label",
      `Line chart: ${measureLabels[measure]}, since ${startYear}. The same data is in the table below.`
    );

    const points = series
      .filter((d) => d.year >= startYear && d[measure] !== null && d[measure] !== undefined)
      .map((d) => ({ year: d.year, value: d[measure] }));

    chartEl.innerHTML = "";
    if (points.length < 2) {
      chartEl.innerHTML = '<p class="chart__empty">Not enough data for this combination. See the table below.</p>';
      return;
    }

    const years = points.map((p) => p.year);
    const values = points.map((p) => p.value);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const maxVal = Math.max(...values, 0);
    const minVal = Math.min(...values, 0);

    const x = (yr) => pad.left + ((yr - minYear) / (maxYear - minYear || 1)) * (W - pad.left - pad.right);
    const y = (v) => H - pad.bottom - ((v - minVal) / (maxVal - minVal || 1)) * (H - pad.top - pad.bottom);

    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, "aria-hidden": "true", class: "chart__svg" });

    // Horizontal gridlines and y-axis labels (5 steps).
    for (let i = 0; i <= 4; i++) {
      const v = minVal + ((maxVal - minVal) / 4) * i;
      const yy = y(v);
      svg.appendChild(el("line", { x1: pad.left, y1: yy, x2: W - pad.right, y2: yy, class: "chart__grid" }));
      const label = el("text", { x: pad.left - 8, y: yy + 4, class: "chart__axis-label", "text-anchor": "end" });
      label.textContent = Math.round(v).toLocaleString("en-GB");
      svg.appendChild(label);
    }

    // Event markers within range. Labels are staggered onto a second row when
    // two events sit close together, so the year text never overlaps.
    let lastLabelX = -Infinity;
    let row = 0;
    events
      .filter((e) => e.year >= minYear && e.year <= maxYear)
      .sort((a, b) => a.year - b.year)
      .forEach((e) => {
        const xx = x(e.year);
        svg.appendChild(el("line", { x1: xx, y1: pad.top, x2: xx, y2: H - pad.bottom, class: "chart__event" }));
        row = xx - lastLabelX < 32 ? (row + 1) % 2 : 0;
        const t = el("text", { x: xx, y: pad.top - 6 - row * 12, class: "chart__event-label", "text-anchor": "middle" });
        t.textContent = e.year;
        svg.appendChild(t);
        lastLabelX = xx;
      });

    // The line.
    const dPath = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.year)},${y(p.value)}`).join(" ");
    svg.appendChild(el("path", { d: dPath, class: "chart__line", fill: "none" }));

    // Data dots.
    points.forEach((p) => {
      svg.appendChild(el("circle", { cx: x(p.year), cy: y(p.value), r: 3, class: "chart__dot" }));
    });

    // X-axis end labels.
    [minYear, maxYear].forEach((yr, i) => {
      const t = el("text", {
        x: x(yr),
        y: H - pad.bottom + 22,
        class: "chart__axis-label",
        "text-anchor": i === 0 ? "start" : "end",
      });
      t.textContent = yr;
      svg.appendChild(t);
    });

    chartEl.appendChild(svg);
  }

  document.querySelectorAll('input[name="measure"]').forEach((r) => r.addEventListener("change", draw));
  document.getElementById("period").addEventListener("change", draw);
  draw();
})();
