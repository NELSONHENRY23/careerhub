import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { jobCategories } from '../data/jobCategories';
import useFeedback from '../hooks/useFeedback';
import FeedbackAlert from '../components/FeedbackAlert';

const emptyEditForm = {
  title: '',
  company: '',
  location: '',
  salary: '',
  category: 'Other',
  type: 'Full-time',
  description: '',
};

function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [loading, setLoading] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(false);

  const adminFeedback = useFeedback(3000);

  useEffect(() => {
    const loadMyJobs = async () => {
      try {
        const res = await api.get('/api/jobs/my-jobs');
        setJobs(res.data.data || []);
      } catch (error) {
        console.error(error);
        adminFeedback.showError(
          error.response?.data?.message || 'Failed to load your jobs.',
        );
      } finally {
        setLoading(false);
      }
    };

    loadMyJobs();
  }, []);

  const loadApplications = async (job) => {
    try {
      setSelectedJob(job);
      setApplications([]);
      setLoadingApplications(true);

      const res = await api.get(`/api/applications/job/${job._id}`);
      setApplications(res.data.data || []);
    } catch (error) {
      console.error(error);
      adminFeedback.showError(
        error.response?.data?.message || 'Failed to load applicants.',
      );
    } finally {
      setLoadingApplications(false);
    }
  };

  const openEdit = (job) => {
    setSelectedJob(job);
    setEditForm({
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      salary: job.salary || '',
      category: job.category || 'Other',
      type: job.type || 'Full-time',
      description: job.description || '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateJob = async (e) => {
    e.preventDefault();

    if (!selectedJob?._id) return;

    try {
      const res = await api.put(`/api/jobs/${selectedJob._id}`, editForm);
      const updatedJob = res.data.data;

      setJobs((prev) =>
        prev.map((job) => (job._id === updatedJob._id ? updatedJob : job)),
      );

      adminFeedback.showSuccess('Job updated successfully.');
    } catch (error) {
      console.error(error);
      adminFeedback.showError(
        error.response?.data?.message || 'Failed to update job.',
      );
    }
  };

  const deleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      'Delete this job? All related applications will also be removed.',
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/api/jobs/${jobId}`);

      setJobs((prev) => prev.filter((job) => job._id !== jobId));

      if (selectedJob?._id === jobId) {
        setSelectedJob(null);
        setApplications([]);
        setEditForm(emptyEditForm);
      }

      adminFeedback.showSuccess('Job deleted successfully.');
    } catch (error) {
      console.error(error);
      adminFeedback.showError(
        error.response?.data?.message || 'Failed to delete job.',
      );
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const res = await api.put(`/api/applications/${applicationId}/status`, {
        status,
      });

      const updatedApplication = res.data.data;

      setApplications((prev) =>
        prev.map((application) =>
          application._id === updatedApplication._id
            ? { ...application, status: updatedApplication.status }
            : application,
        ),
      );

      adminFeedback.showSuccess('Application status updated.');
    } catch (error) {
      console.error(error);
      adminFeedback.showError(
        error.response?.data?.message || 'Failed to update status.',
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-10">
        <p className="text-center text-slate-600">Loading your jobs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[32px] bg-gradient-to-br from-blue-700 to-slate-950 p-8 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-200">
            Admin Panel
          </p>

          <h1 className="mt-3 text-3xl font-bold md:text-4xl">
            Manage Your Posted Jobs
          </h1>

          <p className="mt-2 text-blue-100">
            View your company jobs, update job details, delete openings, and
            manage applicant status.
          </p>
        </div>

        <FeedbackAlert feedback={adminFeedback.feedback} className="mt-6" />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <section className="rounded-[32px] bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold text-slate-900">My Jobs</h2>

            <p className="mt-1 text-sm text-slate-600">
              {jobs.length} jobs posted by you
            </p>

            <div className="mt-6 space-y-4">
              {jobs.length === 0 ? (
                <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  You have not posted any jobs yet.
                </p>
              ) : (
                jobs.map((job) => (
                  <div
                    key={job._id}
                    className="rounded-3xl border border-slate-200 p-5"
                  >
                    <h3 className="font-bold text-slate-900">{job.title}</h3>

                    <p className="mt-1 text-sm text-slate-600">
                      {job.company} • {job.location}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-blue-600">
                      {job.category || 'Other'} • {job.type || 'Full-time'}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => loadApplications(job)}
                        className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        View Applicants
                      </button>

                      <button
                        type="button"
                        onClick={() => openEdit(job)}
                        className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteJob(job._id)}
                        className="rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="space-y-8">
            <div className="rounded-[32px] bg-white p-6 shadow-lg">
              <h2 className="text-xl font-bold text-slate-900">Applicants</h2>

              {!selectedJob ? (
                <p className="mt-4 text-sm text-slate-600">
                  Select a job to view applicants.
                </p>
              ) : loadingApplications ? (
                <p className="mt-4 text-sm text-slate-600">
                  Loading applicants...
                </p>
              ) : applications.length === 0 ? (
                <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  No applicants for {selectedJob.title} yet.
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  {applications.map((application) => (
                    <div
                      key={application._id}
                      className="rounded-3xl border border-slate-200 p-5"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="font-bold text-slate-900">
                            {application.fullName}
                          </h3>

                          <p className="text-sm text-slate-600">
                            {application.email}
                          </p>

                          {application.phone && (
                            <p className="text-sm text-slate-600">
                              {application.phone}
                            </p>
                          )}
                        </div>

                        <select
                          value={application.status || 'pending'}
                          onChange={(e) =>
                            updateApplicationStatus(
                              application._id,
                              e.target.value,
                            )
                          }
                          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>

                      {application.resume && (
                        <a
                          href={application.resume}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                          Open Resume
                        </a>
                      )}

                      {application.coverLetter && (
                        <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                          {application.coverLetter}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedJob && (
              <div className="rounded-[32px] bg-white p-6 shadow-lg">
                <h2 className="text-xl font-bold text-slate-900">
                  Edit Selected Job
                </h2>

                <form onSubmit={updateJob} className="mt-5 space-y-4">
                  <input
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    required
                    placeholder="Job title"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  />

                  <input
                    name="company"
                    value={editForm.company}
                    onChange={handleEditChange}
                    required
                    placeholder="Company"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      name="location"
                      value={editForm.location}
                      onChange={handleEditChange}
                      required
                      placeholder="Location"
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                    />

                    <input
                      name="salary"
                      value={editForm.salary}
                      onChange={handleEditChange}
                      required
                      placeholder="Salary"
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <select
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                    >
                      {jobCategories.map((category) => (
                        <option key={category.title} value={category.title}>
                          {category.title}
                        </option>
                      ))}
                    </select>

                    <select
                      name="type"
                      value={editForm.type}
                      onChange={handleEditChange}
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>

                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    required
                    rows="5"
                    placeholder="Description"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  />

                  <button
                    type="submit"
                    className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Save Job Changes
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminJobs;
