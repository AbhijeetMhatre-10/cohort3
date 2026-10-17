import React, { useState, useEffect } from 'react';
import {
  Plus,
  RotateCcw,
  SearchX,
  FolderPlus,
  AlertTriangle,
  X,
} from 'lucide-react';
import {
  getLocalQuestions,
  saveLocalQuestions,
  getSavedStatuses,
  saveSavedStatuses,
  getHiddenInitialIds,
  saveHiddenInitialIds,
  resetStoredQuestions,
  getStoredTheme,
  saveStoredTheme,
} from './utils/localStorage.js';
import { INITIAL_QUESTIONS } from './data/dummyQuestions.js';
import { Dashboard } from './components/Dashboard';
import { QuestionFilters } from './components/QuestionFilters';
import { WeekSection } from './components/WeekSection';
import { QuestionForm } from './components/QuestionForm';
import { ThemeToggle } from './components/ThemeToggle';

export function App() {
  // 1. Separate user-created questions dataset (persisted as LOCAL_QUESTIONS in LocalStorage)
  const [localQuestions, setLocalQuestions] = useState(() => getLocalQuestions());

  // 2. Saved question statuses map (persisted in LocalStorage)
  const [savedStatuses, setSavedStatuses] = useState(() => getSavedStatuses());

  // 3. User-deleted initial questions
  const [hiddenInitialIds, setHiddenInitialIds] = useState(() => getHiddenInitialIds());

  const [theme, setTheme] = useState(() => getStoredTheme());

  // 4. Filter states
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [status, setStatus] = useState('All');
  const [week, setWeek] = useState('All');

  // 5. UI states (weeks are expanded by default unless explicitly collapsed)
  const [collapsedWeeks, setCollapsedWeeks] = useState([]);
  const [modalState, setModalState] = useState({ isOpen: false, question: null });
  const [deletingQuestion, setDeletingQuestion] = useState(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Sync theme to LocalStorage and documentElement
  useEffect(() => {
    saveStoredTheme(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Derive synchronized combined question list:
  // - INITIAL_QUESTIONS is the default dataset with saved statuses applied
  // - LOCAL_QUESTIONS is the separate user-created dataset with saved statuses applied
  // - Unique IDs are used to avoid any duplicates
  const syncedInitial = INITIAL_QUESTIONS
    .filter((q) => !hiddenInitialIds.includes(q.id))
    .map((q) => ({
      ...q,
      status: savedStatuses[q.id] || q.status || 'Pending',
    }));

  const syncedLocal = localQuestions.map((q) => ({
    ...q,
    status: savedStatuses[q.id] || q.status || 'Pending',
  }));

  const initialIds = new Set(syncedInitial.map((q) => q.id));
  const questions = [
    ...syncedInitial,
    ...syncedLocal.filter((q) => !initialIds.has(q.id)),
  ];

  // Theme toggle
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Status change handler
  const handleStatusChange = (id, newStatus) => {
    setSavedStatuses((prev) => {
      const next = { ...prev, [id]: newStatus };
      saveSavedStatuses(next);
      return next;
    });
  };

  // Problem link clicked: if Pending, transition to In Progress
  const handleOpenLink = (question) => {
    if (question.status === 'Pending') {
      handleStatusChange(question.id, 'In Progress');
    }
  };

  // Add / Edit save handler
  const handleSaveQuestion = (formData) => {
    if (formData.id) {
      // Edit existing problem
      const isLocal = localQuestions.some((q) => q.id === formData.id);
      if (isLocal) {
        const nextLocal = localQuestions.map((q) =>
          q.id === formData.id ? { ...q, ...formData } : q
        );
        setLocalQuestions(nextLocal);
        saveLocalQuestions(nextLocal);
      }
      if (formData.status) {
        setSavedStatuses((prev) => {
          const next = { ...prev, [formData.id]: formData.status };
          saveSavedStatuses(next);
          return next;
        });
      }
    } else {
      // Add new question: save in LOCAL_QUESTIONS persisted in LocalStorage
      const newQuestion = {
        ...formData,
        id: `dsa-${Date.now()}`,
      };
      const nextLocal = [...localQuestions, newQuestion];
      setLocalQuestions(nextLocal);
      saveLocalQuestions(nextLocal);

      // Save initial status
      setSavedStatuses((prev) => {
        const next = { ...prev, [newQuestion.id]: newQuestion.status || 'Pending' };
        saveSavedStatuses(next);
        return next;
      });

      // Auto-expand the target week if collapsed
      setCollapsedWeeks((prev) => prev.filter((w) => w !== newQuestion.week));
    }
    setModalState({ isOpen: false, question: null });
  };

  // Delete problem handler
  const handleConfirmDelete = () => {
    if (deletingQuestion) {
      const isLocal = localQuestions.some((q) => q.id === deletingQuestion.id);
      if (isLocal) {
        const nextLocal = localQuestions.filter((q) => q.id !== deletingQuestion.id);
        setLocalQuestions(nextLocal);
        saveLocalQuestions(nextLocal);
      } else {
        const nextHidden = [...hiddenInitialIds, deletingQuestion.id];
        setHiddenInitialIds(nextHidden);
        saveHiddenInitialIds(nextHidden);
      }

      setSavedStatuses((prev) => {
        const next = { ...prev };
        delete next[deletingQuestion.id];
        saveSavedStatuses(next);
        return next;
      });

      setDeletingQuestion(null);
    }
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearch('');
    setDifficulty('All');
    setStatus('All');
    setWeek('All');
  };

  // Reset to default questions
  const handleConfirmReset = () => {
    resetStoredQuestions();
    setLocalQuestions([]);
    setSavedStatuses({});
    setHiddenInitialIds([]);
    handleClearFilters();
    setCollapsedWeeks([]);
    setIsResetConfirmOpen(false);
  };

  // Toggle week accordion
  const handleToggleWeek = (weekNum) => {
    setCollapsedWeeks((prev) =>
      prev.includes(weekNum) ? prev.filter((w) => w !== weekNum) : [...prev, weekNum]
    );
  };

  // Available unique weeks strictly from current questions
  const availableWeeks = [...new Set(questions.map((q) => Number(q.week)).filter(Boolean))].sort(
    (a, b) => a - b
  );

  // Active week filter (fallback to 'All' if selected week no longer exists)
  const activeWeek = week !== 'All' && availableWeeks.includes(Number(week)) ? week : 'All';

  // Filter questions
  const normalizedSearch = search.trim().toLowerCase();
  const filteredQuestions = questions.filter((q) => {
    if (normalizedSearch && !q.title.toLowerCase().includes(normalizedSearch)) {
      return false;
    }
    if (difficulty !== 'All' && q.difficulty !== difficulty) {
      return false;
    }
    if (status !== 'All' && q.status !== status) {
      return false;
    }
    if (activeWeek !== 'All' && String(q.week) !== String(activeWeek)) {
      return false;
    }
    return true;
  });

  // Target weeks to display: only weeks with questions matching current filter
  const targetWeeks = (activeWeek !== 'All'
    ? availableWeeks.filter((w) => w === Number(activeWeek))
    : availableWeeks
  ).filter((w) => filteredQuestions.some((q) => Number(q.week) === w));

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
              <img src="/shery.jpeg" className="w-10 h-10 object-cover rounded-xl" alt="Sheryians Logo" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                  DSA Sheet
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                  Sheryians
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Placement preparation & DSA tracker
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              title="Reset to default questions"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>

            <button
              type="button"
              onClick={() => setModalState({ isOpen: true, question: null })}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              <Plus className="w-4 h-4" />
              <span>Add Problem</span>
            </button>

            <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* 1. Dashboard Summary */}
        <Dashboard questions={questions} />

        {/* 2. Filters & Search */}
        <QuestionFilters
          search={search}
          onSearchChange={setSearch}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          status={status}
          onStatusChange={setStatus}
          week={activeWeek}
          onWeekChange={setWeek}
          onClear={handleClearFilters}
          availableWeeks={availableWeeks}
          totalMatched={filteredQuestions.length}
          totalAll={questions.length}
        />

        {/* 3. Empty States & Weekly Sections */}
        {questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <FolderPlus className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
              No questions in your sheet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
              Your practice list is empty. Restore the initial dummy questions or add your own problems.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 text-xs sm:text-sm font-medium border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                Restore Demo Questions
              </button>
              <button
                type="button"
                onClick={() => setModalState({ isOpen: true, question: null })}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                Add Problem
              </button>
            </div>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mb-4">
              <SearchX className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
              No matching questions found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
              None of your questions match the current search or filter criteria.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400 border border-purple-300 dark:border-purple-700 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              <RotateCcw className="w-4 h-4" /> Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {targetWeeks.map((weekNum) => {
              const allWeekQuestions = questions.filter((q) => Number(q.week) === weekNum);
              const weekQuestions = filteredQuestions.filter((q) => Number(q.week) === weekNum);

              return (
                <WeekSection
                  key={weekNum}
                  week={weekNum}
                  questions={weekQuestions}
                  allWeekQuestions={allWeekQuestions}
                  isExpanded={!collapsedWeeks.includes(weekNum)}
                  onToggle={() => handleToggleWeek(weekNum)}
                  onStatusChange={handleStatusChange}
                  onOpenLink={handleOpenLink}
                  onEdit={(q) => setModalState({ isOpen: true, question: q })}
                  onDelete={(q) => setDeletingQuestion(q)}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <span>DSA Sheet Sheryians · Student Practice Tracker</span>
          <span>Fast, minimal React & LocalStorage practice dashboard</span>
        </div>
      </footer>

      {/* Add / Edit Modal */}
      {modalState.isOpen && (
        <QuestionForm
          key={modalState.question ? modalState.question.id : 'new-question'}
          isOpen={modalState.isOpen}
          initialData={modalState.question}
          onSave={handleSaveQuestion}
          onClose={() => setModalState({ isOpen: false, question: null })}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setDeletingQuestion(null)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Delete Problem?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-slate-200">"{deletingQuestion.title}"</span>? This action cannot be undone.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeletingQuestion(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingQuestion(null)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                Delete Problem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsResetConfirmOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Reset to Demo Questions?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  This will reload the initial DSA practice questions and overwrite any current changes or progress.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
