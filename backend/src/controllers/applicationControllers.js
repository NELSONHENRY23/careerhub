import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Resume from '../models/Resume.js';

// Create a new job application
export const createApplication = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const {
      jobId,
      resumeId,
      fullName,
      email,
      phone,
      resume,
      coverLetter,
    } = req.body;

    // Validate required fields first
    if (!jobId || !fullName || !email) {
      return res.status(400).json({
        success: false,
        message: "Job, full name, and email are required",
      });
    }

    // User must provide either saved resumeId or resume URL
    if (!resumeId && !resume) {
      return res.status(400).json({
        success: false,
        message: "Please provide a resume or select your saved resume",
      });
    }

    // Validate job exists before creating application
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if user already applied to this job
    const existingApplication = await Application.findOne({
      jobId,
      userId,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied to this job",
      });
    }

    // Validate resumeId only if user selected saved resume
    let validResumeId = null;

    if (resumeId) {
      const savedResume = await Resume.findOne({
        _id: resumeId,
        userId,
      });

      if (!savedResume) {
        return res.status(400).json({
          success: false,
          message: "Invalid resume selected",
        });
      }

      validResumeId = savedResume._id;
    }

    // Create application only once
    const application = await Application.create({
      jobId,
      userId,
      resumeId: validResumeId,
      fullName,
      email,
      phone,
      resume,
      coverLetter,
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    console.error("Create application error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while submitting application",
    });
  }
};

// Get all applications for the current user
export const getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.find({ userId })
      .populate('jobId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get applications for a specific job (admin only)
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ jobId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update application status (admin only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'reviewed', 'rejected', 'accepted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true },
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated',
      data: application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete an application (user or admin)
export const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Allow users to delete their own applications, admins can delete any
    if (application.userId.toString() !== userId && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Unauthorized to delete this application' });
    }

    await Application.findByIdAndDelete(applicationId);

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get application by id
export const getApplicationById = async (req, res) => {
    try {
      const { applicationId } = req.params;
  
      const application = await Application.findById(applicationId)
        .populate('jobId')
        .populate('userId', 'name email');
  
      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found',
        });
      }
  
      // Allow owner or admin
      if (
        application.userId._id.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
        });
      }
  
      res.status(200).json({
        success: true,
        data: application,
      });
    } catch (error) {
      console.error(error);
  
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  };