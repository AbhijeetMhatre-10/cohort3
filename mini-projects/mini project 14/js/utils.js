function formatCurrency(amount, currency = 'INR') {
  const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  const value = Number(amount || 0);
  return `${symbols[currency] || '₹'}${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getUserByIdentifier(identifier) {
  const users = getUsers();
  return users.find((user) => user.username === identifier || user.email === identifier) || null;
}

function getCurrentPageName() {
  const path = window.location.pathname;
  const pageName = path.substring(path.lastIndexOf('/') + 1);
  return pageName || 'index.html';
}

function isCurrentPage(pageName) {
  return getCurrentPageName() === pageName;
}

function ensureAuth() {
  const user = getCurrentUser();
  const users = getUsers();
  const validUser = user && users.some((savedUser) => savedUser.id === user.id);

  if (!validUser) {
    clearCurrentUser();
    window.location.href = 'login.html';
    return false;
  }

  return true;
}
