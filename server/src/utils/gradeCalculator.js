/**
 * Calculates the letter grade based on numerical mark (0-100)
 * Grade boundaries:
 * A: 75 - 100
 * B: 65 - 74
 * C: 50 - 64
 * S: 35 - 49
 * F: 0 - 34
 */
export const calculateGrade = (marks) => {
  const numericMarks = Number(marks);
  if (isNaN(numericMarks)) return 'F';
  if (numericMarks >= 75) return 'A';
  if (numericMarks >= 65) return 'B';
  if (numericMarks >= 50) return 'C';
  if (numericMarks >= 35) return 'S';
  return 'F';
};
