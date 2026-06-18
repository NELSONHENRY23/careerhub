import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import useAuth from "../hooks/useAuth";
import useFeedback from '../hooks/useFeedback';
import FeedbackAlert from './FeedbackAlert';

const initialFormData = {
  fullName: "",
  email: "",
  phone: "",
  resume: "",
  coverLetter: "",
};

function ApplyJobModal({ job, isOpen, onClose }) {
  const applyFeedback = useFeedback(4000);
  
  const [formData, setFormData] = useState(initialFormData);
  const [savedResume, setSavedResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingResume, setLoadingResume] = useState(false);
 
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (!isOpen || !token) return;

    const fetchSavedResume = async () => {
      try {
        setLoadingResume(true);
        setSavedResume(null);

        const response = await api.get("/api/resumes/me");
        const resumeData = response.data?.data;

        if (resumeData) {
          setSavedResume(resumeData);

          setFormData((prev) => ({
            ...prev,
            fullName: prev.fullName || resumeData.fullName || "",
            email: prev.email || resumeData.email || "",
            phone: prev.phone || resumeData.phone || "",
            resume: prev.resume || resumeData.resumeUrl || "",
          }));
        }
      } catch (error) {
        console.error("Failed to load saved resume:", error);
      } finally {
        setLoadingResume(false);
      }
    };

    fetchSavedResume();
  }, [isOpen, token]);

  const handleClose = () => {
    if (loading) return;

    applyFeedback.clearFeedback();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    applyFeedback.clearFeedback();

    if (!job?._id) {
      applyFeedback.showError("Job information is missing. Please try again.");
      
      return;
    }

    if (!token) {
      applyFeedback.showError("You must be logged in to apply for this job.");
      return;
    }

    if (!savedResume?._id && !formData.resume.trim()) {
      applyFeedback.showError("Please provide a resume URL or create a saved resume first.");
      return;
    }

    setLoading(true);
  

    try {
      const payload = {
        jobId: job._id,
        resumeId: savedResume?._id || null,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        resume: formData.resume.trim(),
        coverLetter: formData.coverLetter.trim(),
      };

      const response = await api.post("/api/applications", payload);

      if (response.status === 200 || response.status === 201) {
        setFormData(initialFormData);
        navigate('/my-applications');
      } else {
        applyFeedback.showError(
          response.data?.message ||
            "Failed to submit application. Please try again."
        );
       
      }
    } catch (error) {
      console.error(error);

      applyFeedback.showError(
        error.response?.data?.message ||
          "An error occurred. Please try again later."
      );
   
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-slate-900">
          Apply to {job.title}
        </h2>

        <p className="mt-2 text-sm text-slate-600">{job.company}</p>

        {loadingResume && (
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            Checking for saved resume...
          </div>
        )}

        {savedResume && (
          <div className="mt-4 rounded-2xl bg-green-50 p-4 text-sm text-green-700">
            Saved resume detected. This application will be linked to your saved
            resume.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Phone
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Resume URL
            </label>

            <input
              type="url"
              name="resume"
              value={formData.resume}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Link to your resume"
            />

            {savedResume && (
              <p className="mt-2 text-xs text-slate-500">
                Optional because your saved resume is already linked.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Cover Letter
            </label>

            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              rows="4"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Tell them why you're a great fit..."
            />
          </div>

          <FeedbackAlert feedback={applyFeedback.feedback} className="mt-3" />

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyJobModal;