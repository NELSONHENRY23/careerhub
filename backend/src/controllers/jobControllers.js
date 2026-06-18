// import { jobs } from "../data/jobs";
import Job from '../models/Job.js';
import Application from '../models/Application.js';

const getUserId = (req) => req.user?.id || req.user?._id;

const ownsJob = (job, userId) => {
  if (!job?.postedBy || !userId) return false;

  return job.postedBy.toString() === userId.toString();
};

// Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error('Get all jobs error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while fetching jobs',
    });
  }
};

// Get jobs posted by current admin
export const getMyJobs = async (req, res) => {
  try {
    const userId = getUserId(req);

    const jobs = await Job.find({ postedBy: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error('Get my jobs error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while fetching your jobs',
    });
  }
};

// Get single job by id
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id).populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error('Get job by id error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while fetching job',
    });
  }
};

// Add a new job
export const addJob = async (req, res) => {
  try {
    const userId = getUserId(req);

    const {
      title,
      company,
      location,
      salary,
      category,
      description,
      type,
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Please login again.',
      });
    }

    if (!title || !company || !location || !salary || !description) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const existingJob = await Job.findOne({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      postedBy: userId,
    });

    if (existingJob) {
      return res.status(409).json({
        success: false,
        message: 'You have already posted this job',
      });
    }

    const job = await Job.create({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      salary: salary.trim(),
      category: category || 'Other',
      description: description.trim(),
      type: type || 'Full-time',
      postedBy: userId,
    });

    res.status(201).json({
      success: true,
      message: 'Job added successfully',
      job,
    });
  } catch (error) {
    console.error('Add job error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while adding job',
    });
  }
};

// Delete own job only
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (!ownsJob(job, userId)) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete jobs that you posted',
      });
    }

    await Application.deleteMany({ jobId: id });
    await Job.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Job and applications deleted successfully',
      data: job,
    });
  } catch (error) {
    console.error('Delete job error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while deleting job',
    });
  }
};

// Update own job only
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (!ownsJob(job, userId)) {
      return res.status(403).json({
        success: false,
        message: 'You can only update jobs that you posted',
      });
    }

    const allowedUpdates = [
      'title',
      'company',
      'location',
      'salary',
      'category',
      'description',
      'type',
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] =
          typeof req.body[field] === 'string'
            ? req.body[field].trim()
            : req.body[field];
      }
    });

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job,
    });
  } catch (error) {
    console.error('Update job error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while updating job',
    });
  }
};