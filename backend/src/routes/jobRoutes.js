import express from "express";
import {
    getJobs,
    getJobById,
    addJob
} from "../controllers/jobControllers";

const router = express.Router();

router.get("/jobs", getJobs);
router.get("/jobs/:id", getJobById);
router.post("/jobs", addJob);

export default router;