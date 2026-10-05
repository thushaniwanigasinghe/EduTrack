import express from 'express';
import { body } from 'express-validator';
import {
  getMarks,
  getMarkById,
  createMark,
  updateMark,
  deleteMark,
} from '../controllers/markController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.get('/', getMarks);
router.get('/:id', getMarkById);

router.post(
  '/',
  [
    body('student').isMongoId().withMessage('Valid student ID is required'),
    body('subject').isMongoId().withMessage('Valid subject ID is required'),
    body('term')
      .isIn(['Term 1', 'Term 2', 'Term 3'])
      .withMessage('Term must be Term 1, Term 2, or Term 3'),
    body('marks')
      .isFloat({ min: 0, max: 100 })
      .withMessage('Marks must be a number between 0 and 100'),
  ],
  validate,
  createMark
);

router.put(
  '/:id',
  [
    body('student').optional().isMongoId().withMessage('Valid student ID is required'),
    body('subject').optional().isMongoId().withMessage('Valid subject ID is required'),
    body('term')
      .optional()
      .isIn(['Term 1', 'Term 2', 'Term 3'])
      .withMessage('Term must be Term 1, Term 2, or Term 3'),
    body('marks')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('Marks must be a number between 0 and 100'),
  ],
  validate,
  updateMark
);

router.delete('/:id', deleteMark);

export default router;
