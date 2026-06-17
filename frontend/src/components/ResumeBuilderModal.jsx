import { useState, useEffect } from 'react';
import { api } from '../services/api'

const initialFormData = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  education: "",
  experience: "",
  skills: "",
  portfolioUrl: "",
  resumeUrl: "",
};

function ResumeBuilderModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [resumeId, setResumeId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [loadingResume, setLoadingResume] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if(!isOpen) return;

    const fetchResume = async () => {
      try {
        setLoadingResume(true);

        const response = await api.get("/api/resumes/me");
        const resume = response.data?.data;

        if(resume){
          setResumeId(resume._id);
          setFormData({
            ...initialFormData,
            fullName: resume.fullName || "",
            email: resume.email || "",
            phone: resume.phone || "",
            location: resume.location || "",
            summary: resume.summary || "",
            education: resume.education || "",
            experience: resume.experience || "",
            skills: resume.skills || "",
            portfolioUrl: resume.portfolioUrl || "",
            resumeUrl: resume.resumeUrl || "",
          });
        }else{
          setResumeId(null);
          setFormData(initialFormData);
        }
      } catch (error) {
        console.error("Failed to load resume: ", error);
        setMessage("Failed to load saved resume.");
        setMessageType("error");
        
      }finally{
        setLoadingResume(false);
      }
    };

    fetchResume();
  }, [isOpen]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    if(loading) return;

    setMessage('');
    setMessageType("");
    setStep(1);
    onClose();
  };

  const nextStep = () => {
    setMessage("");
    setMessageType("");
    setStep((prev) => Math.min(prev + 1, 4));
  }
  const previousStep = () => {
    setMessage("");
    setMessageType("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setMessageType("");

      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        summary: formData.summary.trim(),
        education: formData.education.trim(),
        experience: formData.experience.trim(),
        skills: formData.skills.trim(),
        portfolioUrl: formData.portfolioUrl.trim(),
        resumeUrl: formData.resumeUrl.trim(),
      }
      
      const response = resumeId ? await api.put("/api/resumes/me", payload) : await api.post("/api/resumes", payload);
      
      if (response.data.success){
        setMessage(
          resumeId ? "Resume updated successfully!" : "Resume created successfully!"
        );

        setMessageType("success");

        if(response.data.data?._id){
          setResumeId(response.data.data._id);
        }
      }else{
        setMessage("Failed to save resume.");
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "An error occurred while saving your resume."
      )

      setMessageType("error");
    }finally{
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-900 disabled:opacity-50"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
            Resume Builder
          </p>

          <h2 className="mt-3 text-2xl font-bold text-slate-900">
            Build your professional resume
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Step {step} of 4
          </p>
        </div>

        {loadingResume ? (
          <p className="mt-6 text-sm text-slate-600">Loading resume...</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {step === 1 && (
              <>
                <h3 className="text-lg font-semibold text-slate-900">
                  Personal Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Full name"
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email address"
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  />

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="text-lg font-semibold text-slate-900">
                  Professional Summary
                </h3>

                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows="5"
                  required
                  placeholder="Briefly describe your background, strengths, and career goals."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </>
            )}

            {step === 3 && (
              <>
                <h3 className="text-lg font-semibold text-slate-900">
                  Education and Experience
                </h3>

                <textarea
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  rows="4"
                  required
                  placeholder="Education"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />

                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  rows="5"
                  required
                  placeholder="Experience / Projects"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </>
            )}

            {step === 4 && (
              <>
                <h3 className="text-lg font-semibold text-slate-900">
                  Skills and Links
                </h3>

                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  rows="4"
                  required
                  placeholder="Skills"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="url"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    placeholder="Portfolio URL"
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  />

                  <input
                    type="url"
                    name="resumeUrl"
                    value={formData.resumeUrl}
                    onChange={handleChange}
                    placeholder="Resume file URL"
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              </>
            )}

            {message && (
              <p
                className={`text-sm font-medium ${
                  messageType === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <div className="flex flex-wrap justify-between gap-4 pt-4">
              <div className="flex gap-3">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={previousStep}
                    className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  >
                    Back
                  </button>
                )}

                {step < 4 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Next
                  </button>
                )}

                {step === 4 && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading
                      ? "Saving..."
                      : resumeId
                        ? "Update Resume"
                        : "Create Resume"}
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-50"
              >
                Close
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}


export default ResumeBuilderModal;
