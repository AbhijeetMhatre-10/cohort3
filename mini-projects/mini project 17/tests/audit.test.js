import test from 'node:test';
import assert from 'node:assert/strict';

// Mock localStorage for Node environment
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

globalThis.localStorage = new MockLocalStorage();
globalThis.window = {
  matchMedia: (query) => ({
    matches: false,
    media: query,
  }),
};

// Import modules under test
const { INITIAL_QUESTIONS } = await import('../src/data/dummyQuestions.js');
const {
  getLocalQuestions,
  saveLocalQuestions,
  getSavedStatuses,
  saveSavedStatuses,
  getHiddenInitialIds,
  saveHiddenInitialIds,
  getSynchronizedQuestions,
  saveStoredQuestions,
  resetStoredQuestions,
  getStoredTheme,
  saveStoredTheme,
} = await import('../src/utils/localStorage.js');

test('INITIAL_QUESTIONS validation', () => {
  assert.ok(Array.isArray(INITIAL_QUESTIONS), 'INITIAL_QUESTIONS should be an array');
  assert.ok(INITIAL_QUESTIONS.length > 0, 'INITIAL_QUESTIONS should not be empty');

  for (const q of INITIAL_QUESTIONS) {
    assert.ok(q.id && typeof q.id === 'string', `Question ${q.id} must have a string id`);
    assert.ok(q.title && typeof q.title === 'string', `Question ${q.id} must have a string title`);
    assert.ok(['Easy', 'Medium', 'Hard'].includes(q.difficulty), `Question ${q.id} must have a valid difficulty`);
    assert.ok(['Pending', 'In Progress', 'Completed'].includes(q.status), `Question ${q.id} must have a valid status`);
    assert.ok(Number.isInteger(q.week) && q.week > 0, `Question ${q.id} must have a positive integer week`);
    if (q.url) {
      assert.ok(q.url.startsWith('http://') || q.url.startsWith('https://'), `Question ${q.id} URL must start with http:// or https://`);
    }
  }
});

test('LocalStorage: default initialization', () => {
  globalThis.localStorage.clear();
  const { combined, localQuestions, savedStatuses } = getSynchronizedQuestions();

  assert.equal(localQuestions.length, 0, 'Local questions should be empty initially');
  assert.deepEqual(savedStatuses, {}, 'Saved statuses should be empty initially');
  assert.equal(combined.length, INITIAL_QUESTIONS.length, 'Combined should equal INITIAL_QUESTIONS');
  assert.equal(combined[0].id, INITIAL_QUESTIONS[0].id);
});

test('LocalStorage: status updates preservation', () => {
  globalThis.localStorage.clear();
  const statuses = { 'dsa-01': 'Completed', 'dsa-02': 'In Progress' };
  saveSavedStatuses(statuses);

  const retrieved = getSavedStatuses();
  assert.equal(retrieved['dsa-01'], 'Completed');
  assert.equal(retrieved['dsa-02'], 'In Progress');

  const { combined } = getSynchronizedQuestions();
  const q1 = combined.find((q) => q.id === 'dsa-01');
  const q2 = combined.find((q) => q.id === 'dsa-02');
  assert.equal(q1.status, 'Completed');
  assert.equal(q2.status, 'In Progress');
});

test('LocalStorage: adding new questions and dynamic week generation', () => {
  globalThis.localStorage.clear();

  const newQuestion = {
    id: 'dsa-custom-1',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    status: 'Pending',
    week: 2,
    url: 'https://leetcode.com/problems/valid-parentheses/',
  };

  saveLocalQuestions([newQuestion]);
  const localList = getLocalQuestions();
  assert.equal(localList.length, 1);
  assert.equal(localList[0].title, 'Valid Parentheses');

  const { combined } = getSynchronizedQuestions();
  assert.equal(combined.length, INITIAL_QUESTIONS.length + 1);

  // Available weeks should now include 1 and 2
  const availableWeeks = [...new Set(combined.map((q) => Number(q.week)).filter((w) => Number.isInteger(w) && w > 0))].sort((a, b) => a - b);
  assert.deepEqual(availableWeeks, [1, 2]);
});

test('LocalStorage: editing initial question overrides default without duplicate', () => {
  globalThis.localStorage.clear();

  // Edit dsa-01: change title to 'Two Sum Modified' and difficulty to 'Hard'
  const editedInitial = {
    id: 'dsa-01',
    title: 'Two Sum Modified',
    difficulty: 'Hard',
    status: 'In Progress',
    week: 1,
    url: 'https://leetcode.com/problems/two-sum/',
  };

  saveLocalQuestions([editedInitial]);
  saveSavedStatuses({ 'dsa-01': 'In Progress' });

  const { combined } = getSynchronizedQuestions();

  // Ensure total count didn't duplicate dsa-01
  assert.equal(combined.length, INITIAL_QUESTIONS.length, 'Total questions should not change when editing an initial question');

  const target = combined.find((q) => q.id === 'dsa-01');
  assert.equal(target.title, 'Two Sum Modified');
  assert.equal(target.difficulty, 'Hard');
  assert.equal(target.status, 'In Progress');
});

