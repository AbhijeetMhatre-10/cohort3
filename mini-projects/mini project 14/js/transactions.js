let currentTransactionId = null;
let transactionsModuleInitialized = false;

// Filter, sort, and summarize transaction data for the dashboard views.
function getFilteredTransactions(transactions, filters = {}) {
  let filtered = [...transactions];
  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter((transaction) => [transaction.title, transaction.category, transaction.notes].join(' ').toLowerCase().includes(query));
  }
  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter((transaction) => transaction.type === filters.type);
  }
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter((transaction) => transaction.category === filters.category);
  }
  if (filters.sortOrder === 'oldest') {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  return filtered;
}

function getSummary(transactions) {
  const income = transactions.filter((t) => t.type === 'income').reduce((sum, item) => sum + Number(item.amount), 0);
  const expense = transactions.filter((t) => t.type === 'expense').reduce((sum, item) => sum + Number(item.amount), 0);
  const balance = income - expense;
  return { income, expense, balance, count: transactions.length };
}

function renderTransactions() {
  const userId = getActiveUserKey();
  if (!userId) return;
  const transactions = getTransactions(userId);
  const search = document.getElementById('searchInput')?.value || '';
  const type = document.getElementById('typeFilter')?.value || 'all';
  const category = document.getElementById('categoryFilter')?.value || 'all';
  const sortOrder = document.getElementById('sortOrder')?.value || 'newest';
  const filtered = getFilteredTransactions(transactions, { search, type, category, sortOrder });
  const tbody = document.getElementById('transactionsTableBody');
  if (!tbody) return;

  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No transactions yet</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map((transaction) => `
    <tr>
      <td>${escapeHtml(transaction.date)}</td>
      <td>${escapeHtml(transaction.title)}</td>
      <td>${escapeHtml(transaction.category)}</td>
      <td><span class="badge ${transaction.type}">${escapeHtml(transaction.type)}</span></td>
      <td>${formatCurrency(transaction.amount, getSettings(userId).currency)}</td>
      <td>${escapeHtml(transaction.notes || '')}</td>
      <td>
        <div class="table-actions">
          <button class="icon-btn edit-btn" data-id="${transaction.id}">✎</button>
          <button class="icon-btn danger delete-btn" data-id="${transaction.id}">🗑</button>
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.edit-btn').forEach((button) => {
    button.addEventListener('click', () => openEditModal(button.dataset.id));
  });
  tbody.querySelectorAll('.delete-btn').forEach((button) => {
    button.addEventListener('click', () => deleteTransaction(button.dataset.id));
  });
}

function populateCategoryFilter() {
  const userId = getActiveUserKey();
  if (!userId) return;
  const transactions = getTransactions(userId);
  const categories = [...new Set(transactions.map((transaction) => transaction.category))];
  const categoryFilter = document.getElementById('categoryFilter');
  if (!categoryFilter) return;
  const currentValue = categoryFilter.value;
  categoryFilter.innerHTML = '<option value="all">All Categories</option>' + categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join('');
  categoryFilter.value = categories.includes(currentValue) ? currentValue : 'all';
}

function updateDashboardCards() {
  const userId = getActiveUserKey();
  if (!userId) return;
  const transactions = getTransactions(userId);
  const settings = getSettings(userId);
  const summary = getSummary(transactions);
  document.getElementById('balanceValue').textContent = formatCurrency(summary.balance, settings.currency);
  document.getElementById('incomeValue').textContent = formatCurrency(summary.income, settings.currency);
  document.getElementById('expenseValue').textContent = formatCurrency(summary.expense, settings.currency);
  document.getElementById('transactionsCount').textContent = summary.count;
}

function saveTransaction(formData) {
  const userId = getActiveUserKey();
  if (!userId) return;
  const transactions = getTransactions(userId);
  if (currentTransactionId) {
    const index = transactions.findIndex((transaction) => transaction.id === currentTransactionId);
    if (index >= 0) {
      transactions[index] = { ...transactions[index], ...formData };
    }
  } else {
    transactions.push({ id: generateId(), ...formData });
  }
  saveTransactions(userId, transactions);
  renderTransactions();
  updateDashboardCards();
  populateCategoryFilter();
  renderChart();
}

function openAddTransactionModal() {
  currentTransactionId = null;
  document.getElementById('modalTitle').textContent = 'Add Transaction';
  document.getElementById('transactionForm').reset();
  document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
  openModal();
}

function openEditModal(id) {
  const userId = getActiveUserKey();
  if (!userId) return;
  const transaction = getTransactions(userId).find((item) => item.id === id);
  if (!transaction) return;
  currentTransactionId = id;
  document.getElementById('modalTitle').textContent = 'Edit Transaction';
  document.getElementById('transactionId').value = transaction.id;
  document.getElementById('transactionTitle').value = transaction.title;
  document.getElementById('transactionAmount').value = transaction.amount;
  document.getElementById('transactionType').value = transaction.type;
  document.getElementById('transactionCategory').value = transaction.category;
  document.getElementById('transactionDate').value = transaction.date;
  document.getElementById('transactionNotes').value = transaction.notes || '';
  openModal();
}

function deleteTransaction(id) {
  const shouldDelete = window.confirm('Delete this transaction?');
  if (!shouldDelete) return;
  const userId = getActiveUserKey();
  if (!userId) return;
  const transactions = getTransactions(userId).filter((transaction) => transaction.id !== id);
  saveTransactions(userId, transactions);
  renderTransactions();
  updateDashboardCards();
  populateCategoryFilter();
  renderChart();
}

function initTransactions() {
  if (transactionsModuleInitialized) return;
  transactionsModuleInitialized = true;

  const addButton = document.getElementById('openTransactionModalBtn');
  const floatingAddButton = document.createElement('button');
  floatingAddButton.className = 'floating-action';
  floatingAddButton.textContent = '+';
  floatingAddButton.setAttribute('aria-label', 'Add transaction');
  floatingAddButton.addEventListener('click', openAddTransactionModal);
  document.body.appendChild(floatingAddButton);
  addButton?.addEventListener('click', openAddTransactionModal);

  document.getElementById('closeTransactionModalBtn')?.addEventListener('click', closeModal);
  document.getElementById('cancelTransactionBtn')?.addEventListener('click', closeModal);
  document.getElementById('transactionForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('transactionTitle').value.trim();
    const amount = Number(document.getElementById('transactionAmount').value);
    const type = document.getElementById('transactionType').value;
    const category = document.getElementById('transactionCategory').value.trim();
    const date = document.getElementById('transactionDate').value;
    const notes = document.getElementById('transactionNotes').value.trim();

    if (!title || !category || !date || !type || !amount || amount <= 0) {
      window.alert('Please fill out all required fields and enter a positive amount.');
      return;
    }

    saveTransaction({ title, amount, type, category, date, notes });
    closeModal();
  });

  ['searchInput', 'typeFilter', 'categoryFilter', 'sortOrder'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', renderTransactions);
    document.getElementById(id)?.addEventListener('change', renderTransactions);
  });

  document.addEventListener('click', (event) => {
    if (event.target.id === 'transactionModal') {
      closeModal();
    }
  });

  populateCategoryFilter();
  renderTransactions();
  updateDashboardCards();
  renderChart();
}

