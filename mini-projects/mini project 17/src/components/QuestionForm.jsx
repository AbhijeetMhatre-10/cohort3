import React, { useState } from 'react';
import { X, Save, PlusCircle, AlertCircle } from 'lucide-react';

export function QuestionForm({
  isOpen,
  initialData = null,
  onSave,
  onClose,
}) {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState(() => ({
    title: initialData?.title || '',
    difficulty: initialData?.difficulty || 'Easy',
    status: initialData?.status || 'Pending',
    url: initialData?.url || '',
    week: initialData?.week || 1,
  }));

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = 'Title is required';
    }

    if (!['Easy', 'Medium', 'Hard'].includes(formData.difficulty)) {
      newErrors.difficulty = 'Invalid difficulty';
    }

    if (!['Pending', 'In Progress', 'Completed'].includes(formData.status)) {
      newErrors.status = 'Invalid status';
    }

    const weekNum = Number(formData.week);
    if (!Number.isInteger(weekNum) || weekNum < 1) {
      newErrors.week = 'Week must be a positive integer';
    }

    if (formData.url && formData.url.trim() !== '') {
      try {
        const parsed = new URL(formData.url.trim());
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          newErrors.url = 'URL must start with http:// or https://';
        }
      } catch {
        newErrors.url = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...(initialData || {}),
      title: formData.title.trim(),
      difficulty: formData.difficulty,
      status: formData.status,
      url: formData.url.trim(),
      week: Number(formData.week),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-dialog-title"
        aria-describedby="form-dialog-desc"
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 z-10 animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 id="form-dialog-title" className="text-xl font-extrabold text-slate-900 dark:text-white">
              {isEdit ? 'Edit DSA Problem' : 'Add DSA Problem'}
            </h2>
            <p id="form-dialog-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEdit
                ? 'Update problem title, difficulty, status, or URL.'
                : 'Add a new problem to your practice sheet.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="problem-title-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Problem Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="problem-title-input"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Invert Binary Tree"
              autoFocus
              aria-invalid={Boolean(errors.title)}
              className={`w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border ${
                errors.title ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
              } rounded-xl text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500`}
            />
            {errors.title && (
              <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
              </p>
            )}
          </div>

          {/* Difficulty & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="problem-diff-select" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Difficulty
              </label>
              <select
                id="problem-diff-select"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label htmlFor="problem-status-select" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Status
              </label>
              <select
                id="problem-status-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Week */}
          <div>
            <label htmlFor="problem-week-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Week Number <span className="text-rose-500">*</span>
            </label>
            <input
              id="problem-week-input"
              type="number"
              min="1"
              value={formData.week}
              onChange={(e) => setFormData({ ...formData, week: e.target.value })}
              aria-invalid={Boolean(errors.week)}
              className={`w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border ${
                errors.week ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
              } rounded-xl text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500`}
            />
            {errors.week && (
              <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.week}
              </p>
            )}
          </div>

          {/* URL */}
          <div>
            <label htmlFor="problem-url-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              LeetCode / Problem URL
            </label>
            <input
              id="problem-url-input"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://leetcode.com/problems/..."
              aria-invalid={Boolean(errors.url)}
              className={`w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border ${
                errors.url ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
              } rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500`}
            />
            {errors.url ? (
              <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.url}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1">
                Clicking the problem from the dashboard will automatically mark it "In Progress".
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              {isEdit ? <Save className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
              {isEdit ? 'Save Changes' : 'Add Problem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