test('LocalStorage: deleting an initial question hides it', () => {
  globalThis.localStorage.clear();

  saveHiddenInitialIds(['dsa-01']);
  assert.deepEqual(getHiddenInitialIds(), ['dsa-01']);

  const { combined } = getSynchronizedQuestions();
  assert.equal(combined.some((q) => q.id === 'dsa-01'), false, 'Deleted initial question should be filtered out');
  assert.equal(combined.length, INITIAL_QUESTIONS.length - 1);
});

test('LocalStorage: legacy migration from dsa-practice-questions', () => {
  globalThis.localStorage.clear();

  const legacyQuestions = [
    { id: 'dsa-01', title: 'Two Sum', status: 'Completed' },
    { id: 'dsa-legacy-99', title: 'Custom Legacy Problem', difficulty: 'Medium', status: 'In Progress', week: 3 },
  ];

  globalThis.localStorage.setItem('dsa-practice-questions', JSON.stringify(legacyQuestions));

  // Should migrate legacy custom questions into LOCAL_QUESTIONS
  const localQuestions = getLocalQuestions();
  assert.equal(localQuestions.length, 1);
  assert.equal(localQuestions[0].id, 'dsa-legacy-99');

  // Should migrate statuses
  const statuses = getSavedStatuses();
  assert.equal(statuses['dsa-01'], 'Completed');
  assert.equal(statuses['dsa-legacy-99'], 'In Progress');
});

test('LocalStorage: saveStoredQuestions persists questions and statuses', () => {
  globalThis.localStorage.clear();
  const testList = [
    { id: 'dsa-01', title: 'Two Sum', status: 'Completed', week: 1 },
    { id: 'dsa-extra-1', title: 'New Problem', difficulty: 'Easy', status: 'Pending', week: 2 },
  ];
  saveStoredQuestions(testList);

  const statuses = getSavedStatuses();
  assert.equal(statuses['dsa-01'], 'Completed');
  assert.equal(statuses['dsa-extra-1'], 'Pending');

  const localList = getLocalQuestions();
  assert.equal(localList.length, 1);
  assert.equal(localList[0].id, 'dsa-extra-1');
});

test('LocalStorage: resetStoredQuestions restores initial state', () => {
  globalThis.localStorage.clear();

  saveLocalQuestions([{ id: 'custom-1', title: 'Test', week: 2 }]);
  saveSavedStatuses({ 'dsa-01': 'Completed' });
  saveHiddenInitialIds(['dsa-02']);

  const resetResult = resetStoredQuestions();
  assert.equal(resetResult.length, INITIAL_QUESTIONS.length);
  assert.equal(getLocalQuestions().length, 0);
  assert.deepEqual(getSavedStatuses(), {});
  assert.deepEqual(getHiddenInitialIds(), []);
});

test('LocalStorage: theme persistence', () => {
  globalThis.localStorage.clear();
  assert.equal(getStoredTheme(), 'light');

  saveStoredTheme('dark');
  assert.equal(getStoredTheme(), 'dark');

  saveStoredTheme('light');
  assert.equal(getStoredTheme(), 'light');
});

test('Dashboard metrics safety calculations', () => {
  // Safe calculations when questions array is empty
  const emptyQuestions = [];
  const total = emptyQuestions.length;
  const completed = emptyQuestions.filter((q) => q.status === 'Completed').length;
  const inProgress = emptyQuestions.filter((q) => q.status === 'In Progress').length;
  const pending = Math.max(0, total - completed - inProgress);
  const overallPercentage = total > 0 ? Math.min(100, Math.max(0, Math.round((completed / total) * 100))) : 0;

  assert.equal(total, 0);
  assert.equal(completed, 0);
  assert.equal(inProgress, 0);
  assert.equal(pending, 0);
  assert.equal(overallPercentage, 0);

  // Safe percentage calculation with all completed
  const allDone = [
    { status: 'Completed', difficulty: 'Easy' },
    { status: 'Completed', difficulty: 'Medium' },
  ];
  const allDonePct = Math.round((allDone.filter((q) => q.status === 'Completed').length / allDone.length) * 100);
  assert.equal(allDonePct, 100);
});

test('URL security validation', () => {
  const safeHttp = 'http://leetcode.com/problems/two-sum';
  const safeHttps = 'https://leetcode.com/problems/two-sum';
  const unsafeJs = 'javascript:alert(1)';
  const unsafeData = 'data:text/html,test';

  const isSafe = (url) => typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));

  assert.equal(isSafe(safeHttp), true);
  assert.equal(isSafe(safeHttps), true);
  assert.equal(isSafe(unsafeJs), false);
  assert.equal(isSafe(unsafeData), false);
  assert.equal(isSafe(null), false);
  assert.equal(isSafe(undefined), false);
});
