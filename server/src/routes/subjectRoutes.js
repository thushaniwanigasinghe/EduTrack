import express from 'express';
import { body } from 'express-validator';
import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} from '../controllers/subjectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.get('/', getSubjects);
router.get('/:id', getSubjectById);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Subject name is required'),
    body('code').trim().notEmpty().withMessage('Subject code is required'),
  ],
  validate,
  createSubject
);

router.put(
  '/:id',
  [
    body('name').optional().trim().notEmpty().withMessage('Subject name cannot be empty'),
    body('code').optional().trim().notEmpty().withMessage('Subject code cannot be empty'),
  ],
  validate,
  updateSubject
);

router.delete('/:id', deleteSubject);

export default router;
