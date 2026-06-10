import express from 'express';
import {
  getAllJobs,
  getJobById,
  addJob,
} from '../controllers/jobControllers.js';

const router = express.Router();

router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', addJob);

export default router;
