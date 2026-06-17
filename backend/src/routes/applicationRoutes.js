import express from 'express';
import {
  createApplication,
  getUserApplications,
  getApplicationById,
  getJobApplications,
  updateApplicationStatus,
  deleteApplication,
} from '../controllers/applicationControllers.js';

import { authMiddleware } from '../middleware/authmiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Admin routes
router.get('/job/:jobId', authMiddleware, roleMiddleware("admin"), getJobApplications); // Get applications for a job
router.put(
  '/:applicationId/status',
  authMiddleware,
  roleMiddleware("admin"),
  updateApplicationStatus,
); // Update application status

// User routes
router.post('/', authMiddleware, createApplication); // Create application
router.get('/my-applications', authMiddleware, getUserApplications); // Get user's applications
router.get('/:applicationId', authMiddleware,getApplicationById); // Get application 
router.delete('/:applicationId', authMiddleware, deleteApplication); // Delete own application

export default router;
