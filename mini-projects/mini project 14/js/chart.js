let flowChart = null;

function renderChart() {
  const userId = getActiveUserKey();
  if (!userId) return;
  const transactions = getTransactions(userId);
  const summary = getSummary(transactions);
  const ctx = document.getElementById('flowChart');
  if (!ctx) return;

  if (flowChart) {
    flowChart.destroy();
  }

  flowChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Income', 'Expense', 'Balance'],
      datasets: [
        {
          label: 'Amount',
          data: [summary.income, summary.expense, summary.balance],
          backgroundColor: ['rgba(22, 163, 74, 0.78)', 'rgba(220, 38, 38, 0.78)', 'rgba(37, 99, 235, 0.78)'],
          borderRadius: 14,
          borderSkipped: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
