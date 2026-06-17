import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useJob from '../hooks/useJob';
import ApplyJobModal from '../components/ApplyJobModal';
import useAuth from '../hooks/useAuth';
import {api} from '../services/api';

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { job, error } = useJob(id);
  const { user, token } = useAuth();

  const [showApplyModal, setShowApplyModal] = useState(false);

  const handleApplyClick = () => {
    if(!token){
      alert("You must be logged in to apply for this job.");
      navigate("/login");
      return;
    }

    setShowApplyModal(true);
  }

  const handleDeleteJob = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this job?');

    if(!confirmDelete) return;

    if(!token){
      alert("You must be logged in to apply for this job.");
      navigate("/login");
      return;
    }

    try {
     
      const response = await api.delete(`/api/jobs/${id}`);

      if (response.data.success) {
        alert('Job deleted successfully');
        navigate('/jobs');
      } else {
        alert('Failed to delete job');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the job');
    }
  };

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!job && !error) return <p className="p-6">Loading...</p>;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="mx-auto max-w-4xl px-6">
        {/* Back Button */}
        <button
        type='button'
          onClick={() => navigate('/jobs')}
          className="mb-6 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to jobs
        </button>

        {/* Job Header Card */}
        <div className="rounded-[40px] bg-white p-10 shadow-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <p className="text-sm text-blue-600">
                {job.location || 'Remote'}
              </p>
              <h1 className="mt-3 text-4xl font-bold text-slate-900">
                {job.title}
              </h1>
              <p className="mt-2 text-xl text-slate-600">{job.company}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
              {job.type || 'Full-time'}
            </span>
          </div>

          {/* Job Meta */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500 uppercase">Salary</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {job.salary || 'Competitive'}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500 uppercase">Type</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {job.type || 'Full-time'}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500 uppercase">Posted</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {job.postedAt
                  ? new Date(job.postedAt).toLocaleDateString()
                  : 'Recently'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              About this role
            </h2>
            <p className="text-base leading-8 text-slate-600">
              {job.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            {user?.role !== 'admin' && (
              <button
              type='button'
                onClick={handleApplyClick}
                className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Apply Now
              </button>
            )}
            {user?.role === 'admin' && (
              <button
              type='button'
                onClick={handleDeleteJob}
                className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete Job
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyJobModal
        job={job}
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
      />
    </div>
  );
}

export default JobDetails;
