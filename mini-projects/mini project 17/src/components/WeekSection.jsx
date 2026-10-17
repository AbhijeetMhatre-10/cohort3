import React from 'react';
import { Play } from 'lucide-react';
import { QuestionCard } from './QuestionCard';

export function WeekSection({
  week,
  questions = [],
  allWeekQuestions = questions,
  isExpanded = true,
  onToggle,
  onStatusChange,
  onOpenLink,
  onEdit,
  onDelete,
}) {
  const totalInWeek = allWeekQuestions.length;
  const completedInWeek = allWeekQuestions.filter((q) => q.status === 'Completed').length;
  const pct = totalInWeek > 0 ? Math.round((completedInWeek / totalInWeek) * 100) : 0;
  const isAllDone = totalInWeek > 0 && completedInWeek === totalInWeek;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      {/* Week Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-3xl cursor-pointer"
        aria-expanded={isExpanded}
        aria-label={`Toggle Week ${week} problems, ${completedInWeek} of ${totalInWeek} completed`}
      >
        {/* Left: Play button / icon + Week title */}
        <div className="flex items-center gap-3.5">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
              isExpanded
                ? 'bg-purple-600 text-white rotate-90'
                : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Week {week}
            </h2>
          </div>
        </div>

        {/* Right: Solved count + Horizontal Progress bar */}
        <div className="flex items-center gap-4 shrink-0 sm:w-64 justify-between sm:justify-end">
          <div className="text-sm font-bold text-purple-700 dark:text-purple-400 min-w-14 text-right">
            {completedInWeek} / {totalInWeek}
          </div>
          <div
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Week ${week} completion: ${pct}%`}
            className="w-28 sm:w-36 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden"
          >
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                isAllDone ? 'bg-emerald-500' : 'bg-purple-600'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </button>

      {/* Expanded Questions List */}
      {isExpanded && (
        <div className="px-5 pb-6 pt-1 border-t border-slate-100 dark:border-slate-800">
          {questions.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400 italic">
              No questions in this week match the active filters.
            </p>
          ) : (
            <div className="space-y-3 pt-3">
              {questions.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  onStatusChange={onStatusChange}
                  onOpenLink={onOpenLink}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
