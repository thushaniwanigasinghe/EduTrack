import { Mark } from '../models/Mark.js';
import { Student } from '../models/Student.js';
import { Subject } from '../models/Subject.js';
import { ApiError } from '../utils/ApiError.js';
import { calculateGrade } from '../utils/gradeCalculator.js';


export const getMarks = async (req, res, next) => {
  try {
    const { student, subject, term, className, search, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = {};

    if (student) query.student = student;
    if (subject) query.subject = subject;
    if (term) query.term = term;

    // Filter by student's className or search name if specified
    if (className || search) {
      const studentFilter = {};
      if (className) studentFilter.className = className;
      if (search) {
        studentFilter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { indexNo: { $regex: search, $options: 'i' } },
        ];
      }
      const matchingStudents = await Student.find(studentFilter).select('_id');
      const studentIds = matchingStudents.map((s) => s._id);
      query.student = { $in: studentIds };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = order === 'asc' ? 1 : -1;

    const total = await Mark.countDocuments(query);

    const marks = await Mark.find(query)
      .populate('student', 'name indexNo className email')
      .populate('subject', 'name code')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      count: marks.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
      data: marks,
    });
  } catch (error) {
    next(error);
  }
};

//  Get single mark record
export const getMarkById = async (req, res, next) => {
  try {
    const mark = await Mark.findById(req.params.id)
      .populate('student', 'name indexNo className')
      .populate('subject', 'name code');

    if (!mark) {
      return next(new ApiError(404, 'Mark record not found'));
    }

    res.status(200).json({
      success: true,
      data: mark,
    });
  } catch (error) {
    next(error);
  }
};

// Create mark entry
export const createMark = async (req, res, next) => {
  try {
    const { student, subject, term, marks } = req.body;

    const studentExists = await Student.findById(student);
    if (!studentExists) {
      return next(new ApiError(404, 'Student not found'));
    }

    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      return next(new ApiError(404, 'Subject not found'));
    }

    // Check duplicate compound record
    const duplicate = await Mark.findOne({ student, subject, term });
    if (duplicate) {
      return next(
        new ApiError(
          400,
          `Mark for student '${studentExists.name}', subject '${subjectExists.name}', and term '${term}' already exists`
        )
      );
    }

    const mark = await Mark.create({
      student,
      subject,
      term,
      marks: Number(marks),
      grade: calculateGrade(marks),
    });

    const populatedMark = await Mark.findById(mark._id)
      .populate('student', 'name indexNo className')
      .populate('subject', 'name code');

    res.status(201).json({
      success: true,
      message: 'Mark record added successfully',
      data: populatedMark,
    });
  } catch (error) {
    next(error);
  }
};

// Update mark entry

export const updateMark = async (req, res, next) => {
  try {
    const { student, subject, term, marks } = req.body;

    let markRecord = await Mark.findById(req.params.id);
    if (!markRecord) {
      return next(new ApiError(404, 'Mark record not found'));
    }

    const targetStudent = student || markRecord.student;
    const targetSubject = subject || markRecord.subject;
    const targetTerm = term || markRecord.term;

    // Check if updating to a duplicate entry
    if (
      targetStudent.toString() !== markRecord.student.toString() ||
      targetSubject.toString() !== markRecord.subject.toString() ||
      targetTerm !== markRecord.term
    ) {
      const existing = await Mark.findOne({
        student: targetStudent,
        subject: targetSubject,
        term: targetTerm,
        _id: { $ne: markRecord._id },
      });

      if (existing) {
        return next(
          new ApiError(400, `A mark record already exists for this student, subject, and term`)
        );
      }
    }

    markRecord.student = targetStudent;
    markRecord.subject = targetSubject;
    markRecord.term = targetTerm;
    if (marks !== undefined) {
      markRecord.marks = Number(marks);
      markRecord.grade = calculateGrade(marks);
    }

    await markRecord.save();

    const updatedMark = await Mark.findById(markRecord._id)
      .populate('student', 'name indexNo className')
      .populate('subject', 'name code');

    res.status(200).json({
      success: true,
      message: 'Mark record updated successfully',
      data: updatedMark,
    });
  } catch (error) {
    next(error);
  }
};

// Delete mark entry

export const deleteMark = async (req, res, next) => {
  try {
    const mark = await Mark.findById(req.params.id);
    if (!mark) {
      return next(new ApiError(404, 'Mark record not found'));
    }

    await mark.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Mark record deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
