import { jobs } from "../data/jobs";

// get all jobs
export const getAllJobs =  (req, res) => {
    res.json(jobs);
}

// get single job by id
export const getJobById = (req, res) => {
    const job = jobs.find(j => j.id == req.params.id);
    if (job) {
        res.json(job);
    } else {
        res.status(404).json({ message: "Job not found" });
    }
}


// Add a new job
export const addJob = (req, res) => {
    const newJob = {
        id: jobs.length + 1,
        ...req.body
    };
    jobs.push(newJob);
    res.status(201).json(newJob);
}