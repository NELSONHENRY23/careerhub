import { useState } from 'react';
import JobPostModal from '../components/JobPostModal';

function PostJob() {
  const [showPostModal, setShowPostModal] = useState(false);

  const handleJobAdded = (newJob) => {
    console.log('New job added:', newJob);

    // Close modal after successfully adding job
    setShowPostModal(false);
    
    // Optional: show success message or redirect later
    // alert("Job posted successfully");
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-[40px] bg-white p-10 shadow-xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
              Post a Job
            </p>
            <h1 className="mt-4 text-3xl font-bold text-slate-900">
              Hire top talent for your company
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-sm leading-7 text-slate-600">
              Fill out the job details and post an opening to attract qualified
              candidates.
            </p>
          </div>

          <div className="mt-10">
            <button
            type='button'
              onClick={() => setShowPostModal(true)}
              className="mx-auto block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Create New Job Posting
            </button>
          </div>
        </div>
      </div>

      {/* Job Post Modal */}
      <JobPostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onJobAdded={handleJobAdded}
      />
    </div>
  );
}

export default PostJob;
