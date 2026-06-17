import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true }, 
    category: {
      type: String,
      enum: [
        "Software Engineering",
        "Healthcare",
        "Finance",
        "Marketing",
        "Education",
        "Engineering",
        "Other",
      ],
      default: "Other",
    },
    description: { type: String, required: true },
    type: { type: String, default: 'Full-time' },
    postedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

const Job = mongoose.model('Job', JobSchema);

export default Job;
