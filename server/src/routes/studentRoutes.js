import express from 'express';
import { body } from 'express-validator';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

router.get('/', getStudents);
router.get('/:id', getStudentById);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Student name is required'),
    body('indexNo').trim().notEmpty().withMessage('Index number is required'),
    body('className').trim().notEmpty().withMessage('Class name is required'),
    body('email').optional({ checkFalsy: true }).isEmail().withMessage('Please provide a valid email'),
  ],
  validate,
  createStudent
);

router.put(
  '/:id',
  [
    body('name').optional().trim().notEmpty().withMessage('Student name cannot be empty'),
    body('indexNo').optional().trim().notEmpty().withMessage('Index number cannot be empty'),
    body('className').optional().trim().notEmpty().withMessage('Class name cannot be empty'),
    body('email').optional({ checkFalsy: true }).isEmail().withMessage('Please provide a valid email'),
  ],
  validate,
  updateStudent
);

router.delete('/:id', deleteStudent);

export default router;
