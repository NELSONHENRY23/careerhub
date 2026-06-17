//import { jobs } from "../data/jobs";
import Job from '../models/Job.js';
// get all jobs
export const getAllJobs = async (req, res) => {
    try {
      const jobs = await Job.find();
  
      res.status(200).json({
        success: true,
        data: jobs,
      });
    } catch (error) {
      console.error(error);
  
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  };

// get single job by id
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    // handle error if not found
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    } else {
      res.status(200).json({ success: true, data: job });
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Add a new job
export const addJob = async (req, res) => {
    try {
        const { title, company, location, salary, category, description } = req.body;

        if (!title || !company || !location || !salary || !description) {
          return res.status(400).json({ message: 'All fields are required' });
        }
      
        const existingJob = await Job.findOne({
          title,
          company,
          location,
        });
      
        if (existingJob) {
          return res.status(409).json({
            message: 'This job already exists',
          });
        }
      
        const job = await Job.create(req.body);
        res.status(201).json({ message: 'Job added successfully', job });
    } catch (error) {
        console.error(error);

        res.status(500).json({
          success: false,
          message: 'Server error',
        });
    }
 
};

// Delete a job (admin only)
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
      data: job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const updateJob = async (req, res) => {
    try {
      const { id } = req.params;
  
      const job = await Job.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
  
      if (!job) {
        return res.status(404).json({
          message: 'Job not found',
        });
      }
  
      res.status(200).json({
        success: true,
        data: job,
      });
    } catch (error) {
      console.error(error);
  
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  };