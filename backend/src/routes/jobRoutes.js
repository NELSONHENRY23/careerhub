import express from 'express';
import {
  getAllJobs,
  getJobById,
  addJob,
  deleteJob,
  updateJob,
} from '../controllers/jobControllers.js';
import { authMiddleware } from '../middleware/authmiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/',  getAllJobs);
router.get('/:id',  getJobById);
router.post('/', authMiddleware, roleMiddleware("admin"), addJob);
router.delete('/:id', authMiddleware, roleMiddleware("admin"), deleteJob);
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware("admin"),
  updateJob
);

export default router;
