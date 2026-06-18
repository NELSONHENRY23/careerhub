import { useState } from 'react';
import { api } from '../services/api';
import { jobCategories } from '../data/jobCategories';

// JobPostModal allows admins to create new job postings.
// The form captures data matching your backend Job model: title, company, location, salary, description.
const initialFormData = {
    title: "",
    company: "",
    location: "",
    salary: "",
    category: "Other",
    description: "",
  };

function JobPostModal({ isOpen, onClose, onJobAdded }) {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState("");

  const handleClose = () => {
    if(loading) return;

    setMessage("");
    setMessageType("");
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

    setLoading(true);
    setMessage('');
    setMessageType("");

    try {
      // This sends data to your backend POST /api/jobs endpoint.
      // Requires admin role (protected by roleMiddleware in backend).
      const payload = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        salary: formData.salary.trim(),
        category: formData.category,
        description: formData.description.trim(),
      };
      
      const response = await api.post('/api/jobs', payload);
      const createdJob = response.data?.job || response.data?.data || response.data;

      setFormData(initialFormData);
      
      // Notify parent component so it can refresh the job list.
      if (onJobAdded) {
        onJobAdded(createdJob);
      }else{
        handleClose();
      }

    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Failed to post job. Please try again.');
        setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl">
        {/* Close button */}
        <button
        type="button"
          onClick={handleClose}
          disabled={loading}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-900"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-slate-900">Post a New Job</h2>
        <p className="mt-2 text-sm text-slate-600">Fill in the job details below</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
              placeholder="e.g., Senior Software Engineer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Company Name</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Your company name"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
                placeholder="e.g., New York, NY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Salary</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
                placeholder="e.g., $100k - $150k"
              />
            </div>
          </div>
          <div>
  <label className="block text-sm font-medium text-slate-700">
    Category
  </label>

  <select
    name="category"
    value={formData.category}
    onChange={handleChange}
    required
    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
  >
    {
      jobCategories.map((category) => (

        <option key={category.value} value={category.value}>{category.title}</option>
      ))
    }
    
  </select>
</div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="6"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Describe the role, responsibilities, and requirements..."
            />
          </div>

          {message && (
            <p
            className={`text-sm ${
              messageType === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50 hover:bg-blue-700"
            >
              {loading ? 'Posting...' : 'Post Job'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobPostModal;
