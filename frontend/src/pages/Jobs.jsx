import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useJobs from '../hooks/useJobs';
import JobDetailsModal from '../components/JobDetailsModal';
import ApplyJobModal from '../components/ApplyJobModal';
import useAuth from '../hooks/useAuth';
import { api } from '../services/api';
import { jobCategories } from '../data/jobCategories';
import useFeedback from '../hooks/useFeedback';
import FeedbackAlert from '../components/FeedbackAlert';

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [deletedJobIds, setDeletedJobIds] = useState([]);

  const { jobs, error } = useJobs();
  const { user, token } = useAuth();

  const {
    feedback,
    showSuccess,
    showError,
    clearFeedback,
  } = useFeedback(3000);

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => !deletedJobIds.includes(job._id))
      .filter((job) => {
        const searchQuery = query.toLowerCase();
        const searchLocation = location.toLowerCase();

        const titleMatch = job.title?.toLowerCase().includes(searchQuery);
        const companyMatch = job.company?.toLowerCase().includes(searchQuery);

        const locationMatch =
          job.location?.toLowerCase().includes(searchLocation) ||
          job.company?.toLowerCase().includes(searchLocation);

        const categoryMatch = job.category === category;

        return (
          (query ? titleMatch || companyMatch : true) &&
          (location ? locationMatch : true) &&
          (category ? categoryMatch : true)
        );
      });
  }, [jobs, query, location, category, deletedJobIds]);

  const handleSearch = (e) => {
    e.preventDefault();
    clearFeedback();

    const formData = new FormData(e.target);

    const q = formData.get('q')?.toString().trim() || '';
    const locationValue = formData.get('location')?.toString().trim() || '';
    const categoryValue = formData.get('category')?.toString().trim() || '';

    const params = new URLSearchParams();

    if (q) params.set('q', q);
    if (locationValue) params.set('location', locationValue);
    if (categoryValue) params.set('category', categoryValue);

    setSearchParams(params);

    setQuery(q);
    setLocation(locationValue);
    setCategory(categoryValue);
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const handleApplyJob = () => {
    if (!selectedJob) return;

    setShowDetailsModal(false);
    setShowApplyModal(true);
  };

  const handleDeleteJob = async (jobId) => {
    clearFeedback();

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this job?'
    );

    if (!confirmDelete) return;

    if (!token) {
      showError('You must be logged in to delete a job.');
      return;
    }

    try {
      const response = await api.delete(`/api/jobs/${jobId}`);

      if (response.data.success) {
        showSuccess('Job deleted successfully.');

        setDeletedJobIds((prevIds) => [...prevIds, jobId]);

        if (selectedJob?._id === jobId) {
          setSelectedJob(null);
          setShowDetailsModal(false);
          setShowApplyModal(false);
        }
      } else {
        showError(response.data?.message || 'Failed to delete job.');
      }
    } catch (error) {
      console.error(error);

      showError(
        error.response?.data?.message ||
          'An error occurred while deleting the job.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-[40px] bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
                Find Jobs
              </p>

              <h1 className="mt-3 text-3xl font-bold text-slate-900">
                Search and explore job opportunities.
              </h1>
            </div>

            <div className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm">
              {filteredJobs.length} jobs found
            </div>
          </div>

          <FeedbackAlert feedback={feedback} className="mt-6" />

          <form
            onSubmit={handleSearch}
            className="mt-8 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 lg:grid-cols-[1.4fr_1fr_1fr_auto]"
          >
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                Keyword
              </span>

              <input
                type="search"
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search job title or company"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                Location
              </span>

              <input
                type="search"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or zipcode"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                Category
              </span>

              <select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="">All categories</option>

                {jobCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.title}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="rounded-2xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {error ? (
            <div className="rounded-[32px] bg-white p-8 text-red-600 shadow-sm">
              {error}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="rounded-[32px] bg-white p-8 text-slate-600 shadow-sm">
              No jobs match your search. Try broadening the keywords.
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job._id}
                className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-blue-600">
                      {job.location || 'Remote'}
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                      {job.title}
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                      {job.company}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                      {job.type || 'Full time'}
                    </span>

                    <span className="rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-700">
                      {job.category || 'Other'}
                    </span>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-slate-600">
                  {job.description
                    ? `${job.description.slice(0, 140)}...`
                    : 'No description available.'}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => handleViewDetails(job)}
                    className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    View details
                  </button>

                  {user?.role === 'admin' && (
                    <button
                      type="button"
                      onClick={() => handleDeleteJob(job._id)}
                      className="rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}

                  <p className="text-sm text-slate-500">
                    Posted{' '}
                    {job.postedAt
                      ? new Date(job.postedAt).toLocaleDateString()
                      : 'recently'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <JobDetailsModal
          job={selectedJob}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onApply={handleApplyJob}
        />

        <ApplyJobModal
          job={selectedJob}
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
        />
      </div>
    </div>
  );
}

export default Jobs;