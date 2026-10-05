/**
 * Returns Tailwind badge CSS classes based on grade letter
 */
export const getGradeBadgeColor = (grade) => {
  switch (grade) {
    case 'A':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    case 'B':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    case 'C':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    case 'S':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800';
    case 'F':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
  }
};

/**
 * Returns color hex code for charts according to grade
 */
export const getGradeChartColor = (grade) => {
  switch (grade) {
    case 'A':
      return '#10b981'; // Emerald 500
    case 'B':
      return '#3b82f6'; // Blue 500
    case 'C':
      return '#f59e0b'; // Amber 500
    case 'S':
      return '#f97316'; // Orange 500
    case 'F':
      return '#ef4444'; // Rose 500
    default:
      return '#6b7280';
  }
};

/**
 * Formats a number to 1 decimal place safely
 */
export const formatNumber = (num, decimals = 1) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return Number(num).toFixed(decimals);
};
