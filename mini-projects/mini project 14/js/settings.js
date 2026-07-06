let settingsModuleInitialized = false;

function applyUserSettings() {
  const userId = getActiveUserKey();
  if (!userId) return;
  const settings = getSettings(userId);
  const currencySelect = document.getElementById('currencySelect');
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (currencySelect) currencySelect.value = settings.currency || 'INR';
  if (darkModeToggle) darkModeToggle.checked = Boolean(settings.darkMode);
}

function initSettings() {
  if (settingsModuleInitialized) return;
  settingsModuleInitialized = true;
  applyUserSettings();

  const currencySelect = document.getElementById('currencySelect');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const resetButton = document.getElementById('resetDataBtn');

  currencySelect?.addEventListener('change', (event) => {
    const userId = getActiveUserKey();
    if (!userId) return;
    const settings = getSettings(userId);
    settings.currency = event.target.value;
    saveSettings(userId, settings);
    updateDashboardCards();
    renderTransactions();
  });

  darkModeToggle?.addEventListener('change', (event) => {
    const userId = getActiveUserKey();
    if (!userId) return;
    const settings = getSettings(userId);
    settings.darkMode = event.target.checked;
    saveSettings(userId, settings);
    applyTheme();
  });

  resetButton?.addEventListener('click', () => {
    const confirmed = window.confirm('Reset all transactions for your account?');
    if (!confirmed) return;
    const userId = getActiveUserKey();
    if (!userId) return;
    saveTransactions(userId, []);
    updateDashboardCards();
    renderTransactions();
    populateCategoryFilter();
    renderChart();
  });
}

window.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('index.html')) {
    initSettings();
  }
});
