// Local storage contract for users, sessions, transactions, and settings.
const STORAGE_KEYS = {
  users: 'fintrack_users',
  currentUser: 'fintrack_current_user',
  transactions: 'fintrack_transactions',
  settings: 'fintrack_settings'
};

function readStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error('Storage read failed', error);
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
  return readStorage(STORAGE_KEYS.users, []);
}

function saveUsers(users) {
  writeStorage(STORAGE_KEYS.users, users);
}

function getCurrentUser() {
  return readStorage(STORAGE_KEYS.currentUser, null);
}

function saveCurrentUser(user) {
  writeStorage(STORAGE_KEYS.currentUser, user);
}

function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEYS.currentUser);
}

function getTransactions(userId) {
  const allTransactions = readStorage(STORAGE_KEYS.transactions, {});
  return allTransactions[userId] || [];
}

function saveTransactions(userId, transactions) {
  const allTransactions = readStorage(STORAGE_KEYS.transactions, {});
  allTransactions[userId] = transactions;
  writeStorage(STORAGE_KEYS.transactions, allTransactions);
}

function getSettings(userId) {
  const allSettings = readStorage(STORAGE_KEYS.settings, {});
  return allSettings[userId] || { currency: 'INR', darkMode: false };
}

function saveSettings(userId, settings) {
  const allSettings = readStorage(STORAGE_KEYS.settings, {});
  allSettings[userId] = settings;
  writeStorage(STORAGE_KEYS.settings, allSettings);
}

function getActiveUserKey() {
  const user = getCurrentUser();
  return user ? user.id : null;
}
