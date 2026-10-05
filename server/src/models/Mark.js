import mongoose from 'mongoose';
import { calculateGrade } from '../utils/gradeCalculator.js';

const markSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject reference is required'],
    },
    term: {
      type: String,
      enum: ['Term 1', 'Term 2', 'Term 3'],
      required: [true, 'Term is required'],
    },
    marks: {
      type: Number,
      required: [true, 'Marks score is required'],
      min: [0, 'Marks cannot be less than 0'],
      max: [100, 'Marks cannot be greater than 100'],
    },
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'S', 'F'],
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index on (student, subject, term)
markSchema.index({ student: 1, subject: 1, term: 1 }, { unique: true });

// Auto-calculate grade before saving
markSchema.pre('save', function (next) {
  this.grade = calculateGrade(this.marks);
  next();
});

markSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.marks !== undefined) {
    update.grade = calculateGrade(update.marks);
  } else if (update.$set && update.$set.marks !== undefined) {
    update.$set.grade = calculateGrade(update.$set.marks);
  }
  next();
});

export const Mark = mongoose.model('Mark', markSchema);
