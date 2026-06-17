// models/Resume.js
import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
    {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
          unique: true,
        },
    
        fullName: {
          type: String,
          required: true,
          trim: true,
        },
    
        email: {
          type: String,
          required: true,
          trim: true,
        },
    
        phone: {
          type: String,
          trim: true,
        },
    
        location: {
          type: String,
          trim: true,
        },
    
        summary: {
          type: String,
          trim: true,
        },
    
        education: {
          type: String,
          trim: true,
        },
    
        experience: {
          type: String,
          trim: true,
        },
    
        skills: {
          type: String,
          trim: true,
        },
    
        portfolioUrl: {
          type: String,
          trim: true,
        },
    
        resumeUrl: {
          type: String,
          trim: true,
        },
      },
      { timestamps: true }
    );

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;