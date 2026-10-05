import { Student } from '../models/Student.js';
import { Mark } from '../models/Mark.js';
import { ApiError } from '../utils/ApiError.js';

// Get all students with search, class filter, pagination, sorting

export const getStudents = async (req, res, next) => {
  try {
    const { search, className, page = 1, limit = 10, sortBy = 'name', order = 'asc' } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { indexNo: { $regex: search, $options: 'i' } },
      ];
    }

    if (className) {
      query.className = className;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = order === 'desc' ? -1 : 1;

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      count: students.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// Get single student by ID with marks

export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return next(new ApiError(404, 'Student not found'));
    }

    const marks = await Mark.find({ student: req.params.id }).populate('subject', 'name code');

    res.status(200).json({
      success: true,
      data: {
        ...student.toObject(),
        marks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create a new student

export const createStudent = async (req, res, next) => {
  try {
    const { name, indexNo, className, email, phone } = req.body;

    const existingStudent = await Student.findOne({ indexNo });
    if (existingStudent) {
      return next(new ApiError(400, `Student with index number '${indexNo}' already exists`));
    }

    const student = await Student.create({
      name,
      indexNo,
      className,
      email,
      phone,
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// Update student

export const updateStudent = async (req, res, next) => {
  try {
    const { name, indexNo, className, email, phone } = req.body;

    let student = await Student.findById(req.params.id);
    if (!student) {
      return next(new ApiError(404, 'Student not found'));
    }

    if (indexNo && indexNo !== student.indexNo) {
      const existingIndex = await Student.findOne({ indexNo });
      if (existingIndex) {
        return next(new ApiError(400, `Student with index number '${indexNo}' already exists`));
      }
    }

    student.name = name || student.name;
    student.indexNo = indexNo || student.indexNo;
    student.className = className || student.className;
    student.email = email !== undefined ? email : student.email;
    student.phone = phone !== undefined ? phone : student.phone;

    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// Delete student and cascade delete associated marks
export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return next(new ApiError(404, 'Student not found'));
    }

    // Cascade delete associated marks
    await Mark.deleteMany({ student: student._id });
    await student.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Student and all associated marks deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
