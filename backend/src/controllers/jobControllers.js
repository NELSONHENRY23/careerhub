//import { jobs } from "../data/jobs";
import Job from "../models/Job.js";
// get all jobs
export const getAllJobs =  async (req, res) => {
    const jobs = await Job.find();
    res.json(jobs);
}

// get single job by id
export const getJobById = async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (job) {
        res.json(job);
    } else {
        res.status(404).json({ message: "Job not found" });
    }
}


// Add a new job
export const addJob = async (req, res) => {
    const job = await Job.create(req.body);
        res.status(201).json(job);
}