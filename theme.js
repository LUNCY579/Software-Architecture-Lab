// Theme toggle. The initial attribute is set by an inline script in <head>
// so the first paint already has the right palette; this file owns the button.
(function () {
  "use strict";

  var KEY = "fieldguide-theme";
  var root = document.documentElement;

  function systemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function storedTheme() {
    try {
      var value = localStorage.getItem(KEY);
      return value === "dark" || value === "light" ? value : null;
    } catch (e) {
      return null;
    }
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);

    var button = document.getElementById("theme-toggle");
    if (button) {
      var dark = theme === "dark";
      button.setAttribute("aria-pressed", dark ? "true" : "false");
      button.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
      button.setAttribute("title", dark ? "Switch to light theme" : "Switch to dark theme");
    }

    var meta = document.querySelector ? document.querySelector('meta[name="theme-color"]') : null;
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0d0f14" : "#f8f7f4");
  }

  function current() {
    var value = root.getAttribute("data-theme");
    return value === "dark" || value === "light" ? value : systemTheme();
  }

  apply(storedTheme() || current());

  var button = document.getElementById("theme-toggle");
  if (button) {
    button.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) { /* storage unavailable */ }
    });
  }

  // Follow the operating system only while the reader has not chosen a theme.
  if (window.matchMedia) {
    var query = window.matchMedia("(prefers-color-scheme: dark)");
    var onChange = function () {
      if (!storedTheme()) apply(systemTheme());
    };
    if (query.addEventListener) query.addEventListener("change", onChange);
    else if (query.addListener) query.addListener(onChange);
  }
})();
