import Resume from "../models/Resume.js";


const getUserId = (req) => {
  return req.user?._id || req.user?.id;
};

export const createMyResume = async (req, res) => {
  try {
    const userId = getUserId(req);

    const {
      fullName,
      email,
      phone,
      location,
      summary,
      education,
      experience,
      skills,
      portfolioUrl,
      resumeUrl,
    } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        message: "Full name and email are required",
      });
    }

    const existingResume = await Resume.findOne({ userId });

    if (existingResume) {
      return res.status(409).json({
        success: false,
        message: "Resume already exists. Please update your existing resume.",
      });
    }

    const resume = await Resume.create({
      userId,
      fullName,
      email,
      phone,
      location,
      summary,
      education,
      experience,
      skills,
      portfolioUrl,
      resumeUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Resume created successfully",
      data: resume,
    });
  } catch (error) {
    console.error("Create resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create resume",
    });
  }
};


export const getMyResume = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const resume = await Resume.findOne({ userId });

    return res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error("Get resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
    });
  }
};

export const updateMyResume = async (req, res) => {
    try {
      const userId = getUserId(req);
  
      const {
        fullName,
        email,
        phone,
        location,
        summary,
        education,
        experience,
        skills,
        portfolioUrl,
        resumeUrl,
      } = req.body;
  
      if (!fullName || !email) {
        return res.status(400).json({
          success: false,
          message: "Full name and email are required",
        });
      }
  
      const resume = await Resume.findOneAndUpdate(
        { userId },
        {
          fullName,
          email,
          phone,
          location,
          summary,
          education,
          experience,
          skills,
          portfolioUrl,
          resumeUrl,
        },
        {
          new: true,
          runValidators: true,
        }
      );
  
      if (!resume) {
        return res.status(404).json({
          success: false,
          message: "Resume not found. Please create one first.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Resume updated successfully",
        data: resume,
      });
    } catch (error) {
      console.error("Update resume error:", error);
  
      return res.status(500).json({
        success: false,
        message: "Failed to update resume",
      });
    }
  };
  
export const deleteMyResume = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const resume = await Resume.findOneAndDelete({ userId });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete resume",
    });
  }
};