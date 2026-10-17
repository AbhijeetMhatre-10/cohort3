import { INITIAL_QUESTIONS } from '../data/dummyQuestions.js';

const LOCAL_QUESTIONS_KEY = 'LOCAL_QUESTIONS';
const STATUSES_KEY = 'dsa-question-statuses';
const OLD_QUESTIONS_KEY = 'dsa-practice-questions';
const HIDDEN_INITIAL_KEY = 'dsa-hidden-initial-ids';
const THEME_KEY = 'dsa-theme';

/**
 * Retrieve user-created questions from LocalStorage (persisted as LOCAL_QUESTIONS).
 */
export function getLocalQuestions() {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(LOCAL_QUESTIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    // Backward compatibility: migrate custom problems from legacy array storage
    const oldRaw = localStorage.getItem(OLD_QUESTIONS_KEY);
    if (oldRaw) {
      const oldList = JSON.parse(oldRaw);
      if (Array.isArray(oldList)) {
        const initialIdSet = new Set(INITIAL_QUESTIONS.map((q) => q.id));
        const legacyCustom = oldList.filter((q) => q && q.id && !initialIdSet.has(q.id));
        if (legacyCustom.length > 0) {
          saveLocalQuestions(legacyCustom);
          return legacyCustom;
        }
      }
    }
    return [];
  } catch (err) {
    console.error('Failed to get local questions from localStorage:', err);
    return [];
  }
}

/**
 * Persist user-created questions to LocalStorage under LOCAL_QUESTIONS.
 */
export function saveLocalQuestions(localQuestions) {
  try {
    if (typeof window !== 'undefined' && Array.isArray(localQuestions)) {
      localStorage.setItem(LOCAL_QUESTIONS_KEY, JSON.stringify(localQuestions));
    }
  } catch (err) {
    console.error('Failed to save local questions to localStorage:', err);
  }
}

/**
 * Retrieve saved question statuses map from LocalStorage.
 * Preserves backwards compatibility with any previously saved questions.
 */
export function getSavedStatuses() {
  try {
    if (typeof window === 'undefined') return {};
    const raw = localStorage.getItem(STATUSES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed;
      }
    }
    // Fallback/migration for legacy array storage
    const oldRaw = localStorage.getItem(OLD_QUESTIONS_KEY);
    if (oldRaw) {
      const oldList = JSON.parse(oldRaw);
      if (Array.isArray(oldList)) {
        const statuses = {};
        for (const q of oldList) {
          if (q && q.id && q.status) {
            statuses[q.id] = q.status;
          }
        }
        saveSavedStatuses(statuses);
        return statuses;
      }
    }
    return {};
  } catch (err) {
    console.error('Failed to get saved statuses from localStorage:', err);
    return {};
  }
}

/**
 * Save question statuses map to LocalStorage.
 */
export function saveSavedStatuses(statuses) {
  try {
    if (typeof window !== 'undefined' && statuses && typeof statuses === 'object') {
      localStorage.setItem(STATUSES_KEY, JSON.stringify(statuses));
    }
  } catch (err) {
    console.error('Failed to save question statuses to localStorage:', err);
  }
}

/**
 * Retrieve IDs of initial questions hidden/deleted by the user.
 */
export function getHiddenInitialIds() {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(HIDDEN_INITIAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Save IDs of initial questions hidden/deleted by the user.
 */
export function saveHiddenInitialIds(ids) {
  try {
    if (typeof window !== 'undefined' && Array.isArray(ids)) {
      const uniqueIds = [...new Set(ids)];
      localStorage.setItem(HIDDEN_INITIAL_KEY, JSON.stringify(uniqueIds));
    }
  } catch (err) {
    console.error('Failed to save hidden initial IDs to localStorage:', err);
  }
}

/**
 * Synchronize INITIAL_QUESTIONS with LOCAL_QUESTIONS and saved question statuses.
 * Combines them into a single list with unique IDs, allowing local edits to override initial questions.
 */
export function getSynchronizedQuestions() {
  const localList = getLocalQuestions();
  const savedStatuses = getSavedStatuses();
  const hiddenInitialIds = new Set(getHiddenInitialIds());

  // 1. Sync LOCAL_QUESTIONS with saved statuses (user-created or edited questions)
  const syncedLocal = localList.map((q) => ({
    ...q,
    status: savedStatuses[q.id] || q.status || 'Pending',
  }));

  const localIds = new Set(syncedLocal.map((q) => q.id));

  // 2. Sync INITIAL_QUESTIONS with saved statuses (excluding user-deleted questions and locally overridden questions)
  const syncedInitial = INITIAL_QUESTIONS
    .filter((q) => !hiddenInitialIds.has(q.id) && !localIds.has(q.id))
    .map((q) => ({
      ...q,
      status: savedStatuses[q.id] || q.status || 'Pending',
    }));

  // 3. Combine into final question list, maintaining initial order then local questions
  const combined = [...syncedInitial, ...syncedLocal];

  return {
    combined,
    localQuestions: syncedLocal,
    savedStatuses,
  };
}

export function getStoredQuestions() {
  return getSynchronizedQuestions().combined;
}

export function saveStoredQuestions(questions) {
  try {
    if (typeof window !== 'undefined' && Array.isArray(questions)) {
      const statuses = getSavedStatuses();
      const initialIdSet = new Set(INITIAL_QUESTIONS.map((q) => q.id));
      const localToSave = [];

      for (const q of questions) {
        if (q && q.id) {
          if (q.status) {
            statuses[q.id] = q.status;
          }
          if (!initialIdSet.has(q.id)) {
            localToSave.push(q);
          }
        }
      }
      saveSavedStatuses(statuses);
      if (localToSave.length > 0) {
        saveLocalQuestions(localToSave);
      }
    }
  } catch (err) {
    console.error('Failed to save questions to localStorage:', err);
  }
}

export function resetStoredQuestions() {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_QUESTIONS_KEY);
      localStorage.removeItem(STATUSES_KEY);
      localStorage.removeItem(OLD_QUESTIONS_KEY);
      localStorage.removeItem(HIDDEN_INITIAL_KEY);
    }
    return INITIAL_QUESTIONS.map((q) => ({ ...q }));
  } catch (err) {
    console.error('Failed to reset questions in localStorage:', err);
    return INITIAL_QUESTIONS;
  }
}

export function getStoredTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
}

export function saveStoredTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.error('Failed to save theme to localStorage:', err);
  }
}
