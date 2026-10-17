import React from 'react';

export function Dashboard({ questions = [] }) {
  const total = questions.length;
  const completed = questions.filter((q) => q.status === 'Completed').length;
  const inProgress = questions.filter((q) => q.status === 'In Progress').length;
  const pending = total - completed - inProgress;
  const overallPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Breakdown by difficulty
  const easyTotal = questions.filter((q) => q.difficulty === 'Easy').length;
  const easyCompleted = questions.filter((q) => q.difficulty === 'Easy' && q.status === 'Completed').length;
  const easyPct = easyTotal > 0 ? Math.round((easyCompleted / easyTotal) * 100) : 0;

  const medTotal = questions.filter((q) => q.difficulty === 'Medium').length;
  const medCompleted = questions.filter((q) => q.difficulty === 'Medium' && q.status === 'Completed').length;
  const medPct = medTotal > 0 ? Math.round((medCompleted / medTotal) * 100) : 0;

  const hardTotal = questions.filter((q) => q.difficulty === 'Hard').length;
  const hardCompleted = questions.filter((q) => q.difficulty === 'Hard' && q.status === 'Completed').length;
  const hardPct = hardTotal > 0 ? Math.round((hardCompleted / hardTotal) * 100) : 0;

  // Circular progress calculations
  const size = 88;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallPercentage / 100) * circumference;

  return (
    <div className="space-y-4">
      {/* Main Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        {/* Header Tag */}
        <div className="mb-6">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-purple-700 bg-purple-100 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 mb-2">
            Fastrack Sheet
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            DSA Practice Tracker
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Week-wise practice sheets to close skill gaps faster before assessments.
          </p>
        </div>

        {/* Hero Progress Area */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          {/* Circular Progress Ring */}
          <div className="shrink-0 relative flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800/70 p-1">
            <svg
              className="transform -rotate-90"
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-slate-200 dark:text-slate-700"
                fill="transparent"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#8B5CF6"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {overallPercentage}%
              </span>
            </div>
          </div>

          {/* Solved Count + Horizontal Bar */}
          <div className="flex-1 w-full min-w-0">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {completed} / {total}
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                solved
              </span>
            </div>

            {/* Horizontal Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>

            <div className="flex gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {completed} Completed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {inProgress} In Progress
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                {pending} Pending
              </span>
            </div>
          </div>
        </div>

        {/* 3 Difficulty Cards: Easy / Medium / Hard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            { label: 'EASY', total: easyTotal, done: easyCompleted, pct: easyPct, textColor: 'text-emerald-600 dark:text-emerald-400', barColor: 'bg-emerald-500' },
            { label: 'MEDIUM', total: medTotal, done: medCompleted, pct: medPct, textColor: 'text-amber-600 dark:text-amber-400', barColor: 'bg-amber-500' },
            { label: 'HARD', total: hardTotal, done: hardCompleted, pct: hardPct, textColor: 'text-rose-600 dark:text-rose-400', barColor: 'bg-rose-500' },
          ].map((item) => (
            <div key={item.label} className="bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex justify-between">
                <span>{item.label}</span>
                <span className={`${item.textColor} font-bold`}>{item.pct}%</span>
              </div>
              <div className={`text-xl sm:text-2xl font-black ${item.textColor}`}>
                {item.done} / {item.total}
              </div>
              <div className="w-full bg-slate-200/70 dark:bg-slate-700 rounded-full h-1.5 mt-2.5 overflow-hidden">
                <div
                  className={`${item.barColor} h-1.5 rounded-full transition-all duration-500`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Note Banner */}
      <div className="w-full bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/60 rounded-2xl p-4 text-xs sm:text-sm text-amber-900 dark:text-amber-200/90 shadow-xs flex items-start sm:items-center gap-3">
        <span className="shrink-0 px-2 py-0.5 rounded font-black text-[11px] tracking-wider uppercase bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
          NOTE
        </span>
        <p className="leading-relaxed">
          This is your last-minute practice checklist. Checkboxes do not sync with Learning Portal progress. Mark each question yourself after you practice it.
        </p>
      </div>
    </div>
  );
}
