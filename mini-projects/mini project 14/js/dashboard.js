document.addEventListener('DOMContentLoaded', () => {
  if (!window.location.pathname.includes('index.html')) return;
  ensureAuth();
  initUI();
  initTransactions();
  initSettings();
  applyTheme();
  updateHeaderUser();
  updateDashboardCards();
  renderChart();
});
