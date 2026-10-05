import { Student } from '../models/Student.js';
import { Subject } from '../models/Subject.js';
import { Mark } from '../models/Mark.js';


export const getDashboardSummary = async (req, res, next) => {
  try {
    // 1. Total counts
    const totalStudents = await Student.countDocuments();
    const totalSubjects = await Subject.countDocuments();
    const totalMarksRecorded = await Mark.countDocuments();

    // 2. Class Average & Pass Rate across all mark entries
    const markStats = await Mark.aggregate([
      {
        $group: {
          _id: null,
          overallAvg: { $avg: '$marks' },
          totalMarks: { $sum: 1 },
          passedMarks: {
            $sum: {
              $cond: [{ $gte: ['$marks', 35] }, 1, 0],
            },
          },
        },
      },
    ]);

    const classAverage =
      markStats.length > 0 ? Math.round(markStats[0].overallAvg * 10) / 10 : 0;
    const passRate =
      markStats.length > 0 && markStats[0].totalMarks > 0
        ? Math.round((markStats[0].passedMarks / markStats[0].totalMarks) * 1000) / 10
        : 0;

    // 3. Subject-wise Averages 
    const allSubjects = await Subject.find().sort({ name: 1 });
    const subjectAverages = await Promise.all(
      allSubjects.map(async (subj) => {
        const stats = await Mark.aggregate([
          { $match: { subject: subj._id } },
          { $group: { _id: null, avg: { $avg: '$marks' }, count: { $sum: 1 } } },
        ]);
        const avg = stats.length > 0 ? Math.round(stats[0].avg * 10) / 10 : 0;
        const count = stats.length > 0 ? stats[0].count : 0;
        return {
          subject: subj.name,
          code: subj.code,
          average: avg,
          count: count,
        };
      })
    );

    // 4. Grade Distribution
    const gradeCountsRaw = await Mark.aggregate([
      {
        $group: {
          _id: '$grade',
          count: { $sum: 1 },
        },
      },
    ]);

    const gradeMap = {};
    gradeCountsRaw.forEach((item) => {
      if (item._id) {
        gradeMap[item._id] = item.count;
      }
    });

    const gradeDistribution = ['A', 'B', 'C', 'S', 'F'].map((grade) => ({
      grade,
      count: gradeMap[grade] || 0,
      percentage:
        totalMarksRecorded > 0
          ? Math.round(((gradeMap[grade] || 0) / totalMarksRecorded) * 1000) / 10
          : 0,
    }));

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalSubjects,
        totalMarksRecorded,
        classAverage,
        passRate,
        subjectAverages,
        gradeDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};
