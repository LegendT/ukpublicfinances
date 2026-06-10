/* Navigation behaviour. Progressive enhancement only: the nav is a plain list
 * of links and native <details> groups without JS. This adds the mobile menu
 * collapse and tidies the desktop dropdowns (one open at a time, close on
 * Escape or outside click). */
(function () {
  "use strict";
  const toggle = document.querySelector(".site-nav__toggle");
  const list = document.getElementById("primary-nav");
  if (!list) return;

  const groups = Array.from(list.querySelectorAll("details.nav-group"));

  function closeMenu() {
    if (!toggle) return;
    toggle.setAttribute("aria-expanded", "false");
    list.classList.remove("is-open");
  }
  function closeGroups(except) {
    groups.forEach((g) => {
      if (g !== except) g.open = false;
    });
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      list.classList.toggle("is-open", !open);
    });
  }

  // Only one dropdown open at a time.
  groups.forEach((g) => {
    g.addEventListener("toggle", function () {
      if (g.open) closeGroups(g);
    });
  });

  // Close dropdowns when clicking outside the nav.
  document.addEventListener("click", function (e) {
    if (!list.contains(e.target)) closeGroups(null);
  });

  // Escape closes the mobile menu and any open dropdown.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeGroups(null);
      closeMenu();
    }
  });
})();
