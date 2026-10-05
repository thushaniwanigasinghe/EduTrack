
export const calculateGrade = (marks) => {
  const numericMarks = Number(marks);
  if (isNaN(numericMarks)) return 'F';
  if (numericMarks >= 75) return 'A';
  if (numericMarks >= 65) return 'B';
  if (numericMarks >= 50) return 'C';
  if (numericMarks >= 35) return 'S';
  return 'F';
};
