/**
 * Light/dark theme.
 * The saved theme is applied before the first paint (the script is loaded in
 * <head>), so the page never flashes in the wrong theme.
 */
(function () {
  var STORAGE_KEY = 'coffee-house-theme';
  var root = document.documentElement;

  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // storage can be unavailable (private mode) — the theme still works
    }
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;

    var toggle = document.querySelector('.theme-switch');

    if (toggle) {
      toggle.setAttribute('aria-checked', String(theme === 'dark'));
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Light theme' : 'Dark theme');
    }
  }

  var savedTheme = getSavedTheme();
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(root.dataset.theme);

    var toggle = document.querySelector('.theme-switch');

    if (!toggle) {
      return;
    }

    toggle.addEventListener('click', function () {
      var nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';

      applyTheme(nextTheme);
      saveTheme(nextTheme);
    });
  });
})();
