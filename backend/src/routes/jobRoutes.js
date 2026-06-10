import express from 'express';
import {
  getAllJobs,
  getJobById,
  addJob,
} from '../controllers/jobControllers.js';
import { authMiddleware } from '../middleware/authmiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/',authMiddleware, getAllJobs);
router.get('/:id',authMiddleware, getJobById);
router.post('/',authMiddleware, roleMiddleware, addJob);

export default router;
