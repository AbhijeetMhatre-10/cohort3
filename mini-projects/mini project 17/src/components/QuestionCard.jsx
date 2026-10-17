import React from 'react';
import { ExternalLink, Check, Edit2, Trash2 } from 'lucide-react';

export function QuestionCard({
  question,
  onStatusChange,
  onOpenLink,
  onEdit,
  onDelete,
}) {
  const isCompleted = question.status === 'Completed';
  const isInProgress = question.status === 'In Progress';

  const diffColors = {
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60',
    Hard: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60',
  };

  const statusColors = {
    Completed: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    'In Progress': 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    Pending: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  const handleToggleCheck = () => {
    const nextStatus = isCompleted ? 'Pending' : 'Completed';
    onStatusChange(question.id, nextStatus);
  };

  const handleLinkClick = () => {
    if (question.url) {
      onOpenLink(question);
    }
  };

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-4.5 transition-all bg-white dark:bg-slate-900 ${
        isCompleted
          ? 'border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10'
          : isInProgress
          ? 'border-amber-200/80 dark:border-amber-900/40'
          : 'border-slate-200/80 dark:border-slate-800'
      } flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs`}
    >
      {/* Left: Checkbox + Title + Link */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        {/* Manual completion checkbox */}
        <button
          type="button"
          role="checkbox"
          aria-checked={isCompleted}
          onClick={handleToggleCheck}
          className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
            isCompleted
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : isInProgress
              ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/30'
              : 'border-slate-300 dark:border-slate-600 hover:border-purple-500 bg-white dark:bg-slate-800'
          }`}
          title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          {!isCompleted && isInProgress && (
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>

        {/* Title & External Link */}
        <div className="min-w-0 flex items-center gap-2 flex-wrap">
          {question.url ? (
            <a
              href={question.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className={`text-sm sm:text-base font-semibold hover:underline flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded ${
                isCompleted
                  ? 'text-slate-500 dark:text-slate-400 line-through'
                  : 'text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400'
              }`}
              title="Open problem in new tab (marks In Progress if Pending)"
            >
              <span>{question.title}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </a>
          ) : (
            <span
              className={`text-sm sm:text-base font-semibold ${
                isCompleted
                  ? 'text-slate-500 dark:text-slate-400 line-through'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {question.title}
            </span>
          )}
        </div>
      </div>

      {/* Right: Difficulty badge + Status select + Edit/Delete buttons */}
      <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
        {/* Difficulty Badge */}
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
            diffColors[question.difficulty] || diffColors.Easy
          }`}
        >
          {question.difficulty}
        </span>

        {/* Status Dropdown */}
        <select
          value={question.status}
          onChange={(e) => onStatusChange(question.id, e.target.value)}
          className={`text-xs font-medium py-1 px-2.5 rounded-lg border cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
            statusColors[question.status] || statusColors.Pending
          }`}
          title="Change question status"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Edit & Delete actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(question)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            title="Edit question"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(question)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            title="Delete question"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
