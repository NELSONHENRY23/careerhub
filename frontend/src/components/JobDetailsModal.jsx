// JobDetailsModal displays the full job information in a modal overlay.
// The job data comes from your backend Job model: title, company, location, salary, description.
// Props:
// - job: the job object to display
// - isOpen: whether the modal is open
// - onClose: callback to close the modal
// - onApply: callback to handle "Apply Now" button click (opens ApplyJobModal)
function JobDetailsModal({ job, isOpen, onClose, onApply }) {
  if (!isOpen || !job) return null;

  const formatDate = (dateValue) => {
    if(!dateValue) return "Recently";

    const date = new Date(dateValue);

    if(Number.isNaN(date.getTime())) return "Recently";

    return date.toLocaleDateString();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-900"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Job Header */}
        <div className="mb-6">
          <p className="text-sm text-blue-600">{job.location || 'Remote'}</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {job.title}
          </h2>
          <p className="mt-2 text-lg text-slate-600">{job.company}</p>
        </div>

        {/* Job Meta */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
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
              {formatDate(job.postedAt || job.createAt)}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8 space-y-4">
          <h3 className="text-xl font-semibold text-slate-900">
            About this role
          </h3>
          <p className="text-sm leading-7 text-slate-600">{job.description}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          {onApply && (
            <button
              type="button"
              onClick={onApply}
              className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Apply Now
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobDetailsModal;
