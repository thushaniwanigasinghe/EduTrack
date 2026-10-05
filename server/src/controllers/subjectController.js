import { Subject } from '../models/Subject.js';
import { Mark } from '../models/Mark.js';
import { ApiError } from '../utils/ApiError.js';

// Get all subjects
export const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });

    // Attach mark counts for UI insight
    const subjectWithCounts = await Promise.all(
      subjects.map(async (subj) => {
        const markCount = await Mark.countDocuments({ subject: subj._id });
        return {
          ...subj.toObject(),
          markCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: subjectWithCounts.length,
      data: subjectWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// Get single subject by ID

export const getSubjectById = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return next(new ApiError(404, 'Subject not found'));
    }

    res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

//Create subject
export const createSubject = async (req, res, next) => {
  try {
    const { name, code } = req.body;

    const existingName = await Subject.findOne({ name });
    if (existingName) {
      return next(new ApiError(400, `Subject with name '${name}' already exists`));
    }

    const existingCode = await Subject.findOne({ code: code.toUpperCase() });
    if (existingCode) {
      return next(new ApiError(400, `Subject code '${code}' already exists`));
    }

    const subject = await Subject.create({
      name,
      code: code.toUpperCase(),
    });

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

// Update subject
export const updateSubject = async (req, res, next) => {
  try {
    const { name, code } = req.body;

    let subject = await Subject.findById(req.params.id);
    if (!subject) {
      return next(new ApiError(404, 'Subject not found'));
    }

    if (name && name !== subject.name) {
      const existingName = await Subject.findOne({ name });
      if (existingName) {
        return next(new ApiError(400, `Subject with name '${name}' already exists`));
      }
    }

    if (code && code.toUpperCase() !== subject.code) {
      const existingCode = await Subject.findOne({ code: code.toUpperCase() });
      if (existingCode) {
        return next(new ApiError(400, `Subject code '${code}' already exists`));
      }
    }

    subject.name = name || subject.name;
    subject.code = code ? code.toUpperCase() : subject.code;

    await subject.save();

    res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

//Delete subject 
export const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return next(new ApiError(404, 'Subject not found'));
    }

    // Check if marks exist for this subject
    const marksExist = await Mark.exists({ subject: subject._id });
    if (marksExist) {
      return next(
        new ApiError(
          400,
          `Cannot delete subject '${subject.name}' because it has associated marks records`
        )
      );
    }

    await subject.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
