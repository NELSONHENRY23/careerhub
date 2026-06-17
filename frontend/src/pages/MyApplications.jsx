import { useState, useEffect } from 'react';
import { api } from '../services/api';
import useAuth from '../hooks/useAuth';

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchApplications = async () => {
        if(!token){
            setError("You must be logged in to view applications.");
            setLoading(false);
            return;
        }

      try {
        setLoading(true);
        setError("");

        const response = await api.get('/api/applications/my-applications');
        setApplications(response.data.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

  const handleDeleteApplication = async (applicationId) => {
    const confirmDelete = window.confirm('Are you sure you want to withdraw this application?');

    if(!confirmDelete) return;

    try {
      const response = await api.delete(`/api/applications/${applicationId}`);
      if (response.data.success) {
        alert('Application withdrawn successfully');
        setApplications( (prevApplications) => 
          prevApplications.filter((app) => app._id !== applicationId),
        );
      } else {
        alert('Failed to withdraw application');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while withdrawing the application');
    }
  };

  const getStatusStyle = (status) => {
    switch(status){
        case "accepted":
            return "bg-green-100 text-green-700";
      
          case "rejected":
            return "bg-red-100 text-red-700";
      
          case "reviewed":
            return "bg-blue-100 text-blue-700";
      
          case "pending":
          default:
            return "bg-yellow-100 text-yellow-700";
    }
  }

  const formatStatus = (status) => {
    if(!status) return "Pending";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) return <p className="p-6">Loading applications...</p>;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-[40px] bg-white p-10 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
                My Applications
              </p>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">
                Track your job applications
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                View and manage all your job applications in one place.
              </p>
            </div>
            <div className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm">
              {applications.length} applications
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="mt-10 space-y-6">
          {error ? (
            <div className="rounded-[32px] bg-white p-8 shadow-sm text-red-600">
              {error}
            </div>
          ) : applications.length === 0 ? (
            <div className="rounded-[32px] bg-white p-8 shadow-sm text-slate-600">
              You haven't applied to any jobs yet. Start browsing jobs to apply.
            </div>
          ) : (
            applications.map((application) => (
              <div
                key={application._id}
                className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900">
                      {application.jobId?.title || 'Job Title'}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {application.jobId?.company || 'Company Name'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Applied on{' '}
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                       getStatusStyle(application.status)
                      }`}
                    >
                      {formatStatus(application.status)}
                    </span>
                    <button
                      onClick={() => handleDeleteApplication(application._id)}
                      className="rounded-full border border-red-300 bg-white px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>

                {/* Application Details */}
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold">Location:</span>{' '}
                    {application.jobId?.location || 'N/A'}
                  </p>
                  <p className="mt-2 text-xs text-slate-600">
                    <span className="font-semibold">Salary:</span>{' '}
                    {application.jobId?.salary || 'N/A'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MyApplications;
