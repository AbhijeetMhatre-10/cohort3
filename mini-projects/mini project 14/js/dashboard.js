document.addEventListener('DOMContentLoaded', () => {
  if (getCurrentPageName() !== 'index.html') return;
  ensureAuth();
  initUI();
  initTransactions();
  initSettings();
  applyTheme();
  updateHeaderUser();
  updateDashboardCards();
  renderChart();
});
