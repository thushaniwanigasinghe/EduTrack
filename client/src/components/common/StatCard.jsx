import React from 'react';

export const StatCard = ({
  title,
  value,
  unit = '',
  icon: Icon,
  colorScheme = 'slate',
  subtitle,
}) => {
  const accentColors = {
    indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40',
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40',
    rose: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40',
    slate: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800',
  };

  const badgeStyle = accentColors[colorScheme] || accentColors.slate;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200/70 dark:border-gray-700/60 shadow-xs hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide uppercase">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${badgeStyle}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline space-x-1">
        <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          {value}
        </span>
        {unit && <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{unit}</span>}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;
